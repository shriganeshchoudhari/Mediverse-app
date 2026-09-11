'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pill,
  ShieldAlert,
  Sparkles,
  Zap,
  Flame,
  Heart,
  Stethoscope,
  TrendingDown,
  Info,
  Clock,
  RefreshCw,
} from 'lucide-react';
import {
  AcetaminophenPatientInput,
  IngestionPattern,
  evaluateAcetaminophenCase,
  ACETAMINOPHEN_PRESETS,
} from '../../.gemini/skills/AcetaminophenToxicityEngine';

export default function AcetaminophenSimulator() {
  const [pattern, setPattern] = useState<IngestionPattern>('ACUTE_SINGLE');
  const [hours, setHours] = useState<number>(6);
  const [apapLevel, setApapLevel] = useState<number>(165);
  const [weightKg, setWeightKg] = useState<number>(70);

  // Hepatic & Lab values
  const [alt, setAlt] = useState<number>(32);
  const [ast, setAst] = useState<number>(28);
  const [inr, setInr] = useState<number>(1.1);
  const [creatinine, setCreatinine] = useState<number>(0.9);
  const [ph, setPh] = useState<number>(7.40);
  const [lactate, setLactate] = useState<number>(1.4);
  const [encephalopathy, setEncephalopathy] = useState<number>(0);

  // Infusion & Reactions
  const [nacStarted, setNacStarted] = useState<boolean>(false);
  const [completedHours, setCompletedHours] = useState<number>(0);
  const [anaphylactoid, setAnaphylactoid] = useState<boolean>(false);

  const currentInput: AcetaminophenPatientInput = useMemo(
    () => ({
      ingestionPattern: pattern,
      hoursPostIngestion: hours,
      serumAcetaminophenMcgMl: apapLevel,
      patientWeightKg: weightKg,
      serumAltIuL: alt,
      serumAstIuL: ast,
      internationalNormalizedRatio: inr,
      serumCreatinineMgDl: creatinine,
      arterialBloodPh: ph,
      arterialLactateMmolL: lactate,
      hepaticEncephalopathyGrade: encephalopathy,
      nacInfusionStarted: nacStarted,
      nacInfusionCompletedHours: completedHours,
      anaphylactoidReactionPresent: anaphylactoid,
    }),
    [
      pattern,
      hours,
      apapLevel,
      weightKg,
      alt,
      ast,
      inr,
      creatinine,
      ph,
      lactate,
      encephalopathy,
      nacStarted,
      completedHours,
      anaphylactoid,
    ]
  );

  const metrics = useMemo(() => evaluateAcetaminophenCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = ACETAMINOPHEN_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setPattern(p.input.ingestionPattern);
    setHours(p.input.hoursPostIngestion);
    setApapLevel(p.input.serumAcetaminophenMcgMl);
    setWeightKg(p.input.patientWeightKg);
    setAlt(p.input.serumAltIuL);
    setAst(p.input.serumAstIuL);
    setInr(p.input.internationalNormalizedRatio);
    setCreatinine(p.input.serumCreatinineMgDl);
    setPh(p.input.arterialBloodPh);
    setLactate(p.input.arterialLactateMmolL);
    setEncephalopathy(p.input.hepaticEncephalopathyGrade);
    setNacStarted(p.input.nacInfusionStarted);
    setCompletedHours(p.input.nacInfusionCompletedHours);
    setAnaphylactoid(p.input.anaphylactoidReactionPresent);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline">
                Simulators
              </Link>
              <span>/</span>
              <span>Clinical Toxicology &amp; Hepatology</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Pill className="w-8 h-8 text-emerald-400 animate-pulse" />
              Acetaminophen Toxicity, Rumack-Matthew &amp; NAC Precision Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Precision Rumack-Matthew nomogram solver, CYP2E1 NAPQI glutathione kinetics, N-Acetylcysteine (NAC) IV infusion calculator, and King's College liver transplant criteria.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-semibold">
              Rumack-Matthew Nomogram
            </span>
            <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded-full text-xs font-semibold">
              King's College Criteria
            </span>
            <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">
              Track A55
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Standard Toxicology Cases &amp; Critical Presentations
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {ACETAMINOPHEN_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-emerald-500/50 hover:bg-slate-800/60 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                    {p.name}
                  </span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 mb-1 border border-slate-700">
                  {p.badge}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ingestion Parameters Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Ingestion Parameters &amp; Timing
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {hours}h post-ingestion
                </span>
              </h2>

              {/* Ingestion Pattern */}
              <div>
                <span className="text-xs text-slate-300 block mb-1 font-semibold">Ingestion Pattern:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPattern('ACUTE_SINGLE')}
                    className={`p-2 rounded text-[11px] font-bold border transition ${
                      pattern === 'ACUTE_SINGLE'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Acute Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setPattern('CHRONIC_REPEATED')}
                    className={`p-2 rounded text-[11px] font-bold border transition ${
                      pattern === 'CHRONIC_REPEATED'
                        ? 'bg-amber-950 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Chronic Repeated
                  </button>
                  <button
                    type="button"
                    onClick={() => setPattern('UNKNOWN_OR_STAGGERED')}
                    className={`p-2 rounded text-[11px] font-bold border transition ${
                      pattern === 'UNKNOWN_OR_STAGGERED'
                        ? 'bg-rose-950 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Staggered / Unknown
                  </button>
                </div>
              </div>

              {/* Hours Post Ingestion */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Hours Since Ingestion:</span>
                  <span className={`font-mono font-bold ${hours < 4 || hours > 24 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {hours} hours {hours < 4 ? '(Too early for nomogram)' : hours > 24 ? '(Beyond 24h nomogram)' : '(Nomogram valid)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="36"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Serum APAP Level */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Serum Acetaminophen:</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {apapLevel} mcg/mL ({(apapLevel * 6.62).toFixed(0)} µmol/L)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={apapLevel}
                  onChange={(e) => setApapLevel(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Patient Weight */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Patient Weight:</span>
                  <span className="font-mono text-slate-300">
                    {weightKg} kg {weightKg > 100 ? '(Dosing capped at 100 kg)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="130"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-slate-400"
                />
              </div>
            </div>

            {/* Hepatic & Laboratory Biomarkers Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Hepatic &amp; Metabolic Biomarkers
                </span>
                <span className={`text-xs font-bold ${metrics.hepatotoxicityPresent ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                  {metrics.hepatotoxicityPresent ? 'HEPATOTOXICITY (ALT > 1000)' : 'No Transaminitis'}
                </span>
              </h2>

              {/* ALT & AST */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>ALT:</span>
                    <span className={`font-mono font-bold ${alt > 1000 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {alt} IU/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="8000"
                    step="50"
                    value={alt}
                    onChange={(e) => setAlt(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>AST:</span>
                    <span className={`font-mono font-bold ${ast > 1000 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {ast} IU/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="8000"
                    step="50"
                    value={ast}
                    onChange={(e) => setAst(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* INR & Creatinine */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>INR:</span>
                    <span className={`font-mono font-bold ${inr > 6.5 ? 'text-rose-400 animate-pulse' : inr > 2.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {inr.toFixed(1)} {inr > 6.5 ? '(King\'s > 6.5)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.9"
                    max="10.0"
                    step="0.1"
                    value={inr}
                    onChange={(e) => setInr(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Creatinine:</span>
                    <span className={`font-mono font-bold ${creatinine > 3.4 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {creatinine.toFixed(1)} mg/dL {creatinine > 3.4 ? '(King\'s > 3.4)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="6.0"
                    step="0.1"
                    value={creatinine}
                    onChange={(e) => setCreatinine(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
              </div>

              {/* Arterial pH & Lactate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Arterial pH:</span>
                    <span className={`font-mono font-bold ${ph < 7.30 ? 'text-rose-400 animate-pulse' : 'text-purple-400'}`}>
                      {ph.toFixed(2)} {ph < 7.30 ? '(King\'s < 7.30)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="7.10"
                    max="7.46"
                    step="0.01"
                    value={ph}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Arterial Lactate:</span>
                    <span className={`font-mono font-bold ${lactate > 3.5 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {lactate.toFixed(1)} mmol/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="8.0"
                    step="0.1"
                    value={lactate}
                    onChange={(e) => setLactate(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
              </div>

              {/* Hepatic Encephalopathy Grade */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Hepatic Encephalopathy:</span>
                  <span className={`font-mono font-bold ${encephalopathy >= 3 ? 'text-rose-400' : 'text-slate-300'}`}>
                    Grade {encephalopathy} {encephalopathy === 0 ? '(Normal)' : encephalopathy === 1 ? '(Sleep inversion)' : encephalopathy === 2 ? '(Confusion/Asterixis)' : encephalopathy === 3 ? '(Stupor - King\'s)' : '(Coma - King\'s)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={encephalopathy}
                  onChange={(e) => setEncephalopathy(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* NAC Protocol & Safety Interlocks Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  NAC Infusion Status &amp; Adverse Reaction
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  nacStarted ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-400'
                }`}>
                  {nacStarted ? 'INFUSION ACTIVE' : 'NOT STARTED'}
                </span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
                  <span className="text-xs text-slate-300">N-Acetylcysteine (NAC) Drip Running</span>
                  <input
                    type="checkbox"
                    checked={nacStarted}
                    onChange={(e) => setNacStarted(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>NAC Hours Completed:</span>
                    <span className="font-mono text-cyan-400 font-bold">{completedHours} / 21 hours</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="1"
                    value={completedHours}
                    onChange={(e) => setCompletedHours(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-amber-800/60 bg-slate-950/60 cursor-pointer">
                  <span className="text-xs text-amber-300 font-semibold">
                    Non-IgE Anaphylactoid Reaction (Flushing / Pruritus)
                  </span>
                  <input
                    type="checkbox"
                    checked={anaphylactoid}
                    onChange={(e) => setAnaphylactoid(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Output Metrics & Guidelines (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Nomogram Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Nomogram Tier</div>
                <div className={`text-base font-extrabold mt-1 leading-tight ${
                  metrics.rumackMatthew.toxicityRiskTier === 'MASSIVE_INGESTION_CRITICAL'
                    ? 'text-rose-400 animate-pulse'
                    : metrics.rumackMatthew.toxicityRiskTier === 'ABOVE_TREATMENT_LINE_TOXIC'
                    ? 'text-amber-400'
                    : metrics.rumackMatthew.toxicityRiskTier === 'BELOW_TREATMENT_LINE'
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}>
                  {metrics.rumackMatthew.toxicityRiskTier.replace(/_/g, ' ')}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Threshold: {metrics.rumackMatthew.treatmentLineThresholdMcgMl} mcg/mL
                </div>
              </div>

              {/* King's College */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">King's College</div>
                <div className={`text-base font-extrabold mt-1 leading-tight ${
                  metrics.kingsCollege.criteriaMet ? 'text-rose-400 animate-bounce' : 'text-emerald-400'
                }`}>
                  {metrics.kingsCollege.criteriaMet ? 'CRITERIA MET (TRANSPLANT)' : 'CRITERIA NOT MET'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  pH: {ph.toFixed(2)} | INR: {inr.toFixed(1)}
                </div>
              </div>

              {/* Hepatic Glutathione */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Hepatic Glutathione</div>
                <div className={`text-2xl font-black font-mono mt-1 ${
                  metrics.estimatedGlutathioneRemainingPercent < 30 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                }`}>
                  ~{metrics.estimatedGlutathioneRemainingPercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Zone 3 Necrosis at &lt; 30%
                </div>
              </div>

              {/* NAC Stopping Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">NAC Discontinuation</div>
                <div className={`text-sm font-bold mt-1 ${
                  metrics.nacDosing.stoppingCriteriaMet ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {metrics.nacDosing.stoppingCriteriaMet ? 'SAFE TO STOP' : 'CONTINUE INFUSION'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  APAP: {apapLevel} | INR: {inr.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Rumack-Matthew Nomogram Visualizer Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Rumack-Matthew Nomogram Analysis (4-24 Hours)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-300 font-bold">
                  Patient Level: {apapLevel} mcg/mL at {hours}h
                </span>
              </div>

              {/* Nomogram Curve Bar */}
              <div className="space-y-2 bg-slate-950/70 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0 mcg/mL</span>
                  <span className="text-emerald-400">Treatment Line ({metrics.rumackMatthew.treatmentLineThresholdMcgMl} mcg/mL)</span>
                  <span className="text-rose-400">Massive Line ({metrics.rumackMatthew.massiveIngestionThresholdMcgMl} mcg/mL)</span>
                  <span>500 mcg/mL</span>
                </div>
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${Math.min(100, (apapLevel / 500) * 100)}%` }}
                    className={`h-full transition-all duration-300 ${
                      metrics.rumackMatthew.toxicityRiskTier === 'MASSIVE_INGESTION_CRITICAL'
                        ? 'bg-rose-500'
                        : metrics.rumackMatthew.toxicityRiskTier === 'ABOVE_TREATMENT_LINE_TOXIC'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Standard 150-line (t1/2 ~4h)</span>
                  <span>Patient is {apapLevel >= metrics.rumackMatthew.treatmentLineThresholdMcgMl ? 'OVER treatment line' : 'UNDER treatment line'}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-800/60 rounded-lg p-3 border border-slate-700 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-1">Nomogram Interpretation:</span>
                {metrics.rumackMatthew.interpretation}
              </div>
            </div>

            {/* NAC Dosing Schedule Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    N-Acetylcysteine (NAC) Precision Dosing Protocol
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Total Dose: {metrics.nacDosing.totalNacDoseGrams} g (21h IV)
                </span>
              </div>

              {/* 3-Bag Protocol Table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {metrics.nacDosing.bagDetails.map((bag) => (
                  <div key={bag.bagNumber} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>Bag {bag.bagNumber} ({bag.infusionDurationHours}h):</span>
                      <span className="text-cyan-400">{bag.totalDoseGrams} g</span>
                    </div>
                    <div className="text-slate-400">
                      Dose: {bag.doseMgKg} mg/kg
                    </div>
                    <div className="text-slate-400">
                      Fluid: {bag.fluidVolumeMl} mL D5W
                    </div>
                    <div className="text-emerald-400 font-mono font-semibold">
                      Rate: {bag.infusionRateMlH} mL/h
                    </div>
                  </div>
                ))}
              </div>

              {/* Anaphylactoid Guidance */}
              {metrics.nacDosing.anaphylactoidManagement && (
                <div className="text-xs text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-800 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    Anaphylactoid Reaction Protocol:
                  </span>
                  <p>{metrics.nacDosing.anaphylactoidManagement}</p>
                </div>
              )}
            </div>

            {/* King's College Emergency Liver Transplant Card */}
            <div className={`border rounded-xl p-5 space-y-3 ${
              metrics.kingsCollege.criteriaMet
                ? 'bg-rose-950/50 border-rose-500'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    King's College Hospital Liver Transplant Criteria
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  metrics.kingsCollege.criteriaMet ? 'bg-rose-600 text-white animate-bounce' : 'bg-slate-800 text-slate-400'
                }`}>
                  {metrics.kingsCollege.criteriaMet ? 'TRANSPLANT CRITERIA MET' : 'CRITERIA NOT MET'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded border flex items-center justify-between ${
                  ph < 7.30 ? 'bg-rose-950/60 border-rose-600 text-rose-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <span>Arterial pH &lt; 7.30 (post-fluids)</span>
                  <span className="font-mono">{ph.toFixed(2)}</span>
                </div>
                <div className={`p-2 rounded border flex items-center justify-between ${
                  inr > 6.5 ? 'bg-rose-950/60 border-rose-600 text-rose-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <span>INR &gt; 6.5 (PT &gt; 100s)</span>
                  <span className="font-mono">{inr.toFixed(1)}</span>
                </div>
                <div className={`p-2 rounded border flex items-center justify-between ${
                  creatinine > 3.4 ? 'bg-rose-950/60 border-rose-600 text-rose-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <span>Creatinine &gt; 3.4 mg/dL</span>
                  <span className="font-mono">{creatinine.toFixed(1)}</span>
                </div>
                <div className={`p-2 rounded border flex items-center justify-between ${
                  encephalopathy >= 3 ? 'bg-rose-950/60 border-rose-600 text-rose-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <span>Grade 3 or 4 Encephalopathy</span>
                  <span className="font-mono">Grade {encephalopathy}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded border border-slate-800 leading-relaxed">
                {metrics.kingsCollege.recommendation}
              </p>
            </div>

            {/* NAC Discontinuation Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    NAC Discontinuation / Stopping Criteria
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  metrics.nacDosing.stoppingCriteriaMet
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {metrics.nacDosing.stoppingCriteriaMet ? 'STOP CRITERIA MET' : 'CONTINUE BAG 3'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded border flex items-center gap-2 ${
                  apapLevel < 10 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {apapLevel < 10 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                  <span>APAP &lt; 10 mcg/mL ({apapLevel})</span>
                </div>
                <div className={`p-2 rounded border flex items-center gap-2 ${
                  inr <= 2.0 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {inr <= 2.0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                  <span>INR &le; 2.0 ({inr.toFixed(1)})</span>
                </div>
                <div className={`p-2 rounded border flex items-center gap-2 ${
                  alt < 1000 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {alt < 1000 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                  <span>ALT &lt; 1000 IU/L / Declining ({alt})</span>
                </div>
                <div className={`p-2 rounded border flex items-center gap-2 ${
                  encephalopathy === 0 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {encephalopathy === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                  <span>Encephalopathy Grade 0</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded border border-slate-800">
                {metrics.nacDosing.stoppingGuidance}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Teaching Pearls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Clinical Toxicology &amp; Hepatology Practice Essentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">1. The 4-Hour Nomogram Rule</h4>
              <p>
                Levels measured before 4 hours cannot be interpreted on the Rumack-Matthew nomogram because gastric absorption and hepatic distribution are ongoing. If a massive ingestion is reported or time is unknown, initiate empiric NAC and repeat the serum level at 4 hours.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">2. Zone 3 Centrilobular Necrosis</h4>
              <p>
                CYP2E1 is concentrated in hepatic Zone 3 (centrilobular region around the central vein). When glutathione stores fall below 30%, free NAPQI covalently binds mitochondrial proteins in Zone 3 hepatocytes, causing massive transaminitis (ALT &gt; 5,000-10,000 IU/L).
              </p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <h4 className="font-bold text-slate-200 mb-1">3. Anaphylactoid vs Anaphylaxis</h4>
              <p>
                NAC causes non-IgE-mediated direct histamine release in up to 15% of patients (typically during initial rapid loading). This does NOT represent true IgE-mediated anaphylaxis. Treat with antihistamines and slow the rate; do not permanently discontinue NAC for cutaneous reactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
