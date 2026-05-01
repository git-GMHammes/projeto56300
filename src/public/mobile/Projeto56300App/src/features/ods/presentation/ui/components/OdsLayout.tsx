import React, { useState } from 'react'
import type { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import type { NavigationProp } from '../../../../../core/navigation'
import type { OdsStackParamList } from '../../routes/types'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { GlobalTheme } from '../../../../../shared/theme/global'
import TopBar from '../../../../../shared/ui/components/TopBar'
import HamburgerMenuButton from '../../../../../shared/ui/components/HamburgerMenuButton'
import OdsMenuDrawer from './OdsMenuDrawer'

interface Props {
  navigation: NavigationProp<OdsStackParamList>
  children?: ReactNode
}

export default function OdsLayout({ navigation, children }: Props) {
  const { theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const styles = makeStyles(theme)

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar
        rightContent={
          <HamburgerMenuButton onPress={() => setMenuOpen(true)} />
        }
      />
      <OdsMenuDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(name) => navigation.navigate(name as keyof OdsStackParamList)}
      />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

function makeStyles(t: GlobalTheme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: t.colors.bg,
    },
    content: {
      flex: 1,
    },
  })
}
