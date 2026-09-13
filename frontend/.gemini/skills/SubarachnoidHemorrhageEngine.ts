/**
 * SubarachnoidHemorrhageEngine.ts
 * Neurocritical Care & Neurosurgery Engine for Aneurysmal Subarachnoid Hemorrhage (aSAH).
 * Implements Hunt & Hess / WFNS Clinical Grading, Modified Fisher Radiographic Scale,
 * Transcranial Doppler (TCD) Lindegaard Ratio Vasospasm Kinetics, EVD Dynamics,
 * Delayed Cerebral Ischemia (DCI) Surveillance, and Euvolemic Induced Hypertension.
 * Location: frontend/.gemini/skills/SubarachnoidHemorrhageEngine.ts
 */

export type HuntHessGrade = 1 | 2 | 3 | 4 | 5;
export type ModifiedFisherGrade = 1 | 2 | 3 | 4;
export type AneurysmSecurityStatus = 'unsecured' | 'coiled' | 'clipped';

export interface PatientSahState {
  patientAge: number;
  dayPostBleed: number; // 1 to 21 (vasospasm peak days 4 to 14)
  huntHessGrade: HuntHessGrade;
  gcsScore: number; // 3 to 15
  modifiedFisherGrade: ModifiedFisherGrade;
  aneurysmStatus: AneurysmSecurityStatus;
  
  // Hemodynamics
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  meanArterialPressureMmHg: number;
  centralVenousPressureMmHg: number; // 6 - 8 target for euvolemia

  // Neurological & TCD
  newFocalDeficitPresent: boolean; // DCI clinical trigger
  mcaMeanFlowVelocityCmS: number; // TCD MCA Vmean (normal < 120 cm/s)
  eicaMeanFlowVelocityCmS: number; // TCD Extracranial ICA Vmean (normal 30-50 cm/s)

  // EVD & ICP
  evdPopOffHeightCmH2o: number; // 10 - 15 cmH2O typical
  intracranialPressureMmHg: number; // target < 20 mmHg
  csfDrainageRateMlHr: number; // normal ~ 10-20 mL/hr

  // Labs & Therapeutics
  serumSodiumMeqL: number; // 135 - 145 mEq/L
  oralNimodipineActive: boolean; // 60mg q4h
  inducedHypertensionActive: boolean; // Norepinephrine / phenylephrine titration
}

export interface TcdVasospasmAudit {
  lindegaardRatio: number;
  vasospasmSeverity: 'Normal' | 'Hyperemia (Non-Spasm)' | 'Mild Vasospasm' | 'Moderate Vasospasm' | 'Severe Vasospasm';
  isAngiographicSpasmLikely: boolean;
  findings: string[];
  recommendation: string;
}

export interface DciRiskReport {
  overallDciRiskPercent: number;
  modifiedFisherDescription: string;
  isPeakVasospasmWindow: boolean;
  dciSuspected: boolean;
  clinicalSigns: string[];
  managementDirectives: string[];
}

export interface EvdSafetyAudit {
  isOverdraining: boolean;
  isUnderdrainingOrClogged: boolean;
  cerebralPerfusionPressureMmHg: number;
  safetyAlerts: string[];
}

export interface SahScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientSahState;
  clinicalPearls: string[];
}

/**
 * 1. Calculate Transcranial Doppler (TCD) Lindegaard Ratio & Vasospasm Grade
 * Lindegaard Ratio (LR) = MCA Vmean / Extracranial ICA Vmean
 */
export function calculateTcdVasospasm(state: PatientSahState): TcdVasospasmAudit {
  const { mcaMeanFlowVelocityCmS: mca, eicaMeanFlowVelocityCmS: eica } = state;
  const effectiveEica = Math.max(10, eica);
  const lindegaardRatio = parseFloat((mca / effectiveEica).toFixed(2));

  const findings: string[] = [];
  let vasospasmSeverity: TcdVasospasmAudit['vasospasmSeverity'] = 'Normal';
  let isAngiographicSpasmLikely = false;
  let recommendation = 'Continue routine daily TCD surveillance through Day 14.';

  if (mca < 120 && lindegaardRatio < 3.0) {
    vasospasmSeverity = 'Normal';
    findings.push(`Normal MCA velocity (${mca} cm/s < 120) and normal Lindegaard Ratio (${lindegaardRatio} < 3.0).`);
  } else if (mca >= 120 && lindegaardRatio < 3.0) {
    vasospasmSeverity = 'Hyperemia (Non-Spasm)';
    findings.push(
      `Elevated MCA velocity (${mca} cm/s) with LOW Lindegaard Ratio (${lindegaardRatio} < 3.0) confirms HYPEREMIA (high cardiac output or vasodilation), NOT true arterial vasospasm.`
    );
    recommendation = 'Avoid unnecessary spasmolytic treatments; monitor for hyperemic cerebral edema.';
  } else if (mca >= 200 || lindegaardRatio >= 6.0) {
    vasospasmSeverity = 'Severe Vasospasm';
    isAngiographicSpasmLikely = true;
    findings.push(`Critical MCA velocity (${mca} cm/s >= 200) or Lindegaard Ratio (${lindegaardRatio} >= 6.0): Severe mechanical vasospasm.`);
    recommendation =
      'Immediate intervention mandatory: optimize euvolemic induced hypertension. If neurological deficit persists, initiate emergent endovascular rescue (intra-arterial verapamil / nicardipine or balloon angioplasty).';
  } else if (mca >= 140 || lindegaardRatio >= 4.5) {
    vasospasmSeverity = 'Moderate Vasospasm';
    isAngiographicSpasmLikely = true;
    findings.push(`Moderate vasospasm: MCA velocity ${mca} cm/s with Lindegaard Ratio ${lindegaardRatio} (4.5 - 6.0).`);
    recommendation = 'Escalate neurological monitoring; prepare for induced hypertension if clinical DCI manifests.';
  } else {
    vasospasmSeverity = 'Mild Vasospasm';
    findings.push(`Mild vasospasm: MCA velocity ${mca} cm/s (120-140) with Lindegaard Ratio ${lindegaardRatio} (3.0 - 4.5).`);
    recommendation = 'Ensure strict euvolemia and oral nimodipine maintenance; repeat TCD in 12 hours.';
  }

  return {
    lindegaardRatio,
    vasospasmSeverity,
    isAngiographicSpasmLikely,
    findings,
    recommendation,
  };
}

/**
 * 2. Assess Delayed Cerebral Ischemia (DCI) & Modified Fisher Risk
 */
export function evaluateDciRisk(state: PatientSahState): DciRiskReport {
  const { dayPostBleed, modifiedFisherGrade, newFocalDeficitPresent, oralNimodipineActive, inducedHypertensionActive, aneurysmStatus } = state;
  const isPeakVasospasmWindow = dayPostBleed >= 4 && dayPostBleed <= 14;

  let baseRisk = 24;
  let modifiedFisherDescription = 'Grade 1: Focal or diffuse thin SAH (<1mm), no IVH (DCI risk ~24%)';
  if (modifiedFisherGrade === 2) {
    baseRisk = 33;
    modifiedFisherDescription = 'Grade 2: Thin SAH (<1mm) with bilateral Intraventricular Hemorrhage (IVH) (DCI risk ~33%)';
  } else if (modifiedFisherGrade === 3) {
    baseRisk = 33;
    modifiedFisherDescription = 'Grade 3: Thick SAH (>=1mm in basal cisterns), no IVH (DCI risk ~33%)';
  } else if (modifiedFisherGrade === 4) {
    baseRisk = 44;
    modifiedFisherDescription = 'Grade 4: Thick SAH (>=1mm) with bilateral Intraventricular Hemorrhage (IVH) (Highest DCI risk ~44%)';
  }

  if (isPeakVasospasmWindow) baseRisk += 10;
  if (!oralNimodipineActive) baseRisk += 12; // Failure to administer nimodipine increases poor outcome

  const overallDciRiskPercent = Math.min(85, Math.round(baseRisk));
  const dciSuspected = newFocalDeficitPresent || (state.gcsScore <= 12 && isPeakVasospasmWindow);

  const clinicalSigns: string[] = [];
  const managementDirectives: string[] = [];

  if (isPeakVasospasmWindow) {
    clinicalSigns.push(`Patient is on Bleed Day ${dayPostBleed} (Peak Vasospasm Window: Days 4 - 14).`);
  }

  if (newFocalDeficitPresent) {
    clinicalSigns.push('New focal neurological deficit (e.g. speech arrest, hemiparesis) detected — Clinical DCI defined.');
  }

  if (!oralNimodipineActive) {
    managementDirectives.push('MANDATORY: Administer Oral Nimodipine 60 mg q4h (AHA/ASA Class I, Level A). Prevents microvascular spasm and neuronal injury.');
  }

  if (dciSuspected) {
    if (aneurysmStatus === 'unsecured') {
      managementDirectives.push('WARNING: Aneurysm is UNSECURED. Induced hypertension is contraindicated (high re-bleeding risk). Expedite urgent surgical clipping or endovascular coiling.');
    } else {
      managementDirectives.push('Aneurysm SECURED: Titrate IV Norepinephrine to induce therapeutic hypertension (SBP 160-180 mmHg) to force collateral blood flow through spastic vessels.');
    }
  }

  managementDirectives.push('Maintain strict EUVOLEMIA (CVP 6-8 mmHg, isotonic crystalloids). The obsolete "Triple-H" hypervolemic hemodilution is abandoned due to cardiopulmonary complications.');

  return {
    overallDciRiskPercent,
    modifiedFisherDescription,
    isPeakVasospasmWindow,
    dciSuspected,
    clinicalSigns,
    managementDirectives,
  };
}

/**
 * 3. External Ventricular Drain (EVD) & Intracranial Pressure Audit
 */
export function auditEvdSafety(state: PatientSahState): EvdSafetyAudit {
  const { evdPopOffHeightCmH2o, intracranialPressureMmHg: icp, csfDrainageRateMlHr: csfRate, meanArterialPressureMmHg: map } = state;
  const cerebralPerfusionPressureMmHg = Math.max(0, map - icp);

  const isOverdraining = csfRate > 25 || evdPopOffHeightCmH2o < 5;
  const isUnderdrainingOrClogged = csfRate < 2 && icp > 20;

  const safetyAlerts: string[] = [];
  if (isOverdraining) {
    safetyAlerts.push('CRITICAL OVERDRAINAGE: CSF output > 25 mL/hr or pop-off height < 5 cmH2O risks ventricular collapse (slit ventricles) and acute subdural hematoma.');
  }

  if (isUnderdrainingOrClogged) {
    safetyAlerts.push('EVD CLOGGED / UNDERDRAINING: Elevated ICP (> 20 mmHg) with absent CSF drainage indicates catheter occlusion or blood clot. Flush or level check indicated.');
  }

  if (cerebralPerfusionPressureMmHg < 60) {
    safetyAlerts.push(`Inadequate CPP (${cerebralPerfusionPressureMmHg} mmHg < 60): Secondary cerebral ischemia threat.`);
  }

  return {
    isOverdraining,
    isUnderdrainingOrClogged,
    cerebralPerfusionPressureMmHg,
    safetyAlerts,
  };
}

/**
 * 4. Standard Clinical Scenarios Catalog
 */
export const SAH_SCENARIOS: Record<string, SahScenario> = {
  peak_vasospasm_dci: {
    id: 'peak_vasospasm_dci',
    name: '1. Day 7 aSAH with Severe Vasospasm & New Left Hemiparesis (DCI)',
    patientSummary:
      '54yo female, Day 7 post-ACom aneurysm coiling. Sudden onset left facial droop and arm drift. TCD shows right MCA Vmean 220 cm/s, eICA 32 cm/s (Lindegaard Ratio 6.88). Modified Fisher 4.',
    initialState: {
      patientAge: 54,
      dayPostBleed: 7,
      huntHessGrade: 3,
      gcsScore: 13,
      modifiedFisherGrade: 4,
      aneurysmStatus: 'coiled',
      systolicBpMmHg: 135,
      diastolicBpMmHg: 75,
      meanArterialPressureMmHg: 95,
      centralVenousPressureMmHg: 7,
      newFocalDeficitPresent: true,
      mcaMeanFlowVelocityCmS: 220,
      eicaMeanFlowVelocityCmS: 32,
      evdPopOffHeightCmH2o: 10,
      intracranialPressureMmHg: 14,
      csfDrainageRateMlHr: 12,
      serumSodiumMeqL: 138,
      oralNimodipineActive: true,
      inducedHypertensionActive: false,
    },
    clinicalPearls: [
      'Lindegaard Ratio is 220 / 32 = 6.88 (> 6.0 defines Severe Vasospasm).',
      'The aneurysm is secured by coiling; immediate euvolemic induced hypertension with Norepinephrine is indicated to target SBP 160-180 mmHg.',
      'Oral Nimodipine 60 mg q4h must be continued for the full 21-day course to improve functional outcome.',
    ],
  },
  hyperemia_pseudo_spasm: {
    id: 'hyperemia_pseudo_spasm',
    name: '2. Day 5 aSAH with High Flow Velocity but Low Lindegaard Ratio (Hyperemia)',
    patientSummary:
      '48yo male post-PICA clipping. TCD demonstrates elevated MCA velocity of 160 cm/s, but extracranial ICA is 65 cm/s (Lindegaard Ratio 2.46). Patient is neurologically intact.',
    initialState: {
      patientAge: 48,
      dayPostBleed: 5,
      huntHessGrade: 2,
      gcsScore: 15,
      modifiedFisherGrade: 2,
      aneurysmStatus: 'clipped',
      systolicBpMmHg: 142,
      diastolicBpMmHg: 82,
      meanArterialPressureMmHg: 102,
      centralVenousPressureMmHg: 8,
      newFocalDeficitPresent: false,
      mcaMeanFlowVelocityCmS: 160,
      eicaMeanFlowVelocityCmS: 65,
      evdPopOffHeightCmH2o: 12,
      intracranialPressureMmHg: 11,
      csfDrainageRateMlHr: 10,
      serumSodiumMeqL: 140,
      oralNimodipineActive: true,
      inducedHypertensionActive: false,
    },
    clinicalPearls: [
      'Lindegaard Ratio is 160 / 65 = 2.46 (< 3.0). High flow is due to systemic hyperemia, not mechanical arterial constriction.',
      'Avoid inappropriate vasopressor escalation or invasive angioplasty in asymptomatic hyperemia.',
      'Maintain euvolemia and continue serial daily TCD surveillance.',
    ],
  },
  unsecured_aneurysm_early: {
    id: 'unsecured_aneurysm_early',
    name: '3. Day 1 Acute Ruptured MCA Aneurysm (Unsecured, High Rebleed Risk)',
    patientSummary:
      '61yo female presenting 6 hours post-"worst headache of life". Hunt & Hess 4, GCS 10, Modified Fisher 3. SBP 175/105. Aneurysm is UNSECURED awaiting OR clipping.',
    initialState: {
      patientAge: 61,
      dayPostBleed: 1,
      huntHessGrade: 4,
      gcsScore: 10,
      modifiedFisherGrade: 3,
      aneurysmStatus: 'unsecured',
      systolicBpMmHg: 175,
      diastolicBpMmHg: 105,
      meanArterialPressureMmHg: 128,
      centralVenousPressureMmHg: 6,
      newFocalDeficitPresent: false,
      mcaMeanFlowVelocityCmS: 85,
      eicaMeanFlowVelocityCmS: 35,
      evdPopOffHeightCmH2o: 15,
      intracranialPressureMmHg: 22,
      csfDrainageRateMlHr: 18,
      serumSodiumMeqL: 139,
      oralNimodipineActive: true,
      inducedHypertensionActive: false,
    },
    clinicalPearls: [
      'Unsecured aneurysms carry a 4-13% rebleeding risk in the first 24 hours (with 70% mortality).',
      'Target SBP < 140-160 mmHg using IV Nicardipine until the aneurysm is definitively secured by clipping or coiling.',
      'Induced hypertension is strictly prohibited while the aneurysm remains unsecured.',
    ],
  },
  cerebral_salt_wasting_hyponatremia: {
    id: 'cerebral_salt_wasting_hyponatremia',
    name: '4. Day 8 aSAH with Cerebral Salt Wasting (CSW) & Hyponatremia',
    patientSummary:
      '50yo male, Day 8 post-coiling. Lethargic, urine output 250 mL/hr, Serum Sodium 127 mEq/L, CVP 4 mmHg (hypovolemic). Severe vasospasm risk heightened by volume contraction.',
    initialState: {
      patientAge: 50,
      dayPostBleed: 8,
      huntHessGrade: 3,
      gcsScore: 12,
      modifiedFisherGrade: 4,
      aneurysmStatus: 'coiled',
      systolicBpMmHg: 110,
      diastolicBpMmHg: 68,
      meanArterialPressureMmHg: 82,
      centralVenousPressureMmHg: 4,
      newFocalDeficitPresent: false,
      mcaMeanFlowVelocityCmS: 185,
      eicaMeanFlowVelocityCmS: 34,
      evdPopOffHeightCmH2o: 10,
      intracranialPressureMmHg: 13,
      csfDrainageRateMlHr: 14,
      serumSodiumMeqL: 127,
      oralNimodipineActive: true,
      inducedHypertensionActive: false,
    },
    clinicalPearls: [
      'Cerebral Salt Wasting (CSW) causes true hypovolemia with hyponatremia due to renal sodium excretion.',
      'FATAL PITFALL: Never fluid restrict SAH patients! Fluid restriction precipitates acute vasospasm and stroke.',
      'Treat with volume expansion using 0.9% or 3% hypertonic saline and oral fludrocortisone to restore euvolemia (CVP 6-8 mmHg) and normalize sodium.',
    ],
  },
};
