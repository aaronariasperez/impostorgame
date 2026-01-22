# Security Testing Guide

## Manual Testing Checklist

### 1. Backend - Rate Limiting

**Test**: Verify rate limiting is working
```bash
# Run 35 requests in quick succession (should hit limit after 30)
for i in {1..35}; do
  curl -X GET http://localhost:3000/api/word-packs
  echo "Request $i"
done
```

**Expected**: After 30 requests, you should see 429 (Too Many Requests) responses.

---

### 2. Backend - New Selection Endpoint

**Test**: Verify POST /selection works correctly
```bash
curl -X POST http://localhost:3000/api/word-packs/selection \
  -H "Content-Type: application/json" \
  -d '{"ids": ["animales"]}'
```

**Expected Response**:
```json
{
  "civilianWord": "Gato",
  "impostorHint": "Felino"
}
```

**Test**: Verify invalid request is rejected
```bash
curl -X POST http://localhost:3000/api/word-packs/selection \
  -H "Content-Type: application/json" \
  -d '{"ids": []}'
```

**Expected**: 400 Bad Request with error message.

---

### 3. Backend - Metadata-Only Endpoints

**Test**: Verify GET /api/word-packs returns only metadata
```bash
curl http://localhost:3000/api/word-packs | jq '.[0]'
```

**Expected**: Response should have `id`, `name`, `description`, `language` but NO `words` or `wordItems`.

```json
{
  "id": "animales",
  "name": "Animales",
  "description": "Palabras relacionadas con animales",
  "language": "es"
}
```

---

### 4. Frontend - Offline Caching

**Test**: Verify offline functionality
1. Start the app and load word packs (should cache them)
2. Open DevTools → Application → IndexedDB → localforage
3. Verify `impostor_word_packs` and `impostor_packs_timestamp` are stored
4. Disconnect network (DevTools → Network → Offline)
5. Refresh the page
6. Verify word packs still load from cache
7. Try to start a game - should work offline

**Expected**: App works without network after initial load.

---

### 5. Frontend - Game Initialization

**Test**: Verify new game flow works
1. Load the app
2. Select player count and impostor count
3. Select word packs
4. Click "Comenzar Juego"
5. Verify game starts with correct civilian word and impostor hint

**Expected**: Game initializes without errors, players have correct words.

---

### 6. Security Headers

**Test**: Verify helmet headers are present
```bash
curl -I http://localhost:3000/api/word-packs
```

**Expected**: Response headers should include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=...`

---

### 7. CORS Configuration

**Test**: Verify CORS works for allowed origins
```bash
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:3000/api/word-packs -v
```

**Expected**: Response should include `Access-Control-Allow-Origin: http://localhost:5173`.

---

## Automated Testing (Optional)

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## Performance Testing

### Test: Cache Hit Performance
1. Load app (first time - network request)
2. Measure time to load word packs
3. Refresh page (should use cache)
4. Measure time again - should be significantly faster

**Expected**: Cache hits should be <100ms vs network ~500-2000ms.

---

## Security Audit Checklist

- [ ] No `words` or `wordItems` exposed in public endpoints
- [ ] Rate limiting active (30 req/min)
- [ ] Helmet security headers present
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Offline caching works
- [ ] No personal data in telemetry
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enforced in production
- [ ] Firebase credentials not exposed in frontend

---

## Deployment Verification

Before deploying to Play Store:

1. **Backend (Render)**
   - [ ] Deploy latest code
   - [ ] Verify rate limiting works
   - [ ] Check logs for errors
   - [ ] Test selection endpoint from mobile

2. **Frontend (Vercel)**
   - [ ] Deploy latest code
   - [ ] Test offline caching
   - [ ] Verify game flow works
   - [ ] Check console for errors

3. **Play Store**
   - [ ] Update Privacy Policy
   - [ ] Fill Data Safety form
   - [ ] Test on real device
   - [ ] Verify offline functionality

---

## Troubleshooting

### Issue: Rate limiting too strict
**Solution**: Adjust `limit` in `app.module.ts` ThrottlerModule config.

### Issue: Offline cache not working
**Solution**: Check browser console for IndexedDB errors. Verify localforage is installed.

### Issue: Selection endpoint returns 404
**Solution**: Verify word packs are loaded in Firebase. Check backend logs.

### Issue: CORS errors
**Solution**: Add origin to `allowedOrigins` in `main.ts`.
