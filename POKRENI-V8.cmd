@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nije pronadjen. Potreban je Node.js 22.18 ili noviji.
  pause
  exit /b 1
)
echo Instalacija paketa iz package-lock.json...
call npm ci
if errorlevel 1 (
  echo Instalacija nije uspela. Procitaj poruku iznad.
  pause
  exit /b 1
)
echo Pokretanje V8 na http://localhost:3000
call npm run dev
pause
