import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Continuar con Google' }).click()
  await expect(page).toHaveURL(/\/inicio$/)
})

async function fillDossier(page: Page, id: string) {
  await page.getByLabel('Número de expediente').fill(id)
  await page.getByLabel('Fecha de inicio').fill('2026-09-01')
  await page.getByLabel('Nombres y apellidos').fill('Persona de Prueba')
  await page.getByLabel('Código del graduando').fill('DEMO-GR-TEST')
  await page.getByLabel('Escuela profesional').selectOption('Ingeniería de Sistemas')
  await page.getByLabel('Especialidad o programa').fill('Programa de demostración')
  await page.getByLabel('Título de tesis o artículo').fill('Trabajo ficticio de verificación')
}

test('crear, recargar, editar y reflejar los cambios en el dashboard', async ({ page }) => {
  await page.goto('/expedientes')
  await page.getByRole('link', { name: 'Nuevo expediente', exact: true }).click()
  await fillDossier(page, 'DEMO-TEST-001')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page).toHaveURL(/\/expedientes\/DEMO-TEST-001$/)
  await expect(page.getByRole('status')).toHaveText('Expediente guardado en la demostración.')
  await expect(page.getByRole('heading', { name: 'Persona de Prueba' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Programa de demostración', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Editar expediente' }).click()
  await page.getByLabel('Nombres y apellidos').fill('Persona Actualizada')
  await page.getByLabel('Estado').selectOption('Observado')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByRole('heading', { name: 'Persona Actualizada' })).toBeVisible()
  await expect(page.getByText('Observado', { exact: true })).toBeVisible()
  await page.goto('/inicio')
  await expect(page.getByRole('region', { name: 'Indicadores de expedientes' }).locator('dd')).toHaveText(['11', '7', '3', '4'])
  await page.goto('/expedientes')
  await page.getByLabel('Buscar expediente').fill('Trabajo ficticio de verificacion')
  await expect(page.getByText('Persona Actualizada', { exact: true })).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('1–1 de 1 registros')
  // Un número normalizado a NUEVO no debe confundirse con la ruta /nuevo.
  await page.goto('/expedientes/nuevo')
  await fillDossier(page, 'nuevo')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page).toHaveURL(/\/expedientes\/NUEVO$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('NUEVO')
})

test('validaciones, número duplicado, cancelación y ruta desconocida', async ({ page }) => {
  await page.goto('/expedientes/nuevo')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page.getByRole('alert')).toContainText('Revisa los datos del expediente')
  await expect(page.getByLabel('Número de expediente')).toHaveAttribute('aria-invalid', 'true')
  await fillDossier(page, 'demo-2026-0010')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page.getByRole('alert')).toContainText('Este número de expediente ya existe.')
  await page.getByLabel('Número de expediente').fill('DEMO-NO-GUARDADO')
  await page.getByLabel('Fecha de inicio').fill('2099-01-01')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page.getByRole('alert')).toContainText('no sea posterior a hoy')
  await page.getByRole('link', { name: 'Cancelar', exact: true }).click()
  await page.getByLabel('Buscar expediente').fill('DEMO-NO-GUARDADO')
  await expect(page.getByRole('heading', { name: 'No se encontraron expedientes' })).toBeVisible()
  await page.goto('/expedientes/DEMO-2026-0010/editar')
  await page.getByLabel('Nombres y apellidos').fill('Cambio que se descarta')
  await page.getByRole('link', { name: 'Cancelar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Lucía Paredes' })).toBeVisible()
  await page.goto('/expedientes/NO-EXISTE/editar')
  await expect(page.getByRole('heading', { name: 'No encontramos este expediente' })).toBeVisible()
})

test('filtros combinados, paginación y pantallas responsive', async ({ page }, testInfo) => {
  await page.goto('/expedientes')
  await page.getByRole('button', { name: 'Página siguiente' }).click()
  await expect(page.getByRole('status')).toHaveText('7–12 de 12 registros')
  await page.getByLabel('Escuela profesional').selectOption('Ingeniería de Sistemas')
  await page.getByLabel('Estado', { exact: true }).selectOption('Observado')
  await expect(page.getByRole('status')).toHaveText('1–1 de 1 registros')
  await expect(page.getByText('Lucía Paredes', { exact: true })).toBeVisible()
  await page.getByLabel('Modalidad', { exact: true }).selectOption('Artículo de investigación')
  await expect(page.getByRole('heading', { name: 'No se encontraron expedientes' })).toBeVisible()
  await page.getByRole('button', { name: 'Limpiar filtros' }).click()
  await page.getByLabel('Año de ingreso').selectOption('2025')
  await expect(page.getByRole('status')).toHaveText('1–2 de 2 registros')
  await page.getByRole('button', { name: 'Limpiar filtros' }).click()
  for (const route of ['/expedientes', '/expedientes/nuevo', '/expedientes/DEMO-2026-0010']) {
    await page.goto(route)
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      if (width !== 320) await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '-')}-${width}.png`), fullPage: true })
    }
  }
})

test('incorporar observaciones, descripción de estados y búsqueda por observaciones', async ({ page }) => {
  await page.goto('/expedientes/nuevo')
  await fillDossier(page, 'DEMO-OBS-001')
  await page.getByLabel('Estado').selectOption('Observado')
  await expect(page.getByText('Estado Observado seleccionado')).toBeVisible()
  await page.getByLabel('Observaciones del trámite').fill('Falta constancia de idioma extranjero y firma de asesor')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page).toHaveURL(/\/expedientes\/DEMO-OBS-001$/)
  await expect(page.getByRole('region', { name: 'Observaciones del trámite' })).toContainText('Falta constancia de idioma extranjero')
  await page.goto('/expedientes')
  await page.getByLabel('Buscar expediente').fill('idioma extranjero')
  await expect(page.getByText('DEMO-OBS-001')).toBeVisible()
  await expect(page.getByText('Obs: Falta constancia de idioma extranjero')).toBeVisible()
})

test('datos del graduando: sugerencias de programa, registro y visualización en detalle', async ({ page }) => {
  await page.goto('/expedientes/nuevo')
  await page.getByLabel('Número de expediente').fill('DEMO-GRAD-001')
  await page.getByLabel('Fecha de inicio').fill('2026-09-01')
  await page.getByLabel('Nombres y apellidos').fill('Carlos Manuel Benavides')
  await page.getByLabel('Código del graduando').fill('2026-GR-9988')
  await page.getByLabel('Escuela profesional').selectOption('Ingeniería de Sistemas')
  // Probar botón de sugerencia de programa
  await expect(page.getByRole('button', { name: 'Ingeniería de Software' })).toBeVisible()
  await page.getByRole('button', { name: 'Ingeniería de Software' }).click()
  await expect(page.getByLabel('Especialidad o programa')).toHaveValue('Ingeniería de Software')
  await page.getByLabel('Título de tesis o artículo').fill('Sistema distribuido de validación académica')
  await page.getByRole('button', { name: 'Crear expediente' }).click()
  await expect(page).toHaveURL(/\/expedientes\/DEMO-GRAD-001$/)
  // Verificar tarjeta de datos del graduando
  await expect(page.getByRole('heading', { name: 'Carlos Manuel Benavides' })).toBeVisible()
  await expect(page.getByText('2026-GR-9988')).toBeVisible()
  await expect(page.getByText('Ingeniería de Software')).toBeVisible()
  // Probar botón Editar datos
  await page.getByRole('link', { name: 'Editar datos' }).click()
  await expect(page).toHaveURL(/\/expedientes\/DEMO-GRAD-001\/editar$/)
})

test('transición de estados y botones de acción rápida en detalle', async ({ page }) => {
  await page.goto('/expedientes/DEMO-2026-0009') // Mateo Salazar (En trámite)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DEMO-2026-0009')
  // Probar botón Cambiar estado y Cancelar
  await page.getByRole('button', { name: 'Cambiar estado' }).click()
  await expect(page.getByRole('heading', { name: 'Actualizar estado del expediente' })).toBeVisible()
  await page.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.getByRole('heading', { name: 'Actualizar estado del expediente' })).not.toBeVisible()

  // Cambiar a Observado
  await page.getByRole('button', { name: 'Cambiar estado' }).click()
  await page.locator('#quick-status-select').selectOption('Observado')
  await page.locator('#quick-observations-input').fill('Revisión urgente de firmas')
  await page.getByRole('button', { name: 'Guardar nuevo estado' }).click()
  await expect(page.getByRole('status')).toContainText('Estado actualizado a «Observado»')
  await expect(page.getByRole('region', { name: 'Observaciones del trámite' })).toContainText('Revisión urgente de firmas')

  // Cambiar de Observado a Completado
  await page.getByRole('button', { name: 'Cambiar estado' }).click()
  await page.locator('#quick-status-select').selectOption('Completado')
  await page.getByRole('button', { name: 'Guardar nuevo estado' }).click()
  await expect(page.getByRole('status')).toContainText('Estado actualizado a «Completado»')

  // Probar pestañas de navegación académica
  for (const tab of ['Asesor y jurado', 'Resoluciones', 'Sorteos externos', 'Sustentación', 'Datos generales']) {
    await page.getByRole('link', { name: tab, exact: true }).click()
  }
  // Probar botón Volver a expedientes
  await page.getByRole('link', { name: 'Volver a expedientes' }).click()
  await expect(page).toHaveURL(/\/expedientes$/)
})

test('botones de filtros rápidos por estado y botones de formulario', async ({ page }) => {
  await page.goto('/expedientes')
  // Probar botón de chip "En trámite"
  await page.getByRole('button', { name: /^En trámite/ }).click()
  await expect(page.getByRole('table')).toContainText('En trámite')
  // Probar botón de chip "Observado"
  await page.getByRole('button', { name: /^Observado/ }).click()
  await expect(page.getByRole('table')).toContainText('Observado')
  // Probar botón de chip "Completado"
  await page.getByRole('button', { name: /^Completado/ }).click()
  await expect(page.getByRole('table')).toContainText('Completado')
  // Probar botón de chip "Todos"
  await page.getByRole('button', { name: /^Todos/ }).click()
  await expect(page.getByRole('status')).toContainText('de 12 registros')

  // Probar botón "Limpiar filtros"
  await page.getByLabel('Buscar expediente').fill('Mateo')
  await page.getByRole('button', { name: 'Limpiar filtros' }).click()
  await expect(page.getByLabel('Buscar expediente')).toHaveValue('')

  // Probar botones "Volver sin guardar" y "Cancelar" en formulario
  await page.getByRole('link', { name: 'Nuevo expediente' }).click()
  await page.getByRole('link', { name: 'Volver sin guardar' }).click()
  await expect(page).toHaveURL(/\/expedientes$/)
  await page.getByRole('link', { name: 'Nuevo expediente' }).click()
  await page.getByRole('link', { name: 'Cancelar' }).click()
  await expect(page).toHaveURL(/\/expedientes$/)
})


