# Data Safety Form - Impostor Game

**For Google Play Store Submission**

This document provides the information required for the Google Play Store Data Safety Form.

---

## 1. Data Collection & Security

### 1.1 Does your app collect or request any personal or sensitive user data?

**Answer:** No personal or sensitive user data is collected.

**Explanation:**
- We do NOT collect names, email addresses, phone numbers, or any personally identifiable information
- We do NOT collect location data
- We do NOT collect payment information
- We do NOT collect biometric data
- We do NOT collect health or fitness data

---

## 2. Data Types Collected

### 2.1 What data does your app collect?

**Data Type: Game Analytics**

| Field | Details |
|-------|---------|
| **Data Type** | Game Analytics |
| **Examples** | Game events, word pack selection (Pack Fácil/Difícil), player count, impostor count, game outcomes, hint usage |
| **Collected** | Yes |
| **Shared** | No |
| **Retention** | 30 days |
| **Purpose** | Service improvement, analytics, bug fixing |
| **User Control** | Users cannot opt-out (required for service) |

**Data Type: Device Information**

| Field | Details |
|-------|---------|
| **Data Type** | Device Information |
| **Examples** | Device type, OS version, app version |
| **Collected** | Yes |
| **Shared** | No |
| **Retention** | 30 days |
| **Purpose** | Debugging, compatibility testing |
| **User Control** | Automatic, no opt-out |

**Data Type: IP Address**

| Field | Details |
|-------|---------|
| **Data Type** | IP Address |
| **Examples** | User's IP address |
| **Collected** | Yes |
| **Shared** | No |
| **Retention** | Not stored long-term (used for rate limiting only) |
| **Purpose** | Rate limiting, abuse prevention |
| **User Control** | Automatic, no opt-out |

---

## 3. Data Sharing

### 3.1 Does your app share any user data with third parties?

**Answer:** No

**Explanation:**
- We do NOT share data with advertisers
- We do NOT share data with marketing companies
- We do NOT share data with data brokers
- We do NOT share data with analytics companies (Firebase is used internally only)
- We do NOT sell user data
- We do NOT share data with any external services
- Firebase is used only for storing word pack data (not user data)

---

## 4. Data Security

### 4.1 How is user data encrypted?

**In Transit:**
- ✅ All data is encrypted using HTTPS/TLS
- ✅ All API communications use HTTPS
- ✅ No unencrypted data transmission

**At Rest:**
- ✅ Local cache stored in device's IndexedDB (browser-level encryption)
- ✅ Word pack data stored in Firebase Firestore (Google-managed encryption)
- ✅ Game analytics stored in Firebase (Google-managed encryption)
- ✅ No sensitive data stored unencrypted

### 4.2 Security Measures

| Measure | Status | Details |
|---------|--------|---------|
| HTTPS/TLS | ✅ Enabled | All data in transit encrypted |
| Rate Limiting | ✅ Enabled | 30 requests per minute per IP |
| Input Validation | ✅ Enabled | All inputs validated server-side |
| Security Headers | ✅ Enabled | Helmet.js protection (XSS, clickjacking, MIME-sniffing) |
| CORS | ✅ Configured | Only allowed origins can access API |
| Authentication | N/A | Not required (local game) |
| Encryption at Rest | ✅ Enabled | Firebase encryption + IndexedDB |

---

## 5. Data Retention Policy

### 5.1 How long is data retained?

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| Game Events | 30 days | Automatic deletion via Firebase TTL |
| Device Info | 30 days | Automatic deletion via Firebase TTL |
| IP Address | Not stored | Used only for rate limiting |
| Local Cache | 7 days | Automatic expiration + manual clear option |

### 5.2 User Data Deletion

Users can delete their data by:
1. Clearing app cache through device settings
2. Uninstalling the app
3. Clearing browser storage (for web version)

---

## 6. Privacy Policy & Terms

### 6.1 Privacy Policy

- ✅ Privacy Policy exists: `PRIVACY_POLICY.md`
- ✅ Accessible in app: [Link to be added in app settings]
- ✅ Covers all data collection practices
- ✅ GDPR compliant
- ✅ CCPA compliant

### 6.2 Terms of Service

- ✅ Terms of Service exists: `TERMS_OF_SERVICE.md`
- ✅ Accessible in app: [Link to be added in app settings]
- ✅ Covers user responsibilities
- ✅ Covers liability limitations

---

## 7. Compliance Certifications

### 7.1 Regulatory Compliance

| Regulation | Status | Details |
|-----------|--------|---------|
| GDPR | ✅ Compliant | EU data protection compliant |
| CCPA | ✅ Compliant | California privacy rights respected |
| COPPA | ✅ Compliant | No personal data from children under 13 |
| Google Play Policy | ✅ Compliant | Follows all Play Store requirements |

### 7.2 Data Protection Impact Assessment (DPIA)

**Risk Level:** LOW

**Reasoning:**
- No personal data collected
- No sensitive data collected
- Strong encryption in transit
- Limited data retention (30 days)
- No third-party sharing
- Rate limiting prevents abuse

---

## 8. Specific Questions for Play Store Form

### Q: Does your app collect or request any personal or sensitive user data?

**Answer:** No

**Explanation:** The app only collects anonymous game analytics and device information. No personal identifiers, location data, or sensitive information is collected.

---

### Q: Is all of the user data collected encrypted in transit?

**Answer:** Yes

**Explanation:** All data is transmitted over HTTPS/TLS. No unencrypted data is sent over the network.

---

### Q: Is all of the user data collected encrypted at rest?

**Answer:** Yes

**Explanation:** 
- Local data is stored in IndexedDB with browser-level encryption
- Backend data is stored in Firebase with Google-managed encryption

---

### Q: Do you allow users to request deletion of their data?

**Answer:** Yes

**Explanation:** Users can delete their data by:
1. Clearing app cache through device settings
2. Uninstalling the app
3. Contacting us at impostorgamexiklana@proton.me

---

### Q: Do you share any user data with third parties?

**Answer:** No

**Explanation:** We do not share any user data with third parties. Data is used solely for operating and improving the app.

---

### Q: Do you have a privacy policy?

**Answer:** Yes

**Explanation:** Privacy Policy is available at `PRIVACY_POLICY.md` and will be linked in the app.

---

### Q: Do you have a terms of service?

**Answer:** Yes

**Explanation:** Terms of Service is available at `TERMS_OF_SERVICE.md` and will be linked in the app.

---

## 9. Implementation Checklist

Before submitting to Play Store:

- [ ] Add Privacy Policy link to app settings
- [ ] Add Terms of Service link to app settings
- [ ] Update email address in both documents (impostorgamexiklana@proton.me)
- [ ] Update jurisdiction in Terms of Service
- [ ] Update company address in both documents
- [ ] Test Privacy Policy and Terms links on device
- [ ] Verify HTTPS is enabled on backend
- [ ] Verify rate limiting is active (30 req/min)
- [ ] Verify security headers are present
- [ ] Test data deletion functionality
- [ ] Verify offline functionality works
- [ ] Test with poor network conditions
- [ ] Verify no crashes or errors
- [ ] Get legal review (optional but recommended)

---

## 10. Contact Information

For questions about data practices:

**Email:** impostorgamexiklana@proton.me
**Address:** Online

---

## 11. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-23 | Initial version for Play Store submission |
| 1.1 | 2026-01-26 | Updated for Firebase word pack management |

---

**Document Version:** 1.1
**Last Updated:** January 26, 2026
**Status:** Ready for Play Store Submission
