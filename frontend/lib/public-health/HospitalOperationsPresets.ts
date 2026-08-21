export interface HospitalCapacityMetrics {
  totalBeds: number;
  admissionsPerDay: number;
  alosDays: number;
  borPct: number;
  bedTurnoverIntervalDays: number;
  isOvercrowded: boolean;
  erlangCWaitHours: number;
}

export function calculateHospitalMetrics(totalBeds: number, admissionsPerDay: number, alosDays: number): HospitalCapacityMetrics {
  const patientDays = admissionsPerDay * alosDays;
  const borPct = (patientDays / totalBeds) * 100;
  
  // Available bed days = totalBeds - patientDays
  const availableBedDays = totalBeds - patientDays;
  const dischargesPerDay = admissionsPerDay; // Assuming steady state
  const bedTurnoverIntervalDays = availableBedDays / (dischargesPerDay > 0 ? dischargesPerDay : 1);
  
  const isOvercrowded = borPct > 85;
  
  // Simplified wait time estimation (not true Erlang C, just a basic heuristic for preset)
  let erlangCWaitHours = 0;
  if (borPct > 85) {
    erlangCWaitHours = (borPct - 85) * 0.5; // Roughly 0.5 hours per % over 85
  }
  
  return {
    totalBeds,
    admissionsPerDay,
    alosDays,
    borPct,
    bedTurnoverIntervalDays,
    isOvercrowded,
    erlangCWaitHours
  };
}

export interface NABHQualityIndicator {
  id: string;
  indicatorName: string;
  targetBenchmark: string;
  calculationFormula: string;
  department: string;
}

export const NABH_INDICATORS: NABHQualityIndicator[] = [
  {
    id: 'qi_clabsi',
    indicatorName: 'Central Line-Associated Bloodstream Infection (CLABSI) Rate',
    targetBenchmark: '< 2 per 1000 central line days',
    calculationFormula: '(Number of CLABSIs / Number of central line days) * 1000',
    department: 'Intensive Care Unit (ICU)'
  },
  {
    id: 'qi_cauti',
    indicatorName: 'Catheter-Associated Urinary Tract Infection (CAUTI) Rate',
    targetBenchmark: '< 3 per 1000 catheter days',
    calculationFormula: '(Number of CAUTIs / Number of urinary catheter days) * 1000',
    department: 'Intensive Care Unit (ICU) / Wards'
  },
  {
    id: 'qi_vap',
    indicatorName: 'Ventilator-Associated Pneumonia (VAP) Rate',
    targetBenchmark: '< 5 per 1000 ventilator days',
    calculationFormula: '(Number of VAPs / Number of ventilator days) * 1000',
    department: 'Intensive Care Unit (ICU)'
  },
  {
    id: 'qi_icu_return',
    indicatorName: 'Return to ICU within 48h',
    targetBenchmark: '< 2%',
    calculationFormula: '(Number of patients returning to ICU within 48h / Total ICU discharges) * 100',
    department: 'Intensive Care Unit (ICU)'
  },
  {
    id: 'qi_med_error',
    indicatorName: 'Medication Error Rate',
    targetBenchmark: '< 0.5%',
    calculationFormula: '(Number of medication errors / Total number of medication doses administered) * 100',
    department: 'Pharmacy / Nursing'
  }
];
