import {
  simulatePostOpTamponade,
  DEFAULT_POST_OP_PATIENT,
  PostOpTamponadePatientParams
} from '../../.gemini/skills/PostOpTamponadeEngine';

describe('PostOpTamponadeEngine - Cardiology & Cardiac Surgery Critical Care', () => {
  it('1. simulates default post-op patient with localized posterior LA hematoma and LCOS', () => {
    const out = simulatePostOpTamponade(DEFAULT_POST_OP_PATIENT);

    expect(out.meanArterialPressureMmHg).toBeLessThan(65);
    expect(out.cardiacIndexLMinM2).toBeLessThan(1.8);
    expect(out.arterialLactateMmolL).toBeGreaterThan(3.5);
    expect(out.isEqualizedDiastolicPressures).toBe(true);
    expect(out.emergencyResternotomyIndicated).toBe(true);
    expect(out.resternotomyUrgency).toBe('IMMEDIATE_BEDSIDE_CALS_RESTERNOTOMY');
  });

  it('2. verifies equalization of diastolic pressures (CVP ≈ PAD ≈ PCWP within 4 mmHg)', () => {
    const out = simulatePostOpTamponade(DEFAULT_POST_OP_PATIENT);

    expect(out.centralVenousPressureCvpMmHg).toBeGreaterThanOrEqual(18);
    expect(out.pulmonaryCapillaryWedgePressurePcwpMmHg).toBeGreaterThanOrEqual(18);
    expect(out.diastolicPressureEqualizationGapMmHg).toBeLessThanOrEqual(4);
    expect(out.isEqualizedDiastolicPressures).toBe(true);
    expect(out.clinicalAlerts.some(a => a.message.includes('Equalization of Diastolic Pressures'))).toBe(true);
  });

  it('3. confirms blunted pulsus paradoxus in post-cardiac surgery stiff ventricles and localized compression', () => {
    const out = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      preExistingLvHypertrophyOrStiffness: true,
      selectedEtiology: 'LOCALIZED_POSTERIOR_LA_HEMATOMA'
    });

    expect(out.pulsusParadoxusMmHg).toBeLessThan(10);
    expect(out.pulsusParadoxusBlunted).toBe(true);
    expect(out.pulsusParadoxusBluntedReason).toContain('blunted/absent');
    expect(out.clinicalAlerts.some(a => a.message.includes('Blunted Pulsus Paradoxus'))).toBe(true);
  });

  it('4. demonstrates Bedside TTE false-negative pitfall vs TEE diagnostic gold standard', () => {
    // TTE: Misses posterior hematoma due to sternotomy wires and mediastinal air
    const tteOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      imagingPerformed: 'TTE_BEDSIDE'
    });

    expect(tteOut.imagingFindings.diagnosticQuality).toBe('POOR_ACOUSTIC_WINDOW');
    expect(tteOut.imagingFindings.acousticShadowingPresent).toBe(true);
    expect(tteOut.imagingFindings.localizedHematomaDetected).toBe(false);
    expect(tteOut.clinicalAlerts.some(a => a.message.includes('False Negative Bedside TTE Pitfall'))).toBe(true);

    // TEE: Clearly detects localized posterior LA hematoma and chamber collapse
    const teeOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      imagingPerformed: 'TEE_COMPREHENSIVE'
    });

    expect(teeOut.imagingFindings.diagnosticQuality).toBe('EXCELLENT_ACOUSTIC_WINDOW');
    expect(teeOut.imagingFindings.localizedHematomaDetected).toBe(true);
    expect(teeOut.imagingFindings.hematomaLocation).toBe('POSTERIOR_LEFT_ATRIUM');
    expect(teeOut.imagingFindings.chamberCollapse.leftAtrialCollapse).toBe(true);
    expect(teeOut.imagingFindings.clinicalEchoSummary).toContain('LARGE LOCALIZED POSTERIOR LEFT ATRIAL HEMATOMA');
  });

  it('5. models complete hemodynamic recovery following CALS emergency resternotomy and clot evacuation', () => {
    const restored = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      resternotomyPerformed: 'STERNAL_WIRES_CUT_RETRACTOR_PLACED'
    });

    expect(restored.meanArterialPressureMmHg).toBeGreaterThanOrEqual(70);
    expect(restored.cardiacIndexLMinM2).toBeGreaterThanOrEqual(2.4);
    expect(restored.centralVenousPressureCvpMmHg).toBeLessThanOrEqual(14);
    expect(restored.isEqualizedDiastolicPressures).toBe(false);
    expect(restored.emergencyResternotomyIndicated).toBe(false);
    expect(restored.hemodynamicRecoveryScore).toBeGreaterThanOrEqual(90);
    expect(restored.clinicalAlerts.some(a => a.message.includes('Resternotomy Completed'))).toBe(true);
  });

  it('6. detects localized posterior RA hematoma with caval inflow obstruction and loss of y descent', () => {
    const raOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      selectedEtiology: 'LOCALIZED_POSTERIOR_RA_HEMATOMA',
      imagingPerformed: 'TEE_COMPREHENSIVE'
    });

    expect(raOut.centralVenousPressureCvpMmHg).toBeGreaterThanOrEqual(20);
    expect(raOut.cvpWaveformMorphology.yDescent).toBe('BLUNTED_ABSENT');
    expect(raOut.imagingFindings.localizedHematomaDetected).toBe(true);
    expect(raOut.imagingFindings.hematomaLocation).toBe('POSTERIOR_RIGHT_ATRIUM');
    expect(raOut.imagingFindings.chamberCollapse.rightAtrialInversionDiastolicPct).toBeGreaterThan(50);
  });

  it('7. accurately differentiates Restrictive Myocardial Stiffness with prominent y descent dip-and-plateau', () => {
    const restOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      selectedEtiology: 'RESTRICTIVE_VENTRICULAR_STIFFNESS',
      imagingPerformed: 'TEE_COMPREHENSIVE'
    });

    expect(restOut.differentialDiagnosisMatrix.diagnosis).toBe('RESTRICTIVE_PHYSIOLOGY');
    expect(restOut.cvpWaveformMorphology.yDescent).toBe('PROMINENT_DEEP_DIP');
    expect(restOut.imagingFindings.localizedHematomaDetected).toBe(false);
    expect(restOut.differentialDiagnosisMatrix.recommendedManagement).toContain('Avoid resternotomy');
  });

  it('8. accurately identifies Post-CPB Vasoplegia Syndrome with profound low SVR and preserved CI', () => {
    const vasoOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      selectedEtiology: 'POST_CPB_VASOPLEGIA',
      imagingPerformed: 'TEE_COMPREHENSIVE'
    });

    expect(vasoOut.differentialDiagnosisMatrix.diagnosis).toBe('VASOPLEGIA');
    expect(vasoOut.systemicVascularResistanceDyns).toBeLessThan(700);
    expect(vasoOut.cardiacIndexLMinM2).toBeGreaterThanOrEqual(3.0);
    expect(vasoOut.differentialDiagnosisMatrix.recommendedManagement).toContain('Vasopressin');
  });

  it('9. warns against aggressive chest tube stripping hazard generating negative pressure and bypass damage', () => {
    const stripOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      drainMilkingOrStrippingAttempted: true
    });

    expect(stripOut.chestDrainManagementSafetyAlert).toBeDefined();
    expect(stripOut.clinicalAlerts.some(a => a.message.includes('Chest Tube Stripping Hazard'))).toBe(true);
  });

  it('10. distinguishes Isolated RV Failure with wide CVP-PCWP gradient and adverse fluid response', () => {
    const rvOut = simulatePostOpTamponade({
      ...DEFAULT_POST_OP_PATIENT,
      selectedEtiology: 'ISOLATED_RV_FAILURE',
      fluidBolusGivenMl: 1000,
      imagingPerformed: 'TEE_COMPREHENSIVE'
    });

    expect(rvOut.differentialDiagnosisMatrix.diagnosis).toBe('ISOLATED_RV_FAILURE');
    expect(rvOut.centralVenousPressureCvpMmHg - rvOut.pulmonaryCapillaryWedgePressurePcwpMmHg).toBeGreaterThanOrEqual(8);
    expect(rvOut.imagingFindings.clinicalEchoSummary).toContain('Acute RV failure');
  });
});
