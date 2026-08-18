import {
  MillimetersMercury,
  MillilitersPerMinute,
  Percent,
  asMmHg,
  asMillilitersPerMinute,
  asPercent,
} from './types';

export interface StarlingPressures {
  pGlomerularCapillary: MillimetersMercury; // P_gc: Glomerular Capillary Hydrostatic Pressure (mmHg, typ. 45 - 65)
  pBowmansSpace: MillimetersMercury;        // P_bs: Bowman's Space Hydrostatic Pressure (mmHg, typ. 10 - 20)
  piGlomerularCapillary: MillimetersMercury;// pi_gc: Glomerular Capillary Oncotic Pressure (mmHg, typ. 25 - 35)
  piBowmansSpace?: MillimetersMercury;      // pi_bs: Bowman's Space Oncotic Pressure (mmHg, typ. 0 in healthy urine)
  kf?: number;                              // Ultrafiltration coefficient Kf (mL/min/mmHg, typ. 12.5)
}

export interface RenalFiltrationInput extends Partial<StarlingPressures> {
  // Arteriolar / Hemodynamic parameters (optional overrides or computed from microcirculation)
  afferentRadius?: number;                  // Afferent arteriole radius (μm, typ. 5 - 20, baseline 10.0)
  efferentRadius?: number;                  // Efferent arteriole radius (μm, typ. 5 - 20, baseline 10.0)
  afferentResistance?: number;              // Afferent Arteriolar Resistance (Ra)
  efferentResistance?: number;              // Efferent Arteriolar Resistance (Re)
  meanArterialPressure?: MillimetersMercury;// Systemic BP / MAP (mmHg, typ. 50 - 200, baseline 100)
  hematocrit?: number;                      // Systemic Hematocrit (typ. 0.45)
  enableAutoregulation?: boolean;           // Whether myogenic feedback adjusts afferent resistance
}

export interface RenalFiltrationResults {
  netFiltrationPressure: MillimetersMercury; // NFP = (P_gc - P_bs) - (pi_gc - pi_bs) (mmHg)
  gfr: MillilitersPerMinute;                 // GFR = Kf * NFP (mL/min)
  pGlomerularCapillary: MillimetersMercury;  // P_gc
  pBowmansSpace: MillimetersMercury;         // P_bs
  piGlomerularCapillary: MillimetersMercury; // pi_gc
  piBowmansSpace: MillimetersMercury;        // pi_bs
  renalBloodFlow: MillilitersPerMinute;      // RBF (mL/min, typ. 1200)
  renalPlasmaFlow: MillilitersPerMinute;     // RPF = RBF * (1 - Hct) (mL/min, typ. 660)
  filtrationFraction: Percent;               // FF = (GFR / RPF) * 100% (typ. 20%)
  ultrafiltrationCoefficient: number;        // Kf (mL/min/mmHg)
}

export interface RenalClearanceInput {
  urineConcentration: number;   // U_x (concentration in urine, e.g. mg/dL, mmol/L)
  urineFlowRate: number;        // V (urine flow rate in mL/min, typ. 1.0 mL/min)
  plasmaConcentration: number;  // P_x (concentration in plasma, e.g. mg/dL, mmol/L)
  substanceName?: string;       // e.g. "Inulin", "Creatinine", "PAH", "Urea", "Sodium"
  gfrReference?: number;        // Reference GFR for tubular handling comparison (mL/min)
}

export interface RenalClearanceResults {
  clearance: MillilitersPerMinute; // C_x = (U_x * V) / P_x (mL/min)
  excretionRate: number;           // Excretion Rate = U_x * V
  filteredLoad?: number;           // Filtered Load = P_x * GFR
  fractionalExcretion?: Percent;   // FE_x = (Clearance / GFR) * 100%
  tubularHandlingDescription: string;
}

export interface FeNaInput {
  urineSodium: number;     // U_Na (mEq/L or mmol/L)
  plasmaSodium: number;    // P_Na (mEq/L or mmol/L)
  urineCreatinine: number; // U_Cr (mg/dL or μmol/L)
  plasmaCreatinine: number;// P_Cr (mg/dL or μmol/L)
}

export interface FeNaResults {
  feNa: Percent; // Fractional Excretion of Sodium (%)
  etiology: 'prerenal' | 'intrinsic' | 'intermediate_or_postrenal';
  clinicalCategory: string;
  interpretation: string;
}

/**
 * Solves Glomerular Ultrafiltration Mechanics:
 * Net Filtration Pressure (NFP) = (P_gc - P_bs) - (pi_gc - pi_bs)
 * Glomerular Filtration Rate (GFR) = Kf * NFP
 *
 * Integrates arteriolar resistance dynamics, myogenic autoregulation, and renal plasma flow.
 */
export function solveRenalFiltration(input: RenalFiltrationInput = {}): RenalFiltrationResults {
  const kf = input.kf !== undefined ? Math.max(0, input.kf) : 12.5; // mL/min/mmHg
  const hct = input.hematocrit !== undefined ? Math.max(0.1, Math.min(0.8, input.hematocrit)) : 0.45;
  const pVenous = 5.0; // mmHg renal venous pressure
  const bp = input.meanArterialPressure !== undefined ? Math.max(20, input.meanArterialPressure) : 100.0;

  // 1. Calculate arteriolar resistances if radii or direct resistances are given
  let rAff: number;
  let rEff: number;

  if (input.afferentResistance !== undefined) {
    rAff = Math.max(0.01, input.afferentResistance);
  } else {
    const radAff = input.afferentRadius !== undefined ? Math.max(1.0, input.afferentRadius) : 10.0;
    // Calibrated baseline: at radius 10um, Ra = 0.70
    const rAffBase = 7000.0 / Math.pow(radAff, 4);

    // Myogenic Autoregulation: constricts afferent arteriole when BP is elevated (80-180 mmHg)
    let autoregFactor = 1.0;
    if (input.enableAutoregulation !== false) {
      if (bp >= 90 && bp <= 180) {
        autoregFactor = 1.0 + 1.2 * ((bp - 100.0) / 100.0);
      } else if (bp < 90) {
        autoregFactor = 1.0 + 1.2 * ((90.0 - 100.0) / 100.0);
      } else if (bp > 180) {
        autoregFactor = 1.0 + 1.2 * ((180.0 - 100.0) / 100.0);
      }
    }
    rAff = rAffBase * autoregFactor;
  }

  if (input.efferentResistance !== undefined) {
    rEff = Math.max(0.01, input.efferentResistance);
  } else {
    const radEff = input.efferentRadius !== undefined ? Math.max(1.0, input.efferentRadius) : 10.0;
    // Calibrated baseline: at radius 10um, Re = 0.98
    rEff = 9800.0 / Math.pow(radEff, 4);
  }

  const rTotal = rAff + rEff + 0.01;

  // Renal Blood Flow (RBF ~ 1200 mL/min at baseline)
  const computedRbf = Math.max(0, ((bp - pVenous) / rTotal) * 21.3);
  const computedRpf = computedRbf * (1.0 - hct);

  // Hydrostatic & Oncotic Pressures
  let pGlomerularCapillary: number;
  if (input.pGlomerularCapillary !== undefined) {
    pGlomerularCapillary = Math.max(0, input.pGlomerularCapillary);
  } else {
    pGlomerularCapillary = pVenous + (bp - pVenous) * ((rEff + 0.01) / rTotal);
  }

  const pBowmansSpace = input.pBowmansSpace !== undefined ? Math.max(0, input.pBowmansSpace) : 18.0;

  let piGlomerularCapillary: number;
  if (input.piGlomerularCapillary !== undefined) {
    piGlomerularCapillary = Math.max(0, input.piGlomerularCapillary);
  } else {
    // Colloid osmotic pressure increases slightly with filtration hemoconcentration
    const basePiG = 32.0;
    piGlomerularCapillary = basePiG + Math.max(0, (pGlomerularCapillary - 60.0) * 0.1);
  }


  const piBowmansSpace = input.piBowmansSpace !== undefined ? Math.max(0, input.piBowmansSpace) : 0.0;

  // Net Filtration Pressure (NFP) = (P_gc - P_bs) - (pi_gc - pi_bs)
  const hydrostaticDelta = pGlomerularCapillary - pBowmansSpace;
  const oncoticDelta = piGlomerularCapillary - piBowmansSpace;
  const rawNfp = hydrostaticDelta - oncoticDelta;
  const nfp = Math.max(0, rawNfp);

  // Glomerular Filtration Rate (GFR) = Kf * NFP
  const gfr = nfp * kf;

  // Filtration Fraction (FF) = (GFR / RPF) * 100%
  const ff = computedRpf > 0 ? (gfr / computedRpf) * 100.0 : 0;

  return {
    netFiltrationPressure: asMmHg(Math.round(nfp * 10) / 10),
    gfr: asMillilitersPerMinute(Math.round(gfr * 10) / 10),
    pGlomerularCapillary: asMmHg(Math.round(pGlomerularCapillary * 10) / 10),
    pBowmansSpace: asMmHg(Math.round(pBowmansSpace * 10) / 10),
    piGlomerularCapillary: asMmHg(Math.round(piGlomerularCapillary * 10) / 10),
    piBowmansSpace: asMmHg(Math.round(piBowmansSpace * 10) / 10),
    renalBloodFlow: asMillilitersPerMinute(Math.round(computedRbf)),
    renalPlasmaFlow: asMillilitersPerMinute(Math.round(computedRpf)),
    filtrationFraction: asPercent(Math.round(ff * 10) / 10),
    ultrafiltrationCoefficient: kf,
  };
}

/**
 * Calculates Renal Clearance for any substance:
 * Clearance (C_x) = (U_x * V) / P_x
 *
 * Special Physiological Cases:
 * - Inulin: Clearance == GFR (freely filtered, neither reabsorbed nor secreted)
 * - Creatinine: Clearance ~ GFR (freely filtered, slight tubular secretion ~10-20%)
 * - PAH: Clearance ~ RPF (freely filtered and actively secreted)
 */
export function solveRenalClearance(input: RenalClearanceInput): RenalClearanceResults {
  const epsilon = 1e-9;
  const pConc = Math.max(epsilon, input.plasmaConcentration);
  const uConc = Math.max(0, input.urineConcentration);
  const flow = Math.max(0, input.urineFlowRate);

  const clearance = (uConc * flow) / pConc;
  const excretionRate = uConc * flow;

  let filteredLoad: number | undefined;
  let fractionalExcretion: Percent | undefined;
  let tubularHandlingDescription = 'Substance clearance evaluated.';

  if (input.gfrReference !== undefined && input.gfrReference > 0) {
    filteredLoad = pConc * input.gfrReference;
    const fe = (clearance / input.gfrReference) * 100.0;
    fractionalExcretion = asPercent(Math.round(fe * 10) / 10);

    const substance = input.substanceName || 'Substance';
    if (Math.abs(clearance - input.gfrReference) < 2.0) {
      tubularHandlingDescription = `${substance} clearance equals GFR (${clearance.toFixed(1)} mL/min). Freely filtered with no net tubular reabsorption or secretion (ideal GFR marker like Inulin).`;
    } else if (clearance < input.gfrReference) {
      tubularHandlingDescription = `${substance} clearance (${clearance.toFixed(1)} mL/min) is lower than GFR (${input.gfrReference.toFixed(1)} mL/min), indicating net tubular reabsorption (FE = ${fe.toFixed(1)}%).`;
    } else {
      tubularHandlingDescription = `${substance} clearance (${clearance.toFixed(1)} mL/min) exceeds GFR (${input.gfrReference.toFixed(1)} mL/min), indicating net tubular secretion (FE = ${fe.toFixed(1)}%).`;
    }
  }

  return {
    clearance: asMillilitersPerMinute(Math.round(clearance * 10) / 10),
    excretionRate: Math.round(excretionRate * 100) / 100,
    filteredLoad: filteredLoad !== undefined ? Math.round(filteredLoad * 100) / 100 : undefined,
    fractionalExcretion,
    tubularHandlingDescription,
  };
}

/**
 * Solves Fractional Excretion of Sodium (FeNa):
 * FeNa = (U_Na * P_Cr) / (P_Na * U_Cr) * 100%
 *
 * Standard Clinical Thresholds:
 * - FeNa < 1%: Prerenal Azotemia (renal hypoperfusion; intact tubules actively retain Na+ and H2O)
 * - FeNa > 2%: Intrinsic Acute Renal Failure / Acute Tubular Necrosis (ATN; tubular epithelial damage prevents Na+ retention)
 * - FeNa 1% - 2%: Intermediate / Indeterminate (early injury, contrast nephropathy, acute glomerulonephritis, or postrenal)
 */
export function solveFractionalSodiumExcretion(input: FeNaInput): FeNaResults {
  const epsilon = 1e-9;
  const pNa = Math.max(epsilon, input.plasmaSodium);
  const uCr = Math.max(epsilon, input.urineCreatinine);
  const uNa = Math.max(0, input.urineSodium);
  const pCr = Math.max(0, input.plasmaCreatinine);

  const rawFeNa = (uNa * pCr) / (pNa * uCr) * 100.0;
  const feNa = asPercent(Math.round(rawFeNa * 100) / 100);

  if (rawFeNa < 1.0) {
    return {
      feNa,
      etiology: 'prerenal',
      clinicalCategory: 'Prerenal Azotemia (< 1.0%)',
      interpretation: 'Low fractional excretion of sodium indicates intact tubular function and avid sodium/water reabsorption in response to renal hypoperfusion (e.g. hypovolemia, cardiogenic shock, renal artery stenosis).',
    };
  } else if (rawFeNa > 2.0) {
    return {
      feNa,
      etiology: 'intrinsic',
      clinicalCategory: 'Intrinsic Renal Failure / ATN (> 2.0%)',
      interpretation: 'High fractional excretion of sodium indicates damaged tubular epithelial cells (Acute Tubular Necrosis / intrinsic AKI) unable to reabsorb filtered sodium, leading to sodium wasting in urine.',
    };
  } else {
    return {
      feNa,
      etiology: 'intermediate_or_postrenal',
      clinicalCategory: 'Indeterminate / Intermediate (1.0% - 2.0%)',
      interpretation: 'Intermediate FeNa range. Can be observed in early acute tubular injury, acute glomerulonephritis, non-oliguric ATN, diuretic use, or acute postrenal urinary tract obstruction.',
    };
  }
}

// Alias for convenience
export const solveFeNa = solveFractionalSodiumExcretion;
