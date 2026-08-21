export interface NaranjoQuestion {
  id: number;
  question: string;
  yesScore: number;
  noScore: number;
  doNotKnowScore: number;
}

export const NARANJO_QUESTIONS: NaranjoQuestion[] = [
  { id: 1, question: 'Are there previous conclusive reports on this reaction?', yesScore: 1, noScore: 0, doNotKnowScore: 0 },
  { id: 2, question: 'Did the adverse event appear after the suspected drug was administered?', yesScore: 2, noScore: -1, doNotKnowScore: 0 },
  { id: 3, question: 'Did the adverse reaction improve when the drug was discontinued or a specific antagonist was administered?', yesScore: 1, noScore: 0, doNotKnowScore: 0 },
  { id: 4, question: 'Did the adverse reaction reappear when the drug was readministered?', yesScore: 2, noScore: -1, doNotKnowScore: 0 },
  { id: 5, question: 'Are there alternative causes (other than the drug) that could on their own have caused the reaction?', yesScore: -1, noScore: 2, doNotKnowScore: 0 },
  { id: 6, question: 'Did the reaction reappear when a placebo was given?', yesScore: -1, noScore: 1, doNotKnowScore: 0 },
  { id: 7, question: 'Was the drug detected in the blood (or other fluids) in concentrations known to be toxic?', yesScore: 1, noScore: 0, doNotKnowScore: 0 },
  { id: 8, question: 'Was the reaction more severe when the dose was increased, or less severe when the dose was decreased?', yesScore: 1, noScore: 0, doNotKnowScore: 0 },
  { id: 9, question: 'Did the patient have a similar reaction to the same or similar drugs in any previous exposure?', yesScore: 1, noScore: 0, doNotKnowScore: 0 },
  { id: 10, question: 'Was the adverse event confirmed by any objective evidence?', yesScore: 1, noScore: 0, doNotKnowScore: 0 }
];

export function calculateNaranjoScore(answers: Record<number, 'yes'|'no'|'unknown'>): { totalScore: number; probabilityCategory: 'Definite' | 'Probable' | 'Possible' | 'Doubtful'; explanation: string } {
  let totalScore = 0;
  
  for (const q of NARANJO_QUESTIONS) {
    const answer = answers[q.id] || 'unknown';
    if (answer === 'yes') totalScore += q.yesScore;
    else if (answer === 'no') totalScore += q.noScore;
    else if (answer === 'unknown') totalScore += q.doNotKnowScore;
  }
  
  let probabilityCategory: 'Definite' | 'Probable' | 'Possible' | 'Doubtful' = 'Doubtful';
  if (totalScore >= 9) probabilityCategory = 'Definite';
  else if (totalScore >= 5) probabilityCategory = 'Probable';
  else if (totalScore >= 1) probabilityCategory = 'Possible';
  
  return {
    totalScore,
    probabilityCategory,
    explanation: `Total Score is ${totalScore}, falling into the ${probabilityCategory} category.`
  };
}

export const ADR_CASE_STUDIES = [
  {
    id: 'adr1',
    title: 'SJS with Lamotrigine',
    patientAge: 25,
    gender: 'Female',
    suspectDrug: 'Lamotrigine',
    adverseEvent: 'Stevens-Johnson Syndrome (SJS)',
    clinicalNarrative: 'Patient initiated on Lamotrigine 2 weeks ago and presents with severe rash involving mucous membranes. No other new medications. Rash improved upon discontinuation.',
    expectedNaranjoAnswers: { 1: 'yes', 2: 'yes', 3: 'yes', 4: 'no', 5: 'no', 6: 'unknown', 7: 'unknown', 8: 'unknown', 9: 'unknown', 10: 'yes' } as Record<number, 'yes'|'no'|'unknown'>,
    medDRATerm: 'Stevens-Johnson syndrome'
  },
  {
    id: 'adr2',
    title: 'Statin-induced Rhabdomyolysis with Clarithromycin',
    patientAge: 65,
    gender: 'Male',
    suspectDrug: 'Simvastatin',
    adverseEvent: 'Rhabdomyolysis',
    clinicalNarrative: 'Patient on stable Simvastatin therapy was prescribed Clarithromycin. One week later, developed severe muscle pain and dark urine. CPK markedly elevated.',
    expectedNaranjoAnswers: { 1: 'yes', 2: 'yes', 3: 'yes', 4: 'unknown', 5: 'no', 6: 'unknown', 7: 'yes', 8: 'unknown', 9: 'unknown', 10: 'yes' } as Record<number, 'yes'|'no'|'unknown'>,
    medDRATerm: 'Rhabdomyolysis'
  },
  {
    id: 'adr3',
    title: 'ACEi-induced Angioedema',
    patientAge: 55,
    gender: 'Female',
    suspectDrug: 'Lisinopril',
    adverseEvent: 'Angioedema',
    clinicalNarrative: 'Patient presents to ED with lip and tongue swelling. Started Lisinopril 3 months ago. Symptoms resolved with epinephrine and stopping the drug.',
    expectedNaranjoAnswers: { 1: 'yes', 2: 'yes', 3: 'yes', 4: 'unknown', 5: 'no', 6: 'unknown', 7: 'unknown', 8: 'unknown', 9: 'unknown', 10: 'yes' } as Record<number, 'yes'|'no'|'unknown'>,
    medDRATerm: 'Angioedema'
  },
  {
    id: 'adr4',
    title: 'Vancomycin Red Man Syndrome',
    patientAge: 40,
    gender: 'Male',
    suspectDrug: 'Vancomycin',
    adverseEvent: 'Red Man Syndrome',
    clinicalNarrative: 'Rapid infusion of Vancomycin resulted in flushing, pruritus, and erythematous rash on face and upper torso. Infusion was slowed down and symptoms abated.',
    expectedNaranjoAnswers: { 1: 'yes', 2: 'yes', 3: 'yes', 4: 'yes', 5: 'no', 6: 'unknown', 7: 'unknown', 8: 'yes', 9: 'unknown', 10: 'yes' } as Record<number, 'yes'|'no'|'unknown'>,
    medDRATerm: 'Red man syndrome'
  }
];
