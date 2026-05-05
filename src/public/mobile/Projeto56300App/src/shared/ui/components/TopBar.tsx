import React from 'react'
import type { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import Bootstrap from '../../theme/bootstrap'
import { useTheme } from '../../../app/providers/ThemeProvider'

interface Props {
  leftContent?: ReactNode
  rightContent?: ReactNode
}

export default function TopBar({ leftContent, rightContent }: Props) {
  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.side}>{leftContent}</View>
      <View style={styles.spacer} />
      <View style={styles.side}>{rightContent}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Bootstrap.spacing.xl,
    paddingVertical: Bootstrap.spacing.md,
    minHeight: 48,
    borderBottomWidth: 1,
  },
  side: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
})
