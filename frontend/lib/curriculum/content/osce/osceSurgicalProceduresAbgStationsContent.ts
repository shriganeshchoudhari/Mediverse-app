/**
 * OSCE Simulation Stations: Suture Material Selection, Knot Tying & Arterial Blood Gas (ABG) Analysis
 * Authoritative medical content derived from ACS Core Surgery Curriculum, Marino's ICU, and USMLE Step 2 CS / Step 3 OSCE.
 * Mapped to NMC CBME Competencies: OS5.1, OS5.2, OS6.1, OS6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OSCE_SURGICAL_PROCEDURES_ABG_STATIONS_MODULE: PhysiologyLessonModule = {
  id: "osce-surgical-procedures-abg-stations",
  unitCode: "OS5.1",
  title: "OSCE Station: Suture Selection, Surgical Knot Tying & ABG Acid-Base Interpretation",
  competencies: ["OS5.1", "OS5.2", "OS6.1", "OS6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# OSCE Station: Suture Selection, Surgical Knot Tying & ABG Acid-Base Interpretation

Technical procedural precision in basic surgical wound closure combined with rapid mathematical interpretation of arterial blood gases form core practical examination competencies.

---

## 1. OSCE Station 5: Suture Materials & Wound Closure Checklist

### Suture Material Classification & Clinical Indications

| Suture Material | Structure & Material Type | Tensile Strength Duration & Absorption | Clinical Tissue Indications |
| :--- | :--- | :--- | :--- |
| **Nylon (Ethilon)** | **Non-Absorbable, Monofilament** (Polyamide) | Indefinite; minimal tissue reactivity. | **Skin Closure** (Face: 5-0 / 6-0; Scalp/Torso: 3-0 / 4-0; Extremities: 4-0). |
| **Polypropylene (Prolene)** | **Non-Absorbable, Monofilament** | Indefinite; extremely low thrombogenicity. | **Vascular Anastomosis**, fascia repair, subcuticular skin closure, tendon repair. |
| **Polyglactin 910 (Vicryl)** | **Absorbable, Braided Multifilament** (Synthetic) | $50\\%$ strength at 3 weeks; absorbs by hydrolysis in $60 - 90\\text{ days}$. | **Subcutaneous fat, deep dermis, bowel anastomosis**, oral mucosa, episiotomy. |
| **Poliglecaprone 25 (Monocryl)** | **Absorbable, Monofilament** | $50\\%$ strength at 1 week; absorbs by 90–120 days. | **Subcuticular cosmetic skin closure**; low infection risk. |
| **Polydioxanone (PDS II)** | **Absorbable, Monofilament** | **Long-term support**: $50\\%$ strength at 4–6 weeks; absorbs by $180 - 210\\text{ days}$. | **Abdominal Wall Fascial Closure (Lineal alba)**; high-tension slow-healing tissues. |
| **Surgical Silk** | **Non-Absorbable, Braided** (Natural protein) | Loses strength over 1 year. | Securing surgical drains, central venous lines, chest tubes. |

### Step-by-Step Surgical Knot Tying & Suture Technique
1. **Instrument Handling**: Hold needle holder with thumb and ring finger in rings; index finger along shaft for stabilization. Grasp needle at junction of middle and posterior third.
2. **Simple Interrupted Suture**: Enter skin at $90^\\circ$ angle; rotate wrist through curve of needle; exit equidistant on opposite side.
3. **Vertical Mattress Suture ("Far-Far, Near-Near")**:
   - *Indication*: **Skin edge eversion in high-tension or lax wounds** (groin, back, neck).
   - Enter far ($4-8\\text{ mm}$) from wound edge $\\rightarrow$ pass deep $\\rightarrow$ exit far $\\rightarrow$ backhand enter near ($1-2\\text{ mm}$) $\\rightarrow$ pass superficial $\\rightarrow$ exit near $\\rightarrow$ tie knot.
4. **Horizontal Mattress Suture**: Eversion with broad tension distribution (fragile skin, palm/sole).
5. **Knot Tying (Square Knot / Instrument Tie)**:
   - Double throw forward (Surgeon\\'s knot) $\\rightarrow$ pull flat $\\rightarrow$ single throw backward $\\rightarrow$ square the knot $\\rightarrow$ single throw forward. Minimum **3 to 4 throws for braided** sutures; **5 to 6 throws for monofilament** sutures (Nylon/Prolene have high memory).

---

## 2. OSCE Station 6: Stepwise Arterial Blood Gas (ABG) Diagnostic Algorithm

- **Step 1: Check pH** $\implies$ Acidemia ($\text{pH} < 7.35$) vs Alkalemia ($\text{pH} > 7.45$)
- **Step 2: Check $\text{PaCO}_2$ and $[\text{HCO}_3^-]$** $\implies$ Determine Primary Metabolic vs Respiratory Disorder
- **Step 3: Calculate Serum Anion Gap (AG)**:
  $$\text{AG} = [\text{Na}^+] - ([\text{Cl}^-] + [\text{HCO}_3^-]) \quad (\text{Normal: } 8 - 12\text{ mEq/L})$$
- **Step 4: Check Respiratory Compensation (Winter's Formula)**:
  $$\text{Expected PaCO}_2 = 1.5 \times [\text{HCO}_3^-] + 8 \pm 2$$
- **Step 5: Check Delta-Delta Ratio ($\Delta\text{-}\Delta$)**:
  $$\frac{\Delta \text{AG}}{\Delta \text{HCO}_3^-} = \frac{\text{AG} - 12}{24 - [\text{HCO}_3^-]} \quad (<0.8 \implies \text{NAGMA; } >2.0 \implies \text{Metabolic Alkalosis})$$

| Primary Acid-Base Disturbance | Primary Alteration | Secondary Expected Compensation | Classic Clinical Causes |
| :--- | :--- | :--- | :--- |
| **High Anion Gap Metabolic Acidosis (HAGMA)** | $[HCO_3^-] \\downarrow$ ($< 22$) with $AG > 12$ | Expected $PaCO_2 = 1.5[HCO_3^-] + 8 \\pm 2$ | **GOLD MARK**: Glycols, Oxoproline, L-Lactate, D-Lactate, Methanol, Aspirin/Salicylates, Renal Failure (Uremia), Ketoacidosis (DKA/Alcoholic). |
| **Normal Anion Gap Metabolic Acidosis (NAGMA)** | $[HCO_3^-] \\downarrow$ with $AG \\le 12$ ($[Cl^-] \\uparrow$) | Expected $PaCO_2 = 1.5[HCO_3^-] + 8 \\pm 2$ | **HARDUP**: Hyperalimentation, Acetazolamide, Renal Tubular Acidosis (RTA), Diarrhea (GI $HCO_3^-$ loss), Ureterosigmoidostomy, Pancreatic fistula. |
| **Metabolic Alkalosis** | $[HCO_3^-] \\uparrow$ ($> 26$) | Expected $PaCO_2 \\uparrow$ by $0.7\\text{ mmHg}$ per $1\\text{ mEq/L } \\uparrow$ in $[HCO_3^-]$ | Severe vomiting/NG suction, loop/thiazide diuretics (hypokalemia), primary hyperaldosteronism. |
| **Acute Respiratory Acidosis** | $PaCO_2 \\uparrow$ ($> 45$) | $[HCO_3^-] \\uparrow$ by $1\\text{ mEq/L}$ per $10\\text{ mmHg } \\uparrow$ in $PaCO_2$ | Opioid overdose, hypoventilation, acute airway obstruction. |
| **Chronic Respiratory Acidosis** | $PaCO_2 \\uparrow$ ($> 45$) | $[HCO_3^-] \\uparrow$ by $3.5\\text{ mEq/L}$ per $10\\text{ mmHg } \\uparrow$ in $PaCO_2$ | Severe COPD, neuromuscular hypoventilation, obesity-hypoventilation. |
| **Respiratory Alkalosis** | $PaCO_2 \\downarrow$ ($< 35$) | $[HCO_3^-] \\downarrow$ by $2\\text{ (acute) or } 5\\text{ (chronic) mEq/L}$ per $10\\text{ mmHg } \\downarrow$ in $PaCO_2$ | Panic hyperventilation, pulmonary embolism, early sepsis, salicylate toxicity. |
`,
  clinicalVignettes: [
    {
      scenario: "In an OSCE station, you are handed the arterial blood gas (ABG) and basic metabolic panel of a 24-year-old female with Type 1 Diabetes who presents with nausea, vomiting, and Kussmaul respirations: pH 7.18, PaCO2 20 mmHg, PaO2 95 mmHg, HCO3- 7 mEq/L, Na+ 135 mEq/L, Cl- 98 mEq/L, K+ 5.2 mEq/L, Glucose 460 mg/dL.",
      question: "Which of the following represents the correct multi-step acid-base diagnosis?",
      options: [
        "Primary High Anion Gap Metabolic Acidosis (Anion Gap 30 mEq/L) with appropriate respiratory compensation (Winter's formula expected PaCO2 = 18.5 +/- 2 mmHg) consistent with DKA",
        "Primary Respiratory Acidosis with secondary metabolic compensation",
        "Normal Anion Gap Metabolic Acidosis (NAGMA) with coexisting respiratory acidosis",
        "Mixed Metabolic Acidosis and Metabolic Alkalosis"
      ],
      correctAnswerIndex: 0,
      explanation: "Step 1: pH 7.18 < 7.35 (Severe Acidemia). Step 2: Low HCO3- (7 mEq/L) indicates Primary Metabolic Acidosis. Step 3: Anion Gap = 135 - (98 + 7) = 30 mEq/L (severely elevated >12, confirming High Anion Gap Metabolic Acidosis). Step 4: Winter's formula: Expected PaCO2 = 1.5(7) + 8 +/- 2 = 18.5 +/- 2 mmHg (range 16.5 to 20.5 mmHg). The measured PaCO2 is 20 mmHg, which falls exactly within the expected compensatory range, indicating pure respiratory compensation without a second respiratory disorder."
    }
  ]
};
