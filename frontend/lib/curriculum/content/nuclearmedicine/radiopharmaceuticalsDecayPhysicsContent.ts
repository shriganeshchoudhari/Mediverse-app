/**
 * Nuclear Medicine: Radiopharmaceuticals, Radioactive Decay Physics & Radiation Safety
 * Authoritative medical content derived from Mettler & Guiberteau's Essentials of Nuclear Medicine (7th ed.), Saha's Nuclear Pharmacy.
 * Mapped to NMC CBME Competencies: NM1.1, NM1.2, NM2.1, NM2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RADIOPHARMACEUTICALS_DECAY_PHYSICS_MODULE: PhysiologyLessonModule = {
  id: "nuclearmedicine-radiopharmaceuticals-decay-physics",
  unitCode: "NM1.1",
  title: "Radiopharmaceutical Physics: Technetium-99m, Fluorine-18, Iodine Radioisotopes & ALARA Safety",
  competencies: ["NM1.1", "NM1.2", "NM2.1", "NM2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RADIOLOGY",
  markdownContent: `
# Radiopharmaceutical Physics: Technetium-99m, Fluorine-18, Iodine Radioisotopes & ALARA Safety

Nuclear medicine utilizes unsealed radioactive tracers bound to biologically active ligands to image physiological and metabolic processes in vivo.

---

## 1. Physical Characteristics of Diagnostic & Therapeutic Radionuclides

| Radionuclide | Physical Half-Life ($T_{1/2}$) | Mode of Decay & Emitted Radiation | Production Method | Canonical Clinical Radiopharmaceuticals & Indications |
| :--- | :--- | :--- | :--- | :--- |
| **Technetium-99m ($^{99\\text{m}}\\text{Tc}$)** | **$6.02\\text{ hours}$** | **Isomeric Transition (IT)**: Pure gamma ($140\\text{ keV}$ photon). *Ideal energy for NaI(Tl) gamma cameras with low patient radiation dose*. | $^{99}\\text{Mo} - {}^{99\\text{m}}\\text{Tc}$ Generator (**"Moly Cow"** eluate via $0.9\\%$ saline). | • $^{99\\text{m}}\\text{Tc-MDP}$ (Bone scan).<br>• $^{99\\text{m}}\\text{Tc-Sestamibi}$ (Myocardial perfusion & Parathyroid adenoma).<br>• $^{99\\text{m}}\\text{Tc-MAG3}$ (Renal tubular dynamic scan).<br>• $^{99\\text{m}}\\text{Tc-Mebrofenin}$ (HIDA cholecystitis). |
| **Fluorine-18 ($^{18}\\text{F}$)** | **$109.7\\text{ min}$ ($\\\\sim 110\\text{ min}$)** | **Positron ($\\beta^+$) Emission**: Positron travels $<1\\text{ mm}$ and annihilates with an electron $\\implies$ **two coincident $511\\text{ keV}$ photons emitted at $180^\\circ$**. | Medical Cyclotron ($^{18}\\text{O}(p,n)^{18}\\text{F}$). | **$^{18}\\text{F}\\text{-FDG}$ (2-deoxy-2-[18F]fluoro-D-glucose)** for oncologic staging and brain PET; $^{18}\\text{F}\\text{-DCFPyL}$ (PSMA prostate PET). |
| **Iodine-123 ($^{123}\\text{I}$)** | **$13.2\\text{ hours}$** | **Electron Capture (EC)**: Pure gamma ($159\\text{ keV}$). *No beta radiation*. | Cyclotron. | Thyroid uptake and scanning; $^{123}\\text{I-MIBG}$ (Pheochromocytoma, Neuroblastoma); $^{123}\\text{I-DaTscan}$ (Parkinsonian syndromes). |
| **Iodine-131 ($^{131}\\text{I}$)** | **$8.02\\text{ days}$** | **Beta-Minus ($\\beta^-$)** ($E_{max} = 0.606\\text{ MeV}$, range $0.8\\text{ mm}$) $+$ Gamma ($364\\text{ keV}$). | Nuclear Reactor fission. | **Therapeutic Radioablation**: Graves disease ($10 - 15\\text{ mCi}$) and Differentiated Thyroid Carcinoma ($30 - 200\\text{ mCi}$). |
| **Gallium-68 ($^{68}\\text{Ga}$)** | **$68\\text{ min}$** | **Positron ($\\beta^+$) Emission** ($511\\text{ keV}$ annihilation). | $^{68}\\text{Ge} - {}^{68}\\text{Ga}$ Generator. | $^{68}\\text{Ga-DOTATATE}$ (Neuroendocrine tumors); $^{68}\\text{Ga-PSMA-11}$ (Prostate cancer PET). |
| **Lutetium-177 ($^{177}\\text{Lu}$)** | **$6.65\\text{ days}$** | **Beta-Minus ($\\beta^-$)** ($E_{max} = 0.498\\text{ MeV}$, soft tissue range $\\sim 2\\text{ mm}$) $+$ low-energy gamma ($113\\text{ keV}, 208\\text{ keV}$ for SPECT). | Reactor. | **Therapeutic PRRT**: $^{177}\\text{Lu-DOTATATE}$ (Lutathera for NETs) & $^{177}\\text{Lu-PSMA-617}$ (Pluvicto for mCRPC). |

---

## 2. Radioactive Decay Law & Effective Half-Life ($T_{eff}$)

The total rate of radioisotope elimination from the body combines physical decay and biological clearance:

$$\\frac{1}{T_{eff}} = \\frac{1}{T_p} + \\frac{1}{T_b} \\implies T_{eff} = \\frac{T_p \\times T_b}{T_p + T_b}$$

- **$T_p$ (Physical Half-Life)**: Fixed nuclear property of the radionuclide.
- **$T_b$ (Biological Half-Life)**: Time required for the body to clear $50\\%$ of the chemical compound via renal/biliary excretion.
- **Clinical Implication**: $T_{eff}$ is ALWAYS shorter than both $T_p$ and $T_b$.

---

## 3. Radiation Safety & ALARA Principles

- **ALARA (As Low As Reasonably Achievable)**:
  1. **Time**: Minimize the duration of exposure near the radioactive source.
  2. **Distance (Inverse Square Law)**: Radiation intensity ($I$) decreases inversely with the square of distance ($d$):
  
$$I_1 \\times d_1^2 = I_2 \\times d_2^2 \\implies I \\propto \\frac{1}{d^2}$$

Doubling distance from a radioactive patient reduces exposure by $75\\%$!
  3. **Shielding**:
     - *Gamma / X-Rays*: High atomic number ($Z$) materials like **Lead (Pb)** and **Tungsten**.
     - *Pure Beta Emitters (e.g. Yttrium-90, Phosphorus-32)*: **Plastic / Acrylic / Lucite** shielding to prevent high-Z **Bremsstrahlung ("braking radiation") X-rays**!
`,
  clinicalVignettes: [
    {
      scenario: "A nuclear pharmacist is preparing a dose of pure beta-minus emitting Yttrium-90 (90Y) microspheres for radioembolization of hepatocellular carcinoma. A trainee pharmacist suggests using a lead syringe shield to handle the radiopharmaceutical.",
      question: "Why is heavy lead shielding contraindicated when handling high-energy pure beta emitters, and what material should be used instead?",
      options: [
        "High-energy beta particles interacting with high-Z lead atoms produce hazardous secondary Bremsstrahlung X-rays; Low-Z plastic/acrylic shielding should be used instead",
        "Lead absorbs beta particles and becomes radioactive; Copper shielding should be used",
        "Lead accelerates beta particle decay; Steel shielding should be used",
        "Beta particles cannot be shielded; Distance is the only protective measure"
      ],
      correctAnswerIndex: 0,
      explanation: "When high-velocity beta particles (electrons) interact with high atomic number (Z) materials like Lead (Z=82), the rapid deceleration of the charged particles generates high-energy secondary Bremsstrahlung ('braking radiation') X-rays, paradoxically increasing radiation exposure to staff. Pure beta emitters must always be shielded using low-Z materials such as Lucite, plastic, or acrylic, followed by an outer layer of lead to absorb any residual Bremsstrahlung."
    }
  ]
};
