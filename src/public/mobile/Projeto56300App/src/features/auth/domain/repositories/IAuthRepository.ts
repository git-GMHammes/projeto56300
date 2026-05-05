import type { AuthSession } from '../entities/AuthSession'
import type { AuthUser, AuthUserGroup } from '../entities/AuthUser'

export interface LoginPayload {
  um_user: string
  um_password: string
  ut_user_saas_tenants_id: string
}

export interface RecoverPasswordPayload {
  uc_mail: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  password_confirm: string
}

export interface FindParams {
  search?: string
  page?: number
  per_page?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<AuthSession>
  logout(): Promise<void>
  recoverPassword(payload: RecoverPasswordPayload): Promise<void>
  resetPassword(payload: ResetPasswordPayload): Promise<void>
  find(params: FindParams): Promise<PaginatedResult<AuthUser>>
  getGrouped(params?: Record<string, unknown>): Promise<AuthUserGroup[]>
  search(q: string): Promise<AuthUser[]>
  getById(id: number): Promise<AuthUser>
  getAll(): Promise<AuthUser[]>
}
