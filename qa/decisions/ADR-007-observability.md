# ADR-007 — Prometheus + Grafana as QA Observability Stack

```text
ADR ID:            ADR-007
Title:             Prometheus + Grafana + Loki as Observability & QA Metrics Stack
Status:            ACCEPTED
Date:              2026-08-29
Author:            QA Architect / SRE
Reviewers:         Engineering Manager, CTO
Deciders:          Engineering Manager, CTO
Supersedes:        None
Superseded By:     None
```

---

## Context

Mediverse requires production observability for:
1. **Application health** — API response times, error rates, JVM metrics.
2. **QA metrics correlation** — Linking test execution failures to production anomalies.
3. **Synthetic monitoring** — Verifying production uptime from the QA perspective.
4. **Log aggregation** — Centralizing application logs for incident diagnosis.

The tooling must be **open-source and self-hosted**, as no paid SaaS observability tools (Datadog, New Relic, etc.) are in scope per the Master Prompt constraint of "no paid tools."

---

## Decision

**Adopt the Prometheus + Grafana + Loki + Promtail stack for all observability and QA metrics needs.**

### Stack Components

| Component | Role | Config File |
|---|---|---|
| **Prometheus** | Metrics scraping and storage | `monitoring/prometheus.yml` |
| **Grafana** | Dashboard visualization | `monitoring/grafana-datasources.yml` |
| **Loki** | Log aggregation and query | `monitoring/loki-config.yml` |
| **Promtail** | Log shipping agent (Docker → Loki) | `monitoring/promtail-config.yml` |
| **Alertmanager** | Alert routing (Slack, email) | `monitoring/alerting_rules.yml` |

### QA-Specific Observability Design

#### Trace Correlation
Every Playwright test run injects two HTTP headers:
- `X-Test-Execution-ID: <uuid>` — correlates all API calls in a single test run
- `X-Test-Suite: <suite-name>` — identifies the originating test suite

These headers are picked up by Promtail → Loki log labels, enabling engineers to filter all backend logs for a specific test execution run instantly.

#### Metrics Exported from Spring Boot
Spring Boot Actuator exposes `/actuator/prometheus` — scraped by Prometheus at 15-second intervals. Key metrics:
- `http_server_requests_seconds` — per-endpoint latency (P95/P99)
- `jvm_memory_used_bytes` — heap/non-heap memory
- `hikaricp_connections_active` — PostgreSQL connection pool
- `process_cpu_usage` — CPU utilization

#### QA KPI Metrics (Custom Prometheus Labels)
CI/CD pipelines emit custom Prometheus push-gateway metrics:
- `mediverse_test_suite_pass_total{suite, browser}` — pass count per run
- `mediverse_test_suite_fail_total{suite, browser}` — fail count per run
- `mediverse_test_suite_duration_seconds{suite}` — execution duration
- `mediverse_flaky_test_count{test_id}` — count of flaky executions

---

## Alternatives Considered

### Option A: Datadog
- ✅ Best-in-class APM, log management, dashboards
- ❌ Paid SaaS — violates tooling constraint

### Option B: Elastic Stack (ELK)
- ✅ Mature; excellent log search
- ❌ Higher resource footprint; complex cluster setup for small team
- ❌ Kibana dashboard creation more complex than Grafana

### Option C: Prometheus + Grafana + Loki (ACCEPTED)
- ✅ Fully open-source, self-hosted in Docker Compose
- ✅ Native integration with Spring Boot Actuator
- ✅ Loki is the lightest-weight log aggregator for Docker environments
- ✅ Grafana supports both metrics (Prometheus) and logs (Loki) in one UI
- ⚠️ Requires manual Grafana dashboard JSON maintenance
- ⚠️ Prometheus is not designed for long-term storage at scale (use Thanos/VictoriaMetrics if needed)

---

## Implementation Details

### Docker Compose Services (existing `docker-compose.yml`)
```yaml
prometheus:
  image: prom/prometheus:v2.54.0
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    - ./monitoring/alerting_rules.yml:/etc/prometheus/alerting_rules.yml

grafana:
  image: grafana/grafana:11.2.0
  volumes:
    - ./monitoring/grafana-datasources.yml:/etc/grafana/provisioning/datasources/ds.yml
    - ./monitoring/dashboards:/etc/grafana/provisioning/dashboards

loki:
  image: grafana/loki:3.1.0
  volumes:
    - ./monitoring/loki-config.yml:/etc/loki/local-config.yaml

promtail:
  image: grafana/promtail:3.1.0
  volumes:
    - ./monitoring/promtail-config.yml:/etc/promtail/config.yml
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
```

### Prometheus Scrape Config (existing `monitoring/prometheus.yml`)
- Scrapes `backend:8085/actuator/prometheus` every 15 seconds.
- **Gap to fix:** Add Pushgateway job for CI/CD test metrics (Phase 2 deliverable).

### Grafana Dashboards
- `monitoring/dashboards/mediverse-overview.json` — Application infrastructure dashboard (✅ exists)
- `monitoring/dashboards/qa-metrics-dashboard.json` — QA KPI dashboard (❌ to be created in Phase 2)

---

## Consequences

### Positive
- Zero cost; fully open-source.
- Spring Boot Actuator provides Prometheus metrics out of the box.
- Loki provides structured log search correlated with Grafana panels.
- Alerting rules in `alerting_rules.yml` enable proactive incident detection.

### Negative / Risks
- Prometheus data is not persisted between restarts unless a volume is mounted (configured in Docker Compose).
- QA KPI push-gateway metrics require CI/CD to POST metrics after each test run — implementation in Phase 2.
- Long-term metric retention requires Thanos or VictoriaMetrics overlay — deferred to Phase 4.

---

## Review Trigger
This ADR should be revisited if:
- Team size grows beyond 15 engineers (Prometheus federation may be needed).
- Paid observability SaaS is approved in budget.
- Mediverse moves to Kubernetes (switch to Prometheus Operator / ServiceMonitor).
