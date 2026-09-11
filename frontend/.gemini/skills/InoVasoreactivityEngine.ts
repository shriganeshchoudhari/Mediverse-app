/**
 * InoVasoreactivityEngine.ts
 * Inhaled Nitric Oxide (iNO), Pulmonary Arterial Hypertension (PAH),
 * Acute Vasoreactivity Testing (AVT ESC/ERS Criteria), Rebound Vasoconstriction,
 * Methemoglobinemia & Nitrogen Dioxide (NO2) Kinetics Engine.
 * Location: frontend/.gemini/skills/InoVasoreactivityEngine.ts
 */

export type VasoreactivityAgent = 'INHALED_NITRIC_OXIDE' | 'IV_EPOPROSTENOL' | 'INHALED_ILOPROST' | 'IV_ADENOSINE';

export interface InoPatientInput {
  baselineMpapMmHg: number; // Baseline mean pulmonary arterial pressure (e.g. 20-80 mmHg)
  baselineCoLMin: number; // Baseline cardiac output (e.g. 2.5-8.0 L/min)
  baselinePcwpMmHg: number; // Pulmonary capillary wedge pressure (e.g. 6-18 mmHg)
  baselineMapMmHg: number; // Mean systemic arterial pressure (e.g. 70-110 mmHg)
  baselineCvpMmHg: number; // Central venous pressure (e.g. 4-16 mmHg)
  baselineSvo2Percent: number; // Mixed venous oxygen saturation (e.g. 45-75%)
  agent: VasoreactivityAgent;
  dosePpmOrMcg: number; // iNO dose in ppm (0 to 80 ppm) or other agent equivalent
  durationMinutes: number; // Exposure time in minutes (0 to 120 min)
  abruptWeaning: boolean; // Sudden discontinuation triggering rebound pulmonary hypertension
}

export interface VasoreactivityMetrics {
  currentMpapMmHg: number;
  deltaMpapMmHg: number;
  currentCoLMin: number;
  deltaCoLMin: number;
  baselinePvrWoodUnits: number;
  currentPvrWoodUnits: number;
  deltaPvrPercent: number;
  baselineSvrDynes: number;
  currentSvrDynes: number;
  deltaSvrPercent: number;
  selectivityIndex: number; // Pulmonary vs Systemic selectivity ratio
  isVasoreactivePositive: boolean; // ESC/ERS criteria: delta mPAP >= 10, absolute mPAP <= 40, CO stable/increased
  recommendedTherapy: 'ORAL_CALCIUM_CHANNEL_BLOCKERS' | 'TARGETED_PAH_DUAL_ORAL' | 'PAH_PROSTACYCLIN_INFUSION';
  methemoglobinPercent: number; // % MetHb in arterial blood (normal < 1-2%, toxic > 3-5%)
  nitrogenDioxidePpm: number; // NO2 circuit level (toxic if > 0.5-1.0 ppm)
  reboundHypertensionSeverity: 'NONE' | 'MODERATE' | 'SEVERE_LIFE_THREATENING';
  reboundMpapSpikeMmHg: number;
  clinicalAlerts: string[];
  diagnosticGuidance: string;
}

export const INO_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: InoPatientInput;
}[] = [
  {
    id: 'pah-idiopathic-responder',
    name: 'IPAH Vasoreactive Responder (Sitbon Positive)',
    badge: 'CCB Candidate (Positive AVT)',
    description: 'A 34-year-old female with idiopathic PAH (baseline mPAP 48 mmHg, CO 4.2 L/min). On 20 ppm iNO, mPAP drops to 36 mmHg (Δ -12 mmHg) with preserved CO. Meets ESC/ERS criteria for high-dose CCB trial.',
    input: {
      baselineMpapMmHg: 48,
      baselineCoLMin: 4.2,
      baselinePcwpMmHg: 10,
      baselineMapMmHg: 88,
      baselineCvpMmHg: 8,
      baselineSvo2Percent: 62,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 20,
      durationMinutes: 15,
      abruptWeaning: false,
    },
  },
  {
    id: 'pah-non-responder-fixed',
    name: 'Severe Fixed PAH Non-Responder',
    badge: 'Targeted Combo Therapy Required',
    description: 'A 56-year-old with severe vascular remodeling (baseline mPAP 58 mmHg, PVR 9.6 WU). On 40 ppm iNO, mPAP decreases by only 3 mmHg. Non-responder: CCBs contraindicated due to acute RV failure risk.',
    input: {
      baselineMpapMmHg: 58,
      baselineCoLMin: 3.4,
      baselinePcwpMmHg: 12,
      baselineMapMmHg: 82,
      baselineCvpMmHg: 12,
      baselineSvo2Percent: 54,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 40,
      durationMinutes: 20,
      abruptWeaning: false,
    },
  },
  {
    id: 'abrupt-weaning-rebound',
    name: 'Abrupt iNO Cessation & Rebound Crisis',
    badge: 'Acute RV Decompensation Alert',
    description: 'A post-cardiotomy patient on 40 ppm iNO who has the cylinder abruptly disconnected. Endogenous eNOS downregulation produces acute rebound pulmonary vasoconstriction (mPAP spikes +16 mmHg above baseline).',
    input: {
      baselineMpapMmHg: 44,
      baselineCoLMin: 4.0,
      baselinePcwpMmHg: 10,
      baselineMapMmHg: 80,
      baselineCvpMmHg: 10,
      baselineSvo2Percent: 58,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 40,
      durationMinutes: 60,
      abruptWeaning: true,
    },
  },
  {
    id: 'high-dose-methb-toxicity',
    name: 'Prolonged High-Dose iNO (MetHb & NO2 Toxicity)',
    badge: 'Methemoglobinemia Toxic Alert',
    description: 'Prolonged 80 ppm iNO delivery for ARDS refractory hypoxemia. Hemoglobin oxidation yields MetHb of 6.2% and circuit NO2 reaches 1.4 ppm. Requires immediate dose de-escalation and methylene blue evaluation.',
    input: {
      baselineMpapMmHg: 42,
      baselineCoLMin: 4.8,
      baselinePcwpMmHg: 11,
      baselineMapMmHg: 84,
      baselineCvpMmHg: 9,
      baselineSvo2Percent: 65,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 80,
      durationMinutes: 90,
      abruptWeaning: false,
    },
  },
  {
    id: 'iv-epoprostenol-systemic-steal',
    name: 'IV Epoprostenol Systemic Vasodilation',
    badge: 'Systemic Hypotension Comparison',
    description: 'Systemic intravenous prostacyclin testing demonstrating both pulmonary and systemic vasodilation (MAP drop > 20%), highlighting contrast with alveoli-selective inhaled NO.',
    input: {
      baselineMpapMmHg: 50,
      baselineCoLMin: 4.0,
      baselinePcwpMmHg: 10,
      baselineMapMmHg: 90,
      baselineCvpMmHg: 8,
      baselineSvo2Percent: 60,
      agent: 'IV_EPOPROSTENOL',
      dosePpmOrMcg: 10,
      durationMinutes: 15,
      abruptWeaning: false,
    },
  },
];

/**
 * Calculates Wood Units and dynes·s·cm⁻⁵ PVR and SVR
 */
export function calculateVascularResistance(
  pressureDropMmHg: number,
  cardiacOutputLMin: number
): { woodUnits: number; dynesSecCm5: number } {
  if (cardiacOutputLMin <= 0.1) return { woodUnits: 0, dynesSecCm5: 0 };
  const woodUnits = Math.round((pressureDropMmHg / cardiacOutputLMin) * 100) / 100;
  const dynesSecCm5 = Math.round(woodUnits * 80);
  return { woodUnits, dynesSecCm5 };
}

/**
 * Evaluates Acute Vasoreactivity Testing & iNO Biophysical Kinetics
 */
export function evaluateInoCase(input: InoPatientInput): VasoreactivityMetrics {
  const {
    baselineMpapMmHg,
    baselineCoLMin,
    baselinePcwpMmHg,
    baselineMapMmHg,
    baselineCvpMmHg,
    agent,
    dosePpmOrMcg,
    durationMinutes,
    abruptWeaning,
  } = input;

  // 1. Baseline Vascular Resistances
  const baselinePulmGrad = Math.max(1, baselineMpapMmHg - baselinePcwpMmHg);
  const baselinePvr = calculateVascularResistance(baselinePulmGrad, baselineCoLMin).woodUnits;

  const baselineSysGrad = Math.max(10, baselineMapMmHg - baselineCvpMmHg);
  const baselineSvr = calculateVascularResistance(baselineSysGrad, baselineCoLMin).dynesSecCm5;

  // 2. Pharmacodynamic Effect on Pulmonary Circulation
  // iNO has a steep dose-response between 5 and 20 ppm; beyond 20-40 ppm, effect plateaus
  let maxPulmonaryDropFraction = 0;
  let systemicDropFraction = 0;

  if (agent === 'INHALED_NITRIC_OXIDE') {
    // Highly selective to ventilated pulmonary vascular beds
    // Fractional drop in mPAP reaches ~25-35% at 20-40 ppm in responsive patients
    const normalizedDose = Math.min(dosePpmOrMcg, 80);
    // Sigmoidal Emax model: E = (Emax * dose) / (ED50 + dose)
    maxPulmonaryDropFraction = (0.32 * normalizedDose) / (6 + normalizedDose);
    // Negligible systemic effect due to instantaneous inactivation by oxyhemoglobin (half-life < 5-10 ms)
    systemicDropFraction = 0.01;
  } else if (agent === 'IV_EPOPROSTENOL') {
    // Potent pulmonary and systemic vasodilator
    const norm = Math.min(dosePpmOrMcg, 20);
    maxPulmonaryDropFraction = (0.28 * norm) / (5 + norm);
    systemicDropFraction = (0.22 * norm) / (5 + norm); // Significant systemic hypotension risk
  } else if (agent === 'INHALED_ILOPROST') {
    const norm = Math.min(dosePpmOrMcg, 20);
    maxPulmonaryDropFraction = (0.25 * norm) / (4 + norm);
    systemicDropFraction = 0.05;
  } else {
    // IV ADENOSINE
    const norm = Math.min(dosePpmOrMcg, 200);
    maxPulmonaryDropFraction = (0.26 * norm) / (50 + norm);
    systemicDropFraction = 0.18;
  }

  // Check if baseline mPAP allows responsiveness (severely remodeled vessels respond less)
  let actualMpapDrop = baselineMpapMmHg * maxPulmonaryDropFraction;
  let currentCo = baselineCoLMin;

  // Cardiac output effect: afterload reduction on RV often enhances CO by 5-20%
  const coEnhancement = baselineCoLMin * (maxPulmonaryDropFraction * 0.4);
  currentCo = Math.round((baselineCoLMin + coEnhancement) * 100) / 100;

  // Rebound Pulmonary Hypertension Model
  let reboundSpike = 0;
  let reboundSeverity: VasoreactivityMetrics['reboundHypertensionSeverity'] = 'NONE';

  if (abruptWeaning && agent === 'INHALED_NITRIC_OXIDE' && dosePpmOrMcg > 0) {
    // Abrupt cessation causes acute vasoconstrictor rebound above baseline
    reboundSpike = Math.round((dosePpmOrMcg / 20) * 8 + (durationMinutes / 30) * 3);
    reboundSpike = Math.min(22, Math.max(6, reboundSpike));
    reboundSeverity = reboundSpike >= 12 ? 'SEVERE_LIFE_THREATENING' : 'MODERATE';
    actualMpapDrop = -reboundSpike; // mPAP actually increases above baseline!
    currentCo = Math.max(1.8, Math.round((baselineCoLMin - (reboundSpike / 15)) * 100) / 100);
  }

  const currentMpap = Math.round((baselineMpapMmHg - actualMpapDrop) * 10) / 10;
  const deltaMpap = Math.round((currentMpap - baselineMpapMmHg) * 10) / 10;
  const deltaCo = Math.round((currentCo - baselineCoLMin) * 100) / 100;

  // Current PVR
  const currentPulmGrad = Math.max(1, currentMpap - baselinePcwpMmHg);
  const currentPvr = calculateVascularResistance(currentPulmGrad, currentCo).woodUnits;
  const deltaPvrPct = baselinePvr > 0 ? Math.round(((currentPvr - baselinePvr) / baselinePvr) * 1000) / 10 : 0;

  // Current SVR
  const currentMap = Math.round((baselineMapMmHg * (1 - systemicDropFraction)) * 10) / 10;
  const currentSysGrad = Math.max(10, currentMap - baselineCvpMmHg);
  const currentSvr = calculateVascularResistance(currentSysGrad, currentCo).dynesSecCm5;
  const deltaSvrPct = baselineSvr > 0 ? Math.round(((currentSvr - baselineSvr) / baselineSvr) * 1000) / 10 : 0;

  // Selectivity Index: Pulmonary Vasodilation % / Systemic Vasodilation %
  const selectivity = deltaSvrPct !== 0 ? Math.round(Math.abs(deltaPvrPct / deltaSvrPct) * 10) / 10 : 99.9;

  // 3. ESC/ERS Acute Vasoreactivity Testing Criteria (Sitbon / Barst Criteria)
  // Positive test requires:
  // 1. Reduction in mPAP >= 10 mmHg
  // 2. To reach an absolute mPAP <= 40 mmHg
  // 3. With an increased or unchanged cardiac output (delta CO >= 0)
  const isVasoreactive = deltaMpap <= -10 && currentMpap <= 40 && deltaCo >= -0.05;

  let recommendedTherapy: VasoreactivityMetrics['recommendedTherapy'] = 'TARGETED_PAH_DUAL_ORAL';
  if (isVasoreactive) {
    recommendedTherapy = 'ORAL_CALCIUM_CHANNEL_BLOCKERS';
  } else if (baselinePvr >= 8 || currentMpap >= 50) {
    recommendedTherapy = 'PAH_PROSTACYCLIN_INFUSION';
  }

  // 4. Toxic Byproduct Kinetics (Methemoglobin & Nitrogen Dioxide)
  // Normal baseline MetHb ~ 0.5 - 1.0%
  // MetHb accumulates with higher ppm and longer duration:
  // Rate ~ (dose / 40) * (duration / 60) * 1.8%
  let metHb = 0.8;
  if (agent === 'INHALED_NITRIC_OXIDE') {
    metHb += (dosePpmOrMcg / 40) * (Math.min(durationMinutes, 120) / 60) * 2.2;
    metHb = Math.round(metHb * 10) / 10;
  }

  // NO2 production occurs when NO reacts with O2 in delivery circuit:
  // NO + 0.5 O2 -> NO2 (favored by high FiO2, high NO ppm, long dwell time)
  let no2 = 0.05;
  if (agent === 'INHALED_NITRIC_OXIDE') {
    no2 += (dosePpmOrMcg / 40) * 0.45 + (durationMinutes / 120) * 0.3;
    no2 = Math.round(no2 * 100) / 100;
  }

  // 5. Clinical Alerts & Diagnostic Guidance
  const alerts: string[] = [];

  if (reboundSeverity !== 'NONE') {
    alerts.push(
      `CRITICAL REBOUND HYPERTENSION: Abrupt discontinuation triggered severe rebound pulmonary vasoconstriction (mPAP +${reboundSpike} mmHg above baseline). Immediately resume iNO at previous dose and taper gradually (20 -> 10 -> 5 -> 1 ppm).`
    );
  }

  if (metHb >= 5.0) {
    alerts.push(
      `TOXIC METHEMOGLOBINEMIA (${metHb}%): High risk of tissue hypoxia refractory to oxygen. Immediately reduce iNO dose. If MetHb > 7-10% with symptoms, administer IV Methylene Blue (1-2 mg/kg over 5 minutes).`
    );
  } else if (metHb >= 2.5) {
    alerts.push(`ELEVATED METHEMOGLOBIN (${metHb}%): Monitor co-oximetry serial arterial blood gases. Prepare to taper iNO.`);
  }

  if (no2 >= 1.0) {
    alerts.push(
      `CRITICAL NITROGEN DIOXIDE TOXICITY (${no2} ppm): NO2 > 1.0 ppm causes direct airway inflammation and acute pulmonary edema. Inspect delivery apparatus, minimize circuit dwell time, and check calibration.`
    );
  } else if (no2 >= 0.5) {
    alerts.push(`ELEVATED NO2 (${no2} ppm): Exceeds safe threshold of 0.5 ppm. Verify circuit sweep flow.`);
  }

  if (agent === 'IV_EPOPROSTENOL' && deltaSvrPct <= -20) {
    alerts.push(`SYSTEMIC HYPOTENSION: IV prostacyclin caused significant systemic vasodilation (SVR ${deltaSvrPct}%). Inhaled route provides pulmonary selectivity without systemic collapse.`);
  }

  let guidance = '';
  if (isVasoreactive) {
    guidance = `POSITIVE ACUTE VASOREACTIVITY (Sitbon Criteria Met): mPAP decreased by ${Math.abs(deltaMpap)} mmHg (>= 10) to ${currentMpap} mmHg (<= 40) with stable/increased CO (${currentCo} L/min). Patient is among the ~10% of IPAH cases eligible for high-dose oral Calcium Channel Blocker trial (e.g., Diltiazem, Nifedipine). Close monitoring required.`;
  } else {
    guidance = `NEGATIVE ACUTE VASOREACTIVITY: mPAP change (${deltaMpap > 0 ? '+' : ''}${deltaMpap} mmHg) does NOT meet criteria for CCB responsiveness. Calcium channel blockers are STRICTLY CONTRAINDICATED as they cause fatal RV failure. Initiate combination targeted PAH therapy (ERA + PDE5i ± Prostacyclin pathway agent).`;
  }

  return {
    currentMpapMmHg: currentMpap,
    deltaMpapMmHg: deltaMpap,
    currentCoLMin: currentCo,
    deltaCoLMin: deltaCo,
    baselinePvrWoodUnits: baselinePvr,
    currentPvrWoodUnits: currentPvr,
    deltaPvrPercent: deltaPvrPct,
    baselineSvrDynes: baselineSvr,
    currentSvrDynes: currentSvr,
    deltaSvrPercent: deltaSvrPct,
    selectivityIndex: selectivity,
    isVasoreactivePositive: isVasoreactive,
    recommendedTherapy,
    methemoglobinPercent: metHb,
    nitrogenDioxidePpm: no2,
    reboundHypertensionSeverity: reboundSeverity,
    reboundMpapSpikeMmHg: reboundSpike,
    clinicalAlerts: alerts,
    diagnosticGuidance: guidance,
  };
}
