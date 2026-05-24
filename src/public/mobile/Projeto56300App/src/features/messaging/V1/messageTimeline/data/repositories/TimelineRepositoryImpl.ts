import type { ITimelineRepository, FileAsset } from '../../domain/repositories/ITimelineRepository'
import type { Timeline, CreateTimelinePayload, UpdateTimelinePayload } from '../../domain/entities/Timeline'
import type { PaginatedData } from '../../../shared/types'
import { TimelineRemoteDataSource } from '../datasources/TimelineRemoteDataSource'
import { TimelineMapper } from '../mappers/TimelineMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class TimelineRepositoryImpl implements ITimelineRepository {
  private readonly ds = new TimelineRemoteDataSource()

  async getAll(page = 1, perPage = 15): Promise<PaginatedData<Timeline>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
    return {
      data: TimelineMapper.fromViewDtoList(env.data ?? []),
      currentPage: env.pagination?.page ?? page,
      perPage: env.pagination?.limit ?? perPage,
      total: env.pagination?.total ?? 0,
      pageCount: env.pagination?.pages ?? 1,
    }
  }

  async get(id: number): Promise<Timeline> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 15): Promise<PaginatedData<Timeline>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: TimelineMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateTimelinePayload): Promise<Timeline> {
    const env = await this.ds.create({
      user_saas_tenants_id: payload.tenant_id,
      user_management_id: payload.user_management_id,
      content: payload.content,
      is_pinned: payload.is_pinned,
    })
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineMapper.toEntity(env.data)
  }

  async createWithFile(payload: CreateTimelinePayload, file?: FileAsset): Promise<Timeline> {
    if (!file) return this.create(payload)

    const formData = new FormData()
    formData.append('content', payload.content)
    formData.append('user_saas_tenants_id', String(payload.tenant_id))
    formData.append('user_management_id', String(payload.user_management_id))
    if (payload.is_pinned !== undefined) {
      formData.append('is_pinned', String(payload.is_pinned))
    }
    formData.append('files[]', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob)

    const env = await this.ds.createMultipart(formData)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdateTimelinePayload): Promise<Timeline> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
