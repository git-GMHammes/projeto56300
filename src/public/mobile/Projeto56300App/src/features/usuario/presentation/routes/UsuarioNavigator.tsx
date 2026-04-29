import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { UsuarioStackParamList } from './types'
import { USUARIO_PATHS } from './paths'
import UserListScreen from '../ui/screens/UserListScreen'
import UserFormScreen from '../ui/screens/UserFormScreen'
import UserProfileScreen from '../ui/screens/UserProfileScreen'

const Stack = createNativeStackNavigator<UsuarioStackParamList>()

export function UsuarioNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={USUARIO_PATHS.LIST}
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#0d6efd',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={USUARIO_PATHS.LIST}
        component={UserListScreen}
        options={{ title: 'Usuários' }}
      />
      <Stack.Screen
        name={USUARIO_PATHS.FORM}
        component={UserFormScreen}
        options={({ route }) => ({ title: route.params?.userId ? 'Editar Usuário' : 'Novo Usuário' })}
      />
      <Stack.Screen
        name={USUARIO_PATHS.PROFILE}
        component={UserProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  )
}
