<script setup>
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const appVersion    = import.meta.env.VITE_APP_VERSION ?? '1.0.0'

/**
 * Menu de navegação lateral.
 * Para adicionar um novo módulo: basta inserir um item no array abaixo.
 * Não requer nenhuma outra alteração no código.
 *
 * @type {{ label: string, icon: string, to: string }[]}
 */
const menuItems = [
  { label: 'Dashboard', icon: '📊', to: '/dashboard'  },
  { label: 'Usuários',  icon: '👥', to: '/hub/users'  },
]
</script>

<template>
  <!-- Overlay para fechar sidebar em mobile -->
  <div
    v-if="settingsStore.sidebarOpen"
    class="sidebar-overlay d-lg-none position-fixed top-0 start-0 end-0 bottom-0"
    @click="settingsStore.toggleSidebar"
  />

  <aside
    class="sidebar position-fixed border-end d-flex flex-column"
    :class="settingsStore.sidebarOpen ? 'sidebar-open' : 'sidebar-closed'"
  >
    <!-- Itens de navegação -->
    <nav class="flex-fill overflow-y-auto p-3">
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link nav-link d-flex align-items-center gap-3 rounded-3 fw-medium text-decoration-none mb-1"
        active-class="active"
      >
        <span class="flex-shrink-0">{{ item.icon }}</span>
        <span class="text-truncate">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Rodapé do sidebar com versão -->
    <div class="p-4 border-top">
      <p class="small text-center text-muted mb-0">v{{ appVersion }}</p>
    </div>
  </aside>
</template>

<style scoped>
/* Overlay semitransparente em mobile */
.sidebar-overlay {
  z-index: 1020;
  background: rgb(0 0 0 / 0.3);
}

/* Sidebar principal */
.sidebar {
  top: 4rem;      /* altura da navbar */
  left: 0;
  bottom: 0;
  width: 15rem;   /* equivalente ao w-60 do Tailwind */
  z-index: 1025;
  transition: transform 0.3s ease-in-out;
}

.sidebar-open  { transform: translateX(0); }
.sidebar-closed { transform: translateX(-100%); }

/* Links de navegação */
.sidebar-link {
  color: var(--bs-secondary-color);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
}

.sidebar-link:hover {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
}

.sidebar-link.active {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
  font-weight: 600;
}
</style>
