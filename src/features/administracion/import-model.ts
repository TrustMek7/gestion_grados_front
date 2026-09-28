import type { Dossier, DossierInput } from '../expedientes/types'
import { validateDossier } from '../expedientes/dossier-model'

export const importColumns: [keyof DossierInput, string][] = [
  ['id', 'Expediente'], ['graduate', 'Graduando'], ['studentCode', 'Código del graduando'],
  ['school', 'Escuela'], ['program', 'Programa'], ['degree', 'Grado'], ['modality', 'Modalidad'],
  ['status', 'Estado'], ['openedAt', 'Fecha de inicio'], ['research', 'Título del trabajo'],
]
export interface ImportRow { line: number; input: DossierInput; errors: string[]; warnings: string[] }
export interface ImportBatch { id: string; file: string; date: string; user: string; total: number; accepted: number; rejected: number; observed: number }

export function reviewImport(rows: ImportRow[], records: Dossier[]): ImportRow[] {
  const counts = new Map<string, number>()
  rows.forEach((row) => counts.set(row.input.id.toUpperCase(), (counts.get(row.input.id.toUpperCase()) ?? 0) + 1))
  return rows.map((row) => {
    const errors = [...row.errors, ...Object.values(validateDossier(row.input, records))]
    if ((counts.get(row.input.id.toUpperCase()) ?? 0) > 1) errors.push('Número repetido dentro del archivo; corrige todas sus apariciones.')
    return { ...row, errors: [...new Set(errors)] }
  })
}

export async function readImport(file: File): Promise<ImportRow[]> {
  if (!/\.xlsx$/i.test(file.name) || !file.size || file.size > 5 * 1024 * 1024) throw new Error('Selecciona un archivo .xlsx de hasta 5 MB.')
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  try { await workbook.xlsx.load(await file.arrayBuffer()) } catch { throw new Error('No se pudo leer el Excel. Usa la plantilla de demostración.') }
  const sheet = workbook.getWorksheet('Expedientes')
  if (!sheet) throw new Error('Falta la hoja Expedientes. Usa la plantilla de demostración.')
  if (sheet.rowCount > 501) throw new Error('La demostración admite hasta 500 filas por archivo.')
  if (sheet.columnCount !== importColumns.length || importColumns.some(([, label], index) => sheet.getRow(1).getCell(index + 1).value !== label)) throw new Error('Las columnas no coinciden con la plantilla. Conserva sus encabezados y orden.')
  const rows: ImportRow[] = []
  sheet.eachRow((row, line) => {
    if (line === 1) return
    const values = importColumns.map((_, index) => row.getCell(index + 1).value)
    if (values.every((value) => value === null || value === undefined || value === '')) return
    const errors: string[] = []
    const fields = importColumns.map(([key], index) => {
      const value = values[index]
      if (value instanceof Date && key === 'openedAt') return [key, Number.isFinite(value.getTime()) ? value.toISOString().slice(0, 10) : '']
      if (value !== null && value !== undefined && typeof value !== 'string' && typeof value !== 'number') errors.push(`La columna ${importColumns[index][1]} debe contener un valor simple, sin fórmulas ni enlaces.`)
      return [key, typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '']
    })
    const input = Object.fromEntries(fields) as DossierInput
    input.id = input.id.toUpperCase()
    const warnings = ['Información académica no incluida: completa asesor, jurado, resoluciones y sustentación en el expediente.']
    rows.push({ line, input, errors, warnings })
  })
  if (!rows.length) throw new Error('La hoja Expedientes no contiene registros.')
  return rows
}

export async function downloadImportTemplate() {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Expedientes')
  sheet.addRow(importColumns.map(([, label]) => label))
  sheet.addRow(['HIST-DEMO-001', 'Persona Histórica Demo', 'HIST-GR-001', 'Ingeniería de Sistemas', '', 'Título profesional', 'Tesis', 'En trámite', '2024-03-01', 'Trabajo histórico de demostración'])
  sheet.columns.forEach((column) => { column.width = 28; column.numFmt = '@' })
  sheet.getRow(1).font = { bold: true }
  const instructions = workbook.addWorksheet('Instrucciones')
  instructions.addRows([
    ['UNSA · Plantilla de demostración'], ['Reemplaza la fila de ejemplo con datos ficticios. Máximo 500 filas y 5 MB.'],
    ['Conserva los encabezados y su orden; Programa puede quedar vacío.'],
    ['Fecha de inicio: AAAA-MM-DD o fecha Excel. Códigos como texto para conservar ceros iniciales.'],
    ['Escuela: Administración, Economía, Educación, Ingeniería Civil o Ingeniería de Sistemas.'],
    ['Grado: Bachiller o Título profesional. Modalidad: Tesis o Artículo de investigación.'],
    ['Estado: Registrado, En trámite, Observado, Sustentado o Completado.'],
    ['Solo datos básicos. Asesor, jurado, resoluciones y sustentación se completan desde el expediente.'],
    ['Los registros existentes y todos los números repetidos dentro del archivo se rechazan.'],
  ])
  instructions.getColumn(1).width = 110
  instructions.getColumn(1).alignment = { wrapText: true }
  const buffer = await workbook.xlsx.writeBuffer()
  const url = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = 'UNSA-plantilla-historica-mock.xlsx'
  document.body.append(anchor); anchor.click(); anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
