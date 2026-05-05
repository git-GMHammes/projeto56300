import type { Timeline } from '../../domain/entities/Timeline'
import type { TimelineDto } from '../dto/TimelineDto'

export class TimelineMapper {
  static toEntity(dto: TimelineDto): Timeline {
    return {
      id: dto.id,
      tenant_id: dto.tenant_id,
      user_management_id: dto.user_management_id,
      content: dto.content,
      is_pinned: dto.is_pinned,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: TimelineDto[]): Timeline[] {
    return dtos.map(dto => TimelineMapper.toEntity(dto))
  }
}
