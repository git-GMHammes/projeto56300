import type { PaginatedData } from '../../../shared/types'
import type { GroupMember, CreateGroupMemberPayload, UpdateGroupMemberPayload } from '../entities/GroupMember'

export interface IGroupMemberRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<GroupMember>>
  get(id: number): Promise<GroupMember>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<GroupMember>>
  create(payload: CreateGroupMemberPayload): Promise<GroupMember>
  update(id: number, payload: UpdateGroupMemberPayload): Promise<GroupMember>
  deleteSoft(id: number): Promise<void>
}
