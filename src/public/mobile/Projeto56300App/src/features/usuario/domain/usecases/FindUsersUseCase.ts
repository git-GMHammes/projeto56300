import type { IUserRepository, FindUsersParams, PaginatedUsers } from '../repositories/IUserRepository'

export class FindUsersUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(params: FindUsersParams): Promise<PaginatedUsers> {
    return this.repo.findUsers(params)
  }
}
