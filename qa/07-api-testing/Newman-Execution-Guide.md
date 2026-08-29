# Newman Execution Guide

```text
Document ID:       QA-API-003
Title:             Newman CLI Headless Execution & CI Integration
Version:           1.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

## 1. CLI Execution Command
```bash
newman run automation/postman/collections/Mediverse_API_Regression.postman_collection.json \
  -e automation/postman/environments/Mediverse_QA.postman_environment.json \
  --reporters cli,allure,junit \
  --reporter-junit-export automation/postman/reports/junit-report.xml \
  --reporter-allure-export automation/postman/reports/allure-results \
  --bail
```
