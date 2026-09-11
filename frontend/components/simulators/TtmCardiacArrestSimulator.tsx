'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Brain,
  Clock,
  Heart,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  TtmPatientInput,
  TtmProtocolTarget,
  evaluateTtmCase,
  TTM_PRESETS,
} from '../../.gemini/skills/TtmCardiacArrestEngine';

export default function TtmCardiacArrestSimulator() {
  const [targetProtocol, setTargetProtocol] = useState<TtmProtocolTarget>('TARGET_33C');
  const [coreTemp, setCoreTemp] = useState<number>(33.0);
  const [hoursPostRosc, setHoursPostRosc] = useState<number>(12);
  const [shiveringBsas, setShiveringBsas] = useState<number>(2);
  const [rewarmRate, setRewarmRate] = useState<number>(0.20);
  const [pupilsAbsent, setPupilsAbsent] = useState<boolean>(false);
  const [ssepAbsent, setSsepAbsent] = useState<boolean>(false);
  const [eegMalignant, setEegMalignant] = useState<boolean>(false);
  const [nseLevel, setNseLevel] = useState<number>(22);
  const [gwr, setGwr] = useState<number>(1.25);
  const [sedationCleared, setSedationCleared] = useState<boolean>(false);

  const currentInput: TtmPatientInput = useMemo(
    () => ({
      targetProtocol,
      currentCoreTempC: coreTemp,
      hoursPostRosc,
      shiveringScoreBsas: shiveringBsas,
      rewarmingRateCDegPerHour: rewarmRate,
      pupillaryCornealReflexesBilateralAbsent: pupilsAbsent,
      ssepN20BilateralAbsent: ssepAbsent,
      eegSuppressionOrBurstSuppression: eegMalignant,
      serumNse48to72hUgL: nseLevel,
      ctGrayWhiteRatioGwr: gwr,
      sedationClearedForAssessment: sedationCleared,
    }),
    [
      targetProtocol,
      coreTemp,
      hoursPostRosc,
      shiveringBsas,
      rewarmRate,
      pupilsAbsent,
      ssepAbsent,
      eegMalignant,
      nseLevel,
      gwr,
      sedationCleared,
    ]
  );

  const metrics = useMemo(() => evaluateTtmCase(currentInput), [currentInput]);

  const applyPreset = (presetId: string) => {
    const p = TTM_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setTargetProtocol(p.input.targetProtocol);
    setCoreTemp(p.input.currentCoreTempC);
    setHoursPostRosc(p.input.hoursPostRosc);
    setShiveringBsas(p.input.shiveringScoreBsas);
    setRewarmRate(p.input.rewarmingRateCDegPerHour);
    setPupilsAbsent(p.input.pupillaryCornealReflexesBilateralAbsent);
    setSsepAbsent(p.input.ssepN20BilateralAbsent);
    setEegMalignant(p.input.eegSuppressionOrBurstSuppression);
    setNseLevel(p.input.serumNse48to72hUgL);
    setGwr(p.input.ctGrayWhiteRatioGwr);
    setSedationCleared(p.input.sedationClearedForAssessment);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-wider uppercase mb-1">
              <Thermometer className="w-4 h-4 text-sky-400" />
              Resuscitation &amp; Neurocritical Care / AHA &amp; ERC Post-ROSC Guidelines
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Targeted Temperature Management (TTM) &amp; Neuroprognostication Workstation
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Simulate core hypothermia induction (32-36°C), shivering metabolic surge, controlled rewarming electrolyte
              shifts, and Day 3 multimodal neuroprognostication (SSEP N20, continuous EEG, NSE, and CT GWR).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/simulators"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition"
            >
              ← Simulators Catalog
            </Link>
          </div>
        </div>

        {/* Clinical Presets Carousel */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            Post-Cardiac Arrest TTM &amp; Prognostication Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TTM_PRESETS.map((p) => {
              const isActive =
                targetProtocol === p.input.targetProtocol &&
                coreTemp === p.input.currentCoreTempC &&
                hoursPostRosc === p.input.hoursPostRosc &&
                shiveringBsas === p.input.shiveringScoreBsas;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition duration-150 ${
                    isActive
                      ? 'bg-sky-950/50 border-sky-500/80 text-white shadow-lg shadow-sky-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold truncate text-[11px] text-sky-300">{p.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workstation 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Post-ROSC Timeline & Temperature Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Timeline &amp; Thermal Targets
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {metrics.currentPhase.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Protocol Target */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">TTM Protocol Target:</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'TARGET_33C', label: 'TTM 33°C' },
                    { id: 'TARGET_36C', label: 'TTM 36°C' },
                    { id: 'NORMOTHERMIA_37C', label: 'Normo 37°C' },
                  ].map((tgt) => (
                    <button
                      key={tgt.id}
                      onClick={() => setTargetProtocol(tgt.id as TtmProtocolTarget)}
                      className={`py-1.5 rounded-lg border font-semibold text-center transition ${
                        targetProtocol === tgt.id
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tgt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours Post-ROSC */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Hours Post-ROSC:</span>
                  <strong className="text-sky-300 font-mono font-bold">{hoursPostRosc} hours</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="96"
                  step="2"
                  value={hoursPostRosc}
                  onChange={(e) => setHoursPostRosc(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>0h (ROSC)</span>
                  <span>24h (Maint)</span>
                  <span>48h (Rewarm)</span>
                  <span>72h+ (Prognosticate)</span>
                </div>
              </div>

              {/* Core Body Temperature */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Core Temperature:</span>
                  <strong
                    className={`font-mono font-bold text-sm ${
                      coreTemp <= 34.0 ? 'text-sky-400' : coreTemp > 37.5 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {coreTemp.toFixed(1)} °C
                  </strong>
                </div>
                <input
                  type="range"
                  min="32.0"
                  max="39.0"
                  step="0.1"
                  value={coreTemp}
                  onChange={(e) => setCoreTemp(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Rewarming Rate (°C/hr) */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Rewarming Speed:</span>
                  <strong
                    className={`font-mono font-bold ${
                      rewarmRate > 0.25 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {rewarmRate.toFixed(2)} °C/hr
                  </strong>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.60"
                  step="0.05"
                  value={rewarmRate}
                  onChange={(e) => setRewarmRate(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Safe: 0.15-0.25 °C/hr</span>
                  <span>Hazardous: &gt; 0.25 °C/hr</span>
                </div>
              </div>

              {/* Bedside Shivering Assessment Scale (BSAS) */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Shivering Score (BSAS):</span>
                  <strong className="text-amber-300 font-mono">
                    Score {shiveringBsas} ({shiveringBsas === 0 ? 'None' : shiveringBsas === 1 ? 'Masseter' : shiveringBsas === 2 ? 'Chest/Pectoral' : 'Generalized'})
                  </strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={shiveringBsas}
                  onChange={(e) => setShiveringBsas(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Sedation Clearance Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSedationCleared(!sedationCleared)}
                  className={`w-full py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    sedationCleared
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  {sedationCleared ? 'Sedation Cleared for Neuro Exam' : 'Sedatives Active (Midazolam/Propofol)'}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Biophysics, Electrolyte & Metabolism Monitoring (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Metabolic &amp; Electrolyte Kinetics
                </h2>
              </div>

              {/* CMRO2 Cerebral Protection Meter */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Cerebral Metabolic Oxygen Reduction (CMRO2):</span>
                  <strong className="text-sky-400 font-mono font-bold text-sm">
                    -{metrics.cmro2ReductionPercent}%
                  </strong>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, metrics.cmro2ReductionPercent * 2.5)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  Hypothermia slows neuro-destructive ischemic cascades by ~6-8% per °C drop below 37°C.
                </div>
              </div>

              {/* Shivering VO2 Surge Meter */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Shivering Metabolic Oxygen Surge:</span>
                  <strong
                    className={`font-mono font-bold text-sm ${
                      metrics.shiveringMetabolicSurgePercent > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                    }`}
                  >
                    +{metrics.shiveringMetabolicSurgePercent}% VO2
                  </strong>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      metrics.shiveringMetabolicSurgePercent >= 100
                        ? 'bg-rose-500'
                        : metrics.shiveringMetabolicSurgePercent > 0
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, metrics.shiveringMetabolicSurgePercent / 3)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  Uncontrolled shivering counteracts brain-protective hypothermia and surges whole-body oxygen consumption.
                </div>
              </div>

              {/* Potassium Shift Tendency Alert */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  metrics.electrolyteRisk.potassiumShiftTendency === 'REWARMING_HYPERKALEMIA_SURGE'
                    ? 'bg-rose-950/40 border-rose-600/80 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[11px] uppercase tracking-wider">Potassium Dynamics:</span>
                  <span
                    className={
                      metrics.electrolyteRisk.potassiumShiftTendency === 'REWARMING_HYPERKALEMIA_SURGE'
                        ? 'text-rose-400'
                        : 'text-sky-300'
                    }
                  >
                    {metrics.electrolyteRisk.potassiumShiftTendency.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {metrics.electrolyteRisk.warningMessage}
                </p>
              </div>

              {/* Simulated 96-Hour TTM Thermal Curve SVG */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
                <div className="text-[10px] text-slate-400 mb-1.5 flex justify-between w-full">
                  <span>96h Protocol Profile</span>
                  <span className="text-sky-400 font-bold">Now: {hoursPostRosc}h ({coreTemp.toFixed(1)}°C)</span>
                </div>
                <svg viewBox="0 0 240 85" className="w-full h-20 border border-slate-800/80 rounded-lg bg-slate-950">
                  {/* Grid lines */}
                  <line x1="10" y1="20" x2="230" y2="20" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="10" y1="65" x2="230" y2="65" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="12" y="18" fill="#64748b" fontSize="7">37.0°C</text>
                  <text x="12" y="62" fill="#64748b" fontSize="7">33.0°C</text>

                  {/* Target 33 Curve */}
                  {/* Induction: 0-4h (x: 20 to 45), Maint: 4-28h (x: 45 to 110), Rewarm: 28-44h (x: 110 to 155), Normo: 44-96h (x: 155 to 230) */}
                  <path
                    d="M 20 20 L 45 65 L 110 65 L 155 20 L 230 20"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />

                  {/* Current Position Marker */}
                  {(() => {
                    const clampedH = Math.min(96, Math.max(0, hoursPostRosc));
                    const markerX = 20 + (clampedH / 96) * 210;
                    const markerY = 20 + ((37.0 - Math.min(37, Math.max(33, coreTemp))) / 4.0) * 45;
                    return (
                      <g>
                        <circle cx={markerX} cy={markerY} r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                        <line x1={markerX} y1="10" x2={markerX} y2="75" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>

          {/* Column 3: Multimodal Neuroprognostication (>= 72h) (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Multimodal Neuroprognostication
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    metrics.neuroprognostication.isPrognosticationTimingValid
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {metrics.neuroprognostication.isPrognosticationTimingValid ? '≥ 72h TIMING VALID' : 'EARLY / SEDATED'}
                </span>
              </div>

              {/* Prognostication Verdict Badge */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Verdict:</div>
                <div
                  className={`font-black text-sm md:text-base ${
                    metrics.neuroprognostication.prognosticationVerdict ===
                    'HIGH_LIKELIHOOD_POOR_NEUROLOGICAL_OUTCOME'
                      ? 'text-rose-400'
                      : metrics.neuroprognostication.prognosticationVerdict === 'FAVORABLE_RECOVERY_POTENTIAL'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {metrics.neuroprognostication.prognosticationVerdict.replace(/_/g, ' ')}
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Poor Outcome Risk (CPC 3-5):</span>
                  <strong className="text-white font-mono">
                    {metrics.neuroprognostication.poorOutcomeProbabilityPercent}%
                  </strong>
                </div>
              </div>

              {/* 5 Multimodal Modality Switches */}
              <div className="space-y-2 text-xs">
                {/* 1. Pupil & Corneal Reflexes */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <span className="block font-semibold">Bilateral Absent Pupillary &amp; Corneal:</span>
                    <span className="text-[10px] text-slate-500">Brainstem exam at &ge; 72h (FPR &lt; 1%)</span>
                  </div>
                  <button
                    onClick={() => setPupilsAbsent(!pupilsAbsent)}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                      pupilsAbsent
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {pupilsAbsent ? 'ABSENT' : 'Intact'}
                  </button>
                </div>

                {/* 2. SSEP N20 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <span className="block font-semibold">SSEP N20 Cortical Potential:</span>
                    <span className="text-[10px] text-slate-500">Median nerve somatosensory evoked</span>
                  </div>
                  <button
                    onClick={() => setSsepAbsent(!ssepAbsent)}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                      ssepAbsent
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {ssepAbsent ? 'BILATERAL LOSS' : 'Preserved'}
                  </button>
                </div>

                {/* 3. EEG Background */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <span className="block font-semibold">Malignant EEG (Burst-Suppression):</span>
                    <span className="text-[10px] text-slate-500">Non-reactive flat or burst suppression</span>
                  </div>
                  <button
                    onClick={() => setEegMalignant(!eegMalignant)}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                      eegMalignant
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {eegMalignant ? 'MALIGNANT' : 'Normal/Reactive'}
                  </button>
                </div>

                {/* 4. Serum NSE */}
                <div className="space-y-1 p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="font-semibold">Neuron-Specific Enolase (NSE):</span>
                    <strong className={nseLevel > 60 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                      {nseLevel} µg/L
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={nseLevel}
                    onChange={(e) => setNseLevel(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Normal &lt; 17</span>
                    <span>Severe Anoxia &gt; 60 µg/L</span>
                  </div>
                </div>

                {/* 5. CT Gray-White Ratio (GWR) */}
                <div className="space-y-1 p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="font-semibold">CT Gray-White Ratio (GWR):</span>
                    <strong className={gwr < 1.10 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                      {gwr.toFixed(2)}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="1.00"
                    max="1.35"
                    step="0.02"
                    value={gwr}
                    onChange={(e) => setGwr(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>&lt; 1.10 = Loss of GWR (Edema)</span>
                    <span>Normal &gt; 1.20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Actions & Guidance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Neurocritical Care Management Checklist
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            {metrics.clinicalActionChecklist.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
