import type { IGroupRepository } from '../../domain/repositories/IGroupRepository'
import type { Group, CreateGroupPayload, UpdateGroupPayload } from '../../domain/entities/Group'
import type { PaginatedData } from '../../../shared/types'
import { GroupRemoteDataSource } from '../datasources/GroupRemoteDataSource'
import { GroupMapper } from '../mappers/GroupMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class GroupRepositoryImpl implements IGroupRepository {
  private readonly ds = new GroupRemoteDataSource()

  async getAll(page = 1, perPage = 15): Promise<PaginatedData<Group>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<Group> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 15): Promise<PaginatedData<Group>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateGroupPayload): Promise<Group> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdateGroupPayload): Promise<Group> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
