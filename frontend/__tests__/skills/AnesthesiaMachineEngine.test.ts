/**
 * AnesthesiaMachineEngine.test.ts
 * 
 * Unit tests for Advanced Anesthesia Delivery Workstation & Volatile Vaporizer Engine
 */

import {
  calculateAgeAdjustedMAC,
  calculateAgeAdjustedN2OMAC,
  computeHypoxicGuard,
  calculateCircuitTimeConstant,
  calculateRebreathingFraction,
  calculateFAFIRatio,
  evaluateAnestheticDepth,
  calculateDantroleneProtocol,
  simulateAnesthesiaStep,
  ANESTHESIA_PRESETS,
  VOLATILE_AGENTS,
} from '../../.gemini/skills/AnesthesiaMachineEngine';

describe('AnesthesiaMachineEngine', () => {
  describe('Age-Adjusted MAC Calculations', () => {
    it('calculates baseline MAC at age 40 accurately', () => {
      expect(calculateAgeAdjustedMAC('sevoflurane', 40)).toBeCloseTo(2.05, 1);
      expect(calculateAgeAdjustedMAC('desflurane', 40)).toBeCloseTo(6.0, 1);
      expect(calculateAgeAdjustedMAC('isoflurane', 40)).toBeCloseTo(1.15, 1);
    });

    it('decreases MAC with advancing age', () => {
      const sevoYoung = calculateAgeAdjustedMAC('sevoflurane', 20);
      const sevoMiddle = calculateAgeAdjustedMAC('sevoflurane', 40);
      const sevoElderly = calculateAgeAdjustedMAC('sevoflurane', 80);

      expect(sevoYoung).toBeGreaterThan(sevoMiddle);
      expect(sevoMiddle).toBeGreaterThan(sevoElderly);
      expect(sevoElderly).toBeLessThan(1.7); // Significantly decreased in octogenarians
    });

    it('returns zero for none / TIVA', () => {
      expect(calculateAgeAdjustedMAC('none', 40)).toBe(0);
    });
  });

  describe('Link-25 Hypoxic Proportioning Guard', () => {
    it('proportions oxygen up when N2O is dialed with insufficient O2', () => {
      // User asks for 0.2 L O2 with 3.0 L N2O
      const guarded = computeHypoxicGuard(0.2, 3.0, 0);

      expect(guarded.hypoxicGuardActive).toBe(true);
      expect(guarded.o2FlowLMin).toBeGreaterThanOrEqual(0.99); // at least 1/3 of N2O
      expect(guarded.deliveredFiO2Percent).toBeGreaterThanOrEqual(24.5);
    });

    it('leaves safe gas mixtures unaltered', () => {
      // Safe mix: 2 L O2, 2 L N2O (FiO2 50%)
      const safe = computeHypoxicGuard(2.0, 2.0, 0);

      expect(safe.hypoxicGuardActive).toBe(false);
      expect(safe.o2FlowLMin).toBe(2.0);
      expect(safe.deliveredFiO2Percent).toBe(50.0);
    });
  });

  describe('Circuit Mechanics & Time Constants', () => {
    it('calculates circuit time constant tau = V / FGF', () => {
      // 5 L circuit at 5 L/min FGF -> tau = 1 min
      expect(calculateCircuitTimeConstant(5.0, 5.0)).toBe(1.0);
      // 5 L circuit at 0.5 L/min low flow -> tau = 10 min
      expect(calculateCircuitTimeConstant(5.0, 0.5)).toBe(10.0);
    });

    it('calculates rebreathing fraction based on FGF and Minute Ventilation', () => {
      // VE = 5 L/min, FGF = 1 L/min -> 80% rebreathing
      expect(calculateRebreathingFraction(1.0, 5.0)).toBe(0.8);
      // FGF >= VE -> 0% rebreathing (non-rebreathing)
      expect(calculateRebreathingFraction(6.0, 5.0)).toBe(0.0);
    });
  });

  describe('FA/FI Alveolar Uptake Kinetics', () => {
    it('demonstrates faster FA/FI rise for insoluble agents (Des > Sevo > Iso)', () => {
      const desFaFi = calculateFAFIRatio('desflurane', 2.0, 3.0, 5.0);
      const sevoFaFi = calculateFAFIRatio('sevoflurane', 2.0, 3.0, 5.0);
      const isoFaFi = calculateFAFIRatio('isoflurane', 2.0, 3.0, 5.0);

      expect(desFaFi).toBeGreaterThan(sevoFaFi);
      expect(sevoFaFi).toBeGreaterThan(isoFaFi);
    });
  });

  describe('Anesthetic Depth & Total MAC Evaluation', () => {
    it('classifies depth states according to Total MAC', () => {
      // Light / Awake (<0.3)
      const awake = evaluateAnestheticDepth('sevoflurane', 0.4, 0, 40);
      expect(awake.depthState).toBe('AWAKE');

      // Sedated (0.3 - 0.7, risk of awareness)
      const sedated = evaluateAnestheticDepth('sevoflurane', 1.0, 0, 40);
      expect(sedated.depthState).toBe('SEDATED');

      // Surgical Anesthesia (0.7 - 1.4)
      const surgical = evaluateAnestheticDepth('sevoflurane', 2.1, 0, 40);
      expect(surgical.depthState).toBe('SURGICAL_ANESTHESIA');

      // Deep Anesthesia (1.4 - 2.0)
      const deep = evaluateAnestheticDepth('sevoflurane', 3.5, 0, 40);
      expect(deep.depthState).toBe('DEEP_ANESTHESIA');
    });

    it('correctly adds N2O MAC to volatile agent MAC', () => {
      // 1.0% Sevo (~0.5 MAC) + 50% N2O (~0.5 MAC) = ~1.0 Total MAC
      const combined = evaluateAnestheticDepth('sevoflurane', 1.05, 52, 40);
      expect(combined.totalMac).toBeCloseTo(1.0, 1);
      expect(combined.depthState).toBe('SURGICAL_ANESTHESIA');
    });
  });

  describe('Dantrolene Protocol for Malignant Hyperthermia', () => {
    it('calculates correct 2.5 mg/kg loading dose and vial requirements for 70 kg adult', () => {
      const protocol = calculateDantroleneProtocol(70);

      expect(protocol.initialDoseMg).toBe(175); // 70 * 2.5
      expect(protocol.initialVialsCount).toBe(9); // ceil(175 / 20) = 9 vials
      expect(protocol.reconstitutionWaterMl).toBe(540); // 9 * 60 mL
      expect(protocol.maxDoseMg).toBe(700); // 70 * 10
    });
  });

  describe('Master Simulation Step & Crisis Modes', () => {
    const defaultMixer = {
      o2FlowLMin: 1.0,
      n2oFlowLMin: 0.0,
      airFlowLMin: 1.0,
      totalFgfLMin: 2.0,
      deliveredFiO2Percent: 60.5,
      deliveredFiN2OPercent: 0,
      hypoxicGuardActive: false,
    };

    const defaultVaporizer = {
      agent: 'sevoflurane' as const,
      dialPercent: 2.5,
      reservoirLevelPercent: 80,
      heatedTec6Active: false,
    };

    const defaultCircuit = {
      circuitVolumeL: 5.0,
      aplValvePressureCmH2O: 0,
      mode: 'ventilator' as const,
      rebreathingFraction: 0.6,
      circuitTimeConstantMin: 2.5,
      absorberExhaustionPercent: 10,
      indicatorColor: 'WHITE' as const,
      unidirectionalValveIntact: true,
      yPieceConnected: true,
      pipelineO2PressurePsi: 50,
      cylinderO2Open: false,
    };

    const defaultPatient = {
      age: 40,
      weightKg: 70,
      minuteVentilationLMin: 5.0,
      cardiacOutputLMin: 5.0,
      inspiredVolatilePercent: 2.0,
      endTidalVolatilePercent: 1.6,
      faFiRatio: 0.8,
      ageAdjustedMacAgent: 2.05,
      n2oContributionMac: 0,
      totalMac: 1.0,
      depthState: 'SURGICAL_ANESTHESIA' as const,
      etco2MmHg: 38,
      fico2MmHg: 0,
      spo2Percent: 99,
      heartRateBpm: 70,
      systolicBpMmHg: 115,
      temperatureC: 36.8,
      malignantHyperthermiaActive: false,
      dantroleneAdministeredMg: 0,
    };

    it('simulates normal surgical anesthesia maintenance', () => {
      const step = simulateAnesthesiaStep(
        'routine-low-flow',
        defaultMixer,
        defaultVaporizer,
        defaultCircuit,
        defaultPatient,
        10.0
      );

      expect(step.patient.depthState).toBe('SURGICAL_ANESTHESIA');
      expect(step.patient.fico2MmHg).toBe(0);
      expect(step.patient.etco2MmHg).toBe(38);
    });

    it('detects circuit disconnect at Y-piece with immediate loss of ETCO2', () => {
      const step = simulateAnesthesiaStep(
        'circuit-disconnect',
        defaultMixer,
        defaultVaporizer,
        { ...defaultCircuit, yPieceConnected: false },
        defaultPatient,
        1.0
      );

      expect(step.patient.etco2MmHg).toBe(0);
      expect(step.patient.totalMac).toBe(0);
      expect(step.alerts.some(a => a.severity === 'CRITICAL')).toBe(true);
    });

    it('detects incompetent expiratory valve causing elevated baseline FiCO2', () => {
      const step = simulateAnesthesiaStep(
        'expiratory-valve-failure',
        defaultMixer,
        defaultVaporizer,
        { ...defaultCircuit, unidirectionalValveIntact: false },
        defaultPatient,
        3.0
      );

      expect(step.patient.fico2MmHg).toBeGreaterThanOrEqual(6);
      expect(step.alerts.some(a => a.message.includes('Incompetent unidirectional valve'))).toBe(true);
    });

    it('detects pipeline oxygen pressure failure below 30 psi', () => {
      const step = simulateAnesthesiaStep(
        'pipeline-o2-failure',
        defaultMixer,
        defaultVaporizer,
        { ...defaultCircuit, pipelineO2PressurePsi: 15, cylinderO2Open: false },
        defaultPatient,
        1.0
      );

      expect(step.alerts.some(a => a.message.includes('OXYGEN PIPELINE PRESSURE CRITICAL'))).toBe(true);
    });

    it('manages Malignant Hyperthermia crisis response with Dantrolene', () => {
      const mhPatient = {
        ...defaultPatient,
        malignantHyperthermiaActive: true,
        temperatureC: 40.2,
        etco2MmHg: 82,
        heartRateBpm: 140,
        dantroleneAdministeredMg: 175, // 2.5 mg/kg administered!
      };

      const step = simulateAnesthesiaStep(
        'malignant-hyperthermia',
        defaultMixer,
        { ...defaultVaporizer, agent: 'none', dialPercent: 0 }, // Volatile stopped
        defaultCircuit,
        mhPatient,
        2.0
      );

      expect(step.patient.etco2MmHg).toBeLessThan(82); // Resolving
      expect(step.alerts.some(a => a.message.includes('Therapeutic Dantrolene response'))).toBe(true);
    });
  });
});
