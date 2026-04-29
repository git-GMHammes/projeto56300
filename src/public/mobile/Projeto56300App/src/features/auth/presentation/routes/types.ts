import type { NativeStackScreenProps } from '../../../../core/navigation'
import type { AUTH_PATHS } from './paths'

export type AuthStackParamList = {
  [AUTH_PATHS.LOGIN]: undefined
  [AUTH_PATHS.REGISTER]: undefined
  [AUTH_PATHS.FORGOT_PASSWORD]: undefined
  [AUTH_PATHS.RESET_PASSWORD]: { token: string }
}

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.LOGIN>
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.REGISTER>
export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.FORGOT_PASSWORD>
export type ResetPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, typeof AUTH_PATHS.RESET_PASSWORD>
