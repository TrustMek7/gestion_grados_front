import { Link, useSearchParams } from 'react-router'
import { PageHeader } from '../../shared/ui/PageHeader'
import { ImportPanel } from './ImportPanel'
import { AccessPanel } from './AccessPanel'

export function AdministrationPage() {
  const [params] = useSearchParams()
  const access = params.get('seccion') === 'accesos'
  return <div className="space-y-6">
    <PageHeader title="Administración" description="Carga inicial de información histórica y accesos administrativos de demostración UNSA." />
    <nav aria-label="Secciones de administración" className="flex flex-wrap gap-2 border-b border-outline pb-3">{[['carga', 'Carga histórica'], ['accesos', 'Accesos mock']].map(([key, label]) => <Link key={key} to={`?seccion=${key}`} aria-current={(key === 'accesos') === access ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium ${(key === 'accesos') === access ? 'bg-brand text-white' : 'text-muted hover:bg-brand-soft hover:text-brand'}`}>{label}</Link>)}</nav>
    {access ? <AccessPanel /> : <ImportPanel />}
  </div>
}
