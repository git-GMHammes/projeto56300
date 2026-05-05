import type { GroupMemberRole } from '../../../shared/types'

export interface GroupMember {
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

export interface CreateGroupMemberPayload {
  group_id: number
  user_management_id: number
  role?: GroupMemberRole
}

export interface UpdateGroupMemberPayload {
  role?: GroupMemberRole
  left_at?: string
}
