# Mediverse Deployment Guide (DG)

This master operations manual synthesizes the deployment architectures, infrastructure topologies, security policies, and continuous delivery rules established across the Mediverse enterprise documentation suite (SAD, PRD, SRS, SecDD, APB, etc.).

It acts as the definitive runbook and deployment specification for DevOps, SRE, and Platform Engineering teams.

---

---

### Chapter 1: Deployment Guide Purpose & Scope

**Deployment Architecture & Specification:**
- Scope includes local, dev, staging, and production environments.
- Zero-downtime deployment (ZDD) is mandatory for all production releases (SAD-DEPLOY-001).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 2: Environment Taxonomy

**Deployment Architecture & Specification:**
- **Dev**: Ephemeral namespaces, scaled to zero at night.
- **QA**: Data-masked clones of production data for integration tests.
- **Staging**: Exact 1:1 infrastructure replica of Prod for performance testing.
- **Prod**: Multi-AZ, High-Availability configuration.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 3: Cloud Provider Quotas & Soft Limits Check

**Deployment Architecture & Specification:**
- Ensure AWS limits for VPCs, EIPs, and ALBs are raised.
- GPU instance quotas (e.g., p4d.24xlarge) must be requested weeks in advance for the AI Tutor services.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 4: IAM & Cloud Account Bootstrapping

**Deployment Architecture & Specification:**
- Strict separation of duties. CI/CD runners use scoped IAM roles (OIDC).
- AWS Organizations/GCP Folders used to isolate Prod from Non-Prod billing.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 5: Network Foundation: VPC, Subnets, and NAT

**Deployment Architecture & Specification:**
- 3-Tier Architecture: Public (ALB/WAF), Private (EKS/App), Secure (RDS/Elasticsearch).
- Egress traffic must route through NAT Gateways (no public IPs for internal nodes).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 6: DNS Configuration & Domain Routing

**Deployment Architecture & Specification:**
- Route53/Cloud DNS used for hierarchical domain structure (e.g., `api.mediverse.com`, `admin.mediverse.com`).
- TTLs set to 60 seconds for apex records during migration windows.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 7: Bastion Hosts & Secure Management Access

**Deployment Architecture & Specification:**
- No direct SSH to worker nodes. Use AWS Systems Manager (SSM) Session Manager.
- Bastion access requires MFA and conditional access policies (IP allowlist).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 8: Terraform State Management & Locking

**Deployment Architecture & Specification:**
- State files stored in versioned S3 buckets (encrypted via KMS).
- State locking enforced via DynamoDB tables to prevent concurrent mutations.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 9: Provisioning the Core Network

**Deployment Architecture & Specification:**
- Terraform modules for VPC, Subnets, Security Groups, and Route Tables.
- Enforce `terraform fmt` and `tflint` in CI before plan generation.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 10: Provisioning Managed PostgreSQL Clusters & Flyway Pipeline

**Deployment Architecture & Specification:**
* Deploy Amazon RDS / Cloud SQL PostgreSQL 16 Multi-AZ with `pgvector` extension enabled.
* Schema evolution is strictly managed via 26 sequential Flyway migrations (`V1` to `V26`).
* Database migrations execute as an isolated pre-deployment Kubernetes Job before application rollout:
  ```bash
  # Production Flyway Migration Execution Command
  ./gradlew flywayMigrate \
    -Dflyway.url=jdbc:postgresql://db.mediverse.internal:5432/mediverse_prod \
    -Dflyway.user=mediverse_migration_user \
    -Dflyway.password=${DB_MIGRATION_PASSWORD}
  ```

**Infrastructure & Platform Standards:**
* Automated daily snapshots with 30-day point-in-time recovery (PITR) retention.
* Read replicas provisioned in separate Availability Zones for analytical queries.

---

### Chapter 11: Provisioning Managed Redis Clusters

**Deployment Architecture & Specification:**
- ElastiCache/MemoryDB cluster mode enabled with at least 3 shards.
- At-rest and in-transit encryption mandated (SecDD compliance).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 12: Provisioning Managed Elasticsearch / OpenSearch

**Deployment Architecture & Specification:**
- Multi-node cluster with dedicated master nodes.
- UltraWarm storage enabled for older log indexing (cost optimization).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 13: Provisioning Managed Kafka

**Deployment Architecture & Specification:**
- MSK (Managed Streaming for Apache Kafka) with minimum 3 brokers spread across 3 AZs.
- EBS volume autoscaling configured for storage tiers.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 14: Provisioning Object Storage & IAM Policies

**Deployment Architecture & Specification:**
- S3 buckets for media, backups, and ML models.
- Block Public Access enabled globally. Bucket policies restrict access to VPC endpoints.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 15: Infrastructure Verification & Acceptance Testing

**Deployment Architecture & Specification:**
- Use `terratest` to validate infrastructure creation before application deployments.
- Verify network peering and security group ingress/egress drops.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 16: EKS/GKE Cluster Provisioning

**Deployment Architecture & Specification:**
- Control plane logs shipped to CloudWatch/Stackdriver.
- Nodes deployed in private subnets exclusively.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 17: Node Pool Configuration & Autoscaling

**Deployment Architecture & Specification:**
- Separate node pools: `core` (On-Demand), `batch` (Spot instances), `ai-inference` (GPU).
- Karpenter installed for rapid, cost-optimized node scaling.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 18: Kubernetes Add-ons

**Deployment Architecture & Specification:**
- VPC CNI optimized for high IP density.
- CoreDNS autoscaled based on cluster size (cluster-proportional-autoscaler).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 19: Storage Classes & Persistent Volume Provisioning

**Deployment Architecture & Specification:**
- `gp3` standard for databases, `io2` Block Express for latency-critical Kafka brokers.
- CSI drivers configured with snapshot capabilities.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 20: Local Development & Docker Compose Orchestration

**Deployment Architecture & Specification:**
Developers and QA engineers spin up the entire Mediverse platform locally using `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: mediverse-postgres
    environment:
      POSTGRES_DB: mediverse
      POSTGRES_USER: mediverse
      POSTGRES_PASSWORD: mediverse_local_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mediverse"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: mediverse-redis
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mediverse-backend
    environment:
      SPRING_PROFILES_ACTIVE: local
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mediverse
      SPRING_DATASOURCE_USERNAME: mediverse
      SPRING_DATASOURCE_PASSWORD: mediverse_local_password
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PORT: 6379
    ports:
      - "8085:8085"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mediverse-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8085
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```

---

### Chapter 21: Backend Containerization & Multi-Stage Dockerfile

**Deployment Architecture & Specification:**
The Spring Boot 3.4.1 backend container is compiled on Eclipse Temurin 21 JDK and executed on a hardened Alpine JRE runtime:

```dockerfile
# Stage 1: Build JAR with Gradle 8.5
FROM gradle:8.5-jdk21-alpine AS builder
WORKDIR /app
COPY build.gradle settings.gradle /app/
COPY gradle /app/gradle
COPY src /app/src
RUN gradle bootJar --no-daemon -x test

# Stage 2: Hardened Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

---

### Chapter 22: Frontend Containerization & Next.js Standalone Dockerfile

**Deployment Architecture & Specification:**
The Next.js 14 frontend compiles using Node 20 and exports a lightweight standalone bundle (`output: 'standalone'`):

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Next.js Standalone Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

---

### Chapter 23: Kubernetes Deployment Manifests & Rolling Update Strategy

**Deployment Architecture & Specification:**
Production workloads deploy with zero downtime using rolling updates and Spring Boot Actuator probes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mediverse-backend
  namespace: mediverse-prod
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: mediverse-backend
  template:
    metadata:
      labels:
        app: mediverse-backend
    spec:
      containers:
      - name: backend
        image: mediverse-registry/backend:v1.0.0
        ports:
        - containerPort: 8085
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8085
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8085
          initialDelaySeconds: 20
          periodSeconds: 5
        resources:
          requests:
            cpu: "500m"
            memory: "1Gi"
          limits:
            cpu: "2000m"
            memory: "2Gi"
```

---

### Chapter 24: Vault Kubernetes Authentication

**Deployment Architecture & Specification:**
- Vault Agent sidecars injected via MutatingWebhookConfiguration.
- ServiceAccounts authenticate to Vault to fetch short-lived dynamic credentials.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 25: Service Mesh Installation

**Deployment Architecture & Specification:**
- Istio deployed via IstioOperator.
- Sidecar injection enabled on all application namespaces.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 26: mTLS Enforcement Policies

**Deployment Architecture & Specification:**
- `PeerAuthentication` set to STRICT mode cluster-wide.
- All unencrypted traffic between pods is rejected at the envoy proxy layer.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 27: Ingress Configuration & Server-Sent Events (SSE) Proxying

**Deployment Architecture & Specification:**
Nginx Ingress is specifically configured to support unbuffered token streaming for Socratic AI tutoring:

```nginx
upstream backend_upstream {
    server mediverse-backend.mediverse-prod.svc.cluster.local:8085;
}

server {
    listen 443 ssl http2;
    server_name api.mediverse.edu;

    # Socratic AI Token Streaming Endpoint (Unbuffered SSE)
    location /api/v1/ai-tutor/chat/stream {
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        chunked_transfer_encoding on;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # General REST API Endpoints
    location /api/ {
        proxy_pass http://backend_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Chapter 28: WAF Setup, Rule Attachments

**Deployment Architecture & Specification:**
- OWASP Core Rule Set (CRS) attached to edge ALBs.
- Rate-limiting rules (e.g., 100 req/5min for `/auth/login`).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 29: Container Security Tools

**Deployment Architecture & Specification:**
- Kyverno cluster policies: deny privileged pods, mandate read-only root filesystems, restrict hostPath volumes.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 30: GitOps Philosophy & Repo Structure

**Deployment Architecture & Specification:**
- Separate application code repos from configuration (GitOps) repo.
- Git is the single source of truth; manual `kubectl apply` is forbidden.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 31: Argo CD Installation

**Deployment Architecture & Specification:**
- ArgoCD deployed in High Availability mode.
- Redis cache and repo-server scaled for fast manifest generation.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 32: Argo CD SSO Integration

**Deployment Architecture & Specification:**
- OIDC integrated with Keycloak/Entra ID.
- RBAC: Developers have read-only access, SREs have sync permissions in Prod.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 33: App of Apps Pattern

**Deployment Architecture & Specification:**
- Root ArgoCD application points to directory of other applications for bootstrapping entire clusters from scratch.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 34: CI Pipeline Definitions

**Deployment Architecture & Specification:**
- GitHub Actions linting (Helm, Terraform), building images, running Unit/Integration tests, and pushing to registry.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 35: Container Registry Setup

**Deployment Architecture & Specification:**
- ECR repositories configured with immutable tags.
- Image scanning on-push mandated for CVE detection.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 36: Supply Chain Security

**Deployment Architecture & Specification:**
- Cosign integrates with CI pipeline to sign container images.
- Kyverno admission controller verifies signature before allowing pod scheduling.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 37: PostgreSQL Connection Pooling

**Deployment Architecture & Specification:**
- PgBouncer deployed as a sidecar or lightweight proxy tier.
- Configured in transaction-pooling mode to support thousands of microservice instances.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 38: pgvector Extension Initialization

**Deployment Architecture & Specification:**
- Enable `vector` extension in the PostgreSQL DB via Terraform.
- Set `max_parallel_maintenance_workers` for faster HNSW index building.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 39: Flyway Automated Schema Migrations

**Deployment Architecture & Specification:**
- Init-containers execute Flyway migrations before the main application starts.
- Migration failures crash the pod, halting the ArgoCD sync.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 40: Redis Cache Pre-warming

**Deployment Architecture & Specification:**
- Staging-to-Production cutovers use scheduled jobs to pre-warm Redis with high-traffic course metadata.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 41: Kafka Topic Creation

**Deployment Architecture & Specification:**
- Managed via Terraform `kafka_topic` resources (not auto-created).
- Retention policies set (e.g., 7 days for domain events, 1 day for audit logs).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 42: Elasticsearch Index Template Setup

**Deployment Architecture & Specification:**
- Index Lifecycle Management (ILM) policies push indexes from Hot -> Warm -> Cold nodes after 30 days.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 43: Seeding Administrator Accounts

**Deployment Architecture & Specification:**
- Bootstrapping script injects super-admin credentials dynamically generated via Vault into the Identity DB.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 44: GPU Node Pool Provisioning

**Deployment Architecture & Specification:**
- Taints (`nvidia.com/gpu=present`) and Tolerations ensure only AI workloads schedule on expensive GPU nodes.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 45: vLLM / Inference Engine Deployment

**Deployment Architecture & Specification:**
- Deploy vLLM serving container with Ray for multi-node inference if model exceeds single GPU VRAM.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 46: AI Safety Container Deployment

**Deployment Architecture & Specification:**
- Deployed as a pre-processing proxy ahead of the LLM endpoint.
- Contains local toxicity/PII classifiers.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 47: RAG Pipeline Knowledge Base Initialization

**Deployment Architecture & Specification:**
- Bulk load script fetches approved medical documents and generates embeddings into pgvector.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 48: Zero-Downtime Blue/Green Release & Rollback Runbooks

**Deployment Architecture & Specification:**
* **Canary Verification Gate:** 5% of production traffic is routed to the new release candidate for 15 minutes.
* **Automated Rollback Triggers:**
  - HTTP $5xx$ error rate exceeds $0.1\%$.
  - Socratic AI SSE stream failure rate exceeds $0.5\%$.
  - End-to-end simulation calculation API P99 latency exceeds $150\text{ms}$.
* **Rollback Command:** `kubectl rollout undo deployment/mediverse-backend -n mediverse-prod`

---

### Chapter 49: Setting up AI Token Budgeting

**Deployment Architecture & Specification:**
- Redis-backed rate-limiting Lua scripts track token usage per tenant_id injected at the API Gateway layer.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 50: Application Helm Charts

**Deployment Architecture & Specification:**
- Standardized base Helm chart used by all services.
- Uses `values-<env>.yaml` for environment-specific overrides (replicas, CPU/RAM).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 51: Order of Operations: Domain Services

**Deployment Architecture & Specification:**
- Core infrastructure -> Data stores -> Identity Service -> Supporting Services -> Edge Gateway.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 52: Deploying Edge API Gateways

**Deployment Architecture & Specification:**
- Spring Cloud Gateway or Kong deployed.
- Configured with route definitions mapping `/api/v1/{service}` to internal cluster IPs.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 53: Progressive Delivery: Blue/Green

**Deployment Architecture & Specification:**
- Argo Rollouts manages Blue/Green deployment for Identity/Auth services.
- Traffic cutover happens only after automated smoke tests pass on the preview service.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 54: Progressive Delivery: Canary Release

**Deployment Architecture & Specification:**
- Argo Rollouts Canary step: 10% traffic -> pause 5 mins -> analyze Prometheus error rates -> 50% -> 100%.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 55: Micro-Frontend (MFE) Deployment

**Deployment Architecture & Specification:**
- Webpack Module Federation assets deployed to S3/CloudFront.
- `remoteEntry.js` cache busted on every release.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 56: CDN Invalidations

**Deployment Architecture & Specification:**
- CI/CD pipeline triggers AWS CloudFront invalidation for `/*` after frontend assets are uploaded.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 57: Prometheus & Alertmanager Deployment

**Deployment Architecture & Specification:**
- Kube-Prometheus-Stack deployed.
- Alertmanager configured with routing tree (DevOps -> Slack, SRE -> PagerDuty).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 58: PromQL Rule Configurations

**Deployment Architecture & Specification:**
- Alert on: CPU > 85%, 5xx Error Rate > 1%, Kafka Consumer Lag > 10,000, DB Connections > 90%.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 59: Grafana Dashboard Provisioning

**Deployment Architecture & Specification:**
- Dashboards provisioned as Code (ConfigMaps).
- Standard golden signal dashboards (Latency, Traffic, Errors, Saturation) per service.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 60: Log Aggregation Stack

**Deployment Architecture & Specification:**
- Fluent-bit DaemonSet tails container logs, parses JSON, enriches with Kubernetes metadata, and forwards to Loki.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 61: OpenTelemetry Collector Setup

**Deployment Architecture & Specification:**
- OTel collector deployed as DaemonSet.
- Receives OTLP traces, batches them, and exports to Jaeger/Tempo.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 62: PagerDuty / Slack Integration

**Deployment Architecture & Specification:**
- Critical (P1) alerts bypass Slack and page the on-call SRE directly via PagerDuty webhook.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 63: Chaos Engineering: LitmusChaos

**Deployment Architecture & Specification:**
- Deploy Litmus operator in staging.
- Weekly cron experiments: Pod-delete, Network-latency, Node-drain.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 64: Pre-Flight Checks & PRR

**Deployment Architecture & Specification:**
- Production Readiness Review checklist: Load tests passed, Security scans clean, Runbooks documented, Monitoring active.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 65: Automated Backup Schedules

**Deployment Architecture & Specification:**
- Velero backs up Kubernetes state daily.
- RDS automatic snapshots daily, transaction logs every 5 minutes (Point-in-Time Recovery).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 66: Disaster Recovery Validation Drills

**Deployment Architecture & Specification:**
- Quarterly GameDays to execute cross-region recovery.
- Validate RTO (1h) and RPO (15m) compliance.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 67: Runbook: Zero-Downtime Database Failovers

**Deployment Architecture & Specification:**
- Procedure to promote RDS read replica to primary.
- Instructions to restart PgBouncer to clear connection caches.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 68: Runbook: Vault Seal Recovery

**Deployment Architecture & Specification:**
- Procedure to unseal Vault manually if KMS auto-unseal fails using Shamir's Secret Sharing keys.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 69: Runbook: Cluster Upgrade Strategy

**Deployment Architecture & Specification:**
- In-place EKS upgrade vs Blue/Green cluster migration.
- Cordon/drain nodes gracefully to ensure PodDisruptionBudgets are respected.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 70: Runbook: Emergency Rollback (Application)

**Deployment Architecture & Specification:**
- Instant rollback via ArgoCD UI or `argocd app rollback` CLI command.
- Monitor Canary rollout failure automated rollbacks.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 71: Runbook: Emergency Rollback (Database)

**Deployment Architecture & Specification:**
- Restore from Point-in-Time RDS snapshot.
- Requires brief maintenance window (data loss from snapshot time to present must be accepted or replayed).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 72: FinOps: Kubecost Deployment

**Deployment Architecture & Specification:**
- Kubecost deployed to monitor cost per namespace/tenant.
- Weekly reports sent to engineering managers to identify wasted resources.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 73: Scheduled Maintenance Window SOPs

**Deployment Architecture & Specification:**
- StatusPage updates.
- Route traffic to static 'Under Maintenance' CDN page if global outage is required (rare).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 74: Security Patching Workflow

**Deployment Architecture & Specification:**
- Automated dependency updates (Dependabot/Renovate).
- OS patches applied by rotating Kubernetes AMI nodes (cordon -> drain -> terminate).

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---

---

### Chapter 75: Sign-off & Production Handoff Checklist

**Deployment Architecture & Specification:**
- Architecture review board sign-off.
- InfoSec approval.
- Operations team takes ownership of the on-call rotation.

**Infrastructure & Platform Standards:**
- **AWS & Kubernetes Implementation:** Deployed on AWS EKS 1.30 across 3 Availability Zones (ap-south-1), with managed node groups, AWS Karpenter autoscaling, and Amazon RDS PostgreSQL 16 Multi-AZ with pgvector.
- **Container & Helm Hardening:** Distroless container images running as non-root (USER 65534:65534), read-only root filesystems, strict CPU/Memory resource limits, and Cilium Zero-Trust network policies.
- **Secrets & Ingress:** Credentials dynamically injected via External Secrets Operator from AWS Secrets Manager; ingress managed by AWS ALB Ingress Controller with TLS 1.3 and WAF rate-limiting.

---