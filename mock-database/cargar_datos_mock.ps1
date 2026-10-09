# =============================================================================
# Script para cargar datos iniciales de demostración en PostgreSQL (Docker)
# =============================================================================

$seedFile = Join-Path $PSScriptRoot "seed_initial_data.sql"
if (-not (Test-Path $seedFile)) {
    Write-Host "[X] No se encontro el archivo de seed en: $seedFile" -ForegroundColor Red
    exit 1
}

Write-Host "[*] Verificando contenedor de base de datos 'grado-db'..." -ForegroundColor Cyan
$container = docker ps -q --filter "name=grado-db"
if (-not $container) {
    Write-Host "[X] El contenedor grado-db no esta en ejecucion. Asegurate de levantar Docker en el backend." -ForegroundColor Red
    exit 1
}

Write-Host "[*] Copiando e insertando datos UTF-8 en PostgreSQL (grades_management)..." -ForegroundColor Cyan
docker cp $seedFile grado-db:/tmp/seed_initial_data.sql
docker exec grado-db psql -U root -d grades_management -f /tmp/seed_initial_data.sql

Write-Host "`n[*] Verificando registros insertados..." -ForegroundColor Cyan
docker exec -t grado-db psql -U root -d grades_management -c "SELECT 'users' AS tabla, count(*) AS registros FROM users UNION ALL SELECT 'schools', count(*) FROM schools UNION ALL SELECT 'expedients', count(*) FROM expedients UNION ALL SELECT 'defenses', count(*) FROM defenses;"

Write-Host "`n[V] Carga automatica con codificacion UTF-8 completada con exito." -ForegroundColor Green
