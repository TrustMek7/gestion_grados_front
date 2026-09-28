import type { DashboardDossier } from '../dashboard/types'
import type { AcademicData } from './academic/types'

export interface Dossier extends DashboardDossier {
  studentCode: string
  program: string
  updatedBy: string
  updatedAtTime: string
  academic?: AcademicData
}
export type DossierInput = Omit<Dossier, 'updatedAt' | 'updatedBy' | 'updatedAtTime' | 'defenseAt' | 'defenseResult' | 'academic'>
