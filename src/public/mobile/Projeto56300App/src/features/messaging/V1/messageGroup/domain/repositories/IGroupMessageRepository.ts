import type { PaginatedData } from '../../../shared/types'
import type { GroupMessage, CreateGroupMessagePayload, UpdateGroupMessagePayload } from '../entities/GroupMessage'

export interface IGroupMessageRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<GroupMessage>>
  get(id: number): Promise<GroupMessage>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<GroupMessage>>
  create(payload: CreateGroupMessagePayload): Promise<GroupMessage>
  update(id: number, payload: UpdateGroupMessagePayload): Promise<GroupMessage>
  deleteSoft(id: number): Promise<void>
}
