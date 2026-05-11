import type { IUserRepository, CreateUserPayload, CreateProfilePayload, FindUsersParams, PaginatedUsers } from '../../domain/repositories/IUserRepository'
import type { User } from '../../domain/entities/User'
import type { UserProfile } from '../../domain/entities/UserProfile'
import { UserRemoteDataSource } from '../datasources/UserRemoteDataSource'
import { UserMapper } from '../mappers/UserMapper'

export class UserRepositoryImpl implements IUserRepository {
  private readonly ds = new UserRemoteDataSource()

  async createUser(payload: CreateUserPayload): Promise<{ id: string }> {
    const result = await this.ds.createManagement({
      user: payload.username,
      password: payload.password,
      is_active: '0',
    })
    return { id: String(result.id) }
  }

  async createProfile(payload: CreateProfilePayload): Promise<{ customerId: string }> {
    const result = await this.ds.createCustomer({
      user_management_id: payload.userId,
      name: payload.name,
      cpf: payload.cpf,
      whatsapp: payload.whatsapp,
      mail: payload.mail,
      phone: payload.phone,
      date_birth: payload.dateBirth,
      zip_code: payload.zipCode,
      address: payload.address,
    })
    return { customerId: result.id }
  }

  async uploadAvatar(customerId: string, uri: string): Promise<void> {
    await this.ds.uploadAvatar(customerId, uri)
  }

  async uploadFiles(userId: string, fileUri: string): Promise<void> {
    await this.ds.uploadFiles(userId, fileUri)
  }

  async findUsers(params: FindUsersParams): Promise<PaginatedUsers> {
    const dto = await this.ds.find(params as Record<string, unknown>)
    return UserMapper.toPaginatedUsers(dto)
  }

  async getById(id: string): Promise<User & { profile?: UserProfile }> {
    const dto = await this.ds.getById(id)
    return UserMapper.toUser(dto)
  }

  async updateUser(_id: string, _payload: Partial<CreateUserPayload>): Promise<void> {
    // implementar via endpoint update quando disponível na API
  }

  async updateProfile(_userId: string, _payload: Partial<CreateProfilePayload>): Promise<void> {
    // implementar via endpoint update quando disponível na API
  }
}
