import type { IGroupMessageRepository } from '../repositories/IGroupMessageRepository'
import type { CreateGroupMessagePayload, UpdateGroupMessagePayload } from '../entities/GroupMessage'

export class GetGroupMessageListUseCase {
  constructor(private readonly repo: IGroupMessageRepository) {}
  execute(page = 1, perPage = 30) { return this.repo.getAll(page, perPage) }
}

export class GetGroupMessageUseCase {
  constructor(private readonly repo: IGroupMessageRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchGroupMessageUseCase {
  constructor(private readonly repo: IGroupMessageRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class SendGroupMessageUseCase {
  constructor(private readonly repo: IGroupMessageRepository) {}
  execute(payload: CreateGroupMessagePayload) { return this.repo.create(payload) }
}

export class UpdateGroupMessageUseCase {
  constructor(private readonly repo: IGroupMessageRepository) {}
  execute(id: number, payload: UpdateGroupMessagePayload) { return this.repo.update(id, payload) }
}

export class DeleteGroupMessageUseCase {
  constructor(private readonly repo: IGroupMessageRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
