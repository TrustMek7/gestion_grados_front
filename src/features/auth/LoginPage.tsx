import { useEffect, useRef, useState } from 'react'
import { CircleAlert, FlaskConical, GraduationCap, LoaderCircle, LogIn, ShieldCheck } from 'lucide-react'
import { Navigate, useLocation } from 'react-router'
import { brand } from '../../shared/config/brand'
import { Button } from '../../shared/ui/Button'
import { useAuth } from './auth-context'
import type { LoginScenario } from './mock-session'
import { GOOGLE_CLIENT_ID, loadGoogleScript } from '../../services/googleAuth'
import { isAutomatedTest } from '../../services/api'

const messages = {
  denied: { title: 'Acceso no autorizado', description: 'Esta cuenta de demostración no tiene permiso para acceder al módulo. Selecciona el escenario de acceso autorizado para continuar.' },
  error: { title: 'No se pudo iniciar sesión', description: 'Se ha simulado un error de autenticación. Puedes volver a intentar con el escenario de acceso autorizado.' },
  expired: { title: 'Tu sesión ha vencido', description: 'Inicia sesión nuevamente para continuar en la plataforma.' },
}

function returnPath(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('from' in value) || typeof value.from !== 'string') return '/inicio'
  const path = value.from
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && !path.startsWith('/login') ? path : '/inicio'
}

export function LoginPage() {
  const { state, signIn, signInWithGoogle } = useAuth()
  const location = useLocation()
  const [scenario, setScenario] = useState<LoginScenario>('authorized')
  const [googleReady, setGoogleReady] = useState(false)
  const googleBtnRef = useRef<HTMLDivElement>(null)
  const pending = state.status === 'authenticating'
  const message = state.status === 'denied' || state.status === 'error' || state.status === 'expired' ? messages[state.status] : null

  useEffect(() => { document.title = `Acceso institucional | ${brand.acronym}` }, [])

  useEffect(() => {
    // Solo carga Google Identity Services en entorno real de navegador (no en test automatizado)
    if (isAutomatedTest()) return
    let mounted = true
    loadGoogleScript().then(() => {
      if (!mounted) return
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              void signInWithGoogle(response.credential)
            }
          },
          auto_select: false,
        })
        googleBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          locale: 'es',
        })
        setGoogleReady(true)
      }
    }).catch(() => { /* Sin conexión a internet o bloqueador de scripts */ })
    return () => { mounted = false }
  }, [signInWithGoogle])

  if (state.status === 'authenticated') return <Navigate to={returnPath(location.state)} replace />

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-canvas px-4 py-10 sm:py-14">
      <section aria-labelledby="login-title" className="w-full max-w-120 overflow-hidden rounded-xl border border-outline bg-white shadow-lg shadow-brand/5">
        <div className="h-1.5 bg-brand" />
        <div className="p-6 sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-xl bg-brand-soft/60 text-brand"><GraduationCap size={32} aria-hidden="true" /></div>
            <p className="text-3xl font-bold tracking-wider text-brand">{brand.acronym}</p>
            <p className="mt-2 text-xs leading-5 text-muted">{brand.university}</p>
            <div className="my-6 h-px bg-outline" />
            <p className="mb-2 text-[11px] font-medium tracking-widest text-muted uppercase">Acceso institucional</p>
            <h1 id="login-title" className="text-2xl leading-8 font-semibold tracking-tight">{brand.application}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">Acceso exclusivo para el personal administrativo autorizado del área.</p>
          </div>

          {message && <div role="alert" className={`mt-6 flex gap-3 rounded-lg p-4 text-sm ${state.status === 'expired' ? 'bg-warning-soft text-warning' : 'bg-danger-soft text-danger'}`}>
            <CircleAlert size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div><h2 className="font-semibold">{message.title}</h2><p className="mt-1 text-xs leading-5">{message.description}</p></div>
          </div>}

          <div className="mt-7 space-y-3">
            {/* Botón de Google oficial si está disponible */}
            {googleReady && (
              <div className="flex justify-center w-full min-h-[44px]">
                <div ref={googleBtnRef} className="w-full flex justify-center" />
              </div>
            )}

            {/* Botón estándar del sistema */}
            <Button
              className="w-full"
              disabled={pending}
              onClick={() => {
                if (googleReady && window.google?.accounts?.id) {
                  window.google.accounts.id.prompt()
                } else {
                  signIn(scenario)
                }
              }}
            >
              {pending ? <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
              {pending ? 'Iniciando sesión…' : 'Continuar con Google'}
            </Button>

            <p role="status" className="mt-3 text-center text-xs leading-5 text-muted">
              {pending ? 'Validando el acceso de demostración…' : 'Acceso simulado. No se conecta con Google ni utiliza una cuenta real.'}
            </p>
          </div>



          <div className="mt-6 flex gap-3 rounded-lg bg-brand-soft/40 p-4 text-muted">
            <ShieldCheck size={19} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <p className="text-xs leading-5">El módulo está destinado al personal administrativo. Los estudiantes y docentes se registran como parte de los expedientes.</p>
          </div>

          <details className="mt-6 border-t border-outline pt-5">
            <summary className="cursor-pointer text-xs font-medium text-brand">Escenarios de demostración</summary>
            <label htmlFor="login-scenario" className="mt-4 block text-xs font-medium text-muted">Resultado del acceso simulado</label>
            <select id="login-scenario" value={scenario} disabled={pending} onChange={(event) => setScenario(event.target.value as LoginScenario)} className="mt-2 min-h-11 w-full rounded-lg border border-outline bg-canvas px-3 text-sm disabled:opacity-50">
              <option value="authorized">Acceso autorizado</option>
              <option value="denied">Acceso denegado</option>
              <option value="error">Error de autenticación</option>
              <option value="expired">Sesión vencida</option>
            </select>
          </details>
        </div>
      </section>
      <footer className="mt-6 flex max-w-120 items-start gap-2 text-xs leading-5 text-muted"><FlaskConical size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><p>Prototipo de interfaz · UNSA<br />Los accesos y la sesión son de demostración.</p></footer>
    </main>
  )
}
