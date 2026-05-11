import { APP_BASE_HOST, APP_VERSION } from '../../../../../config/constants'

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/messaging/group`

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Group {
  id: number
  tenant_id: number
  name: string
  description: string | null
  avatar: string | null
  created_by: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  // campos extras vindos de JOIN/view
  member_count?: number
  my_role?: 'admin' | 'member'
  unread_count?: number
}

export interface GroupMember {
  id: number
  group_id: number
  user_management_id: number
  role: 'admin' | 'member'
  joined_at: string
  left_at: string | null
  user_name?: string
  user_profile?: string | null
}

export interface MessageGroup {
  id: number
  group_id: number
  user_management_id: number
  reply_to_id: number | null
  content: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  author_name?: string
  author_profile?: string | null
  reply_to_content?: string | null
  reply_to_author?: string | null
  has_files?: boolean
}

export interface CreateGroupPayload {
  name: string
  description?: string
  member_ids?: number[]
}

export interface SendMessageGroupPayload {
  content: string
  reply_to_id?: number
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface MessagesResponse {
  data: MessageGroup[]
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

// ─── Service — msg_004_group ──────────────────────────────────────────────────

export async function getAll(): Promise<Group[]> {
  return http(`${BASE}/get-all`)
}

export async function getById(id: number): Promise<Group> {
  return http(`${BASE}/get/${id}`)
}

export async function create(payload: CreateGroupPayload): Promise<ApiResponse<Group>> {
  return http(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function update(
  id: number,
  payload: Partial<CreateGroupPayload>,
): Promise<ApiResponse<Group>> {
  return http(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteSoft(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
}

// ─── Service — msg_005_group_member ───────────────────────────────────────────

export async function getMembers(groupId: number): Promise<GroupMember[]> {
  return http(`${BASE}/${groupId}/members`)
}

export async function addMember(
  groupId: number,
  userId: number,
  role: 'admin' | 'member' = 'member',
): Promise<ApiResponse<GroupMember>> {
  return http(`${BASE}/${groupId}/members`, {
    method: 'POST',
    body: JSON.stringify({ user_management_id: userId, role }),
  })
}

export async function removeMember(
  groupId: number,
  userId: number,
): Promise<ApiResponse<null>> {
  return http(`${BASE}/${groupId}/members/${userId}`, { method: 'DELETE' })
}

export async function updateMemberRole(
  groupId: number,
  userId: number,
  role: 'admin' | 'member',
): Promise<ApiResponse<GroupMember>> {
  return http(`${BASE}/${groupId}/members/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

// ─── Service — msg_006_group_message ─────────────────────────────────────────

export async function getMessages(groupId: number, page = 1): Promise<MessagesResponse> {
  return http(`${BASE}/${groupId}/messages?page=${page}`)
}

export async function sendMessage(
  groupId: number,
  payload: SendMessageGroupPayload,
): Promise<ApiResponse<MessageGroup>> {
  return http(`${BASE}/${groupId}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteMessage(
  groupId: number,
  messageId: number,
): Promise<ApiResponse<null>> {
  return http(`${BASE}/${groupId}/messages/${messageId}`, { method: 'DELETE' })
}

// ─── Service — msg_007_group_read ────────────────────────────────────────────

export async function markRead(groupId: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/${groupId}/mark-read`, { method: 'PATCH' })
}
