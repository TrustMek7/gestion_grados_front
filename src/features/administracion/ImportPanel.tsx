import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Download, Upload } from 'lucide-react'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { InputField } from '../../shared/ui/InputField'
import { Badge } from '../../shared/ui/Badge'
import { useDossiers } from '../expedientes/dossier-context'
import { downloadReport } from '../reportes/export-report'
import { downloadImportTemplate, readImport, reviewImport } from './import-model'
import type { ImportRow } from './import-model'

export function ImportPanel() {
  const { records, importRecords, storageWarning } = useDossiers()
  const [rows, setRows] = useState<ImportRow[]>([])
  const [file, setFile] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const reviewed = reviewImport(rows, records)
  const valid = reviewed.filter((row) => !row.errors.length)
  const batches = [...new Map(records.flatMap((record) => record.importBatch ? [[record.importBatch.id, record.importBatch] as const] : [])).values()].sort((a, b) => b.date.localeCompare(a.date))
  async function action(task: () => Promise<void>) {
    setBusy(true); setError('')
    try { await task() } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo procesar el archivo.') }
    finally { setBusy(false) }
  }
  function reset() { setRows([]); setFile(''); setPage(1); if (inputRef.current) inputRef.current.value = '' }
  return <div className="space-y-6">
    <Card className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Carga histórica inicial</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Incorpora datos básicos de expedientes desde la plantilla de demostración. Revisa el resultado antes de confirmar la carga local.</p></div><Button variant="secondary" disabled={busy} onClick={() => action(downloadImportTemplate)}><Download size={16} aria-hidden="true" />Descargar plantilla</Button></div>
      <div className="mt-6 rounded-xl border border-dashed border-outline bg-canvas p-5"><Upload className="mb-4 text-brand" aria-hidden="true" /><InputField ref={inputRef} label="Archivo histórico Excel" type="file" accept=".xlsx" disabled={busy} onChange={(event) => {
        const selected = event.target.files?.[0]
        setRows([]); setPage(1); setMessage(''); setError(''); setFile(selected?.name ?? '')
        if (selected) void action(async () => setRows(await readImport(selected)))
      }} /><p className="mt-3 text-xs leading-5 text-muted">.xlsx · Hasta 5 MB y 500 filas. El archivo se lee en el navegador. Usa datos ficticios; nada se envía a un servidor.</p></div>
      <p className="mt-4 text-xs leading-5 text-muted">Esta plantilla carga datos generales. La información académica se completa después en cada expediente. Los lotes sirven para la carga inicial; el mantenimiento posterior se realiza desde Expedientes.</p>
    </Card>
    {busy && <p role="status" className="text-sm text-muted">Procesando archivo…</p>}
    {error && <p role="alert" className="rounded-lg bg-danger-soft p-4 text-sm text-danger">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">{message} <Link to="/expedientes" className="font-semibold underline">Consultar expedientes</Link></p>}
    {storageWarning && <p role="alert" className="rounded-lg bg-warning-soft p-4 text-sm text-warning">Los cambios solo se conservarán hasta recargar; el almacenamiento de la pestaña no está disponible.</p>}
    {!!rows.length && <Card className="min-w-0 overflow-hidden"><div className="space-y-4 p-5"><h2 id="import-preview" className="text-lg font-semibold">Previsualización de la carga</h2><p className="break-all text-sm text-muted">{file}</p><div className="flex flex-wrap gap-3"><Badge tone="success">{valid.length} válidos</Badge><Badge tone="danger">{reviewed.length - valid.length} rechazados</Badge><Badge tone="warning">{valid.filter((row) => row.warnings.length).length} válidos con observaciones</Badge></div><p className="text-xs leading-5 text-muted">Las observaciones no bloquean la carga. Los rechazados se omiten y no se sobrescriben expedientes existentes.</p></div>
      <div role="region" aria-labelledby="import-preview" tabIndex={0} className="overflow-x-auto"><table className="w-full min-w-200 text-left text-sm"><thead className="border-y border-outline bg-brand-soft/30 text-xs text-muted"><tr>{['Fila', 'Expediente / graduando', 'Escuela / inicio', 'Resultado', 'Detalle'].map((label) => <th key={label} scope="col" className="px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-outline">{reviewed.slice((page - 1) * 10, page * 10).map((row) => <tr key={row.line} className="align-top"><td className="px-5 py-4">{row.line}</td><td className="px-5 py-4"><p className="font-medium">{row.input.id || 'Sin número'}</p><p className="mt-1 text-muted">{row.input.graduate || 'Sin nombre'}</p></td><td className="px-5 py-4">{row.input.school}<p className="mt-1 text-xs text-muted">{row.input.openedAt}</p></td><td className="px-5 py-4"><Badge tone={row.errors.length ? 'danger' : 'success'}>{row.errors.length ? 'Rechazado' : 'Válido'}</Badge></td><td className="max-w-100 px-5 py-4"><p className="break-words text-xs leading-5">{[...row.errors, ...row.warnings].join(' ')}</p><details className="mt-2 text-xs"><summary className="cursor-pointer font-medium text-brand">Ver datos del registro</summary><p className="mt-2 break-words leading-5">Código: {row.input.studentCode} · Programa: {row.input.program || 'Sin registrar'} · {row.input.degree} · {row.input.modality} · {row.input.status} · {row.input.research}</p></details></td></tr>)}</tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline p-5"><span className="text-xs text-muted">Página {page} de {Math.ceil(rows.length / 10)}</span><div className="flex gap-2"><Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button><Button variant="secondary" disabled={page * 10 >= rows.length} onClick={() => setPage(page + 1)}>Siguiente</Button></div></div>
      <div className="flex flex-wrap justify-end gap-3 border-t border-outline p-5"><Button variant="ghost" disabled={busy} onClick={() => action(async () => downloadReport({ note: 'Revisión de carga histórica mock. Las observaciones no bloquean registros válidos.', stats: [['Válidos', valid.length], ['Rechazados', reviewed.length - valid.length]], table: { title: 'Observaciones de carga histórica', columns: ['Fila', 'Expediente', 'Resultado', 'Errores', 'Observaciones'], rows: reviewed.map((row) => [row.line, row.input.id, row.errors.length ? 'Rechazado' : 'Válido', row.errors.join(' '), row.warnings.join(' ')]) } }, [['Archivo', file]], 'UNSA-observaciones-carga-mock.xlsx'))}>Descargar observaciones</Button><Button variant="secondary" disabled={busy} onClick={() => { reset(); setError(''); setMessage('') }}>Cancelar carga</Button><Button disabled={busy || !valid.length} onClick={() => {
        const batch = importRecords(rows, file)
        if (!batch) { setError('No quedan registros válidos para importar. Revisa los duplicados.'); return }
        setMessage(`Carga completada: ${batch.accepted} importados, ${batch.rejected} rechazados y ${batch.observed} importados con observaciones.`)
        reset()
      }}>Confirmar importación ({valid.length})</Button></div>
    </Card>}
    <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Historial de cargas confirmadas</h2>{batches.length ? <ul className="mt-5 divide-y divide-outline">{batches.map((batch) => <li key={batch.id} className="space-y-2 py-4"><p className="break-all text-sm font-semibold">{batch.file}</p><p className="text-xs text-muted">{new Date(batch.date).toLocaleString('es-PE', { timeZone: 'America/Lima' })} · {batch.user}</p><p className="text-sm">{batch.accepted} importados · {batch.rejected} rechazados · {batch.observed} importados con observaciones · {batch.total} filas</p></li>)}</ul> : <p className="mt-4 text-sm text-muted">Todavía no se han confirmado cargas en esta demostración.</p>}</Card>
  </div>
}
