# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name (e.g., "impostor-game")
4. Follow the setup wizard

## 2. Create a Firestore Database

1. In the Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your preferred region
5. Click **Create**

## 3. Create a Service Account

1. Go to **Project Settings** (gear icon)
2. Click the **Service Accounts** tab
3. Click **Generate New Private Key**
4. A JSON file will be downloaded - keep it safe!

## 4. Configure Environment Variables

You have two options:

### Option A: Using a JSON file (Recommended)
1. Save the downloaded JSON file as `firebase-service-account.json` in the backend directory
2. Create a `.env` file in the backend directory (copy from `.env.example`)
3. Set `FIREBASE_PROJECT_ID` to your project ID
4. Set `FIREBASE_SERVICE_ACCOUNT` to the file path

Example `.env`:
```bash
FIREBASE_PROJECT_ID=impostor-game-abc123
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Option B: Using environment variable directly
1. Create a `.env` file in the backend directory
2. Set `FIREBASE_PROJECT_ID` to your project ID
3. Set `FIREBASE_SERVICE_ACCOUNT` to the entire JSON content (as a string)

Example `.env`:
```bash
FIREBASE_PROJECT_ID=impostor-game-abc123
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"impostor-game-abc123",...}
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Note**: Option A is recommended for security - keep the JSON file in `.gitignore`

## 5. Set Firestore Security Rules

In the Firebase Console, go to **Firestore Database** → **Rules** and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reading word_packs from anywhere
    match /word_packs/{document=**} {
      allow read;
    }
    
    // Allow writing telemetry from anywhere (or restrict by IP if needed)
    match /telemetry_visits/{document=**} {
      allow write;
    }
    
    match /telemetry_events/{document=**} {
      allow write;
    }
  }
}
```

## 6. Migrate Existing Data (Optional)

If you have existing word packs and logs:

```bash
npm run migrate:firebase
```

This will:
- Upload all word packs from `word_packs/` directory to Firestore
- Upload all telemetry logs from `logs/` directory to Firestore

## 7. Start the Backend

```bash
npm run start:dev
```

The backend will now:
- Load word packs from Firestore on startup
- Write telemetry logs to Firestore instead of local files

## Firestore Collections Structure

### word_packs
```
{
  "name": "Animales",
  "description": "Palabras relacionadas con animales",
  "language": "es",
  "wordItems": [
    {
      "word": "gato",
      "attributes": ["felino", "doméstico"]
    },
    ...
  ]
}
```

### telemetry_visits
```
{
  "ts": "2024-01-15T10:30:00.000Z",
  "type": "visit",
  "sessionId": "session-123",
  "path": "/game",
  "referrer": null,
  "userAgent": "Mozilla/5.0...",
  "timestamp": 1705318200000
}
```

### telemetry_events
```
{
  "ts": "2024-01-15T10:30:15.000Z",
  "type": "game_start",
  "sessionId": "session-123",
  "eventData": {
    "packId": "animales",
    "difficulty": "medium"
  }
}
```

## Troubleshooting

### Firebase not initializing
- Check that `FIREBASE_SERVICE_ACCOUNT` is properly formatted JSON
- Verify `FIREBASE_PROJECT_ID` matches your project

### Word packs not loading
- Ensure `word_packs` collection exists in Firestore
- Check that documents have the correct structure
- Run `npm run migrate:firebase` to populate from local files

### Telemetry not saving
- Check Firestore security rules allow writes
- Verify `telemetry_visits` and `telemetry_events` collections exist
- Check browser console for CORS errors
