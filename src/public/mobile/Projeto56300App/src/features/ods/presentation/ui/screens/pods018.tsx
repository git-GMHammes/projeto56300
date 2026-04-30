import React from 'react'
import OdsLayout from '../components/OdsLayout'
import OdsPageContent from '../components/OdsPageContent'
import type { OdsPageScreenProps } from '../../routes/types'

export default function POds018({ navigation }: OdsPageScreenProps) {
  return (
    <OdsLayout navigation={navigation}>
      <OdsPageContent screenKey="pods018" navigation={navigation} />
    </OdsLayout>
  )
}
