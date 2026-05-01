import type { PrivateMessage } from '../../domain/entities/PrivateMessage'
import type { PrivateMessageDto } from '../dto/PrivateMessageDto'

export class PrivateMessageMapper {
  static toEntity(dto: PrivateMessageDto): PrivateMessage {
    return {
      id: dto.id,
      tenant_id: dto.tenant_id,
      sender_id: dto.sender_id,
      receiver_id: dto.receiver_id,
      content: dto.content,
      read_at: dto.read_at,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: PrivateMessageDto[]): PrivateMessage[] {
    return dtos.map(dto => PrivateMessageMapper.toEntity(dto))
  }
}
