import { CalendarDays } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { defenseResult, formatDate } from '../dashboard-model'
import type { DashboardDossier } from '../types'

export function UpcomingDefenses({ records, referenceDate }: { records: DashboardDossier[]; referenceDate: string }) {
  const upcoming = records.filter((item) => item.defenseAt && item.defenseAt > referenceDate && defenseResult(item) === 'Pendiente')
    .sort((a, b) => a.defenseAt!.localeCompare(b.defenseAt!)).slice(0, 3)
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Próximas sustentaciones</h2>
      <p className="mt-1 text-xs leading-5 text-muted">Fechas registradas después del corte de demostración.</p>
      {upcoming.length ? (
        <ul className="mt-5 divide-y divide-outline">
          {upcoming.map((item) => <li key={item.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
            <span className="rounded-lg bg-brand-soft/60 p-2.5 text-brand"><CalendarDays size={19} aria-hidden="true" /></span>
            <div className="min-w-0"><p className="text-xs font-semibold text-brand">{formatDate(item.defenseAt!)}</p><p className="mt-1 text-sm font-medium">{item.graduate}</p><p className="mt-1 text-xs leading-5 text-muted">{item.school} · {item.id}</p></div>
          </li>)}
        </ul>
      ) : <p className="mt-6 rounded-lg bg-canvas p-5 text-sm leading-6 text-muted">No hay próximas sustentaciones para esta selección.</p>}
    </Card>
  )
}
