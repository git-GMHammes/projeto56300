import type { IUserRepository } from '../repositories/IUserRepository'

export interface CreateUserCustomerInput {
  userId: string
  name: string
  cpf: string
  whatsapp: string
  mail: string
  phone?: string
  dateBirth?: string
  zipCode?: string
  address?: string
}

export interface CreateUserCustomerResult {
  customerId: string
}

export class CreateUserCustomerUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: CreateUserCustomerInput): Promise<CreateUserCustomerResult> {
    const { customerId } = await this.repo.createProfile({
      userId: input.userId,
      name: input.name.trim(),
      cpf: input.cpf.replace(/\D/g, ''),
      whatsapp: input.whatsapp.replace(/\D/g, ''),
      mail: input.mail.trim().toLowerCase(),
      phone: input.phone?.replace(/\D/g, ''),
      dateBirth: input.dateBirth,
      zipCode: input.zipCode?.replace(/\D/g, ''),
      address: input.address?.trim(),
    })
    return { customerId }
  }
}
