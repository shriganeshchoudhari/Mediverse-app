/**
 * AorticDissectionEngine.ts
 * Vascular Surgery, Critical Care & Emergency Cardiology Simulation Engine:
 * Acute Aortic Syndromes (AAS) & Aortic Dissection:
 * - Stanford Classification: Type A (Surgical Emergency) vs Type B (Medical vs TEVAR)
 * - Anti-Impulse Therapy (dP/dt Reduction): Beta-Blocker First Rule (HR < 60 bpm) before Vasodilators (SBP 100-120 mmHg)
 * - The Vasodilator Catastrophe Hazard: Reflex tachycardia propagating shearing tear
 * - Branch Vessel Malperfusion Syndromes (Dynamic vs Static):
 *   Coronary (inferior STEMI), Cerebral (stroke), Mesenteric (gut necrosis), Renal (Goldblatt AKI), Spinal (Adamkiewicz paraplegia), Limb (pulse deficit)
 * - Retrograde Type A Hemopericardium & Cardiac Tamponade Pericardiocentesis Dilemma
 * - Complicated Type B Criteria & Thoracic Endovascular Aortic Repair (TEVAR)
 */

export type StanfordClassification =
  | 'STANFORD_TYPE_A'               // Involves ascending aorta; emergent surgical repair mandated
  | 'STANFORD_TYPE_B_UNCOMPLICATED' // Descending aorta distal to left subclavian; medical anti-impulse therapy
  | 'STANFORD_TYPE_B_COMPLICATED';  // Descending aorta with malperfusion, refractory pain/HTN, rapid growth, or rupture

export type AasPathologySubtype =
  | 'CLASSIC_AORTIC_DISSECTION'     // Intimomedial tear with true and false lumen flow
  | 'INTRAMURAL_HEMATOMA_IMH'       // Non-flow circular/crescent hemorrhage of aortic wall (vasa vasorum rupture)
  | 'PENETRATING_AORTIC_ULCER_PAU'; // Atherosclerotic ulceration eroding through internal elastic lamina

export type BetaBlockerRegimen =
  | 'NONE'
  | 'ESMOLOL_INFUSION'              // Short-acting, titratable IV infusion (target HR < 60 bpm)
  | 'LABETALOL_IV'                  // Combined alpha-1 and non-selective beta-blocker
  | 'DILTIAZEM_IV_ALTERNATIVE';     // Non-DHP CCB alternative if beta-blockers contraindicated

export type VasodilatorRegimen =
  | 'NONE'
  | 'NICARDIPINE_IV'                // Dihydropyridine CCB arterial vasodilator (target SBP 100-120 mmHg)
  | 'CLEVIDIPINE_IV'                // Ultra-short acting arterial vasodilator
  | 'NITROPRUSSIDE_IV'              // Direct NO donor vasodilator
  | 'HYDRALAZINE_HAZARD';           // CONTRAINDICATED: Unpredictable, reflex tachycardia spikes dP/dt!

export type SurgicalInterventionChoice =
  | 'MEDICAL_MANAGEMENT_ONLY'
  | 'EMERGENT_OPEN_ARCH_REPAIR'     // Sternotomy, CPB, hemiarch or total arch with Frozen Elephant Trunk (FET)
  | 'TEVAR_ENDOVASCULAR_STENT'      // Thoracic Endovascular Aortic Repair: covers entry tear, seals false lumen
  | 'PERICARDIOCENTESIS_COMPLETE_HAZARD' // LETHAL PITFALL in Type A: complete drainage causes blowout rupture!
  | 'CONTROLLED_MICRO_PERICARDIOCENTESIS'; // 10-20 mL rescue aspiration in PEA arrest only

export interface AorticDissectionPatientParams {
  // Pathology & Classification
  stanfordClass: StanfordClassification;
  aasSubtype: AasPathologySubtype;
  maximumAorticDiameterMm: number;    // 35 to 80 mm (>= 55 mm or acute growth >= 5 mm is high risk)
  aorticGrowthMmPerYear: number;      // Normal < 1 mm/yr, rapid >= 5 mm
  falseLumenPatency: 'PATENT' | 'PARTIALLY_THROMBOSED' | 'COMPLETELY_THROMBOSED';

  // Hemodynamics & Anti-Impulse Metrics
  heartRateBpm: number;               // 45 to 140 bpm (TARGET: < 60 bpm)
  sbpMmHg: number;                    // 80 to 240 mmHg (TARGET: 100-120 mmHg)
  dbpMmHg: number;                    // 40 to 130 mmHg
  refractoryHypertension: boolean;    // Persistent SBP > 140 despite >= 3 IV agents
  refractorySeverePain: boolean;      // Ongoing ripping/tearing chest/back pain despite opioids

  // Anti-Impulse Pharmacotherapy
  betaBlocker: BetaBlockerRegimen;
  vasodilator: VasodilatorRegimen;
  vasodilatorStartedBeforeBetaBlocker: boolean; // THE VASODILATOR CATASTROPHE!

  // Organ Malperfusion Syndromes
  coronaryMalperfusionRcaStemi: boolean;     // RCA involvement -> Inferior STEMI
  cerebralMalperfusionStroke: boolean;       // Carotid / Innominate involvement -> Stroke / Syncope
  mesentericMalperfusionIschemia: boolean;   // Celiac / SMA involvement -> Gut necrosis, high lactate
  serumLactateMmolL: number;                 // Normal 0.5-2.0, mesenteric ischemia > 3.0-4.0+
  renalMalperfusionAki: boolean;             // Renal artery involvement -> Goldblatt severe hypertension & AKI
  spinalCordMalperfusionParaplegia: boolean; // Adamkiewicz / intercostals -> Anterior spinal cord syndrome
  lowerExtremityLimbPulseDeficit: boolean;   // Iliac/femoral true lumen collapse -> pulseless pale leg

  // Pericardial & Aortic Valve Complications (Type A)
  retrogradeAorticRegurgitation: 'NONE' | 'MILD' | 'SEVERE';
  hemopericardiumTamponadePresent: boolean;  // Effusion with pulsus paradoxus / collapse

  // Interventions
  surgicalIntervention: SurgicalInterventionChoice;
}

export interface AorticDissectionSimulationResult {
  meanArterialPressureMmHg: number;
  estimatedDpDtMmHgPerSec: number;           // Ventricular pressure rise rate (Normal < 800; Shearing > 1200-2000)
  aorticWallShearStressIndex: number;        // 0 to 100
  isAntiImpulseTargetAchieved: boolean;      // HR < 60 AND SBP 100-120
  hasVasodilatorCatastrophe: boolean;
  malperfusionOrgansCount: number;
  inHospitalMortalityRiskPercent: number;
  resuscitationSafetyScore: number;          // 0 to 100
  clinicalStatusBadge: {
    status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'LETHAL_EMERGENCY';
    label: string;
    color: string;
  };
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepActionPlan: string[];
}

/**
 * Calculates hemodynamic indices and estimated dP/dt shearing force
 */
export function calculateAntiImpulseDynamics(params: AorticDissectionPatientParams) {
  const map = Math.round((params.sbpMmHg + 2 * params.dbpMmHg) / 3);

  // Baseline dP/dt estimation:
  // dP/dt is heavily governed by heart rate and inotropy.
  // In pure unblocked state: baseline ~1000-1200 mmHg/s.
  // With tachycardia (>100 bpm) or unblocked vasodilators: jumps to 1800-2600 mmHg/s!
  // With optimal beta-blockade (HR < 60): drops to 500-750 mmHg/s.
  let dpDt = 1000 + (params.heartRateBpm - 60) * 15 + (params.sbpMmHg - 120) * 4;

  if (params.betaBlocker === 'ESMOLOL_INFUSION' || params.betaBlocker === 'LABETALOL_IV') {
    dpDt -= 350;
  } else if (params.betaBlocker === 'DILTIAZEM_IV_ALTERNATIVE') {
    dpDt -= 200;
  }

  // The Vasodilator Catastrophe: if vasodilator started before beta-blocker, reflex sympathetic
  // activation surges heart rate and inotropic state, drastically spiking dP/dt!
  if (params.vasodilatorStartedBeforeBetaBlocker && params.vasodilator !== 'NONE') {
    dpDt += 800;
  }

  dpDt = Math.max(400, Math.min(3000, dpDt));

  // Shear stress index (0-100)
  const shearIndex = Math.min(100, Math.max(10, Math.round((dpDt / 2500) * 70 + (params.sbpMmHg / 200) * 30)));

  const isAntiImpulseTargetAchieved = params.heartRateBpm <= 60 && params.sbpMmHg >= 100 && params.sbpMmHg <= 120;

  return { map, dpDt, shearIndex, isAntiImpulseTargetAchieved };
}

/**
 * Core simulation calculation for Acute Aortic Syndromes & Anti-Impulse Resuscitation
 */
export function simulateAorticDissection(params: AorticDissectionPatientParams): AorticDissectionSimulationResult {
  const { map, dpDt, shearIndex, isAntiImpulseTargetAchieved } = calculateAntiImpulseDynamics(params);

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepActionPlan: string[] = [];

  // 1. Evaluate Malperfusion Count
  let malperfusionCount = 0;
  if (params.coronaryMalperfusionRcaStemi) malperfusionCount++;
  if (params.cerebralMalperfusionStroke) malperfusionCount++;
  if (params.mesentericMalperfusionIschemia || params.serumLactateMmolL >= 3.0) malperfusionCount++;
  if (params.renalMalperfusionAki) malperfusionCount++;
  if (params.spinalCordMalperfusionParaplegia) malperfusionCount++;
  if (params.lowerExtremityLimbPulseDeficit) malperfusionCount++;

  // 2. The Vasodilator Catastrophe Hazard Check
  const hasVasodilatorCatastrophe = params.vasodilatorStartedBeforeBetaBlocker && params.vasodilator !== 'NONE';
  if (hasVasodilatorCatastrophe) {
    criticalAlerts.push(
      `THE VASODILATOR CATASTROPHE: Arterial vasodilator administered BEFORE achieving adequate beta-blockade. Peripheral vasodilation triggered intense reflex sympathetic tachycardia, dramatically spiking dP/dt (${dpDt} mmHg/s). This surges aortic wall shearing stress and accelerates tearing, dissection propagation, or fatal aortic rupture!`
    );
  }

  // 3. Hydralazine Pitfall
  if (params.vasodilator === 'HYDRALAZINE_HAZARD') {
    criticalAlerts.push(
      `HYDRALAZINE CONTRAINDICATION: Hydralazine causes unpredictable, prolonged reflex tachycardia and sympathetic surge with severe dP/dt spikes. It is contraindicated in acute aortic syndromes.`
    );
  }

  // 4. Pericardiocentesis Dilemma in Type A Dissection
  if (params.stanfordClass === 'STANFORD_TYPE_A' && params.hemopericardiumTamponadePresent) {
    if (params.surgicalIntervention === 'PERICARDIOCENTESIS_COMPLETE_HAZARD') {
      criticalAlerts.push(
        `LETHAL PERICARDIOCENTESIS BLOWOUT: Complete pericardial drainage in Type A aortic dissection suddenly relieves pericardial tamponade pressure, causing an abrupt surge in systemic blood pressure and transaortic gradient. This blows out the false lumen tear into instant, fatal hemopericardial exsanguination!`
      );
    } else if (params.surgicalIntervention === 'CONTROLLED_MICRO_PERICARDIOCENTESIS') {
      physiologicMechanisms.push(
        `Controlled micro-pericardiocentesis (10-20 mL aspiration only): Temporizing measure to restore a perfusing rhythm during cardiac arrest while en route to emergency sternotomy.`
      );
    } else {
      physiologicMechanisms.push(
        `Type A hemopericardium identified: Avoid complete pericardiocentesis; immediate transfer to OR for emergent sternotomy and cardiopulmonary bypass.`
      );
    }
  }

  // 5. STEMI Thrombolysis Hazard
  if (params.coronaryMalperfusionRcaStemi) {
    criticalAlerts.push(
      `CORONARY MALPERFUSION HAZARD: RCA ostial involvement mimics isolated inferior STEMI. Thrombolytic therapy or full-dose anticoagulation would cause fatal hemopericardium and catastrophic exsanguination!`
    );
  }

  // 6. Calculate In-Hospital Mortality Risk
  let baseMortality = 10;

  if (params.stanfordClass === 'STANFORD_TYPE_A') {
    // Type A without surgery has ~1-2% mortality per hour in first 48h (~50% at 48h)
    baseMortality = 45;
    if (params.surgicalIntervention === 'EMERGENT_OPEN_ARCH_REPAIR') {
      baseMortality = 15; // Surgical survival ~85%
      physiologicMechanisms.push(
        `Emergent open surgical repair (hemiarch/total arch + aortic valve resuspension) resects the primary tear, restores true lumen flow, and prevents fatal intrapericardial rupture.`
      );
    } else if (params.surgicalIntervention === 'PERICARDIOCENTESIS_COMPLETE_HAZARD') {
      baseMortality = 95;
    } else {
      criticalAlerts.push(
        `LETHAL SURGICAL DELAY: Stanford Type A dissection untreated surgically carries a 1-2% mortality per hour. Emergency cardiac surgery consultation and immediate OR transfer is mandatory!`
      );
      baseMortality += 25;
    }
  } else if (params.stanfordClass === 'STANFORD_TYPE_B_COMPLICATED') {
    baseMortality = 30;
    if (params.surgicalIntervention === 'TEVAR_ENDOVASCULAR_STENT') {
      baseMortality = 12;
      physiologicMechanisms.push(
        `TEVAR (Thoracic Endovascular Aortic Repair) successfully covers the primary entry tear, depresses false lumen pressure, induces false lumen thrombosis, and re-expands the true lumen to resolve malperfusion.`
      );
    } else {
      criticalAlerts.push(
        `COMPLICATED TYPE B DISSECTION: Refractory pain, malperfusion, or rapid expansion mandates urgent TEVAR endovascular intervention rather than medical therapy alone.`
      );
      baseMortality += 20;
    }
  } else {
    // Uncomplicated Type B
    baseMortality = 8;
    if (isAntiImpulseTargetAchieved) {
      baseMortality = 4;
      physiologicMechanisms.push(
        `Optimal anti-impulse control achieved (HR <= 60 bpm and SBP 100-120 mmHg), minimizing aortic shearing stress and preventing dissection extension.`
      );
    }
  }

  // Add penalties for malperfusion and shear stress
  baseMortality += malperfusionCount * 8;
  if (hasVasodilatorCatastrophe) baseMortality += 25;
  if (params.vasodilator === 'HYDRALAZINE_HAZARD') baseMortality += 15;
  if (params.serumLactateMmolL >= 4.0) baseMortality += 20;

  const inHospitalMortalityRiskPercent = Math.min(98, Math.max(2, Math.round(baseMortality)));

  // Resuscitation Safety Score (0-100)
  let safetyScore = 100;
  if (hasVasodilatorCatastrophe) safetyScore -= 45;
  if (params.vasodilator === 'HYDRALAZINE_HAZARD') safetyScore -= 30;
  if (params.surgicalIntervention === 'PERICARDIOCENTESIS_COMPLETE_HAZARD') safetyScore -= 50;
  if (params.stanfordClass === 'STANFORD_TYPE_A' && params.surgicalIntervention !== 'EMERGENT_OPEN_ARCH_REPAIR') safetyScore -= 35;
  if (params.stanfordClass === 'STANFORD_TYPE_B_COMPLICATED' && params.surgicalIntervention !== 'TEVAR_ENDOVASCULAR_STENT') safetyScore -= 25;
  if (!isAntiImpulseTargetAchieved) safetyScore -= 15;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Determine Clinical Status Badge
  let clinicalStatusBadge: AorticDissectionSimulationResult['clinicalStatusBadge'] = {
    status: 'STABLE',
    label: 'Controlled Anti-Impulse State',
    color: 'emerald'
  };

  if (
    params.surgicalIntervention === 'PERICARDIOCENTESIS_COMPLETE_HAZARD' ||
    hasVasodilatorCatastrophe ||
    inHospitalMortalityRiskPercent >= 60
  ) {
    clinicalStatusBadge = {
      status: 'LETHAL_EMERGENCY',
      label: 'Catastrophic Rupture / Malperfusion Crisis',
      color: 'rose'
    };
  } else if (params.stanfordClass === 'STANFORD_TYPE_A' || malperfusionCount >= 2) {
    clinicalStatusBadge = {
      status: 'CRITICAL',
      label: 'Type A / Multi-Organ Malperfusion',
      color: 'red'
    };
  } else if (params.stanfordClass === 'STANFORD_TYPE_B_COMPLICATED' || !isAntiImpulseTargetAchieved) {
    clinicalStatusBadge = {
      status: 'WARNING',
      label: 'Impending Progression / Incomplete Control',
      color: 'amber'
    };
  }

  // Step-by-Step Action Plan
  stepByStepActionPlan.push(`1. Immediate Classification: ${params.stanfordClass.replace(/_/g, ' ')} identified on CT Angiography.`);

  if (params.betaBlocker === 'NONE') {
    stepByStepActionPlan.push(`2. Initiate IV Beta-Blocker FIRST: Start IV Esmolol infusion or Labetalol immediately to drive Heart Rate < 60 bpm and blunt dP/dt BEFORE initiating any vasodilators.`);
  } else if (params.heartRateBpm > 60) {
    stepByStepActionPlan.push(`2. Titrate Beta-Blocker: Current HR is ${params.heartRateBpm} bpm. Increase Esmolol/Labetalol dose to achieve strict target HR < 60 bpm.`);
  } else {
    stepByStepActionPlan.push(`2. Anti-Impulse HR Target Met: Heart rate is ${params.heartRateBpm} bpm (<= 60 bpm achieved).`);
  }

  if (params.sbpMmHg > 120) {
    if (params.heartRateBpm <= 60) {
      stepByStepActionPlan.push(`3. Add Vasodilator: HR is controlled; now add IV Nicardipine or Clevidipine infusion to achieve target SBP 100-120 mmHg.`);
    } else {
      stepByStepActionPlan.push(`3. Vasodilator HOLD: Do NOT start vasodilator until heart rate is strictly <= 60 bpm to prevent reflex tachycardia and tear shear propagation.`);
    }
  } else {
    stepByStepActionPlan.push(`3. SBP Target Met: Systolic blood pressure is ${params.sbpMmHg} mmHg (target 100-120 mmHg achieved).`);
  }

  if (params.stanfordClass === 'STANFORD_TYPE_A') {
    stepByStepActionPlan.push(`4. Surgical Emergency: Mobilize cardiothoracic surgery, perfusions team, and blood bank for emergent median sternotomy and open arch repair.`);
  } else if (params.stanfordClass === 'STANFORD_TYPE_B_COMPLICATED') {
    stepByStepActionPlan.push(`4. Endovascular Emergency: Complicated Type B dissection mandates urgent TEVAR (Thoracic Endovascular Aortic Repair) to seal the entry tear and relieve malperfusion.`);
  } else {
    stepByStepActionPlan.push(`4. Intensive Care Surveillance: Uncomplicated Type B dissection managed in ICU with continuous arterial line monitoring and strict anti-impulse pharmacotherapy.`);
  }

  if (malperfusionCount > 0) {
    stepByStepActionPlan.push(`5. Malperfusion Re-evaluation: Active branch malperfusion (${malperfusionCount} organ systems). Prepare for branch vessel stenting or surgical fenestration if TEVAR/medical therapy does not rapidly restore flow.`);
  }

  return {
    meanArterialPressureMmHg: map,
    estimatedDpDtMmHgPerSec: dpDt,
    aorticWallShearStressIndex: shearIndex,
    isAntiImpulseTargetAchieved,
    hasVasodilatorCatastrophe,
    malperfusionOrgansCount: malperfusionCount,
    inHospitalMortalityRiskPercent,
    resuscitationSafetyScore: safetyScore,
    clinicalStatusBadge,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepActionPlan
  };
}

/**
 * 5 Standard Clinical Case Presets
 */
export const AORTIC_DISSECTION_PRESETS: Record<string, AorticDissectionPatientParams> = {
  stanfordTypeASurgicalEmergency: {
    stanfordClass: 'STANFORD_TYPE_A',
    aasSubtype: 'CLASSIC_AORTIC_DISSECTION',
    maximumAorticDiameterMm: 58,
    aorticGrowthMmPerYear: 6,
    falseLumenPatency: 'PATENT',
    heartRateBpm: 56,
    sbpMmHg: 114,
    dbpMmHg: 68,
    refractoryHypertension: false,
    refractorySeverePain: true,
    betaBlocker: 'ESMOLOL_INFUSION',
    vasodilator: 'NICARDIPINE_IV',
    vasodilatorStartedBeforeBetaBlocker: false,
    coronaryMalperfusionRcaStemi: false,
    cerebralMalperfusionStroke: false,
    mesentericMalperfusionIschemia: false,
    serumLactateMmolL: 1.4,
    renalMalperfusionAki: false,
    spinalCordMalperfusionParaplegia: false,
    lowerExtremityLimbPulseDeficit: false,
    retrogradeAorticRegurgitation: 'SEVERE',
    hemopericardiumTamponadePresent: true,
    surgicalIntervention: 'EMERGENT_OPEN_ARCH_REPAIR'
  },

  vasodilatorCatastropheDisaster: {
    stanfordClass: 'STANFORD_TYPE_A',
    aasSubtype: 'CLASSIC_AORTIC_DISSECTION',
    maximumAorticDiameterMm: 62,
    aorticGrowthMmPerYear: 8,
    falseLumenPatency: 'PATENT',
    heartRateBpm: 122, // Tachycardia from reflex sympathetic activation!
    sbpMmHg: 168,
    dbpMmHg: 94,
    refractoryHypertension: true,
    refractorySeverePain: true,
    betaBlocker: 'NONE', // No beta-blocker!
    vasodilator: 'NITROPRUSSIDE_IV',
    vasodilatorStartedBeforeBetaBlocker: true, // The disaster!
    coronaryMalperfusionRcaStemi: false,
    cerebralMalperfusionStroke: false,
    mesentericMalperfusionIschemia: false,
    serumLactateMmolL: 2.2,
    renalMalperfusionAki: false,
    spinalCordMalperfusionParaplegia: false,
    lowerExtremityLimbPulseDeficit: false,
    retrogradeAorticRegurgitation: 'MILD',
    hemopericardiumTamponadePresent: false,
    surgicalIntervention: 'MEDICAL_MANAGEMENT_ONLY'
  },

  complicatedTypeBMalperfusion: {
    stanfordClass: 'STANFORD_TYPE_B_COMPLICATED',
    aasSubtype: 'CLASSIC_AORTIC_DISSECTION',
    maximumAorticDiameterMm: 46,
    aorticGrowthMmPerYear: 3,
    falseLumenPatency: 'PATENT',
    heartRateBpm: 58,
    sbpMmHg: 118,
    dbpMmHg: 72,
    refractoryHypertension: false,
    refractorySeverePain: true,
    betaBlocker: 'LABETALOL_IV',
    vasodilator: 'CLEVIDIPINE_IV',
    vasodilatorStartedBeforeBetaBlocker: false,
    coronaryMalperfusionRcaStemi: false,
    cerebralMalperfusionStroke: false,
    mesentericMalperfusionIschemia: true, // Mesenteric malperfusion!
    serumLactateMmolL: 4.6,
    renalMalperfusionAki: true,           // Renal malperfusion!
    spinalCordMalperfusionParaplegia: false,
    lowerExtremityLimbPulseDeficit: true, // Pulseless leg!
    retrogradeAorticRegurgitation: 'NONE',
    hemopericardiumTamponadePresent: false,
    surgicalIntervention: 'TEVAR_ENDOVASCULAR_STENT'
  },

  uncomplicatedTypeBMedical: {
    stanfordClass: 'STANFORD_TYPE_B_UNCOMPLICATED',
    aasSubtype: 'CLASSIC_AORTIC_DISSECTION',
    maximumAorticDiameterMm: 38,
    aorticGrowthMmPerYear: 1,
    falseLumenPatency: 'COMPLETELY_THROMBOSED',
    heartRateBpm: 54,
    sbpMmHg: 112,
    dbpMmHg: 68,
    refractoryHypertension: false,
    refractorySeverePain: false,
    betaBlocker: 'ESMOLOL_INFUSION',
    vasodilator: 'NICARDIPINE_IV',
    vasodilatorStartedBeforeBetaBlocker: false,
    coronaryMalperfusionRcaStemi: false,
    cerebralMalperfusionStroke: false,
    mesentericMalperfusionIschemia: false,
    serumLactateMmolL: 1.1,
    renalMalperfusionAki: false,
    spinalCordMalperfusionParaplegia: false,
    lowerExtremityLimbPulseDeficit: false,
    retrogradeAorticRegurgitation: 'NONE',
    hemopericardiumTamponadePresent: false,
    surgicalIntervention: 'MEDICAL_MANAGEMENT_ONLY'
  },

  tamponadePericardiocentesisBlowout: {
    stanfordClass: 'STANFORD_TYPE_A',
    aasSubtype: 'CLASSIC_AORTIC_DISSECTION',
    maximumAorticDiameterMm: 64,
    aorticGrowthMmPerYear: 10,
    falseLumenPatency: 'PATENT',
    heartRateBpm: 108,
    sbpMmHg: 84,
    dbpMmHg: 52,
    refractoryHypertension: false,
    refractorySeverePain: true,
    betaBlocker: 'NONE',
    vasodilator: 'NONE',
    vasodilatorStartedBeforeBetaBlocker: false,
    coronaryMalperfusionRcaStemi: true, // RCA STEMI mimic!
    cerebralMalperfusionStroke: false,
    mesentericMalperfusionIschemia: false,
    serumLactateMmolL: 3.5,
    renalMalperfusionAki: false,
    spinalCordMalperfusionParaplegia: false,
    lowerExtremityLimbPulseDeficit: false,
    retrogradeAorticRegurgitation: 'SEVERE',
    hemopericardiumTamponadePresent: true,
    surgicalIntervention: 'PERICARDIOCENTESIS_COMPLETE_HAZARD' // Blowout hazard!
  }
};
