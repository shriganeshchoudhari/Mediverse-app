# ADR-005: Canonical Platform Naming & Namespace Harmonization

## Status
**ACCEPTED** (2026-08-23)

## Context
During platform development across frontend, backend, and documentation, various naming aliases emerged:
- **Backend Java Package**: `com.curiolearn`
- **Application Brand**: `Mediverse` (Mediverse App)
- **Repository / Root Directory**: `Mediverse-app`
- **Frontend Package**: `mediverse-frontend`

To eliminate ambiguity across configuration files, environment variables, documentation, and logging tags, a single canonical naming convention is formalized.

## Decision
1. **Public Brand & UI Facing Identity**: **`Mediverse`** (Medical Universe Multi-Domain Learning Platform).
2. **Backend Engineering Package & Service Namespace**: **`com.curiolearn`** / `curiolearn-backend`.
3. **Database Schema & Identifier Prefixes**: `mediverse_db`, `mediverse_user`.
4. **Environment Variables**: Use `MEDIVERSE_` and `CURIOLEARN_` standard aliases.

## Consequences
- Single, consistent naming hierarchy documented and agreed upon across all project assets.
- No disruptive package refactors needed, while UI branding remains cleanly unified as Mediverse.
