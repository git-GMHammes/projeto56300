import { useState, useCallback, useEffect } from 'react'
import { FindUsersUseCase } from '../../../domain/usecases/FindUsersUseCase'
import { UserRepositoryImpl } from '../../../data/repositories/UserRepositoryImpl'
import type { User } from '../../../domain/entities/User'

const findUsersUseCase = new FindUsersUseCase(new UserRepositoryImpl())

interface UserListState {
  users: User[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  search: string
}

export function useUserListViewModel() {
  const [state, setState] = useState<UserListState>({
    users: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    search: '',
  })

  const load = useCallback(async (page = 1, search = '') => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await findUsersUseCase.execute({ page, per_page: 20, search: search || undefined })
      setState(prev => ({
        ...prev,
        loading: false,
        users: result.data,
        page: result.meta.current_page,
        totalPages: result.meta.last_page,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar usuários.',
      }))
    }
  }, [])

  const setSearch = useCallback((text: string) => {
    setState(prev => ({ ...prev, search: text }))
  }, [])

  const submitSearch = useCallback(() => {
    load(1, state.search)
  }, [load, state.search])

  const nextPage = useCallback(() => {
    if (state.page < state.totalPages) load(state.page + 1, state.search)
  }, [load, state.page, state.totalPages, state.search])

  const prevPage = useCallback(() => {
    if (state.page > 1) load(state.page - 1, state.search)
  }, [load, state.page, state.search])

  useEffect(() => { load() }, [load])

  return { ...state, load, setSearch, submitSearch, nextPage, prevPage }
}
