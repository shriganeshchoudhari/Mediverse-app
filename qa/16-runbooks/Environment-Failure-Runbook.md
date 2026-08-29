# Environment Failure Runbook

```text
Document ID:       QA-RUN-004
Title:             Test Environment Outage & Triage Runbook
Version:           1.0.0
Status:            APPROVED
Owner:             DevOps / SRE
```

---

## 1. Immediate Diagnostic Steps
1. Probe healthcheck: `curl -i http://localhost:8080/api/v1/actuator/health`
2. Check container logs: `docker-compose logs --tail=100 backend`
3. Verify PostgreSQL connectivity and Redis connection pool status.
