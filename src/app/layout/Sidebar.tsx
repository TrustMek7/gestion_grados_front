import { NavLink } from 'react-router'
import { GraduationCap } from 'lucide-react'
import { Brand } from '../../shared/ui/Brand'
import { navigation } from '../navigation'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-brand text-white">
      <div className="bg-brand-hover/60 px-6 py-7"><Brand /></div>
      <nav aria-label="Navegación principal" className="flex-1 px-3 py-7">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-widest text-white/70 uppercase">Módulos principales</p>
        <ul className="space-y-1">
          {navigation.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink to={path} end={path === '/inicio'} onClick={onNavigate}
                className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-lg border-l-3 px-3 text-sm transition-colors focus-visible:outline-white ${isActive ? 'border-white bg-brand-hover font-semibold text-white' : 'border-transparent text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={19} aria-hidden="true" />{label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-3 border-t border-white/15 px-6 py-5 text-white/80">
        <GraduationCap size={22} aria-hidden="true" />
        <p className="text-xs leading-5">Gestión de Grados y Títulos<br /><span className="text-white/60">Plataforma administrativa</span></p>
      </div>
    </div>
  )
}
