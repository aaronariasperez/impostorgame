# Firebase Configuration for Render

## Problem

When deploying to Render, the backend fails with:

```
Error initializing Firebase: FirebaseAppError: Service account object must contain a string "project_id" property.
```

This happens because Render doesn't have access to local files like `firebase-service-account.json`.

## Solution

Pass the **full Firebase service account JSON** as an environment variable in Render.

## Step-by-Step

### 1. Get Your Firebase Service Account JSON

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Click **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will download

### 2. Copy the JSON Content

Open the downloaded JSON file and copy the **entire content**.

It should look like:
```json
{
  "type": "service_account",
  "project_id": "impostor-16c49",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "...",
  "universe_domain": "googleapis.com"
}
```

### 3. Add to Render Environment Variables

1. Go to [render.com](https://render.com)
2. Select your `impostor-backend` service
3. Go to **Environment**
4. Click **Add Environment Variable**
5. Set:
   - **Key**: `FIREBASE_SERVICE_ACCOUNT`
   - **Value**: Paste the **entire JSON content** (as one line, no line breaks)

### 4. Save and Redeploy

1. Click **Save Changes**
2. Render will auto-redeploy
3. Wait for deployment to complete

## Verification

Once deployed, check the logs:

```
[Nest] 84  - 01/15/2026, 3:58:09 PM     LOG [NestFactory] Starting Nest application...
🎮 Impostor backend running on http://localhost:3000
Loaded 6 word packs from Firebase
```

If you see "Loaded X word packs from Firebase", it's working! ✅

## Local Development vs Production

### Local Development
```
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
```
- Uses local file
- File must exist in `backend/` directory
- File is in `.gitignore` (not committed)

### Production (Render)
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```
- Uses full JSON content
- No file needed
- Passed as environment variable

## Troubleshooting

### Error: "Service account object must contain a string 'project_id' property"

**Cause**: The JSON is invalid or incomplete.

**Solution**:
1. Verify the JSON is valid (use [jsonlint.com](https://jsonlint.com))
2. Make sure it's the **entire** JSON content
3. Make sure there are no line breaks (should be one line)
4. Redeploy

### Error: "Cannot find module 'firebase-admin'"

**Cause**: Dependencies not installed.

**Solution**:
1. Make sure `backend/package-lock.json` exists
2. Redeploy from Render dashboard

### Logs not appearing in Firebase

**Cause**: Firebase not initialized correctly.

**Solution**:
1. Check Render logs for Firebase errors
2. Verify `FIREBASE_PROJECT_ID` is correct
3. Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON
4. Check Firestore collections exist

## Security Notes

- ✅ The JSON is stored securely in Render's environment variables
- ✅ It's not visible in logs or public
- ✅ It's only used by the backend
- ⚠️ Never commit the JSON to GitHub
- ⚠️ Never share the JSON with anyone

## Next Steps

1. ✅ Add `FIREBASE_SERVICE_ACCOUNT` to Render
2. ✅ Redeploy backend
3. ⬜ Verify logs show "Loaded X word packs from Firebase"
4. ⬜ Continue with Vercel deployment

---

**Firebase is now configured for Render! 🚀**
