'use client';

import React, { useState, useMemo } from 'react';
import {
  ApgarParameters,
  NrpInterventionState,
  NeonatalPatientState,
  calculateApgarScore,
  evaluateNrpStatus,
  NEONATAL_PRESETS,
  NRP_TARGET_PREDUCTAL_SPO2,
} from '../../.gemini/skills/NeonatalResuscitationEngine';
import {
  Baby,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Sparkles,
  RefreshCw,
  Heart,
  Wind,
  Pill,
  Thermometer,
  Radio,
} from 'lucide-react';

export default function NeonatalResuscitationSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('meconium-secondary-apnea');

  // Patient physical state
  const [gaWeeks, setGaWeeks] = useState<number>(41);
  const [birthWeightKg, setBirthWeightKg] = useState<number>(3.8);
  const [minuteOfLife, setMinuteOfLife] = useState<number>(1);
  const [heartRate, setHeartRate] = useState<number>(75);
  const [preDuctalSpO2, setPreDuctalSpO2] = useState<number>(52);
  const [fio2, setFio2] = useState<number>(0.21);
  const [meconiumPresent, setMeconiumPresent] = useState<boolean>(true);
  const [cdhSuspected, setCdhSuspected] = useState<boolean>(false);
  const [cordPh, setCordPh] = useState<number>(7.12);
  const [cordBe, setCordBe] = useState<number>(-11);

  // NRP interventions state
  const [interventions, setInterventions] = useState<NrpInterventionState>(
    NEONATAL_PRESETS[1].patient.interventions
  );

  // APGAR parameters state
  const [apgar, setApgar] = useState<ApgarParameters>(
    NEONATAL_PRESETS[1].patient.apgar1Min
  );

  // Compute APGAR evaluation
  const apgarEvaluation = useMemo(() => {
    return calculateApgarScore(apgar);
  }, [apgar]);

  // Compute NRP status & recommendations
  const nrpEvaluation = useMemo(() => {
    return evaluateNrpStatus({
      gestationalAgeWeeks: gaWeeks,
      birthWeightKg,
      minuteOfLife,
      heartRateBpm: heartRate,
      preDuctalSpO2Pct: preDuctalSpO2,
      currentFiO2: fio2,
      interventions,
      apgar1Min: apgar,
      cordPh,
      cordBaseExcess: cordBe,
      meconiumPresent,
      diaphragmaticHerniaSuspected: cdhSuspected,
    });
  }, [
    gaWeeks,
    birthWeightKg,
    minuteOfLife,
    heartRate,
    preDuctalSpO2,
    fio2,
    interventions,
    apgar,
    cordPh,
    cordBe,
    meconiumPresent,
    cdhSuspected,
  ]);

  // Handle Preset Selection
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = NEONATAL_PRESETS.find(preset => preset.id === id);
    if (p) {
      setGaWeeks(p.patient.gestationalAgeWeeks);
      setBirthWeightKg(p.patient.birthWeightKg);
      setMinuteOfLife(p.patient.minuteOfLife);
      setHeartRate(p.patient.heartRateBpm);
      setPreDuctalSpO2(p.patient.preDuctalSpO2Pct);
      setFio2(p.patient.currentFiO2);
      setInterventions(p.patient.interventions);
      setApgar(p.patient.apgar1Min);
      setMeconiumPresent(p.patient.meconiumPresent);
      setCdhSuspected(p.patient.diaphragmaticHerniaSuspected);
      setCordPh(p.patient.cordPh ?? 7.25);
      setCordBe(p.patient.cordBaseExcess ?? -4);
    }
  };

  // Intervention toggler
  const toggleIntervention = (field: keyof NrpInterventionState) => {
    setInterventions(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // ETT Size & Depth
  const ettSizeMm = birthWeightKg < 1.0 ? 2.5 : birthWeightKg <= 2.0 ? 3.0 : 3.5;
  const ettDepthCm = Math.round((birthWeightKg + 6) * 10) / 10;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-sky-950 border border-rose-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
                <Baby className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Neonatal Resuscitation Program (NRP 8th Ed.) Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                    APGAR &amp; Delivery Room Triage
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Step-by-step NRP 8th Edition algorithm, interactive APGAR scoring, pre-ductal SpO2 nomogram, and weight-based emergency medication solver.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">APGAR:</span>{' '}
              <span className={`font-bold text-sm ${apgarEvaluation.totalScore >= 7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {apgarEvaluation.totalScore}/10 ({apgarEvaluation.category.replace(/_/g, ' ')})
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">HR:</span>{' '}
              <span className={`font-bold ${heartRate >= 100 ? 'text-emerald-400' : heartRate >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {heartRate} bpm
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-zinc-400">Minute:</span>{' '}
              <span className="text-cyan-300 font-bold">Min {minuteOfLife}</span>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-rose-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {NEONATAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: APGAR (Left 5 cols) & NRP Decision Algorithm (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: APGAR Scoring Board & Physical Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" /> APGAR Scoring Board
              </h2>
              <span className="text-xs font-mono font-bold text-rose-400">
                Score: {apgarEvaluation.totalScore} / 10
              </span>
            </div>

            {/* APGAR 5 Rows */}
            <div className="space-y-3 text-xs">
              {/* Appearance */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-semibold text-zinc-300">Appearance (Skin Color):</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0: Pale / Blue' },
                    { val: 1, label: '1: Acrocyanotic' },
                    { val: 2, label: '2: Completely Pink' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setApgar(prev => ({ ...prev, appearanceColor: item.val as 0 | 1 | 2 }))}
                      className={`p-1.5 rounded text-center border transition-all ${
                        apgar.appearanceColor === item.val
                          ? 'bg-rose-900/60 text-white border-rose-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pulse */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-semibold text-zinc-300">Pulse (Heart Rate):</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0: Absent' },
                    { val: 1, label: '1: < 100 bpm' },
                    { val: 2, label: '2: >= 100 bpm' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setApgar(prev => ({ ...prev, pulseHeartRate: item.val as 0 | 1 | 2 }))}
                      className={`p-1.5 rounded text-center border transition-all ${
                        apgar.pulseHeartRate === item.val
                          ? 'bg-rose-900/60 text-white border-rose-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grimace */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-semibold text-zinc-300">Grimace (Reflex Irritability):</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0: Flaccid / None' },
                    { val: 1, label: '1: Grimace' },
                    { val: 2, label: '2: Cry / Cough / Sneeze' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setApgar(prev => ({ ...prev, grimaceReflex: item.val as 0 | 1 | 2 }))}
                      className={`p-1.5 rounded text-center border transition-all ${
                        apgar.grimaceReflex === item.val
                          ? 'bg-rose-900/60 text-white border-rose-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-semibold text-zinc-300">Activity (Muscle Tone):</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0: Limp / Atonic' },
                    { val: 1, label: '1: Some Flexion' },
                    { val: 2, label: '2: Active Motion' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setApgar(prev => ({ ...prev, activityTone: item.val as 0 | 1 | 2 }))}
                      className={`p-1.5 rounded text-center border transition-all ${
                        apgar.activityTone === item.val
                          ? 'bg-rose-900/60 text-white border-rose-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Respiration */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-semibold text-zinc-300">Respiration (Respiratory Effort):</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0: Apneic / None' },
                    { val: 1, label: '1: Weak / Gasping' },
                    { val: 2, label: '2: Vigorous Cry' },
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setApgar(prev => ({ ...prev, respirationEffort: item.val as 0 | 1 | 2 }))}
                      className={`p-1.5 rounded text-center border transition-all ${
                        apgar.respirationEffort === item.val
                          ? 'bg-rose-900/60 text-white border-rose-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary sentence */}
            <p className="text-xs text-zinc-400 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              {apgarEvaluation.clinicalSummary}
            </p>
          </div>

          {/* Newborn Profile Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Physical &amp; Delivery Demographics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 font-medium">Gestational Age:</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    min="24"
                    max="42"
                    value={gaWeeks}
                    onChange={e => setGaWeeks(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300 font-bold"
                  />
                  <span className="text-zinc-500">weeks</span>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-medium">Birth Weight:</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    min="0.5"
                    max="5.5"
                    step="0.1"
                    value={birthWeightKg}
                    onChange={e => setBirthWeightKg(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 font-mono text-rose-400 font-bold"
                  />
                  <span className="text-zinc-500">kg</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={meconiumPresent}
                  onChange={e => setMeconiumPresent(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-zinc-300">Meconium-Stained Amniotic Fluid Present</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cdhSuspected}
                  onChange={e => setCdhSuspected(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span className="text-rose-300 font-semibold">Congenital Diaphragmatic Hernia (CDH) Suspected</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: NRP 8th Edition Step-by-Step Decision Engine (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Recommendation Callout */}
          <div
            className={`p-4 rounded-2xl border ${
              heartRate < 60 || cdhSuspected
                ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                : heartRate < 100
                ? 'bg-amber-950/50 border-amber-800/80 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>NRP 8th Edition Action Plan:</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              {nrpEvaluation.recommendedAction}
            </p>
          </div>

          {/* Dynamic Vital Signs & Minute of Life */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Vital Signs &amp; Pre-Ductal Target SpO2
              </h3>
              <div className="text-xs font-mono text-cyan-300">
                Minute {minuteOfLife} Target: {nrpEvaluation.targetSpO2Range[0]}% – {nrpEvaluation.targetSpO2Range[1]}%
              </div>
            </div>

            {/* Minute of Life Slider */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Timeline (Minute of Life):</span>
                <span className="font-mono font-bold text-cyan-300">{minuteOfLife} min</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={minuteOfLife}
                onChange={e => setMinuteOfLife(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>1 min (60-65%)</span>
                <span>3 min (70-75%)</span>
                <span>5 min (80-85%)</span>
                <span>10 min (85-95%)</span>
              </div>
            </div>

            {/* Heart Rate Slider */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Heart Rate (Auscultation / ECG):</span>
                <span
                  className={`font-mono font-bold ${
                    heartRate >= 100 ? 'text-emerald-400' : heartRate >= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {heartRate} bpm
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                value={heartRate}
                onChange={e => setHeartRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>&lt;60 (Compressions + 100% O2)</span>
                <span>60-99 (PPV + MR. SOPA)</span>
                <span>&gt;=100 (Normal / Wean)</span>
              </div>
            </div>

            {/* Pre-ductal SpO2 & FiO2 Blender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Pre-Ductal SpO2 (Right Wrist):</span>
                  <span className={`font-mono font-bold ${nrpEvaluation.isTargetSpO2Met ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {preDuctalSpO2}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={preDuctalSpO2}
                  onChange={e => setPreDuctalSpO2(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="text-[10px] text-zinc-500">{nrpEvaluation.fio2AdjustmentGuidance}</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Oxygen Blender (FiO2):</span>
                  <span className="font-mono font-bold text-white">{Math.round(fio2 * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.21"
                  max="1.0"
                  step="0.05"
                  value={fio2}
                  onChange={e => setFio2(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                />
                <div className="text-[10px] text-zinc-500">&ge;35w starts 21% | &lt;35w starts 21-30% | 100% with compressions</div>
              </div>
            </div>
          </div>

          {/* NRP Interactive Interventions Control Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> NRP Intervention Sequence Checklist
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { key: 'initialStepsDone', label: 'Warm, Dry, Stimulate' },
                { key: 'ppvActive', label: 'PPV (PIP 20-25 / PEEP 5)' },
                { key: 'mrSopaPerformed', label: 'MR. SOPA Corrective Steps' },
                { key: 'advancedAirwayPlaced', label: 'Advanced Airway (ETT/LMA)' },
                { key: 'chestCompressionsActive', label: '3:1 Compressions (120/min)' },
                { key: 'epinephrineGiven', label: 'UVC Epinephrine 0.02 mg/kg' },
                { key: 'volumeExpanderGiven', label: 'Normal Saline 10 mL/kg' },
              ].map(item => {
                const isActive = interventions[item.key as keyof NrpInterventionState];
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleIntervention(item.key as keyof NrpInterventionState)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-900/60 text-white border-purple-500 shadow-sm'
                        : 'bg-slate-950/60 text-zinc-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px]">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isActive ? 'text-cyan-300' : 'text-zinc-600'}`}>
                      {isActive ? 'Active / Completed' : 'Not Performed'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency Drug Dosages & Equipment Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-cyan-400" /> Weight-Based Emergency Drug &amp; Equipment Dosing
              </span>
              <span className="font-mono text-cyan-300 font-bold">{birthWeightKg} kg Neonate</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">UVC Epinephrine</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">
                  {nrpEvaluation.epinephrineDoseUvcMl} mL
                </div>
                <div className="text-[9px] text-zinc-500">1:10,000 (0.2 mL/kg) + 3mL flush</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">ETT Epinephrine</div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">
                  {nrpEvaluation.epinephrineDoseEttMl} mL
                </div>
                <div className="text-[9px] text-zinc-500">1.0 mL/kg while awaiting UVC</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">Normal Saline Bolus</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {nrpEvaluation.normalSalineBolusMl} mL
                </div>
                <div className="text-[9px] text-zinc-500">10 mL/kg over 5-10 min</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-zinc-400">ETT Tube Size &amp; Depth</div>
                <div className="text-sm font-bold text-purple-300 mt-0.5">
                  {ettSizeMm} mm ID
                </div>
                <div className="text-[9px] text-zinc-500">Depth at lip: {ettDepthCm} cm</div>
              </div>
            </div>

            {nrpEvaluation.therapeuticHypothermiaEligible && (
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-cyan-400" /> Therapeutic Hypothermia Protocol Activated:
                </div>
                <p className="text-zinc-300">
                  Infant meets Sarnat moderate/severe HIE criteria (cord pH {cordPh} &le; 7.00, BE {cordBe}). Initiate passive cooling immediately; target whole-body cooling to 33.5&deg;C within 6 hours of birth for 72 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Clinical Pearls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <Baby className="w-4 h-4" /> 1. Ventilation is the Priority
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Unlike adult cardiac arrest where ventricular fibrillation predominates, neonatal bradycardia is almost exclusively secondary to hypoxemia and inadequate lung inflation. Over 99% of newborns respond to effective Positive Pressure Ventilation (PPV) alone without chest compressions or epinephrine.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> 2. The MR. SOPA Mnemonic
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            When PPV does not produce chest rise or heart rate elevation, perform MR. SOPA steps sequentially: <strong>M</strong>ask adjustment, <strong>R</strong>eposition head, <strong>S</strong>uction mouth and nose, <strong>O</strong>pen mouth, <strong>P</strong>ressure increase (up to 30-40 cmH2O), and <strong>A</strong>lternative airway (LMA or ETT).
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <Wind className="w-4 h-4" /> 3. Avoid Hyperoxia &amp; Target SpO2
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            In utero, normal fetal SpO2 is only 60%. A normal transition requires up to 10 minutes to reach 85-95%. Term infants should be resuscitated starting with room air (21% FiO2) to prevent reactive oxygen species and retinal/cerebral oxidative injury. Preterm infants &lt;35 weeks start on 21-30%.
          </p>
        </div>
      </div>
    </div>
  );
}
