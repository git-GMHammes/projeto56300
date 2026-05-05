import type { FileSource, FileCategory } from '../../../shared/types'

export interface MessageFileDto {
  id: number
  source: FileSource
  source_id: number
  user_management_id: number
  original_name: string
  filename: string
  stored_path: string
  uuid: string | null
  mime: string | null
  size: number | null
  category: FileCategory | null
  checksum: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateMessageFileDtoRequest {
  source: FileSource
  source_id: number
  user_management_id: number
  original_name: string
  filename: string
  stored_path: string
  uuid?: string
  mime?: string
  size?: number
  category?: FileCategory
  checksum?: string
}
