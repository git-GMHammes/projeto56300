<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { userService }      from '@/services/userService'
import { paymentService }   from '@/services/paymentService'
import { formatDate, formatCurrency, toTitleCase } from '@/utils/formatters'

import AppNavbar   from '@/components/layout/AppNavbar.vue'
import AppSidebar  from '@/components/layout/AppSidebar.vue'
import AppFooter   from '@/components/layout/AppFooter.vue'
import ApiWidget   from '@/components/widgets/ApiWidget.vue'
import BaseCard    from '@/components/common/BaseCard.vue'
import BaseButton  from '@/components/common/BaseButton.vue'

const route         = useRoute()
const settingsStore = useSettingsStore()

/**
 * Mapa de configuração de cada módulo do HUB.
 * Para adicionar um novo serviço:
 *   1. Crie o service em src/services/[nome]Service.js (1 linha com createApiService)
 *   2. Importe-o aqui e adicione uma entrada neste mapa.
 *   3. Pronto — a tela inteira é gerada automaticamente.
 *
 * @type {Record<string, { label: string, icon: string, service: Object, columns: string[] }>}
 */
const serviceMap = {
  users: {
    label:   'Usuários',
    icon:    '👥',
    service: userService,
    columns: ['id', 'name', 'email', 'created_at'],
  },
  payments: {
    label:   'Pagamentos',
    icon:    '💳',
    service: paymentService,
    columns: ['id', 'description', 'amount', 'status', 'created_at'],
  },
}

/** Configuração do módulo atual (derivada da rota) */
const currentModule = computed(() => route.params.service)
const config        = computed(() => serviceMap[currentModule.value] ?? null)
const pageTitle     = computed(() => config.value?.label ?? toTitleCase(currentModule.value ?? ''))

/** Função de fetch usada pelo ApiWidget — reativa à mudança de rota */
const fetchFn = computed(() =>
  config.value ? () => config.value.service.getAll({ limit: 20 }) : null,
)

/** Formata o valor de uma célula conforme a coluna */
function formatCell(col, value) {
  if (value == null) return '—'
  if (col === 'amount')     return formatCurrency(value)
  if (col.endsWith('_at')) return formatDate(value)
  return value
}

/** Classe de badge de status */
const statusBadgeClass = {
  paid:    'badge text-bg-success',
  active:  'badge text-bg-success',
  pending: 'badge text-bg-warning',
  failed:  'badge text-bg-danger',
  deleted: 'badge text-bg-danger',
  inactive:'badge text-bg-secondary',
}
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">

    <AppNavbar @toggle-sidebar="settingsStore.toggleSidebar" />

    <div class="d-flex flex-fill pt-navbar">
      <AppSidebar />

      <main
        class="flex-fill min-w-0 p-4 animate-fade-in"
        :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
        style="transition: margin-left 0.3s ease;"
      >

        <!-- ── Cabeçalho da página ───────────────────────────────────────── -->
        <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
          <div>
            <div class="d-flex align-items-center gap-2">
              <span class="fs-4 lh-1">{{ config?.icon ?? '📦' }}</span>
              <h1 class="h4 fw-bold text-body mb-0">{{ pageTitle }}</h1>
            </div>
            <p class="small text-muted font-monospace mt-1 mb-0">
              GET /api/v1/{{ currentModule }}
            </p>
          </div>

          <!-- Ações globais do módulo -->
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <BaseButton variant="ghost" size="sm">
              <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1
                     0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filtros
            </BaseButton>
            <BaseButton variant="outline" size="sm">
              <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </BaseButton>
            <BaseButton variant="primary" size="sm">
              <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Novo {{ config?.label ?? '' }}
            </BaseButton>
          </div>
        </div>

        <!-- ── Módulo não mapeado ────────────────────────────────────────── -->
        <div v-if="!config" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3 text-center">
          <span class="display-4">🔍</span>
          <h2 class="h5 fw-semibold text-body">Módulo não encontrado</h2>
          <p class="small text-muted mb-0" style="max-width: 20rem;">
            O módulo <code>{{ currentModule }}</code> não está mapeado no serviceMap.
          </p>
          <router-link to="/dashboard">
            <BaseButton variant="primary">← Voltar ao Dashboard</BaseButton>
          </router-link>
        </div>

        <!-- ── Tabela do módulo via ApiWidget ────────────────────────────── -->
        <template v-else>
          <ApiWidget
            :title="`Lista de ${pageTitle}`"
            :icon="config.icon"
            skeleton-type="table"
            :skeleton-lines="8"
            :fetch-fn="fetchFn"
            no-padding
          >
            <template #default="{ data, meta }">
              <div class="table-responsive">
                <table class="table table-hover table-sm mb-0">
                  <!-- Cabeçalho -->
                  <thead class="table-light">
                    <tr>
                      <th
                        v-for="col in config.columns"
                        :key="col"
                        class="text-uppercase text-muted small fw-semibold text-nowrap px-3 py-3"
                      >
                        {{ col.replace(/_/g, ' ') }}
                      </th>
                      <th class="text-uppercase text-muted small fw-semibold text-end px-3 py-3">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <!-- Linhas -->
                  <tbody>
                    <tr v-for="row in data" :key="row.id">
                      <td
                        v-for="col in config.columns"
                        :key="col"
                        class="px-3 py-3 text-truncate"
                        style="max-width: 200px;"
                      >
                        <!-- Status: exibe badge colorido -->
                        <span v-if="col === 'status'" :class="statusBadgeClass[row[col]] ?? 'badge text-bg-secondary'">
                          {{ row[col] ?? '—' }}
                        </span>
                        <!-- Demais colunas: formatação automática -->
                        <span v-else>{{ formatCell(col, row[col]) }}</span>
                      </td>

                      <!-- Coluna de ações -->
                      <td class="px-3 py-3">
                        <div class="d-flex align-items-center justify-content-end gap-1">
                          <button class="btn btn-link btn-sm p-1 text-primary" title="Visualizar">
                            <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5
                                   c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477
                                   0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button class="btn btn-link btn-sm p-1 text-warning" title="Editar">
                            <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button class="btn btn-link btn-sm p-1 text-danger" title="Excluir">
                            <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                                   m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Estado vazio -->
                    <tr v-if="!data?.length">
                      <td :colspan="config.columns.length + 1" class="text-center py-5 text-muted">
                        <div class="d-flex flex-column align-items-center gap-2">
                          <span class="fs-2">📭</span>
                          <p class="small mb-0">Nenhum registro encontrado.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Paginação -->
                <div
                  v-if="meta?.total"
                  class="d-flex align-items-center justify-content-between px-3 py-2
                         border-top small text-muted bg-body-secondary"
                >
                  <span>{{ meta.total }} registro(s) no total</span>
                  <div class="d-flex align-items-center gap-3">
                    <span>Página {{ meta.current_page ?? 1 }} de {{ meta.last_page ?? 1 }}</span>
                    <div class="d-flex gap-1">
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        :disabled="(meta.current_page ?? 1) <= 1"
                      >←</button>
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        :disabled="(meta.current_page ?? 1) >= (meta.last_page ?? 1)"
                      >→</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </ApiWidget>
        </template>

      </main>
    </div>

    <AppFooter
      :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
      style="transition: margin-left 0.3s ease;"
    />
  </div>
</template>

<style scoped>
.icon-xs {
  width: 1rem;
  height: 1rem;
  display: block;
}
</style>
