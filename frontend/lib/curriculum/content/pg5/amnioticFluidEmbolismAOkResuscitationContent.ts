/**
 * Postgraduate Advanced Obstetrics & Maternal Critical Care: Amniotic Fluid Embolism & A-OK Protocol
 * Authoritative maternal critical care content derived from SOAP AFE Protocols, SMFM / Chest Guidelines.
 * Mapped to NMC PG CBME Competencies: PG5.3, OB3.1, OB3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AMNIOTIC_FLUID_EMBOLISM_AOK_RESUSCITATION_MODULE: PhysiologyLessonModule = {
  id: "pg5-amniotic-fluid-embolism-aok-resuscitation",
  unitCode: "PG5.3",
  title: "Amniotic Fluid Embolism (AFE): Anaphylactoid Biphasic Collapse, The A-OK Protocol & DIC Management",
  competencies: ["PG5.3", "OB3.1", "OB3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Amniotic Fluid Embolism (AFE) & The A-OK Resuscitation Protocol

AFE is an unpredictable anaphylactoid reaction to fetal antigenic material entering the maternal venous circulation, triggering catastrophic acute pulmonary vasospasm and DIC.

---

## 1. Biphasic Pathophysiological Sequence of AFE

$$\\begin{array}{lcccc}
\\hline
\\textbf{Phase} & \\textbf{Hemodynamic / Vascular Mechanism} & \\textbf{Clinical Hallmarks} & \\textbf{Immediate Intervention} \\\\
\\hline
\\textbf{Phase 1} & \\mathbf{\\text{Acute Pulmonary Vasoconstriction}} & \\mathbf{\\text{Sudden dyspnea, cyanosis,}} & \\mathbf{\\text{Intubate (100\\% } O_2\\text{), CPR,}} \\\\
(\\textbf{Early}) & \\mathbf{\\& \\text{ Acute Right Ventricular Failure}} & \\mathbf{\\text{unrecordable BP, PEA arrest}} & \\mathbf{\\text{Epi/Norepi, A-OK Protocol,}} \\\\
& (\\text{severe pulmonary hypertension, RV dilation}) & & \\mathbf{\\text{mobilize VA-ECMO}} \\\\
\\textbf{Phase 2} & \\mathbf{\\text{Left Ventricular Failure}} & \\mathbf{\\text{Flash pulmonary edema,}} & \\mathbf{\\text{Massive Transfusion Protocol (1:1:1),}} \\\\
(\\textbf{Late}) & \\mathbf{\\& \\text{ Fulminant Disseminated Intravascular}} & \\mathbf{\\text{massive uterine atony,}} & \\mathbf{\\text{Cryoprecipitate (keep Fib } > 200\\text{),}} \\\\
& \\mathbf{\\text{Coagulation (DIC: tPA surge & factor loss)}} & \\mathbf{\\text{microvascular oozing & PPH}} & \\mathbf{\\text{TXA (1 g IV), Uterotonics / Bakri}} \\\\
\\hline
\\end{array}$$

---

## 2. The A-OK Resuscitation Bundle

- **A - Atropine ($0.8-1.0\\text{ mg}$ IV)**:
  - Vagolytic agent that blocks massive vagal bradycardia, reduces reflex pulmonary arteriolar vasospasm, and counteracts coronary hypoperfusion.
- **O - Ondansetron ($8\\text{ mg}$ IV)**:
  - Serotonin $5\\text{-HT}_3$ receptor antagonist that blocks serotonin-mediated pulmonary vasoconstriction, vagally-mediated Bezold-Jarisch reflexes, and catastrophic bronchospasm.
- **K - Ketorolac ($30\\text{ mg}$ IV)**:
  - Potent cyclooxygenase (COX) inhibitor that halts thromboxane $A_2$ production, preventing microvascular pulmonary platelet aggregation and blunting the onset of DIC.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old G2P1 at 39 weeks gestation in active labor suddenly gasps for breath, develops severe shivering, perioral cyanosis, and loses consciousness 2 minutes following artificial rupture of membranes. Pulse oximetry drops to 62% on room air, blood pressure is 50/25 mmHg, heart rate is 165 bpm with wide QRS complexes on telemetry, rapidly degenerating into pulseless electrical activity (PEA). Bedside echocardiography demonstrates a massive, acutely dilated hypokinetic Right Ventricle with leftward deviation of the interventricular septum.",
      question: "What is the diagnosis, and what specific targeted three-drug resuscitation bundle (A-OK protocol) should be administered alongside immediate CPR?",
      options: [
        "Amniotic Fluid Embolism (AFE / Anaphylactoid Syndrome of Pregnancy); administer the A-OK resuscitation bundle immediately: Atropine (0.8-1.0 mg IV to block vagal bradycardia and pulmonary vasoconstriction), Ondansetron (8 mg IV to block serotonin-mediated 5-HT3 pulmonary collapse), and Ketorolac (30 mg IV to inhibit cyclooxygenase, halting thromboxane A2 release and microvascular thrombosis)",
        "Pulmonary aspiration of gastric contents; give IV omeprazole and inhaled albuterol only",
        "Eclampsia; give IV Magnesium Sulfate 4 g and labetalol",
        "Uterine rupture; immediately pack the vagina with dry gauze and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case presents the classic catastrophic presentation of Amniotic Fluid Embolism: (1) Pathophysiology: Phase 1 acute pulmonary vasospasm and acute cor pulmonale / RV failure, followed rapidly by Phase 2 LV dysfunction and fulminant DIC; (2) The A-OK Protocol (Atropine 1 mg, Ondansetron 8 mg, Ketorolac 30 mg): Developed to interrupt the neurohumoral and platelet-activating cascades triggered by fetal antigens in the maternal circulation, significantly improving survival and ROSC rates."
    }
  ]
};
