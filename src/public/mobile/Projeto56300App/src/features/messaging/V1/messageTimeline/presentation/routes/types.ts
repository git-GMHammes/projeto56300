import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { TIMELINE_PATHS } from './paths'

export type TimelineStackParamList = {
  [TIMELINE_PATHS.LIST]: undefined
  [TIMELINE_PATHS.DETAIL]: { id: number }
}

export type TimelineListScreenProps = NativeStackScreenProps<TimelineStackParamList, typeof TIMELINE_PATHS.LIST>
export type TimelineDetailScreenProps = NativeStackScreenProps<TimelineStackParamList, typeof TIMELINE_PATHS.DETAIL>
