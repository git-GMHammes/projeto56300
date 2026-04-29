export const AUTH_PATHS = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
} as const

export type AuthPathKey = keyof typeof AUTH_PATHS
export type AuthPath = (typeof AUTH_PATHS)[AuthPathKey]
