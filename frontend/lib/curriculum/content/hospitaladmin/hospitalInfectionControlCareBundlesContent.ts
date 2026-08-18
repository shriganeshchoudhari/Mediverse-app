/**
 * Hospital Administration: Hospital Infection Control (HIC), Surveillance & Care Bundles
 * Authoritative medical content derived from CDC Healthcare Infection Control Guidelines, WHO Hand Hygiene, NABH 5th Edition.
 * Mapped to NMC CBME Competencies: HA3.1, HA3.2, HA4.1, HA4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HOSPITAL_INFECTION_CONTROL_CARE_BUNDLES_MODULE: PhysiologyLessonModule = {
  id: "hospital-admin-hospital-infection-control-care-bundles",
  unitCode: "HA3.1",
  title: "Hospital Infection Control (HIC): CAUTI, CLABSI, VAP, SSI Bundles & WHO 5 Moments of Hand Hygiene",
  competencies: ["HA3.1", "HA3.2", "HA4.1", "HA4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "COMMUNITY",
  markdownContent: `
# Hospital Infection Control (HIC), Surveillance & Evidence-Based Care Bundles

A care bundle is a structured collection of evidence-based interventions that, when implemented together reliably, result in significantly better patient outcomes than when implemented individually.

---

## 1. Healthcare-Associated Infection (HAI) Care Bundles

| Healthcare Infection Type | Clinical Definition & Thresholds | Core Evidence-Based Care Bundle Elements | Process Audit & Quality Indicators |
| :--- | :--- | :--- | :--- |
| **CAUTI (Catheter-Associated UTI)** | Presence of indwelling urinary catheter for $>2\\text{ calendar days}$ with symptoms (fever, dysuria, suprapubic pain) and urine culture $\\ge 10^5\\text{ CFU/mL}$. | 1. **Strict Sterile Insertion** using sterile gloves, drape, and antiseptic.<br>2. **Maintain Closed Drainage System**; never disconnect tubing.<br>3. **Keep Drainage Bag Below Bladder Level** to prevent retrograde reflux.<br>4. **Avoid Dependent Loops** in tubing.<br>5. **Daily Review of Catheter Necessity**; prompt removal as soon as indications cease. | • **CAUTI Rate**: Number of CAUTIs per $1,000\\text{ urinary catheter-days}$.<br>• Catheter Utilization Ratio: $\\frac{\\text{Catheter Days}}{\\text{Total Patient Days}}$. |
| **CLABSI (Central Line-Associated Bloodstream Infection)** | Primary laboratory-confirmed bloodstream infection (LCBI) in a patient with a central line in place for $>2\\text{ calendar days}$, not related to an infection at another site. | 1. **Maximal Sterile Barrier Precautions** during insertion (cap, mask, sterile gown, sterile gloves, full-body patient drape).<br>2. **Skin Antisepsis with $>0.5\\%$ Chlorhexidine in $70\\%$ Alcohol**; allow to air-dry completely (2 min).<br>3. **Optimal Site Selection**: **Subclavian Vein preferred** (lowest infection rate); **AVOID femoral vein** in adults (highest infection & thrombosis rate).<br>4. **Daily Line Necessity Assessment**; prompt removal when no longer required. | • **CLABSI Rate**: Number of CLABSIs per $1,000\\text{ central line-days}$.<br>• Zero-CLABSI Initiative targets. |
| **VAP (Ventilator-Associated Pneumonia)** | Pneumonia arising $>48\\text{ hours}$ after endotracheal intubation, characterized by new/progressive infiltrates on chest X-ray, fever, purulent sputum, and leukocytosis. | 1. **Elevation of Head of Bed to $30^\\circ - 45^\\circ$** (prevents aspiration of gastric contents).<br>2. **Daily Sedation Vacation & Assessment of Readiness to Extubate**.<br>3. **Subglottic Secretion Drainage (CASS ETT)**.<br>4. **Oral Hygiene with Chlorhexidine ($0.12\\%$)**.<br>5. **Peptic Ulcer Disease & DVT Prophylaxis**. | • **VAP Rate**: Number of VAP cases per $1,000\\text{ ventilator-days}$.<br>• Mean duration of mechanical ventilation. |
| **SSI (Surgical Site Infection)** | Infection occurring within $30\\text{ days}$ of surgery (or within $90\\text{ days}$ if an implant is left in place). Classifications: Superficial, Deep Incisional, Organ/Space. | 1. **Preoperative Antiseptic Shower**.<br>2. **Hair Clipping Only** (electric clippers immediately prior to surgery; razors are STRICTLY PROHIBITED due to microscopic skin nicks!).<br>3. **Prophylactic Antibiotics Administered within $60\\text{ minutes}$ prior to Surgical Incision** (within $120\\text{ min}$ for Vancomycin / Ciprofloxacin).<br>4. **Maintain Intraoperative Normothermia ($\\ge 36^\\circ\\text{C}$)** and **Euglycemia ($<180\\text{ mg/dL}$)**.<br>5. Discontinue prophylactic antibiotics within **$24\\text{ hours}$ post-op**. | • **SSI Rate**: Percentage of surgical procedures developing infection per surgical wound class (Clean, Clean-Contaminated, Contaminated, Dirty). |

---

## 2. WHO 5 Moments for Hand Hygiene

$$\\begin{array}{cll}
\\hline
\\textbf{Moment} & \\textbf{Clinical Timing} & \\textbf{Protective Rationale} \\\\
\\hline
\\mathbf{1} & \\textbf{Before Touching a Patient} & \\text{Protects patient from colonization by healthcare worker microorganisms.} \\\\
\\mathbf{2} & \\textbf{Before Clean / Aseptic Procedure} & \\text{Protects patient from inoculation of germs (e.g. IV line insertion, dressing change).} \\\\
\\mathbf{3} & \\textbf{After Body Fluid Exposure Risk} & \\text{Protects healthcare worker and hospital environment from pathogen contamination.} \\\\
\\mathbf{4} & \\textbf{After Touching a Patient} & \\text{Protects healthcare worker from patient flora colonization.} \\\\
\\mathbf{5} & \\textbf{After Touching Patient Surroundings} & \\text{Protects healthcare worker from fomites (bed rails, IV pumps, monitor surfaces).} \\\\
\\hline
\\end{array}$$

- **Alcohol-Based Hand Rub (ABHR)**: $20 - 30\\text{ seconds}$ duration. Method of choice for routine decontamination when hands are NOT visibly soiled.
- **Handwashing with Soap and Water**: $40 - 60\\text{ seconds}$ duration. Mandatory when hands are **visibly soiled**, after exposure to **spore-forming pathogens (*Clostridioides difficile*)**, and after using the restroom.

---

## 3. Operation Theatre (OT) Environmental Air Quality Standards

- **Positive Pressure Ventilation**: OT air pressure must be positive relative to corridors ($>2.5\\text{ Pa}$) to prevent ingress of contaminated corridor air.
- **Laminar Airflow**: Unidirectional downward air velocity ($0.3 - 0.5\\text{ m/s}$) over the operating table.
- **Air Exchange Rate**: Minimum of **$20 - 25\\text{ total air changes per hour (ACH)}$**, with a minimum of **$4\\text{ fresh air changes/hour}$**.
- **HEPA Filters**: High-Efficiency Particulate Air filters with **$99.97\\%$ retention efficiency at $0.3\\ \\mu\\text{m}$**.
- **OT Temperature & Humidity**: Temperature maintained at **$20^\\circ\\text{C} - 22^\\circ\\text{C}$**; Relative humidity maintained at **$40\\% - 60\\%$** (prevents static electricity and fungal proliferation).
`,
  clinicalVignettes: [
    {
      scenario: "An infection control committee reviews the intensive care unit's Central Line-Associated Bloodstream Infection (CLABSI) prevention practices. A resident doctor prepares to insert an internal jugular central venous catheter in a critically ill patient. The resident performs hand hygiene, wears sterile gloves and a sterile gown, paints the skin with povidone-iodine, and places a small fenestrated drape over the patient's neck.",
      question: "Which of the following modifications is required to strictly adhere to the Evidence-Based Central Line Insertion Bundle to eliminate CLABSI risk?",
      options: [
        "Use >0.5% Chlorhexidine in 70% alcohol skin antisepsis (allowed to air-dry for 2 minutes) and apply a Full-Body Sterile Patient Drape along with cap and mask (Maximal Sterile Barrier)",
        "Switch insertion site to the femoral vein to avoid neck mobility issues",
        "Administer 3 days of prophylactic intravenous Vancomycin post-insertion",
        "Replace the internal jugular line with a peripheral cannula every 72 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "Strict compliance with the CLABSI Insertion Bundle requires: (1) Maximal Sterile Barrier Precautions, which mandates a surgical cap, mask, sterile gown, sterile gloves, and a full-body sterile drape covering the entire patient; (2) Skin antisepsis with >0.5% Chlorhexidine gluconate in 70% isopropyl alcohol, which is superior to povidone-iodine due to residual antimicrobial activity and must air-dry completely; (3) Preferred site selection (Subclavian preferred; femoral strictly avoided due to high infection/thrombosis rates); and (4) Daily line necessity review. Routine systemic prophylactic antibiotics are strictly contraindicated."
    }
  ]
};
