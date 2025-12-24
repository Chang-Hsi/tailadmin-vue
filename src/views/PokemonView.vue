<!-- src/views/PokemonView.vue -->
<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex w-full items-center justify-between gap-3">
      <div class="flex flex-col">
        <div
          class="text-[22px] font-extrabold tracking-wide text-slate-900"
          v-tooltip.top="{
            value:
              '這頁會顯示寶可夢的基本資料、屬性、能力、種族值圖表、招式清單、圖片與叫聲。',
            class: 'text-sm',
          }"
        >
          寶可夢資料卡
        </div>
        <div class="mt-1 text-sm text-slate-500">
          <span v-if="vm">#{{ displayId }} ・{{ displayName }}</span>
          <span v-else>—</span>
          <span v-if="meta.fetchedAt" class="ml-2"
            >・更新：{{ formatTime(meta.fetchedAt) }}</span
          >
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button
          size="small"
          severity="secondary"
          :loading="loading"
          @click="reload"
          v-tooltip.bottom="{ value: '重新抓取並重繪圖表', class: 'text-sm' }"
        >
          重新整理
        </Button>
      </div>
    </div>

    <div
      v-if="errorMsg"
      class="flex w-full rounded-lg bg-white p-4 shadow ring-1 ring-slate-200"
    >
      <div class="text-sm text-rose-600">{{ errorMsg }}</div>
    </div>

    <div
      v-if="loading"
      class="flex w-full rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200"
    >
      <div class="flex w-full items-center justify-center py-10 text-sm text-slate-500">
        讀取資料中…
      </div>
    </div>

    <div v-else-if="vm" class="flex w-full flex-col gap-4">
      <div
        class="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow ring-1 ring-slate-200"
      >
        <div class="relative flex h-24 w-full items-end">
          <div class="absolute left-5 top-5 flex items-center gap-2">
            <Tag value="PokéAPI" severity="secondary" rounded />
            <Tag :value="'#' + displayId" severity="secondary" rounded />
          </div>
        </div>

        <div class="flex w-full flex-col gap-4 p-5">
          <div
            class="-mt-12 flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          >
            <div class="flex items-end gap-4">
              <div
                class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
              >
                <img
                  v-if="vm.sprite"
                  :src="vm.sprite"
                  alt=""
                  class="h-24 w-24 object-contain"
                  loading="lazy"
                />
                <div v-else class="text-[12px] text-slate-400">無圖片</div>
              </div>

              <div class="flex flex-col pb-1">
                <div class="text-xl font-extrabold text-slate-900 lg:text-2xl">
                  {{ displayName }}
                </div>

                <div class="mt-2 flex flex-wrap gap-2">
                  <Chip
                    v-for="t in vm.types"
                    :key="t.name"
                    :label="toZhType(t.name)"
                    class="bg-slate-100 text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <div
                class="flex items-center rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
              >
                <div class="text-[12px] font-semibold text-slate-500">身高</div>
                <div class="ml-2 text-sm font-extrabold text-slate-900">
                  {{ vm.height }}
                </div>
              </div>

              <div
                class="flex items-center rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
              >
                <div class="text-[12px] font-semibold text-slate-500">體重</div>
                <div class="ml-2 text-sm font-extrabold text-slate-900">
                  {{ vm.weight }}
                </div>
              </div>

              <div
                class="flex items-center rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
              >
                <div class="text-[12px] font-semibold text-slate-500">基礎經驗</div>
                <div class="ml-2 text-sm font-extrabold text-slate-900">
                  {{ vm.base_experience ?? "-" }}
                </div>
              </div>

              <div
                class="flex items-center rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
              >
                <div class="text-[12px] font-semibold text-slate-500">招式數</div>
                <div class="ml-2 text-sm font-extrabold text-slate-900">
                  {{ vm.movesCount }}
                </div>
              </div>
            </div>
          </div>

          <TabView v-model:activeIndex="activeTabIndex" class="w-full">
            <TabPanel header="概覽">
              <div class="flex w-full flex-col gap-4 lg:flex-row">
                <div class="flex min-w-0 flex-1 flex-col gap-4">
                  <div
                    class="flex w-full flex-col rounded-xl bg-white ring-1 ring-slate-200"
                  >
                    <div
                      class="flex items-center justify-between border-b border-slate-100 px-4 py-3"
                    >
                      <div class="text-sm font-extrabold text-slate-900">能力</div>
                      <div class="text-[12px] text-slate-500">含隱藏能力標示</div>
                    </div>

                    <div class="flex w-full flex-col gap-3 p-4">
                      <div class="flex flex-wrap gap-2">
                        <div
                          v-for="a in vm.abilities"
                          :key="a.name + '_' + a.slot"
                          class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
                        >
                          <div class="text-sm font-extrabold text-slate-900">
                            {{ toTitle(a.name) }}
                          </div>
                          <Tag
                            v-if="a.is_hidden"
                            value="隱藏"
                            severity="warning"
                            rounded
                          />
                          <div class="text-[12px] text-slate-500">槽位 {{ a.slot }}</div>
                        </div>

                        <div
                          v-if="vm.abilities.length === 0"
                          class="text-[12px] text-slate-400"
                        >
                          -
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="flex w-full flex-col rounded-xl bg-white ring-1 ring-slate-200"
                  >
                    <div class="border-b border-slate-100 px-4 py-3">
                      <div class="text-sm font-extrabold text-slate-900">快速資訊</div>
                    </div>

                    <div class="flex w-full flex-col gap-3 p-4">
                      <div class="flex w-full flex-wrap gap-3">
                        <div
                          class="flex items-center rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
                        >
                          <div class="text-[12px] font-semibold text-slate-500">編號</div>
                          <div class="ml-2 text-sm font-extrabold text-slate-900">
                            #{{ displayId }}
                          </div>
                        </div>

                        <div
                          class="flex items-center rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
                        >
                          <div class="text-[12px] font-semibold text-slate-500">名稱</div>
                          <div class="ml-2 text-sm font-extrabold text-slate-900">
                            {{ displayName }}
                          </div>
                        </div>

                        <div
                          class="flex items-center rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
                        >
                          <div class="text-[12px] font-semibold text-slate-500">
                            種族值總和
                          </div>
                          <div class="ml-2 text-sm font-extrabold text-slate-900">
                            {{ vm.stats.total }}
                          </div>
                        </div>
                      </div>

                      <div class="flex w-full flex-col gap-2">
                        <div class="text-[12px] font-semibold text-slate-600">叫聲</div>
                        <div class="flex flex-wrap items-center gap-2">
                          <Button
                            size="small"
                            severity="secondary"
                            :disabled="!vm.cries.latest"
                            @click="openCry('latest')"
                          >
                            播放最新
                          </Button>

                          <Button
                            size="small"
                            severity="secondary"
                            :disabled="!vm.cries.legacy"
                            @click="openCry('legacy')"
                          >
                            播放舊版
                          </Button>

                          <div class="text-[12px] text-slate-500">
                            若瀏覽器擋音訊，請先點一下頁面再試
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex w-full shrink-0 flex-col gap-4 lg:w-105">
                  <div
                    class="flex w-full flex-col rounded-xl bg-white ring-1 ring-slate-200"
                  >
                    <div class="border-b border-slate-100 px-4 py-3">
                      <div class="text-sm font-extrabold text-slate-900">
                        種族值雷達圖
                      </div>
                    </div>
                    <div class="flex w-full p-4">
                      <div ref="radarEl" class="flex h-70 w-full"></div>
                    </div>
                  </div>

                  <div
                    class="flex w-full flex-col rounded-xl bg-white ring-1 ring-slate-200"
                  >
                    <div class="border-b border-slate-100 px-4 py-3">
                      <div class="text-sm font-extrabold text-slate-900">
                        種族值長條圖
                      </div>
                    </div>
                    <div class="flex w-full p-4">
                      <div ref="barEl" class="flex h-70 w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="種族值">
              <div
                class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div class="flex w-full flex-wrap gap-3">
                  <div
                    class="flex flex-1 flex-col rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 min-w-55"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-[12px] font-semibold text-slate-600">HP</div>
                      <div class="text-[12px] font-semibold text-slate-500">
                        {{ statPct(vm.stats.hp) }}%
                      </div>
                    </div>
                    <div ref="hpGaugeEl" class="mt-2 h-35 w-full"></div>
                  </div>

                  <div
                    class="flex flex-1 flex-col rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 min-w-55"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-[12px] font-semibold text-slate-600">攻擊</div>
                      <div class="text-[12px] font-semibold text-slate-500">
                        {{ statPct(vm.stats.atk) }}%
                      </div>
                    </div>
                    <div ref="atkGaugeEl" class="mt-2 h-35 w-full"></div>
                  </div>

                  <div
                    class="flex flex-1 flex-col rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 min-w-55"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-[12px] font-semibold text-slate-600">防禦</div>
                      <div class="text-[12px] font-semibold text-slate-500">
                        {{ statPct(vm.stats.def) }}%
                      </div>
                    </div>
                    <div ref="defGaugeEl" class="mt-2 h-35 w-full"></div>
                  </div>

                  <div
                    class="flex flex-1 flex-col rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 min-w-55"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-[12px] font-semibold text-slate-600">特攻</div>
                      <div class="text-[12px] font-semibold text-slate-500">
                        {{ statPct(vm.stats.spAtk) }}%
                      </div>
                    </div>
                    <div ref="spAtkGaugeEl" class="mt-2 h-35 w-full"></div>
                  </div>

                  <div
                    class="flex flex-1 flex-col rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 min-w-55"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-[12px] font-semibold text-slate-600">特防</div>
                      <div class="text-[12px] font-semibold text-slate-500">
                        {{ statPct(vm.stats.spDef) }}%
                      </div>
                    </div>
                    <div ref="spDefGaugeEl" class="mt-2 h-35 w-full"></div>
                  </div>
                </div>

                <div
                  class="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                >
                  <div class="text-2xl font-semibold text-slate-700">
                    種族值：{{ animatedTotal }}
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="招式">
              <div
                class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div class="flex w-full flex-wrap items-end gap-3">
                  <div class="flex w-full max-w-90 flex-col gap-1">
                    <div class="text-[12px] font-semibold text-slate-600">搜尋招式</div>
                    <InputText
                      v-model="movesQuery"
                      class="w-full"
                      placeholder="例如：razor / blast"
                    />
                  </div>

                  <div class="flex w-full max-w-65 flex-col gap-1">
                    <div class="text-[12px] font-semibold text-slate-600">學習方式</div>
                    <Dropdown
                      v-model="movesMethod"
                      :options="movesMethodOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="全部"
                      class="w-full"
                    />
                  </div>

                  <div
                    class="flex flex-1 items-center justify-end text-[12px] text-slate-500"
                  >
                    顯示 {{ filteredMoves.length }} /
                    {{ vm.movesCount }} 筆（為了效能，列表預設只取前 200 筆）
                  </div>
                </div>

                <div
                  class="flex w-full flex-col overflow-hidden rounded-xl ring-1 ring-slate-200"
                >
                  <div
                    class="flex w-full bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600"
                  >
                    <div class="flex w-8/12">招式</div>
                    <div class="flex w-4/12 justify-end">學習方式</div>
                  </div>

                  <div
                    v-for="m in filteredMoves"
                    :key="m.name"
                    class="flex w-full items-center border-t border-slate-200 px-3 py-2 text-[13px]"
                  >
                    <div class="flex w-8/12 min-w-0">
                      <div class="truncate font-bold text-slate-800">
                        {{ toTitle(m.name) }}
                      </div>
                    </div>

                    <div class="flex w-4/12 flex-wrap justify-end gap-2">
                      <Tag
                        v-for="mm in m.methods"
                        :key="mm"
                        :value="toZhMoveMethod(mm)"
                        severity="secondary"
                        rounded
                      />
                    </div>
                  </div>

                  <div
                    v-if="filteredMoves.length === 0"
                    class="flex w-full items-center justify-center py-10 text-sm text-slate-500"
                  >
                    沒有符合條件的招式
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="圖片">
              <div
                class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div class="flex w-full flex-wrap gap-3">
                  <div
                    v-for="img in vm.gallery"
                    :key="img.key"
                    class="flex w-full max-w-90 flex-1 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
                  >
                    <div
                      class="flex items-center justify-between border-b border-slate-100 px-4 py-3"
                    >
                      <div class="text-sm font-extrabold text-slate-900">
                        {{ img.label }}
                      </div>
                      <Tag
                        v-if="img.kind"
                        :value="img.kind"
                        severity="secondary"
                        rounded
                      />
                    </div>

                    <div class="flex w-full items-center justify-center bg-slate-50 p-4">
                      <img
                        v-if="img.url"
                        :src="img.url"
                        alt=""
                        class="h-55 w-full object-contain"
                        loading="lazy"
                      />
                      <div v-else class="py-10 text-[12px] text-slate-400">無圖片</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>

    <div v-else class="flex w-full rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div class="flex w-full items-center justify-center py-10 text-sm text-slate-500">
        查無資料
      </div>
    </div>

    <Dialog
      v-model:visible="cryDialogVisible"
      modal
      header="寶可夢叫聲"
      :style="{ width: '420px' }"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="text-sm text-slate-700">
          {{ cryDialogLabel }}
        </div>
        <audio v-if="cryUrl" controls :src="cryUrl" class="w-full"></audio>
        <div v-else class="text-sm text-slate-500">沒有可播放的音訊</div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import Tooltip from "primevue/tooltip";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Tag from "primevue/tag";
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import { getPokemonDetail } from "@/apis/pokemon";

const vTooltip = Tooltip;

const route = useRoute();

const loading = ref(false);
const errorMsg = ref("");

const meta = reactive({
  fetchedAt: 0,
});

const vm = ref(null);

const radarEl = ref(null);
const barEl = ref(null);

let radarChart = null;
let barChart = null;

const hpGaugeEl = ref(null);
const atkGaugeEl = ref(null);
const defGaugeEl = ref(null);
const spAtkGaugeEl = ref(null);
const spDefGaugeEl = ref(null);
const spdGaugeEl = ref(null);

let hpGaugeChart = null;
let atkGaugeChart = null;
let defGaugeChart = null;
let spAtkGaugeChart = null;
let spDefGaugeChart = null;
let spdGaugeChart = null;

const movesQuery = ref("");
const movesMethod = ref("");

const movesMethodOptions = [
  { label: "全部", value: "" },
  { label: "升級學會", value: "level-up" },
  { label: "機器學會", value: "machine" },
  { label: "遺傳學會", value: "egg" },
  { label: "教學學會", value: "tutor" },
  { label: "其他", value: "other" },
];

const cryDialogVisible = ref(false);
const cryUrl = ref("");
const cryDialogLabel = ref("");

// ✅ 新增：控制目前 Tab（0=概覽, 1=種族值, 2=招式, 3=圖片）
// 你 template 的 TabView 需要加：v-model:activeIndex="activeTabIndex"
const activeTabIndex = ref(0);

// ✅ 新增：避免同一隻寶可夢在切回種族值時重播（想每次切都播就把這個移除掉）
const hasPlayedTotalOnThisVm = ref(false);

// ✅ 畫面上要顯示的種族值總和（用它來做跑分）
const animatedTotal = ref(0);

// ✅ 控制 requestAnimationFrame，避免重複動畫疊加
let totalRafId = 0;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ✅ 從 0 飛速增長到目標 total
function animateTotalTo(target, options = {}) {
  const to = Math.max(0, Number(target) || 0);

  const duration = Number(options.duration) || 650;
  const startValue = 0;

  // 停掉上一段動畫
  if (totalRafId) cancelAnimationFrame(totalRafId);
  animatedTotal.value = startValue;

  if (to === 0) return;

  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(t);

    const current = Math.round(startValue + (to - startValue) * eased);
    animatedTotal.value = current;

    if (t < 1) {
      totalRafId = requestAnimationFrame(tick);
    } else {
      animatedTotal.value = to;
      totalRafId = 0;
    }
  };

  totalRafId = requestAnimationFrame(tick);
}

let ro = null;

function normalizeName(v) {
  return String(v || "")
    .trim()
    .toLowerCase();
}

function toTitle(s) {
  const v = String(s || "");
  if (!v) return "";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function toNumber(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function toZhType(t) {
  const m = {
    normal: "一般",
    fire: "火",
    water: "水",
    electric: "電",
    grass: "草",
    ice: "冰",
    fighting: "格鬥",
    poison: "毒",
    ground: "地面",
    flying: "飛行",
    psychic: "超能力",
    bug: "蟲",
    rock: "岩石",
    ghost: "幽靈",
    dragon: "龍",
    dark: "惡",
    steel: "鋼",
    fairy: "妖精",
  };
  const key = normalizeName(t);
  return m[key] || toTitle(key);
}

function toZhMoveMethod(m) {
  const key = normalizeName(m);
  if (key === "level-up") return "升級";
  if (key === "machine") return "機器";
  if (key === "egg") return "遺傳";
  if (key === "tutor") return "教學";
  return "其他";
}

function formatTime(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${y}/${m}/${day} ${hh}:${mm}:${ss}`;
}

function statPct(v, max = 200) {
  const n = toNumber(v, 0);
  return Math.max(0, Math.min(100, Math.round((n / max) * 100)));
}

function buildGaugeOption(title, value0, max = 200) {
  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 900,
    tooltip: {
      formatter: (p) => {
        const v = toNumber(p?.value, 0);
        const pct = statPct(v, max);
        return `${title}：${v}（${pct}%）`;
      },
    },
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max,
        radius: "90%",
        pointer: { show: false },
        progress: {
          show: true,
          roundCap: true,
          width: 12,
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, "rgba(148,163,184,.35)"]],
          },
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, 0],
          fontSize: 26,
          fontWeight: 800,
          color: "#0f172a",
          formatter: (v) => `${Math.round(v)}`,
        },
        data: [{ value: value0 }],
      },
    ],
  };
}

function ensureGauge(el, currentChart) {
  if (!el) return null;
  return echarts.getInstanceByDom(el) || currentChart || echarts.init(el);
}

function renderStatGauges() {
  if (!vm.value) return;

  const max = 200;

  hpGaugeChart = ensureGauge(hpGaugeEl.value, hpGaugeChart);
  atkGaugeChart = ensureGauge(atkGaugeEl.value, atkGaugeChart);
  defGaugeChart = ensureGauge(defGaugeEl.value, defGaugeChart);
  spAtkGaugeChart = ensureGauge(spAtkGaugeEl.value, spAtkGaugeChart);
  spDefGaugeChart = ensureGauge(spDefGaugeEl.value, spDefGaugeChart);
  spdGaugeChart = ensureGauge(spdGaugeEl.value, spdGaugeChart);

  if (hpGaugeChart) hpGaugeChart.setOption(buildGaugeOption("HP", 0, max), true);
  if (atkGaugeChart) atkGaugeChart.setOption(buildGaugeOption("攻擊", 0, max), true);
  if (defGaugeChart) defGaugeChart.setOption(buildGaugeOption("防禦", 0, max), true);
  if (spAtkGaugeChart) spAtkGaugeChart.setOption(buildGaugeOption("特攻", 0, max), true);
  if (spDefGaugeChart) spDefGaugeChart.setOption(buildGaugeOption("特防", 0, max), true);
  if (spdGaugeChart) spdGaugeChart.setOption(buildGaugeOption("速度", 0, max), true);

  requestAnimationFrame(() => {
    if (hpGaugeChart)
      hpGaugeChart.setOption({ series: [{ data: [{ value: vm.value.stats.hp }] }] });
    if (atkGaugeChart)
      atkGaugeChart.setOption({ series: [{ data: [{ value: vm.value.stats.atk }] }] });
    if (defGaugeChart)
      defGaugeChart.setOption({ series: [{ data: [{ value: vm.value.stats.def }] }] });
    if (spAtkGaugeChart)
      spAtkGaugeChart.setOption({
        series: [{ data: [{ value: vm.value.stats.spAtk }] }],
      });
    if (spDefGaugeChart)
      spDefGaugeChart.setOption({
        series: [{ data: [{ value: vm.value.stats.spDef }] }],
      });
    if (spdGaugeChart)
      spdGaugeChart.setOption({ series: [{ data: [{ value: vm.value.stats.spd }] }] });
  });
}

function safeDispose(chart) {
  if (!chart) return;
  try {
    chart.dispose();
  } catch (_) {}
}

function disposeStatGauges() {
  safeDispose(hpGaugeChart);
  safeDispose(atkGaugeChart);
  safeDispose(defGaugeChart);
  safeDispose(spAtkGaugeChart);
  safeDispose(spDefGaugeChart);
  safeDispose(spdGaugeChart);

  hpGaugeChart = null;
  atkGaugeChart = null;
  defGaugeChart = null;
  spAtkGaugeChart = null;
  spDefGaugeChart = null;
  spdGaugeChart = null;
}

function resizeStatGauges() {
  hpGaugeChart && hpGaugeChart.resize();
  atkGaugeChart && atkGaugeChart.resize();
  defGaugeChart && defGaugeChart.resize();
  spAtkGaugeChart && spAtkGaugeChart.resize();
  spDefGaugeChart && spDefGaugeChart.resize();
  spdGaugeChart && spdGaugeChart.resize();
}

function extractStat(stats, name) {
  const arr = Array.isArray(stats) ? stats : [];
  const item = arr.find((x) => x?.stat?.name === name);
  return toNumber(item?.base_stat, 0);
}

function uniq(arr) {
  const out = [];
  const set = new Set();
  (Array.isArray(arr) ? arr : []).forEach((x) => {
    const v = String(x || "");
    if (!v) return;
    if (set.has(v)) return;
    set.add(v);
    out.push(v);
  });
  return out;
}

function buildMoves(moves) {
  const arr = Array.isArray(moves) ? moves : [];

  const mapped = arr.map((m) => {
    const name = normalizeName(m?.move?.name);
    const details = Array.isArray(m?.version_group_details)
      ? m.version_group_details
      : [];
    const methods = uniq(
      details.map((d) => normalizeName(d?.move_learn_method?.name)).filter((x) => x)
    );
    return { name, methods: methods.length ? methods : ["other"] };
  });

  const clean = mapped.filter((x) => x.name);
  clean.sort((a, b) => a.name.localeCompare(b.name));

  return clean.slice(0, 200);
}

function buildGallery(d) {
  const sp = d?.sprites || {};
  const other = sp?.other || {};

  const items = [
    {
      key: "official",
      label: "官方插圖",
      kind: "一般",
      url: other?.["official-artwork"]?.front_default || "",
    },
    {
      key: "official_shiny",
      label: "官方插圖",
      kind: "閃色",
      url: other?.["official-artwork"]?.front_shiny || "",
    },
    {
      key: "home",
      label: "HOME",
      kind: "一般",
      url: other?.home?.front_default || "",
    },
    {
      key: "home_shiny",
      label: "HOME",
      kind: "閃色",
      url: other?.home?.front_shiny || "",
    },
    {
      key: "dream",
      label: "Dream World",
      kind: "SVG",
      url: other?.dream_world?.front_default || "",
    },
    {
      key: "showdown",
      label: "Showdown",
      kind: "GIF",
      url: other?.showdown?.front_default || "",
    },
    {
      key: "showdown_shiny",
      label: "Showdown",
      kind: "閃色 GIF",
      url: other?.showdown?.front_shiny || "",
    },
  ];

  return items.map((x) => ({ ...x, url: String(x.url || "") }));
}

function mapDetailToVm(d) {
  const types = Array.isArray(d?.types)
    ? d.types
        .map((x) => ({ name: normalizeName(x?.type?.name), slot: toNumber(x?.slot, 0) }))
        .filter((x) => x.name)
        .sort((a, b) => a.slot - b.slot)
    : [];

  const sprite =
    d?.sprites?.other?.["official-artwork"]?.front_default ||
    d?.sprites?.front_default ||
    "";

  const abilities = Array.isArray(d?.abilities)
    ? d.abilities
        .map((x) => ({
          name: normalizeName(x?.ability?.name),
          is_hidden: !!x?.is_hidden,
          slot: toNumber(x?.slot, 0),
        }))
        .filter((x) => x.name)
        .sort((a, b) => a.slot - b.slot)
    : [];

  const hp = extractStat(d?.stats, "hp");
  const atk = extractStat(d?.stats, "attack");
  const def = extractStat(d?.stats, "defense");
  const spAtk = extractStat(d?.stats, "special-attack");
  const spDef = extractStat(d?.stats, "special-defense");
  const spd = extractStat(d?.stats, "speed");
  const total = hp + atk + def + spAtk + spDef + spd;

  const moves = buildMoves(d?.moves);
  const movesCount = Array.isArray(d?.moves) ? d.moves.length : 0;

  const cries = {
    latest: String(d?.cries?.latest || ""),
    legacy: String(d?.cries?.legacy || ""),
  };

  return {
    id: toNumber(d?.id, 0),
    name: normalizeName(d?.name),
    sprite,
    types,
    abilities,
    height: toNumber(d?.height, 0),
    weight: toNumber(d?.weight, 0),
    base_experience: d?.base_experience ?? null,
    moves,
    movesCount,
    cries,
    gallery: buildGallery(d),
    stats: { hp, atk, def, spAtk, spDef, spd, total },
  };
}

const displayId = computed(() => {
  const id = vm.value?.id || toNumber(route.params.id, 0);
  return String(id || "").padStart(4, "0");
});

const displayName = computed(() => {
  const n = vm.value?.name || "";
  return n ? toTitle(n) : "-";
});

const filteredMoves = computed(() => {
  const list = Array.isArray(vm.value?.moves) ? vm.value.moves : [];
  const q = normalizeName(movesQuery.value);

  let out = list;

  if (movesMethod.value) {
    if (movesMethod.value === "other") {
      out = out.filter((x) =>
        x.methods.some((m) => !["level-up", "machine", "egg", "tutor"].includes(m))
      );
    } else {
      out = out.filter((x) => x.methods.includes(movesMethod.value));
    }
  }

  if (q) out = out.filter((x) => x.name.includes(q));

  return out;
});

function renderCharts() {
  if (!vm.value) return;

  const labels = ["HP", "攻擊", "防禦", "特攻", "特防", "速度"];
  const values = [
    vm.value.stats.hp,
    vm.value.stats.atk,
    vm.value.stats.def,
    vm.value.stats.spAtk,
    vm.value.stats.spDef,
    vm.value.stats.spd,
  ];

  if (radarEl.value) {
    radarChart = radarChart || echarts.init(radarEl.value);
    radarChart.setOption({
      tooltip: { trigger: "item" },
      radar: {
        indicator: labels.map((n) => ({ name: n, max: 200 })),
        splitNumber: 4,
      },
      series: [
        {
          type: "radar",
          data: [{ value: values, name: "種族值" }],
        },
      ],
    });
  }

  if (barEl.value) {
    barChart = barChart || echarts.init(barEl.value);
    barChart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 36, right: 16, top: 20, bottom: 28, containLabel: true },
      xAxis: { type: "category", data: labels },
      yAxis: { type: "value" },
      series: [{ type: "bar", data: values }],
    });
  }
}

function resizeCharts() {
  radarChart && radarChart.resize();
  barChart && barChart.resize();

  // ✅ 只有在「種族值」Tab 才需要強制 resize gauge（避免無效 resize）
  if (activeTabIndex.value === 1) resizeStatGauges();
}

// ✅ 新增：切到「種族值」Tab 才開始跑（同時 init gauge）
async function playTotalIfNeeded() {
  if (!vm.value) return;
  if (activeTabIndex.value !== 1) return;

  // 如果你想「每次切到都跑」，把這段 if 整段刪掉即可
  if (hasPlayedTotalOnThisVm.value) return;

  await nextTick(); // 確保 TabPanel 的 DOM 已渲染 & 有尺寸

  // ✅ 這裡才 init gauge（避免在概覽 tab 時 dom 尺寸為 0）
  renderStatGauges();
  resizeStatGauges();

  animatedTotal.value = 0;
  await nextTick(); // 讓 0 先顯示
  animateTotalTo(vm.value.stats.total, { duration: 650 });

  hasPlayedTotalOnThisVm.value = true;
}

watch(
  () => activeTabIndex.value,
  () => {
    playTotalIfNeeded();
  }
);

async function load() {
  const id = String(route.params.id || "").trim();

  loading.value = true;
  errorMsg.value = "";
  vm.value = null;

  safeDispose(radarChart);
  safeDispose(barChart);
  radarChart = null;
  barChart = null;

  // ✅ 每次換資料都重置動畫狀態
  hasPlayedTotalOnThisVm.value = false;
  animatedTotal.value = 0;
  if (totalRafId) cancelAnimationFrame(totalRafId);
  totalRafId = 0;

  // ✅ 也把 gauge 先清掉（避免上一隻殘留）
  disposeStatGauges();

  try {
    if (!id) {
      errorMsg.value = "缺少寶可夢編號（例如：/pokemon/1）";
      return;
    }

    const d = await getPokemonDetail(id);
    const mapped = mapDetailToVm(d);

    if (!mapped?.id) {
      errorMsg.value = "查無資料";
      return;
    }

    vm.value = mapped;
    meta.fetchedAt = Date.now();

    loading.value = false;
    await nextTick();

    renderCharts();
    resizeCharts();

    // ✅ 若使用者剛好已經在「種族值」tab（activeTabIndex=1），立即播放
    playTotalIfNeeded();
  } catch (err) {
    console.error(err);
    errorMsg.value = err?.message ? `讀取失敗：${err.message}` : "讀取失敗：未知錯誤";
  } finally {
    loading.value = false;
  }
}

function reload() {
  load();
}

function openCry(kind) {
  if (!vm.value) return;
  const url = kind === "legacy" ? vm.value.cries.legacy : vm.value.cries.latest;
  if (!url) return;

  cryUrl.value = url;
  cryDialogLabel.value = kind === "legacy" ? "舊版叫聲" : "最新叫聲";
  cryDialogVisible.value = true;
}

watch(
  () => route.params.id,
  () => {
    movesQuery.value = "";
    movesMethod.value = "";

    // ✅ 可選：換寶可夢時回到概覽
    activeTabIndex.value = 0;

    load();
  }
);

onMounted(async () => {
  await load();

  ro = new ResizeObserver(() => resizeCharts());
  ro.observe(document.documentElement);

  window.addEventListener("resize", resizeCharts);
});

onBeforeUnmount(() => {
  ro && ro.disconnect();
  window.removeEventListener("resize", resizeCharts);

  safeDispose(radarChart);
  safeDispose(barChart);

  disposeStatGauges();

  if (totalRafId) cancelAnimationFrame(totalRafId);
  totalRafId = 0;
});
</script>
