import { httpClient, httpClientRaw } from '../../../../core/services/HttpClient'
import type { LoginRequestDto, LoginResponseDto } from '../dto/LoginDto'
import type { AuthUserDto, AuthUserGroupDto, PaginatedAuthUserDto } from '../dto/AuthUserDto'
import type { ApiEnvelope } from '../../../../core/services/HttpClient'

const BASE = '/api/v1/auth'

export class AuthRemoteDataSource {
  async login(payload: LoginRequestDto): Promise<ApiEnvelope<LoginResponseDto>> {
    return httpClientRaw<LoginResponseDto>(`${BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async logout(): Promise<void> {
    await httpClient(`${BASE}/logout`, { method: 'POST' })
  }

  async recoverPassword(payload: { uc_mail: string }): Promise<void> {
    await httpClient(`${BASE}/recover-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async resetPassword(payload: {
    token: string
    password: string
    password_confirm: string
  }): Promise<void> {
    await httpClient(`${BASE}/reset-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async find(params: Record<string, unknown>): Promise<PaginatedAuthUserDto> {
    return httpClient<PaginatedAuthUserDto>(`${BASE}/find`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getGrouped(params: Record<string, unknown>): Promise<AuthUserGroupDto[]> {
    return httpClient<AuthUserGroupDto[]>(`${BASE}/get-grouped`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async search(q: string): Promise<AuthUserDto[]> {
    return httpClient<AuthUserDto[]>(`${BASE}/search?q=${encodeURIComponent(q)}`)
  }

  async getById(id: number): Promise<AuthUserDto> {
    return httpClient<AuthUserDto>(`${BASE}/get/${id}`)
  }

  async getAll(): Promise<AuthUserDto[]> {
    return httpClient<AuthUserDto[]>(`${BASE}/get-all`)
  }
}
