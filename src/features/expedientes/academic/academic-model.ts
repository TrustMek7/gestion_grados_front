import { mockTeachers } from '../../docentes/docentes.mock'
import type { Dossier } from '../types'
import type { AcademicData } from './types'
import { defenseResults, juryRoles, resolutionTypes } from './types'

export function academicData(record: Dossier): AcademicData {
  return record.academic ?? {
    resolutions: [], draws: [],
    ...(record.defenseAt ? { defense: {
      date: record.defenseAt,
      result: record.defenseResult ?? (['Sustentado', 'Completado'].includes(record.status) ? 'Aprobado' : 'Pendiente'),
      notes: '',
    } } : {}),
  }
}

function validDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date
}

export function validateAcademic(data: AcademicData, openedAt: string, today: string): string[] {
  const errors: string[] = []
  const teacherExists = (id: string) => mockTeachers.some((teacher) => teacher.id === id)
  const matchesResolution = (id: string, type: string) => data.resolutions.some((resolution) => resolution.id === id && [type, 'Otro'].includes(resolution.type))
  const numbers = data.resolutions.map((item) => item.number.trim().toUpperCase())
  if (new Set(numbers).size !== numbers.length) errors.push('El número de resolución ya existe en este expediente.')
  if (new Set(data.resolutions.map((item) => item.id)).size !== data.resolutions.length) errors.push('Hay identificadores de resolución duplicados.')
  for (const item of data.resolutions) {
    if (!item.number.trim() || item.number.length > 80) errors.push('Ingresa un número de resolución de hasta 80 caracteres.')
    if (!validDate(item.date) || item.date > today) errors.push('La fecha de resolución debe ser válida y no posterior a hoy.')
    if (!resolutionTypes.includes(item.type)) errors.push('Selecciona un tipo de resolución válido.')
    if (item.description.length > 300) errors.push('La descripción de la resolución no puede superar 300 caracteres.')
    if (item.attachment && (!/\.pdf$/i.test(item.attachment.name) || item.attachment.size <= 0 || item.attachment.size > 10 * 1024 * 1024)) errors.push('Selecciona un PDF de hasta 10 MB.')
  }
  if (data.advisor) {
    if (!teacherExists(data.advisor.teacherId)) errors.push('Selecciona un docente asesor.')
    if (!matchesResolution(data.advisor.resolutionId, 'Asesor')) errors.push('El asesor necesita una resolución de tipo Asesor u Otro.')
  }
  if (data.jury) {
    if (!data.jury.members.length) errors.push('Asigna al menos un integrante del jurado.')
    if (data.jury.members.some((member) => !teacherExists(member.teacherId) || !juryRoles.includes(member.role))) errors.push('Revisa los docentes y cargos del jurado.')
    if (new Set(data.jury.members.map((member) => member.teacherId)).size !== data.jury.members.length) errors.push('Un docente no puede ocupar dos cargos del mismo jurado.')
    if (new Set(data.jury.members.map((member) => member.role)).size !== data.jury.members.length) errors.push('No repitas cargos en el jurado.')
    if (!matchesResolution(data.jury.resolutionId, 'Jurado')) errors.push('El jurado necesita una resolución de tipo Jurado u Otro.')
  }
  if (new Set(data.draws.map((draw) => draw.id)).size !== data.draws.length) errors.push('Hay identificadores de sorteo duplicados.')
  for (const draw of data.draws) {
    if (!validDate(draw.date) || draw.date < openedAt || draw.date > today) errors.push('La fecha del sorteo debe estar entre el inicio del expediente y hoy.')
    if (!draw.teacherIds.length || draw.teacherIds.some((id) => !teacherExists(id))) errors.push('Selecciona los docentes del resultado del sorteo.')
    if (new Set(draw.teacherIds).size !== draw.teacherIds.length) errors.push('No repitas docentes en el sorteo.')
    if (!matchesResolution(draw.resolutionId, 'Sorteo')) errors.push('El sorteo necesita una resolución de tipo Sorteo u Otro.')
  }
  if (data.defense) {
    if (!validDate(data.defense.date) || data.defense.date < openedAt) errors.push('La sustentación debe tener una fecha válida a partir del inicio del expediente.')
    if (!defenseResults.includes(data.defense.result)) errors.push('Selecciona un resultado de sustentación.')
    if (data.defense.result !== 'Pendiente' && data.defense.date > today) errors.push('Una sustentación futura solo puede tener resultado Pendiente.')
    if (data.defense.notes.length > 500) errors.push('Las observaciones no pueden superar 500 caracteres.')
  }
  return [...new Set(errors)]
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
function strings(value: Record<string, unknown>, keys: string[]) { return keys.every((key) => typeof value[key] === 'string') }

// Validación estructural al recuperar la demo; no se modifica la información básica existente.
export function isAcademicData(value: unknown): value is AcademicData {
  if (!object(value) || !Array.isArray(value.resolutions) || !Array.isArray(value.draws)) return false
  if (!value.resolutions.every((item: unknown) => object(item) && strings(item, ['id', 'number', 'date', 'type', 'description'])
    && (item.attachment === undefined || (object(item.attachment) && typeof item.attachment.name === 'string' && typeof item.attachment.size === 'number')))) return false
  if (!value.draws.every((item: unknown) => object(item) && strings(item, ['id', 'date', 'resolutionId']) && Array.isArray(item.teacherIds) && item.teacherIds.every((id: unknown) => typeof id === 'string'))) return false
  if (value.advisor !== undefined && (!object(value.advisor) || !strings(value.advisor, ['teacherId', 'resolutionId']))) return false
  if (value.jury !== undefined && (!object(value.jury) || typeof value.jury.resolutionId !== 'string' || !Array.isArray(value.jury.members) || !value.jury.members.every((member: unknown) => object(member) && strings(member, ['role', 'teacherId'])))) return false
  if (value.defense !== undefined && (!object(value.defense) || !strings(value.defense, ['date', 'result', 'notes']))) return false
  return true
}
