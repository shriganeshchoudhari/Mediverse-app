export type PKRoute = 'iv_bolus' | 'iv_infusion' | 'oral';
export type PKModel = 'one_compartment' | 'two_compartment';

export interface PKParameters {
  dose: number; // mg
  clearance: number; // L/h
  volumeOfDistribution: number; // L
  absorptionRateKa: number; // 1/h
  bioavailabilityF: number; // 0-1
  infusionRateR0?: number; // mg/h
  infusionDuration?: number; // h
  eliminationRateKe: number; // 1/h
  halfLifeHours: number; // h
}

export function calculateOneCompConcentration(params: PKParameters, timeHours: number, route: PKRoute): number {
  const { dose, clearance, volumeOfDistribution, absorptionRateKa, bioavailabilityF, infusionRateR0, infusionDuration, eliminationRateKe } = params;
  
  if (route === 'iv_bolus') {
    return (dose / volumeOfDistribution) * Math.exp(-eliminationRateKe * timeHours);
  } else if (route === 'iv_infusion') {
    if (!infusionRateR0 || !infusionDuration) return 0;
    if (timeHours <= infusionDuration) {
      return (infusionRateR0 / clearance) * (1 - Math.exp(-eliminationRateKe * timeHours));
    } else {
      const cInfEnd = (infusionRateR0 / clearance) * (1 - Math.exp(-eliminationRateKe * infusionDuration));
      return cInfEnd * Math.exp(-eliminationRateKe * (timeHours - infusionDuration));
    }
  } else if (route === 'oral') {
    if (absorptionRateKa === eliminationRateKe) return 0; // Avoid division by zero
    return (bioavailabilityF * dose * absorptionRateKa) / (volumeOfDistribution * (absorptionRateKa - eliminationRateKe)) * (Math.exp(-eliminationRateKe * timeHours) - Math.exp(-absorptionRateKa * timeHours));
  }
  return 0;
}

export function calculateMultiDoseProfile(params: PKParameters, intervalHours: number, dosesCount: number, route: PKRoute): Array<{ time: number; concentration: number }> {
  const profile: Array<{ time: number; concentration: number }> = [];
  const resolution = 0.5; // half-hour increments
  const totalTime = intervalHours * dosesCount;
  
  for (let t = 0; t <= totalTime; t += resolution) {
    let totalC = 0;
    for (let d = 0; d < dosesCount; d++) {
      const doseTime = d * intervalHours;
      if (t >= doseTime) {
        totalC += calculateOneCompConcentration(params, t - doseTime, route);
      }
    }
    profile.push({ time: t, concentration: totalC });
  }
  return profile;
}

export function calculatePKSteadyState(dose: number, cl: number, vd: number, intervalTau: number, f: number): { cMaxSS: number; cMinSS: number; cAvgSS: number; aucTau: number; accumulationFactor: number } {
  const ke = cl / vd;
  const cMaxSingle = (f * dose) / vd;
  const accumulationFactor = 1 / (1 - Math.exp(-ke * intervalTau));
  const cMaxSS = cMaxSingle * accumulationFactor;
  const cMinSS = cMaxSS * Math.exp(-ke * intervalTau);
  const aucTau = (f * dose) / cl;
  const cAvgSS = aucTau / intervalTau;
  
  return { cMaxSS, cMinSS, cAvgSS, aucTau, accumulationFactor };
}

export const STANDARD_PK_DRUG_PRESETS = [
  { id: 'vancomycin', name: 'Vancomycin', standardDoseMg: 1000, clearanceLh: 4.5, vdLitres: 50, halfLifeH: 6, kaHour: 0, fPercent: 0, mecUgMl: 10, mtcUgMl: 20 },
  { id: 'gentamicin', name: 'Gentamicin', standardDoseMg: 120, clearanceLh: 6.0, vdLitres: 18, halfLifeH: 2.5, kaHour: 0, fPercent: 0, mecUgMl: 4, mtcUgMl: 10 },
  { id: 'theophylline', name: 'Theophylline', standardDoseMg: 300, clearanceLh: 2.8, vdLitres: 35, halfLifeH: 8, kaHour: 1.5, fPercent: 100, mecUgMl: 10, mtcUgMl: 20 },
  { id: 'digoxin', name: 'Digoxin', standardDoseMg: 0.25, clearanceLh: 6.5, vdLitres: 500, halfLifeH: 36, kaHour: 2.0, fPercent: 75, mecUgMl: 0.8, mtcUgMl: 2.0 },
  { id: 'phenytoin', name: 'Phenytoin', standardDoseMg: 300, clearanceLh: 2.0, vdLitres: 45, halfLifeH: 22, kaHour: 0.8, fPercent: 90, mecUgMl: 10, mtcUgMl: 20 },
  { id: 'metoprolol', name: 'Metoprolol', standardDoseMg: 50, clearanceLh: 60, vdLitres: 300, halfLifeH: 3.5, kaHour: 2.5, fPercent: 50, mecUgMl: 0.05, mtcUgMl: 0.5 },
  { id: 'ciprofloxacin', name: 'Ciprofloxacin', standardDoseMg: 500, clearanceLh: 30, vdLitres: 150, halfLifeH: 4, kaHour: 1.8, fPercent: 70, mecUgMl: 1.5, mtcUgMl: 5.0 }
];
