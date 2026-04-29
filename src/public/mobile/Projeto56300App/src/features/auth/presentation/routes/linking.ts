import type { PathConfig } from '@react-navigation/native'
import type { AuthStackParamList } from './types'
import { AUTH_PATHS } from './paths'

export const authLinking: PathConfig<AuthStackParamList> = {
  screens: {
    [AUTH_PATHS.LOGIN]: 'login',
    [AUTH_PATHS.REGISTER]: 'registrar',
    [AUTH_PATHS.FORGOT_PASSWORD]: 'recuperar-senha',
    [AUTH_PATHS.RESET_PASSWORD]: 'redefinir-senha/:token',
  },
}
