@echo off
title Marvel Seating System Launcher
color 0B

echo.
echo  ==========================================
echo     Marvel Seating System - Launcher
echo  ==========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo [OK] Node.js %%i

:: Setup backend
echo.
echo [1/4] Setting up backend...
cd backend

if not exist ".env" (
    copy .env.example .env >nul
    echo [OK] Created backend\.env from template
)

call npm install --silent
echo [OK] Backend dependencies installed

echo [2/4] Seeding database...
call node scripts/seed.js

:: Setup frontend
echo.
echo [3/4] Setting up frontend...
cd ..\frontend
call npm install --silent
echo [OK] Frontend dependencies installed

:: Launch
echo.
echo [4/4] Starting servers...
cd ..

start "Marvel Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Marvel Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 4 /nobreak >nul

echo.
echo  ==========================================
echo     All Systems Running!
echo  ==========================================
echo   Website:  http://localhost:5173
echo   Admin:    http://localhost:5173/admin
echo   API:      http://localhost:5000/api
echo  ------------------------------------------
echo   Admin Email: admin@marvelseating.com
echo   Admin Pass:  Marvel@2024
echo  ==========================================
echo.
echo  Two terminal windows have opened.
echo  Close them to stop the servers.
echo.
pause
