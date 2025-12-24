<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="flex h-screen w-full bg-slate-50">
    <aside class="hidden h-full w-70 shrink-0 border-r border-slate-200 bg-white lg:flex">
      <div class="flex h-full w-full flex-col">
        <Sidebar class="h-full w-full" />
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <div
        class="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur"
      >
        <div class="mx-auto flex w-full max-w-375 px-4 lg:px-6">
          <Header class="h-18 w-full" />
        </div>
      </div>

      <main class="min-h-0 flex-1 overflow-y-auto">
        <div
          class="mx-auto flex w-full max-w-375 flex-col gap-4 px-4 py-4 lg:gap-6 lg:px-6 lg:py-6"
        >
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/layouts/Header.vue";
import Sidebar from "@/components/layouts/Sidebar.vue";
</script>
