# ADR-010: Adoption of Kubernetes (EKS) & Argo CD GitOps Deployment Platform

```text
Status:      ACCEPTED
Date:        2026-08-29
Deciders:    DevSecOps Architect, SRE Lead, Principal Enterprise Architect
Context:     Mediverse requires automated progressive delivery, declarative infrastructure state, and multi-tenant scaling.
```

---

## 1. Context & Problem Statement
Mediverse requires automated scaling, zero-downtime rolling and canary deployments, declarative configuration management, and multi-tenant network isolation across development, staging, and production environments.

## 2. Decision
We adopt **Amazon Elastic Kubernetes Service (EKS)** managed via **Argo CD GitOps controllers** and **Helm / Kustomize declarative charts**.

## 3. Rationale
- **Declarative GitOps:** Git serves as the single source of truth for all runtime cluster states. Manual `kubectl` cluster mutations in production are disabled.
- **Automated Drift Detection & Reconciliation:** Argo CD automatically reconciles out-of-sync cluster states within 180 seconds.
- **Canary & Rollback Automation:** Integrates with Argo Rollouts to evaluate Prometheus error rate and latency metrics during progressive canary deployments.

## 4. Consequences & Trade-Offs
- **Positive:** 100% reproducible environments; automated one-click rollbacks; strict auditability.
- **Negative:** Requires team proficiency in Kubernetes primitives and Helm chart templating.
