import type { LoginResponseDto, SessionUserDto } from '../dto/LoginDto'
import type { AuthUserDto, AuthUserGroupDto, PaginatedAuthUserDto } from '../dto/AuthUserDto'
import type { AuthSession, AuthSessionUser } from '../../domain/entities/AuthSession'
import type { AuthUser, AuthUserGroup } from '../../domain/entities/AuthUser'
import type { PaginatedResult } from '../../domain/repositories/IAuthRepository'

export class AuthMapper {
  static toSessionUser(dto: SessionUserDto): AuthSessionUser {
    return {
      id: dto.id,
      um_uuid: dto.um_uuid,
      um_user: dto.um_user,
      um_is_active: dto.um_is_active,
      uc_id: dto.uc_id,
      uc_name: dto.uc_name,
      uc_mail: dto.uc_mail,
      uc_cpf: dto.uc_cpf,
      uc_whatsapp: dto.uc_whatsapp,
      uc_profile: dto.uc_profile,
      ut_id: dto.ut_id,
      ut_user_saas_tenants_id: dto.ut_user_saas_tenants_id,
      ut_role: dto.ut_role,
    }
  }

  static toSession(dto: LoginResponseDto): AuthSession {
    return {
      token: dto.token,
      tokenType: dto.token_type,
      expiresIn: dto.expires_in,
      user: this.toSessionUser(dto.user),
    }
  }

  static toAuthUser(dto: AuthUserDto): AuthUser {
    return { ...dto }
  }

  static toAuthUserGroup(dto: AuthUserGroupDto): AuthUserGroup {
    return {
      letter: dto.letter,
      items: dto.items.map(this.toAuthUser),
    }
  }

  static toPaginatedUsers(dto: PaginatedAuthUserDto): PaginatedResult<AuthUser> {
    return {
      data: dto.data.map(this.toAuthUser),
      meta: dto.meta,
    }
  }
}
