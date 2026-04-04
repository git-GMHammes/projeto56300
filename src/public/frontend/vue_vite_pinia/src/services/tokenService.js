/**
 * Serviço de gerenciamento do token de autenticação no localStorage.
 *
 * Existe como módulo independente para evitar dependência circular entre
 * o axios-config.js e a auth store. Ambos importam daqui, nunca um do outro.
 */

const TOKEN_KEY = 'hub_auth_token'
const USER_KEY  = 'hub_auth_user'

export const tokenService = {
  /** Recupera o token salvo */
  get: () => localStorage.getItem(TOKEN_KEY),

  /** Persiste o token */
  set: (token) => localStorage.setItem(TOKEN_KEY, token),

  /** Remove o token e os dados do usuário (logout) */
  remove: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  /** Retorna true se existe um token salvo */
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  /** Salva os dados do usuário logado */
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  /** Recupera os dados do usuário logado */
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
}
