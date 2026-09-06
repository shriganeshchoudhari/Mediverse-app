'use client';

import React, { useState, useMemo } from 'react';
import {
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileText,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Scissors,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Flame,
} from 'lucide-react';
import {
  computeChestTubeState,
  CHEST_TUBE_PRESETS,
  ChestTubeInputParams,
  ChestTubePresetId,
  ChestTubeState,
  PleuralFluidType,
  DrainageChamberStatus,
  AirLeakGrade,
} from '@/.gemini/skills/ChestTubePleuralEngine';

const PRESET_KEYS: ChestTubePresetId[] = [
  'TENSION_PNEUMOTHORAX_TRAUMA',
  'MASSIVE_HEMOTHORAX_CHEST_INJURY',
  'OPEN_SUCKING_CHEST_WOUND',
  'COMPLICATED_PARAPNEUMONIC_EMPYEMA',
  'MALIGNANT_PLEURAL_EFFUSION',
  'POST_LOBECTOMY_AIR_LEAK',
  'IATROGENIC_CHYLOTHORAX',
  'RESOLVED_LUNG_REEXPANSION',
];

export default function ChestTubePleuralSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<ChestTubePresetId>(
    'TENSION_PNEUMOTHORAX_TRAUMA'
  );
  const [params, setParams] = useState<ChestTubeInputParams>(
    () => CHEST_TUBE_PRESETS.TENSION_PNEUMOTHORAX_TRAUMA.initialState
  );
  const [activeTab, setActiveTab] = useState<'console' | 'interventions' | 'chemistry' | 'guidelines'>(
    'console'
  );
  const [reportExported, setReportExported] = useState(false);

  // Computed state
  const state: ChestTubeState = useMemo(() => {
    return computeChestTubeState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: ChestTubePresetId) => {
    setSelectedPreset(presetId);
    setParams(CHEST_TUBE_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('TENSION_PNEUMOTHORAX_TRAUMA');
  };

  // Needle Decompression
  const handleNeedleDecompress = () => {
    setParams((prev) => ({
      ...prev,
      isNeedleDecompressed: true,
      pleuralAirVolumeMl: Math.min(200, prev.pleuralAirVolumeMl * 0.15),
    }));
  };

  // Instill tPA + DNase
  const handleInstillEnzymes = () => {
    setParams((prev) => ({
      ...prev,
      hasIntrapleuralEnzymes: true,
      pleuralFluidVolumeMl: Math.max(100, prev.pleuralFluidVolumeMl * 0.4),
      hourlyDrainageRateMlHr: prev.hourlyDrainageRateMlHr + 80,
    }));
  };

  // Talc Pleurodesis
  const handlePleurodesis = () => {
    setParams((prev) => ({
      ...prev,
      hasPleurodesis: true,
      pleuralFluidVolumeMl: 20,
      pleuralAirVolumeMl: 0,
    }));
  };

  // Toggle Tube Clamp
  const toggleTubeClamp = () => {
    setParams((prev) => ({
      ...prev,
      isTubeClamped: !prev.isTubeClamped,
      drainageMode: !prev.isTubeClamped ? 'TUBE_CLAMPED' : 'GRAVITY_WATER_SEAL',
    }));
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Fluid Color Map
  const getFluidColor = (type: PleuralFluidType) => {
    switch (type) {
      case 'HEMOTHORAX_BLOOD':
        return '#b91c1c'; // Deep blood red
      case 'EMPYEMA_PURULENT':
        return '#d97706'; // Thick amber/pus
      case 'CHYLOTHORAX_MILKY':
        return '#f8fafc'; // Milky white
      case 'MALIGNANT_SEROSANGUINOUS':
        return '#e11d48'; // Rosy pink
      case 'SEROUS_TRANSUDATE':
      case 'EXUDATE_PARAPNEUMONIC':
      default:
        return '#eab308'; // Clear straw yellow
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Wind className="w-4 h-4" />
              Pulmonology &amp; Critical Care Thoracostomy Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Pleural Space Dynamics &amp; Chest Tube Drainage Simulator
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Model transpulmonary elastance, tension pneumothorax hemodynamic collapse, 3-chamber water seal tidaling,
              calibrated air leaks, ATLS massive hemothorax thoracotomy triggers, and Light&apos;s criteria fluid analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-sky-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              {reportExported ? 'Report Generated!' : 'Export Clinical Note'}
            </button>
          </div>
        </div>

        {/* Clinical Alarms & Surgical Recommendation Banner */}
        <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-sky-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-sky-400">Status:</span>
            <span className="text-sm font-semibold text-white">{state.clinicalRecommendation.split('.')[0]}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {state.activeAlarms.map((alarm) => {
              const isCritical =
                alarm === 'TENSION_PNEUMOTHORAX_CRITICAL' ||
                alarm === 'MASSIVE_HEMOTHORAX_THORACOTOMY_ALERT';
              return (
                <span
                  key={alarm}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isCritical
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse'
                      : alarm === 'OPTIMAL_LUNG_EXPANSION'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-600'
                  }`}
                >
                  {isCritical ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <CheckCircle2 className="w-3 h-3" />}
                  {alarm.replace(/_/g, ' ')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Clinical Pleural Scenarios &amp; Presets:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESET_KEYS.map((key) => {
            const preset = CHEST_TUBE_PRESETS[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-500 text-sky-200 font-bold shadow-md shadow-sky-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold line-clamp-2">{preset.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{preset.initialState.presetId.replace(/_/g, ' ')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-6">
        <button
          onClick={() => setActiveTab('console')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'console'
              ? 'border-sky-400 text-sky-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Thoracic Coronal &amp; 3-Chamber Drainage Console
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'interventions'
              ? 'border-sky-400 text-sky-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Bedside Thoracic Interventions &amp; Controls
        </button>
        <button
          onClick={() => setActiveTab('chemistry')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'chemistry'
              ? 'border-sky-400 text-sky-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Pleural Chemistry &amp; Light&apos;s Criteria
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'guidelines'
              ? 'border-sky-400 text-sky-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          ATLS Thoracotomy &amp; Chest Tube Protocols
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'console' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Thoracic Anatomy & Pleural Space SVG */}
            <div className="lg:col-span-6 bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Wind className="w-4 h-4 text-sky-400" />
                  Coronal Thorax &amp; Pleural Cavity
                </div>
                <div className="text-xs text-slate-400">
                  Expansion: <span className="font-mono font-bold text-teal-300">{state.lungExpansionPct}%</span>
                </div>
              </div>

              {/* Thoracic Anatomy SVG */}
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 320" className="w-full h-full select-none">
                  {/* Ribcage Outline */}
                  <path
                    d="M 60 40 C 40 100, 30 200, 60 270 C 120 300, 280 300, 340 270 C 370 200, 360 100, 340 40 Z"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="3"
                  />

                  {/* Diaphragm */}
                  <path
                    d="M 60 270 Q 200 240, 340 270 Z"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="2"
                  />

                  {/* Mediastinum / Trachea (with live tracheal deviation) */}
                  <g transform={`translate(${state.mediastinalShiftMm * 1.5}, 0)`}>
                    {/* Trachea */}
                    <rect x="193" y="25" width="14" height="60" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Heart shadow */}
                    <ellipse cx="200" cy="180" rx="35" ry="45" fill="#e11d48" opacity="0.3" stroke="#f43f5e" strokeWidth="1.5" />
                  </g>

                  {/* Normal Contralateral Left Lung (Right side on viewer: x=210 to 330) */}
                  <path
                    d="M 215 90 C 230 60, 310 70, 325 100 C 340 150, 335 220, 320 250 C 290 260, 230 255, 215 240 Z"
                    fill="#38bdf8"
                    opacity="0.35"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />

                  {/* Affected Right Hemithorax (Left side on viewer: x=50 to 190) */}
                  {/* Pleural Space Path (contains Air or Fluid) */}
                  <path
                    d="M 75 90 C 90 60, 170 70, 185 100 C 190 150, 185 220, 175 250 C 150 260, 90 255, 75 240 Z"
                    fill={params.pleuralAirVolumeMl > 100 ? '#38bdf8' : getFluidColor(params.fluidType)}
                    opacity={params.pleuralAirVolumeMl > 100 ? 0.15 : 0.4}
                    stroke="#0ea5e9"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />

                  {/* Collapsible Lung Parenchyma (scales dynamically based on lungExpansionPct) */}
                  <g
                    transform={`translate(${130 - (130 * (state.lungExpansionPct / 100))}, ${170 - (170 * (state.lungExpansionPct / 100))}) scale(${Math.max(0.15, state.lungExpansionPct / 100)})`}
                    style={{ transformOrigin: '130px 170px', transition: 'all 0.4s ease-out' }}
                  >
                    <path
                      d="M 75 90 C 90 60, 170 70, 185 100 C 190 150, 185 220, 175 250 C 150 260, 90 255, 75 240 Z"
                      fill="#0284c7"
                      opacity="0.65"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text x="130" y="175" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {state.lungExpansionPct}%
                    </text>
                  </g>

                  {/* Chest Tube (enters at 5th ICS anterior axillary line) */}
                  <path
                    d="M 20 200 L 70 200 L 110 160 L 130 130"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Drainage holes on tube tip */}
                  <circle cx="115" cy="150" r="1.5" fill="#020617" />
                  <circle cx="125" cy="138" r="1.5" fill="#020617" />

                  {/* Needle Decompression Catheter (if activated) */}
                  {params.isNeedleDecompressed && (
                    <g>
                      <line x1="130" y1="20" x2="130" y2="70" stroke="#f59e0b" strokeWidth="3" />
                      <circle cx="130" cy="20" r="4" fill="#f59e0b" />
                      <text x="140" y="30" fill="#f59e0b" fontSize="9" fontWeight="bold">14G Angiocath</text>
                    </g>
                  )}

                  {/* Tracheal Deviation Label */}
                  {state.mediastinalShiftMm > 5 && (
                    <text x="200" y="45" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                      &rarr; Shift {state.mediastinalShiftMm}mm
                    </text>
                  )}
                </svg>
              </div>

              {/* Real-Time Pressures HUD */}
              <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">P_pl (Insp / Exp)</div>
                  <div className="text-xs font-mono font-bold text-white">
                    {state.intrapleuralPressureInspirationCmH2O} / {state.intrapleuralPressureExpirationCmH2O}
                  </div>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">P_transpulmonary</div>
                  <div className={`text-xs font-mono font-bold ${state.transpulmonaryPressureCmH2O > 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                    {state.transpulmonaryPressureCmH2O} cmH2O
                  </div>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Cardiac Output</div>
                  <div className={`text-xs font-mono font-bold ${state.cardiacOutputLMin < 3 ? 'text-rose-400' : 'text-white'}`}>
                    {state.cardiacOutputLMin} L/min
                  </div>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Mediastinal Shift</div>
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {state.mediastinalShiftMm} mm
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The 3-Chamber Drainage System SVG (Pleur-evac / Atrium) */}
            <div className="lg:col-span-6 bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  3-Chamber Chest Drainage Unit (Pleur-evac / Atrium)
                </div>
                <div className="text-xs">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    params.drainageMode === 'TUBE_CLAMPED'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : params.drainageMode === 'ACTIVE_WALL_SUCTION'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {params.drainageMode.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* 3-Chamber SVG */}
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 450 320" className="w-full h-full select-none">
                  {/* Outer Plastic Casing */}
                  <rect x="20" y="20" width="410" height="280" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="3" />

                  {/* Chamber 1: Collection Chamber (Left: x=30 to 180) */}
                  <g>
                    <rect x="30" y="30" width="150" height="260" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="2" />
                    <text x="105" y="48" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Chamber 1: Collection
                    </text>

                    {/* Fluid Level Fill */}
                    {params.pleuralFluidVolumeMl > 0 && (
                      <rect
                        x="32"
                        y={Math.max(60, 288 - (Math.min(2500, params.pleuralFluidVolumeMl) / 2500) * 220)}
                        width="146"
                        height={Math.min(225, (Math.min(2500, params.pleuralFluidVolumeMl) / 2500) * 220)}
                        fill={getFluidColor(params.fluidType)}
                        opacity="0.8"
                      />
                    )}

                    {/* Graduations */}
                    {[500, 1000, 1500, 2000].map((vol) => {
                      const y = 288 - (vol / 2500) * 220;
                      return (
                        <g key={`col-vol-${vol}`}>
                          <line x1="32" y1={y} x2="55" y2={y} stroke="#64748b" strokeWidth="1" />
                          <text x="60" y={y + 3} fill="#64748b" fontSize="8">{vol} mL</text>
                        </g>
                      );
                    })}

                    <text x="105" y="275" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Total: {params.pleuralFluidVolumeMl} mL
                    </text>
                  </g>

                  {/* Chamber 2: Water Seal Chamber (Middle: x=190 to 300) */}
                  <g>
                    <rect x="190" y="30" width="110" height="260" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="2" />
                    <text x="245" y="48" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Chamber 2: Water Seal
                    </text>

                    {/* 2 cmH2O Water Level */}
                    <rect x="192" y="220" width="106" height="68" fill="#0284c7" opacity="0.3" />
                    <line x1="192" y1="220" x2="298" y2="220" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,2" />
                    <text x="245" y="215" fill="#38bdf8" fontSize="8" textAnchor="middle">2 cmH2O Baseline</text>

                    {/* U-Tube Meniscus (Tidaling Animation Indicator) */}
                    {state.isTidalingPresent && (
                      <g>
                        <line x1="220" y1="180" x2="220" y2="250" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                        <text x="245" y="170" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
                          Tidaling &plusmn;{state.tidalingAmplitudeCm} cm
                        </text>
                      </g>
                    )}

                    {/* Air Leak Bubble Meter */}
                    <g>
                      <text x="245" y="245" fill="#94a3b8" fontSize="8" textAnchor="middle">
                        Air Leak Meter: Grade {params.airLeakGrade}
                      </text>
                      {params.airLeakGrade > 0 && (
                        <g>
                          {[1, 2, 3, 4, 5].slice(0, params.airLeakGrade).map((gIdx) => (
                            <circle
                              key={`bubble-${gIdx}`}
                              cx={205 + gIdx * 13}
                              cy="265"
                              r="4"
                              fill="#38bdf8"
                              opacity="0.8"
                            />
                          ))}
                        </g>
                      )}
                    </g>
                  </g>

                  {/* Chamber 3: Suction Control Chamber (Right: x=310 to 420) */}
                  <g>
                    <rect x="310" y="30" width="110" height="260" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="2" />
                    <text x="365" y="48" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Chamber 3: Suction
                    </text>

                    {/* Wet Suction Water Column (calibrated to suction pressure) */}
                    <rect
                      x="312"
                      y={288 - (Math.abs(params.suctionPressureCmH2O) / 40) * 200}
                      width="106"
                      height={(Math.abs(params.suctionPressureCmH2O) / 40) * 200}
                      fill="#0284c7"
                      opacity="0.25"
                    />
                    <line
                      x1="312"
                      y1={288 - (Math.abs(params.suctionPressureCmH2O) / 40) * 200}
                      x2="418"
                      y2={288 - (Math.abs(params.suctionPressureCmH2O) / 40) * 200}
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text
                      x="365"
                      y={288 - (Math.abs(params.suctionPressureCmH2O) / 40) * 200 - 6}
                      fill="#38bdf8"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {params.suctionPressureCmH2O} cmH2O
                    </text>

                    {/* Suction Status */}
                    <text x="365" y="275" fill={params.drainageMode === 'ACTIVE_WALL_SUCTION' ? '#34d399' : '#64748b'} fontSize="10" fontWeight="bold" textAnchor="middle">
                      {params.drainageMode === 'ACTIVE_WALL_SUCTION' ? '● Suction Active' : '○ Off Suction'}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Chamber Operational Status Guide */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Hourly Output:</span>
                  <span className={`font-mono font-bold ${params.hourlyDrainageRateMlHr >= 200 ? 'text-rose-400' : 'text-white'}`}>
                    {params.hourlyDrainageRateMlHr} mL/hr
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Water Seal Fluctuation:</span>
                  <span className="font-mono font-bold text-teal-300">
                    {state.isTidalingPresent ? `Tidaling (${state.tidalingAmplitudeCm} cm)` : 'No Tidaling'}
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Air Leak Grade:</span>
                  <span className={`font-mono font-bold ${params.airLeakGrade >= 3 ? 'text-rose-400' : 'text-amber-300'}`}>
                    Grade {params.airLeakGrade} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Intervention Deck */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scissors className="w-4 h-4 text-sky-400" />
                Emergency Thoracic &amp; Bedside Procedures
              </h3>

              {/* Needle Decompression */}
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-amber-400">Emergency Needle Thoracostomy (14G)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Decompresses trapped tension air at 2nd ICS midclavicular or 5th ICS anterior axillary line.
                  </p>
                </div>
                <button
                  onClick={handleNeedleDecompress}
                  disabled={params.isNeedleDecompressed}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    params.isNeedleDecompressed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                  }`}
                >
                  {params.isNeedleDecompressed ? 'Needle In Situ' : 'Decompress (14G)'}
                </button>
              </div>

              {/* tPA + DNase Instillation (MIST-2) */}
              <div className="p-4 bg-slate-950 rounded-xl border border-teal-900/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-teal-400">Intrapleural Alteplase + Dornase (MIST-2)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Instill 10mg tPA + 5mg DNase for multiloculated empyema or organized parapneumonic collection.
                  </p>
                </div>
                <button
                  onClick={handleInstillEnzymes}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition whitespace-nowrap shadow-lg shadow-teal-600/20"
                >
                  Instill Enzymes
                </button>
              </div>

              {/* Talc Slurry Pleurodesis */}
              <div className="p-4 bg-slate-950 rounded-xl border border-purple-900/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-purple-400">Talc Slurry Chemical Pleurodesis (4g)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Induces aseptic pleuritis to obliterate pleural space in recurrent malignant effusion.
                  </p>
                </div>
                <button
                  onClick={handlePleurodesis}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition whitespace-nowrap shadow-lg shadow-purple-600/20"
                >
                  Perform Pleurodesis
                </button>
              </div>

              {/* Tube Clamp Protocol */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-200">Challenge Clamping / Removal Trial</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    WARNING: Never clamp an actively bubbling tube due to tension pneumothorax risk.
                  </p>
                </div>
                <button
                  onClick={toggleTubeClamp}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    params.isTubeClamped
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {params.isTubeClamped ? 'Unclamp Tube' : 'Clamp Tube'}
                </button>
              </div>
            </div>

            {/* Right: Dynamic Volume & Drainage Sliders */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                Pleural Space &amp; Drainage Controls
              </h3>

              {/* Mode Switcher */}
              <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-900 p-1 text-xs">
                <button
                  onClick={() => setParams((p) => ({ ...p, drainageMode: 'GRAVITY_WATER_SEAL', isTubeClamped: false }))}
                  className={`flex-1 py-1.5 rounded font-bold transition ${
                    params.drainageMode === 'GRAVITY_WATER_SEAL' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Water Seal
                </button>
                <button
                  onClick={() => setParams((p) => ({ ...p, drainageMode: 'ACTIVE_WALL_SUCTION', isTubeClamped: false }))}
                  className={`flex-1 py-1.5 rounded font-bold transition ${
                    params.drainageMode === 'ACTIVE_WALL_SUCTION' ? 'bg-sky-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Wall Suction
                </button>
                <button
                  onClick={() => setParams((p) => ({ ...p, drainageMode: 'TUBE_CLAMPED', isTubeClamped: true }))}
                  className={`flex-1 py-1.5 rounded font-bold transition ${
                    params.drainageMode === 'TUBE_CLAMPED' ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Clamped
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-3 text-xs pt-2">
                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>Pleural Air Volume:</span>
                    <span className="font-mono text-sky-400">{params.pleuralAirVolumeMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={params.pleuralAirVolumeMl}
                    onChange={(e) => setParams((p) => ({ ...p, pleuralAirVolumeMl: Number(e.target.value) }))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>Pleural Fluid Volume:</span>
                    <span className="font-mono text-amber-400">{params.pleuralFluidVolumeMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2500"
                    step="50"
                    value={params.pleuralFluidVolumeMl}
                    onChange={(e) => setParams((p) => ({ ...p, pleuralFluidVolumeMl: Number(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>Wall Suction Pressure:</span>
                    <span className="font-mono text-sky-400">{params.suctionPressureCmH2O} cmH2O</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="-10"
                    step="5"
                    value={params.suctionPressureCmH2O}
                    onChange={(e) => setParams((p) => ({ ...p, suctionPressureCmH2O: Number(e.target.value) }))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>Air Leak Grade (Water Seal Bubbles):</span>
                    <span className="font-mono text-rose-400">Grade {params.airLeakGrade} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={params.airLeakGrade}
                    onChange={(e) => setParams((p) => ({ ...p, airLeakGrade: Number(e.target.value) as AirLeakGrade }))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chemistry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Light's Criteria Calculator */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  Light&apos;s Criteria for Pleural Fluid Analysis
                </h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  state.lightsResult.isExudate
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-teal-950 text-teal-300 border border-teal-800'
                }`}>
                  {state.lightsResult.isExudate ? 'EXUDATIVE' : 'TRANSUDATIVE'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pleural / Serum Protein Ratio:</span>
                  <span className={`font-mono font-bold ${state.lightsResult.ratioProtein > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {state.lightsResult.ratioProtein} (Cutoff: &gt;0.5)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pleural / Serum LDH Ratio:</span>
                  <span className={`font-mono font-bold ${state.lightsResult.ratioLdh > 0.6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {state.lightsResult.ratioLdh} (Cutoff: &gt;0.6)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pleural LDH vs Upper Limit Normal (ULN):</span>
                  <span className={`font-mono font-bold ${params.pleuralChemistry.fluidLdhUL > 133 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.pleuralChemistry.fluidLdhUL} U/L (Cutoff: &gt;133 U/L)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <strong className="text-white block mb-1">Etiological Diagnosis:</strong>
                {state.lightsResult.reason}
              </div>
            </div>

            {/* Right: Specialized Pleural Fluid Biomarkers */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Specialized Diagnostic Biomarkers
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Pleural Fluid pH:</span>
                  <span className={`text-base font-mono font-bold ${params.pleuralChemistry.fluidPh < 7.20 ? 'text-rose-400' : 'text-white'}`}>
                    {params.pleuralChemistry.fluidPh}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {params.pleuralChemistry.fluidPh < 7.20 ? 'Critical: Empyema indicator' : 'Normal (>7.30)'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Pleural Glucose:</span>
                  <span className={`text-base font-mono font-bold ${params.pleuralChemistry.fluidGlucoseMgdl < 40 ? 'text-rose-400' : 'text-white'}`}>
                    {params.pleuralChemistry.fluidGlucoseMgdl} mg/dL
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {params.pleuralChemistry.fluidGlucoseMgdl < 40 ? 'Severe bacterial consumption' : 'Normal'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Triglycerides:</span>
                  <span className={`text-base font-mono font-bold ${params.pleuralChemistry.triglyceridesMgdl > 110 ? 'text-amber-400' : 'text-white'}`}>
                    {params.pleuralChemistry.triglyceridesMgdl} mg/dL
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {params.pleuralChemistry.triglyceridesMgdl > 110 ? 'Diagnostic of Chylothorax' : '<110 mg/dL'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Fluid Hematocrit:</span>
                  <span className={`text-base font-mono font-bold ${params.pleuralChemistry.hematocritPct > 20 ? 'text-rose-400' : 'text-white'}`}>
                    {params.pleuralChemistry.hematocritPct}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {params.pleuralChemistry.hematocritPct > 20 ? '>50% blood = Hemothorax' : 'Serous'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Definitive Action Pathway */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-400" />
                Definitive Thoracic Surgical Recommendation
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-sky-500/30 text-xs leading-relaxed space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  Actionable Clinical Plan
                </span>
                <p className="text-slate-300">{state.clinicalRecommendation}</p>
                <div className="pt-2 border-t border-slate-800 text-teal-300 font-medium">
                  {state.surgicalAction}
                </div>
              </div>
            </div>

            {/* ATLS Massive Hemothorax & Tube Removal Checklist */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                ATLS &amp; BTS Guidelines Checklist
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-amber-400 mb-1">ATLS Emergency Thoracotomy Criteria:</div>
                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                    <li>Immediate chest tube output &ge; 1500 mL of blood upon insertion.</li>
                    <li>Ongoing drainage &ge; 200 mL/hr for 2 to 4 consecutive hours.</li>
                    <li>Persistent hemodynamic instability despite aggressive balanced blood resuscitation.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-teal-400 mb-1">Safe Chest Tube Removal Criteria:</div>
                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                    <li>Resolution of primary etiology with complete lung expansion on upright chest X-ray.</li>
                    <li>Zero air leak during cough or forced expiration for at least 24 hours.</li>
                    <li>Total serous drainage &lt; 100 to 150 mL per 24 hours.</li>
                    <li>Successful water seal challenge trial without suction for 12–24 hours.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
