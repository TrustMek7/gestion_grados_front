import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Continuar con Google' }).click()
  await expect(page).toHaveURL(/\/inicio$/)
})

test('indicadores coherentes con filtros, selección vacía y restablecimiento', async ({ page }) => {
  const stats = page.getByRole('region', { name: 'Indicadores de expedientes' }).locator('dd')
  await expect(stats).toHaveText(['10', '6', '2', '4'])
  await expect(page.getByRole('meter', { name: 'Observado', exact: true })).toHaveAttribute('aria-valuenow', '2')
  await page.getByLabel('Escuela profesional', { exact: true }).selectOption('Administración')
  await expect(stats).toHaveText(['2', '1', '0', '1'])
  await expect(page.getByText('1–2 de 2 expedientes', { exact: true })).toBeVisible()
  await page.getByLabel('Escuela profesional', { exact: true }).selectOption('Educación')
  await expect(stats).toHaveText(['0', '0', '0', '0'])
  await expect(page.getByRole('heading', { name: 'No se encontraron expedientes' })).toBeVisible()
  await expect(page.getByText('No hay próximas sustentaciones para esta selección.')).toBeVisible()
  await page.getByLabel('Año de ingreso').selectOption('2025')
  await expect(stats).toHaveText(['1', '0', '0', '1'])
  await page.getByRole('button', { name: 'Restablecer filtros' }).click()
  await expect(stats).toHaveText(['10', '6', '2', '4'])
  await page.getByLabel('Año de ingreso').selectOption('all')
  await expect(stats).toHaveText(['12', '7', '2', '5'])
})

test('tabla: búsqueda sin tildes, resumen, paginación y reinicio al filtrar', async ({ page }) => {
  await page.getByRole('button', { name: 'Página siguiente' }).click()
  await expect(page.getByText('7–10 de 10 expedientes', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Página siguiente' })).toBeDisabled()
  await page.getByRole('button', { name: 'Página anterior' }).click()
  await expect(page.getByText('1–6 de 10 expedientes', { exact: true })).toBeVisible()
  await page.getByLabel('Buscar en expedientes recientes').fill('lucia')
  await expect(page.getByText('1–1 de 1 expediente', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Ver resumen de DEMO-2026-0010' }).click()
  await expect(page.getByText('Organización digital de archivos académicos', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ocultar resumen de DEMO-2026-0010' })).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('button', { name: 'Ocultar resumen de DEMO-2026-0010' }).click()
  await expect(page.getByText('Organización digital de archivos académicos', { exact: true })).toBeHidden()
  await page.getByLabel('Buscar en expedientes recientes').fill('sin coincidencias')
  await expect(page.getByRole('heading', { name: 'No se encontraron expedientes' })).toBeVisible()
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click()
  await expect(page.getByText('1–6 de 10 expedientes', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Página siguiente' }).click()
  await page.getByLabel('Escuela profesional', { exact: true }).selectOption('Economía')
  await expect(page.getByText('1–2 de 2 expedientes', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
})

test('panel responsive y accesos rápidos', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [320, 390, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`panel-${width}.png`), fullPage: true })
  }
  await page.getByRole('link', { name: 'Reporte de graduados Estadísticas y acreditación' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reportes')
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel de control')
  expect(errors).toEqual([])
})
