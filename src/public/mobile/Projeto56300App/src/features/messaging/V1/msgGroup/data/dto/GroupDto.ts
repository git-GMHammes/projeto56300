export interface GroupDto {
  id: number
  tenant_id: number
  name: string
  description: string | null
  avatar: string | null
  created_by: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateGroupDtoRequest {
  tenant_id: number
  name: string
  description?: string
  avatar?: string
  created_by: number
}

export interface UpdateGroupDtoRequest {
  name?: string
  description?: string
  avatar?: string
}
