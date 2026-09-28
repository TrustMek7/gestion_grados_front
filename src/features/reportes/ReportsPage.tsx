import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Download, ChartNoAxesCombined } from 'lucide-react'
import { PageHeader } from '../../shared/ui/PageHeader'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { SelectField } from '../../shared/ui/SelectField'
import { EmptyState } from '../../shared/ui/EmptyState'
import { useDossiers } from '../expedientes/dossier-context'
import { modalities, schools } from '../expedientes/dossier-model'
import { mockTeachers, teacherName } from '../docentes/docentes.mock'
import { referenceDate } from '../dashboard/dashboard.mock'
import { buildReport, emptyReportFilters, reportTypes, reportYears } from './report-model'
import type { ReportFilters, ReportType } from './report-model'
import { downloadReport } from './export-report'
import { ReportDistribution } from './ReportDistribution'

export function ReportsPage() {
  const [params] = useSearchParams()
  const requested = params.get('tipo') ?? 'estadisticas'
  const type: ReportType = Object.hasOwn(reportTypes, requested) ? requested as ReportType : 'estadisticas'
  return <ReportView key={type} type={type} />
}

function ReportView({ type }: { type: ReportType }) {
  const { records } = useDossiers()
  const [filters, setFilters] = useState<ReportFilters>(emptyReportFilters)
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const report = buildReport(records, type, filters, referenceDate)
  const pages = Math.max(1, Math.ceil(report.table.rows.length / 8))
  const currentPage = Math.min(page, pages)
  function filter(key: keyof ReportFilters, value: string) { setFilters((current) => ({ ...current, [key]: value })); setPage(1); setMessage(''); setError('') }
  async function exportExcel() {
    setExporting(true); setError(''); setMessage('')
    try {
      await downloadReport(report, [['Año', filters.year || 'Todos'], ['Escuela del expediente', filters.school || 'Todas'], ['Modalidad', type === 'docentes' ? 'Tesis' : type === 'sorteos' ? 'Todas' : filters.modality || 'Todas'], ['Docente', filters.teacher ? teacherName(filters.teacher) : 'Todos'], ['Corte mock', referenceDate]], `UNSA-${type}-${filters.year || 'todos'}-mock.xlsx`)
      setMessage('Archivo Excel generado con todos los resultados y filtros seleccionados.')
    } catch { setError('No se pudo generar el archivo. Vuelve a intentar la exportación.') }
    finally { setExporting(false) }
  }
  return <div className="space-y-6">
    <PageHeader title="Reportes" description="Consultas administrativas y estadísticas de demostración UNSA." action={<Button disabled={exporting || !report.table.rows.length} onClick={exportExcel}><Download size={17} aria-hidden="true" />{exporting ? 'Generando Excel…' : 'Exportar a Excel (.xlsx)'}</Button>} />
    <nav aria-label="Tipos de reporte" className="flex flex-wrap gap-2 rounded-xl bg-brand-soft/40 p-2">{(Object.entries(reportTypes) as [ReportType, string][]).map(([key, label]) => <Link key={key} to={`?tipo=${key}`} aria-current={type === key ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium ${type === key ? 'bg-brand text-white' : 'text-muted hover:bg-white hover:text-brand'}`}>{label}</Link>)}</nav>
    <Card className="p-5 sm:p-6"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><SelectField label={type === 'estadisticas' ? 'Año de ingreso' : type === 'docentes' ? 'Año de resolución' : type === 'sorteos' ? 'Año del sorteo' : 'Año de sustentación'} value={filters.year} onChange={(event) => filter('year', event.target.value)}><option value="">Todos los años</option>{reportYears(records).map((year) => <option key={year}>{year}</option>)}</SelectField><SelectField label="Escuela del expediente" value={filters.school} onChange={(event) => filter('school', event.target.value)}><option value="">Todas las escuelas</option>{schools.map((school) => <option key={school}>{school}</option>)}</SelectField>{type === 'docentes' ? <SelectField label="Docente" value={filters.teacher} onChange={(event) => filter('teacher', event.target.value)}><option value="">Todos los docentes</option>{mockTeachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}</SelectField> : type !== 'sorteos' && <SelectField label="Modalidad" value={filters.modality} onChange={(event) => filter('modality', event.target.value)}><option value="">Todas las modalidades</option>{modalities.map((modality) => <option key={modality}>{modality}</option>)}</SelectField>}</div><div className="mt-4 flex justify-end"><Button variant="ghost" onClick={() => { setFilters(emptyReportFilters); setPage(1); setMessage(''); setError('') }}>Limpiar filtros</Button></div><p className="mt-3 text-xs leading-5 text-muted">{report.note}</p></Card>
    {message && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">{message}</p>}
    {error && <p role="alert" className="rounded-lg bg-danger-soft p-4 text-sm text-danger">{error}</p>}
    <dl aria-label="Indicadores del reporte" className="grid gap-5 sm:grid-cols-3">{report.stats.map(([label, value]) => <Card key={label} className="border-t-4 border-t-brand p-5"><dt className="text-sm text-muted">{label}</dt><dd className="mt-3 text-3xl font-semibold">{value}</dd></Card>)}</dl>
    {type === 'estadisticas' && <ReportDistribution table={report.table} />}
    <Card className="min-w-0 overflow-hidden"><div className="p-5"><h2 id="report-title" className="text-lg font-semibold">{report.table.title}</h2><p className="mt-2 text-xs text-muted">{report.table.rows.length} filas · La descarga incluye todas las páginas.</p></div>
      {report.table.rows.length ? <div role="region" aria-labelledby="report-title" tabIndex={0} className="overflow-x-auto"><table className="w-full min-w-200 text-left text-sm"><caption className="sr-only">{report.table.title}</caption><thead className="border-y border-outline bg-brand-soft/30 text-xs text-muted"><tr>{report.table.columns.map((column) => <th key={column} scope="col" className="px-5 py-3 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-outline">{report.table.rows.slice((currentPage - 1) * 8, currentPage * 8).map((row, index) => <tr key={index} className="align-top hover:bg-canvas">{row.map((cell, column) => <td key={column} className="max-w-80 px-5 py-4 break-words">{report.table.columns[column] === 'Expediente' ? <Link className="font-medium text-brand hover:underline" to={`/expedientes/${encodeURIComponent(String(cell))}`}>{cell}</Link> : cell}</td>)}</tr>)}</tbody></table></div> : <EmptyState icon={ChartNoAxesCombined} title="Sin datos para este reporte" description="Prueba otros filtros o registra la información correspondiente en los expedientes." />}
      <nav aria-label="Páginas del reporte" className="flex flex-wrap items-center justify-between gap-3 border-t border-outline p-5"><p className="text-xs text-muted">Página {currentPage} de {pages}</p><div className="flex gap-2"><Button variant="secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Anterior</Button><Button variant="secondary" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Siguiente</Button></div></nav>
    </Card>
    <p className="text-xs leading-5 text-muted">Datos ficticios. El archivo Excel se genera localmente en tu navegador con la marca UNSA y los criterios de esta consulta.</p>
  </div>
}
