/**
 * Nuclear Medicine: PET-CT Oncology & Neurology: Warburg Glycolysis & Neurodegeneration
 * Authoritative medical content derived from Mettler & Guiberteau (7th ed.), Valk's Positron Emission Tomography.
 * Mapped to NMC CBME Competencies: NM5.1, NM5.2, NM6.1, NM6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PET_CT_ONCOLOGY_NEUROLOGY_METABOLISM_MODULE: PhysiologyLessonModule = {
  id: "nuclearmedicine-pet-ct-oncology-neurology-metabolism",
  unitCode: "NM5.1",
  title: "PET-CT Oncology & Neurology: 18F-FDG Warburg Glycolysis, SUV Quantitation & Dementia Metabolic Patterns",
  competencies: ["NM5.1", "NM5.2", "NM6.1", "NM6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RADIOLOGY",
  markdownContent: `
# PET-CT Oncology & Neurology: 18F-FDG Warburg Glycolysis, SUV Quantitation & Dementia Patterns

Positron Emission Tomography combined with Computed Tomography (PET-CT) fuses high-resolution anatomic localization with quantitative molecular metabolic imaging.

---

## 1. Molecular Mechanism of $^{18}\text{F}\text{-FDG}$ & The Warburg Effect

1. Tumor cells upregulate **GLUT-1 and GLUT-3** glucose transporters.
2. $^{18}\text{F-FDG}$ enters tumor cells via facilitated diffusion through GLUT transporters.
3. Intracellular **Hexokinase** phosphorylates $^{18}\text{F-FDG} \rightarrow {}^{18}\text{F-FDG-6-Phosphate}$.
4. Because of the missing 2-hydroxyl group ($-\text{OH}$), $^{18}\text{F-FDG-6-Phosphate}$ **CANNOT be isomerized** by phosphoglucose isomerase into fructose-6-phosphate.
5. Dephosphorylation by glucose-6-phosphatase is extremely low in malignant neoplastic cells.
6. **Result**: $^{18}\text{F-FDG-6-Phosphate}$ is **metabolically trapped inside malignant tumor cells**!

---

## 2. Standardized Uptake Value (SUV) & Patient Preparation

$$\text{SUV} = \frac{\text{Radioactivity Concentration in Target ROI (kBq/mL)}}{\text{Injected Radioactive Dose (kBq)} / \text{Patient Body Weight (g)}}$$

- **Factors Influencing SUV**:
  - **Blood Glucose**: Patient must fast for **$\ge 4 - 6\text{ hours}$**; blood glucose must be **$<150 - 200\text{ mg/dL}$** (elevated serum glucose competitively inhibits $^{18}\text{F-FDG}$ uptake via GLUT transporters).
  - **Insulin**: Do not administer rapid-acting insulin immediately prior to FDG injection (shifts tracer into skeletal muscle and adipose tissue, obscuring tumor visualization).
  - **Brown Adipose Tissue (BAT) Activation**: Cold exposure stimulates sympathetic beta-3 adrenergic receptors in supraclavicular and paraspinal brown fat. Prevented by keeping patient in a **warm room ($21 - 24^\circ\text{C}$)** and oral **Propranolol / Diazepam**.
- **Physiological High-Uptake Sites**: Brain cortex (obligate glucose consumer), Myocardium, Renal collecting system / Bladder (urinary excretion), Liver / Spleen / Bone marrow (mild baseline).

---

## 3. Brain $^{18}\text{F}\text{-FDG}$ PET: Neurodegenerative Dementia Patterns

$$\begin{array}{lcccc}
\hline
\textbf{Neurodegenerative Dementia} & \textbf{Primary Hypometabolic Regions on Brain FDG PET} & \textbf{Sparing / Preserved Regions} & \textbf{Pathognomonic Imaging Sign} \\
\hline
\textbf{Alzheimer Disease (AD)} & \mathbf{\text{Bilateral Temporoparietal Cortex \& Posterior Cingulate}} & \text{Sensory-motor cortex, Visual cortex, Basal ganglia} & \text{Early posterior cingulate hypometabolism} \\
\textbf{Frontotemporal Dementia (FTD)} & \mathbf{\text{Bilateral Frontal Lobes \& Anterior Temporal Lobes}} & \text{Parietal and occipital cortices preserved} & \text{Marked frontal / anterior temporal atrophy} \\
\textbf{Dementia with Lewy Bodies (DLB)} & \mathbf{\text{Bilateral Occipital Primary Visual Cortex \& Parietotemporal}} & \mathbf{\text{Posterior Cingulate Cortex preserved}} & \mathbf{\text{"Cingulate Island Sign"}} \\
\textbf{Huntington Disease} & \mathbf{\text{Severe Bilateral Caudate Nucleus \& Putamen (Striatum)}} & \text{Cortex relatively preserved in early stages} & \text{Boxcar ventricles / Striatal hypometabolism} \\
\hline
\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old female is evaluated for progressive memory impairment, spatial disorientation, and difficulty finding words over the past 2 years. Physical examination is non-focal. Brain 18F-FDG PET demonstrates symmetric, marked hypometabolism in the bilateral temporoparietal association cortices and the posterior cingulate cortex, with complete sparing of the primary sensorimotor cortex, visual cortex, and cerebellum.",
      question: "Which of the following is the most likely diagnosis based on this classic FDG-PET metabolic pattern?",
      options: [
        "Alzheimer Disease",
        "Frontotemporal Lobar Degeneration (Behavioral Variant)",
        "Dementia with Lewy Bodies",
        "Multi-Infarct Vascular Dementia"
      ],
      correctAnswerIndex: 0,
      explanation: "The symmetric bilateral temporoparietal and posterior cingulate cortex hypometabolism with relative preservation of the primary sensorimotor and visual cortices is the pathognomonic metabolic signature of Alzheimer Disease on 18F-FDG PET. In contrast, Frontotemporal Dementia involves frontal and anterior temporal lobes, and Dementia with Lewy Bodies involves the occipital visual cortex with the 'cingulate island sign'."
    }
  ]
};
