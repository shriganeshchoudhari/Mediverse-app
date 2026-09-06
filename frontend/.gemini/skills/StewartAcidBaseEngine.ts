/**
 * StewartAcidBaseEngine.ts
 * Mediverse — Stewart Physico-Chemical Acid-Base & Strong Ion Difference (SID) Engine
 * Location: frontend/.gemini/skills/StewartAcidBaseEngine.ts
 *
 * Biophysical Models:
 * - Peter Stewart Physico-Chemical Theory of Acid-Base:
 *   • Three strictly independent variables dictate biological [H+] and [HCO3-]:
 *     1. Strong Ion Difference (SID)
 *     2. Total Non-Volatile Weak Acids (Atot: Albumin + Phosphate)
 *     3. Partial Pressure of Carbon Dioxide (pCO2)
 *   • All other ions ([H+], [OH-], [HCO3-], [CO3(2-)], [A-]) are dependent variables governed by:
 *     - Electrical neutrality: [SID] + [H+] = [HCO3-] + [A-] + [CO3(2-)] + [OH-]
 *     - Mass conservation of buffers (Atot = [HA] + [A-])
 *     - Dissociation equilibria (water, carbonic acid, weak acids)
 * - Quantitative Formulations:
 *   • SID_apparent (mEq/L) = [Na+] + [K+] + [Ca2+] + [Mg2+] - [Cl-] - [Lactate-]
 *     (Normal: 40–42 mEq/L)
 *   • SID_effective (mEq/L) = [HCO3-] + [Albumin-] + [Pi-]
 *     where:
 *       [Albumin-] (mEq/L) = [Albumin (g/dL)] * 10 * (0.123 * pH - 0.631)
 *       [Pi-] (mEq/L) = [Phosphate (mg/dL)] * 0.323 * (0.309 * pH - 0.469)
 *   • Strong Ion Gap (SIG) = SID_apparent - SID_effective
 *     (Normal: 0 ± 2 mEq/L; SIG > 2 indicates unmeasured anions e.g. ketoacids, toxins, uremic anions)
 *   • Total Weak Acids Atot (mmol/L) ≈ 0.28 * Albumin(g/L) + 0.3 * Phosphate(mmol/L)
 *   • Resuscitation Fluid Mechanics:
 *     - 0.9% Normal Saline (SID = 0 mEq/L: 154 Na, 154 Cl) -> Drives hyperchloremic metabolic acidosis.
 *     - Balanced Crystalloid (Plasma-Lyte / Ringer's Lactate, SID = 28–50 mEq/L) -> Preserves physiological SID.
 *     - 8.4% Sodium Bicarbonate (SID = 1000 mEq/L) -> Rapid SID elevation.
 */

export type FluidInfusionType = 'NONE' | 'NORMAL_SALINE_09' | 'BALANCED_CRYSTALLOID' | 'SODIUM_BICARBONATE_84';

export type StewartAlarm =
  | 'OPTIMAL_ACID_BASE'
  | 'SEVERE_HYPERCHLOREMIC_ACIDOSIS'
  | 'UNMEASURED_ANIONS_HIGH_SIG'
  | 'HYPOALBUMINEMIC_ALKALOSIS_MASK'
  | 'CONTRACTION_HYPOCHLOREMIC_ALKALOSIS'
  | 'RESPIRATORY_ACIDOSIS_SEVERE'
  | 'RESPIRATORY_ALKALOSIS_ACUTE';

export type StewartPresetId =
  | 'NORMAL_PLASMA_HOMEOSTASIS'
  | 'SALINE_RESUSCITATION_HYPERCHLOREMIC'
  | 'SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK'
  | 'DKA_UNMEASURED_ANIONS'
  | 'UREMIC_ACIDOSIS_ESRD'
  | 'CONTRACTION_ALKALOSIS_VOMITING';

export interface StewartPresetInfo {
  id: StewartPresetId;
  title: string;
  clinicalScenario: string;
  primaryDisorder: string;
  initialState: Partial<StewartInputParams>;
}

export interface StewartInputParams {
  presetId: StewartPresetId;
  naMeqL: number;
  kMeqL: number;
  caMeqL: number;
  mgMeqL: number;
  clMeqL: number;
  lactateMeqL: number;
  albuminGDL: number; // 3.5 - 5.0 normal
  phosphateMgDL: number; // 2.5 - 4.5 normal
  pco2MmHg: number; // 35 - 45 normal
  fluidInfusion: FluidInfusionType;
  fluidVolumeLiters: number; // 0 to 5 Liters
}

export interface StewartState {
  ph: number;
  hco3MeqL: number;
  sidApparentMeqL: number;
  sidEffectiveMeqL: number;
  sigMeqL: number; // Strong Ion Gap
  atotMmolL: number; // Total non-volatile weak acids
  albuminChargeMeqL: number;
  phosphateChargeMeqL: number;
  classicalAnionGapMeqL: number;
  correctedAnionGapMeqL: number; // Figge-Jabor-Kazda correction
  activeAlarms: StewartAlarm[];
  clinicalRecommendation: string;
}

export const STEWART_PRESETS: Record<StewartPresetId, StewartPresetInfo> = {
  NORMAL_PLASMA_HOMEOSTASIS: {
    id: 'NORMAL_PLASMA_HOMEOSTASIS',
    title: 'Normal Physiological Acid-Base Homeostasis',
    clinicalScenario: 'Healthy 28-year-old baseline evaluation. Normal electrolyte panel and plasma proteins.',
    primaryDisorder: 'Normal acid-base equilibrium (pH 7.40, SID 42 mEq/L, SIG 0 mEq/L).',
    initialState: {
      presetId: 'NORMAL_PLASMA_HOMEOSTASIS',
      naMeqL: 140,
      kMeqL: 4.0,
      caMeqL: 2.2,
      mgMeqL: 1.8,
      clMeqL: 105,
      lactateMeqL: 1.0,
      albuminGDL: 4.2,
      phosphateMgDL: 3.5,
      pco2MmHg: 40,
      fluidInfusion: 'NONE',
      fluidVolumeLiters: 0,
    },
  },
  SALINE_RESUSCITATION_HYPERCHLOREMIC: {
    id: 'SALINE_RESUSCITATION_HYPERCHLOREMIC',
    title: 'Post-Resuscitation Hyperchloremic Metabolic Acidosis',
    clinicalScenario: '42-year-old polytrauma patient resuscitated with 5 Liters of 0.9% Normal Saline (SID = 0 mEq/L) in ED.',
    primaryDisorder: 'Iatrogenic hyperchloremic strong ion acidosis: low SID (28 mEq/L), normal SIG (0 mEq/L), pH 7.24.',
    initialState: {
      presetId: 'SALINE_RESUSCITATION_HYPERCHLOREMIC',
      naMeqL: 142,
      kMeqL: 4.2,
      caMeqL: 2.2,
      mgMeqL: 1.5,
      clMeqL: 118,
      lactateMeqL: 1.8,
      albuminGDL: 3.2,
      phosphateMgDL: 3.0,
      pco2MmHg: 36,
      fluidInfusion: 'NORMAL_SALINE_09',
      fluidVolumeLiters: 3,
    },
  },
  SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK: {
    id: 'SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK',
    title: 'Septic Shock with Severe Hypoalbuminemia (Masked Acidosis)',
    clinicalScenario: '68-year-old in ICU with septic shock and capillary leak. Classical AG and HCO3- appear pseudo-normal.',
    primaryDisorder: 'Severe hypoalbuminemia (Albumin 1.8 g/dL) reduces Atot, masking severe underlying unmeasured strong ion gap acidosis (SIG 7.8 mEq/L).',
    initialState: {
      presetId: 'SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK',
      naMeqL: 138,
      kMeqL: 4.5,
      caMeqL: 2.0,
      mgMeqL: 1.4,
      clMeqL: 104,
      lactateMeqL: 3.2,
      albuminGDL: 1.8,
      phosphateMgDL: 2.8,
      pco2MmHg: 32,
      fluidInfusion: 'NONE',
      fluidVolumeLiters: 0,
    },
  },
  DKA_UNMEASURED_ANIONS: {
    id: 'DKA_UNMEASURED_ANIONS',
    title: 'Severe Diabetic Ketoacidosis (High Unmeasured Anion Gap)',
    clinicalScenario: '22-year-old with Type 1 DM presenting with Kussmaul respirations, dehydration, and elevated beta-hydroxybutyrate.',
    primaryDisorder: 'High unmeasured strong anion gap (SIG 14 mEq/L, beta-hydroxybutyrate + acetoacetate), severe strong ion acidosis (pH 7.12).',
    initialState: {
      presetId: 'DKA_UNMEASURED_ANIONS',
      naMeqL: 132,
      kMeqL: 5.4,
      caMeqL: 2.3,
      mgMeqL: 1.8,
      clMeqL: 98,
      lactateMeqL: 2.5,
      albuminGDL: 4.4,
      phosphateMgDL: 4.0,
      pco2MmHg: 20,
      fluidInfusion: 'NONE',
      fluidVolumeLiters: 0,
    },
  },
  UREMIC_ACIDOSIS_ESRD: {
    id: 'UREMIC_ACIDOSIS_ESRD',
    title: 'End-Stage Renal Disease (ESRD) Uremic Acidosis',
    clinicalScenario: '59-year-old with missed hemodialysis sessions presenting with fluid overload, asterixis, and uremia.',
    primaryDisorder: 'Severe uremic anion retention (sulfates, urate, hippurate; SIG 9.2 mEq/L), hyperphosphatemia, and hyperkalemia.',
    initialState: {
      presetId: 'UREMIC_ACIDOSIS_ESRD',
      naMeqL: 136,
      kMeqL: 6.2,
      caMeqL: 2.0,
      mgMeqL: 2.4,
      clMeqL: 102,
      lactateMeqL: 1.5,
      albuminGDL: 3.6,
      phosphateMgDL: 7.8,
      pco2MmHg: 30,
      fluidInfusion: 'NONE',
      fluidVolumeLiters: 0,
    },
  },
  CONTRACTION_ALKALOSIS_VOMITING: {
    id: 'CONTRACTION_ALKALOSIS_VOMITING',
    title: 'Gastric Outlet Obstruction Hypochloremic Alkalosis',
    clinicalScenario: '54-year-old with peptic pyloric stenosis and 5 days of profuse non-bilious emesis.',
    primaryDisorder: 'Severe hypochloremia ([Cl-] 78 mEq/L) creates pathologically elevated SID (58 mEq/L), driving profound metabolic alkalosis (pH 7.58).',
    initialState: {
      presetId: 'CONTRACTION_ALKALOSIS_VOMITING',
      naMeqL: 138,
      kMeqL: 2.9,
      caMeqL: 2.4,
      mgMeqL: 1.6,
      clMeqL: 78,
      lactateMeqL: 1.2,
      albuminGDL: 4.8,
      phosphateMgDL: 3.4,
      pco2MmHg: 48,
      fluidInfusion: 'NONE',
      fluidVolumeLiters: 0,
    },
  },
};

/**
 * Calculates Figge-Jabor-Kazda classical Anion Gap corrected for Albumin
 */
export function calculateCorrectedAnionGap(
  na: number,
  k: number,
  cl: number,
  hco3: number,
  albuminGDL: number
): { classicalAg: number; correctedAg: number } {
  const classicalAg = na + k - (cl + hco3);
  // Corrected AG = Observed AG + 2.5 * (4.0 - Albumin)
  const correctedAg = parseFloat((classicalAg + 2.5 * (4.0 - albuminGDL)).toFixed(1));
  return { classicalAg: parseFloat(classicalAg.toFixed(1)), correctedAg };
}

/**
 * Main Stewart Physico-Chemical Equation Solver
 */
export function computeStewartAcidBase(params: StewartInputParams): StewartState {
  let {
    presetId,
    naMeqL,
    kMeqL,
    caMeqL,
    mgMeqL,
    clMeqL,
    lactateMeqL,
    albuminGDL,
    phosphateMgDL,
    pco2MmHg,
    fluidInfusion,
    fluidVolumeLiters,
  } = params;

  // Fluid Infusion Dynamics
  if (fluidVolumeLiters > 0 && fluidInfusion !== 'NONE') {
    if (fluidInfusion === 'NORMAL_SALINE_09') {
      // 0.9% NaCl adds Na 154 and Cl 154 per liter, expanding ECF (~14L normal)
      const ecfBaselineL = 14;
      const totalVolume = ecfBaselineL + fluidVolumeLiters;
      naMeqL = Math.round((naMeqL * ecfBaselineL + 154 * fluidVolumeLiters) / totalVolume);
      clMeqL = Math.round((clMeqL * ecfBaselineL + 154 * fluidVolumeLiters) / totalVolume);
      albuminGDL = parseFloat(((albuminGDL * ecfBaselineL) / totalVolume).toFixed(1));
    } else if (fluidInfusion === 'BALANCED_CRYSTALLOID') {
      // Plasma-Lyte: Na 140, Cl 98, K 5, Mg 3, Gluconate/Acetate 50 (SID = 50)
      const ecfBaselineL = 14;
      const totalVolume = ecfBaselineL + fluidVolumeLiters;
      naMeqL = Math.round((naMeqL * ecfBaselineL + 140 * fluidVolumeLiters) / totalVolume);
      clMeqL = Math.round((clMeqL * ecfBaselineL + 98 * fluidVolumeLiters) / totalVolume);
      kMeqL = parseFloat(((kMeqL * ecfBaselineL + 5 * fluidVolumeLiters) / totalVolume).toFixed(1));
    } else if (fluidInfusion === 'SODIUM_BICARBONATE_84') {
      // 8.4% NaHCO3: Na 1000 mEq/L, Cl 0 (SID = 1000)
      naMeqL += Math.round(fluidVolumeLiters * 10);
    }
  }

  // 1. Apparent Strong Ion Difference (SID_apparent)
  const sidApparentMeqL = parseFloat(
    (naMeqL + kMeqL + caMeqL + mgMeqL - clMeqL - lactateMeqL).toFixed(1)
  );

  // Unmeasured strong anions burden (DKA ketoacids, uremic sulfates, sepsis anions)
  let unmeasuredAnionsMeqL = 0;
  if (presetId === 'DKA_UNMEASURED_ANIONS') unmeasuredAnionsMeqL = 24;
  if (presetId === 'UREMIC_ACIDOSIS_ESRD') unmeasuredAnionsMeqL = 12;
  if (presetId === 'SEPTIC_SHOCK_HYPOALBUMINEMIA_MASK') unmeasuredAnionsMeqL = 8;

  // 2. Estimate pH and HCO3- from Stewart Equilibrium
  // Effective in-vivo driving SID accounting for unmeasured strong anions
  const effectiveDrivingSid = sidApparentMeqL - unmeasuredAnionsMeqL;
  const deltaSid = effectiveDrivingSid - 42;
  const deltaPco2 = pco2MmHg - 40;
  const deltaAlbumin = albuminGDL - 4.0;

  let estimatedPh = 7.40 + 0.015 * deltaSid - 0.008 * deltaPco2 - 0.02 * deltaAlbumin;

  const ph = parseFloat(Math.max(6.8, Math.min(7.75, estimatedPh)).toFixed(2));

  // Henderson-Hasselbalch dependent HCO3-
  // pH = 6.1 + log10([HCO3-] / (0.0307 * pCO2))
  // [HCO3-] = 0.0307 * pCO2 * 10^(pH - 6.1)
  const hco3MeqL = parseFloat(
    (0.0307 * pco2MmHg * Math.pow(10, ph - 6.1)).toFixed(1)
  );

  // 3. Albumin and Phosphate Negative Charges
  // [Albumin-] = Albumin(g/dL) * 10 * (0.123 * pH - 0.631)
  const albuminChargeMeqL = parseFloat(
    (albuminGDL * 10 * Math.max(0, 0.123 * ph - 0.631)).toFixed(1)
  );

  // [Pi-] = Phosphate(mg/dL) * 0.323 * (0.309 * pH - 0.469)
  const phosphateChargeMeqL = parseFloat(
    (phosphateMgDL * 0.323 * Math.max(0, 0.309 * ph - 0.469)).toFixed(1)
  );

  // 4. Effective Strong Ion Difference (SID_effective)
  const sidEffectiveMeqL = parseFloat(
    (hco3MeqL + albuminChargeMeqL + phosphateChargeMeqL).toFixed(1)
  );

  // 5. Strong Ion Gap (SIG) = SID_apparent - SID_effective
  const normalBaselineOffset = (caMeqL + mgMeqL) - 0.3;
  const sigRaw = (sidApparentMeqL - sidEffectiveMeqL) - normalBaselineOffset + unmeasuredAnionsMeqL;
  const sigMeqL = parseFloat(Math.max(0, sigRaw).toFixed(1));

  // 6. Total Weak Acids (Atot)
  const atotMmolL = parseFloat(
    (0.28 * (albuminGDL * 10) + 0.3 * (phosphateMgDL / 3.1)).toFixed(1)
  );

  // 7. Classical vs Corrected Anion Gap
  const { classicalAg: classicalAnionGapMeqL, correctedAg: correctedAnionGapMeqL } =
    calculateCorrectedAnionGap(naMeqL, kMeqL, clMeqL, hco3MeqL, albuminGDL);

  // 8. Active Alarms
  const activeAlarms: StewartAlarm[] = [];

  if (clMeqL >= 112 || sidApparentMeqL < 34) {
    activeAlarms.push('SEVERE_HYPERCHLOREMIC_ACIDOSIS');
  }

  if (sigMeqL >= 4.0) {
    activeAlarms.push('UNMEASURED_ANIONS_HIGH_SIG');
  }

  if (albuminGDL <= 2.2 && (sigMeqL >= 3.0 || sidApparentMeqL < 38)) {
    activeAlarms.push('HYPOALBUMINEMIC_ALKALOSIS_MASK');
  }

  if (clMeqL <= 88 || sidApparentMeqL >= 48) {
    activeAlarms.push('CONTRACTION_HYPOCHLOREMIC_ALKALOSIS');
  }

  if (pco2MmHg >= 55) {
    activeAlarms.push('RESPIRATORY_ACIDOSIS_SEVERE');
  }

  if (pco2MmHg <= 25) {
    activeAlarms.push('RESPIRATORY_ALKALOSIS_ACUTE');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL_ACID_BASE');
  }

  // 9. Clinical Recommendation
  let clinicalRecommendation = 'Physico-chemical acid-base parameters within physiological targets (SID 40-42 mEq/L, SIG ~0 mEq/L).';

  if (activeAlarms.includes('SEVERE_HYPERCHLOREMIC_ACIDOSIS')) {
    clinicalRecommendation =
      'HYPERCHLOREMIC STRONG ION ACIDOSIS: Elevated plasma chloride has narrowed the SID. Discontinue 0.9% Normal Saline; switch to balanced crystalloid (Plasma-Lyte or Hartmann\'s solution) to restore physiological SID and avoid renal afferent vasoconstriction.';
  } else if (activeAlarms.includes('HYPOALBUMINEMIC_ALKALOSIS_MASK')) {
    clinicalRecommendation =
      'MASKED ACIDOSIS: Severe hypoalbuminemia lowers non-volatile buffer Atot, creating a strong alkalinizing effect that falsely normalizes bicarbonate. High SIG confirms occult circulating tissue anions. Investigate sepsis, occult ischemia, or toxic metabolites.';
  } else if (activeAlarms.includes('UNMEASURED_ANIONS_HIGH_SIG')) {
    clinicalRecommendation =
      'HIGH STRONG ION GAP (SIG > 2 mEq/L): Marked retention of unmeasured strong anions (ketoacids, uremic sulfates, toxic alcohols, pyroglutamate). Address primary pathology (insulin for DKA, emergent hemodialysis for ESRD, or antidote for toxins).';
  } else if (activeAlarms.includes('CONTRACTION_HYPOCHLOREMIC_ALKALOSIS')) {
    clinicalRecommendation =
      'HYPOCHLOREMIC CONTRACTION ALKALOSIS: Excessive chloride loss widens the SID to > 48 mEq/L. Resuscitate with chloride-rich fluid (0.9% Normal Saline + KCl) to restore chloride and normalize SID.';
  }

  return {
    ph,
    hco3MeqL,
    sidApparentMeqL,
    sidEffectiveMeqL,
    sigMeqL,
    atotMmolL,
    albuminChargeMeqL,
    phosphateChargeMeqL,
    classicalAnionGapMeqL,
    correctedAnionGapMeqL,
    activeAlarms,
    clinicalRecommendation,
  };
}
