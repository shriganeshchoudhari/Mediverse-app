/**
 * SoapGradingRubric.ts
 * Automated Clinical SOAP Note Grading Models, ICD-10 Dictionaries & Rubric Scoring
 * Part of Mediverse Frontend Skills
 */

export interface SoapEvaluationCriterion {
  category: 'SUBJECTIVE' | 'OBJECTIVE' | 'ASSESSMENT' | 'PLAN' | 'BILLING_CODING' | 'PATIENT_SAFETY';
  title: string;
  weight: number; // Percentage 0-100
  scoreAchieved: number;
  maxScore: number;
  clinicalFeedback: string;
  status: 'MET' | 'PARTIALLY_MET' | 'MISSED';
}

export interface SoapGradingResult {
  submissionId: string;
  totalScore: number; // 0 to 100
  grade: 'HONORS' | 'PASS' | 'CONDITIONAL' | 'FAIL';
  evaluatedAt: string;
  criteria: SoapEvaluationCriterion[];
  detectedIcd10Codes: Array<{ code: string; description: string; accurate: boolean }>;
  missedRedFlags: string[];
  suggestedDifferentialDiagnoses: string[];
  aiFacultyFeedback: string;
}

export const EVALUATE_SOAP_NOTE_CLIENT_MOCK = (
  subjective: string,
  objective: string,
  assessment: string,
  plan: string
): SoapGradingResult => {
  const hasHpi = subjective.length > 30;
  const hasVitals = /bp|heart rate|temp|pulse|spo2|vital/i.test(objective);
  const hasDiffDx = /differential|versus|rule out|suspect|secondary/i.test(assessment);
  const hasPharmacology = /mg|iv|oral|tablet|infusion|dose|daily|antibiotic|analgesic/i.test(plan);
  const hasFollowUp = /follow|re-evaluate|admit|discharge|monitor|repeat/i.test(plan);

  const criteria: SoapEvaluationCriterion[] = [
    {
      category: 'SUBJECTIVE',
      title: 'History of Present Illness (HPI) & Onset Chronology',
      weight: 20,
      scoreAchieved: hasHpi ? 18 : 8,
      maxScore: 20,
      clinicalFeedback: hasHpi
        ? 'Well-structured chronology with chief complaint and associated symptoms.'
        : 'HPI lacks sufficient detail regarding symptom onset and exacerbating factors.',
      status: hasHpi ? 'MET' : 'PARTIALLY_MET',
    },
    {
      category: 'OBJECTIVE',
      title: 'Physical Examination Findings & Baseline Vitals Documentation',
      weight: 20,
      scoreAchieved: hasVitals ? 19 : 7,
      maxScore: 20,
      clinicalFeedback: hasVitals
        ? 'Accurately documented vitals and targeted system physical exam.'
        : 'Missing baseline vital signs (BP, HR, RR, SpO2) and systematic abdominal/cardiac findings.',
      status: hasVitals ? 'MET' : 'PARTIALLY_MET',
    },
    {
      category: 'ASSESSMENT',
      title: 'Differential Diagnoses & Clinical Reasoning Prioritization',
      weight: 25,
      scoreAchieved: hasDiffDx ? 24 : 10,
      maxScore: 25,
      clinicalFeedback: hasDiffDx
        ? 'Strong clinical reasoning with primary and ranked secondary differential diagnoses.'
        : 'Assessment needs clear ranking of primary working diagnosis vs life-threatening rule-outs.',
      status: hasDiffDx ? 'MET' : 'PARTIALLY_MET',
    },
    {
      category: 'PLAN',
      title: 'Diagnostic Workup, Pharmacology Dosing & Patient Disposition',
      weight: 25,
      scoreAchieved: hasPharmacology && hasFollowUp ? 23 : 12,
      maxScore: 25,
      clinicalFeedback: hasPharmacology
        ? 'Evidence-based treatment plan with clear drug dosages and laboratory orders.'
        : 'Treatment plan requires specific drug dosages, route of administration, and disposition instructions.',
      status: hasPharmacology ? 'MET' : 'PARTIALLY_MET',
    },
    {
      category: 'PATIENT_SAFETY',
      title: 'Red-Flag Symptom Recognition & Allergy Verification',
      weight: 10,
      scoreAchieved: 10,
      maxScore: 10,
      clinicalFeedback: 'Zero contraindications or lethal drug interactions identified.',
      status: 'MET',
    },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.scoreAchieved, 0);
  let grade: SoapGradingResult['grade'] = 'PASS';
  if (totalScore >= 90) grade = 'HONORS';
  else if (totalScore >= 70) grade = 'PASS';
  else if (totalScore >= 55) grade = 'CONDITIONAL';
  else grade = 'FAIL';

  return {
    submissionId: `soap-eval-${Date.now()}`,
    totalScore,
    grade,
    evaluatedAt: new Date().toISOString(),
    criteria,
    detectedIcd10Codes: [
      { code: 'K35.80', description: 'Unspecified acute appendicitis', accurate: true },
      { code: 'R10.31', description: 'Right lower quadrant abdominal pain', accurate: true },
    ],
    missedRedFlags: hasVitals ? [] : ['Fever spiking > 38.5C not trended', 'Rebound tenderness / Rovsing sign not documented'],
    suggestedDifferentialDiagnoses: [
      'Acute Appendicitis (Primary)',
      'Mesenteric Adenitis (Secondary)',
      'Meckel Diverticulitis',
      'Right Ureteral Calculus / Nephrolithiasis',
    ],
    aiFacultyFeedback:
      'Overall solid clinical synthesis. Ensure you always document surgical clearance consultation when acute peritoneal signs are present in young adults.',
  };
};
