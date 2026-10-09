param (
    [string]$Tag = "inicial_cero"
)
$backupDir = $PSScriptRoot
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$date = Get-Date -Format "yyyyMMdd_HHmmss"
$filename = Join-Path $backupDir "backup_${Tag}_${date}.sql"
$filenameAll = Join-Path $backupDir "backup_all_${Tag}_${date}.sql"

Write-Host "[*] Generando backup de la base de datos 'grades_management' en $filename ..." -ForegroundColor Cyan
docker exec -t grado-db pg_dump -U root -d grades_management | Out-File -FilePath $filename -Encoding utf8

Write-Host "[*] Generando backup global de todas las bases de datos en $filenameAll ..." -ForegroundColor Cyan
docker exec -t grado-db pg_dumpall -U root | Out-File -FilePath $filenameAll -Encoding utf8

Write-Host "[V] Backups creados exitosamente en $backupDir" -ForegroundColor Green
Get-ChildItem -Path $backupDir -Filter "*.sql" | Select-Object Name, Length, LastWriteTime
