/**
 * AnaphylaxisResuscitationEngine.ts
 * Biophysical & Pharmacotherapeutic Simulation Engine for Anaphylaxis & Refractory Anaphylactic Shock:
 * WAO / EAACI Diagnostic Criteria, Intramuscular Epinephrine Pharmacokinetics (Vastus Lateralis vs Deltoid/SubQ),
 * Refractory Vasoplegic Shock Protocols (Continuous IV Epinephrine, Glucagon in Beta-Blocker Patients, Methylene Blue),
 * Biphasic Reaction Prediction, and Serum Tryptase Peak/Baseline Kinetics.
 *
 * References:
 * - Cardona V, et al. World Allergy Organization Anaphylaxis Guidance 2020. World Allergy Organ J. 2020;13(10):100472.
 * - Simons FE, et al. Epinephrine absorption in children/adults with a history of anaphylaxis.
 *   J Allergy Clin Immunol. 1998;101(1):33-37 & 2001;108(5):871-873.
 * - Muraro A, et al. EAACI guidelines: Anaphylaxis (2021 update). Allergy. 2022;77(2):357-377.
 * - Shaker MS, et al. Anaphylaxis-a 2020 practice parameter update, systematic review, and GRADE analysis.
 *   J Allergy Clin Immunol. 2020;145(4):1082-1123.
 */

export type AllergenExposureCategory = 'food' | 'venom' | 'medication_beta_lactam' | 'iodinated_contrast' | 'idiopathic';
export type InjectionSite = 'im_vastus_lateralis' | 'im_deltoid' | 'subcutaneous';

export interface PatientAnaphylaxisState {
  patientWeightKg: number;
  allergenCategory: AllergenExposureCategory;
  isAllergenKnownExposure: boolean;
  minutesSinceExposure: number;
  onBetaBlocker: boolean;
  onAceInhibitor: boolean;

  // Organ System Manifestations
  cutaneousSigns: {
    generalizedUrticaria: boolean;
    pruritusFlushing: boolean;
    angioedemaLipsTongueUvula: boolean;
  };
  respiratorySigns: {
    stridorLaryngealEdema: boolean;
    wheezingBronchospasm: boolean;
    tachypneaRr: number; // normal 12-20
    spo2Percent: number; // 60 - 100%
  };
  cardiovascularSigns: {
    systolicBpMmHg: number; // 40 - 150
    diastolicBpMmHg: number; // 20 - 95
    heartRateBpm: number; // 40 - 180
    syncopeAlteredSensorium: boolean;
  };
  gastrointestinalSigns: {
    severeAbdominalCramping: boolean;
    repetitiveVomitingDiarrhea: boolean;
  };

  // Interventions Administered
  epinephrineDosesGiven: {
    doseMg: number;
    site: InjectionSite;
    minutesAgo: number;
  }[];
  ivEpinephrineInfusionMcgKgMin: number; // 0.0 - 1.5 mcg/kg/min
  glucagonGivenMg: number; // 0 - 10 mg
  methyleneBlueGivenMgKg: number; // 0 - 2 mg/kg
  crystalloidInfusedMl: number; // e.g. 0 - 4000 mL

  // Laboratory Biomarkers
  acuteSerumTryptaseMcgL: number; // 1 - 100 mcg/L
  baselineSerumTryptaseMcgL: number; // normal 1 - 11 mcg/L
}

export interface WaoDiagnosticReport {
  isAnaphylaxisConfirmed: boolean;
  fulfilledCriteria: ('Criterion 1 (Acute Skin/Mucosa + Respiratory or Hypotension)' |
                      'Criterion 2 (>= 2 Systems Rapidly Post Likely Allergen)' |
                      'Criterion 3 (Hypotension Post Known Allergen)')[];
  severityGrade: 'Mild Cutaneous' | 'Moderate (Respiratory/GI)' | 'Severe (Hypotensive Shock)' | 'Cardiopulmonary Collapse';
  diagnosticRationale: string;
}

export interface EpinephrinePkReport {
  currentPlasmaConcentrationPgMl: number; // target >= 1500 pg/mL for shock reversal
  peakConcentrationPgMl: number;
  timeToPeakMinutes: number;
  absorptionRating: 'Optimal Fast (Vastus Lateralis)' | 'Suboptimal Delayed (Deltoid)' | 'Impaired / Slow (Subcutaneous)';
  therapeuticAdequacy: 'Subtherapeutic (< 1000 pg/mL)' | 'Therapeutic Window (1000 - 3000 pg/mL)' | 'Supra-Therapeutic (> 4000 pg/mL)';
  clinicalPkComment: string;
}

export interface RefractoryShockReport {
  isRefractoryShock: boolean;
  meanArterialPressureMmHg: number;
  glucagonIndicated: boolean;
  glucagonDosing: string;
  ivEpinephrineInfusionRecommendation: string;
  vasoplegiaRescueRecommendation: string;
  clinicalActionDirective: string;
}

export interface BiphasicRiskReport {
  biphasicRiskScore: number; // 0 - 10 scale
  riskCategory: 'Low Risk (4-6h observation)' | 'Moderate Risk (8-12h observation)' | 'High Risk (12-24h ICU observation)';
  riskFactorsPresent: string[];
  mandatoryObservationHours: number;
  dischargeSafetyChecklist: string[];
}

export interface TryptaseValidationReport {
  isMastCellActivationConfirmed: boolean;
  thresholdRequiredMcgL: number; // (1.2 * baseline) + 2.0
  tryptaseDeltaMcgL: number;
  interpretation: string;
}

export interface AnaphylaxisScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientAnaphylaxisState;
  clinicalPearls: string[];
}

/**
 * 1. Evaluate WAO / EAACI 2020/2024 Diagnostic Criteria
 */
export function evaluateWaoCriteria(state: PatientAnaphylaxisState): WaoDiagnosticReport {
  const {
    cutaneousSigns,
    respiratorySigns,
    cardiovascularSigns,
    gastrointestinalSigns,
    isAllergenKnownExposure,
  } = state;

  const hasSkin =
    cutaneousSigns.generalizedUrticaria ||
    cutaneousSigns.pruritusFlushing ||
    cutaneousSigns.angioedemaLipsTongueUvula;

  const hasResp =
    respiratorySigns.stridorLaryngealEdema ||
    respiratorySigns.wheezingBronchospasm ||
    respiratorySigns.spo2Percent < 92 ||
    respiratorySigns.tachypneaRr > 24;

  const isHypotensive =
    cardiovascularSigns.systolicBpMmHg < 90 ||
    cardiovascularSigns.syncopeAlteredSensorium;

  const hasGi =
    gastrointestinalSigns.severeAbdominalCramping ||
    gastrointestinalSigns.repetitiveVomitingDiarrhea;

  const fulfilledCriteria: WaoDiagnosticReport['fulfilledCriteria'] = [];

  // Criterion 1: Acute onset skin/mucosa + (Respiratory OR Hypotension)
  if (hasSkin && (hasResp || isHypotensive)) {
    fulfilledCriteria.push('Criterion 1 (Acute Skin/Mucosa + Respiratory or Hypotension)');
  }

  // Criterion 2: 2 or more of (Skin, Resp, Hypotension, GI) rapidly after likely allergen
  let organSystemCount = 0;
  if (hasSkin) organSystemCount++;
  if (hasResp) organSystemCount++;
  if (isHypotensive) organSystemCount++;
  if (hasGi) organSystemCount++;

  if (organSystemCount >= 2) {
    fulfilledCriteria.push('Criterion 2 (>= 2 Systems Rapidly Post Likely Allergen)');
  }

  // Criterion 3: Reduced BP alone after exposure to known allergen
  if (isAllergenKnownExposure && isHypotensive) {
    fulfilledCriteria.push('Criterion 3 (Hypotension Post Known Allergen)');
  }

  const isAnaphylaxisConfirmed = fulfilledCriteria.length > 0;

  let severityGrade: WaoDiagnosticReport['severityGrade'] = 'Mild Cutaneous';
  if (cardiovascularSigns.systolicBpMmHg < 70 || respiratorySigns.spo2Percent < 80) {
    severityGrade = 'Cardiopulmonary Collapse';
  } else if (isHypotensive) {
    severityGrade = 'Severe (Hypotensive Shock)';
  } else if (hasResp || hasGi) {
    severityGrade = 'Moderate (Respiratory/GI)';
  }

  const diagnosticRationale = isAnaphylaxisConfirmed
    ? `Anaphylaxis CONFIRMED under WAO criteria (${fulfilledCriteria.join('; ')}). Epinephrine IM must be administered immediately without delay.`
    : 'Clinical findings do not currently fulfill consensus criteria for systemic anaphylaxis. Maintain close monitoring for evolving multi-system manifestations.';

  return {
    isAnaphylaxisConfirmed,
    fulfilledCriteria,
    severityGrade,
    diagnosticRationale,
  };
}

/**
 * 2. Calculate Epinephrine Pharmacokinetics & Injection Site Dynamics
 * Vastus Lateralis IM: Tmax ~8 min, Cmax ~2100 pg/mL
 * Deltoid IM: Tmax ~25 min, Cmax ~1300 pg/mL
 * Subcutaneous: Tmax ~34 min, Cmax ~800 pg/mL
 */
export function calculateEpiPharmacokinetics(
  doses: PatientAnaphylaxisState['epinephrineDosesGiven'],
  ivInfusionRateMcgKgMin: number,
  weightKg: number
): EpinephrinePkReport {
  let totalPlasmaPgMl = 50.0; // Basal endogenous epinephrine ~30-70 pg/mL
  let maxCmax = 0;
  let fastestTmax = 999;
  let primarySite: InjectionSite = 'im_vastus_lateralis';

  for (const dose of doses) {
    let tMaxMin = 8.0;
    let cMaxPgMl = (dose.doseMg / 0.3) * 2100.0 * (70 / Math.max(40, weightKg));
    primarySite = dose.site;

    if (dose.site === 'im_deltoid') {
      tMaxMin = 25.0;
      cMaxPgMl *= 0.62;
    } else if (dose.site === 'subcutaneous') {
      tMaxMin = 34.0;
      cMaxPgMl *= 0.38;
    }

    if (tMaxMin < fastestTmax) fastestTmax = tMaxMin;
    if (cMaxPgMl > maxCmax) maxCmax = cMaxPgMl;

    // First-order absorption and elimination curve: C(t) = Cmax * (t/tmax) * exp(1 - t/tmax)
    const t = Math.max(0.1, dose.minutesAgo);
    const doseConcentration = cMaxPgMl * (t / tMaxMin) * Math.exp(1 - t / tMaxMin);
    totalPlasmaPgMl += Math.max(0, doseConcentration);
  }

  // Add continuous IV infusion contribution (Steady state ~ infusionRate * 18000)
  if (ivInfusionRateMcgKgMin > 0) {
    const ivContribution = ivInfusionRateMcgKgMin * 22000.0;
    totalPlasmaPgMl += ivContribution;
  }

  totalPlasmaPgMl = Math.round(totalPlasmaPgMl);

  let absorptionRating: EpinephrinePkReport['absorptionRating'] = 'Optimal Fast (Vastus Lateralis)';
  if (primarySite === 'im_deltoid') absorptionRating = 'Suboptimal Delayed (Deltoid)';
  else if (primarySite === 'subcutaneous') absorptionRating = 'Impaired / Slow (Subcutaneous)';

  let therapeuticAdequacy: EpinephrinePkReport['therapeuticAdequacy'] = 'Subtherapeutic (< 1000 pg/mL)';
  if (totalPlasmaPgMl >= 4000) therapeuticAdequacy = 'Supra-Therapeutic (> 4000 pg/mL)';
  else if (totalPlasmaPgMl >= 1000) therapeuticAdequacy = 'Therapeutic Window (1000 - 3000 pg/mL)';

  const clinicalPkComment =
    primarySite === 'im_vastus_lateralis'
      ? 'Anterolateral thigh (vastus lateralis) IM administration delivers rapid vasodilation/perfusion-driven absorption with Tmax ~8 min, significantly faster than deltoid or subcutaneous routes.'
      : 'Subcutaneous or deltoid injection delays peak systemic epinephrine levels by 20-30 minutes due to local vasoconstriction and lower vascularity. Immediately repeat in anterolateral thigh if patient remains in shock.';

  return {
    currentPlasmaConcentrationPgMl: totalPlasmaPgMl,
    peakConcentrationPgMl: Math.round(maxCmax),
    timeToPeakMinutes: fastestTmax === 999 ? 8 : fastestTmax,
    absorptionRating,
    therapeuticAdequacy,
    clinicalPkComment,
  };
}

/**
 * 3. Evaluate Refractory Anaphylactic Shock, Glucagon Protocol & Vasoplegia Rescue
 */
export function evaluateRefractoryShock(state: PatientAnaphylaxisState): RefractoryShockReport {
  const {
    cardiovascularSigns,
    epinephrineDosesGiven,
    onBetaBlocker,
    ivEpinephrineInfusionMcgKgMin,
    glucagonGivenMg,
    methyleneBlueGivenMgKg,
  } = state;

  const map = Math.round((2 * cardiovascularSigns.diastolicBpMmHg + cardiovascularSigns.systolicBpMmHg) / 3);
  const totalImDoses = epinephrineDosesGiven.length;

  // Refractory shock defined as persistent hypotension (MAP < 65 or SBP < 90) despite >= 2 IM doses
  const isRefractoryShock = totalImDoses >= 2 && map < 65;

  // Glucagon indicated if patient on beta-blockers with refractory shock
  const glucagonIndicated = onBetaBlocker && (map < 65 || totalImDoses >= 1);

  let glucagonDosing = 'Not Indicated (Patient not on chronic beta-blocker therapy)';
  if (glucagonIndicated) {
    glucagonDosing =
      glucagonGivenMg >= 1
        ? `Glucagon administered (${glucagonGivenMg} mg). Maintain IV continuous infusion at 5 to 15 mcg/min to bypass blocked beta-receptors.`
        : 'MANDATORY GLUCAGON RESCUE: Administer Glucagon 1 - 5 mg IV push over 5 minutes, followed by 5 - 15 mcg/min continuous infusion. (Bypasses beta-receptors via glucagon GPCR to generate cAMP).';
  }

  let ivEpinephrineInfusionRecommendation = 'Not currently required; monitor response to IM epinephrine.';
  if (isRefractoryShock || map < 60) {
    ivEpinephrineInfusionRecommendation =
      ivEpinephrineInfusionMcgKgMin > 0
        ? `Continuous IV Epinephrine running at ${ivEpinephrineInfusionMcgKgMin} mcg/kg/min. Titrate by 0.05 mcg/kg/min every 2-3 min to target MAP >= 65 mmHg.`
        : 'Initiate continuous IV Epinephrine infusion: 0.05 - 0.1 mcg/kg/min (or 2 - 10 mcg/min). Rapid IV crystalloid bolus (20-30 mL/kg) via wide-bore access.';
  }

  let vasoplegiaRescueRecommendation = 'Standard vasopressor support adequate.';
  if (isRefractoryShock && ivEpinephrineInfusionMcgKgMin >= 0.3) {
    vasoplegiaRescueRecommendation =
      methyleneBlueGivenMgKg > 0
        ? `Methylene Blue administered (${methyleneBlueGivenMgKg} mg/kg). Guanylate cyclase inhibition actively reversing nitric oxide-mediated vasoplegia.`
        : 'Refractory Nitric Oxide Vasoplegia: Consider Methylene Blue 1.5 - 2.0 mg/kg IV over 20-60 min (inhibits inducible NOS and soluble guanylate cyclase). Consider Vasopressin 0.03 units/min.';
  }

  let clinicalActionDirective = '';
  if (!isRefractoryShock && map >= 65) {
    clinicalActionDirective = 'Hemodynamically compensated. Continue supportive crystalloids, H1/H2 antihistamines, and serial exams.';
  } else if (glucagonIndicated && glucagonGivenMg === 0) {
    clinicalActionDirective = 'CRITICAL: Beta-blocker blunts epinephrine action and risks severe unopposed alpha vasoconstriction. Administer IV Glucagon 1-5 mg immediately!';
  } else {
    clinicalActionDirective = 'Refractory anaphylactic shock active. Escalate to continuous IV epinephrine infusion, aggressive volume loading, and vasopressin/methylene blue if uncorrected.';
  }

  return {
    isRefractoryShock,
    meanArterialPressureMmHg: map,
    glucagonIndicated,
    glucagonDosing,
    ivEpinephrineInfusionRecommendation,
    vasoplegiaRescueRecommendation,
    clinicalActionDirective,
  };
}

/**
 * 4. Biphasic Anaphylaxis Risk Scoring & Monitoring Protocol
 */
export function calculateBiphasicRisk(state: PatientAnaphylaxisState): BiphasicRiskReport {
  const {
    cardiovascularSigns,
    epinephrineDosesGiven,
    minutesSinceExposure,
    respiratorySigns,
  } = state;

  let score = 0;
  const riskFactorsPresent: string[] = [];

  // 1. Initial severe hypotension / shock
  if (cardiovascularSigns.systolicBpMmHg < 80) {
    score += 3;
    riskFactorsPresent.push('Severe initial hypotension / shock (SBP < 80 mmHg)');
  } else if (cardiovascularSigns.systolicBpMmHg < 90) {
    score += 2;
    riskFactorsPresent.push('Hypotension on presentation (SBP < 90 mmHg)');
  }

  // 2. Wide pulse pressure
  const pulsePressure = cardiovascularSigns.systolicBpMmHg - cardiovascularSigns.diastolicBpMmHg;
  if (pulsePressure > 50) {
    score += 1;
    riskFactorsPresent.push(`Wide pulse pressure (${pulsePressure} mmHg - marked peripheral vasodilation)`);
  }

  // 3. Need for > 1 dose of epinephrine
  if (epinephrineDosesGiven.length >= 2) {
    score += 3;
    riskFactorsPresent.push(`Multiple epinephrine doses required (${epinephrineDosesGiven.length} doses given)`);
  }

  // 4. Delayed first epinephrine dose (> 30-45 min from exposure)
  const firstDose = epinephrineDosesGiven[0];
  if (firstDose) {
    const timeToFirstDose = minutesSinceExposure - firstDose.minutesAgo;
    if (timeToFirstDose > 45) {
      score += 2;
      riskFactorsPresent.push(`Delayed initial epinephrine (> 45 min post-exposure: ${timeToFirstDose} min)`);
    }
  }

  // 5. Severe laryngeal or bronchospastic compromise
  if (respiratorySigns.stridorLaryngealEdema || respiratorySigns.wheezingBronchospasm) {
    score += 1;
    riskFactorsPresent.push('Severe respiratory involvement (stridor / bronchospasm)');
  }

  let riskCategory: BiphasicRiskReport['riskCategory'] = 'Low Risk (4-6h observation)';
  let mandatoryObservationHours = 6;

  if (score >= 5) {
    riskCategory = 'High Risk (12-24h ICU observation)';
    mandatoryObservationHours = 24;
  } else if (score >= 2) {
    riskCategory = 'Moderate Risk (8-12h observation)';
    mandatoryObservationHours = 12;
  }

  const dischargeSafetyChecklist = [
    'Prescribe 2 Epinephrine Auto-Injectors (0.3 mg for adult, 0.15 mg for child) with teach-back demonstration.',
    'Provide personalized Written Anaphylaxis Emergency Action Plan.',
    'Referral to Allergy / Immunology specialist for trigger confirmation and immunotherapy evaluation.',
    'Patient counseling on trigger avoidance, medical alert bracelet, and calling 911 immediately upon auto-injector use.',
  ];

  return {
    biphasicRiskScore: score,
    riskCategory,
    riskFactorsPresent,
    mandatoryObservationHours,
    dischargeSafetyChecklist,
  };
}

/**
 * 5. Serum Tryptase Peak & Consensus Diagnostic Validation
 * Consensus Formula: Peak Tryptase >= (1.2 * Baseline) + 2.0 mcg/L
 */
export function validateSerumTryptase(
  acuteTryptaseMcgL: number,
  baselineTryptaseMcgL: number
): TryptaseValidationReport {
  const thresholdRequiredMcgL = Math.round((1.2 * baselineTryptaseMcgL + 2.0) * 10) / 10;
  const tryptaseDeltaMcgL = Math.round((acuteTryptaseMcgL - baselineTryptaseMcgL) * 10) / 10;
  const isMastCellActivationConfirmed = acuteTryptaseMcgL >= thresholdRequiredMcgL;

  let interpretation = '';
  if (isMastCellActivationConfirmed) {
    interpretation = `Systemic mast cell degranulation CONFIRMED. Acute level (${acuteTryptaseMcgL} mcg/L) exceeds the international consensus threshold of (1.2 × baseline + 2) = ${thresholdRequiredMcgL} mcg/L.`;
  } else {
    interpretation = `Tryptase elevation does not meet the consensus criteria for systemic degranulation (Acute: ${acuteTryptaseMcgL} vs Threshold: ${thresholdRequiredMcgL} mcg/L). Note: Food-induced anaphylaxis often has normal tryptase levels.`;
  }

  return {
    isMastCellActivationConfirmed,
    thresholdRequiredMcgL,
    tryptaseDeltaMcgL,
    interpretation,
  };
}

/**
 * 6. Clinical Scenarios Catalog
 */
export const ANAPHYLAXIS_SCENARIOS: Record<string, AnaphylaxisScenario> = {
  peanut_stridor_angioedema: {
    id: 'peanut_stridor_angioedema',
    name: '1. Food Anaphylaxis with Severe Laryngeal Stridor & Angioedema',
    patientSummary: '22yo college student with known peanut allergy accidentally consumed satay sauce. Within 12 minutes: severe lip/tongue angioedema, inspiratory stridor, diffuse hives, and SpO2 88%.',
    initialState: {
      patientWeightKg: 70,
      allergenCategory: 'food',
      isAllergenKnownExposure: true,
      minutesSinceExposure: 15,
      onBetaBlocker: false,
      onAceInhibitor: false,
      cutaneousSigns: {
        generalizedUrticaria: true,
        pruritusFlushing: true,
        angioedemaLipsTongueUvula: true,
      },
      respiratorySigns: {
        stridorLaryngealEdema: true,
        wheezingBronchospasm: true,
        tachypneaRr: 32,
        spo2Percent: 88,
      },
      cardiovascularSigns: {
        systolicBpMmHg: 92,
        diastolicBpMmHg: 55,
        heartRateBpm: 124,
        syncopeAlteredSensorium: false,
      },
      gastrointestinalSigns: {
        severeAbdominalCramping: true,
        repetitiveVomitingDiarrhea: false,
      },
      epinephrineDosesGiven: [],
      ivEpinephrineInfusionMcgKgMin: 0,
      glucagonGivenMg: 0,
      methyleneBlueGivenMgKg: 0,
      crystalloidInfusedMl: 500,
      acuteSerumTryptaseMcgL: 14.5,
      baselineSerumTryptaseMcgL: 4.2,
    },
    clinicalPearls: [
      'Immediate Epinephrine 0.3-0.5 mg IM in the anterolateral thigh (vastus lateralis) is the single most important intervention.',
      'Antihistamines and corticosteroids do NOT prevent or treat upper airway obstruction or circulatory collapse and must never delay epinephrine.',
      'Prepare for difficult airway: laryngeal edema can progress within minutes; early intubation with video laryngoscopy if stridor worsens.',
    ],
  },
  beta_blocker_refractory_shock: {
    id: 'beta_blocker_refractory_shock',
    name: '2. Beta-Blocker Blunted Refractory Vasoplegic Shock (CT Contrast)',
    patientSummary: '68yo male with ischemic cardiomyopathy on Carvedilol 25mg BID developed immediate profound collapse following IV iodinated CT contrast. SBP 62/34, HR 52 (blunted reflex tachycardia), unresponsive to 2 doses of IM epinephrine.',
    initialState: {
      patientWeightKg: 82,
      allergenCategory: 'iodinated_contrast',
      isAllergenKnownExposure: false,
      minutesSinceExposure: 25,
      onBetaBlocker: true,
      onAceInhibitor: true,
      cutaneousSigns: {
        generalizedUrticaria: true,
        pruritusFlushing: true,
        angioedemaLipsTongueUvula: false,
      },
      respiratorySigns: {
        stridorLaryngealEdema: false,
        wheezingBronchospasm: true,
        tachypneaRr: 28,
        spo2Percent: 91,
      },
      cardiovascularSigns: {
        systolicBpMmHg: 62,
        diastolicBpMmHg: 34,
        heartRateBpm: 52,
        syncopeAlteredSensorium: true,
      },
      gastrointestinalSigns: {
        severeAbdominalCramping: false,
        repetitiveVomitingDiarrhea: false,
      },
      epinephrineDosesGiven: [
        { doseMg: 0.5, site: 'im_vastus_lateralis', minutesAgo: 15 },
        { doseMg: 0.5, site: 'im_vastus_lateralis', minutesAgo: 5 },
      ],
      ivEpinephrineInfusionMcgKgMin: 0.1,
      glucagonGivenMg: 0,
      methyleneBlueGivenMgKg: 0,
      crystalloidInfusedMl: 2000,
      acuteSerumTryptaseMcgL: 28.0,
      baselineSerumTryptaseMcgL: 5.0,
    },
    clinicalPearls: [
      'Beta-blockers block beta-2 receptors, preventing epinephrine from activating adenylate cyclase, resulting in refractory vasoplegia and persistent bronchospasm.',
      'Epinephrine in high doses can cause severe unopposed alpha-1 vasoconstriction, worsening myocardial strain in patients with heart failure.',
      'IV Glucagon (1-5 mg IV over 5 min, then 5-15 mcg/min infusion) directly activates adenylate cyclase via non-adrenergic GPCR pathways, overcoming the beta-blockade.',
    ],
  },
  delayed_epi_biphasic_hazard: {
    id: 'delayed_epi_biphasic_hazard',
    name: '3. Hymenoptera Sting with Delayed Epinephrine (High Biphasic Hazard)',
    patientSummary: '35yo landscaper stung multiple times by yellowjackets. Treated initially with oral diphenhydramine by colleagues; epinephrine was delayed until 65 minutes after sting when profound hypotension (SBP 76) and syncope occurred.',
    initialState: {
      patientWeightKg: 78,
      allergenCategory: 'venom',
      isAllergenKnownExposure: true,
      minutesSinceExposure: 75,
      onBetaBlocker: false,
      onAceInhibitor: false,
      cutaneousSigns: {
        generalizedUrticaria: true,
        pruritusFlushing: true,
        angioedemaLipsTongueUvula: true,
      },
      respiratorySigns: {
        stridorLaryngealEdema: false,
        wheezingBronchospasm: true,
        tachypneaRr: 24,
        spo2Percent: 93,
      },
      cardiovascularSigns: {
        systolicBpMmHg: 84,
        diastolicBpMmHg: 42,
        heartRateBpm: 118,
        syncopeAlteredSensorium: true,
      },
      gastrointestinalSigns: {
        severeAbdominalCramping: true,
        repetitiveVomitingDiarrhea: true,
      },
      epinephrineDosesGiven: [
        { doseMg: 0.3, site: 'im_vastus_lateralis', minutesAgo: 10 },
      ],
      ivEpinephrineInfusionMcgKgMin: 0,
      glucagonGivenMg: 0,
      methyleneBlueGivenMgKg: 0,
      crystalloidInfusedMl: 1000,
      acuteSerumTryptaseMcgL: 34.0,
      baselineSerumTryptaseMcgL: 4.8,
    },
    clinicalPearls: [
      'Delayed epinephrine (> 30-45 minutes from onset) is the paramount risk factor for both fatal outcomes and delayed biphasic anaphylaxis.',
      'Biphasic anaphylaxis occurs in up to 15% of patients, peaking 4-12 hours after symptom resolution without further allergen exposure.',
      'This high-risk patient requires mandatory extended monitoring for at least 12-24 hours prior to safe discharge consideration.',
    ],
  },
  perioperative_cefazolin_collapse: {
    id: 'perioperative_cefazolin_collapse',
    name: '4. Perioperative IgE Cefazolin Collapse (General Anesthesia)',
    patientSummary: '49yo female undergoing knee arthroplasty developed sudden unmeasurable blood pressure (SBP 48), peak airway pressures rising from 18 to 44 cmH2O, and flushing 4 minutes after IV Cefazolin induction.',
    initialState: {
      patientWeightKg: 65,
      allergenCategory: 'medication_beta_lactam',
      isAllergenKnownExposure: false,
      minutesSinceExposure: 10,
      onBetaBlocker: false,
      onAceInhibitor: false,
      cutaneousSigns: {
        generalizedUrticaria: true,
        pruritusFlushing: true,
        angioedemaLipsTongueUvula: false,
      },
      respiratorySigns: {
        stridorLaryngealEdema: false,
        wheezingBronchospasm: true,
        tachypneaRr: 22,
        spo2Percent: 82,
      },
      cardiovascularSigns: {
        systolicBpMmHg: 48,
        diastolicBpMmHg: 22,
        heartRateBpm: 138,
        syncopeAlteredSensorium: true,
      },
      gastrointestinalSigns: {
        severeAbdominalCramping: false,
        repetitiveVomitingDiarrhea: false,
      },
      epinephrineDosesGiven: [
        { doseMg: 0.5, site: 'im_vastus_lateralis', minutesAgo: 6 },
        { doseMg: 0.5, site: 'im_vastus_lateralis', minutesAgo: 2 },
      ],
      ivEpinephrineInfusionMcgKgMin: 0.25,
      glucagonGivenMg: 0,
      methyleneBlueGivenMgKg: 0,
      crystalloidInfusedMl: 2500,
      acuteSerumTryptaseMcgL: 62.0,
      baselineSerumTryptaseMcgL: 5.5,
    },
    clinicalPearls: [
      'In anesthetized patients, cutaneous signs are hidden by surgical drapes; unexplained profound hypotension and sudden bronchospasm are the cardinal hallmarks.',
      'Discontinue volatile anesthetics (which cause vasodilation and myocardial depression); switch to 100% FiO2 and IV amnestics.',
      'Serum tryptase must be drawn 1 to 2 hours after event onset, with a convalescent baseline drawn >= 24 hours later to prove IgE-mediated anaphylaxis.',
    ],
  },
};
