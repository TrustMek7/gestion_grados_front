import { useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Save } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { mockTeachers, teacherName } from '../../docentes/docentes.mock'
import { formatDate } from '../../dashboard/dashboard-model'
import { useDossiers } from '../dossier-context'
import { today } from '../dossier-model'
import type { Dossier } from '../types'
import { academicData } from './academic-model'
import { Feedback, ResolutionSelect } from './AcademicFields'
import type { DrawResult } from './types'

export function DrawPanel({ record }: { record: Dossier }) {
  const data = academicData(record)
  const [editing, setEditing] = useState<DrawResult>()
  const [revision, setRevision] = useState(0)
  const [success, setSuccess] = useState('')
  return <div className="space-y-6">
    <Feedback error="" success={success} />
    <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Resultados de sorteos externos</h2><p className="mt-2 text-sm leading-6 text-muted">Registra los docentes seleccionados por la facultad. Esta pantalla no realiza sorteos ni modifica automáticamente el jurado.</p>
      {data.draws.length ? <ul className="mt-5 divide-y divide-outline">{data.draws.map((draw) => <li key={draw.id} className="flex flex-wrap items-start justify-between gap-3 py-4"><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">Sorteo del {formatDate(draw.date)}</h3><p className="mt-2 break-words text-sm text-muted">{draw.teacherIds.map(teacherName).join(' · ')}</p><p className="mt-2 break-words text-xs text-muted">Resolución: {data.resolutions.find((item) => item.id === draw.resolutionId)?.number}</p></div><Button variant="ghost" aria-label={`Editar sorteo del ${formatDate(draw.date)}`} onClick={() => { setEditing(draw); setSuccess('') }}><Pencil size={16} aria-hidden="true" />Editar</Button></li>)}</ul> : <p className="mt-5 rounded-lg bg-canvas p-5 text-sm text-muted">No hay resultados de sorteos registrados.</p>}
    </Card>
    <DrawForm key={editing?.id ?? `new-${revision}`} record={record} initial={editing} onCancel={() => { setEditing(undefined); setRevision((value) => value + 1) }} onSaved={() => { setEditing(undefined); setRevision((value) => value + 1); setSuccess('Resultado de sorteo guardado en la demostración.') }} />
  </div>
}

function DrawForm({ record, initial, onSaved, onCancel }: { record: Dossier; initial?: DrawResult; onSaved: () => void; onCancel: () => void }) {
  const data = academicData(record)
  const { saveAcademic } = useDossiers()
  const [date, setDate] = useState(initial?.date ?? today())
  const [selected, setSelected] = useState(initial?.teacherIds ?? [])
  const [resolutionId, setResolutionId] = useState(initial?.resolutionId ?? '')
  const [error, setError] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    const draw: DrawResult = { id: initial?.id ?? crypto.randomUUID(), date, teacherIds: selected, resolutionId }
    const draws = initial ? data.draws.map((item) => item.id === initial.id ? draw : item) : [...data.draws, draw]
    const result = saveAcademic(record.id, { ...data, draws })
    if (result.ok) onSaved()
    else setError(result.message)
  }
  return <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">{initial ? 'Editar resultado del sorteo' : 'Registrar resultado del sorteo'}</h2>
    <form noValidate onSubmit={submit} className="mt-5 space-y-5">
      <Feedback error={error} success="" />
      <div className="grid gap-5 sm:grid-cols-2"><InputField label="Fecha del sorteo" type="date" required min={record.openedAt} max={today()} value={date} onChange={(event) => setDate(event.target.value)} /><ResolutionSelect type="Sorteo" dossierId={record.id} resolutions={data.resolutions} value={resolutionId} onChange={setResolutionId} /></div>
      <fieldset><legend className="mb-3 text-sm font-medium">Docentes seleccionados en el sorteo</legend><div className="grid gap-3 sm:grid-cols-2">{mockTeachers.map((teacher) => <label key={teacher.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-outline p-3 text-sm"><input type="checkbox" className="mt-1 size-4 shrink-0 accent-brand" checked={selected.includes(teacher.id)} onChange={(event) => setSelected(event.target.checked ? [...selected, teacher.id] : selected.filter((id) => id !== teacher.id))} /><span>{teacher.name}<span className="mt-1 block text-xs text-muted">{teacher.school}</span></span></label>)}</div></fieldset>
      <div className="flex flex-wrap justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit"><Save size={16} aria-hidden="true" />Guardar resultado de sorteo</Button></div>
    </form>
  </Card>
}
