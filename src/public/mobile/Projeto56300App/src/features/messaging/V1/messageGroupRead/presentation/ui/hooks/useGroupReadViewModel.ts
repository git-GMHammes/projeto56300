import { useState, useCallback } from 'react'
import { MarkReadUseCase } from '../../../domain/usecases/GroupReadUseCases'
import { GroupReadRepositoryImpl } from '../../../data/repositories/GroupReadRepositoryImpl'

const repo = new GroupReadRepositoryImpl()
const markReadUseCase = new MarkReadUseCase(repo)

interface State {
  marking: boolean
  error: string | null
}

export function useGroupReadViewModel() {
  const [state, setState] = useState<State>({ marking: false, error: null })

  const markRead = useCallback(async (groupId: number, userId: number, lastReadId: number) => {
    setState({ marking: true, error: null })
    try {
      await markReadUseCase.execute({ group_id: groupId, user_id: userId, last_read_id: lastReadId })
      setState({ marking: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao marcar como lido'
      setState({ marking: false, error: message })
    }
  }, [])

  return { ...state, markRead }
}
