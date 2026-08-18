/**
 * Clinical Surgery Advanced: GI Hemorrhage, Forrest Classification & Peptic Perforation
 * Authoritative surgical content derived from ASGE Guidelines, Schwartz (11th ed.), Sabiston.
 * Mapped to NMC CBME Competencies: SU5.1, SU5.2, MD43.3, SU41.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GI_HEMORRHAGE_ULCER_PERFORATION_MODULE: PhysiologyLessonModule = {
  id: "surgery-adv-gi-hemorrhage-perforation",
  unitCode: "SU5.1",
  title: "Upper GI Bleeding (Forrest Classification) & Peptic Ulcer Perforation (Graham Patch)",
  competencies: ["SU5.1", "SU5.2", "MD43.3", "SU41.3"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Gastrointestinal Hemorrhage & Acute Peptic Ulcer Perforation

Acute upper gastrointestinal hemorrhage is risk-stratified by the endoscopic Forrest classification, while free peptic perforation mandates emergent surgical source control.

---

## 1. Forrest Classification of Peptic Ulcer Bleeding

$$\\begin{array}{lcccc}
\\hline
\\textbf{Forrest Class} & \\textbf{Endoscopic Appearance} & \\textbf{Risk of Rebleeding} & \\textbf{Endoscopic Hemostatic Therapy} & \\textbf{Pharmacotherapy Protocol} \\\\
\\hline
\\textbf{Class Ia} & \\mathbf{\\text{Active Arterial Spurting}} & \\mathbf{> 90\\%} & \\mathbf{\\text{Mandatory Dual Endoscopic Therapy:}} & \\mathbf{\\text{High-dose IV PPI:}} \\\\
& & & \\mathbf{\\text{Epinephrine injection } (1:10{,}000) +} & 80\\text{ mg IV bolus} \\\\
\\textbf{Class Ib} & \\mathbf{\\text{Active Oozing Hemorrhage}} & \\mathbf{\\approx 50\\%} & \\mathbf{\\text{Thermal Coagulation or Hemoclips}} & + 8\\text{ mg/h continuous infusion } (72\\text{h}) \\\\
\\textbf{Class IIa} & \\mathbf{\\text{Non-Bleeding Visible Vessel}} & \\mathbf{\\approx 40 - 50\\%} & \\mathbf{\\text{Dual Therapy (Thermal / Clip / Epinephrine)}} & \\text{High-dose IV PPI infusion } (72\\text{h}) \\\\
\\textbf{Class IIb} & \\text{Adherent Clot over Ulcer} & \\approx 20 - 30\\% & \\text{Targeted clot irrigation/removal + therapy} & \\text{High-dose IV PPI infusion} \\\\
\\textbf{Class IIc} & \\text{Flat Pigmented Spot (Hematin)} & < 10\\% & \\text{No endoscopic hemostasis required} & \\text{Oral PPI once or twice daily} \\\\
\\textbf{Class III} & \\text{Clean-Based Ulcer} & < 5\\% & \\text{No endoscopic hemostasis required} & \\text{Oral PPI; early hospital discharge} \\\\
\\hline
\\end{array}$$

---

## 2. Peptic Ulcer Perforation & Graham Patch Omentopexy

- **Pathophysiology**: Acid-peptic erosion through the full thickness of the anterior duodenal bulb ($>80\%$) or prepyloric gastric wall into the peritoneal cavity $\rightarrow$ acute chemical peritonitis progressing to bacterial peritonitis.
- **Clinical Presentation**: Sudden onset catastrophic knife-like epigastric pain $\rightarrow$ board-like abdominal rigidity with absence of liver dullness; upright CXR reveals **subdiaphragmatic crescentic free air (pneumoperitoneum)**.
- **Surgical Gold Standard**:
  - **Cellan-Jones / Graham Patch Omentopexy**: A vascularized pedicle of greater omentum is placed over the perforation and secured with 3 to 4 full-thickness absorbable/silk sutures placed through healthy duodenal margins on either side of the defect.
  - Mandatory intra-abdominal washout with warm saline and placement of subhepatic suction drain.
`,
  clinicalVignettes: [
    {
      scenario: "A 55-year-old male with chronic osteoarthritis taking high-dose Ibuprofen daily presents to the emergency department with sudden-onset, agonizing epigastric pain that began abruptly 2 hours ago. On physical examination, he is diaphoretic, lying completely still with shallow respirations. Blood pressure is 100/60 mmHg, heart rate is 112 bpm, and temperature is 37.8°C. Abdominal exam reveals diffuse 'board-like' muscular rigidity, extreme rebound tenderness throughout, and loss of liver dullness to percussion. An upright chest radiograph demonstrates bilateral crescentic lucencies beneath the hemidiaphragms.",
      question: "Which of the following is the definitive surgical procedure of choice following rapid intravenous fluid resuscitation, broad-spectrum antibiotics, and nasogastric decompression?",
      options: [
        "Emergency exploratory laparotomy with Graham patch omentopexy repair of the perforated ulcer and copious peritoneal lavage",
        "Urgent upper endoscopy for endoscopic clip placement",
        "Non-operative management with high-dose intravenous PPI infusion alone",
        "Total gastrectomy with Roux-en-Y esophagojejunostomy"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient has an acute free Peptic Ulcer Perforation (most commonly anterior duodenal bulb due to NSAID-induced mucosal barrier disruption), confirmed by the classic clinical presentation of sudden severe epigastric pain, diffuse 'board-like' abdominal rigidity (chemical peritonitis), loss of liver dullness, and free subdiaphragmatic gas (pneumoperitoneum) on upright CXR. Following IV fluid resuscitation, IV broad-spectrum antibiotics, and NG decompression, the gold-standard surgical management is emergency exploratory laparotomy (or laparoscopy) with a Graham patch (omental patch) closure over the perforation site combined with extensive warm saline peritoneal lavage to eliminate peritoneal contamination."
    }
  ]
};
