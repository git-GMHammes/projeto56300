import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native'
import { HomeNavigator } from '../../features/home/presentation/routes'
import type { HomeNavigatorHandle } from '../../features/home/presentation/routes/HomeNavigator'
import MessageFooterBar from '../../shared/ui/components/MessageFooterBar'
import BottomSheetContainer from '../../shared/ui/components/BottomSheet/BottomSheetContainer'
import TopBanner from '../../shared/ui/components/TopBanner'
import { useInactivityTimeout } from '../../core/hooks/useInactivityTimeout'
import { getUser } from '../../core/services/StorageService'

type SessionUser = { ut_role?: string }

interface Props {
  onLogout: () => void
}

const CANVAS_KEYS = new Set(['timeline', 'dm', 'groups'])

export function AppNavigator({ onLogout }: Props) {
  const homeNavigatorRef = React.useRef<HomeNavigatorHandle>(null)
  const [activeSheet, setActiveSheet] = useState<string | null>(null)
  const [banner, setBanner]           = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showWarnModal, setShowWarnModal] = useState(false)
  const [userRole, setUserRole]       = useState('guest')

  useEffect(() => {
    getUser<SessionUser>().then(user => {
      setUserRole(user?.ut_role ?? 'guest')
    })
  }, [])

  const handleWarn   = useCallback(() => setShowWarnModal(true), [])
  const handleLogout = useCallback(() => { setShowWarnModal(false); onLogout() }, [onLogout])

  const { resetTimers } = useInactivityTimeout({
    onWarn:   handleWarn,
    onLogout: handleLogout,
    enabled:  true,
  })

  const handleTouch = useCallback(() => {
    setShowWarnModal(false)
    resetTimers()
  }, [resetTimers])

  const handleFooterPress = useCallback((key: string) => {
    if (CANVAS_KEYS.has(key)) {
      setActiveSheet(key)
    } else if (key === 'home') {
      homeNavigatorRef.current?.navigateToHome()
    } else if (key === 'helper') {
      homeNavigatorRef.current?.navigateToHelper()
    }
  }, [])

  return (
    <View
      style={styles.container}
      onStartShouldSetResponderCapture={() => { handleTouch(); return false }}
    >
      <View style={styles.content}>
        <HomeNavigator ref={homeNavigatorRef} onLogout={onLogout} />
      </View>

      <MessageFooterBar
        activeKey={activeSheet}
        userRole={userRole}
        onPress={handleFooterPress}
      />

      <BottomSheetContainer
        activeKey={activeSheet}
        onClose={() => setActiveSheet(null)}
        onSuccess={(msg) => setBanner({ type: 'success', message: msg })}
        onError={(msg) => setBanner({ type: 'error', message: msg })}
      />

      <TopBanner
        visible={banner !== null}
        type={banner?.type ?? 'success'}
        message={banner?.message ?? ''}
        onDismiss={() => setBanner(null)}
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
