import { useState } from 'react'
import type { ReactNode } from 'react'
import { mockUser } from '../auth/mock-session'
import { DossierContext } from './dossier-context'
import type { SaveResult } from './dossier-context'
import { readDossiers, storageKey, today, validateDossier } from './dossier-model'
import type { Dossier, DossierInput } from './types'

export function DossierProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState(readDossiers)
  const [storageWarning, setStorageWarning] = useState(false)

  function save(input: DossierInput, previousId?: string): SaveResult {
    const previous = records.find((item) => item.id === previousId)
    if (previousId && !previous) return { ok: false, message: 'El expediente ya no está disponible.' }
    const errors = validateDossier(input, records, previousId)
    if (Object.keys(errors).length) return { ok: false, message: Object.values(errors)[0]! }
    const record: Dossier = {
      ...previous, ...input, id: input.id.toUpperCase(), updatedAt: today(),
      updatedAtTime: new Date().toISOString(), updatedBy: mockUser.name,
    }
    const next = previous ? records.map((item) => item.id === previousId ? record : item) : [record, ...records]
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next))
      setStorageWarning(false)
    } catch { setStorageWarning(true) }
    setRecords(next)
    return { ok: true, id: record.id }
  }

  return <DossierContext.Provider value={{ records, storageWarning, save }}>{children}</DossierContext.Provider>
}
