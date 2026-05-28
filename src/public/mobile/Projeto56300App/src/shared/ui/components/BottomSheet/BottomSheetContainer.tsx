import React, { useRef, useEffect, useCallback } from 'react'
import { View, Pressable, Animated, Dimensions, StyleSheet } from 'react-native'
import { useTheme } from '../../../../app/providers/ThemeProvider'
import Bootstrap from '../../../theme/bootstrap'
import { SHEET_REGISTRY } from './sheetRegistry'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.65)

interface Props {
  activeKey: string | null
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export default function BottomSheetContainer({ activeKey, onClose, onSuccess, onError }: Props) {
  const { theme } = useTheme()
  const slideAnim = useRef(new Animated.Value(PANEL_HEIGHT)).current

  useEffect(() => {
    if (activeKey) {
      slideAnim.setValue(PANEL_HEIGHT)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [activeKey, slideAnim])

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: PANEL_HEIGHT,
      duration: 240,
      useNativeDriver: true,
    }).start(() => onClose())
  }, [slideAnim, onClose])

  if (!activeKey) return null

  const SheetContent = SHEET_REGISTRY[activeKey]
  if (!SheetContent) return null

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.handleRow}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
        </View>
        <SheetContent onClose={handleClose} onSuccess={onSuccess} onError={onError} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 25,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    elevation: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: Bootstrap.spacing.sm,
    paddingBottom: Bootstrap.spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
})
