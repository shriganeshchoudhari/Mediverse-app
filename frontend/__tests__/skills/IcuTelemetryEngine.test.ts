import {
  calculateMap,
  generateEcgWaveform,
  generatePlethWaveform,
  generateArtLineWaveform,
  evaluateBedAlarms,
  applyBedIntervention,
  SEEDED_ICU_BEDS,
  IcuBed,
} from '../../.gemini/skills/IcuTelemetryEngine';

describe('IcuTelemetryEngine', () => {
  describe('calculateMap', () => {
    it('calculates mean arterial pressure using (2*DBP + SBP) / 3', () => {
      // 120/80 -> (160 + 120) / 3 = 280 / 3 = 93.33 -> 93
      expect(calculateMap(120, 80)).toBe(93);
      // 86/52 -> (104 + 86) / 3 = 190 / 3 = 63.33 -> 63
      expect(calculateMap(86, 52)).toBe(63);
      // 78/44 -> (88 + 78) / 3 = 166 / 3 = 55.33 -> 55
      expect(calculateMap(78, 44)).toBe(55);
    });
  });

  describe('Waveform Generators', () => {
    it('generates correct number of sample points for ECG', () => {
      const samples = generateEcgWaveform('NORMAL_SINUS', 75, 120);
      expect(samples).toHaveLength(120);
      expect(typeof samples[0]).toBe('number');
    });

    it('generates distinct waveforms across cardiac rhythm types', () => {
      const sinus = generateEcgWaveform('NORMAL_SINUS', 75, 60);
      const asystole = generateEcgWaveform('ASYSTOLE', 0, 60);
      const vfib = generateEcgWaveform('VENTRICULAR_FIBRILLATION', 220, 60);
      const vtach = generateEcgWaveform('VENTRICULAR_TACHYCARDIA', 180, 60);
      const afib = generateEcgWaveform('ATRIAL_FIBRILLATION', 110, 60);
      const chb = generateEcgWaveform('AV_BLOCK_3RD_DEGREE', 35, 60);
      const stemi = generateEcgWaveform('ST_ELEVATION_ANTERIOR', 85, 60);

      expect(asystole.every((v) => Math.abs(v) < 0.15)).toBe(true);
      expect(Math.max(...sinus)).toBeGreaterThan(1.0); // R wave peak
      expect(Math.max(...vtach)).toBeGreaterThan(0.8);
      expect(vfib).not.toEqual(sinus);
      expect(chb).not.toEqual(sinus);
      expect(stemi).not.toEqual(sinus);
      expect(afib).not.toEqual(sinus);
    });

    it('generates plethysmograph waveform scaled by SpO2', () => {
      const plethHigh = generatePlethWaveform(72, 98, 80);
      const plethLow = generatePlethWaveform(72, 60, 80);

      expect(plethHigh).toHaveLength(80);
      expect(plethLow).toHaveLength(80);
      // Higher SpO2 should yield higher peak amplitude
      expect(Math.max(...plethHigh)).toBeGreaterThan(Math.max(...plethLow));
    });

    it('generates arterial line waveform within SBP/DBP range', () => {
      const art = generateArtLineWaveform(80, 120, 80, 100);
      expect(art).toHaveLength(100);
      expect(Math.max(...art)).toBeGreaterThanOrEqual(115);
      expect(Math.min(...art)).toBeLessThanOrEqual(85);
    });
  });

  describe('evaluateBedAlarms', () => {
    const mockBed: IcuBed = {
      bedId: 'TEST-01',
      patientName: 'Test Patient',
      mrn: 'TEST-1234',
      age: 50,
      gender: 'M',
      diagnosis: 'Evaluation',
      unit: 'CCU',
      rhythm: 'NORMAL_SINUS',
      vitals: {
        heartRate: 75,
        systolicBp: 120,
        diastolicBp: 80,
        meanArterialPressure: 93,
        spO2: 98,
        respRate: 16,
        temperatureCelsius: 37.0,
      },
      alarmLimits: {
        hrHigh: 120,
        hrLow: 50,
        sbpHigh: 160,
        sbpLow: 90,
        spo2Low: 92,
        rrHigh: 28,
        rrLow: 10,
      },
      activeAlarms: [],
      isSilenced: false,
      silenceRemainingSeconds: 0,
      waveformSamples: { ecg: [], pleth: [], art: [] },
    };

    it('returns empty alarms for normal stable vitals and sinus rhythm', () => {
      const alarms = evaluateBedAlarms(mockBed);
      expect(alarms).toHaveLength(0);
    });

    it('flags CRISIS alarms for lethal cardiac rhythms', () => {
      const vfAlarms = evaluateBedAlarms({ ...mockBed, rhythm: 'VENTRICULAR_FIBRILLATION' });
      expect(vfAlarms.some((a) => a.level === 'CRISIS' && a.title.includes('VENTRICULAR FIBRILLATION'))).toBe(true);

      const asystoleAlarms = evaluateBedAlarms({ ...mockBed, rhythm: 'ASYSTOLE' });
      expect(asystoleAlarms.some((a) => a.level === 'CRISIS' && a.title.includes('ASYSTOLE'))).toBe(true);

      const vtAlarms = evaluateBedAlarms({ ...mockBed, rhythm: 'VENTRICULAR_TACHYCARDIA' });
      expect(vtAlarms.some((a) => a.level === 'CRISIS' && a.title.includes('VENTRICULAR TACHYCARDIA'))).toBe(true);

      const chbAlarms = evaluateBedAlarms({ ...mockBed, rhythm: 'AV_BLOCK_3RD_DEGREE' });
      expect(chbAlarms.some((a) => a.level === 'CRISIS' && a.title.includes('COMPLETE HEART BLOCK'))).toBe(true);
    });

    it('flags CRISIS for extreme heart rates and WARNING for moderate breaches', () => {
      // Moderate tachycardia: HR 125 (limit 120)
      const modTachAlarms = evaluateBedAlarms({
        ...mockBed,
        vitals: { ...mockBed.vitals, heartRate: 125 },
      });
      expect(modTachAlarms.some((a) => a.level === 'WARNING' && a.parameter === 'HR')).toBe(true);

      // Extreme tachycardia: HR 165
      const extTachAlarms = evaluateBedAlarms({
        ...mockBed,
        vitals: { ...mockBed.vitals, heartRate: 165 },
      });
      expect(extTachAlarms.some((a) => a.level === 'CRISIS' && a.title.includes('EXTREME TACHYCARDIA'))).toBe(true);

      // Extreme bradycardia: HR 36 (limit 50)
      const extBradyAlarms = evaluateBedAlarms({
        ...mockBed,
        vitals: { ...mockBed.vitals, heartRate: 36 },
      });
      expect(extBradyAlarms.some((a) => a.level === 'CRISIS' && a.title.includes('EXTREME BRADYCARDIA'))).toBe(true);
    });

    it('detects MAP shock, hypertension, hypoxemia, and tachypnea', () => {
      const shockBed: IcuBed = {
        ...mockBed,
        vitals: {
          ...mockBed.vitals,
          systolicBp: 70,
          diastolicBp: 40,
          meanArterialPressure: 50, // severe shock
          spO2: 82, // critical hypoxemia
          respRate: 34, // tachypnea
        },
      };

      const alarms = evaluateBedAlarms(shockBed);
      expect(alarms.some((a) => a.level === 'CRISIS' && a.parameter === 'MAP')).toBe(true);
      expect(alarms.some((a) => a.level === 'CRISIS' && a.parameter === 'SpO2')).toBe(true);
      expect(alarms.some((a) => a.level === 'WARNING' && a.parameter === 'RESP')).toBe(true);
    });
  });

  describe('applyBedIntervention', () => {
    it('defibrillates V-Fib into Sinus Tachycardia', () => {
      const vfBed: IcuBed = {
        ...SEEDED_ICU_BEDS[0],
        rhythm: 'VENTRICULAR_FIBRILLATION',
      };
      const { updatedBed, resultMessage } = applyBedIntervention(vfBed, 'defibrillate_200j');

      expect(updatedBed.rhythm).toBe('SINUS_TACHYCARDIA');
      expect(updatedBed.vitals.heartRate).toBe(118);
      expect(resultMessage).toContain('Successful cardioversion');
      expect(updatedBed.waveformSamples.ecg.length).toBeGreaterThan(0);
    });

    it('handles non-shockable rhythm when defibrillating', () => {
      const sinusBed: IcuBed = { ...SEEDED_ICU_BEDS[3] };
      const { updatedBed, resultMessage } = applyBedIntervention(sinusBed, 'defibrillate_200j');

      expect(updatedBed.rhythm).toBe('NORMAL_SINUS');
      expect(resultMessage).toContain('Inappropriate shock');
    });

    it('administers atropine 1mg to reverse 3rd degree AV block', () => {
      const chbBed: IcuBed = { ...SEEDED_ICU_BEDS[2] };
      const { updatedBed, resultMessage } = applyBedIntervention(chbBed, 'atropine_1mg');

      expect(updatedBed.rhythm).toBe('NORMAL_SINUS');
      expect(updatedBed.vitals.heartRate).toBe(78);
      expect(resultMessage).toContain('Atropine 1 mg IV administered');
    });

    it('infuses amiodarone 150mg for VTach cardioversion', () => {
      const vtBed: IcuBed = { ...SEEDED_ICU_BEDS[0] };
      const { updatedBed, resultMessage } = applyBedIntervention(vtBed, 'amiodarone_150mg');

      expect(updatedBed.rhythm).toBe('NORMAL_SINUS');
      expect(updatedBed.vitals.heartRate).toBe(84);
      expect(resultMessage).toContain('Amiodarone 150 mg IV bolus');
    });

    it('titrates norepinephrine to increase blood pressure and MAP', () => {
      const septicBed: IcuBed = { ...SEEDED_ICU_BEDS[1] };
      const originalMap = septicBed.vitals.meanArterialPressure;
      const { updatedBed, resultMessage } = applyBedIntervention(septicBed, 'norepinephrine_titrate');

      expect(updatedBed.vitals.meanArterialPressure).toBeGreaterThan(originalMap);
      expect(resultMessage).toContain('Norepinephrine titrated upwards');
    });

    it('infuses 1000mL crystalloids to improve preload', () => {
      const hypovolemicBed: IcuBed = { ...SEEDED_ICU_BEDS[4] };
      const { updatedBed, resultMessage } = applyBedIntervention(
        hypovolemicBed,
        'crystalloid_bolus_1000ml'
      );

      expect(updatedBed.vitals.systolicBp).toBeGreaterThan(hypovolemicBed.vitals.systolicBp);
      expect(resultMessage).toContain('1,000 mL balanced crystalloid');
    });

    it('titrates 100% FiO2 to rescue hypoxemic SpO2', () => {
      const ardsBed: IcuBed = { ...SEEDED_ICU_BEDS[3] };
      const { updatedBed, resultMessage } = applyBedIntervention(ardsBed, 'oxygen_titrate_100');

      expect(updatedBed.vitals.spO2).toBeGreaterThan(85);
      expect(resultMessage).toContain('FiO2 titrated to 100%');
    });

    it('initiates CPR chest compressions on asystole', () => {
      const arrestBed: IcuBed = {
        ...SEEDED_ICU_BEDS[0],
        rhythm: 'ASYSTOLE',
      };
      const { updatedBed, resultMessage } = applyBedIntervention(
        arrestBed,
        'cpr_chest_compressions'
      );

      expect(updatedBed.vitals.meanArterialPressure).toBe(45);
      expect(resultMessage).toContain('High-quality chest compressions');
    });
  });

  describe('SEEDED_ICU_BEDS roster', () => {
    it('contains 6 beds across MICU, CCU, SICU, and NEURO_ICU', () => {
      expect(SEEDED_ICU_BEDS).toHaveLength(6);
      const units = new Set(SEEDED_ICU_BEDS.map((b) => b.unit));
      expect(units.has('CCU')).toBe(true);
      expect(units.has('MICU')).toBe(true);
      expect(units.has('SICU')).toBe(true);
      expect(units.has('NEURO_ICU')).toBe(true);
    });

    it('seeds with active alarms detected', () => {
      const totalAlarms = SEEDED_ICU_BEDS.reduce((acc, b) => acc + b.activeAlarms.length, 0);
      expect(totalAlarms).toBeGreaterThan(0);
    });
  });
});
