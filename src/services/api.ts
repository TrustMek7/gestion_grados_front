/**
 * Cliente HTTP unificado para el Backend de Grados y Títulos UNSA.
 * Conecta con los endpoints bajo /api/v1 de Spring Boot (puerto 8080).
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || 'http://localhost:8080/api/v1'
export const TOKEN_STORAGE_KEY = 'unsa.auth-token'

export function isAutomatedTest(): boolean {
  if (typeof window === 'undefined') return true
  return Boolean(
    window.navigator.webdriver ||
    window.navigator.userAgent.includes('Playwright') ||
    window.location.port === '4173'
  )
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string) {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    /* Ignorar en modo restringido */
  }
}

export function clearStoredToken() {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    /* Ignorar en modo restringido */
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const token = getStoredToken()

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMsg = `Error HTTP ${response.status}`
    try {
      const errorData = await response.json()
      errorMsg = errorData.message || errorData.error || errorMsg
    } catch {
      /* fallback */
    }
    throw new ApiError(response.status, errorMsg)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

export const authApi = {
  me: () => request<{
    id: number
    email: string
    fullName: string
    googleSubject?: string
    role: string
    active: boolean
  }>('/auth/me'),
}

export const catalogsApi = {
  getSchools: () => request<Array<{ id: number; name: string; active?: boolean }>>('/catalogs/schools'),
  getModalities: () => request<Array<{ id: number; name: string; active?: boolean }>>('/catalogs/degree-modalities'),
  getStatuses: () => request<Array<{ id: number; name: string; active?: boolean }>>('/catalogs/expedient-statuses'),
  getTeachers: () => request<Array<{ id: number; documentNumber?: string; fullName: string; email?: string }>>('/catalogs/teachers'),
}

export const expedientsApi = {
  list: () => request<Array<{
    id: number
    number: string
    startDate: string
    graduateId: number
    modalityId?: number
    statusId?: number
    createdById?: number
    updatedById?: number
  }>>('/expedients'),

  detail: (id: number | string) => request<{
    summary: {
      id: number
      number: string
      startDate: string
      graduateId: number
      graduateName: string
      documentNumber?: string
      schoolId?: number
      schoolName?: string
      academicProgram?: string
      modalityId?: number
      modalityName?: string
      statusId?: number
      statusName?: string
      researchTitle?: string
      defenseDate?: string | null
      defenseResult?: string | null
      updatedAt?: string
    }
    resolutions: Array<{
      id: number
      number: string
      date?: string
      type?: string
      fileUrl?: string
    }>
    advisor?: {
      id: number
      teacherId: number
      teacherName: string
      resolutionId?: number
      resolutionNumber?: string
      assignedAt?: string
    } | null
    jury: Array<{
      id: number
      teacherId: number
      teacherName: string
      role: string
      resolutionId?: number
    }>
    draws: Array<{
      id: number
      date?: string
      resolutionId?: number
    }>
    defense?: {
      id: number
      date?: string
      result?: string
    } | null
  }>(`/expedients/${id}/detail`),

  search: (query: string) => request<Array<unknown>>(`/expedients/search?search=${encodeURIComponent(query)}`),

  create: (data: unknown) => request<{ id: number; number: string }>('/expedients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: number | string, data: unknown) => request<{ id: number }>(`/expedients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

export const dashboardApi = {
  getMetrics: (year?: number | string, schoolId?: number | string) => {
    const params = new URLSearchParams()
    if (year && year !== 'all') params.append('year', String(year))
    if (schoolId && schoolId !== 'all') params.append('schoolId', String(schoolId))
    const query = params.toString() ? `?${params.toString()}` : ''
    return request<{
      distribution: Record<string, number>
      observed: number
      defended: number
      active: number
      total: number
      upcoming: Array<unknown>
      recent: Array<unknown>
    }>(`/dashboard${query}`)
  },
}
