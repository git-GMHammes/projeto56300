import type { GroupMessage } from '../../domain/entities/GroupMessage'
import type { GroupMessageDto } from '../dto/GroupMessageDto'

export class GroupMessageMapper {
  static toEntity(dto: GroupMessageDto): GroupMessage {
    return {
      id: dto.id,
      group_id: dto.group_id,
      user_management_id: dto.user_management_id,
      reply_to_id: dto.reply_to_id,
      content: dto.content,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: GroupMessageDto[]): GroupMessage[] {
    return dtos.map(dto => GroupMessageMapper.toEntity(dto))
  }
}
