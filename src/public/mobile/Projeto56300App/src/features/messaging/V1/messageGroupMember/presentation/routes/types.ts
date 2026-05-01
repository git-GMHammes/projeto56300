import type { NativeStackScreenProps } from '../../../../../../core/navigation'
import { GROUP_MEMBER_PATHS } from './paths'

export type GroupMemberStackParamList = {
  [GROUP_MEMBER_PATHS.LIST]: { groupId: number }
}

export type GroupMemberListScreenProps = NativeStackScreenProps<GroupMemberStackParamList, typeof GROUP_MEMBER_PATHS.LIST>
