import { useState, useEffect, useCallback } from 'react'
import type { MessageFile } from '../../../domain/entities/MessageFile'
import type { PaginatedData } from '../../../../shared/types'
import { GetMessageFileListUseCase, DeleteMessageFileUseCase } from '../../../domain/usecases/MessageFileUseCases'
import { MessageFileRepositoryImpl } from '../../../data/repositories/MessageFileRepositoryImpl'

const repo = new MessageFileRepositoryImpl()
const getListUseCase = new GetMessageFileListUseCase(repo)
const deleteUseCase = new DeleteMessageFileUseCase(repo)

interface State {
  data: MessageFile[]
  pagination: Omit<PaginatedData<MessageFile>, 'data'> | null
  loading: boolean
  error: string | null
  page: number
}

export function useMessageFileViewModel() {
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
      const message = err instanceof Error ? err.message : 'Erro ao carregar arquivos'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  const remove = useCallback(async (id: number) => {
    await deleteUseCase.execute(id)
    load(1)
  }, [load])

  return { ...state, reload: () => load(1), loadMore: () => load(state.page + 1), remove }
}
