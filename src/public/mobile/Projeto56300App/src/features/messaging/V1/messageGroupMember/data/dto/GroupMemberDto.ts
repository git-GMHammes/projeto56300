import type { GroupMemberRole } from '../../../shared/types'

export interface GroupMemberDto {
  id: number
  group_id: number
  user_management_id: number
  role: GroupMemberRole
  joined_at: string
  left_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateGroupMemberDtoRequest {
  group_id: number
  user_management_id: number
  role?: GroupMemberRole
}

export interface UpdateGroupMemberDtoRequest {
  role?: GroupMemberRole
  left_at?: string
}
