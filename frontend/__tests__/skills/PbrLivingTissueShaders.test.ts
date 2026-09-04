import * as THREE from 'three';
import {
  createBiologicalTissueMaterial,
  BiologicalTissueType,
} from '../../.gemini/skills/3d/PbrLivingTissueShaders';

describe('PbrLivingTissueShaders', () => {
  it('creates Myocardium material with Subsurface Scattering and high clearcoat', () => {
    const mat = createBiologicalTissueMaterial('myocardium', {
      wetness: 1.0,
      subsurfaceScattering: true,
    }) as THREE.MeshPhysicalMaterial;

    expect(mat).toBeInstanceOf(THREE.MeshPhysicalMaterial);
    expect(mat.transmission).toBeCloseTo(0.22, 2);
    expect(mat.thickness).toBe(1.2);
    expect(mat.clearcoat).toBeCloseTo(0.95, 2);
    expect(mat.color.getHexString()).toBe('be123c');
  });

  it('creates Cortical Bone material without transmission and higher roughness', () => {
    const mat = createBiologicalTissueMaterial('cortical_bone') as THREE.MeshStandardMaterial;

    expect(mat).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(mat.roughness).toBeCloseTo(0.62, 2);
    expect(mat.color.getHexString()).toBe('f8fafc');
  });

  it('creates Ocular Cornea with optical transparency and physiological refractive index', () => {
    const mat = createBiologicalTissueMaterial('ocular_cornea') as THREE.MeshPhysicalMaterial;

    expect(mat).toBeInstanceOf(THREE.MeshPhysicalMaterial);
    expect(mat.transmission).toBeCloseTo(0.98, 2);
    expect(mat.ior).toBeCloseTo(1.376, 3); // Human cornea IOR
    expect(mat.roughness).toBeCloseTo(0.02, 2);
  });

  it('creates Pulmonary, Renal, and Hepatic tissues with distinctive attenuation hues', () => {
    const lung = createBiologicalTissueMaterial('pulmonary_parenchyma') as THREE.MeshPhysicalMaterial;
    const renal = createBiologicalTissueMaterial('renal_parenchyma') as THREE.MeshPhysicalMaterial;
    const liver = createBiologicalTissueMaterial('hepatic_tissue') as THREE.MeshPhysicalMaterial;

    expect(lung.attenuationColor.getHexString()).toBe('fda4af');
    expect(renal.attenuationColor.getHexString()).toBe('701a75');
    expect(liver.attenuationColor.getHexString()).toBe('451a03');
  });

  it('correctly binds clipping planes to materials', () => {
    const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    const mat = createBiologicalTissueMaterial('arterial_wall', {
      clippingPlanes: [plane],
    }) as THREE.MeshPhysicalMaterial;

    expect(mat.clippingPlanes).toHaveLength(1);
    expect(mat.clipShadows).toBe(true);
  });
});
