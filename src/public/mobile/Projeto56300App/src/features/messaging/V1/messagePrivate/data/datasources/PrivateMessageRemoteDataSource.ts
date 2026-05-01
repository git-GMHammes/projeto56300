import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { PrivateMessageDto, CreatePrivateMessageDtoRequest, UpdatePrivateMessageDtoRequest } from '../dto/PrivateMessageDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-private'

export class PrivateMessageRemoteDataSource {
  getAll(page = 1, perPage = 20): Promise<ApiEnvelope<PaginatedData<PrivateMessageDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<PrivateMessageDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 20): Promise<ApiEnvelope<PaginatedData<PrivateMessageDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreatePrivateMessageDtoRequest): Promise<ApiEnvelope<PrivateMessageDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdatePrivateMessageDtoRequest): Promise<ApiEnvelope<PrivateMessageDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
