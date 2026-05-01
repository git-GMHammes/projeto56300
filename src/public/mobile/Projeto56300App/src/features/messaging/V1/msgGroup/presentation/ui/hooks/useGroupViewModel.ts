import { useState, useEffect, useCallback } from 'react'
import type { Group } from '../../../domain/entities/Group'
import type { PaginatedData } from '../../../../shared/types'
import { GetGroupListUseCase, CreateGroupUseCase, DeleteGroupUseCase } from '../../../domain/usecases/GroupUseCases'
import { GroupRepositoryImpl } from '../../../data/repositories/GroupRepositoryImpl'

const repo = new GroupRepositoryImpl()
const getListUseCase = new GetGroupListUseCase(repo)
const createUseCase = new CreateGroupUseCase(repo)
const deleteUseCase = new DeleteGroupUseCase(repo)

interface State {
  data: Group[]
  pagination: Omit<PaginatedData<Group>, 'data'> | null
  loading: boolean
  error: string | null
  page: number
}

export function useGroupViewModel() {
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
      const message = err instanceof Error ? err.message : 'Erro ao carregar grupos'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  const createGroup = useCallback(async (tenantId: number, name: string, createdBy: number, description?: string) => {
    await createUseCase.execute({ tenant_id: tenantId, name, created_by: createdBy, description })
    load(1)
  }, [load])

  const removeGroup = useCallback(async (id: number) => {
    await deleteUseCase.execute(id)
    load(1)
  }, [load])

  return { ...state, reload: () => load(1), loadMore: () => load(state.page + 1), createGroup, removeGroup }
}
