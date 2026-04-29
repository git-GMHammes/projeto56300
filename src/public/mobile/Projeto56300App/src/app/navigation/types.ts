import type { AuthStackParamList } from '../../features/auth/presentation/routes/types'
import type { UsuarioStackParamList } from '../../features/usuario/presentation/routes/types'

export type AppTabParamList = {
  Usuario: { screen?: keyof UsuarioStackParamList }
}

export type RootStackParamList = {
  Auth: { screen?: keyof AuthStackParamList }
  App: { screen?: keyof AppTabParamList }
}
