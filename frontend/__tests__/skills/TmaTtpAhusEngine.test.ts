import {
  calculatePlasmicScore,
  simulateTmaSyndrome,
  DEFAULT_TMA_PATIENT,
  TmaPatientParams
} from '../../.gemini/skills/TmaTtpAhusEngine';

describe('TmaTtpAhusEngine Unit Tests', () => {
  it('calculates High-Risk PLASMIC score (6-7 points) for typical TTP presentation', () => {
    const plasmic = calculatePlasmicScore(DEFAULT_TMA_PATIENT);
    expect(plasmic.totalScore).toBeGreaterThanOrEqual(6);
    expect(plasmic.riskCategory).toBe('HIGH_RISK');
    expect(plasmic.predictedTtpProbabilityPercent).toBe(85);
    expect(plasmic.plateletLessThan30k).toBe(true);
    expect(plasmic.creatinineLessThan2_0).toBe(true);
    expect(plasmic.inrLessThan1_5).toBe(true);
  });

  it('calculates Low-Risk PLASMIC score when creatinine is high and platelets > 30k', () => {
    const patient: TmaPatientParams = {
      ...DEFAULT_TMA_PATIENT,
      plateletCountPerMicroliter: 65000, // no pt
      serumCreatinineMgPerDl: 3.8,       // no pt (aHUS phenotype)
      meanCorpuscularVolumeFLL: 94,      // no pt
      historyOfActiveCancer: true        // no pt
    };
    const plasmic = calculatePlasmicScore(patient);
    expect(plasmic.totalScore).toBeLessThanOrEqual(4);
    expect(plasmic.riskCategory).toBe('LOW_RISK');
    expect(plasmic.predictedTtpProbabilityPercent).toBe(4);
  });

  it('confirms MAHA with schistocytes >= 1.0%, elevated LDH, undetectable haptoglobin, and negative DAT', () => {
    const output = simulateTmaSyndrome(DEFAULT_TMA_PATIENT);
    expect(output.mahaConfirmed).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('MAHA) CONFIRMED'))).toBe(true);
  });

  it('excludes DIC when PT/INR, aPTT, and fibrinogen are normal', () => {
    const output = simulateTmaSyndrome(DEFAULT_TMA_PATIENT);
    expect(output.dicExcludedByCoagulation).toBe(true);
    expect(output.therapeuticDirectives.some(d => d.includes('NORMAL COAGULATION PROFILE'))).toBe(true);
  });

  it('detects the classic Pentad myth pitfall when patient has incomplete pentad (dyad only)', () => {
    const patient: TmaPatientParams = {
      ...DEFAULT_TMA_PATIENT,
      neurologicSymptomsPresent: false,
      feverPresent: false,
      urineProteinOrBloodPresent: false,
      serumCreatinineMgPerDl: 0.9 // only MAHA + Thrombocytopenia
    };
    const output = simulateTmaSyndrome(patient);
    expect(output.classicPentadPresent).toBe(false);
    expect(output.clinicalAlerts.some(a => a.includes('THE PENTAD MYTH PITFALL'))).toBe(true);
  });

  it('classifies definitive Immune TTP with severe ADAMTS13 deficiency and inhibitor', () => {
    const output = simulateTmaSyndrome(DEFAULT_TMA_PATIENT);
    expect(output.predictedTmaSubtype).toBe('IMMUNE_TTP');
    expect(output.clinicalAlerts.some(a => a.includes('DEFINITIVE IMMUNE TTP'))).toBe(true);
    expect(output.therapeuticDirectives.some(d => d.includes('EMERGENT TPE MANDATORY'))).toBe(true);
    expect(output.therapeuticDirectives.some(d => d.includes('CAPLACIZUMAB'))).toBe(true);
  });

  it('classifies Atypical HUS (aHUS) when ADAMTS13 is preserved and renal failure dominates', () => {
    const ahusPatient: TmaPatientParams = {
      ...DEFAULT_TMA_PATIENT,
      adamts13ActivityPercent: 68.0, // preserved > 10%
      adamts13InhibitorBethesdaUnits: 0,
      serumCreatinineMgPerDl: 4.8,   // severe AKI
      neurologicSymptomsPresent: false
    };
    const output = simulateTmaSyndrome(ahusPatient);
    expect(output.predictedTmaSubtype).toBe('ATYPICAL_HUS');
    expect(output.clinicalAlerts.some(a => a.includes('ATYPICAL HUS (COMPLEMENT-MEDIATED TMA)'))).toBe(true);
    expect(output.therapeuticDirectives.some(d => d.includes('COMPLEMENT C5 INHIBITION (ECULIZUMAB / RAVULIZUMAB)'))).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('MENINGOCOCCAL INFECTION RISK'))).toBe(true);
  });

  it('identifies STEC-HUS when stool Shiga-toxin test is positive', () => {
    const stecPatient: TmaPatientParams = {
      ...DEFAULT_TMA_PATIENT,
      stoolShigaToxinPositive: true
    };
    const output = simulateTmaSyndrome(stecPatient);
    expect(output.predictedTmaSubtype).toBe('STEC_HUS');
    expect(output.clinicalAlerts.some(a => a.includes('STEC-HUS IDENTIFIED'))).toBe(true);
  });

  it('triggers lethal warning when Platelet Transfusion is administered ("Fuel to the Fire")', () => {
    const transfusedPatient: TmaPatientParams = {
      ...DEFAULT_TMA_PATIENT,
      plateletTransfusionAdministered: true
    };
    const output = simulateTmaSyndrome(transfusedPatient);
    expect(output.plateletTransfusionHazardTriggered).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('LETHAL HEMATOLOGIC PITFALL ("FUEL TO THE FIRE")'))).toBe(true);
  });

  it('confirms Congenital TTP (Upshaw-Schulman) when ADAMTS13 < 10% without inhibitor', () => {
    const congenitalPatient: TmaPatientParams = {
      ...DEFAULT_TMA_PATIENT,
      adamts13ActivityPercent: 3.0,
      adamts13InhibitorBethesdaUnits: 0.0 // no autoantibody
    };
    const output = simulateTmaSyndrome(congenitalPatient);
    expect(output.predictedTmaSubtype).toBe('CONGENITAL_TTP');
    expect(output.clinicalAlerts.some(a => a.includes('CONGENITAL TTP (UPSHAW-SCHULMAN SYNDROME)'))).toBe(true);
  });
});
