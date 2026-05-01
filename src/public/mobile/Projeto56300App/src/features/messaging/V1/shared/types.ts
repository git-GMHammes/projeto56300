export interface PaginatedData<T> {
  data: T[]
  currentPage: number
  perPage: number
  total: number
  pageCount: number
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
export type FileSource = 'timeline' | 'private' | 'group'
export type FileCategory = 'image' | 'video' | 'document' | 'audio' | 'other'
export type GroupMemberRole = 'admin' | 'member'
