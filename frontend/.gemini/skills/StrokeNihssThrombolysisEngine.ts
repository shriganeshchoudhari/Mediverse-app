/**
 * StrokeNihssThrombolysisEngine.ts
 * Comprehensive Biophysical & Clinical Decision Engine for Acute Ischemic Stroke (AIS),
 * Complete 11-Item NIH Stroke Scale (NIHSS), ASPECTS Neuroimaging Scoring (0-10),
 * IV Thrombolysis Eligibility & Precision Dosing (Alteplase / Tenecteplase),
 * Endovascular Thrombectomy (EVT / LVO) Triage, and Post-Thrombolysis Hemodynamic Guardrails.
 *
 * Location: frontend/.gemini/skills/StrokeNihssThrombolysisEngine.ts
 * Guidelines: AHA/ASA 2018/2019/2021 Stroke Guidelines, EXTEND-IA TNK, WAKE-UP, DAWN & DEFUSE 3.
 */

export interface NihssItemScores {
  loc1a: number; // 0-3: Level of Consciousness
  loc1b: number; // 0-2: LOC Questions (Month, Age)
  loc1c: number; // 0-2: LOC Commands (Open/Close eyes, Grip hand)
  bestGaze2: number; // 0-2: Horizontal Gaze
  visualFields3: number; // 0-3: Visual fields
  facialPalsy4: number; // 0-3: Facial symmetry
  motorArmLeft5a: number; // 0-4: Left arm drift
  motorArmRight5b: number; // 0-4: Right arm drift
  motorLegLeft6a: number; // 0-4: Left leg drift
  motorLegRight6b: number; // 0-4: Right leg drift
  limbAtaxia7: number; // 0-2: Finger-to-nose / heel-to-shin
  sensory8: number; // 0-2: Pinprick sensation
  bestLanguage9: number; // 0-3: Aphasia / naming
  dysarthria10: number; // 0-2: Articulation
  extinction11: number; // 0-2: Hemi-inattention / neglect
}

export type AspectsRegion =
  | 'caudate'
  | 'lentiform'
  | 'internalCapsule'
  | 'insularRibbon'
  | 'm1'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'm5'
  | 'm6';

export interface PatientPresentation {
  hoursFromLastKnownWell: number; // e.g. 1.5, 3.5, 5.0, -1 for unknown/wake-up
  isWakeUpStroke: boolean;
  mriDwiFlairMismatch?: boolean; // Positive DWI + Negative FLAIR = < 4.5h
  age: number; // years
  weightKg: number; // kg
  sbp: number; // mmHg
  dbp: number; // mmHg
  bloodGlucoseMgDl: number; // mg/dL
  plateletCount: number; // per mcL (normal 150k-450k)
  inr: number; // International Normalized Ratio
  aptt: number; // seconds (normal 25-35)
  onTherapeuticDoac: boolean; // Apixaban, Rivaroxaban, Dabigatran
  doacTakenWithin48h: boolean;
  hasLargeVesselOcclusion: boolean; // ICA, M1, proximal M2, Basilar
  lvoLocation?: 'ICA' | 'M1' | 'M2' | 'Basilar' | 'None';
  preStrokeMrs: number; // modified Rankin Scale (0-5)
  ctEvidenceOfBleed: boolean; // Non-contrast CT intracranial hemorrhage
  ctHypoattenuationGreaterThanThirdMca: boolean; // Frank demarcation > 1/3 MCA territory
  severeHeadTraumaWithin3Months: boolean;
  intracranialSurgeryWithin3Months: boolean;
  activeInternalBleeding: boolean;
  giMalignancyOrBleedWithin21Days: boolean;
  historyOfPriorIch: boolean;
  recentIntracranialNeoplasmOrAvm: boolean;
}

export interface ThrombolyticDosage {
  agent: 'alteplase' | 'tenecteplase';
  totalDoseMg: number;
  bolusDoseMg: number;
  infusionDoseMg?: number;
  infusionRateMlPerHour?: number; // based on standard 1 mg/mL concentration
  administrationInstructions: string;
}

export interface ThrombolysisEligibility {
  isEligible: boolean;
  timeWindow: 'standard_0_to_3h' | 'extended_3_to_4_5h' | 'wakeup_mri_selected' | 'outside_window';
  contraindications: string[];
  warnings: string[];
  recommendedAgent: 'alteplase' | 'tenecteplase' | 'none';
  dosing?: ThrombolyticDosage;
}

export interface EvtEligibility {
  isEligible: boolean;
  timeWindow: 'early_0_to_6h' | 'extended_6_to_24h' | 'ineligible';
  rationale: string;
  targetVessel: string;
}

export interface ComprehensiveStrokeEvaluation {
  totalNihss: number;
  nihssCategory: 'No Stroke' | 'Minor Stroke' | 'Moderate Stroke' | 'Moderate to Severe' | 'Severe Stroke';
  totalAspects: number;
  aspectsStatus: 'Favorable (Minimal Core)' | 'Intermediate' | 'Unfavorable (Large Core)';
  thrombolysis: ThrombolysisEligibility;
  evt: EvtEligibility;
  bloodPressureGuardrails: {
    targetPreThrombolysis: string;
    targetPostThrombolysis: string;
    permissiveNonThrombolysis: string;
    requiresImmediateBpReduction: boolean;
    recommendedAntihypertensive: string;
  };
  complicationsToMonitor: string[];
}

/**
 * Calculates Total NIH Stroke Scale (0 - 42)
 */
export function calculateNihss(scores: NihssItemScores): { total: number; category: ComprehensiveStrokeEvaluation['nihssCategory'] } {
  const total =
    scores.loc1a +
    scores.loc1b +
    scores.loc1c +
    scores.bestGaze2 +
    scores.visualFields3 +
    scores.facialPalsy4 +
    scores.motorArmLeft5a +
    scores.motorArmRight5b +
    scores.motorLegLeft6a +
    scores.motorLegRight6b +
    scores.limbAtaxia7 +
    scores.sensory8 +
    scores.bestLanguage9 +
    scores.dysarthria10 +
    scores.extinction11;

  let category: ComprehensiveStrokeEvaluation['nihssCategory'] = 'No Stroke';
  if (total >= 21) {
    category = 'Severe Stroke';
  } else if (total >= 16) {
    category = 'Moderate to Severe';
  } else if (total >= 5) {
    category = 'Moderate Stroke';
  } else if (total >= 1) {
    category = 'Minor Stroke';
  }

  return { total, category };
}

/**
 * Calculates ASPECTS (0 - 10) based on MCA territory early ischemic hypoattenuation
 */
export function calculateAspects(affectedRegions: AspectsRegion[]): { score: number; status: ComprehensiveStrokeEvaluation['aspectsStatus'] } {
  const score = Math.max(0, 10 - affectedRegions.length);
  let status: ComprehensiveStrokeEvaluation['aspectsStatus'] = 'Favorable (Minimal Core)';

  if (score < 6) {
    status = 'Unfavorable (Large Core)';
  } else if (score < 8) {
    status = 'Intermediate';
  }

  return { score, status };
}

/**
 * Computes weight-adjusted Alteplase dosing
 * Standard: 0.9 mg/kg (max 90 mg). 10% IV bolus over 1 min, 90% IV infusion over 60 min.
 */
export function calculateAlteplaseDose(weightKg: number): ThrombolyticDosage {
  const rawDose = weightKg * 0.9;
  const totalDose = Math.min(90, Math.round(rawDose * 10) / 10);
  const bolus = Math.round(totalDose * 0.1 * 10) / 10;
  const infusion = Math.round((totalDose - bolus) * 10) / 10;

  return {
    agent: 'alteplase',
    totalDoseMg: totalDose,
    bolusDoseMg: bolus,
    infusionDoseMg: infusion,
    infusionRateMlPerHour: infusion, // At 1 mg/mL concentration, infusion dose in mg equals mL/hr
    administrationInstructions: `Administer ${bolus} mg (10%) as rapid IV bolus over 1 minute. Follow immediately with ${infusion} mg (90%) infused continuously over 60 minutes. Maximum total dose is 90 mg.`
  };
}

/**
 * Computes weight-adjusted Tenecteplase dosing
 * Standard (AHA/ASA EXTEND-IA TNK): 0.25 mg/kg (max 25 mg) single IV bolus over 5-10 seconds.
 */
export function calculateTenecteplaseDose(weightKg: number): ThrombolyticDosage {
  const rawDose = weightKg * 0.25;
  const totalDose = Math.min(25, Math.round(rawDose * 10) / 10);

  return {
    agent: 'tenecteplase',
    totalDoseMg: totalDose,
    bolusDoseMg: totalDose,
    administrationInstructions: `Administer ${totalDose} mg as a single, rapid IV push bolus over 5 to 10 seconds. No continuous secondary infusion required. Maximum dose is 25 mg.`
  };
}

/**
 * Evaluates IV Thrombolysis Eligibility according to AHA/ASA Guidelines
 */
export function evaluateThrombolysisEligibility(
  patient: PatientPresentation,
  nihssScore: number,
  aspectsScore: number,
  preferredAgent: 'alteplase' | 'tenecteplase' = 'tenecteplase'
): ThrombolysisEligibility {
  const contraindications: string[] = [];
  const warnings: string[] = [];

  // Absolute Neuroimaging Contraindication
  if (patient.ctEvidenceOfBleed) {
    contraindications.push('Intracranial hemorrhage detected on non-contrast CT. Thrombolysis is strictly contraindicated.');
  }

  // Major Ischemic Core Demarcation
  if (patient.ctHypoattenuationGreaterThanThirdMca || aspectsScore < 4) {
    contraindications.push('Severe frank hypoattenuation involving > 1/3 MCA territory (or ASPECTS < 4), representing completed infarction with extreme hemorrhagic transformation risk.');
  }

  // Glucose mimic check
  if (patient.bloodGlucoseMgDl < 50) {
    contraindications.push(`Severe hypoglycemia (Blood Glucose ${patient.bloodGlucoseMgDl} mg/dL) can mimic acute stroke. Must correct hypoglycemia and reassess before lytic therapy.`);
  } else if (patient.bloodGlucoseMgDl > 400) {
    warnings.push('Marked hyperglycemia (> 400 mg/dL) increases reperfusion injury and hemorrhagic risk; manage concurrent glucose.');
  }

  // Blood Pressure Exclusion
  if (patient.sbp >= 185 || patient.dbp >= 110) {
    contraindications.push(`Blood Pressure (${patient.sbp}/${patient.dbp} mmHg) exceeds pre-thrombolytic safety threshold (< 185/110 mmHg). Must lower BP with IV Nicardipine/Labetalol prior to lytic infusion.`);
  }

  // Coagulation Parameters
  if (patient.plateletCount < 100000) {
    contraindications.push(`Thrombocytopenia: Platelets ${patient.plateletCount} /mcL is below safety threshold (< 100,000 /mcL).`);
  }
  if (patient.inr > 1.7) {
    contraindications.push(`Coagulopathy: INR ${patient.inr} exceeds threshold (> 1.7). High risk of fatal intracranial bleeding.`);
  }
  if (patient.aptt > 40) {
    contraindications.push(`Prolonged aPTT (${patient.aptt} s > 40 s). Potential heparin exposure or intrinsic coagulopathy.`);
  }
  if (patient.onTherapeuticDoac && patient.doacTakenWithin48h) {
    contraindications.push('Therapeutic DOAC ingestion within 48 hours without specific reversal (Idarucizumab/Andexanet) or confirmed normal drug level.');
  }

  // Surgical / Bleeding History
  if (patient.severeHeadTraumaWithin3Months) {
    contraindications.push('Severe head trauma within the past 3 months.');
  }
  if (patient.intracranialSurgeryWithin3Months) {
    contraindications.push('Intracranial or intraspinal surgery within the past 3 months.');
  }
  if (patient.activeInternalBleeding) {
    contraindications.push('Active internal bleeding (e.g. overt GI hemorrhage).');
  }
  if (patient.giMalignancyOrBleedWithin21Days) {
    contraindications.push('Gastrointestinal malignancy or gastrointestinal bleeding within the past 21 days.');
  }
  if (patient.historyOfPriorIch) {
    contraindications.push('History of prior non-traumatic intracerebral hemorrhage.');
  }
  if (patient.recentIntracranialNeoplasmOrAvm) {
    contraindications.push('Known intra-axial intracranial neoplasm, arteriovenous malformation, or untreated aneurysm.');
  }

  // Time Window Assessment
  let timeWindow: ThrombolysisEligibility['timeWindow'] = 'outside_window';

  if (patient.isWakeUpStroke) {
    if (patient.mriDwiFlairMismatch) {
      timeWindow = 'wakeup_mri_selected';
    } else {
      contraindications.push('Unknown onset / Wake-up stroke without confirmed MRI DWI-FLAIR mismatch on neuroimaging (WAKE-UP trial criteria not met).');
    }
  } else if (patient.hoursFromLastKnownWell >= 0 && patient.hoursFromLastKnownWell <= 3.0) {
    timeWindow = 'standard_0_to_3h';
  } else if (patient.hoursFromLastKnownWell > 3.0 && patient.hoursFromLastKnownWell <= 4.5) {
    timeWindow = 'extended_3_to_4_5h';
    // Extended Window Additional Relative Exclusion Criteria (ECASS III)
    if (patient.age > 80 && patient.preStrokeMrs > 1) {
      warnings.push('Extended 3-4.5h window: Age > 80 with pre-existing functional dependency increases risk; consider risk-benefit.');
    }
    if (nihssScore > 25) {
      warnings.push('Extended 3-4.5h window: Extremely severe stroke (NIHSS > 25) carries heightened risk of hemorrhagic transformation.');
    }
  } else {
    timeWindow = 'outside_window';
    contraindications.push(`Time from Last Known Well (${patient.hoursFromLastKnownWell} hours) exceeds the 4.5-hour intravenous thrombolysis window.`);
  }

  const isEligible = contraindications.length === 0;
  const recommendedAgent = isEligible ? preferredAgent : 'none';
  const dosing = isEligible
    ? preferredAgent === 'tenecteplase'
      ? calculateTenecteplaseDose(patient.weightKg)
      : calculateAlteplaseDose(patient.weightKg)
    : undefined;

  return {
    isEligible,
    timeWindow,
    contraindications,
    warnings,
    recommendedAgent,
    dosing
  };
}

/**
 * Evaluates Endovascular Thrombectomy (EVT) Eligibility
 */
export function evaluateEvtEligibility(
  patient: PatientPresentation,
  nihssScore: number,
  aspectsScore: number
): EvtEligibility {
  if (!patient.hasLargeVesselOcclusion || !patient.lvoLocation || patient.lvoLocation === 'None') {
    return {
      isEligible: false,
      timeWindow: 'ineligible',
      rationale: 'No Large Vessel Occlusion (LVO) detected on CTA/MRA. EVT is indicated specifically for proximal arterial occlusions (ICA, M1, proximal M2, Basilar).',
      targetVessel: 'None'
    };
  }

  if (patient.ctEvidenceOfBleed) {
    return {
      isEligible: false,
      timeWindow: 'ineligible',
      rationale: 'Intracranial hemorrhage present; mechanical thrombectomy contraindicated.',
      targetVessel: patient.lvoLocation
    };
  }

  if (patient.preStrokeMrs > 2) {
    return {
      isEligible: false,
      timeWindow: 'ineligible',
      rationale: 'Pre-stroke disability (mRS > 2); guideline-directed EVT is established for patients with pre-stroke mRS 0-1 (or selected mRS 2).',
      targetVessel: patient.lvoLocation
    };
  }

  // Time window checking: 0-6h (Standard) or 6-24h (DAWN/DEFUSE-3 with penumbral mismatch)
  const hours = patient.hoursFromLastKnownWell;
  if (hours >= 0 && hours <= 6.0) {
    const isAspectsAcceptable = aspectsScore >= 6;
    return {
      isEligible: isAspectsAcceptable,
      timeWindow: 'early_0_to_6h',
      rationale: isAspectsAcceptable
        ? `Eligible for immediate mechanical thrombectomy (0-6 hour window, LVO in ${patient.lvoLocation}, NIHSS ${nihssScore} >= 6, ASPECTS ${aspectsScore} >= 6).`
        : `Large established ischemic core (ASPECTS ${aspectsScore} < 6). EVT carries high risk of futile reperfusion or malignant hemorrhagic conversion (consider randomized trial / multidisciplinary consult).`,
      targetVessel: patient.lvoLocation
    };
  } else if ((hours > 6.0 && hours <= 24.0) || patient.isWakeUpStroke) {
    const isAspectsFavorable = aspectsScore >= 6;
    return {
      isEligible: isAspectsFavorable,
      timeWindow: 'extended_6_to_24h',
      rationale: isAspectsFavorable
        ? `Eligible for extended-window mechanical thrombectomy (6-24h DAWN/DEFUSE-3 criteria) based on clinical-core mismatch (NIHSS ${nihssScore}, ASPECTS ${aspectsScore} >= 6).`
        : `Extended window (> 6h) with low ASPECTS (${aspectsScore} < 6); does not satisfy DAWN/DEFUSE-3 core infarct volume criteria.`,
      targetVessel: patient.lvoLocation
    };
  } else {
    return {
      isEligible: false,
      timeWindow: 'ineligible',
      rationale: 'Time from last known well exceeds 24 hours. Mechanical thrombectomy is not supported by randomized trial evidence.',
      targetVessel: patient.lvoLocation
    };
  }
}

/**
 * Master Comprehensive Acute Stroke Evaluation
 */
export function evaluateAcuteStroke(
  patient: PatientPresentation,
  nihssScores: NihssItemScores,
  affectedAspectsRegions: AspectsRegion[],
  preferredAgent: 'alteplase' | 'tenecteplase' = 'tenecteplase'
): ComprehensiveStrokeEvaluation {
  const { total: totalNihss, category: nihssCategory } = calculateNihss(nihssScores);
  const { score: totalAspects, status: aspectsStatus } = calculateAspects(affectedAspectsRegions);

  const thrombolysis = evaluateThrombolysisEligibility(patient, totalNihss, totalAspects, preferredAgent);
  const evt = evaluateEvtEligibility(patient, totalNihss, totalAspects);

  const requiresImmediateBpReduction = patient.sbp >= 185 || patient.dbp >= 110;

  const bloodPressureGuardrails = {
    targetPreThrombolysis: 'SBP < 185 mmHg and DBP < 110 mmHg prior to lytic initiation',
    targetPostThrombolysis: 'Maintain SBP < 180 mmHg and DBP < 105 mmHg for at least 24 hours post-thrombolysis',
    permissiveNonThrombolysis: 'Permissive hypertension up to 220/120 mmHg (do NOT treat unless > 220/120 or concurrent aortic dissection / ACS)',
    requiresImmediateBpReduction,
    recommendedAntihypertensive: requiresImmediateBpReduction
      ? 'IV Nicardipine (5-15 mg/h continuous infusion) or IV Labetalol (10-20 mg slow IV push over 1-2 min)'
      : 'Blood pressure is currently within safe parameters.'
  };

  const complicationsToMonitor: string[] = [
    'Symptomatic Intracranial Hemorrhage (sICH): Sudden neurological deterioration (NIHSS increase >= 4 points), severe new headache, acute nausea/vomiting, or surge in blood pressure. Immediately stop lytic infusion, order emergent stat non-contrast head CT, and administer Cryoprecipitate 10 units IV + Tranexamic Acid (TXA) 1000 mg IV.',
    'Orolingual Angioedema: Occurs in 1-5% of patients (predominantly unilateral tongue/lip swelling, higher incidence in patients on ACE inhibitors). Administer IV Methylprednisolone 125 mg, Diphenhydramine 50 mg, Famotidine 20 mg, and prepare for emergent fiberoptic intubation if airway compromise threatens.',
    'Reperfusion Arrhythmias & Systemic Hypotension: Monitor continuous telemetry and avoid MAP drops > 20% to prevent collateral ischemic penumbra hypoperfusion.'
  ];

  return {
    totalNihss,
    nihssCategory,
    totalAspects,
    aspectsStatus,
    thrombolysis,
    evt,
    bloodPressureGuardrails,
    complicationsToMonitor
  };
}

/**
 * 4 High-Fidelity Clinical Stroke Presets
 */
export const CLINICAL_STROKE_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  patient: PatientPresentation;
  nihss: NihssItemScores;
  aspectsRegions: AspectsRegion[];
}[] = [
  {
    id: 'acute-m1-lvo-hyperacute',
    name: 'Acute Left M1 LVO: Hyperacute 1.5h Candidate',
    badge: 'Dual Thrombolysis & EVT',
    description: '64-year-old female with right hemiplegia, right facial droop, and global aphasia presenting 90 minutes from last known well. CTA demonstrates Left M1 MCA occlusion. ASPECTS 9, NIHSS 20. Eligible for both IV Tenecteplase and emergent EVT.',
    patient: {
      hoursFromLastKnownWell: 1.5,
      isWakeUpStroke: false,
      age: 64,
      weightKg: 70,
      sbp: 168,
      dbp: 94,
      bloodGlucoseMgDl: 124,
      plateletCount: 245000,
      inr: 1.0,
      aptt: 28,
      onTherapeuticDoac: false,
      doacTakenWithin48h: false,
      hasLargeVesselOcclusion: true,
      lvoLocation: 'M1',
      preStrokeMrs: 0,
      ctEvidenceOfBleed: false,
      ctHypoattenuationGreaterThanThirdMca: false,
      severeHeadTraumaWithin3Months: false,
      intracranialSurgeryWithin3Months: false,
      activeInternalBleeding: false,
      giMalignancyOrBleedWithin21Days: false,
      historyOfPriorIch: false,
      recentIntracranialNeoplasmOrAvm: false
    },
    nihss: {
      loc1a: 0,
      loc1b: 2,
      loc1c: 1,
      bestGaze2: 1,
      visualFields3: 2,
      facialPalsy4: 2,
      motorArmLeft5a: 0,
      motorArmRight5b: 4,
      motorLegLeft6a: 0,
      motorLegRight6b: 3,
      limbAtaxia7: 0,
      sensory8: 1,
      bestLanguage9: 3,
      dysarthria10: 0,
      extinction11: 1
    },
    aspectsRegions: ['insularRibbon'] // 1 region affected -> ASPECTS = 9
  },
  {
    id: 'wakeup-dwi-flair-mismatch',
    name: 'Wake-Up Stroke with DWI-FLAIR Mismatch',
    badge: 'WAKE-UP Protocol',
    description: '72-year-old male awakening with left hemiparesis and neglect (NIHSS 12). Unknown time of onset. MRI demonstrates acute right MCA DWI diffusion restriction with NO FLAIR hyperintensity (DWI-FLAIR mismatch). Eligible for IV thrombolysis.',
    patient: {
      hoursFromLastKnownWell: -1,
      isWakeUpStroke: true,
      mriDwiFlairMismatch: true,
      age: 72,
      weightKg: 82,
      sbp: 154,
      dbp: 88,
      bloodGlucoseMgDl: 110,
      plateletCount: 210000,
      inr: 1.1,
      aptt: 30,
      onTherapeuticDoac: false,
      doacTakenWithin48h: false,
      hasLargeVesselOcclusion: false,
      lvoLocation: 'None',
      preStrokeMrs: 0,
      ctEvidenceOfBleed: false,
      ctHypoattenuationGreaterThanThirdMca: false,
      severeHeadTraumaWithin3Months: false,
      intracranialSurgeryWithin3Months: false,
      activeInternalBleeding: false,
      giMalignancyOrBleedWithin21Days: false,
      historyOfPriorIch: false,
      recentIntracranialNeoplasmOrAvm: false
    },
    nihss: {
      loc1a: 0,
      loc1b: 0,
      loc1c: 0,
      bestGaze2: 1,
      visualFields3: 1,
      facialPalsy4: 2,
      motorArmLeft5a: 3,
      motorArmRight5b: 0,
      motorLegLeft6a: 3,
      motorLegRight6b: 0,
      limbAtaxia7: 0,
      sensory8: 1,
      bestLanguage9: 0,
      dysarthria10: 1,
      extinction11: 1
    },
    aspectsRegions: ['caudate', 'lentiform'] // ASPECTS = 8
  },
  {
    id: 'stroke-mimic-hypoglycemia',
    name: 'Acute Stroke Mimic: Severe Neuroglycopenia',
    badge: 'Diagnostic Trap',
    description: '58-year-old male with type 1 diabetes found somnolent with slurred speech and left hemiparesis (NIHSS 10). Bedside fingerstick glucose is 38 mg/dL. Thrombolysis is withheld; IV Dextrose administration resolves focal deficits completely.',
    patient: {
      hoursFromLastKnownWell: 1.0,
      isWakeUpStroke: false,
      age: 58,
      weightKg: 78,
      sbp: 142,
      dbp: 82,
      bloodGlucoseMgDl: 38,
      plateletCount: 310000,
      inr: 1.0,
      aptt: 26,
      onTherapeuticDoac: false,
      doacTakenWithin48h: false,
      hasLargeVesselOcclusion: false,
      lvoLocation: 'None',
      preStrokeMrs: 0,
      ctEvidenceOfBleed: false,
      ctHypoattenuationGreaterThanThirdMca: false,
      severeHeadTraumaWithin3Months: false,
      intracranialSurgeryWithin3Months: false,
      activeInternalBleeding: false,
      giMalignancyOrBleedWithin21Days: false,
      historyOfPriorIch: false,
      recentIntracranialNeoplasmOrAvm: false
    },
    nihss: {
      loc1a: 1,
      loc1b: 1,
      loc1c: 1,
      bestGaze2: 0,
      visualFields3: 0,
      facialPalsy4: 1,
      motorArmLeft5a: 2,
      motorArmRight5b: 0,
      motorLegLeft6a: 2,
      motorLegRight6b: 0,
      limbAtaxia7: 0,
      sensory8: 1,
      bestLanguage9: 0,
      dysarthria10: 1,
      extinction11: 0
    },
    aspectsRegions: [] // ASPECTS = 10
  },
  {
    id: 'anticoagulated-lvo-direct-evt',
    name: 'Anticoagulated Stroke: DOAC Exclusion & Direct EVT',
    badge: 'Direct-to-Angio Suite',
    description: '79-year-old female with non-valvular AF on therapeutic Apixaban (last dose 4 hours ago) presenting 2 hours after acute right MCA syndrome (NIHSS 18). CTA confirms proximal M1 occlusion. IV thrombolysis is contraindicated; patient proceeds directly to EVT.',
    patient: {
      hoursFromLastKnownWell: 2.0,
      isWakeUpStroke: false,
      age: 79,
      weightKg: 62,
      sbp: 172,
      dbp: 98,
      bloodGlucoseMgDl: 135,
      plateletCount: 180000,
      inr: 1.4,
      aptt: 34,
      onTherapeuticDoac: true,
      doacTakenWithin48h: true,
      hasLargeVesselOcclusion: true,
      lvoLocation: 'M1',
      preStrokeMrs: 1,
      ctEvidenceOfBleed: false,
      ctHypoattenuationGreaterThanThirdMca: false,
      severeHeadTraumaWithin3Months: false,
      intracranialSurgeryWithin3Months: false,
      activeInternalBleeding: false,
      giMalignancyOrBleedWithin21Days: false,
      historyOfPriorIch: false,
      recentIntracranialNeoplasmOrAvm: false
    },
    nihss: {
      loc1a: 0,
      loc1b: 2,
      loc1c: 1,
      bestGaze2: 2,
      visualFields3: 2,
      facialPalsy4: 2,
      motorArmLeft5a: 4,
      motorArmRight5b: 0,
      motorLegLeft6a: 4,
      motorLegRight6b: 0,
      limbAtaxia7: 0,
      sensory8: 1,
      bestLanguage9: 0,
      dysarthria10: 1,
      extinction11: 2
    },
    aspectsRegions: ['lentiform', 'm1'] // ASPECTS = 8
  }
];
