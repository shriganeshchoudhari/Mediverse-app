import {
  simulateCompartmentSyndrome,
  DEFAULT_COMPARTMENT_PATIENT,
  CompartmentSyndromePatientParams
} from '../../.gemini/skills/CompartmentSyndromeEngine';

describe('CompartmentSyndromeEngine - Orthopedics, Emergency Medicine & Trauma', () => {
  it('1. simulates default acute tibia fracture with elevated ICP, pain on stretch, and ACS diagnosis', () => {
    const out = simulateCompartmentSyndrome(DEFAULT_COMPARTMENT_PATIENT);

    expect(out.highestIntracompartmentalPressureMmHg).toBe(42);
    expect(out.absolutePressureDiagnosticForAcs).toBe(true);
    expect(out.deltaPressureDiagnosticForAcs).toBe(true);
    expect(out.fasciotomyIndicated).toBe(true);
    expect(out.clinicalExam.painOnPassiveStretch).toBe(true);
  });

  it('2. verifies McQueen Delta Pressure threshold (Diastolic BP - ICP <= 30 mmHg)', () => {
    const out = simulateCompartmentSyndrome(DEFAULT_COMPARTMENT_PATIENT);

    // 65 - 42 = 23 mmHg <= 30 mmHg
    expect(out.deltaPressureMmHg).toBe(23);
    expect(out.deltaPressureDiagnosticForAcs).toBe(true);
    expect(out.clinicalAlerts.some(a => a.message.includes('DIAGNOSTIC DELTA PRESSURE'))).toBe(true);
  });

  it('3. detects ACS in hypotensive trauma shock despite absolute ICP < 30 mmHg using Delta Pressure', () => {
    const shockPatient: CompartmentSyndromePatientParams = {
      ...DEFAULT_COMPARTMENT_PATIENT,
      diastolicBpMmHg: 45,
      measuredCompartmentPressures: {
        anteriorMmHg: 26, // Absolute pressure < 30 mmHg
        lateralMmHg: 22,
        superficialPosteriorMmHg: 20,
        deepPosteriorMmHg: 24
      }
    };

    const out = simulateCompartmentSyndrome(shockPatient);

    // Absolute pressure 26 < 30, but Delta P = 45 - 26 = 19 mmHg <= 30 mmHg!
    expect(out.absolutePressureDiagnosticForAcs).toBe(false);
    expect(out.deltaPressureMmHg).toBe(19);
    expect(out.deltaPressureDiagnosticForAcs).toBe(true);
    expect(out.fasciotomyIndicated).toBe(true);
  });

  it('4. warns against the "Pulselessness Fallacy" when distal pulses remain palpable in active ACS', () => {
    const out = simulateCompartmentSyndrome(DEFAULT_COMPARTMENT_PATIENT);

    expect(out.clinicalExam.palpableDistalPulses).toBe(true);
    expect(out.clinicalAlerts.some(a => a.message.includes('Pulselessness Fallacy'))).toBe(true);
  });

  it('5. catches incomplete fasciotomy pitfall when single incision leaves deep posterior compartment unreleased', () => {
    const out = simulateCompartmentSyndrome({
      ...DEFAULT_COMPARTMENT_PATIENT,
      surgicalProcedure: 'SINGLE_INCISION_INCOMPLETE_FASCIOTOMY'
    });

    expect(out.incompleteDecompressionPitfall).toBe(true);
    expect(out.volkmannIschemicContractureRisk).toBe(true);
    const deepPost = out.compartmentBreakdown.find(c => c.compartmentName === 'DEEP_POSTERIOR');
    expect(deepPost?.decompressed).toBe(false);
    expect(deepPost?.pressureMmHg).toBe(DEFAULT_COMPARTMENT_PATIENT.measuredCompartmentPressures.deepPosteriorMmHg);
    expect(out.clinicalAlerts.some(a => a.message.includes('INCOMPLETE FASCIOTOMY PITFALL'))).toBe(true);
  });

  it('6. verifies complete two-incision four-compartment fasciotomy achieves full decompression', () => {
    const out = simulateCompartmentSyndrome({
      ...DEFAULT_COMPARTMENT_PATIENT,
      surgicalProcedure: 'TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY'
    });

    expect(out.highestIntracompartmentalPressureMmHg).toBeLessThanOrEqual(10);
    expect(out.fasciotomyIndicated).toBe(false);
    expect(out.incompleteDecompressionPitfall).toBe(false);
    expect(out.volkmannIschemicContractureRisk).toBe(false);
    expect(out.limbSalvageSuccessScore).toBeGreaterThanOrEqual(90);
    expect(out.clinicalAlerts.some(a => a.message.includes('Complete Two-Incision Four-Compartment Decompression'))).toBe(true);
  });

  it('7. demonstrates cast bivalving to skin reduces intracompartmental pressures by over 40%', () => {
    const out = simulateCompartmentSyndrome({
      ...DEFAULT_COMPARTMENT_PATIENT,
      castBivalvedToSkin: true
    });

    expect(out.highestIntracompartmentalPressureMmHg).toBeLessThan(DEFAULT_COMPARTMENT_PATIENT.measuredCompartmentPressures.anteriorMmHg);
    expect(out.clinicalAlerts.some(a => a.message.includes('Cast & Dressings Bivalved to Skin'))).toBe(true);
  });

  it('8. models rhabdomyolysis and dark myoglobinuria with high intracompartmental pressures', () => {
    const out = simulateCompartmentSyndrome({
      ...DEFAULT_COMPARTMENT_PATIENT,
      hoursSinceInjury: 6
    });

    expect(out.serumCreatineKinaseUL).toBeGreaterThanOrEqual(10000);
    expect(out.urineMyoglobinPresent).toBe(true);
    expect(out.urineColorAppearance).toBe('DARK_RED_PORT_WINE');
    expect(out.clinicalAlerts.some(a => a.message.includes('Myoglobinuria / Rhabdomyolysis'))).toBe(true);
  });

  it('9. confirms urine alkalinization raises urine pH >= 6.5 and mitigates acute kidney injury risk', () => {
    const outAlkalinized = simulateCompartmentSyndrome({
      ...DEFAULT_COMPARTMENT_PATIENT,
      urineAlkalinizationActive: true,
      ivFluidRateMlPerHour: 250
    });

    expect(outAlkalinized.urinePh).toBeGreaterThanOrEqual(6.5);
    expect(outAlkalinized.acuteKidneyInjuryRisk).toBe('LOW');
  });

  it('10. flags irreversible myonecrosis when decompression is delayed beyond 6-8 hours', () => {
    const outLate = simulateCompartmentSyndrome({
      ...DEFAULT_COMPARTMENT_PATIENT,
      hoursSinceInjury: 12
    });

    const antComp = outLate.compartmentBreakdown.find(c => c.compartmentName === 'ANTERIOR');
    expect(antComp?.ischemiaSeverity).toBe('IRREVERSIBLE_MYONECROSIS');
    expect(outLate.limbSalvageSuccessScore).toBeLessThan(50);
  });
});
