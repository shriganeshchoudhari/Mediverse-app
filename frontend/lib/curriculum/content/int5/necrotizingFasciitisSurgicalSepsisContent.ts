/**
 * Internship Core Clinical Postings: Necrotizing Soft Tissue Infections & Surgical Sepsis
 * Authoritative surgical infectious disease content derived from IDSA Guidelines, Sabiston Surgery.
 * Mapped to NMC CBME Competencies: IN5.4, SU3.4, EM3.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NECROTIZING_FASCIITIS_SURGICAL_SEPSIS_MODULE: PhysiologyLessonModule = {
  id: "int5-necrotizing-fasciitis-surgical-sepsis",
  unitCode: "IN5.4",
  title: "Necrotizing Soft Tissue Infections: LRINEC Score (>=6), Emergent Surgical Debridement & Clindamycin Toxin Shutdown",
  competencies: ["IN5.4", "SU3.4", "EM3.4"],
  estimatedMinutes: 150,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Necrotizing Soft Tissue Infections (NSTI) & Surgical Sepsis

Fulminant bacterial invasion along deep fascial planes requires immediate recognition, radical operating room surgical debridement, and antitoxin antimicrobial therapy.

---

## 1. Necrotizing Fasciitis Classification & Microbiology

$$\\begin{array}{lcccc}
\\hline
\\textbf{NSTI Subtype} & \\textbf{Microbial Etiology} & \\textbf{Clinical Settings / Manifestations} \\\\
\\hline
\\textbf{Type I (Polymicrobial)} & \\mathbf{\\text{Mixed Aerobes + Anaerobes}} & \\text{Diabetic foot ulcers, postoperative wounds,} \\\\
& (\\text{Bacteroides, Peptostreptococcus, E. coli}) & \\mathbf{\\text{Perineal infection (Fournier's Gangrene)}} \\\\
\\textbf{Type II (Monomicrobial)} & \\mathbf{\\text{Group A Streptococcus (GAS; } S. pyogenes\\text{)}} & \\text{\"Flesh-eating disease\"; healthy hosts, minor trauma;} \\\\
& \\mathbf{\\pm \\text{ Staphylococcus aureus (MRSA)}} & \\mathbf{\\text{Streptococcal Toxic Shock Syndrome (STSS)}} \\\\
\\textbf{Type III (Marine / Water)} & \\mathbf{\\text{Vibrio vulnificus / Aeromonas hydrophila}} & \\text{Saltwater / oyster exposure, cirrhotic patients} \\\\
\\hline
\\end{array}$$

---

## 2. The LRINEC (Laboratory Risk Indicator for Necrotizing Fasciitis) Score

$$\\begin{array}{lcccc}
\\hline
\\textbf{Laboratory Parameter} & \\textbf{Measured Value Range} & \\textbf{LRINEC Points} \\\\
\\hline
\\textbf{C-Reactive Protein (CRP)} & \\ge 150\\text{ mg/L} & \\mathbf{4} \\\\
\\textbf{Total White Blood Cell Count} & 15-25 \\times 10^3/\\mu\\text{L} \\quad (\\text{or } > 25 \\times 10^3/\\mu\\text{L}) & 1 \\quad (\\text{or } \\mathbf{2}) \\\\
\\textbf{Hemoglobin (g/dL)} & 11-13.5\\text{ g/dL} \\quad (\\text{or } < 11\\text{ g/dL}) & 1 \\quad (\\text{or } \\mathbf{2}) \\\\
\\textbf{Serum Sodium (mEq/L)} & < 135\\text{ mEq/L} & \\mathbf{2} \\\\
\\textbf{Serum Creatinine (mg/dL)} & > 1.6\\text{ mg/dL} & \\mathbf{2} \\\\
\\textbf{Serum Glucose (mg/dL)} & > 180\\text{ mg/dL} & 1 \\\\
\\hline
\\textbf{Score Interpretation} & \\mathbf{\\text{Score } \\ge 6: \\text{ HIGH suspicion of Necrotizing Fasciitis (} \\ge 8 \\text{ has } > 90\\% \\text{ PPV)}} & \\mathbf{13 \\text{ Max}} \\\\
\\hline
\\end{array}$$

---

## 3. Emergency Surgical Debridement & Triple Antibiotic Therapy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Therapeutic Pillar} & \\textbf{Specific Protocol / Drug Regimen} & \\textbf{Mechanism / Rationale} \\\\
\\hline
\\textbf{1. Emergent OR Debridement} & \\mathbf{\\text{Immediate surgical exploration; resect ALL necrotic}} & \\text{Eliminates necrotic tissue burden; fascia easily} \\\\
& \\mathbf{\\text{fascia and skin until healthy bleeding tissue is reached}} & \\text{separates from subcutaneous tissue (\"finger sweep test\")} \\\\
\\textbf{2. MRSA Coverage} & \\mathbf{\\text{IV Vancomycin (15-20 mg/kg q8-12h)}} & \\text{Bactericidal glycopeptide covering MRSA} \\\\
\\textbf{3. Gram-Negative / Anaerobic} & \\mathbf{\\text{IV Piperacillin-Tazobactam (3.375-4.5 g q6h)}} & \\text{Broad-spectrum beta-lactamase inhibitor coverage} \\\\
& (\\text{or IV Meropenem } 1\\text{ g q8h}) & \\text{for Enterobacteriaceae and Bacteroides} \\\\
\\textbf{4. Antitoxin Protein Shutdown} & \\mathbf{\\text{IV Clindamycin (900 mg IV q8h)}} & \\mathbf{\\text{50S ribosomal inhibition; shuts down streptococcal}} \\\\
& & \\mathbf{\\text{pyrogenic exotoxin (SpeA/B/C) production}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old male with uncontrolled Type 2 Diabetes presents to the emergency department with severe right thigh pain, swelling, and fever. On examination, the skin over the anteromedial thigh demonstrates dusky violaceous erythema, bullae with hemorrhagic fluid, and marked tenderness extending well beyond the visible borders of erythema. Subcutaneous crepitus is palpated on exam. His blood pressure is 86/52 mmHg and heart rate is 130 bpm. Laboratory evaluation reveals: CRP 220 mg/L, WBC count 28,500/uL, Hemoglobin 10.2 g/dL, Serum sodium 128 mEq/L, Serum creatinine 2.1 mg/dL, and Blood glucose 340 mg/dL.",
      question: "What is the calculated LRINEC score, and what is the definitive life-saving emergency management protocol?",
      options: [
        "LRINEC Score = 13 out of 13 (CRP = 4, WBC = 2, Hemoglobin = 2, Sodium = 2, Creatinine = 2, Glucose = 1); a score >=6 confirms high risk for Necrotizing Soft Tissue Infection; the patient requires immediate emergency transfer to the operating room for radical surgical debridement PLUS empiric broad-spectrum triple antibiotic therapy (IV Vancomycin + Piperacillin-Tazobactam + IV Clindamycin 900 mg q8h for toxin shutdown)",
        "LRINEC Score = 3; admit to the general medical ward for oral cephalexin",
        "Cellulitis only; prescribe outpatient oral amoxicillin-clavulanate and discharge home",
        "Perform outpatient MRI in 48 hours and withhold all surgical exploration"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates fulminant necrotizing soft tissue infection (NSTI): (1) Clinical Hallmarks: Severe pain out of proportion to exam, skin bullae, dusky violaceous discoloration, crepitus, and systemic septic shock; (2) LRINEC Calculation: CRP >=150 (4) + WBC >25k (2) + Hb <11 (2) + Na <135 (2) + Cr >1.6 (2) + Glucose >180 (1) = 13/13 (maximum score, >90% predictive of necrotizing fasciitis); (3) Life-Saving Intervention: Immediate radical surgical debridement in the operating room is the primary determinant of survival; (4) Clindamycin Rationale: High-dose Clindamycin (900 mg IV q8h) binds the 50S ribosomal subunit to shut down bacterial toxin synthesis (Eagle effect)."
    }
  ]
};
