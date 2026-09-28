import { ArrowLeft, Pencil, FolderSearch } from 'lucide-react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router'
import { AssignmentPanel } from './academic/AssignmentPanel'
import { ResolutionPanel } from './academic/ResolutionPanel'
import { DrawPanel } from './academic/DrawPanel'
import { DefensePanel } from './academic/DefensePanel'
import { Badge } from '../../shared/ui/Badge'
import { Card } from '../../shared/ui/Card'
import { EmptyState } from '../../shared/ui/EmptyState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { formatDate, statusTone } from '../dashboard/dashboard-model'
import { useDossiers } from './dossier-context'
import type { ReactNode } from 'react'

function Datum({ label, children }: { label: string; children: ReactNode }) {
  return <div className="min-w-0"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1.5 break-words text-sm font-medium">{children}</dd></div>
}

export function MissingDossier() {
  return <Card><h1 className="sr-only">Expediente no encontrado</h1><EmptyState icon={FolderSearch} title="No encontramos este expediente" description="Revisa el número o vuelve al listado de expedientes." action={<Link to="/expedientes" className="text-sm font-medium text-brand underline">Volver a expedientes</Link>} /></Card>
}

export function DossierDetailPage() {
  const { id } = useParams()
  const { records, storageWarning } = useDossiers()
  const { state } = useLocation()
  const [params] = useSearchParams()
  const sections = [['general', 'Datos generales'], ['asignaciones', 'Asesor y jurado'], ['resoluciones', 'Resoluciones'], ['sorteos', 'Sorteos externos'], ['sustentacion', 'Sustentación']]
  const section = sections.some(([key]) => key === params.get('seccion')) ? params.get('seccion') : 'general'
  const record = records.find((item) => item.id === id)
  if (!record) return <MissingDossier />
  return (
    <div className="space-y-6">
      <Link to="/expedientes" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand"><ArrowLeft size={16} aria-hidden="true" />Volver a expedientes</Link>
      <PageHeader title={record.id} description="Detalle del expediente de demostración." action={<Link to={`/expedientes/${encodeURIComponent(record.id)}/editar`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"><Pencil size={16} aria-hidden="true" />Editar expediente</Link>} />
      {state?.saved && section === 'general' && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">Expediente guardado en la demostración.</p>}
      {storageWarning && <p role="alert" className="rounded-lg bg-warning-soft p-4 text-sm text-warning">El navegador no permitió guardar en la pestaña. Los cambios se conservarán únicamente hasta recargar.</p>}
      <nav aria-label="Secciones del expediente" className="flex flex-wrap gap-2 border-b border-outline pb-3">
        {sections.map(([key, label]) => <Link key={key} to={`?seccion=${key}`} aria-current={section === key ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium ${section === key ? 'bg-brand text-white' : 'text-muted hover:bg-brand-soft hover:text-brand'}`}>{label}</Link>)}
      </nav>
      {section === 'asignaciones' && <AssignmentPanel key={record.id} record={record} />}
      {section === 'resoluciones' && <ResolutionPanel key={record.id} record={record} />}
      {section === 'sorteos' && <DrawPanel key={record.id} record={record} />}
      {section === 'sustentacion' && <DefensePanel key={record.id} record={record} />}
      {section === 'general' && <>
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline pb-5"><div><p className="text-xs text-muted">Graduando</p><h2 className="mt-1 text-xl font-semibold">{record.graduate}</h2></div><Badge tone={statusTone[record.status]}>{record.status}</Badge></div>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Datum label="Código del graduando">{record.studentCode}</Datum>
          <Datum label="Escuela profesional">{record.school}</Datum>
          <Datum label="Especialidad o programa">{record.program || 'Sin registrar'}</Datum>
          <Datum label="Fecha de inicio">{formatDate(record.openedAt)}</Datum>
          <Datum label="Grado o título">{record.degree}</Datum>
          <Datum label="Modalidad">{record.modality}</Datum>
        </dl>
      </Card>
      <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Trabajo de investigación</h2><p className="mt-3 break-words text-sm leading-6">{record.research}</p></Card>
      </>}
      <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Última actualización</h2><dl className="mt-4 grid gap-6 sm:grid-cols-2"><Datum label="Fecha">{formatDate(record.updatedAt)}</Datum><Datum label="Responsable">{record.updatedBy}</Datum></dl></Card>
      <p className="text-xs leading-5 text-muted">Datos ficticios guardados en esta pestaña. Los documentos conservan únicamente una referencia; no se cargan archivos a ningún servicio.</p>
    </div>
  )
}
