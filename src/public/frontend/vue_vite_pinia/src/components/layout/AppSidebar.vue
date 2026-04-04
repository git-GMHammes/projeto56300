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
  { label: 'Dashboard',    icon: '📊', to: '/dashboard'      },
  { label: 'Usuários',     icon: '👥', to: '/hub/users'      },
  { label: 'Pagamentos',   icon: '💳', to: '/hub/payments'   },
  { label: 'Relatórios',   icon: '📈', to: '/hub/reports'    },
  { label: 'Configurações',icon: '⚙️', to: '/hub/settings'   },
]
</script>

<template>
  <!-- Overlay para fechar sidebar em mobile -->
  <div
    v-if="settingsStore.sidebarOpen"
    class="fixed inset-0 z-20 bg-black/30 lg:hidden"
    @click="settingsStore.toggleSidebar"
  />

  <aside
    class="fixed top-16 left-0 bottom-0 z-30 w-60
           bg-white dark:bg-slate-900
           border-r border-gray-200 dark:border-slate-700
           flex flex-col
           transition-transform duration-300 ease-in-out"
    :class="settingsStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Itens de navegação -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               text-gray-600 dark:text-gray-400
               hover:bg-primary-50 dark:hover:bg-primary-900/20
               hover:text-primary-700 dark:hover:text-primary-300
               transition-colors no-underline"
        active-class="bg-primary-50 dark:bg-primary-900/25
                      text-primary-700 dark:text-primary-300 font-semibold"
      >
        <span class="text-base leading-none shrink-0">{{ item.icon }}</span>
        <span class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Rodapé do sidebar com versão -->
    <div class="p-4 border-t border-gray-100 dark:border-slate-700">
      <p class="text-xs text-center text-gray-300 dark:text-gray-600">
        v{{ appVersion }}
      </p>
    </div>
  </aside>
</template>
