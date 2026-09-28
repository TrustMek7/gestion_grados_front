import type { DashboardDossier } from '../dashboard/types'
import type { AcademicData } from './academic/types'
import type { ImportBatch } from '../administracion/import-model'

export interface Dossier extends DashboardDossier {
  studentCode: string
  program: string
  updatedBy: string
  updatedAtTime: string
  academic?: AcademicData
  importBatch?: ImportBatch
}
export type DossierInput = Omit<Dossier, 'updatedAt' | 'updatedBy' | 'updatedAtTime' | 'defenseAt' | 'defenseResult' | 'academic' | 'importBatch'>
