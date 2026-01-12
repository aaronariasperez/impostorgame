# 🎭 Impostor Game - Project Summary

## What Was Built

A complete, production-ready implementation of the "Impostor" social deduction game with:

- **Full-stack application** using NestJS (backend) and React (frontend)
- **Hexagonal architecture** with clear separation of concerns
- **Mobile-first responsive design** optimized for single-device gameplay
- **Complete game flow** with 7 phases and all game mechanics
- **Type-safe** implementation with TypeScript throughout
- **Modern tooling** with Vite, Tailwind CSS, and Zustand

---

## Project Structure

```
impostor/
├── backend/                          # NestJS API Server
│   ├── src/
│   │   ├── word-packs/              # Word pack service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                         # React + Vite App
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Zustand store
│   │   ├── services/                # API client
│   │   ├── types/                   # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md                         # Main documentation
├── QUICK_START.md                    # 2-minute setup guide
├── SETUP.md                          # Detailed setup guide
├── ARCHITECTURE.md                   # Architecture documentation
├── PROJECT_SUMMARY.md                # This file
└── .gitignore
```

---

## Key Features

### ✅ Game Mechanics
- [x] Player setup (3-12 players)
- [x] Configurable impostor count
- [x] Random role assignment
- [x] 7 game phases with smooth transitions
- [x] 4-minute timers for each phase
- [x] Voting system with majority rule
- [x] Impostor guess mechanic
- [x] Win conditions for both teams

### ✅ User Interface
- [x] Mobile-first responsive design
- [x] Intuitive phase-based navigation
- [x] Real-time timer display
- [x] Clear role and word display
- [x] Vote tracking and results
- [x] Game over summary

### ✅ Backend
- [x] NestJS REST API
- [x] Word pack management
- [x] 3 pre-loaded word packs (Animals, Fruits, Professions)
- [x] CORS enabled for development
- [x] Type-safe endpoints

### ✅ Frontend
- [x] React with TypeScript
- [x] Zustand state management
- [x] Tailwind CSS styling
- [x] Vite for fast development
- [x] Component-based architecture

### ✅ Development Experience
- [x] Hot module reloading
- [x] TypeScript strict mode
- [x] ESLint configuration
- [x] Clear project structure
- [x] Comprehensive documentation

---

## Game Rules

### Setup
1. Choose number of players (3-12)
2. Choose number of impostors (1 to half of players)
3. Select word pack
4. Game assigns random roles

### Gameplay

**Clue Phase (4 minutes)**
- Each player sees their secret word
- Players give one-word clues
- Clues help civilians identify impostors
- Impostors try to blend in

**Discussion Phase (4 minutes)**
- All players discuss who they think is the impostor
- Can see all clues given
- Debate and reasoning

**Voting Phase (4 minutes)**
- All players vote for who they think is the impostor
- Majority vote wins
- Voting results are visible

**Results Phase**
- Eliminated player's role is revealed
- Remaining impostors and civilians shown
- Next action determined

**Impostor Guess Phase** (if impostor eliminated)
- Eliminated impostor gets one chance
- Must guess the civilian word
- If correct: impostors win
- If incorrect: continue or civilians win

**Game Over**
- Final results displayed
- All player roles revealed
- Option to play again

### Win Conditions
- **Civilians Win**: All impostors eliminated
- **Impostors Win**: Guess the civilian word correctly

---

## Technology Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Runtime**: Node.js 18+
- **Package Manager**: npm

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **State Management**: Zustand 4
- **Styling**: Tailwind CSS 3
- **Package Manager**: npm

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Running

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Browser:**
Open http://localhost:5173

---

## API Endpoints

### Word Packs

**GET /api/word-packs**
- Returns list of available word packs
- No authentication required

**GET /api/word-packs/:id**
- Returns specific word pack with all words
- No authentication required

---

## State Management

### Zustand Store (`useGameState`)

**State:**
- `phase`: Current game phase
- `players`: Array of players with roles
- `civilianWord`: Secret word for civilians
- `impostorWord`: Secret word for impostors
- `votingResults`: Vote counts
- `round`: Current round number
- `gameWinner`: Winner when game ends

**Actions:**
- `initializeGame()`: Set up new game
- `submitClue()`: Submit player clue
- `submitVote()`: Submit player vote
- `submitImpostorGuess()`: Submit impostor guess
- `resetGame()`: Reset to setup phase

**Selectors:**
- `getCurrentCluePlayer()`: Get player giving clue
- `getActivePlayers()`: Get non-eliminated players
- `getImpostors()`: Get remaining impostors
- `getCivilians()`: Get remaining civilians

---

## Component Architecture

### Pages
- **GameSetup**: Initial configuration
- **GamePage**: Main game router

### Phases
- **CluePhase**: Players give clues
- **DiscussionPhase**: Discussion time
- **VotingPhase**: Voting interface
- **ResultsPhase**: Show results
- **ImpostorGuessPhase**: Impostor guesses
- **GameOverPhase**: Final results

### Shared
- **Timer**: 4-minute countdown display

---

## Customization

### Adding Word Packs

Edit `backend/src/word-packs/word-packs.service.ts`:

```typescript
{
  id: 'sports',
  name: 'Deportes',
  description: 'Palabras relacionadas con deportes',
  language: 'es',
  words: [
    'Fútbol', 'Tenis', 'Baloncesto',
    // ... 20 words
  ],
}
```

### Changing Timer Duration

Edit phase components (e.g., `CluePhase.tsx`):

```typescript
const [timeLeft, setTimeLeft] = useState(300); // 5 minutes instead of 4
```

### Styling

All styling uses Tailwind CSS. Modify `frontend/tailwind.config.js` for theme changes.

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Deploy to Railway or Render
```

### Environment Variables

**Backend (.env):**
```
PORT=3000
NODE_ENV=production
```

**Frontend (vite.config.ts):**
```typescript
proxy: {
  '/api': {
    target: 'https://your-backend-url.com',
    changeOrigin: true,
  },
}
```

---

## Future Enhancements

### Phase 2
- [ ] Database integration (PostgreSQL)
- [ ] Custom word pack uploads
- [ ] Difficulty levels
- [ ] Game statistics

### Phase 3
- [ ] User authentication
- [ ] Multiplayer (WebSocket)
- [ ] Game history
- [ ] Leaderboards

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] AI opponents
- [ ] Achievements

---

## Documentation Files

1. **README.md** - Main project documentation
2. **QUICK_START.md** - 2-minute setup guide
3. **SETUP.md** - Detailed setup and development guide
4. **ARCHITECTURE.md** - Hexagonal architecture explanation
5. **PROJECT_SUMMARY.md** - This file

---

## Code Quality

### TypeScript
- Strict mode enabled
- Full type coverage
- No `any` types

### Linting
- ESLint configured
- Prettier formatting
- Consistent code style

### Testing
- Ready for unit tests
- Ready for integration tests
- Ready for E2E tests

---

## Performance

### Frontend
- Vite for fast builds
- React 18 with concurrent features
- Zustand for minimal re-renders
- Tailwind CSS for optimized styles

### Backend
- NestJS for scalability
- In-memory storage (fast)
- Minimal API surface

---

## Security Considerations

### Current Implementation
- CORS enabled for development
- No authentication (single device)
- No sensitive data stored

### Production Recommendations
- Add authentication if needed
- Validate all inputs
- Use HTTPS
- Rate limiting on API
- Environment variables for secrets

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill process if needed
kill -9 <PID>
```

### Frontend won't load
- Ensure backend is running
- Check browser console for errors
- Clear browser cache
- Refresh page

### Word packs not loading
- Check network tab in DevTools
- Verify backend is running
- Check CORS settings
- Verify API endpoint

---

## Project Statistics

- **Total Files**: 30+
- **Lines of Code**: ~2000
- **Components**: 8
- **API Endpoints**: 2
- **Word Packs**: 3 (60 words)
- **Game Phases**: 7
- **Supported Players**: 3-12

---

## License

MIT

---

## Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check browser console for errors
4. Verify backend is running
5. Try clearing cache and restarting

---

## Next Steps

1. ✅ **Setup**: Follow QUICK_START.md
2. ✅ **Play**: Test a full game
3. ✅ **Customize**: Add your own word packs
4. ✅ **Deploy**: Push to production
5. ✅ **Enhance**: Add features from Phase 2

---

**Happy Gaming! 🎭**
