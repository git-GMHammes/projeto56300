import type { IAuthRepository, ResetPasswordPayload } from '../repositories/IAuthRepository'

export class ResetPasswordUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(payload: ResetPasswordPayload): Promise<void> {
    if (payload.password !== payload.password_confirm) {
      throw new Error('As senhas não conferem.')
    }
    await this.repo.resetPassword(payload)
  }
}
