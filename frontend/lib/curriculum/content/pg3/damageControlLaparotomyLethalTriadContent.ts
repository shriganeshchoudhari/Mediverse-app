/**
 * Postgraduate Advanced General Surgery & Trauma: Damage Control Laparotomy & The Lethal Triad
 * Authoritative surgical content derived from EAST/AAST Trauma Guidelines, Mattox Moore & Feliciano Trauma.
 * Mapped to NMC PG CBME Competencies: PG3.1, SG1.1, SG1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DAMAGE_CONTROL_LAPAROTOMY_LETHAL_TRIAD_MODULE: PhysiologyLessonModule = {
  id: "pg3-damage-control-laparotomy-lethal-triad",
  unitCode: "PG3.1",
  title: "Damage Control Laparotomy: The Trauma Lethal Triad, 3-Stage Paradigm & Abdominal Compartment Syndrome",
  competencies: ["PG3.1", "SG1.1", "SG1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Damage Control Laparotomy & Trauma Critical Care

Damage control surgery aborts complex anatomic reconstructions in favor of rapid physiological stabilization, interrupting the fatal bloody vicious cycle.

---

## 1. The Trauma Lethal Triad (Bloody Vicious Cycle)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Physiological Insult} & \\textbf{Critical Pathological Threshold} & \\textbf{Molecular / Enzymatic Consequence} \\\\
\\hline
\\textbf{Hypothermia} & \\mathbf{\\text{Core Temp } < 35^{\\circ}\\text{C}} & \\mathbf{\\text{Coagulation factor activity drops by } 10\\% \\text{ per } 1^{\\circ}\\text{C drop;}} \\\\
& & \\text{severe platelet aggregation and activation dysfunction} \\\\
\\textbf{Metabolic Acidosis} & \\mathbf{\\text{Arterial pH } < 7.20\\text{ (Base Deficit } > 6\\text{)}} & \\mathbf{\\text{Severe inhibition of thrombin generation;}} \\\\
& \\text{Serum Lactate } > 4\\text{ mmol/L} & \\text{decreased myocardial contractility & vasopressor unresponsiveness} \\\\
\\textbf{Coagulopathy} & \\mathbf{\\text{Trauma-Induced Coagulopathy (TIC)}} & \\text{Endothelial glycocalyx shedding, consumption of fibrinogen,} \\\\
& \\text{PT/INR } > 1.5\\text{, PTT } > 60\\text{ s} & \\text{and profound tissue-type plasminogen (tPA) hyperfibrinolysis} \\\\
\\hline
\\end{array}$$

---

## 2. The 3-Stage Damage Control Laparotomy (DCL) Paradigm

$$\\begin{array}{lcccc}
\\hline
\\textbf{DCL Stage} & \\textbf{Clinical Setting & Timing} & \\textbf{Surgical / Resuscitative Objectives} \\\\
\\hline
\\textbf{Stage 1: Abbreviated Surgery} & \\mathbf{\\text{Operating Room (<60-90 min)}} & \\mathbf{\\text{Four-quadrant packing, rapid vascular shunting,}} \\\\
& & \\mathbf{\\text{bowel stapling/ligation (NO anastomosis), and TAC / ABThera}} \\\\
\\textbf{Stage 2: ICU Resuscitation} & \\mathbf{\\text{Surgical ICU (24-48 hours)}} & \\mathbf{\\text{Active core rewarming, 1:1:1 balanced resuscitation,}} \\\\
& & \\text{targeted TEG/ROTEM reversal, and ventilation optimization} \\\\
\\textbf{Stage 3: Re-laparotomy} & \\mathbf{\\text{Operating Room (48-72 hours)}} & \\mathbf{\\text{Pack removal, definitive vascular repair, bowel reconstruction/}} \\\\
& & \\text{stoma formation, and planned delayed fascial closure} \\\\
\\hline
\\end{array}$$

---

## 3. Intra-Abdominal Hypertension (IAH) & Compartment Syndrome (ACS)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pathological State} & \\textbf{Bladder Pressure (IAP)} & \\textbf{Diagnostic Criteria & Multisystem Effects} & \\textbf{Definitive Management} \\\\
\\hline
\\textbf{Intra-Abdominal HTN (IAH)} & > 12\\text{ mmHg} & \\text{Impedes venous return (decreased preload), raises CVP} & \\text{Gastric decompression, diuresis} \\\\
\\textbf{Abdominal Compartment (ACS)} & \\mathbf{> 20\\text{ mmHg}} & \\mathbf{\\text{Sustained IAP } > 20\\text{ mmHg } + \\textbf{NEW ORGAN FAILURE:}} & \\mathbf{\\text{EMERGENCY SURGICAL}} \\\\
& & \\mathbf{\\text{Oliguria (renal vein compression), high airway peak pressures}} & \\mathbf{\\text{DECOMPRESSIVE LAPAROTOMY}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 29-year-old male arrives at the trauma center following a high-speed motor vehicle collision with multiple penetrating shrapnel wounds across the abdomen. On arrival, he is in profound hemorrhagic shock with BP 70/40 mmHg and HR 142 bpm. Emergent exploratory laparotomy reveals 2.5 liters of hemoperitoneum, grade IV liver laceration, multiple destructive jejunal and ileal perforations, and a retroperitoneal zone I hematoma. After 45 minutes of surgery, arterial blood gas shows: pH 7.14, Base Deficit -12 mEq/L, Lactate 8.4 mmol/L, core temperature 34.1°C, and diffuse microvascular oozing without clot formation ('bloody vicious cycle').",
      question: "What is the mandatory surgical strategy, and what specific operative steps should be executed before transferring the patient to the Surgical ICU?",
      options: [
        "Immediate transition to Damage Control Laparotomy (Stage 1); the surgical team must rapidly pack all four abdominal quadrants with laparotomy sponges, apply temporary intraluminal vascular shunts if needed, perform rapid linear stapling and resection of devitalized bowel without performing any time-consuming anastomoses, and place a temporary negative pressure abdominal dressing (ABThera / Barker vacuum pack) before transferring immediately to the SICU for core rewarming, acidosis correction, and 1:1:1 balanced resuscitation",
        "Continue open surgery for 5 hours to perform definitive hand-sewn bowel anastomoses",
        "Close the fascia tightly under high tension to tamponade bleeding",
        "Administer 10 liters of room-temperature 0.9% normal saline"
      ],
      correctAnswerIndex: 0,
      explanation: "This case presents a classic indication for Damage Control Surgery: (1) Lethal Triad: The patient has severe hypothermia (34.1°C), profound metabolic acidosis (pH 7.14, base deficit -12), and consumptive coagulopathy; (2) DCL Principle: Continuing complex anatomic reconstructions (such as hand-sewn bowel anastomoses) during active physiological collapse carries nearly 100% mortality; (3) Stage 1 Steps: Abbreviate laparotomy in <60-90 minutes by controlling surgical bleeding via packing/shunts, controlling contamination via bowel stapling, and applying a temporary open abdomen negative pressure dressing."
    }
  ]
};
