/**
 * Early Clinical Exposure II: Clinical Reasoning, Cognitive Biases & Diagnostic Errors
 * Authoritative diagnostic reasoning content derived from Croskerry, Kahneman's Dual Process Theory.
 * Mapped to NMC CBME Competencies: ECE2.4, FC2.4, AETCOM2.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CLINICAL_REASONING_COGNITIVE_BIASES_MODULE: PhysiologyLessonModule = {
  id: "ece2-clinical-reasoning-cognitive-biases",
  unitCode: "ECE2.4",
  title: "Clinical Reasoning & Cognitive Biases: Dual-Process Theory (System 1/2), Anchoring, Availability & Diagnostic Time-Outs",
  competencies: ["ECE2.4", "FC2.4", "AETCOM2.4"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Clinical Reasoning Architecture, Cognitive Biases & Diagnostic Safety

Diagnostic accuracy requires balancing intuitive heuristic pattern recognition with analytical hypothetico-deductive verification to overcome cognitive biases.

---

## 1. Dual-Process Theory of Clinical Decision-Making

$$\\begin{array}{lcccc}
\\hline
\\textbf{Cognitive Dimension} & \\textbf{System 1 (Intuitive / Heuristic)} & \\textbf{System 2 (Analytical / Deductive)} \\\\
\\hline
\\textbf{Cognitive Speed} & \\mathbf{\\text{Fast, automatic, effortless}} & \\mathbf{\\text{Slow, deliberate, effortful}} \\\\
\\textbf{Conscious Awareness} & \\text{Subconscious, implicit pattern matching} & \\text{Conscious, explicit logical hypothesis testing} \\\\
\\textbf{Clinical Context} & \\text{Routine presentations (e.g., classic shingles rash)} & \\text{Atypical, complex, multisystem, or high-stakes cases} \\\\
\\textbf{Vulnerability to Error} & \\mathbf{\\text{HIGH (Prone to cognitive biases and shortcuts)}} & \\mathbf{\\text{LOW (Reliable, but causes cognitive fatigue)}} \\\\
\\hline
\\end{array}$$

---

## 2. Classical Cognitive Biases in Diagnostic Medicine

$$\\begin{array}{lcccc}
\\hline
\\textbf{Cognitive Bias} & \\textbf{Psychological Mechanism} & \\textbf{Clinical Exemplar Scenario} & \\textbf{De-Biasing Countermeasure} \\\\
\\hline
\\textbf{Anchoring Bias} & \\mathbf{\\text{Fixating on initial data / impressions}} & \\text{Focusing on \"anxiety\" in a young woman} & \\mathbf{\\text{Explicitly ask: \"What findings DO NOT fit}} \\\\
& \\text{and failing to adjust to new information} & \\text{with tachycardia, missing Pulmonary Embolism} & \\mathbf{\\text{this diagnosis?\" (Diagnostic Time-Out)}} \\\\
\\textbf{Availability Bias} & \\mathbf{\\text{Overestimating disease probability based}} & \\text{Diagnosing every headache as Subarachnoid} & \\text{Calculate objective pre-test probability} \\\\
& \\text{on vivid recent or dramatic cases} & \\text{Hemorrhage after a recent missed case} & \\text{using validated risk stratification scores} \\\\
\\textbf{Confirmation Bias} & \\mathbf{\\text{Selectively seeking evidence that confirms}} & \\text{Ordering tests only to prove Pneumonia while} & \\mathbf{\\text{Actively formulate differential diagnoses}} \\\\
& \\text{a favored theory and ignoring contrary clues} & \\text{ignoring normal WBC and bilateral lung rales} & \\mathbf{\\text{that refute the initial hypothesis}} \\\\
\\textbf{Premature Closure} & \\mathbf{\\text{Accepting a diagnosis before all key}} & \\text{Stopping the workup after finding UTI in an} & \\text{Complete full systematic clinical assessment} \\\\
& \\text{differential possibilities are evaluated} & \\text{elderly patient with acute surgical abdomen} & \\text{prior to final diagnostic commitment} \\\\
\\textbf{Diagnostic} & \\mathbf{\\text{Uncritically passing along a prior}} & \\text{Accepting \"Alcohol intoxication\" label from} & \\text{Perform independent, objective physical} \\\\
\\textbf{Momentum} & \\text{clinician's preliminary label} & \\text{ED triage without checking for Epidural Hematoma} & \\text{examination from scratch} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 23-year-old female presents to the Emergency Department with palpitations, shortness of breath, and sharp right-sided chest pain. The triage nurse notes that the patient is crying, anxious, and has a history of generalized anxiety disorder, recording 'Panic Attack' as the triage impression. The resident physician reviews the triage note and prescribes an oral benzodiazepine. Two hours later, the patient remains tachycardic (HR 122 bpm) and tachypneic (RR 26/min), but the physician attributes the persistent tachycardia to uncontrolled anxiety without examining the patient's legs or checking an oxygen saturation, which is later found to be 88% on room air. CT pulmonary angiography reveals massive bilateral pulmonary emboli.",
      question: "Which cognitive bias was primarily responsible for this near-fatal diagnostic delay?",
      options: [
        "Anchoring bias and Diagnostic Momentum; the physician fixated on the initial triage label of 'panic attack' and failed to adjust his diagnostic reasoning despite persistent physiological tachypnea and tachycardia",
        "Sunk cost fallacy; overinvesting in an ineffective medication",
        "Blind spot bias; believing oneself to be immune to error",
        "Hindsight bias; falsely believing the event was predictable"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Anchoring Bias combined with Diagnostic Momentum: (1) Anchoring Bias: The clinician fixated prematurely on initial heuristic data (the triage label of 'panic attack' and patient's anxiety history) and failed to update his diagnostic probability when confronted with objective physiological abnormalities (persistent tachycardia and tachypnea); (2) Diagnostic Momentum: Accepting an unverified previous diagnostic label without independent objective verification; (3) Safety Countermeasure: Clinicians must employ 'Cognitive Forcing Functions' or 'Diagnostic Time-Outs' (asking 'What else could this be? What findings do not fit the diagnosis of panic attack?') before accepting psychiatric explanations for abnormal vital signs."
    }
  ]
};
