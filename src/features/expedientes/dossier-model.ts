import { dashboardDossiers } from '../dashboard/dashboard.mock'
import type { Dossier, DossierInput } from './types'
import { academicData, isAcademicData, validateAcademic } from './academic/academic-model'

export const storageKey = 'unsa.mock-dossiers.v1'
export const schools = ['Administración', 'Economía', 'Educación', 'Ingeniería Civil', 'Ingeniería de Sistemas']
export const modalities = ['Tesis', 'Artículo de investigación'] as const
export const degrees = ['Bachiller', 'Título profesional'] as const
export const statuses = ['Registrado', 'En trámite', 'Observado', 'Sustentado', 'Completado'] as const

export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export function initialDossiers(): Dossier[] {
  return dashboardDossiers.map((record, index) => ({
    ...record, studentCode: `DEMO-GR-${String(index + 1).padStart(4, '0')}`,
    program: '', updatedBy: 'Carga de demostración', updatedAtTime: record.updatedAt + 'T12:00:00Z',
  }))
}

export function readDossiers(): Dossier[] {
  try {
    const data: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null')
    if (Array.isArray(data) && data.length > 0 && data.every(isDossier) && new Set(data.map((item) => item.id.toUpperCase())).size === data.length) return data
  } catch { /* El prototipo puede funcionar sin almacenamiento. */ }
  return initialDossiers()
}

function isDossier(value: unknown): value is Dossier {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  const strings = ['id', 'graduate', 'studentCode', 'school', 'program', 'degree', 'modality', 'status', 'openedAt', 'updatedAt', 'research', 'updatedBy', 'updatedAtTime']
  if (!strings.every((key) => typeof record[key] === 'string')) return false
  return statuses.some((status) => status === record.status)
    && degrees.some((degree) => degree === record.degree)
    && modalities.some((modality) => modality === record.modality)
    && schools.includes(record.school as string)
    && validDate(record.openedAt as string) && validDate(record.updatedAt as string)
    && (record.defenseAt === undefined || (typeof record.defenseAt === 'string' && validDate(record.defenseAt)))
    && (record.academic === undefined || (isAcademicData(record.academic) && validateAcademic(record.academic, record.openedAt as string, today()).length === 0))
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
}

export function validateDossier(input: DossierInput, records: Dossier[], previousId?: string) {
  const errors: Partial<Record<keyof DossierInput, string>> = {}
  if (!/^[A-Z0-9][A-Z0-9-]{2,39}$/i.test(input.id)) errors.id = 'Usa entre 3 y 40 letras, números o guiones.'
  else if (records.some((record) => record.id !== previousId && record.id.toUpperCase() === input.id.toUpperCase())) errors.id = 'Este número de expediente ya existe.'
  if (!input.graduate.trim() || input.graduate.length > 120) errors.graduate = 'Ingresa los nombres y apellidos (máximo 120 caracteres).'
  if (!input.studentCode.trim() || input.studentCode.length > 30) errors.studentCode = 'Ingresa un código de graduando (máximo 30 caracteres).'
  if (!schools.includes(input.school)) errors.school = 'Selecciona una escuela profesional.'
  if (input.program.length > 120) errors.program = 'Usa un máximo de 120 caracteres.'
  if (!validDate(input.openedAt) || input.openedAt > today()) errors.openedAt = 'Ingresa una fecha válida que no sea posterior a hoy.'
  if (!input.research.trim() || input.research.length > 300) errors.research = 'Ingresa el título del trabajo (máximo 300 caracteres).'
  if (!degrees.includes(input.degree)) errors.degree = 'Selecciona un grado.'
  if (!modalities.includes(input.modality)) errors.modality = 'Selecciona una modalidad.'
  if (!statuses.includes(input.status)) errors.status = 'Selecciona un estado.'
  const previous = records.find((record) => record.id === previousId)
  if (previous && validDate(input.openedAt) && validateAcademic(academicData(previous), input.openedAt, today()).length > 0) errors.openedAt = 'La fecha de inicio no puede ser posterior a los sorteos o la sustentación registrados.'
  return errors
}
