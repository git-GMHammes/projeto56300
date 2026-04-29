import type { IUserRepository } from '../repositories/IUserRepository'
import type { User } from '../entities/User'
import type { UserProfile } from '../entities/UserProfile'

export class GetUserByIdUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(id: string): Promise<User & { profile?: UserProfile }> {
    return this.repo.getById(id)
  }
}
