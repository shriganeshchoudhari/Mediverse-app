import {
  classifyRutherford,
  simulateAcuteLimbIschemia,
  ALI_PRESETS,
  ALIPatientParams,
} from '../../.gemini/skills/AcuteLimbIschemiaEngine';

describe('AcuteLimbIschemiaEngine', () => {
  const baseParams: ALIPatientParams = {
    durationOfIschemiaHours: 3,
    etiology: 'EMBOLIC_CARDIAC',
    sensoryDeficit: 'NONE',
    motorDeficit: 'NONE',
    arterialDoppler: 'NORMAL_AUDIBLE',
    venousDoppler: 'NORMAL_AUDIBLE',
    systolicBpMmHg: 130,
    diastolicBpMmHg: 80,
    intracompartmentalPressureMmHg: 12,
    heparinAdministered: true,
    heparinBolusUnits: 5000,
    selectedRevascularization: 'CATHETER_DIRECTED_THROMBOLYSIS_CDT',
    fogartyBalloonOverinflation: false,
    fasciotomyPerformed: false,
    preReperfusionHydrationActive: false,
    urineOutputMlPerHour: 60,
    serumPotassiumMeqL: 4.1,
    serumCkUnitsL: 350,
  };

  it('1. correctly classifies Class I Viable with intact neurology and doppler signals', () => {
    const classification = classifyRutherford(baseParams);
    expect(classification.category).toBe('CLASS_I_VIABLE');
    expect(classification.isSalvageable).toBe(true);

    const result = simulateAcuteLimbIschemia(baseParams);
    expect(result.rutherfordClass).toBe('CLASS_I_VIABLE');
    expect(result.isLimbSalvageable).toBe(true);
  });

  it('2. correctly classifies Class IIa Marginally Threatened with toe sensory deficit', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      sensoryDeficit: 'MINIMAL_TOES',
      arterialDoppler: 'INAUDIBLE',
    };
    const classification = classifyRutherford(params);
    expect(classification.category).toBe('CLASS_IIA_MARGINALLY_THREATENED');
    expect(classification.isSalvageable).toBe(true);
  });

  it('3. classifies Class IIb Immediately Threatened when motor weakness is present', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      sensoryDeficit: 'EXTENSIVE_FOOT_REST_PAIN',
      motorDeficit: 'MILD_TOE_FLEXION_WEAKNESS',
      arterialDoppler: 'INAUDIBLE',
    };
    const classification = classifyRutherford(params);
    expect(classification.category).toBe('CLASS_IIB_IMMEDIATELY_THREATENED');
    expect(classification.isSalvageable).toBe(true);
  });

  it('4. classifies Class III Irreversible when muscle rigor / paralysis is present', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      durationOfIschemiaHours: 18,
      sensoryDeficit: 'ANESTHETIC_NUMB',
      motorDeficit: 'COMPLETE_PARALYSIS_RIGOR',
      arterialDoppler: 'INAUDIBLE',
      venousDoppler: 'INAUDIBLE',
    };
    const classification = classifyRutherford(params);
    expect(classification.category).toBe('CLASS_III_IRREVERSIBLE');
    expect(classification.isSalvageable).toBe(false);
  });

  it('5. triggers lethal reperfusion catastrophe alert when revascularizing Class III limb', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      durationOfIschemiaHours: 20,
      sensoryDeficit: 'ANESTHETIC_NUMB',
      motorDeficit: 'COMPLETE_PARALYSIS_RIGOR',
      arterialDoppler: 'INAUDIBLE',
      venousDoppler: 'INAUDIBLE',
      selectedRevascularization: 'EMERGENT_FOGARTY_EMBOLECTOMY', // Hazard!
    };
    const result = simulateAcuteLimbIschemia(params);
    expect(result.contraindicationFlags.revascularizationLethalDueToClassIII).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('LETHAL REPERFUSION RESUSCITATION CATASTROPHE'))).toBe(true);
    expect(result.predictedAmputationRatePercent).toBe(100);
  });

  it('6. triggers CDT hazard alert when CDT chosen for Class IIb immediately threatened limb', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      sensoryDeficit: 'EXTENSIVE_FOOT_REST_PAIN',
      motorDeficit: 'MODERATE_FOOT_DROP',
      arterialDoppler: 'INAUDIBLE',
      selectedRevascularization: 'CATHETER_DIRECTED_THROMBOLYSIS_CDT', // Inappropriate delay!
    };
    const result = simulateAcuteLimbIschemia(params);
    expect(result.contraindicationFlags.cdtContraindicatedDueToMotorDeficit).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('CONTRAINDICATED CDT HAZARD'))).toBe(true);
  });

  it('7. calculates Delta Perfusion Pressure and flags compartment syndrome when Delta P <= 30', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      diastolicBpMmHg: 70,
      intracompartmentalPressureMmHg: 45, // Delta P = 25 mmHg
      selectedRevascularization: 'EMERGENT_FOGARTY_EMBOLECTOMY',
      fasciotomyPerformed: false,
    };
    const result = simulateAcuteLimbIschemia(params);
    expect(result.deltaPerfusionPressureMmHg).toBe(25);
    expect(result.compartmentSyndromeRisk).toBe('ESTABLISHED_COMPARTMENT_SYNDROME');
    expect(result.contraindicationFlags.fasciotomyMandatedImmediately).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('COMPARTMENT SYNDROME CRISIS'))).toBe(true);
  });

  it('8. flags balloon overinflation hazard during Fogarty embolectomy', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      selectedRevascularization: 'EMERGENT_FOGARTY_EMBOLECTOMY',
      fogartyBalloonOverinflation: true,
    };
    const result = simulateAcuteLimbIschemia(params);
    expect(result.contraindicationFlags.fogartyVesselRuptureHazard).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('FOGARTY CATHETER COMPLICATION'))).toBe(true);
  });

  it('9. detects unfractionated heparin omission and penalizes safety score', () => {
    const params: ALIPatientParams = {
      ...baseParams,
      heparinAdministered: false,
    };
    const result = simulateAcuteLimbIschemia(params);
    expect(result.criticalAlerts.some((a) => a.includes('UNFRACTIONATED HEPARIN OMISSION'))).toBe(true);
    expect(result.revascularizationSafetyScore).toBeLessThan(100);
  });

  it('10. validates clinical presets accurately', () => {
    const resViable = simulateAcuteLimbIschemia(ALI_PRESETS.viableClassI);
    expect(resViable.rutherfordClass).toBe('CLASS_I_VIABLE');

    const resThreatened = simulateAcuteLimbIschemia(ALI_PRESETS.immediatelyThreatenedClassIIb);
    expect(resThreatened.rutherfordClass).toBe('CLASS_IIB_IMMEDIATELY_THREATENED');

    const resTrap = simulateAcuteLimbIschemia(ALI_PRESETS.cdtContraindicatedTrap);
    expect(resTrap.contraindicationFlags.cdtContraindicatedDueToMotorDeficit).toBe(true);

    const resLethal = simulateAcuteLimbIschemia(ALI_PRESETS.lethalReperfusionClassIII);
    expect(resLethal.contraindicationFlags.revascularizationLethalDueToClassIII).toBe(true);

    const resComp = simulateAcuteLimbIschemia(ALI_PRESETS.postReperfusionCompartmentSyndrome);
    expect(resComp.compartmentSyndromeRisk).toBe('ESTABLISHED_COMPARTMENT_SYNDROME');
  });
});
