export interface AuthUserDto {
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
  ut_user_saas_tenants_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthUserGroupDto {
  letter: string
  items: AuthUserDto[]
}

export interface PaginatedAuthUserDto {
  data: AuthUserDto[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}
