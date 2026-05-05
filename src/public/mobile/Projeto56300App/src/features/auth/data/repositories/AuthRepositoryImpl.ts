import type { IAuthRepository, LoginPayload, RecoverPasswordPayload, ResetPasswordPayload, FindParams, PaginatedResult } from '../../domain/repositories/IAuthRepository'
import type { AuthSession } from '../../domain/entities/AuthSession'
import type { AuthUser, AuthUserGroup } from '../../domain/entities/AuthUser'
import { AuthRemoteDataSource } from '../datasources/AuthRemoteDataSource'
import { AuthMapper } from '../mappers/AuthMapper'

export class AuthRepositoryImpl implements IAuthRepository {
  private readonly ds = new AuthRemoteDataSource()

  async login(payload: LoginPayload): Promise<AuthSession> {
    const envelope = await this.ds.login({
      um_user: payload.um_user,
      um_password: payload.um_password,
      ut_user_saas_tenants_id: payload.ut_user_saas_tenants_id,
    })

    if (!envelope.success || !envelope.data) {
      if (envelope.errors) {
        const firstError = Object.values(envelope.errors)[0]
        throw new Error(firstError ?? envelope.message)
      }
      throw new Error(envelope.message ?? 'Credenciais inválidas')
    }

    return AuthMapper.toSession(envelope.data)
  }

  async logout(): Promise<void> {
    await this.ds.logout()
  }

  async recoverPassword(payload: RecoverPasswordPayload): Promise<void> {
    await this.ds.recoverPassword({ uc_mail: payload.uc_mail })
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await this.ds.resetPassword(payload)
  }

  async find(params: FindParams): Promise<PaginatedResult<AuthUser>> {
    const dto = await this.ds.find(params as Record<string, unknown>)
    return AuthMapper.toPaginatedUsers(dto)
  }

  async getGrouped(params?: Record<string, unknown>): Promise<AuthUserGroup[]> {
    const dto = await this.ds.getGrouped(params ?? {})
    return dto.map(g => AuthMapper.toAuthUserGroup(g))
  }

  async search(q: string): Promise<AuthUser[]> {
    const dto = await this.ds.search(q)
    return dto.map(u => AuthMapper.toAuthUser(u))
  }

  async getById(id: number): Promise<AuthUser> {
    const dto = await this.ds.getById(id)
    return AuthMapper.toAuthUser(dto)
  }

  async getAll(): Promise<AuthUser[]> {
    const dto = await this.ds.getAll()
    return dto.map(u => AuthMapper.toAuthUser(u))
  }
}
