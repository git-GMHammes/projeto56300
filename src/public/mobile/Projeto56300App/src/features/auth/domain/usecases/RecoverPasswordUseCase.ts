import type { IAuthRepository, RecoverPasswordPayload } from '../repositories/IAuthRepository'

export class RecoverPasswordUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(payload: RecoverPasswordPayload): Promise<void> {
    await this.repo.recoverPassword(payload)
  }
}
