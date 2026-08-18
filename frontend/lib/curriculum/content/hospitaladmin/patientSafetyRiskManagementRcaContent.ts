/**
 * Hospital Administration: Patient Safety, Risk Management & Root Cause Analysis (RCA)
 * Authoritative medical content derived from WHO Patient Safety Curriculum, JCI IPSG 1-6, Ishikawa Fishbone RCA.
 * Mapped to NMC CBME Competencies: HA7.1, HA7.2, HA8.1, HA8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PATIENT_SAFETY_RISK_MANAGEMENT_RCA_MODULE: PhysiologyLessonModule = {
  id: "hospital-admin-patient-safety-risk-management-rca",
  unitCode: "HA7.1",
  title: "Patient Safety (IPSG 1-6), Sentinel Events, WHO Surgical Safety Checklist & Root Cause Analysis (Fishbone/RCA)",
  competencies: ["HA7.1", "HA7.2", "HA8.1", "HA8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "COMMUNITY",
  markdownContent: `
# Patient Safety, Risk Management & Root Cause Analysis (RCA)

Patient safety is the prevention of errors and adverse effects to patients associated with healthcare delivery, moving from individual blame to systemic latent error prevention (James Reason\'s Swiss Cheese Model).

---

## 1. The 6 International Patient Safety Goals (IPSG)

| Goal | Title | Mandatory Hospital Implementation Standards | Prohibitions \u0026 Strict Policies |
| :--- | :--- | :--- | :--- |
| **IPSG 1** | **Identify Patients Correctly** | Use at least **TWO independent patient identifiers**: (1) Full Patient Name and (2) Unique Hospital Identification Number (UHID) / Date of Birth. Verify before administering medication, drawing blood, or performing procedures. | **NEVER use the patient's room number or bed number as an identifier!** |
| **IPSG 2** | **Improve Effective Communication** | Mandatory **"Write Down, Read Back, and Confirm" (VOBW - Verbal Order / Critical Value)** policy. The receiver writes down the complete order/value, reads it back word-for-word, and the caller verbally confirms accuracy. | Critical panic laboratory values must be communicated and acknowledged within **$30\\text{ minutes}$**. |
| **IPSG 3** | **Improve Safety of High-Alert Medications** | 1. **Concentrated Electrolytes** ($3\\%\\text{ NaCl}$, $\\text{KCl} \\ge 2\\text{ mEq/mL}$, $50\\%\\text{ Dextrose}$, $20\\%\\text{ Magnesium Sulfate}$) must be **REMOVED from general ward floor stock**.<br>2. **Look-Alike Sound-Alike (LASA)** drugs stored in separate physical bins with **Tall-Man Lettering** (e.g. predniSONE vs prednisoLONE, hydrOXYzine vs hydrALAZINE). | Concentrated potassium chloride must never be given as an IV push/bolus (fatal cardiotoxicity!). |
| **IPSG 4** | **Ensure Safe Surgery (Right Site, Procedure, Person)** | 1. **Preoperative Surgical Site Marking** (performed by the operating surgeon with an indelible marker while patient is awake).<br>2. **WHO Surgical Safety Checklist** with 3 distinct pause phases: **Sign In, Time Out, Sign Out**. | Surgery must NEVER proceed if any team member expresses unresolved ambiguity during Time Out. |
| **IPSG 5** | **Reduce Risk of Healthcare-Associated Infections** | Full institutional compliance with **WHO 5 Moments for Hand Hygiene** and evidence-based HAI bundles (CAUTI, CLABSI, VAP, SSI). | Re-use of single-use disposable devices is strictly prohibited unless validated by reprocessing protocols. |
| **IPSG 6** | **Reduce Risk of Patient Harm from Falls** | Mandatory fall risk screening on admission and transfer using validated scoring tools (**Morse Fall Scale** or **Hendrich II Fall Risk Model**). High-fall-risk patients flagged with yellow wristbands and bed alarms. | Patients under sedation or mobility impairment must never be left unassisted during transfers. |

---

## 2. The WHO Surgical Safety Checklist: 3 Critical Phases

1. **Sign In (Before Induction of Anesthesia)**:
   - Patient has confirmed identity, site, procedure, and consent.
   - Surgical site is marked.
   - Anesthesia safety check completed; pulse oximeter on patient and functioning.
   - Known allergy? Difficult airway or aspiration risk? Risk of $>500\\text{ mL}$ blood loss ($7\\text{ mL/kg}$ in children)?
2. **Time Out (Before Skin Incision - "Briefing")**:
   - Entire team (Surgeon, Anesthetist, Scrub Nurse, Circulating Nurse) verbally introduces names and roles.
   - Confirm patient's name, procedure, and surgical site.
   - Has antibiotic prophylaxis been given within the last $60\\text{ minutes}$?
   - Anticipated critical events: Surgeon reviews operative steps, duration, blood loss; Anesthetist reviews patient-specific concerns; Nursing reviews sterility indicator confirmation.
   - Is essential imaging displayed?
3. **Sign Out (Before Patient Leaves Operating Room - "Debriefing")**:
   - Nurse verbally confirms: Name of the procedure recorded; Instrument, sponge, and needle counts are **CORRECT**; Specimen labeled correctly with patient name; Any equipment problems to be addressed.
   - Surgeon, Anesthetist, and Nurse review key concerns for recovery and post-operative management.

---

## 3. Incident Investigation: Sentinel Events & Root Cause Analysis (RCA)

- **Sentinel Event**: An unexpected occurrence involving death or serious physical or psychological injury (or the risk thereof), including:
  - Wrong-site / wrong-side / wrong-procedure surgery.
  - Retained foreign body post-surgery.
  - Hemolytic transfusion reaction due to ABO incompatibility.
  - Medication error resulting in permanent disability or death.
  - Inpatient suicide or infant abduction.
- **Root Cause Analysis (RCA)**: A structured, systematic, retrospective process to identify the fundamental systemic failures (latent conditions) underlying a sentinel event.
- **The Ishikawa (Fishbone / Cause-and-Effect) Diagram**:
  - Classifies contributing factors into **6Ms**:
    1. **Manpower**: Fatigue, inadequate training, poor communication, lack of supervision.
    2. **Machine / Equipment**: Device malfunction, uncalibrated monitor, alarm failure.
    3. **Material / Supplies**: Mislabeled medication vials, look-alike packaging.
    4. **Method / Process**: Outdated SOP, ambiguous clinical handover, skipping Time Out.
    5. **Measurement**: Incorrect dosage calculation, misread lab values.
    6. **Milieu / Environment**: High noise level, dim lighting, overcrowding, high workload.
- **The 5-Whys Technique**: Iterative question-asking technique drilling down through successive layers of symptoms to reach the core organizational root cause.
`,
  clinicalVignettes: [
    {
      scenario: "During a busy night shift in a medical step-down unit, a junior nurse receives a telephone call from the laboratory stating that a patient's serum potassium is 6.8 mEq/L (critical panic value). The nurse makes a mental note, continues administering IV medications to another patient, and forgets to notify the on-call physician for 90 minutes. The patient subsequently develops wide-complex ventricular tachycardia and suffers a cardiac arrest. A root cause analysis (RCA) is convened.",
      question: "Which of the following systemic protocol failures directly violated International Patient Safety Goal 2 (IPSG 2: Improve Effective Communication) during this critical incident?",
      options: [
        "Failure to enforce the mandatory 'Write Down, Read Back, and Confirm' protocol and failure to log and escalate the critical panic value within the mandatory 30-minute window",
        "Failure to perform an Ishikawa Fishbone diagram prior to taking verbal orders",
        "Failure to mark the patient's bedside with an indelible pen",
        "Failure to administer high-dose oral potassium binders prior to lab release"
      ],
      correctAnswerIndex: 0,
      explanation: "IPSG 2 mandates strict protocols for communicating critical diagnostic test results and verbal orders: the receiver must immediately write down the complete result, read it back verbatim to the sender for confirmation ('Write Down, Read Back, Confirm'), and ensure prompt documented escalation to the treating physician within 30 minutes. In this case, relying on memory without writing down or reading back, and failing to execute prompt closed-loop escalation, directly caused the failure to rescue."
    }
  ]
};
