# ADR-011: Custom JWT Authentication vs. Keycloak Identity Gateway

**Date**: September 2026  
**Status**: Accepted  
**Deciders**: Platform Architecture Team, Security Council  

## Context

ADR-007 outlined an aspirational enterprise identity architecture leveraging Keycloak as a dedicated OpenID Connect (OIDC) / OAuth2 identity provider. However, operational evaluation identified significant hurdles during current rollout phases:
1. Keycloak requires substantial dedicated compute and JVM heap memory (1GB+ RAM baseline).
2. Local developer setup and single-tenant private medical college deployments require simplified, zero-friction operations without spinning up Keycloak, its dedicated PostgreSQL database, and realm import pipelines.
3. High-throughput edge validation in Next.js Middleware requires sub-millisecond cryptographic token verification.

## Decision

We adopt a lightweight, high-performance **Custom JWT Architecture** implemented in Spring Security and validated at the Next.js Edge using Web Crypto API (`crypto.subtle`):
- Access tokens are signed using HMAC-SHA256 (or RSA-256 in enterprise tier) with a 24-hour expiration.
- Tokens are delivered to clients via `HttpOnly; Secure; SameSite=Strict` cookies (set via Next.js `/api/auth/session` route handler) to prevent XSS exfiltration.
- Cryptographic signature and expiration checks run directly inside `frontend/middleware.ts` before requests reach backend micro-routes.
- Keycloak integration is deferred to Phase 3 as an optional enterprise SSO federated adapter (supporting SAML 2.0 and university LDAP).

## Consequences

- **Positive**: Near-zero operational overhead, rapid local bootstrapping, sub-millisecond edge validation latency, zero external IdP runtime points of failure.
- **Negative**: User management and password reset logic must be maintained in Spring Boot rather than delegated to Keycloak.
- **Security**: Mitigated by HttpOnly cookie delivery, Redis-backed brute-force rate limiting, and automated token refresh pipelines.
