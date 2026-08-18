/**
 * Clinical Oncology & Radiotherapy: Radiation Biology (The 4 Rs), Fractionation & Radiotherapy Delivery
 * Authoritative medical content derived from Hall & Giaccia's Radiobiology for the Radiologist (8th ed.), Perez & Brady's Radiation Oncology.
 * Mapped to NMC CBME Competencies: ON5.1, ON5.2, ON6.1, ON6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RADIATION_BIOLOGY_CLINICAL_RADIOTHERAPY_MODULE: PhysiologyLessonModule = {
  id: "oncology-radiation-biology-clinical-radiotherapy",
  unitCode: "ON5.1",
  title: "Radiation Biology: The 4 Rs, Linear-Quadratic Model, Fractionation & Precision Radiotherapy (IMRT/SBRT/Brachytherapy)",
  competencies: ["ON5.1", "ON5.2", "ON6.1", "ON6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CELLULAR",
  markdownContent: `
# Radiation Biology: The 4 Rs, Linear-Quadratic Model, Fractionation & Precision Radiotherapy

Radiation oncology exploits the differential biological response and repair kinetics between malignant tumors and surrounding normal tissues through precision fractionated dosing.

---

## 1. The Classical "4 Rs" of Radiobiology (Withers)

| The "R" of Radiobiology | Biological Cellular Mechanism | Therapeutic Impact on Fractionation & Dosing |
| :--- | :--- | :--- |
| **1. Repair (of Sublethal Damage)** | Cells repair sublethal double-strand DNA breaks ($DSBs$) between radiation fractions via Non-Homologous End Joining (NHEJ) and Homologous Recombination (HR). | **Normal healthy tissues have greater repair capacity than cancer cells**. Dividing total dose into daily fractions ($1.8 - 2.0\\text{ Gy/fraction}$) spares normal late-responding tissues. Fraction interval must be $\\ge 6\\text{ hours}$! |
| **2. Reassortment / Redistribution** | Cells in radioresistant cell cycle phases ($S\\text{-phase}$) progress and accumulate into **radiosensitive phases ($G_2\\text{ and } M\\text{ phase}$)**. | Fractionated delivery catches surviving tumor cells as they enter the highly radiosensitive $M\\text{-phase}$. |
| **3. Reoxygenation** | Hypoxic central tumor cells ($pO_2 < 5\\text{ mmHg}$) are $2.5 - 3.0\\times$ more radioresistant (**Oxygen Enhancement Ratio [OER] $\\sim 2.5 - 3.0$**). As outer aerobic cells die, the core revascularizes and reoxygenates. | Molecular oxygen acts as a **"chemical radiosensitizer"** by reacting with free-radical-damaged DNA to create permanent, irreparable peroxy radicals (**Oxygen Fixation Hypothesis**). Reoxygenation increases tumor kill during subsequent fractions. |
| **4. Repopulation** | Surviving tumor clonogens accelerate cellular division during a prolonged course of radiotherapy (**Accelerated Clonogen Repopulation**). | Begins approximately $3 - 4\\text{ weeks}$ into treatment ($T_{delay} \\sim 28\\text{ days}$). **Treatment breaks must be strictly avoided** to prevent repopulation from compromising local tumor control. |

---

## 2. Linear-Quadratic Model & The $\\alpha / \\beta$ Ratio

The cell survival fraction ($S$) following absorbed radiation dose ($D$) is modeled by:

$$S = e^{-(\\alpha D + \\beta D^2)}$$

- **$\\alpha$ Component (Linear)**: Represents lethal, single-hit, irreparable double-strand breaks ($DSBs$) proportional to dose $D$.
- **$\\beta$ Component (Quadratic)**: Represents sublethal, two-hit chromosome aberrations proportional to $D^2$.
- **The $\\alpha / \\beta$ Ratio**: The dose at which linear and quadratic cell kill are equal:
  - **Early-Responding Tissues & Most Tumors (High $\\alpha / \\beta \\sim 10\\text{ Gy}$)**: Linear-dominated cell survival curve with minimal fractionation sensitivity (e.g. squamous cell carcinomas, lymphomas, oral mucosa).
  - **Late-Responding Normal Tissues (Low $\\alpha / \\beta \\sim 2 - 3\\text{ Gy}$)**: Curved shoulder with high sensitivity to fraction size (e.g. spinal cord, brain, lung, kidney, prostate cancer). *Larger fraction sizes cause disproportionate late tissue fibrosis and necrosis!*

---

## 3. Precision Radiotherapy Delivery Modalities

1. **Intensity-Modulated Radiation Therapy (IMRT) & VMAT**:
   - Uses multileaf collimators (MLCs) that move dynamically during gantry rotation to sculpt high-dose radiation tightly around irregularly shaped target volumes while sparing adjacent critical organs at risk (OARs: e.g. spinal cord, parotid glands).
2. **Stereotactic Radiosurgery (SRS) & Stereotactic Body Radiotherapy (SBRT / SABR)**:
   - Delivers ultra-high, ablative doses of radiation in **$1 - 5\\text{ fractions}$** with sub-millimeter stereotactic precision (e.g. brain metastases, early-stage inoperable lung cancer, isolated liver oligometastases).
3. **Brachytherapy (Internal Radiation)**:
   - Places sealed radioactive isotopes directly inside or adjacent to the tumor:
     - **High-Dose-Rate (HDR)**: Iridium-192 ($^{192}Ir$) via remote afterloading catheters (Cervical cancer, Endometrial cancer, Prostate cancer).
     - **Low-Dose-Rate (LDR)**: Iodine-125 ($^{125}I$) permanent seed implants (Early prostate cancer).
`,
  clinicalVignettes: [
    {
      scenario: "A radiation oncologist is designing a definitive curative radiotherapy plan for a patient with locally advanced head and neck squamous cell carcinoma. The patient is scheduled to receive 70 Gy in 35 daily fractions of 2.0 Gy over 7 weeks. Two weeks into treatment, the patient develops severe grade 3 oral mucositis and asks to take a 2-week break from treatment.",
      question: "Why should unplanned treatment interruptions or treatment prolongation be strictly avoided in fractionated definitive radiotherapy?",
      options: [
        "Accelerated Clonogen Repopulation begins 3 to 4 weeks into therapy, leading to rapid tumor regrowth and dramatic loss of local tumor control",
        "Sublethal damage repair ceases after 2 weeks, making the normal mucosa permanently necrotic",
        "The Oxygen Enhancement Ratio drops to zero during treatment breaks",
        "The alpha/beta ratio shifts permanently from high to low"
      ],
      correctAnswerIndex: 0,
      explanation: "Accelerated Clonogen Repopulation (the 4th 'R' of radiobiology) is the biological phenomenon where surviving tumor stem cells accelerate their division rate during radiotherapy (typically starting around day 28 of treatment). Unplanned treatment breaks or extensions of overall treatment time allow these rapidly dividing clonogens to repopulate the tumor mass, leading to a measurable loss of local tumor control (approximately 1.0-1.5% loss of cure rate per day of delay)."
    }
  ]
};
