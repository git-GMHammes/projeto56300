import type { IAuthRepository, LoginPayload } from '../repositories/IAuthRepository'
import type { AuthSession } from '../entities/AuthSession'
import { InvalidCredentialsError } from '../errors/AuthErrors'
import { saveSession, getRefreshToken, getToken, getUser } from '../../../../core/services/StorageService'
import { setTokenReader as setHttpTokenReader, setRefreshHandler } from '../../../../core/services/HttpClient'
import { API_BASE_URL } from '../../../../core/config/env'

export class LoginUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(payload: LoginPayload): Promise<AuthSession> {
    const session = await this.repo.login(payload)
    if (!session.token) throw new InvalidCredentialsError()

    await saveSession(
      session.token,
      session.tokenType,
      session.expiresIn,
      session.refreshToken,
      session.refreshExpiresIn,
      session.user,
    )

    setHttpTokenReader(getToken)

    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    setRefreshHandler(async () => {
      const refreshToken = await getRefreshToken()
      if (!refreshToken) return null
      const res = await fetch(`${base}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      if (!res.ok) return null
      const json = await res.json()
      if (!json.success || !json.data?.token) return null
      const d = json.data
      const currentUser = await getUser()
      await saveSession(d.token, d.token_type, d.expires_in, d.refresh_token, d.refresh_expires_in, currentUser)
      setHttpTokenReader(getToken)
      return d.token
    })

    return session
  }
}
