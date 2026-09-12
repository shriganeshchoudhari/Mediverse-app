import {
  calculateNihss,
  calculateAspects,
  calculateAlteplaseDose,
  calculateTenecteplaseDose,
  evaluateThrombolysisEligibility,
  evaluateEvtEligibility,
  evaluateAcuteStroke,
  CLINICAL_STROKE_PRESETS,
  PatientPresentation,
  NihssItemScores,
  AspectsRegion
} from '../../.gemini/skills/StrokeNihssThrombolysisEngine';

describe('StrokeNihssThrombolysisEngine', () => {
  describe('calculateNihss', () => {
    it('accurately calculates total NIHSS and categorizes severity', () => {
      const normalNihss: NihssItemScores = {
        loc1a: 0, loc1b: 0, loc1c: 0, bestGaze2: 0, visualFields3: 0,
        facialPalsy4: 0, motorArmLeft5a: 0, motorArmRight5b: 0,
        motorLegLeft6a: 0, motorLegRight6b: 0, limbAtaxia7: 0,
        sensory8: 0, bestLanguage9: 0, dysarthria10: 0, extinction11: 0
      };
      expect(calculateNihss(normalNihss)).toEqual({ total: 0, category: 'No Stroke' });

      const minorNihss: NihssItemScores = { ...normalNihss, facialPalsy4: 1, dysarthria10: 1 };
      expect(calculateNihss(minorNihss)).toEqual({ total: 2, category: 'Minor Stroke' });

      const moderateNihss: NihssItemScores = { ...normalNihss, loc1b: 1, motorArmLeft5a: 3, motorLegLeft6a: 3, sensory8: 1 };
      expect(calculateNihss(moderateNihss)).toEqual({ total: 8, category: 'Moderate Stroke' });

      const severeNihss: NihssItemScores = {
        loc1a: 2, loc1b: 2, loc1c: 2, bestGaze2: 2, visualFields3: 2,
        facialPalsy4: 3, motorArmLeft5a: 4, motorArmRight5b: 0,
        motorLegLeft6a: 4, motorLegRight6b: 0, limbAtaxia7: 0,
        sensory8: 2, bestLanguage9: 3, dysarthria10: 2, extinction11: 2
      };
      const result = calculateNihss(severeNihss);
      expect(result.total).toBe(30);
      expect(result.category).toBe('Severe Stroke');
    });
  });

  describe('calculateAspects', () => {
    it('computes ASPECTS score and risk status based on affected regions', () => {
      expect(calculateAspects([])).toEqual({ score: 10, status: 'Favorable (Minimal Core)' });

      const regions: AspectsRegion[] = ['caudate', 'lentiform'];
      expect(calculateAspects(regions)).toEqual({ score: 8, status: 'Favorable (Minimal Core)' });

      const fourRegions: AspectsRegion[] = ['caudate', 'lentiform', 'internalCapsule', 'm1'];
      expect(calculateAspects(fourRegions)).toEqual({ score: 6, status: 'Intermediate' });

      const severeInfarct: AspectsRegion[] = ['caudate', 'lentiform', 'internalCapsule', 'insularRibbon', 'm1', 'm2'];
      expect(calculateAspects(severeInfarct)).toEqual({ score: 4, status: 'Unfavorable (Large Core)' });
    });
  });

  describe('Thrombolytic Dosing', () => {
    it('calculates weight-adjusted Alteplase dosing with 90 mg maximum ceiling', () => {
      // 70 kg patient: 70 * 0.9 = 63 mg. Bolus = 6.3 mg, Infusion = 56.7 mg
      const dose70 = calculateAlteplaseDose(70);
      expect(dose70.totalDoseMg).toBe(63);
      expect(dose70.bolusDoseMg).toBe(6.3);
      expect(dose70.infusionDoseMg).toBe(56.7);

      // 120 kg patient: 120 * 0.9 = 108 mg -> capped at 90 mg (bolus 9 mg, infusion 81 mg)
      const dose120 = calculateAlteplaseDose(120);
      expect(dose120.totalDoseMg).toBe(90);
      expect(dose120.bolusDoseMg).toBe(9);
      expect(dose120.infusionDoseMg).toBe(81);
    });

    it('calculates weight-adjusted Tenecteplase single bolus with 25 mg maximum ceiling', () => {
      // 70 kg patient: 70 * 0.25 = 17.5 mg single push
      const tnk70 = calculateTenecteplaseDose(70);
      expect(tnk70.totalDoseMg).toBe(17.5);
      expect(tnk70.bolusDoseMg).toBe(17.5);

      // 110 kg patient: 110 * 0.25 = 27.5 mg -> capped at 25 mg
      const tnk110 = calculateTenecteplaseDose(110);
      expect(tnk110.totalDoseMg).toBe(25);
    });
  });

  describe('evaluateThrombolysisEligibility', () => {
    const basePatient: PatientPresentation = {
      hoursFromLastKnownWell: 2.0,
      isWakeUpStroke: false,
      age: 65,
      weightKg: 75,
      sbp: 160,
      dbp: 90,
      bloodGlucoseMgDl: 120,
      plateletCount: 250000,
      inr: 1.0,
      aptt: 28,
      onTherapeuticDoac: false,
      doacTakenWithin48h: false,
      hasLargeVesselOcclusion: true,
      lvoLocation: 'M1',
      preStrokeMrs: 0,
      ctEvidenceOfBleed: false,
      ctHypoattenuationGreaterThanThirdMca: false,
      severeHeadTraumaWithin3Months: false,
      intracranialSurgeryWithin3Months: false,
      activeInternalBleeding: false,
      giMalignancyOrBleedWithin21Days: false,
      historyOfPriorIch: false,
      recentIntracranialNeoplasmOrAvm: false
    };

    it('approves eligible patient in standard 0-3h window', () => {
      const eligibility = evaluateThrombolysisEligibility(basePatient, 14, 9, 'tenecteplase');
      expect(eligibility.isEligible).toBe(true);
      expect(eligibility.timeWindow).toBe('standard_0_to_3h');
      expect(eligibility.recommendedAgent).toBe('tenecteplase');
      expect(eligibility.dosing).toBeDefined();
    });

    it('detects intracranial hemorrhage contraindication', () => {
      const bleedPatient = { ...basePatient, ctEvidenceOfBleed: true };
      const eligibility = evaluateThrombolysisEligibility(bleedPatient, 14, 9);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.contraindications.some(c => c.includes('Intracranial hemorrhage'))).toBe(true);
    });

    it('detects blood pressure exclusion (SBP >= 185 mmHg)', () => {
      const highBpPatient = { ...basePatient, sbp: 195, dbp: 105 };
      const eligibility = evaluateThrombolysisEligibility(highBpPatient, 14, 9);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.contraindications.some(c => c.includes('185/110'))).toBe(true);
    });

    it('detects neuroglycopenia stroke mimic (glucose < 50 mg/dL)', () => {
      const hypoglycemicPatient = { ...basePatient, bloodGlucoseMgDl: 42 };
      const eligibility = evaluateThrombolysisEligibility(hypoglycemicPatient, 14, 9);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.contraindications.some(c => c.includes('hypoglycemia'))).toBe(true);
    });

    it('detects coagulopathy exclusions (INR > 1.7 or therapeutic DOAC)', () => {
      const inrPatient = { ...basePatient, inr: 2.2 };
      const eligibilityInr = evaluateThrombolysisEligibility(inrPatient, 14, 9);
      expect(eligibilityInr.isEligible).toBe(false);
      expect(eligibilityInr.contraindications.some(c => c.includes('INR'))).toBe(true);

      const doacPatient = { ...basePatient, onTherapeuticDoac: true, doacTakenWithin48h: true };
      const eligibilityDoac = evaluateThrombolysisEligibility(doacPatient, 14, 9);
      expect(eligibilityDoac.isEligible).toBe(false);
      expect(eligibilityDoac.contraindications.some(c => c.includes('DOAC'))).toBe(true);
    });

    it('approves wake-up stroke with confirmed MRI DWI-FLAIR mismatch', () => {
      const wakeUpPatient: PatientPresentation = {
        ...basePatient,
        hoursFromLastKnownWell: -1,
        isWakeUpStroke: true,
        mriDwiFlairMismatch: true
      };
      const eligibility = evaluateThrombolysisEligibility(wakeUpPatient, 12, 8);
      expect(eligibility.isEligible).toBe(true);
      expect(eligibility.timeWindow).toBe('wakeup_mri_selected');
    });

    it('rejects stroke beyond 4.5 hour window', () => {
      const latePatient = { ...basePatient, hoursFromLastKnownWell: 5.5 };
      const eligibility = evaluateThrombolysisEligibility(latePatient, 12, 8);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.timeWindow).toBe('outside_window');
    });
  });

  describe('evaluateEvtEligibility', () => {
    const basePatient: PatientPresentation = {
      hoursFromLastKnownWell: 2.5,
      isWakeUpStroke: false,
      age: 68,
      weightKg: 80,
      sbp: 165,
      dbp: 92,
      bloodGlucoseMgDl: 130,
      plateletCount: 220000,
      inr: 1.1,
      aptt: 29,
      onTherapeuticDoac: false,
      doacTakenWithin48h: false,
      hasLargeVesselOcclusion: true,
      lvoLocation: 'M1',
      preStrokeMrs: 0,
      ctEvidenceOfBleed: false,
      ctHypoattenuationGreaterThanThirdMca: false,
      severeHeadTraumaWithin3Months: false,
      intracranialSurgeryWithin3Months: false,
      activeInternalBleeding: false,
      giMalignancyOrBleedWithin21Days: false,
      historyOfPriorIch: false,
      recentIntracranialNeoplasmOrAvm: false
    };

    it('qualifies proximal LVO for early EVT in 0-6h window with favorable ASPECTS', () => {
      const evt = evaluateEvtEligibility(basePatient, 16, 9);
      expect(evt.isEligible).toBe(true);
      expect(evt.timeWindow).toBe('early_0_to_6h');
      expect(evt.targetVessel).toBe('M1');
    });

    it('disqualifies EVT when no LVO is present', () => {
      const noLvoPatient = { ...basePatient, hasLargeVesselOcclusion: false, lvoLocation: 'None' as const };
      const evt = evaluateEvtEligibility(noLvoPatient, 14, 9);
      expect(evt.isEligible).toBe(false);
      expect(evt.rationale).toContain('No Large Vessel Occlusion');
    });

    it('qualifies extended window (6-24h) with favorable ASPECTS (DAWN/DEFUSE-3 criteria)', () => {
      const extendedPatient = { ...basePatient, hoursFromLastKnownWell: 11.0 };
      const evt = evaluateEvtEligibility(extendedPatient, 15, 8);
      expect(evt.isEligible).toBe(true);
      expect(evt.timeWindow).toBe('extended_6_to_24h');
    });
  });

  describe('Comprehensive Clinical Presets Integration', () => {
    it('evaluates Preset 1 (Acute Left M1 LVO) with dual thrombolysis and EVT eligibility', () => {
      const preset = CLINICAL_STROKE_PRESETS.find(p => p.id === 'acute-m1-lvo-hyperacute')!;
      const evaluation = evaluateAcuteStroke(preset.patient, preset.nihss, preset.aspectsRegions, 'tenecteplase');

      expect(evaluation.totalNihss).toBe(20);
      expect(evaluation.nihssCategory).toBe('Moderate to Severe');
      expect(evaluation.totalAspects).toBe(9);
      expect(evaluation.thrombolysis.isEligible).toBe(true);
      expect(evaluation.evt.isEligible).toBe(true);
    });

    it('evaluates Preset 3 (Stroke Mimic - Hypoglycemia) correctly withholding thrombolysis', () => {
      const preset = CLINICAL_STROKE_PRESETS.find(p => p.id === 'stroke-mimic-hypoglycemia')!;
      const evaluation = evaluateAcuteStroke(preset.patient, preset.nihss, preset.aspectsRegions);

      expect(evaluation.thrombolysis.isEligible).toBe(false);
      expect(evaluation.thrombolysis.contraindications.some(c => c.includes('hypoglycemia'))).toBe(true);
    });

    it('evaluates Preset 4 (Anticoagulated DOAC Stroke) sending directly to EVT without IV lytic', () => {
      const preset = CLINICAL_STROKE_PRESETS.find(p => p.id === 'anticoagulated-lvo-direct-evt')!;
      const evaluation = evaluateAcuteStroke(preset.patient, preset.nihss, preset.aspectsRegions);

      expect(evaluation.thrombolysis.isEligible).toBe(false);
      expect(evaluation.thrombolysis.contraindications.some(c => c.includes('DOAC'))).toBe(true);
      expect(evaluation.evt.isEligible).toBe(true);
    });
  });
});
