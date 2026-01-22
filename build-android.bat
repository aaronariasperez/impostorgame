@echo off
setlocal enabledelayedexpansion

set BLUE=[94m
set YELLOW=[93m
set GREEN=[92m
set NC=[0m

echo %BLUE%🤖 Building Impostor for Android%NC%
echo %BLUE%===================================%NC%
echo.

cd frontend

echo %YELLOW%1️⃣  Building React app...%NC%
call npm run build
if errorlevel 1 exit /b 1

echo.
echo %YELLOW%2️⃣  Copying assets to Android...%NC%
call npx cap copy android
if errorlevel 1 exit /b 1

echo.
echo %YELLOW%3️⃣  Syncing Android dependencies...%NC%
call npx cap sync android
if errorlevel 1 exit /b 1

echo.
echo %GREEN%✅ Android build complete!%NC%
echo %BLUE%===================================%NC%
echo.
echo %GREEN%Next steps:%NC%
echo   1. Open Android Studio: %BLUE%npx cap open android%NC%
echo   2. Wait for Gradle sync to complete
echo   3. Select your device or emulator
echo   4. Click 'Run' (Shift+F10)
echo.
