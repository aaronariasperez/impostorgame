# Firebase Web Configuration for Frontend

## Overview
The frontend now reads word packs directly from Firestore instead of through the backend API. This requires Firebase web app credentials.

## Steps to Configure

### 1. Get Firebase Web App Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the project `impostor-16c49`
3. Click the **Settings** icon (gear) → **Project Settings**
4. Go to the **Your apps** section
5. If you don't have a web app registered:
   - Click **Add app** → **Web**
   - Enter an app name (e.g., "Impostor Game Web")
   - Click **Register app**
6. Copy the Firebase config object that looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "impostor-16c49.firebaseapp.com",
  projectId: "impostor-16c49",
  storageBucket: "impostor-16c49.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};
```

### 2. Update Frontend Environment Variables

Edit `frontend/.env` and replace the placeholder values with your actual credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=impostor-16c49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=impostor-16c49
VITE_FIREBASE_STORAGE_BUCKET=impostor-16c49.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 3. Verify Firestore Security Rules

Make sure your Firestore security rules allow public read access to `word_packs`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reading word_packs from anywhere
    match /word_packs/{document=**} {
      allow read;
    }
    
    // Allow writing telemetry from anywhere
    match /telemetry_visits/{document=**} {
      allow write;
    }
    
    match /telemetry_events/{document=**} {
      allow write;
    }
  }
}
```

### 4. Test the Configuration

Run the frontend in development mode:
```bash
cd frontend
npm run dev
```

The app should now load word packs directly from Firestore without any backend API calls.

## Architecture Changes

### Before (Backend-dependent)
```
Frontend → Backend API (/api/word-packs) → Firestore
```

### After (Direct Firestore)
```
Frontend → Firestore (direct)
Backend → Firestore (telemetry only)
```

## Benefits

1. **No backend dependency for word packs** - App works even if backend is down
2. **Faster loading** - Direct Firestore access is faster than API calls
3. **Reduced server costs** - Backend only handles telemetry
4. **Better offline support** - Can cache word packs locally
5. **Scalability** - Firestore handles read scaling automatically

## Troubleshooting

### "Firebase initialization failed"
- Check that all VITE_FIREBASE_* variables are set correctly in `.env`
- Verify the Firebase project ID matches `impostor-16c49`

### "Permission denied" errors in console
- Check Firestore security rules allow read access to `word_packs`
- Make sure the web app is registered in Firebase Console

### Word packs not loading
- Verify `word_packs` collection exists in Firestore
- Check that documents have the correct structure (name, description, language, wordItems)
- Check browser console for detailed error messages
