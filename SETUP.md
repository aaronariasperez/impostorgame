# 🎭 Impostor - Setup & Development Guide

## Project Overview

This is a full-stack implementation of the "Impostor" social deduction game using:
- **Backend**: NestJS (minimal - only serves word packs)
- **Frontend**: React + Vite + Zustand + Tailwind CSS
- **Architecture**: Hexagonal (game logic lives in frontend, backend is a simple service)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Run Backend (Terminal 1)

```bash
cd backend
npm run start:dev
```

Expected output:
```
🎮 Impostor backend running on http://localhost:3000
```

### 4. Run Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 5. Open in Browser

Navigate to `http://localhost:5173` and start playing!

---

## Project Structure

```
impostor/
├── backend/
│   ├── src/
│   │   ├── word-packs/
│   │   │   ├── word-packs.controller.ts    # API endpoints
│   │   │   ├── word-packs.service.ts       # Word pack logic
│   │   │   └── word-packs.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Timer.tsx                   # Shared timer component
│   │   │   └── phases/
│   │   │       ├── CluePhase.tsx           # Players give clues
│   │   │       ├── DiscussionPhase.tsx     # Discussion time
│   │   │       ├── VotingPhase.tsx         # Voting phase
│   │   │       ├── ResultsPhase.tsx        # Show results
│   │   │       ├── ImpostorGuessPhase.tsx  # Impostor guesses
│   │   │       └── GameOverPhase.tsx       # Game end
│   │   ├── pages/
│   │   │   ├── GameSetup.tsx               # Initial setup
│   │   │   └── GamePage.tsx                # Main game router
│   │   ├── hooks/
│   │   │   └── useGameState.ts             # Zustand store
│   │   ├── services/
│   │   │   └── wordPackService.ts          # API calls
│   │   ├── types/
│   │   │   └── game.ts                     # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
├── SETUP.md (this file)
└── .gitignore
```

---

## Game Flow

### Setup Phase
1. Select number of players (3-12)
2. Select number of impostors (1 to half of players)
3. Choose word pack (Animals, Fruits, Professions)
4. Game initializes with random role assignment

### Clue Phase (4 minutes per player)
- Each player sees their secret word
- Players give one-word clues
- Can skip if desired
- Auto-advances to next player or discussion

### Discussion Phase (4 minutes)
- All players discuss who they think is the impostor
- Can see all clues given
- Manual or auto-advance to voting

### Voting Phase (4 minutes)
- All players vote for who they think is the impostor
- Majority vote wins
- Auto-advances when all voted or time runs out

### Results Phase
- Shows who was eliminated and their role
- Shows remaining impostors and civilians
- Determines next action

### Impostor Guess Phase (if impostor was eliminated)
- Eliminated impostor gets one chance to guess the civilian word
- If correct: impostors win
- If incorrect: continue to next round or civilians win

### Game Over
- Shows final results
- Displays all player roles
- Option to play again

---

## Backend API

### Endpoints

#### GET `/api/word-packs`
Returns list of available word packs (without words)

**Response:**
```json
[
  {
    "id": "animals",
    "name": "Animales",
    "description": "Palabras relacionadas con animales",
    "language": "es"
  },
  ...
]
```

#### GET `/api/word-packs/:id`
Returns a specific word pack with all words

**Response:**
```json
{
  "id": "animals",
  "name": "Animales",
  "description": "Palabras relacionadas con animales",
  "language": "es",
  "words": ["Gato", "Perro", "Elefante", ...]
}
```

---

## Frontend State Management

Using **Zustand** for game state:

```typescript
// Access state
const players = useGameState((state) => state.players);
const phase = useGameState((state) => state.phase);

// Call actions
const submitClue = useGameState((state) => state.submitClue);
submitClue(playerId, clueText);
```

### Game State Structure

```typescript
interface GameState {
  phase: GamePhase; // 'setup' | 'clue' | 'discussion' | 'voting' | 'results' | 'impostor-guess' | 'game-over'
  players: Player[];
  civilianWord: string;
  impostorWord: string;
  currentCluePlayerIndex: number;
  round: number;
  votingResults: Record<string, number>;
  eliminatedPlayer?: Player;
  gameWinner?: 'civilians' | 'impostors';
  impostorGuessWord?: string;
  impostorGuessCorrect?: boolean;
}
```

---

## Adding New Word Packs

Edit `backend/src/word-packs/word-packs.service.ts`:

```typescript
private wordPacks: WordPack[] = [
  // ... existing packs
  {
    id: 'sports',
    name: 'Deportes',
    description: 'Palabras relacionadas con deportes',
    language: 'es',
    words: [
      'Fútbol',
      'Tenis',
      'Baloncesto',
      // ... 20 words
    ],
  },
];
```

Then restart the backend.

---

## Development Tips

### Hot Reload
- **Backend**: Automatically reloads on file changes (with `npm run start:dev`)
- **Frontend**: Automatically reloads on file changes (with `npm run dev`)

### Debugging
- Use React DevTools browser extension for component inspection
- Check browser console for errors
- Use `console.log()` in components or Zustand actions

### Testing Game Flow
1. Open app in browser
2. Set up game with 3+ players
3. Pass phone/device between players for each phase
4. Each player sees only their own word during clue phase

### Mobile Testing
- Frontend is mobile-first responsive
- Test on actual mobile device or use browser DevTools device emulation
- Ensure touch interactions work smoothly

---

## Common Issues

### Backend not connecting
- Ensure backend is running on port 3000
- Check CORS is enabled in `main.ts`
- Verify frontend proxy in `vite.config.ts`

### Word packs not loading
- Check network tab in DevTools
- Verify backend is serving `/api/word-packs`
- Check browser console for errors

### Game state not updating
- Verify Zustand hooks are called correctly
- Check that actions are being dispatched
- Use React DevTools to inspect state changes

---

## Next Steps

1. **Test the setup** - Run both servers and play a full game
2. **Add more word packs** - Customize with your own categories
3. **Deploy** - Consider Vercel (frontend) + Railway/Render (backend)
4. **Enhance** - Add features like custom word packs, difficulty levels, etc.

---

## Useful Commands

```bash
# Backend
cd backend
npm run start:dev      # Development with hot reload
npm run build          # Build for production
npm run start:prod     # Run production build

# Frontend
cd frontend
npm run dev            # Development with hot reload
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

---

## Architecture Notes

### Why Hexagonal Architecture?

**Ports (Interfaces):**
- Frontend: React components (UI layer)
- Backend: REST API (service layer)

**Adapters:**
- Frontend: Zustand store (state management)
- Backend: NestJS controllers (HTTP handling)

**Core Domain:**
- Game logic (all in frontend for simplicity)
- Word management (backend service)

This keeps concerns separated and makes the app easy to extend.

---

## License

MIT
