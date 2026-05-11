import { APP_BASE_HOST, APP_VERSION } from '../../../../../config/constants'

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/messaging/private`

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PrivateMessage {
  id: number
  tenant_id: number
  sender_id: number
  receiver_id: number
  content: string | null
  read_at: string | null
  created_at: string
  deleted_at: string | null
  // campos vindos de JOIN na view do backend
  sender_name?: string
  sender_profile?: string | null
  has_files?: boolean
}

export interface Conversation {
  user_management_id: number
  user_name: string
  user_profile: string | null
  last_message: string | null
  last_message_at: string | null
  unread_count: number
}

export interface SendMessagePayload {
  receiver_id: number
  content?: string
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface ThreadResponse {
  data: PrivateMessage[]
  meta: PaginationMeta
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('auth_token')
  const tokenType = sessionStorage.getItem('auth_token_type') ?? 'Bearer'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `${tokenType} ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.message ?? `HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

// ─── Service — msg_003_private ────────────────────────────────────────────────

export async function getConversations(): Promise<Conversation[]> {
  return http(`${BASE}/conversations`)
}

export async function getThread(withUserId: number, page = 1): Promise<ThreadResponse> {
  return http(`${BASE}/thread/${withUserId}?page=${page}`)
}

export async function send(payload: SendMessagePayload): Promise<ApiResponse<PrivateMessage>> {
  return http(`${BASE}/send`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function markRead(withUserId: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/mark-read/${withUserId}`, { method: 'PATCH' })
}

export async function deleteSoft(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
}
