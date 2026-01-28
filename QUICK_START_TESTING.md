# Quick Start: Testing the New APK

## APK Location
```
frontend/android/app/build/outputs/apk/release/app-release.apk
```

## Option 1: Install via ADB (Recommended)

### Prerequisites
- Android device connected via USB
- ADB installed on your computer
- USB debugging enabled on device

### Steps
```bash
# Navigate to project root
cd /home/linuxcore/Proyectos/impostor

# Install APK
adb install frontend/android/app/build/outputs/apk/release/app-release.apk

# Wait for installation to complete
# Then open the app on your device
```

### Verify Installation
```bash
# Check if app is installed
adb shell pm list packages | grep impostor

# View app logs
adb logcat | grep -i impostor
```

## Option 2: Manual Installation

1. Transfer APK to your device
2. Open file manager on device
3. Navigate to the APK file
4. Tap to install
5. Grant permissions if prompted

## Testing Checklist

### ✅ Startup Test (Most Important)
- [ ] App starts without crashing
- [ ] No error messages
- [ ] App loads within 3 seconds
- [ ] Main screen appears

### ✅ Word Packs Test
- [ ] Word packs list loads
- [ ] Can see "Animales" and "Comidas" packs
- [ ] Pack descriptions display
- [ ] Can select packs

### ✅ Game Test
- [ ] Can start a game
- [ ] Word selection works
- [ ] Game phases work (setup, clue, voting, results)
- [ ] Game completes without errors

### ✅ Offline Test
- [ ] Disconnect WiFi
- [ ] Restart app
- [ ] Word packs still load
- [ ] Game still works

### ✅ Console Check
- [ ] Open Chrome DevTools (if testing on emulator)
- [ ] Check for JavaScript errors
- [ ] Check for Firebase errors
- [ ] Look for "Firebase initialized" or "using default word packs"

## Expected Behavior

### With Default Word Packs (Current)
```
App starts
  ↓
Firebase initialization fails (invalid credentials)
  ↓
Falls back to default word packs
  ↓
Shows "Animales" and "Comidas" packs
  ↓
Game works normally
```

### Console Messages
```
Firebase initialized successfully
OR
Failed to fetch word packs from Firebase, trying cache: ...
No cached packs, using default word packs
```

## Troubleshooting

### App Crashes on Startup
- Check browser console for errors
- Verify Firebase config (if using real credentials)
- Try clearing app cache: `adb shell pm clear com.aaronariasperez.impostor`
- Reinstall APK

### Word Packs Don't Load
- Check if using real Firebase credentials
- Verify Firestore has `word_packs` collection
- Check Firestore security rules
- Check browser Network tab

### Game Doesn't Work
- Check browser console for errors
- Verify all game logic is intact
- Test on different Android version
- Clear app cache and restart

## Uninstall (If Needed)
```bash
adb uninstall com.aaronariasperez.impostor
```

## View App Logs
```bash
# Real-time logs
adb logcat | grep -i impostor

# Save logs to file
adb logcat > impostor_logs.txt

# Clear logs
adb logcat -c
```

## Performance Metrics

### Expected Performance
- **Startup time**: < 3 seconds
- **Word pack loading**: < 1 second
- **Game start**: < 1 second
- **APK size**: 5.9 MB

### Check Performance
```bash
# Measure startup time
adb shell am start -W com.aaronariasperez.impostor/.MainActivity

# Check memory usage
adb shell dumpsys meminfo com.aaronariasperez.impostor
```

## Success Criteria

✅ App starts without crashing
✅ Word packs load correctly
✅ Game is fully playable
✅ No network errors
✅ Works offline
✅ Performance is acceptable

## Next Steps

1. ✅ Install APK on test device
2. ✅ Run through testing checklist
3. ✅ Verify no crashes
4. ⏳ Submit to Google Play
5. ⏳ Wait for review

## Important Notes

- **Default word packs**: Animales, Comidas (for testing)
- **Real data**: Requires Firebase credentials in `frontend/.env`
- **Offline support**: Word packs cached locally
- **No backend needed**: App works without backend

## Questions?

Check these files:
- `RELEASE_READY.md` - Release information
- `FALLBACK_STRATEGY.md` - How fallback works
- `IMPLEMENTATION_CHECKLIST.md` - Detailed testing guide

---

**Status**: Ready for testing
**APK Size**: 5.9 MB
**Build Date**: 2026-01-28
