# Gestión de Grados y Títulos — UNSA

Frontend administrativo de la **Universidad Nacional de San Agustín**.

## Estado

Entrega 8: reportes y exportación Excel, historial docente, expedientes y acceso simulado
sobre React + Vite + TypeScript + Tailwind CSS. Menú lateral fijo desde 1280 px y
panel modal en pantallas pequeñas, con cierre por Escape, fondo o selección.

Rutas: `/login`, `/inicio`, `/expedientes`, `/docentes`, `/reportes` y `/administracion`.
El inicio muestra indicadores, estados, próximas sustentaciones y expedientes
recientes. Expedientes permite registrar, consultar y editar datos básicos.
Los demás módulos muestran su alcance y estado de preparación;
sus funciones se incorporarán por entrega. Todo el acceso es mock: no hay SDK de Google, peticiones
de autenticación, tokens, contratos de API ni conexión al backend.
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

## Acceso de demostración

El proyecto abre la pantalla de acceso. **Continuar con Google** simula un acceso
autorizado después de una breve espera, sin abrir Google ni pedir credenciales.
En **Escenarios de demostración** se puede elegir acceso denegado, error de
autenticación o sesión vencida, y luego volver al escenario autorizado.

La sesión mock se conserva al recargar, en `sessionStorage`, durante 30 minutos.
Se guarda únicamente su fecha de vencimiento, sin datos personales ni tokens.
Cerrar sesión elimina ese estado y devuelve al login; las rutas internas redirigen
al login cuando no hay sesión mock. El acceso devuelve al módulo solicitado.
Este comportamiento es una simulación de interfaz, no un control de seguridad real.
El botón de salida y la etiqueta **Demo** están disponibles también en móvil.

## Panel de inicio (mock)

`src/features/dashboard/dashboard.mock.ts` contiene la base de 12 expedientes ficticios con
un corte fijo al 28 de septiembre de 2026. Los indicadores, distribución por estado,
agenda y tabla usan esa misma fuente y responden a los filtros de año de ingreso
y escuela. La selección inicial corresponde a los 10 expedientes ingresados en 2026.

- Activos: registrados, en trámite y observados.
- Observados: subconjunto de activos que requiere revisión.
- Sustentados: fecha hasta el corte y resultado Aprobado o Desaprobado.
- Próximas sustentaciones: las tres fechas pendientes posteriores al corte más cercanas.

La tabla se ordena por última actualización, busca por nombre, código o escuela
sin distinguir tildes, pagina de seis en seis y permite desplegar un resumen de
solo lectura. Su búsqueda afecta únicamente la tabla. Al cambiar los filtros
generales se restablecen búsqueda, página y resumen abierto.

Los accesos rápidos llevan a expedientes, docentes y reportes. No se implementan
alertas reglamentarias pendientes de formalización.
El panel comparte los registros con el contexto de expedientes; crear o editar
un expediente actualiza los indicadores y tablas de acuerdo con sus filtros.
No hay peticiones de datos, API ni contratos propuestos.

## Expedientes (mock)

- `/expedientes`: listado con búsqueda por número, graduando, código o título del
  trabajo; filtros combinados por escuela, año de ingreso, modalidad y estado.
- `/expedientes/nuevo`: formulario de registro con campos obligatorios, número
  único (sin distinguir mayúsculas), longitudes y fecha de inicio hasta hoy.
- `/expedientes/:id`: datos generales, asesor y jurado, resoluciones, sorteos externos y sustentación.
- `/expedientes/:id/editar`: edición de esos datos. Cancelar no guarda cambios.

La colección compartida en `features/expedientes` se guarda en `sessionStorage`
bajo `unsa.mock-dossiers.v1`. Se conserva al recargar o cerrar la sesión mock en
la misma pestaña; no se envía a ningún servicio. Usar únicamente datos ficticios.
Si el almacenamiento no está disponible, se advierte que los cambios solo duran
hasta la recarga. Los datos inválidos en almacenamiento recuperan la base de ejemplo.

Las escuelas, estados, modalidades y docentes son catálogos de demostración.
Las secciones del detalle se pueden abrir mediante `?seccion=asignaciones`,
`resoluciones`, `sorteos` o `sustentacion`.

- Asesor y jurado se vinculan a resoluciones del expediente. El jurado admite
  cargos parciales y evita repetir docentes entre Presidente, Secretario, Vocal y Accesitario.
- Las resoluciones se registran, buscan y editan conservando sus asociaciones.
  Los números son únicos dentro de cada expediente. Cambiar el tipo no puede
  invalidar asociaciones existentes. El listado de expedientes también busca por
  resolución, asesor e integrante del jurado.
- Los PDF son referencias mock: únicamente nombre y tamaño (hasta 10 MB).
  No se guarda contenido ni se ofrece descarga o carga a un servidor.
- Los sorteos registran resultados realizados externamente, con docentes, fecha
  y resolución. No hay selección aleatoria ni asignación automática del jurado.
- La sustentación registra fecha, resultado y observaciones. Una fecha futura
  solo admite resultado Pendiente. El resultado actualiza el dashboard y la agenda;
  el estado administrativo del expediente se edita por separado.

Los cambios académicos actualizan la fecha y el responsable mock. La edición
básica conserva estas secciones y valida la cronología de sorteos y sustentación.
Los registros de entregas anteriores se recuperan sin exigir información académica;
sus fechas de sustentación se conservan. Los ejemplos Sustentado/Completado se
interpretan como Aprobado mientras no se registre un resultado explícito.

## Docentes (mock)

- `/docentes`: catálogo de ocho docentes ficticios con búsqueda por nombre o código,
  filtro por escuela y totales de asesorías y participaciones como jurado.
- `/docentes/:id`: historial con expediente, graduando, trabajo, cargo, estado y
  resolución asociada. Filtros por participación y año de la resolución, con paginación.
- Los enlaces permiten consultar el expediente y sus resoluciones. Los totales de
  la ficha corresponden al historial completo, independientemente de los filtros.

El historial se calcula desde las designaciones guardadas en los expedientes;
no duplica datos. Inicialmente aparece vacío hasta registrar asesorías o jurados.
Editar una designación o resolución actualiza la consulta. Se muestran las
designaciones actuales de expedientes de cualquier año; no se implementa una
auditoría de versiones anteriores. Los resultados de sorteos no son designaciones
y no se cuentan como participaciones del jurado. Todo permanece en el mock local.

## Reportes y Excel (mock)

`/reportes` ofrece cuatro consultas, seleccionables con `?tipo=estadisticas`,
`docentes`, `sorteos` o `trabajos`. Los datos se calculan desde la colección local
de expedientes y responden a los filtros; cambiar de tipo restablece sus filtros.

- Estadísticas: cohortes por año de ingreso, escuela y modalidad, con cantidades
  ingresadas, sustentadas y distribución por estado. Completado representa el
  estado administrativo: no se presenta como un grado emitido, porque el mock
  no registra fecha de graduación ni emisión del grado.
- Asesores y jurados: participaciones en tesis por docente, escuela del expediente
  y año de resolución; incluye cargo, expediente y resolución. Se cuentan
  designaciones actuales, no versiones históricas de una designación.
- Sorteos externos: fecha, expediente, seleccionados y resolución; filtro por
  año del sorteo y escuela. No asigna jurados automáticamente.
- Trabajos sustentados: tesis y artículos ordenados por escuela y año de
  sustentación, con filtros de año, escuela y modalidad. Incluye Aprobado y
  Desaprobado hasta el corte mock (28/09/2026), excluyendo Pendiente.

La exportación genera un `.xlsx` real en el navegador, sin peticiones al backend.
Incluye todas las páginas filtradas en Resultados, indicadores en Resumen y los
filtros, marca UNSA y criterios en otra hoja. Sin resultados, se deshabilita la
descarga. Los textos se escriben como valores, no como fórmulas. ExcelJS se carga
bajo demanda al exportar; su paquete añade aproximadamente 256 KB comprimidos
a esa descarga, separado de la carga inicial de la aplicación.

## Comandos

| Comando | Propósito |
| --- | --- |
| `npm run dev` | Servidor local de desarrollo. |
| `npm run typecheck` | Validación TypeScript. |
| `npm run lint` | Análisis estático sin advertencias. |
| `npm run build` | Validación de tipos y compilación en `dist/`. |
| `npm run check` | Lint y compilación. |
| `npm run preview` | Servir la compilación local; requiere build previo. |
| `npm run test:e2e` | Pruebas de acceso mock, sesión, navegación y panel responsive. |

## Estructura

```text
src/
  app/         # Rutas, navegación, layout y páginas provisionales
  features/    # Auth, dashboard y expedientes mock
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
y `EmptyState`, además de `SelectField`. Los colores semánticos se reservan para estados operativos.

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
