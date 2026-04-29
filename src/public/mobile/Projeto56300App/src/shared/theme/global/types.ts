export type ThemeName = 'Purple' | 'Dark' | 'Light' | 'Green' | 'Blue' | 'Red'

export interface LoginTheme {
  bgStart: string
  bgMid: string
  bgEnd: string
  cardBg: string
  headerStart: string
  headerEnd: string
  headerText: string
  btnBg: string
  btnBgHover: string
  btnText: string
  link: string
  linkHover: string
}

export interface AppColors {
  bg: string
  surface: string
  primary: string
  primaryText: string
  text: string
  textMuted: string
  border: string
  divider: string
  inputBg: string
  inputBorder: string
  inputText: string
  placeholder: string
  success: string
  successBg: string
  successBorder: string
  successText: string
  danger: string
  dangerBg: string
  dangerBorder: string
  dangerText: string
  warningBg: string
  warningBorder: string
  warningText: string
}

export interface GlobalTheme {
  name: ThemeName
  login: LoginTheme
  colors: AppColors
}
