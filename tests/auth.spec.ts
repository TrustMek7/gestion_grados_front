import { expect, test } from '@playwright/test'

test('acceso mock, retorno a la ruta solicitada, recarga y cierre', async ({ page }, testInfo) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('data:')) externalRequests.push(request.url())
  })
  await page.goto('/expedientes')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByText('Acceso simulado.', { exact: false })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('login-escritorio.png'), fullPage: true })
  await page.clock.install()
  await page.clock.pauseAt(new Date(Date.now() + 1000))
  const button = page.getByRole('button', { name: 'Continuar con Google' })
  await button.click()
  await expect(page.getByRole('button', { name: 'Iniciando sesión…' })).toBeDisabled()
  await page.clock.fastForward(1000)
  await expect(page).toHaveURL(/\/expedientes$/)
  await expect(page.getByText('Demo', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Expedientes')
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto('/expedientes')
  await expect(page).toHaveURL(/\/login$/)
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('unsa.mock-session'))).toBeNull()
  expect(externalRequests).toEqual([])
})

test('escenarios de denegación, error y vencimiento con recuperación', async ({ page }) => {
  await page.goto('/login')
  await page.getByText('Escenarios de demostración', { exact: true }).click()
  for (const [value, title] of [['denied', 'Acceso no autorizado'], ['error', 'No se pudo iniciar sesión'], ['expired', 'Tu sesión ha vencido']]) {
    await page.getByLabel('Resultado del acceso simulado').selectOption(value)
    await page.getByRole('button', { name: 'Continuar con Google' }).click()
    await expect(page.getByRole('alert')).toContainText(title)
    await expect(page).toHaveURL(/\/login$/)
    expect(await page.evaluate(() => sessionStorage.getItem('unsa.mock-session'))).toBeNull()
  }
  await page.getByLabel('Resultado del acceso simulado').selectOption('authorized')
  await page.getByRole('button', { name: 'Continuar con Google' }).click()
  await expect(page).toHaveURL(/\/inicio$/)
})

test('una sesión vencida o corrupta no permite entrar', async ({ page }) => {
  await page.goto('/login')
  await page.evaluate(() => sessionStorage.setItem('unsa.mock-session', JSON.stringify({ expiresAt: Date.now() - 1000 })))
  await page.goto('/reportes')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('alert')).toContainText('Tu sesión ha vencido')
  await page.evaluate(() => sessionStorage.setItem('unsa.mock-session', '{invalid'))
  await page.goto('/reportes')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('button', { name: 'Continuar con Google' })).toBeEnabled()
})

test('vencimiento automático y login responsive', async ({ page }, testInfo) => {
  await page.clock.install()
  await page.goto('/login')
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 320) await page.screenshot({ path: testInfo.outputPath('login-movil.png'), fullPage: true })
  }
  await page.getByRole('button', { name: 'Continuar con Google' }).click()
  await page.clock.fastForward(1000)
  await expect(page).toHaveURL(/\/inicio$/)
  await page.clock.fastForward(30 * 60 * 1000)
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('alert')).toContainText('Tu sesión ha vencido')
})
