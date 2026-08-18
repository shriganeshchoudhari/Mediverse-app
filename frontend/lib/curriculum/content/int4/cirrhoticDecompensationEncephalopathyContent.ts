/**
 * Internship Core Clinical Postings: Cirrhotic Decompensation: Hepatic Encephalopathy & Variceal Bleeding
 * Authoritative hepatology content derived from AASLD Guidelines 2025, Harrison's Principles.
 * Mapped to NMC CBME Competencies: IN4.4, IM4.4, GE4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CIRRHOTIC_DECOMPENSATION_ENCEPHALOPATHY_MODULE: PhysiologyLessonModule = {
  id: "int4-cirrhotic-decompensation-encephalopathy",
  unitCode: "IN4.4",
  title: "Cirrhotic Decompensation: Hepatic Encephalopathy (Lactulose/Rifaximin), Variceal Bleeding Bundle & Hepatorenal Syndrome",
  competencies: ["IN4.4", "IM4.4", "GE4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Cirrhotic Decompensation: Hepatic Encephalopathy, Variceal Bleeding & Hepatorenal Syndrome

Aggressive medical management of ammonia kinetics, splanchnic vasoconstriction, and prompt endoscopic ligation prevent catastrophic liver failure decompensations.

---

## 1. Hepatic Encephalopathy (HE) & West Haven Grading

$$\\begin{array}{lcccc}
\\hline
\\textbf{West Haven Grade} & \\textbf{Clinical Neurological Manifestations} & \\textbf{First-Line Pharmacotherapy} & \\textbf{Secondary Prevention} \\\\
\\hline
\\textbf{Grade 1 (Trivial)} & \\text{Mild confusion, euphoria/anxiety, sleep inversion} & \\mathbf{\\text{Lactulose (20-30 g / 30-45 mL PO)}} & \\text{Identify and correct triggers} \\\\
\\textbf{Grade 2 (Lethargy)} & \\mathbf{\\text{Lethargy, disorientation, asterixis (flapping tremor)}} & \\mathbf{\\text{titrated to 2-3 soft bowel movements/day}} & (\\text{infection, GI bleed, hypokalemia}) \\\\
\\textbf{Grade 3 (Somnolence)} & \\text{Somnolent but rousable, marked confusion, incoherent} & \\text{Administer via NG tube or retention enema} & \\mathbf{\\text{Add Rifaximin } 550\\text{ mg PO BID}} \\\\
\\textbf{Grade 4 (Coma)} & \\text{Comatose, unresponsive to verbal stimuli} & \\text{if patient unable to swallow; protect airway} & \\text{for recurrent HE episodes} \\\\
\\hline
\\end{array}$$

- **Lactulose Mechanism**: Non-absorbable disaccharide fermented by colonic bacteria into lactic and acetic acid $\\rightarrow$ lowers colonic $\\text{pH} \\rightarrow$ converts diffusible ammonia ($NH_3$) into non-absorbable ammonium ($NH_4^+$) which is trapped and excreted in stool.

---

## 2. Acute Esophageal Variceal Bleeding Emergency Bundle

$$\\begin{array}{lcccc}
\\hline
\\textbf{Bundle Element} & \\textbf{Clinical Protocol \u0026 Dosing} & \\textbf{Physiological Mechanism} & \\textbf{Evidence-Based Benefit} \\\\
\\hline
\\textbf{1. Restrictive Transfusion} & \\mathbf{\\text{Target Hemoglobin } 7-8\\text{ g/dL}} & \\text{Prevents rebound portal venous} & \\mathbf{\\text{Reduces rebleeding and mortality}} \\\\
& (\\text{transfuse PRBC if } Hb < 7\\text{ g/dL}) & \\text{hypertension from over-transfusion} & (\\text{Villanueva NEJM landmark trial}) \\\\
\\textbf{2. Vasoactive Infusion} & \\mathbf{\\text{Octreotide: } 50\\text{ }\\mu\\text{g IV bolus } \\rightarrow} & \\text{Somatostatin analog; induces selective} & \\text{Lowers portal venous inflow and} \\\\
& \\mathbf{50\\text{ }\\mu\\text{g/hr continuous IV for 3-5 days}} & \\text{splanchnic arteriolar vasoconstriction} & \\text{variceal wall tension} \\\\
\\textbf{3. Antibiotic Prophylaxis} & \\mathbf{\\text{Ceftriaxone: } 1\\text{ g IV daily for 7 days}} & \\text{Prevents bacterial translocation, SBP,} & \\mathbf{\\text{Significantly reduces rebleeding}} \\\\
& & \\text{and bacteremia in decompensated cirrhosis} & \\mathbf{\\text{and all-cause mortality}} \\\\
\\textbf{4. Urgent Endoscopy} & \\mathbf{\\text{EGD within 12 hours with Endoscopic}} & \\text{Mechanical ligation of bleeding} & \\text{Definitive local hemostasis;} \\\\
& \\mathbf{\\text{Variceal Band Ligation (EVL)}} & \\text{esophageal varices} & \\text{TIPS if refractory} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 56-year-old male with decompensated hepatitis C cirrhosis presents to the emergency department with massive hematemesis (bright red blood) and melena. His blood pressure is 88/54 mmHg, heart rate is 118 bpm, and he exhibits jaundice, moderate ascites, and asterixis. His hemoglobin is 6.8 g/dL and platelet count is 65,000/uL. Two large-bore IVs are placed.",
      question: "What is the immediate pharmacological and resuscitation bundle that MUST be initiated prior to urgent endoscopy?",
      options: [
        "Initiate a restrictive transfusion strategy (target hemoglobin 7-8 g/dL) PLUS administer an Octreotide bolus (50 mcg IV followed by 50 mcg/hr continuous infusion) PLUS initiate prophylactic IV Ceftriaxone (1 g daily for 7 days) PLUS plan for urgent EGD with endoscopic variceal band ligation (EVL) within 12 hours",
        "Transfuse 6 units of PRBCs rapidly to achieve a hemoglobin of >12 g/dL without vasoactive medications",
        "Administer high-dose oral beta-blockers immediately during active massive hematemesis",
        "Perform emergent blind transjugular intrahepatic portosystemic shunt (TIPS) without prior endoscopy"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates the four pillars of the acute variceal bleeding resuscitation bundle: (1) Restrictive Transfusion: Target hemoglobin of 7-8 g/dL (transfusing when Hb <7) significantly reduces portal pressure rebound, rebleeding rates, and overall mortality; (2) Vasoactive Therapy: Octreotide (50 mcg bolus + 50 mcg/hr infusion) provides selective splanchnic vasoconstriction to decrease portal inflow; (3) Antibiotic Prophylaxis: Short-course IV Ceftriaxone (1 g daily for 7 days) prevents spontaneous bacterial peritonitis, reduces early rebleeding, and improves survival; (4) Urgent Endoscopy: EGD with Endoscopic Variceal Band Ligation (EVL) within 12 hours achieves definitive hemostasis."
    }
  ]
};
