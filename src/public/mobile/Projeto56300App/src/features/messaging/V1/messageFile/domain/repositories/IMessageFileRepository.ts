import type { PaginatedData } from '../../../shared/types'
import type { MessageFile, CreateMessageFilePayload } from '../entities/MessageFile'

export interface IMessageFileRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<MessageFile>>
  get(id: number): Promise<MessageFile>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<MessageFile>>
  create(payload: CreateMessageFilePayload): Promise<MessageFile>
  deleteSoft(id: number): Promise<void>
}
