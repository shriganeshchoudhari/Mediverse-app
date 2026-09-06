'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Droplets,
  RotateCcw,
  FileText,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Info,
  Pill,
  Thermometer,
  Layers,
  Heart,
} from 'lucide-react';
import {
  computeTegHemostasisState,
  TEG_PRESETS,
  TegInputParams,
  TegPresetId,
  TegState,
} from '@/.gemini/skills/TegHemostasisEngine';

const PRESET_KEYS: TegPresetId[] = [
  'NORMAL_PHYSIOLOGICAL_HEMOSTASIS',
  'SEVERE_HYPOFIBRINOGENEMIA_MASSIVE_HEMORRHAGE',
  'THROMBOCYTOPENIA_OR_TICP',
  'PRIMARY_HYPERFIBRINOLYSIS_TRAUMA',
  'SYSTEMIC_HEPARIN_EFFECT_POST_CPB',
  'FACTOR_DEFICIENCY_COAGULOPATHY_CIRRHOSIS',
  'HYPERCOAGULABLE_PROTHROMBOTIC_COVID_DIC',
  'DILUTIONAL_ACIDOSIS_HYPOTHERMIA_TRIAD',
];

export default function TegHemostasisSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<TegPresetId>(
    'NORMAL_PHYSIOLOGICAL_HEMOSTASIS'
  );
  const [params, setParams] = useState<TegInputParams>(
    () => TEG_PRESETS.NORMAL_PHYSIOLOGICAL_HEMOSTASIS.initialState
  );
  const [activeTab, setActiveTab] = useState<'tegTrace' | 'rotemAssays' | 'transfusionDeck' | 'guidelines'>(
    'tegTrace'
  );
  const [reportExported, setReportExported] = useState(false);

  // Computed state
  const state: TegState = useMemo(() => {
    return computeTegHemostasisState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: TegPresetId) => {
    setSelectedPreset(presetId);
    setParams(TEG_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('NORMAL_PHYSIOLOGICAL_HEMOSTASIS');
    setReportExported(false);
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Administer Transfusion Interventions Live
  const handleAdministerCryo = () => {
    setParams((prev) => ({
      ...prev,
      teg: {
        ...prev.teg,
        alphaAngleDegrees: Math.min(68, prev.teg.alphaAngleDegrees + 18),
        maxAmplitudeMm: Math.min(62, prev.teg.maxAmplitudeMm + 14),
      },
      rotem: {
        ...prev.rotem,
        fibtemMcfMm: Math.min(18, prev.rotem.fibtemMcfMm + 10),
      },
      patient: {
        ...prev.patient,
        fibrinogenMgDl: Math.min(320, prev.patient.fibrinogenMgDl + 120),
      },
    }));
  };

  const handleAdministerPlatelets = () => {
    setParams((prev) => ({
      ...prev,
      teg: {
        ...prev.teg,
        maxAmplitudeMm: Math.min(64, prev.teg.maxAmplitudeMm + 20),
      },
      rotem: {
        ...prev.rotem,
        extemMcfMm: Math.min(64, prev.rotem.extemMcfMm + 18),
      },
      patient: {
        ...prev.patient,
        plateletCountKUl: Math.min(180, prev.patient.plateletCountKUl + 50),
      },
    }));
  };

  const handleAdministerTXA = () => {
    setParams((prev) => ({
      ...prev,
      teg: {
        ...prev.teg,
        ly30Pct: Math.min(1.5, prev.teg.ly30Pct * 0.1),
      },
      rotem: {
        ...prev.rotem,
        maxLysisPct: Math.min(6, prev.rotem.maxLysisPct * 0.15),
      },
    }));
  };

  const handleAdministerProtamine = () => {
    setParams((prev) => ({
      ...prev,
      teg: {
        ...prev.teg,
        rTimeMinutes: prev.teg.heparinaseRTimeMinutes,
      },
      rotem: {
        ...prev.rotem,
        intemCtSec: prev.rotem.heptemCtSec,
      },
    }));
  };

  const handleAdministerPCC = () => {
    setParams((prev) => ({
      ...prev,
      teg: {
        ...prev.teg,
        rTimeMinutes: Math.max(6.0, prev.teg.rTimeMinutes - 6.5),
        alphaAngleDegrees: Math.min(65, prev.teg.alphaAngleDegrees + 10),
      },
      rotem: {
        ...prev.rotem,
        extemCtSec: Math.max(65, prev.rotem.extemCtSec - 50),
      },
    }));
  };

  // SVG Coordinate Helpers
  // X: Time 0 to 60 minutes -> 50 to 450
  const timeToX = (t: number) => 50 + (t / 60) * 400;
  // Y: Amplitude -50mm to +50mm -> Center at Y 150 (Range 40 to 260)
  const ampToY = (a: number) => 150 - a * 2.2;

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Droplets className="w-4 h-4 text-rose-400" />
              Viscoelastic Coagulation &amp; Hemostasis Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Thromboelastography (TEG / ROTEM) &amp; Transfusion Solver
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Viscoelastic clot dynamics (R, K, &alpha;-angle, MA, LY30), differential ROTEM assays (FIBTEM, HEPTEM, APTEM),
              and precision goal-directed transfusion resuscitation for trauma, cardiac surgery, and massive hemorrhage.
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              {reportExported ? 'Report Generated!' : 'Export Coag Consultation'}
            </button>
          </div>
        </div>

        {/* Status & Active Alarms Banner */}
        <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">Coagulation Phenotype:</span>
            <span className="text-sm font-bold text-white px-2.5 py-0.5 rounded bg-rose-950 border border-rose-700">
              {state.phenotype.replace(/_/g, ' ')} ({state.confidencePct}% Match)
            </span>
            <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Shear Modulus (G): <strong className="text-amber-300">{state.gValueDynesCm2.toLocaleString()}</strong> dynes/cm&sup2;
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {state.activeAlarms.map((alarm) => {
              const isLifeThreat =
                alarm === 'FULMINANT_HYPERFIBRINOLYSIS_TXA_EMERGENCY' ||
                alarm === 'LETHAL_TRIAD_HYPOTHERMIA_ACIDOSIS_COAGULOPATHY' ||
                alarm === 'CRITICAL_HYPOFIBRINOGENEMIA_CRYOPRECIPITATE_NEEDED';
              return (
                <span
                  key={alarm}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isLifeThreat
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse'
                      : alarm === 'OPTIMAL_HEMOSTATIC_EQUILIBRIUM'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-600'
                  }`}
                >
                  {isLifeThreat ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <CheckCircle2 className="w-3 h-3" />}
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
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          Clinical Viscoelastic Coagulopathy Presets:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESET_KEYS.map((key) => {
            const preset = TEG_PRESETS[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold shadow-md shadow-rose-950'
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
          onClick={() => setActiveTab('tegTrace')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'tegTrace'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live TEG Viscoelastic Clot Trace
        </button>
        <button
          onClick={() => setActiveTab('rotemAssays')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'rotemAssays'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          ROTEM 5-Assay Differential Panel
        </button>
        <button
          onClick={() => setActiveTab('transfusionDeck')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'transfusionDeck'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          Targeted Transfusion Deck &amp; Interventions
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'guidelines'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          Lethal Triad &amp; CRASH-2 / PROPPR Evidence
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'tegTrace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Symmetrical TEG Viscoelastic Waveform */}
            <div className="lg:col-span-7 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Continuous Viscoelastic TEG Waveform Tracing
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-rose-400 font-bold">── Clot Profile (Amplitude &plusmn; mm)</span>
                  <span className="text-slate-400 font-mono text-[10px]">Time (0–60 min)</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-hidden">
                <svg viewBox="0 0 480 300" className="w-full h-full select-none">
                  {/* Center Midline */}
                  <line x1="50" y1="150" x2="450" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

                  {/* Grid Lines - Time (0, 15, 30, 45, 60 min) */}
                  {[0, 15, 30, 45, 60].map((min) => {
                    const x = timeToX(min);
                    return (
                      <g key={`t-${min}`}>
                        <line x1={x} y1="30" x2={x} y2="270" stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y="288" fill="#64748b" fontSize="10" textAnchor="middle">
                          {min}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Amplitude Y-Axis (+50, +25, 0, -25, -50 mm) */}
                  {[50, 25, 0, -25, -50].map((amp) => {
                    const y = ampToY(amp);
                    return (
                      <g key={`amp-${amp}`}>
                        <line x1="50" y1={y} x2="450" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="44" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">
                          {amp}
                        </text>
                      </g>
                    );
                  })}

                  {/* Y-Axis Label */}
                  <text x="14" y="150" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 14 150)">
                    Amplitude (mm)
                  </text>

                  {/* Shaded Symmetrical Clot Mesh */}
                  {state.traceCoordinates.length > 2 && (
                    <polygon
                      fill="#e11d48"
                      fillOpacity="0.18"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      points={[
                        ...state.traceCoordinates.map((pt) => `${timeToX(pt.timeMinutes)},${ampToY(pt.upperAmplitudeMm)}`),
                        ...state.traceCoordinates.slice().reverse().map((pt) => `${timeToX(pt.timeMinutes)},${ampToY(pt.lowerAmplitudeMm)}`),
                      ].join(' ')}
                    />
                  )}

                  {/* R-Time Indicator Line */}
                  <line
                    x1={timeToX(params.teg.rTimeMinutes)}
                    y1="40"
                    x2={timeToX(params.teg.rTimeMinutes)}
                    y2="260"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                  />
                  <text
                    x={timeToX(params.teg.rTimeMinutes) + 4}
                    y="50"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    R: {params.teg.rTimeMinutes}m
                  </text>

                  {/* MA Maximum Amplitude Marker */}
                  <line
                    x1={timeToX(params.teg.rTimeMinutes + params.teg.kTimeMinutes + 15)}
                    y1={ampToY(params.teg.maxAmplitudeMm / 2)}
                    x2={timeToX(params.teg.rTimeMinutes + params.teg.kTimeMinutes + 15)}
                    y2={ampToY(-params.teg.maxAmplitudeMm / 2)}
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                  <text
                    x={timeToX(params.teg.rTimeMinutes + params.teg.kTimeMinutes + 15) + 6}
                    y="150"
                    fill="#fbbf24"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    MA: {params.teg.maxAmplitudeMm}mm
                  </text>
                </svg>
              </div>

              {/* Viscoelastic Parameter Sliders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>R-Time (min):</span>
                    <span className="font-mono text-cyan-400">{params.teg.rTimeMinutes}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="30.0"
                    step="0.5"
                    value={params.teg.rTimeMinutes}
                    onChange={(e) => setParams((p) => ({ ...p, teg: { ...p.teg, rTimeMinutes: Number(e.target.value) } }))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>&alpha;-Angle (&deg;):</span>
                    <span className="font-mono text-emerald-400">{params.teg.alphaAngleDegrees}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="85"
                    step="1"
                    value={params.teg.alphaAngleDegrees}
                    onChange={(e) => setParams((p) => ({ ...p, teg: { ...p.teg, alphaAngleDegrees: Number(e.target.value) } }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>MA (mm):</span>
                    <span className="font-mono text-amber-400">{params.teg.maxAmplitudeMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    step="1"
                    value={params.teg.maxAmplitudeMm}
                    onChange={(e) => setParams((p) => ({ ...p, teg: { ...p.teg, maxAmplitudeMm: Number(e.target.value) } }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>LY30 (%):</span>
                    <span className="font-mono text-rose-400">{params.teg.ly30Pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="40.0"
                    step="0.5"
                    value={params.teg.ly30Pct}
                    onChange={(e) => setParams((p) => ({ ...p, teg: { ...p.teg, ly30Pct: Number(e.target.value) } }))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right: Parameter Reference Matrix & Diagnostics */}
            <div className="lg:col-span-5 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-rose-400" />
                TEG Kinetics &amp; Reference Normals
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">R-Time (Initiation)</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">{params.teg.rTimeMinutes} min</span>
                  <span className="text-[10px] text-slate-500 block">Normal 5.0–10.0 min (Factors)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">K-Time &amp; &alpha;-Angle</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{params.teg.alphaAngleDegrees}&deg;</span>
                  <span className="text-[10px] text-slate-500 block">Normal 53–72&deg; (Fibrinogen)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Maximum Amplitude (MA)</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{params.teg.maxAmplitudeMm} mm</span>
                  <span className="text-[10px] text-slate-500 block">Normal 50–70 mm (Platelets 80%)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Clot Lysis (LY30)</span>
                  <span className="text-lg font-bold font-mono text-rose-400">{params.teg.ly30Pct}%</span>
                  <span className="text-[10px] text-slate-500 block">Normal 0.0–3.0% (Lysis &gt; 8% TXA)</span>
                </div>
              </div>

              {/* Heparinase Differential Card */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Heparinase TEG Comparison
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Native R-Time vs Heparinase R:</span>
                  <span className="font-mono text-white">{params.teg.rTimeMinutes} min vs {params.teg.heparinaseRTimeMinutes} min</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Heparin Delta:</span>
                  <span className={`font-mono font-bold ${params.teg.rTimeMinutes - params.teg.heparinaseRTimeMinutes >= 4 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {(params.teg.rTimeMinutes - params.teg.heparinaseRTimeMinutes).toFixed(1)} min
                  </span>
                </div>
              </div>

              {/* Clinical Interpretation Guidance */}
              <div className="p-3.5 bg-rose-950/40 rounded-lg border border-rose-800/60 text-xs text-rose-200 leading-relaxed">
                <strong>Hemostatic Summary: </strong>
                {state.clinicalGuidance}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rotemAssays' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: ROTEM 5-Assay Differential Grid */}
            <div className="lg:col-span-7 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Rotational Thromboelastometry (ROTEM) 5-Channel Assays
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* EXTEM */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-cyan-400">EXTEM (Tissue Factor)</strong>
                    <span className="text-[10px] text-slate-500">Extrinsic Pathway</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>CT (Clotting Time):</span>
                    <span className="font-mono text-white font-bold">{params.rotem.extemCtSec} s (Norm 43–82)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>MCF (Clot Firmness):</span>
                    <span className="font-mono text-white font-bold">{params.rotem.extemMcfMm} mm (Norm 50–72)</span>
                  </div>
                </div>

                {/* INTEM */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-purple-400">INTEM (Ellagic Acid)</strong>
                    <span className="text-[10px] text-slate-500">Intrinsic Pathway</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>CT:</span>
                    <span className="font-mono text-white font-bold">{params.rotem.intemCtSec} s (Norm 100–240)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>MCF:</span>
                    <span className="font-mono text-white font-bold">{params.rotem.intemMcfMm} mm (Norm 50–72)</span>
                  </div>
                </div>

                {/* FIBTEM */}
                <div className={`p-3 bg-slate-950 rounded-xl border space-y-1 ${
                  params.rotem.fibtemMcfMm < 10 ? 'border-rose-600 bg-rose-950/30' : 'border-slate-800'
                }`}>
                  <div className="flex justify-between items-center">
                    <strong className="text-emerald-400">FIBTEM (+ Cytochalasin D)</strong>
                    <span className="text-[10px] text-emerald-500">Platelets Blocked</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>MCF (Fibrinogen Alone):</span>
                    <span className={`font-mono font-bold text-sm ${params.rotem.fibtemMcfMm < 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {params.rotem.fibtemMcfMm} mm (Target &ge; 10–12)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Isolates functional fibrinogen polymer mesh.</p>
                </div>

                {/* HEPTEM */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-400">HEPTEM (+ Heparinase)</strong>
                    <span className="text-[10px] text-slate-500">Heparin Reversal</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>HEPTEM CT:</span>
                    <span className="font-mono text-white font-bold">{params.rotem.heptemCtSec} s</span>
                  </div>
                  <p className="text-[10px] text-slate-500">If INTEM CT &gt; HEPTEM CT &times; 1.5 &rarr; Give Protamine.</p>
                </div>
              </div>

              {/* APTEM Banner */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-rose-400 block">APTEM (EXTEM + Aprotinin / TXA)</strong>
                  <span className="text-[11px] text-slate-400">
                    Maximum Lysis: <strong className="text-white font-mono">{params.rotem.maxLysisPct}%</strong> (Norm &lt; 15%)
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  params.rotem.maxLysisPct > 15
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {params.rotem.maxLysisPct > 15 ? 'HYPERLYSIS CONFIRMED' : 'NORMAL LYSIS'}
                </span>
              </div>
            </div>

            {/* Right: ROTEM Algorithmic Decision Tree */}
            <div className="lg:col-span-5 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                ROTEM Algorithmic Decision Matrix
              </h3>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 leading-relaxed">
                <div>
                  <strong className="text-rose-300">1. Check for Hyperfibrinolysis (EXTEM ML &gt; 15%):</strong>
                  <p className="text-slate-400 text-[11px]">If APTEM corrects clot firmness &rarr; Administer Tranexamic Acid (TXA 1g) immediately before giving any fibrinogen products.</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-emerald-300">2. Assess Clot Firmness (FIBTEM MCF):</strong>
                  <p className="text-slate-400 text-[11px]">If FIBTEM MCF &lt; 10 mm &rarr; Administer Cryoprecipitate (2 pools) or Fibrinogen Concentrate (3–4g).</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-amber-300">3. Assess Platelet Contribution (EXTEM vs FIBTEM):</strong>
                  <p className="text-slate-400 text-[11px]">If EXTEM MCF &lt; 45 mm but FIBTEM &ge; 10 mm &rarr; Platelet deficit! Transfuse 1 apheresis platelet unit.</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-cyan-300">4. Assess Clot Initiation (EXTEM / INTEM CT):</strong>
                  <p className="text-slate-400 text-[11px]">If INTEM CT &gt;&gt; HEPTEM CT &rarr; Protamine. If EXTEM CT &gt; 80s &rarr; 4-Factor PCC or FFP.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transfusionDeck' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Goal-Directed Transfusion Actions */}
            <div className="lg:col-span-7 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-400" />
                Targeted Hemostatic Transfusion Formulary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Cryoprecipitate */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <strong className="text-emerald-400">Cryoprecipitate</strong>
                      <span className="text-[10px] text-slate-400">Fibrinogen &ge; 150 mg/dL</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Indicated for flat &alpha;-angle or FIBTEM &lt; 10 mm.</p>
                    <div className="text-xs font-bold text-white mt-1">
                      Recommended: <strong className="text-emerald-300">{state.interventions.cryoprecipitatePools} Pools</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleAdministerCryo}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                  >
                    Give 2 Pools Cryoprecipitate
                  </button>
                </div>

                {/* Platelets */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <strong className="text-amber-400">Apheresis Platelets</strong>
                      <span className="text-[10px] text-slate-400">MA &ge; 50 mm</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Indicated for isolated low MA with normal FIBTEM.</p>
                    <div className="text-xs font-bold text-white mt-1">
                      Recommended: <strong className="text-amber-300">{state.interventions.plateletUnits} Unit</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleAdministerPlatelets}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition"
                  >
                    Give 1 Unit Platelets
                  </button>
                </div>

                {/* Tranexamic Acid */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <strong className="text-rose-400">Tranexamic Acid (TXA)</strong>
                      <span className="text-[10px] text-slate-400">LY30 &lt; 3%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Indicated for hyperfibrinolysis teardrop trace.</p>
                    <div className="text-xs font-bold text-white mt-1">
                      Recommended: <strong className="text-rose-300">{state.interventions.txaDoseGrams}g IV Bolus</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleAdministerTXA}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition"
                  >
                    Give TXA 1g IV Push
                  </button>
                </div>

                {/* Protamine Sulfate */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <strong className="text-purple-400">Protamine Sulfate</strong>
                      <span className="text-[10px] text-slate-400">Heparin Reversal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Indicated for R-time prolongation normalized by heparinase.</p>
                    <div className="text-xs font-bold text-white mt-1">
                      Recommended: <strong className="text-purple-300">{state.interventions.protamineDoseMg} mg IV</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleAdministerProtamine}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                  >
                    Give Protamine 30mg
                  </button>
                </div>
              </div>

              {/* 4-Factor PCC / FFP */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-cyan-400 block">4-Factor PCC / FFP Dosing:</strong>
                  <span className="text-slate-300">{state.interventions.ffpUnitsOrPccDose}</span>
                </div>
                <button
                  onClick={handleAdministerPCC}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition text-xs"
                >
                  Infuse 4-Factor PCC 25 U/kg
                </button>
              </div>
            </div>

            {/* Right: Patient Context & Coagulation Labs */}
            <div className="lg:col-span-5 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Bedside Coagulation Labs &amp; Vitals
              </h3>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Core Body Temperature:</span>
                  <span className={`font-mono font-bold ${params.patient.temperatureCelsius < 35.0 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {params.patient.temperatureCelsius}&deg;C (Target &gt; 36.0)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Arterial pH:</span>
                  <span className={`font-mono font-bold ${params.patient.arterialPh < 7.20 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {params.patient.arterialPh} (Target &gt; 7.30)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ionized Calcium (iCa):</span>
                  <span className={`font-mono font-bold ${params.patient.ionizedCalciumMmolL < 1.15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {params.patient.ionizedCalciumMmolL} mmol/L (Norm 1.15–1.30)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Platelet Count:</span>
                  <span className="font-mono text-white font-bold">{params.patient.plateletCountKUl} &times; 10&sup3;/&mu;L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Plasma Fibrinogen (Clauss):</span>
                  <span className={`font-mono font-bold ${params.patient.fibrinogenMgDl < 150 ? 'text-rose-400' : 'text-white'}`}>
                    {params.patient.fibrinogenMgDl} mg/dL (Target &gt; 150–200)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                The Lethal Triad of Trauma (Diamond of Death)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Trauma-induced coagulopathy (TIC) is accelerated by the vicious circle of:
              </p>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                <li><strong className="text-white">1. Hypothermia (&lt; 35&deg;C):</strong> Enzyamtic activity of clotting factor complexes declines by ~10% for each 1&deg;C drop. Platelet adhesion to Von Willebrand factor is severely impaired.</li>
                <li><strong className="text-white">2. Metabolic Acidosis (pH &lt; 7.20):</strong> Decreases thrombin generation on the platelet surface by &gt; 50% and accelerates fibrinogen degradation.</li>
                <li><strong className="text-white">3. Dilutional Coagulopathy:</strong> Aggressive unbuffered crystalloid infusion (normal saline) washes out platelets and clotting factors while diluting plasma fibrinogen.</li>
                <li><strong className="text-white">4. Hypocalcemia (&lt; 1.0 mmol/L):</strong> Ionized calcium is an essential enzymatic cofactor for Tenase and Prothrombinase complexes. Citrate in packed RBC bags rapidly chelates free calcium.</li>
              </ul>
            </div>

            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                CRASH-2 &amp; PROPPR Clinical Evidence
              </h3>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 leading-relaxed">
                <div>
                  <strong className="text-rose-300">CRASH-2 TXA Golden Window:</strong> Tranexamic Acid (1g IV bolus over 10 min + 1g infusion over 8 hours) significantly reduces all-cause mortality when given within <strong>3 hours</strong> of trauma injury. Administration after 3 hours increases mortality and thrombotic risk!
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-cyan-300">PROPPR Trial (1:1:1 vs 1:1:2):</strong> Balanced massive transfusion protocol with Plasma, Platelets, and RBCs in a 1:1:1 ratio achieves superior early hemostasis and reduces exsanguination death compared to 1:1:2. Viscoelastic goal-directed titration (TEG/ROTEM) further reduces inappropriate blood component utilization.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
