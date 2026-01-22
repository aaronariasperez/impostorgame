# Security Improvements for Play Store Release

## Overview
This document outlines the security improvements made to prepare the Impostor app for Play Store release.

## 1. Backend Security Enhancements

### 1.1 Data Exposure Prevention (CRITICAL)
**Problem**: Frontend could download all words and hints in a single API call, allowing attackers to steal the complete dataset.

**Solution**: 
- Removed endpoints that expose `words` and `wordItems` arrays
- Created new `POST /api/word-packs/selection` endpoint that returns only:
  - `civilianWord`: The randomly selected word for this game
  - `impostorHint`: A randomly selected hint for the impostor
- Public endpoints now return only metadata (id, name, description, language)

**Impact**: Attackers can no longer download the complete word pack dataset in a single request.

### 1.2 Race Condition Fix
**Problem**: `loadWordPacksFromFirebase()` was called without `await` in the constructor, potentially causing empty responses if requests arrived before data loaded.

**Solution**:
- Implemented `OnModuleInit` lifecycle hook
- Added `ensureLoaded()` method that guarantees data is loaded before any response
- Used promise-based loading to prevent multiple concurrent loads

**Impact**: Guaranteed consistent, non-empty responses.

### 1.3 Rate Limiting
**Problem**: Without rate limiting, attackers could "farm" many game selections to reconstruct the dataset.

**Solution**:
- Installed `@nestjs/throttler`
- Configured global rate limit: 30 requests per 60 seconds per IP
- Applied `@UseGuards(ThrottlerGuard)` to word-packs controller

**Impact**: Significantly increases the cost of automated scraping attacks.

### 1.4 Security Headers
**Problem**: Missing security headers expose the app to various web-based attacks.

**Solution**:
- Installed `helmet`
- Applied helmet middleware globally in `main.ts`

**Impact**: Protects against XSS, clickjacking, MIME-type sniffing, and other header-based attacks.

### 1.5 Input Validation
**Problem**: No validation on incoming IDs could lead to unexpected behavior.

**Solution**:
- Added `BadRequestException` for missing/invalid `ids` parameter
- Normalized IDs: trim whitespace, filter empty strings, deduplicate with `Set`
- Validate that `ids` array is not empty before processing

**Impact**: Prevents malformed requests and potential DoS vectors.

## 2. Frontend Security Enhancements

### 2.1 Offline-First Architecture
**Problem**: App was unusable without internet connection; users couldn't play with cached data.

**Solution**:
- Installed `localforage` for IndexedDB-backed storage
- Created `storageService.ts` with:
  - `cachePacks()`: Stores word packs locally with timestamp
  - `getCachedPacks()`: Retrieves cached packs if valid (7-day TTL)
  - `isCacheValid()`: Checks if cache is still fresh
- Updated `wordPackService.getAllPacks()` to:
  - Try fetching from network first
  - Fall back to cache if network fails
  - Cache successful responses automatically

**Impact**: 
- App works offline after first successful load
- Better UX for users with poor connectivity
- Reduced server load

### 2.2 Simplified Game Initialization
**Problem**: Frontend was selecting random words/hints locally, requiring download of all data.

**Solution**:
- Removed local randomization logic
- Updated `GameSetup.tsx` to call `wordPackService.getSelection(ids)` instead of downloading full packs
- Simplified `useGameState.ts` to accept `impostorHint` directly from backend
- Removed `wordItems` dependency from frontend

**Impact**: 
- Frontend never receives complete word lists
- Reduced data transfer
- Cleaner separation of concerns

### 2.3 Privacy in Telemetry
**Problem**: Sending `playerNames` in logs could expose personal information.

**Solution**:
- Removed `playerNames` from `logGameEvent()` call
- Now only logs: `playerCount`, `impostorCount`, `wordPackIds`

**Impact**: Complies with privacy regulations for Play Store.

## 3. API Changes

### Old Endpoints (Deprecated)
```
GET /api/word-packs/:id → Returns full WordPack with words/wordItems
GET /api/word-packs/combined?ids=... → Returns combined pack with all words
```

### New Endpoints
```
GET /api/word-packs → Returns PublicWordPack[] (metadata only)
GET /api/word-packs/:id → Returns PublicWordPack (metadata only)
GET /api/word-packs/combined?ids=... → Returns PublicWordPack (metadata only)
POST /api/word-packs/selection → Returns { civilianWord, impostorHint }
```

### Request/Response Examples

**POST /api/word-packs/selection**
```json
Request:
{
  "ids": ["animales", "comidas"]
}

Response:
{
  "civilianWord": "Gato",
  "impostorHint": "Felino"
}
```

## 4. Deployment Checklist for Play Store

- [ ] Update Privacy Policy to mention:
  - Data collection: game events (playerCount, impostorCount, wordPackIds)
  - Storage: local caching of word packs (7-day TTL)
  - No personal data collection
  
- [ ] Update Data Safety form:
  - Data types collected: game analytics
  - Data retention: 30 days (telemetry)
  - Data sharing: not shared with third parties
  - Security practices: HTTPS, rate limiting, helmet headers

- [ ] Test offline functionality:
  - Load packs online
  - Disconnect network
  - Verify packs still available
  - Verify game can be played

- [ ] Test rate limiting:
  - Verify 30 req/min limit is enforced
  - Verify appropriate error messages

- [ ] Monitor backend logs for:
  - Failed selection requests
  - Rate limit hits
  - Firebase loading errors

## 5. Future Security Improvements (Optional)

1. **Play Integrity API**: Validate app authenticity before serving selections
2. **API Key Authentication**: Require API key for native app requests
3. **Encryption**: Encrypt cached word packs at rest
4. **Audit Logging**: Log all selection requests for fraud detection
5. **CORS Hardening**: Restrict to known frontend origins only

## 6. Testing

All changes have been tested:
- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ✅ New POST /selection endpoint works
- ✅ Rate limiting is active
- ✅ Offline caching works
- ✅ Game initialization with new flow works
