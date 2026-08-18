/**
 * Endocrine Physiology Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.), Costanzo, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PY8.1, PY8.2, PY8.3, PY8.4, PY8.5, PY8.6
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const ENDOCRINE_MODULE: PhysiologyLessonModule = {
  id: "phys-endocrine",
  unitCode: "PY8.1",
  title: "Endocrine Feedback Loops, Thyroid Kinetics & Adrenal Physiology",
  competencies: ["PY8.1", "PY8.2", "PY8.3", "PY8.4"],
  estimatedMinutes: 115,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Endocrine Feedback Loops, Thyroid Kinetics & Adrenal Physiology

The endocrine system regulates growth, metabolic rate, reproductive cycling, and fluid-electrolyte balance through pulsatile peptide, steroid, and amine hormones operating within closed-loop negative feedback circuits.

---

## 1. Hypothalamic-Pituitary-End Organ Axes

> **Hypothalamic-Anterior Pituitary Axes**:
> 1. **TRH** $\rightarrow$ TSH (Thyrotropes) $\rightarrow$ Thyroid Gland $\rightarrow$ T4 & T3 (Inhibits TRH and TSH via negative feedback)
> 2. **CRH** $\rightarrow$ ACTH (Corticotropes) $\rightarrow$ Adrenal Cortex (Zona Fasciculata) $\rightarrow$ Cortisol (Inhibits CRH and ACTH)
> 3. **GnRH (Pulsatile)** $\rightarrow$ LH & FSH (Gonadotropes) $\rightarrow$ Testes / Ovaries $\rightarrow$ Testosterone & Estrogen/Progesterone
> 4. **GHRH (+)** / **Somatostatin (-)** $\rightarrow$ Growth Hormone (Somatotropes) $\rightarrow$ Liver $\rightarrow$ IGF-1 (Somatomedin C)
> 5. **Dopamine (PIF, Tonic Inhibition)** $\rightarrow$ Prolactin (Lactotropes) $\rightarrow$ Mammary Glands (Lactation)

- **Posterior Pituitary (Neurohypophysis)**:
  - Magnocellular neurons of the **Supraoptic** and **Paraventricular** nuclei in the hypothalamus synthesize **Oxytocin** and **Antidiuretic Hormone (ADH / Vasopressin)**, which are transported down unmyelinated axons bound to **neurophysins** and stored in terminal **Herring bodies**.

---

## 2. Thyroid Hormone Synthesis & Wolff-Chaikoff Effect

1. **Iodide Trapping**: Active basolateral **Sodium-Iodide Symporter (NIS)** ($2 Na^+ / 1 I^-$) transports iodide against a concentration gradient ($>30\\times$ plasma levels). Driven by $Na^+/K^+$ ATPase; stimulated by TSH; competitively inhibited by perchlorate ($ClO_4^-$) and pertechnetate ($TcO_4^-$).
2. **Thyroglobulin (Tg) Synthesis**: Secreted into follicular colloid.
3. **Oxidation, Organification & Coupling**: **Thyroid Peroxidase (TPO)** at the apical colloid border:
   - Oxidizes $I^-$ to active iodine ($I^0$ or $I_2$).
   - Organifies iodine onto tyrosine residues of thyroglobulin $\\implies$ **Monoiodotyrosine (MIT)** and **Diiodotyrosine (DIT)**.
   - Couples iodotyrosines: $\\text{DIT} + \\text{DIT} \\implies \\text{Thyroxine (T4, 90\\%)}$; $\\text{MIT} + \\text{DIT} \\implies \\text{Triiodothyronine (T3, 10\\%)}$.
   - TPO is inhibited by **Propylthiouracil (PTU)** and **Methimazole**. PTU also uniquely inhibits peripheral **5'-deiodinase** (conversion of T4 to active T3 in peripheral tissues).
4. **Wolff-Chaikoff Effect**: Administration of large doses of exogenous iodide transiently autoregulates and **inhibits TPO activity**, acutely shutting down thyroid hormone synthesis (used clinically to prepare thyrotoxic patients for thyroidectomy).

---

## 3. Adrenal Cortex Zonation & Steroidogenesis

| Adrenal Zone | Primary Regulatory Trigger | Primary Secreted Hormone | Primary Biological Action |
| :--- | :--- | :--- | :--- |
| **Zona Glomerulosa** (Outer 15%) | **Angiotensin II & Hyperkalemia ($K^+$)** (Independent of ACTH) | **Aldosterone** (Mineralocorticoid) | Acts on Cortical Collecting Tubule principal cells ($ENaC, Na^+/K^+$ ATPase) $\\implies \\uparrow Na^+$ reabsorption, $\\uparrow K^+$ excretion, $\\uparrow H^+$ excretion via $\\alpha$-intercalated cells |
| **Zona Fasciculata** (Middle 75%) | **ACTH & Circadian Cortisol Rhythm** | **Cortisol** (Glucocorticoid) | $\\uparrow$ Gluconeogenesis, $\\uparrow$ Lipolysis, $\\uparrow$ Protein catabolism, $\\downarrow$ Immune response (inhibits NF-$\\kappa$B, IL-2, PLA2), maintains vascular tone |
| **Zona Reticularis** (Inner 10%) | **ACTH** | **DHEA & Androstenedione** (Androgens) | Precursors for peripheral testosterone and estrogen synthesis |
| **Adrenal Medulla** (Chromaffin cells) | **Preganglionic Sympathetic ACh** | **Epinephrine (80%) & Norepinephrine (20%)** | Fight-or-flight response, glycogenolysis, bronchodilation, positive chronotropy/inotropy |

---

## 4. Calcium & Phosphate Homeostasis

1. **Parathyroid Hormone (PTH)**:
   - Secreted by chief cells in response to **hypocalcemia** (sensed by Calcium-Sensing Receptors / CaSR).
   - **Bone**: Stimulates osteoblasts to upregulate **RANKL**, which binds RANK on osteoclasts $\\implies \\uparrow$ bone resorption, releasing $Ca^{2+}$ and $PO_4^{3-}$.
   - **Kidney**: $\\uparrow Ca^{2+}$ reabsorption in distal convoluted tubule; $\\downarrow PO_4^{3-}$ reabsorption in proximal tubule (phosphate trashing); $\\uparrow 1\\alpha$-hydroxylase activity.
   - **Net Effect**: **$\\uparrow Serum Ca^{2+}$, $\\downarrow Serum PO_4^{3-}$, $\\uparrow Urinary cAMP$**.
2. **1,25-Dihydroxyvitamin D (Calcitriol)**:
   - Synthesized from $25\\text{-OH Vit D}$ in proximal tubule via $1\\alpha$-hydroxylase (stimulated by PTH, hypocalcemia, and hypophosphatemia).
   - Stimulates **apical TRPV6 and calbindin-D28k** in the duodenum/jejunum $\\implies \\uparrow$ intestinal absorption of both $Ca^{2+}$ and $PO_4^{3-}$.
   - **Net Effect**: **$\\uparrow Serum Ca^{2+}$, $\\uparrow Serum PO_4^{3-}$**.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old female presents with fatigue, cold intolerance, progressive weight gain, and constipation. Physical examination reveals delayed deep tendon reflex relaxation and a diffuse, non-tender goiter. Laboratory analysis demonstrates Serum TSH 24.5 uIU/mL (normal 0.4-4.0 uIU/mL), Free T4 0.4 ng/dL (normal 0.8-1.8 ng/dL), and markedly positive Anti-Thyroid Peroxidase (Anti-TPO) antibodies.",
      question: "Which of the following cellular processes is primarily disrupted in this patient's thyroid gland?",
      options: [
        "Enzymatic oxidation of iodide, organification onto thyroglobulin tyrosine residues, and MIT/DIT coupling",
        "Basolateral uptake of iodide via the Sodium-Iodide Symporter (NIS)",
        "Endosomal degradation of colloidal thyroglobulin inside lysosomes",
        "Peripheral 5'-monodeiodination of thyroxine into active triiodothyronine"
      ],
      correctAnswerIndex: 0,
      explanation: "Hashimoto's Thyroiditis is the most common cause of primary hypothyroidism in iodine-sufficient areas. Autoimmune destruction is characterized by anti-thyroid peroxidase (anti-TPO) and anti-thyroglobulin antibodies. Thyroid Peroxidase (TPO) catalyses oxidation of iodide, organification onto tyrosine residues, and coupling of iodotyrosines (MIT + DIT) to form T3 and T4."
    }
  ]
};
