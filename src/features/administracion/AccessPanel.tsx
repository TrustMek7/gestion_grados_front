import { useState } from 'react'
import { Card } from '../../shared/ui/Card'
import { InputField } from '../../shared/ui/InputField'
import { Button } from '../../shared/ui/Button'
import { Badge } from '../../shared/ui/Badge'
import { mockUser } from '../auth/mock-session'
import { normalizeSearch } from '../dashboard/dashboard-model'

interface Access { id: string; name: string; email: string; active: boolean; updatedAt: string }
const accessKey = 'unsa.mock-access.v1'
function readAccess(): Access[] {
  const initial = [{ id: 'current', name: mockUser.name, email: mockUser.email, active: true, updatedAt: '2026-09-28T12:00:00Z' }]
  try {
    const data: unknown = JSON.parse(sessionStorage.getItem(accessKey) ?? 'null')
    if (Array.isArray(data) && data.length && data.every((item: unknown) => {
      if (!item || typeof item !== 'object') return false
      const row = item as Record<string, unknown>
      return ['id', 'name', 'email', 'updatedAt'].every((key) => typeof row[key] === 'string') && typeof row.active === 'boolean' && Number.isFinite(Date.parse(row.updatedAt as string))
    }) && data.some((item: Access) => item.id === 'current' && item.email === mockUser.email && item.active)) return data
  } catch { /* La demostración puede funcionar en memoria. */ }
  return initial
}

export function AccessPanel() {
  const [accesses, setAccesses] = useState(readAccess)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [storageWarning, setStorageWarning] = useState(false)
  function persist(next: Access[]) {
    try { sessionStorage.setItem(accessKey, JSON.stringify(next)); setStorageWarning(false) } catch { setStorageWarning(true) }
    setAccesses(next)
  }
  const results = accesses.filter((access) => normalizeSearch(`${access.name} ${access.email}`).includes(normalizeSearch(query)))
  return <div className="space-y-6">
    <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Accesos administrativos de demostración</h2><p className="mt-2 text-sm leading-6 text-muted">Simula el registro y la activación de personal administrativo. Esta lista no cambia el login mock, no verifica cuentas institucionales y no envía invitaciones.</p><form noValidate className="mt-5 space-y-5" onSubmit={(event) => {
      event.preventDefault(); setError(''); setSuccess('')
      const normalized = email.trim().toLowerCase()
      if (!name.trim() || name.trim().length > 120) { setError('Ingresa un nombre de hasta 120 caracteres.'); return }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 254) { setError('Ingresa un correo válido de demostración.'); return }
      if (accesses.some((access) => access.email.toLowerCase() === normalized)) { setError('Este correo ya está registrado.'); return }
      persist([...accesses, { id: crypto.randomUUID(), name: name.trim(), email: normalized, active: true, updatedAt: new Date().toISOString() }])
      setName(''); setEmail(''); setSuccess('Acceso mock registrado. No se envió ninguna invitación.')
    }}><div className="grid gap-5 sm:grid-cols-2"><InputField label="Nombre del administrativo" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} /><InputField label="Correo de demostración" required type="email" maxLength={254} placeholder="persona@demo.invalid" value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="flex flex-wrap justify-end gap-3"><Button variant="secondary" onClick={() => { setName(''); setEmail(''); setError(''); setSuccess('') }}>Cancelar</Button><Button type="submit">Registrar acceso mock</Button></div></form></Card>
    {error && <p role="alert" className="rounded-lg bg-danger-soft p-4 text-sm text-danger">{error}</p>}
    {success && <p role="status" className="rounded-lg bg-success-soft p-4 text-sm text-success">{success}</p>}
    {storageWarning && <p role="alert" className="rounded-lg bg-warning-soft p-4 text-sm text-warning">Los accesos solo se conservarán hasta recargar; el almacenamiento de la pestaña no está disponible.</p>}
    <Card className="p-5 sm:p-6"><h2 className="text-lg font-semibold">Administrativos registrados</h2><div className="mt-5 max-w-lg"><InputField label="Buscar acceso" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o correo…" /></div><ul className="mt-5 divide-y divide-outline">{results.map((access) => <li key={access.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="break-words font-medium">{access.name}</p><p className="mt-1 break-all text-sm text-muted">{access.email}</p><p className="mt-2 text-xs text-muted">Administrativo · {new Date(access.updatedAt).toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>{access.id === 'current' && <p className="mt-2 text-xs text-muted">Cuenta de la sesión demo; permanece activa.</p>}</div><div className="flex flex-wrap items-center gap-3"><Badge tone={access.active ? 'success' : 'neutral'}>{access.active ? 'Activo' : 'Inactivo'}</Badge><Button variant="secondary" disabled={access.id === 'current'} aria-label={`${access.active ? 'Desactivar' : 'Activar'} acceso de ${access.name}`} onClick={() => {
      persist(accesses.map((item) => item.id === access.id ? { ...item, active: !item.active, updatedAt: new Date().toISOString() } : item))
      setError(''); setSuccess(`Acceso mock ${access.active ? 'desactivado' : 'activado'}.`)
    }}>{access.active ? 'Desactivar' : 'Activar'}</Button></div></li>)}</ul>{!results.length && <p className="mt-5 text-sm text-muted">No se encontraron accesos.</p>}</Card>
  </div>
}
