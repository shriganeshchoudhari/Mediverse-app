'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  computePulmonaryCycleState,
  createTrachealCartilageMaterial,
} from '@/.gemini/skills/3d/PulmonaryMechanicsEngine';
import { createBiologicalTissueMaterial } from '@/.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeLungsModelProps {
  respiratoryRateBpm?: number;
  isPaused?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeLungsModel({
  respiratoryRateBpm = 14,
  isPaused = false,
  clippingPlanes = [],
}: LifelikeLungsModelProps) {
  const lungsGroupRef = useRef<THREE.Group>(null);
  const rightLungRef = useRef<THREE.Group>(null);
  const leftLungRef = useRef<THREE.Group>(null);
  const diaphragmRef = useRef<THREE.Group>(null);
  const capillaryMeshRef = useRef<THREE.Mesh>(null);

  // Biological PBR Materials
  const lungMaterial = useMemo(
    () => createBiologicalTissueMaterial('pulmonary_parenchyma', { clippingPlanes, wetness: 0.6 }),
    [clippingPlanes]
  );
  const cartilageMaterial = useMemo(() => createTrachealCartilageMaterial(clippingPlanes), [clippingPlanes]);
  const muscleMaterial = useMemo(
    () => createBiologicalTissueMaterial('skeletal_muscle', { clippingPlanes, wetness: 0.7 }),
    [clippingPlanes]
  );

  // Biomechanical Tidal Ventilation Loop
  useFrame((state) => {
    if (isPaused) return;

    const cycle = computePulmonaryCycleState(state.clock.elapsedTime, respiratoryRateBpm);

    // 1. Dual-Lobe Asymmetrical Expansion
    if (rightLungRef.current) {
      rightLungRef.current.scale.set(
        cycle.lungScaleFactor,
        cycle.lungScaleFactor * 1.05,
        cycle.lungScaleFactor
      );
    }
    if (leftLungRef.current) {
      leftLungRef.current.scale.set(
        cycle.lungScaleFactor * 0.96, // Left lung is slightly smaller due to heart
        cycle.lungScaleFactor * 1.04,
        cycle.lungScaleFactor * 0.96
      );
    }

    // 2. Diaphragmatic Downward Excursion
    if (diaphragmRef.current) {
      diaphragmRef.current.position.y = -0.75 + cycle.diaphragmDisplacementY;
    }

    // 3. Capillary oxygenation hue
    if (capillaryMeshRef.current && (capillaryMeshRef.current.material as THREE.MeshStandardMaterial).color) {
      (capillaryMeshRef.current.material as THREE.MeshStandardMaterial).color.set(cycle.capillaryOxygenationHue);
    }
  });

  return (
    <group ref={lungsGroupRef} position={[0, 0.05, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. TRACHEOBRONCHIAL TREE (TRACHEA, CARINA, BRONCHI)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.55, 0]}>
        {/* Main Trachea Tube */}
        <mesh castShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.6, 24]} />
          <primitive object={cartilageMaterial} attach="material" />
        </mesh>

        {/* 6 Hyaline Cartilage C-Rings */}
        {[-0.2, -0.1, 0.0, 0.1, 0.2, 0.3].map((y, idx) => (
          <mesh key={idx} position={[0, 0.15 + y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.125, 0.015, 12, 24, Math.PI * 1.7]} />
            <primitive object={cartilageMaterial} attach="material" />
          </mesh>
        ))}

        {/* Carina Tracheae Bifurcation */}
        {/* Right Main Bronchus (Wider, steeper, more vertical ~25 deg) */}
        <mesh position={[0.16, -0.16, 0]} rotation={[0, 0, -0.55]}>
          <cylinderGeometry args={[0.085, 0.08, 0.42, 16]} />
          <primitive object={cartilageMaterial} attach="material" />
        </mesh>

        {/* Left Main Bronchus (Longer, narrower, more horizontal ~45 deg) */}
        <mesh position={[-0.22, -0.18, 0]} rotation={[0, 0, 0.85]}>
          <cylinderGeometry args={[0.075, 0.07, 0.52, 16]} />
          <primitive object={cartilageMaterial} attach="material" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. RIGHT LUNG (3 ANATOMICAL LOBES & FISSURES)
      ───────────────────────────────────────────────────────────── */}
      <group ref={rightLungRef} position={[0.48, -0.12, 0]}>
        {/* Superior Lobe */}
        <mesh castShadow receiveShadow position={[0.02, 0.38, 0]} rotation={[0.05, 0, -0.1]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <primitive object={lungMaterial} attach="material" />
        </mesh>
        {/* Horizontal Fissure Divider */}
        <mesh position={[0.02, 0.18, 0.08]} scale={[0.38, 0.02, 0.32]}>
          <boxGeometry />
          <primitive object={lungMaterial} attach="material" />
        </mesh>

        {/* Middle Lobe (Anterior wedge) */}
        <mesh castShadow receiveShadow position={[0.08, 0.02, 0.1]} scale={[0.85, 0.75, 0.95]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <primitive object={lungMaterial} attach="material" />
        </mesh>

        {/* Inferior Lobe (Large posterior-basal mass) */}
        <mesh castShadow receiveShadow position={[0.02, -0.28, -0.05]} scale={[1.1, 1.15, 1.05]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <primitive object={lungMaterial} attach="material" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. LEFT LUNG (2 LOBES, CARDIAC NOTCH & LINGULA)
      ───────────────────────────────────────────────────────────── */}
      <group ref={leftLungRef} position={[-0.48, -0.12, 0]}>
        {/* Superior Lobe */}
        <mesh castShadow receiveShadow position={[-0.02, 0.35, 0]} rotation={[0.05, 0, 0.1]}>
          <sphereGeometry args={[0.33, 32, 32]} />
          <primitive object={lungMaterial} attach="material" />
        </mesh>

        {/* Cardiac Notch Excavation (Anterior-medial indentation for apex of heart) */}
        <mesh position={[0.18, -0.05, 0.15]} scale={[0.22, 0.35, 0.28]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <primitive object={lungMaterial} attach="material" />
        </mesh>

        {/* Lingula (Tongue-like projection beneath cardiac notch) */}
        <mesh position={[0.12, -0.24, 0.18]} rotation={[0.2, -0.2, 0.4]} scale={[0.18, 0.25, 0.14]}>
          <boxGeometry />
          <primitive object={lungMaterial} attach="material" />
        </mesh>

        {/* Inferior Lobe */}
        <mesh castShadow receiveShadow position={[-0.02, -0.26, -0.06]} scale={[1.05, 1.12, 1.02]}>
          <sphereGeometry args={[0.40, 32, 32]} />
          <primitive object={lungMaterial} attach="material" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. MICROSCOPIC ALVEOLAR SACS & CAPILLARY PLEXUS (CALLOUT)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0.82, -0.45, 0.35]} scale={[0.65, 0.65, 0.65]}>
        {/* Terminal Bronchiole */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.3, 16]} />
          <primitive object={cartilageMaterial} attach="material" />
        </mesh>
        {/* Grapelike Alveolar Sac Cluster */}
        {[
          [-0.08, 0.08, 0],
          [0.08, 0.08, 0],
          [0, 0, 0.1],
          [-0.06, -0.08, 0.05],
          [0.06, -0.08, 0.05],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <primitive object={lungMaterial} attach="material" />
          </mesh>
        ))}
        {/* Wrapping Capillary Mesh with dynamic gas exchange color */}
        <mesh ref={capillaryMeshRef} position={[0, 0, 0.02]} scale={[1.2, 1.2, 1.2]}>
          <torusGeometry args={[0.14, 0.02, 12, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. DIAPHRAGM MUSCULAR DOME (PISTON EXCURSION)
      ───────────────────────────────────────────────────────────── */}
      <group ref={diaphragmRef} position={[0, -0.75, 0]}>
        <mesh castShadow receiveShadow scale={[1.85, 0.42, 1.2]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <primitive object={muscleMaterial} attach="material" />
        </mesh>
        {/* Central Tendon of Diaphragm */}
        <mesh position={[0, 0.18, 0]} scale={[0.9, 0.08, 0.7]}>
          <cylinderGeometry args={[0.4, 0.45, 0.1, 24]} />
          <primitive object={cartilageMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
