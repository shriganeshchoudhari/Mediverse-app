/**
 * Postgraduate Advanced General Surgery & Trauma: Complex Hepatic, Pancreaticoduodenal & Vascular Trauma
 * Authoritative surgical content derived from EAST Practice Management Guidelines, Fischer's Mastery of Surgery.
 * Mapped to NMC PG CBME Competencies: PG3.2, SG2.1, SG2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const COMPLEX_HEPATIC_PANCREATIC_VASCULAR_TRAUMA_MODULE: PhysiologyLessonModule = {
  id: "pg3-complex-hepatic-pancreatic-vascular-trauma",
  unitCode: "PG3.2",
  title: "Complex Hepatic, Pancreaticoduodenal & Vascular Trauma: Pringle Maneuver, Distal Pancreatectomy & Shunts",
  competencies: ["PG3.2", "SG2.1", "SG2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Complex Hepatic, Pancreaticoduodenal & Vascular Trauma

Operative maneuvers control massive hepatic hemorrhage, debride complex pancreatic ductal disruptions, and re-establish limb perfusion within the critical warm ischemia window.

---

## 1. Hepatic Trauma & The Pringle Maneuver

- **Anatomical Technique**:
  - Clamping the **hepatoduodenal ligament** across the **Foramen of Winslow** with an atraumatic vascular vascular clamp (compressing the **Portal Vein, Proper Hepatic Artery, and Common Bile Duct**).
- **Diagnostic Inflow vs Outflow Differentiation**:
  - If parenchymal bleeding ceases $\rightarrow$ Hemorrhage is from hepatic inflow vessels (**hepatic artery or portal vein branches**), amenable to direct vessel ligation, tractotomy, or deep hepatorrhaphy.
  - If bleeding continues vigorously $\rightarrow$ Hemorrhage is from outflow retrohepatic structures (**retrohepatic IVC or major hepatic veins**), requiring tight perihepatic packing, total hepatic vascular exclusion, or an atrio-caval shunt.
- **Safe Clamping Time Limit**:
  - Continuous normothermic clamping: **$15-20\\text{ minutes}$** (or intermittent clamping up to 60 minutes with 5-minute reperfusion intervals).

---

## 2. Pancreaticoduodenal Injury Grading & Surgical Strategy

$$\\begin{array}{lcccc}
\\hline
\\textbf{AAST Pancreas Grade} & \\textbf{Anatomical Pathology} & \\textbf{Operative Management Strategy} \\\\
\\hline
\\textbf{Grade I - II} & \\text{Minor contusion / laceration without duct injury} & \\text{Hemostasis, minimal debridement, and closed-suction drainage} \\\\
\\textbf{Grade III} & \\mathbf{\\text{Distal parenchymal transection WITH duct injury}} & \\mathbf{\\text{Distal pancreatectomy with or without splenic preservation}} \\\\
& \\mathbf{\\text{(to the left of the SMV / Portal Vein)}} & \\text{(stapled or sutured proximal duct stump)} \\\\
\\textbf{Grade IV - V} & \\mathbf{\\text{Proximal transection (right of SMV) / Ampullary}} & \\mathbf{\\text{Damage control: Duodenal diverticulization or staged Whipple}} \\\\
& \\mathbf{\\text{devitalization and duodenal wall disruption}} & \\mathbf{\\text{(Pancreaticoduodenectomy in hemodynamically stable patients)}} \\\\
\\hline
\\end{array}$$

---

## 3. Temporary Intraluminal Vascular Shunts

- **Critical Warm Ischemia Window**: **$< 6\\text{ hours}$** for striated skeletal muscle before irreversible neuromuscular infarction, rhabdomyolysis, and limb loss.
- **Surgical Technique**:
  - In transected major extremity arteries (common femoral, superficial femoral, popliteal), rapidly insert a temporary intraluminal shunt (Argyle, Javid, Pruitt-Inahara) secured with vessel loops, restoring immediate pulsatile distal flow before proceeding with orthopedic fracture stabilization or definitive saphenous vein bypass grafting.
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male is brought to the operating room after sustaining a high-velocity gunshot wound to the right upper quadrant. Exploratory laparotomy reveals a deep, bursting grade V laceration of the right hepatic lobe with torrential dark and bright red hemorrhage filling the peritoneal cavity. The trauma surgeon immediately passes an index finger through the Foramen of Winslow and applies an atraumatic vascular clamp across the hepatoduodenal ligament (Pringle maneuver). Active hemorrhage from the liver laceration drops by over 90%.",
      question: "What anatomical structures are compressed by the Pringle maneuver, and what does the cessation of bleeding confirm?",
      options: [
        "The Pringle maneuver compresses the Portal Vein, Proper Hepatic Artery, and Common Bile Duct within the hepatoduodenal ligament; the marked drop in hemorrhage confirms that the bleeding source is hepatic inflow (branches of the hepatic artery or portal vein) rather than retrohepatic IVC or major hepatic vein outflow tears, allowing the surgeon to proceed with hepatotomy/tractotomy and direct selective vessel suture ligation under 15-20 minutes of safe clamping",
        "The Pringle maneuver compresses the Inferior Vena Cava and Aorta; it confirms splenic rupture",
        "The Pringle maneuver compresses the Superior Mesenteric Artery and Celiac trunk",
        "The Pringle maneuver compresses the cystic duct only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates mastery of hepatic trauma anatomy: (1) Hepatoduodenal Ligament: Forms the anterior boundary of the Foramen of Winslow and transmits the portal vein (posterior), proper hepatic artery (anteromedial), and common bile duct (anterolateral); (2) Diagnostic Pringle: Clamping these inflow vessels stops arterial and portal bleeding. If hemorrhage had continued unabated, it would indicate an outflow retrohepatic IVC or hepatic vein tear; (3) Ischemia Threshold: Continuous normothermic Pringle clamping is safe for 15-20 minutes."
    }
  ]
};
