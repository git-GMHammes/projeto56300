import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import type { NavigationProp, RouteProp } from '../../../../core/navigation'
import type { AuthStackParamList } from './types'
import { AUTH_PATHS } from './paths'
import LoginScreen from '../ui/screens/LoginScreen'
import RegisterScreen from '../ui/screens/RegisterScreen'
import ForgotPasswordScreen from '../ui/screens/ForgotPasswordScreen'
import { ODS_SCREENS_MAP } from '../../../ods/presentation/ui/screens/odsScreensMap'
import HomeScreen from '../../../home/presentation/ui/screens/HomeScreen'
import MessagingNavigator from '../../../messaging/V1/MessagingNavigator'
import MessageFooterBar from '../../../../shared/ui/components/MessageFooterBar'
import MessageDrawer, { type MessageDrawerType } from '../../../../shared/ui/components/MessageDrawer'

const PUBLIC_HOME = 'Home'
const PUBLIC_MESSAGING = 'Messaging'
type AuthScreen = keyof AuthStackParamList | typeof PUBLIC_HOME | typeof PUBLIC_MESSAGING

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
  const [current, setCurrent] = useState<AuthScreen>(PUBLIC_HOME)
  const [activeDrawer, setActiveDrawer] = useState<MessageDrawerType | null>(null)

  const isLogin = current === AUTH_PATHS.LOGIN

  function renderScreen() {
    if (current === PUBLIC_HOME)
      return <HomeScreen navigate={(name) => setCurrent(name as AuthScreen)} />

    if (current === PUBLIC_MESSAGING)
      return <MessagingNavigator goBack={() => setCurrent(PUBLIC_HOME)} />

    const OdsPage = (ODS_SCREENS_MAP as Record<string, React.ComponentType<any>>)[current]
    if (OdsPage) return <OdsPage {...makeNav(setCurrent, current as keyof AuthStackParamList)} />

    if (current === AUTH_PATHS.REGISTER)
      return <RegisterScreen {...makeNav(setCurrent, AUTH_PATHS.REGISTER)} />

    if (current === AUTH_PATHS.FORGOT_PASSWORD)
      return <ForgotPasswordScreen {...makeNav(setCurrent, AUTH_PATHS.FORGOT_PASSWORD)} />

    return <LoginScreen {...makeNav(setCurrent, AUTH_PATHS.LOGIN)} onAuthenticated={onAuthenticated} />
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      {!isLogin && (
        <MessageFooterBar
          activeKey={activeDrawer}
          onPress={(key) => setActiveDrawer(key as MessageDrawerType)}
        />
      )}
      <MessageDrawer
        visible={activeDrawer !== null}
        type={activeDrawer}
        onClose={() => setActiveDrawer(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
})
