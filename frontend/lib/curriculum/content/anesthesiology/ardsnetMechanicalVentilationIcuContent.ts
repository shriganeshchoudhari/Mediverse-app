/**
 * ARDSNet Lung-Protective Mechanical Ventilation, Berlin Definition & Proning Protocol
 * Authoritative medical content derived from Marino ICU Book, ARDSNet Trial, PROSEVA Trial, and USMLE Step 2 CK Critical Care.
 * Mapped to NMC CBME Competencies: AS7.1, AS7.2, AS8.1, AS8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ARDSNET_MECHANICAL_VENTILATION_ICU_MODULE: PhysiologyLessonModule = {
  id: "anes-ardsnet-mechanical-ventilation",
  unitCode: "AS7.1",
  title: "Critical Care: ARDS (Berlin Definition), ARDSNet Lung-Protective Ventilation & Proning",
  competencies: ["AS7.1", "AS7.2", "AS8.1", "AS8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Critical Care: ARDS (Berlin Definition), ARDSNet Lung-Protective Ventilation & Proning

Acute Respiratory Distress Syndrome (ARDS) is non-cardiogenic pulmonary edema characterized by diffuse inflammatory alveolar-capillary endothelial injury, requiring lung-protective mechanical ventilation strategies.

---

## 1. The Berlin Definition of ARDS

All 4 criteria must be satisfied:
1. **Timing**: Acute onset within **$1\\text{ week}$** of a known clinical insult or new/worsening respiratory symptoms.
2. **Chest Imaging (CXR / CT)**: **Bilateral opacities** not fully explained by pleural effusions, lobar collapse, or pulmonary nodules.
3. **Origin of Edema**: Respiratory failure **NOT fully explained by cardiac failure or fluid overload** (confirmed by echocardiography or $\\text{PCWP} \\le 18\\text{ mmHg}$).
4. **Oxygenation Severity (on PEEP $\\ge 5\\text{ cmH}_2\\text{O}$)**:
   - **Mild ARDS**: $200\\text{ mmHg} < \\text{PaO}_2 / \\text{FiO}_2 \\le 300\\text{ mmHg}$.
   - **Moderate ARDS**: $100\\text{ mmHg} < \\text{PaO}_2 / \\text{FiO}_2 \\le 200\\text{ mmHg}$.
   - **Severe ARDS**: **$\\text{PaO}_2 / \\text{FiO}_2 \\le 100\\text{ mmHg}$**.

---

## 2. The ARDSNet Lung-Protective Mechanical Ventilation Protocol

$$\\text{Predicted Body Weight (PBW) in kg}: \\begin{cases} 50 + 0.91 \\times (\\text{Height in cm} - 152.4) & (\\text{Males}) \\\\ 45.5 + 0.91 \\times (\\text{Height in cm} - 152.4) & (\\text{Females}) \\end{cases}$$
*(CRITICAL: Tidal volume MUST be calculated using **Predicted Body Weight**, NEVER actual body weight, to avoid catastrophic volutrauma!)*

| ARDSNet Parameter | Target Guideline | Physiological Rationale & Mechanism |
| :--- | :--- | :--- |
| **Low Tidal Volume ($V_t$)** | **$4 - 8\\text{ mL/kg of PBW}$** (initiate at $6\\text{ mL/kg PBW}$) | Prevents **Volutrauma** (alveolar overdistention in the small aerated "baby lung"). |
| **Plateau Pressure ($P_{\\text{plat}}$)** | Maintain **$P_{\\text{plat}} \\le 30\\text{ cmH}_2\\text{O}$** (measured during an end-inspiratory hold) | Prevents **Barotrauma** (alveolar rupture, pneumothorax, subcutaneous emphysema). |
| **Driving Pressure ($\\Delta P$)** | Maintain **$\\Delta P = P_{\\text{plat}} - \\text{PEEP} \\le 14\\text{ cmH}_2\\text{O}$** | Single strongest mechanical ventilator variable associated with reduced mortality in ARDS. |
| **PEEP / $\\text{FiO}_2$ Titration** | High PEEP titration ladder ($8-24\\text{ cmH}_2\\text{O}$) | Prevents **Atelectrauma** (cyclic end-expiratory alveolar collapse and shearing during reopening). |
| **Oxygenation Goal** | $\\text{PaO}_2 = 55-80\\text{ mmHg}$ OR $\\text{SpO}_2 = 88-95\\%$ | Minimizes oxygen toxicity (formation of reactive oxygen species). |
| **Permissive Hypercapnia** | Accept $\\text{pH} \\ge 7.20-7.25$ even with elevated $\\text{PaCO}_2$ ($50-70\\text{ mmHg}$) | Avoids increasing $V_t$ or respiratory rate at the expense of lung parenchymal injury. |

---

## 3. Evidence-Based Rescue Interventions in Severe Refractory ARDS

- **Prone Positioning Ventilation (PROSEVA Trial)**:
  - **Indication**: Severe ARDS with **$\\text{PaO}_2 / \\text{FiO}_2 < 150\\text{ mmHg}$** despite optimal PEEP on $\\text{FiO}_2 \\ge 0.60$.
  - **Protocol**: Place patient in prone position for **at least $16\\text{ consecutive hours per day}$**.
  - **Mechanisms**:
    1. Removes cardiac and abdominal compression on dependent dorsal lung zones.
    2. Homogenizes transpulmonary pressure gradients across the lung.
    3. Dramatically improves ventilation-perfusion ($V/Q$) matching in perfused dorsal alveoli.
  - **Outcome**: **Reduces 28-day and 90-day all-cause mortality by $> 50\\%$**!
- **Neuromuscular Blockade Infusion (ACURASYS Protocol)**:
  - Continuous 48-hour infusion of **Cisatracurium** in early severe ARDS ($P/F < 150\\text{ mmHg}$) to eliminate patient-ventilator dyssynchrony and reduce transpulmonary pressure swings.
- **Inhaled Pulmonary Vasodilators**:
  - **Inhaled Epoprostenol ($PGI_2$) or Inhaled Nitric Oxide (iNO)**: Selectively dilates pulmonary vessels in ventilated lung units, reducing intrapulmonary shunt without causing systemic hypotension.
- **Veno-Venous Extracorporeal Membrane Oxygenation (VV-ECMO)**:
  - Indicated for refractory hypoxemic respiratory failure with $P/F < 80\\text{ mmHg}$ for $> 6\\text{ hours}$ or $pH < 7.15$ despite lung-protective ventilation and proning (CESAR and EOLIA trials).
`,
  clinicalVignettes: [
    {
      scenario: "A 60-year-old male with severe septic shock secondary to acute pancreatitis is intubated in the ICU for acute hypoxemic respiratory failure. Height is 178 cm (5 ft 10 in), and actual body weight is 115 kg (obese). Chest radiograph demonstrates diffuse bilateral alveolar infiltrates with normal cardiac silhouette and no pleural effusions. Echocardiogram shows normal left ventricular systolic function (EF 60%). Mechanical ventilator settings on volume-control are: Tidal Volume 700 mL (based on actual weight), Rate 18 bpm, FiO2 0.80, PEEP 10 cmH2O. Arterial blood gas shows: pH 7.28, PaCO2 48 mmHg, PaO2 72 mmHg, HCO3- 22 mEq/L (PaO2/FiO2 ratio = 90 mmHg). Inspiratory plateau pressure is measured at 38 cmH2O.",
      question: "Which of the following is the diagnosis, and what immediate adjustment in mechanical ventilator settings is required to comply with ARDSNet lung-protective protocol?",
      options: [
        "Severe ARDS; Recalculate Predicted Body Weight (~73 kg) and decrease Tidal Volume to 440 mL (6 mL/kg PBW) to achieve Plateau Pressure <=30 cmH2O",
        "Acute Pulmonary Edema; Increase Tidal Volume to 800 mL to blow off CO2",
        "Transfusion-Related Acute Lung Injury; Discontinue PEEP and increase FiO2 to 1.0",
        "Aspiration Pneumonitis; Administer high-dose intravenous Methylprednisolone"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient with non-cardiogenic pulmonary edema, bilateral CXR infiltrates, and a PaO2/FiO2 ratio of 90 mmHg (<100 mmHg) has Severe ARDS by the Berlin criteria. The patient is suffering severe ventilator-induced volutrauma because his tidal volume was incorrectly set to 700 mL based on his actual weight (115 kg) rather than his Predicted Body Weight (PBW). For a 178 cm male, PBW = 50 + 0.91 * (178 - 152.4) = ~73.3 kg. The ARDSNet lung-protective protocol mandates an initial tidal volume of 6 mL/kg PBW (~440 mL) to reduce the plateau pressure to <=30 cmH2O and prevent fatal barotrauma."
    }
  ]
};
