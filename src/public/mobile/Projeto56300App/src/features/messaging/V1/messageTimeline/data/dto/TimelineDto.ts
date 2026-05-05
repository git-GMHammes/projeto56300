export interface TimelineDto {
  id: number
  tenant_id: number
  user_management_id: number
  content: string
  is_pinned: 0 | 1
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateTimelineDtoRequest {
  tenant_id: number
  user_management_id: number
  content: string
  is_pinned?: 0 | 1
}

export interface UpdateTimelineDtoRequest {
  content?: string
  is_pinned?: 0 | 1
}
