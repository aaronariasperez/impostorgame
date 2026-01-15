# Troubleshooting Deployment Issues

## Error: "Failed to fetch word packs"

This error means the frontend cannot connect to the backend API.

### Step 1: Check Backend Status

1. Go to [render.com](https://render.com)
2. Select your `impostor-backend` service
3. Check the **Logs** tab

Look for one of these messages:

#### ✅ Success
```
🎮 Impostor backend running on http://localhost:3000
Loaded 6 word packs from Firebase
```

#### ❌ Firebase Error
```
Error initializing Firebase: FirebaseAppError: Service account object must contain a string "project_id" property.
```

**Solution**: See [FIREBASE_RENDER_CONFIG.md](./FIREBASE_RENDER_CONFIG.md)

#### ❌ Build Error
```
sh: 1: nest: not found
```

**Solution**: Already fixed - redeploy from Render dashboard

### Step 2: Verify Backend URL

1. Test the backend directly:
   ```bash
   curl https://impostor-backend.onrender.com/api/word-packs
   ```

2. You should get a JSON response like:
   ```json
   [
     {
       "id": "animales",
       "name": "Animales",
       "description": "Palabras relacionadas con animales"
     },
     ...
   ]
   ```

3. If you get an error, the backend is not running correctly

### Step 3: Check Vercel Configuration

1. Go to [vercel.com](https://vercel.com)
2. Select your `impostor` project
3. Go to **Settings** → **Environment Variables**
4. Verify no environment variables are needed (frontend doesn't need any)

### Step 4: Check vercel.json

1. Open `frontend/vercel.json`
2. Verify it has the correct backend URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://impostor-backend.onrender.com/api/$1" }
     ]
   }
   ```

3. If the URL is wrong, update it and push to GitHub:
   ```bash
   git add frontend/vercel.json
   git commit -m "fix: update backend URL in vercel.json"
   git push origin main
   ```

### Step 5: Check CORS Configuration

1. Go to Render dashboard
2. Select `impostor-backend`
3. Go to **Environment**
4. Verify `FRONTEND_URL` is set to your Vercel URL:
   ```
   https://impostorgame-xiklana.vercel.app
   ```

5. If it's wrong, update it and save (auto-redeploy)

### Step 6: Check Browser Console

1. Open your Vercel URL in browser
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Look for error messages

Common errors:

#### CORS Error
```
Access to XMLHttpRequest at 'https://impostor-backend.onrender.com/api/word-packs' 
from origin 'https://impostorgame-xiklana.vercel.app' has been blocked by CORS policy
```

**Solution**: 
- Verify `FRONTEND_URL` in Render matches your Vercel domain exactly
- Make sure it includes `https://` and no trailing `/`
- Redeploy backend

#### 404 Error
```
GET https://impostorgame-xiklana.vercel.app/api/word-packs 404
```

**Solution**:
- Verify `vercel.json` has correct backend URL
- Redeploy frontend

#### 500 Error
```
GET https://impostor-backend.onrender.com/api/word-packs 500
```

**Solution**:
- Check backend logs in Render
- Verify Firebase is configured correctly
- Redeploy backend

### Step 7: Redeploy Everything

If nothing works, try redeploying:

**Backend (Render)**:
1. Go to Render dashboard
2. Select `impostor-backend`
3. Click **Manual Deploy** or **Redeploy**
4. Wait for deployment to complete
5. Check logs

**Frontend (Vercel)**:
1. Go to Vercel dashboard
2. Select your project
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 8: Check Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database**
4. Verify collections exist:
   - `word_packs` (should have 6 documents)
   - `telemetry_visits`
   - `telemetry_events`

5. If `word_packs` is empty, run migration:
   ```bash
   cd backend
   npm run migrate:firebase
   ```

## Complete Checklist

- [ ] Backend is running on Render
- [ ] Backend logs show "Loaded X word packs from Firebase"
- [ ] `curl https://impostor-backend.onrender.com/api/word-packs` returns JSON
- [ ] `vercel.json` has correct backend URL
- [ ] `FRONTEND_URL` in Render matches Vercel domain exactly
- [ ] Firestore has `word_packs` collection with data
- [ ] Frontend loads without console errors
- [ ] Frontend can fetch word packs

## Quick Fix Checklist

If you're stuck, try these in order:

1. **Redeploy backend**: Render dashboard → Manual Deploy
2. **Redeploy frontend**: Vercel dashboard → Redeploy
3. **Check backend logs**: Look for Firebase errors
4. **Update FRONTEND_URL**: Make sure it matches exactly
5. **Check vercel.json**: Make sure backend URL is correct
6. **Run migration**: `npm run migrate:firebase` in backend
7. **Check Firestore**: Verify data exists

## Still Stuck?

Check these files for more info:

- [FIREBASE_RENDER_CONFIG.md](./FIREBASE_RENDER_CONFIG.md) - Firebase setup
- [RENDER_SETUP.md](./RENDER_SETUP.md) - Render configuration
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel configuration
- [PRODUCTION_URLS.md](./PRODUCTION_URLS.md) - URL configuration

---

**Need help? Check the logs first! 🔍**
