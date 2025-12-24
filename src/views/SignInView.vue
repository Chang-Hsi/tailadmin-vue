<!-- src/views/SignInView.vue -->
<template>
  <div class="flex w-full flex-1 items-center justify-center">
    <div class="flex w-full max-w-130 flex-col">
      <div class="flex flex-col gap-1">
        <div
          class="text-[22px] font-extrabold tracking-wide text-slate-900 lg:text-[26px]"
        >
          登入
        </div>
        <div class="text-sm mt-2 text-slate-500">使用示範帳密登入：0000 / 0000</div>
      </div>

      <div class="mt-6 flex w-full flex-col gap-4 bg-white">
        <div
          v-if="errorText"
          class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100"
        >
          {{ errorText }}
        </div>

        <div class="flex w-full flex-col gap-2">
          <div class="text-sm font-bold text-slate-700">帳號</div>
          <input
            v-model="form.account"
            type="text"
            inputmode="numeric"
            autocomplete="username"
            class="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            placeholder="請輸入帳號"
          />
        </div>

        <div class="flex w-full flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="text-sm font-bold text-slate-700">密碼</div>
            <button
              type="button"
              class="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
              @click="onClickForgot"
            >
              忘記密碼？
            </button>
          </div>

          <Password
            v-model="form.password"
            :feedback="false"
            toggleMask
            class="ta-password h-11 w-full rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"
            inputClass="h-full w-full bg-transparent text-sm text-slate-900 outline-none"
            placeholder="請輸入密碼"
            @keydown.enter="onSubmit"
          />
        </div>

        <div class="flex w-full items-center justify-between gap-3">
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300"
            />
            記住我
          </label>
        </div>

        <button
          type="button"
          class="mt-1 flex h-11 w-full items-center justify-center rounded-2xl bg-indigo-600 text-sm font-extrabold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
          @click="onSubmit"
        >
          <span v-if="loading">登入中…</span>
          <span v-else>登入</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import Password from "primevue/password";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const errorText = ref("");

const form = reactive({
  account: "",
  password: "",
  remember: true,
});

function onClickForgot() {
  alert("Demo：請輸入 0000 / 0000");
}

async function onSubmit() {
  errorText.value = "";

  const account = String(form.account || "").trim();
  const password = String(form.password || "").trim();

  if (!account || !password) {
    errorText.value = "請輸入帳號與密碼";
    return;
  }

  loading.value = true;

  try {
    const ok = authStore.loginMock(account, password, { remember: form.remember });
    if (!ok) {
      errorText.value = "帳號或密碼錯誤（請輸入 0000 / 0000）";
      return;
    }

    const redirect = route.query.redirect ? String(route.query.redirect) : "/";
    router.replace(redirect);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.ta-password :deep(.p-inputtext) {
  border: 0 !important;
  box-shadow: none !important;
  outline: none !important;
  background: transparent !important;

  height: 100% !important;

  /* 對齊你帳號 input 的 px-4 */
  padding-left: 1rem !important;

  /* 右側留空間給眼睛 icon（避免文字貼到 icon） */
  padding-right: 2.5rem !important;
}

.ta-password :deep(.p-inputtext:focus) {
  border: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}

.ta-password :deep(.p-password-toggle-mask-icon) {
  right: 1rem;
}
</style>
