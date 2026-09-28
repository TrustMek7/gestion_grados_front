export type LoginScenario = 'authorized' | 'denied' | 'error' | 'expired'
export type AuthState =
  | { status: 'anonymous' | 'authenticating' | 'denied' | 'error' | 'expired' }
  | { status: 'authenticated'; expiresAt: number }

export const mockUser = { name: 'Administrativo de demostración', email: 'administrativo@demo.invalid' }
export const sessionKey = 'unsa.mock-session'
export const sessionDuration = 30 * 60 * 1000

// Solo persiste una sesión de demostración; no representa una autorización real.
export function readMockSession(): AuthState {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(sessionKey) ?? 'null')
    if (typeof value !== 'object' || value === null || !('expiresAt' in value)
      || typeof value.expiresAt !== 'number' || !Number.isFinite(value.expiresAt)) return { status: 'anonymous' }
    if (value.expiresAt <= Date.now()) {
      clearMockSession()
      return { status: 'expired' }
    }
    return { status: 'authenticated', expiresAt: value.expiresAt }
  } catch { return { status: 'anonymous' } }
}

export function saveMockSession(expiresAt: number) {
  try { sessionStorage.setItem(sessionKey, JSON.stringify({ expiresAt })) } catch { /* Sin almacenamiento, la demo dura hasta recargar. */ }
}

export function clearMockSession() {
  try { sessionStorage.removeItem(sessionKey) } catch { /* El estado en memoria se limpia igualmente. */ }
}
