import type { Group } from '../../domain/entities/Group'
import type { GroupDto } from '../dto/GroupDto'

export class GroupMapper {
  static toEntity(dto: GroupDto): Group {
    return {
      id: dto.id,
      tenant_id: dto.tenant_id,
      name: dto.name,
      description: dto.description,
      avatar: dto.avatar,
      created_by: dto.created_by,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: GroupDto[]): Group[] {
    return dtos.map(dto => GroupMapper.toEntity(dto))
  }
}
