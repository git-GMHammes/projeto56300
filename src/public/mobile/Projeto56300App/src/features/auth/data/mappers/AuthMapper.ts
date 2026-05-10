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
      um_last_login: dto.um_last_login,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
      uc_id: dto.uc_id,
      uc_user_id: dto.uc_user_id,
      uc_name: dto.uc_name,
      uc_cpf: dto.uc_cpf,
      uc_whatsapp: dto.uc_whatsapp,
      uc_profile: dto.uc_profile,
      uc_mail: dto.uc_mail,
      uc_phone: dto.uc_phone,
      uc_date_birth: dto.uc_date_birth,
      uc_zip_code: dto.uc_zip_code,
      uc_address: dto.uc_address,
      uc_tenant_at: dto.uc_tenant_at,
      uc_validity: dto.uc_validity,
      uc_created_at: dto.uc_created_at,
      uc_updated_at: dto.uc_updated_at,
      uc_deleted_at: dto.uc_deleted_at,
      uc_user_id_active: dto.uc_user_id_active,
      ut_id: dto.ut_id,
      ut_user_id: dto.ut_user_id,
      ut_user_saas_tenants_id: dto.ut_user_saas_tenants_id,
      ut_role: dto.ut_role,
      ut_created_at: dto.ut_created_at,
      ut_deleted_at: dto.ut_deleted_at,
    }
  }

  static toSession(dto: LoginResponseDto): AuthSession {
    return {
      token: dto.token,
      tokenType: dto.token_type,
      expiresIn: dto.expires_in,
      refreshToken: dto.refresh_token,
      refreshExpiresIn: dto.refresh_expires_in,
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
