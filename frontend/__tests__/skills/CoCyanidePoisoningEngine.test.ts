import {
  initializeCoCyanidePatientState,
  setOxygenDeliveryMode,
  administerHydroxocobalamin,
  administerSodiumThiosulfate,
  administerSodiumNitrite,
  initiateHyperbaricOxygen,
  advanceCoCyanideTime,
  evaluateCoCyanideDebrief,
  getCoHalfLifeMinutes,
  CO_CYANIDE_SCENARIOS,
} from '../../.gemini/skills/CoCyanidePoisoningEngine';

describe('CoCyanidePoisoningEngine', () => {
  it('initializes structure fire scenario with dual toxicity, severe lactate, and falsely normal SpO2', () => {
    const state = initializeCoCyanidePatientState('ENCLOSED_STRUCTURE_FIRE_SMOKE');
    expect(state.coOximetry.coHbPct).toBe(38);
    expect(state.coOximetry.standardSpO2Pct).toBeGreaterThanOrEqual(98); // Pulse oximetry pitfall
    expect(state.labs.wholeBloodCyanideUmolL).toBe(68);
    expect(state.labs.serumLactateMmolL).toBe(11.8);
    expect(state.labs.scvO2Pct).toBeGreaterThanOrEqual(85); // Histotoxic hypoxia
    expect(state.activeAlarms.length).toBeGreaterThan(0);
  });

  it('verifies carboxyhemoglobin elimination half-lives across oxygen modalities', () => {
    expect(getCoHalfLifeMinutes('ROOM_AIR_21_PCT')).toBe(320);
    expect(getCoHalfLifeMinutes('NRB_100_PCT')).toBe(78);
    expect(getCoHalfLifeMinutes('HYPERBARIC_OXYGEN_3_ATA')).toBe(23);
  });

  it('accelerates CO elimination when placed on 100% NRB', () => {
    const state = initializeCoCyanidePatientState('PROPANE_HEATER_WINTER_CO');
    const { updatedState: nrbState } = setOxygenDeliveryMode(state, 'NRB_100_PCT');
    expect(nrbState.oxygenMode).toBe('NRB_100_PCT');

    const advanced = advanceCoCyanideTime(nrbState, 78); // 1 half life
    expect(advanced.coOximetry.coHbPct).toBeLessThanOrEqual(state.coOximetry.coHbPct / 2 + 2);
  });

  it('infuses Hydroxocobalamin, neutralizes cyanide, clears lactate, and causes burgundy chromaturia', () => {
    const state = initializeCoCyanidePatientState('ENCLOSED_STRUCTURE_FIRE_SMOKE');
    const { updatedState, message } = administerHydroxocobalamin(state, 5.0);

    expect(updatedState.antidotes.hydroxocobalaminGivenGrams).toBe(5.0);
    expect(updatedState.labs.wholeBloodCyanideUmolL).toBeLessThan(state.labs.wholeBloodCyanideUmolL);
    expect(updatedState.labs.serumLactateMmolL).toBeLessThan(state.labs.serumLactateMmolL);
    expect(updatedState.labs.urineColor).toBe('BURGUNDY_RED_CHROMATURIA');
    expect(message).toContain('Hydroxocobalamin (Cyanokit)');
  });

  it('identifies lethal hypoxia hazard when Sodium Nitrite is administered to a patient with high COHb', () => {
    const state = initializeCoCyanidePatientState('ENCLOSED_STRUCTURE_FIRE_SMOKE');
    const { updatedState, message } = administerSodiumNitrite(state, 300);

    expect(updatedState.coOximetry.metHbPct).toBeGreaterThanOrEqual(20);
    expect(message).toContain('CRITICAL CONTRAINDICATION');
    expect(updatedState.activeAlarms.some((a) => a.includes('LETHAL HYPOXIA HAZARD'))).toBe(true);
  });

  it('recognizes lower HBO2 threshold (15%) in pregnancy', () => {
    const state = initializeCoCyanidePatientState('PREGNANCY_SMOKE_INHALATION');
    expect(state.isPregnant).toBe(true);
    expect(state.coOximetry.coHbPct).toBe(18);
    expect(state.activeAlarms.some((a) => a.includes('PREGNANCY WITH COHb'))).toBe(true);
  });

  it('initiates Hyperbaric Oxygen session and accelerates clearance', () => {
    const state = initializeCoCyanidePatientState('PROPANE_HEATER_WINTER_CO');
    const { updatedState, message } = initiateHyperbaricOxygen(state);

    expect(updatedState.oxygenMode).toBe('HYPERBARIC_OXYGEN_3_ATA');
    expect(updatedState.antidotes.hbo2SessionActive).toBe(true);
    expect(message).toContain('Hyperbaric Oxygen Therapy (HBO2)');
  });

  it('evaluates clinical debrief competency scoring and generates feedback', () => {
    const state = initializeCoCyanidePatientState('ENCLOSED_STRUCTURE_FIRE_SMOKE');
    const { updatedState: o2State } = setOxygenDeliveryMode(state, 'NRB_100_PCT');
    const { updatedState: cyanoState } = administerHydroxocobalamin(o2State, 5.0);
    const { updatedState: hboState } = initiateHyperbaricOxygen(cyanoState);

    const debrief = evaluateCoCyanideDebrief(hboState);
    expect(debrief.scorePercentage).toBeGreaterThanOrEqual(85);
    expect(['A+', 'A', 'B']).toContain(debrief.letterGrade);
    expect(debrief.highFlowO2InitiatedPromptly).toBe(true);
    expect(debrief.hydroxocobalaminAdministeredCorrectly).toBe(true);
    expect(debrief.avoidedNitriteToxicityTrap).toBe(true);
    expect(debrief.hbo2ReferredAccurately).toBe(true);
  });
});
