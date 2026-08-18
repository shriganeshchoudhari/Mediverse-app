/**
 * Postgraduate Advanced General Surgery & Trauma: REBOA & Aortic Balloon Occlusion Zones
 * Authoritative trauma resuscitation content derived from Joint Trauma System (JTS) Guidelines, AAST REBOA Protocols.
 * Mapped to NMC PG CBME Competencies: PG3.3, TR1.1, TR1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const REBOA_AORTIC_BALLOON_OCCLUSION_ZONES_MODULE: PhysiologyLessonModule = {
  id: "pg3-reboa-aortic-balloon-occlusion-zones",
  unitCode: "PG3.3",
  title: "Resuscitative Endovascular Balloon Occlusion of the Aorta (REBOA): Anatomical Zones, Timing & pREBOA",
  competencies: ["PG3.3", "TR1.1", "TR1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# REBOA & Non-Compressible Torso Hemorrhage (NCTH)

Resuscitative Endovascular Balloon Occlusion of the Aorta (REBOA) provides minimally invasive aortic cross-clamping to redistribute cardiac output to the heart and brain.

---

## 1. Aortic Anatomical Zones for REBOA Cannulation

$$\\begin{array}{lcccc}
\\hline
\\textbf{REBOA Zone} & \\textbf{Anatomical Landmarks} & \\textbf{Primary Trauma Indications} & \\textbf{Maximum Occlusion Time} \\\\
\\hline
\\textbf{Zone 1} & \\mathbf{\\text{Left Subclavian Artery to Celiac Artery}} & \\mathbf{\\text{Subdiaphragmatic exsanguinating hemorrhage,}} & \\mathbf{\\le 30\\text{ minutes}} \\\\
(\\textbf{Thoracic Aorta}) & (T4 - T12\\text{ vertebral levels, } \\sim 45-50\\text{ cm insertion}) & \\text{ruptured AAA, intra-abdominal NCTH} & (\\text{strict max } 45\\text{ min}) \\\\
\\textbf{Zone 2} & \\mathbf{\\text{Celiac Artery to Lowest Renal Artery}} & \\mathbf{\\text{STRICTLY CONTRAINDICATED / NO-OCCLUSION ZONE}} & \\mathbf{\\text{ZERO MINUTES}} \\\\
(\\textbf{Paravisceral}) & (T12 - L1/L2\\text{ vertebral levels}) & \\text{Risk of complete mesenteric and renal infarction} & (\\mathbf{\\text{DO NOT INFLATE}}) \\\\
\\textbf{Zone 3} & \\mathbf{\\text{Lowest Renal Artery to Aortic Bifurcation}} & \\mathbf{\\text{Massive pelvic fracture hemorrhage,}} & \\mathbf{\\le 60\\text{ minutes}} \\\\
(\\textbf{Infrarenal Aorta}) & (L2 - L4/L5\\text{ vertebral levels, } \\sim 20-25\\text{ cm insertion}) & \\text{groin/junctional femoral vascular disruption} & \\\\
\\hline
\\end{array}$$

---

## 2. REBOA Cannulation & Balloon Inflation Technique

- **Arterial Access**:
  - $7\\text{ Fr}$ or low-profile $4-5\\text{ Fr}$ sheath placed into the common femoral artery under direct ultrasound guidance or surgical cutdown.
- **Inflation & Resuscitative Response**:
  - Inflate balloon with radiopaque contrast-saline mixture until loss of distal pulse or return of tactile resistance ($8-20\\text{ mL}$ in Zone 1; $2-5\\text{ mL}$ in Zone 3).
  - Immediate physiological effect: Drastic rise in central aortic systolic pressure, restoring myocardial coronary and cerebral perfusion.

---

## 3. Ischemic Complications & Partial REBOA (pREBOA)

- **Ischemic-Reperfusion Penalty**:
  - Prolonged Zone 1 occlusion ($>30-45\\text{ min}$) produces severe lower-body lactic acidosis, spinal cord ischemia/paraplegia, acute tubular necrosis, and massive hyperkalemic cardiac arrest upon balloon deflation.
- **Partial REBOA (pREBOA)**:
  - Controlled micro-deflation permitting low-volume low-pressure distal pulsatile flow, prolonging safe occlusion windows while surgical hemostasis is completed.
`,
  clinicalVignettes: [
    {
      scenario: "A 38-year-old male is rushed to the trauma bay following an industrial crush injury, presenting with an open-book pelvic fracture, bilateral femoral neck fractures, and massive retroperitoneal hematoma. On arrival, he is in unrecordable hemorrhagic shock (BP 55/30 mmHg, HR 155 bpm). While rapid blood transfusion is initiated, the trauma fellow accesses the right common femoral artery and advances a 7 Fr REBOA catheter to an insertion depth of 22 cm, confirming infrarenal positioning via portable pelvic radiograph.",
      question: "Which aortic zone is targeted, what is the balloon occlusion time limit, and what zone must NEVER be inflated?",
      options: [
        "The catheter is positioned in Zone 3 (infrarenal aorta, between the lowest renal artery and aortic bifurcation) to control massive pelvic and groin hemorrhage, with a safe occlusion time limit of up to 60 minutes; Zone 2 (paravisceral aorta between celiac and renal arteries) is strictly contraindicated and must never be occluded due to the catastrophic risk of total mesenteric and renal necrosis",
        "The catheter is in Zone 1; safe occlusion time is 4 hours; Zone 3 is contraindicated",
        "The catheter is in the thoracic arch; safe occlusion time is unlimited",
        "The catheter is in the pulmonary trunk; no inflation is permitted"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates REBOA procedural standards: (1) Zone 3 Positioning: Infrarenal aorta (L2-L4, ~20-25 cm depth) is ideal for severe pelvic fractures and junctional femoral hemorrhage, allowing up to 60 minutes of occlusion while pelvic angioembolization or preperitoneal packing is executed; (2) Zone 2 Contraindication: Zone 2 covers visceral branches (SMA, renal arteries), and balloon inflation here produces irreversible bowel gangrene and acute renal failure without any hemodynamic advantage."
    }
  ]
};
