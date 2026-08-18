/**
 * Clinical Psychiatry Advanced: Substance Use Disorders, Withdrawal & Addiction Medicine
 * Authoritative addiction medicine content derived from ASAM Guidelines, Kaplan & Sadock (10th ed.).
 * Mapped to NMC CBME Competencies: PS7.1, PS7.2, MD48.4, SU46.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SUBSTANCE_USE_ADDICTION_PROTOCOLS_MODULE: PhysiologyLessonModule = {
  id: "psychiatry-adv-substance-addiction",
  unitCode: "PS7.1",
  title: "Substance Use Disorders & Addiction Medicine: Delirium Tremens CIWA Protocols, Wernicke Encephalopathy & Opioid Maintenance",
  competencies: ["PS7.1", "PS7.2", "MD48.4", "SU46.4"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Substance Use Disorders: Alcohol Withdrawal, CIWA & Opioid Maintenance

Addiction medicine requires precise staging of withdrawal timelines, protocolized symptom-triggered pharmacotherapy, and evidence-based relapse prevention.

---

## 1. Alcohol Withdrawal Timeline & Neurobiology

$$\\begin{array}{lcccc}
\\hline
\\textbf{Withdrawal Stage} & \\textbf{Onset Post-Last Drink} & \\textbf{Underlying Neurobiology} & \\textbf{Key Clinical Signs} & \\textbf{Evidence-Based Management} \\\\
\\hline
\\textbf{Mild Withdrawal} & \\mathbf{6 - 12\\text{ hours}} & \\text{GABA-A down-regulation} & \\text{Insomnia, fine tremors, anxiety,} & \\text{Supportive care, hydration,} \\\\
& & + \\text{ NMDA up-regulation} & \\text{mild diaphoresis, GI upset, intact sensorium} & \\text{oral multivitamins } + \\mathbf{\\text{Thiamine}} \\\\
\\textbf{Alcoholic} & \\mathbf{12 - 24\\text{ hours}} & \\text{Excess dopaminergic} & \\mathbf{\\text{Visual, tactile, or auditory hallucinations}} & \\text{Oral Diazepam / Chlordiazepoxide} \\\\
\\textbf{Hallucinosis} & & \\text{transmission; intact orientation} & \\mathbf{\\text{with CLEAR sensorium (oriented)}} & (\\text{reassurance, quiet environment}) \\\\
\\textbf{Withdrawal} & \\mathbf{12 - 48\\text{ hours}} & \\text{Massive central nervous} & \\mathbf{\\text{Generalized tonic-clonic seizures}} & \\mathbf{\\text{IV Diazepam / Lorazepam}} \\\\
\\textbf{Seizures} & & \\text{system hyperexcitability} & (\\text{often in brief clusters; } 3\\% \\rightarrow \\text{ status}) & (\\mathbf{\\text{Phenytoin is INEFFECTIVE}}) \\\\
\\textbf{Delirium} & \\mathbf{48 - 96\\text{ hours}} & \\mathbf{\\text{Unchecked autonomic storm}} & \\mathbf{\\text{Severe confusion, delirium, fluctuating vitals,}} & \\mathbf{\\text{ICU admission } + \\text{ IV Diazepam /}} \\\\
\\textbf{Tremens (DTs)} & (\\text{up to } 7-10\\text{d}) & \\mathbf{+ \\text{ sympathetic collapse}} & \\mathbf{\\text{fever, drenching sweats, hallucinations}} & \\mathbf{\\text{Lorazepam (CIWA-Ar titrated)}} \\\\
\\hline
\\end{array}$$

---

## 2. Relapse Prevention & Opioid Agonist Therapeutics

- **Wernicke Encephalopathy Prevention**:
  - **Clinical Triad**: Encephalopathy (confusion), Oculomotor dysfunction (nystagmus, bilateral lateral rectus palsy), and Gait ataxia.
  - **MANDATE**: **Always administer IV Thiamine (Vitamin B1) BEFORE or WITH IV Dextrose/Glucose** (dextrose infusion without thiamine exhausts residual thiamine pyrophosphate cofactors in pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase, precipitating acute irreversible Wernicke-Korsakoff syndrome with mammillary body necrosis).
- **Maintenance Pharmacotherapies**:
  - **Alcohol Maintenance**:
    - **Naltrexone** (Oral daily or IM monthly extended-release): $\\mu$-opioid receptor antagonist; blunts dopamine reward pathways, reducing alcohol craving and heavy drinking days (contraindicated if taking opioids or in acute hepatitis).
    - **Acamprosate**: Modulates NMDA and GABA neurotransmission; safe in liver cirrhosis (dose-adjusted in renal impairment).
    - **Disulfiram**: Irreversible aldehyde dehydrogenase inhibitor $\\rightarrow$ toxic acetaldehyde accumulation causing flushing, vomiting, tachycardia upon ethanol ingestion.
  - **Opioid Maintenance**:
    - **Buprenorphine**: High-affinity partial $\\mu$-agonist; ceiling effect on respiratory depression; must initiate only when patient is in moderate withdrawal (COWS score $\\ge 12$) to avoid precipitating acute withdrawal.
    - **Methadone**: Long-acting full $\\mu$-agonist; requires daily clinic dispensing; monitor for QTc prolongation.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male with a 20-year history of heavy alcohol consumption (1 liter of vodka daily) is admitted to the hospital for acute pancreatitis. On hospital day 3 (approximately 72 hours after his last alcoholic drink), he becomes severely agitated, disoriented to time and place, and is screaming that insects are crawling over his hospital bed. Physical examination reveals: HR 142 bpm, BP 178/104 mmHg, Temperature 38.8°C, marked drenching diaphoresis, and coarse bilateral hand tremors. Neurological examination confirms acute fluctuating delirium, visual and tactile hallucinations, and autonomic hyperactivity.",
      question: "What is the diagnosis, what is the underlying neurobiological mechanism, and what is the gold standard immediate pharmacotherapy?",
      options: [
        "Delirium Tremens (DTs); uninhibited central nervous system hyperexcitability from chronic GABA-A receptor down-regulation and NMDA glutamate receptor up-regulation following sudden alcohol cessation; admit to ICU and initiate aggressive symptom-triggered IV Benzodiazepine therapy (e.g., IV Diazepam or Lorazepam) guided by CIWA-Ar scores, along with IV Thiamine",
        "Alcoholic Hallucinosis; reassure patient and observe without pharmacotherapy",
        "Wernicke Encephalopathy; administer IV Dextrose 50% immediately before thiamine",
        "Serotonin Syndrome; administer IV Cyproheptadine"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is suffering from Delirium Tremens (DTs), the most severe and potentially fatal manifestation of alcohol withdrawal: (1) Timeline & Pathophysiology: Occurs 48 to 96 hours after the last drink due to abrupt withdrawal of chronic ethanol GABA-A agonist and NMDA antagonist effects, resulting in profound rebound glutamate storm and autonomic hyperarousal; (2) Clinical Presentation: Characterized by delirium (clouding of consciousness, disorientation), visual/tactile hallucinations ('formication'), and severe autonomic instability (tachycardia, fever, hypertension, diaphoresis); (3) Management: Immediate ICU admission, high-dose intravenous Benzodiazepines (e.g., Diazepam or Lorazepam titrated to CIWA-Ar score) to restore GABA-ergic tone, aggressive IV hydration, electrolyte correction, and parenteral Thiamine before dextrose."
    }
  ]
};
