import React from 'react'
import { Text } from 'react-native'
import bootstrapIconMap, { FALLBACK_ICON } from './bootstrapIconMap'

interface Props {
  name: string
  size?: number
  color?: string
}

export default function BootstrapIcon({ name, size = 18, color = '#000' }: Props) {
  const codepoint = bootstrapIconMap[name] ?? FALLBACK_ICON
  return (
    <Text
      style={{
        fontFamily: 'bootstrap-icons',
        fontSize: size,
        color,
        lineHeight: size + 4,
      }}
    >
      {String.fromCodePoint(codepoint)}
    </Text>
  )
}
