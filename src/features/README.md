# Módulos funcionales

Cada módulo incorporará sus páginas, componentes, tipos y servicios específicos:
autenticación, inicio, expedientes, docentes, reportes y administración.

`auth/` contiene la pantalla de acceso y el contexto de sesión de demostración,
con escenarios autorizado, denegado, error y vencimiento. Todo es local y simulado;
no se conecta a Google ni al backend, ni define contratos de integración.

`dashboard/` contiene el panel de inicio, la base ficticia inicial y sus componentes.
`expedientes/` contiene listado, formulario, detalle, validaciones y contexto mock.
Los dos módulos consumen la colección de `DossierProvider`, persistida en la pestaña
con `sessionStorage`. No hay contratos ni servicios HTTP.

`expedientes/academic/` agrupa asesor, jurado, resoluciones, resultados de sorteos
externos y sustentación. Sus vínculos usan identificadores estables del mock.
Las referencias PDF guardan solo nombre y tamaño; no se conserva contenido.
`docentes/` aporta el catálogo ficticio compartido, su consulta y el historial
derivado de las designaciones de cada expediente (RF-GT-12). Incluye filtros por
participación y año de resolución y enlaces a expedientes y resoluciones.

Alcance: RF-GT-01 a RF-GT-21. Las funciones de negocio se incorporarán por entrega.

`reportes/` implementa consultas mock de participaciones, sorteos, estadísticas
y trabajos sustentados, además de exportación Excel local con filtros y criterios.
Comparte la colección de expedientes y la lógica de participación docente.
