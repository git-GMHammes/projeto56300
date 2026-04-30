import React, { useState } from 'react'
import type { NavigationProp, RouteProp } from '../../../../core/navigation'
import type { AuthStackParamList } from './types'
import { AUTH_PATHS } from './paths'
import LoginScreen from '../ui/screens/LoginScreen'
import RegisterScreen from '../ui/screens/RegisterScreen'
import ForgotPasswordScreen from '../ui/screens/ForgotPasswordScreen'
import { ODS_SCREENS_MAP } from '../../../ods/presentation/ui/screens/odsScreensMap'
import HomeScreen from '../../../home/presentation/ui/screens/HomeScreen'

const PUBLIC_HOME = 'Home'
type AuthScreen = keyof AuthStackParamList | typeof PUBLIC_HOME

function makeNav(
  setCurrent: (s: AuthScreen) => void,
  screenName: AuthScreen,
): { navigation: NavigationProp<AuthStackParamList>; route: RouteProp<AuthStackParamList, any> } {
  return {
    navigation: {
      navigate: (name: any) => setCurrent(name as AuthScreen),
      goBack: () => setCurrent(AUTH_PATHS.LOGIN),
    },
    route: { name: screenName as string, params: undefined as any },
  }
}

export function AuthNavigator() {
  const [current, setCurrent] = useState<AuthScreen>(PUBLIC_HOME)

  if (current === PUBLIC_HOME)
    return <HomeScreen navigate={(name) => setCurrent(name as AuthScreen)} />

  // Páginas ODS públicas
  const OdsPage = (ODS_SCREENS_MAP as Record<string, React.ComponentType<any>>)[current]
  if (OdsPage) return <OdsPage {...makeNav(setCurrent, current as keyof AuthStackParamList)} />

  if (current === AUTH_PATHS.REGISTER)
    return <RegisterScreen {...makeNav(setCurrent, AUTH_PATHS.REGISTER)} />

  if (current === AUTH_PATHS.FORGOT_PASSWORD)
    return <ForgotPasswordScreen {...makeNav(setCurrent, AUTH_PATHS.FORGOT_PASSWORD)} />

  return <LoginScreen {...makeNav(setCurrent, AUTH_PATHS.LOGIN)} />
}
