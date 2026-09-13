/**
 * ReboaPhysiologyEngine.ts
 * Emergency Medicine, Trauma Surgery & Critical Care Engine.
 * Implements Resuscitative Endovascular Balloon Occlusion of the Aorta (REBOA),
 * Aortic Occlusion Zones (Zone 1 Thoracic vs Zone 2 No-Fly vs Zone 3 Infrarenal),
 * Partial REBOA (pREBOA) & Intermittent (iREBOA) Hemodynamic Titration,
 * Ischemia-Reperfusion Time Windows, and Washout Acidosis/Hyperkalemia Kinetics.
 * Location: frontend/.gemini/skills/ReboaPhysiologyEngine.ts
 */

export type AorticZone = 'zone_1_thoracic' | 'zone_2_visceral_no_occlusion' | 'zone_3_infrarenal';
export type OcclusionStrategy = 'complete_reboa' | 'partial_preboa' | 'intermittent_ireboa' | 'deflated_standby';
export type InjuryPhenotype =
  | 'pelvic_fracture_isolated'
  | 'intraabdominal_grade_5_liver_splenic'
  | 'combined_torso_pelvic_hemorrhage'
  | 'penetrating_groin_junctional'
  | 'thoracic_aortic_transection';

export interface PatientReboaState {
  patientAge: number;
  injuryPhenotype: InjuryPhenotype;
  balloonZone: AorticZone;
  occlusionStrategy: OcclusionStrategy;
  inflationVolumeMl: number; // 0 to 12 mL (standard Prytime ER-REBOA capacity ~8 mL in zone 1, ~2-4 mL in zone 3)
  totalInflationDurationMinutes: number; // 0 to 90 min
  radialArtLineSbp: number; // Proximal arterial line (mmHg)
  radialArtLineDbp: number;
  femoralArtLineMeanBp: number; // Distal arterial line / side-arm (mmHg)
  unitsPrbcTransfused: number; // Balanced resuscitation marker
  serumLactateMmolL: number; // Baseline / current arterial lactate
  serumPotassiumMeqL: number; // Baseline / current K+ (mEq/L)
  pHValue: number; // Arterial pH
  ongoingSurgicalControlAchieved: boolean; // OR or Angio embolization success
}

export interface HemodynamicAudit {
  proximalMap: number;
  distalMap: number;
  transverseGradientMmHg: number;
  coronaryCerebralPerfusionAdequate: boolean; // Proximal MAP >= 65 mmHg
  afterloadStrainHazard: boolean; // Proximal SBP > 160 or MAP > 120 mmHg
  summary: string;
}

export interface IschemiaReperfusionAudit {
  ischemicRiskTier: 'safe' | 'caution' | 'critical_necrosis_imminent';
  maxSafeDurationMinutes: number;
  reperfusionShockRiskScore: number; // 0 to 100
  postDeflationExpectedPotassium: number; // estimated peak post-washout K+
  postDeflationExpectedLactate: number; // estimated post-washout lactate
  washoutAcidosisWarning: string | null;
}

export interface ReboaClinicalVerdict {
  contraindicationAlert: string | null;
  isZoneAppropriate: boolean;
  strategyRecommendation: string;
  deflationProtocolSteps: string[];
  damageControlChecklist: string[];
}

export interface ReboaScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientReboaState;
  clinicalPearls: string[];
}

/**
 * 1. Calculate Hemodynamic Pressures & Transverse Gradient
 */
export function calculateHemodynamicGradients(state: PatientReboaState): HemodynamicAudit {
  const { radialArtLineSbp: sbp, radialArtLineDbp: dbp, femoralArtLineMeanBp: distalMap } = state;
  const proximalMap = Math.round((2 * dbp + sbp) / 3);
  const transverseGradientMmHg = Math.max(0, proximalMap - distalMap);

  const coronaryCerebralPerfusionAdequate = proximalMap >= 65;
  const afterloadStrainHazard = sbp > 160 || proximalMap > 120;

  let summary = `Proximal MAP ${proximalMap} mmHg provides adequate central perfusion (Target >= 65 mmHg).`;
  if (!coronaryCerebralPerfusionAdequate) {
    summary = `CRITICAL CENTRAL HYPOTENSION: Proximal MAP ${proximalMap} < 65 mmHg. Balloon occlusion ineffective or profound hypovolemic arrest in progress.`;
  } else if (afterloadStrainHazard) {
    summary = `EXCESSIVE AFTERLOAD HAZARD: Proximal SBP ${sbp} mmHg (MAP ${proximalMap} mmHg) risks acute LV failure, myocardial strain, or cerebral hemorrhage. Micro-titrate balloon volume down (pREBOA).`;
  }

  return {
    proximalMap,
    distalMap,
    transverseGradientMmHg,
    coronaryCerebralPerfusionAdequate,
    afterloadStrainHazard,
    summary,
  };
}

/**
 * 2. Audit Ischemic Time Windows & Reperfusion Washout Threat
 */
export function auditIschemiaReperfusionWindow(state: PatientReboaState): IschemiaReperfusionAudit {
  const {
    balloonZone,
    occlusionStrategy,
    totalInflationDurationMinutes: timeMin,
    serumLactateMmolL: lactate,
    serumPotassiumMeqL: k,
    pHValue,
  } = state;

  // Max safe durations based on zone and strategy
  let maxSafeDurationMinutes = 30; // Zone 1 complete default
  if (balloonZone === 'zone_3_infrarenal') {
    maxSafeDurationMinutes = occlusionStrategy === 'partial_preboa' ? 90 : 60;
  } else if (balloonZone === 'zone_1_thoracic') {
    maxSafeDurationMinutes = occlusionStrategy === 'partial_preboa' ? 45 : 30;
  }

  // Ischemic Risk Tier
  let ischemicRiskTier: IschemiaReperfusionAudit['ischemicRiskTier'] = 'safe';
  if (timeMin > maxSafeDurationMinutes) {
    ischemicRiskTier = 'critical_necrosis_imminent';
  } else if (timeMin >= maxSafeDurationMinutes - 10) {
    ischemicRiskTier = 'caution';
  }

  // Calculate Reperfusion Washout Penalty
  // Washout surges with duration, complete occlusion, and zone 1 mass
  const zoneMultiplier = balloonZone === 'zone_1_thoracic' ? 1.5 : 0.8;
  const strategyFactor = occlusionStrategy === 'complete_reboa' ? 1.0 : 0.45;
  const timeFactor = Math.min(3.0, timeMin / 25);

  const potassiumSurge = Math.round(timeFactor * zoneMultiplier * strategyFactor * 10) / 10;
  const postDeflationExpectedPotassium = Math.round((k + potassiumSurge) * 10) / 10;

  const lactateSurge = Math.round(timeFactor * zoneMultiplier * strategyFactor * 4.5 * 10) / 10;
  const postDeflationExpectedLactate = Math.round((lactate + lactateSurge) * 10) / 10;

  // Reperfusion Shock Score (0-100)
  const reperfusionShockRiskScore = Math.min(
    100,
    Math.round(timeMin * 1.1 * zoneMultiplier * strategyFactor + (7.35 - Math.min(7.35, pHValue)) * 80)
  );

  let washoutAcidosisWarning: string | null = null;
  if (postDeflationExpectedPotassium >= 6.0) {
    washoutAcidosisWarning = `LETHAL HYPERKALEMIA HAZARD: Expected post-reperfusion K+ ${postDeflationExpectedPotassium} mEq/L (due to ischemic skeletal/visceral cell lysis). Administer IV Calcium Chloride 1g and Sodium Bicarbonate prior to balloon deflation!`;
  } else if (ischemicRiskTier === 'critical_necrosis_imminent') {
    washoutAcidosisWarning = `CRITICAL ISCHEMIC CEILING EXCEEDED: Balloon inflated for ${timeMin} min (Safe max ${maxSafeDurationMinutes} min). High risk of bowel necrosis, spinal cord ischemia, and fatal reperfusion vasodilation shock.`;
  } else if (ischemicRiskTier === 'caution') {
    washoutAcidosisWarning = `Approaching safe ischemic threshold (${timeMin}/${maxSafeDurationMinutes} min). Expedite surgical control or convert to partial REBOA (pREBOA).`;
  }

  return {
    ischemicRiskTier,
    maxSafeDurationMinutes,
    reperfusionShockRiskScore,
    postDeflationExpectedPotassium,
    postDeflationExpectedLactate,
    washoutAcidosisWarning,
  };
}

/**
 * 3. Comprehensive REBOA Safety & Deployment Evaluation
 */
export function evaluateReboaSafety(state: PatientReboaState): ReboaClinicalVerdict {
  const { injuryPhenotype, balloonZone, occlusionStrategy, totalInflationDurationMinutes, ongoingSurgicalControlAchieved } = state;
  const hemoAudit = calculateHemodynamicGradients(state);
  const ischAudit = auditIschemiaReperfusionWindow(state);

  const deflationProtocolSteps: string[] = [];
  const damageControlChecklist: string[] = [];

  // Absolute Contraindications
  let contraindicationAlert: string | null = null;
  if (injuryPhenotype === 'thoracic_aortic_transection') {
    contraindicationAlert = 'ABSOLUTE CONTRAINDICATION: Suspected or confirmed thoracic aortic rupture / transection. Blind REBOA placement will cause catheter passage into mediastinum, fatal aortic dissection, and cardiac tamponade!';
  } else if (balloonZone === 'zone_2_visceral_no_occlusion') {
    contraindicationAlert = 'CONTRAINDICATED ZONE (ZONE 2 NO-FLY): Balloon deployed in visceral aortic segment (celiac to lowest renal artery). Incomplete hemorrhage control with catastrophic direct mesenteric and renal artery thrombosis.';
  }

  // Zone Appropriateness
  let isZoneAppropriate = true;
  if (balloonZone === 'zone_3_infrarenal' && injuryPhenotype === 'intraabdominal_grade_5_liver_splenic') {
    isZoneAppropriate = false;
  }

  // Strategy Recommendation
  let strategyRecommendation = 'Maintain current occlusion parameters while coordinating damage control surgery.';
  if (contraindicationAlert) {
    strategyRecommendation = 'ABORT / DEFLATE IMMEDIATELY: Relocate balloon out of Zone 2 or abort for thoracotomy / sternotomy.';
  } else if (ischAudit.ischemicRiskTier === 'critical_necrosis_imminent') {
    strategyRecommendation = 'MANDATORY DEFLATION / pREBOA: Ischemic time ceiling breached. Must begin gradual micro-deflation with rapid blood transfusion.';
  } else if (occlusionStrategy === 'complete_reboa' && totalInflationDurationMinutes >= 15 && !ongoingSurgicalControlAchieved) {
    strategyRecommendation = 'TRANSITION TO PARTIAL REBOA (pREBOA): Controlled deflation of 0.5-1.0 mL titrating distal MAP to 35-45 mmHg to permit visceral/pelvic micro-perfusion while maintaining proximal MAP >= 65 mmHg.';
  }

  // Deflation Protocol Steps
  deflationProtocolSteps.push('1. Confirm Balanced Transfusion: Ensure at least 2-4 units PRBC/FFP running wide-open via rapid infuser before deflation.');
  deflationProtocolSteps.push('2. Calcium & Bicarbonate Prophylaxis: IV Calcium Chloride 1g + Sodium Bicarbonate if ischemic duration > 20 minutes.');
  deflationProtocolSteps.push('3. Micro-Deflation: Deflate balloon slowly in 0.5 mL increments per minute, observing radial arterial line for drop in SBP > 20 mmHg.');
  deflationProtocolSteps.push('4. Titrate to Distal Pulse: Target distal pulsatile arterial waveform or distal MAP 35-45 mmHg.');

  // Damage Control Checklist
  if (hemoAudit.coronaryCerebralPerfusionAdequate) {
    damageControlChecklist.push('Proximal central perfusion preserved (MAP >= 65 mmHg)');
  }
  if (!hemoAudit.afterloadStrainHazard) {
    damageControlChecklist.push('Afterload within safe physiologic limits (SBP <= 160 mmHg)');
  }
  if (ischAudit.ischemicRiskTier === 'safe') {
    damageControlChecklist.push(`Ischemic time within safe window (${totalInflationDurationMinutes}/${ischAudit.maxSafeDurationMinutes} min)`);
  }
  if (ongoingSurgicalControlAchieved) {
    damageControlChecklist.push('Definitive surgical/angio hemostasis achieved; safe to completely deflate balloon');
  }

  return {
    contraindicationAlert,
    isZoneAppropriate,
    strategyRecommendation,
    deflationProtocolSteps,
    damageControlChecklist,
  };
}

/**
 * 4. High-Acuity Clinical REBOA Scenarios Catalog
 */
export const REBOA_SCENARIOS: Record<string, ReboaScenario> = {
  pelvic_zone3_preboa: {
    id: 'pelvic_zone3_preboa',
    name: '1. Unstable Pelvic Fracture (Zone 3 pREBOA Titration)',
    patientSummary:
      '32yo male motorcyclist with open-book pelvic fracture (Tile C) and severe hemorrhagic shock (SBP 64/32 mmHg). Fast scan negative in abdomen. 7-Fr sheath placed via common femoral artery. Balloon positioned in Zone 3 (infrarenal) with pREBOA titration.',
    initialState: {
      patientAge: 32,
      injuryPhenotype: 'pelvic_fracture_isolated',
      balloonZone: 'zone_3_infrarenal',
      occlusionStrategy: 'partial_preboa',
      inflationVolumeMl: 3.0,
      totalInflationDurationMinutes: 18,
      radialArtLineSbp: 102,
      radialArtLineDbp: 62,
      femoralArtLineMeanBp: 38,
      unitsPrbcTransfused: 4,
      serumLactateMmolL: 4.8,
      serumPotassiumMeqL: 4.1,
      pHValue: 7.32,
      ongoingSurgicalControlAchieved: false,
    },
    clinicalPearls: [
      'Zone 3 (infrarenal) preserves visceral and renal perfusion while tamponading branches of internal iliac artery.',
      'Partial REBOA (distal MAP 35-45 mmHg) minimizes lower extremity ischemic burden and allows prolonged transit to interventional radiology.',
      'Safe inflation window extends up to 60-90 minutes under partial titration.',
    ],
  },
  ruptured_liver_zone1_critical_time: {
    id: 'ruptured_liver_zone1_critical_time',
    name: '2. Exsanguinating Hepatic Laceration (Zone 1 Near-Ceiling Time)',
    patientSummary:
      '45yo female unrestrained driver with Grade V liver shattering, hemoperitoneum, and profound arrest-level shock. Zone 1 balloon inflated 28 minutes ago. Proximal SBP 95 mmHg, but approaching strict 30-minute supraceliac ischemic ceiling.',
    initialState: {
      patientAge: 45,
      injuryPhenotype: 'intraabdominal_grade_5_liver_splenic',
      balloonZone: 'zone_1_thoracic',
      occlusionStrategy: 'complete_reboa',
      inflationVolumeMl: 8.0,
      totalInflationDurationMinutes: 28,
      radialArtLineSbp: 96,
      radialArtLineDbp: 58,
      femoralArtLineMeanBp: 18,
      unitsPrbcTransfused: 6,
      serumLactateMmolL: 8.2,
      serumPotassiumMeqL: 5.1,
      pHValue: 7.22,
      ongoingSurgicalControlAchieved: false,
    },
    clinicalPearls: [
      'Zone 1 (supraceliac) stops all infra-diaphragmatic blood flow, resuscitating brain and heart.',
      'Strict 30-minute ceiling: supraceliac cross-clamping beyond 30 min triggers massive visceral necrosis, bowel infarction, and lethal reperfusion hyperkalemia.',
      'Must immediately begin gradual partial release (pREBOA) with pre-emptive IV Calcium Chloride.',
    ],
  },
  junctional_groin_partial: {
    id: 'junctional_groin_partial',
    name: '3. Blast Injury: Penetrating Junctional Groin Exsanguination',
    patientSummary:
      '27yo soldier with blast fragment transection of common femoral vessels at inguinal ligament (non-tourniquet-amenable). Rapid contralateral femoral sheath insertion and Zone 3 inflation.',
    initialState: {
      patientAge: 27,
      injuryPhenotype: 'penetrating_groin_junctional',
      balloonZone: 'zone_3_infrarenal',
      occlusionStrategy: 'complete_reboa',
      inflationVolumeMl: 4.0,
      totalInflationDurationMinutes: 12,
      radialArtLineSbp: 114,
      radialArtLineDbp: 72,
      femoralArtLineMeanBp: 20,
      unitsPrbcTransfused: 2,
      serumLactateMmolL: 3.6,
      serumPotassiumMeqL: 3.9,
      pHValue: 7.36,
      ongoingSurgicalControlAchieved: false,
    },
    clinicalPearls: [
      'Junctional groin wounds cannot be controlled with standard extremity tourniquets; Zone 3 REBOA is the bridge to surgical vascular repair.',
      'Contralateral femoral access allows unobstructed surgical exploration of the injured groin.',
      'Transition to pREBOA as soon as proximal vascular clamps are placed in the operative field.',
    ],
  },
  thoracic_tear_contraindication: {
    id: 'thoracic_tear_contraindication',
    name: '4. Lethal Contraindication: Suspected Thoracic Aortic Transection',
    patientSummary:
      '52yo male high-speed collision with steering wheel impact. Widened mediastinum on CXR, left apical pleural cap. Unstable shock. Attempted blind Zone 1 REBOA insertion requested by junior team.',
    initialState: {
      patientAge: 52,
      injuryPhenotype: 'thoracic_aortic_transection',
      balloonZone: 'zone_1_thoracic',
      occlusionStrategy: 'deflated_standby',
      inflationVolumeMl: 0.0,
      totalInflationDurationMinutes: 0,
      radialArtLineSbp: 72,
      radialArtLineDbp: 40,
      femoralArtLineMeanBp: 50,
      unitsPrbcTransfused: 2,
      serumLactateMmolL: 6.0,
      serumPotassiumMeqL: 4.4,
      pHValue: 7.28,
      ongoingSurgicalControlAchieved: false,
    },
    clinicalPearls: [
      'ABSOLUTE CONTRAINDICATION: Aortic injury proximal to balloon position.',
      'Advancing a guidewire and balloon into an injured thoracic aorta risks false lumen perforation, rupture of pseudoaneurysm, and immediate fatal exsanguination into hemithorax.',
      'Immediate left anterolateral thoracotomy / median sternotomy is indicated instead.',
    ],
  },
};
