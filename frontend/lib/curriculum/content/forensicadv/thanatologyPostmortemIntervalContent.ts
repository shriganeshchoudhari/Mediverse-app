/**
 * Clinical Forensic Pathology: Thanatology & Postmortem Interval (PMI) Estimation
 * Authoritative medical content derived from Reddy's Essentials of Forensic Medicine (35th ed.), Knight's Forensic Pathology.
 * Mapped to NMC CBME Competencies: FM1.1, FM1.2, MD40.1, SU38.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const THANATOLOGY_POSTMORTEM_INTERVAL_MODULE: PhysiologyLessonModule = {
  id: "forensic-adv-thanatology-pmi",
  unitCode: "FM1.1",
  title: "Thanatology & Postmortem Interval (PMI): Algor, Rigor, Livor Mortis & Putrefactive Cascades",
  competencies: ["FM1.1", "FM1.2", "MD40.1", "SU38.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Thanatology & Postmortem Interval (PMI) Estimation

Thanatology is the scientific study of death and the postmortem modifications of the body, providing crucial medicolegal evidence to determine the time since death (Postmortem Interval, PMI).

---

## 1. Early Postmortem Changes Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Postmortem Sign} & \\textbf{Biophysical Mechanism} & \\textbf{Onset Time} & \\textbf{Full Expression} & \\textbf{High-Yield Forensic Pearl} \\\\
\\hline
\\textbf{Algor Mortis} & \\text{Newtonian radiative / conductive} & \\text{Immediate} & \\text{Reaches ambient} & \\mathbf{\\text{Cooling rate } \\approx 1.5^\\circ\\text{F / hour}} \\\\
\\text{(Body Cooling)} & \\text{body heat loss to environment} & & \\text{in 18-24 hours} & \\mathbf{\\text{Henssge Nomogram correction factors}} \\\\
\\textbf{Rigor Mortis} & \\mathbf{\\text{ATP depletion halts actin-myosin}} & \\mathbf{1-2\\text{ hours (heart)}} & \\mathbf{12\\text{ hours (full)}} & \\mathbf{\\text{Nysten's Law (jaw } \\rightarrow \\text{ legs)}} \\\\
\\text{(Postmortem Rigidity)} & \\text{uncoupling (permanent cross-links)} & \\mathbf{2-4\\text{ hours (jaw)}} & \\text{Maintained 12-24h} & \\text{Disappears 36-48h by autolysis} \\\\
\\textbf{Livor Mortis} & \\mathbf{\\text{Gravitational pooling of blood}} & \\mathbf{30-60\\text{ min (patches)}} & \\mathbf{8-12\\text{ hours (fixed)}} & \\mathbf{\\text{Cherry-Red in CO and Cyanide}} \\\\
\\text{(Lividity / Hypostasis)} & \\text{in dependent uncompressed capillaries} & \\text{Coalesces in 2-4h} & (\\text{no longer blanches}) & \\mathbf{\\text{Chocolate-Brown in Met-Hb}} \\\\
\\hline
\\end{array}$$

- **Cadaveric Spasm vs Rigor Mortis**:
  - **Cadaveric Spasm (Instantaneous Rigidity)**: Immediate contraction of a group of voluntary muscles at the exact moment of death (no primary flaccidity phase); typically seen in extreme emotional or violent deaths (e.g., weapon clutched tightly in suicide, weeds/grass clutched in drowning; proof of ante-mortem action).

---

## 2. Late Postmortem Changes & Decomposition

$$\\begin{array}{lccc}
\\hline
\\textbf{Decomposition Stage} & \\textbf{Time Since Death} & \\textbf{Pathological Features} & \\textbf{Environmental Factors} \\\\
\\hline
\\textbf{Greenish Discoloration} & \\mathbf{24-36\\text{ hours}} & \\mathbf{\\text{Right iliac fossa (cecal bacteria)}} & \\text{Hydrogen sulfide + Hb } \\rightarrow \\text{ Sulfhemoglobin} \\\\
\\textbf{Marbling} & \\mathbf{36-48\\text{ hours}} & \\text{Arborescent purple-green intravascular pattern} & \\text{Hemolysis in superficial subcutaneous veins} \\\\
\\textbf{Bloat \u0026 Purging} & 48-72\\text{ hours} & \\text{Gas distension (scrotum, face), tongue protrusion} & \\text{Bacterial putrefaction gas (methane, } H_2S\\text{)} \\\\
\\textbf{Adipocere Formation} & \\text{Weeks to Months} & \\mathbf{\\text{Waxy, firm, foul-smelling soap-like fat}} & \\mathbf{\\text{Warm, MOIST, anaerobic environments}} \\\\
\\textbf{Mummification} & \\text{Weeks to Months} & \\mathbf{\\text{Brown, leathery, shriveled, desiccated skin}} & \\mathbf{\\text{HOT, DRY, ventilated environments}} \\\\
\\hline
\\end{array}$$

- **Casper's Dictum for Rate of Putrefaction**:
  - Rate of decomposition follows the ratio:
  $$\\mathbf{1\\text{ week in Air} = 2\\text{ weeks in Water} = 8\\text{ weeks in Soil}}$$
`,
  clinicalVignettes: [
    {
      scenario: "During a medicolegal death investigation, an unidentified male body is found in a closed apartment during winter. Autopsy examination reveals bright cherry-red postmortem lividity distributed over the dependent, uncompressed posterior surfaces of the torso and thighs that does not blanch with firm thumb pressure. Rectal temperature is 24.5°C (ambient room temperature 18.0°C). Rigor mortis is completely absent throughout all major muscle groups and joints. The anterior abdominal wall over the right iliac fossa demonstrates a prominent greenish discoloration, and a branching arborescent greenish-purple vascular pattern (marbling) is visible across the shoulders and upper chest.",
      question: "Based on these thanatological findings, what is the estimated postmortem interval (PMI) and the most likely underlying cause of death / toxicology signature?",
      options: [
        "Postmortem Interval 36-48 hours; Acute Carbon Monoxide (CO) poisoning or Cyanide toxicity causing carboxyhemoglobinemia / cellular histotoxic hypoxia (cherry-red lividity)",
        "Postmortem Interval <2 hours; Acute myocardial infarction with primary flaccidity",
        "Postmortem Interval 6-8 hours; Hypothermia with cold stiffening",
        "Postmortem Interval >2 weeks; Advanced skeletal decomposition"
      ],
      correctAnswerIndex: 0,
      explanation: "This case presents pathognomonic thanatological markers: (1) Bright cherry-red postmortem hypostasis/lividity indicates either acute Carbon Monoxide poisoning (carboxyhemoglobin, COHb) or acute Cyanide poisoning (inability of tissues to extract oxygen due to cytochrome c oxidase blockade); (2) Fully fixed lividity (no blanching) indicates PMI >8-12 hours; (3) Complete disappearance of rigor mortis throughout the body occurs as autolysis breaks down muscle fibers, typically at 36-48 hours; (4) Greenish discoloration of the right iliac fossa (24-36h) and superficial venous marbling (36-48h) confirms a Postmortem Interval of approximately 36 to 48 hours."
    }
  ]
};
