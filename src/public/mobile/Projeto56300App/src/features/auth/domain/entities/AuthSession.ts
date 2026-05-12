export interface AuthSessionUser {
  id: string
  um_uuid: string
  um_user: string
  um_is_active: string
  um_last_login: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  uc_id: string
  uc_user_id: string
  uc_name: string
  uc_cpf: string
  uc_whatsapp: string
  uc_profile: string
  uc_mail: string
  uc_phone: string
  uc_date_birth: string
  uc_zip_code: string
  uc_address: string
  uc_tenant_at: string
  uc_validity: string
  uc_created_at: string
  uc_updated_at: string
  uc_deleted_at: string | null
  uc_user_id_active: string
  ut_id: string
  ut_user_id: string
  ut_user_saas_tenants_id: string
  ut_role: string
  ut_created_at: string
  ut_deleted_at: string | null
}

export interface AuthSession {
  token: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  refreshExpiresIn: number
  user: AuthSessionUser
}
