import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { HomeNavigator } from '../../features/home/presentation/routes'
import MessageFooterBar from '../../shared/ui/components/MessageFooterBar'
import MessageDrawer, { type MessageDrawerType } from '../../shared/ui/components/MessageDrawer'

interface Props {
  onLogout: () => void
}

export function AppNavigator({ onLogout }: Props) {
  const [activeDrawer, setActiveDrawer] = useState<MessageDrawerType | null>(null)

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HomeNavigator onLogout={onLogout} />
      </View>
      <MessageFooterBar
        activeKey={activeDrawer}
        onPress={(key) => setActiveDrawer(key as MessageDrawerType)}
      />
      <MessageDrawer
        visible={activeDrawer !== null}
        type={activeDrawer}
        onClose={() => setActiveDrawer(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
})
