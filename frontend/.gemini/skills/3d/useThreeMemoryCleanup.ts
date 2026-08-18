import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * Custom hook to safely traverse and dispose of Three.js scenes, geometries,
 * materials, and GPU textures on component unmount, preventing WebGL VRAM leaks.
 */
export function useThreeMemoryCleanup(sceneRef: React.RefObject<THREE.Object3D | null>) {
  useEffect(() => {
    return () => {
      const scene = sceneRef.current;
      if (!scene) return;

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        // Dispose geometries
        if (object.geometry) {
          object.geometry.dispose();
        }

        // Dispose materials and textures
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => disposeMaterial(mat));
          } else {
            disposeMaterial(object.material);
          }
        }
      });
    };
  }, [sceneRef]);
}

function disposeMaterial(material: THREE.Material) {
  material.dispose();

  // Dispose texture maps if present
  const mat = material as unknown as Record<string, unknown>;
  const textureKeys = ['map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap', 'alphaMap', 'aoMap', 'displacementMap', 'roughnessMap', 'metalnessMap'];

  for (const key of textureKeys) {
    const tex = mat[key];
    if (tex && tex instanceof THREE.Texture) {
      tex.dispose();
    }
  }
}
