import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService }    from '@/services/userService'
import { paymentService } from '@/services/paymentService'

/**
 * Estado inicial padrão para qualquer domínio de API no HUB.
 * @returns {{ data: Array, meta: null, loading: boolean, error: null }}
 */
const createDomainState = () => ({
  data:    [],
  meta:    null,
  loading: false,
  error:   null,
})

/**
 * Store central do Dashboard HUB.
 * Consolida dados de N APIs em um único estado reativo.
 *
 * Arquitetura:
 * - Cada domínio de API tem seu próprio "slice" de estado isolado.
 * - initDashboard() dispara TODAS as chamadas em paralelo (Promise.allSettled).
 * - Uma falha em uma API não bloqueia as demais.
 * - refreshWidget() permite recarregar apenas um widget sem afetar os outros.
 */
export const useDashboardStore = defineStore('dashboard', () => {
  // ── Estado por domínio ────────────────────────────────────────────────────
  const users    = ref(createDomainState())
  const payments = ref(createDomainState())
  const lastFetchedAt = ref(null)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isAnyLoading = computed(() =>
    users.value.loading || payments.value.loading,
  )
  const totalUsers    = computed(() => users.value.meta?.total    ?? users.value.data.length)
  const totalPayments = computed(() => payments.value.meta?.total ?? payments.value.data.length)

  // ── Mapa de serviços (facilita refreshWidget dinâmico) ────────────────────
  const serviceMap = {
    users:    { service: userService,    state: users },
    payments: { service: paymentService, state: payments },
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Carrega TODOS os widgets do dashboard em paralelo.
   * Usa Promise.allSettled para que falhas individuais sejam isoladas.
   */
  async function initDashboard() {
    // Marca todos como loading simultaneamente
    Object.values(serviceMap).forEach(({ state }) => {
      state.value.loading = true
      state.value.error   = null
    })

    const results = await Promise.allSettled([
      userService.getAll({ limit: 10 }),
      paymentService.getAll({ limit: 10 }),
    ])

    const domains = ['users', 'payments']

    results.forEach((result, index) => {
      const domain = domains[index]
      const state  = serviceMap[domain].state

      if (result.status === 'fulfilled') {
        state.value.data  = result.value.data?.data ?? []
        state.value.meta  = result.value.data?.meta ?? null
        state.value.error = null
      } else {
        state.value.data  = []
        state.value.error = result.reason?.message ?? `Falha ao carregar ${domain}.`
        console.warn(`[DashboardStore] Falha no domínio "${domain}":`, result.reason)
      }

      state.value.loading = false
    })

    lastFetchedAt.value = new Date()
  }

  /**
   * Recarrega apenas um widget específico sem afetar os demais.
   * @param {'users'|'payments'} domain
   * @param {{ limit?: number }} params
   */
  async function refreshWidget(domain, params = { limit: 10 }) {
    const entry = serviceMap[domain]
    if (!entry) {
      console.warn(`[DashboardStore] Domínio desconhecido: "${domain}"`)
      return
    }

    const { service, state } = entry
    state.value.loading = true
    state.value.error   = null

    try {
      const { data } = await service.getAll(params)
      state.value.data = data?.data ?? []
      state.value.meta = data?.meta ?? null
    } catch (err) {
      state.value.error = err.message ?? 'Erro ao recarregar.'
    } finally {
      state.value.loading = false
      lastFetchedAt.value = new Date()
    }
  }

  return {
    // Estado por domínio
    users, payments, lastFetchedAt,
    // Getters
    isAnyLoading, totalUsers, totalPayments,
    // Ações
    initDashboard, refreshWidget,
  }
})
