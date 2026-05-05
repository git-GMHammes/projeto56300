import type { ITimelineReactionRepository } from '../repositories/ITimelineReactionRepository'
import type { CreateTimelineReactionPayload, UpdateTimelineReactionPayload } from '../entities/TimelineReaction'

export class GetTimelineReactionListUseCase {
  constructor(private readonly repo: ITimelineReactionRepository) {}
  execute(page = 1, perPage = 15) { return this.repo.getAll(page, perPage) }
}

export class GetTimelineReactionUseCase {
  constructor(private readonly repo: ITimelineReactionRepository) {}
  execute(id: number) { return this.repo.get(id) }
}

export class SearchTimelineReactionUseCase {
  constructor(private readonly repo: ITimelineReactionRepository) {}
  execute(q: string, page = 1) { return this.repo.search(q, page) }
}

export class CreateTimelineReactionUseCase {
  constructor(private readonly repo: ITimelineReactionRepository) {}
  execute(payload: CreateTimelineReactionPayload) { return this.repo.create(payload) }
}

export class UpdateTimelineReactionUseCase {
  constructor(private readonly repo: ITimelineReactionRepository) {}
  execute(id: number, payload: UpdateTimelineReactionPayload) { return this.repo.update(id, payload) }
}

export class DeleteTimelineReactionUseCase {
  constructor(private readonly repo: ITimelineReactionRepository) {}
  execute(id: number) { return this.repo.deleteSoft(id) }
}
