// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = '/api/v1/mecanica/vehicle-brand'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface VehicleBrand {
  id: number
  name: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleBrandGroup {
  letter: string
  items: VehicleBrand[]
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface FindParams {
  search?: string
  page?: number
  per_page?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
  [key: string]: unknown
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function http<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.message ?? `HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * POST /find
 * Busca paginada com filtros.
 */
export async function find(
  params: FindParams,
): Promise<PaginatedResponse<VehicleBrand>> {
  return http(`${BASE}/find`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

/**
 * POST /get-grouped
 * Retorna marcas agrupadas (ex: por letra inicial).
 */
export async function getGrouped(
  params?: Record<string, unknown>,
): Promise<VehicleBrandGroup[]> {
  return http(`${BASE}/get-grouped`, {
    method: 'POST',
    body: JSON.stringify(params ?? {}),
  })
}

/**
 * GET /search?q=...
 * Busca rápida pelo termo informado.
 */
export async function search(q: string): Promise<VehicleBrand[]> {
  const url = new URL(`${BASE}/search`, window.location.origin)
  url.searchParams.set('q', q)
  return http(url.toString())
}

/**
 * GET /get/:id
 * Retorna uma marca pelo ID.
 */
export async function getById(id: number): Promise<VehicleBrand> {
  return http(`${BASE}/get/${id}`)
}

/**
 * GET /get-all
 * Retorna todas as marcas (sem paginação, sem deletados).
 */
export async function getAll(): Promise<VehicleBrand[]> {
  return http(`${BASE}/get-all`)
}

/**
 * GET /get-no-pagination
 * Retorna todas as marcas ativas sem paginação.
 */
export async function getNoPagination(): Promise<VehicleBrand[]> {
  return http(`${BASE}/get-no-pagination`)
}

/**
 * GET /get-deleted/:id
 * Retorna um registro soft-deletado pelo ID.
 */
export async function getDeleted(id: number): Promise<VehicleBrand> {
  return http(`${BASE}/get-deleted/${id}`)
}

/**
 * GET /get-deleted-all
 * Retorna todos os registros soft-deletados.
 */
export async function getDeletedAll(): Promise<VehicleBrand[]> {
  return http(`${BASE}/get-deleted-all`)
}

/**
 * GET /get-with-deleted/:id
 * Retorna um registro incluindo soft-deletados.
 */
export async function getWithDeleted(id: number): Promise<VehicleBrand> {
  return http(`${BASE}/get-with-deleted/${id}`)
}

/**
 * POST /create
 * Cria uma nova marca.
 */
export async function create(
  payload: Omit<VehicleBrand, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>,
): Promise<ApiResponse<VehicleBrand>> {
  return http(`${BASE}/create`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * PUT /update/:id
 * Atualiza uma marca existente.
 */
export async function update(
  id: number,
  payload: Partial<Omit<VehicleBrand, 'id' | 'deleted_at' | 'created_at' | 'updated_at'>>,
): Promise<ApiResponse<VehicleBrand>> {
  return http(`${BASE}/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * DELETE /delete-soft/:id
 * Soft-delete de uma marca (marca como deletada).
 */
export async function deleteSoft(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/delete-soft/${id}`, { method: 'DELETE' })
}

/**
 * PATCH /delete-restore/:id
 * Restaura um soft-delete.
 */
export async function deleteRestore(id: number): Promise<ApiResponse<VehicleBrand>> {
  return http(`${BASE}/delete-restore/${id}`, { method: 'PATCH' })
}

/**
 * DELETE /delete-hard/:id
 * Remoção permanente de uma marca.
 */
export async function deleteHard(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/delete-hard/${id}`, { method: 'DELETE' })
}

/**
 * DELETE /clear-deleted
 * Remove permanentemente todos os registros soft-deletados.
 */
export async function clearDeleted(): Promise<ApiResponse<null>> {
  return http(`${BASE}/clear-deleted`, { method: 'DELETE' })
}

/**
 * DELETE /clear-deleted/:id
 * Remove permanentemente um registro soft-deletado específico.
 */
export async function clearDeletedById(id: number): Promise<ApiResponse<null>> {
  return http(`${BASE}/clear-deleted/${id}`, { method: 'DELETE' })
}
