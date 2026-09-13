import {
  simulateEcmoWorkstation,
  ECMO_PRESETS,
  EcmoPatientParams,
} from '../../.gemini/skills/EcmoCannulationEngine';

describe('EcmoCannulationEngine', () => {
  const baseParams: EcmoPatientParams = {
    modality: 'VV_RESPIRATORY',
    cannulation: 'FEM_IJ_BIFEMORAL',
    ecmoBloodFlowLpm: 4.5,
    sweepGasFlowLpm: 6.0,
    membraneFio2: 1.0,
    nativeCardiacOutputLpm: 5.0,
    nativeLungPaO2MmHg: 55,
    artLineSite: 'RIGHT_RADIAL_MANDATORY',
    distalPerfusionCatheterInPlace: true,
    lvVenting: 'NONE_UNVENTED',
    aorticValveOpening: true,
    pao2Fio2Ratio: 60,
  };

  it('1. correctly computes serial gas exchange in VV-ECMO for ARDS', () => {
    const result = simulateEcmoWorkstation(baseParams);
    expect(result.harlequinSyndromeActive).toBe(false);
    expect(result.harlequinSeverity).toBe('NONE');
    expect(result.recirculationFractionPercent).toBeGreaterThan(0);
  });

  it('2. detects Harlequin dual circulation when native LV ejects hypoxic blood in peripheral VA-ECMO', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VA_CARDIOCIRCULATORY',
      cannulation: 'FEM_FEM_PERIPHERAL',
      nativeCardiacOutputLpm: 3.5, // Recovering LV
      nativeLungPaO2MmHg: 45, // Hypoxic pulmonary effluent
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.harlequinSyndromeActive).toBe(true);
    expect(result.coronaryCerebralPaO2MmHg).toBeLessThan(65);
    expect(result.subdiaphragmaticPaO2MmHg).toBeGreaterThan(300);
  });

  it('3. triggers critical Harlequin catastrophe alert in severe dual circulation', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VA_CARDIOCIRCULATORY',
      cannulation: 'FEM_FEM_PERIPHERAL',
      nativeCardiacOutputLpm: 4.0,
      nativeLungPaO2MmHg: 40,
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.harlequinSeverity).toBe('CRITICAL_CEREBRAL_CORONARY_HYPOXIA');
    expect(result.criticalAlerts.some((a) => a.includes('HARLEQUIN (NORTH-SOUTH) SYNDROME CATASTROPHE'))).toBe(true);
  });

  it('4. triggers monitoring practice error alert when left radial art line is used during Harlequin syndrome', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VA_CARDIOCIRCULATORY',
      cannulation: 'FEM_FEM_PERIPHERAL',
      nativeCardiacOutputLpm: 3.0,
      nativeLungPaO2MmHg: 48,
      artLineSite: 'LEFT_RADIAL', // Pitfall!
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.contraindicationFlags.misleadingLeftRadialArtLine).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('MONITORING PRACTICE ERROR'))).toBe(true);
  });

  it('5. resolves Harlequin syndrome and normoxifies upper body with VAV hybrid cannulation', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VAV_HYBRID_TRIPLE',
      cannulation: 'FEM_IJ_BIFEMORAL',
      nativeCardiacOutputLpm: 3.5,
      nativeLungPaO2MmHg: 45,
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.harlequinSyndromeActive).toBe(false);
    expect(result.coronaryCerebralPaO2MmHg).toBeGreaterThanOrEqual(85);
  });

  it('6. detects critical LV overdistension when aortic valve remains closed without mechanical venting', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VA_CARDIOCIRCULATORY',
      cannulation: 'FEM_FEM_WITH_DPC',
      aorticValveOpening: false, // Closed valve
      lvVenting: 'NONE_UNVENTED', // No vent
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.lvDistensionRisk).toBe('CRITICAL_PULMONARY_EDEMA');
    expect(result.criticalAlerts.some((a) => a.includes('CRITICAL LV OVERDISTENSION'))).toBe(true);
  });

  it('7. confirms effective LV unloading and decompression via ECPELLA (Impella)', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VA_CARDIOCIRCULATORY',
      cannulation: 'FEM_FEM_WITH_DPC',
      aorticValveOpening: false,
      lvVenting: 'IMPELLA_ECPELLA',
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.lvDistensionRisk).toBe('LOW');
    expect(result.physiologicMechanisms.some((m) => m.includes('ECPELLA Mechanical Synergy'))).toBe(true);
  });

  it('8. flags distal limb ischemia hazard when DPC is absent in femoral VA-ECMO', () => {
    const params: EcmoPatientParams = {
      ...baseParams,
      modality: 'VA_CARDIOCIRCULATORY',
      cannulation: 'FEM_FEM_PERIPHERAL',
      distalPerfusionCatheterInPlace: false, // Omitted DPC!
    };
    const result = simulateEcmoWorkstation(params);
    expect(result.distalLimbIschemiaRisk).toBe('CRITICAL_LIMB_THREAT');
    expect(result.criticalAlerts.some((a) => a.includes('DISTAL LIMB ISCHEMIA HAZARD'))).toBe(true);
  });

  it('9. calculates total systemic oxygen delivery (DO2)', () => {
    const result = simulateEcmoWorkstation(baseParams);
    expect(result.systemicOxygenDeliveryDo2MlMin).toBeGreaterThan(500);
  });

  it('10. validates all clinical presets accurately', () => {
    const resVv = simulateEcmoWorkstation(ECMO_PRESETS.vvArdsProtective);
    expect(resVv.harlequinSyndromeActive).toBe(false);

    const resHarlequin = simulateEcmoWorkstation(ECMO_PRESETS.harlequinNorthSouthCrisis);
    expect(resHarlequin.harlequinSyndromeActive).toBe(true);

    const resTrap = simulateEcmoWorkstation(ECMO_PRESETS.harlequinLeftRadialTrap);
    expect(resTrap.contraindicationFlags.misleadingLeftRadialArtLine).toBe(true);

    const resDist = simulateEcmoWorkstation(ECMO_PRESETS.unventedLvOverdistension);
    expect(resDist.lvDistensionRisk).toBe('CRITICAL_PULMONARY_EDEMA');

    const resVav = simulateEcmoWorkstation(ECMO_PRESETS.vavHybridRescued);
    expect(resVav.harlequinSyndromeActive).toBe(false);
  });
});
