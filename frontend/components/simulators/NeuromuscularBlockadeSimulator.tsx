'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Thermometer,
  Sparkles,
  Timer,
  Clock,
  Layers,
  HeartPulse,
} from 'lucide-react';
import {
  calculateNeuromuscularState,
  formulateReversalPlan,
  NeuromuscularPatientParameters,
  NmbaDrugType,
} from '../../.gemini/skills/NeuromuscularBlockadeEngine';

interface PresetCase {
  id: string;
  name: string;
  badge: string;
  summary: string;
  patient: NeuromuscularPatientParameters;
  isCicoRescue: boolean;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'rocuronium-deep-block',
    name: 'Rocuronium RSI (Deep Block, PTC 3)',
    badge: 'Deep Block',
    summary:
      '30 minutes post-induction with 1.0 mg/kg Rocuronium for emergency exploratory laparotomy. Patient remains in deep block with zero twitches on TOF and PTC 3.',
    patient: {
      weightKg: 75,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 1.0,
      minutesSinceDosing: 30,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    },
    isCicoRescue: false,
  },
  {
    id: 'rocuronium-moderate-t2',
    name: 'Moderate Block with T2 Reappearance (TOF 2/4)',
    badge: 'Moderate Block',
    summary:
      '50 minutes post-intubating dose during laparoscopic surgery. Reappearance of 2nd twitch (T2) confirms moderate depth amenable to 2.0 mg/kg Sugammadex.',
    patient: {
      weightKg: 80,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 0.6,
      minutesSinceDosing: 48,
      coreTemperatureCelsius: 36.6,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    },
    isCicoRescue: false,
  },
  {
    id: 'cisatracurium-esrd',
    name: 'Cisatracurium in End-Stage Renal Disease (ESRD)',
    badge: 'Hofmann Organ-Independent',
    summary:
      '68-year-old on hemodialysis. Cisatracurium undergoes organ-independent Hofmann elimination. Sugammadex is completely ineffective; requires Neostigmine + Glycopyrrolate.',
    patient: {
      weightKg: 70,
      nmbaDrug: 'CISATRACURIUM',
      doseMgPerKg: 0.15,
      minutesSinceDosing: 55,
      coreTemperatureCelsius: 36.5,
      hasEndStageRenalDisease: true,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    },
    isCicoRescue: false,
  },
  {
    id: 'cico-emergency-rescue',
    name: 'Emergency "Cannot Intubate, Cannot Oxygenate" (CICO)',
    badge: 'CRITICAL RESCUE',
    summary:
      'Failed direct laryngoscopy and failed supraglottic airway 4 minutes after 1.2 mg/kg Rocuronium. Immediate emergency Sugammadex 16 mg/kg rescue protocol.',
    patient: {
      weightKg: 85,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 1.2,
      minutesSinceDosing: 4,
      coreTemperatureCelsius: 36.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    },
    isCicoRescue: true,
  },
  {
    id: 'residual-curarization-porc',
    name: 'Residual Curarization (PORC) Airway Collapse Hazard',
    badge: 'Hidden PORC Risk',
    summary:
      'Tactile assessment perceives 4 twitches, but quantitative acceleromyography reveals a TOF ratio of only 0.62. Premature extubation risks catastrophic hypoxemia.',
    patient: {
      weightKg: 78,
      nmbaDrug: 'ROCURONIUM',
      doseMgPerKg: 0.6,
      minutesSinceDosing: 66,
      coreTemperatureCelsius: 35.8,
      hasEndStageRenalDisease: false,
      hasSevereHepaticFailure: false,
      isTakingMagnesiumOrAminoglycoside: false,
    },
    isCicoRescue: false,
  },
];

export default function NeuromuscularBlockadeSimulator() {
  const [activePreset, setActivePreset] = useState<PresetCase>(PRESET_CASES[0]);
  const [patient, setPatient] = useState<NeuromuscularPatientParameters>(PRESET_CASES[0].patient);
  const [isCicoRescue, setIsCicoRescue] = useState<boolean>(PRESET_CASES[0].isCicoRescue);

  const applyPreset = (preset: PresetCase) => {
    setActivePreset(preset);
    setPatient(preset.patient);
    setIsCicoRescue(preset.isCicoRescue);
  };

  // 1. Neuromuscular Monitoring Outcome
  const tofResult = useMemo(() => calculateNeuromuscularState(patient), [patient]);

  // 2. Reversal Plan
  const reversalPlan = useMemo(
    () => formulateReversalPlan(patient, tofResult, isCicoRescue),
    [patient, tofResult, isCicoRescue]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline text-slate-400">
                Simulators
              </Link>
              <span>/</span>
              <span>Anesthesiology &amp; Neurocritical Care</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-emerald-400" />
              Neuromuscular Blockade, Train-of-Four &amp; Reversal Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Quantitative acceleromyography (TOF ratio &ge; 0.90), post-tetanic count (PTC), post-operative residual
              curarization (PORC) defense, and precision Sugammadex vs Neostigmine pharmacotherapy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Acceleromyography Engine
            </span>
          </div>
        </div>

        {/* Case Presets Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRESET_CASES.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={'text-left p-3 rounded-xl border transition-all ' + (isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {preset.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{preset.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                  {preset.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Emergency CICO Alert Banner */}
        {isCicoRescue && (
          <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-4 flex items-start gap-4 shadow-xl">
            <ShieldAlert className="w-7 h-7 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-rose-200 uppercase tracking-wide flex items-center gap-2">
                CRITICAL AIRWAY CRISIS: Cannot Intubate, Cannot Oxygenate (CICO) Rescue Protocol
              </h2>
              <p className="text-xs text-rose-300 leading-relaxed">
                Emergency rescue dose of Sugammadex (16 mg/kg) administered immediately. Prepares rapid chemical
                encapsulation of rocuronium molecules, restoring spontaneous ventilation and airway tone within 90-120 seconds.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  Rescue Dose: {reversalPlan.reversalDoseMg} mg (16 mg/kg x {patient.weightKg} kg)
                </span>
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  Target: Immediate Spontaneous Diaphragmatic Recovery
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Patient Parameters & NMBA Pharmacokinetics (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> NMBA Dosing &amp; Physiology
                </h2>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {patient.weightKg} kg
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* NMBA Drug Selector */}
                <div>
                  <label className="text-slate-400 block mb-1">Neuromuscular Blocking Drug:</label>
                  <select
                    value={patient.nmbaDrug}
                    onChange={(e) =>
                      setPatient((prev) => ({
                        ...prev,
                        nmbaDrug: e.target.value as NmbaDrugType,
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-white"
                  >
                    <option value="ROCURONIUM">Rocuronium (Aminosteroid - Sugammadex target)</option>
                    <option value="VECURONIUM">Vecuronium (Aminosteroid - Sugammadex target)</option>
                    <option value="CISATRACURIUM">Cisatracurium (Hofmann elimination - Sugammadex INEFFECTIVE)</option>
                    <option value="SUCCINYLCHOLINE">Succinylcholine (Depolarizing - Rapid hydrolysis)</option>
                  </select>
                </div>

                {/* Patient Weight */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Patient Weight (Actual Body Weight):</span>
                    <span className="font-mono text-emerald-400 font-bold">{patient.weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    step="2"
                    value={patient.weightKg}
                    onChange={(e) => setPatient((prev) => ({ ...prev, weightKg: Number(e.target.value) }))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Elapsed Time Since Dosing */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Elapsed Time Post-Dose:
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{patient.minutesSinceDosing} min</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="110"
                    step="1"
                    value={patient.minutesSinceDosing}
                    onChange={(e) => setPatient((prev) => ({ ...prev, minutesSinceDosing: Number(e.target.value) }))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0m Intubation</span>
                    <span>45m Moderate</span>
                    <span>&gt;80m Recovery</span>
                  </div>
                </div>

                {/* Core Temperature */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Core Temperature:
                    </span>
                    <span className={'font-mono font-bold ' + (patient.coreTemperatureCelsius < 35 ? 'text-cyan-400' : 'text-slate-200')}>
                      {patient.coreTemperatureCelsius.toFixed(1)} &deg;C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="32.0"
                    max="37.5"
                    step="0.2"
                    value={patient.coreTemperatureCelsius}
                    onChange={(e) => setPatient((prev) => ({ ...prev, coreTemperatureCelsius: Number(e.target.value) }))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Comorbidities & Interactions */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patient.hasEndStageRenalDisease}
                      onChange={(e) => setPatient((prev) => ({ ...prev, hasEndStageRenalDisease: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-slate-300">End-Stage Renal Disease (ESRD on Hemodialysis)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patient.hasSevereHepaticFailure}
                      onChange={(e) => setPatient((prev) => ({ ...prev, hasSevereHepaticFailure: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-slate-300">Severe Hepatic Cirrhosis / Biliary Obstruction</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patient.isTakingMagnesiumOrAminoglycoside}
                      onChange={(e) =>
                        setPatient((prev) => ({
                          ...prev,
                          isTakingMagnesiumOrAminoglycoside: e.target.checked,
                        }))
                      }
                      className="accent-emerald-500"
                    />
                    <span className="text-slate-300">Magnesium Infusion or Aminoglycoside On Board</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isCicoRescue}
                      onChange={(e) => setIsCicoRescue(e.target.checked)}
                      className="accent-rose-500"
                    />
                    <span className="text-rose-400 font-bold">CICO Rescue Scenario (16 mg/kg Stat)</span>
                  </label>
                </div>
              </div>

              {/* Block Depth Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase font-semibold">Current Block Depth:</span>
                  <span className={'px-2.5 py-0.5 rounded text-xs font-bold ' + (tofResult.depth === 'FULL_RECOVERY'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : tofResult.depth === 'MINIMAL_BLOCK' || tofResult.depth === 'SHALLOW_BLOCK'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40')}>
                    {tofResult.depth.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {tofResult.mechanismNote}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Quantitative TOF Acceleromyography Visualizer (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Timer className="w-4 h-4" /> Quantitative TOF Monitor
                </h2>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Adductor Pollicis (2 Hz)
                </span>
              </div>

              {/* Train-of-Four 4-Bar Twitch Graphic */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-end justify-center gap-5 h-40 w-full px-4 border-b border-slate-800 pb-2">
                  {tofResult.twitchHeightsPercent.map((height, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {height}%
                      </span>
                      <div className="w-full bg-slate-800/80 rounded-t h-32 flex items-end justify-center overflow-hidden">
                        <div
                          className={'w-full rounded-t transition-all duration-300 ' + (height > 0
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                            : 'bg-transparent')}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold font-mono text-slate-300">
                        T{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOF Metrics Digital Readouts */}
                <div className="grid grid-cols-2 gap-3 w-full text-center">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 uppercase block">Twitch Count</span>
                    <span className="text-lg font-black text-white font-mono">
                      {tofResult.twitchCount} / 4
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 uppercase block">TOF Ratio (T4/T1)</span>
                    <span className={'text-lg font-black font-mono ' + (tofResult.tofRatio >= 0.90
                      ? 'text-emerald-400'
                      : tofResult.tofRatio >= 0.40
                      ? 'text-amber-400'
                      : 'text-rose-400')}>
                      {tofResult.twitchCount === 4 ? tofResult.tofRatio.toFixed(2) : '--'}
                    </span>
                  </div>
                </div>

                {/* Post-Tetanic Count (PTC) when TOF 0/4 */}
                {tofResult.twitchCount === 0 && (
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Post-Tetanic Count (50 Hz 5s &rarr; 1 Hz):</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      PTC: {tofResult.postTetanicCount} twitches
                    </span>
                  </div>
                )}
              </div>

              {/* Extubation Readiness Badge */}
              <div className={'border rounded-xl p-3 flex items-start gap-3 ' + (tofResult.safeForExtubation
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : 'bg-rose-950/40 border-rose-500/60')}>
                {tofResult.safeForExtubation ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>
                      {tofResult.safeForExtubation
                        ? 'SAFE FOR TRACHEAL EXTUBATION'
                        : 'EXTUBATION UNSAFE: RESIDUAL BLOCK'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {tofResult.safeForExtubation
                      ? 'Quantitative acceleromyography confirms TOF ratio >= 0.90 (90%). Upper airway tone and hypoxic ventilatory drive fully recovered.'
                      : 'High risk of Postoperative Residual Curarization (PORC). Pharyngeal muscle weakness and aspiration hazard persist until TOFR >= 0.90.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Precision Reversal Strategy Solver (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4" /> Reversal Pharmacotherapy
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {reversalPlan.recommendedAgent.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Reversal Agent Solution Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Recommended Regimen:</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {reversalPlan.reversalDosePerKg} mg/kg
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-black text-white font-mono">
                    {reversalPlan.reversalDoseMg} mg Total
                  </div>
                  <p className="text-xs text-slate-400">
                    Calculated for {patient.weightKg} kg actual body weight.
                  </p>
                </div>

                {reversalPlan.adjunctGlycopyrrolateMg > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-xs text-cyan-300 flex justify-between">
                    <span>Adjunct Glycopyrrolate IV:</span>
                    <span className="font-bold font-mono">
                      {reversalPlan.adjunctGlycopyrrolateMg} mg (Anti-muscarinic)
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 text-xs flex justify-between">
                  <span className="text-slate-400">Est. Time to TOFR &ge; 0.90:</span>
                  <span className="font-mono font-bold text-white">
                    ~{reversalPlan.estimatedTimeToTof90Minutes} minutes
                  </span>
                </div>
              </div>

              {/* Safety Alerts & Interaction Warnings */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-amber-400 uppercase block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Reversal Alerts &amp; Precautions:
                </span>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1.5">
                  {reversalPlan.clinicalSafetyAlerts.map((alert, idx) => (
                    <li key={idx} className="leading-snug">
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Pearls Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 space-y-1">
                <strong className="text-white block font-semibold">Anesthesia Clinical Pearls:</strong>
                <p>
                  &bull; Tactile fade evaluation cannot detect TOF ratios between 0.40 and 0.89. Only quantitative monitoring prevents PORC.
                </p>
                <p>
                  &bull; 5-second head lift and hand grip are insensitive tests of recovery and should never replace objective acceleromyography.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
