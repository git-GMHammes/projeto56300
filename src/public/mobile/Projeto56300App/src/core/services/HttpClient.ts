import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env'

const BASE = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL

type TokenReader = () => Promise<string | null>

let _tokenReader: TokenReader = async () => null

export function setTokenReader(reader: TokenReader): void {
  _tokenReader = reader
}

export interface ApiEnvelope<T = unknown> {
  method: string
  endpoint: string
  statusCode: number
  message: string
  success: boolean
  data?: T
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export async function httpClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await _tokenReader()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers, signal: controller.signal })
    clearTimeout(timer)
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new HttpError(json?.message ?? `HTTP ${res.status}`, res.status, json)
    }
    return json as T
  } finally {
    clearTimeout(timer)
  }
}

export async function httpClientRaw<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers, signal: controller.signal })
    clearTimeout(timer)
    return res.json() as Promise<ApiEnvelope<T>>
  } finally {
    clearTimeout(timer)
  }
}
