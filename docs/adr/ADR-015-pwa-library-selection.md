# ADR-015: PWA Architecture & Service Worker Framework Selection

**Date**: September 2026  
**Status**: Accepted  
**Deciders**: Frontend Architecture Team  

## Context

Hospital wards and rural medical colleges frequently suffer from unreliable or zero internet connectivity. Mediverse requires Progressive Web App (PWA) capabilities enabling medical students to review downloaded flashcards, reference anatomy summaries, and run offline simulations.

We evaluated three service worker integration approaches for Next.js 14 App Router:
1. Manual Workbox setup: High custom script maintenance; prone to cache invalidation bugs.
2. `@serwist/next`: Modern fork, but required extensive configuration churn.
3. `@ducanh2912/next-pwa`: First-class Next.js 14 App Router compatibility, zero-config SWC minification, built-in offline document fallbacks, and fine-grained workbox caching controls.

## Decision

We standardize on **`@ducanh2912/next-pwa`** for service worker generation and PWA lifecycle management:
- Service worker generated at `public/sw.js` (excluded from git tracking).
- Dynamic runtime caching strategies configured for 3D meshes (CacheFirst) and API queries (NetworkFirst with stale fallback).
- Offline fallback registered at `/offline.html` for seamless UX during complete network dropouts.

## Consequences

- **Positive**: Instant installation on desktop and mobile browsers, zero-downtime offline navigation for cached modules.
- **Caveat**: Service worker build artifacts must remain untracked in git (`.gitignore` enforcement).
