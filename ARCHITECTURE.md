# 🏗️ Hexagonal Architecture - Impostor Game

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    UI Layer (Components)                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │  Setup   │ │  Clue    │ │Discussion│ │ Voting   │    │   │
│  │  │  Phase   │ │  Phase   │ │  Phase   │ │  Phase   │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │   │
│  │  │ Results  │ │ Impostor │ │ Game     │                 │   │
│  │  │  Phase   │ │  Guess   │ │  Over    │                 │   │
│  │  └──────────┘ └──────────┘ └──────────┘                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                    │
│                              │ (reads/writes)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Application Layer (Zustand Store)                │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │              Game State                             │  │   │
│  │  │  • phase, players, words, votes, round, etc.       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │              Game Actions                           │  │   │
│  │  │  • initializeGame, submitClue, submitVote, etc.    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                    │
│                              │ (API calls)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Service Layer (wordPackService)                  │   │
│  │                                                            │   │
│  │  • getAllPacks()                                           │   │
│  │  • getPackById(id)                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                    │
│                              │ (HTTP)                             │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌──────────────┐      ┌──────────────┐
            │   Browser    │      │   Network    │
            │   Storage    │      │   (HTTP)     │
            └──────────────┘      └──────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Layer (Controllers)                      │   │
│  │                                                            │   │
│  │  GET  /api/word-packs          → getAllPacks()           │   │
│  │  GET  /api/word-packs/:id      → getPackById(id)         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                    │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Business Logic Layer (Services)                   │   │
│  │                                                            │   │
│  │  WordPacksService:                                         │   │
│  │  • getAllPacks()                                           │   │
│  │  • getPackById(id)                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                    │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Data Layer (In-Memory)                            │   │
│  │                                                            │   │
│  │  wordPacks: WordPack[] = [                                │   │
│  │    { id: 'animals', words: [...] },                       │   │
│  │    { id: 'fruits', words: [...] },                        │   │
│  │    { id: 'professions', words: [...] }                    │   │
│  │  ]                                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Hexagonal Architecture Principles

### Ports (Interfaces)

**Primary Ports (Driving):**
- React Components → User interactions
- HTTP Requests → API calls

**Secondary Ports (Driven):**
- Zustand Store → State management
- REST API → Word pack service

### Adapters

**Primary Adapters:**
- React UI components
- Browser event handlers

**Secondary Adapters:**
- Zustand store implementation
- NestJS HTTP controllers

### Core Domain

**Game Logic (Frontend):**
- Player management
- Role assignment
- Phase transitions
- Voting logic
- Win conditions

**Word Management (Backend):**
- Word pack storage
- Word pack retrieval

---

## Data Flow

### 1. Game Initialization

```
User Input (Setup)
    ↓
GameSetup Component
    ↓
wordPackService.getPackById(id)
    ↓
Backend: GET /api/word-packs/:id
    ↓
WordPacksService.getPackById(id)
    ↓
Return words
    ↓
useGameState.initializeGame()
    ↓
Zustand Store (update state)
    ↓
Components re-render
```

### 2. Clue Submission

```
Player Input (Clue)
    ↓
CluePhase Component
    ↓
useGameState.submitClue(playerId, clue)
    ↓
Zustand Store (update player clue)
    ↓
Check if all clues submitted
    ↓
Auto-advance to next player or discussion
    ↓
Components re-render
```

### 3. Voting

```
Player Input (Vote)
    ↓
VotingPhase Component
    ↓
useGameState.submitVote(playerId, votedForId)
    ↓
Zustand Store (update vote count)
    ↓
Check if all voted
    ↓
Auto-advance to results
    ↓
Components re-render
```

---

## State Management (Zustand)

### Store Structure

```typescript
interface GameState {
  // Game metadata
  phase: GamePhase;
  round: number;
  
  // Players
  players: Player[];
  currentCluePlayerIndex: number;
  
  // Words
  civilianWord: string;
  impostorWord: string;
  
  // Voting
  votingResults: Record<string, number>;
  eliminatedPlayer?: Player;
  
  // Game end
  gameWinner?: 'civilians' | 'impostors';
  impostorGuessWord?: string;
  impostorGuessCorrect?: boolean;
  
  // Actions
  initializeGame(...): void;
  submitClue(...): void;
  submitVote(...): void;
  submitImpostorGuess(...): void;
  resetGame(): void;
  
  // Selectors
  getCurrentCluePlayer(): Player | null;
  getActivePlayers(): Player[];
  getImpostors(): Player[];
  getCivilians(): Player[];
}
```

---

## Component Hierarchy

```
App
├── GameSetup (phase === 'setup')
│   ├── Word Pack Selection
│   ├── Player Count Slider
│   └── Impostor Count Slider
│
└── GamePage (phase !== 'setup')
    ├── CluePhase (phase === 'clue')
    │   ├── Timer
    │   ├── Word Display
    │   └── Clue Input
    │
    ├── DiscussionPhase (phase === 'discussion')
    │   ├── Timer
    │   └── Clues Display
    │
    ├── VotingPhase (phase === 'voting')
    │   ├── Timer
    │   └── Vote Buttons
    │
    ├── ResultsPhase (phase === 'results')
    │   ├── Eliminated Player
    │   └── Remaining Players
    │
    ├── ImpostorGuessPhase (phase === 'impostor-guess')
    │   └── Guess Input
    │
    └── GameOverPhase (phase === 'game-over')
        ├── Winner Display
        ├── Final Roles
        └── Play Again Button
```

---

## API Contract

### Request/Response Examples

#### GET /api/word-packs

**Response (200):**
```json
[
  {
    "id": "animals",
    "name": "Animales",
    "description": "Palabras relacionadas con animales",
    "language": "es"
  },
  {
    "id": "fruits",
    "name": "Frutas",
    "description": "Palabras relacionadas con frutas",
    "language": "es"
  }
]
```

#### GET /api/word-packs/:id

**Response (200):**
```json
{
  "id": "animals",
  "name": "Animales",
  "description": "Palabras relacionadas con animales",
  "language": "es",
  "words": [
    "Gato",
    "Perro",
    "Elefante",
    "Jirafa",
    "Pingüino",
    ...
  ]
}
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "Word pack with id \"invalid\" not found"
}
```

---

## Separation of Concerns

### Frontend Responsibilities
- ✅ User interface
- ✅ Game state management
- ✅ Game logic (phases, voting, win conditions)
- ✅ Player interactions
- ✅ Timer management
- ✅ Local storage (optional)

### Backend Responsibilities
- ✅ Word pack management
- ✅ Word pack retrieval
- ✅ API endpoints
- ✅ CORS handling

### NOT Implemented (By Design)
- ❌ User authentication
- ❌ Game persistence
- ❌ Multiplayer synchronization
- ❌ Real-time communication
- ❌ Leaderboards

---

## Scalability Considerations

### Current Limitations
- Single device only
- No persistence
- No real-time sync
- In-memory word packs

### Future Enhancements
1. **Database**: Replace in-memory word packs with PostgreSQL
2. **Custom Packs**: Allow users to upload custom word packs
3. **Multiplayer**: Add WebSocket for real-time multiplayer
4. **Persistence**: Save game history and statistics
5. **Authentication**: User accounts and profiles
6. **Difficulty Levels**: Adjust word complexity

---

## Testing Strategy

### Unit Tests
- Zustand store actions
- Word pack service
- Game logic functions

### Integration Tests
- API endpoints
- Frontend-backend communication
- Game flow scenarios

### E2E Tests
- Full game playthrough
- All phases and transitions
- Win/loss conditions

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                    │
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │   Frontend (Vercel)  │         │  Backend (Railway)   │  │
│  │                      │         │                      │  │
│  │  • React + Vite      │◄────────│  • NestJS            │  │
│  │  • Tailwind CSS      │ HTTPS   │  • Word Packs DB     │  │
│  │  • Zustand           │         │  • CORS Enabled      │  │
│  │                      │         │                      │  │
│  └──────────────────────┘         └──────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Game Logic in Frontend
**Why**: Single device, no server-side game state needed
**Benefit**: Reduced backend complexity, faster gameplay

### 2. Zustand for State Management
**Why**: Lightweight, simple API, no boilerplate
**Benefit**: Easy to understand and maintain

### 3. Minimal Backend
**Why**: Only serves word packs
**Benefit**: Easy to deploy, low maintenance

### 4. Hexagonal Architecture
**Why**: Clear separation of concerns
**Benefit**: Easy to test, extend, and refactor

### 5. Mobile-First Design
**Why**: Game is played on a single device
**Benefit**: Optimized for touch, responsive layout

---

## Conclusion

This architecture provides a clean, maintainable, and scalable foundation for the Impostor game. The separation between frontend game logic and backend word service keeps the codebase organized and easy to understand.
