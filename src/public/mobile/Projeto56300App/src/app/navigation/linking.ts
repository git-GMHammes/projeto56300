import { authLinking } from '../../features/auth/presentation/routes/linking'
import { usuarioLinking } from '../../features/usuario/presentation/routes'

export const linking = {
  prefixes: ['habilidade://', 'https://habilidade.app'],
  config: {
    screens: {
      Auth: { screens: authLinking.screens },
      App: {
        screens: {
          Usuario: { screens: usuarioLinking.screens },
        },
      },
    },
  },
}
