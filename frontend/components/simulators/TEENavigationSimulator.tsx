'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Activity,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Maximize2,
  RotateCw,
  Gauge,
  Sliders,
  FileText,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import {
  ASE_SCA_TEE_VIEWS,
  TEE_PRESETS,
  TEEViewId,
  ProbeState,
  ProbeDepthZone,
  HemodynamicMeasurements,
  evaluateProbeAlignment,
  computeTEEHemodynamics,
  TEEPreset
} from '@/.gemini/skills/TEENavigationEngine';

export const TEENavigationSimulator: React.FC = () => {
  // 1. Active Preset & State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('normal-comprehensive-28');

  const activePreset = useMemo<TEEPreset>(() => {
    return TEE_PRESETS.find(p => p.id === selectedPresetId) || TEE_PRESETS[0];
  }, [selectedPresetId]);

  // 2. Probe Controls
  const [depthZone, setDepthZone] = useState<ProbeDepthZone>(activePreset.initialProbe.depthZone);
  const [depthCm, setDepthCm] = useState<number>(activePreset.initialProbe.depthCm);
  const [omniplaneAngleDeg, setOmniplaneAngleDeg] = useState<number>(activePreset.initialProbe.omniplaneAngleDeg);
  const [probeRotationDeg, setProbeRotationDeg] = useState<number>(activePreset.initialProbe.probeRotationDeg);
  const [tipDeflectionDeg, setTipDeflectionDeg] = useState<number>(activePreset.initialProbe.tipDeflectionDeg);
  const [lateralDeflectionDeg, setLateralDeflectionDeg] = useState<number>(activePreset.initialProbe.lateralDeflectionDeg);

  // 3. Hemodynamics & Doppler Measurements
  const [measurements, setMeasurements] = useState<HemodynamicMeasurements>(activePreset.measurements);
  const [activeTab, setActiveTab] = useState<'doppler' | 'valvular' | 'diastology'>('doppler');

  // Handle Preset Switching
  const applyPreset = (preset: TEEPreset) => {
    setSelectedPresetId(preset.id);
    setDepthZone(preset.initialProbe.depthZone);
    setDepthCm(preset.initialProbe.depthCm);
    setOmniplaneAngleDeg(preset.initialProbe.omniplaneAngleDeg);
    setProbeRotationDeg(preset.initialProbe.probeRotationDeg);
    setTipDeflectionDeg(preset.initialProbe.tipDeflectionDeg);
    setLateralDeflectionDeg(preset.initialProbe.lateralDeflectionDeg);
    setMeasurements(preset.measurements);
  };

  // Build current probe state
  const currentProbe: ProbeState = useMemo(() => ({
    depthZone,
    depthCm,
    omniplaneAngleDeg,
    probeRotationDeg,
    tipDeflectionDeg,
    lateralDeflectionDeg
  }), [depthZone, depthCm, omniplaneAngleDeg, probeRotationDeg, tipDeflectionDeg, lateralDeflectionDeg]);

  // Evaluate Live Alignment
  const alignmentResult = useMemo(() => {
    return evaluateProbeAlignment(currentProbe);
  }, [currentProbe]);

  // Compute Hemodynamics
  const hemodynamics = useMemo(() => {
    return computeTEEHemodynamics(measurements);
  }, [measurements]);

  // Auto-Align Helper: Snaps probe to any selected standard view
  const snapToStandardView = (viewId: TEEViewId) => {
    const target = ASE_SCA_TEE_VIEWS[viewId];
    if (!target) return;
    setDepthZone(target.depthZone);
    setDepthCm(target.idealDepthCm);
    setOmniplaneAngleDeg(target.idealOmniplaneAngleDeg);
    setProbeRotationDeg(target.idealProbeRotationDeg);
    setTipDeflectionDeg(target.idealTipDeflectionDeg);
    setLateralDeflectionDeg(0);
  };

  // Depth Zone Presets
  const handleDepthZoneSelect = (zone: ProbeDepthZone) => {
    setDepthZone(zone);
    switch (zone) {
      case 'UPPER_ESOPHAGEAL':
        setDepthCm(24);
        break;
      case 'MID_ESOPHAGEAL':
        setDepthCm(32);
        break;
      case 'TRANSGASTRIC':
        setDepthCm(42);
        break;
      case 'DEEP_TRANSGASTRIC':
        setDepthCm(47);
        break;
      case 'DESCENDING_AORTA':
        setDepthCm(32);
        setProbeRotationDeg(-80);
        break;
    }
  };

  // Socratic AI Context Dispatch
  const handleAskAI = () => {
    const context = `
Transesophageal Echocardiography (TEE) Case Interrogation:
- Clinical Case / Preset: ${activePreset.name} (${activePreset.category})
- Description: ${activePreset.description}
- Probe Status:
  * Depth Zone: ${depthZone} (${depthCm} cm)
  * Omniplane Multiplane Angle: ${omniplaneAngleDeg}°
  * Shaft Rotation: ${probeRotationDeg}°
  * Tip Deflection: ${tipDeflectionDeg}°
- Acoustic View Identified: ${alignmentResult.currentViewName} (Alignment Score: ${alignmentResult.alignmentScorePct}%, View Locked: ${alignmentResult.isViewLocked})
- Visualized Structures: ${alignmentResult.activeViewDefinition?.structuresVisualized.join(', ') || 'Intermediate plane'}
- Hemodynamic Findings:
  * LV Ejection Fraction: ${hemodynamics.ejectionFractionPct}% (LVEDV ${measurements.lvEndDiastolicVolumeMl}ml, LVESV ${measurements.lvEndSystolicVolumeMl}ml, CO ${hemodynamics.cardiacOutputLpm} L/min)
  * Aortic Stenosis: AVA ${hemodynamics.aorticValveAreaCm2} cm², Vmax ${measurements.avPeakVelocityMs} m/s, Mean Gradient ${hemodynamics.estimatedMeanGradientMmHg} mmHg, DVI ${hemodynamics.dimensionlessVelocityIndex} (Severity: ${hemodynamics.asSeverity})
  * Diastolic Filling: E/A ${hemodynamics.eOverARatio}, Deceleration Time ${measurements.decelerationTimeMs} ms, E/e' ${hemodynamics.eOverEPrimeRatio} (Grade: ${hemodynamics.diastolicDysfunctionGrade})
  * RV & Pulmonary: RVSP ${hemodynamics.rvspMmHg} mmHg (TR Vmax ${measurements.trPeakVelocityMs} m/s + RAP ${measurements.estimatedRapMmHg} mmHg, Severity: ${hemodynamics.phSeverity}), RV FAC ${hemodynamics.rvFacPct}%
  * Specific Alerts: ${hemodynamics.clinicalSummary.join(' | ')}
    `.trim();

    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', { detail: { context } }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-cyan-950 border border-cyan-700/50 rounded-xl text-cyan-400">
                <Compass className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Transesophageal Echocardiography (TEE) Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono">
                    ASE / SCA 28-View Standard
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Multiplane electronic crystal rotation, probe kinematics, and real-time hemodynamic Doppler solving.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAskAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/30 transition border border-cyan-400/30"
            >
              <Sparkles className="w-4 h-4" />
              Ask Socratic AI
            </button>
          </div>
        </div>

        {/* Pathology Presets Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 block">
            Clinical Pathology Presets & Cases:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {TEE_PRESETS.map((p) => {
              const isSelected = p.id === selectedPresetId;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-2 rounded-xl text-xs text-left transition flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md shadow-cyan-950/50'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="font-semibold line-clamp-1">{p.name}</span>
                  <span className={`text-[10px] mt-1 font-mono ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {p.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Probe Manipulation (Left) + Sector Viewport (Center) + Doppler Solver (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Probe Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Probe Shaft & Omniplane
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {depthZone.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Depth Zone Quick Buttons */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 flex items-center justify-between">
                <span>Esophageal / Gastric Zone</span>
                <span className="font-mono text-cyan-400 text-xs">{depthCm} cm</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['UPPER_ESOPHAGEAL', 'MID_ESOPHAGEAL', 'TRANSGASTRIC', 'DEEP_TRANSGASTRIC', 'DESCENDING_AORTA'] as ProbeDepthZone[]).map((zone) => (
                  <button
                    key={zone}
                    onClick={() => handleDepthZoneSelect(zone)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition text-center border ${
                      depthZone === zone
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {zone.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={20}
                max={50}
                step={1}
                value={depthCm}
                onChange={(e) => setDepthCm(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer mt-1"
              />
            </div>

            {/* Omniplane Multiplane Crystal Rotation (0° to 180°) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  Omniplane Crystal Angle
                </label>
                <span className="text-base font-bold font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {omniplaneAngleDeg}°
                </span>
              </div>

              {/* Quick Angle Presets */}
              <div className="flex items-center gap-1.5">
                {[0, 45, 60, 90, 100, 130, 180].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setOmniplaneAngleDeg(deg)}
                    className={`flex-1 py-1 rounded text-[11px] font-mono transition border ${
                      omniplaneAngleDeg === deg
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300'
                        : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>

              <input
                type="range"
                min={0}
                max={180}
                step={1}
                value={omniplaneAngleDeg}
                onChange={(e) => setOmniplaneAngleDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Shaft Rotation (CW / CCW) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400">
                  Shaft Rotation (Left/CCW ↔ Right/CW)
                </label>
                <span className="font-mono text-xs text-cyan-400">
                  {probeRotationDeg > 0 ? `+${probeRotationDeg}° CW` : probeRotationDeg < 0 ? `${probeRotationDeg}° CCW` : '0° Neutral'}
                </span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                step={5}
                value={probeRotationDeg}
                onChange={(e) => setProbeRotationDeg(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-90° (Posterior/Left)</span>
                <span>0° (Anterior)</span>
                <span>+90° (Right)</span>
              </div>
            </div>

            {/* Tip Anteflexion / Retroflexion */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400">
                  Tip Pitch (Retroflexion ↔ Anteflexion)
                </label>
                <span className="font-mono text-xs text-cyan-400">
                  {tipDeflectionDeg > 0 ? `+${tipDeflectionDeg}° Anteflex` : tipDeflectionDeg < 0 ? `${tipDeflectionDeg}° Retroflex` : '0° Neutral'}
                </span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                step={2}
                value={tipDeflectionDeg}
                onChange={(e) => setTipDeflectionDeg(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Navigation Coaching Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Acoustic Alignment Guidance
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                alignmentResult.isViewLocked
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/50'
              }`}>
                {alignmentResult.alignmentScorePct}% Match
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
              {alignmentResult.coachingGuidance.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            {/* Quick Snap View Selector */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Snap to ASE Standard View:
              </label>
              <select
                value={alignmentResult.currentViewId || ''}
                onChange={(e) => snapToStandardView(e.target.value as TEEViewId)}
                className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="" disabled>Select Target View...</option>
                {Object.values(ASE_SCA_TEE_VIEWS).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.idealOmniplaneAngleDeg}°, {v.idealDepthCm}cm)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Center Column: Echocardiographic Sector Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Sector Screen Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  TEE B-Mode Real-Time Sector
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {alignmentResult.currentViewName}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono border ${
                  alignmentResult.isViewLocked
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-950'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}>
                  {alignmentResult.isViewLocked ? 'VIEW LOCKED' : 'SEARCHING'}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Depth: {depthCm}cm | Angle: {omniplaneAngleDeg}°
                </div>
              </div>
            </div>

            {/* Realistic SVG Ultrasound Sector Graphic */}
            <div className="relative w-full h-72 my-3 flex items-center justify-center">
              <svg viewBox="0 0 400 320" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <defs>
                  {/* Acoustic Sector Gradient */}
                  <radialGradient id="sectorGlow" cx="50%" cy="0%" r="90%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#0e7490" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
                  </radialGradient>

                  {/* Doppler Color Jet Gradient */}
                  <linearGradient id="regurgJet" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#eab308" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* 90-Degree Phased Array Sector Cone */}
                <path
                  d="M 200 15 L 60 300 A 285 285 0 0 0 340 300 Z"
                  fill="url(#sectorGlow)"
                  stroke="#164e63"
                  strokeWidth="1.5"
                />

                {/* Depth Range Arc Grids */}
                {[80, 140, 200, 260].map((radius, i) => (
                  <path
                    key={i}
                    d={`M ${200 - radius * 0.7} ${15 + radius * 0.7} A ${radius} ${radius} 0 0 0 ${200 + radius * 0.7} ${15 + radius * 0.7}`}
                    fill="none"
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                ))}

                {/* Orientation Dot Marker */}
                <circle cx="330" cy="40" r="4" fill="#06b6d4" />
                <text x="330" y="55" fill="#06b6d4" fontSize="9" fontFamily="monospace" textAnchor="middle">R</text>

                {/* Dynamic Anatomic Visuals Based on Locked View */}
                {alignmentResult.currentViewId === 'ME_4_CHAMBER' && (
                  <g>
                    {/* Left Atrium & Right Atrium */}
                    <ellipse cx="170" cy="110" rx="35" ry="25" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                    <text x="170" y="113" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">LA</text>
                    <ellipse cx="230" cy="110" rx="30" ry="24" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                    <text x="230" y="113" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">RA</text>

                    {/* Mitral & Tricuspid Valves */}
                    <line x1="145" y1="135" x2="195" y2="135" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="210" y1="135" x2="250" y2="135" stroke="#f8fafc" strokeWidth="2.5" />

                    {/* Left Ventricle & Right Ventricle */}
                    <path d="M 145 140 C 140 210, 170 260, 185 270 C 195 260, 205 210, 200 140 Z" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                    <text x="175" y="210" fill="#bae6fd" fontSize="11" textAnchor="middle" fontWeight="bold">LV</text>
                    <path d="M 205 140 C 215 190, 240 230, 245 240 C 255 220, 255 180, 250 140 Z" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                    <text x="235" y="195" fill="#bae6fd" fontSize="11" textAnchor="middle" fontWeight="bold">RV</text>
                  </g>
                )}

                {alignmentResult.currentViewId === 'TG_MID_SAX' && (
                  <g>
                    {/* Classic Doughnut LV Short Axis */}
                    <circle cx="200" cy="165" r="70" fill="#020617" stroke="#0ea5e9" strokeWidth="6" />
                    <circle cx="200" cy="165" r="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Papillary Muscles (Anterolateral & Posteromedial) */}
                    <circle cx="170" cy="175" r="9" fill="#e2e8f0" />
                    <circle cx="230" cy="175" r="9" fill="#e2e8f0" />

                    <text x="200" y="155" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">LV Cavity</text>
                    <text x="170" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle">AL Pap</text>
                    <text x="230" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle">PM Pap</text>

                    {/* RV Crescent */}
                    <path d="M 265 125 C 290 155, 290 185, 265 215" fill="none" stroke="#0284c7" strokeWidth="4" />
                    <text x="282" y="170" fill="#7dd3fc" fontSize="9">RV</text>
                  </g>
                )}

                {alignmentResult.currentViewId === 'DEEP_TG_LAX' && (
                  <g>
                    {/* LVOT and Aortic Valve Co-Linear Beam */}
                    <path d="M 180 60 L 160 210 C 160 260, 240 260, 240 210 L 220 60 Z" fill="#020617" stroke="#0284c7" strokeWidth="2.5" />
                    {/* Aortic Valve Line */}
                    <line x1="185" y1="85" x2="215" y2="85" stroke="#facc15" strokeWidth="3" />
                    {/* Insonation Cursor (0 degrees co-linear) */}
                    <line x1="200" y1="30" x2="200" y2="250" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="200" y="55" fill="#facc15" fontSize="9" textAnchor="middle" fontWeight="bold">AV Orifice</text>
                    <text x="200" y="140" fill="#38bdf8" fontSize="10" textAnchor="middle">LVOT</text>
                    <text x="200" y="235" fill="#bae6fd" fontSize="10" textAnchor="middle">Apex</text>
                  </g>
                )}

                {alignmentResult.currentViewId === 'ME_AV_SAX' && (
                  <g>
                    {/* Mercedes-Benz sign of Aortic Valve */}
                    <circle cx="200" cy="160" r="40" fill="#020617" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="200" y1="160" x2="200" y2="120" stroke="#facc15" strokeWidth="2.5" />
                    <line x1="200" y1="160" x2="165" y2="180" stroke="#facc15" strokeWidth="2.5" />
                    <line x1="200" y1="160" x2="235" y2="180" stroke="#facc15" strokeWidth="2.5" />
                    <text x="200" y="140" fill="#fef08a" fontSize="9" textAnchor="middle">NCC</text>
                    <text x="180" y="175" fill="#fef08a" fontSize="9" textAnchor="middle">RCC</text>
                    <text x="220" y="175" fill="#fef08a" fontSize="9" textAnchor="middle">LCC</text>
                  </g>
                )}

                {/* Flail Leaflet MR Jet overlay if Severe Flail */}
                {measurements.mitralRegurgitationSeverity === 'SEVERE_FLAIL' && (
                  <path
                    d="M 170 135 C 150 90, 160 80, 180 70 C 170 95, 175 120, 170 135 Z"
                    fill="url(#regurgJet)"
                  />
                )}

                {/* Intimal Dissection Flap Overlay */}
                {measurements.aorticDissectionPresent && (
                  <g>
                    <path
                      d="M 185 100 Q 210 160 190 220"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      strokeDasharray="6 2"
                    />
                    <text x="225" y="125" fill="#f43f5e" fontSize="9" fontWeight="bold">Intimal Flap</text>
                  </g>
                )}
              </svg>
            </div>

            {/* View Details Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="text-xs font-semibold text-cyan-300">
                Visualized Anatomic Structures:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(alignmentResult.activeViewDefinition?.structuresVisualized || [
                  'Manipulate depth and omniplane angle to acquire standard landmarks'
                ]).map((struct, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {struct}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                <span>Doppler Insonation:</span>
                <span className="text-slate-300 font-medium">
                  {alignmentResult.activeViewDefinition?.recommendedDopplerBeamAlignment || 'Adjust alignment for optimal insonation'}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Case Summary Callout */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Board Review & Clinical Highlights
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activePreset.teachingPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Hemodynamic Doppler Calculations (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Mode Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('doppler')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'doppler'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Doppler
            </button>
            <button
              onClick={() => setActiveTab('valvular')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'valvular'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AS Solver
            </button>
            <button
              onClick={() => setActiveTab('diastology')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'diastology'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diastology
            </button>
          </div>

          {/* Tab 1: Doppler Measurements */}
          {activeTab === 'doppler' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Live Doppler Interrogation
              </h3>

              {/* AV Peak Velocity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">AV Peak Velocity (Vmax)</span>
                  <span className="font-mono text-cyan-400 font-bold">{measurements.avPeakVelocityMs} m/s</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={5.5}
                  step={0.1}
                  value={measurements.avPeakVelocityMs}
                  onChange={(e) => setMeasurements({ ...measurements, avPeakVelocityMs: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* LVOT Velocity Time Integral */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">LVOT VTI</span>
                  <span className="font-mono text-cyan-400 font-bold">{measurements.lvotVtiCm} cm</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={30}
                  step={1}
                  value={measurements.lvotVtiCm}
                  onChange={(e) => setMeasurements({ ...measurements, lvotVtiCm: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* AV VTI */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Aortic Valve VTI</span>
                  <span className="font-mono text-cyan-400 font-bold">{measurements.avVtiCm} cm</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={90}
                  step={1}
                  value={measurements.avVtiCm}
                  onChange={(e) => setMeasurements({ ...measurements, avVtiCm: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* TR Peak Velocity for RVSP */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">TR Peak Jet Velocity</span>
                  <span className="font-mono text-cyan-400 font-bold">{measurements.trPeakVelocityMs} m/s</span>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={4.8}
                  step={0.1}
                  value={measurements.trPeakVelocityMs}
                  onChange={(e) => setMeasurements({ ...measurements, trPeakVelocityMs: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Aortic Stenosis Continuity Solver */}
          {activeTab === 'valvular' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Continuity Equation Solver
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                  hemodynamics.asSeverity === 'SEVERE'
                    ? 'bg-rose-950 text-rose-300 border border-rose-600'
                    : hemodynamics.asSeverity === 'MODERATE'
                    ? 'bg-amber-950 text-amber-300 border border-amber-600'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                }`}>
                  {hemodynamics.asSeverity} AS
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">LVOT Diameter:</span>
                  <span className="text-white">{measurements.lvotDiameterCm} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">LVOT Area:</span>
                  <span className="text-white">{hemodynamics.lvotCrossSectionalAreaCm2} cm²</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-cyan-300">Aortic Valve Area (AVA):</span>
                  <span className="text-cyan-400">{hemodynamics.aorticValveAreaCm2} cm²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak Gradient:</span>
                  <span className="text-white">{hemodynamics.simplifiedBernoulliPeakGradientMmHg} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Mean Grad:</span>
                  <span className="text-white">{hemodynamics.estimatedMeanGradientMmHg} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DVI (LVOT/AV VTI):</span>
                  <span className="text-white">{hemodynamics.dimensionlessVelocityIndex}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Severe AS criteria: AVA &lt; 1.0 cm², Vmax &ge; 4.0 m/s, Mean Gradient &ge; 40 mmHg, DVI &lt; 0.25.
              </p>
            </div>
          )}

          {/* Tab 3: Diastology & RV Pressures */}
          {activeTab === 'diastology' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Diastolic & Chamber Pressures
                </h3>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {hemodynamics.diastolicDysfunctionGrade.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">E / A Ratio:</span>
                  <span className="text-white font-bold">{hemodynamics.eOverARatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Decel Time (DT):</span>
                  <span className="text-white">{measurements.decelerationTimeMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">E / e' Ratio (LAP index):</span>
                  <span className="text-white font-bold">{hemodynamics.eOverEPrimeRatio}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-cyan-300">RVSP (4*V² + RAP):</span>
                  <span className="text-cyan-400">{hemodynamics.rvspMmHg} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RV Fractional Area Change:</span>
                  <span className="text-white">{hemodynamics.rvFacPct}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Core Hemodynamic Vitals HUD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Global Systolic Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Biplane LVEF</div>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {hemodynamics.ejectionFractionPct}%
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Cardiac Output</div>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {hemodynamics.cardiacOutputLpm} L/m
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Alerts Banner */}
          <div className="space-y-2">
            {hemodynamics.clinicalSummary.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 bg-slate-900/90 border border-cyan-800/40 rounded-xl text-xs text-slate-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
