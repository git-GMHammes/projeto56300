import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { GROUP_PATHS } from './paths'

export type GroupStackParamList = {
  [GROUP_PATHS.LIST]: undefined
  [GROUP_PATHS.DETAIL]: { id: number }
  [GROUP_PATHS.CREATE]: undefined
}

export type GroupListScreenProps = NativeStackScreenProps<GroupStackParamList, typeof GROUP_PATHS.LIST>
export type GroupDetailScreenProps = NativeStackScreenProps<GroupStackParamList, typeof GROUP_PATHS.DETAIL>
export type GroupCreateScreenProps = NativeStackScreenProps<GroupStackParamList, typeof GROUP_PATHS.CREATE>
