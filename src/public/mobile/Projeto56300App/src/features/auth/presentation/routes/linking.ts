import { AUTH_PATHS } from './paths'

export const authLinking = {
  screens: {
    [AUTH_PATHS.LOGIN]: 'login',
    [AUTH_PATHS.REGISTER]: 'registrar',
    [AUTH_PATHS.FORGOT_PASSWORD]: 'recuperar-senha',
    [AUTH_PATHS.RESET_PASSWORD]: 'redefinir-senha/:token',
  },
}
