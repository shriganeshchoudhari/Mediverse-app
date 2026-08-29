# API Test Suite Catalog

```text
Document ID:       QA-ATS-001
Title:             API Contract & Functional Test Suite Catalog
Version:           2.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

| Test Case ID | HTTP Method & Path | Validation Focus | Expected Status |
| :--- | :--- | :--- | :---: |
| `API-HLTH-001` | `GET /actuator/health` | Actuator DB & Redis connectivity UP | `200 OK` |
| `API-AUTH-001` | `POST /api/v1/auth/register` | Register student with valid payload | `201 Created` / `200 OK` |
| `API-AUTH-002` | `POST /api/v1/auth/login` | Valid student credentials return JWT token | `200 OK` |
| `API-AUTH-003` | `POST /api/v1/auth/login` | Invalid password returns error status | `401 Unauthorized` |
| `API-DOM-001` | `GET /api/v1/healthcare/domains` | Return metadata array for all 9 domains | `200 OK` |
| `API-ALLO-001` | `GET /api/v1/curriculum/allopathic/mbbs` | Return 5.5-Yr MBBS CBME curriculum structure | `200 OK` |
| `API-DENT-001` | `GET /api/v1/curriculum/dental/bds` | Return 5-Yr BDS DCI curriculum structure | `200 OK` |
| `API-AYUSH-001`| `GET /api/v1/curriculum/ayush/bams` | Return 5.5-Yr BAMS NCISM curriculum structure | `200 OK` |
| `API-AI-001` | `POST /api/v1/ai/generate/mcq` | Grounded MCQ generation from topic | `200 OK` |
| `API-EXAM-001` | `GET /api/v1/exams/osce/stations` | Return active clinical OSCE stations | `200 OK` |
