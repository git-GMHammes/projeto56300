import type { ITimelineRepository } from '../../domain/repositories/ITimelineRepository'
import type { Timeline, CreateTimelinePayload, UpdateTimelinePayload } from '../../domain/entities/Timeline'
import type { PaginatedData } from '../../../shared/types'
import { TimelineRemoteDataSource } from '../datasources/TimelineRemoteDataSource'
import { TimelineMapper } from '../mappers/TimelineMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class TimelineRepositoryImpl implements ITimelineRepository {
  private readonly ds = new TimelineRemoteDataSource()

  async getAll(page = 1, perPage = 15): Promise<PaginatedData<Timeline>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: TimelineMapper.toEntityList(env.data.data) }
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
    const env = await this.ds.create(payload)
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
