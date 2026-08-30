# ADR-006: Adoption of Apache Kafka as Primary Distributed Event Backbone

```text
Status:      ACCEPTED
Date:        2026-08-29
Deciders:    Principal Enterprise Architect, Distributed Systems Architect, SRE Lead
Context:     Mediverse requires asynchronous decoupling, audit streaming, and transactional outbox event delivery.
```

---

## 1. Context & Problem Statement
Mediverse microservices must communicate state updates (e.g., student progress, completed OSCE exams, curriculum publications) asynchronously without tight REST coupling. The system requires high-throughput event ordering, partition-level horizontal scalability, replayability, and reliable Dead-Letter Queue (DLQ) support.

## 2. Decision
We adopt **Apache Kafka 3.7+** (managed via Strimzi operator on Kubernetes in KRaft mode) as the primary distributed event streaming backbone.

## 3. Rationale
- **Ordered Partitioning:** Guarantees strict chronological processing of student learning events per `studentId`.
- **Event Replayability:** Facilitates downstream data lake re-indexing and new consumer onboarding without source service impact.
- **Transactional Outbox Compatibility:** Integrates natively with CDC outbox patterns to guarantee at-least-once delivery.

## 4. Consequences & Trade-Offs
- **Positive:** True asynchronous decoupling, high throughput ($> 50,000\text{ msg/s}$), durable event log.
- **Negative:** Increased operational complexity compared to RabbitMQ; requires ZooKeeper-less KRaft management.
