/**
 * Gastroenterology: Cirrhosis, Portal Hypertension & Decompensated Liver Failure
 * Authoritative medical content derived from Sleisenger and Fordtran's Gastrointestinal and Liver Disease (11th ed.), Zakim and Boyer's Hepatology (7th ed.).
 * Mapped to NMC CBME Competencies: IM7.1, IM7.2, PA25.1, PA25.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CIRRHOSIS_PORTAL_HYPERTENSION_MODULE: PhysiologyLessonModule = {
  id: "gastroenterology-adv-cirrhosis-portal-hypertension",
  unitCode: "GA1.1",
  title: "Liver Cirrhosis, Portal Hypertension, SAAG Ascites Gradient & SBP Management",
  competencies: ["IM7.1", "IM7.2", "PA25.1", "PA25.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Liver Cirrhosis, Portal Hypertension & SBP Management

Cirrhosis represents end-stage diffuse hepatic fibrosis with regenerative nodule formation, leading to portal hypertension and hyperdynamic circulatory dysfunction.

---

## 1. Serum-Ascites Albumin Gradient (SAAG) Diagnostic Algorithm

$$\\text{SAAG} = \\text{Serum Albumin} - \\text{Ascitic Fluid Albumin}$$

$$\\begin{array}{lcc}
\\hline
\\textbf{SAAG Category} & \\textbf{Ascitic Total Protein} & \\textbf{Differential Etiologies} \\\\
\\hline
\\textbf{High SAAG (}\\ge 1.1\\text{ g/dL)} & <2.5\\text{ g/dL (Low)} & \\mathbf{\\text{Cirrhosis}}\\text{, Late Budd-Chiari, Massive Liver Metastases} \\\\
(\\text{Portal Hypertension / Transudate}) & \\ge 2.5\\text{ g/dL (High)} & \\mathbf{\\text{Congestive Heart Failure}}\\text{, Constrictive Pericarditis, Early Budd-Chiari} \\\\
\\hline
\\textbf{Low SAAG (}<1.1\\text{ g/dL)} & \\text{Variable} & \\mathbf{\\text{Peritoneal Carcinomatosis}}\\text{, Peritoneal Tuberculosis,} \\\\
(\\text{Non-Portal Hypertension / Exudate}) & & \\text{Nephrotic Syndrome, Pancreatic Ascites, Biliary Leak} \\\\
\\hline
\\end{array}$$

---

## 2. Decompensated Cirrhosis Clinical Emergencies

1. **Spontaneous Bacterial Peritonitis (SBP)**:
   - **Diagnostic Standard**: Diagnostic paracentesis demonstrating **Ascitic Fluid Absolute Neutrophil Count (ANC) $>250/\\mu\\text{L}$** (calculated as $\\text{Total WBC} \\times \\%\\text{Neutrophils}$).
   - **Immediate Therapy**: **Intravenous 3rd-generation Cephalosporin (Ceftriaxone 2g daily or Cefotaxime)** $+$ **Intravenous Albumin ($1.5\\text{ g/kg}$ on Day 1, $1.0\\text{ g/kg}$ on Day 3)**.
   - **Clinical Rationale for Albumin**: Prevents fatal renal impairment (Hepatorenal Syndrome) and reduces mortality by $>50\\%$.

2. **Acute Esophageal Variceal Hemorrhage**:
   - **Pathophysiology**: Hepatic venous pressure gradient (HVPG) $>10-12\\text{ mmHg}$ drives collateral formation in lower esophagus.
   - **Emergency Resuscitation**: Hemodynamic stabilization (target $\\text{Hb } 7 - 8\\text{ g/dL}$), **Intravenous Octreotide / Terlipressin** (splanchnic vasoconstrictor), **IV Ceftriaxone** (prophylaxis against SBP/infections), followed by urgent **Endoscopic Variceal Ligation (EVL)** within 12 hours.

3. **Hepatorenal Syndrome (HRS)**:
   - **Pathophysiology**: Severe splanchnic arterial vasodilation $\\rightarrow$ extreme renal vasoconstriction in patients with advanced cirrhosis and ascites.
   - **Management**: **Terlipressin $+$ Albumin** (or Norepinephrine $+$ Albumin in ICU); definitive curative therapy is **Orthotopic Liver Transplantation**.

4. **Hepatic Encephalopathy (HE)**:
   - **Pathophysiology**: Portosystemic shunting $\\rightarrow$ hyperammonemia crossing blood-brain barrier $\rightarrow$ astrocyte swelling and glutamine accumulation.
   - **Therapy**: **Lactulose** (titrated to achieve $2-3$ soft bowel movements/day; acidifies colon to convert $\\text{NH}_3$ to non-absorbable $\\text{NH}_4^+$) $+$ **Rifaximin** (non-absorbable antibiotic reducing ammoniagenic gut flora).
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with a history of decompensated alcoholic cirrhosis presents to the emergency department with low-grade fever, diffuse abdominal pain, and worsening confusion. Vital signs: BP 102/64 mmHg, HR 96 bpm, Temp 38.3°C. Physical examination reveals tense ascites and mild diffuse abdominal tenderness without rebound. Diagnostic paracentesis yields cloudy peritoneal fluid. Analysis demonstrates: Ascitic Albumin 0.8 g/dL (Serum Albumin 2.6 g/dL; SAAG = 1.8 g/dL), Total Ascitic WBC 1,200/uL with 68% polymorphonuclear neutrophils (Absolute Neutrophil Count = 816/uL), and Ascitic Total Protein 1.2 g/dL.",
      question: "Which of the following represents the definitive diagnosis and the evidence-based medical regimen indicated for this patient?",
      options: [
        "Spontaneous Bacterial Peritonitis (SBP); Immediate Intravenous Ceftriaxone plus Intravenous Albumin (1.5 g/kg on Day 1 and 1.0 g/kg on Day 3)",
        "Secondary bacterial peritonitis; Emergency exploratory laparotomy",
        "Peritoneal carcinomatosis; Intraperitoneal chemotherapy",
        "Uncomplicated portal hypertension ascites; Increase oral Spironolactone dose"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient has an Ascitic Absolute Neutrophil Count (ANC) of 1,200 x 0.68 = 816/uL, which is well above the diagnostic threshold of >250/uL, confirming Spontaneous Bacterial Peritonitis (SBP) in the setting of high SAAG (1.8 g/dL) cirrhotic ascites. The standard of care is immediate empiric IV 3rd-generation Cephalosporin (Ceftriaxone or Cefotaxime) combined with IV Albumin (1.5 g/kg at diagnosis and 1.0 g/kg on Day 3), which significantly reduces the incidence of hepatorenal syndrome and improves survival."
    }
  ]
};
