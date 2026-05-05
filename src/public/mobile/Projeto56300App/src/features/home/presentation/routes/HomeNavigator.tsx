import React from 'react'
import { createNativeStackNavigator } from '../../../../core/navigation'
import type { NativeStackScreenProps } from '../../../../core/navigation'
import type { HomeStackParamList } from './types'
import { HOME_PATHS } from './paths'
import HomeScreen from '../ui/screens/HomeScreen'

const Stack = createNativeStackNavigator<HomeStackParamList>()

interface HomeNavigatorProps {
  onLogout: () => void
}

function makeHomeScreenWrapper(onLogout: () => void) {
  return function HomeScreenWrapper({ navigation }: NativeStackScreenProps<HomeStackParamList>) {
    return (
      <HomeScreen
        navigate={navigation.navigate as (screenName: string) => void}
        onLogout={onLogout}
      />
    )
  }
}

export function HomeNavigator({ onLogout }: HomeNavigatorProps) {
  const HomeScreenWrapper = React.useMemo(() => makeHomeScreenWrapper(onLogout), [onLogout])

  return (
    <Stack.Navigator initialRouteName={HOME_PATHS.HOME}>
      <Stack.Screen name={HOME_PATHS.HOME} component={HomeScreenWrapper} />
    </Stack.Navigator>
  )
}
