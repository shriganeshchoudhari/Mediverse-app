import {
  calculatePredictedBodyWeight,
  simulateVentilatorMechanics,
  VENTILATOR_PRESETS,
  VentilatorSettings,
  PatientCharacteristics,
} from '../../.gemini/skills/MechanicalVentilationEngine';

describe('MechanicalVentilationEngine', () => {
  describe('calculatePredictedBodyWeight (ARDSNet PBW)', () => {
    it('calculates male PBW accurately', () => {
      // 175 cm male: 50 + 2.3 * ((175 - 152.4) / 2.54) = 50 + 2.3 * 8.8976 ~ 70.5 kg
      const pbw = calculatePredictedBodyWeight(175, 'MALE');
      expect(pbw).toBeCloseTo(70.5, 0);
    });

    it('calculates female PBW accurately', () => {
      // 162 cm female: 45.5 + 2.3 * ((162 - 152.4) / 2.54) = 45.5 + 2.3 * 3.779 ~ 54.2 kg
      const pbw = calculatePredictedBodyWeight(162, 'FEMALE');
      expect(pbw).toBeCloseTo(54.2, 0);
    });
  });

  describe('simulateVentilatorMechanics in VCV Mode', () => {
    const settings: VentilatorSettings = {
      mode: 'VCV',
      tidalVolumeMl: 450,
      inspiratoryPressureCmH2O: 15,
      respiratoryRate: 15, // cycle time = 4.0s
      peepCmH2O: 5,
      fiO2: 0.40,
      ieRatio: { insp: 1, exp: 2 }, // insp = 1.33s
      peakFlowLpm: 60,
      flowWaveform: 'SQUARE',
      inspiratoryPausePercent: 10, // pause ~0.133s
      flowTriggerLpm: 2.0,
    };

    const patient: PatientCharacteristics = {
      heightCm: 175,
      gender: 'MALE',
      complianceMlPerCmH2O: 50, // Pelastic = 450 / 50 = 9 cmH2O -> Pplat = 5 + 9 = 14 cmH2O
      resistanceCmH2OPerLps: 5,
    };

    it('computes plateau and peak pressures adhering to the equation of motion', () => {
      const { waveforms, diagnostics } = simulateVentilatorMechanics(settings, patient);

      expect(diagnostics.plateauPressureCmH2O).toBe(14.0);
      expect(diagnostics.drivingPressureCmH2O).toBe(9.0); // 14 - 5
      expect(diagnostics.peakInspiratoryPressureCmH2O).toBeGreaterThan(diagnostics.plateauPressureCmH2O);
      expect(diagnostics.lungProtectiveCompliance.isDrivingPressureSafe).toBe(true);
      expect(diagnostics.lungProtectiveCompliance.isPlateauPressureSafe).toBe(true);
      expect(waveforms.length).toBeGreaterThan(50);
    });

    it('flags high driving pressure and plateau pressure in severe ARDS', () => {
      const ardsPatient: PatientCharacteristics = {
        heightCm: 175,
        gender: 'MALE',
        complianceMlPerCmH2O: 18, // Very stiff lungs: Pelastic = 450 / 18 = 25 cmH2O -> Pplat = 5 + 25 = 30
        resistanceCmH2OPerLps: 5,
      };

      const { diagnostics } = simulateVentilatorMechanics(settings, ardsPatient);

      expect(diagnostics.plateauPressureCmH2O).toBe(30.0);
      expect(diagnostics.drivingPressureCmH2O).toBe(25.0); // > 14
      expect(diagnostics.lungProtectiveCompliance.isDrivingPressureSafe).toBe(false);
      expect(diagnostics.alarms.some((a) => a.includes('ELEVATED DRIVING PRESSURE'))).toBe(true);
    });

    it('demonstrates large peak-plateau difference in high airway resistance (bronchospasm / mucus plug)', () => {
      const asthmaPatient: PatientCharacteristics = {
        heightCm: 175,
        gender: 'MALE',
        complianceMlPerCmH2O: 60,
        resistanceCmH2OPerLps: 30, // Extremely high Raw
      };

      const { diagnostics } = simulateVentilatorMechanics(settings, asthmaPatient);

      // Ppeak - Pplat should be substantial due to high Raw
      const peakPlatDelta = diagnostics.peakInspiratoryPressureCmH2O - diagnostics.plateauPressureCmH2O;
      expect(peakPlatDelta).toBeGreaterThan(10);
    });
  });

  describe('simulateVentilatorMechanics in PCV and PSV Mode', () => {
    it('simulates Pressure Control (PCV) with exponential flow decay and delivered volume', () => {
      const pcvSettings: VentilatorSettings = {
        mode: 'PCV',
        tidalVolumeMl: 400,
        inspiratoryPressureCmH2O: 16,
        respiratoryRate: 16,
        peepCmH2O: 8,
        fiO2: 0.50,
        ieRatio: { insp: 1, exp: 2 },
        peakFlowLpm: 60,
        flowWaveform: 'DECELERATING',
        inspiratoryPausePercent: 0,
        flowTriggerLpm: 2.0,
      };

      const patient: PatientCharacteristics = {
        heightCm: 165,
        gender: 'FEMALE',
        complianceMlPerCmH2O: 30,
        resistanceCmH2OPerLps: 8,
      };

      const { diagnostics, waveforms } = simulateVentilatorMechanics(pcvSettings, patient);

      expect(diagnostics.peakInspiratoryPressureCmH2O).toBe(24.0); // 8 PEEP + 16 Pinsp
      expect(diagnostics.deliveredTidalVolumeMl).toBeGreaterThan(300);
      expect(waveforms.some((w) => w.flowLps < 0)).toBe(true); // Has negative expiratory flow
    });

    it('calculates RSBI in Spontaneous Breathing Trial (PSV Mode)', () => {
      const psvSettings: VentilatorSettings = {
        mode: 'PSV',
        tidalVolumeMl: 500,
        inspiratoryPressureCmH2O: 8,
        respiratoryRate: 15,
        peepCmH2O: 5,
        fiO2: 0.35,
        ieRatio: { insp: 1, exp: 2 },
        peakFlowLpm: 60,
        flowWaveform: 'DECELERATING',
        inspiratoryPausePercent: 0,
        flowTriggerLpm: 1.5,
      };

      const patient: PatientCharacteristics = {
        heightCm: 170,
        gender: 'MALE',
        complianceMlPerCmH2O: 65,
        resistanceCmH2OPerLps: 4,
      };

      const { diagnostics } = simulateVentilatorMechanics(psvSettings, patient);

      expect(diagnostics.rsbi).not.toBeNull();
      // RSBI = 15 breaths / (deliveredVT / 1000)
      // Delivered VT around 500 mL -> RSBI around 30 (< 105 success)
      expect(diagnostics.rsbi!).toBeLessThan(105);
    });
  });

  describe('VENTILATOR_PRESETS', () => {
    it('contains valid clinical presets with scenarios and teaching pearls', () => {
      expect(VENTILATOR_PRESETS.length).toBeGreaterThanOrEqual(5);

      for (const preset of VENTILATOR_PRESETS) {
        expect(preset.id).toBeDefined();
        expect(preset.title).toBeDefined();
        expect(preset.clinicalScenario).toBeDefined();
        expect(preset.teachingPoints.length).toBeGreaterThan(0);

        const { diagnostics, waveforms } = simulateVentilatorMechanics(preset.settings, preset.patient);
        expect(diagnostics.predictedBodyWeightKg).toBeGreaterThan(30);
        expect(diagnostics.deliveredTidalVolumeMl).toBeGreaterThan(0);
        expect(waveforms.length).toBeGreaterThan(0);
      }
    });
  });
});
