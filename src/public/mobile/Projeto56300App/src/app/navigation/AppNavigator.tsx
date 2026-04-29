import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AppTabParamList } from './types'
import { UsuarioNavigator } from '../../features/usuario/presentation/routes'

const Stack = createNativeStackNavigator<AppTabParamList>()

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Usuario" component={UsuarioNavigator} />
    </Stack.Navigator>
  )
}
