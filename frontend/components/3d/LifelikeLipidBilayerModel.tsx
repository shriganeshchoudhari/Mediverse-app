'use client';

/**
 * LifelikeLipidBilayerModel.tsx
 * Photorealistic Plasma Membrane 3D Component
 * Location: frontend/components/3d/LifelikeLipidBilayerModel.tsx
 *
 * Renders a fluid-mosaic lipid bilayer with:
 *  - Dual phospholipid monolayers (head + two kinked tails each)
 *  - Cholesterol spacers with rigidity-driven animation
 *  - GPCR 7-TM helix bundle with conformational rotation
 *  - Na+/K+ ATPase alpha+beta subunits
 *  - Tetrameric ion channel with gating opacity
 *  - Html labels for extracellular / cytoplasm regions
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { computeMembraneState } from '@/.gemini/skills/3d/MembraneBiophysicsEngine';
import { createBiologicalTissueMaterial } from '@/.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeLipidBilayerModelProps {
  temperature?: number;           // default 37 (Celsius)
  cholesterolFraction?: number;   // 0.0-0.5, default 0.3
  enableGPCRAnimation?: boolean;  // default true
  clippingPlanes?: THREE.Plane[];
}

// X-positions shared by both monolayers
const LIPID_X_POSITIONS = [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8, -1.8 + 0.3, 1.2 + 0.3, 0.6 + 0.3];
const CHOLESTEROL_X = [-0.9, 0.3, 1.5];
const GPCR_HELIX_COUNT = 7;
const GPCR_RING_RADIUS = 0.22;

export default function LifelikeLipidBilayerModel({
  temperature = 37,
  cholesterolFraction = 0.3,
  enableGPCRAnimation = true,
  clippingPlanes = [],
}: LifelikeLipidBilayerModelProps) {
  const membraneGroupRef = useRef<THREE.Group>(null);
  const gpcrGroupRef = useRef<THREE.Group>(null);
  const ionChannelPoreRef = useRef<THREE.Mesh>(null);
  const cholesterolRefs = useRef<(THREE.Mesh | null)[]>([]);
  const gpcrHelixRefs = useRef<(THREE.Mesh | null)[]>([]);

  // ─── PBR Materials ──────────────────────────────────────────────────────────
  const arterialMat = useMemo(
    () => createBiologicalTissueMaterial('arterial_wall', { clippingPlanes }),
    [clippingPlanes]
  );

  // ─── Animation Loop ─────────────────────────────────────────────────────────
  useFrame((state) => {
    const ms = computeMembraneState(
      state.clock.elapsedTime,
      temperature,
      cholesterolFraction,
    );

    // 1. Membrane global bob (lateral thermal undulation)
    if (membraneGroupRef.current) {
      membraneGroupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.8) * ms.phospholipidWaveAmplitude;
    }

    // 2. GPCR conformational rotation
    if (enableGPCRAnimation && gpcrGroupRef.current) {
      gpcrGroupRef.current.rotation.y = ms.gpcrConformationAngle * 0.45;
      gpcrGroupRef.current.rotation.x = ms.gpcrConformationAngle * 0.12;
    }

    // 3. Ion channel pore opacity gating
    if (ionChannelPoreRef.current) {
      const mat = ionChannelPoreRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = ms.ionChannelGating ? 0.9 : 0.1;
    }

    // 4. Cholesterol scale driven by rigidity
    cholesterolRefs.current.forEach((mesh) => {
      if (mesh) {
        // Stiffer cholesterol = slightly taller / thinner
        mesh.scale.set(1.0 - ms.cholesterolRigidity * 0.15, 1.0 + ms.cholesterolRigidity * 0.12, 1.0);
      }
    });
  });

  return (
    <group ref={membraneGroupRef} rotation={[0.4, 0.35, 0]}>
      {/* ───────────────────────────────────────────────────────────────────
          1. TOP PHOSPHOLIPID MONOLAYER  (heads at y=+0.55, tails down)
      ─────────────────────────────────────────────────────────────────── */}
      {LIPID_X_POSITIONS.map((x, idx) => (
        <group key={`top-lipid-${idx}`} position={[x, 0.55, 0]}>
          {/* Hydrophilic Head (choline + phosphate) */}
          <mesh castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshPhysicalMaterial
              color="#3b82f6"
              clearcoat={1.0}
              clearcoatRoughness={0.08}
              roughness={0.25}
              metalness={0.0}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          {/* Tail 1 (saturated – straight) */}
          <mesh position={[0.04, -0.2, 0]} rotation={[0, 0, 0.12]}>
            <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
            <meshPhysicalMaterial
              color="#f43f5e"
              roughness={0.45}
              metalness={0.02}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          {/* Tail 2 (unsaturated – kinked) */}
          <mesh position={[-0.04, -0.2, 0]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.025, 0.025, 0.30, 8]} />
            <meshPhysicalMaterial
              color="#fb7185"
              roughness={0.48}
              metalness={0.02}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
        </group>
      ))}

      {/* ───────────────────────────────────────────────────────────────────
          2. BOTTOM PHOSPHOLIPID MONOLAYER  (heads at y=−0.55, tails up)
      ─────────────────────────────────────────────────────────────────── */}
      {LIPID_X_POSITIONS.map((x, idx) => (
        <group key={`bot-lipid-${idx}`} position={[x, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
          {/* Hydrophilic Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshPhysicalMaterial
              color="#3b82f6"
              clearcoat={1.0}
              clearcoatRoughness={0.08}
              roughness={0.25}
              metalness={0.0}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          {/* Tail 1 (saturated) */}
          <mesh position={[0.04, -0.2, 0]} rotation={[0, 0, 0.12]}>
            <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
            <meshPhysicalMaterial
              color="#f43f5e"
              roughness={0.45}
              metalness={0.02}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          {/* Tail 2 (unsaturated – kinked) */}
          <mesh position={[-0.04, -0.2, 0]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.025, 0.025, 0.30, 8]} />
            <meshPhysicalMaterial
              color="#fb7185"
              roughness={0.48}
              metalness={0.02}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
        </group>
      ))}

      {/* ───────────────────────────────────────────────────────────────────
          3. CHOLESTEROL MOLECULES  (intercalated spacers)
      ─────────────────────────────────────────────────────────────────── */}
      {CHOLESTEROL_X.map((x, idx) => (
        <mesh
          key={`chol-${idx}`}
          ref={(el) => { cholesterolRefs.current[idx] = el; }}
          position={[x, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.06, 1.0, 0.18]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            metalness={0.1}
            roughness={0.38}
            clearcoat={0.6}
            clearcoatRoughness={0.12}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}

      {/* ───────────────────────────────────────────────────────────────────
          4. GPCR 7-TM HELIX BUNDLE  (at x = −1.5)
      ─────────────────────────────────────────────────────────────────── */}
      <group ref={gpcrGroupRef} position={[-1.5, 0, 0]}>
        {Array.from({ length: GPCR_HELIX_COUNT }).map((_, idx) => {
          const angle = (idx / GPCR_HELIX_COUNT) * Math.PI * 2;
          const hx = Math.cos(angle) * GPCR_RING_RADIUS;
          const hz = Math.sin(angle) * GPCR_RING_RADIUS;
          return (
            <mesh
              key={`gpcr-tm${idx + 1}`}
              ref={(el) => { gpcrHelixRefs.current[idx] = el; }}
              position={[hx, 0, hz]}
              rotation={[0, -angle, 0.08 * (idx % 2 === 0 ? 1 : -1)]}
              castShadow
            >
              <cylinderGeometry args={[0.055, 0.055, 1.25, 8]} />
              <meshPhysicalMaterial
                color="#10b981"
                transmission={0.3}
                thickness={0.8}
                roughness={0.28}
                metalness={0.05}
                clearcoat={0.8}
                clearcoatRoughness={0.1}
                clippingPlanes={clippingPlanes}
                clipShadows
              />
            </mesh>
          );
        })}
      </group>

      {/* ───────────────────────────────────────────────────────────────────
          5. Na+/K+ ATPase PUMP  (at x = +0.8)
      ─────────────────────────────────────────────────────────────────── */}
      <group position={[0.8, 0, 0]}>
        {/* Alpha subunit – transmembrane domain */}
        <mesh castShadow>
          <boxGeometry args={[0.2, 1.1, 0.2]} />
          <meshPhysicalMaterial
            color="#f97316"
            roughness={0.35}
            metalness={0.06}
            clearcoat={0.7}
            clearcoatRoughness={0.12}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        {/* Beta subunit – extracellular glycoprotein chaperone */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshPhysicalMaterial
            color="#fb923c"
            roughness={0.3}
            metalness={0.04}
            clearcoat={0.9}
            clearcoatRoughness={0.08}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────────────
          6. ION CHANNEL (4-fold symmetry tetrameric)  at x = +1.8
      ─────────────────────────────────────────────────────────────────── */}
      <group position={[1.8, 0, 0]}>
        {/* 4 subunit helices in square arrangement */}
        {[
          [0.09, 0, 0.09],
          [-0.09, 0, 0.09],
          [-0.09, 0, -0.09],
          [0.09, 0, -0.09],
        ].map((pos, idx) => (
          <mesh key={`chan-sub${idx}`} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
            <meshPhysicalMaterial
              color="#7c3aed"
              roughness={0.32}
              metalness={0.05}
              clearcoat={0.75}
              clearcoatRoughness={0.1}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
        ))}
        {/* Central pore – opacity driven by gating state */}
        <mesh ref={ionChannelPoreRef}>
          <cylinderGeometry args={[0.04, 0.04, 1.22, 8]} />
          <meshPhysicalMaterial
            color="#a5f3fc"
            transparent
            opacity={0.1}
            roughness={0.1}
            metalness={0.0}
            transmission={0.6}
            thickness={0.3}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────────────
          7. Html REGION LABELS
      ─────────────────────────────────────────────────────────────────── */}
      <Html position={[0, 1.0, 0]} center>
        <div
          style={{
            color: '#bfdbfe',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(30,58,138,0.55)',
            padding: '2px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Extracellular
        </div>
      </Html>
      <Html position={[0, -1.0, 0]} center>
        <div
          style={{
            color: '#fde68a',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(78,52,10,0.55)',
            padding: '2px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Cytoplasm
        </div>
      </Html>
    </group>
  );
}
