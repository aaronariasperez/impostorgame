# Impostor — Project Documentation Index

## Project Overview

- **Type:** Monorepo with 2 parts (frontend + backend)
- **Primary Language:** TypeScript
- **Architecture:** Component-based SPA (frontend) + Modular NestJS API (backend)
- **UI Language:** Spanish

## Quick Reference

### Frontend (mobile/web)

- **Type:** Mobile/Web App
- **Tech Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Capacitor
- **State:** Zustand store
- **Root:** `frontend/`
- **Entry Point:** `frontend/src/main.tsx`

### Backend

- **Type:** API Server
- **Tech Stack:** NestJS + Firebase Admin SDK
- **Root:** `backend/`
- **Entry Point:** `backend/src/main.ts`

## Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture — Frontend](./architecture-frontend.md)
- [Architecture — Backend](./architecture-backend.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory — Frontend](./component-inventory-frontend.md)
- [API Contracts — Backend](./api-contracts-backend.md)
- [Integration Architecture](./integration-architecture.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)

## Existing Documentation

- [README.md](../README.md) — Project overview and setup instructions
- [CLAUDE.md](../CLAUDE.md) — AI assistant guidance
- [BUGS_FASE_PRUEBA.md](../BUGS_FASE_PRUEBA.md) — Testing phase bug log (11 bugs fixed)
- [PLAY_STORE_UPLOAD.md](../PLAY_STORE_UPLOAD.md) — Play Store upload guide
- [QUICK_START_UPLOAD.md](../QUICK_START_UPLOAD.md) — Quick upload reference
- [PRIVACY_POLICY.md](../PRIVACY_POLICY.md) — Privacy policy (updated Jan 2026)
- [TERMS_OF_SERVICE.md](../TERMS_OF_SERVICE.md) — Terms of service (updated Jan 2026)
- [backend/FIREBASE_SETUP.md](../backend/FIREBASE_SETUP.md) — Firebase setup guide
- [backend/MIGRATION_SUMMARY.md](../backend/MIGRATION_SUMMARY.md) — Migration notes
- [backend/FIREBASE_MIGRATION_COMPLETE.md](../backend/FIREBASE_MIGRATION_COMPLETE.md) — Migration completion

## Getting Started

1. Install dependencies: `cd frontend && npm install && cd ../backend && npm install`
2. Configure backend: Create `backend/.env` with Firebase credentials
3. Start both servers: `./start-dev.sh`
4. Open `http://localhost:5173` in your browser

For detailed setup instructions, see the [Development Guide](./development-guide.md).
