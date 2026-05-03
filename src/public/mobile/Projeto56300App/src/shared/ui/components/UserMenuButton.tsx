import React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import Bootstrap from '../../theme/bootstrap'
import { useTheme } from '../../../app/providers/ThemeProvider'

interface Props {
  onPress: () => void
}

export default function UserMenuButton({ onPress }: Props) {
  const { theme } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.colors.primary },
        pressed && { opacity: 0.75 },
      ]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel="Abrir menu do usuário"
      accessibilityRole="button"
    >
      <Text style={styles.icon}>👤</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: Bootstrap.fontSize.base,
    lineHeight: Bootstrap.fontSize.base + 4,
  },
})
