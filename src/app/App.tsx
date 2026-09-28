import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './layout/AppLayout'
import { modules } from './navigation'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { ModulePage } from './pages/ModulePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AuthProvider } from '../features/auth/AuthProvider'
import { RequireAuth } from '../features/auth/RequireAuth'
import { LoginPage } from '../features/auth/LoginPage'
import { DossierProvider } from '../features/expedientes/DossierProvider'
import { DossiersPage } from '../features/expedientes/DossiersPage'
import { DossierDetailPage } from '../features/expedientes/DossierDetailPage'
import { DossierFormPage } from '../features/expedientes/DossierFormPage'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DossierProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/inicio" replace />} />
              <Route path="inicio" element={<DashboardPage />} />
              <Route path="expedientes" element={<DossiersPage />} />
              <Route path="expedientes/nuevo" caseSensitive element={<DossierFormPage />} />
              <Route path="expedientes/:id" element={<DossierDetailPage />} />
              <Route path="expedientes/:id/editar" element={<DossierFormPage />} />
              {modules.filter((module) => module.path !== '/expedientes').map((module) => (
                <Route key={module.path} path={module.path} element={<ModulePage module={module} />} />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
        </DossierProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
