import {
  DEFAULT_TEAM_MEMBERS,
  REVERSIBLE_CAUSES_LIST,
  CRM_SCENARIOS,
  validateClosedLoopMessage,
  computeCrmStep,
  CrmTelemetry,
  CommunicationMessage
} from '../../.gemini/skills/CodeTeamCrmEngine';

describe('CodeTeamCrmEngine Unit Tests', () => {
  it('1. provides all 6 default resuscitation team roles', () => {
    const roles = Object.keys(DEFAULT_TEAM_MEMBERS);
    expect(roles).toHaveLength(6);
    expect(roles).toContain('TEAM_LEADER');
    expect(roles).toContain('COMPRESSOR');
    expect(roles).toContain('AIRWAY_MANAGER');
    expect(roles).toContain('DEFIBRILLATOR_OPERATOR');
    expect(roles).toContain('MEDICATION_NURSE');
    expect(roles).toContain('SCRIBE_RECORDER');
  });

  it('2. provides all 10 reversible causes (5 H\'s and 5 T\'s)', () => {
    const hList = REVERSIBLE_CAUSES_LIST.filter(c => c.type === 'H');
    const tList = REVERSIBLE_CAUSES_LIST.filter(c => c.type === 'T');
    expect(hList).toHaveLength(5);
    expect(tList).toHaveLength(5);
  });

  it('3. verifies closed-loop communication successfully on matching readback', () => {
    const directive: CommunicationMessage = {
      id: 'd-1',
      senderRole: 'TEAM_LEADER',
      senderName: 'Dr. Sarah Lin',
      content: 'Kavita, please prepare Epinephrine 1 milligram IV push.',
      timestampSeconds: 10,
      type: 'DIRECTIVE',
      isClosedLoop: false
    };

    const readback: CommunicationMessage = {
      id: 'r-1',
      senderRole: 'MEDICATION_NURSE',
      senderName: 'Kavita Patel',
      content: 'Understood. Preparing Epinephrine 1 milligram IV push with flush now.',
      timestampSeconds: 12,
      type: 'READBACK',
      isClosedLoop: true,
      closedLoopId: 'd-1'
    };

    const res = validateClosedLoopMessage(directive, readback);
    expect(res.isValid).toBe(true);
    expect(res.feedback).toMatch(/Closed-loop communication verified/i);
  });

  it('4. flags invalid closed-loop when readback lacks critical information', () => {
    const directive: CommunicationMessage = {
      id: 'd-2',
      senderRole: 'TEAM_LEADER',
      senderName: 'Dr. Sarah Lin',
      content: 'Deliver 200 Joules biphasic shock.',
      timestampSeconds: 20,
      type: 'DIRECTIVE',
      isClosedLoop: false
    };

    const incompleteReadback: CommunicationMessage = {
      id: 'r-2',
      senderRole: 'DEFIBRILLATOR_OPERATOR',
      senderName: 'Jessica Taylor',
      content: 'Okay, doing it.',
      timestampSeconds: 22,
      type: 'READBACK',
      isClosedLoop: false
    };

    const res = validateClosedLoopMessage(directive, incompleteReadback);
    expect(res.isValid).toBe(false);
  });

  it('5. computes CPR telemetry step and updates CCF and cycle timer', () => {
    const initial: CrmTelemetry = {
      elapsedSeconds: 0,
      cycleTimerSeconds: 0,
      cycleCount: 1,
      chestCompressionFraction: 1.0,
      totalHandsOnSeconds: 10,
      totalHandsOffSeconds: 0,
      compressorRateBpm: 112,
      compressorDepthMm: 54,
      etco2MmHg: 22,
      teamStressIndex: 45,
      closedLoopCompliancePercent: 100,
      currentRhythm: 'VF',
      shocksDelivered: 1,
      epinephrineDosesGiven: 0,
      amiodaroneDosesGiven: 0
    };

    const step = computeCrmStep(initial, true, 20);
    expect(step.elapsedSeconds).toBe(1);
    expect(step.cycleTimerSeconds).toBe(1);
    expect(step.totalHandsOnSeconds).toBe(11);
    expect(step.compressorDepthMm).toBe(54);
    expect(step.compressorRateBpm).toBe(112);
  });

  it('6. models compression degradation and ETCO2 fall with compressor fatigue', () => {
    const initial: CrmTelemetry = {
      elapsedSeconds: 100,
      cycleTimerSeconds: 100,
      cycleCount: 1,
      chestCompressionFraction: 0.9,
      totalHandsOnSeconds: 90,
      totalHandsOffSeconds: 10,
      compressorRateBpm: 112,
      compressorDepthMm: 54,
      etco2MmHg: 25,
      teamStressIndex: 50,
      closedLoopCompliancePercent: 95,
      currentRhythm: 'VF',
      shocksDelivered: 1,
      epinephrineDosesGiven: 0,
      amiodaroneDosesGiven: 0
    };

    const fatiguedStep = computeCrmStep(initial, true, 85); // 85% fatigue
    expect(fatiguedStep.compressorDepthMm).toBeLessThan(50);
  });
});
