import { solveCardiacCycle } from '../../lib/simulations/cardiacSolver';
import { solveGoldmanHodgkinKatz } from '../../lib/simulations/membraneSolver';
import { solveAlveolarGasEquation } from '../../lib/simulations/respiratorySolver';
import { solveRenalFiltration } from '../../lib/simulations/renalSolver';
import { asMilliliters, asMmHg, asBeatsPerMinute } from '../../lib/simulations/types';

describe('Physiology Mathematical Solvers Suite', () => {
  test('solveCardiacCycle calculates physiological normal baseline without NaNs', () => {
    const result = solveCardiacCycle({
      preloadEDV: asMilliliters(120),
      afterloadSVR: asMmHg(80),
      inotropyEes: 2.5,
      heartRate: asBeatsPerMinute(72),
    });

    expect(Number.isNaN(result.strokeVolume)).toBe(false);
    expect(Number.isNaN(result.ejectionFraction)).toBe(false);
    expect(Number.isNaN(result.cardiacOutput)).toBe(false);

    // Normal values for EDV 120 mL: Stroke volume ~ 60-80 mL, EF ~ 55-65%
    expect(result.strokeVolume).toBeGreaterThan(50);
    expect(result.strokeVolume).toBeLessThan(90);
    expect(result.ejectionFraction).toBeGreaterThan(50);
    expect(result.ejectionFraction).toBeLessThan(75);
    expect(result.pvLoopPoints.length).toBeGreaterThan(100);
  });

  test('solveGoldmanHodgkinKatz computes typical resting membrane potential ~ -70 to -90 mV', () => {
    const result = solveGoldmanHodgkinKatz({
      kInside: 140,
      kOutside: 4.5,
      kPermeability: 1.0,
      naInside: 12,
      naOutside: 145,
      naPermeability: 0.04,
      clInside: 4,
      clOutside: 115,
      clPermeability: 0.45,
      temperatureCelsius: 37,
    });

    expect(Number.isNaN(result.restingPotential)).toBe(false);
    expect(result.restingPotential).toBeLessThan(-65);
    expect(result.restingPotential).toBeGreaterThan(-95);
    expect(result.eK).toBeLessThan(-80);
    expect(result.eNa).toBeGreaterThan(50);
  });

  test('solveAlveolarGasEquation calculates sea-level room air PAO2 ~ 100 mmHg', () => {
    const result = solveAlveolarGasEquation({
      fractionInspiredO2: 0.21,
      barometricPressure: asMmHg(760),
      arterialPCO2: asMmHg(40),
      respiratoryQuotient: 0.8,
      tidalVolumeMl: 500,
      respiratoryRate: 12,
      deadSpaceFraction: 0.3,
    });

    expect(Number.isNaN(result.alveolarPO2)).toBe(false);
    // (760 - 47) * 0.21 - (40 / 0.8) = 149.73 - 50 = ~99.7 mmHg
    expect(result.alveolarPO2).toBeGreaterThan(95);
    expect(result.alveolarPO2).toBeLessThan(105);
    expect(result.minuteVentilation).toBeCloseTo(6.0, 1);
  });

  test('solveRenalFiltration calculates normal baseline GFR ~ 125 mL/min from Starling forces', () => {
    const result = solveRenalFiltration({
      pGlomerularCapillary: asMmHg(60),
      pBowmansSpace: asMmHg(18),
      piGlomerularCapillary: asMmHg(32),
      piBowmansSpace: asMmHg(0),
      kf: 12.5,
    });

    expect(Number.isNaN(result.gfr)).toBe(false);
    expect(result.netFiltrationPressure).toBe(10);
    expect(result.gfr).toBe(125);
  });
});

