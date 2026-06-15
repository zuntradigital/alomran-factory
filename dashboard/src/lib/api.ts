import { auth } from './firebase'

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

/**
 * Authenticated fetch wrapper.
 * Always gets a fresh Firebase ID token (falls back to stored JWT).
 * Throws with a user-friendly message on non-2xx responses.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Prefer live Firebase token (always fresh) → fallback to cached JWT
  let token = ''
  try {
    token = (await auth.currentUser?.getIdToken()) ?? ''
  } catch { /* Firebase unavailable */ }
  if (!token) token = localStorage.getItem('token') ?? ''

  const url = endpoint.startsWith('http') ? endpoint : `${BASE}${endpoint}`

  let res: Response
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    })
  } catch {
    // Network-level failure (ECONNREFUSED, CORS, offline)
    throw new Error('network')
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      msg = body.error ?? msg
    } catch { /* non-JSON error body */ }
    throw new Error(msg)
  }

  return res.json() as Promise<T>
}

/** Convenience shortcuts */
export const apiGet    = (endpoint: string)                        => apiFetch(endpoint)
export const apiPost   = (endpoint: string, body: unknown)         => apiFetch(endpoint, { method: 'POST',   body: JSON.stringify(body) })
export const apiPut    = (endpoint: string, body: unknown)         => apiFetch(endpoint, { method: 'PUT',    body: JSON.stringify(body) })
export const apiDelete = (endpoint: string)                        => apiFetch(endpoint, { method: 'DELETE' })
