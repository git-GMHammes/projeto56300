import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { GroupMessageDto, CreateGroupMessageDtoRequest, UpdateGroupMessageDtoRequest } from '../dto/GroupMessageDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/message-group'

export class GroupMessageRemoteDataSource {
  getAll(page = 1, perPage = 30): Promise<ApiEnvelope<PaginatedData<GroupMessageDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<GroupMessageDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 30): Promise<ApiEnvelope<PaginatedData<GroupMessageDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateGroupMessageDtoRequest): Promise<ApiEnvelope<GroupMessageDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateGroupMessageDtoRequest): Promise<ApiEnvelope<GroupMessageDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
