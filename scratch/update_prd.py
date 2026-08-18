import re
import os

def read_prd():
    with open('docs/PRD.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=(\*\*)?End of Chapter|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def main():
    text = read_prd()

    # Split into sections
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed blocks in PRD.md: {len(chapters)}")

    header = chapters[0]

    # Map sections by chapter number
    # Note: Chapter 13 has two blocks (index 13 and index 14)
    chapter_dict = {}
    for c in chapters[1:]:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            if num not in chapter_dict:
                chapter_dict[num] = [c]
            else:
                chapter_dict[num].append(c)

    print(f"Unique chapter numbers found: {len(chapter_dict)} (expected 20)")

    # 1. Unify Chapter 13 (merge Part 1 and Part 2)
    if 13 in chapter_dict:
        parts_13 = chapter_dict[13]
        if len(parts_13) > 1:
            p1 = parts_13[0]
            p2 = parts_13[1]
            # Remove "End of Chapter 13 Part 1" and header of Part 2
            p1_clean = re.sub(r'\n---+\s*\n\s*\*\*End of Chapter 13[^\n]*\*\*', '', p1).strip()
            p2_clean = re.sub(r'^#+\s+Chapter\s+13[^\n]*\n+---+\s*\n+', '', p2).strip()
            unified_13 = p1_clean + "\n\n---\n\n" + p2_clean
            chapter_dict[13] = [unified_13]

    # 2. Enrich Chapter 12 (Core Simulation Solvers & 3D Multi-Organ Feature Matrix)
    chap12_addition = r"""
---

# 12.10 Core Physiological Simulation Solvers & 3D Multi-Organ Feature Matrix

| Feature Domain | Target Mathematical Equations & Physiological Models | Live Platform Implementation |
|---|---|---|
| **Cardiovascular Simulation** | Suga-Sagawa left ventricular elastance $E(t) = \frac{P(t)}{V(t) - V_0}$, ESPVR/EDPVR, Stroke Volume, and Pressure-Volume loop generation | `cardiacSolver.ts` (`/simulators/cardiac-cycle`) |
| **Acid-Base Nomogram** | Henderson-Hasselbalch $pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$, Winter's formula, Davenport buffer slopes, automated ABG diagnosis | `acidBaseSolver.ts` (`/simulators/acid-base`) |
| **Renal Filtration Engine** | Glomerular Starling microvascular filtration $\text{GFR} = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$, FeNa, clearance | `renalSolver.ts` (`/simulators/renal-filtration`) |
| **Nerve-Muscle Electrophysiology** | Goldman-Hodgkin-Katz resting membrane potential & Hodgkin-Huxley action potential kinetics | `membraneSolver.ts` (`/simulators/nerve-muscle`) |
| **3D Multi-Organ WebGL Canvas** | Three.js WebGL2 multi-organ viewport with GLSL cross-sectional clipping planes and anatomical landmark presets | `ThreeCanvas.tsx`, `OrganPresets.ts`, `DissectionShader.ts` |
"""
    if 12 in chapter_dict:
        if "# 12.10 Core Physiological" not in chapter_dict[12][0]:
            chapter_dict[12][0] = insert_before_end(chapter_dict[12][0], chap12_addition)

    # 3. Enrich Unified Chapter 13 (Detailed Functional Requirements FR-SIM, FR-CMS, FR-AI, FR-EXAM, FR-LTI)
    chap13_addition = r"""
---

# 13.21 Physiological Simulation Solvers (FR-SIM)

* **FR-SIM-001 (Cardiovascular $PV$-Loop Solver):** The platform shall compute instantaneous ventricular pressure-volume curves in $< 1.0\text{ms}$ using time-varying elastance $E(t)$, outputting Stroke Volume, Cardiac Output, and Ejection Fraction based on user-adjusted preload, afterload, and inotropy sliders (`cardiacSolver.ts`).
* **FR-SIM-002 (Acid-Base & Davenport Solver):** The platform shall calculate arterial blood gas parameters via the Henderson-Hasselbalch equation ($pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$), evaluate respiratory compensation via Winter's formula, and classify disorders on the interactive Davenport nomogram (`acidBaseSolver.ts`).
* **FR-SIM-003 (Renal Filtration Solver):** The platform shall solve glomerular Starling forces ($\text{GFR} = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$) and calculate Fractional Excretion of Sodium (FeNa) in response to afferent/efferent resistance perturbations (`renalSolver.ts`).
* **FR-SIM-004 (Nerve Membrane Potential Solver):** The platform shall calculate resting membrane potential via the Goldman-Hodgkin-Katz equation and simulate action potential propagation across varying ionic concentrations (`membraneSolver.ts`).

---

# 13.22 Role-Based CMS Curriculum Review Engine (FR-CMS)

* **FR-CMS-001 (5-Stage Review State Machine):** The platform shall enforce a 5-stage lifecycle for curriculum modules: `[ DRAFT ]` ──► `[ IN_REVIEW ]` ──► `[ APPROVED ]` ──► `[ PUBLISHED ]` (or `[ REJECTED ]` ──► `[ DRAFT ]`).
* **FR-CMS-002 (Role-Based Authorization):** The platform shall restrict review and publishing actions to authenticated users possessing `MEDICAL_REVIEWER`, `FACULTY`, or `EDITOR` roles (`CmsReviewController.java`).
* **FR-CMS-003 (Immutable Audit Trail):** The platform shall record reviewer user IDs, decision statuses, feedback commentary, and lesson version numbers immutably in `curriculum.content_reviews` (`V24__cms_content_review_workflow.sql`).

---

# 13.23 Socratic AI Study Companion & Citation Grounding (FR-AI)

* **FR-AI-001 (Floating Assistant Drawer):** The platform shall provide a persistent floating assistant drawer (`GlobalSocraticAssistant.tsx`) with Server-Sent Events (SSE) token streaming via `POST /api/v1/ai-tutor/chat/stream`.
* **FR-AI-002 (Socratic Scaffolding Prompt):** The AI tutor shall provide scaffolding hints and conceptual explanations rather than direct answers to exam questions.
* **FR-AI-003 (Textbook Citation Grounding):** The AI tutor shall ground $\ge 98\%$ of physiological explanations in standard medical authorities (Guyton & Hall, Costanzo Physiology) using 1536-D dense vector retrieval (`aitutor.embeddings_metadata`).
* **FR-AI-004 (LaTeX Formula Rendering):** The platform shall render mathematical and chemical expressions in clean LaTeX formatting via KaTeX.

---

# 13.24 Timed Clinical Examination Runner & Radar Mastery (FR-EXAM)

* **FR-EXAM-001 (Timed Exam Runner):** The platform shall provide a timed examination runner (`QuizRunner.tsx` at `/exam`) with countdown timer, distractor strikeout tool, question bookmarking, and slide-over question grid.
* **FR-EXAM-002 (Distractor Rationales):** The platform shall provide detailed pathophysiological explanations for correct and incorrect multiple-choice options (`clinicalExamQuestions.ts`).
* **FR-EXAM-003 (Competency Radar Mastery):** The platform shall generate multi-axis Bloom's taxonomy Radar Charts (`ExamSummaryView.tsx`, `nmcMapping.ts`) mapping student mastery across all 11 NMC CBME physiological competencies (`PY1.1` to `PY11.14`).

---

# 13.25 IMS Global LTI 1.3 Advantage Interoperability (FR-LTI)

* **FR-LTI-001 (LTI 1.3 Core OIDC Launch):** The platform shall authenticate university students via LTI 1.3 Core OIDC launch with RS256 JWKS signature verification (`lti.deployments`).
* **FR-LTI-002 (Assignment and Grade Services):** The platform shall automatically synchronize student examination scores to university LMS gradebooks (Canvas, Blackboard, Moodle) via AGS v2.0 (`lti.grade_passbacks`).
* **FR-LTI-003 (Names and Role Provisioning):** The platform shall synchronize course rosters and student cohort enrollments via NRPS v2.0.
"""
    if 13 in chapter_dict:
        if "# 13.21 Physiological Simulation" not in chapter_dict[13][0]:
            chapter_dict[13][0] = insert_before_end(chapter_dict[13][0], chap13_addition)

    # 4. Enrich Chapter 14 (Quantitative Performance SLAs)
    chap14_addition = r"""
---

# 14.10 Quantitative Performance SLAs & Reliability Benchmarks

| Service Domain | Service Level Indicator (SLI) | Target SLA / SLO | Measurement Tool |
|---|---|---|---|
| **Platform Availability** | Successful HTTP Requests / Total Requests | **$\ge 99.95\%$ Uptime** ($< 21.6\text{ min}$ downtime/mo) | Synthetic multi-region uptime probes |
| **Simulation Math Solvers** | End-to-end latency on `POST /api/v1/simulations/calculate` | **P95 $< 15\text{ms}$, P99 $< 50\text{ms}$** | Spring Boot Actuator + OpenTelemetry |
| **3D WebGL Canvas Viewport** | Time-to-Interactive (TTI) for organ render | **P95 $< 1.5\text{ seconds}$** | Lighthouse CI + Real User Monitoring (RUM) |
| **Socratic AI Streaming** | First-token latency on `POST /api/v1/ai-tutor/chat/stream` | **P95 $< 800\text{ms}$** | SSE Client Telemetry |
| **Disaster Recovery** | Recovery Point Objective (RPO) / Recovery Time Objective (RTO) | **RPO $\le 5\text{ min}$, RTO $\le 30\text{ min}$** | AWS Multi-AZ PITR + Warm Standby |
"""
    if 14 in chapter_dict:
        if "# 14.10 Quantitative Performance" not in chapter_dict[14][0]:
            chapter_dict[14][0] = insert_before_end(chapter_dict[14][0], chap14_addition)

    # Reassemble complete PRD.md
    output_parts = [header.strip()]
    for i in sorted(chapter_dict.keys()):
        for part in chapter_dict[i]:
            output_parts.append(part.strip())

    final_prd = "\n\n---\n\n".join(output_parts)
    print(f"Final PRD.md length: {len(final_prd)} characters across {len(chapter_dict)} unified chapters.")

    with open('docs/PRD.md', 'w', encoding='utf-8') as f:
        f.write(final_prd)
    print("Successfully updated docs/PRD.md with all functional requirements and SLAs!")

if __name__ == '__main__':
    main()
