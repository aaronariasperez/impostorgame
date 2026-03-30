# Development Guide

## Prerequisites

- **Node.js** 18+
- **npm** (included with Node.js)
- **Android Studio** (for mobile builds)
- **Firebase project** with Firestore enabled

## Initial Setup

### 1. Clone and install dependencies

```bash
# Root (only has sharp as devDependency)
npm install

# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Configure backend environment

Create `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Place your Firebase service account JSON file at `backend/firebase-service-account.json`.

### 3. Configure frontend environment (optional)

Create `frontend/.env` with Firebase client config:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> The frontend works without Firebase — it falls back to hardcoded word packs.

## Running Locally

### Both servers (recommended)

```bash
./start-dev.sh
```

This starts:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`
- Frontend proxies `/api` requests to backend automatically

### Individual servers

```bash
# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run start:dev
```

## Building

### Frontend (web)

```bash
cd frontend && npm run build
# Output: frontend/dist/
```

### Backend

```bash
cd backend && npm run build
# Output: backend/dist/
```

## Mobile Builds (Capacitor)

### Debug APK

```bash
cd frontend
npm run mobile:apk
# Or use the root script:
./build-apk.sh
```

### Release APK (signed)

```bash
# First time: generate keystore
./generate-keystore.sh

# Build signed APK
./build-release.sh
```

### Play Store Bundle (AAB)

```bash
./build-bundle.sh
```

### Sync native projects

```bash
cd frontend
npm run mobile:sync    # Sync web assets + plugins
npm run mobile:build   # Build + cap copy
npm run mobile:android # Build + open Android Studio
```

## Linting & Formatting

```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint     # ESLint with auto-fix
cd backend && npm run format   # Prettier
```

## Data Migration

To populate Firestore with word pack data from local JSON files:

```bash
cd backend && npm run migrate:firebase
```

This reads from `backend/word_packs/` and writes to the `word_packs` Firestore collection.

## Project Structure

| Path | Purpose |
|------|---------|
| `frontend/src/hooks/useGameState.ts` | Core game state (Zustand) |
| `frontend/src/components/phases/` | Game phase UI components |
| `frontend/src/services/` | Data services (Firebase, cache, telemetry) |
| `backend/src/telemetry/` | REST telemetry endpoints |
| `backend/src/firebase/` | Firebase Admin SDK setup |

## Key Conventions

- **Path alias**: `@/` resolves to `src/` in frontend
- **API proxy**: Frontend dev server proxies `/api` to backend at `localhost:3000`
- **Environment variables**: Frontend uses `VITE_*` prefix; backend uses plain names
- **App ID**: `com.aaronarias.impostor`
- **Language**: UI in Spanish, code in English

## Testing

No test framework is currently configured. The `BUGS_FASE_PRUEBA.md` file documents manual testing phases.

## Deployment

| Component | Platform | Config |
|-----------|----------|--------|
| Frontend (web) | Vercel | `frontend/vercel.json` (rewrites /api to Render) |
| Backend | Render | `backend/dist/main.js` entry point |
| Mobile | Google Play | Signed APK/AAB via build scripts |
