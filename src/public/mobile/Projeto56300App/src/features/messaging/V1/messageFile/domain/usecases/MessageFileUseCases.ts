import type { IMessageFileRepository } from '../repositories/IMessageFileRepository'
import type { CreateMessageFilePayload } from '../entities/MessageFile'

export class GetMessageFileListUseCase {
  constructor(private readonly repo: IMessageFileRepository) {}
  execute(page = 1, perPage = 20) { return this.repo.getAll(page, perPage) }
}

export class GetMessageFileUseCase {
  constructor(private readonly repo: IMessageFileRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchMessageFileUseCase {
  constructor(private readonly repo: IMessageFileRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class CreateMessageFileUseCase {
  constructor(private readonly repo: IMessageFileRepository) {}
  execute(payload: CreateMessageFilePayload) { return this.repo.create(payload) }
}

export class DeleteMessageFileUseCase {
  constructor(private readonly repo: IMessageFileRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
