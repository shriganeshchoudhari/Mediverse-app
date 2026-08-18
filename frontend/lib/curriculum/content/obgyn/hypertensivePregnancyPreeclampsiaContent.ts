/**
 * Hypertensive Disorders of Pregnancy, Preeclampsia & Magnesium Sulfate Protocol Learning Content
 * Authoritative medical content derived from Williams Obstetrics, ACOG, RCOG, and USMLE Step 2 CK OB/GYN.
 * Mapped to NMC CBME Competencies: OG5.1, OG5.2, OG5.3, OG5.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HYPERTENSIVE_PREGNANCY_PREECLAMPSIA_MODULE: PhysiologyLessonModule = {
  id: "obg-preeclampsia-mgso4",
  unitCode: "OG5.1",
  title: "Obstetrics: Hypertensive Disorders of Pregnancy, Preeclampsia Severe Features & MgSO4 Protocol",
  competencies: ["OG5.1", "OG5.2", "OG5.3", "OG5.4"],
  estimatedMinutes: 135,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Obstetrics: Hypertensive Disorders of Pregnancy, Preeclampsia Severe Features & MgSO4 Protocol

Hypertensive disorders complicate up to $10\\%$ of all pregnancies worldwide and represent a major cause of maternal and perinatal morbidity and mortality.

---

## 1. Classification of Hypertensive Disorders of Pregnancy (HDP)

| Clinical Category | Diagnostic Criteria & Timing | Proteinuria / End-Organ Damage | Definitive Management |
| :--- | :--- | :--- | :--- |
| **Chronic Hypertension** | SBP $\\ge 140\\text{ mmHg}$ or DBP $\\ge 90\\text{ mmHg}$ present **BEFORE pregnancy or BEFORE 20 weeks of gestation** (or persists $>12$ weeks postpartum). | Absent (unless baseline renal disease). | Oral Labetalol, Nifedipine (extended-release), or Methyldopa. *ACE inhibitors/ARBs strictly contraindicated (teratogenic)!* |
| **Gestational Hypertension** | New-onset SBP $\\ge 140$ or DBP $\\ge 90$ arising **AFTER 20 weeks of gestation**. | **ABSENT** proteinuria and no severe end-organ features. | Delivery at $37\\text{–}38\\text{ weeks}$. |
| **Preeclampsia (without severe features)** | New-onset HTN ($\\ge 140/90$) after 20 weeks **PLUS Proteinuria** ($\\ge 300\\text{ mg/24h}$ or Urine Protein:Creatinine Ratio $\\ge 0.3$). | Proteinuria present; no severe end-organ features. | Expectant management until **$37\\text{ weeks 0 days}$**, then delivery. |
| **Preeclampsia with Severe Features** | SBP $\\ge 160$ or DBP $\\ge 110$ on 2 occasions $\\ge 4$ hours apart **OR presence of any severe end-organ feature**. | **Severe End-Organ Features**:<br>• Thrombocytopenia (Platelets $<100,000 /\\mu\\text{L}$).<br>• Impaired Liver Function (Transaminases $>2\\times$ normal, severe persistent RUQ/epigastric pain).<br>• Renal Insufficiency (Serum Creatinine $>1.1\\text{ mg/dL}$).<br>• Pulmonary Edema.<br>• New-onset persistent cerebral/visual disturbances (headache, scotoma, photophobia). | • Immediate **IV Labetalol** or **Hydralazine** or oral Nifedipine.<br>• **IV Magnesium Sulfate ($MgSO_4$)**.<br>• **Delivery at $34\\text{ weeks}$** (or immediately if unstable). |
| **Eclampsia** | Occurrence of **Generalized Tonic-Clonic Seizures** in a patient with preeclampsia that cannot be attributed to other neurological causes. | End-organ endothelial disruption and cerebral vasospasm/edema. | • Airway, Left lateral position, $100\\%\\text{ } O_2$.<br>• **Immediate IV $MgSO_4$ bolus ($4-6\\text{ g}$)**.<br>• Urgent delivery once stabilized regardless of gestational age. |
| **HELLP Syndrome** | **H**emolysis (Microangiopathic, Schistocytes, Total Bilirubin $\\ge 1.2\\text{ mg/dL}$, $\\uparrow$ LDH $>600\\text{ U/L}$) $+$ **E**levated **L**iver enzymes (AST/ALT $\\ge 2\\times$ normal) $+$ **L**ow **P**latelets ($<100,000 /\\mu\\text{L}$). | Hepatosubcapsular hematoma risk (sudden RUQ pain, shoulder pain, shock). | Prompt delivery $+$ $MgSO_4$ seizure prophylaxis. |

---

## 2. Magnesium Sulfate ($MgSO_4$) Seizure Prophylaxis & Treatment Protocol

- **Mechanism**: Blocks NMDA receptors, promotes cerebral vasodilation via vascular smooth muscle relaxation, and inhibits presynaptic acetylcholine release at the neuromuscular junction.
- **Standard Dosing Regimens**:
  - **Zuspan Regimen (Intravenous)**: **$4\\text{ to } 6\\text{ g IV Loading Dose}$** in $100\\text{ mL}$ normal saline over 15–20 min, followed by **$1\\text{ to } 2\\text{ g/hour IV continuous maintenance infusion}$** for 24 hours postpartum.
  - **Pritchard Regimen (Intramuscular)**: $4\\text{ g IV} + 10\\text{ g IM}$ (5g in each buttock deep IM), followed by $5\\text{ g IM}$ q4h.

---

## 3. Magnesium Toxicity Monitoring & Antidote Protocol

| Serum Magnesium Level | Clinical Manifestation / Toxicity Sign | Clinical Nursing Action & Safety Check |
| :--- | :--- | :--- |
| **$4.0\\text{–}7.0\\text{ mEq/L}$ ($4.8\\text{–}8.4\\text{ mg/dL}$)** | **THERAPEUTIC WINDOW** (Seizure prevention achieved). | Continue maintenance infusion; monitor vitals. |
| **$8.0\\text{–}10.0\\text{ mEq/L}$** | **Loss of Deep Tendon (Patellar) Reflexes** (Earliest clinical sign of toxicity!). | **HOLD $MgSO_4$ Infusion**; check serum magnesium and renal function. |
| **$10.0\\text{–}12.0\\text{ mEq/L}$** | Somnolence, slurred speech, generalized muscle paralysis. | Stop infusion; administer supplemental oxygen. |
| **$> 12.0\\text{ mEq/L}$** | **Respiratory Depression / Respiratory Arrest** ($RR < 12\\text{ breaths/min}$). | Stop infusion; support airway/ventilations; **ADMINISTER ANTIDOTE IMMEDIATELY!** |
| **$> 15.0\\text{ mEq/L}$** | Complete Atrioventricular Heart Block & Asystolic Cardiac Arrest. | Immediate CPR $+$ IV Calcium Gluconate. |

### Emergency Antidote:
- **Intravenous Calcium Gluconate (10%)**: **$10\\text{ mL (1 gram)}$ slow IV over 3 to 5 minutes**. Directly antagonizes magnesium-induced neuromuscular blockade.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old primigravida at 34 weeks of gestation with preeclampsia with severe features is receiving an intravenous Magnesium Sulfate infusion (4 g loading dose followed by 2 g/hour maintenance). During the 4-hour vital signs assessment, the nurse finds the patient somnolent with slurred speech, respiratory rate has fallen to 8 breaths/min, and bilateral patellar deep tendon reflexes are completely absent. Serum creatinine is 1.8 mg/dL and urine output over the past 2 hours was 15 mL/hour.",
      question: "Which of the following is the most appropriate immediate life-saving intervention?",
      options: [
        "Stop the Magnesium Sulfate infusion and administer IV 10% Calcium Gluconate (10 mL)",
        "Increase the rate of IV maintenance fluids and continue the magnesium infusion",
        "Administer intravenous hydralazine 5 mg bolus",
        "Administer an immediate IV bolus of lorazepam 2 mg"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is exhibiting life-threatening Magnesium Toxicity (loss of deep tendon reflexes, somnolence, and severe respiratory depression with RR = 8 breaths/min), exacerbated by oliguria and elevated creatinine since magnesium is excreted exclusively by the kidneys. The immediate life-saving management is to STOP the magnesium sulfate infusion immediately and administer the definitive antidote, Intravenous Calcium Gluconate (10% solution, 10 mL slow IV over 3–5 minutes)."
    }
  ]
};
