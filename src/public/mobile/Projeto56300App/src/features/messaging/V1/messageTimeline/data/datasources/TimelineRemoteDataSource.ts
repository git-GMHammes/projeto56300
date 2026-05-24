import { httpClient, httpClientFormData } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { TimelineDto, TimelineViewDto, CreateTimelineDtoRequest, UpdateTimelineDtoRequest } from '../dto/TimelineDto'

interface PaginatedEnvelope<T> {
  success: boolean
  message: string
  statusCode: number
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

const TABLE_BASE = '/api/v1/msg-timeline'
const VIEW_BASE = '/api/v1/msg-timeline-view'

export class TimelineRemoteDataSource {
  getAll(page = 1, perPage = 15): Promise<PaginatedEnvelope<TimelineViewDto>> {
    return httpClient(`${VIEW_BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<TimelineDto>> {
    return httpClient(`${TABLE_BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<TimelineDto>>> {
    return httpClient(`${TABLE_BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateTimelineDtoRequest): Promise<ApiEnvelope<TimelineDto>> {
    return httpClient(`${TABLE_BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateTimelineDtoRequest): Promise<ApiEnvelope<TimelineDto>> {
    return httpClient(`${TABLE_BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  createMultipart(formData: FormData): Promise<ApiEnvelope<TimelineDto>> {
    return httpClientFormData(`${TABLE_BASE}/create`, formData, 60_000)
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${TABLE_BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
