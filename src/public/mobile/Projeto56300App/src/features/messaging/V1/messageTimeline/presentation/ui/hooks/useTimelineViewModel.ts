import { useState, useEffect, useCallback } from 'react'
import type { Timeline } from '../../../domain/entities/Timeline'
import type { PaginatedData } from '../../../../shared/types'
import { GetTimelineListUseCase } from '../../../domain/usecases/TimelineUseCases'
import { TimelineRepositoryImpl } from '../../../data/repositories/TimelineRepositoryImpl'

const getListUseCase = new GetTimelineListUseCase(new TimelineRepositoryImpl())

interface TimelineState {
  data: Timeline[]
  pagination: Omit<PaginatedData<Timeline>, 'data'> | null
  loading: boolean
  error: string | null
  page: number
}

export function useTimelineViewModel() {
  const [state, setState] = useState<TimelineState>({
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
      const message = err instanceof Error ? err.message : 'Erro ao carregar timeline'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  return {
    ...state,
    reload: () => load(1),
    loadMore: () => load(state.page + 1),
  }
}
