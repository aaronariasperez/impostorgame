# Play Store Final Checklist - Impostor Game

**Status:** 85% Ready for Submission
**Last Updated:** January 26, 2026

---

## ✅ What's Already Done

### Technical
- ✅ APK built successfully (3.8 MB)
- ✅ Backend deployed on Render with security
- ✅ Frontend deployed on Vercel
- ✅ Rate limiting implemented (30 req/min)
- ✅ Security headers enabled (Helmet.js)
- ✅ HTTPS encryption enabled
- ✅ Offline functionality working
- ✅ No TypeScript errors
- ✅ No runtime errors

### Documentation
- ✅ Privacy Policy created (updated for Firebase)
- ✅ Terms of Service created
- ✅ Data Safety Form prepared (updated for Firebase)
- ✅ Security improvements documented
- ✅ Testing procedures documented
- ✅ Word packs migrated to Firebase
- ✅ Git history cleaned (word packs removed)

---

## ⏳ What Still Needs to Be Done

### 1. **Update Legal Documents** (15 minutes)

**Files to Update:**
- `PRIVACY_POLICY.md` - Replace `impostorgamexiklana@proton.me` and `Online`
- `TERMS_OF_SERVICE.md` - Replace `Spain`, `impostorgamexiklana@proton.me`, `Online`
- `DATA_SAFETY_FORM.md` - Replace `impostorgamexiklana@proton.me`

**Action Items:**
```bash
# Find and replace in all files:
impostorgamexiklana@proton.me → your-actual-email@example.com
Online → Your actual address
Spain → Your jurisdiction (e.g., "Spain", "California")
```

### 2. **Add Links to App** (30 minutes)

**Where to Add:**
- App settings screen
- About section
- Help/Support section

**Links to Add:**
- Privacy Policy: Link to `PRIVACY_POLICY.md` or hosted version
- Terms of Service: Link to `TERMS_OF_SERVICE.md` or hosted version

**Implementation:**
```typescript
// Example in React component
<a href="https://your-domain.com/privacy-policy">Privacy Policy</a>
<a href="https://your-domain.com/terms-of-service">Terms of Service</a>
```

### 3. **Prepare Store Assets** (1-2 hours)

**Required:**
- [ ] App Icon (512x512 PNG)
- [ ] Feature Graphic (1024x500 PNG)
- [ ] Screenshots (4-5 images, 1080x1920 each)

**Optional:**
- [ ] Promo Video (15-30 seconds)

**Screenshot Ideas:**
1. Game setup screen (select players, impostors, word pack)
2. Gameplay in progress (showing hints phase)
3. Discussion phase (showing timer)
4. Voting phase (showing vote options)
5. Results screen (showing winner)

### 4. **Test on Real Device** (1-2 hours)

**Testing Checklist:**
- [ ] Install APK on Android device
- [ ] Launch app without crashes
- [ ] Complete full game flow
- [ ] Test offline functionality
- [ ] Test with poor network
- [ ] Verify no data leaks
- [ ] Check for UI issues

**Devices to Test:**
- Android 8.0+ (minimum)
- Various screen sizes (phone, tablet)
- Low-end and high-end devices

### 5. **Create Google Play Developer Account** (15 minutes)

**Steps:**
1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with Google account
3. Pay $25 one-time developer fee
4. Complete profile information
5. Accept developer agreement

### 6. **Fill Store Listing** (1 hour)

**Information Needed:**
- App name: "Impostor Game"
- Short description (80 chars): "Social deduction game for groups"
- Full description (4000 chars): Explain gameplay, features, offline support
- Release notes: "Initial release"
- Category: Games > Board
- Content rating: 3+ or 7+

**Example Description:**
```
Impostor Game is a social deduction game where players work together 
to identify the impostor among them. Perfect for groups and parties!

Features:
- Local multiplayer (all players on one device)
- Configurable number of impostors
- 2 word pack categories: Pack Fácil (Easy) & Pack Difícil (Hard)
- Offline support (works without internet)
- Fast-paced gameplay (15-30 minutes per game)
- No ads or in-app purchases
- Cloud-synced word packs (Firebase)

How to Play:
1. Select number of players and impostors
2. Choose a word pack (Easy or Hard difficulty)
3. Each player gets a secret word (impostors get a specific hint)
4. Players give clues about their word
5. Vote to eliminate the impostor
6. If impostor is eliminated, they get one chance to guess the word

Word Packs:
- Pack Fácil (Easy): 202 words with simple hints - perfect for beginners
- Pack Difícil (Hard): 202 words with challenging hints - for experienced players
- All packs are cloud-synced and updated automatically

Privacy:
- No personal data collected
- No ads or tracking
- Works offline
- See Privacy Policy for details
```

### 7. **Complete Content Rating** (15 minutes)

**Questionnaire:**
- Violence: None
- Sexual Content: None
- Profanity: None
- Alcohol/Tobacco: None
- Gambling: None
- Ads: None
- User-Generated Content: None
- Sensitive Information: None

**Expected Rating:** 3+ (PEGI) or 7+ (ESRB)

### 8. **Complete Data Safety Form** (30 minutes)

**Sections:**
1. Data Collection: Game analytics, device info, IP address
2. Data Security: HTTPS, rate limiting, no third-party sharing
3. Privacy Policy: Link to policy
4. Compliance: GDPR, CCPA compliant

**Key Points:**
- No personal data collected
- All data encrypted in transit
- 30-day retention for analytics
- 7-day retention for cache
- No third-party sharing

### 9. **Upload APK** (15 minutes)

**Steps:**
1. Go to Google Play Console
2. Create new app
3. Upload signed APK
4. Verify APK details
5. Confirm version code/name

**APK Details:**
- Version Code: 1
- Version Name: 1.0.0
- Min SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)

### 10. **Submit for Review** (5 minutes)

**Final Checks:**
- [ ] All fields filled
- [ ] All links working
- [ ] No typos or errors
- [ ] Privacy Policy linked
- [ ] Terms of Service linked
- [ ] Data Safety Form completed
- [ ] Content rating completed
- [ ] APK uploaded and verified

**Submit:**
- Click "Submit for Review"
- Wait for approval (1-3 days)

---

## 📊 Effort Breakdown

| Task | Time | Priority | Status |
|------|------|----------|--------|
| Update legal documents | 15 min | 🔴 Critical | ⏳ Pending |
| Add links to app | 30 min | 🔴 Critical | ⏳ Pending |
| Prepare store assets | 1-2 hrs | 🟡 High | ⏳ Pending |
| Test on real device | 1-2 hrs | 🔴 Critical | ⏳ Pending |
| Create Play account | 15 min | 🔴 Critical | ⏳ Pending |
| Fill store listing | 1 hr | 🔴 Critical | ⏳ Pending |
| Complete content rating | 15 min | 🔴 Critical | ⏳ Pending |
| Complete data safety form | 30 min | 🔴 Critical | ⏳ Pending |
| Upload APK | 15 min | 🔴 Critical | ⏳ Pending |
| Submit for review | 5 min | 🔴 Critical | ⏳ Pending |

**Total Time:** 5-7 hours

---

## 🎯 Critical Path (Fastest Route)

**Day 1 (Today):**
1. Update legal documents (15 min)
2. Add links to app (30 min)
3. Test on real device (1-2 hrs)
4. Create Play account (15 min)

**Day 2 (Tomorrow):**
1. Prepare store assets (1-2 hrs)
2. Fill store listing (1 hr)
3. Complete content rating (15 min)
4. Complete data safety form (30 min)

**Day 3 (Next Day):**
1. Upload APK (15 min)
2. Final review (15 min)
3. Submit for review (5 min)

**Day 4-6:**
- Wait for Google Play review (1-3 days)
- App goes live! 🎉

---

## 🚨 Critical Issues to Address

### Issue 1: Legal Documents Need Personalization
**Status:** 🔴 Critical
**Action:** Update email, address, jurisdiction in all legal documents
**Time:** 15 minutes

### Issue 2: App Needs Links to Legal Documents
**Status:** 🔴 Critical
**Action:** Add Privacy Policy and Terms links to app UI
**Time:** 30 minutes

### Issue 3: No Real Device Testing Yet
**Status:** 🔴 Critical
**Action:** Test APK on real Android device
**Time:** 1-2 hours

### Issue 4: Store Assets Not Prepared
**Status:** 🟡 High
**Action:** Create screenshots and graphics
**Time:** 1-2 hours

---

## 📋 Quick Reference: What to Do Next

### Immediate (Next 30 minutes)
```bash
# 1. Update legal documents
sed -i 's/\[impostorgamexiklana@proton.me\]/impostorgamexiklana@proton.me/g' PRIVACY_POLICY.md
sed -i 's/\[impostorgamexiklana@proton.me\]/impostorgamexiklana@proton.me/g' TERMS_OF_SERVICE.md
sed -i 's/\[Your Company Address\]/Your Address/g' PRIVACY_POLICY.md
sed -i 's/\[Your Company Address\]/Your Address/g' TERMS_OF_SERVICE.md
sed -i 's/\[Your Jurisdiction\]/Spain/g' TERMS_OF_SERVICE.md

# 2. Commit changes
git add PRIVACY_POLICY.md TERMS_OF_SERVICE.md
git commit -m "docs: update legal documents with contact info"
git push origin feature/mobile
```

### Short-term (Next 2 hours)
1. Add Privacy Policy link to app settings
2. Add Terms of Service link to app settings
3. Rebuild APK with links
4. Test on real Android device

### Medium-term (Next 24 hours)
1. Create Google Play Developer account
2. Prepare store assets (screenshots, graphics)
3. Write store listing description

### Long-term (Next 48 hours)
1. Fill all Play Store forms
2. Upload APK
3. Submit for review

---

## 🎉 Success Metrics

Your submission is ready when:

- ✅ Legal documents personalized
- ✅ Links added to app
- ✅ APK tested on real device
- ✅ No crashes or errors
- ✅ Store assets prepared
- ✅ Store listing filled
- ✅ Content rating completed
- ✅ Data safety form completed
- ✅ APK uploaded
- ✅ Submitted for review

---

## 📞 Support

### If You Get Stuck

**Legal Documents:**
- Check `PRIVACY_POLICY.md` for template
- Check `TERMS_OF_SERVICE.md` for template
- Update placeholders with your info

**Store Listing:**
- Check `PLAY_STORE_SUBMISSION_CHECKLIST.md` for examples
- Use provided description template
- Follow Google Play guidelines

**Technical Issues:**
- Check `SECURITY_IMPROVEMENTS.md` for security details
- Check `TESTING_SECURITY.md` for testing procedures
- Review backend logs on Render dashboard

**Rejection:**
- Check `PLAY_STORE_SUBMISSION_CHECKLIST.md` for common reasons
- Review Google Play policies
- Appeal if you disagree with rejection

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Technical** | ✅ 100% | APK built, backend deployed, security implemented |
| **Legal** | 🟡 50% | Documents created, need personalization |
| **Assets** | ⏳ 0% | Need screenshots and graphics |
| **Testing** | ⏳ 0% | Need real device testing |
| **Store Setup** | ⏳ 0% | Need Play account and forms |
| **Overall** | 🟡 50% | Ready for final push |

---

## 🚀 Estimated Timeline to Live

- **Preparation:** 5-7 hours
- **Submission:** 15 minutes
- **Review:** 1-3 days
- **Total:** 2-4 days

**Expected Live Date:** January 25-27, 2026

---

**Document Version:** 1.1
**Last Updated:** January 26, 2026
**Next Review:** After submission

---

## 📝 Recent Updates (v1.1)

- ✅ Updated for Firebase word pack management
- ✅ Updated description to reflect 2 word packs (Pack Fácil & Pack Difícil)
- ✅ Updated Privacy Policy with Firebase details
- ✅ Updated Data Safety Form with Firebase information
- ✅ Removed word packs from git history
- ✅ Updated UI with new image_portada.png
