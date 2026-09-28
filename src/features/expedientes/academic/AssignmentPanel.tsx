import { useState } from 'react'
import type { FormEvent } from 'react'
import { Save, UserRound, UsersRound } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { Button } from '../../../shared/ui/Button'
import { useDossiers } from '../dossier-context'
import type { Dossier } from '../types'
import { academicData } from './academic-model'
import { Feedback, ResolutionSelect, TeacherSelect } from './AcademicFields'
import { juryRoles } from './types'
import type { AcademicData, JuryMember } from './types'

export function AssignmentPanel({ record }: { record: Dossier }) {
  const data = academicData(record)
  const { saveAcademic } = useDossiers()
  const [advisor, setAdvisor] = useState(data.advisor ?? { teacherId: '', resolutionId: '' })
  const [members, setMembers] = useState(() => Object.fromEntries(juryRoles.map((role) => [role, data.jury?.members.find((member) => member.role === role)?.teacherId ?? ''])) as Record<typeof juryRoles[number], string>)
  const [juryResolution, setJuryResolution] = useState(data.jury?.resolutionId ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function save(event: FormEvent, next: AcademicData, label: string) {
    event.preventDefault()
    const result = saveAcademic(record.id, next)
    setError(result.ok ? '' : result.message)
    setSuccess(result.ok ? label : '')
  }

  return (
    <div className="space-y-6">
      <Feedback error={error} success={success} />
      <Card className="p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><UserRound size={20} className="text-brand" aria-hidden="true" />Docente asesor</h2>
        <p className="mt-2 text-xs leading-5 text-muted">Selecciona un docente del catálogo ficticio y su resolución de designación.</p>
        <form noValidate onSubmit={(event) => save(event, { ...data, advisor }, 'Asesor guardado en la demostración.')} className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2"><TeacherSelect label="Docente asesor" value={advisor.teacherId} onChange={(teacherId) => setAdvisor({ ...advisor, teacherId })} /><ResolutionSelect dossierId={record.id} type="Asesor" resolutions={data.resolutions} value={advisor.resolutionId} onChange={(resolutionId) => setAdvisor({ ...advisor, resolutionId })} /></div>
          <div className="flex justify-end"><Button type="submit"><Save size={16} aria-hidden="true" />Guardar asesor</Button></div>
        </form>
      </Card>
      <Card className="p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><UsersRound size={20} className="text-brand" aria-hidden="true" />Conformación del jurado</h2>
        <p className="mt-2 text-xs leading-5 text-muted">Cada docente ocupa un solo cargo. Puedes registrar los cargos disponibles y completar la designación después.</p>
        <form noValidate onSubmit={(event) => {
          const selected: JuryMember[] = juryRoles.filter((role) => members[role]).map((role) => ({ role, teacherId: members[role] }))
          save(event, { ...data, jury: { members: selected, resolutionId: juryResolution } }, 'Jurado guardado en la demostración.')
        }} className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">{juryRoles.map((role) => <TeacherSelect key={role} label={role} value={members[role]} onChange={(teacherId) => setMembers({ ...members, [role]: teacherId })} />)}</div>
          <ResolutionSelect dossierId={record.id} type="Jurado" resolutions={data.resolutions} value={juryResolution} onChange={setJuryResolution} />
          <div className="flex justify-end"><Button type="submit"><Save size={16} aria-hidden="true" />Guardar jurado</Button></div>
        </form>
      </Card>
    </div>
  )
}
