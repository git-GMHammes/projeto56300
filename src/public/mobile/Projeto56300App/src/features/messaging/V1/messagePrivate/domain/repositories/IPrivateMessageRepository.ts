import type { PaginatedData } from '../../../shared/types'
import type { PrivateMessage, CreatePrivateMessagePayload, UpdatePrivateMessagePayload } from '../entities/PrivateMessage'

export interface IPrivateMessageRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<PrivateMessage>>
  get(id: number): Promise<PrivateMessage>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<PrivateMessage>>
  create(payload: CreatePrivateMessagePayload): Promise<PrivateMessage>
  update(id: number, payload: UpdatePrivateMessagePayload): Promise<PrivateMessage>
  deleteSoft(id: number): Promise<void>
}
