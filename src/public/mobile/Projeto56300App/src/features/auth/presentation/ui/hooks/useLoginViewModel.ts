import { useState, useCallback } from 'react'
import { LoginUseCase } from '../../../domain/usecases/LoginUseCase'
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl'
import { HttpError } from '../../../../../core/services/HttpClient'
import type { AuthSession } from '../../../domain/entities/AuthSession'

const loginUseCase = new LoginUseCase(new AuthRepositoryImpl())

interface LoginForm {
  username: string
  password: string
  tenantId: string
}

interface LoginState {
  form: LoginForm
  loading: boolean
  error: string | null
  session: AuthSession | null
}

export function useLoginViewModel() {
  const [state, setState] = useState<LoginState>({
    form: { username: '', password: '', tenantId: '2' },
    loading: false,
    error: null,
    session: null,
  })

  const setField = useCallback((name: keyof LoginForm, value: string) => {
    setState(prev => ({ ...prev, form: { ...prev.form, [name]: value }, error: null }))
  }, [])

  const submit = useCallback(async (): Promise<AuthSession | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const session = await loginUseCase.execute({
        um_user: state.form.username.trim(),
        um_password: state.form.password,
        ut_user_saas_tenants_id: state.form.tenantId,
      })
      setState(prev => ({ ...prev, loading: false, session }))
      return session
    } catch (err) {
      let message = 'Erro ao fazer login.'
      if (err instanceof HttpError && err.statusCode === 429) {
        const retryAfter = (err.body as Record<string, unknown>)?.retry_after
        message = typeof retryAfter === 'number'
          ? `Muitas tentativas. Aguarde ${retryAfter} segundos.`
          : 'Muitas tentativas de login. Aguarde 1 minuto e tente novamente.'
      } else if (err instanceof Error) {
        message = err.message
      }
      setState(prev => ({ ...prev, loading: false, error: message }))
      return null
    }
  }, [state.form])

  const isFormValid =
    state.form.username.trim().length > 0 && state.form.password.length >= 6

  return { ...state, setField, submit, isFormValid }
}
