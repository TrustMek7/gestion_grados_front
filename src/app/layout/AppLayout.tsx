import { useEffect, useRef } from 'react'
import { ChevronRight, LogOut, Menu, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router'
import { brand } from '../../shared/config/brand'
import { Button } from '../../shared/ui/Button'
import { Badge } from '../../shared/ui/Badge'
import { navigation } from '../navigation'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../features/auth/auth-context'
import { mockUser } from '../../features/auth/mock-session'

export function AppLayout() {
  const { signOut } = useAuth()
  const { pathname } = useLocation()
  const drawer = useRef<HTMLDialogElement>(null)
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  const current = navigation.find((item) => item.path === pathname || pathname.startsWith(item.path + '/'))?.label ?? 'Página no encontrada'

  useEffect(() => {
    document.title = `${current} | ${brand.application} · ${brand.acronym}`
    if (previousPath.current !== pathname) {
      drawer.current?.close()
      main.current?.focus()
      window.scrollTo(0, 0)
      previousPath.current = pathname
    }
  }, [pathname, current])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)')
    const closeOnDesktop = () => { if (desktop.matches) drawer.current?.close() }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <div className="min-h-svh bg-canvas font-sans text-ink">
      <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-white p-3 text-brand shadow-lg focus:not-sr-only focus:fixed">Saltar al contenido principal</a>
      <aside className="fixed inset-y-0 left-0 hidden w-60 overflow-y-auto xl:block"><Sidebar /></aside>

      <dialog ref={drawer} aria-label="Menú de navegación" id="mobile-navigation"
        className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-72 max-w-[90vw] border-0 bg-brand p-0 text-white backdrop:bg-ink/40"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        onClick={(event) => { if (event.target === event.currentTarget) drawer.current?.close() }}>
        <div className="relative h-full overflow-y-auto">
          <button type="button" aria-label="Cerrar menú" onClick={() => drawer.current?.close()}
            className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-lg text-white/90 hover:bg-white/10 focus-visible:outline-white"><X size={20} aria-hidden="true" /></button>
          <Sidebar onNavigate={() => drawer.current?.close()} />
        </div>
      </dialog>

      <div className="flex min-h-svh min-w-0 flex-col xl:pl-60">
        <header className="sticky top-0 z-10 flex min-h-18 items-center justify-between gap-4 border-b border-outline bg-white/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" className="px-2 xl:hidden" aria-label="Abrir menú" aria-haspopup="dialog" aria-controls="mobile-navigation" onClick={() => drawer.current?.showModal()}><Menu size={22} aria-hidden="true" /></Button>
            <nav aria-label="Ruta de navegación" className="min-w-0 text-sm">
              <ol className="flex items-center gap-2 sm:gap-3">
                <li><Link to="/inicio" className="font-semibold text-brand">UNSA</Link></li>
                <li aria-hidden="true"><ChevronRight size={14} className="text-muted" /></li>
                <li aria-current="page" className="truncate font-medium">{current}</li>
              </ol>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden text-right lg:block"><p className="text-xs font-medium">{mockUser.name}</p><p className="mt-1 text-[11px] text-muted">Sesión simulada</p></div>
            <Badge>Demo</Badge>
            <Button variant="ghost" className="px-2" aria-label="Cerrar sesión" title="Cerrar sesión de demostración" onClick={signOut}><LogOut size={19} aria-hidden="true" /></Button>
          </div>
        </header>

        <main id="main-content" ref={main} tabIndex={-1} className="mx-auto w-full max-w-400 flex-1 p-4 outline-none sm:p-6 xl:p-8"><Outlet /></main>
        <footer className="mx-4 flex flex-wrap justify-between gap-2 border-t border-outline py-5 text-xs text-muted sm:mx-6 xl:mx-8">
          <span>{brand.acronym} · {brand.university}</span><span>Grados y Títulos</span>
        </footer>
      </div>
    </div>
  )
}
