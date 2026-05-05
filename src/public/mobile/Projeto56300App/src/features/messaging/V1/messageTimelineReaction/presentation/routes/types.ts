import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { TIMELINE_REACTION_PATHS } from './paths'

export type TimelineReactionStackParamList = {
  [TIMELINE_REACTION_PATHS.LIST]: { timelineId: number }
}

export type TimelineReactionListScreenProps = NativeStackScreenProps<TimelineReactionStackParamList, typeof TIMELINE_REACTION_PATHS.LIST>
