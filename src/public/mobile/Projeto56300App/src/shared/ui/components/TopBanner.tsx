import React, { useEffect, useRef } from 'react'
import { Animated, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../app/providers/ThemeProvider'
import Bootstrap from '../../theme/bootstrap'

interface Props {
  visible: boolean
  type: 'success' | 'error'
  message: string
  onDismiss: () => void
}

export default function TopBanner({ visible, type, message, onDismiss }: Props) {
  const { theme } = useTheme()
  const translateY = useRef(new Animated.Value(-80)).current

  useEffect(() => {
    if (!visible) {
      translateY.setValue(-80)
      return
    }

    Animated.timing(translateY, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start()

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -80,
        duration: 280,
        useNativeDriver: true,
      }).start(() => onDismiss())
    }, 4000)

    return () => clearTimeout(timer)
  }, [visible, translateY, onDismiss])

  if (!visible) return null

  const bgColor   = type === 'success' ? theme.colors.success    : theme.colors.danger
  const textColor = type === 'success' ? theme.colors.successText : theme.colors.dangerText

  return (
    <Animated.View
      style={[styles.banner, { backgroundColor: bgColor, transform: [{ translateY }] }]}
    >
      <Text style={[styles.text, { color: textColor }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    elevation: 30,
    paddingHorizontal: Bootstrap.spacing.xl,
    paddingVertical: Bootstrap.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  text: {
    fontSize: Bootstrap.fontSize.base,
    fontWeight: Bootstrap.fontWeight.semibold,
    textAlign: 'center',
  },
})
