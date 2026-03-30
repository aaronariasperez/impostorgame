# Architecture — Backend

## Executive Summary

The backend is a lightweight NestJS API server that provides telemetry endpoints and serves as a Firebase Admin SDK bridge. It does not contain game logic — all gameplay runs client-side. The backend's primary purpose is telemetry collection and word pack data migration.

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | NestJS | 10.0.0 |
| Platform | Express (via @nestjs/platform-express) | — |
| Language | TypeScript | 5.1.3 |
| Database | Firebase Admin SDK (Firestore) | 13.6.0 |
| Security | Helmet | 8.1.0 |
| Rate Limiting | @nestjs/throttler | 6.5.0 |
| Env Config | dotenv | 17.2.3 |

## Architecture Pattern

**Modular NestJS service layer with Firebase Firestore.**

```
AppModule (Root)
├── ThrottlerModule (30 req/min global rate limit)
├── FirebaseModule
│   └── FirebaseService (Admin SDK initialization)
└── TelemetryModule
    ├── TelemetryController (REST endpoints)
    └── TelemetryService (Firestore writes)
```

## Module Details

### FirebaseModule (`firebase/`)

Provides Firebase Admin SDK initialization. Exported for use by other modules.

**FirebaseService:**
- Initializes Firebase Admin on construction
- `FIREBASE_SERVICE_ACCOUNT` env var supports:
  - JSON string (starts with `{`)
  - File path (relative or absolute, tries multiple resolution strategies)
- `FIREBASE_PROJECT_ID` env var for project configuration
- `getFirestore()` — Returns initialized Firestore instance

### TelemetryModule (`telemetry/`)

Handles visit and event logging via REST endpoints.

**TelemetryController** — Base route: `/api/telemetry`

| Method | Path | Purpose | Response |
|--------|------|---------|----------|
| POST | `/api/telemetry/visit` | Log page visits | `{ ok: true }` |
| POST | `/api/telemetry/event` | Log custom events | `{ ok: true }` |

**TelemetryService:**
- `logVisit(payload)` — Writes to `telemetry_visits` Firestore collection
- `logEvent(payload)` — Writes to `telemetry_events` Firestore collection
- Errors are caught and logged but not thrown (silent fail, always returns 200)

## Firestore Collections

| Collection | Purpose | Written By |
|------------|---------|------------|
| `word_packs` | Word/hint pairs for the game | Migration script |
| `telemetry_visits` | App visit events | Backend + Frontend |
| `telemetry_events` | Game events (start, end) | Backend + Frontend |

### telemetry_visits Document Schema

```json
{
  "ts": "ISO-8601 string",
  "type": "visit",
  "sessionId": "string",
  "path": "string",
  "referrer": "string | null",
  "userAgent": "string",
  "timestamp": "any (client timestamp)"
}
```

### telemetry_events Document Schema

```json
{
  "ts": "ISO-8601 string",
  "type": "string (event type)",
  "sessionId": "string",
  "eventData": {}
}
```

## Bootstrap Sequence (`main.ts`)

1. Load environment variables (`dotenv.config()`)
2. Create NestJS application
3. Apply Helmet security middleware
4. Configure CORS:
   - Allowed: `localhost:5173`, `localhost:3000`, `FRONTEND_URL` env var
   - Wildcard: any `*.vercel.app` origin
   - Permissive: warns on unknown origins but still allows
5. Listen on `PORT` (default 3000)

## Security

- **Helmet**: Security headers applied globally
- **Rate Limiting**: 30 requests per 60 seconds (ThrottlerModule)
- **CORS**: Configured but permissive (allows after warning)
- **No authentication**: All endpoints are publicly accessible
- **No input validation**: Request bodies accept `any` type (no DTOs)

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_PROJECT_ID` | Yes | Firebase project identifier |
| `FIREBASE_SERVICE_ACCOUNT` | Yes | JSON string or file path to service account |
| `PORT` | No | Server port (default: 3000) |
| `FRONTEND_URL` | No | Production frontend URL for CORS |

## Migration Script (`scripts/migrate-to-firebase.ts`)

One-time utility to populate Firestore from local files:
- `migrateWordPacks()` — Reads JSON files from `word_packs/` → writes to `word_packs` collection
- `migrateTelemetryLogs()` — Reads JSONL from `logs/` → writes to telemetry collections

### Word Pack Data

Two JSON files in `word_packs/`:
- **Pack fácil.json** — ~60+ easy word pairs (e.g., "Cigarrillo ↔ Chimenea")
- **Pack difícil.json** — ~60+ hard word pairs (e.g., "Cámara ↔ Testigo")

Format: `{ p1: string, p2: string }[]`

## Build & Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `start:dev` | `nest start --watch` | Development with auto-reload |
| `start:prod` | `node dist/main` | Production run |
| `build` | `nest build` | Compile to `dist/` |
| `lint` | `eslint --fix` | Lint with auto-fix |
| `format` | `prettier --write` | Format code |
| `migrate:firebase` | `ts-node scripts/migrate-to-firebase.ts` | Run data migration |
