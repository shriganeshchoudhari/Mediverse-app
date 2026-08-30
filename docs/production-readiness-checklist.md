# Mediverse Production Readiness Checklist

```text
Document ID:       MED-OPS-01
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## 50-Point Production Verification Gate

### 1. Application & Domain Architecture
- [x] **DDD Boundaries:** All microservices map to distinct bounded contexts with zero cross-database table joins.
- [x] **Connection Pooling:** HikariCP configured with `maximumPoolSize = 20`, `connectionTimeout = 30000ms`, and leak detection.
- [x] **Graceful Shutdown:** `server.shutdown: graceful` enabled with `timeout-per-shutdown-phase = 30s`.
- [x] **Idempotency:** All POST/PUT mutating APIs and Kafka consumers enforce idempotent message deduplication.

### 2. Resilience & Reliability
- [x] **PodDisruptionBudgets:** `minAvailable = 1` declared on all multi-replica deployments.
- [x] **Health Probes:** Distinct `/actuator/health/readiness`, `/actuator/health/liveness`, and `/actuator/health/startup` probes configured.
- [x] **Circuit Breakers:** Resilience4j circuit breakers and rate limiters active on all external AI and cloud dependencies.
- [x] **Transactional Outbox:** Kafka producers emit domain events strictly via transactional outbox tables.

### 3. Zero-Trust Security
- [x] **NetworkPolicies:** Kubernetes default-deny rules active across all application namespaces.
- [x] **Secrets Management:** External Secrets Operator (ESO) syncing from AWS Secrets Manager / Vault. Zero plain-text credentials in Git.
- [x] **SAST & Vulnerability Gates:** GitHub Actions pipelines fail on any Critical or High CVE findings (Semgrep, Trivy).
- [x] **Identity & MFA:** Keycloak OIDC authentication enforced with TOTP MFA required for faculty and admin roles.

### 4. Observability & SRE
- [x] **Distributed Tracing:** OpenTelemetry W3C trace context propagated across HTTP, gRPC, and Kafka headers.
- [x] **Metrics Collection:** Prometheus scraping Spring Boot Actuator endpoints every 15 seconds.
- [x] **Dashboards:** 15-panel Grafana KPI dashboard active tracking SLOs, error budgets, and P95 latencies.
- [x] **Alerting:** Alertmanager routing S1 critical incidents to Slack `#qa-alerts` and on-call rotation.

### 5. Disaster Recovery & Backups
- [x] **Database PITR:** Aurora PostgreSQL continuous automated backups enabled with 35-day retention.
- [x] **Cross-Region Replication:** Asynchronous Aurora storage replication and S3 CRR active to DR region (`ap-southeast-1`).
- [x] **RTO/RPO Compliance:** Disaster recovery drill validated under $15\text{ mins}$ RTO and $< 1\text{ min}$ RPO.
