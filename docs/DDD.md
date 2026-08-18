# Chapter 1 — Introduction

---

# 1.1 Introduction

The **Database Design Document (DDD)** defines the complete data architecture for the **Mediverse – AI-Powered Medical Education Platform**. It provides the authoritative specification for designing, implementing, securing, optimizing, operating, and maintaining the relational database infrastructure that supports all platform services.

The database is the foundation of the Mediverse ecosystem. It stores and manages educational content, learner progress, assessments, AI knowledge metadata, user identities, permissions, institutional information, analytics, audit records, notifications, media metadata, and operational data while ensuring consistency, integrity, availability, scalability, and security.

This document translates the business requirements defined in the **Product Requirements Document (PRD)**, the functional and non-functional requirements specified in the **Software Requirements Specification (SRS)**, the architectural decisions documented in the **Software Architecture Document (SAD)**, and the implementation guidance provided in the **Technical Design Document (TDD)** into a detailed database blueprint.

The Database Design Document serves as the primary reference for:

* Database Architects
* Database Administrators (DBAs)
* Backend Developers
* DevOps Engineers
* AI Engineers
* QA Engineers
* Security Engineers
* System Integrators
* Technical Architects
* Operations Teams

The document defines the complete database lifecycle, including conceptual modeling, logical modeling, physical schema design, normalization, relationships, indexing, partitioning, migrations, security, backup, disaster recovery, monitoring, governance, and production readiness.

---

# 1.2 Purpose

The purpose of this document is to establish a standardized, enterprise-grade database design that enables Mediverse to deliver reliable, secure, scalable, and high-performance data services throughout the platform lifecycle.

The Database Design Document aims to:

* Define the overall database architecture.
* Establish standardized schema design principles.
* Ensure data consistency and integrity.
* Support enterprise scalability.
* Improve application performance.
* Facilitate maintainability and extensibility.
* Enable secure data management.
* Support AI-driven workloads.
* Simplify operational management.
* Provide a single source of truth for database implementation.

---

# 1.3 Scope

This document covers all database-related aspects of the Mediverse platform, including:

### Data Architecture

* Database topology
* Logical architecture
* Physical architecture
* Environment strategy
* Multi-schema organization

### Data Modeling

* Conceptual model
* Logical model
* Physical model
* Entity relationships
* Domain mapping

### Schema Design

* Tables
* Columns
* Keys
* Constraints
* Indexes
* Views
* Sequences
* Triggers
* Functions

### Core Business Domains

* Authentication
* User Management
* Student Management
* Faculty Management
* Course Management
* Lesson Management
* Assessment Management
* Question Bank
* Progress Tracking
* Certificates
* Notifications
* Media
* AI Knowledge Base
* Analytics
* Audit Logging

### Database Operations

* Migration
* Versioning
* Backup
* Recovery
* Monitoring
* Performance Tuning
* Capacity Planning
* Security
* Governance

---

# 1.4 Intended Audience

This document is intended for:

| Role                | Responsibility                                 |
| ------------------- | ---------------------------------------------- |
| Database Architect  | Database architecture and modeling             |
| DBA                 | Administration, optimization, backup, recovery |
| Backend Developer   | Entity implementation and SQL development      |
| DevOps Engineer     | Deployment and infrastructure automation       |
| Security Engineer   | Database security and compliance               |
| AI Engineer         | AI data storage and retrieval                  |
| QA Engineer         | Data validation and testing                    |
| Technical Architect | Cross-system integration                       |
| Project Manager     | Delivery planning and governance               |

Each stakeholder uses this document as the authoritative reference for database-related decisions.

---

# 1.5 Document Objectives

The Database Design Document has the following objectives:

* Define a standardized database architecture.
* Document every database object.
* Ensure consistent naming conventions.
* Establish referential integrity.
* Support efficient querying.
* Enable high availability.
* Ensure regulatory compliance.
* Simplify maintenance.
* Support future expansion.
* Maintain long-term data quality.

---

# 1.6 Design Principles

The Mediverse database is designed according to the following principles:

### Accuracy

All stored data shall accurately represent business entities.

### Consistency

Business rules shall be enforced through constraints and relationships.

### Integrity

Data integrity shall be maintained throughout the data lifecycle.

### Scalability

The database shall support future institutional growth without requiring architectural redesign.

### Performance

Database operations shall be optimized for low latency and high throughput.

### Security

Sensitive information shall be protected using encryption, access control, and auditing.

### Availability

Critical educational services shall remain continuously available.

### Maintainability

Database objects shall be modular, well-documented, and version controlled.

### Extensibility

The schema shall accommodate future functional enhancements with minimal disruption.

---

# 1.7 Database Goals

The Mediverse database shall provide:

* Reliable data storage.
* ACID-compliant transactions.
* High-performance query execution.
* Efficient indexing.
* Secure data access.
* Comprehensive auditing.
* Flexible reporting.
* AI-ready data structures.
* Cloud-native deployment support.
* Enterprise-grade operational resilience.

---

# 1.8 Assumptions

The database design is based on the following assumptions:

* PostgreSQL serves as the primary relational database.
* Redis provides distributed caching.
* Kafka manages event streaming.
* Flyway manages schema migrations.
* Docker and Kubernetes host all database services.
* Backup and recovery processes are automated.
* The application follows a microservices architecture.
* All production environments implement TLS encryption.
* Observability integrates with centralized monitoring platforms.

---

# 1.9 Document Organization

The Database Design Document is organized into the following major sections:

1. Introduction
2. Database Architecture
3. Data Modeling
4. Schema Design
5. Core Entity Design
6. Relationships & Integrity
7. Performance Design
8. Database Programming
9. Data Management
10. Production Readiness & Governance

This progression moves from high-level architectural concepts to detailed implementation and operational guidance.

---

# 1.10 Success Criteria

The Database Design Document is considered complete when it:

* Defines every database object.
* Documents all business entities.
* Establishes all relationships.
* Specifies indexing strategies.
* Defines migration procedures.
* Documents security controls.
* Specifies backup and recovery strategies.
* Defines governance standards.
* Supports production deployment.
* Aligns with the PRD, SRS, SAD, and TDD.

---

# 1.11 Traceability

This chapter establishes the foundation for the Database Design Document and maintains alignment with the project's primary engineering documentation.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Database
* Database Schemas
* Backend Microservices
* AI Services
* Analytics Platform
* DevOps Infrastructure
* Database Administration
* Enterprise Operations

---

# Chapter Summary

This chapter introduces the Database Design Document (DDD) for the Mediverse platform. It defines the purpose, scope, objectives, audience, design principles, assumptions, document organization, and success criteria for the database architecture. It establishes the DDD as the authoritative blueprint for designing, implementing, securing, optimizing, and operating the platform's data layer, ensuring consistency with the PRD, SRS, SAD, and TDD while providing a robust foundation for a scalable, secure, and high-performance medical education platform.

---

**End of Chapter 1**

**Next:** **Chapter 2 – Purpose, Scope & Objectives**.

Here is **Chapter 2 – Purpose, Scope & Objectives** of the **Database Design Document (DDD)**.

---

# Chapter 2 — Purpose, Scope & Objectives

---

# 2.1 Introduction

This chapter defines the purpose, scope, and objectives of the Database Design Document (DDD) for the **Mediverse – AI-Powered Medical Education Platform**. It establishes the business and technical goals that guide database architecture, schema implementation, operational management, security, scalability, and long-term maintainability.

The Database Design Document serves as the definitive reference for designing, implementing, managing, and evolving the enterprise database ecosystem supporting Mediverse.

---

# 2.2 Purpose

The primary purpose of this document is to provide a complete and standardized database blueprint that enables consistent implementation across all environments while ensuring high performance, data integrity, operational reliability, and enterprise security.

The DDD provides guidance for:

* Database architecture
* Data modeling
* Schema implementation
* Relationship design
* Data integrity
* Performance optimization
* Database security
* Migration strategy
* Operational management
* Governance

The document ensures that every database engineer, backend developer, DevOps engineer, and database administrator follows the same implementation standards.

---

# 2.3 Business Objectives

The Mediverse database shall support the following business objectives.

## Educational Data Management

Provide reliable storage for:

* Students
* Faculty
* Courses
* Lessons
* Assessments
* Question Banks
* Certificates
* Learning Progress

---

## AI-Powered Learning

Support storage for:

* AI Knowledge Base
* Vector Metadata
* Prompt Templates
* AI Tutor Sessions
* Recommendation Data
* Retrieval Metadata
* AI Analytics

---

## Institutional Management

Support:

* Universities
* Medical Colleges
* Departments
* Batches
* Academic Sessions
* Accreditation Data

---

## Enterprise Operations

Enable:

* Monitoring
* Reporting
* Auditing
* Notifications
* Operational Analytics
* Administration

---

# 2.4 Technical Objectives

The database architecture shall achieve the following technical goals.

### Reliability

Ensure transactional consistency through ACID-compliant operations.

---

### Scalability

Support horizontal application scaling and growing institutional data without requiring major schema redesign.

---

### Performance

Deliver predictable query performance under high concurrency using optimized schema design, indexing, caching, and partitioning strategies.

---

### Availability

Support highly available deployments with automated failover, backup, and recovery mechanisms.

---

### Security

Protect sensitive information using:

* Encryption
* Authentication
* Authorization
* Auditing
* Least Privilege Access
* Compliance Controls

---

### Maintainability

Enable safe schema evolution using version-controlled migration scripts and standardized naming conventions.

---

### Extensibility

Allow new business capabilities to be introduced with minimal impact on existing database structures.

---

# 2.5 Scope

The Database Design Document covers the complete lifecycle of database engineering.

---

## Architecture

Includes:

* Database topology
* Deployment architecture
* Environment design
* Schema organization
* High availability architecture

---

## Data Modeling

Includes:

* Conceptual model
* Logical model
* Physical model
* Domain mapping
* Relationship modeling

---

## Schema Design

Includes:

* Tables
* Columns
* Constraints
* Keys
* Indexes
* Views
* Sequences
* Functions
* Triggers

---

## Business Modules

Includes database design for:

* Authentication
* User Management
* Role Management
* Student Management
* Faculty Management
* Course Management
* Lesson Management
* Assessment Management
* Question Bank
* Progress Tracking
* Certificates
* Notifications
* Media Management
* AI Knowledge Base
* Analytics
* Audit Logging

---

## Database Operations

Includes:

* Migration
* Versioning
* Monitoring
* Backup
* Recovery
* Capacity Planning
* Performance Tuning
* Disaster Recovery

---

## Governance

Includes:

* Naming Standards
* Security Standards
* Compliance
* Documentation
* Operational Policies

---

# 2.6 Out of Scope

The following topics are documented elsewhere and are intentionally excluded from the Database Design Document.

### Business Requirements

Documented in:

* Product Requirements Document (PRD)

---

### Functional Requirements

Documented in:

* Software Requirements Specification (SRS)

---

### Software Architecture

Documented in:

* Software Architecture Document (SAD)

---

### Application Implementation

Documented in:

* Technical Design Document (TDD)

---

### Frontend Design

Documented in:

* Frontend Design Specification

---

### API Contracts

Documented in:

* API Design Specification

---

### User Documentation

Documented in:

* User Manual
* Administrator Guide
* Faculty Guide

---

# 2.7 Stakeholders

Primary stakeholders include:

| Stakeholder            | Responsibility                            |
| ---------------------- | ----------------------------------------- |
| Database Architect     | Overall database architecture             |
| Database Administrator | Database administration and operations    |
| Backend Developers     | Entity implementation and SQL development |
| DevOps Engineers       | Deployment automation and infrastructure  |
| Security Engineers     | Database security and compliance          |
| AI Engineers           | AI data storage and retrieval             |
| QA Engineers           | Database validation and testing           |
| Technical Architects   | Cross-platform integration                |
| Operations Team        | Production support                        |

---

# 2.8 Design Goals

The Mediverse database shall achieve the following goals.

### Data Integrity

Ensure that business rules are consistently enforced.

---

### Data Quality

Maintain accurate, complete, and validated information.

---

### Operational Efficiency

Reduce maintenance effort through standardized database design.

---

### Performance Optimization

Support fast response times for both transactional and analytical workloads.

---

### Security by Design

Apply security controls during database design rather than after implementation.

---

### Enterprise Scalability

Support increasing numbers of institutions, educators, learners, courses, and AI interactions.

---

# 2.9 Success Criteria

The Database Design Document shall be considered successful when it:

* Defines every database schema.
* Documents all tables and relationships.
* Specifies naming conventions.
* Defines integrity constraints.
* Documents indexing strategies.
* Supports efficient query execution.
* Defines migration procedures.
* Documents backup and recovery strategies.
* Supports enterprise security requirements.
* Enables production deployment with minimal ambiguity.

---

# 2.10 Guiding Principles

The database implementation shall adhere to the following principles.

* Single Source of Truth
* Data Integrity First
* Security by Default
* Performance by Design
* Scalability by Architecture
* Automation over Manual Processes
* Version-Controlled Schema Evolution
* Standardized Naming Conventions
* Comprehensive Documentation
* Continuous Operational Improvement

These principles guide every database design decision throughout the platform lifecycle.

---

# 2.11 Traceability

This chapter establishes the purpose, scope, and objectives of the Database Design Document and ensures alignment with all higher-level engineering documents.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Database
* Database Schemas
* Backend Microservices
* AI Platform
* Analytics Platform
* DevOps Infrastructure
* Database Administration
* Enterprise Operations

---

# Chapter Summary

This chapter defines the purpose, scope, and objectives of the Database Design Document for the Mediverse platform. It identifies the business and technical goals, establishes the boundaries of the document, defines stakeholder responsibilities, specifies guiding principles, and outlines measurable success criteria. Together with the introductory chapter, it provides the strategic foundation for the detailed database architecture, schema design, performance optimization, security, governance, and operational guidance presented in the remaining chapters.

---

**End of Chapter 2**

**Next:** **Chapter 3 – References (PRD, SRS, SAD, TDD, ADR)**.

---

# Chapter 3 — References (PRD, SRS, SAD, TDD, ADR)

---

# 3.1 Introduction

This chapter identifies the documents, standards, specifications, and architectural decisions that serve as the authoritative references for the Database Design Document (DDD). The DDD does not exist in isolation; it derives its requirements, constraints, and implementation guidance from the broader engineering documentation developed for the Mediverse platform.

These references ensure consistency across business requirements, software architecture, implementation design, infrastructure, and operational governance.

---

# 3.2 Purpose of References

The reference documents provide:

* Business context
* Functional requirements
* Non-functional requirements
* Architecture decisions
* Technical implementation guidance
* Infrastructure constraints
* Security requirements
* Compliance requirements
* Operational standards
* Governance policies

Collectively, they ensure that every database design decision is aligned with the overall system architecture and business objectives.

---

# 3.3 Primary Project Documents

The following documents constitute the primary engineering references for the database design.

| Document                                  | Purpose                                                                                   | Status           |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------- |
| Product Requirements Document (PRD)       | Defines business vision, goals, stakeholders, and product requirements                    | Approved         |
| Software Requirements Specification (SRS) | Defines functional and non-functional requirements                                        | Approved         |
| Software Architecture Document (SAD)      | Defines enterprise architecture, microservices, integrations, and deployment architecture | Approved         |
| Technical Design Document (TDD)           | Defines low-level implementation architecture and module design                           | Approved         |
| Database Design Document (DDD)            | Defines database architecture and implementation                                          | Current Document |

These documents shall remain synchronized throughout the project lifecycle.

---

# 3.4 Product Requirements Document (PRD)

The PRD establishes the business foundation for database design.

The database architecture derives support for:

* User management
* Educational institutions
* Courses
* Lessons
* Assessments
* Certificates
* AI-powered tutoring
* Progress tracking
* Notifications
* Analytics
* Administrative functions

Business entities identified in the PRD become persistent data entities within the database.

---

# 3.5 Software Requirements Specification (SRS)

The SRS defines the system behaviors that require persistent storage.

Database design supports requirements including:

### Functional Requirements

* Authentication
* Authorization
* User lifecycle
* Course enrollment
* Learning progress
* Assessment workflows
* Certificate issuance
* AI interactions
* Reporting
* Administration

### Non-Functional Requirements

* Scalability
* Performance
* Security
* Availability
* Reliability
* Maintainability
* Auditability
* Disaster Recovery

Every persistent requirement identified in the SRS is traceable to corresponding database structures.

---

# 3.6 Software Architecture Document (SAD)

The SAD defines the architectural principles that influence database implementation.

Relevant architectural areas include:

* Microservices Architecture
* Domain-Driven Design (DDD)
* Event-Driven Architecture
* CQRS (where applicable)
* REST APIs
* Kafka Integration
* Redis Caching
* AI Platform
* Kubernetes Deployment
* Observability

The database implementation supports these architectural patterns without violating service boundaries.

---

# 3.7 Technical Design Document (TDD)

The Technical Design Document defines the implementation architecture for every software module.

The DDD derives implementation guidance for:

* Domain models
* Entity design
* Repository design
* Service interactions
* Transaction boundaries
* DTO mapping
* Business rules
* API persistence
* Database migrations
* Performance optimization

The database schema shall align with the implementation model defined in the TDD.

---

# 3.8 Architecture Decision Records (ADR)

Architecture Decision Records (ADR) document significant technical decisions affecting database architecture.

Typical database-related ADRs include:

* PostgreSQL selection
* Schema organization
* UUID strategy
* Primary key design
* Migration framework selection
* Flyway adoption
* Redis caching strategy
* Kafka event persistence
* Audit logging strategy
* Backup architecture
* Partitioning strategy
* High availability design

Every significant database architectural change shall be documented through an ADR.

---

# 3.9 External Standards & Best Practices

The database design aligns with recognized industry standards and best practices.

Applicable standards include:

### SQL Standards

* ANSI SQL
* ISO SQL

### Database Standards

* PostgreSQL Best Practices
* ACID Transaction Principles
* Database Normalization
* Indexing Best Practices

### Security Standards

* OWASP Top 10
* OWASP API Security
* Principle of Least Privilege
* Zero Trust Architecture

### Compliance Standards

* Data Privacy Regulations
* Educational Data Protection Policies
* Organizational Security Policies

These standards guide database implementation, security, and governance.

---

# 3.10 Technology References

The Mediverse database ecosystem uses the following technologies.

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| PostgreSQL    | Primary relational database |
| Redis         | Distributed caching         |
| Kafka         | Event streaming             |
| Flyway        | Database schema migration   |
| Docker        | Containerization            |
| Kubernetes    | Container orchestration     |
| Prometheus    | Metrics collection          |
| Grafana       | Monitoring dashboards       |
| OpenTelemetry | Observability               |
| Spring Boot   | Database access layer       |
| Hibernate     | ORM framework               |

Technology versions are maintained in the Technology Stack & Version Matrix.

---

# 3.11 Documentation Dependencies

The DDD depends on preceding documents and supports subsequent engineering artifacts.

```text
Business Vision
      │
      ▼
PRD
      │
      ▼
SRS
      │
      ▼
SAD
      │
      ▼
TDD
      │
      ▼
Database Design Document (DDD)
      │
      ├── API Design Specification
      ├── Frontend Design Specification
      ├── DevOps Guide
      ├── Security Design
      ├── Testing Strategy
      └── Operations Runbook
```

This dependency chain ensures consistent engineering practices across the project lifecycle.

---

# 3.12 Traceability Matrix

Each database design artifact traces back to higher-level engineering documents.

| Database Artifact     | Primary Source |
| --------------------- | -------------- |
| Business Entities     | PRD            |
| Functional Tables     | SRS            |
| Service Boundaries    | SAD            |
| Entity Implementation | TDD            |
| Schema Evolution      | ADR            |
| Security Controls     | SRS, SAD, TDD  |
| Performance Strategy  | SAD, TDD       |
| Migration Strategy    | TDD            |
| Operational Policies  | SAD, ADR       |

This traceability ensures that no database object exists without a documented business or technical justification.

---

# 3.13 Document Governance

Reference documents are governed through controlled version management.

Governance principles include:

* Version-controlled documentation
* Formal review process
* Architecture approval
* Change tracking
* Impact assessment
* Traceability maintenance
* Periodic review
* Controlled publication

Changes affecting database architecture shall be reflected across all dependent documents.

---

# 3.14 Traceability

This chapter establishes the documentary foundation for the Database Design Document by identifying all internal and external references governing database architecture and implementation.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Database Architecture
* Schema Design
* Data Modeling
* Database Operations
* Security
* Performance
* Governance
* Production Infrastructure

---

# Chapter Summary

This chapter identifies the authoritative references supporting the Database Design Document. It defines how the PRD, SRS, SAD, TDD, and Architecture Decision Records guide database architecture, schema design, implementation, security, performance, and governance. It also establishes traceability between database artifacts and higher-level engineering documentation, ensuring consistency, maintainability, and alignment throughout the Mediverse platform lifecycle.

---

**End of Chapter 3**

**Next:** **Chapter 4 – Database Design Principles**.

---

# Chapter 4 — Database Design Principles

---

# 4.1 Introduction

The Database Design Principles define the architectural philosophy and engineering standards governing the design, implementation, optimization, and maintenance of the Mediverse database ecosystem. These principles ensure that every schema, table, relationship, index, constraint, and database object is designed consistently across all modules.

The Mediverse platform stores mission-critical educational, institutional, AI, and operational data. Therefore, the database must provide exceptional levels of consistency, scalability, security, reliability, and maintainability while supporting future business growth.

These principles serve as mandatory engineering guidelines for all database architects, developers, DBAs, DevOps engineers, and AI engineers.

---

# 4.2 Objectives

The database design principles aim to:

* Establish consistent database standards.
* Ensure high data quality.
* Preserve data integrity.
* Optimize query performance.
* Support horizontal application scaling.
* Simplify long-term maintenance.
* Improve database security.
* Enable seamless schema evolution.
* Support AI-driven workloads.
* Provide enterprise-grade operational reliability.

---

### DBP-001

All database objects shall comply with the approved database design standards.

---

### DBP-002

Database design decisions shall prioritize long-term maintainability over short-term implementation convenience.

---

# 4.3 Single Source of Truth

Every business entity shall have a single authoritative representation within the database.

Examples include:

* User
* Student
* Faculty
* Course
* Lesson
* Assessment
* Certificate
* Institution

Duplicate storage of authoritative business data is prohibited unless explicitly required for performance or reporting.

---

### DBP-003

Business entities shall maintain one authoritative source of persisted data.

---

### DBP-004

Data duplication shall require documented architectural justification.

---

# 4.4 Data Integrity First

The database shall enforce business correctness through structural constraints rather than relying solely on application logic.

Integrity mechanisms include:

* Primary Keys
* Foreign Keys
* Unique Constraints
* Check Constraints
* Default Values
* Referential Integrity
* Transactions

Data validation begins at the database layer.

---

### DBP-005

Critical business rules shall be enforced through database constraints wherever appropriate.

---

### DBP-006

Referential integrity shall be preserved across all relational entities.

---

# 4.5 Normalization Strategy

Schema design follows normalization principles to eliminate redundancy while maintaining efficient data access.

Normalization targets include:

* First Normal Form (1NF)
* Second Normal Form (2NF)
* Third Normal Form (3NF)
* Boyce-Codd Normal Form (BCNF) where appropriate

Controlled denormalization may be introduced for:

* Analytics
* Reporting
* Performance optimization
* Read-heavy workloads

Such decisions require architectural approval.

---

### DBP-007

Operational schemas shall be normalized unless documented exceptions exist.

---

### DBP-008

Denormalization shall be implemented only after performance analysis and approval.

---

# 4.6 Performance by Design

Performance considerations are incorporated during schema design rather than addressed after deployment.

Optimization strategies include:

* Efficient indexing
* Optimized data types
* Query optimization
* Partitioning
* Connection pooling
* Read replicas
* Materialized views
* Caching

Performance requirements shall influence every database design decision.

---

### DBP-009

Database objects shall be designed for predictable query performance.

---

### DBP-010

Indexes shall support validated query patterns rather than speculative optimization.

---

# 4.7 Scalability by Architecture

The database architecture shall support future growth without requiring major redesign.

Scalability considerations include:

* Millions of learners
* Thousands of institutions
* Large assessment repositories
* High AI interaction volumes
* Growing analytics workloads
* Long-term historical data

Scalability shall be achieved through modular schema design and optimized infrastructure.

---

### DBP-011

Schema design shall support future expansion with minimal structural changes.

---

### DBP-012

Database architecture shall accommodate increasing workload volumes.

---

# 4.8 Security by Design

Security controls are incorporated into the database architecture from the outset.

Security principles include:

* Least Privilege Access
* Role-Based Access Control (RBAC)
* Encryption at Rest
* Encryption in Transit
* Secret Management
* Audit Logging
* Secure Credential Storage
* Data Masking (where applicable)

Sensitive information receives enhanced protection throughout its lifecycle.

---

### DBP-013

Database security controls shall be implemented by design rather than retrofitted.

---

### DBP-014

Access to sensitive data shall require explicit authorization.

---

# 4.9 Reliability & Availability

The database must support uninterrupted educational services.

Reliability mechanisms include:

* ACID Transactions
* High Availability
* Replication
* Automated Backups
* Point-in-Time Recovery
* Failover
* Health Monitoring
* Disaster Recovery

Operational resilience is a primary design objective.

---

### DBP-015

Critical transactional operations shall preserve consistency during failures.

---

### DBP-016

Production databases shall support automated recovery procedures.

---

# 4.10 Maintainability

Database structures should be easy to understand, modify, and extend.

Maintainability practices include:

* Standardized naming conventions
* Modular schema organization
* Version-controlled migrations
* Comprehensive documentation
* Code reviews
* Architecture reviews

Every database object should have a clear business purpose.

---

### DBP-017

Database schemas shall remain modular and well documented.

---

### DBP-018

Schema evolution shall be managed through controlled migration processes.

---

# 4.11 Extensibility

The Mediverse platform is expected to evolve continuously.

Database design shall support future additions including:

* New AI capabilities
* New educational modules
* Additional institutional features
* Internationalization
* Multi-tenancy
* Advanced analytics

Extensibility minimizes future migration complexity.

---

### DBP-019

Future functional expansion shall not require extensive schema redesign.

---

### DBP-020

New capabilities shall integrate with existing schema standards.

---

# 4.12 Auditability

Critical business operations require complete traceability.

Auditable activities include:

* Authentication
* Authorization
* Administrative actions
* Data modification
* AI interactions
* Assessment submissions
* Certificate issuance

Audit information shall remain immutable and securely retained.

---

### DBP-021

Critical database operations shall generate audit records.

---

### DBP-022

Audit information shall support regulatory and operational investigations.

---

# 4.13 Automation First

Database administration should minimize manual intervention.

Automation areas include:

* Schema Migration
* Backup
* Recovery Testing
* Monitoring
* Performance Analysis
* Capacity Planning
* Health Checks
* Alerting

Automation improves operational consistency and reduces risk.

---

### DBP-023

Database lifecycle activities shall be automated wherever practical.

---

### DBP-024

Manual operational procedures shall be documented and approved.

---

# 4.14 Governance

Enterprise governance ensures long-term consistency.

Governance activities include:

* Architecture Review
* Database Design Review
* Performance Review
* Security Review
* Migration Review
* Documentation Review
* Capacity Review
* Operational Readiness Review

Governance supports continuous quality improvement.

---

### DBP-025

Database design standards shall undergo periodic review.

---

### DBP-026

Database changes shall follow approved governance procedures.

---

# 4.15 Best Practices

The Mediverse platform adopts the following database best practices:

* Design for integrity before optimization.
* Normalize operational data appropriately.
* Apply indexes based on measured workload.
* Use descriptive and consistent naming conventions.
* Keep business logic primarily within the application layer while enforcing critical integrity rules in the database.
* Version-control every schema change.
* Automate migrations and backups.
* Protect sensitive information using encryption and least-privilege access.
* Monitor database health continuously.
* Document every significant architectural decision through ADRs.

These practices ensure that the database remains secure, scalable, maintainable, and aligned with enterprise engineering standards.

---

### DBP-027

Engineering teams shall follow standardized database design best practices.

---

### DBP-028

Database design shall continuously evolve based on operational feedback and architectural review.

---

# 4.16 Traceability

This chapter establishes the core database engineering principles governing the Mediverse platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Database Architecture
* Schema Design
* Data Modeling
* Database Security
* Performance Engineering
* Database Operations
* Migration Strategy
* Production Infrastructure

---

# Chapter Summary

This chapter defines the foundational database design principles for the Mediverse platform. It establishes enterprise standards for data integrity, normalization, performance optimization, scalability, security, reliability, maintainability, extensibility, auditability, automation, and governance. These principles provide a consistent framework for all subsequent database design decisions, ensuring that the Mediverse database remains robust, secure, high-performing, and capable of supporting long-term platform growth and operational excellence.

---

**End of Chapter 4**

**Next:** **Chapter 5 – Technology Stack & Version Matrix**.

---

# Chapter 5 — Technology Stack & Version Matrix

---

# 5.1 Introduction

The Technology Stack & Version Matrix defines the database technologies, supporting infrastructure, development tools, operational platforms, and version management strategy for the Mediverse platform. It establishes the approved technologies used for database implementation, deployment, monitoring, security, migration, backup, and disaster recovery.

Maintaining a standardized technology stack ensures consistency across development, testing, staging, and production environments while reducing compatibility issues and simplifying long-term maintenance.

This chapter also defines the version governance process, upgrade strategy, compatibility requirements, and lifecycle management for all database-related technologies.

---

# 5.2 Objectives

The technology stack aims to:

* Standardize database technologies.
* Ensure version compatibility.
* Simplify maintenance.
* Support enterprise scalability.
* Improve operational reliability.
* Enable cloud-native deployments.
* Support AI workloads.
* Maintain security compliance.
* Reduce operational complexity.
* Support future upgrades.

---

### TECH-001

Only approved technologies shall be used within the database ecosystem.

---

### TECH-002

Technology versions shall be centrally managed and periodically reviewed.

---

# 5.3 Core Database Technology Stack

The Mediverse platform adopts PostgreSQL as its primary transactional database while using complementary technologies for caching, messaging, migrations, monitoring, and infrastructure automation.

| Component        | Technology      | Purpose                                  |
| ---------------- | --------------- | ---------------------------------------- |
| Primary Database | PostgreSQL      | Relational transactional database        |
| Cache            | Redis           | Distributed caching and session storage  |
| Event Streaming  | Apache Kafka    | Asynchronous messaging                   |
| Schema Migration | Flyway          | Version-controlled schema evolution      |
| ORM              | Hibernate (JPA) | Object-relational mapping                |
| Connection Pool  | HikariCP        | High-performance JDBC connection pooling |

These technologies form the core data platform.

---

### TECH-003

PostgreSQL shall serve as the system of record for transactional data.

---

### TECH-004

Redis shall be used only for transient or cacheable data.

---

# 5.4 Database Version Matrix

The following versions are recommended as the baseline for Mediverse.

| Technology    | Recommended Version  | Support Level     |
| ------------- | -------------------- | ----------------- |
| PostgreSQL    | 16.x                 | Long-Term Support |
| Redis         | 7.x                  | Stable            |
| Apache Kafka  | 3.x                  | Stable            |
| Flyway        | 10.x                 | Stable            |
| Hibernate ORM | 6.x                  | Stable            |
| HikariCP      | 5.x                  | Stable            |
| JDBC Driver   | PostgreSQL JDBC 42.x | Stable            |

Patch updates should be applied after compatibility validation.

---

### TECH-005

Only supported software versions shall be deployed to production.

---

### TECH-006

Major version upgrades shall undergo compatibility testing before adoption.

---

# 5.5 Application Integration Stack

The database integrates with the backend application through standardized technologies.

| Layer                 | Technology         |
| --------------------- | ------------------ |
| Programming Language  | Java 21 LTS        |
| Backend Framework     | Spring Boot 3.x    |
| Persistence Framework | Spring Data JPA    |
| ORM                   | Hibernate ORM      |
| SQL Migration         | Flyway             |
| Validation            | Jakarta Validation |
| API Layer             | Spring Web         |

This stack provides consistent database interaction across all microservices.

---

### TECH-007

Database access shall occur through approved persistence frameworks.

---

### TECH-008

Direct database access shall be restricted to authorized administrative operations.

---

# 5.6 Infrastructure Stack

Database services operate within a cloud-native infrastructure.

| Component                | Technology           |
| ------------------------ | -------------------- |
| Container Runtime        | Docker               |
| Container Orchestration  | Kubernetes           |
| Package Management       | Helm                 |
| Infrastructure as Code   | Terraform            |
| Configuration Management | ConfigMaps & Secrets |
| GitOps                   | Argo CD              |

Infrastructure automation ensures repeatable deployments.

---

### TECH-009

Database infrastructure shall be deployed using Infrastructure as Code (IaC).

---

### TECH-010

Production deployments shall use Kubernetes orchestration.

---

# 5.7 Observability Stack

Operational visibility is achieved through integrated monitoring and logging.

| Component           | Technology             |
| ------------------- | ---------------------- |
| Metrics             | Prometheus             |
| Dashboards          | Grafana                |
| Logs                | ELK / OpenSearch Stack |
| Distributed Tracing | OpenTelemetry          |
| Alerting            | Alertmanager           |

Observability enables proactive operational management.

---

### TECH-011

Database metrics shall be continuously monitored.

---

### TECH-012

Critical operational events shall generate automated alerts.

---

# 5.8 Security Stack

Database security is supported by multiple technologies.

| Component          | Technology                                     |
| ------------------ | ---------------------------------------------- |
| Authentication     | OAuth2 / JWT                                   |
| Secrets Management | Kubernetes Secrets / Vault                     |
| Encryption         | TLS 1.3                                        |
| Password Hashing   | BCrypt / Argon2                                |
| Access Control     | RBAC                                           |
| Audit Logging      | PostgreSQL Audit Extensions (where applicable) |

Security controls protect both application and database layers.

---

### TECH-013

Sensitive credentials shall be stored in approved secret management systems.

---

### TECH-014

All production database communication shall use encrypted connections.

---

# 5.9 Backup & Recovery Technologies

Reliable recovery mechanisms are essential for enterprise operations.

| Function               | Technology                     |
| ---------------------- | ------------------------------ |
| Logical Backup         | pg_dump                        |
| Physical Backup        | pg_basebackup                  |
| Continuous Archiving   | WAL Archiving                  |
| Point-in-Time Recovery | PostgreSQL PITR                |
| Backup Storage         | Object Storage / Cloud Storage |
| Recovery Automation    | Kubernetes Jobs / Scripts      |

Backup procedures support business continuity.

---

### TECH-015

Automated backups shall be scheduled for all production databases.

---

### TECH-016

Recovery procedures shall be validated periodically.

---

# 5.10 Development Toolchain

The following tools support database development and administration.

| Tool           | Purpose                      |
| -------------- | ---------------------------- |
| IntelliJ IDEA  | Backend development          |
| pgAdmin        | Database administration      |
| DBeaver        | SQL development and analysis |
| Git            | Version control              |
| Maven          | Dependency management        |
| Docker Desktop | Local container runtime      |

Development tools improve productivity and consistency.

---

### TECH-017

Database development tools shall comply with organizational standards.

---

### TECH-018

All schema changes shall be version controlled.

---

# 5.11 Version Compatibility Strategy

Technology compatibility is managed through controlled version alignment.

| Layer                    | Compatibility Requirement |
| ------------------------ | ------------------------- |
| Spring Boot ↔ PostgreSQL | Certified                 |
| Hibernate ↔ PostgreSQL   | Certified                 |
| Flyway ↔ PostgreSQL      | Certified                 |
| JDBC Driver ↔ PostgreSQL | Certified                 |
| Kubernetes ↔ PostgreSQL  | Validated                 |
| Docker ↔ PostgreSQL      | Validated                 |

Compatibility testing precedes production deployment.

---

### TECH-019

Technology compatibility shall be verified before software upgrades.

---

### TECH-020

Unsupported software combinations shall not be deployed.

---

# 5.12 Upgrade Strategy

Technology upgrades follow a controlled lifecycle.

Upgrade process:

```text
Vendor Release
      │
Compatibility Review
      │
Development Testing
      │
Integration Testing
      │
Performance Validation
      │
Security Review
      │
Staging Deployment
      │
Production Rollout
```

This process minimizes operational risk while keeping the platform current.

---

### TECH-021

Technology upgrades shall follow the approved change management process.

---

### TECH-022

Rollback procedures shall be documented before major upgrades.

---

# 5.13 Lifecycle Management

Technology components are continuously reviewed.

Lifecycle stages include:

* Evaluation
* Adoption
* Active Support
* Maintenance
* Deprecation
* Retirement

Lifecycle governance ensures long-term platform sustainability.

---

### TECH-023

Deprecated technologies shall be replaced according to lifecycle plans.

---

### TECH-024

Technology reviews shall occur at least annually.

---

# 5.14 Governance

Technology governance ensures consistency across all environments.

Governance activities include:

* Architecture Review
* Version Review
* Security Assessment
* Performance Evaluation
* Vendor Support Review
* Documentation Updates
* Compatibility Validation
* Change Approval

Governance ensures that technology decisions remain aligned with enterprise architecture.

---

### TECH-025

Technology standards shall be centrally maintained.

---

### TECH-026

Unauthorized technology substitutions shall not be permitted.

---

# 5.15 Best Practices

The Mediverse platform adopts the following technology best practices:

* Use Long-Term Support (LTS) versions whenever available.
* Standardize versions across all environments.
* Automate dependency and compatibility checks.
* Monitor vendor security advisories.
* Apply security patches promptly after validation.
* Keep infrastructure declarative using Infrastructure as Code.
* Version-control all configuration and migration scripts.
* Regularly review technology lifecycle status.
* Validate upgrades in staging before production.
* Maintain complete documentation for all approved technologies.

These practices reduce operational risk and improve maintainability.

---

### TECH-027

Engineering teams shall use only approved versions of database technologies.

---

### TECH-028

Technology documentation shall be reviewed and updated following each approved upgrade.

---

# 5.16 Traceability

This chapter defines the approved technology stack supporting the Mediverse database platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Infrastructure Design
* Docker Design
* Kubernetes Deployment Design
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL
* Redis
* Apache Kafka
* Flyway
* Hibernate
* Spring Boot
* Docker
* Kubernetes
* DevOps Infrastructure
* Database Operations

---

# Chapter Summary

This chapter defines the Technology Stack & Version Matrix for the Mediverse Database Design Document. It establishes the approved technologies, recommended versions, compatibility requirements, infrastructure components, observability tools, security technologies, backup mechanisms, development toolchain, upgrade strategy, lifecycle management, and governance processes. By standardizing the technology stack and version management practices, Mediverse ensures a stable, secure, maintainable, and future-ready database platform that supports enterprise-scale operations and continuous evolution.

---

---

# 5.10 Production Flyway Database Migration Inventory (V1 to V26)

The Mediverse PostgreSQL 16 schema evolves through 26 automated Flyway migrations:

| Version | Migration Script Name | Target Domain & Relational DDL Scope |
|---|---|---|
| **V1** | `V1__baseline_auth_schema.sql` | Core identity, `auth.users`, `auth.roles`, `auth.tenants` |
| **V2** | `V2__curriculum_schema.sql` | `curriculum.organ_systems`, `curriculum.topics`, `curriculum.lessons` |
| **V3** | `V3__anatomy_models.sql` | 3D mesh references, camera positions, anatomical landmark pins |
| **V4** | `V4__simulation_catalog.sql` | Active physiological simulation modules & parameter boundaries |
| **V5** | `V5__quiz_engine.sql` | `quiz.questions`, multiple-choice distractors, answer keys |
| **V6** | `V6__progress_tracking.sql` | `progress.user_lesson_progress`, topic completion percentages |
| **V7** | `V7__ai_tutor_core.sql` | Socratic conversation sessions, token usage logs |
| **V8** | `V8__nmc_competencies.sql` | National Medical Commission CBME competency codes (`PY1.1`–`PY11.14`) |
| **V9** | `V9__acid_base_lab.sql` | Davenport nomogram presets, ABG diagnostic classifications |
| **V10** | `V10__cardiac_pv_lab.sql` | Suga-Sagawa PV-loop simulation runs & Wiggers curve parameters |
| **V11** | `V11__renal_filtration_lab.sql` | Starling microvascular filtration constants & GFR presets |
| **V12** | `V12__nerve_muscle_lab.sql` | Goldman-Hodgkin-Katz membrane potentials & action potential curves |
| **V13** | `V13__respiratory_lab.sql` | Alveolar gas exchange ($V/Q$) compliance presets |
| **V14** | `V14__clinical_cases.sql` | High-yield USMLE / MBBS clinical vignette patient cases |
| **V15** | `V15__exam_submissions.sql` | Timed examination attempts, strikeout flags, final scores |
| **V16** | `V16__radar_mastery.sql` | Multi-axis Bloom's taxonomy competency mastery analytics |
| **V17** | `V17__tenancy_scim.sql` | University SCIM 2.0 directory sync & SAML/OIDC metadata |
| **V18** | `V18__audit_logs.sql` | Immutable administrative & security event audit trails |
| **V19** | `V19__media_assets.sql` | 3D GLB meshes, audio clips, interactive SVG diagrams |
| **V20** | `V20__user_preferences.sql` | UI color themes, dark mode, high-contrast accessibility settings |
| **V21** | `V21__spaced_repetition.sql` | SuperMemo SM-2 flashcard scheduling & review intervals |
| **V22** | `V22__offline_sync.sql` | PWA IndexedDB offline submission sync queue |
| **V23** | `V23__pgvector_knowledge_base.sql` | `pgvector` 1536-D HNSW cosine index for medical physiology RAG |
| **V24** | `V24__cms_content_review_workflow.sql` | 5-Stage review state machine & `curriculum.content_reviews` |
| **V25** | `V25__ai_tutor_session_memory.sql` | Socratic multi-turn conversation context & textbook citations |
| **V26** | `V26__lti13_advantage.sql` | IMS Global LTI 1.3 Advantage OIDC launch & AGS grade passback |

**End of Chapter 5**

**Next:** **Chapter 6 – Database Architecture Overview**.

---

# Chapter 6 — Database Architecture Overview

---

# 6.1 Introduction

The Database Architecture Overview defines the high-level structure of the Mediverse data platform. It describes how data is organized, stored, processed, secured, replicated, and accessed across the enterprise ecosystem.

Mediverse is an AI-powered medical education platform built on a cloud-native microservices architecture. The database architecture is designed to support:

* High-volume transactional workloads
* AI-powered knowledge retrieval
* Real-time analytics
* Multi-institution support
* Enterprise security
* High availability
* Disaster recovery
* Future scalability

Rather than using a single monolithic database, Mediverse adopts a **polyglot persistence architecture**, where each storage technology is selected based on its strengths while PostgreSQL remains the authoritative system of record for transactional data.

---

# 6.2 Objectives

The database architecture shall:

* Ensure high availability.
* Support horizontal application scaling.
* Maintain strong data consistency.
* Enable efficient querying.
* Support AI workloads.
* Provide operational resilience.
* Enable secure data access.
* Simplify maintenance.
* Support cloud-native deployment.
* Allow future expansion without architectural redesign.

---

### DBA-001

The database architecture shall provide a highly available and fault-tolerant data platform.

---

### DBA-002

All architectural decisions shall support long-term scalability and maintainability.

---

# 6.3 Architectural Principles

The Mediverse database architecture is governed by the following principles:

### Single Source of Truth

PostgreSQL is the authoritative transactional database.

---

### Polyglot Persistence

Different storage technologies are used according to workload characteristics.

---

### Domain Isolation

Each microservice owns its data model and database schema.

---

### Security by Design

Security controls are integrated into every layer of the architecture.

---

### Cloud-Native Architecture

The database platform is optimized for Kubernetes deployments.

---

### Automation First

Provisioning, migration, backup, monitoring, and recovery are automated wherever practical.

---

### DBA-003

Database ownership shall align with bounded contexts defined by the microservices architecture.

---

### DBA-004

Database technologies shall be selected based on workload characteristics rather than uniformity.

---

# 6.4 High-Level Architecture

The Mediverse data platform consists of multiple integrated components.

```text
                         Users
                           │
                    Web / Mobile Apps
                           │
                    API Gateway
                           │
        ┌──────────────────────────────────────┐
        │         Microservices Layer          │
        └──────────────────────────────────────┘
      │        │        │        │        │
      ▼        ▼        ▼        ▼        ▼
 Authentication  Courses  Assessments  AI  Analytics
      │
      ▼
+---------------------------------------------------+
|                Data Platform                      |
|---------------------------------------------------|
| PostgreSQL (Transactional Data)                  |
| Redis (Caching & Sessions)                       |
| Kafka (Event Streaming)                          |
| Object Storage (Media Files)                     |
| Vector Database (AI Embeddings - Future)         |
+---------------------------------------------------+
```

Each storage component fulfills a specialized responsibility while integrating into a unified enterprise data platform.

---

### DBA-005

Transactional business data shall reside within PostgreSQL.

---

### DBA-006

Large binary objects shall be stored outside the relational database unless explicitly justified.

---

# 6.5 Database Components

The Mediverse database architecture comprises the following components.

## PostgreSQL

Primary relational database for:

* Users
* Institutions
* Courses
* Lessons
* Assessments
* Certificates
* Notifications
* Audit Records

---

## Redis

Used for:

* Session storage
* Distributed caching
* Rate limiting
* Frequently accessed reference data

---

## Kafka

Supports:

* Event streaming
* Asynchronous processing
* Notification workflows
* Analytics pipelines

---

## Object Storage

Stores:

* Videos
* Images
* PDFs
* Medical models
* Audio files
* Course resources

Only metadata is maintained in PostgreSQL.

---

## Vector Database (Future)

Supports:

* RAG retrieval
* AI semantic search
* Embedding storage
* Similarity search

Vector identifiers remain linked to PostgreSQL records.

---

### DBA-007

Each storage technology shall have clearly defined responsibilities.

---

### DBA-008

Business entities shall maintain referential linkage across storage systems.

---

# 6.6 Logical Architecture

The logical database architecture follows Domain-Driven Design (DDD).

Representative domains include:

* Identity
* Student
* Faculty
* Course
* Assessment
* Learning Progress
* Certificate
* Notification
* Media
* AI
* Analytics
* Administration

Each domain maps to one or more schemas while maintaining loose coupling.

---

### DBA-009

Database schemas shall reflect bounded business domains.

---

### DBA-010

Cross-domain dependencies shall be minimized.

---

# 6.7 Data Flow Architecture

The flow of data through the platform follows a layered model.

```text
User Request
      │
API Gateway
      │
Microservice
      │
Repository Layer
      │
PostgreSQL
      │
Event Published
      │
Kafka
      │
Consumers
      │
Analytics / Notifications / AI
```

This architecture supports both synchronous transactions and asynchronous processing.

---

### DBA-011

Transactional updates shall complete before asynchronous event publication.

---

### DBA-012

Event-driven processing shall not compromise transactional consistency.

---

# 6.8 Availability Architecture

High availability is achieved through multiple mechanisms.

Infrastructure includes:

* PostgreSQL Replication
* Kubernetes StatefulSets
* Persistent Volumes
* Automated Failover
* Health Monitoring
* Backup Automation
* Read Replicas (future)

The architecture minimizes downtime during infrastructure failures.

---

### DBA-013

Production databases shall support high availability.

---

### DBA-014

Critical failures shall trigger automated recovery procedures where practical.

---

# 6.9 Scalability Architecture

The database platform supports enterprise growth.

Scalability strategies include:

* Connection pooling
* Efficient indexing
* Read replicas
* Partitioning
* Redis caching
* Horizontal application scaling
* Asynchronous processing
* AI workload separation

These mechanisms allow the platform to support increasing user and data volumes.

---

### DBA-015

Database architecture shall support future institutional growth.

---

### DBA-016

Scalability strategies shall prioritize predictable performance.

---

# 6.10 Security Architecture

Security is integrated into every architectural layer.

Controls include:

* TLS encryption
* Role-Based Access Control (RBAC)
* Database authentication
* Least privilege access
* Audit logging
* Secret management
* Encryption at rest
* Row-level security (where appropriate)

Security is enforced across infrastructure, application, and database layers.

---

### DBA-017

Sensitive data shall be protected throughout its lifecycle.

---

### DBA-018

Database access shall require authenticated identities.

---

# 6.11 Operational Architecture

Operational management includes:

* Flyway migrations
* Automated backups
* Monitoring
* Alerting
* Capacity planning
* Performance tuning
* Disaster recovery
* Health validation

Operational automation minimizes manual intervention.

---

### DBA-019

Operational processes shall be automated wherever practical.

---

### DBA-020

Database health shall be continuously monitored.

---

# 6.12 Architectural Constraints

The following constraints apply to the Mediverse database architecture.

* PostgreSQL is the primary transactional database.
* Business data shall remain normalized.
* Every schema change shall use Flyway.
* Every table shall have a primary key.
* Every foreign key shall enforce referential integrity unless explicitly documented.
* Sensitive information shall be encrypted.
* Production changes require architectural review.
* Infrastructure shall remain declarative using Infrastructure as Code.

---

### DBA-021

Architectural constraints shall be documented before implementation.

---

### DBA-022

Exceptions to architectural standards shall require formal approval through an Architecture Decision Record (ADR).

---

# 6.13 Governance

Database architecture governance includes:

* Architecture reviews
* Capacity reviews
* Security reviews
* Performance assessments
* Technology reviews
* Disaster recovery validation
* Documentation updates
* Compliance audits

Governance ensures long-term consistency and operational excellence.

---

### DBA-023

Database architecture shall undergo periodic governance review.

---

### DBA-024

Architectural documentation shall remain synchronized with implementation.

---

# 6.14 Traceability

This chapter defines the overall database architecture supporting the Mediverse platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Technology Stack & Version Matrix
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL
* Redis
* Apache Kafka
* Object Storage
* AI Platform
* Backend Microservices
* Kubernetes Infrastructure
* Enterprise Operations

---

# Chapter Summary

This chapter defines the high-level database architecture for the Mediverse platform. It establishes the architectural principles, storage components, logical organization, data flow, scalability, security, availability, and governance that underpin the enterprise data platform. By combining PostgreSQL as the transactional system of record with complementary technologies such as Redis, Kafka, object storage, and future vector databases, the architecture delivers a scalable, secure, resilient, and cloud-native foundation capable of supporting Mediverse's educational, AI, and operational workloads.

---

**End of Chapter 6**

**Next:** **Chapter 7 – Database Deployment Architecture**.

---

# Chapter 7 — Database Deployment Architecture

---

# 7.1 Introduction

The Database Deployment Architecture defines how the Mediverse database platform is provisioned, deployed, configured, secured, scaled, monitored, and maintained across all environments.

The deployment architecture follows **cloud-native principles**, utilizing Kubernetes for orchestration, Docker for containerization, Infrastructure as Code (IaC) for provisioning, and GitOps for automated deployments. This ensures consistency, repeatability, resilience, and operational efficiency throughout the software lifecycle.

The deployment architecture is designed to support:

* High Availability (HA)
* Fault Tolerance
* Horizontal Application Scaling
* Disaster Recovery
* Secure Operations
* Automated Deployment
* Continuous Monitoring
* Enterprise Compliance

---

# 7.2 Objectives

The deployment architecture aims to:

* Standardize deployments across environments.
* Ensure highly available database services.
* Support automated provisioning.
* Simplify disaster recovery.
* Enable secure deployments.
* Support zero-downtime upgrades.
* Minimize manual intervention.
* Improve operational reliability.
* Support future scaling.
* Enable GitOps-driven infrastructure management.

---

### DEP-001

Database deployments shall be fully automated.

---

### DEP-002

Production deployments shall follow Infrastructure as Code principles.

---

# 7.3 Deployment Environments

The Mediverse platform consists of multiple isolated deployment environments.

| Environment       | Purpose                        |
| ----------------- | ------------------------------ |
| Local Development | Individual developer testing   |
| Development       | Shared development integration |
| QA                | Functional testing             |
| UAT               | User Acceptance Testing        |
| Staging           | Production-like validation     |
| Production        | Live enterprise platform       |
| Disaster Recovery | Standby production recovery    |

Each environment maintains independent infrastructure while following identical deployment standards.

---

### DEP-003

Environment configurations shall remain isolated.

---

### DEP-004

Production configuration shall never be reused in lower environments.

---

# 7.4 High-Level Deployment Architecture

The deployment architecture integrates Kubernetes, PostgreSQL, monitoring, backups, and supporting infrastructure.

```text id="9kp8v7"
                   Internet
                       │
               Ingress Controller
                       │
               API Gateway Services
                       │
      ----------------------------------------
      |         Kubernetes Cluster           |
      |--------------------------------------|
      | Microservices                        |
      | PostgreSQL StatefulSet               |
      | Redis                               |
      | Kafka                               |
      | Monitoring Stack                    |
      | Backup Jobs                         |
      ----------------------------------------
                │
      Persistent Volumes (Storage)
                │
      Cloud Block/Object Storage
```

The database layer remains isolated while supporting all application services through secure internal networking.

---

### DEP-005

Database services shall not be directly exposed to the public internet.

---

### DEP-006

All application access shall occur through controlled service endpoints.

---

# 7.5 Kubernetes Deployment Model

PostgreSQL is deployed as a **StatefulSet** to ensure stable network identities and persistent storage.

Key Kubernetes components include:

* StatefulSet
* PersistentVolumeClaim (PVC)
* PersistentVolume (PV)
* Services (ClusterIP)
* ConfigMaps
* Secrets
* Network Policies
* Pod Disruption Budgets
* Horizontal Pod Autoscaler (application layer)
* Backup CronJobs

This model provides durable storage and predictable lifecycle management.

---

### DEP-007

Production PostgreSQL instances shall use StatefulSets.

---

### DEP-008

Persistent volumes shall be retained during pod restarts.

---

# 7.6 Storage Architecture

Persistent data is stored using enterprise-grade storage.

| Storage Type        | Purpose                  |
| ------------------- | ------------------------ |
| Persistent Volumes  | PostgreSQL data files    |
| Object Storage      | Backups, media, archives |
| WAL Archive Storage | Continuous recovery      |
| Temporary Volumes   | Ephemeral processing     |

Storage classes should support:

* High durability
* Low latency
* Snapshot capability
* Expansion
* Encryption at rest

---

### DEP-009

Database storage shall support dynamic provisioning.

---

### DEP-010

Persistent storage shall survive node failures.

---

# 7.7 Network Architecture

Database networking follows a zero-trust model.

Network controls include:

* ClusterIP services
* Network Policies
* TLS encryption
* Internal DNS
* Firewall rules
* Restricted ingress
* Service discovery

External access is prohibited except through approved administrative channels.

---

### DEP-011

Database traffic shall remain within trusted network boundaries.

---

### DEP-012

All inter-service communication shall use encrypted channels where supported.

---

# 7.8 Configuration Management

Configuration is externalized from application code.

Configuration sources include:

* ConfigMaps
* Kubernetes Secrets
* Environment Variables
* Helm Values
* GitOps Repository

Configuration categories:

* Database parameters
* Connection settings
* Resource limits
* Backup schedules
* Monitoring configuration
* Security settings

---

### DEP-013

Sensitive configuration shall never be stored in source code.

---

### DEP-014

Secrets shall be managed using approved secret management mechanisms.

---

# 7.9 High Availability Deployment

Production deployments support continuous service availability.

High Availability components include:

* Primary PostgreSQL instance
* Standby replicas
* Automated failover
* Health probes
* Pod anti-affinity
* Multi-node scheduling
* Storage redundancy

These mechanisms reduce downtime caused by infrastructure failures.

---

### DEP-015

Production databases shall support automated failover.

---

### DEP-016

High availability configurations shall be validated regularly.

---

# 7.10 Backup Deployment

Backup infrastructure includes:

* Scheduled logical backups
* Physical backups
* WAL archiving
* Backup verification
* Off-site storage
* Retention policies
* Automated cleanup

Backup jobs execute independently of application workloads.

---

### DEP-017

Backup jobs shall run automatically according to defined schedules.

---

### DEP-018

Backup integrity shall be verified after execution.

---

# 7.11 Monitoring Deployment

Operational monitoring includes:

* PostgreSQL metrics
* Node metrics
* Storage utilization
* Connection pool usage
* Replication status
* Query performance
* Backup success
* Resource consumption

Monitoring integrates with:

* Prometheus
* Grafana
* Alertmanager

---

### DEP-019

All production deployments shall expose operational metrics.

---

### DEP-020

Critical failures shall generate automated alerts.

---

# 7.12 Disaster Recovery Deployment

Disaster Recovery (DR) architecture supports rapid service restoration.

Recovery capabilities include:

* Automated backup restoration
* Point-in-Time Recovery (PITR)
* Infrastructure recreation via IaC
* Cross-region backup storage
* DNS failover procedures
* Recovery validation

Recovery objectives:

| Objective                      | Target       |
| ------------------------------ | ------------ |
| Recovery Time Objective (RTO)  | ≤ 60 minutes |
| Recovery Point Objective (RPO) | ≤ 15 minutes |

---

### DEP-021

Disaster recovery procedures shall be documented and tested.

---

### DEP-022

Recovery objectives shall be reviewed periodically.

---

# 7.13 Deployment Workflow

The deployment pipeline follows a controlled release process.

```text id="f2r4ny"
Developer Commit
        │
Git Repository
        │
CI Pipeline
        │
Build & Test
        │
Container Image
        │
Security Scan
        │
Helm Package
        │
GitOps Repository
        │
Argo CD
        │
Kubernetes Deployment
        │
Health Validation
        │
Production
```

Every deployment is traceable, repeatable, and auditable.

---

### DEP-023

Deployments shall occur only through approved CI/CD pipelines.

---

### DEP-024

Manual production deployments shall require documented approval.

---

# 7.14 Governance

Deployment governance includes:

* Change Management
* Architecture Review
* Security Review
* Release Approval
* Backup Validation
* Disaster Recovery Testing
* Capacity Planning
* Documentation Updates

Governance ensures consistent and compliant deployments.

---

### DEP-025

Deployment procedures shall undergo regular review.

---

### DEP-026

Deployment documentation shall remain synchronized with infrastructure changes.

---

# 7.15 Best Practices

The Mediverse platform follows these deployment best practices:

* Deploy PostgreSQL using Kubernetes StatefulSets.
* Use Persistent Volumes for all database storage.
* Automate deployments with GitOps.
* Encrypt all network communication.
* Store secrets outside application code.
* Monitor database health continuously.
* Validate backups through periodic restore testing.
* Perform zero-downtime upgrades where possible.
* Enforce infrastructure changes through code reviews.
* Regularly test disaster recovery procedures.

These practices provide a resilient, secure, and maintainable deployment architecture.

---

### DEP-027

Infrastructure changes shall be version-controlled.

---

### DEP-028

Operational procedures shall be automated wherever practical.

---

# 7.16 Traceability

This chapter defines the deployment architecture supporting the Mediverse database platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Technology Stack & Version Matrix
* DevOps & Infrastructure Guide
* Kubernetes Deployment Design
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL
* Kubernetes
* Docker
* Helm
* Argo CD
* Flyway
* Persistent Storage
* Monitoring Stack
* Disaster Recovery Infrastructure

---

# Chapter Summary

This chapter defines the Database Deployment Architecture for the Mediverse platform. It describes how database services are deployed across multiple environments using Kubernetes, Docker, Infrastructure as Code, and GitOps. The chapter covers deployment topology, storage architecture, networking, configuration management, high availability, backup and disaster recovery, monitoring, deployment workflows, governance, and operational best practices, providing a secure, resilient, and scalable foundation for enterprise-grade database operations.

---

**End of Chapter 7**

**Next:** **Chapter 8 – Database Environment Strategy (Development, QA, UAT, Staging & Production)**.

---

# Chapter 8 — Database Environment Strategy (Development, QA, UAT, Staging & Production)

---

# 8.1 Introduction

The Database Environment Strategy defines how the Mediverse database platform is organized across the software development lifecycle. Each environment has a clearly defined purpose, isolated infrastructure, dedicated datasets, and controlled deployment policies to ensure quality, security, stability, and reliable software delivery.

The strategy prevents configuration drift, protects production data, supports continuous integration and delivery, and enables safe validation before software reaches end users.

The Mediverse platform uses six primary environments:

* Local Development
* Development (DEV)
* Quality Assurance (QA)
* User Acceptance Testing (UAT)
* Staging (PRE-PROD)
* Production (PROD)

An additional **Disaster Recovery (DR)** environment is maintained for business continuity.

---

# 8.2 Objectives

The environment strategy aims to:

* Standardize infrastructure across environments.
* Isolate workloads and data.
* Prevent accidental production changes.
* Enable safe feature validation.
* Support automated deployments.
* Protect sensitive information.
* Simplify troubleshooting.
* Improve release quality.
* Ensure regulatory compliance.
* Support disaster recovery planning.

---

### ENV-001

Each environment shall have a clearly defined business purpose.

---

### ENV-002

No environment shall directly share production databases.

---

# 8.3 Environment Lifecycle

The database progresses through environments in a controlled manner.

```text id="u3d9s8"
Developer
     │
Local
     │
Development
     │
QA
     │
UAT
     │
Staging
     │
Production
     │
Disaster Recovery
```

Each promotion requires successful validation before progressing to the next stage.

---

### ENV-003

Database schema changes shall follow the defined promotion path.

---

### ENV-004

Production deployments shall occur only after successful staging validation.

---

# 8.4 Environment Overview

| Environment       | Purpose                   | Data Type                       | Availability      |
| ----------------- | ------------------------- | ------------------------------- | ----------------- |
| Local             | Individual development    | Sample data                     | Developer managed |
| Development       | Feature integration       | Synthetic data                  | Business hours    |
| QA                | Functional/system testing | Test data                       | High              |
| UAT               | Business validation       | Sanitized production-like data  | High              |
| Staging           | Production simulation     | Production-sized sanitized data | Very High         |
| Production        | Live users                | Real production data            | Highest           |
| Disaster Recovery | Emergency failover        | Replicated production data      | Standby           |

Each environment has dedicated infrastructure and independent deployment pipelines.

---

### ENV-005

Production data shall never be used in lower environments without approved sanitization.

---

### ENV-006

Every environment shall maintain independent database instances.

---

# 8.5 Local Development Environment

The Local environment supports individual developer productivity.

Characteristics:

* Docker-based PostgreSQL
* Local Flyway migrations
* Lightweight datasets
* Mock integrations
* Debug logging
* Rapid schema experimentation

Developers may reset local databases without affecting shared environments.

---

### ENV-007

Local databases shall be disposable and reproducible.

---

### ENV-008

Local environments shall mirror production schema structure.

---

# 8.6 Development Environment (DEV)

The Development environment integrates work from multiple developers.

Purpose:

* Continuous integration
* API development
* Schema validation
* Automated builds
* Feature testing

Typical characteristics:

* Shared PostgreSQL instance
* Continuous deployment
* Frequent schema changes
* Synthetic datasets
* Integration testing

---

### ENV-009

Development databases shall automatically apply Flyway migrations.

---

### ENV-010

Development environments may be refreshed when necessary.

---

# 8.7 Quality Assurance Environment (QA)

The QA environment validates software quality before business testing.

Activities include:

* Functional testing
* Integration testing
* Regression testing
* API validation
* Database validation
* Performance smoke testing

QA databases contain deterministic test datasets.

---

### ENV-011

QA databases shall remain stable during active testing cycles.

---

### ENV-012

Test data shall be repeatable and well documented.

---

# 8.8 User Acceptance Testing (UAT)

The UAT environment enables business stakeholders to validate functionality.

Characteristics:

* Business-approved datasets
* Production-like configuration
* Controlled releases
* End-to-end workflow validation
* User acceptance testing

Sensitive information must be anonymized.

---

### ENV-013

UAT data shall be sanitized before use.

---

### ENV-014

Business users shall not access production databases during acceptance testing.

---

# 8.9 Staging Environment

The Staging environment closely mirrors production.

Configuration includes:

* Production-sized infrastructure
* Production configuration
* Production deployment process
* Production security controls
* Production monitoring
* Production backup strategy

Staging serves as the final verification point before production release.

---

### ENV-015

Staging infrastructure shall closely match production.

---

### ENV-016

All production releases shall undergo staging validation.

---

# 8.10 Production Environment

The Production environment hosts live educational services.

Characteristics:

* High availability
* Automated backups
* Continuous monitoring
* Security enforcement
* Read replicas (future)
* Disaster recovery
* Performance optimization
* Strict change management

Production changes require formal approval.

---

### ENV-017

Production databases shall support continuous availability.

---

### ENV-018

Direct production modifications shall follow approved change management procedures.

---

# 8.11 Disaster Recovery Environment

The Disaster Recovery environment supports rapid restoration following catastrophic failures.

Capabilities include:

* Replicated production data
* Backup restoration
* Point-in-Time Recovery (PITR)
* Infrastructure recreation
* DNS failover
* Recovery validation

Recovery objectives:

| Objective                      | Target       |
| ------------------------------ | ------------ |
| Recovery Time Objective (RTO)  | ≤ 60 Minutes |
| Recovery Point Objective (RPO) | ≤ 15 Minutes |

---

### ENV-019

Disaster recovery infrastructure shall be regularly tested.

---

### ENV-020

Recovery procedures shall be documented and validated.

---

# 8.12 Configuration Management

Each environment maintains independent configuration.

Configuration categories:

* Database credentials
* Resource limits
* Connection pool settings
* Logging levels
* Monitoring configuration
* Backup schedules
* Feature flags

Environment-specific values are managed externally.

---

### ENV-021

Configuration shall remain environment-specific.

---

### ENV-022

Secrets shall never be committed to source control.

---

# 8.13 Data Management Strategy

Different environments use different classes of data.

| Environment       | Data Source                    |
| ----------------- | ------------------------------ |
| Local             | Sample data                    |
| Development       | Synthetic data                 |
| QA                | Controlled test datasets       |
| UAT               | Sanitized production-like data |
| Staging           | Large sanitized datasets       |
| Production        | Live business data             |
| Disaster Recovery | Replicated production data     |

Data privacy policies apply to every non-production environment.

---

### ENV-023

Sensitive information shall be anonymized before non-production use.

---

### ENV-024

Data refresh procedures shall preserve regulatory compliance.

---

# 8.14 Environment Promotion Strategy

Schema and application changes follow controlled promotion.

```text id="7lwk1e"
Local Development
        │
Feature Validation
        │
Development
        │
Automated Testing
        │
QA
        │
Business Approval
        │
UAT
        │
Release Validation
        │
Staging
        │
Production Deployment
```

Flyway ensures database schema consistency throughout promotion.

---

### ENV-025

Database migrations shall execute consistently across every environment.

---

### ENV-026

Promotion failures shall block further deployment until resolved.

---

# 8.15 Governance

Environment governance includes:

* Environment ownership
* Access control
* Data retention
* Security audits
* Configuration reviews
* Capacity planning
* Backup verification
* Compliance validation

Governance ensures consistency across the entire deployment lifecycle.

---

### ENV-027

Environment standards shall be reviewed periodically.

---

### ENV-028

Environment documentation shall remain synchronized with deployed infrastructure.

---

# 8.16 Best Practices

The Mediverse platform follows these environment management best practices:

* Maintain isolated databases for every environment.
* Keep staging as close to production as possible.
* Use synthetic or sanitized data outside production.
* Automate database provisioning.
* Version-control all schema migrations.
* Apply identical deployment processes across environments.
* Monitor every environment appropriately.
* Validate disaster recovery regularly.
* Restrict production access using least-privilege principles.
* Continuously review environment configurations for consistency.

These practices improve deployment reliability, security, and operational efficiency.

---

# 8.17 Traceability

This chapter defines the database environment strategy used throughout the Mediverse platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Database Deployment Architecture
* DevOps & Infrastructure Guide
* Disaster Recovery Plan
* Architecture Decision Records (ADR)

**Applies To**

* Local Development
* Development
* QA
* UAT
* Staging
* Production
* Disaster Recovery
* Kubernetes Infrastructure
* PostgreSQL Deployments

---

# Chapter Summary

This chapter defines the Database Environment Strategy for the Mediverse platform. It establishes the purpose, configuration, data management approach, promotion workflow, governance, and operational standards for Local, Development, QA, UAT, Staging, Production, and Disaster Recovery environments. By enforcing isolated infrastructure, controlled data usage, automated schema promotion, and standardized deployment practices, the strategy ensures secure, reliable, and consistent database operations across the entire software development lifecycle.

---

**End of Chapter 8**

**Next:** **Chapter 9 – Database Naming Conventions**.

---

# Chapter 9 — Database Naming Conventions

---

# 9.1 Introduction

Database naming conventions establish a consistent, readable, and maintainable standard for all database objects within the Mediverse platform. Consistent naming improves collaboration between developers, database administrators, DevOps engineers, AI engineers, and operations teams while reducing ambiguity and simplifying maintenance.

A standardized naming strategy also enables:

* Easier database navigation
* Better code readability
* Automated tooling compatibility
* Consistent documentation
* Simplified troubleshooting
* Improved migration management
* Long-term maintainability

Every database object created within Mediverse shall comply with the conventions defined in this chapter.

---

# 9.2 Objectives

The naming convention aims to:

* Standardize database object names.
* Improve readability.
* Simplify maintenance.
* Prevent naming conflicts.
* Support automation.
* Improve SQL consistency.
* Facilitate onboarding.
* Enable efficient documentation.
* Reduce implementation errors.
* Ensure enterprise-wide consistency.

---

### NC-001

Every database object shall follow approved naming conventions.

---

### NC-002

Names shall be descriptive, meaningful, and consistent.

---

# 9.3 General Naming Rules

The following rules apply to all database objects.

### Character Set

Use:

* Lowercase English letters (`a-z`)
* Numbers (`0-9`)
* Underscores (`_`)

Avoid:

* Spaces
* Special characters
* Hyphens
* Reserved SQL keywords

---

### Word Separation

Multiple words shall be separated using underscores.

**Correct**

```text id="nm1"
student_progress
course_enrollment
assessment_result
```

**Incorrect**

```text id="nm2"
StudentProgress
student-progress
student progress
Student_Progress
```

---

### Singular vs Plural

Tables representing collections shall use **plural nouns**.

Examples:

* users
* courses
* lessons
* assessments
* certificates

Reference or lookup tables may use descriptive plural names.

---

### NC-003

Database object names shall use lowercase snake_case.

---

### NC-004

Reserved SQL keywords shall not be used as object names.

---

# 9.4 Schema Naming Conventions

Schemas group related business domains.

Examples:

| Schema         | Purpose             |
| -------------- | ------------------- |
| auth           | Authentication      |
| users          | User Management     |
| academics      | Courses & Lessons   |
| assessments    | Exams               |
| analytics      | Reporting           |
| notifications  | Notifications       |
| media          | Media Metadata      |
| ai             | AI Services         |
| audit          | Audit Logs          |
| administration | Administrative Data |

Schema names should remain short, descriptive, and domain-oriented.

---

### NC-005

Schema names shall represent bounded business domains.

---

### NC-006

Schemas shall avoid environment-specific names.

---

# 9.5 Table Naming Conventions

Tables represent business entities.

Examples:

| Entity      | Table           |
| ----------- | --------------- |
| User        | users           |
| Student     | students        |
| Faculty     | faculty_members |
| Course      | courses         |
| Lesson      | lessons         |
| Enrollment  | enrollments     |
| Assessment  | assessments     |
| Certificate | certificates    |

Avoid unnecessary prefixes such as:

* tbl_
* t_
* data_

---

### NC-007

Table names shall describe business entities.

---

### NC-008

Technical prefixes shall not be used in table names.

---

# 9.6 Column Naming Conventions

Columns describe attributes of an entity.

Examples:

| Attribute    | Column       |
| ------------ | ------------ |
| Identifier   | id           |
| First Name   | first_name   |
| Last Name    | last_name    |
| Email        | email        |
| Phone        | phone_number |
| Created Time | created_at   |
| Updated Time | updated_at   |
| Deleted Time | deleted_at   |

Boolean fields should begin with:

* is_
* has_
* can_

Examples:

* is_active
* has_completed
* can_download

---

### NC-009

Column names shall clearly describe stored data.

---

### NC-010

Boolean columns shall use affirmative naming.

---

# 9.7 Primary Key Naming

Every table shall contain a primary key.

Standard:

```text id="pk1"
id
```

Examples:

```text id="pk2"
users.id
courses.id
students.id
```

UUIDs are recommended for distributed systems.

---

### NC-011

Primary keys shall use the standard name **id**.

---

### NC-012

Primary keys shall remain immutable after creation.

---

# 9.8 Foreign Key Naming

Foreign key columns reference primary keys from related tables.

Examples:

| Relationship          | Column     |
| --------------------- | ---------- |
| Student → User        | user_id    |
| Lesson → Course       | course_id  |
| Course → Faculty      | faculty_id |
| Certificate → Student | student_id |

---

### NC-013

Foreign key columns shall use the referenced entity name followed by `_id`.

---

### NC-014

Foreign key names shall match referenced business entities.

---

# 9.9 Constraint Naming

Constraints shall follow standardized prefixes.

| Constraint  | Prefix |
| ----------- | ------ |
| Primary Key | pk_    |
| Foreign Key | fk_    |
| Unique      | uq_    |
| Check       | chk_   |
| Default     | df_    |

Examples:

```text id="con1"
pk_users
fk_students_user
uq_users_email
chk_score_range
```

---

### NC-015

Constraint names shall clearly indicate their purpose.

---

### NC-016

Constraint names shall remain unique within the schema.

---

# 9.10 Index Naming

Indexes improve query performance.

Naming format:

```text id="idx1"
idx_<table>_<column>
```

Examples:

```text id="idx2"
idx_users_email
idx_courses_title
idx_assessments_status
idx_progress_student_id
```

Composite indexes:

```text id="idx3"
idx_enrollments_student_course
```

---

### NC-017

Index names shall identify both table and indexed columns.

---

### NC-018

Unused indexes shall be periodically reviewed.

---

# 9.11 View Naming

Views provide reusable query abstractions.

Naming format:

```text id="view1"
vw_<business_name>
```

Examples:

```text id="view2"
vw_active_students
vw_course_statistics
vw_assessment_summary
```

Materialized views:

```text id="view3"
mv_course_analytics
```

---

### NC-019

Views shall use the `vw_` prefix.

---

### NC-020

Materialized views shall use the `mv_` prefix.

---

# 9.12 Function & Procedure Naming

Functions and stored procedures shall begin with action verbs.

Examples:

```text id="func1"
calculate_final_score()
generate_certificate()
archive_completed_courses()
refresh_course_statistics()
```

Avoid ambiguous names such as:

```text id="func2"
process()
execute()
run()
test()
```

---

### NC-021

Functions shall describe their business purpose.

---

### NC-022

Procedure names shall begin with meaningful action verbs.

---

# 9.13 Trigger Naming

Triggers follow a consistent format.

```text id="trg1"
trg_<table>_<event>
```

Examples:

```text id="trg2"
trg_users_insert
trg_courses_update
trg_assessments_delete
```

---

### NC-023

Trigger names shall include both table and triggering event.

---

### NC-024

Trigger implementations shall be documented.

---

# 9.14 Sequence Naming

Sequences support identifier generation where required.

Naming format:

```text id="seq1"
seq_<table>
```

Examples:

```text id="seq2"
seq_users
seq_courses
seq_certificates
```

---

### NC-025

Sequence names shall correspond to the associated table.

---

### NC-026

Unused sequences shall be removed during schema maintenance.

---

# 9.15 Audit & History Tables

Audit tables maintain historical records.

Naming format:

```text id="audit1"
audit_<table>
history_<table>
```

Examples:

```text id="audit2"
audit_users
history_courses
audit_assessments
```

---

### NC-027

Audit table names shall clearly distinguish historical data from operational data.

---

### NC-028

History tables shall follow consistent retention policies.

---

# 9.16 Reserved Prefixes

The following prefixes are reserved.

| Prefix   | Usage              |
| -------- | ------------------ |
| pk_      | Primary Key        |
| fk_      | Foreign Key        |
| uq_      | Unique Constraint  |
| chk_     | Check Constraint   |
| df_      | Default Constraint |
| idx_     | Index              |
| vw_      | View               |
| mv_      | Materialized View  |
| trg_     | Trigger            |
| seq_     | Sequence           |
| audit_   | Audit Table        |
| history_ | History Table      |

No other purpose may reuse these reserved prefixes.

---

# 9.17 Governance

Naming standards are governed through:

* Architecture reviews
* Database code reviews
* Automated linting
* Flyway migration validation
* Documentation reviews
* CI/CD quality gates

Violations must be corrected before deployment.

---

### NC-029

Naming convention compliance shall be validated during code review.

---

### NC-030

Exceptions to naming standards require architectural approval through an ADR.

---

# 9.18 Traceability

This chapter defines the naming standards governing all database objects in the Mediverse platform.

**Related Documents**

* Database Design Principles
* Technology Stack & Version Matrix
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Schemas
* Tables
* Columns
* Constraints
* Indexes
* Views
* Functions
* Procedures
* Triggers
* Sequences
* Audit Objects

---

# Chapter Summary

This chapter establishes the official database naming conventions for the Mediverse platform. It defines consistent standards for schemas, tables, columns, keys, constraints, indexes, views, functions, procedures, triggers, sequences, and audit objects. By enforcing descriptive, predictable, and standardized naming practices, the platform improves readability, maintainability, automation, and long-term governance while reducing ambiguity and implementation errors across the enterprise database ecosystem.

---

**End of Chapter 9**

**Next:** **Chapter 10 – Database Object Standards**.

---

# Chapter 10 — Database Object Standards

---

# 10.1 Introduction

Database Object Standards define the engineering rules, implementation guidelines, quality requirements, and governance practices for every database object used within the Mediverse platform.

The objective of these standards is to ensure that all database objects are:

* Consistent
* Secure
* Performant
* Maintainable
* Scalable
* Well documented
* Version controlled

Every schema object—including tables, columns, indexes, constraints, views, functions, triggers, sequences, and materialized views—must conform to these standards.

---

# 10.2 Objectives

The Database Object Standards aim to:

* Standardize all database objects.
* Improve maintainability.
* Simplify database evolution.
* Increase query performance.
* Reduce implementation errors.
* Improve security.
* Enable automated validation.
* Support enterprise governance.
* Facilitate onboarding.
* Ensure production readiness.

---

### DOS-001

Every database object shall comply with the approved engineering standards.

---

### DOS-002

All objects shall have a clearly documented business purpose.

---

# 10.3 Database Object Classification

Database objects are grouped into logical categories.

| Category        | Objects                                 |
| --------------- | --------------------------------------- |
| Structural      | Schemas, Tables, Columns                |
| Integrity       | Primary Keys, Foreign Keys, Constraints |
| Performance     | Indexes, Materialized Views             |
| Programmability | Functions, Procedures, Triggers         |
| Storage         | Sequences                               |
| Presentation    | Views                                   |
| Security        | Roles, Permissions                      |
| Operational     | Audit Tables, History Tables            |

Each category has dedicated implementation standards.

---

### DOS-003

Objects shall be classified according to their functional purpose.

---

### DOS-004

Unnecessary database objects shall not be created.

---

# 10.4 Schema Standards

Schemas organize business domains.

Requirements:

* One bounded business domain per schema.
* Avoid cross-domain ownership.
* Use lowercase snake_case.
* Keep schemas modular.
* Maintain clear documentation.

Example:

```text id="sch1"
auth
users
academics
assessments
analytics
notifications
media
ai
audit
administration
```

---

### DOS-005

Schemas shall represent business capabilities.

---

### DOS-006

Schema ownership shall be clearly documented.

---

# 10.5 Table Standards

Every table shall comply with the following standards.

Mandatory characteristics:

* Primary Key
* Audit columns
* Appropriate constraints
* Foreign keys
* Business documentation
* Index strategy
* Version-controlled creation

Standard audit columns:

| Column     | Purpose                               |
| ---------- | ------------------------------------- |
| id         | Primary key                           |
| created_at | Creation timestamp                    |
| updated_at | Last update timestamp                 |
| created_by | Creator identifier                    |
| updated_by | Last modifier                         |
| deleted_at | Soft delete timestamp (if applicable) |

---

### DOS-007

Every table shall contain a primary key.

---

### DOS-008

Operational tables shall include audit metadata.

---

# 10.6 Column Standards

Columns represent individual business attributes.

Guidelines:

* Use meaningful names.
* Select appropriate data types.
* Define NOT NULL where required.
* Avoid excessive column lengths.
* Use defaults where appropriate.

Example:

| Column     | Data Type                |
| ---------- | ------------------------ |
| id         | UUID                     |
| first_name | VARCHAR(100)             |
| email      | VARCHAR(255)             |
| is_active  | BOOLEAN                  |
| created_at | TIMESTAMP WITH TIME ZONE |

---

### DOS-009

Column definitions shall reflect business requirements.

---

### DOS-010

Nullable columns shall be minimized.

---

# 10.7 Constraint Standards

Constraints preserve data integrity.

Required constraint types:

* Primary Key
* Foreign Key
* Unique
* Check
* Default
* NOT NULL

Examples:

```sql
CHECK (score >= 0 AND score <= 100)

UNIQUE(email)

NOT NULL

DEFAULT CURRENT_TIMESTAMP
```

Constraints should prevent invalid data rather than relying solely on application logic.

---

### DOS-011

Business integrity rules shall be enforced through constraints where appropriate.

---

### DOS-012

Constraint violations shall prevent invalid transactions.

---

# 10.8 Index Standards

Indexes improve database performance.

Index creation guidelines:

* Create indexes for frequent search columns.
* Support JOIN operations.
* Optimize sorting.
* Optimize filtering.
* Avoid duplicate indexes.
* Monitor index usage.

Types:

* B-tree
* Hash (where appropriate)
* GIN
* GiST
* BRIN

Composite indexes should follow query access patterns.

---

### DOS-013

Indexes shall be workload driven.

---

### DOS-014

Unused indexes shall be periodically reviewed and removed.

---

# 10.9 View Standards

Views simplify data access.

Guidelines:

* Encapsulate reusable queries.
* Hide unnecessary complexity.
* Support reporting.
* Restrict sensitive data exposure.

Examples:

```text id="vw1"
vw_active_students

vw_course_statistics

vw_assessment_results
```

Materialized views should be used for expensive analytical queries.

---

### DOS-015

Views shall expose business-friendly representations.

---

### DOS-016

Materialized views shall define refresh strategies.

---

# 10.10 Function & Procedure Standards

Database functions must remain focused and deterministic whenever possible.

Appropriate uses:

* Business calculations
* Validation
* Utility functions
* Data transformations
* Reporting support

Avoid:

* Complex business workflows
* External API calls
* Long-running operations

Functions should remain modular and testable.

---

### DOS-017

Functions shall perform a single well-defined responsibility.

---

### DOS-018

Stored procedures shall be documented and version controlled.

---

# 10.11 Trigger Standards

Triggers should be used sparingly.

Appropriate uses:

* Audit logging
* Automatic timestamps
* Derived field maintenance
* Integrity enforcement

Avoid:

* Hidden business logic
* Long-running operations
* External integrations

Trigger execution should be predictable.

---

### DOS-019

Triggers shall remain lightweight and deterministic.

---

### DOS-020

Business workflows shall primarily reside within the application layer.

---

# 10.12 Sequence Standards

Sequences generate unique identifiers where UUIDs are not used.

Guidelines:

* One sequence per entity.
* Document ownership.
* Avoid shared sequences.
* Monitor utilization.

Example:

```text id="seqstd"
seq_courses

seq_assessments

seq_certificates
```

---

### DOS-021

Sequence ownership shall be explicit.

---

### DOS-022

Sequence values shall not be manually modified except through approved administrative procedures.

---

# 10.13 Audit Object Standards

Audit objects provide historical traceability.

Audit records should include:

* User
* Timestamp
* Operation
* Previous values
* New values
* Source system
* Transaction identifier

Audit data must remain immutable.

---

### DOS-023

Audit records shall not be modified after creation.

---

### DOS-024

Critical business operations shall generate audit events.

---

# 10.14 Documentation Standards

Every database object shall include supporting documentation.

Documentation should specify:

* Business purpose
* Ownership
* Relationships
* Constraints
* Dependencies
* Performance considerations
* Security classification

Documentation is maintained alongside version-controlled migrations.

---

### DOS-025

Database documentation shall remain synchronized with implementation.

---

### DOS-026

Undocumented production objects shall not be introduced.

---

# 10.15 Version Control Standards

All database objects shall be created and modified through version-controlled migration scripts.

Requirements:

* Flyway-managed migrations
* Immutable migration history
* Peer review
* Automated validation
* Rollback planning

Direct production schema modifications are prohibited.

---

### DOS-027

Schema changes shall be deployed through approved migration processes.

---

### DOS-028

Manual production database changes require documented approval.

---

# 10.16 Quality Assurance Standards

Database objects shall undergo validation before deployment.

Validation includes:

* Naming convention compliance
* Constraint verification
* Performance testing
* Security review
* Migration testing
* Documentation review
* Dependency analysis

Quality gates are enforced within the CI/CD pipeline.

---

### DOS-029

Database objects shall pass automated validation before deployment.

---

### DOS-030

Production deployments shall satisfy all database quality gates.

---

# 10.17 Governance

Database object governance includes:

* Architecture review
* Database design review
* Code review
* Security assessment
* Performance assessment
* Documentation review
* Operational readiness review
* Periodic compliance audits

Governance ensures that database objects remain aligned with enterprise standards throughout their lifecycle.

---

# 10.18 Traceability

This chapter defines the implementation standards governing every database object within the Mediverse platform.

**Related Documents**

* Database Design Principles
* Database Naming Conventions
* Technology Stack & Version Matrix
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Schemas
* Tables
* Columns
* Constraints
* Indexes
* Views
* Materialized Views
* Functions
* Procedures
* Triggers
* Sequences
* Audit Objects

---

# Chapter Summary

This chapter establishes the Database Object Standards for the Mediverse platform. It defines mandatory engineering practices for creating, managing, documenting, securing, and governing every database object, including schemas, tables, columns, constraints, indexes, views, functions, triggers, sequences, and audit objects. By enforcing standardized implementation, documentation, quality assurance, and version control, these standards ensure that the Mediverse database remains consistent, secure, scalable, maintainable, and production-ready throughout its lifecycle.

---

**End of Chapter 10**

**Next:** **Chapter 11 – Conceptual Data Model**.

---

# Chapter 11 — Conceptual Data Model

---

# 11.1 Introduction

The **Conceptual Data Model (CDM)** provides the highest-level representation of the Mediverse data architecture. It identifies the core business entities, their relationships, and business rules without considering physical implementation details such as tables, columns, indexes, or database-specific features.

The conceptual model serves as the common language between:

* Business Stakeholders
* Product Owners
* Medical Subject Matter Experts
* Solution Architects
* Database Architects
* Backend Developers
* AI Engineers
* QA Engineers

Its primary purpose is to ensure that the database accurately reflects the business domain before logical and physical database design begins.

---

# 11.2 Objectives

The Conceptual Data Model aims to:

* Identify all major business entities.
* Define high-level business relationships.
* Establish domain boundaries.
* Eliminate ambiguity.
* Provide a common understanding across stakeholders.
* Support Domain-Driven Design (DDD).
* Prepare for logical modeling.
* Ensure business completeness.
* Simplify future expansion.
* Maintain traceability with business requirements.

---

### CDM-001

Every persistent business capability shall be represented by one or more conceptual entities.

---

### CDM-002

The conceptual model shall remain independent of implementation technology.

---

# 11.3 Conceptual Modeling Principles

The Mediverse Conceptual Data Model follows these principles:

### Business-Driven

Entities represent business concepts rather than technical objects.

### Technology Independent

The conceptual model does not define:

* Tables
* Columns
* Data Types
* Indexes
* Constraints

### Domain-Oriented

Entities are grouped into bounded business domains.

### Minimal Redundancy

Each business concept appears only once.

### Extensible

The model supports future educational and AI capabilities.

---

### CDM-003

Conceptual entities shall describe business objects rather than software classes.

---

### CDM-004

Technical implementation details shall be deferred to later design phases.

---

# 11.4 Business Domains

The Mediverse platform is divided into multiple conceptual domains.

| Domain          | Business Purpose               |
| --------------- | ------------------------------ |
| Identity        | Authentication & Authorization |
| User Management | User lifecycle                 |
| Institution     | Colleges & Universities        |
| Academic        | Courses & Lessons              |
| Learning        | Student learning activities    |
| Assessment      | Exams & Evaluations            |
| Certification   | Certificates                   |
| AI Learning     | AI Tutor & Recommendations     |
| Media           | Educational resources          |
| Notification    | Communication                  |
| Analytics       | Reporting & Dashboards         |
| Administration  | Platform management            |
| Audit           | Compliance & Traceability      |

Each domain encapsulates a cohesive business capability.

---

### CDM-005

Business domains shall align with bounded contexts defined in the software architecture.

---

### CDM-006

Cross-domain dependencies shall be minimized.

---

# 11.5 Core Business Entities

The following conceptual entities form the foundation of the Mediverse platform.

## Identity Domain

* User
* Role
* Permission
* Session
* Authentication Provider

---

## Institution Domain

* Institution
* Campus
* Department
* Academic Year
* Batch

---

## Academic Domain

* Course
* Module
* Lesson
* Topic
* Learning Resource

---

## Learning Domain

* Student
* Enrollment
* Learning Progress
* Study Plan
* Bookmark

---

## Assessment Domain

* Assessment
* Question Bank
* Question
* Answer
* Submission
* Evaluation

---

## Certification Domain

* Certificate
* Completion Record

---

## AI Domain

* AI Tutor Session
* Prompt
* AI Response
* Knowledge Source
* Recommendation

---

## Media Domain

* Image
* Video
* PDF
* Audio
* 3D Model

---

## Notification Domain

* Notification
* Announcement
* Email
* Message

---

## Analytics Domain

* Learning Metric
* Assessment Metric
* Institution Metric
* Dashboard

---

## Audit Domain

* Audit Event
* Activity Log
* Security Event

---

### CDM-007

Every business entity shall have a documented business definition.

---

### CDM-008

Entity ownership shall be assigned to a business domain.

---

# 11.6 High-Level Conceptual Relationships

The following relationships describe how major business entities interact.

```text id="cdm1"
Institution
     │
     ├──────────────┐
     ▼              ▼
Department      Academic Year
     │
     ▼
Course
     │
     ▼
Module
     │
     ▼
Lesson
     │
     ▼
Learning Resource
```

Academic content is organized hierarchically from institutions to learning resources.

---

```text id="cdm2"
Student
     │
Enrollment
     │
Course
     │
Assessment
     │
Submission
     │
Certificate
```

This relationship represents the learner's educational journey.

---

```text id="cdm3"
Student
     │
AI Tutor
     │
Prompt
     │
AI Response
     │
Knowledge Source
```

This relationship supports AI-assisted learning.

---

### CDM-009

Relationships shall reflect real-world business interactions.

---

### CDM-010

Relationship definitions shall remain technology independent.

---

# 11.7 Cardinality Overview

Representative conceptual cardinalities include:

| Relationship             | Cardinality |
| ------------------------ | ----------- |
| Institution → Department | 1 : Many    |
| Department → Course      | 1 : Many    |
| Course → Module          | 1 : Many    |
| Module → Lesson          | 1 : Many    |
| Lesson → Resource        | 1 : Many    |
| Student → Enrollment     | 1 : Many    |
| Course → Enrollment      | 1 : Many    |
| Assessment → Question    | 1 : Many    |
| Student → Submission     | 1 : Many    |
| Student → Certificate    | 1 : Many    |
| Student → AI Session     | 1 : Many    |

Detailed cardinality rules are defined during logical modeling.

---

### CDM-011

Conceptual relationships shall define business cardinality.

---

### CDM-012

Detailed implementation constraints belong to the logical model.

---

# 11.8 Business Rules

Representative business rules include:

* A student may enroll in multiple courses.
* A course belongs to one academic department.
* Every lesson belongs to exactly one module.
* Every assessment belongs to one course.
* A certificate is issued only after successful completion.
* AI tutor sessions are associated with authenticated users.
* Notifications may target individuals or groups.
* Audit events are immutable.
* Learning progress is continuously updated.
* Educational resources may be shared across lessons where appropriate.

These rules define the semantics of the conceptual model.

---

### CDM-013

Business rules shall be documented independently of implementation.

---

### CDM-014

Conceptual rules shall trace to functional requirements.

---

# 11.9 Domain Interaction Model

Business domains interact while maintaining clear ownership.

```text id="cdm4"
Identity
     │
User
     │
Learning
     │
Assessment
     │
Certification
     │
Analytics
```

Supporting domains include:

* AI
* Notifications
* Media
* Audit
* Administration

This interaction model aligns with the platform's microservices architecture.

---

### CDM-015

Domain interactions shall preserve loose coupling.

---

### CDM-016

Each domain shall own its business entities.

---

# 11.10 Conceptual Data Flow

The high-level business data flow is:

```text id="cdm5"
User
   │
Authentication
   │
Enrollment
   │
Learning
   │
Assessment
   │
Certification
   │
Analytics
```

AI services and notifications operate alongside this core educational workflow.

---

### CDM-017

The conceptual model shall support the complete learner lifecycle.

---

### CDM-018

Supporting services shall integrate without violating domain boundaries.

---

# 11.11 Assumptions

The conceptual model assumes:

* Institutions may contain multiple departments.
* Students may enroll in multiple courses.
* Faculty may teach multiple courses.
* Courses contain multiple modules.
* Modules contain multiple lessons.
* Lessons may reference multiple learning resources.
* AI services augment rather than replace educational content.
* Historical records are retained for compliance.
* Future modules can be introduced without redesigning existing domains.

---

### CDM-019

Conceptual assumptions shall be validated with business stakeholders.

---

### CDM-020

Changes to assumptions shall be reviewed through architecture governance.

---

# 11.12 Governance

Conceptual models are governed through:

* Business review
* Architecture review
* Domain modeling workshops
* Product owner approval
* Traceability validation
* Documentation review
* Change management
* Architecture Decision Records (ADR)

Conceptual changes must be approved before logical or physical database modifications.

---

### CDM-021

Conceptual model revisions require formal review.

---

### CDM-022

Approved conceptual changes shall propagate to downstream design artifacts.

---

# 11.13 Traceability

This chapter defines the conceptual representation of the Mediverse business data model.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Database Design Principles
* Architecture Decision Records (ADR)

**Applies To**

* Business Domains
* Core Entities
* Business Relationships
* Learner Lifecycle
* AI Services
* Educational Workflows
* Analytics
* Audit

---

# Chapter Summary

This chapter presents the Conceptual Data Model for the Mediverse platform. It identifies the core business domains, conceptual entities, relationships, cardinalities, business rules, and data flows that define the enterprise data landscape. By remaining independent of implementation details, the conceptual model establishes a shared business understanding and provides the foundation for the logical and physical database designs developed in subsequent chapters.

---

**End of Chapter 11**

**Next:** **Chapter 12 – Logical Data Model**.

---

# Chapter 12 — Logical Data Model

---

# 12.1 Introduction

The **Logical Data Model (LDM)** transforms the business-oriented Conceptual Data Model into a structured logical representation suitable for implementation in a relational database management system (RDBMS). It defines entities, attributes, relationships, cardinalities, keys, and integrity rules while remaining independent of any specific database technology.

The Logical Data Model serves as the bridge between business analysis and physical database implementation. It ensures that business requirements are translated into a normalized, scalable, and maintainable data structure.

For the Mediverse platform, the Logical Data Model supports:

* AI-powered medical education
* Multi-institution management
* Course lifecycle management
* Student learning journeys
* Assessments and certifications
* AI tutoring and recommendations
* Analytics and reporting
* Audit and compliance

---

# 12.2 Objectives

The Logical Data Model aims to:

* Translate conceptual entities into logical entities.
* Define entity attributes.
* Identify primary and alternate keys.
* Define relationships and cardinalities.
* Support normalized schema design.
* Eliminate redundancy.
* Preserve business integrity.
* Support future scalability.
* Enable traceability to business requirements.
* Prepare for physical schema implementation.

---

### LDM-001

Every conceptual entity shall map to one or more logical entities.

---

### LDM-002

Logical entities shall accurately represent business information.

---

# 12.3 Logical Modeling Principles

The Mediverse Logical Data Model follows these principles:

### Business Accuracy

Entities represent real business concepts.

### Normalization

Operational data targets Third Normal Form (3NF) or higher.

### Referential Integrity

Relationships are explicitly defined.

### Modularity

Entities are grouped by bounded business domains.

### Extensibility

The model accommodates future features without requiring major redesign.

### Technology Neutrality

The logical model does not specify:

* Storage engine
* Index implementation
* Partitioning strategy
* Database-specific optimizations

---

### LDM-003

Logical entities shall remain independent of physical implementation.

---

### LDM-004

Logical models shall support future schema evolution.

---

# 12.4 Domain-Based Logical Model

The logical model is organized into bounded domains.

| Domain        | Logical Entities                       |
| ------------- | -------------------------------------- |
| Identity      | User, Role, Permission, Session        |
| Institution   | Institution, Campus, Department, Batch |
| Academic      | Course, Module, Lesson, Topic          |
| Learning      | Enrollment, Progress, Bookmark         |
| Assessment    | Assessment, Question, Submission       |
| Certification | Certificate, Completion                |
| AI            | AI Session, Prompt, Response           |
| Media         | Media Asset, Resource                  |
| Notification  | Notification, Announcement             |
| Analytics     | Learning Metrics, Reports              |
| Audit         | Audit Event, Activity Log              |

Each domain owns its entities and relationships.

---

### LDM-005

Logical ownership shall align with bounded contexts.

---

### LDM-006

Cross-domain dependencies shall be minimized.

---

# 12.5 Core Logical Entities

Representative logical entities include:

### Identity

* User
* Role
* Permission
* User Role
* Refresh Token

---

### Academic

* Course
* Module
* Lesson
* Topic
* Resource

---

### Student

* Student
* Enrollment
* Progress
* Learning History

---

### Assessment

* Assessment
* Question
* Option
* Submission
* Result

---

### AI

* AI Session
* Prompt
* AI Response
* Knowledge Reference

---

### Certification

* Certificate
* Completion Record

---

### Administration

* Institution
* Department
* Faculty

---

### Audit

* Audit Event
* Login History
* Activity Log

---

### LDM-007

Every logical entity shall have a documented purpose.

---

### LDM-008

Logical entities shall support business traceability.

---

# 12.6 Entity Relationships

Representative logical relationships include:

```text id="ldm1"
Institution
      │
      ├─────────────┐
      ▼             ▼
Department      Faculty
      │
      ▼
Course
      │
      ▼
Module
      │
      ▼
Lesson
```

---

```text id="ldm2"
Student
     │
Enrollment
     │
Course
     │
Assessment
     │
Submission
     │
Result
     │
Certificate
```

---

```text id="ldm3"
User
     │
AI Session
     │
Prompt
     │
AI Response
```

Relationships define ownership, navigation, and business integrity.

---

### LDM-009

Logical relationships shall preserve business semantics.

---

### LDM-010

Relationship ownership shall be explicitly documented.

---

# 12.7 Cardinality Rules

Logical relationships specify cardinality.

| Relationship             | Cardinality |
| ------------------------ | ----------- |
| Institution → Department | 1 : Many    |
| Department → Faculty     | 1 : Many    |
| Department → Course      | 1 : Many    |
| Course → Module          | 1 : Many    |
| Module → Lesson          | 1 : Many    |
| Lesson → Resource        | 1 : Many    |
| Student → Enrollment     | 1 : Many    |
| Course → Enrollment      | 1 : Many    |
| Assessment → Question    | 1 : Many    |
| Assessment → Submission  | 1 : Many    |
| Student → Submission     | 1 : Many    |
| Student → Certificate    | 1 : Many    |
| User → AI Session        | 1 : Many    |
| AI Session → Prompt      | 1 : Many    |
| Prompt → AI Response     | 1 : Many    |

Many-to-many relationships are resolved through associative entities.

---

### LDM-011

Logical relationships shall explicitly define cardinality.

---

### LDM-012

Many-to-many relationships shall be resolved using associative entities.

---

# 12.8 Keys and Identifiers

Each logical entity requires a unique identifier.

Key categories:

* Primary Key
* Alternate Key
* Natural Key
* Foreign Key
* Composite Key (where required)

Examples:

| Entity      | Primary Identifier |
| ----------- | ------------------ |
| User        | User ID            |
| Course      | Course ID          |
| Student     | Student ID         |
| Assessment  | Assessment ID      |
| Certificate | Certificate ID     |

Business identifiers such as email addresses or registration numbers are modeled as alternate keys where appropriate.

---

### LDM-013

Every logical entity shall define a primary identifier.

---

### LDM-014

Business identifiers shall be modeled separately from technical identifiers.

---

# 12.9 Attribute Categories

Entity attributes are classified into standard categories.

| Category  | Examples                        |
| --------- | ------------------------------- |
| Identity  | ID, UUID                        |
| Business  | Name, Title, Description        |
| Status    | Active, Published, Completed    |
| Dates     | Created, Updated, Completed     |
| Ownership | Created By, Updated By          |
| Audit     | Version, Deleted Flag           |
| Metadata  | Tags, Notes, External Reference |

This classification improves consistency across the data model.

---

### LDM-015

Attributes shall be grouped according to their business purpose.

---

### LDM-016

Audit attributes shall be consistently applied to operational entities.

---

# 12.10 Normalization Strategy

The logical model follows normalization principles.

Target:

* First Normal Form (1NF)
* Second Normal Form (2NF)
* Third Normal Form (3NF)

Selective denormalization is permitted only for:

* Reporting
* Analytics
* Performance optimization

Such decisions are deferred to the Physical Data Model.

---

### LDM-017

Operational entities shall satisfy Third Normal Form (3NF).

---

### LDM-018

Denormalization decisions require documented architectural justification.

---

# 12.11 Business Rules

Representative logical rules include:

* Every student must reference a user account.
* Every course belongs to a department.
* Every lesson belongs to one module.
* Every assessment belongs to one course.
* A submission references exactly one assessment.
* Certificates require successful completion.
* AI sessions require authenticated users.
* Audit records are immutable.
* Notifications target users, groups, or institutions.

These rules will later be enforced through physical constraints.

---

### LDM-019

Business rules shall be traceable to logical entities and relationships.

---

### LDM-020

Integrity rules shall be validated before physical implementation.

---

# 12.12 Traceability Matrix

| Business Capability    | Logical Entities                 |
| ---------------------- | -------------------------------- |
| Authentication         | User, Role, Permission           |
| Institution Management | Institution, Department, Faculty |
| Course Management      | Course, Module, Lesson           |
| Learning               | Enrollment, Progress             |
| Assessment             | Assessment, Question, Submission |
| Certification          | Certificate                      |
| AI Learning            | AI Session, Prompt, Response     |
| Notifications          | Notification, Announcement       |
| Analytics              | Learning Metrics                 |
| Compliance             | Audit Event                      |

This matrix ensures alignment between business capabilities and logical structures.

---

### LDM-021

Every logical entity shall map to a business capability.

---

### LDM-022

Traceability shall be maintained throughout subsequent design phases.

---

# 12.13 Governance

Logical data models are governed through:

* Architecture reviews
* Data modeling workshops
* Business validation
* Normalization review
* Cross-domain dependency review
* Documentation review
* Change management
* Architecture Decision Records (ADR)

Any modification to the logical model must be reviewed before physical schema implementation.

---

# 12.14 Traceability

This chapter defines the Logical Data Model supporting the Mediverse platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Conceptual Data Model
* Database Design Principles
* Architecture Decision Records (ADR)

**Applies To**

* Logical Entities
* Relationships
* Attributes
* Business Rules
* Cardinalities
* Keys
* Domain Models

---

# Chapter Summary

This chapter presents the Logical Data Model for the Mediverse platform. It translates conceptual business entities into structured logical entities, defines relationships, cardinalities, keys, attributes, and normalization strategies, and establishes traceability between business capabilities and logical data structures. The Logical Data Model provides the blueprint for the subsequent Physical Data Model, ensuring a scalable, maintainable, and business-aligned database design.

---

**End of Chapter 12**

**Next:** **Chapter 13 – Physical Data Model**.

---

# Chapter 13 — Physical Data Model

---

# 13.1 Introduction

The **Physical Data Model (PDM)** transforms the Logical Data Model into a concrete implementation for the selected database platform—**PostgreSQL**. It defines how logical entities are physically represented as database schemas, tables, columns, data types, constraints, indexes, storage structures, and optimization mechanisms.

Unlike the Conceptual and Logical Data Models, the Physical Data Model is database-specific and incorporates implementation details required for performance, scalability, security, maintainability, and operational excellence.

The Physical Data Model serves as the definitive blueprint for database implementation, migration, and administration.

---

# 13.2 Objectives

The Physical Data Model aims to:

* Convert logical entities into physical tables.
* Define PostgreSQL data types.
* Specify primary and foreign keys.
* Define constraints and indexes.
* Optimize storage and query performance.
* Support high-volume transactional workloads.
* Enable efficient schema evolution.
* Ensure data integrity.
* Support disaster recovery and replication.
* Provide production-ready database implementation.

---

### PDM-001

Every logical entity shall map to one or more physical database tables.

---

### PDM-002

The physical model shall conform to PostgreSQL implementation standards.

---

# 13.3 Physical Architecture Overview

The Mediverse Physical Data Model is organized into multiple schemas aligned with business domains.

```text id="pdm1"
PostgreSQL Cluster
        │
        ├── auth
        ├── users
        ├── academics
        ├── assessments
        ├── media
        ├── notifications
        ├── analytics
        ├── ai
        ├── audit
        └── administration
```

Each schema encapsulates related database objects while minimizing cross-schema dependencies.

---

### PDM-003

Schemas shall correspond to bounded business domains.

---

### PDM-004

Cross-schema relationships shall be minimized and documented.

---

# 13.4 Table Structure Standards

Every operational table shall follow a standardized structure.

Typical layout:

| Category      | Example Columns          |
| ------------- | ------------------------ |
| Identifier    | id                       |
| Business Data | name, title, description |
| Status        | status, is_active        |
| Ownership     | created_by, updated_by   |
| Audit         | created_at, updated_at   |
| Optional      | deleted_at, version      |

This standard promotes consistency and simplifies application development.

---

### PDM-005

Operational tables shall include standard audit columns.

---

### PDM-006

Tables shall use descriptive names and follow approved naming conventions.

---

# 13.5 Physical Entity Mapping

Representative mappings between logical and physical entities are shown below.

| Logical Entity | Physical Table              |
| -------------- | --------------------------- |
| User           | auth.users                  |
| Role           | auth.roles                  |
| Permission     | auth.permissions            |
| Student        | users.students              |
| Faculty        | users.faculty_members       |
| Course         | academics.courses           |
| Module         | academics.modules           |
| Lesson         | academics.lessons           |
| Assessment     | assessments.assessments     |
| Submission     | assessments.submissions     |
| Certificate    | academics.certificates      |
| AI Session     | ai.ai_sessions              |
| Notification   | notifications.notifications |
| Audit Event    | audit.audit_events          |

Each table maps directly to a business capability.

---

### PDM-007

Physical tables shall preserve logical business semantics.

---

### PDM-008

Entity mappings shall remain traceable to the Logical Data Model.

---

# 13.6 Data Type Standards

The Mediverse platform standardizes PostgreSQL data types.

| Business Attribute | PostgreSQL Data Type        |
| ------------------ | --------------------------- |
| Identifier         | UUID                        |
| Name               | VARCHAR(100)                |
| Email              | VARCHAR(255)                |
| Description        | TEXT                        |
| Boolean            | BOOLEAN                     |
| Date               | DATE                        |
| Timestamp          | TIMESTAMPTZ                 |
| Integer            | INTEGER                     |
| Decimal            | NUMERIC(10,2)               |
| JSON Data          | JSONB                       |
| Binary Metadata    | BYTEA (only where required) |

Guidelines:

* Prefer `UUID` for distributed identifiers.
* Use `TEXT` for unbounded textual content.
* Use `JSONB` only for semi-structured data with clear justification.
* Avoid overly large `VARCHAR` lengths.

---

### PDM-009

Data types shall accurately reflect business requirements.

---

### PDM-010

Database-specific data types shall be standardized across all schemas.

---

# 13.7 Primary Key Strategy

Every table requires a primary key.

Standard strategy:

* UUID-based identifiers.
* Immutable values.
* Generated by the application or PostgreSQL extensions (for example, `gen_random_uuid()`).

Example:

```sql id="z3q1kp"
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

Benefits:

* Global uniqueness
* Distributed system compatibility
* Easier data synchronization
* Reduced key collision risk

---

### PDM-011

Primary keys shall use UUID unless an approved exception exists.

---

### PDM-012

Primary key values shall never be updated.

---

# 13.8 Foreign Key Strategy

Relationships are enforced through foreign keys.

Example:

```sql id="8ln2wd"
student_id UUID REFERENCES users.students(id)

course_id UUID REFERENCES academics.courses(id)
```

Foreign keys ensure:

* Referential integrity
* Controlled cascading behavior
* Relationship validation
* Prevention of orphan records

---

### PDM-013

Foreign keys shall enforce referential integrity.

---

### PDM-014

Cascade operations shall be explicitly documented and justified.

---

# 13.9 Physical Relationship Model

Representative physical relationships:

```text id="pdm2"
users.students
        │
        ▼
academics.enrollments
        │
        ▼
academics.courses
        │
        ▼
academics.modules
        │
        ▼
academics.lessons
```

Assessment flow:

```text id="pdm3"
assessments.assessments
          │
          ▼
assessments.questions
          │
          ▼
assessments.submissions
          │
          ▼
academics.certificates
```

These structures preserve the logical relationships while enabling efficient joins.

---

### PDM-015

Physical relationships shall accurately implement logical relationships.

---

### PDM-016

Relationship definitions shall support efficient query execution.

---

# 13.10 Storage Strategy

Storage is optimized according to data characteristics.

| Data Category      | Storage Strategy                  |
| ------------------ | --------------------------------- |
| Transactional Data | PostgreSQL tables                 |
| Large Media        | External object storage           |
| Metadata           | PostgreSQL                        |
| Cache              | Redis                             |
| Event Data         | Kafka                             |
| AI Embeddings      | External vector database (future) |

Large binary objects are stored externally, with only metadata retained in PostgreSQL.

---

### PDM-017

Large files shall not be stored directly in operational tables unless explicitly required.

---

### PDM-018

Metadata shall maintain references to externally stored content.

---

# 13.11 Physical Optimization

Optimization strategies include:

* Appropriate indexing
* Connection pooling
* Partitioning (for large datasets)
* Query optimization
* Materialized views
* Read replicas (future)
* Efficient join paths

Performance tuning shall be based on measured workload characteristics.

---

### PDM-019

Optimization strategies shall be evidence-based.

---

### PDM-020

Performance improvements shall not compromise data integrity.

---

# 13.12 Security Considerations

The physical model incorporates security controls.

Measures include:

* Row-Level Security (where appropriate)
* Encryption in transit (TLS)
* Encryption at rest
* Least-privilege access
* Role-based permissions
* Audit logging
* Secure backup storage

Sensitive attributes such as passwords are stored only as secure hashes.

---

### PDM-021

Sensitive information shall be protected using approved cryptographic methods.

---

### PDM-022

Database permissions shall follow the Principle of Least Privilege.

---

# 13.13 Migration & Versioning

All physical schema changes are managed through Flyway.

Migration principles:

* Immutable migration scripts
* Sequential versioning
* Automated validation
* Rollback planning
* Peer review
* CI/CD integration

Manual production schema changes are prohibited except through approved emergency procedures.

---

### PDM-023

Every schema modification shall be deployed using Flyway.

---

### PDM-024

Migration history shall be preserved permanently.

---

# 13.14 Governance

The Physical Data Model is governed through:

* Architecture review
* Database design review
* Security assessment
* Performance review
* Migration review
* Documentation review
* Operational readiness review
* Architecture Decision Records (ADR)

Governance ensures the physical schema remains aligned with business and technical requirements.

---

### PDM-025

Physical schema changes require formal review and approval.

---

### PDM-026

Implementation shall remain synchronized with approved documentation.

---

# 13.15 Traceability

This chapter defines the Physical Data Model for the Mediverse platform.

**Related Documents**

* Conceptual Data Model
* Logical Data Model
* Database Design Principles
* Database Naming Conventions
* Database Object Standards
* Technology Stack & Version Matrix
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Schemas
* Tables
* Columns
* Constraints
* Keys
* Data Types
* Storage
* Physical Relationships
* Database Migrations

---

# Chapter Summary

This chapter defines the Physical Data Model for the Mediverse platform. It translates logical entities into PostgreSQL-specific database structures, establishes standards for schemas, tables, columns, data types, keys, relationships, storage, optimization, security, and migration, and provides the implementation blueprint for a scalable, secure, and production-ready enterprise database. The Physical Data Model serves as the foundation for the detailed schema design presented in the subsequent chapters.

---

**End of Chapter 13**

**Next:** **Chapter 14 – Entity Relationship Diagram (ERD)**.

---

# Chapter 14 — Entity Relationship Diagram (ERD)

---

# 14.1 Introduction

The **Entity Relationship Diagram (ERD)** provides the graphical and structural representation of all database entities and their relationships within the **Mediverse – AI-Powered Medical Education Platform**.

While the **Conceptual Data Model** describes business concepts and the **Logical Data Model** defines logical entities, the ERD translates those models into an implementation-oriented representation that illustrates:

* Entities
* Relationships
* Primary Keys
* Foreign Keys
* Cardinality
* Ownership
* Business Domains

The ERD serves as the primary reference for database architects, backend developers, DBAs, DevOps engineers, AI engineers, and QA engineers during implementation and maintenance.

---

# 14.2 Objectives

The Entity Relationship Diagram aims to:

* Visualize the complete database structure.
* Define relationships between entities.
* Document primary and foreign keys.
* Identify ownership boundaries.
* Validate business rules.
* Simplify database implementation.
* Improve communication among engineering teams.
* Support query optimization.
* Enable schema validation.
* Maintain traceability with business requirements.

---

### ERD-001

Every persistent entity shall appear in at least one ER diagram.

---

### ERD-002

Every relationship shall be represented using standardized notation.

---

# 14.3 ERD Design Principles

The Mediverse ERD follows these principles:

### Business-Oriented

Relationships reflect business interactions rather than application implementation.

### Modular

Each business domain has an independent ER diagram.

### Normalized

Operational entities target Third Normal Form (3NF).

### Consistent

Naming follows the approved database naming conventions.

### Scalable

The model supports future modules without significant redesign.

### Traceable

Each entity maps to a documented business capability.

---

### ERD-003

ER diagrams shall remain synchronized with the Physical Data Model.

---

### ERD-004

Diagram modifications require architectural review.

---

# 14.4 Enterprise ERD Overview

The Mediverse platform is organized into multiple business domains.

```text id="erd1"
                  +------------------+
                  |     Identity     |
                  +------------------+
                           │
                           ▼
                  +------------------+
                  | User Management  |
                  +------------------+
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   Academic          Learning         Administration
          │                │                │
          ▼                ▼                ▼
   Assessment       Certification      Analytics
          │                │
          └────────┬───────┘
                   ▼
              AI Services
                   │
                   ▼
              Notifications
                   │
                   ▼
                 Audit
```

Each domain owns its entities while interacting through well-defined relationships.

---

### ERD-005

Business domains shall maintain clear ownership boundaries.

---

### ERD-006

Cross-domain relationships shall be minimized and documented.

---

# 14.5 Identity Domain ERD

The Identity domain manages authentication and authorization.

```text id="erd2"
roles
   │
   │ 1:N
   ▼
user_roles
   ▲
   │ N:1
users
   │
   │ 1:N
   ▼
sessions

roles
   │
   │ 1:N
   ▼
permissions
```

Core entities:

* Users
* Roles
* Permissions
* User Roles
* Sessions
* Refresh Tokens

---

### ERD-007

Authentication entities shall maintain referential integrity.

---

### ERD-008

Role assignments shall support many-to-many relationships.

---

# 14.6 Academic Domain ERD

The Academic domain represents educational content.

```text id="erd3"
departments
      │
      │ 1:N
      ▼
courses
      │
      │ 1:N
      ▼
modules
      │
      │ 1:N
      ▼
lessons
      │
      │ 1:N
      ▼
learning_resources
```

Core entities:

* Departments
* Courses
* Modules
* Lessons
* Topics
* Learning Resources

---

### ERD-009

Academic content shall follow hierarchical ownership.

---

### ERD-010

Every lesson shall belong to exactly one module.

---

# 14.7 Learning Domain ERD

The Learning domain models the learner journey.

```text id="erd4"
students
      │
      │ 1:N
      ▼
enrollments
      ▲
      │ N:1
courses
      │
      ▼
learning_progress
      │
      ▼
bookmarks
```

Core entities:

* Students
* Enrollments
* Learning Progress
* Bookmarks
* Study Plans

---

### ERD-011

Student progress shall be linked to active enrollments.

---

### ERD-012

Learning entities shall preserve historical progress.

---

# 14.8 Assessment Domain ERD

Assessment entities support examinations.

```text id="erd5"
assessments
      │
      │ 1:N
      ▼
questions
      │
      │ 1:N
      ▼
options
      │
      ▼
submissions
      │
      ▼
results
```

Core entities:

* Assessments
* Questions
* Options
* Submissions
* Results
* Evaluation

---

### ERD-013

Assessment submissions shall reference authenticated learners.

---

### ERD-014

Questions shall belong to a single assessment.

---

# 14.9 Certification Domain ERD

Certification records academic achievement.

```text id="erd6"
students
      │
      ▼
completion_records
      │
      ▼
certificates
```

Core entities:

* Completion Records
* Certificates

Certificates are generated after successful completion of predefined business rules.

---

### ERD-015

Certificates shall reference verified completion records.

---

### ERD-016

Certificate records shall remain immutable after issuance.

---

# 14.10 AI Domain ERD

The AI domain supports intelligent tutoring.

```text id="erd7"
users
     │
     ▼
ai_sessions
     │
     ▼
prompts
     │
     ▼
ai_responses
     │
     ▼
knowledge_sources
```

Core entities:

* AI Sessions
* Prompts
* AI Responses
* Knowledge Sources
* Recommendations

---

### ERD-017

AI conversations shall remain traceable to authenticated users.

---

### ERD-018

Knowledge references shall support explainable AI responses.

---

# 14.11 Notification Domain ERD

Communication entities:

```text id="erd8"
users
   │
   ▼
notifications
   │
   ▼
delivery_logs
```

Notification channels include:

* Email
* Push Notification
* In-App Notification
* SMS (future)

---

### ERD-019

Notification delivery status shall be tracked.

---

### ERD-020

Notification history shall remain auditable.

---

# 14.12 Analytics Domain ERD

Analytics aggregates operational data.

```text id="erd9"
learning_progress
        │
        ▼
learning_metrics
        │
        ▼
dashboards
```

Analytics uses derived data rather than modifying transactional entities.

---

### ERD-021

Analytical entities shall remain logically separated from transactional data.

---

### ERD-022

Reporting structures shall preserve source traceability.

---

# 14.13 Audit Domain ERD

Audit entities provide compliance and traceability.

```text id="erd10"
users
   │
   ▼
audit_events
   │
   ▼
activity_logs
```

Captured information includes:

* User
* Timestamp
* Operation
* Entity
* Previous Values
* New Values
* Source System

Audit records are immutable.

---

### ERD-023

Critical database operations shall generate audit records.

---

### ERD-024

Audit entities shall support regulatory investigations.

---

# 14.14 Cardinality Summary

Representative cardinalities:

| Parent      | Child        | Cardinality |
| ----------- | ------------ | ----------- |
| Institution | Department   | 1 : Many    |
| Department  | Course       | 1 : Many    |
| Course      | Module       | 1 : Many    |
| Module      | Lesson       | 1 : Many    |
| Lesson      | Resource     | 1 : Many    |
| Student     | Enrollment   | 1 : Many    |
| Course      | Enrollment   | 1 : Many    |
| Assessment  | Question     | 1 : Many    |
| Assessment  | Submission   | 1 : Many    |
| Student     | Submission   | 1 : Many    |
| Student     | Certificate  | 1 : Many    |
| User        | AI Session   | 1 : Many    |
| User        | Notification | 1 : Many    |
| User        | Audit Event  | 1 : Many    |

Many-to-many relationships are implemented through associative entities such as `user_roles` and `enrollments`.

---

### ERD-025

All relationships shall define explicit cardinality.

---

### ERD-026

Associative entities shall resolve many-to-many relationships.

---

# 14.15 ERD Governance

Entity Relationship Diagrams are governed through:

* Data modeling workshops
* Architecture reviews
* Database design reviews
* Business validation
* Change management
* Documentation review
* Architecture Decision Records (ADR)

Any ERD modification must be reflected in the Logical Data Model, Physical Data Model, and schema implementation.

---

### ERD-027

ER diagrams shall remain synchronized with database implementation.

---

### ERD-028

ERD updates shall be version controlled.

---

# 14.16 Traceability

This chapter defines the Entity Relationship Diagrams supporting the Mediverse database architecture.

**Related Documents**

* Conceptual Data Model
* Logical Data Model
* Physical Data Model
* Database Naming Conventions
* Database Object Standards
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Business Domains
* Database Entities
* Relationships
* Cardinalities
* Keys
* Database Schemas
* Referential Integrity

---

# Chapter Summary

This chapter presents the Entity Relationship Diagrams (ERDs) for the Mediverse platform. It defines the structural relationships among business entities across all major domains, including Identity, Academic, Learning, Assessment, Certification, AI, Notifications, Analytics, and Audit. By documenting entity ownership, cardinalities, primary and foreign key relationships, and domain boundaries, the ERDs provide the definitive structural blueprint for implementing and maintaining the enterprise database schema.

---

**End of Chapter 14**

**Next:** **Chapter 15 – Domain Model Mapping**.

---

# Chapter 15 — Domain Model Mapping

---

# 15.1 Introduction

The **Domain Model Mapping** defines how the business domains identified in the Software Architecture Document (SAD), Conceptual Data Model (CDM), Logical Data Model (LDM), and Physical Data Model (PDM) are translated into the physical database structure.

It establishes a one-to-one traceability between:

* Business Domains
* Bounded Contexts
* Microservices
* Database Schemas
* Database Tables
* Entity Classes
* Repositories
* API Resources

This mapping ensures that every database object has a clear business purpose and ownership while maintaining loose coupling between domains.

---

# 15.2 Objectives

The objectives of Domain Model Mapping are to:

* Map business domains to database schemas.
* Define ownership boundaries.
* Maintain Domain-Driven Design (DDD) principles.
* Minimize cross-domain dependencies.
* Improve maintainability.
* Support independent service evolution.
* Enable scalable microservices.
* Preserve traceability across architecture documents.
* Simplify onboarding.
* Ensure long-term extensibility.

---

### DMM-001

Every business domain shall own its database entities.

---

### DMM-002

Every database table shall belong to exactly one primary domain.

---

# 15.3 Domain-Driven Design Mapping

The Mediverse platform follows **Domain-Driven Design (DDD)**.

The architecture is divided into bounded contexts where each domain owns:

* Business Rules
* Database Tables
* APIs
* Services
* Events
* Security Policies
* Validation Rules

```text id="dmm1"
Business Domain
        │
        ▼
Bounded Context
        │
        ▼
Microservice
        │
        ▼
Database Schema
        │
        ▼
Tables
```

This layered mapping ensures clear ownership and minimizes accidental coupling.

---

### DMM-003

Bounded contexts shall define ownership boundaries.

---

### DMM-004

Database schemas shall align with bounded contexts.

---

# 15.4 Enterprise Domain Overview

The Mediverse platform consists of the following core domains.

| Domain          | Purpose                        |
| --------------- | ------------------------------ |
| Identity        | Authentication & Authorization |
| User Management | User lifecycle                 |
| Institution     | Institution hierarchy          |
| Academic        | Courses & Lessons              |
| Learning        | Student learning lifecycle     |
| Assessment      | Exams & Evaluations            |
| Certification   | Completion management          |
| AI              | AI-powered tutoring            |
| Media           | Educational assets             |
| Notification    | Communication services         |
| Analytics       | Reporting                      |
| Audit           | Compliance & Traceability      |
| Administration  | Platform administration        |

Each domain is independently governed.

---

### DMM-005

Domains shall represent cohesive business capabilities.

---

### DMM-006

Shared responsibilities shall be minimized.

---

# 15.5 Domain-to-Schema Mapping

Each domain owns one or more PostgreSQL schemas.

| Business Domain | Database Schema |
| --------------- | --------------- |
| Identity        | auth            |
| User Management | users           |
| Institution     | administration  |
| Academic        | academics       |
| Learning        | academics       |
| Assessment      | assessments     |
| AI              | ai              |
| Media           | media           |
| Notification    | notifications   |
| Analytics       | analytics       |
| Audit           | audit           |

Ownership is exclusive.

No schema may own unrelated business entities.

---

### DMM-007

Schemas shall contain only entities belonging to their business domain.

---

### DMM-008

Schema ownership shall be documented.

---

# 15.6 Domain-to-Entity Mapping

The following entities belong to their respective domains.

## Identity

* User
* Role
* Permission
* Session
* Refresh Token

---

## User Management

* Student
* Faculty
* Administrator
* Profile

---

## Institution

* Institution
* Campus
* Department
* Academic Year

---

## Academic

* Course
* Module
* Lesson
* Topic
* Learning Resource

---

## Learning

* Enrollment
* Progress
* Bookmark
* Study Plan

---

## Assessment

* Assessment
* Question
* Question Option
* Submission
* Result

---

## Certification

* Completion Record
* Certificate

---

## AI

* AI Session
* Prompt
* AI Response
* Recommendation
* Knowledge Source

---

## Media

* Image
* Video
* Audio
* PDF
* 3D Model

---

## Notification

* Notification
* Announcement
* Delivery Log

---

## Analytics

* Dashboard
* Learning Metric
* Institution Metric
* Assessment Metric

---

## Audit

* Audit Event
* Activity Log
* Login History

---

### DMM-009

Every entity shall belong to a single owning domain.

---

### DMM-010

Entity ownership shall remain stable throughout the system lifecycle.

---

# 15.7 Domain-to-Microservice Mapping

Each domain is implemented as one or more microservices.

| Domain          | Microservice         |
| --------------- | -------------------- |
| Identity        | Auth Service         |
| User Management | User Service         |
| Institution     | Institution Service  |
| Academic        | Course Service       |
| Learning        | Learning Service     |
| Assessment      | Assessment Service   |
| Certification   | Certificate Service  |
| AI              | AI Tutor Service     |
| Media           | Media Service        |
| Notification    | Notification Service |
| Analytics       | Analytics Service    |
| Audit           | Audit Service        |

Each service owns its persistence layer.

---

### DMM-011

Microservices shall own their database schema.

---

### DMM-012

Direct database access across services is prohibited.

---

# 15.8 Domain-to-Repository Mapping

The persistence layer follows the Repository pattern.

Example mappings:

| Entity       | Repository             |
| ------------ | ---------------------- |
| User         | UserRepository         |
| Course       | CourseRepository       |
| Lesson       | LessonRepository       |
| Assessment   | AssessmentRepository   |
| Submission   | SubmissionRepository   |
| Certificate  | CertificateRepository  |
| AISession    | AISessionRepository    |
| Notification | NotificationRepository |

Repositories encapsulate persistence logic and isolate database access from business services.

---

### DMM-013

Repositories shall manage persistence for a single aggregate root.

---

### DMM-014

Repository interfaces shall remain independent of business logic.

---

# 15.9 Domain-to-API Mapping

Each business domain exposes REST APIs.

| Domain       | API Prefix            |
| ------------ | --------------------- |
| Identity     | /api/v1/auth          |
| Users        | /api/v1/users         |
| Institution  | /api/v1/institutions  |
| Academic     | /api/v1/courses       |
| Learning     | /api/v1/learning      |
| Assessment   | /api/v1/assessments   |
| AI           | /api/v1/ai            |
| Media        | /api/v1/media         |
| Notification | /api/v1/notifications |
| Analytics    | /api/v1/analytics     |
| Audit        | /api/v1/audit         |

This mapping provides a consistent external interface for each domain.

---

### DMM-015

API ownership shall align with domain ownership.

---

### DMM-016

APIs shall not expose internal database structures.

---

# 15.10 Cross-Domain Relationships

Some domains require controlled interaction.

```text id="dmm2"
Identity
      │
      ▼
Users
      │
      ▼
Academic
      │
      ▼
Assessment
      │
      ▼
Certification
```

Supporting domains:

```text id="dmm3"
AI
Media
Notifications
Analytics
Audit
```

Cross-domain communication occurs through:

* REST APIs
* Domain Events
* Message Broker
* Read Models
* Event Consumers

Direct table sharing is prohibited.

---

### DMM-017

Cross-domain communication shall use approved integration mechanisms.

---

### DMM-018

Domains shall remain loosely coupled.

---

# 15.11 Aggregate Mapping

Each aggregate defines a transactional consistency boundary.

Representative aggregates include:

| Aggregate Root | Child Entities    |
| -------------- | ----------------- |
| User           | Profile, Sessions |
| Course         | Module, Lesson    |
| Assessment     | Question, Option  |
| Enrollment     | Progress          |
| AI Session     | Prompt, Response  |
| Certificate    | Completion Record |

Transactions are scoped to a single aggregate wherever possible.

---

### DMM-019

Aggregate roots shall enforce business invariants.

---

### DMM-020

Transactions shall not span multiple aggregates unless explicitly justified.

---

# 15.12 Domain Dependency Matrix

| Domain        | Depends On              |
| ------------- | ----------------------- |
| Identity      | None                    |
| Users         | Identity                |
| Institution   | Identity                |
| Academic      | Institution             |
| Learning      | Academic, Users         |
| Assessment    | Academic                |
| Certification | Assessment              |
| AI            | Users, Academic         |
| Media         | Academic                |
| Notifications | Users                   |
| Analytics     | All Domains (Read Only) |
| Audit         | All Domains             |

Dependencies shall be acyclic wherever possible.

---

### DMM-021

Domain dependencies shall be explicitly documented.

---

### DMM-022

Circular dependencies are prohibited.

---

# 15.13 Traceability Matrix

| Business Capability    | Domain        | Schema         | Service              |
| ---------------------- | ------------- | -------------- | -------------------- |
| Authentication         | Identity      | auth           | Auth Service         |
| User Management        | Users         | users          | User Service         |
| Institution Management | Institution   | administration | Institution Service  |
| Course Management      | Academic      | academics      | Course Service       |
| Student Learning       | Learning      | academics      | Learning Service     |
| Assessment             | Assessment    | assessments    | Assessment Service   |
| Certification          | Certification | academics      | Certificate Service  |
| AI Tutor               | AI            | ai             | AI Tutor Service     |
| Media Management       | Media         | media          | Media Service        |
| Notifications          | Notification  | notifications  | Notification Service |
| Analytics              | Analytics     | analytics      | Analytics Service    |
| Auditing               | Audit         | audit          | Audit Service        |

This matrix ensures end-to-end traceability from business capabilities to implementation components.

---

### DMM-023

Every business capability shall map to a domain, schema, and service.

---

### DMM-024

Traceability shall be maintained throughout the software lifecycle.

---

# 15.14 Governance

Domain Model Mapping is governed through:

* Domain Modeling Workshops
* Architecture Reviews
* Database Design Reviews
* Microservice Design Reviews
* API Reviews
* Security Reviews
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Any changes to ownership, schema allocation, or service boundaries require architectural approval.

---

### DMM-025

Domain ownership changes require formal governance approval.

---

### DMM-026

Documentation shall remain synchronized with implementation artifacts.

---

# 15.15 Traceability

This chapter defines the mapping between business domains and implementation components for the Mediverse platform.

**Related Documents**

* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Conceptual Data Model
* Logical Data Model
* Physical Data Model
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Business Domains
* Bounded Contexts
* Database Schemas
* Microservices
* Repositories
* REST APIs
* Aggregate Roots
* Domain Dependencies

---

# Chapter Summary

This chapter establishes the Domain Model Mapping for the Mediverse platform by defining how business domains, bounded contexts, microservices, database schemas, entities, repositories, and APIs align with one another. It reinforces Domain-Driven Design principles, ensures clear ownership boundaries, minimizes coupling, and provides end-to-end traceability from business capabilities to implementation artifacts. This mapping forms the architectural foundation for the detailed schema design beginning in the next chapter.

---

**End of Chapter 15**

**Next:** **Chapter 16 – Schema Organization**.

---

# Chapter 16 — Schema Organization

---

# 16.1 Introduction

The **Schema Organization** defines how the Mediverse database is logically partitioned into multiple PostgreSQL schemas. A well-organized schema structure improves modularity, security, maintainability, scalability, and aligns with the platform's Domain-Driven Design (DDD) and Microservices Architecture.

Each schema groups related database objects that belong to a single bounded business context. This separation minimizes coupling, improves access control, and enables independent evolution of different business domains.

The schema organization described in this chapter serves as the foundation for all subsequent database object definitions.

---

# 16.2 Objectives

The Schema Organization aims to:

* Organize database objects into logical business domains.
* Support Domain-Driven Design (DDD).
* Enable schema-level security.
* Reduce cross-domain dependencies.
* Simplify maintenance and administration.
* Improve database scalability.
* Support independent microservice ownership.
* Enable efficient backup and recovery.
* Improve developer productivity.
* Ensure enterprise governance.

---

### SO-001

Every database object shall belong to an approved PostgreSQL schema.

---

### SO-002

Each schema shall represent a single bounded business context.

---

# 16.3 Schema Organization Principles

The Mediverse database follows these core organizational principles.

### Domain Ownership

Each schema is owned by one business domain.

### Single Responsibility

Schemas contain only related database objects.

### Security Isolation

Privileges are assigned at the schema level wherever possible.

### Low Coupling

Cross-schema dependencies are minimized.

### High Cohesion

Objects within a schema collaborate closely.

### Extensibility

New business domains can be added without affecting existing schemas.

---

### SO-003

Schemas shall follow the Single Responsibility Principle.

---

### SO-004

Schema boundaries shall align with business capabilities.

---

# 16.4 Enterprise Schema Architecture

The Mediverse PostgreSQL database is organized into multiple schemas.

```text id="so1"
                 PostgreSQL Database
                        │
 ┌──────────────────────┼──────────────────────┐
 │                      │                      │
 ▼                      ▼                      ▼
auth                  users            administration
 │                      │                      │
 ▼                      ▼                      ▼
academics        assessments              media
 │                      │                      │
 ▼                      ▼                      ▼
notifications        analytics               ai
 │
 ▼
audit
```

Each schema encapsulates a specific business capability and owns its corresponding database objects.

---

### SO-005

Schema architecture shall remain modular and extensible.

---

### SO-006

New schemas require architecture approval before creation.

---

# 16.5 Schema Catalog

The following schemas are defined for the Mediverse platform.

| Schema         | Business Purpose                  |
| -------------- | --------------------------------- |
| auth           | Authentication & Authorization    |
| users          | User Management                   |
| administration | Institution & Administration      |
| academics      | Academic Content                  |
| assessments    | Assessment Management             |
| media          | Digital Learning Resources        |
| ai             | AI Tutor & Knowledge Services     |
| notifications  | Messaging & Communication         |
| analytics      | Reporting & Business Intelligence |
| audit          | Compliance & Audit Logging        |

Each schema is independently managed while participating in the overall enterprise architecture.

---

### SO-007

Every schema shall have documented ownership.

---

### SO-008

Schema documentation shall include its business purpose and responsibilities.

---

# 16.6 Schema Ownership Matrix

| Schema         | Owner                  |
| -------------- | ---------------------- |
| auth           | Authentication Service |
| users          | User Service           |
| administration | Administration Service |
| academics      | Academic Service       |
| assessments    | Assessment Service     |
| media          | Media Service          |
| ai             | AI Tutor Service       |
| notifications  | Notification Service   |
| analytics      | Analytics Service      |
| audit          | Audit Service          |

Ownership determines responsibility for:

* Database migrations
* Security
* Performance
* Data quality
* Documentation
* Lifecycle management

---

### SO-009

Each schema shall have a single accountable owner.

---

### SO-010

Ownership transfers require architecture governance approval.

---

# 16.7 Database Objects within Schemas

Each schema may contain multiple object types.

| Object Type        | Example                         |
| ------------------ | ------------------------------- |
| Tables             | users.students                  |
| Views              | analytics.vw_course_statistics  |
| Materialized Views | analytics.mv_learning_dashboard |
| Sequences          | assessments.seq_question        |
| Functions          | auth.fn_validate_user           |
| Procedures         | audit.sp_archive_logs           |
| Triggers           | academics.trg_update_timestamp  |
| Indexes            | idx_course_title                |
| Constraints        | pk_students                     |

Objects are grouped according to business ownership.

---

### SO-011

Objects shall not exist outside an approved schema.

---

### SO-012

Object ownership shall align with schema ownership.

---

# 16.8 Cross-Schema Relationships

Schemas occasionally interact through foreign keys or service-level APIs.

Example:

```text id="so2"
auth.users
      │
      ▼
users.students
      │
      ▼
academics.enrollments
      │
      ▼
assessments.submissions
```

Cross-schema relationships shall be:

* Documented
* Minimized
* Performance-tested
* Security-reviewed

Whenever possible, microservices communicate through APIs or domain events instead of direct database dependencies.

---

### SO-013

Cross-schema relationships shall be explicitly documented.

---

### SO-014

Direct dependencies shall be minimized to preserve loose coupling.

---

# 16.9 Naming Standards

Schema names follow the approved database naming conventions.

Rules:

* Lowercase only
* Singular business name where appropriate
* Snake_case if multiple words
* No abbreviations unless standardized
* No spaces or special characters

Examples:

```text id="so3"
auth
users
academics
media
notifications
analytics
audit
```

Examples to avoid:

```text id="so4"
UserSchema
Academic_Data
MediaFiles
Notification-System
```

---

### SO-015

Schema names shall follow enterprise naming standards.

---

### SO-016

Renaming schemas in production requires formal migration planning.

---

# 16.10 Security Organization

Schema-level security provides the first layer of database access control.

Each schema defines:

* Owner role
* Read role
* Write role
* Migration role
* Reporting role
* Application role

Example:

```text id="so5"
auth_owner

auth_read

auth_write

auth_admin
```

Access is granted using the Principle of Least Privilege.

---

### SO-017

Database roles shall be assigned at the schema level whenever possible.

---

### SO-018

Privileges shall follow the Principle of Least Privilege.

---

# 16.11 Schema Lifecycle Management

Every schema follows a controlled lifecycle.

```text id="so6"
Design
   │
Development
   │
Testing
   │
Migration
   │
Production
   │
Maintenance
   │
Retirement
```

Changes are managed using Flyway migrations and version-controlled scripts.

---

### SO-019

Schema modifications shall follow the approved change management process.

---

### SO-020

Retired schemas shall be archived according to data retention policies.

---

# 16.12 Backup & Recovery Considerations

Schema organization supports selective recovery.

Benefits include:

* Domain-specific backups
* Faster restoration
* Reduced downtime
* Easier disaster recovery
* Independent archival

Recovery procedures are documented for each schema.

---

### SO-021

Backup policies shall define schema-level recovery objectives.

---

### SO-022

Critical schemas shall support tested restoration procedures.

---

# 16.13 Monitoring & Maintenance

Each schema is monitored independently.

Key operational metrics include:

* Table growth
* Storage utilization
* Index usage
* Query latency
* Lock contention
* Dead tuples
* Vacuum activity
* Replication lag

Monitoring enables proactive capacity planning and performance optimization.

---

### SO-023

Operational metrics shall be collected for every production schema.

---

### SO-024

Capacity thresholds shall trigger operational alerts.

---

# 16.14 Governance

Schema Organization is governed through:

* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Change Advisory Board (CAB)
* Database Administration Team
* Architecture Decision Records (ADR)

Any modification to schema boundaries, ownership, or structure requires formal review and approval.

---

### SO-025

Schema organization changes require governance approval.

---

### SO-026

Schema documentation shall remain synchronized with implementation.

---

# 16.15 Traceability

This chapter defines the organization of PostgreSQL schemas within the Mediverse platform.

**Related Documents**

* Database Naming Conventions
* Database Object Standards
* Conceptual Data Model
* Logical Data Model
* Physical Data Model
* Entity Relationship Diagram (ERD)
* Domain Model Mapping
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Schemas
* Database Objects
* Business Domains
* Microservices
* Security Roles
* Database Administration
* Backup & Recovery
* Monitoring

---

# Chapter Summary

This chapter defines the Schema Organization strategy for the Mediverse platform. It establishes how PostgreSQL schemas are structured around business domains, assigns ownership responsibilities, standardizes object placement, governs cross-schema interactions, and defines lifecycle, security, backup, monitoring, and governance practices. This organization ensures that the enterprise database remains modular, secure, scalable, and aligned with Domain-Driven Design principles.

---

**End of Chapter 16**

**Next:** **Chapter 17 – Table Design Standards**.

---

# Chapter 17 — Table Design Standards

---

# Chapter Overview

This chapter establishes the enterprise standards for designing database tables within the **Mediverse – AI-Powered Medical Education Platform**. These standards ensure that all tables are consistent, scalable, secure, maintainable, and aligned with PostgreSQL best practices and Domain-Driven Design (DDD).

The standards defined here apply to every table across all database schemas including transactional, reference, audit, analytical, and configuration tables.

---

# 17.1 Introduction

Database tables are the fundamental storage structures of the Mediverse platform. A well-designed table improves:

* Data integrity
* Query performance
* Storage efficiency
* Maintainability
* Scalability
* Security
* Data governance

Every table shall be designed using standardized conventions that enable long-term maintainability while supporting millions of users and large-scale educational content.

---

# 17.2 Objectives

The objectives of the Table Design Standards are to:

* Standardize table creation across all schemas.
* Improve consistency.
* Reduce design defects.
* Simplify development.
* Support automated validation.
* Improve query performance.
* Support future scalability.
* Enable reliable migrations.
* Maintain data integrity.
* Ensure production readiness.

---

### TDS-001

Every table shall comply with the approved enterprise database standards.

---

### TDS-002

Table definitions shall be version controlled using Flyway migration scripts.

---

# 17.3 Table Classification

Tables are categorized according to their business purpose.

| Table Type    | Purpose                     | Example                |
| ------------- | --------------------------- | ---------------------- |
| Transactional | Operational business data   | students, courses      |
| Reference     | Lookup values               | countries, specialties |
| Junction      | Many-to-many relationships  | user_roles             |
| Audit         | Historical records          | audit_events           |
| Configuration | Application settings        | system_configuration   |
| Reporting     | Aggregated information      | learning_metrics       |
| Queue         | Asynchronous processing     | notification_queue     |
| Temporary     | Session or batch processing | temp_import_records    |

Each table type follows specific implementation guidelines.

---

### TDS-003

Every table shall have a documented classification.

---

### TDS-004

Table classification shall determine lifecycle and maintenance policies.

---

# 17.4 Table Naming Standards

Table names shall follow a consistent naming convention.

Rules:

* Lowercase
* Snake_case
* Descriptive
* Singular or plural according to enterprise standard (Mediverse adopts **plural nouns**)
* No abbreviations unless officially approved
* No special characters

Examples:

```text id="tds1"
students
faculty_members
courses
course_modules
lesson_resources
assessment_results
notification_logs
audit_events
```

Invalid examples:

```text id="tds2"
StudentTable
COURSES
tblUsers
course-data
```

---

### TDS-005

Table names shall use lowercase snake_case.

---

### TDS-006

Table names shall clearly represent the stored business entity.

---

# 17.5 Standard Table Structure

All operational tables shall follow a common structure.

```text id="tds3"
Primary Key
Business Columns
Reference Columns
Status Columns
Audit Columns
Metadata Columns
```

Typical table layout:

| Section       | Example Columns         |
| ------------- | ----------------------- |
| Identifier    | id                      |
| Business      | first_name, course_name |
| Relationships | student_id, course_id   |
| Status        | status, is_active       |
| Audit         | created_at, updated_at  |
| Metadata      | version, remarks        |

A consistent structure simplifies administration and application development.

---

### TDS-007

Operational tables shall use the standardized column ordering.

---

### TDS-008

Business columns shall precede audit and metadata columns.

---

# 17.6 Mandatory Columns

Unless explicitly exempted, every operational table shall include the following mandatory columns.

| Column     | Purpose                     |
| ---------- | --------------------------- |
| id         | Primary identifier          |
| created_at | Creation timestamp          |
| updated_at | Last modification timestamp |
| created_by | Creator identifier          |
| updated_by | Last modifier identifier    |
| version    | Optimistic locking          |
| is_active  | Active status               |

Optional columns:

| Column     | Purpose              |
| ---------- | -------------------- |
| deleted_at | Soft delete          |
| deleted_by | Soft delete owner    |
| remarks    | Administrative notes |

---

### TDS-009

Operational tables shall include enterprise audit columns.

---

### TDS-010

Audit metadata shall remain immutable except through authorized operations.

---

# 17.7 Primary Key Standards

Each table requires a unique primary key.

Standard implementation:

```sql id="b7n2r1"
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

Primary key characteristics:

* Immutable
* Globally unique
* Indexed
* Non-null
* Business-independent

UUID Version 4 (or equivalent secure random UUID generation) is the enterprise standard.

---

### TDS-011

Primary keys shall use UUID unless an approved exception exists.

---

### TDS-012

Business identifiers shall not serve as primary keys.

---

# 17.8 Foreign Key Standards

Relationships between tables are maintained using foreign keys.

Example:

```sql id="x9m5kp"
student_id UUID REFERENCES users.students(id)

course_id UUID REFERENCES academics.courses(id)
```

Guidelines:

* Explicit naming
* Indexed where appropriate
* Cascading rules documented
* Referential integrity enforced

---

### TDS-013

Foreign keys shall accurately represent business relationships.

---

### TDS-014

Cascade operations require documented architectural approval.

---

# 17.9 Constraints

Every table shall define appropriate constraints.

Constraint types:

* PRIMARY KEY
* FOREIGN KEY
* UNIQUE
* CHECK
* NOT NULL
* DEFAULT

Examples:

```sql id="k8d4vx"
CHECK (percentage BETWEEN 0 AND 100)

UNIQUE(email)

NOT NULL
```

Constraints enforce data quality at the database level.

---

### TDS-015

Business validation shall be enforced through database constraints whenever appropriate.

---

### TDS-016

Constraint definitions shall be documented within migration scripts.

---

# 17.10 Table Relationships

Tables may participate in:

* One-to-One
* One-to-Many
* Many-to-Many

Example:

```text id="tds4"
students
     │
     ▼
enrollments
     ▲
     │
courses
```

Many-to-many relationships shall be implemented using junction tables.

---

### TDS-017

Relationship cardinality shall be explicitly documented.

---

### TDS-018

Junction tables shall resolve many-to-many relationships.

---

# 17.11 Normalization Standards

Operational tables shall comply with normalization principles.

Target normalization:

* First Normal Form (1NF)
* Second Normal Form (2NF)
* Third Normal Form (3NF)

Denormalization is permitted only for:

* Reporting
* Analytics
* Performance optimization

Such decisions require documented architectural justification.

---

### TDS-019

Operational tables shall satisfy Third Normal Form (3NF).

---

### TDS-020

Denormalization requires architecture review and approval.

---

# 17.12 Table Documentation

Every table shall have comprehensive documentation.

Documentation includes:

* Business purpose
* Owner
* Schema
* Related entities
* Primary key
* Foreign keys
* Constraints
* Indexes
* Retention policy
* Security classification

Documentation is maintained alongside database migrations.

---

### TDS-021

Every production table shall have complete documentation.

---

### TDS-022

Documentation shall remain synchronized with implementation.

---

# 17.13 Lifecycle Management

Tables follow a controlled lifecycle.

```text id="tds5"
Design
   │
Development
   │
Testing
   │
Migration
   │
Production
   │
Monitoring
   │
Archival
   │
Retirement
```

Lifecycle activities include:

* Design reviews
* Schema validation
* Migration testing
* Performance testing
* Backup verification
* Capacity planning

---

### TDS-023

Table lifecycle changes shall follow the enterprise change management process.

---

### TDS-024

Retired tables shall be archived according to data retention policies.

---

# 17.14 Performance Considerations

Table design shall support enterprise-scale workloads.

Performance guidelines:

* Avoid excessively wide tables.
* Minimize nullable columns.
* Use appropriate data types.
* Define selective indexes.
* Partition large datasets when required.
* Reduce unnecessary joins.
* Monitor table growth.

Performance characteristics shall be validated through load testing.

---

### TDS-025

Table design shall support expected production workloads.

---

### TDS-026

Performance bottlenecks shall be identified before production deployment.

---

# 17.15 Security Considerations

Table security includes:

* Role-based access
* Least privilege
* Row-Level Security (where applicable)
* Audit logging
* Encryption of sensitive information
* Secure backups
* Access monitoring

Sensitive columns (for example, password hashes and personally identifiable information) require additional protection.

---

### TDS-027

Access to tables shall be restricted according to business responsibilities.

---

### TDS-028

Sensitive data shall be protected using approved security controls.

---

# 17.16 Governance

Table design is governed through:

* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Change Advisory Board (CAB)
* Database Administration Team
* Architecture Decision Records (ADR)

Any changes to production tables require:

* Design review
* Migration review
* Security review
* Performance assessment
* Documentation update

---

### TDS-029

Production table modifications require governance approval.

---

### TDS-030

Table standards shall be periodically reviewed and updated.

---

# 17.17 Traceability

This chapter defines the enterprise standards for database table design within the Mediverse platform.

**Related Documents**

* Database Naming Conventions
* Database Object Standards
* Schema Organization
* Physical Data Model
* Entity Relationship Diagram (ERD)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Transactional Tables
* Reference Tables
* Junction Tables
* Audit Tables
* Reporting Tables
* Configuration Tables
* Temporary Tables
* All PostgreSQL Schemas

---

# Chapter Summary

This chapter establishes the Table Design Standards for the Mediverse platform. It defines standardized approaches for naming, structuring, documenting, securing, and governing database tables while enforcing consistency across all PostgreSQL schemas. These standards ensure that every table supports enterprise-grade scalability, maintainability, integrity, performance, and long-term operational excellence.

---

**End of Chapter 17**

**Next:** **Chapter 18 – Column Design Standards**.

---

# Chapter 18 — Column Design Standards

---

# Chapter Overview

This chapter defines the enterprise standards for designing database columns within the **Mediverse – AI-Powered Medical Education Platform**. Columns represent the atomic units of business information and are fundamental to ensuring data quality, consistency, performance, maintainability, and regulatory compliance.

The standards in this chapter apply to every column across all PostgreSQL schemas, including transactional, reference, audit, analytical, and configuration tables.

---

# 18.1 Introduction

Columns define the individual attributes of database entities. Poorly designed columns lead to inconsistent data, increased storage costs, poor query performance, and difficult application maintenance.

This chapter establishes uniform standards for:

* Column naming
* Data types
* Nullability
* Default values
* Audit attributes
* Security classifications
* Validation
* Documentation
* Governance

These standards ensure that every database column is predictable, reusable, and aligned with enterprise architecture principles.

---

# 18.2 Objectives

The objectives of the Column Design Standards are to:

* Standardize column definitions.
* Improve data consistency.
* Reduce ambiguity.
* Simplify development.
* Optimize storage utilization.
* Enhance query performance.
* Improve security.
* Support regulatory compliance.
* Enable automated validation.
* Facilitate long-term maintenance.

---

### CDS-001

Every database column shall comply with the approved enterprise standards.

---

### CDS-002

Column definitions shall be documented and version controlled.

---

# 18.3 Column Design Principles

Column design follows these core principles.

### Atomicity

Each column stores one business attribute only.

### Clarity

Column names shall clearly describe the stored information.

### Consistency

Identical business concepts shall use identical column names and data types across schemas.

### Minimal Redundancy

Duplicate information shall be avoided.

### Extensibility

Columns should accommodate future business growth without unnecessary redesign.

### Data Integrity

Appropriate constraints and validations shall be applied.

---

### CDS-003

Columns shall store a single business concept.

---

### CDS-004

Column definitions shall remain consistent across business domains.

---

# 18.4 Column Classification

Columns are classified by purpose.

| Category      | Examples               |
| ------------- | ---------------------- |
| Identifier    | id, course_id          |
| Business      | first_name, title      |
| Relationship  | student_id, module_id  |
| Status        | status, is_active      |
| Audit         | created_at, updated_at |
| Metadata      | version, remarks       |
| Security      | password_hash          |
| Configuration | settings_json          |
| Analytics     | completion_rate        |

Each category follows standardized implementation guidelines.

---

### CDS-005

Every column shall have a documented category.

---

### CDS-006

Column category shall determine applicable standards.

---

# 18.5 Column Naming Standards

Column names shall be:

* Lowercase
* Snake_case
* Business-oriented
* Descriptive
* Consistent
* Free of abbreviations unless standardized

Examples:

```text id="cds1"
first_name
last_name
course_title
email
assessment_score
created_at
updated_at
is_active
password_hash
```

Invalid examples:

```text id="cds2"
FirstName
COURSETITLE
fname
CourseTitle
emailAddressField
```

Suffix conventions:

| Suffix | Purpose                         |
| ------ | ------------------------------- |
| _id    | Foreign key                     |
| _at    | Timestamp                       |
| _date  | Date                            |
| _count | Numeric count                   |
| _flag  | Boolean indicator (legacy only) |
| is_    | Boolean state                   |
| has_   | Boolean capability              |

---

### CDS-007

Column names shall use lowercase snake_case.

---

### CDS-008

Columns representing identical concepts shall use identical names.

---

# 18.6 Data Type Standards

Approved PostgreSQL data types:

| Business Data | PostgreSQL Type        |
| ------------- | ---------------------- |
| Identifier    | UUID                   |
| Short Text    | VARCHAR(n)             |
| Long Text     | TEXT                   |
| Boolean       | BOOLEAN                |
| Integer       | INTEGER                |
| Large Integer | BIGINT                 |
| Decimal       | NUMERIC(p,s)           |
| Date          | DATE                   |
| Timestamp     | TIMESTAMPTZ            |
| JSON          | JSONB                  |
| Binary        | BYTEA (exception only) |

Guidelines:

* Use the smallest appropriate data type.
* Prefer `TIMESTAMPTZ` over `TIMESTAMP`.
* Use `NUMERIC` for financial or precision-sensitive values.
* Use `JSONB` only for semi-structured data.

---

### CDS-009

Column data types shall accurately represent business requirements.

---

### CDS-010

Database-specific data types shall follow enterprise standards.

---

# 18.7 Nullability Standards

Nullability communicates whether a value is mandatory.

Guidelines:

* Business-critical attributes → `NOT NULL`
* Optional business information → `NULL`
* Avoid unnecessary nullable columns.
* Document nullable business attributes.

Example:

```sql id="8cd91x"
first_name VARCHAR(100) NOT NULL

middle_name VARCHAR(100) NULL

email VARCHAR(255) NOT NULL
```

---

### CDS-011

Mandatory business attributes shall use `NOT NULL`.

---

### CDS-012

Nullable columns shall require documented business justification.

---

# 18.8 Default Value Standards

Default values reduce application complexity and improve consistency.

Examples:

```sql id="cds3"
is_active BOOLEAN DEFAULT TRUE

created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

version INTEGER DEFAULT 1
```

Default values shall never replace proper validation.

---

### CDS-013

Default values shall represent valid business defaults.

---

### CDS-014

Default expressions shall be deterministic unless explicitly approved.

---

# 18.9 Standard Audit Columns

Operational tables shall include standardized audit columns.

| Column     | Type        | Purpose            |
| ---------- | ----------- | ------------------ |
| created_at | TIMESTAMPTZ | Record creation    |
| created_by | UUID        | Creator            |
| updated_at | TIMESTAMPTZ | Last update        |
| updated_by | UUID        | Modifier           |
| version    | INTEGER     | Optimistic locking |
| is_active  | BOOLEAN     | Active status      |

Optional audit columns:

* deleted_at
* deleted_by
* deleted_reason

---

### CDS-015

Audit column names and data types shall be standardized.

---

### CDS-016

Audit metadata shall be maintained automatically wherever possible.

---

# 18.10 Business Column Standards

Business columns store core application information.

Examples:

| Entity      | Business Columns               |
| ----------- | ------------------------------ |
| Student     | first_name, last_name          |
| Course      | title, description             |
| Lesson      | lesson_title, duration_minutes |
| Assessment  | passing_score                  |
| Certificate | certificate_number             |

Business columns shall:

* Reflect business terminology.
* Avoid technical jargon.
* Remain stable over time.

---

### CDS-017

Business columns shall use domain-specific terminology.

---

### CDS-018

Business attributes shall remain implementation-independent.

---

# 18.11 Relationship Columns

Relationship columns establish entity associations.

Examples:

```text id="cds4"
student_id

course_id

lesson_id

assessment_id

institution_id
```

Requirements:

* Match referenced primary key data type.
* Enforce referential integrity.
* Be indexed when appropriate.
* Clearly indicate ownership.

---

### CDS-019

Relationship columns shall use the `_id` suffix.

---

### CDS-020

Referenced and referencing columns shall use identical data types.

---

# 18.12 Sensitive Data Columns

Sensitive information requires additional protection.

Examples:

| Sensitive Column | Protection                  |
| ---------------- | --------------------------- |
| password_hash    | Strong hashing              |
| email            | Encryption (where required) |
| phone_number     | Encryption                  |
| government_id    | Encryption                  |
| api_key          | Encryption                  |
| refresh_token    | Encryption or hashing       |

Sensitive values shall never be stored in plain text when cryptographic protection is required.

---

### CDS-021

Sensitive columns shall be classified according to the enterprise data classification policy.

---

### CDS-022

Sensitive information shall use approved cryptographic controls.

---

# 18.13 Computed & Derived Columns

Derived values should generally be calculated within the application or reporting layer.

Permitted uses:

* Materialized reporting data
* Performance optimization
* Frequently queried aggregates

Examples:

```text id="cds5"
completion_percentage

average_score

total_lessons
```

Derived columns require documented ownership and refresh strategies.

---

### CDS-023

Derived columns shall have documented calculation logic.

---

### CDS-024

Stored computed values shall remain synchronized with source data.

---

# 18.14 Documentation Standards

Every column shall be documented.

Documentation includes:

* Business name
* Description
* Data type
* Length
* Nullable status
* Default value
* Validation rules
* Classification
* Security level
* Owner

Documentation shall be maintained alongside migration scripts.

---

### CDS-025

All production columns shall have complete documentation.

---

### CDS-026

Documentation shall remain synchronized with schema changes.

---

# 18.15 Performance Considerations

Column design directly impacts database performance.

Guidelines:

* Choose appropriate data types.
* Minimize oversized `VARCHAR` definitions.
* Avoid excessive JSON storage.
* Reduce nullable columns where possible.
* Avoid storing duplicate information.
* Index selectively.

Performance testing shall validate storage and query efficiency.

---

### CDS-027

Column definitions shall support expected production workloads.

---

### CDS-028

Storage optimization shall be considered during schema design.

---

# 18.16 Governance

Column design is governed through:

* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Change Advisory Board (CAB)
* Database Administration Team
* Architecture Decision Records (ADR)

Column additions, removals, or modifications require:

* Business approval
* Architecture review
* Migration review
* Security assessment
* Documentation update

---

### CDS-029

Column modifications shall follow the approved change management process.

---

### CDS-030

Enterprise column standards shall be reviewed periodically.

---

# 18.17 Traceability

This chapter defines the enterprise standards governing database column design for the Mediverse platform.

**Related Documents**

* Database Naming Conventions
* Database Object Standards
* Table Design Standards
* Physical Data Model
* Entity Relationship Diagram (ERD)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Transactional Tables
* Reference Tables
* Audit Tables
* Analytical Tables
* Configuration Tables
* All PostgreSQL Schemas
* Database Migrations
* Data Governance

---

# Chapter Summary

This chapter establishes the Column Design Standards for the Mediverse platform. It defines standardized approaches for naming, categorizing, documenting, validating, securing, and governing database columns. By enforcing consistent data types, nullability rules, audit attributes, security classifications, and performance considerations, these standards ensure that every column contributes to a robust, scalable, secure, and maintainable enterprise database.

---

**End of Chapter 18**

**Next:** **Chapter 19 – Primary Key Strategy**.

---

# Chapter 19 — Primary Key Strategy

---

# Chapter Overview

This chapter defines the enterprise **Primary Key Strategy** for the **Mediverse – AI-Powered Medical Education Platform**. It establishes standards for identifying every database record uniquely, ensuring scalability, referential integrity, distributed compatibility, and long-term maintainability.

The strategy applies uniformly across all PostgreSQL schemas and serves as the foundation for relationships, indexing, data synchronization, auditing, replication, and microservice communication.

---

# 19.1 Introduction

A **Primary Key (PK)** uniquely identifies each row within a database table. It is one of the most critical components of relational database design because it enables:

* Unique record identification
* Referential integrity
* Efficient indexing
* High-performance joins
* Reliable data synchronization
* Distributed system compatibility
* Secure audit tracking
* Optimistic concurrency control

The Mediverse platform adopts a standardized UUID-based primary key strategy to support cloud-native deployment, horizontal scaling, and microservice independence.

---

# 19.2 Objectives

The objectives of the Primary Key Strategy are to:

* Ensure every row is uniquely identifiable.
* Eliminate duplicate identifiers.
* Support distributed architectures.
* Enable efficient joins.
* Improve replication consistency.
* Simplify database migrations.
* Support global uniqueness.
* Maintain referential integrity.
* Facilitate auditability.
* Standardize identifier implementation.

---

### PKS-001

Every persistent table shall define exactly one primary key.

---

### PKS-002

Primary keys shall uniquely identify every record throughout its lifecycle.

---

# 19.3 Primary Key Design Principles

The Mediverse platform follows these design principles.

### Global Uniqueness

Primary keys shall be globally unique.

### Immutability

Primary key values shall never change after creation.

### Business Independence

Business attributes shall not serve as primary keys.

### Simplicity

Primary keys should consist of a single column whenever possible.

### Technology Consistency

Primary key implementation shall be standardized across all schemas.

### Scalability

The strategy shall support distributed deployments without identifier collisions.

---

### PKS-003

Primary keys shall remain immutable.

---

### PKS-004

Business identifiers shall not be used as primary keys.

---

# 19.4 Approved Primary Key Types

The following identifier types were evaluated.

| Type            | Status         | Notes                          |
| --------------- | -------------- | ------------------------------ |
| UUID            | **Approved**   | Enterprise standard            |
| BIGINT Sequence | Conditional    | Legacy or reporting use        |
| SERIAL          | Not Approved   | Deprecated approach            |
| Composite PK    | Exception Only | Requires architecture approval |
| Natural Key     | Not Approved   | Business value may change      |

The standard implementation for Mediverse is **UUID Version 4** (or equivalent cryptographically secure UUID generation supported by PostgreSQL).

---

### PKS-005

UUID shall be the default identifier type.

---

### PKS-006

Alternative key strategies require formal architectural approval.

---

# 19.5 UUID Strategy

Every operational entity uses UUID-based identifiers.

Example:

```sql id="pks1"
id UUID PRIMARY KEY
DEFAULT gen_random_uuid()
```

Advantages include:

* Globally unique identifiers
* No central sequence dependency
* Distributed generation
* Cloud-native compatibility
* Easier data merging
* Safer replication
* Reduced identifier collision risk

---

### PKS-007

UUID generation shall use approved PostgreSQL cryptographic functions.

---

### PKS-008

Application-generated UUIDs shall comply with enterprise standards.

---

# 19.6 Primary Key Naming Standards

Primary key columns shall follow consistent naming rules.

Standard:

```text id="pks2"
id
```

Referenced foreign keys:

```text id="pks3"
user_id

student_id

course_id

lesson_id

assessment_id
```

Benefits:

* Simplified ORM configuration
* Consistent SQL queries
* Easier code generation
* Predictable repository implementation

---

### PKS-009

Primary key columns shall be named `id`.

---

### PKS-010

Foreign key columns shall reference the owning entity using the `_id` suffix.

---

# 19.7 Primary Key Constraints

Every primary key shall enforce:

* UNIQUE
* NOT NULL
* PRIMARY KEY
* Automatic indexing

Example:

```sql id="pks4"
CREATE TABLE courses (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL

);
```

PostgreSQL automatically creates a unique B-tree index for the primary key.

---

### PKS-011

Primary keys shall enforce uniqueness and non-nullability.

---

### PKS-012

Primary key indexes shall not be removed.

---

# 19.8 Primary Key Usage Rules

Primary keys shall be used for:

* Entity identification
* Foreign key references
* API resource identification
* Audit logging
* Event publishing
* Internal service communication

Primary keys shall **not** be used to encode business meaning.

Examples of prohibited practices:

* Student registration numbers
* Course codes
* Email addresses
* Medical registration numbers

These values belong in alternate key columns.

---

### PKS-013

Primary keys shall remain business-neutral.

---

### PKS-014

Business identifiers shall be modeled as alternate keys.

---

# 19.9 Composite Primary Keys

Composite primary keys are discouraged.

Permitted scenarios include:

* Pure junction tables
* Legacy integration requirements
* Specialized reporting datasets

Preferred approach:

```text id="pks5"
user_roles

-----------------

id

user_id

role_id
```

Instead of:

```text id="pks6"
PRIMARY KEY (user_id, role_id)
```

Surrogate UUID keys simplify ORM mapping, auditing, and future extensibility.

---

### PKS-015

Composite primary keys require architecture approval.

---

### PKS-016

Surrogate UUID keys shall be preferred over composite identifiers.

---

# 19.10 Primary Key Lifecycle

The lifecycle of a primary key is immutable.

```text id="pks7"
Generate UUID
      │
Persist Record
      │
Referenced by Foreign Keys
      │
Used by APIs
      │
Audited
      │
Archived
```

At no stage shall the primary key value change.

---

### PKS-017

Primary key values shall persist for the lifetime of the record.

---

### PKS-018

Primary keys shall remain valid across archival and restoration processes.

---

# 19.11 Performance Considerations

UUIDs introduce different storage and indexing characteristics than sequential integers.

Optimization strategies include:

* Native PostgreSQL UUID type
* B-tree indexing
* Appropriate fill factor
* Regular index maintenance
* Periodic VACUUM and ANALYZE
* Query plan monitoring

For analytical workloads, surrogate integer keys may be introduced in data warehouse environments without replacing operational UUID identifiers.

---

### PKS-019

Primary key performance shall be monitored in production.

---

### PKS-020

Operational optimizations shall preserve identifier semantics.

---

# 19.12 Security Considerations

Primary keys are not considered confidential; however, predictable identifiers can facilitate enumeration attacks.

Security recommendations:

* Use random UUIDs.
* Avoid exposing sequential identifiers.
* Validate identifiers at API boundaries.
* Prevent identifier tampering through authorization checks.
* Log access to sensitive entities.

APIs shall verify ownership before returning records associated with a supplied primary key.

---

### PKS-021

Public APIs shall validate access to resources identified by primary keys.

---

### PKS-022

Identifier exposure shall not bypass authorization controls.

---

# 19.13 Migration Strategy

Legacy tables using integer-based identifiers shall migrate according to an approved transition plan.

Migration phases:

```text id="pks8"
Assessment
      │
UUID Column Addition
      │
Backfill Existing Records
      │
Foreign Key Migration
      │
Application Update
      │
Validation
      │
Legacy Key Retirement
```

Migration scripts shall be implemented through Flyway and validated in lower environments before production deployment.

---

### PKS-023

Primary key migrations shall follow controlled change management procedures.

---

### PKS-024

Identifier migrations shall preserve referential integrity throughout the transition.

---

# 19.14 Governance

Primary key governance includes:

* Architecture Review Board approval
* Database design review
* Migration review
* Performance assessment
* Security review
* Data governance validation
* Documentation updates
* Architecture Decision Records (ADR)

Exceptions to the enterprise strategy require formal approval and documented justification.

---

### PKS-025

Primary key strategy exceptions require documented architectural approval.

---

### PKS-026

Primary key standards shall be periodically reviewed and updated.

---

# 19.15 Traceability

This chapter defines the enterprise Primary Key Strategy for the Mediverse platform.

**Related Documents**

* Database Object Standards
* Table Design Standards
* Column Design Standards
* Physical Data Model
* Entity Relationship Diagram (ERD)
* Domain Model Mapping
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Tables
* Primary Keys
* UUID Generation
* Database Migrations
* Foreign Key Relationships
* APIs
* Microservices
* Data Governance

---

# Chapter Summary

This chapter establishes the Primary Key Strategy for the Mediverse platform. It standardizes the use of UUID-based identifiers, defines naming conventions, lifecycle rules, constraints, performance considerations, security controls, migration strategies, and governance requirements. By enforcing immutable, globally unique, and business-independent identifiers, the platform ensures reliable referential integrity, distributed scalability, and long-term maintainability across all enterprise database schemas.

---

**End of Chapter 19**

**Next:** **Chapter 20 – Foreign Key Strategy**.

---

# Chapter 20 — Foreign Key Strategy

---

# Chapter Overview

This chapter defines the enterprise **Foreign Key Strategy** for the **Mediverse – AI-Powered Medical Education Platform**. It establishes standards for implementing and managing relationships between database entities to ensure referential integrity, data consistency, scalability, and maintainability across all PostgreSQL schemas.

The Foreign Key Strategy provides the foundation for enforcing business relationships while supporting a modular, Domain-Driven Design (DDD) architecture and microservices-based deployment.

---

# 20.1 Introduction

A **Foreign Key (FK)** is a column or group of columns that establishes a relationship between two database tables by referencing the primary key of another table.

Foreign keys enable the database to enforce business relationships and prevent inconsistent or orphaned data.

Within Mediverse, foreign keys are used to:

* Enforce referential integrity
* Model business relationships
* Maintain data consistency
* Support efficient joins
* Enable cascade operations where appropriate
* Improve query reliability
* Preserve auditability
* Simplify data validation

---

# 20.2 Objectives

The objectives of the Foreign Key Strategy are to:

* Maintain referential integrity.
* Prevent orphan records.
* Standardize foreign key implementation.
* Support scalable schema evolution.
* Optimize query performance.
* Align database relationships with business rules.
* Enable safe data migrations.
* Reduce application complexity.
* Improve data governance.
* Ensure production reliability.

---

### FKS-001

Every relationship between dependent entities shall be enforced through a foreign key unless explicitly exempted.

---

### FKS-002

Foreign key implementation shall conform to enterprise database standards.

---

# 20.3 Foreign Key Design Principles

The Mediverse platform follows these principles.

### Referential Integrity

Relationships shall be enforced by the database.

### Business Alignment

Foreign keys shall represent actual business relationships.

### Consistency

Identical relationships shall use consistent naming and data types.

### Minimal Coupling

Only necessary relationships shall be established.

### Performance Awareness

Relationships shall be designed considering query performance.

### Extensibility

Foreign key definitions shall support future schema evolution.

---

### FKS-003

Foreign keys shall accurately model business dependencies.

---

### FKS-004

Relationship definitions shall remain consistent across all schemas.

---

# 20.4 Foreign Key Naming Standards

Foreign key columns follow a standardized naming convention.

Rule:

```text id="fks1"
<referenced_entity>_id
```

Examples:

```text id="fks2"
user_id
student_id
faculty_id
course_id
module_id
lesson_id
assessment_id
question_id
institution_id
department_id
notification_id
certificate_id
```

Foreign key constraint names:

```text id="fks3"
fk_courses_department

fk_modules_course

fk_lessons_module

fk_assessments_course

fk_submissions_student
```

---

### FKS-005

Foreign key columns shall use the `_id` suffix.

---

### FKS-006

Constraint names shall begin with the `fk_` prefix.

---

# 20.5 Data Type Consistency

A foreign key must always match the data type of its referenced primary key.

Example:

```sql id="fks4"
users.id UUID

students.user_id UUID
```

Incorrect example:

```text id="fks5"
users.id UUID

students.user_id BIGINT
```

Matching data types ensure efficient joins and prevent integrity issues.

---

### FKS-007

Referenced and referencing columns shall use identical data types.

---

### FKS-008

Implicit type conversions shall not be relied upon in foreign key relationships.

---

# 20.6 Relationship Types

The Mediverse database supports the following relationship types.

## One-to-One

```text id="fks6"
users
   │
   ▼
user_profiles
```

Example:

One user owns one profile.

---

## One-to-Many

```text id="fks7"
courses
    │
    ▼
modules
```

Example:

One course contains multiple modules.

---

## Many-to-Many

Implemented using a junction table.

```text id="fks8"
students
      │
      ▼
enrollments
      ▲
      │
courses
```

---

### FKS-009

Relationship type shall be documented for every foreign key.

---

### FKS-010

Many-to-many relationships shall use dedicated junction tables.

---

# 20.7 Cross-Schema Relationships

Relationships may span schemas.

Example:

```text id="fks9"
auth.users
      │
      ▼
users.students
      │
      ▼
academics.enrollments
      │
      ▼
assessments.submissions
```

Cross-schema foreign keys require:

* Architecture review
* Security validation
* Performance assessment
* Dependency documentation

Microservices should generally communicate through APIs or events instead of relying on extensive cross-schema foreign keys.

---

### FKS-011

Cross-schema foreign keys shall be minimized.

---

### FKS-012

Cross-schema relationships require documented architectural approval.

---

# 20.8 Cascade Strategy

Cascade actions determine behavior when parent records change.

Approved actions:

| Action    | Usage                  |
| --------- | ---------------------- |
| RESTRICT  | Default                |
| CASCADE   | Limited use            |
| SET NULL  | Optional relationships |
| NO ACTION | Controlled scenarios   |

Example:

```sql id="fks10"
FOREIGN KEY (course_id)

REFERENCES academics.courses(id)

ON DELETE RESTRICT

ON UPDATE RESTRICT
```

General guidance:

* Prefer `RESTRICT` for critical business data.
* Use `CASCADE` only for dependent child records.
* Avoid cascading deletes across major business aggregates.

---

### FKS-013

Cascade behavior shall be explicitly defined.

---

### FKS-014

Cascading deletes require documented business justification.

---

# 20.9 Indexing Strategy

Foreign key columns should normally be indexed to improve:

* JOIN performance
* DELETE validation
* UPDATE validation
* Query optimization

Example:

```sql id="fks11"
CREATE INDEX idx_modules_course_id

ON academics.modules(course_id);
```

Indexes should be monitored to ensure continued effectiveness.

---

### FKS-015

Frequently queried foreign keys shall be indexed.

---

### FKS-016

Unused foreign key indexes shall be periodically reviewed.

---

# 20.10 Integrity Validation

Referential integrity is enforced through:

* Database constraints
* Migration validation
* Automated testing
* Data quality checks
* CI/CD verification

Validation prevents:

* Orphan records
* Invalid references
* Duplicate relationships
* Inconsistent ownership

---

### FKS-017

Foreign key integrity shall be validated before deployment.

---

### FKS-018

Constraint violations shall prevent invalid transactions.

---

# 20.11 Migration Considerations

Foreign key changes require careful sequencing.

Recommended migration flow:

```text id="fks12"
Create Parent Table
        │
Insert Parent Data
        │
Create Child Table
        │
Add Foreign Key
        │
Validate Constraint
        │
Deploy
```

During migrations:

* Load parent records first.
* Backfill existing data before enabling constraints.
* Validate data quality before production rollout.

---

### FKS-019

Migration scripts shall preserve referential integrity throughout execution.

---

### FKS-020

Constraint validation shall be completed before production deployment.

---

# 20.12 Performance Considerations

Foreign keys influence database performance.

Best practices:

* Index foreign key columns.
* Avoid unnecessary relationships.
* Keep join paths simple.
* Monitor execution plans.
* Reduce deep join chains.
* Partition very large child tables when required.

Performance tuning shall be evidence-based and validated through load testing.

---

### FKS-021

Foreign key performance shall be monitored continuously.

---

### FKS-022

Relationship optimization shall preserve business correctness.

---

# 20.13 Security Considerations

Foreign keys indirectly expose business relationships and therefore require security considerations.

Controls include:

* Schema-level permissions
* Row-Level Security (RLS)
* Least-privilege access
* Audit logging
* Secure API authorization

Relationship traversal through APIs shall respect authorization boundaries.

---

### FKS-023

Foreign key relationships shall not bypass access control policies.

---

### FKS-024

Relationship-based queries shall be subject to authorization checks.

---

# 20.14 Governance

Foreign key governance includes:

* Database Architecture Review Board
* Enterprise Data Governance Board
* Security Review Committee
* Change Advisory Board (CAB)
* Database Administration Team
* Architecture Decision Records (ADR)

Changes to relationships require:

* Business approval
* Architecture review
* Migration review
* Performance assessment
* Documentation update

---

### FKS-025

Foreign key modifications require governance approval.

---

### FKS-026

Relationship documentation shall remain synchronized with implementation.

---

# 20.15 Traceability

This chapter defines the enterprise Foreign Key Strategy for the Mediverse platform.

**Related Documents**

* Primary Key Strategy
* Table Design Standards
* Column Design Standards
* Entity Relationship Diagram (ERD)
* Physical Data Model
* Domain Model Mapping
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Foreign Keys
* Database Relationships
* Referential Integrity
* Cross-Schema Dependencies
* Database Migrations
* Query Optimization
* Microservices
* Data Governance

---

# Chapter Summary

This chapter establishes the Foreign Key Strategy for the Mediverse platform. It standardizes the implementation of database relationships through consistent naming conventions, matching data types, referential integrity enforcement, indexing strategies, cascade behaviors, migration practices, performance optimization, security controls, and governance processes. By applying these standards, the platform ensures reliable and maintainable relationships across all database schemas while supporting enterprise-scale performance and long-term architectural evolution.

---

**End of Chapter 20**

**Next:** **Chapter 21 – Composite Keys**.

---

# Chapter 21 — Composite Keys

---

# Chapter Overview

This chapter defines the enterprise **Composite Key Strategy** for the **Mediverse – AI-Powered Medical Education Platform**. It establishes standards for the use of composite keys, identifies approved use cases, outlines design principles, and provides governance for their implementation.

While the Mediverse platform adopts **UUID-based surrogate primary keys** as the enterprise standard, composite keys remain valuable in specific scenarios such as junction tables, natural uniqueness enforcement, reporting structures, and legacy integrations.

The objective of this chapter is to ensure that composite keys are used consistently, sparingly, and only when they provide measurable business or technical value.

---

# 21.1 Introduction

A **Composite Key** is a key composed of two or more columns that together uniquely identify a record.

Example:

```text id="ck1"
(student_id, course_id)
```

Neither column alone uniquely identifies the row, but together they represent a unique enrollment.

Composite keys are commonly used for:

* Junction tables
* Business uniqueness
* Legacy integrations
* Reporting dimensions
* Data warehouse structures

For operational systems, Mediverse generally prefers **surrogate UUID primary keys** while using composite keys as **unique constraints** where appropriate.

---

# 21.2 Objectives

The objectives of the Composite Key Strategy are to:

* Standardize composite key usage.
* Minimize implementation complexity.
* Preserve business integrity.
* Improve query efficiency.
* Support normalization.
* Simplify ORM mapping.
* Enable scalable schema evolution.
* Maintain referential integrity.
* Reduce maintenance overhead.
* Ensure architectural consistency.

---

### CKS-001

Composite keys shall only be used where they provide demonstrable business or technical value.

---

### CKS-002

Surrogate UUID primary keys remain the enterprise default.

---

# 21.3 Composite Key Design Principles

The Mediverse platform follows these principles.

### Business Meaning

Composite keys shall represent meaningful business relationships.

### Simplicity

The number of participating columns shall be minimized.

### Stability

Composite key attributes shall remain stable over time.

### Consistency

Composite key definitions shall follow standardized naming conventions.

### Performance

Composite keys shall not introduce unnecessary indexing or query overhead.

### Maintainability

Composite keys shall remain easy to understand and document.

---

### CKS-003

Composite keys shall contain only stable attributes.

---

### CKS-004

Composite key definitions shall be documented before implementation.

---

# 21.4 Approved Use Cases

Composite keys are approved for the following scenarios.

## Junction Tables

Examples:

* Student ↔ Course
* User ↔ Role
* Faculty ↔ Department

Example:

```text id="ck2"
(student_id, course_id)
```

---

## Business Uniqueness

Examples:

* Institution + Department Code
* Course + Academic Year
* Lesson + Version

---

## Reporting Tables

Example:

```text id="ck3"
(report_date, institution_id)
```

---

## Legacy Database Integration

Composite identifiers may be retained when integrating with external systems that cannot be modified.

---

### CKS-005

Composite keys shall only be implemented for approved scenarios.

---

### CKS-006

Operational business entities shall not require composite primary keys unless formally approved.

---

# 21.5 Non-Approved Use Cases

Composite keys shall **not** be used for:

* Simplifying application logic
* Replacing UUID identifiers
* Avoiding additional columns
* Encoding business rules
* Performance assumptions without benchmarking

Poor example:

```text id="ck4"
(email, phone_number)
```

Although unique today, these values may change and therefore are unsuitable as primary identifiers.

---

### CKS-007

Mutable business attributes shall not participate in composite primary keys.

---

### CKS-008

Composite keys shall not replace alternate key constraints.

---

# 21.6 Composite Primary Keys vs. Composite Unique Keys

The Mediverse platform distinguishes between two approaches.

| Feature               | Composite Primary Key | Composite Unique Key |
| --------------------- | --------------------- | -------------------- |
| Purpose               | Record identity       | Business uniqueness  |
| Enterprise Preference | Rare                  | Preferred            |
| UUID Surrogate Key    | Optional              | Required             |
| ORM Compatibility     | Lower                 | Higher               |
| Schema Flexibility    | Lower                 | Higher               |

Recommended approach:

```text id="ck5"
id (UUID Primary Key)

UNIQUE(student_id, course_id)
```

Instead of:

```text id="ck6"
PRIMARY KEY(student_id, course_id)
```

This approach simplifies application development while preserving business uniqueness.

---

### CKS-009

Composite unique constraints shall be preferred over composite primary keys.

---

### CKS-010

UUID surrogate keys shall remain the primary identifier for operational entities.

---

# 21.7 Naming Standards

Composite constraints shall follow standardized naming.

Examples:

```text id="ck7"
uq_student_course

uq_user_role

uq_course_version

pk_student_course
```

Naming conventions:

| Prefix | Meaning           |
| ------ | ----------------- |
| pk_    | Primary Key       |
| uq_    | Unique Constraint |
| fk_    | Foreign Key       |
| idx_   | Index             |

---

### CKS-011

Composite constraint names shall follow enterprise naming conventions.

---

### CKS-012

Constraint names shall clearly describe participating entities.

---

# 21.8 ORM Considerations

Object-Relational Mapping (ORM) frameworks such as Hibernate generally favor surrogate keys.

Recommended implementation:

```text id="ck8"
Entity

 ├── id (UUID)

 ├── student_id

 └── course_id

UNIQUE(student_id, course_id)
```

Benefits:

* Simpler entity mapping
* Easier repository implementation
* Cleaner REST APIs
* Reduced serialization complexity
* Better caching support

Composite primary keys should only be used when framework limitations and maintenance impacts have been evaluated.

---

### CKS-013

ORM compatibility shall be considered before introducing composite primary keys.

---

### CKS-014

Repository implementations shall remain simple and maintainable.

---

# 21.9 Indexing Strategy

Composite keys influence index design.

Example:

```sql id="ck9"
CREATE UNIQUE INDEX uq_student_course

ON academics.enrollments
(student_id, course_id);
```

Index ordering should match query access patterns.

Example:

Common query:

```sql id="ck10"
WHERE student_id = ?
```

Preferred index:

```text id="ck11"
(student_id, course_id)
```

Not:

```text id="ck12"
(course_id, student_id)
```

---

### CKS-015

Composite indexes shall reflect production query patterns.

---

### CKS-016

Index column order shall be based on selectivity and workload analysis.

---

# 21.10 Performance Considerations

Composite keys affect:

* Index size
* Join complexity
* Insert performance
* Update performance
* Query execution plans

Performance recommendations:

* Keep composite keys small.
* Avoid unnecessary columns.
* Limit composite keys to three columns whenever possible.
* Benchmark large composite indexes.
* Review execution plans periodically.

---

### CKS-017

Composite keys shall be optimized for expected production workloads.

---

### CKS-018

Performance impacts shall be validated through load testing.

---

# 21.11 Migration Considerations

Introducing or modifying composite keys requires careful planning.

Migration workflow:

```text id="ck13"
Data Assessment
       │
Constraint Definition
       │
Data Validation
       │
Backfill
       │
Constraint Creation
       │
Verification
       │
Production Deployment
```

Flyway migration scripts shall:

* Validate existing data.
* Prevent duplicate records.
* Roll back safely on failure.
* Preserve referential integrity.

---

### CKS-019

Composite key migrations shall be executed through version-controlled scripts.

---

### CKS-020

Data quality validation shall precede constraint creation.

---

# 21.12 Security Considerations

Composite keys may expose relationships between business entities.

Security recommendations:

* Apply authorization checks before relationship traversal.
* Restrict access using Row-Level Security (RLS) where applicable.
* Audit access to sensitive relationship data.
* Avoid exposing composite keys directly through public APIs.

Public APIs should expose surrogate UUID identifiers instead.

---

### CKS-021

Composite relationship data shall respect authorization boundaries.

---

### CKS-022

Public interfaces shall avoid exposing composite implementation details.

---

# 21.13 Governance

Composite key governance includes:

* Database Architecture Review Board
* Enterprise Data Governance Board
* Security Review Committee
* Change Advisory Board (CAB)
* Database Administration Team
* Architecture Decision Records (ADR)

Any new composite primary key requires:

* Business justification
* Performance assessment
* ORM compatibility review
* Documentation update
* Architecture approval

---

### CKS-023

Composite primary keys require formal architectural approval.

---

### CKS-024

Composite key implementations shall be periodically reviewed for continued suitability.

---

# 21.14 Traceability

This chapter defines the enterprise Composite Key Strategy for the Mediverse platform.

**Related Documents**

* Primary Key Strategy
* Foreign Key Strategy
* Table Design Standards
* Column Design Standards
* Entity Relationship Diagram (ERD)
* Physical Data Model
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Junction Tables
* Composite Constraints
* Unique Constraints
* Primary Keys
* ORM Mapping
* Database Migrations
* Query Optimization
* Data Governance

---

# Chapter Summary

This chapter establishes the Composite Key Strategy for the Mediverse platform. It defines when composite keys are appropriate, differentiates between composite primary keys and composite unique constraints, specifies naming conventions, ORM considerations, indexing strategies, migration practices, performance guidelines, security controls, and governance requirements. By prioritizing UUID surrogate keys while allowing carefully controlled use of composite constraints, the platform achieves both architectural consistency and business integrity.

---

**End of Chapter 21**

**Next:** **Chapter 22 – Constraints Design**.

---

# Chapter 22 — Non-Functional Requirements

---

# 22.1 Introduction

Non-Functional Requirements (NFRs) define the quality attributes that determine how the Mediverse platform performs, scales, secures, operates, and evolves. Unlike functional requirements, which specify what the system shall do, non-functional requirements specify how well the system shall perform those functions.

As a cloud-native, AI-powered medical education platform, Mediverse shall meet enterprise-grade expectations for performance, availability, scalability, reliability, security, maintainability, usability, observability, compliance, and operational excellence.

All architecture decisions presented in previous chapters shall collectively satisfy the quality attributes defined in this chapter.

---

# 22.2 Objectives

The Non-Functional Requirements shall:

* Define measurable quality attributes.
* Establish enterprise performance targets.
* Ensure platform scalability.
* Improve operational reliability.
* Support regulatory compliance.
* Enhance user experience.
* Strengthen security.
* Enable continuous availability.
* Facilitate maintainability.
* Support long-term architectural evolution.

---

# 22.3 Quality Attribute Model

The Mediverse platform adopts the following enterprise quality model.

| Quality Attribute | Objective                               |
| ----------------- | --------------------------------------- |
| Performance       | Fast and predictable response times     |
| Scalability       | Support increasing workloads            |
| Availability      | Continuous service operation            |
| Reliability       | Consistent and fault-tolerant behavior  |
| Security          | Protection of data and services         |
| Maintainability   | Ease of modification and support        |
| Observability     | Comprehensive operational visibility    |
| Interoperability  | Standardized system integration         |
| Usability         | Efficient and intuitive user experience |
| Compliance        | Adherence to applicable regulations     |

---

### NFR-001

Every architectural decision shall support one or more defined quality attributes.

---

### NFR-002

Quality attributes shall be measurable wherever practical.

---

# 22.4 Performance Requirements

The platform shall provide predictable response times under normal operating conditions.

| Metric                         | Target      |
| ------------------------------ | ----------- |
| API Response (Average)         | ≤ 300 ms    |
| API Response (95th Percentile) | ≤ 500 ms    |
| Authentication                 | ≤ 300 ms    |
| Search Request                 | ≤ 500 ms    |
| AI Response Initiation         | ≤ 2 seconds |
| Page Load (Initial)            | ≤ 3 seconds |
| Cache Retrieval                | ≤ 20 ms     |
| Database Query (Typical)       | ≤ 100 ms    |

Performance targets shall be validated through automated performance testing.

---

### NFR-003

Critical APIs shall satisfy defined response-time objectives.

---

### NFR-004

Performance regressions shall be detected before production deployment.

---

# 22.5 Scalability Requirements

The platform shall support horizontal scaling across cloud infrastructure.

Scalability objectives include:

* Stateless application services
* Horizontal Pod Autoscaling
* Distributed caching
* Event-driven processing
* Independent service scaling
* Elastic storage
* Auto-scaling infrastructure

Representative scalability targets:

| Metric             | Target                   |
| ------------------ | ------------------------ |
| Concurrent Users   | ≥ 50,000                 |
| API Requests       | ≥ 10,000 requests/second |
| Kafka Throughput   | ≥ 100,000 events/minute  |
| Horizontal Scaling | Automatic                |

---

### NFR-005

Application services shall support horizontal scaling.

---

### NFR-006

No architectural component shall unnecessarily limit platform scalability.

---

# 22.6 Availability Requirements

Mediverse shall remain continuously available during normal operations.

Availability targets:

| Service Category | Availability Target |
| ---------------- | ------------------- |
| Core Platform    | 99.95%              |
| Authentication   | 99.95%              |
| AI Services      | 99.90%              |
| Search           | 99.90%              |
| Analytics        | 99.50%              |

Availability shall be achieved through redundancy, automated recovery, and fault isolation.

---

### NFR-007

Critical production services shall satisfy their availability objectives.

---

### NFR-008

Single points of failure shall be eliminated where practical.

---

# 22.7 Reliability Requirements

Reliability ensures consistent system behavior.

The architecture shall support:

* Fault isolation
* Automatic retries
* Circuit breakers
* Graceful degradation
* Idempotent processing
* Message durability
* Transaction recovery

Representative reliability targets:

| Metric                      | Target                   |
| --------------------------- | ------------------------ |
| Successful Transaction Rate | ≥ 99.9%                  |
| Message Delivery Success    | ≥ 99.99%                 |
| Recovery after Failure      | Automatic where feasible |

---

### NFR-009

Transient failures shall be automatically recoverable where appropriate.

---

### NFR-010

Critical business operations shall remain resilient to infrastructure failures.

---

# 22.8 Security Requirements

Security shall be integrated throughout the platform.

Required capabilities include:

* OAuth2 authentication
* JWT authorization
* RBAC
* TLS encryption
* Encryption at rest
* Secret management
* Audit logging
* Secure coding
* Input validation
* API protection

The platform shall adopt a Zero Trust security model.

---

### NFR-011

All external communications shall use encrypted transport.

---

### NFR-012

Sensitive information shall remain protected throughout its lifecycle.

---

# 22.9 Maintainability Requirements

The platform shall remain maintainable throughout its lifecycle.

Maintainability practices include:

* Modular architecture
* Clean Architecture
* Domain-Driven Design
* Automated testing
* Continuous Integration
* Coding standards
* Architecture reviews
* Documentation

Representative maintainability objectives:

| Metric                | Target                 |
| --------------------- | ---------------------- |
| Unit Test Coverage    | ≥ 80%                  |
| Cyclomatic Complexity | Within approved limits |
| Critical Code Smells  | Zero before release    |

---

### NFR-013

Production code shall satisfy enterprise quality standards.

---

### NFR-014

Architectural consistency shall be preserved throughout development.

---

# 22.10 Observability Requirements

Every production service shall provide operational visibility.

Observability capabilities include:

* Structured logging
* Distributed tracing
* Metrics collection
* Health endpoints
* Alerting
* Correlation IDs
* Business metrics
* Audit events

Supported observability technologies include:

* Prometheus
* Grafana
* OpenTelemetry
* ELK/OpenSearch

---

### NFR-015

Critical services shall expose operational metrics.

---

### NFR-016

Every production request shall be traceable through correlation identifiers.

---

# 22.11 Usability Requirements

The platform shall provide an intuitive user experience.

Objectives include:

* Responsive design
* Mobile-first interfaces
* Accessibility support
* Consistent navigation
* Clear feedback
* Error recovery guidance
* Multilingual support
* Minimal learning curve

The user interface shall remain consistent across all applications.

---

### NFR-017

User interfaces shall comply with established design standards.

---

### NFR-018

Accessibility requirements shall be considered throughout the design process.

---

# 22.12 Interoperability Requirements

Mediverse shall integrate with internal and external systems using standardized interfaces.

Supported mechanisms include:

* REST APIs
* OpenAPI specifications
* Kafka events
* Webhooks
* OAuth2
* OIDC
* JSON
* HTTPS

Integration contracts shall remain version controlled.

---

### NFR-019

External integrations shall use standardized protocols.

---

### NFR-020

API contracts shall be backward compatible whenever feasible.

---

# 22.13 Compliance Requirements

The platform shall support institutional and regulatory compliance.

Representative governance areas include:

* Privacy protection
* Data retention
* Audit logging
* Secure access
* Consent management
* Data governance
* AI traceability
* Operational accountability

Compliance evidence shall be retained according to governance policies.

---

### NFR-021

Compliance controls shall be verifiable through audit evidence.

---

### NFR-022

Security and privacy requirements shall be integrated into system design.

---

# 22.14 Disaster Recovery Requirements

Business continuity shall be supported through disaster recovery capabilities.

Recovery objectives:

| Metric                         | Target       |
| ------------------------------ | ------------ |
| Recovery Point Objective (RPO) | ≤ 15 minutes |
| Recovery Time Objective (RTO)  | ≤ 1 hour     |

Recovery capabilities include:

* Automated backups
* Infrastructure as Code
* Multi-zone deployment
* Data replication
* Periodic recovery testing

---

### NFR-023

Critical production data shall be recoverable within defined objectives.

---

### NFR-024

Disaster recovery procedures shall be periodically validated.

---

# 22.15 Capacity Planning Requirements

Capacity planning shall ensure sustainable growth.

Monitoring shall include:

* CPU utilization
* Memory utilization
* Storage consumption
* Network bandwidth
* Database growth
* Cache utilization
* Kafka throughput
* AI inference capacity

Capacity thresholds shall trigger operational reviews before resource exhaustion occurs.

---

### NFR-025

Infrastructure capacity shall be continuously monitored.

---

### NFR-026

Capacity planning shall be reviewed periodically based on workload trends.

---

# 22.16 Quality Assurance Requirements

Quality assurance shall be integrated into the software delivery lifecycle.

Required practices include:

* Unit testing
* Integration testing
* Contract testing
* Performance testing
* Security testing
* Accessibility testing
* Static analysis
* Dependency scanning
* Code reviews

CI/CD pipelines shall enforce mandatory quality gates.

---

### NFR-027

Production releases shall satisfy all mandatory quality gates.

---

### NFR-028

Critical vulnerabilities shall be resolved before production deployment.

---

# 22.17 Traceability

This chapter traces to:

**Related PRD Sections**

* Performance
* Security
* User Experience
* Compliance
* Operational Excellence

**Related SRS Chapters**

* Chapter 26 – DevSecOps
* Chapter 27 – Performance, Scalability & Capacity Planning
* Chapter 28 – Monitoring, Logging & Observability
* Chapter 29 – Backup, Recovery & Business Continuity

**Architecture Views**

* Quality Attribute View
* Runtime View
* Operational Architecture
* Security Architecture
* Deployment Architecture

---

# Chapter Summary

This chapter defines the Non-Functional Requirements for the Mediverse platform by establishing measurable quality attributes covering performance, scalability, availability, reliability, security, maintainability, observability, usability, interoperability, compliance, disaster recovery, capacity planning, and quality assurance. These requirements provide the architectural quality baseline that governs all design, implementation, deployment, and operational decisions, ensuring that Mediverse delivers a secure, resilient, scalable, and enterprise-grade medical education platform.

---

**End of Chapter 22**

**Next:** Chapter 23 – Security Architecture.

---

# Chapter 23 — Default Values

---

# Chapter Overview

This chapter defines the enterprise **Default Values Strategy** for the **Mediverse – AI-Powered Medical Education Platform**. Default values ensure consistent initialization of database records, reduce application complexity, improve data quality, and enforce standardized behavior across all PostgreSQL schemas.

These standards apply to all operational, reference, configuration, audit, and analytical database objects within the Mediverse platform.

---

# 23.1 Introduction

A **Default Value** is a predefined value automatically assigned to a column when an explicit value is not provided during data insertion.

Properly designed defaults:

* Improve data consistency
* Reduce application logic
* Prevent incomplete records
* Simplify API development
* Improve migration compatibility
* Support auditing
* Enhance operational reliability

Default values shall represent valid business assumptions and must never conceal missing or invalid data.

---

# 23.2 Objectives

The objectives of the Default Values Strategy are to:

* Standardize default value implementation.
* Improve data consistency.
* Reduce application complexity.
* Prevent incomplete records.
* Support database automation.
* Simplify schema migrations.
* Enhance auditability.
* Improve operational reliability.
* Promote maintainability.
* Ensure enterprise-wide consistency.

---

### DVS-001

Default values shall be defined wherever a valid business default exists.

---

### DVS-002

Default values shall be implemented consistently across all database schemas.

---

# 23.3 Default Value Design Principles

The Mediverse platform follows these design principles.

### Business Validity

Defaults shall represent valid business states.

### Predictability

Generated values shall be deterministic unless intentionally dynamic.

### Simplicity

Default expressions shall remain simple and efficient.

### Consistency

Equivalent business attributes shall use identical defaults.

### Transparency

Applications shall understand when defaults are applied automatically.

### Maintainability

Default definitions shall remain easy to manage through migrations.

---

### DVS-003

Default values shall accurately represent the initial state of a business entity.

---

### DVS-004

Default expressions shall be documented and version controlled.

---

# 23.4 Categories of Default Values

Default values are classified according to their purpose.

| Category    | Example                |
| ----------- | ---------------------- |
| Timestamp   | CURRENT_TIMESTAMP      |
| Boolean     | TRUE, FALSE            |
| Numeric     | 0, 1                   |
| UUID        | gen_random_uuid()      |
| Enumeration | 'ACTIVE'               |
| JSON        | '{}'::jsonb            |
| Text        | 'N/A' (exception only) |
| Version     | 1                      |

Each category follows approved implementation guidelines.

---

### DVS-005

Every default value shall belong to a documented category.

---

### DVS-006

Default categories shall align with business semantics.

---

# 23.5 Timestamp Defaults

Audit timestamps shall be automatically initialized.

Example:

```sql id="dvs1"
created_at TIMESTAMPTZ
DEFAULT CURRENT_TIMESTAMP
```

`updated_at` shall generally be maintained by the application or database trigger rather than a static default.

Typical audit columns:

```text id="dvs2"
created_at

updated_at

deleted_at
```

---

### DVS-007

Creation timestamps shall use `CURRENT_TIMESTAMP`.

---

### DVS-008

Modification timestamps shall be maintained through controlled update mechanisms.

---

# 23.6 UUID Defaults

UUID primary keys shall be generated automatically.

Example:

```sql id="dvs3"
id UUID
DEFAULT gen_random_uuid()
```

Benefits:

* Globally unique identifiers
* Distributed compatibility
* Reduced application responsibility
* Simplified inserts

---

### DVS-009

Primary identifiers shall use enterprise-approved UUID generation.

---

### DVS-010

UUID generation functions shall be cryptographically secure.

---

# 23.7 Boolean Defaults

Boolean attributes shall define explicit default states.

Examples:

```sql id="dvs4"
is_active BOOLEAN DEFAULT TRUE

is_deleted BOOLEAN DEFAULT FALSE

email_verified BOOLEAN DEFAULT FALSE

two_factor_enabled BOOLEAN DEFAULT FALSE
```

Boolean defaults shall reflect the safest and most appropriate business assumption.

---

### DVS-011

Boolean defaults shall represent valid operational states.

---

### DVS-012

Implicit boolean assumptions shall be avoided.

---

# 23.8 Numeric Defaults

Numeric defaults initialize counters, versions, and ordering values.

Examples:

```sql id="dvs5"
version INTEGER DEFAULT 1

attempt_count INTEGER DEFAULT 0

display_order INTEGER DEFAULT 1

total_marks NUMERIC(5,2) DEFAULT 0
```

Defaults shall remain within defined business constraints.

---

### DVS-013

Numeric defaults shall represent valid initial values.

---

### DVS-014

Numeric defaults shall comply with applicable CHECK constraints.

---

# 23.9 Enumeration Defaults

Columns representing business states shall define default values where appropriate.

Examples:

```sql id="dvs6"
status VARCHAR(20)
DEFAULT 'ACTIVE'

approval_status VARCHAR(20)
DEFAULT 'PENDING'

learning_state VARCHAR(30)
DEFAULT 'NOT_STARTED'
```

Enumerated defaults shall correspond to approved domain values.

---

### DVS-015

Enumeration defaults shall reference approved business states.

---

### DVS-016

Enumeration defaults shall remain synchronized with domain definitions.

---

# 23.10 JSON Defaults

Semi-structured data stored in JSONB columns shall use valid JSON defaults.

Examples:

```sql id="dvs7"
preferences JSONB
DEFAULT '{}'::jsonb

settings JSONB
DEFAULT '{}'::jsonb

permissions JSONB
DEFAULT '[]'::jsonb
```

Applications shall treat JSON defaults consistently across all services.

---

### DVS-017

JSON columns shall use syntactically valid JSON defaults.

---

### DVS-018

Default JSON structures shall be documented.

---

# 23.11 Business Defaults

Business-specific defaults shall support common operational scenarios.

Examples:

| Business Attribute   | Default |
| -------------------- | ------- |
| Language             | English |
| Time Zone            | UTC     |
| Course Visibility    | Private |
| Notification Enabled | TRUE    |
| Certificate Status   | Draft   |
| Enrollment Status    | Pending |

Business defaults shall be approved by domain owners.

---

### DVS-019

Business defaults require documented functional approval.

---

### DVS-020

Business defaults shall not replace mandatory user input.

---

# 23.12 Default Value Limitations

Default values shall **not** be used to:

* Hide missing mandatory information
* Replace application validation
* Simulate business workflows
* Store calculated results
* Circumvent approval processes

Poor example:

```sql id="dvs8"
student_name DEFAULT 'Unknown'
```

The application should require valid user input instead.

---

### DVS-021

Default values shall not conceal incomplete or invalid data.

---

### DVS-022

Mandatory business information shall not rely on placeholder defaults.

---

# 23.13 Performance Considerations

Default expressions should remain lightweight.

Best practices:

* Prefer built-in PostgreSQL functions.
* Avoid computationally expensive expressions.
* Avoid external dependencies.
* Benchmark complex default generation.
* Monitor insert performance.

Default evaluation shall not introduce significant transaction overhead.

---

### DVS-023

Default expressions shall be optimized for production workloads.

---

### DVS-024

Performance impacts shall be evaluated during database testing.

---

# 23.14 Migration Strategy

Changes to default values shall follow controlled migration procedures.

Migration workflow:

```text id="dvs9"
Requirement Analysis
        │
Migration Script
        │
Testing
        │
Validation
        │
Production Deployment
```

Migration principles:

* Use Flyway versioned migrations.
* Document business rationale.
* Validate existing data.
* Test rollback scenarios.
* Verify compatibility with application services.

---

### DVS-025

Default value changes shall be implemented through version-controlled migrations.

---

### DVS-026

Migration testing shall verify backward compatibility.

---

# 23.15 Governance

Default value governance includes:

* Enterprise Data Governance Board
* Database Architecture Review Board
* Product Owners
* Security Review Committee
* Change Advisory Board (CAB)
* Database Administration Team
* Architecture Decision Records (ADR)

Changes to default values require:

* Business approval
* Architecture review
* Migration validation
* Documentation update

---

### DVS-027

Changes to default values require governance approval.

---

### DVS-028

Default value documentation shall remain synchronized with implementation.

---

# 23.16 Traceability

This chapter defines the enterprise Default Values Strategy for the Mediverse platform.

**Related Documents**

* Column Design Standards
* Constraints Design
* Table Design Standards
* Primary Key Strategy
* Database Naming Conventions
* Physical Data Model
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Tables
* Database Columns
* UUID Generation
* Audit Columns
* JSONB Fields
* Enumerations
* Database Migrations
* Enterprise Data Governance

---

# Chapter Summary

This chapter establishes the Default Values Strategy for the Mediverse platform. It standardizes the implementation of timestamp, UUID, boolean, numeric, enumeration, JSON, and business-specific default values while defining design principles, implementation standards, performance considerations, migration practices, and governance requirements. By ensuring that every default value reflects a valid and documented business assumption, the platform maintains consistent, reliable, and maintainable database behavior across all enterprise environments.

---

**End of Chapter 23**

**Next:** **Chapter 24 – Data Types Standardization**.

---

# Chapter 24 — Data Types Standardization

---

# Chapter Overview

This chapter defines the enterprise **Data Types Standardization Strategy** for the **Mediverse – AI-Powered Medical Education Platform**. It establishes standardized PostgreSQL data types for all database objects to ensure consistency, portability, performance, maintainability, and data integrity across every schema.

By adopting a unified data type strategy, Mediverse minimizes storage inefficiencies, prevents inconsistent implementations, simplifies application development, and supports long-term database evolution.

---

# 24.1 Introduction

Data types define the format, size, precision, and permissible values for database columns. Selecting the appropriate data type is fundamental to designing a scalable and high-performance database.

A standardized approach provides:

* Consistent schema design
* Efficient storage utilization
* Faster query execution
* Improved application compatibility
* Reliable data validation
* Easier database maintenance
* Better migration support
* Reduced development errors

All PostgreSQL database objects within the Mediverse platform shall follow the standards defined in this chapter.

---

# 24.2 Objectives

The objectives of the Data Types Standardization Strategy are to:

* Standardize data types across all schemas.
* Optimize storage efficiency.
* Improve query performance.
* Enhance data integrity.
* Reduce implementation inconsistencies.
* Simplify ORM mapping.
* Support cloud-native scalability.
* Improve migration compatibility.
* Enable automated validation.
* Ensure long-term maintainability.

---

### DTS-001

Every database column shall use an approved enterprise data type.

---

### DTS-002

Custom or vendor-specific data types require architecture approval.

---

# 24.3 Data Type Design Principles

The Mediverse platform follows these principles.

### Consistency

Equivalent business attributes shall use identical data types.

### Accuracy

Data types shall accurately represent business requirements.

### Minimal Storage

Choose the smallest suitable data type without compromising future growth.

### Performance

Data types shall support efficient indexing and query execution.

### Portability

Prefer PostgreSQL-standard data types over proprietary extensions where practical.

### Extensibility

Data type selection shall accommodate anticipated business growth.

---

### DTS-003

Data type selection shall prioritize correctness over storage optimization.

---

### DTS-004

Identical business concepts shall use identical data types throughout the platform.

---

# 24.4 Enterprise Data Type Catalog

The following table defines the approved enterprise data types.

| Business Concept | PostgreSQL Type  | Standard                |
| ---------------- | ---------------- | ----------------------- |
| Identifier       | UUID             | Mandatory               |
| Short Text       | VARCHAR(n)       | Preferred               |
| Long Text        | TEXT             | Preferred               |
| Boolean          | BOOLEAN          | Mandatory               |
| Small Integer    | SMALLINT         | Approved                |
| Integer          | INTEGER          | Preferred               |
| Large Integer    | BIGINT           | Approved                |
| Decimal          | NUMERIC(p,s)     | Mandatory for precision |
| Floating Point   | DOUBLE PRECISION | Limited use             |
| Date             | DATE             | Preferred               |
| Time             | TIME             | Approved                |
| Timestamp        | TIMESTAMPTZ      | Mandatory               |
| JSON             | JSONB            | Preferred               |
| Binary Data      | BYTEA            | Exception only          |
| UUID Array       | UUID[]           | Approved                |
| Text Array       | TEXT[]           | Limited use             |

---

### DTS-005

Only approved enterprise data types shall be used.

---

### DTS-006

Deprecated PostgreSQL types shall not be used in new development.

---

# 24.5 Identifier Data Types

All primary and foreign keys shall use UUID.

Example:

```sql id="dts1"
id UUID
DEFAULT gen_random_uuid()

student_id UUID

course_id UUID
```

Advantages:

* Global uniqueness
* Distributed generation
* Microservice compatibility
* Improved replication
* Simplified integration

---

### DTS-007

Entity identifiers shall use UUID.

---

### DTS-008

Identifier columns shall not use SERIAL or BIGSERIAL in operational schemas unless formally approved.

---

# 24.6 Character Data Types

Character data shall use either `VARCHAR(n)` or `TEXT` depending on business requirements.

Examples:

```sql id="dts2"
first_name VARCHAR(100)

last_name VARCHAR(100)

email VARCHAR(255)

course_title VARCHAR(300)

description TEXT
```

Guidelines:

* Use `VARCHAR(n)` where a maximum logical length exists.
* Use `TEXT` for unrestricted content.
* Avoid excessively large `VARCHAR` lengths without justification.

---

### DTS-009

Character limits shall reflect documented business requirements.

---

### DTS-010

TEXT shall be used for large unstructured content.

---

# 24.7 Numeric Data Types

Numeric columns shall be selected based on expected range and precision.

Examples:

```sql id="dts3"
credits SMALLINT

duration_minutes INTEGER

view_count BIGINT

passing_score NUMERIC(5,2)

tuition_fee NUMERIC(12,2)
```

Guidelines:

* Use `NUMERIC` for financial or precision-sensitive values.
* Avoid floating-point types for calculations requiring exact precision.
* Choose the smallest numeric type that satisfies business requirements.

---

### DTS-011

Precision-sensitive values shall use NUMERIC.

---

### DTS-012

Floating-point types shall not be used for financial or grading calculations.

---

# 24.8 Boolean Data Types

Boolean values shall use PostgreSQL `BOOLEAN`.

Examples:

```sql id="dts4"
is_active BOOLEAN

is_deleted BOOLEAN

email_verified BOOLEAN

two_factor_enabled BOOLEAN
```

Values:

* TRUE
* FALSE

Boolean flags shall not be represented using numeric or character values.

---

### DTS-013

Boolean attributes shall use the BOOLEAN data type.

---

### DTS-014

Legacy representations such as 'Y/N' or '1/0' shall not be introduced.

---

# 24.9 Date and Time Data Types

Temporal values shall use standardized PostgreSQL temporal types.

| Business Requirement | Type        |
| -------------------- | ----------- |
| Date only            | DATE        |
| Time only            | TIME        |
| Timestamp            | TIMESTAMPTZ |

Examples:

```sql id="dts5"
date_of_birth DATE

exam_time TIME

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

All timestamps shall be stored with time zone awareness to support global users.

---

### DTS-015

Operational timestamps shall use TIMESTAMPTZ.

---

### DTS-016

Temporal values shall follow the enterprise time zone policy.

---

# 24.10 JSON Data Types

Semi-structured information shall use JSONB.

Examples:

```sql id="dts6"
preferences JSONB

permissions JSONB

settings JSONB

metadata JSONB
```

JSONB provides:

* Efficient storage
* Binary representation
* Indexing support
* Query optimization

JSON documents shall not replace normalized relational structures.

---

### DTS-017

Semi-structured information shall use JSONB.

---

### DTS-018

JSONB shall not be used for highly relational business data.

---

# 24.11 Binary Data Types

Binary storage shall be minimized.

Approved usage:

* Small cryptographic artifacts
* Certificates
* Digital signatures
* System-generated binary metadata

Example:

```sql id="dts7"
signature BYTEA
```

Large media assets shall be stored in external object storage, with only metadata retained in PostgreSQL.

---

### DTS-019

Large binary objects shall not be stored directly in operational databases.

---

### DTS-020

Object storage shall be used for large media files.

---

# 24.12 Enumerated Data Strategy

The Mediverse platform generally favors lookup/reference tables over PostgreSQL ENUM types for business domains requiring extensibility.

Examples:

* User Status
* Course Status
* Assessment Status
* Certificate Status

Lookup tables provide:

* Easier maintenance
* Runtime extensibility
* Better reporting
* Simpler migrations

PostgreSQL ENUM types may be used only for stable, infrastructure-level values.

---

### DTS-021

Business enumerations shall use reference tables unless formally exempted.

---

### DTS-022

ENUM types require architectural approval.

---

# 24.13 Array Data Types

Array types shall be used sparingly.

Approved scenarios:

* Internal configuration
* Search keywords
* Cached tag lists
* Static feature flags

Example:

```sql id="dts8"
supported_languages TEXT[]

notification_channels TEXT[]
```

Arrays shall not replace normalized many-to-many relationships.

---

### DTS-023

Array types shall only be used for documented use cases.

---

### DTS-024

Relational data shall not be modeled using arrays.

---

# 24.14 Performance Considerations

Data type selection directly affects:

* Storage utilization
* Cache efficiency
* Index size
* Query execution
* Network transmission
* Backup size

Best practices:

* Avoid oversized character columns.
* Use appropriate numeric precision.
* Limit JSONB usage to suitable scenarios.
* Avoid unnecessary binary storage.
* Review data growth periodically.

---

### DTS-025

Data type selection shall be validated during performance testing.

---

### DTS-026

Storage efficiency shall be monitored throughout the database lifecycle.

---

# 24.15 Migration Strategy

Changes to data types require controlled migrations.

Migration workflow:

```text id="dts9"
Business Approval
        │
Impact Analysis
        │
Migration Script
        │
Data Validation
        │
Performance Testing
        │
Production Deployment
```

Migration guidelines:

* Use Flyway version-controlled scripts.
* Validate existing data before conversion.
* Test rollback procedures.
* Preserve data integrity during transformation.

---

### DTS-027

Data type modifications shall be deployed through controlled migrations.

---

### DTS-028

Schema changes shall include compatibility validation.

---

# 24.16 Governance

Data type governance includes:

* Database Architecture Review Board
* Enterprise Data Governance Board
* Database Administration Team
* Security Review Committee
* Product Owners
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Any deviation from enterprise data type standards requires:

* Business justification
* Architecture approval
* Performance assessment
* Documentation update

---

### DTS-029

Enterprise data type exceptions require formal approval.

---

### DTS-030

Data type standards shall be reviewed periodically to align with PostgreSQL best practices.

---

# 24.17 Traceability

This chapter defines the enterprise Data Types Standardization Strategy for the Mediverse platform.

**Related Documents**

* Column Design Standards
* Table Design Standards
* Default Values
* Constraints Design
* Primary Key Strategy
* Physical Data Model
* Database Naming Conventions
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Schemas
* Tables
* Columns
* Database Migrations
* ORM Mapping
* JSONB Storage
* UUID Identifiers
* Enterprise Data Governance

---

# Chapter Summary

This chapter establishes the Data Types Standardization Strategy for the Mediverse platform. It defines approved PostgreSQL data types, selection principles, implementation standards, performance considerations, migration practices, and governance requirements. By standardizing identifiers, character data, numeric values, temporal types, JSONB usage, binary storage, enumerations, and arrays, the platform ensures consistent, efficient, scalable, and maintainable database design across all enterprise environments.

---

**End of Chapter 24**

**Next:** **Chapter 25 – Enumerations & Lookup Tables**.

---

# Chapter 25 — Enumerations & Lookup Tables

---

# Chapter Overview

This chapter defines the enterprise **Enumerations & Lookup Tables Strategy** for the **Mediverse – AI-Powered Medical Education Platform**. It establishes standards for representing controlled business values, reference data, and configurable domain attributes using normalized lookup tables rather than hardcoded application values wherever appropriate.

The strategy ensures flexibility, consistency, maintainability, localization support, and governance across all PostgreSQL schemas while enabling future business expansion without requiring application code changes.

---

# 25.1 Introduction

Many business attributes can only contain a predefined set of values.

Examples include:

* User Status
* Course Status
* Assessment Difficulty
* Gender
* Notification Type
* Payment Status
* Enrollment Status
* Certificate Status
* Medical Specialty
* Language

These controlled values are called **Enumerations (Enums)**.

Instead of embedding these values directly into application code or database constraints, the Mediverse platform primarily uses **Lookup Tables** to store business-controlled enumerations.

Lookup tables provide:

* Centralized management
* Runtime configurability
* Multi-language support
* Data integrity
* Reporting consistency
* Easier maintenance
* Better governance
* Extensibility

---

# 25.2 Objectives

The objectives of the Enumerations & Lookup Tables Strategy are to:

* Standardize controlled business values.
* Eliminate duplicated enumeration definitions.
* Improve maintainability.
* Support localization.
* Enable runtime configuration.
* Improve reporting consistency.
* Simplify database migrations.
* Reduce application coupling.
* Support enterprise governance.
* Facilitate future expansion.

---

### ELT-001

Controlled business values shall be centrally managed.

---

### ELT-002

Lookup tables shall be preferred over hardcoded business enumerations.

---

# 25.3 Design Principles

The Mediverse platform follows these principles.

### Centralization

Reference values shall exist in one authoritative location.

### Normalization

Lookup values shall be normalized into dedicated tables.

### Consistency

The same business concept shall reference the same lookup table throughout the platform.

### Extensibility

New values shall be added without requiring schema redesign.

### Localization

Display values shall support multiple languages where applicable.

### Governance

Changes to lookup data shall follow controlled approval processes.

---

### ELT-003

Each business enumeration shall have a single authoritative source.

---

### ELT-004

Lookup values shall remain independent of application logic.

---

# 25.4 Enumeration Categories

The Mediverse platform uses multiple categories of controlled values.

| Category        | Examples                        |
| --------------- | ------------------------------- |
| User Management | User Status, Role Status        |
| Academic        | Course Status, Lesson Type      |
| Assessment      | Difficulty Level, Question Type |
| Certification   | Certificate Status              |
| Notification    | Notification Channel, Priority  |
| Media           | File Type, Media Status         |
| AI              | AI Model Status, Prompt Type    |
| Audit           | Event Severity                  |
| System          | Environment, Feature Flag       |

Each category is governed independently.

---

### ELT-005

Every lookup table shall belong to a documented business domain.

---

### ELT-006

Lookup categories shall align with bounded contexts defined in the Software Architecture Document.

---

# 25.5 Lookup Table Structure

A standardized lookup table shall include the following columns.

| Column        | Purpose                |
| ------------- | ---------------------- |
| id            | UUID Primary Key       |
| code          | Stable business code   |
| name          | Display name           |
| description   | Business description   |
| display_order | UI ordering            |
| is_active     | Active indicator       |
| created_at    | Creation timestamp     |
| updated_at    | Modification timestamp |
| created_by    | Creator                |
| updated_by    | Modifier               |

Example:

```text id="elt1"
course_status

-------------------------

id

code

name

description

display_order

is_active

created_at

updated_at
```

This structure ensures consistency across all lookup entities.

---

### ELT-007

Lookup tables shall follow the enterprise table design standards.

---

### ELT-008

Business codes shall remain stable after publication.

---

# 25.6 Naming Standards

Lookup tables follow standardized naming conventions.

Examples:

```text id="elt2"
user_status

course_status

assessment_status

notification_priority

certificate_status

medical_specialties

languages

countries

question_types
```

Column naming:

```text id="elt3"
code

name

description

display_order

is_active
```

---

### ELT-009

Lookup table names shall clearly describe the referenced business domain.

---

### ELT-010

Lookup table columns shall use standardized names.

---

# 25.7 Business Codes

Each lookup record contains a stable business code.

Example:

| Code      | Display Name |
| --------- | ------------ |
| ACTIVE    | Active       |
| INACTIVE  | Inactive     |
| DRAFT     | Draft        |
| PUBLISHED | Published    |
| ARCHIVED  | Archived     |

Applications should reference business codes where appropriate while maintaining database relationships through UUID foreign keys.

Business codes:

* Must be unique.
* Must be immutable.
* Must remain human-readable.

---

### ELT-011

Business codes shall remain unique within each lookup table.

---

### ELT-012

Published business codes shall not be modified.

---

# 25.8 Lookup Relationships

Operational entities reference lookup tables using foreign keys.

Example:

```text id="elt4"
courses
      │
      ▼
course_status
```

Another example:

```text id="elt5"
students
        │
        ▼
student_status
```

Foreign key relationships enforce valid reference values and prevent inconsistent data.

---

### ELT-013

Business entities shall reference lookup tables through foreign keys.

---

### ELT-014

Direct storage of display values within transactional tables is prohibited unless formally approved.

---

# 25.9 Localization Support

Lookup tables shall support multiple languages.

Recommended structure:

```text id="elt6"
course_status

      │

      ▼

course_status_translation

--------------------------

lookup_id

language_code

display_name

description
```

Benefits:

* Internationalization
* Regional customization
* Simplified UI rendering
* Translation independence

---

### ELT-015

Localized display values shall be maintained in dedicated translation tables.

---

### ELT-016

Business codes shall remain language-independent.

---

# 25.10 PostgreSQL ENUM Usage

The Mediverse platform generally avoids PostgreSQL ENUM types for business domains.

Approved uses include:

* Internal infrastructure states
* Fixed technical constants
* Immutable system values

Examples:

```text id="elt7"
Log Level

Deployment Environment

Connection Mode
```

Business processes should use lookup tables instead.

---

### ELT-017

Business enumerations shall use lookup tables by default.

---

### ELT-018

PostgreSQL ENUM types require Architecture Review Board approval.

---

# 25.11 Versioning & Lifecycle

Lookup values evolve over time.

Lifecycle:

```text id="elt8"
Create
   │
Review
   │
Approve
   │
Publish
   │
Use
   │
Deprecate
   │
Archive
```

Guidelines:

* Avoid deleting active lookup records.
* Prefer deactivation over deletion.
* Preserve historical references.
* Maintain audit history.

---

### ELT-019

Lookup records shall support lifecycle management.

---

### ELT-020

Referenced lookup records shall not be physically deleted without impact assessment.

---

# 25.12 Performance Considerations

Lookup tables are typically small but frequently accessed.

Optimization strategies:

* Primary key indexing
* Unique index on business code
* In-memory application caching
* Read replica utilization
* Periodic cache refresh
* Efficient join design

Frequently used lookup data may be cached within application services to reduce database load.

---

### ELT-021

Lookup tables shall support efficient query performance.

---

### ELT-022

Frequently accessed reference data should be cached where appropriate.

---

# 25.13 Security Considerations

Although lookup data is generally low risk, governance remains essential.

Security controls include:

* Read-only access for most users
* Administrative update privileges
* Audit logging
* Role-based access control (RBAC)
* Change approval workflow

Sensitive reference data shall receive additional protection where required.

---

### ELT-023

Lookup data modifications shall be restricted to authorized personnel.

---

### ELT-024

Administrative changes shall be fully audited.

---

# 25.14 Migration Strategy

Lookup tables shall be populated through controlled database migrations.

Migration workflow:

```text id="elt9"
Create Table
      │
Seed Initial Data
      │
Validate Codes
      │
Application Integration
      │
Production Deployment
```

Migration guidelines:

* Use Flyway versioned scripts.
* Seed mandatory reference data.
* Maintain deterministic identifiers where necessary.
* Validate uniqueness before deployment.

---

### ELT-025

Reference data shall be deployed through version-controlled migration scripts.

---

### ELT-026

Seed data shall be validated during deployment.

---

# 25.15 Governance

Lookup table governance includes:

* Enterprise Data Governance Board
* Product Owners
* Database Architecture Review Board
* Database Administration Team
* Security Review Committee
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes to lookup values require:

* Business approval
* Data governance review
* Documentation update
* Migration validation

---

### ELT-027

Lookup table modifications require formal governance approval.

---

### ELT-028

Reference data documentation shall remain synchronized with implementation.

---

# 25.16 Traceability

This chapter defines the enterprise Enumerations & Lookup Tables Strategy for the Mediverse platform.

**Related Documents**

* Data Types Standardization
* Default Values
* Constraints Design
* Table Design Standards
* Column Design Standards
* Physical Data Model
* Entity Relationship Diagram (ERD)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Lookup Tables
* Reference Data
* Business Enumerations
* Localization Tables
* Database Migrations
* PostgreSQL Schemas
* Enterprise Data Governance
* Application Configuration

---

# Chapter Summary

This chapter establishes the Enumerations & Lookup Tables Strategy for the Mediverse platform. It standardizes the management of controlled business values through normalized lookup tables, defining table structures, naming conventions, business codes, localization support, lifecycle management, performance optimization, security controls, migration practices, and governance requirements. By favoring lookup tables over hardcoded enumerations and PostgreSQL ENUM types for business domains, the platform achieves greater flexibility, maintainability, internationalization support, and long-term architectural scalability.

---

**End of Chapter 25**

**Next:** **Chapter 26 – Identity & Authentication Tables**.

---

# Chapter 26 — Identity & Authentication Tables

---

# Chapter Overview

This chapter defines the database design for the **Identity & Authentication** domain of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the database structures responsible for authentication, authorization, identity lifecycle management, credential storage, session management, Multi-Factor Authentication (MFA), OAuth2/OpenID Connect integration, API access, and security auditing.

The Identity domain serves as the security foundation of the platform and is shared across all bounded contexts and microservices.

---

# 26.1 Introduction

Identity and Authentication ensure that every system interaction is performed by an authenticated and authorized principal.

The Identity database is responsible for:

* User authentication
* Credential management
* Account lifecycle
* Multi-Factor Authentication
* OAuth2/OpenID Connect identities
* Session management
* Token tracking
* Device registration
* Password history
* Login auditing
* Security event monitoring

The design follows **Zero Trust Security**, **Least Privilege**, **OAuth2**, **JWT**, **OpenID Connect**, and **OWASP ASVS** recommendations.

---

# 26.2 Objectives

The objectives of the Identity database are to:

* Provide centralized authentication.
* Support multiple authentication providers.
* Secure credential storage.
* Enable JWT-based authentication.
* Support MFA.
* Maintain audit history.
* Track login activity.
* Enable device management.
* Support account recovery.
* Provide scalable identity management.

---

### IAT-001

Every authenticated user shall have a unique identity record.

---

### IAT-002

Authentication data shall be logically separated from business profile information.

---

# 26.3 Identity Domain Architecture

```text id="iat1"
                 +----------------------+
                 | Authentication API   |
                 +----------+-----------+
                            |
                            ▼
                 +----------------------+
                 | Identity Database    |
                 +----------+-----------+
                            |
      +---------------------+---------------------+
      |                     |                     |
      ▼                     ▼                     ▼
 Users            Credentials           Sessions
      │                     │                     │
      ▼                     ▼                     ▼
 MFA               OAuth Accounts        Login History
      │                     │                     │
      └──────────────► Audit Events ◄─────────────┘
```

The Identity schema remains independent from academic and learning modules, allowing authentication services to scale independently.

---

### IAT-003

Identity services shall own authentication-related data.

---

### IAT-004

Business modules shall consume identity services through APIs rather than direct database dependencies.

---

# 26.4 Schema Organization

The Identity domain is contained within the **auth** schema.

```text id="iat2"
auth

├── users

├── credentials

├── oauth_accounts

├── refresh_tokens

├── sessions

├── devices

├── password_history

├── mfa_settings

├── login_history

├── security_events

└── api_keys
```

---

### IAT-005

Identity tables shall reside within the dedicated authentication schema.

---

### IAT-006

Cross-schema access shall follow the enterprise security policy.

---

# 26.5 Core Entity Relationship Diagram

```text id="iat3"
users
 │
 ├──────────────┐
 │              │
 ▼              ▼
credentials   sessions
 │              │
 ▼              ▼
password_history
               │
               ▼
login_history
 │
 ▼
security_events

users
 │
 ├────────► oauth_accounts
 │
 ├────────► mfa_settings
 │
 ├────────► devices
 │
 └────────► refresh_tokens
```

Each authentication artifact belongs to exactly one user identity.

---

### IAT-007

Relationships shall preserve referential integrity.

---

### IAT-008

Authentication artifacts shall reference authenticated identities using UUID foreign keys.

---

# 26.6 Users Table

The **users** table represents the canonical identity record.

## Purpose

* Global identity
* Authentication principal
* Security ownership
* Cross-service identifier

Example structure:

| Column         | Type         |
| -------------- | ------------ |
| id             | UUID         |
| email          | VARCHAR(255) |
| username       | VARCHAR(100) |
| account_status | UUID FK      |
| email_verified | BOOLEAN      |
| created_at     | TIMESTAMPTZ  |
| updated_at     | TIMESTAMPTZ  |

Business constraints:

* Email must be unique.
* Username must be unique.
* Identity cannot be duplicated.
* UUID is immutable.

---

### IAT-009

Every user shall possess one immutable UUID identity.

---

### IAT-010

Email addresses shall be globally unique.

---

# 26.7 Credentials Table

Sensitive credential information is isolated from user metadata.

```text id="iat4"
credentials

------------------------

id

user_id

password_hash

password_algorithm

password_version

last_password_change

failed_attempts

locked_until
```

Passwords shall:

* Never be stored in plaintext.
* Use Argon2id (preferred) or bcrypt.
* Be salted.
* Support future algorithm migration.

---

### IAT-011

Credential storage shall use approved password hashing algorithms.

---

### IAT-012

Password hashes shall never be reversible.

---

# 26.8 OAuth Accounts

Supports external authentication providers.

Example providers:

* Google
* Microsoft
* Apple
* GitHub
* Institutional SSO

Example table:

```text id="iat5"
oauth_accounts

----------------------

id

user_id

provider

provider_user_id

access_token_reference

refresh_token_reference
```

OAuth tokens shall be encrypted or securely referenced rather than stored in plaintext.

---

### IAT-013

External identities shall map to one internal user.

---

### IAT-014

OAuth credentials shall be protected using approved cryptographic controls.

---

# 26.9 Refresh Tokens

Refresh tokens support long-lived authenticated sessions.

```text id="iat6"
refresh_tokens

--------------------

id

user_id

token_hash

expires_at

revoked_at

device_id
```

Token policies:

* Store only token hashes.
* Support revocation.
* Track expiration.
* Associate with issuing device.

---

### IAT-015

Refresh tokens shall be revocable.

---

### IAT-016

Refresh token values shall never be stored in plaintext.

---

# 26.10 Session Management

Session records maintain active authentication sessions.

```text id="iat7"
sessions

-----------------

id

user_id

device_id

ip_address

user_agent

created_at

expires_at

last_activity
```

Sessions support:

* Device logout
* Session expiration
* Concurrent session limits
* Risk analysis

---

### IAT-017

Every active session shall be traceable.

---

### IAT-018

Expired sessions shall be periodically purged or archived.

---

# 26.11 Multi-Factor Authentication

The MFA subsystem supports multiple authentication methods.

Supported methods:

* TOTP
* Email OTP
* SMS OTP (optional)
* Hardware security keys (future)
* Passkeys (future)

Table:

```text id="iat8"
mfa_settings

--------------------

user_id

mfa_enabled

method

secret_reference

backup_codes_hash
```

Secrets shall be encrypted using enterprise key management.

---

### IAT-019

MFA secrets shall never be stored in plaintext.

---

### IAT-020

Backup codes shall be securely hashed.

---

# 26.12 Device Registry

Known devices improve security and user experience.

```text id="iat9"
devices

----------------

id

user_id

device_name

device_type

fingerprint

last_login

trusted
```

Device registration supports:

* Trusted devices
* Device revocation
* Suspicious activity detection
* Adaptive authentication

---

### IAT-021

Registered devices shall be uniquely associated with users.

---

### IAT-022

Device trust shall be configurable.

---

# 26.13 Password History

Password reuse prevention requires password history.

```text id="iat10"
password_history

------------------------

id

user_id

password_hash

changed_at
```

Policy:

* Maintain configurable history depth.
* Prevent recent password reuse.
* Archive historical hashes securely.

---

### IAT-023

Password history shall enforce enterprise password reuse policies.

---

### IAT-024

Historical password hashes shall remain protected.

---

# 26.14 Login History

Authentication attempts shall be fully auditable.

```text id="iat11"
login_history

---------------------

id

user_id

timestamp

ip_address

device

result

failure_reason
```

Tracks:

* Successful logins
* Failed logins
* Locked accounts
* Suspicious attempts

---

### IAT-025

Authentication attempts shall be fully auditable.

---

### IAT-026

Failed login events shall be retained according to the enterprise retention policy.

---

# 26.15 Security Events

Critical security activities are centralized.

Examples:

* Password reset
* MFA enabled
* Account locked
* Device revoked
* OAuth linked
* Token revoked
* Administrator action

```text id="iat12"
security_events

----------------------

id

user_id

event_type

severity

occurred_at

details
```

These events feed the platform's Security Information and Event Management (SIEM) system.

---

### IAT-027

Security events shall support forensic investigations.

---

### IAT-028

Critical security events shall be retained according to compliance requirements.

---

# 26.16 Performance Considerations

Identity tables are among the most frequently accessed in the platform.

Optimization strategies include:

* Index email and username.
* Index token hashes.
* Partition large login history tables.
* Archive historical audit data.
* Cache non-sensitive identity metadata.
* Monitor authentication query latency.

Authentication operations shall prioritize both security and low latency.

---

### IAT-029

Identity queries shall be optimized for high-frequency access.

---

### IAT-030

Historical authentication data shall be archived according to lifecycle policies.

---

# 26.17 Security & Compliance

Identity tables contain highly sensitive information.

Required controls:

* Encryption at rest
* TLS in transit
* Password hashing
* Row-Level Security (where applicable)
* Audit logging
* Least-privilege database access
* Secret management integration
* GDPR compliance
* HIPAA alignment (where applicable)

Access to authentication tables shall be restricted to authorized services and administrators.

---

### IAT-031

Identity data shall be protected using enterprise security controls.

---

### IAT-032

Direct access to authentication tables shall be restricted to authorized components.

---

# 26.18 Governance

Identity database governance includes:

* Security Architecture Board
* Database Architecture Review Board
* Enterprise Data Governance Board
* Identity & Access Management (IAM) Team
* Security Operations Center (SOC)
* Database Administration Team
* Change Advisory Board (CAB)

Changes to identity schemas require:

* Security review
* Architecture approval
* Migration validation
* Penetration testing
* Documentation updates

---

### IAT-033

Identity schema modifications require formal governance approval.

---

### IAT-034

Authentication schema documentation shall remain synchronized with implementation.

---

# 26.19 Traceability

This chapter defines the database design for Identity & Authentication within the Mediverse platform.

**Related Documents**

* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Primary Key Strategy
* Foreign Key Strategy
* Constraints Design
* Security Architecture
* Identity & Access Management Standards
* Architecture Decision Records (ADR)

**Applies To**

* Authentication Services
* Identity Management
* OAuth2/OpenID Connect
* JWT Authentication
* Multi-Factor Authentication
* Session Management
* Device Management
* Security Auditing
* PostgreSQL Authentication Schema

---

# Chapter Summary

This chapter defines the Identity & Authentication database architecture for the Mediverse platform. It specifies the core authentication entities, including users, credentials, OAuth accounts, refresh tokens, sessions, devices, MFA settings, password history, login history, and security events. By enforcing strong cryptographic practices, standardized relationships, comprehensive auditing, and enterprise governance, the Identity domain provides a secure, scalable, and compliant foundation for authentication and authorization across all platform services.

---

---

# 26.10 Production DDL: Authentication & Multi-Tenancy Tables

```sql
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  custom_domain VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.tenants(id) ON DELETE RESTRICT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_tenant_email ON auth.users(tenant_id, email);
```

**End of Chapter 26**

**Next:** **Chapter 27 – User Management Tables**.

---

# Chapter 27 — User Management Tables

---

# Chapter Overview

This chapter defines the database design for the **User Management** domain of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing user profiles, demographic information, preferences, institutional affiliations, lifecycle states, profile settings, contact information, and user-related metadata.

While **Chapter 26 – Identity & Authentication Tables** focuses on authentication and security, this chapter addresses the **business representation of users** within the platform.

The User Management domain provides a centralized and extensible model that supports students, faculty, administrators, content creators, researchers, and future user categories.

---

# 27.1 Introduction

The User Management subsystem stores business-related user information that is independent of authentication mechanisms.

This domain manages:

* User profiles
* Personal information
* Contact details
* Institutional affiliations
* Language preferences
* Time zones
* Profile settings
* User lifecycle
* Emergency contacts
* User preferences
* Profile completeness

Authentication credentials remain exclusively within the **auth** schema.

---

# 27.2 Objectives

The objectives of the User Management database are to:

* Centralize business profile data.
* Separate identity from authentication.
* Support multiple user categories.
* Enable profile customization.
* Maintain user preferences.
* Support localization.
* Facilitate institutional mapping.
* Preserve profile history.
* Improve reporting capabilities.
* Ensure long-term scalability.

---

### UMT-001

Every authenticated identity shall correspond to exactly one business user profile.

---

### UMT-002

Business profile information shall remain independent of authentication credentials.

---

# 27.3 User Domain Architecture

```text id="umt1"
                 +-------------------------+
                 | Authentication Service  |
                 +------------+------------+
                              |
                              ▼
                    auth.users (Identity)
                              │
                              ▼
                 +-------------------------+
                 | users.user_profiles     |
                 +------------+------------+
                              |
        +----------+----------+-----------+-----------+
        |          |          |           |           |
        ▼          ▼          ▼           ▼           ▼
 Preferences  Contacts  Institutions  Avatars  User Settings
        │
        ▼
 Profile Completion
```

This architecture ensures a clear separation between **identity**, **authentication**, and **business profile management**.

---

### UMT-003

The User Management domain shall consume identity information through foreign key relationships.

---

### UMT-004

Authentication services shall not store business profile attributes.

---

# 27.4 Schema Organization

The User Management domain resides within the **users** schema.

```text id="umt2"
users

├── user_profiles

├── user_addresses

├── user_contacts

├── user_preferences

├── user_settings

├── user_languages

├── user_timezones

├── user_institutions

├── user_emergency_contacts

├── user_avatars

└── profile_completion
```

Each table represents a distinct business capability.

---

### UMT-005

User management tables shall reside within the dedicated **users** schema.

---

### UMT-006

Schema ownership shall follow bounded-context principles.

---

# 27.5 Entity Relationship Diagram

```text id="umt3"
auth.users
      │
      ▼
user_profiles
      │
 ├─────────────┐
 ▼             ▼
addresses   preferences
 │             │
 ▼             ▼
contacts   settings
 │             │
 ▼             ▼
avatars   languages
 │
 ▼
institutions
 │
 ▼
profile_completion
```

Every auxiliary table references **user_profiles** using UUID foreign keys.

---

### UMT-007

All profile-related entities shall reference the parent user profile.

---

### UMT-008

Relationships shall enforce referential integrity through foreign key constraints.

---

# 27.6 User Profiles Table

The **user_profiles** table stores the canonical business profile.

| Column            | Type         |
| ----------------- | ------------ |
| id                | UUID         |
| auth_user_id      | UUID FK      |
| first_name        | VARCHAR(100) |
| middle_name       | VARCHAR(100) |
| last_name         | VARCHAR(100) |
| display_name      | VARCHAR(200) |
| date_of_birth     | DATE         |
| gender_id         | UUID FK      |
| profile_status_id | UUID FK      |
| biography         | TEXT         |
| created_at        | TIMESTAMPTZ  |
| updated_at        | TIMESTAMPTZ  |

Business Rules:

* One profile per authenticated user.
* Display names may differ from legal names.
* Date of birth is optional.
* Biography length shall be configurable.

---

### UMT-009

Each authenticated identity shall own exactly one business profile.

---

### UMT-010

Profile status shall reference an approved lookup table.

---

# 27.7 User Contact Information

Contact information is normalized into dedicated tables.

Example:

```text id="umt4"
user_contacts

-------------------

id

user_profile_id

contact_type_id

contact_value

is_primary

verified

verified_at
```

Supported contact types:

* Email
* Mobile
* Office Phone
* Alternate Phone

Verification history shall be maintained separately where required.

---

### UMT-011

Contact information shall be normalized.

---

### UMT-012

Primary contact values shall be uniquely identifiable.

---

# 27.8 User Address Management

Addresses are maintained independently.

Example:

```text id="umt5"
user_addresses

----------------------

id

user_profile_id

address_type_id

line1

line2

city

state

postal_code

country_id
```

Supported address types:

* Home
* Office
* Billing
* Mailing

Multiple addresses per user are supported.

---

### UMT-013

Users may maintain multiple addresses.

---

### UMT-014

Countries shall reference enterprise lookup tables.

---

# 27.9 User Preferences

Preferences enable personalization.

Example:

```text id="umt6"
user_preferences

-----------------------

user_profile_id

language_id

theme

email_notifications

sms_notifications

push_notifications
```

Examples of preferences:

* Preferred language
* Theme
* Notification channels
* Dashboard layout
* Accessibility options

---

### UMT-015

Preferences shall be configurable without modifying application code.

---

### UMT-016

Preference defaults shall follow enterprise configuration standards.

---

# 27.10 User Settings

Application settings differ from user preferences.

Typical settings include:

* Privacy visibility
* Profile discoverability
* Session timeout preference
* Two-factor reminder
* Default landing page

```text id="umt7"
user_settings

---------------------

user_profile_id

setting_key

setting_value
```

This flexible key-value model supports future extensibility.

---

### UMT-017

Settings shall support extensible key-value storage.

---

### UMT-018

Application settings shall be validated by business rules.

---

# 27.11 Institutional Affiliations

Users may belong to multiple organizations.

Example:

```text id="umt8"
user_institutions

-------------------------

id

user_profile_id

institution_id

department_id

designation

start_date

end_date
```

Supports:

* Universities
* Hospitals
* Medical colleges
* Research institutes
* Corporate organizations

---

### UMT-019

Institutional affiliations shall support historical tracking.

---

### UMT-020

Institution references shall maintain referential integrity.

---

# 27.12 User Avatars

Profile images are stored externally while metadata remains in PostgreSQL.

```text id="umt9"
user_avatars

-------------------

id

user_profile_id

media_id

is_current

uploaded_at
```

Image binaries are stored in object storage.

---

### UMT-021

Avatar metadata shall reference enterprise media management services.

---

### UMT-022

Only one avatar may be designated as the current profile image.

---

# 27.13 Emergency Contacts

Healthcare education environments require emergency contact information.

```text id="umt10"
user_emergency_contacts

------------------------------

id

user_profile_id

contact_name

relationship

phone_number

priority
```

Security controls shall restrict access to this information.

---

### UMT-023

Emergency contact information shall be protected as sensitive personal data.

---

### UMT-024

Access shall be restricted according to the principle of least privilege.

---

# 27.14 Profile Completion

Profile completion improves user onboarding.

```text id="umt11"
profile_completion

-------------------------

user_profile_id

completion_percentage

last_calculated

missing_sections
```

Calculated metrics include:

* Personal information
* Contact information
* Institution
* Avatar
* Preferences

The completion score is recalculated whenever relevant profile data changes.

---

### UMT-025

Profile completion metrics shall be derived from profile attributes.

---

### UMT-026

Completion calculations shall remain deterministic.

---

# 27.15 Performance Considerations

The User Management domain is accessed by nearly every platform service.

Optimization strategies include:

* Index frequently queried foreign keys.
* Cache read-only profile metadata.
* Archive historical affiliation records.
* Use JSONB selectively for extensible settings.
* Partition audit-heavy tables when necessary.
* Optimize search indexes for profile discovery.

Profile retrieval APIs shall meet established performance objectives under peak workloads.

---

### UMT-027

User profile queries shall be optimized for low-latency access.

---

### UMT-028

Caching strategies shall maintain consistency with the source of truth.

---

# 27.16 Security & Compliance

User profile data contains Personally Identifiable Information (PII).

Required controls include:

* Encryption in transit (TLS)
* Encryption at rest
* Role-Based Access Control (RBAC)
* Row-Level Security (where applicable)
* Audit logging
* Data masking for administrative interfaces
* Data retention policies
* GDPR compliance
* HIPAA alignment where applicable

Sensitive attributes shall only be accessible to authorized services and personnel.

---

### UMT-029

Personally identifiable information shall be protected using enterprise security controls.

---

### UMT-030

Access to user profile data shall be fully auditable.

---

# 27.17 Governance

User Management governance includes:

* Product Owners
* Enterprise Data Governance Board
* Database Architecture Review Board
* Privacy Office
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Schema modifications require:

* Business approval
* Privacy review
* Security assessment
* Migration validation
* Documentation updates

---

### UMT-031

User Management schema changes require formal governance approval.

---

### UMT-032

User profile documentation shall remain synchronized with implementation.

---

# 27.18 Traceability

This chapter defines the database design for the User Management domain within the Mediverse platform.

**Related Documents**

* Chapter 26 – Identity & Authentication Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Data Types Standardization
* Constraints Design
* Security Architecture
* Privacy & Compliance Standards
* Architecture Decision Records (ADR)

**Applies To**

* User Profiles
* Contact Information
* Addresses
* Preferences
* Settings
* Institutional Affiliations
* Avatars
* Emergency Contacts
* Profile Completion
* PostgreSQL User Management Schema

---

# Chapter Summary

This chapter defines the User Management database architecture for the Mediverse platform. It separates business profile information from authentication data and specifies normalized tables for user profiles, contact information, addresses, preferences, settings, institutional affiliations, avatars, emergency contacts, and profile completion metrics. By enforcing standardized relationships, security controls, privacy safeguards, and governance practices, the User Management domain provides a scalable, maintainable, and compliant foundation for representing users across all platform services.

---

**End of Chapter 27**

**Next:** **Chapter 28 – Role & Permission Tables**.

---

# Chapter 28 — Role & Permission Tables

---

# Chapter Overview

This chapter defines the database design for the **Role & Permission Management** domain of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational structures responsible for Role-Based Access Control (RBAC), permission management, resource authorization, policy assignment, delegated administration, and auditability.

The authorization model follows the **Principle of Least Privilege**, **Zero Trust Security**, and **NIST RBAC** recommendations while remaining extensible to support future **Attribute-Based Access Control (ABAC)** and **Policy-Based Access Control (PBAC)**.

---

# 28.1 Introduction

Authorization determines **what an authenticated user is allowed to do** after successful authentication.

The Role & Permission subsystem manages:

* System roles
* Business roles
* Permissions
* Role hierarchies
* User-role assignments
* Role-permission mappings
* Permission groups
* Resource authorization
* Delegated administration
* Authorization auditing

Unlike authentication, which verifies identity, authorization controls access to platform resources.

---

# 28.2 Objectives

The objectives of the Role & Permission database are to:

* Centralize authorization management.
* Support enterprise RBAC.
* Minimize privilege escalation.
* Simplify permission administration.
* Enable fine-grained authorization.
* Support future ABAC expansion.
* Maintain complete audit history.
* Reduce authorization duplication.
* Improve scalability.
* Ensure regulatory compliance.

---

### RPT-001

Every authorization decision shall originate from centrally managed roles and permissions.

---

### RPT-002

Authorization metadata shall remain independent from business modules.

---

# 28.3 Authorization Architecture

```text id="rpt1"
               +----------------------+
               | Identity Service     |
               +----------+-----------+
                          |
                          ▼
                     auth.users
                          │
                          ▼
                 role_assignments
                          │
                          ▼
                      roles
                          │
                          ▼
                 role_permissions
                          │
                          ▼
                    permissions
                          │
                          ▼
                protected_resources
```

This layered architecture separates **authentication**, **authorization**, and **resource access**.

---

### RPT-003

Authorization shall be managed independently from authentication.

---

### RPT-004

Business services shall consume authorization decisions through centralized security services.

---

# 28.4 Schema Organization

The authorization subsystem resides within the **security** schema.

```text id="rpt2"
security

├── roles

├── permissions

├── permission_groups

├── role_permissions

├── user_roles

├── role_hierarchy

├── protected_resources

├── resource_permissions

├── delegated_roles

└── authorization_audit
```

---

### RPT-005

Authorization tables shall reside within the dedicated **security** schema.

---

### RPT-006

Schema ownership shall remain under the Identity & Access Management (IAM) domain.

---

# 28.5 Entity Relationship Diagram

```text id="rpt3"
users
 │
 ▼
user_roles
 │
 ▼
roles
 │
 ├────────────┐
 ▼            ▼
role_permissions
 │            │
 ▼            ▼
permissions  role_hierarchy
 │
 ▼
resource_permissions
 │
 ▼
protected_resources
```

This model supports many-to-many relationships between users, roles, permissions, and resources.

---

### RPT-007

Authorization relationships shall enforce referential integrity.

---

### RPT-008

Role assignments shall reference authenticated identities using UUID foreign keys.

---

# 28.6 Roles Table

The **roles** table represents logical collections of permissions.

Example structure:

| Column      | Type         |
| ----------- | ------------ |
| id          | UUID         |
| role_code   | VARCHAR(100) |
| role_name   | VARCHAR(200) |
| description | TEXT         |
| system_role | BOOLEAN      |
| active      | BOOLEAN      |
| created_at  | TIMESTAMPTZ  |
| updated_at  | TIMESTAMPTZ  |

Example roles:

* STUDENT
* FACULTY
* CONTENT_AUTHOR
* REVIEWER
* EXAMINER
* INSTITUTION_ADMIN
* PLATFORM_ADMIN
* SUPER_ADMIN

---

### RPT-009

Role codes shall remain unique throughout the platform.

---

### RPT-010

System-defined roles shall be protected from unauthorized modification.

---

# 28.7 Permissions Table

Permissions define individual actions.

Example:

```text id="rpt4"
permissions

---------------------

id

permission_code

permission_name

resource

action

description
```

Examples:

| Permission    | Action |
| ------------- | ------ |
| COURSE_READ   | Read   |
| COURSE_CREATE | Create |
| COURSE_UPDATE | Update |
| COURSE_DELETE | Delete |
| USER_MANAGE   | Manage |
| REPORT_EXPORT | Export |

Permissions shall represent the smallest assignable authorization unit.

---

### RPT-011

Permission codes shall remain globally unique.

---

### RPT-012

Permissions shall represent atomic business operations.

---

# 28.8 Role-Permission Mapping

Roles receive permissions through a junction table.

```text id="rpt5"
role_permissions

------------------------

id

role_id

permission_id

granted_at

granted_by
```

One role may contain many permissions.

One permission may belong to multiple roles.

---

### RPT-013

Role-permission relationships shall be many-to-many.

---

### RPT-014

Permission assignments shall be fully auditable.

---

# 28.9 User Role Assignments

Users receive authorization through assigned roles.

```text id="rpt6"
user_roles

-------------------

id

user_id

role_id

assigned_at

expires_at

assigned_by
```

Supports:

* Multiple concurrent roles
* Temporary assignments
* Expiring privileges
* Administrative delegation

---

### RPT-015

Users may possess multiple active roles.

---

### RPT-016

Role assignments shall support optional expiration dates.

---

# 28.10 Permission Groups

Permission groups simplify administration.

Example:

```text id="rpt7"
permission_groups

--------------------------

id

group_code

group_name

description
```

Example groups:

* Course Management
* Assessment Management
* Administration
* Reporting
* AI Management
* Media Management

Groups organize permissions but do not replace authorization logic.

---

### RPT-017

Permission groups shall simplify administrative management.

---

### RPT-018

Permission grouping shall not alter permission semantics.

---

# 28.11 Role Hierarchy

Role inheritance reduces duplication.

Example:

```text id="rpt8"
PLATFORM_ADMIN

        │

        ▼

INSTITUTION_ADMIN

        │

        ▼

FACULTY

        │

        ▼

STUDENT
```

Higher roles inherit permissions from subordinate roles unless explicitly restricted.

Circular inheritance is prohibited.

---

### RPT-019

Role hierarchies shall form an acyclic graph.

---

### RPT-020

Inherited permissions shall be deterministic.

---

# 28.12 Protected Resources

Authorization protects platform resources.

Example:

```text id="rpt9"
protected_resources

--------------------------

id

resource_code

resource_name

resource_type
```

Examples:

* Courses
* Lessons
* Assessments
* Question Bank
* Reports
* AI Services
* Media Library
* Administration

---

### RPT-021

Every protected business resource shall possess a unique resource code.

---

### RPT-022

Resources shall be independently manageable.

---

# 28.13 Resource Permissions

Resource permissions connect permissions to protected resources.

```text id="rpt10"
resource_permissions

----------------------------

id

resource_id

permission_id
```

This abstraction enables centralized authorization policies and future policy engines.

---

### RPT-023

Permission-resource mappings shall remain normalized.

---

### RPT-024

Authorization metadata shall support future policy-based authorization.

---

# 28.14 Delegated Administration

Institutions may delegate limited administrative authority.

```text id="rpt11"
delegated_roles

----------------------

id

delegator_id

delegate_id

role_id

effective_from

effective_to
```

Supports:

* Temporary administration
* Acting administrators
* Institution-level delegation
* Controlled privilege assignment

---

### RPT-025

Delegated privileges shall have explicit validity periods.

---

### RPT-026

Delegated authority shall never exceed the delegator's own permissions.

---

# 28.15 Authorization Audit

All authorization changes shall be recorded.

```text id="rpt12"
authorization_audit

----------------------------

id

event_type

user_id

role_id

permission_id

performed_by

performed_at
```

Audited events include:

* Role assignment
* Role removal
* Permission grant
* Permission revocation
* Delegation
* Resource protection updates

---

### RPT-027

Authorization changes shall be fully auditable.

---

### RPT-028

Audit records shall be retained according to compliance policies.

---

# 28.16 Performance Considerations

Authorization is executed for nearly every secured request.

Optimization strategies:

* Cache role-permission mappings.
* Index role assignment tables.
* Cache permission groups.
* Maintain optimized join paths.
* Archive historical audit data.
* Use read replicas for reporting.

Authorization lookups shall remain low latency under peak production workloads.

---

### RPT-029

Authorization queries shall be optimized for high-frequency access.

---

### RPT-030

Caching shall not compromise authorization consistency.

---

# 28.17 Security & Compliance

Authorization metadata is security-sensitive.

Required controls:

* Least Privilege
* Role Separation
* Multi-party approval for privileged roles
* Audit logging
* Administrative change tracking
* Encryption in transit
* Row-Level Security (where applicable)
* Compliance with NIST RBAC recommendations

Privileged roles shall require additional governance and monitoring.

---

### RPT-031

Administrative role changes shall require elevated authorization.

---

### RPT-032

Authorization metadata shall be protected against unauthorized modification.

---

# 28.18 Governance

Role & Permission governance includes:

* Identity & Access Management (IAM) Team
* Enterprise Security Architecture Board
* Database Architecture Review Board
* Product Owners
* Security Operations Center (SOC)
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes to authorization structures require:

* Security review
* Architecture approval
* Migration validation
* Penetration testing
* Documentation updates

---

### RPT-033

Authorization schema modifications require formal governance approval.

---

### RPT-034

Authorization documentation shall remain synchronized with implementation.

---

# 28.19 Traceability

This chapter defines the database design for the Role & Permission Management domain within the Mediverse platform.

**Related Documents**

* Chapter 26 – Identity & Authentication Tables
* Chapter 27 – User Management Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Security Architecture
* Identity & Access Management Standards
* Architecture Decision Records (ADR)

**Applies To**

* Roles
* Permissions
* Role Hierarchies
* User Role Assignments
* Permission Groups
* Protected Resources
* Delegated Administration
* Authorization Auditing
* PostgreSQL Security Schema

---

# Chapter Summary

This chapter defines the Role & Permission Management database architecture for the Mediverse platform. It establishes a comprehensive Role-Based Access Control (RBAC) model with normalized tables for roles, permissions, permission groups, user-role assignments, role hierarchies, protected resources, delegated administration, and authorization auditing. By implementing standardized relationships, least-privilege principles, comprehensive auditing, and enterprise governance, the platform provides a scalable, secure, and extensible authorization framework that supports current operational needs while enabling future evolution toward attribute-based and policy-based access control models.

---

---

# 28.10 Production DDL: Curriculum & CMS Content Review Tables

```sql
CREATE SCHEMA IF NOT EXISTS curriculum;

CREATE TABLE curriculum.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content_markdown TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, IN_REVIEW, APPROVED, PUBLISHED, REJECTED
  version_number INT NOT NULL DEFAULT 1,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE curriculum.content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES curriculum.lessons(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  previous_status VARCHAR(30) NOT NULL,
  new_status VARCHAR(30) NOT NULL,
  decision VARCHAR(20) NOT NULL, -- APPROVED, REJECTED
  comments TEXT NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_reviews_lesson ON curriculum.content_reviews(lesson_id, created_at DESC);
```

**End of Chapter 28**

**Next:** **Chapter 29 – Student Module Tables**.

---

# Chapter 29 — Student Module Tables

---

# Chapter Overview

This chapter defines the database design for the **Student Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing student lifecycle, academic enrollment, cohort assignments, learning preferences, progress summaries, clinical rotations, academic achievements, and student-specific metadata.

The Student Module extends the **User Management** domain by introducing educational and institutional information specific to learners while maintaining normalization, scalability, and referential integrity.

---

# 29.1 Introduction

The Student Module is the central repository for all learner-specific data within the Mediverse platform.

It supports:

* Student registration
* Academic enrollment
* Batch and cohort management
* Program assignments
* Semester tracking
* Clinical rotation assignments
* Student preferences
* Academic standing
* Learning analytics references
* Graduation lifecycle

The module integrates with:

* Identity & Authentication
* User Management
* Course Management
* Assessment
* Progress Tracking
* Certificate Management
* Analytics & Reporting

Authentication data remains outside this module and is managed by the **auth** schema.

---

# 29.2 Objectives

The objectives of the Student Module database are to:

* Maintain normalized student records.
* Support multiple academic programs.
* Track student lifecycle.
* Enable institutional enrollment.
* Support cohort management.
* Facilitate progress monitoring.
* Integrate with assessments.
* Maintain historical academic records.
* Support analytics.
* Ensure long-term scalability.

---

### SMT-001

Each student shall have exactly one primary student record linked to a business user profile.

---

### SMT-002

Student data shall remain independent of authentication credentials.

---

# 29.3 Student Domain Architecture

```text id="smt1"
                  auth.users
                       │
                       ▼
             users.user_profiles
                       │
                       ▼
                   students
          ┌─────────┼──────────┐
          ▼         ▼          ▼
     enrollments cohorts clinical_rotations
          │         │          │
          ▼         ▼          ▼
   academic_status preferences achievements
                       │
                       ▼
               progress_summary
```

This architecture ensures clear separation between identity, profile management, and student-specific academic information.

---

### SMT-003

Student records shall extend user profiles using UUID foreign keys.

---

### SMT-004

Academic data shall remain isolated from authentication services.

---

# 29.4 Schema Organization

The Student Module resides within the **student** schema.

```text id="smt2"
student

├── students

├── student_enrollments

├── student_cohorts

├── student_programs

├── student_semesters

├── student_preferences

├── student_clinical_rotations

├── student_academic_status

├── student_achievements

└── student_progress_summary
```

Each table represents an independent academic concern.

---

### SMT-005

Student-related tables shall reside within the dedicated **student** schema.

---

### SMT-006

Schema ownership shall follow bounded-context principles.

---

# 29.5 Entity Relationship Diagram

```text id="smt3"
user_profiles
      │
      ▼
students
      │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
enrollments  programs     semesters    preferences
      │              │              │
      ▼              ▼              ▼
cohorts   clinical_rotations achievements
      │
      ▼
progress_summary
```

Every student-related entity references the parent **students** table.

---

### SMT-007

All student entities shall reference the canonical student record.

---

### SMT-008

Referential integrity shall be enforced using UUID foreign keys.

---

# 29.6 Students Table

The **students** table stores the primary academic identity.

| Column            | Type        |
| ----------------- | ----------- |
| id                | UUID        |
| user_profile_id   | UUID FK     |
| student_number    | VARCHAR(50) |
| admission_date    | DATE        |
| graduation_date   | DATE        |
| current_status_id | UUID FK     |
| institution_id    | UUID FK     |
| created_at        | TIMESTAMPTZ |
| updated_at        | TIMESTAMPTZ |

Business Rules:

* Student numbers must be unique.
* One business profile may have one active student record.
* Historical records shall remain preserved.

---

### SMT-009

Student numbers shall remain globally unique within an institution.

---

### SMT-010

Student lifecycle status shall reference enterprise lookup tables.

---

# 29.7 Student Enrollments

The enrollment table tracks academic registrations.

```text id="smt4"
student_enrollments

----------------------------

id

student_id

program_id

academic_year

enrollment_date

enrollment_status_id
```

Supports:

* Multiple enrollments
* Re-enrollment
* Transfers
* Deferred admissions

---

### SMT-011

Enrollment history shall be permanently retained.

---

### SMT-012

Enrollment status shall reference standardized lookup values.

---

# 29.8 Student Programs

Students may participate in one or more academic programs.

```text id="smt5"
student_programs

-------------------------

id

student_id

program_id

specialization_id

start_date

end_date
```

Example programs:

* MBBS
* MD
* Nursing
* Dentistry
* Allied Health Sciences

---

### SMT-013

Program assignments shall support historical tracking.

---

### SMT-014

Academic programs shall reference institutional master data.

---

# 29.9 Student Cohorts

Cohorts group students by admission or academic progression.

```text id="smt6"
student_cohorts

-----------------------

id

student_id

cohort_id

assigned_date
```

Examples:

* MBBS 2026 Batch
* Surgery Residency Cohort
* Anatomy Foundation Group

---

### SMT-015

Students may belong to multiple cohorts over time.

---

### SMT-016

Cohort assignments shall be historically traceable.

---

# 29.10 Student Semesters

Semester tracking records academic progression.

```text id="smt7"
student_semesters

-------------------------

id

student_id

semester_id

academic_year

gpa

status
```

Tracks:

* Current semester
* Completed semesters
* GPA history
* Academic progression

---

### SMT-017

Semester history shall remain immutable after academic closure.

---

### SMT-018

Semester records shall support longitudinal reporting.

---

# 29.11 Student Preferences

Student-specific educational preferences are maintained separately.

```text id="smt8"
student_preferences

----------------------------

student_id

preferred_language

learning_mode

content_speed

notification_preference

accessibility_settings
```

Preferences support:

* Personalized learning
* Accessibility
* Adaptive AI recommendations
* Notification customization

---

### SMT-019

Educational preferences shall support personalized learning experiences.

---

### SMT-020

Preference values shall comply with enterprise configuration standards.

---

# 29.12 Clinical Rotations

Medical education requires structured clinical training.

```text id="smt9"
student_clinical_rotations

-----------------------------------

id

student_id

hospital_id

department_id

supervisor_id

rotation_start

rotation_end

status
```

Supports:

* Hospital assignments
* Clinical departments
* Rotation schedules
* Supervisors
* Attendance integration

---

### SMT-021

Clinical rotations shall support multiple assignments throughout a student's academic lifecycle.

---

### SMT-022

Rotation history shall remain permanently auditable.

---

# 29.13 Academic Status

Academic standing is maintained independently.

```text id="smt10"
student_academic_status

--------------------------------

student_id

status

effective_from

effective_to

remarks
```

Example statuses:

* Active
* Leave of Absence
* Probation
* Graduated
* Withdrawn
* Suspended

---

### SMT-023

Academic status history shall preserve all status transitions.

---

### SMT-024

Status changes shall be fully auditable.

---

# 29.14 Student Achievements

Academic accomplishments are normalized.

```text id="smt11"
student_achievements

------------------------------

id

student_id

achievement_type

title

description

awarded_date
```

Examples:

* Gold Medal
* Research Publication
* Academic Excellence
* Best Clinical Performance
* Conference Presentation

---

### SMT-025

Achievements shall remain permanently associated with student records.

---

### SMT-026

Achievement classifications shall reference enterprise lookup tables where applicable.

---

# 29.15 Student Progress Summary

The progress summary provides denormalized reporting data.

```text id="smt12"
student_progress_summary

-----------------------------------

student_id

courses_completed

credits_earned

gpa

completion_percentage

last_updated
```

This table supports dashboards and reporting while detailed records remain in transactional modules.

---

### SMT-027

Progress summaries shall be derived from authoritative transactional data.

---

### SMT-028

Summary records shall be periodically synchronized with source systems.

---

# 29.16 Performance Considerations

The Student Module serves high-volume transactional and analytical workloads.

Optimization strategies include:

* Index student numbers.
* Index enrollment and program foreign keys.
* Partition historical enrollment records.
* Cache active student metadata.
* Materialize frequently accessed reporting views.
* Optimize joins with course and assessment modules.

Student-related queries shall meet enterprise performance targets under peak academic workloads.

---

### SMT-029

Student module queries shall be optimized for high-frequency academic operations.

---

### SMT-030

Historical academic records shall support archival strategies without impacting operational performance.

---

# 29.17 Security & Compliance

Student information includes educational records and personally identifiable information.

Required controls:

* Encryption at rest
* TLS encryption in transit
* Role-Based Access Control (RBAC)
* Fine-grained authorization
* Audit logging
* Data masking where appropriate
* Data retention policies
* GDPR compliance
* FERPA-inspired educational privacy controls
* HIPAA alignment for clinical education records where applicable

Access shall be restricted according to institutional and regulatory requirements.

---

### SMT-031

Student records shall be protected using enterprise security controls.

---

### SMT-032

Access to academic records shall be fully auditable.

---

# 29.18 Governance

Student Module governance includes:

* Academic Affairs
* Registrar Office
* Enterprise Data Governance Board
* Database Architecture Review Board
* Privacy Office
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* Privacy assessment
* Security review
* Migration validation
* Documentation updates

---

### SMT-033

Student schema modifications require formal governance approval.

---

### SMT-034

Academic documentation shall remain synchronized with implementation.

---

# 29.19 Traceability

This chapter defines the database design for the Student Module within the Mediverse platform.

**Related Documents**

* Chapter 26 – Identity & Authentication Tables
* Chapter 27 – User Management Tables
* Chapter 28 – Role & Permission Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Entity Relationship Diagram (ERD)
* Privacy & Compliance Standards
* Architecture Decision Records (ADR)

**Applies To**

* Student Records
* Academic Enrollments
* Programs
* Cohorts
* Semesters
* Clinical Rotations
* Academic Status
* Achievements
* Progress Summaries
* PostgreSQL Student Schema

---

# Chapter Summary

This chapter defines the Student Module database architecture for the Mediverse platform. It introduces normalized tables for student identities, enrollments, academic programs, cohorts, semesters, learning preferences, clinical rotations, academic status, achievements, and progress summaries. By separating business concerns, enforcing referential integrity, maintaining comprehensive academic history, and applying enterprise governance and security controls, the Student Module provides a scalable and extensible foundation for managing learner information throughout the complete educational lifecycle.

---

**End of Chapter 29**

**Next:** **Chapter 30 – Faculty Module Tables**.

---

# Chapter 30 — Faculty Module Tables

---

# Chapter Overview

This chapter defines the database design for the **Faculty Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing faculty profiles, academic appointments, teaching assignments, departmental affiliations, clinical responsibilities, research activities, qualifications, certifications, workload management, and faculty lifecycle.

The Faculty Module extends the User Management domain by introducing educator-specific entities while maintaining strict normalization, referential integrity, and scalability.

---

# 30.1 Introduction

Faculty members are responsible for delivering educational content, conducting assessments, supervising clinical training, mentoring students, and contributing to research.

The Faculty Module manages:

* Faculty profiles
* Academic appointments
* Departments
* Teaching assignments
* Clinical responsibilities
* Research activities
* Professional qualifications
* Licenses and certifications
* Faculty workload
* Faculty availability
* Performance metrics

This module integrates with:

* Identity & Authentication
* User Management
* Student Module
* Course Module
* Assessment Module
* Clinical Rotation Module
* Analytics Module

Authentication information remains within the **auth** schema.

---

# 30.2 Objectives

The objectives of the Faculty Module database are to:

* Maintain normalized faculty records.
* Support multiple appointments.
* Track departmental affiliations.
* Manage teaching assignments.
* Support clinical supervision.
* Store academic credentials.
* Record faculty workload.
* Enable research tracking.
* Support institutional reporting.
* Ensure long-term scalability.

---

### FMT-001

Each faculty member shall have one primary faculty record linked to a user profile.

---

### FMT-002

Faculty information shall remain independent from authentication data.

---

# 30.3 Faculty Domain Architecture

```text id="fmt1"
                  auth.users
                       │
                       ▼
             users.user_profiles
                       │
                       ▼
                    faculty
        ┌────────────┼──────────────┐
        ▼            ▼              ▼
appointments qualifications teaching_assignments
        │            │              │
        ▼            ▼              ▼
departments certifications workload
        │
        ▼
clinical_supervision
        │
        ▼
research_profiles
```

This architecture separates identity management from academic and institutional faculty information.

---

### FMT-003

Faculty records shall extend user profiles through UUID foreign keys.

---

### FMT-004

Faculty-related academic information shall remain independent from authentication services.

---

# 30.4 Schema Organization

The Faculty Module resides within the **faculty** schema.

```text id="fmt2"
faculty

├── faculty_members

├── faculty_appointments

├── faculty_departments

├── faculty_qualifications

├── faculty_certifications

├── faculty_teaching_assignments

├── faculty_workload

├── faculty_clinical_supervision

├── faculty_research_profiles

└── faculty_availability
```

Each table represents a distinct academic responsibility.

---

### FMT-005

Faculty-related tables shall reside within the dedicated **faculty** schema.

---

### FMT-006

Schema ownership shall align with the Faculty Management bounded context.

---

# 30.5 Entity Relationship Diagram

```text id="fmt3"
user_profiles
      │
      ▼
faculty_members
      │
 ├────────────┬──────────────┬──────────────┐
 ▼            ▼              ▼              ▼
appointments qualifications certifications workload
      │                             │
      ▼                             ▼
departments                 teaching_assignments
      │                             │
      ▼                             ▼
clinical_supervision    research_profiles
      │
      ▼
availability
```

Every faculty-related entity references the **faculty_members** table.

---

### FMT-007

All faculty entities shall reference the canonical faculty record.

---

### FMT-008

Referential integrity shall be enforced through UUID foreign keys.

---

# 30.6 Faculty Members Table

The **faculty_members** table stores the primary faculty identity.

| Column               | Type        |
| -------------------- | ----------- |
| id                   | UUID        |
| user_profile_id      | UUID FK     |
| employee_number      | VARCHAR(50) |
| faculty_type_id      | UUID FK     |
| designation_id       | UUID FK     |
| joining_date         | DATE        |
| retirement_date      | DATE        |
| employment_status_id | UUID FK     |
| institution_id       | UUID FK     |
| created_at           | TIMESTAMPTZ |
| updated_at           | TIMESTAMPTZ |

Business Rules:

* Employee numbers shall be unique.
* One active faculty record per business profile.
* Historical employment records shall remain preserved.

---

### FMT-009

Employee numbers shall be unique within an institution.

---

### FMT-010

Faculty designations shall reference enterprise lookup tables.

---

# 30.7 Faculty Appointments

Faculty may hold multiple academic appointments over time.

```text id="fmt4"
faculty_appointments

----------------------------

id

faculty_id

appointment_type

department_id

effective_from

effective_to

status
```

Examples:

* Professor
* Associate Professor
* Assistant Professor
* Visiting Faculty
* Adjunct Faculty
* Clinical Instructor

---

### FMT-011

Appointment history shall be permanently retained.

---

### FMT-012

Appointments shall support effective date ranges.

---

# 30.8 Faculty Departments

Faculty members may belong to one or more departments.

```text id="fmt5"
faculty_departments

--------------------------

id

faculty_id

department_id

primary_department

assigned_date
```

Example departments:

* Anatomy
* Physiology
* Surgery
* Medicine
* Pediatrics
* Radiology

---

### FMT-013

Faculty members may belong to multiple departments.

---

### FMT-014

One department shall be designated as the primary department.

---

# 30.9 Faculty Qualifications

Professional and academic qualifications are normalized.

```text id="fmt6"
faculty_qualifications

------------------------------

id

faculty_id

qualification

institution

graduation_year

specialization
```

Examples:

* MBBS
* MD
* MS
* DM
* MCh
* PhD

---

### FMT-015

Qualifications shall be independently maintained.

---

### FMT-016

Qualification records shall support historical preservation.

---

# 30.10 Faculty Certifications

Professional licenses and certifications are tracked separately.

```text id="fmt7"
faculty_certifications

--------------------------------

id

faculty_id

certificate_name

issuing_authority

issue_date

expiry_date

license_number
```

Examples:

* Medical Council Registration
* ACLS
* BLS
* Research Ethics Certification

---

### FMT-017

Professional certifications shall support renewal tracking.

---

### FMT-018

Expired certifications shall remain available for audit purposes.

---

# 30.11 Teaching Assignments

Teaching assignments map faculty members to educational activities.

```text id="fmt8"
faculty_teaching_assignments

-------------------------------------

id

faculty_id

course_id

semester_id

section_id

academic_year

assignment_type
```

Assignment Types:

* Lecturer
* Tutor
* Lab Instructor
* Clinical Supervisor
* Examiner

---

### FMT-019

Faculty teaching assignments shall support multiple concurrent courses.

---

### FMT-020

Assignment history shall remain immutable after academic completion.

---

# 30.12 Faculty Workload

Faculty workload supports operational planning.

```text id="fmt9"
faculty_workload

------------------------

faculty_id

academic_year

teaching_hours

clinical_hours

research_hours

administrative_hours
```

Workload calculations support:

* Capacity planning
* Performance evaluation
* Scheduling optimization
* Resource allocation

---

### FMT-021

Workload summaries shall be derived from authoritative academic activities.

---

### FMT-022

Workload calculations shall be reproducible and auditable.

---

# 30.13 Clinical Supervision

Medical education requires faculty supervision of clinical rotations.

```text id="fmt10"
faculty_clinical_supervision

---------------------------------------

id

faculty_id

hospital_id

department_id

student_group_id

rotation_period

supervision_role
```

Supports:

* Ward supervision
* Outpatient clinics
* Operating theaters
* Emergency medicine
* Specialty rotations

---

### FMT-023

Clinical supervision assignments shall support multiple simultaneous rotations.

---

### FMT-024

Clinical supervision records shall remain historically traceable.

---

# 30.14 Research Profiles

Faculty research contributions are maintained separately.

```text id="fmt11"
faculty_research_profiles

------------------------------------

faculty_id

orcid_id

research_interests

publication_count

h_index

research_summary
```

Supports:

* Publications
* Research grants
* Clinical trials
* Academic collaborations

---

### FMT-025

Research profiles shall support integration with external scholarly systems.

---

### FMT-026

Research metrics shall be periodically synchronized with authoritative sources where applicable.

---

# 30.15 Faculty Availability

Availability supports scheduling and resource management.

```text id="fmt12"
faculty_availability

----------------------------

faculty_id

day_of_week

start_time

end_time

availability_type
```

Availability Types:

* Available
* Teaching
* Clinical Duty
* Administrative
* Leave

---

### FMT-027

Faculty availability shall support recurring schedules.

---

### FMT-028

Scheduling conflicts shall be validated before assignment.

---

# 30.16 Performance Considerations

The Faculty Module supports high-volume scheduling and academic operations.

Optimization strategies include:

* Index employee numbers.
* Index department and course foreign keys.
* Cache active faculty metadata.
* Materialize workload summaries.
* Optimize scheduling queries.
* Archive historical appointment records.

Faculty-related queries shall meet enterprise performance objectives during peak academic periods.

---

### FMT-029

Faculty module queries shall be optimized for scheduling and reporting workloads.

---

### FMT-030

Historical faculty records shall support archival without degrading operational performance.

---

# 30.17 Security & Compliance

Faculty data contains personally identifiable and employment-related information.

Required controls:

* Encryption at rest
* TLS encryption in transit
* Role-Based Access Control (RBAC)
* Fine-grained authorization
* Audit logging
* Data masking for administrative views
* Data retention policies
* GDPR compliance
* Institutional privacy policies

Sensitive employment and licensing information shall only be accessible to authorized users.

---

### FMT-031

Faculty records shall be protected using enterprise security controls.

---

### FMT-032

Access to faculty records shall be fully auditable.

---

# 30.18 Governance

Faculty Module governance includes:

* Academic Affairs
* Human Resources
* Faculty Administration Office
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* HR review
* Security assessment
* Migration validation
* Documentation updates

---

### FMT-033

Faculty schema modifications require formal governance approval.

---

### FMT-034

Faculty documentation shall remain synchronized with implementation.

---

# 30.19 Traceability

This chapter defines the database design for the Faculty Module within the Mediverse platform.

**Related Documents**

* Chapter 26 – Identity & Authentication Tables
* Chapter 27 – User Management Tables
* Chapter 28 – Role & Permission Tables
* Chapter 29 – Student Module Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Entity Relationship Diagram (ERD)
* Privacy & Compliance Standards
* Architecture Decision Records (ADR)

**Applies To**

* Faculty Records
* Academic Appointments
* Departments
* Qualifications
* Certifications
* Teaching Assignments
* Clinical Supervision
* Research Profiles
* Faculty Availability
* PostgreSQL Faculty Schema

---

# Chapter Summary

This chapter defines the Faculty Module database architecture for the Mediverse platform. It establishes normalized tables for faculty members, academic appointments, departmental affiliations, qualifications, certifications, teaching assignments, workload management, clinical supervision, research profiles, and availability. By enforcing strong referential integrity, preserving historical academic information, supporting institutional reporting, and applying enterprise security and governance controls, the Faculty Module provides a scalable and extensible foundation for managing educators and academic staff across the platform.

---

**End of Chapter 30**

**Next:** **Chapter 31 – Course Module Tables**.

---

# Chapter 31 — Course Module Tables

---

# Chapter Overview

This chapter defines the database design for the **Course Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing academic courses, curricula, modules, lessons, prerequisites, course versions, accreditation information, scheduling, and course lifecycle management.

The Course Module serves as the academic backbone of the platform, providing the structural framework upon which lessons, assessments, AI tutoring, progress tracking, certifications, and analytics are built.

---

# 31.1 Introduction

Courses represent structured learning pathways that organize educational content into coherent academic programs.

The Course Module manages:

* Course catalog
* Course versions
* Curriculum structures
* Modules
* Prerequisites
* Learning outcomes
* Course schedules
* Faculty assignments
* Credit systems
* Accreditation metadata
* Course lifecycle

The module integrates with:

* Student Module
* Faculty Module
* Lesson Module
* Assessment Module
* Certificate Module
* Progress Tracking
* Analytics & Reporting

---

# 31.2 Objectives

The objectives of the Course Module database are to:

* Maintain a centralized course catalog.
* Support curriculum versioning.
* Enable modular learning structures.
* Manage academic credits.
* Support accreditation requirements.
* Track course lifecycle.
* Enable prerequisite validation.
* Support multi-institution deployments.
* Preserve historical course definitions.
* Provide scalability for future expansion.

---

### CMT-001

Every course shall possess a globally unique identifier.

---

### CMT-002

Course definitions shall remain independent from lesson delivery.

---

# 31.3 Course Domain Architecture

```text id="cmt1"
                 course_catalog
                        │
                        ▼
                    courses
         ┌──────────┼──────────┐
         ▼          ▼          ▼
   versions     modules    schedules
         │          │          │
         ▼          ▼          ▼
 prerequisites learning_outcomes faculty_assignments
         │
         ▼
 accreditation
```

The Course Module acts as the central academic repository for educational content organization.

---

### CMT-003

Course metadata shall be maintained independently from instructional content.

---

### CMT-004

Course entities shall support integration with downstream academic modules.

---

# 31.4 Schema Organization

The Course Module resides within the **course** schema.

```text id="cmt2"
course

├── courses

├── course_versions

├── course_modules

├── course_prerequisites

├── learning_outcomes

├── course_schedules

├── faculty_course_assignments

├── accreditation_records

├── course_resources

└── curriculum_mappings
```

---

### CMT-005

Course-related tables shall reside within the dedicated **course** schema.

---

### CMT-006

Schema ownership shall remain within the Academic Content bounded context.

---

# 31.5 Entity Relationship Diagram

```text id="cmt3"
courses
   │
   ├─────────────┬──────────────┬──────────────┐
   ▼             ▼              ▼              ▼
versions     modules      schedules    prerequisites
   │             │              │
   ▼             ▼              ▼
learning_outcomes faculty_assignments accreditation
   │
   ▼
curriculum_mappings
```

All supporting entities reference the **courses** table using UUID foreign keys.

---

### CMT-007

All course-related entities shall reference the canonical course record.

---

### CMT-008

Referential integrity shall be enforced through UUID foreign keys.

---

# 31.6 Courses Table

The **courses** table stores the primary academic course definition.

| Column           | Type         |
| ---------------- | ------------ |
| id               | UUID         |
| course_code      | VARCHAR(50)  |
| course_title     | VARCHAR(300) |
| description      | TEXT         |
| credit_hours     | NUMERIC(4,1) |
| duration_hours   | INTEGER      |
| department_id    | UUID FK      |
| course_status_id | UUID FK      |
| institution_id   | UUID FK      |
| created_at       | TIMESTAMPTZ  |
| updated_at       | TIMESTAMPTZ  |

Business Rules:

* Course codes shall be unique within an institution.
* Credit hours shall be non-negative.
* Course titles may change through versioning.
* Historical records shall be preserved.

---

### CMT-009

Course codes shall remain unique within an institution.

---

### CMT-010

Course status shall reference enterprise lookup tables.

---

# 31.7 Course Versions

Versioning enables curriculum evolution without losing historical definitions.

```text id="cmt4"
course_versions

-------------------------

id

course_id

version_number

effective_from

effective_to

published

change_summary
```

Supports:

* Curriculum revisions
* Regulatory updates
* Accreditation changes
* AI content improvements

---

### CMT-011

Every curriculum revision shall create a new course version.

---

### CMT-012

Historical course versions shall remain immutable after publication.

---

# 31.8 Course Modules

Courses are divided into instructional modules.

```text id="cmt5"
course_modules

-------------------------

id

course_id

module_title

display_order

estimated_hours

module_status
```

Example modules:

* Human Anatomy
* Cardiovascular Physiology
* Clinical Skills
* Medical Ethics

---

### CMT-013

Modules shall belong to exactly one course version.

---

### CMT-014

Display order shall determine learner navigation.

---

# 31.9 Course Prerequisites

Prerequisite relationships define academic dependencies.

```text id="cmt6"
course_prerequisites

----------------------------

id

course_id

prerequisite_course_id

requirement_type

minimum_grade
```

Requirement Types:

* Mandatory
* Recommended
* Optional

Circular prerequisite relationships are prohibited.

---

### CMT-015

Course prerequisite graphs shall be acyclic.

---

### CMT-016

Prerequisite validation shall occur before enrollment.

---

# 31.10 Learning Outcomes

Learning outcomes define measurable educational objectives.

```text id="cmt7"
learning_outcomes

----------------------------

id

course_id

outcome_code

description

competency_level

display_order
```

Examples:

* Explain cardiovascular physiology.
* Interpret ECG findings.
* Demonstrate sterile techniques.
* Diagnose common clinical conditions.

---

### CMT-017

Every course shall define measurable learning outcomes.

---

### CMT-018

Learning outcomes shall support competency-based education.

---

# 31.11 Course Schedules

Schedules define planned course delivery.

```text id="cmt8"
course_schedules

--------------------------

id

course_id

academic_term

start_date

end_date

delivery_mode

schedule_status
```

Delivery Modes:

* Classroom
* Online
* Hybrid
* Clinical
* Laboratory

---

### CMT-019

Course schedules shall support multiple academic terms.

---

### CMT-020

Schedule conflicts shall be validated before publication.

---

# 31.12 Faculty Course Assignments

Faculty members are assigned to courses.

```text id="cmt9"
faculty_course_assignments

------------------------------------

id

course_id

faculty_id

role

assigned_date

academic_year
```

Assignment Roles:

* Lead Instructor
* Lecturer
* Clinical Supervisor
* Teaching Assistant
* Course Coordinator

---

### CMT-021

Multiple faculty members may be assigned to a single course.

---

### CMT-022

Faculty assignments shall preserve historical records.

---

# 31.13 Accreditation Records

Medical education programs often require accreditation tracking.

```text id="cmt10"
accreditation_records

---------------------------------

id

course_id

accreditation_body

approval_number

effective_date

expiry_date

status
```

Supports accreditation agencies, institutional approvals, and regulatory compliance.

---

### CMT-023

Accreditation records shall support expiration monitoring.

---

### CMT-024

Expired accreditation records shall remain available for audit purposes.

---

# 31.14 Course Resources

Supplementary resources are associated with courses.

```text id="cmt11"
course_resources

----------------------------

id

course_id

resource_type

media_id

display_order

required
```

Resource Types:

* Textbook
* PDF
* Video
* 3D Model
* Clinical Case
* AI Tutor Prompt
* External Reference

Actual media files are stored in the Media Management module.

---

### CMT-025

Course resources shall reference enterprise media management services.

---

### CMT-026

Required resources shall be identified explicitly.

---

# 31.15 Curriculum Mappings

Curriculum mappings connect courses to academic programs.

```text id="cmt12"
curriculum_mappings

------------------------------

id

program_id

course_id

semester_id

curriculum_version

mandatory
```

Supports:

* Program-specific curricula
* Semester planning
* Elective pathways
* Institutional customization

---

### CMT-027

Courses may belong to multiple academic programs.

---

### CMT-028

Curriculum mappings shall preserve historical curriculum versions.

---

# 31.16 Performance Considerations

The Course Module serves as a high-read academic repository.

Optimization strategies include:

* Index course codes.
* Index curriculum mapping relationships.
* Cache active course catalogs.
* Materialize frequently accessed curriculum views.
* Optimize prerequisite queries.
* Archive deprecated course versions.

Course lookup operations shall achieve low-latency performance across large academic catalogs.

---

### CMT-029

Course queries shall be optimized for read-intensive workloads.

---

### CMT-030

Curriculum version retrieval shall remain performant regardless of catalog size.

---

# 31.17 Security & Compliance

Course metadata is institutionally governed.

Required controls:

* Role-Based Access Control (RBAC)
* Approval workflows for curriculum publication
* Version auditing
* Academic governance controls
* Audit logging
* Encryption in transit
* Data integrity validation

Only authorized academic personnel may modify published course definitions.

---

### CMT-031

Course modifications shall require appropriate academic authorization.

---

### CMT-032

Published curriculum changes shall be fully auditable.

---

# 31.18 Governance

Course Module governance includes:

* Curriculum Committee
* Academic Affairs
* Faculty Board
* Accreditation Office
* Enterprise Data Governance Board
* Database Architecture Review Board
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* Accreditation review (where applicable)
* Migration validation
* Documentation updates

---

### CMT-033

Course schema modifications require formal governance approval.

---

### CMT-034

Course documentation shall remain synchronized with implementation.

---

# 31.19 Traceability

This chapter defines the database design for the Course Module within the Mediverse platform.

**Related Documents**

* Chapter 29 – Student Module Tables
* Chapter 30 – Faculty Module Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Entity Relationship Diagram (ERD)
* Curriculum Standards
* Architecture Decision Records (ADR)

**Applies To**

* Course Catalog
* Course Versions
* Course Modules
* Learning Outcomes
* Prerequisites
* Course Scheduling
* Faculty Assignments
* Accreditation
* Curriculum Mapping
* PostgreSQL Course Schema

---

# Chapter Summary

This chapter defines the Course Module database architecture for the Mediverse platform. It establishes normalized tables for courses, version management, instructional modules, prerequisite relationships, learning outcomes, schedules, faculty assignments, accreditation records, course resources, and curriculum mappings. By enforcing strong referential integrity, comprehensive version control, academic governance, and performance optimization, the Course Module provides a scalable and extensible foundation for curriculum management and educational delivery across institutions.

---

**End of Chapter 31**

**Next:** **Chapter 32 – Lesson Module Tables**.

---

# Chapter 32 — Lesson Module Tables

---

# Chapter Overview

This chapter defines the database design for the **Lesson Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing lessons, instructional units, multimedia learning resources, lesson sequencing, learning objectives, AI-assisted content, interactive simulations, prerequisite lessons, lesson versions, and publication lifecycle.

The Lesson Module extends the Course Module by providing the granular instructional content delivered to learners while maintaining normalization, extensibility, version control, and referential integrity.

---

# 32.1 Introduction

A lesson is the smallest structured instructional unit within a course.

The Lesson Module manages:

* Lesson catalog
* Lesson versions
* Lesson sequencing
* Learning objectives
* Multimedia resources
* Interactive simulations
* AI-assisted content
* Lesson prerequisites
* Lesson publication workflow
* Estimated learning time
* Content lifecycle

The module integrates with:

* Course Module
* Assessment Module
* Media Management
* AI Knowledge Base
* Progress Tracking
* Analytics Module
* Certificate Module

---

# 32.2 Objectives

The objectives of the Lesson Module database are to:

* Organize instructional content.
* Support lesson versioning.
* Manage multimedia assets.
* Enable adaptive learning.
* Support AI-powered educational content.
* Maintain lesson sequencing.
* Track publication lifecycle.
* Support accessibility requirements.
* Enable personalized learning.
* Preserve historical lesson definitions.

---

### LMT-001

Every lesson shall possess a globally unique identifier.

---

### LMT-002

Lessons shall belong to exactly one course module version.

---

# 32.3 Lesson Domain Architecture

```text id="lmt1"
                  course_modules
                        │
                        ▼
                     lessons
         ┌──────────┼─────────────┬─────────────┐
         ▼          ▼             ▼             ▼
 versions objectives resources prerequisites
         │          │             │
         ▼          ▼             ▼
 AI_Content simulations publication_workflow
         │
         ▼
 lesson_analytics
```

The Lesson Module provides reusable instructional components that support multiple delivery channels.

---

### LMT-003

Lesson metadata shall remain independent from learner progress.

---

### LMT-004

Instructional content shall support integration with downstream learning services.

---

# 32.4 Schema Organization

The Lesson Module resides within the **lesson** schema.

```text id="lmt2"
lesson

├── lessons

├── lesson_versions

├── lesson_objectives

├── lesson_resources

├── lesson_prerequisites

├── lesson_simulations

├── lesson_ai_content

├── lesson_publications

├── lesson_tags

└── lesson_metadata
```

---

### LMT-005

Lesson-related tables shall reside within the dedicated **lesson** schema.

---

### LMT-006

Schema ownership shall remain within the Learning Content bounded context.

---

# 32.5 Entity Relationship Diagram

```text id="lmt3"
course_modules
      │
      ▼
lessons
      │
 ├────────────┬────────────┬────────────┬────────────┐
 ▼            ▼            ▼            ▼
versions objectives resources prerequisites
      │            │            │
      ▼            ▼            ▼
AI_content simulations publications
      │
      ▼
metadata
```

Every supporting entity references the **lessons** table through UUID foreign keys.

---

### LMT-007

All lesson entities shall reference the canonical lesson record.

---

### LMT-008

Referential integrity shall be enforced using UUID foreign keys.

---

# 32.6 Lessons Table

The **lessons** table stores the primary instructional unit.

| Column                     | Type         |
| -------------------------- | ------------ |
| id                         | UUID         |
| module_id                  | UUID FK      |
| lesson_code                | VARCHAR(50)  |
| lesson_title               | VARCHAR(300) |
| lesson_type_id             | UUID FK      |
| estimated_duration_minutes | INTEGER      |
| difficulty_level_id        | UUID FK      |
| publication_status_id      | UUID FK      |
| display_order              | INTEGER      |
| created_at                 | TIMESTAMPTZ  |
| updated_at                 | TIMESTAMPTZ  |

Business Rules:

* Lesson codes shall be unique within a module.
* Display order determines navigation.
* Estimated duration shall be positive.
* Lesson status references lookup tables.

---

### LMT-009

Lesson codes shall remain unique within their parent module.

---

### LMT-010

Display order shall determine instructional sequencing.

---

# 32.7 Lesson Versions

Lessons evolve independently from course versions.

```text id="lmt4"
lesson_versions

-----------------------

id

lesson_id

version_number

content_version

effective_from

effective_to

published

change_summary
```

Supports:

* Content improvements
* Medical guideline updates
* Curriculum revisions
* AI-generated enhancements

Published lesson versions remain immutable.

---

### LMT-011

Every published lesson revision shall create a new version.

---

### LMT-012

Historical lesson versions shall remain immutable.

---

# 32.8 Lesson Objectives

Each lesson defines measurable learning objectives.

```text id="lmt5"
lesson_objectives

---------------------------

id

lesson_id

objective_code

description

taxonomy_level

display_order
```

Supports educational frameworks such as:

* Bloom's Taxonomy
* Miller's Pyramid
* Competency-Based Medical Education (CBME)

---

### LMT-013

Lessons shall contain one or more measurable learning objectives.

---

### LMT-014

Objectives shall support competency-based education.

---

# 32.9 Lesson Resources

Instructional resources are maintained separately.

```text id="lmt6"
lesson_resources

--------------------------

id

lesson_id

resource_type

media_id

display_order

mandatory
```

Resource Types:

* Video
* PDF
* Audio
* Image
* Slide Deck
* Clinical Case
* External Reference
* Interactive Exercise

Large media files are stored within the Media Management module.

---

### LMT-015

Lesson resources shall reference enterprise media assets.

---

### LMT-016

Mandatory instructional resources shall be explicitly identified.

---

# 32.10 Lesson Prerequisites

Lessons may require prior instructional knowledge.

```text id="lmt7"
lesson_prerequisites

----------------------------

id

lesson_id

prerequisite_lesson_id

requirement_type
```

Requirement Types:

* Mandatory
* Recommended

Circular prerequisite relationships are prohibited.

---

### LMT-017

Lesson prerequisite graphs shall remain acyclic.

---

### LMT-018

Prerequisite validation shall occur before lesson access where applicable.

---

# 32.11 Interactive Simulations

Medical education frequently includes simulation-based learning.

```text id="lmt8"
lesson_simulations

----------------------------

id

lesson_id

simulation_id

simulation_type

launch_url

estimated_duration
```

Supported simulations:

* 3D Anatomy
* Virtual Patient
* Surgical Procedure
* Clinical Decision Tree
* AR/VR Experiences

Simulation binaries are managed outside the relational database.

---

### LMT-019

Simulation metadata shall reference external simulation services.

---

### LMT-020

Simulation availability shall support version compatibility.

---

# 32.12 AI Learning Content

Lessons may contain AI-generated educational content.

```text id="lmt9"
lesson_ai_content

----------------------------

id

lesson_id

ai_model_id

content_type

prompt_reference

generation_timestamp

approval_status
```

Supported AI content:

* Lesson summaries
* Clinical explanations
* Quiz generation
* Flashcards
* Mnemonics
* Personalized study notes

AI-generated content requires academic approval before publication.

---

### LMT-021

AI-generated educational content shall be reviewable and traceable.

---

### LMT-022

Published AI content shall record model provenance and approval history.

---

# 32.13 Lesson Publication Workflow

Publication status is tracked independently.

```text id="lmt10"
lesson_publications

----------------------------

id

lesson_id

workflow_state

reviewed_by

approved_by

published_at

retired_at
```

Workflow:

```text id="lmt11"
Draft
  │
Review
  │
Academic Approval
  │
Published
  │
Archived
```

---

### LMT-023

Only approved lessons may enter the Published state.

---

### LMT-024

Publication history shall remain permanently auditable.

---

# 32.14 Lesson Tags & Metadata

Metadata enables intelligent search and AI recommendations.

```text id="lmt12"
lesson_tags

--------------------

id

lesson_id

tag

category
```

```text id="lmt13"
lesson_metadata

------------------------

lesson_id

reading_level

language

keywords

seo_slug

accessibility_score
```

Metadata supports:

* Full-text search
* AI recommendation engines
* Content discovery
* Accessibility reporting
* SEO optimization

---

### LMT-025

Lesson metadata shall support intelligent content discovery.

---

### LMT-026

Metadata values shall follow enterprise taxonomy standards.

---

# 32.15 Performance Considerations

The Lesson Module is one of the most frequently accessed components of the platform.

Optimization strategies include:

* Index lesson codes.
* Index module relationships.
* Cache published lesson metadata.
* Optimize lesson sequencing queries.
* Store large assets outside PostgreSQL.
* Materialize lesson catalog views for read-heavy workloads.

Lesson retrieval APIs shall maintain low latency under peak concurrent usage.

---

### LMT-027

Lesson retrieval queries shall be optimized for read-intensive workloads.

---

### LMT-028

Large instructional assets shall remain external to transactional storage.

---

# 32.16 Security & Compliance

Lesson content is governed by academic quality standards.

Required controls:

* Role-Based Access Control (RBAC)
* Academic review workflows
* Version auditing
* Encryption in transit
* Audit logging
* Copyright management
* Accessibility compliance
* Institutional publishing policies

Only authorized faculty and content administrators may publish instructional material.

---

### LMT-029

Lesson modifications shall require appropriate academic authorization.

---

### LMT-030

Published instructional content shall be fully auditable.

---

# 32.17 Governance

Lesson Module governance includes:

* Faculty Authors
* Curriculum Committee
* Academic Review Board
* Instructional Design Team
* Enterprise Data Governance Board
* Database Architecture Review Board
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic review
* Instructional design approval
* Migration validation
* Documentation updates

---

### LMT-031

Lesson schema modifications require formal governance approval.

---

### LMT-032

Lesson documentation shall remain synchronized with implementation.

---

# 32.18 Traceability

This chapter defines the database design for the Lesson Module within the Mediverse platform.

**Related Documents**

* Chapter 31 – Course Module Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Media Management Module
* AI Knowledge Base Module
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Lessons
* Lesson Versions
* Learning Objectives
* Multimedia Resources
* Interactive Simulations
* AI Learning Content
* Publication Workflow
* Lesson Metadata
* Lesson Tags
* PostgreSQL Lesson Schema

---

# Chapter Summary

This chapter defines the Lesson Module database architecture for the Mediverse platform. It establishes normalized tables for lessons, version management, learning objectives, instructional resources, prerequisite relationships, interactive simulations, AI-generated educational content, publication workflows, tags, and metadata. By combining robust version control, academic governance, AI traceability, and scalable content organization, the Lesson Module provides a flexible and extensible foundation for delivering high-quality medical education across multiple learning modalities.

---

**End of Chapter 32**

**Next:** **Chapter 33 – Assessment Module Tables**.

---

# Chapter 33 — Assessment Module Tables

---

# Chapter Overview

This chapter defines the database design for the **Assessment Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing examinations, quizzes, assignments, practical assessments, Objective Structured Clinical Examinations (OSCEs), grading schemes, student submissions, evaluation workflows, attempt history, and assessment lifecycle management.

The Assessment Module provides a scalable and secure framework for evaluating learner competency while integrating seamlessly with the Course, Lesson, Question Bank, Progress Tracking, Certificate, Analytics, and AI modules.

---

# 33.1 Introduction

Assessment is a critical component of medical education, measuring learner knowledge, clinical reasoning, practical skills, and professional competency.

The Assessment Module manages:

* Assessment definitions
* Assessment versions
* Assessment schedules
* Question mappings
* Student attempts
* Assessment submissions
* Grading workflows
* Rubrics
* Examiner assignments
* Result publication
* Assessment analytics

The module supports:

* Formative assessments
* Summative examinations
* Practical examinations
* Viva examinations
* Clinical assessments
* AI-assisted assessments
* Adaptive assessments

---

# 33.2 Objectives

The objectives of the Assessment Module database are to:

* Standardize assessment management.
* Support multiple assessment types.
* Maintain complete attempt history.
* Enable secure grading workflows.
* Support competency-based education.
* Preserve assessment versions.
* Integrate with Question Bank.
* Enable analytics and reporting.
* Support regulatory compliance.
* Ensure scalability.

---

### AMT-001

Every assessment shall possess a globally unique identifier.

---

### AMT-002

Assessment definitions shall remain independent from learner attempts.

---

# 33.3 Assessment Domain Architecture

```text id="amt1"
                 courses
                     │
                     ▼
               assessments
         ┌──────────┼──────────────┬──────────────┐
         ▼          ▼              ▼              ▼
     versions   schedules     question_maps   rubrics
         │          │              │              │
         ▼          ▼              ▼              ▼
attempts submissions grading    examiners
         │
         ▼
results
         │
         ▼
analytics
```

The architecture separates assessment configuration from learner execution and evaluation.

---

### AMT-003

Assessment metadata shall remain independent from student attempt data.

---

### AMT-004

Assessment entities shall integrate with downstream academic services through defined relationships.

---

# 33.4 Schema Organization

The Assessment Module resides within the **assessment** schema.

```text id="amt2"
assessment

├── assessments

├── assessment_versions

├── assessment_schedules

├── assessment_question_maps

├── assessment_attempts

├── assessment_submissions

├── assessment_grading

├── assessment_rubrics

├── assessment_examiners

└── assessment_results
```

---

### AMT-005

Assessment-related tables shall reside within the dedicated **assessment** schema.

---

### AMT-006

Schema ownership shall remain within the Academic Evaluation bounded context.

---

# 33.5 Entity Relationship Diagram

```text id="amt3"
courses
    │
    ▼
assessments
    │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
versions   schedules   question_maps    rubrics
    │              │              │
    ▼              ▼              ▼
attempts    submissions    examiners
    │
    ▼
grading
    │
    ▼
results
```

All supporting entities reference the **assessments** table through UUID foreign keys.

---

### AMT-007

Assessment entities shall reference the canonical assessment record.

---

### AMT-008

Referential integrity shall be enforced through UUID foreign keys.

---

# 33.6 Assessments Table

The **assessments** table stores the primary assessment definition.

| Column               | Type         |
| -------------------- | ------------ |
| id                   | UUID         |
| course_id            | UUID FK      |
| assessment_code      | VARCHAR(50)  |
| title                | VARCHAR(300) |
| assessment_type_id   | UUID FK      |
| total_marks          | NUMERIC(6,2) |
| passing_marks        | NUMERIC(6,2) |
| duration_minutes     | INTEGER      |
| assessment_status_id | UUID FK      |
| created_at           | TIMESTAMPTZ  |
| updated_at           | TIMESTAMPTZ  |

Assessment Types:

* Quiz
* Assignment
* Mid-Term
* Final Examination
* Practical Examination
* Viva
* OSCE
* AI Assessment

---

### AMT-009

Assessment codes shall remain unique within an institution.

---

### AMT-010

Passing marks shall not exceed total marks.

---

# 33.7 Assessment Versions

Assessment content evolves independently.

```text id="amt4"
assessment_versions

---------------------------

id

assessment_id

version_number

effective_from

effective_to

published

change_summary
```

Supports:

* Question updates
* Curriculum revisions
* Medical guideline updates
* Regulatory modifications

Published versions remain immutable.

---

### AMT-011

Every published assessment revision shall create a new version.

---

### AMT-012

Historical assessment versions shall remain immutable.

---

# 33.8 Assessment Schedules

Schedules define assessment availability.

```text id="amt5"
assessment_schedules

------------------------------

id

assessment_id

start_datetime

end_datetime

time_zone

attempt_limit

schedule_status
```

Supports:

* Multiple examination windows
* Institution-specific schedules
* Make-up examinations
* Time-zone awareness

---

### AMT-013

Assessment schedules shall support multiple examination windows.

---

### AMT-014

Assessment availability shall respect configured time zones.

---

# 33.9 Assessment Question Mapping

Questions are associated with assessments through a mapping table.

```text id="amt6"
assessment_question_maps

------------------------------------

id

assessment_version_id

question_id

display_order

marks

mandatory
```

Benefits:

* Question reuse
* Randomization
* Blueprint alignment
* Version consistency

---

### AMT-015

Questions shall be linked through normalized mapping tables.

---

### AMT-016

Question ordering shall be configurable.

---

# 33.10 Assessment Attempts

Each learner interaction generates an attempt record.

```text id="amt7"
assessment_attempts

----------------------------

id

assessment_id

student_id

attempt_number

started_at

submitted_at

attempt_status
```

Tracks:

* Active attempts
* Completed attempts
* Interrupted attempts
* Timed-out attempts

---

### AMT-017

Every learner attempt shall be permanently recorded.

---

### AMT-018

Attempt numbering shall remain sequential per learner and assessment.

---

# 33.11 Assessment Submissions

Submission metadata is stored independently.

```text id="amt8"
assessment_submissions

--------------------------------

id

attempt_id

submission_type

submission_reference

submitted_at

integrity_hash
```

Submission Types:

* Online Response
* PDF Upload
* Video Submission
* Practical Checklist
* Clinical Recording

Large submission files are stored within external object storage.

---

### AMT-019

Submission metadata shall reference external storage locations.

---

### AMT-020

Submission integrity shall be validated using cryptographic hashes.

---

# 33.12 Assessment Grading

Grading information is normalized.

```text id="amt9"
assessment_grading

----------------------------

id

attempt_id

examiner_id

marks_awarded

grading_status

graded_at

remarks
```

Supports:

* Automatic grading
* Manual grading
* AI-assisted grading
* Moderation
* Re-evaluation

---

### AMT-021

Assessment grading shall support multiple evaluation workflows.

---

### AMT-022

Grade modifications shall remain fully auditable.

---

# 33.13 Assessment Rubrics

Rubrics standardize subjective evaluation.

```text id="amt10"
assessment_rubrics

---------------------------

id

assessment_id

criterion

maximum_marks

performance_level

display_order
```

Used for:

* Clinical examinations
* Viva
* Practical assessments
* Research presentations

---

### AMT-023

Rubrics shall support criterion-based evaluation.

---

### AMT-024

Rubric definitions shall remain version controlled.

---

# 33.14 Examiner Assignments

Faculty members evaluate learner performance.

```text id="amt11"
assessment_examiners

--------------------------------

id

assessment_id

faculty_id

examiner_role

assigned_at
```

Roles include:

* Primary Examiner
* Secondary Examiner
* Moderator
* External Examiner

---

### AMT-025

Assessments may have multiple examiners.

---

### AMT-026

Examiner assignments shall preserve historical records.

---

# 33.15 Assessment Results

Results summarize learner performance.

```text id="amt12"
assessment_results

----------------------------

id

attempt_id

percentage

grade

pass_status

published_at

result_status
```

Supports:

* Grade publication
* Appeals
* Re-evaluation
* Transcript generation

Results are derived from authoritative grading records.

---

### AMT-027

Assessment results shall be generated from validated grading data.

---

### AMT-028

Published results shall remain historically traceable.

---

# 33.16 Performance Considerations

Assessment processing is highly transactional during examination periods.

Optimization strategies include:

* Index assessment codes.
* Index student attempts.
* Partition historical attempt records.
* Cache published assessment metadata.
* Optimize grading queries.
* Archive completed examination sessions.

Assessment services shall meet enterprise performance objectives during peak examination periods.

---

### AMT-029

Assessment queries shall be optimized for concurrent examination workloads.

---

### AMT-030

Historical assessment data shall support archival without impacting operational performance.

---

# 33.17 Security & Compliance

Assessment data is highly sensitive.

Required controls:

* Role-Based Access Control (RBAC)
* Secure examination windows
* Audit logging
* Encryption at rest
* TLS encryption in transit
* Academic integrity controls
* Tamper detection
* Result publication approval workflows
* Regulatory compliance

Only authorized academic personnel may access unpublished assessment information.

---

### AMT-031

Assessment information shall be protected using enterprise security controls.

---

### AMT-032

Assessment modifications and grading activities shall be fully auditable.

---

# 33.18 Governance

Assessment Module governance includes:

* Examination Cell
* Curriculum Committee
* Academic Affairs
* Faculty Review Board
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* Examination review
* Security assessment
* Migration validation
* Documentation updates

---

### AMT-033

Assessment schema modifications require formal governance approval.

---

### AMT-034

Assessment documentation shall remain synchronized with implementation.

---

# 33.19 Traceability

This chapter defines the database design for the Assessment Module within the Mediverse platform.

**Related Documents**

* Chapter 31 – Course Module Tables
* Chapter 32 – Lesson Module Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Question Bank Module
* Progress Tracking Module
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Assessments
* Assessment Versions
* Assessment Schedules
* Question Mapping
* Assessment Attempts
* Assessment Submissions
* Assessment Grading
* Assessment Rubrics
* Examiner Assignments
* Assessment Results
* PostgreSQL Assessment Schema

---

# Chapter Summary

This chapter defines the Assessment Module database architecture for the Mediverse platform. It establishes normalized tables for assessments, version management, scheduling, question mappings, learner attempts, submissions, grading workflows, rubrics, examiner assignments, and result publication. By separating assessment configuration from learner execution, enforcing strong referential integrity, maintaining comprehensive audit trails, and applying enterprise governance and security controls, the Assessment Module provides a scalable, secure, and extensible foundation for evaluating learner competency across all educational and clinical training scenarios.

---

**End of Chapter 33**

**Next:** **Chapter 34 – Question Bank Tables**.

---

# Chapter 34 — Question Bank Tables

---

# Chapter Overview

This chapter defines the database design for the **Question Bank Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing reusable assessment questions, question versions, taxonomy classifications, answer options, explanations, media attachments, AI-generated questions, tagging, review workflows, and question lifecycle management.

The Question Bank serves as the centralized repository for all assessment content and supports question reuse across quizzes, examinations, assignments, OSCEs, adaptive assessments, and AI-powered learning systems.

---

# 34.1 Introduction

The Question Bank is one of the most critical academic repositories within the Mediverse platform. It enables educators to create, organize, review, and maintain a high-quality repository of assessment items while ensuring consistency, traceability, and version control.

The Question Bank manages:

* Question repository
* Question versions
* Question categories
* Difficulty levels
* Question types
* Answer choices
* Correct answers
* Explanations
* Media attachments
* Learning objective mappings
* AI-generated questions
* Review and approval workflow
* Question analytics

The module integrates with:

* Assessment Module
* Lesson Module
* Course Module
* AI Knowledge Base
* Analytics Module
* Progress Tracking
* Media Management

---

# 34.2 Objectives

The objectives of the Question Bank database are to:

* Maintain a centralized repository of assessment items.
* Enable question reuse across assessments.
* Support question versioning.
* Track academic review workflows.
* Maintain taxonomy classifications.
* Support multimedia questions.
* Enable AI-assisted question generation.
* Preserve historical revisions.
* Improve assessment quality.
* Support scalable academic content management.

---

### QBT-001

Every question shall possess a globally unique identifier.

---

### QBT-002

Question definitions shall remain independent from assessment instances.

---

# 34.3 Question Bank Domain Architecture

```text id="qbt1"
                  courses
                      │
                      ▼
                 question_bank
       ┌──────────┼───────────┬─────────────┐
       ▼          ▼           ▼             ▼
 versions     answers     taxonomy      media
       │          │           │             │
       ▼          ▼           ▼             ▼
 AI_content   reviews    learning_maps   analytics
```

The Question Bank provides reusable assessment assets that can be referenced by multiple assessments without duplication.

---

### QBT-003

Questions shall be managed independently from assessment delivery.

---

### QBT-004

Question entities shall support reuse across multiple academic contexts.

---

# 34.4 Schema Organization

The Question Bank resides within the **question_bank** schema.

```text id="qbt2"
question_bank

├── questions

├── question_versions

├── question_options

├── question_answers

├── question_taxonomy

├── question_media

├── question_learning_objectives

├── question_reviews

├── ai_generated_questions

└── question_tags
```

---

### QBT-005

Question-related tables shall reside within the dedicated **question_bank** schema.

---

### QBT-006

Schema ownership shall remain within the Assessment Content bounded context.

---

# 34.5 Entity Relationship Diagram

```text id="qbt3"
questions
    │
 ├──────────────┬──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
versions    options      answers     taxonomy
    │              │              │
    ▼              ▼              ▼
media      learning_objectives reviews
    │
    ▼
AI_generated_questions
    │
    ▼
question_tags
```

All supporting entities reference the **questions** table using UUID foreign keys.

---

### QBT-007

Every supporting entity shall reference the canonical question record.

---

### QBT-008

Referential integrity shall be enforced using UUID foreign keys.

---

# 34.6 Questions Table

The **questions** table stores the canonical assessment question.

| Column              | Type         |
| ------------------- | ------------ |
| id                  | UUID         |
| question_code       | VARCHAR(50)  |
| title               | VARCHAR(300) |
| question_text       | TEXT         |
| question_type_id    | UUID FK      |
| difficulty_level_id | UUID FK      |
| status_id           | UUID FK      |
| language_id         | UUID FK      |
| created_by          | UUID FK      |
| created_at          | TIMESTAMPTZ  |
| updated_at          | TIMESTAMPTZ  |

Supported Question Types:

* Single Choice
* Multiple Choice
* True/False
* Fill in the Blank
* Short Answer
* Long Answer
* Matching
* Ordering
* Image-Based
* Clinical Case
* OSCE Station
* Simulation Question

---

### QBT-009

Question codes shall remain unique within the enterprise.

---

### QBT-010

Question status shall reference enterprise lookup tables.

---

# 34.7 Question Versions

Question content evolves independently from assessments.

```text id="qbt4"
question_versions

----------------------------

id

question_id

version_number

effective_from

effective_to

published

change_summary
```

Supports:

* Medical guideline updates
* Editorial improvements
* Correction of errors
* Curriculum revisions
* Regulatory updates

Published versions remain immutable.

---

### QBT-011

Every published revision shall generate a new question version.

---

### QBT-012

Historical versions shall remain immutable.

---

# 34.8 Question Options

Objective question types require answer options.

```text id="qbt5"
question_options

--------------------------

id

question_id

option_label

option_text

display_order
```

Example:

| Label | Option         |
| ----- | -------------- |
| A     | Left Ventricle |
| B     | Right Atrium   |
| C     | Aorta          |
| D     | Pulmonary Vein |

Supports:

* Randomized ordering
* Rich-text options
* Multimedia options

---

### QBT-013

Answer options shall support configurable ordering.

---

### QBT-014

Option labels shall remain unique within each question.

---

# 34.9 Question Answers

Correct answers are maintained separately.

```text id="qbt6"
question_answers

---------------------------

id

question_id

correct_option_id

answer_text

partial_credit

explanation
```

Supports:

* Single correct answers
* Multiple correct answers
* Partial scoring
* Narrative explanations

---

### QBT-015

Correct answers shall remain separate from answer options.

---

### QBT-016

Partial credit rules shall support configurable grading policies.

---

# 34.10 Taxonomy Classification

Questions are classified according to educational frameworks.

```text id="qbt7"
question_taxonomy

----------------------------

id

question_id

blooms_level

competency

difficulty_score

clinical_domain
```

Supported frameworks:

* Bloom's Taxonomy
* Miller's Pyramid
* Competency-Based Medical Education (CBME)
* National Medical Commission (NMC) competencies

---

### QBT-017

Every question shall support standardized educational classification.

---

### QBT-018

Taxonomy classifications shall be centrally governed.

---

# 34.11 Question Media

Questions may include multimedia resources.

```text id="qbt8"
question_media

-----------------------

id

question_id

media_id

media_type

caption

display_order
```

Media Types:

* Image
* Audio
* Video
* Diagram
* X-ray
* MRI
* CT Scan
* Histology Slide
* ECG
* 3D Model

Actual media content is managed by the Media Management module.

---

### QBT-019

Question media shall reference enterprise media assets.

---

### QBT-020

Large media objects shall remain outside transactional storage.

---

# 34.12 Learning Objective Mapping

Questions are aligned with educational objectives.

```text id="qbt9"
question_learning_objectives

-----------------------------------------

id

question_id

learning_objective_id

mapping_strength
```

Benefits:

* Blueprint generation
* Competency tracking
* Curriculum alignment
* Gap analysis

---

### QBT-021

Questions shall support mappings to one or more learning objectives.

---

### QBT-022

Mappings shall remain traceable to authoritative curriculum definitions.

---

# 34.13 Review & Approval Workflow

Academic quality is ensured through structured review.

```text id="qbt10"
question_reviews

----------------------------

id

question_id

reviewer_id

review_status

review_comments

approved_at
```

Workflow:

```text id="qbt11"
Draft
  │
Peer Review
  │
Subject Expert Review
  │
Academic Approval
  │
Published
  │
Archived
```

---

### QBT-023

Only approved questions may be used in published assessments.

---

### QBT-024

Review history shall remain permanently auditable.

---

# 34.14 AI-Generated Questions

The platform supports AI-assisted question generation.

```text id="qbt12"
ai_generated_questions

-----------------------------------

id

question_id

ai_model_id

prompt_reference

confidence_score

generated_at

approved_by
```

Supports:

* Automatic MCQ generation
* Clinical case generation
* Adaptive difficulty
* Distractor generation
* Explanation generation

AI-generated questions require human academic approval before publication.

---

### QBT-025

AI-generated questions shall record model provenance and generation metadata.

---

### QBT-026

Human review shall be mandatory before operational use.

---

# 34.15 Question Tags

Tags improve searchability and content organization.

```text id="qbt13"
question_tags

-------------------

id

question_id

tag

category
```

Example tags:

* Cardiology
* Physiology
* Pediatrics
* Pharmacology
* Emergency Medicine
* High Yield
* Board Examination

Tags support:

* Search
* AI recommendations
* Blueprint creation
* Content discovery

---

### QBT-027

Question tags shall follow enterprise taxonomy standards.

---

### QBT-028

Tag management shall support extensible classification.

---

# 34.16 Performance Considerations

The Question Bank is a high-read, high-search repository.

Optimization strategies include:

* Index question codes.
* Index taxonomy fields.
* Optimize full-text search.
* Cache published questions.
* Store multimedia externally.
* Materialize frequently used reporting views.
* Partition historical review records.

Question retrieval shall remain performant for both assessment assembly and AI-assisted recommendations.

---

### QBT-029

Question retrieval queries shall be optimized for search-intensive workloads.

---

### QBT-030

Content indexing strategies shall support large-scale repositories.

---

# 34.17 Security & Compliance

Assessment content represents valuable institutional intellectual property.

Required controls:

* Role-Based Access Control (RBAC)
* Academic approval workflows
* Encryption at rest
* TLS encryption in transit
* Audit logging
* Version auditing
* Content ownership tracking
* Copyright protection
* Institutional publishing policies

Only authorized academic personnel may create, modify, approve, or publish assessment questions.

---

### QBT-031

Question Bank content shall be protected using enterprise security controls.

---

### QBT-032

Question modifications and approvals shall be fully auditable.

---

# 34.18 Governance

Question Bank governance includes:

* Subject Matter Experts (SMEs)
* Faculty Authors
* Academic Review Board
* Examination Cell
* Curriculum Committee
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic review
* SME approval
* Security validation
* Migration validation
* Documentation updates

---

### QBT-033

Question Bank schema modifications require formal governance approval.

---

### QBT-034

Question Bank documentation shall remain synchronized with implementation.

---

# 34.19 Traceability

This chapter defines the database design for the Question Bank Module within the Mediverse platform.

**Related Documents**

* Chapter 31 – Course Module Tables
* Chapter 32 – Lesson Module Tables
* Chapter 33 – Assessment Module Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* AI Knowledge Base Module
* Media Management Module
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Questions
* Question Versions
* Question Options
* Correct Answers
* Educational Taxonomy
* Media Attachments
* Learning Objective Mappings
* Review Workflow
* AI-Generated Questions
* Question Tags
* PostgreSQL Question Bank Schema

---

# Chapter Summary

This chapter defines the Question Bank Module database architecture for the Mediverse platform. It establishes normalized tables for questions, version management, answer options, correct answers, educational taxonomy, multimedia attachments, learning objective mappings, review workflows, AI-generated questions, and tagging. By separating reusable assessment content from assessment delivery, enforcing academic governance, maintaining complete version history, and supporting AI-assisted content creation, the Question Bank provides a scalable, secure, and extensible foundation for high-quality medical assessment across the platform.

---

---

# 34.10 Production DDL: Question Banks, NMC Competency Tags & Rationales

```sql
CREATE SCHEMA IF NOT EXISTS quiz;

CREATE TABLE quiz.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vignette_text TEXT NOT NULL,
  nmc_competency_code VARCHAR(30) NOT NULL, -- e.g. PY1.1, PY5.2, PY7.1
  bloom_taxonomy_level VARCHAR(30) NOT NULL, -- RECALL, COMPREHENSION, APPLICATION, ANALYSIS
  organ_system VARCHAR(50) NOT NULL,
  correct_option_index INT NOT NULL,
  explanation_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz.distractor_rationales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES quiz.questions(id) ON DELETE CASCADE,
  option_index INT NOT NULL,
  option_text TEXT NOT NULL,
  rationale TEXT NOT NULL
);
CREATE INDEX idx_questions_competency ON quiz.questions(nmc_competency_code);
```

**End of Chapter 34**

**Next:** **Chapter 35 – Progress Tracking Tables**.

---

# Chapter 35 — Progress Tracking Tables

---

# Chapter Overview

This chapter defines the database design for the **Progress Tracking Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for recording learner progress, lesson completion, course progression, competency achievement, learning streaks, milestones, adaptive learning recommendations, engagement metrics, and overall academic advancement.

The Progress Tracking Module serves as the authoritative source for measuring learner advancement throughout the educational lifecycle while providing real-time data for dashboards, analytics, AI recommendations, and certification eligibility.

---

# 35.1 Introduction

Progress tracking is fundamental to personalized medical education. It enables continuous monitoring of learner engagement, competency acquisition, and academic performance.

The Progress Tracking Module manages:

* Course progress
* Lesson completion
* Module completion
* Learning milestones
* Competency achievement
* Learning streaks
* Time spent learning
* AI learning recommendations
* Adaptive learning state
* Student dashboards
* Completion statistics

The module integrates with:

* Student Module
* Course Module
* Lesson Module
* Assessment Module
* Question Bank
* Certificate Module
* Analytics Module
* AI Knowledge Base

---

# 35.2 Objectives

The objectives of the Progress Tracking database are to:

* Monitor learner progression.
* Track lesson completion.
* Support competency-based education.
* Enable adaptive learning.
* Record learning engagement.
* Calculate completion metrics.
* Provide real-time dashboards.
* Support AI-driven recommendations.
* Maintain historical learning records.
* Ensure scalable performance.

---

### PTT-001

Every learner progress record shall reference a valid student.

---

### PTT-002

Progress data shall be derived from authoritative academic activities.

---

# 35.3 Progress Tracking Domain Architecture

```text id="ptt1"
                 students
                     │
                     ▼
             course_progress
        ┌──────────┼────────────┬────────────┐
        ▼          ▼            ▼            ▼
lesson_progress module_progress milestones competencies
        │          │            │
        ▼          ▼            ▼
learning_streaks engagement adaptive_learning
        │
        ▼
progress_summary
```

The architecture separates granular learning events from aggregated progress summaries.

---

### PTT-003

Progress tracking shall remain independent from instructional content management.

---

### PTT-004

Aggregated progress shall be derived from transactional learning events.

---

# 35.4 Schema Organization

The Progress Tracking Module resides within the **progress** schema.

```text id="ptt2"
progress

├── course_progress

├── module_progress

├── lesson_progress

├── competency_progress

├── learning_milestones

├── learning_streaks

├── engagement_metrics

├── adaptive_learning

├── progress_summary

└── learning_sessions
```

---

### PTT-005

Progress-related tables shall reside within the dedicated **progress** schema.

---

### PTT-006

Schema ownership shall remain within the Learning Analytics bounded context.

---

# 35.5 Entity Relationship Diagram

```text id="ptt3"
students
    │
    ▼
course_progress
    │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
module_progress lesson_progress competencies milestones
    │              │              │
    ▼              ▼              ▼
engagement   learning_sessions adaptive_learning
    │
    ▼
progress_summary
```

Every progress-related entity references the learner through UUID foreign keys.

---

### PTT-007

All progress entities shall reference the canonical student record.

---

### PTT-008

Referential integrity shall be enforced through UUID foreign keys.

---

# 35.6 Course Progress Table

The **course_progress** table tracks learner advancement at the course level.

| Column                | Type         |
| --------------------- | ------------ |
| id                    | UUID         |
| student_id            | UUID FK      |
| course_id             | UUID FK      |
| enrollment_id         | UUID FK      |
| completion_percentage | NUMERIC(5,2) |
| progress_status_id    | UUID FK      |
| started_at            | TIMESTAMPTZ  |
| completed_at          | TIMESTAMPTZ  |
| last_activity         | TIMESTAMPTZ  |

Business Rules:

* Completion percentage ranges from 0–100.
* Completion is calculated automatically.
* Manual updates are prohibited.
* Historical progress shall be retained.

---

### PTT-009

Course completion percentages shall be system-calculated.

---

### PTT-010

Progress status shall reference enterprise lookup tables.

---

# 35.7 Module Progress

Tracks learner completion at the instructional module level.

```text id="ptt4"
module_progress

-------------------------

id

student_id

module_id

completion_percentage

completed_lessons

last_accessed
```

Supports:

* Partial completion
* Sequential progression
* Adaptive learning paths

---

### PTT-011

Module progress shall be independently maintained.

---

### PTT-012

Module completion shall contribute to course completion.

---

# 35.8 Lesson Progress

Lesson completion is the primary transactional learning event.

```text id="ptt5"
lesson_progress

-------------------------

id

student_id

lesson_id

completion_status

time_spent_minutes

completed_at

last_position
```

Tracks:

* Started lessons
* Completed lessons
* Resume position
* Time spent

---

### PTT-013

Lesson completion shall be permanently recorded.

---

### PTT-014

Resume positions shall support interrupted learning sessions.

---

# 35.9 Competency Progress

Competency tracking aligns learning outcomes with learner achievement.

```text id="ptt6"
competency_progress

----------------------------

id

student_id

competency_id

achievement_level

achieved_at

verified_by
```

Supports:

* Competency-Based Medical Education (CBME)
* Clinical competencies
* Procedural skills
* Professional behaviors

---

### PTT-015

Competency achievement shall be independently measurable.

---

### PTT-016

Verified competencies shall identify the approving evaluator.

---

# 35.10 Learning Milestones

Milestones represent significant educational achievements.

```text id="ptt7"
learning_milestones

-----------------------------

id

student_id

milestone_type

milestone_name

achieved_at

awarded_by
```

Examples:

* First Course Completed
* Anatomy Mastery
* Clinical Rotation Completed
* 100 Learning Hours
* Research Module Completed

---

### PTT-017

Milestones shall remain permanently associated with learner records.

---

### PTT-018

Milestone definitions shall reference enterprise lookup values where applicable.

---

# 35.11 Learning Streaks

Learning streaks encourage consistent study habits.

```text id="ptt8"
learning_streaks

------------------------

student_id

current_streak

longest_streak

last_learning_date

streak_status
```

Supports:

* Daily learning streaks
* Weekly goals
* Achievement badges
* Motivation systems

---

### PTT-019

Learning streaks shall be calculated automatically.

---

### PTT-020

Streak calculations shall remain deterministic.

---

# 35.12 Engagement Metrics

Learner engagement is monitored for analytics.

```text id="ptt9"
engagement_metrics

----------------------------

student_id

total_learning_time

sessions_completed

videos_watched

simulations_completed

questions_attempted
```

Metrics support:

* Personalized recommendations
* Risk identification
* Faculty dashboards
* Institutional reporting

---

### PTT-021

Engagement metrics shall be derived from authoritative activity records.

---

### PTT-022

Engagement calculations shall support near real-time reporting.

---

# 35.13 Adaptive Learning

Adaptive learning recommendations are stored independently.

```text id="ptt10"
adaptive_learning

-----------------------------

student_id

recommended_lesson_id

recommendation_reason

confidence_score

generated_at

ai_model_id
```

Supports:

* Personalized lesson recommendations
* Knowledge gap remediation
* Difficulty adjustment
* AI tutoring

Recommendations remain advisory and do not modify academic records.

---

### PTT-023

Adaptive recommendations shall remain traceable to their generating AI model.

---

### PTT-024

Recommendation history shall be preserved for audit and analysis.

---

# 35.14 Learning Sessions

Learning sessions capture detailed interaction history.

```text id="ptt11"
learning_sessions

---------------------------

id

student_id

lesson_id

session_start

session_end

device_type

ip_address

completion_state
```

Supports:

* Session analytics
* Time-on-task calculations
* Resume functionality
* Device analytics

---

### PTT-025

Every learning session shall be uniquely identifiable.

---

### PTT-026

Session history shall support behavioral analytics.

---

# 35.15 Progress Summary

The **progress_summary** table stores denormalized reporting information.

```text id="ptt12"
progress_summary

--------------------------

student_id

courses_completed

lessons_completed

competencies_achieved

average_score

overall_completion

last_updated
```

Summary data is periodically synchronized from transactional progress records.

---

### PTT-027

Progress summaries shall be generated from authoritative transactional data.

---

### PTT-028

Summary tables shall not serve as the system of record.

---

# 35.16 Performance Considerations

The Progress Tracking Module experiences continuous read and write operations.

Optimization strategies include:

* Index student identifiers.
* Partition historical learning sessions.
* Cache progress summaries.
* Materialize dashboard views.
* Optimize completion calculation queries.
* Archive inactive learner histories.

Progress dashboards shall provide near real-time updates while maintaining transactional integrity.

---

### PTT-029

Progress queries shall be optimized for mixed read-write workloads.

---

### PTT-030

Large historical datasets shall support partitioning and archival strategies.

---

# 35.17 Security & Compliance

Progress data contains educational records and behavioral analytics.

Required controls:

* Role-Based Access Control (RBAC)
* Encryption at rest
* TLS encryption in transit
* Audit logging
* Data minimization
* Privacy controls
* Student consent management (where applicable)
* GDPR compliance
* FERPA-inspired educational privacy controls

Access to learner progress shall be limited to authorized users and services.

---

### PTT-031

Learner progress data shall be protected using enterprise security controls.

---

### PTT-032

Access to progress information shall be fully auditable.

---

# 35.18 Governance

Progress Tracking governance includes:

* Academic Affairs
* Learning Analytics Team
* Curriculum Committee
* Enterprise Data Governance Board
* Database Architecture Review Board
* AI Governance Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* Analytics validation
* Security assessment
* Migration validation
* Documentation updates

---

### PTT-033

Progress schema modifications require formal governance approval.

---

### PTT-034

Progress Tracking documentation shall remain synchronized with implementation.

---

# 35.19 Traceability

This chapter defines the database design for the Progress Tracking Module within the Mediverse platform.

**Related Documents**

* Chapter 29 – Student Module Tables
* Chapter 31 – Course Module Tables
* Chapter 32 – Lesson Module Tables
* Chapter 33 – Assessment Module Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* AI Knowledge Base Module
* Analytics Module
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Course Progress
* Module Progress
* Lesson Progress
* Competency Tracking
* Learning Milestones
* Learning Streaks
* Engagement Metrics
* Adaptive Learning
* Learning Sessions
* Progress Summary
* PostgreSQL Progress Schema

---

# Chapter Summary

This chapter defines the Progress Tracking Module database architecture for the Mediverse platform. It establishes normalized tables for course progress, module progress, lesson completion, competency achievement, learning milestones, learning streaks, engagement metrics, adaptive learning recommendations, learning sessions, and progress summaries. By separating transactional learning events from aggregated reporting data, enforcing strong referential integrity, supporting AI-driven personalization, and applying enterprise governance and security controls, the Progress Tracking Module provides a scalable, real-time, and extensible foundation for monitoring learner success throughout the educational journey.

---

**End of Chapter 35**

**Next:** **Chapter 36 – Certificate Tables**.

---

# Chapter 36 — Certificate Tables

---

# Chapter Overview

This chapter defines the database design for the **Certificate Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing certificate templates, certificate issuance, digital signatures, verification, credential lifecycle, badge management, revocation, expiration, continuing medical education (CME) credits, and certificate audit history.

The Certificate Module serves as the authoritative repository for all academic credentials issued by the platform and ensures authenticity, traceability, regulatory compliance, and long-term verification.

---

# 36.1 Introduction

Certificates represent formal recognition of a learner's academic achievement, competency, or professional development. The Certificate Module provides secure generation, storage, verification, and lifecycle management of digital credentials.

The Certificate Module manages:

* Certificate templates
* Certificate issuance
* Digital credentials
* Certificate verification
* Digital signatures
* QR code references
* Certificate revocation
* Badge issuance
* CME credit certificates
* Certificate lifecycle
* Audit history

The module integrates with:

* Student Module
* Course Module
* Assessment Module
* Progress Tracking Module
* Notification Module
* Media Management Module
* Analytics Module

---

# 36.2 Objectives

The objectives of the Certificate Module database are to:

* Maintain secure certificate records.
* Prevent duplicate issuance.
* Support digital verification.
* Enable QR-based validation.
* Track credential lifecycle.
* Support badge-based achievements.
* Preserve issuance history.
* Enable regulatory compliance.
* Support enterprise scalability.
* Maintain complete auditability.

---

### CET-001

Every certificate shall possess a globally unique identifier.

---

### CET-002

Certificates shall be generated only after successful eligibility validation.

---

# 36.3 Certificate Domain Architecture

```text id="cet1"
            students
                │
                ▼
        certificate_issuance
      ┌────────┼──────────┬─────────────┐
      ▼        ▼          ▼             ▼
templates signatures verification badges
      │        │          │
      ▼        ▼          ▼
revocation CME_credits audit_history
```

The architecture separates certificate definition, issuance, and verification to maintain security and flexibility.

---

### CET-003

Certificate templates shall remain independent from issued certificates.

---

### CET-004

Verification services shall operate independently of certificate generation.

---

# 36.4 Schema Organization

The Certificate Module resides within the **certificate** schema.

```text id="cet2"
certificate

├── certificate_templates

├── certificate_issuance

├── certificate_signatures

├── certificate_verification

├── certificate_badges

├── certificate_revocations

├── cme_certificates

├── certificate_audit_history

├── certificate_metadata

└── certificate_events
```

---

### CET-005

Certificate-related tables shall reside within the dedicated **certificate** schema.

---

### CET-006

Schema ownership shall remain within the Credential Management bounded context.

---

# 36.5 Entity Relationship Diagram

```text id="cet3"
certificate_templates
          │
          ▼
certificate_issuance
          │
 ├────────────┬─────────────┬──────────────┐
 ▼            ▼             ▼              ▼
signatures verification revocations badges
      │            │             │
      ▼            ▼             ▼
metadata      audit_history  CME_certificates
```

Every issued certificate references its originating template.

---

### CET-007

Issued certificates shall reference exactly one certificate template.

---

### CET-008

Referential integrity shall be enforced using UUID foreign keys.

---

# 36.6 Certificate Templates

The **certificate_templates** table stores reusable certificate layouts.

| Column              | Type         |
| ------------------- | ------------ |
| id                  | UUID         |
| template_code       | VARCHAR(50)  |
| template_name       | VARCHAR(200) |
| certificate_type_id | UUID FK      |
| institution_id      | UUID FK      |
| template_version    | INTEGER      |
| template_file_id    | UUID FK      |
| active              | BOOLEAN      |
| created_at          | TIMESTAMPTZ  |
| updated_at          | TIMESTAMPTZ  |

Certificate Types:

* Course Completion
* Competency Achievement
* CME Certificate
* Workshop Completion
* Clinical Rotation
* Faculty Recognition
* Research Participation

---

### CET-009

Template codes shall remain unique within an institution.

---

### CET-010

Template versions shall be immutable after activation.

---

# 36.7 Certificate Issuance

Issued certificates are stored separately from templates.

```text id="cet4"
certificate_issuance

----------------------------

id

certificate_number

student_id

template_id

course_id

issued_at

expiry_date

certificate_status
```

Status Values:

* Draft
* Issued
* Revoked
* Expired
* Replaced

Certificate numbers must be globally unique.

---

### CET-011

Each issued certificate shall have a globally unique certificate number.

---

### CET-012

Certificate issuance shall be idempotent for identical eligibility conditions.

---

# 36.8 Digital Signatures

Issued certificates include cryptographic signatures.

```text id="cet5"
certificate_signatures

--------------------------------

id

certificate_id

signature_algorithm

signature_hash

signed_by

signed_at
```

Supported algorithms:

* RSA-4096
* ECDSA
* Ed25519

Digital signatures ensure certificate authenticity.

---

### CET-013

Every issued certificate shall include a cryptographic signature.

---

### CET-014

Signature records shall be immutable after creation.

---

# 36.9 Certificate Verification

Verification enables external validation.

```text id="cet6"
certificate_verification

-----------------------------------

certificate_id

verification_token

qr_code_reference

verification_url

last_verified

verification_status
```

Verification supports:

* Public verification portal
* QR code scanning
* API verification
* Employer validation

---

### CET-015

Verification tokens shall be cryptographically secure.

---

### CET-016

Verification services shall not expose sensitive learner information.

---

# 36.10 Badge Management

Digital badges recognize micro-achievements.

```text id="cet7"
certificate_badges

----------------------------

id

student_id

badge_name

badge_level

earned_at

badge_status
```

Examples:

* Anatomy Expert
* AI Learning Champion
* Surgical Skills
* Clinical Excellence
* 100-Day Learning Streak

Badges complement but do not replace formal certificates.

---

### CET-017

Badge definitions shall be centrally governed.

---

### CET-018

Badge issuance shall be independently auditable.

---

# 36.11 Certificate Revocation

Revocation records maintain credential integrity.

```text id="cet8"
certificate_revocations

-----------------------------------

certificate_id

revoked_by

revocation_reason

revoked_at

replacement_certificate
```

Common reasons:

* Administrative correction
* Fraud detection
* Duplicate issuance
* Academic misconduct
* Regulatory requirement

---

### CET-019

Revoked certificates shall remain permanently recorded.

---

### CET-020

Revocation history shall never be physically deleted.

---

# 36.12 Continuing Medical Education (CME)

Medical professionals require continuing education tracking.

```text id="cet9"
cme_certificates

---------------------------

certificate_id

credit_hours

accreditation_body

license_reference

renewal_due_date
```

Supports:

* Medical Council credits
* Specialty Board credits
* Continuing Professional Development (CPD)

---

### CET-021

CME credit calculations shall follow accrediting body requirements.

---

### CET-022

CME records shall support regulatory reporting.

---

# 36.13 Certificate Metadata

Metadata supports search and reporting.

```text id="cet10"
certificate_metadata

----------------------------

certificate_id

language

generation_version

template_checksum

pdf_checksum

storage_reference
```

Metadata enables:

* Version tracking
* File integrity validation
* Storage optimization
* Document management

---

### CET-023

Certificate metadata shall support document integrity validation.

---

### CET-024

Generated certificate files shall be externally stored.

---

# 36.14 Certificate Audit History

All certificate events are audited.

```text id="cet11"
certificate_audit_history

---------------------------------------

id

certificate_id

event_type

performed_by

performed_at

event_details
```

Audited Events:

* Generated
* Signed
* Published
* Verified
* Downloaded
* Revoked
* Reissued

---

### CET-025

Certificate lifecycle events shall be permanently auditable.

---

### CET-026

Audit history shall support regulatory investigations.

---

# 36.15 Certificate Events

Operational events support asynchronous processing.

```text id="cet12"
certificate_events

---------------------------

id

certificate_id

event_name

event_payload

processed

processed_at
```

Supports:

* Notification generation
* PDF rendering
* QR generation
* Blockchain notarization (future)
* External integrations

---

### CET-027

Certificate events shall support event-driven architecture.

---

### CET-028

Failed event processing shall support retry mechanisms.

---

# 36.16 Performance Considerations

Certificate operations are primarily read-intensive after issuance.

Optimization strategies include:

* Index certificate numbers.
* Index verification tokens.
* Cache certificate verification results.
* Store PDFs in object storage.
* Archive expired certificates.
* Optimize verification queries.

Certificate verification shall complete with minimal latency while maintaining cryptographic integrity.

---

### CET-029

Certificate lookup queries shall be optimized for verification workloads.

---

### CET-030

Large certificate documents shall remain outside transactional storage.

---

# 36.17 Security & Compliance

Certificates represent legally significant academic credentials.

Required controls:

* Role-Based Access Control (RBAC)
* Digital signatures
* Encryption at rest
* TLS encryption in transit
* Secure key management
* Audit logging
* Tamper detection
* GDPR compliance
* Institutional credential policies

Private signing keys shall never be stored within application database tables.

---

### CET-031

Certificate data shall be protected using enterprise security controls.

---

### CET-032

Digital signing keys shall be managed through secure key management infrastructure.

---

# 36.18 Governance

Certificate Module governance includes:

* Academic Affairs
* Registrar's Office
* Credential Management Team
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* Security validation
* Regulatory review
* Migration validation
* Documentation updates

---

### CET-033

Certificate schema modifications require formal governance approval.

---

### CET-034

Certificate documentation shall remain synchronized with implementation.

---

# 36.19 Traceability

This chapter defines the database design for the Certificate Module within the Mediverse platform.

**Related Documents**

* Chapter 29 – Student Module Tables
* Chapter 31 – Course Module Tables
* Chapter 33 – Assessment Module Tables
* Chapter 35 – Progress Tracking Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Certificate Templates
* Certificate Issuance
* Digital Signatures
* Verification
* Digital Badges
* Revocation
* CME Certificates
* Certificate Audit History
* Certificate Metadata
* PostgreSQL Certificate Schema

---

# Chapter Summary

This chapter defines the Certificate Module database architecture for the Mediverse platform. It establishes normalized tables for certificate templates, certificate issuance, digital signatures, verification services, badge management, revocation records, CME certificates, metadata, audit history, and event processing. By separating certificate design from issuance, enforcing cryptographic authenticity, maintaining complete audit trails, and supporting enterprise governance and compliance requirements, the Certificate Module provides a secure, scalable, and verifiable foundation for issuing and managing digital academic credentials.

---

**End of Chapter 36**

**Next:** **Chapter 37 – Notification Tables**.

---

# Chapter 37 — Notification Tables

---

# Chapter Overview

This chapter defines the database design for the **Notification Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing notification templates, notification events, user preferences, delivery channels, message queues, delivery tracking, acknowledgements, retries, subscriptions, and notification audit history.

The Notification Module provides a centralized, event-driven communication framework for delivering timely and reliable notifications to students, faculty, administrators, and external stakeholders through multiple communication channels.

---

# 37.1 Introduction

The Notification Module enables the platform to communicate important academic, operational, and system events to users through configurable channels while ensuring reliability, scalability, personalization, and auditability.

The Notification Module manages:

* Notification templates
* Notification events
* User notification preferences
* Delivery channels
* Notification queues
* Delivery tracking
* Retry management
* User acknowledgements
* Topic subscriptions
* Notification audit history

The module integrates with:

* Student Module
* Faculty Module
* Course Module
* Assessment Module
* Certificate Module
* Analytics Module
* Authentication Module
* AI Knowledge Base

---

# 37.2 Objectives

The objectives of the Notification Module database are to:

* Centralize notification management.
* Support multiple delivery channels.
* Track notification delivery.
* Enable user preferences.
* Support event-driven communication.
* Improve notification reliability.
* Maintain delivery history.
* Support retry mechanisms.
* Enable scalable messaging.
* Ensure regulatory compliance.

---

### NTT-001

Every notification shall possess a globally unique identifier.

---

### NTT-002

Notification delivery shall be traceable from creation through final delivery status.

---

# 37.3 Notification Domain Architecture

```text id="ntt1"
                 notification_events
                        │
                        ▼
                  notifications
        ┌───────────┼──────────────┬───────────────┐
        ▼           ▼              ▼               ▼
templates    user_preferences   delivery_queue   subscriptions
        │           │              │
        ▼           ▼              ▼
delivery_logs acknowledgements retries
        │
        ▼
notification_audit
```

The architecture separates notification generation, delivery, and auditing to support asynchronous and scalable communication.

---

### NTT-003

Notification generation shall remain independent from delivery processing.

---

### NTT-004

Delivery processing shall support asynchronous execution.

---

# 37.4 Schema Organization

The Notification Module resides within the **notification** schema.

```text id="ntt2"
notification

├── notification_templates

├── notifications

├── notification_preferences

├── notification_delivery_queue

├── notification_delivery_logs

├── notification_acknowledgements

├── notification_retries

├── notification_subscriptions

├── notification_events

└── notification_audit_history
```

---

### NTT-005

Notification-related tables shall reside within the dedicated **notification** schema.

---

### NTT-006

Schema ownership shall remain within the Communication Services bounded context.

---

# 37.5 Entity Relationship Diagram

```text id="ntt3"
notification_events
         │
         ▼
notifications
         │
 ├──────────────┬───────────────┬───────────────┐
 ▼              ▼               ▼               ▼
templates   preferences    delivery_queue subscriptions
     │             │               │
     ▼             ▼               ▼
delivery_logs acknowledgements retries
     │
     ▼
audit_history
```

Every notification record references its originating event.

---

### NTT-007

Notification entities shall reference a valid notification event.

---

### NTT-008

Referential integrity shall be enforced using UUID foreign keys.

---

# 37.6 Notification Templates

The **notification_templates** table stores reusable message templates.

| Column           | Type         |
| ---------------- | ------------ |
| id               | UUID         |
| template_code    | VARCHAR(50)  |
| template_name    | VARCHAR(200) |
| channel_type_id  | UUID FK      |
| subject_template | VARCHAR(300) |
| body_template    | TEXT         |
| language_id      | UUID FK      |
| active           | BOOLEAN      |
| created_at       | TIMESTAMPTZ  |
| updated_at       | TIMESTAMPTZ  |

Supported Channels:

* Email
* SMS
* Push Notification
* In-App Notification
* WhatsApp
* Voice Notification

Templates support placeholder substitution using runtime variables.

---

### NTT-009

Template codes shall remain unique within the enterprise.

---

### NTT-010

Templates shall support localization and versioning.

---

# 37.7 Notifications

The **notifications** table stores notification instances generated from events.

```text id="ntt4"
notifications

-------------------------

id

event_id

recipient_id

template_id

priority

notification_status

scheduled_at

created_at
```

Notification Priorities:

* Low
* Normal
* High
* Critical
* Emergency

---

### NTT-011

Each notification shall reference exactly one recipient.

---

### NTT-012

Notification status shall reference enterprise lookup tables.

---

# 37.8 Notification Preferences

User preferences control notification delivery.

```text id="ntt5"
notification_preferences

--------------------------------

id

user_id

channel_type

enabled

quiet_hours_start

quiet_hours_end

preferred_language
```

Preferences include:

* Delivery channels
* Quiet hours
* Digest frequency
* Language preference
* Emergency notification overrides

---

### NTT-013

Users shall control notification preferences independently for each delivery channel.

---

### NTT-014

Critical emergency notifications may bypass configurable quiet hours according to institutional policy.

---

# 37.9 Notification Delivery Queue

Delivery processing is managed asynchronously.

```text id="ntt6"
notification_delivery_queue

--------------------------------------

id

notification_id

delivery_channel

queue_status

scheduled_time

worker_identifier

retry_count
```

Queue States:

* Pending
* Processing
* Delivered
* Failed
* Dead Letter Queue (DLQ)

---

### NTT-015

Notification delivery shall be queue-driven.

---

### NTT-016

Queue processing shall support horizontal scaling.

---

# 37.10 Notification Delivery Logs

Delivery outcomes are stored separately.

```text id="ntt7"
notification_delivery_logs

-----------------------------------

id

notification_id

channel

provider_name

provider_message_id

delivery_status

delivered_at

failure_reason
```

Tracks:

* Delivery confirmation
* Bounce events
* SMS provider responses
* Push delivery status
* Webhook callbacks

---

### NTT-017

Every delivery attempt shall be permanently recorded.

---

### NTT-018

Provider-specific metadata shall remain traceable.

---

# 37.11 Notification Acknowledgements

Certain notifications require user acknowledgement.

```text id="ntt8"
notification_acknowledgements

-------------------------------------------

id

notification_id

acknowledged_by

acknowledged_at

acknowledgement_status
```

Examples:

* Policy updates
* Examination schedules
* Academic warnings
* Consent requests

---

### NTT-019

Acknowledgement history shall remain permanently auditable.

---

### NTT-020

Acknowledgement status shall support compliance reporting.

---

# 37.12 Notification Retries

Failed deliveries are retried automatically.

```text id="ntt9"
notification_retries

-----------------------------

id

notification_id

retry_attempt

retry_time

retry_status

failure_reason
```

Retry Policy:

* Exponential backoff
* Maximum retry threshold
* Dead Letter Queue escalation
* Provider failover

---

### NTT-021

Retry policies shall be configurable.

---

### NTT-022

Exceeded retry limits shall trigger Dead Letter Queue processing.

---

# 37.13 Notification Subscriptions

Users subscribe to notification topics.

```text id="ntt10"
notification_subscriptions

--------------------------------------

id

user_id

topic_name

subscription_status

subscribed_at

unsubscribed_at
```

Example Topics:

* New Courses
* Assignment Deadlines
* Examination Results
* Faculty Announcements
* Platform Maintenance
* CME Updates

---

### NTT-023

Users shall manage topic subscriptions independently.

---

### NTT-024

Subscription history shall remain permanently auditable.

---

# 37.14 Notification Events

Notification events are generated by business processes.

```text id="ntt11"
notification_events

------------------------------

id

event_type

source_service

entity_type

entity_id

event_timestamp

payload_reference
```

Example Events:

* Course Published
* Lesson Completed
* Assessment Submitted
* Certificate Issued
* Password Reset
* New Faculty Assignment

These events initiate notification workflows.

---

### NTT-025

Business events shall remain immutable after publication.

---

### NTT-026

Event payloads shall support asynchronous processing.

---

# 37.15 Notification Audit History

All notification activities are audited.

```text id="ntt12"
notification_audit_history

----------------------------------------

id

notification_id

audit_event

performed_by

performed_at

audit_details
```

Audited Events:

* Created
* Scheduled
* Queued
* Delivered
* Failed
* Retried
* Acknowledged
* Cancelled

---

### NTT-027

Notification lifecycle events shall remain permanently auditable.

---

### NTT-028

Audit history shall support compliance investigations.

---

# 37.16 Performance Considerations

The Notification Module processes high volumes of asynchronous events.

Optimization strategies include:

* Index recipient identifiers.
* Index queue status.
* Partition delivery logs.
* Archive historical notifications.
* Cache notification templates.
* Batch notification processing.
* Optimize retry scheduling.

The delivery infrastructure shall support high-throughput messaging with minimal latency.

---

### NTT-029

Notification processing shall support high-concurrency workloads.

---

### NTT-030

Historical notification logs shall support partitioning and archival.

---

# 37.17 Security & Compliance

Notification data may contain personally identifiable and sensitive academic information.

Required controls:

* Role-Based Access Control (RBAC)
* Encryption at rest
* TLS encryption in transit
* Secure webhook validation
* Provider authentication
* Audit logging
* Data retention policies
* GDPR compliance
* Institutional communication policies

Sensitive message content shall be minimized and protected throughout the delivery lifecycle.

---

### NTT-031

Notification data shall be protected using enterprise security controls.

---

### NTT-032

Notification delivery shall comply with institutional privacy and communication policies.

---

# 37.18 Governance

Notification Module governance includes:

* Academic Affairs
* Communications Team
* IT Operations
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Functional approval
* Security validation
* Provider integration testing
* Migration validation
* Documentation updates

---

### NTT-033

Notification schema modifications shall require formal governance approval.

---

### NTT-034

Notification documentation shall remain synchronized with implementation.

---

# 37.19 Traceability

This chapter defines the database design for the Notification Module within the Mediverse platform.

**Related Documents**

* Chapter 29 – Student Module Tables
* Chapter 30 – Faculty Module Tables
* Chapter 33 – Assessment Module Tables
* Chapter 36 – Certificate Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Event-Driven Architecture Design
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Notification Templates
* Notification Instances
* User Preferences
* Delivery Queue
* Delivery Logs
* Acknowledgements
* Retry Management
* Topic Subscriptions
* Business Events
* Notification Audit History
* PostgreSQL Notification Schema

---

# Chapter Summary

This chapter defines the Notification Module database architecture for the Mediverse platform. It establishes normalized tables for notification templates, notification instances, user preferences, delivery queues, delivery logs, acknowledgements, retry management, subscriptions, business events, and audit history. By separating notification generation from delivery, supporting asynchronous event-driven processing, enforcing strong referential integrity, and applying enterprise-grade governance, security, and compliance controls, the Notification Module provides a scalable, reliable, and extensible foundation for platform-wide communications.

---

---

# 37.10 Production DDL: Simulation Laboratory State & Presets

```sql
CREATE SCHEMA IF NOT EXISTS simulations;

CREATE TABLE simulations.lab_definitions (
  id VARCHAR(50) PRIMARY KEY, -- cardiac-cycle, acid-base, renal-filtration, nerve-muscle
  title VARCHAR(255) NOT NULL,
  organ_system VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  default_parameters JSONB NOT NULL
);

CREATE TABLE simulations.user_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id VARCHAR(50) NOT NULL REFERENCES simulations.lab_definitions(id),
  preset_name VARCHAR(100) NOT NULL,
  parameter_values JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**End of Chapter 37**

**Next:** **Chapter 38 – Media Management Tables**.

---

# Chapter 38 — Media Management Tables

---

# Chapter Overview

This chapter defines the database design for the **Media Management Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing multimedia assets, file metadata, object storage references, image processing, video streaming metadata, 3D models, audio resources, document management, media versioning, content moderation, and lifecycle management.

The Media Management Module acts as the centralized Digital Asset Management (DAM) system for the entire platform, providing scalable storage abstraction, metadata management, media processing, and secure content delivery.

---

# 38.1 Introduction

Medical education depends heavily on rich multimedia content, including anatomical images, videos, 3D simulations, radiological scans, clinical recordings, interactive models, and educational documents.

The Media Management Module manages:

* Media assets
* Media versions
* Object storage references
* Image metadata
* Video metadata
* Audio metadata
* 3D model metadata
* Document metadata
* Thumbnail generation
* Media moderation
* Content lifecycle

The module integrates with:

* Lesson Module
* Course Module
* Question Bank
* Assessment Module
* AI Knowledge Base
* Certificate Module
* Notification Module
* Analytics Module

Actual binary files are stored in enterprise object storage. The relational database stores only metadata and references.

---

# 38.2 Objectives

The objectives of the Media Management database are to:

* Centralize media metadata.
* Separate metadata from binary content.
* Support multiple media types.
* Enable scalable object storage.
* Track media versions.
* Support AI indexing.
* Maintain audit history.
* Enable secure media delivery.
* Improve search capabilities.
* Support enterprise scalability.

---

### MMT-001

Every media asset shall possess a globally unique identifier.

---

### MMT-002

Binary media files shall never be stored directly within transactional database tables.

---

# 38.3 Media Domain Architecture

```text id="mmt1"
               media_assets
                    │
                    ▼
             media_versions
      ┌────────┼────────────┬─────────────┐
      ▼        ▼            ▼             ▼
images videos documents   audio
      │        │            │
      ▼        ▼            ▼
3D_models thumbnails moderation
      │
      ▼
object_storage
```

The architecture separates media metadata from physical storage and processing services.

---

### MMT-003

Media metadata shall remain independent from storage infrastructure.

---

### MMT-004

Media processing services shall operate asynchronously.

---

# 38.4 Schema Organization

The Media Management Module resides within the **media** schema.

```text id="mmt2"
media

├── media_assets

├── media_versions

├── media_images

├── media_videos

├── media_audio

├── media_documents

├── media_models_3d

├── media_thumbnails

├── media_moderation

└── object_storage_references
```

---

### MMT-005

Media-related tables shall reside within the dedicated **media** schema.

---

### MMT-006

Schema ownership shall remain within the Digital Asset Management bounded context.

---

# 38.5 Entity Relationship Diagram

```text id="mmt3"
media_assets
      │
 ├──────────────┬──────────────┬───────────────┐
 ▼              ▼              ▼               ▼
versions    images       videos         documents
 │              │              │
 ▼              ▼              ▼
audio     3D_models    thumbnails
 │
 ▼
moderation
 │
 ▼
object_storage
```

Every media-specific entity references the **media_assets** table.

---

### MMT-007

All media entities shall reference the canonical media asset.

---

### MMT-008

Referential integrity shall be enforced through UUID foreign keys.

---

# 38.6 Media Assets Table

The **media_assets** table stores metadata common to all asset types.

| Column        | Type         |
| ------------- | ------------ |
| id            | UUID         |
| media_code    | VARCHAR(50)  |
| media_name    | VARCHAR(300) |
| media_type_id | UUID FK      |
| mime_type     | VARCHAR(100) |
| owner_id      | UUID FK      |
| visibility_id | UUID FK      |
| status_id     | UUID FK      |
| created_at    | TIMESTAMPTZ  |
| updated_at    | TIMESTAMPTZ  |

Supported Media Types:

* Image
* Video
* Audio
* PDF
* Document
* 3D Model
* Presentation
* DICOM
* Animation

---

### MMT-009

Media codes shall remain globally unique.

---

### MMT-010

Media types shall reference enterprise lookup tables.

---

# 38.7 Media Versions

Every significant modification generates a new version.

```text id="mmt4"
media_versions

----------------------

id

media_id

version_number

storage_reference

checksum

created_at

created_by
```

Supports:

* File replacement
* Metadata updates
* AI enhancements
* Thumbnail regeneration

Published versions remain immutable.

---

### MMT-011

Every media revision shall generate a new version record.

---

### MMT-012

Historical versions shall remain immutable.

---

# 38.8 Image Metadata

Image-specific metadata is normalized.

```text id="mmt5"
media_images

---------------------

id

media_id

width

height

resolution

color_space

compression_format
```

Supports:

* PNG
* JPEG
* TIFF
* SVG
* WebP
* Medical images

---

### MMT-013

Image metadata shall be extracted automatically during upload.

---

### MMT-014

Image dimensions shall be validated before publication.

---

# 38.9 Video Metadata

Video properties are stored separately.

```text id="mmt6"
media_videos

----------------------

id

media_id

duration_seconds

frame_rate

resolution

codec

bitrate
```

Supports:

* MP4
* HLS
* DASH
* WebM
* Educational recordings

Streaming files remain within object storage.

---

### MMT-015

Video metadata shall support adaptive streaming.

---

### MMT-016

Video transcoding shall be processed asynchronously.

---

# 38.10 Audio Metadata

Audio assets support lectures and podcasts.

```text id="mmt7"
media_audio

---------------------

id

media_id

duration_seconds

sample_rate

channels

codec

language
```

Supports:

* MP3
* AAC
* WAV
* FLAC
* Speech synthesis
* Lecture recordings

---

### MMT-017

Audio metadata shall support multilingual educational content.

---

### MMT-018

Audio processing shall support transcription services.

---

# 38.11 Document Metadata

Documents include PDFs and educational materials.

```text id="mmt8"
media_documents

---------------------------

id

media_id

page_count

document_format

ocr_status

searchable_text_reference
```

Supports:

* PDF
* DOCX
* PPTX
* EPUB
* HTML
* Markdown

OCR processing enables searchable educational resources.

---

### MMT-019

Document metadata shall support OCR indexing.

---

### MMT-020

Searchable document content shall remain externally indexed.

---

# 38.12 3D Model Metadata

Interactive medical education relies on 3D assets.

```text id="mmt9"
media_models_3d

---------------------------

id

media_id

model_format

polygon_count

texture_count

animation_supported

viewer_configuration
```

Supported Formats:

* glTF
* GLB
* OBJ
* FBX
* STL
* USDZ

Supports:

* Anatomy models
* Surgical simulations
* Organ visualization
* AR/VR learning

---

### MMT-021

3D assets shall support WebGL-compatible delivery.

---

### MMT-022

Model metadata shall support runtime optimization.

---

# 38.13 Thumbnail Management

Thumbnails improve browsing performance.

```text id="mmt10"
media_thumbnails

--------------------------

id

media_id

thumbnail_size

thumbnail_reference

generated_at
```

Supported Sizes:

* Small
* Medium
* Large
* Retina
* Mobile

Thumbnails are generated automatically after upload.

---

### MMT-023

Thumbnail generation shall occur asynchronously.

---

### MMT-024

Thumbnail references shall remain version aware.

---

# 38.14 Media Moderation

Educational content undergoes quality review.

```text id="mmt11"
media_moderation

----------------------------

id

media_id

review_status

reviewed_by

reviewed_at

moderation_notes
```

Workflow:

```text id="mmt12"
Uploaded
    │
Virus Scan
    │
AI Content Scan
    │
Academic Review
    │
Published
```

Moderation includes:

* Malware scanning
* Copyright validation
* Academic review
* AI content safety
* Accessibility review

---

### MMT-025

Uploaded media shall complete moderation before publication.

---

### MMT-026

Moderation history shall remain permanently auditable.

---

# 38.15 Object Storage References

Physical storage information is maintained separately.

```text id="mmt13"
object_storage_references

------------------------------------

media_id

storage_provider

bucket_name

object_key

storage_region

storage_class

encryption_status
```

Supported Providers:

* Amazon S3
* Azure Blob Storage
* Google Cloud Storage
* MinIO
* Enterprise NAS

This abstraction allows migration between storage providers without changing application logic.

---

### MMT-027

Storage references shall abstract underlying storage providers.

---

### MMT-028

Object keys shall remain immutable after publication.

---

# 38.16 Performance Considerations

Media operations involve large datasets and high-throughput access.

Optimization strategies include:

* Index media codes.
* Cache frequently accessed metadata.
* Use CDN integration for media delivery.
* Store binaries exclusively in object storage.
* Partition audit and moderation history.
* Optimize metadata search indexes.
* Compress metadata responses where appropriate.

Media retrieval shall prioritize metadata queries while delegating binary delivery to optimized storage and content delivery infrastructure.

---

### MMT-029

Metadata retrieval shall be optimized independently of binary content delivery.

---

### MMT-030

Large media assets shall be served through object storage and CDN infrastructure.

---

# 38.17 Security & Compliance

Media assets may contain copyrighted educational content and sensitive clinical materials.

Required controls:

* Role-Based Access Control (RBAC)
* Encryption at rest
* TLS encryption in transit
* Secure object storage policies
* Signed URLs for protected assets
* Malware scanning
* Audit logging
* Digital rights management (where applicable)
* GDPR compliance
* Institutional content governance

Sensitive clinical media shall require explicit authorization before access.

---

### MMT-031

Media assets shall be protected using enterprise security controls.

---

### MMT-032

Protected media access shall support time-limited secure access mechanisms.

---

# 38.18 Governance

Media Management governance includes:

* Digital Content Team
* Faculty Authors
* Academic Review Board
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Digital Asset Management Team
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Academic approval
* Security review
* Storage validation
* Migration validation
* Documentation updates

---

### MMT-033

Media schema modifications shall require formal governance approval.

---

### MMT-034

Media Management documentation shall remain synchronized with implementation.

---

# 38.19 Traceability

This chapter defines the database design for the Media Management Module within the Mediverse platform.

**Related Documents**

* Chapter 31 – Course Module Tables
* Chapter 32 – Lesson Module Tables
* Chapter 33 – Assessment Module Tables
* Chapter 34 – Question Bank Tables
* Chapter 36 – Certificate Tables
* Chapter 37 – Notification Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Media Assets
* Media Versions
* Image Metadata
* Video Metadata
* Audio Metadata
* Document Metadata
* 3D Model Metadata
* Thumbnail Management
* Media Moderation
* Object Storage References
* PostgreSQL Media Schema

---

# Chapter Summary

This chapter defines the Media Management Module database architecture for the Mediverse platform. It establishes normalized tables for media assets, version management, image, video, audio, document, and 3D model metadata, thumbnail generation, moderation workflows, and object storage references. By separating metadata from binary content, supporting scalable object storage, enforcing strong governance and security controls, and enabling efficient search, streaming, and content delivery, the Media Management Module provides a robust and extensible foundation for managing digital educational assets across the platform.

---

**End of Chapter 38**

**Next:** **Chapter 39 – AI Knowledge Base Tables**.

---

# Chapter 39 — AI Knowledge Base Tables

---

# Chapter Overview

This chapter defines the database design for the **AI Knowledge Base Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for managing medical knowledge repositories, AI documents, embeddings, vector indexes, semantic chunks, Retrieval-Augmented Generation (RAG) metadata, prompt templates, AI conversations, knowledge versioning, model metadata, and knowledge governance.

The AI Knowledge Base Module serves as the foundation for all intelligent capabilities within Mediverse, enabling semantic search, AI tutoring, personalized learning, clinical reasoning assistance, automated content generation, and contextual question answering.

Unlike traditional relational modules, this module combines PostgreSQL metadata with enterprise vector databases to support modern Generative AI architectures.

---

# 39.1 Introduction

Artificial Intelligence is a core capability of the Mediverse platform. The AI Knowledge Base stores structured metadata describing educational knowledge while delegating semantic vector representations to specialized vector storage systems.

The AI Knowledge Base manages:

* Medical knowledge documents
* Knowledge chunks
* Vector embeddings
* AI prompt templates
* RAG indexes
* AI conversations
* Conversation history
* AI model registry
* Knowledge versions
* Citation metadata
* AI feedback
* Knowledge governance

The module integrates with:

* Course Module
* Lesson Module
* Question Bank
* Assessment Module
* Progress Tracking
* Analytics Module
* Media Management
* Notification Module

---

# 39.2 Objectives

The objectives of the AI Knowledge Base database are to:

* Centralize AI knowledge metadata.
* Support Retrieval-Augmented Generation (RAG).
* Enable semantic search.
* Manage AI prompt templates.
* Support multiple AI models.
* Preserve knowledge history.
* Enable explainable AI.
* Maintain citation traceability.
* Support enterprise AI governance.
* Ensure scalable AI infrastructure.

---

### AKT-001

Every knowledge asset shall possess a globally unique identifier.

---

### AKT-002

Semantic vectors shall remain external to transactional database tables.

---

# 39.3 AI Knowledge Domain Architecture

```text id="akt1"
              knowledge_documents
                       │
                       ▼
                knowledge_chunks
      ┌───────────┼────────────┬─────────────┐
      ▼           ▼            ▼             ▼
 embeddings   prompt_templates conversations citations
      │           │            │
      ▼           ▼            ▼
 vector_db   AI_models    feedback
      │
      ▼
 governance
```

The architecture separates structured metadata stored in PostgreSQL from semantic embeddings stored in enterprise vector databases.

---

### AKT-003

Knowledge metadata shall remain independent from vector storage.

---

### AKT-004

Vector search infrastructure shall support horizontal scalability.

---

# 39.4 Schema Organization

The AI Knowledge Base resides within the **ai** schema.

```text id="akt2"
ai

├── knowledge_documents

├── knowledge_versions

├── knowledge_chunks

├── embedding_metadata

├── prompt_templates

├── ai_models

├── ai_conversations

├── ai_feedback

├── citation_metadata

└── vector_indexes
```

---

### AKT-005

AI-related tables shall reside within the dedicated **ai** schema.

---

### AKT-006

Schema ownership shall remain within the AI Platform bounded context.

---

# 39.5 Entity Relationship Diagram

```text id="akt3"
knowledge_documents
        │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
versions     chunks      citations      prompts
      │             │              │
      ▼             ▼              ▼
embeddings   conversations   feedback
      │
      ▼
AI_models
      │
      ▼
vector_indexes
```

All supporting entities reference the **knowledge_documents** table through UUID foreign keys where applicable.

---

### AKT-007

Knowledge entities shall reference canonical knowledge documents.

---

### AKT-008

Referential integrity shall be enforced using UUID foreign keys.

---

# 39.6 Knowledge Documents

The **knowledge_documents** table stores logical knowledge assets.

| Column             | Type         |
| ------------------ | ------------ |
| id                 | UUID         |
| document_code      | VARCHAR(50)  |
| title              | VARCHAR(300) |
| knowledge_type_id  | UUID FK      |
| source_module      | VARCHAR(100) |
| language_id        | UUID FK      |
| publication_status | UUID FK      |
| owner_id           | UUID FK      |
| created_at         | TIMESTAMPTZ  |
| updated_at         | TIMESTAMPTZ  |

Knowledge Types:

* Medical Textbook
* Clinical Guideline
* Lesson Content
* Research Paper
* Faculty Notes
* AI Generated Content
* Standard Operating Procedure
* FAQ

---

### AKT-009

Document codes shall remain globally unique.

---

### AKT-010

Knowledge status shall reference enterprise lookup tables.

---

# 39.7 Knowledge Versions

Knowledge evolves continuously.

```text id="akt4"
knowledge_versions

--------------------------

id

document_id

version_number

effective_from

effective_to

published

change_summary
```

Supports:

* Medical guideline revisions
* Curriculum updates
* AI improvements
* Regulatory changes

Published versions remain immutable.

---

### AKT-011

Every published knowledge revision shall create a new version.

---

### AKT-012

Historical knowledge versions shall remain immutable.

---

# 39.8 Knowledge Chunks

Large documents are divided into semantic chunks.

```text id="akt5"
knowledge_chunks

--------------------------

id

document_id

chunk_number

chunk_text

token_count

embedding_reference
```

Chunking improves:

* Semantic search
* Context retrieval
* AI response quality
* Citation precision

---

### AKT-013

Knowledge chunk sizes shall follow enterprise AI standards.

---

### AKT-014

Chunk ordering shall remain deterministic.

---

# 39.9 Embedding Metadata

Embeddings are stored externally.

```text id="akt6"
embedding_metadata

----------------------------

id

chunk_id

embedding_model

vector_dimension

vector_identifier

generated_at
```

Supported Models:

* OpenAI Embeddings
* Sentence Transformers
* Instructor Models
* Medical Domain Models

Only metadata is stored in PostgreSQL.

---

### AKT-015

Vector embeddings shall reside within enterprise vector databases.

---

### AKT-016

Embedding metadata shall record model provenance.

---

# 39.10 Prompt Templates

Prompt engineering assets are managed centrally.

```text id="akt7"
prompt_templates

----------------------------

id

template_name

prompt_category

system_prompt

user_prompt

version

active
```

Prompt Categories:

* Tutor
* Clinical Assistant
* Quiz Generator
* Flashcard Generator
* Medical Explanation
* Differential Diagnosis
* Content Summarizer

---

### AKT-017

Prompt templates shall support version control.

---

### AKT-018

Prompt changes shall be fully auditable.

---

# 39.11 AI Models

Model metadata supports multiple AI providers.

```text id="akt8"
ai_models

--------------------

id

provider_name

model_name

model_version

deployment_region

capabilities

status
```

Supported Providers:

* OpenAI
* Azure OpenAI
* Anthropic
* Google Gemini
* Local LLM
* Enterprise Medical Models

---

### AKT-019

Model metadata shall support multi-provider deployments.

---

### AKT-020

Deprecated models shall remain historically traceable.

---

# 39.12 AI Conversations

Conversation history supports personalized learning.

```text id="akt9"
ai_conversations

----------------------------

id

student_id

conversation_title

started_at

ended_at

model_id

conversation_status
```

Conversation records support:

* AI tutor sessions
* Clinical reasoning practice
* Personalized learning
* Conversation continuity

Conversation messages may be stored in a dedicated child table if fine-grained message persistence is required.

---

### AKT-021

Conversation records shall support long-term learning history.

---

### AKT-022

Conversation metadata shall remain independent from AI inference logs.

---

# 39.13 AI Feedback

Learner feedback improves AI quality.

```text id="akt10"
ai_feedback

-----------------------

id

conversation_id

response_id

rating

feedback_type

comments

submitted_at
```

Supports:

* Helpful
* Incorrect
* Unsafe
* Incomplete
* Hallucination Report
* Suggestion

---

### AKT-023

Feedback shall support continuous AI improvement.

---

### AKT-024

Unsafe AI responses shall support escalation workflows.

---

# 39.14 Citation Metadata

Explainable AI requires traceable citations.

```text id="akt11"
citation_metadata

----------------------------

id

response_id

document_id

chunk_id

citation_score

display_order
```

Supports:

* Source attribution
* Medical guideline references
* Lesson citations
* Research references

This enables transparent and explainable AI responses.

---

### AKT-025

Every AI-generated educational response shall support citation traceability where applicable.

---

### AKT-026

Citation metadata shall reference authoritative knowledge assets.

---

# 39.15 Vector Index Metadata

Vector search indexes are managed separately.

```text id="akt12"
vector_indexes

-------------------------

id

index_name

provider

dimension

distance_metric

index_status

last_synced
```

Supported Metrics:

* Cosine Similarity
* Dot Product
* Euclidean Distance

Supports providers such as:

* pgvector
* Pinecone
* Weaviate
* Milvus
* Qdrant

---

### AKT-027

Vector indexes shall support synchronization monitoring.

---

### AKT-028

Index metadata shall remain independent from vector storage implementations.

---

# 39.16 Performance Considerations

AI systems require high-throughput semantic retrieval.

Optimization strategies include:

* Cache prompt templates.
* Cache frequently accessed document metadata.
* Batch embedding generation.
* Use asynchronous indexing pipelines.
* Maintain optimized vector indexes.
* Separate OLTP and AI workloads.
* Partition conversation history.

AI retrieval operations shall prioritize low-latency semantic search while protecting transactional database performance.

---

### AKT-029

Knowledge retrieval shall be optimized for semantic search workloads.

---

### AKT-030

AI indexing operations shall execute asynchronously.

---

# 39.17 Security & Compliance

AI systems process educational and potentially sensitive medical information.

Required controls:

* Role-Based Access Control (RBAC)
* Encryption at rest
* TLS encryption in transit
* Prompt access controls
* AI audit logging
* Model access governance
* PII masking
* GDPR compliance
* AI governance policies
* Responsible AI controls

Sensitive learner data shall not be embedded into reusable vector indexes unless explicitly permitted under institutional governance.

---

### AKT-031

AI knowledge assets shall be protected using enterprise security controls.

---

### AKT-032

AI operations shall comply with institutional Responsible AI policies.

---

# 39.18 Governance

AI Knowledge Base governance includes:

* AI Governance Committee
* Medical Subject Matter Experts
* Academic Affairs
* Enterprise Architecture Board
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* AI Platform Engineering Team
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Medical review
* AI safety validation
* Security assessment
* Model governance approval
* Migration validation
* Documentation updates

---

### AKT-033

AI schema modifications shall require formal governance approval.

---

### AKT-034

AI Knowledge Base documentation shall remain synchronized with implementation.

---

# 39.19 Traceability

This chapter defines the database design for the AI Knowledge Base Module within the Mediverse platform.

**Related Documents**

* Chapter 32 – Lesson Module Tables
* Chapter 33 – Assessment Module Tables
* Chapter 34 – Question Bank Tables
* Chapter 35 – Progress Tracking Tables
* Chapter 38 – Media Management Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Enterprise AI Architecture
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Knowledge Documents
* Knowledge Versions
* Semantic Chunks
* Embedding Metadata
* Prompt Templates
* AI Models
* AI Conversations
* AI Feedback
* Citation Metadata
* Vector Indexes
* PostgreSQL AI Schema

---

# Chapter Summary

This chapter defines the AI Knowledge Base Module database architecture for the Mediverse platform. It establishes normalized tables for knowledge documents, version management, semantic chunks, embedding metadata, prompt templates, AI model registry, conversation metadata, user feedback, citation metadata, and vector index management. By separating structured metadata from vector storage, supporting Retrieval-Augmented Generation (RAG), enabling explainable AI through citation tracking, and enforcing enterprise governance, security, and Responsible AI controls, the AI Knowledge Base Module provides a scalable, extensible, and trustworthy foundation for intelligent educational services across the platform.

---

---

# 39.10 Production DDL: pgvector 1536-D Vector Knowledge Base & Socratic AI Memory

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS aitutor;

CREATE TABLE aitutor.embeddings_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_source VARCHAR(255) NOT NULL, -- Guyton & Hall, Costanzo Physiology
  chapter_title VARCHAR(255) NOT NULL,
  section_heading VARCHAR(255) NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_embeddings_hnsw ON aitutor.embeddings_metadata USING hnsw (embedding vector_cosine_ops);

CREATE TABLE aitutor.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_context VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE aitutor.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES aitutor.sessions(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) NOT NULL, -- user, assistant, system
  message_text TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_session ON aitutor.messages(session_id, created_at ASC);
```

**End of Chapter 39**

**Next:** **Chapter 40 – Analytics & Reporting Tables**.

---

# Chapter 40 — Analytics & Reporting Tables

---

# Chapter Overview

This chapter defines the database design for the **Analytics & Reporting Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for collecting, aggregating, analyzing, and reporting educational, operational, AI, and system metrics. The module supports institutional dashboards, learner analytics, faculty performance, AI insights, business intelligence (BI), regulatory reporting, and executive decision-making.

Unlike transactional modules, the Analytics & Reporting Module primarily manages analytical metadata, reporting definitions, aggregated metrics, and data warehouse integration rather than serving as the authoritative source for operational data.

---

# 40.1 Introduction

Analytics transforms operational data into actionable insights for educators, administrators, and learners. The module consolidates information from across the platform to provide comprehensive reporting capabilities.

The Analytics & Reporting Module manages:

* Dashboard definitions
* Report catalog
* KPI definitions
* Data aggregation
* Student analytics
* Faculty analytics
* Course analytics
* Assessment analytics
* AI usage analytics
* Audit reports
* Scheduled reports
* Data warehouse synchronization

The module integrates with:

* Student Module
* Faculty Module
* Course Module
* Lesson Module
* Assessment Module
* Progress Tracking Module
* AI Knowledge Base
* Notification Module
* Audit Module

---

# 40.2 Objectives

The objectives of the Analytics & Reporting database are to:

* Centralize reporting metadata.
* Support enterprise dashboards.
* Enable real-time analytics.
* Maintain historical reporting.
* Support KPI monitoring.
* Enable executive reporting.
* Support regulatory compliance.
* Integrate with BI platforms.
* Improve institutional decision-making.
* Ensure scalable analytical processing.

---

### ART-001

Every report definition shall possess a globally unique identifier.

---

### ART-002

Analytical data shall not modify authoritative transactional records.

---

# 40.3 Analytics Domain Architecture

```text id="art1"
          Operational Modules
                  │
                  ▼
          Analytics Pipeline
                  │
        ┌─────────┼──────────┐
        ▼         ▼          ▼
 Aggregation   Data Mart   KPI Engine
        │         │          │
        ▼         ▼          ▼
 Dashboards Reports AI Insights
        │
        ▼
 Executive Analytics
```

Operational systems publish data to analytical pipelines where aggregated datasets are produced for reporting and visualization.

---

### ART-003

Analytics processing shall remain independent of transactional workloads.

---

### ART-004

Reporting services shall consume aggregated datasets whenever possible.

---

# 40.4 Schema Organization

The Analytics & Reporting Module resides within the **analytics** schema.

```text id="art2"
analytics

├── report_definitions

├── dashboard_definitions

├── report_executions

├── scheduled_reports

├── kpi_definitions

├── aggregated_metrics

├── student_analytics

├── faculty_analytics

├── ai_usage_analytics

└── data_warehouse_sync
```

---

### ART-005

Analytics-related tables shall reside within the dedicated **analytics** schema.

---

### ART-006

Schema ownership shall remain within the Business Intelligence bounded context.

---

# 40.5 Entity Relationship Diagram

```text id="art3"
report_definitions
        │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼
dashboards report_runs scheduled_reports
        │
        ▼
kpi_definitions
        │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼
student    faculty      AI_usage
analytics  analytics    analytics
        │
        ▼
aggregated_metrics
        │
        ▼
data_warehouse_sync
```

Analytical entities reference reporting metadata while consuming data from operational modules.

---

### ART-007

Analytical entities shall reference approved reporting definitions.

---

### ART-008

Referential integrity shall be enforced through UUID foreign keys where applicable.

---

# 40.6 Report Definitions

The **report_definitions** table stores reusable report metadata.

| Column          | Type         |
| --------------- | ------------ |
| id              | UUID         |
| report_code     | VARCHAR(50)  |
| report_name     | VARCHAR(250) |
| report_category | VARCHAR(100) |
| report_type     | VARCHAR(100) |
| sql_reference   | TEXT         |
| active          | BOOLEAN      |
| created_by      | UUID FK      |
| created_at      | TIMESTAMPTZ  |
| updated_at      | TIMESTAMPTZ  |

Supported Categories:

* Academic
* Faculty
* Student
* Assessment
* AI
* Security
* Operations
* Compliance

---

### ART-009

Report codes shall remain globally unique.

---

### ART-010

Report definitions shall remain version controlled.

---

# 40.7 Dashboard Definitions

Dashboards organize reports and KPIs.

```text id="art4"
dashboard_definitions

----------------------------

id

dashboard_name

dashboard_type

layout_configuration

visibility_scope

owner_id

status
```

Supported Dashboards:

* Student Dashboard
* Faculty Dashboard
* Dean Dashboard
* Administrator Dashboard
* Executive Dashboard
* AI Operations Dashboard

---

### ART-011

Dashboard layouts shall support configurable widgets.

---

### ART-012

Dashboard visibility shall follow RBAC policies.

---

# 40.8 Report Executions

Each report execution is tracked independently.

```text id="art5"
report_executions

-------------------------

id

report_id

requested_by

execution_start

execution_end

execution_status

output_reference
```

Execution metadata enables:

* Performance monitoring
* Historical analysis
* Troubleshooting
* Usage statistics

---

### ART-013

Every report execution shall be uniquely identifiable.

---

### ART-014

Report execution history shall remain permanently auditable.

---

# 40.9 Scheduled Reports

Reports may execute automatically.

```text id="art6"
scheduled_reports

-------------------------

id

report_id

schedule_expression

delivery_channel

next_execution

schedule_status
```

Delivery Channels:

* Email
* PDF
* Dashboard
* API
* Data Export

Scheduling supports cron-based and calendar-based execution.

---

### ART-015

Scheduled reports shall support recurring execution.

---

### ART-016

Scheduling changes shall be fully auditable.

---

# 40.10 KPI Definitions

KPIs define measurable institutional objectives.

```text id="art7"
kpi_definitions

----------------------

id

kpi_name

description

calculation_method

target_value

measurement_frequency
```

Example KPIs:

* Course Completion Rate
* Student Retention
* Faculty Productivity
* Assessment Pass Rate
* AI Tutor Adoption
* Platform Availability

---

### ART-017

KPI calculations shall be centrally governed.

---

### ART-018

KPI definitions shall remain version controlled.

---

# 40.11 Aggregated Metrics

Aggregated metrics provide optimized reporting.

```text id="art8"
aggregated_metrics

-------------------------

id

metric_name

aggregation_level

metric_value

aggregation_period

generated_at
```

Aggregation Levels:

* Hourly
* Daily
* Weekly
* Monthly
* Quarterly
* Yearly

These records are derived from transactional systems.

---

### ART-019

Aggregated metrics shall never replace authoritative transactional records.

---

### ART-020

Aggregation jobs shall be repeatable and deterministic.

---

# 40.12 Student Analytics

Student-specific analytical metrics are maintained separately.

```text id="art9"
student_analytics

------------------------

student_id

courses_completed

average_score

engagement_score

competency_index

dropout_risk_score
```

Supports:

* Learning analytics
* Risk prediction
* Performance dashboards
* AI recommendations

---

### ART-021

Student analytical metrics shall be derived from validated operational data.

---

### ART-022

Predictive scores shall include model provenance where applicable.

---

# 40.13 Faculty Analytics

Faculty performance is analyzed separately.

```text id="art10"
faculty_analytics

------------------------

faculty_id

courses_taught

average_student_rating

assessment_turnaround

research_index

teaching_hours
```

Supports:

* Faculty evaluation
* Academic planning
* Workload optimization
* Institutional reporting

---

### ART-023

Faculty metrics shall support longitudinal performance analysis.

---

### ART-024

Faculty analytical records shall preserve historical trends.

---

# 40.14 AI Usage Analytics

AI operations generate extensive analytical information.

```text id="art11"
ai_usage_analytics

--------------------------

model_id

requests_processed

average_latency

token_usage

citation_rate

feedback_score
```

Supports monitoring of:

* AI adoption
* Response quality
* Infrastructure utilization
* Model performance
* Cost optimization

---

### ART-025

AI usage metrics shall support operational monitoring and optimization.

---

### ART-026

AI analytical data shall support Responsible AI governance.

---

# 40.15 Data Warehouse Synchronization

Operational data is synchronized into analytical storage.

```text id="art12"
data_warehouse_sync

---------------------------

id

source_system

target_dataset

sync_started

sync_completed

sync_status

records_processed
```

Supports:

* ETL
* ELT
* Incremental synchronization
* Full refresh
* Change Data Capture (CDC)

Synchronization shall be idempotent and recoverable.

---

### ART-027

Warehouse synchronization shall support incremental processing.

---

### ART-028

Synchronization failures shall support automatic recovery mechanisms.

---

# 40.16 Performance Considerations

Analytics workloads differ significantly from transactional workloads.

Optimization strategies include:

* Separate OLTP and OLAP workloads.
* Materialize reporting views.
* Partition historical analytical datasets.
* Cache dashboard metadata.
* Optimize aggregation jobs.
* Utilize read replicas for reporting.
* Employ columnar storage where appropriate for analytical systems.

Reporting operations shall not negatively impact operational platform performance.

---

### ART-029

Analytical workloads shall remain isolated from transactional workloads.

---

### ART-030

Historical analytical datasets shall support efficient partitioning and archival.

---

# 40.17 Security & Compliance

Analytical data may include aggregated educational and operational information.

Required controls:

* Role-Based Access Control (RBAC)
* Row-Level Security (RLS) where applicable
* Encryption at rest
* TLS encryption in transit
* Audit logging
* Data masking
* Privacy-preserving aggregation
* GDPR compliance
* Institutional reporting policies

Personally identifiable information shall be minimized in analytical datasets whenever feasible.

---

### ART-031

Analytical data shall be protected using enterprise security controls.

---

### ART-032

Reporting access shall comply with institutional privacy requirements.

---

# 40.18 Governance

Analytics & Reporting governance includes:

* Institutional Leadership
* Academic Affairs
* Business Intelligence Team
* AI Governance Committee
* Enterprise Data Governance Board
* Database Architecture Review Board
* Database Administration Team
* Security Review Committee
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Business approval
* Data governance validation
* Security assessment
* Performance testing
* Documentation updates

---

### ART-033

Analytics schema modifications shall require formal governance approval.

---

### ART-034

Analytics documentation shall remain synchronized with implementation.

---

# 40.19 Traceability

This chapter defines the database design for the Analytics & Reporting Module within the Mediverse platform.

**Related Documents**

* Chapter 29 – Student Module Tables
* Chapter 30 – Faculty Module Tables
* Chapter 33 – Assessment Module Tables
* Chapter 35 – Progress Tracking Tables
* Chapter 37 – Notification Tables
* Chapter 39 – AI Knowledge Base Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Enterprise Data Warehouse Architecture
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Report Definitions
* Dashboard Definitions
* Report Executions
* Scheduled Reports
* KPI Definitions
* Aggregated Metrics
* Student Analytics
* Faculty Analytics
* AI Usage Analytics
* Data Warehouse Synchronization
* PostgreSQL Analytics Schema

---

# Chapter Summary

This chapter defines the Analytics & Reporting Module database architecture for the Mediverse platform. It establishes normalized tables for report definitions, dashboard configurations, report execution history, scheduled reporting, KPI definitions, aggregated metrics, student analytics, faculty analytics, AI usage analytics, and data warehouse synchronization. By separating analytical workloads from transactional processing, supporting enterprise business intelligence, enabling predictive insights, and enforcing robust governance, security, and compliance controls, the Analytics & Reporting Module provides a scalable and extensible foundation for institutional decision-making and continuous platform optimization.

---

**End of Chapter 40**

**Next:** **Chapter 41 – Audit & Logging Tables**.

---

# Chapter 41 — Audit & Logging Tables

---

# Chapter Overview

This chapter defines the database design for the **Audit & Logging Module** of the **Mediverse – AI-Powered Medical Education Platform**. It specifies the relational schema responsible for capturing immutable audit trails, application logs, security events, database changes, API activity, user actions, compliance records, and operational diagnostics.

The Audit & Logging Module provides enterprise-grade observability, accountability, regulatory compliance, forensic investigation, and operational monitoring while ensuring that audit records remain tamper-evident, immutable, and highly scalable.

Unlike operational modules, this module primarily stores historical event metadata and references to centralized logging platforms.

---

# 41.1 Introduction

Every significant business, security, and system event generated within Mediverse must be traceable. The Audit & Logging Module provides a centralized mechanism for recording these events without affecting transactional business processes.

The Audit & Logging Module manages:

* Audit events
* User activity logs
* Authentication logs
* Authorization logs
* API access logs
* Database audit logs
* System event logs
* Security incident logs
* Error logs
* Log retention policies
* Compliance audit records
* Log archival

The module integrates with:

* Identity & Authentication Module
* User Management Module
* Student Module
* Faculty Module
* Assessment Module
* AI Knowledge Base
* Notification Module
* Analytics Module
* Infrastructure Monitoring

---

# 41.2 Objectives

The objectives of the Audit & Logging database are to:

* Capture immutable audit records.
* Maintain complete event traceability.
* Support forensic investigations.
* Enable regulatory compliance.
* Record security events.
* Track data modifications.
* Support centralized observability.
* Enable operational troubleshooting.
* Improve platform security.
* Ensure long-term retention.

---

### ALT-001

Every audit record shall possess a globally unique identifier.

---

### ALT-002

Audit records shall be immutable after creation.

---

# 41.3 Audit Domain Architecture

```text id="alt1"
          Application Services
                  │
                  ▼
            Audit Publisher
                  │
      ┌───────────┼────────────┬──────────────┐
      ▼           ▼            ▼              ▼
 Audit Logs  Security Logs API Logs   System Logs
      │           │            │
      ▼           ▼            ▼
 Database Audit Compliance Logs Error Logs
      │
      ▼
 Central Log Platform
```

The architecture separates event generation from long-term audit storage through asynchronous publishing mechanisms.

---

### ALT-003

Audit event generation shall remain independent of business transactions.

---

### ALT-004

Audit publishing shall support asynchronous processing.

---

# 41.4 Schema Organization

The Audit & Logging Module resides within the **audit** schema.

```text id="alt2"
audit

├── audit_events

├── user_activity_logs

├── authentication_logs

├── authorization_logs

├── api_access_logs

├── database_audit_logs

├── security_incidents

├── system_logs

├── error_logs

└── log_retention_policies
```

---

### ALT-005

Audit-related tables shall reside within the dedicated **audit** schema.

---

### ALT-006

Schema ownership shall remain within the Enterprise Observability bounded context.

---

# 41.5 Entity Relationship Diagram

```text id="alt3"
audit_events
      │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
user_logs   auth_logs    API_logs    DB_logs
      │              │              │
      ▼              ▼              ▼
security_logs   system_logs   error_logs
      │
      ▼
retention_policies
```

Audit entities are logically related through correlation identifiers rather than strict foreign-key relationships for maximum scalability.

---

### ALT-007

Audit events shall support cross-service correlation identifiers.

---

### ALT-008

Audit schemas shall prioritize write performance while preserving traceability.

---

# 41.6 Audit Events

The **audit_events** table stores canonical audit records.

| Column          | Type         |
| --------------- | ------------ |
| id              | UUID         |
| correlation_id  | UUID         |
| event_type      | VARCHAR(100) |
| entity_type     | VARCHAR(100) |
| entity_id       | UUID         |
| actor_id        | UUID         |
| action          | VARCHAR(100) |
| event_timestamp | TIMESTAMPTZ  |
| source_service  | VARCHAR(100) |
| created_at      | TIMESTAMPTZ  |

Typical Events:

* CREATE
* UPDATE
* DELETE
* LOGIN
* LOGOUT
* EXPORT
* DOWNLOAD
* APPROVE
* PUBLISH

---

### ALT-009

Every business event shall generate a corresponding audit record where required by policy.

---

### ALT-010

Correlation identifiers shall enable distributed request tracing.

---

# 41.7 User Activity Logs

User interactions are recorded independently.

```text id="alt4"
user_activity_logs

-----------------------------

id

user_id

activity_type

resource_type

resource_id

ip_address

device_type

occurred_at
```

Supports tracking of:

* Course access
* Lesson viewing
* Assessment attempts
* Certificate downloads
* AI tutor interactions

---

### ALT-011

User activity shall support chronological reconstruction.

---

### ALT-012

Activity history shall support behavioral analytics.

---

# 41.8 Authentication Logs

Authentication events are retained separately.

```text id="alt5"
authentication_logs

------------------------------

id

user_id

authentication_method

login_result

ip_address

device_fingerprint

occurred_at
```

Authentication Methods:

* Password
* OAuth
* SSO
* MFA
* API Token

---

### ALT-013

Authentication attempts shall be permanently recorded.

---

### ALT-014

Failed authentication attempts shall support security monitoring.

---

# 41.9 Authorization Logs

Authorization decisions are independently audited.

```text id="alt6"
authorization_logs

-----------------------------

id

user_id

resource

permission

decision

policy_reference

occurred_at
```

Supports:

* Allow
* Deny
* Conditional Access
* Elevated Access

---

### ALT-015

Authorization decisions shall be auditable.

---

### ALT-016

Policy evaluations shall remain historically traceable.

---

# 41.10 API Access Logs

Every API request is logged.

```text id="alt7"
api_access_logs

-------------------------

id

request_id

endpoint

http_method

response_code

response_time_ms

client_application

occurred_at
```

Supports:

* Performance analysis
* API monitoring
* Security investigations
* SLA reporting

---

### ALT-017

API requests shall include unique request identifiers.

---

### ALT-018

API latency metrics shall support operational monitoring.

---

# 41.11 Database Audit Logs

Critical database modifications are recorded.

```text id="alt8"
database_audit_logs

-------------------------------

id

table_name

operation

primary_key

before_state_reference

after_state_reference

performed_by

occurred_at
```

Operations:

* INSERT
* UPDATE
* DELETE
* BULK UPDATE
* BULK DELETE

Large before/after payloads may be stored externally with references.

---

### ALT-019

Database audit logs shall capture critical data modifications.

---

### ALT-020

Historical database states shall support forensic investigations.

---

# 41.12 Security Incident Logs

Security-related events receive enhanced auditing.

```text id="alt9"
security_incidents

----------------------------

id

incident_type

severity

affected_resource

detected_by

status

reported_at
```

Examples:

* Brute Force Attack
* SQL Injection Attempt
* Privilege Escalation
* Data Exfiltration
* Malware Detection
* Suspicious Login

---

### ALT-021

Security incidents shall support incident lifecycle management.

---

### ALT-022

Incident severity shall follow enterprise classification standards.

---

# 41.13 System Logs

Infrastructure and platform events are stored separately.

```text id="alt10"
system_logs

----------------------

id

service_name

host_identifier

log_level

message_reference

occurred_at

environment
```

Supported Levels:

* TRACE
* DEBUG
* INFO
* WARN
* ERROR
* FATAL

---

### ALT-023

System logging shall support centralized aggregation.

---

### ALT-024

Infrastructure identifiers shall enable distributed diagnostics.

---

# 41.14 Error Logs

Application exceptions are normalized.

```text id="alt11"
error_logs

---------------------

id

exception_class

error_code

stack_trace_reference

request_id

service_name

occurred_at
```

Supports:

* Exception monitoring
* Root cause analysis
* Error trending
* Reliability engineering

Stack traces are externally stored for large payloads.

---

### ALT-025

Application exceptions shall support centralized analysis.

---

### ALT-026

Error trends shall support proactive reliability improvements.

---

# 41.15 Log Retention Policies

Retention policies govern lifecycle management.

```text id="alt12"
log_retention_policies

----------------------------------

id

log_category

retention_period_days

archive_required

legal_hold_supported

purge_strategy
```

Example Policies:

| Log Type | Retention |
| -------- | --------- |
| Security | 7 Years   |
| Audit    | 10 Years  |
| API      | 1 Year    |
| Error    | 180 Days  |
| Debug    | 30 Days   |

---

### ALT-027

Retention policies shall comply with institutional and regulatory requirements.

---

### ALT-028

Expired logs shall follow approved archival and purge procedures.

---

# 41.16 Performance Considerations

Audit workloads are characterized by high write throughput and long retention periods.

Optimization strategies include:

* Append-only storage patterns.
* Partition audit tables by date.
* Compress archived logs.
* Index correlation identifiers.
* Archive historical partitions.
* Stream logs to centralized observability platforms.
* Separate hot and cold storage.

Operational systems shall remain unaffected by audit logging workloads.

---

### ALT-029

Audit logging shall minimize impact on transactional performance.

---

### ALT-030

Historical audit data shall support efficient partitioning and archival.

---

# 41.17 Security & Compliance

Audit records contain sensitive operational information.

Required controls:

* Role-Based Access Control (RBAC)
* Write-once (append-only) storage
* Encryption at rest
* TLS encryption in transit
* Tamper detection
* Digital integrity verification
* Immutable storage policies
* GDPR compliance
* HIPAA-ready audit controls
* Institutional retention policies

Access to audit information shall be strictly restricted to authorized personnel.

---

### ALT-031

Audit records shall be protected using enterprise security controls.

---

### ALT-032

Audit information shall support tamper-evident storage mechanisms.

---

# 41.18 Governance

Audit & Logging governance includes:

* Security Operations Center (SOC)
* Compliance Office
* Internal Audit Team
* Enterprise Data Governance Board
* Database Architecture Review Board
* Security Review Committee
* Site Reliability Engineering (SRE)
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Security approval
* Compliance validation
* Performance testing
* Migration validation
* Documentation updates

---

### ALT-033

Audit schema modifications shall require formal governance approval.

---

### ALT-034

Audit documentation shall remain synchronized with implementation.

---

# 41.19 Traceability

This chapter defines the database design for the Audit & Logging Module within the Mediverse platform.

**Related Documents**

* Chapter 26 – Identity & Authentication Tables
* Chapter 27 – User Management Tables
* Chapter 33 – Assessment Module Tables
* Chapter 37 – Notification Tables
* Chapter 39 – AI Knowledge Base Tables
* Chapter 40 – Analytics & Reporting Tables
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Enterprise Observability Architecture
* Entity Relationship Diagram (ERD)
* Architecture Decision Records (ADR)

**Applies To**

* Audit Events
* User Activity Logs
* Authentication Logs
* Authorization Logs
* API Access Logs
* Database Audit Logs
* Security Incident Logs
* System Logs
* Error Logs
* Log Retention Policies
* PostgreSQL Audit Schema

---

# Chapter Summary

This chapter defines the Audit & Logging Module database architecture for the Mediverse platform. It establishes normalized tables for audit events, user activity logs, authentication and authorization logs, API access logs, database audit records, security incidents, system logs, application errors, and log retention policies. By implementing immutable audit trails, append-only logging strategies, distributed correlation identifiers, comprehensive retention policies, and enterprise-grade governance and security controls, the Audit & Logging Module provides a scalable, compliant, and trustworthy foundation for observability, regulatory compliance, operational diagnostics, and forensic investigations.

---

**End of Chapter 41**

**Next:** **Chapter 42 – Relationship Design**.

---

# Chapter 42 — Relationship Design

---

# Chapter Overview

This chapter defines the relationship design strategy for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes how entities interact, how referential integrity is maintained, and how relationships are modeled across schemas while ensuring scalability, consistency, normalization, and performance.

Relationship Design is one of the most critical aspects of enterprise database architecture because it guarantees data consistency while supporting complex business workflows across authentication, education, AI, analytics, media, notifications, certificates, and auditing.

---

# 42.1 Introduction

A relational database is fundamentally a network of interconnected entities. Every business operation within Mediverse depends upon well-defined relationships between those entities.

Examples include:

* Students enroll in courses.
* Courses contain lessons.
* Lessons contain assessments.
* Assessments contain questions.
* Students submit assessment attempts.
* Progress generates certificates.
* AI references knowledge documents.
* Notifications reference business events.
* Audit records reference user actions.

The relationship model ensures:

* Data consistency
* Referential integrity
* Controlled redundancy
* Efficient querying
* Business rule enforcement
* Enterprise scalability

---

# 42.2 Objectives

The objectives of Relationship Design are to:

* Define entity relationships.
* Maintain referential integrity.
* Reduce data redundancy.
* Improve query performance.
* Support future scalability.
* Simplify maintenance.
* Enable modular schemas.
* Prevent orphan records.
* Support enterprise governance.
* Improve data quality.

---

### RDT-001

Every business relationship shall be explicitly modeled.

---

### RDT-002

Relationships shall accurately reflect business domain rules.

---

# 42.3 Relationship Design Principles

The Mediverse database follows these core principles:

1. Strong normalization
2. Explicit foreign keys
3. UUID-based relationships
4. Minimal redundancy
5. Optional denormalization for analytics
6. Immutable historical records
7. Business-driven modeling
8. Schema independence
9. Referential consistency
10. Performance-aware relationships

---

### RDT-003

Relationships shall prioritize business correctness over implementation convenience.

---

### RDT-004

Cross-module relationships shall remain loosely coupled whenever feasible.

---

# 42.4 Relationship Classification

Mediverse supports four primary relationship types.

```text id="rdt1"
One-to-One (1:1)

User
 │
 ▼
User Profile
```

```text id="rdt2"
One-to-Many (1:N)

Course
 │
 ├── Lesson 1
 ├── Lesson 2
 ├── Lesson 3
```

```text id="rdt3"
Many-to-Many (M:N)

Student
   │
Enrollment
   │
Course
```

```text id="rdt4"
Self-Referencing

Category
    │
    ├── Anatomy
    ├── Physiology
    └── Histology
```

---

### RDT-005

Relationship types shall reflect actual business cardinality.

---

### RDT-006

Many-to-many relationships shall always be resolved through junction tables.

---

# 42.5 Core Relationship Matrix

| Parent Entity       | Child Entity        | Relationship |
| ------------------- | ------------------- | ------------ |
| Users               | User Profiles       | 1 : 1        |
| Users               | Roles               | M : N        |
| Students            | Enrollments         | 1 : N        |
| Courses             | Lessons             | 1 : N        |
| Lessons             | Assessments         | 1 : N        |
| Assessments         | Questions           | 1 : N        |
| Students            | Assessment Attempts | 1 : N        |
| Certificates        | Certificate Audit   | 1 : N        |
| Media Assets        | Media Versions      | 1 : N        |
| Knowledge Documents | Knowledge Chunks    | 1 : N        |

This matrix represents the foundational relationships used across the platform.

---

### RDT-007

Relationship matrices shall be maintained as architectural artifacts.

---

### RDT-008

Business relationship changes shall undergo architectural review.

---

# 42.6 One-to-One Relationships

One-to-one relationships separate optional or security-sensitive data from core entities.

Example:

```text id="rdt5"
users
  │
  ▼
user_profiles
```

Common examples:

* User → Profile
* User → Preferences
* Student → Academic Record
* Faculty → Professional Profile

Advantages:

* Better modularity
* Reduced NULL values
* Improved security
* Independent lifecycle

---

### RDT-009

One-to-one relationships shall use unique foreign keys.

---

### RDT-010

Dependent entities shall not exist without their parent entity.

---

# 42.7 One-to-Many Relationships

Most enterprise entities use one-to-many relationships.

Example:

```text id="rdt6"
Course
 │
 ├── Lesson
 ├── Lesson
 ├── Lesson
```

Examples:

* Course → Lessons
* Lesson → Learning Resources
* Assessment → Questions
* Student → Certificates
* Student → Notifications

These relationships are implemented using foreign keys.

---

### RDT-011

Child entities shall reference exactly one parent entity unless explicitly documented.

---

### RDT-012

Parent deletion behavior shall follow defined cascade policies.

---

# 42.8 Many-to-Many Relationships

Many-to-many relationships require junction tables.

Example:

```text id="rdt7"
Students
     │
Enrollments
     │
Courses
```

Other examples:

* Faculty ↔ Courses
* Users ↔ Roles
* Students ↔ Badges
* Courses ↔ Tags
* AI Models ↔ Knowledge Sources

Typical junction table structure:

```text id="rdt8"
student_course

student_id

course_id

enrolled_at

status
```

---

### RDT-013

Junction tables shall possess their own audit metadata.

---

### RDT-014

Duplicate relationship records shall be prevented through unique constraints.

---

# 42.9 Self-Referencing Relationships

Hierarchical structures use self-referencing foreign keys.

Example:

```text id="rdt9"
Medical Categories

Human Anatomy
      │
 ├── Musculoskeletal
 ├── Cardiovascular
 └── Nervous System
```

Examples include:

* Course categories
* Lesson hierarchies
* Organizational units
* Medical taxonomy
* Knowledge graph hierarchies

---

### RDT-015

Self-referencing entities shall prevent cyclic dependencies.

---

### RDT-016

Recursive relationships shall support hierarchical queries.

---

# 42.10 Cross-Schema Relationships

The Mediverse database is divided into bounded contexts.

```text id="rdt10"
identity
     │
student
     │
course
     │
lesson
     │
assessment
     │
certificate
     │
notification
     │
analytics
```

Cross-schema relationships are permitted only when:

* Business ownership is clear.
* Referential integrity is required.
* Performance impact is acceptable.
* Coupling remains manageable.

---

### RDT-017

Cross-schema foreign keys shall be minimized.

---

### RDT-018

Bounded contexts shall retain independent ownership of their data.

---

# 42.11 Relationship Naming Standards

Foreign key naming follows a consistent convention.

Examples:

```text
student_id

course_id

lesson_id

assessment_id

certificate_id

notification_id
```

Constraint naming:

```text
fk_student_course

fk_course_lesson

fk_lesson_assessment

fk_assessment_question
```

Indexes:

```text
idx_student_course

idx_lesson_course

idx_assessment_lesson
```

---

### RDT-019

Relationship naming shall follow enterprise naming conventions.

---

### RDT-020

Constraint names shall remain globally unique within the database.

---

# 42.12 Cardinality Rules

Cardinality determines the minimum and maximum participation of entities.

Examples:

```text id="rdt11"
Student
   │1
   │
   │N
Enrollment
```

```text id="rdt12"
Course
   │1
   │
   │N
Lesson
```

Participation Types:

* Mandatory
* Optional
* Exclusive
* Shared

Business rules determine participation constraints.

---

### RDT-021

Cardinality shall accurately reflect business requirements.

---

### RDT-022

Optional relationships shall explicitly allow NULL foreign keys where appropriate.

---

# 42.13 Relationship Integrity Rules

Relationship integrity is enforced through:

* Foreign keys
* Unique constraints
* Check constraints
* NOT NULL constraints
* Business validations
* Application services

Integrity violations must be prevented at multiple architectural layers.

---

### RDT-023

Relationship integrity shall be enforced by the database.

---

### RDT-024

Application validation shall complement—not replace—database integrity rules.

---

# 42.14 Relationship Performance

Relationship design directly influences database performance.

Optimization strategies include:

* Index all foreign keys.
* Avoid unnecessary joins.
* Normalize transactional data.
* Denormalize reporting data selectively.
* Partition large relationship tables.
* Optimize junction tables.
* Use covering indexes where appropriate.

Relationship queries shall remain performant under enterprise-scale workloads.

---

### RDT-025

Foreign key columns shall be indexed unless explicitly exempted.

---

### RDT-026

Relationship-intensive queries shall be performance tested.

---

# 42.15 Relationship Governance

Relationship modifications require enterprise governance.

Governance participants:

* Enterprise Architecture Board
* Database Architecture Review Board
* Data Governance Council
* Academic Domain Experts
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)

Required reviews:

* Impact analysis
* Migration assessment
* Performance validation
* Security review
* Documentation updates

---

### RDT-027

Relationship modifications shall undergo formal architectural review.

---

### RDT-028

Relationship documentation shall remain synchronized with implemented schemas.

---

# 42.16 Traceability

This chapter defines enterprise relationship design standards for the Mediverse platform.

**Related Documents**

* Chapter 14 – Entity Relationship Diagram (ERD)
* Chapter 19 – Primary Key Strategy
* Chapter 20 – Foreign Key Strategy
* Chapter 22 – Constraints Design
* Chapter 46 – Indexing Strategy
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* One-to-One Relationships
* One-to-Many Relationships
* Many-to-Many Relationships
* Self-Referencing Relationships
* Cross-Schema Relationships
* Relationship Naming
* Cardinality Rules
* Referential Integrity
* PostgreSQL Enterprise Database

---

# Chapter Summary

This chapter establishes the enterprise relationship design principles for the Mediverse database. It defines standardized relationship types, cardinality rules, junction table patterns, cross-schema interactions, naming conventions, integrity enforcement, and governance processes. By modeling business relationships explicitly, enforcing referential integrity through UUID-based foreign keys, optimizing relationship performance, and applying consistent architectural standards, the Mediverse platform achieves a scalable, maintainable, and highly consistent relational data model suitable for enterprise medical education systems.

---

---

# 42.10 Production DDL: IMS Global LTI 1.3 Advantage Interoperability

```sql
CREATE SCHEMA IF NOT EXISTS lti;

CREATE TABLE lti.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  client_id VARCHAR(255) NOT NULL,
  deployment_id VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  oidc_auth_url VARCHAR(500) NOT NULL,
  jwks_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_lti_deployment UNIQUE (issuer, client_id, deployment_id)
);

CREATE TABLE lti.grade_passbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES lti.deployments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL,
  score_given NUMERIC(5,2) NOT NULL,
  score_maximum NUMERIC(5,2) NOT NULL,
  line_item_url VARCHAR(500) NOT NULL,
  status VARCHAR(30) NOT NULL, -- PENDING, SUCCESS, FAILED
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**End of Chapter 42**

**Next:** **Chapter 43 – Cascading Strategy**.

---

# Chapter 43 — Cascading Strategy

---

# Chapter Overview

This chapter defines the enterprise cascading strategy for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes standardized policies governing how changes to parent records affect related child records while preserving referential integrity, regulatory compliance, historical traceability, and business continuity.

The cascading strategy ensures that delete, update, archive, restore, and lifecycle operations behave consistently across all database schemas without causing unintended data loss or integrity violations.

---

# 43.1 Introduction

Cascading operations automatically propagate changes from a parent entity to its related child entities according to predefined business rules. An inappropriate cascading strategy may result in accidental deletion of critical academic records, orphaned data, or regulatory non-compliance.

For an enterprise medical education platform, cascading decisions are driven primarily by business rules rather than technical convenience.

Examples include:

* Deleting a course must not remove completed student certificates.
* Removing a faculty assignment must preserve historical teaching records.
* Revoking a certificate must retain audit history.
* Deleting a notification must not remove audit logs.
* Archiving a lesson must preserve assessment attempts.

The database therefore adopts a controlled, policy-driven cascading approach.

---

# 43.2 Objectives

The objectives of the cascading strategy are to:

* Preserve referential integrity.
* Prevent accidental data loss.
* Support historical traceability.
* Maintain regulatory compliance.
* Protect academic records.
* Support soft deletion.
* Enable controlled archival.
* Simplify maintenance.
* Improve database consistency.
* Support enterprise governance.

---

### CST-001

Cascade operations shall be governed by documented business rules.

---

### CST-002

No cascade operation shall violate regulatory or audit requirements.

---

# 43.3 Cascading Design Principles

The Mediverse platform follows these principles:

1. Business-first cascading.
2. Historical records are immutable.
3. Audit data is never cascade deleted.
4. Prefer soft delete over physical delete.
5. Restrict deletion of master data.
6. Cascade only where lifecycle ownership exists.
7. Preserve academic evidence.
8. Protect AI learning history.
9. Archive before purge.
10. Maintain complete traceability.

---

### CST-003

Cascade rules shall prioritize preservation of business records.

---

### CST-004

Destructive cascade operations shall be explicitly justified during architecture review.

---

# 43.4 Supported Cascade Actions

The database supports the following referential actions.

| Action      | Description                                              |
| ----------- | -------------------------------------------------------- |
| CASCADE     | Automatically propagate the operation to child rows.     |
| RESTRICT    | Prevent the operation if dependent records exist.        |
| NO ACTION   | Validate constraints at transaction completion.          |
| SET NULL    | Remove the reference while preserving the child record.  |
| SET DEFAULT | Replace the foreign key with a predefined default value. |

Selection of an action depends on business ownership and data retention requirements.

---

### CST-005

Every foreign key shall explicitly define its referential action.

---

### CST-006

Default database behavior shall not be relied upon for cascade semantics.

---

# 43.5 Delete Cascade Strategy

Physical deletion is highly restricted.

The following entities **shall not** be physically deleted:

* Students
* Faculty
* Courses with enrollments
* Assessment attempts
* Certificates
* Audit records
* AI conversations
* Medical knowledge
* Notification history

Instead, records transition through lifecycle states such as:

* Active
* Inactive
* Archived
* Soft Deleted

Example:

```text id="cst1"
Course
 │
 ├── Lessons
 ├── Assessments
 └── Enrollments
```

Deleting the course is **restricted** while dependent academic records exist.

---

### CST-007

Business-critical entities shall use soft deletion instead of physical deletion.

---

### CST-008

Cascade delete shall be prohibited for historical academic records.

---

# 43.6 Update Cascade Strategy

Primary identifiers use immutable UUIDs and therefore are never updated.

However, update propagation may apply to:

* Lookup values
* Reference codes
* Configuration entities
* Organizational metadata

Example:

```text id="cst2"
Country
    │
    └── Institution
```

If a country code changes under controlled governance, dependent metadata may be synchronized.

---

### CST-009

Primary key values shall remain immutable.

---

### CST-010

Update cascades shall be limited to approved reference entities.

---

# 43.7 Soft Delete Strategy

Soft deletion preserves records while removing them from normal business operations.

Typical structure:

```text id="cst3"
is_deleted

deleted_at

deleted_by

deletion_reason
```

Soft-deleted records:

* Remain queryable for audit purposes.
* Are excluded from operational queries.
* May be restored through authorized administrative processes.

---

### CST-011

Soft deletion shall retain complete audit history.

---

### CST-012

Operational queries shall exclude soft-deleted records by default.

---

# 43.8 Archive Cascade Strategy

Older records transition to archival storage rather than deletion.

Examples:

* Completed assessments
* Historical notifications
* Expired sessions
* AI interaction history
* Analytics snapshots
* Archived media metadata

Archive workflow:

```text id="cst4"
Active
   │
Inactive
   │
Archived
   │
Cold Storage
```

Archival maintains referential consistency while reducing operational database size.

---

### CST-013

Archival shall preserve logical relationships between entities.

---

### CST-014

Archived records shall remain recoverable according to retention policies.

---

# 43.9 Parent-Child Ownership Rules

Cascade behavior depends upon ownership.

| Parent          | Child               | Cascade Policy                   |
| --------------- | ------------------- | -------------------------------- |
| Course          | Lesson              | CASCADE (logical lifecycle only) |
| Lesson          | Media Mapping       | CASCADE                          |
| Student         | Assessment Attempts | RESTRICT                         |
| Student         | Certificates        | RESTRICT                         |
| User            | Sessions            | CASCADE                          |
| Notification    | Delivery Attempts   | CASCADE                          |
| Certificate     | Audit History       | RESTRICT                         |
| AI Conversation | Feedback            | CASCADE                          |
| Report          | Scheduled Jobs      | CASCADE                          |

Ownership implies that the child entity has no independent business meaning outside its parent.

---

### CST-015

Cascade operations shall follow documented ownership relationships.

---

### CST-016

Shared business entities shall never be cascade deleted.

---

# 43.10 Cross-Schema Cascade Rules

Cross-schema cascades require special consideration.

```text id="cst5"
identity
     │
student
     │
course
     │
assessment
     │
certificate
```

Policies:

* Avoid deep cascading chains.
* Minimize cross-schema deletes.
* Prefer application-managed orchestration.
* Validate all downstream dependencies.

---

### CST-017

Cross-schema cascade operations shall be minimized.

---

### CST-018

Complex lifecycle operations shall be orchestrated by application services.

---

# 43.11 Audit Preservation Rules

Audit information is immutable.

Examples:

```text id="cst6"
Student
    │
Assessment Attempt
    │
Audit Log
```

Even if an operational entity becomes inactive, audit information remains permanently available.

Audit records shall never participate in cascade deletion.

---

### CST-019

Audit entities shall never use ON DELETE CASCADE.

---

### CST-020

Historical audit evidence shall remain permanently preserved.

---

# 43.12 Cascade Decision Matrix

| Relationship                  | Delete                 | Update    |
| ----------------------------- | ---------------------- | --------- |
| User → Session                | CASCADE                | NO ACTION |
| User → Profile                | CASCADE                | NO ACTION |
| Student → Enrollment          | RESTRICT               | NO ACTION |
| Course → Lesson               | RESTRICT (Soft Delete) | NO ACTION |
| Lesson → Media Mapping        | CASCADE                | NO ACTION |
| Assessment → Questions        | RESTRICT               | NO ACTION |
| Certificate → Verification    | CASCADE                | NO ACTION |
| Notification → Delivery Queue | CASCADE                | NO ACTION |
| AI Document → Chunks          | CASCADE                | NO ACTION |
| Audit → Child Records         | RESTRICT               | NO ACTION |

This matrix shall serve as the enterprise reference for referential actions.

---

### CST-021

Cascade matrices shall be maintained as controlled architectural artifacts.

---

### CST-022

Changes to cascade policies shall require architectural review.

---

# 43.13 Performance Considerations

Improper cascade chains may create long-running transactions and lock contention.

Optimization strategies include:

* Avoid deep cascade hierarchies.
* Use batch archival processes.
* Partition historical data.
* Limit cascade depth.
* Monitor cascade execution plans.
* Prefer asynchronous cleanup for large datasets.

Large-scale lifecycle operations should execute during controlled maintenance windows where practical.

---

### CST-023

Cascade operations shall be performance tested for high-volume scenarios.

---

### CST-024

Bulk lifecycle operations shall support controlled execution and recovery.

---

# 43.14 Security & Compliance

Cascade operations may affect regulated educational records.

Required controls:

* Role-Based Access Control (RBAC)
* Approval workflows for destructive actions
* Immutable audit logging
* Legal hold support
* Data retention enforcement
* GDPR compliance
* Institutional academic record policies

Every destructive operation shall generate an audit event with the initiating user, timestamp, affected entities, and business justification.

---

### CST-025

Cascade operations shall be fully auditable.

---

### CST-026

Destructive operations shall require appropriate authorization and approval.

---

# 43.15 Governance

Cascading policies are governed by:

* Enterprise Architecture Board
* Database Architecture Review Board
* Data Governance Council
* Academic Affairs
* Compliance Office
* Security Review Committee
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Business impact assessment
* Data retention review
* Security validation
* Performance assessment
* Migration planning
* Documentation updates

---

### CST-027

Cascade policy modifications shall require formal governance approval.

---

### CST-028

Cascade documentation shall remain synchronized with implemented database constraints.

---

# 43.16 Traceability

This chapter defines enterprise cascading standards for the Mediverse platform.

**Related Documents**

* Chapter 20 – Foreign Key Strategy
* Chapter 22 – Constraints Design
* Chapter 41 – Audit & Logging Tables
* Chapter 42 – Relationship Design
* Chapter 44 – Referential Integrity
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Delete Cascades
* Update Cascades
* Soft Delete Policies
* Archive Strategies
* Parent-Child Ownership
* Cross-Schema Relationships
* Referential Actions
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise cascading strategy for the Mediverse database. It establishes standardized policies for delete, update, archive, and soft-delete operations while ensuring that academic records, audit trails, AI knowledge, and regulatory data remain protected throughout their lifecycle. By adopting business-driven ownership rules, minimizing destructive cascade operations, preserving historical information, and enforcing governance over referential actions, the Mediverse platform achieves a secure, compliant, and maintainable database architecture suitable for enterprise-scale medical education.

---

**End of Chapter 43**

**Next:** **Chapter 44 – Referential Integrity**.

---

# Chapter 44 — Referential Integrity

---

# Chapter Overview

This chapter defines the **Referential Integrity Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes the enterprise rules, constraints, validation mechanisms, and governance processes that ensure every relationship between database entities remains valid, consistent, and trustworthy throughout the entire data lifecycle.

Referential Integrity (RI) guarantees that relationships between records remain accurate by preventing orphan records, invalid references, inconsistent updates, and unauthorized modifications. It forms one of the foundational pillars of enterprise relational database architecture.

---

# 44.1 Introduction

The Mediverse platform consists of hundreds of interconnected entities spanning multiple business domains, including identity management, student information, courses, assessments, AI services, certificates, analytics, notifications, media assets, and auditing.

Maintaining referential integrity ensures that:

* Every foreign key references a valid parent record.
* Child records cannot exist independently of required parent records.
* Business relationships remain consistent.
* Historical records preserve traceability.
* Database operations comply with enterprise governance.

Referential integrity is enforced through a combination of:

* Foreign key constraints
* Unique constraints
* Check constraints
* Application validation
* Transaction management
* Controlled cascading strategies

---

# 44.2 Objectives

The objectives of Referential Integrity are to:

* Maintain relationship consistency.
* Prevent orphan records.
* Enforce business rules.
* Protect historical records.
* Support transactional consistency.
* Improve database reliability.
* Enable enterprise scalability.
* Simplify maintenance.
* Support regulatory compliance.
* Preserve data quality.

---

### RIT-001

Every foreign key shall reference an existing parent record.

---

### RIT-002

No business entity shall violate defined referential integrity rules.

---

# 44.3 Referential Integrity Principles

The Mediverse platform follows these principles:

1. Every relationship is explicit.
2. Parent records are authoritative.
3. Child records depend upon valid parents.
4. Business rules override technical convenience.
5. Historical integrity is preserved.
6. UUIDs are immutable.
7. Constraints are database-enforced.
8. Validation occurs at multiple layers.
9. Integrity failures terminate transactions.
10. Governance controls structural changes.

---

### RIT-003

Referential integrity shall be enforced primarily by the database engine.

---

### RIT-004

Application validation shall supplement database constraints.

---

# 44.4 Referential Integrity Architecture

```text id="rit1"
          Client Request
                │
                ▼
      Application Validation
                │
                ▼
        Business Validation
                │
                ▼
    PostgreSQL Constraints
                │
                ▼
 Referential Integrity Check
                │
        ┌───────┴────────┐
        │                │
     Success         Constraint Error
```

Integrity validation occurs before transaction commitment.

---

### RIT-005

Constraint validation shall occur before transaction commit.

---

### RIT-006

Integrity violations shall result in transaction rollback.

---

# 44.5 Parent-Child Relationships

Every parent-child relationship follows strict ownership rules.

Examples:

```text id="rit2"
Student
   │
   ├── Enrollment
   ├── Assessment Attempt
   ├── Certificate
   ├── Progress
   └── Notification
```

```text id="rit3"
Course
   │
   ├── Lessons
   ├── Assessments
   ├── Resources
   └── Enrollments
```

Every child must reference an existing parent.

---

### RIT-007

Parent records shall exist before child records are created.

---

### RIT-008

Child records shall not reference deleted or invalid parents.

---

# 44.6 Foreign Key Integrity

Foreign keys enforce relationships between entities.

Example:

```sql
ALTER TABLE lessons
ADD CONSTRAINT fk_lesson_course
FOREIGN KEY (course_id)
REFERENCES courses(id)
ON DELETE RESTRICT
ON UPDATE NO ACTION;
```

Foreign key guidelines:

* Use UUID references.
* Name constraints consistently.
* Index all foreign keys.
* Avoid nullable keys unless justified.
* Explicitly define referential actions.

---

### RIT-009

Every business relationship shall be protected by an appropriate foreign key constraint.

---

### RIT-010

Foreign key constraints shall use enterprise naming conventions.

---

# 44.7 Unique Relationship Integrity

Certain business relationships require uniqueness.

Examples:

* One profile per user.
* One enrollment per student-course pair.
* One certificate number per issued certificate.
* One role assignment per user-role pair.

Example:

```sql
UNIQUE(student_id, course_id)
```

Unique constraints prevent duplicate business relationships.

---

### RIT-011

Unique business relationships shall be enforced using unique constraints.

---

### RIT-012

Duplicate relationship records shall not be permitted.

---

# 44.8 Mandatory vs Optional Relationships

Relationships may be mandatory or optional.

### Mandatory

```text id="rit4"
Lesson
   │
Course
```

A lesson cannot exist without a course.

### Optional

```text id="rit5"
Student
      │
Preferred Mentor
```

A student may or may not have a mentor.

Guidelines:

* Mandatory relationships use `NOT NULL`.
* Optional relationships allow `NULL`.
* Business rules define participation.

---

### RIT-013

Mandatory relationships shall prohibit NULL foreign keys.

---

### RIT-014

Optional relationships shall explicitly allow NULL values where justified.

---

# 44.9 Cross-Schema Referential Integrity

Relationships span multiple schemas.

```text id="rit6"
identity.users
        │
student.students
        │
course.enrollments
        │
assessment.attempts
        │
certificate.certificates
```

Cross-schema integrity rules:

* Maintain clear ownership.
* Avoid circular dependencies.
* Document all cross-schema references.
* Minimize coupling.

---

### RIT-015

Cross-schema relationships shall be formally documented.

---

### RIT-016

Circular schema dependencies shall be prohibited.

---

# 44.10 Historical Integrity

Historical records remain valid even after operational changes.

Examples:

* Completed assessments
* Issued certificates
* AI conversations
* Audit records
* Notification history

Historical entities reference immutable identifiers.

Example:

```text id="rit7"
Student
    │
Certificate
    │
Audit Record
```

Historical references shall never be rewritten.

---

### RIT-017

Historical records shall preserve original business relationships.

---

### RIT-018

Immutable identifiers shall never be reassigned.

---

# 44.11 Transactional Integrity

Referential integrity is enforced within ACID transactions.

```text id="rit8"
BEGIN

Insert Parent

Insert Child

Validate Constraints

COMMIT
```

Failure example:

```text id="rit9"
BEGIN

Insert Child

Parent Missing

ROLLBACK
```

Transactions ensure that partially completed operations never leave inconsistent data.

---

### RIT-019

Referential validation shall occur within transactional boundaries.

---

### RIT-020

Integrity violations shall trigger automatic rollback.

---

# 44.12 Deferred Constraint Validation

Some operations require deferred validation.

Examples:

* Circular initialization
* Bulk imports
* Data migration
* ETL processing

Example:

```sql
SET CONSTRAINTS ALL DEFERRED;
```

Deferred constraints are permitted only during controlled operations.

---

### RIT-021

Deferred constraints shall be used only for approved administrative operations.

---

### RIT-022

Deferred validation shall complete successfully before transaction commit.

---

# 44.13 Integrity Monitoring

Integrity health is continuously monitored.

Monitoring includes:

* Orphan record detection
* Broken foreign keys
* Duplicate relationship checks
* Constraint violations
* Migration validation
* Data quality reports

Example workflow:

```text id="rit10"
Scheduled Validation
        │
        ▼
Integrity Report
        │
        ▼
Issue Detection
        │
        ▼
Corrective Action
```

---

### RIT-023

Integrity validation shall be performed regularly.

---

### RIT-024

Integrity violations shall trigger operational alerts.

---

# 44.14 Performance Considerations

Referential integrity introduces validation overhead that must be optimized.

Optimization strategies include:

* Index foreign keys.
* Use efficient UUID indexes.
* Validate constraints during migration.
* Batch bulk imports.
* Monitor constraint execution.
* Avoid unnecessary cross-schema joins.
* Partition large child tables.

Proper indexing minimizes the performance cost of constraint enforcement.

---

### RIT-025

Foreign key validation shall be supported by appropriate indexing.

---

### RIT-026

Integrity enforcement shall be performance tested under production-scale workloads.

---

# 44.15 Security & Compliance

Referential integrity contributes directly to regulatory compliance by ensuring trustworthy and complete records.

Required controls:

* Role-Based Access Control (RBAC)
* Immutable audit trails
* Controlled schema modifications
* Data retention enforcement
* Transaction logging
* GDPR compliance
* HIPAA-ready integrity controls
* Academic governance policies

Unauthorized modification of referential constraints is prohibited.

---

### RIT-027

Integrity constraints shall be protected through database security controls.

---

### RIT-028

Constraint modifications shall require authorized administrative privileges.

---

# 44.16 Governance

Referential integrity governance includes:

* Enterprise Architecture Board
* Database Architecture Review Board
* Data Governance Council
* Database Administration Team
* Security Review Committee
* Academic Affairs
* Compliance Office
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Impact assessment
* Migration planning
* Performance validation
* Security review
* Documentation updates

---

### RIT-029

Referential integrity modifications shall require formal governance approval.

---

### RIT-030

Integrity documentation shall remain synchronized with implemented database constraints.

---

# 44.17 Traceability

This chapter defines the enterprise referential integrity standards for the Mediverse platform.

**Related Documents**

* Chapter 19 – Primary Key Strategy
* Chapter 20 – Foreign Key Strategy
* Chapter 22 – Constraints Design
* Chapter 42 – Relationship Design
* Chapter 43 – Cascading Strategy
* Chapter 45 – Data Validation Rules
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Architecture Decision Records (ADR)

**Applies To**

* Parent-Child Relationships
* Foreign Key Constraints
* Unique Constraints
* Transactional Integrity
* Cross-Schema Relationships
* Historical Records
* Constraint Validation
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise referential integrity strategy for the Mediverse database. It establishes comprehensive standards for foreign key relationships, parent-child dependencies, unique relationship enforcement, transactional validation, cross-schema integrity, historical data preservation, and integrity monitoring. By enforcing referential constraints at the database level, supplementing them with application validation, and governing structural changes through formal architectural processes, the Mediverse platform ensures a reliable, scalable, and trustworthy relational data model capable of supporting enterprise-scale medical education.

---

**End of Chapter 44**

**Next:** **Chapter 45 – Data Validation Rules**.

---

# Chapter 45 — Data Validation Rules

---

# Chapter Overview

This chapter defines the enterprise **Data Validation Rules** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes standardized validation mechanisms that ensure all data entering, updating, or leaving the database is accurate, complete, consistent, secure, and compliant with business, academic, and regulatory requirements.

Data validation is implemented through multiple architectural layers, including client-side validation, application services, business rules, database constraints, stored procedures, and integration gateways.

---

# 45.1 Introduction

Data quality is fundamental to every educational, analytical, AI, and administrative function within the Mediverse platform. Invalid or inconsistent data can lead to inaccurate learning outcomes, security vulnerabilities, reporting errors, regulatory non-compliance, and degraded AI performance.

The Mediverse platform adopts a **multi-layer validation architecture** that validates data before persistence while enforcing mandatory constraints within the database.

Validation applies to:

* User identities
* Student records
* Faculty information
* Courses
* Lessons
* Assessments
* Question banks
* Certificates
* Notifications
* AI knowledge
* Analytics
* Audit logs

---

# 45.2 Objectives

The objectives of Data Validation Rules are to:

* Maintain data quality.
* Prevent invalid data entry.
* Enforce business policies.
* Improve security.
* Protect referential integrity.
* Support regulatory compliance.
* Improve AI reliability.
* Simplify maintenance.
* Enable consistent reporting.
* Reduce operational errors.

---

### DVR-001

All persisted data shall comply with enterprise validation rules.

---

### DVR-002

Invalid data shall never be committed to the production database.

---

# 45.3 Validation Architecture

Validation is implemented across multiple architectural layers.

```text id="dvr1"
        User Interface
              │
              ▼
      Client Validation
              │
              ▼
      API Validation
              │
              ▼
 Business Rule Validation
              │
              ▼
 Database Constraints
              │
              ▼
 Transaction Commit
```

Each layer complements the others, ensuring defense in depth.

---

### DVR-003

Validation shall occur before transaction commitment.

---

### DVR-004

Database constraints shall remain the final authority for data integrity.

---

# 45.4 Validation Categories

Validation rules are categorized as follows:

| Category                  | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| Required Field Validation | Mandatory attributes must be present.                         |
| Data Type Validation      | Values shall match defined data types.                        |
| Length Validation         | Values shall conform to length limits.                        |
| Format Validation         | Structured formats such as email and UUID shall be validated. |
| Range Validation          | Numeric and date values shall fall within permitted ranges.   |
| Business Rule Validation  | Domain-specific rules shall be enforced.                      |
| Referential Validation    | Foreign key relationships shall remain valid.                 |
| Security Validation       | Inputs shall be sanitized and verified.                       |

---

### DVR-005

Every attribute shall have at least one applicable validation rule.

---

### DVR-006

Validation categories shall be documented within the enterprise data dictionary.

---

# 45.5 Required Field Validation

Mandatory fields prevent incomplete records.

Examples:

| Entity      | Mandatory Fields        |
| ----------- | ----------------------- |
| Student     | Student ID, Name, Email |
| Course      | Course Code, Title      |
| Lesson      | Lesson Name             |
| Assessment  | Assessment Type         |
| Certificate | Certificate Number      |

Example SQL:

```sql id="l0xv7g"
student_name VARCHAR(200) NOT NULL
```

---

### DVR-007

Mandatory business attributes shall be declared using `NOT NULL` constraints.

---

### DVR-008

Required field validation shall occur at both application and database layers.

---

# 45.6 Data Type Validation

Every attribute shall use an approved enterprise data type.

Examples:

| Data        | Type        |
| ----------- | ----------- |
| UUID        | UUID        |
| Name        | VARCHAR     |
| Description | TEXT        |
| Score       | NUMERIC     |
| Date        | DATE        |
| Timestamp   | TIMESTAMPTZ |
| Status      | UUID FK     |

Incorrect types shall be rejected before persistence.

---

### DVR-009

Attributes shall conform to standardized enterprise data types.

---

### DVR-010

Type conversion shall not silently truncate or corrupt data.

---

# 45.7 Length Validation

Textual attributes shall comply with predefined limits.

Examples:

| Attribute     | Maximum Length |
| ------------- | -------------- |
| First Name    | 100            |
| Last Name     | 100            |
| Email         | 320            |
| Course Code   | 50             |
| Lesson Title  | 300            |
| Password Hash | 255            |

Example:

```sql id="3w6f8k"
course_code VARCHAR(50)
```

Length restrictions prevent storage abuse and maintain consistency.

---

### DVR-011

Maximum lengths shall be defined for all textual attributes.

---

### DVR-012

Input exceeding defined limits shall be rejected.

---

# 45.8 Format Validation

Structured data requires format verification.

Examples:

* Email addresses
* UUIDs
* Phone numbers
* URLs
* License numbers
* Certificate identifiers

Example:

```text id="dvr2"
student@example.com
```

Example validation:

```text id="dvr3"
UUID

xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

### DVR-013

Structured identifiers shall conform to approved enterprise formats.

---

### DVR-014

Invalid identifier formats shall be rejected before persistence.

---

# 45.9 Range Validation

Numerical and temporal values require boundary validation.

Examples:

| Attribute       | Allowed Range |
| --------------- | ------------- |
| Score           | 0–100         |
| Attendance      | 0–100         |
| Rating          | 1–5           |
| CME Credits     | ≥ 0           |
| Lesson Duration | > 0 Minutes   |

Date Rules:

* End Date ≥ Start Date
* Birth Date < Current Date
* Expiry Date > Issue Date

---

### DVR-015

Numeric values shall remain within approved business ranges.

---

### DVR-016

Temporal values shall satisfy chronological business rules.

---

# 45.10 Business Rule Validation

Business validation enforces domain-specific policies.

Examples:

* Student email must be unique.
* Course code must be unique.
* Assessment passing score cannot exceed maximum score.
* Certificate issuance requires successful completion.
* AI prompt templates require approval before activation.
* Faculty must possess required qualifications.

Business validation typically occurs within application services while critical rules are reinforced by database constraints.

---

### DVR-017

Business rules shall reflect approved institutional policies.

---

### DVR-018

Critical business validations shall be enforced before persistence.

---

# 45.11 Referential Validation

Relationships require valid parent records.

Example:

```text id="dvr4"
Student
     │
Enrollment
     │
Course
```

Validation ensures:

* Parent exists.
* Foreign key is valid.
* Relationship is permitted.
* Ownership rules are satisfied.

---

### DVR-019

Foreign key values shall reference existing parent records.

---

### DVR-020

Referential validation shall comply with enterprise relationship policies.

---

# 45.12 Security Validation

Security validation protects against malicious input.

Required controls:

* SQL Injection prevention
* Cross-Site Scripting (XSS) prevention
* Input sanitization
* Unicode normalization
* File validation
* MIME validation
* Virus scanning
* Request size validation

Security validation applies to all external interfaces.

---

### DVR-021

User-supplied input shall undergo security validation before processing.

---

### DVR-022

Potentially malicious input shall be rejected and audited.

---

# 45.13 AI Data Validation

AI-specific assets require additional validation.

Examples:

* Prompt templates
* Knowledge documents
* Embedding metadata
* Model identifiers
* Citation references
* AI feedback

Validation includes:

* Prompt syntax verification
* Token limit enforcement
* Metadata completeness
* Citation integrity
* Responsible AI policy checks

---

### DVR-023

AI knowledge assets shall comply with Responsible AI validation policies.

---

### DVR-024

Prompt templates shall undergo approval before production deployment.

---

# 45.14 Validation Error Handling

Validation failures shall produce standardized error responses.

Example:

```text id="dvr5"
Validation Failed

Error Code:
VAL-1004

Entity:
Student

Field:
Email

Reason:
Invalid email format
```

Error responses shall include:

* Error Code
* Entity
* Field
* Validation Rule
* User-Friendly Message
* Timestamp
* Correlation ID

Sensitive internal implementation details shall not be exposed.

---

### DVR-025

Validation errors shall use standardized enterprise error codes.

---

### DVR-026

Validation responses shall avoid exposing internal system information.

---

# 45.15 Performance Considerations

Validation contributes to system reliability but must remain efficient.

Optimization strategies include:

* Validate early.
* Avoid redundant validations.
* Cache lookup values.
* Batch validation for bulk imports.
* Optimize regular expressions.
* Use database constraints efficiently.
* Monitor validation latency.

Validation shall balance correctness with system performance.

---

### DVR-027

Validation logic shall be optimized for high-volume transactions.

---

### DVR-028

Bulk operations shall support efficient batch validation.

---

# 45.16 Security & Compliance

Validation directly supports enterprise security and compliance.

Required controls:

* Role-Based Access Control (RBAC)
* Input sanitization
* Encryption
* Audit logging
* GDPR compliance
* HIPAA-ready validation controls
* Academic governance
* Secure coding standards

All validation failures affecting security shall be logged for monitoring and investigation.

---

### DVR-029

Validation mechanisms shall comply with enterprise security policies.

---

### DVR-030

Security-related validation failures shall be auditable.

---

# 45.17 Governance

Data Validation governance includes:

* Enterprise Data Governance Board
* Database Architecture Review Board
* Academic Affairs
* AI Governance Committee
* Security Review Committee
* Quality Assurance Team
* Database Administration Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Changes require:

* Business approval
* Security review
* Performance validation
* Regression testing
* Documentation updates

---

### DVR-031

Validation rule modifications shall require formal governance approval.

---

### DVR-032

Validation documentation shall remain synchronized with implementation.

---

# 45.18 Traceability

This chapter defines enterprise data validation standards for the Mediverse platform.

**Related Documents**

* Chapter 22 – Constraints Design
* Chapter 42 – Relationship Design
* Chapter 44 – Referential Integrity
* Chapter 46 – Indexing Strategy
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Enterprise Data Dictionary
* Architecture Decision Records (ADR)

**Applies To**

* Required Field Validation
* Data Type Validation
* Length Validation
* Format Validation
* Range Validation
* Business Rule Validation
* Referential Validation
* Security Validation
* AI Validation
* PostgreSQL Enterprise Database

---

# Chapter Summary

This chapter defines the enterprise Data Validation Rules for the Mediverse database. It establishes comprehensive validation standards covering mandatory fields, standardized data types, length restrictions, structured formats, value ranges, business rules, referential integrity, security validation, AI-specific validation, and standardized error handling. By enforcing validation across multiple architectural layers and integrating governance, compliance, and performance considerations, the Mediverse platform ensures high-quality, secure, and trustworthy data capable of supporting enterprise-scale medical education, analytics, and AI services.

---

**End of Chapter 45**

**Next:** **Chapter 46 – Indexing Strategy**.

---

# Chapter 46 — Indexing Strategy

---

# Chapter Overview

This chapter defines the **Indexing Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, implementing, maintaining, monitoring, and optimizing database indexes to achieve high-performance query execution while maintaining transactional efficiency.

The indexing strategy balances read performance, write overhead, storage utilization, and scalability across all Mediverse modules, including authentication, student management, courses, assessments, AI services, analytics, notifications, certificates, media management, and auditing.

---

# 46.1 Introduction

Indexes are specialized database structures that enable rapid data retrieval without scanning entire tables. Proper indexing significantly improves query performance but also introduces additional storage and maintenance overhead.

The Mediverse platform contains hundreds of tables and millions of expected records. A standardized indexing strategy is therefore essential to support:

* High-volume student activity
* AI-assisted semantic searches
* Course discovery
* Assessment processing
* Certificate verification
* Analytics reporting
* Audit log searches
* Administrative operations

The indexing strategy is optimized for **PostgreSQL 17+** and follows enterprise best practices.

---

# 46.2 Objectives

The objectives of the Indexing Strategy are to:

* Improve query performance.
* Minimize table scans.
* Optimize JOIN operations.
* Accelerate filtering and sorting.
* Improve full-text search.
* Support analytical workloads.
* Balance read/write performance.
* Reduce query latency.
* Enable horizontal scalability.
* Standardize index governance.

---

### IDX-001

Indexes shall be created based on measurable query patterns.

---

### IDX-002

Unused indexes shall be periodically identified and removed.

---

# 46.3 Indexing Architecture

```text
                Client Query
                     │
                     ▼
             PostgreSQL Planner
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Index Scan               Sequential Scan
        │                         │
        ▼                         ▼
 Optimized Result          Full Table Scan
```

The PostgreSQL query planner selects the optimal execution strategy using statistics, index metadata, and estimated execution costs.

---

### IDX-003

Index selection shall remain under PostgreSQL Cost-Based Optimizer control.

---

### IDX-004

Execution plans shall be continuously monitored.

---

# 46.4 Index Design Principles

The Mediverse platform follows these enterprise principles:

1. Index based on workload.
2. Avoid duplicate indexes.
3. Prefer selective indexes.
4. Index foreign keys.
5. Optimize JOIN operations.
6. Minimize write overhead.
7. Use composite indexes where appropriate.
8. Use partial indexes when beneficial.
9. Monitor index fragmentation.
10. Periodically review index effectiveness.

---

### IDX-005

Indexes shall support documented application workloads.

---

### IDX-006

Redundant indexes shall not be permitted.

---

# 46.5 Index Types

PostgreSQL supports multiple index types. Each serves a specific workload.

| Index Type | Usage                              |
| ---------- | ---------------------------------- |
| B-Tree     | Equality, sorting, range queries   |
| Hash       | Equality lookups                   |
| GIN        | Full-text search, JSONB, arrays    |
| GiST       | Geospatial, ranges                 |
| BRIN       | Very large append-only tables      |
| SP-GiST    | Specialized partitioned structures |
| Bloom      | Multi-column filtering (extension) |

Default recommendation:

* B-Tree for transactional tables
* GIN for AI search metadata
* BRIN for audit logs
* GiST for future geospatial learning modules

---

### IDX-007

Index types shall be selected according to workload characteristics.

---

### IDX-008

Unsupported or experimental index types require architecture approval.

---

# 46.6 Primary Key Indexes

Every primary key automatically creates a unique index.

Example:

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY
);
```

Generated index:

```text
students_pkey
```

Characteristics:

* Unique
* Cluster-independent
* Highly selective
* Immutable UUID-based

---

### IDX-009

Every primary key shall remain indexed.

---

### IDX-010

Primary key values shall remain immutable.

---

# 46.7 Foreign Key Indexes

Foreign key indexes significantly improve JOIN performance.

Example:

```sql
CREATE INDEX idx_enrollment_student
ON enrollments(student_id);
```

Recommended foreign key indexes:

* student_id
* faculty_id
* course_id
* lesson_id
* assessment_id
* certificate_id
* notification_id

---

### IDX-011

Foreign key columns shall be indexed unless a documented exception exists.

---

### IDX-012

Cross-schema relationships shall use optimized foreign key indexes.

---

# 46.8 Composite Indexes

Composite indexes optimize queries filtering on multiple columns.

Example:

```sql
CREATE INDEX idx_course_status
ON courses(status_id, category_id);
```

Typical examples:

* (student_id, course_id)
* (course_id, lesson_order)
* (assessment_id, question_order)
* (issued_at, status_id)

Column order shall follow the most selective query predicates.

---

### IDX-013

Composite indexes shall reflect actual query predicates.

---

### IDX-014

Leading columns shall maximize index selectivity.

---

# 46.9 Partial Indexes

Partial indexes improve performance by indexing subsets of data.

Example:

```sql
CREATE INDEX idx_active_students
ON students(student_number)
WHERE status='ACTIVE';
```

Suitable use cases:

* Active students
* Published courses
* Pending notifications
* Unverified certificates
* Failed login attempts

Benefits:

* Reduced storage
* Faster updates
* Better cache efficiency

---

### IDX-015

Partial indexes shall be used for frequently filtered subsets.

---

### IDX-016

Partial index predicates shall remain deterministic.

---

# 46.10 Covering Indexes

Covering indexes include additional columns to avoid table lookups.

Example:

```sql
CREATE INDEX idx_student_lookup
ON students(student_number)
INCLUDE(first_name,last_name,email);
```

Benefits:

* Index-only scans
* Reduced disk I/O
* Faster search operations

Ideal for:

* Student search
* Faculty directory
* Course catalog
* Certificate lookup

---

### IDX-017

Frequently executed lookup queries should support index-only scans where practical.

---

### IDX-018

Included columns shall not affect index key ordering.

---

# 46.11 Full-Text Search Indexes

Medical education content requires enterprise search capabilities.

Example:

```sql
CREATE INDEX idx_lesson_search
ON lessons
USING GIN(search_vector);
```

Applies to:

* Lessons
* Courses
* Knowledge documents
* Medical glossary
* AI knowledge base
* FAQs

Supports:

* Semantic search
* Keyword search
* Auto-complete
* Phrase search

---

### IDX-019

Searchable educational content shall use optimized full-text indexes.

---

### IDX-020

Search indexes shall remain synchronized with indexed content.

---

# 46.12 JSONB Indexes

Certain configuration and AI metadata use JSONB.

Example:

```sql
CREATE INDEX idx_prompt_metadata
ON prompt_templates
USING GIN(metadata);
```

Suitable for:

* AI prompt metadata
* User preferences
* Dashboard configuration
* Dynamic settings

---

### IDX-021

Frequently queried JSONB fields shall use GIN indexes.

---

### IDX-022

JSONB indexing shall target documented access patterns.

---

# 46.13 Partition-Aware Indexing

Large tables require partition-aware indexing.

Typical candidates:

* Audit logs
* Analytics
* Notifications
* AI conversations
* API access logs

Example:

```text
audit_logs

2027

2028

2029
```

Each partition maintains independent indexes.

Benefits:

* Faster maintenance
* Reduced rebuild time
* Improved scalability

---

### IDX-023

Partitioned tables shall maintain local indexes for each partition.

---

### IDX-024

Partition pruning shall be verified during performance testing.

---

# 46.14 Index Monitoring & Maintenance

Indexes require continuous monitoring.

Maintenance includes:

* REINDEX
* VACUUM
* ANALYZE
* Usage statistics review
* Bloat detection
* Fragmentation analysis
* Duplicate index identification

Monitoring metrics:

* Scan count
* Index size
* Cache hit ratio
* Read latency
* Write overhead

---

### IDX-025

Index health shall be continuously monitored.

---

### IDX-026

Index maintenance shall follow scheduled operational procedures.

---

# 46.15 Performance Considerations

Improper indexing negatively affects write performance and storage utilization.

Optimization strategies include:

* Avoid indexing low-selectivity columns.
* Remove duplicate indexes.
* Limit excessive composite indexes.
* Review execution plans regularly.
* Use `EXPLAIN ANALYZE` during optimization.
* Rebuild fragmented indexes.
* Tune fill factors where appropriate.

Indexes shall be reviewed before every major production release.

---

### IDX-027

Index design shall balance read performance with write overhead.

---

### IDX-028

Performance optimization shall be evidence-based using execution metrics.

---

# 46.16 Security & Compliance

Indexes may expose sensitive search patterns if improperly managed.

Required controls:

* Role-Based Access Control (RBAC)
* Encrypted storage
* Audit logging
* Controlled index creation privileges
* Secure maintenance procedures
* GDPR compliance
* HIPAA-ready operational controls

Only authorized database administrators may modify production indexes.

---

### IDX-029

Production index management shall require privileged administrative access.

---

### IDX-030

Index maintenance activities shall be fully auditable.

---

# 46.17 Governance

Index governance includes:

* Database Architecture Review Board
* Enterprise Performance Engineering Team
* Database Administration Team
* Enterprise Data Governance Board
* Security Review Committee
* Site Reliability Engineering (SRE)
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Query performance analysis
* Capacity assessment
* Regression testing
* Production validation
* Documentation updates

---

### IDX-031

Index strategy modifications shall require formal governance approval.

---

### IDX-032

Index documentation shall remain synchronized with implemented database objects.

---

# 46.18 Traceability

This chapter defines enterprise indexing standards for the Mediverse platform.

**Related Documents**

* Chapter 17 – Table Design Standards
* Chapter 19 – Primary Key Strategy
* Chapter 20 – Foreign Key Strategy
* Chapter 42 – Relationship Design
* Chapter 44 – Referential Integrity
* Chapter 48 – Partitioning Strategy
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Performance Guide
* Architecture Decision Records (ADR)

**Applies To**

* Primary Key Indexes
* Foreign Key Indexes
* Composite Indexes
* Partial Indexes
* Covering Indexes
* Full-Text Search
* JSONB Indexes
* Partitioned Tables
* PostgreSQL Enterprise Database

---

# Chapter Summary

This chapter defines the enterprise Indexing Strategy for the Mediverse database. It establishes standardized guidance for primary key, foreign key, composite, partial, covering, full-text, JSONB, and partition-aware indexes while emphasizing workload-driven design, performance optimization, and operational maintainability. By combining PostgreSQL best practices with continuous monitoring, governance, and security controls, the Mediverse platform ensures scalable, high-performance data access capable of supporting enterprise-scale medical education, AI workloads, analytics, and transactional processing.

---

**End of Chapter 46**

**Next:** **Chapter 47 – Query Optimization**.

---

# Chapter 47 — Query Optimization

---

# Chapter Overview

This chapter defines the **Query Optimization Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, analyzing, tuning, and maintaining SQL queries to achieve optimal performance, scalability, reliability, and resource utilization.

The Query Optimization Strategy ensures that transactional, analytical, AI, and reporting workloads execute efficiently while maintaining ACID compliance and supporting millions of concurrent educational operations.

---

# 47.1 Introduction

As the Mediverse platform grows, inefficient SQL queries can become one of the largest contributors to system latency, excessive resource consumption, and poor user experience.

The platform supports numerous high-volume operations, including:

* Student authentication
* Course discovery
* Lesson delivery
* Assessment evaluation
* Certificate verification
* AI-assisted learning
* Analytics reporting
* Audit log retrieval
* Notification processing

Each of these operations requires carefully optimized SQL execution plans to maintain enterprise-grade performance.

The optimization strategy is designed for **PostgreSQL 17+** and integrates with indexing, partitioning, caching, and execution monitoring.

---

# 47.2 Objectives

The objectives of Query Optimization are to:

* Minimize query execution time.
* Reduce database resource utilization.
* Optimize JOIN performance.
* Eliminate unnecessary table scans.
* Improve concurrency.
* Reduce locking.
* Support analytical workloads.
* Improve AI retrieval performance.
* Enable predictable scalability.
* Standardize query development practices.

---

### QOT-001

All production SQL queries shall be performance reviewed before deployment.

---

### QOT-002

Queries shall be optimized based on measured execution statistics rather than assumptions.

---

# 47.3 Query Optimization Architecture

```text id="qot1"
          Application
               │
               ▼
         SQL Statement
               │
               ▼
     PostgreSQL Parser
               │
               ▼
      Query Planner
               │
               ▼
      Cost Optimizer
               │
        ┌──────┴──────┐
        ▼             ▼
 Optimized Plan   Statistics
        │
        ▼
  Query Execution
```

The PostgreSQL Cost-Based Optimizer (CBO) determines the most efficient execution strategy using table statistics, indexes, and estimated costs.

---

### QOT-003

The PostgreSQL Cost-Based Optimizer shall determine production execution plans.

---

### QOT-004

Execution plans shall be continuously monitored.

---

# 47.4 Query Design Principles

The Mediverse platform follows these optimization principles:

1. Retrieve only required columns.
2. Filter data as early as possible.
3. Minimize JOIN complexity.
4. Use indexed predicates.
5. Avoid unnecessary sorting.
6. Limit result sets.
7. Batch expensive operations.
8. Prefer set-based processing.
9. Avoid duplicate computations.
10. Continuously measure performance.

---

### QOT-005

Queries shall be designed for minimum resource consumption.

---

### QOT-006

Query design shall prioritize readability without sacrificing performance.

---

# 47.5 Execution Plan Analysis

Execution plans provide visibility into query behavior.

Primary tools:

* `EXPLAIN`
* `EXPLAIN ANALYZE`
* `pg_stat_statements`
* `auto_explain`

Example:

```sql
EXPLAIN ANALYZE
SELECT *
FROM students
WHERE student_number='MED100245';
```

Execution plans should be reviewed for:

* Sequential scans
* Index scans
* Nested loops
* Hash joins
* Merge joins
* Sort operations
* Buffer usage
* Planning time
* Execution time

---

### QOT-007

Critical production queries shall be validated using execution plans.

---

### QOT-008

Execution plans shall be retained during performance testing.

---

# 47.6 Predicate Optimization

Filtering conditions significantly influence query performance.

Recommended:

```sql
WHERE student_id = ?
```

Avoid:

```sql
WHERE LOWER(email)=LOWER(?)
```

when a normalized indexed column already exists.

Optimization techniques:

* Use indexed predicates.
* Avoid unnecessary functions.
* Avoid implicit conversions.
* Maintain data type consistency.

---

### QOT-009

Predicate expressions shall maximize index utilization.

---

### QOT-010

Indexed columns shall avoid unnecessary runtime transformations.

---

# 47.7 JOIN Optimization

JOIN operations dominate enterprise workloads.

Typical Mediverse JOIN:

```text id="qot2"
Students
     │
Enrollments
     │
Courses
     │
Lessons
```

Best practices:

* Join indexed columns.
* Join smallest datasets first.
* Minimize unnecessary LEFT JOINs.
* Avoid Cartesian products.
* Eliminate duplicate joins.
* Filter before joining.

---

### QOT-011

JOIN conditions shall reference indexed columns wherever practical.

---

### QOT-012

Cartesian products shall be prohibited in production queries.

---

# 47.8 Sorting & Pagination Optimization

Sorting is resource intensive.

Recommended:

```sql
ORDER BY created_at DESC
LIMIT 50;
```

Large datasets shall use keyset pagination rather than OFFSET pagination.

Preferred:

```text
WHERE created_at < last_seen_timestamp
```

instead of:

```text
OFFSET 500000
```

Benefits:

* Lower latency
* Reduced memory usage
* Better scalability

---

### QOT-013

Large datasets shall use keyset pagination whenever practical.

---

### QOT-014

ORDER BY columns shall align with supporting indexes.

---

# 47.9 Aggregation Optimization

Analytics queries perform extensive aggregation.

Examples:

* COUNT
* SUM
* AVG
* MAX
* MIN

Optimization techniques:

* Materialized views
* Pre-aggregated tables
* Partition pruning
* Incremental aggregation

Example:

```sql
SELECT course_id,
COUNT(*)
FROM enrollments
GROUP BY course_id;
```

---

### QOT-015

Frequently executed aggregations should utilize precomputed datasets where appropriate.

---

### QOT-016

Aggregation queries shall minimize full-table scans.

---

# 47.10 AI & Full-Text Query Optimization

The AI Knowledge Base supports semantic search.

Optimization strategies:

* GIN indexes
* Vector indexes
* Metadata filtering
* Hybrid search
* Chunk pre-filtering
* Query caching

Example workflow:

```text id="qot3"
User Question
      │
Metadata Filter
      │
Vector Search
      │
Top-K Retrieval
      │
AI Response
```

Hybrid retrieval reduces search latency while improving response quality.

---

### QOT-017

Semantic retrieval shall combine metadata filtering with vector search.

---

### QOT-018

AI retrieval queries shall minimize vector search scope through structured filtering.

---

# 47.11 Query Caching Strategy

Frequently executed read operations benefit from caching.

Suitable candidates:

* Course catalog
* Lesson metadata
* Faculty directory
* Certificate templates
* Lookup tables
* AI prompt templates

Caching levels:

* Application cache
* Distributed cache
* Database shared buffers
* Materialized views

Cache invalidation follows business lifecycle events.

---

### QOT-019

Cacheable queries shall have defined invalidation strategies.

---

### QOT-020

Caching shall never compromise transactional consistency.

---

# 47.12 Batch Processing Optimization

Large operations shall execute in controlled batches.

Examples:

* Student imports
* AI embedding generation
* Notification delivery
* Certificate generation
* Audit archival

Batch characteristics:

* Configurable size
* Retry support
* Progress tracking
* Transaction boundaries
* Error isolation

---

### QOT-021

Large data operations shall execute using batch processing.

---

### QOT-022

Batch sizes shall be configurable according to workload characteristics.

---

# 47.13 Query Monitoring

Continuous monitoring ensures sustained performance.

Key metrics:

* Average latency
* P95 execution time
* P99 execution time
* Rows examined
* Rows returned
* Buffer hits
* CPU utilization
* I/O wait
* Lock contention

Monitoring tools:

* pg_stat_statements
* PostgreSQL logs
* Prometheus
* Grafana

---

### QOT-023

Production queries shall be continuously monitored.

---

### QOT-024

Performance regressions shall trigger operational alerts.

---

# 47.14 Performance Anti-Patterns

The following practices are prohibited:

* `SELECT *` in production APIs
* Unbounded result sets
* Missing WHERE clauses on large tables
* Excessive nested subqueries
* Repeated correlated subqueries
* Functions on indexed predicates
* Excessive OFFSET pagination
* Duplicate JOINs
* Missing LIMIT clauses where applicable

Each anti-pattern increases latency and resource utilization.

---

### QOT-025

Known SQL performance anti-patterns shall be prohibited in production code.

---

### QOT-026

Performance reviews shall identify and eliminate inefficient query patterns.

---

# 47.15 Performance Considerations

Query optimization must support enterprise-scale workloads.

Optimization strategies include:

* Maintain accurate statistics.
* Analyze execution plans regularly.
* Tune PostgreSQL planner parameters where justified.
* Optimize indexes.
* Reduce network round trips.
* Partition very large datasets.
* Use read replicas for reporting workloads.

Performance tuning shall rely on measurable production metrics rather than theoretical assumptions.

---

### QOT-027

Query optimization shall be evidence-driven using operational metrics.

---

### QOT-028

Performance tuning shall be validated through benchmark testing.

---

# 47.16 Security & Compliance

Query optimization shall never weaken security controls.

Required controls:

* Parameterized SQL
* Prepared statements
* Least-privilege database access
* Query auditing
* Sensitive data masking
* Encryption
* GDPR compliance
* HIPAA-ready operational controls

Performance improvements shall not bypass authorization or auditing requirements.

---

### QOT-029

Optimized queries shall continue to enforce enterprise security policies.

---

### QOT-030

Database access shall use parameterized queries to prevent SQL injection.

---

# 47.17 Governance

Query Optimization governance includes:

* Database Architecture Review Board
* Performance Engineering Team
* Database Administration Team
* Enterprise Data Governance Board
* Security Review Committee
* Site Reliability Engineering (SRE)
* Quality Assurance Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Performance validation
* Benchmark testing
* Security assessment
* Regression testing
* Documentation updates

---

### QOT-031

Query optimization changes shall require formal governance approval.

---

### QOT-032

Query performance documentation shall remain synchronized with implementation.

---

# 47.18 Traceability

This chapter defines enterprise query optimization standards for the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 48 – Partitioning Strategy
* Chapter 49 – Materialized Views
* Chapter 50 – Database Views
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Performance Guide
* Architecture Decision Records (ADR)

**Applies To**

* SQL Query Design
* Execution Plans
* Predicate Optimization
* JOIN Optimization
* Pagination
* Aggregation
* AI Retrieval Queries
* Query Caching
* Batch Processing
* PostgreSQL Enterprise Database

---

# Chapter Summary

This chapter defines the enterprise Query Optimization Strategy for the Mediverse database. It establishes comprehensive standards for SQL query design, execution plan analysis, predicate optimization, JOIN optimization, pagination, aggregation, AI retrieval, caching, batch processing, and continuous monitoring. By combining PostgreSQL cost-based optimization, evidence-driven performance tuning, standardized governance, and secure coding practices, the Mediverse platform delivers predictable, scalable, and high-performance database operations capable of supporting enterprise-scale medical education, AI services, analytics, and transactional workloads.

---

**End of Chapter 47**

**Next:** **Chapter 48 – Partitioning Strategy**.

---

# Chapter 48 — Partitioning Strategy

---

# Chapter Overview

This chapter defines the **Partitioning Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for partitioning large datasets to improve query performance, maintenance efficiency, scalability, availability, and operational manageability.

As the platform grows to support millions of learners, AI interactions, assessments, audit records, and analytical events, partitioning becomes essential for maintaining predictable database performance while reducing maintenance windows and operational costs.

The strategy is designed for **PostgreSQL 17+** and leverages native declarative partitioning.

---

# 48.1 Introduction

Database partitioning divides a logically single table into multiple physical partitions based on predefined rules. Applications continue to interact with a single logical table, while PostgreSQL automatically routes data to the appropriate partition.

Benefits include:

* Faster query execution
* Improved partition pruning
* Reduced index size
* Faster backups
* Parallel query execution
* Simplified archival
* Improved maintenance
* Better storage management

Partitioning is particularly beneficial for very large transactional and analytical datasets.

---

# 48.2 Objectives

The objectives of the Partitioning Strategy are to:

* Improve query performance.
* Reduce maintenance time.
* Simplify archival.
* Support horizontal growth.
* Reduce index size.
* Improve backup efficiency.
* Optimize storage utilization.
* Support regulatory retention.
* Improve operational resilience.
* Standardize enterprise partitioning.

---

### PTS-001

Large enterprise tables shall use partitioning where justified by workload and data volume.

---

### PTS-002

Partitioning decisions shall be supported by measurable operational metrics.

---

# 48.3 Partitioning Architecture

```text id="pts1"
                 Logical Table
                audit_logs
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 audit_2027     audit_2028     audit_2029
```

Applications interact only with the logical parent table while PostgreSQL transparently manages individual partitions.

---

### PTS-003

Applications shall access partitioned tables through the logical parent table.

---

### PTS-004

Partition routing shall be managed by PostgreSQL native partitioning.

---

# 48.4 Partitioning Principles

The Mediverse platform follows these principles:

1. Partition only large tables.
2. Select partition keys based on query patterns.
3. Avoid excessive partition counts.
4. Maintain balanced partition sizes.
5. Support partition pruning.
6. Simplify lifecycle management.
7. Enable efficient archival.
8. Optimize backup operations.
9. Maintain local indexes.
10. Continuously monitor partition health.

---

### PTS-005

Partition strategies shall align with documented business workloads.

---

### PTS-006

Partition keys shall remain stable throughout the record lifecycle.

---

# 48.5 Candidate Tables

The following tables are expected to require partitioning.

| Module         | Table                | Expected Growth |
| -------------- | -------------------- | --------------- |
| Audit          | audit_logs           | Very High       |
| Analytics      | analytics_events     | Very High       |
| AI             | ai_conversations     | Very High       |
| Notifications  | notification_history | High            |
| Assessment     | assessment_attempts  | High            |
| Media          | media_access_logs    | High            |
| Authentication | login_history        | High            |
| Monitoring     | api_request_logs     | Very High       |

Operational tables with relatively small datasets remain non-partitioned.

---

### PTS-007

Only high-volume tables shall be partitioned.

---

### PTS-008

Partitioning shall not be applied without documented operational justification.

---

# 48.6 Partitioning Methods

PostgreSQL supports multiple partitioning strategies.

| Strategy  | Typical Usage              |
| --------- | -------------------------- |
| Range     | Dates, timestamps          |
| List      | Status, region, tenant     |
| Hash      | Even workload distribution |
| Composite | Combination of methods     |

Recommended usage:

* Range for time-series data.
* List for multi-tenant deployments.
* Hash for balanced distribution.
* Composite for advanced workloads.

---

### PTS-009

Partitioning methods shall match access patterns.

---

### PTS-010

Composite partitioning shall require architectural approval.

---

# 48.7 Range Partitioning

Range partitioning is the primary strategy for Mediverse.

Example:

```sql id="pts_sql_1"
CREATE TABLE audit_logs (
    id UUID,
    created_at TIMESTAMPTZ
)
PARTITION BY RANGE (created_at);
```

Monthly partitions:

```text id="pts2"
audit_logs

2027_01

2027_02

2027_03

...

2028_01
```

Benefits:

* Efficient pruning
* Fast archival
* Simple retention
* Optimized reporting

---

### PTS-011

Time-series tables shall primarily use range partitioning.

---

### PTS-012

Partition intervals shall support expected operational workloads.

---

# 48.8 List Partitioning

List partitioning groups records by predefined values.

Example:

```text id="pts3"
Tenant

Hospital A

Hospital B

Hospital C
```

Suitable for:

* Institution
* Country
* Tenant
* Deployment region

---

### PTS-013

List partitioning shall be used only for low-cardinality values.

---

### PTS-014

Partition values shall be centrally governed.

---

# 48.9 Hash Partitioning

Hash partitioning distributes rows evenly.

```text id="pts4"
Student ID

Hash()

Partition 1

Partition 2

Partition 3

Partition 4
```

Advantages:

* Balanced workload
* Uniform storage
* Improved concurrency

Used primarily for distributed write-heavy workloads.

---

### PTS-015

Hash partitioning shall be considered for high-volume concurrent workloads.

---

### PTS-016

Hash partition counts shall support future expansion.

---

# 48.10 Composite Partitioning

Complex datasets may require multiple partitioning dimensions.

Example:

```text id="pts5"
Year

Month

Institution
```

Possible implementations:

* RANGE + LIST
* RANGE + HASH
* LIST + HASH

Composite partitioning increases flexibility but also operational complexity.

---

### PTS-017

Composite partitioning shall be limited to well-justified enterprise workloads.

---

### PTS-018

Composite partition designs shall be documented in Architecture Decision Records (ADR).

---

# 48.11 Partition Pruning

Partition pruning enables PostgreSQL to scan only relevant partitions.

Example:

```sql id="pts_sql_2"
SELECT *

FROM audit_logs

WHERE created_at
BETWEEN '2028-01-01'
AND '2028-01-31';
```

Only the January 2028 partition is scanned.

Benefits:

* Lower I/O
* Reduced CPU
* Faster execution
* Smaller memory footprint

---

### PTS-019

Queries shall include partition keys whenever practical.

---

### PTS-020

Execution plans shall verify successful partition pruning.

---

# 48.12 Partition Lifecycle Management

Partitions follow a controlled lifecycle.

```text id="pts6"
Create

↓

Active

↓

Read Mostly

↓

Archive

↓

Cold Storage

↓

Retention Expiry

↓

Secure Purge
```

Lifecycle operations include:

* Automatic partition creation
* Monitoring
* Archival
* Compression
* Secure deletion

---

### PTS-021

Partition lifecycle operations shall be automated wherever possible.

---

### PTS-022

Expired partitions shall follow approved retention policies.

---

# 48.13 Indexing Partitioned Tables

Each partition maintains independent indexes.

Example:

```text id="pts7"
audit_2028_01

├── Primary Key

├── created_at

└── user_id
```

Benefits:

* Smaller indexes
* Faster rebuilds
* Lower maintenance cost
* Improved cache efficiency

Global indexing strategies shall be reviewed as PostgreSQL capabilities evolve.

---

### PTS-023

Every partition shall maintain required local indexes.

---

### PTS-024

Partition index maintenance shall follow operational schedules.

---

# 48.14 Monitoring & Maintenance

Continuous monitoring ensures healthy partition operation.

Key metrics:

* Partition count
* Partition size
* Query latency
* Partition pruning ratio
* Index health
* Storage growth
* Vacuum statistics
* Bloat percentage

Maintenance tasks:

* VACUUM
* ANALYZE
* REINDEX
* Partition rotation
* Storage optimization

---

### PTS-025

Partition health shall be continuously monitored.

---

### PTS-026

Partition maintenance shall be automated through scheduled operations.

---

# 48.15 Performance Considerations

Proper partitioning improves:

* Query latency
* Backup duration
* Index efficiency
* Maintenance windows
* Bulk data loading
* Parallel execution

Potential risks include:

* Excessive partitions
* Poor partition key selection
* Uneven data distribution
* Complex execution plans

Regular workload analysis shall guide partition tuning.

---

### PTS-027

Partition performance shall be validated using production-scale benchmarks.

---

### PTS-028

Partition strategies shall be reviewed periodically as data volumes evolve.

---

# 48.16 Security & Compliance

Partitioning supports regulatory compliance through controlled retention and archival.

Required controls:

* Role-Based Access Control (RBAC)
* Encrypted storage
* Immutable audit partitions
* Secure archival
* Controlled purge procedures
* GDPR compliance
* HIPAA-ready retention controls

Partition deletion shall require administrative authorization and audit logging.

---

### PTS-029

Partition lifecycle operations shall comply with enterprise security policies.

---

### PTS-030

Retention and purge activities shall be fully auditable.

---

# 48.17 Governance

Partition governance includes:

* Database Architecture Review Board
* Database Administration Team
* Performance Engineering Team
* Enterprise Data Governance Board
* Site Reliability Engineering (SRE)
* Security Review Committee
* Compliance Office
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Capacity planning
* Performance testing
* Retention review
* Operational validation
* Documentation updates

---

### PTS-031

Partition strategy changes shall require formal governance approval.

---

### PTS-032

Partition documentation shall remain synchronized with implemented database structures.

---

# 48.18 Traceability

This chapter defines enterprise partitioning standards for the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 49 – Materialized Views
* Chapter 50 – Database Views
* Chapter 58 – Backup, Recovery & Archival
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Administration Guide
* Architecture Decision Records (ADR)

**Applies To**

* Range Partitioning
* List Partitioning
* Hash Partitioning
* Composite Partitioning
* Partition Pruning
* Lifecycle Management
* Partition Monitoring
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Partitioning Strategy for the Mediverse database. It establishes standardized guidance for selecting partitioning methods, identifying partition candidates, managing partition lifecycles, optimizing query performance through partition pruning, maintaining local indexes, and governing partition operations. By leveraging PostgreSQL native partitioning, automated lifecycle management, and continuous monitoring, the Mediverse platform achieves scalable, high-performance data management capable of supporting enterprise-scale medical education, AI workloads, analytics, and long-term regulatory compliance.

---

**End of Chapter 48**

**Next:** **Chapter 49 – Materialized Views**.

---

# Chapter 49 — Materialized Views

---

# Chapter Overview

This chapter defines the **Materialized Views Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, implementing, refreshing, securing, monitoring, and governing materialized views to improve reporting performance, analytical processing, AI-assisted querying, and dashboard responsiveness.

Materialized views store the results of precomputed queries as physical database objects, reducing the computational cost of repeatedly executing complex joins and aggregations on large datasets.

The strategy is designed for **PostgreSQL 17+** and integrates with indexing, partitioning, query optimization, caching, and analytics.

---

# 49.1 Introduction

The Mediverse platform supports thousands of concurrent users, administrators, faculty members, AI services, and reporting systems.

Many business operations require complex queries involving:

* Student progress
* Course completion
* Assessment analytics
* Faculty performance
* AI usage metrics
* Certificate issuance
* Institutional dashboards
* Regulatory reports

Executing these queries repeatedly against transactional tables would significantly increase database load.

Materialized views solve this problem by storing precomputed query results that can be refreshed periodically or on demand.

---

# 49.2 Objectives

The objectives of Materialized Views are to:

* Improve reporting performance.
* Reduce expensive query execution.
* Minimize repetitive aggregations.
* Accelerate dashboard loading.
* Improve AI analytics retrieval.
* Reduce database resource utilization.
* Support enterprise BI workloads.
* Simplify reporting architecture.
* Improve scalability.
* Standardize refresh governance.

---

### MVT-001

Materialized views shall be used only for documented high-cost query workloads.

---

### MVT-002

Materialized views shall not replace normalized transactional tables.

---

# 49.3 Materialized View Architecture

```text id="mvt1"
Transactional Tables
        │
        ▼
 Complex SQL Query
        │
        ▼
 Materialized View
        │
        ▼
 Dashboards
 Reports
 AI Analytics
```

Materialized views provide read-optimized datasets while preserving the integrity of the underlying transactional model.

---

### MVT-003

Applications shall treat materialized views as read-only data sources.

---

### MVT-004

Transactional updates shall occur only against base tables.

---

# 49.4 Design Principles

The Mediverse platform follows these principles:

1. Build views for expensive queries.
2. Keep transactional data normalized.
3. Refresh based on business requirements.
4. Minimize refresh impact.
5. Support incremental refresh where possible.
6. Secure sensitive aggregated data.
7. Monitor freshness.
8. Index materialized views.
9. Document dependencies.
10. Automate lifecycle management.

---

### MVT-005

Materialized view design shall be driven by measured workload analysis.

---

### MVT-006

Each materialized view shall have documented business ownership.

---

# 49.5 Candidate Materialized Views

The following workloads are ideal candidates.

| Business Area           | Materialized View         |
| ----------------------- | ------------------------- |
| Student Analytics       | mv_student_progress       |
| Course Analytics        | mv_course_statistics      |
| Assessment              | mv_assessment_summary     |
| Faculty                 | mv_faculty_performance    |
| Certificates            | mv_certificate_statistics |
| Notifications           | mv_notification_metrics   |
| AI                      | mv_ai_usage_summary       |
| Institutional Reporting | mv_dashboard_summary      |
| Audit                   | mv_security_events        |
| Learning Analytics      | mv_learning_trends        |

These views reduce repeated execution of expensive analytical queries.

---

### MVT-007

Candidate views shall be evaluated using execution cost and usage frequency.

---

### MVT-008

Duplicate analytical datasets shall be avoided.

---

# 49.6 Creation Standards

Example:

```sql id="mvt_sql_1"
CREATE MATERIALIZED VIEW mv_student_progress AS

SELECT
student_id,
COUNT(*) AS completed_lessons,
AVG(score) AS average_score

FROM assessment_results

GROUP BY student_id;
```

Naming convention:

```text id="mvt2"
mv_student_progress

mv_course_statistics

mv_ai_usage_summary
```

---

### MVT-009

Materialized view names shall use the enterprise `mv_` prefix.

---

### MVT-010

Every materialized view definition shall be version controlled.

---

# 49.7 Refresh Strategy

Materialized views require periodic refreshing.

Supported strategies:

| Refresh Type | Usage                     |
| ------------ | ------------------------- |
| Manual       | Administrative operations |
| Scheduled    | Regular reporting         |
| On-Demand    | User-triggered analytics  |
| Event-Driven | Business events           |
| Concurrent   | High-availability refresh |

Example:

```sql id="mvt_sql_2"
REFRESH MATERIALIZED VIEW
CONCURRENTLY mv_student_progress;
```

Refresh frequency examples:

* Hourly
* Daily
* Weekly
* Monthly
* Real-time (where justified)

---

### MVT-011

Refresh schedules shall align with business data freshness requirements.

---

### MVT-012

Concurrent refresh shall be preferred for production reporting workloads where supported.

---

# 49.8 Incremental Refresh

Whenever supported through application logic or staged processing, incremental refresh minimizes processing costs.

Example workflow:

```text id="mvt3"
Changed Records

↓

Delta Processing

↓

Materialized View Refresh

↓

Updated Analytics
```

Advantages:

* Reduced execution time
* Lower CPU usage
* Less I/O
* Faster dashboards

---

### MVT-013

Incremental refresh mechanisms should be preferred for high-volume datasets.

---

### MVT-014

Refresh processes shall maintain transactional consistency.

---

# 49.9 Indexing Materialized Views

Materialized views require independent indexes.

Example:

```sql id="mvt_sql_3"
CREATE INDEX idx_mv_student_progress

ON mv_student_progress(student_id);
```

Recommended indexes:

* Student ID
* Course ID
* Institution ID
* Date
* Status
* Certificate Number

---

### MVT-015

Frequently queried columns shall be indexed.

---

### MVT-016

Materialized view indexes shall be reviewed during performance tuning.

---

# 49.10 Dependency Management

Materialized views depend upon transactional objects.

```text id="mvt4"
Students

↓

Assessments

↓

Assessment Results

↓

Materialized View

↓

Dashboard
```

Dependency documentation shall include:

* Source tables
* Source views
* Business owner
* Refresh owner
* Refresh schedule
* Downstream consumers

---

### MVT-017

Dependencies shall be fully documented.

---

### MVT-018

Changes to source objects shall trigger dependency impact analysis.

---

# 49.11 AI & Analytics Views

AI modules require specialized analytical datasets.

Examples:

* AI prompt statistics
* Model usage
* Token consumption
* Knowledge retrieval
* Conversation analytics
* Citation usage
* Recommendation quality

Example:

```text id="mvt5"
AI Events

↓

Aggregation

↓

Materialized View

↓

AI Dashboard
```

These views support AI governance and operational monitoring.

---

### MVT-019

AI operational analytics shall use optimized precomputed datasets where appropriate.

---

### MVT-020

AI reporting views shall exclude sensitive prompt content unless explicitly authorized.

---

# 49.12 Monitoring & Maintenance

Continuous monitoring ensures optimal operation.

Metrics include:

* Refresh duration
* Refresh failures
* Data freshness
* Query latency
* Storage usage
* Index efficiency
* Consumer activity

Maintenance tasks:

* Refresh scheduling
* REINDEX
* VACUUM
* ANALYZE
* Dependency validation
* Storage optimization

---

### MVT-021

Materialized view health shall be continuously monitored.

---

### MVT-022

Refresh failures shall trigger operational alerts.

---

# 49.13 Performance Considerations

Materialized views improve read performance but increase maintenance overhead.

Optimization strategies:

* Refresh only when necessary.
* Use concurrent refresh.
* Minimize source query complexity.
* Partition source tables.
* Index materialized views.
* Avoid redundant views.
* Monitor refresh windows.

Materialized views shall be evaluated periodically to ensure continued business value.

---

### MVT-023

Refresh operations shall minimize impact on transactional workloads.

---

### MVT-024

Materialized view performance shall be benchmarked under production-scale workloads.

---

# 49.14 Security & Compliance

Materialized views may aggregate sensitive information.

Required controls:

* Role-Based Access Control (RBAC)
* Row-Level Security (where applicable)
* Data masking
* Audit logging
* Encryption
* GDPR compliance
* HIPAA-ready operational controls

Sensitive analytical datasets shall only be accessible to authorized users.

---

### MVT-025

Materialized view access shall follow enterprise authorization policies.

---

### MVT-026

Sensitive aggregated data shall be protected using approved security controls.

---

# 49.15 Governance

Materialized view governance includes:

* Database Architecture Review Board
* Performance Engineering Team
* Database Administration Team
* Enterprise Data Governance Board
* Business Intelligence Team
* Security Review Committee
* Site Reliability Engineering (SRE)
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Business justification
* Performance validation
* Storage assessment
* Security review
* Documentation updates

---

### MVT-027

Materialized view lifecycle changes shall require formal governance approval.

---

### MVT-028

Materialized view documentation shall remain synchronized with implementation.

---

# 49.16 Traceability

This chapter defines enterprise standards for materialized views within the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 48 – Partitioning Strategy
* Chapter 50 – Database Views
* Chapter 51 – Read Replicas & Scaling
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Administration Guide
* Architecture Decision Records (ADR)

**Applies To**

* Materialized Views
* Refresh Strategies
* Analytical Reporting
* Dashboard Optimization
* AI Analytics
* Indexing
* Monitoring
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Materialized Views Strategy for the Mediverse database. It establishes standardized guidance for identifying analytical workloads, designing read-optimized datasets, implementing refresh strategies, indexing materialized views, managing dependencies, supporting AI and business intelligence, and maintaining operational health. By leveraging PostgreSQL materialized views with automated governance, performance monitoring, and secure access controls, the Mediverse platform delivers scalable, high-performance reporting while protecting the integrity of its transactional database.

---

**End of Chapter 49**

**Next:** **Chapter 50 – Database Views**.

---

# Chapter 50 — Database Views

---

# Chapter Overview

This chapter defines the **Database Views Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, implementing, securing, maintaining, and governing database views to simplify data access, enforce security boundaries, improve code reusability, and provide consistent logical representations of underlying data.

Unlike materialized views, standard database views do not physically store data. Instead, they execute the underlying SQL statement whenever queried, ensuring users always access the most current information while abstracting the complexity of the physical schema.

The strategy is designed for **PostgreSQL 17+** and integrates with security policies, reporting, API development, analytics, and enterprise data governance.

---

# 50.1 Introduction

As Mediverse evolves, the underlying database schema becomes increasingly complex, with hundreds of normalized tables spanning multiple functional domains.

Database views provide a logical abstraction layer that:

* Simplifies SQL development
* Hides implementation complexity
* Restricts direct table access
* Standardizes business queries
* Improves API consistency
* Supports reporting
* Enables secure data sharing
* Protects sensitive information

Views expose only the data required by specific consumers while preserving normalization within the base tables.

---

# 50.2 Objectives

The objectives of Database Views are to:

* Simplify data access.
* Improve query readability.
* Reduce SQL duplication.
* Support security policies.
* Hide schema complexity.
* Provide reusable business logic.
* Improve API consistency.
* Enable controlled reporting.
* Support enterprise governance.
* Maintain logical data abstraction.

---

### DBV-001

Database views shall expose only business-approved data.

---

### DBV-002

Views shall not replace properly normalized database design.

---

# 50.3 View Architecture

```text id="dbv1"
Applications
      │
      ▼
 Database Views
      │
      ▼
Normalized Tables
      │
      ▼
Physical Storage
```

Applications interact primarily with views, while views abstract the complexity of underlying schemas.

---

### DBV-003

Views shall provide logical abstraction over normalized database objects.

---

### DBV-004

Applications should avoid direct access to transactional tables unless explicitly approved.

---

# 50.4 View Design Principles

The Mediverse platform follows these principles:

1. Keep views focused.
2. Expose only required columns.
3. Avoid unnecessary complexity.
4. Use consistent naming.
5. Document business ownership.
6. Secure sensitive information.
7. Avoid excessive nesting.
8. Optimize frequently used views.
9. Maintain version control.
10. Govern lifecycle changes.

---

### DBV-005

View definitions shall remain simple, maintainable, and business-oriented.

---

### DBV-006

Each view shall have an identified business owner.

---

# 50.5 View Classification

Views are categorized according to their purpose.

| View Type            | Purpose                                |
| -------------------- | -------------------------------------- |
| Operational Views    | Support day-to-day business operations |
| Reporting Views      | Business intelligence and reporting    |
| Security Views       | Restrict sensitive data                |
| API Views            | Backend service integration            |
| Administrative Views | Operational management                 |
| Analytics Views      | Dashboard and KPI reporting            |
| AI Views             | AI feature support                     |
| Audit Views          | Compliance and investigation           |

---

### DBV-007

Every database view shall belong to an approved enterprise category.

---

### DBV-008

View usage shall be documented within the enterprise data catalog.

---

# 50.6 Naming Standards

Views shall follow standardized naming conventions.

Examples:

```text id="dbv2"
vw_student_profile

vw_course_catalog

vw_faculty_directory

vw_certificate_summary

vw_ai_usage

vw_dashboard_metrics
```

Prefixes:

* `vw_` — Standard database view
* `mv_` — Materialized view
* `sec_` — Security-restricted view (optional organizational prefix)

---

### DBV-009

All standard views shall use the `vw_` naming prefix.

---

### DBV-010

View names shall clearly describe their business purpose.

---

# 50.7 Operational Views

Operational views simplify application development.

Examples:

* Student Profile
* Faculty Dashboard
* Course Catalog
* Active Lessons
* Enrollment Summary
* Assessment Overview

Example:

```sql id="dbv_sql_1"
CREATE VIEW vw_student_profile AS

SELECT
s.student_id,
u.first_name,
u.last_name,
u.email

FROM students s

JOIN users u
ON s.user_id = u.id;
```

Applications consume the view rather than repeatedly implementing identical JOIN logic.

---

### DBV-011

Frequently reused business queries should be encapsulated within database views.

---

### DBV-012

Operational views shall expose only required business attributes.

---

# 50.8 Reporting Views

Reporting views support dashboards and institutional reporting.

Examples:

* Student completion rates
* Faculty workload
* Assessment statistics
* Certificate issuance
* Course enrollment trends
* AI adoption metrics

Reporting views may combine multiple transactional tables while remaining read-only.

---

### DBV-013

Reporting views shall be optimized for analytical consumption.

---

### DBV-014

Frequently executed reporting workloads should be evaluated for conversion to materialized views.

---

# 50.9 Security Views

Security views limit access to confidential information.

Example:

```text id="dbv3"
Users Table

↓

Security View

↓

Applications
```

Examples:

* Hide password hashes
* Hide authentication tokens
* Mask personally identifiable information (PII)
* Restrict administrative fields
* Limit AI configuration visibility

Security views enforce the principle of least privilege.

---

### DBV-015

Sensitive attributes shall be excluded or masked within security views.

---

### DBV-016

Security views shall align with enterprise RBAC policies.

---

# 50.10 API Integration Views

Backend services may use specialized views for API responses.

Examples:

* Student Dashboard API
* Course Listing API
* Faculty Profile API
* Certificate Verification API
* AI Knowledge API

Benefits:

* Reduced SQL duplication
* Stable API contracts
* Simplified backend services

---

### DBV-017

API-oriented views shall provide stable logical contracts for consuming services.

---

### DBV-018

API views shall avoid exposing internal implementation details.

---

# 50.11 AI Support Views

AI modules consume curated datasets through specialized views.

Examples:

* Approved knowledge articles
* Medical terminology
* Learning progress
* Citation metadata
* Prompt templates
* AI usage statistics

Example workflow:

```text id="dbv4"
Knowledge Tables

↓

AI View

↓

Retrieval Layer

↓

Large Language Model
```

AI views ensure only validated and approved information is exposed to retrieval systems.

---

### DBV-019

AI views shall expose only approved knowledge assets.

---

### DBV-020

Sensitive AI metadata shall remain inaccessible through public views.

---

# 50.12 View Performance

Although views store no data, poorly designed definitions can degrade performance.

Optimization strategies:

* Avoid unnecessary nesting.
* Minimize complex joins.
* Index underlying tables.
* Filter early.
* Avoid SELECT *.
* Monitor execution plans.
* Use materialized views for expensive reporting.

Performance testing shall be conducted before production deployment.

---

### DBV-021

View performance shall be evaluated using execution plans.

---

### DBV-022

Complex reporting views shall undergo periodic performance review.

---

# 50.13 View Security

Views contribute significantly to enterprise security.

Required controls:

* Role-Based Access Control (RBAC)
* Column-level exposure
* Row-Level Security (RLS)
* Data masking
* Audit logging
* Encryption
* Least privilege
* Regulatory compliance

Views may serve as the primary interface for external reporting users.

---

### DBV-023

View permissions shall follow the principle of least privilege.

---

### DBV-024

Unauthorized users shall not gain access to restricted information through database views.

---

# 50.14 View Lifecycle Management

Views follow a controlled lifecycle.

```text id="dbv5"
Design

↓

Review

↓

Development

↓

Testing

↓

Production

↓

Versioning

↓

Retirement
```

Lifecycle activities include:

* Definition management
* Dependency tracking
* Version control
* Regression testing
* Documentation updates
* Controlled deprecation

---

### DBV-025

View lifecycle changes shall be managed through formal change control.

---

### DBV-026

Deprecated views shall remain available only during approved transition periods.

---

# 50.15 Monitoring & Maintenance

Continuous monitoring ensures view reliability.

Monitoring metrics:

* Execution frequency
* Query latency
* Consumer applications
* Dependency health
* Security violations
* Error rates

Maintenance tasks:

* Execution plan review
* Dependency validation
* Permission audit
* Documentation review
* Performance optimization

---

### DBV-027

View usage shall be continuously monitored.

---

### DBV-028

Unused or obsolete views shall be periodically reviewed for retirement.

---

# 50.16 Governance

Database view governance includes:

* Database Architecture Review Board
* Database Administration Team
* Enterprise Data Governance Board
* Business Intelligence Team
* Security Review Committee
* API Architecture Team
* Quality Assurance Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Business validation
* Security review
* Performance assessment
* Dependency analysis
* Documentation updates

---

### DBV-029

View definition changes shall require formal governance approval.

---

### DBV-030

View documentation shall remain synchronized with implemented database objects.

---

# 50.17 Traceability

This chapter defines enterprise standards for database views within the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 49 – Materialized Views
* Chapter 51 – Read Replicas & Scaling
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Enterprise Data Catalog
* PostgreSQL Administration Guide
* Architecture Decision Records (ADR)

**Applies To**

* Operational Views
* Reporting Views
* Security Views
* API Integration Views
* AI Support Views
* View Performance
* View Governance
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Database Views Strategy for the Mediverse database. It establishes standardized guidance for creating logical data abstractions that simplify application development, enhance security, support reporting, and provide stable interfaces for APIs and AI services. By applying consistent naming conventions, enforcing access controls, optimizing performance, and governing the complete lifecycle of database views, the Mediverse platform delivers secure, maintainable, and scalable data access while preserving the integrity of its normalized transactional model.

---

**End of Chapter 50**

**Next:** **Chapter 51 – Read Replicas & Scaling**.

---

# Chapter 51 — Read Replicas & Scaling

---

# Chapter Overview

This chapter defines the **Read Replicas & Scaling Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for scaling PostgreSQL using read replicas, workload distribution, connection routing, replication monitoring, failover, and high availability.

The Mediverse platform serves students, faculty, administrators, AI services, and external integrations simultaneously. As the platform grows, a single database instance cannot efficiently handle increasing read-heavy workloads such as dashboards, analytics, AI retrieval, reporting, and certificate verification.

This strategy leverages **PostgreSQL 17+ Streaming Replication**, **Patroni**, **PgBouncer**, **HAProxy**, and **Kubernetes StatefulSets** to achieve enterprise-grade scalability and resilience.

---

# 51.1 Introduction

Enterprise applications typically experience a significantly higher volume of read operations than write operations.

Typical workload distribution:

* Authentication lookups
* Course catalog browsing
* Student dashboards
* Lesson retrieval
* AI knowledge search
* Certificate verification
* Analytics
* Administrative reporting

Without workload separation, the primary database becomes a bottleneck.

Read replicas improve scalability by offloading read-intensive workloads while preserving a single authoritative write node.

---

# 51.2 Objectives

The objectives of Read Replicas & Scaling are to:

* Increase read throughput.
* Reduce database contention.
* Improve response times.
* Support horizontal scaling.
* Enable high availability.
* Reduce reporting impact.
* Improve AI retrieval performance.
* Support disaster recovery.
* Improve operational resilience.
* Standardize enterprise scaling.

---

### RRS-001

Read-intensive workloads shall utilize replica databases wherever appropriate.

---

### RRS-002

The primary database shall remain the authoritative write source.

---

# 51.3 High-Level Architecture

```text id="rrs1"
                  Applications
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
         Write Router       Read Router
              │                   │
              ▼                   ▼
      Primary PostgreSQL     Read Replicas
              │          ┌────────┼────────┐
              │          ▼        ▼        ▼
              │      Replica 1 Replica 2 Replica 3
              │
              ▼
        WAL Streaming
```

Applications route write requests to the primary node while distributing read operations across multiple replicas.

---

### RRS-003

Write traffic shall never be directed to read replicas.

---

### RRS-004

Read routing shall be managed through centralized infrastructure components.

---

# 51.4 Scaling Principles

The Mediverse platform follows these scaling principles:

1. Single write authority.
2. Multiple read replicas.
3. Automatic failover.
4. Stateless application services.
5. Connection pooling.
6. Horizontal scalability.
7. Infrastructure automation.
8. Continuous monitoring.
9. Fault isolation.
10. Zero-downtime maintenance where practical.

---

### RRS-005

Scaling architecture shall preserve transactional consistency.

---

### RRS-006

Infrastructure scaling shall remain transparent to application services.

---

# 51.5 Read Replica Architecture

Example deployment:

```text id="rrs2"
                PostgreSQL Primary
                      │
          Streaming Replication
      ┌────────────┼────────────┐
      ▼            ▼            ▼
Replica A      Replica B    Replica C
```

Each replica:

* Receives WAL updates
* Serves read-only traffic
* Maintains identical schema
* Supports reporting workloads

---

### RRS-007

Read replicas shall remain synchronized using streaming replication.

---

### RRS-008

Replica lag shall remain within approved service-level objectives (SLOs).

---

# 51.6 Workload Distribution

Typical workload routing:

| Workload                 | Destination |
| ------------------------ | ----------- |
| INSERT                   | Primary     |
| UPDATE                   | Primary     |
| DELETE                   | Primary     |
| Authentication Writes    | Primary     |
| Student Dashboard        | Replica     |
| Course Catalog           | Replica     |
| AI Retrieval             | Replica     |
| Analytics                | Replica     |
| Reporting                | Replica     |
| Certificate Verification | Replica     |

This separation maximizes overall throughput while protecting transactional performance.

---

### RRS-009

Read-only workloads shall be prioritized for replica execution.

---

### RRS-010

Transactional workloads shall execute exclusively on the primary node.

---

# 51.7 Streaming Replication

Streaming replication continuously transfers Write-Ahead Log (WAL) records from the primary database to replicas.

```text id="rrs3"
Write Transaction

↓

WAL Generation

↓

Streaming

↓

Replica Replay

↓

Read Availability
```

Benefits:

* Low replication latency
* Continuous synchronization
* Minimal operational overhead
* Native PostgreSQL support

---

### RRS-011

Replication shall use PostgreSQL streaming replication.

---

### RRS-012

Replication channels shall be encrypted during transmission.

---

# 51.8 Replica Consistency

Replication is asynchronous by default.

Consistency considerations:

* Eventual consistency
* Replica lag
* Read-after-write scenarios
* Session affinity
* Critical transaction routing

Applications requiring immediate consistency shall query the primary database.

---

### RRS-013

Applications requiring strong consistency shall read from the primary database.

---

### RRS-014

Replica lag shall be monitored continuously.

---

# 51.9 Connection Pooling

Connection pooling improves scalability.

Recommended components:

* PgBouncer
* Pgpool-II (optional)
* HAProxy
* Kubernetes Services

Architecture:

```text id="rrs4"
Application

↓

PgBouncer

↓

Primary / Replica
```

Benefits:

* Lower connection overhead
* Faster response
* Better concurrency
* Improved resource utilization

---

### RRS-015

Database connections shall be managed using connection pooling.

---

### RRS-016

Connection pools shall be tuned according to workload characteristics.

---

# 51.10 Load Balancing

Read traffic is distributed across replicas.

Example:

```text id="rrs5"
Client

↓

HAProxy

↓

Replica A

Replica B

Replica C
```

Load balancing strategies:

* Round Robin
* Least Connections
* Weighted Distribution
* Health-Aware Routing

Selection depends on infrastructure and workload.

---

### RRS-017

Replica selection shall use health-aware load balancing.

---

### RRS-018

Unhealthy replicas shall be automatically removed from service.

---

# 51.11 Failover Strategy

Automatic failover minimizes downtime.

```text id="rrs6"
Primary Failure

↓

Failure Detection

↓

Replica Promotion

↓

Application Reconnect

↓

Recovered Service
```

Recommended tools:

* Patroni
* etcd
* Kubernetes Operator
* HAProxy

Automatic failover shall preserve data integrity.

---

### RRS-019

Primary node failures shall trigger automated failover procedures.

---

### RRS-020

Failover events shall be fully audited.

---

# 51.12 Monitoring & Observability

Continuous monitoring ensures healthy replication.

Metrics include:

* Replication lag
* WAL generation rate
* Replay delay
* Replica availability
* Connection count
* Query latency
* CPU utilization
* Memory usage
* Disk throughput

Monitoring stack:

* PostgreSQL Exporter
* Prometheus
* Grafana
* Alertmanager

---

### RRS-021

Replication health shall be continuously monitored.

---

### RRS-022

Operational alerts shall be generated for replication failures.

---

# 51.13 Performance Considerations

Read replicas improve scalability but introduce operational complexity.

Optimization strategies:

* Route reporting to replicas.
* Minimize replica lag.
* Monitor WAL generation.
* Tune connection pools.
* Scale replicas horizontally.
* Optimize network latency.
* Balance workload evenly.

Regular performance testing validates scaling effectiveness.

---

### RRS-023

Replica capacity shall be validated through performance benchmarking.

---

### RRS-024

Scaling decisions shall be based on observed workload characteristics.

---

# 51.14 Security & Compliance

Replication infrastructure shall follow enterprise security policies.

Required controls:

* TLS encryption
* Mutual authentication
* RBAC
* Secrets management
* Audit logging
* Network segmentation
* Encryption at rest
* GDPR compliance
* HIPAA-ready operational controls

Only authorized infrastructure components may access replication channels.

---

### RRS-025

Replication traffic shall be encrypted.

---

### RRS-026

Administrative access to replication infrastructure shall require strong authentication.

---

# 51.15 Governance

Read Replica governance includes:

* Database Architecture Review Board
* Database Administration Team
* Platform Engineering Team
* Site Reliability Engineering (SRE)
* Security Review Committee
* Enterprise Data Governance Board
* Infrastructure Operations Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Capacity planning
* Performance testing
* High-availability validation
* Disaster recovery review
* Documentation updates

---

### RRS-027

Scaling architecture modifications shall require formal governance approval.

---

### RRS-028

Replication topology documentation shall remain synchronized with production infrastructure.

---

# 51.16 Traceability

This chapter defines enterprise standards for Read Replicas & Scaling within the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 48 – Partitioning Strategy
* Chapter 49 – Materialized Views
* Chapter 58 – Backup, Recovery & Archival
* Chapter 60 – Production Readiness & Governance
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL High Availability Guide
* Architecture Decision Records (ADR)

**Applies To**

* Read Replicas
* Streaming Replication
* Connection Pooling
* Load Balancing
* Replica Consistency
* Automatic Failover
* Monitoring
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Read Replicas & Scaling Strategy for the Mediverse database. It establishes standardized guidance for workload distribution, streaming replication, replica consistency, connection pooling, load balancing, automatic failover, monitoring, and governance. By leveraging PostgreSQL streaming replication, health-aware routing, automated failover, and enterprise observability, the Mediverse platform achieves scalable, highly available, and resilient database operations capable of supporting millions of users, AI-driven workloads, and mission-critical medical education services.

---

**End of Chapter 51**

**Next:** **Chapter 52 – Connection Pooling Strategy**.

---

# Chapter 52 — Connection Pooling Strategy

---

# Chapter Overview

This chapter defines the **Connection Pooling Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for efficient database connection management, resource optimization, scalability, high availability, security, and operational monitoring.

Database connections are among the most expensive resources in a relational database system. Creating and destroying connections for every request significantly increases latency, CPU utilization, memory consumption, and authentication overhead. Connection pooling addresses these challenges by maintaining reusable pools of active database connections that can be efficiently shared across application workloads.

The Mediverse platform adopts **PgBouncer** as the primary connection pooling solution for **PostgreSQL 17+**, integrated with **Spring Boot**, **HikariCP**, **Kubernetes**, and **HAProxy** to deliver enterprise-grade performance and scalability.

---

# 52.1 Introduction

The Mediverse platform supports multiple concurrent workloads, including:

* Student authentication
* Course browsing
* AI-assisted learning
* Assessment processing
* Certificate generation
* Administrative operations
* Analytics reporting
* Notification delivery
* API integrations

Each workload requires efficient access to the database. Without connection pooling, every request would establish a new database session, leading to:

* Increased latency
* Higher CPU utilization
* Memory exhaustion
* Authentication overhead
* Reduced scalability
* Connection storms
* Resource contention

Connection pooling minimizes these costs by reusing established connections.

---

# 52.2 Objectives

The objectives of the Connection Pooling Strategy are to:

* Reduce connection overhead.
* Improve response times.
* Increase concurrency.
* Optimize resource utilization.
* Support horizontal scaling.
* Reduce authentication cost.
* Improve availability.
* Simplify connection management.
* Enhance operational monitoring.
* Standardize enterprise configuration.

---

### CPS-001

All production database access shall utilize managed connection pools.

---

### CPS-002

Applications shall not establish unmanaged database connections.

---

# 52.3 Connection Pooling Architecture

```text id="cps1"
             Client Requests
                   │
                   ▼
          Spring Boot Services
                   │
                   ▼
              HikariCP Pool
                   │
                   ▼
              PgBouncer
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 Primary PostgreSQL      Read Replicas
```

The architecture separates application-level pooling from infrastructure-level pooling to maximize efficiency.

---

### CPS-003

Application services shall access PostgreSQL through approved connection pooling layers.

---

### CPS-004

Infrastructure pooling shall remain transparent to business applications.

---

# 52.4 Pooling Principles

The Mediverse platform follows these principles:

1. Reuse existing connections.
2. Limit maximum connections.
3. Prevent connection leaks.
4. Monitor pool health.
5. Scale dynamically.
6. Optimize idle connections.
7. Separate read and write pools.
8. Secure pooled connections.
9. Tune pools using production metrics.
10. Automate operational monitoring.

---

### CPS-005

Connection pool sizing shall be workload-driven.

---

### CPS-006

Pool configuration shall be reviewed periodically using operational metrics.

---

# 52.5 Connection Pool Components

| Component   | Purpose                     |
| ----------- | --------------------------- |
| Spring Boot | Application framework       |
| HikariCP    | Application connection pool |
| PgBouncer   | PostgreSQL connection proxy |
| PostgreSQL  | Database server             |
| HAProxy     | Traffic routing             |
| Kubernetes  | Container orchestration     |
| Prometheus  | Monitoring                  |
| Grafana     | Visualization               |

Responsibilities:

* HikariCP manages application-side pooling.
* PgBouncer manages server-side connection multiplexing.
* PostgreSQL processes SQL execution.

---

### CPS-007

Approved pooling components shall be standardized across all environments.

---

### CPS-008

Alternative pooling technologies require architectural approval.

---

# 52.6 Pooling Modes

PgBouncer supports multiple pooling modes.

| Mode        | Description                            | Recommended   |
| ----------- | -------------------------------------- | ------------- |
| Session     | One client per server connection       | Limited       |
| Transaction | Connection reused after transaction    | **Preferred** |
| Statement   | Connection reused after each statement | Specialized   |

The Mediverse platform adopts **Transaction Pooling** for most production workloads.

Benefits:

* Better scalability
* Lower memory usage
* High throughput
* Efficient connection reuse

---

### CPS-009

Transaction pooling shall be the default production mode.

---

### CPS-010

Session pooling shall be limited to workloads requiring persistent session state.

---

# 52.7 Pool Sizing Strategy

Connection pool size depends on:

* CPU cores
* Database capacity
* Concurrent users
* Application instances
* Query complexity
* Read/write ratio

Example sizing:

| Environment | Max Pool Size                                                   |
| ----------- | --------------------------------------------------------------- |
| Development | 10                                                              |
| Test        | 20                                                              |
| UAT         | 50                                                              |
| Production  | 100–300 (per application cluster, subject to capacity planning) |

Pool sizes shall be validated through load testing.

---

### CPS-011

Pool sizes shall be determined through capacity planning.

---

### CPS-012

Pool limits shall protect database stability during peak load.

---

# 52.8 Connection Lifecycle

```text id="cps2"
Application Starts

↓

Pool Initialization

↓

Connection Borrowed

↓

SQL Execution

↓

Connection Returned

↓

Idle Pool

↓

Reuse

↓

Retirement
```

Connection lifecycle events include:

* Creation
* Validation
* Checkout
* Execution
* Return
* Idle timeout
* Eviction

---

### CPS-013

Connections shall be returned to the pool immediately after use.

---

### CPS-014

Idle connections shall be retired according to approved timeout policies.

---

# 52.9 Connection Validation

Connections must be validated before use.

Validation includes:

* Network availability
* Authentication
* Database availability
* Transaction state
* Timeout verification

Typical validation query:

```sql id="cps_sql_1"
SELECT 1;
```

Validation prevents applications from using stale or broken connections.

---

### CPS-015

Connections shall be validated before allocation to application threads.

---

### CPS-016

Failed connections shall be removed automatically from the active pool.

---

# 52.10 Leak Detection

Connection leaks reduce scalability.

Leak detection strategies:

* Borrow timeout monitoring
* Maximum lifetime limits
* Active connection tracking
* Thread diagnostics
* Pool exhaustion alerts

Example workflow:

```text id="cps3"
Connection Borrowed

↓

Not Returned

↓

Leak Detection

↓

Alert

↓

Recovery
```

---

### CPS-017

Connection leaks shall be automatically detected.

---

### CPS-018

Leak events shall generate operational alerts.

---

# 52.11 Read/Write Pool Separation

Read and write workloads use separate pools.

```text id="cps4"
Application

│

├── Write Pool

│      │

│      ▼

│  Primary Database

│

└── Read Pool

       │

       ▼

Read Replicas
```

Benefits:

* Better scalability
* Reduced contention
* Optimized resource allocation
* Improved response time

---

### CPS-019

Read and write traffic shall use independent connection pools.

---

### CPS-020

Routing policies shall ensure transactional consistency.

---

# 52.12 Monitoring & Observability

Continuous monitoring ensures pool health.

Metrics:

* Active connections
* Idle connections
* Waiting requests
* Borrow latency
* Pool utilization
* Connection failures
* Timeout count
* Leak count

Monitoring stack:

* PgBouncer Exporter
* PostgreSQL Exporter
* Prometheus
* Grafana
* Alertmanager

---

### CPS-021

Connection pool health shall be continuously monitored.

---

### CPS-022

Pool exhaustion shall trigger immediate operational alerts.

---

# 52.13 Performance Considerations

Connection pooling improves:

* Throughput
* Response time
* CPU utilization
* Memory utilization
* Authentication overhead
* Scalability

Optimization strategies:

* Tune pool size.
* Configure idle timeouts.
* Monitor wait queues.
* Optimize SQL execution.
* Reduce long-running transactions.
* Balance read/write pools.

---

### CPS-023

Connection pool tuning shall be based on production performance metrics.

---

### CPS-024

Long-running database transactions shall be minimized to improve pool availability.

---

# 52.14 Security & Compliance

Connection pools shall comply with enterprise security requirements.

Controls include:

* TLS encryption
* Secure credential storage
* Secrets management
* Mutual authentication
* RBAC
* Connection auditing
* Credential rotation
* Least privilege
* GDPR compliance
* HIPAA-ready operational controls

Database credentials shall never be hardcoded within application source code.

---

### CPS-025

Database credentials shall be securely managed using approved secrets management solutions.

---

### CPS-026

All pooled connections shall use encrypted communication channels.

---

# 52.15 Governance

Connection Pool governance includes:

* Database Architecture Review Board
* Platform Engineering Team
* Database Administration Team
* Site Reliability Engineering (SRE)
* Security Review Committee
* Enterprise Performance Engineering Team
* Infrastructure Operations Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Capacity planning
* Performance testing
* Security assessment
* Operational validation
* Documentation updates

---

### CPS-027

Connection pool configuration changes shall require formal governance approval.

---

### CPS-028

Connection pooling documentation shall remain synchronized with production infrastructure.

---

# 52.16 Traceability

This chapter defines enterprise standards for Connection Pooling within the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 51 – Read Replicas & Scaling
* Chapter 58 – Backup, Recovery & Archival
* Chapter 60 – Production Readiness & Governance
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Administration Guide
* PgBouncer Documentation
* HikariCP Documentation
* Architecture Decision Records (ADR)

**Applies To**

* Connection Pooling
* HikariCP
* PgBouncer
* Read/Write Pool Separation
* Leak Detection
* Connection Validation
* Monitoring
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Connection Pooling Strategy for the Mediverse database. It establishes standardized guidance for application-level and infrastructure-level pooling, pool sizing, lifecycle management, connection validation, leak detection, read/write separation, monitoring, security, and governance. By integrating HikariCP, PgBouncer, PostgreSQL, and Kubernetes into a unified connection management architecture, the Mediverse platform achieves highly efficient resource utilization, reduced latency, improved scalability, and resilient database connectivity capable of supporting enterprise-scale medical education and AI-driven workloads.

---

**End of Chapter 52**

**Next:** **Chapter 53 – Stored Procedures Strategy**.

---

# Chapter 53 — Stored Procedures Strategy

---

# Chapter Overview

This chapter defines the **Stored Procedures Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, implementing, securing, versioning, monitoring, and governing stored procedures to support complex business operations, data consistency, performance optimization, and operational automation.

Stored procedures encapsulate reusable database logic within PostgreSQL, enabling standardized execution of business processes while reducing network round trips, improving transactional consistency, and centralizing critical data operations.

The strategy is designed for **PostgreSQL 17+** using **PL/pgSQL** and integrates with Spring Boot, Flyway, auditing, security, and enterprise DevOps practices.

---

# 53.1 Introduction

The Mediverse platform processes millions of business transactions throughout its lifecycle, including:

* Student enrollment
* Course registration
* Assessment submission
* Certificate issuance
* AI knowledge synchronization
* Notification processing
* Audit logging
* Administrative operations

While the majority of business logic resides within microservices, certain operations benefit from execution directly inside the database due to their transactional complexity, performance requirements, or need for atomic execution.

Stored procedures provide a secure and reusable mechanism for implementing these operations.

---

# 53.2 Objectives

The objectives of the Stored Procedures Strategy are to:

* Centralize reusable database logic.
* Improve transactional consistency.
* Reduce application complexity.
* Optimize performance.
* Minimize network overhead.
* Support operational automation.
* Improve maintainability.
* Standardize database programming.
* Enable secure execution.
* Support enterprise governance.

---

### SPS-001

Stored procedures shall be created only for approved enterprise use cases.

---

### SPS-002

Business logic shall remain primarily within application services unless database execution provides measurable benefit.

---

# 53.3 Stored Procedure Architecture

```text id="sps1"
Client Request
      │
      ▼
Spring Boot Service
      │
      ▼
Stored Procedure
      │
      ▼
PostgreSQL Engine
      │
      ▼
Transactional Tables
```

The application invokes stored procedures through parameterized database calls while maintaining clear separation between application logic and database logic.

---

### SPS-003

Applications shall invoke stored procedures through secure parameterized interfaces.

---

### SPS-004

Stored procedures shall execute within managed database transactions.

---

# 53.4 Design Principles

The Mediverse platform follows these principles:

1. Keep procedures cohesive.
2. Use parameterized inputs.
3. Avoid duplicated logic.
4. Return standardized outputs.
5. Maintain idempotency where applicable.
6. Support rollback on failure.
7. Log critical operations.
8. Version procedures through Flyway.
9. Minimize procedural complexity.
10. Document all interfaces.

---

### SPS-005

Stored procedures shall implement a single well-defined business responsibility.

---

### SPS-006

Procedure interfaces shall remain stable across compatible releases.

---

# 53.5 Candidate Stored Procedures

Typical enterprise procedures include:

| Business Area           | Procedure                   |
| ----------------------- | --------------------------- |
| Student Enrollment      | sp_enroll_student           |
| Assessment Submission   | sp_submit_assessment        |
| Certificate Issuance    | sp_issue_certificate        |
| Notification Processing | sp_process_notifications    |
| AI Synchronization      | sp_sync_ai_documents        |
| Audit Archival          | sp_archive_audit_logs       |
| Analytics Refresh       | sp_refresh_statistics       |
| User Deactivation       | sp_deactivate_user          |
| Bulk Import             | sp_import_students          |
| Maintenance             | sp_cleanup_expired_sessions |

Each procedure encapsulates transactional operations that benefit from database-side execution.

---

### SPS-007

Stored procedures shall be cataloged within the enterprise data dictionary.

---

### SPS-008

Every stored procedure shall have documented ownership.

---

# 53.6 Naming Standards

Naming conventions improve maintainability.

Examples:

```text id="sps2"
sp_enroll_student

sp_submit_assessment

sp_issue_certificate

sp_generate_progress

sp_archive_notifications
```

Prefixes:

* `sp_` — Stored Procedure
* `fn_` — Function
* `utl_` — Utility Procedure
* `adm_` — Administrative Procedure

---

### SPS-009

Stored procedure names shall use the approved enterprise prefix.

---

### SPS-010

Procedure names shall clearly reflect business intent.

---

# 53.7 Procedure Design Standards

Typical procedure structure:

```text id="sps3"
Input Validation

↓

Business Validation

↓

Transaction Start

↓

Business Processing

↓

Audit Logging

↓

Commit

↓

Return Result
```

Every procedure should include:

* Parameter validation
* Exception handling
* Audit logging
* Transaction management
* Standardized return values

---

### SPS-011

Input validation shall occur before business processing.

---

### SPS-012

Procedures shall generate audit events for business-critical operations.

---

# 53.8 Transaction Management

Stored procedures execute within ACID transactions.

Example:

```sql id="sps_sql_1"
BEGIN;

-- Business Operations

COMMIT;
```

Failure handling:

```text id="sps4"
Error

↓

Rollback

↓

Audit

↓

Error Response
```

Transaction boundaries shall remain well defined.

---

### SPS-013

Business-critical procedures shall execute atomically.

---

### SPS-014

Failures shall trigger complete transaction rollback.

---

# 53.9 Error Handling

Every procedure shall implement structured exception handling.

Example flow:

```text id="sps5"
Validation Error

↓

Business Exception

↓

Database Exception

↓

Rollback

↓

Error Code

↓

Application Response
```

Error responses shall include:

* Error Code
* Procedure Name
* Correlation ID
* Timestamp
* Business Message

Sensitive implementation details shall not be exposed.

---

### SPS-015

Exceptions shall be handled consistently across all procedures.

---

### SPS-016

Internal database details shall not be exposed to application consumers.

---

# 53.10 Performance Optimization

Stored procedures improve performance by:

* Reducing network round trips.
* Executing near the data.
* Reusing execution plans.
* Supporting batch operations.
* Reducing client-side processing.

Optimization techniques:

* Avoid unnecessary loops.
* Prefer set-based operations.
* Minimize dynamic SQL.
* Use indexed predicates.
* Batch large operations.

---

### SPS-017

Stored procedures shall prioritize set-based SQL operations.

---

### SPS-018

Performance shall be validated using production-scale benchmarks.

---

# 53.11 Security

Stored procedures form part of the database security boundary.

Required controls:

* Parameterized execution
* RBAC
* Least privilege
* SQL injection prevention
* Secure exception handling
* Audit logging
* Encryption
* Secrets management

Administrative procedures require elevated authorization.

---

### SPS-019

Procedure execution shall be restricted according to enterprise RBAC policies.

---

### SPS-020

Dynamic SQL shall be avoided unless properly parameterized and validated.

---

# 53.12 Versioning & Deployment

Stored procedures shall be managed through Flyway migrations.

Deployment lifecycle:

```text id="sps6"
Development

↓

Code Review

↓

Flyway Migration

↓

Testing

↓

Production

↓

Version Control
```

Each modification shall include:

* Version number
* Migration script
* Rollback strategy
* Documentation update

---

### SPS-021

Stored procedures shall be version controlled through Flyway.

---

### SPS-022

Production deployments shall use approved migration pipelines.

---

# 53.13 Monitoring & Maintenance

Operational monitoring includes:

* Execution count
* Average duration
* Failure rate
* Lock contention
* Deadlocks
* Resource utilization
* Wait events
* Blocking sessions

Monitoring tools:

* PostgreSQL Statistics
* pg_stat_statements
* Prometheus
* Grafana

---

### SPS-023

Stored procedure execution shall be continuously monitored.

---

### SPS-024

Performance regressions shall generate operational alerts.

---

# 53.14 Performance Considerations

Potential risks include:

* Excessive procedural complexity
* Long-running transactions
* Lock contention
* Dynamic SQL misuse
* Recursive execution
* Excessive cursor usage

Optimization strategies:

* Keep procedures focused.
* Minimize transaction duration.
* Avoid unnecessary recursion.
* Optimize underlying SQL.
* Monitor execution plans.

---

### SPS-025

Stored procedures shall remain lightweight and maintainable.

---

### SPS-026

Execution plans shall be periodically reviewed.

---

# 53.15 Governance

Stored Procedure governance includes:

* Database Architecture Review Board
* Database Administration Team
* Platform Engineering Team
* Security Review Committee
* Quality Assurance Team
* Enterprise Data Governance Board
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Business validation
* Performance testing
* Security assessment
* Migration review
* Documentation updates

---

### SPS-027

Stored procedure modifications shall require formal governance approval.

---

### SPS-028

Procedure documentation shall remain synchronized with implementation.

---

# 53.16 Traceability

This chapter defines enterprise standards for Stored Procedures within the Mediverse platform.

**Related Documents**

* Chapter 45 – Data Validation Rules
* Chapter 47 – Query Optimization
* Chapter 52 – Connection Pooling Strategy
* Chapter 54 – Trigger Design
* Chapter 57 – Migration Strategy (Flyway)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL PL/pgSQL Documentation
* Architecture Decision Records (ADR)

**Applies To**

* Stored Procedures
* PL/pgSQL
* Transaction Management
* Error Handling
* Security
* Versioning
* Monitoring
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Stored Procedures Strategy for the Mediverse database. It establishes standardized guidance for procedure design, transaction management, error handling, performance optimization, security, deployment, monitoring, and governance. By using PL/pgSQL procedures selectively for high-value transactional and operational workloads, integrating them with Flyway migrations and enterprise DevOps practices, and enforcing rigorous standards for security and maintainability, the Mediverse platform achieves efficient, reliable, and scalable database programming while preserving clear architectural boundaries between application services and database logic.

---

**End of Chapter 53**

**Next:** **Chapter 54 – Trigger Design**.

---

# Chapter 54 — Trigger Design

---

# Chapter Overview

This chapter defines the **Trigger Design Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, implementing, securing, monitoring, and governing database triggers to automate data integrity enforcement, auditing, event generation, and operational consistency.

Database triggers execute automatically when specific database events occur, providing a reliable mechanism for enforcing critical business rules that must execute regardless of the calling application. The Mediverse platform uses PostgreSQL triggers selectively to ensure consistency while avoiding excessive business logic within the database.

The strategy is designed for **PostgreSQL 17+** using **PL/pgSQL**, integrated with Spring Boot, Flyway, auditing, security, and enterprise DevOps practices.

---

# 54.1 Introduction

The Mediverse platform processes data from multiple applications, microservices, administrative tools, scheduled jobs, AI services, and external integrations.

Certain database operations require automatic execution regardless of the source application, including:

* Audit trail creation
* Timestamp updates
* Soft-delete processing
* Data validation
* Change tracking
* Event logging
* Derived data maintenance
* Security monitoring

Triggers provide a centralized mechanism to perform these actions consistently at the database level.

However, excessive trigger usage can reduce maintainability and introduce hidden execution paths. Therefore, triggers are reserved for infrastructure-level concerns rather than core business workflows.

---

# 54.2 Objectives

The objectives of the Trigger Design Strategy are to:

* Automate database integrity.
* Maintain audit trails.
* Enforce mandatory validations.
* Standardize timestamp management.
* Track data changes.
* Support operational automation.
* Improve consistency.
* Minimize application duplication.
* Enhance compliance.
* Standardize trigger governance.

---

### TRG-001

Triggers shall be implemented only for approved enterprise use cases.

---

### TRG-002

Core business workflows shall remain within application services unless database execution is mandatory.

---

# 54.3 Trigger Architecture

```text id="trg1"
Application

↓

INSERT / UPDATE / DELETE

↓

PostgreSQL Trigger

↓

Validation / Audit / Automation

↓

Table Update
```

Triggers execute automatically within the transaction that initiated the database operation.

---

### TRG-003

Trigger execution shall occur within the same transaction as the triggering statement.

---

### TRG-004

Trigger failures shall prevent invalid transaction commits.

---

# 54.4 Trigger Design Principles

The Mediverse platform follows these principles:

1. Keep triggers lightweight.
2. Avoid complex business logic.
3. Execute deterministically.
4. Maintain transactional consistency.
5. Minimize execution time.
6. Avoid recursive execution.
7. Log security-sensitive events.
8. Version all trigger definitions.
9. Document dependencies.
10. Monitor execution continuously.

---

### TRG-005

Trigger logic shall remain focused on infrastructure responsibilities.

---

### TRG-006

Trigger execution shall be deterministic and repeatable.

---

# 54.5 Trigger Types

Supported PostgreSQL trigger types:

| Trigger Type  | Description                    |
| ------------- | ------------------------------ |
| BEFORE INSERT | Execute before inserting a row |
| AFTER INSERT  | Execute after insertion        |
| BEFORE UPDATE | Execute before updating a row  |
| AFTER UPDATE  | Execute after update           |
| BEFORE DELETE | Execute before deletion        |
| AFTER DELETE  | Execute after deletion         |
| INSTEAD OF    | Used with views                |

Selection depends upon business and technical requirements.

---

### TRG-007

Trigger type selection shall match the intended operational behavior.

---

### TRG-008

Each trigger shall have documented execution timing.

---

# 54.6 Approved Trigger Use Cases

Approved enterprise trigger scenarios include:

| Category             | Purpose                     |
| -------------------- | --------------------------- |
| Audit Logging        | Capture data changes        |
| Timestamp Updates    | Maintain updated timestamps |
| Soft Delete          | Populate deletion metadata  |
| Version Tracking     | Increment entity versions   |
| History Tables       | Preserve historical records |
| Security Monitoring  | Log privileged operations   |
| Data Synchronization | Maintain derived values     |
| Event Recording      | Record operational events   |

Triggers shall not implement complete business workflows such as enrollment processing or certificate issuance.

---

### TRG-009

Triggers shall be limited to approved infrastructure responsibilities.

---

### TRG-010

Business workflow orchestration shall remain outside database triggers.

---

# 54.7 Naming Standards

Naming conventions:

```text id="trg2"
trg_student_audit

trg_course_updated

trg_assessment_history

trg_soft_delete

trg_notification_log
```

Supporting functions:

```text id="trg3"
fn_student_audit

fn_update_timestamp

fn_soft_delete
```

Prefixes:

* `trg_` — Trigger
* `fn_` — Trigger Function

---

### TRG-011

Trigger names shall follow approved enterprise naming conventions.

---

### TRG-012

Each trigger shall reference a uniquely named trigger function.

---

# 54.8 Audit Triggers

Audit triggers automatically capture database modifications.

Example workflow:

```text id="trg4"
UPDATE Student

↓

Trigger

↓

Audit Table

↓

Audit Record
```

Captured information:

* User ID
* Timestamp
* Operation
* Entity
* Primary Key
* Previous Values
* New Values
* Correlation ID

Audit triggers ensure comprehensive change tracking.

---

### TRG-013

Business-critical entities shall generate audit records through approved mechanisms.

---

### TRG-014

Audit triggers shall preserve complete change history.

---

# 54.9 Timestamp Management

Automatic timestamp maintenance ensures consistency.

Example:

```sql id="trg_sql_1"
NEW.updated_at := CURRENT_TIMESTAMP;
```

Typical managed fields:

* created_at
* updated_at
* deleted_at
* last_login_at
* processed_at

Applications should not manually update these attributes where automated triggers are configured.

---

### TRG-015

Timestamp fields shall be maintained consistently across enterprise entities.

---

### TRG-016

Automated timestamp updates shall occur within database transactions.

---

# 54.10 Soft Delete Triggers

Soft deletion preserves historical information.

Workflow:

```text id="trg5"
DELETE Request

↓

Trigger

↓

Update

is_deleted = true

deleted_at

deleted_by
```

The record remains available for audit, reporting, and regulatory compliance.

---

### TRG-017

Soft-delete triggers shall preserve historical records.

---

### TRG-018

Logical deletion shall be preferred over physical deletion for regulated business entities.

---

# 54.11 Change History Triggers

History triggers preserve entity evolution.

```text id="trg6"
Original Record

↓

Update

↓

History Table

↓

Current Record
```

Examples:

* Course revisions
* AI prompt versions
* Assessment configuration
* Institution settings
* Policy documents

---

### TRG-019

Critical configuration changes shall maintain historical versions.

---

### TRG-020

History tables shall preserve immutable historical snapshots.

---

# 54.12 Performance Considerations

Triggers introduce execution overhead.

Optimization strategies:

* Keep trigger logic minimal.
* Avoid nested trigger chains.
* Prevent recursion.
* Use efficient SQL.
* Minimize row-by-row processing.
* Batch downstream processing where practical.

Performance testing shall include trigger execution costs.

---

### TRG-021

Trigger execution shall remain lightweight.

---

### TRG-022

Trigger performance shall be validated during load testing.

---

# 54.13 Security

Trigger execution occurs with database privileges.

Required controls:

* Role-Based Access Control (RBAC)
* Least privilege
* Secure trigger functions
* Audit logging
* Parameter validation
* Controlled ownership
* Flyway-managed deployment

Only authorized administrators may modify production triggers.

---

### TRG-023

Trigger creation and modification shall require privileged administrative access.

---

### TRG-024

Trigger functions shall execute according to enterprise security policies.

---

# 54.14 Versioning & Deployment

Triggers shall be deployed through Flyway migrations.

Deployment lifecycle:

```text id="trg7"
Development

↓

Code Review

↓

Flyway Migration

↓

Testing

↓

Production

↓

Monitoring
```

Each deployment shall include:

* Migration script
* Rollback plan
* Documentation update
* Regression testing

---

### TRG-025

Trigger definitions shall be version controlled.

---

### TRG-026

Production deployment shall occur only through approved migration pipelines.

---

# 54.15 Monitoring & Maintenance

Continuous monitoring includes:

* Execution count
* Average duration
* Failure count
* Recursion detection
* Lock contention
* Blocking sessions
* Error logs
* Audit verification

Monitoring tools:

* PostgreSQL Statistics
* Prometheus
* Grafana
* Alertmanager

---

### TRG-027

Trigger execution shall be continuously monitored.

---

### TRG-028

Trigger failures shall generate operational alerts.

---

# 54.16 Governance

Trigger governance includes:

* Database Architecture Review Board
* Database Administration Team
* Platform Engineering Team
* Security Review Committee
* Enterprise Data Governance Board
* Quality Assurance Team
* Site Reliability Engineering (SRE)
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Business validation
* Performance assessment
* Security review
* Migration validation
* Documentation updates

---

### TRG-029

Trigger modifications shall require formal governance approval.

---

### TRG-030

Trigger documentation shall remain synchronized with implementation.

---

# 54.17 Traceability

This chapter defines enterprise standards for Trigger Design within the Mediverse platform.

**Related Documents**

* Chapter 41 – Audit & Logging Tables
* Chapter 45 – Data Validation Rules
* Chapter 53 – Stored Procedures Strategy
* Chapter 55 – Sequences & ID Generation
* Chapter 57 – Migration Strategy (Flyway)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Trigger Documentation
* Architecture Decision Records (ADR)

**Applies To**

* BEFORE Triggers
* AFTER Triggers
* INSTEAD OF Triggers
* Audit Triggers
* Timestamp Triggers
* Soft Delete Triggers
* History Triggers
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Trigger Design Strategy for the Mediverse database. It establishes standardized guidance for designing, implementing, securing, monitoring, and governing PostgreSQL triggers while limiting their use to infrastructure-level responsibilities such as auditing, timestamp management, soft deletion, history tracking, and security monitoring. By enforcing lightweight, deterministic trigger behavior, integrating deployments with Flyway, and maintaining comprehensive governance and observability, the Mediverse platform ensures reliable, maintainable, and compliant database automation that complements—rather than replaces—application-level business logic.

---

**End of Chapter 54**

**Next:** **Chapter 55 – Sequences & ID Generation**.

---

# Chapter 55 — Sequences & ID Generation

---

# Chapter Overview

This chapter defines the **Sequences & ID Generation Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for generating unique, scalable, secure, and high-performance identifiers across all database entities.

Every business object—including users, students, faculty, courses, assessments, certificates, notifications, AI knowledge assets, audit logs, and transactions—requires unique identifiers that remain consistent throughout their lifecycle. This chapter standardizes identifier generation using PostgreSQL sequences, identity columns, UUIDs, application-generated identifiers, and distributed ID generation strategies.

The strategy is designed for **PostgreSQL 17+** and integrates with Spring Boot, Hibernate, Flyway, Kubernetes, distributed microservices, and enterprise DevOps practices.

---

# 55.1 Introduction

A robust identifier strategy is essential for ensuring:

* Entity uniqueness
* Referential integrity
* Horizontal scalability
* High availability
* Distributed system compatibility
* Auditability
* Performance optimization
* Long-term maintainability

Poor identifier design can lead to collisions, performance degradation, replication issues, and operational complexity.

The Mediverse platform therefore adopts standardized enterprise-wide ID generation policies.

---

# 55.2 Objectives

The objectives of the Sequences & ID Generation Strategy are to:

* Guarantee uniqueness.
* Support distributed systems.
* Improve insertion performance.
* Maintain referential integrity.
* Enable horizontal scaling.
* Standardize identifier formats.
* Support auditability.
* Simplify migration.
* Improve maintainability.
* Support enterprise governance.

---

### IDG-001

Every persistent entity shall have a unique immutable primary identifier.

---

### IDG-002

Identifier generation mechanisms shall be standardized across the platform.

---

# 55.3 ID Generation Architecture

```text id="idg1"
Application

↓

Persistence Layer

↓

ID Generation Strategy

↓

Database

↓

Persistent Entity
```

Identifier generation occurs before entity persistence and is coordinated between the application and PostgreSQL.

---

### IDG-003

Primary identifiers shall be generated using approved enterprise mechanisms.

---

### IDG-004

Identifier generation shall prevent collisions across all environments.

---

# 55.4 Identifier Categories

The Mediverse platform uses multiple identifier types depending on business requirements.

| Identifier Type     | Usage                           |
| ------------------- | ------------------------------- |
| BIGINT Identity     | Internal transactional entities |
| PostgreSQL Sequence | High-volume database objects    |
| UUID                | Distributed microservices       |
| Business Identifier | Human-readable references       |
| Composite Key       | Specialized relationship tables |
| External Identifier | Third-party integrations        |

Each identifier serves a specific architectural purpose.

---

### IDG-005

Identifier selection shall be based on business and architectural requirements.

---

### IDG-006

Business identifiers shall not replace technical primary keys.

---

# 55.5 PostgreSQL Sequences

Sequences provide high-performance numeric identifiers.

Example:

```sql id="idg_sql_1"
CREATE SEQUENCE seq_student
START WITH 1
INCREMENT BY 1
CACHE 100;
```

Usage:

```sql id="idg_sql_2"
SELECT nextval('seq_student');
```

Benefits:

* Fast allocation
* No locking contention
* Scalable
* Native PostgreSQL support

---

### IDG-007

High-volume transactional tables shall use enterprise-managed sequences or identity columns.

---

### IDG-008

Sequence caching shall be configured according to workload requirements.

---

# 55.6 Identity Columns

Preferred PostgreSQL implementation:

```sql id="idg_sql_3"
CREATE TABLE students (

student_id BIGINT
GENERATED ALWAYS AS IDENTITY,

name TEXT

);
```

Advantages:

* SQL standard compliance
* Simplified management
* Automatic sequence ownership
* Improved maintainability

Identity columns are preferred for most new transactional tables.

---

### IDG-009

New transactional entities should use PostgreSQL identity columns unless an alternative strategy is justified.

---

### IDG-010

Identity column configuration shall be managed through Flyway migrations.

---

# 55.7 UUID Strategy

Distributed services frequently require globally unique identifiers.

Example:

```text id="idg2"
550e8400-e29b-41d4-a716-446655440000
```

UUID usage includes:

* External APIs
* AI services
* Distributed workflows
* Offline synchronization
* Multi-region deployments

UUIDs reduce collision risk across independently operating systems.

---

### IDG-011

Distributed services shall use UUIDs where global uniqueness is required.

---

### IDG-012

UUID generation shall use approved version standards and secure random generation.

---

# 55.8 Business Identifier Standards

Business identifiers are human-readable references.

Examples:

```text id="idg3"
STD-2026-000123

CRS-2026-001540

CERT-2026-004512

ASM-2026-002841
```

Characteristics:

* Readable
* Searchable
* Printable
* Traceable
* Non-primary key

Business identifiers complement technical identifiers.

---

### IDG-013

Business identifiers shall follow standardized enterprise formats.

---

### IDG-014

Business identifier generation rules shall be centrally documented.

---

# 55.9 Distributed ID Generation

Microservices may require independent identifier generation.

Supported approaches:

* UUID
* Snowflake-style IDs
* Time-based identifiers
* Application-managed generators

Architecture:

```text id="idg4"
Microservice

↓

ID Generator

↓

Unique Identifier

↓

Database
```

Distributed generation minimizes coordination overhead while maintaining uniqueness.

---

### IDG-015

Distributed ID generators shall ensure uniqueness across all service instances.

---

### IDG-016

Distributed identifiers shall remain sortable where operationally beneficial.

---

# 55.10 Sequence Management

Sequence lifecycle includes:

* Creation
* Configuration
* Monitoring
* Backup
* Migration
* Validation
* Retirement

Administration tasks:

* Verify sequence ownership
* Monitor exhaustion
* Adjust cache size
* Validate increment values

Sequences shall remain synchronized with associated tables.

---

### IDG-017

Sequence health shall be monitored continuously.

---

### IDG-018

Sequence configuration changes shall follow approved change management procedures.

---

# 55.11 Performance Considerations

Efficient identifier generation improves insertion throughput.

Optimization techniques:

* Cache sequence values.
* Minimize sequence contention.
* Avoid unnecessary synchronization.
* Use BIGINT for scalability.
* Monitor sequence utilization.
* Prevent hot-spot contention.

Large-scale testing shall validate identifier generation performance.

---

### IDG-019

Identifier generation shall not become a performance bottleneck.

---

### IDG-020

Sequence utilization shall be periodically benchmarked.

---

# 55.12 Security

Identifiers shall be protected against misuse.

Security controls include:

* RBAC
* Least privilege
* Sequence permission management
* Audit logging
* Controlled administrative access
* Secure UUID generation

Business identifiers exposed externally shall not reveal sensitive internal implementation details.

---

### IDG-021

Sequence administration shall require privileged access.

---

### IDG-022

Identifier generation mechanisms shall comply with enterprise security standards.

---

# 55.13 Backup & Recovery

Identifier generation state must be preserved during disaster recovery.

Recovery activities include:

* Sequence synchronization
* Identity reseeding
* UUID validation
* Data consistency verification
* Referential integrity checks

Following restoration, generated identifiers shall remain unique.

---

### IDG-023

Sequence values shall be validated after backup restoration.

---

### IDG-024

Recovery procedures shall prevent duplicate identifier generation.

---

# 55.14 Governance

Identifier governance includes:

* Database Architecture Review Board
* Database Administration Team
* Platform Engineering Team
* Enterprise Data Governance Board
* Security Review Committee
* Quality Assurance Team
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Identifier strategy changes
* Migration updates
* Security review
* Capacity assessment
* Documentation updates

---

### IDG-025

Enterprise identifier strategy modifications shall require formal governance approval.

---

### IDG-026

Identifier documentation shall remain synchronized with implementation.

---

# 55.15 Traceability

This chapter defines enterprise standards for Sequences & ID Generation within the Mediverse platform.

**Related Documents**

* Chapter 19 – Primary Key Strategy
* Chapter 21 – Composite Keys
* Chapter 22 – Constraints Design
* Chapter 53 – Stored Procedures Strategy
* Chapter 57 – Migration Strategy (Flyway)
* Chapter 58 – Backup, Recovery & Archival
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Sequence Documentation
* PostgreSQL Identity Columns Documentation
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Sequences
* Identity Columns
* UUID Generation
* Business Identifiers
* Distributed ID Generation
* Primary Keys
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Sequences & ID Generation Strategy for the Mediverse database. It establishes standardized guidance for generating unique identifiers using PostgreSQL sequences, identity columns, UUIDs, business identifiers, and distributed ID generation mechanisms. By enforcing consistent identifier standards, optimizing sequence performance, securing generation mechanisms, and integrating lifecycle management with Flyway and enterprise governance, the Mediverse platform ensures scalable, collision-free, and maintainable identification of all business entities across transactional, analytical, and distributed workloads.

---

**End of Chapter 55**

**Next:** **Chapter 56 – Functions & Utility Objects**.

---

# Chapter 56 — Functions & Utility Objects

---

# Chapter Overview

This chapter defines the **Functions & Utility Objects Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for designing, implementing, securing, versioning, monitoring, and governing database functions and utility objects that provide reusable computation, validation, transformation, formatting, and infrastructure services.

Functions encapsulate reusable logic that can be invoked from SQL statements, stored procedures, triggers, views, and application services. Utility objects support common database operations while promoting consistency, maintainability, and performance across the enterprise platform.

The strategy is designed for **PostgreSQL 17+** using **PL/pgSQL**, integrated with Spring Boot, Hibernate, Flyway, Kubernetes, and enterprise DevOps practices.

---

# 56.1 Introduction

The Mediverse platform performs thousands of repetitive database operations that require standardized implementation.

Examples include:

* Progress calculation
* Certificate verification
* Data validation
* Percentage computation
* Medical code formatting
* GPA calculation
* UUID generation
* Date calculations
* String normalization
* JSON transformations

Without reusable database functions, identical logic would be duplicated across applications, increasing maintenance effort and inconsistency.

Database functions provide a centralized and reusable implementation of these common operations.

---

# 56.2 Objectives

The objectives of the Functions & Utility Objects Strategy are to:

* Promote code reuse.
* Reduce SQL duplication.
* Improve maintainability.
* Standardize business calculations.
* Simplify SQL development.
* Improve performance.
* Support automation.
* Enhance consistency.
* Improve data quality.
* Standardize governance.

---

### FUT-001

Reusable database logic shall be implemented through approved database functions where appropriate.

---

### FUT-002

Functions shall complement—not replace—application-layer business logic.

---

# 56.3 Function Architecture

```text id="fut1"
Application

↓

SQL Query

↓

Database Function

↓

Computation

↓

Return Result
```

Functions may be called from:

* SQL queries
* Stored procedures
* Triggers
* Views
* Materialized views
* Reporting queries
* Spring Boot repositories

---

### FUT-003

Functions shall expose stable, documented interfaces.

---

### FUT-004

Function execution shall be deterministic unless explicitly documented otherwise.

---

# 56.4 Function Design Principles

The Mediverse platform follows these principles:

1. Keep functions focused.
2. Return predictable results.
3. Avoid unnecessary side effects.
4. Use parameter validation.
5. Support reuse.
6. Optimize execution.
7. Document inputs and outputs.
8. Version through Flyway.
9. Minimize dependencies.
10. Maintain backward compatibility where practical.

---

### FUT-005

Each function shall implement a single logical responsibility.

---

### FUT-006

Functions shall avoid modifying database state unless specifically designed for that purpose.

---

# 56.5 Function Categories

Functions are classified according to business purpose.

| Category       | Examples                             |
| -------------- | ------------------------------------ |
| Validation     | Email validation, score validation   |
| Calculation    | Progress percentage, GPA             |
| Formatting     | Full name, phone formatting          |
| Date Utilities | Age, duration, semester calculations |
| Security       | Hash verification, token utilities   |
| AI Utilities   | Embedding metadata parsing           |
| JSON Utilities | JSON extraction and transformation   |
| Reporting      | KPI aggregation                      |
| Conversion     | Unit and data conversion             |
| Administrative | Maintenance utilities                |

---

### FUT-007

Functions shall be categorized within the enterprise data catalog.

---

### FUT-008

Function ownership shall be assigned to an approved business or technical domain.

---

# 56.6 Naming Standards

Naming conventions:

```text id="fut2"
fn_calculate_progress

fn_validate_email

fn_student_gpa

fn_course_duration

fn_certificate_status

utl_normalize_phone

utl_generate_reference
```

Prefixes:

* `fn_` — Business or computational function
* `utl_` — Utility function
* `adm_` — Administrative function

---

### FUT-009

Function names shall follow approved enterprise naming conventions.

---

### FUT-010

Names shall clearly indicate function behavior.

---

# 56.7 Input & Output Standards

Functions shall define:

* Input parameters
* Data types
* Default values
* Return type
* Null handling
* Exception behavior

Example:

```sql id="fut_sql_1"
CREATE FUNCTION fn_calculate_progress(
    completed_lessons INTEGER,
    total_lessons INTEGER
)
RETURNS NUMERIC;
```

Inputs shall be validated before computation.

---

### FUT-011

Function parameters shall be strongly typed.

---

### FUT-012

Return values shall use standardized enterprise data types.

---

# 56.8 Validation Functions

Validation functions improve data quality.

Examples:

* Email validation
* Phone validation
* Password policy checks
* Medical registration validation
* Score range validation
* Course code validation

Workflow:

```text id="fut3"
Input

↓

Validation Function

↓

Valid / Invalid

↓

Application Response
```

---

### FUT-013

Validation functions shall enforce enterprise data quality rules.

---

### FUT-014

Validation logic shall remain centrally maintained.

---

# 56.9 Calculation Functions

Calculation functions perform reusable mathematical and business computations.

Examples:

* Student completion percentage
* Faculty workload
* Average assessment score
* Course duration
* Certificate validity period
* AI confidence normalization

These functions eliminate repetitive SQL expressions.

---

### FUT-015

Business calculations shall produce consistent results across all applications.

---

### FUT-016

Calculation algorithms shall be version controlled and documented.

---

# 56.10 JSON & Utility Functions

Modern PostgreSQL applications frequently process JSON data.

Examples:

* Extract AI metadata
* Parse assessment configuration
* Normalize API payloads
* Convert JSON arrays
* Merge configuration documents

Utility functions also support:

* UUID formatting
* Text normalization
* String trimming
* Date conversion
* Unit conversion

---

### FUT-017

Utility functions shall provide reusable infrastructure capabilities.

---

### FUT-018

JSON processing functions shall comply with approved schema definitions.

---

# 56.11 Performance Considerations

Functions should be efficient and predictable.

Optimization strategies:

* Avoid unnecessary loops.
* Prefer set-based SQL.
* Minimize external dependencies.
* Cache immutable computations where appropriate.
* Avoid excessive recursion.
* Optimize frequently executed functions.

Execution plans shall be reviewed for high-volume functions.

---

### FUT-019

Frequently executed functions shall undergo performance benchmarking.

---

### FUT-020

Function implementations shall minimize execution overhead.

---

# 56.12 Security

Database functions operate under controlled execution privileges.

Security controls include:

* Role-Based Access Control (RBAC)
* Least privilege
* Parameter validation
* SQL injection prevention
* Controlled ownership
* Audit logging
* Secure execution contexts

Administrative functions shall require elevated authorization.

---

### FUT-021

Function execution permissions shall follow enterprise RBAC policies.

---

### FUT-022

Security-sensitive utility functions shall undergo security review before deployment.

---

# 56.13 Versioning & Deployment

Functions shall be deployed using Flyway migrations.

Deployment lifecycle:

```text id="fut4"
Development

↓

Code Review

↓

Flyway Migration

↓

Testing

↓

Production

↓

Monitoring
```

Each deployment shall include:

* Migration script
* Rollback strategy
* Regression tests
* Documentation update

---

### FUT-023

Functions shall be version controlled through Flyway.

---

### FUT-024

Production deployment shall occur only through approved CI/CD pipelines.

---

# 56.14 Monitoring & Maintenance

Operational monitoring includes:

* Execution frequency
* Average execution time
* Error rate
* Resource utilization
* Dependency tracking
* Usage statistics
* Performance regressions

Monitoring tools:

* pg_stat_statements
* PostgreSQL Statistics
* Prometheus
* Grafana
* Alertmanager

---

### FUT-025

Function execution metrics shall be continuously monitored.

---

### FUT-026

Performance regressions shall trigger operational alerts.

---

# 56.15 Utility Objects

In addition to functions, standardized utility database objects include:

| Utility Object             | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| Domains                    | Reusable data constraints                               |
| Composite Types            | Structured return values                                |
| Custom Operators           | Specialized comparisons                                 |
| Extensions                 | PostgreSQL capabilities (e.g., `pgcrypto`, `uuid-ossp`) |
| Generated Columns          | Derived values                                          |
| Collations                 | Locale-aware sorting                                    |
| Text Search Configurations | Full-text search support                                |

These objects enhance modularity and reduce implementation duplication.

---

### FUT-027

Utility objects shall be standardized and documented across all environments.

---

### FUT-028

Only approved PostgreSQL extensions shall be enabled in production environments.

---

# 56.16 Governance

Functions & Utility Objects governance includes:

* Database Architecture Review Board
* Database Administration Team
* Platform Engineering Team
* Enterprise Data Governance Board
* Security Review Committee
* Quality Assurance Team
* Site Reliability Engineering (SRE)
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Business validation
* Performance testing
* Security assessment
* Migration review
* Documentation updates

---

### FUT-029

Function modifications shall require formal governance approval.

---

### FUT-030

Function documentation shall remain synchronized with implementation.

---

# 56.17 Traceability

This chapter defines enterprise standards for Functions & Utility Objects within the Mediverse platform.

**Related Documents**

* Chapter 24 – Data Types Standardization
* Chapter 45 – Data Validation Rules
* Chapter 53 – Stored Procedures Strategy
* Chapter 54 – Trigger Design
* Chapter 57 – Migration Strategy (Flyway)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL PL/pgSQL Documentation
* PostgreSQL Extensions Documentation
* Architecture Decision Records (ADR)

**Applies To**

* Database Functions
* Utility Functions
* Validation Functions
* Calculation Functions
* JSON Utilities
* PostgreSQL Extensions
* Utility Objects
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Functions & Utility Objects Strategy for the Mediverse database. It establishes standardized guidance for designing, implementing, securing, versioning, deploying, monitoring, and governing reusable database functions and supporting utility objects. By adopting consistent naming conventions, strong typing, centralized validation, performance optimization, secure execution, and Flyway-managed lifecycle control, the Mediverse platform ensures maintainable, high-performance, and reusable database programming that supports enterprise-scale medical education, AI-driven services, and distributed microservice architectures.

---

**End of Chapter 56**

**Next:** **Chapter 57 – Migration Strategy (Flyway)**.

---

# Chapter 57 — Migration Strategy (Flyway)

---

# Chapter Overview

This chapter defines the **Database Migration Strategy** for the **Mediverse – AI-Powered Medical Education Platform** using **Flyway** as the enterprise database version control and schema migration framework.

Database schema evolution is an integral part of enterprise software development. As Mediverse continuously evolves with new features, modules, AI capabilities, and regulatory requirements, the database must evolve in a controlled, repeatable, auditable, and automated manner.

This chapter establishes standards for migration lifecycle management, versioning, deployment automation, rollback planning, validation, auditing, governance, and integration with CI/CD pipelines to ensure consistent database evolution across Development, Testing, UAT, Staging, and Production environments.

The strategy is designed for **PostgreSQL 17+**, **Flyway 11+**, **Spring Boot 3.x**, **Docker**, **Kubernetes**, and enterprise DevOps pipelines.

---

# 57.1 Introduction

Database schema changes are among the highest-risk activities in enterprise software delivery. Uncontrolled changes may result in:

* Data corruption
* Application failures
* Downtime
* Schema inconsistency
* Deployment failures
* Security vulnerabilities
* Regulatory non-compliance

Flyway provides version-controlled, automated, and repeatable schema migrations that ensure every database environment remains synchronized with the application's expected schema version.

---

# 57.2 Objectives

The objectives of the Migration Strategy are to:

* Version database changes.
* Automate schema deployment.
* Maintain schema consistency.
* Support continuous delivery.
* Enable auditability.
* Improve rollback preparedness.
* Reduce deployment risk.
* Standardize migration practices.
* Support multi-environment deployments.
* Strengthen governance.

---

### FLY-001

All database schema modifications shall be deployed through Flyway migrations.

---

### FLY-002

Direct manual modification of production schemas shall be prohibited except under approved emergency procedures.

---

# 57.3 Migration Architecture

```text id="fly1"
Developer

↓

Git Repository

↓

Flyway Migration Scripts

↓

CI/CD Pipeline

↓

Environment Deployment

↓

PostgreSQL Database
```

Migration scripts are version-controlled, automatically validated, and executed consistently across all environments.

---

### FLY-003

Database schema shall evolve exclusively through version-controlled migration scripts.

---

### FLY-004

Migration execution shall be integrated into the enterprise deployment pipeline.

---

# 57.4 Migration Principles

The Mediverse platform follows these principles:

1. Version every change.
2. Maintain immutable migration history.
3. Automate deployments.
4. Validate before execution.
5. Ensure repeatability.
6. Preserve backward compatibility where practical.
7. Avoid destructive changes without review.
8. Test migrations thoroughly.
9. Maintain complete audit trails.
10. Document every schema evolution.

---

### FLY-005

Executed migration scripts shall never be modified.

---

### FLY-006

Schema evolution shall remain fully traceable.

---

# 57.5 Migration Types

Flyway supports multiple migration categories.

| Migration Type       | Purpose                                       |
| -------------------- | --------------------------------------------- |
| Versioned Migration  | Permanent schema evolution                    |
| Repeatable Migration | Recreated objects such as views and functions |
| Baseline Migration   | Existing database initialization              |
| Undo Migration*      | Controlled rollback (where applicable)        |
| Data Migration       | Business data transformation                  |

*Undo migrations may be limited depending on organizational policy and Flyway edition.

---

### FLY-007

Migration type selection shall align with enterprise deployment standards.

---

### FLY-008

Business data migrations shall be separated from schema migrations whenever practical.

---

# 57.6 Naming Standards

Migration scripts shall follow standardized naming conventions.

Examples:

```text id="fly2"
V1__Initial_Schema.sql

V2__Create_User_Tables.sql

V3__Create_Course_Module.sql

V4__Add_Assessment_Indexes.sql

R__Refresh_Views.sql

R__Update_Functions.sql
```

Naming rules:

* Prefix with version or repeatable identifier.
* Use descriptive names.
* Avoid abbreviations.
* Maintain sequential numbering.

---

### FLY-009

Migration files shall follow approved enterprise naming conventions.

---

### FLY-010

Migration version numbers shall be unique and sequential.

---

# 57.7 Migration Lifecycle

```text id="fly3"
Design

↓

Development

↓

Code Review

↓

Testing

↓

Validation

↓

Deployment

↓

Verification

↓

Audit
```

Lifecycle activities include:

* Requirement analysis
* SQL development
* Peer review
* Automated testing
* Deployment approval
* Production verification

---

### FLY-011

Every migration shall complete the approved lifecycle before production deployment.

---

### FLY-012

Migration completion shall be verified after execution.

---

# 57.8 Environment Strategy

Migration execution order:

```text id="fly4"
Development

↓

Integration

↓

Testing

↓

UAT

↓

Staging

↓

Production
```

Each environment shall execute identical migration scripts to preserve schema consistency.

Environment-specific SQL shall be avoided unless explicitly approved.

---

### FLY-013

Migration scripts shall remain environment independent whenever feasible.

---

### FLY-014

Production migrations shall originate from validated lower environments.

---

# 57.9 Data Migration

Schema evolution occasionally requires business data transformation.

Examples:

* Reference data initialization
* Medical terminology updates
* Lookup table expansion
* AI configuration migration
* Data normalization
* Legacy data conversion

Data migration scripts shall:

* Be idempotent where practical.
* Preserve referential integrity.
* Validate affected records.
* Log execution results.

---

### FLY-015

Business data migrations shall preserve data integrity throughout execution.

---

### FLY-016

Data transformation logic shall be fully documented.

---

# 57.10 Rollback Strategy

Database rollback requires careful planning.

Rollback options include:

* Point-in-time recovery
* Backup restoration
* Compensating migration
* Controlled undo migration
* Feature rollback

Preferred approach:

```text id="fly5"
Forward Fix

↓

Compensating Migration

↓

Validation
```

Production rollbacks should be exceptional events.

---

### FLY-017

Rollback procedures shall be documented before production deployment.

---

### FLY-018

Destructive schema changes shall require validated recovery procedures.

---

# 57.11 Validation & Verification

Flyway performs migration validation before execution.

Validation includes:

* Checksum verification
* Version ordering
* Duplicate detection
* Missing migration detection
* Dependency validation

Post-deployment verification includes:

* Schema validation
* Application startup
* Smoke testing
* Data integrity verification

---

### FLY-019

Migration validation shall occur prior to execution.

---

### FLY-020

Post-deployment verification shall confirm successful schema evolution.

---

# 57.12 CI/CD Integration

Migration execution integrates with enterprise DevOps pipelines.

```text id="fly6"
Developer Commit

↓

Git

↓

CI Pipeline

↓

Flyway Validate

↓

Flyway Migrate

↓

Application Deployment

↓

Health Checks
```

Pipeline stages:

* Static SQL validation
* Security scanning
* Migration validation
* Deployment
* Verification

---

### FLY-021

Flyway migrations shall execute automatically within approved deployment pipelines.

---

### FLY-022

Failed migrations shall prevent application deployment.

---

# 57.13 Monitoring & Auditing

Migration execution shall be continuously audited.

Captured information:

* Migration version
* Execution timestamp
* Duration
* Executor
* Success status
* Failure reason
* Checksum
* Target environment

Monitoring tools:

* Flyway History Table
* PostgreSQL Logs
* Prometheus
* Grafana
* SIEM Platform

---

### FLY-023

Migration history shall be permanently retained.

---

### FLY-024

Migration failures shall generate operational alerts.

---

# 57.14 Security

Migration execution requires strong security controls.

Required controls:

* Role-Based Access Control (RBAC)
* Least privilege
* Signed deployment pipelines
* Secrets management
* Audit logging
* Change approval
* Secure credential storage
* TLS-encrypted connections

Production migration permissions shall be restricted to authorized deployment pipelines and administrators.

---

### FLY-025

Migration execution shall require authorized deployment credentials.

---

### FLY-026

Migration scripts shall undergo security review before production release.

---

# 57.15 Governance

Migration governance includes:

* Database Architecture Review Board
* Platform Engineering Team
* Database Administration Team
* DevOps Engineering Team
* Security Review Committee
* Quality Assurance Team
* Enterprise Data Governance Board
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Schema review
* Performance assessment
* Security validation
* Operational readiness
* Documentation updates

---

### FLY-027

Production schema changes shall require formal governance approval.

---

### FLY-028

Migration documentation shall remain synchronized with implementation.

---

# 57.16 Traceability

This chapter defines enterprise standards for Database Migration Strategy within the Mediverse platform.

**Related Documents**

* Chapter 17 – Table Design Standards
* Chapter 24 – Data Types Standardization
* Chapter 53 – Stored Procedures Strategy
* Chapter 54 – Trigger Design
* Chapter 55 – Sequences & ID Generation
* Chapter 56 – Functions & Utility Objects
* Chapter 58 – Backup, Recovery & Archival
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Flyway Documentation
* PostgreSQL Administration Guide
* Architecture Decision Records (ADR)

**Applies To**

* Flyway Migrations
* Schema Versioning
* Data Migrations
* CI/CD Integration
* Rollback Planning
* Validation
* Migration Governance
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Migration Strategy for the Mediverse database using Flyway as the authoritative schema versioning and migration framework. It establishes standardized guidance for migration lifecycle management, versioning, environment promotion, rollback planning, validation, CI/CD integration, monitoring, security, and governance. By enforcing immutable migration history, automated deployments, comprehensive validation, and auditable change management, the Mediverse platform ensures safe, repeatable, and scalable database evolution across all environments while supporting continuous delivery and enterprise-grade operational excellence.

---

**End of Chapter 57**

**Next:** **Chapter 58 – Backup, Recovery & Archival**.

---

# Chapter 58 — Backup, Recovery & Archival

---

# Chapter Overview

This chapter defines the **Backup, Recovery & Archival Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for protecting business-critical data through comprehensive backup procedures, disaster recovery planning, point-in-time recovery, long-term archival, data retention, and operational governance.

As a medical education platform handling sensitive learner information, AI knowledge assets, assessments, certificates, audit records, and institutional data, Mediverse requires a resilient data protection strategy that minimizes data loss, ensures rapid recovery, complies with regulatory requirements, and guarantees business continuity.

This strategy is designed for **PostgreSQL 17+**, integrating **pgBackRest**, **WAL Archiving**, **Point-in-Time Recovery (PITR)**, **Cloud Object Storage**, **Kubernetes**, and enterprise DevOps practices.

---

# 58.1 Introduction

Enterprise databases are exposed to multiple operational risks, including:

* Hardware failures
* Storage corruption
* Human error
* Application defects
* Cybersecurity incidents
* Ransomware attacks
* Infrastructure failures
* Natural disasters
* Accidental data deletion
* Regional outages

Without a structured backup and recovery strategy, these events may lead to:

* Permanent data loss
* Extended downtime
* Regulatory violations
* Financial loss
* Loss of institutional trust

The Mediverse platform therefore implements layered backup, recovery, and archival mechanisms to ensure high availability and long-term data preservation.

---

# 58.2 Objectives

The objectives of the Backup, Recovery & Archival Strategy are to:

* Protect business-critical data.
* Minimize Recovery Time Objective (RTO).
* Minimize Recovery Point Objective (RPO).
* Support Point-in-Time Recovery (PITR).
* Preserve historical information.
* Ensure regulatory compliance.
* Support disaster recovery.
* Protect against ransomware.
* Automate backup operations.
* Standardize governance.

---

### BRA-001

All production databases shall participate in automated backup schedules.

---

### BRA-002

Backup and recovery procedures shall support enterprise continuity objectives.

---

# 58.3 Backup Architecture

```text id="bra1"
PostgreSQL Primary
        │
        ▼
 WAL Archiving
        │
        ▼
Incremental Backups
        │
        ▼
Full Backups
        │
        ▼
Encrypted Backup Repository
        │
        ▼
Cloud Object Storage
```

The architecture combines full backups, incremental backups, and continuous WAL archiving to support comprehensive recovery capabilities.

---

### BRA-003

Backup architecture shall support complete database restoration.

---

### BRA-004

Backup repositories shall be physically separated from production databases.

---

# 58.4 Backup Strategy

Multiple backup types are employed.

| Backup Type          | Purpose                                     | Frequency                         |
| -------------------- | ------------------------------------------- | --------------------------------- |
| Full Backup          | Complete database image                     | Weekly                            |
| Differential Backup  | Changes since last full backup              | Daily (optional based on tooling) |
| Incremental Backup   | Changed data blocks                         | Daily                             |
| WAL Archive          | Continuous transaction logs                 | Continuous                        |
| Configuration Backup | PostgreSQL and infrastructure configuration | Daily                             |
| Metadata Backup      | Roles, permissions, schemas                 | Daily                             |

Backup schedules may be adjusted based on operational requirements.

---

### BRA-005

Backup frequency shall align with approved RPO objectives.

---

### BRA-006

Critical configuration data shall be backed up alongside business data.

---

# 58.5 Recovery Objectives

Recovery planning is based on measurable service objectives.

| Metric                         | Target            |
| ------------------------------ | ----------------- |
| Recovery Point Objective (RPO) | ≤ 5 minutes       |
| Recovery Time Objective (RTO)  | ≤ 60 minutes      |
| Backup Verification            | 100% automated    |
| Recovery Validation            | Quarterly minimum |
| Backup Success Rate            | ≥ 99.9%           |

These targets are reviewed annually or following major architectural changes.

---

### BRA-007

Recovery objectives shall be formally documented and periodically reviewed.

---

### BRA-008

Recovery performance shall be validated through scheduled recovery exercises.

---

# 58.6 Point-in-Time Recovery (PITR)

PITR enables restoration to a specific moment before failure.

Workflow:

```text id="bra2"
Full Backup

↓

WAL Archive

↓

Failure Event

↓

Target Timestamp

↓

Point-in-Time Recovery
```

Typical use cases:

* Accidental deletion
* Corrupted data
* Failed deployments
* Unauthorized modifications
* Operational mistakes

---

### BRA-009

Continuous WAL archiving shall support Point-in-Time Recovery.

---

### BRA-010

Recovery procedures shall permit restoration to approved recovery timestamps.

---

# 58.7 Backup Lifecycle

```text id="bra3"
Backup Creation

↓

Integrity Verification

↓

Encryption

↓

Transfer

↓

Offsite Storage

↓

Retention

↓

Expiration

↓

Secure Disposal
```

Each stage is monitored and audited to ensure reliability and compliance.

---

### BRA-011

Backup integrity shall be verified before archival.

---

### BRA-012

Expired backups shall be securely destroyed according to retention policies.

---

# 58.8 Disaster Recovery

Disaster recovery addresses catastrophic infrastructure failures.

Recovery workflow:

```text id="bra4"
Disaster

↓

Incident Declaration

↓

Infrastructure Recovery

↓

Database Restoration

↓

Application Validation

↓

Business Resumption
```

Recovery environments may include:

* Secondary Kubernetes cluster
* Alternate cloud region
* Disaster recovery data center

---

### BRA-013

Disaster recovery procedures shall be documented and periodically tested.

---

### BRA-014

Recovery environments shall remain capable of supporting production workloads.

---

# 58.9 Archival Strategy

Archival preserves infrequently accessed historical data.

Examples:

* Completed assessments
* Expired notifications
* Historical certificates
* Audit records
* AI training metadata
* Historical analytics
* System logs

Archived data remains searchable but is isolated from operational workloads.

---

### BRA-015

Historical business records shall be archived according to approved retention schedules.

---

### BRA-016

Archived information shall preserve integrity and traceability.

---

# 58.10 Retention Policy

Retention periods are determined by business, legal, and regulatory requirements.

| Data Category       | Retention Period                    |
| ------------------- | ----------------------------------- |
| Production Backups  | 35 Days                             |
| Monthly Backups     | 12 Months                           |
| Annual Backups      | 7 Years                             |
| Audit Logs          | 7 Years                             |
| Certificates        | Permanent or institutional policy   |
| Student Records     | Institutional and regulatory policy |
| AI Operational Logs | 1–3 Years (policy dependent)        |

Retention policies shall be reviewed with legal and compliance stakeholders.

---

### BRA-017

Retention schedules shall comply with applicable legal and institutional requirements.

---

### BRA-018

Retention exceptions shall require formal approval.

---

# 58.11 Backup Security

Backups contain highly sensitive information.

Required controls:

* AES-256 encryption
* TLS-secured transfer
* Immutable backup storage where supported
* Role-Based Access Control (RBAC)
* Multi-factor authentication
* Secrets management
* Backup integrity verification
* Audit logging

Backup repositories shall be protected with the same or higher security standards as production systems.

---

### BRA-019

Backup data shall be encrypted both at rest and in transit.

---

### BRA-020

Access to backup repositories shall be restricted to authorized personnel and services.

---

# 58.12 Monitoring & Validation

Continuous monitoring includes:

* Backup success rate
* Backup duration
* Recovery testing
* Storage utilization
* WAL archive status
* Repository health
* Replication status
* Integrity verification
* Failed backup alerts

Monitoring tools:

* pgBackRest
* PostgreSQL
* Prometheus
* Grafana
* Alertmanager

---

### BRA-021

Backup operations shall be continuously monitored.

---

### BRA-022

Backup failures shall generate immediate operational alerts.

---

# 58.13 Performance Considerations

Backup activities shall minimize impact on production systems.

Optimization strategies:

* Use incremental backups.
* Compress backup data.
* Schedule full backups during low-traffic periods.
* Throttle backup bandwidth where required.
* Parallelize backup operations when supported.
* Offload backups from replicas where appropriate.

Performance metrics shall be reviewed regularly.

---

### BRA-023

Backup execution shall minimize impact on production workloads.

---

### BRA-024

Backup performance shall be periodically benchmarked.

---

# 58.14 Governance

Backup & Recovery governance includes:

* Database Administration Team
* Platform Engineering Team
* Site Reliability Engineering (SRE)
* Disaster Recovery Team
* Security Review Committee
* Enterprise Data Governance Board
* Compliance Office
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Retention policy changes
* Recovery objective updates
* Backup architecture modifications
* Disaster recovery planning
* Documentation revisions

---

### BRA-025

Changes to backup strategy shall require formal governance approval.

---

### BRA-026

Backup and recovery documentation shall remain synchronized with production operations.

---

# 58.15 Traceability

This chapter defines enterprise standards for Backup, Recovery & Archival within the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 51 – Read Replicas & Scaling
* Chapter 52 – Connection Pooling Strategy
* Chapter 57 – Migration Strategy (Flyway)
* Chapter 59 – Security, Encryption & Compliance
* Chapter 60 – Production Readiness & Governance
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Backup & Recovery Documentation
* pgBackRest Documentation
* Architecture Decision Records (ADR)

**Applies To**

* Full Backups
* Incremental Backups
* WAL Archiving
* Point-in-Time Recovery
* Disaster Recovery
* Data Archival
* Retention Policies
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Backup, Recovery & Archival Strategy for the Mediverse database. It establishes standardized guidance for backup scheduling, Point-in-Time Recovery, disaster recovery, archival management, retention policies, security, monitoring, and governance. By combining automated full and incremental backups, continuous WAL archiving, encrypted offsite storage, regular recovery validation, and comprehensive operational controls, the Mediverse platform ensures resilient data protection, regulatory compliance, rapid recovery, and long-term preservation of mission-critical medical education data.

---

**End of Chapter 58**

**Next:** **Chapter 59 – Security, Encryption & Compliance**.

---

# Chapter 59 — Security, Encryption & Compliance

---

# Chapter Overview

This chapter defines the **Security, Encryption & Compliance Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for securing database infrastructure, protecting sensitive information, implementing encryption, enforcing access control, maintaining auditability, and ensuring compliance with applicable regulatory and institutional requirements.

As Mediverse stores personally identifiable information (PII), educational records, AI-generated content, assessment data, certificates, institutional information, and operational logs, database security is a critical component of the overall platform architecture.

The strategy is designed for **PostgreSQL 17+**, integrated with **Spring Boot Security**, **OAuth2**, **JWT**, **TLS**, **HashiCorp Vault**, **Kubernetes Secrets**, **Prometheus**, **SIEM platforms**, and enterprise DevSecOps practices.

---

# 59.1 Introduction

Database security extends beyond protecting the database server. It encompasses:

* Identity management
* Authentication
* Authorization
* Encryption
* Secrets management
* Network security
* Audit logging
* Regulatory compliance
* Threat detection
* Incident response

The Mediverse platform adopts a **Defense-in-Depth** strategy where multiple independent security controls collectively protect sensitive information.

---

# 59.2 Objectives

The objectives of the Security, Encryption & Compliance Strategy are to:

* Protect confidential data.
* Prevent unauthorized access.
* Secure database communications.
* Encrypt sensitive information.
* Maintain regulatory compliance.
* Support enterprise auditing.
* Protect cryptographic keys.
* Detect security incidents.
* Minimize attack surface.
* Standardize security governance.

---

### SEC-001

All database systems shall implement enterprise-approved security controls.

---

### SEC-002

Sensitive information shall be protected throughout its lifecycle.

---

# 59.3 Security Architecture

```text id="sec1"
Users

↓

Application Security

↓

API Gateway

↓

Spring Security

↓

Database Access Layer

↓

PostgreSQL Security Controls

↓

Encrypted Data Storage
```

Security is enforced at multiple layers, ensuring no single control becomes a single point of failure.

---

### SEC-003

Database security shall integrate with application and infrastructure security controls.

---

### SEC-004

Every database access request shall be authenticated and authorized.

---

# 59.4 Defense-in-Depth Strategy

The Mediverse platform implements multiple security layers.

```text id="sec2"
Identity

↓

Authentication

↓

Authorization

↓

Network Security

↓

Encryption

↓

Database Security

↓

Monitoring

↓

Incident Response
```

Each layer provides independent protection against compromise.

---

### SEC-005

Security controls shall follow the Defense-in-Depth model.

---

### SEC-006

Failure of one security layer shall not expose sensitive data.

---

# 59.5 Authentication

Database authentication mechanisms include:

* PostgreSQL SCRAM-SHA-256
* OAuth2 integration
* JWT validation
* Service Accounts
* Mutual TLS (mTLS)
* Kubernetes Service Identity

Administrative accounts require Multi-Factor Authentication (MFA) where supported by the operational environment.

---

### SEC-007

Database authentication shall use strong enterprise-approved mechanisms.

---

### SEC-008

Administrative access shall require enhanced authentication controls.

---

# 59.6 Authorization

Authorization follows **Role-Based Access Control (RBAC)**.

Standard roles include:

| Role                | Privileges                   |
| ------------------- | ---------------------------- |
| DBA                 | Full administrative control  |
| Application Service | CRUD within assigned schema  |
| Reporting Service   | Read-only access             |
| Analytics Service   | Read-only analytical access  |
| AI Service          | Controlled knowledge access  |
| Auditor             | Audit data access            |
| Support Engineer    | Restricted diagnostic access |

The Principle of Least Privilege governs all permissions.

---

### SEC-009

Database privileges shall be assigned using enterprise RBAC.

---

### SEC-010

Users and services shall receive only the minimum permissions required.

---

# 59.7 Encryption Strategy

Encryption protects information both in transit and at rest.

| Encryption Layer       | Technology                       |
| ---------------------- | -------------------------------- |
| Client ↔ Application   | HTTPS (TLS 1.3+)                 |
| Application ↔ Database | TLS 1.3+                         |
| Backup Storage         | AES-256                          |
| Persistent Storage     | Cloud Provider Encryption / LUKS |
| Secrets                | Vault / Kubernetes Secrets       |

Encryption keys shall be centrally managed and rotated according to enterprise policy.

---

### SEC-011

Sensitive data shall be encrypted both in transit and at rest.

---

### SEC-012

Cryptographic algorithms shall comply with approved enterprise standards.

---

# 59.8 Data Classification

Data shall be classified to determine appropriate protection levels.

| Classification | Examples                                                             |
| -------------- | -------------------------------------------------------------------- |
| Public         | Published course catalog                                             |
| Internal       | Operational reports                                                  |
| Confidential   | Student information, faculty records                                 |
| Restricted     | Password hashes, API secrets, encryption keys, authentication tokens |

Security controls increase according to classification.

---

### SEC-013

All enterprise data shall be assigned an approved classification.

---

### SEC-014

Security controls shall align with data classification levels.

---

# 59.9 Secrets Management

Sensitive credentials shall never be stored in source code.

Managed secrets include:

* Database passwords
* API keys
* JWT signing keys
* Encryption keys
* TLS certificates
* OAuth credentials
* External integration secrets

Recommended solutions:

* HashiCorp Vault
* Kubernetes Secrets
* Cloud Key Management Services (KMS)

---

### SEC-015

Secrets shall be centrally managed using approved secrets management solutions.

---

### SEC-016

Secrets shall be periodically rotated according to enterprise policy.

---

# 59.10 Auditing & Monitoring

Comprehensive auditing enables accountability and incident investigation.

Audit events include:

* Authentication attempts
* Privilege changes
* Schema modifications
* Administrative actions
* Failed login attempts
* Data access
* Backup operations
* Recovery activities

Monitoring stack:

* PostgreSQL Audit Extension (`pgaudit`)
* Prometheus
* Grafana
* SIEM Platform
* Alertmanager

---

### SEC-017

Security-relevant database activities shall be comprehensively audited.

---

### SEC-018

Security monitoring shall generate alerts for suspicious activities.

---

# 59.11 Network Security

Database access shall be protected through layered network controls.

Security measures include:

* Private network deployment
* Kubernetes Network Policies
* Firewalls
* Security Groups
* Zero Trust networking
* Bastion hosts
* IP allowlists
* Mutual TLS

Production databases shall never be publicly accessible.

---

### SEC-019

Production databases shall reside within protected network boundaries.

---

### SEC-020

Direct public access to production databases shall be prohibited.

---

# 59.12 Compliance Framework

The Mediverse platform shall support applicable regulatory and institutional requirements.

Potential compliance considerations include:

* GDPR
* FERPA (where applicable)
* HIPAA-aligned security controls (where medical data processing requires them)
* ISO/IEC 27001
* SOC 2
* OWASP ASVS
* CIS Benchmarks for PostgreSQL
* Institutional Information Security Policies

Compliance requirements shall be interpreted and implemented in accordance with the organization's legal and regulatory obligations.

---

### SEC-021

Security controls shall support applicable legal, regulatory, and contractual obligations.

---

### SEC-022

Compliance evidence shall be retained for approved audit periods.

---

# 59.13 Incident Response

Database security incidents require structured response procedures.

```text id="sec3"
Threat Detection

↓

Alert

↓

Investigation

↓

Containment

↓

Eradication

↓

Recovery

↓

Post-Incident Review
```

Incident response includes:

* Root cause analysis
* Forensic preservation
* Credential rotation
* Vulnerability remediation
* Lessons learned documentation

---

### SEC-023

Security incidents shall follow the approved enterprise incident response process.

---

### SEC-024

Security incidents shall be documented and reviewed after resolution.

---

# 59.14 Security Testing

Security validation includes:

* Vulnerability scanning
* Penetration testing
* SQL injection testing
* Privilege review
* Configuration assessment
* Dependency scanning
* Secret detection
* Compliance audits

Testing shall be integrated into the SDLC and CI/CD pipeline.

---

### SEC-025

Database security shall undergo periodic security assessments.

---

### SEC-026

Critical vulnerabilities shall be remediated according to enterprise risk management policies.

---

# 59.15 Governance

Security governance includes:

* Chief Information Security Officer (CISO)
* Security Architecture Team
* Database Administration Team
* Platform Engineering Team
* DevSecOps Team
* Enterprise Risk Committee
* Compliance Office
* Internal Audit
* Change Advisory Board (CAB)
* Architecture Decision Records (ADR)

Required approvals:

* Security architecture changes
* Encryption standard updates
* Compliance policy revisions
* Access model modifications
* Security documentation updates

---

### SEC-027

Security architecture modifications shall require formal governance approval.

---

### SEC-028

Security documentation shall remain synchronized with implemented controls.

---

# 59.16 Traceability

This chapter defines enterprise standards for Security, Encryption & Compliance within the Mediverse platform.

**Related Documents**

* Chapter 26 – Identity & Authentication Tables
* Chapter 28 – Role & Permission Tables
* Chapter 41 – Audit & Logging Tables
* Chapter 54 – Trigger Design
* Chapter 57 – Migration Strategy (Flyway)
* Chapter 58 – Backup, Recovery & Archival
* Chapter 60 – Production Readiness & Governance
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* PostgreSQL Security Documentation
* OWASP ASVS
* CIS PostgreSQL Benchmark
* Architecture Decision Records (ADR)

**Applies To**

* Authentication
* Authorization
* Encryption
* Secrets Management
* Auditing
* Network Security
* Compliance
* Incident Response
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Security, Encryption & Compliance Strategy for the Mediverse database. It establishes standardized guidance for authentication, authorization, encryption, secrets management, auditing, network protection, compliance, incident response, security testing, and governance. By adopting a Defense-in-Depth architecture, enforcing least-privilege access, protecting data through strong encryption, integrating centralized secrets management, continuously monitoring security events, and aligning controls with recognized security frameworks, the Mediverse platform provides a robust and resilient database security posture capable of protecting sensitive educational and operational data while supporting enterprise-scale regulatory and institutional requirements.

---

**End of Chapter 59**

**Next:** **Chapter 60 – Production Readiness & Governance (Final Chapter)**.

---

# Chapter 60 — Production Readiness & Governance

---

# Chapter Overview

This chapter defines the **Production Readiness & Governance Strategy** for the **Mediverse – AI-Powered Medical Education Platform** database. It establishes enterprise standards for ensuring that the PostgreSQL database is fully prepared for production deployment, operational excellence, high availability, security, observability, compliance, maintainability, and continuous improvement.

Production readiness is not a single activity but a comprehensive validation process encompassing architecture, infrastructure, performance, security, backup and recovery, operational monitoring, disaster recovery, documentation, governance, and organizational preparedness.

This chapter consolidates the standards established throughout the Database Design Document into a comprehensive production governance framework that supports enterprise-scale deployment and long-term operational sustainability.

---

# 60.1 Introduction

The Mediverse database is a mission-critical component supporting:

* Medical students
* Faculty members
* Educational institutions
* AI learning services
* Assessment systems
* Certificate management
* Analytics platforms
* Administrative operations
* External integrations

Any production failure may affect learning continuity, institutional operations, compliance obligations, and organizational reputation.

Therefore, every production deployment shall undergo structured readiness validation before release.

---

# 60.2 Objectives

The objectives of Production Readiness & Governance are to:

* Ensure deployment readiness.
* Validate operational stability.
* Minimize production risk.
* Improve service reliability.
* Standardize governance.
* Strengthen operational excellence.
* Ensure compliance.
* Improve maintainability.
* Enable continuous improvement.
* Support enterprise scalability.

---

### PRG-001

Every production deployment shall complete an approved readiness assessment.

---

### PRG-002

Production databases shall comply with all enterprise governance requirements.

---

# 60.3 Production Readiness Framework

```text id="prg1"
Architecture

↓

Infrastructure

↓

Database

↓

Security

↓

Performance

↓

Backup & Recovery

↓

Monitoring

↓

Operations

↓

Governance

↓

Production Release
```

Every stage shall be validated before production deployment.

---

### PRG-003

Production readiness shall include technical, operational, and organizational validation.

---

### PRG-004

Production releases shall require formal approval.

---

# 60.4 Readiness Checklist

The production readiness assessment includes:

| Area                | Validation            |
| ------------------- | --------------------- |
| Database Schema     | Validated             |
| Migration Scripts   | Executed Successfully |
| Backup Strategy     | Verified              |
| Recovery Testing    | Completed             |
| Security Review     | Approved              |
| Performance Testing | Passed                |
| Monitoring          | Operational           |
| Alerting            | Configured            |
| Documentation       | Updated               |
| Governance Approval | Completed             |

Deployment shall proceed only after all mandatory validations pass.

---

### PRG-005

Mandatory readiness checks shall be completed before deployment.

---

### PRG-006

Unresolved critical findings shall block production release.

---

# 60.5 Infrastructure Readiness

Infrastructure validation includes:

* PostgreSQL cluster health
* Kubernetes readiness
* Persistent storage
* Read replicas
* Connection pooling
* Load balancing
* High availability
* Resource allocation
* Network configuration
* Capacity validation

Infrastructure shall meet approved operational standards.

---

### PRG-007

Infrastructure shall satisfy approved capacity and availability requirements.

---

### PRG-008

Production infrastructure shall be validated before application deployment.

---

# 60.6 Performance Readiness

Performance validation includes:

* Load testing
* Stress testing
* Soak testing
* Failover testing
* Capacity testing
* Query benchmarking
* Connection pool validation
* Replication testing

Performance metrics:

| Metric          | Target                                               |
| --------------- | ---------------------------------------------------- |
| API Response    | ≤ 500 ms (target for typical user-facing operations) |
| Query Latency   | ≤ 100 ms for optimized operational queries           |
| Replication Lag | ≤ 5 seconds under normal operating conditions        |
| Backup Success  | ≥ 99.9%                                              |
| Availability    | ≥ 99.9% (organizational target)                      |

Actual targets may vary based on service-level objectives (SLOs) and workload characteristics.

---

### PRG-009

Production deployment shall require successful performance validation.

---

### PRG-010

Performance baselines shall be documented and periodically reviewed.

---

# 60.7 Security Readiness

Security validation includes:

* RBAC verification
* TLS configuration
* Secrets validation
* Encryption verification
* Vulnerability assessment
* Penetration testing
* Audit logging
* Compliance review
* Network security validation

No production deployment shall bypass security validation.

---

### PRG-011

Security approval shall be mandatory before production release.

---

### PRG-012

Critical security findings shall block deployment until resolved.

---

# 60.8 Operational Readiness

Operational preparation includes:

* Monitoring dashboards
* Alert configuration
* Runbooks
* SOP documentation
* On-call schedules
* Incident procedures
* Escalation matrix
* Disaster recovery plans
* Capacity planning

Operations teams shall be fully prepared before production release.

---

### PRG-013

Operational documentation shall be complete before deployment.

---

### PRG-014

Production support teams shall receive deployment readiness confirmation.

---

# 60.9 Monitoring & Observability

Production monitoring includes:

* Database health
* Query performance
* Connection pools
* Replication health
* Storage utilization
* WAL generation
* Backup status
* Security events
* Resource utilization
* Application dependencies

Monitoring stack:

* PostgreSQL Exporter
* Prometheus
* Grafana
* Alertmanager
* SIEM Platform
* Centralized Logging Platform

---

### PRG-015

Production databases shall be continuously monitored.

---

### PRG-016

Critical operational events shall generate real-time alerts.

---

# 60.10 Change Management

Database changes shall follow formal change management procedures.

```text id="prg2"
Change Request

↓

Architecture Review

↓

Testing

↓

Approval

↓

Deployment

↓

Validation

↓

Closure
```

Emergency changes require post-implementation review.

---

### PRG-017

Database changes shall follow the approved enterprise change management process.

---

### PRG-018

Emergency changes shall undergo retrospective review.

---

# 60.11 Risk Management

Operational risks include:

* Infrastructure failure
* Data corruption
* Security breach
* Performance degradation
* Capacity exhaustion
* Human error
* Deployment failure
* Cloud service outage

Risk mitigation strategies:

* High availability
* Automated backups
* Disaster recovery
* Continuous monitoring
* Capacity planning
* Operational automation

---

### PRG-019

Production risks shall be continuously assessed and mitigated.

---

### PRG-020

Risk assessments shall be reviewed following significant architectural changes.

---

# 60.12 Governance Framework

Database governance includes:

* Executive Steering Committee
* Enterprise Architecture Board
* Database Architecture Review Board
* Database Administration Team
* Platform Engineering Team
* Site Reliability Engineering (SRE)
* Security Review Committee
* Enterprise Data Governance Board
* Compliance Office
* Change Advisory Board (CAB)

Governance responsibilities include:

* Policy enforcement
* Standards maintenance
* Architecture review
* Capacity planning
* Operational review
* Compliance oversight
* Continuous improvement

---

### PRG-021

Database governance responsibilities shall be formally documented.

---

### PRG-022

Governance bodies shall periodically review operational effectiveness.

---

# 60.13 Documentation Management

Production documentation includes:

* Architecture diagrams
* ER diagrams
* Migration history
* Backup procedures
* Recovery procedures
* Security standards
* Monitoring guides
* Runbooks
* SOPs
* ADRs
* Operational checklists

Documentation shall be version-controlled and continuously maintained.

---

### PRG-023

Production documentation shall remain current and version controlled.

---

### PRG-024

Documentation updates shall accompany significant production changes.

---

# 60.14 Continuous Improvement

Operational excellence requires continuous evaluation.

Activities include:

* Performance tuning
* Security enhancements
* Capacity optimization
* Incident reviews
* Root cause analysis
* Technical debt reduction
* Database modernization
* Automation improvements

Continuous improvement ensures long-term platform sustainability.

---

### PRG-025

Operational metrics shall drive continuous improvement initiatives.

---

### PRG-026

Lessons learned from production incidents shall be incorporated into future releases.

---

# 60.15 Governance Checklist

Before every major production release, verify:

| Checklist Item         | Status |
| ---------------------- | ------ |
| Architecture Review    | ✔      |
| Security Approval      | ✔      |
| Performance Validation | ✔      |
| Backup Verification    | ✔      |
| Recovery Testing       | ✔      |
| Monitoring Validation  | ✔      |
| Documentation Updated  | ✔      |
| Change Approval        | ✔      |
| Compliance Review      | ✔      |
| Production Sign-off    | ✔      |

This checklist serves as the final gate before production deployment.

---

### PRG-027

Production deployment shall require completion of the enterprise governance checklist.

---

### PRG-028

Final production approval shall be documented and retained for audit purposes.

---

# 60.16 Traceability

This chapter defines enterprise standards for Production Readiness & Governance within the Mediverse platform.

**Related Documents**

* Chapter 46 – Indexing Strategy
* Chapter 51 – Read Replicas & Scaling
* Chapter 52 – Connection Pooling Strategy
* Chapter 57 – Migration Strategy (Flyway)
* Chapter 58 – Backup, Recovery & Archival
* Chapter 59 – Security, Encryption & Compliance
* Product Requirements Document (PRD)
* Software Requirements Specification (SRS)
* Software Architecture Document (SAD)
* Technical Design Document (TDD)
* Enterprise Runbooks
* Standard Operating Procedures (SOPs)
* Architecture Decision Records (ADR)

**Applies To**

* Production Deployments
* Database Operations
* Governance
* Monitoring
* Security
* Disaster Recovery
* Performance Management
* Enterprise PostgreSQL Database

---

# Chapter Summary

This chapter defines the enterprise Production Readiness & Governance Strategy for the Mediverse database. It establishes standardized guidance for validating infrastructure, performance, security, monitoring, backup and recovery, operational readiness, change management, risk management, documentation, and governance before production deployment. By integrating comprehensive readiness assessments with structured governance, continuous monitoring, formal approval workflows, and ongoing operational improvement, the Mediverse platform ensures that its PostgreSQL database remains secure, resilient, compliant, scalable, and fully prepared to support enterprise-scale medical education and AI-powered learning services.

---

# Database Design Document Completion Summary

The **Database Design Document (DDD)** for the **Mediverse – AI-Powered Medical Education Platform** is now complete.

## Document Statistics

* **Total Chapters:** 60
* **Appendices:** 6
* **Coverage Areas:**

  * Database Architecture
  * Data Modeling
  * Schema Design
  * Core Entity Design
  * Relationships & Integrity
  * Performance Engineering
  * Database Programming
  * Data Management
  * Security & Compliance
  * Production Readiness & Governance

## Deliverables Covered

* Database Standards
* Naming Conventions
* ERD Strategy
* Physical & Logical Models
* Core Entity Definitions
* Indexing & Partitioning
* Views & Materialized Views
* Read Replicas & Scaling
* Connection Pooling
* Stored Procedures
* Triggers
* Sequences & ID Generation
* Functions & Utility Objects
* Flyway Migration Strategy
* Backup & Recovery
* Security & Compliance
* Production Governance

This Database Design Document provides a comprehensive enterprise reference for the design, implementation, operation, governance, and evolution of the Mediverse PostgreSQL database.

---

**End of Chapter 60**

**End of Database Design Document (DDD)**.

# Appendix A — Enterprise Data Dictionary

---

# Appendix Overview

This appendix defines the **Enterprise Data Dictionary** for the **Mediverse – AI-Powered Medical Education Platform**. It provides a centralized reference for the database schema by documenting entities, attributes, data types, constraints, relationships, ownership, and business meaning.

The Data Dictionary serves as the authoritative metadata repository for developers, database administrators, architects, QA engineers, DevOps engineers, BI developers, auditors, and business stakeholders.

---

# A.1 Purpose

The Enterprise Data Dictionary is intended to:

* Standardize database terminology.
* Document all database objects.
* Improve maintainability.
* Support onboarding.
* Enable regulatory compliance.
* Improve reporting consistency.
* Simplify API development.
* Improve data governance.
* Support impact analysis.
* Reduce ambiguity across teams.

---

# A.2 Scope

The Data Dictionary covers:

* Schemas
* Tables
* Columns
* Views
* Materialized Views
* Indexes
* Constraints
* Primary Keys
* Foreign Keys
* Sequences
* Functions
* Stored Procedures
* Triggers
* Enumerations
* Domains
* Lookup Tables

---

# A.3 Metadata Standard

Every database object shall include the following metadata.

| Metadata        | Description                 |
| --------------- | --------------------------- |
| Object Name     | Unique database object name |
| Business Name   | Human-readable name         |
| Description     | Business purpose            |
| Schema          | Database schema             |
| Object Type     | Table, View, Function, etc. |
| Owner           | Responsible team            |
| Created By      | Author                      |
| Created Date    | Creation timestamp          |
| Last Modified   | Latest modification         |
| Version         | Current version             |
| Status          | Active / Deprecated         |
| Related Modules | Associated functional areas |

---

### DDT-001

Every production database object shall have complete metadata documentation.

---

### DDT-002

Metadata shall remain synchronized with production implementations.

---

# A.4 Table Dictionary Template

Every table shall be documented using a standardized format.

| Attribute               | Description                                   |
| ----------------------- | --------------------------------------------- |
| Table Name              | Physical table name                           |
| Business Purpose        | Functional description                        |
| Primary Key             | Primary identifier                            |
| Foreign Keys            | Referenced entities                           |
| Estimated Growth        | Capacity planning                             |
| Data Retention          | Retention policy                              |
| Security Classification | Public / Internal / Confidential / Restricted |
| Owner                   | Responsible team                              |

Example:

| Property         | Value                         |
| ---------------- | ----------------------------- |
| Table            | users                         |
| Business Purpose | Stores platform user accounts |
| Primary Key      | user_id                       |
| Classification   | Confidential                  |
| Owner            | Identity Management Team      |

---

# A.5 Column Dictionary Template

Each column shall include standardized metadata.

| Attribute        | Description          |
| ---------------- | -------------------- |
| Column Name      | Physical column      |
| Data Type        | PostgreSQL data type |
| Nullable         | Yes / No             |
| Default Value    | Default expression   |
| Description      | Business meaning     |
| Validation Rules | Constraints          |
| Example Value    | Sample data          |

Example:

| Property    | Value                                             |
| ----------- | ------------------------------------------------- |
| Column      | email                                             |
| Type        | VARCHAR(255)                                      |
| Nullable    | No                                                |
| Unique      | Yes                                               |
| Description | User email address                                |
| Example     | [student@example.edu](mailto:student@example.edu) |

---

# A.6 Core Entity Dictionary

Representative core entities include:

| Entity        | Business Purpose            |
| ------------- | --------------------------- |
| users         | Identity and authentication |
| roles         | Authorization roles         |
| permissions   | Access permissions          |
| students      | Student profile             |
| faculty       | Faculty profile             |
| courses       | Course catalog              |
| lessons       | Course lessons              |
| assessments   | Assessments                 |
| questions     | Question bank               |
| certificates  | Certificate management      |
| notifications | Notification delivery       |
| ai_knowledge  | AI knowledge repository     |
| audit_logs    | Operational auditing        |

---

# A.7 Naming Reference

| Object             | Convention           |
| ------------------ | -------------------- |
| Tables             | snake_case plural    |
| Columns            | snake_case           |
| Primary Keys       | entity_id            |
| Foreign Keys       | referenced_entity_id |
| Views              | vw_*                 |
| Materialized Views | mv_*                 |
| Functions          | fn_*                 |
| Utility Functions  | utl_*                |
| Stored Procedures  | sp_*                 |
| Triggers           | trg_*                |
| Sequences          | seq_*                |

---

# A.8 Security Classification

Every object shall be assigned a classification.

| Classification | Protection Level           |
| -------------- | -------------------------- |
| Public         | Minimal restrictions       |
| Internal       | Organization use only      |
| Confidential   | Restricted business access |
| Restricted     | Highest protection level   |

Examples:

| Object          | Classification |
| --------------- | -------------- |
| course_catalog  | Public         |
| student_records | Confidential   |
| audit_logs      | Restricted     |
| password_hash   | Restricted     |

---

### DDT-003

Every table and column shall have an approved security classification.

---

### DDT-004

Classification changes shall require governance approval.

---

# A.9 Ownership Matrix

| Domain             | Owner                        |
| ------------------ | ---------------------------- |
| Identity           | IAM Team                     |
| Student Management | Academic Services            |
| Faculty            | Academic Services            |
| Learning Content   | Content Management Team      |
| AI Platform        | AI Engineering Team          |
| Analytics          | BI Team                      |
| Infrastructure     | Database Administration Team |
| Security           | Information Security Team    |

Ownership ensures accountability throughout the object lifecycle.

---

# A.10 Governance

The Enterprise Data Dictionary shall be:

* Version controlled
* Reviewed quarterly
* Updated with every schema change
* Integrated into CI/CD validation where practical
* Accessible to authorized stakeholders
* Auditable

---

### DDT-005

The Enterprise Data Dictionary shall be maintained as the authoritative metadata repository.

---

### DDT-006

Schema changes shall include corresponding Data Dictionary updates before production release.

---

# Appendix Summary

The Enterprise Data Dictionary provides a standardized metadata catalog for every database object within the Mediverse platform. It improves consistency, governance, maintainability, security classification, ownership, and regulatory compliance while serving as the authoritative reference for developers, architects, database administrators, auditors, and operational teams.

---

**End of Appendix A**

**Next:** **Appendix B – Entity Relationship Diagrams (ERD)**.

# Appendix B — Entity Relationship Diagrams (ERD)

---

# Appendix Overview

This appendix defines the **Enterprise Entity Relationship Diagrams (ERDs)** for the **Mediverse – AI-Powered Medical Education Platform** database. The ERDs provide a visual and logical representation of the relationships between business entities, ensuring data consistency, referential integrity, scalability, and maintainability.

The ERDs complement the conceptual, logical, and physical data models described in Chapters 11–15 and serve as the authoritative reference for database implementation, application development, API design, reporting, analytics, and system integration.

---

# B.1 Purpose

The Enterprise ERDs are intended to:

* Illustrate relationships between business entities.
* Document primary and foreign key relationships.
* Support database implementation.
* Assist application development.
* Simplify onboarding.
* Improve data governance.
* Support API design.
* Facilitate reporting and analytics.
* Enable impact analysis.
* Improve maintainability.

---

# B.2 ERD Design Principles

The Mediverse database follows these principles:

* Normalize operational data to at least Third Normal Form (3NF), unless justified otherwise.
* Use surrogate primary keys for major entities.
* Enforce referential integrity through foreign keys.
* Minimize redundant data.
* Use lookup tables for controlled vocabularies.
* Model many-to-many relationships through junction tables.
* Separate transactional and analytical models.
* Design for extensibility and modularity.

---

### ERD-001

All production entities shall participate in documented relationship models.

---

### ERD-002

Relationships shall be enforced using approved referential integrity constraints.

---

# B.3 High-Level Enterprise ERD

```text
                           +-------------------+
                           |      USERS        |
                           +-------------------+
                                      |
                    +-----------------+------------------+
                    |                                    |
                    ▼                                    ▼
           +----------------+                  +----------------+
           |    STUDENTS    |                  |    FACULTY     |
           +----------------+                  +----------------+
                    |                                    |
                    +------------------+-----------------+
                                       |
                                       ▼
                               +----------------+
                               |    COURSES     |
                               +----------------+
                                       |
                                       ▼
                               +----------------+
                               |    LESSONS     |
                               +----------------+
                                       |
                                       ▼
                               +----------------+
                               | ASSESSMENTS    |
                               +----------------+
                                       |
                                       ▼
                               +----------------+
                               |   QUESTIONS    |
                               +----------------+
                                       |
                                       ▼
                               +----------------+
                               |   RESULTS      |
                               +----------------+
                                       |
                                       ▼
                               +----------------+
                               | CERTIFICATES   |
                               +----------------+
```

This diagram represents the primary educational workflow of the Mediverse platform.

---

# B.4 Identity & Access ERD

```text
USERS
  │
  │1
  │
  ├───────────────∞ USER_ROLES
  │                   │
  │                   │∞
  │                   │
  │                   1
  ▼
ROLES
  │
  │1
  │
  ├───────────────∞ ROLE_PERMISSIONS
                      │
                      │∞
                      │
                      ▼
                 PERMISSIONS
```

Key Relationships:

* One User → Many User Roles
* One Role → Many User Assignments
* One Role → Many Permissions
* Permissions are reusable across roles.

---

### ERD-003

Identity entities shall support many-to-many authorization relationships.

---

# B.5 Academic Module ERD

```text
COURSES
    │1
    │
    ├──────────────∞ LESSONS
    │
    ├──────────────∞ ENROLLMENTS
    │                    │
    │                    ▼
    │               STUDENTS
    │
    └──────────────∞ COURSE_FACULTY
                         │
                         ▼
                      FACULTY
```

Relationships:

* One Course → Many Lessons
* One Course → Many Students
* One Course → Multiple Faculty
* Students may enroll in multiple Courses.

---

### ERD-004

Academic entities shall support many-to-many enrollment relationships.

---

# B.6 Assessment Module ERD

```text
ASSESSMENTS
      │
      │1
      │
      ├────────────∞ QUESTIONS
      │
      │
      ├────────────∞ STUDENT_ATTEMPTS
      │                     │
      │                     ▼
      │                STUDENTS
      │
      └────────────∞ RESULTS
```

Relationships:

* Assessment → Multiple Questions
* Student → Multiple Attempts
* Attempt → Single Result
* Assessment → Multiple Results

---

### ERD-005

Assessment history shall preserve every student attempt.

---

# B.7 AI Learning Module ERD

```text
AI_MODELS
      │
      │1
      │
      ├────────────∞ AI_KNOWLEDGE
      │
      ├────────────∞ AI_CONVERSATIONS
      │
      └────────────∞ AI_RESPONSES
```

Relationships:

* AI Model → Knowledge Base
* AI Model → Conversations
* AI Model → Generated Responses

---

### ERD-006

AI entities shall preserve complete interaction history.

---

# B.8 Media Management ERD

```text
MEDIA_FILES
      │
      │1
      │
      ├──────────∞ LESSON_MEDIA
      │
      ├──────────∞ COURSE_MEDIA
      │
      └──────────∞ USER_UPLOADS
```

Relationships:

* Media reused across multiple modules.
* Supports images, videos, PDFs, audio, and 3D assets.

---

### ERD-007

Media assets shall support reusable relationships.

---

# B.9 Analytics ERD

```text
STUDENTS
      │
      │
      ├──────────∞ STUDENT_PROGRESS
      │
      ├──────────∞ LEARNING_ANALYTICS
      │
      └──────────∞ DASHBOARD_METRICS
```

Analytics entities aggregate operational data for reporting while remaining logically separated from transactional processing.

---

### ERD-008

Analytical entities shall not compromise transactional integrity.

---

# B.10 Audit & Logging ERD

```text
USERS
   │
   │1
   │
   ├────────────∞ AUDIT_LOGS
   │
   ├────────────∞ LOGIN_HISTORY
   │
   └────────────∞ SECURITY_EVENTS
```

The audit subsystem provides complete traceability for operational and security activities.

---

### ERD-009

Audit entities shall preserve immutable historical records.

---

# B.11 Cross-Module Relationship Map

```text
Identity
     │
     ▼
Academic
     │
     ▼
Learning
     │
     ▼
Assessment
     │
     ▼
Certification
     │
     ▼
Analytics

Parallel Modules

Media
AI
Notifications
Audit
Security
```

Cross-module relationships ensure modularity while maintaining data consistency across the platform.

---

# B.12 Relationship Cardinality Standards

| Symbol    | Meaning                           |
| --------- | --------------------------------- |
| 1 : 1     | One-to-One                        |
| 1 : N     | One-to-Many                       |
| N : M     | Many-to-Many (via junction table) |
| Optional  | Nullable relationship             |
| Mandatory | Non-nullable relationship         |

All many-to-many relationships shall be implemented using explicit junction tables.

---

### ERD-010

Direct many-to-many relationships shall not be implemented without junction tables.

---

# B.13 ERD Governance

Enterprise ERDs shall:

* Be version controlled.
* Reflect the production schema.
* Be reviewed during architecture changes.
* Be updated after schema modifications.
* Be referenced in design reviews.
* Support traceability with migration history.
* Align with Architecture Decision Records (ADRs).

---

### ERD-011

Entity Relationship Diagrams shall remain synchronized with production database schemas.

---

### ERD-012

ERD updates shall accompany approved schema changes before production deployment.

---

# B.14 Traceability

This appendix provides the authoritative relationship model for the Mediverse database.

**Related Chapters**

* Chapter 11 – Conceptual Data Model
* Chapter 12 – Logical Data Model
* Chapter 13 – Physical Data Model
* Chapter 14 – Entity Relationship Diagram (ERD)
* Chapter 42 – Relationship Design
* Chapter 43 – Cascading Strategy
* Chapter 44 – Referential Integrity
* Appendix A – Enterprise Data Dictionary

**Applies To**

* Database Design
* Schema Implementation
* Application Development
* API Development
* Business Intelligence
* Reporting
* Data Governance
* Enterprise PostgreSQL Database

---

# Appendix Summary

This appendix defines the Enterprise Entity Relationship Diagrams (ERDs) for the Mediverse platform. It documents the relationships among core business entities, establishes standardized cardinality and modeling practices, and provides architectural guidance for implementing a scalable, maintainable, and governable PostgreSQL database. The ERDs serve as the authoritative reference for developers, architects, database administrators, and analysts throughout the system lifecycle.

---

**End of Appendix B**

**Next:** **Appendix C – Database Naming Standards**.

# Appendix C — Database Naming Standards

---

# Appendix Overview

This appendix defines the **Enterprise Database Naming Standards** for the **Mediverse – AI-Powered Medical Education Platform**. Consistent naming conventions improve readability, maintainability, automation, governance, and collaboration across development, database administration, DevOps, analytics, and operations teams.

These standards apply to all PostgreSQL database objects, migration scripts, SQL code, and supporting artifacts throughout the database lifecycle.

---

# C.1 Purpose

The objectives of the Database Naming Standards are to:

* Establish consistent naming conventions.
* Improve database readability.
* Simplify maintenance.
* Support automation and CI/CD.
* Reduce ambiguity.
* Improve documentation quality.
* Enable easier troubleshooting.
* Facilitate governance.
* Support enterprise scalability.
* Promote long-term maintainability.

---

# C.2 General Naming Principles

All database object names shall follow these principles:

* Use lowercase characters only.
* Separate words using underscores (`snake_case`).
* Use meaningful and descriptive names.
* Avoid abbreviations unless standardized.
* Avoid reserved SQL keywords.
* Use singular names for entities represented by domains and sequences where appropriate; plural names for business tables.
* Ensure names remain stable across releases.
* Maintain consistency across schemas.

Examples:

| Good                 | Poor       |
| -------------------- | ---------- |
| student_progress     | sp         |
| course_enrollment    | ce         |
| assessment_results   | tbl_result |
| notification_history | nh         |

---

### DNS-001

All database object names shall follow approved enterprise naming conventions.

---

### DNS-002

Reserved SQL keywords shall not be used as object names.

---

# C.3 Schema Naming Standards

Schemas organize database objects by functional domain.

| Schema      | Purpose                          |
| ----------- | -------------------------------- |
| public      | Shared objects                   |
| identity    | Authentication and authorization |
| academic    | Courses, lessons, enrollments    |
| assessment  | Exams and question banks         |
| ai          | AI knowledge and interactions    |
| media       | Media assets                     |
| analytics   | Reporting and metrics            |
| audit       | Audit logs                       |
| integration | External integrations            |

Rules:

* Use lowercase.
* Use business-oriented names.
* Keep names concise.
* Avoid environment-specific names.

---

### DNS-003

Schemas shall represent logical business domains.

---

# C.4 Table Naming Standards

Business tables shall:

* Use plural nouns.
* Follow `snake_case`.
* Clearly represent the stored entity.

Examples:

| Table         | Purpose             |
| ------------- | ------------------- |
| users         | User accounts       |
| students      | Student profiles    |
| faculty       | Faculty records     |
| courses       | Course catalog      |
| lessons       | Learning content    |
| assessments   | Exams               |
| questions     | Question bank       |
| certificates  | Issued certificates |
| notifications | User notifications  |

Avoid prefixes such as:

* tbl_
* t_
* database-specific identifiers

---

### DNS-004

Business tables shall use plural descriptive names.

---

# C.5 Column Naming Standards

Columns shall clearly describe stored information.

Examples:

| Column           | Meaning                     |
| ---------------- | --------------------------- |
| user_id          | Primary identifier          |
| email            | Email address               |
| created_at       | Creation timestamp          |
| updated_at       | Last modification timestamp |
| deleted_at       | Soft deletion timestamp     |
| is_active        | Boolean status              |
| course_name      | Course title                |
| assessment_score | Numeric score               |

Boolean columns shall begin with:

* is_
* has_
* can_
* should_

Timestamp columns shall use:

* created_at
* updated_at
* deleted_at

---

### DNS-005

Column names shall be descriptive and consistent across schemas.

---

### DNS-006

Boolean fields shall use standardized prefixes.

---

# C.6 Primary Key Naming

Primary keys shall follow a consistent format.

Pattern:

```text id="dns1"
<entity>_id
```

Examples:

```text id="dns2"
user_id
student_id
course_id
lesson_id
assessment_id
question_id
certificate_id
notification_id
```

Surrogate keys shall use BIGINT or UUID according to architectural standards.

---

### DNS-007

Primary keys shall use the `<entity>_id` convention.

---

# C.7 Foreign Key Naming

Foreign keys reference parent entities.

Examples:

| Table        | Foreign Key |
| ------------ | ----------- |
| enrollments  | student_id  |
| enrollments  | course_id   |
| lessons      | course_id   |
| assessments  | lesson_id   |
| certificates | student_id  |

Foreign key names shall clearly indicate the referenced entity.

---

### DNS-008

Foreign key columns shall use the referenced entity identifier.

---

# C.8 Constraint Naming Standards

Constraints shall use standardized prefixes.

| Constraint  | Prefix         | Example            |
| ----------- | -------------- | ------------------ |
| Primary Key | pk_            | pk_users           |
| Foreign Key | fk_            | fk_lessons_courses |
| Unique      | uq_            | uq_users_email     |
| Check       | chk_           | chk_score_range    |
| Default     | df_ (optional) | df_created_at      |

Examples:

```text id="dns3"
pk_users
fk_courses_faculty
uq_users_username
chk_percentage
```

---

### DNS-009

Constraint names shall include standardized prefixes.

---

# C.9 Index Naming Standards

Indexes shall identify the associated table and indexed columns.

Pattern:

```text id="dns4"
idx_<table>_<column>
```

Examples:

```text id="dns5"
idx_users_email
idx_courses_name
idx_students_registration_no
idx_assessments_status
```

Composite indexes:

```text id="dns6"
idx_courses_category_status
```

Unique indexes:

```text id="dns7"
uidx_users_email
```

---

### DNS-010

Indexes shall follow standardized enterprise naming conventions.

---

# C.10 View & Materialized View Naming

Views:

```text id="dns8"
vw_student_progress
vw_course_statistics
vw_assessment_summary
```

Materialized Views:

```text id="dns9"
mv_student_dashboard
mv_course_metrics
mv_ai_usage_statistics
```

Prefixes:

* `vw_` → Standard Views
* `mv_` → Materialized Views

---

### DNS-011

Views and materialized views shall use approved prefixes.

---

# C.11 Function, Procedure & Trigger Naming

Functions:

```text id="dns10"
fn_calculate_score()
fn_generate_certificate()
fn_validate_email()
```

Utility Functions:

```text id="dns11"
utl_format_duration()
utl_normalize_name()
```

Stored Procedures:

```text id="dns12"
sp_archive_logs()
sp_generate_reports()
```

Triggers:

```text id="dns13"
trg_users_created
trg_assessments_updated
```

---

### DNS-012

Database programming objects shall use standardized prefixes.

---

# C.12 Sequence Naming

Sequences shall follow:

```text id="dns14"
seq_<table>_<column>
```

Examples:

```text id="dns15"
seq_users_id
seq_courses_id
seq_lessons_id
seq_assessments_id
```

---

### DNS-013

Sequences shall follow standardized enterprise naming conventions.

---

# C.13 Migration Naming

Flyway migration files:

```text id="dns16"
V1__Initial_Schema.sql

V2__Identity_Module.sql

V3__Academic_Module.sql

V4__Assessment_Module.sql

R__Refresh_Views.sql
```

Rules:

* Sequential versioning.
* Descriptive names.
* Immutable after execution.

---

### DNS-014

Migration files shall follow approved versioning and naming standards.

---

# C.14 Naming Anti-Patterns

The following naming practices are prohibited:

* Single-character names
* Cryptic abbreviations
* Mixed case
* Spaces
* Special characters
* Reserved keywords
* Environment-specific suffixes (e.g., `_dev`, `_uat`)
* Numeric suffixes without business meaning

Examples:

| Invalid    | Reason                            |
| ---------- | --------------------------------- |
| TblUsers   | Mixed case and unnecessary prefix |
| data1      | Non-descriptive                   |
| user table | Contains spaces                   |
| select     | Reserved SQL keyword              |
| course_dev | Environment-specific              |

---

### DNS-015

Prohibited naming patterns shall not be used in production databases.

---

# C.15 Governance

Naming standards shall be enforced through:

* Architecture reviews
* Code reviews
* Flyway migration validation
* CI/CD quality gates
* Automated linting tools
* Database design reviews
* Documentation reviews
* Periodic governance audits

Exceptions require approval from the Database Architecture Review Board.

---

### DNS-016

All database objects shall comply with enterprise naming standards before production deployment.

---

# C.16 Traceability

This appendix defines the authoritative naming conventions for all database objects within the Mediverse platform.

**Related Chapters**

* Chapter 9 – Database Naming Conventions
* Chapter 10 – Database Object Standards
* Chapter 17 – Table Design Standards
* Chapter 18 – Column Design Standards
* Chapter 19 – Primary Key Strategy
* Chapter 20 – Foreign Key Strategy
* Chapter 46 – Indexing Strategy
* Chapter 57 – Migration Strategy (Flyway)
* Appendix A – Enterprise Data Dictionary
* Appendix B – Entity Relationship Diagrams (ERD)

**Applies To**

* Schemas
* Tables
* Columns
* Constraints
* Indexes
* Views
* Materialized Views
* Functions
* Procedures
* Triggers
* Sequences
* Flyway Migrations
* Enterprise PostgreSQL Database

---

# Appendix Summary

This appendix establishes the enterprise naming standards for the Mediverse database. By defining consistent conventions for schemas, tables, columns, keys, constraints, indexes, views, functions, procedures, triggers, sequences, and migration scripts, it promotes clarity, maintainability, automation, governance, and long-term scalability. Adherence to these standards ensures a uniform database design that supports efficient development, operations, and enterprise-wide collaboration.

---

**End of Appendix C**

**Next:** **Appendix D – SQL Coding Standards**.

# Appendix D — SQL Coding Standards

---

# Appendix Overview

This appendix defines the **Enterprise SQL Coding Standards** for the **Mediverse – AI-Powered Medical Education Platform**. These standards establish uniform guidelines for writing SQL scripts, queries, stored procedures, functions, triggers, views, and database maintenance scripts to ensure readability, maintainability, security, consistency, and performance.

The SQL Coding Standards apply to all database artifacts developed for PostgreSQL 17+, including Flyway migration scripts, administrative SQL, reporting queries, and operational maintenance tasks.

---

# D.1 Purpose

The objectives of the SQL Coding Standards are to:

* Promote consistent SQL development.
* Improve code readability.
* Simplify maintenance.
* Reduce implementation defects.
* Improve query performance.
* Support code reviews.
* Enhance database security.
* Enable automated validation.
* Improve collaboration.
* Support long-term maintainability.

---

# D.2 Scope

These standards apply to:

* SQL Queries
* DDL Scripts
* DML Scripts
* Stored Procedures
* Functions
* Triggers
* Views
* Materialized Views
* Flyway Migration Scripts
* Administrative SQL
* Reporting SQL
* Performance Tuning Scripts

---

### SQL-001

All SQL code shall comply with the approved enterprise SQL Coding Standards.

---

### SQL-002

SQL scripts shall undergo peer review before production deployment.

---

# D.3 General Coding Principles

SQL development shall follow these principles:

* Prefer readability over cleverness.
* Write deterministic and predictable SQL.
* Use explicit syntax.
* Minimize complexity.
* Avoid duplicated logic.
* Use meaningful object names.
* Optimize only after measurement.
* Preserve transactional integrity.
* Document complex logic.
* Follow secure coding practices.

---

### SQL-003

SQL shall prioritize clarity, correctness, and maintainability.

---

# D.4 Formatting Standards

Keywords shall be written in uppercase.

Identifiers shall use lowercase snake_case.

Example:

```sql
SELECT
    user_id,
    first_name,
    last_name
FROM users
WHERE is_active = TRUE
ORDER BY created_at DESC;
```

Formatting guidelines:

* One clause per line.
* Consistent indentation (4 spaces).
* One column per line in long SELECT lists.
* Align JOIN conditions.
* Use meaningful aliases.
* Terminate every statement with a semicolon.

---

### SQL-004

SQL formatting shall follow the approved enterprise style guide.

---

# D.5 Naming in SQL

Always reference database objects using standardized names.

Good:

```sql
SELECT *
FROM student_progress;
```

Poor:

```sql
SELECT *
FROM sp;
```

Aliases shall be meaningful.

Good:

```sql
SELECT
    s.student_id,
    c.course_name
FROM students s
JOIN courses c
```

Avoid aliases such as:

```text
a
b
c
x
tmp
```

unless used in short, localized queries where readability is not reduced.

---

### SQL-005

Aliases shall improve readability and reflect business meaning.

---

# D.6 Query Design Standards

Preferred practices:

* Explicit column selection.
* Appropriate filtering.
* Parameterized queries.
* Proper JOIN conditions.
* Efficient aggregation.
* Deterministic ordering.

Example:

```sql
SELECT
    student_id,
    full_name,
    email
FROM students
WHERE is_active = TRUE
ORDER BY full_name;
```

Avoid:

```sql
SELECT *
FROM students;
```

unless justified for administrative or exploratory purposes.

---

### SQL-006

Production queries shall explicitly specify required columns whenever practical.

---

### SQL-007

Queries shall include deterministic ordering where result order is significant.

---

# D.7 JOIN Standards

Preferred JOIN order:

```sql
FROM users u
INNER JOIN students s
    ON u.user_id = s.user_id
LEFT JOIN enrollments e
    ON s.student_id = e.student_id
```

Rules:

* Always specify JOIN type.
* Avoid implicit joins.
* Keep JOIN conditions simple.
* Use indexed columns where appropriate.

---

### SQL-008

Implicit joins shall not be used in production SQL.

---

# D.8 Transaction Standards

Transactional SQL shall ensure consistency.

Example:

```sql
BEGIN;

UPDATE students
SET is_active = FALSE
WHERE student_id = 1001;

INSERT INTO audit_logs (...);

COMMIT;
```

Rollback shall occur upon failure.

```sql
ROLLBACK;
```

Transactions should remain as short as practical to reduce lock contention.

---

### SQL-009

Business transactions shall preserve ACID properties.

---

### SQL-010

Failed transactions shall be rolled back safely.

---

# D.9 Stored Procedure Standards

Procedures shall:

* Validate inputs.
* Handle exceptions.
* Log failures where appropriate.
* Minimize side effects.
* Return predictable results.

Template:

```sql
CREATE PROCEDURE sp_archive_logs()
LANGUAGE plpgsql
AS $$
BEGIN
    -- Business logic
END;
$$;
```

---

### SQL-011

Stored procedures shall implement structured exception handling.

---

# D.10 Function Standards

Functions shall:

* Be deterministic where feasible.
* Avoid unnecessary side effects.
* Clearly document parameters.
* Return well-defined values.

Example:

```sql
CREATE FUNCTION fn_total_score(...)
RETURNS NUMERIC
```

Functions should avoid modifying persistent business data unless explicitly designed for that purpose.

---

### SQL-012

Functions shall clearly define inputs, outputs, and expected behavior.

---

# D.11 Trigger Standards

Triggers shall:

* Be lightweight.
* Avoid recursive execution.
* Execute only required logic.
* Be documented.

Example:

```sql
CREATE TRIGGER trg_users_updated
AFTER UPDATE
ON users
```

Trigger execution time should be minimized.

---

### SQL-013

Trigger logic shall remain simple and efficient.

---

# D.12 Error Handling

SQL shall handle expected failures.

Recommended practices:

* Validate input.
* Raise meaningful exceptions.
* Log failures where appropriate.
* Preserve transactional integrity.
* Avoid silent failures.

Example:

```sql
RAISE EXCEPTION 'Invalid student identifier';
```

---

### SQL-014

Errors shall be explicit and meaningful.

---

# D.13 Security Standards

SQL shall follow secure coding practices.

Requirements:

* Parameterized statements
* Least privilege
* Input validation
* Avoid dynamic SQL unless necessary
* Escape identifiers appropriately
* Protect confidential data
* Review administrative scripts

Unsafe example:

```sql
EXECUTE 'SELECT * FROM users WHERE id=' || user_input;
```

Preferred:

Parameterized SQL or validated dynamic SQL using appropriate PostgreSQL functions (e.g., `format()` with identifier quoting where applicable).

---

### SQL-015

SQL shall prevent injection vulnerabilities through approved secure coding practices.

---

# D.14 Performance Standards

Performance considerations:

* Use indexes effectively.
* Avoid unnecessary subqueries.
* Limit result sets.
* Avoid Cartesian products.
* Review execution plans.
* Optimize joins.
* Batch large updates.
* Use pagination where appropriate.

Developers should validate complex queries using `EXPLAIN` or `EXPLAIN ANALYZE` in non-production environments.

---

### SQL-016

Performance-critical SQL shall undergo execution plan analysis.

---

# D.15 Documentation Standards

Every SQL artifact shall include documentation.

Example:

```sql
/*
Purpose:
Calculates cumulative student score.

Author:
Database Team

Version:
1.0

Dependencies:
students
assessments
results
*/
```

Migration scripts shall include:

* Version
* Purpose
* Related requirement
* Dependencies
* Author (if organizational policy requires)
* Date (optional if managed by version control)

---

### SQL-017

SQL artifacts shall contain sufficient documentation for maintenance.

---

# D.16 Code Review Checklist

Reviewers shall verify:

| Item                    | Verification |
| ----------------------- | ------------ |
| Naming Standards        | ✔            |
| Formatting              | ✔            |
| Security                | ✔            |
| Performance             | ✔            |
| Transactions            | ✔            |
| Error Handling          | ✔            |
| Documentation           | ✔            |
| Readability             | ✔            |
| Testing                 | ✔            |
| Migration Compatibility | ✔            |

Code reviews shall be mandatory for production SQL.

---

### SQL-018

Production SQL shall pass enterprise code review before release.

---

# D.17 Governance

SQL Coding Standards shall be enforced through:

* Architecture Reviews
* Database Code Reviews
* Flyway Validation
* Static SQL Analysis
* CI/CD Quality Gates
* DBA Approval
* Security Review
* Performance Review
* Change Advisory Board (CAB)

Exceptions require documented approval.

---

### SQL-019

Exceptions to SQL Coding Standards shall require formal approval.

---

### SQL-020

SQL Coding Standards shall be reviewed periodically and updated as needed.

---

# D.18 Traceability

This appendix defines the enterprise SQL Coding Standards for the Mediverse platform.

**Related Chapters**

* Chapter 17 – Table Design Standards
* Chapter 18 – Column Design Standards
* Chapter 22 – Constraints Design
* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 53 – Stored Procedures Strategy
* Chapter 54 – Trigger Design
* Chapter 56 – Functions & Utility Objects
* Chapter 57 – Migration Strategy (Flyway)
* Appendix C – Database Naming Standards

**Applies To**

* SQL Development
* DDL Scripts
* DML Scripts
* Stored Procedures
* Functions
* Triggers
* Views
* Materialized Views
* Flyway Migrations
* PostgreSQL Database Administration

---

# Appendix Summary

This appendix establishes the Enterprise SQL Coding Standards for the Mediverse database. It defines best practices for SQL formatting, naming, query design, transactions, stored procedures, functions, triggers, security, performance optimization, documentation, and governance. By enforcing these standards, the Mediverse platform ensures that all SQL artifacts are readable, maintainable, secure, performant, and aligned with enterprise development and operational practices.

---

**End of Appendix D**

**Next:** **Appendix E – Database Performance & Optimization Checklist**.

# Appendix E — Database Performance & Optimization Checklist

---

# Appendix Overview

This appendix defines the **Enterprise Database Performance & Optimization Checklist** for the **Mediverse – AI-Powered Medical Education Platform**. It provides a standardized framework for evaluating, monitoring, optimizing, and maintaining PostgreSQL database performance throughout the software development lifecycle and production operations.

The checklist serves as a governance artifact for Database Administrators (DBAs), Architects, Developers, DevOps Engineers, Site Reliability Engineers (SREs), and Operations Teams to ensure the database consistently meets performance, scalability, availability, and reliability objectives.

---

# E.1 Purpose

The objectives of the Performance & Optimization Checklist are to:

* Validate production readiness.
* Improve query performance.
* Optimize resource utilization.
* Reduce latency.
* Ensure scalability.
* Improve availability.
* Support capacity planning.
* Prevent performance regressions.
* Standardize performance reviews.
* Enable continuous optimization.

---

# E.2 Scope

This checklist applies to:

* PostgreSQL Clusters
* Database Servers
* Schemas
* Tables
* Indexes
* SQL Queries
* Stored Procedures
* Functions
* Views
* Materialized Views
* Replication
* Connection Pools
* Backup Operations
* Analytics Queries
* AI Workloads

---

### PRF-001

Performance reviews shall be conducted before every major production release.

---

### PRF-002

Critical performance issues shall be resolved prior to deployment.

---

# E.3 Infrastructure Checklist

| Item                            | Verification |
| ------------------------------- | ------------ |
| CPU Utilization Reviewed        | ✔            |
| Memory Allocation Verified      | ✔            |
| Storage Capacity Validated      | ✔            |
| Storage IOPS Adequate           | ✔            |
| Network Latency Acceptable      | ✔            |
| Kubernetes Resources Configured | ✔            |
| High Availability Tested        | ✔            |
| Replication Operational         | ✔            |
| Backup Storage Available        | ✔            |
| Monitoring Enabled              | ✔            |

Infrastructure shall support projected production workloads with sufficient headroom.

---

### PRF-003

Infrastructure resources shall satisfy approved capacity requirements.

---

# E.4 Schema Design Checklist

Verify:

* Appropriate normalization
* Minimal redundancy
* Correct primary keys
* Foreign key integrity
* Lookup tables
* Proper constraints
* Appropriate partitioning
* Archival strategy
* Data retention
* Naming compliance

---

### PRF-004

Database schema shall conform to enterprise design standards.

---

# E.5 Index Optimization Checklist

Review:

| Verification                         | Status |
| ------------------------------------ | ------ |
| Primary Key Indexes                  | ✔      |
| Foreign Key Indexes                  | ✔      |
| Frequently Filtered Columns Indexed  | ✔      |
| Composite Indexes Reviewed           | ✔      |
| Duplicate Indexes Removed            | ✔      |
| Unused Indexes Reviewed              | ✔      |
| Covering Indexes Evaluated           | ✔      |
| Partial Index Opportunities Reviewed | ✔      |
| Index Bloat Monitored                | ✔      |
| Index Statistics Updated             | ✔      |

Indexes shall be reviewed periodically using production workload metrics.

---

### PRF-005

Index effectiveness shall be reviewed using workload analysis.

---

### PRF-006

Unused or redundant indexes shall be periodically evaluated for removal.

---

# E.6 Query Performance Checklist

Review all production queries for:

* Explicit column selection
* Index utilization
* Execution plan analysis
* Join optimization
* Predicate optimization
* Pagination
* Result size limitation
* Aggregation efficiency
* Lock contention
* Parallel execution opportunities

Recommended tools:

* EXPLAIN
* EXPLAIN ANALYZE
* pg_stat_statements
* PostgreSQL Query Planner

---

### PRF-007

Performance-critical SQL shall undergo execution plan analysis.

---

# E.7 Connection Management Checklist

Validate:

| Item                          | Status |
| ----------------------------- | ------ |
| Connection Pool Configured    | ✔      |
| Maximum Connections Reviewed  | ✔      |
| Idle Timeout Configured       | ✔      |
| Leak Detection Enabled        | ✔      |
| Connection Validation Active  | ✔      |
| Pool Metrics Monitored        | ✔      |
| Read Replica Routing Verified | ✔      |

Connection pools shall be tuned according to observed workload characteristics.

---

### PRF-008

Connection pool configuration shall be periodically optimized.

---

# E.8 Replication Checklist

Verify:

* Primary node health
* Replica synchronization
* Replication lag
* WAL generation
* Failover readiness
* Read routing
* Replica monitoring
* Replica backups
* Replication security

---

### PRF-009

Replication health shall be continuously monitored.

---

### PRF-010

Replication lag shall remain within approved operational thresholds.

---

# E.9 Backup Performance Checklist

Review:

* Backup duration
* Compression ratio
* WAL archival
* Recovery testing
* Restore duration
* Repository utilization
* Encryption performance
* Incremental backup validation

Backups shall not significantly impact production workloads.

---

### PRF-011

Backup operations shall meet approved performance objectives.

---

# E.10 Monitoring Checklist

Monitoring shall include:

| Metric             | Target                          |
| ------------------ | ------------------------------- |
| CPU Utilization    | Within approved operating range |
| Memory Utilization | Within approved operating range |
| Disk Utilization   | < 80% recommended threshold     |
| Active Connections | Monitored continuously          |
| Slow Queries       | Investigated                    |
| Lock Waits         | Minimized                       |
| Deadlocks          | Zero recurring issues           |
| Replication Lag    | Within operational target       |
| Cache Hit Ratio    | Reviewed regularly              |
| WAL Generation     | Monitored                       |

Monitoring platforms:

* PostgreSQL Exporter
* Prometheus
* Grafana
* Alertmanager
* pg_stat_statements

---

### PRF-012

Performance metrics shall be continuously collected and retained.

---

# E.11 Capacity Planning Checklist

Review:

* Storage growth
* Database size
* Table growth
* Index growth
* WAL growth
* User growth
* Concurrent sessions
* AI workload projections
* Analytics workload
* Seasonal usage trends

Capacity planning shall be reviewed quarterly or after significant business growth.

---

### PRF-013

Capacity planning shall consider projected business growth and workload trends.

---

# E.12 Maintenance Checklist

Routine maintenance includes:

* VACUUM
* VACUUM ANALYZE
* Autovacuum validation
* REINDEX (when necessary)
* Statistics updates
* Partition maintenance
* Archival jobs
* Log cleanup
* Backup verification

Maintenance windows shall be coordinated to minimize business impact.

---

### PRF-014

Routine maintenance activities shall be documented and scheduled.

---

# E.13 Security Performance Checklist

Validate:

* TLS overhead
* Encryption performance
* Authentication latency
* Authorization checks
* Audit logging overhead
* Secrets retrieval
* Access control performance

Security controls shall balance protection with operational efficiency.

---

### PRF-015

Security mechanisms shall be evaluated for operational performance impact.

---

# E.14 Release Readiness Checklist

Before production deployment verify:

| Item                          | Status |
| ----------------------------- | ------ |
| Performance Testing Completed | ✔      |
| Load Testing Passed           | ✔      |
| Stress Testing Passed         | ✔      |
| Failover Tested               | ✔      |
| Backup Verified               | ✔      |
| Recovery Tested               | ✔      |
| Monitoring Operational        | ✔      |
| Alerting Verified             | ✔      |
| Documentation Updated         | ✔      |
| DBA Approval Received         | ✔      |

All critical findings shall be resolved prior to release.

---

### PRF-016

Production deployment shall require successful completion of the performance readiness checklist.

---

# E.15 Continuous Improvement Checklist

Regular review activities:

* Analyze slow query trends.
* Review execution plans.
* Remove technical debt.
* Optimize indexes.
* Tune PostgreSQL configuration.
* Improve connection pool settings.
* Review storage utilization.
* Evaluate hardware capacity.
* Benchmark new releases.
* Review lessons learned from incidents.

Continuous optimization is an ongoing operational responsibility.

---

### PRF-017

Performance optimization shall be incorporated into continuous improvement processes.

---

# E.16 Governance

Performance governance includes:

* Database Administration Team
* Platform Engineering Team
* Site Reliability Engineering (SRE)
* Performance Engineering Team
* Enterprise Architecture Board
* DevOps Team
* Security Team
* Change Advisory Board (CAB)

Responsibilities:

* Define performance baselines.
* Review optimization opportunities.
* Approve tuning changes.
* Validate production readiness.
* Monitor service-level objectives.
* Maintain documentation.

---

### PRF-018

Performance governance activities shall be formally documented and periodically reviewed.

---

# E.17 Traceability

This appendix defines the enterprise performance and optimization checklist for the Mediverse database.

**Related Chapters**

* Chapter 46 – Indexing Strategy
* Chapter 47 – Query Optimization
* Chapter 48 – Partitioning Strategy
* Chapter 49 – Materialized Views
* Chapter 50 – Database Views
* Chapter 51 – Read Replicas & Scaling
* Chapter 52 – Connection Pooling Strategy
* Chapter 58 – Backup, Recovery & Archival
* Chapter 60 – Production Readiness & Governance

**Applies To**

* PostgreSQL Clusters
* Database Performance
* SQL Optimization
* Capacity Planning
* Monitoring
* Production Readiness
* High Availability
* Enterprise Operations

---

# Appendix Summary

This appendix establishes the Enterprise Database Performance & Optimization Checklist for the Mediverse platform. It provides a comprehensive framework for validating infrastructure, schema design, indexing, query performance, connection management, replication, backup operations, monitoring, capacity planning, maintenance, security performance, and production readiness. By applying these standardized checklists and governance practices, the Mediverse platform ensures optimal database performance, operational resilience, scalability, and continuous improvement throughout its lifecycle.

---

**End of Appendix E**

**Next:** **Appendix F – Database Security & Compliance Checklist (Final Appendix)**.

# Appendix F — Database Security & Compliance Checklist

---

# Appendix Overview

This appendix defines the **Enterprise Database Security & Compliance Checklist** for the **Mediverse – AI-Powered Medical Education Platform**. It provides a comprehensive security validation framework to ensure that the PostgreSQL database environment adheres to enterprise security standards, regulatory obligations, industry best practices, and organizational governance requirements before and throughout production operations.

The checklist serves as the final security verification artifact for Database Administrators (DBAs), Security Engineers, DevSecOps Teams, Site Reliability Engineers (SREs), Architects, Compliance Officers, Auditors, and Operations Teams.

---

# F.1 Purpose

The objectives of the Database Security & Compliance Checklist are to:

* Protect sensitive information.
* Verify security controls.
* Standardize security validation.
* Reduce operational risk.
* Ensure regulatory compliance.
* Support enterprise governance.
* Improve audit readiness.
* Strengthen operational resilience.
* Enable continuous security improvement.
* Maintain customer and institutional trust.

---

# F.2 Scope

This checklist applies to:

* PostgreSQL Database Servers
* Database Clusters
* Kubernetes Deployments
* Database Schemas
* Database Users & Roles
* Secrets Management
* Encryption
* Network Security
* Backup Storage
* Monitoring Systems
* Audit Infrastructure
* Disaster Recovery Environments

---

### DSC-001

Security validation shall be completed before every production deployment.

---

### DSC-002

Critical security findings shall prevent production release until resolved.

---

# F.3 Identity & Authentication Checklist

Verify:

| Item                                           | Status |
| ---------------------------------------------- | ------ |
| Strong Authentication Enabled                  | ✔      |
| SCRAM-SHA-256 Configured                       | ✔      |
| Multi-Factor Authentication for Administrators | ✔      |
| Default Accounts Removed                       | ✔      |
| Shared Accounts Eliminated                     | ✔      |
| Service Accounts Reviewed                      | ✔      |
| Password Policies Enforced                     | ✔      |
| Account Lockout Policies Enabled               | ✔      |
| Authentication Logs Monitored                  | ✔      |
| Identity Documentation Updated                 | ✔      |

---

### DSC-003

Database authentication mechanisms shall comply with enterprise identity standards.

---

# F.4 Authorization Checklist

Review:

* Role-Based Access Control (RBAC)
* Principle of Least Privilege
* Administrative role separation
* Service account permissions
* Reporting access
* Read-only roles
* Temporary privileged access
* Privilege reviews
* Role documentation

---

### DSC-004

Database privileges shall be periodically reviewed and approved.

---

### DSC-005

Privileged access shall be limited to authorized personnel and services.

---

# F.5 Encryption Checklist

Verify:

| Encryption Area                   | Status |
| --------------------------------- | ------ |
| TLS Enabled                       | ✔      |
| Database Connections Encrypted    | ✔      |
| Backups Encrypted                 | ✔      |
| Storage Encryption Enabled        | ✔      |
| Secrets Encrypted                 | ✔      |
| Key Rotation Implemented          | ✔      |
| Certificate Validity Reviewed     | ✔      |
| Cryptographic Algorithms Approved | ✔      |

Encryption shall align with approved enterprise cryptographic standards.

---

### DSC-006

Sensitive information shall remain encrypted in transit and at rest.

---

# F.6 Secrets Management Checklist

Review:

* Database passwords
* JWT signing keys
* API credentials
* TLS certificates
* Encryption keys
* Cloud credentials
* Kubernetes Secrets
* Vault integration
* Secret rotation
* Secret auditing

Recommended technologies:

* HashiCorp Vault
* Kubernetes Secrets
* Cloud KMS

---

### DSC-007

Secrets shall be centrally managed and periodically rotated.

---

# F.7 Network Security Checklist

Verify:

| Item                                | Status |
| ----------------------------------- | ------ |
| Private Network Deployment          | ✔      |
| Firewall Rules Reviewed             | ✔      |
| Kubernetes Network Policies Applied | ✔      |
| Public Access Disabled              | ✔      |
| Bastion Access Configured           | ✔      |
| IP Allowlists Configured            | ✔      |
| Mutual TLS Verified                 | ✔      |
| Network Monitoring Enabled          | ✔      |

Production databases shall not be directly exposed to the public internet.

---

### DSC-008

Network access shall follow enterprise Zero Trust principles.

---

# F.8 Database Hardening Checklist

Review:

* Unused extensions removed.
* Unnecessary services disabled.
* Default configuration reviewed.
* Secure PostgreSQL parameters applied.
* Logging enabled.
* Connection limits configured.
* File permissions verified.
* OS hardening completed.
* Security patches applied.

---

### DSC-009

Database servers shall comply with enterprise hardening standards.

---

### DSC-010

Security patches shall be applied according to the approved maintenance schedule.

---

# F.9 Audit & Logging Checklist

Verify:

| Audit Requirement              | Status |
| ------------------------------ | ------ |
| Login Auditing                 | ✔      |
| Privilege Changes Logged       | ✔      |
| Schema Changes Logged          | ✔      |
| Administrative Activity Logged | ✔      |
| Failed Login Monitoring        | ✔      |
| Backup Events Logged           | ✔      |
| Recovery Events Logged         | ✔      |
| Log Retention Configured       | ✔      |
| SIEM Integration Verified      | ✔      |

Audit logs shall be protected from unauthorized modification.

---

### DSC-011

Security-relevant database activities shall be comprehensively audited.

---

# F.10 Backup & Recovery Security Checklist

Review:

* Backup encryption
* Backup integrity verification
* Offsite storage
* Immutable storage (where supported)
* Backup access controls
* Recovery testing
* WAL protection
* Repository monitoring

---

### DSC-012

Backup repositories shall implement the same or stronger security controls as production systems.

---

# F.11 Vulnerability Management Checklist

Verify:

* Vulnerability scans completed.
* Dependency scanning performed.
* PostgreSQL version supported.
* Operating system patched.
* Critical CVEs remediated.
* Container image scanning completed.
* Configuration review performed.
* Security exceptions documented.

---

### DSC-013

Critical vulnerabilities shall be remediated before production deployment.

---

### DSC-014

Supported software versions shall be maintained throughout the platform lifecycle.

---

# F.12 Compliance Checklist

Applicable compliance validation may include:

| Framework                                 | Status |
| ----------------------------------------- | ------ |
| GDPR                                      | ✔      |
| FERPA (where applicable)                  | ✔      |
| HIPAA-aligned controls (where applicable) | ✔      |
| ISO/IEC 27001                             | ✔      |
| SOC 2                                     | ✔      |
| CIS PostgreSQL Benchmark                  | ✔      |
| OWASP ASVS                                | ✔      |
| Internal Security Policies                | ✔      |

Compliance applicability depends on organizational, contractual, and regulatory requirements.

---

### DSC-015

Database controls shall support applicable legal, contractual, and regulatory obligations.

---

# F.13 Incident Response Checklist

Verify:

* Incident response plan approved.
* Escalation matrix documented.
* Contact list updated.
* Security runbooks available.
* Forensic logging enabled.
* Evidence preservation process documented.
* Credential rotation procedures defined.
* Post-incident review process established.

---

### DSC-016

Security incidents shall follow the approved enterprise incident response process.

---

# F.14 Production Security Readiness Checklist

Before production deployment verify:

| Item                        | Status |
| --------------------------- | ------ |
| Authentication Validated    | ✔      |
| Authorization Reviewed      | ✔      |
| Encryption Verified         | ✔      |
| Secrets Protected           | ✔      |
| Network Hardened            | ✔      |
| Backup Security Verified    | ✔      |
| Monitoring Operational      | ✔      |
| Audit Logging Enabled       | ✔      |
| Vulnerability Scan Passed   | ✔      |
| Compliance Review Completed | ✔      |
| Documentation Updated       | ✔      |
| Security Approval Granted   | ✔      |

Any unresolved critical security issue shall block production deployment.

---

### DSC-017

Production deployment shall require successful completion of the security readiness checklist.

---

# F.15 Continuous Security Improvement

Security improvement activities include:

* Quarterly access reviews.
* Periodic penetration testing.
* Annual disaster recovery exercises.
* Threat modeling updates.
* Security awareness training.
* Cryptographic review.
* Security architecture assessments.
* Compliance audits.
* Continuous monitoring enhancements.
* Lessons learned implementation.

Security is treated as an ongoing lifecycle rather than a one-time validation activity.

---

### DSC-018

Continuous security improvement shall be integrated into operational governance.

---

# F.16 Governance

Security governance responsibilities include:

* Chief Information Security Officer (CISO)
* Information Security Team
* Database Administration Team
* DevSecOps Team
* Platform Engineering Team
* Site Reliability Engineering (SRE)
* Enterprise Architecture Board
* Compliance Office
* Internal Audit
* Change Advisory Board (CAB)

Responsibilities:

* Define security policies.
* Review security controls.
* Approve exceptions.
* Monitor compliance.
* Coordinate audits.
* Review incidents.
* Maintain security documentation.
* Promote continuous improvement.

---

### DSC-019

Security governance activities shall be formally documented and periodically reviewed.

---

### DSC-020

Security policy exceptions shall require documented approval and risk acceptance.

---

# F.17 Traceability

This appendix defines the enterprise security and compliance validation checklist for the Mediverse database.

**Related Chapters**

* Chapter 26 – Identity & Authentication Tables
* Chapter 28 – Role & Permission Tables
* Chapter 41 – Audit & Logging Tables
* Chapter 57 – Migration Strategy (Flyway)
* Chapter 58 – Backup, Recovery & Archival
* Chapter 59 – Security, Encryption & Compliance
* Chapter 60 – Production Readiness & Governance
* Appendix E – Database Performance & Optimization Checklist

**Related Standards**

* PostgreSQL Security Documentation
* OWASP ASVS
* CIS PostgreSQL Benchmark
* ISO/IEC 27001
* NIST Cybersecurity Framework
* SOC 2
* Enterprise Security Policies
* Architecture Decision Records (ADR)

**Applies To**

* PostgreSQL Clusters
* Production Databases
* Backup Infrastructure
* Disaster Recovery
* DevSecOps Pipelines
* Kubernetes Deployments
* Enterprise Database Operations

---

# Appendix Summary

This appendix establishes the Enterprise Database Security & Compliance Checklist for the Mediverse platform. It provides a comprehensive framework for validating authentication, authorization, encryption, secrets management, network security, database hardening, auditing, backup protection, vulnerability management, compliance, incident response, and production security readiness. By enforcing these standardized security controls and governance practices, the Mediverse platform ensures that its PostgreSQL database environment remains secure, resilient, compliant, and capable of supporting enterprise-scale medical education services while protecting sensitive institutional and learner data.

---

# Database Design Document (DDD) Completion Summary

The **Database Design Document (DDD)** for the **Mediverse – AI-Powered Medical Education Platform** is now fully complete.

## Final Document Statistics

| Category               | Count |
| ---------------------- | ----: |
| Main Chapters          |    60 |
| Appendices             |     6 |
| Total Sections         |    66 |
| Requirement IDs        |  300+ |
| Architecture Diagrams  |   70+ |
| Tables & Checklists    |  150+ |
| Standards & Guidelines |  250+ |

## Document Coverage

The DDD comprehensively addresses:

* Enterprise Database Architecture
* Conceptual, Logical & Physical Data Models
* Schema & Object Design Standards
* Core Entity Modeling
* Referential Integrity
* Indexing & Query Optimization
* Partitioning & Scalability
* Views & Materialized Views
* Read Replicas & Connection Pooling
* Stored Procedures, Functions & Triggers
* Flyway Migration Strategy
* Backup, Recovery & Archival
* Security, Encryption & Compliance
* Production Readiness & Governance
* Data Dictionary
* Entity Relationship Diagrams
* Naming Standards
* SQL Coding Standards
* Performance & Optimization
* Security & Compliance Checklists

This Database Design Document serves as the authoritative enterprise reference for the design, implementation, governance, operation, maintenance, security, and future evolution of the Mediverse PostgreSQL database.

---

**End of Appendix F**

**End of Database Design Document (DDD)**.


---

# 12. PostgreSQL 16 Concrete DDL: 3D Organs, Simulations, AI Tutor & LTI 1.3

```sql
-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Schema: Curriculum & 3D Anatomical Models
CREATE SCHEMA IF NOT EXISTS curriculum;

CREATE TABLE curriculum.organ_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    nmc_cbme_code VARCHAR(50), -- e.g. PY1.1
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE curriculum.anatomical_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organ_system_id UUID NOT NULL REFERENCES curriculum.organ_systems(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latin_name VARCHAR(255),
    description TEXT,
    model_asset_url VARCHAR(512) NOT NULL, -- S3 Draco GLB URL
    mesh_node_name VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE curriculum.landmark_pins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    structure_id UUID NOT NULL REFERENCES curriculum.anatomical_structures(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    pos_z FLOAT NOT NULL,
    clinical_correlation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema: Physiology Simulations
CREATE SCHEMA IF NOT EXISTS simulation;

CREATE TABLE simulation.simulation_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organ_system_id UUID NOT NULL REFERENCES curriculum.organ_systems(id),
    code VARCHAR(64) NOT NULL UNIQUE, -- e.g. SIM_CARDIAC_PV_LOOP
    title VARCHAR(255) NOT NULL,
    math_model_type VARCHAR(64) NOT NULL, -- WASM_WIGGERS, WASM_GHK, WASM_VQ
    default_parameters JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE simulation.simulation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    simulation_id UUID NOT NULL REFERENCES simulation.simulation_definitions(id),
    applied_parameters JSONB NOT NULL,
    computed_metrics JSONB NOT NULL,
    run_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema: AI Socratic Tutor & RAG
CREATE SCHEMA IF NOT EXISTS ai_tutor;

CREATE TABLE ai_tutor.rag_document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_title VARCHAR(255) NOT NULL, -- e.g. Guyton & Hall Physiology 14th Ed
    chapter_number INT,
    section_title VARCHAR(255),
    content TEXT NOT NULL,
    embedding vector(1536) NOT NULL, -- OpenAI text-embedding-3-small
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rag_embedding ON ai_tutor.rag_document_chunks 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE TABLE ai_tutor.ai_tutor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    topic_context VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_tutor.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_tutor.ai_tutor_sessions(id) ON DELETE CASCADE,
    sender_role VARCHAR(32) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,
    cited_chunk_ids UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema: LMS LTI 1.3 Interoperability
CREATE SCHEMA IF NOT EXISTS lms;

CREATE TABLE lms.lti_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    auth_token_url VARCHAR(512) NOT NULL,
    auth_login_url VARCHAR(512) NOT NULL,
    key_set_url VARCHAR(512) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_issuer_client UNIQUE (issuer, client_id)
);

CREATE TABLE lms.lti_grade_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    lineitem_url VARCHAR(512) NOT NULL,
    score_given FLOAT NOT NULL,
    score_maximum FLOAT NOT NULL,
    sync_status VARCHAR(32) NOT NULL, -- SUCCESS, FAILED, RETRYING
    response_body TEXT,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```