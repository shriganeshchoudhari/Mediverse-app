import re
import os

def read_ag():
    with open('docs/AG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def main():
    text = read_ag()

    # Split into introductory banner + 75 chapters
    parts = re.split(r'(?=\n###\s+Chapter\s+\d+:)', text)
    print(f"Total parts parsed in AG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts[1:]:
        m = re.search(r'###\s+Chapter\s+(\d+):\s+([^\n]+)', p)
        if m:
            num = int(m.group(1))
            chapter_map[num] = p

    print(f"Unique chapters found: {len(chapter_map)} (expected 75)")

    # 1. Enrich Chapter 2 (Administrative Personas & RBAC)
    chapter_map[2] = r"""
### Chapter 2: Administrative Personas & RBAC Authorization Matrix

**Administrative Procedure & Policy:**
* **Super Admin (`ROLE_ADMIN`):** Full platform control, institutional tenant onboarding, global system telemetry, exam bank governance.
* **Tenant Admin (`ROLE_ADMIN`):** University IT administrator managing student rosters, SAML/OIDC SSO, and LTI 1.3 Advantage deployments within their institution.
* **Medical Reviewer / Editor (`ROLE_MEDICAL_REVIEWER`, `ROLE_EDITOR`):** Medical education board members evaluating pending curriculum lessons, approving/rejecting submissions in the CMS review queue (`/cms`), and auditing version histories.
* **Faculty Content Writer (`ROLE_FACULTY`):** Medical professors authoring curriculum lessons, drafting clinical case vignettes, and submitting content for peer review.
* **Student Learner (`ROLE_STUDENT`):** Medical students accessing 3D organ dissection, interactive simulation solvers, timed board exams, and Socratic AI tutoring.

**Institutional Governance & Security Controls:**
* Method-level authorization enforced via Spring Security `@PreAuthorize` across all domain REST controllers.
* Immutable audit trail logging all role modifications and administrative actions in the `audit_logs` table.
"""

    # 2. Enrich Chapter 21 (Content Management & 5-Stage Review Lifecycle)
    chapter_map[21] = r"""
### Chapter 21: Medical Curriculum Content Management & Review Lifecycle

**Administrative Procedure & Policy:**
* Mediverse enforces a strict **5-stage peer-review state machine** for all curriculum lessons:
  `[ DRAFT ]` ──(submitForReview)──► `[ IN_REVIEW ]` ──► `[ APPROVED ]` ──► `[ PUBLISHED ]` (or `[ REJECTED ]` ──► `[ DRAFT ]`).
* Content Writers submit drafts to the central review queue. Medical Reviewers evaluate lessons at `/cms` before approving for publication.
* All decisions generate immutable audit records in the `content_reviews` table (`V24__cms_content_review_workflow.sql`).

**Operational REST Commands:**
* List pending lessons: `GET /api/v1/cms/lessons?status=IN_REVIEW`
* Submit draft for review: `POST /api/v1/cms/lessons/{lessonId}/submit`
* Approve/Reject lesson: `POST /api/v1/cms/lessons/{lessonId}/review` with `{"decision": "APPROVED", "comments": "Peer-reviewed and verified against NMC CBME."}`
"""

    # 3. Enrich Chapter 22 (Reviewing & Approving Lessons in the CMS)
    chapter_map[22] = r"""
### Chapter 22: Operating the CMS Review Queue & WYSIWYG Evaluation

**Administrative Procedure & Policy:**
* Navigate to `https://mediverse.edu/cms` and select the **"In Review"** tab.
* Click on any pending lesson to open the WYSIWYG evaluation interface (`/cms/[lessonId]`).
* Inspect rendered Markdown content, LaTeX mathematical equations, and clinical case vignettes rendered by `ContentBlockRenderer`.
* Click **"Approve"** to transition the lesson to `APPROVED` / `PUBLISHED`, or click **"Reject"** and provide mandatory pedagogical feedback comments.

**Institutional Governance & Security Controls:**
* Rejection feedback is mandatory; empty rejection submissions are blocked by backend validation (`CmsReviewService.java`).
* Reviewers must possess `ROLE_MEDICAL_REVIEWER`, `ROLE_FACULTY`, or `ROLE_EDITOR` credentials.
"""

    # 4. Enrich Chapter 26 (Clinical Vignette Question Bank Administration)
    chapter_map[26] = r"""
### Chapter 26: Clinical Vignette Question Bank & USMLE/NMC CBME Governance

**Administrative Procedure & Policy:**
* Clinical assessment items must adhere to standard USMLE Step 1 / NMC CBME vignette structure: patient history, physical examination, diagnostic lab findings, and 4–5 single-best-answer distractors.
* Manage questions in the central repository (`clinicalExamQuestions.ts` and `quiz_questions` database table).
* Every question must include comprehensive rationale explanations for both the correct answer and all incorrect distractors.

**Institutional Governance & Security Controls:**
* All questions require dual-faculty peer review before activation in student board examination pools.
"""

    # 5. Enrich Chapter 27 (NMC CBME Competency & Bloom's Taxonomy Tagging)
    chapter_map[27] = r"""
### Chapter 27: NMC CBME Competency & Bloom's Taxonomy Mapping

**Administrative Procedure & Policy:**
* Tag every curriculum lesson and clinical question with standardized National Medical Commission competency codes:
  - `PY1.1`–`PY1.9`: General Physiology & Cellular Transport
  - `PY2.1`–`PY2.13`: Hematology & Immunology
  - `PY3.1`–`PY3.18`: Nerve-Muscle Physiology
  - `PY4.1`–`PY4.10`: Gastrointestinal System
  - `PY5.1`–`PY5.14`: Cardiovascular System
  - `PY6.1`–`PY6.10`: Respiratory System
  - `PY7.1`–`PY7.9`: Renal Physiology & Acid-Base Balance
  - `PY8.1`–`PY8.6`: Endocrine System
  - `PY9.1`–`PY9.12`: Reproductive System
  - `PY10.1`–`PY10.20`: Neurophysiology & Special Senses
* Tag Bloom's cognitive taxonomy levels (Recall, Comprehension, Application, Analysis) to drive the interactive Radar Chart mastery analytics (`ExamSummaryView.tsx`, `nmcMapping.ts`).
"""

    # 6. Enrich Chapter 31 (3D WebGL Organ Preset Administration)
    chapter_map[31] = r"""
### Chapter 31: 3D WebGL Multi-Organ Presets & Anatomical Landmark Administration

**Administrative Procedure & Policy:**
* Manage 3D anatomical organ models and landmark beacon metadata in `OrganPresets.ts`:
  - Cardiovascular (Left Ventricle, Aortic Valve, SA Node, Interventricular Septum)
  - Respiratory (Main Bronchus, Alveolar Sac, Pulmonary Capillary, Diaphragm)
  - Renal (Glomerulus, Bowman's Capsule, Proximal Convoluted Tubule, Loop of Henle)
  - Neurophysiology (Axon Hillock, Myelin Sheath, Synaptic Cleft)
  - Gastrointestinal (Gastric Parietal Cell, Villi, Crypt of Lieberkuhn)
  - Endocrine (Pancreatic Beta Cell, Adrenal Cortex, Thyroid Follicle)
* Configure default camera position vectors, zoom limits, and clinical correlation diagnostic popover text.

**Institutional Governance & Security Controls:**
* Ensure all 3D canvas components bind to `useThreeMemoryCleanup.ts` to execute `renderer.dispose()` and prevent client VRAM memory leaks.
"""

    # 7. Enrich Chapter 36 (Physiological Simulation Solvers Calibration)
    chapter_map[36] = r"""
### Chapter 36: Real-Time Physiological Simulation Solvers Calibration

**Administrative Procedure & Policy:**
* Calibrate mathematical differential equation solvers to maintain clinical fidelity across physiological extremes:
  - **Cardiac Suga-Sagawa Solver (`cardiacSolver.ts`):** Left ventricular time-varying elastance $E(t)$, ESPVR, EDPVR, Stroke Volume, and Ejection Fraction.
  - **Acid-Base Davenport Solver (`acidBaseSolver.ts`):** Henderson-Hasselbalch solver ($pH = 6.1 + \log_{10}\frac{[\text{HCO}_3^-]}{0.03 \cdot \text{PaCO}_2}$), Anion Gap, Winter's formula, and Davenport buffer lines.
  - **Renal Starling Solver (`renalSolver.ts`):** Glomerular filtration rate ($\text{GFR} = K_f \cdot [(P_{gc} - P_{bs}) - (\pi_{gc} - \pi_{bs})]$), Inulin/Creatinine clearance, and fractional sodium excretion ($\text{FeNa}$).
  - **Electrophysiology Solver (`membraneSolver.ts`):** Goldman-Hodgkin-Katz membrane voltage equation.
* Verify calculation API latency ($< 1.0\text{ms}$) via `SimulationApiController.java` (`POST /api/v1/simulations/calculate`).
"""

    # 8. Enrich Chapter 41 (Socratic AI Prompt Sandboxing & Governance)
    chapter_map[41] = r"""
### Chapter 41: Socratic AI Companion Prompt Sandboxing & Safety Governance

**Administrative Procedure & Policy:**
* Configure the Socratic AI system prompt in `AITutorService.java` to enforce Socratic inquiry rather than providing direct exam answers.
* Mandate reference textbook citation grounding (Guyton & Hall Textbook of Medical Physiology, Costanzo Physiology).
* Enforce clinical emergency triage guardrails: automated refusal of live-patient diagnostic inquiries with medical emergency disclaimers.

**Operational Telemetry & Rate Limits:**
* Stream Socratic tokens via Server-Sent Events (`POST /api/v1/ai-tutor/chat/stream`).
* Configure per-student token quotas (30 requests/minute) managed via Redis token buckets.
"""

    # 9. Enrich Chapter 65 (IMS Global LTI 1.3 Advantage Deployment)
    chapter_map[65] = r"""
### Chapter 65: IMS Global LTI 1.3 Advantage LMS Registration & Key Rotation

**Administrative Procedure & Policy:**
* Register institutional LMS deployments (Canvas, Blackboard, Moodle, Brightspace):
  - Generate Platform Client ID, Deployment ID, and OIDC Authorization Endpoint.
  - Public Key Set URL (JWKS): `https://mediverse.edu/.well-known/jwks.json` using RS256 asymmetric keys.
* Enable Assignment and Grade Services (AGS v2.0) for automated grade passback from Mediverse clinical exams into university gradebooks.
* Enable Names and Role Provisioning Services (NRPS v2.0) for automated student roster and course enrollment synchronization.
* Enable LTI Deep Linking (DL v2.0) allowing professors to embed specific 3D dissection presets or simulation labs into LMS course modules.
"""

    # Reassemble complete AG.md
    output_parts = [header.strip()]
    for i in sorted(chapter_map.keys()):
        output_parts.append(chapter_map[i].strip())

    final_ag = "\n\n---\n\n".join(output_parts)
    print(f"Final AG.md length: {len(final_ag)} characters across 75 chapters.")

    with open('docs/AG.md', 'w', encoding='utf-8') as f:
        f.write(final_ag)
    print("Successfully updated docs/AG.md with all operational admin procedures!")

if __name__ == '__main__':
    main()
