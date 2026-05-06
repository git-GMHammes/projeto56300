import React, { useState, useMemo } from 'react'
import {
  View, Text, Modal, TouchableOpacity, ScrollView,
  StyleSheet, Platform,
} from 'react-native'
import { useTheme } from '../../../app/providers/ThemeProvider'
import type { AppColors } from '../../theme/global/types'
import Bootstrap from '../../theme/bootstrap'
import {
  APP_ENV,
  APP_VERSION,
  API_BASE_URL,
  API_TIMEOUT_MS,
  APP_CONTRACT_CODE,
} from '../../../core/config/env'

if (APP_ENV !== 'development') {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}

const CONFIG_VARS: { label: string; value: string | number }[] = [
  { label: 'APP_ENV',           value: APP_ENV },
  { label: 'APP_VERSION',       value: APP_VERSION },
  { label: 'API_BASE_URL',      value: API_BASE_URL },
  { label: 'API_TIMEOUT_MS',    value: API_TIMEOUT_MS },
  { label: 'APP_CONTRACT_CODE', value: APP_CONTRACT_CODE },
]

export default function DebugPanel() {
  const { theme } = useTheme()
  const s = useMemo(() => makeStyles(theme.colors), [theme])
  const [visible, setVisible] = useState(false)

  if (APP_ENV !== 'development') return null

  return (
    <>
      <TouchableOpacity style={s.fab} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={s.fabText}>DEV</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setVisible(false)} />

        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.headerTitle}>🛠 Debug — Config Vars</Text>
            <TouchableOpacity onPress={() => setVisible(false)} style={s.closeBtn}>
              <Text style={s.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
            {CONFIG_VARS.map(({ label, value }) => (
              <View key={label} style={s.row}>
                <Text style={s.rowLabel}>{label}</Text>
                <Text style={s.rowValue} numberOfLines={2} selectable>
                  {String(value)}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={s.footer}>
            <Text style={s.footerNote}>Visível apenas em APP_ENV = 'development'</Text>
          </View>
        </View>
      </Modal>
    </>
  )
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: Platform.OS === 'android' ? 90 : 100,
      right: 16,
      backgroundColor: '#f59e0b',
      borderRadius: Bootstrap.borderRadius.pill,
      paddingHorizontal: 12,
      paddingVertical: 6,
      elevation: 8,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      zIndex: 9999,
    },
    fabText: {
      color: '#000',
      fontSize: Bootstrap.fontSize.sm,
      fontWeight: Bootstrap.fontWeight.bold,
      letterSpacing: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      maxHeight: '75%',
      backgroundColor: c.surface,
      borderTopLeftRadius: Bootstrap.borderRadius.xl,
      borderTopRightRadius: Bootstrap.borderRadius.xl,
      elevation: 16,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Bootstrap.spacing.xl,
      paddingVertical: Bootstrap.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    headerTitle: {
      fontSize: Bootstrap.fontSize.md,
      fontWeight: Bootstrap.fontWeight.bold,
      color: c.text,
    },
    closeBtn: {
      padding: Bootstrap.spacing.sm,
    },
    closeText: {
      fontSize: Bootstrap.fontSize.md,
      color: c.textMuted,
    },
    body: {
      paddingHorizontal: Bootstrap.spacing.xl,
      paddingVertical: Bootstrap.spacing.lg,
      gap: Bootstrap.spacing.md,
    },
    row: {
      backgroundColor: c.bg,
      borderRadius: Bootstrap.borderRadius.md,
      padding: Bootstrap.spacing.lg,
      borderLeftWidth: 3,
      borderLeftColor: '#f59e0b',
    },
    rowLabel: {
      fontSize: Bootstrap.fontSize.sm,
      color: c.textMuted,
      fontWeight: Bootstrap.fontWeight.semibold,
      marginBottom: 2,
      letterSpacing: 0.5,
    },
    rowValue: {
      fontSize: Bootstrap.fontSize.base,
      color: c.text,
      fontWeight: Bootstrap.fontWeight.medium,
    },
    footer: {
      paddingHorizontal: Bootstrap.spacing.xl,
      paddingVertical: Bootstrap.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: c.divider,
      alignItems: 'center',
    },
    footerNote: {
      fontSize: Bootstrap.fontSize.xs,
      color: c.textMuted,
      fontStyle: 'italic',
    },
  })
}
