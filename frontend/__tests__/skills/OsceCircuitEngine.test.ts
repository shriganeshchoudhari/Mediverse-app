import {
  evaluateStationPerformance,
  generateDeansAssessmentReport,
  playOsceChime,
} from '../../.gemini/skills/OsceCircuitEngine';
import { OSCE_STATION_REGISTRY, OsceStation } from '../../lib/exam/osceStationRegistry';

describe('OsceCircuitEngine', () => {
  const sampleStation: OsceStation = OSCE_STATION_REGISTRY[0]; // CPR station

  it('correctly calculates station score based on checked checklist items', () => {
    // Select first 5 items
    const checkedIds = sampleStation.checklist.slice(0, 5).map((item) => item.id);
    const result = evaluateStationPerformance(sampleStation, checkedIds, [], 180);

    expect(result.stationId).toBe(sampleStation.id);
    expect(result.timeSpentSeconds).toBe(180);
    expect(result.totalScored).toBeGreaterThan(0);
    expect(result.scorePercentage).toBeLessThan(100);
    expect(result.criticalFailsTriggered).toHaveLength(0);
  });

  it('fails a station immediately if a critical safety trigger is tripped even with high marks', () => {
    // Check all items (100% marks)
    const allCheckedIds = sampleStation.checklist.map((item) => item.id);
    const criticalFail = 'Failure to shout STAND CLEAR before AED shock delivery';

    const result = evaluateStationPerformance(sampleStation, allCheckedIds, [criticalFail], 240);

    expect(result.scorePercentage).toBe(100);
    expect(result.criticalFailsTriggered).toContain(criticalFail);
    expect(result.isPassed).toBe(false); // Overridden by safety violation
  });

  it('computes 5-dimension breakdown with percentages accurately', () => {
    const allCheckedIds = sampleStation.checklist.map((item) => item.id);
    const result = evaluateStationPerformance(sampleStation, allCheckedIds, [], 300);

    expect(result.dimensionScores.COMMUNICATION.percentage).toBe(100);
    expect(result.dimensionScores.CLINICAL_SKILL.percentage).toBe(100);
    expect(result.dimensionScores.PATIENT_SAFETY.percentage).toBe(100);
    expect(result.isPassed).toBe(true);
  });

  it('aggregates multiple station attempts into Dean Assessment Report', () => {
    const attempt1 = evaluateStationPerformance(
      OSCE_STATION_REGISTRY[0],
      OSCE_STATION_REGISTRY[0].checklist.map((i) => i.id),
      [],
      300
    );
    const attempt2 = evaluateStationPerformance(
      OSCE_STATION_REGISTRY[1],
      OSCE_STATION_REGISTRY[1].checklist.map((i) => i.id),
      [],
      300
    );

    const report = generateDeansAssessmentReport([attempt1, attempt2], 'TEST-STUDENT-01');

    expect(report.candidateId).toBe('TEST-STUDENT-01');
    expect(report.totalStations).toBe(2);
    expect(report.stationsPassed).toBe(2);
    expect(report.stationsFailed).toBe(0);
    expect(report.overallPassed).toBe(true);
    expect(report.overallScorePercentage).toBe(100);
    expect(report.statutoryAccreditationVerdict).toMatch(/PASSED/i);
  });

  it('marks candidate as FAILED in Dean Report if safety violations occur', () => {
    const attempt1 = evaluateStationPerformance(
      OSCE_STATION_REGISTRY[0],
      OSCE_STATION_REGISTRY[0].checklist.map((i) => i.id),
      ['Failure to check pulse'],
      300
    );

    const report = generateDeansAssessmentReport([attempt1], 'TEST-STUDENT-02');

    expect(report.overallPassed).toBe(false);
    expect(report.criticalSafetyViolationsCount).toBe(1);
    expect(report.statutoryAccreditationVerdict).toMatch(/FAILED/i);
  });

  it('handles playOsceChime safely when muted or audio context missing', () => {
    expect(() => {
      playOsceChime('START', true);
      playOsceChime('WARNING_2MIN', true);
      playOsceChime('FINISH', true);
    }).not.toThrow();
  });
});
