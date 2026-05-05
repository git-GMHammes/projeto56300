import type { IPrivateMessageRepository } from '../../domain/repositories/IPrivateMessageRepository'
import type { PrivateMessage, CreatePrivateMessagePayload, UpdatePrivateMessagePayload } from '../../domain/entities/PrivateMessage'
import type { PaginatedData } from '../../../shared/types'
import { PrivateMessageRemoteDataSource } from '../datasources/PrivateMessageRemoteDataSource'
import { PrivateMessageMapper } from '../mappers/PrivateMessageMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class PrivateMessageRepositoryImpl implements IPrivateMessageRepository {
  private readonly ds = new PrivateMessageRemoteDataSource()

  async getAll(page = 1, perPage = 20): Promise<PaginatedData<PrivateMessage>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: PrivateMessageMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<PrivateMessage> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return PrivateMessageMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 20): Promise<PaginatedData<PrivateMessage>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: PrivateMessageMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreatePrivateMessagePayload): Promise<PrivateMessage> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return PrivateMessageMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdatePrivateMessagePayload): Promise<PrivateMessage> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return PrivateMessageMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
