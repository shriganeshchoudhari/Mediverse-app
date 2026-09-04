'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  computeActionPotentialState,
  createMyelinSheathMaterial,
} from '@/.gemini/skills/3d/NeuronActionPotentialEngine';
import { createBiologicalTissueMaterial } from '@/.gemini/skills/3d/PbrLivingTissueShaders';

interface LifelikeNeuronModelProps {
  firingFrequencyHz?: number;
  isPaused?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeNeuronModel({
  firingFrequencyHz = 5,
  isPaused = false,
  clippingPlanes = [],
}: LifelikeNeuronModelProps) {
  const neuronGroupRef = useRef<THREE.Group>(null);
  const impulseSparkRef = useRef<THREE.Mesh>(null);
  const vesicleGlowRef = useRef<THREE.Mesh>(null);

  // Biological PBR Materials
  const somaMaterial = useMemo(
    () => createBiologicalTissueMaterial('cerebral_cortex', { clippingPlanes, wetness: 0.85 }),
    [clippingPlanes]
  );
  const myelinMaterial = useMemo(() => createMyelinSheathMaterial(clippingPlanes), [clippingPlanes]);
  const impulseMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#38bdf8'),
      }),
    []
  );
  const vesicleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f59e0b'),
        emissive: new THREE.Color('#d97706'),
        emissiveIntensity: 0.2,
      }),
    []
  );

  // Real-Time Action Potential Loop
  useFrame((state) => {
    if (isPaused) return;

    const ap = computeActionPotentialState(state.clock.elapsedTime, firingFrequencyHz);

    // Update impulse traveling down axon (from x = -0.3 to x = 1.4)
    if (impulseSparkRef.current) {
      const xPos = -0.2 + ap.impulsePositionNorm * 1.5;
      impulseSparkRef.current.position.set(xPos, 0, 0);
      impulseSparkRef.current.scale.setScalar(ap.isDepolarized ? 1.6 : 0.8);
      impulseMaterial.color.set(ap.signalColorHex);
    }

    // Terminal bouton vesicle exocytosis glow
    if (vesicleGlowRef.current) {
      vesicleMaterial.emissiveIntensity = ap.vesicleExocytosisGlow * 1.5 + 0.2;
    }
  });

  return (
    <group ref={neuronGroupRef} position={[-0.3, 0, 0]} rotation={[0.1, 0.2, -0.1]}>
      {/* ─────────────────────────────────────────────────────────────
          1. NEURONAL SOMA (PERIKARYON & DENDRITIC ARBOR)
      ───────────────────────────────────────────────────────────── */}
      <group position={[-0.5, 0, 0]}>
        {/* Cell Body Soma */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <primitive object={somaMaterial} attach="material" />
        </mesh>

        {/* Nucleus & Nucleolus (Visible via dissection) */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color="#475569" roughness={0.3} />
        </mesh>

        {/* Extensive Branching Dendritic Tree with Spines */}
        {[
          { rot: [0, 0, 1.8], len: 0.65, pos: [-0.2, 0.25, 0] },
          { rot: [0, 0, 2.5], len: 0.58, pos: [-0.3, 0.05, 0.15] },
          { rot: [0, 0, -2.4], len: 0.62, pos: [-0.25, -0.2, -0.1] },
          { rot: [0.5, 0, 2.1], len: 0.52, pos: [-0.15, 0.3, -0.15] },
          { rot: [-0.4, 0, -1.9], len: 0.55, pos: [-0.15, -0.28, 0.12] },
        ].map((d, i) => (
          <group key={i} position={d.pos as [number, number, number]} rotation={d.rot as [number, number, number]}>
            {/* Primary Dendrite */}
            <mesh position={[0, d.len / 2, 0]}>
              <cylinderGeometry args={[0.02, 0.045, d.len, 12]} />
              <primitive object={somaMaterial} attach="material" />
            </mesh>
            {/* Secondary Dendritic Branch */}
            <mesh position={[0.08, d.len * 0.75, 0]} rotation={[0, 0, 0.6]}>
              <cylinderGeometry args={[0.012, 0.02, d.len * 0.45, 10]} />
              <primitive object={somaMaterial} attach="material" />
            </mesh>
            {/* Dendritic Spines */}
            <mesh position={[0.04, d.len * 0.5, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <primitive object={somaMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Funnel-Shaped Axon Hillock (Trigger Zone) */}
        <mesh position={[0.32, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.16, 0.32, 20]} />
          <primitive object={somaMaterial} attach="material" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. MYELINATED AXON & NODES OF RANVIER (SALTATORY CONDUCTION)
      ───────────────────────────────────────────────────────────── */}
      {/* Central Axon Core (Cylinder extending from -0.2 to 1.3) */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 16]} />
        <primitive object={somaMaterial} attach="material" />
      </mesh>

      {/* 5 Bulbous Myelin Sheaths (Schwann / Oligodendrocyte Wraps) */}
      {[0.0, 0.3, 0.6, 0.9, 1.2].map((x, idx) => (
        <mesh key={idx} castShadow position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.22, 20]} />
          <primitive object={myelinMaterial} attach="material" />
        </mesh>
      ))}

      {/* Action Potential Traveling Spark */}
      <mesh ref={impulseSparkRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <primitive object={impulseMaterial} attach="material" />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          3. PRE-SYNAPTIC TERMINAL BOUTON & SYNAPTIC CLEFT
      ───────────────────────────────────────────────────────────── */}
      <group position={[1.45, 0, 0]}>
        {/* Terminal Bouton Swelling */}
        <mesh castShadow position={[0, 0, 0]} scale={[1.1, 1.25, 1.1]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <primitive object={somaMaterial} attach="material" />
        </mesh>

        {/* Synaptic Vesicles with dynamic neurotransmitter exocytosis glow */}
        <mesh ref={vesicleGlowRef} position={[0.08, 0, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <primitive object={vesicleMaterial} attach="material" />
        </mesh>

        {/* Small Neurotransmitter Vesicles */}
        {[
          [0.02, 0.05, 0.04],
          [0.02, -0.05, -0.04],
          [0.05, 0.03, -0.03],
          [0.06, -0.03, 0.03],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <primitive object={vesicleMaterial} attach="material" />
          </mesh>
        ))}

        {/* 20 nm Synaptic Cleft Gap & Post-Synaptic Membrane Density */}
        <mesh position={[0.22, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 20]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
