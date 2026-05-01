import type { ITimelineReactionRepository } from '../../domain/repositories/ITimelineReactionRepository'
import type { TimelineReaction, CreateTimelineReactionPayload, UpdateTimelineReactionPayload } from '../../domain/entities/TimelineReaction'
import type { PaginatedData } from '../../../shared/types'
import { TimelineReactionRemoteDataSource } from '../datasources/TimelineReactionRemoteDataSource'
import { TimelineReactionMapper } from '../mappers/TimelineReactionMapper'
import { HttpError } from '../../../../../../core/services/HttpClient'

export class TimelineReactionRepositoryImpl implements ITimelineReactionRepository {
  private readonly ds = new TimelineReactionRemoteDataSource()

  async getAll(page = 1, perPage = 15): Promise<PaginatedData<TimelineReaction>> {
    const env = await this.ds.getAll(page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: TimelineReactionMapper.toEntityList(env.data.data) }
  }

  async get(id: number): Promise<TimelineReaction> {
    const env = await this.ds.get(id)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineReactionMapper.toEntity(env.data)
  }

  async search(q: string, page = 1, perPage = 15): Promise<PaginatedData<TimelineReaction>> {
    const env = await this.ds.search(q, page, perPage)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return { ...env.data, data: TimelineReactionMapper.toEntityList(env.data.data) }
  }

  async create(payload: CreateTimelineReactionPayload): Promise<TimelineReaction> {
    const env = await this.ds.create(payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineReactionMapper.toEntity(env.data)
  }

  async update(id: number, payload: UpdateTimelineReactionPayload): Promise<TimelineReaction> {
    const env = await this.ds.update(id, payload)
    if (!env.success || !env.data) throw new HttpError(env.message, env.statusCode)
    return TimelineReactionMapper.toEntity(env.data)
  }

  async deleteSoft(id: number): Promise<void> {
    const env = await this.ds.deleteSoft(id)
    if (!env.success) throw new HttpError(env.message, env.statusCode)
  }
}
