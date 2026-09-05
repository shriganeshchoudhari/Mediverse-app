'use client';

/**
 * CoronaryAngiographySimulator.tsx
 *
 * Interactive Diagnostic Cardiac Catheterization & Coronary Angiography Workstation.
 * Features:
 * - High-definition circular C-arm fluoroscopy screen with contrast cine injection simulation.
 * - Interactive C-arm gantry controls (LAO/RAO and Cranial/Caudal angulations).
 * - Standard coronary projections (Spider view, RAO Caudal, RAO Cranial, LAO Straight).
 * - Simultaneous Ao and LV pressure waveforms with live transvalvular gradient oscilloscope.
 * - Gorlin equation Aortic Valve Area (AVA) and Fick shunt fraction (Qp/Qs).
 * - Fractional Flow Reserve (FFR) wire sensor with IV Adenosine hyperemia testing.
 * - Socratic AI context bridge (`mediverse:open-ai-with-context`).
 *
 * Location: frontend/components/simulators/CoronaryAngiographySimulator.tsx
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Heart,
  Radio,
  Eye,
  Crosshair,
  Gauge
} from 'lucide-react';
import {
  FluoroscopyProjection,
  PROJECTIONS,
  AngiographyPresetId,
  ANGIOGRAPHY_PRESETS,
  computeGorlinAVA,
  computeShuntFraction,
  evaluateFFR,
  synthesizeHemodynamicWaveform
} from '@/.gemini/skills/CoronaryAngiographyEngine';

export default function CoronaryAngiographySimulator() {
  // Preset and View State
  const [selectedPreset, setSelectedPreset] = useState<AngiographyPresetId>('normal-coronary-right-dominant');
  const [activeProjection, setActiveProjection] = useState<FluoroscopyProjection>('LAO_CRANIAL_SPIDER');
  const [laoRaoDeg, setLaoRaoDeg] = useState<number>(45);
  const [cranCaudDeg, setCranCaudDeg] = useState<number>(30);

  // Cine Contrast State
  const [isInjectingContrast, setIsInjectingContrast] = useState<boolean>(false);
  const [contrastFillPercent, setContrastFillPercent] = useState<number>(100);
  const [cineRunNumber, setCineRunNumber] = useState<number>(1);

  // FFR Hyperemia State
  const [adenosineActive, setAdenosineActive] = useState<boolean>(false);

  // Hemodynamic Loop State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycleTimeSec, setCycleTimeSec] = useState<number>(0);

  const presetInfo = ANGIOGRAPHY_PRESETS[selectedPreset];
  const projectionInfo = PROJECTIONS[activeProjection];

  // Animation Loop for Hemodynamics and Contrast Cine
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleFrame = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        setCycleTimeSec((prev) => (prev + delta) % 1.0);
      }

      animRef.current = requestAnimationFrame(handleFrame);
    };

    animRef.current = requestAnimationFrame(handleFrame);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Handle Preset Change
  const handlePresetSelect = (id: AngiographyPresetId) => {
    setSelectedPreset(id);
    const info = ANGIOGRAPHY_PRESETS[id];
    setActiveProjection(info.recommendedView);
    const proj = PROJECTIONS[info.recommendedView];
    setLaoRaoDeg(proj.laoRaoAngleDeg);
    setCranCaudDeg(proj.cranialCaudalAngleDeg);
    setAdenosineActive(false);
    setContrastFillPercent(100);
  };

  // Handle Projection Quick Select
  const handleProjectionChange = (projId: FluoroscopyProjection) => {
    setActiveProjection(projId);
    const proj = PROJECTIONS[projId];
    setLaoRaoDeg(proj.laoRaoAngleDeg);
    setCranCaudDeg(proj.cranialCaudalAngleDeg);
  };

  // Trigger Cine Contrast Injection
  const handleInjectContrast = () => {
    setIsInjectingContrast(true);
    setContrastFillPercent(0);
    setCineRunNumber((prev) => prev + 1);

    // Animate contrast wash-in and wash-out
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setContrastFillPercent(Math.min(100, progress));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsInjectingContrast(false), 800);
      }
    }, 80);
  };

  // Computed Real-time Hemodynamics
  const instantWaveform = useMemo(() => {
    return synthesizeHemodynamicWaveform(cycleTimeSec, selectedPreset);
  }, [cycleTimeSec, selectedPreset]);

  // Computed Gorlin AVA
  const gorlinResult = useMemo(() => {
    return computeGorlinAVA(
      presetInfo.hemodynamics.cardiacOutputLMin,
      presetInfo.hemodynamics.heartRateBpm,
      presetInfo.hemodynamics.systolicEjectionPeriodSec,
      presetInfo.hemodynamics.meanGradientMmHg
    );
  }, [presetInfo]);

  // Primary Culprit or Selected Lesion
  const activeLesion = useMemo(() => {
    return presetInfo.lesions.find((l) => l.stenosisPercent > 50) || presetInfo.lesions[0];
  }, [presetInfo]);

  // FFR evaluation based on adenosine hyperemia
  const ffrResult = useMemo(() => {
    const baseFfr = activeLesion.ffr;
    // Without adenosine, baseline resting Pd/Pa is slightly higher (~0.05-0.08 higher)
    const effectiveFfr = adenosineActive ? baseFfr : Math.min(0.99, baseFfr + 0.08);
    const aorticPa = presetInfo.hemodynamics.aorticMeanMmHg;
    const distalPd = Math.round(aorticPa * effectiveFfr);
    return evaluateFFR(distalPd, aorticPa);
  }, [activeLesion, adenosineActive, presetInfo]);

  // Socratic AI Integration
  const handleAskAI = () => {
    const context = `
Diagnostic Cardiac Catheterization & Coronary Angiography Case:
- Case Title: ${presetInfo.title} (${presetInfo.category})
- Pathophysiology: ${presetInfo.pathophysiology}
- Coronary Dominance: ${presetInfo.dominance}
- Active Fluoroscopy C-Arm Angle: ${projectionInfo.name} (LAO/RAO: ${laoRaoDeg}°, Cran/Caud: ${cranCaudDeg}°)
- Primary Vessels in View: ${projectionInfo.primaryVesselsShown.join(', ')}
- Culprit / Notable Lesions:
${presetInfo.lesions
  .map(
    (l) =>
      `  * ${l.label}: ${l.stenosisPercent}% stenosis, Calcification: ${l.calcification}, TIMI Flow: ${l.timiFlow}, FFR: ${l.ffr}`
  )
  .join('\n')}
- Invasive Hemodynamics:
  * Aortic Pressure: ${presetInfo.hemodynamics.aorticSystolicMmHg}/${presetInfo.hemodynamics.aorticDiastolicMmHg} (Mean: ${presetInfo.hemodynamics.aorticMeanMmHg} mmHg)
  * Left Ventricular Pressure: ${presetInfo.hemodynamics.lvSystolicMmHg} mmHg, LVEDP: ${presetInfo.hemodynamics.lvedpMmHg} mmHg
  * Peak-to-Peak Transvalvular Gradient: ${presetInfo.hemodynamics.peakToPeakGradientMmHg} mmHg
  * Gorlin Aortic Valve Area (AVA): ${gorlinResult.avaCm2} cm² (${gorlinResult.severity} Aortic Stenosis)
  * Shunt Fraction (Qp/Qs): ${presetInfo.hemodynamics.shuntQpQs}
- Physiologic Assessment (FFR / iFR):
  * FFR: ${ffrResult.ffr} (${ffrResult.isIschemic ? 'SIGNIFICANT ISCHEMIA' : 'NON-ISCHEMIC'})
  * Hyperemia: ${adenosineActive ? 'MAXIMAL ADENOSINE ACTIVE' : 'RESTING BASELINE'}
- Revascularization & Management Plan: ${presetInfo.revascularizationStrategy}
`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context }
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shadow-inner">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Diagnostic Cardiac Catheterization &amp; Coronary Angiography
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/50">
                SCAI / ACC / AHA Standard
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              C-Arm fluoroscopic projection geometry, 18-segment coronary tree, Gorlin equation, FFR physiology, and TIMI flow dynamics.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleInjectContrast}
            disabled={isInjectingContrast}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border shadow-lg transition ${
              isInjectingContrast
                ? 'bg-amber-500/30 text-amber-200 border-amber-500 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
            }`}
          >
            <Zap className="w-4 h-4" />
            {isInjectingContrast ? 'Injecting Contrast (Cine Active)...' : 'Inject Contrast (Pedal)'}
          </button>

          <button
            onClick={() => setAdenosineActive(!adenosineActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              adenosineActive
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <Gauge className="w-4 h-4 text-purple-400" />
            {adenosineActive ? 'Adenosine Hyperemia: ON' : 'IV Adenosine Hyperemia'}
          </button>

          <button
            onClick={handleAskAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Ask Socratic AI
          </button>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {(Object.keys(ANGIOGRAPHY_PRESETS) as AngiographyPresetId[]).map((id) => {
          const item = ANGIOGRAPHY_PRESETS[id];
          const isSelected = selectedPreset === id;
          return (
            <button
              key={id}
              onClick={() => handlePresetSelect(id)}
              className={`flex flex-col p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-red-950/70 border-red-500 shadow-md shadow-red-500/20 text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    item.category === 'Coronary CAD'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      : item.category === 'Structural / Valvular'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      : item.category === 'Congenital Shunt'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  }`}
                >
                  {item.category}
                </span>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
              </div>
              <span className="text-xs font-bold leading-tight line-clamp-2">{item.title.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* C-Arm Gantry & Projection Selector */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            C-Arm Projections:
          </span>
          {(Object.keys(PROJECTIONS) as FluoroscopyProjection[]).map((pId) => {
            const p = PROJECTIONS[pId];
            const isActive = activeProjection === pId;
            return (
              <button
                key={pId}
                onClick={() => handleProjectionChange(pId)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                  isActive
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {p.name.split('(')[0]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400">LAO/RAO:</span>
            <span className="text-cyan-300 font-bold">
              {laoRaoDeg > 0 ? `LAO ${laoRaoDeg}°` : laoRaoDeg < 0 ? `RAO ${Math.abs(laoRaoDeg)}°` : 'AP 0°'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400">Cran/Caud:</span>
            <span className="text-cyan-300 font-bold">
              {cranCaudDeg > 0 ? `Cran ${cranCaudDeg}°` : cranCaudDeg < 0 ? `Caud ${Math.abs(cranCaudDeg)}°` : 'Straight 0°'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Simulation Viewports: Fluoroscopy Screen + Hemodynamic Oscilloscope */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Fluoroscopy Cine Viewport (Col-span 7) */}
        <div className="xl:col-span-7 flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Fluoroscopy Status Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                FLUOROSCOPY C-ARM
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-semibold">{projectionInfo.name}</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400 font-mono">Cine Run #{cineRunNumber}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>75 kVp</span>
              <span>250 mA</span>
              <span>15 fps</span>
              <span className="text-emerald-400">TIMI {activeLesion.timiFlow} Flow</span>
            </div>
          </div>

          {/* Simulated Circular Image Intensifier Screen */}
          <div className="relative w-full h-[520px] bg-[#0b0f19] flex items-center justify-center overflow-hidden">
            {/* Subtle Vignette & Radiopaque Circle */}
            <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-br from-[#1e293b]/30 via-[#0f172a]/80 to-[#020617] border border-slate-700/60 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center">
              {/* Fluoroscopy SVG Anatomic & Angiographic Rendering */}
              <svg className="w-[430px] h-[430px]" viewBox="0 0 400 400">
                {/* Background anatomical landmarks: Spine and Rib Shadows */}
                <g opacity="0.12">
                  {/* Vertebral column on right */}
                  <rect x="310" y="40" width="45" height="320" rx="6" fill="#94a3b8" />
                  <line x1="310" y1="100" x2="355" y2="100" stroke="#000" strokeWidth="2" />
                  <line x1="310" y1="160" x2="355" y2="160" stroke="#000" strokeWidth="2" />
                  <line x1="310" y1="220" x2="355" y2="220" stroke="#000" strokeWidth="2" />
                  <line x1="310" y1="280" x2="355" y2="280" stroke="#000" strokeWidth="2" />
                  {/* Diaphragm dome */}
                  <path d="M 0 380 Q 200 320, 400 380" fill="none" stroke="#94a3b8" strokeWidth="18" />
                </g>

                {/* Diagnostic Guiding Catheter (Judkins JL4) engaged in ostium */}
                <path
                  d="M 60 50 Q 140 100, 160 140"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Metallic Catheter Tip Marker */}
                <circle cx="160" cy="140" r="5" fill="#f8fafc" />

                {/* Coronary Tree Drawing based on Left vs Right System */}
                {activeProjection === 'LAO_STRAIGHT' || activeProjection === 'RAO_STRAIGHT' ? (
                  /* Right Coronary Artery (RCA) C-Shape View */
                  <g>
                    {/* RCA Main Body */}
                    <path
                      d="M 160 140 C 230 150, 240 250, 170 300"
                      fill="none"
                      stroke={contrastFillPercent > 30 ? '#0f172a' : '#475569'}
                      strokeWidth={activeLesion.vessel === 'RCA_MID' && activeLesion.stenosisPercent > 80 ? '2' : '7'}
                      strokeLinecap="round"
                      opacity={contrastFillPercent > 10 ? 0.95 : 0.2}
                    />

                    {/* Acute Marginal Branch */}
                    <path
                      d="M 235 210 Q 280 230, 300 240"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={contrastFillPercent > 40 ? 0.9 : 0.2}
                    />

                    {/* Posterior Descending Artery (PDA) */}
                    <path
                      d="M 170 300 C 140 330, 110 350, 90 360"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity={contrastFillPercent > 60 ? 0.9 : 0.2}
                    />

                    {/* Posterolateral Branch (PLB) */}
                    <path
                      d="M 170 300 Q 200 320, 220 330"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity={contrastFillPercent > 70 ? 0.9 : 0.2}
                    />
                  </g>
                ) : (
                  /* Left Coronary Artery System (Spider / RAO Cranial / RAO Caudal) */
                  <g>
                    {/* Left Main Coronary Artery (LMCA) */}
                    <path
                      d="M 160 140 L 195 165"
                      fill="none"
                      stroke={contrastFillPercent > 15 ? '#020617' : '#475569'}
                      strokeWidth="8.5"
                      strokeLinecap="round"
                    />

                    {/* Left Anterior Descending (LAD) */}
                    {activeLesion.vessel === 'LAD_PROXIMAL' && activeLesion.timiFlow === 0 ? (
                      /* Total Occlusion (TIMI 0): Cutoff with Stump */
                      <g>
                        <path
                          d="M 195 165 L 210 185"
                          fill="none"
                          stroke="#020617"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        {/* Meniscus / Thrombus Occlusion Mark */}
                        <circle cx="210" cy="185" r="4" fill="#dc2626" />
                        <text x="220" y="190" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          99% TIMI 0 OCCLUSION
                        </text>
                      </g>
                    ) : (
                      /* Patent / Stenosed LAD Course */
                      <g>
                        <path
                          d="M 195 165 C 220 200, 240 270, 220 340"
                          fill="none"
                          stroke={contrastFillPercent > 30 ? '#020617' : '#475569'}
                          strokeWidth={activeLesion.vessel === 'LAD_PROXIMAL' && activeLesion.stenosisPercent > 70 ? '2.5' : '6'}
                          strokeLinecap="round"
                          opacity={contrastFillPercent > 20 ? 0.95 : 0.2}
                        />

                        {/* First Diagonal (D1) */}
                        <path
                          d="M 215 210 Q 275 230, 290 270"
                          fill="none"
                          stroke="#020617"
                          strokeWidth={activeLesion.vessel === 'D1' && activeLesion.stenosisPercent > 70 ? '2' : '4'}
                          strokeLinecap="round"
                          opacity={contrastFillPercent > 50 ? 0.9 : 0.2}
                        />

                        {/* Septal Perforators (S1, S2) */}
                        <line x1="210" y1="195" x2="185" y2="215" stroke="#020617" strokeWidth="2" opacity="0.8" />
                        <line x1="225" y1="230" x2="200" y2="250" stroke="#020617" strokeWidth="1.8" opacity="0.8" />
                      </g>
                    )}

                    {/* Left Circumflex (LCx) */}
                    <path
                      d="M 195 165 C 160 200, 130 250, 120 310"
                      fill="none"
                      stroke={contrastFillPercent > 25 ? '#020617' : '#475569'}
                      strokeWidth={activeLesion.vessel === 'LCX_MID' && activeLesion.stenosisPercent > 70 ? '2.2' : '6'}
                      strokeLinecap="round"
                      opacity={contrastFillPercent > 20 ? 0.95 : 0.2}
                    />

                    {/* Obtuse Marginal 1 (OM1) */}
                    <path
                      d="M 160 215 Q 110 235, 90 270"
                      fill="none"
                      stroke="#020617"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      opacity={contrastFillPercent > 45 ? 0.9 : 0.2}
                    />
                  </g>
                )}

                {/* 0.014" Pressure Wire & Sensor Marker */}
                <g>
                  <circle cx="215" cy="210" r="3" fill="#38bdf8" />
                  <text x="222" y="213" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                    FFR Wire Sensor (Pd)
                  </text>
                </g>
              </svg>
            </div>

            {/* Target Crosshair */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
              <Crosshair className="w-32 h-32 text-cyan-400" />
            </div>

            {/* Live Cine Run Overlay */}
            {isInjectingContrast && (
              <div className="absolute top-4 left-4 bg-red-600/90 text-white font-mono text-xs px-2.5 py-1 rounded flex items-center gap-1.5 shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                CINE RECORDING (RUN #{cineRunNumber})
              </div>
            )}
          </div>

          {/* Projection Indicator & Anatomic Guidance Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white">Anatomic Alignment:</span>{' '}
              {projectionInfo.clinicalIndication}
            </div>
            <div className="font-mono text-cyan-400 text-right shrink-0">
              Dominance: <span className="text-white font-bold">{presetInfo.dominance.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Invasive Hemodynamics & Physiology Console (Col-span 5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Real-time Hemodynamic Pressure Oscilloscope */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                Invasive Pressure Oscilloscope (LHC)
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Ao &amp; LV Simultaneous
              </span>
            </div>

            {/* Simulated Pressure Waveform SVG */}
            <div className="relative w-full h-36 bg-slate-950 rounded-lg border border-slate-800 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                {/* Horizontal Baseline Grids */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="#1e293b" strokeWidth="1" />

                {/* Left Ventricular Pressure Trace (Red) */}
                <path
                  d={`
                    M 0 110
                    C 30 110, 40 ${120 - (presetInfo.hemodynamics.lvSystolicMmHg / 200) * 110}, 60 ${120 - (presetInfo.hemodynamics.lvSystolicMmHg / 200) * 110}
                    C 80 ${120 - (presetInfo.hemodynamics.lvSystolicMmHg / 200) * 110}, 90 110, 100 110
                    L 150 110
                    C 180 110, 190 ${120 - (presetInfo.hemodynamics.lvSystolicMmHg / 200) * 110}, 210 ${120 - (presetInfo.hemodynamics.lvSystolicMmHg / 200) * 110}
                    C 230 ${120 - (presetInfo.hemodynamics.lvSystolicMmHg / 200) * 110}, 240 110, 250 110
                    L 300 110
                  `}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />

                {/* Aortic Pressure Trace (Amber) */}
                <path
                  d={`
                    M 0 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}
                    C 30 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}, 40 ${120 - (presetInfo.hemodynamics.aorticSystolicMmHg / 200) * 110}, 60 ${120 - (presetInfo.hemodynamics.aorticSystolicMmHg / 200) * 110}
                    C 80 ${120 - (presetInfo.hemodynamics.aorticSystolicMmHg / 200) * 110}, 110 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}, 150 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}
                    C 180 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}, 190 ${120 - (presetInfo.hemodynamics.aorticSystolicMmHg / 200) * 110}, 210 ${120 - (presetInfo.hemodynamics.aorticSystolicMmHg / 200) * 110}
                    C 230 ${120 - (presetInfo.hemodynamics.aorticSystolicMmHg / 200) * 110}, 260 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}, 300 ${120 - (presetInfo.hemodynamics.aorticDiastolicMmHg / 200) * 110}
                  `}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </svg>

              {/* Live Pressure Legend & Dynamic Gradient */}
              <div className="absolute top-2 right-2 flex flex-col items-end text-[10px] font-mono">
                <span className="text-red-400 font-bold">LV: {presetInfo.hemodynamics.lvSystolicMmHg} / {presetInfo.hemodynamics.lvedpMmHg} mmHg</span>
                <span className="text-amber-400 font-bold">Ao: {presetInfo.hemodynamics.aorticSystolicMmHg} / {presetInfo.hemodynamics.aorticDiastolicMmHg} mmHg</span>
              </div>
            </div>

            {/* Hemodynamic Calculations Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">Peak Gradient</span>
                <span className={`text-sm font-bold font-mono ${presetInfo.hemodynamics.peakToPeakGradientMmHg > 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {presetInfo.hemodynamics.peakToPeakGradientMmHg} mmHg
                </span>
                <span className="text-[9px] text-slate-500">Transvalvular</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">LVEDP</span>
                <span className={`text-sm font-bold font-mono ${presetInfo.hemodynamics.lvedpMmHg > 12 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {presetInfo.hemodynamics.lvedpMmHg} mmHg
                </span>
                <span className="text-[9px] text-slate-500">Normal 4-12</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">Gorlin AVA</span>
                <span className={`text-sm font-bold font-mono ${gorlinResult.severity === 'SEVERE' ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {gorlinResult.avaCm2} cm²
                </span>
                <span className="text-[9px] text-slate-500">{gorlinResult.severity} AS</span>
              </div>
            </div>

            {/* Shunt Fraction Row if Applicable */}
            {presetInfo.hemodynamics.shuntQpQs > 1.1 && (
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  Intracardiac Shunt (Qp/Qs):
                </span>
                <span className="font-mono font-bold text-cyan-200">
                  {presetInfo.hemodynamics.shuntQpQs} (Hemodynamically Significant L→R)
                </span>
              </div>
            )}
          </div>

          {/* Coronary Physiology: FFR / iFR & Lesion Staging */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Coronary Physiology (FFR / iFR)
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  ffrResult.isIschemic
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}
              >
                {ffrResult.isIschemic ? 'ISCHEMIC (FFR ≤ 0.80)' : 'NON-ISCHEMIC'}
              </span>
            </div>

            {/* FFR Measurement Visual Gauge */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Target Vessel: {activeLesion.label}</span>
                <span className="text-white font-bold">FFR: {ffrResult.ffr}</span>
              </div>
              <div className="relative w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                {/* Ischemic threshold marker at 0.80 (80%) */}
                <div className="absolute left-[80%] top-0 bottom-0 w-0.5 bg-yellow-400 z-10" />
                <div
                  className={`h-full transition-all duration-500 ${
                    ffrResult.isIschemic ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${ffrResult.ffr * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.00 (Total Block)</span>
                <span className="text-yellow-400 font-bold">0.80 Cutoff</span>
                <span>1.00 (Normal)</span>
              </div>
            </div>

            {/* Treatment Strategy Box */}
            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1 text-indigo-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Revascularization Strategy:
              </span>
              <p className="leading-relaxed text-[11px]">{presetInfo.revascularizationStrategy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
