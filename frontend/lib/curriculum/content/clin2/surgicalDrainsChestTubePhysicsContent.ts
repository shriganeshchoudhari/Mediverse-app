/**
 * Clinical Postings II: Surgical Drain Management & Chest Tube Physics
 * Authoritative surgical drainage content derived from Sabiston, Schwartz, ATLS.
 * Mapped to NMC CBME Competencies: CP2.3, SU1.3, AN1.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SURGICAL_DRAINS_CHEST_TUBE_PHYSICS_MODULE: PhysiologyLessonModule = {
  id: "clin2-surgical-drains-chest-tube-physics",
  unitCode: "CP2.3",
  title: "Surgical Drains & Chest Tube Physics: Closed-Suction Drains (JP/Blake), Output Tracking & 3-Chamber Thoracostomy Systems",
  competencies: ["CP2.3", "SU1.3", "AN1.3"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Surgical Drains, Output Quality & 3-Chamber Chest Drainage Physics

Surgical drains prevent dead-space fluid accumulation, signal occult anastomotic dehiscence, and restore negative pleural pressure in thoracic trauma.

---

## 1. Closed-Suction vs Gravity Surgical Drains

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drain Type} & \\textbf{Mechanism / Suction} & \\textbf{Clinical Utility} & \\textbf{Drain Removal Criteria} \\\\
\\hline
\\textbf{Jackson-Pratt (JP) /} & \\mathbf{\\text{Closed active negative pressure}} & \\text{Mastectomy, thyroidectomy, axillary/groin} & \\mathbf{\\text{Output } < 30\\text{ mL / 24 hours}} \\\\
\\textbf{Blake Drain} & (\\text{compressed flexible bulb/grenade}) & \\text{dissections, intra-abdominal collections} & (\\text{serosanguinous without bile/chyle}) \\\\
\\textbf{Penrose Drain} & \\text{Open passive capillary action \u0026 gravity} & \\text{Superficial soft tissue abscess drainage} & \\text{Shortened progressively as tract closes} \\\\
\\textbf{T-Tube} & \\text{Gravity biliary stent / diversion} & \\text{Common bile duct exploration / choledochotomy} & \\text{Kept 2-3 weeks until cholangiogram verifies patency} \\\\
\\hline
\\end{array}$$

- **Pathological Drain Output Qualities**:
  - **Frank Blood ($> 100\\text{ mL/hr}$)**: Active surgical hemorrhage $\\rightarrow$ urgent operative re-exploration.
  - **Bilious Output (Bright Green/Golden)**: Biliary anastomotic leak or duodenal stump breakdown $\rightarrow$ check drain bilirubin level.
  - **Milky White Chylous Fluid**: Thoracic duct / lymphatic injury $\rightarrow$ send for triglycerides ($> 110\\text{ mg/dL}$ confirms chyloperitoneum/chylothorax).
  - **Turbid / Foul / Amylase-Rich Fluid**: Pancreatic anastomotic fistula or gastrointestinal enteric leak.

---

## 2. Chest Tube (Thoracostomy) 3-Chamber Drainage System

$$\\begin{array}{lcccc}
\\hline
\\textbf{Chamber Component} & \\textbf{Physical Mechanism} & \\textbf{Normal Physiological Behavior} & \\textbf{Pathological Diagnostic Signs} \\\\
\\hline
\\textbf{1. Collection Chamber} & \\text{Collects fluid output from pleural space} & \\text{Serosanguinous drainage after thoracotomy} & \\mathbf{\\text{Massive hemothorax: } > 1{,}500\\text{ mL initial or } > 200\\text{ mL/hr } \\times 3\\text{h}} \\\\
\\textbf{2. Water Seal Chamber} & \\mathbf{2\\text{ cm } H_2O\\text{ one-way valve}} & \\mathbf{\\text{Tidaling: fluid level rises during inspiration,}} & \\mathbf{\\text{Continuous bubbling: AIR LEAK (bronchopleural fistula}} \\\\
& \\text{(prevents air re-entry into chest)} & \\mathbf{\\text{falls during expiration in spontaneous breathing}} & \\mathbf{\\text{or parenchymal lung tear)}} \\\\
\\textbf{3. Suction Chamber} & \\text{Regulates negative suction pressure} & \\mathbf{\\text{Continuous gentle bubbling at prescribed depth}} & \\text{Vigorous boiling causes water evaporation} \\\\
& (\\text{typically } -20\\text{ cm } H_2O\\text{ water column}) & (\\text{independent of wall suction strength}) & \\text{and loss of negative pressure regulation} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male is recovering on POD 2 following video-assisted thoracoscopic surgery (VATS) right upper lobe wedge resection for a solitary pulmonary nodule. He has a 28-Fr chest tube connected to a 3-chamber water-seal drainage system set to -20 cm H2O suction. Inspection of the drainage system reveals 40 mL of serosanguinous output in the collection chamber over the past 24 hours. In the water seal chamber, the fluid column oscillates up and down with respiration (normal tidaling), but vigorous, continuous bubbling is observed in the water seal chamber during both inspiration and expiration, persisting even when the patient is resting quietly without coughing.",
      question: "What does this continuous bubbling in the water seal chamber indicate, and what is the underlying pathophysiology?",
      options: [
        "A significant parenchymal alveolar-pleural air leak or bronchopleural fistula; continuous bubbling in the water seal chamber confirms air is continuously escaping from the lung into the pleural space",
        "Normal operation of the suction regulator chamber",
        "A tension pneumothorax requiring immediate chest tube clamping",
        "Complete healing of the visceral pleura indicating the chest tube can be pulled immediately"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic chest tube physics and air leak evaluation: (1) Water Seal Chamber Function: The water seal acts as a 2 cm H2O one-way valve allowing air and fluid to exit the pleural space while preventing atmospheric air from re-entering; (2) Tidaling: The fluid column normally moves with respirations (rises during inspiration, falls during expiration in spontaneously breathing patients); (3) Air Leak Interpretation: Continuous bubbling throughout both inspiration and expiration indicates an active air leak (air passing from the respiratory tree into the pleural space via an alveolar-pleural tear, staple line disruption, or bronchopleural fistula); (4) Safety Rule: Never clamp a chest tube in the presence of an active air leak, as this converts a simple pneumothorax into a fatal Tension Pneumothorax."
    }
  ]
};
