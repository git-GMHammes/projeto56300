import type { PaginatedData } from '../../../shared/types'
import type { TimelineReaction, CreateTimelineReactionPayload, UpdateTimelineReactionPayload } from '../entities/TimelineReaction'

export interface ITimelineReactionRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<TimelineReaction>>
  get(id: number): Promise<TimelineReaction>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<TimelineReaction>>
  create(payload: CreateTimelineReactionPayload): Promise<TimelineReaction>
  update(id: number, payload: UpdateTimelineReactionPayload): Promise<TimelineReaction>
  deleteSoft(id: number): Promise<void>
}
