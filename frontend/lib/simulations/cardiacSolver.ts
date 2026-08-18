import {
  MillimetersMercury,
  Milliliters,
  LitersPerMinute,
  BeatsPerMinute,
  Percent,
  asMmHg,
  asMilliliters,
  asLitersPerMinute,
  asPercent,
} from './types';

export interface CardiacInputParameters {
  preloadEDV: Milliliters; // End-Diastolic Volume (mL), typically 80 - 200 mL
  afterloadSVR: MillimetersMercury; // Systemic Vascular Resistance (approx diastolic pressure), typically 60 - 140 mmHg
  inotropyEes: number; // End-Systolic Elastance slope (mmHg/mL), typically 1.5 - 4.5
  heartRate: BeatsPerMinute; // typically 40 - 180 bpm
}

export interface PVPoint {
  volume: number; // mL
  pressure: number; // mmHg
}

export interface CardiacCycleResults {
  endDiastolicVolume: Milliliters;
  endSystolicVolume: Milliliters;
  strokeVolume: Milliliters;
  ejectionFraction: Percent;
  cardiacOutput: LitersPerMinute;
  systolicPressure: MillimetersMercury;
  diastolicPressure: MillimetersMercury;
  meanArterialPressure: MillimetersMercury;
  pvLoopPoints: PVPoint[];
}

/**
 * Pure functional numerical solver for Left Ventricular Pressure-Volume Loop
 * based on the Suga-Sagawa Time-Varying Elastance and Frank-Starling mechanics.
 */
export function solveCardiacCycle(params: CardiacInputParameters): CardiacCycleResults {
  const v0 = 10.0; // Volume intercept (mL)
  const edv = Math.max(40.0, params.preloadEDV);
  const svr = Math.max(40.0, params.afterloadSVR);
  const ees = Math.max(0.5, params.inotropyEes);
  const hr = Math.max(30, params.heartRate);

  // Peak systolic pressure estimation: P_es = SVR + pulse amplification
  const pSystolic = svr + 35.0 * (ees / 2.5);

  // End-Systolic Volume (ESV) from End-Systolic Pressure-Volume Relationship (ESPVR)
  // P_es = E_es * (ESV - V_0) => ESV = (P_es / E_es) + V_0
  const esvCalculated = pSystolic / ees + v0;
  const esv = Math.min(edv - 10.0, Math.max(15.0, esvCalculated));

  // Stroke Volume & Ejection Fraction
  const strokeVolume = Math.max(5.0, edv - esv);
  const ejectionFraction = (strokeVolume / edv) * 100.0;
  const cardiacOutput = (strokeVolume * hr) / 1000.0; // L/min

  const diastolicPressure = svr * 0.85;
  const map = diastolicPressure + (pSystolic - diastolicPressure) / 3.0;

  // Generate continuous PV-loop polygon (200 sample points)
  const points: PVPoint[] = [];

  // 1. Isovolumetric Contraction (ESV -> EDV at bottom to top)
  // Moving up from diastolic filling pressure (approx 8 mmHg) to Aortic Valve Opening (diastolicPressure)
  const pFill = 8.0 + (edv - 80.0) * 0.05;
  const nSteps = 50;

  // Phase A: Isovolumetric Contraction (Volume = EDV, Pressure: pFill -> diastolicPressure)
  for (let i = 0; i <= nSteps; i++) {
    const t = i / nSteps;
    points.push({
      volume: edv,
      pressure: pFill + t * (diastolicPressure - pFill),
    });
  }

  // Phase B: Ventricular Ejection (Volume: EDV -> ESV, Pressure reaches peak systolic then drops to pSystolic)
  for (let i = 0; i <= nSteps; i++) {
    const t = i / nSteps;
    const vol = edv - t * (edv - esv);
    // Parabolic pressure arc during ejection
    const arc = Math.sin(t * Math.PI);
    const press = diastolicPressure + t * (pSystolic - diastolicPressure) + arc * 15.0;
    points.push({ volume: vol, pressure: press });
  }

  // Phase C: Isovolumetric Relaxation (Volume = ESV, Pressure: pSystolic -> pRelaxEnd)
  const pRelaxEnd = 4.0;
  for (let i = 0; i <= nSteps; i++) {
    const t = i / nSteps;
    points.push({
      volume: esv,
      pressure: pSystolic - t * (pSystolic - pRelaxEnd),
    });
  }

  // Phase D: Diastolic Filling (Volume: ESV -> EDV, Non-linear EDPVR curve)
  for (let i = 0; i <= nSteps; i++) {
    const t = i / nSteps;
    const vol = esv + t * (edv - esv);
    const press = pRelaxEnd + Math.pow(t, 1.8) * (pFill - pRelaxEnd);
    points.push({ volume: vol, pressure: press });
  }

  return {
    endDiastolicVolume: asMilliliters(Math.round(edv)),
    endSystolicVolume: asMilliliters(Math.round(esv)),
    strokeVolume: asMilliliters(Math.round(strokeVolume)),
    ejectionFraction: asPercent(Math.round(ejectionFraction * 10) / 10),
    cardiacOutput: asLitersPerMinute(Math.round(cardiacOutput * 100) / 100),
    systolicPressure: asMmHg(Math.round(pSystolic)),
    diastolicPressure: asMmHg(Math.round(diastolicPressure)),
    meanArterialPressure: asMmHg(Math.round(map)),
    pvLoopPoints: points,
  };
}
