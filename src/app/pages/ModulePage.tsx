import { CircleDashed } from 'lucide-react'
import type { ModuleDefinition } from '../navigation'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { PageHeader } from '../../shared/ui/PageHeader'
import { EmptyState } from '../../shared/ui/EmptyState'

export function ModulePage({ module }: { module: ModuleDefinition }) {
  return (
    <div className="space-y-6">
      <PageHeader title={module.label} description={module.description} action={<Badge>En preparación</Badge>} />
      <Card><EmptyState icon={module.icon} title="Este módulo estará disponible próximamente" description="La navegación ya está disponible. Sus funciones se incorporarán en las siguientes entregas del proyecto." /></Card>
      <section aria-labelledby="scope-title">
        <h2 id="scope-title" className="mb-4 text-sm font-semibold">Funciones previstas</h2>
        <ul className="grid gap-3 lg:grid-cols-3">
          {module.sections.map((section) => (
            <li key={section} className="flex items-start gap-3 rounded-lg border border-outline bg-white p-4 text-sm leading-6 text-muted">
              <CircleDashed className="mt-1 shrink-0 text-brand" size={16} aria-hidden="true" />{section}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
