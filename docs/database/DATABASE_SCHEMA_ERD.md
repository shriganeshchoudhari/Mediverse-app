# Mediverse Database Schema Architecture & ERD
*PostgreSQL 16 Relational Schema with pgvector Embeddings & Flyway Migrations*

---

## 1. High-Level Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    TENANTS ||--o{ USERS : "contains"
    TENANTS ||--o{ TENANT_USERS : "maps"
    USERS ||--o{ REFRESH_TOKENS : "has"
    USERS ||--o{ PROGRESS_TRACKS : "records"
    USERS ||--o{ QUIZ_ATTEMPTS : "completes"
    USERS ||--o{ FLASHCARDS : "owns"
    USERS ||--o{ EXAM_SESSIONS : "takes"
    USERS ||--o{ SIMULATION_RUNS : "executes"

    PROGRAMS ||--o{ CURRICULA : "defines"
    CURRICULA ||--o{ CURRICULUM_YEARS : "structures"
    CURRICULUM_YEARS ||--o{ SEMESTERS : "divides"
    SEMESTERS ||--o{ SUBJECTS : "contains"
    SUBJECTS ||--o{ UNITS : "organizes"
    UNITS ||--o{ CHAPTERS : "contains"
    CHAPTERS ||--o{ TOPICS : "details"
    TOPICS ||--o{ CONCEPTS : "teaches"
    CONCEPTS ||--o{ LEARNING_OBJECTS : "provides"
    CONCEPTS ||--o{ LESSONS : "anchors"
    LESSONS ||--o{ CONTENT_BLOCKS : "renders"
    LESSONS ||--o{ CONTENT_REVIEWS : "tracks"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role
        int current_xp
        int daily_streak
        timestamp created_at
    }

    TENANTS {
        uuid id PK
        string code UK
        string name
        string domain
        string subscription_tier
        boolean is_active
    }

    PROGRAMS {
        uuid id PK
        string code UK
        string name
        string healthcare_domain
        decimal duration_years
        boolean is_active
    }

    SUBJECTS {
        uuid id PK
        uuid semester_id FK
        string code UK
        string title
        string category
    }

    LESSONS {
        uuid id PK
        uuid concept_id FK
        string title
        string status
        int version
        timestamp created_at
    }

    CONTENT_REVIEWS {
        uuid id PK
        uuid lesson_id FK
        uuid reviewer_id FK
        string decision
        string comments
        int lesson_version_reviewed
        timestamp created_at
    }

    FLASHCARDS {
        uuid id PK
        uuid user_id FK
        string front_prompt
        string back_answer
        int ease_factor
        int interval_days
        timestamp next_review_at
    }

    PROGRESS_TRACKS {
        uuid id PK
        uuid user_id FK
        string lesson_id
        int completion_percentage
        boolean completed
        timestamp last_accessed_at
    }
```

---

## 2. Table Catalog & Partitioning Strategy

| Table Name | Description | Retention / Partitioning Plan |
|---|---|---|
| `users` | User identity, credentials, XP, and streaks | Unpartitioned |
| `tenants` | Multi-tenant medical colleges & institutions | Unpartitioned |
| `programs` / `curricula` | 9 healthcare domains & 16 degree structures | Reference data (cached in Redis) |
| `subjects` → `concepts` | 9-level hierarchical curriculum taxonomy | Reference data (cached in Redis, indexed in Elasticsearch) |
| `lessons` & `content_blocks` | CMS learning content & 3D models | Versioned via `content_reviews` |
| `progress_tracks` | Student topic completion history | High-volume: range partitioned by `created_at` yearly |
| `quiz_attempts` & `exam_sessions` | Assessment scoring logs | High-volume: range partitioned by `created_at` quarterly |
| `simulation_runs` | Clinical solver parameters & telemetry | High-volume: partitioned by `user_id` hash or quarterly date |
| `refresh_tokens` | Active JWT refresh token registry | Auto-purged via background cron on `expires_at` |
