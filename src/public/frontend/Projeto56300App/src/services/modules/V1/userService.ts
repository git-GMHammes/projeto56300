// services/modules/V1/userService.ts
import { APP_BASE_HOST, APP_VERSION } from '../../../config/constants'

const BASE = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}`

export interface UserManagementPayload {
  user: string
  password: string
}

export interface UserCustomerPayload {
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

export async function createUserManagement(payload: UserManagementPayload) {
  const response = await fetch(`${BASE}/user-management/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, is_active: '0' }),
  })
  return response.json()
}

export async function createUserCustomer(payload: UserCustomerPayload) {
  const response = await fetch(`${BASE}/user-customer/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return response.json()
}
