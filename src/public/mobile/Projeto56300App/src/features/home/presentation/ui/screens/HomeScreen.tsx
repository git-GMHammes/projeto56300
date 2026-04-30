import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import OdsMenuDrawer from '../../../../ods/presentation/ui/components/OdsMenuDrawer'

interface Props {
  navigate: (screenName: string) => void
}

export default function HomeScreen({ navigate }: Props) {
  const { theme } = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.spacer} />
        <OdsMenuDrawer onNavigate={navigate} />
      </View>
      <View style={styles.center}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          HOME / Pública
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Bootstrap.spacing.xl,
    paddingVertical: Bootstrap.spacing.md,
    minHeight: 48,
    borderBottomWidth: 1,
  },
  spacer: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Bootstrap.fontSize.xl,
    fontWeight: Bootstrap.fontWeight.bold,
  },
})
