export const USUARIO_PATHS = {
  LIST: 'UsuarioList',
  FORM: 'UsuarioForm',
  PROFILE: 'UsuarioProfile',
} as const

export type UsuarioPathKey = keyof typeof USUARIO_PATHS
export type UsuarioPath = (typeof USUARIO_PATHS)[UsuarioPathKey]
