// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "@/views/DashboardView.vue";
import CalendarView from "@/views/CalendarView.vue";
import ProfileView from "@/views/ProfileView.vue";
import UserView from "@/views/UserView.vue";
import ChartsView from "@/views/ChartsView.vue";
import UiElementsView from "@/views/UiElementsView.vue";
import AuthView from "@/views/AuthView.vue";
import SettingsView from "@/views/SettingsView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import SignInView from "@/views/SignInView.vue";

const routes = [
  {
    path: "/signin",
    name: "SignIn",
    component: SignInView,
    meta: { title: "Sign In", layout: "login", public: true },
  },
  {
    path: "/",
    name: "Dashboard",
    component: DashboardView,
    meta: { title: "Dashboard", layout: "default", requiresAuth: true },
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: CalendarView,
    meta: { title: "Calendar", layout: "default", requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { title: "User Profile", layout: "default", requiresAuth: true },
  },
  {
    path: "/pokemon/:id",
    name: "Pokemon",
    component: () => import("@/views/PokemonView.vue"),
    meta: { title: "Pokemon", layout: "default", requiresAuth: true },
  },
  {
    path: "/charts",
    name: "Charts",
    component: ChartsView,
    meta: { title: "Charts", layout: "default", requiresAuth: true },
  },
  {
    path: "/ui-elements",
    name: "UiElements",
    component: UiElementsView,
    meta: { title: "UI Elements", layout: "default", requiresAuth: true },
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthView,
    meta: { title: "Authentication", layout: "default", requiresAuth: true },
  },
  {
    path: "/user",
    name: "User",
    component: UserView,
    meta: { title: "User Profile", layout: "default", requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsView,
    meta: { title: "Settings", layout: "default", requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
    meta: { title: "Not Found", layout: "login", public: true },
  },
];

const router = createRouter({
  // ✅ 關鍵：一定要吃到 Vite 的 base（你 vite.config.js 的 base 會變成 BASE_URL）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

function isAuthed() {
  try {
    return localStorage.getItem("tailadmin_auth") === "1";
  } catch (e) {
    return false;
  }
}

router.beforeEach((to) => {
  const authed = isAuthed();

  if (to?.meta?.public) {
    if (to.name === "SignIn" && authed) return { path: "/" };
    return true;
  }

  if (to?.meta?.requiresAuth && !authed) {
    return { path: "/signin", query: { redirect: to.fullPath } };
  }

  return true;
});

router.afterEach((to) => {
  const title = to?.meta?.title ? `${to.meta.title} - TailAdmin` : "TailAdmin";
  document.title = title;
});

export default router;
