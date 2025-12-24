<!-- src/views/ProfileView.vue -->
<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex w-full flex-wrap items-center justify-between gap-3">
      <div class="text-[22px] font-extrabold tracking-wide text-slate-900">會員資料</div>

      <div class="flex items-center gap-2">
        <button
          class="flex h-8 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
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

    <div
      class="flex w-full flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
    >
      <div class="flex w-full flex-wrap items-end gap-3">
        <div class="flex w-full max-w-90 flex-col gap-1">
          <div class="text-[12px] font-semibold text-slate-600">搜尋（名稱或編號）</div>
          <input
            v-model="filters.query"
            class="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            placeholder="例如：pikachu / 25"
            @keyup.enter="onSearch"
          />
        </div>

        <div class="flex w-full max-w-65 flex-col gap-1">
          <div class="text-[12px] font-semibold text-slate-600">屬性</div>
          <select
            v-model="filters.type"
            class="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="">全部</option>
            <option v-for="t in options.types" :key="t.name" :value="t.name">
              {{ toZhType(t.name) }}
            </option>
          </select>
        </div>

        <div class="flex w-full max-w-65 flex-col gap-1">
          <div class="text-[12px] font-semibold text-slate-600">世代</div>
          <select
            v-model="filters.generation"
            class="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="">全部</option>
            <option v-for="g in options.generations" :key="g.name" :value="g.id">
              {{ g.label }}
            </option>
          </select>
        </div>

        <div class="flex flex-1 flex-wrap items-center justify-end gap-2">
          <button
            class="flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            :disabled="loading"
            @click="onSearch"
          >
            查詢
          </button>

          <button
            class="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
            :disabled="loading"
            @click="onReset"
          >
            清除條件
          </button>
        </div>
      </div>

      <div class="mt-4 flex w-full flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-[12px] text-slate-600">
          <div class="font-semibold text-slate-700">結果：</div>
          <div>{{ totalText }}</div>
          <div v-if="activeFilterText" class="text-slate-500">
            ・{{ activeFilterText }}
          </div>
          <div v-if="meta.fetchedAt" class="text-slate-400">
            ・更新：{{ formatTime(meta.fetchedAt) }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex w-full flex-col rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
    >
      <div class="mt-4 w-full">
        <DataTable
          :value="rows"
          :loading="loading"
          dataKey="id"
          responsiveLayout="scroll"
          stripedRows
          size="small"
          class="w-full"
          @row-click="onRowClick"
        >
          <template #empty>
            <div
              class="flex w-full items-center justify-center py-10 text-sm text-slate-500"
            >
              查無資料
            </div>
          </template>

          <template #loading>
            <div
              class="flex w-full items-center justify-center py-10 text-sm text-slate-500"
            >
              讀取資料中…
            </div>
          </template>

          <Column header="圖片" style="width: 84px">
            <template #body="{ data }">
              <div class="flex items-center justify-center">
                <div
                  class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-slate-100"
                >
                  <img
                    v-if="data.sprite"
                    :src="data.sprite"
                    alt=""
                    class="h-12 w-12 object-contain"
                    loading="lazy"
                  />
                  <div v-else class="text-[11px] text-slate-400">無圖片</div>
                </div>
              </div>
            </template>
          </Column>

          <Column header="#" style="width: 90px">
            <template #body="{ data }">
              <div class="text-[12px] font-extrabold text-slate-700">
                #{{ String(data.id).padStart(4, "0") }}
              </div>
            </template>
          </Column>

          <Column header="名稱" style="min-width: 160px">
            <template #body="{ data }">
              <div class="text-sm font-extrabold text-slate-900">
                {{ toTitle(data.name) }}
              </div>
            </template>
          </Column>

          <Column header="屬性" style="min-width: 200px">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <div
                  v-for="t in data.types"
                  :key="t"
                  class="flex items-center rounded-full bg-slate-100 px-2 py-1 text-[12px] font-semibold text-slate-700"
                >
                  {{ toZhType(t) }}
                </div>
              </div>
            </template>
          </Column>

          <Column header="身高/體重" style="width: 140px">
            <template #body="{ data }">
              <div class="text-[12px] font-semibold text-slate-600">
                {{ data.height }} / {{ data.weight }}
              </div>
            </template>
          </Column>

          <Column header="HP" style="width: 80px">
            <template #body="{ data }">
              <div class="text-[12px] font-semibold text-slate-700">
                {{ data.stats.hp }}
              </div>
            </template>
          </Column>

          <Column header="ATK" style="width: 90px">
            <template #body="{ data }">
              <div class="text-[12px] font-semibold text-slate-700">
                {{ data.stats.atk }}
              </div>
            </template>
          </Column>

          <Column header="DEF" style="width: 90px">
            <template #body="{ data }">
              <div class="text-[12px] font-semibold text-slate-700">
                {{ data.stats.def }}
              </div>
            </template>
          </Column>

          <Column header="SPD" style="width: 90px">
            <template #body="{ data }">
              <div class="text-[12px] font-semibold text-slate-700">
                {{ data.stats.spd }}
              </div>
            </template>
          </Column>

          <Column header="基礎經驗" style="width: 110px">
            <template #body="{ data }">
              <div class="text-[12px] text-slate-600">
                {{ data.base_experience ?? "-" }}
              </div>
            </template>
          </Column>

          <Column header="能力數" style="width: 90px">
            <template #body="{ data }">
              <div class="text-[12px] text-slate-600">
                {{ data.abilitiesCount }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="mt-4 flex w-full items-center justify-end">
        <Paginator
          :first="paginatorFirst"
          :rows="pagination.pageSize"
          :totalRecords="pagination.total"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPaginatorPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";

import {
  getPokemonDetail,
  getPokemonList,
  getTypeList,
  getGenerationList,
  getPokemonNamesByType,
  getPokemonNamesByGeneration,
} from "@/apis/pokemon";

import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const errorMsg = ref("");

const meta = reactive({
  fetchedAt: 0,
});

const filters = reactive({
  query: "",
  type: "",
  generation: "",
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const options = reactive({
  types: [],
  generations: [],
});

const rows = ref([]);
const namePool = ref(null);

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

function toTitle(s) {
  const v = String(s || "");
  if (!v) return "";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function normalizeName(v) {
  return String(v || "")
    .trim()
    .toLowerCase();
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

function extractStat(stats, name) {
  const arr = Array.isArray(stats) ? stats : [];
  const item = arr.find((x) => x?.stat?.name === name);
  return toNumber(item?.base_stat, 0);
}

function mapDetailToRow(d) {
  const types = Array.isArray(d?.types)
    ? d.types.map((x) => normalizeName(x?.type?.name)).filter((x) => x)
    : [];

  const sprite =
    d?.sprites?.other?.["official-artwork"]?.front_default ||
    d?.sprites?.front_default ||
    "";

  return {
    id: toNumber(d?.id, 0),
    name: normalizeName(d?.name),
    sprite,
    types,
    height: toNumber(d?.height, 0),
    weight: toNumber(d?.weight, 0),
    base_experience: d?.base_experience ?? null,
    abilitiesCount: Array.isArray(d?.abilities) ? d.abilities.length : 0,
    stats: {
      hp: extractStat(d?.stats, "hp"),
      atk: extractStat(d?.stats, "attack"),
      def: extractStat(d?.stats, "defense"),
      spd: extractStat(d?.stats, "speed"),
    },
  };
}

async function mapLimit(items, limit, worker) {
  const list = Array.isArray(items) ? items : [];
  const out = new Array(list.length);
  let i = 0;

  async function runOne() {
    while (i < list.length) {
      const idx = i;
      i += 1;
      out[idx] = await worker(list[idx], idx);
    }
  }

  const runners = [];
  const n = Math.max(1, Math.min(limit, list.length));
  for (let k = 0; k < n; k += 1) runners.push(runOne());
  await Promise.all(runners);
  return out;
}

const totalPages = computed(() => {
  const t = pagination.total || 0;
  const ps = pagination.pageSize || 1;
  return Math.max(1, Math.ceil(t / ps));
});

const totalText = computed(() => `共 ${pagination.total} 筆`);

const activeFilterText = computed(() => {
  const parts = [];
  const q = normalizeName(filters.query);
  if (q) parts.push(`搜尋：${q}`);
  if (filters.type) parts.push(`屬性：${toZhType(filters.type)}`);
  if (filters.generation) {
    const g = options.generations.find(
      (x) => String(x.id) === String(filters.generation)
    );
    if (g) parts.push(`世代：${g.label}`);
  }
  return parts.join(" / ");
});

const paginatorFirst = computed(() => {
  return Math.max(0, (pagination.page - 1) * pagination.pageSize);
});

async function loadOptions() {
  const [typesRes, genRes] = await Promise.all([getTypeList(), getGenerationList()]);

  const types = Array.isArray(typesRes?.results) ? typesRes.results : [];
  options.types = types
    .map((x) => ({ name: normalizeName(x?.name) }))
    .filter((x) => x.name);

  const gens = Array.isArray(genRes?.results) ? genRes.results : [];
  options.generations = gens
    .map((x) => {
      const name = normalizeName(x?.name);
      const url = String(x?.url || "");
      const m = url.match(/\/generation\/(\d+)\//);
      const id = m ? Number(m[1]) : null;
      return {
        id,
        name,
        label: id ? `第 ${id} 世代` : toTitle(name),
      };
    })
    .filter((x) => Number.isFinite(x.id))
    .sort((a, b) => a.id - b.id);
}

async function buildNamePoolIfNeeded() {
  const q = normalizeName(filters.query);
  const hasType = !!normalizeName(filters.type);
  const hasGen = !!normalizeName(filters.generation);

  if (q) {
    namePool.value = [q];
    pagination.total = 1;
    return;
  }

  if (!hasType && !hasGen) {
    namePool.value = null;
    return;
  }

  let pool = null;

  if (hasType) {
    const byType = await getPokemonNamesByType(filters.type);
    pool = byType;
  }

  if (hasGen) {
    const byGen = await getPokemonNamesByGeneration(filters.generation);
    if (!pool) {
      pool = byGen;
    } else {
      const set = new Set(pool);
      pool = byGen.filter((n) => set.has(n));
    }
  }

  const uniq = Array.from(new Set((pool || []).filter((n) => n)));
  namePool.value = uniq;
  pagination.total = uniq.length;
}

async function loadPageData() {
  const ps = pagination.pageSize;
  const page = pagination.page;

  if (!namePool.value) {
    const offset = (page - 1) * ps;
    const listRes = await getPokemonList({ limit: ps, offset });

    pagination.total = toNumber(listRes?.count, 0);
    const results = Array.isArray(listRes?.results) ? listRes.results : [];
    const names = results.map((x) => normalizeName(x?.name)).filter((x) => x);

    const details = await mapLimit(names, 8, async (name) => {
      const d = await getPokemonDetail(name);
      return mapDetailToRow(d);
    });

    rows.value = details.filter((x) => x?.id);
    return;
  }

  const pool = namePool.value;
  const start = (page - 1) * ps;
  const slice = pool.slice(start, start + ps);

  const details = await mapLimit(slice, 8, async (name) => {
    const d = await getPokemonDetail(name);
    return mapDetailToRow(d);
  });

  rows.value = details.filter((x) => x?.id);
}

async function load() {
  loading.value = true;
  errorMsg.value = "";

  try {
    await buildNamePoolIfNeeded();

    if (pagination.page > totalPages.value) pagination.page = totalPages.value;
    if (pagination.page < 1) pagination.page = 1;

    await loadPageData();
    meta.fetchedAt = Date.now();
  } catch (err) {
    console.error(err);
    errorMsg.value = err?.message ? `讀取失敗：${err.message}` : "讀取失敗：未知錯誤";
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  pagination.page = 1;
  load();
}

function onReset() {
  filters.query = "";
  filters.type = "";
  filters.generation = "";
  pagination.page = 1;
  pagination.pageSize = 24;
  namePool.value = null;
  load();
}

function onPaginatorPage(e) {
  const nextRows = Number(e?.rows) || pagination.pageSize;
  const nextPage = Number(e?.page) + 1;

  const pageSizeChanged = nextRows !== pagination.pageSize;

  pagination.pageSize = nextRows;
  pagination.page = pageSizeChanged ? 1 : nextPage;

  load();
}

function reload() {
  load();
}

function onRowClick(e) {
  const id = e?.data?.id;
  if (!id) return;

  router.push({
    name: "Pokemon",
    params: { id: String(id) },
  });
}

onMounted(async () => {
  try {
    await loadOptions();
  } catch (err) {
    console.error(err);
  }
  await load();
});
</script>
