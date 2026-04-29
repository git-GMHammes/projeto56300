import type { IUserRepository, CreateUserPayload, CreateProfilePayload } from '../repositories/IUserRepository'
import { WeakPasswordError } from '../errors/UserErrors'

export type SaveUserMode = 'register' | 'admin'

export interface SaveUserInput {
  mode: SaveUserMode
  username: string
  password: string
  name: string
  cpf: string
  whatsapp: string
  mail: string
  phone?: string
  dateBirth?: string
  zipCode?: string
  address?: string
}

export interface SaveUserResult {
  userId: string
}

/**
 * UseCase unificado: atende tanto o fluxo público de Cadastro (Register)
 * quanto o fluxo interno de Gestão de Usuários (Admin Form).
 * A diferença entre os modos é controlada pelo campo `mode` no input.
 */
export class SaveUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: SaveUserInput): Promise<SaveUserResult> {
    if (input.password.length < 6) throw new WeakPasswordError()

    const userPayload: CreateUserPayload = {
      username: input.username.trim(),
      password: input.password,
    }

    const { id: userId } = await this.repo.createUser(userPayload)

    const profilePayload: CreateProfilePayload = {
      userId,
      name: input.name.trim(),
      cpf: input.cpf.replace(/\D/g, ''),
      whatsapp: input.whatsapp.replace(/\D/g, ''),
      mail: input.mail.trim().toLowerCase(),
      phone: input.phone?.replace(/\D/g, ''),
      dateBirth: input.dateBirth,
      zipCode: input.zipCode?.replace(/\D/g, ''),
      address: input.address?.trim(),
    }

    await this.repo.createProfile(profilePayload)

    return { userId }
  }
}
