import React from 'react'
import OdsLayout from '../components/OdsLayout'
import OdsPageContent from '../components/OdsPageContent'
import type { OdsPageScreenProps } from '../../routes/types'

export default function POds014({ navigation }: OdsPageScreenProps) {
  return (
    <OdsLayout navigation={navigation}>
      <OdsPageContent screenKey="pods014" navigation={navigation} />
    </OdsLayout>
  )
}
