import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description: string; action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center sm:py-20">
      <div className="mb-5 rounded-xl bg-brand-soft/60 p-4 text-brand"><Icon size={28} aria-hidden="true" /></div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
