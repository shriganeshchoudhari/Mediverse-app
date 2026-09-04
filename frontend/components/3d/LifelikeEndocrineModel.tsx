'use client';

/**
 * LifelikeEndocrineModel.tsx
 * Photorealistic Endocrine System 3D Component
 * Location: frontend/components/3d/LifelikeEndocrineModel.tsx
 *
 * Renders the anterior neck / upper abdomen endocrine anatomy:
 *  - Trachea backdrop
 *  - Thyroid bilobed gland with isthmus
 *  - Thyroid follicular colloids (animated scaling)
 *  - Adrenal gland with cortex + chromaffin medulla
 *  - Pituitary gland (adenohypophysis + neurohypophysis) with infundibulum
 *  - HPA axis phase Html overlay
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { computeEndocrineState } from '@/.gemini/skills/3d/HormoneSecretionEngine';
import { createBiologicalTissueMaterial } from '@/.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeEndocrineModelProps {
  tshLevel?: number;       // 0.5-5.0, default 2.0
  cortisolPhase?: number;  // 0-1 day cycle, default 0.3
  clippingPlanes?: THREE.Plane[];
}

// Follicular colloid scatter positions around thyroid
const FOLLICLE_POSITIONS: [number, number, number][] = [
  [-0.32, 0.18, 0.08],
  [-0.22, -0.12, 0.12],
  [-0.15, 0.05, 0.14],
  [0.28, 0.16, 0.08],
  [0.18, -0.1, 0.12],
];

// HPA phase display labels
const HPA_LABELS: Record<string, string> = {
  HYPOTHALAMUS_CRH: '↓ CRH (Hypothalamus)',
  PITUITARY_ACTH: '↓ ACTH (Pituitary)',
  ADRENAL_CORTISOL: '↓ Cortisol (Adrenal)',
  FEEDBACK_INHIBITION: '⟲ Feedback Inhibition',
};

const HPA_COLORS: Record<string, string> = {
  HYPOTHALAMUS_CRH: '#a78bfa',
  PITUITARY_ACTH: '#fbbf24',
  ADRENAL_CORTISOL: '#f97316',
  FEEDBACK_INHIBITION: '#34d399',
};

export default function LifelikeEndocrineModel({
  tshLevel = 2.0,
  cortisolPhase = 0.3,
  clippingPlanes = [],
}: LifelikeEndocrineModelProps) {
  const endoGroupRef = useRef<THREE.Group>(null);
  const follicleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const adrenalCortexRef = useRef<THREE.Mesh>(null);
  const adrenalMedullaRef = useRef<THREE.Mesh>(null);
  const hpaLabelRef = useRef<{ phase: string; color: string }>({
    phase: 'HYPOTHALAMUS_CRH',
    color: '#a78bfa',
  });

  // Force re-render of HPA label via state
  const [hpaDisplay, setHpaDisplay] = React.useState({
    label: '↓ CRH (Hypothalamus)',
    color: '#a78bfa',
  });

  // ─── PBR Materials ──────────────────────────────────────────────────────────
  const hepaticMat = useMemo(
    () => createBiologicalTissueMaterial('hepatic_tissue', { clippingPlanes }),
    [clippingPlanes]
  );

  // ─── Animation Loop ─────────────────────────────────────────────────────────
  useFrame((state) => {
    const endo = computeEndocrineState(
      state.clock.elapsedTime,
      tshLevel,
      cortisolPhase,
    );

    // 1. Follicular colloid sphere scaling
    follicleRefs.current.forEach((mesh) => {
      if (mesh) {
        const s = endo.follicularColloidVolume;
        mesh.scale.set(s, s, s);
      }
    });

    // 2. Adrenal emissive intensity pulsing with cortex activation
    if (adrenalCortexRef.current) {
      const mat = adrenalCortexRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.05 + endo.adrenalCortexActivation * 0.35;
    }
    if (adrenalMedullaRef.current) {
      const mat = adrenalMedullaRef.current.material as THREE.MeshPhysicalMaterial;
      // Medulla pulses with pituitary phase
      mat.emissiveIntensity = 0.1 + Math.abs(Math.sin(endo.pituitaryPulsePhase)) * 0.4;
    }

    // 3. Update HPA label (throttled to avoid excessive re-renders)
    const newLabel = HPA_LABELS[endo.hpaAxisPhase];
    const newColor = HPA_COLORS[endo.hpaAxisPhase];
    if (hpaLabelRef.current.phase !== endo.hpaAxisPhase) {
      hpaLabelRef.current = { phase: endo.hpaAxisPhase, color: newColor };
      setHpaDisplay({ label: newLabel, color: newColor });
    }
  });

  return (
    <group ref={endoGroupRef} rotation={[0, 0.25, 0.08]}>
      {/* ───────────────────────────────────────────────────────────────────
          1. TRACHEA BACKDROP CYLINDER
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.9, 24]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          roughness={0.3}
          metalness={0.08}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          2. THYROID LEFT LOBE
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[-0.28, 0.0, 0.12]} scale={[0.65, 1.25, 0.55]} castShadow receiveShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        {/* Override hepatic_tissue with deeper thyroid crimson */}
        <meshPhysicalMaterial
          color="#9f1239"
          roughness={0.35}
          metalness={0.05}
          transmission={0.12}
          thickness={1.2}
          attenuationColor="#4c0519"
          attenuationDistance={0.5}
          clearcoat={0.92}
          clearcoatRoughness={0.08}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          3. THYROID RIGHT LOBE (mirror)
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[0.28, 0.0, 0.12]} scale={[0.65, 1.25, 0.55]} castShadow receiveShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshPhysicalMaterial
          color="#9f1239"
          roughness={0.35}
          metalness={0.05}
          transmission={0.12}
          thickness={1.2}
          attenuationColor="#4c0519"
          attenuationDistance={0.5}
          clearcoat={0.92}
          clearcoatRoughness={0.08}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          4. THYROID ISTHMUS (connecting bridge anterior to trachea)
      ─────────────────────────────────────────────────────────────────── */}
      <mesh position={[0, -0.12, 0.2]} scale={[1.3, 0.32, 0.35]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial
          color="#be123c"
          roughness={0.38}
          metalness={0.04}
          clearcoat={0.88}
          clearcoatRoughness={0.09}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────────────
          5. THYROID FOLLICULAR COLLOIDS (5 animated spheres)
      ─────────────────────────────────────────────────────────────────── */}
      {FOLLICLE_POSITIONS.map((pos, idx) => (
        <mesh
          key={`follicle-${idx}`}
          ref={(el) => { follicleRefs.current[idx] = el; }}
          position={pos}
        >
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshPhysicalMaterial
            color="#fca5a5"
            transmission={0.45}
            thickness={0.25}
            roughness={0.12}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}

      {/* ───────────────────────────────────────────────────────────────────
          6. RIGHT ADRENAL GLAND (over right kidney implied)
      ─────────────────────────────────────────────────────────────────── */}
      <group position={[0.6, 0.4, 0.1]}>
        {/* Outer cone shape */}
        <mesh castShadow>
          <coneGeometry args={[0.18, 0.38, 4]} />
          <meshPhysicalMaterial
            color="#ea580c"
            roughness={0.4}
            metalness={0.06}
            clearcoat={0.7}
            clearcoatRoughness={0.14}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        {/* Cortex layer */}
        <mesh ref={adrenalCortexRef} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.35, 12]} />
          <meshPhysicalMaterial
            color="#f97316"
            emissive="#7c2d12"
            emissiveIntensity={0.08}
            roughness={0.35}
            metalness={0.05}
            clearcoat={0.75}
            clearcoatRoughness={0.12}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        {/* Chromaffin medulla */}
        <mesh ref={adrenalMedullaRef} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 12]} />
          <meshPhysicalMaterial
            color="#c026d3"
            emissive="#701a75"
            emissiveIntensity={0.15}
            roughness={0.28}
            metalness={0.06}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────────────
          7. PITUITARY GLAND (sella turcica, superior)
      ─────────────────────────────────────────────────────────────────── */}
      <group position={[0.0, 0.75, 0.1]}>
        {/* Adenohypophysis (anterior – GH, TSH, ACTH, FSH, LH, PRL) */}
        <mesh position={[-0.06, 0, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            roughness={0.32}
            metalness={0.04}
            clearcoat={0.9}
            clearcoatRoughness={0.07}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        {/* Neurohypophysis (posterior – ADH, oxytocin) */}
        <mesh position={[0.08, 0, 0]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhysicalMaterial
            color="#a78bfa"
            roughness={0.3}
            metalness={0.04}
            clearcoat={0.88}
            clearcoatRoughness={0.08}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
        {/* Infundibulum stalk connecting to median eminence */}
        <mesh position={[0, -0.165, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
          <meshPhysicalMaterial
            color="#d4d4d8"
            roughness={0.4}
            metalness={0.06}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────────────
          8. HPA AXIS PHASE LABEL (Html overlay)
      ─────────────────────────────────────────────────────────────────── */}
      <Html position={[0.5, 0.6, 0]} center>
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: hpaDisplay.color,
            background: 'rgba(15,15,20,0.65)',
            padding: '3px 9px',
            borderRadius: 5,
            border: `1px solid ${hpaDisplay.color}44`,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            transition: 'color 0.4s, border-color 0.4s',
          }}
        >
          {hpaDisplay.label}
        </div>
      </Html>
    </group>
  );
}
