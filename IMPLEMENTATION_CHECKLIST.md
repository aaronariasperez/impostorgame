# Implementation Checklist

## Migration Status: ✅ Code Complete

The code migration is complete and both backend and frontend compile successfully.

## Your Action Items

### Phase 1: Firebase Configuration (Required)

- [ ] **Get Firebase Web Credentials**
  - [ ] Go to https://console.firebase.google.com/
  - [ ] Select project `impostor-16c49`
  - [ ] Click Settings (gear) → Project Settings
  - [ ] Go to "Your apps" section
  - [ ] Create web app if it doesn't exist
  - [ ] Copy the Firebase config object

- [ ] **Update frontend/.env**
  - [ ] Open `frontend/.env`
  - [ ] Replace `VITE_FIREBASE_API_KEY` with your API key
  - [ ] Replace `VITE_FIREBASE_MESSAGING_SENDER_ID` with your sender ID
  - [ ] Replace `VITE_FIREBASE_APP_ID` with your app ID
  - [ ] Save the file

- [ ] **Verify Firestore Security Rules**
  - [ ] Go to Firebase Console → Firestore Database → Rules
  - [ ] Ensure rules allow read access to `word_packs`
  - [ ] Ensure rules allow write access to `telemetry_visits` and `telemetry_events`
  - [ ] Publish rules if needed

### Phase 2: Local Testing (Recommended)

- [ ] **Test Backend**
  ```bash
  cd backend
  npm run start:dev
  ```
  - [ ] Backend starts without errors
  - [ ] No "word-packs" related errors in console

- [ ] **Test Frontend (Web)**
  ```bash
  cd frontend
  npm run dev
  ```
  - [ ] App loads at http://localhost:5173
  - [ ] No Firebase errors in browser console
  - [ ] Word packs load from Firestore
  - [ ] Game setup page shows available word packs
  - [ ] Can select word packs and start game
  - [ ] Game works correctly

### Phase 3: Mobile Build (For APK)

- [ ] **Build Frontend**
  ```bash
  cd frontend
  npm run build
  ```
  - [ ] Build completes successfully
  - [ ] No errors in output

- [ ] **Copy to Android**
  ```bash
  npx cap copy android
  ```
  - [ ] Capacitor files copied successfully

- [ ] **Build APK**
  ```bash
  cd android
  ./gradlew assembleRelease
  ```
  - [ ] APK builds successfully
  - [ ] APK file created in `android/app/build/outputs/apk/release/`

### Phase 4: Device Testing (Critical)

- [ ] **Install APK on Test Device**
  - [ ] Transfer APK to device
  - [ ] Install the APK
  - [ ] App installs without errors

- [ ] **Test App on Device**
  - [ ] App starts without crashing ✅ (This was the main issue)
  - [ ] Word packs load correctly
  - [ ] Can select word packs
  - [ ] Can start a game
  - [ ] Game plays correctly
  - [ ] No network errors in console
  - [ ] Works offline (word packs cached)

- [ ] **Test Different Scenarios**
  - [ ] Test with WiFi enabled
  - [ ] Test with WiFi disabled (offline)
  - [ ] Test with slow network
  - [ ] Test on different Android versions

### Phase 5: Google Play Submission

- [ ] **Prepare Release Notes**
  - [ ] Document the fix: "Fixed crash on startup"
  - [ ] Mention improvements: "Direct Firestore access for faster loading"
  - [ ] Note offline support: "Word packs now cached locally"

- [ ] **Upload to Google Play Console**
  - [ ] Go to Google Play Console
  - [ ] Select your app
  - [ ] Create new release
  - [ ] Upload the APK
  - [ ] Fill in release notes
  - [ ] Review all details

- [ ] **Submit for Review**
  - [ ] Click "Review" button
  - [ ] Verify all information is correct
  - [ ] Submit for review
  - [ ] Wait for Google's review (usually 24-48 hours)

## Troubleshooting Guide

### If Firebase initialization fails:
1. Check `frontend/.env` has all variables
2. Verify values match Firebase Console exactly
3. Restart dev server: `npm run dev`
4. Check browser console for detailed errors

### If word packs don't load:
1. Verify Firestore has `word_packs` collection
2. Check documents have correct structure
3. Verify Firestore rules allow read access
4. Check browser Network tab for Firestore requests

### If APK still crashes:
1. Check browser console for JavaScript errors
2. Verify Firebase config is correct
3. Check Firestore rules
4. Try clearing app cache on device
5. Check logcat for detailed error messages

### If you get "Permission denied" errors:
1. Go to Firebase Console → Firestore Database → Rules
2. Ensure rules allow read access to `word_packs`
3. Publish the rules
4. Wait a few seconds and refresh

## Important Notes

⚠️ **Do NOT commit `frontend/.env` to git** - It contains sensitive Firebase credentials
- Add to `.gitignore` if not already there
- Share credentials securely with team members

✅ **Backend is now optional** - App works even if backend is down
- Backend only handles telemetry
- Word packs come directly from Firestore

✅ **Offline support** - Word packs are cached locally
- First load requires internet
- Subsequent loads work offline

## Files to Review

- `MIGRATION_NEXT_STEPS.md` - Detailed implementation guide
- `FIREBASE_WEB_CONFIG.md` - Firebase setup instructions
- `MIGRATION_SUMMARY_WORD_PACKS.md` - Technical summary
- `backend/FIREBASE_SETUP.md` - Backend Firebase setup

## Questions?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check browser console for error messages
4. Check Firebase Console for any issues

## Success Criteria

✅ APK installs without crashing
✅ Word packs load from Firestore
✅ Game can be played normally
✅ No network errors in console
✅ Works offline (with cached data)
✅ Google Play review passes

---

**Status**: Ready for implementation
**Last Updated**: 2026-01-28
**Next Step**: Get Firebase web credentials and update `frontend/.env`
