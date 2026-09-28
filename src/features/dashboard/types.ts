export type DossierStatus = 'Registrado' | 'En trámite' | 'Observado' | 'Sustentado' | 'Completado'

export interface DashboardDossier {
  id: string
  graduate: string
  school: string
  degree: 'Bachiller' | 'Título profesional'
  modality: 'Tesis' | 'Artículo de investigación'
  status: DossierStatus
  openedAt: string
  updatedAt: string
  defenseAt?: string
  research: string
}
