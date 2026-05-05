import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { GROUP_MESSAGE_PATHS } from './paths'

export type GroupMessageStackParamList = {
  [GROUP_MESSAGE_PATHS.CHAT]: { groupId: number }
}

export type GroupMessageChatScreenProps = NativeStackScreenProps<GroupMessageStackParamList, typeof GROUP_MESSAGE_PATHS.CHAT>
