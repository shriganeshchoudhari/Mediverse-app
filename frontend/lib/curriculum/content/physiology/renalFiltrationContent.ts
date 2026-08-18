/**
 * Renal Physiology & Filtration Dynamics Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.) and Costanzo Renal Physiology.
 * Mapped to NMC CBME Competencies: PY7.1, PY7.2, PY7.3
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const RENAL_FILTRATION_MODULE: PhysiologyLessonModule = {
  id: "phys-renal-filtration",
  unitCode: "PY7.1",
  title: "Glomerular Filtration Dynamics, Clearance Kinetics & FeNa",
  competencies: ["PY7.1", "PY7.2"],
  estimatedMinutes: 115,
  simulatorRoute: "/simulators/renal-filtration",
  simulatorParams: {
    hydrostaticCapillary: 60,
    hydrostaticBowman: 15,
    oncoticCapillary: 28,
    oncoticBowman: 0,
    kf: 12.5
  },
  organ3dTarget: "RENAL",
  markdownContent: `
# Glomerular Filtration Dynamics, Clearance Kinetics & FeNa

The kidney filters approximately **180 Liters of plasma per day** (GFR $\\approx 125\\text{ mL/min}$), clearing nitrogenous wastes while conserving essential electrolytes, amino acids, and water.

---

## 1. Starling Forces & Net Ultrafiltration Pressure

Glomerular filtration rate (GFR) is governed by the balance of hydrostatic and colloid osmotic pressures across the glomerular filtration barrier:

$$\\text{GFR} = K_f \\cdot \\left[ (P_{GC} - P_{BS}) - (\\pi_{GC} - \\pi_{BS}) \\right]$$

Where:
- $K_f$: Ultrafiltration coefficient ($12.5\\text{ mL/min/mmHg}$). Reflects capillary surface area and hydraulic permeability (reduced in Diabetic Glomerulosclerosis, Glomerulonephritis).
- $P_{GC}$: Glomerular capillary hydrostatic pressure ($60\\text{ mmHg}$). Favors filtration. Controlled by afferent and efferent arteriolar tone.
- $P_{BS}$: Bowman's space hydrostatic pressure ($15\\text{ mmHg}$). Opposes filtration. Elevated in urinary tract obstruction (hydronephrosis, BPH, ureteral stone).
- $\\pi_{GC}$: Glomerular capillary colloid osmotic pressure ($28 - 32\\text{ mmHg}$). Opposes filtration. Increases along the length of the capillary as protein-free filtrate leaves.
- $\\pi_{BS}$: Bowman's space colloid osmotic pressure ($0\\text{ mmHg}$). Normally negligible because proteins do not cross the intact charge-selective (podocyte podocalyxin) and size-selective ($<4\\text{ nm}$) barrier.

$$\\text{Net Ultrafiltration Pressure} = (60 - 15) - (28 - 0) = 45 - 28 = 17\\text{ mmHg}$$

$$\\text{Normal GFR} = 12.5 \\times 17 = 212.5 \\times 0.6 = 125\\text{ mL/min}$$

---

## 2. Arteriolar Resistance Hemodynamics

| Condition / Drug | Afferent Arteriolar Resistance | Efferent Arteriolar Resistance | $P_{GC}$ | GFR | Renal Plasma Flow (RPF) | Filtration Fraction ($FF = GFR/RPF$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NSAIDs** (Inhibit Prostaglandin $PGE_2$ dilation) | $\\uparrow$ Constricts | $\\leftrightarrow$ | $\\downarrow$ | $\\downarrow$ | $\\downarrow\\downarrow$ | $\\uparrow$ |
| **ACE Inhibitors / ARBs** (Block Angiotensin II constriction) | $\\leftrightarrow$ | $\\downarrow$ Dilates | $\\downarrow$ | $\\downarrow$ | $\\uparrow$ | $\\downarrow\\downarrow$ |
| **Angiotensin II** (Preferential efferent constrictor) | $\\leftrightarrow$ | $\\uparrow$ Constricts | $\\uparrow$ | Maintains/$\\uparrow$ | $\\downarrow$ | $\\uparrow\\uparrow$ |

---

## 3. Renal Clearance Kinetics & Diagnostic Biomarkers

The clearance of a substance $x$ is the volume of plasma rendered completely free of that substance per unit time:

$$C_x = \\frac{U_x \\cdot \\dot{V}}{P_x}$$

- **Inulin Clearance ($C_{\\text{inulin}}$)**: Freely filtered, neither reabsorbed nor secreted $\\implies C_{\\text{inulin}} = \\text{True GFR}$.
- **Para-aminohippuric Acid ($C_{\\text{PAH}}$)**: Freely filtered and completely secreted from peritubular capillaries $\\implies C_{\\text{PAH}} = \\text{Effective Renal Plasma Flow (eRPF)} \\approx 600 - 650\\text{ mL/min}$.
- **Renal Blood Flow (RBF)**:
  $$\\text{RBF} = \\frac{\\text{RPF}}{1 - \\text{Hematocrit}} \\approx \\frac{600}{1 - 0.45} = 1090\\text{ mL/min} \\quad (\\sim 20\\text{ - }25\\% \\text{ of Cardiac Output})$$

---

## 4. Fractional Excretion of Sodium (FeNa) in Acute Kidney Injury

In oliguric acute kidney injury, FeNa differentiates between **Prerenal Azotemia** (intact tubular reabsorption) and **Intrinsic Acute Tubular Necrosis (ATN)** (damaged tubular epithelium):

$$\\text{FeNa} = \\frac{\\text{Filtered Na Excreted}}{\\text{Total Na Filtered}} \\times 100\\% = \\frac{U_{Na} / P_{Na}}{U_{Cr} / P_{Cr}} \\times 100\\% = \\frac{U_{Na} \\cdot P_{Cr}}{P_{Na} \\cdot U_{Cr}} \\times 100\\%$$

- **Prerenal Azotemia**: $\\text{FeNa} < 1.0\\%$, $\\text{BUN/Cr Ratio} > 20:1$, Urine Osmolality $> 500\\text{ mOsm/kg}$, Urine $Na^+ < 20\\text{ mEq/L}$.
- **Intrinsic Renal / ATN**: $\\text{FeNa} > 2.0\\%$, $\\text{BUN/Cr Ratio} < 15:1$, Urine Osmolality $< 350\\text{ mOsm/kg}$, Urine $Na^+ > 40\\text{ mEq/L}$, "Muddy brown" granular casts.
`,
  clinicalVignettes: [
    {
      scenario: "A 72-year-old male with severe dehydration from a 3-day history of rotavirus gastroenteritis develops oliguria. Laboratory analysis reveals Serum Creatinine 2.8 mg/dL, Serum BUN 64 mg/dL, Serum Na+ 138 mEq/L, Urine Na+ 12 mEq/L, and Urine Creatinine 90 mg/dL.",
      question: "Calculate the Fractional Excretion of Sodium (FeNa) and select the most appropriate clinical diagnosis.",
      options: [
        "FeNa = 0.27%; Prerenal Azotemia with intact tubular sodium reabsorption",
        "FeNa = 2.7%; Intrinsic Acute Tubular Necrosis with tubular basement membrane disruption",
        "FeNa = 4.5%; Postrenal obstructive uropathy secondary to prostatic hyperplasia",
        "FeNa = 1.8%; Acute interstitial nephritis secondary to antibiotic hypersensitivity"
      ],
      correctAnswerIndex: 0,
      explanation: "FeNa = (UNa * PCr) / (PNa * UCr) * 100% = (12 * 2.8) / (138 * 90) * 100% = 33.6 / 12420 * 100% = 0.27%. A FeNa < 1% paired with a BUN/Cr ratio > 20:1 confirms prerenal azotemia with hyperactive aldosterone and intact tubular conservation of sodium."
    }
  ]
};
