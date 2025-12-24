<template>
  <div class="flex w-full flex-col gap-4 lg:gap-6">
    <div class="flex w-full items-center justify-between">
      <div class="flex flex-col">
        <div class="text-xl font-extrabold tracking-wide text-slate-900 lg:text-2xl">
          行事曆
        </div>
        <div class="mt-1 text-sm text-slate-500">管理你的行程與活動</div>
      </div>

      <button
        type="button"
        class="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        @click="openCreateModal()"
      >
        <PlusIcon class="h-5 w-5" />
        新增活動
      </button>
    </div>

    <div class="flex w-full flex-col gap-4 lg:flex-row lg:gap-6">
      <div
        class="flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:p-5"
      >
        <div class="flex w-full items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              @click="goPrev"
              aria-label="上一個"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              @click="goNext"
              aria-label="下一個"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>

            <button
              type="button"
              class="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="goToday"
            >
              今天
            </button>

            <div class="ml-2 hidden text-base font-extrabold text-slate-900 lg:block">
              {{ headerTitle }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div
              class="flex items-center rounded-xl bg-slate-50 p-1 ring-1 ring-slate-200"
            >
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                :class="
                  viewMode === 'dayGridMonth'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-white'
                "
                @click="setView('dayGridMonth')"
              >
                月
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                :class="
                  viewMode === 'timeGridWeek'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-white'
                "
                @click="setView('timeGridWeek')"
              >
                週
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                :class="
                  viewMode === 'timeGridDay'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-white'
                "
                @click="setView('timeGridDay')"
              >
                日
              </button>
            </div>

            <div class="block text-sm font-extrabold text-slate-900 lg:hidden">
              {{ headerTitle }}
            </div>
          </div>
        </div>

        <div class="mt-4 w-full">
          <FullCalendar ref="calendarRef" :options="calendarOptions" />
        </div>
      </div>

      <div class="hidden w-[320px] shrink-0 lg:flex">
        <div
          class="flex w-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex items-center justify-between">
            <div class="text-base font-extrabold text-slate-900">活動清單</div>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
              @click="seedDemoEvents"
            >
              範例
            </button>
          </div>

          <div class="mt-3 flex flex-col gap-2">
            <div
              v-if="sortedEvents.length === 0"
              class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 ring-1 ring-slate-200"
            >
              尚無活動。點擊日期即可新增。
            </div>

            <button
              v-for="ev in sortedEvents"
              :key="ev.id"
              type="button"
              class="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
              @click="focusEvent(ev)"
            >
              <div class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500"></div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-extrabold text-slate-900">
                  {{ ev.title }}
                </div>
                <div class="mt-1 text-xs text-slate-500">
                  {{ formatEventRange(ev) }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="modal.open"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
      @keydown.esc="closeModal"
    >
      <div class="absolute inset-0 bg-slate-900/40" @click="closeModal"></div>

      <div
        class="relative w-full max-w-140 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 px-5 py-4"
        >
          <div class="flex flex-col">
            <div class="text-base font-extrabold text-slate-900">
              {{ modal.mode === "create" ? "新增活動" : "編輯活動" }}
            </div>
            <div class="mt-1 text-sm text-slate-500">
              {{ modalHint }}
            </div>
          </div>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            @click="closeModal"
            aria-label="關閉"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="flex flex-col gap-4 px-5 py-4">
          <div class="flex w-full flex-col gap-2">
            <div class="text-sm font-semibold text-slate-700">標題</div>
            <input
              v-model="form.title"
              type="text"
              placeholder="例如：團隊例會"
              class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div class="flex w-full flex-col gap-2">
            <div class="text-sm font-semibold text-slate-700">全天</div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex h-9 items-center rounded-xl border px-3 text-sm font-semibold transition"
                :class="
                  form.allDay
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                "
                @click="onToggleAllDay(true)"
              >
                是
              </button>
              <button
                type="button"
                class="flex h-9 items-center rounded-xl border px-3 text-sm font-semibold transition"
                :class="
                  !form.allDay
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                "
                @click="onToggleAllDay(false)"
              >
                否
              </button>
            </div>
          </div>

          <div class="flex w-full flex-col gap-3">
            <div class="flex w-full flex-col gap-2">
              <div class="text-sm font-semibold text-slate-700">開始</div>

              <DatePicker
                v-if="form.allDay"
                v-model="form.startDate"
                dateFormat="yy-mm-dd"
                placeholder="選擇日期"
                showIcon
                fluid
                inputClass="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />

              <DatePicker
                v-else
                v-model="form.startDate"
                dateFormat="yy-mm-dd"
                placeholder="選擇日期時間"
                showIcon
                showTime
                hourFormat="24"
                fluid
                inputClass="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div class="flex w-full flex-col gap-2">
              <div class="text-sm font-semibold text-slate-700">結束</div>

              <DatePicker
                v-if="form.allDay"
                v-model="form.endDate"
                dateFormat="yy-mm-dd"
                placeholder="選擇日期"
                showIcon
                fluid
                inputClass="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />

              <DatePicker
                v-else
                v-model="form.endDate"
                dateFormat="yy-mm-dd"
                placeholder="選擇日期時間"
                showIcon
                showTime
                hourFormat="24"
                fluid
                inputClass="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div
            v-if="errorMsg"
            class="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200"
          >
            {{ errorMsg }}
          </div>
        </div>

        <div
          class="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4"
        >
          <button
            v-if="modal.mode === 'edit'"
            type="button"
            class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            @click="deleteCurrent"
          >
            刪除
          </button>

          <div class="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="closeModal"
            >
              取消
            </button>

            <button
              type="button"
              class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              @click="submit"
            >
              {{ modal.mode === "create" ? "建立" : "儲存" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import DatePicker from "primevue/datepicker";

import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const calendarRef = ref(null);

const viewMode = ref("dayGridMonth");
const headerTitle = ref("");

const events = ref([
  {
    id: "1",
    title: "專案啟動會議",
    start: todayAt("10:00"),
    end: todayAt("11:00"),
    allDay: false,
  },
  {
    id: "2",
    title: "設計檢視",
    start: addDaysISO(new Date(), 2, "09:30"),
    end: addDaysISO(new Date(), 2, "10:30"),
    allDay: false,
  },
]);

const modal = reactive({
  open: false,
  mode: "create",
  editingId: null,
});

const form = reactive({
  title: "",
  allDay: true,
  startDate: null,
  endDate: null,
});

const errorMsg = ref("");

const modalHint = computed(() => {
  if (modal.mode === "edit") return "更新活動資訊，或直接刪除活動";
  return "點擊日期格可預填開始日期";
});

const sortedEvents = computed(() => {
  const list = [...events.value];
  list.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return list;
});

const calendarOptions = computed(() => {
  return {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: viewMode.value,
    height: "auto",
    nowIndicator: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: events.value,
    headerToolbar: false,

    datesSet(info) {
      headerTitle.value = info.view.title;
    },

    dateClick(info) {
      openCreateModal({ dateStr: info.dateStr });
    },

    select(info) {
      openCreateModal({ range: info });
    },

    eventClick(info) {
      const ev = info.event;
      openEditModal({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        allDay: ev.allDay,
      });
    },

    eventDrop(info) {
      syncEventFromCalendar(info.event);
    },

    eventResize(info) {
      syncEventFromCalendar(info.event);
    },
  };
});

function getApi() {
  return calendarRef.value ? calendarRef.value.getApi() : null;
}

function setView(next) {
  viewMode.value = next;
  const api = getApi();
  if (api) api.changeView(next);
}

function goPrev() {
  const api = getApi();
  if (api) api.prev();
}

function goNext() {
  const api = getApi();
  if (api) api.next();
}

function goToday() {
  const api = getApi();
  if (api) api.today();
}

function openCreateModal(payload = {}) {
  errorMsg.value = "";
  modal.open = true;
  modal.mode = "create";
  modal.editingId = null;

  form.title = "";
  form.allDay = true;

  const now = new Date();
  const base = payload?.dateStr ? fromISODate(payload.dateStr) : startOfDay(now);

  if (payload?.range) {
    const r = payload.range;
    form.allDay = !!r.allDay;

    if (form.allDay) {
      form.startDate = startOfDay(r.start);
      form.endDate = startOfDay(new Date(r.end.getTime() - 1));
    } else {
      form.startDate = new Date(r.start);
      form.endDate = new Date(r.end);
    }
    return;
  }

  form.startDate = new Date(base);
  form.endDate = new Date(base);
}

function openEditModal(payload) {
  errorMsg.value = "";
  modal.open = true;
  modal.mode = "edit";
  modal.editingId = payload.id;

  form.title = payload.title || "";
  form.allDay = !!payload.allDay;

  const s = payload.start ? new Date(payload.start) : null;
  const e = payload.end ? new Date(payload.end) : null;

  if (form.allDay) {
    form.startDate = s ? startOfDay(s) : null;
    form.endDate = e ? startOfDay(e) : form.startDate ? new Date(form.startDate) : null;
  } else {
    form.startDate = s ? new Date(s) : null;
    form.endDate = e ? new Date(e) : form.startDate ? new Date(form.startDate) : null;
  }
}

function closeModal() {
  modal.open = false;
  modal.editingId = null;
  errorMsg.value = "";
}

function onToggleAllDay(nextAllDay) {
  if (form.allDay === nextAllDay) return;

  form.allDay = nextAllDay;

  if (!form.startDate && !form.endDate) return;

  if (form.allDay) {
    if (form.startDate) form.startDate = startOfDay(form.startDate);
    if (form.endDate) form.endDate = startOfDay(form.endDate);
  } else {
    if (form.startDate) form.startDate = new Date(form.startDate);
    if (form.endDate) form.endDate = new Date(form.endDate);
  }
}

function submit() {
  errorMsg.value = "";

  const title = (form.title || "").trim();
  if (!title) {
    errorMsg.value = "請輸入標題";
    return;
  }

  if (!form.startDate) {
    errorMsg.value = "請選擇開始時間";
    return;
  }

  const normalized = normalizeFormDates();
  if (!normalized.ok) {
    errorMsg.value = normalized.message;
    return;
  }

  if (modal.mode === "create") {
    const id = String(Date.now());
    events.value = [
      ...events.value,
      {
        id,
        title,
        start: normalized.start,
        end: normalized.end,
        allDay: normalized.allDay,
      },
    ];
    closeModal();
    return;
  }

  if (modal.mode === "edit" && modal.editingId) {
    const id = modal.editingId;
    events.value = events.value.map((ev) => {
      if (ev.id !== id) return ev;
      return {
        ...ev,
        title,
        start: normalized.start,
        end: normalized.end,
        allDay: normalized.allDay,
      };
    });
    closeModal();
  }
}

function deleteCurrent() {
  if (!modal.editingId) return;
  const id = modal.editingId;
  events.value = events.value.filter((ev) => ev.id !== id);
  closeModal();
}

function focusEvent(ev) {
  const api = getApi();
  if (!api) return;
  api.gotoDate(new Date(ev.start));
}

function seedDemoEvents() {
  const base = new Date();
  events.value = [
    {
      id: "1",
      title: "專案啟動會議",
      start: addDaysISO(base, 0, "10:00"),
      end: addDaysISO(base, 0, "11:00"),
      allDay: false,
    },
    {
      id: "2",
      title: "月報會議",
      start: addDaysISO(base, 3, "09:00"),
      end: addDaysISO(base, 3, "10:00"),
      allDay: false,
    },
    {
      id: "3",
      title: "全天活動",
      start: toISODate(addDays(base, 6)),
      end: toISODate(addDays(base, 6)),
      allDay: true,
    },
  ];
}

function syncEventFromCalendar(fcEvent) {
  const id = fcEvent.id;
  const found = events.value.find((x) => x.id === id);
  if (!found) return;

  const startISO = fcEvent.start ? fcEvent.start.toISOString() : found.start;
  const endISO = fcEvent.end ? fcEvent.end.toISOString() : null;

  const next = {
    ...found,
    title: fcEvent.title,
    allDay: !!fcEvent.allDay,
    start: found.allDay ? toISODate(fcEvent.start) : startISO,
    end: endISO
      ? found.allDay
        ? toISODate(new Date(fcEvent.end.getTime() - 1))
        : endISO
      : found.end,
  };

  events.value = events.value.map((x) => (x.id === id ? next : x));
}

function normalizeFormDates() {
  const allDay = !!form.allDay;

  if (allDay) {
    const s = form.startDate ? startOfDay(form.startDate) : null;
    const e = form.endDate ? startOfDay(form.endDate) : s;

    if (!s) return { ok: false, message: "請選擇開始日期" };
    if (!e) return { ok: false, message: "請選擇結束日期" };

    if (e.getTime() < s.getTime())
      return { ok: false, message: "結束日期必須大於或等於開始日期" };

    return { ok: true, allDay: true, start: toISODate(s), end: toISODate(e) };
  }

  const s = form.startDate ? new Date(form.startDate) : null;
  const e = form.endDate ? new Date(form.endDate) : s;

  if (!s || Number.isNaN(s.getTime()))
    return { ok: false, message: "開始時間格式不正確" };
  if (!e || Number.isNaN(e.getTime()))
    return { ok: false, message: "結束時間格式不正確" };

  if (e.getTime() < s.getTime())
    return { ok: false, message: "結束時間必須大於或等於開始時間" };

  return { ok: true, allDay: false, start: s.toISOString(), end: e.toISOString() };
}

function formatEventRange(ev) {
  if (ev.allDay) return ev.start === ev.end ? ev.start : `${ev.start} ~ ${ev.end}`;
  const s = new Date(ev.start);
  const e = ev.end ? new Date(ev.end) : null;
  const sText = `${toISODate(s)} ${pad2(s.getHours())}:${pad2(s.getMinutes())}`;
  if (!e) return sText;
  const eText = `${toISODate(e)} ${pad2(e.getHours())}:${pad2(e.getMinutes())}`;
  return `${sText} ~ ${eText}`;
}

function todayAt(hhmm) {
  const d = new Date();
  const [h, m] = hhmm.split(":").map((x) => Number(x));
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function addDaysISO(base, days, hhmm) {
  const d = addDays(base, days);
  const [h, m] = hhmm.split(":").map((x) => Number(x));
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fromISODate(yyyyMMdd) {
  const s = String(yyyyMMdd || "");
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Date();
  const y = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  return new Date(y, mm - 1, dd, 0, 0, 0, 0);
}
</script>

<style scoped>
:deep(.fc) {
  --fc-border-color: #e2e8f0;
  --fc-page-bg-color: transparent;
  --fc-today-bg-color: rgba(99, 102, 241, 0.08);
  --fc-event-bg-color: #4f46e5;
  --fc-event-border-color: #4f46e5;
  --fc-event-text-color: #ffffff;
  font-size: 14px;
}

:deep(.fc .fc-scrollgrid) {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

:deep(.fc .fc-col-header-cell) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.fc .fc-col-header-cell-cushion) {
  padding: 10px 0;
  color: #334155;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

:deep(.fc .fc-daygrid-day-number) {
  padding: 8px;
  font-weight: 800;
  color: #334155;
}

:deep(.fc .fc-daygrid-day) {
  background: #ffffff;
}

:deep(.fc .fc-day-other) {
  background: #fbfdff;
}

:deep(.fc .fc-daygrid-event) {
  border-radius: 10px;
  padding: 2px 6px;
}

:deep(.fc .fc-timegrid-axis-cushion),
:deep(.fc .fc-timegrid-slot-label) {
  color: #64748b;
  font-weight: 700;
}

:deep(.fc .fc-timegrid-slot) {
  height: 44px;
}
</style>
