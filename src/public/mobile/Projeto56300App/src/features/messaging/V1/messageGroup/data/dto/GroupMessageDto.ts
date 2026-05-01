export interface GroupMessageDto {
  id: number
  group_id: number
  user_management_id: number
  reply_to_id: number | null
  content: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateGroupMessageDtoRequest {
  group_id: number
  user_management_id: number
  content?: string
  reply_to_id?: number
}

export interface UpdateGroupMessageDtoRequest {
  content?: string
}
