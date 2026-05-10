import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
})
