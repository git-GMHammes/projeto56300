import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tokenService } from '@/services/tokenService'
import api from '@/api/axios-config'

/**
 * Store de Autenticação.
 * Gerencia: token JWT, dados do usuário logado e permissões.
 *
 * Persistência: localStorage via tokenService (sobrevive ao F5).
 */
export const useAuthStore = defineStore('auth', () => {
  // ── Estado ────────────────────────────────────────────────────────────────
  /** @type {import('vue').Ref<string|null>} */
  const token     = ref(tokenService.get())
  /** @type {import('vue').Ref<Object|null>} */
  const user      = ref(tokenService.getUser())
  const isLoading = ref(false)
  const error     = ref(null)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const userFullName    = computed(() => user.value?.name ?? user.value?.email ?? 'Usuário')
  const userAvatar      = computed(() => user.value?.avatar ?? null)
  const userPermissions = computed(() => user.value?.permissions ?? [])
  const userRole        = computed(() => user.value?.role ?? 'guest')

  /**
   * Verifica se o usuário possui uma permissão específica.
   * @param {string} permission
   * @returns {boolean}
   */
  const hasPermission = (permission) => userPermissions.value.includes(permission)

  /**
   * Verifica se o usuário possui um determinado papel (role).
   * @param {string|string[]} roles
   * @returns {boolean}
   */
  const hasRole = (roles) => {
    const list = Array.isArray(roles) ? roles : [roles]
    return list.includes(userRole.value)
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Realiza o login, persiste o token e os dados do usuário.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  async function login(credentials) {
    isLoading.value = true
    error.value     = null

    try {
      const { data } = await api.post('/api/v1/auth/login', credentials)

      token.value = data.data.token
      user.value  = data.data.user

      tokenService.set(data.data.token)
      tokenService.setUser(data.data.user)

      return { success: true }
    } catch (err) {
      error.value = err.message ?? 'Falha na autenticação.'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Realiza o logout: limpa estado em memória e localStorage.
   */
  function logout() {
    token.value = null
    user.value  = null
    error.value = null
    tokenService.remove()
  }

  /**
   * Registra um novo usuário (user_management + user_customer em payload único).
   * O backend é responsável por inserir nas duas tabelas.
   * @param {Object} payload
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  async function register(payload) {
    isLoading.value = true
    error.value     = null

    try {
      await api.post('/api/v1/auth/register', payload)
      return { success: true }
    } catch (err) {
      error.value = err.message ?? 'Erro ao criar conta.'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Solicita recuperação de senha pelo e-mail do usuário.
   * @param {string} mail
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  async function recoverPassword(mail) {
    isLoading.value = true
    error.value     = null

    try {
      const { data } = await api.post('/api/v1/auth/recover', { mail })
      return { success: true, message: data?.message }
    } catch (err) {
      error.value = err.message ?? 'Erro ao solicitar recuperação.'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Busca os dados atualizados do usuário logado no backend.
   * Útil para sincronizar permissões após alterações no servidor.
   */
  async function refreshUser() {
    if (!isAuthenticated.value) return

    try {
      const { data } = await api.get('/api/v1/auth/me')
      user.value = data.data
      tokenService.setUser(data.data)
    } catch {
      // Token inválido — força logout
      logout()
    }
  }

  return {
    // Estado
    token, user, isLoading, error,
    // Getters
    isAuthenticated, userFullName, userAvatar, userPermissions, userRole,
    // Métodos
    hasPermission, hasRole, login, logout, register, recoverPassword, refreshUser,
  }
})
