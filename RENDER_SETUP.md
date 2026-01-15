# Render Backend Setup Guide

## Step-by-Step Instructions

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Render to access your GitHub repos

### 2. Create Web Service

1. Click **New +** button
2. Select **Web Service**
3. Select your `impostor` repository
4. Click **Connect**

### 3. Configure Web Service

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `impostor-backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm ci && npm run build` |
| **Start Command** | `npm run start:prod` |

### 4. Add Environment Variables

Click **Add Environment Variable** for each:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `3000` | Required |
| `FIREBASE_PROJECT_ID` | `impostor-16c49` | Your Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT` | `{"type":"service_account",...}` | **Full JSON content** (see below) |
| `FRONTEND_URL` | `https://impostor.vercel.app` | Update after Vercel deployment |

### Important: FIREBASE_SERVICE_ACCOUNT Format

In Render, you **must** use the full JSON content, not a file path.

1. Open your `firebase-service-account.json` file locally
2. Copy the **entire JSON content**
3. In Render, paste it as the value for `FIREBASE_SERVICE_ACCOUNT`

Example:
```json
{"type":"service_account","project_id":"impostor-16c49","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

**Note**: Make sure the entire JSON is on one line (no line breaks)

### 5. Deploy

1. Click **Create Web Service**
2. Wait for deployment to complete (usually 2-3 minutes)
3. You'll see a URL like: `https://impostor-backend.onrender.com`
4. Copy this URL - you'll need it for Vercel configuration

### 6. Verify Deployment

Once deployed, test the backend:

```bash
# Test word packs endpoint
curl https://impostor-backend.onrender.com/api/word-packs

# Should return JSON array of word packs
```

If you get a response, the backend is working! ✅

## Troubleshooting

### Build Failed: "npm ci command can only install with existing package-lock.json"

**Solution**: Make sure `backend/package-lock.json` exists in your GitHub repo.

```bash
cd backend
npm install --package-lock-only
git add package-lock.json
git commit -m "add package-lock.json"
git push origin main
```

Then redeploy from Render dashboard.

### Build Failed: "Cannot find module 'firebase-admin'"

**Solution**: Make sure `backend/package.json` has `firebase-admin` in dependencies.

Check with:
```bash
grep firebase-admin backend/package.json
```

Should show:
```json
"firebase-admin": "^12.0.0"
```

### Backend Sleeping

Free tier on Render sleeps after 15 minutes of inactivity.

First request after sleep takes 30-60 seconds.

**Solution**: Upgrade to paid tier for instant responses ($7/month).

### CORS Errors

If you see CORS errors in browser console:

1. Go to Render dashboard
2. Select `impostor-backend` service
3. Go to **Environment**
4. Update `FRONTEND_URL` to match your Vercel domain exactly
5. Click **Save Changes**
6. Wait for auto-redeploy

### Logs Not Saving to Firebase

1. Verify `FIREBASE_PROJECT_ID` is correct
2. Verify `FIREBASE_SERVICE_ACCOUNT` path is correct
3. Check Render logs for Firebase errors
4. Verify Firestore collections exist: `telemetry_visits`, `telemetry_events`

## Auto-Deployment

After initial setup, Render automatically:

1. Watches your GitHub repo
2. Detects changes on `main` branch
3. Rebuilds and redeploys automatically
4. No manual steps needed!

Just push to GitHub:
```bash
git push origin main
```

## Environment Variables Reference

### Required
- `NODE_ENV=production` - Environment mode
- `PORT=3000` - Port to run on
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT` - Path to service account JSON

### Optional
- `FRONTEND_URL` - Frontend URL for CORS (update after Vercel deployment)

## Next Steps

1. ✅ Deploy backend to Render
2. ⬜ Copy backend URL
3. ⬜ Update `frontend/vercel.json` with backend URL
4. ⬜ Deploy frontend to Vercel
5. ⬜ Update `FRONTEND_URL` in Render

See `DEPLOY_CHECKLIST.md` for complete deployment guide.

## Support

If something goes wrong:

1. Check Render logs in dashboard
2. Verify environment variables are set correctly
3. Make sure GitHub repo is up to date
4. Try redeploying manually from dashboard

---

**Backend is ready to deploy! 🚀**
