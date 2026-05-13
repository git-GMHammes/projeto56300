import type { Timeline } from '../../domain/entities/Timeline'
import type { TimelineDto, TimelineViewDto } from '../dto/TimelineDto'

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
      author_name: '',
      author_uuid: '',
      author_role: '',
    }
  }

  static toEntityList(dtos: TimelineDto[]): Timeline[] {
    return dtos.map(dto => TimelineMapper.toEntity(dto))
  }

  static fromViewDto(dto: TimelineViewDto): Timeline {
    return {
      id: dto.id,
      tenant_id: dto.mt_user_saas_tenants_id,
      user_management_id: dto.mt_user_management_id,
      content: dto.mt_content,
      is_pinned: dto.mt_is_pinned,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
      author_name: dto.um_user,
      author_uuid: dto.um_uuid,
      author_role: dto.ut_role,
    }
  }

  static fromViewDtoList(dtos: TimelineViewDto[]): Timeline[] {
    return dtos.map(dto => TimelineMapper.fromViewDto(dto))
  }
}
