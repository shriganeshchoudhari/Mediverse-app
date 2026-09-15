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
| **Authentication** | `POST` | `/api/v1/auth/login` | None | Public | Issues JWT access token and refresh token upon valid credentials |
| **Authentication** | `POST` | `/api/v1/auth/register` | None | Public | Registers a new student or faculty account |
| **Authentication** | `POST` | `/api/v1/auth/refresh` | None | Public | Exchanges active refresh token for a new short-lived access token |
| **Authentication** | `POST` | `/api/v1/auth/forgot-password` | None | Public | Generates time-limited password reset token and sends email |
| **Authentication** | `POST` | `/api/v1/auth/reset-password` | None | Public | Completes password reset using valid reset token |
| **Curriculum** | `GET` | `/api/v1/curriculum/{domain}/modules` | Yes | `STUDENT`, `FACULTY` | Retrieves list of modules for a specific medical domain |
| **Curriculum** | `GET` | `/api/v1/curriculum/modules/{id}/lessons` | Yes | `STUDENT`, `FACULTY` | Returns structured lesson content blocks, LaTeX equations & 3D metadata |
| **Curriculum** | `POST` | `/api/v1/curriculum/articles` | Yes | `FACULTY`, `ADMIN` | Authors new peer-reviewed curriculum article |
| **CMS Review** | `GET` | `/api/v1/cms/lessons` | Yes | `MEDICAL_REVIEWER`, `ADMIN` | Queries content review queue filtered by status |
| **CMS Review** | `POST` | `/api/v1/cms/lessons/{id}/review` | Yes | `MEDICAL_REVIEWER`, `ADMIN` | Approves or rejects draft lesson content with clinical audit notes |
| **Learning** | `POST` | `/api/v1/learning/progress/update` | Yes | `STUDENT` | Updates competency progress for completed lesson |
| **Learning** | `GET` | `/api/v1/learning/streaks/me` | Yes | `STUDENT` | Fetches active clinical study streak and daily XP |
| **Flashcards** | `GET` | `/api/v1/flashcards/deck/{id}` | Yes | `STUDENT` | Retrieves spaced-repetition flashcards for review |
| **Flashcards** | `POST` | `/api/v1/flashcards/review` | Yes | `STUDENT` | Submits card review rating and recalculates SM-2 interval |
| **Assessment** | `GET` | `/api/v1/assessments/osce/stations` | Yes | `STUDENT`, `FACULTY` | Discovers available timed clinical examination stations |
| **Assessment** | `POST` | `/api/v1/assessments/osce/sessions` | Yes | `STUDENT` | Initializes a timed OSCE examination station with server timer |
| **Assessment** | `POST` | `/api/v1/assessments/osce/sessions/{id}/submit` | Yes | `STUDENT` | Submits clinical checklist answers and triggers rubric evaluation |
| **AI Tutor** | `POST` | `/api/v1/ai/socratic/ask` | Yes | `STUDENT`, `FACULTY` | Executes grounded RAG retrieval and streams Socratic AI responses |
| **AI Tutor** | `POST` | `/api/v1/ai/context/search` | Yes | `STUDENT`, `FACULTY` | Dense vector similarity search against textbook chunks |
| **Mock EMR** | `GET` | `/api/v1/emr/patients` | Yes | `STUDENT`, `FACULTY` | Fetches patient roster for the mock EMR clinical sandbox |
| **Mock EMR** | `POST` | `/api/v1/emr/soap-grade/evaluate` | Yes | `STUDENT`, `FACULTY` | AI evaluates SOAP note, checks ICD-10 codes, and scores rubric |
| **Tenants** | `GET` | `/api/v1/tenants/{id}/cohorts` | Yes | `DEPT_HEAD`, `ADMIN` | Fetches student cohorts and clinical milestone competency heatmaps |
| **Tenants** | `POST` | `/api/v1/tenants/{id}/roster/import` | Yes | `ADMIN` | Batch imports student CSV roster and creates domain accounts |
| **Telehealth** | `WSS` | `/ws/telehealth` | Yes | `STUDENT` | Bi-directional WebRTC audio streaming to Voice Patient persona |
| **Actuator** | `GET` | `/actuator/health` | None | Internal / K8s | Service health, readiness, and liveness status |
| **Actuator** | `GET` | `/actuator/prometheus` | None | Prometheus | Micrometer Prometheus telemetry metrics scraping |

---

## Interactive API Documentation

Interactive OpenAPI 3.0 documentation and live Swagger UI sandbox are available at:
- **Swagger UI**: `http://localhost:8085/swagger-ui/index.html`
- **OpenAPI Schema (JSON)**: `http://localhost:8085/v3/api-docs`
- **OpenAPI Schema (YAML)**: `http://localhost:8085/v3/api-docs.yaml`
