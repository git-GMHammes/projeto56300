import { THEME } from '../../../core/constants/theme'
import type { GlobalTheme, ThemeName } from './types'
import themePurple from './themePurple'
import themeDark   from './themeDark'
import themeLight  from './themeLight'
import themeGreen  from './themeGreen'
import themeBlue   from './themeBlue'
import themeRed    from './themeRed'

export type { GlobalTheme, ThemeName }

export const themes: Record<ThemeName, GlobalTheme> = {
  Purple: themePurple,
  Dark:   themeDark,
  Light:  themeLight,
  Green:  themeGreen,
  Blue:   themeBlue,
  Red:    themeRed,
}

/** Tema padrão lido do tomador de decisão central (core/constants/theme.ts) */
export const DEFAULT_THEME: ThemeName = THEME

export function getActiveTheme(name?: ThemeName): GlobalTheme {
  return themes[name ?? DEFAULT_THEME] ?? themePurple
}
