import { APP_BASE_HOST, APP_VERSION } from '../../../../../config/constants'

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/messaging/timeline`

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'

export interface ReactionCount {
  reaction: ReactionType
  count: number
}

export interface TimelinePost {
  id: number
  tenant_id: number
  user_id: number
  content: string
  is_pinned: 0 | 1
  created_at: string
  updated_at: string
  deleted_at: string | null
  // campos vindos de JOIN na view do backend
  author_name?: string
  author_profile?: string | null
  reactions?: ReactionCount[]
  my_reaction?: ReactionType | null
}

export interface TimelineReaction {
  id: number
  timeline_id: number
  user_id: number
  reaction: ReactionType
  created_at: string
}

export interface CreatePostPayload {
  content: string
  is_pinned?: 0 | 1
}

export interface FindParams {
  search?: string
  page?: number
  per_page?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
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

// ─── Service — msg_001_timeline ───────────────────────────────────────────────

export async function find(params: FindParams): Promise<PaginatedResponse<TimelinePost>> {
  return http(`${BASE}/find`, { method: 'POST', body: JSON.stringify(params) })
}

export async function getAll(): Promise<TimelinePost[]> {
  return http(`${BASE}/get-all`)
}

export async function getById(id: number): Promise<TimelinePost> {
  return http(`${BASE}/get/${id}`)
}

export async function create(payload: CreatePostPayload): Promise<ApiResponse<TimelinePost>> {
  return http(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function update(
  id: number,
  payload: Partial<CreatePostPayload>,
): Promise<ApiResponse<TimelinePost>> {
  return http(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteSoft(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
}

export async function pin(id: number): Promise<ApiResponse<TimelinePost>> {
  return http(`${BASE}/pin/${id}`, { method: 'PATCH' })
}

export async function unpin(id: number): Promise<ApiResponse<TimelinePost>> {
  return http(`${BASE}/unpin/${id}`, { method: 'PATCH' })
}

// ─── Service — msg_002_timeline_reaction ──────────────────────────────────────

export async function react(
  timelineId: number,
  reaction: ReactionType,
): Promise<ApiResponse<TimelineReaction>> {
  return http(`${BASE}/${timelineId}/reaction`, {
    method: 'POST',
    body: JSON.stringify({ reaction }),
  })
}

export async function removeReaction(timelineId: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/${timelineId}/reaction`, { method: 'DELETE' })
}

export async function getReactions(timelineId: number): Promise<ReactionCount[]> {
  return http(`${BASE}/${timelineId}/reactions`)
}
