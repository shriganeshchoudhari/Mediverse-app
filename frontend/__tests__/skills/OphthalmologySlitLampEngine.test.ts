import {
  computeSlitLampState,
  calculateCCTCorrection,
  OPHTHALMOLOGY_PRESETS,
  SlitLampInputParams,
} from '@/.gemini/skills/OphthalmologySlitLampEngine';

const DEFAULT_PARAMS: SlitLampInputParams = {
  presetId: 'ACUTE_ANGLE_CLOSURE_GLAUCOMA',
  slitWidthMm: 1.0,
  beamAngleDeg: 45,
  filter: 'DIFFUSE_WHITE',
  magnification: '16X',
  fluoresceinDyeInstilled: false,
  tonometerDialMmHg: 64,
  cctUm: 540,
  topicalPilocarpineGiven: false,
  ivAcetazolamideGiven: false,
  topicalTimololGiven: false,
  laserIridotomyPerformed: false,
};

describe('OphthalmologySlitLampEngine', () => {
  describe('Central Corneal Thickness (CCT) Corrections', () => {
    test('standard CCT of 540 um produces zero offset', () => {
      expect(calculateCCTCorrection(540)).toBe(0);
    });

    test('thick cornea (580 um) produces negative offset (-2 mmHg)', () => {
      // 580 - 540 = 40 um; 40 / 20 * -1 = -2
      expect(calculateCCTCorrection(580)).toBe(-2);
    });

    test('thin cornea (500 um) produces positive offset (+2 mmHg)', () => {
      // 500 - 540 = -40 um; -40 / 20 * -1 = +2
      expect(calculateCCTCorrection(500)).toBe(2);
    });

    test('CCT offset is reflected in correctedTrueIopMmHg in state', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        presetId: 'NORMAL_EYE_EXAM_GOLDMANN',
        tonometerDialMmHg: 14,
        cctUm: 580,
      });
      // Target IOP 14 + (-2) = 12 mmHg
      expect(state.goldmann.cctCorrectionOffsetMmHg).toBe(-2);
      expect(state.goldmann.correctedTrueIopMmHg).toBe(12);
    });
  });

  describe('Goldmann Applanation Tonometry Semicircle Alignment', () => {
    test('detects perfect alignment when dial matches true IOP within 1 mmHg', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        presetId: 'NORMAL_EYE_EXAM_GOLDMANN',
        tonometerDialMmHg: 14,
        cctUm: 540,
      });
      expect(state.goldmann.fluoresceinSemicirclesAligned).toBe(true);
      expect(state.goldmann.semicirclesOverlapMm).toBe(0);
    });

    test('calculates positive overlap when dial is set too high (over-applanation)', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        presetId: 'NORMAL_EYE_EXAM_GOLDMANN',
        tonometerDialMmHg: 20, // true IOP is 14
        cctUm: 540,
      });
      expect(state.goldmann.fluoresceinSemicirclesAligned).toBe(false);
      expect(state.goldmann.semicirclesOverlapMm).toBe(0.6); // (20-14)*0.1
    });

    test('calculates negative overlap when dial is set too low (under-applanation)', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        presetId: 'NORMAL_EYE_EXAM_GOLDMANN',
        tonometerDialMmHg: 8, // true IOP is 14
        cctUm: 540,
      });
      expect(state.goldmann.fluoresceinSemicirclesAligned).toBe(false);
      expect(state.goldmann.semicirclesOverlapMm).toBe(-0.6); // (8-14)*0.1
    });
  });

  describe('Acute Angle-Closure Glaucoma Crisis & Interventions', () => {
    test('baseline acute angle closure has severe crisis alarm and closed angle (Van Herick 0)', () => {
      const state = computeSlitLampState(DEFAULT_PARAMS);
      expect(state.activeAlarms).toContain('ACUTE_ANGLE_CLOSURE_CRISIS');
      expect(state.activeAlarms).toContain('CLOSED_ANGLE_VAN_HERICK_0');
      expect(state.vanHerick).toBe('GRADE_0_CLOSED');
      expect(state.pupilStatus).toContain('Mid-dilated 5.5 mm');
      expect(state.clinicalRecommendation).toContain('OPHTHALMIC EMERGENCY');
    });

    test('medical therapy stepwise reduces IOP', () => {
      const baseline = computeSlitLampState(DEFAULT_PARAMS);
      const withAcetazolamide = computeSlitLampState({
        ...DEFAULT_PARAMS,
        ivAcetazolamideGiven: true,
      });
      const withTripleMedical = computeSlitLampState({
        ...DEFAULT_PARAMS,
        ivAcetazolamideGiven: true,
        topicalTimololGiven: true,
        topicalPilocarpineGiven: true,
      });

      expect(withAcetazolamide.goldmann.correctedTrueIopMmHg).toBe(
        baseline.goldmann.correctedTrueIopMmHg - 18
      );
      // 64 - 18 - 8 - 6 = 32 mmHg
      expect(withTripleMedical.goldmann.correctedTrueIopMmHg).toBe(32);
    });

    test('laser iridotomy provides definitive cure, opens angle to Grade 3, and normalizes IOP', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        laserIridotomyPerformed: true,
      });
      expect(state.goldmann.correctedTrueIopMmHg).toBe(16);
      expect(state.vanHerick).toBe('GRADE_3_OPEN');
      expect(state.pupilStatus).toContain('reactive post-iridotomy');
      expect(state.activeAlarms).not.toContain('ACUTE_ANGLE_CLOSURE_CRISIS');
      expect(state.activeAlarms).not.toContain('CLOSED_ANGLE_VAN_HERICK_0');
    });
  });

  describe('HSV Dendritic Keratitis & Fluorescein', () => {
    test('HSV keratitis raises corneal ulcer alarm with characteristic findings', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        ...OPHTHALMOLOGY_PRESETS.HSV_DENDRITIC_KERATITIS.initialState,
        presetId: 'HSV_DENDRITIC_KERATITIS',
      });
      expect(state.activeAlarms).toContain('CORNEAL_DENDRITIC_ULCER_HSV');
      expect(state.pathologyFindings).toContain('terminal bulbous end-feet');
      expect(state.clinicalRecommendation).toContain('Ganciclovir');
      expect(state.clinicalRecommendation).toContain('CONTRAINDICATION: Do NOT administer topical corticosteroids');
    });
  });

  describe('Penetrating Globe Laceration & Seidel Test', () => {
    test('penetrating globe presents with Seidel positivity, hypotony, and teardrop pupil', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        ...OPHTHALMOLOGY_PRESETS.PENETRATING_GLOBE_SEIDEL_POSITIVE.initialState,
        presetId: 'PENETRATING_GLOBE_SEIDEL_POSITIVE',
      });
      expect(state.seidelTestPositive).toBe(true);
      expect(state.activeAlarms).toContain('GLOBE_RUPTURE_SEIDEL_POSITIVE');
      expect(state.pupilStatus).toContain('Peaked irregular teardrop pupil');
      expect(state.clinicalRecommendation).toContain('SURGICAL EMERGENCY');
      expect(state.clinicalRecommendation).toContain('Fox eye shield');
    });
  });

  describe('Acute Anterior Uveitis & Hypopyon', () => {
    test('severe anterior uveitis displays Grade 4+ hypopyon alarm', () => {
      const state = computeSlitLampState({
        ...DEFAULT_PARAMS,
        ...OPHTHALMOLOGY_PRESETS.ACUTE_ANTERIOR_UVEITIS_HYPOPYON.initialState,
        presetId: 'ACUTE_ANTERIOR_UVEITIS_HYPOPYON',
      });
      expect(state.anteriorChamberCells).toBe('GRADE_4_INTENSE_HYPOPYON');
      expect(state.activeAlarms).toContain('SEVERE_UVEITIS_HYPOPYON');
      expect(state.pathologyFindings).toContain('hypopyon');
    });
  });
});
