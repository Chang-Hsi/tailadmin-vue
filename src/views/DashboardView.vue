<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex w-full flex-wrap items-center justify-between gap-3">
      <div class="flex flex-col">
        <div class="text-[22px] font-extrabold tracking-wide text-slate-900">
          市場儀表板
        </div>

        <div class="text-[12px] text-slate-500" v-tooltip.top="titleTip">
          資料來源：{{ meta.coinSource }} / {{ meta.fxSource }}
          <span v-if="meta.fetchedAt">・更新：{{ formatTime(meta.fetchedAt) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          :disabled="loading"
          @click="reload"
        >
          {{ loading ? "更新中…" : "重新整理" }}
        </button>
      </div>
    </div>

    <div
      v-if="errorMsg"
      class="flex w-full rounded-lg bg-white p-4 shadow ring-1 ring-slate-200"
    >
      <div class="text-sm text-rose-600">{{ errorMsg }}</div>
    </div>

    <div class="flex w-full flex-wrap gap-3">
      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="text-[12px] font-semibold text-slate-500">總市值（USD）</div>
        <div class="mt-1 text-[22px] font-extrabold text-slate-900">
          {{ formatCompactMoney(kpi.totalMcap) }}
        </div>
      </div>

      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="text-[12px] font-semibold text-slate-500">24 小時總成交量（USD）</div>
        <div class="mt-1 text-[22px] font-extrabold text-slate-900">
          {{ formatCompactMoney(kpi.totalVolume) }}
        </div>
      </div>

      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="text-[12px] font-semibold text-slate-500">
          美元匯率（currency-api）
        </div>
        <div class="mt-1 flex flex-wrap items-end gap-3">
          <div class="flex flex-col">
            <div class="text-[12px] text-slate-500">USD→TWD</div>
            <div class="text-[18px] font-extrabold text-slate-900">
              {{ formatRate(kpi.fx.usdToTwd) }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-[12px] text-slate-500">USD→JPY</div>
            <div class="text-[18px] font-extrabold text-slate-900">
              {{ formatRate(kpi.fx.usdToJpy) }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-[12px] text-slate-500">USD→EUR</div>
            <div class="text-[18px] font-extrabold text-slate-900">
              {{ formatRate(kpi.fx.usdToEur) }}
            </div>
          </div>
        </div>
        <div class="mt-2 text-[12px] text-slate-400">
          資料日期：{{ kpi.fx.date || "-" }}
        </div>
      </div>
    </div>

    <div class="flex w-full flex-col gap-3 lg:flex-row">
      <div
        class="flex min-h-90 w-full flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-slate-800">市佔率（%）</div>
        </div>
        <div ref="domPieEl" class="mt-2 flex h-75 w-full"></div>
      </div>

      <div
        class="flex min-h-90 w-full flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-slate-800">USD→TWD（近 30 筆工作日）</div>
        </div>
        <div ref="fxLineEl" class="mt-2 flex h-75 w-full"></div>
      </div>
    </div>

    <div class="flex w-full flex-col gap-3 lg:flex-row">
      <div
        class="flex min-h-90 w-full flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-slate-800">前 10 大市值（USD）</div>
        </div>
        <div ref="mcapBarEl" class="mt-2 flex h-75 w-full"></div>
      </div>

      <div
        class="flex min-h-90 w-full flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-slate-800">
            前 10 大成交量（24 小時，USD）
          </div>
        </div>
        <div ref="volBarEl" class="mt-2 flex h-75 w-full"></div>
      </div>
    </div>

    <div class="flex w-full flex-col gap-3 lg:flex-row">
      <div
        class="flex w-full flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="text-sm font-bold text-slate-800">漲幅前 10（24 小時）</div>
        <div class="mt-3 flex w-full flex-col">
          <div
            class="flex w-full flex-col overflow-hidden rounded-lg ring-1 ring-slate-200"
          >
            <div
              class="flex w-full bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600"
            >
              <div class="flex w-30">代號</div>
              <div class="flex flex-1">名稱</div>
              <div class="flex w-35 justify-end">價格（USD）</div>
              <div class="flex w-30 justify-end">24 小時</div>
            </div>

            <div
              v-for="row in tables.gainers"
              :key="'g_' + row.id"
              class="flex w-full items-center border-t border-slate-200 px-3 py-2 text-[13px]"
            >
              <div class="flex w-30 font-bold text-slate-800">{{ row.symbol }}</div>
              <div class="flex flex-1 min-w-0 text-slate-700">
                <div class="truncate">{{ row.name }}</div>
              </div>
              <div class="flex w-35 justify-end font-semibold text-slate-800">
                {{ formatMoney(row.price_usd) }}
              </div>
              <div class="flex w-30 justify-end font-bold text-emerald-600">
                {{ formatPercent(row.percent_change_24h) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex w-full flex-1 flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
      >
        <div class="text-sm font-bold text-slate-800">跌幅前 10（24 小時）</div>
        <div class="mt-3 flex w-full flex-col">
          <div
            class="flex w-full flex-col overflow-hidden rounded-lg ring-1 ring-slate-200"
          >
            <div
              class="flex w-full bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600"
            >
              <div class="flex w-30">代號</div>
              <div class="flex flex-1">名稱</div>
              <div class="flex w-35 justify-end">價格（USD）</div>
              <div class="flex w-30 justify-end">24 小時</div>
            </div>

            <div
              v-for="row in tables.losers"
              :key="'l_' + row.id"
              class="flex w-full items-center border-t border-slate-200 px-3 py-2 text-[13px]"
            >
              <div class="flex w-30 font-bold text-slate-800">{{ row.symbol }}</div>
              <div class="flex flex-1 min-w-0 text-slate-700">
                <div class="truncate">{{ row.name }}</div>
              </div>
              <div class="flex w-35 justify-end font-semibold text-slate-800">
                {{ formatMoney(row.price_usd) }}
              </div>
              <div class="flex w-30 justify-end font-bold text-rose-600">
                {{ formatPercent(row.percent_change_24h) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex w-full items-center justify-center py-10 text-sm text-slate-500"
    >
      讀取資料中…
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { onBeforeUnmount, onMounted, reactive, ref, nextTick } from "vue";
import { getDashboardData } from "@/apis/dashboard";

const titleTip = "這頁會即時彙整市場總市值、成交量、主要幣種市佔率、排行與美元匯率走勢。";

const loading = ref(false);
const errorMsg = ref("");

const kpi = reactive({
  totalMcap: 0,
  totalVolume: 0,
  dominance: { btcD: 0, ethD: 0, restD: 0 },
  fx: { base: "USD", date: "", usdToTwd: null, usdToJpy: null, usdToEur: null },
});

const tables = reactive({
  gainers: [],
  losers: [],
  topMcap: [],
  topVolume: [],
});

const chartsData = reactive({
  dominancePie: [],
  topMcapBar: [],
  topVolumeBar: [],
  fxUsdTwdLine: { dates: [], values: [] },
});

const meta = reactive({
  fetchedAt: 0,
  coinSource: "",
  fxSource: "",
});

const domPieEl = ref(null);
const fxLineEl = ref(null);
const mcapBarEl = ref(null);
const volBarEl = ref(null);

let domPieChart = null;
let fxLineChart = null;
let mcapBarChart = null;
let volBarChart = null;

function formatCompactMoney(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "-";
  const abs = Math.abs(v);
  if (abs >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function formatPercent(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function formatRate(v) {
  if (v === null || v === undefined) return "-";
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(4);
}

function formatTime(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${y}/${m}/${day} ${hh}:${mm}:${ss}`;
}

function safeDispose(chart) {
  if (!chart) return;
  try {
    chart.dispose();
  } catch (_) {}
}

function renderCharts() {
  if (domPieEl.value) {
    domPieChart = domPieChart || echarts.init(domPieEl.value);
    domPieChart.setOption({
      tooltip: { trigger: "item" },
      legend: { top: 8, left: "center" },
      series: [
        {
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: true,
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
          labelLine: { show: false },
          data: chartsData.dominancePie,
        },
      ],
    });
  }

  if (fxLineEl.value) {
    fxLineChart = fxLineChart || echarts.init(fxLineEl.value);
    fxLineChart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 36, right: 18, top: 30, bottom: 28, containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartsData.fxUsdTwdLine.dates,
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "line",
          smooth: true,
          data: chartsData.fxUsdTwdLine.values,
        },
      ],
    });
  }

  if (mcapBarEl.value) {
    mcapBarChart = mcapBarChart || echarts.init(mcapBarEl.value);
    mcapBarChart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 36, right: 18, top: 30, bottom: 28, containLabel: true },
      xAxis: { type: "category", data: chartsData.topMcapBar.map((x) => x.name) },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: chartsData.topMcapBar.map((x) => x.value),
        },
      ],
    });
  }

  if (volBarEl.value) {
    volBarChart = volBarChart || echarts.init(volBarEl.value);
    volBarChart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 36, right: 18, top: 30, bottom: 28, containLabel: true },
      xAxis: { type: "category", data: chartsData.topVolumeBar.map((x) => x.name) },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: chartsData.topVolumeBar.map((x) => x.value),
        },
      ],
    });
  }
}

function resizeCharts() {
  domPieChart && domPieChart.resize();
  fxLineChart && fxLineChart.resize();
  mcapBarChart && mcapBarChart.resize();
  volBarChart && volBarChart.resize();
}

async function load() {
  loading.value = true;
  errorMsg.value = "";

  try {
    const res = await getDashboardData();

    kpi.totalMcap = res?.kpi?.totalMcap || 0;
    kpi.totalVolume = res?.kpi?.totalVolume || 0;
    kpi.dominance = res?.kpi?.dominance || { btcD: 0, ethD: 0, restD: 0 };
    kpi.fx = res?.kpi?.fx || {
      base: "USD",
      date: "",
      usdToTwd: null,
      usdToJpy: null,
      usdToEur: null,
    };

    tables.gainers = res?.tables?.gainers || [];
    tables.losers = res?.tables?.losers || [];
    tables.topMcap = res?.tables?.topMcap || [];
    tables.topVolume = res?.tables?.topVolume || [];

    chartsData.dominancePie = res?.charts?.dominancePie || [];
    chartsData.topMcapBar = res?.charts?.topMcapBar || [];
    chartsData.topVolumeBar = res?.charts?.topVolumeBar || [];
    chartsData.fxUsdTwdLine = res?.charts?.fxUsdTwdLine || { dates: [], values: [] };

    meta.fetchedAt = res?.meta?.fetchedAt || Date.now();
    meta.coinSource = res?.meta?.coinSource || "";
    meta.fxSource = res?.meta?.fxSource || "";

    await nextTick();
    renderCharts();
    resizeCharts();
  } catch (err) {
    console.error(err);
    errorMsg.value = err?.message ? `讀取失敗：${err.message}` : "讀取失敗：未知錯誤";
  } finally {
    loading.value = false;
  }
}

function reload() {
  safeDispose(domPieChart);
  safeDispose(fxLineChart);
  safeDispose(mcapBarChart);
  safeDispose(volBarChart);

  domPieChart = null;
  fxLineChart = null;
  mcapBarChart = null;
  volBarChart = null;

  load();
}

let ro = null;

onMounted(async () => {
  await load();

  const onResize = () => resizeCharts();
  window.addEventListener("resize", onResize);

  const root = document.documentElement;
  ro = new ResizeObserver(() => resizeCharts());
  ro.observe(root);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });
});

onBeforeUnmount(() => {
  ro && ro.disconnect();
  safeDispose(domPieChart);
  safeDispose(fxLineChart);
  safeDispose(mcapBarChart);
  safeDispose(volBarChart);
});
</script>
