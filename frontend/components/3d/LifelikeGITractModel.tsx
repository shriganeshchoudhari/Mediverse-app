'use client';

/**
 * LifelikeGITractModel.tsx
 * Photorealistic GI Tract 3D Component
 * Location: frontend/components/3d/LifelikeGITractModel.tsx
 *
 * Renders the upper GI tract with:
 *  - Esophagus, stomach body, fundus, antrum/pylorus with sphincter
 *  - Duodenal C-loop TubeGeometry
 *  - Animated intestinal villi
 *  - Liver wedge and gallbladder context geometry
 *  - Peristaltic wave driving stomach scale pulse
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CatmullRomCurve3 } from 'three';
import { computeGIMotilityState } from '@/.gemini/skills/3d/PeristalticMotilityEngine';
import { createBiologicalTissueMaterial } from '@/.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeGITractModelProps {
  fastingState?: boolean;     // default false
  peristalsisRate?: number;   // 1.0 = normal, default 1.0
  clippingPlanes?: THREE.Plane[];
}

// Intestinal villi placement data  [x, y, z]
const VILLI_POSITIONS: [number, number, number][] = [
  [0.25, 0.02, 0.15],
  [0.35, 0.02, 0.15],
  [0.45, 0.02, 0.15],
  [0.25, -0.02, -0.15],
  [0.35, -0.02, -0.15],
  [0.45, -0.02, -0.15],
];

// Duodenal C-loop path
const DUODENUM_CURVE = new CatmullRomCurve3([
  new THREE.Vector3(0.5, -0.1, 0),
  new THREE.Vector3(0.65, -0.35, 0.2),
  new THREE.Vector3(0.55, -0.65, 0),
  new THREE.Vector3(0.3, -0.75, -0.1),
]);

export default function LifelikeGITractModel({
  fastingState = false,
  peristalsisRate = 1.0,
  clippingPlanes = [],
}: LifelikeGITractModelProps) {
  const giGroupRef = useRef<THREE.Group>(null);
  const stomachRef = useRef<THREE.Mesh>(null);
  const pyloriRingRef = useRef<THREE.Mesh>(null);
  const villiRefs = useRef<(THREE.Mesh | null)[]>([]);

  // ─── PBR Materials ──────────────────────────────────────────────────────────
  const mucosalMat = useMemo(
    () => createBiologicalTissueMaterial('mucosal_lining', { clippingPlanes }),
    [clippingPlanes]
  );
  const hepaticMat = useMemo(
    () => createBiologicalTissueMaterial('hepatic_tissue', { clippingPlanes }),
    [clippingPlanes]
  );

  // ─── Duodenum TubeGeometry (computed once) ──────────────────────────────────
  const duodenumTube = useMemo(
    () => new THREE.TubeGeometry(DUODENUM_CURVE, 20, 0.09, 8, false),
    []
  );

  // ─── Animation Loop ─────────────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.elapsedTime * peristalsisRate;
    const gi = computeGIMotilityState(t, fastingState);

    // Peristaltic wave: stomach body scale.x slight pulse driven by segment 0 contraction
    if (stomachRef.current) {
      const pulse = 1.0 + gi.segmentContractionAmplitudes[0] * 0.12;
      stomachRef.current.scale.set(1.3 * pulse, 0.88, 0.78);
    }

    // Pyloric sphincter: scale driven by open state (thicker ring when closed)
    if (pyloriRingRef.current) {
      const closedScale = 1.0 + (1.0 - gi.pyloriSphincterOpen) * 0.6;
      pyloriRingRef.current.scale.set(closedScale, closedScale, closedScale);
    }

    // Intestinal villi sway
    villiRefs.current.forEach((mesh, idx) => {
      if (mesh) {
        mesh.rotation.z = Math.sin(gi.villiMotionPhase + idx * 0.8) * 0.18;
      }
    });
  });

  return (
    <group ref={giGroupRef} rotation={[0.2, 0.4, 0]}>
      {/* ───────────────────────────────────────────────────────────────────
          1. ESOPHAGUS
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[-0.45, 0.85, 0]} rotation={[0, 0, 0.35]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.7, 16]} />
        <primitive object={mucosalMat} attach="material" />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          2. STOMACH BODY (asymmetric greater/lesser curvature)
      ─────────────────────────────────────────────────────────────────── */}
      <mesh ref={stomachRef} position={[-0.2, 0.22, 0]} scale={[1.3, 0.88, 0.78]} castShadow receiveShadow>
        <sphereGeometry args={[0.52, 32, 32]} />
        <primitive object={mucosalMat} attach="material" />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          3. FUNDUS BULGE
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[-0.52, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshPhysicalMaterial
          color="#fb7185"
          roughness={0.32}
          metalness={0.02}
          transmission={0.2}
          thickness={0.5}
          clearcoat={0.9}
          clearcoatRoughness={0.06}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          4. ANTRUM / PYLORIC REGION
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[0.3, 0.12, 0]} rotation={[0, 0, -0.6]} castShadow>
        <cylinderGeometry args={[0.15, 0.08, 0.35, 16]} />
        <meshPhysicalMaterial
          color="#fb7185"
          roughness={0.35}
          metalness={0.02}
          clearcoat={0.85}
          clearcoatRoughness={0.08}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          5. PYLORIC SPHINCTER RING
      ─────────────────────────────────────────────────────────────────── */}
      <mesh
        ref={pyloriRingRef}
        position={[0.48, 0.0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <torusGeometry args={[0.09, 0.03, 8, 20]} />
        <meshPhysicalMaterial
          color="#e11d48"
          roughness={0.3}
          metalness={0.04}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          6. DUODENAL C-LOOP (TubeGeometry CatmullRomCurve3)
      ─────────────────────────────────────────────────────────────────── */}
      <mesh castShadow>
        <primitive object={duodenumTube} attach="geometry" />
        <meshPhysicalMaterial
          color="#fb923c"
          roughness={0.38}
          metalness={0.03}
          transmission={0.18}
          thickness={0.45}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          7. INTESTINAL VILLI (6 animated finger-like projections)
      ─────────────────────────────────────────────────────────────────── */}
      {VILLI_POSITIONS.map((pos, idx) => (
        <mesh
          key={`villus-${idx}`}
          ref={(el) => { villiRefs.current[idx] = el; }}
          position={pos}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.015, 0.22, 8]} />
          <meshPhysicalMaterial
            color="#fda4af"
            roughness={0.42}
            metalness={0.01}
            transmission={0.22}
            thickness={0.3}
            clearcoat={0.9}
            clearcoatRoughness={0.06}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}

      {/* ───────────────────────────────────────────────────────────────────
          8. LIVER WEDGE (anatomical context)
      ─────────────────────────────────────────────────────────────────── */}
      <mesh
        position={[-0.8, 0.7, -0.3]}
        rotation={[0.1, 0.2, 0.15]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <primitive object={hepaticMat} attach="material" />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          9. GALLBLADDER
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[-0.58, 0.5, 0.22]} scale={[1.2, 1.5, 1.0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial
          color="#16a34a"
          transmission={0.3}
          thickness={0.6}
          roughness={0.22}
          metalness={0.04}
          clearcoat={0.95}
          clearcoatRoughness={0.06}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}
