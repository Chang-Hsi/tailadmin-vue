<!-- src/layouts/LoginLayout.vue -->
<template>
  <div class="flex min-h-screen w-full items-stretch bg-slate-50">
    <main class="flex min-h-screen w-full flex-col">
      <div class="flex w-full flex-1 items-center justify-center">
        <div
          class="flex w-full h-full overflow-hidden bg-white shadow-sm ring-1 ring-slate-200"
        >
          <div class="hidden w-[44%] flex-col justify-between bg-slate-900 p-10 lg:flex">
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10"
              >
                <div class="h-6 w-6 rounded-lg">
                  <LockClosedIcon class="text-white" />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-lg font-extrabold tracking-wide text-white">
                  TailAdmin
                </div>
                <div class="text-sm text-white/70">Vue + Tailwind + PrimeVue</div>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <div
                class="text-3xl font-extrabold leading-tight text-white items-center mx-auto"
              >
                TailAdmin
              </div>
              <div class="mt-3 flex flex-col gap-2 items-center">
                <div
                  class="flex w-125 items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div class="h-10 w-10 rounded-2xl bg-white/10">
                    <UserCircleIcon class="text-white" />
                  </div>
                  <div class="flex flex-col">
                    <div class="text-sm font-bold text-white">權限與角色</div>
                    <div class="text-xs text-white/70">RBAC / Matrix / 概覽頁</div>
                  </div>
                </div>

                <div
                  class="flex w-125 items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div class="h-10 w-10 rounded-2xl bg-white/10">
                    <ChartBarSquareIcon class="text-white" />
                  </div>
                  <div class="flex flex-col">
                    <div class="text-sm font-bold text-white">儀表板</div>
                    <div class="text-xs text-white/70">ECharts 多圖表 + 列表</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-xs text-white/50">© TailAdmin Demo</div>
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <RouterView />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
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
</script>
