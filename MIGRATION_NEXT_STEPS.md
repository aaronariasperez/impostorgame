# Next Steps: Complete the Word Packs Migration

## Status
✅ Code migration complete - both backend and frontend compile successfully
⏳ Configuration needed - Firebase web credentials required

## What Was Done

1. **Frontend Changes**
   - ✅ Installed Firebase SDK
   - ✅ Created `frontend/src/config/firebase.ts` - Firebase initialization
   - ✅ Created `frontend/src/services/firebaseWordPackService.ts` - Direct Firestore access
   - ✅ Updated `frontend/src/services/wordPackService.ts` - Uses Firebase service
   - ✅ Updated `frontend/tsconfig.json` - Added Vite types
   - ✅ Created `frontend/.env` - Environment variables (placeholders)

2. **Backend Changes**
   - ✅ Removed `backend/src/word-packs/` directory
   - ✅ Updated `backend/src/app.module.ts` - Removed WordPacksModule
   - ✅ Updated `backend/package.json` - Updated description
   - ✅ Backend now only handles telemetry

3. **Documentation**
   - ✅ Created `FIREBASE_WEB_CONFIG.md` - Setup instructions
   - ✅ Created `MIGRATION_SUMMARY_WORD_PACKS.md` - Complete summary

## What You Need to Do

### Step 1: Get Firebase Web Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `impostor-16c49`
3. Click **Settings** (gear icon) → **Project Settings**
4. Go to **Your apps** section
5. If no web app exists:
   - Click **Add app** → **Web**
   - Name it "Impostor Game Web"
   - Click **Register app**
6. Copy the Firebase config object

### Step 2: Update Frontend Environment Variables

Edit `frontend/.env` and replace the placeholder values:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_FROM_CONSOLE
VITE_FIREBASE_AUTH_DOMAIN=impostor-16c49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=impostor-16c49
VITE_FIREBASE_STORAGE_BUCKET=impostor-16c49.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_FROM_CONSOLE
VITE_FIREBASE_APP_ID=YOUR_APP_ID_FROM_CONSOLE
```

### Step 3: Verify Firestore Security Rules

In Firebase Console → Firestore Database → Rules, ensure you have:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /word_packs/{document=**} {
      allow read;
    }
    match /telemetry_visits/{document=**} {
      allow write;
    }
    match /telemetry_events/{document=**} {
      allow write;
    }
  }
}
```

### Step 4: Test Locally

```bash
# Test backend
cd backend
npm run start:dev

# In another terminal, test frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` and verify:
- Word packs load from Firestore
- No errors in browser console
- Game setup page shows available word packs

### Step 5: Build APK

```bash
cd frontend
npm run build
npx cap copy android
cd android
./gradlew assembleRelease
```

### Step 6: Test APK on Device

1. Install the APK on a test device
2. Verify:
   - App starts without crashing
   - Word packs load correctly
   - Game can be played
   - No network errors in console

### Step 7: Resubmit to Google Play

1. Upload the new APK to Google Play Console
2. Update release notes mentioning:
   - Fixed crash on startup
   - Improved performance with direct Firestore access
   - Better offline support
3. Submit for review

## Troubleshooting

### "Firebase initialization failed"
- Check all VITE_FIREBASE_* variables are set in `frontend/.env`
- Verify values match Firebase Console exactly
- Restart dev server after changing `.env`

### "Permission denied" errors
- Check Firestore security rules allow read access to `word_packs`
- Verify web app is registered in Firebase Console
- Check browser console for detailed error messages

### Word packs not loading
- Verify `word_packs` collection exists in Firestore
- Check documents have correct structure:
  ```json
  {
    "name": "...",
    "description": "...",
    "language": "es",
    "wordItems": [
      {"p1": "word", "p2": "hint"}
    ]
  }
  ```
- Check browser Network tab for Firestore requests

### APK still crashes
- Check browser console for JavaScript errors
- Verify Firebase config is correct
- Check Firestore rules allow public read access
- Try clearing app cache on device

## Architecture Summary

### Before (Backend-dependent)
```
Mobile App
    ↓
Backend API (Render)
    ↓
Firestore
```

**Problem:** Backend on free tier sleeps after inactivity → APK crashes

### After (Direct Firestore)
```
Mobile App
    ↓
Firestore (direct)

Backend (Telemetry only)
    ↓
Firestore
```

**Benefits:**
- No backend dependency for game data
- Faster loading
- Works even if backend is down
- Better offline support
- Reduced server costs

## Files Changed

### Frontend
- `frontend/src/config/firebase.ts` (new)
- `frontend/src/services/firebaseWordPackService.ts` (new)
- `frontend/src/services/wordPackService.ts` (updated)
- `frontend/tsconfig.json` (updated)
- `frontend/.env` (new)
- `frontend/package.json` (firebase added)

### Backend
- `backend/src/app.module.ts` (updated)
- `backend/package.json` (updated)
- `backend/src/word-packs/` (deleted)

## Rollback

If needed, restore from git:
```bash
git log --oneline -- backend/src/word-packs/
git checkout <commit-hash> -- backend/src/word-packs/
git checkout <commit-hash> -- backend/src/app.module.ts
```

## Questions?

Refer to:
- `FIREBASE_WEB_CONFIG.md` - Detailed Firebase setup
- `MIGRATION_SUMMARY_WORD_PACKS.md` - Complete technical summary
- `backend/FIREBASE_SETUP.md` - Firebase backend setup
