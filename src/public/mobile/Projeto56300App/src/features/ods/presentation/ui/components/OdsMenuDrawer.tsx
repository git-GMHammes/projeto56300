import React, { useRef, useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native'
import Bootstrap from '../../../../../shared/theme/bootstrap'
import { useTheme } from '../../../../../app/providers/ThemeProvider'
import type { GlobalTheme } from '../../../../../shared/theme/global'
import menuData from '../../../../../data/ods/menu.json'

const SCREEN_WIDTH = Dimensions.get('window').width
const PANEL_WIDTH = Math.min(Math.round(SCREEN_WIDTH * 0.82), 300)

interface Props {
  onNavigate: (screenName: string) => void
}

export default function OdsMenuDrawer({ onNavigate }: Props) {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const slideAnim = useRef(new Animated.Value(PANEL_WIDTH)).current

  const openMenu = useCallback(() => {
    setVisible(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start()
  }, [slideAnim])

  const closeMenu = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: PANEL_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setVisible(false))
  }, [slideAnim])

  function handleItemPress(link: string) {
    if (!link || link === '#') return
    closeMenu()
    setTimeout(() => onNavigate(link), 240)
  }

  const styles = makeStyles(theme)

  return (
    <>
      <Pressable
        onPress={openMenu}
        style={({ pressed }) => [styles.hamburger, pressed && styles.hamburgerPressed]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="Abrir menu ODS"
        accessibilityRole="button"
      >
        <Text style={styles.hamburgerIcon}>☰</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.overlay}>
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
              {menuData.map((item) => (
                <Pressable
                  key={item.ods}
                  onPress={() => handleItemPress(item.link)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <Text style={styles.odsLabel}>{item.ods}</Text>
                  <Text style={styles.odsDesc}>{item.description}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

function makeStyles(t: GlobalTheme) {
  return StyleSheet.create({
    hamburger: {
      padding: Bootstrap.spacing.md,
      borderRadius: Bootstrap.borderRadius.md,
    },
    hamburgerPressed: {
      backgroundColor: t.colors.divider,
    },
    hamburgerIcon: {
      fontSize: Bootstrap.fontSize.xl,
      color: t.colors.text,
      lineHeight: Bootstrap.fontSize.xl + 4,
    },
    overlay: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    backdrop: {
      flex: 1,
    },
    panel: {
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
