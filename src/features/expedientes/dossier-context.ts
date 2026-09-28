import { createContext, useContext } from 'react'
import type { Dossier, DossierInput } from './types'
import type { AcademicData } from './academic/types'

export type SaveResult = { ok: true; id: string } | { ok: false; message: string }
export const DossierContext = createContext<{
  records: Dossier[]
  storageWarning: boolean
  save: (input: DossierInput, previousId?: string) => SaveResult
  saveAcademic: (id: string, data: AcademicData) => SaveResult
} | null>(null)

export function useDossiers() {
  const context = useContext(DossierContext)
  if (!context) throw new Error('useDossiers requiere DossierProvider')
  return context
}
