// src/apis/dashboard.js
import { getJSON, safeGetJSON } from "@/apis/marketRequest";

// =========================
// 資料來源
// =========================
const COINLORE_GLOBAL = "https://api.coinlore.net/api/global/";
const COINLORE_TICKERS = "https://api.coinlore.net/api/tickers/?start=0&limit=100";

// ✅ currency-api（jsDelivr CDN）
// - 支援 latest
// - 支援指定日期（但不是每天都有版本，所以會遇到 404）
// - 你目前遇到 pages.dev 的 CORS 問題，所以這裡「不要再用 fallback」
function fxPrimaryUrl(date, base) {
  // date: "latest" or "YYYY-MM-DD"
  // base: "usd"
  return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${base}.json`;
}

// =========================
// utils
// =========================
function toNumber(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function fmtYmd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 取最近 n 個「工作日」日期（跳過六日）
function lastNWeekdays(n) {
  const out = [];
  const d = new Date();
  while (out.length < n) {
    const dow = d.getDay(); // 0=Sun 6=Sat
    if (dow !== 0 && dow !== 6) out.push(fmtYmd(d));
    d.setDate(d.getDate() - 1);
  }
  return out.reverse();
}

// 只打 jsDelivr（避免 pages.dev CORS）
// - 若該日版本不存在，safeGetJSON 會回 null
async function getFxUsdOn(dateYmdOrLatest) {
  const date = dateYmdOrLatest || "latest";
  const url = fxPrimaryUrl(date, "usd");
  const data = await safeGetJSON(url, null);
  return data;
}

export async function getDashboardData() {
  const fetchedAt = Date.now();

  // =========================
  // 1) 幣市 global
  // =========================
  let totalMcap = 0;
  let totalVolume = 0;

  try {
    const globalArr = await getJSON(COINLORE_GLOBAL);
    const g = Array.isArray(globalArr) ? globalArr[0] : null;

    totalMcap = toNumber(g?.total_mcap, 0);
    totalVolume = toNumber(g?.total_volume, 0);
  } catch (e) {
    console.warn("[Dashboard] Coinlore global 讀取失敗", {
      message: e?.message,
      status: e?.status,
      url: e?.url || COINLORE_GLOBAL,
    });
  }

  // =========================
  // 2) 幣列表（top100）
  // =========================
  let normalized = [];
  try {
    const tickers = await getJSON(COINLORE_TICKERS);
    const list = Array.isArray(tickers?.data) ? tickers.data : [];

    normalized = list.map((x) => ({
      id: String(x?.id ?? ""),
      symbol: String(x?.symbol ?? ""),
      name: String(x?.name ?? ""),
      rank: toNumber(x?.rank, 0),
      price_usd: toNumber(x?.price_usd, 0),
      market_cap_usd: toNumber(x?.market_cap_usd, 0),
      volume24: toNumber(x?.volume24, 0),
      percent_change_24h: toNumber(x?.percent_change_24h, 0),
    }));
  } catch (e) {
    console.warn("[Dashboard] Coinlore tickers 讀取失敗", {
      message: e?.message,
      status: e?.status,
      url: e?.url || COINLORE_TICKERS,
    });
  }

  // =========================
  // 3) Dominance（用 totalMcap 當分母）
  // =========================
  const btc = normalized.find((x) => x.symbol === "BTC");
  const eth = normalized.find((x) => x.symbol === "ETH");
  const btcM = toNumber(btc?.market_cap_usd, 0);
  const ethM = toNumber(eth?.market_cap_usd, 0);

  const denom = totalMcap > 0 ? totalMcap : btcM + ethM;
  const btcD = denom > 0 ? (btcM / denom) * 100 : 0;
  const ethD = denom > 0 ? (ethM / denom) * 100 : 0;
  const restD = Math.max(0, 100 - btcD - ethD);

  // =========================
  // 4) Top 10 市值/成交量
  // =========================
  const topMcap = [...normalized]
    .sort((a, b) => b.market_cap_usd - a.market_cap_usd)
    .slice(0, 10);

  const topVolume = [...normalized].sort((a, b) => b.volume24 - a.volume24).slice(0, 10);

  // =========================
  // 5) Gainers / Losers（24h）
  // =========================
  const gainers = [...normalized]
    .filter((x) => x.percent_change_24h > 0)
    .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
    .slice(0, 10);

  const losers = [...normalized]
    .filter((x) => x.percent_change_24h < 0)
    .sort((a, b) => a.percent_change_24h - b.percent_change_24h)
    .slice(0, 10);

  // =========================
  // 6) FX：latest + 近 30 筆工作日 USD→TWD
  //    ✅ 任何單日失敗都「跳過」，不要讓整包 throw
  // =========================
  let fxDate = "";
  let usdToTwd = null;
  let usdToJpy = null;
  let usdToEur = null;

  try {
    const fxLatest = await getFxUsdOn("latest");
    fxDate = String(fxLatest?.date || "");

    const usdObj = fxLatest?.usd || {};
    const twd = toNumber(usdObj?.twd, NaN);
    const jpy = toNumber(usdObj?.jpy, NaN);
    const eur = toNumber(usdObj?.eur, NaN);

    usdToTwd = Number.isFinite(twd) ? twd : null;
    usdToJpy = Number.isFinite(jpy) ? jpy : null;
    usdToEur = Number.isFinite(eur) ? eur : null;

    if (!fxLatest) {
      console.warn("[FX] latest 讀取失敗（可能網路或 CDN 問題）", {
        url: fxPrimaryUrl("latest", "usd"),
      });
    }
  } catch (e) {
    console.warn("[FX] latest 讀取失敗（不影響整包）", {
      message: e?.message,
      status: e?.status,
      url: e?.url,
    });
  }

  const fxLineDates = [];
  const fxLineValues = [];

  const dates = lastNWeekdays(30);

  for (const d of dates) {
    try {
      const data = await getFxUsdOn(d);

      // 該日期版本不存在 -> data 會是 null（safeGetJSON）
      if (!data) {
        console.warn("[FX] 單日版本不存在（404）跳過", { date: d, url: fxPrimaryUrl(d, "usd") });
        continue;
      }

      const usdObj = data?.usd || {};
      const v = toNumber(usdObj?.twd, NaN);

      if (Number.isFinite(v)) {
        fxLineDates.push(d);
        fxLineValues.push(v);
      } else {
        console.warn("[FX] 單日無 TWD 數值，跳過", { date: d, twd: usdObj?.twd });
      }
    } catch (e) {
      console.warn("[FX] 單日抓取失敗（跳過，不中斷整包）", {
        date: d,
        message: e?.message,
        status: e?.status,
        url: e?.url || fxPrimaryUrl(d, "usd"),
      });
    }
  }

  // =========================
  // 回傳給 DashboardView.vue
  // =========================
  return {
    meta: {
      fetchedAt,
      coinSource: "Coinlore",
      fxSource: "currency-api (fawazahmed0 via jsDelivr)",
    },
    kpi: {
      totalMcap,
      totalVolume,
      dominance: { btcD, ethD, restD },
      fx: {
        base: "USD",
        date: fxDate,
        usdToTwd,
        usdToJpy,
        usdToEur,
      },
    },
    tables: {
      gainers,
      losers,
      topMcap,
      topVolume,
    },
    charts: {
      dominancePie: [
        { name: "BTC", value: Number(btcD.toFixed(2)) },
        { name: "ETH", value: Number(ethD.toFixed(2)) },
        { name: "Others", value: Number(restD.toFixed(2)) },
      ],
      topMcapBar: topMcap.map((x) => ({
        name: x.symbol,
        value: x.market_cap_usd,
      })),
      topVolumeBar: topVolume.map((x) => ({
        name: x.symbol,
        value: x.volume24,
      })),
      fxUsdTwdLine: {
        dates: fxLineDates,
        values: fxLineValues,
      },
    },
  };
}
