# ⚡ Quick Deployment Checklist

## ✅ What's Ready

Your code is configured and ready to deploy:
- ✅ `frontend/vercel.json` - Rewrites `/api` to backend
- ✅ `frontend/src/services/telemetryService.ts` - Uses relative URLs
- ✅ `frontend/src/services/wordPackService.ts` - Uses relative URLs
- ✅ `backend/src/main.ts` - CORS configured for production
- ✅ `backend/.env.example` - Environment variables documented
- ✅ `frontend/.env.example` - Frontend env variables documented
- ✅ All code pushed to GitHub

---

## 🚀 5-Minute Deployment

### Step 1: Deploy Backend (5 min)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New Web Service**
4. Select `impostor` repo
5. Set **Root Directory** to `backend`
6. Click **Create Web Service**
7. Copy the URL (e.g., `https://impostor-backend.onrender.com`)

### Step 2: Deploy Frontend (5 min)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New Project**
4. Select `impostor` repo
5. Set **Root Directory** to `frontend`
6. Click **Deploy**
7. Copy the URL (e.g., `https://impostor.vercel.app`)

### Step 3: Update Backend URL (1 min)
1. Go back to Render dashboard
2. Select `impostor-backend` service
3. Go to **Environment**
4. Update `FRONTEND_URL` to your Vercel URL
5. Save

---

## 🎉 Done!

Your app is live at: **https://impostor.vercel.app**

---

## 📊 What You Get

| Service | URL | Cost | Features |
|---------|-----|------|----------|
| **Vercel** (Frontend) | `impostor.vercel.app` | Free | Auto-deploy, CDN, fast |
| **Render** (Backend) | `impostor-backend.onrender.com` | Free | Auto-deploy, $5 credit |

---

## 🔄 Auto-Deploy

Push to GitHub → Auto-deploy to both services (no manual steps!)

```bash
git push origin main
# Vercel and Render auto-detect and deploy
```

---

## 📖 Full Guide

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**That's it! Your game is live! 🎭**
