# Documentación de Pruebas y Validación de Botones — Sprint 8

## Módulo: Gestión de Grados y Títulos (`gestion_grados_front`)
**Historia de Usuario:** Registrar datos del graduando y estados en trámite, observado y completado  
**Rama:** `feature/datos-graduando-estados`  
**Autor:** Paulo Andre Hidalgo Chinchay (`phidalgo@unsa.edu.pe`)  
**Fecha:** Octubre 2026  
**Requerimientos Funcionales:** RF-GT-02 (Registro y gestión de graduando) y RF-GT-05 (Estados y ciclo de vida de expedientes)

---

## 1. Resumen de Implementación y Alcance

En este sprint se implementaron y reforzaron las capacidades para:
1. **Datos del Graduando y Especialidad (RF-GT-02):**
   - Registro de datos personales y académicos del graduando (nombres, código, escuela profesional, mención/programa).
   - Botones de selección rápida y `<datalist>` predictivo con las especialidades y programas oficiales según la Escuela Profesional seleccionada (Sistemas, Sanitaria, Electrónica, Mecánica, etc.).
2. **Ciclo de Vida y Transición de Estados (RF-GT-05):**
   - Soporte y visualización explícita de todos los estados del catálogo: `Registrado`, `En trámite`, `Observado`, `Sustentado` y `Completado`.
   - Barra visual de ciclo de vida (*Stepper* de progreso) en la cabecera de detalle de expediente.
   - Formulario de acción rápida para transición de estados directamente en la ficha del expediente, permitiendo adjuntar observaciones administrativas de manera inmediata.
   - Botones de filtrado rápido (*chips*) en el catálogo de expedientes con contadores dinámicos por estado.

---

## 2. Matriz de Validación de Botones y Controles Interactivos

Todos los botones interactivos fueron testeados automatizadamente y comprobados para garantizar que ninguno rompa la aplicación ni altere datos indebidamente.

| Componente | Botón / Control | Acción / Comportamiento | Validación Automatizada | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **`DossiersPage`** | Botones de filtro rápido (`Todos`, `En trámite`, `Observado`, `Completado`, `Registrado`, `Sustentado`) | Filtra la tabla al estado seleccionado y muestra el total en un badge. | `tests/expedientes.spec.ts` (`botones de filtros rápidos por estado...`) | ✅ Verificado |
| **`DossiersPage`** | Botón "Nuevo expediente" | Redirige al formulario `/expedientes/nuevo`. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossiersPage`** | Botón "Limpiar" filtros | Restablece los filtros de búsqueda y devuelve la lista completa. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossiersPage`** | Botón "Descargar plantilla" / "Exportar" | Genera y descarga el archivo Excel oficial. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossierFormPage`**| Botones de sugerencias de especialidad / programa | Al hacer click en un botón sugerido (ej. "Ingeniería de Software"), rellena automáticamente el campo de texto. | `tests/expedientes.spec.ts` (`datos del graduando: sugerencias de programa...`) | ✅ Verificado |
| **`DossierFormPage`**| Botón "Guardar expediente" | Valida que los campos obligatorios estén completos y registra el expediente con auditoría. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossierFormPage`**| Botón "Cancelar" | Aborta el registro y redirige al listado general sin persistir borradores. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossierDetailPage`**| Botón "Cambiar estado" (Toggle) | Despliega el panel inline para actualizar el estado del expediente. | `tests/expedientes.spec.ts` (`transición de estados y botones de acción rápida...`) | ✅ Verificado |
| **`DossierDetailPage`**| Botón "Actualizar estado" | Confirma el nuevo estado seleccionado, actualiza observaciones y la fecha de última modificación. | `tests/expedientes.spec.ts` (`transición de estados y botones de acción rápida...`) | ✅ Verificado |
| **`DossierDetailPage`**| Botón "Cancelar" (en panel de estado) | Cierra el formulario de cambio de estado sin aplicar modificaciones. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossierDetailPage`**| Botón "Editar" expediente | Redirige a `/expedientes/:id/editar` con los datos cargados. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossierDetailPage`**| Botón "Volver" | Retorna a `/expedientes` respetando la navegación del usuario. | `tests/expedientes.spec.ts` | ✅ Verificado |
| **`DossierDetailPage`**| Pestañas académicas (`Asignación`, `Resolución`, `Sorteo`, `Sustentación`) | Cambia entre los paneles académicos vinculados sin recargar la página. | `tests/expedientes.spec.ts` (`transición de estados y botones de acción rápida...`) | ✅ Verificado |

---

## 3. Pruebas Automatizadas End-to-End (Playwright)

Se ejecutó la suite completa de pruebas End-to-End en el navegador Microsoft Edge / Chromium. Todas las pruebas pasaron satisfactoriamente (33 de 33 aprobadas, 0 fallos).

### 3.1. Casos de Prueba Específicos para el Sprint

1. **`datos del graduando: sugerencias de programa, registro y visualización en detalle`**
   - Abre el formulario de creación de expediente.
   - Selecciona la escuela "Ingeniería de Sistemas".
   - Verifica la aparición de los botones de especialidad recomendada ("Ingeniería de Software", "Ciencia de Datos y Analítica", etc.).
   - Hace clic en el botón interactivo de "Ingeniería de Software" y comprueba que el valor se escriba en el input.
   - Completa el registro del graduando con datos completos.
   - Navega al detalle y corrobora que el nombre del graduando, su escuela, mención y estado inicial se muestren correctamente.

2. **`transición de estados y botones de acción rápida en detalle`**
   - Ingresa al detalle de un expediente existente.
   - Hace clic en el botón "Cambiar estado".
   - Selecciona el nuevo estado "Observado" y escribe el motivo en el textarea de observaciones.
   - Pulsa el botón "Actualizar estado".
   - Comprueba que el badge de estado cambie a "Observado", se muestre la alerta con el motivo administrativo y se actualice el indicador de auditoría.
   - Interactúa con las pestañas de navegación académica para confirmar que no existan errores de renderizado.

3. **`botones de filtros rápidos por estado y botones de formulario`**
   - Ingresa a la vista principal de `/expedientes`.
   - Hace clic en los botones de filtro rápido (`En trámite`, `Observado`, `Completado`, `Todos`).
   - Verifica que cada botón filtre exclusivamente los registros con el estado indicado y actualice la URL (`?status=...`).
   - Abre el formulario y prueba el botón "Cancelar", comprobando el retorno limpio al catálogo.

4. **`incorporar observaciones, descripción de estados y búsqueda por observaciones`**
   - Verifica la creación de expedientes con observaciones opcionales.
   - Verifica la búsqueda predictiva filtrando por términos contenidos en las observaciones.
   - Valida que la descripción semántica de cada estado sea visible en la interfaz.

---

## 4. Resultados de la Ejecución

### Suite E2E Playwright:
```text
Running 33 tests using 2 workers

  ok  1 tests\academic.spec.ts:20:1 › resoluciones vinculadas, asesor, jurado y búsqueda persisten al recargar
  ok  2 tests\academic.spec.ts:54:1 › registrar y editar un resultado de sorteo externo sin asignar jurado
  ok  3 tests\academic.spec.ts:74:1 › sustentación valida fechas y actualiza indicadores sin perderse al editar
  ok  4 tests\academic.spec.ts:100:1 › secciones académicas se adaptan a móvil y escritorio
  ok  5 tests\administracion.spec.ts:14:1 › la revisión rechaza todos los duplicados del lote y conserva los existentes
  ok  6 tests\administracion.spec.ts:29:3 › plantilla, previsualización, cancelación, importación parcial y edición posterior
  ok  7 tests\administracion.spec.ts:67:3 › archivos inválidos, encabezados y fórmulas no se importan
  ok  8 tests\administracion.spec.ts:79:3 › accesos: validación, duplicados, activación y persistencia
  ok  9 tests\administracion.spec.ts:102:3 › carga y accesos se adaptan a móvil y escritorio
  ok 10 tests\auth.spec.ts:3:1 › acceso mock, retorno a la ruta solicitada, recarga y cierre
  ok 11 tests\auth.spec.ts:30:1 › escenarios de denegación, error y vencimiento con recuperación
  ok 12 tests\auth.spec.ts:45:1 › una sesión vencida o corrupta no permite entrar
  ok 13 tests\auth.spec.ts:57:1 › vencimiento automático y login responsive
  ok 14 tests\dashboard.spec.ts:9:1 › indicadores coherentes con filtros, selección vacía y restablecimiento
  ok 15 tests\dashboard.spec.ts:28:1 › tabla: búsqueda sin tildes, resumen, paginación y reinicio al filtrar
  ok 16 tests\dashboard.spec.ts:51:1 › panel responsive y accesos rápidos
  ok 17 tests\docentes.spec.ts:9:1 › buscar docentes, filtrar escuelas y consultar un historial vacío
  ok 18 tests\docentes.spec.ts:33:1 › el historial refleja asesorías, cargos y resoluciones del expediente
  ok 19 tests\expedientes.spec.ts:20:1 › crear, recargar, editar y reflejar los cambios en el dashboard
  ok 20 tests\expedientes.spec.ts:50:1 › validaciones, número duplicado, cancelación y ruta desconocida
  ok 21 tests\expedientes.spec.ts:73:1 › filtros combinados, paginación y pantallas responsive
  ok 22 tests\expedientes.spec.ts:97:1 › incorporar observaciones, descripción de estados y búsqueda por observaciones
  ok 23 tests\expedientes.spec.ts:112:1 › datos del graduando: sugerencias de programa, registro y visualización en detalle
  ok 24 tests\expedientes.spec.ts:135:1 › transición de estados y botones de acción rápida en detalle
  ok 25 tests\expedientes.spec.ts:167:1 › botones de filtros rápidos por estado y botones de formulario
  ok 26 tests\navigation.spec.ts:9:1 › navegación de escritorio, historial y recarga de rutas
  ok 27 tests\navigation.spec.ts:34:1 › menú móvil: foco contenido, Escape, fondo y selección
  ok 28 tests\navigation.spec.ts:59:1 › sin desborde horizontal y cierre al pasar a escritorio
  ok 29 tests\navigation.spec.ts:73:1 › enlace para saltar al contenido y recuperación de una ruta desconocida
  ok 30 tests\reportes.spec.ts:6:1 › criterios de reportes: fechas, resultados pendientes y agrupaciones
  ok 31 tests\reportes.spec.ts:25:1 › estadísticas filtradas y Excel con datos completos y filtros
  ok 32 tests\reportes.spec.ts:47:1 › reportes académicos toman resoluciones y sorteos del mock, exportan todas las páginas
  ok 33 tests\reportes.spec.ts:83:1 › trabajos agrupados, rutas y diseño responsive

33 passed (46.2s)
```

### Verificación de Linter y Compilación TypeScript:
```text
> npm run check
> eslint . --max-warnings 0
> tsc -b && vite build
✓ built in 670ms (0 errores, 0 advertencias)
```

---

## 5. Instrucciones para Ejecución Local de Pruebas

Para reproducir estas pruebas localmente en cualquier momento:

1. **Ejecutar verificación de tipos y linter:**
   ```powershell
   npm run check
   ```

2. **Ejecutar todas las pruebas E2E con Playwright:**
   ```powershell
   $env:PLAYWRIGHT_CHANNEL='msedge'; npx playwright test
   ```

3. **Ejecutar únicamente las pruebas del módulo de expedientes:**
   ```powershell
   $env:PLAYWRIGHT_CHANNEL='msedge'; npx playwright test tests/expedientes.spec.ts
   ```
