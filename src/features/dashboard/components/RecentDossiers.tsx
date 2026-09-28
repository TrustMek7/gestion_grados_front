import { Fragment, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { Badge } from '../../../shared/ui/Badge'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { formatDate, normalizeSearch, statusTone } from '../dashboard-model'
import type { DashboardDossier } from '../types'

const pageSize = 6

export function RecentDossiers({ records }: { records: DashboardDossier[] }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const search = normalizeSearch(query)
  const results = records.filter((item) => normalizeSearch(`${item.id} ${item.graduate} ${item.school}`).includes(search))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id))
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize))
  const offset = (page - 1) * pageSize
  const visible = results.slice(offset, offset + pageSize)

  function updateQuery(value: string) {
    setQuery(value)
    setPage(1)
    setExpanded(null)
  }

  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 id="recent-title" className="text-lg font-semibold">Expedientes recientes</h2><p className="mt-1 text-xs leading-5 text-muted">Ordenados por última actualización. La búsqueda solo filtra esta tabla.</p></div>
        <div className="w-full lg:max-w-80">
          <label htmlFor="recent-search" className="sr-only">Buscar en expedientes recientes</label>
          <div className="relative"><Search size={17} aria-hidden="true" className="pointer-events-none absolute top-3.5 left-3 text-muted" /><input id="recent-search" type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Nombre, código o escuela…" className="min-h-11 w-full rounded-lg border border-outline bg-canvas py-2 pr-3 pl-10 text-sm" /></div>
        </div>
      </div>
      {visible.length ? (
        <div role="region" aria-labelledby="recent-title" tabIndex={0} className="overflow-x-auto focus-visible:-outline-offset-2">
          <table className="w-full min-w-205 border-collapse text-left text-sm">
            <caption className="sr-only">Resumen de expedientes de demostración, ordenados por fecha de actualización</caption>
            <thead className="border-y border-outline bg-brand-soft/30 text-[11px] tracking-wide text-muted uppercase"><tr>
              {['Expediente / ingreso', 'Graduando / escuela', 'Modalidad / grado', 'Estado', 'Actualización', 'Resumen'].map((label) => <th key={label} scope="col" className="px-5 py-3 font-semibold">{label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-outline">
              {visible.map((item) => (
                <Fragment key={item.id}>
                  <tr className="hover:bg-canvas">
                    <th scope="row" className="px-5 py-4 font-normal"><span className="block whitespace-nowrap text-xs font-semibold text-brand">{item.id}</span><span className="mt-1 block text-xs text-muted">{formatDate(item.openedAt)}</span></th>
                    <td className="px-5 py-4"><span className="block font-medium">{item.graduate}</span><span className="mt-1 block text-xs text-muted">{item.school}</span></td>
                    <td className="px-5 py-4"><span className="block text-xs">{item.modality}</span><span className="mt-1 block text-xs text-muted">{item.degree}</span></td>
                    <td className="px-5 py-4"><Badge tone={statusTone[item.status]}>{item.status}</Badge></td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs tabular-nums text-muted">{formatDate(item.updatedAt)}</td>
                    <td className="px-5 py-4"><Button variant="ghost" className="px-3" aria-label={`${expanded === item.id ? 'Ocultar' : 'Ver'} resumen de ${item.id}`} aria-expanded={expanded === item.id} aria-controls={`summary-${item.id}`} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>{expanded === item.id ? <X size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}</Button></td>
                  </tr>
                  <tr id={`summary-${item.id}`} hidden={expanded !== item.id}><td colSpan={6} className="bg-brand-soft/20 px-5 py-5">
                    <p className="text-xs font-semibold text-brand">Resumen de demostración · {item.id}</p>
                    <dl className="mt-3 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs text-muted">Trabajo de investigación</dt><dd className="mt-1 text-sm">{item.research}</dd></div><div><dt className="text-xs text-muted">Fecha de sustentación</dt><dd className="mt-1 text-sm">{item.defenseAt ? formatDate(item.defenseAt) : 'Sin fecha registrada'}</dd></div></dl>
                  </td></tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="border-y border-outline bg-canvas px-6 py-12 text-center"><Search className="mx-auto mb-3 text-muted" size={24} aria-hidden="true" /><h3 className="text-sm font-semibold">No se encontraron expedientes</h3><p className="mt-2 text-sm text-muted">Prueba otra búsqueda o cambia los filtros del panel.</p>{query && <Button variant="secondary" className="mt-4" onClick={() => updateQuery('')}>Limpiar búsqueda</Button>}</div>}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p role="status" className="text-xs tabular-nums text-muted">{results.length ? `${offset + 1}–${Math.min(offset + pageSize, results.length)} de ${results.length} ${results.length === 1 ? 'expediente' : 'expedientes'}` : '0 expedientes'}</p>
        <nav aria-label="Páginas de expedientes recientes" className="flex items-center gap-2">
          <Button variant="secondary" className="px-2.5" aria-label="Página anterior" disabled={page === 1} onClick={() => { setPage(page - 1); setExpanded(null) }}><ChevronLeft size={16} aria-hidden="true" /></Button>
          <span className="px-1 text-xs tabular-nums text-muted">{page} / {totalPages}</span>
          <Button variant="secondary" className="px-2.5" aria-label="Página siguiente" disabled={page === totalPages} onClick={() => { setPage(page + 1); setExpanded(null) }}><ChevronRight size={16} aria-hidden="true" /></Button>
        </nav>
      </div>
    </Card>
  )
}
