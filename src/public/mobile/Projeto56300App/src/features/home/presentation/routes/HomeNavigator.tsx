import React, { useRef, useImperativeHandle } from 'react'
import { createNativeStackNavigator } from '../../../../core/navigation'
import type { NativeStackScreenProps } from '../../../../core/navigation'
import type { HomeStackParamList } from './types'
import { HOME_PATHS } from './paths'
import { ODS_PATHS } from '../../../ods/presentation/routes/paths'
import HomeScreen from '../ui/screens/HomeScreen'
import POds001 from '../../../ods/presentation/ui/screens/pods001'
import POds002 from '../../../ods/presentation/ui/screens/pods002'
import POds003 from '../../../ods/presentation/ui/screens/pods003'
import POds004 from '../../../ods/presentation/ui/screens/pods004'
import POds005 from '../../../ods/presentation/ui/screens/pods005'
import POds006 from '../../../ods/presentation/ui/screens/pods006'
import POds007 from '../../../ods/presentation/ui/screens/pods007'
import POds008 from '../../../ods/presentation/ui/screens/pods008'
import POds009 from '../../../ods/presentation/ui/screens/pods009'
import POds010 from '../../../ods/presentation/ui/screens/pods010'
import POds011 from '../../../ods/presentation/ui/screens/pods011'
import POds012 from '../../../ods/presentation/ui/screens/pods012'
import POds013 from '../../../ods/presentation/ui/screens/pods013'
import POds014 from '../../../ods/presentation/ui/screens/pods014'
import POds015 from '../../../ods/presentation/ui/screens/pods015'
import POds016 from '../../../ods/presentation/ui/screens/pods016'
import POds017 from '../../../ods/presentation/ui/screens/pods017'
import POds018 from '../../../ods/presentation/ui/screens/pods018'
import MessagingScreen from '../../../messaging/V1/presentation/MessagingScreen'
import HelperScreen from '../../../helper/presentation/ui/screens/HelperScreen'

const Stack = createNativeStackNavigator<HomeStackParamList>()

export interface HomeNavigatorHandle {
  navigateToHome: () => void
  navigateToHelper: () => void
}

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

export const HomeNavigator = React.forwardRef<HomeNavigatorHandle, HomeNavigatorProps>(
  function HomeNavigator({ onLogout }, ref) {
  const navRef = useRef<{ navigate: (name: string, params?: any) => void; goBack: () => void } | null>(null)
  const HomeScreenWrapper = React.useMemo(() => makeHomeScreenWrapper(onLogout), [onLogout])

  useImperativeHandle(ref, () => ({
    navigateToHome: () => navRef.current?.navigate(HOME_PATHS.HOME),
    navigateToHelper: () => navRef.current?.navigate(HOME_PATHS.HELPER),
  }), [])

  return (
    <Stack.Navigator initialRouteName={HOME_PATHS.HOME} navigationRef={navRef}>
      <Stack.Screen name={HOME_PATHS.HOME} component={HomeScreenWrapper} />
      <Stack.Screen name={ODS_PATHS.P01}       component={POds001} />
      <Stack.Screen name={ODS_PATHS.P02}       component={POds002} />
      <Stack.Screen name={ODS_PATHS.P03}       component={POds003} />
      <Stack.Screen name={ODS_PATHS.P04}       component={POds004} />
      <Stack.Screen name={ODS_PATHS.P05}       component={POds005} />
      <Stack.Screen name={ODS_PATHS.P06}       component={POds006} />
      <Stack.Screen name={ODS_PATHS.P07}       component={POds007} />
      <Stack.Screen name={ODS_PATHS.P08}       component={POds008} />
      <Stack.Screen name={ODS_PATHS.P09}       component={POds009} />
      <Stack.Screen name={ODS_PATHS.P10}       component={POds010} />
      <Stack.Screen name={ODS_PATHS.P11}       component={POds011} />
      <Stack.Screen name={ODS_PATHS.P12}       component={POds012} />
      <Stack.Screen name={ODS_PATHS.P13}       component={POds013} />
      <Stack.Screen name={ODS_PATHS.P14}       component={POds014} />
      <Stack.Screen name={ODS_PATHS.P15}       component={POds015} />
      <Stack.Screen name={ODS_PATHS.P16}       component={POds016} />
      <Stack.Screen name={ODS_PATHS.P17}       component={POds017} />
      <Stack.Screen name={ODS_PATHS.P18}       component={POds018} />
      <Stack.Screen name={ODS_PATHS.MESSAGING} component={MessagingScreen} />
      <Stack.Screen
        name={HOME_PATHS.HELPER}
        component={({ navigation }: NativeStackScreenProps<HomeStackParamList>) =>
          <HelperScreen goBack={() => navigation.goBack()} />
        }
      />
    </Stack.Navigator>
  )
})
