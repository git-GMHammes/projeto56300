import { httpClient } from '../../../../../../core/services/HttpClient'
import type { ApiEnvelope } from '../../../../../../core/services/HttpClient'
import type { GroupMemberDto, CreateGroupMemberDtoRequest, UpdateGroupMemberDtoRequest } from '../dto/GroupMemberDto'
import type { PaginatedData } from '../../../shared/types'

const BASE = '/api/v1/msg-group-member'

export class GroupMemberRemoteDataSource {
  getAll(page = 1, perPage = 50): Promise<ApiEnvelope<PaginatedData<GroupMemberDto>>> {
    return httpClient(`${BASE}/get-all?page=${page}&per_page=${perPage}`)
  }

  get(id: number): Promise<ApiEnvelope<GroupMemberDto>> {
    return httpClient(`${BASE}/get/${id}`)
  }

  search(q: string, page = 1, perPage = 50): Promise<ApiEnvelope<PaginatedData<GroupMemberDto>>> {
    return httpClient(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&per_page=${perPage}`)
  }

  create(payload: CreateGroupMemberDtoRequest): Promise<ApiEnvelope<GroupMemberDto>> {
    return httpClient(`${BASE}/create`, { method: 'POST', body: JSON.stringify(payload) })
  }

  update(id: number, payload: UpdateGroupMemberDtoRequest): Promise<ApiEnvelope<GroupMemberDto>> {
    return httpClient(`${BASE}/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  }

  deleteSoft(id: number): Promise<ApiEnvelope<void>> {
    return httpClient(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
  }
}
