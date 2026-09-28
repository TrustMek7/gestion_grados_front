# Gestión de Grados y Títulos — UNSA

Frontend administrativo de la **Universidad Nacional de San Agustín**.

## Estado

Entrega 2: identidad institucional, componentes compartidos y navegación responsive
sobre React + Vite + TypeScript + Tailwind CSS. Menú lateral fijo desde 1280 px y
panel modal en pantallas pequeñas, con cierre por Escape, fondo o selección.

Rutas: `/inicio`, `/expedientes`, `/docentes`, `/reportes` y `/administracion`.
El inicio permite explorar las áreas; los módulos muestran su alcance y estado
de preparación. El dashboard, las funciones de negocio, la autenticación y la
integración con Spring Boot se implementarán en sus entregas correspondientes.
Esta vista previa no representa una sesión autenticada ni contiene datos reales.
Las referencias originales se conservan en `mockups/`.

## Requisitos y ejecución

Node.js 22.13 o superior de la rama 22, o Node.js 24 o superior, y npm.

Desde `gestion_grados_front`:

```sh
npm ci
npm run dev
```

Abrir la URL indicada por Vite, normalmente http://localhost:5173.
En PowerShell, si se bloquea `npm.ps1`, usar `npm.cmd` en lugar de `npm`,
sin cambiar la política de ejecución del equipo.

## Comandos

| Comando | Propósito |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo. |
| `npm run typecheck` | Validación TypeScript. |
| `npm run lint` | Análisis estático sin advertencias. |
| `npm run build` | Validación de tipos y compilación en `dist/`. |
| `npm run check` | Lint y compilación. |
| `npm run preview` | Servir la compilación local; requiere build previo. |
| `npm run test:e2e` | Pruebas de navegación y menú responsive en navegador. |

## Estructura

```text
src/
  app/         # Rutas, navegación, layout y páginas provisionales
  features/    # Módulos funcionales, incorporados por entrega
  shared/      # Identidad centralizada y componentes de interfaz
  styles/      # Tailwind y tokens visuales
  main.tsx     # Punto de entrada
mockups/       # Referencias visuales originales
```

Tailwind usa `@tailwindcss/vite` y tokens CSS mediante `@theme`.
Inter se sirve desde el paquete local `@fontsource/inter`.
El escaneo de clases se limita a `src/` para excluir los mockups.

La marca está centralizada en `src/shared/config/brand.ts`. Se utiliza una marca
tipográfica UNSA; el icono académico es genérico y no representa el escudo oficial.
Los componentes compartidos son `Brand`, `Button`, `Badge`, `Card`, `PageHeader`
y `EmptyState`. Los colores semánticos se reservan para estados operativos.

## Verificación en navegador

Instalar Chromium una vez y ejecutar las pruebas:

```sh
npx playwright install chromium
npm run test:e2e
```

Si Microsoft Edge ya está instalado, en PowerShell se puede usar:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm.cmd run test:e2e
```

Las pruebas inician y cierran su servidor en el puerto 4173. Verifican rutas,
recarga, historial, foco por teclado, cierre del menú y ausencia de desborde
horizontal entre 320 y 1920 px. Las capturas quedan en `test-results/`, ignorado
por Git. La compilación incluye también el chequeo de tipos de las pruebas.

## Rutas en despliegue

`vercel.json` configura el retorno a `index.html` para las rutas de la SPA.
En otro alojamiento estático se debe configurar el mismo fallback para permitir
abrir y recargar rutas directamente. No se ha realizado ningún despliegue.

## Variables de entorno

`.env.example` documenta una URL propuesta del backend, todavía sin consumir.
Cuando sea necesario, copiarlo a `.env.local` y ajustar los valores.
Todas las variables `VITE_*` son públicas en el navegador: no colocar
contraseñas, claves privadas ni secretos OAuth/JWT.

## Control de versiones

Versionar el código, `package.json`, `package-lock.json` y `.env.example`.
El `.gitignore` excluye dependencias, compilados, cachés, logs, variables locales
y archivos de credenciales. Los mockups ya versionados se mantienen.

Cada entrega se verifica y se detiene para que el responsable haga el commit
y el push antes de autorizar la siguiente.
