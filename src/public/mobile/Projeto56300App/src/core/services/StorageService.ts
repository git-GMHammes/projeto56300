import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  TOKEN: 'auth_token',
  TOKEN_TYPE: 'auth_token_type',
  EXPIRES_AT: 'auth_expires_at',
  USER: 'auth_user',
} as const

export async function saveSession(
  token: string,
  tokenType: string,
  expiresIn: number,
  user: unknown,
): Promise<void> {
  const expiresAt = Date.now() + expiresIn * 1000
  await AsyncStorage.multiSet([
    [KEYS.TOKEN, token],
    [KEYS.TOKEN_TYPE, tokenType],
    [KEYS.EXPIRES_AT, String(expiresAt)],
    [KEYS.USER, JSON.stringify(user)],
  ])
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.TOKEN)
}

export async function getTokenType(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.TOKEN_TYPE)) ?? 'Bearer'
}

export async function getUser<T>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

export async function isAuthenticated(): Promise<boolean> {
  const [token, expiresAt] = await Promise.all([
    AsyncStorage.getItem(KEYS.TOKEN),
    AsyncStorage.getItem(KEYS.EXPIRES_AT),
  ])
  if (!token || !expiresAt) return false
  return Date.now() < Number(expiresAt)
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS))
}
