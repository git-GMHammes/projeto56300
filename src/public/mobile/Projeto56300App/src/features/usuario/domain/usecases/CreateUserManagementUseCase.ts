import type { IUserRepository } from '../repositories/IUserRepository'

export interface CreateUserManagementInput {
  username: string
  password: string
}

export interface CreateUserManagementResult {
  userId: string
}

export class CreateUserManagementUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: CreateUserManagementInput): Promise<CreateUserManagementResult> {
    const { id: userId } = await this.repo.createUser({
      username: input.username.trim(),
      password: input.password,
    })
    return { userId }
  }
}
