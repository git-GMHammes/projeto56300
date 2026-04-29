export interface AuthUser {
  id: number
  um_user: string
  um_is_active: number
  uc_name: string
  uc_cpf: string | null
  uc_mail: string
  uc_whatsapp: string | null
  uc_phone: string | null
  uc_address: string | null
  uc_profile: string | null
  uc_zip_code: string | null
  ut_tenant_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthUserGroup {
  letter: string
  items: AuthUser[]
}
