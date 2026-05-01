import { useState, useEffect, useCallback } from 'react'
import type { GroupMember } from '../../../domain/entities/GroupMember'
import type { PaginatedData } from '../../../../shared/types'
import { GetGroupMemberListUseCase, AddGroupMemberUseCase, RemoveGroupMemberUseCase } from '../../../domain/usecases/GroupMemberUseCases'
import { GroupMemberRepositoryImpl } from '../../../data/repositories/GroupMemberRepositoryImpl'

const repo = new GroupMemberRepositoryImpl()
const getListUseCase = new GetGroupMemberListUseCase(repo)
const addUseCase = new AddGroupMemberUseCase(repo)
const removeUseCase = new RemoveGroupMemberUseCase(repo)

interface State {
  data: GroupMember[]
  pagination: Omit<PaginatedData<GroupMember>, 'data'> | null
  loading: boolean
  error: string | null
  page: number
}

export function useGroupMemberViewModel(groupId: number) {
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
      const message = err instanceof Error ? err.message : 'Erro ao carregar membros'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  const addMember = useCallback(async (userId: number) => {
    await addUseCase.execute({ group_id: groupId, user_management_id: userId })
    load(1)
  }, [groupId, load])

  const removeMember = useCallback(async (id: number) => {
    await removeUseCase.execute(id)
    load(1)
  }, [load])

  return { ...state, reload: () => load(1), addMember, removeMember }
}
