import re
import os

def read_dig():
    with open('docs/DIG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=#\s+DevOps & Infrastructure|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def main():
    text = read_dig()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in DIG.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    print(f"Unique chapters found: {len(chapter_map)} (expected 70)")

    # 1. Enhance Chapter 3 (Cloud Topology)
    if 3 in chapter_map:
        chap3_addition = r"""
---

# 3.10 Production Cloud Topology & Multi-AZ AWS Infrastructure Blueprint

### DIR-0045: Production Infrastructure Blueprint
* **Primary Cloud Region:** AWS `ap-south-1` across Availability Zones `ap-south-1a`, `ap-south-1b`, and `ap-south-1c`.
* **Secondary Disaster Recovery Region:** AWS `eu-central-1` (warm standby pilot light).
* **Managed Kubernetes:** Amazon EKS 1.30 with AWS Karpenter dynamic node autoscaling.
* **Managed Relational Database:** Amazon RDS PostgreSQL 16 Multi-AZ with `pgvector` extension enabled.
* **Distributed Ingress:** AWS Application Load Balancer (ALB) managed via AWS Load Balancer Controller with AWS WAF and TLS 1.3 encryption.
"""
        if "# 3.10 Production Cloud Topology" not in chapter_map[3]:
            chapter_map[3] = insert_before_end(chapter_map[3], chap3_addition)

    # 2. Enhance Chapter 22 (GitHub Actions CI/CD Pipeline)
    if 22 in chapter_map:
        chap22_addition = r"""
---

# 22.10 Production GitHub Actions CI/CD Pipeline Specification

### DIR-0335: Automated Multi-Stage CI/CD Pipeline
```yaml
name: Mediverse Production CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Java 21 & Node 20
        uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '21' }
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Backend Tests
        run: cd backend && ./gradlew check test
      - name: Frontend Tests
        run: cd frontend && npm ci && npm test

  security-scan:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy Vulnerability Scanner
        run: trivy fs --exit-code 1 --severity CRITICAL .
      - name: Run Semgrep SAST Scanner
        run: semgrep --config auto --error .

  build-and-deploy:
    needs: security-scan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Build & Push Docker Containers
        run: |
          docker build -t mediverse/backend:latest ./backend
          docker build -t mediverse/frontend:latest ./frontend
```
"""
        if "# 22.10 Production GitHub Actions" not in chapter_map[22]:
            chapter_map[22] = insert_before_end(chapter_map[22], chap22_addition)

    # 3. Enhance Chapter 35 (Automated Flyway Migration Release Pipeline)
    if 35 in chapter_map:
        chap35_addition = r"""
---

# 35.10 Automated Database Migration Release Pipeline (Flyway V1 to V26)

### DIR-0525: Flyway Pre-Deployment Migration Job
Database migrations execute as a Kubernetes pre-install/pre-upgrade Helm hook before application pods are updated:

```bash
# Automated Kubernetes Flyway Migration Execution
./gradlew flywayMigrate \
  -Dflyway.url=jdbc:postgresql://db.mediverse.internal:5432/mediverse_prod \
  -Dflyway.user=mediverse_flyway \
  -Dflyway.password=${FLYWAY_DB_PASSWORD}
```

* **Rollback Safety:** If any migration script in the `V1` to `V26` sequence fails, the Helm upgrade is automatically aborted and the previous stable replica set continues serving traffic without interruption.
"""
        if "# 35.10 Automated Database Migration" not in chapter_map[35]:
            chapter_map[35] = insert_before_end(chapter_map[35], chap35_addition)

    # 4. Enhance Chapter 42 (Observability Stack)
    if 42 in chapter_map:
        chap42_addition = r"""
---

# 42.10 Production Observability Stack: Prometheus, Grafana, OpenSearch & OpenTelemetry

### DIR-0635: Observability Toolchain Baseline
* **Metrics:** Prometheus server scraping Spring Boot Actuator metrics (`/actuator/prometheus`) and Next.js custom performance counters at a 15-second scrape interval.
* **Dashboards:** Centralized Grafana dashboards visualizing JVM garbage collection, WebGL frame rates, and API latency distributions.
* **Logs:** FluentBit forwarding structured JSON logs to OpenSearch with a 12-month online retention policy.
* **Tracing:** OpenTelemetry Java & Node.js agents propagating W3C `traceparent` headers to Jaeger / Tempo distributed tracing backends.
"""
        if "# 42.10 Production Observability" not in chapter_map[42]:
            chapter_map[42] = insert_before_end(chapter_map[42], chap42_addition)

    # 5. Enhance Chapter 47 (SLO Targets)
    if 47 in chapter_map:
        chap47_addition = r"""
---

# 47.10 Production Service Level Objectives (SLOs) & Error Budget Policy

### DIR-0705: Quantitative Service Level Objectives
The Mediverse platform enforces the following production SLOs:

| Service Domain | Service Level Indicator (SLI) | Target SLO | Monthly Error Budget |
|---|---|---|---|
| **Platform Availability** | Successful HTTP Requests ($2xx/3xx$) / Total Requests | **$\ge 99.95\%$ Uptime** | $21.6\text{ minutes}$ |
| **Simulation Calculation API** | End-to-end latency on `POST /api/v1/simulations/calculate` | **P95 $< 15\text{ms}$, P99 $< 50\text{ms}$** | $0.05\%$ requests $> 50\text{ms}$ |
| **Socratic AI Streaming** | First-token latency on `POST /api/v1/ai-tutor/chat/stream` | **P95 $< 800\text{ms}$** | $0.1\%$ requests $> 2.0\text{s}$ |
| **3D WebGL Canvas Viewport** | Time-to-Interactive (TTI) for organ render | **P95 $< 1.5\text{ seconds}$** | $0.05\%$ loads $> 3.0\text{s}$ |
"""
        if "# 47.10 Production Service Level" not in chapter_map[47]:
            chapter_map[47] = insert_before_end(chapter_map[47], chap47_addition)

    # 6. Enhance Chapter 53 (Disaster Recovery RTO/RPO)
    if 53 in chapter_map:
        chap53_addition = r"""
---

# 53.10 Disaster Recovery Objectives: RTO and RPO Specifications

### DIR-0795: Disaster Recovery Metrics
* **Recovery Point Objective (RPO):** **$\le 5\text{ minutes}$** achieved via continuous PostgreSQL write-ahead log (WAL) archiving to encrypted Amazon S3 buckets with cross-region replication.
* **Recovery Time Objective (RTO):** **$\le 30\text{ minutes}$** achieved through automated Multi-AZ database failover and automated Route53 DNS traffic swing to the secondary warm standby region (`eu-central-1`).
"""
        if "# 53.10 Disaster Recovery Objectives" not in chapter_map[53]:
            chapter_map[53] = insert_before_end(chapter_map[53], chap53_addition)

    # Reassemble complete DIG.md
    output_parts = [chapter_map[i].strip() for i in sorted(chapter_map.keys())]
    final_dig = "\n\n---\n\n".join(output_parts)

    print(f"Final DIG.md length: {len(final_dig)} characters across {len(output_parts)} chapters.")
    with open('docs/DIG.md', 'w', encoding='utf-8') as f:
        f.write(final_dig)
    print("Successfully updated docs/DIG.md with all DevOps infrastructure specifications!")

if __name__ == '__main__':
    main()
