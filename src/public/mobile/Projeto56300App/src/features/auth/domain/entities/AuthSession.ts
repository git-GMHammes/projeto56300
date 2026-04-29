export interface AuthSessionUser {
  id: string
  um_uuid: string
  um_user: string
  um_is_active: string
  uc_id: string
  uc_name: string
  uc_mail: string
  uc_cpf: string
  uc_whatsapp: string
  uc_profile: string
  ut_id: string
  ut_tenant_id: string
  ut_role: string
}

export interface AuthSession {
  token: string
  tokenType: string
  expiresIn: number
  user: AuthSessionUser
}
