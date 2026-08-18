/**
 * Postgraduate Advanced General Surgery & Trauma: Viscoelastometry & Massive Transfusion Protocols
 * Authoritative trauma resuscitation content derived from CRASH-2 Trial, Holcomb PROPPR Trial, Cotton TEG MTP Protocols.
 * Mapped to NMC PG CBME Competencies: PG3.4, TR2.1, TR2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VISCOELASTOMETRY_TEG_ROTEM_MASSIVE_TRANSFUSION_MODULE: PhysiologyLessonModule = {
  id: "pg3-viscoelastometry-teg-rotem-massive-transfusion",
  unitCode: "PG3.4",
  title: "Viscoelastometry in Trauma: TEG / ROTEM Parameters, Goal-Directed Transfusion & CRASH-2 TXA Protocols",
  competencies: ["PG3.4", "TR2.1", "TR2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "HEMATOLOGIC",
  markdownContent: `
# Viscoelastometry & Goal-Directed Massive Transfusion

Viscoelastic testing (TEG / ROTEM) quantifies whole blood clot initiation, propagation, maximum firmness, and fibrinolytic breakdown in real-time.

---

## 1. TEG vs ROTEM Parameters & Targeted Blood Components

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clot Phase} & \\textbf{TEG Parameter} & \\textbf{ROTEM Parameter} & \\textbf{Coagulation Defect} & \\textbf{Targeted Blood Product} \\\\
\\hline
\\textbf{Clot Initiation} & \\mathbf{R\\text{-time (Reaction Time)}} & \\mathbf{CT\\text{ (Clotting Time)}} & \\text{Deficiency of clotting factors} & \\mathbf{\\text{Fresh Frozen Plasma (FFP, 10-15 mL/kg)}} \\\\
& (> 10\\text{ min}) & (> 240\\text{ s}) & \\text{(thrombin generation failure)} & \\mathbf{\\text{or 4-Factor PCC (25-50 IU/kg)}} \\\\
\\textbf{Clot Kinetics} & \\mathbf{\\alpha\\text{-angle } (< 53^{\\circ})} & \\mathbf{\\text{CFT (Clot Formation Time)}} & \\mathbf{\\text{Severe hypofibrinogenemia}} & \\mathbf{\\text{Cryoprecipitate (1-2 pools / 10-20 units)}} \\\\
& K\\text{-time } (> 3\\text{ min}) & (> 150\\text{ s}) & (< 1.5-2.0\\text{ g/L}) & \\mathbf{\\text{or Fibrinogen Concentrate (2-4 g)}} \\\\
\\textbf{Clot Strength} & \\mathbf{MA\\text{ (Maximum Amplitude)}} & \\mathbf{MCF\\text{ (Max Clot Firmness)}} & \\mathbf{\\text{Platelet dysfunction / deficiency}} & \\mathbf{\\text{Platelets (1 apheresis unit or 6 pooled)}} \\\\
& (< 50\\text{ mm}) & (< 45\\text{ mm}) & (80\\% \\text{ platelet contribution}) & \\text{or Desmopressin (DDAVP } 0.3\\;\\mu\\text{g/kg)} \\\\
\\textbf{Fibrinolysis} & \\mathbf{LY30\\text{ (Lysis at 30 min)}} & \\mathbf{ML\\text{ (Maximum Lysis)}} & \\mathbf{\\text{Hyperfibrinolysis (tPA surge)}} & \\mathbf{\\text{Tranexamic Acid (TXA: 1 g IV bolus)}} \\\\
& (\\mathbf{> 3\\%}) & (\\mathbf{> 15\\%}) & & \\mathbf{+\\text{ 1 g infusion over 8h (CRASH-2)}} \\\\
\\hline
\\end{array}$$

---

## 2. The CRASH-2 Tranexamic Acid (TXA) Protocol

- **Timing Rule**: Must be administered **within $< 3\\text{ hours}$ of trauma injury**.
  - Administered $>3\\text{ hours}$ post-injury, TXA paradoxically increases all-cause mortality and thrombotic events.
- **Dosing Regimen**:
  - Loading dose: **$1\\text{ g}$ IV over 10 minutes**, followed by maintenance infusion of **$1\\text{ g}$ IV over 8 hours**.

---

## 3. Balanced 1:1:1 Resuscitation (PROPPR Trial)

- **Ratio**: Transfusion of **1 Unit Packed Red Blood Cells : 1 Unit Fresh Frozen Plasma : 1 Unit Platelets** halts the dilution of clotting factors and prevents trauma-induced coagulopathy compared to unguided crystalloid or PRBC-heavy infusions.
`,
  clinicalVignettes: [
    {
      scenario: "A 31-year-old male is actively bleeding in the trauma resuscitation room after suffering an abdominal blast injury (received 4 units of uncrossed PRBCs). Emergency rapid thromboelastography (TEG) is performed and returns within 12 minutes: R-time = 14.5 min (normal 5-10 min), alpha-angle = 41 degrees (normal 53-72 degrees), Maximum Amplitude (MA) = 38 mm (normal 50-70 mm), and LY30 = 8.4% (normal 0-3%). Injury occurred 75 minutes ago.",
      question: "How should this viscoelastic tracing be interpreted, and what specific targeted resuscitation bundle must be administered immediately?",
      options: [
        "The TEG reveals a severe multi-component coagulopathy: (1) Prolonged R-time indicates clotting factor deficiency requiring Fresh Frozen Plasma (FFP) or 4F-PCC; (2) Low alpha-angle indicates profound hypofibrinogenemia requiring Cryoprecipitate (10 units) or Fibrinogen Concentrate; (3) Low MA indicates platelet deficiency/dysfunction requiring 1 apheresis unit of Platelets; (4) Elevated LY30 >3% confirms fulminant hyperfibrinolysis requiring immediate IV Tranexamic Acid (TXA: 1 g bolus over 10 min followed by 1 g over 8h, within the 3-hour window)",
        "The TEG is entirely normal; stop all transfusions and infuse 4 liters of normal saline",
        "The patient only needs heparin anticoagulation",
        "Administer recombinant factor VIIa alone without any blood products"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates viscoelastic-guided precision trauma resuscitation: (1) R-time >10 min mandates FFP/PCC to restore factor enzymatic activity; (2) Alpha-angle <53 degrees indicates weak fibrin lattice formation, mandating Cryoprecipitate/Fibrinogen; (3) Low MA <50 mm proves inadequate platelet aggregation, mandating Platelet transfusion; (4) LY30 >3% is diagnostic of acute trauma hyperfibrinolysis, which is stopped by Tranexamic Acid (CRASH-2 protocol within 3 hours)."
    }
  ]
};
