import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { InputField } from '../../shared/ui/InputField'
import { PageHeader } from '../../shared/ui/PageHeader'
import { SelectField } from '../../shared/ui/SelectField'
import { useDossiers } from './dossier-context'
import { degrees, modalities, schools, statusDescriptions, statuses, today, validateDossier } from './dossier-model'
import { MissingDossier } from './DossierDetailPage'
import type { Dossier, DossierInput } from './types'

export function DossierFormPage() {
  const { id } = useParams()
  const { records } = useDossiers()
  const record = records.find((item) => item.id === id)
  if (id && !record) return <MissingDossier />
  return <DossierForm key={id ?? 'new'} record={record} />
}

function DossierForm({ record }: { record?: Dossier }) {
  const { records, save } = useDossiers()
  const navigate = useNavigate()
  const errorSummary = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState<DossierInput>(() => record ? {
    id: record.id, graduate: record.graduate, studentCode: record.studentCode,
    school: record.school, program: record.program, degree: record.degree,
    modality: record.modality, status: record.status, openedAt: record.openedAt,
    research: record.research, observations: record.observations ?? '',
  } : {
    id: '', graduate: '', studentCode: '', school: '', program: '',
    degree: 'Título profesional', modality: 'Tesis', status: 'Registrado',
    openedAt: today(), research: '', observations: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof DossierInput, string>>>({})
  const [saveError, setSaveError] = useState('')
  const back = record ? `/expedientes/${encodeURIComponent(record.id)}` : '/expedientes'

  function update<K extends keyof DossierInput>(key: K, value: DossierInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])) as unknown as DossierInput
    input.id = input.id.toUpperCase()
    const nextErrors = validateDossier(input, records, record?.id)
    setErrors(nextErrors)
    setSaveError('')
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummary.current?.focus())
      return
    }
    const result = save(input, record?.id)
    if (!result.ok) { setSaveError(result.message); return }
    navigate(`/expedientes/${encodeURIComponent(result.id)}`, { replace: true, state: { saved: true } })
  }

  return (
    <div className="space-y-6">
      <Link to={back} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand"><ArrowLeft size={16} aria-hidden="true" />Volver sin guardar</Link>
      <PageHeader title={record ? 'Editar expediente' : 'Nuevo expediente'} description="Completa los datos del graduando, trámite y observaciones correspondientes. Usa únicamente información ficticia." />
      <form noValidate onSubmit={submit} className="space-y-6">
        <p className="text-xs text-muted">Los campos con * son obligatorios. Los cambios se guardan solo en esta pestaña.</p>
        {(Object.keys(errors).length > 0 || saveError) && <div ref={errorSummary} tabIndex={-1} role="alert" className="rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"><p className="font-semibold">Revisa los datos del expediente</p><ul className="mt-2 list-inside list-disc">{Object.entries(errors).map(([key, message]) => <li key={key}>{message}</li>)}{saveError && <li>{saveError}</li>}</ul></div>}
        <Card className="p-5 sm:p-6"><h2 className="mb-5 text-lg font-semibold">Datos del trámite</h2><div className="grid gap-5 sm:grid-cols-2">
          <InputField label="Número de expediente" value={draft.id} onChange={(event) => update('id', event.target.value)} error={errors.id} required maxLength={40} placeholder="DEMO-2026-0013" />
          <InputField label="Fecha de inicio" type="date" value={draft.openedAt} onChange={(event) => update('openedAt', event.target.value)} error={errors.openedAt} required max={today()} />
          <SelectField label="Grado o título *" value={draft.degree} onChange={(event) => update('degree', event.target.value as DossierInput['degree'])} required>{degrees.map((value) => <option key={value}>{value}</option>)}</SelectField>
          <SelectField label="Modalidad *" value={draft.modality} onChange={(event) => update('modality', event.target.value as DossierInput['modality'])} required>{modalities.map((value) => <option key={value}>{value}</option>)}</SelectField>
          <div className="sm:col-span-2">
            <SelectField label="Estado *" value={draft.status} onChange={(event) => update('status', event.target.value as DossierInput['status'])} required>{statuses.map((value) => <option key={value}>{value}</option>)}</SelectField>
            <p className="mt-1.5 text-xs text-muted">{statusDescriptions[draft.status]}</p>
            {draft.status === 'Observado' && (
              <div role="note" className="mt-3 flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning-soft p-3 text-xs text-warning">
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>Estado <strong>Observado</strong> seleccionado: te sugerimos registrar a continuación el detalle u observaciones para facilitar la subsanación del trámite.</span>
              </div>
            )}
          </div>
        </div></Card>
        <Card className="p-5 sm:p-6"><h2 className="mb-5 text-lg font-semibold">Datos del graduando</h2><div className="grid gap-5 sm:grid-cols-2">
          <InputField label="Nombres y apellidos" value={draft.graduate} onChange={(event) => update('graduate', event.target.value)} error={errors.graduate} required maxLength={120} autoComplete="off" />
          <InputField label="Código del graduando" value={draft.studentCode} onChange={(event) => update('studentCode', event.target.value)} error={errors.studentCode} required maxLength={30} autoComplete="off" placeholder="DEMO-GR-0013" />
          <div><SelectField label="Escuela profesional *" value={draft.school} onChange={(event) => update('school', event.target.value)} required aria-invalid={Boolean(errors.school)} aria-describedby={errors.school ? 'school-error' : undefined}><option value="">Selecciona una escuela</option>{schools.map((value) => <option key={value}>{value}</option>)}</SelectField>{errors.school && <p id="school-error" className="mt-1.5 text-xs text-danger">{errors.school}</p>}</div>
          <InputField label="Especialidad o programa (opcional)" value={draft.program} onChange={(event) => update('program', event.target.value)} error={errors.program} maxLength={120} />
        </div></Card>
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Trabajo de investigación</h2>
            <span className="text-xs text-muted">{draft.research.length} / 300 caracteres</span>
          </div>
          <label htmlFor="research-title" className="mt-3 mb-1.5 block text-xs font-medium text-muted">Título de tesis o artículo *</label>
          <textarea id="research-title" value={draft.research} onChange={(event) => update('research', event.target.value)} required maxLength={300} rows={3} aria-invalid={Boolean(errors.research)} aria-describedby={errors.research ? 'research-error' : undefined} className={`w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm ${errors.research ? 'border-danger' : 'border-outline'}`} />
          {errors.research && <p id="research-error" className="mt-1.5 text-xs text-danger">{errors.research}</p>}
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Observaciones del expediente</h2>
            <span className="text-xs text-muted">{(draft.observations ?? '').length} / 500 caracteres</span>
          </div>
          <p className="mt-1 text-xs text-muted">Registra observaciones administrativas, requisitos faltantes o anotaciones de seguimiento del trámite.</p>
          <div className="mt-4">
            <label htmlFor="dossier-observations" className="mb-1.5 block text-xs font-medium text-muted">Observaciones del trámite (opcional)</label>
            <textarea id="dossier-observations" value={draft.observations ?? ''} onChange={(event) => update('observations', event.target.value)} maxLength={500} rows={3} placeholder="Detalla las observaciones, requisitos por subsanar o motivos de devolución administrativa…" aria-invalid={Boolean(errors.observations)} aria-describedby={errors.observations ? 'observations-error' : undefined} className={`w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm ${errors.observations ? 'border-danger' : 'border-outline'}`} />
            {errors.observations && <p id="observations-error" className="mt-1.5 text-xs text-danger">{errors.observations}</p>}
          </div>
        </Card>
        <div className="flex flex-wrap justify-end gap-3"><Link to={back} className="inline-flex min-h-11 items-center rounded-lg border border-outline bg-white px-4 text-sm font-medium hover:bg-brand-soft/30">Cancelar</Link><Button type="submit"><Save size={17} aria-hidden="true" />{record ? 'Guardar cambios' : 'Crear expediente'}</Button></div>
      </form>
    </div>
  )
}

