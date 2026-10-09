# =============================================================================
# Script para iniciar el Frontend (Vite en http://localhost:5173)
# =============================================================================

Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Instalando dependencias de Node.js..." -ForegroundColor Cyan
    npm install
}

Write-Host "[*] Servidor disponible en: http://localhost:5173" -ForegroundColor Green
Write-Host "[*] Presiona Ctrl + C para detener el servidor." -ForegroundColor Yellow
npm run dev
