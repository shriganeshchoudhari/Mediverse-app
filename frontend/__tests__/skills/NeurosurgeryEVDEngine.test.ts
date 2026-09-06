import {
  computeEVDHydrodynamics,
  evaluateVentriculostomyTrajectory,
  EVD_PRESETS,
  EVDInputParams,
} from '@/.gemini/skills/NeurosurgeryEVDEngine';

const DEFAULT_PARAMS: EVDInputParams = {
  presetId: 'ANEURYSMAL_SAH_ACUTE_HYDROCEPHALUS',
  trajectory: {
    burrHoleFromNasionCm: 11.0,
    burrHoleFromMidlineCm: 3.0,
    coronalAngleDeg: 90,
    sagittalAngleDeg: 90,
    catheterDepthCm: 6.0,
  },
  chamberHeightCmH2O: 15,
  clampState: 'OPEN_DRAINING',
  catheterPatencyPercent: 90,
  hypertonicSalineGiven: false,
  mannitolGiven: false,
  sterileFlushPerformed: false,
  intrathecalTpaGiven: false,
};

describe('NeurosurgeryEVDEngine', () => {
  describe('Stereotactic Ventriculostomy Trajectory Evaluation', () => {
    test('identifies optimal Kocher point trajectory into frontal horn', () => {
      const result = evaluateVentriculostomyTrajectory({
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      });
      expect(result.ventricleCannulated).toBe(true);
      expect(result.accuracy).toBe('OPTIMAL_FORAMEN_MONRO');
    });

    test('flags trajectory as too shallow when depth < 5.0 cm', () => {
      const result = evaluateVentriculostomyTrajectory({
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 4.2,
      });
      expect(result.ventricleCannulated).toBe(false);
      expect(result.accuracy).toBe('TOO_SHALLOW');
    });

    test('flags trajectory as too deep into brainstem when depth > 7.0 cm', () => {
      const result = evaluateVentriculostomyTrajectory({
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 90,
        sagittalAngleDeg: 90,
        catheterDepthCm: 7.5,
      });
      expect(result.ventricleCannulated).toBe(false);
      expect(result.accuracy).toBe('TOO_DEEP_MIDBRAIN');
    });

    test('detects medial fornix risk on excessive medial angulation (< 80 deg)', () => {
      const result = evaluateVentriculostomyTrajectory({
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 75,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      });
      expect(result.ventricleCannulated).toBe(false);
      expect(result.accuracy).toBe('MEDIAL_FORNIX_RISK');
    });

    test('detects lateral internal capsule risk on excessive lateral angulation (> 100 deg)', () => {
      const result = evaluateVentriculostomyTrajectory({
        burrHoleFromNasionCm: 11.0,
        burrHoleFromMidlineCm: 3.0,
        coronalAngleDeg: 105,
        sagittalAngleDeg: 90,
        catheterDepthCm: 6.0,
      });
      expect(result.ventricleCannulated).toBe(false);
      expect(result.accuracy).toBe('LATERAL_CAPSULAR_RISK');
    });
  });

  describe('EVD Hydrodynamics & CSF Drainage Mechanics', () => {
    test('computes CSF drainage and driving pressure in open draining state', () => {
      const state = computeEVDHydrodynamics(DEFAULT_PARAMS);
      expect(state.ventricleCannulated).toBe(true);
      expect(state.csfDrainageRateMlHr).toBeGreaterThan(0);
      expect(state.drivingPressureCmH2O).toBeGreaterThan(0);
      expect(state.pulsatilityIntact).toBe(true);
    });

    test('halts CSF drainage when EVD is clamped', () => {
      const state = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        clampState: 'CLAMPED_MONITORING',
      });
      expect(state.csfDrainageRateMlHr).toBe(0);
    });

    test('hypertonic saline bolus lowers ICP and raises CPP', () => {
      const baseline = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        clampState: 'CLAMPED_MONITORING',
      });
      const withSaline = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        clampState: 'CLAMPED_MONITORING',
        hypertonicSalineGiven: true,
      });
      expect(withSaline.icpMmHg).toBeLessThan(baseline.icpMmHg);
      expect(withSaline.cppMmHg).toBeGreaterThan(baseline.cppMmHg);
    });

    test('mannitol bolus lowers ICP', () => {
      const baseline = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        clampState: 'CLAMPED_MONITORING',
      });
      const withMannitol = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        clampState: 'CLAMPED_MONITORING',
        mannitolGiven: true,
      });
      expect(withMannitol.icpMmHg).toBe(baseline.icpMmHg - 6);
    });
  });

  describe('Pathology Presets & Clinical Alarms', () => {
    test('detects catheter occlusion and absent pulsation in clotted IVH preset', () => {
      const state = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        ...EVD_PRESETS.IVH_CLOTTED_CATHETER_OCCLUSION.initialState,
        presetId: 'IVH_CLOTTED_CATHETER_OCCLUSION',
      });
      expect(state.activeAlarms).toContain('CATHETER_OCCLUSION_NO_PULSATION');
      expect(state.pulsatilityIntact).toBe(false);
      expect(state.clinicalRecommendation).toContain('CAUTION: Catheter occlusion');
    });

    test('sterile flush and intrathecal tPA restore patency and pulsatility', () => {
      const restored = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        ...EVD_PRESETS.IVH_CLOTTED_CATHETER_OCCLUSION.initialState,
        presetId: 'IVH_CLOTTED_CATHETER_OCCLUSION',
        sterileFlushPerformed: true,
        intrathecalTpaGiven: true,
      });
      expect(restored.pulsatilityIntact).toBe(true);
      expect(restored.activeAlarms).not.toContain('CATHETER_OCCLUSION_NO_PULSATION');
    });

    test('detects critical overdrainage and slit ventricle collapse when burette is too low', () => {
      const state = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        ...EVD_PRESETS.OVERDRAINAGE_SLIT_VENTRICLE.initialState,
        presetId: 'OVERDRAINAGE_SLIT_VENTRICLE',
      });
      expect(state.activeAlarms).toContain('CRITICAL_OVERDRAINAGE_COLLAPSE');
      expect(state.activeAlarms).toContain('VENTRICULAR_SLIT_COLLAPSE');
      expect(state.clinicalRecommendation).toContain('DANGER: Acute CSF Overdrainage');
    });

    test('reassuring post-op weaning state has optimal alarm and intact CPP', () => {
      const state = computeEVDHydrodynamics({
        ...DEFAULT_PARAMS,
        ...EVD_PRESETS.POST_OP_EVD_WEANING_CLAMP_TEST.initialState,
        presetId: 'POST_OP_EVD_WEANING_CLAMP_TEST',
      });
      expect(state.activeAlarms).toContain('OPTIMAL');
      expect(state.icpMmHg).toBeLessThan(20);
      expect(state.cppMmHg).toBeGreaterThan(60);
    });
  });
});
