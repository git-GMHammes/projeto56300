import type { IGroupMemberRepository } from '../repositories/IGroupMemberRepository'
import type { CreateGroupMemberPayload, UpdateGroupMemberPayload } from '../entities/GroupMember'

export class GetGroupMemberListUseCase {
  constructor(private readonly repo: IGroupMemberRepository) {}
  execute(page = 1, perPage = 50) { return this.repo.getAll(page, perPage) }
}

export class GetGroupMemberUseCase {
  constructor(private readonly repo: IGroupMemberRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchGroupMemberUseCase {
  constructor(private readonly repo: IGroupMemberRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class AddGroupMemberUseCase {
  constructor(private readonly repo: IGroupMemberRepository) {}
  execute(payload: CreateGroupMemberPayload) { return this.repo.create(payload) }
}

export class UpdateGroupMemberUseCase {
  constructor(private readonly repo: IGroupMemberRepository) {}
  execute(id: number, payload: UpdateGroupMemberPayload) { return this.repo.update(id, payload) }
}

export class RemoveGroupMemberUseCase {
  constructor(private readonly repo: IGroupMemberRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
