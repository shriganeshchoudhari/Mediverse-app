# Mediverse Enterprise STRIDE Threat Model

```text
Document ID:       MED-SEC-01
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## STRIDE Threat Modeling Matrix

| Threat Category | Target Subsystem | Attack Vector Scenario | Impact | Mitigation Architecture | Residual Risk |
|---|---|---|:---:|---|:---:|
| **Spoofing** | API Gateway & Microservices | Attacker generates forged JWT claims to impersonate Faculty | Critical | Cryptographic RSA-256 validation against Keycloak JWKS endpoint with 60s key caching | 🟢 LOW |
| **Tampering** | S3 3D Assets & Medical Media | Attacker modifies anatomical 3D meshes or exam answer keys | Critical | S3 Object Lock (WORM), SHA-256 file integrity verification, and IAM least-privilege | 🟢 LOW |
| **Repudiation** | OSCE Examination Engine | Student denies taking exam or claims grade was tampered | High | Immutable Kafka event log with millisecond timestamp, student ID, and IP address hash | 🟢 LOW |
| **Info Disclosure** | AI RAG Pipeline & Logs | LLM output or log aggregators leak student PII / PHI | High | Regex PII redaction layer at AI Gateway + Loki log scrapers filter sensitive tokens | 🟢 LOW |
| **Denial of Service** | OSCE Submission & RAG APIs | Massive traffic spike during synchronized university exam | High | Redis Distributed Token Bucket rate limiting + Pod Horizontal Pod Autoscaler (HPA) | 🟢 LOW |
| **Elevation of Privilege**| Multi-Tenant Routing | Student from University A bypasses tenant filter to access University B | Critical | Subdomain & JWT `tenant_id` claim validated at Spring Cloud Gateway and JPA Row-Level Filters | 🟢 LOW |
