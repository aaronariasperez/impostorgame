@echo off
setlocal enabledelayedexpansion

set BLUE=[94m
set YELLOW=[93m
set GREEN=[92m
set NC=[0m

echo %BLUE%🍎 Building Impostor for iOS%NC%
echo %BLUE%================================%NC%
echo.

cd frontend

echo %YELLOW%1️⃣  Building React app...%NC%
call npm run build
if errorlevel 1 exit /b 1

echo.
echo %YELLOW%2️⃣  Copying assets to iOS...%NC%
call npx cap copy ios
if errorlevel 1 exit /b 1

echo.
echo %YELLOW%3️⃣  Syncing iOS dependencies...%NC%
call npx cap sync ios
if errorlevel 1 exit /b 1

echo.
echo %GREEN%✅ iOS build complete!%NC%
echo %BLUE%================================%NC%
echo.
echo %GREEN%Next steps:%NC%
echo   1. Open Xcode: %BLUE%npx cap open ios%NC%
echo   2. Select 'App' scheme
echo   3. Select your device or simulator
echo   4. Press Cmd+R to build and run
echo.
