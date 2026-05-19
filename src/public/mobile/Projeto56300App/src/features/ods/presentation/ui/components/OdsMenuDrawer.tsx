import React, { useRef, useEffect, useCallback, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { GlobalTheme } from '../../../../../shared/theme/global'
import menuData from '../../../../../data/ods/menu_ods.json'
import { matchesRole } from '../../../../../shared/utils/menuFilter'

interface OdsMenuItem {
  key: string
  label: string
  description: string
  route: string
  allowedRoles?: string[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PANEL_WIDTH = Math.min(Math.round(SCREEN_WIDTH * 0.82), 300)

interface Props {
  visible: boolean
  userRole?: string
  onClose: () => void
  onNavigate: (screenName: string) => void
}

export default function OdsMenuDrawer({ visible, userRole = 'guest', onClose, onNavigate }: Props) {
  const { theme } = useTheme()
  const slideAnim = useRef(new Animated.Value(PANEL_WIDTH)).current
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      slideAnim.setValue(PANEL_WIDTH)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, slideAnim])

  const closeMenu = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: PANEL_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setMounted(false)
      onClose()
    })
  }, [slideAnim, onClose])

  function handleItemPress(link: string) {
    if (!link || link === '#') return
    closeMenu()
    setTimeout(() => onNavigate(link), 240)
  }

  const styles = makeStyles(theme)

  if (!mounted) return null

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={closeMenu} />
      <Animated.View
        style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle} numberOfLines={2}>
            Objetivos de{'\n'}Desenvolvimento Sustentável
          </Text>
          <Pressable
            onPress={closeMenu}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Fechar menu"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          bounces={false}
          showsVerticalScrollIndicator
        >
          {(menuData as OdsMenuItem[]).filter(item =>
              matchesRole(item.allowedRoles ?? ['*'], userRole)
            ).map((item) => (
            <Pressable
              key={item.key}
              onPress={() => handleItemPress(item.route)}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <Text style={styles.odsLabel}>{item.label}</Text>
              <Text style={styles.odsDesc}>{item.description}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

function makeStyles(t: GlobalTheme) {
  return StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      zIndex: 999,
      elevation: 20,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    panel: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: PANEL_WIDTH,
      backgroundColor: t.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 12,
    },
    panelHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: Bootstrap.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.border,
      backgroundColor: t.colors.bg,
    },
    panelTitle: {
      flex: 1,
      fontSize: Bootstrap.fontSize.base,
      fontWeight: Bootstrap.fontWeight.bold,
      color: t.colors.text,
      marginRight: Bootstrap.spacing.md,
      lineHeight: Bootstrap.fontSize.base * 1.4,
    },
    closeIcon: {
      fontSize: Bootstrap.fontSize.md,
      color: t.colors.textMuted,
      paddingTop: 2,
    },
    scroll: {
      flex: 1,
    },
    menuItem: {
      paddingVertical: Bootstrap.spacing.lg,
      paddingHorizontal: Bootstrap.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.divider,
    },
    menuItemPressed: {
      backgroundColor: t.colors.divider,
    },
    odsLabel: {
      fontSize: Bootstrap.fontSize.base,
      fontWeight: Bootstrap.fontWeight.semibold,
      color: t.colors.primary,
      marginBottom: 2,
    },
    odsDesc: {
      fontSize: Bootstrap.fontSize.sm,
      color: t.colors.textMuted,
    },
  })
}
