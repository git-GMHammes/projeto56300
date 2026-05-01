import { useState, useEffect, useCallback } from 'react'
import type { GroupMessage } from '../../../domain/entities/GroupMessage'
import type { PaginatedData } from '../../../../shared/types'
import { GetGroupMessageListUseCase, SendGroupMessageUseCase, DeleteGroupMessageUseCase } from '../../../domain/usecases/GroupMessageUseCases'
import { GroupMessageRepositoryImpl } from '../../../data/repositories/GroupMessageRepositoryImpl'

const repo = new GroupMessageRepositoryImpl()
const getListUseCase = new GetGroupMessageListUseCase(repo)
const sendUseCase = new SendGroupMessageUseCase(repo)
const deleteUseCase = new DeleteGroupMessageUseCase(repo)

interface State {
  data: GroupMessage[]
  pagination: Omit<PaginatedData<GroupMessage>, 'data'> | null
  loading: boolean
  sending: boolean
  error: string | null
  page: number
}

export function useGroupMessageViewModel(groupId: number) {
  const [state, setState] = useState<State>({
    data: [],
    pagination: null,
    loading: false,
    sending: false,
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
      const message = err instanceof Error ? err.message : 'Erro ao carregar mensagens'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  const send = useCallback(async (userId: number, content: string, replyToId?: number) => {
    setState(prev => ({ ...prev, sending: true }))
    try {
      await sendUseCase.execute({ group_id: groupId, user_management_id: userId, content, reply_to_id: replyToId })
      await load(1)
    } finally {
      setState(prev => ({ ...prev, sending: false }))
    }
  }, [groupId, load])

  const remove = useCallback(async (id: number) => {
    await deleteUseCase.execute(id)
    load(1)
  }, [load])

  return { ...state, reload: () => load(1), loadMore: () => load(state.page + 1), send, remove }
}
