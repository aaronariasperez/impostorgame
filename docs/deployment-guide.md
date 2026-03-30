# Deployment Guide

## Infrastructure Overview

| Component | Platform | Entry Point |
|-----------|----------|-------------|
| Frontend (web) | Vercel | `frontend/dist/` (static) |
| Backend API | Render | `backend/dist/main.js` |
| Database | Firebase Firestore | Google Cloud |
| Mobile App | Google Play Store | Signed APK/AAB |

## Frontend — Vercel

### Configuration

- **Framework**: Vite (auto-detected by Vercel)
- **Build command**: `cd frontend && npm run build`
- **Output directory**: `frontend/dist`
- **API rewrites**: `/api/*` → Render backend

```json
// frontend/vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://impostorgame-1.onrender.com/api/:path*" }
  ]
}
```

### Environment Variables (Vercel)

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Backend — Render

### Configuration

- **Build command**: `cd backend && npm install && npm run build`
- **Start command**: `cd backend && npm run start:prod`
- **Entry**: `node dist/main`
- **Port**: Set via `PORT` environment variable (Render provides this)

### Environment Variables (Render)

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
PORT=3000
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

> On Render, `FIREBASE_SERVICE_ACCOUNT` should be the full JSON string of the service account (not a file path).

## Mobile — Google Play Store

### Build Process

1. **Generate keystore** (first time only):
   ```bash
   ./generate-keystore.sh
   ```
   - Creates `impostor-release-key.jks` (2048-bit RSA, 10,000-day validity)
   - Creates `key.properties` for Gradle

2. **Build release bundle**:
   ```bash
   ./build-bundle.sh
   ```
   - Builds React app → copies to Android → Gradle `bundleRelease`
   - Output: `frontend/android/app/build/outputs/bundle/release/app-release.aab`

3. **Upload to Play Console**:
   - Go to Google Play Console → Create/update release
   - Upload `.aab` file
   - Fill store listing, content rating, data safety form

### App Details

| Property | Value |
|----------|-------|
| App ID | `com.aaronarias.impostor` |
| App Name | Impostor |
| Target | Android (primary), iOS (secondary) |
| Min Age | 13+ |

### Security

- **Keystore**: `impostor-release-key.jks` — NEVER commit to git
- **key.properties**: Contains keystore passwords — NEVER commit
- Both are gitignored

## Firebase Firestore

### Collections

| Collection | Purpose | Populated By |
|------------|---------|--------------|
| `word_packs` | Game word pairs | `npm run migrate:firebase` (one-time) |
| `telemetry_visits` | Visit tracking | App runtime |
| `telemetry_events` | Game event tracking | App runtime |

### Initial Data Population

```bash
cd backend && npm run migrate:firebase
```

Reads JSON files from `backend/word_packs/` and uploads to Firestore.

## CI/CD

No CI/CD pipeline is currently configured. Deployments are manual:

- **Vercel**: Auto-deploys on git push (if connected)
- **Render**: Auto-deploys on git push (if connected)
- **Play Store**: Manual upload of signed AAB

## Monitoring

- **Telemetry**: Custom visit/event logging to Firestore
- **No external monitoring** (APM, error tracking, etc.) configured
