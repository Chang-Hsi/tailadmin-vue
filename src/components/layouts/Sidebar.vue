<template>
  <div class="flex h-full w-full flex-col">
    <div class="flex h-18 items-center gap-3 px-5">
      <div
        class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"
      >
        <Squares2X2Icon class="h-5 w-5" />
      </div>
      <div class="flex flex-col leading-tight">
        <div class="text-base font-extrabold tracking-wide text-slate-900">TailAdmin</div>
        <div class="text-xs text-slate-500">Vue + Tailwind</div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-3 pb-4">
      <div
        class="px-2 pb-2 pt-2 text-[11px] font-semibold tracking-widest text-slate-400"
      >
        主選單
      </div>

      <div class="flex flex-col gap-1">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="dashboardActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'"
          @click="openDashboard = !openDashboard"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              dashboardActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <ChartBarSquareIcon class="h-5 w-5" />
          </div>

          <div class="min-w-0 flex-1 text-left">儀表板</div>

          <ChevronDownIcon
            class="h-4 w-4 transition"
            :class="openDashboard ? 'rotate-180' : ''"
          />
        </button>

        <div v-show="openDashboard" class="ml-11 flex flex-col gap-1">
          <RouterLink
            to="/"
            class="flex items-center rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
            :class="isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'"
          >
            市場儀表板
          </RouterLink>
        </div>

        <RouterLink
          to="/calendar"
          class="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="
            isActive('/calendar') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
          "
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              isActive('/calendar')
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <CalendarDaysIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">行事曆</div>
        </RouterLink>

        <RouterLink
          to="/profile"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="
            isActive('/profile') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
          "
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              isActive('/profile')
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <UserCircleIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">成員清單</div>
        </RouterLink>

        <RouterLink
          to="/user"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="isActive('/user') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              isActive('/user')
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <UserCircleIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">個人檔案</div>
        </RouterLink>

        <div
          class="mt-3 px-2 pb-2 pt-2 text-[11px] font-semibold tracking-widest text-slate-400"
        >
          其他
        </div>

        <RouterLink
          to="/charts"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="isActive('/charts') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              isActive('/charts')
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <PresentationChartLineIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">圖表中心</div>
        </RouterLink>

        <RouterLink
          to="/ui-elements"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="
            isActive('/ui-elements') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
          "
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              isActive('/ui-elements')
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <CubeIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">介面元件</div>
        </RouterLink>

        <RouterLink
          to="/auth"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
          :class="isActive('/auth') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :class="
              isActive('/auth')
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-600'
            "
          >
            <LockClosedIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">權限管理</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  Squares2X2Icon,
  ChartBarSquareIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  PresentationChartLineIcon,
  CubeIcon,
  LockClosedIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();

const openDashboard = ref(true);

const isActive = (path) => {
  return route.path === path;
};

const dashboardActive = computed(() => {
  return route.path === "/" || route.path.startsWith("/dashboard");
});

watch(
  () => route.path,
  () => {
    if (dashboardActive.value) openDashboard.value = true;
  }
);
</script>
