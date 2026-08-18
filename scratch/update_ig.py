import re
import os

def read_ig():
    with open('docs/IG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_ig()

    # Split into introductory banner + 100 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in IG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 100)")

    # 1. Enrich Chapter 7 (Domain-Driven Modular Monolith Architecture)
    chapter_map[7] = r"""
### Chapter 7: Domain-Driven Modular Monolith Architecture Standard

**Source Documents:** SAD, TDD, ADR-002

**Implementation Details & Engineering Blueprint:**
* Mediverse standardizes on a high-performance **Domain-Driven Modular Monolith** in Spring Boot 3.4.1 on Java 21 LTS (`com.curiolearn.*`), avoiding distributed microservice latency:
  ```text
  com.curiolearn
  ├── auth         -> Identity, JWT tokens, Spring Security @PreAuthorize, Tenants
  ├── curriculum   -> Organ systems, topics, lessons, 5-stage CMS review state machine
  ├── simulation   -> Physiological differential equation solvers & REST calculation API
  ├── aitutor      -> Spring AI, Socratic SSE token streaming, pgvector dense retrieval
  ├── quiz         -> Clinical vignette question bank, exam runner, NMC CBME radar mastery
  ├── progress     -> Lesson completion tracking, SuperMemo SM-2 spaced repetition
  └── admin        -> Multi-tenancy management, SCIM 2.0 directory sync, LTI 1.3 Advantage
  ```

**Concrete Technical Implementation Standards:**
* In-memory service calls between bounded contexts ensure sub-millisecond calculation verification.
* Method-level authorization enforced via Spring Security `@PreAuthorize` across all domain controllers.
"""

    # 2. Enrich Chapter 25 (3D WebGL Multi-Organ Graphics Engine)
    chapter_map[25] = r"""
### Chapter 25: 3D WebGL Multi-Organ Graphics Engine & GLSL Dissection Implementation

**Source Documents:** FDS, CSDG, TDD

**Implementation Details & Engineering Blueprint:**
* **Canvas Component (`ThreeCanvas.tsx`):** Three.js WebGL2 canvas with OrbitControls, directional lighting, and perspective cameras.
* **GLSL Dissection Shaders (`DissectionShader.ts`):** Real-time sagittal, coronal, and transverse clipping planes with stencil buffer capping.
* **Organ Landmark Presets (`OrganPresets.ts`):** Interactive landmark beacons with diagnostic popovers across 6 organ systems (Cardiovascular, Respiratory, Renal, Neuro, GI, Endocrine).
* **GPU Memory Disposal (`useThreeMemoryCleanup.ts`):** Mandatory unmount hook executing `renderer.dispose()`, `geometry.dispose()`, and `material.dispose()` to eliminate browser VRAM memory leaks.
"""

    # 3. Enrich Chapter 35 (Physiological Simulation Differential Solvers)
    chapter_map[35] = r"""
### Chapter 35: Mathematical Physiology Simulation Solvers Implementation

**Source Documents:** TDD, ADS, SAD

**Implementation Details & Engineering Blueprint:**
* **Cardiac Cycle Solver (`cardiacSolver.ts`):** Left ventricular time-varying elastance $E(t)$, ESPVR/EDPVR, Stroke Volume, and Ejection Fraction.
* **Acid-Base Nomogram Solver (`acidBaseSolver.ts`):** Henderson-Hasselbalch equation ($pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$), Anion Gap, Winter's formula, and Davenport buffer slopes.
* **Renal Filtration Solver (`renalSolver.ts`):** Glomerular capillary filtration rate ($\text{GFR} = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$), FeNa, and inulin clearance.
* **Nerve Electrophysiology Solver (`membraneSolver.ts`):** Goldman-Hodgkin-Katz resting membrane potential.
* **Backend REST API (`SimulationApiController.java`):** Calculation verification endpoint (`POST /api/v1/simulations/calculate`) executing in $< 1.0\text{ms}$.
"""

    # 4. Enrich Chapter 45 (Socratic AI SSE Streaming Pipeline & KaTeX)
    chapter_map[45] = r"""
### Chapter 45: Socratic AI Server-Sent Events (SSE) Streaming & KaTeX Rendering

**Source Documents:** ADS, TDD, SecDD

**Implementation Details & Engineering Blueprint:**
* **Backend Streaming Controller (`AITutorApiController.java`):** `POST /api/v1/ai-tutor/chat/stream` producing `MediaType.TEXT_EVENT_STREAM_VALUE` with Socratic prompt sandboxing.
* **Frontend Hook & UI (`useSocraticChatStream.ts`, `GlobalSocraticAssistant.tsx`):** Persistent floating drawer consuming token chunks with route-aware context auto-detection.
* **LaTeX Formula Rendering:** Safe client-side parsing of mathematical and biochemical formulas via `rehype-katex`, `remark-math`, and DOMPurify XSS sanitization.
"""

    # 5. Enrich Chapter 55 (Role-Based CMS Review Engine Implementation)
    chapter_map[55] = r"""
### Chapter 55: Role-Based Medical Curriculum CMS Review Engine Implementation

**Source Documents:** SAD, TDD, DDD

**Implementation Details & Engineering Blueprint:**
* **5-Stage Review State Machine:** `[ DRAFT ]` ──► `[ IN_REVIEW ]` ──► `[ APPROVED ]` ──► `[ PUBLISHED ]` (or `[ REJECTED ]` ──► `[ DRAFT ]`).
* **Backend Controller (`CmsReviewController.java`):** Spring Security authorization `@PreAuthorize("hasAnyRole('MEDICAL_REVIEWER', 'FACULTY', 'EDITOR')")`.
* **Audit Trail Persistence:** Rejection comments and approval timestamps logged immutably in `curriculum.content_reviews` (`V24__cms_content_review_workflow.sql`).
* **WYSIWYG Evaluation (`/cms/[lessonId]`):** `ContentBlockRenderer` previewing live Markdown, KaTeX formulas, and clinical case vignettes.
"""

    # 6. Enrich Chapter 65 (Timed Clinical Exam Runner & NMC CBME Radar Mastery)
    chapter_map[65] = r"""
### Chapter 65: Timed Clinical Examination Runner & Radar Mastery Analytics

**Source Documents:** FDS, TDD, SRS

**Implementation Details & Engineering Blueprint:**
* **Timed Exam Runner (`QuizRunner.tsx`):** Mounted at `/exam` with countdown timer, distractor strikethrough tool, question bookmarking, and slide-over question navigator.
* **Clinical Vignette Bank (`clinicalExamQuestions.ts`):** High-yield USMLE / NMC CBME clinical vignette questions with comprehensive distractor rationales.
* **Competency Radar Analytics (`ExamSummaryView.tsx`, `nmcMapping.ts`):** Multi-axis Bloom's taxonomy Radar Chart mastery breakdown mapped to NMC CBME competency codes (`PY1.1` to `PY11.14`).
"""

    # Reassemble complete IG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_ig = "\n\n---\n\n".join(output_parts)
    print(f"Final IG.md length: {len(final_ig)} characters across 100 chapters.")

    with open('docs/IG.md', 'w', encoding='utf-8') as f:
        f.write(final_ig)
    print("Successfully updated docs/IG.md with all implementation blueprints!")

if __name__ == '__main__':
    main()
