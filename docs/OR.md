# Mediverse Operations Runbook (OR)

This 75-chapter runbook provides the exact tactical commands and step-by-step mitigation strategies required by on-call engineers to recover the Mediverse platform from critical failures. It is the execution arm of the Maintenance & Support Guide (MSG).

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

### Chapter 17: Recovery: RDS Point-In-Time-Recovery (PITR)

**Tactical Mitigation & Diagnostic Commands:**
- Use AWS Console. Select DB -> Restore to Point in Time. Note: This creates a NEW cluster. You must update application connection strings via Vault.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 19: Recovery: Rebuilding Corrupted pgvector Index

**Tactical Mitigation & Diagnostic Commands:**
- Connect via psql.
- Command: `REINDEX INDEX CONCURRENTLY my_hnsw_idx;`

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 23: Recovery: Resetting Kafka Consumer Group Offsets

**Tactical Mitigation & Diagnostic Commands:**
- Command: `kafka-consumer-groups.sh --bootstrap-server <broker> --group <group> --topic <topic> --reset-offsets --to-latest --execute`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 25: Mitigation: Forcing Elasticsearch Index Routing

**Tactical Mitigation & Diagnostic Commands:**
- Command: `POST /_cluster/reroute?retry_failed=true` to force cluster to attempt allocating failed shards again.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 27: Mitigation: Bypassing Istio mTLS for Debugging

**Tactical Mitigation & Diagnostic Commands:**
- Command: `kubectl exec -it <pod> -c istio-proxy -- curl localhost:15000/config_dump` to view envoy routing rules.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 30: Triage: 502 Bad Gateway from Spring Cloud

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Check downstream service readiness probes. 502 means the gateway cannot reach the target pod IP.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 33: Mitigation: Purging CDN Edge Caches

**Tactical Mitigation & Diagnostic Commands:**
- Command (AWS CLI): `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 35: Recovery: Rotating Compromised JWT Signing Keys

**Tactical Mitigation & Diagnostic Commands:**
- Command: Generate new RSA keypair in Vault. Rotate Keycloak Realm Keys. All existing user sessions will immediately invalidate (requires re-login).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 39: Recovery: Restoring Deleted RBAC RoleBindings

**Tactical Mitigation & Diagnostic Commands:**
- Command: Sync ArgoCD. GitOps is the source of truth, it will instantly recreate deleted RBAC rules.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

### Chapter 40: Mitigation: Quarantining a Compromised Pod

**Tactical Mitigation & Diagnostic Commands:**
- Apply `NetworkPolicy` dropping all ingress/egress except to forensic tools. Leave the pod running (do not delete) for malware analysis.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 44: Triage: RAG Vector Search Returning Irrelevant Context

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Verify embedding model used for query matches the model used during document ingestion (e.g., Ada-002 vs text-embedding-3-small).

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 46: Recovery: Rolling Back an A/B Prompt Test

**Tactical Mitigation & Diagnostic Commands:**
- Change the Unleash/LaunchDarkly feature flag state to 0% rollout. No code deployment required.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 49: Recovery: Hard Reverting Argo CD via Git

**Tactical Mitigation & Diagnostic Commands:**
- Command: `git revert <bad-commit-hash>` -> `git push origin main`. ArgoCD will auto-sync to the healthy state.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---

### Chapter 50: Recovery: Deleting a Stuck Helm Release Secret

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: ArgoCD complains 'another operation is in progress'.
- Command: `kubectl delete secret -l name=<release-name>,status=pending-upgrade -n <namespace>`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 52: Triage: GitHub Actions Runner Queue Backlog

**Tactical Mitigation & Diagnostic Commands:**
- Mitigation: Scale up self-hosted runner auto-scaling group (ASG) max capacity in AWS.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 54: Recovery: Re-pushing Lost Container Image

**Tactical Mitigation & Diagnostic Commands:**
- Re-run the specific GitHub Action workflow for the missing commit hash to rebuild and push the image.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 56: DR Execution: Updating Global Route53 Policies

**Tactical Mitigation & Diagnostic Commands:**
- Use Route53 Application Recovery Controller to shift 100% of traffic to the `us-west-2` DR cluster.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 58: P0 Drill: Ransomware / Mass Data Deletion

**Tactical Mitigation & Diagnostic Commands:**
- Instantly revoke all AWS/GCP IAM roles. Assume the control plane is compromised.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 60: Recovery: Re-deploying EKS from Scratch

**Tactical Mitigation & Diagnostic Commands:**
- Run `terraform apply` in the DR environment. ArgoCD will bootstrap the entire cluster in ~15 minutes once nodes are online.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 62: P0 Drill: Global DNS Hijacking

**Tactical Mitigation & Diagnostic Commands:**
- Log into Registrar (e.g., MarkMonitor/GoDaddy). Enable Registrar Lock. Rotate Registrar passwords. Re-point NS records back to Route53.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 65: Mitigation: Loki Log Ingestion Backpressure

**Tactical Mitigation & Diagnostic Commands:**
- Symptom: Fluent-bit dropping logs.
- Mitigation: Scale up Loki ingester statefulset. Check S3 write limits.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 67: Mitigation: PagerDuty Webhook Failures

**Tactical Mitigation & Diagnostic Commands:**
- Ensure Alertmanager has the correct Integration Key. Test via `amtool alert add alertname=TestAlert`.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 69: Mitigation: Twilio/SendGrid Down

**Tactical Mitigation & Diagnostic Commands:**
- Fall back to secondary provider (e.g., AWS SES) by changing the active provider ENV variable in Vault and restarting the Notification service.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 71: Mitigation: AWS IAM Control Plane Outage

**Tactical Mitigation & Diagnostic Commands:**
- Note: Existing cached credentials will work. New Pods relying on IRSA will fail to start. Freeze all deployments until AWS recovers.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 73: Mitigation: Datadog/NewRelic Total Outage

**Tactical Mitigation & Diagnostic Commands:**
- Fall back to native Kubernetes commands: `kubectl top nodes`, `kubectl get events`, and raw application logs.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

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

### Chapter 75: End-of-Incident: Exporting Audit Logs

**Tactical Mitigation & Diagnostic Commands:**
- Run bash scripts to collect all `kubectl` history, Slack chat transcripts, and Datadog snapshots for the Post-Incident Review (PIR) document.

**Emergency SRE Execution Steps:**
- **Step 1 (Triage & Diagnosis):** Inspect relevant Kubernetes pod logs via `kubectl logs -n production -l app=<service-name> --tail=100` and query Grafana Loki.
- **Step 2 (Isolation & Circuit Breaking):** If downstream dependencies (e.g. LLM API or database connection pool) are saturated, activate circuit breakers or scale pod replicas.
- **Step 3 (Mitigation & Recovery):** Execute zero-downtime rolling restart (`kubectl rollout restart deployment/<service-name> -n production`) or trigger automated RDS failover if necessary.
- **Step 4 (Post-Mitigation Verification):** Validate synthetic uptime probes and ensure latency and error rates return to normal baseline.

---
