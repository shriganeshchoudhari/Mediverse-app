import {
  evaluateEcgRisk,
  evaluateBicarbonateTherapy,
  performTcaEvaluation,
  TCA_PRESETS,
  TcaPatientInput,
} from '../../.gemini/skills/TcaToxicityBicarbonateEngine';

describe('TcaToxicityBicarbonateEngine', () => {
  const baseInput: TcaPatientInput = {
    patientAgeYears: 30,
    patientWeightKg: 70,
    ingestedAgent: 'AMITRIPTYLINE',
    estimatedDoseMg: 500,
    hoursPostIngestion: 2,
    coIngestants: 'NONE',
    heartRateBpm: 96,
    qrsDurationMs: 88,
    terminalRWaveAvrMm: 1.5,
    rToSRatioAvr: 0.4,
    qtcIntervalMs: 430,
    systolicBpMmHg: 118,
    diastolicBpMmHg: 74,
    gcsScore: 15,
    hasActiveSeizures: false,
    pupilDiameterMm: 4,
    bowelSounds: 'NORMAL',
    axillaryMoisture: 'NORMAL',
    arterialPh: 7.38,
    serumBicarbonateMeqL: 24,
    serumPotassiumMeqL: 4.2,
    serumSodiumMeqL: 140,
    isSodiumBicarbonateBolusGiven: false,
    bicarbonateBolusDoseMeq: 0,
    isBicarbonateInfusionActive: false,
    bicarbonateInfusionRateMlH: 0,
    isPhysostigmineAttempted: false,
    antiarrhythmicGiven: 'NONE',
    anticonvulsantGiven: 'NONE',
    vasopressorActive: 'NONE',
    isLipidRescueActive: false,
  };

  describe('evaluateEcgRisk', () => {
    it('identifies low risk when QRS < 100 ms and aVR terminal R < 3 mm', () => {
      const res = evaluateEcgRisk(baseInput);
      expect(res.qrsRiskCategory).toBe('LOW');
      expect(res.isQrsProlonged).toBe(false);
      expect(res.isAvrTerminalRWaveProminent).toBe(false);
      expect(res.seizureRiskPercent).toBe(5);
    });

    it('identifies intermediate seizure risk when QRS is between 100 and 160 ms', () => {
      const qrsInput: TcaPatientInput = {
        ...baseInput,
        qrsDurationMs: 124,
      };
      const res = evaluateEcgRisk(qrsInput);
      expect(res.qrsRiskCategory).toBe('INTERMEDIATE_SEIZURE_RISK');
      expect(res.seizureRiskPercent).toBe(34);
    });

    it('identifies high ventricular arrhythmia risk when QRS >= 160 ms', () => {
      const vtInput: TcaPatientInput = {
        ...baseInput,
        qrsDurationMs: 172,
      };
      const res = evaluateEcgRisk(vtInput);
      expect(res.qrsRiskCategory).toBe('HIGH_VENTRICULAR_ARRHYTHMIA_RISK');
      expect(res.ventricularArrhythmiaRiskPercent).toBe(52);
    });

    it('flags critical terminal R wave in aVR when >= 3 mm and R/S >= 0.7', () => {
      const avrInput: TcaPatientInput = {
        ...baseInput,
        terminalRWaveAvrMm: 4.5,
        rToSRatioAvr: 1.2,
      };
      const res = evaluateEcgRisk(avrInput);
      expect(res.isAvrTerminalRWaveProminent).toBe(true);
      expect(res.terminalAvrSignificance).toContain('CRITICAL aVR SIGN');
    });
  });

  describe('evaluateBicarbonateTherapy', () => {
    it('calculates 1.5 mEq/kg bolus dose (~105 mEq for 70 kg)', () => {
      const res = evaluateBicarbonateTherapy(baseInput);
      expect(res.recommendedBolusMeq).toBe(105);
      expect(res.targetPhRange).toBe('7.50 - 7.55');
    });

    it('flags hypokalemia guardrail alert when K+ < 3.5 mEq/L', () => {
      const lowKInput: TcaPatientInput = {
        ...baseInput,
        serumPotassiumMeqL: 3.1,
      };
      const res = evaluateBicarbonateTherapy(lowKInput);
      expect(res.potassiumGuardrailAlert).toContain('HYPOKALEMIA GUARDRAIL TRIPPED');
    });

    it('identifies excessive alkalemic hazard when pH > 7.55', () => {
      const highPhInput: TcaPatientInput = {
        ...baseInput,
        arterialPh: 7.58,
      };
      const res = evaluateBicarbonateTherapy(highPhInput);
      expect(res.currentPhStatus).toBe('EXCESSIVE_ALKALEMIC_HAZARD');
    });
  });

  describe('performTcaEvaluation & Presets', () => {
    it('evaluates all 4 clinical presets successfully', () => {
      TCA_PRESETS.forEach((preset) => {
        const res = performTcaEvaluation(preset.inputs);
        expect(res.ecgRisk).toBeDefined();
        expect(res.bicarbonate).toBeDefined();
        expect(res.safetyInterlocks.immediateActionDirectives.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('Preset 1 triggers QRS widening directives for Amitriptyline overdose', () => {
      const p1 = TCA_PRESETS[0];
      const res = performTcaEvaluation(p1.inputs);
      expect(res.ecgRisk.isQrsProlonged).toBe(true);
      const hasBicarbDirective = res.safetyInterlocks.immediateActionDirectives.some((d) =>
        d.includes('Sodium Bicarbonate')
      );
      expect(hasBicarbDirective).toBe(true);
    });

    it('Preset 2 triggers Seizure Acidosis Malignant Cycle alert', () => {
      const p2 = TCA_PRESETS[1];
      const res = performTcaEvaluation(p2.inputs);
      const hasCycleAlert = res.safetyInterlocks.criticalSafetyAlerts.some((a) =>
        a.includes('SEIZURE ACIDOSIS MALIGNANT CYCLE')
      );
      expect(hasCycleAlert).toBe(true);
    });

    it('Preset 3 triggers absolute Physostigmine contraindication trap', () => {
      const p3 = TCA_PRESETS[2];
      const res = performTcaEvaluation(p3.inputs);
      const hasPhysostigmineTrap = res.safetyInterlocks.criticalSafetyAlerts.some((a) =>
        a.includes('LETHAL ANTIDOTE TRAP TRIPPED')
      );
      expect(hasPhysostigmineTrap).toBe(true);
    });

    it('Preset 4 triggers Excessive Alkalemia & Hypokalemia alerts', () => {
      const p4 = TCA_PRESETS[3];
      const res = performTcaEvaluation(p4.inputs);
      const hasAlkalemiaAlert = res.safetyInterlocks.criticalSafetyAlerts.some((a) =>
        a.includes('EXCESSIVE ALKALEMIA WARNING')
      );
      expect(hasAlkalemiaAlert).toBe(true);
      expect(res.bicarbonate.potassiumGuardrailAlert).not.toBeNull();
    });
  });
});
