/**
 * Clinical Postings II: Acute Wound Complications & Postoperative Emergencies
 * Authoritative surgical emergency content derived from Sabiston, Schwartz, ACS NSQIP.
 * Mapped to NMC CBME Competencies: CP2.4, SU1.4, AN1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const WOUND_DEHISCENCE_EVISCERATION_EMERGENCY_MODULE: PhysiologyLessonModule = {
  id: "clin2-wound-dehiscence-evisceration-emergency",
  unitCode: "CP2.4",
  title: "Acute Wound Complications: Seroma, Expanding Neck Hematoma, Salmon-Pink Fluid Fascial Dehiscence & Evisceration",
  competencies: ["CP2.4", "SU1.4", "AN1.4"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Acute Postoperative Wound Complications, Fascial Dehiscence & Surgical Emergencies

Early recognition of surgical wound breakdown and prompt intervention for expanding hematomas or visceral evisceration prevent fatal airway compromise and peritonitis.

---

## 1. Seroma vs Hematoma vs Fascial Dehiscence

$$\\begin{array}{lcccc}
\\hline
\\textbf{Wound Complication} & \\textbf{Postoperative Timing} & \\textbf{Clinical Hallmarks} & \\textbf{Immediate Management Protocol} \\\\
\\hline
\\textbf{Seroma} & \\text{POD 5-14} & \\text{Fluctuant, painless swelling filled with} & \\text{Sterile needle aspiration if symptomatic; compression} \\\\
& & \\text{clear straw-colored liquefied fat/lymph} & \\text{dressings; avoid repeated aspirations if sterile} \\\\
\\textbf{Expanding Neck} & \\mathbf{\\text{Hours 0-24 (Immediate)}} & \\mathbf{\\text{Rapidly enlarging neck swelling, stridor,}} & \\mathbf{\\text{EMERGENCY: Immediate bedside opening of wound;}} \\\\
\\textbf{Hematoma} & & \\mathbf{\\text{dyspnea post-thyroidectomy/CEA}} & \\mathbf{\\text{evacuate clot to relieve airway compression}} \\\\
\\textbf{Fascial} & \\mathbf{\\text{POD 5-8}} & \\mathbf{\\text{Sudden, profuse gush of SALMON-PINK}} & \\text{Inspect wound; palpate for fascial defect;} \\\\
\\textbf{Dehiscence} & & \\mathbf{\\text{serosanguinous fluid soaking dressings}} & \\text{abdominal binder, prepare for OR repair} \\\\
\\textbf{Visceral} & \\mathbf{\\text{POD 5-8}} & \\mathbf{\\text{Loops of small intestine protruding through}} & \\mathbf{\\text{Cover with STERILE SALINE-SOAKED GAUZE,}} \\\\
\\textbf{Evisceration} & & \\mathbf{\\text{the dehisced abdominal incision}} & \\mathbf{\\text{NPO, IV fluids, emergent exploratory laparotomy}} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Management Algorithm for Abdominal Evisceration

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step} & \\textbf{Emergency Action} & \\textbf{Underlying Physiological Objective} \\\\
\\hline
\\textbf{Step 1: Patient Positioning} & \\text{Place patient supine with knees flexed (low Fowler position)} & \\text{Reduces intra-abdominal wall tension on the dehisced wound} \\\\
\\textbf{Step 2: Visceral Protection} & \\mathbf{\\text{Cover protruding bowel with STERILE SALINE-SOAKED GAUZE}} & \\mathbf{\\text{Prevents bowel desiccation, ischemia, and secondary bacterial peritonitis;}} \\\\
& & \\mathbf{\\text{DO NOT attempt to push bowel loops back into abdominal cavity}} \\\\
\\textbf{Step 3: Resuscitation} & \\text{Strict NPO, start broad-spectrum IV antibiotics \u0026 isotonic crystalloid} & \\text{Treats hypovolemia from fluid sequestration; prepares for general anesthesia} \\\\
\\textbf{Step 4: Emergent Surgery} & \\mathbf{\\text{Urgent transfer to the Operating Room for exploratory laparotomy}} & \\mathbf{\\text{Wound irrigation, bowel viability inspection, and tension-free retention closure}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 66-year-old male with COPD and obesity (BMI 36 kg/m2) underwent an emergency exploratory laparotomy for a perforated diverticular abscess 6 days ago (POD 6). During a severe coughing paroxysm, he feels a sudden 'pop' in his abdomen followed by a large volume of salmon-colored serosanguinous fluid soaking through his surgical abdominal dressing. When the nurse removes the dressing, several loops of pink, glistening small intestine are observed resting on the anterior abdominal wall outside the abdominal incision.",
      question: "What is the diagnosis, and what is the immediate, life-saving bedside management protocol?",
      options: [
        "Abdominal Evisceration (complete fascial and skin dehiscence); immediately cover the exposed bowel with sterile saline-soaked moist laparotomy sponges/gauze, place the patient in a low Fowler position with knees flexed, maintain strict NPO, initiate IV fluids and broad-spectrum antibiotics, and transport immediately to the OR for emergent surgical closure",
        "Attempt to forcefully push the small bowel loops back into the abdominal cavity at the bedside and apply dry adhesive tape",
        "Pour povidone-iodine directly onto the bowel loops and wait for morning rounds",
        "Cover the bowel with dry gauze and discharge the patient home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case represents a surgical emergency—Abdominal Evisceration following fascial dehiscence: (1) Pathophysiology: A sudden burst in intra-abdominal pressure (e.g. coughing paroxysm) against weakened healing fascia on POD 5-8 causes full-thickness fascial breakdown and extrusion of intra-abdominal viscera; (2) Critical First Steps: Cover all exposed bowel immediately with sterile, warm saline-soaked gauze to prevent bowel drying, strangulation, and severe serosal damage; NEVER attempt to reduce the bowel at the bedside (risks perforation and introduction of skin bacteria); (3) Definitive Care: Emergent return to the operating room for copius saline irrigation, assessment of bowel viability, and re-closure of the abdominal wall with heavy monofilament sutures or retention bridges."
    }
  ]
};
