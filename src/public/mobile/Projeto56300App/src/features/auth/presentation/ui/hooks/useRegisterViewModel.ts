import { useState, useCallback } from 'react'
import { CreateUserManagementUseCase } from '../../../../usuario/domain/usecases/CreateUserManagementUseCase'
import { CreateUserCustomerUseCase } from '../../../../usuario/domain/usecases/CreateUserCustomerUseCase'
import { UploadUserFilesUseCase } from '../../../../usuario/domain/usecases/UploadUserFilesUseCase'
import { UserRepositoryImpl } from '../../../../usuario/data/repositories/UserRepositoryImpl'

const repo = new UserRepositoryImpl()
const createUserUseCase = new CreateUserManagementUseCase(repo)
const createProfileUseCase = new CreateUserCustomerUseCase(repo)
const uploadFilesUseCase = new UploadUserFilesUseCase(repo)

export type RegisterStep = 'access' | 'profile' | 'photo' | 'done'

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

interface PhotoForm {
  fileUri: string | null
}

interface RegisterState {
  step: RegisterStep
  access: AccessForm
  profile: ProfileForm
  photo: PhotoForm
  loading: boolean
  error: string | null
  userId: string | null
  customerId: string | null
}

export function useRegisterViewModel() {
  const [state, setState] = useState<RegisterState>({
    step: 'access',
    access: { username: '', password: '', confirmPassword: '' },
    profile: { name: '', mail: '', cpf: '', whatsapp: '', phone: '', dateBirth: '', zipCode: '', address: '' },
    photo: { fileUri: null },
    loading: false,
    error: null,
    userId: null,
    customerId: null,
  })

  const setAccessField = useCallback((name: keyof AccessForm, value: string) => {
    setState(prev => ({ ...prev, access: { ...prev.access, [name]: value }, error: null }))
  }, [])

  const setProfileField = useCallback((name: keyof ProfileForm, value: string) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, [name]: value }, error: null }))
  }, [])

  const setFileUri = useCallback((uri: string | null) => {
    setState(prev => ({ ...prev, photo: { fileUri: uri }, error: null }))
  }, [])

  const goBackToAccess = useCallback(() => {
    setState(prev => ({ ...prev, step: 'access', error: null }))
  }, [])

  const goBackToProfile = useCallback(() => {
    setState(prev => ({ ...prev, step: 'profile', error: null }))
  }, [])

  const submitAccess = useCallback(async (): Promise<void> => {
    const { username, password, confirmPassword } = state.access
    if (username.trim().length < 3) {
      setState(prev => ({ ...prev, error: 'Usuário deve ter ao menos 3 caracteres.' }))
      return
    }
    if (password.length < 8) {
      setState(prev => ({ ...prev, error: 'Senha deve ter ao menos 8 caracteres.' }))
      return
    }
    if (!/[A-Z]/.test(password)) {
      setState(prev => ({ ...prev, error: 'Senha deve conter ao menos uma letra maiúscula.' }))
      return
    }
    if (!/[0-9]/.test(password)) {
      setState(prev => ({ ...prev, error: 'Senha deve conter ao menos um número.' }))
      return
    }
    if (password !== confirmPassword) {
      setState(prev => ({ ...prev, error: 'As senhas não conferem.' }))
      return
    }
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { userId } = await createUserUseCase.execute({
        username: state.access.username,
        password: state.access.password,
      })
      setState(prev => ({ ...prev, loading: false, step: 'profile', userId, error: null }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta.'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [state.access])

  const submitProfile = useCallback(async (): Promise<void> => {
    if (!state.userId) return
    // Se perfil já foi salvo (usuário voltou do step photo), apenas avança
    if (state.customerId) {
      setState(prev => ({ ...prev, step: 'photo', error: null }))
      return
    }
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { customerId } = await createProfileUseCase.execute({
        userId: state.userId,
        name: state.profile.name,
        cpf: state.profile.cpf,
        whatsapp: state.profile.whatsapp,
        mail: state.profile.mail,
        phone: state.profile.phone || undefined,
        dateBirth: state.profile.dateBirth || undefined,
        zipCode: state.profile.zipCode || undefined,
        address: state.profile.address || undefined,
      })
      setState(prev => ({ ...prev, loading: false, step: 'photo', customerId, error: null }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar dados pessoais.'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [state.userId, state.customerId, state.profile])

  const submitPhoto = useCallback(async (): Promise<void> => {
    if (!state.userId || !state.photo.fileUri) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await uploadFilesUseCase.execute({ userId: state.userId, fileUri: state.photo.fileUri })
      setState(prev => ({ ...prev, loading: false, step: 'done', error: null }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar foto.'
      setState(prev => ({ ...prev, loading: false, error: message }))
    }
  }, [state.userId, state.photo.fileUri])

  const skipPhoto = useCallback(() => {
    setState(prev => ({ ...prev, step: 'done', error: null }))
  }, [])

  const isAccessValid =
    state.access.username.trim().length >= 3 &&
    state.access.password.length >= 8 &&
    /[A-Z]/.test(state.access.password) &&
    /[0-9]/.test(state.access.password) &&
    state.access.password === state.access.confirmPassword

  const isProfileValid =
    state.profile.name.trim().length > 0 &&
    state.profile.mail.trim().length > 0 &&
    state.profile.cpf.replace(/\D/g, '').length === 11 &&
    state.profile.whatsapp.replace(/\D/g, '').length >= 10

  return {
    ...state,
    setAccessField,
    setProfileField,
    setFileUri,
    goBackToAccess,
    goBackToProfile,
    submitAccess,
    submitProfile,
    submitPhoto,
    skipPhoto,
    isAccessValid,
    isProfileValid,
  }
}
