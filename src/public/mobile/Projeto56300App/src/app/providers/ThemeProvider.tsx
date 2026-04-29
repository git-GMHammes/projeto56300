import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { themes, DEFAULT_THEME, getActiveTheme } from '../../shared/theme/global'
import type { GlobalTheme, ThemeName } from '../../shared/theme/global'

interface ThemeContextValue {
  theme: GlobalTheme
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
  availableThemes: ThemeName[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: ThemeName
}

export function ThemeProvider({ children, initialTheme = DEFAULT_THEME }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme)

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name)
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({
    theme: getActiveTheme(themeName),
    themeName,
    setTheme,
    availableThemes: Object.keys(themes) as ThemeName[],
  }), [themeName, setTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
