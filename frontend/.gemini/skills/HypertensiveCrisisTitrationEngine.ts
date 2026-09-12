/**
 * HypertensiveCrisisTitrationEngine.ts
 * Biophysical, Hemodynamic & Pharmacotherapeutic Engine for Hypertensive Crisis
 * (Emergency vs Urgency), Target Organ Damage Stratification, Cerebral Autoregulation
 * Plateau Shifts & Precision IV Antihypertensive Titration.
 *
 * Location: frontend/.gemini/skills/HypertensiveCrisisTitrationEngine.ts
 * Guidelines: ACC/AHA 2017/2024, Neurocritical Care Society (NCS), AHA/ASA Stroke 2022,
 * European Society of Cardiology (ESC) & ACMT Toxicology.
 */

export type TargetOrganDamageType =
  | 'none' // Hypertensive Urgency
  | 'aortic_dissection' // Acute Aortic Dissection (Type A/B)
  | 'flash_pulmonary_edema' // Sympathetic Crashing Acute Pulmonary Edema (SCAPE)
  | 'ischemic_stroke_tpa' // Acute Ischemic Stroke eligible for Thrombolysis
  | 'ischemic_stroke_no_tpa' // Acute Ischemic Stroke NOT eligible for Thrombolysis (Permissive)
  | 'intracranial_hemorrhage' // Acute Intracerebral Hemorrhage (ICH)
  | 'hypertensive_encephalopathy' // Hypertensive Encephalopathy / PRES
  | 'preeclampsia_severe'; // Preeclampsia with Severe Features / Eclampsia

export type AntihypertensiveDrug =
  | 'nicardipine' // Dihydropyridine CCB (5-15 mg/h)
  | 'clevidipine' // Ultra-short esterase CCB (1-32 mg/h)
  | 'labetalol' // Combined alpha/beta blocker (push 10-80 mg, infusion 1-2 mg/min)
  | 'esmolol' // Ultra-short beta-1 blocker (50-300 mcg/kg/min)
  | 'nitroprusside' // Direct NO donor arterio/venodilator (0.25-10 mcg/kg/min)
  | 'nitroglycerin' // Venodilator / coronary dilator (5-400 mcg/min)
  | 'hydralazine'; // Direct arteriolar vasodilator (10-20 mg IV push)

export interface DrugDosing {
  drug: AntihypertensiveDrug;
  infusionRate: number; // mg/h for nicardipine/clevidipine, mcg/kg/min for esmolol/nitroprusside, mcg/min for nitroglycerin, mg/min for labetalol infusion
  ivBolusDoseMg?: number; // for labetalol, hydralazine, esmolol load
  durationHours?: number; // for nitroprusside cyanide risk
}

export interface PatientVitals {
  sbp: number; // mmHg (current or baseline)
  dbp: number; // mmHg
  heartRate: number; // bpm
  weightKg: number; // kg
  chronicHypertension: boolean; // shifts cerebral autoregulation plateau rightward
  targetOrganDamage: TargetOrganDamageType;
  historyOfAsthmaCopd?: boolean;
  heartFailureWithReducedEf?: boolean;
  renalImpairment?: boolean; // CrCl < 30 mL/min
}

export interface AutoregulationStatus {
  baselineMap: number;
  currentMap: number;
  mapDropPercent: number;
  lowerAutoregulationLimitMap: number;
  upperAutoregulationLimitMap: number;
  isBelowLowerLimit: boolean; // Watershed ischemia risk!
  isAboveUpperLimit: boolean; // Hyperperfusion / cerebral edema risk
  clinicalState: 'optimal' | 'watershed_ischemic_danger' | 'hyperperfusion_risk' | 'under_treated';
  explanation: string;
}

export interface TargetGoals {
  classification: 'Hypertensive Emergency' | 'Hypertensive Urgency';
  sbpTargetMin: number;
  sbpTargetMax: number;
  dbpTargetMin: number;
  dbpTargetMax: number;
  mapTargetMin: number;
  mapTargetMax: number;
  hrTargetMax?: number;
  timeframe: string;
  maxFirstHourMapDropPercent: number;
  guidelineRationale: string;
  contraindicatedDrugs: { drug: AntihypertensiveDrug; reason: string }[];
  preferredDrugs: AntihypertensiveDrug[];
}

export interface DrugEffectResult {
  drug: AntihypertensiveDrug;
  sbpReduction: number;
  dbpReduction: number;
  hrChange: number;
  status: 'subtherapeutic' | 'therapeutic' | 'maximum' | 'supratherapeutic';
  specialWarnings: string[];
}

export interface ToxicologyRiskAssessment {
  cyanideToxicityRisk: 'low' | 'moderate' | 'high' | 'critical';
  thiocyanateToxicityRisk: 'low' | 'moderate' | 'high';
  lipidOverloadRisk: boolean; // clevidipine > 72h or high rate
  reflexTachycardiaShearHazard: boolean; // vasodilator without beta-blocker in dissection
  precipitousDropHazard: boolean; // >25% MAP reduction in hour 1
  bronchospasmHazard: boolean; // labetalol in asthma
  negativeInotropyHazard: boolean; // beta blocker in decompensated HF
  alerts: string[];
}

export interface HypertensiveCrisisAssessment {
  vitals: {
    sbp: number;
    dbp: number;
    map: number;
    heartRate: number;
  };
  startingVitals: {
    sbp: number;
    dbp: number;
    map: number;
    heartRate: number;
  };
  targets: TargetGoals;
  autoregulation: AutoregulationStatus;
  drugEffects: DrugEffectResult[];
  toxicology: ToxicologyRiskAssessment;
  goalsAchieved: {
    sbpInTarget: boolean;
    dbpInTarget: boolean;
    mapInTarget: boolean;
    hrInTarget: boolean;
    safeRateOfDrop: boolean;
    overallSuccess: boolean;
  };
  recommendations: string[];
}

/**
 * Calculates Mean Arterial Pressure (MAP)
 */
export function calculateMap(sbp: number, dbp: number): number {
  return Math.round((dbp + (sbp - dbp) / 3) * 10) / 10;
}

/**
 * Evaluates target clinical goals based on the specific Target Organ Damage phenotype
 */
export function getTargetGoals(tod: TargetOrganDamageType, startingSbp: number, startingDbp: number): TargetGoals {
  const startingMap = calculateMap(startingSbp, startingDbp);

  switch (tod) {
    case 'none':
      // Hypertensive Urgency: NO acute TOD. Do NOT lower precipitously.
      return {
        classification: 'Hypertensive Urgency',
        sbpTargetMin: 140,
        sbpTargetMax: 160,
        dbpTargetMin: 90,
        dbpTargetMax: 100,
        mapTargetMin: calculateMap(140, 90),
        mapTargetMax: calculateMap(160, 100),
        timeframe: 'Gradual reduction over 24-48 hours using ORAL agents. Avoid IV infusions.',
        maxFirstHourMapDropPercent: 15,
        guidelineRationale: 'In Hypertensive Urgency without acute TOD, rapid IV reduction increases mortality from watershed cerebral infarction and myocardial ischemia. Outpatient or observation management with oral medications is recommended.',
        contraindicatedDrugs: [
          { drug: 'nitroprusside', reason: 'Unwarranted parenteral titration in asymptomatic urgency' },
          { drug: 'hydralazine', reason: 'Unpredictable precipitous drop and reflex tachycardia' }
        ],
        preferredDrugs: [] // Oral agents preferred (e.g. Captopril, Labetalol PO, Amlodipine)
      };

    case 'aortic_dissection':
      // Acute Aortic Dissection: Immediate aggressive reduction within 15-20 min!
      // SBP < 120 (or < 100-110) AND HR < 60 bpm. Beta-blockade BEFORE vasodilators.
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 100,
        sbpTargetMax: 120,
        dbpTargetMin: 60,
        dbpTargetMax: 80,
        mapTargetMin: 70,
        mapTargetMax: 90,
        hrTargetMax: 60,
        timeframe: 'Rapid reduction within 15-20 minutes in resuscitation bay / ICU.',
        maxFirstHourMapDropPercent: 50, // Exception to the 25% rule
        guidelineRationale: 'Acute Aortic Dissection requires urgent shear stress (dP/dt) reduction to prevent fatal aortic rupture. SBP must be reduced to < 120 mmHg and HR < 60 bpm immediately. Beta-blockers MUST be administered prior to vasodilators to prevent reflex tachycardia.',
        contraindicatedDrugs: [
          { drug: 'hydralazine', reason: 'Causes severe reflex sympathetic tachycardia, increasing aortic wall shear stress (dP/dt) and precipitating rupture' },
          { drug: 'nitroglycerin', reason: 'Venodilation induces reflex tachycardia without adequate afterload drop' }
        ],
        preferredDrugs: ['esmolol', 'labetalol', 'nicardipine', 'clevidipine']
      };

    case 'flash_pulmonary_edema':
      // SCAPE / Flash Pulmonary Edema: Acute afterload and preload reduction.
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 120,
        sbpTargetMax: 140,
        dbpTargetMin: 70,
        dbpTargetMax: 85,
        mapTargetMin: 85,
        mapTargetMax: 100,
        timeframe: 'Initial 20-30% SBP reduction over 30-60 minutes alongside BiPAP.',
        maxFirstHourMapDropPercent: 25,
        guidelineRationale: 'Sympathetic Crashing Acute Pulmonary Edema (SCAPE) is driven by massive afterload mismatch. High-dose IV nitroglycerin and IV nicardipine/clevidipine reduce afterload and preload, clearing alveolar edema. Pure beta-blockers are contraindicated due to negative inotropy.',
        contraindicatedDrugs: [
          { drug: 'esmolol', reason: 'Acute beta-1 blockade precipitates cardiogenic shock in decompensated LV failure' },
          { drug: 'labetalol', reason: 'Negative inotropic effect worsens acute pulmonary edema' }
        ],
        preferredDrugs: ['nitroglycerin', 'nicardipine', 'clevidipine', 'nitroprusside']
      };

    case 'ischemic_stroke_tpa':
      // Acute Ischemic Stroke candidate for IV Thrombolysis (tPA/TNK):
      // Must be < 185/110 prior to lytic, and < 180/105 for 24h post-lytic.
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 140,
        sbpTargetMax: 180,
        dbpTargetMin: 80,
        dbpTargetMax: 105,
        mapTargetMin: 100,
        mapTargetMax: 125,
        timeframe: 'Immediately achieve BP < 185/110 mmHg prior to administering thrombolytic; maintain < 180/105 mmHg for 24 hours.',
        maxFirstHourMapDropPercent: 20,
        guidelineRationale: 'In acute ischemic stroke receiving thrombolysis, SBP > 185 or DBP > 110 mmHg dramatically increases the risk of fatal symptomatic intracranial hemorrhage (sICH). Gentle, titratable IV agents (nicardipine, clevidipine, labetalol) are mandated.',
        contraindicatedDrugs: [
          { drug: 'nitroprusside', reason: 'Increases intracranial pressure and can induce cerebral steal' },
          { drug: 'hydralazine', reason: 'Unpredictable hypotension compromising penumbral collateral perfusion' }
        ],
        preferredDrugs: ['nicardipine', 'clevidipine', 'labetalol']
      };

    case 'ischemic_stroke_no_tpa':
      // Acute Ischemic Stroke NOT receiving thrombolysis:
      // PERMISSIVE HYPERTENSION up to 220/120. Do NOT treat unless > 220/120.
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 170,
        sbpTargetMax: 215,
        dbpTargetMin: 95,
        dbpTargetMax: 115,
        mapTargetMin: 115,
        mapTargetMax: 145,
        timeframe: 'Permissive hypertension: DO NOT treat unless SBP > 220 or DBP > 120 mmHg. If > 220/120, lower MAP by only 15% over 24 hours.',
        maxFirstHourMapDropPercent: 15,
        guidelineRationale: 'Cerebral autoregulation is lost in the ischemic penumbra; tissue perfusion depends passively on systemic MAP. Lowering BP below 220/120 mmHg starves ischemic penumbral brain tissue, converting salvageable brain to completed infarction.',
        contraindicatedDrugs: [
          { drug: 'nitroprusside', reason: 'Precipitous drop causes catastrophic penumbral infarction' },
          { drug: 'hydralazine', reason: 'Uncontrolled BP drop impairs cerebral perfusion' }
        ],
        preferredDrugs: ['labetalol', 'nicardipine']
      };

    case 'intracranial_hemorrhage':
      // Acute Intracerebral Hemorrhage (ICH): SBP 130-140 mmHg (AHA/ASA 2022)
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 130,
        sbpTargetMax: 140,
        dbpTargetMin: 70,
        dbpTargetMax: 90,
        mapTargetMin: 85,
        mapTargetMax: 105,
        timeframe: 'Achieve SBP 130-140 mmHg within 1-2 hours to prevent hematoma expansion; avoid SBP < 130 mmHg.',
        maxFirstHourMapDropPercent: 25,
        guidelineRationale: 'In acute spontaneous ICH, lowering SBP to 130-140 mmHg attenuates hematoma expansion without inducing perihematomal hypoperfusion. SBP drops below 130 mmHg are associated with increased acute renal failure and adverse neurological outcomes.',
        contraindicatedDrugs: [
          { drug: 'nitroprusside', reason: 'Cerebral venodilation increases intracranial pressure (ICP)' },
          { drug: 'hydralazine', reason: 'Increases cerebral blood volume and ICP' }
        ],
        preferredDrugs: ['nicardipine', 'clevidipine', 'labetalol']
      };

    case 'hypertensive_encephalopathy':
      // Hypertensive Encephalopathy / PRES:
      // Strict 20-25% MAP reduction in hour 1; avoid watershed infarction.
      const targetMap1stHour = Math.round(startingMap * 0.78);
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 150,
        sbpTargetMax: 170,
        dbpTargetMin: 90,
        dbpTargetMax: 100,
        mapTargetMin: Math.max(105, targetMap1stHour - 10),
        mapTargetMax: Math.max(115, targetMap1stHour + 5),
        timeframe: 'Reduce MAP by 20-25% in the first 1-2 hours, then to ~160/100 mmHg over the subsequent 2-6 hours.',
        maxFirstHourMapDropPercent: 25,
        guidelineRationale: 'Breakdown of cerebral autoregulation causes vasogenic cerebral edema (PRES). Rapid total normalization induces severe border-zone (watershed) ischemic stroke due to chronic rightward autoregulatory adaptation.',
        contraindicatedDrugs: [
          { drug: 'nitroprusside', reason: 'Increases intracranial pressure and can worsen encephalopathy' }
        ],
        preferredDrugs: ['nicardipine', 'labetalol', 'clevidipine']
      };

    case 'preeclampsia_severe':
      // Severe Preeclampsia / Eclampsia:
      // SBP 140-150, DBP 90-100 mmHg + Magnesium sulfate seizure prophylaxis.
      return {
        classification: 'Hypertensive Emergency',
        sbpTargetMin: 140,
        sbpTargetMax: 150,
        dbpTargetMin: 90,
        dbpTargetMax: 100,
        mapTargetMin: 105,
        mapTargetMax: 115,
        timeframe: 'Reduce BP to SBP 140-150 / DBP 90-100 mmHg within 30-60 minutes to prevent maternal intracranial hemorrhage.',
        maxFirstHourMapDropPercent: 25,
        guidelineRationale: 'Target SBP 140-150 / DBP 90-100 mmHg prevents maternal stroke and placental abruption while preserving uteroplacental perfusion. Administer IV Magnesium Sulfate (4-6g IV load, then 1-2g/h) for seizure prophylaxis. ACEi/ARBs and nitroprusside are strictly contraindicated.',
        contraindicatedDrugs: [
          { drug: 'nitroprusside', reason: 'Fetal cyanide accumulation and fetal toxicity' },
          { drug: 'esmolol', reason: 'Associated with severe fetal bradycardia and growth restriction' }
        ],
        preferredDrugs: ['labetalol', 'hydralazine', 'nicardipine']
      };
  }
}

/**
 * Calculates Cerebral Autoregulation thresholds and detects watershed ischemia danger.
 */
export function evaluateAutoregulation(
  startingSbp: number,
  startingDbp: number,
  currentSbp: number,
  currentDbp: number,
  chronicHypertension: boolean,
  tod: TargetOrganDamageType
): AutoregulationStatus {
  const baselineMap = calculateMap(startingSbp, startingDbp);
  const currentMap = calculateMap(currentSbp, currentDbp);
  const mapDropPercent = Math.round(((baselineMap - currentMap) / baselineMap) * 1000) / 10;

  // In normotensive individuals: autoregulation plateau is MAP 60 to 120 mmHg.
  // In chronic hypertension: arteriolar remodeling shifts plateau rightward to MAP 110 to 180 mmHg!
  const lowerLimit = chronicHypertension ? 105 : 65;
  const upperLimit = chronicHypertension ? 175 : 130;

  const isBelowLowerLimit = currentMap < lowerLimit && tod !== 'aortic_dissection';
  const isAboveUpperLimit = currentMap > upperLimit;

  let clinicalState: 'optimal' | 'watershed_ischemic_danger' | 'hyperperfusion_risk' | 'under_treated' = 'optimal';
  let explanation = 'Cerebral perfusion pressure is maintained within the safe autoregulatory plateau.';

  if (isBelowLowerLimit) {
    clinicalState = 'watershed_ischemic_danger';
    explanation = `CRITICAL DANGER: MAP ${currentMap} mmHg is BELOW the rightward-shifted lower autoregulatory threshold (${lowerLimit} mmHg). Precipitous reduction causes cerebral hypoperfusion, watershed ischemic stroke, and acute tubular necrosis.`;
  } else if (isAboveUpperLimit) {
    clinicalState = 'hyperperfusion_risk';
    explanation = `MAP ${currentMap} mmHg exceeds the upper autoregulatory breakthrough limit (${upperLimit} mmHg). Risk of capillary leakage, blood-brain barrier disruption, and hypertensive encephalopathy.`;
  } else if (mapDropPercent > 25 && tod !== 'aortic_dissection') {
    clinicalState = 'watershed_ischemic_danger';
    explanation = `WARNING: 1-hour MAP drop is ${mapDropPercent}% (exceeds recommended 20-25% limit). Risk of watershed organ hypoperfusion.`;
  } else if (mapDropPercent < 5 && tod !== 'none' && tod !== 'ischemic_stroke_no_tpa') {
    clinicalState = 'under_treated';
    explanation = 'Insufficient blood pressure control; target organ damage progression remains unmitigated.';
  }

  return {
    baselineMap,
    currentMap,
    mapDropPercent,
    lowerAutoregulationLimitMap: lowerLimit,
    upperAutoregulationLimitMap: upperLimit,
    isBelowLowerLimit,
    isAboveUpperLimit,
    clinicalState,
    explanation
  };
}

/**
 * Calculates pharmacodynamic hemodynamic response for each active IV antihypertensive agent.
 */
export function calculateDrugEffect(
  drugDosing: DrugDosing,
  patient: PatientVitals
): DrugEffectResult {
  const { drug, infusionRate, ivBolusDoseMg = 0, durationHours = 1 } = drugDosing;
  let sbpDrop = 0;
  let dbpDrop = 0;
  let hrDelta = 0;
  let status: 'subtherapeutic' | 'therapeutic' | 'maximum' | 'supratherapeutic' = 'therapeutic';
  const specialWarnings: string[] = [];

  switch (drug) {
    case 'nicardipine':
      // Infusion: 5 - 15 mg/h. Titrate by 2.5 mg/h q5-15m.
      if (infusionRate <= 0) {
        status = 'subtherapeutic';
      } else if (infusionRate < 5) {
        status = 'subtherapeutic';
        sbpDrop = infusionRate * 4;
        dbpDrop = infusionRate * 2.5;
        hrDelta = 2; // mild reflex
      } else if (infusionRate <= 15) {
        status = infusionRate === 15 ? 'maximum' : 'therapeutic';
        // Linear/sigmoid SBP drop from 20 to 55 mmHg
        sbpDrop = 20 + ((infusionRate - 5) / 10) * 35;
        dbpDrop = 12 + ((infusionRate - 5) / 10) * 22;
        hrDelta = 3;
      } else {
        status = 'supratherapeutic';
        sbpDrop = 55 + (infusionRate - 15) * 1.5;
        dbpDrop = 34 + (infusionRate - 15) * 1.0;
        specialWarnings.push('Exceeds standard maximum recommended infusion rate (15 mg/h). Risk of severe venous phlebitis if peripheral and unpredictable hypotension.');
      }
      break;

    case 'clevidipine':
      // Infusion: 1 - 32 mg/h. Ultra-short esterase metabolism (t1/2 1-2 min).
      if (infusionRate <= 0) {
        status = 'subtherapeutic';
      } else if (infusionRate < 2) {
        status = 'subtherapeutic';
        sbpDrop = infusionRate * 10;
        dbpDrop = infusionRate * 6;
      } else if (infusionRate <= 32) {
        status = infusionRate >= 24 ? 'maximum' : 'therapeutic';
        // SBP drop 25 to 65 mmHg
        sbpDrop = 20 + Math.min(45, Math.log2(infusionRate + 1) * 9);
        dbpDrop = 12 + Math.min(28, Math.log2(infusionRate + 1) * 5.5);
        if (durationHours > 24) {
          specialWarnings.push('Clevidipine is an 20% lipid emulsion (0.2 g fat/mL). Long duration infusions contribute to hypertriglyceridemia and pancreatitis.');
        }
      } else {
        status = 'supratherapeutic';
        sbpDrop = 65;
        dbpDrop = 40;
        specialWarnings.push('Exceeds maximum licensed dose (32 mg/h). Lipid overload and acute hypotension hazard.');
      }
      break;

    case 'labetalol':
      // Push: 10-80 mg q10m (max 300 mg) OR Infusion: 1-2 mg/min (max 2-8 mg/min).
      let totalLabetalolEffect = 0;
      if (ivBolusDoseMg > 0) {
        totalLabetalolEffect += Math.min(40, (ivBolusDoseMg / 80) * 28);
        hrDelta -= Math.min(22, (ivBolusDoseMg / 80) * 18);
        if (ivBolusDoseMg > 80) {
          specialWarnings.push('Single IV push dose exceeds 80 mg; administer as escalating boluses (20 -> 40 -> 80 mg).');
        }
      }
      if (infusionRate > 0) {
        // infusionRate in mg/min
        totalLabetalolEffect += Math.min(30, infusionRate * 12);
        hrDelta -= Math.min(18, infusionRate * 8);
        if (infusionRate > 2) {
          specialWarnings.push('Infusion rate > 2 mg/min exceeds initial recommended maintenance.');
        }
      }
      sbpDrop = totalLabetalolEffect;
      dbpDrop = totalLabetalolEffect * 0.65;
      if (totalLabetalolEffect >= 45) status = 'maximum';
      if (patient.historyOfAsthmaCopd) {
        specialWarnings.push('Non-selective beta-blockade (beta-2 inhibition) carries risk of severe bronchospasm in reactive airway disease.');
      }
      if (patient.heartFailureWithReducedEf) {
        specialWarnings.push('Negative inotropy and dromotropy can worsen acute decompensated heart failure.');
      }
      break;

    case 'esmolol':
      // Cardioselective beta-1 blocker. Load: 500 mcg/kg over 1m; Infusion: 50-300 mcg/kg/min.
      if (infusionRate <= 0 && ivBolusDoseMg <= 0) {
        status = 'subtherapeutic';
      } else {
        const rateRatio = Math.min(1.5, infusionRate / 200);
        sbpDrop = 10 + rateRatio * 16;
        dbpDrop = 6 + rateRatio * 11;
        let esmololHrDrop = 20 + rateRatio * 28;
        if (ivBolusDoseMg > 0) {
          esmololHrDrop += Math.min(15, (ivBolusDoseMg / 50) * 12);
        }
        hrDelta = -esmololHrDrop; // Potent bradycardic effect for dP/dt suppression
        if (infusionRate > 300) {
          status = 'supratherapeutic';
          specialWarnings.push('Exceeds standard 300 mcg/kg/min upper limit. Severe bradycardia / AV block risk.');
        } else if (infusionRate >= 200) {
          status = 'maximum';
        }
      }
      break;

    case 'nitroprusside':
      // Direct NO donor: 0.25 - 10 mcg/kg/min. Extreme potency.
      if (infusionRate <= 0) {
        status = 'subtherapeutic';
      } else if (infusionRate < 0.5) {
        sbpDrop = infusionRate * 30;
        dbpDrop = infusionRate * 25;
        hrDelta = 4;
      } else if (infusionRate <= 10) {
        status = infusionRate > 5 ? 'maximum' : 'therapeutic';
        sbpDrop = 15 + Math.min(55, infusionRate * 7.5);
        dbpDrop = 12 + Math.min(42, infusionRate * 6.0);
        hrDelta = Math.min(15, infusionRate * 2.5); // Reflex tachycardia
        if (infusionRate > 2 && durationHours > 24) {
          specialWarnings.push('High risk of cyanide / thiocyanate accumulation! Co-infuse sodium thiosulfate or switch to nicardipine/clevidipine.');
        }
      } else {
        status = 'supratherapeutic';
        sbpDrop = 70;
        dbpDrop = 55;
        hrDelta = 20;
        specialWarnings.push('CRITICAL: Infusion rate > 10 mcg/kg/min generates lethal cyanide toxicity within minutes!');
      }
      break;

    case 'nitroglycerin':
      // Infusion: 5 - 400 mcg/min. Predominantly venodilator at low doses (<100), arterial at high doses (>100).
      if (infusionRate <= 0) {
        status = 'subtherapeutic';
      } else if (infusionRate < 50) {
        sbpDrop = infusionRate * 0.25;
        dbpDrop = infusionRate * 0.15;
        hrDelta = 2;
      } else if (infusionRate <= 400) {
        status = infusionRate > 200 ? 'maximum' : 'therapeutic';
        sbpDrop = 12 + ((infusionRate - 50) / 350) * 35;
        dbpDrop = 8 + ((infusionRate - 50) / 350) * 22;
        hrDelta = 5;
        if (infusionRate >= 200) {
          specialWarnings.push('High dose infusion: excellent for preload and afterload reduction in pulmonary edema (SCAPE). Ensure adequate hydration.');
        }
      } else {
        status = 'supratherapeutic';
        sbpDrop = 50;
        dbpDrop = 32;
        specialWarnings.push('Rates > 400 mcg/min lead to nitrate tolerance and profound venodilatory pooling.');
      }
      break;

    case 'hydralazine':
      // Direct arteriolar dilator: 10-20 mg IV push q4-6h.
      const dose = ivBolusDoseMg > 0 ? ivBolusDoseMg : 10;
      sbpDrop = Math.min(45, (dose / 20) * 32);
      dbpDrop = Math.min(30, (dose / 20) * 22);
      hrDelta = Math.min(25, (dose / 20) * 18); // Significant reflex tachycardia!
      specialWarnings.push('Prolonged, unpredictable half-life (up to 8 hours). Marked reflex tachycardia can worsen myocardial ischemia or aortic dissection.');
      break;
  }

  return {
    drug,
    sbpReduction: Math.round(sbpDrop * 10) / 10,
    dbpReduction: Math.round(dbpDrop * 10) / 10,
    hrChange: Math.round(hrDelta),
    status,
    specialWarnings
  };
}

/**
 * Assesses toxicology hazards: Cyanide/Thiocyanate, Reflex Tachycardia shear hazard,
 * lipid overload, and precipitous drops.
 */
export function assessToxicologyRisks(
  drugDosings: DrugDosing[],
  patient: PatientVitals,
  mapDropPercent: number
): ToxicologyRiskAssessment {
  const alerts: string[] = [];
  let cyanideRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let thiocyanateRisk: 'low' | 'moderate' | 'high' = 'low';
  let lipidOverload = false;
  let reflexTachycardiaShearHazard = false;
  let precipitousDropHazard = mapDropPercent > 25 && patient.targetOrganDamage !== 'aortic_dissection';
  let bronchospasmHazard = false;
  let negativeInotropyHazard = false;

  const hasDissection = patient.targetOrganDamage === 'aortic_dissection';
  const hasPureVasodilator = drugDosings.some(d => ['nicardipine', 'clevidipine', 'nitroprusside', 'hydralazine'].includes(d.drug) && d.infusionRate > 0);
  const hasBetaBlocker = drugDosings.some(d => (d.drug === 'esmolol' && d.infusionRate > 0) || (d.drug === 'labetalol' && (d.infusionRate > 0 || (d.ivBolusDoseMg || 0) > 0)));

  // Reflex Tachycardia in Aortic Dissection Hazard:
  if (hasDissection && hasPureVasodilator && !hasBetaBlocker) {
    reflexTachycardiaShearHazard = true;
    alerts.push('LETHAL DISSECTION PITFALL: Vasodilator therapy initiated without concurrent beta-blockade! Reflex sympathetic surge increases dP/dt (aortic shear stress), promoting retrograde dissection extension and rupture.');
  }

  // Nitroprusside Cyanide & Thiocyanate Assessment
  const snp = drugDosings.find(d => d.drug === 'nitroprusside');
  if (snp && snp.infusionRate > 0) {
    const rate = snp.infusionRate;
    const hrs = snp.durationHours || 1;

    if (rate > 10) {
      cyanideRisk = 'critical';
      alerts.push('LETHAL CYANIDE TOXICITY HAZARD: Nitroprusside infusion > 10 mcg/kg/min saturates rhodanese sulfane conversion. Free cyanide poisons cytochrome c oxidase, causing severe refractory lactic acidosis and arrest.');
    } else if (rate > 4 || (rate > 2 && hrs > 24)) {
      cyanideRisk = 'high';
      alerts.push('HIGH CYANIDE ACCUMULATION RISK: Cumulative nitroprusside dose exceeds safe endogenous thiosulfate clearance. Co-infuse sodium thiosulfate (1g per 100mg SNP) and monitor serial serum lactates.');
    } else if (rate > 2 || hrs > 12) {
      cyanideRisk = 'moderate';
    }

    if (patient.renalImpairment && hrs > 24) {
      thiocyanateRisk = 'high';
      alerts.push('THIOCYANATE ACCUMULATION RISK: In renal insufficiency (CrCl < 30 mL/min), thiocyanate clearance is severely impaired (t1/2 prolonged up to 7-14 days). Risk of thiocyanate encephalopathy, tremors, and psychosis.');
    } else if (hrs > 48) {
      thiocyanateRisk = 'moderate';
    }
  }

  // Clevidipine Lipid Overload
  const clev = drugDosings.find(d => d.drug === 'clevidipine');
  if (clev && clev.infusionRate > 0 && (clev.durationHours || 1) > 24) {
    lipidOverload = true;
    alerts.push('Clevidipine Lipid Overload: Infusion duration > 24 hours provides significant lipid calories (0.2 g lipid/mL). Monitor serum triglycerides to prevent hypertriglyceridemia-induced acute pancreatitis.');
  }

  // Precipitous Drop Alert
  if (precipitousDropHazard) {
    alerts.push(`PRECIPITOUS BP REDUCTION HAZARD: 1-hour MAP reduction of ${mapDropPercent}% violates the 20-25% safety ceiling. High risk of watershed cerebral infarction and acute kidney injury.`);
  }

  // Labetalol in Asthma/COPD
  const lab = drugDosings.find(d => d.drug === 'labetalol');
  if (lab && patient.historyOfAsthmaCopd && ((lab.ivBolusDoseMg || 0) > 0 || lab.infusionRate > 0)) {
    bronchospasmHazard = true;
    alerts.push('Bronchospasm Risk: Non-selective beta-antagonism from Labetalol may provoke bronchoconstriction in patients with underlying asthma/COPD. Consider switching to Nicardipine.');
  }

  // Beta blocker in Decompensated HF / Pulmonary Edema
  if ((patient.heartFailureWithReducedEf || patient.targetOrganDamage === 'flash_pulmonary_edema') && (hasBetaBlocker)) {
    negativeInotropyHazard = true;
    alerts.push('Negative Inotropic Pitfall: Beta-blockade in acute pulmonary edema / acute heart failure exacerbation suppresses myocardial contractility and can precipitate cardiogenic shock.');
  }

  return {
    cyanideToxicityRisk: cyanideRisk,
    thiocyanateToxicityRisk: thiocyanateRisk,
    lipidOverloadRisk: lipidOverload,
    reflexTachycardiaShearHazard,
    precipitousDropHazard,
    bronchospasmHazard,
    negativeInotropyHazard,
    alerts
  };
}

/**
 * Master Evaluation Function: Combines Vitals, Active Therapies, Autoregulation,
 * Target Goals, and Toxicology Risk.
 */
export function evaluateHypertensiveCrisis(
  patient: PatientVitals,
  drugDosings: DrugDosing[]
): HypertensiveCrisisAssessment {
  const startingSbp = patient.sbp;
  const startingDbp = patient.dbp;
  const startingHr = patient.heartRate;
  const startingMap = calculateMap(startingSbp, startingDbp);

  // Compute aggregate drug reductions
  let totalSbpReduction = 0;
  let totalDbpReduction = 0;
  let totalHrChange = 0;
  const drugEffects: DrugEffectResult[] = [];

  for (const dosing of drugDosings) {
    const effect = calculateDrugEffect(dosing, patient);
    drugEffects.push(effect);
    totalSbpReduction += effect.sbpReduction;
    totalDbpReduction += effect.dbpReduction;
    totalHrChange += effect.hrChange;
  }

  // Beta-blockers and vasodilators act via complementary mechanisms (CO reduction + SVR reduction)
  // Only apply diminishing returns if multiple pure vasodilators are used simultaneously
  const vasodilatorCount = drugDosings.filter(d => ['nicardipine', 'clevidipine', 'nitroprusside', 'nitroglycerin', 'hydralazine'].includes(d.drug) && d.infusionRate > 0).length;
  if (vasodilatorCount > 1) {
    totalSbpReduction *= 0.90;
    totalDbpReduction *= 0.90;
  }

  const currentSbp = Math.max(50, Math.round(startingSbp - totalSbpReduction));
  const currentDbp = Math.max(30, Math.round(startingDbp - totalDbpReduction));
  const currentHr = Math.max(35, Math.round(startingHr + totalHrChange));
  const currentMap = calculateMap(currentSbp, currentDbp);

  const targets = getTargetGoals(patient.targetOrganDamage, startingSbp, startingDbp);
  const autoregulation = evaluateAutoregulation(
    startingSbp,
    startingDbp,
    currentSbp,
    currentDbp,
    patient.chronicHypertension,
    patient.targetOrganDamage
  );
  const toxicology = assessToxicologyRisks(drugDosings, patient, autoregulation.mapDropPercent);

  // Goal achievement checking
  const sbpInTarget = currentSbp >= targets.sbpTargetMin && currentSbp <= targets.sbpTargetMax;
  const dbpInTarget = currentDbp >= targets.dbpTargetMin && currentDbp <= targets.dbpTargetMax;
  const mapInTarget = currentMap >= targets.mapTargetMin && currentMap <= targets.mapTargetMax;
  const hrInTarget = targets.hrTargetMax ? currentHr <= targets.hrTargetMax : true;
  const safeRateOfDrop = patient.targetOrganDamage === 'aortic_dissection' || autoregulation.mapDropPercent <= targets.maxFirstHourMapDropPercent;

  const overallSuccess =
    (sbpInTarget || mapInTarget) &&
    hrInTarget &&
    safeRateOfDrop &&
    !toxicology.reflexTachycardiaShearHazard &&
    toxicology.cyanideToxicityRisk !== 'critical';

  const recommendations: string[] = [];

  if (patient.targetOrganDamage === 'none') {
    recommendations.push('Discontinue or avoid IV antihypertensive infusions. Transition to oral regimen (e.g. Amlodipine 5-10 mg, Captopril 25 mg, or Labetalol 200 mg PO) with outpatient follow-up within 24-72 hours.');
  } else if (patient.targetOrganDamage === 'aortic_dissection') {
    if (!hasBetaBlocker(drugDosings)) {
      recommendations.push('URGENT: Initiate IV Esmolol (500 mcg/kg bolus, infusion 50-300 mcg/kg/min) or IV Labetalol immediately to achieve HR < 60 bpm BEFORE titrating nicardipine/clevidipine.');
    }
    if (currentSbp > 120) {
      recommendations.push('Titrate IV Nicardipine (up to 15 mg/h) or IV Clevidipine to rapidly lower SBP < 120 mmHg (target 100-110 mmHg).');
    }
  } else if (patient.targetOrganDamage === 'flash_pulmonary_edema') {
    recommendations.push('Administer high-dose IV Nitroglycerin (100-300 mcg/min) or IV Nicardipine alongside non-invasive ventilation (BiPAP) for aggressive afterload reduction.');
  } else if (patient.targetOrganDamage === 'ischemic_stroke_no_tpa') {
    if (startingSbp < 220 && startingDbp < 120) {
      recommendations.push('PERMISSIVE HYPERTENSION: Withhold all antihypertensive therapy. SBP < 220 and DBP < 120 mmHg maintains collateral perfusion to ischemic brain penumbra.');
    }
  }

  if (autoregulation.isBelowLowerLimit) {
    recommendations.push('HALT OR DOWN-TITRATE IV INFUSIONS: MAP has fallen below the rightward-shifted autoregulation threshold. Immediate risk of watershed stroke.');
  }

  return {
    vitals: {
      sbp: currentSbp,
      dbp: currentDbp,
      map: currentMap,
      heartRate: currentHr
    },
    startingVitals: {
      sbp: startingSbp,
      dbp: startingDbp,
      map: startingMap,
      heartRate: startingHr
    },
    targets,
    autoregulation,
    drugEffects,
    toxicology,
    goalsAchieved: {
      sbpInTarget,
      dbpInTarget,
      mapInTarget,
      hrInTarget,
      safeRateOfDrop,
      overallSuccess
    },
    recommendations
  };
}

function hasBetaBlocker(drugDosings: DrugDosing[]): boolean {
  return drugDosings.some(d => (d.drug === 'esmolol' && d.infusionRate > 0) || (d.drug === 'labetalol' && (d.infusionRate > 0 || (d.ivBolusDoseMg || 0) > 0)));
}

/**
 * 4 High-Fidelity Clinical Case Presets
 */
export const CLINICAL_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  patient: PatientVitals;
  initialDrugs: DrugDosing[];
}[] = [
  {
    id: 'aortic-dissection-type-a',
    name: 'Acute Stanford Type A Aortic Dissection',
    badge: 'Surgical Emergency',
    description: '56-year-old male with tearing chest pain radiating to back. SBP 195/115 mmHg, HR 105 bpm. Requires immediate SBP < 120 mmHg and HR < 60 bpm within 20 minutes to prevent fatal aortic rupture.',
    patient: {
      sbp: 195,
      dbp: 115,
      heartRate: 105,
      weightKg: 85,
      chronicHypertension: true,
      targetOrganDamage: 'aortic_dissection'
    },
    initialDrugs: []
  },
  {
    id: 'hypertensive-encephalopathy-pres',
    name: 'Hypertensive Encephalopathy & PRES',
    badge: 'Neuro-Emergency',
    description: '62-year-old female with long-standing untreated HTN presenting with severe headache, visual blurring, and confusion. SBP 230/135 mmHg, HR 86 bpm. Autoregulation shifted rightward; max 20-25% MAP reduction in hour 1.',
    patient: {
      sbp: 230,
      dbp: 135,
      heartRate: 86,
      weightKg: 70,
      chronicHypertension: true,
      targetOrganDamage: 'hypertensive_encephalopathy'
    },
    initialDrugs: []
  },
  {
    id: 'scape-flash-pulmonary-edema',
    name: 'Sympathetic Crashing Acute Pulmonary Edema (SCAPE)',
    badge: 'Cardiopulmonary Critical Care',
    description: '68-year-old male in severe respiratory distress, orthopneic, bilateral diffuse rales, SpO2 84%. SBP 235/130 mmHg, HR 115 bpm. Massive afterload mismatch requiring high-dose nitroglycerin and nicardipine.',
    patient: {
      sbp: 235,
      dbp: 130,
      heartRate: 115,
      weightKg: 80,
      chronicHypertension: true,
      targetOrganDamage: 'flash_pulmonary_edema',
      heartFailureWithReducedEf: true
    },
    initialDrugs: []
  },
  {
    id: 'ischemic-stroke-permissive-trap',
    name: 'Acute Ischemic Stroke: Permissive Hypertension Trap',
    badge: 'Neuro-Vascular Trap',
    description: '74-year-old female with right hemiparesis and aphasia (NIHSS 15) presenting 7 hours after symptom onset (not a candidate for IV thrombolysis). SBP 205/115 mmHg. Permissive hypertension must be preserved.',
    patient: {
      sbp: 205,
      dbp: 115,
      heartRate: 78,
      weightKg: 65,
      chronicHypertension: true,
      targetOrganDamage: 'ischemic_stroke_no_tpa'
    },
    initialDrugs: []
  }
];
