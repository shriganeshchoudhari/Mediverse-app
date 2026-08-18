/**
 * Occupational Lung Diseases (Pneumoconioses) & Obstructive Sleep Apnea (OSA)
 * Authoritative medical content derived from Fishman, Murray & Nadel, AASM Sleep Guidelines, and USMLE Step 2/3 Pulmonology.
 * Mapped to NMC CBME Competencies: CT7.1, CT7.2, CT8.1, CT8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OCCUPATIONAL_LUNG_DISEASES_OSA_MODULE: PhysiologyLessonModule = {
  id: "resp-occupational-lung-diseases-osa",
  unitCode: "CT7.1",
  title: "Pulmonology: Occupational Pneumoconioses (Silicosis vs Asbestosis) & Obstructive Sleep Apnea (OSA)",
  competencies: ["CT7.1", "CT7.2", "CT8.1", "CT8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Pulmonology: Occupational Pneumoconioses (Silicosis vs Asbestosis) & Obstructive Sleep Apnea (OSA)

Occupational mineral dust inhalation induces chronic fibro-inflammatory parenchymal destruction, while sleep-disordered breathing produces systemic cardiovascular sequelae.

---

## 1. The Major Occupational Pneumoconioses

| Disease & Inhalant | High-Risk Occupational Exposures | Characteristic Radiographic Findings | Key Complications & Histopathological Hallmarks |
| :--- | :--- | :--- | :--- |
| **Silicosis**<br>*(Crystalline Silicon Dioxide / $\\text{SiO}_2$)* | Sandblasting, rock mining, quarrying, stone cutting, foundry, ceramics. | **Upper Lobe Predominance** with small round nodular opacities ($1-10\\text{ mm}$) and pathognomonic **"Eggshell Calcification"** of hilar and mediastinal lymph nodes. | • **$30\\times$ increased risk of active Tuberculosis (Silicotuberculosis)** due to silica-induced macrophage phagolysosome disruption.<br>• Concentric birefringent silica particles surrounded by dense whorled collagen fibers. |
| **Asbestosis**<br>*(Hydrated Magnesium Silicate Fibers)* | Shipbuilding, pipefitting, roofing, demolition, brake lining manufacture, insulation. | **Lower Lobe & Subpleural Predominance** with reticular interstitial markings, honeycombing, and bilateral calcified **Diaphragmatic & Parietal Pleural Plaques**. | • **Ferruginous Bodies** (golden-brown dumbbell-shaped asbestos fibers coated with hemosiderin and ferritin, positive with Prussian blue).<br>• **Bronchogenic Carcinoma** (most common malignancy; synergistic with smoking $\\implies 60\\times$ risk!).<br>• **Malignant Mesothelioma** (diffuse pleural encasement, calretinin positive, NOT associated with smoking). |
| **Coal Worker\'s Pneumoconiosis (CWP)**<br>*(Coal Dust / Carbon)* | Underground coal mining, anthracite coal cutting. | **Upper Lobe Predominance** with small round nodular coal macules progressing to **Progressive Massive Fibrosis (PMF)**. | • **Caplan Syndrome**: Combination of CWP (or silicosis/asbestosis) with necrobiotic rheumatoid nodules in patients with **Rheumatoid Arthritis**. |
| **Berylliosis**<br>*(Beryllium Metal)* | Aerospace industry, electronics, nuclear reactors, fluorescent lamps. | Diffuse reticulonodular infiltrates with hilar lymphadenopathy (mimics sarcoidosis). | • Non-caseating epithelioid granulomas; responsive to **Systemic Corticosteroids**; positive blood Beryllium Lymphocyte Proliferation Test (BeLPT). |
| **Byssinosis**<br>*(Cotton / Flax Dust)* | Textile mills, yarn spinning. | Normal early; diffuse opacities in chronic stages. | • **"Monday Morning Chest Tightness" / Monday Fever**: Symptoms peak on the first day back to work after a weekend off, improving through the week. |

---

## 2. Obstructive Sleep Apnea (OSA): Pathophysiology & Diagnosis

- **Pathogenesis**: Repetitive collapse and mechanical occlusion of the pharynx/upper airway during sleep due to loss of neuromuscular tone in pharyngeal dilator muscles (e.g. genioglossus) during REM/NREM sleep $\\rightarrow$ cessation of airflow despite ongoing thoracic respiratory effort $\\rightarrow$ severe intermittent hypoxia and hypercapnia $\\rightarrow$ sleep fragmentation and sympathetic surges.
- **Risk Factors**: Obesity (BMI $> 30\\text{ kg/m}^2$, neck circumference $> 43\\text{ cm} / 17\\text{ in}$ in males, $> 40\\text{ cm} / 16\\text{ in}$ in females), retrognathia/micrognathia, enlarged tonsils, male sex, hypothyroidism, alcohol consumption before sleep.
- **Clinical Presentation**: Loud habitual snoring, witnessed apneas/choking episodes, morning headaches, dry mouth, nocturia, severe daytime somnolence (**Epworth Sleepiness Scale [ESS] Score $> 10$**), secondary polycythemia, and **Resistant Systemic Hypertension**.
- **Diagnostic Gold Standard: Overnight Polysomnography (PSG)**:
  - **Apnea**: Complete cessation of airflow for $\\ge 10\\text{ seconds}$.
  - **Hypopnea**: $\\ge 30\\%\\text{ reduction}$ in airflow for $\\ge 10\\text{ seconds}$ associated with $\\ge 3\\%\\text{ oxygen desaturation}$ or EEG arousal.
  - **Apnea-Hypopnea Index (AHI)**:
    $$\\text{AHI} = \\frac{\\text{Total Number of (Apneas} + \\text{Hypopneas)}}{\\text{Total Sleep Time in Hours}}$$
    - **Normal**: $\\text{AHI} < 5\\text{ events/hour}$.
    - **Mild OSA**: $5 \\le \\text{AHI} < 15\\text{ events/hour}$.
    - **Moderate OSA**: $15 \\le \\text{AHI} < 30\\text{ events/hour}$.
    - **Severe OSA**: **$\\text{AHI} \\ge 30\\text{ events/hour}$**.

---

## 3. Evidence-Based Management of OSA

1. **Continuous Positive Airway Pressure (CPAP)**:
   - **First-line gold standard therapy** for moderate-to-severe OSA or symptomatic mild OSA.
   - Acts as a pneumatic mechanical splint preventing pharyngeal airway collapse, normalizing sleep architecture, eliminating daytime sleepiness, and reducing blood pressure.
2. **Behavioral & Lifestyle Modifications**:
   - Weight loss (bariatric surgery in severe obesity).
   - Positional therapy (avoidance of supine sleeping position).
   - Complete avoidance of alcohol, sedatives, and benzodiazepines before bedtime.
3. **Oral Appliances & Surgical Options**:
   - **Mandibular Advancement Devices (MAD)** for mild-to-moderate OSA or CPAP intolerance (advances mandible forward to enlarge retrolingual space).
   - Uvulopalatopharyngoplasty (UPPP) or Hypoglossal Nerve Stimulation.
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old male truck driver with a BMI of 38 kg/m2 and a neck circumference of 46 cm presents for a commercial driver medical evaluation. His wife reports that he snores violently every night, frequently pauses breathing for 20-30 seconds followed by loud gasps, and is increasingly irritable. The patient admits to severe daytime fatigue and falling asleep at red traffic lights. His Epworth Sleepiness Scale score is 16/24. Blood pressure is 158/98 mmHg despite dual antihypertensive therapy (Amlodipine and Lisinopril). In-laboratory overnight polysomnography demonstrates 248 obstructive apneas and hypopneas over 6.2 hours of total sleep time (AHI = 40 events/hour), with nocturnal oxygen saturation nadir of 76%.",
      question: "Which of the following is the diagnosis, and what is the first-line therapeutic intervention of choice?",
      options: [
        "Severe Obstructive Sleep Apnea (AHI >= 30 events/hour); Titrate nocturnal Continuous Positive Airway Pressure (CPAP)",
        "Moderate OSA; Prescribe oral Modafinil monotherapy for daytime alertness",
        "Central Sleep Apnea; Prescribe nocturnal Zolpidem",
        "Obesity-Hypoventilation Syndrome; Initiate long-term daytime Supplemental Oxygen alone"
      ],
      correctAnswerIndex: 0,
      explanation: "The patient has Severe Obstructive Sleep Apnea based on an Apnea-Hypopnea Index (AHI) of 40 events/hour (severe threshold is AHI >= 30 events/hour) along with characteristic risk factors (morbid obesity, large neck circumference), witnessed apneas, daytime somnolence, and resistant hypertension. The first-line therapy of choice is nocturnal Continuous Positive Airway Pressure (CPAP), which acts as a pneumatic splint to maintain upper airway patency throughout sleep, eliminating apneas and restoring daytime function."
    }
  ]
};
