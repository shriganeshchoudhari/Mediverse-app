"use client";

import React, { Suspense, useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { OrbitControls, Stage, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  createClippingPlanes,
  DissectionPlaneType,
  DissectionState,
} from "../../.gemini/skills/3d/DissectionShader";
import { useThreeMemoryCleanup } from "../../.gemini/skills/3d/useThreeMemoryCleanup";
import {
  ORGAN_PRESETS,
  getOrganPresetByChapterId,
  getAllOrganPresets,
  LandmarkPin,
  OrganPreset,
} from "../../.gemini/skills/3d/OrganPresets";
import {
  Layers,
  RotateCcw,
  Play,
  Pause,
  Scissors,
  Eye,
  Info,
  X,
  Activity,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";

interface ThreeCanvasProps {
  chapterId?: string;
  children?: React.ReactNode;
  height?: string;
  initialPresetId?: string;
}

const store = createXRStore();

export default function ThreeCanvas({
  chapterId,
  children,
  height = "560px",
  initialPresetId,
}: ThreeCanvasProps) {
  // Preset resolution
  const preset: OrganPreset = useMemo(() => {
    if (initialPresetId && ORGAN_PRESETS[initialPresetId]) {
      return ORGAN_PRESETS[initialPresetId];
    }
    return getOrganPresetByChapterId(chapterId);
  }, [chapterId, initialPresetId]);

  const [activePresetId, setActivePresetId] = useState<string>(preset.id);
  const currentPreset = useMemo(() => {
    return ORGAN_PRESETS[activePresetId] || preset;
  }, [activePresetId, preset]);

  // Keep preset in sync if chapterId changes
  useEffect(() => {
    setActivePresetId(preset.id);
  }, [preset.id]);

  const [resetKey, setResetKey] = useState<number>(0);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState<boolean>(true);
  const [dissection, setDissection] = useState<DissectionState>({
    activePlane: "none",
    planeOffset: 0.0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const rootGroupRef = useRef<THREE.Group>(null);
  useThreeMemoryCleanup(rootGroupRef);

  // Generate Three.js clipping planes for cross-section dissection
  const clippingPlanes = useMemo(() => {
    return createClippingPlanes(dissection);
  }, [dissection]);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setActivePinId(null);
    setDissection({ activePlane: "none", planeOffset: 0.0 });
    setIsAutoRotate(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeLandmark = useMemo(() => {
    return currentPreset.landmarks.find((lm) => lm.id === activePinId) || null;
  }, [currentPreset, activePinId]);

  const allPresets = useMemo(() => getAllOrganPresets(), []);

  return (
    <div
      ref={containerRef}
      style={{ height: isFullscreen ? "100vh" : height }}
      className={`w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden relative border border-slate-800/80 shadow-2xl transition-all duration-300 select-none ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
      }`}
    >
      {/* WebGL 3D Canvas */}
      <Canvas
        key={`${resetKey}-${currentPreset.id}`}
        camera={{ position: currentPreset.cameraPosition, fov: 45 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          localClippingEnabled: true,
        }}
        shadows
      >
        <XR store={store}>
            <ambientLight intensity={0.65} />
        {/* Dual Cinematic Stage Lights */}
        <pointLight position={[-10, -8, -10]} intensity={0.45} color={currentPreset.themeColors.secondary} />
        <pointLight position={[10, 10, 10]} intensity={0.85} color={currentPreset.themeColors.primary} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <spotLight
          position={[0, 10, 0]}
          intensity={0.5}
          angle={0.6}
          penumbra={1}
          castShadow
        />

        <Suspense
          fallback={
            <Html center>
              <div className="text-white text-xs bg-slate-900/90 px-4 py-2.5 rounded-full border border-slate-700 backdrop-blur-md shadow-2xl flex items-center gap-2 animate-pulse font-mono">
                <Activity className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                Initializing 3D Organ Canvas...
              </div>
            </Html>
          }
        >
          <Stage environment={null} intensity={0.5} adjustCamera={false}>
            <group ref={rootGroupRef}>
              {children || (
                <OrganModelScene
                  preset={currentPreset}
                  activePinId={activePinId}
                  setActivePinId={setActivePinId}
                  clippingPlanes={clippingPlanes}
                />
              )}

              {/* Cross-section visual cutting plane guide */}
              {dissection.activePlane !== "none" && (
                <ClippingPlaneGuide dissection={dissection} />
              )}
            </group>
          </Stage>
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={isAutoRotate && !activePinId}
          autoRotateSpeed={1.0}
          minDistance={1.4}
          maxDistance={8.5}
          makeDefault
        />
      </XR>
        </Canvas>

      {/* Top Left: Organ & Preset Selector Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-xs md:max-w-sm pointer-events-auto">
        <div className="bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800/90 p-3.5 shadow-xl text-left">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                {currentPreset.systemName}
              </span>
            </div>
            <button
              onClick={() => setShowInfoOverlay(!showInfoOverlay)}
              className="text-slate-400 hover:text-white transition p-0.5 rounded"
              title="Toggle Overview"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-white font-semibold text-sm leading-tight mb-1">
            {currentPreset.title}
          </h3>

          {showInfoOverlay && (
            <>
              <p className="text-slate-400 text-xs leading-relaxed mb-2">
                {currentPreset.subtitle}
              </p>
              <div className="text-[11px] text-slate-500 line-clamp-2 italic border-t border-slate-800/80 pt-1.5">
                {currentPreset.overview}
              </div>
            </>
          )}

          {/* Quick System Switcher */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {allPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePresetId(p.id);
                  setActivePinId(null);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition border ${
                  activePresetId === p.id
                    ? "bg-blue-600/90 text-white border-blue-500 shadow-sm"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {p.systemName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Right: Dissection Cross-Section Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800/90 shadow-xl min-w-[210px] pointer-events-auto">
        <div className="text-white text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-blue-400" />
            <span>Cross-Section</span>
          </span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-blue-950/60 text-blue-400 rounded border border-blue-800/50">
            {dissection.activePlane}
          </span>
        </div>

        {/* Anatomical Plane Selection */}
        <div className="grid grid-cols-4 gap-1">
          {(["none", "sagittal", "coronal", "transverse"] as DissectionPlaneType[]).map((plane) => (
            <button
              key={plane}
              onClick={() =>
                setDissection((prev) => ({
                  ...prev,
                  activePlane: plane,
                }))
              }
              className={`py-1 text-[10px] font-medium rounded border transition ${
                dissection.activePlane === plane
                  ? "bg-blue-600 border-blue-500 text-white shadow-sm font-semibold"
                  : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {plane === "none" ? "Off" : plane.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dissection Depth Slider */}
        {dissection.activePlane !== "none" && (
          <div className="flex flex-col gap-1.5 mt-1 border-t border-slate-800/80 pt-2">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Section Depth</span>
              <span className="font-mono text-blue-400">
                {(dissection.planeOffset * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="-0.85"
              max="0.85"
              step="0.05"
              value={dissection.planeOffset}
              onChange={(e) =>
                setDissection((prev) => ({
                  ...prev,
                  planeOffset: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {currentPreset.dissectionHints && (
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 italic">
                💡 {currentPreset.dissectionHints.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Center / Left: Interactive Landmark Pin Drawer */}
      <div className="absolute bottom-4 left-4 right-20 md:right-auto md:max-w-md z-20 pointer-events-auto flex flex-col gap-1.5">
        <div className="bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800/90 p-2.5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Landmark Pins ({currentPreset.landmarks.length})
            </span>
            {activePinId && (
              <button
                onClick={() => setActivePinId(null)}
                className="text-[10px] text-slate-400 hover:text-white transition underline"
              >
                Clear selection
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {currentPreset.landmarks.map((lm) => {
              const isSelected = activePinId === lm.id;
              return (
                <button
                  key={lm.id}
                  onClick={() => setActivePinId(isSelected ? null : lm.id)}
                  style={{
                    borderColor: isSelected ? lm.color || "#3b82f6" : undefined,
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-slate-800 text-white shadow-md ring-1 ring-blue-500"
                      : "bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: lm.color || "#3b82f6" }}
                  />
                  <span>{lm.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Right: Canvas Tools (Reset, Auto-rotate, Fullscreen) */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 z-20 pointer-events-auto">
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className="p-2 bg-slate-950/85 hover:bg-slate-800/90 backdrop-blur-md text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800/90 shadow-md transition"
          title={isAutoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
        >
          {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-slate-950/85 hover:bg-slate-800/90 backdrop-blur-md text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800/90 shadow-md transition"
          title="Reset Camera & Dissection"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-slate-950/85 hover:bg-slate-800/90 backdrop-blur-md text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800/90 shadow-md transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Landmark Detail Modal / HUD Card (Right side in Fullscreen or floating) */}
      {activeLandmark && (
        <div className="absolute bottom-20 right-4 max-w-sm w-full z-30 pointer-events-auto animate-fade-in hidden md:block">
          <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-xl p-4 text-left shadow-2xl text-slate-200 border-l-4" style={{ borderLeftColor: activeLandmark.color || "#3b82f6" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
                  {activeLandmark.category}
                </span>
                <h4 className="text-white font-bold text-sm mt-1">{activeLandmark.name}</h4>
              </div>
              <button
                onClick={() => setActivePinId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-850 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
              {activeLandmark.shortDescription}
            </p>

            <div className="space-y-2 text-[11px] border-t border-slate-800 pt-2">
              <div>
                <span className="text-emerald-400 font-semibold block">⚡ Physiological Role:</span>
                <span className="text-slate-300">{activeLandmark.physiologicalRole}</span>
              </div>

              <div>
                <span className="text-amber-400 font-semibold block">🩺 Clinical Significance:</span>
                <span className="text-slate-300">{activeLandmark.clinicalSignificance}</span>
              </div>

              {activeLandmark.pathologyNote && (
                <div>
                  <span className="text-rose-400 font-semibold block">🔬 Pathology & Pharmacology:</span>
                  <span className="text-slate-300">{activeLandmark.pathologyNote}</span>
                </div>
              )}

              {activeLandmark.histology && (
                <div>
                  <span className="text-indigo-400 font-semibold block">🧬 Histology:</span>
                  <span className="text-slate-400 italic">{activeLandmark.histology}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Visual cutting plane helper displayed when dissection is active.
 */
function ClippingPlaneGuide({ dissection }: { dissection: DissectionState }) {
  const guideRef = useRef<THREE.Mesh>(null);

  const position: [number, number, number] = useMemo(() => {
    switch (dissection.activePlane) {
      case "sagittal":
        return [dissection.planeOffset * 2.0, 0, 0];
      case "coronal":
        return [0, 0, dissection.planeOffset * 2.0];
      case "transverse":
        return [0, dissection.planeOffset * 2.0, 0];
      default:
        return [0, 0, 0];
    }
  }, [dissection]);

  const rotation: [number, number, number] = useMemo(() => {
    switch (dissection.activePlane) {
      case "sagittal":
        return [0, Math.PI / 2, 0];
      case "coronal":
        return [0, 0, 0];
      case "transverse":
        return [Math.PI / 2, 0, 0];
      default:
        return [0, 0, 0];
    }
  }, [dissection]);

  return (
    <mesh ref={guideRef} position={position} rotation={rotation}>
      <planeGeometry args={[3.2, 3.2]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        wireframe={false}
        depthWrite={false}
      />
    </mesh>
  );
}

interface LandmarkPinMarkerProps {
  landmark: LandmarkPin;
  isActive: boolean;
  onClick: (e: any) => void;
}

/**
 * 3D Landmark Pin Marker with pulsating beacon and interactive Drei Html tooltip.
 */
function LandmarkPinMarker({ landmark, isActive, onClick }: LandmarkPinMarkerProps) {
  const pinRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1;
      beaconRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={landmark.position} ref={pinRef} onClick={onClick}>
      {/* Glowing Outer Beacon */}
      <mesh ref={beaconRef}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial
          color={landmark.color || "#3b82f6"}
          transparent
          opacity={isActive ? 0.9 : 0.45}
        />
      </mesh>

      {/* Solid Pin Core */}
      <mesh>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshPhysicalMaterial
          color={landmark.color || "#3b82f6"}
          emissive={landmark.accentColor || "#93c5fd"}
          emissiveIntensity={isActive ? 1.0 : 0.4}
          roughness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Pin Stalk / Indicator Line */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.08, 8]} />
        <meshBasicMaterial color={landmark.color || "#3b82f6"} />
      </mesh>

      {/* Floating 3D Tooltip */}
      {isActive && (
        <Html position={[0, 0.15, 0]} center className="pointer-events-auto">
          <div className="bg-slate-950/95 border border-slate-700/80 text-slate-100 p-3 rounded-xl shadow-2xl min-w-[220px] max-w-[280px] backdrop-blur-xl animate-fade-in font-sans text-left border-l-4" style={{ borderLeftColor: landmark.color || "#3b82f6" }}>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[9px] uppercase font-mono font-bold text-blue-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                {landmark.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(e);
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded"
              >
                ✕
              </button>
            </div>
            <h5 className="font-bold text-xs text-white mb-1 leading-tight">{landmark.name}</h5>
            <p className="text-[11px] text-slate-300 leading-snug">{landmark.shortDescription}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

interface OrganModelSceneProps {
  preset: OrganPreset;
  activePinId: string | null;
  setActivePinId: (id: string | null) => void;
  clippingPlanes: THREE.Plane[];
}

/**
 * Organ Model Scene Dispatcher with comprehensive 3D organ presets.
 */
function OrganModelScene({
  preset,
  activePinId,
  setActivePinId,
  clippingPlanes,
}: OrganModelSceneProps) {
  const sceneGroupRef = useRef<THREE.Group>(null);

  // Apply clipping planes and memory update triggers to all child meshes
  useEffect(() => {
    if (!sceneGroupRef.current) return;
    sceneGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.clippingPlanes = clippingPlanes;
            mat.clipShadows = true;
            mat.needsUpdate = true;
          });
        } else {
          child.material.clippingPlanes = clippingPlanes;
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [clippingPlanes, preset.id]);

  const handlePinClick = (e: any, id: string) => {
    e.stopPropagation();
    setActivePinId(activePinId === id ? null : id);
  };

  const renderOrganGeometry = () => {
    switch (preset.id) {
      case "cardiovascular":
        return <CardiovascularGeometry clippingPlanes={clippingPlanes} />;
      case "respiratory":
        return <RespiratoryGeometry clippingPlanes={clippingPlanes} />;
      case "renal":
        return <RenalGeometry clippingPlanes={clippingPlanes} />;
      case "neurophysiology":
        return <NeurophysiologyGeometry clippingPlanes={clippingPlanes} />;
      case "gastrointestinal":
        return <GastrointestinalGeometry clippingPlanes={clippingPlanes} />;
      case "endocrine":
        return <EndocrineGeometry clippingPlanes={clippingPlanes} />;
      case "homeostasis":
        return <HomeostasisGeometry clippingPlanes={clippingPlanes} />;
      case "blood-composition":
        return <BloodCompositionGeometry clippingPlanes={clippingPlanes} />;
      case "special-senses-vision":
        return <VisionGeometry clippingPlanes={clippingPlanes} />;
      case "reproductive-cycles":
        return <ReproductiveGeometry clippingPlanes={clippingPlanes} />;
      case "integrated-exercise":
        return <ExerciseGeometry clippingPlanes={clippingPlanes} />;
      default:
        return <CardiovascularGeometry clippingPlanes={clippingPlanes} />;
    }
  };

  return (
    <group ref={sceneGroupRef}>
      {/* 3D Anatomical Organ Model */}
      {renderOrganGeometry()}

      {/* Interactive 3D Landmark Pins */}
      {preset.landmarks.map((landmark) => (
        <LandmarkPinMarker
          key={landmark.id}
          landmark={landmark}
          isActive={activePinId === landmark.id}
          onClick={(e) => handlePinClick(e, landmark.id)}
        />
      ))}
    </group>
  );
}

// ============================================================================
// 1. CARDIOVASCULAR 3D GEOMETRY
// ============================================================================
function CardiovascularGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const heartGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (heartGroupRef.current) {
      // Physiological systolic contraction / diastolic relaxation pulse
      const t = state.clock.elapsedTime * 4.5;
      const beat = Math.sin(t) > 0.5 ? Math.sin(t) * 0.05 : 0;
      heartGroupRef.current.scale.set(1 + beat, 1 + beat * 1.2, 1 + beat);
    }
  });

  return (
    <group ref={heartGroupRef} rotation={[0.2, 0.2, 0]}>
      {/* Left Ventricle (Thick Myocardium) */}
      <mesh position={[-0.25, -0.28, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Right Ventricle */}
      <mesh position={[0.28, -0.28, 0]}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshPhysicalMaterial
          color="#ef4444"
          roughness={0.25}
          clearcoat={0.7}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Interventricular Septum (Partition) */}
      <mesh position={[0.0, -0.2, 0.08]} scale={[0.15, 0.7, 0.4]}>
        <boxGeometry />
        <meshPhysicalMaterial
          color="#991b1b"
          roughness={0.3}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Right Atrium */}
      <mesh position={[0.42, 0.35, 0]}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          roughness={0.25}
          transmission={0.25}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Left Atrium */}
      <mesh position={[-0.4, 0.35, -0.1]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshPhysicalMaterial
          color="#ef4444"
          roughness={0.25}
          transmission={0.25}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Ascending Aorta & Aortic Arch */}
      <mesh position={[0.05, 0.65, 0.1]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.14, 0.14, 0.75, 24]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.15}
          clearcoat={0.8}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Aortic Valve Ring at base of aorta */}
      <mesh position={[0.06, 0.38, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.03, 16, 32]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          roughness={0.1}
          metalness={0.2}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Pulmonary Trunk */}
      <mesh position={[-0.2, 0.62, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.12, 0.12, 0.7, 24]} />
        <meshPhysicalMaterial
          color="#2563eb"
          roughness={0.2}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Superior Vena Cava (entering RA) */}
      <mesh position={[0.48, 0.8, -0.05]}>
        <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
        <meshPhysicalMaterial
          color="#1d4ed8"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 2. RESPIRATORY 3D GEOMETRY
// ============================================================================
function RespiratoryGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const lungsGroupRef = useRef<THREE.Group>(null);
  const diaphragmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const breath = Math.sin(state.clock.elapsedTime * 2.2);
    if (lungsGroupRef.current) {
      lungsGroupRef.current.scale.set(
        1 + breath * 0.06,
        1 + breath * 0.08,
        1 + breath * 0.06
      );
    }
    if (diaphragmRef.current) {
      diaphragmRef.current.position.y = -0.7 - breath * 0.08;
    }
  });

  return (
    <group rotation={[0, 0.15, 0]}>
      {/* Trachea (Cartilage rings) */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.65, 24]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          roughness={0.2}
          clearcoat={0.8}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Right Main Bronchus (Shorter, steeper) */}
      <mesh position={[0.18, 0.52, 0]} rotation={[0, 0, -0.45]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Left Main Bronchus (More horizontal) */}
      <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, 0.75]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Expanding Lungs Group */}
      <group ref={lungsGroupRef}>
        {/* Right Lung (3 lobes) */}
        <mesh position={[0.45, 0.1, 0]} scale={[0.85, 1.25, 0.7]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshPhysicalMaterial
            color="#ec4899"
            roughness={0.3}
            transmission={0.3}
            thickness={0.6}
            clearcoat={0.5}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>

        {/* Left Lung (2 lobes, cardiac notch) */}
        <mesh position={[-0.45, 0.1, 0]} scale={[0.75, 1.2, 0.65]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshPhysicalMaterial
            color="#ec4899"
            roughness={0.3}
            transmission={0.3}
            thickness={0.6}
            clearcoat={0.5}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>

        {/* Alveolar Sac Cluster representation on Right Lung */}
        {[-0.05, 0.05].map((dx, i) => (
          <mesh key={i} position={[0.55 + dx, 0.18, 0.18]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshPhysicalMaterial
              color="#f472b6"
              roughness={0.2}
              transmission={0.4}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
        ))}

        {/* Pulmonary Capillary Mesh rings */}
        <mesh position={[0.35, -0.12, 0.22]} rotation={[0.4, 0.3, 0]}>
          <torusGeometry args={[0.12, 0.02, 12, 24]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            roughness={0.1}
            clearcoat={0.9}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      </group>

      {/* Diaphragm Muscle Dome */}
      <mesh
        ref={diaphragmRef}
        position={[0, -0.7, 0]}
        scale={[1.65, 0.35, 1.1]}
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          roughness={0.35}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3. RENAL 3D GEOMETRY
// ============================================================================
function RenalGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const glomerularRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glomerularRef.current) {
      glomerularRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group rotation={[0.3, 0.3, 0]}>
      {/* Bowman's Capsule (Double-walled cup) */}
      <mesh position={[-0.1, 0.1, 0]} scale={[1.1, 1.1, 0.8]}>
        <torusGeometry args={[0.65, 0.18, 16, 32, Math.PI * 1.5]} />
        <meshPhysicalMaterial
          color="#eab308"
          roughness={0.2}
          transmission={0.45}
          thickness={0.6}
          clearcoat={0.9}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Glomerular Capillary Tuft / Knot */}
      <mesh ref={glomerularRef} position={[0.0, 0.05, 0.1]}>
        <torusKnotGeometry args={[0.32, 0.09, 80, 12, 2, 3]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.15}
          metalness={0.2}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Afferent Arteriole (Input) */}
      <mesh position={[-0.35, 0.45, 0.1]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.065, 0.065, 0.5, 16]} />
        <meshPhysicalMaterial
          color="#ef4444"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Efferent Arteriole (Output) */}
      <mesh position={[0.3, 0.48, 0.1]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.045, 0.045, 0.5, 16]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Proximal Convoluted Tubule (PCT) */}
      <mesh position={[0.42, -0.22, 0.1]} rotation={[0.3, 0.4, 0.8]}>
        <torusGeometry args={[0.32, 0.08, 16, 32, Math.PI * 1.3]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          roughness={0.25}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Loop of Henle (Hairpin descent) */}
      <mesh position={[-0.2, -0.58, -0.05]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.22, 0.05, 12, 32, Math.PI]} />
        <meshPhysicalMaterial
          color="#10b981"
          roughness={0.2}
          clearcoat={0.8}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 4. NEUROPHYSIOLOGY 3D GEOMETRY
// ============================================================================
function NeurophysiologyGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const spikeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (spikeRef.current) {
      // Action potential traveling pulse down the axon
      const progress = (state.clock.elapsedTime * 1.5) % 3.0;
      spikeRef.current.position.y = 0.8 - progress;
    }
  });

  return (
    <group rotation={[0, 0.3, 0.4]}>
      {/* Neuronal Soma / Cell Body */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshPhysicalMaterial
          color="#f59e0b"
          roughness={0.2}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Axon Hillock (Conical initial segment) */}
      <mesh position={[0, 0.72, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.35, 24]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          roughness={0.15}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Axon Central Cylinder Core */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 1.8, 16]} />
        <meshPhysicalMaterial
          color="#fde68a"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Action Potential Wave Particle */}
      <mesh ref={spikeRef} position={[0, 0.6, 0.06]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Myelin Sheaths (Concentric insulating wraps with Nodes of Ranvier) */}
      {[-0.5, 0.0, 0.5].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.38, 20]} />
          <meshPhysicalMaterial
            color="#10b981"
            roughness={0.25}
            transmission={0.35}
            thickness={0.5}
            clearcoat={1.0}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}

      {/* Presynaptic Terminal Bouton */}
      <mesh position={[0, -1.05, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.08, 0.4, 24]} />
        <meshPhysicalMaterial
          color="#6366f1"
          roughness={0.2}
          clearcoat={0.9}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Synaptic Vesicles inside bouton */}
      {[-0.08, 0.08].map((dx, i) => (
        <mesh key={i} position={[dx, -1.15, 0.06]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshPhysicalMaterial
            color="#a5b4fc"
            roughness={0.1}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}

      {/* Postsynaptic Membrane Barrier */}
      <mesh position={[0, -1.4, 0]} scale={[1.2, 0.08, 0.6]}>
        <boxGeometry />
        <meshPhysicalMaterial
          color="#059669"
          roughness={0.3}
          clearcoat={0.7}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 5. GASTROINTESTINAL 3D GEOMETRY
// ============================================================================
function GastrointestinalGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const giRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (giRef.current) {
      // Subtle peristaltic wave motion
      giRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group ref={giRef} rotation={[0.2, 0.4, 0]}>
      {/* Stomach Body & Fundus */}
      <mesh position={[-0.25, 0.2, 0]} scale={[1.3, 0.85, 0.75]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#f87171"
          roughness={0.25}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Esophageal Inflow */}
      <mesh position={[-0.45, 0.75, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.07, 0.07, 0.65, 16]} />
        <meshPhysicalMaterial
          color="#fda4af"
          roughness={0.2}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Duodenal C-Loop (Intestine) */}
      <mesh position={[0.38, -0.28, 0]} rotation={[0, 0, 1.25]}>
        <torusGeometry args={[0.38, 0.09, 16, 32, Math.PI * 1.2]} />
        <meshPhysicalMaterial
          color="#fb923c"
          roughness={0.3}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Microscopic Intestinal Villi projection cylinders */}
      {[0.25, 0.38, 0.5].map((x, idx) => (
        <mesh key={idx} position={[x, 0.02, 0.15]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
          <meshPhysicalMaterial
            color="#fdba74"
            roughness={0.2}
            clearcoat={0.8}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}

      {/* Crypt of Lieberkühn base */}
      <mesh position={[0.2, -0.42, 0.1]} scale={[0.4, 0.12, 0.2]}>
        <boxGeometry />
        <meshPhysicalMaterial
          color="#a855f7"
          roughness={0.3}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 6. ENDOCRINE 3D GEOMETRY
// ============================================================================
function EndocrineGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  return (
    <group rotation={[0, 0.25, 0.08]}>
      {/* Trachea behind Thyroid */}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.22, 0.22, 1.9, 24]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          roughness={0.3}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Thyroid Left Lobe */}
      <mesh position={[-0.28, 0.0, 0.12]} scale={[0.65, 1.25, 0.55]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          roughness={0.35}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Thyroid Right Lobe */}
      <mesh position={[0.28, 0.0, 0.12]} scale={[0.65, 1.25, 0.55]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          roughness={0.35}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Thyroid Isthmus Connector */}
      <mesh position={[0.0, -0.12, 0.2]} scale={[1.3, 0.32, 0.35]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial
          color="#991b1b"
          roughness={0.35}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Thyroid Follicle Spherical Colloid unit */}
      <mesh position={[0.0, -0.12, 0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial
          color="#fca5a5"
          roughness={0.1}
          transmission={0.4}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>

      {/* Adrenal Cortex Pyramidal Gland floating showcase */}
      <mesh position={[0.38, 0.35, 0.15]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.18, 0.35, 4]} />
        <meshPhysicalMaterial
          color="#ea580c"
          roughness={0.25}
          clearcoat={0.8}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 7. CELL MEMBRANE & HOMEOSTASIS 3D GEOMETRY
// ============================================================================
function HomeostasisGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const membraneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (membraneRef.current) {
      membraneRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    }
  });

  return (
    <group ref={membraneRef} rotation={[0.4, 0.35, 0]}>
      {/* Top Phospholipid Monolayer */}
      {[-1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5].map((x, i) => (
        <group key={`top-${i}`} position={[x, 0.55, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshPhysicalMaterial
              color="#3b82f6"
              roughness={0.1}
              clearcoat={1.0}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshPhysicalMaterial color="#f43f5e" roughness={0.3} clippingPlanes={clippingPlanes} clipShadows />
          </mesh>
        </group>
      ))}

      {/* Bottom Phospholipid Monolayer */}
      {[-1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5].map((x, i) => (
        <group key={`bot-${i}`} position={[x, -0.55, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshPhysicalMaterial
              color="#3b82f6"
              roughness={0.1}
              clearcoat={1.0}
              clippingPlanes={clippingPlanes}
              clipShadows
            />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshPhysicalMaterial color="#f43f5e" roughness={0.3} clippingPlanes={clippingPlanes} clipShadows />
          </mesh>
        </group>
      ))}

      {/* Embedded Transmembrane Channel Protein */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.35, 32]} />
        <meshPhysicalMaterial
          color="#10b981"
          roughness={0.2}
          clearcoat={1.0}
          transmission={0.4}
          thickness={0.8}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 8. BLOOD & RBC 3D GEOMETRY
// ============================================================================
function BloodCompositionGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  const rbcRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rbcRef.current) {
      rbcRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      rbcRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group ref={rbcRef} rotation={[0.4, 0.4, 0]}>
      {/* Biconcave Torus Rim */}
      <mesh castShadow>
        <torusGeometry args={[0.75, 0.32, 20, 100]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
      {/* Central Thin Dimple */}
      <mesh scale={[0.82, 0.82, 0.18]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          roughness={0.3}
          clearcoat={0.6}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 9. SPECIAL SENSES (VISION) 3D GEOMETRY
// ============================================================================
function VisionGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  return (
    <group rotation={[0, -1.2, 0.2]}>
      {/* Sclera Eyeball Shell */}
      <mesh>
        <sphereGeometry args={[0.82, 32, 32]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.15}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
      {/* Iris Ring */}
      <mesh position={[0.76, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 32]} />
        <meshPhysicalMaterial
          color="#2563eb"
          roughness={0.1}
          clearcoat={0.9}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
      {/* Central Pupil */}
      <mesh position={[0.79, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 32]} />
        <meshPhysicalMaterial
          color="#020617"
          roughness={0.9}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 10. REPRODUCTIVE 3D GEOMETRY
// ============================================================================
function ReproductiveGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  return (
    <group rotation={[0.1, 0, 0]}>
      {/* Uterus Body (Pear cone) */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.48, 0.85, 32]} />
        <meshPhysicalMaterial
          color="#ec4899"
          roughness={0.3}
          clearcoat={0.8}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
      {/* Bilateral Ovaries */}
      <mesh position={[-0.75, 0.18, 0]} scale={[1.2, 0.8, 0.8]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshPhysicalMaterial
          color="#fbcfe8"
          roughness={0.4}
          clearcoat={0.5}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
      <mesh position={[0.75, 0.18, 0]} scale={[1.2, 0.8, 0.8]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshPhysicalMaterial
          color="#fbcfe8"
          roughness={0.4}
          clearcoat={0.5}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 11. EXERCISE & SARCOMERE 3D GEOMETRY
// ============================================================================
function ExerciseGeometry({ clippingPlanes }: { clippingPlanes: THREE.Plane[] }) {
  return (
    <group rotation={[0.4, 0.8, 0]}>
      {/* Myofibril Outer Sheath */}
      <mesh>
        <cylinderGeometry args={[0.48, 0.48, 2.0, 16]} />
        <meshPhysicalMaterial
          color="#ef4444"
          roughness={0.3}
          transparent
          opacity={0.6}
          clearcoat={0.5}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
      {/* Actin Filaments */}
      {[-0.2, 0.2].map((x, idx) => (
        <mesh key={idx} position={[x, 0, 0.16]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
          <meshPhysicalMaterial
            color="#dc2626"
            roughness={0.15}
            clippingPlanes={clippingPlanes}
            clipShadows
          />
        </mesh>
      ))}
      {/* Myosin Thick Filament */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.09, 0.09, 1.4, 8]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          roughness={0.1}
          metalness={0.6}
          clearcoat={1.0}
          clippingPlanes={clippingPlanes}
          clipShadows
        />
      </mesh>
    </group>
  );
}





