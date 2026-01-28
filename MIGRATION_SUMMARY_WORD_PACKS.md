# Word Packs Migration Summary

## Overview
Migrated all word pack logic from backend to frontend, eliminating the dependency on the backend API for game data. The backend now only handles telemetry.

## Changes Made

### Frontend Changes

#### 1. New Files Created
- **`frontend/src/config/firebase.ts`** - Firebase initialization with Firestore
- **`frontend/src/services/firebaseWordPackService.ts`** - Direct Firestore word pack service
- **`frontend/.env`** - Environment variables for Firebase configuration

#### 2. Updated Files
- **`frontend/src/services/wordPackService.ts`** - Refactored to use Firebase service instead of backend API
- **`frontend/tsconfig.json`** - Added Vite client types for `import.meta.env` support

#### 3. Dependencies Added
- **`firebase`** - Firebase SDK for web (installed via npm)

### Backend Changes

#### 1. Removed Files
- **`backend/src/word-packs/`** - Entire directory removed (service, controller, module)

#### 2. Updated Files
- **`backend/src/app.module.ts`** - Removed WordPacksModule import

#### 3. Removed Endpoints
- `GET /api/word-packs` - List all word packs
- `GET /api/word-packs/:id` - Get single word pack
- `GET /api/word-packs/combined?ids=...` - Get combined word packs
- `POST /api/word-packs/selection` - Get random word selection

### Architecture Changes

**Before:**
```
Frontend (wordPackService)
    ↓
Backend API (/api/word-packs)
    ↓
Firestore
```

**After:**
```
Frontend (firebaseWordPackService)
    ↓
Firestore (direct)

Backend (telemetryService)
    ↓
Firestore (telemetry only)
```

## Benefits

1. **Eliminates Backend Dependency** - App works even if backend is down
2. **Faster Loading** - Direct Firestore access is faster than API calls
3. **Reduced Server Load** - Backend only handles telemetry
4. **Better Offline Support** - Word packs can be cached locally
5. **Improved Scalability** - Firestore handles read scaling automatically
6. **Fixes APK Crash** - No more crashes due to backend unavailability

## Configuration Required

### Firebase Web App Credentials
You need to add Firebase web app credentials to `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=impostor-16c49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=impostor-16c49
VITE_FIREBASE_STORAGE_BUCKET=impostor-16c49.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

See `FIREBASE_WEB_CONFIG.md` for detailed instructions.

## Testing

### Backend
```bash
cd backend
npm run build  # ✓ Compiles successfully
npm run start:dev  # Starts with telemetry only
```

### Frontend
```bash
cd frontend
npm run build  # ✓ Compiles successfully
npm run dev  # Starts dev server
```

## Firestore Security Rules

Ensure these rules are set in Firestore:

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

## Data Structure

### Firestore word_packs Collection
```json
{
  "name": "Animales",
  "description": "Palabras relacionadas con animales",
  "language": "es",
  "wordItems": [
    {
      "p1": "gato",
      "p2": "felino doméstico"
    },
    {
      "p1": "perro",
      "p2": "mejor amigo del hombre"
    }
  ]
}
```

## Next Steps

1. ✅ Frontend code updated and compiles
2. ✅ Backend code updated and compiles
3. ⏳ Add Firebase web credentials to `frontend/.env`
4. ⏳ Test locally with `npm run dev`
5. ⏳ Build APK with `npm run build && npx cap copy android`
6. ⏳ Test APK on device
7. ⏳ Resubmit to Google Play

## Rollback Plan

If needed, the old backend code can be restored from git history:
```bash
git log --oneline -- backend/src/word-packs/
git checkout <commit-hash> -- backend/src/word-packs/
```
