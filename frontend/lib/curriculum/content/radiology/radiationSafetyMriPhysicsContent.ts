/**
 * Radiation Protection (ALARA) & MRI Physics (T1, T2, FLAIR, DWI) Learning Content
 * Authoritative medical content derived from Brant & Helms, Bushberg Physics, and USMLE Step 2 CK Radiology.
 * Mapped to NMC CBME Competencies: RD7.1, RD7.2, RD8.1, RD8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RADIATION_SAFETY_MRI_PHYSICS_MODULE: PhysiologyLessonModule = {
  id: "rad-radiation-safety-mri",
  unitCode: "RD7.1",
  title: "Radiology: Radiation Protection (ALARA), MRI Sequences (T1, T2, FLAIR, DWI) & Safety",
  competencies: ["RD7.1", "RD7.2", "RD8.1", "RD8.2"],
  estimatedMinutes: 140,
  organ3dTarget: "NEURAL",
  markdownContent: `
# Radiology: Radiation Protection (ALARA), MRI Sequences (T1, T2, FLAIR, DWI) & Safety

Understanding radiation physics, stochastic risk minimization, and magnetic resonance tissue contrasts is vital for safe clinical imaging practice.

---

## 1. Radiation Protection & The ALARA Principle

- **The ALARA Concept**: **A**s **L**ow **A**s **R**easonably **A**chievable.
- **The 3 Cardinal Rules of Radiation Protection**:
  1. **Time**: Minimize the duration of direct X-ray exposure (especially in fluoroscopy / angiography).
  2. **Distance**: Maximize distance from the radiation source according to the **Inverse Square Law**:
     $$I_1 \\cdot d_1^2 = I_2 \\cdot d_2^2 \\implies I \\propto \\frac{1}{d^2}$$
     *(Doubling the distance from the X-ray tube reduces the radiation exposure to $1/4$ ($25\\%$); tripling reduces it to $1/9$ ($11\\%$)).*
  3. **Shielding**: Interpose protective barriers; lead aprons ($\ge 0.5\\text{ mm Pb}$ equivalent attenuate $> 95\\%$ of scatter), thyroid shields, and leaded glasses.
- **Biological Effects of Ionizing Radiation**:
  - **Deterministic (Non-Stochastic) Effects**: Have a distinct dose threshold below which the effect does not occur; severity increases proportionally with dose (e.g. skin erythema, radiation burns, radiation-induced cataracts, sterility).
  - **Stochastic Effects**: **NO THRESHOLD DOSE**; probability of occurrence (rather than severity) increases linearly with cumulative dose (e.g. radiation-induced carcinogenesis, hereditary genetic mutations).

---

## 2. Magnetic Resonance Imaging (MRI) Sequences: Contrast Physics

| MRI Pulse Sequence | Physics & Tissue Contrast Characteristics | Typical Fluid (CSF / Water) Appearance | Best Clinical Diagnostic Utility |
| :--- | :--- | :--- | :--- |
| **T1-Weighted (T1WI)** | Measures longitudinal spin-lattice relaxation time ($T_1$). Short TR, short TE.<br>• **Fat / Myelin**: **Hyperintense (Bright)**.<br>• **Water / CSF**: **Hypointense (Dark)**. | **DARK (Hypointense)**<br>*(Mnemonic: "T1 = Fluid is One / Dark")* | Excellent for detailed anatomical morphology, cortical architecture, and post-contrast gadolinium enhancement. |
| **T2-Weighted (T2WI)** | Measures transverse spin-spin relaxation time ($T_2$). Long TR, long TE.<br>• **Water / CSF / Edema**: **Hyperintense (Bright)**.<br>• **Fat**: Intermediate-to-bright. | **BRIGHT (Hyperintense)**<br>*(Mnemonic: "T2 = $H_2O$ is Bright")* | Excellent for identifying pathology, cerebral edema, inflammation, fluid collections, and demyelination. |
| **FLAIR (Fluid-Attenuated Inversion Recovery)** | A modified T2-weighted sequence with an inversion pulse specifically designed to nullify (suppress) the signal from **Free Mobile Water (CSF)**. | **DARK (Suppressed)** | **Multiple Sclerosis**: Periventricular hyperintense demyelinating plaques ("Dawson\'s Fingers") stand out boldly without CSF glare. Subarachnoid hemorrhage. |
| **Diffusion-Weighted Imaging (DWI) & ADC** | Measures the Brownian motion of water molecules. Cytotoxic edema (cell swelling from $Na^+/K^+$ ATPase failure) causes **Restricted Diffusion**. | **Hyperintense (Bright) on DWI** with corresponding **Hypointense (Dark) on ADC Map** | **Acute Ischemic Stroke within minutes** ($100\\%$ sensitive); Cerebral abscess (restricted core); Epidermoid cysts. |

---

## 3. Contrast Safety & MRI Contraindications

- **Gadolinium-Based Contrast Agents (GBCAs)**:
  - **Nephrogenic Systemic Fibrosis (NSF)**: Severe, debilitating, fibrosing disease of skin and internal organs caused by free gadolinium deposition in patients with **Severe Renal Impairment ($\text{eGFR} < 30\\text{ mL/min/1.73m}^2$)** or acute kidney injury. *Linear chelates are contraindicated in severe renal failure; macrocyclic agents have lower risk.*
- **Absolute MRI Contraindications**:
  - Non-MRI compatible cardiac pacemakers / implantable cardioverter-defibrillators (ICDs).
  - Ferromagnetic cerebral aneurysm clips (older generation).
  - Intraocular metallic foreign bodies (welders/machinists $\rightarrow$ pre-MRI orbital X-ray mandatory).
  - Cochlear implants (unless designated MRI-conditional).
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male presents with sudden-onset right arm weakness and expressive aphasia that started 45 minutes ago. An emergency non-contrast head CT is performed immediately and shows no evidence of acute intracranial hemorrhage or territorial hypodensity. An emergency brain MRI is ordered.",
      question: "Which MRI sequence is most sensitive for confirming acute cerebral ischemia in this hyperacute window, and what findings are expected?",
      options: [
        "Diffusion-Weighted Imaging (DWI); Hyperintense (bright) signal in the left MCA territory with corresponding hypointensity on the ADC map",
        "T1-weighted imaging; Marked hypointensity of the left frontal lobe",
        "T2-weighted imaging; Generalized ventricular dilation",
        "Gradient-Echo (GRE); Blooming artifact in the basal ganglia"
      ],
      correctAnswerIndex: 0,
      explanation: "Diffusion-Weighted Imaging (DWI) is the single most sensitive MRI sequence for detecting acute ischemic stroke, revealing restricted water diffusion (bright/hyperintense on DWI and dark/hypointense on the Apparent Diffusion Coefficient [ADC] map) within minutes of arterial occlusion due to cytotoxic cellular edema from Na+/K+ pump failure."
    }
  ]
};
