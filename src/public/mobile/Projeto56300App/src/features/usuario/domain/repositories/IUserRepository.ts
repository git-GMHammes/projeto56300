import type { User } from '../entities/User'
import type { UserProfile } from '../entities/UserProfile'

export interface CreateUserPayload {
  username: string
  password: string
}

export interface CreateProfilePayload {
  userId: string
  name: string
  cpf: string
  whatsapp: string
  mail: string
  phone?: string
  dateBirth?: string
  zipCode?: string
  address?: string
}

export interface FindUsersParams {
  search?: string
  page?: number
  per_page?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
}

export interface PaginatedUsers {
  data: User[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface IUserRepository {
  createUser(payload: CreateUserPayload): Promise<{ id: string }>
  createProfile(payload: CreateProfilePayload): Promise<{ customerId: string }>
  findUsers(params: FindUsersParams): Promise<PaginatedUsers>
  getById(id: string): Promise<User & { profile?: UserProfile }>
  updateUser(id: string, payload: Partial<CreateUserPayload>): Promise<void>
  updateProfile(userId: string, payload: Partial<CreateProfilePayload>): Promise<void>
  uploadAvatar(customerId: string, uri: string): Promise<void>
}
