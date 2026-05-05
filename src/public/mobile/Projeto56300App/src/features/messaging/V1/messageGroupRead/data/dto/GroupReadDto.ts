export interface GroupReadDto {
  id: number
  group_id: number
  user_management_id: number
  last_read_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateGroupReadDtoRequest {
  group_id: number
  user_management_id: number
  last_read_id?: number
}

export interface UpdateGroupReadDtoRequest {
  last_read_id?: number
}

export interface MarkReadDtoRequest {
  group_id: number
  user_id: number
  last_read_id: number
}
