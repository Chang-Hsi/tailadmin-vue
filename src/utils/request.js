// src/utils/request.js
import axios from "axios";
import { ElNotification } from "element-plus";
import router from "@/router";
import { requestLogout } from "@/api/login";

const apiBaseUrl = import.meta.env.VITE_APP_BASE_API;

// 防止多次重複跳轉的標誌
let isRedirecting = false;

const service = axios.create({
  baseURL: apiBaseUrl,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 取得目前 localStorage token（包一層避免重複寫）
function getCurrentToken() {
  return localStorage.getItem("adminAccessToken") || "";
}

// 判斷這個 401 是否「舊 token」造成
function isStaleAuthError(error) {
  try {
    const usedAuth = error?.config?.headers?.Authorization || "";
    const usedToken = usedAuth.startsWith("Bearer ")
      ? usedAuth.slice(7)
      : usedAuth;
    const currentToken = getCurrentToken();
    // 當請求發出時夾帶的 token 和目前 localStorage 內的不一樣，就視為「舊請求」
    return !!usedToken && !!currentToken && usedToken !== currentToken;
  } catch (_) {
    return false;
  }
}

// 請求攔截器
service.interceptors.request.use(
  (config) => {
    if (config.params) {
      config.params = Object.fromEntries(
        Object.entries(config.params).filter(([_, v]) => v !== "" && v != null)
      );
    }

    // 每次請求都即時從 localStorage 取 token，避免用到舊值
    const accessToken = getCurrentToken();
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => {
    console.log("請求錯誤:", error);
    return Promise.reject(error);
  }
);

// 響應攔截器
service.interceptors.response.use(
  (response) => {
    // 下載檔案情境：回傳整個 response 以保留 headers
    if (response.config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  (error) => {
    // 無回應（網路中斷等）
    if (!error.response) {
      if (error.message?.includes("Unsupported protocol wss:")) {
        ElNotification({
          title: "協議錯誤",
          message: "不支持的協議：wss，請檢查配置。",
          type: "error",
          duration: 5000,
        });
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url || "";

    // 401：分情境處理
    if (status === 401) {
      // 登出 API 自己的 401 不要再觸發登出流程（避免回圈）
      if (url.includes("/logout")) {
        return Promise.reject(error);
      }
      // 舊 token 的 401：忽略全域登出，不要動當前登入
      if (isStaleAuthError(error)) {
        // 直接丟回去讓呼叫端自己決定重試或提示，不要清 token
        return Promise.reject(error);
      }
      // 確認是「當前 token」的 401 才做全域處理
      handleUnauthorized();
      return Promise.reject(error);
    }

    if (status === 500) {
      ElNotification({
        title: "伺服器錯誤",
        message: "內部伺服器錯誤，請重試。",
        type: "error",
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * 處理未授權錯誤 (401)
 */
async function handleUnauthorized() {
  // 若已在處理導向，就不要重覆觸發
  if (isRedirecting) return;
  isRedirecting = true;

  ElNotification({
    title: "未授權",
    message: "登入已過期，請重新登入。",
    type: "warning",
    duration: 5000,
  });

  // 嘗試通知後端登出（忽略錯誤）
  try {
    const rivName = localStorage.getItem("rivName");
    await requestLogout({ rivName });
  } catch (err) {
    console.error("呼叫登出 API 發生錯誤:", err);
  }

  // 清本地登入狀態並導回登入頁
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("rivName");

  // 使用 replace 避免歷史紀錄殘留
  router
    .replace("/login")
    .catch(() => {})
    .finally(() => {
      // 無論如何都要復位旗標，避免後續無法再觸發
      isRedirecting = false;
    });
}

export default service;
