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

export interface TimelineViewDto {
  id: number
  mt_user_saas_tenants_id: number
  mt_user_management_id: number
  mt_content: string
  mt_is_pinned: 0 | 1
  created_at: string
  updated_at: string
  deleted_at: string | null
  ut_id: number
  ut_user_management_id: number
  ut_user_saas_tenants_id: number
  ut_role: string
  um_id: number
  um_uuid: string
  um_user: string
  um_is_active: number
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
