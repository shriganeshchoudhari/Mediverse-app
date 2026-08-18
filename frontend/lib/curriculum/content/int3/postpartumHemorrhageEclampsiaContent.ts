/**
 * Internship Core Clinical Postings: Obstetric Emergencies: Postpartum Hemorrhage & Eclampsia
 * Authoritative obstetric emergency content derived from Williams Obstetrics, ACOG Practice Bulletins.
 * Mapped to NMC CBME Competencies: IN3.1, OG3.1, EM3.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const POSTPARTUM_HEMORRHAGE_ECLAMPSIA_MODULE: PhysiologyLessonModule = {
  id: "int3-postpartum-hemorrhage-eclampsia",
  unitCode: "IN3.1",
  title: "Obstetric Emergencies: Postpartum Hemorrhage (4 Ts & Uterotonic Escalation) & Severe Preeclampsia / Eclampsia",
  competencies: ["IN3.1", "OG3.1", "EM3.1"],
  estimatedMinutes: 150,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Postpartum Hemorrhage (PPH) & Hypertensive Obstetric Emergencies

Prompt identification of the \"4 Ts\" of postpartum hemorrhage and protocolized seizure prophylaxis with magnesium sulfate prevent maternal morbidity and mortality.

---

## 1. Postpartum Hemorrhage (PPH) & The 4 Ts Etiological Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{Etiological Category} & \\textbf{Incidence / Underlying Cause} & \\textbf{Physical Exam Findings} & \\textbf{First-Line Management Protocol} \\\\
\\hline
\\textbf{Tone (Uterine Atony)} & \\mathbf{70-80\\% \\text{ (Most common); multiparity,}} & \\mathbf{\\text{Soft, boggy, poorly contracted}} & \\mathbf{\\text{Bimanual uterine massage;}} \\\\
& \\text{polyhydramnios, prolonged labor} & \\mathbf{\\text{uterus above the umbilicus}} & \\mathbf{\\text{uterotonic drug escalation}} \\\\
\\textbf{Tissue (Retained Products)} & \\sim 10\\%\\text{; retained cotyledons, succenturiate lobe} & \\text{Placental defect on inspection} & \\text{Manual exploration / suction curettage} \\\\
\\textbf{Trauma (Lacerations)} & \\sim 15-20\\%\\text{; cervical/vaginal tears, hematoma} & \\mathbf{\\text{Firm contracted uterus + continuous active bleed}} & \\text{Surgical exposure and layer repair} \\\\
\\textbf{Thrombin (Coagulopathy)} & < 1\\%\\text{; DIC, placental abruption, AFE} & \\text{Oozing from IV sites, unformed clots} & \\text{MTP 1:1:1, Fibrinogen, TXA } 1\\text{ g IV} \\\\
\\hline
\\end{array}$$

---

## 2. Uterotonic Pharmacological Escalation Hierarchy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pharmacological Agent} & \\textbf{Standard Dosing \u0026 Route} & \\textbf{Mechanism of Action} & \\textbf{CRITICAL Contraindications} \\\\
\\hline
\\textbf{1. Oxytocin (Pitocin)} & 10-40\\text{ units in } 1\\text{L crystalloid IV} & \\text{Gq-coupled oxytocin receptor agonist;} & \\text{Avoid rapid undiluted IV bolus} \\\\
& \\text{infusion or } 10\\text{ units IM} & \\text{rhythmic myometrial contraction} & \\text{(hypotension, flushing)} \\\\
\\textbf{2. Methylergonovine} & \\mathbf{0.2\\text{ mg IM (never IV)}} & \\text{Ergot alkaloid; sustained tetanic} & \\mathbf{\\text{STRICTLY CONTRAINDICATED in HYPERTENSION}} \\\\
(\\textbf{Methergine}) & & \\text{myometrial smooth muscle contraction} & \\mathbf{\\text{or Preeclampsia (hypertensive crisis/stroke)}} \\\\
\\textbf{3. Carboprost Tromethamine} & \\mathbf{250\\text{ }\\mu\\text{g IM q15-90 min}} & \\text{Prostaglandin } F_{2\\alpha}\\text{ analog;} & \\mathbf{\\text{STRICTLY CONTRAINDICATED in ASTHMA}} \\\\
(\\textbf{Hemabate}) & (\\text{max 8 doses = } 2\\text{ mg}) & \\text{myometrial and vascular contraction} & \\mathbf{\\text{(induces severe fatal bronchospasm)}} \\\\
\\textbf{4. Misoprostol (Cytotec)} & 800-1{,}000\\text{ }\\mu\\text{g PR / sublingual} & \\text{Prostaglandin } E_1\\text{ analog} & \\text{Shivering, transient pyrexia} \\\\
\\textbf{5. Tranexamic Acid (TXA)} & \\mathbf{1\\text{ g IV in } 100\\text{ mL NS over 10 min}} & \\text{Antifibrinolytic; prevents clot lysis} & \\mathbf{\\text{Administer within 3 hours of delivery}} \\\\
\\hline
\\end{array}$$

---

## 3. Severe Preeclampsia & Eclampsia Emergency Management

$$\\begin{array}{lcccc}
\\hline
\\textbf{Intervention} & \\textbf{Drug Regimen \u0026 Dosing} & \\textbf{Therapeutic Target / Sign} & \\textbf{Toxicity \u0026 Antidote Management} \\\\
\\hline
\\textbf{Seizure Prophylaxis} & \\mathbf{MgSO_4 \\text{ 4-6 g IV bolus over 20 min}} & \\text{Therapeutic serum } Mg^{2+}: & \\text{Loss of patellar reflex (7-10 mEq/L)} \\\\
\\textbf{\u0026 Termination} & \\mathbf{\\rightarrow 1-2\\text{ g/hr maintenance for 24h}} & 4.8-8.4\\text{ mg/dL (2-3.5 mmol/L)} & \\text{Respiratory arrest (10-13 mEq/L)} \\\\
& & & \\mathbf{\\text{ANTIDOTE: Calcium Gluconate 1 g IV stat}} \\\\
\\textbf{Acute Antihypertensives} & \\text{IV Labetalol (20} \\rightarrow \\text{40} \\rightarrow \\text{80 mg) or} & \\mathbf{\\text{Target BP: SBP } 140-150\\text{ mmHg}} & \\text{Avoid maternal hypotension to maintain} \\\\
& \\text{IV Hydralazine (5-10 mg) or PO Nifedipine} & \\mathbf{\\text{and DBP } 90-100\\text{ mmHg}} & \\text{adequate uteroplacental perfusion} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old G3P3 woman delivers a 4,200 g infant after a prolonged second stage of labor. Ten minutes post-delivery, the obstetric nurse notes heavy vaginal bleeding with large clots (>1,200 mL). Physical examination reveals a soft, doughy, poorly contracted uterus that extends 3 cm above the umbilicus. Her medical history is notable for moderate persistent asthma requiring daily inhaled fluticasone and albuterol. Her blood pressure is 118/74 mmHg and pulse is 112 bpm. Bimanual uterine massage and high-dose IV Oxytocin infusion are immediately initiated, but active bleeding continues.",
      question: "Which of the following next-line uterotonic medications is SAFEST and most appropriate, and which drug is STRICTLY CONTRAINDICATED?",
      options: [
        "Administer Methylergonovine (Methergine 0.2 mg IM) or Misoprostol (800-1,000 mcg PR); Carboprost Tromethamine (Hemabate) is STRICTLY CONTRAINDICATED due to her history of asthma (causes life-threatening bronchospasm and hypoxic arrest)",
        "Administer Carboprost Tromethamine immediately; Methylergonovine is contraindicated because of asthma",
        "Hold all uterotonics and schedule elective uterine artery embolization tomorrow",
        "Administer high-dose subcutaneous terbutaline to relax the myometrium"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates the critical pharmacological contraindications in postpartum hemorrhage uterotonic escalation: (1) Uterine Atony: The soft, boggy uterus is responsible for uterine atony (Tone - 70-80% of PPH); (2) Carboprost Tromethamine (Hemabate): As a Prostaglandin F2-alpha analog, carboprost causes potent bronchial smooth muscle constriction and is STRICTLY CONTRAINDICATED in patients with asthma; (3) Methylergonovine (Methergine): An ergot alkaloid that causes intense vasoconstriction; safe in normotensive patients but strictly contraindicated in gestational hypertension or preeclampsia; (4) Evidence-based Management: Methylergonovine 0.2 mg IM, Misoprostol 800-1,000 mcg sublingual/rectal, and IV Tranexamic acid (TXA 1 g) are appropriate choices."
    }
  ]
};
