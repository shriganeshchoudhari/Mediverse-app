'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Flame,
  Droplets,
  RotateCcw,
  FileText,
  Sparkles,
  Layers,
  Heart,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Info,
  Beaker,
} from 'lucide-react';
import {
  computeEndocrineClampState,
  calculateGirFromInfusion,
  ENDOCRINE_PRESETS,
  ClampInputParams,
  EndocrinePresetId,
  EndocrineClampState,
} from '@/.gemini/skills/EndocrineClampEngine';

const PRESET_KEYS: EndocrinePresetId[] = [
  'LEAN_HEALTHY_INSULIN_SENSITIVE',
  'METABOLIC_SYNDROME_INSULIN_RESISTANT',
  'TYPE_2_DIABETES_BETA_CELL_FAILURE',
  'ATHLETE_SUPRA_SENSITIVE',
  'TYPE_1_DIABETES_ABSOLUTE_DEFICIENCY',
  'SEVERE_ACUTE_DKA_PROTOCOL',
  'INSULINOMA_HYPOGLYCEMIC_CRISIS',
  'PCOS_HYPERANDROGENIC_RESISTANCE',
];

export default function EndocrineClampSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<EndocrinePresetId>(
    'LEAN_HEALTHY_INSULIN_SENSITIVE'
  );
  const [params, setParams] = useState<ClampInputParams>(
    () => ENDOCRINE_PRESETS.LEAN_HEALTHY_INSULIN_SENSITIVE.initialState
  );
  const [activeTab, setActiveTab] = useState<'clampCurves' | 'homaMinimal' | 'dkaProtocol' | 'guidelines'>(
    'clampCurves'
  );
  const [reportExported, setReportExported] = useState(false);

  // Computed state
  const state: EndocrineClampState = useMemo(() => {
    return computeEndocrineClampState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: EndocrinePresetId) => {
    setSelectedPreset(presetId);
    setParams(ENDOCRINE_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('LEAN_HEALTHY_INSULIN_SENSITIVE');
    setReportExported(false);
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Dextrose pump change handler
  const handleDextroseRateChange = (newRateMlHr: number) => {
    const newGir = calculateGirFromInfusion(newRateMlHr, params.dextroseConcentrationPct, params.patient.weightKg);
    setParams((prev) => {
      const updatedSeries = [...prev.timeSeries];
      if (updatedSeries.length > 0) {
        const lastIdx = updatedSeries.length - 1;
        updatedSeries[lastIdx] = {
          ...updatedSeries[lastIdx],
          girMgKgMin: newGir,
        };
      }
      return {
        ...prev,
        dextroseInfusionRateMlHr: newRateMlHr,
        timeSeries: updatedSeries,
      };
    });
  };

  // SVG Chart coordinate mappings (Minutes 0 to 120 -> X 50 to 450)
  const minuteToX = (min: number) => 50 + (min / 120) * 400;
  // Glucose 0 to 200 mg/dL -> Y 260 to 30
  const glucoseToY = (g: number) => 260 - (Math.min(200, Math.max(0, g)) / 200) * 230;
  // GIR 0 to 16 mg/kg/min -> Y 260 to 30
  const girToY = (gir: number) => 260 - (Math.min(16, Math.max(0, gir)) / 16) * 230;

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              Endocrinology &amp; Metabolic Dynamics Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Hyperinsulinemic Glucose Clamp &amp; HOMA2 Precision Solver
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              DeFronzo gold-standard hyperinsulinemic-euglycemic clamp dynamics, whole-body glucose disposal (M value),
              HOMA2-IR / HOMA2-&beta; indices, and DKA two-bag dextrose-insulin transition protocols.
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-amber-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              {reportExported ? 'Report Generated!' : 'Export Clamp Consultation'}
            </button>
          </div>
        </div>

        {/* Status & Active Alarms Banner */}
        <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Insulin Sensitivity Phenotype:</span>
            <span className="text-sm font-bold text-white px-2.5 py-0.5 rounded bg-amber-950 border border-amber-700">
              {state.insulinResistanceGrade.replace(/_/g, ' ')}
            </span>
            <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Steady-State M: <strong className="text-amber-300">{state.steadyStateMValue}</strong> mg/kg/min
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {state.activeAlarms.map((alarm) => {
              const isLifeThreat =
                alarm === 'HYPOGLYCEMIA_CRITICAL_BELOW_70' ||
                alarm === 'SEVERE_HIGH_ANION_GAP_KETOACIDOSIS' ||
                alarm === 'CRITICAL_HYPOKALEMIA_HOLD_INSULIN';
              return (
                <span
                  key={alarm}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isLifeThreat
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse'
                      : alarm === 'OPTIMAL_CLAMP_EQUILIBRIUM'
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
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Endocrine &amp; Metabolic Clamp Scenarios:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESET_KEYS.map((key) => {
            const preset = ENDOCRINE_PRESETS[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950'
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
          onClick={() => setActiveTab('clampCurves')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'clampCurves'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Clamp Dynamics &amp; Infusion Curves
        </button>
        <button
          onClick={() => setActiveTab('homaMinimal')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'homaMinimal'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          HOMA2, QUICKI &amp; Minimal Model Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('dkaProtocol')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'dkaProtocol'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          DKA / HHS Resuscitation Protocol &amp; Anion Gap
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'guidelines'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          Guidelines &amp; DeFronzo Ominous Octet
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'clampCurves' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Dynamic SVG Clamp Graph */}
            <div className="lg:col-span-7 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  DeFronzo Clamp Kinetics: Glucose &amp; GIR Trajectory
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan-400 font-bold">── Glucose (mg/dL)</span>
                  <span className="text-amber-400 font-bold">── GIR (mg/kg/min)</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-hidden">
                <svg viewBox="0 0 480 290" className="w-full h-full select-none">
                  {/* Euglycemia Target Shaded Zone (90-100 mg/dL) */}
                  <rect
                    x="50"
                    y={glucoseToY(100)}
                    width="400"
                    height={glucoseToY(90) - glucoseToY(100)}
                    fill="#10b981"
                    opacity="0.12"
                  />
                  <line
                    x1="50"
                    y1={glucoseToY(params.targetGlucoseMgDl)}
                    x2="450"
                    y2={glucoseToY(params.targetGlucoseMgDl)}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />

                  {/* Grid Lines - Time (0, 30, 60, 90, 120 min) */}
                  {[0, 30, 60, 90, 120].map((min) => {
                    const x = minuteToX(min);
                    return (
                      <g key={`min-${min}`}>
                        <line x1={x} y1="30" x2={x} y2="260" stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y="278" fill="#64748b" fontSize="10" textAnchor="middle">
                          {min}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Left Y-Axis Grid (Glucose 0, 50, 100, 150, 200 mg/dL) */}
                  {[0, 50, 100, 150, 200].map((g) => {
                    const y = glucoseToY(g);
                    return (
                      <g key={`g-${g}`}>
                        <line x1="50" y1={y} x2="450" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="44" y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">
                          {g}
                        </text>
                      </g>
                    );
                  })}

                  {/* Right Y-Axis Grid (GIR 0, 4, 8, 12, 16 mg/kg/min) */}
                  {[0, 4, 8, 12, 16].map((gir) => {
                    const y = girToY(gir);
                    return (
                      <g key={`gir-${gir}`}>
                        <text x="456" y={y + 3} fill="#f59e0b" fontSize="9" textAnchor="start">
                          {gir}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Title Indicators */}
                  <text x="14" y="145" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 14 145)">
                    Glucose (mg/dL)
                  </text>
                  <text x="475" y="145" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(90 475 145)">
                    GIR (mg/kg/min)
                  </text>

                  {/* Glucose Curve Polyline */}
                  {params.timeSeries.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      points={params.timeSeries
                        .map((pt) => `${minuteToX(pt.minute)},${glucoseToY(pt.glucoseMgDl)}`)
                        .join(' ')}
                    />
                  )}

                  {/* GIR Curve Polyline */}
                  {params.timeSeries.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      points={params.timeSeries
                        .map((pt) => `${minuteToX(pt.minute)},${girToY(pt.girMgKgMin)}`)
                        .join(' ')}
                    />
                  )}

                  {/* Time Series Datapoints */}
                  {params.timeSeries.map((pt) => (
                    <g key={`pt-${pt.minute}`}>
                      <circle cx={minuteToX(pt.minute)} cy={glucoseToY(pt.glucoseMgDl)} r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                      <circle cx={minuteToX(pt.minute)} cy={girToY(pt.girMgKgMin)} r="4" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Clamp Control Sliders */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Target Glucose:</span>
                    <span className="font-mono text-emerald-400">{params.targetGlucoseMgDl} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="160"
                    step="5"
                    value={params.targetGlucoseMgDl}
                    onChange={(e) => setParams((p) => ({ ...p, targetGlucoseMgDl: Number(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Insulin Infusion:</span>
                    <span className="font-mono text-purple-400">{params.insulinInfusionRateMuKgMin} mU/kg/min</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="3.0"
                    step="0.1"
                    value={params.insulinInfusionRateMuKgMin}
                    onChange={(e) => setParams((p) => ({ ...p, insulinInfusionRateMuKgMin: Number(e.target.value) }))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>D20W Infusion Rate:</span>
                    <span className="font-mono text-amber-400">{params.dextroseInfusionRateMlHr} mL/hr</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="350"
                    step="5"
                    value={params.dextroseInfusionRateMlHr}
                    onChange={(e) => handleDextroseRateChange(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right: DeFronzo Metrics & Whole-Body Clearance Dashboard */}
            <div className="lg:col-span-5 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Whole-Body Glucose Disposal Metrics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Steady-State M-Value</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{state.steadyStateMValue}</span>
                  <span className="text-[10px] text-slate-500 block">mg/kg/min (Normal &ge; 7.5)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Metabolic Clearance (MCRg)</span>
                  <span className="text-lg font-bold font-mono text-sky-400">{state.metabolicClearanceRateGlucose}</span>
                  <span className="text-[10px] text-slate-500 block">mL/kg/min (M / Glucose * 100)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Insulin Sensitivity (M/I)</span>
                  <span className="text-lg font-bold font-mono text-purple-400">{state.insulinSensitivityIndexMI}</span>
                  <span className="text-[10px] text-slate-500 block">(mg/kg/min)/(uU/mL) * 100</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Hepatic EGP Suppression</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{state.hepaticGlucoseSuppressionPct}%</span>
                  <span className="text-[10px] text-slate-500 block">Liver Output Suppression</span>
                </div>
              </div>

              {/* Anthropometric Reference */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Patient Baseline Anthropometrics
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Weight &amp; Height:</span>
                  <span className="font-mono text-white">{params.patient.weightKg} kg / {params.patient.heightCm} cm</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Body Mass Index (BMI):</span>
                  <span className="font-mono text-amber-300">{state.bmi} kg/m&sup2;</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Body Surface Area (BSA):</span>
                  <span className="font-mono text-slate-300">{state.bsaM2} m&sup2;</span>
                </div>
              </div>

              {/* Protocol Recommendation Note */}
              <div className="p-3.5 bg-amber-950/40 rounded-lg border border-amber-800/60 text-xs text-amber-200 leading-relaxed">
                <strong>Clinical Interpretation: </strong>
                {state.clinicalGuidance}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'homaMinimal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: HOMA2-IR, HOMA2-Beta & QUICKI Index */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Beaker className="w-4 h-4 text-emerald-400" />
                Homeostatic Model Assessment (HOMA2) &amp; QUICKI
              </h3>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div>
                    <span className="font-bold text-white block">HOMA-IR (Insulin Resistance Index)</span>
                    <span className="text-[10px] text-slate-400">Formula: (Glucose mg/dL * Insulin uU/mL) / 405</span>
                  </div>
                  <span className={`text-lg font-bold font-mono px-2.5 py-0.5 rounded ${
                    state.homaIR < 1.5
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : state.homaIR <= 2.9
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-rose-950 text-rose-300 border border-rose-700'
                  }`}>
                    {state.homaIR}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div>
                    <span className="font-bold text-white block">HOMA-&beta; (% Beta-Cell Secretory Function)</span>
                    <span className="text-[10px] text-slate-400">Formula: (360 * Insulin) / (Glucose - 63) %</span>
                  </div>
                  <span className={`text-lg font-bold font-mono px-2.5 py-0.5 rounded ${
                    state.homaBetaPct >= 60 && state.homaBetaPct <= 140
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : state.homaBetaPct < 40
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {state.homaBetaPct}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">QUICKI (Quantitative Sensitivity Check)</span>
                    <span className="text-[10px] text-slate-400">Formula: 1 / (log(Glucose) + log(Insulin))</span>
                  </div>
                  <span className={`text-lg font-bold font-mono px-2.5 py-0.5 rounded ${
                    state.quickiIndex > 0.35
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {state.quickiIndex}
                  </span>
                </div>
              </div>

              {/* Fasting Biomarker Inputs */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Fasting Glucose</span>
                  <span className="font-mono text-base font-bold text-white">{params.patient.fastingGlucoseMgDl} mg/dL</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Fasting Insulin</span>
                  <span className="font-mono text-base font-bold text-purple-400">{params.patient.fastingInsulinUuMl} &mu;U/mL</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Fasting C-Peptide</span>
                  <span className="font-mono text-base font-bold text-sky-400">{params.patient.fastingCPeptideNgMl} ng/mL</span>
                </div>
              </div>
            </div>

            {/* Right: Bergman Minimal Model & Disposition Index */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                Bergman Minimal Model &amp; Disposition Index (DI)
              </h3>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Acute Insulin Response to Glucose (AIRg):</span>
                  <span className="font-mono text-purple-400 font-bold">{state.acuteInsulinResponseAIRg} &mu;U/mL&middot;min</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Disposition Index (DI = M &times; AIRg):</span>
                  <span className="font-mono text-emerald-400 font-bold text-base">{state.dispositionIndex}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  The Disposition Index defines the hyperbolic compensation curve: a healthy beta cell augments insulin secretion (AIRg) to precisely match any decline in peripheral insulin sensitivity (M). Progression to overt Type 2 Diabetes occurs when the curve drops below the normal hyperbolic threshold.
                </p>
              </div>

              {/* Disposition Index Hyperbolic SVG */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] font-bold text-slate-300 mb-2">Hyperbolic Compensation Curve:</div>
                <svg viewBox="0 0 360 160" className="w-full h-28">
                  {/* Normal Hyperbola Path (DI = 1000) */}
                  <path
                    d="M 40 130 Q 90 40, 320 30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />
                  {/* T2DM Defect Path (DI = 300) */}
                  <path
                    d="M 40 140 Q 70 80, 320 70"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  {/* Patient Point */}
                  <circle
                    cx={Math.min(320, Math.max(50, 50 + state.steadyStateMValue * 18))}
                    cy={Math.min(140, Math.max(30, 150 - (state.acuteInsulinResponseAIRg / 200) * 110))}
                    r="6"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <text x="320" y="24" fill="#10b981" fontSize="9" textAnchor="end">Normal Hyperbola</text>
                  <text x="320" y="85" fill="#ef4444" fontSize="9" textAnchor="end">Beta-Cell Failure</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dkaProtocol' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: DKA Two-Bag Fluid & Insulin Protocol */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-rose-400" />
                DKA Two-Bag Fluidics &amp; Insulin Resuscitation
              </h3>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Arterial pH / Bicarbonate:</span>
                  <span className="font-mono text-white font-bold">{params.dkaLabs.arterialPh} / {params.dkaLabs.bicarbonateMeqL} mEq/L</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Serum Anion Gap:</span>
                  <span className={`font-mono font-bold ${state.dkaMetrics.isAnionGapClosed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {params.dkaLabs.anionGap} mEq/L (Target &le; 12)
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Serum &beta;-Hydroxybutyrate:</span>
                  <span className="font-mono text-amber-400 font-bold">{params.dkaLabs.betaHydroxybutyrateMmolL} mmol/L (Normal &lt; 0.6)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Serum Potassium (K+):</span>
                  <span className={`font-mono font-bold ${params.dkaLabs.potassiumMeqL < 3.3 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                    {params.dkaLabs.potassiumMeqL} mEq/L
                  </span>
                </div>
              </div>

              {/* Potassium Safety Card */}
              {params.dkaLabs.potassiumMeqL < 3.3 && (
                <div className="p-3 bg-rose-950 border border-rose-700 rounded-lg text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <strong>CRITICAL POTASSIUM SAFETY INTERLOCK: </strong>
                    K+ is &lt; 3.3 mEq/L. Hold IV insulin infusion immediately! Administer IV KCl 20–40 mEq/hr until K+ &ge; 3.3 mEq/L before restarting insulin.
                  </div>
                </div>
              )}
            </div>

            {/* Right: DKA Resolution & SubQ Overlap Timing */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                DKA Resolution Criteria &amp; SubQ Transition
              </h3>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  {state.dkaMetrics.isAnionGapClosed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>Anion Gap Normalization (&le; 12 mEq/L)</span>
                </div>

                <div className="flex items-center gap-2">
                  {params.dkaLabs.arterialPh >= 7.30 && params.dkaLabs.bicarbonateMeqL >= 18 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>Venous / Arterial pH &gt; 7.30 &amp; Bicarbonate &ge; 18 mEq/L</span>
                </div>

                <div className="flex items-center gap-2">
                  {state.dkaMetrics.isGlucoseControlled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Blood Glucose &le; 200 mg/dL (D5W Added to Infusion)</span>
                </div>
              </div>

              {/* SubQ Transition Banner */}
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 text-xs leading-relaxed space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Subcutaneous Insulin Overlap Rule
                </div>
                <p className="text-slate-300">
                  Once DKA criteria are met and the patient can tolerate oral intake, administer subcutaneous basal insulin (Glargine or Degludec) at least <strong>2 hours prior to stopping</strong> the intravenous insulin infusion. Abrupt cessation of IV insulin causes acute recurrence of ketoacidosis due to the ultra-short half-life of IV regular insulin (~5–9 minutes).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                DeFronzo Ominous Octet of T2DM Pathophysiology
              </h3>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                <li><strong className="text-white">1. Decreased Incretin Effect:</strong> Blunted GLP-1 and GIP secretion/sensitivity in L-cells and K-cells.</li>
                <li><strong className="text-white">2. Increased Lipolysis:</strong> Accelerated adipose lipolysis elevating circulating free fatty acids (FFAs) and causing muscle/hepatic lipotoxicity.</li>
                <li><strong className="text-white">3. Increased Renal Glucose Reabsorption:</strong> Upregulated SGLT2 cotransporters in proximal tubules worsening hyperglycemia.</li>
                <li><strong className="text-white">4. Decreased Glucose Uptake:</strong> Skeletal muscle IRS-1 tyrosine phosphorylation failure blunting GLUT4 translocation.</li>
                <li><strong className="text-white">5. Neurotransmitter Dysfunction:</strong> Hypothalamic insulin resistance failing to suppress appetite.</li>
                <li><strong className="text-white">6. Increased Hepatic Glucose Production:</strong> Unsuppressed gluconeogenesis and glycogenolysis.</li>
                <li><strong className="text-white">7. Increased Glucagon Secretion:</strong> Pancreatic alpha-cell hypersecretion of glucagon.</li>
                <li><strong className="text-white">8. Impaired Insulin Secretion:</strong> Progressive beta-cell apoptosis and dedifferentiation.</li>
              </ul>
            </div>

            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Dawn Phenomenon vs Somogyi Rebound
              </h3>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 leading-relaxed">
                <div>
                  <strong className="text-amber-300">Dawn Phenomenon:</strong> Early morning hyperglycemia (5:00–8:00 AM) driven by nocturnal surges of Growth Hormone, Cortisol, and Glucagon enhancing hepatic gluconeogenesis. 3:00 AM glucose is <em>normal or elevated</em>. Treatment: Increase evening basal insulin.
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-rose-300">Somogyi Effect (Rebound):</strong> Nocturnal hypoglycemia (~2:00–3:00 AM) triggering counterregulatory catecholamine/cortisol surge resulting in rebound morning hyperglycemia. 3:00 AM glucose is <em>low (&lt; 70 mg/dL)</em>. Treatment: Decrease evening basal insulin or provide bedtime snack.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
