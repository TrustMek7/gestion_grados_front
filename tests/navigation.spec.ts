import { expect, test } from '@playwright/test'

test('navegación de escritorio, historial y recarga de rutas', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page).toHaveURL(/\/inicio$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gestión de Grados y Títulos')
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeHidden()
  await page.screenshot({ path: testInfo.outputPath('inicio-escritorio.png'), fullPage: true })

  for (const [label, path] of [['Expedientes', 'expedientes'], ['Docentes', 'docentes'], ['Reportes', 'reportes'], ['Administración', 'administracion']]) {
    const link = page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: label })
    await link.click()
    await expect(page).toHaveURL(new RegExp(`/${path}$`))
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(label)
    await expect(page.getByRole('main')).toBeFocused()
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(label)
  }
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reportes')
  expect(errors).toEqual([])
})

test('menú móvil: foco contenido, Escape, fondo y selección', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/inicio')
  const open = page.getByRole('button', { name: 'Abrir menú' })
  const dialog = page.getByRole('dialog', { name: 'Menú de navegación' })
  await open.click()
  await expect(dialog).toBeVisible()
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    await expect.poll(() => dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true)
  }
  await page.screenshot({ path: testInfo.outputPath('menu-movil.png'), fullPage: true })
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(open).toBeFocused()
  await open.click()
  await page.mouse.click(370, 300)
  await expect(dialog).toBeHidden()
  await open.click()
  await dialog.getByRole('link', { name: 'Expedientes' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Expedientes')
  await expect(page.getByRole('main')).toBeFocused()
})

test('sin desborde horizontal y cierre al pasar a escritorio', async ({ page }, testInfo) => {
  await page.goto('/administracion')
  for (const width of [320, 390, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (width === 320) await page.screenshot({ path: testInfo.outputPath('administracion-movil.png'), fullPage: true })
  }
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await page.setViewportSize({ width: 1280, height: 900 })
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible()
})

test('enlace para saltar al contenido y recuperación de una ruta desconocida', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/inicio')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Saltar al contenido principal' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.goto('/ruta-inexistente')
  await expect(page.getByRole('heading', { name: 'No encontramos esta página' })).toBeVisible()
  await page.getByRole('link', { name: 'Volver al inicio' }).click()
  await expect(page).toHaveURL(/\/inicio$/)
})
