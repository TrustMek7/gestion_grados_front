@echo off
title Gestion de Grados y Titulos - Frontend UNSA
echo =====================================================================
echo  Iniciando Frontend de Gestion de Grados y Titulos (UNSA)
echo =====================================================================
echo.
cd /d "%~dp0"

if not exist "node_modules" (
    echo [*] Carpeta node_modules no encontrada. Instalando dependencias...
    call npm install
)

echo [*] Servidor disponible en: http://localhost:5173
echo [*] Presiona Ctrl + C en cualquier momento para detener el servidor.
echo.
call npm run dev
pause
