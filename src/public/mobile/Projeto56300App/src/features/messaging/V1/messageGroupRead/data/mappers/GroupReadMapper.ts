import type { GroupRead } from '../../domain/entities/GroupRead'
import type { GroupReadDto } from '../dto/GroupReadDto'

export class GroupReadMapper {
  static toEntity(dto: GroupReadDto): GroupRead {
    return {
      id: dto.id,
      group_id: dto.group_id,
      user_management_id: dto.user_management_id,
      last_read_id: dto.last_read_id,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: GroupReadDto[]): GroupRead[] {
    return dtos.map(dto => GroupReadMapper.toEntity(dto))
  }
}
