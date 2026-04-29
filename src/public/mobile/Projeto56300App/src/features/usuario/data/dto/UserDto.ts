export interface UserDto {
  id: string
  um_uuid: string
  um_user: string
  um_is_active: string | number
  created_at: string
  updated_at: string
}

export interface PaginatedUserDto {
  data: UserDto[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}
