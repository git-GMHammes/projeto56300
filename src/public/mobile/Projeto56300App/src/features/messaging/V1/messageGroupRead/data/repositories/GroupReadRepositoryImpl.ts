import type { IGroupReadRepository } from '../../domain/repositories/IGroupReadRepository'
import type { GroupRead, CreateGroupReadPayload, UpdateGroupReadPayload, MarkReadPayload } from '../../domain/entities/GroupRead'
import type { PaginatedData } from '../../../shared/types'
import { GroupReadRemoteDataSource } from '../datasources/GroupReadRemoteDataSource'
import { GroupReadMapper } from '../mappers/GroupReadMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class GroupReadRepositoryImpl implements IGroupReadRepository {
  private readonly ds = new GroupReadRemoteDataSource()

  async getAll(page = 1, perPage = 50): Promise<PaginatedData<GroupRead>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupReadMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<GroupRead> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupReadMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 50): Promise<PaginatedData<GroupRead>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupReadMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateGroupReadPayload): Promise<GroupRead> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupReadMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdateGroupReadPayload): Promise<GroupRead> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupReadMapper.toEntity(env.data)
  }

  async markRead(payload: MarkReadPayload): Promise<void> {
    const env = await this.ds.markRead(payload)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
