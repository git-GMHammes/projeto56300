import { useState, useEffect, useCallback } from 'react'
import type { TimelineReaction } from '../../../domain/entities/TimelineReaction'
import type { PaginatedData } from '../../../../shared/types'
import { GetTimelineReactionListUseCase, CreateTimelineReactionUseCase, DeleteTimelineReactionUseCase } from '../../../domain/usecases/TimelineReactionUseCases'
import { TimelineReactionRepositoryImpl } from '../../../data/repositories/TimelineReactionRepositoryImpl'
import type { ReactionType } from '../../../../shared/types'

const repo = new TimelineReactionRepositoryImpl()
const getListUseCase = new GetTimelineReactionListUseCase(repo)
const createUseCase = new CreateTimelineReactionUseCase(repo)
const deleteUseCase = new DeleteTimelineReactionUseCase(repo)

interface State {
  data: TimelineReaction[]
  pagination: Omit<PaginatedData<TimelineReaction>, 'data'> | null
  loading: boolean
  error: string | null
  page: number
}

export function useTimelineReactionViewModel(timelineId: number) {
  const [state, setState] = useState<State>({
    data: [],
    pagination: null,
    loading: false,
    error: null,
    page: 1,
  })

  const load = useCallback(async (page = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await getListUseCase.execute(page)
      const { data, ...pagination } = result
      setState(prev => ({
        ...prev,
        data: page === 1 ? data : [...prev.data, ...data],
        pagination,
        loading: false,
        page,
      }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar reações'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  const react = useCallback(async (userId: number, reaction: ReactionType) => {
    await createUseCase.execute({ timeline_id: timelineId, user_management_id: userId, reaction })
    load(1)
  }, [timelineId, load])

  const removeReaction = useCallback(async (id: number) => {
    await deleteUseCase.execute(id)
    load(1)
  }, [load])

  return { ...state, reload: () => load(1), react, removeReaction }
}
