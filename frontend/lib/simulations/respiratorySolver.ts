import { MillimetersMercury, LitersPerMinute, asMmHg, asLitersPerMinute } from './types';

export interface RespiratoryInputParams {
  fractionInspiredO2: number; // FiO2 (0.21 - 1.0)
  barometricPressure: MillimetersMercury; // Pb (typically 760 mmHg at sea level)
  arterialPCO2: MillimetersMercury; // PaCO2 (typically 40 mmHg)
  respiratoryQuotient: number; // R (typically 0.8)
  tidalVolumeMl: number; // Vt (typically 500 mL)
  respiratoryRate: number; // breaths per minute (typically 12)
  deadSpaceFraction: number; // Vd/Vt (typically 0.3)
}

export interface RespiratoryResults {
  alveolarPO2: MillimetersMercury; // PAO2 (mmHg)
  minuteVentilation: LitersPerMinute; // Ve (L/min)
  alveolarVentilation: LitersPerMinute; // Va (L/min)
  arterialPO2Estimated: MillimetersMercury; // Estimated PaO2 with normal A-a gradient
  aAGradient: MillimetersMercury; // A-a gradient (mmHg)
}

/**
 * Solves the Alveolar Gas Equation:
 * PAO_2 = (P_b - P_H2O) * FiO_2 - (PaCO_2 / R)
 * where P_H2O = 47 mmHg at 37 C body temperature.
 */
export function solveAlveolarGasEquation(params: RespiratoryInputParams): RespiratoryResults {
  const waterVaporPressure = 47.0; // mmHg
  const inspiredPO2 = (params.barometricPressure - waterVaporPressure) * params.fractionInspiredO2;
  const pAO2 = inspiredPO2 - params.arterialPCO2 / Math.max(0.1, params.respiratoryQuotient);

  // Ventilation calculations
  const minuteVentilation = (params.tidalVolumeMl * params.respiratoryRate) / 1000.0;
  const alveolarVentilation = (params.tidalVolumeMl * (1.0 - params.deadSpaceFraction) * params.respiratoryRate) / 1000.0;

  // Normal A-a gradient estimation (age/4 + 4 approx 10 mmHg in young healthy adult)
  const aAGradient = 10.0;
  const paO2Estimated = Math.max(20.0, pAO2 - aAGradient);

  return {
    alveolarPO2: asMmHg(Math.round(pAO2 * 10) / 10),
    minuteVentilation: asLitersPerMinute(Math.round(minuteVentilation * 10) / 10),
    alveolarVentilation: asLitersPerMinute(Math.round(alveolarVentilation * 10) / 10),
    arterialPO2Estimated: asMmHg(Math.round(paO2Estimated * 10) / 10),
    aAGradient: asMmHg(aAGradient),
  };
}
