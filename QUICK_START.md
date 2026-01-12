# 🚀 Quick Start - 2 Minutes

## Terminal 1: Backend

```bash
cd backend
npm install
npm run start:dev
```

Wait for: `🎮 Impostor backend running on http://localhost:3000`

## Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Wait for: `➜  Local:   http://localhost:5173/`

## Browser

Open: **http://localhost:5173**

---

## Play the Game

1. **Setup**: Choose players (3-12), impostors (1+), word pack
2. **Clue Phase**: Each player gives a one-word clue (4 min)
3. **Discussion**: Talk about who's the impostor (4 min)
4. **Voting**: Vote for the impostor (4 min)
5. **Results**: See who was eliminated
6. **Impostor Guess** (if impostor eliminated): Guess the civilian word
7. **Game Over**: See final results

---

## Game Rules

- **Civilians**: Know the secret word, give clues to find the impostor
- **Impostors**: Don't know the word, try to blend in and find the civilian word
- **Win Condition**: 
  - Civilians win if all impostors are eliminated
  - Impostors win if they guess the civilian word correctly

---

## Tips

- Pass the device between players so only they see their word
- Clues should be specific but not too obvious
- Discussion is key to finding the impostor
- Impostors should give vague clues to avoid detection

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check port 3000 is free: `lsof -i :3000` |
| Frontend won't load | Check backend is running, refresh browser |
| Word packs not loading | Check network tab in DevTools, verify backend |
| Game state stuck | Refresh page and start new game |

---

## Next: Customize

Add more word packs in `backend/src/word-packs/word-packs.service.ts`

Enjoy! 🎭
