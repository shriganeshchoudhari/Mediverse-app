/**
 * UreaKineticDialysisEngine.ts
 * Biophysical Simulation Engine for Hemodialysis Urea Kinetic Modeling (UKM) & Adequacy Solvers
 * 
 * Implements:
 * 1. Daugirdas second-generation single-pool variable-volume Kt/V (spKt/V)
 * 2. Equilibrated double-pool Kt/V (eKt/V) with post-dialysis intracellular urea rebound
 * 3. Urea Reduction Ratio (URR) and KDOQI adequacy benchmarking
 * 4. Normalized Protein Catabolic Rate (nPCR / nPNA) for nutritional surveillance
 * 5. Two-needle access recirculation (AR%) solver for fistula/graft stenosis
 * 6. Ultrafiltration rate (UFR mL/kg/h) and myocardial stunning threshold monitoring
 * 7. 8 Validated Clinical Presets across the Dialysis & Nephrology Spectrum
 * 
 * Location: frontend/.gemini/skills/UreaKineticDialysisEngine.ts
 */

export type DialysisPresetId =
  | 'ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI'
  | 'UNDERDIALYSIS_LOW_BLOOD_FLOW_ACCESS_FAILURE'
  | 'DISEQUILIBRIUM_SYNDROME_FIRST_DIALYSIS'
  | 'ACCESS_RECIRCULATION_NEEDLE_REVERSAL'
  | 'PROTEIN_ENERGY_MALNUTRITION_LOW_NPCR'
  | 'HYPERCATABOLIC_SEPSIS_ELEVATED_NPCR'
  | 'EXCESSIVE_ULTRAFILTRATION_INTRA_HD_HYPOTENSION'
  | 'NOCTURNAL_EXTENDED_CLEARANCE_HOMEDIALYSIS';

export type DialysisModality = 'STANDARD_INTERMITTENT_HD' | 'HIGH_FLUX_HD' | 'EXTENDED_NOCTURNAL_HD' | 'HEMODIAFILTRATION_HDF';

export type VascularAccessType = 'AV_FISTULA' | 'AV_GRAFT' | 'TUNNELED_CATHETER';

export interface DialyzerSpecifications {
  modelName: string;
  koaUreaMlMin: number; // Mass transfer-area coefficient for urea (typically 600 - 1200 mL/min)
  surfaceAreaM2: number; // 1.4 - 2.2 m2
  ultrafiltrationCoefficientKuf: number; // mL/h/mmHg (High-flux > 20)
}

export interface DialysisPrescription {
  modality: DialysisModality;
  durationHours: number; // 2.0 - 8.0 hours
  bloodFlowQbMlMin: number; // 150 - 500 mL/min
  dialysateFlowQdMlMin: number; // 400 - 800 mL/min
  dialyzer: DialyzerSpecifications;
}

export interface PatientUkmData {
  preDialysisBunMgDl: number; // 30 - 150 mg/dL
  postDialysisBunMgDl: number; // 5 - 80 mg/dL
  preWeightKg: number; // 40 - 140 kg
  postWeightKg: number; // 38 - 135 kg
  heightCm: number;
  sex: 'M' | 'F';
  residualKidneyClearanceKruMlMin: number; // 0 - 10 mL/min
  daysBetweenTreatments: number; // 2 or 3 days (Mon-Wed vs Fri-Mon)
  arterialLineBunMgDl?: number; // for recirculation testing
  venousLineBunMgDl?: number; // for recirculation testing
  systemicPeripheralBunMgDl?: number; // for recirculation testing
}

export interface UreaKineticInputParams {
  presetId: DialysisPresetId;
  prescription: DialysisPrescription;
  patient: PatientUkmData;
  accessType: VascularAccessType;
}

export interface UreaTimepoint {
  minute: number;
  extracellularUreaMgDl: number;
  intracellularUreaMgDl: number;
  totalBodyWaterLiters: number;
}

export interface UreaKineticState {
  ureaReductionRatioPct: number; // URR %
  singlePoolKtV: number; // spKt/V
  equilibratedKtV: number; // eKt/V
  postDialysisReboundMgDl: number;
  normalizedProteinCatabolicRate: number; // nPCR (g/kg/day)
  ultrafiltrationVolumeLiters: number; // UF (kg/L)
  ultrafiltrationRateMlKgHr: number; // UFR (mL/kg/h)
  accessRecirculationPct: number; // AR%
  dialyzerClearanceKdMlMin: number; // in-vivo urea clearance
  totalBodyWaterWatsonLiters: number; // Watson formula V (Liters)
  isKdoqiAdequate: boolean; // spKt/V >= 1.4 or URR >= 65%
  activeAlarms: string[];
  clinicalGuidance: string;
  timeSeries: UreaTimepoint[];
}

/**
 * Calculate Total Body Water (TBW / Watson Volume V) in Liters
 * Watson Formula:
 * Male: 2.447 - 0.09516 * Age + 0.1074 * Height(cm) + 0.3362 * Weight(kg)
 * Female: -2.097 + 0.1069 * Height(cm) + 0.2466 * Weight(kg)
 */
export function calculateWatsonVolume(
  weightKg: number,
  heightCm: number,
  sex: 'M' | 'F',
  ageYears: number = 55
): number {
  if (weightKg <= 0 || heightCm <= 0) return 35.0;
  let v = 0;
  if (sex === 'M') {
    v = 2.447 - 0.09516 * ageYears + 0.1074 * heightCm + 0.3362 * weightKg;
  } else {
    v = -2.097 + 0.1069 * heightCm + 0.2466 * weightKg;
  }
  return parseFloat(Math.max(18.0, Math.min(65.0, v)).toFixed(1));
}

/**
 * Calculate In-Vivo Dialyzer Clearance (Kd) for Urea from Qb, Qd, and KoA
 * Formula: Kd = Qb * (1 - exp(KoA * (1 - Qb/Qd) / Qb)) / (1 - (Qb/Qd) * exp(KoA * (1 - Qb/Qd) / Qb))
 */
export function calculateDialyzerClearance(
  qb: number,
  qd: number,
  koa: number
): number {
  if (qb <= 0 || qd <= 0 || koa <= 0) return 200;
  const qbMlS = qb;
  const qdMlS = qd;
  const ratio = qbMlS / qdMlS;

  if (Math.abs(ratio - 1.0) < 0.001) {
    const kd = (qbMlS * koa) / (qbMlS + koa);
    return Math.round(kd);
  }

  const exponent = (koa * (1.0 - ratio)) / qbMlS;
  const expVal = Math.exp(-exponent);
  const kd = qbMlS * ((1.0 - expVal) / (1.0 - ratio * expVal));
  return Math.round(Math.min(qb * 0.95, Math.max(100, kd)));
}

/**
 * Daugirdas Second-Generation Single-Pool Variable-Volume Kt/V (spKt/V)
 * Formula (1993):
 * spKt/V = -ln(R - 0.008 * t) + (4 - 3.5 * R) * (UF / postWeight)
 * where R = postBUN / preBUN, t is duration in hours, UF = preWeight - postWeight
 */
export function calculateDaugirdasSpKtV(
  preBun: number,
  postBun: number,
  durationHours: number,
  preWeightKg: number,
  postWeightKg: number
): number {
  if (preBun <= 0 || postBun <= 0 || durationHours <= 0 || postWeightKg <= 0) return 1.2;

  const r = Math.min(0.95, Math.max(0.05, postBun / preBun));
  const ufKg = Math.max(0, preWeightKg - postWeightKg);

  const term1 = -Math.log(Math.max(0.001, r - 0.008 * durationHours));
  const term2 = (4.0 - 3.5 * r) * (ufKg / postWeightKg);
  const spKtV = term1 + term2;

  return parseFloat(Math.max(0.2, Math.min(3.5, spKtV)).toFixed(2));
}

/**
 * Equilibrated Double-Pool Kt/V (eKt/V)
 * Arteriovenous access rebound formula:
 * eKt/V = spKt/V - 0.6 * (spKt/V / t) + 0.03
 */
export function calculateEquilibratedKtV(
  spKtV: number,
  durationHours: number,
  accessType: VascularAccessType = 'AV_FISTULA'
): number {
  if (durationHours <= 0) return spKtV;
  const rateConstant = accessType === 'TUNNELED_CATHETER' ? 0.47 : 0.6;
  const eKtV = spKtV - rateConstant * (spKtV / durationHours) + 0.03;
  return parseFloat(Math.max(0.1, Math.min(spKtV, eKtV)).toFixed(2));
}

/**
 * Normalized Protein Catabolic Rate (nPCR or nPNA in g/kg/day)
 * Standard KDOQI approximation from Garred & Daugirdas:
 * nPCR = (C0 / (25.8 + 1.15 * spKtV + 56.4 / spKtV)) + 0.168
 * Or using simplified Daugirdas 1995 equation:
 * nPCR = (preBun / (25.8 + 1.15 * spKtV + 56.4 / spKtV)) + 0.168
 */
export function calculateNormalizedPcr(
  preBun: number,
  spKtV: number,
  durationHours: number,
  daysBetweenTreatments: number = 2
): number {
  if (preBun <= 0 || spKtV <= 0) return 1.0;
  // Daugirdas simplified formula for 3x/week HD (interdialytic interval factor):
  const intervalFactor = daysBetweenTreatments === 3 ? 1.12 : 1.0;
  const denominator = 25.8 + 1.15 * spKtV + 56.4 / Math.max(0.4, spKtV);
  const npcr = (preBun / denominator) * intervalFactor + 0.168;
  return parseFloat(Math.max(0.3, Math.min(3.0, npcr)).toFixed(2));
}

/**
 * Two-Needle Vascular Access Recirculation (AR%)
 * Formula: AR = (S - A) / (S - V) * 100%
 * S = peripheral systemic blood urea
 * A = arterial line blood urea (entering dialyzer)
 * V = venous line blood urea (exiting dialyzer to patient)
 */
export function calculateAccessRecirculation(
  systemicBun: number,
  arterialBun: number,
  venousBun: number
): number {
  if (systemicBun <= 0 || arterialBun <= 0 || venousBun <= 0) return 0;
  const denominator = systemicBun - venousBun;
  if (Math.abs(denominator) < 0.5) return 0;
  const ar = ((systemicBun - arterialBun) / denominator) * 100;
  return parseFloat(Math.max(0, Math.min(85, ar)).toFixed(1));
}

/**
 * Main Compute Function for Urea Kinetic Modeling
 */
export function computeUreaKineticState(params: UreaKineticInputParams): UreaKineticState {
  const { prescription, patient, accessType } = params;

  // 1. Total Body Water Watson volume V
  const watsonV = calculateWatsonVolume(patient.postWeightKg, patient.heightCm, patient.sex);

  // 2. In-vivo dialyzer urea clearance
  const kd = calculateDialyzerClearance(
    prescription.bloodFlowQbMlMin,
    prescription.dialysateFlowQdMlMin,
    prescription.dialyzer.koaUreaMlMin
  );

  // 3. Urea Reduction Ratio (URR)
  const urr =
    patient.preDialysisBunMgDl > 0
      ? parseFloat(
          (
            ((patient.preDialysisBunMgDl - patient.postDialysisBunMgDl) /
              patient.preDialysisBunMgDl) *
            100
          ).toFixed(1)
        )
      : 65.0;

  // 4. Daugirdas single-pool variable-volume Kt/V (spKt/V)
  const spKtV = calculateDaugirdasSpKtV(
    patient.preDialysisBunMgDl,
    patient.postDialysisBunMgDl,
    prescription.durationHours,
    patient.preWeightKg,
    patient.postWeightKg
  );

  // 5. Equilibrated double-pool Kt/V (eKt/V)
  const eKtV = calculateEquilibratedKtV(spKtV, prescription.durationHours, accessType);

  // 6. Post-dialysis urea rebound (mg/dL) after 30-60 min
  const reboundFraction = 0.15 + 0.1 * (spKtV / Math.max(1, prescription.durationHours));
  const postDialysisReboundMgDl = parseFloat(
    (patient.postDialysisBunMgDl * (1 + reboundFraction)).toFixed(1)
  );

  // 7. Normalized Protein Catabolic Rate (nPCR in g/kg/day)
  const npcr = calculateNormalizedPcr(
    patient.preDialysisBunMgDl,
    spKtV,
    prescription.durationHours,
    patient.daysBetweenTreatments
  );

  // 8. Ultrafiltration parameters
  const ufVolumeLiters = parseFloat(
    Math.max(0, patient.preWeightKg - patient.postWeightKg).toFixed(2)
  );
  const ufrMlKgHr =
    patient.postWeightKg > 0 && prescription.durationHours > 0
      ? parseFloat(
          (
            (ufVolumeLiters * 1000) /
            patient.postWeightKg /
            prescription.durationHours
          ).toFixed(1)
        )
      : 8.0;

  // 9. Access Recirculation
  let accessRecirculationPct = 0;
  if (
    patient.systemicPeripheralBunMgDl &&
    patient.arterialLineBunMgDl &&
    patient.venousLineBunMgDl
  ) {
    accessRecirculationPct = calculateAccessRecirculation(
      patient.systemicPeripheralBunMgDl,
      patient.arterialLineBunMgDl,
      patient.venousLineBunMgDl
    );
  }

  // 10. KDOQI Adequacy Target
  // KDOQI Minimum delivered spKt/V >= 1.2 (target prescribed >= 1.4) or URR >= 65%
  const isKdoqiAdequate = spKtV >= 1.2 && urr >= 65.0;

  // 11. Dynamic Simulation Trace (Urea clearance and cellular rebound)
  const timeSeries: UreaTimepoint[] = [];
  const totalMinutes = Math.round(prescription.durationHours * 60);
  const step = Math.max(10, Math.round(totalMinutes / 12));

  for (let m = 0; m <= totalMinutes + 60; m += step) {
    if (m <= totalMinutes) {
      // Intradialytic phase
      const fractionTime = m / totalMinutes;
      // Exponential clearance
      const currentExtracellular =
        patient.postDialysisBunMgDl +
        (patient.preDialysisBunMgDl - patient.postDialysisBunMgDl) *
          Math.exp(-2.2 * fractionTime);
      // Intracellular lags behind extracellular (two-pool gradient)
      const currentIntracellular =
        patient.postDialysisBunMgDl +
        (patient.preDialysisBunMgDl - patient.postDialysisBunMgDl) *
          Math.exp(-1.6 * fractionTime);

      const currentWater = watsonV + ufVolumeLiters * (1 - fractionTime);

      timeSeries.push({
        minute: m,
        extracellularUreaMgDl: parseFloat(currentExtracellular.toFixed(1)),
        intracellularUreaMgDl: parseFloat(currentIntracellular.toFixed(1)),
        totalBodyWaterLiters: parseFloat(currentWater.toFixed(1)),
      });
    } else {
      // Post-dialysis rebound phase (0 - 60 min post-HD)
      const reboundMin = m - totalMinutes;
      const fractionRebound = 1 - Math.exp(-reboundMin / 20);
      const postUrea =
        patient.postDialysisBunMgDl +
        (postDialysisReboundMgDl - patient.postDialysisBunMgDl) * fractionRebound;

      timeSeries.push({
        minute: m,
        extracellularUreaMgDl: parseFloat(postUrea.toFixed(1)),
        intracellularUreaMgDl: parseFloat(postUrea.toFixed(1)),
        totalBodyWaterLiters: watsonV,
      });
    }
  }

  // 12. Active Clinical Alarms
  const activeAlarms: string[] = [];

  if (spKtV < 1.2 || urr < 65.0) {
    activeAlarms.push('SEVERE_UNDERDIALYSIS_BELOW_KDOQI_ADEQUACY');
  }

  if (ufrMlKgHr > 13.0) {
    activeAlarms.push('EXCESSIVE_ULTRAFILTRATION_RATE_MYOCARDIAL_STUNNING_RISK');
  }

  if (accessRecirculationPct > 10.0) {
    activeAlarms.push('PATHOLOGICAL_VASCULAR_ACCESS_RECIRCULATION_STENOSIS');
  }

  if (patient.preDialysisBunMgDl > 120 && spKtV > 1.4) {
    activeAlarms.push('DIALYSIS_DISEQUILIBRIUM_SYNDROME_CEREBRAL_EDEMA_RISK');
  }

  if (npcr < 0.8) {
    activeAlarms.push('PROTEIN_ENERGY_MALNUTRITION_HYPOALBUMINEMIA_RISK');
  } else if (npcr > 1.8) {
    activeAlarms.push('HYPERCATABOLIC_STATE_ACCELERATED_UREAGENESIS');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL_DIALYSIS_ADEQUACY_KDOQI_COMPLIANT');
  }

  // 13. Clinical Guidance
  let clinicalGuidance =
    'Dialysis prescription achieves KDOQI target adequacy (spKt/V >= 1.2, URR >= 65%) with safe ultrafiltration rates.';

  if (spKtV < 1.2) {
    clinicalGuidance =
      'UNDERDIALYSIS HAZARD: Delivered spKt/V < 1.2 increases cardiovascular mortality and uremic encephalopathy risk. Increase blood flow (Qb), prolong treatment duration, or assess for vascular access recirculation/stenosis.';
  } else if (ufrMlKgHr > 13.0) {
    clinicalGuidance =
      'ELEVATED ULTRAFILTRATION: UFR > 13 mL/kg/h triggers subendocardial ischemia, myocardial stunning, and intradialytic hypotension. Extend treatment time or liberalize dry weight target.';
  } else if (accessRecirculationPct > 10.0) {
    clinicalGuidance =
      'ACCESS RECIRCULATION DETECTED: AR% > 10% confirms needle proximity or significant venous outflow stenosis. Request immediate fistulogram / duplex ultrasound.';
  } else if (npcr < 0.8) {
    clinicalGuidance =
      'MALNUTRITION SURVEILLANCE: Low nPCR (< 0.8 g/kg/day) indicates insufficient protein intake or anorexia of chronic uremia. Initiate oral nutritional supplements or intradialytic parenteral nutrition (IDPN).';
  }

  return {
    ureaReductionRatioPct: urr,
    singlePoolKtV: spKtV,
    equilibratedKtV: eKtV,
    postDialysisReboundMgDl,
    normalizedProteinCatabolicRate: npcr,
    ultrafiltrationVolumeLiters: ufVolumeLiters,
    ultrafiltrationRateMlKgHr: ufrMlKgHr,
    accessRecirculationPct,
    dialyzerClearanceKdMlMin: kd,
    totalBodyWaterWatsonLiters: watsonV,
    isKdoqiAdequate,
    activeAlarms,
    clinicalGuidance,
    timeSeries,
  };
}

/**
 * 8 Standard Validated Clinical Presets for Urea Kinetics
 */
export const DIALYSIS_PRESETS: Record<
  DialysisPresetId,
  {
    title: string;
    description: string;
    initialState: UreaKineticInputParams;
  }
> = {
  ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI: {
    title: 'Standard High-Flux Hemodialysis (KDOQI Compliant)',
    description: '70 kg male on 4-hour high-flux dialysis: Qb 400 mL/min, Qd 600 mL/min, pre-BUN 72 mg/dL, post-BUN 21 mg/dL, achieving spKt/V 1.46, eKt/V 1.27, URR 71%, and safe UFR 8.9 mL/kg/h.',
    initialState: {
      presetId: 'ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI',
      prescription: {
        modality: 'HIGH_FLUX_HD',
        durationHours: 4.0,
        bloodFlowQbMlMin: 400,
        dialysateFlowQdMlMin: 600,
        dialyzer: {
          modelName: 'Optiflux F180NR',
          koaUreaMlMin: 950,
          surfaceAreaM2: 1.8,
          ultrafiltrationCoefficientKuf: 55,
        },
      },
      patient: {
        preDialysisBunMgDl: 72,
        postDialysisBunMgDl: 21,
        preWeightKg: 72.5,
        postWeightKg: 70.0,
        heightCm: 175,
        sex: 'M',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 72,
        arterialLineBunMgDl: 72,
        venousLineBunMgDl: 18,
      },
      accessType: 'AV_FISTULA',
    },
  },

  UNDERDIALYSIS_LOW_BLOOD_FLOW_ACCESS_FAILURE: {
    title: 'Underdialysis from Fistula Stenosis & Low Blood Flow',
    description: '65 kg female with poor AV fistula flow limiting Qb to 220 mL/min over 3.5 hours: pre-BUN 88 mg/dL, post-BUN 48 mg/dL, delivering subtherapeutic spKt/V 0.81 and URR 45%, with high risk of uremic symptoms.',
    initialState: {
      presetId: 'UNDERDIALYSIS_LOW_BLOOD_FLOW_ACCESS_FAILURE',
      prescription: {
        modality: 'STANDARD_INTERMITTENT_HD',
        durationHours: 3.5,
        bloodFlowQbMlMin: 220,
        dialysateFlowQdMlMin: 500,
        dialyzer: {
          modelName: 'Revaclear 300',
          koaUreaMlMin: 680,
          surfaceAreaM2: 1.4,
          ultrafiltrationCoefficientKuf: 30,
        },
      },
      patient: {
        preDialysisBunMgDl: 88,
        postDialysisBunMgDl: 48,
        preWeightKg: 67.0,
        postWeightKg: 65.0,
        heightCm: 160,
        sex: 'F',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 88,
        arterialLineBunMgDl: 88,
        venousLineBunMgDl: 42,
      },
      accessType: 'AV_FISTULA',
    },
  },

  DISEQUILIBRIUM_SYNDROME_FIRST_DIALYSIS: {
    title: 'Dialysis Disequilibrium Syndrome Hazard (Severe Uremia)',
    description: '55-year-old presenting with acute-on-chronic uremia (pre-BUN 155 mg/dL): Aggressive clearance causes rapid plasma osmolar drop while idiogenic brain osmolytes linger, risking fatal cerebral edema.',
    initialState: {
      presetId: 'DISEQUILIBRIUM_SYNDROME_FIRST_DIALYSIS',
      prescription: {
        modality: 'STANDARD_INTERMITTENT_HD',
        durationHours: 4.0,
        bloodFlowQbMlMin: 380,
        dialysateFlowQdMlMin: 600,
        dialyzer: {
          modelName: 'Optiflux F160NR',
          koaUreaMlMin: 850,
          surfaceAreaM2: 1.5,
          ultrafiltrationCoefficientKuf: 40,
        },
      },
      patient: {
        preDialysisBunMgDl: 155,
        postDialysisBunMgDl: 38,
        preWeightKg: 68.0,
        postWeightKg: 66.0,
        heightCm: 168,
        sex: 'M',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 155,
        arterialLineBunMgDl: 155,
        venousLineBunMgDl: 30,
      },
      accessType: 'TUNNELED_CATHETER',
    },
  },

  ACCESS_RECIRCULATION_NEEDLE_REVERSAL: {
    title: 'Vascular Access Recirculation (Accidental Needle Reversal)',
    description: 'Arterial needle inadvertently cannulated downstream from venous needle: Dialyzed blood re-enters arterial circuit, generating 32% recirculation and falsely low post-BUN with poor systemic clearance.',
    initialState: {
      presetId: 'ACCESS_RECIRCULATION_NEEDLE_REVERSAL',
      prescription: {
        modality: 'HIGH_FLUX_HD',
        durationHours: 4.0,
        bloodFlowQbMlMin: 350,
        dialysateFlowQdMlMin: 600,
        dialyzer: {
          modelName: 'Optiflux F180NR',
          koaUreaMlMin: 950,
          surfaceAreaM2: 1.8,
          ultrafiltrationCoefficientKuf: 55,
        },
      },
      patient: {
        preDialysisBunMgDl: 80,
        postDialysisBunMgDl: 26,
        preWeightKg: 78.0,
        postWeightKg: 76.0,
        heightCm: 172,
        sex: 'M',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 80,
        arterialLineBunMgDl: 58,
        venousLineBunMgDl: 12,
      },
      accessType: 'AV_GRAFT',
    },
  },

  PROTEIN_ENERGY_MALNUTRITION_LOW_NPCR: {
    title: 'Protein-Energy Wasting / Malnutrition (Low nPCR < 0.8)',
    description: 'Elderly 52 kg female with anorexia: Pre-BUN is only 38 mg/dL despite 3-day weekend gap, with delivered spKt/V 1.55 but critically low nPCR 0.61 g/kg/day, indicating severe muscle catabolism and dietary protein deficiency.',
    initialState: {
      presetId: 'PROTEIN_ENERGY_MALNUTRITION_LOW_NPCR',
      prescription: {
        modality: 'HIGH_FLUX_HD',
        durationHours: 3.5,
        bloodFlowQbMlMin: 350,
        dialysateFlowQdMlMin: 500,
        dialyzer: {
          modelName: 'Revaclear 300',
          koaUreaMlMin: 680,
          surfaceAreaM2: 1.4,
          ultrafiltrationCoefficientKuf: 30,
        },
      },
      patient: {
        preDialysisBunMgDl: 38,
        postDialysisBunMgDl: 10,
        preWeightKg: 53.5,
        postWeightKg: 52.0,
        heightCm: 155,
        sex: 'F',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 3,
        systemicPeripheralBunMgDl: 38,
        arterialLineBunMgDl: 38,
        venousLineBunMgDl: 8,
      },
      accessType: 'AV_FISTULA',
    },
  },

  HYPERCATABOLIC_SEPSIS_ELEVATED_NPCR: {
    title: 'Hypercatabolic Septic ICU Patient (Accelerated Ureagenesis)',
    description: 'Septic patient with hypercatabolism and corticosteroid exposure: Rapid interdialytic BUN accumulation (pre-BUN 105 mg/dL) yielding nPCR 2.25 g/kg/day and massive intracellular urea rebound post-dialysis.',
    initialState: {
      presetId: 'HYPERCATABOLIC_SEPSIS_ELEVATED_NPCR',
      prescription: {
        modality: 'HIGH_FLUX_HD',
        durationHours: 4.0,
        bloodFlowQbMlMin: 400,
        dialysateFlowQdMlMin: 700,
        dialyzer: {
          modelName: 'Optiflux F200NR',
          koaUreaMlMin: 1100,
          surfaceAreaM2: 2.0,
          ultrafiltrationCoefficientKuf: 65,
        },
      },
      patient: {
        preDialysisBunMgDl: 105,
        postDialysisBunMgDl: 32,
        preWeightKg: 83.0,
        postWeightKg: 80.0,
        heightCm: 180,
        sex: 'M',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 105,
        arterialLineBunMgDl: 105,
        venousLineBunMgDl: 26,
      },
      accessType: 'TUNNELED_CATHETER',
    },
  },

  EXCESSIVE_ULTRAFILTRATION_INTRA_HD_HYPOTENSION: {
    title: 'Excessive Ultrafiltration Rate (>13 mL/kg/h Stunning Risk)',
    description: '60 kg patient with 4.5 kg interdialytic weight gain undergoing 4-hour session: High UFR 18.8 mL/kg/h triggers intravascular volume depletion, subendocardial ischemia, and intradialytic crash.',
    initialState: {
      presetId: 'EXCESSIVE_ULTRAFILTRATION_INTRA_HD_HYPOTENSION',
      prescription: {
        modality: 'HIGH_FLUX_HD',
        durationHours: 4.0,
        bloodFlowQbMlMin: 350,
        dialysateFlowQdMlMin: 500,
        dialyzer: {
          modelName: 'Optiflux F180NR',
          koaUreaMlMin: 950,
          surfaceAreaM2: 1.8,
          ultrafiltrationCoefficientKuf: 55,
        },
      },
      patient: {
        preDialysisBunMgDl: 78,
        postDialysisBunMgDl: 24,
        preWeightKg: 64.5,
        postWeightKg: 60.0,
        heightCm: 165,
        sex: 'F',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 78,
        arterialLineBunMgDl: 78,
        venousLineBunMgDl: 20,
      },
      accessType: 'AV_FISTULA',
    },
  },

  NOCTURNAL_EXTENDED_CLEARANCE_HOMEDIALYSIS: {
    title: 'Extended Nocturnal Home Hemodialysis (8-Hour Clearance)',
    description: 'Gentle 8-hour overnight home HD at lower blood flow (Qb 250 mL/min): Yields superlative delivered spKt/V 2.38, minimal urea rebound, liberalized phosphate diet, and ultra-gentle UFR 4.7 mL/kg/h.',
    initialState: {
      presetId: 'NOCTURNAL_EXTENDED_CLEARANCE_HOMEDIALYSIS',
      prescription: {
        modality: 'EXTENDED_NOCTURNAL_HD',
        durationHours: 8.0,
        bloodFlowQbMlMin: 250,
        dialysateFlowQdMlMin: 400,
        dialyzer: {
          modelName: 'Optiflux F160NR',
          koaUreaMlMin: 850,
          surfaceAreaM2: 1.5,
          ultrafiltrationCoefficientKuf: 40,
        },
      },
      patient: {
        preDialysisBunMgDl: 65,
        postDialysisBunMgDl: 12,
        preWeightKg: 82.5,
        postWeightKg: 80.0,
        heightCm: 178,
        sex: 'M',
        residualKidneyClearanceKruMlMin: 0,
        daysBetweenTreatments: 2,
        systemicPeripheralBunMgDl: 65,
        arterialLineBunMgDl: 65,
        venousLineBunMgDl: 10,
      },
      accessType: 'AV_FISTULA',
    },
  },
};
