import React, { useMemo } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../app/providers/ThemeProvider'
import Bootstrap from '../../theme/bootstrap'
import type { AppColors } from '../../theme/global/types'

interface Props {
  onPress: () => void
  label?: string
}

export default function BackButton({ onPress, label = '← Voltar' }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme.colors), [theme])

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  )
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    btn: {
      alignSelf: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 48,
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.5,
    },
    text: {
      color: c.primary,
      fontSize: Bootstrap.fontSize.md,
      fontWeight: Bootstrap.fontWeight.semibold,
    },
  })
}
