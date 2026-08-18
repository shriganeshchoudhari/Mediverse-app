import * as THREE from 'three';

export type DissectionPlaneType = 'none' | 'sagittal' | 'coronal' | 'transverse';

export interface DissectionState {
  activePlane: DissectionPlaneType;
  planeOffset: number; // Normalized range -1.0 to 1.0
}

/**
 * Generates THREE.Plane clipping instances based on anatomical plane selection and offset.
 */
export function createClippingPlanes(state: DissectionState): THREE.Plane[] {
  if (state.activePlane === 'none') {
    return [];
  }

  const planes: THREE.Plane[] = [];

  switch (state.activePlane) {
    case 'sagittal':
      // Sagittal divides left and right (X-axis)
      planes.push(new THREE.Plane(new THREE.Vector3(-1, 0, 0), state.planeOffset * 2.0));
      break;
    case 'coronal':
      // Coronal divides anterior and posterior (Z-axis)
      planes.push(new THREE.Plane(new THREE.Vector3(0, 0, -1), state.planeOffset * 2.0));
      break;
    case 'transverse':
      // Transverse divides superior and inferior (Y-axis)
      planes.push(new THREE.Plane(new THREE.Vector3(0, -1, 0), state.planeOffset * 2.0));
      break;
  }

  return planes;
}

/**
 * Reusable scratch vector for zero-allocation math during render loops.
 */
export const _scratchVec3 = new THREE.Vector3();
export const _scratchMatrix4 = new THREE.Matrix4();
export const _scratchQuaternion = new THREE.Quaternion();
