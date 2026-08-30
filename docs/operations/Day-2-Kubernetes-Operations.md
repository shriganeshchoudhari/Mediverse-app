# Mediverse Day-2 Kubernetes Operations & SRE Runbook

```text
Document ID:       MED-OPS-02
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## 1. Day-2 Operational Scope

This runbook defines standard operational procedures for managing the Mediverse Kubernetes (EKS) cluster, scaling workloads, executing backups, and managing incidents.

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: Manual Pod Scale-Out (Exam Flash-Mob Event)
```bash
# Temporarily override HPA minimums for OSCE Exam Engine prior to nationwide exam
kubectl scale deployment/assessment-service --replicas=10 -n mediverse-app
kubectl get hpa assessment-service-hpa -n mediverse-app
```

### SOP-02: Database Connection Pool Drain & RDS Failover Test
```bash
# Trigger manual failover of Amazon Aurora PostgreSQL cluster
aws rds failover-db-cluster --db-cluster-identifier mediverse-aurora-prod --region ap-south-1

# Monitor application error rate on Grafana
# Target: Zero connection leakage, failover completion < 25s
```

### SOP-03: Kafka Consumer Group Lag Investigation
```bash
# Check lag across all partitions for learning progress consumers
kubectl exec -it kafka-cluster-0 -n kafka-system -- \
  bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --describe --group gamification-progress-consumer-group
```

### SOP-04: Emergency Secret Rotation
```bash
# Force External Secrets Operator to immediately re-sync from AWS Secrets Manager
kubectl annotate externalsecret mediverse-app-secrets -n mediverse-app force-sync=$(date +%s) --overwrite
```
