/**
 * Clinical Radiology: Emergency Interventional Radiology & Vascular Procedures
 * Authoritative medical content derived from Brant and Helms' (5th ed.), SIR Guidelines.
 * Mapped to NMC CBME Competencies: RD1.7, RD1.8, MD39.4, SU37.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INTERVENTIONAL_RADIOLOGY_PROCEDURES_MODULE: PhysiologyLessonModule = {
  id: "radiology-adv-interventional-procedures",
  unitCode: "RD7.1",
  title: "Emergency Interventional Radiology: Pelvic Trauma Embolization, TIPS Stenting & IVC Filters",
  competencies: ["RD1.7", "RD1.8", "MD39.4", "SU37.4"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Emergency Interventional Radiology & Endovascular Procedures

Interventional radiology (IR) uses image-guided endovascular and percutaneous techniques for minimally invasive hemorrhage control, portal decompression, and mechanical filtration.

---

## 1. High-Yield Interventional Radiology Procedures

$$\\begin{array}{lcccc}
\\hline
\\textbf{IR Procedure} & \\textbf{Primary Indication} & \\textbf{Vascular Access \u0026 Anatomy} & \\textbf{Embolic / Device Material} & \\textbf{Major Clinical Risks} \\\\
\\hline
\\textbf{Transcatheter Arterial} & \\mathbf{\\text{Pelvic Fractures, Massive}} & \\text{Femoral artery } \\rightarrow \\text{ Internal iliac} & \\mathbf{\\text{Metallic Microcoils (permanent)}} & \\text{Target organ ischemia,} \\\\
\\textbf{Embolization (TAE)} & \\mathbf{\\text{Hemoptysis, Refractory GI bleed}} & \\text{or bronchial / gastroduodenal artery} & \\mathbf{\\text{Gelfoam sponge (temporary absorbable)}} & \\text{non-target embolization} \\\\
\\textbf{Transjugular Intrahepatic} & \\mathbf{\\text{Refractory Variceal Bleeding}} & \\text{Right internal jugular vein } \\rightarrow & \\mathbf{\\text{Expandable ePTFE covered stent}} & \\mathbf{\\text{Hepatic Encephalopathy,}} \\\\
\\textbf{Portosystemic Shunt (TIPS)} & \\mathbf{\\text{and Refractory Cirrhotic Ascites}} & \\text{Hepatic vein } \\rightarrow \\text{ Portal vein branch} & (\\text{bridges portal and systemic systems}) & \\text{TIPS stenosis/thrombosis} \\\\
\\textbf{Inferior Vena Cava} & \\mathbf{\\text{Acute DVT/PE with absolute}} & \\text{Internal jugular or femoral vein } \\rightarrow & \\mathbf{\\text{Nitinol retrievable filter}} & \\mathbf{\\text{Filter fracture, IVC perforation,}} \\\\
\\textbf{(IVC) Filter Placement} & \\mathbf{\\text{contraindication to anticoagulation}} & \\mathbf{\\text{Infrarenal IVC deployment}} & (\\text{traps emboli from lower extremities}) & \\text{mandatory retrieval mandate} \\\\
\\hline
\\end{array}$$

---

## 2. Critical IR Procedural Pearls

1. **Transcatheter Arterial Embolization (TAE) in Pelvic Trauma**:
   - Severe pelvic fractures (open-book, vertical shear) can tear branches of the internal iliac artery (superior gluteal, internal pudendal, lateral sacral, obturator).
   - In hemodynamically unstable pelvic trauma with active contrast extravasation ("blush") on CT, urgent pelvic angiography with **Gelfoam slurry or microcoil embolization** provides immediate mechanical hemostasis.
2. **TIPS Stenting for Portal Hypertension**:
   - Creates a low-resistance shunt connecting the portal vein (high pressure, $>10-12\\text{ mmHg}$ gradient) directly into the hepatic vein (low pressure $\\approx 0-3\\text{ mmHg}$).
   - Portal decompression eliminates esophageal variceal pressure; however, diverted blood bypasses hepatic metabolic detoxification, leading to post-TIPS **Hepatic Encephalopathy** in $30-50\\%$ of patients (treated with Lactulose and Rifaximin).
3. **IVC Filter Infrarenal Mandate**:
   - Deployed strictly **infrarenal** (inferior to the lowest renal vein orifice) to avoid renal venous outflow obstruction.
   - Retrievable filters must be removed within weeks to months once contraindications to anticoagulation resolve.
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with decompensated alcoholic cirrhosis and refractory esophageal variceal hemorrhage refractory to endoscopic band ligation and octreotide undergoes an urgent Transjugular Intrahepatic Portosystemic Shunt (TIPS) procedure. A 10 mm ePTFE-covered stent is successfully deployed, reducing his Portosystemic Pressure Gradient (PPG) from 22 mmHg to 8 mmHg. Hemostasis is achieved. Three weeks later, he is brought to the clinic by his family with asterixis, confusion, daytime somnolence, and inverted sleep-wake cycles.",
      question: "Which of the following complications of the TIPS procedure is this patient experiencing, and what is the underlying pathophysiology?",
      options: [
        "Post-TIPS Hepatic Encephalopathy; Portal venous blood rich in gut-derived neurotoxins (ammonia) is shunted directly into the systemic circulation, bypassing hepatic first-pass metabolism and crossing the blood-brain barrier",
        "Acute ischemic stroke from paradoxical microembolism",
        "Acute stent thrombosis causing sudden portal vein occlusion",
        "Contrast-induced neurotoxicity from non-ionic iodinated contrast"
      ],
      correctAnswerIndex: 0,
      explanation: "Hepatic Encephalopathy is the most common major complication of TIPS placement, occurring in 30-50% of cirrhotic patients. The artificial shunt successfully decompresses the portal venous system by diverting portal blood directly into the hepatic venous and systemic circulation; however, this diverted blood completely bypasses hepatic parenchymal first-pass detoxification. Ammonia and other enteric neurotoxins enter the systemic circulation, cross the blood-brain barrier, and trigger astrocyte swelling and neurocognitive dysfunction (asterixis, somnolence, confusion). First-line treatment is oral Lactulose (converting ammonia to non-absorbable ammonium) and Rifaximin."
    }
  ]
};
