import axios from 'axios'
import { tokenService } from '@/services/tokenService'

/**
 * Instância central do Axios para todas as chamadas à API interna.
 * TODOS os Services do sistema DEVEM usar esta instância.
 *
 * Interceptors configurados:
 *  - Request:  injeta Bearer Token automaticamente
 *  - Response: trata erros HTTP globalmente (401, 403, 5xx)
 *
 * @type {import('axios').AxiosInstance}
 */

// ─── URL base automática ──────────────────────────────────────────────────────
// DEV  → 'http://localhost:56300'             → npm run dev
// PROD → 'https://habilidade.com/projeto56300' → npm run build
const isDev = import.meta.env.MODE === 'development'
const BASE_URL = isDev
  ? 'http://localhost:56300'
  : 'https://habilidade.com/projeto56300'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// INTERCEPTOR DE REQUISIÇÃO
// Injeta o Bearer Token em todas as requisições autenticadas
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = tokenService.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─────────────────────────────────────────────────────────────────────────────
// INTERCEPTOR DE RESPOSTA
// Tratamento global de erros HTTP — evita repetição nos componentes
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  // Sucesso: repassa a resposta sem modificação
  (response) => response,

  // Erro: trata por status code
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expirado ou inválido — limpa sessão e redireciona
      tokenService.remove()
      window.location.hash = '#/login'
    }

    if (status === 403) {
      console.warn('[API] Acesso negado (403):', error.config?.url)
    }

    if (status >= 500) {
      console.error('[API] Erro interno do servidor:', error.response?.data)
    }

    // Normaliza a mensagem de erro para facilitar o tratamento nas stores
    const normalized = new Error(
      error.response?.data?.message ?? error.message ?? 'Erro inesperado.'
    )
    normalized.status   = status
    normalized.response = error.response

    return Promise.reject(normalized)
  },
)

export default api
