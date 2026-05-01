import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../shared/ui/components/TopBar'
import HamburgerMenuButton from '../../../../../shared/ui/components/HamburgerMenuButton'
import OdsMenuDrawer from '../../../../ods/presentation/ui/components/OdsMenuDrawer'

interface Props {
  navigate: (screenName: string) => void
}

export default function HomeScreen({ navigate }: Props) {
  const { theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <TopBar
        rightContent={
          <HamburgerMenuButton onPress={() => setMenuOpen(true)} />
        }
      />
      <OdsMenuDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
      />
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
