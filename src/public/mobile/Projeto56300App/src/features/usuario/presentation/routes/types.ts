import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { USUARIO_PATHS } from './paths'

export type UsuarioStackParamList = {
  [USUARIO_PATHS.LIST]: undefined
  [USUARIO_PATHS.FORM]: { userId?: string }
  [USUARIO_PATHS.PROFILE]: { userId: string }
}

export type UserListScreenProps = NativeStackScreenProps<UsuarioStackParamList, typeof USUARIO_PATHS.LIST>
export type UserFormScreenProps = NativeStackScreenProps<UsuarioStackParamList, typeof USUARIO_PATHS.FORM>
export type UserProfileScreenProps = NativeStackScreenProps<UsuarioStackParamList, typeof USUARIO_PATHS.PROFILE>
