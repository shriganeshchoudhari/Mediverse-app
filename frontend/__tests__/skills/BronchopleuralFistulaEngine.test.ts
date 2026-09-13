import {
  simulateBronchopleuralFistula,
  DEFAULT_BPF_PATIENT,
  BpfPatientParams
} from '../../.gemini/skills/BronchopleuralFistulaEngine';

describe('BronchopleuralFistulaEngine Unit Tests', () => {
  it('calculates severe ventilatory steal (> 40%) in large central BPF on baseline single ventilator', () => {
    const output = simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT);
    expect(output.ventilatoryStealPercentage).toBeGreaterThanOrEqual(40);
    expect(output.clinicalAlerts.some(a => a.includes('SEVERE VENTILATORY STEAL'))).toBe(true);
  });

  it('triggers critical tension pneumothorax alert when chest tube is clamped (LETHAL HAZARD)', () => {
    const clampedPatient: BpfPatientParams = {
      ...DEFAULT_BPF_PATIENT,
      pleuralDrainageMode: 'CLAMPED_HAZARD'
    };
    const output = simulateBronchopleuralFistula(clampedPatient);
    expect(output.tensionPneumothoraxRisk).toBe('CRITICAL_LETHAL');
    expect(output.clinicalAlerts.some(a => a.includes('LETHAL DISASTER: CHEST TUBE MUST NEVER BE CLAMPED'))).toBe(true);
  });

  it('dramatically reduces ventilatory steal when Independent Lung Ventilation (ILV) is activated', () => {
    const ilvPatient: BpfPatientParams = {
      ...DEFAULT_BPF_PATIENT,
      independentLungVentilationActive: true,
      dltPositionConfirmedBronchoscopically: true,
      fistulaLungTidalVolumeMl: 120,
      fistulaLungPeepCmH2O: 0,
      healthyLungTidalVolumeMl: 380,
      healthyLungPeepCmH2O: 8
    };
    const output = simulateBronchopleuralFistula(ilvPatient);
    expect(output.ventilatoryStealPercentage).toBeLessThan(DEFAULT_BPF_PATIENT.airLeakVolumeMlPerBreath / DEFAULT_BPF_PATIENT.setTidalVolumeMl * 100);
    expect(output.healingLikelihoodScorePercent).toBeGreaterThan(simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT).healingLikelihoodScorePercent);
  });

  it('detects high pleural suction dilemma (-20 cmH2O) maximizing transpulmonary gradient', () => {
    const output = simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT);
    expect(output.clinicalAlerts.some(a => a.includes('HIGH PLEURAL SUCTION DILEMMA'))).toBe(true);
  });

  it('detects contralateral pulmonary flooding hazard in large central bronchus fistula', () => {
    const output = simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT);
    expect(output.contralateralFloodingRisk).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('PULMONARY FLOODING HAZARD'))).toBe(true);
  });

  it('models endobronchial valves (EBV) placement reducing air leak and boosting healing', () => {
    const ebvPatient: BpfPatientParams = {
      ...DEFAULT_BPF_PATIENT,
      endobronchialValvesPlaced: true
    };
    const baseline = simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT);
    const withEbv = simulateBronchopleuralFistula(ebvPatient);
    expect(withEbv.ventilatoryStealPercentage).toBeLessThan(baseline.ventilatoryStealPercentage);
    expect(withEbv.healingLikelihoodScorePercent).toBeGreaterThan(baseline.healingLikelihoodScorePercent);
  });

  it('confirms autologous blood patch effectiveness in peripheral alveolopleural fistula', () => {
    const apfPatient: BpfPatientParams = {
      ...DEFAULT_BPF_PATIENT,
      fistulaLocation: 'PERIPHERAL_ALVEOLOPLEURAL',
      autologousBloodPatchInstilled: true
    };
    const output = simulateBronchopleuralFistula(apfPatient);
    expect(output.healingLikelihoodScorePercent).toBeGreaterThan(40);
  });

  it('confirms complete anatomical seal upon surgical muscle flap coverage', () => {
    const flapPatient: BpfPatientParams = {
      ...DEFAULT_BPF_PATIENT,
      surgicalStumpFlapCoverageDone: true
    };
    const output = simulateBronchopleuralFistula(flapPatient);
    expect(output.ventilatoryStealPercentage).toBe(0);
    expect(output.healingLikelihoodScorePercent).toBe(98);
  });

  it('provides appropriate therapeutic directives for ILV and interventional bronchoscopy', () => {
    const output = simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT);
    expect(output.therapeuticDirectives.some(d => d.includes('INDEPENDENT LUNG VENTILATION (ILV)'))).toBe(true);
    expect(output.therapeuticDirectives.some(d => d.includes('THORACIC SURGICAL RE-EXPLORATION'))).toBe(true);
  });

  it('calculates effective minute ventilation accounting for fistula loss volume', () => {
    const output = simulateBronchopleuralFistula(DEFAULT_BPF_PATIENT);
    expect(output.effectiveMinuteVentilationLPerMin).toBeGreaterThan(0);
    expect(output.effectiveMinuteVentilationLPerMin).toBeLessThan((DEFAULT_BPF_PATIENT.setTidalVolumeMl * DEFAULT_BPF_PATIENT.respiratoryRateBpm) / 1000);
  });
});
