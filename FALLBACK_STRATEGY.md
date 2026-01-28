# Fallback Strategy for Word Packs

## Overview

The app now has a robust fallback strategy to prevent crashes when Firebase credentials are missing or invalid.

## Fallback Hierarchy

```
1. Try Firebase (with real credentials)
   ↓ (if fails)
2. Try local cache (from previous sessions)
   ↓ (if fails)
3. Use default word packs (bundled in app)
```

## Default Word Packs

If Firebase is unavailable and there's no cache, the app uses these default word packs:

### Animales
- gato → felino doméstico
- perro → mejor amigo del hombre
- pajaro → tiene alas y vuela
- pez → vive en el agua
- elefante → animal grande con trompa

### Comidas
- pizza → comida italiana con queso
- hamburguesa → pan con carne
- manzana → fruta roja o verde
- pan → hecho de harina
- queso → producto lácteo amarillo

## How It Works

### Scenario 1: Firebase Credentials Valid
```
App starts
  ↓
Firebase initializes successfully
  ↓
Loads word packs from Firestore
  ↓
Caches them locally
  ↓
Game works with real data
```

### Scenario 2: Firebase Credentials Invalid (Current)
```
App starts
  ↓
Firebase initialization fails (invalid credentials)
  ↓
Tries to load from cache
  ↓
No cache (first run)
  ↓
Uses default word packs
  ↓
Game works with default data
```

### Scenario 3: Offline
```
App starts
  ↓
Firebase unavailable (no internet)
  ↓
Tries to load from cache
  ↓
Cache exists (from previous session)
  ↓
Game works with cached data
```

## Benefits

1. **No Crashes** - App never crashes due to missing Firebase credentials
2. **Offline Support** - Works offline with cached data
3. **Graceful Degradation** - Falls back to defaults if needed
4. **Better UX** - Users can play even with invalid credentials

## Current Status

✅ App will NOT crash with invalid Firebase credentials
✅ App will use default word packs as fallback
✅ App will cache word packs for offline use

## Next Steps

To use real Firebase data instead of defaults:

1. Get Firebase web credentials from Firebase Console
2. Update `frontend/.env` with real credentials
3. Restart the app
4. App will load real word packs from Firestore

## Testing the Fallback

### Test with Invalid Credentials (Current)
```bash
cd frontend
npm run dev
```
- App should start without crashing
- Should show default word packs
- Check console for "using default word packs" message

### Test with Valid Credentials
1. Update `frontend/.env` with real credentials
2. Restart dev server
3. App should load real word packs from Firestore
4. Check console for "Firebase initialized successfully"

### Test Offline
1. Start app with valid credentials (loads real data)
2. Disconnect internet
3. Restart app
4. App should load from cache
5. Check console for "using cached packs"

## Console Messages

### Success
```
Firebase initialized successfully
Loaded X word packs from Firebase
```

### Fallback to Cache
```
Failed to fetch word packs from Firebase, trying cache: ...
Using cached packs
```

### Fallback to Defaults
```
Failed to fetch word packs from Firebase, trying cache: ...
No cached packs, using default word packs
```

## Security Note

The default word packs are minimal and only for testing. For production:
- Always provide valid Firebase credentials
- Real word packs should come from Firestore
- Default packs are just a safety net

## Future Improvements

1. Add more default word packs
2. Bundle word packs in the app for better offline support
3. Add sync indicator showing if using real or default data
4. Allow users to download word packs for offline use
