import type { IMessageFileRepository } from '../../domain/repositories/IMessageFileRepository'
import type { MessageFile, CreateMessageFilePayload } from '../../domain/entities/MessageFile'
import type { PaginatedData } from '../../../shared/types'
import { MessageFileRemoteDataSource } from '../datasources/MessageFileRemoteDataSource'
import { MessageFileMapper } from '../mappers/MessageFileMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class MessageFileRepositoryImpl implements IMessageFileRepository {
  private readonly ds = new MessageFileRemoteDataSource()

  async getAll(page = 1, perPage = 20): Promise<PaginatedData<MessageFile>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: MessageFileMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<MessageFile> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return MessageFileMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 20): Promise<PaginatedData<MessageFile>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: MessageFileMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateMessageFilePayload): Promise<MessageFile> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return MessageFileMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
