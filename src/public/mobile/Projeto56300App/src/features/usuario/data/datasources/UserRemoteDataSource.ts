import { httpClient } from '../../../../core/services/HttpClient'
import type {
  CreateUserManagementDto,
  CreateUserManagementResponseDto,
  CreateUserCustomerDto,
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

  async createCustomer(payload: CreateUserCustomerDto): Promise<void> {
    await httpClient(`${BASE}/user-customer/create`, {
      method: 'POST',
      body: JSON.stringify(payload),
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
