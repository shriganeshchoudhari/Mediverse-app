/**
 * SpatialXRPresets.ts
 * WebXR Spatial Computing Configs, Hand-Tracking Profiles & VR Scene Environment
 * Part of Mediverse Frontend Skills
 */

export interface WebXRSessionConfig {
  mode: 'immersive-vr' | 'immersive-ar' | 'inline';
  referenceSpaceType: 'local-floor' | 'bounded-floor' | 'local' | 'viewer';
  requiredFeatures: string[];
  optionalFeatures: string[];
}

export const DEFAULT_MEDICAL_XR_CONFIG: WebXRSessionConfig = {
  mode: 'immersive-vr',
  referenceSpaceType: 'local-floor',
  requiredFeatures: ['local-floor'],
  optionalFeatures: ['hand-tracking', 'hit-test', 'mesh-detection', 'spatial-audio'],
};

export const SPATIAL_DISSECTION_TOOLS = [
  {
    id: 'scalpel',
    name: 'Spatial Scalpel',
    description: 'Precision dissection of tissue planes with haptic feedback vibration.',
    hapticIntensity: 0.8,
  },
  {
    id: 'forceps',
    name: 'Anatomical Forceps',
    description: 'Pinch and grasp organs for 360-degree rotational inspection.',
    hapticIntensity: 0.4,
  },
  {
    id: 'socratic-pointer',
    name: 'AI Socratic Laser Pointer',
    description: 'Point to any anatomical landmark to trigger voice clinical explanation.',
    hapticIntensity: 0.2,
  },
];
