import type { LucideIcon } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'

export function StatCard({ title, value, description, icon: Icon, attention = false }: {
  title: string; value: number; description: string; icon: LucideIcon; attention?: boolean
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex flex-1 items-start justify-between gap-3 p-5">
        <dl><dt className="text-sm font-medium text-muted">{title}</dt><dd className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{value}</dd></dl>
        <span className={`rounded-lg p-2.5 ${attention && value > 0 ? 'bg-danger-soft text-danger' : 'bg-brand-soft/60 text-brand'}`}><Icon size={21} aria-hidden="true" /></span>
      </div>
      <p className="border-t border-outline bg-canvas px-5 py-3 text-xs leading-5 text-muted">{description}</p>
    </Card>
  )
}
