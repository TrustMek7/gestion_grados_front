import type { Dossier } from '../expedientes/types'
import { academicData } from '../expedientes/academic/academic-model'
import { defenseResult } from '../dashboard/dashboard-model'
import { mockTeachers, teacherName } from '../docentes/docentes.mock'
import { teacherHistory } from '../docentes/teacher-history'

export const reportTypes = {
  estadisticas: 'Estadísticas para acreditación',
  docentes: 'Asesores y jurados',
  sorteos: 'Sorteos externos',
  trabajos: 'Trabajos sustentados',
} as const
export type ReportType = keyof typeof reportTypes
export interface ReportFilters { year: string; school: string; modality: string; teacher: string }
export const emptyReportFilters: ReportFilters = { year: '', school: '', modality: '', teacher: '' }
export interface ReportTable { title: string; columns: string[]; rows: (string | number)[][] }
export interface ReportData { table: ReportTable; stats: [string, number][]; note: string }

export function buildReport(records: Dossier[], type: ReportType, filters: ReportFilters, cutoff: string): ReportData {
  const schoolRecords = records.filter((record) => !filters.school || record.school === filters.school)
  const inYear = (date?: string) => !filters.year || date?.startsWith(filters.year)
  const defended = (record: Dossier) => Boolean(record.defenseAt && record.defenseAt <= cutoff && defenseResult(record) !== 'Pendiente')
  if (type === 'docentes') {
    const history = mockTeachers.filter((teacher) => !filters.teacher || teacher.id === filters.teacher).flatMap((teacher) => teacherHistory(schoolRecords.filter((record) => record.modality === 'Tesis'), teacher.id).filter((item) => inYear(item.resolution?.date)).map((item) => ({ ...item, teacher })))
    return {
      note: 'Participaciones en tesis. Año de la resolución de designación; escuela del expediente. Se cuentan las designaciones actuales registradas.',
      stats: [['Asesorías', history.filter((item) => item.role === 'Asesor').length], ['Como jurado', history.filter((item) => item.role !== 'Asesor').length], ['Tesis asociadas', new Set(history.map((item) => item.record.id)).size]],
      table: { title: reportTypes.docentes, columns: ['Docente', 'Expediente', 'Graduando', 'Título de tesis', 'Escuela', 'Participación', 'Resolución', 'Fecha de resolución'], rows: history.map(({ teacher, record, role, resolution }) => [teacher.name, record.id, record.graduate, record.research, record.school, role === 'Asesor' ? role : `Jurado · ${role}`, resolution?.number ?? 'Sin registrar', resolution?.date ?? '']) },
    }
  }
  if (type === 'sorteos') {
    const draws = schoolRecords.flatMap((record) => {
      const data = academicData(record)
      return data.draws.filter((draw) => inYear(draw.date)).map((draw) => ({ record, draw, resolution: data.resolutions.find((item) => item.id === draw.resolutionId) }))
    }).sort((a, b) => b.draw.date.localeCompare(a.draw.date))
    return {
      note: 'Año de realización del sorteo; escuela del expediente. Resultados registrados de sorteos externos a la aplicación.',
      stats: [['Sorteos registrados', draws.length], ['Docentes seleccionados', new Set(draws.flatMap((item) => item.draw.teacherIds)).size], ['Expedientes', new Set(draws.map((item) => item.record.id)).size]],
      table: { title: reportTypes.sorteos, columns: ['Fecha del sorteo', 'Expediente', 'Graduando', 'Escuela', 'Docentes seleccionados', 'Resolución'], rows: draws.map(({ record, draw, resolution }) => [draw.date, record.id, record.graduate, record.school, draw.teacherIds.map(teacherName).join('; '), resolution?.number ?? 'Sin registrar']) },
    }
  }
  const matching = schoolRecords.filter((record) => !filters.modality || record.modality === filters.modality)
  if (type === 'trabajos') {
    const works = matching.filter((record) => defended(record) && inYear(record.defenseAt)).sort((a, b) => a.school.localeCompare(b.school) || b.defenseAt!.localeCompare(a.defenseAt!) || a.id.localeCompare(b.id))
    return {
      note: `Agrupados por escuela y año de sustentación. Incluye resultados Aprobado y Desaprobado hasta el corte mock ${cutoff}; excluye Pendiente.`,
      stats: [['Trabajos sustentados', works.length], ['Tesis', works.filter((record) => record.modality === 'Tesis').length], ['Artículos', works.filter((record) => record.modality !== 'Tesis').length]],
      table: { title: reportTypes.trabajos, columns: ['Escuela', 'Año de sustentación', 'Expediente', 'Graduando', 'Título del trabajo', 'Modalidad', 'Fecha de sustentación', 'Resultado'], rows: works.map((record) => [record.school, record.defenseAt!.slice(0, 4), record.id, record.graduate, record.research, record.modality, record.defenseAt!, defenseResult(record)]) },
    }
  }
  const cohort = matching.filter((record) => inYear(record.openedAt))
  const groups = new Map<string, Dossier[]>()
  for (const record of cohort) {
    const key = `${record.openedAt.slice(0, 4)}|${record.school}|${record.modality}`
    groups.set(key, [...(groups.get(key) ?? []), record])
  }
  return {
    note: `Cohortes por año de ingreso, escuela y modalidad. Sustentados: resultado registrado hasta ${cutoff}. Completados es un estado del expediente y no acredita la emisión de un grado; el mock no registra fecha de graduación.`,
    stats: [['Expedientes ingresados', cohort.length], ['Sustentados', cohort.filter(defended).length], ['Completados', cohort.filter((record) => record.status === 'Completado').length]],
    table: { title: reportTypes.estadisticas, columns: ['Año de ingreso', 'Escuela', 'Modalidad', 'Ingresados', 'Sustentados', 'Registrado', 'En trámite', 'Observado', 'Sustentado', 'Completado'], rows: [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, group]) => [...key.split('|'), group.length, group.filter(defended).length, ...['Registrado', 'En trámite', 'Observado', 'Sustentado', 'Completado'].map((status) => group.filter((record) => record.status === status).length)]) },
  }
}

export function reportYears(records: Dossier[]) {
  return [...new Set(records.flatMap((record) => {
    const data = academicData(record)
    return [record.openedAt, record.defenseAt, ...data.resolutions.map((item) => item.date), ...data.draws.map((item) => item.date)].filter((date): date is string => Boolean(date)).map((date) => date.slice(0, 4))
  }))].sort().reverse()
}
