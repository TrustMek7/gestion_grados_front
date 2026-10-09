/**
 * Integración con Google Identity Services (GIS).
 * Permite iniciar sesión oficial con cuentas institucionales UNSA (@unsa.edu.pe).
 */

import { isAutomatedTest } from './api'

export const GOOGLE_CLIENT_ID = '1057211665863-ltc8etssds12rvru95v9nn61ene5rqeb.apps.googleusercontent.com'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon'
              theme?: 'outline' | 'filled_blue' | 'filled_black'
              size?: 'large' | 'medium' | 'small'
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
              shape?: 'rectangular' | 'pill' | 'circle' | 'square'
              logo_alignment?: 'left' | 'center'
              width?: number | string
              locale?: string
            }
          ) => void
          prompt: () => void
        }
      }
    }
  }
}

export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve) => {
    if (isAutomatedTest()) {
      resolve()
      return
    }

    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      resolve()
      return
    }

    const existing = document.getElementById('google-jssdk')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.id = 'google-jssdk'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export function decodeJwt(token: string): { email?: string; name?: string; sub?: string; picture?: string } {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return {}
  }
}
