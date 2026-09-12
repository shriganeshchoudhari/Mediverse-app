import {
  evaluateAirwayMechanics,
  evaluateDynamicHyperinflation,
  evaluateAsthmaPharmacotherapy,
  performAsthmaEvaluation,
  calculateAsthmaPbwKg,
  ASTHMA_PRESETS,
  AsthmaPatientInput,
} from '../../.gemini/skills/StatusAsthmaticusMechanicsEngine';

describe('StatusAsthmaticusMechanicsEngine', () => {
  const baseInput: AsthmaPatientInput = {
    patientAgeYears: 25,
    patientWeightKg: 70,
    heightCm: 175,
    gender: 'MALE',
    respiratoryRateBpm: 24,
    oxygenSaturationPercent: 94,
    fractionInspiredO2: 0.21,
    peakExpiratoryFlowLMin: 350,
    baselinePredictedPefLMin: 550,
    dyspneaGrade: 'CAN_SPEAK_SENTENCES',
    auscultationFindings: 'EXPIRATORY_WHEEZE',
    accessoryMuscleUse: 'NONE',
    pulsusParadoxusMmHg: 8,
    arterialPh: 7.42,
    arterialPco2MmHg: 32,
    arterialPo2MmHg: 85,
    serumPotassiumMeqL: 4.1,
    serumLactateMmolL: 1.2,
    isMechanicallyVentilated: false,
    ventilatorTidalVolumeMl: 450,
    ventilatorRespiratoryRateBpm: 12,
    inspiratoryFlowRateLMin: 80,
    appliedPeepCmH2O: 0,
    measuredPlateauPressureCmH2O: 18,
    measuredAutoPeepCmH2O: 0,
    isContinuousAlbuterolActive: false,
    isIpratropiumAdministered: false,
    isSystemicCorticosteroidGiven: false,
    isIvMagnesiumAdministered: false,
    isTerbutalineOrEpiGiven: false,
    isHelioxActive: false,
  };

  describe('calculateAsthmaPbwKg', () => {
    it('calculates correct PBW for adult male and female', () => {
      const malePbw = calculateAsthmaPbwKg(178, 'MALE'); // ~73 kg
      const femalePbw = calculateAsthmaPbwKg(165, 'FEMALE'); // ~57 kg
      expect(malePbw).toBe(73);
      expect(femalePbw).toBe(57);
    });
  });

  describe('evaluateAirwayMechanics', () => {
    it('identifies mild/moderate asthma when speech and PEF are preserved', () => {
      const res = evaluateAirwayMechanics(baseInput);
      expect(res.severityGrade).toBe('MILD_MODERATE');
      expect(res.hypercapnicArrestRisk).toBe('LOW');
      expect(res.pefPercentPredicted).toBe(64);
    });

    it('identifies severe asthma when monosyllabic speech and severe accessory muscle use occur', () => {
      const severeInput: AsthmaPatientInput = {
        ...baseInput,
        peakExpiratoryFlowLMin: 180,
        dyspneaGrade: 'CAN_SPEAK_WORDS_ONLY',
        accessoryMuscleUse: 'SEVERE_STERNOCLEIDOMASTOID',
        pulsusParadoxusMmHg: 16,
      };
      const res = evaluateAirwayMechanics(severeInput);
      expect(res.severityGrade).toBe('SEVERE');
    });

    it('triggers Life-Threatening Silent Chest and catastrophic hypercapnic crossover', () => {
      const arrestInput: AsthmaPatientInput = {
        ...baseInput,
        peakExpiratoryFlowLMin: 100,
        auscultationFindings: 'SILENT_CHEST',
        dyspneaGrade: 'SILENT_EXHAUSTED',
        arterialPco2MmHg: 52, // Critical PaCO2 elevation
      };
      const res = evaluateAirwayMechanics(arrestInput);
      expect(res.severityGrade).toBe('LIFE_THREATENING_SILENT_CHEST');
      expect(res.hypercapnicArrestRisk).toBe('IMMINENT_CRITICAL');
    });
  });

  describe('evaluateDynamicHyperinflation', () => {
    it('calculates I:E ratio and flags severe cardiovascular collapse with Auto-PEEP >= 15', () => {
      const ventInput: AsthmaPatientInput = {
        ...baseInput,
        isMechanicallyVentilated: true,
        ventilatorRespiratoryRateBpm: 20,
        ventilatorTidalVolumeMl: 500,
        inspiratoryFlowRateLMin: 60,
        appliedPeepCmH2O: 8,
        measuredAutoPeepCmH2O: 16,
      };
      const res = evaluateDynamicHyperinflation(ventInput);
      expect(res.totalPeepCmH2O).toBe(24);
      expect(res.dynamicHyperinflationSeverity).toBe('SEVERE_CARDIOVASCULAR_COLLAPSE');
      expect(res.circuitDisconnectDirective).toContain('EMERGENCY CIRCUIT DISCONNECT MANDATORY');
    });
  });

  describe('evaluateAsthmaPharmacotherapy', () => {
    it('flags hypokalemia precaution when beta-agonist therapy drops K+ < 3.2 mEq/L', () => {
      const lowKInput: AsthmaPatientInput = {
        ...baseInput,
        isContinuousAlbuterolActive: true,
        serumPotassiumMeqL: 2.9,
      };
      const res = evaluateAsthmaPharmacotherapy(lowKInput);
      expect(res.sabaTitration.hypokalemiaPrecaution).toContain('CRITICAL ALERT: Serum K+ < 3.2 mEq/L');
    });
  });

  describe('performAsthmaEvaluation & Presets', () => {
    it('executes evaluation across all 4 clinical presets successfully', () => {
      ASTHMA_PRESETS.forEach((preset) => {
        const evalRes = performAsthmaEvaluation(preset.inputs);
        expect(evalRes.airwayMechanics).toBeDefined();
        expect(evalRes.hyperinflation).toBeDefined();
        expect(evalRes.pharmacotherapy).toBeDefined();
        expect(evalRes.immediateActionDirectives.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('Preset 1 triggers Hypercapnic Crossover and Silent Chest interlocks', () => {
      const p1 = ASTHMA_PRESETS[0];
      const evalRes = performAsthmaEvaluation(p1.inputs);
      const hasCrossover = evalRes.criticalSafetyInterlocks.some((s) => s.includes('HYPERCAPNIC CROSSOVER'));
      const hasSilentChest = evalRes.criticalSafetyInterlocks.some((s) => s.includes('SILENT CHEST TRAP'));
      expect(hasCrossover).toBe(true);
      expect(hasSilentChest).toBe(true);
    });

    it('Preset 2 triggers Emergency Circuit Disconnect interlock', () => {
      const p2 = ASTHMA_PRESETS[1];
      const evalRes = performAsthmaEvaluation(p2.inputs);
      const hasDisconnect = evalRes.criticalSafetyInterlocks.some((s) => s.includes('CIRCUIT DISCONNECT MANDATORY'));
      expect(hasDisconnect).toBe(true);
    });
  });
});
