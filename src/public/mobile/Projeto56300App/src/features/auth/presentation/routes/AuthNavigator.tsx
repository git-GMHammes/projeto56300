import React, { useState } from 'react'
import type { NavigationProp, RouteProp } from '../../../../core/navigation'
import type { AuthStackParamList } from './types'
import { AUTH_PATHS } from './paths'
import LoginScreen from '../ui/screens/LoginScreen'
import RegisterScreen from '../ui/screens/RegisterScreen'
import ForgotPasswordScreen from '../ui/screens/ForgotPasswordScreen'

type AuthScreen = keyof AuthStackParamList

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
  const [current, setCurrent] = useState<AuthScreen>(AUTH_PATHS.LOGIN)

  if (current === AUTH_PATHS.REGISTER)
    return <RegisterScreen {...makeNav(setCurrent, AUTH_PATHS.REGISTER)} />

  if (current === AUTH_PATHS.FORGOT_PASSWORD)
    return <ForgotPasswordScreen {...makeNav(setCurrent, AUTH_PATHS.FORGOT_PASSWORD)} />

  return <LoginScreen {...makeNav(setCurrent, AUTH_PATHS.LOGIN)} />
}
