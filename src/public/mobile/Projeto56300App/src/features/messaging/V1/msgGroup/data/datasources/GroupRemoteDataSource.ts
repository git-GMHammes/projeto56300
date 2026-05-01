import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { GroupDto, CreateGroupDtoRequest, UpdateGroupDtoRequest } from '../dto/GroupDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-group'

export class GroupRemoteDataSource {
  getAll(page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<GroupDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<GroupDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 15): Promise<ApiEnvelope<PaginatedData<GroupDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateGroupDtoRequest): Promise<ApiEnvelope<GroupDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateGroupDtoRequest): Promise<ApiEnvelope<GroupDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
