import {
  initializeCaseSession,
  executeCaseAction,
  calculateRubricScores,
  SEEDED_BRANCHING_SCENARIOS,
} from '../../.gemini/skills/ClinicalCaseBranchingEngine';

describe('ClinicalCaseBranchingEngine', () => {
  it('initializes case session with correct baseline vitals and demographics', () => {
    const session = initializeCaseSession('case-rv-stemi');

    expect(session.scenarioId).toBe('case-rv-stemi');
    expect(session.currentNodeId).toBe('node-initial');
    expect(session.currentVitals.heartRate).toBe(54);
    expect(session.currentVitals.systolicBp).toBe(96);
    expect(session.currentEmotionalState).toBe('ANXIOUS');
    expect(session.executedActionIds).toHaveLength(0);
    expect(session.safetyViolationCount).toBe(0);
  });

  it('executes diagnostic action, updates elapsed time and logs history', () => {
    let session = initializeCaseSession('case-rv-stemi');
    const { updatedSession, action, consequence } = executeCaseAction(session, 'act-ecg-12lead');

    expect(updatedSession.executedActionIds).toContain('act-ecg-12lead');
    expect(updatedSession.elapsedSeconds).toBe(120);
    expect(updatedSession.totalCostUnits).toBe(40);
    expect(action.label).toBe('STAT 12-Lead Standard ECG');
    expect(consequence).toContain('ST elevation in inferior leads');
    expect(updatedSession.historyLog).toHaveLength(1);
  });

  it('triggers hemodynamic collapse node and increments safety violations when contraindicated action is taken', () => {
    let session = initializeCaseSession('case-rv-stemi');

    // Administer Nitroglycerin (contraindicated in RV infarction)
    const { updatedSession } = executeCaseAction(session, 'act-order-nitroglycerin-sublingual');

    expect(updatedSession.safetyViolationCount).toBe(1);
    expect(updatedSession.currentNodeId).toBe('node-nitrate-collapse');
    expect(updatedSession.currentVitals.systolicBp).toBe(62);
    expect(updatedSession.currentEmotionalState).toBe('OBTUNDED');
  });

  it('rescues patient with emergency fluid bolus after nitrate collapse', () => {
    let session = initializeCaseSession('case-rv-stemi');

    // Cause collapse
    const step1 = executeCaseAction(session, 'act-order-nitroglycerin-sublingual');
    // Rescue with STAT fluid bolus
    const step2 = executeCaseAction(step1.updatedSession, 'act-stat-fluid-bolus');

    expect(step2.updatedSession.currentNodeId).toBe('node-rv-confirmed-stable');
    expect(step2.updatedSession.currentVitals.systolicBp).toBe(104);
    expect(step2.updatedSession.currentEmotionalState).toBe('RELIEVED');
  });

  it('computes rubric scores and penalizes safety violations appropriately', () => {
    let session = initializeCaseSession('case-rv-stemi');

    // Optimal pathway
    session = executeCaseAction(session, 'act-focused-history').updatedSession;
    session = executeCaseAction(session, 'act-chest-exam').updatedSession;
    session = executeCaseAction(session, 'act-ecg-12lead').updatedSession;
    session = executeCaseAction(session, 'act-right-sided-ecg').updatedSession;
    session = executeCaseAction(session, 'act-order-aspirin').updatedSession;
    session = executeCaseAction(session, 'act-order-dapt-ticagrelor').updatedSession;
    session = executeCaseAction(session, 'act-iv-access-fluids').updatedSession;
    session = executeCaseAction(session, 'act-call-cath-lab').updatedSession;

    const report = calculateRubricScores(session);

    expect(report.passed).toBe(true);
    expect(report.dimensionScores.patientSafety).toBe(25); // Zero violations
    expect(report.dimensionScores.diagnosticAccuracy).toBeGreaterThanOrEqual(20);
    expect(report.totalScore).toBeGreaterThanOrEqual(85);
    expect(report.criticalActionsCompleted.length).toBeGreaterThan(4);
  });

  it('fails candidate if severe safety violation drops score below threshold', () => {
    let session = initializeCaseSession('case-rv-stemi');

    // Inadvertent multiple contraindications
    session = executeCaseAction(session, 'act-order-nitroglycerin-sublingual').updatedSession;
    session = executeCaseAction(session, 'act-order-beta-blocker').updatedSession;

    const report = calculateRubricScores(session);

    expect(report.dimensionScores.patientSafety).toBe(0); // 2 violations * 12.5 = 25 penalty -> 0
    expect(report.passed).toBe(false);
    expect(report.grade).toBe('FAIL');
    expect(report.safetyViolations.length).toBe(2);
  });

  it('initializes and executes neutropenic sepsis scenario', () => {
    let session = initializeCaseSession('case-neutropenic-sepsis');

    expect(session.currentVitals.temperatureCelsius).toBe(39.4);
    expect(session.currentVitals.heartRate).toBe(132);

    session = executeCaseAction(session, 'act-stat-blood-cultures').updatedSession;
    session = executeCaseAction(session, 'act-order-piptazo').updatedSession;
    session = executeCaseAction(session, 'act-30mlkg-crystalloid-bolus').updatedSession;

    expect(session.currentNodeId).toBe('node-sepsis-stabilized');
    expect(session.currentVitals.systolicBp).toBe(104);
  });
});
