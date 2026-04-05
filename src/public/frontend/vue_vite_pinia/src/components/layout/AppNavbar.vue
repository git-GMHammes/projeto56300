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
  <header class="navbar fixed-top border-bottom shadow-sm">
    <div class="container-fluid px-4 gap-3">

      <!-- ── Esquerda: hamburguer + logo ─────────────────────────────────── -->
      <div class="d-flex align-items-center gap-3 min-w-0">
        <!-- Toggle sidebar -->
        <button
          class="btn btn-light btn-sm rounded-3 p-2 flex-shrink-0"
          title="Alternar menu"
          @click="$emit('toggle-sidebar')"
        >
          <svg class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo / nome do sistema -->
        <router-link to="/dashboard" class="navbar-brand d-flex align-items-center gap-2 text-decoration-none p-0 m-0 min-w-0">
          <span class="fw-bolder text-primary fs-4 flex-shrink-0">HUB</span>
          <span class="d-none d-sm-block small text-muted fw-medium text-truncate">de Serviços</span>
        </router-link>
      </div>

      <!-- ── Direita: tema + usuário + logout ────────────────────────────── -->
      <div class="d-flex align-items-center gap-1">

        <!-- Toggle dark/light mode -->
        <button
          class="btn btn-light btn-sm rounded-3 p-2"
          :title="settingsStore.isDarkMode ? 'Modo claro' : 'Modo escuro'"
          @click="settingsStore.toggleTheme"
        >
          <!-- Ícone sol (dark mode ativo) -->
          <svg v-if="settingsStore.isDarkMode" class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707
                 M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14A7 7 0 0012 5z" />
          </svg>
          <!-- Ícone lua (light mode ativo) -->
          <svg v-else class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Chip do usuário logado -->
        <div class="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-body-secondary border">
          <!-- Avatar com inicial -->
          <div class="avatar-xs rounded-circle bg-primary bg-opacity-10 text-primary
                      d-flex align-items-center justify-content-center fw-bold flex-shrink-0">
            {{ getInitials(authStore.userFullName) }}
          </div>
          <span class="d-none d-sm-block fw-medium text-truncate" style="max-width: 140px; font-size: 0.875rem;">
            {{ authStore.userFullName }}
          </span>
        </div>

        <!-- Botão de logout -->
        <button
          class="btn btn-light btn-sm rounded-3 p-2 logout-btn"
          title="Sair do sistema"
          @click="handleLogout"
        >
          <svg class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7
                 a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
    </div>
  </header>
</template>

<style scoped>
/* Altura padrão da navbar */
.navbar {
  min-height: 4rem;
}

/* Ícones inline SVG */
.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}

/* Avatar pequeno */
.avatar-xs {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.6875rem;
}

/* Botão de logout — hover vermelho */
.logout-btn:hover {
  background-color: rgba(220, 53, 69, 0.1) !important;
  color: #dc3545 !important;
}
</style>
