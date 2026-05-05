import type { GroupMember } from '../../domain/entities/GroupMember'
import type { GroupMemberDto } from '../dto/GroupMemberDto'

export class GroupMemberMapper {
  static toEntity(dto: GroupMemberDto): GroupMember {
    return {
      id: dto.id,
      group_id: dto.group_id,
      user_management_id: dto.user_management_id,
      role: dto.role,
      joined_at: dto.joined_at,
      left_at: dto.left_at,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: GroupMemberDto[]): GroupMember[] {
    return dtos.map(dto => GroupMemberMapper.toEntity(dto))
  }
}
