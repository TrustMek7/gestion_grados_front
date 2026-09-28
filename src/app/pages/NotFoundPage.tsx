import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '../../shared/ui/Card'
import { EmptyState } from '../../shared/ui/EmptyState'

export function NotFoundPage() {
  return (
    <Card>
      <h1 className="sr-only">Página no encontrada</h1>
      <EmptyState icon={FileQuestion} title="No encontramos esta página"
        description="La dirección no corresponde a un módulo de la plataforma. Puedes volver al inicio para continuar."
        action={<Link to="/inicio" className="inline-flex min-h-11 items-center rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-hover">Volver al inicio</Link>} />
    </Card>
  )
}
