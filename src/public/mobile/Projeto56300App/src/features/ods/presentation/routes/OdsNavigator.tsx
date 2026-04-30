import React from 'react'
import { createNativeStackNavigator } from '../../../../core/navigation'
import type { OdsStackParamList } from './types'
import { ODS_PATHS } from './paths'
import POds001 from '../ui/screens/pods001'
import POds002 from '../ui/screens/pods002'
import POds003 from '../ui/screens/pods003'
import POds004 from '../ui/screens/pods004'
import POds005 from '../ui/screens/pods005'
import POds006 from '../ui/screens/pods006'
import POds007 from '../ui/screens/pods007'
import POds008 from '../ui/screens/pods008'
import POds009 from '../ui/screens/pods009'
import POds010 from '../ui/screens/pods010'
import POds011 from '../ui/screens/pods011'
import POds012 from '../ui/screens/pods012'
import POds013 from '../ui/screens/pods013'
import POds014 from '../ui/screens/pods014'
import POds015 from '../ui/screens/pods015'
import POds016 from '../ui/screens/pods016'
import POds017 from '../ui/screens/pods017'
import POds018 from '../ui/screens/pods018'

const Stack = createNativeStackNavigator<OdsStackParamList>()

export function OdsNavigator() {
  return (
    <Stack.Navigator initialRouteName={ODS_PATHS.P01}>
      <Stack.Screen name={ODS_PATHS.P01} component={POds001} />
      <Stack.Screen name={ODS_PATHS.P02} component={POds002} />
      <Stack.Screen name={ODS_PATHS.P03} component={POds003} />
      <Stack.Screen name={ODS_PATHS.P04} component={POds004} />
      <Stack.Screen name={ODS_PATHS.P05} component={POds005} />
      <Stack.Screen name={ODS_PATHS.P06} component={POds006} />
      <Stack.Screen name={ODS_PATHS.P07} component={POds007} />
      <Stack.Screen name={ODS_PATHS.P08} component={POds008} />
      <Stack.Screen name={ODS_PATHS.P09} component={POds009} />
      <Stack.Screen name={ODS_PATHS.P10} component={POds010} />
      <Stack.Screen name={ODS_PATHS.P11} component={POds011} />
      <Stack.Screen name={ODS_PATHS.P12} component={POds012} />
      <Stack.Screen name={ODS_PATHS.P13} component={POds013} />
      <Stack.Screen name={ODS_PATHS.P14} component={POds014} />
      <Stack.Screen name={ODS_PATHS.P15} component={POds015} />
      <Stack.Screen name={ODS_PATHS.P16} component={POds016} />
      <Stack.Screen name={ODS_PATHS.P17} component={POds017} />
      <Stack.Screen name={ODS_PATHS.P18} component={POds018} />
    </Stack.Navigator>
  )
}
