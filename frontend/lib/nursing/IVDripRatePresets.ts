export type DropFactor = 10 | 15 | 20 | 60;

export function calculateIVDripRate(volumeMl: number, timeMinutes: number, dropFactor: DropFactor): { gttPerMin: number; mlPerHour: number } {
  return {
    gttPerMin: Math.round((volumeMl * dropFactor) / timeMinutes),
    mlPerHour: Number(((volumeMl / timeMinutes) * 60).toFixed(2))
  };
}

export interface VasoactiveDrug {
  id: string;
  name: string;
  standardConcentrationMg: number;
  standardVolumeMl: number;
  doseUnit: 'mcg/kg/min' | 'mcg/min' | 'mg/h';
  minDose: number;
  maxDose: number;
  defaultDose: number;
  indication: string;
  titrationGuidance: string;
}

export const VASOACTIVE_DRUGS: VasoactiveDrug[] = [
  { id: 'norepi', name: 'Norepinephrine', standardConcentrationMg: 4, standardVolumeMl: 250, doseUnit: 'mcg/kg/min', minDose: 0.01, maxDose: 3, defaultDose: 0.05, indication: 'Shock, severe hypotension', titrationGuidance: 'Titrate by 0.01-0.05 mcg/kg/min every 5-10 mins' },
  { id: 'epi', name: 'Epinephrine', standardConcentrationMg: 4, standardVolumeMl: 250, doseUnit: 'mcg/kg/min', minDose: 0.01, maxDose: 1, defaultDose: 0.05, indication: 'Anaphylaxis, cardiac arrest, shock', titrationGuidance: 'Titrate by 0.01 mcg/kg/min every 5-10 mins' },
  { id: 'dopa', name: 'Dopamine', standardConcentrationMg: 400, standardVolumeMl: 250, doseUnit: 'mcg/kg/min', minDose: 2, maxDose: 20, defaultDose: 5, indication: 'Hypotension, symptomatic bradycardia', titrationGuidance: 'Titrate by 1-2 mcg/kg/min every 10 mins' },
  { id: 'dobut', name: 'Dobutamine', standardConcentrationMg: 250, standardVolumeMl: 250, doseUnit: 'mcg/kg/min', minDose: 2, maxDose: 20, defaultDose: 5, indication: 'Decreased cardiac output, heart failure', titrationGuidance: 'Titrate by 1-2.5 mcg/kg/min every 10 mins' },
  { id: 'ntg', name: 'Nitroglycerin', standardConcentrationMg: 50, standardVolumeMl: 250, doseUnit: 'mcg/min', minDose: 5, maxDose: 200, defaultDose: 10, indication: 'Angina, heart failure, hypertension', titrationGuidance: 'Titrate by 5 mcg/min every 3-5 mins' },
  { id: 'ntp', name: 'Nitroprusside', standardConcentrationMg: 50, standardVolumeMl: 250, doseUnit: 'mcg/kg/min', minDose: 0.3, maxDose: 10, defaultDose: 0.5, indication: 'Hypertensive crisis, acute heart failure', titrationGuidance: 'Titrate by 0.5 mcg/kg/min every 5 mins' },
  { id: 'vaso', name: 'Vasopressin', standardConcentrationMg: 20, standardVolumeMl: 100, doseUnit: 'mcg/min', minDose: 0.01, maxDose: 0.04, defaultDose: 0.03, indication: 'Vasodilatory shock, GI bleeding', titrationGuidance: 'Fixed dose in sepsis' }
];

export function calculateVasoactiveInfusionRate(drug: VasoactiveDrug, targetDose: number, patientWeightKg: number, concentrationMg: number, volumeMl: number): { mlPerHour: number; actualDose: number } {
  let rate = 0;
  const concentrationMcgPerMl = (concentrationMg * 1000) / volumeMl;

  if (drug.doseUnit === 'mcg/kg/min') {
    rate = (targetDose * patientWeightKg * 60) / concentrationMcgPerMl;
  } else if (drug.doseUnit === 'mcg/min') {
    rate = (targetDose * 60) / concentrationMcgPerMl;
  } else if (drug.doseUnit === 'mg/h') {
    const concentrationMgPerMl = concentrationMg / volumeMl;
    rate = targetDose / concentrationMgPerMl;
  }

  return { mlPerHour: Number(rate.toFixed(2)), actualDose: targetDose };
}

export const STANDARD_IV_FLUID_PRESETS: Array<{ id: string; name: string; volumeMl: number; durationHours: number; standardDropFactor: DropFactor; clinicalIndication: string }> = [
  { id: 'ns', name: 'Normal Saline', volumeMl: 1000, durationHours: 8, standardDropFactor: 15, clinicalIndication: 'Fluid resuscitation, maintenance' },
  { id: 'lr', name: 'Ringer Lactate', volumeMl: 1000, durationHours: 6, standardDropFactor: 20, clinicalIndication: 'Surgery, burns, fluid loss' },
  { id: 'd5w', name: 'D5W', volumeMl: 500, durationHours: 4, standardDropFactor: 15, clinicalIndication: 'Hypernatremia, hydration' },
  { id: 'ped_maint', name: 'Pediatric Maintenance', volumeMl: 500, durationHours: 24, standardDropFactor: 60, clinicalIndication: 'Pediatric fluid maintenance' }
];
