import { useState } from 'react'
import type { FormEvent } from 'react'
import { FileText, Pencil, Save } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { InputField } from '../../../shared/ui/InputField'
import { SelectField } from '../../../shared/ui/SelectField'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'
import { useDossiers } from '../dossier-context'
import { today } from '../dossier-model'
import { formatDate, normalizeSearch } from '../../dashboard/dashboard-model'
import type { Dossier } from '../types'
import { academicData } from './academic-model'
import { Feedback } from './AcademicFields'
import { resolutionTypes } from './types'
import type { Resolution } from './types'

export function ResolutionPanel({ record }: { record: Dossier }) {
  const data = academicData(record)
  const [editing, setEditing] = useState<Resolution>()
  const [revision, setRevision] = useState(0)
  const [search, setSearch] = useState('')
  const [success, setSuccess] = useState('')
  const results = data.resolutions.filter((resolution) => normalizeSearch(resolution.number).includes(normalizeSearch(search)))
  return (
    <div className="space-y-6">
      <Feedback error="" success={success} />
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Resoluciones del expediente</h2><Badge>{data.resolutions.length} registradas</Badge></div>
        <div className="mt-5 max-w-md"><InputField label="Buscar por número de resolución" type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {results.length ? <ul className="mt-5 divide-y divide-outline">{results.map((resolution) => <li key={resolution.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
          <div className="flex min-w-0 flex-1 gap-3"><FileText size={20} className="mt-1 shrink-0 text-brand" aria-hidden="true" /><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{resolution.number}</h3><p className="mt-1 text-xs text-muted">{resolution.type} · {formatDate(resolution.date)}</p>{resolution.description && <p className="mt-2 break-words text-sm text-muted">{resolution.description}</p>}<p className="mt-2 break-all text-xs text-muted">{resolution.attachment ? `Referencia PDF: ${resolution.attachment.name} (${Math.ceil(resolution.attachment.size / 1024)} KB). Sin contenido almacenado.` : 'Sin referencia de archivo.'}</p></div></div>
          <Button variant="ghost" aria-label={`Editar resolución ${resolution.number}`} onClick={() => { setEditing(resolution); setSuccess('') }}><Pencil size={16} aria-hidden="true" />Editar</Button>
        </li>)}</ul> : <p className="mt-5 rounded-lg bg-canvas p-5 text-sm text-muted">{search ? 'No hay resoluciones que coincidan con la búsqueda.' : 'Todavía no hay resoluciones registradas.'}</p>}
      </Card>
      <ResolutionForm key={editing?.id ?? `new-${revision}`} record={record} initial={editing} onCancel={() => { setEditing(undefined); setRevision((value) => value + 1) }} onSaved={() => { setEditing(undefined); setRevision((value) => value + 1); setSuccess('Resolución guardada en la demostración.') }} />
    </div>
  )
}

function ResolutionForm({ record, initial, onCancel, onSaved }: { record: Dossier; initial?: Resolution; onCancel: () => void; onSaved: () => void }) {
  const { saveAcademic } = useDossiers()
  const [number, setNumber] = useState(initial?.number ?? '')
  const [date, setDate] = useState(initial?.date ?? today())
  const [type, setType] = useState<Resolution['type']>(initial?.type ?? 'Asesor')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [attachment, setAttachment] = useState(initial?.attachment)
  const [error, setError] = useState('')
  const [fileError, setFileError] = useState('')
  const [fileRevision, setFileRevision] = useState(0)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (fileError) return
    const resolution: Resolution = { id: initial?.id ?? crypto.randomUUID(), number: number.trim(), date, type, description: description.trim(), attachment }
    const data = academicData(record)
    const resolutions = initial ? data.resolutions.map((item) => item.id === initial.id ? resolution : item) : [...data.resolutions, resolution]
    const result = saveAcademic(record.id, { ...data, resolutions })
    if (result.ok) onSaved()
    else setError(result.message)
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{initial ? 'Editar resolución' : 'Registrar resolución'}</h2>
      <form noValidate onSubmit={submit} className="mt-5 space-y-5">
        <Feedback error={error || fileError} success="" />
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField label="Número de resolución" required maxLength={80} value={number} onChange={(event) => setNumber(event.target.value)} placeholder="RES-DEMO-2026-001" />
          <InputField label="Fecha de resolución" required type="date" max={today()} value={date} onChange={(event) => setDate(event.target.value)} />
          <SelectField label="Tipo de resolución" value={type} onChange={(event) => setType(event.target.value as Resolution['type'])}>{resolutionTypes.map((value) => <option key={value}>{value}</option>)}</SelectField>
          <InputField label="Descripción (opcional)" maxLength={300} value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div className="rounded-lg border border-dashed border-outline bg-canvas p-4">
          <InputField key={fileRevision} label="Referencia de archivo PDF (opcional)" type="file" accept=".pdf,application/pdf" onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            if (!/\.pdf$/i.test(file.name) || !file.size || file.size > 10 * 1024 * 1024) { setFileError('Selecciona un PDF de hasta 10 MB.'); return }
            setFileError('')
            setAttachment({ name: file.name, size: file.size })
          }} />
          <p className="mt-2 text-xs leading-5 text-muted">Mock: solo se guarda el nombre y tamaño. El PDF no se carga ni se almacena; usa un archivo de prueba.</p>
          {(attachment || fileError) && <div className="mt-3"><p className="break-all text-xs text-muted">{attachment?.name}</p><Button variant="ghost" onClick={() => { setAttachment(undefined); setFileError(''); setFileRevision((value) => value + 1) }}>Quitar referencia</Button></div>}
        </div>
        <div className="flex flex-wrap justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit"><Save size={16} aria-hidden="true" />Guardar resolución</Button></div>
      </form>
    </Card>
  )
}
