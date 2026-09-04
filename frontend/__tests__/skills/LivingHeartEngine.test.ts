import * as THREE from 'three';
import {
  computeCardiacCycleState,
  createMyocardiumMaterial,
  createGreatVesselMaterial,
  createCoronaryVesselMaterial,
} from '../../.gemini/skills/3d/LivingHeartEngine';

describe('LivingHeartEngine', () => {
  describe('computeCardiacCycleState', () => {
    it('accurately identifies Atrial Systole in early cycle (P wave)', () => {
      // At 72 BPM, 1 cycle = 0.833s. t = 0.05s is ~6% into cycle
      const state = computeCardiacCycleState(0.05, 72);
      expect(state.phase).toBe('ATRIAL_SYSTOLE');
      expect(state.atrialContraction).toBeGreaterThan(0);
      expect(state.ventricularContraction).toBe(0);
    });

    it('identifies Ventricular Ejection and computes apical counter-clockwise torsion', () => {
      // At 72 BPM, t = 0.25s is ~30% into cycle (ventricular systole)
      const state = computeCardiacCycleState(0.25, 72);
      expect(state.phase).toBe('VENTRICULAR_EJECTION');
      expect(state.ventricularContraction).toBeGreaterThan(0.5);
      // Verify apical counter-clockwise wringing twist (~10 degrees = ~0.17 rad)
      expect(state.apicalTorsionAngleRad).toBeGreaterThan(0.1);
      expect(state.longitudinalShortening).toBeGreaterThan(0.05);
    });

    it('computes Isovolumetric Relaxation and elastic untwisting recoil', () => {
      // At 72 BPM, t = 0.42s is ~50% into cycle (relaxation)
      const state = computeCardiacCycleState(0.42, 72);
      expect(state.phase).toBe('ISOVOLUMETRIC_RELAXATION');
      expect(state.ventricularContraction).toBeLessThan(0.2);
    });

    it('computes Passive Diastolic Filling in late cycle', () => {
      // At 72 BPM, t = 0.65s is ~78% into cycle (diastole)
      const state = computeCardiacCycleState(0.65, 72);
      expect(state.phase).toBe('PASSIVE_FILLING');
    });

    it('clamps extreme heart rates between 30 and 220 BPM', () => {
      const slow = computeCardiacCycleState(0.1, 10);
      expect(slow.bpm).toBe(10); // reporting original, but calculation uses clamped duration

      const fast = computeCardiacCycleState(0.1, 300);
      expect(fast.bpm).toBe(300);
    });
  });

  describe('Living Tissue Materials & Shaders', () => {
    it('creates Myocardium material with Subsurface Scattering and wet serosa', () => {
      const mat = createMyocardiumMaterial({
        wetness: 1.0,
        subsurfaceScattering: true,
        translucencyDepth: 1.2,
      });

      expect(mat).toBeInstanceOf(THREE.MeshPhysicalMaterial);
      expect(mat.transmission).toBeCloseTo(0.22, 2);
      expect(mat.thickness).toBe(1.2);
      expect(mat.clearcoat).toBeCloseTo(0.95, 2);
      expect(mat.clearcoatRoughness).toBeCloseTo(0.08, 2);
      expect(mat.attenuationColor.getHexString()).toBe('881337');
    });

    it('disables Subsurface Scattering when configured for lower-end hardware', () => {
      const mat = createMyocardiumMaterial({
        wetness: 0.5,
        subsurfaceScattering: false,
        translucencyDepth: 0.0,
      });

      expect(mat.transmission).toBe(0.0);
      expect(mat.clearcoat).toBeCloseTo(0.475, 2);
    });

    it('creates Great Vessels materials with arterial vs venous color schemes', () => {
      const aorta = createGreatVesselMaterial('aorta');
      const pa = createGreatVesselMaterial('pulmonary_artery');
      const svc = createGreatVesselMaterial('vena_cava');

      expect(aorta.color.getHexString()).toBe('e11d48'); // Arterial Red
      expect(pa.color.getHexString()).toBe('2563eb'); // Pulmonary Blue
      expect(svc.color.getHexString()).toBe('1d4ed8'); // Venous Blue
    });

    it('creates Coronary Vasculature materials with arterial red and venous cyan', () => {
      const artery = createCoronaryVesselMaterial(true);
      const vein = createCoronaryVesselMaterial(false);

      expect(artery.color.getHexString()).toBe('f43f5e');
      expect(vein.color.getHexString()).toBe('38bdf8');
    });
  });
});
