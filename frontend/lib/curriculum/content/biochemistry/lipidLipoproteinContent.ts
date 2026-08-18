/**
 * Lipid & Lipoprotein Metabolism Learning Content
 * Authoritative medical content derived from Harper's, Lippincott, Lehninger, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: BI4.1, BI4.2, BI4.3, BI4.4, BI4.5
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LIPID_LIPOPROTEIN_MODULE: PhysiologyLessonModule = {
  id: "bioc-lipid-lipoprotein",
  unitCode: "BI4.1",
  title: "Lipid Transport, Lipoproteins, Beta-Oxidation & Dyslipidemias",
  competencies: ["BI4.1", "BI4.2", "BI4.3", "BI4.4", "BI4.5"],
  estimatedMinutes: 125,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Lipid Transport, Lipoproteins, Beta-Oxidation & Dyslipidemias

Lipids are hydrophobic macromolecular fuels transported through aqueous plasma within structured **lipoprotein spherical particles** (polar amphipathic shell with neutral triglyceride/cholesteryl ester core).

---

## 1. Lipoprotein Particles & Apolipoprotein Identity Tags

| Lipoprotein Class | Major Lipid Content | Structural & Functional Apolipoproteins | Physiological Function & Destination |
| :--- | :--- | :--- | :--- |
| **Chylomicrons** | **Dietary Triglycerides ($90\\%$)** | **ApoB-48** (structural, intestinal origin)<br>**ApoC-II** (activates Lipoprotein Lipase / LPL)<br>**ApoE** (mediates hepatic remnant uptake) | Transports exogenous dietary lipids from intestines to peripheral adipose/muscle tissue. Remnants cleared by liver. |
| **VLDL** | **Endogenous Triglycerides ($60\\%$)** | **ApoB-100** (hepatic origin, binds LDL-R)<br>**ApoC-II**, **ApoE** | Secreted by liver; delivers endogenous triglycerides to peripheral tissues. Converted by LPL to IDL and LDL. |
| **IDL** | Triglycerides & Cholesteryl Esters | **ApoB-100**, **ApoE** | Intermediate degradation product of VLDL. Endocytosed by liver or further cleaved by Hepatic Lipase to LDL. |
| **LDL** | **Cholesteryl Esters ($50\\%$)** | **ApoB-100** only | Delivers cholesterol to peripheral tissues and liver via receptor-mediated endocytosis of **LDL-Receptors** ($LDL\\text{-}R$). Oxidized LDL forms atherosclerotic foam cells. |
| **HDL** | **Apolipoproteins ($50\\%$) & Phospholipids** | **ApoA-1** (activates **LCAT / PCAT**)<br>ApoC-II, ApoE reservoir | Secreted by liver/intestine. Executes **Reverse Cholesterol Transport** (extracts tissue cholesterol $\\rightarrow$ esterified by LCAT $\\rightarrow$ transferred to VLDL/IDL/LDL via **CETP** or delivered to liver via **SR-B1**). |

> **Apolipoprotein Master Summary**:
> - **ApoA-1**: Activates **LCAT (Lecithin-Cholesterol Acyltransferase)** on HDL.
> - **ApoB-48**: Required for chylomicron assembly and secretion by enterocytes. (*Absent in Abetalipoproteinemia* $\\implies$ failure to thrive, steatorrhea, acanthocytosis, ataxia).
> - **ApoB-100**: Binds LDL receptor; found on liver-derived particles (VLDL, IDL, LDL).
> - **ApoC-II**: Essential cofactor for **Lipoprotein Lipase (LPL)** on capillary endothelium (cleaves triglycerides $\\rightarrow$ free fatty acids + glycerol).
> - **ApoE**: Mediates endocytic clearance of Chylomicron remnants, VLDL, and IDL by hepatic ApoE receptors. (*Defective in Type III Hyperlipidemia*).

---

## 2. Familial Dyslipidemias (Fredrickson Classification)

| Type & Name | Genetic Defect / Mechanism | Elevated Lipoprotein & Blood Lipids | Pathognomonic Clinical Manifestations |
| :--- | :--- | :--- | :--- |
| **Type I: Hyperchylomicronemia** | Deficiency of **Lipoprotein Lipase (LPL)** or **ApoC-II** (Autosomal Recessive) | **Chylomicrons $\\uparrow \\uparrow$**<br>(Triglycerides $>1000\\text{ mg/dL}$) | **Recurrent Acute Pancreatitis**, Eruptive xanthomas, Hepatosplenomegaly, **Creamy supernatant layer** over clear plasma on standing. *No increased risk of atherosclerosis*. |
| **Type IIa: Familial Hypercholesterolemia** | Absent or defective **LDL Receptors (LDL-R)** or ApoB-100 defect (Autosomal Dominant) | **LDL $\\uparrow \\uparrow$**<br>(Cholesterol $300-1000+\\text{ mg/dL}$) | **Severe premature Atherosclerosis & CAD** (myocardial infarction before age 20 in homozygotes), **Tendon Xanthomas** (Achilles tendon), **Xanthelasma**, Corneal arcus. |
| **Type IIb: Familial Combined Hyperlipidemia** | Overproduction of hepatic VLDL + impaired LDL clearance | **LDL $\\uparrow$ and VLDL $\\uparrow$**<br>(Cholesterol & Triglycerides $\\uparrow$) | Premature CAD, peripheral vascular disease. |
| **Type III: Dysbetalipoproteinemia** | Defective **Apolipoprotein E2 (ApoE2)** homozygosity (impaired remnant clearance) | **Chylomicron remnants $\\uparrow$ & IDL $\\uparrow$**<br>(Cholesterol & Triglycerides $\\uparrow$) | **Palmar Xanthomas** (xanthoma striatum palmare), Tuberoeruptive xanthomas over elbows/knees, Premature CAD. |
| **Type IV: Hypertriglyceridemia** | Hepatic overproduction of VLDL (Autosomal Dominant) | **VLDL $\\uparrow \\uparrow$**<br>(Triglycerides $>500\\text{ mg/dL}$) | **Acute Pancreatitis**, associated with insulin resistance and Type 2 Diabetes Mellitus. |

---

## 3. Fatty Acid Beta-Oxidation vs Synthesis & Carnitine Shuttles

- **Fatty Acid Synthesis (Cytoplasm)**:
  - Rate-limiting enzyme: **Acetyl-CoA Carboxylase (ACC)** ($+$ Biotin/$B_7$; stimulated by Citrate and Insulin; inhibited by Glucagon and Palmitoyl-CoA).
  - Malonyl-CoA product allosterically **inhibits Carnitine Palmitoyltransferase-I (CPT-I)**, preventing simultaneous futile oxidation.
- **Fatty Acid $\\beta$-Oxidation (Mitochondrial Matrix)**:
  - Long-chain fatty acids ($>12$ carbons) require the **Carnitine Shuttle**:
    - **CPT-I** (outer mitochondrial membrane) conjugates Acyl-CoA to Carnitine $\\rightarrow$ Acylcarnitine.
    - **Carnitine-Acylcarnitine Translocase** transports across inner membrane.
    - **CPT-II** (inner membrane) reconverts Acylcarnitine back to Acyl-CoA.
- **Medium-Chain Acyl-CoA Dehydrogenase (MCAD) Deficiency (Autosomal Recessive)**:
  - Inability to break down fatty acids with 8–10 carbon chains.
  - Manifests during prolonged fasting or illness with **Hypoketotic Hypoglycemia**, vomiting, lethargy, seizures, liver dysfunction, hyperammonemia, and **$\\uparrow$ Octanoylcarnitine in blood / Dicarboxylic acids in urine**.
  - Can cause Sudden Infant Death Syndrome (SIDS). Treatment: avoid prolonged fasting, high-carb low-fat diet.
`,
  clinicalVignettes: [
    {
      scenario: "An 8-year-old boy is evaluated for multiple painless nodular skin lesions over his Achilles tendons and extensor surfaces of his elbows. His father suffered a fatal myocardial infarction at age 34. Lipid panel demonstrates: Total Cholesterol 640 mg/dL (markedly elevated), LDL Cholesterol 560 mg/dL, HDL Cholesterol 42 mg/dL, and Triglycerides 140 mg/dL.",
      question: "Which of the following is the underlying molecular defect responsible for this patient's condition?",
      options: [
        "Loss-of-function mutation in the LDL-Receptor gene (Familial Hypercholesterolemia Type IIa)",
        "Deficiency of capillary endothelial Lipoprotein Lipase (Type I Hyperchylomicronemia)",
        "Homozygosity for Apolipoprotein E2 isoform (Type III Dysbetalipoproteinemia)",
        "Deficiency of Lecithin-Cholesterol Acyltransferase (LCAT Deficiency)"
      ],
      correctAnswerIndex: 0,
      explanation: "Familial Hypercholesterolemia (Type IIa) is an autosomal dominant disorder caused by mutations in the LDL receptor gene (or ApoB-100). Impaired hepatic LDL clearance results in severe hypercholesterolemia (>500 mg/dL in homozygotes), pathognomonic Achilles tendon xanthomas, xanthelasmas, and accelerated premature coronary artery disease."
    }
  ]
};
