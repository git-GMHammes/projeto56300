<script setup>
import { onMounted }          from 'vue'
import { useDashboardStore }  from '@/stores/dashboardStore'
import { useAuthStore }       from '@/stores/auth'
import { useSettingsStore }   from '@/stores/settings'
import { userService }        from '@/services/userService'
import { paymentService }     from '@/services/paymentService'
import { formatCurrency, formatDate, formatNumber, getInitials } from '@/utils/formatters'

import AppNavbar      from '@/components/layout/AppNavbar.vue'
import AppSidebar     from '@/components/layout/AppSidebar.vue'
import AppFooter      from '@/components/layout/AppFooter.vue'
import BaseCard       from '@/components/common/BaseCard.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import ApiWidget      from '@/components/widgets/ApiWidget.vue'

const dashboardStore = useDashboardStore()
const authStore      = useAuthStore()
const settingsStore  = useSettingsStore()

onMounted(() => {
  settingsStore.applyTheme()
  // Carrega todas as APIs do dashboard em paralelo (Promise.allSettled interno)
  dashboardStore.initDashboard()
})

/** Mapa de badge de status de pagamento */
const statusBadge = {
  paid:    'badge-green',
  pending: 'badge-yellow',
  failed:  'badge-red',
  default: 'badge-gray',
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">

    <!-- Navbar fixa -->
    <AppNavbar @toggle-sidebar="settingsStore.toggleSidebar" />

    <!-- Layout: sidebar + main -->
    <div class="flex flex-1 pt-16">
      <AppSidebar />

      <!-- Conteúdo principal — margem acompanha estado do sidebar -->
      <main
        class="flex-1 min-w-0 p-5 lg:p-6 transition-all duration-300 animate-fade-in"
        :class="settingsStore.sidebarOpen ? 'lg:ml-60' : ''"
      >

        <!-- ── Cabeçalho da página ───────────────────────────────────────── -->
        <div class="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Painel Principal
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Olá, <strong class="text-gray-700 dark:text-gray-300">{{ authStore.userFullName }}</strong>!
              Aqui está o resumo de todos os serviços conectados.
            </p>
          </div>
          <!-- Última atualização -->
          <span
            v-if="dashboardStore.lastFetchedAt"
            class="text-xs text-gray-400 dark:text-gray-500 mt-1 shrink-0"
          >
            Atualizado às {{ dashboardStore.lastFetchedAt.toLocaleTimeString('pt-BR') }}
          </span>
        </div>

        <!-- ── Linha 1: KPI Cards ────────────────────────────────────────── -->
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

          <!-- KPI: Usuários -->
          <BaseCard>
            <SkeletonLoader v-if="dashboardStore.users.loading" type="stat" />
            <div v-else class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center
                          justify-center text-2xl shrink-0">👥</div>
              <div class="min-w-0">
                <p class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                  {{ formatNumber(dashboardStore.totalUsers) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Usuários</p>
              </div>
            </div>
          </BaseCard>

          <!-- KPI: Pagamentos -->
          <BaseCard>
            <SkeletonLoader v-if="dashboardStore.payments.loading" type="stat" />
            <div v-else class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center
                          justify-center text-2xl shrink-0">💳</div>
              <div class="min-w-0">
                <p class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                  {{ formatNumber(dashboardStore.totalPayments) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Pagamentos</p>
              </div>
            </div>
          </BaseCard>

          <!-- KPI: APIs conectadas (estático) -->
          <BaseCard>
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center
                          justify-center text-2xl shrink-0">🔌</div>
              <div class="min-w-0">
                <p class="text-2xl font-extrabold text-gray-900 dark:text-gray-100">20+</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">APIs Ativas</p>
              </div>
            </div>
          </BaseCard>

          <!-- KPI: Status do sistema -->
          <BaseCard>
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center
                          justify-center text-2xl shrink-0">⚡</div>
              <div class="min-w-0">
                <p class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">Online</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Status</p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- ── Linha 2: Widgets de API (fetch independente por widget) ────── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          <!-- Widget: Últimos Usuários -->
          <ApiWidget
            title="Últimos Usuários"
            icon="👥"
            skeleton-type="avatar"
            :skeleton-lines="5"
            :fetch-fn="() => userService.getAll({ limit: 5 })"
          >
            <template #default="{ data }">
              <div
                v-if="data?.length"
                class="divide-y divide-gray-100 dark:divide-slate-700 -mx-5 -mb-4"
              >
                <div
                  v-for="user in data"
                  :key="user.id"
                  class="flex items-center gap-3 px-5 py-3
                         hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <div class="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center
                              justify-center text-primary-700 dark:text-primary-300 text-xs font-bold shrink-0">
                    {{ getInitials(user.name || user.email || '?') }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {{ user.name || '—' }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ user.email }}</p>
                  </div>
                  <span class="text-xs text-gray-400 shrink-0">
                    {{ formatDate(user.created_at) }}
                  </span>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 py-6 text-center">
                Nenhum usuário encontrado.
              </p>
            </template>
          </ApiWidget>

          <!-- Widget: Últimos Pagamentos -->
          <ApiWidget
            title="Últimos Pagamentos"
            icon="💳"
            skeleton-type="table"
            :skeleton-lines="4"
            :fetch-fn="() => paymentService.getAll({ limit: 5 })"
          >
            <template #default="{ data }">
              <div
                v-if="data?.length"
                class="divide-y divide-gray-100 dark:divide-slate-700 -mx-5 -mb-4"
              >
                <div
                  v-for="pay in data"
                  :key="pay.id"
                  class="flex items-center justify-between gap-3 px-5 py-3
                         hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {{ pay.description || `Pagamento #${pay.id}` }}
                    </p>
                    <p class="text-xs text-gray-400">{{ formatDate(pay.created_at) }}</p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span :class="statusBadge[pay.status] ?? statusBadge.default">
                      {{ pay.status ?? '—' }}
                    </span>
                    <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                      {{ formatCurrency(pay.amount) }}
                    </span>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 py-6 text-center">
                Nenhum pagamento encontrado.
              </p>
            </template>
          </ApiWidget>

        </div>

        <!-- ── Linha 3: Atalhos para módulos ─────────────────────────────── -->
        <BaseCard>
          <template #header>
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              🗂️ Módulos Disponíveis
            </span>
          </template>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <router-link
              v-for="item in [
                { label: 'Usuários',   icon: '👥', to: '/hub/users' },
                { label: 'Pagamentos', icon: '💳', to: '/hub/payments' },
                { label: 'Relatórios', icon: '📈', to: '/hub/reports' },
                { label: 'Config.',    icon: '⚙️', to: '/hub/settings' },
              ]"
              :key="item.to"
              :to="item.to"
              class="flex flex-col items-center gap-2 p-4 rounded-xl
                     border border-gray-100 dark:border-slate-700
                     hover:border-primary-200 dark:hover:border-primary-700
                     hover:bg-primary-50 dark:hover:bg-primary-900/20
                     transition-all duration-150 no-underline group"
            >
              <span class="text-3xl group-hover:scale-110 transition-transform duration-150">
                {{ item.icon }}
              </span>
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400
                           group-hover:text-primary-600 dark:group-hover:text-primary-300 text-center">
                {{ item.label }}
              </span>
            </router-link>
          </div>
        </BaseCard>

      </main>
    </div>

    <AppFooter :class="settingsStore.sidebarOpen ? 'lg:ml-60' : ''" class="transition-all duration-300" />
  </div>
</template>
