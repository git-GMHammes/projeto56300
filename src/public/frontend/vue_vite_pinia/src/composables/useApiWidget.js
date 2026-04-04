import { ref, onMounted } from 'vue'

/**
 * Composable reutilizável para qualquer widget de API.
 * Encapsula o ciclo completo: loading → fetch → success/error.
 *
 * Regra: componentes NUNCA chamam APIs diretamente.
 * Eles usam este composable passando a função do Service.
 *
 * @template T
 * @param {() => Promise<import('axios').AxiosResponse>} fetchFn
 *   Função de fetch do Service. Ex: () => userService.getAll({ limit: 10 })
 * @param {Object}  [options]
 * @param {boolean} [options.immediate=true]    Executa o fetch ao montar
 * @param {T|null}  [options.initialData=null]  Dado inicial antes do fetch
 *
 * @returns {{
 *   data:      import('vue').Ref<T|null>,
 *   isLoading: import('vue').Ref<boolean>,
 *   error:     import('vue').Ref<string|null>,
 *   meta:      import('vue').Ref<Object|null>,
 *   refresh:   () => Promise<void>
 * }}
 *
 * @example
 * // Em qualquer componente ou view:
 * const { data, isLoading, error, refresh } = useApiWidget(
 *   () => userService.getAll({ limit: 5 })
 * )
 */
export function useApiWidget(fetchFn, options = {}) {
  const { immediate = true, initialData = null } = options

  /** @type {import('vue').Ref<T|null>} */
  const data      = ref(initialData)
  const isLoading = ref(false)
  const error     = ref(null)
  /** @type {import('vue').Ref<Object|null>} */
  const meta      = ref(null)

  /**
   * Executa o fetch e atualiza o estado reativo.
   * Pode ser chamado manualmente para refresh.
   */
  async function refresh() {
    isLoading.value = true
    error.value     = null

    try {
      const response = await fetchFn()
      const payload  = response.data

      // Suporte ao envelope padrão da API CI4: { success, data, meta, message }
      data.value = payload?.data  ?? payload
      meta.value = payload?.meta  ?? null
    } catch (err) {
      error.value = err.message ?? 'Erro inesperado ao buscar dados.'
      console.error('[useApiWidget]', err)
    } finally {
      isLoading.value = false
    }
  }

  if (immediate) {
    onMounted(refresh)
  }

  return { data, isLoading, error, meta, refresh }
}
