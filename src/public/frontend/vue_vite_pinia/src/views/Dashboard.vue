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
  paid:    'badge text-bg-success',
  pending: 'badge text-bg-warning',
  failed:  'badge text-bg-danger',
  default: 'badge text-bg-secondary',
}
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">

    <!-- Navbar fixa -->
    <AppNavbar @toggle-sidebar="settingsStore.toggleSidebar" />

    <!-- Layout: sidebar + main -->
    <div class="d-flex flex-fill pt-navbar">
      <AppSidebar />

      <!-- Conteúdo principal — margem acompanha estado do sidebar -->
      <main
        class="flex-fill min-w-0 p-4 animate-fade-in"
        :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
        style="transition: margin-left 0.3s ease;"
      >

        <!-- ── Cabeçalho da página ───────────────────────────────────────── -->
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
          <div>
            <h1 class="h4 fw-bold text-body mb-1">Painel Principal</h1>
            <p class="small text-muted mb-0">
              Olá, <strong class="text-body-secondary">{{ authStore.userFullName }}</strong>!
              Aqui está o resumo de todos os serviços conectados.
            </p>
          </div>
          <!-- Última atualização -->
          <span v-if="dashboardStore.lastFetchedAt" class="small text-muted flex-shrink-0 mt-1">
            Atualizado às {{ dashboardStore.lastFetchedAt.toLocaleTimeString('pt-BR') }}
          </span>
        </div>

        <!-- ── Linha 1: KPI Cards ────────────────────────────────────────── -->
        <div class="row row-cols-2 row-cols-xl-4 g-3 mb-4">

          <!-- KPI: Usuários -->
          <div class="col">
            <BaseCard>
              <SkeletonLoader v-if="dashboardStore.users.loading" type="stat" />
              <div v-else class="d-flex align-items-center gap-3">
                <div class="icon-box rounded-3 bg-primary bg-opacity-10
                            d-flex align-items-center justify-content-center">👥</div>
                <div class="min-w-0">
                  <p class="h4 fw-bolder text-body font-monospace mb-0">
                    {{ formatNumber(dashboardStore.totalUsers) }}
                  </p>
                  <p class="small text-muted text-truncate mb-0">Usuários</p>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- KPI: Pagamentos -->
          <div class="col">
            <BaseCard>
              <SkeletonLoader v-if="dashboardStore.payments.loading" type="stat" />
              <div v-else class="d-flex align-items-center gap-3">
                <div class="icon-box rounded-3 bg-success bg-opacity-10
                            d-flex align-items-center justify-content-center">💳</div>
                <div class="min-w-0">
                  <p class="h4 fw-bolder text-body font-monospace mb-0">
                    {{ formatNumber(dashboardStore.totalPayments) }}
                  </p>
                  <p class="small text-muted text-truncate mb-0">Pagamentos</p>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- KPI: APIs conectadas (estático) -->
          <div class="col">
            <BaseCard>
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box rounded-3 kpi-purple
                            d-flex align-items-center justify-content-center">🔌</div>
                <div class="min-w-0">
                  <p class="h4 fw-bolder text-body mb-0">20+</p>
                  <p class="small text-muted text-truncate mb-0">APIs Ativas</p>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- KPI: Status do sistema -->
          <div class="col">
            <BaseCard>
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box rounded-3 bg-success bg-opacity-10
                            d-flex align-items-center justify-content-center">⚡</div>
                <div class="min-w-0">
                  <p class="h5 fw-bolder text-success mb-0">Online</p>
                  <p class="small text-muted text-truncate mb-0">Status</p>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- ── Linha 2: Widgets de API (fetch independente por widget) ────── -->
        <div class="row row-cols-1 row-cols-lg-2 g-3 mb-4">

          <!-- Widget: Últimos Usuários -->
          <div class="col">
            <ApiWidget
              title="Últimos Usuários"
              icon="👥"
              skeleton-type="avatar"
              :skeleton-lines="5"
              :fetch-fn="() => userService.getAll({ limit: 5 })"
            >
              <template #default="{ data }">
                <div v-if="data?.length" class="list-group list-group-flush mx-n3 mb-n3">
                  <div
                    v-for="user in data"
                    :key="user.id"
                    class="list-group-item d-flex align-items-center gap-3 px-3 py-3"
                  >
                    <div class="avatar-sm rounded-circle bg-primary bg-opacity-10 text-primary
                                d-flex align-items-center justify-content-center fw-bold small">
                      {{ getInitials(user.name || user.email || '?') }}
                    </div>
                    <div class="min-w-0 flex-fill">
                      <p class="small fw-medium text-body text-truncate mb-0">
                        {{ user.name || '—' }}
                      </p>
                      <p class="small text-muted text-truncate mb-0">{{ user.email }}</p>
                    </div>
                    <span class="small text-muted flex-shrink-0">
                      {{ formatDate(user.created_at) }}
                    </span>
                  </div>
                </div>
                <p v-else class="small text-muted text-center py-4 mb-0">
                  Nenhum usuário encontrado.
                </p>
              </template>
            </ApiWidget>
          </div>

          <!-- Widget: Últimos Pagamentos -->
          <div class="col">
            <ApiWidget
              title="Últimos Pagamentos"
              icon="💳"
              skeleton-type="table"
              :skeleton-lines="4"
              :fetch-fn="() => paymentService.getAll({ limit: 5 })"
            >
              <template #default="{ data }">
                <div v-if="data?.length" class="list-group list-group-flush mx-n3 mb-n3">
                  <div
                    v-for="pay in data"
                    :key="pay.id"
                    class="list-group-item d-flex align-items-center justify-content-between gap-3 px-3 py-3"
                  >
                    <div class="min-w-0">
                      <p class="small fw-medium text-body text-truncate mb-0">
                        {{ pay.description || `Pagamento #${pay.id}` }}
                      </p>
                      <p class="small text-muted mb-0">{{ formatDate(pay.created_at) }}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                      <span :class="statusBadge[pay.status] ?? statusBadge.default">
                        {{ pay.status ?? '—' }}
                      </span>
                      <span class="small fw-semibold text-body font-monospace">
                        {{ formatCurrency(pay.amount) }}
                      </span>
                    </div>
                  </div>
                </div>
                <p v-else class="small text-muted text-center py-4 mb-0">
                  Nenhum pagamento encontrado.
                </p>
              </template>
            </ApiWidget>
          </div>

        </div>

        <!-- ── Linha 3: Atalhos para módulos ─────────────────────────────── -->
        <BaseCard>
          <template #header>
            <span class="small fw-semibold text-body">🗂️ Módulos Disponíveis</span>
          </template>
          <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-6 g-3">
            <div
              v-for="item in [
                { label: 'Usuários',   icon: '👥', to: '/hub/users' },
                { label: 'Pagamentos', icon: '💳', to: '/hub/payments' },
                { label: 'Relatórios', icon: '📈', to: '/hub/reports' },
                { label: 'Config.',    icon: '⚙️', to: '/hub/settings' },
              ]"
              :key="item.to"
              class="col"
            >
              <router-link
                :to="item.to"
                class="card module-card border text-decoration-none p-3
                       d-flex flex-column align-items-center gap-2 h-100"
              >
                <span class="fs-3 module-icon">{{ item.icon }}</span>
                <span class="small fw-medium text-muted text-center">{{ item.label }}</span>
              </router-link>
            </div>
          </div>
        </BaseCard>

      </main>
    </div>

    <AppFooter
      :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
      style="transition: margin-left 0.3s ease;"
    />
  </div>
</template>

<style scoped>
/* Ícone KPI roxo — sem variável semântica Bootstrap para purple */
.kpi-purple {
  background-color: rgba(139, 92, 246, 0.15);
}
</style>
