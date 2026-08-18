/**
 * Clinical Postings II: Postoperative Fever Differential & Evaluation Protocols
 * Authoritative postoperative fever content derived from Sabiston, Schwartz, ACS NSQIP.
 * Mapped to NMC CBME Competencies: CP2.2, SU1.2, AN1.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const POSTOPERATIVE_FEVER_5WS_MODULE: PhysiologyLessonModule = {
  id: "clin2-postoperative-fever-5ws",
  unitCode: "CP2.2",
  title: "Postoperative Fever: The 5 Ws Chronological Differential (Wind, Water, Wound, Walking, Wonder Drugs) & Malignant Hyperthermia",
  competencies: ["CP2.2", "SU1.2", "AN1.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Postoperative Fever Differential, Chronology & Evaluation Protocols

Evaluating postoperative fever requires a rigorous chronological approach that aligns time elapsed since surgery with organ-specific pathophysiological etiologies.

---

## 1. The Classic Chronological 5 Ws of Postoperative Fever

$$\\begin{array}{lcccc}
\\hline
\\textbf{Postoperative Timing} & \\textbf{The \"W\" Category} & \\textbf{Underlying Pathophysiology} & \\textbf{Diagnostic / Management Protocol} \\\\
\\hline
\\textbf{POD 1-2} & \\mathbf{\\text{WIND (Atelectasis / Pneumonia)}} & \\text{Mucus plugging, alveolar collapse due to} & \\mathbf{\\text{Incentive spirometry, early ambulation,}} \\\\
& & \\text{incisional splinting and shallow breathing} & \\text{chest physiotherapy, multimodal pain control} \\\\
\\textbf{POD 3} & \\mathbf{\\text{WATER (Catheter-Associated UTI)}} & \\text{Ascending bacterial infection via indwelling} & \\mathbf{\\text{Remove Foley catheter promptly; urinalysis \u0026}} \\\\
& & \\text{urinary catheter (E. coli, Enterococcus)} & \\text{urine culture; start targeted oral antibiotics} \\\\
\\textbf{POD 5} & \\mathbf{\\text{WOUND (Surgical Site Infection)}} & \\text{Bacterial colonization of surgical incision} & \\mathbf{\\text{Open surgical incision, drain purulence,}} \\\\
& & (\\text{S. aureus, Streptococci, Enteric GNRs}) & \\mathbf{\\text{wound debridement, packing, culture-directed abx}} \\\\
\\textbf{POD 7-10} & \\mathbf{\\text{WALKING (DVT / PE)}} & \\text{Venous stasis, endothelial surgical injury, \u0026} & \\mathbf{\\text{Duplex lower extremity ultrasound, CT-PA,}} \\\\
& & \\text{postoperative hypercoagulability (Virchow triad)} & \\mathbf{\\text{therapeutic anticoagulation (Enoxaparin / Heparin)}} \\\\
\\textbf{Anytime / POD >7} & \\mathbf{\\text{WONDER DRUGS (Drug Fever / HIT)}} & \\text{Immune reaction to antibiotics (}\\beta\\text{-lactams),} & \\mathbf{\\text{Discontinue culprit drug; check 4T score}} \\\\
& & \\text{or Heparin-Induced Thrombocytopenia (HIT)} & \\text{and switch Heparin to Argatroban if HIT suspected} \\\\
\\hline
\\end{array}$$

---

## 2. Hyperacute Intraoperative Fever: Malignant Hyperthermia (MH)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Phase / Feature} & \\textbf{Pathophysiological Mechanism} & \\textbf{Clinical Hallmarks} & \\textbf{Immediate Resuscitation Protocol} \\\\
\\hline
\\textbf{Triggering Agents} & \\mathbf{\\text{Volatile Anesthetics (Sevoflurane/Isoflurane) or Succinylcholine}} & \\text{Autosomal dominant } RYR1 \\text{ ryanodine receptor mutation} & \\mathbf{\\text{1. STOP triggering agents immediately}} \\\\
\\textbf{Initial Sign} & \\mathbf{\\text{Unexplained, sudden rise in end-tidal } CO_2\\text{ (hypercarbia)}} & \\text{Massive intracellular skeletal muscle calcium surge} & \\mathbf{\\text{2. Hyperventilate with 100\\% } O_2} \\\\
\\textbf{Progression} & \\text{Massive hypermetabolic state: muscle rigidity (masseter spasm),} & \\text{Extreme hyperthermia (T } > 41^{\\circ}\\text{C),} & \\mathbf{\\text{3. Administer IV Dantrolene 2.5 mg/kg stat}} \\\\
& \\text{rhabdomyolysis, hyperkalemia, and cardiac arrhythmias} & \\text{profuse sweating, mottled skin} & \\text{(ryanodine receptor antagonist blockade)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old female underwent an open total abdominal hysterectomy and bilateral salpingo-oophorectomy 5 days ago (POD 5). She develops a new-onset fever of 38.9°C (102.0°F), tachycardia (HR 108 bpm), and localized surgical wound pain. Physical examination of the lower midline abdominal incision reveals marked surrounding erythema, induration, localized warmth, and purulent cloudy discharge draining from between surgical staples.",
      question: "According to postoperative fever management guidelines, what is the most appropriate next step in managing this surgical site infection (SSI)?",
      options: [
        "Open the incision by removing staples/sutures along the area of induration, evacuate and drain the purulent collection, irrigate with sterile saline, gently pack the wound open with moist gauze, obtain wound cultures, and initiate broad-spectrum antibiotics",
        "Keep the staples in place and start oral acetaminophen only",
        "Apply topical antibiotic ointment to the intact skin without opening the wound",
        "Perform emergent whole-body CT angiography for suspected pulmonary embolism"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic POD 5 'Wound' (Surgical Site Infection): (1) Timing & Presentation: Fever occurring around Postoperative Day 5 with localized wound erythema, tenderness, and purulence represents a deep or superficial SSI; (2) Primary Surgical Principle: The definitive management for a surgical wound infection is immediate mechanical drainage—opening the incision by removing overlying staples, probing and evacuating the abscess cavity, irrigating, packing the wound with sterile gauze to allow secondary intention healing, and obtaining bacterial cultures for targeted antimicrobial therapy."
    }
  ]
};
