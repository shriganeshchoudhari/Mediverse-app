import {
  calculateECMODynamics,
  generateECMOTrends,
  ECMO_PRESETS,
  ECMOPumpSettings,
  PatientState,
} from '../../.gemini/skills/ECMODynamicsEngine';

describe('ECMODynamicsEngine', () => {
  const baseVVPump: ECMOPumpSettings = {
    configuration: 'VV_ECMO',
    bloodFlowLpm: 4.5,
    sweepGasFlowLpm: 5.0,
    oxygenatorFiO2: 1.0,
    drainageCannulaFr: 25,
    reinfusionCannulaFr: 21,
    cannulaTipDistanceCm: 18,
    membraneThrombosisPcnt: 0,
    lvVentActive: false,
  };

  const baseARDSState: PatientState = {
    weightKg: 75,
    nativeCardiacOutputLpm: 6.0,
    nativePulmonaryShuntPcnt: 70,
    nativePaO2FiO2Ratio: 65,
    metabolicVo2MlMin: 250,
    metabolicVco2MlMin: 200,
    hemoglobinGdl: 10.0,
    centralVenousPressureMmHg: 12,
    meanArterialPressureMmHg: 75,
  };

  it('calculates optimal VV ECMO support with low recirculation and normal Delta P', () => {
    const res = calculateECMODynamics(baseVVPump, baseARDSState);

    expect(res.configuration).toBe('VV_ECMO');
    expect(res.alarmStatus).toBe('OPTIMAL');
    expect(res.recirculationFractionPcnt).toBeLessThan(25);
    expect(res.transmembranePressureMmHg).toBeLessThan(35);
    expect(res.systemicSaO2Pcnt).toBeGreaterThanOrEqual(90);
    expect(res.systemicPh).toBeGreaterThan(7.30);
  });

  it('detects High Recirculation when cannula tips are too close in VV ECMO', () => {
    const closePump: ECMOPumpSettings = {
      ...baseVVPump,
      cannulaTipDistanceCm: 6, // 6 cm separation
    };

    const res = calculateECMODynamics(closePump, baseARDSState);

    expect(res.recirculationFractionPcnt).toBeGreaterThan(35);
    expect(res.alarmStatus).toBe('HIGH_RECIRCULATION');
    expect(res.warnings.some(w => w.includes('HIGH RECIRCULATION'))).toBe(true);
  });

  it('detects Cannula Chattering & Suction Collapse during hypovolemia', () => {
    const hypovolemicPatient: PatientState = {
      ...baseARDSState,
      centralVenousPressureMmHg: 2, // severe hypovolemia
    };

    const res = calculateECMODynamics({ ...baseVVPump, bloodFlowLpm: 5.5 }, hypovolemicPatient);

    expect(res.drainagePressureMmHg).toBeLessThan(-220);
    expect(res.alarmStatus).toBe('CANNULA_CHATTERING_SUCTION');
    expect(res.warnings.some(w => w.includes('CHATTERING'))).toBe(true);
  });

  it('detects Membrane Lung Thrombosis with high transmembrane pressure (Delta P)', () => {
    const clottedPump: ECMOPumpSettings = {
      ...baseVVPump,
      membraneThrombosisPcnt: 80,
    };

    const res = calculateECMODynamics(clottedPump, baseARDSState);

    expect(res.transmembranePressureMmHg).toBeGreaterThan(65);
    expect(res.alarmStatus).toBe('MEMBRANE_LUNG_THROMBOSIS');
    expect(res.warnings.some(w => w.includes('OXYGENATOR THROMBOSIS'))).toBe(true);
  });

  it('identifies Harlequin Syndrome (North-South Dual Circulation) in peripheral VA ECMO', () => {
    const vaPump: ECMOPumpSettings = {
      ...baseVVPump,
      configuration: 'VA_FEMORAL',
      bloodFlowLpm: 3.5,
    };
    const recoveringLVPatient: PatientState = {
      ...baseARDSState,
      nativeCardiacOutputLpm: 4.5, // strong LV
      nativePulmonaryShuntPcnt: 80, // completely failed lungs
    };

    const res = calculateECMODynamics(vaPump, recoveringLVPatient);

    expect(res.isHarlequinActive).toBe(true);
    expect(res.alarmStatus).toBe('HARLEQUIN_SYNDROME');
    expect(res.upperBodyPaO2MmHg).toBeLessThan(res.lowerBodyPaO2MmHg);
    expect(res.warnings.some(w => w.includes('HARLEQUIN SYNDROME'))).toBe(true);
  });

  it('detects severe LV distention in stunned unvented VA ECMO and relieves it with ECPELLA', () => {
    const vaPump: ECMOPumpSettings = {
      ...baseVVPump,
      configuration: 'VA_FEMORAL',
      bloodFlowLpm: 5.0,
      lvVentActive: false,
    };
    const stunnedPatient: PatientState = {
      ...baseARDSState,
      nativeCardiacOutputLpm: 0.8, // severe LV failure
    };

    const unventedRes = calculateECMODynamics(vaPump, stunnedPatient);
    expect(unventedRes.isLVDistentionSevere).toBe(true);
    expect(unventedRes.leftVentricularEndDiastolicPressureMmHg).toBeGreaterThan(28);

    const ventedPump: ECMOPumpSettings = {
      ...vaPump,
      lvVentActive: true, // ECPELLA
    };
    const ventedRes = calculateECMODynamics(ventedPump, stunnedPatient);
    expect(ventedRes.isLVDistentionSevere).toBe(false);
    expect(ventedRes.leftVentricularEndDiastolicPressureMmHg).toBeLessThan(18);
  });

  it('titrates Sweep Gas to clear CO2 and regulate systemic pH', () => {
    const highSweepRes = calculateECMODynamics({ ...baseVVPump, sweepGasFlowLpm: 8.0 }, baseARDSState);
    const lowSweepRes = calculateECMODynamics({ ...baseVVPump, sweepGasFlowLpm: 1.5 }, baseARDSState);

    expect(highSweepRes.systemicPaCO2MmHg).toBeLessThan(lowSweepRes.systemicPaCO2MmHg);
    expect(highSweepRes.systemicPh).toBeGreaterThan(lowSweepRes.systemicPh);
  });

  it('generates 24-hour physiological trend data', () => {
    const res = calculateECMODynamics(baseVVPump, baseARDSState);
    const trends = generateECMOTrends(baseVVPump, baseARDSState, res);

    expect(trends.length).toBe(13); // 0 to 24 by 2
    expect(trends[0].hour).toBe(0);
    expect(trends[trends.length - 1].hour).toBe(24);
  });

  it('verifies all 6 clinical presets load valid simulation parameters', () => {
    expect(ECMO_PRESETS.length).toBe(6);

    for (const preset of ECMO_PRESETS) {
      const res = calculateECMODynamics(preset.pumpSettings, preset.patientState);
      expect(typeof res.systemicPaO2MmHg).toBe('number');
      expect(typeof res.transmembranePressureMmHg).toBe('number');
      expect(preset.educationalTakeaway.length).toBeGreaterThan(20);
    }
  });
});
