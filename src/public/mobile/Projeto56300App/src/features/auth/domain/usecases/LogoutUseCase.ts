import type { IAuthRepository } from '../repositories/IAuthRepository'
import { clearSession } from '../../../../core/services/StorageService'
import { setTokenReader as setHttpTokenReader } from '../../../../core/services/HttpClient'

export class LogoutUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.repo.logout().catch(() => {})
    await clearSession()
    setHttpTokenReader(async () => null)
  }
}
