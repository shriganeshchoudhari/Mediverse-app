import {
  SEEDED_OSCE_SCENARIOS,
  AUSCULTATION_POINTS,
  evaluateCandidateOSCEPerformance,
  OsceCandidateAction,
} from '../../.gemini/skills/OSCEExamSkills';

describe('OSCEExamSkills', () => {
  const scenario = SEEDED_OSCE_SCENARIOS[0];

  it('should have seeded OSCE scenario with 5 clinical stations', () => {
    expect(scenario).toBeDefined();
    expect(scenario.id).toBe('osce-stemi-cardiology');
    expect(scenario.stations).toHaveLength(5);
    expect(scenario.stations[0].stationType).toBe('HISTORY');
    expect(scenario.stations[1].stationType).toBe('EXAMINATION');
    expect(scenario.stations[2].stationType).toBe('INVESTIGATION');
    expect(scenario.stations[3].stationType).toBe('PRESCRIPTION_COUNSELING');
    expect(scenario.stations[4].stationType).toBe('ATTENDING_VIVA');
  });

  it('should verify cardiac and pulmonary auscultation landmarks', () => {
    const aortic = AUSCULTATION_POINTS.find((p) => p.id === 'aortic');
    const mitral = AUSCULTATION_POINTS.find((p) => p.id === 'mitral_apex');
    const rightBase = AUSCULTATION_POINTS.find((p) => p.id === 'pulmonary_right_base');

    expect(aortic).toBeDefined();
    expect(aortic?.modulationType).toBe('murmur_systolic');
    expect(mitral?.modulationType).toBe('gallop_s3');
    expect(rightBase?.view).toBe('posterior');
  });

  it('should correctly evaluate passing candidate performance without contraindications', () => {
    const actions: OsceCandidateAction[] = [];
    scenario.stations.forEach((st) => {
      st.requiredActions.forEach((req) => {
        actions.push({
          stationId: st.id,
          timestamp: Date.now(),
          actionType: 'COMPLETED_ACTION',
          detail: req,
        });
      });
    });

    const report = evaluateCandidateOSCEPerformance(scenario, actions, 120);
    expect(report.passed).toBe(true);
    expect(report.safetyScore).toBe(95);
    expect(report.totalScore).toBeGreaterThanOrEqual(70);
    expect(report.stationBreakdown).toHaveLength(5);
  });

  it('should penalize safety contraindications appropriately', () => {
    const actionsWithSafetyViolation: OsceCandidateAction[] = [
      {
        stationId: 'station-4',
        timestamp: Date.now(),
        actionType: 'PRESCRIPTION',
        detail: 'Administering sublingual or IV Nitroglycerin when SBP is <90 mmHg (risks circulatory collapse)',
        isContraindicated: true,
      },
    ];

    const report = evaluateCandidateOSCEPerformance(scenario, actionsWithSafetyViolation, 0);
    expect(report.safetyScore).toBe(55);
    const station4 = report.stationBreakdown.find((s) => s.stationNumber === 4);
    expect(station4?.safetyViolations.length).toBeGreaterThan(0);
  });
});
