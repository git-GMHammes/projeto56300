import { MESSAGING_PATHS } from './paths'
import type { NativeStackScreenProps } from '../../../core/navigation'

export type MessagingStackParamList = {
  [MESSAGING_PATHS.TIMELINE]: undefined
  [MESSAGING_PATHS.TIMELINE_REACTION]: { timelineId: number }
  [MESSAGING_PATHS.PRIVATE]: undefined
  [MESSAGING_PATHS.GROUP]: undefined
  [MESSAGING_PATHS.GROUP_MEMBER]: { groupId: number }
  [MESSAGING_PATHS.GROUP_MESSAGE]: { groupId: number }
  [MESSAGING_PATHS.GROUP_READ]: { groupId: number }
  [MESSAGING_PATHS.FILE]: { source: string; sourceId: number }
}

export type TimelineScreenProps = NativeStackScreenProps<MessagingStackParamList, typeof MESSAGING_PATHS.TIMELINE>
export type PrivateScreenProps = NativeStackScreenProps<MessagingStackParamList, typeof MESSAGING_PATHS.PRIVATE>
export type GroupScreenProps = NativeStackScreenProps<MessagingStackParamList, typeof MESSAGING_PATHS.GROUP>
export type GroupMessageScreenProps = NativeStackScreenProps<MessagingStackParamList, typeof MESSAGING_PATHS.GROUP_MESSAGE>
