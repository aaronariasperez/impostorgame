# 📱 Mobile Build Guide - Impostor

Compilación para iOS y Android usando Capacitor.

## Quick Start

### Linux/Mac
```bash
# Build for iOS
./build-ios.sh

# Build for Android
./build-android.sh

# Build for both
./build-mobile.sh both
```

### Windows
```bash
# Build for iOS
build-ios.bat

# Build for Android
build-android.bat

# Build for both
build-mobile.sh both
```

## What's Included

✅ Capacitor 5 configured
✅ iOS and Android platforms ready
✅ Automatic API URL detection (native vs web)
✅ Build scripts for both platforms
✅ Vite + React optimized for mobile

## Prerequisites

### For iOS
- macOS with Xcode installed
- CocoaPods: `sudo gem install cocoapods`
- iOS deployment target: 13.0+

### For Android
- Android Studio installed
- Android SDK 21+
- Java 11+

## Build Process

### Step 1: Build React App
```bash
npm run build
```

### Step 2: Copy Assets
```bash
npx cap copy ios    # or android
```

### Step 3: Sync Dependencies
```bash
npx cap sync ios    # or android
```

### Step 4: Open in IDE
```bash
npx cap open ios    # Opens Xcode
npx cap open android # Opens Android Studio
```

### Step 5: Build & Run
- **iOS**: Cmd+R in Xcode
- **Android**: Shift+F10 in Android Studio

## NPM Scripts

```bash
npm run mobile:build    # Build React + copy assets
npm run mobile:ios      # Build + open Xcode
npm run mobile:android  # Build + open Android Studio
npm run mobile:sync     # Sync all platforms
npm run mobile:update   # Update Capacitor plugins
```

## API Configuration

The app automatically detects if it's running natively:

- **Native (iOS/Android)**: Connects to `http://localhost:3000`
- **Web**: Uses relative URLs `/api`

For production, update `frontend/capacitor.config.ts`:

```typescript
server: {
  url: 'https://your-backend.com',
}
```

## Troubleshooting

### iOS Build Fails
```bash
# Clean and rebuild
cd frontend/ios/App
rm -rf Pods
pod install
cd ../../../
npx cap copy ios
```

### Android Build Fails
```bash
# Clean Gradle cache
cd frontend/android
./gradlew clean
cd ../
npx cap sync android
```

### App Can't Connect to Backend
1. Ensure backend is running on `http://localhost:3000`
2. Check device/emulator can reach localhost
3. For physical device, use your machine's IP instead

### Hot Reload in Development
```bash
# Terminal 1: Start backend
cd backend && npm run start:dev

# Terminal 2: Start frontend dev server
cd frontend && npm run dev

# Terminal 3: Open in Xcode/Android Studio
npx cap open ios
```

Then in Xcode/Android Studio, set server URL to your dev server.

## File Structure

```
frontend/
├── ios/                    # iOS native project
├── android/                # Android native project
├── capacitor.config.ts     # Capacitor configuration
├── src/
│   ├── config/
│   │   └── api.ts         # API URL detection
│   └── services/
│       └── wordPackService.ts  # Updated for native
└── package.json
```

## Next Steps

1. Run build script for your platform
2. Open in Xcode or Android Studio
3. Select device/simulator
4. Build and run
5. Test game functionality

## Support

For Capacitor docs: https://capacitorjs.com/docs
