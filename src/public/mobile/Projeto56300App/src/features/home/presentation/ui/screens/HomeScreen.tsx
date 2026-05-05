import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../shared/ui/components/TopBar'
import HamburgerMenuButton from '../../../../../shared/ui/components/HamburgerMenuButton'
import UserMenuButton from '../../../../../shared/ui/components/UserMenuButton'
import OdsMenuDrawer from '../../../../ods/presentation/ui/components/OdsMenuDrawer'
import UserMenuDrawer from '../../../../../shared/ui/components/UserMenuDrawer'
import { clearSession } from '../../../../../core/services/StorageService'
import { setTokenReader } from '../../../../../core/services/HttpClient'

interface Props {
  navigate: (screenName: string) => void
  onLogout?: () => void
}

export default function HomeScreen({ navigate, onLogout }: Props) {
  const { theme } = useTheme()
  const [odsMenuOpen, setOdsMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleUserAction(action: string) {
    if (action === 'logout') {
      await clearSession()
      setTokenReader(async () => null)
      onLogout?.()
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <TopBar
        leftContent={
          <UserMenuButton onPress={() => setUserMenuOpen(true)} />
        }
        rightContent={
          <HamburgerMenuButton onPress={() => setOdsMenuOpen(true)} />
        }
      />
      <OdsMenuDrawer
        visible={odsMenuOpen}
        onClose={() => setOdsMenuOpen(false)}
        onNavigate={navigate}
      />
      <UserMenuDrawer
        visible={userMenuOpen}
        isLoggedIn={onLogout !== undefined}
        onClose={() => setUserMenuOpen(false)}
        onNavigate={navigate}
        onAction={handleUserAction}
      />
      <View style={styles.center}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          HOME / Pública
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Olá mundo
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
  subtitle: {
    fontSize: Bootstrap.fontSize.base,
    marginTop: 8,
  },
})
