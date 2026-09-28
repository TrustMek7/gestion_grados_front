import { Link } from 'react-router'
import { mockTeachers } from '../../docentes/docentes.mock'
import { SelectField } from '../../../shared/ui/SelectField'
import type { Resolution } from './types'

export function TeacherSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <SelectField label={label} value={value} onChange={(event) => onChange(event.target.value)}><option value="">Sin asignar</option>{mockTeachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name} · {teacher.school}</option>)}</SelectField>
}

export function ResolutionSelect({ value, onChange, resolutions, type, dossierId }: {
  value: string; onChange: (value: string) => void; resolutions: Resolution[]; type: string; dossierId: string
}) {
  const available = resolutions.filter((resolution) => resolution.type === type || resolution.type === 'Otro')
  return <div><SelectField label="Resolución asociada" value={value} onChange={(event) => onChange(event.target.value)}><option value="">Selecciona una resolución</option>{available.map((resolution) => <option key={resolution.id} value={resolution.id}>{resolution.number} · {resolution.type}</option>)}</SelectField>
    <Link to={`/expedientes/${encodeURIComponent(dossierId)}?seccion=resoluciones`} className="mt-2 inline-block text-xs font-medium text-brand underline">Registrar o consultar resoluciones</Link>
  </div>
}

export function Feedback({ error, success }: { error: string; success: string }) {
  return <>{error && <p role="alert" className="rounded-lg bg-danger-soft p-4 text-sm text-danger">{error}</p>}{success && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">{success}</p>}</>
}
