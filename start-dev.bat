@echo off
setlocal enabledelayedexpansion

echo.
echo 🎮 Impostor Game - Development Server
echo ======================================
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo ❌ Error: backend\.env not found
    echo Please create backend\.env with your Firebase credentials
    pause
    exit /b 1
)

REM Check if firebase-service-account.json exists
if not exist "backend\firebase-service-account.json" (
    echo ❌ Error: backend\firebase-service-account.json not found
    echo Please add your Firebase service account JSON file
    pause
    exit /b 1
)

echo ✅ Configuration files found
echo.

REM Start backend
echo Starting Backend (port 3000)...
cd backend
start "Impostor Backend" cmd /k npm run start:dev
cd ..
echo ✅ Backend started
echo.

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting Frontend (port 5173)...
cd frontend
start "Impostor Frontend" cmd /k npm run dev
cd ..
echo ✅ Frontend started
echo.

echo ======================================
echo 🚀 Both servers are running!
echo ======================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Close the command windows to stop the servers
echo.
pause
