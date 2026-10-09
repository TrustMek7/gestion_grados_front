import { createContext, useContext } from 'react'
import type { AuthState, LoginScenario } from './mock-session'

export const AuthContext = createContext<{
  state: AuthState
  signIn: (scenario: LoginScenario) => void
  signInWithGoogle: (credential: string) => Promise<void>
  signOut: () => void
} | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth requiere AuthProvider')
  return value
}
