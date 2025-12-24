<!-- src/components/layouts/Header.vue -->
<template>
  <div class="flex w-full items-center justify-between gap-4">
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
        @click="onToggleSidebar"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>

      <div class="flex min-w-0 flex-1 items-center gap-3">
        <div class="relative min-w-0 flex-1">
          <MagnifyingGlassIcon
            class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="keyword"
            type="text"
            placeholder="Search or type command..."
            class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
          <div
            class="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 md:flex"
          >
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        @click="onClickTheme"
      >
        <MoonIcon class="h-5 w-5" />
      </button>

      <div class="relative" data-bell-menu-root>
        <button
          type="button"
          class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          @click="onClickBell"
        >
          <BellIcon class="h-5 w-5" />
          <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500"></span>
        </button>

        <div
          v-if="openBellMenu"
          class="absolute right-0 top-12 w-90 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div class="flex items-center justify-between px-5 py-4">
            <div class="text-base font-extrabold text-slate-900">Notification</div>

            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              @click="openBellMenu = false"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="h-px bg-slate-100"></div>

          <div class="max-h-80 overflow-y-auto px-4 py-3">
            <button
              v-for="n in notifications"
              :key="n.id"
              type="button"
              class="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50"
            >
              <div
                class="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100"
              >
                <img class="h-full w-full object-cover" :src="n.avatarUrl" alt="avatar" />
                <span
                  class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white"
                  :class="n.dotColorClass"
                ></span>
              </div>

              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <div class="min-w-0 text-sm font-semibold text-slate-900">
                  <span class="font-extrabold text-slate-900">{{ n.actor }}</span>
                  <span class="text-slate-600"> requests permission to </span>
                  <span class="text-slate-900">{{ n.action }}</span>
                </div>

                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span>{{ n.category }}</span>
                  <span>•</span>
                  <span>{{ n.timeAgo }}</span>
                </div>
              </div>
            </button>
          </div>

          <div class="px-4 pb-4 pt-2">
            <button
              type="button"
              class="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              查看全部通知
            </button>
          </div>
        </div>
      </div>

      <div class="relative" data-user-menu-root>
        <button
          type="button"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="openUserMenu = !openUserMenu"
        >
          <img class="h-8 w-8 rounded-full object-cover" :src="avatarUrl" alt="avatar" />
          <span class="hidden max-w-30 truncate md:block">{{ userName }}</span>
          <ChevronDownIcon class="h-4 w-4 text-slate-500" />
        </button>

        <div
          v-if="openUserMenu"
          class="absolute right-0 top-12 w-55 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div class="px-4 py-3">
            <div class="text-sm font-semibold text-slate-900">{{ userName }}</div>
            <div class="text-xs text-slate-500">{{ userRole }}</div>
          </div>

          <div class="h-px bg-slate-100"></div>

          <button
            type="button"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            @click="goProfile"
          >
            <UserCircleIcon class="h-5 w-5 text-slate-500" />
            Profile
          </button>

          <button
            type="button"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            @click="goSettings"
          >
            <Cog6ToothIcon class="h-5 w-5 text-slate-500" />
            Settings
          </button>

          <div class="h-px bg-slate-100"></div>

          <button
            type="button"
            class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
            @click="logout"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  MoonIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const keyword = ref("");
const openUserMenu = ref(false);
const openBellMenu = ref(false);

const userName = computed(() => authStore.userName);
const userRole = computed(() => authStore.userRoleTitle);
const avatarUrl = computed(() => authStore.userAvatarUrl);

const notifications = ref([
  {
    id: "n1",
    actor: "王小明",
    action: "修改專案－Nganter App",
    category: "專案",
    timeAgo: "5 分鐘前",
    avatarUrl: "https://i.pravatar.cc/80?img=11",
    dotColorClass: "bg-emerald-500",
  },
  {
    id: "n2",
    actor: "陳怡君",
    action: "申請專案權限－Nganter App",
    category: "專案",
    timeAgo: "5 分鐘前",
    avatarUrl: "https://i.pravatar.cc/80?img=32",
    dotColorClass: "bg-red-500",
  },
  {
    id: "n3",
    actor: "林志豪",
    action: "更新專案設定－Nganter App",
    category: "專案",
    timeAgo: "5 分鐘前",
    avatarUrl: "https://i.pravatar.cc/80?img=47",
    dotColorClass: "bg-emerald-500",
  },
  {
    id: "n4",
    actor: "張雅婷",
    action: "請求變更專案－Nganter App",
    category: "專案",
    timeAgo: "5 分鐘前",
    avatarUrl: "https://i.pravatar.cc/80?img=8",
    dotColorClass: "bg-emerald-500",
  },
]);

const closeMenuOnOutside = (e) => {
  const el = e.target;
  if (!el) return;

  const clickedInsideUser = el.closest && el.closest("[data-user-menu-root]");
  const clickedInsideBell = el.closest && el.closest("[data-bell-menu-root]");

  if (!clickedInsideUser) openUserMenu.value = false;
  if (!clickedInsideBell) openBellMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeMenuOnOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenuOnOutside, true);
});

const onToggleSidebar = () => {
  console.log("[Header] toggle sidebar clicked");
};

const onClickTheme = () => {
  console.log("[Header] theme clicked");
};

const onClickBell = () => {
  openUserMenu.value = false;
  openBellMenu.value = !openBellMenu.value;
  console.log("[Header] bell clicked");
};

const goProfile = () => {
  openUserMenu.value = false;
  openBellMenu.value = false;
  router.push("/user");
};

const goSettings = () => {
  openUserMenu.value = false;
  openBellMenu.value = false;
  router.push("/auth");
};

const logout = () => {
  openUserMenu.value = false;
  openBellMenu.value = false;

  authStore.logout();

  router.replace("/signin");
};
</script>
