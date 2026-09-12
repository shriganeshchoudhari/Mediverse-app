import {
  INITIAL_MEGACODE_STATE,
  deliverDefibrillation,
  administerAclsMedication,
  treatReversibleCause,
  computeAclsDebriefScore,
  MegacodeState,
} from '../../.gemini/skills/AclsResuscitationEngine';

describe('AclsResuscitationEngine Unit Tests', () => {
  let state: MegacodeState;

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(INITIAL_MEGACODE_STATE));
  });

  describe('Shockable Rhythm Pathway (VF/pVT)', () => {
    it('successfully delivers 200J biphasic shock and logs event', () => {
      const { updatedState, outcomeMessage, isAppropriate } = deliverDefibrillation(state, 200);

      expect(isAppropriate).toBe(true);
      expect(updatedState.shocksDeliveredCount).toBe(1);
      expect(outcomeMessage).toContain('Shock #1 (200J) delivered');
    });

    it('terminates refractory VF into ROSC with sudden EtCO2 surge when antiarrhythmic given', () => {
      // First shock
      let res = deliverDefibrillation(state, 200);
      state = res.updatedState;

      // Amiodarone 300 mg
      const medRes = administerAclsMedication(state, 'AMIODARONE_300MG');
      state = medRes.updatedState;
      expect(state.amiodaroneDoseGiven).toBe(300);

      // Second shock converts VF to ROSC
      res = deliverDefibrillation(state, 200);
      expect(res.updatedState.roscAchieved).toBe(true);
      expect(res.updatedState.currentRhythm).toBe('ROSC_SINUS');
      expect(res.updatedState.etCo2MmHg).toBeGreaterThanOrEqual(35);
      expect(res.outcomeMessage).toContain('Return of Spontaneous Circulation');
    });

    it('rejects defibrillation for non-shockable rhythms (Asystole/PEA)', () => {
      state.currentRhythm = 'ASYSTOLE';
      const { updatedState, outcomeMessage, isAppropriate } = deliverDefibrillation(state, 200);

      expect(isAppropriate).toBe(false);
      expect(outcomeMessage).toContain('Defibrillation contraindicated');
      expect(updatedState.eventLog.some((e) => e.type === 'ALGORITHM_ERROR')).toBe(true);
    });
  });

  describe('ACLS Medication Dosing & Timing', () => {
    it('administers Epinephrine 1 mg and enforces 3-minute interval', () => {
      // First dose at 0s
      let res = administerAclsMedication(state, 'EPINEPHRINE_1MG');
      expect(res.isAppropriate).toBe(true);
      expect(res.updatedState.totalEpiCount).toBe(1);

      // Attempt second dose too early at 60s
      res.updatedState.elapsedArrestSec = 60;
      const earlyRes = administerAclsMedication(res.updatedState, 'EPINEPHRINE_1MG');
      expect(earlyRes.isAppropriate).toBe(false);
      expect(earlyRes.outcomeMessage).toContain('warning');

      // Attempt second dose after 3 min (180s)
      res.updatedState.elapsedArrestSec = 185;
      const validRes = administerAclsMedication(res.updatedState, 'EPINEPHRINE_1MG');
      expect(validRes.isAppropriate).toBe(true);
      expect(validRes.updatedState.totalEpiCount).toBe(2);
    });

    it('enforces sequential Amiodarone 300 mg then 150 mg dosing', () => {
      // First dose
      let res = administerAclsMedication(state, 'AMIODARONE_300MG');
      expect(res.isAppropriate).toBe(true);
      expect(res.updatedState.amiodaroneDoseGiven).toBe(300);

      // Attempting 300 mg again should fail
      const repeatRes = administerAclsMedication(res.updatedState, 'AMIODARONE_300MG');
      expect(repeatRes.isAppropriate).toBe(false);

      // Second dose 150 mg succeeds
      const secondRes = administerAclsMedication(res.updatedState, 'AMIODARONE_150MG');
      expect(secondRes.isAppropriate).toBe(true);
      expect(secondRes.updatedState.amiodaroneDoseGiven).toBe(450);
    });
  });

  describe('Reversible Causes (H\'s and T\'s) Resolution', () => {
    it('reverses hyperkalemic PEA arrest with calcium chloride and achieves ROSC', () => {
      state.currentRhythm = 'PEA';
      state.underlyingCause = 'HYPERKALEMIA';

      const res = treatReversibleCause(state, 'HYPERKALEMIA', 'IV Calcium Chloride 1g');
      expect(res.isCorrect).toBe(true);
      expect(res.updatedState.underlyingCauseTreated).toBe(true);
      expect(res.updatedState.roscAchieved).toBe(true);
      expect(res.updatedState.currentRhythm).toBe('ROSC_SINUS');
    });

    it('rejects incorrect cause intervention', () => {
      state.underlyingCause = 'THROMBOSIS_MI';
      const res = treatReversibleCause(state, 'HYPOTHERMIA', 'Warm IV fluids');
      expect(res.isCorrect).toBe(false);
      expect(res.updatedState.underlyingCauseTreated).toBe(false);
    });
  });

  describe('Debrief & AHA Algorithm Adherence Scoring', () => {
    it('scores high grade for compliant megacode resuscitation', () => {
      // Simulate compliant code
      let res = deliverDefibrillation(state, 200);
      state = res.updatedState;
      state.elapsedArrestSec = 120;
      state = administerAclsMedication(state, 'EPINEPHRINE_1MG').updatedState;
      state = administerAclsMedication(state, 'AMIODARONE_300MG').updatedState;
      state = treatReversibleCause(state, 'THROMBOSIS_MI', 'Emergency Cath Lab activation').updatedState;
      state.roscAchieved = true;

      const score = computeAclsDebriefScore(state);
      expect(score.totalScore).toBeGreaterThanOrEqual(85);
      expect(score.letterGrade === 'A+' || score.letterGrade === 'A').toBe(true);
    });
  });
});