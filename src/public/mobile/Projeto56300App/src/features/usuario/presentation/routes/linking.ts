import { USUARIO_PATHS } from './paths'

export const usuarioLinking = {
  screens: {
    [USUARIO_PATHS.LIST]: 'usuarios',
    [USUARIO_PATHS.FORM]: 'usuarios/form',
    [USUARIO_PATHS.PROFILE]: 'usuarios/:userId',
  },
}
