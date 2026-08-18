# Mediverse Operations Runbook (OR)

This 75-chapter runbook provides the exact tactical commands and step-by-step mitigation strategies required by on-call engineers to recover the Mediverse platform from critical failures. It is the execution arm of the Maintenance & Support Guide (MSG).

---

---

### Chapter 1: How to Use This Runbook During an Incident

**Tactical Mitigation & Diagnostic Commands:**
- DO NOT execute commands unless you understand them.
- Always copy-paste commands into a text editor first to verify variables like `$POD_NAME`.
- Log all executed commands in the Incident Slack Channel.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 2: Emergency Break-Glass Access

**Tactical Mitigation & Diagnostic Commands:**
- If SSO is down, use the Break-Glass AWS IAM User `mediverse-breakglass-admin` stored in the physical office safe.
- Command: `aws sts get-caller-identity --profile breakglass`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 3: Connecting to the Bastion Host

**Tactical Mitigation & Diagnostic Commands:**
- Command: `aws ssm start-session --target i-0abcd1234efgh5678`.
- All session activity is logged to CloudWatch.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 4: Unsealing HashiCorp Vault

**Tactical Mitigation & Diagnostic Commands:**
- If KMS auto-unseal fails, collect 3 of 5 Shamir keys from senior engineers.
- Command: `vault operator unseal <key1>` -> repeat 3 times.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 5: Fetching Dynamic DB Credentials from Vault

**Tactical Mitigation & Diagnostic Commands:**
- Command: `vault read database/creds/readonly-role`.
- Credential TTL is 1 hour.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 6: Executing kubectl Across EKS Clusters

**Tactical Mitigation & Diagnostic Commands:**
- Update kubeconfig: `aws eks update-kubeconfig --region us-east-1 --name prod-mediverse-cluster`.
- Verify context: `kubectl config current-context`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 7: Triage: VPC NAT Gateway Exhaustion

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Intermittent timeout reaching external APIs.
- Mitigation: Check CloudWatch `ErrorPortAllocation` metric. Scale up to multiple NAT Gateways per AZ if spiking.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 8: Triage: AWS Route53 Resolution Failures

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: `NXDOMAIN` for `api.mediverse.com`.
- Mitigation: Verify NS records in registrar match Route53 Hosted Zone delegation set.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 9: Recovery: Replacing a Dead Kubernetes Node

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Node status `NotReady`.
- Command: `kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data`.
- Karpenter will automatically provision a replacement.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 10: Recovery: Restarting Stalled EKS Control Plane

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: `kubectl` commands timeout.
- Mitigation: Escalation to AWS Support (Enterprise level) is required. Customers cannot restart the managed control plane directly.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 11: Mitigation: EKS Subnet IP Exhaustion

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Pods stuck in `ContainerCreating` with `FailedCreatePodSandBox`.
- Command: Check ENI capacity. Enable AWS VPC CNI Custom Networking to map pods to secondary CIDR blocks.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 12: Mitigation: Ingress Controller Dropping Traffic

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: 504 Gateway Timeout at ALB.
- Command: `kubectl logs -n ingress-nginx deployment/ingress-nginx-controller`. Check for config reload failures.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 13: Mitigation: ExternalDNS Failing

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: New subdomains not resolving.
- Command: `kubectl logs -n kube-system deployment/external-dns`. Check IRSA IAM permissions for `route53:ChangeResourceRecordSets`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 14: Mitigation: Cert-Manager Let's Encrypt Limits

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Certificate stuck in `Issuing` state.
- Command: `kubectl describe challenge <name>`. If rate-limited by LE, wait 168 hours or switch to ZeroSSL issuer.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 15: Recovery: Promoting RDS Read-Replica to Primary

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Primary DB dead, automated failover failed.
- Command (AWS CLI): `aws rds promote-read-replica --db-instance-identifier <replica-id>`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 16: Mitigation: Killing Runaway PostgreSQL Queries

**Tactical Mitigation & Diagnostic Commands:**
- Connect via psql.
- Identify: `SELECT pid, query FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';`
- Kill: `SELECT pg_terminate_backend(<pid>);`

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 17: Recovery: RDS Point-In-Time-Recovery (PITR)

**Tactical Mitigation & Diagnostic Commands:**
- Use AWS Console. Select DB -> Restore to Point in Time. Note: This creates a NEW cluster. You must update application connection strings via Vault.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 18: Mitigation: PgBouncer Pool Exhaustion

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: `psql: error: FATAL: remaining connection slots are reserved`.
- Mitigation: Increase `max_client_conn` in PgBouncer ConfigMap and `kubectl rollout restart deploy/pgbouncer`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 19: Recovery: Rebuilding Corrupted pgvector Index & Slow Query Triage

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Socratic AI chat latency spikes $> 3.0\text{s}$ or throws `ERROR: hnsw index graph corrupted`.
* **Diagnostic Query:**
  ```sql
  EXPLAIN ANALYZE 
  SELECT document_source, chapter_title, chunk_text, (embedding <=> '[0.012, -0.045, ...]'::vector) AS distance
  FROM aitutor.embeddings_metadata 
  ORDER BY distance ASC LIMIT 5;
  ```
* **Tactical Rebuild Command:**
  ```sql
  -- Increase maintenance memory and rebuild HNSW graph concurrently
  SET maintenance_work_mem = '1GB';
  REINDEX INDEX CONCURRENTLY aitutor.idx_embeddings_hnsw;
  VACUUM (ANALYZE, VERBOSE) aitutor.embeddings_metadata;
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Check PostgreSQL log entries for deadlocks or out-of-memory errors during vector indexing.
* **Step 2 (Isolation & Circuit Breaking):** Temporarily fall back to keyword-based full-text search (`tsvector`) if vector queries lock.
* **Step 3 (Mitigation & Recovery):** Execute `REINDEX INDEX CONCURRENTLY` to restore the HNSW cosine graph without blocking read queries.
* **Step 4 (Post-Mitigation Verification):** Validate vector query latency returns to P95 $< 15\text{ms}$.

---

### Chapter 20: Recovery: Redis ElastiCache Failover

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Redis unresponsive.
- Mitigation: AWS auto-fails over. If stuck, use AWS Console to trigger manual failover to replica.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 21: Mitigation: Flushing Redis Caches (Emergency)

**Tactical Mitigation & Diagnostic Commands:**
- Connect via `redis-cli`.
- Command: `FLUSHALL ASYNC` (Warning: Causes massive DB load spike as cache rebuilds).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 22: Mitigation: Expanding Kafka EBS Volumes

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Disk > 90% full.
- Mitigation: Trigger MSK Storage Auto-scaling via AWS Console. Note: Takes hours to redistribute partitions.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 23: Recovery: Resetting Kafka Consumer Group Offsets

**Tactical Mitigation & Diagnostic Commands:**
- Command: `kafka-consumer-groups.sh --bootstrap-server <broker> --group <group> --topic <topic> --reset-offsets --to-latest --execute`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 24: Mitigation: Elasticsearch Cluster Status Red

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Primary shards unassigned.
- Command: `GET /_cluster/allocation/explain`. Check disk watermarks (flood stage).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 25: Triage: Spring Boot JVM Heap Exhaustion & HikariCP Leaks

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Spring Boot backend pod restarts with `OOMKilled` (Exit Code 137) or HTTP 500 `Connection is not available`.
* **Diagnostic Commands:**
  ```bash
  # Check HikariCP connection pool metrics
  curl -s http://localhost:8085/actuator/metrics/hikaricp.connections.pending
  curl -s http://localhost:8085/actuator/metrics/hikaricp.connections.active

  # Generate live thread dump to detect connection leaks
  kubectl exec -it <backend-pod-name> -n mediverse-prod -- jcmd 1 Thread.print > /tmp/thread_dump.txt
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Inspect HikariCP active vs. idle connection gauges in Grafana.
* **Step 2 (Isolation & Circuit Breaking):** Scale backend replica set from 3 to 6 pods to distribute incoming connection pressure.
* **Step 3 (Mitigation & Recovery):** Perform rolling pod restart to release leaked database handles (`kubectl rollout restart deployment/mediverse-backend -n mediverse-prod`).
* **Step 4 (Post-Mitigation Verification):** Confirm pending connection requests drop to 0.

---

### Chapter 26: Mitigation: Restarting a Deadlocked Microservice

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Liveness probe failing, pod not restarting automatically.
- Command: `kubectl rollout restart deployment/<service-name> -n <namespace>`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 27: Mitigation: Bypassing Istio mTLS for Debugging

**Tactical Mitigation & Diagnostic Commands:**
- Command: `kubectl exec -it <pod> -c istio-proxy -- curl localhost:15000/config_dump` to view envoy routing rules.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 28: Mitigation: Increasing Pod Memory Limits

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: CrashLoopBackOff with OOMKilled.
- Command: `kubectl patch deployment <name> -p '{"spec":{"template":{"spec":{"containers":[{"name":"<container>","resources":{"limits":{"memory":"2Gi"}}}]}}}}'`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 29: Mitigation: Adjusting HPA Minimums

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Traffic spike overwhelming current pod count before scale-up completes.
- Command: `kubectl patch hpa <name> -p '{"spec":{"minReplicas": 10}}'`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 30: Triage: 502 Bad Gateway from Spring Cloud

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Check downstream service readiness probes. 502 means the gateway cannot reach the target pod IP.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 31: Triage: Resilience4j Circuit Breakers Tripping

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Intermittent 503 Service Unavailable.
- Mitigation: Check `/actuator/health` to see circuit breaker state. Fix the downstream service causing the latency.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 32: Recovery: MFE S3 Cache Invalidation Failure

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Users seeing blank pages after frontend release.
- Mitigation: Manually create CloudFront invalidation for `/*`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 33: Mitigation: Purging CDN Edge Caches

**Tactical Mitigation & Diagnostic Commands:**
- Command (AWS CLI): `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 34: Mitigation: Identity Provider (Keycloak) Outage

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Scale up Keycloak replicas. If DB corrupted, initiate PITR for the Identity DB.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 35: Mitigation: Socratic AI SSE Stream Buffer Stalls & LLM 429 Outages

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Student Socratic AI drawer displays spinning loader without rendering streamed tokens.
* **Diagnostic Command:**
  ```bash
  # Verify backend produces unbuffered text/event-stream chunks
  curl -i -N -H "Accept: text/event-stream" \
    -H "Authorization: Bearer ${TEST_JWT}" \
    -X POST https://api.mediverse.edu/api/v1/ai-tutor/chat/stream \
    -d '{"message":"What is preload?","topicContext":"cardiovascular"}'
  ```
* **Verify Response Headers:** Ensure `X-Accel-Buffering: no` and `Content-Type: text/event-stream` are present.

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Inspect Nginx ingress logs for `upstream prematurely closed connection`.
* **Step 2 (Isolation & Circuit Breaking):** If upstream LLM returns HTTP 429, activate exponential backoff and route to secondary backup model.
* **Step 3 (Mitigation & Recovery):** Reload Nginx ingress if proxy buffering was erroneously re-enabled (`nginx -s reload`).
* **Step 4 (Post-Mitigation Verification):** Confirm first-token streaming latency drops below $800\text{ms}$.

---

### Chapter 36: Mitigation: Revoking Specific User Active Sessions

**Tactical Mitigation & Diagnostic Commands:**
- Command: `curl -X POST https://auth.mediverse.com/admin/realms/mediverse/users/<id>/logout`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 37: Mitigation: WAF Blocking Valid Traffic (False Positive)

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Valid users getting HTTP 403 from WAF.
- Mitigation: Check WAF Sampled Requests. Add the triggered Rule ID to the exception list temporarily.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 38: Triage: Istio AuthorizationPolicy Rejecting Traffic

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: `RBAC: access denied`.
- Mitigation: Check the specific `AuthorizationPolicy` applied to the target namespace. Ensure source namespaces are allowed.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 39: Recovery: Restoring Deleted RBAC RoleBindings

**Tactical Mitigation & Diagnostic Commands:**
- Command: Sync ArgoCD. GitOps is the source of truth, it will instantly recreate deleted RBAC rules.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 40: Mitigation: 3D WebGL Draco Mesh CDN Cache Invalidation

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Students receive 404 or corrupted binary errors loading 3D heart, lung, or kidney meshes.
* **Tactical Invalidation Command:**
  ```bash
  # Invalidate CloudFront CDN cache for all 3D GLB assets and textures
  aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
    --paths "/models/*" "/textures/*" "/draco/*"
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Verify S3 bucket asset checksums (`aws s3 ls s3://mediverse-assets-prod/models/`).
* **Step 2 (Isolation & Circuit Breaking):** Invalidate edge cache to flush stale or corrupted binary chunks.
* **Step 3 (Mitigation & Recovery):** Purge browser IndexedDB cache on affected client sessions.
* **Step 4 (Post-Mitigation Verification):** Test 3D organ load time in browser incognito window ($< 1.5\text{s}$).

---

### Chapter 41: Mitigation: vLLM Inference Pod OOM (CUDA Out of Memory)

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: vLLM logs show `CUDA out of memory`.
- Mitigation: Decrease `gpu_memory_utilization` parameter in vLLM config or reduce max batch size. Restart pod.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 42: Recovery: Forcing AI Model Weight Re-Download

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Corrupt `.safetensors` files on Persistent Volume.
- Command: Scale deployment to 0. Delete the PVC. Scale deployment back up to trigger fresh download from HuggingFace.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 43: Mitigation: AI Tutor Safety Container Rejecting All

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Guardrails blocking 100% of prompts.
- Mitigation: Bypass safety container by pointing the Edge Gateway route directly to the vLLM pod temporarily (Emergency Only).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 44: Triage: RAG Vector Search Returning Irrelevant Context

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Verify embedding model used for query matches the model used during document ingestion (e.g., Ada-002 vs text-embedding-3-small).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 45: Mitigation: AI Tenant Token Quota Exhaustion

**Tactical Mitigation & Diagnostic Commands:**
- Command: Use Admin API to increase quota. `curl -X PATCH /api/v1/tenants/<id>/quota -d '{"token_limit_increase": 500000}'`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 46: Recovery: Rolling Back an A/B Prompt Test

**Tactical Mitigation & Diagnostic Commands:**
- Change the Unleash/LaunchDarkly feature flag state to 0% rollout. No code deployment required.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 47: Mitigation: Redis Rate Limiter Blocking OpenAI Calls

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: HTTP 429 from internal proxy.
- Command: `redis-cli DEL rate_limit:openai_api`. Allows traffic to burst until limit recalculates.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 48: Mitigation: Argo CD Sync Stuck Progressing

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Deployment won't finish.
- Mitigation: Check `kubectl get events`. Usually a PVC cannot bind or a Node doesn't have capacity. Fix underlying infra issue.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 49: Recovery: Hard Reverting Argo CD via Git

**Tactical Mitigation & Diagnostic Commands:**
- Command: `git revert <bad-commit-hash>` -> `git push origin main`. ArgoCD will auto-sync to the healthy state.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 50: Triage: IMS Global LTI 1.3 OIDC State Nonce & Clock Skew Errors

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** University LMS users fail launch with `401 Unauthorized: Invalid Token Signature` or `State Nonce Expired`.
* **Diagnostic Command:**
  ```bash
  # Check university LMS JWKS public key endpoint reachability
  curl -v -m 5 https://canvas.university.edu/.well-known/jwks.json
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Inspect backend JWT validation logs for `JwtValidationException: token was issued in the future`.
* **Step 2 (Isolation & Circuit Breaking):** If clock skew is detected between AWS and university servers, apply a 60-second timestamp leeway in `Lti13SecurityConfig.java`.
* **Step 3 (Mitigation & Recovery):** Re-sync server NTP time daemon (`chronyd -q 'server pool.ntp.org iburst'`).
* **Step 4 (Post-Mitigation Verification):** Execute synthetic LTI 1.3 OIDC test launch from Canvas sandbox.

---

### Chapter 51: Mitigation: Argo Rollouts Canary Failing to Abort

**Tactical Mitigation & Diagnostic Commands:**
- Command: `kubectl argo rollouts abort <rollout-name>` to instantly route 100% traffic back to the stable version.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 52: Triage: GitHub Actions Runner Queue Backlog

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Scale up self-hosted runner auto-scaling group (ASG) max capacity in AWS.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 53: Mitigation: Cosign Verification Failure in Prod

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Kyverno blocking pod creation (unsigned image).
- Mitigation: Re-run the CI pipeline to generate a fresh signature and push to OCI registry.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 54: Recovery: Re-pushing Lost Container Image

**Tactical Mitigation & Diagnostic Commands:**
- Re-run the specific GitHub Action workflow for the missing commit hash to rebuild and push the image.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 55: P0 Drill: Total Loss of Primary AWS Region

**Tactical Mitigation & Diagnostic Commands:**
- Declare P0. Notify Executive team. Prepare for cross-region failover (RTO: 1 hour).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 56: DR Execution: Updating Global Route53 Policies

**Tactical Mitigation & Diagnostic Commands:**
- Use Route53 Application Recovery Controller to shift 100% of traffic to the `us-west-2` DR cluster.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 57: DR Execution: Failing over Global Aurora

**Tactical Mitigation & Diagnostic Commands:**
- In AWS Console, select the Global Database. Choose 'Fail over global database' to promote the `us-west-2` secondary cluster to primary.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 58: P0 Drill: Ransomware / Mass Data Deletion

**Tactical Mitigation & Diagnostic Commands:**
- Instantly revoke all AWS/GCP IAM roles. Assume the control plane is compromised.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 59: Recovery: Restoring S3 from Object Lock

**Tactical Mitigation & Diagnostic Commands:**
- Object Lock (WORM) prevents deletions. Use an AWS Support ticket to recover the previous versions of the S3 bucket objects.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 60: Recovery: Re-deploying EKS from Scratch

**Tactical Mitigation & Diagnostic Commands:**
- Run `terraform apply` in the DR environment. ArgoCD will bootstrap the entire cluster in ~15 minutes once nodes are online.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 61: P0 Drill: Insider Deleting GitOps Repository

**Tactical Mitigation & Diagnostic Commands:**
- Restore the GitOps repository from GitHub/GitLab automated backups or a developer's local `.git` clone.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 62: P0 Drill: Global DNS Hijacking

**Tactical Mitigation & Diagnostic Commands:**
- Log into Registrar (e.g., MarkMonitor/GoDaddy). Enable Registrar Lock. Rotate Registrar passwords. Re-point NS records back to Route53.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 63: Mitigation: Prometheus Scrape Loops Failing

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Blanks on Grafana dashboards.
- Command: Check Prometheus targets `http://<prometheus-ip>:9090/targets`. Ensure ServiceMonitors are matching valid labels.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 64: Mitigation: Grafana Dashboards Failing to Load

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Grafana UI timeout.
- Mitigation: Restart Grafana pods. If persistent, scale up the internal Grafana PostgreSQL DB.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 65: Recovery: Zero-Downtime Database Multi-AZ Emergency Failover

**Tactical Mitigation & Diagnostic Commands:**
* **Symptom:** Amazon RDS Primary instance unresponsive or suffering unrecoverable storage degradation.
* **Tactical Failover Command:**
  ```bash
  # Force immediate Multi-AZ failover to standby replica in ap-south-1b
  aws rds reboot-db-instance \
    --db-instance-identifier mediverse-prod-db \
    --force-failover
  ```

**Emergency SRE Execution Steps:**
* **Step 1 (Triage & Diagnosis):** Check RDS CloudWatch `DatabaseConnections` and `ReadIOPS` spikes.
* **Step 2 (Isolation & Circuit Breaking):** Trigger automated Multi-AZ failover; DNS CNAME automatically updates within 60 seconds.
* **Step 3 (Mitigation & Recovery):** Monitor backend HikariCP connection recovery as pods re-establish JDBC pools to the new primary.
* **Step 4 (Post-Mitigation Verification):** Validate API health probes (`/actuator/health`) return HTTP 200 `UP`.

---

### Chapter 66: Mitigation: OpenTelemetry Collector OOM Crashing

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Increase memory limits on the OTel DaemonSet. Enable batch processing in the OTel config pipeline.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 67: Mitigation: PagerDuty Webhook Failures

**Tactical Mitigation & Diagnostic Commands:**
- Ensure Alertmanager has the correct Integration Key. Test via `amtool alert add alertname=TestAlert`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 68: Mitigation: Stripe API Down

**Tactical Mitigation & Diagnostic Commands:**
- Disable payment features via Feature Flag. Provide user-friendly 'Billing system under maintenance' UI banner.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 69: Mitigation: Twilio/SendGrid Down

**Tactical Mitigation & Diagnostic Commands:**
- Fall back to secondary provider (e.g., AWS SES) by changing the active provider ENV variable in Vault and restarting the Notification service.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 70: Mitigation: OpenAI/Anthropic Total Outage

**Tactical Mitigation & Diagnostic Commands:**
- In LaunchDarkly, toggle the `USE_LOCAL_VLLM_FALLBACK` flag. AI quality degrades but remains available.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 71: Mitigation: AWS IAM Control Plane Outage

**Tactical Mitigation & Diagnostic Commands:**
- Note: Existing cached credentials will work. New Pods relying on IRSA will fail to start. Freeze all deployments until AWS recovers.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 72: Mitigation: GitHub Outage

**Tactical Mitigation & Diagnostic Commands:**
- Cannot deploy via GitOps. If critical hotfix needed, compile container locally, push to ECR, and manually `kubectl set image` (Must revert later).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 73: Mitigation: Datadog/NewRelic Total Outage

**Tactical Mitigation & Diagnostic Commands:**
- Fall back to native Kubernetes commands: `kubectl top nodes`, `kubectl get events`, and raw application logs.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 74: Mitigation: LMS SSO Outage (Canvas/Blackboard)

**Tactical Mitigation & Diagnostic Commands:**
- Post status update to affected institutional tenants. Mediverse cannot mitigate third-party SSO failures.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

---

### Chapter 75: End-of-Incident: Exporting Audit Logs

**Tactical Mitigation & Diagnostic Commands:**
- Run bash scripts to collect all `kubectl` history, Slack chat transcripts, and Datadog snapshots for the Post-Incident Review (PIR) document.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---