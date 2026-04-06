import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userCustomerViewService } from '@/services/userCustomerViewService'

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
 * Consolida dados da view user_customer_view em um único estado reativo.
 *
 * Arquitetura:
 * - Cada domínio tem seu próprio "slice" de estado isolado.
 * - initDashboard() dispara TODAS as chamadas em paralelo (Promise.allSettled).
 * - Uma falha em uma chamada não bloqueia as demais.
 * - refreshWidget() permite recarregar apenas um widget sem afetar os outros.
 */
export const useDashboardStore = defineStore('dashboard', () => {
  // ── Estado por domínio ────────────────────────────────────────────────────
  const customers        = ref(createDomainState())
  const deletedCustomers = ref(createDomainState())
  const lastFetchedAt    = ref(null)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isAnyLoading = computed(() =>
    customers.value.loading || deletedCustomers.value.loading,
  )
  const totalCustomers        = computed(() => customers.value.meta?.total        ?? customers.value.data.length)
  const totalDeletedCustomers = computed(() => deletedCustomers.value.meta?.total ?? deletedCustomers.value.data.length)

  // ── Mapa de serviços (facilita refreshWidget dinâmico) ────────────────────
  const serviceMap = {
    customers:        { fetchFn: (p) => userCustomerViewService.getAll(p),        state: customers },
    deletedCustomers: { fetchFn: (p) => userCustomerViewService.getDeletedAll(p), state: deletedCustomers },
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Carrega TODOS os widgets do dashboard em paralelo.
   * Usa Promise.allSettled para que falhas individuais sejam isoladas.
   */
  async function initDashboard() {
    Object.values(serviceMap).forEach(({ state }) => {
      state.value.loading = true
      state.value.error   = null
    })

    const results = await Promise.allSettled([
      userCustomerViewService.getAll({ limit: 10 }),
      userCustomerViewService.getDeletedAll({ limit: 10 }),
    ])

    const domains = ['customers', 'deletedCustomers']

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
   * @param {'customers'|'deletedCustomers'} domain
   * @param {{ limit?: number }} params
   */
  async function refreshWidget(domain, params = { limit: 10 }) {
    const entry = serviceMap[domain]
    if (!entry) {
      console.warn(`[DashboardStore] Domínio desconhecido: "${domain}"`)
      return
    }

    const { fetchFn, state } = entry
    state.value.loading = true
    state.value.error   = null

    try {
      const { data } = await fetchFn(params)
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
    customers, deletedCustomers, lastFetchedAt,
    // Getters
    isAnyLoading, totalCustomers, totalDeletedCustomers,
    // Ações
    initDashboard, refreshWidget,
  }
})
