'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  computeNephronFiltrationState,
  createRenalPyramidMaterial,
} from '@/.gemini/skills/3d/NephronKineticsEngine';
import { createBiologicalTissueMaterial } from '@/.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeKidneyModelProps {
  meanArterialPressure?: number;
  isPaused?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeKidneyModel({
  meanArterialPressure = 93,
  isPaused = false,
  clippingPlanes = [],
}: LifelikeKidneyModelProps) {
  const kidneyGroupRef = useRef<THREE.Group>(null);
  const glomerulusRef = useRef<THREE.Group>(null);
  const arteryRef = useRef<THREE.Mesh>(null);

  // Biological PBR Materials
  const cortexMaterial = useMemo(
    () => createBiologicalTissueMaterial('renal_parenchyma', { clippingPlanes, wetness: 0.92 }),
    [clippingPlanes]
  );
  const pyramidMaterial = useMemo(() => createRenalPyramidMaterial(clippingPlanes), [clippingPlanes]);
  const arteryMaterial = useMemo(
    () => createBiologicalTissueMaterial('arterial_wall', { clippingPlanes, wetness: 0.9 }),
    [clippingPlanes]
  );
  const veinMaterial = useMemo(
    () => createBiologicalTissueMaterial('venous_wall', { clippingPlanes, wetness: 0.9 }),
    [clippingPlanes]
  );
  const pelvisMaterial = useMemo(
    () => createBiologicalTissueMaterial('mucosal_lining', { clippingPlanes, wetness: 0.8 }),
    [clippingPlanes]
  );

  // Real-Time Nephron Filtration Animation Loop
  useFrame((state) => {
    if (isPaused) return;

    const filtration = computeNephronFiltrationState(state.clock.elapsedTime, meanArterialPressure);

    // Arteriolar vasomotion pulse
    if (arteryRef.current) {
      const pScale = filtration.pulsatileFlowFactor;
      arteryRef.current.scale.set(pScale, 1.0, pScale);
    }

    // Microscopic Glomerular Tuft slow rotation
    if (glomerulusRef.current) {
      glomerulusRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={kidneyGroupRef} rotation={[0.2, 0.3, 0]} position={[0, -0.05, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. MACRO-ANATOMY: BEAN-SHAPED RENAL PARENCHYMA & HILUM
      ───────────────────────────────────────────────────────────── */}
      {/* Upper Renal Pole */}
      <mesh castShadow receiveShadow position={[-0.05, 0.42, 0]} scale={[1.1, 0.95, 0.85]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <primitive object={cortexMaterial} attach="material" />
      </mesh>

      {/* Middle Parenchymal Body & Medial Hilum Concavity */}
      <mesh castShadow receiveShadow position={[-0.15, 0, 0]} scale={[1.2, 1.25, 0.82]}>
        <cylinderGeometry args={[0.52, 0.55, 0.9, 32]} />
        <primitive object={cortexMaterial} attach="material" />
      </mesh>

      {/* Lower Renal Pole */}
      <mesh castShadow receiveShadow position={[-0.05, -0.45, 0]} scale={[1.05, 0.92, 0.82]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <primitive object={cortexMaterial} attach="material" />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. INTERNAL CORTICOMEDULLARY ARCHITECTURE (DISSECTION PLANE)
      ───────────────────────────────────────────────────────────── */}
      {/* 6 Striated Medullary Pyramids radiating toward renal sinus */}
      {[
        { pos: [-0.08, 0.38, 0.05], rot: 0.5 },
        { pos: [-0.15, 0.20, 0.05], rot: 0.2 },
        { pos: [-0.20, 0.0, 0.05], rot: 0.0 },
        { pos: [-0.18, -0.20, 0.05], rot: -0.2 },
        { pos: [-0.10, -0.38, 0.05], rot: -0.5 },
      ].map((pyr, idx) => (
        <mesh
          key={idx}
          position={pyr.pos as [number, number, number]}
          rotation={[0, 0, pyr.rot]}
          scale={[0.65, 0.9, 0.75]}
        >
          <coneGeometry args={[0.18, 0.38, 16]} />
          <primitive object={pyramidMaterial} attach="material" />
        </mesh>
      ))}

      {/* Renal Pelvis & Calyces (Collecting Urine) */}
      <group position={[0.15, -0.05, 0]}>
        {/* Expanded Funnel-Shaped Renal Pelvis */}
        <mesh castShadow position={[0.08, 0, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.26, 0.55, 24]} />
          <primitive object={pelvisMaterial} attach="material" />
        </mesh>

        {/* Major & Minor Calyces reaching toward pyramids */}
        {[-0.2, 0.0, 0.2].map((y, i) => (
          <mesh key={i} position={[-0.12, y, 0]} rotation={[0, 0, 1.2]}>
            <cylinderGeometry args={[0.07, 0.1, 0.25, 16]} />
            <primitive object={pelvisMaterial} attach="material" />
          </mesh>
        ))}

        {/* Ureter Tapering Inferiorly */}
        <mesh castShadow position={[0.22, -0.55, -0.05]} rotation={[0.1, 0, -0.15]}>
          <cylinderGeometry args={[0.08, 0.07, 0.75, 20]} />
          <primitive object={pelvisMaterial} attach="material" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. RENAL HILUM VASCULAR PEDICLE (ARTERY & VEIN)
      ───────────────────────────────────────────────────────────── */}
      {/* Renal Artery Branching */}
      <mesh ref={arteryRef} castShadow position={[0.32, 0.12, 0.08]} rotation={[0, 0, -1.35]}>
        <cylinderGeometry args={[0.09, 0.11, 0.65, 20]} />
        <primitive object={arteryMaterial} attach="material" />
      </mesh>

      {/* Renal Vein (Anterior to Artery) */}
      <mesh castShadow position={[0.35, 0.05, 0.22]} rotation={[0, 0, -1.25]}>
        <cylinderGeometry args={[0.12, 0.14, 0.72, 20]} />
        <primitive object={veinMaterial} attach="material" />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          4. MICROSCOPIC NEPHRON CALLOUT (GLOMERULUS & TUBULES)
      ───────────────────────────────────────────────────────────── */}
      <group ref={glomerulusRef} position={[-0.65, 0.55, 0.35]} scale={[0.7, 0.7, 0.7]}>
        {/* Bowman's Capsule Cup */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.22, 0.06, 16, 24, Math.PI * 1.6]} />
          <primitive object={pelvisMaterial} attach="material" />
        </mesh>

        {/* Glomerular Capillary Tuft (High-pressure filtration bed) */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <primitive object={arteryMaterial} attach="material" />
        </mesh>

        {/* Afferent & Efferent Arterioles */}
        <mesh position={[0.12, 0.15, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.035, 0.035, 0.25, 12]} />
          <primitive object={arteryMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.12, 0.15, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.025, 0.025, 0.22, 12]} />
          <primitive object={arteryMaterial} attach="material" />
        </mesh>

        {/* Proximal Convoluted Tubule Loop */}
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.04, 12, 24, Math.PI]} />
          <primitive object={cortexMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
