# Mediverse Enterprise SLO & SLI Catalog

```text
Document ID:       MED-CAT-05
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## Service Level Objectives (SLOs) & Reliability Targets

| Tier / Service | Service Level Indicator (SLI) | Target SLO | Monthly Error Budget | Degradation Behavior |
|---|---|:---:|:---:|---|
| **Tier 1: API Gateway** | Proportion of HTTP requests returning $2xx/3xx$ | $\ge 99.95\%$ | $21.9\text{ minutes}$ | Return cached GET responses; shed analytics |
| **Tier 1: Identity Service**| Successful JWT token issuances and verifications | $\ge 99.99\%$ | $4.38\text{ minutes}$ | Use cached public JWKS keys on Gateway |
| **Tier 1: OSCE Exam Engine**| Successful exam session starts and answer submissions | $\ge 99.99\%$ | $4.38\text{ minutes}$ | Browser IndexedDB queue with automated replay |
| **Tier 2: Curriculum APIs** | P95 Response Latency $\le 250\text{ms}$ | $\ge 99.00\%$ | $7.2\text{ hours}$ | Serve stale content from Redis cache |
| **Tier 2: AI Socratic RAG** | Time-to-First-Token (TTFT) $\le 1500\text{ms}$ | $\ge 98.00\%$ | $14.4\text{ hours}$ | Fallback to static peer-reviewed summaries |
| **Tier 2: 3D Asset CDN** | HTTP $200/206$ successful GLTF mesh stream | $\ge 99.95\%$ | $21.9\text{ minutes}$ | Secondary S3 origin failover |
| **Tier 3: Notifications** | Delivery of transactional emails within 5 minutes | $\ge 95.00\%$ | $36.0\text{ hours}$ | Kafka retry queue with 24-hour buffer |
