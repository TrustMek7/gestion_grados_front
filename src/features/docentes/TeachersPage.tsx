import { useState } from 'react'
import { Link } from 'react-router'
import { UsersRound, ArrowRight } from 'lucide-react'
import { Card } from '../../shared/ui/Card'
import { PageHeader } from '../../shared/ui/PageHeader'
import { InputField } from '../../shared/ui/InputField'
import { SelectField } from '../../shared/ui/SelectField'
import { Button } from '../../shared/ui/Button'
import { EmptyState } from '../../shared/ui/EmptyState'
import { normalizeSearch } from '../dashboard/dashboard-model'
import { useDossiers } from '../expedientes/dossier-context'
import { mockTeachers } from './docentes.mock'
import { teacherHistory } from './teacher-history'

export function TeachersPage() {
  const { records } = useDossiers()
  const [query, setQuery] = useState('')
  const [school, setSchool] = useState('')
  const teachers = mockTeachers.filter((teacher) => (!school || teacher.school === school) && normalizeSearch(`${teacher.name} ${teacher.id}`).includes(normalizeSearch(query)))
  return <div className="space-y-6">
    <PageHeader title="Docentes" description="Consulta de asesorías y participaciones como jurado. Catálogo de demostración UNSA." />
    <Card className="p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-2"><InputField label="Buscar docente" type="search" placeholder="Nombre o código del docente…" value={query} onChange={(event) => setQuery(event.target.value)} /><SelectField label="Escuela del docente" value={school} onChange={(event) => setSchool(event.target.value)}><option value="">Todas las escuelas</option>{[...new Set(mockTeachers.map((teacher) => teacher.school))].sort().map((value) => <option key={value}>{value}</option>)}</SelectField></div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-xs text-muted">{teachers.length} docentes encontrados</p><Button variant="ghost" onClick={() => { setQuery(''); setSchool('') }}>Limpiar filtros</Button></div>
    </Card>
    {teachers.length ? <ul className="grid gap-5 md:grid-cols-2">{teachers.map((teacher) => {
      const history = teacherHistory(records, teacher.id)
      return <li key={teacher.id}><Card className="h-full p-5 sm:p-6"><div className="flex items-start gap-3"><span className="rounded-lg bg-brand-soft p-3 text-brand"><UsersRound size={22} aria-hidden="true" /></span><div className="min-w-0"><p className="text-xs text-muted">{teacher.id}</p><h2 className="mt-1 text-lg font-semibold">{teacher.name}</h2><p className="mt-1 text-sm text-muted">{teacher.school}</p></div></div><dl className="my-5 grid grid-cols-2 gap-4 rounded-lg bg-canvas p-4"><div><dt className="text-xs text-muted">Asesorías</dt><dd className="mt-1 text-xl font-semibold">{history.filter((item) => item.role === 'Asesor').length}</dd></div><div><dt className="text-xs text-muted">Como jurado</dt><dd className="mt-1 text-xl font-semibold">{history.filter((item) => item.role !== 'Asesor').length}</dd></div></dl><Link to={`/docentes/${teacher.id}`} aria-label={`Ver historial de ${teacher.name}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:underline">Ver historial<ArrowRight size={16} aria-hidden="true" /></Link></Card></li>
    })}</ul> : <Card><EmptyState icon={UsersRound} title="No se encontraron docentes" description="Prueba otro nombre, código o escuela." /></Card>}
  </div>
}
