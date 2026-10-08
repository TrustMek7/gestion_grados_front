import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Plus, Search } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { PageHeader } from '../../shared/ui/PageHeader'
import { SelectField } from '../../shared/ui/SelectField'
import { formatDate, normalizeSearch, statusTone } from '../dashboard/dashboard-model'
import { useDossiers } from './dossier-context'
import { modalities, schools, statuses } from './dossier-model'
import { academicData } from './academic/academic-model'
import { teacherName } from '../docentes/docentes.mock'

const emptyFilters = { query: '', school: '', year: '', modality: '', status: '' }

export function DossiersPage() {
  const { records, storageWarning } = useDossiers()
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const years = [...new Set(records.map((item) => item.openedAt.slice(0, 4)))].sort().reverse()
  const results = records.filter((item) => (!filters.school || item.school === filters.school)
    && (!filters.year || item.openedAt.startsWith(filters.year))
    && (!filters.modality || item.modality === filters.modality)
    && (!filters.status || item.status === filters.status)
    && normalizeSearch(`${item.id} ${item.graduate} ${item.studentCode} ${item.research} ${item.observations ?? ''} ${academicData(item).resolutions.map((resolution) => resolution.number).join(' ')} ${academicData(item).advisor ? teacherName(academicData(item).advisor!.teacherId) : ''} ${academicData(item).jury?.members.map((member) => teacherName(member.teacherId)).join(' ') ?? ''}`).includes(normalizeSearch(filters.query)))
    .sort((a, b) => b.updatedAtTime.localeCompare(a.updatedAtTime) || a.id.localeCompare(b.id))
  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize))
  const offset = (page - 1) * pageSize
  function filter(key: keyof typeof filters, value: string) { setFilters((current) => ({ ...current, [key]: value })); setPage(1) }

  return (
    <div className="space-y-6">
      <PageHeader title="Expedientes" description="Consulta y mantenimiento de expedientes de grados y títulos. Datos de demostración." action={<Link to="/expedientes/nuevo" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"><Plus size={18} aria-hidden="true" />Nuevo expediente</Link>} />
      {storageWarning && <p role="alert" className="rounded-lg bg-warning-soft p-4 text-sm text-warning">El almacenamiento de la pestaña no está disponible. Los cambios se perderán al recargar.</p>}
      <Card className="p-5 sm:p-6">
        <label htmlFor="dossier-search" className="mb-2 block text-xs font-medium text-muted">Buscar expediente</label>
        <div className="relative"><Search size={18} aria-hidden="true" className="absolute top-3.5 left-3 text-muted" /><input id="dossier-search" type="search" value={filters.query} onChange={(event) => filter('query', event.target.value)} placeholder="Número, graduando, código o título del trabajo…" className="min-h-11 w-full rounded-lg border border-outline bg-canvas py-2 pr-3 pl-10 text-sm" /></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SelectField label="Escuela profesional" value={filters.school} onChange={(event) => filter('school', event.target.value)}><option value="">Todas las escuelas</option>{schools.map((value) => <option key={value}>{value}</option>)}</SelectField>
          <SelectField label="Año de ingreso" value={filters.year} onChange={(event) => filter('year', event.target.value)}><option value="">Todos los años</option>{years.map((value) => <option key={value}>{value}</option>)}</SelectField>
          <SelectField label="Modalidad" value={filters.modality} onChange={(event) => filter('modality', event.target.value)}><option value="">Todas las modalidades</option>{modalities.map((value) => <option key={value}>{value}</option>)}</SelectField>
          <SelectField label="Estado" value={filters.status} onChange={(event) => filter('status', event.target.value)}><option value="">Todos los estados</option>{statuses.map((value) => <option key={value}>{value}</option>)}</SelectField>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted">También puedes buscar por número de resolución, asesor o integrante del jurado.</p><Button variant="ghost" onClick={() => { setFilters(emptyFilters); setPage(1) }}>Limpiar filtros</Button></div>
      </Card>
      <Card className="min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-5"><h2 id="dossiers-title" className="text-lg font-semibold">Expedientes registrados</h2><Badge>{results.length} registros</Badge></div>
        {results.length ? <div role="region" aria-labelledby="dossiers-title" tabIndex={0} className="overflow-x-auto focus-visible:-outline-offset-2"><table className="w-full min-w-205 text-left text-sm"><caption className="sr-only">Expedientes de demostración</caption><thead className="border-y border-outline bg-brand-soft/30 text-[11px] tracking-wide text-muted uppercase"><tr>{['Expediente', 'Graduando / código', 'Escuela / modalidad', 'Estado', 'Actualización', 'Acciones'].map((label) => <th key={label} scope="col" className="px-5 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-outline">
          {results.slice(offset, offset + pageSize).map((record) => <tr key={record.id} className="hover:bg-canvas"><th scope="row" className="px-5 py-4 text-xs font-semibold text-brand"><Link to={`/expedientes/${encodeURIComponent(record.id)}`} className="whitespace-nowrap hover:underline">{record.id}</Link></th><td className="px-5 py-4"><span className="block font-medium">{record.graduate}</span><span className="mt-1 block text-xs text-muted">{record.studentCode}</span></td><td className="px-5 py-4"><span className="block text-xs">{record.school}</span><span className="mt-1 block text-xs text-muted">{record.modality}</span></td><td className="px-5 py-4"><Badge tone={statusTone[record.status]}>{record.status}</Badge>{record.status === 'Observado' && record.observations && <p className="mt-1 max-w-44 truncate text-[11px] text-danger" title={record.observations}>Obs: {record.observations}</p>}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-muted">{formatDate(record.updatedAt)}</td><td className="px-5 py-4"><Link to={`/expedientes/${encodeURIComponent(record.id)}`} aria-label={`Ver expediente ${record.id}`} className="inline-flex size-11 items-center justify-center rounded-lg text-brand hover:bg-brand-soft"><Eye size={18} aria-hidden="true" /></Link></td></tr>)}
        </tbody></table></div> : <div className="border-y border-outline bg-canvas px-6 py-12 text-center"><h3 className="font-semibold">No se encontraron expedientes</h3><p className="mt-2 text-sm text-muted">Cambia la búsqueda o limpia los filtros.</p></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5"><p role="status" className="text-xs text-muted">{results.length ? `${offset + 1}–${Math.min(offset + pageSize, results.length)} de ${results.length} registros` : '0 registros'}</p><nav aria-label="Páginas de expedientes" className="flex items-center gap-3"><Button variant="secondary" className="px-2.5" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} aria-hidden="true" /></Button><span className="text-xs text-muted">{page} / {totalPages}</span><Button variant="secondary" className="px-2.5" aria-label="Página siguiente" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} aria-hidden="true" /></Button></nav></div>
      </Card>
    </div>
  )
}
