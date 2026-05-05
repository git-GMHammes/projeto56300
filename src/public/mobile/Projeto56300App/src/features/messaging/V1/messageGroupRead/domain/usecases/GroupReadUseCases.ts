import type { IGroupReadRepository } from '../repositories/IGroupReadRepository'
import type { CreateGroupReadPayload, UpdateGroupReadPayload, MarkReadPayload } from '../entities/GroupRead'

export class GetGroupReadListUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(page = 1, perPage = 50) { return this.repo.getAll(page, perPage) }
}

export class GetGroupReadUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchGroupReadUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class CreateGroupReadUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(payload: CreateGroupReadPayload) { return this.repo.create(payload) }
}

export class UpdateGroupReadUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(id: number, payload: UpdateGroupReadPayload) { return this.repo.update(id, payload) }
}

export class MarkReadUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(payload: MarkReadPayload) { return this.repo.markRead(payload) }
}

export class DeleteGroupReadUseCase {
  constructor(private readonly repo: IGroupReadRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
