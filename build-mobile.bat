@echo off
setlocal enabledelayedexpansion

set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%📱 Impostor Mobile Build Script%NC%
echo %BLUE%================================%NC%
echo.

if "%1"=="" (
  echo %YELLOW%Usage:%NC%
  echo   %BLUE%build-mobile.bat ios%NC%     - Build for iOS
  echo   %BLUE%build-mobile.bat android%NC% - Build for Android
  echo   %BLUE%build-mobile.bat both%NC%    - Build for both platforms
  echo.
  exit /b 1
)

set PLATFORM=%1

if "%PLATFORM%"=="ios" (
  call build-ios.bat
) else if "%PLATFORM%"=="android" (
  call build-android.bat
) else if "%PLATFORM%"=="both" (
  call build-ios.bat
  echo.
  echo %BLUE%---%NC%
  echo.
  call build-android.bat
) else (
  echo %RED%❌ Unknown platform: %PLATFORM%%NC%
  echo %YELLOW%Use: ios, android, or both%NC%
  exit /b 1
)
