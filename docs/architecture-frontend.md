# Architecture — Frontend (Mobile/Web)

## Executive Summary

The frontend is a React 18 single-page application built with Vite and TypeScript. It runs entirely client-side with no server-side rendering. Game logic is managed through a centralized Zustand store. The app is wrapped with Capacitor for native Android/iOS distribution.

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| UI Framework | React | 18.2.0 |
| Build Tool | Vite | 5.0.8 |
| Language | TypeScript | 5.2.2 |
| State Management | Zustand | 4.4.1 |
| CSS Framework | Tailwind CSS | 3.3.6 |
| Mobile Runtime | Capacitor | 5.7.8 |
| Database Client | Firebase JS SDK | 12.8.0 |
| Local Storage | localforage | 1.10.0 |
| App Review | capacitor-rate-app | 4.0.3 |

## Architecture Pattern

**Component-based SPA with phase-driven game flow.**

The app uses a finite state machine pattern where `GamePhase` determines which component renders. All game state lives in a single Zustand store (`useGameState`). There is no routing library — phase transitions replace component rendering.

```
App.tsx
├── phase === 'setup' → GameSetup (page)
└── phase !== 'setup' → GamePage (page)
    ├── phase === 'clue'        → CluePhase
    ├── phase === 'turn-starter' → TurnStarterPhase
    ├── phase === 'discussion'   → DiscussionPhase
    ├── phase === 'voting'       → VotingPhase
    ├── phase === 'results'      → ResultsPhase
    └── phase === 'game-over'    → GameOverPhase
```

## State Management

### Zustand Store (`hooks/useGameState.ts`)

Single source of truth for all game state.

**State Fields:**

| Field | Type | Description |
|-------|------|-------------|
| phase | GamePhase | Current game phase |
| players | Player[] | All players with roles and status |
| civilianWord | string | Secret word for civilians |
| impostorWord | string | Alias for impostorHint |
| impostorHint | string | Hint given to impostors |
| currentCluePlayerIndex | number | Index of player revealing role |
| round | number | Current round (starts at 1) |
| votingResults | Record<string, number> | Vote counts per player |
| eliminatedPlayer | Player? | Most recently eliminated player |
| gameWinner | 'civilians' \| 'impostors'? | Winner when game ends |
| turnStarterId | string? | ID of discussion starter |
| withClues | boolean | Whether clues are enabled |

**Actions:**

| Action | Description |
|--------|-------------|
| initializeGame() | Creates players, shuffles roles, assigns words |
| setPlayerName() | Updates player name, persists to localStorage |
| startGame() | Transitions setup → clue phase |
| submitClue() | Advances to next player or turn-starter phase |
| moveToTurnStarter() | Selects random active player, transitions |
| moveToDiscussion() | Transitions to discussion phase |
| submitVote() | Records vote for a player |
| moveToResults() | Finds most-voted player, checks win conditions |
| resetGame() | Returns to initial setup state |

**Selectors:**

| Selector | Returns |
|----------|---------|
| getCurrentCluePlayer() | Current player in clue phase |
| getTurnStarterPlayer() | Player who starts discussion |
| getActivePlayers() | Non-eliminated players |
| getImpostors() | Active impostors |
| getCivilians() | Active civilians |

**Persistence:**
- Player names → localStorage key `impostor_player_names`
- Game config → localStorage key `impostor_game_config`

## Data Types (`types/game.ts`)

```typescript
type PlayerRole = 'civilian' | 'impostor'
type GamePhase = 'setup' | 'clue' | 'turn-starter' | 'discussion' | 'voting' | 'results' | 'game-over'

interface Player {
  id: string
  name: string
  role: PlayerRole
  word?: string
  isEliminated: boolean
  vote?: string
}

interface WordItem {
  word: string
  attributes: string[]
}

interface WordPack {
  id: string
  name: string
  description: string
  language: string
  words?: string[]
  wordItems?: WordItem[]
}
```

## Services Layer

### Word Pack Services

**`wordPackService.ts`** — Caching layer
- `getAllPacks()` — Returns cached packs or fetches from Firebase
- `getSelection(ids)` — Returns random {civilianWord, impostorHint} from selected packs
- `getCombinedPacks(ids)` — Merges multiple packs

**`firebaseWordPackService.ts`** — Firebase + fallback
- Fetches from Firestore `word_packs` collection
- Falls back to IndexedDB cache → hardcoded default packs
- Transforms Firebase format (p1/p2) to app format (word/attributes[])
- Default fallback: "Pack Fácil" (19 words) + "Pack Difícil" (19 words)

### Storage Service (`storageService.ts`)

IndexedDB caching via localforage:
- `cachePacks(packs)` — Stores with 7-day TTL
- `getCachedPacks()` — Retrieves if valid
- Cache TTL: 7 days (604,800,000 ms)

### Telemetry Service (`telemetryService.ts`)

Firebase event logging (direct Firestore writes):
- `logVisit()` — Records visit to `telemetry_visits` collection
- `logGameEvent(type, data)` — Records events to `telemetry_events` collection
- Session ID: UUID stored in localStorage (`impostor_sid`)
- Silent fail if Firebase unavailable

### App Review Service (`appReviewService.ts`)

Capacitor native review prompt:
- `requestReview()` — Triggers in-app review dialog
- One-time request per user (localStorage flag)
- Fallback: opens Play Store URL

## Configuration

### Firebase (`config/firebase.ts`)
- Initializes Firebase with `VITE_FIREBASE_*` env vars
- Exports `db: Firestore | null`
- Graceful failure — app continues without Firebase

### API (`config/api.ts`)
- `API_BASE_URL`: Render URL for native, empty for web (uses proxy)
- `getApiUrl(endpoint)`: Returns full URL

### Vite (`vite.config.ts`)
- Path alias: `@/` → `src/`
- Dev server: `0.0.0.0:5173`
- Proxy: `/api` → `http://localhost:3000`

### Capacitor (`capacitor.config.ts`)
- App ID: `com.aaronarias.impostor`
- Web dist: `dist`
- Backend URL: `https://impostorgame-1.onrender.com`

## UI Design

- **Dark theme**: Gradient `from-gray-900 via-gray-800 to-black`
- **Mobile-first**: min-h-screen, touch-friendly interactions
- **Safe area support**: Custom `.top-safe-4` utility for notched devices
- **Animations**: Swipe-to-reveal with glow feedback, bounce effects
- **No external UI library**: Pure Tailwind CSS utility classes

## Win Conditions

1. All impostors eliminated → Civilians win
2. Impostors ≥ Civilians remaining → Impostors win
3. Otherwise → Continue to next round (back to discussion phase)
