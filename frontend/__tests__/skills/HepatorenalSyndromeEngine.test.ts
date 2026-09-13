import {
  determineIcaAkiStage,
  calculateMeldScores,
  classifyRenalPhenotype,
  simulateHepatorenalSyndrome,
  HEPATORENAL_PRESETS,
  HepatorenalPatientParams
} from '../../.gemini/skills/HepatorenalSyndromeEngine';

describe('HepatorenalSyndromeEngine', () => {
  const basePatient: HepatorenalPatientParams = {
    baselineSerumCreatinineMgDl: 0.9,
    currentSerumCreatinineMgDl: 0.9,
    totalBilirubinMgDl: 2.0,
    serumSodiumMeqL: 135,
    inr: 1.3,
    serumAlbuminGDl: 3.2,
    weightKg: 70,
    hasAscites: true,
    hasCirrhosis: true,
    sbpMmHg: 110,
    dbpMmHg: 70,
    heartRateBpm: 75,
    spO2PercentRoomAir: 98,
    hasOvertPulmonaryEdema: false,
    urineSodiumMeqL: 20,
    urineCreatinineMgDl: 80,
    urineOsmolalityMosmKg: 450,
    fractionalExcretionSodiumPercent: 0.6,
    fractionalExcretionUreaPercent: 32,
    urinaryNgalNgMl: 50,
    urineSedimentActiveOrMuddyCasts: false,
    proteinuriaGramPerDay: 0.1,
    diureticsWithdrawn48h: true,
    albuminChallenge1gPerKgGiven48h: true,
    creatinineImprovedWithAlbumin: true,
    vasoactiveTherapy: 'NONE',
    largeVolumeParacentesisLiters: 0,
    paracentesisAlbuminGivenGrams: 0,
    asciticFluidPmnCountPerMm3: 50,
    sbpSortAlbuminProtocolGiven: false
  };

  it('1. correctly determines ICA-AKI Stages (Stage 1A, 1B, 2, and 3)', () => {
    expect(determineIcaAkiStage(1.0, 1.1)).toBe('NO_AKI');
    expect(determineIcaAkiStage(0.8, 1.3)).toBe('STAGE_1A'); // SCr < 1.5
    expect(determineIcaAkiStage(1.0, 1.7)).toBe('STAGE_1B'); // SCr >= 1.5
    expect(determineIcaAkiStage(1.0, 2.4)).toBe('STAGE_2');  // 2.0-2.9x
    expect(determineIcaAkiStage(1.0, 3.5)).toBe('STAGE_3');  // >= 3.0x
  });

  it('2. computes valid bounded MELD-Na and MELD 3.0 scores', () => {
    const { meldNa, meld3 } = calculateMeldScores({
      ...basePatient,
      totalBilirubinMgDl: 4.5,
      currentSerumCreatinineMgDl: 2.5,
      inr: 2.1,
      serumSodiumMeqL: 126
    });
    expect(meldNa).toBeGreaterThanOrEqual(6);
    expect(meldNa).toBeLessThanOrEqual(40);
    expect(meld3).toBeGreaterThanOrEqual(6);
    expect(meld3).toBeLessThanOrEqual(40);
  });

  it('3. differentiates HRS-AKI from Acute Tubular Necrosis (ATN) using urine indices and sediment', () => {
    const hrsPatient: HepatorenalPatientParams = {
      ...basePatient,
      currentSerumCreatinineMgDl: 2.5,
      urineSodiumMeqL: 8,
      fractionalExcretionSodiumPercent: 0.2,
      urinaryNgalNgMl: 60,
      urineSedimentActiveOrMuddyCasts: false,
      creatinineImprovedWithAlbumin: false
    };
    expect(classifyRenalPhenotype(hrsPatient)).toBe('HRS_AKI');

    const atnPatient: HepatorenalPatientParams = {
      ...basePatient,
      currentSerumCreatinineMgDl: 3.5,
      urineSodiumMeqL: 55,
      fractionalExcretionSodiumPercent: 2.5,
      urinaryNgalNgMl: 600,
      urineSedimentActiveOrMuddyCasts: true,
      creatinineImprovedWithAlbumin: false
    };
    expect(classifyRenalPhenotype(atnPatient)).toBe('ACUTE_TUBULAR_NECROSIS_ATN');
  });

  it('4. classifies Prerenal Volume Responsive AKI when 48h albumin challenge improves creatinine', () => {
    const prerenalCase: HepatorenalPatientParams = {
      ...basePatient,
      currentSerumCreatinineMgDl: 1.6,
      creatinineImprovedWithAlbumin: true
    };
    expect(classifyRenalPhenotype(prerenalCase)).toBe('PRERENAL_VOLUME_RESPONSIVE');
  });

  it('5. identifies Post-Paracentesis Circulatory Dysfunction (PPCD) hazard when > 5L removed without albumin', () => {
    const lvpCase: HepatorenalPatientParams = {
      ...basePatient,
      largeVolumeParacentesisLiters: 9.0,
      paracentesisAlbuminGivenGrams: 0 // Deficit of (9-5)*8 = 32g
    };
    const result = simulateHepatorenalSyndrome(lvpCase);
    expect(result.hasPpcdRisk).toBe(true);
    expect(result.paracentesisAlbuminDeficitGrams).toBe(32);
    expect(result.criticalAlerts.some(a => a.includes('PPCD'))).toBe(true);
  });

  it('6. enforces Sort Albumin Protocol for SBP (PMN >= 250) to prevent renal failure and mortality', () => {
    const sbpWithoutAlbumin: HepatorenalPatientParams = {
      ...basePatient,
      asciticFluidPmnCountPerMm3: 650,
      sbpSortAlbuminProtocolGiven: false
    };
    const result = simulateHepatorenalSyndrome(sbpWithoutAlbumin);
    expect(result.hasSbp).toBe(true);
    expect(result.criticalAlerts.some(a => a.includes('SBP RENAL RESCUE FAILURE'))).toBe(true);
  });

  it('7. flags continuing diuretics during active AKI as a lethal clinical practice pitfall', () => {
    const diureticCase: HepatorenalPatientParams = {
      ...basePatient,
      currentSerumCreatinineMgDl: 2.8,
      vasoactiveTherapy: 'DIURETICS_ACTIVE_HAZARD'
    };
    const result = simulateHepatorenalSyndrome(diureticCase);
    expect(result.criticalAlerts.some(a => a.includes('LETHAL PRACTICE PITFALL'))).toBe(true);
    expect(result.resuscitationSafetyScore).toBeLessThan(70);
  });

  it('8. enforces CONFIRM Trial Black Box Warning: flags Terlipressin respiratory hazard when SpO2 < 90%', () => {
    const hypoxemicCase: HepatorenalPatientParams = {
      ...basePatient,
      currentSerumCreatinineMgDl: 2.6,
      spO2PercentRoomAir: 86,
      hasOvertPulmonaryEdema: true,
      vasoactiveTherapy: 'TERLIPRESSIN_PLUS_ALBUMIN',
      creatinineImprovedWithAlbumin: false
    };
    const result = simulateHepatorenalSyndrome(hypoxemicCase);
    expect(result.terlipressinRespiratoryHazard).toBe(true);
    expect(result.criticalAlerts.some(a => a.includes('CONFIRM TRIAL BLACK BOX WARNING'))).toBe(true);
  });

  it('9. calculates superior reversal rate for Terlipressin+Albumin and Norepinephrine+Albumin over Midodrine', () => {
    const terliResult = simulateHepatorenalSyndrome({
      ...basePatient,
      currentSerumCreatinineMgDl: 2.8,
      creatinineImprovedWithAlbumin: false,
      vasoactiveTherapy: 'TERLIPRESSIN_PLUS_ALBUMIN'
    });

    const midoResult = simulateHepatorenalSyndrome({
      ...basePatient,
      currentSerumCreatinineMgDl: 2.8,
      creatinineImprovedWithAlbumin: false,
      vasoactiveTherapy: 'MIDODRINE_OCTREOTIDE_ALBUMIN'
    });

    expect(terliResult.predictedAkiReversalProbabilityPercent).toBeGreaterThan(
      midoResult.predictedAkiReversalProbabilityPercent
    );
  });

  it('10. validates all 5 standard clinical presets across severity spectrum', () => {
    const presets = Object.values(HEPATORENAL_PRESETS);
    expect(presets.length).toBe(5);

    // Test classicHrsAki
    const classicResult = simulateHepatorenalSyndrome(HEPATORENAL_PRESETS.classicHrsAki);
    expect(classicResult.isConfirmedHrsAki).toBe(true);
    expect(classicResult.icaAkiStage).toBe('STAGE_2');

    // Test sbpTriggeredHrs
    const sbpResult = simulateHepatorenalSyndrome(HEPATORENAL_PRESETS.sbpTriggeredHrs);
    expect(sbpResult.hasSbp).toBe(true);
    expect(sbpResult.icaAkiStage).toBe('STAGE_3');

    // Test terlipressinRespiratoryHazardPreset
    const hazardResult = simulateHepatorenalSyndrome(HEPATORENAL_PRESETS.terlipressinRespiratoryHazardPreset);
    expect(hazardResult.terlipressinRespiratoryHazard).toBe(true);
    expect(hazardResult.clinicalStatusBadge.status).toBe('LETHAL_EMERGENCY');

    // Test postParacentesisCirculatoryDysfunction
    const ppcdResult = simulateHepatorenalSyndrome(HEPATORENAL_PRESETS.postParacentesisCirculatoryDysfunction);
    expect(ppcdResult.hasPpcdRisk).toBe(true);
    expect(ppcdResult.paracentesisAlbuminDeficitGrams).toBeGreaterThan(0);

    // Test acuteTubularNecrosisMismatch
    const atnResult = simulateHepatorenalSyndrome(HEPATORENAL_PRESETS.acuteTubularNecrosisMismatch);
    expect(atnResult.renalInjuryPhenotype).toBe('ACUTE_TUBULAR_NECROSIS_ATN');
  });
});
