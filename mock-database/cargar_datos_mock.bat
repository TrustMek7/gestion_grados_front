@echo off
echo [*] Cargando datos iniciales UTF-8 en PostgreSQL (grado-db)...
docker cp "%~dp0seed_initial_data.sql" grado-db:/tmp/seed_initial_data.sql
docker exec grado-db psql -U root -d grades_management -f /tmp/seed_initial_data.sql
echo.
echo [V] Carga completada con exito.
pause
