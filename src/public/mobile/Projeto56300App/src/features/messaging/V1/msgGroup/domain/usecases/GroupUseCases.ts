import type { IGroupRepository } from '../repositories/IGroupRepository'
import type { CreateGroupPayload, UpdateGroupPayload } from '../entities/Group'

export class GetGroupListUseCase {
  constructor(private readonly repo: IGroupRepository) {}
  execute(page = 1, perPage = 15) { return this.repo.getAll(page, perPage) }
}

export class GetGroupUseCase {
  constructor(private readonly repo: IGroupRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchGroupUseCase {
  constructor(private readonly repo: IGroupRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class CreateGroupUseCase {
  constructor(private readonly repo: IGroupRepository) {}
  execute(payload: CreateGroupPayload) { return this.repo.create(payload) }
}

export class UpdateGroupUseCase {
  constructor(private readonly repo: IGroupRepository) {}
  execute(id: number, payload: UpdateGroupPayload) { return this.repo.update(id, payload) }
}

export class DeleteGroupUseCase {
  constructor(private readonly repo: IGroupRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
