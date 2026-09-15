# ADR-012: Modular Monolith vs. Distributed Microservices Architecture

**Date**: September 2026  
**Status**: Accepted  
**Deciders**: Platform Architecture Team  

## Context

The initial architectural documents described a distributed microservices ecosystem partitioned into Curriculum Service, OSCE Engine, Socratic AI Tutor, and EMR Patient Services fronted by Spring Cloud Gateway and decoupled via Apache Kafka. 

Under current deployment realities, distributed microservices introduce:
- High operational overhead (managing distributed transactions, saga orchestrations, network latency between organ simulation solvers).
- High barrier of entry for resource-constrained institutional medical colleges hosting on private servers.
- Complex end-to-end debugging across microservice boundaries during simulation sessions.

## Decision

We adopt a **Modular Monolith** architecture implemented in Spring Boot 3.5:
- Clean vertical domain package isolation (`com.curiolearn.curriculum`, `com.curiolearn.osce`, `com.curiolearn.ai`, `com.curiolearn.emr`, `com.curiolearn.auth`).
- In-process domain event publishing (`ApplicationEventPublisher`) with outbox-ready persistence tables.
- Single unified JPA/Hibernate persistence layer with multi-tenancy enforced through tenant ID filters.
- Microservice extraction remains straightforward if individual domain loads diverge significantly in the future.

## Consequences

- **Positive**: Single deployment artifact, rapid atomic transactions across medical records and quiz evaluations, simplified Docker Compose and Kubernetes configurations, lowest operational cost.
- **Negative**: Monolithic JVM memory footprint; long-running numerical simulations must not block servlet thread pools (mitigated by asynchronous executor pools and G1GC).
