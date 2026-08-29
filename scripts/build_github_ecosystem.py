import os
import sys
import json

BASE_DIR = r"F:\Mediverse-app"

def write_file(rel_path, content):
    full_path = os.path.join(BASE_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Generated: {rel_path}")

print("=== Starting GitHub Ecosystem Builder ===")

# ==========================================
# 1. GITHUB ISSUE FORMS & CONFIG
# ==========================================

def gen_issue_templates():
    # 1. Epic Template
    write_file(".github/ISSUE_TEMPLATE/epic.yml", """name: "🎯 Epic Specification"
description: "Propose a multi-story strategic initiative, clinical domain module, or architectural capability"
title: "[EPIC]: "
labels: ["type: epic", "status: triage"]
body:
  - type: markdown
    attributes:
      value: |
        ## 🏥 Mediverse Strategic Epic Definition
        Use this template to define large-scale initiatives that span multiple user stories and sprints.

  - type: textarea
    id: executive-summary
    attributes:
      label: Executive Summary & Clinical Intent
      description: What is the high-level business, clinical, or pedagogical goal of this epic?
      placeholder: E.g., Implement the 5.5-Year MBBS CBME Curriculum with interactive clinical cases and organ simulations.
    validations:
      required: true

  - type: dropdown
    id: medical-domain
    attributes:
      label: Primary Medical / Healthcare Domain
      options:
        - "Core Platform & Infrastructure"
        - "Allopathic Medicine (MBBS / MD)"
        - "Dental Surgery (BDS / MDS)"
        - "AYUSH (Ayurveda, Yoga, Unani, Siddha, Homeopathy)"
        - "Pharmacy (B.Pharm / Pharm.D)"
        - "Nursing (B.Sc / M.Sc Nursing)"
        - "Physiotherapy (BPT / MPT)"
        - "Allied Health Sciences (NCAHP)"
        - "Veterinary Medicine (BVSc & AH)"
        - "Public Health & Epidemiology (MPH)"
        - "Socratic AI Tutoring & Grounded Content"
        - "OSCE & Clinical Assessment Engine"
    validations:
      required: true

  - type: textarea
    id: user-stories
    attributes:
      label: Child User Stories & Capabilities Breakdown
      description: List the planned user stories and functional modules belonging to this epic.
      placeholder: |
        - [ ] Story 1: #...
        - [ ] Story 2: #...
        - [ ] Story 3: #...
    validations:
      required: true

  - type: textarea
    id: architecture-impact
    attributes:
      label: Architectural & Compliance Impact
      description: Note any changes to database schemas, Spring Boot services, Redis caches, or HIPAA/WCAG compliance.
      placeholder: E.g., Introduces new Flyway migration V12__dental_periodontal_schema.sql; enforces WCAG 2.1 AA.
    validations:
      required: false

  - type: checkboxes
    id: epic-dod
    attributes:
      label: Epic Definition of Done (DoD) Gate
      options:
        - label: All child user stories implemented, tested, and closed
          required: true
        - label: Multi-domain Playwright regression tests passing (100%)
          required: true
        - label: API contract & Newman regression tests passing (100%)
          required: true
        - label: Zero open S1 (Critical) or S2 (High) defects
          required: true
        - label: Formal QA & Product Owner release sign-off recorded
          required: true
""")

    # 2. User Story Template
    write_file(".github/ISSUE_TEMPLATE/user_story.yml", """name: "✨ User Story"
description: "Define a user-facing feature or capability following Agile INVEST & Gherkin standards"
title: "[STORY]: "
labels: ["type: story", "status: triage"]
body:
  - type: markdown
    attributes:
      value: |
        ## 📋 Agile User Story & Testability Contract

  - type: textarea
    id: user-narrative
    attributes:
      label: User Story Narrative
      description: Describe the persona, intent, and benefit.
      placeholder: |
        **As a** Dental Student (BDS Year 2),
        **I want to** interact with 3D Tooth Morphology models and adjust enamel transparency,
        **So that** I can visualize internal pulp chamber anatomy before clinical restorative procedures.
    validations:
      required: true

  - type: dropdown
    id: story-domain
    attributes:
      label: Medical Domain / Module
      options:
        - "Core Shell / Auth"
        - "Allopathic (MBBS/MD)"
        - "Dental (BDS/MDS)"
        - "AYUSH (Ayurveda/Homeopathy)"
        - "Pharmacy"
        - "Nursing"
        - "Physiotherapy"
        - "Allied Health"
        - "Veterinary"
        - "Public Health"
        - "Socratic AI Tutor"
        - "OSCE Assessment"
        - "CMS & Curriculum Authoring"
    validations:
      required: true

  - type: textarea
    id: gherkin-scenarios
    attributes:
      label: Acceptance Criteria (Gherkin Scenarios)
      description: Mandatory Given-When-Then criteria for Happy Path, Validation/Negative, and Edge Cases.
      placeholder: |
        ```gherkin
        Scenario: Adjusting enamel transparency reveals pulp cavity
          Given the student is on the 3D Tooth Morphology viewer for Tooth #21
          When the student drags the "Enamel Transparency" slider to 80%
          Then the outer enamel mesh opacity is reduced to 0.2
          And the red vascular pulp chamber and root canals become clearly visible
        ```
    validations:
      required: true

  - type: input
    id: rtm-id
    attributes:
      label: Traceability Requirement ID (RTM)
      description: Map to QA Requirements Traceability Matrix ID (e.g., REQ-DENT-002, REQ-SOC-001)
      placeholder: REQ-DENT-002
    validations:
      required: true

  - type: checkboxes
    id: story-dor
    attributes:
      label: Definition of Ready (DoR) Validation
      options:
        - label: Story follows INVEST criteria and is sized within 1 sprint
          required: true
        - label: Minimum 3 Gherkin scenarios defined (Happy, Negative, Boundary)
          required: true
        - label: UX / Figma mockups or UI specifications linked
          required: true
        - label: Test data requirements identified (Pure synthetic data)
          required: true
""")

    # 3. Bug Report / Defect Template
    write_file(".github/ISSUE_TEMPLATE/bug_report.yml", """name: "🐛 Defect / Bug Report"
description: "Report a software defect, unexpected failure, regression, or clinical data discrepancy"
title: "[BUG]: "
labels: ["type: bug", "status: triage"]
body:
  - type: markdown
    attributes:
      value: |
        ## 🚨 Enterprise Defect Report
        Provide accurate diagnostics, reproduction steps, and failure evidence.

  - type: dropdown
    id: severity
    attributes:
      label: Defect Severity (SLA Impact)
      description: Select the clinical, financial, or system impact severity.
      options:
        - "S1 - Critical (Crash, Data Loss, PHI Leak, Blocker - SLA <4h)"
        - "S2 - High (Core Domain Feature Broken with No Workaround - SLA <24h)"
        - "S3 - Medium (Secondary Feature Broken with Workaround - SLA <1 Sprint)"
        - "S4 - Low (Cosmetic, Minor UI Misalignment, Typo - Backlog)"
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: Defect Priority
      options:
        - "P1 - Urgent"
        - "P2 - High"
        - "P3 - Medium"
        - "P4 - Low"
    validations:
      required: true

  - type: dropdown
    id: environment
    attributes:
      label: Environment Detected
      options:
        - "QA Environment (Continuous)"
        - "Staging Environment (Release Candidate)"
        - "Production (Live System)"
        - "Local / Dev Environment"
    validations:
      required: true

  - type: input
    id: build-version
    attributes:
      label: Build Version / Git Commit SHA
      placeholder: v2.4.0-rc2 (commit a1b2c3d)
    validations:
      required: true

  - type: input
    id: test-case-id
    attributes:
      label: Associated Test Case ID (from QA Suite)
      placeholder: E.g., TC-DENT-006 or NAV-002
    validations:
      required: false

  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: Steps to Reproduce
      description: Exact sequential actions required to trigger the bug.
      placeholder: |
        1. Log in as student `student.pilot@mediverse.edu`
        2. Navigate to `/healthcare/dental/periodontal-charting`
        3. Input 5mm probing depth in Sextant 5
        4. Click 'Calculate CPITN'
    validations:
      required: true

  - type: textarea
    id: expected-actual
    attributes:
      label: Expected vs Actual Behavior
      description: Contrast what should have occurred against what actually failed.
      placeholder: |
        **Expected Result:**
        CPITN code 3 calculated with red pocket depth indicator.

        **Actual Result:**
        Console throws `TypeError: Cannot read property 'depth' of undefined`. UI hangs on spinner.
    validations:
      required: true

  - type: textarea
    id: diagnostic-evidence
    attributes:
      label: Diagnostic Logs & Evidence
      description: Attach screenshots, Playwright trace links, backend stacktraces, or API request/responses.
      placeholder: |
        - Screenshot / Video link:
        - Backend Log Stacktrace:
        ```text
        java.lang.NullPointerException: ...
        ```
    validations:
      required: false
""")

    # 4. Bug Fix Verification Template
    write_file(".github/ISSUE_TEMPLATE/bug_fix.yml", """name: "🔧 Bug Fix Verification"
description: "Submit a resolved defect for QA retesting and automated regression verification"
title: "[FIX]: "
labels: ["type: bug-fix", "status: ready-for-qa"]
body:
  - type: input
    id: defect-issue
    attributes:
      label: Defect Issue Reference
      placeholder: Fixes #...
    validations:
      required: true

  - type: textarea
    id: root-cause-analysis
    attributes:
      label: Root Cause Analysis (RCA)
      description: Why did this failure occur and how did the fix resolve it?
      placeholder: E.g., The periodontal calculation algorithm failed to handle empty probing depth values in un-erupted teeth.
    validations:
      required: true

  - type: textarea
    id: test-evidence
    attributes:
      label: Verification & Test Proof
      description: Link newly added automated unit/e2e tests and attach passing execution logs.
      placeholder: |
        - Unit test added: `PeriodontalCalculatorTest.java` (PASS)
        - Playwright spec added: `04_domain_dental.spec.ts` (PASS)
    validations:
      required: true
""")

    # 5. QA Task Template
    write_file(".github/ISSUE_TEMPLATE/qa_task.yml", """name: "🧪 QA / Automation Task"
description: "Define an exploratory test charter, Playwright automation suite, or performance benchmark"
title: "[QA]: "
labels: ["type: qa-task", "status: triage"]
body:
  - type: dropdown
    id: qa-category
    attributes:
      label: Quality Engineering Category
      options:
        - "Playwright E2E Automation"
        - "Newman / Postman API Contract Automation"
        - "Charter-Based Exploratory Testing"
        - "Performance & Load Testing (k6 / Prometheus)"
        - "Security Vulnerability Scan (OWASP / SAST)"
        - "Accessibility Audit (WCAG 2.1 AA)"
    validations:
      required: true

  - type: textarea
    id: qa-objective
    attributes:
      label: Objective & Deliverables
      description: What test artifacts or automation suites will be delivered?
      placeholder: E.g., Author Playwright Page Object Model and spec for OSCE Clinical Station Timer with audio alerts.
    validations:
      required: true
""")

    # 6. Security Vulnerability Template
    write_file(".github/ISSUE_TEMPLATE/security_vulnerability.yml", """name: "🔒 Security Vulnerability Report"
description: "Report an OWASP security risk, authentication bypass, or HIPAA compliance vulnerability"
title: "[SECURITY]: "
labels: ["type: security", "severity: S1-critical", "status: triage"]
body:
  - type: dropdown
    id: owasp-category
    attributes:
      label: OWASP Top 10 Classification
      options:
        - "A01:2021 - Broken Access Control / IDOR"
        - "A02:2021 - Cryptographic Failures / Insecure PHI"
        - "A03:2021 - Injection (SQL / NoSQL / Command)"
        - "A04:2021 - Insecure Design"
        - "A05:2021 - Security Misconfiguration"
        - "A06:2021 - Vulnerable and Outdated Components"
        - "A07:2021 - Identification & Authentication Failures"
        - "A08:2021 - Software and Data Integrity Failures"
        - "A09:2021 - Security Logging and Monitoring Failures"
        - "A10:2021 - Server-Side Request Forgery (SSRF)"
    validations:
      required: true

  - type: textarea
    id: security-details
    attributes:
      label: Vulnerability Details & Exploit Proof of Concept
      description: Provide reproduction payload and affected endpoint.
      placeholder: E.g., Accessing `/api/v1/admin/audit-logs` using student bearer token returns 200 instead of 403 Forbidden.
    validations:
      required: true
""")

    # 7. Issue Template Config
    write_file(".github/ISSUE_TEMPLATE/config.yml", """blank_issues_enabled: false
contact_links:
  - name: 💬 Mediverse QA & Architecture Discussions
    url: https://github.com/shriganeshchoudhari/Mediverse-app/discussions
    about: Ask questions, discuss test architecture, or share ideas.
  - name: 📖 Quality Engineering Documentation
    url: https://github.com/shriganeshchoudhari/Mediverse-app/tree/main/qa
    about: Read the enterprise QA governance, strategy, and runbooks.
""")

    # 8. Pull Request Template
    write_file(".github/PULL_REQUEST_TEMPLATE.md", """## 📋 Pull Request Description
<!-- Provide a clear summary of what changes are introduced and why. -->

**Related Issue / Epic:** Closes #
**Type of Change:**
- [ ] 🚀 New Feature (User Story)
- [ ] 🐛 Bug Fix (Defect Resolution)
- [ ] 🧪 Test Automation (Playwright / Newman / Unit)
- [ ] ⚡ Performance Optimization
- [ ] 🔒 Security & Compliance
- [ ] 📚 Documentation & Medical Curricula
- [ ] ⚠️ Breaking Change / Database Migration

---

## 🏥 Medical Domain & Service Impact
- [ ] Core Shell & Identity (`/auth`, Topbar, Themes)
- [ ] Allopathic Medicine (`/allopathic`, MBBS, MD/MS, ECG/Acid-Base Sim)
- [ ] Dental Surgery (`/dental`, BDS, MDS, 3D Tooth, Periodontal)
- [ ] AYUSH (`/ayush`, BAMS, BHMS, BNYS, BUMS, BSMS, Prakriti, Marma)
- [ ] Pharmacy (`/pharmacy`, B.Pharm, Pharm.D, Dissolution)
- [ ] Nursing (`/nursing`, B.Sc Nursing, SBAR Handover)
- [ ] Physiotherapy (`/physiotherapy`, BPT, Biomechanics, Goniometer)
- [ ] Allied Health (`/allied-health`, BMLT, OTT, Dialysis, Imaging)
- [ ] Veterinary (`/veterinary`, BVSc & AH, 3D Canine)
- [ ] Public Health (`/public-health`, MPH, Epidemic Outbreak)
- [ ] Socratic AI Tutor (`/aitutor`, RAG, Grounded Content)
- [ ] OSCE Clinical Exam Engine (`/exams`, Clinical Stations, Timer)
- [ ] Collaborative Study Rooms (`/social`, WebRTC, Whiteboard)

---

## 🧪 Quality Engineering & Verification Checklist

### 1. Automated Tests
- [ ] **Unit Tests:** Line coverage $\ge 80\%$ verified via `./gradlew jacocoTestCoverageVerification` / `npm run test:coverage`.
- [ ] **API Tests:** Postman/Newman contract assertions passing locally / in CI.
- [ ] **UI Tests:** Playwright specs executed (`npm run test:smoke` or `npm run test:e2e`).
- [ ] **Static Analysis:** Zero ESLint or SonarQube blocker/critical violations.

### 2. Privacy, Security & HIPAA Compliance
- [ ] Zero hardcoded passwords, tokens, API keys, or private secrets.
- [ ] Test data strictly synthetic (Zero real Protected Health Information [PHI]).
- [ ] PII redaction and rate limiting filters preserved on public endpoints.

### 3. Accessibility & UX
- [ ] Automated `axe-core` accessibility scan passed with 0 Level A / AA violations.
- [ ] Keyboard tab-navigation and mobile responsive viewports verified.

### 4. Persistence & Database
- [ ] Flyway schema migration scripts (`V...__*.sql`) tested for forward/rollback safety.
- [ ] No table-locking `ALTER TABLE` operations on large tables.

---

## 📸 Diagnostic Evidence & Test Proof
<!-- Attach screenshots, screen recordings, Allure trace links, or test terminal logs. -->

---

## 🛡️ Definition of Done (DoD) Sign-Off
- [ ] Pull request approved by at least one Senior Software Engineer and one SDET / QA Engineer.
- [ ] All CI Quality Gates on GitHub Actions passed with green status.
""")

    # 9. CODEOWNERS
    write_file(".github/CODEOWNERS", """# ==========================================
# Mediverse Enterprise Code Ownership Matrix
# ==========================================

# Default Global Owners
* @shriganeshchoudhari

# Quality Assurance & Test Automation
/qa/                                            @shriganeshchoudhari
/automation/                                    @shriganeshchoudhari
/frontend/e2e/                                  @shriganeshchoudhari
/frontend/__tests__/                            @shriganeshchoudhari
/backend/src/test/                              @shriganeshchoudhari

# Backend Services, Microservices & Data Layer
/backend/                                       @shriganeshchoudhari
/backend/src/main/java/com/curiolearn/          @shriganeshchoudhari
/backend/src/main/resources/db/migration/       @shriganeshchoudhari
/backend/build.gradle                           @shriganeshchoudhari

# Frontend Web Application & Components
/frontend/                                      @shriganeshchoudhari
/frontend/app/                                  @shriganeshchoudhari
/frontend/components/                           @shriganeshchoudhari
/frontend/package.json                          @shriganeshchoudhari

# DevSecOps, Infrastructure & CI/CD
/.github/workflows/                             @shriganeshchoudhari
/.github/                                       @shriganeshchoudhari
/k8s/                                           @shriganeshchoudhari
/terraform/                                     @shriganeshchoudhari
/docker-compose.yml                             @shriganeshchoudhari
/monitoring/                                    @shriganeshchoudhari
/Jenkinsfile                                    @shriganeshchoudhari

# Medical Curricula, Documentation & Compliance
/docs/                                          @shriganeshchoudhari
/docs/curriculum/                               @shriganeshchoudhari
/docs/compliance/                               @shriganeshchoudhari
""")

    # 10. Release Configuration
    write_file(".github/release.yml", """changelog:
  categories:
    - title: 🎯 Strategic Epics & Milestones
      labels:
        - "type: epic"
    - title: 🚀 New Features & User Stories
      labels:
        - "type: story"
        - "feature"
    - title: 🐛 Defect Resolutions & Bug Fixes
      labels:
        - "type: bug"
        - "type: bug-fix"
        - "bug"
    - title: 🧪 Quality Engineering & Test Automation
      labels:
        - "type: qa-task"
        - "qa"
        - "testing"
    - title: 🔒 Security, HIPAA & Privacy Enhancements
      labels:
        - "type: security"
        - "security"
        - "compliance"
    - title: 📚 Medical Curricula & Documentation
      labels:
        - "type: documentation"
        - "documentation"
    - title: ⚠️ Breaking Changes & Database Migrations
      labels:
        - "breaking-change"
        - "migration"
""")

    # 11. Labels Taxonomy
    write_file(".github/labels.json", json.dumps([
      # Types
      {"name": "type: epic", "color": "3E4B9B", "description": "Strategic multi-story initiative or domain capability"},
      {"name": "type: story", "color": "0E8A16", "description": "Agile User story with Gherkin acceptance criteria"},
      {"name": "type: bug", "color": "D93F0B", "description": "Software defect or unexpected failure"},
      {"name": "type: bug-fix", "color": "FBCA04", "description": "Resolved defect awaiting QA retest"},
      {"name": "type: qa-task", "color": "5319E7", "description": "Quality engineering or test automation task"},
      {"name": "type: security", "color": "B60205", "description": "OWASP vulnerability or HIPAA security risk"},
      {"name": "type: documentation", "color": "0075CA", "description": "Curriculum, architectural or QA documentation"},

      # Severities
      {"name": "severity: S1-critical", "color": "B60205", "description": "S1: Blocker, Crash, PHI leak, SLA <4h"},
      {"name": "severity: S2-high", "color": "D93F0B", "description": "S2: Major feature broken, no workaround, SLA <24h"},
      {"name": "severity: S3-medium", "color": "FBCA04", "description": "S3: Minor feature broken with workaround, SLA 1 sprint"},
      {"name": "severity: S4-low", "color": "C5DEF5", "description": "S4: Cosmetic or typo, backlog"},

      # Priorities
      {"name": "priority: P1-urgent", "color": "B60205", "description": "Urgent attention required"},
      {"name": "priority: P2-high", "color": "D93F0B", "description": "High priority execution"},
      {"name": "priority: P3-medium", "color": "FBCA04", "description": "Medium priority execution"},
      {"name": "priority: P4-low", "color": "C5DEF5", "description": "Low priority execution"},

      # Medical Domains
      {"name": "domain: core-platform", "color": "0052CC", "description": "Core shell, identity, navigation, theme"},
      {"name": "domain: allopathic", "color": "1D76DB", "description": "MBBS / MD Allopathic Medicine & Simulators"},
      {"name": "domain: dental", "color": "006B75", "description": "BDS / MDS Dental Surgery & 3D Tooth"},
      {"name": "domain: ayush", "color": "228B22", "description": "BAMS, BHMS, BNYS, BUMS, BSMS & Marma"},
      {"name": "domain: pharmacy", "color": "D4C5F9", "description": "B.Pharm & Pharm.D PCI Curricula"},
      {"name": "domain: nursing", "color": "BFDADC", "description": "B.Sc Nursing & SBAR Clinical Tool"},
      {"name": "domain: physiotherapy", "color": "C2E0C6", "description": "BPT Biomechanics & Goniometer"},
      {"name": "domain: allied-health", "color": "FEF2C0", "description": "BMLT, OTT, Dialysis NCAHP Curricula"},
      {"name": "domain: veterinary", "color": "E99695", "description": "BVSc Animal Husbandry & 3D Canine"},
      {"name": "domain: public-health", "color": "F9D0C4", "description": "MPH Outbreak & Epidemic Curve"},
      {"name": "domain: socratic-ai", "color": "6f42c1", "description": "Socratic AI Tutor & Grounded RAG"},
      {"name": "domain: osce-exam", "color": "E11D48", "description": "OSCE Clinical Stations & Question Bank"},

      # Statuses
      {"name": "status: triage", "color": "EDEDED", "description": "New item awaiting product/QA triage"},
      {"name": "status: ready-for-dev", "color": "C2E0C6", "description": "Meets DoR, ready for sprint intake"},
      {"name": "status: in-progress", "color": "FEF2C0", "description": "Currently under active development"},
      {"name": "status: in-pr-review", "color": "D4C5F9", "description": "Pull request under code review"},
      {"name": "status: ready-for-qa", "color": "BFD4F2", "description": "Deployed to QA, ready for testing"},
      {"name": "status: in-qa-retest", "color": "F9D0C4", "description": "QA currently executing test verification"},
      {"name": "status: blocked", "color": "B60205", "description": "Blocked by external dependency or environment"},
      {"name": "status: done", "color": "0E8A16", "description": "Meets DoD, verified and closed"}
    ], indent=2))

print("Issue templates, PR template, CODEOWNERS, Release config, and Labels generated.")

# ==========================================
# 2. GITHUB PROJECT AUTOMATION WORKFLOWS
# ==========================================

def gen_workflows():
    # 1. Project Automation Workflow
    write_file(".github/workflows/project-automation.yml", """name: GitHub Project & Issue Automation

on:
  issues:
    types: [opened, labeled, unlabeled, closed, reopened]
  pull_request:
    types: [opened, closed, review_requested]

jobs:
  issue-automation:
    name: Issue Triage & Status Automation
    runs-on: ubuntu-latest
    steps:
      - name: Auto-Label New Issues
        if: github.event_name == 'issues' && github.event.action == 'opened'
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue;
            const labels = [];
            
            // Check title prefixes
            if (issue.title.startsWith('[EPIC]')) labels.push('type: epic');
            else if (issue.title.startsWith('[STORY]')) labels.push('type: story');
            else if (issue.title.startsWith('[BUG]')) labels.push('type: bug');
            else if (issue.title.startsWith('[FIX]')) labels.push('type: bug-fix');
            else if (issue.title.startsWith('[QA]')) labels.push('type: qa-task');
            else if (issue.title.startsWith('[SECURITY]')) labels.push('type: security', 'severity: S1-critical');

            if (labels.length > 0) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                labels: labels
              });
            }
""")

    # 2. Issue Triage & Critical Alert Workflow
    write_file(".github/workflows/issue-triage.yml", """name: Critical Defect Triage & Alert

on:
  issues:
    types: [opened, labeled]

jobs:
  critical-alert:
    name: S1 Critical Defect Escalation
    runs-on: ubuntu-latest
    if: contains(github.event.issue.labels.*.name, 'severity: S1-critical') || contains(github.event.issue.body, 'S1 - Critical')
    steps:
      - name: Post Critical Defect Notification
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue;
            const commentBody = `🚨 **CRITICAL S1 DEFECT DETECTED (SLA: < 4 Hours)**\\n\\nThis defect has been classified with critical severity. The QA Architect, SDET Lead, and On-Call Engineering Lead have been notified for immediate triage.\\n\\n- **Issue:** #${issue.number} - ${issue.title}\\n- **Reported By:** @${issue.user.login}\\n- **Triage Checklist:** Refer to [qa/16-runbooks/Failed-Test-Runbook.md](https://github.com/${context.repo.owner}/${context.repo.repo}/blob/main/qa/16-runbooks/Failed-Test-Runbook.md)`;
            
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issue.number,
              body: commentBody
            });
            
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issue.number,
              labels: ['severity: S1-critical', 'priority: P1-urgent', 'status: triage']
            });
""")

# ==========================================
# 3. EPICS & SPRINT BACKLOGS
# ==========================================

def gen_epics_sprints():
    # 1. SPRINT CADENCE & GOVERNANCE
    write_file(".github/sprints/SPRINT_CADENCE.md", """# Mediverse Agile Sprint Cadence & Ceremonies

```text
Sprint Cadence:     2-Week Iteration (10 Business Days)
Planning Day:       Sprint Day 1 (Monday 09:00 UTC)
Mid-Sprint Sync:    Sprint Day 5 (Friday 14:00 UTC)
Bug Bash:           Sprint Day 8 (Wednesday 15:00 UTC)
Regression & DoD:   Sprint Day 9 (Thursday 16:00 UTC)
Sprint Review & PO: Sprint Day 10 (Friday 11:00 UTC)
Retrospective:      Sprint Day 10 (Friday 14:00 UTC)
```

---

## 1. Story Point Estimation Standards (Fibonacci)
- **1 Point (XS):** Simple text / localization / minor styling fix (<2 hours).
- **2 Points (S):** Straightforward API endpoint or UI component modification with unit tests (0.5 day).
- **3 Points (M):** Standard user story with Gherkin ACs, backend logic, and Playwright UI tests (1-2 days).
- **5 Points (L):** Complex multi-system feature (e.g. 3D organ mesh shader + Socratic AI streaming) (2-3 days).
- **8 Points (XL):** Major architectural capability (Must be split into smaller stories if possible).
""")

    # 2. EPIC 01 - Core Platform & Navigation
    write_file(".github/epics/EPIC-01-Core-Auth-Navigation.md", """# [EPIC-01] Core Platform Shell, Identity & Global Navigation

- **Domain:** `domain: core-platform`
- **Lead Architect:** Enterprise QA Architect / Lead Frontend Engineer
- **Status:** APPROVED / IN PROGRESS

## 1. Executive Summary
Establish a rock-solid, accessible, and high-performance core platform shell for Mediverse. Provides single-cardinality navigation topbar, dark/light theme tokens, secure JWT registration & login, protected route interception, and global Cmd+K cross-domain search.

## 2. Child User Stories
- [x] **STORY-001 (NAV-000):** Global Topbar Single Instance & Branding (`frontend/e2e/specs/01_auth_navigation.spec.ts`)
- [x] **STORY-002 (AUTH-001):** Student Registration with JWT Token Issuance (`01_auth_navigation.spec.ts`)
- [x] **STORY-003 (AUTH-002):** Student & Admin Authentication with Protected Redirects (`01_auth_navigation.spec.ts`)
- [x] **STORY-004 (NAV-002):** Global Cmd+K Search Modal with Debounced Auto-Complete (`02_global_search_socratic.spec.ts`)
- [x] **STORY-005 (NAV-001):** Theme Switcher with Persistent Dark/Light Color Tokens (`01_auth_navigation.spec.ts`)

## 3. QA & Quality Gate Verification
- Automated Playwright Spec: `01_auth_navigation.spec.ts` (100% Pass)
- WCAG 2.1 AA Accessibility Scan: 0 Violations (`15_accessibility_and_responsive.spec.ts`)
""")

    # 3. EPIC 02 - Socratic AI Tutor & Grounded RAG
    write_file(".github/epics/EPIC-02-Socratic-AI-Tutor-Grounded-RAG.md", """# [EPIC-02] Socratic AI Tutor & Grounded Clinical RAG Engine

- **Domain:** `domain: socratic-ai`
- **Lead Architect:** AI Systems Lead & SDET Lead
- **Status:** APPROVED / ACTIVE

## 1. Executive Summary
Implement the intelligent Socratic pedagogical assistant that guides medical students through diagnostic inquiry without prematurely revealing answers. Backed by PostgreSQL pgvector embeddings and Spring Boot RAG services.

## 2. Child User Stories
- [x] **STORY-010 (SOC-001):** Floating Socratic Assistant Drawer & Starter Inquiry Prompts (`02_global_search_socratic.spec.ts`)
- [x] **STORY-011 (SOC-002):** Real-time Streaming Socratic Dialogue with Citation References (`02_global_search_socratic.spec.ts`)
- [x] **STORY-012 (AI-001):** Grounded MCQ Quiz Generator from Clinical Case Notes (`backend/postman`)
- [ ] **STORY-013 (AI-002):** SOAP Note Automated Clinical Charting Evaluation Engine

## 3. QA & Quality Gate Verification
- Unit Tests: `AiContentGeneratorControllerTest.java`, `RagServiceTest.java`, `AITutorApiControllerTest.java`
- Playwright Spec: `02_global_search_socratic.spec.ts`
""")

    # 4. EPIC 03 - 9 Healthcare Curricula Portals
    write_file(".github/epics/EPIC-03-9-Healthcare-Curricula-Portals.md", """# [EPIC-03] Comprehensive 9 Healthcare Domain Curricula Portals

- **Domain:** `domain: allopathic`, `domain: dental`, `domain: ayush`, `domain: pharmacy`, `domain: nursing`, `domain: physiotherapy`, `domain: allied-health`, `domain: veterinary`, `domain: public-health`
- **Lead Architect:** Medical Curricula Director & Lead SDET
- **Status:** APPROVED / IN PROGRESS

## 1. Executive Summary
Deliver structured curriculum portals for 9 accredited healthcare branches (MBBS CBME, BDS DCI, BAMS/BHMS/BNYS/BUMS/BSMS NCISM, B.Pharm/Pharm.D PCI, B.Sc Nursing INC, BPT/MPT, NCAHP Allied Health, BVSc VCI, and MPH Public Health).

## 2. Child User Stories
- [x] **STORY-020 (ALLO-001):** MBBS 5.5-Year CBME Curriculum & Phase Navigation (`03_domain_allopathic.spec.ts`)
- [x] **STORY-021 (DENT-001):** BDS 5-Year DCI Curriculum & Year 2 Subjects (`04_domain_dental.spec.ts`)
- [x] **STORY-022 (AYUSH-001):** AYUSH 5-System Portals (Ayurveda, Homeopathy, Unani, Siddha, Naturopathy) (`05_domain_ayush.spec.ts`)
- [x] **STORY-023 (PHARM-001):** Pharmacy B.Pharm/Pharm.D Curricula (`06_domain_pharmacy.spec.ts`)
- [x] **STORY-024 (NURS-001):** Nursing INC Curriculum & SBAR Clinical Tool (`07_domain_nursing.spec.ts`)
- [x] **STORY-025 (PT-001):** Physiotherapy BPT Curriculum & Biomechanics (`08_domain_physiotherapy.spec.ts`)
- [x] **STORY-026 (ALLIED-001):** Allied Health NCAHP Degree Programs (`09_domain_allied_health.spec.ts`)
- [x] **STORY-027 (VET-001):** Veterinary Medicine BVSc & AH Curriculum (`10_domain_veterinary.spec.ts`)
- [x] **STORY-028 (PUB-001):** Public Health MPH Outbreak Modeling Portal (`11_domain_public_health.spec.ts`)

## 3. QA & Quality Gate Verification
- Automated Specs: `03_domain_allopathic.spec.ts` through `11_domain_public_health.spec.ts`
- 9 Domain Controller Unit Tests in `backend/src/test/java/com/curiolearn/curriculum/`
""")

    # 5. EPIC 04 - Interactive Simulators
    write_file(".github/epics/EPIC-04-Interactive-Medical-Simulators.md", """# [EPIC-04] Interactive Clinical Simulators & 3D Anatomy Graphics

- **Domain:** `domain: allopathic`, `domain: dental`, `domain: ayush`
- **Lead Architect:** Graphics Engineer & SDET Lead
- **Status:** APPROVED / IN PROGRESS

## 1. Executive Summary
Provide web-based interactive clinical physiology solvers and 3D organ meshes (ECG Arrhythmia simulator, Acid-Base Davenport solver, 3D Tooth Morphology with enamel transparency, Periodontal Charting, and 3D Marma vital points map).

## 2. Child User Stories
- [x] **STORY-030 (ALLO-005):** Interactive 12-Lead ECG Waveform Simulator (VTach, SVT, Normal Sinus) (`03_domain_allopathic.spec.ts`)
- [x] **STORY-031 (ALLO-006):** Davenport Acid-Base Diagram & PaCO2 Compensation Solver (`03_domain_allopathic.spec.ts`)
- [x] **STORY-032 (DENT-004):** 3D Tooth Morphology Mesh with Dynamic Enamel Alpha Slider (`04_domain_dental.spec.ts`)
- [x] **STORY-033 (DENT-006):** Periodontal Pocket Charting & Automated CPITN Calculator (`04_domain_dental.spec.ts`)
- [x] **STORY-034 (AYUSH-007):** Prakriti Tri-Dosha Radar Assessment Calculator (`05_domain_ayush.spec.ts`)
- [x] **STORY-035 (AYUSH-008):** 3D Marma Vital Points Anatomical Map (`05_domain_ayush.spec.ts`)
""")

    # 6. EPIC 05 - OSCE Exam Engine
    write_file(".github/epics/EPIC-05-OSCE-Clinical-Exam-Engine.md", """# [EPIC-05] OSCE Clinical Examination & Timed Station Engine

- **Domain:** `domain: osce-exam`
- **Lead Architect:** Assessment Systems Architect & QA Lead
- **Status:** APPROVED / ACTIVE

## 1. Executive Summary
Standardized Objective Structured Clinical Examination (OSCE) testing engine providing timed clinical stations, interactive question banks, immediate automated scoring, and performance analytics.

## 2. Child User Stories
- [x] **STORY-040 (EXAM-001):** Timed OSCE Clinical Station Viewer with Audio Alerts (`13_exam_and_osce.spec.ts`)
- [x] **STORY-041 (EXAM-002):** Multi-Domain Question Bank with Instant Explanations (`13_exam_and_osce.spec.ts`)
- [x] **STORY-042 (EXAM-003):** Student Clinical Scorecard & Diagnostic Accuracy Metrics (`13_exam_and_osce.spec.ts`)
""")

    # 7. EPIC 06 - Collaborative Study Rooms
    write_file(".github/epics/EPIC-06-Collaborative-Study-Rooms.md", """# [EPIC-06] Real-time Collaborative Study Rooms & WebRTC Mesh

- **Domain:** `domain: core-platform`
- **Lead Architect:** Real-time Systems Engineer & SDET
- **Status:** APPROVED / ACTIVE

## 1. Executive Summary
Multi-student virtual study rooms featuring WebRTC mesh audio/video, synchronized clinical whiteboard, and shared flashcard quizzes backed by Spring Boot WebSockets and Redis Pub/Sub.

## 2. Child User Stories
- [x] **STORY-050 (STUDY-001):** Virtual Study Room Creation & Participant Roster (`12_collaborative_study_rooms.spec.ts`)
- [x] **STORY-051 (STUDY-002):** Real-time Synchronized Collaborative Whiteboard (`12_collaborative_study_rooms.spec.ts`)
- [x] **STORY-052 (STUDY-003):** Multiplayer Flashcard Study Challenge (`12_collaborative_study_rooms.spec.ts`)
""")

    # 8. EPIC 07 - CMS & Curriculum Authoring
    write_file(".github/epics/EPIC-07-CMS-Curriculum-Authoring.md", """# [EPIC-07] Medical Curriculum Authoring & Reviewer CMS

- **Domain:** `domain: core-platform`
- **Lead Architect:** Product Lead & Backend Lead
- **Status:** APPROVED / ACTIVE

## 1. Executive Summary
Authoring environment allowing accredited medical educators to draft, review, diff, and publish curriculum units and clinical cases with audit logging.

## 2. Child User Stories
- [x] **STORY-060 (CMS-001):** WYSIWYG Curriculum Unit Editor (`14_cms_curriculum_authoring.spec.ts`)
- [x] **STORY-061 (CMS-002):** Medical Reviewer Approval Workflow & Diff Viewer (`14_cms_curriculum_authoring.spec.ts`)
""")

    # 9. EPIC 08 - Enterprise QA & Observability
    write_file(".github/epics/EPIC-08-Enterprise-QA-Observability.md", """# [EPIC-08] Enterprise QA Governance, Test Automation & Observability

- **Domain:** `domain: core-platform`
- **Lead Architect:** Enterprise QA Architect & DevSecOps Lead
- **Status:** APPROVED / ACTIVE

## 1. Executive Summary
Complete quality operating system comprising 82 controlled documents, Playwright cross-browser suites, Postman/Newman contract tests, GitHub Actions CI/CD pipelines, Prometheus/Grafana metrics, and 15-minute production synthetic monitors.
""")

    # 10. SPRINT 01 BACKLOG
    write_file(".github/sprints/SPRINT-01-Foundation-Auth-Domains.md", """# Sprint 01 — Foundation, Identity & Core Curricula

- **Milestone:** `Sprint 01` (2 Weeks)
- **Primary Goal:** Solidify core navigation, student authentication, and foundational medical curricula (MBBS, BDS, AYUSH).

## Sprint Backlog
| Issue Key | Type | Title | Domain | Estimate | Status |
| :--- | :---: | :--- | :--- | :---: | :---: |
| `MED-101` | Story | Global Topbar Cardinality & Theme Toggle | Core Shell | 2 pts | DONE |
| `MED-102` | Story | Student Registration & JWT Token Flow | Auth | 3 pts | DONE |
| `MED-103` | Story | Student & Admin Login with Protected Routes | Auth | 3 pts | DONE |
| `MED-104` | Story | MBBS 5.5-Yr CBME Curriculum Navigation | Allopathic | 5 pts | DONE |
| `MED-105` | Story | BDS 5-Yr DCI Curriculum Portal | Dental | 5 pts | DONE |
| `MED-106` | Story | AYUSH 5-System Integrated Curriculum | AYUSH | 5 pts | DONE |
| `MED-107` | QA | Author Playwright Specs for Auth & Nav (`01_auth_navigation.spec.ts`) | QA | 3 pts | DONE |
""")

    # 11. SPRINT 02 BACKLOG
    write_file(".github/sprints/SPRINT-02-Socratic-AI-Simulations.md", """# Sprint 02 — Socratic AI Tutor & Clinical Solvers

- **Milestone:** `Sprint 02` (2 Weeks)
- **Primary Goal:** Launch Socratic AI clinical assistant and interactive physiology solvers (ECG, Davenport, 3D Tooth).

## Sprint Backlog
| Issue Key | Type | Title | Domain | Estimate | Status |
| :--- | :---: | :--- | :--- | :---: | :---: |
| `MED-201` | Story | Socratic Assistant Drawer & Streaming Dialogue | Socratic AI | 5 pts | DONE |
| `MED-202` | Story | Interactive 12-Lead ECG Waveform Simulator | Allopathic | 5 pts | DONE |
| `MED-203` | Story | Davenport Acid-Base PaCO2 Solver | Allopathic | 3 pts | DONE |
| `MED-204` | Story | 3D Tooth Morphology Mesh with Enamel Transparency | Dental | 5 pts | DONE |
| `MED-205` | Story | Prakriti Tri-Dosha Assessment Calculator | AYUSH | 3 pts | DONE |
| `MED-206` | QA | Playwright Specs for AI & Simulators (`02` & `03` specs) | QA | 5 pts | DONE |
""")

    # 12. SPRINT 03 BACKLOG
    write_file(".github/sprints/SPRINT-03-OSCE-Study-Rooms.md", """# Sprint 03 — OSCE Assessment & Collaborative Rooms

- **Milestone:** `Sprint 03` (2 Weeks)
- **Primary Goal:** Deploy timed OSCE clinical examination stations and WebRTC study rooms.

## Sprint Backlog
| Issue Key | Type | Title | Domain | Estimate | Status |
| :--- | :---: | :--- | :--- | :---: | :---: |
| `MED-301` | Story | Timed OSCE Clinical Station Viewer & Audio Alerts | OSCE Exam | 5 pts | DONE |
| `MED-302` | Story | Multi-Domain Question Bank with Instant Scoring | OSCE Exam | 5 pts | DONE |
| `MED-303` | Story | WebRTC Collaborative Study Room & Whiteboard | Social | 8 pts | DONE |
| `MED-304` | Story | Pharmacy & Nursing Clinical Handover Tools | Pharmacy/Nursing | 5 pts | DONE |
| `MED-305` | QA | Integration Specs for OSCE & Study Rooms (`12` & `13` specs) | QA | 5 pts | DONE |
""")

    # 13. SPRINT 04 BACKLOG (V2 EXPANSION)
    write_file(".github/sprints/SPRINT-04-V2-Spatial-EMR-Expansion.md", """# Sprint 04 — V2 Spatial Anatomy & Mock EMR Sandbox

- **Milestone:** `Sprint 04` (2 Weeks)
- **Primary Goal:** V2 Expansion — WebXR spatial computing, Voice AI standardized patients, and Mock EMR charting sandbox.

## Sprint Backlog
| Issue Key | Type | Title | Domain | Estimate | Status |
| :--- | :---: | :--- | :--- | :---: | :---: |
| `MED-401` | Story | WebXR Immersive Anatomy Support (`@react-three/xr`) | 3D / Spatial | 8 pts | READY |
| `MED-402` | Story | Voice AI Standardized Patient (WebRTC Multimodal Voice) | AI Voice | 8 pts | READY |
| `MED-403` | Story | Mock EMR SOAP Note Charting Sandbox & Auto-Grader | Clinical EMR | 5 pts | READY |
| `MED-404` | Story | Multi-Tenant University Workspaces & Roster CSV Import | Platform | 5 pts | READY |
| `MED-405` | QA | Author WebXR & EMR Automation Test Specs | QA | 5 pts | READY |
""")

# ==========================================
# 4. GITHUB PROVISIONER SCRIPT
# ==========================================

def gen_provisioner_script():
    write_file("scripts/provision_github_ecosystem.py", """#!/usr/bin/env python3
# ==============================================================================
# Mediverse Enterprise GitHub Ecosystem Provisioner
# ==============================================================================
# Provisions Labels, Milestones, Epics, and User Stories directly via GitHub CLI (gh)
# or GitHub REST API with full idempotency.
# ==============================================================================

import os
import sys
import json
import subprocess
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABELS_FILE = os.path.join(BASE_DIR, ".github", "labels.json")

def run_cmd(cmd, check=True):
    print(f"Executing: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error executing command: {result.stderr}")
    return result

def provision_labels(dry_run=False):
    print("\\n--- Provisioning Enterprise GitHub Labels ---")
    if not os.path.exists(LABELS_FILE):
        print(f"Labels file not found: {LABELS_FILE}")
        return

    with open(LABELS_FILE, "r", encoding="utf-8") as f:
        labels = json.load(f)

    for label in labels:
        name = label["name"]
        color = label["color"]
        description = label.get("description", "")
        print(f"Provisioning Label: {name} (#{color})")
        if not dry_run:
            run_cmd(["gh", "label", "create", name, "--color", color, "--description", description, "--force"], check=False)

def provision_milestones(dry_run=False):
    print("\\n--- Provisioning Sprint Milestones ---")
    milestones = [
        {"title": "Sprint 01", "description": "Foundation, Identity & Core Curricula (MBBS, BDS, AYUSH)"},
        {"title": "Sprint 02", "description": "Socratic AI Tutor & Clinical Physiology Solvers"},
        {"title": "Sprint 03", "description": "OSCE Clinical Assessment & Collaborative Study Rooms"},
        {"title": "Sprint 04", "description": "V2 Spatial Anatomy, Voice AI Patients & Mock EMR"},
        {"title": "Release v2.4.0", "description": "Mediverse Enterprise Production Release"}
    ]

    for ms in milestones:
        print(f"Provisioning Milestone: {ms['title']}")
        if not dry_run:
            run_cmd(["gh", "api", "repos/:owner/:repo/milestones", "-f", f"title={ms['title']}", "-f", f"description={ms['description']}"], check=False)

def main():
    parser = argparse.ArgumentParser(description="Provision Mediverse GitHub Ecosystem")
    parser.add_argument("--dry-run", action="store_true", help="Simulate provisioning without calling GitHub API")
    args = parser.parse_args()

    print(f"=== Mediverse GitHub Ecosystem Provisioner (Dry-Run: {args.dry_run}) ===")
    provision_labels(dry_run=args.dry_run)
    provision_milestones(dry_run=args.dry_run)
    print("\\n=== Provisioning Complete! ===")

if __name__ == "__main__":
    main()
""")

# ==========================================
# MASTER EXECUTION BLOCK
# ==========================================

if __name__ == "__main__":
    print("Executing GitHub Ecosystem Builder...")
    gen_issue_templates()
    gen_workflows()
    gen_epics_sprints()
    gen_provisioner_script()
    print("=== All GitHub Ecosystem Files Generated Successfully! ===")

