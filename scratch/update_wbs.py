import re
import os

def read_wbs():
    with open('docs/WBS.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=#\s+Part\s+[IVXLCDM]+|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def build_chapter_125():
    return r"""# Chapter 125 — Enterprise Security Operations, SIEM & Threat Monitoring

# Chapter Overview

This chapter defines the Work Breakdown Structure for Enterprise Security Operations, Security Information and Event Management (SIEM), and Continuous Threat Monitoring for the Mediverse platform.

# Chapter Summary

Chapter 125 establishes the engineering work packages, delivery tasks, and acceptance criteria for deploying central SIEM log ingestion, automated intrusion detection, security alert triage, and operational incident response workflows.

# 125.1 Introduction

Enterprise security operations provide centralized operational visibility and continuous telemetry analysis across all Mediverse compute, network, database, and application layers.

# 125.2 Objectives

* Deploy centralized SIEM log collection and automated event correlation.
* Implement real-time threat detection rules aligned with MITRE ATT&CK.
* Establish automated alert escalation and security incident response playbooks.
* Guarantee immutable, tamper-evident audit logging for educational and regulatory compliance.

### WBS-1985: Central SIEM Ingestion & Log Aggregation Work Package
* **WBS Code:** `1.12.5.1`
* **Deliverable:** Centralized Elasticsearch / OpenSearch SIEM log pipeline consuming Spring Boot JSON logs, PostgreSQL WAL audit entries, and Nginx ingress access streams.
* **Effort Sizing:** 13 Story Points (80 Person-Hours)
* **Assigned Squad:** Security Operations & Platform SRE
* **Predecessor Dependencies:** Container Logging & VPC Flow Logs
* **Acceptance Criteria (DoD):** Ingestion latency $\le 5.0\text{s}$, log retention online $\ge 12\text{ months}$, 100% structured JSON parsing pass rate.

### WBS-1986: Real-Time Threat Detection & Automated Alerting
* **WBS Code:** `1.12.5.2`
* **Deliverable:** Automated detection rules for brute-force login attempts, credential stuffing, SQL injection signatures, and unauthorized CMS review status changes.
* **Effort Sizing:** 8 Story Points (40 Person-Hours)
* **Assigned Squad:** Security Operations & SecOps Engineers
* **Acceptance Criteria (DoD):** Automated alert generation within 60 seconds of trigger event, automated PagerDuty / Slack escalation.

### WBS-1987: Audit Log Immutability & Forensics Pipeline
* **WBS Code:** `1.12.5.3`
* **Deliverable:** WORM (Write-Once-Read-Many) compliant archive storage for `content_reviews` and `audit_logs` tables with cryptographic hash chain validation.
* **Effort Sizing:** 8 Story Points (40 Person-Hours)
* **Assigned Squad:** Data Security & Compliance Guild
* **Acceptance Criteria (DoD):** Cryptographic verification tool confirms zero tamper events across all archived logs.

### WBS-1988: Security Operations Center (SOC) Runbooks & Playbooks
* **WBS Code:** `1.12.5.4`
* **Deliverable:** Standardized triage playbooks for P1/P2 cyber security incidents, account compromise remediation, and DDoS mitigation.
* **Effort Sizing:** 5 Story Points (24 Person-Hours)
* **Assigned Squad:** SecOps & Incident Response Team
* **Acceptance Criteria (DoD):** Simulated tabletop exercise validates mean time to respond (MTTR $\le 30\text{ minutes}$).
"""

def main():
    text = read_wbs()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in WBS.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            # If duplicate, keep longer one
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    # Add missing Chapter 125
    if 125 not in chapter_map:
        print("Restoring missing Chapter 125...")
        chapter_map[125] = build_chapter_125()

    print(f"Unique chapters after deduplication and insertion: {len(chapter_map)} (expected 150)")

    # 1. Enhance Chapter 10 (Story Point Sizing & Estimation Framework)
    if 10 in chapter_map:
        chap10_addition = r"""
---

# 10.10 Standardized Story Point Estimation & Definition of Done (DoD) Framework

### WBS-0155: Standardized Fibonacci Story Point Scale
The Mediverse engineering platform enforces the modified Fibonacci estimation scale for all work packages:

| Story Points | T-Shirt Sizing | Typical Person-Hour Range | Scope Complexity & Description |
|---|---|---|---|
| **1 SP** | XS | $2 - 4\text{ hours}$ | Minor text/CSS token change, single unit test addition, config tweak |
| **2 SP** | S | $4 - 8\text{ hours}$ | Simple UI component state tweak, minor REST DTO field addition |
| **3 SP** | M | $8 - 16\text{ hours}$ | Standalone UI widget, new standard REST endpoint with unit tests |
| **5 SP** | L | $16 - 32\text{ hours}$ | Complex mathematical solver component, new database table & Flyway migration |
| **8 SP** | XL | $32 - 64\text{ hours}$ | Complete domain feature module (e.g. Socratic SSE client + drawer) |
| **13 SP** | XXL | $64 - 100\text{ hours}$ | Major subsystem integration (e.g. LTI 1.3 OIDC launch handshake engine) |
| **21 SP** | Epic | $> 100\text{ hours}$ | Multi-sprint cross-cutting capability (requires decomposition into work packages) |

### WBS-0156: Universal Definition of Done (DoD) Criteria
A work package is declared complete and ready for production promotion only when:
1. **Automated Unit & Integration Tests:** 100% test pass rate across Jest (frontend) and Gradle (backend).
2. **Performance Benchmarks:** Sub-millisecond mathematical solver latency ($< 1.0\text{ms}$), 60 FPS slider reactivity.
3. **Security Validation:** Zero Critical or High vulnerabilities in SAST/DAST scans; Spring Security method-level `@PreAuthorize` authorization enforced.
4. **Documentation & Traceability:** OpenAPI 3.1 schema updated, executable REST client requests verified, and Master ADR/SRS trace links verified.
"""
        if "# 10.10 Standardized Story Point" not in chapter_map[10]:
            chapter_map[10] = insert_before_end(chapter_map[10], chap10_addition)

    # 2. Enhance Chapter 91 (Core Engineering Workstreams: 3D & Simulation)
    if 91 in chapter_map:
        chap91_addition = r"""
---

# 91.10 Mediverse Core Engineering Work Breakdown Structure (Workstreams 1–6)

### WBS-1450: Workstream 1 — 3D WebGL Multi-Organ Dissection Engine
* **WBS Code:** `1.91.1.0` | **Total Effort:** 21 Story Points (120 Person-Hours)
* **Work Packages:**
  - `1.91.1.1` Build Three.js WebGL2 canvas viewport with OrbitControls (`ThreeCanvas.tsx`) — **8 SP**
  - `1.91.1.2` Implement multi-plane cross-sectional clipping shaders with stencil capping (`DissectionShader.ts`) — **5 SP**
  - `1.91.1.3` Construct multi-organ landmark preset library across 6 organ systems (`OrganPresets.ts`) — **5 SP**
  - `1.91.1.4` Implement explicit WebGL resource cleanup hook (`useThreeMemoryCleanup.ts`) to eliminate VRAM leaks — **3 SP**

### WBS-1451: Workstream 2 — Mathematical Physiology Differential Equation Solvers
* **WBS Code:** `1.91.2.0` | **Total Effort:** 34 Story Points (200 Person-Hours)
* **Work Packages:**
  - `1.91.2.1` Suga-Sagawa left ventricular time-varying elastance & PV-loop solver (`cardiacSolver.ts`) — **8 SP**
  - `1.91.2.2` Acid-Base Davenport nomogram & Henderson-Hasselbalch ABG classifier (`acidBaseSolver.ts`) — **8 SP**
  - `1.91.2.3` Starling glomerular microvascular filtration & renal clearance solver (`renalSolver.ts`) — **8 SP**
  - `1.91.2.4` Goldman-Hodgkin-Katz membrane voltage & action potential solver (`membraneSolver.ts`) — **5 SP**
  - `1.91.2.5` Backend REST simulation calculation controller (`SimulationApiController.java`) — **5 SP**

### WBS-1452: Workstream 3 — Socratic AI Companion & LaTeX KaTeX Engine
* **WBS Code:** `1.91.3.0` | **Total Effort:** 13 Story Points (80 Person-Hours)
* **Work Packages:**
  - `1.91.3.1` Spring AI Server-Sent Events (SSE) streaming controller (`AITutorApiController.java`) — **5 SP**
  - `1.91.3.2` Floating companion UI drawer with route-aware context injection (`GlobalSocraticAssistant.tsx`) — **5 SP**
  - `1.91.3.3` Real-time KaTeX LaTeX mathematical formula parser & DOMPurify sanitization pipeline — **3 SP**

### WBS-1453: Workstream 4 — Timed Clinical Examination Runner & Radar Mastery Analytics
* **WBS Code:** `1.91.4.0` | **Total Effort:** 21 Story Points (120 Person-Hours)
* **Work Packages:**
  - `1.91.4.1` Timed exam runner state machine, distractor strikethrough & bookmarking (`QuizRunner.tsx`) — **8 SP**
  - `1.91.4.2` High-yield USMLE / NMC CBME clinical vignette question bank (`clinicalExamQuestions.ts`) — **8 SP**
  - `1.91.4.3` Multi-axis Bloom's taxonomy Radar Chart competency mastery visualization (`ExamSummaryView.tsx`, `nmcMapping.ts`) — **5 SP**

### WBS-1454: Workstream 5 — Role-Based Medical Curriculum CMS Review Engine
* **WBS Code:** `1.91.5.0` | **Total Effort:** 13 Story Points (80 Person-Hours)
* **Work Packages:**
  - `1.91.5.1` 5-Stage review lifecycle state machine & `CmsReviewController.java` — **5 SP**
  - `1.91.5.2` Content review audit trail repository (`content_reviews` Flyway `V24`) — **3 SP**
  - `1.91.5.3` Reviewer queue dashboard (`/cms`) and WYSIWYG `ContentBlockRenderer` preview (`/cms/[lessonId]`) — **5 SP**

### WBS-1455: Workstream 6 — IMS Global LTI 1.3 Advantage LMS Interoperability
* **WBS Code:** `1.91.6.0` | **Total Effort:** 21 Story Points (120 Person-Hours)
* **Work Packages:**
  - `1.91.6.1` LTI 1.3 Core OIDC third-party launch with RS256 asymmetric JWT verification — **8 SP**
  - `1.91.6.2` Assignment and Grade Services (AGS v2.0) automated score passback engine — **5 SP**
  - `1.91.6.3` Names and Role Provisioning Services (NRPS v2.0) course roster sync — **5 SP**
  - `1.91.6.4` LTI Deep Linking (DL v2.0) 3D model & simulation lab content picker — **3 SP**
"""
        if "# 91.10 Mediverse Core Engineering" not in chapter_map[91]:
            chapter_map[91] = insert_before_end(chapter_map[91], chap91_addition)

    # Reassemble complete WBS.md
    output_parts = [chapter_map[i] for i in sorted(chapter_map.keys())]
    final_wbs = "\n".join(output_parts)

    print(f"Final WBS.md length: {len(final_wbs)} characters across {len(output_parts)} chapters.")
    with open('docs/WBS.md', 'w', encoding='utf-8') as f:
        f.write(final_wbs)
    print("Successfully updated docs/WBS.md with all deduplications and workstream work packages!")

if __name__ == '__main__':
    main()
