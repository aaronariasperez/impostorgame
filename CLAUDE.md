# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Impostor is a local pass-and-play social deduction game (Spanish language UI). Players share a single device, taking turns to see their secret word and give clues. Civilians try to identify the impostor; the impostor tries to blend in or guess the civilian word.

## Repository Structure

Monorepo with two independent npm projects:

- **`frontend/`** — React 18 + Vite + TypeScript + Tailwind CSS + Capacitor (mobile)
- **`backend/`** — NestJS + Firebase Admin SDK (telemetry and word pack storage)

All game logic runs client-side. The backend only serves telemetry endpoints and word pack data via Firebase Firestore.

## Common Commands

### Development

```bash
# Start both servers (requires backend/.env and backend/firebase-service-account.json)
./start-dev.sh

# Or start individually:
cd frontend && npm run dev        # Vite dev server on :5173
cd backend && npm run start:dev   # NestJS watch mode on :3000
```

### Build

```bash
cd frontend && npm run build      # tsc + vite build → frontend/dist/
cd backend && npm run build       # nest build → backend/dist/
```

### Lint

```bash
cd frontend && npm run lint       # ESLint (ts,tsx)
cd backend && npm run lint        # ESLint with auto-fix
cd backend && npm run format      # Prettier
```

### Mobile (Capacitor)

```bash
cd frontend
npm run mobile:build              # Build + cap copy
npm run mobile:android            # Build + open Android Studio
npm run mobile:apk                # Build debug APK
npm run mobile:sync               # Sync native projects
```

## Architecture

### Frontend State Management

Zustand store in `frontend/src/hooks/useGameState.ts` is the single source of truth for all game state. Player names and game config are persisted to localStorage.

### Game Phase Flow

Defined in `frontend/src/types/game.ts`. Each phase has a corresponding component in `frontend/src/components/phases/`:

`setup` → `clue` → `turn-starter` → `discussion` → `voting` → `results` → `game-over`

The `GamePage.tsx` page component renders the active phase component based on `gameState.phase`.

### Services Layer (`frontend/src/services/`)

- `wordPackService.ts` — fetches word packs, with hardcoded fallback packs ("Pack Facil", "Pack Dificil")
- `firebaseWordPackService.ts` — Firebase Firestore word pack access
- `telemetryService.ts` — session tracking and event logging
- `storageService.ts` — localStorage abstraction
- `appReviewService.ts` — Capacitor app rating prompts

### Backend Modules (`backend/src/`)

- `firebase/` — Firebase Admin initialization (Firestore)
- `telemetry/` — REST endpoints at `/api/telemetry/visit` and `/api/telemetry/event`

### Key Conventions

- Path alias: `@/` resolves to `src/` in the frontend (configured in vite.config.ts and tsconfig.json)
- Frontend dev server proxies `/api` requests to the backend at localhost:3000
- Environment variables: frontend uses `VITE_*` prefix; backend uses `.env` with Firebase config
- App ID: `com.aaronarias.impostor`
- Backend is deployed on Render; frontend on Vercel; native apps on Google Play
