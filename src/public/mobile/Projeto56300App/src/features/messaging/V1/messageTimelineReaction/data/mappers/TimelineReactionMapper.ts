import type { TimelineReaction } from '../../domain/entities/TimelineReaction'
import type { TimelineReactionDto } from '../dto/TimelineReactionDto'

export class TimelineReactionMapper {
  static toEntity(dto: TimelineReactionDto): TimelineReaction {
    return {
      id: dto.id,
      timeline_id: dto.timeline_id,
      user_management_id: dto.user_management_id,
      reaction: dto.reaction,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: TimelineReactionDto[]): TimelineReaction[] {
    return dtos.map(dto => TimelineReactionMapper.toEntity(dto))
  }
}
