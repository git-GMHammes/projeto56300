export interface CreateUserManagementDto {
  user: string
  password: string
  is_active: string
}

export interface CreateUserManagementResponseDto {
  id: string
  [key: string]: unknown
}

export interface CreateUserCustomerDto {
  user_management_id: string
  name: string
  cpf: string
  whatsapp: string
  mail: string
  phone?: string
  date_birth?: string
  zip_code?: string
  address?: string
}

export interface CreateUserCustomerResponseDto {
  id: string
  [key: string]: unknown
}
