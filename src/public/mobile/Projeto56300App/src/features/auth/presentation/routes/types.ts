import type { NativeStackScreenProps } from '../../../../core/navigation'
import type { AUTH_PATHS } from './paths'

export type AuthStackParamList = {
  [AUTH_PATHS.LOGIN]: undefined
  [AUTH_PATHS.REGISTER]: undefined
  [AUTH_PATHS.FORGOT_PASSWORD]: undefined
  [AUTH_PATHS.RESET_PASSWORD]: { token: string }
  // Páginas ODS — públicas, acessíveis antes do login (APP_CONTRACT_CODE === 'cont0001')
  OdsHome: undefined
  OdsP01: undefined
  OdsP02: undefined
  OdsP03: undefined
  OdsP04: undefined
  OdsP05: undefined
  OdsP06: undefined
  OdsP07: undefined
  OdsP08: undefined
  OdsP09: undefined
  OdsP10: undefined
  OdsP11: undefined
  OdsP12: undefined
  OdsP13: undefined
  OdsP14: undefined
  OdsP15: undefined
  OdsP16: undefined
  OdsP17: undefined
  OdsP18: undefined
}

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.LOGIN>
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.REGISTER>
export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.FORGOT_PASSWORD>
export type ResetPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.RESET_PASSWORD>
