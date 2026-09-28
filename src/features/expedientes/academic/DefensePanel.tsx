import { useState } from 'react'
import type { FormEvent } from 'react'
import { GraduationCap, Save } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { InputField } from '../../../shared/ui/InputField'
import { SelectField } from '../../../shared/ui/SelectField'
import { Button } from '../../../shared/ui/Button'
import { useDossiers } from '../dossier-context'
import type { Dossier } from '../types'
import { academicData } from './academic-model'
import { Feedback } from './AcademicFields'
import { defenseResults } from './types'
import type { Defense } from './types'

export function DefensePanel({ record }: { record: Dossier }) {
  const data = academicData(record)
  const { saveAcademic } = useDossiers()
  const [draft, setDraft] = useState<Defense>(data.defense ?? { date: '', result: 'Pendiente', notes: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    const result = saveAcademic(record.id, { ...data, defense: { ...draft, notes: draft.notes.trim() } })
    setError(result.ok ? '' : result.message)
    setSuccess(result.ok ? 'Sustentación guardada en la demostración.' : '')
  }
  return <Card className="p-5 sm:p-6">
    <h2 className="flex items-center gap-2 text-lg font-semibold"><GraduationCap size={21} className="text-brand" aria-hidden="true" />Registro de sustentación</h2>
    <p className="mt-2 text-sm leading-6 text-muted">Registra o corrige la fecha y el resultado. Una fecha futura se guarda como pendiente.</p>
    <form noValidate onSubmit={submit} className="mt-5 space-y-5">
      <Feedback error={error} success={success} />
      <div className="grid gap-5 sm:grid-cols-2"><InputField label="Fecha de sustentación" required type="date" min={record.openedAt} value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /><SelectField label="Resultado de sustentación" value={draft.result} onChange={(event) => setDraft({ ...draft, result: event.target.value as Defense['result'] })}>{defenseResults.map((value) => <option key={value}>{value}</option>)}</SelectField></div>
      <div><label htmlFor="defense-notes" className="mb-2 block text-xs font-medium text-muted">Observaciones (opcional)</label><textarea id="defense-notes" rows={3} maxLength={500} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} className="w-full rounded-lg border border-outline px-3 py-2 text-sm" /></div>
      <p className="text-xs leading-5 text-muted">El resultado actualiza el resumen y la agenda de inicio. El estado del expediente se mantiene y puede editarse en sus datos generales.</p>
      <div className="flex flex-wrap justify-end gap-3"><Button variant="secondary" onClick={() => { setDraft(data.defense ?? { date: '', result: 'Pendiente', notes: '' }); setError(''); setSuccess('') }}>Descartar cambios</Button><Button type="submit"><Save size={16} aria-hidden="true" />Guardar sustentación</Button></div>
    </form>
  </Card>
}
