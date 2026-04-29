import type { UserDto, PaginatedUserDto } from '../dto/UserDto'
import type { User } from '../../domain/entities/User'
import type { PaginatedUsers } from '../../domain/repositories/IUserRepository'

export class UserMapper {
  static toUser(dto: UserDto): User {
    return {
      id: String(dto.id),
      uuid: dto.um_uuid,
      username: dto.um_user,
      isActive: Number(dto.um_is_active) === 1,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    }
  }

  static toPaginatedUsers(dto: PaginatedUserDto): PaginatedUsers {
    return {
      data: dto.data.map(this.toUser),
      meta: dto.meta,
    }
  }
}
