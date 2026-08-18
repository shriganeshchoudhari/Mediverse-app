/**
 * Clinical Pharmacology: Anticoagulation, DOACs & Specific Reversal Agents
 * Authoritative medical content derived from CHEST Guidelines, Goodman & Gilman's (14th ed.).
 * Mapped to NMC CBME Competencies: PH1.5, PH1.6, MD37.3, SU35.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANTICOAGULATION_REVERSAL_AGENTS_MODULE: PhysiologyLessonModule = {
  id: "pharmacology-adv-anticoagulation-reversal",
  unitCode: "PH5.1",
  title: "Anticoagulation & Direct Reversal: DOACs (Apixaban, Dabigatran) vs Warfarin & Antidotes",
  competencies: ["PH1.5", "PH1.6", "MD37.3", "SU35.3"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Anticoagulation Pharmacotherapy & Targeted Reversal Agents

Management of life-threatening bleeding or emergent surgical emergencies in anticoagulated patients requires immediate administration of target-specific reversal antidotes.

---

## 1. Anticoagulant Classes & Specific Reversal Protocols

$$\\begin{array}{lcccc}
\\hline
\\textbf{Anticoagulant Class} & \\textbf{Mechanism of Action} & \\textbf{Monitoring Test} & \\textbf{First-Line Targeted Reversal Agent} & \\textbf{Reversal Mechanism} \\\\
\\hline
\\textbf{Dabigatran (Pradaxa)} & \\text{Direct Thrombin (IIa) Inhibitor} & \\text{ECT, dTT, aPTT} & \\mathbf{\\text{Idarucizumab (Praxbind, 5g IV)}} & \\mathbf{\\text{Humanized Fab fragment (350x } > \\text{ affinity)}} \\\\
\\textbf{Apixaban / Rivaroxaban} & \\text{Direct Factor Xa Inhibitors} & \\text{Anti-Factor Xa Assay} & \\mathbf{\\text{Andexanet Alfa (Andexxa)}} & \\mathbf{\\text{Recombinant decoy Factor Xa protein}} \\\\
& & & \\mathbf{\\text{or 4-Factor PCC (50 U/kg)}} & \\text{Floods unactivated clotting factors} \\\\
\\textbf{Warfarin (Coumadin)} & \\text{VKORC1 Inhibitor (II, VII, IX, X)} & \\mathbf{\\text{PT / INR (target 2-3)}} & \\mathbf{\\text{4-Factor PCC (Kcentra) + IV Vitamin K}} & \\mathbf{\\text{Immediate factor replacement + VK synthesis}} \\\\
\\textbf{Unfractionated Heparin (UFH)} & \\text{Antithrombin III activator (IIa/Xa)} & \\text{aPTT (target 60-80s)} & \\mathbf{\\text{Protamine Sulfate (1mg / 100 U UFH)}} & \\text{Basic protein neutralization of acidic heparin} \\\\
\\textbf{Low-Molecular-Weight (LMWH)} & \\text{AT-III activator (predominantly Xa)} & \\text{Anti-Factor Xa Assay} & \\text{Protamine Sulfate (Partial reversal } \\approx 60\\%\\text{)} & \\text{Neutralizes anti-IIa, incomplete anti-Xa} \\\\
\\hline
\\end{array}$$

---

## 2. Critical Reversal Clinical Pearls

1. **Idarucizumab (Praxbind)**:
   - Dosed as two consecutive $2.5\\text{ g}$ IV boluses ($5\\text{ g}$ total).
   - Instantly binds both free and thrombin-bound dabigatran with an affinity $350\\text{ times}$ greater than thrombin, normalizing coagulation within minutes.
2. **Andexanet Alfa (Andexxa)**:
   - Recombinant modified human Factor Xa protein with an active site serine replaced with alanine (eliminating procoagulant enzymatic activity) and lacking the membrane-binding Gla domain.
   - Functions as a high-affinity competitive decoy receptor that scavenges direct Factor Xa inhibitors (Apixaban, Rivaroxaban) out of plasma.
3. **Warfarin Urgent Reversal**:
   - **4-Factor PCC (Kcentra)** contains non-activated human factors **II, VII, IX, X, Protein C, and Protein S** $\rightarrow$ rapid INR normalization in $<15\\text{ minutes}$ with minimal volume load (compared to Fresh Frozen Plasma FFP which requires hours to thaw and large volumes causing TACO).
   - **Always co-administer Intravenous Vitamin K ($10\\text{ mg}$ slow IV infusion)** to sustain hepatic clotting factor synthesis as infused 4F-PCC factors have short half-lives (Factor VII half-life is only $6\\text{ hours}$).
`,
  clinicalVignettes: [
    {
      scenario: "A 74-year-old male with non-valvular atrial fibrillation taking Dabigatran 150 mg twice daily presents to the emergency department with sudden-onset severe headache, vomiting, and a Glasgow Coma Scale (GCS) of 9. Non-contrast head CT demonstrates an acute 45 mL left intracerebral hemorrhage with midline shift. The neurosurgeon plans an immediate emergency craniotomy for hematoma evacuation. Coagulation labs show a markedly elevated Dilute Thrombin Time (dTT) and Ecarin Clotting Time (ECT).",
      question: "Which of the following represents the most appropriate, immediate reversal intervention to achieve surgical hemostasis?",
      options: [
        "Administer Intravenous Idarucizumab 5 g (two 2.5 g boluses) immediately",
        "Administer Intravenous Vitamin K 10 mg and 4 units of Fresh Frozen Plasma",
        "Administer Intravenous Protamine Sulfate 50 mg",
        "Administer Intravenous Tranexamic Acid and wait 24 hours for dabigatran clearance"
      ],
      correctAnswerIndex: 0,
      explanation: "Idarucizumab is a specific humanized monoclonal antibody Fab fragment indicated for the emergency reversal of Dabigatran (a direct thrombin inhibitor) during life-threatening bleeding or before urgent surgical procedures. It binds free and bound dabigatran with 350-fold higher affinity than thrombin, instantly neutralizing its anticoagulant activity without intrinsic procoagulant risk. Vitamin K and FFP are ineffective for direct thrombin inhibitors, and delaying surgery for 24 hours in expanding intracranial hemorrhage with midline shift is fatal."
    }
  ]
};
