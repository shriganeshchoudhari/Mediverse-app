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
  Pill,
  Thermometer,
  Layers,
  Heart,
  Zap,
  Clock,
  Gauge,
  Sliders,
  Syringe,
  Brain,
  Wind,
} from 'lucide-react';
import {
  computeTciAnesthesiaState,
  TCI_PRESETS,
  TciInputParams,
  TciPresetId,
  TciAnesthesiaState,
  TciPropofolModel,
  TciTargetMode,
  AnesthesiaTechnique,
} from '@/.gemini/skills/TciAnesthesiaEngine';

const PRESET_KEYS: TciPresetId[] = [
  'STANDARD_ADULT_GENERAL_ANESTHESIA',
  'ELDERLY_FRAGILE_SCHNIDER',
  'NEUROANESTHESIA_BURST_SUPPRESSION',
  'BALANCED_VOLATILE_SEVOFLURANE_N2O',
  'PEDIATRIC_TCI_RAPID_INDUCTION',
  'INTRAOPERATIVE_AWARENESS_ALARM',
  'DELAYED_EMERGENCE_ACCUMULATION',
  'MALIGNANT_HYPERTHERMIA_TIVA_SWITCH',
];

export default function TciAnesthesiaSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<TciPresetId>(
    'STANDARD_ADULT_GENERAL_ANESTHESIA'
  );
  const [params, setParams] = useState<TciInputParams>(
    () => TCI_PRESETS.STANDARD_ADULT_GENERAL_ANESTHESIA.initialState
  );
  const [activeTab, setActiveTab] = useState<
    'infusionCurves' | 'volatileMac' | 'synergySurface' | 'emergenceGuidelines'
  >('infusionCurves');
  const [reportExported, setReportExported] = useState(false);

  // Compute live anesthesia state
  const state: TciAnesthesiaState = useMemo(() => {
    return computeTciAnesthesiaState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: TciPresetId) => {
    setSelectedPreset(presetId);
    setParams(TCI_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('STANDARD_ADULT_GENERAL_ANESTHESIA');
    setReportExported(false);
  };

  // Export Anesthesia Record
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Switch to Trigger-Free TIVA (MH Emergency)
  const handleTriggerFreeTivaSwitch = () => {
    setParams((prev) => ({
      ...prev,
      technique: 'TIVA_PROPOFOL_REMI',
      volatiles: {
        sevofluranePct: 0,
        desfluranePct: 0,
        isofluranePct: 0,
        nitrousOxidePct: 0,
      },
      tci: {
        ...prev.tci,
        propofolTargetCeUgMl: Math.max(3.5, prev.tci.propofolTargetCeUgMl),
        remifentanilTargetCeNgMl: Math.max(2.5, prev.tci.remifentanilTargetCeNgMl),
      },
    }));
  };

  // Helper color for BIS Badge
  const getBisBadgeColor = (bis: number) => {
    if (bis > 65) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (bis >= 40 && bis <= 60) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (bis >= 20 && bis < 40) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                  Target-Controlled Infusion (TCI) &amp; Volatile MAC Workstation
                </h1>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  Marsh &amp; Schnider Propofol PK/PD &bull; Minto Remifentanil &bull; Mapleson Age-Corrected MAC &bull; Emax BIS &amp; CSHT Predictor
                </p>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights & Quick Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`px-4 py-2 rounded-xl border font-mono text-center ${getBisBadgeColor(state.bisScore)}`}>
              <div className="text-[10px] uppercase font-sans tracking-wider opacity-80">Depth / BIS Index</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <span>{state.bisScore}</span>
                <span className="text-xs font-normal">
                  {state.bisScore > 65
                    ? 'Awareness Hazard'
                    : state.bisScore >= 40 && state.bisScore <= 60
                    ? 'Surgical Plane'
                    : state.bisScore >= 20
                    ? 'Deep Hypnosis'
                    : 'Burst Suppression'}
                </span>
              </div>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Export Anesthesia Simulation Record"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>{reportExported ? 'Record Logged!' : 'Export Record'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Reset to Standard Adult TIVA Baseline"
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
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Clinical Scenarios &amp; Pharmacokinetic Presets
            </span>
            <span className="text-[11px] text-slate-500">8 Validated Anesthetic Phenotypes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESET_KEYS.map((key) => {
              const preset = TCI_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium leading-snug line-clamp-2">{preset.title.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {key === 'ELDERLY_FRAGILE_SCHNIDER'
                      ? 'Geriatric Schnider'
                      : key === 'NEUROANESTHESIA_BURST_SUPPRESSION'
                      ? 'Burst Suppression'
                      : key === 'BALANCED_VOLATILE_SEVOFLURANE_N2O'
                      ? 'Sevo + N2O Volatile'
                      : key === 'INTRAOPERATIVE_AWARENESS_ALARM'
                      ? 'Awareness Alarm'
                      : key === 'MALIGNANT_HYPERTHERMIA_TIVA_SWITCH'
                      ? 'MH TIVA Switch'
                      : 'Clinical Preset'}
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
                    alarm.includes('AWARENESS') || alarm.includes('VASOPLEGIA') || alarm.includes('OVERDOSING')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : alarm.includes('BURST_SUPPRESSION') || alarm.includes('PROLONGED')
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
                <Info className="w-4 h-4 text-indigo-400" />
                Evidence-Based Anesthetic Guidance
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {params.demographics.ageYears}yo &bull; {params.demographics.sex} &bull; LBM: {state.leanBodyMassKg} kg &bull; BMI: {state.bodyMassIndex}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{state.clinicalGuidance}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Mode: <strong className="text-slate-200">{params.technique.replace(/_/g, ' ')}</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Model: <strong className="text-slate-200">{params.tci.propofolModel}</strong> ({params.tci.targetMode.replace(/_/g, ' ')})
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                CSHT: <strong className="text-sky-300">{state.contextSensitiveHalfTimeMinutes} min</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Predicted Emergence: <strong className="text-amber-300">{state.predictedTimeToAwakenMinutes} min</strong>
              </span>
              {state.burstSuppressionRatioPct > 0 && (
                <span className="bg-purple-950/60 px-2 py-0.5 rounded border border-purple-700/50 text-purple-300">
                  BSR: <strong>{state.burstSuppressionRatioPct}%</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('infusionCurves')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'infusionCurves'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Live TCI Infusion Curves &amp; BIS
          </button>
          <button
            onClick={() => setActiveTab('volatileMac')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'volatileMac'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4" />
            Volatile Agents &amp; Age-Corrected MAC
          </button>
          <button
            onClick={() => setActiveTab('synergySurface')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'synergySurface'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            Hypnotic-Opioid Synergy Isobologram
          </button>
          <button
            onClick={() => setActiveTab('emergenceGuidelines')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'emergenceGuidelines'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Context-Sensitive Emergence &amp; Protocols
          </button>
        </div>

        {/* TAB 1: Live TCI Infusion Curves & BIS Depth */}
        {activeTab === 'infusionCurves' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Infusion Controls Panel */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  TIVA / TCI Pump Controls
                </span>
                <span className="text-xs font-mono text-slate-400">Marsh / Schnider</span>
              </div>

              {/* Technique Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Anesthetic Technique</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['TIVA_PROPOFOL_REMI', 'BALANCED_VOLATILE', 'COMBINED_TIVA_VOLATILE'] as AnesthesiaTechnique[]).map(
                    (tech) => (
                      <button
                        key={tech}
                        onClick={() => setParams((prev) => ({ ...prev, technique: tech }))}
                        className={`p-1.5 rounded-lg border text-center transition ${
                          params.technique === tech
                            ? 'bg-indigo-600 border-indigo-400 text-white font-medium'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tech === 'TIVA_PROPOFOL_REMI'
                          ? 'TIVA Only'
                          : tech === 'BALANCED_VOLATILE'
                          ? 'Volatile'
                          : 'Combined'}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Model & Target Mode Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Propofol Model</label>
                  <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
                    {(['MARSH', 'SCHNIDER'] as TciPropofolModel[]).map((m) => (
                      <button
                        key={m}
                        onClick={() =>
                          setParams((prev) => ({
                            ...prev,
                            tci: { ...prev.tci, propofolModel: m },
                          }))
                        }
                        className={`flex-1 py-1 text-xs rounded-md transition ${
                          params.tci.propofolModel === m
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Target Mode</label>
                  <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
                    {(['EFFECT_SITE_CE', 'PLASMA_CP'] as TciTargetMode[]).map((tm) => (
                      <button
                        key={tm}
                        onClick={() =>
                          setParams((prev) => ({
                            ...prev,
                            tci: { ...prev.tci, targetMode: tm },
                          }))
                        }
                        className={`flex-1 py-1 text-xs rounded-md transition ${
                          params.tci.targetMode === tm
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tm === 'EFFECT_SITE_CE' ? 'Ce Site' : 'Cp Plasma'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Propofol Target Ce Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-cyan-400" />
                    Propofol Target Ce
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{params.tci.propofolTargetCeUgMl} &mu;g/mL</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="8.0"
                  step="0.1"
                  value={params.tci.propofolTargetCeUgMl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      tci: { ...prev.tci, propofolTargetCeUgMl: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.0 (Sedation)</span>
                  <span>3.0 - 4.5 (Surgery)</span>
                  <span>8.0 (Burst Supp.)</span>
                </div>
              </div>

              {/* Remifentanil Target Ce Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-amber-400" />
                    Remifentanil Target Ce
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {params.tci.remifentanilTargetCeNgMl} ng/mL
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="10.0"
                  step="0.2"
                  value={params.tci.remifentanilTargetCeNgMl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      tci: { ...prev.tci, remifentanilTargetCeNgMl: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.0 (None)</span>
                  <span>2.0 - 4.0 (Maintenance)</span>
                  <span>10.0 (High Stimulus)</span>
                </div>
              </div>

              {/* Elapsed Infusion Time Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Elapsed Infusion Duration
                  </span>
                  <span className="font-mono text-sky-400 font-bold">{params.tci.elapsedMinutes} min</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="240"
                  step="5"
                  value={params.tci.elapsedMinutes}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      tci: { ...prev.tci, elapsedMinutes: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 min (Induction)</span>
                  <span>60 min</span>
                  <span>240 min (Fat Saturation)</span>
                </div>
              </div>

              {/* Demographics Summary */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="text-slate-400 font-medium">Patient Morphometry</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    Weight: <span className="text-slate-200">{params.demographics.weightKg} kg</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    Height: <span className="text-slate-200">{params.demographics.heightCm} cm</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    LBM (James): <span className="text-indigo-300">{state.leanBodyMassKg} kg</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    BMI: <span className="text-indigo-300">{state.bodyMassIndex} kg/m&sup2;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive SVG PK/PD Chart */}
            <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    3-Compartment Dynamic Concentration &amp; BIS Trajectory
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ce vs Cp hysteresis, ke0 effect-site equilibration, and electrocortical depth
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-sky-400 border-b border-dashed border-sky-400"></div>
                    <span className="text-sky-300">Cp Plasma</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 bg-cyan-400 rounded"></div>
                    <span className="text-cyan-300">Ce Effect-site</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 bg-amber-400 rounded"></div>
                    <span className="text-amber-300">Remi Ce</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 bg-emerald-400 rounded"></div>
                    <span className="text-emerald-300">BIS Index</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG Viewbox */}
              <div className="relative w-full h-80 bg-slate-950/60 rounded-xl border border-slate-800 p-2">
                <svg viewBox="0 0 600 280" className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 15, 30, 45, 60].map((min) => {
                    const x = 50 + (min / 60) * 520;
                    return (
                      <g key={min}>
                        <line x1={x} y1="20" x2={x} y2="240" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                        <text x={x} y="258" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {min}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Y-axis: BIS / Concentrations */}
                  {[0, 20, 40, 60, 80, 100].map((val) => {
                    const y = 240 - (val / 100) * 220;
                    return (
                      <g key={val}>
                        <line x1="50" y1={y} x2="570" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="42" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Optimal Surgical BIS Band (40 to 60) Shaded */}
                  <rect
                    x="50"
                    y={240 - (60 / 100) * 220}
                    width="520"
                    height={(20 / 100) * 220}
                    fill="#10b981"
                    fillOpacity="0.08"
                    stroke="#10b981"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  <text x="565" y={240 - (50 / 100) * 220} fill="#10b981" fontSize="9" textAnchor="end" fontFamily="sans-serif">
                    Optimal BIS (40 - 60)
                  </text>

                  {/* Burst Suppression Threshold (BIS < 30) */}
                  <line
                    x1="50"
                    y1={240 - (30 / 100) * 220}
                    x2="570"
                    y2={240 - (30 / 100) * 220}
                    stroke="#a855f7"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text x="565" y={240 - (28 / 100) * 220} fill="#a855f7" fontSize="8" textAnchor="end">
                    Burst Suppression (&lt;30)
                  </text>

                  {/* Draw Polyline for Propofol Cp (Plasma) */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    points={state.timeSeries
                      .map((pt) => {
                        const x = 50 + (pt.minute / 60) * 520;
                        // Map 0 - 8 ug/mL to 0 - 220 height
                        const y = 240 - Math.min(220, (pt.propofolCpUgMl / 8.0) * 220);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Draw Polyline for Propofol Ce (Effect-site) */}
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    points={state.timeSeries
                      .map((pt) => {
                        const x = 50 + (pt.minute / 60) * 520;
                        const y = 240 - Math.min(220, (pt.propofolCeUgMl / 8.0) * 220);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Draw Polyline for Remifentanil Ce (0 - 10 ng/mL) */}
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    points={state.timeSeries
                      .map((pt) => {
                        const x = 50 + (pt.minute / 60) * 520;
                        const y = 240 - Math.min(220, (pt.remiCeNgMl / 10.0) * 220);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Draw Polyline for BIS Index (0 - 100) */}
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                    points={state.timeSeries
                      .map((pt) => {
                        const x = 50 + (pt.minute / 60) * 520;
                        const y = 240 - (pt.bisScore / 100) * 220;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Point Dots on BIS */}
                  {state.timeSeries.map((pt, idx) => {
                    const x = 50 + (pt.minute / 60) * 520;
                    const yBis = 240 - (pt.bisScore / 100) * 220;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={yBis}
                        r="3"
                        fill="#34d399"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Live Status Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Propofol Ce / Cp</div>
                  <div className="text-base font-bold font-mono text-cyan-300">
                    {state.propofolCurrentCeUgMl} / {state.propofolCurrentCpUgMl} &mu;g/mL
                  </div>
                  <div className="text-[10px] text-slate-500">Brain / Blood Ratio</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Remifentanil Ce</div>
                  <div className="text-base font-bold font-mono text-amber-300">
                    {state.remifentanilCurrentCeNgMl} ng/mL
                  </div>
                  <div className="text-[10px] text-slate-500">&mu;-Opioid Receptor Sat.</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Predicted Awaken Time</div>
                  <div className="text-base font-bold font-mono text-sky-300">
                    ~{state.predictedTimeToAwakenMinutes} min
                  </div>
                  <div className="text-[10px] text-slate-500">Threshold: Ce &lt; 1.2 &mu;g/mL</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Synergy Index</div>
                  <div className="text-base font-bold font-mono text-indigo-300">
                    {state.hypnoticOpioidSynergyScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">Greco Response Surface</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Volatile Agents & Age-Corrected MAC */}
        {activeTab === 'volatileMac' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Volatile Inhalational Gas Controls */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Wind className="w-4 h-4 text-sky-400" />
                  Vaporizer Dial Concentrations
                </span>
                <span className="text-xs font-mono text-slate-400">Mapleson Age Decay</span>
              </div>

              {/* Patient Age Slider (Crucial for MAC) */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Patient Age (Years)</span>
                  <span className="font-mono text-indigo-300 font-bold">{params.demographics.ageYears} yrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={params.demographics.ageYears}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      demographics: { ...prev.demographics, ageYears: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 leading-tight">
                  Mapleson age equation: MAC declines by ~6% per decade above age 40 due to neuronal density and cerebral metabolic rate reduction.
                </div>
              </div>

              {/* Sevoflurane Slider (MAC40 = 2.0%) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Sevoflurane (Yellow)</span>
                  <span className="font-mono text-amber-300 font-bold">{params.volatiles.sevofluranePct}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="8.0"
                  step="0.1"
                  value={params.volatiles.sevofluranePct}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      volatiles: { ...prev.volatiles, sevofluranePct: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0%</span>
                  <span>1.8% (1.0 MAC40)</span>
                  <span>8.0% (Induction)</span>
                </div>
              </div>

              {/* Desflurane Slider (MAC40 = 6.0%) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Desflurane (Blue)</span>
                  <span className="font-mono text-blue-400 font-bold">{params.volatiles.desfluranePct}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="18.0"
                  step="0.2"
                  value={params.volatiles.desfluranePct}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      volatiles: { ...prev.volatiles, desfluranePct: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-blue-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0%</span>
                  <span>6.0% (1.0 MAC40)</span>
                  <span>18.0% (Max)</span>
                </div>
              </div>

              {/* Isoflurane Slider (MAC40 = 1.15%) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Isoflurane (Purple)</span>
                  <span className="font-mono text-purple-400 font-bold">{params.volatiles.isofluranePct}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.05"
                  value={params.volatiles.isofluranePct}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      volatiles: { ...prev.volatiles, isofluranePct: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-purple-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Nitrous Oxide N2O (MAC40 = 104%) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Nitrous Oxide (N&sub2;O)</span>
                  <span className="font-mono text-teal-400 font-bold">{params.volatiles.nitrousOxidePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={params.volatiles.nitrousOxidePct}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      volatiles: { ...prev.volatiles, nitrousOxidePct: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0% (Air/O2)</span>
                  <span>50% (Second Gas Effect)</span>
                  <span>70% (Hypoxic Limit)</span>
                </div>
              </div>
            </div>

            {/* Total MAC Bar & Biophysical Readout */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Additive Inhalational Minimum Alveolar Concentration (MAC)
                </h3>
                <p className="text-xs text-slate-400">
                  Age-corrected for {params.demographics.ageYears}-year-old using Mapleson&apos;s formula
                </p>
              </div>

              {/* Giant MAC Gauge Bar */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Inhalational MAC
                  </span>
                  <span className="text-3xl font-bold font-mono text-indigo-300">
                    {state.totalAgeCorrectedMac} <span className="text-sm font-normal text-slate-400">MAC</span>
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      state.totalAgeCorrectedMac < 0.5
                        ? 'bg-rose-500'
                        : state.totalAgeCorrectedMac <= 1.3
                        ? 'bg-emerald-500'
                        : state.totalAgeCorrectedMac <= 1.8
                        ? 'bg-amber-500'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(100, (state.totalAgeCorrectedMac / 2.0) * 100)}%` }}
                  ></div>
                  {/* Reference line for 1.0 MAC */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow"
                    style={{ left: '50%' }}
                    title="1.0 MAC (Surgical Immobility in 50%)"
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0.0 MAC</span>
                  <span>MAC-Awake (~0.35)</span>
                  <span className="text-slate-300 font-semibold">1.0 MAC</span>
                  <span>MAC-BAR (~1.5)</span>
                  <span>2.0 MAC</span>
                </div>
              </div>

              {/* Threshold Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    MAC-Awake
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-300">{state.macAwake} MAC</div>
                  <div className="text-[11px] text-slate-400">
                    Concentration at which 50% of patients open eyes to command upon emergence.
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    1.0 MAC (ED50)
                  </div>
                  <div className="text-lg font-mono font-bold text-indigo-300">
                    {state.totalAgeCorrectedMac >= 1.0 ? 'Achieved' : 'Subtherapeutic'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Prevents gross purposeful skeletal movement in response to skin incision.
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    MAC-BAR
                  </div>
                  <div className="text-lg font-mono font-bold text-amber-300">{state.macBar} MAC</div>
                  <div className="text-[11px] text-slate-400">
                    Blocks autonomic adrenergic surge and hypertensive reflex to intubation.
                  </div>
                </div>
              </div>

              {/* Malignant Hyperthermia Quick Action Alert */}
              <div className="bg-rose-950/30 border border-rose-800/50 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Malignant Hyperthermia (MH) Trigger Hazard
                  </div>
                  <div className="text-xs text-rose-200/80">
                    All halogenated volatile agents are potent trigger agents in patients with RYR1 / CACNA1S mutations.
                  </div>
                </div>
                <button
                  onClick={handleTriggerFreeTivaSwitch}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shrink-0 transition"
                >
                  Emergency TIVA Switch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Hypnotic-Opioid Synergy & Isobologram */}
        {activeTab === 'synergySurface' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left explanation and values */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  Greco Response Surface Synergy
                </span>
                <span className="text-xs font-mono text-slate-400">Minto 2000 Model</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Propofol (GABA<sub>A</sub> agonist) and Remifentanil (&mu;-opioid agonist) exhibit dramatic supra-additive (synergistic) interaction. Co-administration shifts the Propofol concentration-effect curve to the left, cutting required hypnotic dose by up to 60% and preventing hemodynamic depression.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Live Operating Point Coordinates</div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Propofol Ce (X-axis)</span>
                    <span className="text-cyan-400 font-bold text-base">{state.propofolCurrentCeUgMl} &mu;g/mL</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Remifentanil Ce (Y-axis)</span>
                    <span className="text-amber-400 font-bold text-base">{state.remifentanilCurrentCeNgMl} ng/mL</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Synergy Score:</span>
                  <span className="font-mono text-indigo-300 font-bold text-base">
                    {state.hypnoticOpioidSynergyScore} / 100
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="font-semibold text-slate-300">Clinical Pearls:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                  <li>Adding 2 ng/mL Remifentanil reduces Propofol Ce required for surgical tolerance from 6.0 to 2.8 &mu;g/mL.</li>
                  <li>In elderly patients, synergy prevents excessive peripheral vasodilation and cardiac output reduction.</li>
                  <li>Cease Remifentanil 10 minutes prior to end of surgery only if long-acting analgesia (e.g. Fentanyl or regional block) is established.</li>
                </ul>
              </div>
            </div>

            {/* Right Isobologram 2D Visual */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">2D Pharmacodynamic Isobologram</h3>
                <p className="text-xs text-slate-400">
                  Isoboles for 50% probability of Loss of Consciousness (LOC) and Blunting Hemodynamic Response (LOM)
                </p>
              </div>

              <div className="relative w-full h-80 bg-slate-950/60 rounded-xl border border-slate-800 p-2">
                <svg viewBox="0 0 500 300" className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 2, 4, 6, 8].map((propVal) => {
                    const x = 50 + (propVal / 8) * 420;
                    return (
                      <g key={propVal}>
                        <line x1={x} y1="20" x2={x} y2="250" stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y="268" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {propVal}
                        </text>
                      </g>
                    );
                  })}

                  {[0, 2, 4, 6, 8, 10].map((remiVal) => {
                    const y = 250 - (remiVal / 10) * 230;
                    return (
                      <g key={remiVal}>
                        <line x1="50" y1={y} x2="470" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="42" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                          {remiVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Titles */}
                  <text x="260" y="290" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
                    Propofol Effect-Site Ce (&mu;g/mL)
                  </text>
                  <text
                    x="15"
                    y="140"
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    transform="rotate(-90 15 140)"
                  >
                    Remifentanil Ce (ng/mL)
                  </text>

                  {/* Additive Line of Non-Synergy (Dashed diagonal) */}
                  <line x1="50" y1={250 - 230} x2="470" y2="250" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="350" y="80" fill="#475569" fontSize="9" textAnchor="middle">
                    Pure Additive Line
                  </text>

                  {/* Isobole 1: LOC 50% (Loss of Consciousness) */}
                  <path
                    d="M 50 210 Q 140 230, 210 250"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="130" y="222" fill="#38bdf8" fontSize="9">
                    LOC 50%
                  </text>

                  {/* Isobole 2: LOM 50% (Tolerance to Incision) */}
                  <path
                    d="M 50 80 Q 180 180, 420 250"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                  />
                  <text x="260" y="170" fill="#a855f7" fontSize="10" fontWeight="bold">
                    Surgical Tolerance 50%
                  </text>

                  {/* Shaded Surgical Plane Region */}
                  <path
                    d="M 50 80 Q 180 180, 420 250 L 470 250 L 470 20 L 50 20 Z"
                    fill="#a855f7"
                    fillOpacity="0.06"
                  />

                  {/* Current Patient Operating Coordinate Point */}
                  {(() => {
                    const cx = 50 + Math.min(420, (state.propofolCurrentCeUgMl / 8) * 420);
                    const cy = 250 - Math.min(230, (state.remifentanilCurrentCeNgMl / 10) * 230);
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r="10" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                        <circle cx={cx} cy={cy} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx + 10} y={cy - 8} fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                          Current Patient ({state.propofolCurrentCeUgMl}, {state.remifentanilCurrentCeNgMl})
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span>Supra-additive isobologram geometry indicates significant dose-sparing.</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  Opioid-sparing effect: ~{Math.min(65, Math.round(state.propofolCurrentCeUgMl * 12))}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Context-Sensitive Emergence & Protocols */}
        {activeTab === 'emergenceGuidelines' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: CSHT Concept & Visualization */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Context-Sensitive Half-Time (CSHT)
                </span>
                <span className="text-xs font-mono text-slate-400">Hughes &amp; Shafer Curve</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Context-Sensitive Half-Time is the time required for plasma drug concentration to decline by 50% after stopping an infusion of a specified duration (&quot;context&quot;). Remifentanil boasts an organ-independent elimination via blood esterases with a flat ~3.5 min CSHT regardless of infusion time, whereas Propofol accumulates in peripheral adipose compartments.
              </p>

              {/* CSHT Comparative Chart SVG */}
              <div className="relative w-full h-64 bg-slate-950/60 rounded-xl border border-slate-800 p-2">
                <svg viewBox="0 0 500 240" className="w-full h-full">
                  {/* Grid Lines */}
                  {[0, 60, 120, 180, 240, 300].map((dur) => {
                    const x = 50 + (dur / 300) * 420;
                    return (
                      <g key={dur}>
                        <line x1={x} y1="20" x2={x} y2="200" stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y="218" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          {dur}m
                        </text>
                      </g>
                    );
                  })}

                  {[0, 20, 40, 60, 80, 100].map((tHalf) => {
                    const y = 200 - (tHalf / 100) * 180;
                    return (
                      <g key={tHalf}>
                        <line x1="50" y1={y} x2="470" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="42" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                          {tHalf}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Fentanyl Curve (Steep accumulation) */}
                  <path
                    d="M 50 185 Q 120 150, 200 80 T 470 25"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="460" y="38" fill="#ef4444" fontSize="9" textAnchor="end">
                    Fentanyl (Steep Saturation)
                  </text>

                  {/* Propofol Curve (Moderate gradual curve) */}
                  <path
                    d="M 50 180 Q 180 160, 300 135 T 470 120"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  <text x="460" y="115" fill="#38bdf8" fontSize="9" textAnchor="end">
                    Propofol (CSHT ~35m at 4h)
                  </text>

                  {/* Remifentanil Flat Line (~3.5 min) */}
                  <line x1="50" y1={200 - (3.5 / 100) * 180} x2="470" y2={200 - (3.5 / 100) * 180} stroke="#fbbf24" strokeWidth="2.5" />
                  <text x="460" y="190" fill="#fbbf24" fontSize="9" textAnchor="end">
                    Remifentanil (Flat 3.5m)
                  </text>

                  {/* Current Patient Propofol Point */}
                  {(() => {
                    const x = 50 + (params.tci.elapsedMinutes / 300) * 420;
                    const y = 200 - (state.contextSensitiveHalfTimeMinutes / 100) * 180;
                    return (
                      <circle cx={x} cy={y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                    );
                  })()}
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Propofol CSHT</div>
                  <div className="text-base font-bold text-sky-300">{state.contextSensitiveHalfTimeMinutes} min</div>
                  <div className="text-[10px] text-slate-500">After {params.tci.elapsedMinutes}m infusion</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Remifentanil CSHT</div>
                  <div className="text-base font-bold text-amber-300">3.5 min</div>
                  <div className="text-[10px] text-slate-500">Esterase non-saturable</div>
                </div>
              </div>
            </div>

            {/* Right: Emergency & Safety Checklists */}
            <div className="lg:col-span-6 space-y-4">
              {/* Intraoperative Awareness Prevention */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  Intraoperative Awareness Prevention Protocol (ASA / AAGBI)
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Processed EEG Monitoring:</strong> Maintain BIS between 40 and 60 whenever neuromuscular blockade is administered during TIVA.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>IV Line Visibility:</strong> Dedicated, non-refluxing anti-siphon valve infusion line must remain visually inspected to prevent interstitial pooling.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Titration on Incision:</strong> Increase Propofol target Ce by 0.5–1.0 &mu;g/mL prior to intense nociceptive stimulus (e.g. sternotomy or trochar insertion).
                    </span>
                  </li>
                </ul>
              </div>

              {/* Malignant Hyperthermia Protocol */}
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Malignant Hyperthermia (MHAUS) Immediate Action Plan
                </div>
                <div className="space-y-2 text-xs text-rose-200/90">
                  <div className="p-2.5 rounded-lg bg-rose-900/40 border border-rose-700/50">
                    <strong>1. Stop All Trigger Agents:</strong> Turn off volatile vaporizers immediately. Hyperventilate with 100% O<sub>2</sub> at maximum fresh gas flow (&ge;10 L/min).
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-900/40 border border-rose-700/50">
                    <strong>2. Administer Dantrolene:</strong> Give 2.5 mg/kg IV push immediately; repeat up to 10 mg/kg until rigidity and hypercapnia abate.
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-900/40 border border-rose-700/50">
                    <strong>3. Active Cooling &amp; Bicarbonate:</strong> Cold IV saline, iced gastric lavage, treat acidosis with NaHCO<sub>3</sub> (1–2 mEq/kg).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
