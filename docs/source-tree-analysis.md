# Source Tree Analysis

## Repository Root

```
impostor/
├── frontend/                    # React + Capacitor mobile/web app (Part: frontend)
│   ├── src/
│   │   ├── main.tsx             # ⚡ Entry point — React DOM render
│   │   ├── App.tsx              # ⚡ Root component — phase-based routing
│   │   ├── index.css            # Global styles + Tailwind directives
│   │   ├── types/
│   │   │   └── game.ts          # Core type definitions (Player, GamePhase, WordPack)
│   │   ├── hooks/
│   │   │   └── useGameState.ts  # 🔑 Zustand store — single source of truth
│   │   ├── config/
│   │   │   ├── api.ts           # API URL configuration (Render vs proxy)
│   │   │   └── firebase.ts      # Firebase JS SDK initialization
│   │   ├── services/
│   │   │   ├── wordPackService.ts         # Word pack caching layer
│   │   │   ├── firebaseWordPackService.ts # Firebase fetch + fallback logic
│   │   │   ├── telemetryService.ts        # Visit/event logging to Firestore
│   │   │   ├── storageService.ts          # IndexedDB cache (localforage)
│   │   │   └── appReviewService.ts        # Capacitor app review prompts
│   │   ├── pages/
│   │   │   ├── GameSetup.tsx    # Setup screen (players, packs, config)
│   │   │   └── GamePage.tsx     # Phase router → renders active phase component
│   │   └── components/
│   │       ├── LoadingScreen.tsx # Loading spinner UI
│   │       ├── Timer.tsx        # Countdown timer display
│   │       └── phases/
│   │           ├── CluePhase.tsx        # Swipe-to-reveal role/word
│   │           ├── TurnStarterPhase.tsx # Random player selection
│   │           ├── DiscussionPhase.tsx  # Timed discussion (4 min)
│   │           ├── VotingPhase.tsx      # Player elimination vote
│   │           ├── ResultsPhase.tsx     # Vote results + win check
│   │           └── GameOverPhase.tsx    # Final results + play again
│   ├── public/                  # Static assets
│   ├── android/                 # Capacitor Android project
│   ├── ios/                     # Capacitor iOS project
│   ├── dist/                    # Build output (Vite)
│   ├── capacitor.config.ts      # Capacitor config (app ID, server URL)
│   ├── vite.config.ts           # Vite config (alias, proxy, server)
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── tsconfig.json            # TypeScript config (@/ alias)
│   ├── vercel.json              # Vercel rewrites (/api → Render)
│   ├── index.html               # HTML entry point
│   ├── postcss.config.js        # PostCSS (Tailwind + Autoprefixer)
│   └── package.json             # Dependencies & scripts
│
├── backend/                     # NestJS API server (Part: backend)
│   ├── src/
│   │   ├── main.ts              # ⚡ Entry point — NestJS bootstrap
│   │   ├── app.module.ts        # Root module (imports all modules)
│   │   ├── firebase/
│   │   │   ├── firebase.module.ts   # Firebase module definition
│   │   │   └── firebase.service.ts  # 🔑 Firebase Admin SDK initialization
│   │   └── telemetry/
│   │       ├── telemetry.module.ts      # Telemetry module definition
│   │       ├── telemetry.controller.ts  # REST endpoints (/api/telemetry/*)
│   │       └── telemetry.service.ts     # Firestore write logic
│   ├── scripts/
│   │   └── migrate-to-firebase.ts # One-time data migration script
│   ├── word_packs/
│   │   ├── Pack fácil.json      # Easy word pairs (~60+)
│   │   └── Pack difícil.json    # Hard word pairs (~60+)
│   ├── dist/                    # Build output (nest build)
│   ├── nest-cli.json            # NestJS CLI config
│   ├── tsconfig.json            # TypeScript config
│   ├── .env                     # Environment variables (gitignored)
│   ├── firebase-service-account.json # Firebase credentials (gitignored)
│   └── package.json             # Dependencies & scripts
│
├── start-dev.sh                 # 🚀 Start both servers in parallel
├── build-apk.sh                 # Build debug APK
├── build-bundle.sh              # Build release AAB (Play Store)
├── build-release.sh             # Build signed release APK
├── generate-keystore.sh         # Generate Android signing keystore
├── impostor-release-key.jks     # Android keystore (gitignored)
├── icon.png                     # App icon source
├── feature_graphic.png          # Play Store feature graphic
├── imagen_portada.png           # Cover image
├── README.md                    # Project documentation
├── CLAUDE.md                    # AI assistant guidance
├── BUGS_FASE_PRUEBA.md          # Testing bug log
├── PLAY_STORE_UPLOAD.md         # Play Store upload guide
├── QUICK_START_UPLOAD.md        # Quick upload reference
├── PRIVACY_POLICY.md            # Privacy policy
├── TERMS_OF_SERVICE.md          # Terms of service
└── package.json                 # Root package (sharp devDependency)
```

## Legend

- ⚡ Entry point
- 🔑 Critical file (core logic)
- 🚀 Developer utility script

## Critical Directories

| Directory | Purpose | Part |
|-----------|---------|------|
| `frontend/src/hooks/` | Zustand game state store | Frontend |
| `frontend/src/components/phases/` | All game phase UI components | Frontend |
| `frontend/src/services/` | Data fetching, caching, telemetry | Frontend |
| `frontend/src/config/` | Firebase and API configuration | Frontend |
| `frontend/src/types/` | Shared TypeScript type definitions | Frontend |
| `backend/src/firebase/` | Firebase Admin SDK initialization | Backend |
| `backend/src/telemetry/` | REST telemetry endpoints | Backend |
| `backend/word_packs/` | Source word pack JSON data | Backend |

## Integration Points

- `frontend/src/config/api.ts` → `backend/src/main.ts` (REST API via proxy/direct URL)
- `frontend/src/config/firebase.ts` → Firebase Firestore (direct client SDK)
- `frontend/vercel.json` → Rewrites `/api/*` to Render backend
- `frontend/vite.config.ts` → Dev proxy `/api` to `localhost:3000`
