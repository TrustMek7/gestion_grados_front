import type { ReportData } from './report-model'

export async function downloadReport(report: ReportData, metadata: [string, string][], filename: string) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'UNSA · Universidad Nacional de San Agustín'
  const context = workbook.addWorksheet('Filtros y criterios')
  context.addRows([['Institución', 'UNSA · Universidad Nacional de San Agustín'], ['Datos', 'Demostración mock'], ['Reporte', report.table.title], ...metadata, ['Criterio', report.note]])
  context.columns = [{ width: 28 }, { width: 100 }]
  context.getColumn(2).alignment = { wrapText: true, vertical: 'top' }
  const summary = workbook.addWorksheet('Resumen')
  summary.addRows([['Indicador', 'Cantidad'], ...report.stats])
  summary.columns = [{ width: 35 }, { width: 18 }]
  const sheet = workbook.addWorksheet('Resultados')
  sheet.addRows([report.table.columns, ...report.table.rows])
  sheet.columns.forEach((column) => { column.width = 28; column.alignment = { wrapText: true, vertical: 'top' } })
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, sheet.rowCount), column: report.table.columns.length } }
  for (const worksheet of [summary, sheet]) {
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6D1B2D' } }
  }
  const buffer = await workbook.xlsx.writeBuffer()
  const url = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
