/**
 * HfncRoxFailureEngine.test.ts
 * Unit tests for High-Flow Nasal Cannula (HFNC) Mechanics, ROX Index Kinetics & P-SILI Evaluation.
 */

import {
  calculateRoxIndex,
  calculateRoxHrIndex,
  classifyRoxFailureRisk,
  calculateHfncMechanics,
  evaluatePsiliRisk,
  analyzeRoxTrajectory,
  HFNC_SCENARIOS,
} from '../../.gemini/skills/HfncRoxFailureEngine';

describe('HfncRoxFailureEngine', () => {
  describe('calculateRoxIndex & calculateRoxHrIndex', () => {
    it('calculates ROX index correctly with fractional FiO2', () => {
      // SpO2 95%, FiO2 0.50, RR 20 => (95 / 0.50) / 20 = 190 / 20 = 9.5
      const rox = calculateRoxIndex(95, 0.50, 20);
      expect(rox).toBe(9.5);
    });

    it('handles percentage FiO2 input correctly', () => {
      // FiO2 passed as 50 (%) instead of 0.50
      const rox = calculateRoxIndex(95, 50, 20);
      expect(rox).toBe(9.5);
    });

    it('handles severe hypoxemia with low ROX', () => {
      // SpO2 88%, FiO2 1.0 (100%), RR 36 => (88 / 1.0) / 36 = 2.44
      const rox = calculateRoxIndex(88, 1.0, 36);
      expect(rox).toBe(2.44);
    });

    it('returns 0 for invalid non-positive respiratory rate', () => {
      expect(calculateRoxIndex(95, 0.4, 0)).toBe(0);
      expect(calculateRoxIndex(95, 0.4, -5)).toBe(0);
    });

    it('calculates modified ROX-HR index correctly', () => {
      // ROX = 4.88, HR = 100 => (4.88 / 100) * 100 = 4.88
      const roxHr = calculateRoxHrIndex(4.88, 100);
      expect(roxHr).toBe(4.88);

      // ROX = 3.0, HR = 120 => (3.0 / 120) * 100 = 2.5
      expect(calculateRoxHrIndex(3.0, 120)).toBe(2.5);
      expect(calculateRoxHrIndex(3.0, 0)).toBe(0);
    });
  });

  describe('classifyRoxFailureRisk (Roca Criteria)', () => {
    it('correctly classifies early success at 2 hours (ROX >= 4.88)', () => {
      const result = classifyRoxFailureRisk(5.2, 2, 85);
      expect(result.level).toBe('success');
      expect(result.intubationRecommended).toBe(false);
      expect(result.thresholdUsed).toBe(4.88);
    });

    it('classifies intermediate grey zone at 2 hours (3.85 <= ROX < 4.88)', () => {
      const result = classifyRoxFailureRisk(4.1, 2, 95);
      expect(result.level).toBe('intermediate');
      expect(result.intubationRecommended).toBe(false);
    });

    it('classifies high risk at 2 hours (2.85 <= ROX < 3.85)', () => {
      const result = classifyRoxFailureRisk(3.2, 2, 110);
      expect(result.level).toBe('high_risk');
      expect(result.intubationRecommended).toBe(false);
    });

    it('classifies critical failure at 2 hours (ROX < 2.85)', () => {
      const result = classifyRoxFailureRisk(2.5, 2, 120);
      expect(result.level).toBe('very_high_risk');
      expect(result.intubationRecommended).toBe(true);
    });

    it('applies Roca 6-hour cutoff < 3.47 for failure', () => {
      const resultFail = classifyRoxFailureRisk(3.2, 6, 115);
      expect(resultFail.level).toBe('very_high_risk');
      expect(resultFail.intubationRecommended).toBe(true);
      expect(resultFail.thresholdUsed).toBe(3.47);

      const resultIntermediate = classifyRoxFailureRisk(4.0, 6, 90);
      expect(resultIntermediate.level).toBe('intermediate');
      expect(resultIntermediate.intubationRecommended).toBe(false);
    });

    it('applies 12-hour cutoff < 3.85 for definitive failure', () => {
      const resultFail = classifyRoxFailureRisk(3.7, 12, 100);
      expect(resultFail.level).toBe('very_high_risk');
      expect(resultFail.intubationRecommended).toBe(true);
      expect(resultFail.thresholdUsed).toBe(3.85);

      const resultSuccess = classifyRoxFailureRisk(6.5, 12, 75);
      expect(resultSuccess.level).toBe('success');
      expect(resultSuccess.intubationRecommended).toBe(false);
    });
  });

  describe('calculateHfncMechanics (PEEP, Washout, Entrainment)', () => {
    it('generates higher PEEP with closed mouth compared to open mouth', () => {
      const closed = calculateHfncMechanics({
        flowRateLpm: 60,
        setFio2: 0.60,
        patientPeakInspiratoryFlowLpm: 50,
        mouthOpen: false,
        temperatureC: 37,
        patientWeightKg: 70,
      });

      const open = calculateHfncMechanics({
        flowRateLpm: 60,
        setFio2: 0.60,
        patientPeakInspiratoryFlowLpm: 50,
        mouthOpen: true,
        temperatureC: 37,
        patientWeightKg: 70,
      });

      expect(closed.generatedPeepCmH2o).toBeGreaterThan(open.generatedPeepCmH2o);
      expect(closed.generatedPeepCmH2o).toBeCloseTo(5.1, 0.5);
      expect(open.generatedPeepCmH2o).toBeCloseTo(2.7, 0.5);
    });

    it('clears anatomical dead space progressively as flow increases', () => {
      const lowFlow = calculateHfncMechanics({
        flowRateLpm: 20,
        setFio2: 0.5,
        patientPeakInspiratoryFlowLpm: 40,
        mouthOpen: false,
        temperatureC: 37,
        patientWeightKg: 70,
      });

      const highFlow = calculateHfncMechanics({
        flowRateLpm: 60,
        setFio2: 0.5,
        patientPeakInspiratoryFlowLpm: 40,
        mouthOpen: false,
        temperatureC: 37,
        patientWeightKg: 70,
      });

      expect(highFlow.deadSpaceWashoutPercent).toBeGreaterThan(lowFlow.deadSpaceWashoutPercent);
      expect(highFlow.deadSpaceWashoutPercent).toBeGreaterThanOrEqual(85);
      expect(highFlow.effectiveMinuteVentilationReductionLpm).toBeGreaterThan(lowFlow.effectiveMinuteVentilationReductionLpm);
    });

    it('detects air entrainment dilution when patient PIF exceeds cannula flow', () => {
      const diluted = calculateHfncMechanics({
        flowRateLpm: 40,
        setFio2: 0.80,
        patientPeakInspiratoryFlowLpm: 90, // PIF exceeds flow by 50 L/min
        mouthOpen: true,
        temperatureC: 37,
        patientWeightKg: 70,
      });

      expect(diluted.airEntrainedLpm).toBe(50);
      expect(diluted.actualDeliveredFio2).toBeLessThan(0.80);
      expect(diluted.fio2Diluted).toBe(true);

      // Verify matching flow prevents dilution
      const matched = calculateHfncMechanics({
        flowRateLpm: 90,
        setFio2: 0.80,
        patientPeakInspiratoryFlowLpm: 90,
        mouthOpen: true,
        temperatureC: 37,
        patientWeightKg: 70,
      });
      expect(matched.airEntrainedLpm).toBe(0);
      expect(matched.actualDeliveredFio2).toBe(0.80);
      expect(matched.fio2Diluted).toBe(false);
    });

    it('reports correct humidity metrics according to gas temperature', () => {
      const opt = calculateHfncMechanics({
        flowRateLpm: 50,
        setFio2: 0.5,
        patientPeakInspiratoryFlowLpm: 45,
        mouthOpen: false,
        temperatureC: 37,
        patientWeightKg: 70,
      });
      expect(opt.absoluteHumidityMgL).toBe(44);

      const cooler = calculateHfncMechanics({
        flowRateLpm: 50,
        setFio2: 0.5,
        patientPeakInspiratoryFlowLpm: 45,
        mouthOpen: false,
        temperatureC: 31,
        patientWeightKg: 70,
      });
      expect(cooler.absoluteHumidityMgL).toBe(32);
    });
  });

  describe('evaluatePsiliRisk (Patient Self-Inflicted Lung Injury)', () => {
    it('detects low P-SILI risk in calm patient with normal tidal volume', () => {
      const report = evaluatePsiliRisk({
        respiratoryRate: 18,
        tidalVolumeMlPerKgPbw: 6.0,
        accessoryMuscleUse: 'none',
      });

      expect(report.psiliRiskLevel).toBe('Low');
      expect(report.pendelluftRisk).toBe(false);
      expect(report.dynamicTranspulmonaryStrain).toBe('Minimal');
    });

    it('identifies severe P-SILI risk and pendelluft strain with vigorous inspiratory drive', () => {
      const report = evaluatePsiliRisk({
        respiratoryRate: 34,
        tidalVolumeMlPerKgPbw: 11.0,
        accessoryMuscleUse: 'severe',
      });

      expect(report.psiliRiskLevel).toBe('Severe');
      expect(report.pendelluftRisk).toBe(true);
      expect(report.alveolarShearStressWarning).toBe(true);
      expect(report.dynamicTranspulmonaryStrain).toBe('Critical');
      expect(report.estimatedDeltaPesCmH2o).toBeGreaterThanOrEqual(18);
    });
  });

  describe('analyzeRoxTrajectory', () => {
    it('identifies an improving trajectory with low failure risk', () => {
      const timepoints = [
        { hour: 0, spo2: 89, fio2: 0.80, respiratoryRate: 32, heartRate: 110, flowRateLpm: 60, roxIndex: 3.48 },
        { hour: 2, spo2: 94, fio2: 0.70, respiratoryRate: 24, heartRate: 92, flowRateLpm: 60, roxIndex: 5.60 },
        { hour: 6, spo2: 96, fio2: 0.50, respiratoryRate: 20, heartRate: 80, flowRateLpm: 50, roxIndex: 9.60 },
      ];

      const analysis = analyzeRoxTrajectory(timepoints);
      expect(analysis.trajectoryTrend).toBe('improving');
      expect(analysis.deltaRox).toBeGreaterThan(0.5);
      expect(analysis.failureProbabilityPercent).toBeLessThan(25);
      expect(analysis.intubationUrgency).toBe('None');
    });

    it('identifies a deteriorating trajectory triggering emergency intubation', () => {
      const timepoints = [
        { hour: 0, spo2: 90, fio2: 0.70, respiratoryRate: 30, heartRate: 115, flowRateLpm: 60, roxIndex: 4.29 },
        { hour: 2, spo2: 88, fio2: 0.90, respiratoryRate: 34, heartRate: 125, flowRateLpm: 60, roxIndex: 2.88 },
        { hour: 6, spo2: 86, fio2: 1.00, respiratoryRate: 38, heartRate: 135, flowRateLpm: 60, roxIndex: 2.26 },
      ];

      const analysis = analyzeRoxTrajectory(timepoints);
      expect(analysis.trajectoryTrend).toBe('deteriorating');
      expect(analysis.deltaRox).toBeLessThan(-0.5);
      expect(analysis.failureProbabilityPercent).toBeGreaterThanOrEqual(80);
      expect(analysis.intubationUrgency).toBe('Emergency Intubation');
    });
  });

  describe('HFNC_SCENARIOS Catalog', () => {
    it('contains all 4 standard clinical scenarios', () => {
      expect(HFNC_SCENARIOS.covid_responder).toBeDefined();
      expect(HFNC_SCENARIOS.bacterial_non_responder).toBeDefined();
      expect(HFNC_SCENARIOS.post_extubation_prophylaxis).toBeDefined();
      expect(HFNC_SCENARIOS.psili_vigorous_effort).toBeDefined();
    });

    it('covid_responder demonstrates successful ROX trajectory', () => {
      const sc = HFNC_SCENARIOS.covid_responder;
      const initialRox = sc.timepoints[0].roxIndex;
      const finalRox = sc.timepoints[sc.timepoints.length - 1].roxIndex;
      expect(finalRox).toBeGreaterThan(initialRox);
      expect(finalRox).toBeGreaterThanOrEqual(4.88);
    });

    it('bacterial_non_responder demonstrates failed ROX trajectory', () => {
      const sc = HFNC_SCENARIOS.bacterial_non_responder;
      const finalRox = sc.timepoints[sc.timepoints.length - 1].roxIndex;
      expect(finalRox).toBeLessThan(3.47);
    });
  });
});
