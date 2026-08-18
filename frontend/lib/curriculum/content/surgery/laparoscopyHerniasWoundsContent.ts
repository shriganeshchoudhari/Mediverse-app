/**
 * Minimally Invasive Laparoscopy, Inguinal Hernias & Wound Healing Learning Content
 * Authoritative medical content derived from Bailey & Love, Sabiston, Schwartz, and USMLE Step 2 CK Surgery.
 * Mapped to NMC CBME Competencies: SU6.1, SU6.2, SU7.1, SU7.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LAPAROSCOPY_HERNIAS_WOUNDS_MODULE: PhysiologyLessonModule = {
  id: "surg-laparoscopy-hernias",
  unitCode: "SU6.1",
  title: "Minimally Invasive Surgery: Laparoscopy Mechanics, Inguinal Hernias (Hesselbach Triangle) & Wound Healing",
  competencies: ["SU6.1", "SU6.2", "SU7.1", "SU7.2"],
  estimatedMinutes: 135,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Minimally Invasive Surgery: Laparoscopy Mechanics, Inguinal Hernias (Hesselbach Triangle) & Wound Healing

Laparoscopic surgery combines video-endoscopic visualization with physiological pneumoperitoneum, while hernia surgery requires precise anatomical knowledge of the myopectineal orifice and abdominal wall layers.

---

## 1. Laparoscopic Surgery Principles & Pneumoperitoneum

1. **Abdominal Entry Techniques**:
   - **Veress Needle (Closed Entry)**: Spring-loaded needle inserted blindly at the infraumbilical midline (cicatrix). Confirmed via Palmer\'s test, saline drop test, and initial opening pressure $<10\\text{ mmHg}$.
   - **Hasson Cannula (Open Cutdown Entry)**: Direct visual cutdown into the peritoneal cavity under direct vision; **preferred technique in patients with prior midline laparotomy incisions** to avoid visceral adhesions laceration.
2. **Insufflation Gas & Pressure Targets**:
   - **Carbon Dioxide ($CO_2$)**: Gas of choice because it is non-flammable, highly soluble in blood (rapidly eliminated via lungs), and carries very low risk of gas embolism.
   - **Standard Working Pressure**: **$12\\text{ to } 15\\text{ mmHg}$**.
3. **Cardiopulmonary Consequences of $CO_2$ Pneumoperitoneum**:
   - $\\uparrow$ Intra-abdominal pressure $\\implies$ $\\uparrow$ Systemic Vascular Resistance (SVR), $\\downarrow$ Venous Return / Cardiac Output.
   - $\\uparrow$ Diaphragmatic elevation $\\implies$ $\\uparrow$ Peak airway inspiratory pressures, $\\downarrow$ Functional Residual Capacity.
   - Peritoneal absorption of $CO_2 \\implies$ **Hypercapnia and Respiratory Acidosis** (managed by anesthesiologist via increased minute ventilation).
   - **Venous Gas Embolism**: Rare catastrophe characterized by sudden drop in end-tidal $CO_2$, mill-wheel murmur, and hypotension $\\implies$ **Durant\'s Maneuver (Left Lateral Decubitus $+$ Trendelenburg position)** to trap gas in the apex of the Right Ventricle.

---

## 2. Inguinal & Femoral Hernia Anatomy

| Hernia Type | Protrusion Pathway & Anatomy | Relation to Inferior Epigastric Vessels | Classic Patient Profile & Strangulation Risk |
| :--- | :--- | :--- | :--- |
| **Indirect Inguinal Hernia** | Enters the **Deep Inguinal Ring** through a patent *processus vaginalis*, traverses the inguinal canal inside the spermatic cord (covered by internal spermatic fascia), and exits the superficial ring into scrotum. | **LATERAL to Inferior Epigastric Vessels** | **Most common hernia overall** in both males and females; common in infants and young adults. Controlled by Internal Ring Occlusion Test. |
| **Direct Inguinal Hernia** | Protrudes directly forward through an acquired defect in the **Transversalis Fascia** within **Hesselbach\'s Triangle**. Does NOT pass through deep ring. | **MEDIAL to Inferior Epigastric Vessels** | Common in elderly men (straining from BPH, chronic cough). Rarely incarcerates/strangulates due to wide neck. |
| **Femoral Hernia** | Passes through the **Femoral Ring** into the femoral canal (inferior to inguinal ligament), emerging medial to the **Femoral Vein**. | Medial to Femoral Vein; Inferior to Inguinal Ligament | **Highest Risk of Incarceration & Strangulation ($>40\\%$)** due to rigid unyielding boundaries (Lacunar ligament medially). More common in multiparous females. |

### Hesselbach\'s Triangle Boundaries:
- **Medial**: Lateral border of the **Rectus Abdominis** muscle.
- **Lateral / Superolateral**: **Inferior Epigastric Artery and Vein**.
- **Inferior**: **Inguinal Ligament (Poupart\'s Ligament)**.
- **Floor**: Transversalis fascia (site of direct hernia protrusion).

---

## 3. Surgical Wound Healing & Suture Principles

- **Phases of Wound Healing**:
  1. **Hemostasis** (Minutes): Platelet plug formation and fibrin mesh deposition.
  2. **Inflammation** (Days 1–4): Neutrophil infiltration followed by macrophage recruitment (essential orchestrator).
  3. **Proliferation / Granulation** (Days 4–21): Fibroblast proliferation, angiogenesis, and **Type III Collagen** synthesis.
  4. **Maturation / Remodeling** (Day 21 to 1 Year): **Type I Collagen replaces Type III Collagen** with extensive cross-linking; wound reaches maximum of $\\sim 80\\%$ of original unwounded tensile strength.
- **Suture Selection**:
  - **Absorbable Braided**: **Polyglactin 910 (Vicryl)** (retains strength for $3-4$ weeks; used for bowel anastomosis and subcutaneous tissues).
  - **Absorbable Monofilament**: **Polydioxanone (PDS)** (retains strength for $>6$ weeks; ideal for closing high-tension abdominal linea alba fascia).
  - **Non-Absorbable Monofilament**: **Polypropylene (Prolene)** (inert; used for vascular anastomoses and prosthetic mesh fixation in Lichtenstein repair).
`,
  clinicalVignettes: [
    {
      scenario: "A 45-year-old male presents with a reducible bulge in his right groin that becomes prominent when standing and coughing. On physical examination, the examiner reduces the hernia and applies firm fingertip pressure over the internal deep inguinal ring (located 1.5 cm above the midinguinal point). When the patient is instructed to cough while the deep ring remains occluded, the hernia bulge does NOT appear. However, when pressure is released, the bulge readily reappears upon coughing.",
      question: "Which of the following is the anatomical diagnosis, and what is the spatial relationship of this hernia defect to the inferior epigastric vessels?",
      options: [
        "Indirect Inguinal Hernia; defect is Lateral to the Inferior Epigastric vessels",
        "Direct Inguinal Hernia; defect is Medial to the Inferior Epigastric vessels",
        "Femoral Hernia; defect is Medial to the Femoral Vein",
        "Obturator Hernia; defect is in the Obturator Foramen"
      ],
      correctAnswerIndex: 0,
      explanation: "The Internal Ring Occlusion Test (Zieman's maneuver) differentiates an indirect from a direct hernia. Because occluding the deep internal inguinal ring prevents the hernia from protruding during a cough, the hernia must traverse the internal ring, confirming an Indirect Inguinal Hernia. Anatomically, the deep inguinal ring and indirect hernia neck lie LATERAL to the Inferior Epigastric vessels, whereas direct inguinal hernias protrude MEDIAL to the inferior epigastric vessels through Hesselbach's triangle."
    }
  ]
};
