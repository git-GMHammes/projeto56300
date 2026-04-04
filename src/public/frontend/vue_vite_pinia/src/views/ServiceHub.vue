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
  paid:    'badge-green',
  active:  'badge-green',
  pending: 'badge-yellow',
  failed:  'badge-red',
  deleted: 'badge-red',
  inactive:'badge-gray',
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">

    <AppNavbar @toggle-sidebar="settingsStore.toggleSidebar" />

    <div class="flex flex-1 pt-16">
      <AppSidebar />

      <main
        class="flex-1 min-w-0 p-5 lg:p-6 transition-all duration-300 animate-fade-in"
        :class="settingsStore.sidebarOpen ? 'lg:ml-60' : ''"
      >

        <!-- ── Cabeçalho da página ───────────────────────────────────────── -->
        <div class="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="text-2xl leading-none">{{ config?.icon ?? '📦' }}</span>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ pageTitle }}
              </h1>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
              GET /api/v1/{{ currentModule }}
            </p>
          </div>

          <!-- Ações globais do módulo -->
          <div class="flex items-center gap-2 flex-wrap">
            <BaseButton variant="ghost" size="sm">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1
                     0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filtros
            </BaseButton>
            <BaseButton variant="outline" size="sm">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </BaseButton>
            <BaseButton variant="primary" size="sm">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Novo {{ config?.label ?? '' }}
            </BaseButton>
          </div>
        </div>

        <!-- ── Módulo não mapeado ────────────────────────────────────────── -->
        <div
          v-if="!config"
          class="flex flex-col items-center justify-center py-24 gap-4 text-center"
        >
          <span class="text-6xl">🔍</span>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Módulo não encontrado
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            O módulo <code class="font-mono bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            {{ currentModule }}</code> não está mapeado no serviceMap.
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
            <template #default="{ data, meta, refresh }">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <!-- Cabeçalho -->
                  <thead>
                    <tr class="bg-gray-50 dark:bg-slate-700/50">
                      <th
                        v-for="col in config.columns"
                        :key="col"
                        class="px-4 py-3 text-left text-xs font-semibold
                               text-gray-500 dark:text-gray-400 uppercase tracking-wide
                               whitespace-nowrap"
                      >
                        {{ col.replace(/_/g, ' ') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold
                                 text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <!-- Linhas -->
                  <tbody class="divide-y divide-gray-100 dark:divide-slate-700">
                    <tr
                      v-for="row in data"
                      :key="row.id"
                      class="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td
                        v-for="col in config.columns"
                        :key="col"
                        class="px-4 py-3 text-gray-800 dark:text-gray-200 max-w-[200px] truncate"
                      >
                        <!-- Status: exibe badge colorido -->
                        <span
                          v-if="col === 'status'"
                          :class="statusBadgeClass[row[col]] ?? 'badge-gray'"
                        >
                          {{ row[col] ?? '—' }}
                        </span>
                        <!-- Demais colunas: formatação automática -->
                        <span v-else>{{ formatCell(col, row[col]) }}</span>
                      </td>

                      <!-- Coluna de ações -->
                      <td class="px-4 py-3">
                        <div class="flex items-center justify-end gap-1">
                          <button
                            class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600
                                   hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="Visualizar"
                          >
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5
                                   c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477
                                   0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            class="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600
                                   hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                            title="Editar"
                          >
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            class="p-1.5 rounded-lg text-gray-400 hover:text-red-600
                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Excluir"
                          >
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
                      <td
                        :colspan="config.columns.length + 1"
                        class="text-center py-16 text-gray-400 dark:text-gray-500"
                      >
                        <div class="flex flex-col items-center gap-2">
                          <span class="text-4xl">📭</span>
                          <p class="text-sm">Nenhum registro encontrado.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Paginação -->
                <div
                  v-if="meta?.total"
                  class="px-4 py-3 border-t border-gray-100 dark:border-slate-700
                         flex items-center justify-between text-xs text-gray-500 dark:text-gray-400
                         bg-gray-50 dark:bg-slate-700/30"
                >
                  <span>
                    {{ meta.total }} registro(s) no total
                  </span>
                  <div class="flex items-center gap-3">
                    <span>Página {{ meta.current_page ?? 1 }} de {{ meta.last_page ?? 1 }}</span>
                    <div class="flex gap-1">
                      <button
                        class="px-2 py-1 rounded border border-gray-200 dark:border-slate-600
                               hover:bg-white dark:hover:bg-slate-700 transition-colors
                               disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="(meta.current_page ?? 1) <= 1"
                      >←</button>
                      <button
                        class="px-2 py-1 rounded border border-gray-200 dark:border-slate-600
                               hover:bg-white dark:hover:bg-slate-700 transition-colors
                               disabled:opacity-40 disabled:cursor-not-allowed"
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
      :class="settingsStore.sidebarOpen ? 'lg:ml-60' : ''"
      class="transition-all duration-300"
    />
  </div>
</template>
