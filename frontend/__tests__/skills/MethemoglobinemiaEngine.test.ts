import {
  computeMethemoglobinKinetics,
  calculateTwoWavelengthSpO2,
  DEFAULT_METHB_PATIENT,
  MethemoglobinPatientParams
} from '../../.gemini/skills/MethemoglobinemiaEngine';

describe('MethemoglobinemiaEngine Unit Tests', () => {
  it('1. Computes baseline MetHb toxicity with characteristic SpO2 ~85% plateau despite high PaO2', () => {
    const output = computeMethemoglobinKinetics(DEFAULT_METHB_PATIENT);
    expect(output.currentMetHbPct).toBe(38);
    expect(output.measuredPulseSpO2).toBeLessThanOrEqual(88);
    expect(output.measuredPulseSpO2).toBeGreaterThanOrEqual(84);
    expect(output.clinicalSeverity).toBe('MODERATE_HYPOXIA');
  });

  it('2. Demonstrates diagnostic saturation gap and triggers refractory cyanosis alert on 100% FiO2', () => {
    const output = computeMethemoglobinKinetics(DEFAULT_METHB_PATIENT);
    expect(Math.abs(output.saturationGap)).toBeGreaterThanOrEqual(5);
    expect(output.clinicalAlerts.some(a => a.message.includes('DIAGNOSTIC SATURATION GAP'))).toBe(true);
    expect(output.clinicalAlerts.some(a => a.message.includes('REFRACTORY CYANOSIS'))).toBe(true);
  });

  it('3. Confirms chocolate brown blood visual appearance and allosteric left-shifted P50 curve', () => {
    const output = computeMethemoglobinKinetics(DEFAULT_METHB_PATIENT);
    expect(output.bloodVisualAppearance).toBe('CHOCOLATE_BROWN');
    expect(output.leftShiftP50MmHg).toBeLessThan(22); // Normal is ~26.8 mmHg
  });

  it('4. Successfully models Methylene Blue reduction kinetics over time', () => {
    const treatedPatient: MethemoglobinPatientParams = {
      ...DEFAULT_METHB_PATIENT,
      methyleneBlueDoseMgKg: 1.5,
      elapsedMinutesSinceTreatment: 60 // 1 hour post-infusion
    };
    const output = computeMethemoglobinKinetics(treatedPatient);
    expect(output.antidoteEfficacy.methyleneBlueEffective).toBe(true);
    expect(output.antidoteEfficacy.leukomethyleneBlueGenerated).toBe(true);
    expect(output.currentMetHbPct).toBeLessThan(DEFAULT_METHB_PATIENT.baselineMetHbPct);
    expect(output.antidoteEfficacy.reductionRatePerHour).toBeGreaterThan(15);
  });

  it('5. Triggers lethal alert and G6PD hemolysis crisis when Methylene Blue is given to G6PD deficient patient', () => {
    const g6pdPatient: MethemoglobinPatientParams = {
      ...DEFAULT_METHB_PATIENT,
      g6pdDeficient: true,
      methyleneBlueDoseMgKg: 1.0
    };
    const output = computeMethemoglobinKinetics(g6pdPatient);
    expect(output.g6pdHemolysisCrisis).toBe(true);
    expect(output.antidoteEfficacy.methyleneBlueEffective).toBe(false);
    expect(output.clinicalAlerts.some(a => a.level === 'CRITICAL' && a.message.includes('G6PD CONTRAINDICATION'))).toBe(true);
  });

  it('6. Identifies Methylene Blue inefficacy in Sulfhemoglobinemia', () => {
    const sulfHbPatient: MethemoglobinPatientParams = {
      ...DEFAULT_METHB_PATIENT,
      sulfhemoglobinPresent: true,
      sulfHbPct: 8,
      methyleneBlueDoseMgKg: 1.5
    };
    const output = computeMethemoglobinKinetics(sulfHbPatient);
    expect(output.antidoteEfficacy.methyleneBlueEffective).toBe(false);
    expect(output.bloodVisualAppearance).toBe('SLATE_BLACK');
    expect(output.clinicalAlerts.some(a => a.message.includes('Sulfhemoglobinemia'))).toBe(true);
  });

  it('7. Warns of Serotonin Syndrome risk with concurrent SSRI use due to MAO-A inhibition', () => {
    const ssriPatient: MethemoglobinPatientParams = {
      ...DEFAULT_METHB_PATIENT,
      concurrentSsriUse: true,
      methyleneBlueDoseMgKg: 1.0
    };
    const output = computeMethemoglobinKinetics(ssriPatient);
    expect(output.serotoninSyndromeRisk).toBe(true);
    expect(output.clinicalAlerts.some(a => a.message.includes('SEROTONIN SYNDROME HAZARD'))).toBe(true);
  });

  it('8. Models Ascorbic Acid (Vitamin C) alternative reduction kinetics in G6PD deficiency', () => {
    const vitCPatient: MethemoglobinPatientParams = {
      ...DEFAULT_METHB_PATIENT,
      g6pdDeficient: true,
      ascorbicAcidDoseGrams: 5,
      elapsedMinutesSinceTreatment: 120
    };
    const output = computeMethemoglobinKinetics(vitCPatient);
    expect(output.antidoteEfficacy.reductionRatePerHour).toBeGreaterThan(1);
    expect(output.currentMetHbPct).toBeLessThan(DEFAULT_METHB_PATIENT.baselineMetHbPct);
  });

  it('9. Recommends Emergency RBC Exchange Transfusion in severe life-threatening MetHb (>= 50%)', () => {
    const severePatient: MethemoglobinPatientParams = {
      ...DEFAULT_METHB_PATIENT,
      baselineMetHbPct: 62
    };
    const output = computeMethemoglobinKinetics(severePatient);
    expect(output.exchangeTransfusionIndicated).toBe(true);
    expect(output.clinicalAlerts.some(a => a.message.includes('EXCHANGE TRANSFUSION INDICATED'))).toBe(true);
  });
});
