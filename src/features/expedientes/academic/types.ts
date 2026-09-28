export const juryRoles = ['Presidente', 'Secretario', 'Vocal', 'Accesitario'] as const
export const resolutionTypes = ['Asesor', 'Jurado', 'Sorteo', 'Otro'] as const
export const defenseResults = ['Pendiente', 'Aprobado', 'Desaprobado'] as const

export interface Resolution {
  id: string
  number: string
  date: string
  type: typeof resolutionTypes[number]
  description: string
  attachment?: { name: string; size: number }
}
export interface Advisor { teacherId: string; resolutionId: string }
export interface JuryMember { role: typeof juryRoles[number]; teacherId: string }
export interface Jury { members: JuryMember[]; resolutionId: string }
export interface DrawResult { id: string; date: string; teacherIds: string[]; resolutionId: string }
export interface Defense { date: string; result: typeof defenseResults[number]; notes: string }
export interface AcademicData {
  resolutions: Resolution[]
  advisor?: Advisor
  jury?: Jury
  draws: DrawResult[]
  defense?: Defense
}
