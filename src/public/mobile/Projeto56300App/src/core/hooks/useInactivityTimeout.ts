import { useRef, useCallback, useEffect } from 'react'

const WARN_AFTER_MS   = 13 * 60 * 1000
const LOGOUT_AFTER_MS = 15 * 60 * 1000

interface Options {
  onWarn: () => void
  onLogout: () => void
  enabled?: boolean
}

export function useInactivityTimeout({ onWarn, onLogout, enabled = true }: Options) {
  const warnTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (warnTimerRef.current)   clearTimeout(warnTimerRef.current)
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current)
    warnTimerRef.current   = null
    logoutTimerRef.current = null
  }, [])

  const resetTimers = useCallback(() => {
    if (!enabled) return
    clearTimers()
    warnTimerRef.current = setTimeout(() => {
      onWarn()
      logoutTimerRef.current = setTimeout(() => {
        onLogout()
      }, LOGOUT_AFTER_MS - WARN_AFTER_MS)
    }, WARN_AFTER_MS)
  }, [enabled, clearTimers, onWarn, onLogout])

  useEffect(() => {
    if (enabled) {
      resetTimers()
    } else {
      clearTimers()
    }
    return clearTimers
  }, [enabled, resetTimers, clearTimers])

  return { resetTimers }
}
