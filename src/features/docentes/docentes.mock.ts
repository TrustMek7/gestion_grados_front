// Catálogo ficticio compartido por los selectores del expediente.
export const mockTeachers = [
  { id: 'DOC-001', name: 'Elena Vargas', school: 'Ingeniería de Sistemas' },
  { id: 'DOC-002', name: 'Rafael Montes', school: 'Ingeniería Civil' },
  { id: 'DOC-003', name: 'Patricia León', school: 'Administración' },
  { id: 'DOC-004', name: 'Jorge Rivas', school: 'Economía' },
  { id: 'DOC-005', name: 'Adriana Soto', school: 'Ingeniería de Sistemas' },
  { id: 'DOC-006', name: 'Daniel Fuentes', school: 'Educación' },
  { id: 'DOC-007', name: 'Mariana Vega', school: 'Administración' },
  { id: 'DOC-008', name: 'Héctor Salinas', school: 'Ingeniería Civil' },
]

export function teacherName(id: string) {
  return mockTeachers.find((teacher) => teacher.id === id)?.name ?? 'Docente no disponible'
}
