/**
 * Clinical Anesthesiology Advanced: Difficult Airway Algorithms & Emergency Cricothyroidotomy
 * Authoritative anesthesiology content derived from Miller's Anesthesia (9th ed.), ASA Guidelines.
 * Mapped to NMC CBME Competencies: AN1.1, AN1.2, MD50.1, SU48.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DIFFICULT_AIRWAY_CRICOTHYROIDOTOMY_MODULE: PhysiologyLessonModule = {
  id: "anesthesiology-adv-difficult-airway-cricothyroidotomy",
  unitCode: "AN1.1",
  title: "Difficult Airway Algorithms: LEMON Score, Mallampati I-IV, Cormack-Lehane & Scalpel-Bougie-Tube FONA",
  competencies: ["AN1.1", "AN1.2", "MD50.1", "SU48.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Difficult Airway Algorithms: LEMON, Video Laryngoscopy & Emergency FONA

Anticipating the difficult airway, executing the ASA Difficult Airway Algorithm, and performing emergent Front-of-Neck Access (FONA) in a Cannot Intubate, Cannot Oxygenate (CICO) scenario are essential life-saving skills.

---

## 1. Difficult Airway Assessment \u0026 Classification Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Assessment Tool} & \\textbf{Class / Grade Definition} & \\textbf{Anatomical Visualized Structures} & \\textbf{Airway Difficulty Risk} & \\textbf{Actionable Management Strategy} \\\\
\\hline
\\textbf{Mallampati Class I} & \\text{Full visibility} & \\text{Soft palate, uvula, fauces, pillars} & \\text{Low risk of difficult intubation} & \\text{Standard direct / video laryngoscopy} \\\\
\\textbf{Mallampati Class II} & \\text{Partial uvula} & \\text{Soft palate, fauces, uvula} & \\text{Low-to-moderate difficulty} & \\text{Standard laryngoscopy with stylet} \\\\
\\textbf{Mallampati Class III} & \\mathbf{\\text{Base of uvula only}} & \\mathbf{\\text{Soft palate and base of uvula}} & \\mathbf{\\text{High risk of difficult intubation}} & \\mathbf{\\text{Video laryngoscopy + Bougie on standby}} \\\\
\\textbf{Mallampati Class IV} & \\mathbf{\\text{Hard palate only}} & \\mathbf{\\text{Hard palate only (no soft palate)}} & \\mathbf{\\text{Extremely high risk of failure}} & \\mathbf{\\text{Awake Fiberoptic / Video Laryngoscope}} \\\\
\\textbf{Cormack-Lehane 1} & \\text{Full glottis view} & \\text{Vocal cords fully exposed} & \\text{Easy intubation} & \\text{Direct tracheal tube insertion} \\\\
\\textbf{Cormack-Lehane 2a/b} & \\text{Partial glottis view} & \\text{Posterior vocal cords (2a) / arytenoids (2b)} & \\text{Moderate difficulty} & \\text{Tracheal tube introducer (Bougie)} \\\\
\\textbf{Cormack-Lehane 3} & \\mathbf{\\text{Epiglottis only}} & \\mathbf{\\text{Epiglottis visible, glottis hidden}} & \\mathbf{\\text{Severe difficult direct view}} & \\mathbf{\\text{Hyperangulated Video Laryngoscopy}} \\\\
\\textbf{Cormack-Lehane 4} & \\mathbf{\\text{No glottis/epiglottis}} & \\mathbf{\\text{Soft palate only}} & \\mathbf{\\text{Impossible direct intubation}} & \\mathbf{\\text{CICO Algorithm / Supraglottic / FONA}} \\\\
\\hline
\\end{array}$$

---

## 2. ASA Difficult Airway \u0026 CICO Algorithm Progression

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step Level} & \\textbf{Clinical Status} & \\textbf{Intervention / Device} & \\textbf{Failure Trigger} & \\textbf{Next Escalation Step} \\\\
\\hline
\\textbf{Plan A} & \\text{Initial induction} & \\mathbf{\\text{Video Laryngoscopy + Bougie}} & \\text{Failed 3 intubation attempts} & \\text{Transition to Plan B (SAD)} \\\\
& & (\\text{optimize head position, BURP}) & (\\text{limit attempts to prevent trauma}) & \\\\
\\textbf{Plan B} & \\text{Rescue Oxygenation} & \\mathbf{\\text{Supraglottic Airway (LMA ProSeal)}} & \\text{Failed oxygenation / ventilation} & \\text{Transition to Plan C (BVM)} \\\\
& & (\\text{second-generation gastric suction}) & (\\text{high airway seal leak}) & \\\\
\\textbf{Plan C} & \\text{Facemask Rescue} & \\mathbf{\\text{Two-Person Bag-Valve-Mask (BVM)}} & \\text{Inadequate chest rise, } \\text{SpO}_2 \u003c 80\\% & \\mathbf{\\text{DECLARE CICO EMERGENCY!}} \\\\
& & (\\text{oral/nasal airways, jaw thrust}) & (\\mathbf{\\text{Cannot Intubate, Cannot Oxygenate}}) & \\\\
\\textbf{Plan D} & \\mathbf{\\text{Front-of-Neck Access}} & \\mathbf{\\text{Scalpel-Bougie-Tube Cricothyroidotomy}} & \\text{Imminent fatal anoxia / asystole} & \\mathbf{\\text{Definitive cuffed 6.0mm tube in trachea}} \\\\
(\\text{FONA}) & (\\mathbf{\\text{CICO Emergency}}) & (\\text{horizontal incision, bougie, 6.0 tube}) & & \\\\
\\hline
\\end{array}$$

- **The LEMON Airway Assessment Rule**:
  - **L - Look externally**: Facial trauma, morbid obesity, bearded chin, receding mandible.
  - **E - Evaluate 3-3-2 rule**:
    - **Incisor distance $\ge 3\\text{ fingerbreadths}$** ($>4-5\\text{ cm}$).
    - **Hyoid-to-mental distance $\ge 3\\text{ fingerbreadths}$**.
    - **Thyroid notch to floor of mouth $\ge 2\\text{ fingerbreadths}$**.
  - **M - Mallampati Class I to IV**.
  - **O - Obstruction / Obesity**: Stridor, Ludwig angina, peritonsillar abscess, OSA.
  - **N - Neck mobility**: Cervical extension $<35^\\circ$ (ankylosing spondylitis, halo brace).
- **Scalpel-Bougie-Tube Cricothyroidotomy Technique**:
  1. Palpate thyroid cartilage and cricoid ring; identify the **cricothyroid membrane**.
  2. Make a **transverse (horizontal) stab incision** through skin and cricothyroid membrane with a #10 or #20 scalpel blade.
  3. Rotate scalpel $90^\\circ$ or use tracheal hook to maintain patency.
  4. Slide the coudé tip of a **gum-elastic bougie** along the blade into the trachea until hold-up or tracheal clicks are felt ($10-15\\text{ cm}$).
  5. Railroad a **cuffed endotracheal tube (size $6.0\\text{ mm}$)** over the bougie into the airway, inflate cuff, and confirm ventilation with end-tidal $CO_2$.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with morbid obesity (BMI 42 kg/m²), micrognathia, and a history of radiation therapy to the neck for laryngeal cancer is scheduled for urgent laparotomy. General anesthesia is induced with Propofol and Rocuronium. Direct laryngoscopy shows a Cormack-Lehane Grade 4 view (soft palate only). Two attempts with video laryngoscopy and a gum-elastic bougie fail to cannulate the trachea due to severe pharyngeal edema and distorted anatomy. A size 5 LMA ProSeal is placed, but high peak pressures generate zero tidal volume and no end-tidal CO2 waveform. Two-person bag-valve-mask ventilation with oral and nasal airways fails to maintain oxygenation; the patient's SpO2 plummets from 98% to 64%, and heart rate drops from 110 to 38 bpm with profound cyanosis.",
      question: "What airway emergency has occurred, and what is the mandatory next life-saving intervention?",
      options: [
        "Cannot Intubate, Cannot Oxygenate (CICO) emergency; immediately perform emergent Front-of-Neck Access (FONA) via Scalpel-Bougie-Tube Surgical Cricothyroidotomy (horizontal incision over cricothyroid membrane, insert bougie into trachea, and railroad a size 6.0 mm cuffed endotracheal tube)",
        "Attempt a fourth video laryngoscopy with a smaller blade",
        "Administer IV Neostigmine and wait for spontaneous ventilation",
        "Place a blind nasotracheal tube"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is in a catastrophic Cannot Intubate, Cannot Oxygenate (CICO) emergency following failed tracheal intubation, failed supraglottic airway rescue, and failed mask ventilation with life-threatening desaturation and impending hypoxemic cardiac arrest: (1) Emergency Declaration: Once Plan A (intubation), Plan B (SAD/LMA), and Plan C (mask ventilation) fail, the CICO algorithm is immediately declared; (2) FONA Technique: The ASA and DAS difficult airway guidelines mandate emergent Front-of-Neck Access (FONA) via Scalpel-Bougie-Tube Cricothyroidotomy: make a transverse incision across the cricothyroid membrane, insert a gum-elastic bougie caudally into the trachea, and railroad a size 6.0 mm cuffed endotracheal tube to establish definitive oxygenation and save the patient's life."
    }
  ]
};
