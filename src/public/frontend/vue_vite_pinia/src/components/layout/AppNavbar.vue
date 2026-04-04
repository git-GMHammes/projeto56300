<script setup>
import { useRouter }        from 'vue-router'
import { useAuthStore }     from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { getInitials }      from '@/utils/formatters'

const router        = useRouter()
const authStore     = useAuthStore()
const settingsStore = useSettingsStore()

defineEmits(['toggle-sidebar'])

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 h-16
           bg-white dark:bg-slate-900
           border-b border-gray-200 dark:border-slate-700
           shadow-sm"
  >
    <div class="flex items-center justify-between h-full px-4 gap-3">

      <!-- ── Esquerda: hamburguer + logo ─────────────────────────────────── -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Toggle sidebar -->
        <button
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800
                 transition-colors shrink-0"
          title="Alternar menu"
          @click="$emit('toggle-sidebar')"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo / nome do sistema -->
        <router-link to="/dashboard" class="flex items-center gap-2 no-underline min-w-0">
          <span class="text-xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight shrink-0">
            HUB
          </span>
          <span class="hidden sm:block text-xs text-gray-400 dark:text-gray-500 font-medium truncate">
            de Serviços
          </span>
        </router-link>
      </div>

      <!-- ── Direita: tema + usuário + logout ────────────────────────────── -->
      <div class="flex items-center gap-1.5">

        <!-- Toggle dark/light mode -->
        <button
          class="p-2 rounded-lg text-gray-500 dark:text-gray-400
                 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          :title="settingsStore.isDarkMode ? 'Modo claro' : 'Modo escuro'"
          @click="settingsStore.toggleTheme"
        >
          <!-- Ícone sol (dark mode ativo) -->
          <svg v-if="settingsStore.isDarkMode" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707
                 M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14A7 7 0 0012 5z" />
          </svg>
          <!-- Ícone lua (light mode ativo) -->
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Chip do usuário logado -->
        <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                    bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
          <!-- Avatar com inicial -->
          <div class="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center
                      justify-center text-primary-700 dark:text-primary-300 text-xs font-bold shrink-0">
            {{ getInitials(authStore.userFullName) }}
          </div>
          <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200
                       max-w-[140px] truncate">
            {{ authStore.userFullName }}
          </span>
        </div>

        <!-- Botão de logout -->
        <button
          class="p-2 rounded-lg text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20
                 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Sair do sistema"
          @click="handleLogout"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7
                 a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
    </div>
  </header>
</template>
