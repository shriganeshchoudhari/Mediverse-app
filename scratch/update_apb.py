import re
import os

def read_apb():
    with open('docs/APB.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=#\s+Part\s+[IVXLCDM]+|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def build_chapter_129():
    return r"""# Chapter 129 — Enterprise Clinical Education & Simulation Innovation Lab

**Product Backlog Item IDs:** **PBI-2049 → PBI-2064**

---

# 129.1 Chapter Overview

This chapter establishes the **Enterprise Clinical Education & Simulation Innovation Framework** for the Mediverse platform, detailing product backlog items for advanced physiology virtual laboratory features, collaborative dissection, and adaptive learning algorithms.

# 129.2 Objectives

* Expand interactive multi-organ 3D anatomical models and real-time biomechanical simulation solvers.
* Integrate generative AI case simulation with dynamic physiological patient state progression.
* Provide seamless interoperability with institutional LMS environments via IMS Global LTI 1.3 Advantage.

---

### PBI-2049: Interactive 3D Cardiopulmonary Hemodynamic Coupling
* **As a** Medical Student
* **I want to** observe real-time coupled interactions between ventricular pressure-volume loops and pulmonary capillary gas exchange
* **So that** I can understand the pathophysiological mechanisms of pulmonary edema secondary to congestive heart failure.
* **Story Points:** 8 SP
* **Acceptance Criteria (Gherkin):**
  ```gherkin
  Scenario: Student induces left ventricular systolic dysfunction
    Given the cardiopulmonary simulation lab is running at baseline parameters
    When the student reduces LV contractility (Emax) by 50%
    Then the left atrial pressure (LAP) should increase above 20 mmHg
    And the pulmonary capillary hydrostatic pressure should exceed oncotic pressure, triggering interstitial fluid accumulation markers
  ```

### PBI-2050: Multi-User Collaborative 3D Anatomical Dissection
* **As a** Medical Faculty Instructor
* **I want to** host a shared 3D dissection room where student cursors and clipping planes synchronize in real time
* **So that** I can conduct remote virtual anatomy and physiology laboratory demonstrations.
* **Story Points:** 13 SP
* **Acceptance Criteria:** Real-time WebRTC/WebSocket state sync with $< 50\text{ms}$ latency across up to 50 concurrent student viewports.

### PBI-2051: Dynamic Acid-Base Arterial Blood Gas (ABG) Case Generator
* **As a** Clinical Physiology Learner
* **I want** the system to generate randomized clinical ABG vignettes with Davenport nomogram visualizations
* **So that** I can practice diagnosing complex mixed metabolic and respiratory acid-base disorders.
* **Story Points:** 8 SP
* **Acceptance Criteria:** 100% calculation accuracy against Henderson-Hasselbalch, Winter's formula, and Davenport buffer slopes.

### PBI-2052: Socratic AI Adaptive Question Scaffolding
* **As a** Student struggling with renal physiology concepts
* **I want** the Socratic AI companion to adapt its questioning depth based on my prior quiz performance
* **So that** I receive targeted conceptual hints matching my current knowledge level.
* **Story Points:** 8 SP
* **Acceptance Criteria:** Socratic AI adjusts prompt context using student Bloom's taxonomy mastery radar data.
"""

def main():
    text = read_apb()

    # Split into chapters
    chapters = re.split(r'(?=#+\s+Chapter\s+\d+)', text)
    print(f"Total raw parsed chapters in APB.md: {len(chapters)}")

    chapter_map = {}
    for c in chapters:
        m = re.search(r'#+\s+Chapter\s+(\d+)', c)
        if m:
            num = int(m.group(1))
            # If duplicate, keep longer one
            if num not in chapter_map or len(c) > len(chapter_map[num]):
                chapter_map[num] = c

    # Add missing Chapter 129
    if 129 not in chapter_map:
        print("Restoring missing Chapter 129...")
        chapter_map[129] = build_chapter_129()

    print(f"Unique chapters after deduplication and insertion: {len(chapter_map)} (expected 150)")

    # 1. Enhance Chapter 12 (Gherkin Standards & INVEST Rules)
    if 12 in chapter_map:
        chap12_addition = r"""
---

# 12.10 Mediverse Behavioral Gherkin Acceptance Criteria Standards

### PBI-0185: INVEST User Story Validation Standard
All user stories in the Mediverse product backlog must satisfy the INVEST criteria:
* **Independent:** Minimal cross-story coupling allowing flexible sprint scheduling.
* **Negotiable:** Focus on user outcome rather than rigid technical lock-in.
* **Valuable:** Clear pedagogical or clinical value delivered to students, faculty, or institutional administrators.
* **Estimable:** Sized using the modified Fibonacci scale (1 SP to 21 SP).
* **Small:** Sized to fit comfortably within a single 2-week sprint cycle ($\le 8\text{ SP}$).
* **Testable:** Accompanied by binary, executable Gherkin Given/When/Then acceptance criteria.
"""
        if "# 12.10 Mediverse Behavioral" not in chapter_map[12]:
            chapter_map[12] = insert_before_end(chapter_map[12], chap12_addition)

    # 2. Enhance Chapter 91 (Core Physiology User Story Epics 1–6)
    if 91 in chapter_map:
        chap91_addition = r"""
---

# 91.10 Mediverse Core Physiology User Story Epics (Epics 1–6)

### Epic 1: 3D WebGL Multi-Organ Dissection & Landmark Navigation (21 SP)
* **PBI-1450 (Three.js Orbit & Pan Canvas - 8 SP):**
  * *As a* Medical Student, *I want to* smoothly orbit, pan, and zoom 3D anatomical organ models on mobile and desktop *so that* I can explore anatomical spatial relationships.
* **PBI-1451 (GLSL Dissection Clipping Planes - 5 SP):**
  * *As a* Student, *I want to* slice organs along sagittal, coronal, and transverse axes with stencil buffer capping *so that* I can inspect internal chambers and cross-sections.
* **PBI-1452 (Multi-Organ Landmark Presets - 5 SP):**
  * *As a* Learner, *I want* interactive landmark beacons with clinical diagnostic popovers for 6 organ systems (`OrganPresets.ts`) *so that* I can connect anatomy to clinical pathology.
* **PBI-1453 (WebGL GPU Memory Disposal - 3 SP):**
  * *As a* Mobile User, *I want* WebGL VRAM to dispose automatically upon unmount (`useThreeMemoryCleanup.ts`) *so that* browser tabs remain stable without memory leaks.

### Epic 2: Real-Time Physiological Simulation Solvers (34 SP)
* **PBI-1454 (Suga-Sagawa Cardiac PV-Loop Solver - 8 SP):**
  * *As a* Student, *I want* live sliders for inotropy, compliance, and heart rate to compute PV-loops and Wiggers diagrams dynamically (`cardiacSolver.ts`) *so that* I understand cardiac mechanics.
* **PBI-1455 (Acid-Base Davenport Nomogram Solver - 8 SP):**
  * *As a* Clinical Learner, *I want* live PaCO2 and HCO3- sliders to calculate pH and classify ABG disorders (`acidBaseSolver.ts`) *so that* I master metabolic and respiratory compensation.
* **PBI-1456 (Starling Glomerular Filtration Solver - 8 SP):**
  * *As a* Student, *I want* live arteriolar resistance and oncotic pressure sliders to compute GFR and FeNa (`renalSolver.ts`) *so that* I understand renal clearance.
* **PBI-1457 (GHK Action Potential Solver - 5 SP):**
  * *As a* Learner, *I want* live ionic concentration sliders to compute resting membrane potential and action potential curves (`membraneSolver.ts`).
* **PBI-1458 (Backend Simulation REST Controller - 5 SP):**
  * *As a* Frontend Client, *I want* a high-performance REST calculation endpoint (`SimulationApiController.java`) *so that* server-side verification runs in $< 1.0\text{ms}$.

### Epic 3: Socratic AI Streaming Companion & KaTeX Formula Rendering (13 SP)
* **PBI-1459 (Spring AI SSE Streaming Endpoint - 5 SP):**
  * *As a* Frontend Client, *I want* tokens streamed via Server-Sent Events from `AITutorApiController.java` *so that* AI responses display with zero perceptible latency.
* **PBI-1460 (Floating Socratic Assistant Drawer - 5 SP):**
  * *As a* Student, *I want* a persistent floating button that opens a slide-over drawer with route-aware topic context (`GlobalSocraticAssistant.tsx`).
* **PBI-1461 (Real-Time KaTeX Formula Formatting - 3 SP):**
  * *As a* Student, *I want* mathematical and chemical equations formatted in crisp LaTeX via KaTeX *so that* complex physiological formulas are readable.

### Epic 4: Timed Clinical Board Exam Runner & Radar Mastery Analytics (21 SP)
* **PBI-1462 (Timed Exam Runner State Machine - 8 SP):**
  * *As an* Examinee, *I want* a timed exam runner with countdown timer, distractor strikeout tool, and question flagging (`QuizRunner.tsx`).
* **PBI-1463 (USMLE / NMC CBME Vignette Question Bank - 8 SP):**
  * *As a* Student, *I want* high-yield clinical vignette questions with comprehensive rationales (`clinicalExamQuestions.ts`).
* **PBI-1464 (Bloom's Taxonomy Radar Chart Mastery - 5 SP):**
  * *As a* Student, *I want* an interactive Radar Chart showing my competency breakdown across NMC CBME codes (`ExamSummaryView.tsx`, `nmcMapping.ts`).

### Epic 5: Role-Based Medical Curriculum CMS Review Engine (13 SP)
* **PBI-1465 (5-Stage CMS Review State Machine - 5 SP):**
  * *As a* Content Writer, *I want* to draft and submit lessons to the review queue (`CmsReviewController.java`).
* **PBI-1466 (Content Review Audit History Repository - 3 SP):**
  * *As a* Quality Officer, *I want* all approval and rejection decisions logged in `content_reviews` (`V24`).
* **PBI-1467 (Review Queue & WYSIWYG Preview - 5 SP):**
  * *As a* Medical Reviewer, *I want* to review pending lessons in a WYSIWYG viewer (`/cms/[lessonId]`) with mandatory feedback commentary.

### Epic 6: IMS Global LTI 1.3 Advantage Interoperability (21 SP)
* **PBI-1468 (LTI 1.3 OIDC Core Launch - 8 SP):**
  * *As an* LMS Student, *I want* single sign-on launch directly from Canvas/Moodle via asymmetric RS256 JWT tokens.
* **PBI-1469 (Assignment & Grade Services AGS Passback - 5 SP):**
  * *As a* Professor, *I want* Mediverse quiz scores automatically passed back to our university LMS gradebook.
* **PBI-1470 (Names & Role Provisioning NRPS Roster Sync - 5 SP):**
  * *As an* Instructor, *I want* course rosters synchronized automatically between LMS and Mediverse.
* **PBI-1471 (LTI Deep Linking DL Content Picker - 3 SP):**
  * *As an* Educator, *I want* to embed specific 3D dissection presets and simulation labs into LMS course modules.
"""
        if "# 91.10 Mediverse Core Physiology" not in chapter_map[91]:
            chapter_map[91] = insert_before_end(chapter_map[91], chap91_addition)

    # Reassemble complete APB.md
    output_parts = [chapter_map[i] for i in sorted(chapter_map.keys())]
    final_apb = "\n".join(output_parts)

    print(f"Final APB.md length: {len(final_apb)} characters across {len(output_parts)} chapters.")
    with open('docs/APB.md', 'w', encoding='utf-8') as f:
        f.write(final_apb)
    print("Successfully updated docs/APB.md with all deduplications and user story epics!")

if __name__ == '__main__':
    main()
