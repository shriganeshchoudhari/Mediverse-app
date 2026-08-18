/**
 * Postgraduate Advanced Anesthesiology & Perioperative Medicine: Malignant Hyperthermia & Dantrolene
 * Authoritative perioperative critical care content derived from MHAUS Guidelines, Larach MH Consensus Protocols.
 * Mapped to NMC PG CBME Competencies: PG6.1, AN1.1, AN1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE: PhysiologyLessonModule = {
  id: "pg6-malignant-hyperthermia-dantrolene-rescue",
  unitCode: "PG6.1",
  title: "Malignant Hyperthermia (MH): RYR1 Pathophysiology, Hypermetabolic Crisis & Dantrolene Protocols",
  competencies: ["PG6.1", "AN1.1", "AN1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Malignant Hyperthermia (MH) & The MHAUS Resuscitation Protocol

Malignant Hyperthermia is an autosomal dominant pharmacogenetic hypermetabolic crisis triggered by volatile anesthetics and succinylcholine, driven by uncontrolled calcium flooding from the sarcoplasmic reticulum.

---

## 1. Pathophysiology, Clinical Manifestations & Diagnostic Benchmarks

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Phase} & \\textbf{Physiological Sign / Parameter} & \\textbf{Diagnostic Threshold} & \\textbf{Underlying Pathophysiology} \\\\
\\hline
\\textbf{Earliest Sign} & \\mathbf{\\text{Refractory End-Tidal } CO_2 \\text{ Surge}} & \\mathbf{EtCO_2 > 55-60\\text{ mmHg}} & \\text{Massive aerobic cellular respiration} \\\\
& & (\\text{refractory to } \\uparrow \\text{ MV}) & \\text{and profound lactic acid production} \\\\
\\textbf{Musculoskeletal} & \\mathbf{\\text{Masseter Muscle Rigidity (MMR)}} & \\mathbf{\\text{''Jaws of Steel'' following}} & \\text{Sarcoplasmic } Ca^{2+} \\text{ overload prevents} \\\\
& \\& \\text{ generalized tetanic spasm} & \\text{succinylcholine} & \\text{myosin-actin detachment} \\\\
\\textbf{Metabolic} & \\mathbf{\\text{Mixed Severe Acidosis \\& Hyperkalemia}} & \\mathbf{pH < 7.15,\\; K^+ > 6.0\\text{ mEq/L,}} & \\text{Sarcolemmal breakdown,} \\\\
& & \\mathbf{CK > 20{,}000\\text{ IU/L, myoglobinuria}} & \\text{rhabdomyolysis, and acute renal failure} \\\\
\\textbf{Late Cardinal Sign} & \\mathbf{\\text{Fulminant Hyperthermia}} & \\mathbf{\\uparrow 1-2^{\\circ}\\text{C every 5 min}} & \\text{Uncontrolled ATP hydrolysis generating} \\\\
& & (\\mathbf{\\text{up to } > 42.0^{\\circ}\\text{C}}) & \\text{massive exothermic heat production} \\\\
\\hline
\\end{array}$$

---

## 2. The MHAUS Emergency Resuscitation Algorithm

$$\\begin{array}{lcccc}
\\hline
\\textbf{Resuscitation Step} & \\textbf{Clinical Standard / Protocol Action} & \\textbf{Critical Safety Caveats} \\\\
\\hline
\\textbf{1. Terminate Triggers} & \\mathbf{\\text{Turn OFF all volatile vaporizers; halt succinylcholine}} & \\text{Do NOT waste time changing the anesthesia circuit;} \\\\
& \\mathbf{\\text{Hyperventilate with 100\\% } O_2 \\text{ at } \\ge 10\\text{ L/min}} & \\text{insert charcoal vapor filters into limbs} \\\\
\\textbf{2. Dantrolene Load} & \\mathbf{2.5\\text{ mg/kg IV push rapidly through large-bore IV}} & \\mathbf{\\text{Repeat } 1-2.5\\text{ mg/kg Q5-10m up to max } 10\\text{ mg/kg}} \\\\
& (\\text{Ryanodex: } 250\\text{ mg in } 5\\text{ mL} \\text{ vs Dantrium: } 20\\text{ mg in } 60\\text{ mL}) & \\text{Ryanodine (RYR1) channel blocker halting } Ca^{2+} \\text{ release} \\\\
\\textbf{3. Active Cooling} & \\mathbf{\\text{Iced IV cold saline (15 mL/kg), surface packs, lavage}} & \\mathbf{\\text{STOP active cooling when core temp } < 38.0^{\\circ}\\text{C}} \\\\
\\textbf{4. Hyperkalemia Tx} & \\mathbf{CaCl_2\\text{ (10 mg/kg), Regular Insulin 10U + D50W, } NaHCO_3} & \\mathbf{STRICTLY CONTRAINDICATE CALCIUM CHANNEL BLOCKERS} \\\\
& & (\\mathbf{\\text{Verapamil/Diltiazem causes fatal hyperkalemic arrest}}) \\\\
\\textbf{5. Maintenance} & \\mathbf{1.0\\text{ mg/kg IV Q4-6H for 24-48 hours}} & \\text{Prevents MH recrudescence (occurs in up to 25\\%)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male with no prior anesthetic history is undergoing emergency open reduction and internal fixation of a femur fracture under general anesthesia with Sevoflurane and Cisatracurium, following an initial dose of Succinylcholine during rapid sequence intubation. Forty minutes into the procedure, the anesthesiologist notes a sudden increase in End-Tidal CO2 from 38 to 68 mmHg, refractory to doubling the minute ventilation. Heart rate is 145 bpm sinus tachycardia, core temperature has climbed from 36.8°C to 39.4°C over 10 minutes, and arterial blood gas reveals: pH 7.08, PaCO2 74 mmHg, Base Deficit -14 mEq/L, K+ 6.8 mEq/L, and Lactate 9.2 mmol/L. The patient's limbs and jaw demonstrate profound generalized muscular rigidity.",
      question: "What is the diagnosis, what is the initial loading dose of Dantrolene, and which cardiovascular medication class is strictly contraindicated?",
      options: [
        "Malignant Hyperthermia (MH) crisis triggered by Sevoflurane and Succinylcholine in a patient with an underlying RYR1 mutation; immediately turn off Sevoflurane, hyperventilate with 100% O2 at >=10 L/min, and administer Dantrolene Sodium at an initial loading dose of 2.5 mg/kg IV push (repeat every 5-10 min up to 10 mg/kg); Calcium Channel Blockers (e.g., Verapamil, Diltiazem) are strictly contraindicated due to the lethal risk of acute hyperkalemic cardiovascular collapse and myocardial arrest",
        "Thyrotoxic storm; administer IV Propranolol 10 mg and propylthiouracil only",
        "Neuroleptic Malignant Syndrome; treat with IV Bromocriptine and continue Sevoflurane",
        "Light anesthesia; double the Sevoflurane concentration and give IV Verapamil 10 mg"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Malignant Hyperthermia: (1) Pathophysiology & Recognition: RYR1 sarcoplasmic receptor mutation causes massive calcium efflux upon exposure to volatile anesthetics/succinylcholine, producing hypermetabolism signaled first by refractory EtCO2 elevation, mixed severe acidosis, hyperkalemia, and rapid hyperthermia; (2) Gold Standard Resuscitation: Turn off volatiles, maximize O2 flows, and give Dantrolene 2.5 mg/kg IV push immediately; (3) Critical Drug Interaction: Calcium channel blockers (Verapamil/Diltiazem) combined with Dantrolene precipitate fatal hyperkalemic asystolic cardiac arrest."
    }
  ]
};
