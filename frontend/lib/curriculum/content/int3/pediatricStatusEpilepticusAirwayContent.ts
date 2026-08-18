/**
 * Internship Core Clinical Postings: Pediatric Status Epilepticus & Acute Airway Obstruction
 * Authoritative pediatric emergency content derived from American Epilepsy Society Guidelines, Nelson Pediatrics.
 * Mapped to NMC CBME Competencies: IN3.4, PE3.3, EM3.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_STATUS_EPILEPTICUS_AIRWAY_MODULE: PhysiologyLessonModule = {
  id: "int3-pediatric-status-epilepticus-airway",
  unitCode: "IN3.4",
  title: "Pediatric Status Epilepticus (AES Timelines & Drug Sequencing) & Acute Airway Obstruction (Croup vs Epiglottitis)",
  competencies: ["IN3.4", "PE3.3", "EM3.4"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Pediatric Status Epilepticus & Upper Airway Obstruction

Time-sensitive termination of prolonged convulsive status epilepticus prevents excitotoxic neuronal death, while rapid differentiation of upper airway pathology avoids catastrophic airway loss.

---

## 1. American Epilepsy Society (AES) Pediatric Status Epilepticus Algorithm

$$\\begin{array}{lcccc}
\\hline
\\textbf{Phase \u0026 Time (Min)} & \\textbf{Clinical Category} & \\textbf{First-Line Pharmacotherapy} & \\textbf{Alternative Dosing / Routes} \\\\
\\hline
\\textbf{Phase 1 (0 - 5 min)} & \\text{Initial Stabilization} & \\text{ABCs, } 100\\% \\text{ } O_2\\text{, bedside blood glucose} & \\mathbf{\\text{If glucose } < 60\\text{ mg/dL: } D_{10}W \\text{ 2 mL/kg IV}} \\\\
\\textbf{Phase 2 (5 - 10 min)} & \\mathbf{\\text{1st-Line Benzodiazepines}} & \\mathbf{\\text{IV Lorazepam: } 0.1\\text{ mg/kg (max 4 mg) over 2 min}} & \\mathbf{\\text{No IV: IM Midazolam } 0.2\\text{ mg/kg (max 10 mg)}} \\\\
& & & \\mathbf{\\text{or IN Midazolam } 0.2\\text{ mg/kg / Rectal Diazepam}} \\\\
\\textbf{Phase 3 (10 - 20 min)} & \\mathbf{\\text{2nd-Line Non-Sedating}} & \\mathbf{\\text{IV Levetiracetam (Keppra): } 60\\text{ mg/kg (max 4,500 mg)}} & \\mathbf{\\text{IV Fosphenytoin: } 20\\text{ mg PE/kg (max 1,500 mg PE)}} \\\\
& \\mathbf{\\text{Antiepileptic Drugs}} & \\text{infused over 10-15 min} & \\mathbf{\\text{or IV Valproate Sodium: } 40\\text{ mg/kg (max 3,000 mg)}} \\\\
\\textbf{Phase 4 (> 20-40 min)} & \\mathbf{\\text{Refractory Status}} & \\mathbf{\\text{Endotracheal Intubation + continuous anesthetic}} & \\text{Continuous EEG; Midazolam or Propofol} \\\\
& & \\text{infusion (Midazolam / Propofol / Ketamine)} & \\text{or Ketamine titration} \\\\
\\hline
\\end{array}$$

---

## 2. Acute Pediatric Upper Airway Obstruction Differential

$$\\begin{array}{lcccc}
\\hline
\\textbf{Emergency Pathology} & \\textbf{Etiology \u0026 Clinical Presentation} & \\textbf{Classic Radiographic Sign} & \\textbf{Emergency Management Protocol} \\\\
\\hline
\\textbf{Croup (Laryngo-} & \\text{Parainfluenza virus; barking cough, inspiratory} & \\mathbf{\\text{\"Steeple Sign\" (subglottic}} & \\mathbf{\\text{Oral/IM Dexamethasone } 0.6\\text{ mg/kg}} \\\\
\\textbf{tracheobronchitis)} & \\text{stridor, hoarseness, low-grade fever} & \\mathbf{\\text{tracheal narrowing on AP neck X-ray)}} & \\mathbf{+ \\text{ Nebulized Racemic Epinephrine (0.5 mL)}} \\\\
\\textbf{Acute Epiglottitis} & \\mathbf{\\text{H. influenzae type b / Strep; high fever, toxic,}} & \\mathbf{\\text{\"Thumbprint Sign\" (swollen}} & \\mathbf{\\text{DO NOT AGITATE; NO TONGUE BLADE;}} \\\\
& \\mathbf{\\text{drooling, tripod stance, cherry-red epiglottis}} & \\mathbf{\\text{epiglottis on lateral neck X-ray)}} & \\mathbf{\\text{emergent OR intubation with ENT / Anesthesia}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 4-year-old boy is brought to the emergency department in generalized tonic-clonic status epilepticus that has been ongoing for 8 minutes. Peripheral intravenous access has not yet been established. The patient is cyanotic with an oxygen saturation of 88% on room air. Point-of-care capillary blood glucose is 94 mg/dL. High-flow oxygen via a non-rebreather mask is applied.",
      question: "What is the most rapid and effective first-line anticonvulsant regimen to terminate this seizure without waiting for IV access?",
      options: [
        "Administer Intramuscular (IM) Midazolam (0.2 mg/kg, max 10 mg) or Intranasal (IN) Midazolam (0.2 mg/kg); non-IV routes provide rapid termination equivalent to IV Lorazepam without delay for venous cannulation",
        "Wait 10 minutes to attempt multiple IV placements before administering any medication",
        "Administer oral Levetiracetam suspension via a nasogastric tube",
        "Administer high-dose subcutaneous insulin"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario demonstrates the American Epilepsy Society (AES) guidelines for pediatric status epilepticus: (1) Time to Treatment: When seizures exceed 5 minutes, first-line benzodiazepines must be given without delay; (2) Non-IV Routes: When IV access is not readily available, Intramuscular (IM) Midazolam (0.2 mg/kg, max 10 mg) is the preferred first-line agent (demonstrated superior to IV lorazepam in prehospital RAMPART trial due to faster time to administration); Intranasal Midazolam or Rectal Diazepam are effective alternatives; (3) Second-Line Agents: If seizure activity persists beyond 10-15 minutes, proceed to second-line IV infusions (Levetiracetam 60 mg/kg, Fosphenytoin 20 mg PE/kg, or Valproate 40 mg/kg)."
    }
  ]
};
