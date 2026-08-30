# Mediverse Enterprise API Catalog

```text
Document ID:       MED-CAT-02
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## Unified REST & WebSocket API Endpoint Catalog

| Service | Method | Endpoint Path | Auth Required | Scope / Role | Description |
|---|:---:|---|:---:|---|---|
| **Identity** | `POST` | `/auth/realms/mediverse/protocol/openid-connect/token` | None | Public | OAuth2 token exchange with username/password or refresh token |
| **Curriculum** | `GET` | `/api/v1/curriculum/{domain}/modules` | Yes | `STUDENT`, `FACULTY` | Retrieves list of modules for a specific medical domain |
| **Curriculum** | `GET` | `/api/v1/curriculum/modules/{id}/lessons` | Yes | `STUDENT`, `FACULTY` | Returns structured lesson content blocks, LaTeX equations & 3D metadata |
| **Curriculum** | `POST` | `/api/v1/curriculum/articles` | Yes | `FACULTY`, `ADMIN` | Authors new peer-reviewed curriculum article |
| **Learning** | `POST` | `/api/v1/learning/progress/update` | Yes | `STUDENT` | Updates competency progress for completed lesson |
| **Learning** | `GET` | `/api/v1/learning/streaks/me` | Yes | `STUDENT` | Fetches active clinical study streak and daily XP |
| **Assessment** | `GET` | `/api/v1/assessments/osce/stations` | Yes | `STUDENT`, `FACULTY` | Discovers available timed clinical examination stations |
| **Assessment** | `POST` | `/api/v1/assessments/osce/sessions` | Yes | `STUDENT` | Initializes a timed OSCE examination station with server timer |
| **Assessment** | `POST` | `/api/v1/assessments/osce/sessions/{id}/submit` | Yes | `STUDENT` | Submits clinical checklist answers and triggers rubric evaluation |
| **AI Gateway** | `POST` | `/api/v1/ai/socratic/ask` | Yes | `STUDENT`, `FACULTY` | Executes grounded RAG retrieval and streams Socratic AI responses |
| **AI Gateway** | `POST` | `/api/v1/ai/context/search` | Yes | `STUDENT`, `FACULTY` | Dense vector similarity search against textbook chunks |
| **Mock EMR** | `GET` | `/api/v1/emr/patients` | Yes | `STUDENT`, `FACULTY` | Fetches patient roster for the mock EMR clinical sandbox |
| **Mock EMR** | `POST` | `/api/v1/emr/soap-grade/evaluate` | Yes | `STUDENT`, `FACULTY` | AI evaluates SOAP note, checks ICD-10 codes, and scores rubric |
| **Tenants** | `GET` | `/api/v1/tenants/{id}/cohorts` | Yes | `DEPT_HEAD`, `ADMIN` | Fetches student cohorts and clinical milestone competency heatmaps |
| **Tenants** | `POST` | `/api/v1/tenants/{id}/roster/import` | Yes | `ADMIN` | Batch imports student CSV roster and creates domain accounts |
| **Telehealth** | `WSS` | `/ws/telehealth` | Yes | `STUDENT` | Bi-directional WebRTC audio streaming to Voice Patient persona |
