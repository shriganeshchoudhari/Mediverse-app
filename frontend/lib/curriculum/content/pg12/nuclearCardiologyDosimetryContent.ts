/**
 * Postgraduate Advanced Nuclear Medicine & Theranostics (PG-612)
 * Module 4: Nuclear Cardiology, Myocardial Perfusion SPECT/PET & Dosimetry Radiation Safety
 */

import { CurriculumModule } from "../../types";

export const NUCLEAR_CARDIOLOGY_DOSIMETRY_MODULE: CurriculumModule = {
  id: "fa770005-0000-0000-0000-000000000004",
  title: "Nuclear Cardiology, Myocardial Perfusion SPECT/PET, Regadenoson Stress & Radiation Health Physics",
  code: "PG12.4",
  subject: "Postgraduate Advanced Nuclear Medicine, Theranostics & Radioligand Oncology",
  semester: 10,
  description:
    "Postgraduate mastery of myocardial perfusion imaging (MPI) radiopharmaceuticals (Tc-99m sestamibi/tetrofosmin, Rb-82 PET, N-13 ammonia), quantitative coronary flow reserve (CFR), Bruce exercise vs pharmacologic regadenoson/adenosine vasodilation, polar map ischemia interpretation, and ALARA health physics radiation dosimetry.",
  estimatedMinutes: 65,
  competencies: [
    "PG12.4.1: Contrast physical kinetics of 99mTc-sestamibi / tetrofosmin vs 201Tl vs 82Rb / 13N-ammonia myocardial flow tracers",
    "PG12.4.2: Select appropriate stress modalities (Bruce exercise vs selective A2A regadenoson 0.4 mg IV) and manage AV block / bronchospasm with aminophylline",
    "PG12.4.3: Interpret polar maps to differentiate reversible ischemia (stress defect / rest normal) from fixed myocardial infarction (stress and rest defect)",
    "PG12.4.4: Apply ALARA principles (Time, Distance 1/r^2, Lead/Acrylic Shielding) and calculate absorbed (Gy) and effective dose (Sv) under NRC 50 mSv/yr occupational limits"
  ],
  sections: [
    {
      id: "sec-mpi-radiotracers",
      title: "1. Myocardial Perfusion Radiotracers: SPECT vs PET Kinetics",
      content: `
### SPECT Myocardial Perfusion Radiopharmaceuticals

| Tracer | Radionuclide & Half-Life | Cellular Uptake Mechanism | Myocardial Extraction Fraction | Redistribution & Clearance |
| :--- | :--- | :--- | :--- | :--- |
| **$^{99\\text{m}}\\text{Tc}$-Sestamibi** (Cardiolite) | $^{99\\text{m}}\\text{Tc}$ ($t_{1/2} = 6.0\\text{ hours}$), $140\\text{ keV}$ gamma | Lipophilic cation; enters cardiomyocytes via **passive diffusion** and binds negatively charged **mitochondrial inner membranes**. | Moderate ($\sim 65\\%$ at rest; roll-off at high flows) | **No significant redistribution**. Separate injections required for rest and stress. |
| **$^{99\\text{m}}\\text{Tc}$-Tetrofosmin** (Myoview) | $^{99\\text{m}}\\text{Tc}$ ($t_{1/2} = 6.0\\text{ hours}$), $140\\text{ keV}$ gamma | Enters through passive potential-driven diffusion; binds cytosol and mitochondria. | Moderate ($\sim 55-60\\%$) | Rapid hepatic/biliary clearance allows earlier post-stress imaging ($15-30\\text{ min}$). |
| **$^{201}\\text{Tl}$-Thallous Chloride** | $^{201}\\text{Tl}$ ($t_{1/2} = 73\\text{ hours}$), $69-83\\text{ keV}$ Hg X-rays | Potassium ($K^+$) analogue; actively transported via **sarcolemmal $Na^+/K^+$ ATPase pump**. | High ($\sim 85\\%$) | **Continuous dynamic redistribution** over 3-4 hours; single injection viable for rest-redistribution viability. |

---

### PET Myocardial Blood Flow & Coronary Flow Reserve (CFR)

* **$^{82}\\text{Rb}$-Chloride:** Potassium analogue ($t_{1/2} = 75\\text{ seconds}$), generator-produced from $^{82}\\text{Sr}$ parent; rapid 30-minute rest/stress protocol with ultra-low radiation burden ($2-3\\text{ mSv}$).
* **$^{13}\\text{N}$-Ammonia:** Cyclotron-produced ($t_{1/2} = 9.96\\text{ minutes}$), metabolically trapped as $^{13}\\text{N}$-glutamine via glutamine synthetase.

#### Absolute Quantitation: Coronary Flow Reserve (CFR)
$$\\text{Coronary Flow Reserve (CFR)} = \\frac{\\text{Stress Myocardial Blood Flow (MBF)}}{\\text{Rest Myocardial Blood Flow (MBF)}}$$

* **Normal CFR:** $>2.5$
* **Pathological CFR ($<2.0$):** Detects **balanced triple-vessel coronary artery disease** (which appears falsely normal on qualitative relative SPECT) and coronary microvascular dysfunction (CMD) in non-obstructive CAD.
      `
    },
    {
      id: "sec-stress-protocols",
      title: "2. Stress Modalities: Bruce Exercise vs Pharmacologic Regadenoson",
      content: `
### Exercise Bruce Protocol

* **Target Goal:** Attainment of $\\ge 85\\%$ of maximal age-predicted heart rate ($\\text{MPHR} = 220 - \\text{age}$) and a double product ($\\text{HR} \\times \\text{SBP}$) $>20,000$.
* **Radiotracer Injection:** Injected at peak exercise ($>85\\%\\text{ MPHR}$); patient must continue exercising for $60-90\\text{ seconds}$ post-injection to allow myocardial extraction during peak hyperemia.

---

### Pharmacologic Vasodilator Stress Agents

When patients are unable to exercise to target workload (orthopedic limitations, severe deconditioning, LBBB, or paced rhythm):

| Agent | Receptor Selectivity & Dosing | Hyperemic Mechanism | Absolute Contraindications | Reversal & Antidote |
| :--- | :--- | :--- | :--- | :--- |
| **Regadenoson** (Lexiscan) | **Selective $A_{2A}$ adenosine receptor agonist**; $0.4\\text{ mg}$ ($5\\text{ mL}$) rapid IV push over 10 sec | Selective coronary arteriolar vasodilation; minimal $A_1, A_{2B}, A_3$ binding | $2^{\\circ}$ or $3^{\\circ}$ AV block, sinus node dysfunction (without pacemaker), SBP $<90\\text{ mmHg}$, active wheezing/asthma. | **Aminophylline $100-200\\text{ mg}$ IV** slow push over 2-3 min. |
| **Adenosine** | Non-selective $A_1, A_{2A}, A_{2B}, A_3$ agonist; $140\\text{ }\\mu\\text{g/kg/min} \\times 6\\text{ min}$ IV | Direct arteriolar dilation | 2nd/3rd degree AV block, severe reactive airway disease (bronchospasm via $A_{2B}/A_3$). | Short half-life ($<10\\text{ sec}$); stop infusion; Aminophylline backup. |
| **Dipyridamole** (Persantine) | Indirect vasodilator; $0.56\\text{ mg/kg}$ IV over 4 min | Inhibits cellular adenosine reuptake and deaminase degradation | Severe asthma, critical aortic stenosis, hypotension. | Aminophylline $100-200\\text{ mg}$ IV mandatory at end of study. |
| **Dobutamine** | Direct $\\beta_1 > \\beta_2/\\alpha_1$ inotrope/chronotrope ($5-40\\text{ }\\mu\\text{g/kg/min}$) | Increases myocardial oxygen demand ($MVO_2$) | Unstable angina, critical aortic stenosis, severe hypertension ($>220/120$). | Esmolol / Metoprolol IV. |

* **High-Yield Rule: LBBB & Paced Rhythm:** Must undergo **pharmacologic vasodilator stress (Regadenoson/Adenosine)** rather than exercise/dobutamine to avoid false-positive septal perfusion defects caused by physiological dyssynchronous septal relaxation.
* **Caffeine Restriction:** Strict abstinence from caffeine (coffee, tea, soda, chocolate) and theophylline for **$\\ge 12-24\\text{ hours}$** prior to vasodilator stress (caffeine is a competitive antagonist of $A_{2A}$ receptors, blocking pharmacologic hyperemia).
      `
    },
    {
      id: "sec-polar-map-interpretation",
      title: "3. Polar Map Bullseye Reconstruction & Perfusion Patterns",
      content: `
### Standard 17-Segment Myocardial Polar Map Model

The American Heart Association (AHA) 17-segment model divides the left ventricle into basal (segments 1-6), mid-cavity (segments 7-12), apical (segments 13-16), and apex (segment 17):

* **Left Anterior Descending (LAD) Artery:** Anterior wall (segments 1, 7, 13), Anteroseptal (segments 2, 8), Apical anterior & Apical septal (segments 14, 17).
* **Right Coronary Artery (RCA):** Inferior wall (segments 4, 10, 15), Inferoseptal (segments 3, 9).
* **Left Circumflex (LCx) Artery:** Anterolateral (segments 6, 12), Inferolateral (segments 5, 11, 16).

---

### Diagnostic Scintigraphic Perfusion Patterns

| Stress Image Finding | Rest Image Finding | Pathophysiological Interpretation | Clinical Management Decision |
| :--- | :--- | :--- | :--- |
| **Perfusion Defect** (Reduced/Absent Uptake) | **Normal Perfusion** (Complete Radiotracer Fill-In) | **Reversible Ischemia** (Inducible stress-induced flow mismatch) | **Revascularization Candidate** (PCI / CABG) + Intensive medical anti-anginal therapy. |
| **Perfusion Defect** | **Perfusion Defect** (No Change in Uptake) | **Fixed Defect (Infarcted Scar / Non-viable Myocardium)** | If resting wall motion is akinetic/dyskinetic, assess metabolic viability with $^{18}\\text{F}$-FDG PET. |
| **Fixed Defect** | **Normal Perfusion on Gated SPECT** | **Soft Tissue Attenuation Artifact** (Breast attenuation in anterior wall, Diaphragmatic attenuation in inferior wall) | Gated wall motion & thickening confirms normal viability; prone positioning or CT attenuation correction. |
| **Normal Perfusion** | **Perfusion Defect** | **Reverse Redistribution** (Seen in patent recanalized infarcts or subendocardial ischemia) | Correlate with clinical symptoms and wall motion analysis. |
      `
    },
    {
      id: "sec-health-physics-dosimetry",
      title: "4. Health Physics, Radiation Dosimetry & ALARA Principles",
      content: `
### Radiation Physics: Quantities, Units & Conversions

| Physical Quantity | SI Unit | Traditional Unit | Conversion Factor |
| :--- | :--- | :--- | :--- |
| **Radioactivity ($A$)** | **Becquerel (Bq)** ($1\\text{ dps}$) | **Curie (Ci)** ($3.7 \\times 10^{10}\\text{ dps}$) | $1\\text{ mCi} = 37\\text{ MBq}$; $1\\text{ GBq} = 27.03\\text{ mCi}$ |
| **Absorbed Dose ($D$)** | **Gray (Gy)** ($1\\text{ J/kg}$) | **Rad** ($100\\text{ ergs/g}$) | $1\\text{ Gy} = 100\\text{ rad}$; $1\\text{ rad} = 10\\text{ mGy} = 0.01\\text{ Gy}$ |
| **Equivalent Dose ($H$)** | **Sievert (Sv)** ($H = D \\times W_R$) | **Rem** ($H = D \\times Q$) | $1\\text{ Sv} = 100\\text{ rem}$; $1\\text{ rem} = 10\\text{ mSv}$ ($W_R = 1$ for $\\gamma/\\beta$; $W_R = 20$ for $\\alpha$) |
| **Effective Dose ($E$)** | **Sievert (Sv)** ($E = \\sum H_T \\times W_T$) | **Rem** | Sum of tissue equivalent doses weighted by organ radiosensitivity ($W_T$). |

---

### The Three Cardinal ALARA Principles

$$\\text{ALARA: As Low As Reasonably Achievable}$$

1. **Time:** Total radiation exposure is directly proportional to exposure time ($\\text{Dose} = \\text{Dose Rate} \\times \\text{Time}$). Work swiftly; prepare equipment prior to source exposure.
2. **Distance (Inverse Square Law):** Radiation intensity decreases inversely with the square of the distance from a point source:
$$I_2 = I_1 \\times \\left(\\frac{d_1}{d_2}\\right)^2$$
Doubling distance drops exposure to **$25\\%$ ($1/4$)**; using forceps/syringe tongs exponentially decreases finger extremity dose.
3. **Shielding:**
   * **Gamma ($\\gamma$) / X-Rays:** High atomic number ($Z$) materials (Lead, Tungsten). Half-Value Layer (HVL) of lead for $^{99\\text{m}}\\text{Tc}$ ($140\\text{ keV}$) is $0.27\\text{ mm}$.
   * **Beta ($\\beta^-$) Emitters ($^{90}\\text{Y}, ^{32}\\text{P}, ^{89}\\text{Sr}$):** **Low-$Z$ plastic/acrylic shielding** FIRST to prevent high-energy **Bremsstrahlung (braking radiation)** X-ray production, followed by thin outer lead wrap.

---

### NRC Annual Occupational & Public Dose Limits (10 CFR 20)

* **Whole Body Total Effective Dose Equivalent (TEDE):** **$50\\text{ mSv/year}$ ($5.0\\text{ rem/year}$)**.
* **Lens of the Eye Equivalent Dose:** **$150\\text{ mSv/year}$ ($15\\text{ rem/year}$)**.
* **Extremities (Hands/Feet) & Skin:** **$500\\text{ mSv/year}$ ($50\\text{ rem/year}$)**.
* **General Public / Non-Occupational:** **$1\\text{ mSv/year}$ ($0.1\\text{ rem/year}$)** (exclusive of medical treatments).
* **Embryo/Fetus of Declared Pregnant Worker:** **$5.0\\text{ mSv}$ ($0.5\\text{ rem}$)** over entire gestation (and $\\le 0.5\\text{ mSv/month}$).
      `
    }
  ]
};
