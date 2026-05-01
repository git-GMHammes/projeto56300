import type { ReactionType } from '../../../shared/types'

export interface TimelineReaction {
  id: number
  timeline_id: number
  user_management_id: number
  reaction: ReactionType
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateTimelineReactionPayload {
  timeline_id: number
  user_management_id: number
  reaction: ReactionType
}

export interface UpdateTimelineReactionPayload {
  reaction: ReactionType
}
