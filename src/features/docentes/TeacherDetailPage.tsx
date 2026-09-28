import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, UsersRound } from 'lucide-react'
import { Card } from '../../shared/ui/Card'
import { PageHeader } from '../../shared/ui/PageHeader'
import { SelectField } from '../../shared/ui/SelectField'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { EmptyState } from '../../shared/ui/EmptyState'
import { formatDate, statusTone } from '../dashboard/dashboard-model'
import { useDossiers } from '../expedientes/dossier-context'
import { mockTeachers } from './docentes.mock'
import { teacherHistory } from './teacher-history'

export function TeacherDetailPage() {
  const { id } = useParams()
  const teacher = mockTeachers.find((item) => item.id === id)
  return teacher ? <TeacherHistory key={teacher.id} teacher={teacher} /> : <Card><h1 className="sr-only">Docente no encontrado</h1><EmptyState icon={UsersRound} title="No encontramos este docente" description="Consulta el catálogo de docentes de demostración." action={<Link to="/docentes" className="text-brand underline">Volver a docentes</Link>} /></Card>
}

function TeacherHistory({ teacher }: { teacher: typeof mockTeachers[number] }) {
  const { records } = useDossiers()
  const [role, setRole] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const history = teacherHistory(records, teacher.id)
  const results = history.filter((item) => (!role || (role === 'Asesor' ? item.role === 'Asesor' : item.role !== 'Asesor')) && (!year || item.resolution?.date.startsWith(year)))
  const totalPages = Math.max(1, Math.ceil(results.length / 6))
  const currentPage = Math.min(page, totalPages)
  return <div className="space-y-6">
    <Link to="/docentes" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand"><ArrowLeft size={16} aria-hidden="true" />Volver a docentes</Link>
    <PageHeader title={teacher.name} description={`${teacher.id} · ${teacher.school}`} action={<Badge>Docente de demostración</Badge>} />
    <Card className="p-5 sm:p-6"><dl aria-label="Resumen de participación" className="grid gap-5 sm:grid-cols-3">{[['Asesorías', history.filter((item) => item.role === 'Asesor').length], ['Como jurado', history.filter((item) => item.role !== 'Asesor').length], ['Expedientes asociados', new Set(history.map((item) => item.record.id)).size]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 text-2xl font-semibold text-brand">{value}</dd></div>)}</dl><p className="mt-5 text-xs leading-5 text-muted">Totales del historial completo. Las participaciones corresponden a las designaciones registradas en los expedientes.</p></Card>
    <Card className="p-5 sm:p-6"><div className="grid gap-5 sm:grid-cols-2"><SelectField label="Participación" value={role} onChange={(event) => { setRole(event.target.value); setPage(1) }}><option value="">Todas las participaciones</option><option>Asesor</option><option>Jurado</option></SelectField><SelectField label="Año de resolución" value={year} onChange={(event) => { setYear(event.target.value); setPage(1) }}><option value="">Todos los años</option>{[...new Set(history.flatMap((item) => item.resolution ? [item.resolution.date.slice(0, 4)] : []))].sort().reverse().map((value) => <option key={value}>{value}</option>)}</SelectField></div><div className="mt-4 flex justify-end"><Button variant="ghost" onClick={() => { setRole(''); setYear(''); setPage(1) }}>Limpiar filtros</Button></div></Card>
    <Card className="min-w-0 overflow-hidden"><h2 id="teacher-history-title" className="p-5 text-lg font-semibold">Historial de participación</h2>
      {results.length ? <div role="region" aria-labelledby="teacher-history-title" tabIndex={0} className="overflow-x-auto"><table className="w-full min-w-200 text-left text-sm"><caption className="sr-only">Asesorías y jurados del docente</caption><thead className="border-y border-outline bg-brand-soft/30 text-xs text-muted"><tr>{['Expediente / graduando', 'Trabajo / escuela', 'Participación', 'Resolución', 'Estado'].map((label) => <th scope="col" key={label} className="px-5 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-outline">{results.slice((currentPage - 1) * 6, currentPage * 6).map(({ record, role: cargo, resolution }) => <tr key={`${record.id}-${cargo}`} className="align-top"><th scope="row" className="px-5 py-4 font-normal"><Link to={`/expedientes/${encodeURIComponent(record.id)}?seccion=asignaciones`} className="font-semibold text-brand hover:underline">{record.id}</Link><p className="mt-2">{record.graduate}</p></th><td className="max-w-80 px-5 py-4"><p className="break-words">{record.research}</p><p className="mt-2 text-xs text-muted">{record.school}</p></td><td className="px-5 py-4"><Badge tone={cargo === 'Asesor' ? 'info' : 'neutral'}>{cargo === 'Asesor' ? 'Asesor' : `Jurado · ${cargo}`}</Badge></td><td className="px-5 py-4">{resolution ? <><Link to={`/expedientes/${encodeURIComponent(record.id)}?seccion=resoluciones`} className="break-words font-medium text-brand underline">{resolution.number}</Link><p className="mt-2 text-xs text-muted">{formatDate(resolution.date)}</p></> : 'Sin resolución registrada'}</td><td className="px-5 py-4"><Badge tone={statusTone[record.status]}>{record.status}</Badge></td></tr>)}</tbody></table></div> : <EmptyState icon={UsersRound} title={history.length ? 'Sin participaciones para estos filtros' : 'Sin participaciones registradas'} description={history.length ? 'Cambia el rol o el año seleccionado.' : 'Las asesorías y designaciones de jurado aparecerán al registrarlas en un expediente.'} action={!history.length ? <Link to="/expedientes" className="text-sm font-medium text-brand underline">Consultar expedientes</Link> : undefined} />}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline p-5"><p role="status" className="text-xs text-muted">{results.length} participaciones · Página {currentPage} de {totalPages}</p><nav aria-label="Páginas del historial" className="flex gap-2"><Button variant="secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Anterior</Button><Button variant="secondary" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Siguiente</Button></nav></div>
    </Card>
  </div>
}
