# Guía de Carga Automática de Datos Iniciales (Mock Seeder)

Este instructivo permite poblar la base de datos PostgreSQL de Docker con toda la información ficticia del mock (12 expedientes, graduandos, escuelas, docentes, modalidades, resoluciones y sustentaciones) con un solo comando, permitiendo que el equipo de frontend tenga datos reales listos para probar sin tener que crearlos manualmente.

---

## 1. Prerrequisitos

Tener Docker Desktop en ejecución y los contenedores del backend levantados:
```powershell
cd C:\Users\paulo_xxg0vy8\Personal\workspace\pis\gestion_grados_back
docker compose -f compose.dev.yml up -d
```

---

## 2. Ejecución de la Carga Automática

Puedes ejecutar la carga con cualquiera de las siguientes opciones:

### Opción A (Recomendada — PowerShell):
Desde la carpeta del backend (`gestion_grados_back`):
```powershell
.\cargar_datos_mock.ps1
```

O directamente desde cualquier terminal de PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\paulo_xxg0vy8\Personal\workspace\pis\gestion_grados_back\cargar_datos_mock.ps1"
```

### Opción B (Doble clic en Windows):
Haz doble clic en el archivo:
📁 `C:\Users\paulo_xxg0vy8\Personal\workspace\pis\gestion_grados_back\cargar_datos_mock.bat`

### Opción C (Comando directo Docker):
```powershell
Get-Content "C:\Users\paulo_xxg0vy8\Personal\workspace\pis\gestion_grados_back\docker\seed_initial_data.sql" | docker exec -i grado-db psql -U root -d grades_management
```

---

## 3. Datos que se cargan automáticamente

El script inserta los registros correspondientes a la estructura del sistema:

| Tabla | Registros cargados | Detalle |
| :--- | :--- | :--- |
| **`users`** | 2 usuarios | `phidalgo@unsa.edu.pe` (Admin GT) y `demo@unsa.edu.pe` |
| **`schools`** | 5 escuelas | Administración, Economía, Educación, Ing. Civil, Ing. de Sistemas |
| **`degree_modalities`** | 2 modalidades | Tesis, Artículo de investigación |
| **`expedient_statuses`** | 5 estados | Registrado, En trámite, Observado, Sustentado, Completado |
| **`teachers`** | 8 docentes | Elena Vargas, Rafael Montes, Patricia León, Jorge Rivas, etc. |
| **`graduates`** | 12 graduandos | Lucía Paredes, Mateo Salazar, Valeria Núñez, Diego Rojas, etc. |
| **`expedients`** | 12 expedientes | `DEMO-2026-0010` hasta `DEMO-2025-0019` vinculados a sus carreras |
| **`research_works`** | 12 títulos | Títulos de tesis y artículos de cada graduando |
| **`resolutions`** | 6 resoluciones | Resoluciones de Asesor, Jurado, Sorteo y Sustentación |
| **`expedient_advisors`** | 3 asesores | Asignaciones oficiales vinculadas a resoluciones |
| **`jury_members`** | 8 jurados | Presidente, Secretario, Vocal y Accesitarios |
| **`defenses`** | 8 sustentaciones | Fechas y resultados (Aprobado / Pendiente) |

---

## 4. Verificación de la carga

Para verificar que la base de datos se pobló correctamente, consulta los endpoints de la API o la base de datos:

1. **Vía Navegador (Swagger UI):**
   - Abrir: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
   - Probar `GET /api/v1/catalogs/schools` $\rightarrow$ Devolverá las 5 escuelas profesionales.
   - Probar `GET /api/v1/expedients` $\rightarrow$ Devolverá los 12 expedientes cargados.

2. **Vía PowerShell:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080/api/v1/catalogs/schools"
   ```
