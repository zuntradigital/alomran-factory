const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('alomran_token')

const headers = (auth = false): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(auth && { Authorization: `Bearer ${getToken()}` }),
})

// ── PRODUCTS ──────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params?: { category?: string; featured?: boolean; search?: string }) => {
    const q = new URLSearchParams()
    if (params?.category) q.set('category', params.category)
    if (params?.featured) q.set('featured', 'true')
    if (params?.search)   q.set('search', params.search)
    return fetch(`${BASE}/products?${q}`).then(r => r.json())
  },
  getOne: (code: string) => fetch(`${BASE}/products/${code}`).then(r => r.json()),
  create: (data: object) => fetch(`${BASE}/products`, { method:'POST', headers:headers(true), body:JSON.stringify(data) }).then(r => r.json()),
  update: (id: string, data: object) => fetch(`${BASE}/products/${id}`, { method:'PUT', headers:headers(true), body:JSON.stringify(data) }).then(r => r.json()),
  delete: (id: string) => fetch(`${BASE}/products/${id}`, { method:'DELETE', headers:headers(true) }).then(r => r.json()),
}

// ── INQUIRIES ─────────────────────────────────────────────────
export const inquiriesAPI = {
  submit: (data: object) => fetch(`${BASE}/inquiries`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(r => r.json()),
  getAll: (status?: string) => {
    const q = status ? `?status=${status}` : ''
    return fetch(`${BASE}/inquiries${q}`, { headers:headers(true) }).then(r => r.json())
  },
  getStats: () => fetch(`${BASE}/inquiries/stats`, { headers:headers(true) }).then(r => r.json()),
  updateStatus: (id: string, status: string) => fetch(`${BASE}/inquiries/${id}/status`, { method:'PUT', headers:headers(true), body:JSON.stringify({ status }) }).then(r => r.json()),
}

// ── PROJECTS ──────────────────────────────────────────────────
export const projectsAPI = {
  getAll: () => fetch(`${BASE}/projects`).then(r => r.json()),
}

// ── AUTH ──────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, { method:'POST', headers:headers(), body:JSON.stringify({email,password}) }).then(r => r.json()),
  getMe: () => fetch(`${BASE}/auth/me`, { headers:headers(true) }).then(r => r.json()),
}
