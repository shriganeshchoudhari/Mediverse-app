# Mediverse Enterprise Architecture Risk Register

```text
Document ID:       MED-RSK-01
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## Architectural Risk Register & Mitigation Strategy

| Risk ID | Identified Risk Scenario | Category | Probability (1-5) | Impact (1-5) | Score (P×I) | Severity | Mitigation Strategy | Owner |
|---|---|---|:---:|:---:|:---:|:---:|---|---|
| **RSK-01** | AI LLM Hallucination of unverified medical drug dosages | AI / Safety | 3 | 5 | 15 | 🔴 HIGH | Mandatory pgvector grounding with cosine threshold $> 0.85$, regex dosage validator, and peer-reviewed citations | AI Architect |
| **RSK-02** | High-poly 3D WebGL meshes crashing mobile GPU memory | Performance | 4 | 3 | 12 | 🟠 MED | Draco geometry compression, KTX2 textures, multi-LOD switching, and `useThreeMemoryCleanup` hooks | 3D Architect |
| **RSK-03** | PostgreSQL connection exhaustion during simultaneous exams | Scalability | 2 | 5 | 10 | 🟠 MED | AWS RDS Proxy / PgBouncer connection pooler + Redis caching of active rubrics | Data Architect |
| **RSK-04** | Cloudflare CDN origin outage causing asset loading failures | Availability | 2 | 5 | 10 | 🟠 MED | Multi-region S3 bucket origin failover with automatic Route 53 health check routing | Infrastructure Lead |
| **RSK-05** | Kafka consumer lag during mass student notification bursts | Reliability | 3 | 3 | 9 | 🟡 LOW | KEDA auto-scaling of consumer pods based on consumer group lag metrics | Platform SRE |
| **RSK-06** | Accidental student PII exposure in centralized Loki logs | Security | 2 | 4 | 8 | 🟡 LOW | Logback pattern maskers redacting emails, tokens, and MRN numbers at source | Security Lead |
