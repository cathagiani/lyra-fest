#!/bin/bash
# Abre el editor de Lyra Fest (Mac): doble clic en este archivo
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Falta instalar Node.js. Bajalo de https://nodejs.org (version LTS) y volve a abrir este archivo."
  read -p "Enter para cerrar..."
  exit 1
fi
node editor/server.js
