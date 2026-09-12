/**
 * TherapeuticPlasmaExchangeEngine.ts
 * Critical Care, Hematology & Apheresis Medicine Simulation Engine
 * Follows American Society for Apheresis (ASFA 2023 9th Edition) Guidelines.
 * Location: frontend/.gemini/skills/TherapeuticPlasmaExchangeEngine.ts
 */

export interface PatientDemographics {
  weightKg: number; // kg (40-140)
  hematocritFraction: number; // 0.20 - 0.55
  baselinePathogenConc: number; // arbitrary relative units (e.g. 100% or antibody titer)
  baselineFibrinogenMgDl: number; // normal 200-400 mg/dL
  baselinePlatelets: number; // /uL (normal 150k - 400k)
  baselineIonizedCaMmolL: number; // normal 1.15 - 1.30 mmol/L
}

export type ReplacementFluidType = 'albumin_5' | 'ffp' | 'split_albumin_ffp';

export interface TpeProcedureSettings {
  targetPvMultiplier: number; // 0.5 to 2.0 PV (typical 1.0 - 1.5)
  replacementFluidType: ReplacementFluidType;
  splitFfpFraction: number; // e.g. 0.25 (25% FFP at the end of exchange)
  acdaRatio: number; // Blood:ACD-A ratio (10 to 16, typical 12:1)
  bloodFlowRateMlMin: number; // 50 to 150 mL/min
  calciumGluconateInfusionMgHr: number; // 0 to 2000 mg/hr
  hasLiverImpairment: boolean; // impaired citrate metabolism
}

export type CitrateToxicityLevel = 'none' | 'mild_paresthesia' | 'moderate_tetany' | 'severe_arrhythmia';

export interface TpeLiveState {
  procedureMinutes: number;
  plasmaVolumeMl: number;
  exchangedVolumeMl: number;
  fractionPvExchanged: number;
  currentPathogenConc: number;
  pathogenRemovalPercent: number;
  currentFibrinogenMgDl: number;
  currentPlatelets: number;
  systemicIonizedCaMmolL: number;
  totalCaToIonizedCaRatio: number; // Ratio > 2.5 indicates citrate accumulation
  citrateToxicityLevel: CitrateToxicityLevel;
  hypofibrinogenemiaAlert: boolean; // Fibrinogen < 100 mg/dL
  procedureCompleted: boolean;
  log: string[];
}

export interface CoagulationAndSafetyReport {
  isSafe: boolean;
  bleedingRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  hypocalcemiaAlert: boolean;
  citrateAccumulationAlert: boolean;
  warnings: string[];
  recommendations: string[];
}

export interface AsfaIndicationInfo {
  diseaseId: string;
  name: string;
  asfaCategory: 'I' | 'II' | 'III' | 'IV';
  categoryDescription: string;
  recommendedReplacement: ReplacementFluidType;
  replacementRationale: string;
  exchangeSchedule?: string;
  frequencyRecommendation: string;
  primaryTargetSubstance: string;
  clinicalPearls: string[];
}

/**
 * 1. Calculate Patient Plasma Volume (PV)
 * Formula: PV (mL) = Weight (kg) * 70 mL/kg * (1 - Hct)
 */
export function calculatePlasmaVolume(weightKg: number, hematocritFraction: number): number {
  const totalBloodVolumeMl = weightKg * 70;
  return Math.round(totalBloodVolumeMl * (1 - hematocritFraction));
}

/**
 * 2. Calculate First-Order Solute Removal Fraction
 * Formula: C(Ve) / C0 = e^(-Ve / PV)
 * Percent Removed = (1 - e^(-fraction)) * 100%
 */
export function calculateSoluteFractionRemaining(pvExchangedFraction: number): number {
  return Math.exp(-pvExchangedFraction);
}

export function calculateSoluteRemovalPercent(pvExchangedFraction: number): number {
  return Math.round((1 - Math.exp(-pvExchangedFraction)) * 1000) / 10;
}

/**
 * 3. Initialize TPE Procedure
 */
export function initializeTpeSession(
  demographics: PatientDemographics,
  settings: TpeProcedureSettings
): TpeLiveState {
  const pvMl = calculatePlasmaVolume(demographics.weightKg, demographics.hematocritFraction);
  return {
    procedureMinutes: 0,
    plasmaVolumeMl: pvMl,
    exchangedVolumeMl: 0,
    fractionPvExchanged: 0,
    currentPathogenConc: demographics.baselinePathogenConc,
    pathogenRemovalPercent: 0,
    currentFibrinogenMgDl: demographics.baselineFibrinogenMgDl,
    currentPlatelets: demographics.baselinePlatelets,
    systemicIonizedCaMmolL: demographics.baselineIonizedCaMmolL,
    totalCaToIonizedCaRatio: 2.1,
    citrateToxicityLevel: 'none',
    hypofibrinogenemiaAlert: demographics.baselineFibrinogenMgDl < 100,
    procedureCompleted: false,
    log: [
      `TPE initiated. Estimated Plasma Volume: ${pvMl} mL. Target Exchange: ${(
        settings.targetPvMultiplier * pvMl
      ).toFixed(0)} mL (${settings.targetPvMultiplier} PV). Replacement: ${
        settings.replacementFluidType === 'albumin_5'
          ? '5% Human Albumin'
          : settings.replacementFluidType === 'ffp'
          ? 'Fresh Frozen Plasma (FFP)'
          : 'Split 5% Albumin + FFP finish'
      }.`,
    ],
  };
}

/**
 * 4. Step TPE Procedure Simulation
 * Simulates delta time and volume exchanged, recalculating:
 * - Solute exponential clearance
 * - Fibrinogen wash-out / replenishment
 * - Citrate influx vs liver clearance vs IV calcium replacement
 */
export function stepTpeProcedure(
  state: TpeLiveState,
  demographics: PatientDemographics,
  settings: TpeProcedureSettings,
  deltaMinutes: number
): TpeLiveState {
  if (state.procedureCompleted) {
    return state;
  }

  const updatedLog = [...state.log];

  // Plasma extraction rate (mL/min) approx 35-45% of blood flow rate
  const plasmaExtractionRateMlMin = Math.round(
    settings.bloodFlowRateMlMin * (1 - demographics.hematocritFraction) * 0.8
  );
  const deltaVolumeMl = plasmaExtractionRateMlMin * deltaMinutes;

  const targetTotalVolumeMl = settings.targetPvMultiplier * state.plasmaVolumeMl;
  const newExchangedVolumeMl = Math.min(targetTotalVolumeMl, state.exchangedVolumeMl + deltaVolumeMl);
  const newProcedureMinutes = state.procedureMinutes + deltaMinutes;
  const newFractionPv = newExchangedVolumeMl / state.plasmaVolumeMl;

  // 1. Solute removal (first order)
  const remainingFraction = calculateSoluteFractionRemaining(newFractionPv);
  const newPathogenConc = Math.round(demographics.baselinePathogenConc * remainingFraction * 10) / 10;
  const newRemovalPercent = calculateSoluteRemovalPercent(newFractionPv);

  // 2. Coagulation / Fibrinogen kinetics
  let newFibrinogen = demographics.baselineFibrinogenMgDl;
  if (settings.replacementFluidType === 'albumin_5') {
    // Fibrinogen is washed out like any other plasma protein without replacement
    newFibrinogen = Math.max(
      35,
      Math.round(demographics.baselineFibrinogenMgDl * remainingFraction)
    );
  } else if (settings.replacementFluidType === 'ffp') {
    // Donor FFP maintains normal physiological fibrinogen ~240-280 mg/dL
    newFibrinogen = Math.round(demographics.baselineFibrinogenMgDl * 0.95);
  } else {
    // Split: Albumin first, then FFP in the final fraction
    const ffpThresholdFraction = settings.targetPvMultiplier * (1 - settings.splitFfpFraction);
    if (newFractionPv < ffpThresholdFraction) {
      newFibrinogen = Math.max(
        40,
        Math.round(demographics.baselineFibrinogenMgDl * remainingFraction)
      );
    } else {
      // FFP infusing in final phase, restoring fibrinogen
      const ffpPhaseProgress =
        (newFractionPv - ffpThresholdFraction) / (settings.targetPvMultiplier - ffpThresholdFraction);
      const postAlbuminNadir = demographics.baselineFibrinogenMgDl * Math.exp(-ffpThresholdFraction);
      newFibrinogen = Math.round(postAlbuminNadir + ffpPhaseProgress * (240 - postAlbuminNadir));
    }
  }

  // Platelet mild consumption (5-8% drop over entire exchange)
  const plateletDecay = 1 - 0.07 * Math.min(1, newFractionPv);
  const newPlatelets = Math.round(demographics.baselinePlatelets * plateletDecay);

  // 3. Citrate & Ionized Calcium kinetics
  // Citrate delivery rate: BFR / ratio
  const acdaInfusionMlMin = settings.bloodFlowRateMlMin / settings.acdaRatio;
  // Patient citrate accumulation rate (75% returns to patient)
  const citrateLoadIndex = acdaInfusionMlMin * 0.75 * (settings.hasLiverImpairment ? 1.8 : 1.0);

  // Calcium deficit created by citrate: drops iCa unless matched by IV Calcium
  // 1000 mg Calcium Gluconate/hr neutralizes ~1.2 mL/min ACD-A return
  const caSupplyIndex = settings.calciumGluconateInfusionMgHr / 850;
  const netCaDeficitRate = (citrateLoadIndex - caSupplyIndex) * 0.045; // mmol/L per 15 min

  let newIonizedCa = Math.max(
    0.60,
    Math.min(1.35, state.systemicIonizedCaMmolL - netCaDeficitRate * (deltaMinutes / 15))
  );
  newIonizedCa = Math.round(newIonizedCa * 100) / 100;

  // Total Ca to Ionized Ca ratio (normal 2.0 - 2.2; > 2.5 indicates citrate accumulation)
  const totalCaEstimateMmolL = 2.2 + (settings.hasLiverImpairment ? 0.3 * newFractionPv : 0.05 * newFractionPv);
  const newRatio = Math.round((totalCaEstimateMmolL / newIonizedCa) * 10) / 10;

  // Symptom severity
  let toxicity: CitrateToxicityLevel = 'none';
  if (newIonizedCa < 0.75 || newRatio > 2.8) {
    toxicity = 'severe_arrhythmia';
  } else if (newIonizedCa < 0.90 || newRatio > 2.5) {
    toxicity = 'moderate_tetany';
  } else if (newIonizedCa < 1.05) {
    toxicity = 'mild_paresthesia';
  }

  // Check completion
  const isDone = newExchangedVolumeMl >= targetTotalVolumeMl;
  if (isDone && !state.procedureCompleted) {
    updatedLog.push(
      `Minute ${newProcedureMinutes}: Target exchange of ${targetTotalVolumeMl.toFixed(
        0
      )} mL reached. Final solute removal: ${newRemovalPercent}%. Final Fibrinogen: ${newFibrinogen} mg/dL. Final iCa: ${newIonizedCa.toFixed(
        2
      )} mmol/L.`
    );
  }

  // Alerts in log
  if (newFibrinogen < 100 && !state.hypofibrinogenemiaAlert) {
    updatedLog.push(
      `Warning: Fibrinogen dropped to ${newFibrinogen} mg/dL (< 100 mg/dL). High risk of post-procedural bleeding if invasive line/lumbar puncture planned.`
    );
  }

  if (toxicity !== 'none' && state.citrateToxicityLevel === 'none') {
    updatedLog.push(
      `Warning: Patient reports citrate-induced hypocalcemia (${toxicity.replace(
        /_/g,
        ' '
      )}). Ionized Ca = ${newIonizedCa.toFixed(2)} mmol/L. Increase IV Calcium Gluconate infusion.`
    );
  }

  return {
    procedureMinutes: newProcedureMinutes,
    plasmaVolumeMl: state.plasmaVolumeMl,
    exchangedVolumeMl: newExchangedVolumeMl,
    fractionPvExchanged: Math.round(newFractionPv * 100) / 100,
    currentPathogenConc: newPathogenConc,
    pathogenRemovalPercent: newRemovalPercent,
    currentFibrinogenMgDl: newFibrinogen,
    currentPlatelets: newPlatelets,
    systemicIonizedCaMmolL: newIonizedCa,
    totalCaToIonizedCaRatio: newRatio,
    citrateToxicityLevel: toxicity,
    hypofibrinogenemiaAlert: newFibrinogen < 100,
    procedureCompleted: isDone,
    log: updatedLog,
  };
}

/**
 * 5. Coagulation & Safety Audit
 */
export function evaluateCoagulationAndElectrolytes(
  state: TpeLiveState,
  settings: TpeProcedureSettings
): CoagulationAndSafetyReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let bleedingRisk: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';

  // Fibrinogen assessment
  if (state.currentFibrinogenMgDl < 70) {
    bleedingRisk = 'Critical';
    warnings.push(`Severe hypofibrinogenemia (${state.currentFibrinogenMgDl} mg/dL < 70 mg/dL). Severe spontaneous bleeding risk.`);
    recommendations.push('Administer Cryoprecipitate (10 units) or switch remaining replacement to FFP. Delay any vascular catheter removal or lumbar puncture by 24-48 hours.');
  } else if (state.currentFibrinogenMgDl < 100) {
    bleedingRisk = 'High';
    warnings.push(`Moderate hypofibrinogenemia (${state.currentFibrinogenMgDl} mg/dL < 100 mg/dL). Contraindicates invasive procedures.`);
    recommendations.push('Monitor post-procedure fibrinogen. Consider 1-2 units FFP or Cryoprecipitate if patient has active bleeding or requires urgent biopsy.');
  } else if (state.currentFibrinogenMgDl < 150) {
    bleedingRisk = 'Moderate';
  }

  // Calcium assessment
  let hypocalcemiaAlert = false;
  if (state.systemicIonizedCaMmolL < 0.90) {
    hypocalcemiaAlert = true;
    warnings.push(`Marked hypocalcemia (iCa ${state.systemicIonizedCaMmolL.toFixed(2)} mmol/L < 0.90 mmol/L). Patient at risk for tetany and prolonged QTc.`);
    recommendations.push('Administer IV Calcium Gluconate 1-2 g IV slow push over 10 minutes, and increase continuous maintenance infusion.');
  } else if (state.systemicIonizedCaMmolL < 1.05) {
    hypocalcemiaAlert = true;
    warnings.push(`Mild hypocalcemia (iCa ${state.systemicIonizedCaMmolL.toFixed(2)} mmol/L). Mild perioral paresthesias may occur.`);
    recommendations.push('Increase IV Calcium Gluconate infusion rate or provide oral calcium carbonate 1000 mg.');
  }

  // Citrate lock / accumulation
  let citrateAccumulationAlert = false;
  if (state.totalCaToIonizedCaRatio > 2.5) {
    citrateAccumulationAlert = true;
    warnings.push(`Citrate accumulation detected (Total Ca / Ionized Ca ratio = ${state.totalCaToIonizedCaRatio.toFixed(1)} > 2.5). Citrate metabolism is saturated.`);
    recommendations.push('Decrease blood flow rate, widen Blood:ACD-A ratio (e.g. 14:1 or 16:1), and verify absence of severe hepatic hypoperfusion.');
  }

  const isSafe = bleedingRisk !== 'Critical' && state.systemicIonizedCaMmolL >= 0.90 && !citrateAccumulationAlert;

  return {
    isSafe,
    bleedingRisk,
    hypocalcemiaAlert,
    citrateAccumulationAlert,
    warnings,
    recommendations,
  };
}

/**
 * 6. ASFA 2023 Guidelines Catalog
 */
export const ASFA_INDICATIONS: Record<string, AsfaIndicationInfo> = {
  ttp: {
    diseaseId: 'ttp',
    name: 'Thrombotic Thrombocytopenic Purpura (TTP)',
    asfaCategory: 'I',
    categoryDescription: 'First-line standard of care therapy. Mandatory emergency initiation.',
    recommendedReplacement: 'ffp',
    replacementRationale: 'FFP is mandatory to supply ADAMTS13 metalloprotease which cleaves ultra-large VWF multimers.',
    frequencyRecommendation: 'Daily 1.0 - 1.5 PV exchange until platelet count > 150,000/uL and normal LDH for 2 consecutive days.',
    primaryTargetSubstance: 'Anti-ADAMTS13 autoantibodies (removed) + ADAMTS13 enzyme (replenished via donor FFP)',
    clinicalPearls: [
      'Never use 5% albumin as sole replacement in TTP; donor plasma is required to deliver ADAMTS13.',
      'Platelet transfusions are contraindicated in TTP (fuel for microvascular thrombosis) unless life-threatening hemorrhage.',
      'Caplacizumab (anti-VWF nanobody) and steroids are given concurrently.',
    ],
  },
  myasthenia_gravis: {
    diseaseId: 'myasthenia_gravis',
    name: 'Myasthenia Gravis (Crisis / Pre-Thymectomy)',
    asfaCategory: 'I',
    categoryDescription: 'First-line therapy for acute respiratory failure (crisis) or pre-operative optimization.',
    recommendedReplacement: 'albumin_5',
    replacementRationale: '5% Albumin is preferred to avoid transfusion-related risks (TRALI/TACO) since coagulation factors do not need replacement.',
    frequencyRecommendation: '5 - 6 exchanges (1.0 - 1.5 PV each) over 10 - 14 days (typically every other day).',
    primaryTargetSubstance: 'Pathogenic anti-Acetylcholine Receptor (anti-AChR) or anti-MuSK IgG autoantibodies',
    clinicalPearls: [
      'Rapid clinical improvement typically begins after the 2nd or 3rd exchange.',
      'Albumin dilutes clotting factors; check fibrinogen before extubation or thymectomy surgery.',
      'Extravascular IgG re-equilibrates into plasma over 24-48 hours, necessitating every-other-day scheduling.',
    ],
  },
  gbs: {
    diseaseId: 'gbs',
    name: 'Guillain-Barré Syndrome (GBS)',
    asfaCategory: 'I',
    categoryDescription: 'First-line therapy with efficacy equivalent to IVIG (combining IVIG + TPE has no added benefit).',
    recommendedReplacement: 'albumin_5',
    replacementRationale: '5% Albumin avoids blood donor allergic reactions and viral risks.',
    frequencyRecommendation: '4 - 5 exchanges (1.0 - 1.5 PV each) over 7 - 14 days.',
    primaryTargetSubstance: 'Anti-ganglioside antibodies (GM1, GD1a, GQ1b in Miller Fisher) and neurodestructive complement complexes',
    clinicalPearls: [
      'Most effective when initiated within the first 7-14 days of symptom onset.',
      'Do NOT administer IVIG immediately before TPE as TPE will simply wash out the expensive IVIG.',
      'Autonomic instability is common in GBS; watch for severe bradycardia or hypotension during line placement.',
    ],
  },
  anti_gbm: {
    diseaseId: 'anti_gbm',
    name: 'Anti-GBM Disease (Goodpasture Syndrome)',
    asfaCategory: 'I',
    categoryDescription: 'First-line therapy combined with cyclophosphamide and pulsed steroids to save renal and pulmonary function.',
    recommendedReplacement: 'split_albumin_ffp',
    replacementRationale: 'Use 5% Albumin primarily; switch to FFP if patient has active diffuse alveolar hemorrhage (DAH).',
    frequencyRecommendation: 'Daily 1.0 - 1.5 PV exchange for 14 days or until anti-GBM circulating titers are undetectable.',
    primaryTargetSubstance: 'Circulating IgG antibodies directed against the NC1 domain of collagen IV alpha-3 chain',
    clinicalPearls: [
      'Pulmonary hemorrhage responds rapidly to plasma exchange within 24-48 hours.',
      'Dialysis-dependent patients at presentation who have 100% cellular crescents rarely recover native renal function.',
    ],
  },
  nmosd: {
    diseaseId: 'nmosd',
    name: 'Neuromyelitis Optica Spectrum Disorder (NMOSD)',
    asfaCategory: 'II',
    categoryDescription: 'Second-line therapy for acute optic neuritis or transverse myelitis attacks refractory to high-dose IV methylprednisolone.',
    recommendedReplacement: 'albumin_5',
    replacementRationale: '5% Albumin provides safe oncotic replacement for targeted autoantibody clearance.',
    frequencyRecommendation: '5 - 7 exchanges every other day.',
    primaryTargetSubstance: 'Pathogenic anti-Aquaporin-4 (anti-AQP4) IgG autoantibodies that trigger astrocytic foot-process necrosis',
    clinicalPearls: [
      'Early initiation (< 5-7 days after steroid failure) is critical to salvage visual acuity and spinal motor recovery.',
    ],
  },
};

export function getAsfaIndication(diseaseId: string): AsfaIndicationInfo {
  return ASFA_INDICATIONS[diseaseId] || ASFA_INDICATIONS.ttp;
}
