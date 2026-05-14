import React, { useRef, useEffect, useCallback, useState } from 'react'
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'
import { useTheme } from '../../../app/providers/ThemeProvider'
import type { GlobalTheme } from '../../theme/global'
import TimelineScreen from '../../../features/messaging/V1/messageTimeline/presentation/ui/screens/TimelineScreen'
import PrivateScreen from '../../../features/messaging/V1/messagePrivate/presentation/ui/screens/PrivateScreen'
import GroupScreen from '../../../features/messaging/V1/msgGroup/presentation/ui/screens/GroupScreen'
import HelperScreen from '../../../features/helper/presentation/ui/screens/HelperScreen'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PANEL_WIDTH = Math.round(SCREEN_WIDTH * 0.92)

export type MessageDrawerType = 'timeline' | 'dm' | 'groups' | 'helper'

interface Props {
  visible: boolean
  type: MessageDrawerType | null
  onClose: () => void
}

export default function MessageDrawer({ visible, type, onClose }: Props) {
  const { theme } = useTheme()
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      slideAnim.setValue(-PANEL_WIDTH)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, slideAnim])

  const closeDrawer = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -PANEL_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setMounted(false)
      onClose()
    })
  }, [slideAnim, onClose])

  const styles = makeStyles(theme)

  if (!mounted) return null

  function renderContent() {
    const noNavigate = () => {}
    switch (type) {
      case 'timeline':
        return <TimelineScreen navigate={noNavigate as any} goBack={closeDrawer} />
      case 'dm':
        return <PrivateScreen navigate={noNavigate as any} goBack={closeDrawer} />
      case 'groups':
        return <GroupScreen navigate={noNavigate as any} goBack={closeDrawer} />
      case 'helper':
        return <HelperScreen goBack={closeDrawer} />
      default:
        return null
    }
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={closeDrawer} />
      <Animated.View
        style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}
      >
        {renderContent()}
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
      left: 0,
      bottom: 0,
      width: PANEL_WIDTH,
      backgroundColor: t.colors.bg,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 12,
    },
  })
}
