import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { GROUP_READ_PATHS } from './paths'

export type GroupReadStackParamList = {
  [GROUP_READ_PATHS.STATUS]: { groupId: number }
}

export type GroupReadStatusScreenProps = NativeStackScreenProps<GroupReadStackParamList, typeof GROUP_READ_PATHS.STATUS>
