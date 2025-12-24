<!-- src/views/UserView.vue -->
<template>
  <div class="flex w-full flex-col gap-4 bg-slate-50">
    <div class="flex w-full flex-col gap-1">
      <div class="text-[22px] font-extrabold tracking-wide text-slate-900 lg:text-[26px]">
        個人檔案
      </div>
      <div class="text-sm text-slate-500">顯示當前登入者的基本資訊與權限概覽</div>
    </div>

    <div
      class="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
    >
      <div class="relative h-18 w-full">
        <div class="absolute right-4 top-4 flex items-center gap-2">
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            @click="openEditModal"
          >
            編輯個人資料
          </button>
        </div>

        <div
          class="absolute left-4 bottom-0 flex w-full translate-y-1/2 items-end justify-between gap-3 pr-4"
        >
          <div class="flex items-end gap-4">
            <div
              class="h-24 w-24 overflow-hidden rounded-2xl bg-white ring-4 ring-white shadow-sm"
            >
              <img class="h-full w-full object-cover" :src="userAvatarUrl" alt="avatar" />
            </div>

            <div class="flex flex-col pb-2">
              <div class="text-xl font-extrabold text-slate-900 lg:text-2xl">
                {{ userName }}
              </div>
              <div class="text-sm font-semibold text-slate-600">{{ userRoleTitle }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-14.5 w-full"></div>

      <div class="flex w-full flex-col gap-4 p-4 lg:p-6">
        <div class="flex w-full flex-col gap-3 lg:flex-row lg:items-stretch">
          <div
            class="flex w-full flex-col gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:w-90 lg:min-w-90"
          >
            <div class="flex w-full items-start justify-between gap-3">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <div class="text-base font-extrabold text-slate-900">基本資訊</div>
              </div>
              <button
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="openEditModal"
              >
                編輯
              </button>
            </div>

            <div class="flex w-full flex-col gap-3">
              <div class="flex w-full items-start gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200"
                >
                  <UserIcon class="h-5 w-5 text-slate-600" />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="text-sm font-semibold text-slate-500">名稱</div>
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ userName }}
                  </div>
                </div>
              </div>

              <div class="flex w-full items-start gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200"
                >
                  <BriefcaseIcon class="h-5 w-5 text-slate-600" />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="text-sm font-semibold text-slate-500">職稱</div>
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ userRoleTitle }}
                  </div>
                </div>
              </div>

              <div class="flex w-full items-start gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200"
                >
                  <EnvelopeIcon class="h-5 w-5 text-slate-600" />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="text-sm font-semibold text-slate-500">Email（展示用）</div>
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ displayEmail }}
                  </div>
                </div>
              </div>

              <div class="flex w-full items-start gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200"
                >
                  <PhoneIcon class="h-5 w-5 text-slate-600" />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="text-sm font-semibold text-slate-500">電話（展示用）</div>
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ displayPhone }}
                  </div>
                </div>
              </div>

              <div class="flex w-full items-start gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200"
                >
                  <MapPinIcon class="h-5 w-5 text-slate-600" />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="text-sm font-semibold text-slate-500">地點（展示用）</div>
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ displayLocation }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex w-full flex-1 flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200"
          >
            <div class="flex w-full items-start justify-between gap-3">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <div class="text-base font-extrabold text-slate-900">權限概覽</div>
              </div>

              <button
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="goAuthPage"
              >
                前往權限管理
              </button>
            </div>

            <div class="flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap">
              <div
                class="flex w-full flex-col gap-1 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:w-60"
              >
                <div class="text-sm font-semibold text-slate-500">角色數</div>
                <div class="text-2xl font-extrabold text-slate-900">{{ rolesCount }}</div>
                <div class="text-sm text-slate-500">可用角色（roles）</div>
              </div>

              <div
                class="flex w-full flex-col gap-1 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:w-60"
              >
                <div class="text-sm font-semibold text-slate-500">模組數</div>
                <div class="text-2xl font-extrabold text-slate-900">
                  {{ modulesCount }}
                </div>
                <div class="text-sm text-slate-500">系統模組（modules）</div>
              </div>

              <div
                class="flex w-full flex-col gap-1 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:w-60"
              >
                <div class="text-sm font-semibold text-slate-500">權限點總數</div>
                <div class="text-2xl font-extrabold text-slate-900">
                  {{ permissionCount }}
                </div>
                <div class="text-sm text-slate-500">permission keys</div>
              </div>

              <div
                class="flex w-full flex-col gap-1 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:flex-1"
              >
                <div class="text-sm font-semibold text-slate-500">角色授權排行</div>
                <div class="flex w-full flex-col gap-2">
                  <div
                    v-for="row in roleRank"
                    :key="row.roleId"
                    class="flex w-full items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"
                  >
                    <div class="flex min-w-0 flex-1 items-center gap-2">
                      <span class="truncate text-sm font-bold text-slate-900">{{
                        row.roleName
                      }}</span>
                      <span class="text-sm font-semibold text-slate-500"
                        >（{{ row.granted }} / {{ permissionCount }}）</span
                      >
                    </div>
                    <div class="w-35">
                      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          class="h-2 rounded-full bg-indigo-600"
                          :style="{ width: row.rate + '%' }"
                        ></div>
                      </div>
                      <div
                        class="mt-1 text-right text-[11px] font-semibold text-slate-500"
                      >
                        {{ row.rate }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-sm text-slate-500">
                  以上為各角色在 grants 中被授權的權限點數量比例
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 lg:p-6"
        >
          <div class="flex w-full items-start justify-between gap-3">
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <div class="text-base font-extrabold text-slate-900">系統角色（Roles）</div>
              <div class="text-sm text-slate-500">
                快速檢視角色說明（資料來源：authStore.roles）
              </div>
            </div>
          </div>

          <div class="flex w-full flex-col gap-3">
            <div
              v-for="r in roles"
              :key="r.id"
              class="flex w-full flex-col gap-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
            >
              <div class="flex w-full items-start justify-between gap-3">
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-extrabold text-slate-900">{{
                      r.name
                    }}</span>
                    <span
                      class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
                    >
                      {{ r.id }}
                    </span>
                  </div>
                  <div class="text-sm text-slate-600">{{ r.desc }}</div>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
                  >
                    授權：{{ roleGrantedCountMap[r.id] || 0 }}
                  </span>
                </div>
              </div>

              <div class="flex w-full flex-wrap items-center gap-2">
                <span class="text-sm font-semibold text-slate-500">模組覆蓋：</span>
                <span
                  v-for="m in modules"
                  :key="m.key"
                  class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
                >
                  {{ m.name }}：{{ getRoleModuleGranted(r.id, m.key) }}/{{
                    m.permissions.length
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 lg:flex-row lg:items-stretch lg:gap-4 lg:p-6"
        >
          <div
            class="flex w-full flex-col gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
          >
            <div class="flex w-full items-center justify-between gap-3">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <div class="text-base font-extrabold text-slate-900">
                  模組清單（Modules）
                </div>
                <div class="text-sm text-slate-500">資料來源：authStore.modules</div>
              </div>
              <span
                class="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
              >
                {{ modulesCount }} 個模組
              </span>
            </div>

            <div class="flex w-full flex-col gap-2">
              <div
                v-for="m in modules"
                :key="m.key"
                class="flex w-full items-start justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200"
              >
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-extrabold text-slate-900">{{
                      m.name
                    }}</span>
                    <span
                      class="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
                    >
                      {{ m.key }}
                    </span>
                  </div>
                  <div class="text-sm text-slate-500">
                    權限點：{{ m.permissions.length }}
                  </div>
                </div>

                <button
                  type="button"
                  class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  @click="openMatrixModal(m)"
                >
                  查看矩陣
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between lg:p-6"
        >
          <div class="flex flex-col gap-1">
            <div class="text-sm font-extrabold text-slate-900">當前 Store 原始資料</div>
            <div class="text-sm text-slate-500">方便你確認此頁真的由 authStore 取值</div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
            >
              currentUser.id：{{ currentUserId }}
            </span>
            <span
              class="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
            >
              grants keys：{{ grantRoleCount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="editModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @mousedown.self="closeEditModal"
    >
      <div class="absolute inset-0 bg-slate-900/35"></div>

      <div
        class="relative mx-4 flex w-full max-w-190 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
      >
        <div class="flex items-start justify-between gap-3 px-6 pb-4 pt-5">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="text-xl font-extrabold text-slate-900">編輯個人資料</div>
            <div class="text-sm text-slate-500">更新你的資料，讓個人檔案保持最新。</div>
          </div>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            @click="closeEditModal"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="h-px bg-slate-100"></div>

        <div class="max-h-[70vh] w-full overflow-auto px-6 py-5">
          <div class="flex w-full flex-col gap-6">
            <div class="flex w-full flex-col gap-3">
              <div class="text-sm font-extrabold text-slate-900">個人資訊</div>

              <div class="flex w-full flex-col gap-3 lg:flex-row">
                <div class="flex w-full flex-col gap-1 lg:flex-1">
                  <label class="text-sm font-semibold text-slate-700">名字</label>
                  <input
                    v-model="editForm.firstName"
                    type="text"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    placeholder="請輸入名字"
                  />
                </div>

                <div class="flex w-full flex-col gap-1 lg:flex-1">
                  <label class="text-sm font-semibold text-slate-700">姓氏</label>
                  <input
                    v-model="editForm.lastName"
                    type="text"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    placeholder="請輸入姓氏"
                  />
                </div>
              </div>

              <div class="flex w-full flex-col gap-3 lg:flex-row">
                <div class="flex w-full flex-col gap-1 lg:flex-1">
                  <label class="text-sm font-semibold text-slate-700">職稱</label>
                  <input
                    v-model="editForm.roleTitle"
                    type="text"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    placeholder="請輸入職稱"
                  />
                </div>

                <div class="flex w-full flex-col gap-1 lg:flex-1">
                  <label class="text-sm font-semibold text-slate-700">頭像網址</label>
                  <input
                    v-model="editForm.avatarUrl"
                    type="text"
                    class="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div
                class="flex w-full flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div class="text-sm font-extrabold text-slate-900">預覽</div>
                <div class="flex w-full items-center gap-3">
                  <div
                    class="h-12 w-12 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
                  >
                    <img
                      class="h-full w-full object-cover"
                      :src="previewAvatarUrl"
                      alt="預覽"
                    />
                  </div>
                  <div class="flex min-w-0 flex-1 flex-col">
                    <div class="truncate text-sm font-extrabold text-slate-900">
                      {{ previewFullName }}
                    </div>
                    <div class="truncate text-sm font-semibold text-slate-600">
                      {{ editForm.roleTitle }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex w-full flex-col gap-3">
              <div class="text-sm font-extrabold text-slate-900">僅供顯示</div>

              <div class="flex w-full flex-col gap-3 lg:flex-row">
                <div class="flex w-full flex-col gap-1 lg:flex-1">
                  <label class="text-sm font-semibold text-slate-700">電子信箱</label>
                  <input
                    :value="displayEmail"
                    type="text"
                    disabled
                    class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
                  />
                </div>

                <div class="flex w-full flex-col gap-1 lg:flex-1">
                  <label class="text-sm font-semibold text-slate-700">手機</label>
                  <input
                    :value="displayPhone"
                    type="text"
                    disabled
                    class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="editError"
              class="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200"
            >
              {{ editError }}
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4"
        >
          <button
            type="button"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="closeEditModal"
          >
            關閉
          </button>

          <button
            type="button"
            class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-indigo-700"
            @click="saveEditModal"
          >
            儲存變更
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="matrixModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @mousedown.self="closeMatrixModal"
    >
      <div class="absolute inset-0 bg-slate-900/35"></div>

      <div
        class="relative mx-4 flex w-full max-w-275 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
      >
        <div class="flex items-start justify-between gap-3 px-6 pb-4 pt-5">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="text-xl font-extrabold text-slate-900">
              權限矩陣
              <span class="text-slate-400">·</span>
              <span class="text-slate-700">{{ matrixTitle }}</span>
            </div>
            <div class="text-sm text-slate-500">只讀顯示（Role × Permission）</div>
          </div>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            @click="closeMatrixModal"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="h-px bg-slate-100"></div>

        <div class="max-h-[72vh] w-full overflow-auto px-6 py-5">
          <div class="flex w-full flex-col gap-3">
            <div
              class="flex w-full flex-col gap-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
            >
              <div
                class="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
              >
                <div class="flex flex-col gap-1">
                  <div class="text-sm font-extrabold text-slate-900">模組資訊</div>
                  <div class="text-sm text-slate-600">
                    角色：{{ rolesCount }} · 權限點：{{ matrixPermCount }}
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
                  >
                    模組 key：{{ matrixKey }}
                  </span>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
                  >
                    已授權最多：{{ matrixTopRoleName }}
                  </span>
                </div>
              </div>
            </div>

            <div class="w-full overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <div class="w-full overflow-auto">
                <table class="min-w-full table-fixed">
                  <thead class="bg-slate-50">
                    <tr>
                      <th
                        class="w-90 border-b border-slate-200 px-4 py-3 text-left text-sm font-extrabold text-slate-700"
                      >
                        Permission
                      </th>
                      <th
                        v-for="r in roles"
                        :key="r.id"
                        class="w-45 border-b border-slate-200 px-3 py-3 text-left text-sm font-extrabold text-slate-700"
                      >
                        <div class="flex w-full flex-col">
                          <span class="truncate">{{ r.name }}</span>
                          <span class="text-[11px] font-semibold text-slate-500">{{
                            r.id
                          }}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="p in matrixPermissions"
                      :key="p.key"
                      class="odd:bg-white even:bg-slate-50"
                    >
                      <td class="border-b border-slate-100 px-4 py-3 align-top">
                        <div class="flex w-full flex-col gap-1">
                          <div class="text-sm font-extrabold text-slate-900">
                            {{ p.name }}
                          </div>
                          <div class="text-[11px] font-semibold text-slate-500">
                            {{ p.key }}
                          </div>
                        </div>
                      </td>

                      <td
                        v-for="r in roles"
                        :key="r.id + '_' + p.key"
                        class="border-b border-slate-100 px-3 py-3 align-top"
                      >
                        <div class="flex w-full items-center justify-start">
                          <span
                            v-if="hasRolePermission(r.id, p.key)"
                            class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-200"
                          >
                            <CheckIcon class="h-4 w-4" />
                            允許
                          </span>

                          <span
                            v-else
                            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
                          >
                            —
                          </span>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="matrixPermissions.length === 0">
                      <td
                        :colspan="1 + rolesCount"
                        class="px-4 py-8 text-center text-sm font-semibold text-slate-500"
                      >
                        找不到此模組的權限資料
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="flex w-full flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200"
            >
              <div class="text-sm font-extrabold text-slate-900">
                角色在此模組的授權數量
              </div>
              <div class="flex w-full flex-col gap-2 lg:flex-row lg:flex-wrap">
                <div
                  v-for="row in matrixRoleSummary"
                  :key="row.roleId"
                  class="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 lg:w-[320px]"
                >
                  <div class="flex min-w-0 flex-1 items-center gap-2">
                    <div class="truncate text-sm font-extrabold text-slate-900">
                      {{ row.roleName }}
                    </div>
                    <div class="text-sm font-semibold text-slate-500">
                      （{{ row.count }} / {{ matrixPermCount }}）
                    </div>
                  </div>
                  <div class="w-28">
                    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        class="h-2 rounded-full bg-indigo-600"
                        :style="{ width: row.rate + '%' }"
                      ></div>
                    </div>
                    <div class="mt-1 text-right text-[11px] font-semibold text-slate-500">
                      {{ row.rate }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4"
        >
          <button
            type="button"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="closeMatrixModal"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import {
  UserIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.userName);
const userRoleTitle = computed(() => authStore.userRoleTitle);
const userAvatarUrl = computed(() => authStore.userAvatarUrl);

const roles = computed(() => authStore.roles || []);
const modules = computed(() => authStore.modules || []);

const rolesCount = computed(() => roles.value.length);
const modulesCount = computed(() => modules.value.length);
const permissionCount = computed(() => authStore.allPermissionKeys.length);

const currentUserId = computed(() => authStore.currentUser?.id || "");
const grantRoleCount = computed(() => Object.keys(authStore.grants || {}).length);

const normalizedName = computed(() => {
  const raw = String(userName.value || "").trim();
  const safe = raw.replace(/\s+/g, ".").toLowerCase();
  return safe || "user";
});

const displayEmail = computed(() => `${normalizedName.value}@tailadmin.local`);
const displayPhone = computed(() => "+886 900 123 456");
const displayLocation = computed(() => "Taipei, Taiwan");

const roleGrantedCountMap = computed(() => {
  const map = {};
  const grants = authStore.grants || {};
  Object.keys(grants).forEach((roleId) => {
    map[roleId] = Array.isArray(grants[roleId]) ? grants[roleId].length : 0;
  });
  return map;
});

const roleRank = computed(() => {
  const total = Math.max(1, permissionCount.value);
  const arr = roles.value.map((r) => {
    const granted = roleGrantedCountMap.value[r.id] || 0;
    const rate = Math.round((granted / total) * 100);
    return { roleId: r.id, roleName: r.name, granted, rate };
  });

  arr.sort((a, b) => b.granted - a.granted);
  return arr;
});

function getRoleModuleGranted(roleId, moduleKey) {
  const m = modules.value.find((x) => x.key === moduleKey);
  if (!m) return 0;

  const grantedSet = new Set(authStore.grants?.[roleId] || []);
  return (m.permissions || []).reduce(
    (acc, p) => acc + (grantedSet.has(p.key) ? 1 : 0),
    0
  );
}

function goAuthPage() {
  router.push("/authentication");
}

const editModalOpen = ref(false);
const editError = ref("");

const editForm = reactive({
  firstName: "",
  lastName: "",
  roleTitle: "",
  avatarUrl: "",
});

const previewFullName = computed(() => {
  const a = String(editForm.firstName || "").trim();
  const b = String(editForm.lastName || "").trim();
  const out = [a, b].filter(Boolean).join(" ");
  return out || "—";
});

const previewAvatarUrl = computed(() => {
  const v = String(editForm.avatarUrl || "").trim();
  return v || userAvatarUrl.value || "https://i.pravatar.cc/100?img=12";
});

function splitNameToFirstLast(fullName) {
  const raw = String(fullName || "").trim();
  if (!raw) return { firstName: "", lastName: "" };

  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

function openEditModal() {
  editError.value = "";

  const { firstName, lastName } = splitNameToFirstLast(userName.value);
  editForm.firstName = firstName;
  editForm.lastName = lastName;
  editForm.roleTitle = String(userRoleTitle.value || "");
  editForm.avatarUrl = String(userAvatarUrl.value || "");

  editModalOpen.value = true;
}

function closeEditModal() {
  editModalOpen.value = false;
  editError.value = "";
}

function saveEditModal() {
  editError.value = "";

  const first = String(editForm.firstName || "").trim();
  const last = String(editForm.lastName || "").trim();
  const nextName = [first, last].filter(Boolean).join(" ").trim();

  if (!nextName) {
    editError.value = "請輸入 First Name 或 Last Name（至少一個）。";
    return;
  }

  const nextRoleTitle = String(editForm.roleTitle || "").trim();
  const nextAvatarUrl = String(editForm.avatarUrl || "").trim();

  authStore.setCurrentUser({
    name: nextName,
    roleTitle: nextRoleTitle,
    avatarUrl: nextAvatarUrl,
  });

  editModalOpen.value = false;
}

const matrixModalOpen = ref(false);
const selectedModule = ref(null);

const matrixTitle = computed(() => selectedModule.value?.name || "—");
const matrixKey = computed(() => selectedModule.value?.key || "—");
const matrixPermissions = computed(() => selectedModule.value?.permissions || []);
const matrixPermCount = computed(() => matrixPermissions.value.length);

function hasRolePermission(roleId, permKey) {
  return authStore.hasPermission(roleId, permKey);
}

const matrixRoleSummary = computed(() => {
  const total = Math.max(1, matrixPermCount.value);

  const rows = roles.value.map((r) => {
    const count = matrixPermissions.value.reduce((acc, p) => {
      return acc + (hasRolePermission(r.id, p.key) ? 1 : 0);
    }, 0);

    const rate = Math.round((count / total) * 100);
    return { roleId: r.id, roleName: r.name, count, rate };
  });

  rows.sort((a, b) => b.count - a.count);
  return rows;
});

const matrixTopRoleName = computed(() => {
  const top = matrixRoleSummary.value[0];
  return top ? top.roleName : "—";
});

function openMatrixModal(moduleItem) {
  selectedModule.value = moduleItem || null;
  matrixModalOpen.value = true;
}

function closeMatrixModal() {
  matrixModalOpen.value = false;
  selectedModule.value = null;
}

function onClickLogout() {
  authStore.logout();
  console.log("[UserView] logout");
}

function onKeydown(e) {
  if (e.key !== "Escape") return;

  if (matrixModalOpen.value) {
    closeMatrixModal();
    return;
  }

  if (editModalOpen.value) {
    closeEditModal();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown, true);
});
</script>
