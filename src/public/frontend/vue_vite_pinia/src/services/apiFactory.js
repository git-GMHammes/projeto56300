import api from '@/api/axios-config'

/**
 * Factory que gera um Service completo para qualquer módulo da API.
 * Implementa TODOS os endpoints definidos no padrão REST do sistema.
 *
 * Para criar um novo serviço, basta uma linha:
 * @example
 *   export const productService = createApiService('products')
 *
 * @param {string} module - Nome do módulo (ex: 'users', 'payments', 'products')
 * @returns {Object} Service com todos os métodos CRUD + paginação + soft delete
 */
export function createApiService(module) {
  const base = `/api/v1/${module}`

  return {
    /**
     * Busca com filtros avançados via POST body.
     * @param {{ page?: number, limit?: number, sort?: string, order?: string, [key: string]: any }} params
     */
    find(params = {}) {
      const { page = 1, limit = 20, sort = 'id', order = 'desc', ...filters } = params
      return api.post(
        `${base}/find?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
        filters,
      )
    },

    /**
     * Busca agrupada com agregações.
     * @param {{ page?: number, limit?: number, sort?: string, order?: string, [key: string]: any }} params
     */
    getGrouped(params = {}) {
      const { page = 1, limit = 20, sort = 'id', order = 'desc', ...body } = params
      return api.post(
        `${base}/get-grouped?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
        body,
      )
    },

    /**
     * Pesquisa textual full-text.
     * @param {string} q - Termo de busca
     * @param {{ page?: number, limit?: number, sort?: string, order?: string }} params
     */
    search(q, params = {}) {
      const { page = 1, limit = 20, sort = 'id', order = 'desc' } = params
      return api.get(`${base}/search`, { params: { q, page, limit, sort, order } })
    },

    /**
     * Busca um registro por ID.
     * @param {number|string} id
     */
    getById: (id) => api.get(`${base}/get/${id}`),

    /**
     * Lista todos com paginação.
     * @param {{ page?: number, limit?: number, sort?: string, order?: string }} params
     */
    getAll(params = {}) {
      const { page = 1, limit = 20, sort = 'id', order = 'desc' } = params
      return api.get(`${base}/get-all`, { params: { page, limit, sort, order } })
    },

    /**
     * Lista todos SEM paginação (para selects, dropdowns, exportações).
     * @param {{ sort?: string, order?: string }} params
     */
    getNoPagination(params = {}) {
      const { sort = 'id', order = 'desc' } = params
      return api.get(`${base}/get-no-pagination`, { params: { sort, order } })
    },

    /**
     * Busca um registro que foi soft-deleted por ID.
     * @param {number|string} id
     */
    getDeleted: (id) => api.get(`${base}/get-deleted/${id}`),

    /**
     * Lista todos os registros soft-deleted com paginação.
     * @param {{ page?: number, limit?: number, sort?: string, order?: string }} params
     */
    getDeletedAll(params = {}) {
      const { page = 1, limit = 20, sort = 'id', order = 'desc' } = params
      return api.get(`${base}/get-deleted-all`, { params: { page, limit, sort, order } })
    },

    /**
     * Cria um novo registro.
     * @param {Object} data
     */
    create: (data) => api.post(`${base}/create`, data),

    /**
     * Atualiza um registro existente.
     * @param {number|string} id
     * @param {Object} data
     */
    update: (id, data) => api.put(`${base}/update/${id}`, data),

    /**
     * Soft delete — marca como deletado mas mantém no banco.
     * @param {number|string} id
     */
    deleteSoft: (id) => api.delete(`${base}/delete-soft/${id}`),

    /**
     * Restaura um registro soft-deleted.
     * @param {number|string} id
     */
    restore: (id) => api.patch(`${base}/delete-restore/${id}`),

    /**
     * Hard delete — remove permanentemente do banco de dados.
     * @param {number|string} id
     */
    deleteHard: (id) => api.delete(`${base}/delete-hard/${id}`),

    /**
     * Limpa TODOS os soft deletes do módulo.
     */
    clearDeleted: () => api.delete(`${base}/clear-deleted`),

    /**
     * Limpa o soft delete de um registro específico.
     * @param {number|string} id
     */
    clearDeletedById: (id) => api.delete(`${base}/clear-deleted/${id}`),
  }
}
