# Mediverse Enterprise Service Catalog

```text
Document ID:       MED-CAT-01
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## Service Catalog & Ownership Registry

| Service Name | Bounded Context | Business Capability | Tech Stack | DB Schema Owned | Ingress Route | Target SLO | Primary Owner |
|---|---|---|---|---|---|:---:|---|
| **API Gateway** | Edge / Ingress | Authentication verification, token introspection, route routing, distributed rate limiting | Spring Cloud Gateway 4.x, Netty | None (Redis cache) | `/*` | $99.99\%$ | Platform Team |
| **Identity Service** | Identity & Access | Enterprise OIDC / OAuth2, MFA, user federation, password management | Keycloak 24 (Quarkus) | `keycloak_db` | `/auth/**` | $99.99\%$ | Security Team |
| **Curriculum Service** | Curriculum | Multi-domain syllabi (9 streams), rich educational blocks, LaTeX, 3D metadata | Java 21, Spring Boot 3.5 | `curriculum_schema` | `/api/v1/curriculum/**` | $99.95\%$ | Content Team |
| **Learning Progress Service** | Learning | Competency milestones, spaced repetition flashcards, clinical study streaks | Java 21, Spring Boot 3.5 | `learning_schema` | `/api/v1/learning/**` | $99.95\%$ | Core Learning Team |
| **Assessment & OSCE Service** | Assessment | Timed OSCE stations, viva voce evaluations, MCQ examination banks | Java 21, Spring Boot 3.5 | `assessment_schema` | `/api/v1/assessments/**` | $99.99\%$ | Assessment Team |
| **AI Gateway & RAG Service** | AI & Simulation | Dense-sparse vector retrieval, prompt safety guardrails, Gemini LLM bridge | Java 21, Spring Boot, pgvector | `ai_vector_schema` | `/api/v1/ai/**` | $99.90\%$ | AI / ML Team |
| **Mock EMR Service** | Clinical Charting | Hospital EMR sandbox, SOAP note charting, automated clinical grading | Java 21, Spring Boot 3.5 | `emr_schema` | `/api/v1/emr/**` | $99.95\%$ | Simulation Team |
| **Tenant & Cohort Service** | Multi-Tenancy | University institutional isolation, branding, CSV student roster batch imports | Java 21, Spring Boot 3.5 | `tenant_schema` | `/api/v1/tenants/**` | $99.95\%$ | Enterprise Team |
| **Notification Service** | Notifications | Asynchronous email dispatching, mobile push alerts, exam reminders | Java 21, Spring Boot 3.5 | `notification_schema` | Internal Kafka Consumer | $99.90\%$ | Core Platform Team |
| **Media Pipeline Worker** | Media & 3D | Draco 3D mesh compression, KTX2 GPU textures, multi-LOD generation | Node.js / Rust / gltf-pipeline | S3 Metadata | Internal Job Queue | $99.90\%$ | 3D Graphics Team |
