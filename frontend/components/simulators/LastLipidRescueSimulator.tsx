'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  ShieldAlert,
  Zap,
  Clock,
  Pill,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  LocalAnestheticType,
  LastPatientState,
  evaluateLastToxicity,
  getMaxRecommendedDoseMg,
  LAST_PRESETS,
} from '../../.gemini/skills/LastLipidRescueEngine';

export default function LastLipidRescueSimulator() {
  const [agent, setAgent] = useState<LocalAnestheticType>('BUPIVACAINE');
  const [doseMg, setDoseMg] = useState<number>(150);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [hasEpi, setHasEpi] = useState<boolean>(false);
  const [isIntravascular, setIsIntravascular] = useState<boolean>(true);
  const [elapsedMin, setElapsedMin] = useState<number>(4);
  const [lipidBolusMl, setLipidBolusMl] = useState<number>(0);
  const [lipidInfusionRate, setLipidInfusionRate] = useState<number>(0);
  const [lipidCumulativeMl, setLipidCumulativeMl] = useState<number>(0);
  const [epinephrineMcg, setEpinephrineMcg] = useState<number>(0);
  const [antiarrhythmic, setAntiarrhythmic] = useState<'NONE' | 'LIDOCAINE' | 'AMIODARONE'>('NONE');
  const [ecmoAlerted, setEcmoAlerted] = useState<boolean>(false);

  const patientState: LastPatientState = useMemo(
    () => ({
      agent,
      doseAdministeredMg: doseMg,
      bodyWeightKg: weightKg,
      hasEpinephrineAdditive: hasEpi,
      intravascularAccidentalInjection: isIntravascular,
      elapsedMinutesPostInjection: elapsedMin,
      lipidBolusGivenMl: lipidBolusMl,
      lipidInfusionRateMlMin: lipidInfusionRate,
      lipidCumulativeDoseMl: lipidCumulativeMl,
      epinephrineDoseGivenMcg: epinephrineMcg,
      antiarrhythmicUsed: antiarrhythmic,
      ecmoAlerted,
    }),
    [
      agent,
      doseMg,
      weightKg,
      hasEpi,
      isIntravascular,
      elapsedMin,
      lipidBolusMl,
      lipidInfusionRate,
      lipidCumulativeMl,
      epinephrineMcg,
      antiarrhythmic,
      ecmoAlerted,
    ]
  );

  const evalMetrics = useMemo(() => evaluateLastToxicity(patientState), [patientState]);

  const applyPreset = (presetId: string) => {
    const p = LAST_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setAgent(p.state.agent);
    setDoseMg(p.state.doseAdministeredMg);
    setWeightKg(p.state.bodyWeightKg);
    setHasEpi(p.state.hasEpinephrineAdditive);
    setIsIntravascular(p.state.intravascularAccidentalInjection);
    setElapsedMin(p.state.elapsedMinutesPostInjection);
    setLipidBolusMl(p.state.lipidBolusGivenMl);
    setLipidInfusionRate(p.state.lipidInfusionRateMlMin);
    setLipidCumulativeMl(p.state.lipidCumulativeDoseMl);
    setEpinephrineMcg(p.state.epinephrineDoseGivenMcg);
    setAntiarrhythmic(p.state.antiarrhythmicUsed);
    setEcmoAlerted(p.state.ecmoAlerted);
  };

  const deliverLipidBolus = () => {
    const bolus = Math.round(1.5 * weightKg);
    setLipidBolusMl(bolus);
    setLipidCumulativeMl((prev) => prev + bolus);
    setLipidInfusionRate(Math.round(0.25 * weightKg * 10) / 10);
  };

  const maxSafeDose = useMemo(
    () => getMaxRecommendedDoseMg(agent, weightKg, hasEpi),
    [agent, weightKg, hasEpi]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 tracking-wider uppercase mb-1">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              ASRA Anesthesiology &amp; Resuscitation Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Local Anesthetic Systemic Toxicity (LAST) &amp; 20% Lipid Rescue Solver
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Model myocardial Nav1.5 channel blockade, progressive QRS widening, ASRA 20% Lipid Emulsion
              dual-mechanism lipid sink dynamics, reduced-dose epinephrine guidelines, and refractory arrest protocols.
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

        {/* Clinical Case Presets */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            High-Yield Clinical Case Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {LAST_PRESETS.map((p) => {
              const isActive =
                agent === p.state.agent &&
                doseMg === p.state.doseAdministeredMg &&
                isIntravascular === p.state.intravascularAccidentalInjection;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition duration-150 ${
                    isActive
                      ? 'bg-rose-950/50 border-rose-500/80 text-white shadow-lg shadow-rose-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold truncate text-[11px] text-rose-300">{p.name}</span>
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
          {/* Column 1: Local Anesthetic Dosing & Ingestion Parameters (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Pill className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Local Anesthetic Administration
                </h2>
              </div>

              {/* Agent Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Local Anesthetic Agent:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['BUPIVACAINE', 'ROPIVACAINE', 'LIDOCAINE', 'MEPIVACAINE'] as LocalAnestheticType[]).map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => setAgent(item)}
                        className={`px-2 py-1.5 rounded-lg border text-xs font-semibold transition ${
                          agent === item
                            ? 'bg-rose-600 border-rose-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Patient Weight */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Patient Weight:</span>
                  <strong className="text-white font-mono">{weightKg} kg</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>

              {/* Dose Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Dose Injected:</span>
                  <strong
                    className={`font-mono ${
                      doseMg > maxSafeDose ? 'text-rose-400 font-bold' : 'text-emerald-400'
                    }`}
                  >
                    {doseMg} mg ({Math.round((doseMg / weightKg) * 10) / 10} mg/kg)
                  </strong>
                </div>
                <input
                  type="range"
                  min="20"
                  max="agent === 'LIDOCAINE' ? 3000 : 400"
                  step="10"
                  value={doseMg}
                  onChange={(e) => setDoseMg(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Max safe limit:</span>
                  <span>{maxSafeDose} mg</span>
                </div>
              </div>

              {/* Injection Route & Modifiers */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Epinephrine 1:200,000 Additive:</span>
                  <button
                    onClick={() => setHasEpi(!hasEpi)}
                    className={`px-2 py-0.5 rounded border text-xs font-semibold ${
                      hasEpi ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {hasEpi ? 'WITH EPI' : 'PLAIN'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Intravascular Injection (Accidental):</span>
                  <button
                    onClick={() => setIsIntravascular(!isIntravascular)}
                    className={`px-2 py-0.5 rounded border text-xs font-semibold ${
                      isIntravascular
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isIntravascular ? 'INTRAVASCULAR' : 'PERINEURAL'}
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Time Elapsed:</span>
                    <strong className="text-white font-mono">{elapsedMin} min</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={elapsedMin}
                    onChange={(e) => setElapsedMin(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Electrophysiological & Cardiac Monitor (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Cardiac Monitor Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Telemetry &amp; Electrophysiology
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    evalMetrics.currentPhase === 'CARDIOVASCULAR_COLLAPSE'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : evalMetrics.currentPhase === 'POST_RESCUE_RECOVERED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {evalMetrics.currentPhase.replace('_', ' ')}
                </span>
              </div>

              {/* Simulated Lead II Rhythm Strip SVG */}
              <div className="bg-black/90 rounded-xl p-3 border border-emerald-950">
                <div className="flex justify-between text-[10px] text-emerald-400 font-mono mb-1">
                  <span>LEAD II (25 mm/s, 10 mm/mV)</span>
                  <span>QRS: {evalMetrics.qrsDurationMs} ms</span>
                </div>
                <svg viewBox="0 0 280 80" className="w-full h-24">
                  <path
                    d="M 0 40 L 25 40 L 30 36 L 35 40 L 45 40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  {evalMetrics.ecgPattern === 'NORMAL_SINUS' && (
                    <path
                      d="M 45 40 L 50 42 L 55 12 L 60 48 L 65 40 L 75 40 L 85 34 L 95 40 L 140 40 L 145 36 L 150 40 L 160 40 L 165 42 L 170 12 L 175 48 L 180 40 L 190 40 L 200 34 L 210 40 L 280 40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  )}
                  {evalMetrics.ecgPattern === 'PR_PROLONGATION' && (
                    <path
                      d="M 45 40 L 60 40 L 65 43 L 70 14 L 75 46 L 80 40 L 105 40 L 120 34 L 135 40 L 175 40 L 195 40 L 200 43 L 205 14 L 210 46 L 215 40 L 280 40"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                    />
                  )}
                  {(evalMetrics.ecgPattern === 'WIDE_QRS' ||
                    evalMetrics.ecgPattern === 'VENTRICULAR_TACHYCARDIA') && (
                    <path
                      d="M 30 40 Q 50 2, 70 76 Q 90 2, 110 76 Q 130 2, 150 76 Q 170 2, 190 76 Q 210 2, 230 76 Q 250 2, 270 76"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}
                  {evalMetrics.ecgPattern === 'ASYSTOLE' && (
                    <path
                      d="M 0 40 L 120 40 L 122 38 L 124 40 L 280 40"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Heart Rate:</div>
                  <div
                    className={`text-base font-bold ${
                      evalMetrics.heartRateBpm < 50 || evalMetrics.heartRateBpm > 130
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {evalMetrics.heartRateBpm} bpm
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Mean Art Pressure (MAP):</div>
                  <div
                    className={`text-base font-bold ${
                      evalMetrics.meanArterialPressureMmHg < 65 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {evalMetrics.meanArterialPressureMmHg} mmHg
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Cardiac Output:</div>
                  <div className="text-base font-bold text-white">
                    {evalMetrics.cardiacOutputLMin} L/min
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Free Plasma Conc:</div>
                  <div
                    className={`text-base font-bold ${
                      evalMetrics.estimatedFreePlasmaConcentrationUgMl >= evalMetrics.toxicThresholdUgMl
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {evalMetrics.estimatedFreePlasmaConcentrationUgMl} µg/mL
                  </div>
                </div>
              </div>

              {/* Lipid Sink Sequestration Meter */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Lipid Sink Sequestration:</span>
                  <strong className="text-cyan-400 font-bold">
                    {evalMetrics.lipidSinkSequestrationPercent}% Captured
                  </strong>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${evalMetrics.lipidSinkSequestrationPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: ASRA 20% Lipid Protocol & ACLS Modifications (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    ASRA 20% Lipid Protocol
                  </span>
                </div>
                <button
                  onClick={() => {
                    setLipidBolusMl(0);
                    setLipidInfusionRate(0);
                    setLipidCumulativeMl(0);
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Action: Deliver 1.5 mL/kg Bolus */}
              <div className="space-y-2">
                <button
                  onClick={deliverLipidBolus}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-950/40 transition"
                >
                  <span>Deliver 20% Lipid Bolus (1.5 mL/kg)</span>
                  <span className="bg-cyan-700 px-2 py-0.5 rounded text-[11px]">
                    {evalMetrics.asraProtocolChecklist.lipidBolusRecommendedMl} mL IV
                  </span>
                </button>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Infusion Rate (0.25 mL/kg/min):</span>
                    <strong className="text-white font-mono">
                      {evalMetrics.asraProtocolChecklist.lipidInfusionRecommendedMlMin} mL/min
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cumulative Administered:</span>
                    <strong
                      className={`font-mono ${
                        evalMetrics.asraProtocolChecklist.cumulativeLipidAdministeredMl >
                        evalMetrics.asraProtocolChecklist.maxCumulativeLipidLimitMl
                          ? 'text-rose-400 font-bold'
                          : 'text-cyan-300'
                      }`}
                    >
                      {evalMetrics.asraProtocolChecklist.cumulativeLipidAdministeredMl} /{' '}
                      {evalMetrics.asraProtocolChecklist.maxCumulativeLipidLimitMl} mL Max (12 mL/kg)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Resuscitation Pharmacotherapy & Safety Checks */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ACLS Modifications &amp; Drug Safety
                </div>

                {/* Epinephrine Control */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Epinephrine Dose:</span>
                    <strong
                      className={
                        epinephrineMcg > weightKg
                          ? 'text-rose-400 font-bold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {epinephrineMcg} mcg {epinephrineMcg <= weightKg ? '(<= 1 mcg/kg OK)' : '(HAZARD)'}
                    </strong>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => setEpinephrineMcg(0)}
                      className={`py-1 rounded border ${
                        epinephrineMcg === 0
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      None
                    </button>
                    <button
                      onClick={() => setEpinephrineMcg(Math.round(weightKg * 0.7))}
                      className={`py-1 rounded border ${
                        epinephrineMcg > 0 && epinephrineMcg <= weightKg
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Low (50 mcg)
                    </button>
                    <button
                      onClick={() => setEpinephrineMcg(1000)}
                      className={`py-1 rounded border ${
                        epinephrineMcg >= 1000
                          ? 'bg-rose-700 border-rose-600 text-white animate-pulse'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      1 mg Code
                    </button>
                  </div>
                </div>

                {/* Antiarrhythmic Picker */}
                <div className="space-y-1 pt-1">
                  <span className="text-xs text-slate-400 block">Antiarrhythmic Selection:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {(['NONE', 'AMIODARONE', 'LIDOCAINE'] as const).map((drug) => (
                      <button
                        key={drug}
                        onClick={() => setAntiarrhythmic(drug)}
                        className={`py-1 rounded border text-xs font-semibold ${
                          antiarrhythmic === drug
                            ? drug === 'LIDOCAINE'
                              ? 'bg-rose-700 border-rose-600 text-white'
                              : 'bg-indigo-700 border-indigo-600 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {drug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ECMO Alert Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setEcmoAlerted(!ecmoAlerted)}
                    className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-between ${
                      ecmoAlerted
                        ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Perfusion / ECMO Team Alert</span>
                    <span>{ecmoAlerted ? 'STANDBY CONFIRMED' : 'Alert Team'}</span>
                  </button>
                </div>
              </div>

              {/* Warnings and Contraindications Box */}
              {evalMetrics.asraProtocolChecklist.contraindicatedDrugsTriggered.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200 space-y-1.5">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <ShieldAlert className="w-4 h-4" /> ASRA Contraindication Warning:
                  </div>
                  {evalMetrics.asraProtocolChecklist.contraindicatedDrugsTriggered.map((warn, i) => (
                    <div key={i} className="leading-snug">
                      {warn}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
