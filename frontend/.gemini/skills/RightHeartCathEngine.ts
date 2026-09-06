/**
 * RightHeartCathEngine.ts
 *
 * Comprehensive biophysical engine for Right Heart Catheterization (RHC),
 * Fick Principle hemodynamics, and Pulmonary Hypertension (PH) classification.
 *
 * Implements:
 * 1. Direct & Indirect Fick Principle for Cardiac Output & Cardiac Index
 * 2. Pulmonary Vascular Resistance (PVR in Wood Units and dynes·s·cm⁻⁵)
 * 3. Systemic Vascular Resistance (SVR)
 * 4. Transpulmonary Gradient (TPG) & Diastolic Pulmonary Gradient (DPG)
 * 5. Pulmonary Arterial Capacitance (PAC) & Compliance
 * 6. Pulmonary Artery Pulsatility Index (PAPi) for Right Ventricular Failure
 * 7. 2022 ESC/ERS Pulmonary Hypertension Classification (Pre-capillary, Ipc-PH, Cpc-PH)
 * 8. Acute Vasoreactivity Testing Protocol (Sitbon Criteria for Inhaled Nitric Oxide)
 *
 * Location: frontend/.gemini/skills/RightHeartCathEngine.ts
 */

export interface RhcPressures {
  rightAtrialPressureMeanMmHg: number; // RAP / CVP (typical 2 - 6 mmHg)
  rvSystolicMmHg: number; // RV systolic (typical 15 - 30 mmHg)
  rvEndDiastolicMmHg: number; // RVEDP (typical 2 - 8 mmHg)
  paSystolicMmHg: number; // sPAP (typical 15 - 30 mmHg)
  paDiastolicMmHg: number; // dPAP (typical 4 - 12 mmHg)
  paMeanMmHg: number; // mPAP (typical 9 - 18 mmHg)
  pulmonaryCapillaryWedgeMmHg: number; // PAWP / PCWP (typical 4 - 12 mmHg)
  aorticSystolicMmHg: number; // SBP (typical 100 - 140 mmHg)
  aorticDiastolicMmHg: number; // DBP (typical 60 - 90 mmHg)
  aorticMeanMmHg: number; // MAP (typical 70 - 105 mmHg)
}

export interface FickParameters {
  hemoglobinGPerDl: number; // Hb in g/dL (e.g. 13.5)
  arterialO2SaturationPct: number; // SaO2 in % (e.g. 98%)
  mixedVenousO2SaturationPct: number; // SvO2 in PA in % (e.g. 72%)
  vo2Method: 'MEASURED' | 'ESTIMATED_BERGSTRA' | 'ESTIMATED_DEHMER';
  measuredVo2MlMin?: number; // Measured oxygen consumption
  patientAge: number;
  patientSex: 'MALE' | 'FEMALE';
  patientHeightCm: number;
  patientWeightKg: number;
  heartRateBpm: number;
}

export interface VasoreactivityTest {
  performed: boolean;
  agentUsed?: 'INHALED_NITRIC_OXIDE' | 'ILOPROST' | 'EPOPROSTENOL';
  postDrugPaMeanMmHg?: number;
  postDrugPawpMmHg?: number;
  postDrugCardiacOutputLMin?: number;
}

export type PhHemodynamicPhenotype =
  | 'NO_PULMONARY_HYPERTENSION'
  | 'PRE_CAPILLARY_PH'
  | 'ISOLATED_POST_CAPILLARY_PH' // Ipc-PH
  | 'COMBINED_POST_AND_PRE_CAPILLARY_PH' // Cpc-PH
  | 'UNCLASSIFIED_PH';

export type ClinicalPhGroup =
  | 'GROUP_1_PAH'
  | 'GROUP_2_LEFT_HEART_DISEASE'
  | 'GROUP_3_LUNG_DISEASE_HYPOXIA'
  | 'GROUP_4_CTEPH'
  | 'GROUP_5_MULTIPLE_MECHANISMS'
  | 'NONE';

export interface RhcEvaluation {
  // Body Surface Area
  bsaM2: number;

  // Oxygen Consumption & Fick CO
  calculatedVo2MlMin: number;
  arterioVenousO2ContentDiffMlDl: number; // C(a-v)O2
  cardiacOutputLMin: number;
  cardiacIndexLMinM2: number;
  strokeVolumeMl: number;
  strokeVolumeIndexMlM2: number;

  // Resistance Metrics
  transpulmonaryGradientMmHg: number; // TPG = mPAP - PAWP
  diastolicPulmonaryGradientMmHg: number; // DPG = dPAP - PAWP
  pvrWoodUnits: number; // (mPAP - PAWP) / CO
  pvrDyneSecCm5: number; // pvrWoodUnits * 80
  svrWoodUnits: number; // (MAP - RAP) / CO
  svrDyneSecCm5: number; // svrWoodUnits * 80
  totalPulmonaryResistanceWoodUnits: number; // mPAP / CO

  // Compliance & Right Ventricular Performance
  pulmonaryArteryCapacitanceMlMmHg: number; // SV / (sPAP - dPAP)
  pulmonaryArteryPulsatilityIndex: number; // PAPi = (sPAP - dPAP) / RAP
  rvFailureRisk: 'LOW' | 'MODERATE' | 'SEVERE_RV_FAILURE';

  // 2022 ESC/ERS PH Phenotyping
  hasPulmonaryHypertension: boolean; // mPAP > 20 mmHg
  phenotype: PhHemodynamicPhenotype;
  phenotypeTitle: string;
  phenotypeDescription: string;
  suggestedClinicalGroup: ClinicalPhGroup;

  // Vasoreactivity Assessment
  vasoreactiveResponder: boolean; // Sitbon criteria: drop >= 10 to <= 40 mmHg with CO preserved
  vasoreactivitySummary: string;
  treatmentRecommendation: string;
}

/**
 * Calculates Body Surface Area (DuBois formula)
 */
export function calculateBsa(heightCm: number, weightKg: number): number {
  return (
    Math.round(
      0.007184 * Math.pow(Math.max(50, heightCm), 0.725) * Math.pow(Math.max(20, weightKg), 0.425) * 100
    ) / 100
  );
}

/**
 * Calculates Oxygen Consumption (VO2)
 */
export function estimateVo2(params: FickParameters, bsa: number): number {
  if (params.vo2Method === 'MEASURED' && params.measuredVo2MlMin && params.measuredVo2MlMin > 50) {
    return Math.round(params.measuredVo2MlMin);
  }

  if (params.vo2Method === 'ESTIMATED_BERGSTRA') {
    // Bergstra formula: VO2 = 138.1 - (11.49 * ln(age)) + (0.378 * HR) in mL/min/m2
    const logAge = Math.log(Math.max(18, params.patientAge));
    const sexFactor = params.patientSex === 'MALE' ? 1.0 : 0.92;
    const vo2PerM2 = (138.1 - 11.49 * logAge + 0.378 * params.heartRateBpm) * sexFactor;
    return Math.round(vo2PerM2 * bsa);
  }

  // Dehmer formula / Standard approximation: ~125 mL/min/m2
  return Math.round(125 * bsa);
}

/**
 * Master Right Heart Catheterization Evaluator
 */
export function evaluateRightHeartCath(
  pressures: RhcPressures,
  fick: FickParameters,
  vaso?: VasoreactivityTest
): RhcEvaluation {
  const bsaM2 = calculateBsa(fick.patientHeightCm, fick.patientWeightKg);
  const calculatedVo2MlMin = estimateVo2(fick, bsaM2);

  // Fick Equation:
  // Arterial O2 content: CaO2 = 1.34 * Hb * (SaO2 / 100)  [mL O2 / dL blood]
  // Venous O2 content: CvO2 = 1.34 * Hb * (SvO2 / 100)
  // C(a-v)O2 = 1.34 * Hb * (SaO2 - SvO2) / 100 [mL/dL] -> convert to mL/L by multiplying 10
  const safeHb = Math.max(5, fick.hemoglobinGPerDl);
  const safeSaO2 = Math.min(100, Math.max(50, fick.arterialO2SaturationPct));
  const safeSvO2 = Math.min(safeSaO2 - 1, Math.max(20, fick.mixedVenousO2SaturationPct));

  const diffO2Pct = (safeSaO2 - safeSvO2) / 100;
  const arterioVenousO2ContentDiffMlDl = Math.round(1.34 * safeHb * diffO2Pct * 100) / 100;
  const avDiffMlPerL = arterioVenousO2ContentDiffMlDl * 10;

  // CO = VO2 / C(a-v)O2 (L/min)
  const rawCo = calculatedVo2MlMin / Math.max(0.5, avDiffMlPerL);
  const cardiacOutputLMin = Math.round(rawCo * 100) / 100;
  const cardiacIndexLMinM2 = Math.round((cardiacOutputLMin / Math.max(0.5, bsaM2)) * 100) / 100;

  // Stroke Volume
  const safeHr = Math.max(30, fick.heartRateBpm);
  const strokeVolumeMl = Math.round((cardiacOutputLMin * 1000) / safeHr);
  const strokeVolumeIndexMlM2 = Math.round((strokeVolumeMl / Math.max(0.5, bsaM2)) * 10) / 10;

  // Gradients
  const transpulmonaryGradientMmHg = Math.round(
    pressures.paMeanMmHg - pressures.pulmonaryCapillaryWedgeMmHg
  );
  const diastolicPulmonaryGradientMmHg = Math.round(
    pressures.paDiastolicMmHg - pressures.pulmonaryCapillaryWedgeMmHg
  );

  // Resistances
  // PVR = (mPAP - PAWP) / CO  (Wood Units)
  const safeCo = Math.max(0.5, cardiacOutputLMin);
  const pvrWoodUnits =
    Math.round(
      (Math.max(0, pressures.paMeanMmHg - pressures.pulmonaryCapillaryWedgeMmHg) / safeCo) * 100
    ) / 100;
  const pvrDyneSecCm5 = Math.round(pvrWoodUnits * 80);

  // SVR = (MAP - RAP) / CO * 80
  const svrWoodUnits =
    Math.round(
      (Math.max(0, pressures.aorticMeanMmHg - pressures.rightAtrialPressureMeanMmHg) / safeCo) * 10
    ) / 10;
  const svrDyneSecCm5 = Math.round(svrWoodUnits * 80);

  // Total Pulmonary Resistance (TPR) = mPAP / CO
  const totalPulmonaryResistanceWoodUnits =
    Math.round((pressures.paMeanMmHg / safeCo) * 100) / 100;

  // Compliance & Right Ventricular Performance
  const pulsePressurePa = Math.max(1, pressures.paSystolicMmHg - pressures.paDiastolicMmHg);
  const pulmonaryArteryCapacitanceMlMmHg =
    Math.round((strokeVolumeMl / pulsePressurePa) * 100) / 100;

  // PAPi = (sPAP - dPAP) / RAP
  const safeRap = Math.max(0.5, pressures.rightAtrialPressureMeanMmHg);
  const pulmonaryArteryPulsatilityIndex = Math.round((pulsePressurePa / safeRap) * 100) / 100;

  let rvFailureRisk: 'LOW' | 'MODERATE' | 'SEVERE_RV_FAILURE' = 'LOW';
  if (pulmonaryArteryPulsatilityIndex < 1.0 || pressures.rightAtrialPressureMeanMmHg >= 15) {
    rvFailureRisk = 'SEVERE_RV_FAILURE';
  } else if (pulmonaryArteryPulsatilityIndex < 2.0 || pressures.rightAtrialPressureMeanMmHg >= 10) {
    rvFailureRisk = 'MODERATE';
  }

  // 2022 ESC/ERS Pulmonary Hypertension Classification
  // PH definition: mPAP > 20 mmHg at rest
  const hasPulmonaryHypertension = pressures.paMeanMmHg > 20;
  let phenotype: PhHemodynamicPhenotype = 'NO_PULMONARY_HYPERTENSION';
  let phenotypeTitle = 'Normal Pulmonary Hemodynamics';
  let phenotypeDescription =
    'Mean pulmonary arterial pressure <= 20 mmHg and normal pulmonary vascular resistance (< 2 Wood Units). No hemodynamic evidence of pulmonary hypertension.';
  let suggestedClinicalGroup: ClinicalPhGroup = 'NONE';

  if (hasPulmonaryHypertension) {
    const isPostCapillary = pressures.pulmonaryCapillaryWedgeMmHg > 15;
    const isElevatedPvr = pvrWoodUnits > 2.0;

    if (!isPostCapillary) {
      // Pre-capillary PH: mPAP > 20, PAWP <= 15, PVR > 2 WU
      if (isElevatedPvr) {
        phenotype = 'PRE_CAPILLARY_PH';
        phenotypeTitle = 'Pre-Capillary Pulmonary Hypertension';
        phenotypeDescription =
          'Characterized by mPAP > 20 mmHg, normal left heart filling pressure (PAWP <= 15 mmHg), and elevated pulmonary vascular resistance (PVR > 2.0 Wood Units). Represents intrinsic pulmonary arterial/microvascular remodeling (Group 1 PAH, Group 3 Lung Disease, or Group 4 CTEPH).';
        suggestedClinicalGroup = 'GROUP_1_PAH';
      } else {
        phenotype = 'UNCLASSIFIED_PH';
        phenotypeTitle = 'Unclassified Pulmonary Hypertension';
        phenotypeDescription =
          'Elevated mPAP > 20 mmHg with normal wedge (<= 15 mmHg) but normal PVR (<= 2.0 WU), commonly seen in high cardiac output states (anemia, arteriovenous fistulas, cirrhosis).';
        suggestedClinicalGroup = 'GROUP_5_MULTIPLE_MECHANISMS';
      }
    } else {
      // Post-capillary PH: mPAP > 20, PAWP > 15
      if (!isElevatedPvr) {
        // Isolated post-capillary (Ipc-PH)
        phenotype = 'ISOLATED_POST_CAPILLARY_PH';
        phenotypeTitle = 'Isolated Post-Capillary Pulmonary Hypertension (Ipc-PH)';
        phenotypeDescription =
          'Passive backward transmission of elevated left heart filling pressures (PAWP > 15 mmHg) with preserved pulmonary vascular architecture (PVR <= 2.0 Wood Units and DPG < 7 mmHg). Typical of Group 2 Left Heart Disease (HFrEF, HFpEF, or mitral/aortic valvular disease).';
        suggestedClinicalGroup = 'GROUP_2_LEFT_HEART_DISEASE';
      } else {
        // Combined post- and pre-capillary (Cpc-PH)
        phenotype = 'COMBINED_POST_AND_PRE_CAPILLARY_PH';
        phenotypeTitle = 'Combined Post- and Pre-Capillary PH (Cpc-PH)';
        phenotypeDescription =
          'Severe pulmonary venous hypertension complicated by superimposed pulmonary arterial vascular remodeling (PAWP > 15 mmHg AND PVR > 2.0 Wood Units, often with DPG >= 7 mmHg). Indicates chronic left heart failure with secondary precapillary pulmonary vasculopathy.';
        suggestedClinicalGroup = 'GROUP_2_LEFT_HEART_DISEASE';
      }
    }
  }

  // Vasoreactivity Assessment (Sitbon Criteria for Group 1 PAH)
  let vasoreactiveResponder = false;
  let vasoreactivitySummary = 'Acute vasoreactivity testing not performed or not indicated.';
  let treatmentRecommendation = '';

  if (vaso && vaso.performed && vaso.postDrugPaMeanMmHg !== undefined) {
    const deltaMpap = pressures.paMeanMmHg - vaso.postDrugPaMeanMmHg;
    const finalMpap = vaso.postDrugPaMeanMmHg;
    const postCo = vaso.postDrugCardiacOutputLMin ?? cardiacOutputLMin;

    // Positive responder: mPAP drops >= 10 mmHg to <= 40 mmHg with CO unchanged or increased
    if (deltaMpap >= 10 && finalMpap <= 40 && postCo >= cardiacOutputLMin - 0.2) {
      vasoreactiveResponder = true;
      vasoreactivitySummary = `POSITIVE VASOREACTIVE RESPONDER (Sitbon Criteria): mPAP dropped by ${Math.round(deltaMpap)} mmHg to ${finalMpap} mmHg with preserved cardiac output.`;
      treatmentRecommendation =
        'Candidate for high-dose Calcium Channel Blocker (CCB) monotherapy (e.g., Amlodipine, Diltiazem). Requires rigorous follow-up at 3-6 months with repeat RHC to confirm sustained hemodynamic response (NYHA Class I/II).';
    } else {
      vasoreactiveResponder = false;
      vasoreactivitySummary = `NON-RESPONDER: Acute vasodilator challenge did not achieve both >= 10 mmHg reduction and final mPAP <= 40 mmHg.`;
      treatmentRecommendation =
        'CCB therapy is CONTRAINDICATED. Initiate combination targeted PAH-specific therapy (ERA + PDE-5 inhibitor, e.g., Ambrisentan + Tadalafil, or parenteral prostacyclin analogue for high-risk stratification).';
    }
  } else {
    if (phenotype === 'PRE_CAPILLARY_PH') {
      treatmentRecommendation =
        'Perform acute vasoreactivity challenge with inhaled Nitric Oxide (20 ppm) or Iloprost for idiopathic/heritable/drug-induced PAH. Check ventilation-perfusion (V/Q) scan to rule out CTEPH (Group 4) and high-resolution chest CT for interstitial lung disease (Group 3).';
    } else if (phenotype === 'ISOLATED_POST_CAPILLARY_PH') {
      treatmentRecommendation =
        'Targeted PAH therapy (ERAs, PDE-5 inhibitors) is CONTRAINDICATED and potentially harmful (pulmonary edema). Optimize left heart failure guideline-directed medical therapy (GDMT: SGLT2i, diuretics, ARNI, beta-blockers) or repair valvular lesions.';
    } else if (phenotype === 'COMBINED_POST_AND_PRE_CAPILLARY_PH') {
      treatmentRecommendation =
        'Optimize volume status with aggressive loop diuretics. After reaching euvolemia (PAWP <= 15), re-evaluate hemodynamics. Targeted PAH vasodilator trials remain experimental; multidisciplinary Heart Failure/PH consensus required.';
    } else {
      treatmentRecommendation =
        'Maintain routine clinical surveillance. Re-evaluate exercise hemodynamics if unexplained exertional dyspnea persists.';
    }
  }

  return {
    bsaM2,
    calculatedVo2MlMin,
    arterioVenousO2ContentDiffMlDl,
    cardiacOutputLMin,
    cardiacIndexLMinM2,
    strokeVolumeMl,
    strokeVolumeIndexMlM2,
    transpulmonaryGradientMmHg,
    diastolicPulmonaryGradientMmHg,
    pvrWoodUnits,
    pvrDyneSecCm5,
    svrWoodUnits,
    svrDyneSecCm5,
    totalPulmonaryResistanceWoodUnits,
    pulmonaryArteryCapacitanceMlMmHg,
    pulmonaryArteryPulsatilityIndex,
    rvFailureRisk,
    hasPulmonaryHypertension,
    phenotype,
    phenotypeTitle,
    phenotypeDescription,
    suggestedClinicalGroup,
    vasoreactiveResponder,
    vasoreactivitySummary,
    treatmentRecommendation,
  };
}

/**
 * 8 Clinical Scenarios for Right Heart Catheterization Workstation
 */
export interface RhcPreset {
  id: string;
  name: string;
  description: string;
  pressures: RhcPressures;
  fick: FickParameters;
  vaso?: VasoreactivityTest;
}

export const RHC_PRESETS: RhcPreset[] = [
  {
    id: 'normal-hemodynamics',
    name: 'Normal Baseline Pulmonary Hemodynamics',
    description: '42-year-old undergoing cardiac donor evaluation. Normal right atrial, pulmonary arterial, and wedge pressures with pristine pulmonary vascular resistance.',
    pressures: {
      rightAtrialPressureMeanMmHg: 4,
      rvSystolicMmHg: 22,
      rvEndDiastolicMmHg: 4,
      paSystolicMmHg: 22,
      paDiastolicMmHg: 9,
      paMeanMmHg: 14,
      pulmonaryCapillaryWedgeMmHg: 8,
      aorticSystolicMmHg: 122,
      aorticDiastolicMmHg: 76,
      aorticMeanMmHg: 91,
    },
    fick: {
      hemoglobinGPerDl: 14.2,
      arterialO2SaturationPct: 98,
      mixedVenousO2SaturationPct: 74,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 42,
      patientSex: 'MALE',
      patientHeightCm: 178,
      patientWeightKg: 78,
      heartRateBpm: 68,
    },
  },
  {
    id: 'idiopathic-pah-group-1',
    name: 'Severe Idiopathic PAH (Pre-Capillary Group 1)',
    description: '36-year-old female with progressive NYHA Class III dyspnea and Raynaud phenomenon. Classic pre-capillary PH: mPAP 52 mmHg, PAWP 10 mmHg, PVR 8.4 Wood Units.',
    pressures: {
      rightAtrialPressureMeanMmHg: 11,
      rvSystolicMmHg: 82,
      rvEndDiastolicMmHg: 12,
      paSystolicMmHg: 82,
      paDiastolicMmHg: 34,
      paMeanMmHg: 52,
      pulmonaryCapillaryWedgeMmHg: 10,
      aorticSystolicMmHg: 108,
      aorticDiastolicMmHg: 68,
      aorticMeanMmHg: 81,
    },
    fick: {
      hemoglobinGPerDl: 15.0,
      arterialO2SaturationPct: 93,
      mixedVenousO2SaturationPct: 58,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 36,
      patientSex: 'FEMALE',
      patientHeightCm: 164,
      patientWeightKg: 58,
      heartRateBpm: 88,
    },
  },
  {
    id: 'vasoreactive-ipah-responder',
    name: 'Vasoreactive IPAH (Inhaled Nitric Oxide Responder)',
    description: '29-year-old female with new IPAH. Baseline mPAP 48 mmHg drops to 32 mmHg on 20 ppm inhaled NO with preserved CO (Sitbon positive responder candidate for high-dose CCB).',
    pressures: {
      rightAtrialPressureMeanMmHg: 6,
      rvSystolicMmHg: 74,
      rvEndDiastolicMmHg: 8,
      paSystolicMmHg: 74,
      paDiastolicMmHg: 32,
      paMeanMmHg: 48,
      pulmonaryCapillaryWedgeMmHg: 9,
      aorticSystolicMmHg: 116,
      aorticDiastolicMmHg: 74,
      aorticMeanMmHg: 88,
    },
    fick: {
      hemoglobinGPerDl: 13.8,
      arterialO2SaturationPct: 97,
      mixedVenousO2SaturationPct: 66,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 29,
      patientSex: 'FEMALE',
      patientHeightCm: 168,
      patientWeightKg: 62,
      heartRateBpm: 76,
    },
    vaso: {
      performed: true,
      agentUsed: 'INHALED_NITRIC_OXIDE',
      postDrugPaMeanMmHg: 32,
      postDrugPawpMmHg: 9,
      postDrugCardiacOutputLMin: 4.8,
    },
  },
  {
    id: 'hfpef-isolated-post-capillary',
    name: 'Heart Failure with Preserved EF (Ipc-PH Group 2)',
    description: '71-year-old hypertensive female with exertional orthopnea. Elevated PAWP 23 mmHg with passive backward transmission (mPAP 33 mmHg, normal PVR 1.6 WU, DPG 2 mmHg).',
    pressures: {
      rightAtrialPressureMeanMmHg: 9,
      rvSystolicMmHg: 46,
      rvEndDiastolicMmHg: 10,
      paSystolicMmHg: 46,
      paDiastolicMmHg: 25,
      paMeanMmHg: 30,
      pulmonaryCapillaryWedgeMmHg: 23,
      aorticSystolicMmHg: 148,
      aorticDiastolicMmHg: 82,
      aorticMeanMmHg: 104,
    },
    fick: {
      hemoglobinGPerDl: 12.4,
      arterialO2SaturationPct: 95,
      mixedVenousO2SaturationPct: 64,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 71,
      patientSex: 'FEMALE',
      patientHeightCm: 160,
      patientWeightKg: 82,
      heartRateBpm: 74,
    },
  },
  {
    id: 'mitral-regurgitation-cpc-ph',
    name: 'Severe Mitral Regurgitation with Cpc-PH (Combined PH)',
    description: '64-year-old male with chronic severe degenerative MR. Chronic backward failure with secondary pulmonary arteriolar remodeling: PAWP 26 mmHg, mPAP 48 mmHg, PVR 4.4 WU, DPG 12 mmHg.',
    pressures: {
      rightAtrialPressureMeanMmHg: 14,
      rvSystolicMmHg: 68,
      rvEndDiastolicMmHg: 15,
      paSystolicMmHg: 68,
      paDiastolicMmHg: 38,
      paMeanMmHg: 48,
      pulmonaryCapillaryWedgeMmHg: 26,
      aorticSystolicMmHg: 124,
      aorticDiastolicMmHg: 70,
      aorticMeanMmHg: 88,
    },
    fick: {
      hemoglobinGPerDl: 13.0,
      arterialO2SaturationPct: 92,
      mixedVenousO2SaturationPct: 54,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 64,
      patientSex: 'MALE',
      patientHeightCm: 174,
      patientWeightKg: 80,
      heartRateBpm: 84,
    },
  },
  {
    id: 'severe-copd-group-3',
    name: 'Severe Hypoxic COPD Pulmonary Hypertension (Group 3)',
    description: '67-year-old smoker with GOLD Stage IV COPD. Chronic alveolar hypoxia and capillary bed destruction: mPAP 35 mmHg, PAWP 10 mmHg, PVR 4.2 WU, SvO2 54%.',
    pressures: {
      rightAtrialPressureMeanMmHg: 8,
      rvSystolicMmHg: 52,
      rvEndDiastolicMmHg: 9,
      paSystolicMmHg: 52,
      paDiastolicMmHg: 22,
      paMeanMmHg: 35,
      pulmonaryCapillaryWedgeMmHg: 10,
      aorticSystolicMmHg: 132,
      aorticDiastolicMmHg: 78,
      aorticMeanMmHg: 96,
    },
    fick: {
      hemoglobinGPerDl: 16.8,
      arterialO2SaturationPct: 88,
      mixedVenousO2SaturationPct: 54,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 67,
      patientSex: 'MALE',
      patientHeightCm: 172,
      patientWeightKg: 70,
      heartRateBpm: 82,
    },
  },
  {
    id: 'cteph-group-4',
    name: 'Chronic Thromboembolic PH (CTEPH Group 4)',
    description: '54-year-old male 18 months post-massive PE. Persistent organized fibrotic vascular obstruction: mPAP 46 mmHg, PAWP 9 mmHg, PVR 7.1 WU. Evaluation for Pulmonary Endarterectomy (PEA).',
    pressures: {
      rightAtrialPressureMeanMmHg: 10,
      rvSystolicMmHg: 76,
      rvEndDiastolicMmHg: 11,
      paSystolicMmHg: 76,
      paDiastolicMmHg: 28,
      paMeanMmHg: 46,
      pulmonaryCapillaryWedgeMmHg: 9,
      aorticSystolicMmHg: 118,
      aorticDiastolicMmHg: 72,
      aorticMeanMmHg: 87,
    },
    fick: {
      hemoglobinGPerDl: 14.6,
      arterialO2SaturationPct: 91,
      mixedVenousO2SaturationPct: 56,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 54,
      patientSex: 'MALE',
      patientHeightCm: 180,
      patientWeightKg: 85,
      heartRateBpm: 86,
    },
  },
  {
    id: 'cardiogenic-shock-rv-failure',
    name: 'Acute RV Infarction & Cardiogenic Shock (Low PAPi)',
    description: '62-year-old male with acute inferior/RV STEMI in cardiogenic shock. Profound RV systolic failure: RAP 19 mmHg, sPAP 28 mmHg, dPAP 16 mmHg, PAPi 0.63, CI 1.7 L/min/m2.',
    pressures: {
      rightAtrialPressureMeanMmHg: 19,
      rvSystolicMmHg: 28,
      rvEndDiastolicMmHg: 18,
      paSystolicMmHg: 28,
      paDiastolicMmHg: 16,
      paMeanMmHg: 21,
      pulmonaryCapillaryWedgeMmHg: 14,
      aorticSystolicMmHg: 86,
      aorticDiastolicMmHg: 54,
      aorticMeanMmHg: 65,
    },
    fick: {
      hemoglobinGPerDl: 12.0,
      arterialO2SaturationPct: 92,
      mixedVenousO2SaturationPct: 46,
      vo2Method: 'ESTIMATED_BERGSTRA',
      patientAge: 62,
      patientSex: 'MALE',
      patientHeightCm: 175,
      patientWeightKg: 82,
      heartRateBpm: 98,
    },
  },
];
