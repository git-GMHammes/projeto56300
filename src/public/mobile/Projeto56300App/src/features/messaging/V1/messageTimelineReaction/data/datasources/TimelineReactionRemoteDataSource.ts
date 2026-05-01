import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { TimelineReactionDto, CreateTimelineReactionDtoRequest, UpdateTimelineReactionDtoRequest } from '../dto/TimelineReactionDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-timeline-reaction'

export class TimelineReactionRemoteDataSource {
  getAll(page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<TimelineReactionDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<TimelineReactionDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<TimelineReactionDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateTimelineReactionDtoRequest): Promise<ApiEnvelope<TimelineReactionDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateTimelineReactionDtoRequest): Promise<ApiEnvelope<TimelineReactionDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
