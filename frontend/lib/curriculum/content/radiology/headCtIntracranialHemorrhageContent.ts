/**
 * Non-Contrast Head CT (NCCT), Intracranial Hemorrhage & Acute Stroke Learning Content
 * Authoritative medical content derived from Brant & Helms, Grainger & Allison, and USMLE Step 2 CK Radiology.
 * Mapped to NMC CBME Competencies: RD3.1, RD3.2, RD4.1, RD4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEAD_CT_INTRACRANIAL_HEMORRHAGE_MODULE: PhysiologyLessonModule = {
  id: "rad-head-ct-hemorrhage",
  unitCode: "RD3.1",
  title: "Radiology: Non-Contrast Head CT (NCCT): EDH vs SDH vs SAH & Acute Ischemic Stroke",
  competencies: ["RD3.1", "RD3.2", "RD4.1", "RD4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# Radiology: Non-Contrast Head CT (NCCT): EDH vs SDH vs SAH & Acute Ischemic Stroke

Non-contrast computed tomography (NCCT) is the initial imaging modality of choice in acute head trauma and acute focal neurologic deficits.

---

## 1. Principles of Computed Tomography Density: The Hounsfield Scale

$$HU = 1000 \\times \\frac{\\mu_{\\text{tissue}} - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$

- **Air**: $-1000\\text{ HU}$ (Black)
- **Fat**: $-50\\text{ to } -100\\text{ HU}$ (Dark grey)
- **Water / CSF**: $0\\text{ to } +15\\text{ HU}$ (Charcoal grey)
- **Normal Brain White Matter**: $+25\\text{ to } +30\\text{ HU}$; **Grey Matter**: $+35\\text{ to } +40\\text{ HU}$
- **Acute Extravasated Blood (Hematoma)**: **$+50\\text{ to } +80\\text{ HU}$ (Hyperdense / Bright White)** due to globin protein concentration.
- **Cortical Bone / Calcium**: **$+1000\\text{ HU}$ (Radiodense / Pure White)**.

---

## 2. Intracranial Hemorrhage Matrix: EDH vs SDH vs SAH

| Hemorrhage Type | Vascular Source & Mechanism | NCCT Shape & Morphology | Suture & Dural Boundary Rules | Classic Clinical Presentation |
| :--- | :--- | :--- | :--- | :--- |
| **Epidural Hematoma (EDH)** | Laceration of the **Middle Meningeal Artery** (branch of maxillary artery) secondary to fracture of the **Pterion / Squamous Temporal Bone**. | **Biconvex / Lentiform / Lens-Shaped Hyperdense Mass** situated between the skull and outer periosteal dura. | **CANNOT CROSS CRANIAL SUTURES** *(dura is firmly fused to suture lines)*; can cross dural venous reflections (falx/tentorium). | **"Lucid Interval"**: Head trauma $\\rightarrow$ brief loss of consciousness $\\rightarrow$ temporary full recovery $\\rightarrow$ rapid deterioration with ipsilateral uncal herniation (**blown pupil from CN III compression**) and contralateral hemiparesis. |
| **Subdural Hematoma (SDH)** | Tearing of the **Bridging Cortical Veins** traversing the subdural space to the superior sagittal sinus. | **Crescentic / Sickle-Shaped Concave Hyperdense Mass** along the cerebral convexity. | **CROSSES CRANIAL SUTURE LINES** *(spreads freely over entire hemisphere)*; **LIMITED by dural reflections** (falx cerebri / tentorium). | Elderly patients, chronic alcoholics with cerebral atrophy (stretches bridging veins), shaken baby syndrome. Progressive headache, fluctuating confusion, focal deficits. |
| **Subarachnoid Hemorrhage (SAH)** | Rupture of **Saccular (Berry) Aneurysm** at Circle of Willis bifurcations ($85\\%$, e.g. Anterior Communicating Artery) or trauma. | **Hyperdensity within the Basal Cisterns, Sylvian Fissures, and Cortical Sulci** ("Star of Death" pattern in suprasellar cistern). | Follows the subarachnoid space freely along pia-arachnoid contours. | Sudden onset **"Worst Headache of My Life" (Thunderclap Headache)**, meningismus, photophobia. *If NCCT is negative after $> 6\\text{ hours}$, Lumbar Puncture is mandatory to detect Xanthochromia*. |
| **Intraparenchymal Hemorrhage (IPH)** | Rupture of **Charcot-Bouchard Microaneurysms** in lenticulostriate penetrating arteries due to chronic **Systemic Hypertension**. | Well-circumscribed hyperdense mass located classically in the **Basal Ganglia (Putamen $50\\%$, Thalamus $15\\%$, Pons, Cerebellum)** surrounded by hypodense vasogenic edema. | Confined within brain parenchyma; may rupture into ventricles (intraventricular hemorrhage). | Sudden focal neurological deficit with headache, vomiting, elevated BP, and progressive coma. |

---

## 3. Subdural Hematoma Density Evolution by Chronicity

- **Acute SDH ($< 3\\text{ days}$)**: **Hyperdense ($+50\\text{ to }+80\\text{ HU}$)** (bright white).
- **Subacute SDH ($3\\text{ to } 21\\text{ days}$)**: **Isodense ($+30\\text{ to }+40\\text{ HU}$)** (matches adjacent cerebral cortex; identified by medial displacement of grey-white junction and sulcal effacement).
- **Chronic SDH ($> 3\\text{ weeks}$)**: **Hypodense ($+10\\text{ to }+20\\text{ HU}$)** (dark grey/black, approaching CSF density).

---

## 4. Acute Ischemic Stroke (AIS) on Non-Contrast CT

- Initial NCCT in early ischemic stroke ($< 3-6\\text{ hours}$) is often normal, but its primary purpose is to **RULE OUT INTRACRANIAL HEMORRHAGE** prior to administering IV Thrombolytics (Alteplase/Tenecteplase).
- **Early Ischemic CT Signs ($< 6\\text{ hours}$)**:
  1. **Hyperdense MCA Sign**: High attenuation within the M1 segment of the middle cerebral artery, representing acute intraluminal thromboembolism.
  2. **Loss of the Insular Ribbon**: Hypodensity and edema blurring the grey-white interface of the insular cortex.
  3. **Loss of Lentiform Nucleus Definition**: Blurring of the putamen/globus pallidus margins.
  4. **Sulcal Effacement**: Cortical swelling effacing adjacent cerebral sulci.
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old male was struck on the right temple with a baseball bat during a game. He briefly lost consciousness for 1 minute, but quickly woke up, was fully oriented (GCS 15), and refused medical transport. Two hours later at home, he developed an excruciating headache, vomited twice, and became progressively unresponsive. In the emergency department, his GCS is 7 (E1V2M4), and his right pupil is 6 mm, fixed, and unreactive to light, while his left pupil is 3 mm and reactive. He has left-sided hemiplegia. An urgent non-contrast head CT is performed.",
      question: "Which intracranial hemorrhage morphology and vascular etiology are expected on the head CT?",
      options: [
        "Biconvex / lens-shaped hyperdense extra-axial mass that does not cross cranial sutures; Laceration of the Middle Meningeal Artery",
        "Crescent-shaped hyperdense extra-axial mass that crosses cranial sutures; Tearing of bridging cortical veins",
        "Hyperdensity in the suprasellar and ambient basal cisterns; Rupture of an anterior communicating artery aneurysm",
        "Hyperdensity centered in the putamen with surrounding edema; Rupture of Charcot-Bouchard microaneurysms"
      ],
      correctAnswerIndex: 0,
      explanation: "A traumatic blow to the pterion/temple followed by a classic 'lucid interval' (temporary regaining of consciousness followed by rapid coma) and signs of ipsilateral uncal herniation (blown right pupil from compression of the oculomotor nerve CN III against the tentorial notch) is pathognomonic for an Acute Epidural Hematoma (EDH). EDH is caused by laceration of the Middle Meningeal Artery and appears on non-contrast head CT as a biconvex (lenticular/lens-shaped) hyperdense mass that cannot cross cranial sutures because the periosteal dura is firmly anchored at suture lines."
    }
  ]
};
