# Mediverse Enterprise Kafka Event Catalog

```text
Document ID:       MED-CAT-03
Classification:    Enterprise Standard
Status:            APPROVED
```

---

## Distributed Kafka Event Catalog & Schema Registry

| Topic Name | Producer Service | Consumer Services | Partition Key | Schema Contract | Retention Period |
|---|---|---|---|---|:---:|
| `topic.mediverse.learning.progress-v1` | Learning Progress Service | Gamification Service, Analytics Data Lake | `payload.studentId` | `ProgressUpdatedEvent.json` | 90 Days |
| `topic.mediverse.assessment.exam-completed-v1` | Assessment & OSCE Service | Gamification Service, Notification Service | `payload.studentId` | `ExamCompletedEvent.json` | 365 Days |
| `topic.mediverse.curriculum.content-published-v1` | Curriculum Service | AI Vector Ingestion Worker, Search Indexer | `payload.moduleId` | `ContentPublishedEvent.json` | Infinite (Compacted) |
| `topic.mediverse.security.audit-log-v1` | All Microservices (Gateway Filter) | Security Audit Store, Compliance SIEM | `payload.userId` | `SecurityAuditLogEvent.json` | 7 Years (Compliance) |
| `topic.mediverse.emr.soap-evaluated-v1` | Mock EMR Service | Learning Progress Service, Student Analytics | `payload.studentId` | `SoapEvaluatedEvent.json` | 90 Days |
| `topic.mediverse.dead-letter-queue` | All Error Interceptors | SRE Incident Monitor, Alertmanager | `header.sourceTopic` | `DeadLetterEnvelope.json` | 30 Days |
