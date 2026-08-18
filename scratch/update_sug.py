import re
import os

def read_sug():
    with open('docs/SUG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_sug()

    # Split into introductory banner + 65 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in SUG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 65)")

    # 1. Enrich Chapter 20 (3D WebGL Dissection & Landmark Navigation)
    chapter_map[20] = r"""
### Chapter 20: 3D WebGL Multi-Organ Dissection & Landmark Navigation Manual

**Student Step-by-Step Instructions:**
* **Viewport Navigation (`ThreeCanvas.tsx`):**
  - **Rotate / Orbit:** Left-click and drag (or single-finger drag on touchscreens) to rotate the 3D organ 360 degrees.
  - **Pan:** Right-click and drag (or two-finger drag) to reposition the model in the canvas.
  - **Zoom:** Scroll mouse wheel (or pinch to zoom) to inspect microscopic tissue structures.
* **Cross-Sectional Dissection:**
  - Open the **Dissection Tool** panel in the bottom toolbar.
  - Adjust the **Sagittal**, **Coronal**, or **Transverse** plane sliders (`DissectionShader.ts`) to slice open solid organs, revealing internal cardiac ventricles, renal medullary pyramids, or alveolar capillaries with solid stencil capping.
* **Interactive Landmark Beacons (`OrganPresets.ts`):**
  - Click on any glowing landmark pin (e.g. Sinoatrial Node, Glomerulus, Gastric Parietal Cells) to open a clinical diagnostic popover detailing physiological action potential conduction and cellular transport mechanisms.

**Pedagogical Guidance & Best Practices:**
* Use cross-sectional slicing while following lectures to bridge gross anatomical topology with microscopic physiological function.
"""

    # 2. Enrich Chapter 26 (Interactive Physiological Simulation Laboratories)
    chapter_map[26] = r"""
### Chapter 26: Interactive Physiological Simulation Laboratories Discovery Guide

**Student Step-by-Step Instructions:**
* **Cardiac Hemodynamics Lab (`/simulators/cardiac-cycle`):**
  - Adjust sliders for **Contractility ($E_{max}$)**, **Afterload (SVR)**, and **Heart Rate**.
  - Observe instantaneous shifts in the Pressure-Volume ($PV$) loop, End-Systolic Pressure-Volume Relationship (ESPVR), Stroke Volume, and Wiggers curves in real time ($< 1.0\text{ms}$ calculation latency via `cardiacSolver.ts`).
* **Acid-Base & Davenport Nomogram Lab (`/simulators/acid-base`):**
  - Adjust $\text{PaCO}_2$ and $[\text{HCO}_3^-]$ sliders across the interactive Davenport diagram.
  - Read automated diagnostic classifications (Metabolic Acidosis, Respiratory Alkalosis, Mixed Disorders) with automated Winter's formula respiratory compensation validation (`acidBaseSolver.ts`).
* **Renal Microvascular Filtration Lab (`/simulators/renal-filtration`):**
  - Adjust Afferent vs. Efferent arteriolar resistances to observe hydrostatic and oncotic Starling pressure differentials affecting Glomerular Filtration Rate (GFR) and filtration fraction (`renalSolver.ts`).
* **Nerve Electrophysiology Lab (`/simulators/nerve-muscle`):**
  - Adjust extracellular $[K^+]$, $[Na^+]$, and $[Cl^-]$ to compute resting membrane potential using the Goldman-Hodgkin-Katz equation (`membraneSolver.ts`).

**Pedagogical Guidance & Best Practices:**
* Formulate hypotheses before moving sliders (e.g. *"What happens to Stroke Volume if afterload increases while contractility is constant?"*) to develop clinical diagnostic intuition.
"""

    # 3. Enrich Chapter 35 (24/7 Socratic AI Study Companion)
    chapter_map[35] = r"""
### Chapter 35: 24/7 Socratic AI Study Companion & LaTeX Formula Guide

**Student Step-by-Step Instructions:**
* **Opening the Assistant (`GlobalSocraticAssistant.tsx`):**
  - Click the floating neural assistant icon in the bottom-right corner of any screen to open the slide-over Socratic chat drawer.
  - The AI tutor automatically detects your current lesson or simulation context (e.g. Cardiovascular, Acid-Base, Renal).
* **Asking Socratic Questions:**
  - Type questions in natural language: *"Why does aortic stenosis lead to concentric left ventricular hypertrophy?"*
  - The AI responds with guided scaffolding questions and explanations grounded in standard medical textbooks (Guyton & Hall Textbook of Medical Physiology, Costanzo Physiology).
* **Interpreting Mathematical & Biochemical Formulas:**
  - Physiological equations are rendered in crisp, formatted LaTeX via KaTeX (e.g. $pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$).

**Pedagogical Guidance & Best Practices:**
* Use the Socratic tutor whenever you are stuck on a difficult physiological feedback loop rather than looking up direct answers.
"""

    # 4. Enrich Chapter 40 (Timed Clinical Board Exam Taking & Radar Mastery)
    chapter_map[40] = r"""
### Chapter 40: Timed Clinical Board Exam Taking & Competency Radar Mastery Manual

**Student Step-by-Step Instructions:**
* **Exam Interface (`QuizRunner.tsx` at `/exam`):**
  - **Live Countdown Timer:** Track remaining exam time in the persistent top bar.
  - **Distractor Strikeout Tool:** Click the strikethrough button (or right-click an option) to visually eliminate incorrect multiple-choice options.
  - **Question Flagging:** Bookmark difficult vignettes to revisit before final submission.
  - **Question Grid Navigator:** Slide open the question grid to jump directly to flagged or unanswered questions.
* **Post-Exam Review & Rationales (`clinicalExamQuestions.ts`):**
  - Review detailed distractor rationales explaining why your selected choice was correct/incorrect and the pathophysiological mechanism behind each distractor.
* **Competency Radar Mastery Breakdown (`ExamSummaryView.tsx`, `nmcMapping.ts`):**
  - Inspect your personalized multi-axis Bloom's taxonomy Radar Chart to evaluate mastery across all 11 NMC CBME physiological organ systems (`PY1.1` to `PY11.14`).

**Pedagogical Guidance & Best Practices:**
* Prioritize reviewing competencies where your radar chart score falls below $70\%$ before high-stakes institutional examinations.
"""

    # 5. Enrich Chapter 50 (PWA Offline Mobile Study & Flashcard Sync)
    chapter_map[50] = r"""
### Chapter 50: PWA Offline Mobile Study & Spaced Repetition Sync

**Student Step-by-Step Instructions:**
* **Installing the Progressive Web App (PWA):**
  - **iOS:** Open Safari, tap the Share button, and select **'Add to Home Screen'**.
  - **Android:** Open Chrome, tap the menu, and select **'Install Mediverse'**.
* **Offline Study Mode:**
  - Downloaded 3D models, simulation presets, and flashcards remain fully functional offline via IndexedDB local caching.
* **SuperMemo SM-2 Spaced Repetition:**
  - Flashcard reviews completed on mobile during transit automatically synchronize with the central PostgreSQL database once network connectivity is restored.

**Pedagogical Guidance & Best Practices:**
* Complete daily 10-minute spaced repetition reviews to lock high-yield physiological constants and clinical correlations into long-term memory.
"""

    # Reassemble complete SUG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_sug = "\n\n---\n\n".join(output_parts)
    print(f"Final SUG.md length: {len(final_sug)} characters across 65 chapters.")

    with open('docs/SUG.md', 'w', encoding='utf-8') as f:
        f.write(final_sug)
    print("Successfully updated docs/SUG.md with all student user manuals!")

if __name__ == '__main__':
    main()
