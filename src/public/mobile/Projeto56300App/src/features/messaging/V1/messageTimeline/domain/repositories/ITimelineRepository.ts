import type { PaginatedData } from '../../../shared/types'
import type { Timeline, CreateTimelinePayload, UpdateTimelinePayload } from '../entities/Timeline'

export interface ITimelineRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<Timeline>>
  get(id: number): Promise<Timeline>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<Timeline>>
  create(payload: CreateTimelinePayload): Promise<Timeline>
  update(id: number, payload: UpdateTimelinePayload): Promise<Timeline>
  deleteSoft(id: number): Promise<void>
}
