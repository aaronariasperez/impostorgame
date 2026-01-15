# Production URLs Configuration

## Overview

Este documento explica cómo configurar URLs para que tu aplicación funcione correctamente en producción con dominios legibles.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  https://impostor.vercel.app   │
        │  (Frontend - Vercel)           │
        └────────────────┬───────────────┘
                         │
                         │ /api/* requests
                         │ (rewritten by Vercel)
                         ▼
        ┌────────────────────────────────────────┐
        │ https://impostor-backend.onrender.com  │
        │ (Backend - Render)                     │
        └────────────────────────────────────────┘
```

## How It Works

### Frontend (Vercel)
- Sirve la aplicación React en `https://impostor.vercel.app`
- Todas las llamadas a `/api/*` se reescriben automáticamente al backend
- Esto se configura en `frontend/vercel.json`

### Backend (Render)
- Corre en `https://impostor-backend.onrender.com`
- Recibe las llamadas reescritas desde Vercel
- Responde con datos de Firestore

### Telemetry & Word Packs
- Ambos usan URLs relativas `/api/*`
- Vercel las reescribe automáticamente al backend
- No hay problemas de CORS

## Configuration Files

### 1. `frontend/vercel.json`
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://impostor-backend.onrender.com/api/$1" }
  ]
}
```

**Qué hace**: Reescribe todas las llamadas a `/api/*` al backend en Render.

**Cuándo actualizar**: Cuando cambies la URL del backend (ej: dominio personalizado).

### 2. `backend/.env` (en Render)
```
FIREBASE_PROJECT_ID=impostor-16c49
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
PORT=3000
FRONTEND_URL=https://impostor.vercel.app
NODE_ENV=production
```

**Qué hace**: Configura CORS para permitir solicitudes desde Vercel.

**Cuándo actualizar**: Cuando cambies la URL del frontend (ej: dominio personalizado).

### 3. `frontend/src/services/telemetryService.ts`
```typescript
fetch('/api/telemetry/visit', { ... })
fetch('/api/telemetry/event', { ... })
```

**Qué hace**: Usa URLs relativas que se reescriben automáticamente.

**Cuándo actualizar**: Nunca (a menos que cambies la estructura de rutas).

### 4. `frontend/src/services/wordPackService.ts`
```typescript
const API_URL = '/api/word-packs';
```

**Qué hace**: Usa URLs relativas que se reescriben automáticamente.

**Cuándo actualizar**: Nunca (a menos que cambies la estructura de rutas).

## Deployment Steps

### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Select your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`
5. Add Environment Variables:
   ```
   FIREBASE_PROJECT_ID=impostor-16c49
   FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
   PORT=3000
   FRONTEND_URL=https://impostor.vercel.app
   NODE_ENV=production
   ```
6. Deploy

**Result**: Backend URL like `https://impostor-backend.onrender.com`

### Step 2: Update `vercel.json`

Update the rewrite destination with your backend URL:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://impostor-backend.onrender.com/api/$1" }
  ]
}
```

Push to GitHub.

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy

**Result**: Frontend URL like `https://impostor.vercel.app`

### Step 4: Update Backend FRONTEND_URL

Go back to Render and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://impostor.vercel.app
```

Save. Backend will auto-redeploy.

## Custom Domains

### Add Custom Domain to Frontend (Vercel)

1. Go to Vercel Project Settings
2. Go to **Domains**
3. Add your domain (e.g., `impostor.com`)
4. Follow DNS instructions
5. Update `vercel.json` if needed (usually not)

### Add Custom Domain to Backend (Render)

1. Go to Render Service Settings
2. Go to **Custom Domain**
3. Add your domain (e.g., `api.impostor.com`)
4. Follow DNS instructions
5. Update `vercel.json` with new backend URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://api.impostor.com/api/$1" }
     ]
   }
   ```
6. Update `FRONTEND_URL` in Render environment variables

## Environment Variables Reference

### Backend (Render)
| Variable | Value | Notes |
|----------|-------|-------|
| `FIREBASE_PROJECT_ID` | `impostor-16c49` | Your Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT` | `./firebase-service-account.json` | Path to service account file |
| `PORT` | `3000` | Port to run on |
| `FRONTEND_URL` | `https://impostor.vercel.app` | Frontend URL for CORS |
| `NODE_ENV` | `production` | Environment |

### Frontend (Vercel)
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | (optional) | Override API URL (usually not needed) |

## Troubleshooting

### Word packs not loading
- Check browser DevTools → Network tab
- Look for `/api/word-packs` request
- If it fails:
  - Verify backend is running on Render
  - Check `vercel.json` has correct backend URL
  - Check backend logs in Render dashboard

### CORS errors
- Verify `FRONTEND_URL` in Render matches your Vercel domain exactly
- Make sure it includes `https://` and no trailing `/`
- Check backend logs for CORS errors

### Telemetry not saving
- Check browser DevTools → Network tab
- Look for `/api/telemetry/*` requests
- If they fail, check CORS configuration
- Verify Firestore has `telemetry_visits` and `telemetry_events` collections

### Backend sleeping (Free Tier)
- Free tier on Render sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid tier for instant responses

## Local Development

For local development, URLs work automatically:

```bash
# Terminal 1
cd backend
npm run start:dev
# Runs on http://localhost:3000

# Terminal 2
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Frontend automatically uses `http://localhost:3000` for API calls (no rewrite needed).

## Auto-Deployment

Both Vercel and Render watch your GitHub repo:

```bash
git push origin main
# Vercel and Render auto-detect changes
# Auto-build and deploy
# No manual steps needed!
```

## Summary

| Environment | Frontend | Backend | API Calls |
|-------------|----------|---------|-----------|
| **Local** | `http://localhost:5173` | `http://localhost:3000` | Direct to localhost:3000 |
| **Production** | `https://impostor.vercel.app` | `https://impostor-backend.onrender.com` | Rewritten by Vercel |
| **Custom Domain** | `https://impostor.com` | `https://api.impostor.com` | Rewritten by Vercel |

Everything is configured and ready to deploy! 🚀
