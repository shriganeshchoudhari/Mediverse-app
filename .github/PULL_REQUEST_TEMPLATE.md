## 📋 Pull Request Description
<!-- Provide a clear summary of what changes are introduced and why. -->

**Related Issue / Epic:** Closes #
**Type of Change:**
- [ ] 🚀 New Feature (User Story)
- [ ] 🐛 Bug Fix (Defect Resolution)
- [ ] 🧪 Test Automation (Playwright / Newman / Unit)
- [ ] ⚡ Performance Optimization
- [ ] 🔒 Security & Compliance
- [ ] 📚 Documentation & Medical Curricula
- [ ] ⚠️ Breaking Change / Database Migration

---

## 🏥 Medical Domain & Service Impact
- [ ] Core Shell & Identity (`/auth`, Topbar, Themes)
- [ ] Allopathic Medicine (`/allopathic`, MBBS, MD/MS, ECG/Acid-Base Sim)
- [ ] Dental Surgery (`/dental`, BDS, MDS, 3D Tooth, Periodontal)
- [ ] AYUSH (`/ayush`, BAMS, BHMS, BNYS, BUMS, BSMS, Prakriti, Marma)
- [ ] Pharmacy (`/pharmacy`, B.Pharm, Pharm.D, Dissolution)
- [ ] Nursing (`/nursing`, B.Sc Nursing, SBAR Handover)
- [ ] Physiotherapy (`/physiotherapy`, BPT, Biomechanics, Goniometer)
- [ ] Allied Health (`/allied-health`, BMLT, OTT, Dialysis, Imaging)
- [ ] Veterinary (`/veterinary`, BVSc & AH, 3D Canine)
- [ ] Public Health (`/public-health`, MPH, Epidemic Outbreak)
- [ ] Socratic AI Tutor (`/aitutor`, RAG, Grounded Content)
- [ ] OSCE Clinical Exam Engine (`/exams`, Clinical Stations, Timer)
- [ ] Collaborative Study Rooms (`/social`, WebRTC, Whiteboard)

---

## 🧪 Quality Engineering & Verification Checklist

### 1. Automated Tests
- [ ] **Unit Tests:** Line coverage $\ge 80\%$ verified via `./gradlew jacocoTestCoverageVerification` / `npm run test:coverage`.
- [ ] **API Tests:** Postman/Newman contract assertions passing locally / in CI.
- [ ] **UI Tests:** Playwright specs executed (`npm run test:smoke` or `npm run test:e2e`).
- [ ] **Static Analysis:** Zero ESLint or SonarQube blocker/critical violations.

### 2. Privacy, Security & HIPAA Compliance
- [ ] Zero hardcoded passwords, tokens, API keys, or private secrets.
- [ ] Test data strictly synthetic (Zero real Protected Health Information [PHI]).
- [ ] PII redaction and rate limiting filters preserved on public endpoints.

### 3. Accessibility & UX
- [ ] Automated `axe-core` accessibility scan passed with 0 Level A / AA violations.
- [ ] Keyboard tab-navigation and mobile responsive viewports verified.

### 4. Persistence & Database
- [ ] Flyway schema migration scripts (`V...__*.sql`) tested for forward/rollback safety.
- [ ] No table-locking `ALTER TABLE` operations on large tables.

---

## 📸 Diagnostic Evidence & Test Proof
<!-- Attach screenshots, screen recordings, Allure trace links, or test terminal logs. -->

---

## 🛡️ Definition of Done (DoD) Sign-Off
- [ ] Pull request approved by at least one Senior Software Engineer and one SDET / QA Engineer.
- [ ] All CI Quality Gates on GitHub Actions passed with green status.
