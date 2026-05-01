import type { MessageFile } from '../../domain/entities/MessageFile'
import type { MessageFileDto } from '../dto/MessageFileDto'

export class MessageFileMapper {
  static toEntity(dto: MessageFileDto): MessageFile {
    return {
      id: dto.id,
      source: dto.source,
      source_id: dto.source_id,
      user_management_id: dto.user_management_id,
      original_name: dto.original_name,
      filename: dto.filename,
      stored_path: dto.stored_path,
      uuid: dto.uuid,
      mime: dto.mime,
      size: dto.size,
      category: dto.category,
      checksum: dto.checksum,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    }
  }

  static toEntityList(dtos: MessageFileDto[]): MessageFile[] {
    return dtos.map(dto => MessageFileMapper.toEntity(dto))
  }
}
