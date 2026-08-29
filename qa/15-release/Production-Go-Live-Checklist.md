# Production Go-Live Checklist

```text
Document ID:       QA-REL-002
Title:             Production Deployment Execution Checklist
Version:           1.0.0
Status:            APPROVED
Owner:             Release Manager & DevOps Lead
```

---

## Deployment Window Steps (T-0)
1. **Pre-Deploy:** Verify active database backup snapshot completed.
2. **Deploy:** Apply Flyway schema migrations and deploy backend & frontend containers.
3. **Health Verification:** Execute healthcheck endpoint `GET /api/v1/actuator/health`.
4. **Post-Deploy Smoke:** Trigger automated production smoke workflow (`production-smoke.yml`).
5. **Monitor:** Observe Prometheus error rate & latency for 30 minutes.
