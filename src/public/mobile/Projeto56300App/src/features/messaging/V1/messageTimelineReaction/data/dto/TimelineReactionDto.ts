import type { ReactionType } from '../../../shared/types'

export interface TimelineReactionDto {
  id: number
  timeline_id: number
  user_management_id: number
  reaction: ReactionType
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateTimelineReactionDtoRequest {
  timeline_id: number
  user_management_id: number
  reaction: ReactionType
}

export interface UpdateTimelineReactionDtoRequest {
  reaction: ReactionType
}
