'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ProcedureScenarioId,
  PROCEDURE_SCENARIOS,
  UltrasoundProbeState,
  NeedleTrajectoryState,
  evaluateNeedleTrajectory,
  computeUltrasoundCrossSection,
  computeProceduralCompetencyScore,
  ProceduralFeedback,
} from '../../.gemini/skills/3d/WebXrProceduralTheaterEngine';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle2,
  ChevronRight,
  Compass,
  Crosshair,
  Droplets,
  Eye,
  EyeOff,
  Flame,
  Glasses,
  HelpCircle,
  Layers,
  Maximize2,
  Minus,
  Move3d,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
  Waves,
  Zap,
} from 'lucide-react';

export default function WebXrProceduralTheater() {
  const [selectedScenario, setSelectedScenario] = useState<ProcedureScenarioId>('IJV_CENTRAL_LINE');
  const scenarioConfig = PROCEDURE_SCENARIOS[selectedScenario];

  // 6-DoF Probe State
  const [probeState, setProbeState] = useState<UltrasoundProbeState>({
    position: { x: 0, y: 0, z: 0 },
    rotationDeg: 0, // 0 = Transverse Short Axis, 90 = Longitudinal Long Axis
    tiltAngleDeg: 0,
    compressionMm: 0,
    depthCm: 5.0,
    gain: 65,
    colorDoppler: false,
  });

  // 6-DoF Needle Trajectory State
  const [needleState, setNeedleState] = useState<NeedleTrajectoryState>({
    entryPoint: { x: 0, y: 0, z: 0 },
    angleDeg: 35,
    azimuthDeg: 5,
    depthMm: 0,
    isAspirating: false,
  });

  // Procedure tracking state
  const [attemptsCount, setAttemptsCount] = useState<number>(1);
  const [bestDistanceMm, setBestDistanceMm] = useState<number>(999);
  const [hasArterialPuncture, setHasArterialPuncture] = useState<boolean>(false);
  const [hasPosteriorTransfixion, setHasPosteriorTransfixion] = useState<boolean>(false);
  const [aspiratedSuccessfully, setAspiratedSuccessfully] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isXrSupported, setIsXrSupported] = useState<boolean>(false);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // WebXR support check
  useEffect(() => {
    if (typeof window !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-vr').then(setIsXrSupported).catch(() => setIsXrSupported(false));
    }
  }, []);

  // Compute live feedback
  const feedback: ProceduralFeedback = useMemo(() => {
    return evaluateNeedleTrajectory(selectedScenario, needleState);
  }, [selectedScenario, needleState]);

  // Compute live ultrasound cross-section data
  const ultrasoundData = useMemo(() => {
    return computeUltrasoundCrossSection(selectedScenario, probeState, needleState);
  }, [selectedScenario, probeState, needleState]);

  // Track milestones
  useEffect(() => {
    if (feedback.targetDistanceMm < bestDistanceMm) {
      setBestDistanceMm(feedback.targetDistanceMm);
    }
    if (feedback.punctureStatus === 'CRITICAL_ARTERY_PUNCTURE') {
      setHasArterialPuncture(true);
    }
    if (feedback.punctureStatus === 'POSTERIOR_WALL_TRANSFIXION') {
      setHasPosteriorTransfixion(true);
    }
    if (feedback.flashbackActive && (feedback.flashbackType === 'VENOUS_DARK_RED' || feedback.flashbackType === 'PERICARDIAL_SEROSANGUINOUS' || feedback.flashbackType === 'CLEAR_CSF')) {
      setAspiratedSuccessfully(true);
    }
  }, [feedback, bestDistanceMm]);

  // Reset procedure
  const handleResetProcedure = () => {
    setNeedleState({
      entryPoint: { x: 0, y: 0, z: 0 },
      angleDeg: scenarioConfig.idealAngleRangeDeg[0] + 5,
      azimuthDeg: 0,
      depthMm: 0,
      isAspirating: false,
    });
    setProbeState(prev => ({ ...prev, compressionMm: 0, rotationDeg: 0 }));
    setAttemptsCount(prev => prev + 1);
    setElapsedSeconds(0);
    setBestDistanceMm(999);
    setHasArterialPuncture(false);
    setHasPosteriorTransfixion(false);
    setAspiratedSuccessfully(false);
    setShowDebriefModal(false);
  };

  // Switch scenario
  const handleSelectScenario = (id: ProcedureScenarioId) => {
    setSelectedScenario(id);
    const cfg = PROCEDURE_SCENARIOS[id];
    setNeedleState({
      entryPoint: { x: 0, y: 0, z: 0 },
      angleDeg: cfg.idealAngleRangeDeg[0] + 5,
      azimuthDeg: 0,
      depthMm: 0,
      isAspirating: false,
    });
    setProbeState({
      position: { x: 0, y: 0, z: 0 },
      rotationDeg: 0,
      tiltAngleDeg: 0,
      compressionMm: 0,
      depthCm: 5.0,
      gain: 65,
      colorDoppler: false,
    });
    setAttemptsCount(1);
    setElapsedSeconds(0);
    setBestDistanceMm(999);
    setHasArterialPuncture(false);
    setHasPosteriorTransfixion(false);
    setAspiratedSuccessfully(false);
    setShowDebriefModal(false);
  };

  // Final Competency Score
  const competency = useMemo(() => {
    return computeProceduralCompetencyScore({
      scenarioId: selectedScenario,
      attemptsCount,
      bestTargetDistanceMm: bestDistanceMm === 999 ? 20 : bestDistanceMm,
      hasArterialPuncture,
      hasPosteriorTransfixion,
      aspiratedSuccessfully,
      timeTakenSec: elapsedSeconds,
    });
  }, [selectedScenario, attemptsCount, bestDistanceMm, hasArterialPuncture, hasPosteriorTransfixion, aspiratedSuccessfully, elapsedSeconds]);

  // Request WebXR VR session
  const handleLaunchWebXr = async () => {
    if (typeof window !== 'undefined' && 'xr' in navigator) {
      try {
        const session = await (navigator as any).xr.requestSession('immersive-vr', {
          requiredFeatures: ['local-floor'],
          optionalFeatures: ['hand-tracking', 'hit-test'],
        });
        console.log('WebXR Session active:', session);
      } catch (e) {
        alert('WebXR Headset not detected. Running high-precision 3D desktop spatial mode.');
      }
    } else {
      alert('WebXR API is not supported in this browser. Running interactive 3D spatial view.');
    }
  };

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP PROCEDURAL THEATER HUD BAR                                */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 shadow-xl flex-shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Move3d className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-white tracking-tight">{scenarioConfig.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                  {scenarioConfig.category.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-xs bg-slate-800 border border-slate-700 text-slate-300">
                  {timeFormatted}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span>Target: <strong className="text-slate-200">{scenarioConfig.targetStructure}</strong></span>
                <span>&bull;</span>
                <span>Ideal Angle: <strong className="text-slate-200">{scenarioConfig.idealAngleRangeDeg[0]}-{scenarioConfig.idealAngleRangeDeg[1]}&deg;</strong></span>
                <span>&bull;</span>
                <span>Target Depth: <strong className="text-slate-200">{scenarioConfig.idealDepthRangeMm[0]}-{scenarioConfig.idealDepthRangeMm[1]} mm</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Scenario Switcher */}
          <div className="flex items-center gap-3">
            <select
              value={selectedScenario}
              onChange={e => handleSelectScenario(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="IJV_CENTRAL_LINE">Right Internal Jugular CVC</option>
              <option value="PERICARDIOCENTESIS">Subxiphoid Pericardiocentesis</option>
              <option value="LUMBAR_PUNCTURE">Lumbar Puncture (L3-L4)</option>
            </select>

            <button
              onClick={handleLaunchWebXr}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95"
            >
              <Glasses className="w-4 h-4" />
              Enter WebXR VR
            </button>

            <button
              onClick={() => setShowDebriefModal(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Award className="w-4 h-4" />
              Complete &amp; Grade
            </button>

            <button
              onClick={handleResetProcedure}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
              title="Reset procedure"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Safety Warning Banner if Critical Complication */}
      {feedback.safetyWarning && (
        <div className="bg-rose-950/90 border-b border-rose-500/60 px-6 py-2 flex items-center justify-between text-xs text-rose-200 animate-pulse">
          <div className="flex items-center gap-2 font-bold">
            <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{feedback.safetyWarning}</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN TWO-PANEL INTERVENTIONAL THEATER                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* =========================================================== */}
        {/* LEFT PANEL: 3D ANATOMICAL SPATIAL WORKBENCH                */}
        {/* =========================================================== */}
        <div className="flex-1 bg-slate-950 border-r border-slate-800 flex flex-col relative overflow-hidden">
          {/* 3D Simulated Anatomical Canvas */}
          <div className="flex-1 relative flex items-center justify-center p-6">
            {/* Visual 3D Spatial Geometry Mockup / Wireframe */}
            <div className="w-full max-w-lg h-[340px] rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Central Visual Anatomic Models */}
              {selectedScenario === 'IJV_CENTRAL_LINE' && (
                <div className="relative w-72 h-44 flex items-center justify-center">
                  {/* Skin Surface Plane */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-500/30 rounded-full blur-[1px]" />
                  {/* SCM Muscle Strap */}
                  <div className="absolute top-4 w-60 h-8 rounded-full bg-rose-950/50 border border-rose-700/40 transform -rotate-6 flex items-center justify-center text-[10px] text-rose-300 font-semibold">
                    Sternocleidomastoid Muscle
                  </div>
                  {/* Right IJV (Blue, compressible) */}
                  <div
                    className={`absolute left-16 top-16 w-24 rounded-full border border-sky-500/70 shadow-lg flex items-center justify-center text-[10px] font-bold text-sky-200 transition-all ${
                      probeState.compressionMm > 3 ? 'h-3 bg-sky-950/40' : 'h-14 bg-sky-900/60'
                    }`}
                  >
                    Right IJV
                  </div>
                  {/* Common Carotid Artery (Red, pulsatile) */}
                  <div className="absolute right-14 top-16 w-14 h-14 rounded-full bg-rose-900/70 border border-rose-500 shadow-lg flex items-center justify-center text-[10px] font-bold text-rose-200 animate-pulse">
                    Carotid
                  </div>
                  {/* Clavicle */}
                  <div className="absolute bottom-2 inset-x-8 h-5 rounded-full bg-slate-200/20 border border-slate-400/30 flex items-center justify-center text-[9px] text-slate-300 font-mono">
                    Clavicle Bone Margin
                  </div>
                </div>
              )}

              {selectedScenario === 'PERICARDIOCENTESIS' && (
                <div className="relative w-72 h-44 flex items-center justify-center">
                  {/* Xiphoid & Rib Margin */}
                  <div className="absolute top-2 inset-x-12 h-6 rounded-full bg-slate-300/20 border border-slate-400/30 flex items-center justify-center text-[10px] text-slate-300">
                    Xiphoid Process
                  </div>
                  {/* Pericardial Fluid Stripe */}
                  <div className="absolute inset-x-8 top-12 bottom-6 rounded-3xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-center text-[10px] font-bold text-amber-300 shadow-xl">
                    Pericardial Tamponade Effusion (Serosanguinous)
                  </div>
                  {/* RV Myocardium */}
                  <div className="absolute w-36 h-20 rounded-2xl bg-rose-950/80 border border-rose-600 flex items-center justify-center text-[10px] font-bold text-rose-200 animate-pulse">
                    RV Anterior Wall
                  </div>
                </div>
              )}

              {selectedScenario === 'LUMBAR_PUNCTURE' && (
                <div className="relative w-72 h-44 flex items-center justify-center flex-col gap-2">
                  <div className="w-56 h-6 rounded-full bg-slate-300/20 border border-slate-400/30 flex items-center justify-center text-[9px] text-slate-300">
                    L3 Spinous Process
                  </div>
                  <div className="w-48 h-5 rounded-full bg-amber-950/60 border border-amber-600/60 flex items-center justify-center text-[9px] font-bold text-amber-300">
                    Ligamentum Flavum ("Tactile Pop")
                  </div>
                  <div className="w-52 h-10 rounded-2xl bg-sky-950/60 border border-sky-400 flex items-center justify-center text-[10px] font-bold text-sky-200">
                    Subarachnoid Space (Clear CSF)
                  </div>
                  <div className="w-56 h-6 rounded-full bg-slate-300/20 border border-slate-400/30 flex items-center justify-center text-[9px] text-slate-300">
                    L4 Spinous Process
                  </div>
                </div>
              )}

              {/* 3D Virtual Needle Projection Line */}
              {needleState.depthMm > 0 && (
                <div
                  className={`absolute top-0 w-1 rounded-full transition-all shadow-lg ${
                    feedback.flashbackActive
                      ? 'bg-emerald-400 shadow-emerald-500/50'
                      : feedback.punctureStatus === 'CRITICAL_ARTERY_PUNCTURE'
                      ? 'bg-rose-500 shadow-rose-500/50'
                      : 'bg-amber-400 shadow-amber-500/50'
                  }`}
                  style={{
                    height: `${Math.min(180, needleState.depthMm * 4.5)}px`,
                    transform: `rotate(${needleState.azimuthDeg}deg)`,
                    transformOrigin: 'top center',
                  }}
                />
              )}

              {/* Needle Hub Flashback Capsule */}
              <div className="absolute top-3 right-4 flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                <Syringe className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Flashback:</span>
                <span
                  className={`font-bold font-mono ${
                    feedback.flashbackType === 'VENOUS_DARK_RED'
                      ? 'text-rose-400'
                      : feedback.flashbackType === 'ARTERIAL_PULSATILE_BRIGHT'
                      ? 'text-rose-500 animate-pulse'
                      : feedback.flashbackType === 'CLEAR_CSF'
                      ? 'text-sky-300'
                      : feedback.flashbackType === 'PERICARDIAL_SEROSANGUINOUS'
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {feedback.flashbackType.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* 6-DoF Needle & Probe Interactive Control Sliders */}
          <div className="bg-slate-900 border-t border-slate-800 p-5 space-y-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Crosshair className="w-4 h-4" />
                6-DoF Procedural Trajectory Kinematics
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setNeedleState(prev => ({
                      ...prev,
                      isAspirating: !prev.isAspirating,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    needleState.isAspirating
                      ? 'bg-rose-600 text-white shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Syringe className="w-3.5 h-3.5" />
                  {needleState.isAspirating ? 'Aspirating (Plunger Withdrawn)' : 'Aspirate Syringe'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Insertion Angle */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Pitch Angle:</span>
                  <span className="font-mono text-indigo-400 font-bold">{needleState.angleDeg}&deg;</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={70}
                  value={needleState.angleDeg}
                  onChange={e =>
                    setNeedleState(prev => ({ ...prev, angleDeg: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Azimuth / Directional Heading */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Azimuth Heading:</span>
                  <span className="font-mono text-indigo-400 font-bold">{needleState.azimuthDeg}&deg;</span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={needleState.azimuthDeg}
                  onChange={e =>
                    setNeedleState(prev => ({ ...prev, azimuthDeg: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Penetration Depth */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Penetration Depth:</span>
                  <span className="font-mono text-indigo-400 font-bold">{needleState.depthMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={needleState.depthMm}
                  onChange={e =>
                    setNeedleState(prev => ({ ...prev, depthMm: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Probe Compression */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Probe Compression:</span>
                  <span className="font-mono text-indigo-400 font-bold">{probeState.compressionMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={probeState.compressionMm}
                  onChange={e =>
                    setProbeState(prev => ({ ...prev, compressionMm: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* RIGHT PANEL: LIVE MULTIPLANAR ULTRASOUND & METRICS         */}
        {/* =========================================================== */}
        <div className="w-full lg:w-[460px] bg-slate-900 p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Ultrasound Viewport */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                Live B-Mode Ultrasound Monitor
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setProbeState(prev => ({
                      ...prev,
                      rotationDeg: prev.rotationDeg === 0 ? 90 : 0,
                    }))
                  }
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono"
                >
                  {probeState.rotationDeg === 0 ? 'Transverse' : 'Longitudinal'}
                </button>
                <button
                  onClick={() =>
                    setProbeState(prev => ({
                      ...prev,
                      colorDoppler: !prev.colorDoppler,
                    }))
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    probeState.colorDoppler ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Doppler {probeState.colorDoppler ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* 2D Ultrasound Screen */}
            <div className="w-full h-56 rounded-xl bg-black border border-slate-700 relative overflow-hidden flex items-center justify-center p-4">
              {/* Scan Sector Arc */}
              <div className="absolute inset-0 bg-radial from-slate-900/60 to-black opacity-90" />

              {/* Render Structures on 2D Screen */}
              {ultrasoundData.structures.map((st, idx) => {
                const isArtery = st.type === 'ARTERY';
                const isVein = st.type === 'VEIN';
                const isEffusion = st.type === 'EFFUSION';
                const isBone = st.type === 'BONE';

                return (
                  <div
                    key={idx}
                    className={`absolute rounded-full border transition-all ${
                      isArtery
                        ? probeState.colorDoppler
                          ? 'bg-rose-600/60 border-rose-400 animate-pulse'
                          : 'bg-black border-slate-300 animate-pulse'
                        : isVein
                        ? probeState.colorDoppler
                          ? 'bg-blue-600/60 border-blue-400'
                          : 'bg-black border-slate-400'
                        : isEffusion
                        ? 'bg-black border-cyan-500/60'
                        : isBone
                        ? 'bg-slate-200 border-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.9)]'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                    style={{
                      left: `${st.centerNorm.x * 100}%`,
                      top: `${st.centerNorm.y * 100}%`,
                      width: `${st.radiusXNorm * 220}px`,
                      height: `${st.radiusYNorm * 220}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span className="text-[9px] text-white/80 font-mono font-bold block text-center mt-1">
                      {st.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}

              {/* Needle Tip Reflection on Ultrasound */}
              {ultrasoundData.needleVisibleInPlane && ultrasoundData.needleTipCoordsNorm && (
                <div
                  className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping"
                  style={{
                    left: `${ultrasoundData.needleTipCoordsNorm.x * 100}%`,
                    top: `${ultrasoundData.needleTipCoordsNorm.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}

              {/* Depth Scale Grid on Left */}
              <div className="absolute left-2 top-2 bottom-2 w-4 flex flex-col justify-between text-[9px] font-mono text-slate-500">
                <span>0cm</span>
                <span>2cm</span>
                <span>4cm</span>
                <span>6cm</span>
              </div>
            </div>
          </div>

          {/* Tactile Resistance & Haptic Meter */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Tissue Puncture Resistance:
              </span>
              <span className="font-mono text-white font-bold">{feedback.resistanceForceN} N</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  feedback.hasResistanceDrop
                    ? 'bg-emerald-500'
                    : feedback.resistanceForceN > 4
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, (feedback.resistanceForceN / 8) * 100)}%` }}
              />
            </div>
            {feedback.hasResistanceDrop && (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Loss-of-Resistance Pop Detected! Lumen Accessed.
              </div>
            )}
          </div>

          {/* Hemodynamic Telemetry Response */}
          {(feedback.hemodynamicDelta.mapChangeMmHg !== 0 || feedback.hemodynamicDelta.cardiacOutputDeltaLMin !== 0) && (
            <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/30 text-xs space-y-1">
              <div className="font-bold text-indigo-300">Hemodynamic Decompression Delta:</div>
              <div className="flex justify-between text-slate-300">
                <span>MAP Delta:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{feedback.hemodynamicDelta.mapChangeMmHg} mmHg
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cardiac Output Delta:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{feedback.hemodynamicDelta.cardiacOutputDeltaLMin} L/min
                </span>
              </div>
            </div>
          )}

          {/* Real-time Status & Distance Badge */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Puncture Phase:</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-200">
                {feedback.punctureStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Distance to Target Center:</span>
              <span className="font-mono font-bold text-indigo-400">{feedback.targetDistanceMm} mm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Attempts Count:</span>
              <span className="font-mono text-slate-300">{attemptsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEBRIEF & COMPETENCY MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Procedural OSCE Competency Evaluation</h3>
              </div>
              <button onClick={() => setShowDebriefModal(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Overall Competency Score</div>
                <div className="text-3xl font-bold font-mono text-white mt-0.5">{competency.score} / 100</div>
              </div>
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-xl border ${
                  competency.grade === 'A+' || competency.grade === 'A'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : competency.grade === 'B'
                    ? 'bg-blue-950 border-blue-500 text-blue-400'
                    : 'bg-rose-950 border-rose-500 text-rose-400'
                }`}
              >
                Grade: {competency.grade}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Faculty Feedback:</div>
              <div className="space-y-1.5 text-xs text-slate-300">
                {competency.feedbackItems.map((fb, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleResetProcedure}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Retake Procedure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
