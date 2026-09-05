'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Wind,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Sliders,
  CheckCircle2,
  Activity,
  Layers,
  Radio,
  Eye,
  Scissors,
  Droplets,
  Info,
  RotateCw
} from 'lucide-react';
import {
  AirwayLandmarkId,
  BronchoscopeTool,
  BronchoscopeState,
  BALState,
  HemoptysisState,
  AIRWAY_LANDMARKS,
  EBUS_STATIONS,
  evaluateBronchoscopePosition,
  BRONCHOSCOPY_PRESETS,
  BronchoscopyPreset
} from '@/.gemini/skills/BronchoscopyEngine';

export const BronchoscopySimulator: React.FC = () => {
  // 1. Preset & State Management
  const [selectedPresetId, setSelectedPresetId] = useState<string>('normal-18-segment-inspection');

  const activePreset = useMemo<BronchoscopyPreset>(() => {
    return BRONCHOSCOPY_PRESETS.find(p => p.id === selectedPresetId) || BRONCHOSCOPY_PRESETS[0];
  }, [selectedPresetId]);

  // Scope State
  const [depthCm, setDepthCm] = useState<number>(activePreset.initialScope.depthCm);
  const [tipDeflectionDeg, setTipDeflectionDeg] = useState<number>(activePreset.initialScope.tipDeflectionDeg);
  const [shaftRotationDeg, setShaftRotationDeg] = useState<number>(activePreset.initialScope.shaftRotationDeg);
  const [activeTool, setActiveTool] = useState<BronchoscopeTool>(activePreset.initialScope.activeTool);
  const [suctionActive, setSuctionActive] = useState<boolean>(activePreset.initialScope.suctionActive);
  const [lightIntensityPct, setLightIntensityPct] = useState<number>(activePreset.initialScope.lightIntensityPct);
  const [ebusModeActive, setEbusModeActive] = useState<boolean>(activePreset.initialScope.ebusModeActive);
  const [ebusBalloonSalineMl, setEbusBalloonSalineMl] = useState<number>(activePreset.initialScope.ebusBalloonSalineMl);
  const [colorDopplerActive, setColorDopplerActive] = useState<boolean>(activePreset.initialScope.colorDopplerActive);

  // Procedure-specific states
  const [balState, setBalState] = useState<BALState | undefined>(activePreset.balState);
  const [hemoptysisState, setHemoptysisState] = useState<HemoptysisState | undefined>(activePreset.hemoptysisState);
  const [roseCytologyReport, setRoseCytologyReport] = useState<string | null>(null);

  // Apply Preset
  const applyPreset = (preset: BronchoscopyPreset) => {
    setSelectedPresetId(preset.id);
    setDepthCm(preset.initialScope.depthCm);
    setTipDeflectionDeg(preset.initialScope.tipDeflectionDeg);
    setShaftRotationDeg(preset.initialScope.shaftRotationDeg);
    setActiveTool(preset.initialScope.activeTool);
    setSuctionActive(preset.initialScope.suctionActive);
    setLightIntensityPct(preset.initialScope.lightIntensityPct);
    setEbusModeActive(preset.initialScope.ebusModeActive);
    setEbusBalloonSalineMl(preset.initialScope.ebusBalloonSalineMl);
    setColorDopplerActive(preset.initialScope.colorDopplerActive);
    setBalState(preset.balState);
    setHemoptysisState(preset.hemoptysisState);
    setRoseCytologyReport(null);
  };

  // Build current scope state
  const currentScope: BronchoscopeState = useMemo(() => ({
    depthCm,
    tipDeflectionDeg,
    shaftRotationDeg,
    activeTool,
    suctionActive,
    lightIntensityPct,
    ebusModeActive,
    ebusBalloonSalineMl,
    colorDopplerActive
  }), [depthCm, tipDeflectionDeg, shaftRotationDeg, activeTool, suctionActive, lightIntensityPct, ebusModeActive, ebusBalloonSalineMl, colorDopplerActive]);

  // Evaluate Navigation Position
  const navResult = useMemo(() => {
    return evaluateBronchoscopePosition(currentScope);
  }, [currentScope]);

  // Quick Snap to Target Landmark
  const snapToLandmark = (landmarkId: AirwayLandmarkId) => {
    const target = AIRWAY_LANDMARKS[landmarkId];
    if (!target) return;
    setDepthCm(target.idealDepthCm);
    setTipDeflectionDeg(target.idealTipDeflectionDeg);
    setShaftRotationDeg(target.idealShaftRotationDeg);
  };

  // Procedure: EBUS-TBNA Needle Puncture
  const handlePerformTbnaPuncture = () => {
    if (selectedPresetId === 'ebus-subcarinal-nsclc-staging') {
      setRoseCytologyReport(
        'ROSE RESULT (Station 7 Subcarinal): POSITIVE FOR MALIGNANCY. Cohesive clusters of atypical glandular cells with prominent nucleoli, nuclear pleomorphism, and mucin vacuolization. Consistent with metastatic adenocarcinoma (N2 disease confirmed).'
      );
    } else {
      setRoseCytologyReport(
        'ROSE RESULT: ADEQUATE BENIGN LYMPHOCYTES. Plentiful small mature lymphocytes with anthracotic pigment-laden histiocytes. No malignant cells identified.'
      );
    }
  };

  // Procedure: Instill Cold Saline for Hemoptysis
  const handleInstillColdSaline = () => {
    if (!hemoptysisState) return;
    const newIced = hemoptysisState.icedSalineInstilledMl + 50;
    const isControlled = newIced >= 150 || hemoptysisState.balloonOcclusionInflated;
    setHemoptysisState({
      ...hemoptysisState,
      icedSalineInstilledMl: newIced,
      bleedingControlled: isControlled,
      bleedingSeverity: isControlled ? 'MILD_OOZE' : hemoptysisState.bleedingSeverity
    });
  };

  // Procedure: Epinephrine Instillation
  const handleInstillEpi = () => {
    if (!hemoptysisState) return;
    const newEpi = Number((hemoptysisState.epinephrineInstilledMg + 0.2).toFixed(1));
    const isControlled = newEpi >= 0.4 || hemoptysisState.balloonOcclusionInflated;
    setHemoptysisState({
      ...hemoptysisState,
      epinephrineInstilledMg: newEpi,
      bleedingControlled: isControlled,
      bleedingSeverity: isControlled ? 'MILD_OOZE' : hemoptysisState.bleedingSeverity
    });
  };

  // Procedure: Inflate Occlusion Balloon
  const handleToggleBalloon = () => {
    if (!hemoptysisState) return;
    const nextInflated = !hemoptysisState.balloonOcclusionInflated;
    setHemoptysisState({
      ...hemoptysisState,
      balloonOcclusionInflated: nextInflated,
      bleedingControlled: nextInflated,
      bleedingSeverity: nextInflated ? 'NONE' : 'MASSIVE_EXSANGUINATING'
    });
  };

  // Socratic AI Dispatch
  const handleAskAI = () => {
    const context = `
Flexible Bronchoscopy & Interventional Pulmonology Case Interrogation:
- Clinical Case / Preset: ${activePreset.name} (${activePreset.category})
- Clinical Scenario: ${activePreset.description}
- Bronchoscope Position:
  * Insertion Depth: ${depthCm} cm from incisors
  * Tip Articulation: ${tipDeflectionDeg}°
  * Shaft Torque: ${shaftRotationDeg}°
  * Active Tool in Channel: ${activeTool}
  * Suction: ${suctionActive ? 'ACTIVE' : 'OFF'}, Light: ${lightIntensityPct}%
- Anatomic Landmark Identified: ${navResult.landmarkName} (Score: ${navResult.alignmentScorePct}%, View Centered: ${navResult.isViewCentered})
- Visualized Anatomy: ${navResult.activeLandmark.anatomicCharacteristics}
- Associated EBUS Station: ${navResult.ebusTargetStation ? `${navResult.ebusTargetStation.name} (${navResult.ebusTargetStation.nStageClassification} nodal stage)` : 'None'}
- EBUS Ultrasound: ${ebusModeActive ? `ACTIVE (Balloon: ${ebusBalloonSalineMl} mL, Doppler: ${colorDopplerActive ? 'ON' : 'OFF'})` : 'OFF'}
- Interventions / Findings:
  * Cytology ROSE Report: ${roseCytologyReport || 'None performed yet'}
  * BAL Status: ${balState ? `Instilled ${balState.instilledSalineMl}mL, Recovered ${balState.recoveredSalineMl}mL, Lymphocytes ${balState.lymphocytePct}%, Neutrophils ${balState.neutrophilPct}%, CD4/CD8 ${balState.cd4ToCd8Ratio}` : 'N/A'}
  * Hemoptysis Status: ${hemoptysisState ? `Severity: ${hemoptysisState.bleedingSeverity}, Iced Saline: ${hemoptysisState.icedSalineInstilledMl}mL, Epi: ${hemoptysisState.epinephrineInstilledMg}mg, Balloon Inflated: ${hemoptysisState.balloonOcclusionInflated}, Bleeding Controlled: ${hemoptysisState.bleedingControlled}` : 'None'}
- High-Yield Pearls: ${activePreset.teachingPoints.join(' | ')}
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
                <Wind className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Flexible Bronchoscopy &amp; EBUS Staging Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono">
                    AABIP / CHEST / IASLC Standard
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  18-segment tracheobronchial navigation, mediastinal lymph node staging, transbronchial needle aspiration, and airway emergencies.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAskAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/30 transition border border-cyan-400/30"
            >
              <Sparkles className="w-4 h-4" />
              Ask Socratic AI
            </button>
          </div>
        </div>

        {/* Pathology Presets Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 block">
            Clinical Case Presets &amp; Interventional Scenarios:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {BRONCHOSCOPY_PRESETS.map((p) => {
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

      {/* Main Grid: Scope Articulation (Left) + Video Viewport (Center) + Interventions / ROSE (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Scope Articulation & Working Channel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Bronchoscope Kinematics
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {depthCm} cm from incisors
              </span>
            </div>

            {/* Insertion Depth Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Insertion Depth</span>
                <span className="font-mono text-cyan-400 font-bold">{depthCm} cm</span>
              </div>
              <input
                type="range"
                min={15}
                max={45}
                step={1}
                value={depthCm}
                onChange={(e) => setDepthCm(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15cm (Cords)</span>
                <span>25cm (Carina)</span>
                <span>35cm (Basal)</span>
              </div>
            </div>

            {/* Tip Articulation Lever (-130° down to +180° up) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  Tip Articulation (Down ↔ Up)
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {tipDeflectionDeg > 0 ? `+${tipDeflectionDeg}° Up` : tipDeflectionDeg < 0 ? `${tipDeflectionDeg}° Down` : '0° Neutral'}
                </span>
              </div>
              <input
                type="range"
                min={-130}
                max={180}
                step={5}
                value={tipDeflectionDeg}
                onChange={(e) => setTipDeflectionDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Shaft Torque (Left/CCW ↔ Right/CW) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Shaft Torque (Left ↔ Right)</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {shaftRotationDeg > 0 ? `+${shaftRotationDeg}° Right` : shaftRotationDeg < 0 ? `${shaftRotationDeg}° Left` : '0° Neutral'}
                </span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                step={5}
                value={shaftRotationDeg}
                onChange={(e) => setShaftRotationDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Working Channel Tool Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                Working Channel Tool:
              </label>
              <select
                value={activeTool}
                onChange={(e) => setActiveTool(e.target.value as BronchoscopeTool)}
                className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="NONE">None (Diagnostic Vision Only)</option>
                <option value="EBUS_TBNA_NEEDLE_22G">22G EBUS-TBNA Needle</option>
                <option value="BIOPSY_FORCEPS">Biopsy Forceps</option>
                <option value="CYTOLOGY_BRUSH">Cytology Brush</option>
                <option value="BAL_CATHETER">BAL Wedged Catheter</option>
                <option value="BALLOON_OCCLUSION_CATHETER">Balloon Tamponade Catheter</option>
                <option value="CRYOPROBE">Flexible Cryoprobe (Cryobiopsy/Extraction)</option>
              </select>
            </div>

            {/* EBUS Mode & Doppler Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">EBUS Ultrasound &amp; Doppler</span>
                <button
                  onClick={() => setEbusModeActive(!ebusModeActive)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition border ${
                    ebusModeActive
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {ebusModeActive ? 'EBUS: ON' : 'EBUS: OFF'}
                </button>
              </div>

              {ebusModeActive && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Color Power Doppler</span>
                    <button
                      onClick={() => setColorDopplerActive(!colorDopplerActive)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        colorDopplerActive ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {colorDopplerActive ? 'DOPPLER ON' : 'DOPPLER OFF'}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Balloon Saline Contact</span>
                      <span className="font-mono text-cyan-300">{ebusBalloonSalineMl} mL</span>
                    </div>
                    <input
                      type="range"
                      min={0.0}
                      max={0.6}
                      step={0.1}
                      value={ebusBalloonSalineMl}
                      onChange={(e) => setEbusBalloonSalineMl(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Suction & Light Toggles */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSuctionActive(!suctionActive)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  suctionActive
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {suctionActive ? 'Suction: ACTIVE' : 'Suction: OFF'}
              </button>
            </div>
          </div>

          {/* Navigation Coaching & Landmark Quick Snap */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Airway Guidance
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                navResult.isViewCentered
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/50'
              }`}>
                {navResult.alignmentScorePct}% Match
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1.5">
              {navResult.coachingGuidance.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Quick Snap to Segment:
              </label>
              <select
                value={navResult.currentLandmarkId}
                onChange={(e) => snapToLandmark(e.target.value as AirwayLandmarkId)}
                className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                {Object.values(AIRWAY_LANDMARKS).map((lm) => (
                  <option key={lm.id} value={lm.id}>
                    {lm.name} ({lm.idealDepthCm}cm)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Center Column: Endoluminal Video & EBUS Viewport (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
            {/* Viewport Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  HD Video Bronchoscopy Viewport
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {navResult.landmarkName}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono border ${
                  navResult.isViewCentered
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}>
                  {navResult.isViewCentered ? 'CENTERED' : 'NAVIGATING'}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Tool: {activeTool.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Circular Endoscopic Viewport SVG Graphic */}
            <div className="relative w-full h-72 my-2 flex items-center justify-center">
              <svg viewBox="0 0 340 300" className="w-full h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.12)]">
                <defs>
                  {/* Endoluminal Mucosa Gradient */}
                  <radialGradient id="mucosaGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="65%" stopColor="#881337" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4c0519" stopOpacity="0.8" />
                  </radialGradient>

                  {/* EBUS Ultrasound Fan Gradient */}
                  <radialGradient id="ebusSector" cx="50%" cy="100%" r="90%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#0e7490" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Outer Circular Scope Bezel */}
                <circle cx="170" cy="150" r="130" fill="#020617" stroke="#1e293b" strokeWidth="6" />
                <circle cx="170" cy="150" r="126" fill="url(#mucosaGlow)" />

                {/* Dynamic Anatomic Visuals */}
                {navResult.currentLandmarkId === 'VOCAL_CORDS' && (
                  <g>
                    {/* Triangular glottic opening */}
                    <path d="M 170 70 L 130 220 L 210 220 Z" fill="#020617" stroke="#fecdd3" strokeWidth="4" />
                    {/* Left & Right Vocal Cords */}
                    <line x1="170" y1="70" x2="130" y2="220" stroke="#fff1f2" strokeWidth="8" strokeLinecap="round" />
                    <line x1="170" y1="70" x2="210" y2="220" stroke="#fff1f2" strokeWidth="8" strokeLinecap="round" />
                    <text x="170" y="60" fill="#fda4af" fontSize="9" textAnchor="middle">Anterior</text>
                    <text x="170" y="240" fill="#fda4af" fontSize="9" textAnchor="middle">Arytenoids</text>
                  </g>
                )}

                {navResult.currentLandmarkId === 'MAIN_CARINA' && (
                  <g>
                    {/* Main Carina Keel dividing Left and Right Mainstems */}
                    <ellipse cx="125" cy="150" rx="38" ry="60" fill="#020617" stroke="#0284c7" strokeWidth="2.5" />
                    <ellipse cx="215" cy="150" rx="42" ry="65" fill="#020617" stroke="#0284c7" strokeWidth="2.5" />
                    {/* Sharp Vertical Carina Keel */}
                    <path d="M 170 85 L 170 215" stroke="#fecdd3" strokeWidth="5" strokeLinecap="round" />
                    <text x="125" y="153" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">L Main</text>
                    <text x="215" y="153" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">R Main</text>
                  </g>
                )}

                {(navResult.currentLandmarkId === 'RUL_ORIFICE' || navResult.currentLandmarkId === 'RUL_APICAL_B1') && (
                  <g>
                    {/* RUL Trifurcation Orifices: Apical, Posterior, Anterior */}
                    <circle cx="170" cy="105" r="24" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                    <text x="170" y="108" fill="#bae6fd" fontSize="9" textAnchor="middle" fontWeight="bold">B1 Apical</text>
                    <circle cx="130" cy="180" r="22" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                    <text x="130" y="183" fill="#bae6fd" fontSize="8" textAnchor="middle">B2 Post</text>
                    <circle cx="210" cy="180" r="22" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                    <text x="210" y="183" fill="#bae6fd" fontSize="8" textAnchor="middle">B3 Ant</text>
                  </g>
                )}

                {navResult.currentLandmarkId === 'BRONCHUS_INTERMEDIUS' && (
                  <g>
                    {/* Straight cylindrical conduit */}
                    <ellipse cx="170" cy="150" rx="55" ry="55" fill="#020617" stroke="#0284c7" strokeWidth="3" />
                    {/* Cartilaginous rings anteriorly */}
                    <path d="M 125 120 A 45 45 0 0 1 215 120" fill="none" stroke="#93c5fd" strokeWidth="2.5" />
                    <path d="M 120 150 A 50 50 0 0 1 220 150" fill="none" stroke="#93c5fd" strokeWidth="2.5" />
                    <text x="170" y="180" fill="#bae6fd" fontSize="10" textAnchor="middle" fontWeight="bold">Bronchus Intermedius</text>
                  </g>
                )}

                {/* Visual Pathology Overlay: Massive Hemoptysis Pooling */}
                {hemoptysisState && hemoptysisState.bleedingSeverity !== 'NONE' && (
                  <g>
                    <circle cx="170" cy="150" r="110" fill="#991b1b" opacity={hemoptysisState.bleedingControlled ? 0.25 : 0.65} />
                    <path d="M 130 140 Q 170 200 210 140" fill="#dc2626" opacity="0.8" />
                    <text x="170" y="130" fill="#fecaca" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {hemoptysisState.bleedingControlled ? 'Bleeding Controlled' : 'Active Hemoptysis Inundation'}
                    </text>
                  </g>
                )}

                {/* Visual Pathology Overlay: Foreign Body in Bronchus Intermedius */}
                {selectedPresetId === 'foreign-body-bronchus-intermedius' && (
                  <g>
                    {/* Organic peanut mass */}
                    <ellipse cx="170" cy="150" rx="28" ry="18" fill="#d97706" stroke="#b45309" strokeWidth="2" />
                    <text x="170" y="153" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">Peanut FB</text>
                  </g>
                )}

                {/* Working Tool Graphic: Needle / Forceps in Channel */}
                {activeTool === 'EBUS_TBNA_NEEDLE_22G' && (
                  <g>
                    <line x1="170" y1="260" x2="170" y2="170" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" />
                    <polygon points="170,165 166,175 174,175" fill="#facc15" />
                    <text x="195" y="220" fill="#facc15" fontSize="8" fontWeight="bold">22G Needle</text>
                  </g>
                )}

                {/* EBUS Ultrasound Sector Overlay (when EBUS Mode is active) */}
                {ebusModeActive && (
                  <g>
                    <rect x="20" y="20" width="130" height="110" rx="8" fill="#020617" opacity="0.9" stroke="#0891b2" strokeWidth="1.5" />
                    <text x="85" y="35" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">EBUS Transducer</text>
                    {/* Sector Arc */}
                    <path d="M 85 110 L 40 45 A 60 60 0 0 1 130 45 Z" fill="url(#ebusSector)" stroke="#164e63" strokeWidth="1" />
                    {/* Target Lymph Node */}
                    <circle cx="85" cy="75" r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <text x="85" y="78" fill="#a5f3fc" fontSize="7" textAnchor="middle">LN Node</text>
                    {/* Color Doppler Flow if Active */}
                    {colorDopplerActive && (
                      <ellipse cx="65" cy="65" rx="8" ry="5" fill="#ef4444" opacity="0.8" />
                    )}
                  </g>
                )}
              </svg>
            </div>

            {/* Anatomic Characteristics & EBUS Nodal Station Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-300">
                  IASLC Staging Station:
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {navResult.ebusTargetStation ? `${navResult.ebusTargetStation.name} [${navResult.ebusTargetStation.nStageClassification}]` : 'None at this airway depth'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {navResult.activeLandmark.anatomicCharacteristics}
              </p>
            </div>
          </div>

          {/* Procedure & Diagnostic Results Box */}
          {roseCytologyReport && (
            <div className="bg-slate-900 border border-emerald-600/50 rounded-2xl p-4 space-y-1.5 shadow-lg">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Rapid On-Site Evaluation (ROSE) Cytology
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {roseCytologyReport}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Interventions & BAL Analysis (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* EBUS TBNA Actions */}
          {ebusModeActive && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                EBUS-TBNA Staging Tools
              </h3>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Target Station:</span>
                  <span className="text-white font-bold">{navResult.ebusTargetStation?.name || 'Station 7'}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Nodal Staging:</span>
                  <span className="text-cyan-400 font-bold">{navResult.ebusTargetStation?.nStageClassification || 'N2'}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Vascular Doppler:</span>
                  <span className={colorDopplerActive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {colorDopplerActive ? 'SAFE (Vessels Visualized)' : 'CHECK DOPPLER FIRST'}
                  </span>
                </div>

                <button
                  onClick={handlePerformTbnaPuncture}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Perform TBNA Aspiration
                </button>
              </div>
            </div>
          )}

          {/* BAL Cytology Analysis Box */}
          {balState && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Bronchoalveolar Lavage
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {Math.round((balState.recoveredSalineMl / balState.instilledSalineMl) * 100)}% Yield
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Instilled / Recovered:</span>
                  <span className="text-white">{balState.instilledSalineMl} / {balState.recoveredSalineMl} mL</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                  <span className="text-cyan-300">Lymphocyte Count:</span>
                  <span className={balState.lymphocytePct > 40 ? 'text-rose-400' : 'text-emerald-400'}>
                    {balState.lymphocytePct}% {balState.lymphocytePct > 40 ? '(High)' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Neutrophil Count:</span>
                  <span className="text-white">{balState.neutrophilPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CD4 / CD8 Ratio:</span>
                  <span className={`font-bold ${balState.cd4ToCd8Ratio < 1.0 ? 'text-amber-400' : 'text-white'}`}>
                    {balState.cd4ToCd8Ratio} {balState.cd4ToCd8Ratio < 1.0 ? '(Inverted)' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hemoptysis Emergency Protocol */}
          {hemoptysisState && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Hemoptysis Protocol
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  hemoptysisState.bleedingControlled
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse'
                }`}>
                  {hemoptysisState.bleedingControlled ? 'CONTROLLED' : 'ACTIVE BLEED'}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleInstillColdSaline}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
                >
                  Instill 50 mL Iced Saline (Total: {hemoptysisState.icedSalineInstilledMl}mL)
                </button>
                <button
                  onClick={handleInstillEpi}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
                >
                  Instill Epinephrine 1:20,000 ({hemoptysisState.epinephrineInstilledMg}mg)
                </button>
                <button
                  onClick={handleToggleBalloon}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition border ${
                    hemoptysisState.balloonOcclusionInflated
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400'
                  }`}
                >
                  {hemoptysisState.balloonOcclusionInflated ? 'Deflate Occlusion Balloon' : 'Inflate Tamponade Balloon'}
                </button>
              </div>
            </div>
          )}

          {/* High-Yield Clinical Pearls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Interventional Pearls
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activePreset.teachingPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
