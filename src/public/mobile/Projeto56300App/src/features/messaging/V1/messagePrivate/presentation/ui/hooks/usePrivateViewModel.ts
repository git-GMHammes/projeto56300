import { useState, useEffect, useCallback } from 'react'
import type { PrivateMessage } from '../../../domain/entities/PrivateMessage'
import type { PaginatedData } from '../../../../shared/types'
import { GetPrivateMessageListUseCase, SendPrivateMessageUseCase, DeletePrivateMessageUseCase } from '../../../domain/usecases/PrivateMessageUseCases'
import { PrivateMessageRepositoryImpl } from '../../../data/repositories/PrivateMessageRepositoryImpl'

const repo = new PrivateMessageRepositoryImpl()
const getListUseCase = new GetPrivateMessageListUseCase(repo)
const sendUseCase = new SendPrivateMessageUseCase(repo)
const deleteUseCase = new DeletePrivateMessageUseCase(repo)

interface State {
  data: PrivateMessage[]
  pagination: Omit<PaginatedData<PrivateMessage>, 'data'> | null
  loading: boolean
  sending: boolean
  error: string | null
  page: number
}

export function usePrivateViewModel() {
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

  const send = useCallback(async (tenantId: number, senderId: number, receiverId: number, content: string) => {
    setState(prev => ({ ...prev, sending: true }))
    try {
      await sendUseCase.execute({ tenant_id: tenantId, sender_id: senderId, receiver_id: receiverId, content })
      await load(1)
    } finally {
      setState(prev => ({ ...prev, sending: false }))
    }
  }, [load])

  const remove = useCallback(async (id: number) => {
    await deleteUseCase.execute(id)
    load(1)
  }, [load])

  return { ...state, reload: () => load(1), loadMore: () => load(state.page + 1), send, remove }
}
