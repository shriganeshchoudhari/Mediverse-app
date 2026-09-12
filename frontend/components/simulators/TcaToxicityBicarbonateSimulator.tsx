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
  Droplets,
  Stethoscope,
  Info,
  Clock,
  TrendingUp,
  RefreshCw,
  Layers,
  HeartCrack,
  ArrowRight,
  Gauge,
  HelpCircle,
  Thermometer,
  ShieldCheck,
  Ban,
  Syringe,
  ChevronRight,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  TcaAgent,
  TcaPatientInput,
  EcgRiskStratification,
  BicarbonateTitrationOutput,
  TcaSafetyInterlocksOutput,
  ComprehensiveTcaEvaluation,
  evaluateEcgRisk,
  evaluateBicarbonateTherapy,
  performTcaEvaluation,
  TCA_PRESETS,
  TcaPreset,
} from '../../.gemini/skills/TcaToxicityBicarbonateEngine';

type TabMode = 'SYNTHESIS' | 'ECG_ELECTROPHYSIOLOGY' | 'BICARBONATE_TITRATION' | 'TOXICODYNAMICS_RESUSCITATION' | 'REFRACTORY_RESCUE';

export default function TcaToxicityBicarbonateSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('MASSIVE_AMITRIPTYLINE_WIDE_QRS');
  const [activeTab, setActiveTab] = useState<TabMode>('SYNTHESIS');

  // Patient input state initialized to Preset 1
  const [patientInput, setPatientInput] = useState<TcaPatientInput>(
    TCA_PRESETS[0].inputs
  );

  const handleSelectPreset = (preset: TcaPreset) => {
    setSelectedPresetId(preset.id);
    setPatientInput({ ...preset.inputs });
  };

  const updateInput = <K extends keyof TcaPatientInput>(key: K, value: TcaPatientInput[K]) => {
    setPatientInput((prev) => ({ ...prev, [key]: value }));
  };

  const evaluation: ComprehensiveTcaEvaluation = useMemo(() => {
    return performTcaEvaluation(patientInput);
  }, [patientInput]);

  const qrsRiskColor =
    evaluation.ecgRisk.qrsRiskCategory === 'HIGH_VENTRICULAR_ARRHYTHMIA_RISK'
      ? 'text-rose-400 bg-rose-950/40 border-rose-800/80'
      : evaluation.ecgRisk.qrsRiskCategory === 'INTERMEDIATE_SEIZURE_RISK'
      ? 'text-amber-400 bg-amber-950/40 border-amber-800/80'
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80';

  const chartData = [
    {
      name: 'QRS (ms)',
      value: patientInput.qrsDurationMs,
      target: 100,
      unit: 'ms',
    },
    {
      name: 'aVR R (x10 mm)',
      value: Math.round(patientInput.terminalRWaveAvrMm * 10),
      target: 30,
      unit: 'x0.1 mm',
    },
    {
      name: 'MAP (mmHg)',
      value: evaluation.meanArterialPressureMmHg,
      target: 65,
      unit: 'mmHg',
    },
    {
      name: 'pH (x100)',
      value: Math.round(patientInput.arterialPh * 100),
      target: 750,
      unit: 'x0.01',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/simulators" className="hover:text-rose-400 transition flex items-center gap-1">
              Simulators
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-300">Toxicology &amp; Critical Care</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-rose-400 font-medium">TCA Overdose &amp; Bicarbonate Workstation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 flex items-center gap-1.5 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ACMT Cardiotoxicology &amp; Sodium Channel Blockade Protocols
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              Track A65
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-400 shadow-inner">
                <Zap className="w-7 h-7" />
              </span>
              Tricyclic Antidepressant (TCA) Overdose Workstation
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
              Precision resuscitation engine for severe tricyclic antidepressant toxicity. Simulates myocardial Nav1.5 fast sodium-channel blockade, 12-lead ECG conduction delays (QRS widening &gt; 100 ms, terminal R wave in aVR &gt; 3 mm), hypertonic sodium bicarbonate (8.4% NaHCO3) titration, strict Physostigmine contraindications, and vasopressor / lipid rescue protocols.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 min-w-[280px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Clinical Challenge Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {TCA_PRESETS.map((p) => {
                const isActive = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium text-left transition border ${
                      isActive
                        ? 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-800/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5 Executive Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {/* Card 1: QRS Duration & Seizure / VT Risk */}
          <div className={`p-4 rounded-xl border ${qrsRiskColor} transition shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">QRS Duration</span>
              <Activity className="w-4 h-4 opacity-70" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{patientInput.qrsDurationMs}</span>
              <span className="text-xs opacity-75">ms</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              {evaluation.ecgRisk.qrsRiskCategory.replace(/_/g, ' ')}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              Seizure Risk: {evaluation.ecgRisk.seizureRiskPercent}% | VT: {evaluation.ecgRisk.ventricularArrhythmiaRiskPercent}%
            </div>
          </div>

          {/* Card 2: Lead aVR Terminal R Wave */}
          <div className={`p-4 rounded-xl border ${
            evaluation.ecgRisk.isAvrTerminalRWaveProminent
              ? 'bg-rose-950/50 border-rose-700 text-rose-200 animate-pulse'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Terminal R (aVR)</span>
              <Gauge className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{patientInput.terminalRWaveAvrMm.toFixed(1)}</span>
              <span className="text-xs opacity-75">mm</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              R/S Ratio: {patientInput.rToSRatioAvr.toFixed(2)}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              {evaluation.ecgRisk.isAvrTerminalRWaveProminent ? 'Terminal Axis Shift' : 'Normal Axis'}
            </div>
          </div>

          {/* Card 3: Arterial pH & Alkalinization */}
          <div className={`p-4 rounded-xl border ${
            evaluation.bicarbonate.currentPhStatus === 'EXCESSIVE_ALKALEMIC_HAZARD'
              ? 'bg-amber-950/50 border-amber-700 text-amber-200'
              : evaluation.bicarbonate.currentPhStatus === 'TARGET_THERAPEUTIC'
              ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Serum Alkalinization</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{patientInput.arterialPh.toFixed(2)}</span>
              <span className="text-xs opacity-75">pH</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              Target: {evaluation.bicarbonate.targetPhRange}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              HCO3-: {patientInput.serumBicarbonateMeqL} mEq/L | K+: {patientInput.serumPotassiumMeqL.toFixed(1)}
            </div>
          </div>

          {/* Card 4: Hemodynamics & Preload */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-800 text-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hemodynamics</span>
              <HeartCrack className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-400">
                {evaluation.meanArterialPressureMmHg}
              </span>
              <span className="text-xs text-slate-400">mmHg MAP</span>
            </div>
            <div className="mt-1 text-xs font-medium text-slate-300 truncate">
              BP: {patientInput.systolicBpMmHg}/{patientInput.diastolicBpMmHg} | HR: {patientInput.heartRateBpm}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Shock Idx: {evaluation.shockIndex} ({patientInput.vasopressorActive !== 'NONE' ? patientInput.vasopressorActive : 'No pressor'})
            </div>
          </div>

          {/* Card 5: Antidote & Safety Status */}
          <div className={`p-4 rounded-xl border ${
            patientInput.isPhysostigmineAttempted
              ? 'bg-rose-950/60 border-rose-600 text-rose-200 animate-pulse'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Antidote Safety</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">
                {patientInput.isPhysostigmineAttempted ? 'ASYSTOLE' : '8.4% NaHCO3'}
              </span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              {patientInput.isPhysostigmineAttempted ? 'Lethal Antidote Trap!' : 'First-Line Antidote'}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              Seizures: Benzodiazepines ONLY
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mt-8 overflow-x-auto pb-px">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis', icon: Activity },
            { id: 'ECG_ELECTROPHYSIOLOGY', label: '12-Lead ECG Biomarkers', icon: Sliders },
            { id: 'BICARBONATE_TITRATION', label: 'Sodium Bicarbonate Titration', icon: Droplets },
            { id: 'TOXICODYNAMICS_RESUSCITATION', label: 'Toxicodynamics & Resuscitation', icon: Pill },
            { id: 'REFRACTORY_RESCUE', label: 'Refractory Rescue (ILE / ECMO)', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabMode)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold whitespace-nowrap rounded-t-lg transition border-b-2 ${
                  isActive
                    ? 'border-rose-500 text-rose-300 bg-slate-900/80 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TAB 1: SYNTHESIS */}
        {activeTab === 'SYNTHESIS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Critical Safety Interlocks Banner */}
              {evaluation.safetyInterlocks.criticalSafetyAlerts.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-700/80 text-rose-200 shadow-lg">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-rose-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    Critical TCA Interlocks &amp; Resuscitation Hazards
                  </h3>
                  <div className="mt-3 space-y-2">
                    {evaluation.safetyInterlocks.criticalSafetyAlerts.map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm bg-rose-900/30 p-2.5 rounded-lg border border-rose-800/40">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Immediate Action Directives */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Immediate Resuscitation Action Directives
                </h3>
                <div className="mt-4 space-y-2.5">
                  {evaluation.safetyInterlocks.immediateActionDirectives.map((directive, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{directive}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Core Toxic Mechanisms Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  The 4 Principal Toxic Mechanisms of TCAs
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      1. Fast Sodium-Channel (Nav1.5) Blockade
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      Slows Phase 0 cardiac depolarization, causing QRS widening, terminal rightward axis deviation (aVR R wave &gt; 3 mm), intraventricular conduction delays, monomorphic VT, and electromechanical dissociation.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      2. Anticholinergic (Antimuscarinic) Blockade
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      M1-M5 muscarinic receptor antagonism causes resting sinus tachycardia, anhidrosis, hyperthermia, mydriasis, delirium, and paralytic ileus with delayed drug absorption.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      3. Peripheral Alpha-1 Adrenergic Blockade
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      Vascular smooth muscle alpha-1 antagonism produces severe refractory vasoplegic hypotension that does not respond to IV fluids and requires direct alpha-1 vasopressors (Norepinephrine).
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      4. Central GABA &amp; Histamine (H1) Blockade
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      GABA-A chloride channel antagonism and H1 blockade induce rapid lethargy, coma, and generalized tonic-clonic seizures. Seizures produce lactic acidosis, triggering fatal cardiac arrest.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-rose-400" />
                    The Dual Resuscitation Mechanism of Sodium Bicarbonate:
                  </div>
                  <p className="leading-relaxed">
                    Sodium bicarbonate works through two distinct, synergistic biophysical pathways:
                    (1) <strong>Sodium Pore Competition:</strong> The high extracellular Na+ load floods the outer pore of cardiac Nav1.5 channels, physically displacing TCA molecules.
                    (2) <strong>pH-Dependent Uncoupling:</strong> Elevating serum pH to 7.50-7.55 uncharges the tertiary/secondary amine group on TCA molecules, dramatically decreasing receptor binding affinity and driving the drug off the channel.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar: Physiological Fingerprint & Pearls */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  ECG &amp; Hemodynamic Fingerprint
                </h3>
                <div className="h-56 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? entry.value >= 160 ? '#f43f5e' : entry.value >= 100 ? '#fb923c' : '#10b981'
                                : index === 1
                                ? entry.value >= 30 ? '#f43f5e' : '#38bdf8'
                                : index === 2
                                ? entry.value < 65 ? '#f43f5e' : '#10b981'
                                : entry.value > 755 ? '#fb923c' : '#a855f7'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center text-[11px] text-slate-500">
                  Real-time normalized electrophysiological metrics
                </div>
              </div>

              {/* Clinical Pearls Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Cardiotoxicology Pearls
                </h3>
                <div className="mt-4 space-y-2.5">
                  {evaluation.safetyInterlocks.clinicalPearls.map((pearl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pearl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ECG ELECTROPHYSIOLOGY */}
        {activeTab === 'ECG_ELECTROPHYSIOLOGY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                12-Lead ECG Conduction Biomarkers
              </h3>

              {/* QRS Duration Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>QRS Duration:</span>
                  <span className="text-rose-400 font-bold">{patientInput.qrsDurationMs} ms</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="240"
                  step="2"
                  value={patientInput.qrsDurationMs}
                  onChange={(e) => updateInput('qrsDurationMs', Number(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>&lt; 100 ms (Normal)</span>
                  <span className="text-amber-400 font-semibold">100-160 ms (Seizures)</span>
                  <span className="text-rose-400 font-semibold">&gt; 160 ms (VT/VFib)</span>
                </div>
              </div>

              {/* Lead aVR Terminal R Wave */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>Lead aVR Terminal R Wave Amplitude:</span>
                  <span className="text-amber-400 font-bold">{patientInput.terminalRWaveAvrMm.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={patientInput.terminalRWaveAvrMm}
                  onChange={(e) => updateInput('terminalRWaveAvrMm', Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>&lt; 3.0 mm (Low Risk)</span>
                  <span className="text-rose-400 font-semibold">&gt;= 3.0 mm (Predictive of Arrhythmia)</span>
                </div>
              </div>

              {/* aVR R/S Ratio */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>Lead aVR R/S Ratio:</span>
                  <span className="text-cyan-400 font-bold">{patientInput.rToSRatioAvr.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.05"
                  value={patientInput.rToSRatioAvr}
                  onChange={(e) => updateInput('rToSRatioAvr', Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>&lt; 0.7 (Normal)</span>
                  <span className="text-rose-400 font-semibold">&gt;= 0.7 (Abnormal Terminal Shift)</span>
                </div>
              </div>

              {/* QTc Interval */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>QTc Interval:</span>
                  <span className="text-purple-400 font-bold">{patientInput.qtcIntervalMs} ms</span>
                </div>
                <input
                  type="range"
                  min="380"
                  max="620"
                  step="5"
                  value={patientInput.qtcIntervalMs}
                  onChange={(e) => updateInput('qtcIntervalMs', Number(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>&lt; 450 ms (Normal)</span>
                  <span>&gt; 500 ms (Torsades Risk)</span>
                </div>
              </div>
            </div>

            {/* Right: ECG Risk Rationale & Clinical Implication */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Electrophysiologic Risk Stratification
              </h3>

              <div className={`p-4 rounded-xl border ${
                evaluation.ecgRisk.qrsRiskCategory === 'HIGH_VENTRICULAR_ARRHYTHMIA_RISK'
                  ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                  : evaluation.ecgRisk.qrsRiskCategory === 'INTERMEDIATE_SEIZURE_RISK'
                  ? 'bg-amber-950/60 border-amber-600 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              } space-y-2 text-xs`}>
                <div className="font-bold flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  QRS Risk Category: {evaluation.ecgRisk.qrsRiskCategory.replace(/_/g, ' ')}
                </div>
                <p>
                  Boehnert &amp; Love landmark study: QRS &gt;= 100 ms confers a 34% risk of generalized tonic-clonic seizures, while QRS &gt; 160 ms confers a 50%+ risk of life-threatening ventricular arrhythmias (VT/VFib).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="font-semibold text-amber-400">Lead aVR Terminal Rightward Axis Sign:</div>
                <p className="leading-relaxed">
                  {evaluation.ecgRisk.terminalAvrSignificance}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">Indications for Sodium Bicarbonate:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>QRS Duration &gt;= 100 ms</strong> in the presence of suspected or confirmed TCA poisoning.</li>
                  <li><strong>Terminal R wave &gt;= 3 mm in aVR</strong> or R/S ratio &gt;= 0.7.</li>
                  <li><strong>Hypotension</strong> refractory to initial crystalloid resuscitation.</li>
                  <li><strong>Ventricular Arrhythmias</strong> (monomorphic or polymorphic VT).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BICARBONATE TITRATION */}
        {activeTab === 'BICARBONATE_TITRATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                    Hypertonic Sodium Bicarbonate (8.4%) Titration Console
                  </h3>
                  <button
                    onClick={() => updateInput('isSodiumBicarbonateBolusGiven', !patientInput.isSodiumBicarbonateBolusGiven)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      patientInput.isSodiumBicarbonateBolusGiven
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {patientInput.isSodiumBicarbonateBolusGiven ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> BOLUS GIVEN
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> BOLUS PENDING
                      </>
                    )}
                  </button>
                </div>

                {/* Arterial pH Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Arterial pH (Blood Gas):</span>
                    <span className="text-cyan-400 font-bold">{patientInput.arterialPh.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="7.05"
                    max="7.65"
                    step="0.01"
                    value={patientInput.arterialPh}
                    onChange={(e) => updateInput('arterialPh', Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span className="text-rose-400">&lt; 7.30 (Acidemic Danger)</span>
                    <span className="text-emerald-400 font-semibold">7.50 - 7.55 (Therapeutic Window)</span>
                    <span className="text-amber-400">&gt; 7.55 (Alkalemic Ceiling)</span>
                  </div>
                </div>

                {/* Serum Potassium Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Serum Potassium (K+):</span>
                    <span className="text-purple-400 font-bold">{patientInput.serumPotassiumMeqL.toFixed(1)} mEq/L</span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="5.5"
                    step="0.1"
                    value={patientInput.serumPotassiumMeqL}
                    onChange={(e) => updateInput('serumPotassiumMeqL', Number(e.target.value))}
                    className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span className="text-rose-400">&lt; 3.5 (Hypokalemia Alert)</span>
                    <span className="text-emerald-400">4.0 - 4.5 (Target Range)</span>
                  </div>
                </div>

                {/* Continuous Infusion Toggle & Rate */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="bicarbInfusion" className="text-xs font-bold text-slate-200 cursor-pointer">
                      Continuous NaHCO3 Infusion Active
                    </label>
                    <input
                      type="checkbox"
                      id="bicarbInfusion"
                      checked={patientInput.isBicarbonateInfusionActive}
                      onChange={(e) => updateInput('isBicarbonateInfusionActive', e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="text-xs text-slate-300">
                    {evaluation.bicarbonate.continuousInfusionRecipe}
                  </div>
                </div>

                {/* Potassium Alert */}
                {evaluation.bicarbonate.potassiumGuardrailAlert && (
                  <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-600 text-amber-200 text-xs flex items-start gap-2.5 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{evaluation.bicarbonate.potassiumGuardrailAlert}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Calculated Orders */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Calculated Antidote Order
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">IV Bolus (8.4% NaHCO3)</div>
                    <div className="text-xl font-bold text-cyan-400 mt-0.5">
                      {evaluation.bicarbonate.recommendedBolusMeq} mEq IV Push
                    </div>
                    <div className="text-[10px] text-slate-500">
                      1-2 mEq/kg (approx 2 ampules of 50 mEq) over 2-3 minutes.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Target Arterial pH</div>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">
                      {evaluation.bicarbonate.targetPhRange}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Absolute ceiling: do NOT exceed pH 7.55!
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Target Serum Bicarbonate</div>
                    <div className="text-lg font-bold text-purple-400 mt-0.5">
                      {evaluation.bicarbonate.targetBicarbonateRange}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Prevents rebound acidemia and channel re-blockade.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TOXICODYNAMICS & RESUSCITATION */}
        {activeTab === 'TOXICODYNAMICS_RESUSCITATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingestion Details & Anticholinergic Toxidrome */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-400" />
                Ingestion Details &amp; Anticholinergic Exam
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">TCA Agent</label>
                  <select
                    value={patientInput.ingestedAgent}
                    onChange={(e) => updateInput('ingestedAgent', e.target.value as TcaAgent)}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  >
                    <option value="AMITRIPTYLINE">Amitriptyline</option>
                    <option value="NORTRIPTYLINE">Nortriptyline</option>
                    <option value="IMIPRAMINE">Imipramine</option>
                    <option value="DOXEPIN">Doxepin</option>
                    <option value="CLOMIPRAMINE">Clomipramine</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Estimated Dose (mg)</label>
                  <input
                    type="number"
                    value={patientInput.estimatedDoseMg}
                    onChange={(e) => updateInput('estimatedDoseMg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">GCS Score (3-15)</label>
                  <input
                    type="number"
                    value={patientInput.gcsScore}
                    onChange={(e) => updateInput('gcsScore', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Pupils (mm)</label>
                  <input
                    type="number"
                    value={patientInput.pupilDiameterMm}
                    onChange={(e) => updateInput('pupilDiameterMm', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Axillae</label>
                  <select
                    value={patientInput.axillaryMoisture}
                    onChange={(e) => updateInput('axillaryMoisture', e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="DRY_ANHIDROTIC">Dry / Anhidrotic</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label htmlFor="activeSeizures" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Active Seizures Present
                  </label>
                  <input
                    type="checkbox"
                    id="activeSeizures"
                    checked={patientInput.hasActiveSeizures}
                    onChange={(e) => updateInput('hasActiveSeizures', e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-[10px] text-amber-400 mt-1">
                  Seizures cause severe lactic acidosis which drives rapid cardiotoxic collapse!
                </div>
              </div>
            </div>

            {/* Resuscitation Therapeutics & Antiarrhythmics */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Vasopressors &amp; Antiarrhythmic Selection
              </h3>

              <div>
                <label className="text-xs text-slate-400">Vasopressor Selection (Alpha-1 Blockade Defense)</label>
                <select
                  value={patientInput.vasopressorActive}
                  onChange={(e) => updateInput('vasopressorActive', e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="NONE">None / Crystalloids Only</option>
                  <option value="NOREPINEPHRINE">Norepinephrine (Drug of Choice - Potent Alpha-1)</option>
                  <option value="EPINEPHRINE">Epinephrine (Beta-2 vasodilation warning)</option>
                  <option value="DOPAMINE">Dopamine (Ineffective for TCA alpha-blockade)</option>
                  <option value="PHENYLEPHRINE">Phenylephrine (Pure Alpha-1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Antiarrhythmic Administration</label>
                <select
                  value={patientInput.antiarrhythmicGiven}
                  onChange={(e) => updateInput('antiarrhythmicGiven', e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="NONE">None</option>
                  <option value="SODIUM_BICARBONATE">Sodium Bicarbonate (First-Line Antiarrhythmic)</option>
                  <option value="LIDOCAINE">Lidocaine (Class Ib - Safe Second-Line)</option>
                  <option value="PROCAINAMIDE_FLECAINIDE">Procainamide / Flecainide (STRICTLY CONTRAINDICATED!)</option>
                  <option value="AMIODARONE">Amiodarone (Compounds QTc prolongation)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Anticonvulsant Therapy</label>
                <select
                  value={patientInput.anticonvulsantGiven}
                  onChange={(e) => updateInput('anticonvulsantGiven', e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="NONE">None</option>
                  <option value="BENZODIAZEPINE">Benzodiazepines (Lorazepam / Midazolam - First-Line)</option>
                  <option value="PHENYTOIN">Phenytoin (STRICTLY CONTRAINDICATED!)</option>
                  <option value="PROPOFOL">Propofol (Refractory Status)</option>
                </select>
              </div>

              {/* Physostigmine Test Trigger */}
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800">
                <div className="flex items-center justify-between">
                  <label htmlFor="physostigmineTrap" className="text-xs font-bold text-rose-300 cursor-pointer">
                    Physostigmine Administered (Hazard Simulation)
                  </label>
                  <input
                    type="checkbox"
                    id="physostigmineTrap"
                    checked={patientInput.isPhysostigmineAttempted}
                    onChange={(e) => updateInput('isPhysostigmineAttempted', e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-[10px] text-rose-400 mt-1">
                  WARNING: Physostigmine produces catastrophic asystolic arrest in TCA overdose!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REFRACTORY RESCUE */}
        {activeTab === 'REFRACTORY_RESCUE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-rose-400" />
                  20% Intravenous Lipid Emulsion (ILE) Rescue
                </h3>
                <input
                  type="checkbox"
                  id="lipidRescue"
                  checked={patientInput.isLipidRescueActive}
                  onChange={(e) => updateInput('isLipidRescueActive', e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Lipid Sink Mechanism in TCA Toxicity:</div>
                <p className="text-slate-300 leading-relaxed">
                  TCAs are highly lipophilic molecules (Amitriptyline logP ~4.9). When infused, 20% Lipid Emulsion creates an intravascular lipid phase (the "lipid sink") that draws free, unbound drug molecules out of cardiac Purkinje and ventricular tissues into the circulation, accelerating cardiac conduction recovery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">ILE Protocol:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Bolus:</strong> 20% Lipid Emulsion 1.5 mL/kg IV push over 2-3 minutes.</li>
                  <li><strong>Infusion:</strong> 0.25 mL/kg/min continuous infusion.</li>
                  <li><strong>Indication:</strong> Hemodynamic collapse or refractory ventricular arrhythmias unresponsive to hypertonic NaHCO3.</li>
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HeartCrack className="w-4 h-4 text-cyan-400" />
                Venoarterial ECMO &amp; Refractory Cardiotoxicity
              </h3>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Bridge-to-Clearance Rationale:</div>
                <p className="text-slate-300 leading-relaxed">
                  Severe TCA poisoning results in profound, life-threatening cardiodepression; however, the underlying myocardium is structurally normal. Once the acute drug level is cleared by hepatic CYP2D6/CYP2C19 metabolism over 24-48 hours, cardiac function returns to baseline without permanent dysfunction.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">VA-ECMO Trigger Thresholds:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Refractory cardiogenic shock with MAP &lt; 55 mmHg despite high-dose Norepinephrine and NaHCO3.</li>
                  <li>Recurrent, intractable monomorphic or polymorphic ventricular arrhythmias.</li>
                  <li>Arterial lactate &gt;= 8.0 mmol/L with worsening refractory metabolic acidemia.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
