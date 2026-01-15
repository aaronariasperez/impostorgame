# Vercel Frontend Setup Guide

## Step-by-Step Instructions

### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Vercel to access your GitHub repos

### 2. Import Project

1. Click **Add New...** button
2. Select **Project**
3. Select your `impostor` repository
4. Click **Import**

### 3. Configure Project

Vercel should auto-detect most settings. Verify:

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

### 4. Environment Variables

You don't need to add any environment variables for the frontend.

The `vercel.json` file handles API rewrites automatically.

### 5. Deploy

1. Click **Deploy**
2. Wait for deployment to complete (usually 1-2 minutes)
3. You'll see a URL like: `https://impostor.vercel.app`
4. Copy this URL - you'll need it for Render configuration

### 6. Verify Deployment

Once deployed:

1. Open `https://impostor.vercel.app` in browser
2. Page should load without errors
3. Open DevTools (F12) → Console
4. Should see no errors

## Important: Update Backend URL

Before the frontend can work, you need to update the backend URL in `vercel.json`:

1. Open `frontend/vercel.json`
2. Update the rewrite destination:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://impostor-backend.onrender.com/api/$1" }
     ]
   }
   ```
3. Replace `impostor-backend.onrender.com` with your actual Render backend URL
4. Commit and push:
   ```bash
   git add frontend/vercel.json
   git commit -m "update: backend URL in vercel.json"
   git push origin main
   ```
5. Vercel will auto-redeploy

## Troubleshooting

### Build Failed: "Cannot find module 'react'"

**Solution**: Make sure `frontend/package-lock.json` exists in your GitHub repo.

```bash
cd frontend
npm install --package-lock-only
git add package-lock.json
git commit -m "add package-lock.json"
git push origin main
```

Then redeploy from Vercel dashboard.

### Word Packs Not Loading

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Look for `/api/word-packs` request
4. If it fails:
   - Check that `vercel.json` has correct backend URL
   - Verify backend is running on Render
   - Check backend logs in Render dashboard

### CORS Errors

If you see CORS errors in browser console:

1. Verify `vercel.json` has correct backend URL
2. Verify `FRONTEND_URL` in Render matches your Vercel domain exactly
3. Make sure it includes `https://` and no trailing `/`
4. Redeploy backend from Render dashboard

### Telemetry Not Saving

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Look for `/api/telemetry/*` requests
4. If they fail:
   - Check CORS configuration
   - Verify backend is running
   - Check backend logs

## Auto-Deployment

After initial setup, Vercel automatically:

1. Watches your GitHub repo
2. Detects changes on `main` branch
3. Rebuilds and redeploys automatically
4. No manual steps needed!

Just push to GitHub:
```bash
git push origin main
```

## Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel Project Settings
2. Go to **Domains**
3. Add your domain (e.g., `impostor.com`)
4. Follow DNS instructions
5. Update `vercel.json` if needed (usually not)

## Environment Variables

The frontend doesn't need environment variables for production.

The `vercel.json` file handles all API routing automatically.

If you need to override the API URL for some reason:

1. Go to Vercel Project Settings
2. Go to **Environment Variables**
3. Add `VITE_API_URL` with your backend URL
4. Redeploy

But this is usually not needed - `vercel.json` handles it.

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ⬜ Copy frontend URL
3. ⬜ Update `FRONTEND_URL` in Render
4. ⬜ Test everything

See `DEPLOY_CHECKLIST.md` for complete deployment guide.

## Support

If something goes wrong:

1. Check Vercel logs in dashboard
2. Verify `vercel.json` has correct backend URL
3. Make sure GitHub repo is up to date
4. Try redeploying manually from dashboard

---

**Frontend is ready to deploy! 🚀**
