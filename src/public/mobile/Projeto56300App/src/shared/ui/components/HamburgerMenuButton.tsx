import React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import Bootstrap from '../../theme/bootstrap'
import { useTheme } from '../../../app/providers/ThemeProvider'
import { APP_CONTRACT_CODE } from '../../../core/config/env'

interface Props {
  onPress: () => void
}

export default function HamburgerMenuButton({ onPress }: Props) {
  const { theme } = useTheme()

  if (APP_CONTRACT_CODE !== 'cont0001') return null

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && { backgroundColor: theme.colors.divider },
      ]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel="Abrir menu"
      accessibilityRole="button"
    >
      <Text style={[styles.icon, { color: theme.colors.text }]}>☰</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: Bootstrap.spacing.md,
    borderRadius: Bootstrap.borderRadius.md,
  },
  icon: {
    fontSize: Bootstrap.fontSize.xl,
    lineHeight: Bootstrap.fontSize.xl + 4,
  },
})
