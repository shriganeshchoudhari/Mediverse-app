/**
 * OSCE Simulation Stations: Emergency ATLS Trauma Survey & ACLS MegaCode Resuscitation
 * Authoritative medical content derived from ATLS (10th ed.), AHA ACLS 2020-2025, and USMLE Step 2 CS / Step 3 OSCE.
 * Mapped to NMC CBME Competencies: OS3.1, OS3.2, OS4.1, OS4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OSCE_EMERGENCY_TRAUMA_ACLS_STATIONS_MODULE: PhysiologyLessonModule = {
  id: "osce-emergency-trauma-acls-stations",
  unitCode: "OS3.1",
  title: "OSCE Station: ATLS Trauma Primary Survey & AHA ACLS Cardiac Arrest MegaCode Simulation",
  competencies: ["OS3.1", "OS3.2", "OS4.1", "OS4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# OSCE Station: ATLS Trauma Primary Survey & AHA ACLS Cardiac Arrest MegaCode Simulation

Structured execution of acute resuscitation algorithms under time constraints tests hierarchical decision-making, procedural skill, and effective closed-loop team communication.

---

## 1. OSCE Station 3: ATLS Trauma Primary Survey Checklist

### Candidate Objective & Timed Checklist ($8\\text{ Minutes}$)
- **Step 1: Don Personal Protective Equipment (PPE)**: Gown, gloves, mask, eye protection.
- **A: Airway with Cervical Spine Protection**:
  1. Maintain manual in-line cervical spine stabilization.
  2. Inspect oral cavity for vomit, blood, foreign bodies, facial fractures; suction as needed.
  3. Assess vocalization; insert oropharyngeal/nasopharyngeal airway if obtunded.
  4. **Indication for Definitive Airway (Endotracheal Intubation)**: $\\text{GCS} \\le 8$, severe airway burns, severe maxillofacial trauma.
- **B: Breathing & Ventilation**:
  1. Expose chest; inspect expansion, symmetry, and respiratory rate; apply $100\\% O_2$ via non-rebreather.
  2. Palpate chest wall for tenderness, crepitus, and flail segments.
  3. Auscultate breath sounds bilaterally and percuss.
  4. **Emergency Procedural Triggers**:
     - *Tension Pneumothorax* (Hypotension, absent breath sounds, tracheal deviation) $\\implies$ **IMMEDIATE Needle Decompression (14G needle in 5th ICS anterior axillary line or 2nd ICS mid-clavicular line) $\\rightarrow$ Tube Thoracostomy (Chest Tube, 28–32 Fr)**. *Never wait for chest X-ray!*
     - *Open Pneumothorax* $\\implies$ Apply 3-sided occlusive dressing.
     - *Massive Hemothorax* ($>1500\\text{ mL}$ drainage) $\\implies$ Prepare for emergent Exploratory Thoracotomy.
- **C: Circulation with Hemorrhage Control**:
  1. Check central carotid and peripheral femoral pulses; check capillary refill, skin color, and blood pressure.
  2. Control active external hemorrhage with direct pressure or tourniquet.
  3. Establish **two large-bore (14–16G) peripheral IV lines** or intraosseous (IO) access; draw trauma labs, crossmatch, and venous blood gas.
  4. Apply **Pelvic Binder / Sheet wrap** over greater trochanters for suspected pelvic fracture.
  5. Activate **Massive Transfusion Protocol (MTP $1:1:1$ PRBC:FFP:Platelets)** $+$ **Tranexamic Acid (TXA $1\\text{ g}$ IV within 3 hours)**.
- **D: Disability & Neurological Status**:
  1. Calculate **Glasgow Coma Scale (GCS 3–15)**: Eye (1–4), Verbal (1–5), Motor (1–6).
  2. Assess pupil symmetry, size, and light reactivity.
- **E: Exposure & Environmental Control**:
  1. Completely undress the patient; log-roll with 4-person team maintaining spinal alignment to inspect back and rectal tone.
  2. Cover immediately with **warm blankets and infuse warmed IV fluids** to prevent hypothermia.

---

## 2. OSCE Station 4: AHA ACLS Cardiac Arrest MegaCode Simulation

- **Shockable Pathway (VF / Pulseless VT)**:
  - Deliver **200J Biphasic Shock** immediately $\rightarrow$ Resume CPR for 2 minutes without pulse check.
  - Deliver 2nd Shock if rhythm persists $\rightarrow$ Resume CPR and administer **Epinephrine 1 mg IV/IO** (repeat q3-5m).
  - Deliver 3rd Shock $\rightarrow$ Resume CPR and administer **Amiodarone 300 mg IV/IO bolus** (second dose 150 mg).
- **Non-Shockable Pathway (PEA / Asystole)**:
  - **DO NOT SHOCK** $\rightarrow$ High-quality CPR for 2 minutes $+$ **Epinephrine 1 mg IV/IO ASAP** (repeat q3-5m).
  - Aggressively search and reverse **The 5 Hs and 5 Ts**.
- **Quantitative Waveform Capnography ($EtCO_2$)**:
  - $EtCO_2 < 10\text{ mmHg} \implies$ Improve chest compression quality and recoil.
  - **$EtCO_2 \ge 35 - 40\text{ mmHg} \implies$ Return of Spontaneous Circulation (ROSC)!** Target Temperature Management at $32 - 36^\circ\text{C}$ for 24 hours.

### Key Closed-Loop Team Leadership Directives
1. **Assign Clear Roles**: Compressor 1 & 2 (rotate q2min), Airway manager, Medication nurse, Defibrillator operator, Recorder.
2. **Defibrillation Safety Call**: *"Charging defibrillator to 200 Joules... I am clear, you are clear, everybody clear... SHOCK delivered. Resume CPR immediately!"*
3. **Continuous Capnography ($EtCO_2$)**:
   - $EtCO_2 < 10\\text{ mmHg} \\implies$ Prompt compressor to push deeper and allow full chest recoil.
   - **Sudden jump to $EtCO_2 \\ge 35 - 40\\text{ mmHg} \\implies$ Check for ROSC!**
`,
  clinicalVignettes: [
    {
      scenario: "During an ACLS MegaCode simulation station, a 60-year-old male is in cardiac arrest. The monitor shows coarse Ventricular Fibrillation (VF). You direct the team to deliver an initial biphasic defibrillation shock of 200 Joules. The shock is successfully delivered.",
      question: "What is the exact verbal instruction you must give to your resuscitation team immediately following the shock delivery?",
      options: [
        "\"Resume chest compressions immediately for 2 minutes without pausing for a pulse check.\"",
        "\"Pause compressions and check for a carotid pulse for 10 seconds.\"",
        "\"Administer IV Amiodarone 300 mg bolus immediately before restarting CPR.\"",
        "\"Stop CPR and analyze the rhythm on the monitor.\""
      ],
      correctAnswerIndex: 0,
      explanation: "According to the AHA ACLS Guidelines, immediately following the delivery of any defibrillation shock, the team leader must direct the team to RESUME chest compressions instantly for a full 2-minute cycle without pausing for a rhythm or pulse check. Post-shock rhythm checks delay vital myocardial perfusion, and even successful defibrillation is followed by brief post-shock electromechanical stunning that requires ongoing mechanical support."
    }
  ]
};
