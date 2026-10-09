import { useState } from 'react'
import type { ReactNode } from 'react'
import { mockUser } from '../auth/mock-session'
import { DossierContext } from './dossier-context'
import type { SaveResult } from './dossier-context'
import { readDossiers, statuses, storageKey, today, validateDossier } from './dossier-model'
import type { Dossier, DossierInput } from './types'
import type { AcademicData } from './academic/types'
import type { DossierStatus } from '../dashboard/types'
import { validateAcademic } from './academic/academic-model'
import { reviewImport } from '../administracion/import-model'
import type { ImportBatch, ImportRow } from '../administracion/import-model'

export function DossierProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState(readDossiers)
  const [storageWarning, setStorageWarning] = useState(false)

  function persist(next: Dossier[]) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next))
      setStorageWarning(false)
    } catch { setStorageWarning(true) }
    setRecords(next)
  }

  function saveAcademic(id: string, data: AcademicData): SaveResult {
    const previous = records.find((record) => record.id === id)
    if (!previous) return { ok: false, message: 'El expediente ya no está disponible.' }
    const errors = validateAcademic(data, previous.openedAt, today())
    if (errors.length) return { ok: false, message: errors.join(' ') }
    const record: Dossier = { ...previous, academic: data, defenseAt: data.defense?.date, defenseResult: data.defense?.result,
      updatedAt: today(), updatedAtTime: new Date().toISOString(), updatedBy: mockUser.name }
    persist(records.map((item) => item.id === id ? record : item))
    return { ok: true, id }
  }

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
    persist(next)
    return { ok: true, id: record.id }
  }

  function updateStatus(id: string, nextStatus: DossierStatus, observations?: string): SaveResult {
    const previous = records.find((record) => record.id === id)
    if (!previous) return { ok: false, message: 'El expediente ya no está disponible.' }
    if (!statuses.includes(nextStatus)) return { ok: false, message: 'Estado inválido.' }
    if (observations && observations.length > 500) return { ok: false, message: 'Las observaciones no pueden superar los 500 caracteres.' }
    const updated: Dossier = {
      ...previous,
      status: nextStatus,
      observations: observations !== undefined ? observations.trim() : previous.observations,
      updatedAt: today(),
      updatedAtTime: new Date().toISOString(),
      updatedBy: mockUser.name,
    }
    persist(records.map((item) => item.id === id ? updated : item))
    return { ok: true, id }
  }

  function importRecords(rows: ImportRow[], file: string): ImportBatch | null {
    const reviewed = reviewImport(rows, records)
    const valid = reviewed.filter((row) => !row.errors.length)
    if (!valid.length) return null
    const batch: ImportBatch = { id: crypto.randomUUID(), file, date: new Date().toISOString(), user: mockUser.name,
      total: rows.length, accepted: valid.length, rejected: rows.length - valid.length, observed: valid.filter((row) => row.warnings.length).length }
    const imported: Dossier[] = valid.map(({ input, warnings }) => ({
      ...input,
      observations: input.observations || (warnings.length ? warnings.join(' ') : undefined),
      updatedAt: today(),
      updatedAtTime: batch.date,
      updatedBy: batch.user,
      importBatch: batch,
    }))
    persist([...imported, ...records])
    return batch
  }

  return <DossierContext.Provider value={{ records, storageWarning, save, updateStatus, saveAcademic, importRecords }}>{children}</DossierContext.Provider>
}
