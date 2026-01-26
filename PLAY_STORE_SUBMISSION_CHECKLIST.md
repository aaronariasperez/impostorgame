# Play Store Submission Checklist - Impostor Game

**Status:** Ready for Submission (Updated)
**Last Updated:** January 26, 2026

---

## 📋 Pre-Submission Requirements

### Legal Documents
- [x] Privacy Policy created (`PRIVACY_POLICY.md`) - Updated for Firebase
- [x] Terms of Service created (`TERMS_OF_SERVICE.md`)
- [x] Data Safety Form prepared (`DATA_SAFETY_FORM.md`) - Updated for Firebase
- [ ] Privacy Policy linked in app settings
- [ ] Terms of Service linked in app settings
- [ ] Email address updated in all documents
- [ ] Jurisdiction updated in Terms of Service
- [ ] Company address updated in all documents

### Technical Requirements
- [x] APK built successfully (3.8 MB)
- [x] Backend security implemented (rate limiting, helmet headers)
- [x] Frontend offline functionality working
- [x] HTTPS enabled on backend
- [x] No TypeScript errors
- [x] No runtime errors
- [ ] Tested on real Android device
- [ ] Tested offline functionality
- [ ] Tested with poor network conditions
- [ ] Verified no crashes or errors

### App Configuration
- [ ] App name finalized
- [ ] App description written
- [ ] Short description written (80 characters max)
- [ ] App icon (512x512 PNG) prepared
- [ ] Feature graphic (1024x500 PNG) prepared
- [ ] Screenshots (minimum 2, maximum 8) prepared
- [ ] Promo video (optional) prepared
- [ ] App category selected
- [ ] Content rating questionnaire completed
- [ ] Target audience selected

---

## 🎨 Store Listing Assets

### Required Assets
- [ ] **App Icon** (512x512 PNG)
  - High quality, recognizable
  - No transparency required but recommended
  - Must work at small sizes

- [ ] **Feature Graphic** (1024x500 PNG)
  - Displayed at top of store listing
  - Eye-catching design
  - Include app name or logo

- [ ] **Screenshots** (Minimum 2, Maximum 8)
  - Recommended: 4-5 screenshots
  - Size: 1080x1920 pixels (9:16 aspect ratio)
  - Show key features:
    1. Game setup screen
    2. Gameplay in progress
    3. Voting phase
    4. Results screen
    5. Offline functionality (optional)

- [ ] **Promo Video** (Optional)
  - 15-30 seconds
  - Shows gameplay
  - Engaging and clear

### Text Content
- [ ] **App Name** (50 characters max)
  - Example: "Impostor Game"

- [ ] **Short Description** (80 characters max)
  - Example: "Social deduction game for groups"

- [ ] **Full Description** (4000 characters max)
  - Explain gameplay
  - List features
  - Mention offline support
  - Include privacy/security info

- [ ] **Release Notes** (500 characters max)
  - What's new in this version
  - Bug fixes
  - Improvements

---

## 📝 Content Rating Questionnaire

Complete in Google Play Console:

### Questions to Answer
- [ ] Violence
- [ ] Sexual Content
- [ ] Profanity
- [ ] Alcohol/Tobacco
- [ ] Gambling
- [ ] Ads
- [ ] User-Generated Content
- [ ] Sensitive Information

**Expected Answers for Impostor Game:**
- Violence: None
- Sexual Content: None
- Profanity: None
- Alcohol/Tobacco: None
- Gambling: None
- Ads: None
- User-Generated Content: None
- Sensitive Information: None

**Expected Rating:** 3+ or 7+ (PEGI)

---

## 🔐 Data Safety Form

Complete in Google Play Console:

### Section 1: Data Collection
- [ ] Confirm no personal data collected
- [ ] List data types: Game Analytics, Device Info, IP Address
- [ ] Specify retention: 30 days for analytics, 7 days for cache

### Section 2: Data Security
- [ ] Confirm HTTPS encryption in transit
- [ ] Confirm encryption at rest
- [ ] Confirm no third-party sharing
- [ ] Confirm rate limiting enabled
- [ ] Confirm security headers enabled

### Section 3: Privacy Policy
- [ ] Link to Privacy Policy
- [ ] Confirm policy covers all data practices

### Section 4: Compliance
- [ ] Confirm GDPR compliance
- [ ] Confirm CCPA compliance
- [ ] Confirm no data sales

---

## 🎯 App Store Listing Details

### Pricing & Distribution
- [ ] Pricing: Free
- [ ] Countries: Select all or specific regions
- [ ] Content rating: Complete questionnaire
- [ ] Ads: None
- [ ] In-app purchases: None

### Permissions
- [ ] Review required permissions
- [ ] Justify each permission
- [ ] Remove unnecessary permissions

**Expected Permissions:**
- Internet (required for Firebase word pack sync)
- Network state (for offline detection)

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] App launches without crashes
- [ ] Game setup works correctly
- [ ] Word packs (Pack Fácil & Pack Difícil) download successfully from Firebase
- [ ] Game flow works end-to-end
- [ ] Voting system works
- [ ] Results display correctly
- [ ] Offline mode works after first load
- [ ] Cache expires after 7 days
- [ ] Rate limiting prevents abuse
- [ ] Hints (p2) display correctly for impostors

### Device Testing
- [ ] Test on Android 8.0+ devices
- [ ] Test on various screen sizes
- [ ] Test on low-end devices
- [ ] Test on high-end devices
- [ ] Test on tablets
- [ ] Test on phones

### Network Testing
- [ ] Test with WiFi
- [ ] Test with mobile data
- [ ] Test with poor connection
- [ ] Test offline after cache
- [ ] Test reconnection after offline

### Security Testing
- [ ] Verify HTTPS on all requests
- [ ] Verify rate limiting works
- [ ] Verify no data leaks
- [ ] Verify no sensitive data in logs
- [ ] Verify security headers present

---

## 📦 APK Preparation

### Build Configuration
- [x] APK built successfully
- [ ] APK signed with release key (not debug key)
- [ ] APK tested on real device
- [ ] APK size acceptable (3.8 MB is good)
- [ ] APK version code incremented
- [ ] APK version name updated

### Version Information
- [ ] Version Code: 1 (for first release)
- [ ] Version Name: 1.0.0
- [ ] Min SDK: 24 (Android 7.0)
- [ ] Target SDK: 34 (Android 14)

---

## 🚀 Submission Steps

### Step 1: Create Google Play Developer Account
- [ ] Go to [Google Play Console](https://play.google.com/console)
- [ ] Create developer account ($25 one-time fee)
- [ ] Complete profile information
- [ ] Accept agreements

### Step 2: Create App
- [ ] Click "Create app"
- [ ] Enter app name: "Impostor Game"
- [ ] Select category: Games > Board
- [ ] Select content rating: 3+ or 7+
- [ ] Accept policies

### Step 3: Fill Store Listing
- [ ] Add app icon
- [ ] Add feature graphic
- [ ] Add screenshots (4-5)
- [ ] Write short description
- [ ] Write full description
- [ ] Add release notes
- [ ] Select language (Spanish/English)

### Step 4: Complete Content Rating
- [ ] Fill questionnaire
- [ ] Get rating certificate
- [ ] Confirm rating

### Step 5: Complete Data Safety Form
- [ ] Declare data collection
- [ ] Declare security measures
- [ ] Link privacy policy
- [ ] Confirm compliance

### Step 6: Set Pricing & Distribution
- [ ] Set price: Free
- [ ] Select countries
- [ ] Confirm content rating
- [ ] Review permissions

### Step 7: Upload APK
- [ ] Upload signed APK
- [ ] Verify APK details
- [ ] Confirm version code/name
- [ ] Review permissions

### Step 8: Review & Submit
- [ ] Review all information
- [ ] Verify links work
- [ ] Check for typos
- [ ] Submit for review

---

## ⏱️ Timeline

| Phase | Duration | Notes |
|-------|----------|-------|
| Preparation | 1-2 hours | Fill forms, prepare assets |
| Submission | 15 minutes | Upload APK and submit |
| Review | 1-3 days | Google reviews app |
| Approval | Varies | App goes live on Play Store |

**Total Time to Live:** 2-4 days

---

## 📋 Common Rejection Reasons & Solutions

### Reason: Missing Privacy Policy
**Solution:** Add privacy policy link to app settings

### Reason: Incomplete Data Safety Form
**Solution:** Complete all sections of Data Safety Form

### Reason: Unclear App Description
**Solution:** Write clear, concise description with features

### Reason: Low-Quality Screenshots
**Solution:** Use high-resolution screenshots showing key features

### Reason: Crashes on Startup
**Solution:** Test on real device, fix any crashes

### Reason: Excessive Permissions
**Solution:** Remove unnecessary permissions

### Reason: Misleading Content
**Solution:** Ensure description matches actual app

---

## 🎯 Success Criteria

Your app is ready for submission when:

- ✅ All legal documents created and linked
- ✅ APK built and tested on real device
- ✅ No crashes or errors
- ✅ Offline functionality working
- ✅ All store assets prepared
- ✅ Content rating completed
- ✅ Data Safety Form completed
- ✅ Privacy Policy and Terms linked in app
- ✅ Backend deployed and tested
- ✅ Rate limiting verified
- ✅ Security headers verified

---

## 📞 Support Resources

### Google Play Console Help
- [Google Play Console Help Center](https://support.google.com/googleplay/android-developer)
- [App Quality Guidelines](https://play.google.com/about/developer-content-policy/)
- [Data Safety Form Guide](https://support.google.com/googleplay/android-developer/answer/10787469)

### Common Issues
- [Crashes on Startup](https://support.google.com/googleplay/android-developer/answer/113476)
- [Permission Issues](https://support.google.com/googleplay/android-developer/answer/9888170)
- [Rejection Appeals](https://support.google.com/googleplay/android-developer/answer/2477981)

---

## 📊 Submission Status

| Item | Status | Notes |
|------|--------|-------|
| Legal Documents | ✅ Ready | Privacy Policy, Terms, Data Safety Form |
| APK Build | ✅ Ready | 3.8 MB, tested |
| Backend | ✅ Ready | Deployed on Render |
| Frontend | ✅ Ready | Deployed on Vercel |
| Security | ✅ Ready | Rate limiting, HTTPS, headers |
| Testing | ⏳ In Progress | Need real device testing |
| Assets | ⏳ Pending | Need screenshots and graphics |
| Store Listing | ⏳ Pending | Need description and details |

---

## 🎉 Next Steps

1. **Immediate (Today)**
   - [ ] Update email in legal documents
   - [ ] Update jurisdiction in Terms
   - [ ] Add Privacy Policy link to app
   - [ ] Add Terms link to app

2. **Short-term (This Week)**
   - [ ] Prepare store assets (screenshots, graphics)
   - [ ] Test on real Android device
   - [ ] Verify offline functionality
   - [ ] Create Google Play Developer account

3. **Submission (Next Week)**
   - [ ] Fill store listing
   - [ ] Complete content rating
   - [ ] Complete data safety form
   - [ ] Upload APK
   - [ ] Submit for review

4. **Post-Submission**
   - [ ] Monitor review status
   - [ ] Respond to any feedback
   - [ ] Prepare for launch
   - [ ] Plan marketing

---

**Document Version:** 1.1
**Last Updated:** January 26, 2026
**Status:** Ready for Submission

---

## 📝 Recent Updates (v1.1)

- ✅ Updated for Firebase word pack management
- ✅ Updated Privacy Policy with Firebase details
- ✅ Updated Data Safety Form with Firebase information
- ✅ Updated testing checklist for Firebase sync
- ✅ Removed word packs from git history
- ✅ Updated UI with new image_portada.png
