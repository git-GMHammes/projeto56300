import { useState, useCallback } from 'react'
import { RecoverPasswordUseCase } from '../../../domain/usecases/RecoverPasswordUseCase'
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl'

const recoverUseCase = new RecoverPasswordUseCase(new AuthRepositoryImpl())

export function useForgotPasswordViewModel() {
  const [mail, setMail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const submit = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await recoverUseCase.execute({ uc_mail: mail.trim().toLowerCase() })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar e-mail.')
    } finally {
      setLoading(false)
    }
  }, [mail])

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())

  return { mail, setMail, loading, error, sent, submit, isValid }
}
