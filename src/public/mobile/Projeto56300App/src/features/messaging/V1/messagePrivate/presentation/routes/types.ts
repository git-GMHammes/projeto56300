import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { PRIVATE_PATHS } from './paths'

export type PrivateStackParamList = {
  [PRIVATE_PATHS.INBOX]: undefined
  [PRIVATE_PATHS.CHAT]: { receiverId: number }
}

export type PrivateInboxScreenProps = NativeStackScreenProps<PrivateStackParamList, typeof PRIVATE_PATHS.INBOX>
export type PrivateChatScreenProps = NativeStackScreenProps<PrivateStackParamList, typeof PRIVATE_PATHS.CHAT>
