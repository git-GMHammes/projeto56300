import type { IGroupMemberRepository } from '../../domain/repositories/IGroupMemberRepository'
import type { GroupMember, CreateGroupMemberPayload, UpdateGroupMemberPayload } from '../../domain/entities/GroupMember'
import type { PaginatedData } from '../../../shared/types'
import { GroupMemberRemoteDataSource } from '../datasources/GroupMemberRemoteDataSource'
import { GroupMemberMapper } from '../mappers/GroupMemberMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class GroupMemberRepositoryImpl implements IGroupMemberRepository {
  private readonly ds = new GroupMemberRemoteDataSource()

  async getAll(page = 1, perPage = 50): Promise<PaginatedData<GroupMember>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupMemberMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<GroupMember> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMemberMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 50): Promise<PaginatedData<GroupMember>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: GroupMemberMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateGroupMemberPayload): Promise<GroupMember> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMemberMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdateGroupMemberPayload): Promise<GroupMember> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return GroupMemberMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
