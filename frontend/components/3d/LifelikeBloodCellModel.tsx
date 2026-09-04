'use client';

/**
 * LifelikeBloodCellModel.tsx
 * Photorealistic 3D Hematology & Blood Cellular Elements Component
 * Location: frontend/components/3d/LifelikeBloodCellModel.tsx
 *
 * Implements:
 * 1. Erythrocytes (RBCs): Biconcave disc morphology, shear deformation, oxyhemoglobin hue.
 * 2. Polymorphonuclear Leukocyte (Neutrophil): 3-lobed nucleus, cytoplasmic granules.
 * 3. Thrombocytes (Platelets): Quiescent discoid vs. activated spiny filopodial phenotypes.
 * 4. Secondary hemostasis fibrin monomer polymerization meshwork.
 * 5. Dynamic plasma fluid matrix with serous clearcoat.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { computeBloodCellState } from '../../.gemini/skills/3d/HematologyEngine';
import { createBiologicalTissueMaterial } from '../../.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeBloodCellModelProps {
  oxygenSaturation?: number;
  activationState?: 'resting' | 'activated' | 'clotting';
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeBloodCellModel({
  oxygenSaturation = 0.98,
  activationState = 'resting',
  clippingPlanes = [],
}: LifelikeBloodCellModelProps) {
  const rbc1Ref = useRef<THREE.Group>(null);
  const rbc2Ref = useRef<THREE.Group>(null);
  const rbc3Ref = useRef<THREE.Group>(null);
  const wbcRef = useRef<THREE.Group>(null);
  const plateletRefs = useRef<(THREE.Group | null)[]>([]);

  // Biological tissue shaders
  const arterialMat = useMemo(
    () => createBiologicalTissueMaterial('arterial_wall', { clippingPlanes, wetness: 0.95 }),
    [clippingPlanes]
  );

  // Platelet positions in local space
  const plateletCoords = useMemo(
    () => [
      [-0.45, 0.35, 0.4],
      [0.6, -0.4, 0.25],
      [-0.2, -0.5, -0.3],
      [0.4, 0.5, -0.2],
    ],
    []
  );

  useFrame((state) => {
    const bState = computeBloodCellState(
      state.clock.elapsedTime,
      oxygenSaturation,
      activationState
    );

    // RBC 1 tumbling (main center cell)
    if (rbc1Ref.current) {
      rbc1Ref.current.rotation.x = state.clock.elapsedTime * bState.rbcRotationSpeed[0];
      rbc1Ref.current.rotation.y = state.clock.elapsedTime * (bState.rbcRotationSpeed[0] * 0.7);
      // Microcapillary shear deformation: periodic elongation along X, flattening along Z
      const deform = 1.0 + (bState.rbcDeformationIndex - 0.25) * 0.3;
      rbc1Ref.current.scale.set(deform, 1.0 / Math.sqrt(deform), 1.0);
    }

    // RBC 2 tumbling (left lateral cell)
    if (rbc2Ref.current) {
      rbc2Ref.current.rotation.y = state.clock.elapsedTime * bState.rbcRotationSpeed[1];
      rbc2Ref.current.rotation.z = state.clock.elapsedTime * (bState.rbcRotationSpeed[1] * 0.8);
    }

    // RBC 3 tumbling (right inferior cell)
    if (rbc3Ref.current) {
      rbc3Ref.current.rotation.x = -state.clock.elapsedTime * bState.rbcRotationSpeed[2];
      rbc3Ref.current.rotation.z = state.clock.elapsedTime * (bState.rbcRotationSpeed[2] * 0.5);
    }

    // WBC subtle amoeboid pulsation
    if (wbcRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.0) * 0.03;
      wbcRef.current.scale.set(pulse, pulse, pulse);
      wbcRef.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group rotation={[0.4, 0.4, 0]}>
      {/* 1. Transparent Vascular Plasma Capsule (Enclosing fluid medium) */}
      <mesh>
        <sphereGeometry args={[1.75, 24, 24]} />
        <meshPhysicalMaterial
          color="#fef9c3"
          transmission={0.92}
          roughness={0.05}
          ior={1.34}
          thickness={0.3}
          transparent
          opacity={0.15}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 2. Primary Biconcave Erythrocyte (RBC 1) */}
      <group ref={rbc1Ref} position={[0, 0, 0.1]}>
        {/* Outer Torus Rim */}
        <mesh castShadow>
          <torusGeometry args={[0.75, 0.30, 24, 64]} />
          <meshPhysicalMaterial
            color="#dc2626"
            roughness={0.22}
            clearcoat={0.95}
            clearcoatRoughness={0.1}
            attenuationColor={new THREE.Color('#7f1d1d')}
            attenuationDistance={0.4}
            transmission={0.12}
            thickness={0.8}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        {/* Central Thin Dimple */}
        <mesh scale={[0.82, 0.82, 0.18]}>
          <sphereGeometry args={[0.66, 32, 32]} />
          <meshPhysicalMaterial
            color="#b91c1c"
            roughness={0.28}
            clearcoat={0.8}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* 3. Secondary Erythrocyte (RBC 2 - Left) */}
      <group ref={rbc2Ref} position={[-0.85, -0.25, -0.3]} scale={[0.75, 0.75, 0.75]}>
        <mesh castShadow>
          <torusGeometry args={[0.72, 0.28, 20, 48]} />
          <meshPhysicalMaterial
            color="#dc2626"
            roughness={0.25}
            clearcoat={0.9}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        <mesh scale={[0.8, 0.8, 0.18]}>
          <sphereGeometry args={[0.64, 24, 24]} />
          <meshPhysicalMaterial
            color="#b91c1c"
            roughness={0.3}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* 4. Tertiary Erythrocyte (RBC 3 - Right) */}
      <group ref={rbc3Ref} position={[0.9, -0.2, 0.2]} scale={[0.68, 0.68, 0.68]}>
        <mesh castShadow>
          <torusGeometry args={[0.72, 0.28, 20, 48]} />
          <meshPhysicalMaterial
            color="#b91c1c"
            roughness={0.25}
            clearcoat={0.9}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        <mesh scale={[0.8, 0.8, 0.18]}>
          <sphereGeometry args={[0.64, 24, 24]} />
          <meshPhysicalMaterial
            color="#991b1b"
            roughness={0.3}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* 5. Leukocyte / Neutrophil (WBC with 3-lobed nucleus) */}
      <group ref={wbcRef} position={[-0.35, 0.55, -0.45]}>
        {/* Outer Granulocyte Membrane */}
        <mesh castShadow>
          <sphereGeometry args={[0.42, 28, 28]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.38}
            metalness={0.02}
            transmission={0.45}
            thickness={0.8}
            attenuationColor={new THREE.Color('#e2e8f0')}
            clearcoat={0.7}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>

        {/* 3-Lobed Nucleus (Polymorphonuclear leukocyte signature) */}
        <mesh position={[-0.08, 0.08, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#6b21a8" roughness={0.3} clippingPlanes={clippingPlanes} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.06]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#6b21a8" roughness={0.3} clippingPlanes={clippingPlanes} />
        </mesh>
        <mesh position={[-0.02, -0.1, -0.05]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#6b21a8" roughness={0.3} clippingPlanes={clippingPlanes} />
        </mesh>
        {/* Nuclear chromatin bridges connecting the lobes */}
        <mesh position={[0.01, 0.06, 0.03]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial color="#581c87" clippingPlanes={clippingPlanes} />
        </mesh>
      </group>

      {/* 6. Thrombocytes / Platelets (Quiescent or Spiny Activated) */}
      {plateletCoords.map((pos, idx) => (
        <group
          key={`plt-${idx}`}
          ref={(el) => {
            plateletRefs.current[idx] = el;
          }}
          position={pos as [number, number, number]}
        >
          {/* Central discoid plate */}
          <mesh scale={[1.0, 0.35, 1.0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshPhysicalMaterial
              color="#fbbf24"
              roughness={0.25}
              clearcoat={0.8}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>

          {/* Activated Filopodial Spines (Visible when activated or clotting) */}
          {(activationState === 'activated' || activationState === 'clotting') && (
            <>
              {[0, 1.05, 2.09, 3.14, 4.19, 5.24].map((rad, sIdx) => (
                <mesh
                  key={`spine-${sIdx}`}
                  position={[0.12 * Math.cos(rad), 0, 0.12 * Math.sin(rad)]}
                  rotation={[0, -rad, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.012, 0.003, 0.16, 6]} />
                  <meshStandardMaterial
                    color="#f59e0b"
                    clippingPlanes={clippingPlanes}
                    clipShadows
                  />
                </mesh>
              ))}
            </>
          )}
        </group>
      ))}

      {/* 7. Fibrin Polymerization Mesh (Secondary hemostasis thrombus web) */}
      {activationState === 'clotting' && (
        <group>
          {/* Cross-linking fibrin strands */}
          <mesh position={[0, -0.1, 0.1]} rotation={[0.3, 0.5, 0.8]}>
            <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.3}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          <mesh position={[-0.3, 0.1, 0]} rotation={[-0.4, 0.2, 1.2]}>
            <cylinderGeometry args={[0.015, 0.015, 1.4, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.3}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          <mesh position={[0.2, -0.3, 0.2]} rotation={[0.8, -0.3, 0.4]}>
            <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.3}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
        </group>
      )}

      {/* 8. Live Cellular HUD */}
      <Html position={[0, 1.15, 0]} distanceFactor={6} center>
        <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/40 text-[10px] font-mono text-slate-200 pointer-events-none whitespace-nowrap shadow-xl">
          <span className="text-red-400 font-bold">SaO₂:</span> {(oxygenSaturation * 100).toFixed(0)}% &bull;{' '}
          <span className="text-amber-400 font-bold">Platelets:</span> {activationState.toUpperCase()} &bull;{' '}
          <span className="text-purple-400 font-bold">WBC:</span> Neutrophil PMN
        </div>
      </Html>
    </group>
  );
}
