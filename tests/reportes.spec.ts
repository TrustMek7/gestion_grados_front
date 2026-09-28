import { expect, test } from '@playwright/test'
import ExcelJS from 'exceljs'
import { initialDossiers, storageKey } from '../src/features/expedientes/dossier-model'
import { buildReport, emptyReportFilters } from '../src/features/reportes/report-model'

test('criterios de reportes: fechas, resultados pendientes y agrupaciones', () => {
  const records = initialDossiers()
  expect(buildReport(records, 'estadisticas', emptyReportFilters, '2026-09-28').stats).toEqual([['Expedientes ingresados', 12], ['Sustentados', 5], ['Completados', 3]])
  records[0].defenseAt = '2026-09-20'
  records[0].defenseResult = 'Pendiente'
  expect(buildReport(records, 'trabajos', emptyReportFilters, '2026-09-28').table.rows).toHaveLength(5)
  records[0].defenseResult = 'Desaprobado'
  expect(buildReport(records, 'trabajos', emptyReportFilters, '2026-09-28').table.rows).toHaveLength(6)
  const filtered = buildReport(records, 'estadisticas', { ...emptyReportFilters, year: '2025' }, '2026-09-28')
  expect(filtered.stats[0][1]).toBe(2)
  expect(filtered.table.rows.every((row) => row[0] === '2025')).toBe(true)
})

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Continuar con Google' }).click()
  await expect(page).toHaveURL(/\/inicio$/)
})

test('estadísticas filtradas y Excel con datos completos y filtros', async ({ page }, testInfo) => {
  await page.goto('/reportes')
  await expect(page.getByLabel('Indicadores del reporte').locator('dd')).toHaveText(['12', '5', '3'])
  await page.getByLabel('Año de ingreso').selectOption('2025')
  await expect(page.getByLabel('Indicadores del reporte').locator('dd')).toHaveText(['2', '1', '1'])
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar a Excel (.xlsx)' }).click()
  const download = await downloading
  expect(download.suggestedFilename()).toBe('UNSA-estadisticas-2025-mock.xlsx')
  const path = testInfo.outputPath('reporte.xlsx')
  await download.saveAs(path)
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(path)
  expect(workbook.getWorksheet('Resultados')!.rowCount).toBe(3)
  expect(workbook.getWorksheet('Resultados')!.getCell('A2').value).toBe('2025')
  expect(JSON.stringify(workbook.getWorksheet('Filtros y criterios')!.getSheetValues())).toContain('2025')
  expect(workbook.getWorksheet('Resumen')!.getCell('B2').value).toBe(2)
  await page.getByLabel('Escuela del expediente').selectOption('Administración')
  await expect(page.getByRole('heading', { name: 'Sin datos para este reporte' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Exportar a Excel (.xlsx)' })).toBeDisabled()
})

test('reportes académicos toman resoluciones y sorteos del mock, exportan todas las páginas', async ({ page }, testInfo) => {
  const records = initialDossiers()
  for (const record of records) {
    record.modality = 'Tesis'
    record.academic = {
      resolutions: [{ id: 'R-1', number: '=RES-DEMO', date: '2026-09-20', type: 'Otro', description: '' }],
      advisor: { teacherId: 'DOC-001', resolutionId: 'R-1' },
      jury: { members: [{ teacherId: 'DOC-002', role: 'Presidente' }], resolutionId: 'R-1' },
      draws: [{ id: 'S-1', date: '2026-09-20', teacherIds: ['DOC-001', 'DOC-002'], resolutionId: 'R-1' }],
    }
  }
  await page.evaluate(({ records, storageKey }) => sessionStorage.setItem(storageKey, JSON.stringify(records)), { records, storageKey })
  await page.goto('/reportes?tipo=docentes')
  await page.getByLabel('Docente', { exact: true }).selectOption('DOC-001')
  await expect(page.getByLabel('Indicadores del reporte').locator('dd')).toHaveText(['12', '0', '12'])
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar a Excel (.xlsx)' }).click()
  const path = testInfo.outputPath('docentes.xlsx')
  await (await downloading).saveAs(path)
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(path)
  expect(workbook.getWorksheet('Resultados')!.rowCount).toBe(13)
  expect(workbook.getWorksheet('Resultados')!.getCell('G2').value).toBe('=RES-DEMO')
  expect(workbook.getWorksheet('Resultados')!.getCell('G2').type).toBe(ExcelJS.ValueType.String)
  await page.getByLabel('Docente', { exact: true }).selectOption('DOC-002')
  await expect(page.getByLabel('Indicadores del reporte').locator('dd')).toHaveText(['0', '12', '12'])
  await expect(page.getByRole('table')).toContainText('Jurado · Presidente')
  await page.getByRole('link', { name: 'Sorteos externos', exact: true }).click()
  await expect(page.getByLabel('Indicadores del reporte').locator('dd')).toHaveText(['12', '2', '12'])
  await expect(page.getByRole('table')).toContainText('Elena Vargas; Rafael Montes')
  await page.getByLabel('Año del sorteo').selectOption('2025')
  await expect(page.getByRole('heading', { name: 'Sin datos para este reporte' })).toBeVisible()
})

test('trabajos agrupados, rutas y diseño responsive', async ({ page }, testInfo) => {
  await page.goto('/reportes?tipo=trabajos')
  await page.getByLabel('Año de sustentación').selectOption('2025')
  await expect(page.getByRole('table')).toContainText('Elena Ruiz')
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1)
  for (const type of ['estadisticas', 'docentes', 'sorteos', 'trabajos']) {
    await page.goto(`/reportes?tipo=${type}`)
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      if (type === 'estadisticas' && width !== 320) await page.screenshot({ path: testInfo.outputPath(`reportes-${width}.png`), fullPage: true })
    }
  }
  await page.reload()
  await expect(page.getByRole('link', { name: 'Trabajos sustentados', exact: true })).toHaveAttribute('aria-current', 'page')
})
