import type { PaginatedData } from '../../../shared/types'
import type { GroupRead, CreateGroupReadPayload, UpdateGroupReadPayload, MarkReadPayload } from '../entities/GroupRead'

export interface IGroupReadRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<GroupRead>>
  get(id: number): Promise<GroupRead>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<GroupRead>>
  create(payload: CreateGroupReadPayload): Promise<GroupRead>
  update(id: number, payload: UpdateGroupReadPayload): Promise<GroupRead>
  markRead(payload: MarkReadPayload): Promise<void>
  deleteSoft(id: number): Promise<void>
}
