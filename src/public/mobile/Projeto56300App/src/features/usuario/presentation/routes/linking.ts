import type { PathConfig } from '@react-navigation/native'
import type { UsuarioStackParamList } from './types'
import { USUARIO_PATHS } from './paths'

export const usuarioLinking: PathConfig<UsuarioStackParamList> = {
  screens: {
    [USUARIO_PATHS.LIST]: 'usuarios',
    [USUARIO_PATHS.FORM]: 'usuarios/form',
    [USUARIO_PATHS.PROFILE]: 'usuarios/:userId',
  },
}
