@echo off
rem Abre el editor de Lyra Fest (Windows): doble clic en este archivo
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Falta instalar Node.js. Bajalo de https://nodejs.org ^(version LTS^) y volve a abrir este archivo.
  pause
  exit /b
)
node editor\server.js
pause
