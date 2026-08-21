# ADR-001: Flyway Migration V7 Skip

**Date**: August 2026  
**Status**: Accepted  
**Deciders**: Platform Architecture Team

## Context

Flyway enforces sequential versioning of database migration scripts. The Mediverse migration sequence has V6 (`V6__seed_questions.sql`) followed immediately by V8 (`V8__create_study_groups.sql`), with V7 intentionally absent.

## Decision

V7 was reserved for a planned "comprehensive question bank seeding" migration that was ultimately merged into V6 (`V6__seed_questions.sql`) and V9 (`V9__expand_questions_seed.sql`) as it was determined that splitting the seeding into two phases was cleaner than a large V7 monolith.

The Flyway configuration uses `spring.flyway.out-of-order=false`, which would normally flag missing versions. However, because V7 was never created or run in any environment, the sequence skips cleanly from V6 → V8 without Flyway error — Flyway only validates versions that exist on disk, not gaps in the sequence.

## Consequences

- **No production impact**: Flyway does not error on version gaps, only on out-of-order execution.
- **Future migrations**: All new migrations must start from V8 or higher. The next safe version after V183 (current last migration) is V184.
- **Documentation requirement**: This ADR documents the skip for onboarding developers who may notice the gap and wonder if a migration was accidentally deleted.

## References
- [Flyway Version Handling Documentation](https://documentation.red-gate.com/flyway/flyway-concepts/migrations)
- V6 file: `V6__seed_questions.sql` 
- V8 file: `V8__create_study_groups.sql`
- V9 file: `V9__expand_questions_seed.sql`
