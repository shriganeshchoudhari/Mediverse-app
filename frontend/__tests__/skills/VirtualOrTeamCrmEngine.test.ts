import {
  INITIAL_TEAM_ROSTER,
  computeApneaDesaturation,
  dispatchTeamCommand,
  computeCrmDebriefScore,
  OrScenarioState,
} from '../../.gemini/skills/VirtualOrTeamCrmEngine';

describe('VirtualOrTeamCrmEngine Unit Tests', () => {
  it('initializes team roster with all 5 core interprofessional roles', () => {
    expect(INITIAL_TEAM_ROSTER.AIRWAY_LEAD).toBeDefined();
    expect(INITIAL_TEAM_ROSTER.RESIDENT_ANESTHESIA).toBeDefined();
    expect(INITIAL_TEAM_ROSTER.CIRCULATING_RN).toBeDefined();
    expect(INITIAL_TEAM_ROSTER.SCRUB_TECH).toBeDefined();
    expect(INITIAL_TEAM_ROSTER.SURGEON).toBeDefined();

    expect(INITIAL_TEAM_ROSTER.CIRCULATING_RN.name).toContain('Jessica Reed');
    expect(INITIAL_TEAM_ROSTER.SURGEON.title).toContain('Surgeon');
  });

  describe('FRC Apnea Desaturation Kinetics', () => {
    it('models safe apnea plateau followed by steep hypoxemic drop', () => {
      const vitalsAt30s = computeApneaDesaturation(30, 1500, 320, false);
      expect(vitalsAt30s.spO2Percent).toBeGreaterThanOrEqual(95);
      expect(vitalsAt30s.cardiacRhythm).toBe('SINUS_RHYTHM');

      const vitalsAt120s = computeApneaDesaturation(120, 1500, 320, false);
      expect(vitalsAt120s.spO2Percent).toBeLessThan(85);
      expect(vitalsAt120s.cardiacRhythm).toBe('SINUS_TACHYCARDIA');

      const vitalsAt180s = computeApneaDesaturation(180, 1500, 320, false);
      expect(vitalsAt180s.spO2Percent).toBeLessThan(60);
      expect(vitalsAt180s.cardiacRhythm).toBe('HYPOXIC_BRADYCARDIA');
      expect(vitalsAt180s.heartRateBpm).toBeLessThan(50);
    });

    it('immediately restores SpO2 and sinus hemodynamics when oxygenation is re-established', () => {
      const vitals = computeApneaDesaturation(180, 1500, 320, true);
      expect(vitals.spO2Percent).toBe(99);
      expect(vitals.heartRateBpm).toBe(82);
      expect(vitals.cardiacRhythm).toBe('RECOVERED_SINUS');
    });
  });

  describe('Closed-Loop Communication & Fixation Error Detection', () => {
    let baseState: OrScenarioState;

    beforeEach(() => {
      baseState = {
        patientWeightKg: 110,
        patientBmi: 38,
        frcVolumeMl: 1400,
        oxygenConsumptionVo2MlMin: 350,
        currentPlan: 'PLAN_A_INTUBATION',
        intubationAttemptsCount: 0,
        sadAttemptsCount: 0,
        sugammadexGiven: false,
        cicoDeclared: false,
        airwayCartAtBedside: false,
        cricothyroidotomy: {
          laryngealHandshakeDone: false,
          incisionType: 'NONE',
          bladeTurned90Deg: false,
          bougieRailroaded: false,
          trachealClicksFelt: false,
          tube60Inserted: false,
          cuffInflated: false,
          capnographyConfirmed: false,
        },
        teamMembers: INITIAL_TEAM_ROSTER,
        eventLog: [],
      };
    });

    it('penalizes persistent direct laryngoscopy attempts beyond DAS threshold (> 3)', () => {
      let state = baseState;
      // 3 attempts
      state = dispatchTeamCommand('RESIDENT_ANESTHESIA', 'ATTEMPT_VIDEO_LARYNGOSCOPY', state).updatedState;
      state = dispatchTeamCommand('RESIDENT_ANESTHESIA', 'ATTEMPT_VIDEO_LARYNGOSCOPY', state).updatedState;
      state = dispatchTeamCommand('RESIDENT_ANESTHESIA', 'ATTEMPT_VIDEO_LARYNGOSCOPY', state).updatedState;
      expect(state.eventLog.filter(e => e.type === 'FIXATION_PENALTY')).toHaveLength(0);

      // 4th attempt triggers fixation penalty
      state = dispatchTeamCommand('RESIDENT_ANESTHESIA', 'ATTEMPT_VIDEO_LARYNGOSCOPY', state).updatedState;
      expect(state.eventLog.filter(e => e.type === 'FIXATION_PENALTY')).toHaveLength(1);
    });

    it('triggers CICO declaration and checkbacks when lead calls CICO', () => {
      const result = dispatchTeamCommand('AIRWAY_LEAD', 'DECLARE_CICO', baseState);
      expect(result.updatedState.cicoDeclared).toBe(true);
      expect(result.updatedState.currentPlan).toBe('PLAN_D_SURGICAL_CRIC');
      expect(result.callbackMessage).toContain('Cannot Intubate Cannot Oxygenate');
      expect(result.updatedState.eventLog.some(e => e.type === 'CHECKBACK')).toBe(true);
    });
  });

  describe('Surgical Cricothyroidotomy Step Sequence', () => {
    let state: OrScenarioState;

    beforeEach(() => {
      state = {
        patientWeightKg: 100,
        patientBmi: 35,
        frcVolumeMl: 1500,
        oxygenConsumptionVo2MlMin: 320,
        currentPlan: 'PLAN_D_SURGICAL_CRIC',
        intubationAttemptsCount: 2,
        sadAttemptsCount: 1,
        sugammadexGiven: true,
        cicoDeclared: true,
        airwayCartAtBedside: true,
        cricothyroidotomy: {
          laryngealHandshakeDone: false,
          incisionType: 'NONE',
          bladeTurned90Deg: false,
          bougieRailroaded: false,
          trachealClicksFelt: false,
          tube60Inserted: false,
          cuffInflated: false,
          capnographyConfirmed: false,
        },
        teamMembers: INITIAL_TEAM_ROSTER,
        eventLog: [],
      };
    });

    it('enforces anatomical laryngeal handshake before allowing incision', () => {
      const prematureIncision = dispatchTeamCommand('AIRWAY_LEAD', 'PERFORM_CRIC_INCISION', state);
      expect(prematureIncision.isActionSuccess).toBe(false);
      expect(prematureIncision.callbackMessage).toContain('Must perform laryngeal handshake');

      // Now perform handshake
      state = dispatchTeamCommand('AIRWAY_LEAD', 'PREPARE_SCALPEL_BOUGIE', state).updatedState;
      expect(state.cricothyroidotomy.laryngealHandshakeDone).toBe(true);

      // Now incision succeeds
      const validIncision = dispatchTeamCommand('AIRWAY_LEAD', 'PERFORM_CRIC_INCISION', state);
      expect(validIncision.isActionSuccess).toBe(true);
      expect(validIncision.updatedState.cricothyroidotomy.incisionType).toBe('TRANSVERSE_STAB');
      expect(validIncision.updatedState.cricothyroidotomy.bladeTurned90Deg).toBe(true);
    });

    it('completes the full surgical sequence and scores an A+ grade', () => {
      // 1. Handshake
      state = dispatchTeamCommand('AIRWAY_LEAD', 'PREPARE_SCALPEL_BOUGIE', state).updatedState;
      // 2. Incision
      state = dispatchTeamCommand('AIRWAY_LEAD', 'PERFORM_CRIC_INCISION', state).updatedState;
      // 3. Bougie
      state = dispatchTeamCommand('AIRWAY_LEAD', 'INSERT_BOUGIE', state).updatedState;
      // 4. Tube
      state = dispatchTeamCommand('AIRWAY_LEAD', 'RAILROAD_60_TUBE', state).updatedState;
      // 5. Inflate cuff & confirm
      state = dispatchTeamCommand('AIRWAY_LEAD', 'INFLATE_CUFF_CONFIRM', state).updatedState;

      // Add a checkback event for closed loop
      state.eventLog.push({
        id: 'cb1',
        timestampSec: 60,
        actor: 'CIRCULATING_RN',
        message: 'Cuff inflated, EtCO2 confirmed',
        type: 'CHECKBACK',
      });

      const debrief = computeCrmDebriefScore(state);
      expect(debrief.totalScore).toBe(100);
      expect(debrief.letterGrade).toBe('A+');
      expect(debrief.feedbackComments).toContain('Timely CICO declaration enabled immediate team role transition.');
    });
  });
});
