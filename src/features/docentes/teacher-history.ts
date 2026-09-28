import { academicData } from '../expedientes/academic/academic-model'
import type { Dossier } from '../expedientes/types'

export function teacherHistory(records: Dossier[], teacherId: string) {
  return records.flatMap((record) => {
    const data = academicData(record)
    const roles = [
      ...(data.advisor?.teacherId === teacherId ? [{ role: 'Asesor', resolutionId: data.advisor.resolutionId }] : []),
      ...(data.jury?.members.filter((member) => member.teacherId === teacherId).map((member) => ({ role: member.role, resolutionId: data.jury!.resolutionId })) ?? []),
    ]
    return roles.map((participation) => ({ record, role: participation.role, resolution: data.resolutions.find((item) => item.id === participation.resolutionId) }))
  }).sort((a, b) => (b.resolution?.date ?? '').localeCompare(a.resolution?.date ?? '') || a.record.id.localeCompare(b.record.id))
}
