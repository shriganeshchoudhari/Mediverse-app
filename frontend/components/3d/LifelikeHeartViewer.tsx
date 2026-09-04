'use client';

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import LifelikeHeartModel from './LifelikeHeartModel';
import {
  Heart,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Scissors,
  Droplets,
  Layers,
  Info,
} from 'lucide-react';
import { createClippingPlanes, DissectionPlaneType } from '@/.gemini/skills/3d/DissectionShader';

interface LandmarkInfo {
  id: string;
  name: string;
  position: [number, number, number];
  category: 'structural' | 'vascular' | 'electrophysiological';
  description: string;
  clinicalFact: string;
}

const HEART_LANDMARKS: LandmarkInfo[] = [
  {
    id: 'left-ventricle',
    name: 'Left Ventricle (LV Apex)',
    position: [-0.38, -0.65, 0.15],
    category: 'structural',
    description: 'Thick muscular conical apex responsible for systemic cardiac output (~70 mL SV).',
    clinicalFact: 'Undergoes counter-clockwise wringing twist during systole to maximize ejection fraction.',
  },
  {
    id: 'aortic-root',
    name: 'Aortic Root & Arch',
    position: [0.08, 0.85, 0.12],
    category: 'vascular',
    description: 'Elastic high-pressure conduit receiving systolic stroke volume against systemic afterload.',
    clinicalFact: 'Gives rise to the brachiocephalic, left common carotid, and left subclavian arteries.',
  },
  {
    id: 'lad-artery',
    name: 'Left Anterior Descending (LAD)',
    position: [0.06, -0.22, 0.42],
    category: 'vascular',
    description: 'Major anterior interventricular coronary artery supplying 50% of left ventricular myocardium.',
    clinicalFact: "Known as the 'widow maker' artery; acute thrombotic occlusion causes anterior STEMI.",
  },
  {
    id: 'sa-node',
    name: 'Sinoatrial (SA) Pacemaker',
    position: [0.55, 0.45, -0.05],
    category: 'electrophysiological',
    description: 'Primary physiological cardiac pacemaker in subepicardial high right atrium.',
    clinicalFact: 'Intrinsic automaticity 60-100 bpm driven by funny sodium/potassium pacemaker current (If).',
  },
];

export default function LifelikeHeartViewer() {
  const [bpm, setBpm] = useState<number>(72);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [wetness, setWetness] = useState<number>(0.95);
  const [enableTorsion, setEnableTorsion] = useState<boolean>(true);
  const [activePlane, setActivePlane] = useState<DissectionPlaneType>('none');
  const [planeOffset, setPlaneOffset] = useState<number>(0.0);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkInfo | null>(null);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);

  // Generate Three.js clipping planes for cross-section dissection
  const clippingPlanes = useMemo(() => {
    return createClippingPlanes({ activePlane, planeOffset });
  }, [activePlane, planeOffset]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row text-slate-100">
      {/* ─────────────────────────────────────────────────────────────
          3D WEBGL SURGICAL THEATRE CANVAS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 relative min-h-[520px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Top Header Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full text-xs font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold text-white">Living Biological Model</span>
          <span className="text-slate-500">|</span>
          <span className="text-rose-300 font-bold">{bpm} BPM</span>
        </div>

        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 0.3, 3.6], fov: 45 }}
          gl={{
            localClippingEnabled: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
        >
          {/* ─────────────────────────────────────────────────────────────
              SURGICAL LIGHTING RIG (OR Theater Optics)
          ───────────────────────────────────────────────────────────── */}
          {/* Ambient Biological Baseline */}
          <ambientLight intensity={0.4} color="#fecdd3" />

          {/* Overhead OR Surgical Spotlight */}
          <spotLight
            position={[0, 4.5, 2.5]}
            angle={0.6}
            penumbra={0.5}
            intensity={2.2}
            color="#fff1f2"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Warm Key Light */}
          <directionalLight position={[3, 2, 3]} intensity={1.4} color="#f43f5e" />

          {/* Cool Surgical Blue-White Rim Light (Separates organ contour from background) */}
          <directionalLight position={[-3, -1, -2.5]} intensity={1.8} color="#60a5fa" />

          {/* The Biological Heart Model */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <LifelikeHeartModel
              bpm={bpm}
              isPaused={isPaused}
              wetness={wetness}
              enableTorsion={enableTorsion}
              clippingPlanes={clippingPlanes}
            />
          </Float>

          {/* Interactive 3D Landmark Pins */}
          {showLandmarks &&
            HEART_LANDMARKS.map((lm) => {
              const isSelected = selectedLandmark?.id === lm.id;
              return (
                <group key={lm.id} position={lm.position}>
                  <Html center distanceFactor={4}>
                    <button
                      onClick={() => setSelectedLandmark(lm)}
                      className={`group relative focus:outline-none transition-all ${
                        isSelected ? 'scale-125 ring-2 ring-white rounded-full' : 'hover:scale-110'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-rose-600/90 border-2 border-white shadow-lg flex items-center justify-center text-[9px] font-bold text-white">
                        +
                      </div>
                      <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-slate-700 text-[9px] font-mono px-1.5 py-0.5 rounded text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        {lm.name}
                      </div>
                    </button>
                  </Html>
                </group>
              );
            })}

          {/* Grounding Contact Shadows */}
          <ContactShadows position={[0, -1.35, 0]} opacity={0.65} scale={4} blur={2.2} far={2.5} color="#450a0a" />

          <OrbitControls makeDefault enableDamping dampingFactor={0.05} maxDistance={6} minDistance={2} />
        </Canvas>

        {/* Selected Landmark Card Overlay */}
        {selectedLandmark && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-2 z-20">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                  {selectedLandmark.category} Landmark
                </span>
                <h4 className="font-bold text-sm text-white">{selectedLandmark.name}</h4>
              </div>
              <button
                onClick={() => setSelectedLandmark(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">{selectedLandmark.description}</p>
            <div className="bg-rose-950/50 border border-rose-900/60 p-2 rounded-lg text-[11px] text-rose-300 font-mono flex items-start gap-1.5">
              <Sparkles size={14} className="text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Pearl:</strong> {selectedLandmark.clinicalFact}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SIDEBAR: REAL-TIME BIOMECHANICAL & TISSUE CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
              <Heart size={15} /> Biological Biomechanics
            </div>
            <h3 className="text-xl font-extrabold text-white">Living Heart & Great Vessels</h3>
            <p className="text-xs text-slate-400 mt-1">
              Physiological dual-phase pumping with apical wringing and living PBR subsurface tissue optics.
            </p>
          </div>

          {/* 1. Heart Rate & Animation State */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Heart Rate (BPM)</span>
              <span className="font-mono text-sm font-black text-rose-400">{bpm} BPM</span>
            </div>

            <input
              type="range"
              min={40}
              max={180}
              step={2}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Bradycardia (40)</span>
              <span>Resting (72)</span>
              <span>Tachycardia (180)</span>
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                <span>{isPaused ? 'Resume Beat' : 'Pause Biomechanics'}</span>
              </button>

              <button
                onClick={() => setBpm(72)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Reset to 72 BPM"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* 2. Advanced Tissue & Biomechanics Toggles */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Tissue Optics & Physics
            </span>

            {/* Apical Torsion Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">Apical Wringing (Torsion)</div>
                <div className="text-[10px] text-slate-500">10° counter-clockwise stroke ejection</div>
              </div>
              <input
                type="checkbox"
                checked={enableTorsion}
                onChange={(e) => setEnableTorsion(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            {/* Pericardial Wetness Slider */}
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-300">Serosa Wetness (Clearcoat)</span>
                <span className="font-mono text-rose-400">{Math.round(wetness * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={wetness}
                onChange={(e) => setWetness(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Landmarks Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs font-medium text-slate-300">Show Socratic Pins</span>
              <input
                type="checkbox"
                checked={showLandmarks}
                onChange={(e) => setShowLandmarks(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Cross-Sectional Dissection Clipping */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors size={13} className="text-indigo-400" /> Dissection Slicing
              </div>
            </div>

            {/* Plane Switcher */}
            <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
              {(['none', 'coronal', 'sagittal', 'transverse'] as DissectionPlaneType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePlane(p)}
                  className={`py-1.5 rounded-lg font-bold capitalize transition-all ${
                    activePlane === p ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {activePlane !== 'none' && (
              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Slice Plane Offset</span>
                  <span className="text-indigo-400 font-bold">{planeOffset.toFixed(2)}m</span>
                </div>
                <input
                  type="range"
                  min={-0.8}
                  max={0.8}
                  step={0.02}
                  value={planeOffset}
                  onChange={(e) => setPlaneOffset(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800 pt-4 text-center">
          Mediverse Clinical Simulation Engine &copy; 2026
        </div>
      </div>
    </div>
  );
}
