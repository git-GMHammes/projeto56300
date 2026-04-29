// In-memory storage — no native dependency.
// Token is lost on app restart (user must log in again).
// Replace with a persisted solution once the build environment
// supports native C++ compilation (adequate RAM/page file).

type Session = {
  token: string
  tokenType: string
  expiresAt: number
  user: unknown
}

let _session: Session | null = null

export async function saveSession(
  token: string,
  tokenType: string,
  expiresIn: number,
  user: unknown,
): Promise<void> {
  _session = {
    token,
    tokenType,
    expiresAt: Date.now() + expiresIn * 1000,
    user,
  }
}

export async function getToken(): Promise<string | null> {
  return _session?.token ?? null
}

export async function getTokenType(): Promise<string> {
  return _session?.tokenType ?? 'Bearer'
}

export async function getUser<T>(): Promise<T | null> {
  return (_session?.user as T) ?? null
}

export async function isAuthenticated(): Promise<boolean> {
  if (!_session) return false
  return Date.now() < _session.expiresAt
}

export async function clearSession(): Promise<void> {
  _session = null
}

// Kept for API compatibility — no-op since there's nothing to read back.
export function setTokenReader(_reader: () => Promise<string | null>): void {}
