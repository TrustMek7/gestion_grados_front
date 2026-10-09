import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth-context'
import { clearMockSession, readMockSession, saveMockSession, sessionDuration } from './mock-session'
import type { AuthState, LoginScenario } from './mock-session'
import { authApi, clearStoredToken, setStoredToken } from '../../services/api'
import { decodeJwt } from '../../services/googleAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readMockSession)
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null)

  const signOut = useCallback(() => {
    if (pending.current) clearTimeout(pending.current)
    pending.current = null
    clearStoredToken()
    clearMockSession()
    setState({ status: 'anonymous' })
  }, [])

  const signInWithGoogle = useCallback(async (credential: string) => {
    if (pending.current) clearTimeout(pending.current)
    setState({ status: 'authenticating' })
    try {
      setStoredToken(credential)
      const decoded = decodeJwt(credential)
      let fullName = decoded.name || 'Usuario UNSA'
      let email = decoded.email || 'usuario@unsa.edu.pe'
      let role = 'ADMIN_GT'

      try {
        const backendUser = await authApi.me()
        if (backendUser) {
          fullName = backendUser.fullName || fullName
          email = backendUser.email || email
          role = backendUser.role || role
        }
      } catch {
        /* Si el backend no tiene endpoint o devuelve error temporal, usamos el perfil decodificado del JWT */
      }

      const expiresAt = Date.now() + sessionDuration
      const user = { name: fullName, email, role }
      saveMockSession(expiresAt, user)
      setState({ status: 'authenticated', expiresAt, user })
    } catch {
      clearStoredToken()
      clearMockSession()
      setState({ status: 'error' })
    }
  }, [])

  const signIn = useCallback((scenario: LoginScenario) => {
    if (pending.current) return
    clearMockSession()
    setState({ status: 'authenticating' })
    pending.current = setTimeout(() => {
      pending.current = null
      if (scenario !== 'authorized') {
        setState({ status: scenario })
        return
      }
      const expiresAt = Date.now() + sessionDuration
      saveMockSession(expiresAt)
      setState({ status: 'authenticated', expiresAt })
    }, 600)
  }, [])

  useEffect(() => () => { if (pending.current) clearTimeout(pending.current) }, [])

  useEffect(() => {
    if (state.status !== 'authenticated') return
    const expire = () => {
      if (Date.now() >= state.expiresAt) {
        clearMockSession()
        setState({ status: 'expired' })
      }
    }
    const timer = setTimeout(expire, Math.min(Math.max(0, state.expiresAt - Date.now()), 2_147_483_647))
    window.addEventListener('focus', expire)
    return () => { clearTimeout(timer); window.removeEventListener('focus', expire) }
  }, [state])

  return <AuthContext.Provider value={{ state, signIn, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

