/**
 * HospitalCommandCenterEngine.test.ts
 * Unit tests for Hospital Command Center Engine.
 */

import {
  calculateOccupancy,
  determineStaffingStatus,
  evaluateSurgeLevel,
  computeHACMetrics,
  createInitialCommandCenterState,
  applySurgeAction,
  advanceSimulationStep,
  HOSPITAL_SCENARIOS
} from '../../.gemini/skills/HospitalCommandCenterEngine';

describe('HospitalCommandCenterEngine', () => {
  it('correctly calculates occupancy percentage', () => {
    expect(calculateOccupancy(0, 10)).toBe(0);
    expect(calculateOccupancy(8, 10)).toBe(80);
    expect(calculateOccupancy(19, 20)).toBe(95);
    expect(calculateOccupancy(5, 0)).toBe(0);
  });

  it('evaluates staffing status based on target ratios', () => {
    // Target 0.50 (1:2)
    expect(determineStaffingStatus(0.50, 0.50)).toBe('OPTIMAL');
    expect(determineStaffingStatus(0.40, 0.50)).toBe('ACCEPTABLE');
    expect(determineStaffingStatus(0.20, 0.50)).toBe('UNSAFE');
  });

  it('evaluates hospital surge levels appropriately', () => {
    expect(evaluateSurgeLevel(75, 2, 0)).toBe('GREEN');
    expect(evaluateSurgeLevel(85, 3, 0)).toBe('AMBER');
    expect(evaluateSurgeLevel(91, 5, 1)).toBe('ORANGE');
    expect(evaluateSurgeLevel(96, 12, 2)).toBe('RED');
  });

  it('initializes command center state with all 5 clinical units and patients', () => {
    const state = createInitialCommandCenterState();
    expect(state.hospitalName).toContain('Mediverse');
    expect(state.units.ED.totalBeds).toBe(12);
    expect(state.units.ICU.totalBeds).toBe(8);
    expect(state.units.STEPDOWN.totalBeds).toBe(10);
    expect(state.units.SURGICAL.totalBeds).toBe(16);
    expect(state.units.MEDICAL.totalBeds).toBe(20);
    expect(state.beds.length).toBe(66);
    expect(state.patients.length).toBeGreaterThan(40);
  });

  it('accurately computes HAC surveillance metrics', () => {
    const state = createInitialCommandCenterState();
    const hac = computeHACMetrics(state.patients, state.actions);
    expect(hac.bundleAdherencePercent).toBeGreaterThanOrEqual(60);
    expect(hac.cautiRatePer1000Days).toBeGreaterThan(0);
    expect(hac.clabsiRatePer1000Days).toBeGreaterThan(0);
  });

  it('applies surge mitigation actions and modifies bed capacity', () => {
    const state = createInitialCommandCenterState();
    const withOverflow = applySurgeAction(state, 'activateOverflowBeds', true);
    expect(withOverflow.units.MEDICAL.totalBeds).toBe(25);
    expect(withOverflow.units.SURGICAL.totalBeds).toBe(19);
    expect(withOverflow.beds.some(b => b.id.includes('overflow'))).toBe(true);

    const reverted = applySurgeAction(withOverflow, 'activateOverflowBeds', false);
    expect(reverted.units.MEDICAL.totalBeds).toBe(20);
    expect(reverted.units.SURGICAL.totalBeds).toBe(16);
  });

  it('advances simulation steps by cleaning beds and advancing timestamps', () => {
    const state = createInitialCommandCenterState();
    const stepped = advanceSimulationStep(state, 15);
    expect(stepped.timestampMinutes).toBe(15);
  });

  it('loads master clinical scenarios correctly', () => {
    expect(HOSPITAL_SCENARIOS.length).toBe(4);
    const winterSurge = HOSPITAL_SCENARIOS[0].preset();
    expect(winterSurge.surgeLevel).toBe('RED');
    expect(winterSurge.edBoardingPatients).toBe(14);
  });
});
