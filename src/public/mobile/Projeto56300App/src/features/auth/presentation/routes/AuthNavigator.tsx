import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AuthStackParamList } from './types'
import { AUTH_PATHS } from './paths'
import LoginScreen from '../ui/screens/LoginScreen'
import RegisterScreen from '../ui/screens/RegisterScreen'
import ForgotPasswordScreen from '../ui/screens/ForgotPasswordScreen'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={AUTH_PATHS.LOGIN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={AUTH_PATHS.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AUTH_PATHS.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={AUTH_PATHS.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}
