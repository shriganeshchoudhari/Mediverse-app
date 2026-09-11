import {
  calculateKdigoStage,
  calculateFractionalExcretion,
  calculateRenalAnginaIndex,
  evaluateFurosemideStressTest,
  calculateFluidOverload,
  performComprehensiveAkiEvaluation
} from '../../.gemini/skills/AkiKdigoFstEngine';

describe('AkiKdigoFstEngine', () => {
  describe('calculateKdigoStage', () => {
    it('correctly stages Stage 1 AKI based on Cr delta >= 0.3 mg/dL within 48 hours', () => {
      const result = calculateKdigoStage({
        baselineCreatinineMgDl: 1.0,
        currentCreatinineMgDl: 1.35,
        hoursOverWhichCreatinineRose: 24,
        urineOutputMlKgH: 0.8,
        oliguriaDurationHours: 0,
        rrtInitiated: false
      });
      expect(result.overallStage).toBe('STAGE_1');
      expect(result.creatinineStage).toBe('STAGE_1');
      expect(result.absoluteCreatinineDelta).toBe(0.35);
    });

    it('correctly stages Stage 2 AKI based on fold increase >= 2.0x', () => {
      const result = calculateKdigoStage({
        baselineCreatinineMgDl: 1.0,
        currentCreatinineMgDl: 2.2,
        hoursOverWhichCreatinineRose: 72,
        urineOutputMlKgH: 0.4,
        oliguriaDurationHours: 14,
        rrtInitiated: false
      });
      expect(result.overallStage).toBe('STAGE_2');
      expect(result.creatinineStage).toBe('STAGE_2');
      expect(result.urineOutputStage).toBe('STAGE_2');
    });

    it('correctly stages Stage 3 AKI when Cr >= 4.0 mg/dL or RRT initiated', () => {
      const result = calculateKdigoStage({
        baselineCreatinineMgDl: 1.2,
        currentCreatinineMgDl: 4.2,
        hoursOverWhichCreatinineRose: 48,
        urineOutputMlKgH: 0.2,
        oliguriaDurationHours: 26,
        rrtInitiated: true
      });
      expect(result.overallStage).toBe('STAGE_3');
      expect(result.stageCriteriaMetDescription).toContain('Renal replacement therapy initiated');
    });
  });

  describe('calculateFractionalExcretion', () => {
    it('identifies prerenal azotemia via FeNa < 1% in diuretic-naive patient', () => {
      const result = calculateFractionalExcretion({
        serumSodiumMeqL: 140,
        urineSodiumMeqL: 14,
        serumCreatinineMgDl: 1.8,
        urineCreatinineMgDl: 120,
        bloodUreaNitrogenMgDl: 54,
        urineUreaNitrogenMgDl: 600,
        urineOsmolalityMosmKg: 650,
        urineSpecificGravity: 1.024,
        recentLoopDiureticUse: false
      });
      expect(result.feNaPercent).toBeLessThan(1.0);
      expect(result.etiologyClassification).toBe('PRERENAL_AZOTEMIA');
      expect(result.primaryDiagnosticBiomarker).toBe('FeNa');
    });

    it('solves the diuretic pitfall: FeNa is falsely elevated (2.4%) but FeUrea < 35% confirms prerenal state', () => {
      const result = calculateFractionalExcretion({
        serumSodiumMeqL: 136,
        urineSodiumMeqL: 52,
        serumCreatinineMgDl: 2.1,
        urineCreatinineMgDl: 68,
        bloodUreaNitrogenMgDl: 48,
        urineUreaNitrogenMgDl: 420,
        urineOsmolalityMosmKg: 420,
        urineSpecificGravity: 1.018,
        recentLoopDiureticUse: true // On furosemide!
      });
      expect(result.feNaPercent).toBeGreaterThan(1.0); // Falsely elevated FeNa
      expect(result.feUreaPercent).toBeLessThan(35.0); // True prerenal FeUrea
      expect(result.primaryDiagnosticBiomarker).toBe('FeUrea');
      expect(result.etiologyClassification).toBe('PRERENAL_AZOTEMIA');
      expect(result.differentiationRationale).toContain('confirming Prerenal Azotemia despite recent loop diuretic exposure');
    });

    it('identifies intrinsic ATN via FeUrea > 50% in diuretic-exposed patient', () => {
      const result = calculateFractionalExcretion({
        serumSodiumMeqL: 142,
        urineSodiumMeqL: 75,
        serumCreatinineMgDl: 3.2,
        urineCreatinineMgDl: 40,
        bloodUreaNitrogenMgDl: 60,
        urineUreaNitrogenMgDl: 450,
        urineOsmolalityMosmKg: 310,
        urineSpecificGravity: 1.010,
        recentLoopDiureticUse: true
      });
      expect(result.feUreaPercent).toBeGreaterThan(50.0);
      expect(result.etiologyClassification).toBe('INTRINSIC_ATN');
    });
  });

  describe('calculateRenalAnginaIndex', () => {
    it('accurately identifies Renal Angina Positive (score >= 8) in ventilated patient with fluid overload', () => {
      const result = calculateRenalAnginaIndex({
        patientRiskTier: 'VENTILATED_OR_VASOPRESSOR', // Risk = 5
        baselineCreatinineMgDl: 1.0,
        currentCreatinineMgDl: 1.6, // fold 1.6 -> injury = 2 (5 * 2 = 10)
        cumulativeFluidOverloadPercent: 6.0
      });
      expect(result.totalScore).toBe(10);
      expect(result.isRenalAnginaPositive).toBe(true);
      expect(result.day3SevereAkiRiskTier).toBe('HIGH_PREDICTIVE');
    });

    it('accurately identifies Renal Angina Negative (score < 8) in general ICU patient without injury', () => {
      const result = calculateRenalAnginaIndex({
        patientRiskTier: 'GENERAL_ICU', // Risk = 1
        baselineCreatinineMgDl: 0.9,
        currentCreatinineMgDl: 1.0,
        cumulativeFluidOverloadPercent: 2.0
      });
      expect(result.totalScore).toBe(1);
      expect(result.isRenalAnginaPositive).toBe(false);
    });
  });

  describe('evaluateFurosemideStressTest', () => {
    it('blocks FST execution when patient is not confirmed to be euvolemic/resuscitated', () => {
      const result = evaluateFurosemideStressTest({
        patientWeightKg: 70,
        diureticExposure: 'DIURETIC_NAIVE',
        isPatientEuvolemicResuscitated: false,
        cumulativeTwoHourUrineMl: 0
      });
      expect(result.isSafetyInterlockPassed).toBe(false);
      expect(result.fstResponsiveness).toBe('INVALID_PRETEST_CONDITIONS');
      expect(result.safetyInterlockWarning).toContain('SAFETY CONTRAINDICATION');
    });

    it('calculates 1.0 mg/kg dose for naive and 1.5 mg/kg for prior diuretic user', () => {
      const naive = evaluateFurosemideStressTest({
        patientWeightKg: 80,
        diureticExposure: 'DIURETIC_NAIVE',
        isPatientEuvolemicResuscitated: true,
        cumulativeTwoHourUrineMl: 350
      });
      expect(naive.recommendedFurosemideDoseMg).toBe(80);

      const user = evaluateFurosemideStressTest({
        patientWeightKg: 80,
        diureticExposure: 'PRIOR_LOOP_DIURETIC_USER',
        isPatientEuvolemicResuscitated: true,
        cumulativeTwoHourUrineMl: 350
      });
      expect(user.recommendedFurosemideDoseMg).toBe(120);
    });

    it('identifies FST Responsive (>= 200 mL in 2h) with low progression risk', () => {
      const result = evaluateFurosemideStressTest({
        patientWeightKg: 70,
        diureticExposure: 'DIURETIC_NAIVE',
        isPatientEuvolemicResuscitated: true,
        cumulativeTwoHourUrineMl: 420
      });
      expect(result.fstResponsiveness).toBe('RESPONSIVE');
      expect(result.progressionToStage3OrRrtProbabilityPercent).toBeLessThan(15);
      expect(result.therapeuticFluidReplacementGuidance).toContain('Replace urine output mL-for-mL');
    });

    it('identifies FST Non-Responsive (< 200 mL in 2h) with ~87% dialysis risk', () => {
      const result = evaluateFurosemideStressTest({
        patientWeightKg: 70,
        diureticExposure: 'DIURETIC_NAIVE',
        isPatientEuvolemicResuscitated: true,
        cumulativeTwoHourUrineMl: 80
      });
      expect(result.fstResponsiveness).toBe('NON_RESPONSIVE');
      expect(result.progressionToStage3OrRrtProbabilityPercent).toBeGreaterThan(80);
      expect(result.nephrologyEscalationGuidance).toContain('Consult Nephrology immediately');
    });
  });

  describe('calculateFluidOverload', () => {
    it('flags critical fluid overload when FO% >= 15%', () => {
      const result = calculateFluidOverload({
        totalFluidIntakeLiters: 20.0,
        totalFluidOutputLiters: 8.0, // net 12.0 L
        hospitalAdmissionWeightKg: 75 // 12 / 75 = 16%
      });
      expect(result.fluidOverloadPercent).toBe(16.0);
      expect(result.overloadCategory).toBe('CRITICAL_SEVERE');
      expect(result.pathophysiologicImpact).toContain('congestive nephropathy');
    });
  });

  describe('performComprehensiveAkiEvaluation', () => {
    it('synthesizes complete case report and provides teaching pearls', () => {
      const report = performComprehensiveAkiEvaluation({
        kdigoInput: {
          baselineCreatinineMgDl: 1.0,
          currentCreatinineMgDl: 3.4,
          hoursOverWhichCreatinineRose: 48,
          urineOutputMlKgH: 0.15,
          oliguriaDurationHours: 18,
          rrtInitiated: false
        },
        fractionalExcretionInput: {
          serumSodiumMeqL: 142,
          urineSodiumMeqL: 68,
          serumCreatinineMgDl: 3.4,
          urineCreatinineMgDl: 42,
          bloodUreaNitrogenMgDl: 75,
          urineUreaNitrogenMgDl: 380,
          urineOsmolalityMosmKg: 310,
          urineSpecificGravity: 1.010,
          recentLoopDiureticUse: false
        },
        renalAnginaInput: {
          patientRiskTier: 'VENTILATED_OR_VASOPRESSOR',
          baselineCreatinineMgDl: 1.0,
          currentCreatinineMgDl: 3.4,
          cumulativeFluidOverloadPercent: 12.8
        },
        fstInput: {
          patientWeightKg: 82,
          diureticExposure: 'DIURETIC_NAIVE',
          isPatientEuvolemicResuscitated: true,
          cumulativeTwoHourUrineMl: 45
        },
        fluidOverloadInput: {
          totalFluidIntakeLiters: 16.5,
          totalFluidOutputLiters: 6.0,
          hospitalAdmissionWeightKg: 82
        }
      });

      expect(report.kdigo.overallStage).toBe('STAGE_3');
      expect(report.differentiation.etiologyClassification).toBe('INTRINSIC_ATN');
      expect(report.fst.fstResponsiveness).toBe('NON_RESPONSIVE');
      expect(report.unifiedExecutiveSummary).toContain('CRITICAL AKI / IMMINENT RRT INDICATION');
      expect(report.clinicalPearls.length).toBeGreaterThanOrEqual(5);
    });
  });
});
