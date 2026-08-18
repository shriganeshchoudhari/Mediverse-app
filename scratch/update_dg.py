import re
import os

def read_dg():
    with open('docs/DG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_dg()

    # Split into introductory banner + 75 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in DG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 75)")

    # 1. Enrich Chapter 10 (Managed PostgreSQL & Flyway Migrations)
    chapter_map[10] = r"""
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
"""

    # 2. Enrich Chapter 20 (Local Development Docker Compose Environment)
    chapter_map[20] = r"""
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
"""

    # 3. Enrich Chapter 21 (Backend Multi-Stage Dockerfile)
    chapter_map[21] = r"""
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
"""

    # 4. Enrich Chapter 22 (Frontend Multi-Stage Dockerfile)
    chapter_map[22] = r"""
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
"""

    # 5. Enrich Chapter 23 (Kubernetes Deployment & Health Probes)
    chapter_map[23] = r"""
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
"""

    # 6. Enrich Chapter 27 (Nginx Ingress & SSE Reverse Proxy)
    chapter_map[27] = r"""
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
"""

    # 7. Enrich Chapter 48 (Zero-Downtime Blue/Green Release & Rollbacks)
    chapter_map[48] = r"""
### Chapter 48: Zero-Downtime Blue/Green Release & Rollback Runbooks

**Deployment Architecture & Specification:**
* **Canary Verification Gate:** 5% of production traffic is routed to the new release candidate for 15 minutes.
* **Automated Rollback Triggers:**
  - HTTP $5xx$ error rate exceeds $0.1\%$.
  - Socratic AI SSE stream failure rate exceeds $0.5\%$.
  - End-to-end simulation calculation API P99 latency exceeds $150\text{ms}$.
* **Rollback Command:** `kubectl rollout undo deployment/mediverse-backend -n mediverse-prod`
"""

    # Reassemble complete DG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_dg = "\n\n---\n\n".join(output_parts)
    print(f"Final DG.md length: {len(final_dg)} characters across 75 chapters.")

    with open('docs/DG.md', 'w', encoding='utf-8') as f:
        f.write(final_dg)
    print("Successfully updated docs/DG.md with all deployment manifests and runbooks!")

if __name__ == '__main__':
    main()
