import { expect, test } from '@playwright/test'
import ExcelJS from 'exceljs'
import { importColumns, reviewImport } from '../src/features/administracion/import-model'
import { initialDossiers } from '../src/features/expedientes/dossier-model'

const validRow = ['HIST-2024-001', 'Graduando Histórico Demo', 'HIST-GR-001', 'Ingeniería de Sistemas', '', 'Título profesional', 'Tesis', 'En trámite', '2024-03-01', 'Trabajo histórico ficticio']
async function excel(rows: unknown[][], headers = importColumns.map(([, label]) => label)) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Expedientes')
  sheet.addRows([headers, ...rows])
  return { name: 'historico-demo.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(await workbook.xlsx.writeBuffer()) }
}

test('la revisión rechaza todos los duplicados del lote y conserva los existentes', () => {
  const { updatedAt: _date, updatedBy: _user, updatedAtTime: _time, ...input } = initialDossiers()[0]
  void _date; void _user; void _time
  const rows = reviewImport([{ line: 2, input, errors: [], warnings: [] }, { line: 3, input, errors: [], warnings: [] }], initialDossiers())
  expect(rows.every((row) => row.errors.some((error) => error.includes('repetido dentro')) && row.errors.some((error) => error.includes('ya existe')))).toBe(true)
})

test.describe('administración mock en navegador', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Continuar con Google' }).click()
    await expect(page).toHaveURL(/\/inicio$/)
    await page.goto('/administracion')
  })

  test('plantilla, previsualización, cancelación, importación parcial y edición posterior', async ({ page }, testInfo) => {
    const downloading = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Descargar plantilla', exact: true }).click()
    const path = testInfo.outputPath('plantilla.xlsx')
    await (await downloading).saveAs(path)
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(path)
    expect(workbook.getWorksheet('Expedientes')!.getCell('A1').value).toBe('Expediente')
    const file = await excel([validRow, ['DEMO-2026-0010', ...validRow.slice(1)], ['HIST-INVALIDO', ...validRow.slice(1, 8), '2099-01-01', validRow[9]]])
    await page.getByLabel('Archivo histórico Excel').setInputFiles(file)
    await expect(page.getByRole('heading', { name: 'Previsualización de la carga' })).toBeVisible()
    await expect(page.getByRole('table')).toContainText('ya existe')
    await expect(page.getByRole('table')).toContainText('no sea posterior a hoy')
    await page.getByRole('button', { name: 'Cancelar carga' }).click()
    await page.goto('/expedientes')
    await page.getByLabel('Buscar expediente').fill('HIST-2024-001')
    await expect(page.getByRole('heading', { name: 'No se encontraron expedientes' })).toBeVisible()
    await page.goto('/administracion')
    await page.getByLabel('Archivo histórico Excel').setInputFiles(file)
    await page.getByRole('button', { name: 'Confirmar importación (1)' }).click()
    await expect(page.getByRole('status')).toContainText('1 importados, 2 rechazados')
    await page.reload()
    await expect(page.getByText('historico-demo.xlsx', { exact: true })).toBeVisible()
    await page.getByLabel('Archivo histórico Excel').setInputFiles(file)
    await expect(page.getByRole('button', { name: 'Confirmar importación (0)' })).toBeDisabled()
    await page.goto('/expedientes/HIST-2024-001')
    await expect(page.getByRole('heading', { name: 'Graduando Histórico Demo' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Origen de carga histórica' })).toBeVisible()
    await page.getByRole('link', { name: 'Editar expediente' }).click()
    await page.getByLabel('Nombres y apellidos').fill('Histórico actualizado')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()
    await expect(page.getByRole('heading', { name: 'Histórico actualizado' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Origen de carga histórica' })).toBeVisible()
    await page.goto('/reportes')
    await page.getByLabel('Año de ingreso').selectOption('2024')
    await expect(page.getByLabel('Indicadores del reporte').locator('dd')).toHaveText(['1', '0', '0'])
  })

  test('archivos inválidos, encabezados y fórmulas no se importan', async ({ page }) => {
    await page.getByLabel('Archivo histórico Excel').setInputFiles({ name: 'datos.csv', mimeType: 'text/csv', buffer: Buffer.from('datos') })
    await expect(page.getByRole('alert')).toContainText('.xlsx')
    await page.getByLabel('Archivo histórico Excel').setInputFiles(await excel([validRow], ['Cabecera incorrecta']))
    await expect(page.getByRole('alert')).toContainText('columnas')
    await page.getByLabel('Archivo histórico Excel').setInputFiles(await excel([]))
    await expect(page.getByRole('alert')).toContainText('no contiene registros')
    await page.getByLabel('Archivo histórico Excel').setInputFiles(await excel([[...validRow.slice(0, 9), { formula: '1+1', result: 2 }]]))
    await expect(page.getByRole('table')).toContainText('sin fórmulas')
    await expect(page.getByRole('button', { name: 'Confirmar importación (0)' })).toBeDisabled()
  })

  test('accesos: validación, duplicados, activación y persistencia', async ({ page }) => {
    await page.getByRole('link', { name: 'Accesos mock', exact: true }).click()
    await page.getByRole('button', { name: 'Registrar acceso mock' }).click()
    await expect(page.getByRole('alert')).toContainText('nombre')
    await page.getByLabel('Nombre del administrativo').fill('Administrativo Prueba')
    await page.getByLabel('Correo de demostración').fill('sin-correo')
    await page.getByRole('button', { name: 'Registrar acceso mock' }).click()
    await expect(page.getByRole('alert')).toContainText('correo válido')
    await page.getByLabel('Correo de demostración').fill('PRUEBA@DEMO.INVALID')
    await page.getByRole('button', { name: 'Registrar acceso mock' }).click()
    await expect(page.getByRole('status')).toContainText('Acceso mock registrado')
    await page.getByLabel('Nombre del administrativo').fill('Duplicado')
    await page.getByLabel('Correo de demostración').fill('prueba@demo.invalid')
    await page.getByRole('button', { name: 'Registrar acceso mock' }).click()
    await expect(page.getByRole('alert')).toContainText('ya está registrado')
    await page.getByRole('button', { name: 'Desactivar acceso de Administrativo Prueba', exact: true }).click()
    await page.reload()
    await page.getByLabel('Buscar acceso').fill('prueba@demo.invalid')
    await expect(page.getByText('Inactivo', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Activar acceso de Administrativo Prueba', exact: true }).click()
    await expect(page.getByText('Activo', { exact: true })).toBeVisible()
  })

  test('carga y accesos se adaptan a móvil y escritorio', async ({ page }, testInfo) => {
    await page.getByLabel('Archivo histórico Excel').setInputFiles(await excel([validRow]))
    for (const section of ['carga', 'accesos']) {
      if (section === 'accesos') await page.getByRole('link', { name: 'Accesos mock', exact: true }).click()
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        if (width !== 320) await page.screenshot({ path: testInfo.outputPath(`${section}-${width}.png`), fullPage: true })
      }
    }
  })
})
