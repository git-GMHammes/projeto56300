import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { TimelineDto, CreateTimelineDtoRequest, UpdateTimelineDtoRequest } from '../dto/TimelineDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-timeline'

export class TimelineRemoteDataSource {
  getAll(page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<TimelineDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<TimelineDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<TimelineDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateTimelineDtoRequest): Promise<ApiEnvelope<TimelineDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateTimelineDtoRequest): Promise<ApiEnvelope<TimelineDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
