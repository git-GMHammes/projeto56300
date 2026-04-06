<script setup>
import { useAuthStore }   from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

import AppNavbar  from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter  from '@/components/layout/AppFooter.vue'

const authStore     = useAuthStore()
const settingsStore = useSettingsStore()
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <AppNavbar @toggle-sidebar="settingsStore.toggleSidebar" />

    <div class="d-flex flex-fill pt-navbar">
      <AppSidebar />

      <main
        class="flex-fill d-flex align-items-center justify-content-center"
        :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
        style="transition: margin-left 0.3s ease;"
      >
        <p class="text-muted">
          Olá, <strong>{{ authStore.userFullName }}</strong>. Bem-vindo ao HUB de Serviços.
        </p>
      </main>
    </div>

    <AppFooter
      :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
      style="transition: margin-left 0.3s ease;"
    />
  </div>
</template>
