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
  Baby,
  Heart,
  Zap,
  Gauge,
  Sliders,
  Syringe,
  Layers,
  Flame,
  Scale,
  Stethoscope,
  Pill,
  Droplets,
  Info,
  Clock,
  Compass,
} from 'lucide-react';
import {
  computeLaborPartogramState,
  LABOR_PRESETS,
  LaborPartogramInputParams,
  LaborPresetId,
  LaborPartogramState,
  CervicalConsistency,
  CervicalPosition,
  HeadMoldingGrade,
  AmnioticFluidStatus,
} from '@/.gemini/skills/LaborPartogramEngine';

const PRESET_KEYS: LaborPresetId[] = [
  'NORMAL_ACTIVE_LABOR_FAVORABLE',
  'UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION',
  'PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED',
  'ARREST_OF_DILATATION_ACTION_LINE',
  'CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT',
  'OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION',
  'CHORIOAMNIONITIS_PROLONGED_RUPTURE',
  'PRECIPITOUS_LABOR_MULTIPARA',
];

export default function LaborPartogramSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<LaborPresetId>(
    'NORMAL_ACTIVE_LABOR_FAVORABLE'
  );
  const [params, setParams] = useState<LaborPartogramInputParams>(
    () => LABOR_PRESETS.NORMAL_ACTIVE_LABOR_FAVORABLE.initialState
  );
  const [activeTab, setActiveTab] = useState<
    'partogramGraph' | 'bishopRipening' | 'uterineContractions' | 'cranialMolding'
  >('partogramGraph');
  const [reportExported, setReportExported] = useState(false);

  // Compute live labor state
  const state: LaborPartogramState = useMemo(() => {
    return computeLaborPartogramState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: LaborPresetId) => {
    setSelectedPreset(presetId);
    setParams(LABOR_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('NORMAL_ACTIVE_LABOR_FAVORABLE');
    setReportExported(false);
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Color helper for Bishop Score
  const getBishopColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score === 7) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                <Baby className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                  Obstetrics Labor Care Guide, Partogram &amp; Bishop Score Workstation
                </h1>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  WHO Partogram (Alert &amp; Action Lines) &bull; Calder Modified Bishop Score &bull; Montevideo Units (MVU) &bull; Tachysystole Resuscitation &bull; CPD Diagnostics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Bishop Score Badge */}
            <div className={`px-4 py-2 rounded-xl border font-mono text-center ${getBishopColor(state.bishopScore)}`}>
              <div className="text-[10px] uppercase font-sans tracking-wider opacity-80">Bishop Score</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1.5">
                <span>{state.bishopScore}</span>
                <span className="text-xs font-normal">
                  ({state.isCervixFavorable ? 'Favorable' : state.bishopScore === 7 ? 'Intermediate' : 'Unfavorable'})
                </span>
              </div>
            </div>

            {/* Dilatation & Station Badge */}
            <div className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-center">
              <div className="text-[10px] uppercase font-sans tracking-wider text-slate-400">Dilatation / Station</div>
              <div className="text-2xl font-bold text-amber-300">
                {state.currentDilatationCm} cm <span className="text-xs font-normal text-slate-400">({state.currentStation >= 0 ? `+${state.currentStation}` : state.currentStation})</span>
              </div>
            </div>

            {/* MVU Badge */}
            <div className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-center">
              <div className="text-[10px] uppercase font-sans tracking-wider text-slate-400">Uterine Work (MVU)</div>
              <div className={`text-2xl font-bold ${state.montevideoUnits >= 200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {state.montevideoUnits} <span className="text-xs font-normal">MVU</span>
              </div>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Export Delivery Labor Flowsheet Record"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>{reportExported ? 'Flowsheet Logged!' : 'Export Record'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Reset to Normal Active Labor Baseline"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 8 Presets Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Labor Scenarios &amp; Dystocia Phenotypes
            </span>
            <span className="text-[11px] text-slate-500">8 Validated Obstetric Presets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESET_KEYS.map((key) => {
              const preset = LABOR_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium leading-snug line-clamp-2">{preset.title.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {key === 'NORMAL_ACTIVE_LABOR_FAVORABLE'
                      ? 'Normal Active'
                      : key === 'UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION'
                      ? 'Bishop 3 Ripening'
                      : key === 'PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED'
                      ? 'Alert Line Crossed'
                      : key === 'ARREST_OF_DILATATION_ACTION_LINE'
                      ? 'Action Line Arrest'
                      : key === 'CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT'
                      ? 'CPD & Molding'
                      : key === 'OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION'
                      ? 'Tachysystole'
                      : key === 'CHORIOAMNIONITIS_PROLONGED_RUPTURE'
                      ? 'Chorioamnionitis'
                      : 'Precipitous Labor'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alarms and Clinical Guidance Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Active Labor Alerts
              </span>
              <span className="text-[11px] font-mono text-slate-500">{state.activeAlarms.length} Active</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.activeAlarms.map((alarm, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 ${
                    alarm.includes('TACHYSYSTOLE') || alarm.includes('ACTION_LINE') || alarm.includes('DISPROPORTION')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : alarm.includes('ALERT_LINE') || alarm.includes('CHORIOAMNIONITIS') || alarm.includes('MECONIUM') || alarm.includes('LOW_MVU')
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
                <Info className="w-4 h-4 text-rose-400" />
                Obstetric Management &amp; WHO Care Guidance
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Rate: {state.dilatationRateCmPerHour} cm/h &bull; MVU: {state.montevideoUnits} &bull; Parity: {params.parity}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{state.clinicalGuidance}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Progression: <strong className="text-amber-300">{state.laborProgressionStatus.replace(/_/g, ' ')}</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Bishop: <strong className={state.isCervixFavorable ? 'text-emerald-400' : 'text-rose-400'}>{state.bishopScore}/13</strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Tachysystole: <strong className={state.isTachysystole ? 'text-rose-400' : 'text-emerald-400'}>
                  {state.isTachysystole ? 'Present (>5 / 10m)' : 'Absent'}
                </strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Fetal Molding: <strong className="text-purple-300">{params.fetalHeadMolding.replace(/_/g, ' ')}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('partogramGraph')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'partogramGraph'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            WHO Partogram &amp; Labor Care Guide
          </button>
          <button
            onClick={() => setActiveTab('bishopRipening')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'bishopRipening'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            Bishop Score &amp; Pre-Induction Ripening
          </button>
          <button
            onClick={() => setActiveTab('uterineContractions')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'uterineContractions'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Uterine Dynamics &amp; Oxytocin Titration
          </button>
          <button
            onClick={() => setActiveTab('cranialMolding')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'cranialMolding'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            Cranial Molding &amp; CPD Diagnostics
          </button>
        </div>

        {/* TAB 1: WHO Partogram & Labor Care Guide */}
        {activeTab === 'partogramGraph' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Visual Partogram Chart */}
            <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  Modified WHO Partogram Dilatation &amp; Descent Chart
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="inline-block w-3 h-0.5 bg-emerald-400 border-t border-dashed" /> Alert Line (1 cm/h)
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="inline-block w-3 h-0.5 bg-rose-400 border-t border-dashed" /> Action Line (+4h)
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400" /> Patient Dilatation
                  </span>
                </div>
              </div>

              {/* Responsive SVG Grid */}
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 620 320" className="w-full min-w-[540px] h-72 select-none">
                  {/* Background Grid */}
                  <rect x="50" y="20" width="540" height="250" fill="#030712" rx="4" />

                  {/* Horizontal Grid Lines (Dilatation 0 to 10 cm) */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cm) => {
                    const y = 270 - cm * 25;
                    return (
                      <g key={`y-${cm}`}>
                        <line x1="50" y1={y} x2="590" y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x="40" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {cm}
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Grid Lines (Hours 0 to 12) */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hr) => {
                    const x = 50 + hr * 45;
                    return (
                      <g key={`x-${hr}`}>
                        <line x1={x} y1="20" x2={x} y2="270" stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y="288" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {hr}h
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Labels */}
                  <text x="18" y="145" fill="#94a3b8" fontSize="11" transform="rotate(-90 18 145)" textAnchor="middle" fontWeight="bold">
                    Cervical Dilatation (cm)
                  </text>
                  <text x="320" y="310" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Hours in Active Labor
                  </text>

                  {/* WHO Alert Line */}
                  <line
                    x1="50"
                    y1="170"
                    x2="320"
                    y2="20"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="5,4"
                  />
                  <text x="210" y="70" fill="#10b981" fontSize="9" fontWeight="bold" transform="rotate(-29 210 70)">
                    ALERT LINE (1 cm/h)
                  </text>

                  {/* WHO Action Line */}
                  <line
                    x1="230"
                    y1="170"
                    x2="500"
                    y2="20"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeDasharray="5,4"
                  />
                  <text x="390" y="70" fill="#f43f5e" fontSize="9" fontWeight="bold" transform="rotate(-29 390 70)">
                    ACTION LINE (+4h)
                  </text>

                  {/* Patient Dilatation Curve */}
                  {params.dilatationHistory.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      points={params.dilatationHistory
                        .map((pt) => `${50 + pt.hour * 45},${270 - pt.dilatationCm * 25}`)
                        .join(' ')}
                    />
                  )}

                  {/* Patient Dilatation Points */}
                  {params.dilatationHistory.map((pt) => {
                    const cx = 50 + pt.hour * 45;
                    const cy = 270 - pt.dilatationCm * 25;
                    return (
                      <g key={`pt-${pt.hour}`}>
                        <circle cx={cx} cy={cy} r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                        <text x={cx} y={cy - 8} fill="#7dd3fc" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          {pt.dilatationCm}cm
                        </text>
                      </g>
                    );
                  })}

                  {/* Patient Head Station Inverted Triangles */}
                  {params.dilatationHistory.map((pt) => {
                    const cx = 50 + pt.hour * 45;
                    const sy = 200 + pt.station * 22;
                    return (
                      <polygon
                        key={`st-${pt.hour}`}
                        points={`${cx},${sy + 5} ${cx - 5},${sy - 5} ${cx + 5},${sy - 5}`}
                        fill="#f59e0b"
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Legend and Interpretation Footer */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div>
                  WHO Rule: If patient dilatation curve falls to the <em>right of the Alert line</em>, referral/investigation is required. Crossing the <em>Action line</em> mandates therapeutic intervention.
                </div>
                <div className="font-mono text-amber-300">
                  Current: {state.currentDilatationCm} cm at {params.currentHour}h ({state.laborProgressionStatus.replace(/_/g, ' ')})
                </div>
              </div>
            </div>

            {/* Live Labor Examination Controls */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  Active Labor Physical Examination
                </span>
                <span className="text-xs font-mono text-slate-400">Hour {params.currentHour}</span>
              </div>

              {/* Cervical Dilatation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Cervical Dilatation (cm)</span>
                  <span className="font-mono text-sky-300 font-bold">{params.bishop.dilatationCm} cm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={params.bishop.dilatationCm}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      bishop: { ...prev.bishop, dilatationCm: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Fetal Head Station Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Fetal Head Station (Ischial Spines)</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {params.bishop.stationFifth >= 0 ? `+${params.bishop.stationFifth}` : params.bishop.stationFifth}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={params.bishop.stationFifth}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      bishop: { ...prev.bishop, stationFifth: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>-3 (Floating)</span>
                  <span>0 (Engaged)</span>
                  <span>+3 (Perineum)</span>
                </div>
              </div>

              {/* Elapsed Hour Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Elapsed Hours in Active Labor</span>
                  <span className="font-mono text-emerald-300 font-bold">{params.currentHour} hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={params.currentHour}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      currentHour: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Parity Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-medium text-slate-300">Maternal Parity</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['NULLIPARA', 'MULTIPARA'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setParams((prev) => ({ ...prev, parity: p }))}
                      className={`p-2 rounded-lg border text-center transition ${
                        params.parity === p
                          ? 'bg-rose-950/70 border-rose-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p === 'NULLIPARA' ? 'Nullipara (First Baby)' : 'Multipara (>= 1 Prior)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert / Action Line Crossing Status Box */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Alert Line Status:</span>
                  <span className={state.isAlertLineCrossed ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {state.isAlertLineCrossed ? 'Alert Line Crossed (Lagging)' : 'On Track'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Action Line Status:</span>
                  <span className={state.isActionLineCrossed ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {state.isActionLineCrossed ? 'Action Line Crossed (Arrest)' : 'Safe'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dilatation Speed:</span>
                  <span className="font-mono text-sky-300">{state.dilatationRateCmPerHour} cm/h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bishop Score & Pre-Induction Ripening */}
        {activeTab === 'bishopRipening' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 5 Bishop Components */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Calder Modified Bishop Score (0 - 13 Points)
                </span>
                <span className="text-xs font-mono text-amber-300">{state.bishopScore} / 13 Points</span>
              </div>

              {/* 1. Dilatation */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>1. Cervical Dilatation</span>
                  <span className="text-amber-300 font-mono">{params.bishop.dilatationCm} cm</span>
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { val: 0, label: 'Closed (0 pt)' },
                    { val: 2, label: '1 - 2 cm (1 pt)' },
                    { val: 4, label: '3 - 4 cm (2 pts)' },
                    { val: 6, label: '>= 5 cm (3 pts)' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          bishop: { ...prev.bishop, dilatationCm: item.val },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        (item.val === 0 && params.bishop.dilatationCm < 1) ||
                        (item.val === 2 && params.bishop.dilatationCm >= 1 && params.bishop.dilatationCm <= 2) ||
                        (item.val === 4 && params.bishop.dilatationCm >= 3 && params.bishop.dilatationCm <= 4) ||
                        (item.val === 6 && params.bishop.dilatationCm >= 5)
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Effacement */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>2. Cervical Effacement</span>
                  <span className="text-amber-300 font-mono">{params.bishop.effacementPct}%</span>
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { pct: 20, label: '0-30% (0 pt)' },
                    { pct: 50, label: '40-50% (1 pt)' },
                    { pct: 70, label: '60-70% (2 pts)' },
                    { pct: 85, label: '>=80% (3 pts)' },
                  ].map((item) => (
                    <button
                      key={item.pct}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          bishop: { ...prev.bishop, effacementPct: item.pct },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        (item.pct === 20 && params.bishop.effacementPct <= 30) ||
                        (item.pct === 50 && params.bishop.effacementPct >= 40 && params.bishop.effacementPct <= 50) ||
                        (item.pct === 70 && params.bishop.effacementPct >= 60 && params.bishop.effacementPct <= 70) ||
                        (item.pct === 85 && params.bishop.effacementPct >= 80)
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Station */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex justify-between">
                  <span>3. Fetal Station</span>
                  <span className="text-amber-300 font-mono">{params.bishop.stationFifth}</span>
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { st: -3, label: '-3 (0 pt)' },
                    { st: -2, label: '-2 (1 pt)' },
                    { st: 0, label: '-1 / 0 (2 pts)' },
                    { st: 2, label: '+1 / +2 (3 pts)' },
                  ].map((item) => (
                    <button
                      key={item.st}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          bishop: { ...prev.bishop, stationFifth: item.st },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        (item.st === -3 && params.bishop.stationFifth <= -3) ||
                        (item.st === -2 && params.bishop.stationFifth === -2) ||
                        (item.st === 0 && (params.bishop.stationFifth === -1 || params.bishop.stationFifth === 0)) ||
                        (item.st === 2 && params.bishop.stationFifth >= 1)
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Consistency */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">4. Cervical Consistency</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      { id: 'FIRM', label: 'Firm (0 pt)' },
                      { id: 'MEDIUM', label: 'Medium (1 pt)' },
                      { id: 'SOFT', label: 'Soft (2 pts)' },
                    ] as { id: CervicalConsistency; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          bishop: { ...prev.bishop, consistency: item.id },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        params.bishop.consistency === item.id
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Position */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">5. Cervical Position</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      { id: 'POSTERIOR', label: 'Posterior (0 pt)' },
                      { id: 'MID_POSITION', label: 'Mid-Position (1 pt)' },
                      { id: 'ANTERIOR', label: 'Anterior (2 pts)' },
                    ] as { id: CervicalPosition; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          bishop: { ...prev.bishop, position: item.id },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        params.bishop.position === item.id
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ripening Protocol Card */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  Pre-Induction Cervical Ripening Guidance
                </span>
                <span className="text-xs font-mono text-emerald-300">ACOG / NICE</span>
              </div>

              <div className={`p-4 rounded-xl border ${getBishopColor(state.bishopScore)} space-y-2`}>
                <div className="text-xs font-semibold uppercase tracking-wider">
                  {state.isCervixFavorable ? 'Favorable Cervix (Score >= 8)' : state.bishopScore === 7 ? 'Intermediate Cervix (Score 7)' : 'Unfavorable Cervix (Score <= 6)'}
                </div>
                <p className="text-xs leading-relaxed">{state.bishopInterpretation}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Recommended Agent:</div>
                <div className="text-amber-300 font-mono leading-relaxed">{state.recommendedRipeningAgent}</div>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Dinoprostone (PGE2):</strong> 10 mg controlled-release vaginal insert over 24h or 0.5 mg intracervical gel. Remove if active labor begins or uterine hyperstimulation occurs.
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Misoprostol (PGE1):</strong> 25 mcg orally or vaginally every 4-6h. Contraindicated in patients with previous Cesarean delivery due to uterine rupture risk.
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Mechanical Foley Balloon:</strong> 16-18 Fr catheter with 30-50 mL sterile saline balloon resting on internal cervical os. Ideal in prior uterine scar or outpatient setting.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Uterine Dynamics & Oxytocin Titration */}
        {activeTab === 'uterineContractions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Contraction Controls */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Uterine Contraction Dynamics &amp; IUPC Parameters
                </span>
                <span className="text-xs font-mono text-slate-400">Montevideo Units</span>
              </div>

              {/* Contraction Frequency Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Contraction Frequency (per 10 minutes)</span>
                  <span className={`font-mono font-bold ${params.uterineContractions.frequencyPer10Min >= 6 ? 'text-rose-400' : 'text-sky-300'}`}>
                    {params.uterineContractions.frequencyPer10Min} / 10 min {params.uterineContractions.frequencyPer10Min >= 6 ? '(Tachysystole)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={params.uterineContractions.frequencyPer10Min}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      uterineContractions: {
                        ...prev.uterineContractions,
                        frequencyPer10Min: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Contraction Duration Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Contraction Duration (seconds)</span>
                  <span className="font-mono text-amber-300 font-bold">{params.uterineContractions.durationSeconds} sec</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  step="5"
                  value={params.uterineContractions.durationSeconds}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      uterineContractions: {
                        ...prev.uterineContractions,
                        durationSeconds: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Contraction Peak Intensity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Peak Contraction Intensity (mmHg)</span>
                  <span className="font-mono text-emerald-300 font-bold">{params.uterineContractions.intensityMmhg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={params.uterineContractions.intensityMmhg}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      uterineContractions: {
                        ...prev.uterineContractions,
                        intensityMmhg: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Oxytocin Infusion Rate Slider */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Oxytocin Infusion Rate (mU/min)</span>
                  <span className="font-mono text-indigo-300 font-bold">{params.uterineContractions.oxytocinInfusionRateMuMin} mU/min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={params.uterineContractions.oxytocinInfusionRateMuMin}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      uterineContractions: {
                        ...prev.uterineContractions,
                        oxytocinInfusionRateMuMin: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* MVU & Tachysystole Management Protocol */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  Montevideo Units (MVU) Adequacy &amp; Safety
                </span>
                <span className="text-xs font-mono text-sky-300">Target &gt;= 200 MVU</span>
              </div>

              {/* MVU Meter */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Delivered Montevideo Units (MVU):</span>
                  <span className={`font-mono text-2xl font-bold ${state.montevideoUnits >= 200 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {state.montevideoUnits} MVU
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${state.montevideoUnits >= 200 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, (state.montevideoUnits / 350) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0</span>
                  <span>Adequate (200 MVU)</span>
                  <span>Hyperactive (350 MVU)</span>
                </div>
              </div>

              {/* Tachysystole Emergency Bundle */}
              {state.isTachysystole ? (
                <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Intrauterine Resuscitation Protocol Active
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    <li><strong>Turn off Oxytocin:</strong> Immediate cessation of infusion.</li>
                    <li><strong>Positioning:</strong> Turn patient to left lateral decubitus to relieve IVC compression.</li>
                    <li><strong>IV Fluid Bolus:</strong> Rapid infusion of 500 - 1000 mL Lactated Ringer solution.</li>
                    <li><strong>Oxygenation:</strong> 10 L/min O2 via non-rebreather face mask.</li>
                    <li><strong>Tocolysis:</strong> Subcutaneous Terbutaline 0.25 mg if fetal heart rate decelerations persist.</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-400">Contraction Frequency Safe:</div>
                  <p>Contractions are within physiologic frequency (&lt;= 5 in 10 minutes). Continue current low-dose oxytocin titration (increase by 1-2 mU/min every 30 minutes until 3-4 contractions per 10 minutes or 200-250 MVU attained).</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Cranial Molding & CPD Diagnostics */}
        {activeTab === 'cranialMolding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Passenger & Passage Assessment */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Compass className="w-4 h-4 text-purple-400" />
                  Fetal Head Molding &amp; Soft Tissue Caput
                </span>
                <span className="text-xs font-mono text-purple-300">CPD Triad</span>
              </div>

              {/* Molding Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Cranial Suture Molding Grade</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(
                    [
                      { id: 'NONE', label: '0: Sutures Separate' },
                      { id: 'GRADE_1_TOUCHING', label: '+1: Bones Touching' },
                      { id: 'GRADE_2_REDUCIBLE', label: '+2: Overlapping (Reducible)' },
                      { id: 'GRADE_3_IRREDUCIBLE', label: '+3: Overlapping (Irreducible)' },
                    ] as { id: HeadMoldingGrade; label: string }[]
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setParams((prev) => ({ ...prev, fetalHeadMolding: m.id }))}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        params.fetalHeadMolding === m.id
                          ? 'bg-purple-950/70 border-purple-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caput Succedaneum Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Caput Succedaneum Severity</span>
                  <span className="font-mono text-purple-300 font-bold">Grade +{params.caputSuccedaneumScale}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={params.caputSuccedaneumScale}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      caputSuccedaneumScale: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-purple-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 (None)</span>
                  <span>+1 (Mild)</span>
                  <span>+2 (Moderate)</span>
                  <span>+3 (Severe)</span>
                </div>
              </div>

              {/* Amniotic Fluid Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-medium text-slate-300">Amniotic Fluid Status</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(
                    [
                      { id: 'INTACT', label: 'Intact (I)' },
                      { id: 'CLEAR', label: 'Clear (C)' },
                      { id: 'MECONIUM_STAINED', label: 'Meconium (M)' },
                    ] as { id: AmnioticFluidStatus; label: string }[]
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setParams((prev) => ({ ...prev, amnioticFluid: f.id }))}
                      className={`p-2 rounded-lg border text-center transition ${
                        params.amnioticFluid === f.id
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CPD & Chorioamnionitis Evaluation Card */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Cephalopelvic Disproportion (CPD) Evaluation
                </span>
                <span className="text-xs font-mono text-rose-400">
                  {state.isCephalopelvicDisproportion ? 'CPD Suspected' : 'No CPD'}
                </span>
              </div>

              {state.isCephalopelvicDisproportion ? (
                <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 space-y-2 text-xs text-slate-300">
                  <div className="font-semibold text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Cephalopelvic Disproportion (CPD) Clinical Alert
                  </div>
                  <p>
                    Presence of Grade 3 irreducible cranial bone overlap with arrest of descent at or above ischial spines represents true mechanical obstructed labor.
                  </p>
                  <p className="text-rose-200 font-bold">
                    DO NOT administer Oxytocin augmentation due to heightened risk of uterine rupture and fetal asphyxia. Urgent Cesarean section is indicated.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-400">
                  <div className="font-semibold text-slate-200">CPD Diagnostic Criteria:</div>
                  <p>
                    True CPD is a retrospective diagnosis made when labor fails to progress despite adequate uterine contractions (&gt;= 200 MVU) in the presence of severe cranial bone molding (Grade 2/3) and advanced caput formation.
                  </p>
                </div>
              )}

              {/* Chorioamnionitis Monitor */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Maternal Temperature:</span>
                  <span className={`font-mono font-bold ${params.maternalTemperatureCelsius >= 38.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.maternalTemperatureCelsius} &deg;C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Hours Ruptured Membranes:</span>
                  <span className={`font-mono font-bold ${params.hoursRupturedMembranes >= 18 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {params.hoursRupturedMembranes} hours
                  </span>
                </div>
                {state.isChorioamnionitisSuspected && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-[11px]">
                    <strong>Chorioamnionitis Confirmed:</strong> Maternal fever &gt;= 38.0&deg;C. Administer IV Ampicillin 2g q6h + Gentamicin 5 mg/kg once daily.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
