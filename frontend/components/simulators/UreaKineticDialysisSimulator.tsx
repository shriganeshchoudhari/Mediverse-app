'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  RotateCcw,
  FileText,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Info,
  Droplets,
  Heart,
  Zap,
  Clock,
  Gauge,
  Sliders,
  Syringe,
  Layers,
  Flame,
  Scale,
} from 'lucide-react';
import {
  computeUreaKineticState,
  DIALYSIS_PRESETS,
  UreaKineticInputParams,
  DialysisPresetId,
  UreaKineticState,
  VascularAccessType,
  DialysisModality,
} from '@/.gemini/skills/UreaKineticDialysisEngine';

const PRESET_KEYS: DialysisPresetId[] = [
  'ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI',
  'UNDERDIALYSIS_LOW_BLOOD_FLOW_ACCESS_FAILURE',
  'DISEQUILIBRIUM_SYNDROME_FIRST_DIALYSIS',
  'ACCESS_RECIRCULATION_NEEDLE_REVERSAL',
  'PROTEIN_ENERGY_MALNUTRITION_LOW_NPCR',
  'HYPERCATABOLIC_SEPSIS_ELEVATED_NPCR',
  'EXCESSIVE_ULTRAFILTRATION_INTRA_HD_HYPOTENSION',
  'NOCTURNAL_EXTENDED_CLEARANCE_HOMEDIALYSIS',
];

export default function UreaKineticDialysisSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<DialysisPresetId>(
    'ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI'
  );
  const [params, setParams] = useState<UreaKineticInputParams>(
    () => DIALYSIS_PRESETS.ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI.initialState
  );
  const [activeTab, setActiveTab] = useState<
    'ukmClearance' | 'ultrafiltration' | 'accessRecirculation' | 'kdoqiGuidelines'
  >('ukmClearance');
  const [reportExported, setReportExported] = useState(false);

  // Compute live dialysis state
  const state: UreaKineticState = useMemo(() => {
    return computeUreaKineticState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: DialysisPresetId) => {
    setSelectedPreset(presetId);
    setParams(DIALYSIS_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI');
    setReportExported(false);
  };

  // Export Dialysis Record
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Color helper for spKt/V badge
  const getKtVBadgeColor = (spKtV: number) => {
    if (spKtV >= 1.4) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (spKtV >= 1.2) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                <Droplets className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-300 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                  Hemodialysis Urea Kinetic Modeling (UKM) &amp; Adequacy Workstation
                </h1>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  Daugirdas Second-Generation spKt/V &bull; Equilibrated eKt/V &bull; URR % &bull; nPCR / nPNA &bull; Access Recirculation AR% &bull; UFR
                </p>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights & Quick Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`px-4 py-2 rounded-xl border font-mono text-center ${getKtVBadgeColor(state.singlePoolKtV)}`}>
              <div className="text-[10px] uppercase font-sans tracking-wider opacity-80">Delivered spKt/V</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1.5">
                <span>{state.singlePoolKtV}</span>
                <span className="text-xs font-normal">
                  {state.singlePoolKtV >= 1.4 ? 'Optimal Target' : state.singlePoolKtV >= 1.2 ? 'Minimal Adequate' : 'Inadequate'}
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-center">
              <div className="text-[10px] uppercase font-sans tracking-wider text-slate-400">URR Ratio</div>
              <div className="text-2xl font-bold text-sky-300">{state.ureaReductionRatioPct}%</div>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Export Dialysis Flowsheet Record"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>{reportExported ? 'Flowsheet Logged!' : 'Export Record'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Reset to KDOQI Adequate Baseline"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 8 Preset Buttons Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Hemodialysis Kinetics &amp; Adequacy Presets
            </span>
            <span className="text-[11px] text-slate-500">8 Validated Dialytic Phenotypes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESET_KEYS.map((key) => {
              const preset = DIALYSIS_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium leading-snug line-clamp-2">{preset.title.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {key === 'ADEQUATE_HIGH_FLUX_HEMODIALYSIS_KDOQI'
                      ? 'KDOQI High-Flux'
                      : key === 'UNDERDIALYSIS_LOW_BLOOD_FLOW_ACCESS_FAILURE'
                      ? 'Access Stenosis'
                      : key === 'DISEQUILIBRIUM_SYNDROME_FIRST_DIALYSIS'
                      ? 'Disequilibrium Risk'
                      : key === 'ACCESS_RECIRCULATION_NEEDLE_REVERSAL'
                      ? 'Needle Reversal'
                      : key === 'PROTEIN_ENERGY_MALNUTRITION_LOW_NPCR'
                      ? 'Low nPCR / PEW'
                      : key === 'HYPERCATABOLIC_SEPSIS_ELEVATED_NPCR'
                      ? 'Septic Catabolism'
                      : key === 'EXCESSIVE_ULTRAFILTRATION_INTRA_HD_HYPOTENSION'
                      ? 'High UFR Stunning'
                      : 'Extended Nocturnal'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Alarms and Clinical Guidance Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Active Monitor Alarms
              </span>
              <span className="text-[11px] font-mono text-slate-500">{state.activeAlarms.length} Active</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.activeAlarms.map((alarm, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 ${
                    alarm.includes('UNDERDIALYSIS') || alarm.includes('STUNNING') || alarm.includes('DISEQUILIBRIUM')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : alarm.includes('RECIRCULATION') || alarm.includes('MALNUTRITION')
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{alarm.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                Evidence-Based Dialysis Guidance
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {params.prescription.durationHours}h Session &bull; Qb: {params.prescription.bloodFlowQbMlMin} mL/min &bull; Watson V: {state.totalBodyWaterWatsonLiters} L
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{state.clinicalGuidance}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                spKt/V: <strong className={state.singlePoolKtV >= 1.2 ? 'text-emerald-300' : 'text-rose-400'}>{state.singlePoolKtV}</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                eKt/V: <strong className="text-sky-300">{state.equilibratedKtV}</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                UFR: <strong className={state.ultrafiltrationRateMlKgHr > 13.0 ? 'text-rose-400' : 'text-emerald-300'}>{state.ultrafiltrationRateMlKgHr} mL/kg/h</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                nPCR: <strong className="text-amber-300">{state.normalizedProteinCatabolicRate} g/kg/d</strong>
              </span>
              {state.accessRecirculationPct > 0 && (
                <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                  AR: <strong className={state.accessRecirculationPct > 10 ? 'text-rose-400' : 'text-slate-300'}>{state.accessRecirculationPct}%</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('ukmClearance')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'ukmClearance'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Dynamic Urea Kinetics &amp; Rebound
          </button>
          <button
            onClick={() => setActiveTab('ultrafiltration')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'ultrafiltration'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            Ultrafiltration Rate &amp; Stunning
          </button>
          <button
            onClick={() => setActiveTab('accessRecirculation')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'accessRecirculation'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            Vascular Access Recirculation (AR%)
          </button>
          <button
            onClick={() => setActiveTab('kdoqiGuidelines')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'kdoqiGuidelines'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            KDOQI Adequacy &amp; Nutrition
          </button>
        </div>

        {/* TAB 1: Dynamic Urea Kinetics & Rebound */}
        {activeTab === 'ukmClearance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Prescription Controls Panel */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  Dialysis Machine Prescription
                </span>
                <span className="text-xs font-mono text-sky-400">Daugirdas 2nd Gen</span>
              </div>

              {/* Blood Flow Qb Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Blood Flow Rate (Qb)</span>
                  <span className="font-mono text-sky-400 font-bold">{params.prescription.bloodFlowQbMlMin} mL/min</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="500"
                  step="10"
                  value={params.prescription.bloodFlowQbMlMin}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      prescription: { ...prev.prescription, bloodFlowQbMlMin: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>150 (Catheter / Gentle)</span>
                  <span>350 - 450 (Standard)</span>
                  <span>500 (Max)</span>
                </div>
              </div>

              {/* Treatment Duration Hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Treatment Duration (Time)</span>
                  <span className="font-mono text-indigo-300 font-bold">{params.prescription.durationHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.5"
                  value={params.prescription.durationHours}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      prescription: { ...prev.prescription, durationHours: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2.0h (Induction)</span>
                  <span>4.0h (Standard HD)</span>
                  <span>8.0h (Nocturnal)</span>
                </div>
              </div>

              {/* Pre-BUN and Post-BUN Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Pre-BUN</span>
                    <span className="font-mono text-amber-300 font-bold">{params.patient.preDialysisBunMgDl} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="160"
                    step="5"
                    value={params.patient.preDialysisBunMgDl}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        patient: { ...prev.patient, preDialysisBunMgDl: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Post-BUN</span>
                    <span className="font-mono text-emerald-300 font-bold">{params.patient.postDialysisBunMgDl} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="2"
                    value={params.patient.postDialysisBunMgDl}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        patient: { ...prev.patient, postDialysisBunMgDl: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Dialyzer Specifications */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-medium">Dialyzer Characteristics</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    Model: <span className="text-slate-200">{params.prescription.dialyzer.modelName}</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    KoA Urea: <span className="text-sky-300">{params.prescription.dialyzer.koaUreaMlMin} mL/min</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    Surface Area: <span className="text-slate-200">{params.prescription.dialyzer.surfaceAreaM2} m&sup2;</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    In-Vivo Kd: <span className="text-indigo-300">{state.dialyzerClearanceKdMlMin} mL/min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Kinetic Graph */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Two-Pool Urea Disappearance &amp; Rebound Kinetics
                  </h3>
                  <p className="text-xs text-slate-400">
                    Intradialytic exponential clearance and 60-minute post-dialysis intracellular equilibration rebound
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 bg-cyan-400 rounded"></div>
                    <span className="text-cyan-300">Extracellular BUN</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 bg-amber-400 rounded"></div>
                    <span className="text-amber-300">Intracellular Urea</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative w-full h-80 bg-slate-950/60 rounded-xl border border-slate-800 p-2">
                <svg viewBox="0 0 600 280" className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 60, 120, 180, 240, 300].map((min) => {
                    const x = 50 + (min / 300) * 520;
                    return (
                      <g key={min}>
                        <line x1={x} y1="20" x2={x} y2="240" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                        <text x={x} y="258" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {min}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Y-axis (BUN mg/dL) */}
                  {[0, 40, 80, 120, 160].map((val) => {
                    const y = 240 - (val / 160) * 220;
                    return (
                      <g key={val}>
                        <line x1="50" y1={y} x2="570" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="42" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Rebound Phase (post-dialysis) */}
                  {(() => {
                    const totalDurMin = params.prescription.durationHours * 60;
                    const splitX = 50 + Math.min(520, (totalDurMin / 300) * 520);
                    return (
                      <g>
                        <rect
                          x={splitX}
                          y="20"
                          width={Math.max(0, 570 - splitX)}
                          height="220"
                          fill="#38bdf8"
                          fillOpacity="0.05"
                        />
                        <line x1={splitX} y1="20" x2={splitX} y2="240" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                        <text x={splitX + 6} y="35" fill="#38bdf8" fontSize="8" fontFamily="sans-serif">
                          Post-HD Rebound (30-60m)
                        </text>
                      </g>
                    );
                  })()}

                  {/* Polyline for Extracellular BUN */}
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    points={state.timeSeries
                      .map((pt) => {
                        const x = 50 + Math.min(520, (pt.minute / 300) * 520);
                        const y = 240 - Math.min(220, (pt.extracellularUreaMgDl / 160) * 220);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Polyline for Intracellular Urea */}
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    points={state.timeSeries
                      .map((pt) => {
                        const x = 50 + Math.min(520, (pt.minute / 300) * 520);
                        const y = 240 - Math.min(220, (pt.intracellularUreaMgDl / 160) * 220);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">spKt/V (Single-Pool)</div>
                  <div className="text-base font-bold font-mono text-cyan-300">{state.singlePoolKtV}</div>
                  <div className="text-[10px] text-slate-500">Target &ge; 1.4</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">eKt/V (Equilibrated)</div>
                  <div className="text-base font-bold font-mono text-indigo-300">{state.equilibratedKtV}</div>
                  <div className="text-[10px] text-slate-500">Target &ge; 1.2</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Post-HD Rebound</div>
                  <div className="text-base font-bold font-mono text-amber-300">
                    +{state.postDialysisReboundMgDl} mg/dL
                  </div>
                  <div className="text-[10px] text-slate-500">Intracellular Diffusion</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Nutritional nPCR</div>
                  <div className="text-base font-bold font-mono text-emerald-300">
                    {state.normalizedProteinCatabolicRate} g/kg/d
                  </div>
                  <div className="text-[10px] text-slate-500">Target 1.0 - 1.2</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Ultrafiltration Rate & Stunning */}
        {activeTab === 'ultrafiltration' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ultrafiltration Sliders */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Fluid Removal &amp; Weight Parameters
                </span>
                <span className="text-xs font-mono text-slate-400">UFR Solver</span>
              </div>

              {/* Pre-Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Pre-Dialysis Weight</span>
                  <span className="font-mono text-amber-300 font-bold">{params.patient.preWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="0.5"
                  value={params.patient.preWeightKg}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      patient: { ...prev.patient, preWeightKg: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Post-Weight (Target Dry Weight) Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Target Post-Dialysis Dry Weight</span>
                  <span className="font-mono text-emerald-300 font-bold">{params.patient.postWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="38"
                  max="135"
                  step="0.5"
                  value={params.patient.postWeightKg}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      patient: { ...prev.patient, postWeightKg: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Ultrafiltration Volume (UF):</span>
                  <span className="font-mono text-sky-400 font-bold">{state.ultrafiltrationVolumeLiters} Liters</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Interdialytic Weight Gain (% BW):</span>
                  <span className="font-mono text-slate-200 font-bold">
                    {((state.ultrafiltrationVolumeLiters / params.patient.postWeightKg) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Ultrafiltration Gauge & Myocardial Stunning Card */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Ultrafiltration Rate (UFR) &amp; Cardiovascular Risk Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Benchmarked against the KDOQI / Flythe landmark &gt; 13 mL/kg/h mortality inflection threshold
                </p>
              </div>

              {/* Giant UFR Bar */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Calculated Ultrafiltration Rate
                  </span>
                  <span className={`text-3xl font-bold font-mono ${
                    state.ultrafiltrationRateMlKgHr > 13.0 ? 'text-rose-400' : 'text-emerald-300'
                  }`}>
                    {state.ultrafiltrationRateMlKgHr} <span className="text-sm font-normal text-slate-400">mL/kg/h</span>
                  </span>
                </div>

                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      state.ultrafiltrationRateMlKgHr <= 10.0
                        ? 'bg-emerald-500'
                        : state.ultrafiltrationRateMlKgHr <= 13.0
                        ? 'bg-amber-500'
                        : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${Math.min(100, (state.ultrafiltrationRateMlKgHr / 20.0) * 100)}%` }}
                  ></div>
                  {/* Danger threshold line at 13 mL/kg/h (65% of 20) */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-400 shadow"
                    style={{ left: '65%' }}
                    title="13 mL/kg/h Safety Cutoff"
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0 mL/kg/h</span>
                  <span className="text-emerald-400">&le;10 (Safe)</span>
                  <span className="text-amber-400">10-13 (Caution)</span>
                  <span className="text-rose-400 font-bold">&gt;13 (High Risk)</span>
                  <span>20 mL/kg/h</span>
                </div>
              </div>

              {/* Clinical Significance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    Myocardial Stunning &amp; End-Organ Ischemia
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Rapid fluid removal exceeding vascular refilling capacity triggers transient left ventricular regional wall motion abnormalities (myocardial stunning), progressive cardiac fibrosis, and mesenteric ischemia.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Corrective Dialysis Strategies
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Extend treatment duration (e.g. 4.0h &rarr; 4.5h or nocturnal).</li>
                    <li>Add an extra ultrafiltration-only session (isolated UF).</li>
                    <li>Strict dietary sodium restriction (&lt; 2 g/day).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Vascular Access Recirculation (AR%) */}
        {activeTab === 'accessRecirculation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Bun Samples */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  Two-Needle Urea Recirculation Test
                </span>
                <span className="text-xs font-mono text-slate-400">Formula: (S-A)/(S-V)</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Vascular access recirculation occurs when dialyzed blood exiting the venous needle re-enters the arterial needle, diluting the arterial blood and drastically degrading true clearance.
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Systemic Peripheral BUN (S)</label>
                  <input
                    type="number"
                    value={params.patient.systemicPeripheralBunMgDl || 80}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        patient: { ...prev.patient, systemicPeripheralBunMgDl: parseFloat(e.target.value) || 1 },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-amber-300"
                  />
                  <span className="text-[10px] text-slate-500">Drawn from contralateral arm or slow-flow method.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Arterial Line Blood Urea (A)</label>
                  <input
                    type="number"
                    value={params.patient.arterialLineBunMgDl || 72}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        patient: { ...prev.patient, arterialLineBunMgDl: parseFloat(e.target.value) || 1 },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-sky-300"
                  />
                  <span className="text-[10px] text-slate-500">Blood entering the dialyzer.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Venous Line Blood Urea (V)</label>
                  <input
                    type="number"
                    value={params.patient.venousLineBunMgDl || 18}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        patient: { ...prev.patient, venousLineBunMgDl: parseFloat(e.target.value) || 1 },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300"
                  />
                  <span className="text-[10px] text-slate-500">Blood returning to the patient.</span>
                </div>
              </div>
            </div>

            {/* Recirculation Readout & Circuit Diagram */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Vascular Access Recirculation (AR%)</h3>
                  <p className="text-xs text-slate-400">Benchmark: AR &gt; 10% confirms needle reversal or significant fistula stenosis</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border font-mono font-bold text-lg ${
                  state.accessRecirculationPct > 10.0
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                    : 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                }`}>
                  AR: {state.accessRecirculationPct}%
                </div>
              </div>

              {/* Visual circuit representation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Access Recirculation Status:</span>
                  <span className={`font-bold ${state.accessRecirculationPct > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {state.accessRecirculationPct > 10 ? 'Pathological Recirculation (>10%)' : 'Physiological / Negligible'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-slate-200">Common Causes of Elevated AR%:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    <li><strong>Accidental Needle Reversal:</strong> Venous needle placed upstream or needles placed &lt; 2.5 cm apart.</li>
                    <li><strong>Venous Outflow Stenosis:</strong> High intra-access pressure forces blood backward into arterial needle.</li>
                    <li><strong>Inadequate Fistula Inflow:</strong> Fistula blood flow (Qa) &lt; dialyzer blood flow (Qb).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KDOQI Adequacy & Nutrition */}
        {activeTab === 'kdoqiGuidelines' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: KDOQI Criteria Summary */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                KDOQI Clinical Practice Guidelines for Hemodialysis Adequacy
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-sky-300">Minimum Delivered spKt/V &ge; 1.2:</strong> For thrice-weekly hemodialysis, the minimum delivered dose is spKt/V 1.2 per session (corresponding to a minimum URR of 65%). The target prescribed dose should be &ge; 1.4 to account for delivery variances.
                </li>
                <li className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-300">Equilibrated eKt/V Target &ge; 1.2:</strong> Double-pool equilibrated Kt/V accounts for 0.2 units of post-dialysis intracellular urea rebound in typical 4-hour sessions.
                </li>
                <li className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-amber-300">Nutritional nPCR Goal &ge; 1.0 - 1.2 g/kg/d:</strong> Normalized protein catabolic rate below 0.8 g/kg/day reflects inadequate dietary protein intake and heightened mortality risk.
                </li>
              </ul>
            </div>

            {/* Right: Disequilibrium Prevention Protocol */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Dialysis Disequilibrium Syndrome (DDS) Prevention Protocol
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Occurs in severely uremic patients (BUN &gt; 100–150 mg/dL) initiating hemodialysis. Rapid clearance drops plasma osmolality while brain idiogenic osmolytes (myo-inositol, taurine) clear slowly, drawing water into brain tissue and provoking headache, confusion, seizures, or uncal herniation.
                </p>
                <div className="p-3 bg-rose-900/40 rounded-lg border border-rose-700/50 text-xs text-rose-200/90 space-y-1">
                  <div className="font-bold">Initial Induction Rules:</div>
                  <div>1. Limit first session duration to <strong>2.0 hours</strong>.</div>
                  <div>2. Restrict blood flow rate (Qb) to <strong>150 - 200 mL/min</strong>.</div>
                  <div>3. Limit urea reduction to <strong>&lt; 30%</strong> (spKt/V &le; 0.6 - 0.8).</div>
                  <div>4. Consider IV Mannitol (1 g/kg) to maintain serum osmolality during session.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
