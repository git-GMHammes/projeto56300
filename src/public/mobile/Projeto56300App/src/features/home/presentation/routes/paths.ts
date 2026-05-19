export const HOME_PATHS = {
  HOME: 'Home',
  HELPER: 'Helper',
} as const

export type HomePathKey = keyof typeof HOME_PATHS
export type HomePath = (typeof HOME_PATHS)[HomePathKey]
