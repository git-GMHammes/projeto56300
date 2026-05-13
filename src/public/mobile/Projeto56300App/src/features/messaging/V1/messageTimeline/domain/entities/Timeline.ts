export interface Timeline {
  id: number
  tenant_id: number
  user_management_id: number
  content: string
  is_pinned: 0 | 1
  created_at: string
  updated_at: string
  deleted_at: string | null
  author_name: string
  author_uuid: string
  author_role: string
}

export interface CreateTimelinePayload {
  tenant_id: number
  user_management_id: number
  content: string
  is_pinned?: 0 | 1
}

export interface UpdateTimelinePayload {
  content?: string
  is_pinned?: 0 | 1
}
