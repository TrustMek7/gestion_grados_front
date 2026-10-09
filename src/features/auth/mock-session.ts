export type LoginScenario = 'authorized' | 'denied' | 'error' | 'expired'
export type AuthUser = {
  name: string
  email: string
  role?: string
}

export type AuthState =
  | { status: 'anonymous' | 'authenticating' | 'denied' | 'error' | 'expired' }
  | { status: 'authenticated'; expiresAt: number; user?: AuthUser }

export const mockUser = { name: 'Administrativo de demostración', email: 'administrativo@demo.invalid' }
export const sessionKey = 'unsa.mock-session'
export const sessionDuration = 30 * 60 * 1000

export function readMockSession(): AuthState {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(sessionKey) ?? 'null')
    if (typeof value !== 'object' || value === null || !('expiresAt' in value)
      || typeof value.expiresAt !== 'number' || !Number.isFinite(value.expiresAt)) return { status: 'anonymous' }
    if (value.expiresAt <= Date.now()) {
      clearMockSession()
      return { status: 'expired' }
    }
    const user = 'user' in value && typeof value.user === 'object' && value.user !== null ? value.user as AuthUser : undefined
    return { status: 'authenticated', expiresAt: value.expiresAt, user }
  } catch { return { status: 'anonymous' } }
}

export function saveMockSession(expiresAt: number, user?: AuthUser) {
  try { sessionStorage.setItem(sessionKey, JSON.stringify({ expiresAt, user })) } catch { /* Sin almacenamiento, la demo dura hasta recargar. */ }
}

export function clearMockSession() {
  try {
    sessionStorage.removeItem(sessionKey)
    sessionStorage.removeItem('unsa.auth-token')
  } catch { /* El estado en memoria se limpia igualmente. */ }
}

