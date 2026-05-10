import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import type { NavigationProp, RouteProp } from '../../../../core/navigation'
import type { AuthStackParamList } from './types'
import { AUTH_PATHS } from './paths'
import LoginScreen from '../ui/screens/LoginScreen'
import RegisterScreen from '../ui/screens/RegisterScreen'
import ForgotPasswordScreen from '../ui/screens/ForgotPasswordScreen'
import { ODS_SCREENS_MAP } from '../../../ods/presentation/ui/screens/odsScreensMap'
import { ODS_PATHS } from '../../../ods/presentation/routes/paths'
import { APP_CONTRACT_CODE } from '../../../../core/config/env'

type AuthScreen = keyof AuthStackParamList | string

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

interface AuthNavigatorProps {
  onAuthenticated?: () => void
}

export function AuthNavigator({ onAuthenticated }: AuthNavigatorProps) {
  const [current, setCurrent] = useState<AuthScreen>(
    APP_CONTRACT_CODE === 'cont0001' ? ODS_PATHS.HOME : AUTH_PATHS.LOGIN
  )

  function renderScreen() {
    if (APP_CONTRACT_CODE === 'cont0001') {
      const OdsPage = (ODS_SCREENS_MAP as Record<string, React.ComponentType<any>>)[current]
      if (OdsPage) return <OdsPage {...makeNav(setCurrent, current as keyof AuthStackParamList)} />
    }

    if (current === AUTH_PATHS.REGISTER)
      return <RegisterScreen {...makeNav(setCurrent, AUTH_PATHS.REGISTER)} />

    if (current === AUTH_PATHS.FORGOT_PASSWORD)
      return <ForgotPasswordScreen {...makeNav(setCurrent, AUTH_PATHS.FORGOT_PASSWORD)} />

    return <LoginScreen {...makeNav(setCurrent, AUTH_PATHS.LOGIN)} onAuthenticated={onAuthenticated} />
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
})
