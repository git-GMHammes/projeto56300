import React from 'react'
import { NavigationContainer, SafeAreaProvider } from '../core/navigation'
import { ThemeProvider } from './providers/ThemeProvider'
import { RootNavigator } from './navigation/RootNavigator'
import DebugPanel from '../shared/ui/components/DebugPanel'
import { RouteProvider } from '../core/navigation/RouteContext'

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RouteProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <DebugPanel />
        </RouteProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
