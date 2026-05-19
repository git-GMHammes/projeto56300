import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import TopBar from '../../../../../shared/ui/components/TopBar'
import HamburgerMenuButton from '../../../../../shared/ui/components/HamburgerMenuButton'
import UserMenuButton from '../../../../../shared/ui/components/UserMenuButton'
import OdsMenuDrawer from '../../../../ods/presentation/ui/components/OdsMenuDrawer'
import UserMenuDrawer from '../../../../../shared/ui/components/UserMenuDrawer'
import WaffleMenu from '../../../../../shared/ui/components/WaffleMenu'
import type { WaffleMenuItem } from '../../../../../shared/ui/components/WaffleMenu'
import { clearSession, getUser } from '../../../../../core/services/StorageService'
import { setTokenReader } from '../../../../../core/services/HttpClient'
import { matchesRole } from '../../../../../shared/utils/menuFilter'
import waffleItems from '../../../../../data/waffle/waffle_home_menu.json'

type SessionUser = { ut_role?: string }

interface Props {
  navigate: (screenName: string) => void
  onLogout?: () => void
}

export default function HomeScreen({ navigate, onLogout }: Props) {
  const { theme } = useTheme()
  const [odsMenuOpen, setOdsMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState('guest')

  useEffect(() => {
    getUser<SessionUser>().then(user => {
      setUserRole(user?.ut_role ?? 'guest')
    })
  }, [])

  async function handleUserAction(action: string) {
    if (action === 'logout') {
      await clearSession()
      setTokenReader(async () => null)
      onLogout?.()
    }
  }

  const handleWafflePress = useCallback((item: WaffleMenuItem) => {
    if (item.route === 'logout') {
      handleUserAction('logout')
    } else {
      navigate(item.route)
    }
  }, [navigate, onLogout])

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
      <View style={styles.body}>
        <WaffleMenu
          items={(waffleItems as WaffleMenuItem[]).filter(item =>
            matchesRole(item.allowedRoles ?? ['*'], userRole)
          )}
          onItemPress={handleWafflePress}
        />
      </View>
      <OdsMenuDrawer
        visible={odsMenuOpen}
        userRole={userRole}
        onClose={() => setOdsMenuOpen(false)}
        onNavigate={navigate}
      />
      <UserMenuDrawer
        visible={userMenuOpen}
        userRole={userRole}
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
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
