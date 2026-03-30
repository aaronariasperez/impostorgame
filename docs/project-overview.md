# Project Overview — Impostor

## Executive Summary

Impostor is a local pass-and-play social deduction party game with a Spanish-language UI. Players share a single device, taking turns to see their secret word and give clues. Civilians try to identify the impostor; the impostor tries to blend in or guess the civilian word. The game is available as a web app and native Android/iOS app via Capacitor.

## Repository Type

**Monorepo** with two independent npm projects:

| Part | Path | Type | Description |
|------|------|------|-------------|
| Frontend | `frontend/` | Mobile/Web App | React 18 + Vite + TypeScript + Tailwind CSS + Capacitor |
| Backend | `backend/` | API Server | NestJS + Firebase Admin SDK |

## Technology Stack

| Category | Technology | Version | Part |
|----------|-----------|---------|------|
| UI Framework | React | 18.2.0 | Frontend |
| Build Tool | Vite | 5.0.8 | Frontend |
| Language | TypeScript | 5.2.2 / 5.1.3 | Both |
| State Management | Zustand | 4.4.1 | Frontend |
| CSS Framework | Tailwind CSS | 3.3.6 | Frontend |
| Mobile Runtime | Capacitor | 5.7.8 | Frontend |
| Backend Framework | NestJS | 10.0.0 | Backend |
| Database/BaaS | Firebase (Firestore) | 12.8.0 / 13.6.0 | Both |
| Caching | localforage (IndexedDB) | 1.10.0 | Frontend |
| Security | Helmet | 8.1.0 | Backend |
| Rate Limiting | @nestjs/throttler | 6.5.0 | Backend |

## Architecture Pattern

- **Frontend**: Component-based SPA with phase-driven game flow and centralized Zustand store
- **Backend**: Modular NestJS service layer with Firebase Firestore as persistence
- **Communication**: Frontend talks directly to Firebase Firestore for word packs and telemetry; backend provides REST telemetry endpoints as secondary path

## Game Flow

```
setup → clue → turn-starter → discussion → voting → results → game-over
                                   ↑                      |
                                   └──── next round ──────┘
```

## Key Features

- **3–12 players** on a single shared device
- **Configurable impostor count** (1 to half of players)
- **Word packs** loaded from Firebase with offline fallback (7-day IndexedDB cache)
- **Swipe-to-reveal** mechanic for secret word display
- **Timer-based** clue and discussion phases (4 minutes each)
- **Telemetry** via Firebase Firestore (visits, game events)
- **App review prompts** via Capacitor plugin
- **Dark theme** UI with mobile-first responsive design

## Deployment

| Component | Platform | URL/ID |
|-----------|----------|--------|
| Frontend (Web) | Vercel | — |
| Backend API | Render | https://impostorgame-1.onrender.com |
| Mobile App | Google Play | com.aaronarias.impostor |

## Existing Documentation

- [README.md](../README.md) — Project overview and setup instructions
- [CLAUDE.md](../CLAUDE.md) — AI assistant guidance
- [BUGS_FASE_PRUEBA.md](../BUGS_FASE_PRUEBA.md) — Testing phase bug log
- [PLAY_STORE_UPLOAD.md](../PLAY_STORE_UPLOAD.md) — Play Store upload guide
- [QUICK_START_UPLOAD.md](../QUICK_START_UPLOAD.md) — Quick upload reference
- [PRIVACY_POLICY.md](../PRIVACY_POLICY.md) — Privacy policy
- [TERMS_OF_SERVICE.md](../TERMS_OF_SERVICE.md) — Terms of service
- [backend/FIREBASE_SETUP.md](../backend/FIREBASE_SETUP.md) — Firebase setup guide
- [backend/MIGRATION_SUMMARY.md](../backend/MIGRATION_SUMMARY.md) — Migration notes
- [backend/FIREBASE_MIGRATION_COMPLETE.md](../backend/FIREBASE_MIGRATION_COMPLETE.md) — Migration completion
