export interface LoginRequestDto {
  um_user: string
  um_password: string
  ut_tenant_id: string
}

export interface SessionUserDto {
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
  ut_id: string
  ut_tenant_id: string
  ut_role: string
  ut_deleted_at: string | null
}

export interface LoginResponseDto {
  token: string
  token_type: string
  expires_in: number
  user: SessionUserDto
}
