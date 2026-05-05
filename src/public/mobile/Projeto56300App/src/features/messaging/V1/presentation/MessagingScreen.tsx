import React from 'react'
import MessagingNavigator from '../MessagingNavigator'
import type { OdsPageScreenProps } from '../../../ods/presentation/routes/types'

export default function MessagingScreen({ navigation }: OdsPageScreenProps) {
  return <MessagingNavigator goBack={() => navigation.goBack()} />
}
