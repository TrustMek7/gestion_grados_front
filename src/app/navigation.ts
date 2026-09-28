import { ChartNoAxesCombined, FolderOpen, LayoutDashboard, Settings, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ModuleDefinition {
  path: string
  label: string
  description: string
  icon: LucideIcon
  sections: string[]
}

export const modules: ModuleDefinition[] = [
  {
    path: '/expedientes', label: 'Expedientes', icon: FolderOpen,
    description: 'Registro, consulta y seguimiento de los expedientes de grados y títulos.',
    sections: ['Datos del graduando y del trámite', 'Asesores, jurados y resoluciones', 'Sustentaciones y actualización del expediente'],
  },
  {
    path: '/docentes', label: 'Docentes', icon: UsersRound,
    description: 'Consulta de la participación docente en los procesos de graduación y titulación.',
    sections: ['Consulta de docentes', 'Historial de asesorías', 'Participaciones como jurado'],
  },
  {
    path: '/reportes', label: 'Reportes', icon: ChartNoAxesCombined,
    description: 'Información estadística para la gestión administrativa y la acreditación.',
    sections: ['Estadísticas de grados y títulos', 'Participaciones y sorteos de jurados', 'Tesis sustentadas y exportación a Excel'],
  },
  {
    path: '/administracion', label: 'Administración', icon: Settings,
    description: 'Carga inicial de información histórica y administración de accesos al módulo.',
    sections: ['Carga histórica desde Excel', 'Validación y previsualización de registros', 'Control de accesos administrativos'],
  },
]

export const navigation = [
  { path: '/inicio', label: 'Inicio', icon: LayoutDashboard },
  ...modules,
]
