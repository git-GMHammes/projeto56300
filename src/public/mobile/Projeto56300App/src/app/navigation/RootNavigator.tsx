import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from './types'
import { AuthNavigator } from '../../features/auth/presentation/routes/AuthNavigator'
import { AppNavigator } from './AppNavigator'
import { isAuthenticated, setTokenReader, getToken } from '../../core/services/StorageService'
import { setTokenReader as setHttpTokenReader } from '../../core/services/HttpClient'

const Root = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    setHttpTokenReader(getToken)

    isAuthenticated().then(ok => setAuthenticated(ok))
  }, [])

  if (authenticated === null) return null

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {authenticated ? (
        <Root.Screen name="App" component={AppNavigator} />
      ) : (
        <Root.Screen name="Auth" component={AuthNavigator} />
      )}
    </Root.Navigator>
  )
}
