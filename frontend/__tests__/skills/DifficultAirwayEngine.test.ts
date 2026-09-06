import {
  evaluateDifficultAirway,
  calculateStopBangScore,
  estimateGlotticView,
  DIFFICULT_AIRWAY_PRESETS,
} from '../../.gemini/skills/DifficultAirwayEngine';

describe('DifficultAirwayEngine', () => {
  it('calculates STOP-BANG scores and risk tiers accurately', () => {
    // Low risk: score 1
    const lowRisk = calculateStopBangScore({
      snoring: true,
      tiredness: false,
      observedApnea: false,
      highBloodPressure: false,
      bmiOver35: false,
      ageOver50: false,
      neckCircumferenceOver40: false,
      genderMale: false,
    });
    expect(lowRisk.score).toBe(1);
    expect(lowRisk.risk).toBe('LOW');

    // High risk: score 6
    const highRisk = calculateStopBangScore({
      snoring: true,
      tiredness: true,
      observedApnea: true,
      highBloodPressure: true,
      bmiOver35: true,
      ageOver50: true,
      neckCircumferenceOver40: false,
      genderMale: false,
    });
    expect(highRisk.score).toBe(6);
    expect(highRisk.risk).toBe('HIGH');
  });

  it('estimates Cormack-Lehane grade and POGO percentage based on predictors', () => {
    // Normal: Mallampati I, TMD 7.5cm, ULBT 1, normal mobility -> Grade 1, 100% POGO
    const normalView = estimateGlotticView('CLASS_I', 7.5, 'CLASS_1', 45);
    expect(normalView.cormack).toBe('GRADE_1');
    expect(normalView.pogoPct).toBe(100);

    // Severe: Mallampati IV, TMD 3.8cm, ULBT 3, restricted mobility -> Grade 4, 0% POGO
    const severeView = estimateGlotticView('CLASS_IV', 3.8, 'CLASS_3', 15);
    expect(severeView.cormack).toBe('GRADE_4');
    expect(severeView.pogoPct).toBe(0);
  });

  it('evaluates normal airway for routine Plan A induction', () => {
    const normal = DIFFICULT_AIRWAY_PRESETS[0];
    const result = evaluateDifficultAirway(normal.anatomy, normal.stopBang, normal.dasState);

    expect(result.difficultIntubationRisk).toBe('LOW');
    expect(result.difficultMaskVentilationRisk).toBe('LOW');
    expect(result.primaryStrategy).toBe('ROUTINE_PLAN_A');
    expect(result.dasAlgorithmStep).toBe('PLAN_A');
    expect(result.isCicoActive).toBe(false);
  });

  it('identifies morbid obesity and difficult mask ventilation requiring Video Laryngoscopy', () => {
    const obesity = DIFFICULT_AIRWAY_PRESETS[1];
    const result = evaluateDifficultAirway(obesity.anatomy, obesity.stopBang, obesity.dasState);

    expect(result.stopBangRisk).toBe('HIGH');
    expect(result.difficultMaskVentilationRisk).toBe('HIGH');
    expect(result.difficultIntubationRisk).toBe('HIGH');
    expect(result.primaryStrategy).toBe('VIDEO_LARYNGOSCOPY_FIRST_LINE');
    expect(result.recommendedEquipment.some((e) => e.includes('Video Laryngoscope'))).toBe(true);
  });

  it('mandates Awake Tracheal Intubation (ATI) for Ludwig angina with severe trismus', () => {
    const ludwig = DIFFICULT_AIRWAY_PRESETS[2];
    const result = evaluateDifficultAirway(ludwig.anatomy, ludwig.stopBang, ludwig.dasState);

    expect(result.difficultIntubationRisk).toBe('CRITICAL');
    expect(result.primaryStrategy).toBe('AWAKE_TRACHEAL_INTUBATION');
    expect(result.topicalizationProtocol).toBeDefined();
    expect(result.topicalizationProtocol?.length).toBeGreaterThanOrEqual(4);
    expect(result.recommendedEquipment.some((e) => e.includes('Fiberoptic'))).toBe(true);
  });

  it('flags cervical spine trauma with absolute contraindication to neck extension', () => {
    const cSpine = DIFFICULT_AIRWAY_PRESETS[4];
    const result = evaluateDifficultAirway(cSpine.anatomy, cSpine.stopBang, cSpine.dasState);

    expect(result.difficultIntubationFactors.some((f) => f.includes('Unstable Cervical Spine'))).toBe(true);
    expect(result.primaryStrategy).toBe('VIDEO_LARYNGOSCOPY_FIRST_LINE');
  });

  it('progresses DAS 2015 algorithm from Plan A failure (3 attempts) to Plan B SAD', () => {
    const sadRescue = DIFFICULT_AIRWAY_PRESETS[6];
    const result = evaluateDifficultAirway(sadRescue.anatomy, sadRescue.stopBang, sadRescue.dasState);

    expect(result.dasAlgorithmStep).toBe('PLAN_B');
    expect(result.dasActionPrompt).toContain('Plan B Active');
    expect(result.dasActionPrompt).toContain('Supraglottic Airway Device');
  });

  it('triggers emergency CICO and front-of-neck access when Plan C fails', () => {
    const cico = DIFFICULT_AIRWAY_PRESETS[7];
    const result = evaluateDifficultAirway(cico.anatomy, cico.stopBang, cico.dasState);

    expect(result.dasAlgorithmStep).toBe('PLAN_D_CICO');
    expect(result.isCicoActive).toBe(true);
    expect(result.dasActionPrompt).toContain('DECLARE CICO');
    expect(result.dasActionPrompt).toContain('Scalpel-Bougie-Tube');
    expect(result.clinicalAlerts.some((a) => a.includes('CICO'))).toBe(true);
  });
});
