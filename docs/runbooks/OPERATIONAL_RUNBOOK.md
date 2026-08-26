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
