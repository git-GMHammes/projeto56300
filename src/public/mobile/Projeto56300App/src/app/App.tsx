import React from 'react'
import { NavigationContainer, SafeAreaProvider } from '../core/navigation'
import { ThemeProvider } from './providers/ThemeProvider'
import { RootNavigator } from './navigation/RootNavigator'

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
