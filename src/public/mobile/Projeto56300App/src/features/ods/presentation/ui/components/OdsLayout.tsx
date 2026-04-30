import React from 'react'
import type { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from '../../../../../core/navigation'
import type { NavigationProp } from '../../../../../core/navigation'
import type { OdsStackParamList } from '../../routes/types'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { GlobalTheme } from '../../../../../shared/theme/global'
import OdsMenuDrawer from './OdsMenuDrawer'

interface Props {
  navigation: NavigationProp<OdsStackParamList>
  children?: ReactNode
}

export default function OdsLayout({ navigation, children }: Props) {
  const { theme } = useTheme()
  const styles = makeStyles(theme)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.spacer} />
        <OdsMenuDrawer
          onNavigate={(name) => navigation.navigate(name as keyof OdsStackParamList)}
        />
      </View>
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
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Bootstrap.spacing.xl,
      paddingVertical: Bootstrap.spacing.md,
      minHeight: 48,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.border,
      backgroundColor: t.colors.surface,
    },
    spacer: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  })
}
