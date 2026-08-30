# Mediverse Enterprise Data Catalog & Classification

```text
Document ID:       MED-CAT-04
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## Data Classification & Retention Registry

| Data Entity | Owning Schema | Classification Tier | PII / PHI Contained | Encryption at Rest | Retention Policy |
|---|---|---|:---:|:---:|:---:|
| **User Account & Auth Credentials** | `keycloak_db` | **Sensitive** (Personal Data) | Yes (Email, Name, Hashed Passwords) | AES-256 (KMS) | User Lifecycle + 90 days |
| **Curriculum Syllabi & Textbooks** | `curriculum_schema` | **Public / Commercial** | No | AES-256 (KMS) | Indefinite (Versioned) |
| **Vector Embeddings (1536 dim)** | `ai_vector_schema` | **Internal** | No | AES-256 (KMS) | Current Model Lifecycle |
| **Student OSCE Exam Submissions** | `assessment_schema` | **Confidential** (Academic Record)| Yes (Student ID, Score, Rubrics) | AES-256 (KMS) | 5 Years (Accreditation) |
| **Mock EMR Clinical Notes** | `emr_schema` | **Synthetic PHI** (Simulated) | No Real PHI (Synthetic Scenarios) | AES-256 (KMS) | 3 Years |
| **Security Audit Trails** | `audit_schema` | **Confidential** | Yes (IP, User ID, Timestamp) | AES-256 (KMS) | 7 Years (HIPAA / SOC 2) |
| **3D GLTF Anatomy Meshes** | Amazon S3 | **Public / Proprietary** | No | SSE-S3 | Indefinite |
