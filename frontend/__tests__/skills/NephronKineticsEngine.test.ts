import * as THREE from 'three';
import {
  computeNephronFiltrationState,
  createRenalPyramidMaterial,
} from '../../.gemini/skills/3d/NephronKineticsEngine';

describe('NephronKineticsEngine', () => {
  it('computes Starling Net Filtration Pressure and physiological GFR', () => {
    const filtration = computeNephronFiltrationState(1.0, 93);
    expect(filtration.gfrMlMin).toBeGreaterThan(60);
    expect(filtration.gfrMlMin).toBeLessThan(160);
    expect(filtration.netFiltrationPressureMmHg).toBeGreaterThan(10);
    expect(filtration.afferentPgcMmHg).toBeCloseTo(60, 0);
    expect(filtration.bowmanSpacePbsMmHg).toBe(15);
    expect(filtration.plasmaOncoticMmHg).toBe(29);
  });

  it('demonstrates autoregulated stability across physiological MAP range', () => {
    const normotensive = computeNephronFiltrationState(0, 93);
    const hypertensive = computeNephronFiltrationState(0, 140);
    // GFR should remain relatively stable due to autoregulation
    expect(Math.abs(hypertensive.gfrMlMin - normotensive.gfrMlMin)).toBeLessThan(35);
  });

  it('creates Renal Pyramid material with Subsurface Scattering and deep crimson color', () => {
    const mat = createRenalPyramidMaterial();
    expect(mat).toBeInstanceOf(THREE.MeshPhysicalMaterial);
    expect(mat.color.getHexString()).toBe('9f1239');
    expect(mat.transmission).toBeCloseTo(0.18, 2);
    expect(mat.thickness).toBe(1.0);
  });
});
