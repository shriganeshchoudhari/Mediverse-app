/**
 * UpperGiBleedingEngine.ts
 *
 * Biophysical simulation and clinical decision-support engine for:
 * Acute Upper Gastrointestinal Bleeding (UGIB), Glasgow-Blatchford Score (GBS),
 * Full Rockall Score, Forrest Classification Risk Stratification, Vasoactive
 * Pharmacotherapy Kinetics, Endoscopic Hemostasis & Salvage Balloon Tamponade.
 *
 * References & Clinical Guidelines:
 * - Barkun AN, et al. Management of Nonvariceal Upper Gastrointestinal Bleeding:
 *   Guideline Recommendations From the International Consensus Group. Ann Intern Med. 2019.
 * - de Franchis R, et al. Baveno VII - Renewing consensus in portal hypertension.
 *   J Hepatol. 2022.
 * - Blatchford O, et al. A risk score to predict need for treatment for upper-gastrointestinal
 *   haemorrhage. Lancet. 2000.
 * - Rockall TA, et al. Risk assessment after acute upper gastrointestinal haemorrhage. Gut. 1996.
 * - Laine L, et al. ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding.
 *   Am J Gastroenterol. 2021.
 *
 * Location: frontend/.gemini/skills/UpperGiBleedingEngine.ts
 */

export type BleedEtiology =
  | 'PEPTIC_ULCER_DUODENAL'
  | 'PEPTIC_ULCER_GASTRIC'
  | 'ESOPHAGEAL_VARICES'
  | 'GASTRIC_VARICES_GOV2'
  | 'MALLORY_WEISS_TEAR'
  | 'DIEULAFOY_LESION'
  | 'GASTRIC_ANTRAL_VASCULAR_ECTASIA';

export type ForrestClass =
  | 'Ia' // Spurting hemorrhage
  | 'Ib' // Oozing hemorrhage
  | 'IIa' // Non-bleeding visible vessel
  | 'IIb' // Adherent clot
  | 'IIc' // Flat pigmented spot / hematin
  | 'III' // Clean base ulcer
  | 'NOT_APPLICABLE';

export interface PatientVitalsLabs {
  ageYears: number;
  systolicBpMmHg: number;
  heartRateBpm: number;
  bloodUreaNitrogenMgDl: number;
  hemoglobinGDl: number;
  sex: 'MALE' | 'FEMALE';
  presentationMelena: boolean;
  presentationSyncope: boolean;
  hasHepaticDisease: boolean;
  hasCardiacFailure: boolean;
  hasRenalFailure: boolean;
  hasMalignancy: boolean;
}

export interface EndoscopicFindings {
  etiology: BleedEtiology;
  forrestClass: ForrestClass;
  varicealGrade?: 'GRADE_I' | 'GRADE_II' | 'GRADE_III';
  varicealRedColorSigns?: boolean;
  stigmataOfRecentHemorrhage: boolean;
  ulcerSizeMm?: number;
}

export interface GbsScoreResult {
  score: number;
  maxScore: number;
  riskCategory: 'VERY_LOW_RISK' | 'INTERMEDIATE_RISK' | 'HIGH_RISK';
  outpatientEligible: boolean;
  recommendation: string;
}

export interface RockallScoreResult {
  preEndoscopyScore: number;
  postEndoscopyScore: number;
  predictedRebleedRiskPercent: number;
  predictedMortalityPercent: number;
  riskTier: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
}

export interface PharmacotherapyRegimen {
  ivPpiType: 'PANTOPRAZOLE_80MG_BOLUS_8MG_HR' | 'INTERMITTENT_40MG_BID' | 'NONE';
  vasoactiveAgent: 'OCTREOTIDE_50MCG_BOLUS_50MCG_HR' | 'TERLIPRESSIN_2MG_Q4H' | 'SOMATOSTATIN_250MCG_HR' | 'NONE';
  prophylacticAntibiotic: 'CEFTRIAXONE_1G_IV_DAILY' | 'CIPROFLOXACIN_IV' | 'NONE';
  prokineticPreEndoscopy: 'ERYTHROMYCIN_250MG_IV_30MIN_PRIOR' | 'METOCLOPRAMIDE_10MG_IV' | 'NONE';
  tranexamicAcidGiven: boolean;
}

export interface EndoscopicIntervention {
  primaryModality: 'DUAL_THERAPY_EPI_PLUS_HEMOCLIP' | 'DUAL_THERAPY_EPI_PLUS_THERMAL' | 'HEMOCLIP_MONOTHERAPY' | 'BAND_LIGATION_EVL' | 'CYANOACRYLATE_GLUE' | 'HEMOSTATIC_POWDER_TC325' | 'OVER_THE_SCOPE_CLIP_OTSC' | 'NONE';
  salvageTamponadeApplied: boolean;
  gastricBalloonVolumeMl: number;
  esophagealBalloonPressureMmHg: number;
  tipsEvaluatedOrPerformed: boolean;
}

export interface HemostasisSimulationState {
  currentSystolicBp: number;
  currentHeartRate: number;
  currentHemoglobin: number;
  activeBleedingRateMlMin: number;
  totalBloodLossMl: number;
  hemostasisAchieved: boolean;
  rebleedingRiskAt72HoursPercent: number;
  estimated72HourMortalityPercent: number;
  transfusionRequirementUnitsPrbc: number;
  tamponadeComplicationDetected?: 'ESOPHAGEAL_RUPTURE' | 'AIRWAY_OBSTRUCTION' | 'BALLOON_DEFLATION_FAIL' | 'NONE';
  clinicalSummary: string[];
}

export function calculateGlasgowBlatchfordScore(patient: PatientVitalsLabs): GbsScoreResult {
  let score = 0;

  if (patient.bloodUreaNitrogenMgDl >= 70) {
    score += 6;
  } else if (patient.bloodUreaNitrogenMgDl >= 28) {
    score += 4;
  } else if (patient.bloodUreaNitrogenMgDl >= 22.4) {
    score += 3;
  } else if (patient.bloodUreaNitrogenMgDl >= 18.2) {
    score += 2;
  }

  if (patient.sex === 'MALE') {
    if (patient.hemoglobinGDl < 10.0) {
      score += 6;
    } else if (patient.hemoglobinGDl < 12.0) {
      score += 3;
    } else if (patient.hemoglobinGDl < 13.0) {
      score += 1;
    }
  } else {
    if (patient.hemoglobinGDl < 10.0) {
      score += 6;
    } else if (patient.hemoglobinGDl < 12.0) {
      score += 1;
    }
  }

  if (patient.systolicBpMmHg < 100) {
    score += 3;
  } else if (patient.systolicBpMmHg <= 109) {
    score += 2;
  } else if (patient.systolicBpMmHg <= 119) {
    score += 1;
  }

  if (patient.heartRateBpm >= 100) {
    score += 1;
  }

  if (patient.presentationMelena) score += 1;
  if (patient.presentationSyncope) score += 2;
  if (patient.hasHepaticDisease) score += 2;
  if (patient.hasCardiacFailure) score += 2;

  const outpatientEligible = score <= 1;
  let riskCategory: GbsScoreResult['riskCategory'] = 'VERY_LOW_RISK';
  let recommendation = '';

  if (score <= 1) {
    riskCategory = 'VERY_LOW_RISK';
    recommendation =
      'GBS <= 1: Very low risk (<0.5% intervention requirement). Outpatient triage and elective outpatient endoscopy are clinically safe if social support exists.';
  } else if (score <= 5) {
    riskCategory = 'INTERMEDIATE_RISK';
    recommendation =
      'GBS 2-5: Intermediate risk. Inpatient admission required. Perform endoscopy within 24 hours of hemodynamic stabilization.';
  } else {
    riskCategory = 'HIGH_RISK';
    recommendation =
      'GBS >= 6: High-risk presentation (frequently requires endoscopic hemostasis, blood transfusion, or ICU admission). Resuscitate aggressively and plan urgent endoscopy.';
  }

  return {
    score,
    maxScore: 23,
    riskCategory,
    outpatientEligible,
    recommendation,
  };
}

export function calculateRockallScore(
  patient: PatientVitalsLabs,
  endoscopy?: EndoscopicFindings
): RockallScoreResult {
  let preScore = 0;

  if (patient.ageYears >= 80) {
    preScore += 2;
  } else if (patient.ageYears >= 60) {
    preScore += 1;
  }

  if (patient.systolicBpMmHg < 100) {
    preScore += 2;
  } else if (patient.heartRateBpm >= 100) {
    preScore += 1;
  }

  if (patient.hasRenalFailure || patient.hasHepaticDisease || patient.hasMalignancy) {
    preScore += 3;
  } else if (patient.hasCardiacFailure) {
    preScore += 2;
  }

  let postScore = preScore;

  if (endoscopy) {
    if (endoscopy.etiology === 'MALLORY_WEISS_TEAR') {
      postScore += 0;
    } else if (endoscopy.etiology === 'PEPTIC_ULCER_DUODENAL' || endoscopy.etiology === 'PEPTIC_ULCER_GASTRIC' || endoscopy.etiology === 'ESOPHAGEAL_VARICES' || endoscopy.etiology === 'GASTRIC_VARICES_GOV2') {
      postScore += 1;
    } else if (patient.hasMalignancy) {
      postScore += 3;
    } else {
      postScore += 1;
    }

    if (endoscopy.forrestClass === 'Ia' || endoscopy.forrestClass === 'Ib') {
      postScore += 2;
    } else if (endoscopy.forrestClass === 'IIa' || endoscopy.forrestClass === 'IIb') {
      postScore += 2;
    } else if (endoscopy.forrestClass === 'IIc' || endoscopy.forrestClass === 'III') {
      postScore += 0;
    } else if (endoscopy.stigmataOfRecentHemorrhage) {
      postScore += 2;
    }
  }

  let rebleed = 5;
  let mortality = 0.5;

  if (postScore <= 2) {
    rebleed = 4.5;
    mortality = 0.1;
  } else if (postScore === 3) {
    rebleed = 8.5;
    mortality = 2.0;
  } else if (postScore === 4) {
    rebleed = 14.0;
    mortality = 5.0;
  } else if (postScore === 5) {
    rebleed = 24.0;
    mortality = 10.8;
  } else if (postScore === 6) {
    rebleed = 33.0;
    mortality = 17.5;
  } else if (postScore === 7) {
    rebleed = 44.0;
    mortality = 27.0;
  } else {
    rebleed = 53.0;
    mortality = 41.0;
  }

  let riskTier: RockallScoreResult['riskTier'] = 'LOW_RISK';
  if (postScore >= 5) {
    riskTier = 'HIGH_RISK';
  } else if (postScore >= 3) {
    riskTier = 'MODERATE_RISK';
  }

  return {
    preEndoscopyScore: preScore,
    postEndoscopyScore: postScore,
    predictedRebleedRiskPercent: Math.min(100, rebleed),
    predictedMortalityPercent: Math.min(100, mortality),
    riskTier,
  };
}

export function analyzeForrestClassification(forrestClass: ForrestClass): {
  stigmataName: string;
  rebleedRiskWithoutTherapyPercent: number;
  endoscopicTherapyMandated: boolean;
  highDoseIvPpiIndicated: boolean;
  rationale: string;
} {
  switch (forrestClass) {
    case 'Ia':
      return {
        stigmataName: 'Class Ia: Active Spurting Hemorrhage',
        rebleedRiskWithoutTherapyPercent: 90,
        endoscopicTherapyMandated: true,
        highDoseIvPpiIndicated: true,
        rationale: 'Arterial jet under high hydrostatic pressure. Mandatory dual endoscopic hemostasis + 72-hr high-dose IV PPI infusion.',
      };
    case 'Ib':
      return {
        stigmataName: 'Class Ib: Active Oozing Hemorrhage',
        rebleedRiskWithoutTherapyPercent: 50,
        endoscopicTherapyMandated: true,
        highDoseIvPpiIndicated: true,
        rationale: 'Low-pressure venous or capillary ooze without arterial jet. Requires endoscopic therapy + high-dose IV PPI.',
      };
    case 'IIa':
      return {
        stigmataName: 'Class IIa: Non-Bleeding Visible Vessel',
        rebleedRiskWithoutTherapyPercent: 43,
        endoscopicTherapyMandated: true,
        highDoseIvPpiIndicated: true,
        rationale: 'Pseudoaneurysmal vascular stump plugging ulcer crater. High risk of fatal rebleed; requires mechanical hemoclip or thermal probe.',
      };
    case 'IIb':
      return {
        stigmataName: 'Class IIb: Adherent Clot',
        rebleedRiskWithoutTherapyPercent: 25,
        endoscopicTherapyMandated: true,
        highDoseIvPpiIndicated: true,
        rationale: 'Targeted irrigation and gentle clot cold-snare shave recommended to inspect underlying visible vessel, followed by dual therapy.',
      };
    case 'IIc':
      return {
        stigmataName: 'Class IIc: Flat Pigmented / Hematin Spot',
        rebleedRiskWithoutTherapyPercent: 8,
        endoscopicTherapyMandated: false,
        highDoseIvPpiIndicated: false,
        rationale: 'Organized hematin plug in base. No endoscopic hemostasis required; oral standard-dose PPI adequate.',
      };
    case 'III':
      return {
        stigmataName: 'Class III: Clean Ulcer Base',
        rebleedRiskWithoutTherapyPercent: 3,
        endoscopicTherapyMandated: false,
        highDoseIvPpiIndicated: false,
        rationale: 'Re-epithelializing fibrin slough base. Extremely low rebleed risk. Safe for oral PPI therapy and early discharge.',
      };
    case 'NOT_APPLICABLE':
    default:
      return {
        stigmataName: 'Not Applicable (Non-Ulcer Source)',
        rebleedRiskWithoutTherapyPercent: 0,
        endoscopicTherapyMandated: false,
        highDoseIvPpiIndicated: false,
        rationale: 'Etiology is non-ulcer (e.g. varices, mucosal tear, angiodysplasia). Follow disease-specific guidelines.',
      };
  }
}

export function simulateUpperGiBleedingState(
  patient: PatientVitalsLabs,
  endoscopy: EndoscopicFindings,
  pharma: PharmacotherapyRegimen,
  intervention: EndoscopicIntervention,
  elapsedHours: number = 4
): HemostasisSimulationState {
  const rockall = calculateRockallScore(patient, endoscopy);
  const forrest = analyzeForrestClassification(endoscopy.forrestClass);

  const clinicalSummary: string[] = [];

  let baseBleedRateMlMin = 0;
  if (endoscopy.etiology === 'ESOPHAGEAL_VARICES' || endoscopy.etiology === 'GASTRIC_VARICES_GOV2') {
    baseBleedRateMlMin = endoscopy.varicealGrade === 'GRADE_III' ? 25 : endoscopy.varicealGrade === 'GRADE_II' ? 14 : 5;
    if (endoscopy.varicealRedColorSigns) baseBleedRateMlMin += 10;
  } else if (endoscopy.forrestClass === 'Ia') {
    baseBleedRateMlMin = 35;
  } else if (endoscopy.forrestClass === 'Ib') {
    baseBleedRateMlMin = 15;
  } else if (endoscopy.forrestClass === 'IIa') {
    baseBleedRateMlMin = 8;
  } else if (endoscopy.forrestClass === 'IIb') {
    baseBleedRateMlMin = 4;
  } else {
    baseBleedRateMlMin = 1.5;
  }

  let splanchnicVasoconstrictionFactor = 1.0;
  if (endoscopy.etiology === 'ESOPHAGEAL_VARICES' || endoscopy.etiology === 'GASTRIC_VARICES_GOV2') {
    if (pharma.vasoactiveAgent === 'OCTREOTIDE_50MCG_BOLUS_50MCG_HR') {
      splanchnicVasoconstrictionFactor = 0.45;
      clinicalSummary.push('Octreotide infusion active: Selective splanchnic vasoconstriction reduces portal pressure gradient.');
    } else if (pharma.vasoactiveAgent === 'TERLIPRESSIN_2MG_Q4H') {
      splanchnicVasoconstrictionFactor = 0.35;
      clinicalSummary.push('Terlipressin active: Potent splanchnic arterial constriction with systemic MAP elevation.');
    } else {
      clinicalSummary.push('WARNING: No vasoactive agent administered for active variceal hemorrhage (increased rebleed/mortality risk).');
    }
  }

  if (patient.hasHepaticDisease) {
    if (pharma.prophylacticAntibiotic === 'CEFTRIAXONE_1G_IV_DAILY') {
      clinicalSummary.push('Ceftriaxone 1g IV daily: Meets Baveno VII criteria for reducing bacteremia, SBP, and early rebleeding.');
    } else {
      clinicalSummary.push('CAUTION: Antibiotic prophylaxis omitted in cirrhotic GI bleed (elevated spontaneous bacterial peritonitis risk).');
    }
  }

  let gastricPhClotStabilization = 1.0;
  if (endoscopy.etiology === 'PEPTIC_ULCER_DUODENAL' || endoscopy.etiology === 'PEPTIC_ULCER_GASTRIC') {
    if (pharma.ivPpiType === 'PANTOPRAZOLE_80MG_BOLUS_8MG_HR') {
      gastricPhClotStabilization = 0.40;
      clinicalSummary.push('High-dose IV Pantoprazole: Sustained intragastric pH > 6.0 inhibits pepsin-mediated clot lysis.');
    } else if (pharma.ivPpiType === 'INTERMITTENT_40MG_BID') {
      gastricPhClotStabilization = 0.65;
      clinicalSummary.push('Intermittent IV PPI: Acceptable alternative per recent guidelines, modest pH fluctuation.');
    } else {
      clinicalSummary.push('CRITICAL: No PPI administered for peptic ulcer bleeding; acidic gastric milieu promotes clot dissolution.');
    }
  }

  let endoscopicReduction = 1.0;

  if (intervention.primaryModality === 'BAND_LIGATION_EVL') {
    if (endoscopy.etiology === 'ESOPHAGEAL_VARICES') {
      endoscopicReduction = 0.05;
      clinicalSummary.push('Endoscopic Variceal Ligation (EVL) successfully deployed rubber bands at gastroesophageal junction.');
    } else {
      clinicalSummary.push('MISMATCH: Band ligation attempted on non-esophageal variceal lesion.');
    }
  } else if (intervention.primaryModality === 'CYANOACRYLATE_GLUE') {
    if (endoscopy.etiology === 'GASTRIC_VARICES_GOV2') {
      endoscopicReduction = 0.03;
      clinicalSummary.push('N-butyl-2-cyanoacrylate / Lipiodol obturation successfully solidified gastric variceal lumen.');
    }
  } else if (
    intervention.primaryModality === 'DUAL_THERAPY_EPI_PLUS_HEMOCLIP' ||
    intervention.primaryModality === 'DUAL_THERAPY_EPI_PLUS_THERMAL'
  ) {
    if (forrest.endoscopicTherapyMandated) {
      endoscopicReduction = 0.02;
      clinicalSummary.push('Guideline-mandated dual therapy deployed: Epinephrine injection for temporary tamponade + mechanical/thermal hemostasis.');
    } else {
      endoscopicReduction = 0.05;
    }
  } else if (intervention.primaryModality === 'OVER_THE_SCOPE_CLIP_OTSC') {
    endoscopicReduction = 0.01;
    clinicalSummary.push('Full-thickness Over-The-Scope Clip (OTSC) compressed large fibrotic ulcer bed.');
  } else if (intervention.primaryModality === 'HEMOSTATIC_POWDER_TC325') {
    endoscopicReduction = 0.15;
    clinicalSummary.push('TC-325 hemostatic powder spray achieved immediate contact clotting (bridging measure).');
  }

  let tamponadeComplication: HemostasisSimulationState['tamponadeComplicationDetected'] = 'NONE';
  let balloonEffective = false;

  if (intervention.salvageTamponadeApplied) {
    if (intervention.gastricBalloonVolumeMl < 200) {
      clinicalSummary.push('WARNING: Gastric balloon under-inflated (<200 mL); risk of migration up into esophagus with airway compromise.');
      tamponadeComplication = 'AIRWAY_OBSTRUCTION';
    } else if (intervention.gastricBalloonVolumeMl > 350) {
      clinicalSummary.push('DANGER: Gastric balloon over-inflated (>350 mL); acute risk of gastric fundic rupture.');
      tamponadeComplication = 'ESOPHAGEAL_RUPTURE';
    } else {
      balloonEffective = true;
      clinicalSummary.push('Sengstaken-Blakemore gastric balloon properly inflated to ' + intervention.gastricBalloonVolumeMl + ' mL under 500-1000g traction.');
    }

    if (intervention.esophagealBalloonPressureMmHg > 45) {
      tamponadeComplication = 'ESOPHAGEAL_RUPTURE';
      clinicalSummary.push('CRITICAL ALERT: Esophageal balloon pressure ' + intervention.esophagealBalloonPressureMmHg + ' mmHg exceeds mucosal capillary perfusion pressure (>45 mmHg)! Esophageal necrosis / rupture impending.');
    } else if (intervention.esophagealBalloonPressureMmHg >= 30) {
      balloonEffective = true;
      clinicalSummary.push('Esophageal balloon inflated to therapeutic compression window (' + intervention.esophagealBalloonPressureMmHg + ' mmHg).');
    }

    if (balloonEffective && tamponadeComplication === 'NONE') {
      endoscopicReduction *= 0.05;
      clinicalSummary.push('Salvage balloon tamponade successfully arrested refractory variceal bleeding. Mandatory bridge to TIPS within 24-72h.');
    }
  }

  if (intervention.tipsEvaluatedOrPerformed) {
    clinicalSummary.push('Early preemptive TIPS (within 72h) reduces 1-year mortality and treatment failure in high-risk cirrhotics (Child-Pugh B + active bleeding or Child-Pugh C < 14).');
  }

  let currentBleedRate = baseBleedRateMlMin * splanchnicVasoconstrictionFactor * gastricPhClotStabilization * endoscopicReduction;
  if (currentBleedRate <= 0.35) currentBleedRate = 0;

  const hemostasisAchieved = currentBleedRate === 0;

  const totalBloodLossMl = Math.round(currentBleedRate * 60 * elapsedHours + (baseBleedRateMlMin > 10 ? 600 : 250));

  let currentSystolicBp = patient.systolicBpMmHg;
  let currentHeartRate = patient.heartRateBpm;
  let currentHemoglobin = patient.hemoglobinGDl;

  if (!hemostasisAchieved) {
    const shockDrop = Math.min(45, (totalBloodLossMl / 1000) * 20);
    currentSystolicBp = Math.max(55, Math.round(patient.systolicBpMmHg - shockDrop));
    currentHeartRate = Math.min(160, Math.round(patient.heartRateBpm + shockDrop * 0.8));
    currentHemoglobin = Math.max(4.0, +(patient.hemoglobinGDl - (totalBloodLossMl / 1000) * 1.6).toFixed(1));
  } else {
    currentSystolicBp = Math.min(125, Math.max(90, patient.systolicBpMmHg + 10));
    currentHeartRate = Math.max(65, Math.min(95, patient.heartRateBpm - 15));
    currentHemoglobin = +(patient.hemoglobinGDl).toFixed(1);
  }

  let rebleedingRisk = rockall.predictedRebleedRiskPercent;
  if (hemostasisAchieved) {
    if (intervention.primaryModality === 'DUAL_THERAPY_EPI_PLUS_HEMOCLIP' || intervention.primaryModality === 'DUAL_THERAPY_EPI_PLUS_THERMAL') {
      rebleedingRisk *= 0.3;
    } else if (intervention.primaryModality === 'BAND_LIGATION_EVL') {
      rebleedingRisk *= 0.35;
    }
    if (pharma.ivPpiType === 'PANTOPRAZOLE_80MG_BOLUS_8MG_HR') {
      rebleedingRisk *= 0.55;
    }
    if (intervention.tipsEvaluatedOrPerformed) {
      rebleedingRisk *= 0.25;
    }
  } else {
    rebleedingRisk = 95;
  }
  rebleedingRisk = Math.max(2, Math.min(99, Math.round(rebleedingRisk)));

  let transfusionUnits = 0;
  if (currentHemoglobin < 7.0) {
    transfusionUnits = Math.ceil((8.0 - currentHemoglobin) / 1.0);
  } else if (patient.hasCardiacFailure && currentHemoglobin < 8.0) {
    transfusionUnits = Math.ceil((9.0 - currentHemoglobin) / 1.0);
  }

  return {
    currentSystolicBp,
    currentHeartRate,
    currentHemoglobin,
    activeBleedingRateMlMin: +currentBleedRate.toFixed(1),
    totalBloodLossMl,
    hemostasisAchieved,
    rebleedingRiskAt72HoursPercent: rebleedingRisk,
    estimated72HourMortalityPercent: hemostasisAchieved ? Math.round(rockall.predictedMortalityPercent * 0.5) : rockall.predictedMortalityPercent,
    transfusionRequirementUnitsPrbc: transfusionUnits,
    tamponadeComplicationDetected: tamponadeComplication,
    clinicalSummary,
  };
}
