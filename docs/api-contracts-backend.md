# API Contracts — Backend

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://impostorgame-1.onrender.com`
- **Web Frontend (dev)**: Proxied via Vite (`/api` → `localhost:3000`)
- **Web Frontend (prod)**: Proxied via Vercel rewrites (`/api/*` → Render)
- **Native Apps**: Direct URL to Render

## Rate Limiting

Global rate limit: **30 requests per 60 seconds** (ThrottlerModule)

## Authentication

None. All endpoints are publicly accessible.

---

## Endpoints

### POST `/api/telemetry/visit`

Log a page/app visit event.

**Request Body:**

```json
{
  "sessionId": "uuid-string",
  "path": "/",
  "referrer": "https://example.com",
  "ua": "Mozilla/5.0 ...",
  "ts": 1706000000000
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sessionId | string | Yes | Client-generated UUID (persisted in localStorage) |
| path | string | Yes | Page path visited |
| referrer | string | No | Referrer URL |
| ua | string | Yes | User agent string |
| ts | number | Yes | Client-side timestamp (epoch ms) |

**Response:** `200 OK`

```json
{ "ok": true }
```

**Firestore Document Written** (`telemetry_visits` collection):

```json
{
  "ts": "2026-01-23T12:00:00.000Z",
  "type": "visit",
  "sessionId": "uuid-string",
  "path": "/",
  "referrer": "https://example.com",
  "userAgent": "Mozilla/5.0 ...",
  "timestamp": 1706000000000
}
```

---

### POST `/api/telemetry/event`

Log a custom game event.

**Request Body:**

```json
{
  "sessionId": "uuid-string",
  "eventType": "game_start",
  "data": {
    "playerCount": 5,
    "impostorCount": 1,
    "wordPackIds": ["pack facil"]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sessionId | string | Yes | Client-generated UUID |
| eventType | string | Yes | Event type identifier |
| data | object | No | Arbitrary event-specific data |

**Response:** `200 OK`

```json
{ "ok": true }
```

**Firestore Document Written** (`telemetry_events` collection):

```json
{
  "ts": "2026-01-23T12:00:00.000Z",
  "type": "game_start",
  "sessionId": "uuid-string",
  "eventData": {
    "playerCount": 5,
    "impostorCount": 1,
    "wordPackIds": ["pack facil"]
  }
}
```

---

## Known Event Types

| Event Type | When Fired | Data Fields |
|------------|-----------|-------------|
| `game_start` | Game initialized from setup | playerCount, impostorCount, wordPackIds |
| `game_end` | Game reaches game-over phase | winner, round, players, impostors, civilians |

## Error Handling

- All errors are caught and logged server-side
- Endpoints always return `{ ok: true }` regardless of success/failure
- No error response codes are returned to clients

## CORS Configuration

| Origin | Allowed |
|--------|---------|
| `http://localhost:5173` | Yes |
| `http://localhost:3000` | Yes |
| `FRONTEND_URL` env var | Yes |
| `*.vercel.app` | Yes (wildcard) |
| Other origins | Yes (with console warning) |

## Input Validation

**None.** All request bodies are typed as `any` in the controller. No DTOs or validation pipes are applied.
