/**
 * Postpartum Hemorrhage, 4Ts Framework & Uterotonic Cascade Learning Content
 * Authoritative medical content derived from Williams Obstetrics, ACOG, RCOG, and USMLE Step 2 CK OB/GYN.
 * Mapped to NMC CBME Competencies: OG3.1, OG3.2, OG3.3, OG4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE: PhysiologyLessonModule = {
  id: "obg-pph-uterotonics",
  unitCode: "OG3.1",
  title: "Obstetrics: Postpartum Hemorrhage (4Ts), Uterotonic Pharmacotherapy & Surgical Escalation",
  competencies: ["OG3.1", "OG3.2", "OG3.3", "OG4.1"],
  estimatedMinutes: 140,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Obstetrics: Postpartum Hemorrhage (4Ts), Uterotonic Pharmacotherapy & Surgical Escalation

Postpartum Hemorrhage (**PPH**) remains the leading cause of preventable maternal mortality worldwide. Rapid systematic diagnosis using the **4Ts framework** and algorithmic pharmacological and mechanical escalation is life-saving.

---

## 1. Definition & The 4Ts Etiological Framework

| Etiological "T" | Specific Causes & Frequency | Physical Diagnostic Findings | Immediate Specific Intervention |
| :--- | :--- | :--- | :--- |
| **1. Tone ($70\\text{–}80\\%$)** | **Uterine Atony** (Failure of myometrium to contract and compress spiral arterioles / "living ligatures"). Risk factors: Polyhydramnios, multiple gestation, macrosomia, prolonged labor, chorioamnionitis. | **Boggy, soft, flaccid, enlarged uterus** palpable above the umbilicus with continuous brisk dark red vaginal bleeding. | • Continuous **Bimanual Uterine Compression**.<br>• **Stepwise Uterotonic Drug Cascade**.<br>• Intrauterine Balloon Tamponade (Bakri). |
| **2. Trauma ($20\\%$)** | Cervical lacerations, vaginal tears, uterine rupture, episiotomy extension, broad ligament hematoma. | **Firm, well-contracted ("rock-hard") uterus**, but with persistent brisk, bright-red vaginal bleeding. | Systematic pelvic speculum examination and immediate surgical repair with absorbable sutures. |
| **3. Tissue ($10\\%$)** | Retained placental fragments, missing cotyledon, succenturiate placental lobe, placenta accreta spectrum. | Incomplete placenta on inspection; continuous vaginal bleeding with intermittently relaxed uterus. | Manual uterine exploration under anesthesia $\\pm$ gentle suction curettage. |
| **4. Thrombin ($1\\%$)** | Disseminated Intravascular Coagulation (DIC), severe thrombocytopenia, von Willebrand disease, amniotic fluid embolism. | Oozing from IV puncture sites, un-clotted watery blood, ecchymoses. | Massive Transfusion Protocol ($1:1:1$ PRBC : FFP : Platelets) $+$ Cryoprecipitate (for Fibrinogen $<200\\text{ mg/dL}$) $+$ TXA. |

---

## 2. Stepwise Pharmacological Uterotonic Cascade

| Drug & Route | Standard Dosage & Mechanism | Critical Contraindications & High-Yield Pearls |
| :--- | :--- | :--- |
| **1. Oxytocin (First-Line)** | **$10\\text{–}40\\text{ IU}$ in $1000\\text{ mL}$ IV Crystalloid** (or $10\\text{ IU IM}$). Stimulates rhythmic myometrial contractions. | *Never give as a rapid undiluted IV bolus* (causes profound peripheral vasodilation, hypotension, and collapse). |
| **2. Methylergonovine / Ergometrine** | **$0.2\\text{ mg IM}$** (or IV slowly). Ergot alkaloid producing sustained tetanic myometrial contraction. | **ABSOLUTE CONTRAINDICATION: Hypertension, Preeclampsia, CAD** (triggers malignant hypertensive crisis, intracranial hemorrhage, coronary vasospasm). |
| **3. 15-methyl Prostaglandin F2$\\alpha$ (Carboprost / Hemabate)** | **$250\\text{ mcg IM}$** (repeated q15–90 min, max 8 doses). Potent prostaglandin $F_{2\\alpha}$ analogue. | **ABSOLUTE CONTRAINDICATION: Bronchial Asthma** (causes potent bronchoconstriction and life-threatening status asthmaticus). Common side effect: Severe diarrhea/fever. |
| **4. Misoprostol (PGE1)** | **$800\\text{ mcg}$ sublingual or rectal**. Synthetic prostaglandin E1 analogue. | Safe in asthma and hypertension. Universal availability; useful in low-resource settings. |
| **5. Tranexamic Acid (TXA)** | **$1\\text{ g IV}$ over 10 min** (give within 3 hours of birth; WOMAN trial). | Antifibrinolytic; significantly reduces maternal mortality from bleeding without increasing thromboembolism risk. |

---

## 3. Mechanical & Surgical Escalation Protocol

1. **Bimanual Uterine Compression**: One gloved hand in the anterior vaginal fornix compressing the anterior uterine wall while the abdominal hand compresses the posterior fundus against the pubic bone.
2. **Intrauterine Balloon Tamponade (Bakri Balloon)**: Filled with $300-500\\text{ mL}$ of sterile isotonic saline; creates hydrostatic pressure against uterine walls (tamponade test positive $\\implies$ bleeding stops).
3. **Uterine Compression Sutures**: **B-Lynch Suture** (brace suture compressing anterior and posterior uterine walls vertically during laparotomy).
4. **Stepwise Vascular Ligation**: Bilateral Uterine Artery Ligation (O\'Leary) $\\rightarrow$ Internal Iliac (Hypogastric) Artery Ligation.
5. **Definitive Salvage**: **Subtotal / Total Emergency Peripartum Hysterectomy** (life-saving measure when refractory to all conservative measures).
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old female with severe preeclampsia (BP 168/112 mmHg) delivers a 4.2 kg infant vaginally. Five minutes following placental expulsion, the midwife notes brisk vaginal bleeding (> 700 mL). Physical examination reveals a soft, boggy, poorly contracted uterus palpable 3 cm above the umbilicus. Continuous fundal massage and IV oxytocin infusion (40 IU in 1 L NS) fail to arrest the uterine bleeding.",
      question: "Which of the following uterotonic medications is STRICTLY CONTRAINDICATED in this patient?",
      options: [
        "Intramuscular Methylergonovine (Methergine)",
        "Intramuscular Carboprost (15-methyl PGF2alpha)",
        "Sublingual Misoprostol (PGE1)",
        "Intravenous Tranexamic Acid (TXA)"
      ],
      correctAnswerIndex: 0,
      explanation: "Methylergonovine (Methergine) is an ergot alkaloid that induces generalized peripheral vasoconstriction and sustained smooth muscle contraction. In a patient with preeclampsia or pre-existing hypertension, methylergonovine is strictly contraindicated because it precipitates malignant hypertensive crisis, acute pulmonary edema, and intracerebral hemorrhage."
    }
  ]
};
