import React from 'react'
import { NavigationContainer, SafeAreaProvider } from '../core/navigation'
import { ThemeProvider } from './providers/ThemeProvider'
import { RootNavigator } from './navigation/RootNavigator'
import DebugPanel from '../shared/ui/components/DebugPanel'

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <DebugPanel />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
