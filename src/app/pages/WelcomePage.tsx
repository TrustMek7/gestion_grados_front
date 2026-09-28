import { ArrowRight, GraduationCap } from 'lucide-react'
import { Link } from 'react-router'
import { modules } from '../navigation'
import { Card } from '../../shared/ui/Card'
import { PageHeader } from '../../shared/ui/PageHeader'
import { brand } from '../../shared/config/brand'

export function WelcomePage() {
  return (
    <div className="space-y-8">
      <PageHeader title={brand.application} description="Un espacio para organizar la información académica y acompañar la gestión administrativa." />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 border-l-4 border-brand p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><GraduationCap size={32} aria-hidden="true" /></div>
          <div>
            <p className="mb-2 text-xs font-medium text-brand">{brand.university}</p>
            <h2 className="text-xl font-semibold">Bienvenido al espacio de gestión</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Explora los módulos de la plataforma. Las funciones administrativas y el panel de indicadores se incorporarán en las próximas entregas.</p>
          </div>
        </div>
      </Card>
      <section aria-labelledby="modules-title">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="modules-title" className="text-lg font-semibold">Módulos de gestión</h2>
          <span className="text-xs text-muted">Acceso a las áreas de trabajo</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map(({ path, label, icon: Icon, description }, index) => (
            <Link key={path} to={path} className="group flex flex-col rounded-lg border border-outline bg-white p-6 transition-colors hover:border-brand/50 hover:bg-brand-soft/15">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-lg bg-brand-soft/60 p-3 text-brand"><Icon size={23} aria-hidden="true" /></span>
                <span className="text-xs font-medium text-muted">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{label}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{description}</p>
              <span className="mt-6 flex items-center gap-2 text-sm font-medium text-brand">Explorar módulo<ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
