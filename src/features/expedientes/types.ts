import type { DashboardDossier } from '../dashboard/types'

export interface Dossier extends DashboardDossier {
  studentCode: string
  program: string
  updatedBy: string
  updatedAtTime: string
}
export type DossierInput = Omit<Dossier, 'updatedAt' | 'updatedBy' | 'updatedAtTime' | 'defenseAt'>
