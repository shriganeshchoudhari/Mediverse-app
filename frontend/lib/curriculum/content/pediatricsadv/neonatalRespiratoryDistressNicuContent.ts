/**
 * Pediatrics: Neonatal Respiratory Distress & Intensive Care Resuscitation
 * Authoritative medical content derived from Fanaroff and Martin's Neonatal-Perinatal Medicine (11th ed.), Nelson.
 * Mapped to NMC CBME Competencies: PE1.3, PE1.4, PA42.1, PA42.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEONATAL_RESPIRATORY_DISTRESS_NICU_MODULE: PhysiologyLessonModule = {
  id: "pediatrics-adv-neonatal-respiratory-distress-nicu",
  unitCode: "PE3.1",
  title: "Neonatal Respiratory Distress: Surfactant RDS, TTN, Meconium Aspiration & BPD",
  competencies: ["PE1.3", "PE1.4", "PA42.1", "PA42.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PULMONARY",
  markdownContent: `
# Neonatal Respiratory Distress & Neonatal Intensive Care

Respiratory failure in the newborn represents the most common reason for NICU admission, differentiated by gestational age, delivery mode, and classic radiographic patterns.

---

## 1. Differential Diagnosis of Neonatal Respiratory Distress

$$\\begin{array}{lcccc}
\\hline
\\textbf{Condition} & \\textbf{Etiology / Risk Factors} & \\textbf{Chest X-Ray Morphology} & \\textbf{Clinical Course \u0026 Hallmark} & \\textbf{Management} \\\\
\\hline
\\textbf{Respiratory Distress (RDS)} & \\mathbf{\\text{Surfactant Deficiency (Type II)}} & \\mathbf{\\text{Diffuse \"Ground-Glass\" opacities,}} & \\text{Preterm (}<34\\text{ wk); tachypnea, grunting,} & \\mathbf{\\text{Antenatal Betamethasone;}} \\\\
& \\text{Prematurity, Maternal Diabetes} & \\mathbf{\\text{air bronchograms, low lung volume}} & \\text{nasal flaring, subcostal retractions} & \\mathbf{\\text{Postnatal Surfactant + CPAP}} \\\\
\\textbf{Transient Tachypnea (TTN)} & \\mathbf{\\text{Delayed alveolar fluid clearance}} & \\mathbf{\\text{Perihilar streaking, fluid in fissures,}} & \\text{Term infant; Post-Elective C-Section} & \\text{Supportive oxygen;} \\\\
& \\text{(ENaC resorption lag)} & \\text{hyperinflation, prominent vasculature} & \\text{Self-resolves in 24 - 72 hours} & \\text{oral feeding as tolerated} \\\\
\\textbf{Meconium Aspiration (MAS)} & \\text{In utero fetal hypoxia, vagal gasping} & \\mathbf{\\text{Patchy, coarse asymmetric infiltrates,}} & \\text{Post-term (}>41\\text{ wk); barrel chest,} & \\text{Supportive care; } \\\\
& \\text{in post-term infants} & \\text{areas of atelectasis \u0026 hyperinflation} & \\mathbf{\\text{risk of PPHN}} & \\text{Inhaled Nitric Oxide (iNO)} \\\\
\\hline
\\end{array}$$

---

## 2. Surfactant Biophysics & Law of Laplace

$$P = \\frac{2T}{r}$$

- Where $P$ is collapsing inward pressure, $T$ is surface tension, and $r$ is alveolar radius.
- **Biophysical Action of Surfactant**: Dipalmitoylphosphatidylcholine (DPPC) lines the air-liquid interface, reducing alveolar surface tension ($T$) as alveolar radius ($r$) decreases during expiration. This prevents smaller alveoli from collapsing into larger alveoli.
- **Fetal Lung Maturity Testing**: **Lecithin-to-Sphingomyelin (L/S) ratio $>2.0$** indicates mature surfactant production.

---

## 3. Chronic Complications of Prematurity: BPD & ROP

1. **Bronchopulmonary Dysplasia (BPD / Chronic Lung Disease)**:
   - Arrest of alveolar development (fewer, enlarged alveoli) resulting from positive-pressure mechanical ventilation and oxygen toxicity in very low birth weight ($<1,500\\text{ g}$) infants.
   - Defined as persistent requirement for supplemental oxygen at **$36\\text{ weeks}$ postmenstrual age**.

2. **Retinopathy of Prematurity (ROP)**:
   - **Phase 1 (Hyperoxia)**: High arterial oxygen levels suppress retinal Vascular Endothelial Growth Factor (VEGF), arresting normal retinal vascular growth.
   - **Phase 2 (Hypoxia-Induced Neovascularization)**: As the growing retina becomes hypoxic, massive rebound VEGF secretion induces disorganized fibrovascular proliferation $\rightarrow$ retinal detachment and blindness.
`,
  clinicalVignettes: [
    {
      scenario: "A male infant is delivered at 29 weeks gestation via emergent Cesarean section due to placental abruption. The mother did not receive prenatal care. Within 20 minutes of birth, the neonate develops severe tachypnea (RR 84/min), prominent intercostal and subcostal retractions, nasal flaring, and audible expiratory grunting. Arterial blood gas shows: pH 7.21, PaCO2 58 mmHg, PaO2 44 mmHg on room air. Chest radiograph demonstrates poor lung expansion with diffuse, symmetrical reticulogranular 'ground-glass' opacities and prominent air bronchograms.",
      question: "Which of the following cellular deficiencies accounts for this clinical condition, and what is the definitive immediate therapy?",
      options: [
        "Deficiency of surfactant produced by Type II alveolar pneumocytes; Postnatal endotracheal administration of exogenous surfactant combined with continuous positive airway pressure (CPAP)",
        "Delayed resorption of alveolar fluid by Type I pneumocytes; High-dose intravenous Furosemide diuresis",
        "Aspiration of meconium-stained amniotic fluid; Emergent endotracheal suctioning and broad-spectrum antibiotics",
        "Congenital diaphragmatic hernia; Urgent surgical reduction of herniated viscera"
      ],
      correctAnswerIndex: 0,
      explanation: "This preterm infant (29 weeks gestation without antenatal corticosteroid coverage) demonstrates classic Neonatal Respiratory Distress Syndrome (RDS / Hyaline Membrane Disease) due to surfactant deficiency from immature Type II alveolar pneumocytes. Without surfactant (DPPC), alveolar surface tension is elevated, causing widespread microatelectasis and intrapulmonary shunting, manifested radiographically by diffuse reticulogranular 'ground-glass' opacities and air bronchograms. The treatment of choice is immediate endotracheal instillation of natural exogenous surfactant combined with non-invasive respiratory support (nasal CPAP)."
    }
  ]
};
