/**
 * ClinicalCalculatorSkills.ts
 * Validated Medical & Clinical Dosage Calculators Suite
 * Part of Mediverse Frontend Skills
 */

export interface GcsResult {
  totalScore: number;
  category: 'SEVERE' | 'MODERATE' | 'MILD';
  interpretation: string;
}

export interface ParklandResult {
  totalFluidMl24h: number;
  first8HoursMl: number;
  next16HoursMl: number;
  hourlyRateFirst8h: number;
  hourlyRateNext16h: number;
}

export interface CockcroftGaultResult {
  crClMlMin: number;
  dosageAdjustmentCategory: 'NORMAL' | 'MILD_IMPAIRMENT' | 'MODERATE_IMPAIRMENT' | 'SEVERE_IMPAIRMENT';
  clinicalGuidance: string;
}

export interface Curb65Result {
  score: number;
  riskTier: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  recommendedDisposition: string;
  thirtyDayMortalityPercent: number;
}

export interface PediatricDoseResult {
  totalDailyDoseMg: number;
  dosePerAdministrationMg: number;
  liquidVolumeMlPerDose: number;
  warningAlert?: string;
}

export const ClinicalCalculators = {
  /**
   * Glasgow Coma Scale (GCS)
   * Eye: 1-4, Verbal: 1-5, Motor: 1-6
   */
  calculateGcs(eye: number, verbal: number, motor: number): GcsResult {
    const total = eye + verbal + motor;
    let category: GcsResult['category'] = 'MILD';
    let interpretation = 'Mild or no neurological impairment.';

    if (total <= 8) {
      category = 'SEVERE';
      interpretation = 'Severe head injury / Coma. GCS <= 8: Strongly consider endotracheal intubation.';
    } else if (total <= 12) {
      category = 'MODERATE';
      interpretation = 'Moderate head injury. Requires urgent non-contrast CT head and neurosurgical observation.';
    }

    return { totalScore: total, category, interpretation };
  },

  /**
   * Parkland Formula for Burn Fluid Resuscitation
   * 4 mL * Weight (kg) * % TBSA (2nd and 3rd degree burns)
   */
  calculateParkland(weightKg: number, percentTbsa: number): ParklandResult {
    const totalFluidMl24h = Math.round(4 * weightKg * percentTbsa);
    const first8HoursMl = Math.round(totalFluidMl24h / 2);
    const next16HoursMl = Math.round(totalFluidMl24h / 2);

    return {
      totalFluidMl24h,
      first8HoursMl,
      next16HoursMl,
      hourlyRateFirst8h: Math.round(first8HoursMl / 8),
      hourlyRateNext16h: Math.round(next16HoursMl / 16),
    };
  },

  /**
   * Cockcroft-Gault Equation for Estimated Creatinine Clearance (CrCl)
   * CrCl = ((140 - Age) * Weight(kg)) / (72 * SerumCr(mg/dL)) * (0.85 if female)
   */
  calculateCockcroftGault(age: number, weightKg: number, serumCrMgDl: number, isFemale: boolean): CockcroftGaultResult {
    if (serumCrMgDl <= 0) return { crClMlMin: 0, dosageAdjustmentCategory: 'SEVERE_IMPAIRMENT', clinicalGuidance: 'Invalid serum creatinine' };

    let crCl = ((140 - age) * weightKg) / (72 * serumCrMgDl);
    if (isFemale) crCl *= 0.85;
    crCl = Math.round(crCl * 10) / 10;

    let dosageAdjustmentCategory: CockcroftGaultResult['dosageAdjustmentCategory'] = 'NORMAL';
    let clinicalGuidance = 'Normal renal elimination. Standard medication dosing.';

    if (crCl < 15) {
      dosageAdjustmentCategory = 'SEVERE_IMPAIRMENT';
      clinicalGuidance = 'End-Stage Renal Disease (ESRD). Severe dose reduction or alternate non-renally cleared agents required.';
    } else if (crCl < 30) {
      dosageAdjustmentCategory = 'SEVERE_IMPAIRMENT';
      clinicalGuidance = 'Severe renal impairment. Dose reduction by 50-75% or extended dosing intervals.';
    } else if (crCl < 60) {
      dosageAdjustmentCategory = 'MODERATE_IMPAIRMENT';
      clinicalGuidance = 'Moderate renal impairment. Monitor drug trough concentrations (e.g. Vancomycin, Aminoglycosides).';
    } else if (crCl < 90) {
      dosageAdjustmentCategory = 'MILD_IMPAIRMENT';
      clinicalGuidance = 'Mild renal impairment. Minor adjustments for narrow therapeutic index drugs.';
    }

    return { crClMlMin: crCl, dosageAdjustmentCategory, clinicalGuidance };
  },

  /**
   * CURB-65 Pneumonia Severity Score
   */
  calculateCurb65(confusion: boolean, bunGreaterThan19: boolean, rrGte30: boolean, sbpLt90OrDbpLte60: boolean, ageGte65: boolean): Curb65Result {
    let score = 0;
    if (confusion) score++;
    if (bunGreaterThan19) score++;
    if (rrGte30) score++;
    if (sbpLt90OrDbpLte60) score++;
    if (ageGte65) score++;

    if (score <= 1) {
      return { score, riskTier: 'LOW', recommendedDisposition: 'Outpatient management with oral antibiotics.', thirtyDayMortalityPercent: 1.5 };
    } else if (score === 2) {
      return { score, riskTier: 'INTERMEDIATE', recommendedDisposition: 'Short inpatient hospital admission or closely monitored outpatient treatment.', thirtyDayMortalityPercent: 9.2 };
    } else {
      return { score, riskTier: 'HIGH', recommendedDisposition: 'Urgent hospital admission; evaluate for ICU admission (especially if score >= 4).', thirtyDayMortalityPercent: 22.0 };
    }
  },

  /**
   * Pediatric Weight-Based Dosage Engine
   * mg/kg/day divided into frequency, checks against maximum single adult dose
   */
  calculatePediatricDose(
    weightKg: number,
    doseMgPerKgDay: number,
    dosesPerDay: number,
    liquidConcentrationMgPerMl: number,
    maxSingleDoseMg: number
  ): PediatricDoseResult {
    const totalDailyMg = Math.round(weightKg * doseMgPerKgDay * 10) / 10;
    let singleDoseMg = Math.round((totalDailyMg / dosesPerDay) * 10) / 10;
    let warningAlert: string | undefined;

    if (singleDoseMg > maxSingleDoseMg) {
      warningAlert = `Calculated single dose (${singleDoseMg}mg) exceeds maximum adult single dose (${maxSingleDoseMg}mg). Capped at ${maxSingleDoseMg}mg.`;
      singleDoseMg = maxSingleDoseMg;
    }

    const liquidVolumeMlPerDose = Math.round((singleDoseMg / liquidConcentrationMgPerMl) * 10) / 10;

    return {
      totalDailyDoseMg: totalDailyMg,
      dosePerAdministrationMg: singleDoseMg,
      liquidVolumeMlPerDose,
      warningAlert,
    };
  },
};
