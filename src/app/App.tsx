export function App() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-canvas p-6 font-sans text-ink">
      <section aria-labelledby="app-title" className="w-full max-w-xl rounded-xl border border-outline bg-white p-8 sm:p-10">
        <p className="text-3xl font-bold tracking-tight text-brand">UNSA</p>
        <p className="mt-1 text-sm text-muted">Universidad Nacional de San Agustín</p>
        <div className="my-8 h-px bg-outline" />
        <h1 id="app-title" className="text-2xl font-semibold">Gestión de Grados y Títulos</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Plataforma administrativa en desarrollo.
        </p>
      </section>
    </main>
  )
}
