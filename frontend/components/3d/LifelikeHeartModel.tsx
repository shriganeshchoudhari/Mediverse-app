'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  computeCardiacCycleState,
  createMyocardiumMaterial,
  createGreatVesselMaterial,
  createCoronaryVesselMaterial,
  LivingTissueShaderConfig,
} from '@/.gemini/skills/3d/LivingHeartEngine';

interface LifelikeHeartModelProps {
  bpm?: number;
  isPaused?: boolean;
  wetness?: number;
  enableTorsion?: boolean;
  clippingPlanes?: THREE.Plane[];
}

export default function LifelikeHeartModel({
  bpm = 72,
  isPaused = false,
  wetness = 1.0,
  enableTorsion = true,
  clippingPlanes = [],
}: LifelikeHeartModelProps) {
  const wholeHeartRef = useRef<THREE.Group>(null);
  const leftVentricleRef = useRef<THREE.Group>(null);
  const rightVentricleRef = useRef<THREE.Group>(null);
  const atriaGroupRef = useRef<THREE.Group>(null);
  const aortaRef = useRef<THREE.Group>(null);
  const apexRef = useRef<THREE.Group>(null);

  // Tissue PBR Materials
  const shaderConfig: LivingTissueShaderConfig = useMemo(
    () => ({
      wetness,
      subsurfaceScattering: true,
      translucencyDepth: 1.2,
      clippingPlanes,
    }),
    [wetness, clippingPlanes]
  );

  const myocardiumMaterial = useMemo(() => createMyocardiumMaterial(shaderConfig), [shaderConfig]);
  const aortaMaterial = useMemo(() => createGreatVesselMaterial('aorta', shaderConfig), [shaderConfig]);
  const pulmonaryMaterial = useMemo(() => createGreatVesselMaterial('pulmonary_artery', shaderConfig), [shaderConfig]);
  const venaCavaMaterial = useMemo(() => createGreatVesselMaterial('vena_cava', shaderConfig), [shaderConfig]);
  const coronaryArteryMaterial = useMemo(() => createCoronaryVesselMaterial(true, shaderConfig), [shaderConfig]);
  const coronaryVeinMaterial = useMemo(() => createCoronaryVesselMaterial(false, shaderConfig), [shaderConfig]);

  // Real-Time Biomechanical Animation Loop
  useFrame((state) => {
    if (isPaused) return;

    const cycleState = computeCardiacCycleState(state.clock.elapsedTime, bpm);

    // 1. Atrial Pulsation (Atrial Systole kick)
    if (atriaGroupRef.current) {
      const aScale = 1.0 - cycleState.atrialContraction * 0.12;
      atriaGroupRef.current.scale.set(aScale, aScale, aScale);
    }

    // 2. Ventricular Systole & Longitudinal Shortening
    const vSqueeze = cycleState.ventricularContraction;
    if (leftVentricleRef.current) {
      leftVentricleRef.current.scale.set(
        1.0 - vSqueeze * 0.08,
        1.0 - cycleState.longitudinalShortening,
        1.0 - vSqueeze * 0.08
      );
    }
    if (rightVentricleRef.current) {
      rightVentricleRef.current.scale.set(
        1.0 - vSqueeze * 0.10,
        1.0 - cycleState.longitudinalShortening * 0.8,
        1.0 - vSqueeze * 0.09
      );
    }

    // 3. Apical Torsion (Counter-clockwise wringing twist)
    if (apexRef.current && enableTorsion) {
      apexRef.current.rotation.y = cycleState.apicalTorsionAngleRad;
      apexRef.current.rotation.z = cycleState.apicalTorsionAngleRad * 0.4;
    }

    // 4. Aortic Pulse Dilation Wave
    if (aortaRef.current) {
      const aDil = 1.0 + cycleState.aorticPulseDilation;
      aortaRef.current.scale.set(aDil, 1.0, aDil);
    }
  });

  return (
    <group ref={wholeHeartRef} rotation={[0.15, -0.2, 0]} position={[0, -0.1, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. VENTRICULAR MASS & APEX (TORSION DRIVEN)
      ───────────────────────────────────────────────────────────── */}
      <group ref={apexRef}>
        {/* Left Ventricle (Thick Conical Myocardium) */}
        <group ref={leftVentricleRef} position={[-0.24, -0.32, 0.05]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0.1, 0, -0.2]}>
            {/* Organic conical chamber */}
            <cylinderGeometry args={[0.52, 0.22, 0.95, 32]} />
            <primitive object={myocardiumMaterial} attach="material" />
          </mesh>
          {/* Apical rounded tip */}
          <mesh castShadow position={[-0.08, -0.52, 0.04]}>
            <sphereGeometry args={[0.26, 32, 32]} />
            <primitive object={myocardiumMaterial} attach="material" />
          </mesh>
        </group>

        {/* Right Ventricle (Crescentic Wall) */}
        <group ref={rightVentricleRef} position={[0.26, -0.26, 0.12]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0.15, 0, 0.2]}>
            <cylinderGeometry args={[0.46, 0.26, 0.82, 32]} />
            <primitive object={myocardiumMaterial} attach="material" />
          </mesh>
        </group>

        {/* Interventricular Groove / Sulcus Depression */}
        <mesh position={[0.02, -0.28, 0.32]} rotation={[0, 0, -0.15]} scale={[0.08, 0.85, 0.06]}>
          <boxGeometry />
          <primitive object={myocardiumMaterial} attach="material" />
        </mesh>

        {/* ─────────────────────────────────────────────────────────────
            CORONARY ARTERIAL & VENOUS VASCULATURE (LAD & RCA)
        ───────────────────────────────────────────────────────────── */}
        {/* Left Anterior Descending (LAD) Coronary Artery in Anterior Sulcus */}
        <mesh position={[0.04, -0.25, 0.35]} rotation={[0, 0, -0.22]}>
          <cylinderGeometry args={[0.025, 0.015, 0.85, 16]} />
          <primitive object={coronaryArteryMaterial} attach="material" />
        </mesh>
        {/* Diagonal Arterial Branch */}
        <mesh position={[-0.12, -0.32, 0.32]} rotation={[0, 0, -0.85]}>
          <cylinderGeometry args={[0.018, 0.01, 0.35, 16]} />
          <primitive object={coronaryArteryMaterial} attach="material" />
        </mesh>

        {/* Great Cardiac Vein (Running parallel to LAD) */}
        <mesh position={[0.08, -0.26, 0.34]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.028, 0.02, 0.82, 16]} />
          <primitive object={coronaryVeinMaterial} attach="material" />
        </mesh>

        {/* Right Coronary Artery (RCA in AV Sulcus) */}
        <mesh position={[0.34, -0.05, 0.26]} rotation={[0.4, 0.5, 0.9]}>
          <cylinderGeometry args={[0.024, 0.018, 0.65, 16]} />
          <primitive object={coronaryArteryMaterial} attach="material" />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. ATRIAL MASS & AURICLES (ATRIAL KICK SYSTOLE)
      ───────────────────────────────────────────────────────────── */}
      <group ref={atriaGroupRef} position={[0, 0.38, -0.05]}>
        {/* Right Atrium Chamber */}
        <mesh castShadow position={[0.44, 0, -0.02]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <primitive object={myocardiumMaterial} attach="material" />
        </mesh>
        {/* Right Auricle (Dog-ear flap over aortic root) */}
        <mesh position={[0.26, 0.08, 0.28]} rotation={[0.2, 0.4, -0.4]} scale={[0.18, 0.28, 0.12]}>
          <boxGeometry />
          <primitive object={myocardiumMaterial} attach="material" />
        </mesh>

        {/* Left Atrium Chamber (Posterior position) */}
        <mesh castShadow position={[-0.38, 0.02, -0.15]}>
          <sphereGeometry args={[0.40, 32, 32]} />
          <primitive object={myocardiumMaterial} attach="material" />
        </mesh>
        {/* Left Auricle (Tubular Pectinate appendage) */}
        <mesh position={[-0.42, 0.05, 0.22]} rotation={[-0.1, -0.3, 0.5]} scale={[0.16, 0.25, 0.12]}>
          <boxGeometry />
          <primitive object={myocardiumMaterial} attach="material" />
        </mesh>

        {/* 4 Pulmonary Vein Stubs entering Left Atrium */}
        {[-0.58, -0.22].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 0.15, -0.3]} rotation={[0.4, 0, 0.2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 16]} />
              <primitive object={pulmonaryMaterial} attach="material" />
            </mesh>
            <mesh position={[x, -0.12, -0.3]} rotation={[0.4, 0, 0.2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 16]} />
              <primitive object={pulmonaryMaterial} attach="material" />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. GREAT VESSELS & ARTERIAL TREE (AORTA, PA, SVC/IVC)
      ───────────────────────────────────────────────────────────── */}
      <group ref={aortaRef} position={[0, 0.35, 0]}>
        {/* Aortic Root Bulb (Sinuses of Valsalva) */}
        <mesh position={[0.02, 0.08, 0.12]} scale={[1.15, 0.8, 1.15]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <primitive object={aortaMaterial} attach="material" />
        </mesh>

        {/* Ascending Aorta */}
        <mesh castShadow position={[0.04, 0.42, 0.08]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.22, 0.25, 0.65, 32]} />
          <primitive object={aortaMaterial} attach="material" />
        </mesh>

        {/* Aortic Arch (Curving Superiorly & Posteriorly to the Left) */}
        <mesh castShadow position={[-0.08, 0.82, -0.05]} rotation={[0, 0, -0.6]}>
          <torusGeometry args={[0.34, 0.18, 24, 32, Math.PI * 0.7]} />
          <primitive object={aortaMaterial} attach="material" />
        </mesh>

        {/* Three Aortic Arch Branch Trunks */}
        {/* 1. Brachiocephalic Trunk (Innominate) */}
        <mesh position={[0.12, 1.05, 0.02]} rotation={[0, 0, -0.18]}>
          <cylinderGeometry args={[0.075, 0.085, 0.35, 16]} />
          <primitive object={aortaMaterial} attach="material" />
        </mesh>
        {/* 2. Left Common Carotid Artery */}
        <mesh position={[-0.04, 1.08, -0.02]} rotation={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.065, 0.075, 0.32, 16]} />
          <primitive object={aortaMaterial} attach="material" />
        </mesh>
        {/* 3. Left Subclavian Artery */}
        <mesh position={[-0.20, 1.04, -0.06]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.065, 0.075, 0.30, 16]} />
          <primitive object={aortaMaterial} attach="material" />
        </mesh>
      </group>

      {/* Pulmonary Trunk & Bifurcation */}
      <group position={[-0.14, 0.52, 0.22]}>
        {/* Main Pulmonary Trunk crossing anterior to ascending aorta */}
        <mesh castShadow position={[0, 0, 0]} rotation={[0.2, 0.3, -0.4]}>
          <cylinderGeometry args={[0.22, 0.24, 0.7, 32]} />
          <primitive object={pulmonaryMaterial} attach="material" />
        </mesh>
        {/* Left Pulmonary Artery branch */}
        <mesh position={[-0.22, 0.28, -0.18]} rotation={[0.1, -0.8, -0.3]}>
          <cylinderGeometry args={[0.12, 0.14, 0.45, 16]} />
          <primitive object={pulmonaryMaterial} attach="material" />
        </mesh>
        {/* Right Pulmonary Artery passing under aortic arch */}
        <mesh position={[0.25, 0.26, -0.24]} rotation={[-0.1, 0.9, 0.3]}>
          <cylinderGeometry args={[0.13, 0.15, 0.52, 16]} />
          <primitive object={pulmonaryMaterial} attach="material" />
        </mesh>
      </group>

      {/* Superior Vena Cava (SVC entering Right Atrium) */}
      <mesh castShadow position={[0.56, 0.72, -0.12]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.19, 0.21, 0.7, 32]} />
        <primitive object={venaCavaMaterial} attach="material" />
      </mesh>

      {/* Inferior Vena Cava (IVC entering inferior Right Atrium) */}
      <mesh castShadow position={[0.50, -0.48, -0.18]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.20, 0.22, 0.55, 32]} />
        <primitive object={venaCavaMaterial} attach="material" />
      </mesh>
    </group>
  );
}
