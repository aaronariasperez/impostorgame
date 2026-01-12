# 🚀 Deployment Guide - Impostor Game

## Overview

This guide will help you deploy the Impostor game to production using:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier with $5 credit)

**Total time**: ~15-20 minutes

---

## Prerequisites

- GitHub account (free)
- Vercel account (free)
- Render account (free)
- Your code pushed to GitHub

---

## Step 1: Push Code to GitHub

Make sure all your code is pushed to GitHub:

```bash
cd /home/linuxcore/Proyectos/impostor
git push origin main
```

Verify your repo has this structure:
```
impostor/
├── backend/
├── frontend/
├── DEPLOYMENT.md
└── ...
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier)
3. Authorize Render to access your GitHub repos

### 2.2 Create Web Service
1. Click **New +** → **Web Service**
2. Select your `impostor` repository
3. Configure:
   - **Name**: `impostor-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`

### 2.3 Add Environment Variables
In the "Environment" section, add:
- **Key**: `NODE_ENV` | **Value**: `production`
- **Key**: `PORT` | **Value**: `3000`
- **Key**: `FRONTEND_URL` | **Value**: `https://impostor.vercel.app` (you'll update this after Vercel deployment)

### 2.4 Deploy
Click **Create Web Service**

Wait for deployment to complete. You'll get a URL like:
```
https://impostor-backend.onrender.com
```

**Note**: Free tier sleeps after 15 minutes of inactivity. First request will be slow.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your GitHub repos

### 3.2 Import Project
1. Click **Add New...** → **Project**
2. Select your `impostor` repository
3. Configure:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 3.3 Deploy
Click **Deploy**

Wait for deployment. You'll get a URL like:
```
https://impostor.vercel.app
```

---

## Step 4: Update Backend FRONTEND_URL

Now that you have your Vercel URL, update the backend environment variable:

1. Go to [render.com](https://render.com)
2. Select your `impostor-backend` service
3. Go to **Environment**
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   https://impostor.vercel.app
   ```
5. Click **Save Changes**

The backend will auto-redeploy.

---

## Step 5: Test the Deployment

1. Open your Vercel URL: `https://impostor.vercel.app`
2. Try to load a game:
   - Select players and impostors
   - Choose a word pack
   - Start the game
3. If word packs load, everything is working! ✅

---

## Troubleshooting

### Word packs not loading
- Check browser DevTools → Network tab
- Look for `/api/word-packs` request
- If it fails, check:
  - Backend is running on Render
  - `FRONTEND_URL` is set correctly in Render
  - `vercel.json` exists in frontend folder

### CORS errors
- Check backend logs in Render dashboard
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Make sure it includes `https://` and no trailing `/`

### Backend sleeping
- Free tier sleeps after 15 min inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid tier if you need instant responses

### Deployment failed
- Check build logs in Vercel/Render dashboard
- Ensure `package.json` scripts are correct
- Verify Node.js version compatibility (18+)

---

## How It Works

```
User Browser
    ↓
https://impostor.vercel.app
    ↓
Vercel (serves frontend)
    ↓
User clicks "Load Word Packs"
    ↓
Browser calls /api/word-packs
    ↓
Vercel rewrites to https://impostor-backend.onrender.com/api/word-packs
    ↓
Render (backend responds)
    ↓
Frontend displays word packs
```

The `vercel.json` file handles the rewrite automatically, so no CORS issues!

---

## Auto-Deployment

Both Vercel and Render watch your GitHub repo:
- Push to `main` branch
- Vercel/Render auto-detect changes
- Auto-build and deploy
- No manual steps needed!

---

## Next Steps

### Monitor Deployments
- **Vercel**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Render**: [render.com/dashboard](https://render.com/dashboard)

### Custom Domain (Optional)
- Vercel: Add domain in Project Settings
- Render: Add domain in Service Settings

### Upgrade to Paid (Optional)
- Vercel: $20/month for Pro
- Render: $7/month for Starter

---

## Environment Variables Reference

### Backend (.env in Render)
```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://impostor.vercel.app
```

### Frontend (vercel.json)
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://impostor-backend.onrender.com/api/$1" }
  ]
}
```

---

## Support

If something goes wrong:
1. Check the build logs in Vercel/Render dashboard
2. Verify environment variables are set correctly
3. Make sure GitHub repo is up to date
4. Try redeploying manually from dashboard

---

**Happy Gaming! 🎭**
