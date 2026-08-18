/**
 * Postgraduate Advanced Orthopedics & Trauma Critical Care: Pelvic Ring Disruptions & Hemorrhage Control
 * Authoritative orthopedic trauma content derived from Young-Burgess, Tile Pelvic Classifications, EAST/OTA Guidelines.
 * Mapped to NMC PG CBME Competencies: PG7.1, OR1.1, OR1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE: PhysiologyLessonModule = {
  id: "pg7-pelvic-ring-disruption-hemorrhage",
  unitCode: "PG7.1",
  title: "Pelvic Ring Disruptions: Young-Burgess Patterns, Pelvic Binder & Preperitoneal Packing Protocols",
  competencies: ["PG7.1", "OR1.1", "OR1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Pelvic Ring Disruptions, Young-Burgess Classification & Hemorrhage Control

High-energy pelvic ring fractures carry mortality rates up to 40% in hemodynamically unstable patients, driven by catastrophic presacral venous plexus and internal iliac arterial hemorrhage.

---

## 1. Young-Burgess Classification & Biomechanical Stability

$$\\begin{array}{lcccc}
\\hline
\\textbf{Mechanism Pattern} & \\textbf{Subtype} & \\textbf{Anatomic Ligamentous Injury} & \\textbf{Mechanical Stability} & \\textbf{Hemorrhage Risk} \\\\
\\hline
\\textbf{Lateral Compression} & \\textbf{LC-I} & \\text{Sacral crush on impact side; rami fx} & \\text{Mechanically stable} & \\text{Low} \\\\
(\\textbf{LC}) & \\textbf{LC-II} & \\text{Iliac crescent fx; posterior SI torn} & \\text{Rotationally unstable} & \\text{Moderate} \\\\
& \\textbf{LC-III} & \\mathbf{\\text{''Windswept pelvis'' (LC + contralateral APC)}} & \\mathbf{\\text{Rotationally unstable}} & \\mathbf{\\text{High}} \\\\
\\textbf{Anterior-Posterior} & \\textbf{APC-I} & \\text{Symphysis diastasis } < 2.5\\text{ cm; intact SI} & \\text{Mechanically stable} & \\text{Low} \\\\
(\\textbf{APC / ''Open Book''}) & \\textbf{APC-II} & \\mathbf{\\text{Diastasis } > 2.5\\text{ cm; anterior SI torn}} & \\mathbf{\\text{Rotationally unstable}} & \\mathbf{\\text{High (venous plexus)}} \\\\
& \\textbf{APC-III} & \\mathbf{\\text{Complete SI disruption (anterior + posterior)}} & \\mathbf{\\text{Rotational + Vertical unstable}} & \\mathbf{\\text{Severe / Lethal}} \\\\
\\textbf{Vertical Shear} & \\textbf{VS} & \\mathbf{\\text{Vertical displacement through rami \\& SI}} & \\mathbf{\\text{Completely unstable (vertical + rot)}} & \\mathbf{\\text{Massive}} \\\\
\\hline
\\end{array}$$

---

## 2. Stepwise Damage Control Resuscitation & Hemorrhage Control

$$\\begin{array}{lcccc}
\\hline
\\textbf{Intervention Step} & \\textbf{Clinical Standard / Technique} & \\textbf{Mechanism \\& Critical Caveats} \\\\
\\hline
\\textbf{1. Pelvic Binder} & \\mathbf{\\text{Place PCCD centered over the Greater Trochanters}} & \\mathbf{\\text{Decreases pelvic volume, promotes clot tamponade}} \\\\
& (\\mathbf{\\text{NOT over the iliac crests}}) & \\text{Reduces presacral venous plexus bleeding by } > 80\\% \\\\
\\textbf{2. Preperitoneal Packing} & \\mathbf{\\text{Infraumbilical midline incision into Retzius space;}} & \\mathbf{\\text{Rapid direct tamponade of retroperitoneal veins;}} \\\\
(\\text{PPP}) & \\mathbf{\\text{pack 3-6 pads bilaterally down to SI joints}} & \\text{performed at bedside/OR in } < 15\\text{ minutes} \\\\
\\textbf{3. External Fixation} & \\mathbf{\\text{Anterior pelvic external fixator or C-clamp}} & \\text{Provides rigid skeletal stability against re-expansion} \\\\
\\textbf{4. Angioembolization} & \\mathbf{\\text{Selective transcatheter embolization of internal iliac}} & \\mathbf{\\text{Indicated for persistent arterial blush after PPP}} \\\\
& (\\text{superior gluteal, internal pudendal, lateral sacral}) & \\text{or contrast extravasation on trauma CT} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old construction worker is brought to the trauma center following a 25-foot fall from scaffolding. On arrival, he is pale, diaphoresis is noted, BP is 74/42 mmHg, HR 138 bpm. Pelvic examination reveals gross mechanical instability with abnormal external rotation of both hemipelves ('open book' deformity). AP pelvic radiograph confirms an APC-III pelvic ring disruption with a 4.5 cm pubic symphysis diastasis and complete disruption of the right sacroiliac joint. Focused Assessment with Sonography for Trauma (FAST) is negative for free intraperitoneal fluid.",
      question: "What is the immediate mechanical stabilization maneuver, and if hypotension persists despite balanced 1:1:1 blood transfusion, what is the next surgical damage-control intervention?",
      options: [
        "Immediately apply a pelvic circumferential compression device (pelvic binder) centered precisely over the Greater Trochanters (not the iliac crests) to reduce pelvic volume and tamponade the presacral venous plexus; if hemodynamic instability persists despite binder placement and massive transfusion, proceed immediately to operative Preperitoneal Pelvic Packing (PPP) in the Retzius space followed by selective internal iliac angioembolization if arterial extravasation is present",
        "Perform immediate exploratory laparotomy with pelvic exenteration",
        "Place a pelvic binder high over the iliac crests and observe for 24 hours without transfusions",
        "Administer IV heparin and perform closed reduction under traction"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic high-energy pelvic ring collapse: (1) Immediate Mechanics: Pelvic binders must be centered over the greater trochanters to maximize leverage and close the pelvic ring; (2) Source of Hemorrhage: Over 85% of pelvic bleeding arises from the low-pressure presacral venous plexus and bleeding cancellous bone; (3) Hemorrhage Protocol: Refractory hypotension requires urgent Preperitoneal Pelvic Packing (PPP) in the space of Retzius to pack the pelvic brim directly against the SI joints, with angioembolization reserved for arterial bleeding."
    }
  ]
};
