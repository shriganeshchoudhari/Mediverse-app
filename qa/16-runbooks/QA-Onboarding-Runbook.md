# QA Onboarding Runbook

```text
Document ID:       QA-RUN-001
Title:             Quality Engineer & SDET Onboarding Runbook
Version:           1.0.0
Status:            APPROVED
Owner:             Lead SDET
```

---

## 1. Workstation Setup in 15 Minutes
1. Clone repository: `git clone https://github.com/shriganeshchoudhari/Mediverse-app.git`
2. Install Node.js 20+ & Java 17+.
3. Setup Playwright:
   ```bash
   cd automation/playwright
   npm install
   npx playwright install --with-deps
   ```
4. Run Smoke Tests locally:
   ```bash
   npm run test:smoke
   ```
5. Setup Postman / Newman:
   ```bash
   npm install -g newman newman-reporter-allure
   newman run ../postman/collections/Mediverse_API_Regression.postman_collection.json -e ../postman/environments/Mediverse_QA.postman_environment.json
   ```
