import type { IAuthRepository, LoginPayload } from '../repositories/IAuthRepository'
import type { AuthSession } from '../entities/AuthSession'
import { InvalidCredentialsError } from '../errors/AuthErrors'
import { saveSession } from '../../../../core/services/StorageService'
import { setTokenReader as setHttpTokenReader } from '../../../../core/services/HttpClient'

export class LoginUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(payload: LoginPayload): Promise<AuthSession> {
    const session = await this.repo.login(payload)
    if (!session.token) throw new InvalidCredentialsError()

    await saveSession(session.token, session.tokenType, session.expiresIn, session.user)

    setHttpTokenReader(async () => session.token)

    return session
  }
}
