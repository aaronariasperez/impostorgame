# Integration Architecture

## Overview

The Impostor project is a monorepo with two parts (frontend and backend) that communicate through two channels:

1. **Firebase Firestore (direct)** — Frontend JS SDK talks directly to Firestore for word packs and telemetry
2. **REST API (proxied)** — Frontend can call backend REST endpoints for telemetry via `/api` proxy

```
┌─────────────────────────────────────────────────┐
│                  Frontend                        │
│  React + Capacitor                               │
│                                                   │
│  ┌─────────────────┐   ┌──────────────────────┐ │
│  │ Firebase JS SDK  │   │ fetch(/api/telemetry)│ │
│  └────────┬────────┘   └──────────┬───────────┘ │
└───────────┼─────────────────────── ┼─────────────┘
            │                        │
            │ Direct                 │ Proxied
            │ Firestore              │ (Vite dev / Vercel prod)
            │                        │
            ▼                        ▼
┌───────────────────┐    ┌──────────────────────────┐
│  Firebase          │    │  Backend (NestJS)         │
│  Firestore         │◄───│  Firebase Admin SDK       │
│                    │    │                            │
│  Collections:      │    │  POST /api/telemetry/visit │
│  - word_packs      │    │  POST /api/telemetry/event │
│  - telemetry_visits│    └──────────────────────────┘
│  - telemetry_events│         Hosted on Render
└───────────────────┘
```

## Integration Points

### 1. Word Packs: Frontend → Firebase Firestore

| Property | Value |
|----------|-------|
| Direction | Frontend → Firebase |
| Protocol | Firestore JS SDK |
| Collection | `word_packs` |
| Operation | Read (`getDocs`) |
| Fallback Chain | Firebase → IndexedDB cache (7-day TTL) → hardcoded defaults |

**Flow:**
1. `wordPackService.getAllPacks()` checks in-memory cache
2. Calls `firebaseWordPackService.getAllPacks()`
3. Fetches from Firestore `word_packs` collection
4. On success: caches to IndexedDB via `storageService.cachePacks()`
5. On failure: tries `storageService.getCachedPacks()`
6. On cache miss: uses `DEFAULT_WORD_PACKS` (2 hardcoded packs)

### 2. Telemetry: Frontend → Firebase Firestore (Direct)

| Property | Value |
|----------|-------|
| Direction | Frontend → Firebase |
| Protocol | Firestore JS SDK |
| Collections | `telemetry_visits`, `telemetry_events` |
| Operation | Write (`addDoc`) |
| Failure Mode | Silent (catch and ignore) |

**Events logged:**
- `visit` — On app mount (App.tsx)
- `game_start` — On game initialization (GameSetup.tsx)
- `game_end` — On game-over phase entry (GamePage.tsx)

### 3. Telemetry: Frontend → Backend REST API

| Property | Value |
|----------|-------|
| Direction | Frontend → Backend |
| Protocol | HTTP REST (POST) |
| Endpoints | `/api/telemetry/visit`, `/api/telemetry/event` |
| Proxy (dev) | Vite: `/api` → `http://localhost:3000` |
| Proxy (prod) | Vercel: `/api/*` → `https://impostorgame-1.onrender.com/api/*` |
| Native apps | Direct: `https://impostorgame-1.onrender.com/api/*` |

> Note: The frontend currently uses Firebase Firestore directly for telemetry. The backend REST endpoints exist as a secondary/legacy path.

### 4. Backend → Firebase Firestore (Admin)

| Property | Value |
|----------|-------|
| Direction | Backend → Firebase |
| Protocol | Firebase Admin SDK |
| Collections | `telemetry_visits`, `telemetry_events` |
| Operation | Write |
| Auth | Service account credentials |

## Proxy Configuration

### Development (Vite)

```typescript
// frontend/vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

### Production (Vercel)

```json
// frontend/vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://impostorgame-1.onrender.com/api/:path*" }
  ]
}
```

### Native Apps (Capacitor)

```typescript
// frontend/capacitor.config.ts
export const API_BASE_URL = 'https://impostorgame-1.onrender.com'

// frontend/src/config/api.ts
// Uses API_BASE_URL directly for native, empty string for web (uses proxy)
```

## Shared Data

Both parts access the same Firebase Firestore project. There is no shared code or shared npm packages between frontend and backend.

| Data | Written By | Read By |
|------|-----------|---------|
| Word packs | Migration script (backend) | Frontend (Firebase JS SDK) |
| Visit telemetry | Frontend + Backend | — |
| Event telemetry | Frontend + Backend | — |

## Authentication

No authentication between frontend and backend. CORS is configured but permissive. Firebase access from the frontend uses client-side Firebase config (API key in env vars). Backend uses service account credentials.
