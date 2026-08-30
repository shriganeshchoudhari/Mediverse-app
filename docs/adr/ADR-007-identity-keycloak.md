# ADR-007: Adoption of Keycloak 24 as Central Enterprise Identity Provider

```text
Status:      ACCEPTED
Date:        2026-08-29
Deciders:    Security Architect, Principal Enterprise Architect
Context:     Mediverse requires multi-tenant identity federation, OIDC/OAuth 2.0 compliance, and MFA.
```

---

## 1. Context & Problem Statement
Mediverse serves multiple university tenants, each requiring distinct identity realms, SAML/OIDC federations with university Active Directory/LDAP systems, and multi-factor authentication (MFA).

## 2. Decision
We adopt **Keycloak 24** (running the Quarkus distribution on Kubernetes) backed by PostgreSQL as the central Identity and Access Management (IAM) provider.

## 3. Rationale
- **Open Standards:** Built-in support for OpenID Connect, OAuth 2.0, SAML 2.0, and WebAuthn MFA.
- **Multi-Tenant Realms:** Native realm segregation allows institutional branding and independent identity lifecycles.
- **Zero SaaS Vendor Lock-In:** Eliminates recurring per-user licensing fees of Auth0 or Okta.

## 4. Consequences & Trade-Offs
- **Positive:** Full ownership of identity data; strict compliance with healthcare and academic privacy mandates.
- **Negative:** Requires team ownership of Keycloak patch lifecycles and High Availability clustering.
