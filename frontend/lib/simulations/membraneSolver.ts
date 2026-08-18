import { Millivolts, asMillivolts } from './types';

export interface GHKIonConcentrations {
  kInside: number; // mM (typically 140)
  kOutside: number; // mM (typically 4.5)
  kPermeability: number; // Relative permeability (typically 1.0)

  naInside: number; // mM (typically 12)
  naOutside: number; // mM (typically 145)
  naPermeability: number; // Relative permeability (typically 0.04)

  clInside: number; // mM (typically 4)
  clOutside: number; // mM (typically 115)
  clPermeability: number; // Relative permeability (typically 0.45)

  temperatureCelsius: number; // typically 37 C
}

export interface GHKResults {
  restingPotential: Millivolts;
  eK: Millivolts; // Nernst equilibrium potential for K+
  eNa: Millivolts; // Nernst equilibrium potential for Na+
  eCl: Millivolts; // Nernst equilibrium potential for Cl-
}

/**
 * Solves the Goldman-Hodgkin-Katz (GHK) voltage equation for membrane resting potential:
 * V_m = (RT / F) * ln( (P_K[K]_o + P_Na[Na]_o + P_Cl[Cl]_i) / (P_K[K]_i + P_Na[Na]_i + P_Cl[Cl]_o) )
 */
export function solveGoldmanHodgkinKatz(params: GHKIonConcentrations): GHKResults {
  const R = 8.314; // Gas constant (J / (mol K))
  const F = 96485.0; // Faraday constant (C / mol)
  const T = params.temperatureCelsius + 273.15; // Kelvin
  const factor = (R * T) / F * 1000.0; // Convert to millivolts (approx 26.7 mV at 37C)

  const epsilon = 1e-7; // Guard against division-by-zero

  // GHK Numerator & Denominator
  const numerator =
    params.kPermeability * Math.max(0.1, params.kOutside) +
    params.naPermeability * Math.max(0.1, params.naOutside) +
    params.clPermeability * Math.max(0.1, params.clInside);

  const denominator =
    params.kPermeability * Math.max(0.1, params.kInside) +
    params.naPermeability * Math.max(0.1, params.naInside) +
    params.clPermeability * Math.max(0.1, params.clOutside) +
    epsilon;

  const vMembrane = factor * Math.log(numerator / denominator);

  // Nernst Equations for Individual Ions
  const eK = factor * Math.log(Math.max(0.1, params.kOutside) / (Math.max(0.1, params.kInside) + epsilon));
  const eNa = factor * Math.log(Math.max(0.1, params.naOutside) / (Math.max(0.1, params.naInside) + epsilon));
  const eCl = -factor * Math.log(Math.max(0.1, params.clOutside) / (Math.max(0.1, params.clInside) + epsilon));

  return {
    restingPotential: asMillivolts(Math.round(vMembrane * 10) / 10),
    eK: asMillivolts(Math.round(eK * 10) / 10),
    eNa: asMillivolts(Math.round(eNa * 10) / 10),
    eCl: asMillivolts(Math.round(eCl * 10) / 10),
  };
}
