import {
  computeTensionPneumothoraxPhysiology,
  estimateChestWallThickness,
  DEFAULT_TENSION_PNEUMO_PATIENT,
  TensionPneumoPatientParams
} from '../../.gemini/skills/TensionPneumothoraxEngine';

describe('TensionPneumothoraxEngine Unit Tests', () => {
  it('1. Models unrelieved tension pneumothorax with positive intrapleural pressure and obstructive shock', () => {
    const output = computeTensionPneumothoraxPhysiology(DEFAULT_TENSION_PNEUMO_PATIENT);
    expect(output.intrapleuralPressureCmH2O).toBeGreaterThan(15);
    expect(output.mediastinalShiftMm).toBeGreaterThan(15);
    expect(output.inferiorVenaCavaCompressionPct).toBeGreaterThan(50);
    expect(output.systolicBp).toBeLessThan(90);
    expect(output.breathSoundsIpsilateral).toBe('ABSENT');
    expect(output.percussionNote).toBe('HYPERRESONANT_TYMPANIC');
    expect(output.clinicalAlerts.some(a => a.message.includes('OBSTRUCTIVE SHOCK'))).toBe(true);
  });

  it('2. Fails needle thoracostomy at 2nd ICS MCL when chest wall thickness exceeds catheter length', () => {
    const obesePatient: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      patientBmi: 32, // high BMI increases chest wall thickness > 45 mm
      interventionApplied: 'NEEDLE_2ND_ICS_MCL',
      needleLength: 'STANDARD_4_5_CM'
    };
    const output = computeTensionPneumothoraxPhysiology(obesePatient);
    expect(output.decompressionSuccess).toBe(false);
    expect(output.decompressionFailureReason).toContain('failed to penetrate');
    expect(output.clinicalAlerts.some(a => a.message.includes('NEEDLE DECOMPRESSION FAILURE'))).toBe(true);
  });

  it('3. Successfully relieves tension at 5th ICS AAL using extended 8.0 cm catheter', () => {
    const treatedPatient: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      interventionApplied: 'NEEDLE_5TH_ICS_AAL',
      needleLength: 'EXTENDED_8_0_CM'
    };
    const output = computeTensionPneumothoraxPhysiology(treatedPatient);
    expect(output.decompressionSuccess).toBe(true);
    expect(output.intrapleuralPressureCmH2O).toBeLessThanOrEqual(0);
    expect(output.systolicBp).toBeGreaterThanOrEqual(100);
  });

  it('4. Confirms simple finger thoracostomy provides rapid definitive decompression', () => {
    const fingerPt: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      interventionApplied: 'FINGER_THORACOSTOMY'
    };
    const output = computeTensionPneumothoraxPhysiology(fingerPt);
    expect(output.decompressionSuccess).toBe(true);
    expect(output.clinicalAlerts.some(a => a.message.includes('Finger Thoracostomy'))).toBe(true);
    expect(output.systolicBp).toBeGreaterThanOrEqual(100);
  });

  it('5. Models formal tube thoracostomy with 3-bottle drainage mechanics and suction', () => {
    const tubePt: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      interventionApplied: 'TUBE_THORACOSTOMY',
      chestTubeSizeFr: 32,
      suctionPressureCmH2O: -20
    };
    const output = computeTensionPneumothoraxPhysiology(tubePt);
    expect(output.decompressionSuccess).toBe(true);
    expect(output.intrapleuralPressureCmH2O).toBe(-20);
    expect(output.threeBottleDrainageState.waterSealTidalingMm).toBeGreaterThan(0);
    expect(output.threeBottleDrainageState.suctionBubbleStatus).toBe('PROPER_GENTLE_BUBBLING');
  });

  it('6. Detects persistent continuous Grade 5 air leak in active bronchopleural fistula', () => {
    const fistulaPt: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      interventionApplied: 'TUBE_THORACOSTOMY',
      bronchopleuralFistulaActive: true
    };
    const output = computeTensionPneumothoraxPhysiology(fistulaPt);
    expect(output.threeBottleDrainageState.airLeakGrade).toBe(5);
    expect(output.clinicalAlerts.some(a => a.message.includes('Bronchopleural Fistula'))).toBe(true);
  });

  it('7. Triggers massive hemothorax alert and emergency thoracotomy indication when blood >= 1500 mL', () => {
    const massiveHemoPt: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      hemothoraxPresent: true,
      pleuralBloodVolumeMl: 1600,
      interventionApplied: 'TUBE_THORACOSTOMY'
    };
    const output = computeTensionPneumothoraxPhysiology(massiveHemoPt);
    expect(output.massiveHemothoraxAlert).toBe(true);
    expect(output.emergencyThoracotomyIndicated).toBe(true);
    expect(output.clinicalAlerts.some(a => a.message.includes('MASSIVE HEMOTHORAX'))).toBe(true);
  });

  it('8. Demonstrates autotransfusion of shed pleural blood restoring circulating volume', () => {
    const autoTransPt: TensionPneumoPatientParams = {
      ...DEFAULT_TENSION_PNEUMO_PATIENT,
      hemothoraxPresent: true,
      pleuralBloodVolumeMl: 1200,
      interventionApplied: 'TUBE_THORACOSTOMY',
      autotransfusionActive: true
    };
    const output = computeTensionPneumothoraxPhysiology(autoTransPt);
    expect(output.autotransfusionYieldMl).toBeGreaterThan(900);
    expect(output.clinicalAlerts.some(a => a.message.includes('Autotransfusion Active'))).toBe(true);
  });

  it('9. Correctly computes chest wall thickness across BMI and anatomical sites', () => {
    const thinSite = estimateChestWallThickness(24, 'NEEDLE_5TH_ICS_AAL');
    const thickSite = estimateChestWallThickness(24, 'NEEDLE_2ND_ICS_MCL');
    expect(thickSite).toBeGreaterThan(thinSite);
  });
});
