/**
 * Shock Classification, Hemodynamic Profiles & Resuscitation (Surviving Sepsis)
 * Authoritative medical content derived from Surviving Sepsis Campaign 2021, Rosen, Tintinalli, and USMLE Step 2/3 Emergency Medicine.
 * Mapped to NMC CBME Competencies: EM3.1, EM3.2, EM4.1, EM4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SHOCK_HEMODYNAMIC_RESUSCITATION_MODULE: PhysiologyLessonModule = {
  id: "em-shock-hemodynamic-resuscitation",
  unitCode: "EM3.1",
  title: "Emergency: Shock Classification, Hemodynamic Profiles & Resuscitation (Surviving Sepsis)",
  competencies: ["EM3.1", "EM3.2", "EM4.1", "EM4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Emergency: Shock Classification, Hemodynamic Profiles & Resuscitation (Surviving Sepsis)

Shock is a life-threatening state of systemic hypoperfusion resulting in cellular hypoxia, anaerobic metabolism, lactic acidosis, and multiorgan dysfunction syndrome (MODS).

---

## 1. The 4 Major Classes of Shock: Hemodynamic Profiles

$$\\text{Mean Arterial Pressure (MAP)} = \\text{Cardiac Output (CO)} \\times \\text{Systemic Vascular Resistance (SVR)}$$
$$\\text{where } \\text{CO} = \\text{Heart Rate (HR)} \\times \\text{Stroke Volume (SV)}$$

| Shock Classification | Primary Etiologies & Mechanism | CVP / PCWP (Preload) | Cardiac Output (CO) | SVR (Afterload) | $ScvO_2$ (Central Venous $O_2$) | First-Line Resuscitative Therapy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hypovolemic Shock** | Hemorrhage (trauma, GI bleed), severe dehydration, burns, DKA. | **$\\downarrow\\downarrow$** | **$\\downarrow\\downarrow$** | **$\\uparrow\\uparrow$** (Compensatory vasoconstriction) | **$\\downarrow$** ($< 65\\%$) | **Rapid IV Crystalloids ($30\\text{ mL/kg}$)** or **$1:1:1$ Blood Products (MTP)** for hemorrhage. |
| **Cardiogenic Shock** | Acute Myocardial Infarction ($>40\\%$ LV necrosis), fulminant myocarditis, acute MR/VSD, end-stage HF. | **$\\uparrow\\uparrow$** ($PCWP > 18\\text{ mmHg}$) | **$\\downarrow\\downarrow$** ($CI < 2.2\\text{ L/min/m}^2$) | **$\\uparrow\\uparrow$** | **$\\downarrow\\downarrow$** ($< 60\\%$) | Inotropes (**Dobutamine** / **Milrinone**) $+$ Vasopressor (**Norepinephrine**) $+$ **Emergency Revascularization (PCI)**; *Avoid fluid boluses!* |
| **Distributive: Septic Shock** | Dysregulated host response to severe bacterial/fungal infection $\\implies$ massive cytokine release, vasodilation, and endothelial leak. | **$\\downarrow$ or $\\leftrightarrow$** | **$\\uparrow$ (Early warm)** $\\rightarrow$ $\\downarrow$ (Late cold) | **$\\downarrow\\downarrow$** | **$\\uparrow$ (Early)** $\\rightarrow$ $\\downarrow$ | **$30\\text{ mL/kg}$ IV Crystalloids $+$ Norepinephrine** (First-line vasopressor) $+$ Broad-spectrum IV antibiotics. |
| **Distributive: Anaphylactic Shock** | IgE-mediated mast cell/basophil degranulation (histamine, leukotrienes) $\\implies$ profound vasodilation, bronchospasm, angioedema. | **$\\downarrow$** | **$\\downarrow$ or $\\leftrightarrow$** | **$\\downarrow\\downarrow$** | **$\\leftrightarrow$** | **IM Epinephrine $0.5\\text{ mg } 1:1000$ anterolateral thigh IMMEDIATELY** $+$ IV crystalloid boluses $+$ Antihistamines $+$ Steroids. |
| **Distributive: Neurogenic Shock** | Cervical or high-thoracic ($T_6$ and above) spinal cord injury $\\implies$ loss of sympathetic vasomotor tone. | **$\\downarrow$** | **$\\downarrow$** | **$\\downarrow\\downarrow$** | **$\\leftrightarrow$** | **Norepinephrine / Phenylephrine** (restores vascular tone) $+$ **Atropine** (treats paradoxical concomitant bradycardia). |
| **Obstructive Shock** | Extracardiac mechanical obstruction to blood flow: **Tension Pneumothorax, Cardiac Tamponade, Massive Pulmonary Embolism**. | **$\\uparrow\\uparrow$** (Tamponade/Pneumothorax: CVP $\\uparrow$, PCWP $\\uparrow$; PE: CVP $\\uparrow$, PCWP $\\downarrow$) | **$\\downarrow\\downarrow$** | **$\\uparrow\\uparrow$** | **$\\downarrow$** | **Immediate mechanical relief**: Needle decompression / Chest tube, Pericardiocentesis, Systemic Thrombolysis (tPA for PE). |

---

## 2. Surviving Sepsis Campaign: The 1-Hour Sepsis Resuscitation Bundle

For patients presenting with Sepsis or Septic Shock, complete all 5 interventions within **$1\\text{ hour}$ of triage**:
1. **Measure Serum Lactate Level**: Remeasure within $2-4\\text{ hours}$ if initial lactate is $> 2\\text{ mmol/L}$ to guide clearance.
2. **Obtain Blood Cultures**: Draw at least 2 sets of blood cultures (aerobic and anaerobic) **PRIOR to initiating antimicrobial therapy**.
3. **Administer Empiric Broad-Spectrum IV Antimicrobials**: Target all likely pathogens within the first 60 minutes.
4. **Administer $30\\text{ mL/kg}$ IV Balanced Crystalloids**: Rapid infusion of balanced crystalloid solution (e.g. Plasma-Lyte, Ringer\'s Lactate) for hypotension or initial lactate $\\ge 4\\text{ mmol/L}$.
5. **Initiate Vasopressors**: If MAP remains $< 65\\text{ mmHg}$ during or after fluid resuscitation, initiate **Norepinephrine as the first-line vasopressor** (titrated to $\\text{MAP} \\ge 65\\text{ mmHg}$); add **Vasopressin ($0.03\\text{ U/min}$)** if high-dose norepinephrine is required.

---

## 3. Anaphylactic Shock: Emergency Resuscitation Protocol

- **Diagnosis**: Acute onset ($<30\\text{ min}$) of skin/mucosal involvement (urticaria, lip/tongue angioedema) PLUS respiratory compromise (stridor, wheeze) OR sudden hypotension ($\text{SBP} < 90\text{ mmHg}$).
- **First-Line Drug of Choice**: **Intramuscular Epinephrine (Adrenaline)**:
  - Dosing: **$0.5\\text{ mg}$ of $1:1000$ ($1\\text{ mg/mL}$) concentration IM in the mid-anterolateral thigh**.
  - Repeat every **$5 - 15\\text{ minutes}$** if symptoms are refractory.
  - *Mechanism*: $\\alpha_1$ vasoconstriction (reverses hypotension/angioedema), $\\beta_1$ inotropy, and $\\beta_2$ bronchodilation (reverses bronchospasm and inhibits further mast cell degranulation).
- **Adjunctive Therapies (Secondary after Epinephrine)**:
  - Rapid IV normal saline fluid boluses ($1000-2000\\text{ mL}$).
  - $H_1$ blocker (IV Diphenhydramine $50\\text{ mg}$) $+ H_2$ blocker (IV Famotidine $20\\text{ mg}$).
  - IV Corticosteroids (Methylprednisolone $125\\text{ mg}$) to prevent biphasic anaphylaxis.
  - Inhaled Albuterol for persistent wheezing.
  - **Refractory Anaphylaxis in patients on $\\beta$-blockers**: **IV Glucagon ($1-5\\text{ mg}$ over 5 min)** stimulates cardiac cAMP independent of $\\beta$-adrenergic receptors!
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old female with a history of acute ascending cholangitis presents to the emergency department in altered mental status. Blood pressure is 74/42 mmHg (MAP 52 mmHg), heart rate is 128 bpm, respiratory rate is 28/min, temperature is 39.4°C, and oxygen saturation is 94% on room air. Extremities are warm with bounding peripheral pulses and flash capillary refill (<1 second). Arterial blood gas shows pH 7.22, PaCO2 28 mmHg, PaO2 78 mmHg, HCO3- 11 mEq/L, and serum lactate is 6.4 mmol/L. She receives an initial 30 mL/kg bolus of Ringer's Lactate (2000 mL) over 30 minutes, but her repeat blood pressure is 78/46 mmHg (MAP 56 mmHg).",
      question: "Which type of shock is present, and what is the next most appropriate pharmacotherapeutic intervention?",
      options: [
        "Septic Shock (Distributive); Initiate an intravenous Norepinephrine infusion to target MAP >= 65 mmHg",
        "Hypovolemic Shock; Administer an additional 3000 mL of normal saline bolus",
        "Cardiogenic Shock; Initiate an intravenous Dobutamine infusion without vasopressors",
        "Neurogenic Shock; Administer high-dose intravenous Phenylephrine"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient with severe biliary sepsis who remains hypotensive (MAP < 65 mmHg) and hyperlactatemic (lactate 6.4 mmol/L) despite adequate fluid resuscitation (30 mL/kg balanced crystalloid) meets the diagnostic criteria for Septic Shock. Sepsis causes distributive vasodilation with high cardiac output and profoundly low SVR. According to the Surviving Sepsis Campaign guidelines, the first-line vasopressor of choice is Norepinephrine (a potent alpha-1 agonist with modest beta-1 support) titrated to maintain MAP >= 65 mmHg."
    }
  ]
};
