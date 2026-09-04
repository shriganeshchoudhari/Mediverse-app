'use client';

/**
 * LifelikeEyeModel.tsx
 * Photorealistic Anatomical 3D Eye & Visual Pathway Component
 * Location: frontend/components/3d/LifelikeEyeModel.tsx
 *
 * Implements:
 * 1. Ocular Cornea & Sclera PBR living tissue materials with high transmission & refractive index (1.376).
 * 2. Dynamic Pupillary Light Reflex (PLR) scaling pupil diameter based on ambient lux.
 * 3. Crystalline lens accommodation mechanics with Helmholtz zonular changes.
 * 4. Retinal fundus vasculature (arterioles & venules) and optic nerve head (optic disc).
 * 5. Extraocular rectus muscle insertions (Superior, Inferior, Medial, Lateral).
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { computeOcularState } from '../../.gemini/skills/3d/OcularOpticsMechanicsEngine';
import { createBiologicalTissueMaterial } from '../../.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeEyeModelProps {
  ambientLux?: number;
  accommodationDistanceCm?: number;
  enablePLR?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeEyeModel({
  ambientLux = 500,
  accommodationDistanceCm = 100,
  enablePLR = true,
  clippingPlanes = [],
}: LifelikeEyeModelProps) {
  const eyeGroupRef = useRef<THREE.Group>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  const lensRef = useRef<THREE.Mesh>(null);

  // Biological tissue shaders from calibrated PBR library
  const scleraMat = useMemo(
    () => createBiologicalTissueMaterial('ocular_sclera', { clippingPlanes, wetness: 0.95 }),
    [clippingPlanes]
  );

  const corneaMat = useMemo(
    () => createBiologicalTissueMaterial('ocular_cornea', { clippingPlanes, wetness: 1.0 }),
    [clippingPlanes]
  );

  const muscleMat = useMemo(
    () => createBiologicalTissueMaterial('skeletal_muscle', { clippingPlanes, wetness: 0.8 }),
    [clippingPlanes]
  );

  const arterialMat = useMemo(
    () => createBiologicalTissueMaterial('arterial_wall', { clippingPlanes, wetness: 0.9 }),
    [clippingPlanes]
  );

  const venousMat = useMemo(
    () => createBiologicalTissueMaterial('venous_wall', { clippingPlanes, wetness: 0.9 }),
    [clippingPlanes]
  );

  // Retinal vessel arc paths
  const vesselAngles = useMemo(() => [0.4, 1.2, 2.0, 2.8, 3.6, 4.4, 5.2, 5.9], []);

  useFrame((state) => {
    const ocularState = computeOcularState(state.clock.elapsedTime, enablePLR ? ambientLux : 500);

    // Dynamic pupil aperture scaling (normalized to 2-8mm radius mapped to 0.05-0.22 3D units)
    if (pupilRef.current) {
      const scaleFactor = (ocularState.pupilRadiusMm / 4.0); // 4mm is baseline
      pupilRef.current.scale.set(scaleFactor, scaleFactor, 1);
    }

    // Lens thickness change during accommodation
    if (lensRef.current) {
      const thicknessScale = ocularState.lensThicknessMm / 3.5;
      lensRef.current.scale.set(0.6 * thicknessScale, 1.0, 0.6 * thicknessScale);
    }
  });

  return (
    <group ref={eyeGroupRef} rotation={[0, -1.2, 0.2]}>
      {/* 1. Scleral Eyeball Shell (Posterior 5/6ths) */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.82, 36, 36]} />
        <primitive object={scleraMat} attach="material" />
      </mesh>

      {/* 2. Cornea Dome (Anterior 1/6th, transparent dome protruding outward) */}
      <mesh position={[0.7, 0, 0]} scale={[1.0, 0.72, 0.72]} castShadow>
        <sphereGeometry args={[0.34, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <primitive object={corneaMat} attach="material" />
      </mesh>

      {/* 3. Anterior Chamber Fluid Space */}
      <mesh position={[0.68, 0, 0]} scale={[0.8, 0.6, 0.6]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.96}
          roughness={0.02}
          ior={1.336}
          thickness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 4. Iris Stroma & Radial Fibers */}
      <mesh position={[0.76, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.03, 48]} />
        <meshPhysicalMaterial
          color="#1d4ed8"
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 5. Dynamic Pupil Aperture */}
      <mesh ref={pupilRef} position={[0.78, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.035, 36]} />
        <meshBasicMaterial color="#020617" clippingPlanes={clippingPlanes} />
      </mesh>

      {/* 6. Crystalline Lens (Biconvex transparent disc behind pupil) */}
      <mesh ref={lensRef} position={[0.60, 0, 0]} scale={[0.6, 1.0, 0.6]}>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          roughness={0.05}
          ior={1.42}
          thickness={0.4}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 7. Optic Nerve Head (Lamina Cribrosa exit) & Dural Sheath */}
      <mesh position={[-0.88, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.32, 24]} />
        <meshStandardMaterial
          color="#fef3c7"
          roughness={0.4}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 8. Optic Disc (Pale cream anatomical blind spot) */}
      <mesh position={[-0.81, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
        <meshStandardMaterial
          color="#fde68a"
          roughness={0.3}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 9. Retinal Fundus Vasculature (Central Retinal Artery/Vein branches) */}
      {vesselAngles.map((ang, idx) => {
        const isArtery = idx % 2 === 0;
        const radius = 0.79;
        const x = -radius * Math.cos(ang * 0.35);
        const y = radius * 0.45 * Math.sin(ang);
        const z = radius * 0.45 * Math.cos(ang);

        return (
          <mesh
            key={`vessel-${idx}`}
            position={[x, y, z]}
            rotation={[ang, 0.4, ang * 0.5]}
          >
            <cylinderGeometry args={[0.012, 0.008, 0.38, 8]} />
            <primitive object={isArtery ? arterialMat : venousMat} attach="material" />
          </mesh>
        );
      })}

      {/* 10. Four Extraocular Rectus Muscle Stubs */}
      {/* Superior Rectus */}
      <mesh position={[0.1, 0.78, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.08, 0.06, 0.45, 12]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Inferior Rectus */}
      <mesh position={[0.1, -0.78, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.06, 0.45, 12]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Medial Rectus */}
      <mesh position={[0.1, 0, 0.78]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.45, 12]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Lateral Rectus */}
      <mesh position={[0.1, 0, -0.78]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.45, 12]} />
        <primitive object={muscleMat} attach="material" />
      </mesh>

      {/* Interactive Socratic Structure Pin Labels */}
      <Html position={[0.78, 0.45, 0]} distanceFactor={6} center>
        <div className="bg-slate-900/80 text-[10px] text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-500/40 backdrop-blur pointer-events-none whitespace-nowrap">
          Cornea &amp; Iris (PLR: {ambientLux} lux)
        </div>
      </Html>
    </group>
  );
}
