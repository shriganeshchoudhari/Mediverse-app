'use client';

import React, { useState, useMemo } from 'react';
import {
  CrisisType,
  BwpsParameters,
  MyxedemaScoreParameters,
  DrugAdministrationOrder,
  calculateBwpsScore,
  calculateMyxedemaScore,
  evaluateThyroidStormPharmacotherapy,
  THYROID_CRISIS_PRESETS,
} from '../../.gemini/skills/ThyroidCrisisEngine';
import {
  Flame,
  Snowflake,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Heart,
  Brain,
  Pill,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Thermometer,
  Zap,
} from 'lucide-react';

export default function ThyroidCrisisSimulator() {
  const [activeCrisisType, setActiveCrisisType] = useState<CrisisType>('THYROID_STORM');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fulminant-thyroid-storm');

  // BWPS Interactive State
  const [tempF, setTempF] = useState<number>(103.8);
  const [cnsStatus, setCnsStatus] = useState<BwpsParameters['cnsStatus']>('MODERATE_DELIRIUM_PSYCHOSIS');
  const [giHepaticStatus, setGiHepaticStatus] = useState<BwpsParameters['giHepaticStatus']>('SEVERE_JAUNDICE');
  const [heartRate, setHeartRate] = useState<number>(155);
  const [heartFailureStatus, setHeartFailureStatus] = useState<BwpsParameters['heartFailureStatus']>('MODERATE_BIBASILAR_RALES');
  const [afibPresent, setAfibPresent] = useState<boolean>(true);
  const [precipitatingPresent, setPrecipitatingPresent] = useState<boolean>(true);

  // Myxedema Interactive State
  const [tempC, setTempC] = useState<number>(32.8);
  const [myxCns, setMyxCns] = useState<MyxedemaScoreParameters['cnsDysfunction']>('OBTUNDATION');
  const [myxGi, setMyxGi] = useState<MyxedemaScoreParameters['gastrointestinalDysfunction']>('ILEUS_MEGACOLON');
  const [myxHr, setMyxHr] = useState<number>(42);
  const [myxMap, setMyxMap] = useState<number>(56);
  const [myxNa, setMyxNa] = useState<number>(118);
  const [myxGlucose, setMyxGlucose] = useState<number>(52);
  const [hypercapnia, setHypercapnia] = useState<boolean>(true);
  const [myxPrecipitating, setMyxPrecipitating] = useState<boolean>(true);

  // Pharmacotherapy Ordering Console (Minutes relative to admission)
  const [ptuMinute, setPtuMinute] = useState<number | null>(0);
  const [iodineMinute, setIodineMinute] = useState<number | null>(75);
  const [betaBlockerMinute, setBetaBlockerMinute] = useState<number | null>(15);
  const [steroidMinute, setSteroidMinute] = useState<number | null>(20);
  const [cholestyramineMinute, setCholestyramineMinute] = useState<number | null>(90);

  // Lab Values
  const [freeT4, setFreeT4] = useState<number>(6.8);
  const [totalT3, setTotalT3] = useState<number>(480);
  const [tsh, setTsh] = useState<number>(0.01);

  // Compute BWPS
  const bwpsBreakdown = useMemo(() => {
    return calculateBwpsScore({
      temperatureFahrenheit: tempF,
      cnsStatus,
      giHepaticStatus,
      heartRateBpm: heartRate,
      heartFailureStatus,
      atrialFibrillationPresent: afibPresent,
      precipitatingHistoryPresent: precipitatingPresent,
    });
  }, [tempF, cnsStatus, giHepaticStatus, heartRate, heartFailureStatus, afibPresent, precipitatingPresent]);

  // Compute Myxedema Score
  const myxedemaBreakdown = useMemo(() => {
    return calculateMyxedemaScore({
      temperatureCelsius: tempC,
      cnsDysfunction: myxCns,
      gastrointestinalDysfunction: myxGi,
      heartRateBpm: myxHr,
      meanArterialPressureMmHg: myxMap,
      serumSodiumMeqL: myxNa,
      serumGlucoseMgDl: myxGlucose,
      hypoxemiaOrHypercapnia: hypercapnia,
      precipitatingEventIdentified: myxPrecipitating,
    });
  }, [tempC, myxCns, myxGi, myxHr, myxMap, myxNa, myxGlucose, hypercapnia, myxPrecipitating]);

  // Evaluate Pharmacotherapy Sequence
  const pharmacotherapyEval = useMemo(() => {
    const orders: DrugAdministrationOrder[] = [];
    if (ptuMinute !== null) orders.push({ drug: 'PTU', minuteAdministered: ptuMinute });
    if (iodineMinute !== null) orders.push({ drug: 'SSKI_LUGOLS', minuteAdministered: iodineMinute });
    if (betaBlockerMinute !== null) orders.push({ drug: 'PROPRANOLOL', minuteAdministered: betaBlockerMinute });
    if (steroidMinute !== null) orders.push({ drug: 'HYDROCORTISONE', minuteAdministered: steroidMinute });
    if (cholestyramineMinute !== null) orders.push({ drug: 'CHOLESTYRAMINE', minuteAdministered: cholestyramineMinute });

    return evaluateThyroidStormPharmacotherapy(orders);
  }, [ptuMinute, iodineMinute, betaBlockerMinute, steroidMinute, cholestyramineMinute]);

  // Apply Preset
  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);
    const p = THYROID_CRISIS_PRESETS.find(preset => preset.id === id);
    if (p) {
      setActiveCrisisType(p.crisisType);
      setTempF(p.bwpsParams.temperatureFahrenheit);
      setCnsStatus(p.bwpsParams.cnsStatus);
      setGiHepaticStatus(p.bwpsParams.giHepaticStatus);
      setHeartRate(p.bwpsParams.heartRateBpm);
      setHeartFailureStatus(p.bwpsParams.heartFailureStatus);
      setAfibPresent(p.bwpsParams.atrialFibrillationPresent);
      setPrecipitatingPresent(p.bwpsParams.precipitatingHistoryPresent);

      setTempC(p.myxedemaParams.temperatureCelsius);
      setMyxCns(p.myxedemaParams.cnsDysfunction);
      setMyxGi(p.myxedemaParams.gastrointestinalDysfunction);
      setMyxHr(p.myxedemaParams.heartRateBpm);
      setMyxMap(p.myxedemaParams.meanArterialPressureMmHg);
      setMyxNa(p.myxedemaParams.serumSodiumMeqL);
      setMyxGlucose(p.myxedemaParams.serumGlucoseMgDl);
      setHypercapnia(p.myxedemaParams.hypoxemiaOrHypercapnia);
      setMyxPrecipitating(p.myxedemaParams.precipitatingEventIdentified);

      setFreeT4(p.freeT4NgDl);
      setTotalT3(p.totalT3NgDl);
      setTsh(p.tshUiuMl);

      if (p.crisisType === 'THYROID_STORM') {
        setPtuMinute(0);
        setIodineMinute(75);
        setBetaBlockerMinute(15);
        setSteroidMinute(20);
        setCholestyramineMinute(90);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-100 p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 border border-amber-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                {activeCrisisType === 'THYROID_STORM' ? (
                  <Flame className="w-6 h-6 animate-pulse text-amber-400" />
                ) : (
                  <Snowflake className="w-6 h-6 text-cyan-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Thyroid Storm &amp; Myxedema Coma Crisis Workstation
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${
                      activeCrisisType === 'THYROID_STORM'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {activeCrisisType === 'THYROID_STORM' ? 'BWPS Scale & Multimodal ART' : 'Popoveniuc Myxedema Score'}
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Burch-Wartofsky Point Scale scoring, 1-hour thionamide-to-iodine pharmacotherapy timing solver, and Popoveniuc myxedema coma triage.
                </p>
              </div>
            </div>
          </div>

          {/* Crisis Type Toggle Buttons */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveCrisisType('THYROID_STORM')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCrisisType === 'THYROID_STORM'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" /> Thyroid Storm
            </button>
            <button
              onClick={() => setActiveCrisisType('MYXEDEMA_COMA')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCrisisType === 'MYXEDEMA_COMA'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Snowflake className="w-4 h-4 text-cyan-300" /> Myxedema Coma
            </button>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mt-5 pt-4 border-t border-amber-900/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mr-2">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Presets:
          </span>
          {THYROID_CRISIS_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id
                  ? preset.crisisType === 'THYROID_STORM'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400'
                    : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400'
                  : 'bg-slate-800/80 text-zinc-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters & Calculations */}
      {activeCrisisType === 'THYROID_STORM' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Burch-Wartofsky Interactive Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-400" /> Burch-Wartofsky Diagnostic Criteria (BWPS)
                </h2>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Score: {bwpsBreakdown.totalPoints} pts
                </span>
              </div>

              {/* Temperature Slider */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Core Body Temperature:
                  </span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {tempF}°F ({(((tempF - 32) * 5) / 9).toFixed(1)}°C) &mdash; {bwpsBreakdown.thermoregulatoryPoints} pts
                  </span>
                </div>
                <input
                  type="range"
                  min="98.0"
                  max="106.0"
                  step="0.2"
                  value={tempF}
                  onChange={e => setTempF(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>99.0-99.9 (5 pts)</span>
                  <span>100.0-100.9 (10 pts)</span>
                  <span>101.0-101.9 (15 pts)</span>
                  <span>102.0-102.9 (20 pts)</span>
                  <span>103.0-103.9 (25 pts)</span>
                  <span>&gt;=104.0 (30 pts)</span>
                </div>
              </div>

              {/* Heart Rate Slider */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Tachycardia / Heart Rate:
                  </span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    {heartRate} bpm &mdash; {bwpsBreakdown.cardiovascularPoints} pts (incl. HF)
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="190"
                  value={heartRate}
                  onChange={e => setHeartRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>90-109 (5)</span>
                  <span>110-119 (10)</span>
                  <span>120-129 (15)</span>
                  <span>130-139 (20)</span>
                  <span>&gt;=140 (25 pts)</span>
                </div>
              </div>

              {/* CNS Dysfunction */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> Central Nervous System Status:
                  </span>
                  <span className="font-mono font-bold text-purple-300 text-xs">
                    {bwpsBreakdown.cnsPoints} pts
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'NONE', label: 'Absent (0)', pts: 0 },
                    { id: 'MILD_AGITATION', label: 'Mild Agitation (10)', pts: 10 },
                    { id: 'MODERATE_DELIRIUM_PSYCHOSIS', label: 'Delirium / Psychosis (20)', pts: 20 },
                    { id: 'SEVERE_SEIZURES_COMA', label: 'Seizures / Coma (30)', pts: 30 },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCnsStatus(item.id as BwpsParameters['cnsStatus'])}
                      className={`p-2 rounded-lg text-xs text-left border transition-all ${
                        cnsStatus === item.id
                          ? 'bg-purple-900/50 text-white border-purple-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GI-Hepatic Dysfunction */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Gastrointestinal &amp; Hepatic Dysfunction:</span>
                  <span className="font-mono font-bold text-amber-300 text-xs">
                    {bwpsBreakdown.giHepaticPoints} pts
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'NONE', label: 'Absent (0 pts)' },
                    { id: 'MODERATE_DIARRHEA_NAUSEA_PAIN', label: 'Diarrhea / Nausea / Pain (10 pts)' },
                    { id: 'SEVERE_JAUNDICE', label: 'Unexplained Jaundice (20 pts)' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setGiHepaticStatus(item.id as BwpsParameters['giHepaticStatus'])}
                      className={`p-2 rounded-lg text-xs text-left border transition-all ${
                        giHepaticStatus === item.id
                          ? 'bg-amber-900/50 text-white border-amber-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heart Failure & Arrhythmias */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-zinc-400 font-semibold">Congestive Heart Failure:</span>
                  <div className="space-y-1">
                    {[
                      { id: 'NONE', label: 'None (0 pts)' },
                      { id: 'MILD_PEDAL_EDEMA', label: 'Mild (Pedal Edema) (5 pts)' },
                      { id: 'MODERATE_BIBASILAR_RALES', label: 'Moderate (Bibasilar Rales) (10 pts)' },
                      { id: 'SEVERE_PULMONARY_EDEMA', label: 'Severe (Pulmonary Edema) (15 pts)' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setHeartFailureStatus(item.id as BwpsParameters['heartFailureStatus'])}
                        className={`w-full p-1.5 rounded-lg text-xs text-left border transition-all ${
                          heartFailureStatus === item.id
                            ? 'bg-rose-900/50 text-white border-rose-500 font-semibold'
                            : 'bg-slate-900 text-zinc-400 border-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs text-zinc-400 font-semibold">Arrhythmia &amp; Precipitant:</span>
                  <label className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={afibPresent}
                      onChange={e => setAfibPresent(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Atrial Fibrillation Present (+10 pts)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={precipitatingPresent}
                      onChange={e => setPrecipitatingPresent(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Precipitating Event Identified (+10 pts)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Score Breakdown & Multimodal Pharmacotherapy Console (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* BWPS Score Result Badge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  BWPS Diagnostic Classification
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    bwpsBreakdown.interpretation === 'HIGHLY_SUGGESTIVE_STORM'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : bwpsBreakdown.interpretation === 'IMPENDING_STORM'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  }`}
                >
                  {bwpsBreakdown.interpretation.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono text-white">
                  {bwpsBreakdown.totalPoints}
                </span>
                <span className="text-xs text-zinc-400">total points</span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    bwpsBreakdown.totalPoints >= 45
                      ? 'bg-rose-500'
                      : bwpsBreakdown.totalPoints >= 25
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (bwpsBreakdown.totalPoints / 90) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0</span>
                <span>Unlikely (&lt;25)</span>
                <span>Impending (25-44)</span>
                <span>Storm (&gt;=45)</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {bwpsBreakdown.clinicalSummary}
              </p>
            </div>

            {/* Multimodal 5-Step Pharmacotherapy Sequence Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-400" /> Multimodal Pharmacotherapy Sequencer
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">Timing Verification</span>
              </div>

              {/* Timing Warnings */}
              {pharmacotherapyEval.warnings.length > 0 && (
                <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl space-y-1.5 text-xs text-rose-200">
                  <div className="font-bold flex items-center gap-1 text-rose-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> Critical Timing Warning
                  </div>
                  {pharmacotherapyEval.warnings.map((w, idx) => (
                    <p key={idx} className="leading-snug">
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {pharmacotherapyEval.allEssentialStepsCompleted && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>All 4 primary antithyroid drug steps correctly sequenced and timed!</span>
                </div>
              )}

              {/* Step Sliders */}
              <div className="space-y-3 text-xs">
                {/* Step 1: PTU */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-cyan-300">1. Thionamide (PTU 200mg PO/NG q4h):</span>
                    <span className="font-mono text-zinc-300">T = {ptuMinute ?? 'None'} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={ptuMinute ?? 0}
                    onChange={e => setPtuMinute(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="text-[10px] text-zinc-500">Blocks thyroid hormone synthesis &amp; peripheral T4-to-T3</div>
                </div>

                {/* Step 2: Iodine */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-300">2. Inorganic Iodine (SSKI / Lugol&apos;s):</span>
                    <span className="font-mono text-zinc-300">T = {iodineMinute ?? 'None'} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={iodineMinute ?? 0}
                    onChange={e => setIodineMinute(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="text-[10px] text-amber-400 font-semibold">
                    Rule: Must wait &gt;= 60 min after thionamide to prevent Jod-Basedow flare
                  </div>
                </div>

                {/* Step 3: Beta-Blocker */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-emerald-300">3. Non-selective Beta-Blocker (Propranolol):</span>
                    <span className="font-mono text-zinc-300">T = {betaBlockerMinute ?? 'None'} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={betaBlockerMinute ?? 0}
                    onChange={e => setBetaBlockerMinute(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="text-[10px] text-zinc-500">Blocks adrenergic hyperactivity and 5&apos;-deiodinase</div>
                </div>

                {/* Step 4: Glucocorticoid */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-300">4. Glucocorticoid (Hydrocortisone 100mg IV):</span>
                    <span className="font-mono text-zinc-300">T = {steroidMinute ?? 'None'} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={steroidMinute ?? 0}
                    onChange={e => setSteroidMinute(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-[10px] text-zinc-500">Treats relative adrenal crisis &amp; blocks T4-to-T3 conversion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Myxedema Coma Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Popoveniuc Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-cyan-400" /> Popoveniuc Myxedema Coma Diagnostic Score
                </h2>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Score: {myxedemaBreakdown.totalPoints} pts
                </span>
              </div>

              {/* Hypothermia */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Core Body Temperature:
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {tempC}°C ({(tempC * 1.8 + 32).toFixed(1)}°F) &mdash; {myxedemaBreakdown.thermoregulatoryPoints} pts
                  </span>
                </div>
                <input
                  type="range"
                  min="29.0"
                  max="37.5"
                  step="0.1"
                  value={tempC}
                  onChange={e => setTempC(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>&lt;32.0°C (30 pts)</span>
                  <span>32.0-34.9°C (20 pts)</span>
                  <span>35.0-35.4°C (10 pts)</span>
                  <span>&gt;=35.5°C (0 pts)</span>
                </div>
              </div>

              {/* Neurological Status */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> Central Nervous System Dysfunction:
                  </span>
                  <span className="font-mono font-bold text-purple-300 text-xs">
                    {myxedemaBreakdown.cnsPoints} pts
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'NORMAL', label: 'Normal (0 pts)' },
                    { id: 'SOMNOLENCE_LETHARGY', label: 'Somnolence / Lethargy (15 pts)' },
                    { id: 'OBTUNDATION', label: 'Obtundation (25 pts)' },
                    { id: 'COMA', label: 'Coma (35 pts)' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setMyxCns(item.id as MyxedemaScoreParameters['cnsDysfunction'])}
                      className={`p-2 rounded-lg text-xs text-left border transition-all ${
                        myxCns === item.id
                          ? 'bg-purple-900/50 text-white border-purple-500 font-bold'
                          : 'bg-slate-900 text-zinc-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hemodynamics (HR & MAP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 font-semibold">Heart Rate (Bradycardia):</span>
                    <span className="font-mono font-bold text-cyan-300">{myxHr} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={myxHr}
                    onChange={e => setMyxHr(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="text-[10px] text-zinc-500">&lt;50 bpm: 15 pts | 50-59 bpm: 10 pts</div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 font-semibold">Mean Arterial Pressure (MAP):</span>
                    <span className="font-mono font-bold text-rose-300">{myxMap} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={myxMap}
                    onChange={e => setMyxMap(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="text-[10px] text-zinc-500">&lt;65 mmHg: 15 pts | 65-74 mmHg: 10 pts</div>
                </div>
              </div>

              {/* Metabolic & Respiratory Panel */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs text-zinc-400 font-semibold">Metabolic &amp; Respiratory Derangements:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-400">Serum Na+ ({myxNa} mEq/L):</label>
                    <input
                      type="range"
                      min="110"
                      max="142"
                      value={myxNa}
                      onChange={e => setMyxNa(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded accent-blue-500 mt-1"
                    />
                    <div className="text-[10px] text-zinc-500">&lt;125: 15 pts | &lt;132: 10 pts</div>
                  </div>

                  <div>
                    <label className="text-zinc-400">Blood Glucose ({myxGlucose} mg/dL):</label>
                    <input
                      type="range"
                      min="40"
                      max="130"
                      value={myxGlucose}
                      onChange={e => setMyxGlucose(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded accent-amber-500 mt-1"
                    />
                    <div className="text-[10px] text-zinc-500">&lt;55: 15 pts | &lt;70: 10 pts</div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-1.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hypercapnia}
                        onChange={e => setHypercapnia(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
                      />
                      <span>Hypercapnia / PaO2 &lt; 60 (+15 pts)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Popoveniuc Classification & Urgent Protocol (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Score Result Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Popoveniuc Myxedema Score
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    myxedemaBreakdown.interpretation === 'HIGHLY_SUGGESTIVE_MYXEDEMA'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : myxedemaBreakdown.interpretation === 'EQUIVOCAL'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  }`}
                >
                  {myxedemaBreakdown.interpretation.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono text-cyan-400">
                  {myxedemaBreakdown.totalPoints}
                </span>
                <span className="text-xs text-zinc-400">total points</span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    myxedemaBreakdown.totalPoints >= 60
                      ? 'bg-rose-500'
                      : myxedemaBreakdown.totalPoints >= 25
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (myxedemaBreakdown.totalPoints / 90) * 100)}%`,
                  }}
                />
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {myxedemaBreakdown.clinicalSummary}
              </p>
            </div>

            {/* Urgent Resuscitation Protocol Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> Myxedema Coma Resuscitation Protocol
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-purple-300">1. Stress-Dose Hydrocortisone FIRST (100 mg IV q8h)</div>
                  <p className="text-zinc-400">
                    Mandatory prior to or concurrent with thyroid hormone to prevent precipitating fatal acute Addisonian adrenal collapse.
                  </p>
                </div>

                <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-cyan-300">2. IV Levothyroxine (T4) Loading (200-400 &mu;g IV)</div>
                  <p className="text-zinc-400">
                    Followed by 50-100 &mu;g IV daily. Restores systemic pool of prohormone.
                  </p>
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl space-y-1">
                  <div className="font-bold text-indigo-300">3. IV Liothyronine (T3) (5-20 &mu;g IV q8h)</div>
                  <p className="text-zinc-400">
                    Bypasses severely impaired peripheral 5&apos;-deiodinase to provide active intracellular T3.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-bold text-amber-300">4. Passive Rewarming Only (Space Blankets)</div>
                  <p className="text-zinc-400">
                    Active warming causes peripheral vasodilation and profound refractory vascular shock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Serum Panels */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Circulating Thyroid Function Test Panel
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-zinc-400">Free T4 (FT4)</div>
            <div className="text-lg font-bold text-white mt-1">{freeT4} ng/dL</div>
            <div className="text-[10px] text-zinc-500">Normal: 0.8 &ndash; 1.8 ng/dL</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-zinc-400">Total T3</div>
            <div className="text-lg font-bold text-white mt-1">{totalT3} ng/dL</div>
            <div className="text-[10px] text-zinc-500">Normal: 80 &ndash; 200 ng/dL</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-zinc-400">Thyroid Stimulating Hormone (TSH)</div>
            <div className="text-lg font-bold text-cyan-300 mt-1">{tsh} &mu;IU/mL</div>
            <div className="text-[10px] text-zinc-500">Normal: 0.4 &ndash; 4.0 &mu;IU/mL</div>
          </div>
        </div>
      </div>

      {/* Curriculum Pearls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" /> 1. The 1-Hour Iodine Delay Rule
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Inorganic iodine (SSKI or Lugol&apos;s) transiently inhibits thyroid hormone release via the Wolff-Chaikoff effect. However, if iodine is given BEFORE or within 60 minutes of thionamide (PTU/methimazole), the excess iodine acts as raw fuel for hormone synthesis (the Jod-Basedow phenomenon), worsening the storm.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> 2. PTU vs Methimazole in Storm
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Propylthiouracil (PTU 200 mg q4h) is strictly preferred over methimazole in acute thyroid storm because it uniquely inhibits peripheral 5&apos;-monodeiodinase (blocking T4 to T3 conversion). Methimazole only blocks de novo glandular synthesis.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <Snowflake className="w-4 h-4" /> 3. Adrenal Collapse Risk in Myxedema
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Administration of IV levothyroxine accelerates hepatic cortisol metabolism and metabolic rate. If coexisting secondary adrenal insufficiency or autoimmune polyglandular syndrome type II (Schmidt syndrome) is present, thyroid hormone administration without stress-dose hydrocortisone will precipitate fatal circulatory collapse.
          </p>
        </div>
      </div>
    </div>
  );
}
