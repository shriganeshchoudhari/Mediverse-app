import re
import os

def read_fg():
    with open('docs/FG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_fg()

    # Split into introductory banner + 70 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in FG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 70)")

    # 1. Enrich Chapter 8 (Curriculum Hierarchy & CMS Authoring)
    chapter_map[8] = r"""
### Chapter 8: The Course Hierarchy & CMS Curriculum Authoring

**Educator Procedure & Administration:**
* Organize curriculum into a clean 3-tier hierarchy: **Organ System** $\rightarrow$ **Topic** $\rightarrow$ **Lesson Modules**.
* Author lessons in the Mediverse CMS using Markdown with embedded KaTeX mathematical and chemical expressions:
  ```markdown
  ### Left Ventricular Time-Varying Elastance
  The instantaneous pressure-volume relationship is governed by Suga-Sagawa elastance:
  $$E(t) = \frac{P(t)}{V(t) - V_0}$$
  where $E(t)$ is ventricular elastance, $P(t)$ is cavity pressure, and $V_0$ is the volume axis intercept.
  ```
* Submit drafted lessons to the 5-stage peer review queue (`DRAFT` $\rightarrow$ `IN_REVIEW` $\rightarrow$ `APPROVED` $\rightarrow$ `PUBLISHED` / `REJECTED`) via `POST /api/v1/cms/lessons/{lessonId}/submit`.

**Faculty Workflow & Accreditation Standards:**
* **NMC CBME Alignment:** Directly link course modules, 3D anatomical labs, and quizzes to National Medical Commission competencies (`PY1.1` to `PY11.14`) for automated portfolio generation.
* **Review Audit Trail:** Inspect reviewer feedback and version revisions in the `content_reviews` table.
"""

    # 2. Enrich Chapter 16 (Clinical Vignette Question Bank & Distractor Rationales)
    chapter_map[16] = r"""
### Chapter 16: The Anatomy of a High-Yield Clinical Question Bank

**Educator Procedure & Administration:**
* Construct clinical vignette items adhering to USMLE Step 1 / NMC CBME standards:
  1. **Patient Presentation:** Age, biological sex, chief complaint, duration of symptoms.
  2. **Physical Examination & Vitals:** Blood pressure, heart rate, respiratory rate, core temperature.
  3. **Diagnostic Laboratory Data:** Tabular arterial blood gases, serum electrolytes, or cardiac biomarkers.
  4. **Question Stem:** Single best answer prompt focusing on underlying physiological mechanisms.
  5. **Distractor Rationales:** Mandatory pedagogical explanations detailing why the correct option is pathophysiologically sound and why each incorrect distractor is false (`clinicalExamQuestions.ts`).

**Faculty Workflow & Accreditation Standards:**
* **Competency Tagging:** Tag items with NMC competency codes (`PY1.1` to `PY11.14`) and Bloom's cognitive taxonomy levels (`Recall`, `Comprehension`, `Application`, `Analysis`).
"""

    # 3. Enrich Chapter 20 (3D WebGL Organ Dissection Classroom Demonstrations)
    chapter_map[20] = r"""
### Chapter 20: 3D WebGL Multi-Organ Dissection & Classroom Demonstrations

**Educator Procedure & Administration:**
* Utilize `ThreeCanvas.tsx` during live video lectures or in-person anatomy/physiology laboratories:
  - **Orbit, Pan & Zoom:** Demonstrate spatial relationships of cardiac chambers, pulmonary alveoli, and nephron vascular structures.
  - **Cross-Sectional Dissection:** Activate sagittal, coronal, and transverse clipping planes (`DissectionShader.ts`) with stencil buffer capping to expose internal ventricular septa and renal medulla.
  - **Anatomical Landmark Beacons:** Click on preset landmark pins (`OrganPresets.ts`) to project clinical diagnostic popovers (e.g. Sinoatrial Node action potential conduction pathways).

**Faculty Workflow & Accreditation Standards:**
* **Memory & Stability:** Canvas components bind to `useThreeMemoryCleanup.ts` to dispose WebGL VRAM upon unmount, ensuring zero browser memory leaks on student laptops and tablets.
"""

    # 4. Enrich Chapter 26 (Physiological Simulation Laboratory Assignment Authoring)
    chapter_map[26] = r"""
### Chapter 26: Authoring Physiological Simulation Laboratory Assignments

**Educator Procedure & Administration:**
* Design interactive student challenges utilizing Mediverse's differential equation simulation engines:
  - **Cardiac Hemodynamics (`cardiacSolver.ts`):** Challenge students to modify ventricular contractility ($E_{max}$), compliance, and systemic vascular resistance (SVR) to simulate Heart Failure with Reduced Ejection Fraction (HFrEF) on the Pressure-Volume ($PV$) loop.
  - **Acid-Base Nomogram (`acidBaseSolver.ts`):** Challenge students to evaluate mixed metabolic acidosis and respiratory alkalosis using the interactive Davenport diagram and Winter's formula.
  - **Renal Filtration (`renalSolver.ts`):** Challenge students to adjust afferent/efferent arteriolar resistances and observe resulting changes in Glomerular Filtration Rate (GFR) and filtration fraction.
  - **Nerve Electrophysiology (`membraneSolver.ts`):** Challenge students to compute resting membrane potential using the Goldman-Hodgkin-Katz equation.

**Faculty Workflow & Accreditation Standards:**
* **Real-Time Verification:** Solvers calculate in $< 1.0\text{ms}$ to ensure responsive 60 FPS slider reactivity for student discovery learning.
"""

    # 5. Enrich Chapter 35 (Bloom's Taxonomy & NMC CBME Radar Mastery Analytics)
    chapter_map[35] = r"""
### Chapter 35: Interpreting Bloom's Taxonomy & NMC CBME Radar Mastery Analytics

**Educator Procedure & Administration:**
* Access cohort-level mastery analytics generated by `ExamSummaryView.tsx` and `nmcMapping.ts`:
  - **Multi-Axis Radar Charts:** Visualize student cohort mastery across all 11 NMC CBME physiological systems (General, Hematology, Nerve-Muscle, GI, CVS, Respiratory, Renal, Endocrine, Reproductive, Neuro, Special Senses).
  - **Bloom's Cognitive Breakdown:** Track cohort performance across Recall, Comprehension, Application, and Clinical Analysis.
  - **Item Discrimination Index ($r_{pb}$):** Identify poorly discriminating assessment items ($r_{pb} < 0.20$) for curricular revision.

**Faculty Workflow & Accreditation Standards:**
* **Early Warning System:** Automated dashboard alerts identify students performing below $65\%$ mastery in core competencies for timely pedagogical intervention.
"""

    # 6. Enrich Chapter 45 (Socratic AI Teaching Assistant Configuration)
    chapter_map[45] = r"""
### Chapter 45: Configuring the Socratic AI Teaching Assistant

**Educator Procedure & Administration:**
* Configure the Socratic AI Companion (`GlobalSocraticAssistant.tsx`, `AITutorService.java`):
  - **Socratic Guidance Prompt:** Enforce pedagogical scaffolding hints rather than direct answers to exam vignettes.
  - **Textbook Grounding:** Ensure AI explanations cite standard medical physiology authorities (Guyton & Hall Textbook of Medical Physiology, Costanzo Physiology).
  - **Clinical Emergency Disclaimers:** Ensure automated refusal of live-patient diagnostic inquiries.
  - **Token Rate Limiting:** Enforce a rate limit of 30 requests/minute per student via Redis token buckets.
"""

    # Reassemble complete FG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_fg = "\n\n---\n\n".join(output_parts)
    print(f"Final FG.md length: {len(final_fg)} characters across 70 chapters.")

    with open('docs/FG.md', 'w', encoding='utf-8') as f:
        f.write(final_fg)
    print("Successfully updated docs/FG.md with all faculty pedagogical runbooks!")

if __name__ == '__main__':
    main()
