import {
  calculateGlasgowBlatchfordScore,
  calculateRockallScore,
  analyzeForrestClassification,
  simulateUpperGiBleedingState,
  PatientVitalsLabs,
  EndoscopicFindings,
  PharmacotherapyRegimen,
  EndoscopicIntervention,
} from '../../.gemini/skills/UpperGiBleedingEngine';

describe('UpperGiBleedingEngine Unit Tests', () => {
  const mockLowRiskPatient: PatientVitalsLabs = {
    ageYears: 32,
    systolicBpMmHg: 125,
    heartRateBpm: 72,
    bloodUreaNitrogenMgDl: 14.0, // Normal
    hemoglobinGDl: 14.5,
    sex: 'MALE',
    presentationMelena: false,
    presentationSyncope: false,
    hasHepaticDisease: false,
    hasCardiacFailure: false,
    hasRenalFailure: false,
    hasMalignancy: false,
  };

  const mockHighRiskVaricealPatient: PatientVitalsLabs = {
    ageYears: 64,
    systolicBpMmHg: 88, // Hypotension -> score
    heartRateBpm: 118, // Tachycardia -> score
    bloodUreaNitrogenMgDl: 34.0, // Elevated BUN
    hemoglobinGDl: 7.2, // Severe anemia
    sex: 'MALE',
    presentationMelena: true,
    presentationSyncope: true,
    hasHepaticDisease: true, // Cirrhosis
    hasCardiacFailure: false,
    hasRenalFailure: false,
    hasMalignancy: false,
  };

  it('correctly calculates Glasgow-Blatchford Score (GBS) and identifies outpatient eligibility', () => {
    const lowRiskGbs = calculateGlasgowBlatchfordScore(mockLowRiskPatient);
    expect(lowRiskGbs.score).toBe(0);
    expect(lowRiskGbs.outpatientEligible).toBe(true);
    expect(lowRiskGbs.riskCategory).toBe('VERY_LOW_RISK');

    const highRiskGbs = calculateGlasgowBlatchfordScore(mockHighRiskVaricealPatient);
    expect(highRiskGbs.score).toBeGreaterThanOrEqual(12);
    expect(highRiskGbs.outpatientEligible).toBe(false);
    expect(highRiskGbs.riskCategory).toBe('HIGH_RISK');
  });

  it('correctly stratifies pre- and post-endoscopy Rockall score', () => {
    const endoscopy: EndoscopicFindings = {
      etiology: 'PEPTIC_ULCER_DUODENAL',
      forrestClass: 'Ia', // Spurting vessel
      stigmataOfRecentHemorrhage: true,
    };

    const rockall = calculateRockallScore(mockHighRiskVaricealPatient, endoscopy);
    expect(rockall.preEndoscopyScore).toBeGreaterThanOrEqual(3);
    expect(rockall.postEndoscopyScore).toBeGreaterThan(rockall.preEndoscopyScore);
    expect(rockall.riskTier).toBe('HIGH_RISK');
    expect(rockall.predictedRebleedRiskPercent).toBeGreaterThan(30);
  });

  it('accurately parses Forrest Classification risk and intervention mandate', () => {
    const forrestIa = analyzeForrestClassification('Ia');
    expect(forrestIa.rebleedRiskWithoutTherapyPercent).toBe(90);
    expect(forrestIa.endoscopicTherapyMandated).toBe(true);
    expect(forrestIa.highDoseIvPpiIndicated).toBe(true);

    const forrestIII = analyzeForrestClassification('III');
    expect(forrestIII.rebleedRiskWithoutTherapyPercent).toBe(3);
    expect(forrestIII.endoscopicTherapyMandated).toBe(false);
    expect(forrestIII.highDoseIvPpiIndicated).toBe(false);
  });

  it('simulates peptic ulcer dual therapy and high-dose PPI hemostasis', () => {
    const ulcerPatient: PatientVitalsLabs = {
      ...mockLowRiskPatient,
      systolicBpMmHg: 95,
      heartRateBpm: 108,
      hemoglobinGDl: 8.5,
      presentationMelena: true,
    };

    const endoscopy: EndoscopicFindings = {
      etiology: 'PEPTIC_ULCER_GASTRIC',
      forrestClass: 'Ia',
      stigmataOfRecentHemorrhage: true,
      ulcerSizeMm: 18,
    };

    const pharma: PharmacotherapyRegimen = {
      ivPpiType: 'PANTOPRAZOLE_80MG_BOLUS_8MG_HR',
      vasoactiveAgent: 'NONE',
      prophylacticAntibiotic: 'NONE',
      prokineticPreEndoscopy: 'ERYTHROMYCIN_250MG_IV_30MIN_PRIOR',
      tranexamicAcidGiven: false,
    };

    const intervention: EndoscopicIntervention = {
      primaryModality: 'DUAL_THERAPY_EPI_PLUS_HEMOCLIP',
      salvageTamponadeApplied: false,
      gastricBalloonVolumeMl: 0,
      esophagealBalloonPressureMmHg: 0,
      tipsEvaluatedOrPerformed: false,
    };

    const result = simulateUpperGiBleedingState(ulcerPatient, endoscopy, pharma, intervention, 2);
    expect(result.hemostasisAchieved).toBe(true);
    expect(result.activeBleedingRateMlMin).toBe(0);
    expect(result.currentSystolicBp).toBeGreaterThanOrEqual(95);
    expect(result.clinicalSummary.some(s => s.includes('dual therapy'))).toBe(true);
  });

  it('models refractory variceal bleeding with octreotide, salvage Sengstaken-Blakemore balloon and TIPS', () => {
    const endoscopy: EndoscopicFindings = {
      etiology: 'ESOPHAGEAL_VARICES',
      forrestClass: 'NOT_APPLICABLE',
      varicealGrade: 'GRADE_III',
      varicealRedColorSigns: true,
      stigmataOfRecentHemorrhage: true,
    };

    const pharma: PharmacotherapyRegimen = {
      ivPpiType: 'NONE',
      vasoactiveAgent: 'OCTREOTIDE_50MCG_BOLUS_50MCG_HR',
      prophylacticAntibiotic: 'CEFTRIAXONE_1G_IV_DAILY',
      prokineticPreEndoscopy: 'NONE',
      tranexamicAcidGiven: false,
    };

    // Balloon tamponade properly inflated (250 mL gastric, 35 mmHg esophageal)
    const intervention: EndoscopicIntervention = {
      primaryModality: 'BAND_LIGATION_EVL',
      salvageTamponadeApplied: true,
      gastricBalloonVolumeMl: 250,
      esophagealBalloonPressureMmHg: 35,
      tipsEvaluatedOrPerformed: true,
    };

    const result = simulateUpperGiBleedingState(mockHighRiskVaricealPatient, endoscopy, pharma, intervention, 3);
    expect(result.hemostasisAchieved).toBe(true);
    expect(result.tamponadeComplicationDetected).toBe('NONE');
    expect(result.clinicalSummary.some(s => s.includes('Ceftriaxone'))).toBe(true);
    expect(result.clinicalSummary.some(s => s.includes('Octreotide'))).toBe(true);
  });

  it('detects dangerous esophageal balloon over-inflation complication', () => {
    const endoscopy: EndoscopicFindings = {
      etiology: 'ESOPHAGEAL_VARICES',
      forrestClass: 'NOT_APPLICABLE',
      varicealGrade: 'GRADE_III',
      stigmataOfRecentHemorrhage: true,
    };

    const pharma: PharmacotherapyRegimen = {
      ivPpiType: 'NONE',
      vasoactiveAgent: 'OCTREOTIDE_50MCG_BOLUS_50MCG_HR',
      prophylacticAntibiotic: 'NONE',
      prokineticPreEndoscopy: 'NONE',
      tranexamicAcidGiven: false,
    };

    const dangerousIntervention: EndoscopicIntervention = {
      primaryModality: 'NONE',
      salvageTamponadeApplied: true,
      gastricBalloonVolumeMl: 250,
      esophagealBalloonPressureMmHg: 55, // Dangerously high (> 45 mmHg)
      tipsEvaluatedOrPerformed: false,
    };

    const result = simulateUpperGiBleedingState(mockHighRiskVaricealPatient, endoscopy, pharma, dangerousIntervention, 1);
    expect(result.tamponadeComplicationDetected).toBe('ESOPHAGEAL_RUPTURE');
    expect(result.clinicalSummary.some(s => s.includes('exceeds mucosal capillary perfusion pressure'))).toBe(true);
  });
});
