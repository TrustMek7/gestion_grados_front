import { useState } from 'react'
import { ArrowRight, ChartNoAxesCombined, CircleAlert, ClipboardList, FileCheck2, FolderOpen, GraduationCap, RotateCcw, UsersRound } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { PageHeader } from '../../shared/ui/PageHeader'
import { SelectField } from '../../shared/ui/SelectField'
import { referenceDate } from './dashboard.mock'
import { useDossiers } from '../expedientes/dossier-context'
import { formatDate, summarizeDossiers } from './dashboard-model'
import { StatCard } from './components/StatCard'
import { StatusDistribution } from './components/StatusDistribution'
import { UpcomingDefenses } from './components/UpcomingDefenses'
import { RecentDossiers } from './components/RecentDossiers'

const shortcuts = [
  { label: 'Reporte de graduados', description: 'Estadísticas y acreditación', icon: ChartNoAxesCombined, path: '/reportes' },
  { label: 'Participación docente', description: 'Asesorías y jurados', icon: UsersRound, path: '/docentes' },
  { label: 'Consulta de expedientes', description: 'Información del trámite', icon: FolderOpen, path: '/expedientes' },
]

export function DashboardPage() {
  const { records: allRecords } = useDossiers()
  const schools = [...new Set(allRecords.map((item) => item.school))].sort((a, b) => a.localeCompare(b, 'es'))
  const years = [...new Set(allRecords.map((item) => item.openedAt.slice(0, 4)))].sort().reverse()
  const [year, setYear] = useState('2026')
  const [school, setSchool] = useState('all')
  const records = allRecords.filter((item) => (year === 'all' || item.openedAt.startsWith(year)) && (school === 'all' || item.school === school))
  const stats = summarizeDossiers(records, referenceDate)

  return (
    <div className="space-y-6">
      <PageHeader title="Panel de control" description="Resumen de expedientes, estados y sustentaciones de Grados y Títulos." action={<Badge>Datos de demostración</Badge>} />
      <Card className="p-4 sm:p-5">
        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]">
          <SelectField label="Año de ingreso" value={year} onChange={(event) => setYear(event.target.value)}><option value="all">Todos los años</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}</SelectField>
          <SelectField label="Escuela profesional" value={school} onChange={(event) => setSchool(event.target.value)}><option value="all">Todas las escuelas</option>{schools.map((value) => <option key={value} value={value}>{value}</option>)}</SelectField>
          <Button variant="secondary" onClick={() => { setYear('2026'); setSchool('all') }}><RotateCcw size={16} aria-hidden="true" />Restablecer filtros</Button>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">Corte de demostración: {formatDate(referenceDate)}. Los filtros se aplican a todo el panel; los datos y nombres son ficticios.</p>
      </Card>

      <section aria-label="Indicadores de expedientes" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Expedientes registrados" value={stats.total} description="Total para el año y escuela seleccionados" icon={ClipboardList} />
        <StatCard title="Expedientes activos" value={stats.active} description="Registrados, en trámite y observados" icon={FolderOpen} />
        <StatCard title="Expedientes observados" value={stats.observed} description="Expedientes que requieren revisión" icon={CircleAlert} attention />
        <StatCard title="Expedientes sustentados" value={stats.defended} description="Con fecha de sustentación hasta el corte" icon={GraduationCap} />
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <StatusDistribution records={records} />
        <UpcomingDefenses records={records} referenceDate={referenceDate} />
      </div>
      <Card className="p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><FileCheck2 size={20} className="text-brand" aria-hidden="true" />Accesos rápidos</h2>
            <p className="mt-1 text-xs leading-5 text-muted">Expedientes disponible en modo demo. Docentes y reportes están en preparación.</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-3">{shortcuts.map(({ label, description, icon: Icon, path }) => <li key={label}><Link to={path} className="flex h-full items-center gap-3 rounded-lg border border-outline p-3 hover:bg-brand-soft/30"><Icon size={18} className="shrink-0 text-brand" aria-hidden="true" /><span className="flex-1"><span className="block text-sm font-medium">{label}</span><span className="mt-1 block text-xs text-muted">{description}</span></span><ArrowRight size={16} className="shrink-0 text-muted" aria-hidden="true" /></Link></li>)}</ul>
      </Card>

      <RecentDossiers key={`${year}-${school}`} records={records} />
    </div>
  )
}
