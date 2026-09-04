/**
 * PbrLivingTissueShaders.ts
 * Universal Biological Living Tissue PBR Shader Factory
 * Location: frontend/.gemini/skills/3d/PbrLivingTissueShaders.ts
 *
 * Provides clinically-calibrated physical materials with Subsurface Scattering (SSS),
 * visceral serous fluid wetness, and optical attenuation for all human organ systems.
 */

import * as THREE from 'three';

export type BiologicalTissueType =
  | 'myocardium'
  | 'skeletal_muscle'
  | 'cortical_bone'
  | 'pulmonary_parenchyma'
  | 'renal_parenchyma'
  | 'hepatic_tissue'
  | 'cerebral_cortex'
  | 'arterial_wall'
  | 'venous_wall'
  | 'ocular_cornea'
  | 'ocular_sclera'
  | 'mucosal_lining';

export interface TissueShaderOptions {
  wetness?: number; // 0.0 (dry) to 1.0 (drenched serous fluid)
  subsurfaceScattering?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export function createBiologicalTissueMaterial(
  type: BiologicalTissueType,
  options: TissueShaderOptions = {}
): THREE.Material {
  const { wetness = 0.9, subsurfaceScattering = true, clippingPlanes = [] } = options;

  switch (type) {
    case 'myocardium':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#be123c'),
        emissive: new THREE.Color('#4c0519'),
        emissiveIntensity: 0.12,
        roughness: 0.36,
        metalness: 0.05,
        transmission: subsurfaceScattering ? 0.22 : 0,
        thickness: 1.2,
        attenuationColor: new THREE.Color('#881337'),
        attenuationDistance: 0.55,
        clearcoat: wetness * 0.95,
        clearcoatRoughness: 0.08,
        clippingPlanes,
        clipShadows: true,
      });

    case 'skeletal_muscle':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#9f1239'),
        roughness: 0.42,
        metalness: 0.02,
        transmission: subsurfaceScattering ? 0.15 : 0,
        thickness: 0.9,
        attenuationColor: new THREE.Color('#881337'),
        attenuationDistance: 0.6,
        clearcoat: wetness * 0.75,
        clearcoatRoughness: 0.14,
        clippingPlanes,
        clipShadows: true,
      });

    case 'cortical_bone':
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f8fafc'),
        roughness: 0.62,
        metalness: 0.08,
        clippingPlanes,
        clipShadows: true,
      });

    case 'pulmonary_parenchyma':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#fb7185'),
        roughness: 0.65,
        metalness: 0.02,
        transmission: subsurfaceScattering ? 0.18 : 0,
        thickness: 0.65,
        attenuationColor: new THREE.Color('#fda4af'),
        attenuationDistance: 0.45,
        clearcoat: wetness * 0.45,
        clearcoatRoughness: 0.22,
        clippingPlanes,
        clipShadows: true,
      });

    case 'renal_parenchyma':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#831843'),
        roughness: 0.38,
        metalness: 0.05,
        transmission: subsurfaceScattering ? 0.2 : 0,
        thickness: 1.1,
        attenuationColor: new THREE.Color('#701a75'),
        attenuationDistance: 0.5,
        clearcoat: wetness * 0.9,
        clearcoatRoughness: 0.1,
        clippingPlanes,
        clipShadows: true,
      });

    case 'hepatic_tissue':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#78350f'),
        roughness: 0.35,
        metalness: 0.05,
        transmission: subsurfaceScattering ? 0.15 : 0,
        thickness: 1.4,
        attenuationColor: new THREE.Color('#451a03'),
        attenuationDistance: 0.6,
        clearcoat: wetness * 0.92,
        clearcoatRoughness: 0.08,
        clippingPlanes,
        clipShadows: true,
      });

    case 'cerebral_cortex':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e2e8f0'),
        roughness: 0.48,
        metalness: 0.03,
        transmission: subsurfaceScattering ? 0.12 : 0,
        thickness: 0.8,
        attenuationColor: new THREE.Color('#cbd5e1'),
        attenuationDistance: 0.4,
        clearcoat: wetness * 0.85,
        clearcoatRoughness: 0.12,
        clippingPlanes,
        clipShadows: true,
      });

    case 'arterial_wall':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e11d48'),
        roughness: 0.28,
        metalness: 0.08,
        clearcoat: wetness * 0.92,
        clearcoatRoughness: 0.1,
        clippingPlanes,
        clipShadows: true,
      });

    case 'venous_wall':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#2563eb'),
        roughness: 0.3,
        metalness: 0.08,
        clearcoat: wetness * 0.9,
        clearcoatRoughness: 0.12,
        clippingPlanes,
        clipShadows: true,
      });

    case 'ocular_cornea':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        roughness: 0.02,
        metalness: 0.0,
        transmission: 0.98,
        thickness: 0.15,
        ior: 1.376, // Human corneal refractive index
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        clippingPlanes,
        clipShadows: true,
      });

    case 'ocular_sclera':
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f1f5f9'),
        roughness: 0.22,
        metalness: 0.05,
        clippingPlanes,
        clipShadows: true,
      });

    case 'mucosal_lining':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f43f5e'),
        roughness: 0.32,
        metalness: 0.02,
        transmission: subsurfaceScattering ? 0.25 : 0,
        thickness: 0.5,
        attenuationColor: new THREE.Color('#be123c'),
        attenuationDistance: 0.3,
        clearcoat: wetness * 1.0,
        clearcoatRoughness: 0.05,
        clippingPlanes,
        clipShadows: true,
      });

    default:
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#cbd5e1'),
        clippingPlanes,
      });
  }
}
