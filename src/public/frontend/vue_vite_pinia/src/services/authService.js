import api from '@/api/axios-config'

/**
 * Service para o módulo de Autenticação — /api/v1/auth
 *
 * Endpoints de autenticação:
 *   login, logout, recoverPassword
 *
 * Endpoints de leitura da view user_customer_view:
 *   find, getGrouped, search, getById, getAll, getNoPagination,
 *   getDeleted, getDeletedAll
 */
export const authService = {
  // ── Autenticação ────────────────────────────────────────────────────────────

  /**
   * Realiza o login do usuário.
   * @param {{ um_user: string, um_password: string }} credentials
   */
  login: (credentials) =>
    api.post('/api/v1/auth/login', credentials),

  /**
   * Realiza o logout do usuário autenticado.
   */
  logout: () =>
    api.post('/api/v1/auth/logout'),

  /**
   * Solicita recuperação de senha.
   * @param {string} mail
   */
  recoverPassword: (mail) =>
    api.post('/api/v1/auth/recover-password', { mail }),

  // ── Leitura da view (somente consulta) ──────────────────────────────────────

  /**
   * Busca com filtros avançados via POST body.
   * @param {{ page?: number, limit?: number, sort?: string, order?: string, [key: string]: any }} params
   */
  find(params = {}) {
    const { page = 1, limit = 20, sort = 'id', order = 'desc', ...filters } = params
    return api.post(
      `/api/v1/auth/find?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
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
      `/api/v1/auth/get-grouped?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
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
    return api.get('/api/v1/auth/search', { params: { q, page, limit, sort, order } })
  },

  /**
   * Busca um registro por ID.
   * @param {number|string} id
   */
  getById: (id) => api.get(`/api/v1/auth/get/${id}`),

  /**
   * Lista todos com paginação.
   * @param {{ page?: number, limit?: number, sort?: string, order?: string }} params
   */
  getAll(params = {}) {
    const { page = 1, limit = 20, sort = 'id', order = 'desc' } = params
    return api.get('/api/v1/auth/get-all', { params: { page, limit, sort, order } })
  },

  /**
   * Lista todos SEM paginação.
   * @param {{ sort?: string, order?: string }} params
   */
  getNoPagination(params = {}) {
    const { sort = 'id', order = 'desc' } = params
    return api.get('/api/v1/auth/get-no-pagination', { params: { sort, order } })
  },

  /**
   * Busca um registro soft-deleted por ID.
   * @param {number|string} id
   */
  getDeleted: (id) => api.get(`/api/v1/auth/get-deleted/${id}`),

  /**
   * Lista todos os registros soft-deleted com paginação.
   * @param {{ page?: number, limit?: number, sort?: string, order?: string }} params
   */
  getDeletedAll(params = {}) {
    const { page = 1, limit = 20, sort = 'id', order = 'desc' } = params
    return api.get('/api/v1/auth/get-deleted-all', { params: { page, limit, sort, order } })
  },
}
