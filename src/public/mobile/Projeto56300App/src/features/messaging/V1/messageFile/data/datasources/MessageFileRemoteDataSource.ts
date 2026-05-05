import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { MessageFileDto, CreateMessageFileDtoRequest } from '../dto/MessageFileDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-file'

export class MessageFileRemoteDataSource {
  getAll(page = 1, perPage = 20): Promise<ApiEnvelope<PaginatedData<MessageFileDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<MessageFileDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 20): Promise<ApiEnvelope<PaginatedData<MessageFileDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateMessageFileDtoRequest): Promise<ApiEnvelope<MessageFileDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
