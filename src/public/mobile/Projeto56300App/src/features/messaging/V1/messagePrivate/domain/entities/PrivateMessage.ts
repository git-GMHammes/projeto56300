export interface PrivateMessage {
  id: number
  tenant_id: number
  sender_id: number
  receiver_id: number
  content: string | null
  read_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreatePrivateMessagePayload {
  tenant_id: number
  sender_id: number
  receiver_id: number
  content?: string
}

export interface UpdatePrivateMessagePayload {
  content?: string
  read_at?: string
}
