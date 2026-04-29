import { useState, useCallback } from 'react'
import { SaveUserUseCase } from '../../../../usuario/domain/usecases/SaveUserUseCase'
import { UserRepositoryImpl } from '../../../../usuario/data/repositories/UserRepositoryImpl'

const saveUserUseCase = new SaveUserUseCase(new UserRepositoryImpl())

export type RegisterStep = 'access' | 'profile' | 'done'

interface AccessForm {
  username: string
  password: string
  confirmPassword: string
}

interface ProfileForm {
  name: string
  mail: string
  cpf: string
  whatsapp: string
  phone: string
  dateBirth: string
  zipCode: string
  address: string
}

interface RegisterState {
  step: RegisterStep
  access: AccessForm
  profile: ProfileForm
  loading: boolean
  error: string | null
  userId: string | null
}

export function useRegisterViewModel() {
  const [state, setState] = useState<RegisterState>({
    step: 'access',
    access: { username: '', password: '', confirmPassword: '' },
    profile: { name: '', mail: '', cpf: '', whatsapp: '', phone: '', dateBirth: '', zipCode: '', address: '' },
    loading: false,
    error: null,
    userId: null,
  })

  const setAccessField = useCallback((name: keyof AccessForm, value: string) => {
    setState(prev => ({ ...prev, access: { ...prev.access, [name]: value }, error: null }))
  }, [])

  const setProfileField = useCallback((name: keyof ProfileForm, value: string) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, [name]: value }, error: null }))
  }, [])

  const goToProfile = useCallback(() => {
    const { username, password, confirmPassword } = state.access
    if (username.trim().length < 3) {
      setState(prev => ({ ...prev, error: 'Usuário deve ter ao menos 3 caracteres.' }))
      return
    }
    if (password.length < 6) {
      setState(prev => ({ ...prev, error: 'Senha deve ter ao menos 6 caracteres.' }))
      return
    }
    if (password !== confirmPassword) {
      setState(prev => ({ ...prev, error: 'As senhas não conferem.' }))
      return
    }
    setState(prev => ({ ...prev, step: 'profile', error: null }))
  }, [state.access])

  const submit = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await saveUserUseCase.execute({
        mode: 'register',
        username: state.access.username,
        password: state.access.password,
        name: state.profile.name,
        mail: state.profile.mail,
        cpf: state.profile.cpf,
        whatsapp: state.profile.whatsapp,
        phone: state.profile.phone || undefined,
        dateBirth: state.profile.dateBirth || undefined,
        zipCode: state.profile.zipCode || undefined,
        address: state.profile.address || undefined,
      })
      setState(prev => ({ ...prev, loading: false, step: 'done', userId: result.userId }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar cadastro.'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [state.access, state.profile])

  const isAccessValid =
    state.access.username.trim().length >= 3 &&
    state.access.password.length >= 6 &&
    state.access.password === state.access.confirmPassword

  const isProfileValid =
    state.profile.name.trim().length > 0 &&
    state.profile.mail.trim().length > 0 &&
    state.profile.cpf.replace(/\D/g, '').length === 11 &&
    state.profile.whatsapp.replace(/\D/g, '').length >= 10

  return { ...state, setAccessField, setProfileField, goToProfile, submit, isAccessValid, isProfileValid }
}
