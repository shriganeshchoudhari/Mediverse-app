/**
 * Transfusion Medicine: Acute & Delayed Transfusion Reactions (TRALI, TACO, AHTR, FNHTR, TA-GvHD)
 * Authoritative medical content derived from AABB Technical Manual (20th ed.), ISBT, and FDA Hemovigilance Standards.
 * Mapped to NMC CBME Competencies: TR5.1, TR5.2, TR6.1, TR6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRANSFUSION_REACTIONS_TRALI_TACO_AHTR_MODULE: PhysiologyLessonModule = {
  id: "transfusion-transfusion-reactions-trali-taco-ahtr",
  unitCode: "TR5.1",
  title: "Acute & Delayed Transfusion Reactions: Differential Diagnosis of TRALI vs TACO, AHTR & Anaphylaxis",
  competencies: ["TR5.1", "TR5.2", "TR6.1", "TR6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Acute & Delayed Transfusion Reactions: Differential Diagnosis of TRALI vs TACO, AHTR & Anaphylaxis

Hemovigilance mandates immediate recognition, algorithmic differential diagnosis, and targeted resuscitation during acute adverse transfusion reactions.

---

## 1. Differential Diagnosis: TRALI vs TACO

Transfusion-Related Acute Lung Injury (TRALI) and Transfusion-Associated Circulatory Overload (TACO) are the leading causes of transfusion-related mortality:

| Diagnostic Parameter | Transfusion-Related Acute Lung Injury (TRALI) | Transfusion-Associated Circulatory Overload (TACO) |
| :--- | :--- | :--- |
| **Pathophysiologic Mechanism** | **Two-Hit Immune Mechanism**: Donor anti-HLA class I/II or anti-HNA antibodies react with recipient neutrophils primed in the pulmonary microvasculature $\\implies$ endothelial damage, capillary leak, and **Non-Cardiogenic Pulmonary Edema**. | **Hydrostatic Volume Overload**: Rapid or excessive volume infusion in patients with compromised cardiac or renal reserve $\\implies$ **Cardiogenic Pulmonary Edema**. |
| **Onset Timing** | Within **$6\\text{ hours}$** of transfusion completion. | Within **$6 - 12\\text{ hours}$** (often during or immediately post-transfusion). |
| **Hemodynamic Blood Pressure** | **Hypotension** (or transient normal BP). | **Hypertension** (SBP significantly elevated $>140 - 180\\text{ mmHg}$). |
| **Body Temperature** | **Fever & Chills** (inflammatory cytokine storm). | **Afebrile** (normal body temperature). |
| **Jugular Venous Distension (JVD) & S3** | **Absent** (no circulatory volume overload). | **Present** (marked JVD, hepatomegaly, and $S_3$ gallop). |
| **B-Type Natriuretic Peptide (BNP / NT-proBNP)** | **Normal or mild baseline** ($<1.5\\times$ baseline). | **Markedly Elevated** ($>1.5 - 3.0\\times$ baseline; $\\text{BNP} > 300\\text{ pg/mL}$). |
| **Pulmonary Capillary Wedge Pressure (PCWP)** | **Normal ($\\text{PCWP} \\le 18\\text{ mmHg}$)**. | **Elevated ($\\text{PCWP} > 18\\text{ mmHg}$)**. |
| **Response to Intravenous Diuretics (Furosemide)** | **No response / Worsens hypotension** (contraindicated!). | **Rapid, dramatic clinical improvement & diuresis**. |
| **Definitive Management** | Supplemental $O_2$, lung-protective mechanical ventilation, hemodynamic support. Avoid diuretics. | **Stop transfusion, sit patient upright, high-dose IV Furosemide ($20 - 40\\text{ mg}$)**, supplemental $O_2$. |

---

## 2. Acute Hemolytic Transfusion Reaction (AHTR)

- **Etiology**: Clerical error resulting in major **ABO-incompatible blood transfusion** (e.g. Group A PRBCs infused into a Group O recipient).
- **Pathogenesis**: Recipient pre-formed **IgM isohemagglutinins** bind donor RBC surface A/B antigens $\\implies$ Classical complement pathway activation $\\implies$ **Membrane Attack Complex (MAC, $C_{5b-9}$) formation $\\implies$ Rapid, massive intravascular hemolysis**.
- **Clinical Triad**: **Fever & Chills $+$ Flank / Back Pain (renal ischemia) $+$ Hemoglobinuria (dark red/brown urine)** $\\rightarrow$ Hypotension, Bronchospasm, and **Disseminated Intravascular Coagulation (DIC)**.
- **Immediate Emergency Action**:
  1. **STOP THE TRANSFUSION IMMEDIATELY** and maintain IV line with normal saline.
  2. Perform clerical check (verify patient wristband and blood bag labels).
  3. Send blood bag, post-transfusion patient blood sample, and urine sample to the blood bank for repeat ABO typing, DAT, free hemoglobin, and haptoglobin testing.
  4. **Aggressive IV Normal Saline Hydration** to maintain urine output $\ge 100 - 200\text{ mL/hour}$ to flush free hemoglobin from renal tubules $\pm$ **Mannitol or Furosemide**.

---

## 3. Other High-Yield Transfusion Reactions

$$\\begin{array}{lcccc}
\\hline
\\textbf{Reaction} & \\textbf{Mechanism} & \\textbf{Key Clinical Findings} & \\textbf{Prevention Strategy} \\\\
\\hline
\\text{Febrile Non-Hemolytic (FNHTR)} & \\text{Recipient antibodies against donor WBCs / Cytokines} & \\text{Fever } \\uparrow \\ge 1^\\circ\\text{C, chills, no hemolysis} & \\mathbf{\\text{Pre-Storage Leukoreduction}} \\\\
\\text{Allergic / Urticarial} & \\text{IgE antibodies against donor plasma proteins} & \\text{Pruritus, hives, urticaria (no fever)} & \\text{Diphenhydramine; resume if mild} \\\\
\\text{Anaphylactic} & \\mathbf{\\text{Anti-IgA antibodies in an IgA-deficient patient}} & \\text{Shock, stridor, wheezing within seconds} & \\mathbf{\\text{IM Epinephrine } + \\text{ Washed RBCs}} \\\\
\\text{Transfusion-Assoc GvHD (TA-GvHD)} & \\text{Donor viable T-lymphocytes attack host ($>90\\%$ fatal)} & \\text{Pancytopenia, fever, rash, elevated LFTs} & \\mathbf{\\text{Gamma-Irradiation (25 Gy)}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 72-year-old male with severe ischemic cardiomyopathy (LVEF 25%) and chronic kidney disease receives 2 units of PRBCs for symptomatic anemia (Hb 6.4 g/dL). Towards the end of the second unit, he develops severe dyspnea, orthopnea, and tachypnea. Examination reveals a blood pressure of 185/100 mmHg (baseline 120/75), pulse 115 bpm, temperature 36.8°C (afebrile), bilateral basilar crackles, and prominent jugular venous distension. Chest X-ray reveals cardiomegaly with diffuse perihilar alveolar infiltrates and Kerley B lines. Serum BNP is 1200 pg/mL (baseline 220 pg/mL).",
      question: "Which of the following represents the most likely diagnosis and the definitive initial management?",
      options: [
        "Transfusion-Associated Circulatory Overload (TACO); Stop transfusion, position patient upright, and administer intravenous Furosemide",
        "Transfusion-Related Acute Lung Injury (TRALI); Administer high-dose intravenous hydrocortisone and normal saline boluses",
        "Acute Hemolytic Transfusion Reaction; Administer sodium bicarbonate infusion",
        "Anaphylactic reaction; Administer intramuscular Epinephrine"
      ],
      correctAnswerIndex: 0,
      explanation: "The clinical presentation (severe hypertension, afebrile state, JVD, S3/cardiomegaly, dramatic BNP elevation, and Kerley B lines following blood transfusion in a patient with reduced cardiac reserve) is diagnostic of Transfusion-Associated Circulatory Overload (TACO). In contrast to TRALI (which presents with fever, hypotension, and normal BNP/PCWP), TACO is caused by hydrostatic hydrostatic volume overload and responds rapidly to sitting upright, stopping the transfusion, and aggressive intravenous loop diuretics (Furosemide)."
    }
  ]
};
