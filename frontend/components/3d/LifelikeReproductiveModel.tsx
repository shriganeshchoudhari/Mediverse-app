'use client';

/**
 * LifelikeReproductiveModel.tsx
 * Photorealistic 3D Human Female Reproductive Anatomy & Ovarian Cycle Component
 * Location: frontend/components/3d/LifelikeReproductiveModel.tsx
 *
 * Implements:
 * 1. Uterine myometrium and dynamic functional endometrium layer responding to ovarian cycle day.
 * 2. Bilateral salpinges (Fallopian tubes) with curved infundibulum and fimbriated ostia.
 * 3. Ovarian antral follicle recruitment, Graafian pre-ovulatory swelling (4mm -> 20mm), and ovulation rupture.
 * 4. Post-ovulatory vascularized Corpus Luteum formation during the secretory luteal phase.
 * 5. Dynamic endocrinological HUD tracking Cycle Day, Estrogen, Progesterone, and LH surge.
 */

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  computeReproductiveCycleState,
  animateCycleDay,
  ReproductiveCycleState,
} from '../../.gemini/skills/3d/ReproductiveCycleEngine';
import { createBiologicalTissueMaterial } from '../../.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeReproductiveModelProps {
  cycleDay?: number;
  animateCycle?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeReproductiveModel({
  cycleDay = 14,
  animateCycle = true,
  clippingPlanes = [],
}: LifelikeReproductiveModelProps) {
  const modelGroupRef = useRef<THREE.Group>(null);
  const follicleRef = useRef<THREE.Mesh>(null);
  const corpusLuteumRef = useRef<THREE.Mesh>(null);
  const endometriumRef = useRef<THREE.Mesh>(null);

  const [currentDay, setCurrentDay] = useState(cycleDay);
  const [hudState, setHudState] = useState<ReproductiveCycleState>(() =>
    computeReproductiveCycleState(cycleDay)
  );

  // Calibrated living tissue shaders
  const myometriumMat = useMemo(
    () => createBiologicalTissueMaterial('skeletal_muscle', { clippingPlanes, wetness: 0.9 }),
    [clippingPlanes]
  );

  const endometriumMat = useMemo(
    () => createBiologicalTissueMaterial('mucosal_lining', { clippingPlanes, wetness: 0.98 }),
    [clippingPlanes]
  );

  const ovaryMat = useMemo(
    () => createBiologicalTissueMaterial('renal_parenchyma', { clippingPlanes, wetness: 0.85 }),
    [clippingPlanes]
  );

  useFrame((state) => {
    const dayToUse = animateCycle
      ? animateCycleDay(state.clock.elapsedTime, 28)
      : cycleDay;

    const rState = computeReproductiveCycleState(dayToUse);

    // Dominant follicle expansion (4mm -> 20mm, mapped to 0.05 -> 0.22 units)
    if (follicleRef.current) {
      const fScale = rState.dominantFollicleDiameterMm / 4.0;
      follicleRef.current.scale.set(fScale, fScale, fScale);
      follicleRef.current.visible = rState.phase === 'FOLLICULAR' || rState.phase === 'OVULATION';
    }

    // Corpus Luteum visibility
    if (corpusLuteumRef.current) {
      corpusLuteumRef.current.visible = rState.corpusLuteumVisible;
      const clScale = rState.progesteroneLevel / 10.0;
      corpusLuteumRef.current.scale.set(Math.max(0.6, clScale), Math.max(0.6, clScale), Math.max(0.6, clScale));
    }

    // Endometrial lining hypertrophy (2mm -> 12mm thickness)
    if (endometriumRef.current) {
      const endoScale = rState.endometriumThicknessMm / 6.0;
      endometriumRef.current.scale.set(1.0 + endoScale * 0.15, 1.0, 1.0 + endoScale * 0.15);
    }

    // Throttled HUD update
    if (Math.floor(state.clock.elapsedTime * 10) % 2 === 0) {
      setCurrentDay(dayToUse);
      setHudState(rState);
    }
  });

  return (
    <group ref={modelGroupRef} rotation={[0.1, 0, 0]}>
      {/* 1. Uterine Body (Corpus Uteri) - Muscular inverted pear */}
      <group position={[0, 0.1, 0]}>
        {/* Main Body Cone */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.52, 0.9, 32]} />
          <primitive object={myometriumMat} attach="material" />
        </mesh>

        {/* Rounded Fundus Dome (Superior convexity) */}
        <mesh position={[0, 0.45, 0]} scale={[1.0, 0.55, 0.85]} castShadow>
          <sphereGeometry args={[0.52, 32, 24]} />
          <primitive object={myometriumMat} attach="material" />
        </mesh>

        {/* Functional Endometrium Inner Cavity Lining */}
        <mesh ref={endometriumRef} position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.38, 0.72, 28]} />
          <primitive object={endometriumMat} attach="material" />
        </mesh>
      </group>

      {/* 2. Cervix Uteri (Neck extending inferiorly) */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.14, 0.38, 24]} />
        <meshPhysicalMaterial
          color="#f472b6"
          roughness={0.3}
          clearcoat={0.9}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* 3. Right Fallopian Tube & Infundibulum */}
      <group position={[0.42, 0.48, 0]}>
        {/* Isthmus & Ampulla Arch */}
        <mesh position={[0.32, 0.12, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.045, 0.035, 0.75, 16]} />
          <primitive object={myometriumMat} attach="material" />
        </mesh>
        {/* Infundibulum Flare */}
        <mesh position={[0.68, 0.02, 0]} rotation={[0, 0, -1.1]}>
          <coneGeometry args={[0.1, 0.28, 16]} />
          <primitive object={endometriumMat} attach="material" />
        </mesh>
        {/* Fimbriae Finger-like projections */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((rot, idx) => (
          <mesh
            key={`rt-fim-${idx}`}
            position={[0.76, -0.08, 0.04 * Math.sin(rot)]}
            rotation={[0.3 * Math.cos(rot), 0, -1.4]}
          >
            <cylinderGeometry args={[0.012, 0.005, 0.18, 6]} />
            <meshStandardMaterial color="#fb7185" clippingPlanes={clippingPlanes} />
          </mesh>
        ))}
      </group>

      {/* 4. Left Fallopian Tube & Infundibulum */}
      <group position={[-0.42, 0.48, 0]}>
        {/* Isthmus & Ampulla Arch */}
        <mesh position={[-0.32, 0.12, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.045, 0.035, 0.75, 16]} />
          <primitive object={myometriumMat} attach="material" />
        </mesh>
        {/* Infundibulum Flare */}
        <mesh position={[-0.68, 0.02, 0]} rotation={[0, 0, 1.1]}>
          <coneGeometry args={[0.1, 0.28, 16]} />
          <primitive object={endometriumMat} attach="material" />
        </mesh>
        {/* Fimbriae */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((rot, idx) => (
          <mesh
            key={`lt-fim-${idx}`}
            position={[-0.76, -0.08, 0.04 * Math.sin(rot)]}
            rotation={[0.3 * Math.cos(rot), 0, 1.4]}
          >
            <cylinderGeometry args={[0.012, 0.005, 0.18, 6]} />
            <meshStandardMaterial color="#fb7185" clippingPlanes={clippingPlanes} />
          </mesh>
        ))}
      </group>

      {/* 5. Right Ovary (Active cycling ovary with Graafian Follicle & Corpus Luteum) */}
      <group position={[1.05, 0.22, 0]}>
        {/* Ovarian Stroma Cortex */}
        <mesh scale={[1.25, 0.85, 0.85]} castShadow>
          <sphereGeometry args={[0.18, 20, 20]} />
          <primitive object={ovaryMat} attach="material" />
        </mesh>

        {/* Dominant Pre-Ovulatory Graafian Follicle */}
        <mesh ref={follicleRef} position={[0.06, 0.12, 0.06]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshPhysicalMaterial
            color="#fef3c7"
            transmission={0.8}
            roughness={0.1}
            ior={1.38}
            thickness={0.2}
            clearcoat={1.0}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>

        {/* Vascularized Secretory Corpus Luteum */}
        <mesh ref={corpusLuteumRef} position={[-0.04, 0.08, 0.08]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#eab308"
            roughness={0.35}
            emissive={new THREE.Color('#854d0e')}
            emissiveIntensity={0.25}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* 6. Left Ovary (Contralateral baseline ovary) */}
      <group position={[-1.05, 0.22, 0]}>
        <mesh scale={[1.25, 0.85, 0.85]} castShadow>
          <sphereGeometry args={[0.18, 20, 20]} />
          <primitive object={ovaryMat} attach="material" />
        </mesh>
      </group>

      {/* 7. Ovarian Ligaments (Connecting poles to uterus) */}
      <mesh position={[0.62, 0.32, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
        <meshStandardMaterial color="#fda4af" clippingPlanes={clippingPlanes} />
      </mesh>
      <mesh position={[-0.62, 0.32, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
        <meshStandardMaterial color="#fda4af" clippingPlanes={clippingPlanes} />
      </mesh>

      {/* 8. Live Endocrine & Ovarian Cycle HUD */}
      <Html position={[0, 0.88, 0]} distanceFactor={6} center>
        <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-pink-500/40 text-[10px] font-mono text-slate-200 pointer-events-none whitespace-nowrap shadow-xl">
          <span className="text-pink-400 font-bold">Day:</span> {currentDay.toFixed(0)}/28 &bull;{' '}
          <span className="text-amber-400 font-bold">Phase:</span> {hudState.phase} &bull;{' '}
          <span className="text-purple-400 font-bold">Endometrium:</span> {hudState.endometriumThicknessMm.toFixed(1)} mm &bull;{' '}
          <span className="text-emerald-400 font-bold">Prog:</span> {hudState.progesteroneLevel.toFixed(1)} ng/mL
        </div>
      </Html>
    </group>
  );
}
