import { httpClient } from '../../../../core/services/HttpClient'
import { API_BASE_URL } from '../../../../core/config/env'
import type {
  CreateUserManagementDto,
  CreateUserManagementResponseDto,
  CreateUserCustomerDto,
  CreateUserCustomerResponseDto,
} from '../dto/SaveUserDto'
import type { UserDto, PaginatedUserDto } from '../dto/UserDto'

const BASE = '/api/v1'

export class UserRemoteDataSource {
  async createManagement(payload: CreateUserManagementDto): Promise<CreateUserManagementResponseDto> {
    const envelope = await httpClient<{ data: CreateUserManagementResponseDto }>(`${BASE}/user-management/create`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return (envelope as any).data ?? envelope
  }

  async createCustomer(payload: CreateUserCustomerDto): Promise<{ id: string }> {
    const result = await httpClient<{ data: CreateUserCustomerResponseDto }>(`${BASE}/user-customer/create`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const record = (result as any)?.data ?? result
    return { id: String(record.id) }
  }

  async uploadAvatar(customerId: string, uri: string): Promise<void> {
    const filename = uri.split('/').pop() ?? 'avatar.jpg'
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg'
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    }
    const mime = mimeTypes[ext] ?? 'image/jpeg'

    const formData = new FormData()
    formData.append('file', { uri, type: mime, name: filename } as unknown as Blob)

    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    await fetch(`${base}/api/v1/user-customer/upload-avatar/${customerId}`, {
      method: 'POST',
      body: formData,
    })
  }

  async find(params: Record<string, unknown>): Promise<PaginatedUserDto> {
    return httpClient<PaginatedUserDto>(`${BASE}/user-management/find`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getById(id: string): Promise<UserDto> {
    return httpClient<UserDto>(`${BASE}/user-management/get/${id}`)
  }
}
