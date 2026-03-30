---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success]
classification:
  projectType: mobile_app + web_app
  domain: gaming/general
  complexity: low
  projectContext: brownfield
inputDocuments:
  - docs/index.md
  - docs/project-overview.md
  - docs/architecture-frontend.md
  - docs/architecture-backend.md
  - docs/source-tree-analysis.md
  - docs/component-inventory-frontend.md
  - docs/api-contracts-backend.md
  - docs/integration-architecture.md
  - docs/development-guide.md
  - docs/deployment-guide.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 10
workflowType: 'prd'
projectType: 'brownfield'
---

# Product Requirements Document - Impostor

**Author:** Linuxcore
**Date:** 2026-03-30

## Executive Summary

Impostor is a local pass-and-play social deduction party game available as a mobile app (Android/iOS via Capacitor) and web app. Players share a single device, taking turns to secretly view their assigned word and provide clues. Civilians attempt to identify the impostor; the impostor tries to blend in or guess the civilian word.

The app has achieved organic international growth without any marketing — users discover it through Play Store search, validating strong product-market fit in the social deduction category. The current phase focuses on infrastructure professionalization: migrating from Firebase to a self-hosted VPS with SQLite, centralizing all communication through a proper backend, and building an admin dashboard for telemetry observability. The product philosophy remains free with no ads, supported by voluntary donations (Buy Me a Coffee).

This PRD covers two distinct products:
1. **Impostor App (v2)** — Evolution of the existing game: backend consolidation, Firebase removal, improved telemetry instrumentation, input validation, and API security.
2. **Impostor Admin Dashboard** — New internal-only web tool for the developer to monitor usage, analyze player behavior, and manage word pack content.

### What Makes This Special

Zero friction, zero cost. Impostor removes every barrier to playing social deduction games: no physical materials needed, no word creation effort, no ads, no paywalls. Competing apps in this space are either paid or ad-supported — Impostor is the only free, clean alternative with a growing word pack library. The organic international traction without any promotion confirms that users actively seek this and the product delivers.

The strategic differentiator going forward is data-driven evolution: rather than adding features speculatively, the team will instrument, observe, and then decide — letting real usage patterns guide product development.

## Project Classification

- **Project Type:** Mobile app (primary) + Web app (admin dashboard)
- **Domain:** Social/casual gaming
- **Complexity:** Low — no regulatory requirements, no payments, no sensitive data
- **Project Context:** Brownfield — production app with active users, evolving infrastructure and adding admin tooling

## Success Criteria

### User Success

- A user "succeeds" when they play at least one game session, regardless of whether the game reaches the `game-over` phase or the user exits early via the exit button.
- The "magic moment" is the social interaction around impostor discovery — this happens whether the game flow completes formally or not.
- Success indicator: a user who returns to play again (repeat sessions).

### Business Success

- **Daily active players:** Baseline is 3-4 distinct players/day (as of 2026-03-30). Target: sustained growth trajectory month-over-month.
- **Daily game sessions:** Track total sessions started per day. Current estimate: ~10-15 sessions/day. Target: consistent upward trend.
- **Retention:** Users who play on more than one distinct day within a 7-day window.
- **Geographic spread:** Continue organic international reach — track country diversity without marketing spend.
- **Donations:** Not a primary metric, but track Buy Me a Coffee conversions as a signal of user satisfaction.

### Technical Success

- **VPS self-hosted backend** fully replaces Firebase as the single communication path (App → Backend → SQLite).
- **Zero Firebase dependency** — complete removal of Firebase JS SDK from frontend and Firebase Admin SDK from backend.
- **API response latency** under 200ms for word pack delivery and telemetry ingestion.
- **Infrastructure prepared for scaling** — architecture that allows adding capacity without re-architecture (e.g., reverse proxy, process manager).
- **Admin dashboard operational** — able to answer "how many people played today?" on day one.

### Measurable Outcomes

| Metric | Current State | 3-Month Target | Method |
|--------|--------------|----------------|--------|
| Daily active players | ~3-4 | Sustained growth trend | Dashboard telemetry |
| Game sessions/day | ~10-15 (est.) | Tracked with precision | Instrumented events |
| Session completion rate | Unknown | Measured and visible | game_start vs game_end vs exit events |
| API latency (p95) | N/A (Firebase) | < 200ms | Server-side monitoring |
| Firebase dependencies | 2 SDKs | 0 | Code audit |
| Dashboard questions answerable | 0 | 10+ | Dashboard feature count |

## Product Scope

### MVP - Minimum Viable Product

1. **VPS deployment** with NestJS backend serving all data (word packs + telemetry)
2. **SQLite database** replacing Firebase Firestore for all persistence
3. **Backend API consolidation** — frontend communicates exclusively through backend REST API
4. **Firebase removal** — complete elimination of Firebase JS SDK from frontend
5. **Input validation** (DTOs + class-validator) on all backend endpoints
6. **API key authentication** — lightweight mechanism so only the Impostor app can call the backend
7. **Improved telemetry events** — instrument: game_start, game_end, game_exit (early abandonment), session duration, word pack selection, player count, round reached
8. **Admin dashboard (basic)** — single-page web app showing: daily active players, sessions today, session completion rate, top word packs

### Growth Features (Post-MVP)

- **Rich dashboard analytics:** geographic distribution, retention cohorts, session duration histograms, player count distribution, trend charts
- **Word pack CRUD in dashboard** — add/edit/delete packs without code deployment
- **Structured error logging** — capture and display frontend/backend errors in dashboard
- **Internationalization (i18n)** — English UI option to expand market
- **More word packs** — expand content library based on usage data

### Vision (Future)

- **Real-time dashboard** with live session indicators
- **A/B testing capability** for UX experiments driven by telemetry
- **User feedback mechanism** in-app (lightweight, non-intrusive)
- **New game modes** informed by player behavior data
- **Community word pack submissions**
