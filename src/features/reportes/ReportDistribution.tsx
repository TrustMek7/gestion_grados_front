import { Card } from '../../shared/ui/Card'
import type { ReportTable } from './report-model'

export function ReportDistribution({ table }: { table: ReportTable }) {
  const total = table.rows.reduce((sum, row) => sum + Number(row[3]), 0)
  const states = table.columns.slice(5).map((label, index) => [label, table.rows.reduce((sum, row) => sum + Number(row[index + 5]), 0)] as const)
  const modalities = [...new Set(table.rows.map((row) => String(row[2])))].map((label) => [label, table.rows.filter((row) => row[2] === label).reduce((sum, row) => sum + Number(row[3]), 0)] as const)
  return <div className="grid gap-5 lg:grid-cols-2">{[['Distribución por estado', states], ['Distribución por modalidad', modalities]] .map(([title, values]) => <Card key={String(title)} className="p-5 sm:p-6"><h2 className="text-lg font-semibold">{String(title)}</h2><ul className="mt-5 space-y-4">{(values as typeof states).map(([label, count]) => <li key={label}><div className="mb-2 flex justify-between gap-3 text-sm"><span>{label}</span><span className="font-semibold">{count}</span></div><div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-brand-soft"><div className="h-full rounded-full bg-brand" style={{ width: `${total ? count / total * 100 : 0}%` }} /></div></li>)}</ul>{!total && <p className="mt-4 text-sm text-muted">Sin expedientes para la selección.</p>}</Card>)}</div>
}
