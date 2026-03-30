# Component Inventory — Frontend

## Component Hierarchy

```
App.tsx (Root)
├── LoadingScreen (shared)
├── GameSetup (page)
│   └── LoadingScreen
└── GamePage (page)
    ├── CluePhase
    │   └── LoadingScreen
    ├── TurnStarterPhase
    ├── DiscussionPhase
    │   └── Timer
    ├── VotingPhase
    ├── ResultsPhase
    └── GameOverPhase
```

---

## Pages

### App (`App.tsx`)

| Property | Value |
|----------|-------|
| Type | Root component |
| Props | None |
| State | isLoading (boolean) |
| Side Effects | Logs visit telemetry on mount |
| Routing | phase === 'setup' → GameSetup, else → GamePage |

### GameSetup (`pages/GameSetup.tsx`)

| Property | Value |
|----------|-------|
| Type | Page |
| Props | None (uses Zustand) |
| State | playerCount, impostorCount, playerNames, availablePacks, selectedPackIds, withClues, isLoading |
| Side Effects | Fetches word packs, loads/saves localStorage config, requests app review |
| Key Features | Range slider for player count, impostor count selector, pack checkboxes, clue toggle |

**User Interactions:**
- Adjust player count (3–12 via range slider)
- Adjust impostor count (1 to playerCount/2)
- Edit player names (auto-saved)
- Select word packs (checkboxes, multiple selection)
- Toggle "play with clues"
- Start game button

### GamePage (`pages/GamePage.tsx`)

| Property | Value |
|----------|-------|
| Type | Page (phase router) |
| Props | None |
| State | None (reads phase from Zustand) |
| Side Effects | Logs game_end telemetry when game-over |
| Renders | Active phase component based on gameState.phase |

---

## Phase Components

### CluePhase (`components/phases/CluePhase.tsx`)

| Property | Value |
|----------|-------|
| Type | Game phase |
| Timer | 240 seconds (4 minutes) |
| State | timeLeft, submitted, revealed, dragY, displayedPlayerName, coverPlayerName, isDragging |
| Key Feature | Swipe-to-reveal mechanic (300px threshold) |
| Animations | Glow effect (cubic-bezier easing), drag feedback |
| Input | Touch + mouse drag support |

**Behavior:**
- Shows cover card per player
- Player drags upward to reveal their role + word/hint
- Glow intensity increases with drag progress (0–0.8 opacity)
- Only shows word on round 1 (impostors always see hint if clues enabled)
- After reveal, continue button advances to next player
- After all players → transitions to turn-starter

### TurnStarterPhase (`components/phases/TurnStarterPhase.tsx`)

| Property | Value |
|----------|-------|
| Type | Game phase |
| State | showName (boolean) |
| Delay | 500ms before name reveal |
| Animation | Bounce on name |

**Behavior:**
- Randomly selects one active player
- Displays their name as discussion starter
- Transitions to discussion phase

### DiscussionPhase (`components/phases/DiscussionPhase.tsx`)

| Property | Value |
|----------|-------|
| Type | Game phase |
| Timer | 240 seconds (4 minutes) |
| State | timeLeft |
| Uses | Timer component |

**Behavior:**
- Displays discussion instructions
- Countdown timer (auto-transitions to voting at 0)
- Manual "Move to Voting" button available

### VotingPhase (`components/phases/VotingPhase.tsx`)

| Property | Value |
|----------|-------|
| Type | Game phase |
| State | selectedPlayer |

**Behavior:**
- Lists all active players as vote targets
- Blue highlight on selected player
- Confirm vote button → reveals role → transitions to results

### ResultsPhase (`components/phases/ResultsPhase.tsx`)

| Property | Value |
|----------|-------|
| Type | Game phase |

**Behavior:**
- Shows eliminated player's name and role badge
- Displays remaining impostor/civilian counts
- Win condition check:
  - All impostors eliminated → game-over (civilians win)
  - Impostors ≥ civilians → game-over (impostors win)
  - Otherwise → next round (back to discussion)

### GameOverPhase (`components/phases/GameOverPhase.tsx`)

| Property | Value |
|----------|-------|
| Type | Game phase |

**Behavior:**
- Displays winner: "¡Civiles Ganan!" or "¡Impostores Ganan!"
- Reveals the civilian word
- Lists all players with their final roles
- "Play Again" button → resets to setup

---

## Shared Components

### LoadingScreen (`components/LoadingScreen.tsx`)

| Property | Value |
|----------|-------|
| Type | Shared UI |
| Props | message?: string, subMessage?: string |

Animated spinner with optional message text. Used during app init, word pack loading, and clue phase transitions.

### Timer (`components/Timer.tsx`)

| Property | Value |
|----------|-------|
| Type | Shared UI |
| Props | timeLeft: number (seconds) |

Displays countdown as `M:SS`. Changes color from blue to red when under 60 seconds. Used in DiscussionPhase.

---

## Design Patterns

| Pattern | Details |
|---------|---------|
| State Access | Zustand selector hooks: `useGameState(s => s.field)` |
| Phase Routing | Conditional rendering in GamePage based on `phase` |
| Data Loading | Service layer with Firebase → cache → fallback chain |
| UI Framework | Tailwind utility classes, no component library |
| Color Scheme | Dark theme (gray-900 → black gradient) |
| Role Indicators | Blue badges (civilian), Red badges (impostor) |
| Interactive | Touch/mouse drag, range sliders, toggle switches |
