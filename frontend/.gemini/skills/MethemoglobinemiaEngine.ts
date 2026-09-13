/**
 * MethemoglobinemiaEngine.ts
 * Clinical Toxicology, Hematology & Emergency Medicine Simulation Engine:
 * Methemoglobinemia, Sulfhemoglobinemia, Pulse Oximetry Saturation Gap,
 * Methylene Blue Reduction Kinetics, G6PD Deficiency Contraindication,
 * Ascorbic Acid, and Red Blood Cell Exchange Transfusion.
 */

export type ToxinEtiology =
  | 'BENZOCAINE' // Topical anesthetic spray (endoscopy/ENT)
  | 'DAPSONE' // Leprosy, PCP prophylaxis, dermatology (enterohepatic rebound)
  | 'NITRITES_POPPERS' // Amyl/isobutyl nitrite, sodium nitrite, well water
  | 'PHENAZOPYRIDINE' // Pyridium (urinary analgesic)
  | 'SULFONAMIDES' // Sulfamethoxazole / sulfadiazine
  | 'CONGENITAL_CYT_B5R'; // Cytochrome b5 reductase deficiency

export interface MethemoglobinPatientParams {
  patientWeightKg: number; // e.g. 70 kg
  etiology: ToxinEtiology;
  baselineMetHbPct: number; // Initial MetHb level % (0 to 80%)
  sulfhemoglobinPresent: boolean; // Sulfhemoglobinemia (irreversible porphyrin oxidation)
  sulfHbPct: number; // SulfHb % (0 to 20%)
  paO2MmHg: number; // Arterial dissolved oxygen (normal 80-100, on 100% FiO2 ~ 400-500)
  hemoglobinGPerDl: number; // Total Hb (e.g. 14.0 g/dL)
  g6pdDeficient: boolean; // G6PD deficiency (severe hemolysis hazard with methylene blue)
  concurrentSsriUse: boolean; // Concurrent SSRI/SNRI (serotonin syndrome risk with methylene blue)
  fiO2: number; // 0.21 to 1.0
  methyleneBlueDoseMgKg: number; // 0 to 4 mg/kg (standard 1-2 mg/kg IV)
  ascorbicAcidDoseGrams: number; // 0 to 10 g IV (alternative in G6PD deficiency)
  hyperbaricOxygenApplied: boolean; // HBOT at 2.5-3.0 ATA
  exchangeTransfusionCompleted: boolean; // RBC Exchange transfusion (definitive clearance)
  elapsedMinutesSinceTreatment: number; // 0 to 120 minutes
}

export interface MethemoglobinSimulationOutput {
  currentMetHbPct: number; // Current MetHb percentage
  currentSulfHbPct: number; // Current SulfHb percentage
  effectiveOxyHbPct: number; // Functional oxygen-carrying hemoglobin %
  measuredPulseSpO2: number; // Standard two-wavelength pulse oximeter reading (plateaus ~85%)
  coOximetrySaO2: number; // True arterial oxygen saturation from multi-wavelength co-oximeter
  saturationGap: number; // Calculated/Pulse SpO2 minus Co-Oximetry SaO2
  bloodVisualAppearance: 'NORMAL_BRIGHT_RED' | 'DARK_VENOUS' | 'CHOCOLATE_BROWN' | 'SLATE_BLACK';
  clinicalSeverity: 'NORMAL' | 'MILD_CYANOSIS' | 'MODERATE_HYPOXIA' | 'SEVERE_ACIDOSIS' | 'LETHAL_COMA';
  leftShiftP50MmHg: number; // P50 of Hb dissociation curve (normal ~26.8 mmHg; shifts left <20)
  totalOxygenContentCaO2: number; // mL O2 / dL blood = (1.34 * Hb * OxyHb% / 100) + (0.0031 * PaO2)
  antidoteEfficacy: {
    methyleneBlueEffective: boolean;
    leukomethyleneBlueGenerated: boolean;
    reductionRatePerHour: number; // % MetHb reduction per hour
    summary: string;
  };
  g6pdHemolysisCrisis: boolean;
  serotoninSyndromeRisk: boolean;
  reboundMethemoglobinRisk: boolean;
  exchangeTransfusionIndicated: boolean;
  clinicalAlerts: Array<{
    level: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    rationale: string;
  }>;
}

export const DEFAULT_METHB_PATIENT: MethemoglobinPatientParams = {
  patientWeightKg: 70,
  etiology: 'BENZOCAINE',
  baselineMetHbPct: 38, // Typical post-TEE or bronchoscopy benzocaine toxicity
  sulfhemoglobinPresent: false,
  sulfHbPct: 0,
  paO2MmHg: 450, // High dissolved PaO2 on 100% non-rebreather
  hemoglobinGPerDl: 14.0,
  g6pdDeficient: false,
  concurrentSsriUse: false,
  fiO2: 1.0,
  methyleneBlueDoseMgKg: 0,
  ascorbicAcidDoseGrams: 0,
  hyperbaricOxygenApplied: false,
  exchangeTransfusionCompleted: false,
  elapsedMinutesSinceTreatment: 0
};

/**
 * Calculates two-wavelength pulse oximeter (SpO2) response to MetHb and SulfHb.
 * In 2-wavelength pulse oximetry (660 nm red and 940 nm infrared), MetHb absorbs equally
 * at both wavelengths (ratio R ~ 1.0), forcing the calibrated algorithm to plateau near 85%.
 */
export function calculateTwoWavelengthSpO2(metHbPct: number, sulfHbPct: number, actualSaO2: number): number {
  if (sulfHbPct > 0) {
    // Sulfhemoglobin absorbs predominantly at 620-630 nm and falsely depresses SpO2 (often 75-85%)
    const sulfInfluence = Math.min(1.0, sulfHbPct / 15);
    return Math.round(actualSaO2 * (1 - sulfInfluence) + 78 * sulfInfluence);
  }

  // MetHb calibration weighting
  // When MetHb is low (< 5%), SpO2 reflects actual SaO2.
  // As MetHb rises > 20-30%, SpO2 is asymptotically driven toward 85% regardless of PaO2 or true SaO2.
  const metWeight = Math.min(1.0, metHbPct / 35);
  const reading = actualSaO2 * (1 - metWeight) + 85 * metWeight;
  return Math.min(100, Math.max(65, Math.round(reading * 10) / 10));
}

/**
 * Main simulation function for Methemoglobinemia and Sulfhemoglobinemia
 */
export function computeMethemoglobinKinetics(params: MethemoglobinPatientParams): MethemoglobinSimulationOutput {
  const alerts: MethemoglobinSimulationOutput['clinicalAlerts'] = [];

  // 1. Antidote Reduction Kinetics & Adverse Interlocks
  let methyleneBlueEffective = false;
  let leukomethyleneBlueGenerated = false;
  let g6pdHemolysisCrisis = false;
  let serotoninSyndromeRisk = false;
  let reductionRatePerHour = 0; // % per hour
  let antidoteSummary = '';

  const timeHours = Math.max(0, params.elapsedMinutesSinceTreatment) / 60;

  if (params.methyleneBlueDoseMgKg > 0) {
    if (params.g6pdDeficient) {
      g6pdHemolysisCrisis = true;
      methyleneBlueEffective = false;
      antidoteSummary =
        'FATAL CONTRAINDICATION: Methylene blue requires NADPH generated by G6PD in the hexose monophosphate shunt. In G6PD deficiency, methylene blue acts as an unregulated oxidant, precipitating massive acute intravascular hemolysis and Heinz body formation.';
      alerts.push({
        level: 'CRITICAL',
        message: 'LETHAL G6PD CONTRAINDICATION: Methylene Blue Induced Acute Intravascular Hemolysis',
        rationale:
          'Methylene blue is dependent on NADPH-MetHb reductase. G6PD-deficient erythrocytes lack NADPH, making methylene blue ineffective and triggering catastrophic oxidative hemolysis with hemoglobinuria and renal failure.'
      });
    } else if (params.sulfhemoglobinPresent) {
      methyleneBlueEffective = false;
      antidoteSummary =
        'INEFFECTIVE: Methylene blue cannot reduce sulfhemoglobin because sulfur is irreversibly covalently incorporated into the pyrrole ring. Methylene blue may worsen oxidant stress.';
      alerts.push({
        level: 'WARNING',
        message: 'Methylene Blue Ineffective in Sulfhemoglobinemia',
        rationale:
          'Sulfhemoglobin contains an irreversible sulfur covalent bond that cannot be reduced enzymatically. Supportive care or exchange transfusion is required.'
      });
    } else {
      methyleneBlueEffective = true;
      leukomethyleneBlueGenerated = true;
      // Normal reduction rate: 1-2 mg/kg drops MetHb by ~15-25% per hour
      const doseFactor = Math.min(2.0, params.methyleneBlueDoseMgKg) / 1.5;
      reductionRatePerHour = 22 * doseFactor;
      antidoteSummary = `Methylene blue active: converted to leukomethylene blue via NADPH-MetHb reductase, reducing ferric Fe3+ back to functional ferrous Fe2+ at ~${reductionRatePerHour.toFixed(0)}%/h.`;
    }

    if (params.concurrentSsriUse) {
      serotoninSyndromeRisk = true;
      alerts.push({
        level: 'WARNING',
        message: 'SEROTONIN SYNDROME HAZARD: Methylene Blue is a Potent MAO-A Inhibitor',
        rationale:
          'Methylene blue exhibits potent, reversible monoamine oxidase A inhibition. Co-administration with SSRIs, SNRIs, or TCAs can precipitate life-threatening Serotonin Syndrome (hyperthermia, clonus, autonomic instability).'
      });
    }
  }

  // Ascorbic Acid Kinetics (Vitamin C) - Non-enzymatic alternative for G6PD deficiency
  if (params.ascorbicAcidDoseGrams > 0 && !params.exchangeTransfusionCompleted) {
    // Ascorbic acid directly reduces Fe3+ without needing NADPH, but at a much slower rate (~2-4% per hour)
    const vitCReduction = Math.min(10, params.ascorbicAcidDoseGrams) * 0.4;
    reductionRatePerHour += vitCReduction;
    if (!methyleneBlueEffective) {
      antidoteSummary = `Ascorbic acid non-enzymatic reduction active (~${reductionRatePerHour.toFixed(1)}%/h). Indicated when methylene blue is contraindicated (G6PD deficiency), though significantly slower.`;
    }
  }

  // Calculate current MetHb after treatment and time elapsed
  let currentMetHb = params.baselineMetHbPct;
  if (params.exchangeTransfusionCompleted) {
    currentMetHb = 2.0; // Cleared down to physiological donor baseline
    antidoteSummary = 'RBC Exchange Transfusion Completed: Mechanical replacement of oxidatively damaged RBCs with normal donor erythrocytes.';
    alerts.push({
      level: 'SUCCESS',
      message: 'RBC Exchange Transfusion Successful: Functional Hemoglobin Restored',
      rationale: 'Complete clearance of MetHb and toxic metabolites with immediate normalization of oxygen carrying capacity.'
    });
  } else if (reductionRatePerHour > 0 && timeHours > 0) {
    const totalReduced = reductionRatePerHour * timeHours;
    currentMetHb = Math.max(1.5, params.baselineMetHbPct - totalReduced);
  }

  // Rebound phenomenon in Dapsone
  const reboundMethemoglobinRisk = params.etiology === 'DAPSONE' && !params.exchangeTransfusionCompleted;
  if (reboundMethemoglobinRisk && timeHours > 4) {
    // Dapsone has long enterohepatic recirculation and hydroxylamine metabolites cause secondary surge
    currentMetHb = Math.min(65, currentMetHb + 8);
    alerts.push({
      level: 'WARNING',
      message: 'REBOUND METHEMOGLOBINEMIA RISK: Dapsone Enterohepatic Recirculation',
      rationale:
        'Dapsone and its toxic metabolite (dapsone hydroxylamine) undergo extensive enterohepatic recirculation, frequently precipitating secondary MetHb surges 12-24 hours later. Consider multidose activated charcoal (MDAC) and repeated methylene blue.'
    });
  }

  currentMetHb = Math.round(currentMetHb * 10) / 10;
  const currentSulfHb = params.sulfhemoglobinPresent ? params.sulfHbPct : 0;

  // 2. Functional Hemoglobin & Left-Shifted Oxygen Affinity (P50)
  // Ferric heme cannot bind oxygen and causes allosteric tight binding in remaining ferrous subunits (left shift, low P50)
  const leftShiftP50 = Math.max(12, Math.round((26.8 - (currentMetHb / 100) * 16) * 10) / 10);
  const effectiveOxyHbPct = Math.max(0, Math.round((100 - currentMetHb - currentSulfHb) * 10) / 10);

  // Total Arterial Oxygen Content (CaO2 in mL O2 / dL blood)
  // CaO2 = (1.34 * Hb * [effectiveOxyHbPct / 100]) + (0.0031 * PaO2)
  let effectiveHb = params.hemoglobinGPerDl;
  if (g6pdHemolysisCrisis) {
    effectiveHb = Math.max(6.0, params.hemoglobinGPerDl - 3.5); // Acute drop from hemolysis
  }
  let totalOxygenContentCaO2 =
    1.34 * effectiveHb * (effectiveOxyHbPct / 100) + 0.0031 * params.paO2MmHg;
  if (params.hyperbaricOxygenApplied) {
    // HBOT at 3.0 ATA increases dissolved plasma O2 to ~6.0 mL/dL, bypassing hemoglobin!
    totalOxygenContentCaO2 += 4.5;
  }
  totalOxygenContentCaO2 = Math.round(totalOxygenContentCaO2 * 10) / 10;

  // 3. Co-Oximetry vs Standard 2-Wavelength Pulse Oximeter Saturation Gap
  // True arterial saturation of functional hemoglobin (Co-Oximetry SaO2)
  const coOximetrySaO2 = Math.min(100, Math.round((effectiveOxyHbPct / (effectiveOxyHbPct + 5)) * 100));
  const measuredPulseSpO2 = calculateTwoWavelengthSpO2(currentMetHb, currentSulfHb, 99);
  const saturationGap = Math.round((measuredPulseSpO2 - coOximetrySaO2) * 10) / 10;

  // Pulse Oximetry Saturation Gap Alert
  if (currentMetHb >= 15 && Math.abs(saturationGap) >= 5) {
    alerts.push({
      level: 'CRITICAL',
      message: `DIAGNOSTIC SATURATION GAP: Pulse SpO2 (${measuredPulseSpO2}%) vs Co-Oximetry SaO2 (${coOximetrySaO2}%)`,
      rationale:
        'Standard two-wavelength pulse oximeters falsely calibrate MetHb as 85% due to 1:1 absorbance at 660 nm and 940 nm. Multi-wavelength co-oximetry is mandatory to detect true methemoglobin fraction and actual oxygen saturation.'
    });
  }

  // Refractory to 100% Oxygen alert
  if (params.fiO2 >= 0.95 && measuredPulseSpO2 <= 88 && currentMetHb >= 20) {
    alerts.push({
      level: 'WARNING',
      message: 'REFRACTORY CYANOSIS: SpO2 ~85% Unresponsive to 100% Supplemental FiO2',
      rationale:
        'Cyanosis and low pulse oximetry readings that fail to improve with 100% supplemental oxygen strongly point to dyshemoglobinemia (Methemoglobinemia or Sulfhemoglobinemia) rather than cardiopulmonary shunt.'
    });
  }

  // 4. Blood Visual Appearance
  let bloodVisualAppearance: MethemoglobinSimulationOutput['bloodVisualAppearance'] = 'NORMAL_BRIGHT_RED';
  if (currentSulfHb >= 5) {
    bloodVisualAppearance = 'SLATE_BLACK';
  } else if (currentMetHb >= 20) {
    bloodVisualAppearance = 'CHOCOLATE_BROWN';
  } else if (currentMetHb >= 10) {
    bloodVisualAppearance = 'DARK_VENOUS';
  }

  // 5. Clinical Severity Classification
  let clinicalSeverity: MethemoglobinSimulationOutput['clinicalSeverity'] = 'NORMAL';
  if (currentMetHb >= 70 || totalOxygenContentCaO2 < 6.0) {
    clinicalSeverity = 'LETHAL_COMA';
  } else if (currentMetHb >= 50 || totalOxygenContentCaO2 < 9.0) {
    clinicalSeverity = 'SEVERE_ACIDOSIS';
  } else if (currentMetHb >= 30) {
    clinicalSeverity = 'MODERATE_HYPOXIA';
  } else if (currentMetHb >= 10) {
    clinicalSeverity = 'MILD_CYANOSIS';
  }

  // 6. Exchange Transfusion Indication
  const exchangeTransfusionIndicated =
    !params.exchangeTransfusionCompleted &&
    (currentMetHb >= 50 ||
      (currentMetHb >= 30 && (params.g6pdDeficient || g6pdHemolysisCrisis)) ||
      currentSulfHb >= 10);

  if (exchangeTransfusionIndicated) {
    alerts.push({
      level: 'CRITICAL',
      message: 'EMERGENCY RBC EXCHANGE TRANSFUSION INDICATED',
      rationale:
        'Patient has severe life-threatening dyshemoglobinemia (MetHb >= 50% or MetHb in G6PD deficiency / SulfHb >= 10%) with critical reduction in oxygen delivery refractory or contraindicated to pharmacologic reduction.'
    });
  }

  return {
    currentMetHbPct: currentMetHb,
    currentSulfHbPct: currentSulfHb,
    effectiveOxyHbPct,
    measuredPulseSpO2,
    coOximetrySaO2,
    saturationGap,
    bloodVisualAppearance,
    clinicalSeverity,
    leftShiftP50MmHg: leftShiftP50,
    totalOxygenContentCaO2,
    antidoteEfficacy: {
      methyleneBlueEffective,
      leukomethyleneBlueGenerated,
      reductionRatePerHour: Math.round(reductionRatePerHour * 10) / 10,
      summary: antidoteSummary
    },
    g6pdHemolysisCrisis,
    serotoninSyndromeRisk,
    reboundMethemoglobinRisk,
    exchangeTransfusionIndicated,
    clinicalAlerts: alerts
  };
}
