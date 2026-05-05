import type { PaginatedData } from '../../../shared/types'
import type { Group, CreateGroupPayload, UpdateGroupPayload } from '../entities/Group'

export interface IGroupRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedData<Group>>
  get(id: number): Promise<Group>
  search(q: string, page?: number, perPage?: number): Promise<PaginatedData<Group>>
  create(payload: CreateGroupPayload): Promise<Group>
  update(id: number, payload: UpdateGroupPayload): Promise<Group>
  deleteSoft(id: number): Promise<void>
}
