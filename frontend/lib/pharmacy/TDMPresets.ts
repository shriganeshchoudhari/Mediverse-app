export interface NTIDrug {
  id: string;
  name: string;
  drugClass: string;
  targetTherapeuticRange: string;
  targetTrough: string;
  targetPeak?: string;
  targetAUCMIC?: string;
  toxicThreshold: string;
  samplingTimeAdvice: string;
  cockcroftGaultAdjustable: boolean;
  defaultDoseMg: number;
  defaultIntervalHours: number;
  normalHalfLifeHours: number;
  renalExcretionPercent: number;
  clinicalPearl: string;
  toxicitySigns: string[];
}

export const NTI_DRUGS: NTIDrug[] = [
  { id: 'vanco', name: 'Vancomycin', drugClass: 'Glycopeptide Antibiotic', targetTherapeuticRange: '10-20 mg/L', targetTrough: '10-20 mg/L (indication dependent)', targetAUCMIC: '400-600', toxicThreshold: '> 20 mg/L', samplingTimeAdvice: 'Trough: just before 4th dose. Peak: 1-2 hours after infusion ends.', cockcroftGaultAdjustable: true, defaultDoseMg: 1000, defaultIntervalHours: 12, normalHalfLifeHours: 6, renalExcretionPercent: 90, clinicalPearl: 'AUC/MIC ratio is the preferred PK/PD target.', toxicitySigns: ['Nephrotoxicity', 'Ototoxicity', 'Red Man Syndrome'] },
  { id: 'gent', name: 'Gentamicin', drugClass: 'Aminoglycoside', targetTherapeuticRange: 'Peak 5-10 mg/L, Trough < 2 mg/L', targetTrough: '< 1-2 mg/L', targetPeak: '5-10 mg/L', toxicThreshold: 'Trough > 2 mg/L', samplingTimeAdvice: 'Trough: 30 min before dose. Peak: 30 min after 30-min infusion ends.', cockcroftGaultAdjustable: true, defaultDoseMg: 120, defaultIntervalHours: 8, normalHalfLifeHours: 2.5, renalExcretionPercent: 95, clinicalPearl: 'Extended-interval dosing preferred to minimize toxicity.', toxicitySigns: ['Nephrotoxicity', 'Ototoxicity'] },
  { id: 'amikacin', name: 'Amikacin', drugClass: 'Aminoglycoside', targetTherapeuticRange: 'Peak 20-30 mg/L, Trough < 5 mg/L', targetTrough: '< 5 mg/L', targetPeak: '20-30 mg/L', toxicThreshold: 'Trough > 10 mg/L', samplingTimeAdvice: 'Trough: 30 min before dose.', cockcroftGaultAdjustable: true, defaultDoseMg: 500, defaultIntervalHours: 8, normalHalfLifeHours: 2.5, renalExcretionPercent: 95, clinicalPearl: 'Reserved for resistant gram-negative infections.', toxicitySigns: ['Nephrotoxicity', 'Ototoxicity'] },
  { id: 'digoxin', name: 'Digoxin', drugClass: 'Cardiac Glycoside', targetTherapeuticRange: '0.8-2.0 ng/mL', targetTrough: '0.5-0.9 ng/mL (Heart Failure)', toxicThreshold: '> 2.0 ng/mL', samplingTimeAdvice: 'At least 6-8 hours after dose, ideally prior to next dose.', cockcroftGaultAdjustable: true, defaultDoseMg: 0.25, defaultIntervalHours: 24, normalHalfLifeHours: 36, renalExcretionPercent: 70, clinicalPearl: 'Hypokalemia increases risk of toxicity.', toxicitySigns: ['Nausea', 'Vomiting', 'Visual disturbances (yellow halos)', 'Arrhythmias'] },
  { id: 'phenytoin', name: 'Phenytoin', drugClass: 'Antiepileptic', targetTherapeuticRange: '10-20 mg/L', targetTrough: '10-20 mg/L (Total)', toxicThreshold: '> 20 mg/L', samplingTimeAdvice: 'Trough: prior to next dose.', cockcroftGaultAdjustable: false, defaultDoseMg: 300, defaultIntervalHours: 24, normalHalfLifeHours: 22, renalExcretionPercent: 5, clinicalPearl: 'Displays Michaelis-Menten (non-linear) pharmacokinetics.', toxicitySigns: ['Nystagmus', 'Ataxia', 'Lethargy', 'Gingival hyperplasia'] },
  { id: 'lithium', name: 'Lithium', drugClass: 'Mood Stabilizer', targetTherapeuticRange: '0.6-1.2 mEq/L', targetTrough: '0.6-1.2 mEq/L', toxicThreshold: '> 1.5 mEq/L', samplingTimeAdvice: '12 hours post-dose.', cockcroftGaultAdjustable: true, defaultDoseMg: 600, defaultIntervalHours: 12, normalHalfLifeHours: 24, renalExcretionPercent: 100, clinicalPearl: 'Sodium depletion increases lithium levels.', toxicitySigns: ['Tremor', 'Confusion', 'Ataxia', 'Seizures'] },
  { id: 'tacrolimus', name: 'Tacrolimus', drugClass: 'Calcineurin Inhibitor', targetTherapeuticRange: '5-15 ng/mL', targetTrough: '5-15 ng/mL', toxicThreshold: '> 15 ng/mL', samplingTimeAdvice: 'Trough: 12h post-dose (just before next dose).', cockcroftGaultAdjustable: false, defaultDoseMg: 2, defaultIntervalHours: 12, normalHalfLifeHours: 12, renalExcretionPercent: 1, clinicalPearl: 'Subject to numerous CYP3A4 interactions.', toxicitySigns: ['Nephrotoxicity', 'Neurotoxicity', 'Hypertension', 'Hyperglycemia'] },
  { id: 'cyclosporine', name: 'Cyclosporine', drugClass: 'Calcineurin Inhibitor', targetTherapeuticRange: '100-400 ng/mL', targetTrough: '100-400 ng/mL', toxicThreshold: '> 400 ng/mL', samplingTimeAdvice: 'Trough or 2-hour post dose (C2) depending on protocol.', cockcroftGaultAdjustable: false, defaultDoseMg: 100, defaultIntervalHours: 12, normalHalfLifeHours: 8, renalExcretionPercent: 1, clinicalPearl: 'Gingival hyperplasia is a classic side effect.', toxicitySigns: ['Nephrotoxicity', 'Hypertension', 'Hirsutism'] },
  { id: 'carbamazepine', name: 'Carbamazepine', drugClass: 'Antiepileptic', targetTherapeuticRange: '4-12 mcg/mL', targetTrough: '4-12 mcg/mL', toxicThreshold: '> 12 mcg/mL', samplingTimeAdvice: 'Trough: prior to next dose.', cockcroftGaultAdjustable: false, defaultDoseMg: 200, defaultIntervalHours: 12, normalHalfLifeHours: 15, renalExcretionPercent: 1, clinicalPearl: 'Induces its own metabolism (autoinduction).', toxicitySigns: ['Dizziness', 'Diplopia', 'Ataxia', 'Hyponatremia'] },
  { id: 'theophylline', name: 'Theophylline', drugClass: 'Methylxanthine', targetTherapeuticRange: '5-15 mcg/mL', targetTrough: '5-15 mcg/mL', toxicThreshold: '> 20 mcg/mL', samplingTimeAdvice: 'Peak: 1-2h post liquid/IR, 4-6h post ER.', cockcroftGaultAdjustable: false, defaultDoseMg: 300, defaultIntervalHours: 12, normalHalfLifeHours: 8, renalExcretionPercent: 10, clinicalPearl: 'Smoking induces metabolism, requiring higher doses.', toxicitySigns: ['Nausea', 'Tachycardia', 'Tremor', 'Seizures'] },
  { id: 'warfarin', name: 'Warfarin', drugClass: 'Vitamin K Antagonist', targetTherapeuticRange: 'INR 2-3', targetTrough: 'N/A', toxicThreshold: 'INR > 4.5', samplingTimeAdvice: 'Measure INR.', cockcroftGaultAdjustable: false, defaultDoseMg: 5, defaultIntervalHours: 24, normalHalfLifeHours: 40, renalExcretionPercent: 0, clinicalPearl: 'Highly protein bound, subject to many diet/drug interactions.', toxicitySigns: ['Bleeding', 'Bruising'] },
  { id: 'methotrexate', name: 'Methotrexate', drugClass: 'Antimetabolite', targetTherapeuticRange: 'Variable', targetTrough: '< 0.1 uM at 72h', toxicThreshold: '> 1.0 uM at 48h', samplingTimeAdvice: 'Daily for high dose until < 0.1 uM.', cockcroftGaultAdjustable: true, defaultDoseMg: 15, defaultIntervalHours: 168, normalHalfLifeHours: 10, renalExcretionPercent: 80, clinicalPearl: 'Leucovorin rescue needed for high doses.', toxicitySigns: ['Myelosuppression', 'Mucositis', 'Hepatotoxicity'] }
];

export function calculateCockcroftGaultCrCl(age: number, weightKg: number, serumCreatinineMgDl: number, isFemale: boolean): number {
  let crcl = ((140 - age) * weightKg) / (72 * serumCreatinineMgDl);
  if (isFemale) crcl *= 0.85;
  return crcl;
}

export function calculateAdjustedDose(drugId: string, crCl: number, weightKg: number): { recommendedDoseMg: number; recommendedIntervalHours: number; expectedTroughUgMl: number; clinicalNote: string } {
  const drug = getNTIDrugById(drugId);
  if (!drug) {
    return { recommendedDoseMg: 0, recommendedIntervalHours: 0, expectedTroughUgMl: 0, clinicalNote: 'Drug not found' };
  }
  
  if (!drug.cockcroftGaultAdjustable || crCl > 50) {
    return {
      recommendedDoseMg: drug.defaultDoseMg,
      recommendedIntervalHours: drug.defaultIntervalHours,
      expectedTroughUgMl: 15,
      clinicalNote: 'Standard dosing recommended.'
    };
  } else if (crCl > 20) {
    return {
      recommendedDoseMg: drug.defaultDoseMg,
      recommendedIntervalHours: drug.defaultIntervalHours * 1.5,
      expectedTroughUgMl: 18,
      clinicalNote: 'Interval extended due to moderate renal impairment.'
    };
  } else {
    return {
      recommendedDoseMg: drug.defaultDoseMg * 0.5,
      recommendedIntervalHours: drug.defaultIntervalHours * 2,
      expectedTroughUgMl: 12,
      clinicalNote: 'Dose reduced and interval extended due to severe renal impairment.'
    };
  }
}

export function getNTIDrugById(id: string): NTIDrug | undefined {
  const norm = id.toLowerCase().trim();
  return NTI_DRUGS.find(d => d.id.toLowerCase() === norm || d.name.toLowerCase() === norm || d.id.toLowerCase().includes(norm));
}
