import React, { useState, useCallback } from 'react'
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native'
import { HomeNavigator } from '../../features/home/presentation/routes'
import MessageFooterBar from '../../shared/ui/components/MessageFooterBar'
import MessageDrawer, { type MessageDrawerType } from '../../shared/ui/components/MessageDrawer'
import { useInactivityTimeout } from '../../core/hooks/useInactivityTimeout'

interface Props {
  onLogout: () => void
}

export function AppNavigator({ onLogout }: Props) {
  const [activeDrawer, setActiveDrawer]   = useState<MessageDrawerType | null>(null)
  const [showWarnModal, setShowWarnModal] = useState(false)

  const handleWarn   = useCallback(() => setShowWarnModal(true), [])
  const handleLogout = useCallback(() => { setShowWarnModal(false); onLogout() }, [onLogout])

  const { resetTimers } = useInactivityTimeout({
    onWarn:  handleWarn,
    onLogout: handleLogout,
    enabled: true,
  })

  const handleTouch = useCallback(() => {
    setShowWarnModal(false)
    resetTimers()
  }, [resetTimers])

  return (
    <View
      style={styles.container}
      onStartShouldSetResponderCapture={() => { handleTouch(); return false }}
    >
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
      <Modal transparent visible={showWarnModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sessão expirando</Text>
            <Text style={styles.modalText}>
              Sua sessão expirará em 2 minutos por inatividade.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleTouch}>
              <Text style={styles.modalButtonText}>Continuar sessão</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  content:         { flex: 1 },
  modalOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox:        { backgroundColor: '#fff', borderRadius: 8, padding: 24, width: '80%', alignItems: 'center' },
  modalTitle:      { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' },
  modalText:       { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
  modalButton:     { backgroundColor: '#0066cc', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 24 },
  modalButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
})
