# Guía Probada de Despliegue y Conexión Backend — Frontend

Esta guía documenta los pasos **100% probados y verificados** para levantar el backend en Docker, cargar los datos iniciales y conectarlo con el frontend de Grados y Títulos.

---

## 1. Prerrequisitos

* **Docker Desktop**: Debe estar abierto e iniciado en Windows (icono de la ballena activo en la bandeja del sistema).
* **Node.js**: Versión 22.13 o superior.
* **Git**: Instalado y configurado.

---

## 2. Paso a Paso: Despliegue del Backend (`gestion_grados_back`)

### 1. Clonar el repositorio del Backend
Si aún no lo tienes clonado:
```powershell
git clone https://github.com/CarlitoUwU/gestion_grados_back.git
cd gestion_grados_back
```

### 2. Configurar el archivo `.env`
Copia el archivo de ejemplo a `.env`:
```powershell
Copy-Item .env.example .env
```
Asegúrate de que contenga los siguientes valores de desarrollo verificados:
```ini
PORT=8080
SPRING_PROFILES_ACTIVE=dev

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

DB_URL=jdbc:postgresql://postgres:5432/grades_management
DB_USER=root
DB_PASSWORD=root
DB_POOL_MAX=12
DB_POOL_MIN_IDLE=4
DB_CONNECTION_TIMEOUT=20000

GOOGLE_OAUTH_CLIENT_ID=1057211665863-ltc8etssds12rvru95v9nn61ene5rqeb.apps.googleusercontent.com
GOOGLE_OAUTH_ISSUER_URI=https://accounts.google.com
GOOGLE_OAUTH_AUDIENCE=1057211665863-ltc8etssds12rvru95v9nn61ene5rqeb.apps.googleusercontent.com

ADMIN_EMAIL=phidalgo@unsa.edu.pe

MAX_FILE_SIZE=20MB
MAX_REQUEST_SIZE=25MB
```

### 3. Levantar los Contenedores con Docker Compose
Ejecuta el siguiente comando probado para compilar la imagen de desarrollo y levantar los servicios:
```powershell
docker compose -f compose.dev.yml up -d
```

> **Verificación:**  
> Ejecuta `docker ps` y confirma que existan dos contenedores corriendo:
> - `grado-db` (PostgreSQL 18 en puerto host `5431`)
> - `grado-bck` (Spring Boot API en puerto host `8080`)

### 4. Acceso a la Documentación Interactiva (Swagger)
Abre tu navegador en:
* **Swagger UI:** [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
* **OpenAPI JSON:** [http://localhost:8080/api/docs/openapi.json](http://localhost:8080/api/docs/openapi.json)

---

## 3. Carga Automática de Datos Iniciales (Mock Seeder)

Para no tener que registrar manualmente las escuelas, modalidades, docentes y expedientes desde cero, ejecuta el script de siembra automática:

### En PowerShell:
```powershell
.\cargar_datos_mock.ps1
```
*(O haz doble clic en `cargar_datos_mock.bat` desde el explorador de archivos de Windows).*

Este comando poblará de inmediato:
* 5 Escuelas Profesionales (Sistemas, Civil, Administración, Economía, Educación).
* 2 Modalidades (Tesis, Artículo de investigación).
* 5 Estados (Registrado, En trámite, Observado, Sustentado, Completado).
* 8 Docentes oficiales con correo UNSA.
* 12 Expedientes (`DEMO-2026-0010` al `DEMO-2025-0019`) con sus graduandos, títulos, resoluciones y fechas de sustentación.

---

## 4. Conexión desde el Frontend (`gestion_grados_front`)

### 1. Variables de Entorno en el Frontend
En la raíz del proyecto `gestion_grados_front`, crea o edita el archivo `.env.local`:
```ini
VITE_API_URL=http://localhost:8080/api/v1
```

### 2. Iniciar el Servidor de Desarrollo
```powershell
npm run dev
```
La aplicación abrirá en: [http://localhost:5173/](http://localhost:5173/)

### 3. Endpoints Principales del Backend (`/api/v1`)

| Módulo | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Catálogos** | `GET` | `/api/v1/catalogs/schools` | Lista de escuelas profesionales |
| **Catálogos** | `GET` | `/api/v1/catalogs/degree-modalities` | Modalidades de titulación |
| **Catálogos** | `GET` | `/api/v1/catalogs/expedient-statuses` | Estados administrativos |
| **Catálogos** | `GET` | `/api/v1/catalogs/teachers` | Catálogo de docentes |
| **Expedientes**| `GET` | `/api/v1/expedients` | Listado general de expedientes |
| **Expedientes**| `GET` | `/api/v1/expedients/{id}/detail` | Detalle completo con resoluciones y jurado |
| **Expedientes**| `POST` | `/api/v1/expedients` | Crear nuevo expediente |
| **Expedientes**| `PUT` | `/api/v1/expedients/{id}` | Actualizar expediente |
| **Dashboard** | `GET` | `/api/v1/dashboard` | Indicadores de inicio y próximas sustentaciones |
| **Reportes** | `GET` | `/api/v1/reports/teachers` | Participaciones docentes |
| **Reportes** | `GET` | `/api/v1/reports/statistics` | Estadísticas para acreditación |

---

## 5. Respaldos y Restauración de Base de Datos

Para generar una copia de seguridad en cualquier momento:
```powershell
.\backups\backup.ps1
```
Los archivos `.sql` quedan guardados en la carpeta `backups/` con fecha y hora.
