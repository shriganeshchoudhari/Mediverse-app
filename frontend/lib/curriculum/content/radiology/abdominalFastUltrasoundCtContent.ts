/**
 * Emergency Trauma Ultrasound (E-FAST) & Abdominal CT Pathology Learning Content
 * Authoritative medical content derived from Brant & Helms, Grainger & Allison, ATLS 10th ed, and USMLE Step 2 CK Radiology.
 * Mapped to NMC CBME Competencies: RD5.1, RD5.2, RD6.1, RD6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ABDOMINAL_FAST_ULTRASOUND_CT_MODULE: PhysiologyLessonModule = {
  id: "rad-fast-ultrasound-abdomen-ct",
  unitCode: "RD5.1",
  title: "Radiology: Emergency Trauma Ultrasound (E-FAST) & Acute Abdominal CT Signs",
  competencies: ["RD5.1", "RD5.2", "RD6.1", "RD6.2"],
  estimatedMinutes: 140,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Radiology: Emergency Trauma Ultrasound (E-FAST) & Acute Abdominal CT Signs

Point-of-care ultrasound (POCUS) and multidetector CT are the backbone of modern trauma resuscitation and acute abdomen evaluation.

---

## 1. Focused Assessment with Sonography for Trauma (FAST)

The FAST examination is a rapid ($< 2-3\\text{ minutes}$) point-of-care bedside ultrasound protocol designed to detect **Free Intraperitoneal or Pericardial Fluid (Hemoperitoneum / Hemopericardium)** in hemodynamically unstable trauma patients.

| FAST Acoustic Window | Anatomical Location & Probe Placement | Clinical Target & High-Yield Finding |
| :--- | :--- | :--- |
| **1. Right Upper Quadrant (RUQ) / Hepatorenal Space** | **Morison\'s Pouch**: Between liver and right kidney (Mid-axillary line at 8th–11th intercostal space). | **Most dependent peritoneal space in supine patient**; earliest site of free blood accumulation (anechoic / black strip separating echogenic liver and renal parenchyma). |
| **2. Left Upper Quadrant (LUQ) / Splenorenal Recess** | Between spleen and left kidney; subdiaphragmatic space (Posterior axillary line at 6th–9th intercostal space). | Free anechoic fluid superior to spleen or between spleen and left kidney (splenic lacerations). |
| **3. Pelvic / Suprapubic Window** | Rectovesical pouch (males) / Rectouterine Pouch of Douglas (females) (Transverse and sagittal views superior to pubic symphysis). | Free fluid in the deepest pelvic peritoneal reflection behind the urinary bladder. |
| **4. Pericardial / Subxiphoid Window** | Subxiphoid 4-chamber cardiac view (Probe angled towards left shoulder under xiphoid process). | **Pericardial Tamponade**: Anechoic fluid stripe separating anterior pericardium from right ventricle; **diastolic collapse of Right Ventricle / Right Atrium**. |

---

## 2. Extended FAST (E-FAST): Thoracic Scanning

- E-FAST adds bilateral anterior and lateral thoracic interrogation using a high-frequency linear probe to evaluate for **Pneumothorax** and **Hemothorax**.
- **Normal Lung Ultrasound**:
  - **Lung Sliding Sign**: Shimmering, back-and-forth movement of the hyperechoic pleural line with respiration (parietal and visceral pleura gliding against each other).
  - **M-Mode "Seashore Sign"**: Granular, sandy appearance below the bright pleural line created by normal lung parenchyma movement.
  - **B-Lines / Comet Tails**: Vertical laser-like hyperechoic lines arising from the pleural line moving synchronously with sliding.
- **Pneumothorax Ultrasound Findings**:
  1. **Absence of Lung Sliding**: Static, immobile pleural line (air separates parietal from visceral pleura).
  2. **M-Mode "Stratosphere Sign" / "Barcode Sign"**: Purely parallel horizontal lines above and below the pleural line (loss of sandy lung movement).
  3. **The Lung Point Sign**: The exact physical boundary where pneumothorax transitions to normal lung sliding (**$100\\%$ specific for pneumothorax!**).

---

## 3. Classic Emergency Abdominal CT Pathological Signs

- **Pneumoperitoneum (Gastrointestinal Perforation)**:
  - Extraluminal free air localized beneath the anterior abdominal wall, around the falciform ligament, or forming **Rigler\'s Sign (visualization of both inner mucosal and outer serosal borders of the bowel wall)**.
- **Acute Appendicitis**:
  - Blind-ending, non-compressible tubular structure in the right lower quadrant with outer diameter **$> 6\\text{ mm}$**, circumferential wall thickening ($> 2\\text{ mm}$), hyper-attenuating **Appendicolith** ($30\\%$), and adjacent **Periappendiceal Fat Stranding**.
- **Acute Pancreatitis (Balthazar Staging)**:
  - Diffuse pancreatic enlargement, loss of distinct parenchymal borders, and peripancreatic fluid collections / necrosis.
- **Acute Mesenteric Ischemia**:
  - **Pneumatosis Intestinalis** (gas within the bowel wall), **Portovenous Gas** (branching gas in hepatic periphery), bowel wall thickening with lack of IV contrast mucosal enhancement ("paper-thin bowel").
`,
  clinicalVignettes: [
    {
      scenario: "A 35-year-old male is brought to the trauma resuscitation bay following a high-speed motor vehicle collision. He is hypotensive (BP 78/48 mmHg) and tachycardic (HR 134 bpm). The emergency physician immediately performs a FAST examination. In the right upper quadrant mid-axillary window, a distinct anechoic (black) fluid collection is visualized in the potential space between the posterior surface of the liver and the anterior cortex of the right kidney. The subxiphoid view shows no pericardial effusion.",
      question: "Which anatomical space contains the pathological fluid, and what is the next definitive management step?",
      options: [
        "Hepatorenal Space (Morison's Pouch); Immediate Emergency Exploratory Laparotomy",
        "Splenorenal Recess; Contrast-enhanced Abdominal CT scan",
        "Pouch of Douglas; Diagnostic Peritoneal Lavage (DPL)",
        "Pericardial Sac; Emergency Subxiphoid Pericardiocentesis"
      ],
      correctAnswerIndex: 0,
      explanation: "In a hemodynamically unstable blunt trauma patient (BP 78/48 mmHg), a positive FAST demonstrating free anechoic fluid in Morison's Pouch (the hepatorenal recess, the most dependent space in the supine abdomen) confirms massive hemoperitoneum. Hemodynamically unstable patients with intra-abdominal free fluid on FAST must NOT be sent to CT; they require immediate emergency Exploratory Laparotomy for surgical hemoperitoneum control."
    }
  ]
};
