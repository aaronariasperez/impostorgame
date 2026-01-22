# 🚀 Quick Mobile Build

## One-Command Build

### Linux/Mac
```bash
./build-mobile.sh ios      # iOS
./build-mobile.sh android  # Android
./build-mobile.sh both     # Both
```

### Windows
```bash
build-mobile.bat ios       # iOS
build-mobile.bat android   # Android
build-mobile.bat both      # Both
```

## What It Does

1. ✅ Compila React app
2. ✅ Copia assets a plataforma nativa
3. ✅ Sincroniza dependencias
4. ✅ Abre IDE (Xcode/Android Studio)

## Then In IDE

**iOS (Xcode):**
- Select "App" scheme
- Select device/simulator
- Press Cmd+R

**Android (Android Studio):**
- Wait for Gradle sync
- Select device/emulator
- Press Shift+F10

## NPM Shortcuts

```bash
npm run mobile:ios      # Build + open Xcode
npm run mobile:android  # Build + open Android Studio
npm run mobile:sync     # Sync without building
```

## Backend Connection

App automatically connects to:
- **Native**: `http://localhost:3000`
- **Web**: `/api` (relative)

Make sure backend is running:
```bash
cd backend && npm run start:dev
```

## Troubleshooting

**iOS build fails?**
```bash
cd frontend/ios/App && rm -rf Pods && pod install
```

**Android build fails?**
```bash
cd frontend/android && ./gradlew clean
```

**Can't connect to backend?**
- Check backend is running on port 3000
- For physical device, use your machine's IP in capacitor.config.ts

Done! 🎉
