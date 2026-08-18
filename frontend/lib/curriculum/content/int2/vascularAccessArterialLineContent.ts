/**
 * Internship Core Clinical Postings: Vascular Access & Arterial Cannulation
 * Authoritative procedure content derived from Roberts and Hedges, Tintinalli, ASA Guidelines.
 * Mapped to NMC CBME Competencies: IN2.1, EM2.1, AN2.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VASCULAR_ACCESS_ARTERIAL_LINE_MODULE: PhysiologyLessonModule = {
  id: "int2-vascular-access-arterial-line",
  unitCode: "IN2.1",
  title: "Vascular Access & Arterial Lines: Central Venous Catheterization (IJV/Subclavian Seldinger) & Radial A-Line Placement",
  competencies: ["IN2.1", "EM2.1", "AN2.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Central Venous Catheterization (Seldinger Technique) & Ultrasound-Guided Arterial Lines

Sterile vascular cannulation provides essential central venous pressure monitoring, caustic vasopressor infusions, and real-time beat-to-beat arterial manometry.

---

## 1. Central Venous Catheter (CVC) Anatomical Approaches

$$\\begin{array}{lcccc}
\\hline
\\textbf{Vascular Site} & \\textbf{Anatomical Landmarks \u0026 Puncture Vector} & \\textbf{Ultrasound Features} & \\textbf{Primary Complications \u0026 Risks} \\\\
\\hline
\\textbf{Internal Jugular} & \\mathbf{\\text{Apex of SCM triangle; angle } 45^{\\circ} \\text{ toward ipsilateral nipple}} & \\mathbf{\\text{Compressible, non-pulsatile; lateral to carotid}} & \\text{Carotid puncture (}\\sim 1-3\\%\\text{), hematoma} \\\\
\\textbf{Subclavian Vein} & \\text{Infraclavicular, junction of medial/middle 1/3 clavicle } & \\text{Acoustic shadow beneath clavicle} & \\mathbf{\\text{Pneumothorax (}\\sim 1-5\\%\\text{); non-compressible}} \\\\
& \\text{aimed toward suprasternal notch} & & \\text{bleeding in coagulopathy} \\\\
\\textbf{Femoral Vein} & \\mathbf{\\text{NAVEL (Nerve, Artery, Vein, Empty, Lymphatics);}} & \\text{Medial to pulsating common femoral artery} & \\mathbf{\\text{Highest DVT and catheter infection rates;}} \\\\
& 1-2\\text{ cm medial to femoral pulse} & & \\text{avoid long-term cannulation} \\\\
\\hline
\\end{array}$$

---

## 2. Ultrasound-Guided Seldinger Cannulation Steps

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step} & \\textbf{Procedural Action} & \\textbf{Physiological Safety Rationale} \\\\
\\hline
\\textbf{1. Sterile Prep \u0026 Drape} & \\text{Chlorhexidine skin prep; full-body sterile drape; sterile probe sheath} & \\text{Prevents Central Line-Associated Bloodstream Infections (CLABSI)} \\\\
\\textbf{2. Ultrasound Needle Guidance} & \\mathbf{\\text{Real-time needle-tip tracking into vascular lumen under dynamic ultrasound}} & \\mathbf{\\text{Direct visualization avoids transfixing vein or puncturing adjacent artery}} \\\\
\\textbf{3. Venous Flash \u0026 Aspiration} & \\text{Aspirate non-pulsatile dark venous blood; remove syringe} & \\text{Confirms intraluminal position without high-pressure arterial backflow} \\\\
\\textbf{4. Guidewire Insertion} & \\mathbf{\\text{Advance J-tip guidewire gently (never force resistance); verify in vein}} & \\mathbf{\\text{Resistance signals extravascular placement or vessel wall abutment}} \\\\
\\textbf{5. Skin Nick \u0026 Dilation} & \\text{Scalpel skin nick; advance vascular dilator over wire across skin/fascia only} & \\text{Dilates subcutaneous tract; avoid advancing dilator into cardiac chambers} \\\\
\\textbf{6. Catheter Advance \u0026 Suture} & \\text{Advance CVC over wire; remove wire; aspirate/flush all lumens; suture secure} & \\mathbf{\\text{NEVER lose control of the guidewire during any procedural step}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with septic shock refractory to fluid resuscitation requires high-dose Norepinephrine and Vasopressin infusions. The emergency physician prepares to insert a right internal jugular central venous catheter using ultrasound guidance. A linear high-frequency transducer is placed at the apex of the sternocleidomastoid triangle. Two round vascular structures are visualized in the transverse plane.",
      question: "How does the operator definitively confirm the Internal Jugular Vein and distinguish it from the Common Carotid Artery prior to needle puncture?",
      options: [
        "The Internal Jugular Vein is located laterally, is thin-walled and easily compressible with gentle transducer downward pressure, and expands during a Valsalva maneuver; the Carotid Artery is medial, thick-walled, pulsatile, and resists gentle compression",
        "The Internal Jugular Vein is thick-walled, non-compressible, and pulsates vigorously",
        "Puncture the medial vessel immediately without checking compressibility",
        "Apply high-dose intravenous heparin prior to vascular imaging"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario highlights real-time procedural sonography for vascular access: (1) Anatomical Relationship: The Internal Jugular Vein (IJV) typically lies anterior-lateral to the Common Carotid Artery; (2) Compression Sign: The definitive characteristic of a vein is complete luminal collapse under gentle pressure applied with the ultrasound probe, whereas the carotid artery has a thick muscular wall that resists compression and exhibits systolic pulsation; (3) Venous Maneuvers: The IJV engorges with respiratory expiration, Trendelenburg positioning, or a Valsalva maneuver."
    }
  ]
};
