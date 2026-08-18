/**
 * Abdomen & Inguinal Canal Anatomy Learning Content
 * Authoritative medical content derived from Gray's Anatomy (42nd ed.), Netter, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: AN44.1, AN44.2, AN47.1, AN47.5, AN52.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ABDOMEN_INGUINAL_MODULE: PhysiologyLessonModule = {
  id: "anat-abdomen-inguinal",
  unitCode: "AN44.1",
  title: "Anterior Abdominal Wall, Inguinal Canal & Peritoneal Recesses",
  competencies: ["AN44.1", "AN47.1", "AN47.5", "AN52.1"],
  estimatedMinutes: 110,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Anterior Abdominal Wall, Inguinal Canal & Peritoneal Recesses

The anterior abdominal wall and inguinal region form a flexible, layered musculofascial container protecting the abdominal viscera and providing transit for the spermatic cord and testicular descent.

---

## 1. Inguinal Canal Architecture & Boundaries

The inguinal canal is an oblique ~4 cm passage directed inferiorly, medially, and anteriorly above the medial half of the inguinal ligament:

> **Inguinal Canal Wall Boundaries (Mnemonic: MALT)**:
> - **M**uscles (Roof): Arching fibers of **Internal Oblique** and **Transversus Abdominis** muscles.
> - **A**poneuroses (Anterior Wall): Aponeurosis of **External Oblique** (reinforced laterally by Internal Oblique).
> - **L**igaments (Floor): **Inguinal Ligament of Poupart** (gutter) and Lacunar ligament (Gimbernat) medially.
> - **T**endons (Posterior Wall): **Transversalis Fascia** laterally, and **Conjoint Tendon (Falx Inguinalis)** medially (union of internal oblique and transversus abdominis aponeuroses).

---

## 2. Inguinal Hernia Classification & Hesselbach's Triangle

| Feature | Indirect Inguinal Hernia | Direct Inguinal Hernia | Femoral Hernia |
| :--- | :--- | :--- | :--- |
| **Pathophysiology** | Patent **processus vaginalis** (congenital) | Acquired weakness in **transversalis fascia** of abdominal wall | Protrusion into **femoral ring/canal** |
| **Relation to Inferior Epigastric Vessels** | **LATERAL** to inferior epigastric vessels | **MEDIAL** to inferior epigastric vessels | **INFERIOR** to inguinal ligament |
| **Course & Ring Passage** | Enters **Deep Inguinal Ring**, travels down whole canal, exits Superficial Ring into **scrotum/labium** | Protrudes directly forward through **Hesselbach's Triangle**; rarely enters scrotum | Passes beneath inguinal ligament medial to femoral vein into upper thigh |
| **Coverings by Spermatic Fascial Layers** | Covered by **all three layers** (Internal spermatic, Cremasteric, External spermatic) | Covered only by **External spermatic fascia** | Covered by femoral sheath / cribriform fascia |
| **Demographics & Incarceration Risk** | Most common hernia in both males and females (5x more in males) | Elderly men; low strangulation risk | Females (due to wider pelvis); **Highest strangulation risk** |

> **Hesselbach's Triangle Boundaries**:
> - **Medial**: Lateral border of **Rectus Abdominis** muscle.
> - **Lateral**: **Inferior Epigastric Artery and Vein**.
> - **Inferior**: **Inguinal Ligament of Poupart**.

---

## 3. Gastrointestinal Blood Supply & Ischemic Watersheds

- **Celiac Trunk ($T12$)**: Foregut (distal esophagus to 2nd part of duodenum; liver, spleen, pancreas).
- **Superior Mesenteric Artery / SMA ($L1$)**: Midgut (distal 2nd part of duodenum to proximal 2/3 of transverse colon).
- **Inferior Mesenteric Artery / IMA ($L3$)**: Hindgut (distal 1/3 of transverse colon to upper rectum).
- **Critical Watershed Ischemic Zones**:
  1. **Griffiths Point (Splenic Flexure)**: Junction between SMA (middle colic) and IMA (left colic) arterial territories.
  2. **Sudeck Point (Rectosigmoid Junction)**: Junction between IMA (superior rectal) and Internal Iliac (middle rectal) territories.
`,
  clinicalVignettes: [
    {
      scenario: "A 67-year-old male with a history of chronic benign prostatic hyperplasia presents with a reducible bulge in his right groin that becomes prominent during coughing or straining. During surgical repair, the hernia sac is observed to bulge directly through the posterior wall of the inguinal canal, situated entirely medial to the inferior epigastric vessels.",
      question: "Which of the following is the definitive diagnosis and primary anatomical defect in this patient?",
      options: [
        "Direct Inguinal Hernia; Acquired weakness in the transversalis fascia within Hesselbach's triangle",
        "Indirect Inguinal Hernia; Failure of embryonic obliteration of the processus vaginalis",
        "Femoral Hernia; Dilatation of the femoral canal medial to the femoral vein",
        "Obturator Hernia; Protrusion through the obturator foramen alongside the obturator nerve"
      ],
      correctAnswerIndex: 0,
      explanation: "Direct inguinal hernias protrude forward through Hesselbach's triangle medial to the inferior epigastric vessels as a result of acquired weakness in the transversalis fascia, often exacerbated by chronic increased intra-abdominal pressure (e.g. straining against BPH or constipation)."
    }
  ]
};
