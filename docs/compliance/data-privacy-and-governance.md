# Mediverse Data Privacy, Security & Compliance Governance
*Digital Personal Data Protection Act (DPDP India) & Healthcare Regulatory Standards*

---

## 1. Regulatory Context

Mediverse operates as a multi-tenant institutional medical and healthcare education platform. Because students and faculty interact with simulated electronic medical records (EMRs), clinical cases, OSCE patient encounters, and AI tutoring dialogues, data privacy and classification policies are strictly governed under:

1. **Digital Personal Data Protection (DPDP) Act, 2023 (India)**: Mandating explicit consent, data minimization, purpose limitation, and user rights (access, correction, erasure).
2. **DISHA (Digital Information Security in Healthcare Act)**: Guidelines on protecting digitized healthcare data and clinical simulation logs.
3. **National Medical Commission (NMC) Academic Guidelines**: Ensuring institutional student performance metrics and assessment logs remain confidential to the institution.

---

## 2. Data Classification Matrix

| Tier | Category | Examples | Storage & Encryption Standard |
|---|---|---|---|
| **Tier 1 (Restricted)** | User Auth & Credentials | Password hashes (BCrypt 12 rounds), JWT secrets, refresh tokens | PostgreSQL, TLS in transit, HashiCorp Vault / AWS Secrets Manager |
| **Tier 2 (Confidential)** | Institutional Student Data | Student grades, OSCE evaluations, quiz results, study session logs | Tenant-isolated PostgreSQL tables with `tenant_id` scoping |
| **Tier 3 (Simulated / Synthetic)** | EMR Patient Records | Simulated EHR charts, vitals, lab reports | Scoped to academic sandbox; marked with `is_simulated: true` |
| **Tier 4 (Public / Academic)** | Curriculum & Taxonomy | NMC/VCI competency codes, subject syllabus trees, 3D anatomical models | Public CDN, cached in Redis, indexed in Elasticsearch |

---

## 3. AI Privacy & PII Scrubbing Protocol

To prevent accidental leakage of real student or clinical data to third-party LLM providers (e.g., Google Cloud Gemini), the backend enforces an automatic **PII Redaction Pipeline** via `PiiRedactionUtil.java`:

- **Automatic Scrubbing**: Phone numbers, email addresses, Aadhaar numbers, Social Security Numbers, Medical Record Numbers (MRNs), and patient/student names are replaced with structured redaction tokens prior to API dispatch.
- **Academic Context Isolation**: Prompts are constrained to physiological and biochemical principles, explicitly filtering out real-world patient triage requests.

---

## 4. Institutional Multi-Tenancy & Access Controls

- **Tenant Isolation**: Student and faculty data is strictly partitioned by `tenant_id`.
- **RBAC**: Endpoints under `/api/v1/admin/tenants/**` are restricted to `SUPER_ADMIN` and `ADMIN` roles.
- **Audit Logging**: Sensitive actions (role changes, curriculum approvals, student enrollments) record timestamped audit trails with user and tenant IDs.
