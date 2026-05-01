import type { IGroupMessageRepository } from '../../domain/repositories/IGroupMessageRepository'
import type { GroupMessage, CreateGroupMessagePayload, UpdateGroupMessagePayload } from '../../domain/entities/GroupMessage'
import type { PaginatedData } from '../../../shared/types'
import { GroupMessageRemoteDataSource } from '../datasources/GroupMessageRemoteDataSource'
import { GroupMessageMapper } from '../mappers/GroupMessageMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class GroupMessageRepositoryImpl implements IGroupMessageRepository {
  private readonly ds = new GroupMessageRemoteDataSource()

  async getAll(page = 1, perPage = 30): Promise<PaginatedData<GroupMessage>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupMessageMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<GroupMessage> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMessageMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 30): Promise<PaginatedData<GroupMessage>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupMessageMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateGroupMessagePayload): Promise<GroupMessage> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMessageMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdateGroupMessagePayload): Promise<GroupMessage> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMessageMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
