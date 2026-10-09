import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, FolderSearch, Pencil } from 'lucide-react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router'
import { AssignmentPanel } from './academic/AssignmentPanel'
import { ResolutionPanel } from './academic/ResolutionPanel'
import { DrawPanel } from './academic/DrawPanel'
import { DefensePanel } from './academic/DefensePanel'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { EmptyState } from '../../shared/ui/EmptyState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { formatDate, statusTone } from '../dashboard/dashboard-model'
import { useDossiers } from './dossier-context'
import { statusDescriptions, statusLifecycle, statuses } from './dossier-model'
import type { DossierStatus } from '../dashboard/types'

function Datum({ label, children }: { label: string; children: ReactNode }) {
  return <div className="min-w-0"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1.5 break-words text-sm font-medium">{children}</dd></div>
}

export function MissingDossier() {
  return <Card><h1 className="sr-only">Expediente no encontrado</h1><EmptyState icon={FolderSearch} title="No encontramos este expediente" description="Revisa el número o vuelve al listado de expedientes." action={<Link to="/expedientes" className="text-sm font-medium text-brand underline">Volver a expedientes</Link>} /></Card>
}

export function DossierDetailPage() {
  const { id } = useParams()
  const { records, storageWarning, updateStatus } = useDossiers()
  const { state } = useLocation()
  const [params] = useSearchParams()
  const [changingStatus, setChangingStatus] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState<{ error?: string; success?: string }>({})

  const record = records.find((item) => item.id === id)
  const [targetStatus, setTargetStatus] = useState<DossierStatus>(() => record?.status ?? 'Registrado')
  const [targetObservations, setTargetObservations] = useState(() => record?.observations ?? '')

  const sections = [['general', 'Datos generales'], ['asignaciones', 'Asesor y jurado'], ['resoluciones', 'Resoluciones'], ['sorteos', 'Sorteos externos'], ['sustentacion', 'Sustentación']]
  const section = sections.some(([key]) => key === params.get('seccion')) ? params.get('seccion') : 'general'

  if (!record) return <MissingDossier />

  function handleUpdateStatus(e: FormEvent) {
    e.preventDefault()
    if (!record) return
    const res = updateStatus(record.id, targetStatus, targetObservations)
    if (!res.ok) {
      setStatusFeedback({ error: res.message })
    } else {
      setStatusFeedback({ success: `Estado actualizado a «${targetStatus}» correctamente.` })
      setChangingStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/expedientes" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand"><ArrowLeft size={16} aria-hidden="true" />Volver a expedientes</Link>
      <PageHeader title={record.id} description="Detalle del expediente de demostración." action={<Link to={`/expedientes/${encodeURIComponent(record.id)}/editar`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"><Pencil size={16} aria-hidden="true" />Editar expediente</Link>} />
      {state?.saved && section === 'general' && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">Expediente guardado en la demostración.</p>}
      {statusFeedback.success && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">{statusFeedback.success}</p>}
      {statusFeedback.error && <p role="alert" className="rounded-lg bg-danger-soft p-4 text-sm text-danger">{statusFeedback.error}</p>}
      {storageWarning && <p role="alert" className="rounded-lg bg-warning-soft p-4 text-sm text-warning">El navegador no permitió guardar en la pestaña. Los cambios se conservarán únicamente hasta recargar.</p>}
      <nav aria-label="Secciones del expediente" className="flex flex-wrap gap-2 border-b border-outline pb-3">
        {sections.map(([key, label]) => <Link key={key} to={`?seccion=${key}`} aria-current={section === key ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium ${section === key ? 'bg-brand text-white' : 'text-muted hover:bg-brand-soft hover:text-brand'}`}>{label}</Link>)}
      </nav>
      {section === 'asignaciones' && <AssignmentPanel key={record.id} record={record} />}
      {section === 'resoluciones' && <ResolutionPanel key={record.id} record={record} />}
      {section === 'sorteos' && <DrawPanel key={record.id} record={record} />}
      {section === 'sustentacion' && <DefensePanel key={record.id} record={record} />}
      {section === 'general' && <>
      {/* Línea de avance del trámite (Ciclo de vida del estado) */}
      <div className="rounded-xl border border-outline bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline pb-3">
          <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">Avance del trámite</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Estado actual:</span>
            <Badge tone={statusTone[record.status]}>{record.status}</Badge>
            <Button
              variant="secondary"
              onClick={() => {
                setChangingStatus(!changingStatus)
                setTargetStatus(record.status)
                setTargetObservations(record.observations ?? '')
                setStatusFeedback({})
              }}
              className="text-xs px-2.5 py-1 min-h-8"
            >
              Cambiar estado
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
          {statusLifecycle.map((stage, idx) => {
            const isCurrent = record.status === stage
            const stageIdx = statusLifecycle.indexOf(record.status as typeof statusLifecycle[number])
            const isPassed = stageIdx >= 0 && idx < stageIdx
            return (
              <div
                key={stage}
                className={`rounded-lg p-2.5 border transition-all ${
                  isCurrent
                    ? 'border-brand bg-brand-soft text-brand font-semibold shadow-xs'
                    : isPassed
                    ? 'border-success/30 bg-success-soft text-success'
                    : 'border-outline bg-canvas text-muted'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {isPassed && <CheckCircle2 size={14} className="shrink-0 text-success" aria-hidden="true" />}
                  {isCurrent && <Clock size={14} className="shrink-0 text-brand" aria-hidden="true" />}
                  <span>{stage}</span>
                </div>
              </div>
            )
          })}
        </div>
        {record.status === 'Observado' && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-warning/40 bg-warning-soft px-3 py-2 text-xs text-warning font-medium">
            <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
            <span>Trámite en revisión por observaciones pendientes. Al subsanar, puedes actualizarlo a «En trámite».</span>
          </div>
        )}
      </div>

      {/* Panel interactivo para cambiar estado rápido */}
      {changingStatus && (
        <Card className="border-brand/40 bg-brand-soft/10 p-5">
          <h3 className="text-sm font-semibold text-brand">Actualizar estado del expediente</h3>
          <p className="mt-1 text-xs text-muted">Selecciona el nuevo estado del trámite y actualiza las observaciones si corresponde.</p>
          <form onSubmit={handleUpdateStatus} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="quick-status-select" className="mb-1.5 block text-xs font-medium text-muted">Nuevo estado *</label>
                <select
                  id="quick-status-select"
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as DossierStatus)}
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm"
                >
                  {statuses.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
                <p className="mt-1.5 text-xs text-muted">{statusDescriptions[targetStatus]}</p>
              </div>
              <div>
                <label htmlFor="quick-observations-input" className="mb-1.5 block text-xs font-medium text-muted">Observaciones / Motivo (opcional)</label>
                <textarea
                  id="quick-observations-input"
                  rows={2}
                  maxLength={500}
                  value={targetObservations}
                  onChange={(e) => setTargetObservations(e.target.value)}
                  placeholder="Anota observaciones o motivo del cambio de estado…"
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setChangingStatus(false)}>Cancelar</Button>
              <Button type="submit">Guardar nuevo estado</Button>
            </div>
          </form>
        </Card>
      )}

      {record.status === 'Observado' && (
        <div role="region" aria-label="Observaciones del trámite" className="rounded-xl border border-warning/40 bg-warning-soft p-5 text-warning">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Trámite con observaciones pendientes</h3>
              <p className="text-sm leading-6">{record.observations || 'Este expediente tiene observaciones por subsanar antes de continuar con la gestión del trámite.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Datos del Graduando (RF-GT-02) */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline pb-4">
          <div>
            <p className="text-xs text-muted">Graduando</p>
            <h2 className="mt-1 text-xl font-semibold">{record.graduate}</h2>
          </div>
          <Link to={`/expedientes/${encodeURIComponent(record.id)}/editar`} className="text-xs font-medium text-brand hover:underline">
            Editar datos
          </Link>
        </div>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Datum label="Código del graduando">{record.studentCode}</Datum>
          <Datum label="Escuela profesional">{record.school}</Datum>
          <Datum label="Especialidad o programa">{record.program || 'Sin registrar'}</Datum>
          <Datum label="Fecha de inicio">{formatDate(record.openedAt)}</Datum>
        </dl>
      </Card>

      {/* Datos del Trámite */}
      <Card className="p-5 sm:p-6">
        <h2 className="text-base font-semibold border-b border-outline pb-4">Datos del trámite</h2>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Datum label="Número de expediente">{record.id}</Datum>
          <Datum label="Fecha de inicio">{formatDate(record.openedAt)}</Datum>
          <Datum label="Grado o título">{record.degree}</Datum>
          <Datum label="Modalidad">{record.modality}</Datum>
          <Datum label="Estado">{record.status} <span className="block text-xs font-normal text-muted mt-0.5">{statusDescriptions[record.status]}</span></Datum>
          {record.observations && record.status !== 'Observado' && (
            <div className="sm:col-span-2 lg:col-span-3">
              <Datum label="Observaciones">{record.observations}</Datum>
            </div>
          )}
        </dl>
      </Card>

      <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Trabajo de investigación</h2><p className="mt-3 break-words text-sm leading-6">{record.research}</p></Card>
      </>}
      <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Última actualización</h2><dl className="mt-4 grid gap-6 sm:grid-cols-2"><Datum label="Fecha">{formatDate(record.updatedAt)}</Datum><Datum label="Responsable">{record.updatedBy}</Datum></dl></Card>
      {record.importBatch && <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Origen de carga histórica</h2><p className="mt-3 break-all text-sm">{record.importBatch.file}</p><p className="mt-2 text-xs text-muted">{new Date(record.importBatch.date).toLocaleString('es-PE', { timeZone: 'America/Lima' })} · {record.importBatch.user}</p></Card>}
      <p className="text-xs leading-5 text-muted">Datos ficticios guardados en esta pestaña. Los documentos conservan únicamente una referencia; no se cargan archivos a ningún servicio.</p>
    </div>
  )
}
