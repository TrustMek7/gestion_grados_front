import { Card } from '../../../shared/ui/Card'
import { statusOrder, statusTone } from '../dashboard-model'
import { Badge } from '../../../shared/ui/Badge'
import type { DashboardDossier } from '../types'

export function StatusDistribution({ records }: { records: DashboardDossier[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Distribución por estado</h2><span className="text-xs text-muted">{records.length} expedientes</span></div>
      <ul className="space-y-5">
        {statusOrder.map((status) => {
          const count = records.filter((item) => item.status === status).length
          const percentage = records.length ? Math.round(count / records.length * 100) : 0
          return (
            <li key={status}>
              <div className="mb-2 flex items-center justify-between gap-3"><Badge tone={statusTone[status]}>{status}</Badge><span className="text-xs tabular-nums text-muted">{count} <span aria-hidden="true">·</span> {percentage}%</span></div>
              <div role="meter" aria-label={status} aria-valuenow={count} aria-valuemin={0} aria-valuemax={Math.max(records.length, 1)} aria-valuetext={`${count} de ${records.length} expedientes`} className="h-1.5 overflow-hidden rounded-full bg-brand-soft/50">
                <div className="h-full rounded-full bg-brand" style={{ width: `${percentage}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
      {!records.length && <p className="mt-5 text-sm text-muted">No hay expedientes para los filtros seleccionados.</p>}
    </Card>
  )
}
