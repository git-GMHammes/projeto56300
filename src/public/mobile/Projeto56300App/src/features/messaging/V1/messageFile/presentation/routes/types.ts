import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { MESSAGE_FILE_PATHS } from './paths'

export type MessageFileStackParamList = {
  [MESSAGE_FILE_PATHS.LIST]: { source: string; sourceId: number }
}

export type MessageFileListScreenProps = NativeStackScreenProps<MessageFileStackParamList, typeof MESSAGE_FILE_PATHS.LIST>
