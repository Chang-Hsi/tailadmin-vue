// src/apis/marketRequest.js
// 前端-only fetch 工具（不依賴你原本 axios/request.js）

export async function getJSON(url, options = {}) {
  const timeout = Number(options.timeout || 20000);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      err.url = url;
      err.body = text;
      throw err;
    }

    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function safeGetJSON(url, fallback) {
  try {
    return await getJSON(url);
  } catch (e) {
    return fallback;
  }
}
