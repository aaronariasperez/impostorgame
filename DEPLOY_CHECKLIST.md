# 🚀 Deployment Checklist

## Pre-Deployment

### Code Ready
- [ ] All changes committed to GitHub
- [ ] `git push origin main` executed
- [ ] No uncommitted changes

### Backend Configuration
- [ ] `backend/.env` exists with Firebase credentials
- [ ] `backend/firebase-service-account.json` exists
- [ ] `backend/.env.example` is up to date
- [ ] `backend/src/main.ts` has CORS configured

### Frontend Configuration
- [ ] `frontend/.env.example` exists
- [ ] `frontend/vercel.json` has correct backend URL
- [ ] `frontend/src/services/telemetryService.ts` uses relative URLs
- [ ] `frontend/src/services/wordPackService.ts` uses relative URLs

### Firebase Setup
- [ ] Firebase project created
- [ ] Firestore database created
- [ ] Service account JSON downloaded
- [ ] Collections exist: `word_packs`, `telemetry_visits`, `telemetry_events`
- [ ] Data migrated: `npm run migrate:firebase`

---

## Deployment Steps

### Step 1: Deploy Backend to Render

- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub
- [ ] Create new Web Service
- [ ] Select `impostor` repository
- [ ] Configure:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm ci && npm run build`
  - [ ] Start Command: `npm run start:prod`
- [ ] Add Environment Variables:
  - [ ] `FIREBASE_PROJECT_ID` = your project ID
  - [ ] `FIREBASE_SERVICE_ACCOUNT` = path to JSON file
  - [ ] `PORT` = `3000`
  - [ ] `FRONTEND_URL` = `https://impostor.vercel.app` (temporary)
  - [ ] `NODE_ENV` = `production`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://impostor-backend.onrender.com`)

**Time**: ~5 minutes

---

### Step 2: Update `vercel.json`

- [ ] Open `frontend/vercel.json`
- [ ] Update the rewrite destination with your backend URL:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://impostor-backend.onrender.com/api/$1" }
    ]
  }
  ```
- [ ] Commit and push to GitHub:
  ```bash
  git add frontend/vercel.json
  git commit -m "update: backend URL in vercel.json"
  git push origin main
  ```

**Time**: ~2 minutes

---

### Step 3: Deploy Frontend to Vercel

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Click "Add New..." → "Project"
- [ ] Select `impostor` repository
- [ ] Configure:
  - [ ] Framework Preset: Vite (auto-detected)
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build` (auto-detected)
  - [ ] Output Directory: `dist` (auto-detected)
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL (e.g., `https://impostor.vercel.app`)

**Time**: ~5 minutes

---

### Step 4: Update Backend FRONTEND_URL

- [ ] Go to [render.com](https://render.com)
- [ ] Select your `impostor-backend` service
- [ ] Go to "Environment"
- [ ] Update `FRONTEND_URL` to your Vercel URL:
  ```
  https://impostor.vercel.app
  ```
- [ ] Click "Save Changes"
- [ ] Wait for auto-redeploy

**Time**: ~2 minutes

---

## Post-Deployment Testing

### Test Frontend
- [ ] Open `https://impostor.vercel.app` in browser
- [ ] Page loads without errors
- [ ] No console errors (F12)

### Test Word Packs
- [ ] Click "Start Game"
- [ ] Word packs load successfully
- [ ] Can select a word pack
- [ ] Game starts without errors

### Test Telemetry
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Play a game
- [ ] See `/api/telemetry/visit` request (should succeed)
- [ ] See `/api/telemetry/event` requests (should succeed)

### Test Firebase
- [ ] Open Firebase Console
- [ ] Go to Firestore Database
- [ ] Check `telemetry_visits` collection (should have new documents)
- [ ] Check `telemetry_events` collection (should have new documents)

---

## Troubleshooting

### Word packs not loading
```
1. Check browser DevTools → Network tab
2. Look for /api/word-packs request
3. If it fails:
   - Verify backend is running on Render
   - Check vercel.json has correct backend URL
   - Check backend logs in Render dashboard
```

### CORS errors
```
1. Verify FRONTEND_URL in Render matches your Vercel domain exactly
2. Make sure it includes https:// and no trailing /
3. Check backend logs for CORS errors
4. Redeploy backend after updating FRONTEND_URL
```

### Telemetry not saving
```
1. Check browser DevTools → Network tab
2. Look for /api/telemetry/* requests
3. If they fail, check CORS configuration
4. Verify Firestore has telemetry_visits and telemetry_events collections
```

### Backend sleeping (Free Tier)
```
Free tier on Render sleeps after 15 minutes of inactivity.
First request after sleep takes 30-60 seconds.
Upgrade to paid tier for instant responses.
```

---

## Custom Domain (Optional)

### Add Custom Domain to Frontend

- [ ] Go to Vercel Project Settings
- [ ] Go to "Domains"
- [ ] Add your domain (e.g., `impostor.com`)
- [ ] Follow DNS instructions
- [ ] Update `vercel.json` if needed (usually not)

### Add Custom Domain to Backend

- [ ] Go to Render Service Settings
- [ ] Go to "Custom Domain"
- [ ] Add your domain (e.g., `api.impostor.com`)
- [ ] Follow DNS instructions
- [ ] Update `vercel.json` with new backend URL:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://api.impostor.com/api/$1" }
    ]
  }
  ```
- [ ] Update `FRONTEND_URL` in Render environment variables
- [ ] Commit and push to GitHub

---

## Auto-Deployment

After initial deployment, everything is automatic:

```bash
git push origin main
# Vercel and Render auto-detect changes
# Auto-build and deploy
# No manual steps needed!
```

---

## Monitoring

### Vercel Dashboard
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Monitor deployments
- [ ] Check analytics
- [ ] View logs

### Render Dashboard
- [ ] Go to [render.com/dashboard](https://render.com/dashboard)
- [ ] Monitor deployments
- [ ] Check logs
- [ ] Monitor resource usage

### Firebase Console
- [ ] Go to [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Monitor Firestore usage
- [ ] Check telemetry data
- [ ] Monitor costs

---

## Summary

| Step | Service | Time | Status |
|------|---------|------|--------|
| 1 | Deploy Backend (Render) | 5 min | ⬜ |
| 2 | Update vercel.json | 2 min | ⬜ |
| 3 | Deploy Frontend (Vercel) | 5 min | ⬜ |
| 4 | Update FRONTEND_URL | 2 min | ⬜ |
| 5 | Test Everything | 5 min | ⬜ |

**Total Time**: ~20 minutes

---

## Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [DEPLOYMENT_QUICK.md](./DEPLOYMENT_QUICK.md) - Quick reference
- [PRODUCTION_URLS.md](./PRODUCTION_URLS.md) - URL configuration guide
- [backend/FIREBASE_SETUP.md](./backend/FIREBASE_SETUP.md) - Firebase setup
- [backend/FIREBASE_MIGRATION_COMPLETE.md](./backend/FIREBASE_MIGRATION_COMPLETE.md) - Firebase migration

---

**You're ready to deploy! 🚀**
