import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { GroupReadDto, CreateGroupReadDtoRequest, UpdateGroupReadDtoRequest, MarkReadDtoRequest } from '../dto/GroupReadDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-group-read'

export class GroupReadRemoteDataSource {
  getAll(page = 1, perPage = 50): Promise<ApiEnvelope<PaginatedData<GroupReadDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<GroupReadDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 50): Promise<ApiEnvelope<PaginatedData<GroupReadDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateGroupReadDtoRequest): Promise<ApiEnvelope<GroupReadDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateGroupReadDtoRequest): Promise<ApiEnvelope<GroupReadDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  markRead(payload: MarkReadDtoRequest): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/mark-read`, { method: 'PATCH', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
