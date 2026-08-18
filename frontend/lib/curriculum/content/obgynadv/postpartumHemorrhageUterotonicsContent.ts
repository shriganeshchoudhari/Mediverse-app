/**
 * Clinical Obgyn Advanced: Postpartum Hemorrhage (PPH) & Uterotonic Escalation
 * Authoritative obstetric content derived from Williams Obstetrics (26th ed.), ACOG PPH Practice Guidelines.
 * Mapped to NMC CBME Competencies: OG3.1, OG3.2, MD44.2, SU42.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE: PhysiologyLessonModule = {
  id: "obgyn-adv-postpartum-hemorrhage",
  unitCode: "OG3.1",
  title: "Postpartum Hemorrhage (PPH): The 4 'T's, Uterotonic Escalation & Surgical Hemostasis",
  competencies: ["OG3.1", "OG3.2", "MD44.2", "SU42.2"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Postpartum Hemorrhage (PPH): The 4 'T's & Uterotonic Escalation

Postpartum Hemorrhage (cumulative blood loss $\\ge 1{,}000\\text{ mL}$ or hypovolemic signs within $24\\text{ hours}$) is a major cause of maternal mortality, managed by rapid etiology-specific triage and systematic uterotonic escalation.

---

## 1. The 4 'T's of Postpartum Hemorrhage Etiology

$$\\begin{array}{lcccc}
\\hline
\\textbf{Etiologic 'T'} & \\textbf{Incidence} & \\textbf{Clinical Pathology} & \\textbf{Physical Examination Signs} & \\textbf{Initial Targeted Management} \\\\
\\hline
\\textbf{1. Tone} & \\mathbf{\\approx 70\\%} & \\mathbf{\\text{Uterine Atony (failure of myometrium}} & \\mathbf{\\text{Soft, boggy uterus above the}} & \\mathbf{\\text{Bimanual uterine massage}} \\\\
& & \\text{to contract and occlude spiral arteries)} & \\mathbf{\\text{umbilicus with active pooling}} & + \\mathbf{\\text{Stepwise Uterotonics}} \\\\
\\textbf{2. Trauma} & \\approx 20\\% & \\text{Cervical/vaginal lacerations, hematomas,} & \\text{Firm contracted uterus with continuous} & \\text{Surgical exposure and anatomical} \\\\
& & \\text{uterine rupture, acute uterine inversion} & \\text{bright red bleeding; pelvic mass} & \\text{repair / Johnson inversion maneuver} \\\\
\\textbf{3. Tissue} & \\approx 10\\% & \\text{Retained cotyledons, succenturiate lobe,} & \\text{Missing placental fragments on exam;} & \\text{Manual uterine exploration /} \\\\
& & \\text{placenta accreta / increta / percreta} & \\text{ultrasound reveals echogenic mass} & \\text{curettage / cesarean hysterectomy} \\\\
\\textbf{4. Thrombin} & \\approx 1\\% & \\text{Coagulopathy (DIC, abruptio placentae,} & \\text{Generalized oozing from IV sites,} & \\text{Massive transfusion protocol (1:1:1),} \\\\
& & \\text{amniotic fluid embolism, severe HELLP)} & \\text{petechiae, absent clot formation} & \\text{Tranexamic Acid (TXA), Cryoprecipitate} \\\\
\\hline
\\end{array}$$

---

## 2. Pharmacological Uterotonic Escalation & Critical Contraindications

$$\\begin{array}{lcccc}
\\hline
\\textbf{Uterotonic Drug} & \\textbf{Route \u0026 Standard Dosing} & \\textbf{Mechanism of Action} & \\textbf{CRITICAL CONTRAINDICATIONS} & \\textbf{Side Effects} \\\\
\\hline
\\textbf{1. Oxytocin (Pitocin)} & \\mathbf{10 - 40\\text{ U in } 1{,}000\\text{ mL IV} \\mid 10\\text{ U IM}} & \\text{Oxytocin receptor agonist (Gq)} & \\text{None (First-line for ALL atony)} & \\text{Hypotension, water intoxication} \\\\
\\textbf{2. Methylergonovine} & \\mathbf{0.2\\text{ mg IM (NEVER IV!)}} & \\text{Ergot alkaloid (alpha agonist)} & \\mathbf{\\text{HYPERTENSION / PREECLAMPSIA}} & \\mathbf{\\text{Severe hypertension, stroke,}} \\\\
(\\text{Methergine}) & \\text{Repeat every } 2 - 4\\text{ hours} & & (\\text{causes vasoconstrictive crisis}) & \\text{seizures, coronary spasm} \\\\
\\textbf{3. Carboprost} & \\mathbf{250\\,\\mu\\text{g IM (or intramyometrial)}} & \\text{Prostaglandin } \\text{F}_{2\\alpha} \\text{ analog} & \\mathbf{\\text{ASTHMA / REACTIVE AIRWAYS}} & \\mathbf{\\text{Bronchospasm, severe diarrhea,}} \\\\
(\\text{Hemabate}) & \\text{Repeat every } 15 - 90\\text{ min (max } 8\\text{ doses)} & & (\\text{causes severe bronchoconstriction}) & \\text{pyrexia, hypertension} \\\\
\\textbf{4. Misoprostol} & \\mathbf{800 - 1{,}000\\,\\mu\\text{g sublingual / rectal}} & \\text{Prostaglandin } \\text{E}_1 \\text{ analog} & \\text{Few contraindications} & \\text{High fevers, shivering, nausea} \\\\
(\\text{Cytotec}) & (\\text{single dose}) & & & \\\\
\\textbf{5. Tranexamic Acid} & \\mathbf{1\\text{ g IV in } 100\\text{ mL over } 10\\text{ min}} & \\text{Antifibrinolytic (lysine analog)} & \\text{Active thromboembolic disease} & \\text{Given within } 3\\text{ hours of birth} \\\\
(\\text{TXA}) & (\\text{WOMAN Trial protocol}) & & & \\\\
\\hline
\\end{array}$$

- **Tamponade & Surgical Interventions**:
  - **Bakri Intrauterine Tamponade Balloon**: Instilled with $300 - 500\\text{ mL}$ sterile saline to tamponade the bleeding placental bed.
  - **B-Lynch Uterine Compression Suture**: Brace sutures compressing anterior and posterior uterine walls.
  - **Bilateral Uterine / Internal Iliac Artery Ligation** $\\rightarrow$ **Emergent Peripartum Hysterectomy**.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old G2P2 female with a history of moderate persistent asthma treated with daily inhaled fluticasone/salmeterol delivers a 4,200 g male infant after an augmented 16-hour labor. Ten minutes following spontaneous placental delivery, brisk continuous vaginal bleeding is noted. On examination, her uterus is soft, boggy, and palpated 4 cm above the umbilicus. Estimated blood loss is 1,200 mL. Blood pressure is 118/72 mmHg and heart rate is 110 bpm. She has already received IV Oxytocin (40 units in 1 L NS) with continuous bimanual uterine massage, but significant vaginal pooling of blood continues.",
      question: "Which of the following second-line uterotonic medications is the most appropriate next step, and which common second-line uterotonic is STRICTLY CONTRAINDICATED in this patient?",
      options: [
        "Administer Intramuscular Methylergonovine (0.2 mg IM) or Sublingual Misoprostol (800 mcg); Carboprost Tromethamine (Hemabate) is STRICTLY CONTRAINDICATED due to her history of asthma",
        "Administer Carboprost Tromethamine (Hemabate); Methylergonovine is contraindicated",
        "Administer high-dose intravenous Magnesium Sulfate",
        "Perform immediate emergent hysterectomy without attempting further uterotonics"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is suffering from severe Postpartum Hemorrhage (PPH) secondary to Uterine Atony (the most common cause, responsible for ~70% of PPH). When oxytocin and bimanual massage fail, second-line uterotonics must be selected based on specific patient contraindications: (1) Carboprost Tromethamine (Hemabate, a PGF2a analog) is a potent bronchoconstrictor and is STRICTLY CONTRAINDICATED in patients with asthma; (2) Methylergonovine (Methergine, an ergot alkaloid) is a potent vasoconstrictor and is contraindicated in hypertension/preeclampsia (which this patient does not have); (3) Misoprostol (PGE1, 800-1000 mcg sublingual or rectal) is safe in both asthma and hypertension. Therefore, Methylergonovine or Misoprostol is indicated, while Carboprost is contraindicated."
    }
  ]
};
