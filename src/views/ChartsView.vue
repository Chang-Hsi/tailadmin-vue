<!-- src/views/ChartsView.vue -->
<template>
  <div class="flex w-full flex-col gap-4 bg-slate-50">
    <div class="flex w-full flex-col gap-1">
      <div class="text-[22px] font-extrabold tracking-wide text-slate-900 lg:text-[26px]">
        專案交付中心儀表板
      </div>
      <div class="text-sm text-slate-500">
        同一份靜態假資料，呈現多種類圖表（趨勢 / 排行 / 占比 / 層級 / 儀表 /
        甘特）並搭配對應列表。
      </div>
    </div>

    <div
      class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >
      <div class="flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div class="flex min-w-72 flex-col gap-1">
          <div class="text-xs font-semibold text-slate-600">日期區間</div>
          <Calendar
            v-model="filters.dateRange"
            selectionMode="range"
            :manualInput="false"
            dateFormat="yy-mm-dd"
            showIcon
            placeholder="選擇日期範圍"
            class="w-full"
          />
        </div>

        <div class="flex min-w-45 flex-col gap-1">
          <div class="text-xs font-semibold text-slate-600">專案</div>
          <Dropdown
            v-model="filters.projectId"
            :options="projectOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="全部專案"
            class="w-full"
            showClear
          />
        </div>

        <div class="flex min-w-45 flex-col gap-1">
          <div class="text-xs font-semibold text-slate-600">部門</div>
          <Dropdown
            v-model="filters.department"
            :options="departmentOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="全部部門"
            class="w-full"
            showClear
          />
        </div>

        <div class="flex min-w-45 flex-col gap-1">
          <div class="text-xs font-semibold text-slate-600">人員</div>
          <Dropdown
            v-model="filters.ownerId"
            :options="memberOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="全部人員"
            class="w-full"
            showClear
          />
        </div>

        <div class="flex min-w-45 flex-col gap-1">
          <div class="text-xs font-semibold text-slate-600">狀態</div>
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="全部狀態"
            class="w-full"
            showClear
          />
        </div>

        <div class="flex min-w-55 flex-1 flex-col gap-1">
          <div class="text-xs font-semibold text-slate-600">搜尋（任務/缺陷標題）</div>
          <InputText v-model="filters.keyword" placeholder="輸入關鍵字" class="w-full" />
        </div>

        <div
          class="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start"
        >
          <Button
            label="清除鑽取"
            severity="secondary"
            outlined
            class="whitespace-nowrap"
            @click="clearDrilldown()"
          />
          <Button
            label="重置篩選"
            severity="secondary"
            class="whitespace-nowrap"
            @click="resetAll()"
          />
        </div>
      </div>

      <div class="flex w-full flex-wrap items-center gap-2">
        <div class="text-xs font-semibold text-slate-600">鑽取條件：</div>

        <Tag
          v-if="drilldown.selectedDate"
          severity="info"
          :value="`日期：${drilldown.selectedDate}`"
          class="cursor-pointer"
          @click="drilldown.selectedDate = null"
        />
        <Tag
          v-if="drilldown.selectedDefectType"
          severity="warning"
          :value="`缺陷類型：${drilldown.selectedDefectType}`"
          class="cursor-pointer"
          @click="drilldown.selectedDefectType = null"
        />
        <Tag
          v-if="drilldown.selectedSunburstPath"
          severity="help"
          :value="`旭日節點：${drilldown.selectedSunburstPath}`"
          class="cursor-pointer"
          @click="drilldown.selectedSunburstPath = null"
        />
        <Tag
          v-if="drilldown.selectedGaugeKey"
          severity="success"
          :value="`儀表：${drilldown.selectedGaugeKey}`"
          class="cursor-pointer"
          @click="drilldown.selectedGaugeKey = null"
        />
        <Tag
          v-if="drilldown.selectedTaskId"
          severity="contrast"
          :value="`任務：${drilldown.selectedTaskId}`"
          class="cursor-pointer"
          @click="drilldown.selectedTaskId = null"
        />

        <div v-if="!hasAnyDrilldown" class="text-xs text-slate-500">（尚無）</div>
      </div>
    </div>

    <div class="flex w-full flex-wrap gap-3">
      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="text-xs font-semibold text-slate-500">本期進度</div>
        <div class="mt-1 flex items-end gap-2">
          <div class="text-[28px] font-extrabold text-slate-900">
            {{ kpis.progressPct }}%
          </div>
          <div class="pb-1 text-sm text-slate-500">
            已完成 {{ kpis.doneTasks }} / {{ kpis.totalTasks }}
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-500">（點圖表可鑽取，主表同步縮小範圍）</div>
      </div>

      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="text-xs font-semibold text-slate-500">逾期任務</div>
        <div class="mt-1 flex items-end gap-2">
          <div class="text-[28px] font-extrabold text-slate-900">
            {{ kpis.overdueTasks }}
          </div>
          <div class="pb-1 text-sm text-slate-500">逾期率 {{ kpis.overdueRate }}%</div>
        </div>
        <div class="mt-2 text-xs text-slate-500">（逾期＝到期日已過且未完成）</div>
      </div>

      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="text-xs font-semibold text-slate-500">未結缺陷</div>
        <div class="mt-1 flex items-end gap-2">
          <div class="text-[28px] font-extrabold text-slate-900">
            {{ kpis.openDefects }}
          </div>
          <div class="pb-1 text-sm text-slate-500">
            S1 {{ kpis.openS1 }} / S2 {{ kpis.openS2 }}
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-500">（點餅圖可直接縮到該類型）</div>
      </div>

      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="text-xs font-semibold text-slate-500">工時（估 / 實）</div>
        <div class="mt-1 flex items-end gap-2">
          <div class="text-[28px] font-extrabold text-slate-900">
            {{ kpis.estimateHours }}
          </div>
          <div class="pb-1 text-sm text-slate-500">/ {{ kpis.actualHours }}</div>
        </div>
        <div class="mt-2 text-xs text-slate-500">（用於效率分數計算）</div>
      </div>

      <div
        class="flex min-w-55 flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="text-xs font-semibold text-slate-500">整體等級</div>
        <div class="mt-1 flex items-end gap-2">
          <div class="text-[28px] font-extrabold text-slate-900">{{ kpis.grade }}</div>
          <div class="pb-1 text-sm text-slate-500">總分 {{ kpis.totalScore }}</div>
        </div>
        <div class="mt-2 text-xs text-slate-500">（Grade Gauge 區域可看扣分原因）</div>
      </div>
    </div>

    <div class="flex w-full flex-col gap-4">
      <div class="flex w-full flex-wrap gap-4">
        <div
          class="flex min-w-[320px] flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">趨勢折線圖</div>
              <div class="text-xs text-slate-500">
                完成任務 / 新增缺陷 / 燃燒工時（點日期可鑽取）
              </div>
            </div>
            <Tag severity="secondary" :value="`資料：${trendRows.length} 天`" />
          </div>

          <div class="mt-3 flex w-full flex-col gap-3">
            <div ref="trendChartEl" class="h-70 w-full"></div>

            <DataTable
              :value="trendRows"
              size="small"
              scrollable
              scrollHeight="220px"
              stripedRows
              class="w-full"
              @row-click="onTrendRowClick"
            >
              <Column field="date" header="日期" style="min-width: 120px" />
              <Column field="doneTaskCount" header="完成" style="min-width: 80px" />
              <Column field="newDefectCount" header="新增缺陷" style="min-width: 100px" />
              <Column field="burnHours" header="工時" style="min-width: 80px" />
            </DataTable>
          </div>
        </div>

        <div
          class="flex min-w-[320px] flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">柱狀排行榜</div>
              <div class="text-xs text-slate-500">
                人員完成量 / 逾期量（點人員可鑽取）
              </div>
            </div>
            <Tag severity="secondary" :value="`人員：${members.length}`" />
          </div>

          <div class="mt-3 flex w-full flex-col gap-3">
            <div ref="barChartEl" class="h-70 w-full"></div>

            <DataTable
              :value="rankRows"
              size="small"
              scrollable
              scrollHeight="220px"
              stripedRows
              class="w-full"
              @row-click="onRankRowClick"
            >
              <Column field="memberName" header="人員" style="min-width: 140px" />
              <Column field="doneCount" header="完成" style="min-width: 80px" />
              <Column field="overdueCount" header="逾期" style="min-width: 80px" />
              <Column field="avgRisk" header="平均風險" style="min-width: 100px" />
            </DataTable>
          </div>
        </div>
      </div>

      <div class="flex w-full flex-wrap gap-4">
        <div
          class="flex min-w-[320px] flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">餅狀圖</div>
              <div class="text-xs text-slate-500">缺陷類型占比（點扇形可鑽取）</div>
            </div>
            <Tag severity="secondary" :value="`缺陷：${filteredDefects.length}`" />
          </div>

          <div class="mt-3 flex w-full flex-col gap-3">
            <div ref="pieChartEl" class="h-70 w-full"></div>

            <DataTable
              :value="defectRows"
              size="small"
              scrollable
              scrollHeight="220px"
              stripedRows
              class="w-full"
              @row-click="onDefectRowClick"
            >
              <Column field="defectId" header="編號" style="min-width: 120px" />
              <Column field="type" header="類型" style="min-width: 90px" />
              <Column field="severity" header="嚴重度" style="min-width: 90px" />
              <Column field="status" header="狀態" style="min-width: 90px" />
              <Column field="createdAt" header="建立日" style="min-width: 120px" />
            </DataTable>
          </div>
        </div>

        <div
          class="flex min-w-[320px] flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">旭日圖</div>
              <div class="text-xs text-slate-500">
                部門 / 專案 / 模組 / 任務（點節點可鑽取）
              </div>
            </div>
            <Tag severity="secondary" :value="`任務：${filteredTasks.length}`" />
          </div>

          <div class="mt-3 flex w-full flex-col gap-3">
            <div ref="sunburstChartEl" class="h-70 w-full"></div>

            <DataTable
              :value="sunburstSummaryRows"
              size="small"
              scrollable
              scrollHeight="220px"
              stripedRows
              class="w-full"
              @row-click="onSunburstRowClick"
            >
              <Column field="level" header="層級" style="min-width: 90px" />
              <Column field="name" header="名稱" style="min-width: 200px" />
              <Column field="taskCount" header="任務數" style="min-width: 90px" />
              <Column field="totalHours" header="總工時" style="min-width: 90px" />
              <Column field="overdueCount" header="逾期" style="min-width: 80px" />
            </DataTable>
          </div>
        </div>
      </div>

      <div class="flex w-full flex-wrap gap-4">
        <div
          class="flex min-w-[320px] flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">Grade Gauge</div>
              <div class="text-xs text-slate-500">整體健康等級（A / B / C / D）</div>
            </div>
            <Tag severity="secondary" :value="`等級：${kpis.grade}`" />
          </div>

          <div class="mt-3 flex w-full flex-col gap-3">
            <div ref="gradeGaugeEl" class="h-70 w-full"></div>

            <DataTable
              :value="scoreBreakdownRows"
              size="small"
              scrollable
              scrollHeight="220px"
              stripedRows
              class="w-full"
            >
              <Column field="key" header="指標" style="min-width: 110px" />
              <Column field="value" header="目前值" style="min-width: 100px" />
              <Column field="target" header="目標" style="min-width: 90px" />
              <Column field="weight" header="權重" style="min-width: 80px" />
              <Column field="score" header="得分" style="min-width: 90px" />
              <Column field="note" header="說明" style="min-width: 260px" />
            </DataTable>
          </div>
        </div>

        <div
          class="flex min-w-[320px] flex-1 flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">Multi Title Gauge</div>
              <div class="text-xs text-slate-500">
                進度 / 品質 / 風險 / 效率（點儀表可鑽取）
              </div>
            </div>
            <Tag severity="secondary" :value="`總分：${kpis.totalScore}`" />
          </div>

          <div class="mt-3 flex w-full flex-col gap-3">
            <div ref="multiGaugeEl" class="h-70 w-full"></div>

            <DataTable
              :value="metricRows"
              size="small"
              scrollable
              scrollHeight="220px"
              stripedRows
              class="w-full"
              @row-click="onMetricRowClick"
            >
              <Column field="key" header="指標" style="min-width: 110px" />
              <Column field="score" header="分數" style="min-width: 90px" />
              <Column field="detail" header="拆解" style="min-width: 320px" />
            </DataTable>
          </div>
        </div>
      </div>

      <div
        class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div
          class="flex w-full flex-col gap-1 lg:flex-row lg:items-end lg:justify-between"
        >
          <div class="flex flex-col">
            <div class="text-base font-bold text-slate-900">甘特圖</div>
            <div class="text-xs text-slate-500">
              依人員分組顯示任務排程（點任務可鑽取，主表同步定位）
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Dropdown
              v-model="ganttMode"
              :options="ganttModeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-55"
            />
            <Dropdown
              v-model="ganttLimit"
              :options="ganttLimitOptions"
              optionLabel="label"
              optionValue="value"
              class="w-45"
            />
          </div>
        </div>

        <div class="mt-2 flex w-full flex-col gap-3">
          <div ref="ganttChartEl" class="h-90 w-full"></div>

          <Divider />

          <div class="flex w-full items-center justify-between">
            <div class="text-sm font-semibold text-slate-700">任務主列表</div>
            <div class="text-xs text-slate-500">
              顯示：{{ taskRows.length }} 筆（圖表與列表皆受篩選 + 鑽取影響）
            </div>
          </div>

          <DataTable
            :value="taskRows"
            size="small"
            scrollable
            scrollHeight="360px"
            stripedRows
            class="w-full"
            :rowClass="taskRowClass"
            @row-click="onTaskRowClick"
          >
            <Column field="taskId" header="ID" style="min-width: 110px" />
            <Column field="taskTitle" header="任務" style="min-width: 240px" />
            <Column field="projectName" header="專案" style="min-width: 160px" />
            <Column field="moduleLabel" header="模組" style="min-width: 220px" />
            <Column field="ownerName" header="負責人" style="min-width: 120px" />
            <Column field="status" header="狀態" style="min-width: 110px" />
            <Column field="priority" header="優先級" style="min-width: 110px" />
            <Column field="startDate" header="開始" style="min-width: 120px" />
            <Column field="endDate" header="到期" style="min-width: 120px" />
            <Column field="progress" header="進度%" style="min-width: 110px" />
            <Column field="estimateHours" header="估時" style="min-width: 90px" />
            <Column field="actualHours" header="實時" style="min-width: 90px" />
            <Column field="riskScore" header="風險" style="min-width: 90px" />
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 說明：
// 1) 全部資料為靜態假資料（同一主題：專案交付中心）
// 2) 所有圖表使用 ECharts（折線、柱狀、餅狀、旭日、儀表、甘特）
// 3) 列表使用 PrimeVue DataTable
// 4) 無任何 template 註解（依你的偏好）

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import * as echarts from "echarts";

import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";

/* -----------------------------
 * 基礎工具（日期 / 隨機 / 格式）
 * ----------------------------- */
function pad2(n) {
  return String(n).padStart(2, "0");
}
function formatYMD(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = pad2(dt.getMonth() + 1);
  const day = pad2(dt.getDate());
  return `${y}-${m}-${day}`;
}
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* 可重現的假資料亂數（避免每次刷新都完全不同） */
function createSeededRng(seed) {
  let s = seed >>> 0;
  return function rand() {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rnd = createSeededRng(20251224);

/* -----------------------------
 * 假資料生成（projects / members / tasks / defects）
 * ----------------------------- */
const departments = ["Frontend", "Backend", "QA", "Ops"];
const defectTypes = ["UI", "功能", "效能", "資料", "其他"];
const severities = ["S1", "S2", "S3"];
const taskStatuses = ["todo", "doing", "done", "blocked"];
const priorities = ["P0", "P1", "P2"];

function pick(arr) {
  return arr[Math.floor(rnd() * arr.length)];
}
function chance(p) {
  return rnd() < p;
}
function randomInt(min, max) {
  return Math.floor(rnd() * (max - min + 1)) + min;
}

function buildMockProjects() {
  const base = [
    { projectId: "P001", projectName: "官網改版", department: "Frontend" },
    { projectId: "P002", projectName: "會員中心升級", department: "Backend" },
    { projectId: "P003", projectName: "訂單流程優化", department: "Ops" },
    { projectId: "P004", projectName: "測試自動化導入", department: "QA" },
  ];
  const today = startOfDay(new Date());
  return base.map((p, idx) => {
    const start = addDays(today, -120 - idx * 15);
    const end = addDays(today, 30 + idx * 10);
    return {
      ...p,
      startDate: formatYMD(start),
      endDate: formatYMD(end),
      targetProgress: 100,
      budgetHours: 600 + idx * 120,
    };
  });
}

function buildMockMembers() {
  const names = [
    "王小明",
    "陳怡君",
    "林志豪",
    "張雅婷",
    "李冠廷",
    "蔡佩珊",
    "黃子維",
    "吳佳穎",
    "鄭承翰",
    "周欣儀",
    "許哲豪",
    "趙子晴",
  ];
  return names.map((name, idx) => {
    const dept = departments[idx % departments.length];
    const role =
      dept === "QA" ? "QA" : dept === "Ops" ? "Ops" : dept === "Backend" ? "BE" : "FE";
    return {
      memberId: `M${String(idx + 1).padStart(3, "0")}`,
      memberName: name,
      department: dept,
      role,
    };
  });
}

function buildModulePath(projectName, dept) {
  const map = {
    Frontend: ["首頁", "活動頁", "導覽列", "SEO", "樣式系統", "元件庫"],
    Backend: ["登入", "會員資料", "訂單API", "支付", "權限", "通知"],
    QA: ["測試案例", "回歸測試", "自動化腳本", "報表"],
    Ops: ["佈署", "監控", "排程", "Log", "風控"],
  };
  const lv2 = pick(map[dept] || ["模組"]);
  const lv3 = pick(["A區", "B區", "C區", "整合", "重構", "優化"]);
  const lv4 = pick(["需求", "開發", "修正", "驗證", "文件"]);
  return `${dept}/${projectName}/${lv2}/${lv3}-${lv4}`;
}

function buildMockTasks(projects, members) {
  const today = startOfDay(new Date());
  const tasks = [];
  const total = 140;

  for (let i = 0; i < total; i++) {
    const project = pick(projects);
    const dept = chance(0.6) ? project.department : pick(departments);
    const owner = pick(members.filter((m) => m.department === dept) || members);

    const start = addDays(today, -randomInt(60, 5));
    const duration = randomInt(2, 18);
    const end = addDays(start, duration);

    let status = pick(taskStatuses);
    const isLate = end < today && status !== "done" && chance(0.55);
    if (isLate) status = "doing";

    const progress =
      status === "done"
        ? 100
        : status === "todo"
        ? randomInt(0, 15)
        : status === "blocked"
        ? randomInt(10, 40)
        : randomInt(20, 85);

    const estimate = randomInt(2, 40);
    const actual =
      status === "done"
        ? clamp(estimate + randomInt(-3, 18), 1, 80)
        : clamp(Math.floor(estimate * (progress / 100)) + randomInt(0, 6), 0, 80);

    const risk = clamp(
      Math.floor(
        (status === "blocked"
          ? 70
          : status === "doing"
          ? 45
          : status === "todo"
          ? 25
          : 20) + randomInt(-10, 25)
      ),
      0,
      100
    );

    tasks.push({
      taskId: `T${String(i + 1).padStart(4, "0")}`,
      taskTitle: `${project.projectName} - ${pick([
        "功能調整",
        "修正缺陷",
        "效能優化",
        "重構",
        "新增頁面",
        "串接API",
      ])} #${i + 1}`,
      projectId: project.projectId,
      department: dept,
      modulePath: buildModulePath(project.projectName, dept),
      ownerId: owner?.memberId || pick(members).memberId,
      status: isLate ? "overdue" : status,
      priority: pick(priorities),
      startDate: formatYMD(start),
      endDate: formatYMD(end),
      estimateHours: estimate,
      actualHours: actual,
      progress,
      riskScore: risk,
      tags: chance(0.4)
        ? [pick(["SEO", "Refactor", "Bugfix", "UI", "API", "Performance"])]
        : [],
    });
  }

  return tasks;
}

function buildMockDefects(projects, members, tasks) {
  const today = startOfDay(new Date());
  const total = 90;
  const defects = [];

  for (let i = 0; i < total; i++) {
    const project = pick(projects);
    const type = pick(defectTypes);
    const severity = chance(0.2) ? "S1" : chance(0.55) ? "S2" : "S3";
    const status = chance(0.45)
      ? "open"
      : chance(0.4)
      ? "fixing"
      : chance(0.1)
      ? "resolved"
      : "closed";

    const created = addDays(today, -randomInt(60, 1));
    const closed = status === "closed" ? addDays(created, randomInt(1, 20)) : null;

    const owner = pick(members);
    const relatedTask = chance(0.7)
      ? pick(tasks.filter((t) => t.projectId === project.projectId))
      : null;

    defects.push({
      defectId: `D${String(i + 1).padStart(4, "0")}`,
      projectId: project.projectId,
      relatedTaskId: relatedTask?.taskId || null,
      type,
      severity,
      status,
      createdAt: formatYMD(created),
      closedAt: closed ? formatYMD(closed) : null,
      ownerId: owner.memberId,
      title: `${project.projectName} - ${type}${
        severity === "S1" ? "（緊急）" : ""
      }問題 #${i + 1}`,
    });
  }

  return defects;
}

function buildDailyMetricsFrom(tasks, defects, startDate, endDate) {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const map = new Map();

  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const key = formatYMD(d);
    map.set(key, {
      date: key,
      doneTaskCount: 0,
      newDefectCount: 0,
      burnHours: 0,
      activeMemberCount: 0,
    });
  }

  const activeSetByDate = new Map();

  tasks.forEach((t) => {
    if (t.status === "done") {
      const doneDate = t.endDate;
      if (map.has(doneDate)) map.get(doneDate).doneTaskCount += 1;
    }

    const s = new Date(t.startDate);
    const e = new Date(t.endDate);
    const days = Math.max(1, Math.floor((e - s) / (24 * 3600 * 1000)) + 1);
    const dailyBurn =
      t.actualHours > 0 ? Math.max(0, Math.floor(t.actualHours / days)) : 0;

    for (let d = startOfDay(s); d <= startOfDay(e); d = addDays(d, 1)) {
      const key = formatYMD(d);
      if (!map.has(key)) continue;
      map.get(key).burnHours += dailyBurn;

      if (!activeSetByDate.has(key)) activeSetByDate.set(key, new Set());
      activeSetByDate.get(key).add(t.ownerId);
    }
  });

  defects.forEach((x) => {
    if (map.has(x.createdAt)) map.get(x.createdAt).newDefectCount += 1;
  });

  for (const [key, s] of activeSetByDate.entries()) {
    if (map.has(key)) map.get(key).activeMemberCount = s.size;
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/* -----------------------------
 * 初始化假資料
 * ----------------------------- */
const projects = buildMockProjects();
const members = buildMockMembers();
const tasks = buildMockTasks(projects, members);
const defects = buildMockDefects(projects, members, tasks);

/* -----------------------------
 * 篩選 + 鑽取狀態
 * ----------------------------- */
const today = startOfDay(new Date());
const defaultStart = addDays(today, -29);

const filters = reactive({
  dateRange: [defaultStart, today],
  projectId: null,
  department: null,
  ownerId: null,
  status: null,
  keyword: "",
});

const drilldown = reactive({
  selectedDate: null,
  selectedDefectType: null,
  selectedSunburstPath: null,
  selectedGaugeKey: null,
  selectedTaskId: null,
});

const hasAnyDrilldown = computed(() => {
  return !!(
    drilldown.selectedDate ||
    drilldown.selectedDefectType ||
    drilldown.selectedSunburstPath ||
    drilldown.selectedGaugeKey ||
    drilldown.selectedTaskId
  );
});

function clearDrilldown() {
  drilldown.selectedDate = null;
  drilldown.selectedDefectType = null;
  drilldown.selectedSunburstPath = null;
  drilldown.selectedGaugeKey = null;
  drilldown.selectedTaskId = null;
}

function resetAll() {
  filters.dateRange = [defaultStart, today];
  filters.projectId = null;
  filters.department = null;
  filters.ownerId = null;
  filters.status = null;
  filters.keyword = "";
  clearDrilldown();
}

/* -----------------------------
 * 下拉選單 Options
 * ----------------------------- */
const projectOptions = computed(() =>
  projects.map((p) => ({ label: `${p.projectId} ${p.projectName}`, value: p.projectId }))
);
const departmentOptions = computed(() =>
  departments.map((d) => ({ label: d, value: d }))
);
const memberOptions = computed(() =>
  members.map((m) => ({ label: `${m.memberName}（${m.department}）`, value: m.memberId }))
);
const statusOptions = computed(() => {
  const list = ["todo", "doing", "done", "blocked", "overdue"];
  return list.map((s) => ({ label: s, value: s }));
});

/* -----------------------------
 * 共同過濾（日期 / 專案 / 部門 / 人員 / 狀態 / 關鍵字 / 鑽取）
 * ----------------------------- */
function inDateRange(ymd, range) {
  if (!range || !Array.isArray(range) || range.length < 2) return true;
  const [s, e] = range;
  if (!(s instanceof Date) || !(e instanceof Date)) return true;
  const d = startOfDay(new Date(ymd));
  return d >= startOfDay(s) && d <= startOfDay(e);
}

function matchKeyword(text, kw) {
  const k = (kw || "").trim();
  if (!k) return true;
  return String(text || "")
    .toLowerCase()
    .includes(k.toLowerCase());
}

const filteredTasks = computed(() => {
  const kw = filters.keyword;

  return tasks.filter((t) => {
    if (
      !inDateRange(t.endDate, filters.dateRange) &&
      !inDateRange(t.startDate, filters.dateRange)
    )
      return false;
    if (filters.projectId && t.projectId !== filters.projectId) return false;
    if (filters.department && t.department !== filters.department) return false;
    if (filters.ownerId && t.ownerId !== filters.ownerId) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (!matchKeyword(t.taskTitle, kw)) return false;

    if (drilldown.selectedDate) {
      const hit =
        t.endDate === drilldown.selectedDate || t.startDate === drilldown.selectedDate;
      if (!hit) return false;
    }
    if (drilldown.selectedSunburstPath) {
      if (!t.modulePath.startsWith(drilldown.selectedSunburstPath)) return false;
    }
    if (drilldown.selectedTaskId) {
      if (t.taskId !== drilldown.selectedTaskId) return false;
    }
    if (drilldown.selectedGaugeKey) {
      // 儀表鑽取：用最直覺的規則把任務縮小範圍
      if (drilldown.selectedGaugeKey === "品質") {
        // 品質：優先顯示 blocked/overdue/高風險任務
        if (!(t.status === "blocked" || t.status === "overdue" || t.riskScore >= 70))
          return false;
      }
      if (drilldown.selectedGaugeKey === "風險") {
        if (t.riskScore < 70) return false;
      }
      if (drilldown.selectedGaugeKey === "進度") {
        if (!(t.status === "doing" || t.status === "todo" || t.status === "overdue"))
          return false;
      }
      if (drilldown.selectedGaugeKey === "效率") {
        // 效率差：實工時明顯超估時
        if (!(t.actualHours > t.estimateHours + 6)) return false;
      }
    }

    return true;
  });
});

const filteredDefects = computed(() => {
  const kw = filters.keyword;

  return defects.filter((d) => {
    if (!inDateRange(d.createdAt, filters.dateRange)) return false;
    if (filters.projectId && d.projectId !== filters.projectId) return false;
    if (filters.ownerId && d.ownerId !== filters.ownerId) return false;
    if (drilldown.selectedDefectType && d.type !== drilldown.selectedDefectType)
      return false;
    if (!matchKeyword(d.title, kw)) return false;
    return true;
  });
});

/* -----------------------------
 * KPI / 分數 / 等級
 * ----------------------------- */
function computeScores(tasksList, defectsList) {
  const total = tasksList.length || 0;
  const done = tasksList.filter((t) => t.status === "done").length;
  const overdue = tasksList.filter((t) => t.status === "overdue").length;

  const estimateSum = tasksList.reduce((acc, t) => acc + (t.estimateHours || 0), 0);
  const actualSum = tasksList.reduce((acc, t) => acc + (t.actualHours || 0), 0);

  const openDefects = defectsList.filter(
    (x) => x.status === "open" || x.status === "fixing"
  ).length;
  const openS1 = defectsList.filter(
    (x) => (x.status === "open" || x.status === "fixing") && x.severity === "S1"
  ).length;
  const openS2 = defectsList.filter(
    (x) => (x.status === "open" || x.status === "fixing") && x.severity === "S2"
  ).length;

  const progressScore = total === 0 ? 0 : Math.round((done / total) * 100);

  // 品質分：S1 扣更多
  const qualityPenalty =
    openS1 * 8 + openS2 * 4 + Math.max(0, openDefects - openS1 - openS2) * 2;
  const qualityScore = clamp(100 - qualityPenalty, 0, 100);

  // 風險分：平均風險越高分越低
  const avgRisk =
    total === 0 ? 0 : tasksList.reduce((acc, t) => acc + (t.riskScore || 0), 0) / total;
  const riskScore = clamp(Math.round(100 - avgRisk), 0, 100);

  // 效率分：估/實 越接近越好，超過就扣
  const ratio = actualSum <= 0 ? 1 : estimateSum / actualSum;
  const efficiencyScore = clamp(Math.round(100 * ratio), 0, 100);

  const weights = { progress: 0.35, quality: 0.25, risk: 0.2, efficiency: 0.2 };
  const totalScore = Math.round(
    progressScore * weights.progress +
      qualityScore * weights.quality +
      riskScore * weights.risk +
      efficiencyScore * weights.efficiency
  );

  const grade =
    totalScore >= 90 ? "A" : totalScore >= 75 ? "B" : totalScore >= 60 ? "C" : "D";

  return {
    totalTasks: total,
    doneTasks: done,
    overdueTasks: overdue,
    overdueRate: total === 0 ? 0 : Math.round((overdue / total) * 100),
    estimateHours: estimateSum,
    actualHours: actualSum,
    openDefects,
    openS1,
    openS2,
    progressScore,
    qualityScore,
    riskScore,
    efficiencyScore,
    totalScore,
    grade,
    avgRisk: Math.round(avgRisk),
  };
}

const kpis = computed(() => {
  const s = computeScores(filteredTasks.value, filteredDefects.value);
  return {
    ...s,
    progressPct: s.progressScore,
  };
});

const scoreBreakdownRows = computed(() => {
  const s = kpis.value;
  return [
    {
      key: "進度",
      value: `${s.doneTasks}/${s.totalTasks}（${s.progressScore}%）`,
      target: ">= 85%",
      weight: "35%",
      score: s.progressScore,
      note: "完成任務數 / 任務總數",
    },
    {
      key: "品質",
      value: `未結缺陷 ${s.openDefects}（S1 ${s.openS1} / S2 ${s.openS2}）`,
      target: "未結越少越好",
      weight: "25%",
      score: s.qualityScore,
      note: "S1/S2 扣分較多，反映緊急與重要問題",
    },
    {
      key: "風險",
      value: `平均風險 ${s.avgRisk}`,
      target: "<= 35",
      weight: "20%",
      score: s.riskScore,
      note: "平均風險越高，風險分越低（100 - 平均風險）",
    },
    {
      key: "效率",
      value: `估/實 ${s.estimateHours}/${s.actualHours}`,
      target: "接近 1.0",
      weight: "20%",
      score: s.efficiencyScore,
      note: "估時/實時越接近越好，實時明顯超估時會扣分",
    },
  ];
});

const metricRows = computed(() => {
  const s = kpis.value;
  return [
    {
      key: "進度",
      score: s.progressScore,
      detail: `已完成 ${s.doneTasks} / 總任務 ${s.totalTasks}`,
    },
    {
      key: "品質",
      score: s.qualityScore,
      detail: `未結缺陷 ${s.openDefects}（S1 ${s.openS1} / S2 ${s.openS2}）`,
    },
    {
      key: "風險",
      score: s.riskScore,
      detail: `平均風險 ${s.avgRisk} → 分數 ${s.riskScore}`,
    },
    {
      key: "效率",
      score: s.efficiencyScore,
      detail: `估時 ${s.estimateHours} / 實時 ${s.actualHours}`,
    },
  ];
});

/* -----------------------------
 * 趨勢資料（用過濾後的 tasks/defects 生成 daily metrics）
 * ----------------------------- */
const trendRows = computed(() => {
  const r = filters.dateRange;
  const start = r?.[0] instanceof Date ? r[0] : defaultStart;
  const end = r?.[1] instanceof Date ? r[1] : today;

  // 趨勢用「鑽取後的 filteredTasks/filteredDefects」
  const rows = buildDailyMetricsFrom(
    filteredTasks.value,
    filteredDefects.value,
    start,
    end
  );

  // 讓列表不要太長（最多 90 天）
  if (rows.length > 90) return rows.slice(rows.length - 90);
  return rows;
});

/* -----------------------------
 * 柱狀排行資料
 * ----------------------------- */
const rankRows = computed(() => {
  const mMap = new Map(members.map((m) => [m.memberId, m]));
  const bucket = new Map();

  filteredTasks.value.forEach((t) => {
    const key = t.ownerId;
    if (!bucket.has(key)) {
      bucket.set(key, {
        memberId: key,
        doneCount: 0,
        overdueCount: 0,
        riskSum: 0,
        riskN: 0,
      });
    }
    const b = bucket.get(key);
    if (t.status === "done") b.doneCount += 1;
    if (t.status === "overdue") b.overdueCount += 1;
    b.riskSum += t.riskScore || 0;
    b.riskN += 1;
  });

  const rows = Array.from(bucket.values())
    .map((b) => {
      const m = mMap.get(b.memberId);
      return {
        memberId: b.memberId,
        memberName: m?.memberName || b.memberId,
        doneCount: b.doneCount,
        overdueCount: b.overdueCount,
        avgRisk: b.riskN ? Math.round(b.riskSum / b.riskN) : 0,
      };
    })
    .sort((a, b) => b.doneCount - a.doneCount);

  return rows;
});

/* -----------------------------
 * 缺陷列表（對應餅狀圖）
 * ----------------------------- */
const defectRows = computed(() => {
  const pMap = new Map(projects.map((p) => [p.projectId, p]));
  const mMap = new Map(members.map((m) => [m.memberId, m]));
  const list = filteredDefects.value
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 80)
    .map((d) => ({
      ...d,
      projectName: pMap.get(d.projectId)?.projectName || d.projectId,
      ownerName: mMap.get(d.ownerId)?.memberName || d.ownerId,
    }));
  return list;
});

/* -----------------------------
 * 任務主列表（對應甘特 + 全頁落地）
 * ----------------------------- */
const taskRows = computed(() => {
  const pMap = new Map(projects.map((p) => [p.projectId, p]));
  const mMap = new Map(members.map((m) => [m.memberId, m]));
  const list = filteredTasks.value
    .slice()
    .sort((a, b) => {
      // 逾期優先、再看到期日、再看風險
      const aLate = a.status === "overdue" ? 1 : 0;
      const bLate = b.status === "overdue" ? 1 : 0;
      if (aLate !== bLate) return bLate - aLate;
      if (a.endDate !== b.endDate) return a.endDate.localeCompare(b.endDate);
      return (b.riskScore || 0) - (a.riskScore || 0);
    })
    .slice(0, 180)
    .map((t) => {
      const p = pMap.get(t.projectId);
      const m = mMap.get(t.ownerId);
      const moduleLabel = String(t.modulePath || "")
        .split("/")
        .slice(2)
        .join(" / ");
      return {
        ...t,
        projectName: p?.projectName || t.projectId,
        ownerName: m?.memberName || t.ownerId,
        moduleLabel,
      };
    });

  return list;
});

function taskRowClass(row) {
  if (row?.taskId && drilldown.selectedTaskId === row.taskId) return "bg-slate-100";
  if (row?.status === "overdue") return "bg-rose-50";
  if (row?.status === "blocked") return "bg-amber-50";
  return "";
}

/* -----------------------------
 * 旭日圖資料（由 modulePath 拆樹 + 摘要表）
 * ----------------------------- */
function ensureChild(node, name) {
  if (!node.children) node.children = [];
  let child = node.children.find((c) => c.name === name);
  if (!child) {
    child = {
      name,
      children: [],
      __agg: { taskCount: 0, totalHours: 0, overdueCount: 0, riskSum: 0, riskN: 0 },
    };
    node.children.push(child);
  }
  return child;
}

function buildSunburstTree(tasksList) {
  const root = {
    name: "root",
    children: [],
    __agg: { taskCount: 0, totalHours: 0, overdueCount: 0, riskSum: 0, riskN: 0 },
  };

  tasksList.forEach((t) => {
    const parts = String(t.modulePath || "")
      .split("/")
      .filter(Boolean);
    if (parts.length < 2) return;

    let cur = root;
    for (const p of parts) {
      cur = ensureChild(cur, p);
      cur.__agg.taskCount += 1;
      cur.__agg.totalHours += t.estimateHours || 0;
      cur.__agg.overdueCount += t.status === "overdue" ? 1 : 0;
      cur.__agg.riskSum += t.riskScore || 0;
      cur.__agg.riskN += 1;
    }
  });

  function toSunburstData(node, path) {
    const n = node;
    const avgRisk = n.__agg?.riskN ? n.__agg.riskSum / n.__agg.riskN : 0;
    const safePath = path ? `${path}/${n.name}` : n.name;

    const data = {
      name: n.name,
      value: n.__agg?.taskCount || 0,
      __path: safePath === "root" ? "" : safePath,
      __taskCount: n.__agg?.taskCount || 0,
      __totalHours: n.__agg?.totalHours || 0,
      __overdueCount: n.__agg?.overdueCount || 0,
      __avgRisk: Math.round(avgRisk),
      children: (n.children || []).map((c) =>
        toSunburstData(c, safePath === "root" ? "" : safePath)
      ),
    };

    if (!data.children || data.children.length === 0) delete data.children;
    return data;
  }

  return root.children.map((c) => toSunburstData(c, ""));
}

function buildSunburstSummary(tasksList) {
  const rows = [];
  const tree = buildSunburstTree(tasksList);

  function walk(nodes, levelIndex, pathPrefix) {
    const levels = ["部門", "專案", "模組", "子層"];
    (nodes || []).forEach((n) => {
      const level = levels[levelIndex] || `第${levelIndex + 1}層`;
      const name = n.name;
      const path = (pathPrefix ? `${pathPrefix}/` : "") + n.name;

      rows.push({
        level,
        name,
        path,
        taskCount: n.__taskCount || n.value || 0,
        totalHours: n.__totalHours || 0,
        overdueCount: n.__overdueCount || 0,
      });

      if (n.children) walk(n.children, levelIndex + 1, path);
    });
  }

  walk(tree, 0, "");
  return rows
    .filter((r) => r.level !== "子層")
    .sort((a, b) => b.taskCount - a.taskCount)
    .slice(0, 80);
}

const sunburstData = computed(() => buildSunburstTree(filteredTasks.value));
const sunburstSummaryRows = computed(() => buildSunburstSummary(filteredTasks.value));

/* -----------------------------
 * 甘特圖（ECharts custom series）
 * ----------------------------- */
const ganttMode = ref("byMember");
const ganttModeOptions = [
  { label: "依人員", value: "byMember" },
  { label: "依專案", value: "byProject" },
  { label: "依狀態", value: "byStatus" },
];

const ganttLimit = ref(80);
const ganttLimitOptions = [
  { label: "顯示 40 筆", value: 40 },
  { label: "顯示 80 筆", value: 80 },
  { label: "顯示 120 筆", value: 120 },
];

function buildGanttSeries(tasksList) {
  const pMap = new Map(projects.map((p) => [p.projectId, p.projectName]));
  const mMap = new Map(members.map((m) => [m.memberId, m.memberName]));

  const sorted = tasksList
    .slice()
    .sort((a, b) => {
      const aLate = a.status === "overdue" ? 1 : 0;
      const bLate = b.status === "overdue" ? 1 : 0;
      if (aLate !== bLate) return bLate - aLate;
      if (a.endDate !== b.endDate) return a.endDate.localeCompare(b.endDate);
      return (b.riskScore || 0) - (a.riskScore || 0);
    })
    .slice(0, ganttLimit.value);

  const groupKeyFn =
    ganttMode.value === "byProject"
      ? (t) => pMap.get(t.projectId) || t.projectId
      : ganttMode.value === "byStatus"
      ? (t) => t.status
      : (t) => mMap.get(t.ownerId) || t.ownerId;

  const categories = [];
  const catIndex = new Map();

  function getCatIndex(label) {
    if (!catIndex.has(label)) {
      catIndex.set(label, categories.length);
      categories.push(label);
    }
    return catIndex.get(label);
  }

  const data = sorted.map((t) => {
    const cat = groupKeyFn(t);
    const y = getCatIndex(cat);
    const start = +new Date(t.startDate);
    const end = +new Date(t.endDate);
    return {
      taskId: t.taskId,
      taskTitle: t.taskTitle,
      start,
      end,
      y,
      status: t.status,
      priority: t.priority,
      progress: t.progress,
      riskScore: t.riskScore,
      projectName: pMap.get(t.projectId) || t.projectId,
      ownerName: mMap.get(t.ownerId) || t.ownerId,
    };
  });

  return { categories, data };
}

/* -----------------------------
 * ECharts 初始化與更新（通用）
 * ----------------------------- */
function useEchart(elRef) {
  let chart = null;
  let ro = null;

  function init() {
    const el = elRef.value;
    if (!el) return null;
    chart = echarts.init(el);
    ro = new ResizeObserver(() => {
      if (chart) chart.resize();
    });
    ro.observe(el);
    return chart;
  }

  function setOption(option) {
    if (!chart) return;
    chart.setOption(option, true);
  }

  function on(eventName, handler) {
    if (!chart) return;
    chart.on(eventName, handler);
  }

  function off(eventName, handler) {
    if (!chart) return;
    chart.off(eventName, handler);
  }

  function dispose() {
    if (ro && elRef.value) ro.unobserve(elRef.value);
    if (chart) chart.dispose();
    ro = null;
    chart = null;
  }

  function getInstance() {
    return chart;
  }

  return { init, setOption, on, off, dispose, getInstance };
}

/* -----------------------------
 * 圖表 refs
 * ----------------------------- */
const trendChartEl = ref(null);
const barChartEl = ref(null);
const pieChartEl = ref(null);
const sunburstChartEl = ref(null);
const gradeGaugeEl = ref(null);
const multiGaugeEl = ref(null);
const ganttChartEl = ref(null);

const trendChart = useEchart(trendChartEl);
const barChart = useEchart(barChartEl);
const pieChart = useEchart(pieChartEl);
const sunburstChart = useEchart(sunburstChartEl);
const gradeChart = useEchart(gradeGaugeEl);
const multiChart = useEchart(multiGaugeEl);
const ganttChart = useEchart(ganttChartEl);

/* -----------------------------
 * 圖表 option builders
 * ----------------------------- */
function buildTrendOption(rows) {
  const x = rows.map((r) => r.date);
  const done = rows.map((r) => r.doneTaskCount);
  const defects = rows.map((r) => r.newDefectCount);
  const burn = rows.map((r) => r.burnHours);

  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 600,
    tooltip: { trigger: "axis" },
    legend: { top: 6 },
    grid: { left: 44, right: 44, top: 48, bottom: 30 },
    xAxis: { type: "category", data: x, axisLabel: { hideOverlap: true } },
    yAxis: [
      { type: "value", name: "數量", min: 0 },
      { type: "value", name: "工時", min: 0 },
    ],
    series: [
      { name: "完成任務", type: "line", data: done, smooth: true, symbolSize: 6 },
      { name: "新增缺陷", type: "line", data: defects, smooth: true, symbolSize: 6 },
      { name: "燃燒工時", type: "bar", yAxisIndex: 1, data: burn, barMaxWidth: 18 },
    ],
  };
}

function buildBarOption(rows) {
  const x = rows.map((r) => r.memberName);
  const done = rows.map((r) => r.doneCount);
  const overdue = rows.map((r) => r.overdueCount);

  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 600,
    tooltip: { trigger: "axis" },
    legend: { top: 6 },
    grid: { left: 44, right: 24, top: 48, bottom: 70 },
    xAxis: { type: "category", data: x, axisLabel: { rotate: 28 } },
    yAxis: { type: "value", min: 0 },
    series: [
      { name: "完成", type: "bar", data: done, barMaxWidth: 18 },
      { name: "逾期", type: "bar", data: overdue, barMaxWidth: 18 },
    ],
  };
}

function buildPieOption(defectsList) {
  const map = new Map();
  defectTypes.forEach((t) => map.set(t, 0));
  defectsList.forEach((d) => map.set(d.type, (map.get(d.type) || 0) + 1));

  const data = Array.from(map.entries()).map(([name, value]) => ({ name, value }));

  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 600,
    tooltip: { trigger: "item" },
    legend: { top: 6 },
    series: [
      {
        name: "缺陷類型",
        type: "pie",
        radius: ["30%", "70%"],
        center: ["50%", "56%"],
        data,
        label: { formatter: "{b}\n{d}%" },
        emphasis: { scale: true },
      },
    ],
  };
}

function buildSunburstOption(data) {
  return {
    animation: true,
    animationDuration: 700,
    animationDurationUpdate: 700,
    tooltip: {
      formatter: (p) => {
        const d = p?.data || {};
        const name = d.name || "";
        const cnt = d.__taskCount ?? d.value ?? 0;
        const hrs = d.__totalHours ?? 0;
        const overdue = d.__overdueCount ?? 0;
        const risk = d.__avgRisk ?? 0;
        const path = d.__path || "";
        return [
          `<div style="font-weight:700;margin-bottom:4px;">${name}</div>`,
          `路徑：${path}`,
          `任務數：${cnt}`,
          `總工時：${hrs}`,
          `逾期：${overdue}`,
          `平均風險：${risk}`,
        ].join("<br/>");
      },
    },
    series: [
      {
        type: "sunburst",
        data,
        radius: [0, "90%"],
        center: ["50%", "56%"],
        sort: null,
        emphasis: { focus: "ancestor" },
        label: { rotate: "radial", minAngle: 10 },
        levels: [
          {},
          { r0: "0%", r: "28%" },
          { r0: "28%", r: "52%" },
          { r0: "52%", r: "72%" },
          { r0: "72%", r: "90%" },
        ],
      },
    ],
  };
}

function buildGradeGaugeOption(score, grade) {
  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 600,
    tooltip: { formatter: "{b}: {c}" },
    series: [
      {
        name: "總分",
        type: "gauge",
        center: ["50%", "58%"],
        radius: "88%",
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: { lineStyle: { width: 14 } },
        axisTick: { distance: -18, length: 7 },
        splitLine: { distance: -18, length: 14 },
        axisLabel: { distance: -30 },
        pointer: { width: 5, length: "62%" },
        detail: {
          valueAnimation: true,
          formatter: (v) => `Grade ${grade}\n${Math.round(v)} 分`,
          fontSize: 16,
          offsetCenter: [0, "30%"],
        },
        title: { offsetCenter: [0, "62%"], fontSize: 12 },
        data: [{ value: score, name: "整體健康" }],
      },
    ],
  };
}

function buildMultiGaugeOption(metrics) {
  // 4個小儀表（用同一張圖）
  const positions = [
    { center: ["25%", "55%"], key: "進度" },
    { center: ["50%", "55%"], key: "品質" },
    { center: ["75%", "55%"], key: "風險" },
    { center: ["50%", "80%"], key: "效率" },
  ];

  const map = new Map(metrics.map((m) => [m.key, m.score]));

  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 600,
    tooltip: { formatter: "{b}: {c}" },
    series: positions.map((p, idx) => ({
      type: "gauge",
      center: p.center,
      radius: idx === 3 ? "44%" : "38%",
      min: 0,
      max: 100,
      splitNumber: 4,
      axisLine: { lineStyle: { width: 10 } },
      axisTick: { distance: -12, length: 6 },
      splitLine: { distance: -12, length: 10 },
      axisLabel: { distance: -20, fontSize: 10 },
      pointer: { width: 4, length: "60%" },
      title: { fontSize: 12, offsetCenter: [0, "70%"] },
      detail: { valueAnimation: true, fontSize: 14, offsetCenter: [0, "18%"] },
      data: [{ value: map.get(p.key) ?? 0, name: p.key }],
    })),
  };
}

function buildGanttOption(categories, data) {
  const cat = categories;

  const itemHeight = 18;

  function renderItem(params, api) {
    const yIndex = api.value(2);
    const start = api.value(0);
    const end = api.value(1);

    const startCoord = api.coord([start, yIndex]);
    const endCoord = api.coord([end, yIndex]);

    const height = itemHeight;
    const rectShape = echarts.graphic.clipRectByRect(
      {
        x: startCoord[0],
        y: startCoord[1] - height / 2,
        width: endCoord[0] - startCoord[0],
        height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );

    return (
      rectShape && {
        type: "rect",
        shape: rectShape,
        style: api.style(),
      }
    );
  }

  const seriesData = data.map((t) => {
    return {
      name: t.taskTitle,
      value: [t.start, t.end, t.y],
      taskId: t.taskId,
      status: t.status,
      progress: t.progress,
      riskScore: t.riskScore,
      projectName: t.projectName,
      ownerName: t.ownerName,
      tooltip: {
        formatter: () => {
          return [
            `<div style="font-weight:700;margin-bottom:4px;">${t.taskId}</div>`,
            `${t.taskTitle}`,
            `專案：${t.projectName}`,
            `負責人：${t.ownerName}`,
            `狀態：${t.status} / 進度：${t.progress}%`,
            `風險：${t.riskScore}`,
            `期間：${formatYMD(t.start)} ～ ${formatYMD(t.end)}`,
          ].join("<br/>");
        },
      },
      itemStyle: {
        opacity: t.taskId === drilldown.selectedTaskId ? 1 : 0.85,
      },
    };
  });

  return {
    animation: true,
    animationDuration: 650,
    animationDurationUpdate: 650,
    tooltip: { trigger: "item" },
    grid: { left: 140, right: 20, top: 20, bottom: 24 },
    xAxis: { type: "time", axisLabel: { hideOverlap: true } },
    yAxis: {
      type: "category",
      data: cat,
      axisLabel: { width: 120, overflow: "truncate" },
    },
    dataZoom: [
      { type: "inside", xAxisIndex: 0 },
      { type: "slider", xAxisIndex: 0, height: 18, bottom: 0 },
    ],
    series: [
      {
        type: "custom",
        name: "任務",
        renderItem,
        itemStyle: {
          // 不指定顏色（依你的規則），讓 ECharts 自己配色
        },
        encode: { x: [0, 1], y: 2 },
        data: seriesData,
      },
    ],
  };
}

/* -----------------------------
 * 圖表互動（點擊→鑽取）
 * ----------------------------- */
function onTrendRowClick(e) {
  const row = e?.data;
  if (!row?.date) return;
  drilldown.selectedDate = row.date;
  drilldown.selectedTaskId = null;
}

function onRankRowClick(e) {
  const row = e?.data;
  if (!row?.memberId) return;
  filters.ownerId = row.memberId;
  clearDrilldown();
}

function onDefectRowClick(e) {
  const row = e?.data;
  if (!row?.defectId) return;
  // 點缺陷列：直接把關鍵字設成該缺陷標題，方便你看到它關聯的東西
  filters.keyword = row.title || row.defectId;
}

function onSunburstRowClick(e) {
  const row = e?.data;
  if (!row?.path) return;
  drilldown.selectedSunburstPath = row.path;
  drilldown.selectedTaskId = null;
}

function onMetricRowClick(e) {
  const row = e?.data;
  if (!row?.key) return;
  drilldown.selectedGaugeKey = row.key;
  drilldown.selectedTaskId = null;
}

function onTaskRowClick(e) {
  const row = e?.data;
  if (!row?.taskId) return;
  drilldown.selectedTaskId = row.taskId;
}

function pickFromEchartsName(payload) {
  const name = payload?.name;
  if (!name) return null;
  return name;
}

/* -----------------------------
 * 建立與更新所有圖表
 * ----------------------------- */
function bindChartEvents() {
  const tc = trendChart.getInstance();
  const bc = barChart.getInstance();
  const pc = pieChart.getInstance();
  const sc = sunburstChart.getInstance();
  const mc = multiChart.getInstance();
  const gc = ganttChart.getInstance();

  if (tc) {
    tc.off("click");
    tc.on("click", (p) => {
      const axis = p?.name;
      if (!axis) return;
      drilldown.selectedDate = axis;
      drilldown.selectedTaskId = null;
    });
  }

  if (bc) {
    bc.off("click");
    bc.on("click", (p) => {
      const memberName = pickFromEchartsName(p);
      if (!memberName) return;
      const m = members.find((x) => x.memberName === memberName);
      if (m) {
        filters.ownerId = m.memberId;
        clearDrilldown();
      }
    });
  }

  if (pc) {
    pc.off("click");
    pc.on("click", (p) => {
      const t = pickFromEchartsName(p);
      if (!t) return;
      drilldown.selectedDefectType = t;
    });
  }

  if (sc) {
    sc.off("click");
    sc.on("click", (p) => {
      const data = p?.data;
      const path = data?.__path || "";
      if (!path) return;
      drilldown.selectedSunburstPath = path;
      drilldown.selectedTaskId = null;
    });
  }

  if (mc) {
    mc.off("click");
    mc.on("click", (p) => {
      const key = p?.data?.name || p?.name;
      if (!key) return;
      if (["進度", "品質", "風險", "效率"].includes(key)) {
        drilldown.selectedGaugeKey = key;
        drilldown.selectedTaskId = null;
      }
    });
  }

  if (gc) {
    gc.off("click");
    gc.on("click", (p) => {
      const d = p?.data;
      const taskId = d?.taskId;
      if (!taskId) return;
      drilldown.selectedTaskId = taskId;
    });
  }
}

function updateCharts() {
  trendChart.setOption(buildTrendOption(trendRows.value));
  barChart.setOption(buildBarOption(rankRows.value));
  pieChart.setOption(buildPieOption(filteredDefects.value));
  sunburstChart.setOption(buildSunburstOption(sunburstData.value));
  gradeChart.setOption(buildGradeGaugeOption(kpis.value.totalScore, kpis.value.grade));
  multiChart.setOption(buildMultiGaugeOption(metricRows.value));

  const gantt = buildGanttSeries(filteredTasks.value);
  ganttChart.setOption(buildGanttOption(gantt.categories, gantt.data));

  bindChartEvents();
}

/* -----------------------------
 * 生命週期
 * ----------------------------- */
onMounted(async () => {
  await nextTick();
  trendChart.init();
  barChart.init();
  pieChart.init();
  sunburstChart.init();
  gradeChart.init();
  multiChart.init();
  ganttChart.init();

  updateCharts();
});

watch(
  () => [
    filters.dateRange?.[0]?.getTime?.(),
    filters.dateRange?.[1]?.getTime?.(),
    filters.projectId,
    filters.department,
    filters.ownerId,
    filters.status,
    filters.keyword,
    drilldown.selectedDate,
    drilldown.selectedDefectType,
    drilldown.selectedSunburstPath,
    drilldown.selectedGaugeKey,
    drilldown.selectedTaskId,
    ganttMode.value,
    ganttLimit.value,
  ],
  () => {
    updateCharts();
  },
  { deep: false }
);

onBeforeUnmount(() => {
  trendChart.dispose();
  barChart.dispose();
  pieChart.dispose();
  sunburstChart.dispose();
  gradeChart.dispose();
  multiChart.dispose();
  ganttChart.dispose();
});
</script>

<style scoped>
/* 讓 PrimeVue 輸入元件在 Tailwind 容器內更一致（不動你的全域主題） */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar) {
  width: 100%;
}
</style>
