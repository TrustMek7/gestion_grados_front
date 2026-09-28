import type { DashboardDossier, DossierStatus } from './types'

export const statusOrder: DossierStatus[] = ['Registrado', 'En trámite', 'Observado', 'Sustentado', 'Completado']
export const statusTone = {
  Registrado: 'warning', 'En trámite': 'info', Observado: 'danger',
  Sustentado: 'success', Completado: 'success',
} as const

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(value + 'T12:00:00Z'))
}

export function summarizeDossiers(records: DashboardDossier[], referenceDate: string) {
  return {
    total: records.length,
    active: records.filter((item) => ['Registrado', 'En trámite', 'Observado'].includes(item.status)).length,
    observed: records.filter((item) => item.status === 'Observado').length,
    defended: records.filter((item) => item.defenseAt && item.defenseAt <= referenceDate).length,
  }
}
