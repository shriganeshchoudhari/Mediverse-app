# Mediverse Release Management Guide (RMG)

This exhaustive 65-chapter playbook defines the governance, pipelines, promotion strategies, and rollback mechanisms for releasing software across the Mediverse platform. It synthesizes release requirements extracted from the enterprise documentation suite (PRD, SRS, SAD, IG, DG, TSQP, etc.).

---

### Chapter 1: Release Management Purpose & Scope

**Release Specification & Governance:**
- Ensures predictable, secure, and zero-downtime deployment of code, data schemas, and AI models into production.
- Applies to all microservices, frontend applications, and AI inference engines.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 2: Release Cadence & Agile Alignment

**Release Specification & Governance:**
- Sprints are 2 weeks. Production releases occur at the end of each sprint.
- Emergency hotfixes can bypass the sprint cadence but must follow Hotfix procedures.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 3: Release Types: Major, Minor, Patch, Hotfix

**Release Specification & Governance:**
- **Major**: Breaking API changes, requires 6-month deprecation notice.
- **Minor**: New features, backward compatible.
- **Patch**: Bug fixes.
- **Hotfix**: P0/P1 emergency patches deployed immediately.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 4: Change Advisory Board (CAB) & Automation

**Release Specification & Governance:**
- Routine releases are pre-approved by automated CI/CD gates.
- Major architectural shifts or massive data migrations require manual CAB approval via Jira.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 5: Semantic Versioning (SemVer) Standards

**Release Specification & Governance:**
- Strictly follow `MAJOR.MINOR.PATCH`.
- APIs versioned in URL (e.g., `/api/v1/`), Docker images tagged with exact SemVer (no `:latest` in Prod).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 6: Feature Flags (Toggles) Governance

**Release Specification & Governance:**
- Unleash or LaunchDarkly used for runtime toggles.
- Features must be merged 'dark' (toggled off) and enabled in Prod without requiring a deployment.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 7: Separation of Duties (SoD)

**Release Specification & Governance:**
- Developers cannot merge their own PRs to `main`.
- Developers cannot manually trigger production ArgoCD syncs (requires SRE/Release Manager approval).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 8: Branching Strategy: Trunk-Based Development

**Release Specification & Governance:**
- Short-lived feature branches branching from `main`.
- Merged back to `main` at least daily. No long-living `develop` or `release` branches.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 9: Branch Protection Rules & Mandatory Reviews

**Release Specification & Governance:**
- `main` branch is protected.
- Requires 1 approving review from a CODEOWNER, passing CI checks, and linear history (squash merges).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 10: Commit Message Standards

**Release Specification & Governance:**
- Conventional Commits required: `feat:`, `fix:`, `chore:`, `docs:`.
- Triggers automated SemVer calculation (semantic-release).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 11: Handling Merge Conflicts & Rebasing

**Release Specification & Governance:**
- Always `git pull --rebase origin main` before pushing.
- Merge commits are strictly forbidden to maintain a clean Git history.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 12: Monorepo vs. Polyrepo Release Coordination

**Release Specification & Governance:**
- Microservices live in a polyrepo structure.
- Contract testing (Pact) ensures releases in Repo A do not break dependencies in Repo B.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 13: CI Pipeline Architecture & Triggers

**Release Specification & Governance:**
- GitHub Actions triggers on `pull_request` (tests) and `push` to `main` (build & publish).
- CI is responsible for Continuous Integration; CD is handled by ArgoCD (Pull model).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 14: Automated Quality Gates

**Release Specification & Governance:**
- SonarQube quality gate: > 80% instruction coverage, 0 Critical/High vulnerabilities, 0 Security Hotspots.
- CI pipeline fails if quality gate fails.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 15: Static Application Security Testing (SAST)

**Release Specification & Governance:**
- Runs implicitly during the build phase.
- Scans Java, Python, and TypeScript code for injection vulnerabilities and hardcoded secrets.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 16: Software Composition Analysis (SCA) & SBOM

**Release Specification & Governance:**
- Generates CycloneDX SBOMs for every build.
- Fails pipeline if dependencies contain unpatched CVEs with CVSS > 7.0.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 17: Container Image Building & Optimization

**Release Specification & Governance:**
- Multi-stage Dockerfiles mandatory to strip build tools (e.g., Maven, Node) from final runtime image.
- Distroless base images preferred for Java/Python workloads.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 18: Image Signing & Immutability

**Release Specification & Governance:**
- Images signed with Cosign in the CI pipeline.
- Production clusters use Kyverno to reject unsigned images.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 19: Artifact Registry Lifecycle

**Release Specification & Governance:**
- AWS ECR / GCP Artifact Registry configured with lifecycle policies: delete untagged images older than 14 days.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 20: Helm Chart Versioning & Packaging

**Release Specification & Governance:**
- Helm charts packaged and published to a Chart Museum or OCI registry.
- Chart version must increment independently of the App version if only deployment metadata changes.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 21: Environment Progression Map

**Release Specification & Governance:**
- Promotion flows strictly: Dev -> QA -> Staging -> Prod.
- Skipping environments is only permitted for Hotfixes (Dev -> Prod).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 22: Dev Environment Releases

**Release Specification & Governance:**
- Ephemeral. Triggers on merge to `main`.
- Developers use this to verify integration with other bleeding-edge services.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 23: QA Environment Releases

**Release Specification & Governance:**
- Triggered nightly or on demand via Git tag.
- Used by QA engineers for manual exploratory testing and automated E2E test suites.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 24: Staging Environment Releases

**Release Specification & Governance:**
- Exact replica of production. Receives release candidates (RCs).
- Used for Load Testing, Performance profiling, and final stakeholder UAT.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 25: Production Environment Cutover

**Release Specification & Governance:**
- Scheduled deployment windows (e.g., Tuesday 10 AM).
- Must achieve Zero-Downtime via Blue/Green or Canary rollouts.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 26: GitOps (Argo CD) Promotion Workflows

**Release Specification & Governance:**
- Promotion means updating the `targetRevision` or `helm.values` in the centralized `mediverse-gitops` repository.
- Pull Requests to the GitOps repo serve as the audit trail for all promotions.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 27: Zero-Downtime Database Deployments

**Release Specification & Governance:**
- DB schema changes must be completely decoupled from application code releases.
- Old code must work with the new schema, and new code must work with the old schema.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 28: The Expand-Contract Pattern

**Release Specification & Governance:**
- Step 1 (Expand): Add new column, allow nulls.
- Step 2: Deploy new code that writes to both columns.
- Step 3: Backfill data.
- Step 4 (Contract): Deploy code that only uses the new column, drop old column in next release.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 29: Flyway/Liquibase Versioning

**Release Specification & Governance:**
- Migration scripts versioned strictly (e.g., `V1.2.3__add_user_roles.sql`).
- `UNDO` scripts must be provided for every migration.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 30: Data Migrations vs. Schema Migrations

**Release Specification & Governance:**
- Schema migrations alter tables (DDL). Data migrations alter millions of rows (DML).
- Massive DML must run as background jobs, never in the Flyway init-container, to prevent pod timeout loops.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 31: Kafka Schema Registry Evolution

**Release Specification & Governance:**
- Avro schemas must be strictly backward compatible (FORWARD_TRANSITIVE).
- Fields can only be added with default values; fields cannot be deleted.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 32: Cache Invalidation & Redis Pre-Warming

**Release Specification & Governance:**
- Deployments altering core domain objects must trigger cache invalidation events.
- High-traffic endpoints must be pre-warmed post-deployment to prevent cache stampedes.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 33: Distinct Lifecycle of AI Models

**Release Specification & Governance:**
- Application code deploys in minutes; Model weights take hours to sync and load into VRAM.
- Model releases are decoupled from application releases.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 34: Model Artifact Registry

**Release Specification & Governance:**
- Models versioned in HuggingFace or S3.
- GitOps repo points to specific model version hashes.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 35: Shadow Serving AI Models

**Release Specification & Governance:**
- New models receive 100% of production traffic asynchronously but their responses are dropped (not shown to user).
- Used to compare hallucination rates and latency before actual promotion.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 36: A/B Testing AI Prompts

**Release Specification & Governance:**
- Prompt template changes released via A/B tests to 5% of users.
- Telemetry tracks user satisfaction (thumbs up/down) to validate the new prompt.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 37: Evaluating Model Drift

**Release Specification & Governance:**
- Automated pipelines extract a random 1% sample of AI interactions daily for human-in-the-loop QA review.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 38: RAG Knowledge Base Updates

**Release Specification & Governance:**
- Medical knowledge updates trigger incremental vector embeddings.
- Full re-indexing requires spinning up a new pgvector schema, indexing, and swapping the read alias (Blue/Green for Data).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 39: Progressive Delivery vs. Big Bang

**Release Specification & Governance:**
- 'Big Bang' (replacing all pods at once) is strictly prohibited in Production.
- Progressive delivery minimizes the blast radius of a bad release.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 40: Blue/Green Deployment (Argo Rollouts)

**Release Specification & Governance:**
- Spin up identical 'Green' environment.
- Run automated smoke tests against Green.
- Flip Ingress traffic 100% to Green instantly. Keep Blue alive for 1 hour for instant rollback.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 41: Canary Release Execution

**Release Specification & Governance:**
- Route 5% traffic to Canary pods.
- If HTTP 5xx errors do not spike after 10 minutes, increase to 20%, then 50%, then 100%.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 42: Automated Metric Analysis

**Release Specification & Governance:**
- Argo Rollouts AnalysisRuns query Prometheus (e.g., `success_rate > 99%`).
- Automatically aborts and rolls back the Canary if metrics fail.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 43: Dark Launching via Headers

**Release Specification & Governance:**
- New services deployed but only accessible if the HTTP header `X-Dark-Launch: true` is present.
- Allows QA to test in production safely.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 44: CDN Cache Invalidation

**Release Specification & Governance:**
- Frontend SPAs (React) bust cache via content-hashed filenames (`main.[hash].js`).
- `index.html` must have `Cache-Control: no-cache`.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 45: Mobile App Release Phasing

**Release Specification & Governance:**
- App Store and Google Play releases use 7-day phased rollouts (1% -> 5% -> 20% -> 100%).
- Backend APIs must support the N-2 versions of the mobile app at all times.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 46: Release Candidate (RC) Branching

**Release Specification & Governance:**
- When creating an RC for mobile or on-premise components, cut a `release/vX.Y.Z` branch.
- Only bugfixes are cherry-picked into RC branches.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 47: E2E UI Testing Gate

**Release Specification & Governance:**
- Playwright suite must pass against Staging before Prod approval.
- Tests critical paths: Auth, Video playback, AI Chatting, Exam submission.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 48: Dynamic Application Security Testing (DAST)

**Release Specification & Governance:**
- OWASP ZAP runs against the Staging environment looking for runtime vulnerabilities (XSS, CSRF).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 49: Load & Stress Testing Gate

**Release Specification & Governance:**
- k6 runs simulate 10,000 concurrent users against Staging.
- Release fails if p99 latency exceeds 200ms.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 50: Chaos Engineering Pre-Production

**Release Specification & Governance:**
- Validate that killing 33% of pods in Staging does not cause HTTP 5xx errors during the release validation phase.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 51: UAT Sign-Off Procedures

**Release Specification & Governance:**
- Product Managers provide formal sign-off in Jira after reviewing the Staging environment.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 52: Go/No-Go Checklists

**Release Specification & Governance:**
- SRE validates: Metrics flowing? Alerts unmuted? On-call team notified? Rollback plan documented?

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 53: Incident Command Triggering

**Release Specification & Governance:**
- If a release causes a P1 incident (e.g., platform down), the release manager immediately declares an incident and transfers authority to the Incident Commander.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 54: Instant Rollback Execution

**Release Specification & Governance:**
- In ArgoCD, click 'Rollback' or run `argocd app rollback my-app`.
- GitOps automatically reverts the cluster state to the previous Git commit.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 55: Database Rollback Procedures

**Release Specification & Governance:**
- Schema rollbacks are difficult. Prefer forward-fixes (deploying a new patch).
- For catastrophic data corruption, initiate RDS Point-In-Time-Recovery (PITR).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 56: Feature Flag Kill-Switches

**Release Specification & Governance:**
- The fastest rollback. If a new feature causes high latency, toggle it off in Unleash/LaunchDarkly in seconds without a code deployment.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 57: Post-Release Monitoring

**Release Specification & Governance:**
- The SRE team monitors golden signals (Traffic, Latency, Errors, Saturation) for 2 hours post-release.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 58: Hotfix Procedure

**Release Specification & Governance:**
- Branch from `main` (or the specific release tag).
- Bypass staging load tests to optimize for speed, but SAST/Unit tests remain mandatory.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 59: Post-Incident Review (PIR)

**Release Specification & Governance:**
- Required for any release that causes a rollback or downtime.
- Focus on 'What failed in the process?', not 'Who made the mistake?' (Blameless culture).

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 60: Defect Leakage Analysis

**Release Specification & Governance:**
- Analyze why bugs made it to production. Update automated test suites to catch similar bugs in the future.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 61: Release Note Generation

**Release Specification & Governance:**
- Automated via `semantic-release` parsing Conventional Commits.
- Published to the customer-facing documentation portal.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 62: Compliance Audit Trail Archiving

**Release Specification & Governance:**
- Export the GitOps commit history, CI test results, and Jira approvals to WORM (Write Once Read Many) storage for HIPAA/SOC2 audits.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 63: Measuring Release Frequency

**Release Specification & Governance:**
- DORA Metric 1: Goal is on-demand, multiple times per day for microservices.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 64: Measuring Change Failure Rate

**Release Specification & Governance:**
- DORA Metric 2: Goal is < 5% of deployments requiring a rollback or hotfix.
- MTTR (Mean Time to Recovery) goal is < 15 minutes.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---

### Chapter 65: Continuous Improvement

**Release Specification & Governance:**
- Monthly DevOps sync to review deployment bottlenecks, slow CI pipelines, and flaky E2E tests.

**Deployment & Verification Pipeline:**
- **Release Gate Criteria:** Automated CI/CD pipeline enforces 100% unit test pass rate, code coverage >= 80%, zero critical security findings (SonarQube/Trivy), and passing Playwright E2E suites.
- **Promotion & Rollout Execution:** Executed via Argo CD GitOps with canary traffic stepping (10% -> 50% -> 100%) and automated rollback upon HTTP 5xx error spikes > 0.5%.
- **Database Schema Safety:** Flyway migrations adhere to the zero-downtime expand/contract pattern, preventing locks on high-volume physiology tables.
- **Post-Release Smoke Check:** Verification of 3D Heart/Lung models loading in < 2s, cardiac PV-loop simulation stability, and LMS grade passback.

---
