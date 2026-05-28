import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import Bootstrap from '../../../../theme/bootstrap'
import BootstrapIcon from '../../WaffleMenu/BootstrapIcon'
import type { SheetContentProps } from '../sheetRegistry'

export default function DMSheet({ onClose }: SheetContentProps) {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { paddingBottom: Platform.OS === 'android' ? Bootstrap.spacing.xl : 32 }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Mensagens Privadas</Text>
      <View style={styles.body}>
        <BootstrapIcon name="chat-dots" size={48} color={theme.colors.textMuted} />
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Em breve</Text>
        <Text style={[styles.sublabel, { color: theme.colors.textMuted }]}>
          As mensagens privadas estarão disponíveis em breve.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Bootstrap.spacing.xl,
  },
  title: {
    fontSize: Bootstrap.fontSize.lg,
    fontWeight: Bootstrap.fontWeight.bold,
    paddingVertical: Bootstrap.spacing.md,
  },
  body: {
    alignItems: 'center',
    paddingVertical: Bootstrap.spacing.xxl,
    gap: Bootstrap.spacing.md,
  },
  label: {
    fontSize: Bootstrap.fontSize.lg,
    fontWeight: Bootstrap.fontWeight.semibold,
  },
  sublabel: {
    fontSize: Bootstrap.fontSize.sm,
    textAlign: 'center',
  },
})
