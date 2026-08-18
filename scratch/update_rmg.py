import re
import os

def read_rmg():
    with open('docs/RMG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_rmg()

    # Split into introductory banner + 65 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in RMG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 65)")

    # 1. Enrich Chapter 14 (Automated Quality Gates & Threshold Matrix)
    chapter_map[14] = r"""
### Chapter 14: Automated Quality Gates & Threshold Matrix

**Release Specification & Governance:**
* CI/CD pipelines enforce automated, non-negotiable quality gates before permitting binary promotion:

| Quality Gate Tool | Scope / Target | Mandatory Release Threshold | Enforcement Level |
|---|---|---|---|
| **JaCoCo** | Java 21 Backend | **Line Coverage $\ge 80\%$, Branch Coverage $\ge 75\%$** | Pipeline Blocker |
| **Jest / v8** | Next.js Frontend | **Statement Coverage $\ge 80\%$** | Pipeline Blocker |
| **Semgrep SAST** | Full-Stack Source Code | **0 Critical, 0 High** security vulnerabilities | PR Merge Blocker |
| **Trivy SCA** | Dependencies & Docker | **0 Critical CVEs**, signed SBOM attached | Deployment Blocker |
| **Lighthouse CI** | Core Web Vitals | **Performance $\ge 90$, Accessibility $\ge 95$** | Promotion Blocker |

**Deployment & Verification Pipeline:**
* Automated execution in GitHub Actions `.github/workflows/ci-cd.yml`.
"""

    # 2. Enrich Chapter 25 (Database Schema Safety & Flyway Release Pipeline)
    chapter_map[25] = r"""
### Chapter 25: Database Schema Safety & Flyway Release Pipeline (V1 to V26)

**Release Specification & Governance:**
* All relational schema changes follow the **Expand / Contract** zero-downtime evolution pattern.
* Database migrations execute as an isolated Kubernetes pre-upgrade Job before application pods are updated:
  ```bash
  # Pre-Deployment Automated Migration Execution
  ./gradlew flywayMigrate \
    -Dflyway.url=jdbc:postgresql://db.mediverse.internal:5432/mediverse_prod \
    -Dflyway.user=mediverse_migration \
    -Dflyway.password=${DB_MIGRATION_PASSWORD}
  ```

**Deployment & Verification Pipeline:**
* Automated schema verification validates all 26 migration scripts (`V1` to `V26`).
* If any migration script fails, the release pipeline immediately halts and rolls back before application traffic is affected.
"""

    # 3. Enrich Chapter 38 (Canary Traffic Stepping & Automated Rollback Triggers)
    chapter_map[38] = r"""
### Chapter 38: Canary Traffic Stepping & Automated Rollback Triggers

**Release Specification & Governance:**
* Production releases utilize Argo Rollouts with progressive canary traffic stepping:
  1. **Step 1 (Canary 5%):** 10-minute bake time; synthetic health probe verification.
  2. **Step 2 (Canary 25%):** 15-minute bake time; telemetry error-rate monitoring.
  3. **Step 3 (Canary 50%):** 15-minute bake time; real-user traffic monitoring.
  4. **Step 4 (Full Promotion 100%):** Decommissioning previous replica set.

**Deployment & Verification Pipeline:**
* **Automated Rollback Triggers:**
  - HTTP $5xx$ error rate exceeds $0.1\%$ for $> 60\text{ seconds}$.
  - Socratic AI SSE first-token latency exceeds $2.0\text{ seconds}$.
  - Simulation calculation API P99 latency exceeds $150\text{ms}$.
* **Rollback Execution Command:** `kubectl argo rollouts abort mediverse-backend -n mediverse-prod`
"""

    # 4. Enrich Chapter 45 (Emergency Hotfix Fast-Track Pipeline)
    chapter_map[45] = r"""
### Chapter 45: Emergency Hotfix Fast-Track Pipeline & Back-Merge Protocol

**Release Specification & Governance:**
* P0/P1 production incidents bypass standard sprint release windows via the emergency hotfix protocol:
  1. **Hotfix Branch Creation:** Branch directly from `main` as `hotfix/YYYY-MM-DD-<issue-description>`.
  2. **Fast-Track CI/CD:** Run targeted unit tests and security scans (15-minute target cycle).
  3. **Production Deployment:** Single-click approval by On-Call Incident Commander.
  4. **Automated Back-Merge:** GitHub Actions automatically merges the hotfix branch back into `develop` and open release branches to prevent regression.

**Deployment & Verification Pipeline:**
* Post-hotfix retrospective scheduled within 48 hours to complete Root Cause Analysis (RCA).
"""

    # 5. Enrich Chapter 50 (Post-Release Automated Synthetic Smoke Verification)
    chapter_map[50] = r"""
### Chapter 50: Post-Release Automated Synthetic Smoke Verification Test Suite

**Release Specification & Governance:**
* Immediately following a production promotion, an automated Playwright synthetic test suite verifies critical student and faculty workflows:
  1. **3D WebGL Multi-Organ Render:** Asserts 3D cardiovascular heart mesh loads and renders in $< 1.5\text{s}$.
  2. **Physiological Math Solver API:** Executes `POST /api/v1/simulations/calculate` and asserts cardiac PV-loop calculations match within $0.01\%$ tolerance.
  3. **Socratic AI Token Streaming:** Validates `POST /api/v1/ai-tutor/chat/stream` delivers first token chunk in $< 800\text{ms}$.
  4. **LMS LTI 1.3 Handshake:** Verifies OIDC test launch and AGS grade passback signatures.

**Deployment & Verification Pipeline:**
* Synthetic test failure automatically flags the release in PagerDuty and triggers canary rollback.
"""

    # Reassemble complete RMG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_rmg = "\n\n---\n\n".join(output_parts)
    print(f"Final RMG.md length: {len(final_rmg)} characters across 65 chapters.")

    with open('docs/RMG.md', 'w', encoding='utf-8') as f:
        f.write(final_rmg)
    print("Successfully updated docs/RMG.md with all release management specifications!")

if __name__ == '__main__':
    main()
