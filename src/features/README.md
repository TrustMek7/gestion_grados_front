# Módulos funcionales

Cada módulo incorporará sus páginas, componentes, tipos y servicios específicos:
autenticación, inicio, expedientes, docentes, reportes y administración.

`auth/` contiene la pantalla de acceso y el contexto de sesión de demostración,
con escenarios autorizado, denegado, error y vencimiento. Todo es local y simulado;
no se conecta a Google ni al backend, ni define contratos de integración.

`dashboard/` contiene el panel de inicio, sus datos ficticios y componentes.
Los indicadores, filtros, distribución de estados, agenda y tabla se calculan
localmente desde una única colección mock. No contiene contratos ni servicios HTTP.

Alcance: RF-GT-01 a RF-GT-21. Las funciones de negocio se incorporarán por entrega.
