import React, { useEffect, useState } from 'react'
import { AuthNavigator } from '../../features/auth/presentation/routes/AuthNavigator'
import { AppNavigator } from './AppNavigator'
import { isAuthenticated, getToken } from '../../core/services/StorageService'
import { setTokenReader as setHttpTokenReader } from '../../core/services/HttpClient'

export function RootNavigator() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    setHttpTokenReader(getToken)
    isAuthenticated().then(ok => setAuthenticated(ok))
  }, [])

  if (authenticated === null) return null

  return authenticated ? <AppNavigator /> : <AuthNavigator />
}
