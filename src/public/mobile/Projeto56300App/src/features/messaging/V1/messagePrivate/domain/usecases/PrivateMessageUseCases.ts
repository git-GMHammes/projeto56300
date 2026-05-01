import type { IPrivateMessageRepository } from '../repositories/IPrivateMessageRepository'
import type { CreatePrivateMessagePayload, UpdatePrivateMessagePayload } from '../entities/PrivateMessage'

export class GetPrivateMessageListUseCase {
  constructor(private readonly repo: IPrivateMessageRepository) {}
  execute(page = 1, perPage = 20) { return this.repo.getAll(page, perPage) }
}

export class GetPrivateMessageUseCase {
  constructor(private readonly repo: IPrivateMessageRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchPrivateMessageUseCase {
  constructor(private readonly repo: IPrivateMessageRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class SendPrivateMessageUseCase {
  constructor(private readonly repo: IPrivateMessageRepository) {}
  execute(payload: CreatePrivateMessagePayload) { return this.repo.create(payload) }
}

export class UpdatePrivateMessageUseCase {
  constructor(private readonly repo: IPrivateMessageRepository) {}
  execute(id: number, payload: UpdatePrivateMessagePayload) { return this.repo.update(id, payload) }
}

export class DeletePrivateMessageUseCase {
  constructor(private readonly repo: IPrivateMessageRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
