import { APP_BASE_HOST, APP_VERSION } from '../../../../../config/constants'

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/messaging/file`

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type FileSource = 'timeline' | 'private' | 'group'
export type FileCategory = 'image' | 'video' | 'document' | 'audio' | 'other'

export interface MsgFile {
  id: number
  source: FileSource
  source_id: number
  user_management_id: number
  original_name: string
  filename: string
  stored_path: string
  uuid: string | null
  mime: string | null
  size: number | null
  category: FileCategory
  checksum: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

// ─── HTTP helper (sem Content-Type — fetch define automaticamente para FormData) ──

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('auth_token')
  const tokenType = sessionStorage.getItem('auth_token_type') ?? 'Bearer'

  const headers: Record<string, string> = {
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

// ─── Service — msg_008_file ───────────────────────────────────────────────────

export async function upload(
  source: FileSource,
  sourceId: number,
  file: File,
): Promise<ApiResponse<MsgFile>> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('source', source)
  formData.append('source_id', String(sourceId))
  return http(`${BASE}/upload`, { method: 'POST', body: formData })
}

export async function getBySource(
  source: FileSource,
  sourceId: number,
): Promise<MsgFile[]> {
  return http(`${BASE}/by-source/${source}/${sourceId}`)
}

export function getDownloadUrl(uuid: string): string {
  return `${BASE}/download/${uuid}`
}

export async function deleteSoft(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
}
