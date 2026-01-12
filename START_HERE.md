# 🎭 START HERE - Impostor Game

Welcome! This is your complete guide to getting started with the Impostor game.

---

## 📋 What You Have

A **complete, production-ready** web application for playing the Impostor game with friends on a single device.

### What's Included
✅ Full-stack application (Backend + Frontend)
✅ 7 game phases with complete mechanics
✅ 3 word packs (60 words total)
✅ Mobile-first responsive design
✅ Type-safe TypeScript throughout
✅ Complete documentation
✅ Ready to deploy

---

## 🚀 Quick Start (2 Minutes)

### Step 1: Install Backend
```bash
cd backend
npm install
```

### Step 2: Install Frontend
```bash
cd frontend
npm install
```

### Step 3: Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```

Wait for: `🎮 Impostor backend running on http://localhost:3000`

### Step 4: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Wait for: `➜  Local:   http://localhost:5173/`

### Step 5: Play!
Open **http://localhost:5173** in your browser

---

## 📚 Documentation

Read these in order:

1. **QUICK_START.md** (2 min read)
   - Fastest way to get running
   - Basic troubleshooting

2. **SETUP.md** (10 min read)
   - Detailed setup instructions
   - Project structure explanation
   - Development tips

3. **ARCHITECTURE.md** (15 min read)
   - Hexagonal architecture overview
   - Data flow diagrams
   - Component hierarchy

4. **PROJECT_SUMMARY.md** (10 min read)
   - Complete feature list
   - Technology stack
   - Customization guide

5. **README.md** (5 min read)
   - Game rules
   - API documentation
   - Deployment info

---

## 🎮 How to Play

### Setup
1. Choose number of players (3-12)
2. Choose number of impostors (1 to half)
3. Select word pack
4. Click "Comenzar Juego"

### Game Flow
1. **Clue Phase** (4 min): Each player gives a one-word clue
2. **Discussion** (4 min): Discuss who's the impostor
3. **Voting** (4 min): Vote for the impostor
4. **Results**: See who was eliminated
5. **Impostor Guess** (if applicable): Impostor guesses the word
6. **Game Over**: See final results

### Win Conditions
- **Civilians Win**: All impostors eliminated
- **Impostors Win**: Guess the civilian word correctly

---

## 🏗️ Project Structure

```
impostor/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── word-packs/  # Word pack service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/  # Game phases
│   │   ├── pages/       # Setup & game
│   │   ├── hooks/       # Zustand store
│   │   ├── services/    # API client
│   │   └── types/       # TypeScript types
│   └── package.json
│
└── Documentation files
```

---

## 🔧 Technology Stack

### Backend
- **NestJS** - Modern Node.js framework
- **TypeScript** - Type-safe code
- **REST API** - Simple HTTP endpoints

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type-safe code

---

## 📱 Features

### Game Mechanics
✅ Random role assignment
✅ Secret word assignment
✅ Clue submission
✅ Discussion phase
✅ Voting system
✅ Player elimination
✅ Impostor guess mechanic
✅ Win condition checking

### User Interface
✅ Mobile-first design
✅ 4-minute timers
✅ Real-time updates
✅ Vote tracking
✅ Role reveal
✅ Game results

### Backend
✅ Word pack API
✅ 3 word packs included
✅ CORS enabled
✅ Error handling

---

## 🎯 Common Tasks

### Add a New Word Pack
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

### Change Timer Duration
Edit any phase component (e.g., `CluePhase.tsx`):

```typescript
const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
```

### Customize Styling
Edit `frontend/tailwind.config.js` for theme changes

### Deploy to Production
See **SETUP.md** for deployment instructions

---

## ❓ Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill the process if needed
kill -9 <PID>
```

### Frontend won't load
- Ensure backend is running
- Check browser console for errors
- Clear browser cache
- Refresh the page

### Word packs not loading
- Check network tab in DevTools
- Verify backend is running on port 3000
- Check browser console for errors

### Game state stuck
- Refresh the page
- Start a new game

---

## 📞 Need Help?

1. **Check the docs** - Start with QUICK_START.md
2. **Check the code** - Comments explain key parts
3. **Check the browser console** - Errors are logged there
4. **Check DevTools** - Network tab shows API calls

---

## 🎓 Learning Path

### Beginner
1. Read QUICK_START.md
2. Get the app running
3. Play a full game
4. Explore the UI

### Intermediate
1. Read SETUP.md
2. Add a new word pack
3. Change timer duration
4. Customize styling

### Advanced
1. Read ARCHITECTURE.md
2. Understand the data flow
3. Add new features
4. Deploy to production

---

## ✨ What's Next?

### Immediate
- [ ] Install dependencies
- [ ] Start both servers
- [ ] Play a game
- [ ] Invite friends

### Short Term
- [ ] Add custom word packs
- [ ] Customize styling
- [ ] Test on mobile device
- [ ] Share with friends

### Medium Term
- [ ] Deploy to production
- [ ] Add more word packs
- [ ] Gather feedback
- [ ] Plan enhancements

### Long Term
- [ ] Add database
- [ ] Add user accounts
- [ ] Add multiplayer
- [ ] Add leaderboards

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just:

1. Install dependencies
2. Start the servers
3. Open the browser
4. Play the game!

**Enjoy! 🎭**

---

## 📖 Documentation Index

| Document | Purpose | Read Time |
|----------|---------|-----------|
| START_HERE.md | This file - orientation | 5 min |
| QUICK_START.md | Fastest setup | 2 min |
| SETUP.md | Detailed setup | 10 min |
| ARCHITECTURE.md | Technical deep dive | 15 min |
| PROJECT_SUMMARY.md | Feature overview | 10 min |
| README.md | Complete reference | 5 min |
| VERIFICATION_CHECKLIST.md | Project completeness | 5 min |

---

## 🚀 Let's Go!

```bash
# Terminal 1
cd backend && npm install && npm run start:dev

# Terminal 2 (new terminal)
cd frontend && npm install && npm run dev

# Browser
# Open http://localhost:5173
```

**Happy Gaming! 🎭**
