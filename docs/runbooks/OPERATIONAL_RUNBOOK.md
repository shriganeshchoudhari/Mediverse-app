# Mediverse Operational Incident Response Runbooks

This document provides operational triage procedures, diagnostic commands, and remediation steps for on-call engineers.

---

## Runbook 1: High HTTP 5xx Error Rate (`HighHttpErrorRate`)

### Symptoms
- Prometheus alert: `HighHttpErrorRate` firing (> 5% 5xx responses over 5m).
- Grafana HTTP Error Panel spike.

### Triage Steps
1. Inspect backend logs via Loki / Grafana or docker:
   ```bash
   docker logs --tail 200 mediverse-backend | grep "ERROR"
   ```
2. Verify database connection pool health:
   ```bash
   curl -s http://localhost:8085/actuator/metrics/hikaricp.connections.active
   ```
3. Check PostgreSQL service connectivity on port 5434:
   ```bash
   pg_isready -h localhost -p 5434 -U mediverse_user
   ```

---

## Runbook 2: JVM Heap Pressure & Memory Recovery (`HighJvmHeapUsage`)

### Symptoms
- Prometheus alert: `HighJvmHeapUsage` (> 85% JVM memory used).
- Slow GC pauses causing elevated p95 latency.

### Triage Steps
1. Check JVM heap metrics:
   ```bash
   curl -s http://localhost:8085/actuator/metrics/jvm.memory.used
   ```
2. Trigger GC or inspect heap summary via JMX or actuator metrics.
3. If memory leak is suspected, obtain a heap dump:
   ```bash
   jcmd $(pgrep -f mediverse) GC.heap_dump /tmp/heap_dump.hprof
   ```
4. Restart the Spring Boot container if pods are nearing OOMKilled state.

---

## Runbook 3: AI Tutor Circuit Breaker Tripped (`AICircuitBreakerTripped`)

### Symptoms
- Prometheus alert: `AICircuitBreakerTripped` (Circuit state == OPEN).
- Students receive built-in Socratic fallback responses without live Gemini completions.

### Triage Steps
1. Verify Gemini API quota & key validity:
   - Check Google AI Studio console for rate limits (e.g. 15 RPM free tier limit).
2. If the API key is expired or compromised, rotate via environment variable:
   ```bash
   export GEMINI_API_KEY="new_valid_key_here"
   ```
3. The circuit breaker automatically resets after its 30-second reset timeout.

---

## Runbook 4: Redis Cache Invalidation & Rehydration

### Procedure to flush and reset Redis caches cleanly without downtime:
```bash
# Flush stale curriculum tree caches
redis-cli -h localhost -p 6379 FLUSHDB

# Verify keys are regenerating
redis-cli -h localhost -p 6379 DBSIZE
```

---

## Runbook 5: Database Backup & Restore

### Backup Execution
```bash
docker exec -t mediverse-postgres pg_dump -U mediverse_user -d mediverse_db -F c -b -v -f /var/lib/postgresql/data/backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restore Execution
```bash
docker exec -i mediverse-postgres pg_restore -U mediverse_user -d mediverse_db -v -c /var/lib/postgresql/data/backup_file.dump
```

---

## Runbook 6: Emergency JWT Secret Rotation

### Scenario
A compromised or suspected leaked `JWT_SECRET` (e.g. committed to git or exposed in build logs).

### Impact
All previously issued tokens are invalidated upon restart; active students and faculty will be forced to re-authenticate.

### Execution Steps
1. Generate a cryptographically secure 256-bit base64 secret:
   ```bash
   openssl rand -base64 32
   ```
2. Update the Kubernetes Secret or Docker environment variable:
   ```bash
   # In Kubernetes:
   kubectl create secret generic mediverse-secrets \
     --from-literal=JWT_SECRET="<new_base64_secret>" \
     --dry-run=client -o yaml | kubectl apply -f -

   # In Docker Compose:
   # Update .env file: JWT_SECRET=<new_base64_secret>
   ```
3. Perform a rolling restart of backend and frontend pods:
   ```bash
   kubectl rollout restart deployment/mediverse-backend -n mediverse
   kubectl rollout restart deployment/mediverse-frontend -n mediverse
   ```
4. Verify backend health endpoint responds:
   ```bash
   curl -s http://localhost:8085/actuator/health | grep '"status":"UP"'
   ```

---

## Runbook 7: Elasticsearch Full-Text Curriculum Reindexing

### Scenario
Curriculum search returns stale, corrupted, or missing search results post data migration or ES restart.

### Execution Steps
1. Verify Elasticsearch cluster status:
   ```bash
   curl -s http://localhost:9200/_cluster/health?pretty
   ```
2. Check current curriculum index document count:
   ```bash
   curl -s http://localhost:9200/curriculum_blocks/_count?pretty
   ```
3. If the index is corrupt, delete the existing index:
   ```bash
   curl -X DELETE http://localhost:9200/curriculum_blocks
   ```
4. Trigger full database-to-Elasticsearch reindex via Spring Boot actuator or management endpoint:
   ```bash
   curl -X POST http://localhost:8085/api/v1/curriculum/admin/reindex \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -H "Content-Type: application/json"
   ```
5. Monitor reindex progression until document count matches database row count:
   ```bash
   curl -s http://localhost:9200/curriculum_blocks/_count?pretty
   ```

---

## Runbook 8: Manual Kubernetes Scaling & Traffic Surge Management

### Scenario
Scheduled campus-wide OSCE exam or synchronized university quiz expected to exceed normal traffic patterns.

### Execution Steps
1. Pause HPA to prevent conflicting automated scale-down:
   ```bash
   kubectl scale hpa/mediverse-backend-hpa --replicas=0 -n mediverse
   ```
2. Pre-scale backend pods ahead of peak exam load:
   ```bash
   kubectl scale deployment/mediverse-backend --replicas=10 -n mediverse
   kubectl scale deployment/mediverse-frontend --replicas=6 -n mediverse
   ```
3. Verify all pods are running and passing readiness probes:
   ```bash
   kubectl get pods -n mediverse -l app.kubernetes.io/name=mediverse-backend
   ```
4. Post-event recovery: restore normal HPA autoscaling policies:
   ```bash
   kubectl apply -f k8s/hpa.yaml
   ```
