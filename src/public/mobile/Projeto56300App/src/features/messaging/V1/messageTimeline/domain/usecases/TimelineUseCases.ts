import type { ITimelineRepository } from '../repositories/ITimelineRepository'
import type { CreateTimelinePayload, UpdateTimelinePayload } from '../entities/Timeline'

export class GetTimelineListUseCase {
  constructor(private readonly repo: ITimelineRepository) {}
  execute(page = 1, perPage = 15) { return this.repo.getAll(page, perPage) }
}

export class GetTimelineUseCase {
  constructor(private readonly repo: ITimelineRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchTimelineUseCase {
  constructor(private readonly repo: ITimelineRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class CreateTimelineUseCase {
  constructor(private readonly repo: ITimelineRepository) {}
  execute(payload: CreateTimelinePayload) { return this.repo.create(payload) }
}

export class UpdateTimelineUseCase {
  constructor(private readonly repo: ITimelineRepository) {}
  execute(id: number, payload: UpdateTimelinePayload) { return this.repo.update(id, payload) }
}

export class DeleteTimelineUseCase {
  constructor(private readonly repo: ITimelineRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
