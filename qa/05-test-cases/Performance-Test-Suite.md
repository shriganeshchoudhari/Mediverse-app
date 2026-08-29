# Performance Test Suite Catalog

```text
Document ID:       QA-PTS-001
Title:             Performance & Load Test Suite Catalog
Version:           1.0.0
Status:            APPROVED
Owner:             QA Architect / SRE
```

---

| Test Suite ID | Scenario Name | Target Concurrency | Target Throughput | Max Allowed p95 Latency |
| :--- | :--- | :---: | :---: | :---: |
| `PERF-BASE-001` | Baseline API Smoke | 50 VUs | 100 TPS | <= 200 ms |
| `PERF-LOAD-001` | Peak Operating Load | 500 VUs | 800 TPS | <= 400 ms |
| `PERF-STRS-001` | Stress & Breaking Point | 1,500 VUs | 2,000 TPS | Graceful degradation |
| `PERF-SOAK-001` | 4-Hour Soak / Memory Leak | 200 VUs | 300 TPS | No memory exhaustion |
