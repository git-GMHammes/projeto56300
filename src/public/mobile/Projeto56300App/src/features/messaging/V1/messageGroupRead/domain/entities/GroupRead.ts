export interface GroupRead {
  id: number
  group_id: number
  user_management_id: number
  last_read_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateGroupReadPayload {
  group_id: number
  user_management_id: number
  last_read_id?: number
}

export interface UpdateGroupReadPayload {
  last_read_id?: number
}

export interface MarkReadPayload {
  group_id: number
  user_management_id: number
  last_read_id: number
}
