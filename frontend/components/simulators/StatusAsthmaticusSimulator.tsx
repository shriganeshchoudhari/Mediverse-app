'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wind,
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
  AsthmaSeverityGrade,
  AsthmaPatientInput,
  AirwayMechanicsOutput,
  DynamicHyperinflationOutput,
  AsthmaPharmacotherapyOutput,
  ComprehensiveAsthmaEvaluation,
  calculateAsthmaPbwKg,
  evaluateAirwayMechanics,
  evaluateDynamicHyperinflation,
  evaluateAsthmaPharmacotherapy,
  performAsthmaEvaluation,
  ASTHMA_PRESETS,
  AsthmaPreset,
} from '../../.gemini/skills/StatusAsthmaticusMechanicsEngine';

type TabMode = 'SYNTHESIS' | 'AIRWAY_PHENOTYPE' | 'DYNAMIC_HYPERINFLATION' | 'PHARMACOTHERAPY' | 'PERMISSIVE_HYPERCAPNIA';

export default function StatusAsthmaticusSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('SILENT_CHEST_IMPENDING_ARREST');
  const [activeTab, setActiveTab] = useState<TabMode>('SYNTHESIS');

  // Patient Input State
  const [patientInput, setPatientInput] = useState<AsthmaPatientInput>(
    ASTHMA_PRESETS[0].inputs
  );

  const handleSelectPreset = (preset: AsthmaPreset) => {
    setSelectedPresetId(preset.id);
    setPatientInput({ ...preset.inputs });
  };

  const updateInput = <K extends keyof AsthmaPatientInput>(key: K, value: AsthmaPatientInput[K]) => {
    setPatientInput((prev) => ({ ...prev, [key]: value }));
  };

  const pbwKg = useMemo(() => {
    return calculateAsthmaPbwKg(patientInput.heightCm, patientInput.gender);
  }, [patientInput.heightCm, patientInput.gender]);

  const evaluation: ComprehensiveAsthmaEvaluation = useMemo(() => {
    return performAsthmaEvaluation(patientInput);
  }, [patientInput]);

  const severityColor =
    evaluation.airwayMechanics.severityGrade === 'LIFE_THREATENING_SILENT_CHEST'
      ? 'text-rose-400 bg-rose-950/40 border-rose-800/80'
      : evaluation.airwayMechanics.severityGrade === 'SEVERE'
      ? 'text-amber-400 bg-amber-950/40 border-amber-800/80'
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80';

  const chartData = [
    {
      name: 'PEF (% Pred)',
      value: evaluation.airwayMechanics.pefPercentPredicted,
      target: 80,
      unit: '%',
    },
    {
      name: 'PaCO2 (mmHg)',
      value: patientInput.arterialPco2MmHg,
      target: 40,
      unit: 'mmHg',
    },
    {
      name: 'Total PEEP',
      value: evaluation.hyperinflation.totalPeepCmH2O,
      target: 5,
      unit: 'cmH2O',
    },
    {
      name: 'Venous Deficit',
      value: evaluation.hyperinflation.hemodynamicVenousReturnDeficitPercent,
      target: 0,
      unit: '%',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/simulators" className="hover:text-cyan-400 transition flex items-center gap-1">
              Simulators
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-300">Pulmonology &amp; Critical Care</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-cyan-400 font-medium">Status Asthmaticus &amp; Mechanics Workstation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <Wind className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              GINA &amp; NAEPP 2024 Guidelines
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              Track A64
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 shadow-inner">
                <Wind className="w-7 h-7" />
              </span>
              Acute Severe Asthma &amp; Status Asthmaticus Workstation
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
              Precision biophysical and respiratory mechanics engine for severe asthma exacerbations. Simulates Peak Expiratory Flow kinetics, dynamic hyperinflation / intrinsic Auto-PEEP, venous return depression, multimodal pharmacotherapy (Continuous SABA, SAMA, Steroids, IV Magnesium), and lung-protective ventilator titration with permissive hypercapnia.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 min-w-[280px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Clinical Challenge Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ASTHMA_PRESETS.map((p) => {
                const isActive = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium text-left transition border ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-600 text-cyan-200 shadow-sm'
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
          {/* Card 1: Airway Severity & PEF */}
          <div className={`p-4 rounded-xl border ${severityColor} transition shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Airway Severity</span>
              <Gauge className="w-4 h-4 opacity-70" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{evaluation.airwayMechanics.pefPercentPredicted}%</span>
              <span className="text-xs opacity-75">PEF Pred</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              {evaluation.airwayMechanics.severityGrade.replace(/_/g, ' ')}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              PEF: {patientInput.peakExpiratoryFlowLMin} / {patientInput.baselinePredictedPefLMin} L/min
            </div>
          </div>

          {/* Card 2: Gas Exchange & Crossover Risk */}
          <div className={`p-4 rounded-xl border ${
            evaluation.airwayMechanics.hypercapnicArrestRisk === 'IMMINENT_CRITICAL'
              ? 'bg-rose-950/50 border-rose-700 text-rose-200 animate-pulse'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">PaCO2 Crossover</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{patientInput.arterialPco2MmHg}</span>
              <span className="text-xs opacity-75">mmHg PaCO2</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              {evaluation.airwayMechanics.hypercapnicArrestRisk === 'IMMINENT_CRITICAL' ? 'Catastrophic Crossover' : 'Compensated Alkalosis'}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              pH: {patientInput.arterialPh.toFixed(2)} | PaO2: {patientInput.arterialPo2MmHg} mmHg
            </div>
          </div>

          {/* Card 3: Dynamic Hyperinflation & Total PEEP */}
          <div className={`p-4 rounded-xl border ${
            evaluation.hyperinflation.dynamicHyperinflationSeverity === 'SEVERE_CARDIOVASCULAR_COLLAPSE'
              ? 'bg-rose-950/50 border-rose-700 text-rose-200'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Total PEEP</span>
              <Wind className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{evaluation.hyperinflation.totalPeepCmH2O}</span>
              <span className="text-xs opacity-75">cmH2O</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              Auto-PEEP: {patientInput.measuredAutoPeepCmH2O} cmH2O
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              I:E Ratio: {evaluation.hyperinflation.inspiratoryToExpiratoryRatio}
            </div>
          </div>

          {/* Card 4: Hemodynamic Venous Return Deficit */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-800 text-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Preload Deficit</span>
              <HeartCrack className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-400">
                {evaluation.hyperinflation.hemodynamicVenousReturnDeficitPercent}%
              </span>
              <span className="text-xs text-slate-400">drop</span>
            </div>
            <div className="mt-1 text-xs font-medium text-slate-300 truncate">
              Pulsus Paradoxus: {patientInput.pulsusParadoxusMmHg} mmHg
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Barotrauma Risk: {evaluation.hyperinflation.barotraumaRiskPercent}%
            </div>
          </div>

          {/* Card 5: Pharmacotherapy Status */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-800 text-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pharmacotherapy</span>
              <Pill className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">
                {[
                  patientInput.isContinuousAlbuterolActive,
                  patientInput.isIpratropiumAdministered,
                  patientInput.isSystemicCorticosteroidGiven,
                  patientInput.isIvMagnesiumAdministered,
                ].filter(Boolean).length}
                /4
              </span>
              <span className="text-xs text-slate-400">Core Regimen</span>
            </div>
            <div className="mt-1 text-xs font-medium text-slate-300 truncate">
              {patientInput.isContinuousAlbuterolActive ? 'Continuous SABA' : 'Intermittent SABA'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              K+: {patientInput.serumPotassiumMeqL.toFixed(1)} mEq/L
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mt-8 overflow-x-auto pb-px">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis', icon: Activity },
            { id: 'AIRWAY_PHENOTYPE', label: 'Airway Phenotype & ABG', icon: Sliders },
            { id: 'DYNAMIC_HYPERINFLATION', label: 'Auto-PEEP & Ventilation', icon: Wind },
            { id: 'PHARMACOTHERAPY', label: 'Pharmacotherapy Escalation', icon: Pill },
            { id: 'PERMISSIVE_HYPERCAPNIA', label: 'Permissive Hypercapnia Protocol', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabMode)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold whitespace-nowrap rounded-t-lg transition border-b-2 ${
                  isActive
                    ? 'border-cyan-500 text-cyan-300 bg-slate-900/80 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
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
              {evaluation.criticalSafetyInterlocks.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-700/80 text-rose-200 shadow-lg">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-rose-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    Critical Asthma Interlocks &amp; Ventilator Hazards
                  </h3>
                  <div className="mt-3 space-y-2">
                    {evaluation.criticalSafetyInterlocks.map((interlock, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm bg-rose-900/30 p-2.5 rounded-lg border border-rose-800/40">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{interlock}</span>
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
                  {evaluation.immediateActionDirectives.map((directive, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{directive}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathophysiology & Hyperinflation Architecture */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Dynamic Hyperinflation &amp; Thoracoabdominal Mechanics
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      Airway Resistance &amp; Expiratory Trapping
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      Severe bronchoconstriction, mucosal edema, and mucous plugging dramatically prolong the expiratory time constant (Raw × Crs). When expiratory time is insufficient, air remains trapped behind collapsed small airways, stacking breath upon breath and elevating intrinsic Auto-PEEP.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      Cardiovascular Tamponade Physiology
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      Hyperinflated lungs compress the vena cava and right atrium, precipitating dramatic drops in right ventricular preload. Concurrently, high intrathoracic pressure increases RV afterload, bowing the interventricular septum into the LV (pulsus paradoxus &gt; 15 mmHg) and triggering sudden PEA arrest.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    The Lifesaving Ventilator Disconnect Maneuver:
                  </div>
                  <p className="leading-relaxed">
                    If an intubated asthmatic suffers acute severe hypotension or cardiac arrest, the primary etiology is dynamic hyperinflation cutting venous return - NOT tension pneumothorax or equipment failure. Instantly disconnect the endotracheal tube from the ventilator circuit and compress the chest. A prolonged rush of escaping gas will decompress the thorax, restoring preload and blood pressure within 30-60 seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar: Physiological Fingerprint & Pearls */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Airway &amp; Hemodynamic Fingerprint
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
                                ? entry.value < 40 ? '#f43f5e' : '#38bdf8'
                                : index === 1
                                ? entry.value >= 45 ? '#f43f5e' : '#10b981'
                                : index === 2
                                ? entry.value >= 15 ? '#fb923c' : '#a855f7'
                                : '#ec4899'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center text-[11px] text-slate-500">
                  Real-time normalized respiratory metrics
                </div>
              </div>

              {/* Clinical Pearls Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Status Asthmaticus Pearls
                </h3>
                <div className="mt-4 space-y-2.5">
                  {evaluation.clinicalPearls.map((pearl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{pearl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AIRWAY PHENOTYPE */}
        {activeTab === 'AIRWAY_PHENOTYPE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Demographics & Physical Examination */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                Demographics &amp; Bedside Auscultation
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Age (Years)</label>
                  <input
                    type="number"
                    value={patientInput.patientAgeYears}
                    onChange={(e) => updateInput('patientAgeYears', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Height (cm)</label>
                  <input
                    type="number"
                    value={patientInput.heightCm}
                    onChange={(e) => updateInput('heightCm', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">PBW (kg)</label>
                  <div className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-cyan-300 font-bold">
                    {pbwKg} kg
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Dyspnea / Speech Capacity</label>
                <select
                  value={patientInput.dyspneaGrade}
                  onChange={(e) => updateInput('dyspneaGrade', e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="CAN_SPEAK_SENTENCES">Speaks in Sentences (Mild/Moderate)</option>
                  <option value="CAN_SPEAK_PHRASES">Speaks in Phrases (Moderate/Severe)</option>
                  <option value="CAN_SPEAK_WORDS_ONLY">Monosyllabic / Words Only (Severe)</option>
                  <option value="SILENT_EXHAUSTED">Silent / Unable to Speak / Exhausted (Critical)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Auscultation Findings</label>
                <select
                  value={patientInput.auscultationFindings}
                  onChange={(e) => updateInput('auscultationFindings', e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="NORMAL_VESICULAR">Normal Vesicular Breath Sounds</option>
                  <option value="EXPIRATORY_WHEEZE">Expiratory Wheezing</option>
                  <option value="INSPIRATORY_EXPIRATORY_WHEEZE">Inspiratory &amp; Expiratory Wheezing</option>
                  <option value="SILENT_CHEST">"Silent Chest" (No Air Movement!)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Accessory Muscle Retractions</label>
                <select
                  value={patientInput.accessoryMuscleUse}
                  onChange={(e) => updateInput('accessoryMuscleUse', e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="NONE">None / Minimal</option>
                  <option value="MODERATE_INTERCOSTAL">Moderate Intercostal Retractions</option>
                  <option value="SEVERE_STERNOCLEIDOMASTOID">Severe Sternocleidomastoid &amp; Suprasternal Retractions</option>
                  <option value="PARADOXICAL_THORACOABDOMINAL">Paradoxical Thoracoabdominal Movement (Diaphragmatic Fatigue)</option>
                </select>
              </div>
            </div>

            {/* Right: Spirometry, Pulsus Paradoxus & Blood Gas */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                PEF Spirometry &amp; Arterial Blood Gas (ABG)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Measured PEF (L/min)</label>
                  <input
                    type="number"
                    value={patientInput.peakExpiratoryFlowLMin}
                    onChange={(e) => updateInput('peakExpiratoryFlowLMin', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Predicted PEF (L/min)</label>
                  <input
                    type="number"
                    value={patientInput.baselinePredictedPefLMin}
                    onChange={(e) => updateInput('baselinePredictedPefLMin', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Pulsus Paradoxus (SBP drop during inspiration):</span>
                  <span className="text-white font-bold">{patientInput.pulsusParadoxusMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={patientInput.pulsusParadoxusMmHg}
                  onChange={(e) => updateInput('pulsusParadoxusMmHg', Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>&lt; 10 (Normal)</span>
                  <span>12-15 (Severe)</span>
                  <span>&gt; 20 (Impending Arrest)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Arterial pH</label>
                  <input
                    type="number"
                    step="0.01"
                    value={patientInput.arterialPh}
                    onChange={(e) => updateInput('arterialPh', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">PaCO2 (mmHg)</label>
                  <input
                    type="number"
                    value={patientInput.arterialPco2MmHg}
                    onChange={(e) => updateInput('arterialPco2MmHg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                  {patientInput.arterialPco2MmHg >= 45 && (
                    <span className="text-[10px] text-rose-400 mt-1 block">
                      ⚠ Crossover Danger!
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-400">PaO2 (mmHg)</label>
                  <input
                    type="number"
                    value={patientInput.arterialPo2MmHg}
                    onChange={(e) => updateInput('arterialPo2MmHg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Serum K+ (mEq/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={patientInput.serumPotassiumMeqL}
                    onChange={(e) => updateInput('serumPotassiumMeqL', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Lactate (mmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={patientInput.serumLactateMmolL}
                    onChange={(e) => updateInput('serumLactateMmolL', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC HYPERINFLATION & AUTO-PEEP */}
        {activeTab === 'DYNAMIC_HYPERINFLATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ventilator Settings & Dynamic Hyperinflation */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  Mechanical Ventilation Console
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVent"
                    checked={patientInput.isMechanicallyVentilated}
                    onChange={(e) => updateInput('isMechanicallyVentilated', e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="isVent" className="text-xs text-slate-200 font-semibold cursor-pointer">
                    Intubated &amp; Ventilated
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Tidal Volume (mL)</label>
                  <input
                    type="number"
                    value={patientInput.ventilatorTidalVolumeMl}
                    onChange={(e) => updateInput('ventilatorTidalVolumeMl', Number(e.target.value))}
                    disabled={!patientInput.isMechanicallyVentilated}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white disabled:opacity-50"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {(patientInput.ventilatorTidalVolumeMl / Math.max(1, pbwKg)).toFixed(1)} mL/kg PBW
                  </span>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Set RR (bpm)</label>
                  <input
                    type="number"
                    value={patientInput.ventilatorRespiratoryRateBpm}
                    onChange={(e) => updateInput('ventilatorRespiratoryRateBpm', Number(e.target.value))}
                    disabled={!patientInput.isMechanicallyVentilated}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white disabled:opacity-50"
                  />
                  <span className="text-[10px] text-cyan-400 mt-0.5 block">Target: 8-12 bpm</span>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Inspiratory Flow (L/min)</label>
                  <input
                    type="number"
                    value={patientInput.inspiratoryFlowRateLMin}
                    onChange={(e) => updateInput('inspiratoryFlowRateLMin', Number(e.target.value))}
                    disabled={!patientInput.isMechanicallyVentilated}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white disabled:opacity-50"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Square Wave 80-100</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Applied PEEP (cmH2O)</label>
                  <input
                    type="number"
                    value={patientInput.appliedPeepCmH2O}
                    onChange={(e) => updateInput('appliedPeepCmH2O', Number(e.target.value))}
                    disabled={!patientInput.isMechanicallyVentilated}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Auto-PEEP (cmH2O)</label>
                  <input
                    type="number"
                    value={patientInput.measuredAutoPeepCmH2O}
                    onChange={(e) => updateInput('measuredAutoPeepCmH2O', Number(e.target.value))}
                    disabled={!patientInput.isMechanicallyVentilated}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Pplat (cmH2O)</label>
                  <input
                    type="number"
                    value={patientInput.measuredPlateauPressureCmH2O}
                    onChange={(e) => updateInput('measuredPlateauPressureCmH2O', Number(e.target.value))}
                    disabled={!patientInput.isMechanicallyVentilated}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-slate-200">Expiratory Time Constant Mechanics:</div>
                <p>
                  Computed I:E ratio: <strong className="text-cyan-400">{evaluation.hyperinflation.inspiratoryToExpiratoryRatio}</strong> (Expiratory time: {evaluation.hyperinflation.expiratoryTimeSeconds} seconds).
                  Asthma exacerbation requires at least 4.0 to 5.0 seconds of expiratory time per breath cycle to prevent dynamic hyperinflation and Auto-PEEP accumulation.
                </p>
              </div>
            </div>

            {/* Right: Circuit Disconnect & Preload Collapse Rescue */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Dynamic Hyperinflation Emergency Console
              </h3>

              {evaluation.hyperinflation.circuitDisconnectDirective ? (
                <div className="p-5 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-200 text-xs space-y-3 animate-pulse">
                  <div className="flex items-center gap-2 font-bold text-sm uppercase">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    EMERGENCY CIRCUIT DISCONNECT TRIGGERED
                  </div>
                  <p className="leading-relaxed">
                    {evaluation.hyperinflation.circuitDisconnectDirective}
                  </p>
                  <button
                    onClick={() => {
                      updateInput('measuredAutoPeepCmH2O', 4);
                      updateInput('ventilatorRespiratoryRateBpm', 10);
                      updateInput('appliedPeepCmH2O', 2);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                  >
                    Execute Circuit Disconnect &amp; Chest Compression
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Intrathoracic Preload Dynamics Intact
                  </div>
                  <p>
                    Total PEEP is {evaluation.hyperinflation.totalPeepCmH2O} cmH2O (Auto-PEEP {patientInput.measuredAutoPeepCmH2O} cmH2O). Hemodynamic venous return deficit is {evaluation.hyperinflation.hemodynamicVenousReturnDeficitPercent}%.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">Lung-Protective Limits:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Plateau Pressure (Pplat):</strong> Keep &lt; 30 cmH2O to prevent alveolar rupture.</li>
                  <li><strong>Peak Inspiratory Pressure (PIP):</strong> Elevated PIP (&gt; 50 cmH2O) is expected from massive airway resistance (Raw); it does not cause barotrauma as long as Pplat remains safe.</li>
                  <li><strong>Applied PEEP:</strong> Keep &le; 5 cmH2O. Unlike ARDS where PEEP recruits alveoli, in asthma applied PEEP only compounds intrinsic hyperinflation.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PHARMACOTHERAPY */}
        {activeTab === 'PHARMACOTHERAPY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Inhaled & Systemic Regimen */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                First-Line Bronchodilator Escalation
              </h3>

              {/* Continuous Albuterol */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="sabaActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Continuous Albuterol Nebulization
                  </label>
                  <input
                    type="checkbox"
                    id="sabaActive"
                    checked={patientInput.isContinuousAlbuterolActive}
                    onChange={(e) => updateInput('isContinuousAlbuterolActive', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-300">
                  {evaluation.pharmacotherapy.sabaTitration.doseRecommendation}
                </div>
                <div className="text-[11px] text-amber-400">
                  {evaluation.pharmacotherapy.sabaTitration.hypokalemiaPrecaution}
                </div>
              </div>

              {/* Ipratropium Bromide */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="samaActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Ipratropium Bromide (SAMA)
                  </label>
                  <input
                    type="checkbox"
                    id="samaActive"
                    checked={patientInput.isIpratropiumAdministered}
                    onChange={(e) => updateInput('isIpratropiumAdministered', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-300">
                  {evaluation.pharmacotherapy.anticholinergicGuidance.rationale}
                </div>
              </div>

              {/* Systemic Corticosteroids */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="steroidActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Systemic Corticosteroids
                  </label>
                  <input
                    type="checkbox"
                    id="steroidActive"
                    checked={patientInput.isSystemicCorticosteroidGiven}
                    onChange={(e) => updateInput('isSystemicCorticosteroidGiven', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-300">
                  {evaluation.pharmacotherapy.steroidGuidance.doseSchedule}
                </div>
                <div className="text-[11px] text-slate-400">
                  {evaluation.pharmacotherapy.steroidGuidance.onsetWindow}
                </div>
              </div>
            </div>

            {/* Second-Line & Parenteral Adjuvants */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Parenteral &amp; Second-Line Bronchodilators
              </h3>

              {/* IV Magnesium Sulfate */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="mgActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    IV Magnesium Sulfate (2.0 g)
                  </label>
                  <input
                    type="checkbox"
                    id="mgActive"
                    checked={patientInput.isIvMagnesiumAdministered}
                    onChange={(e) => updateInput('isIvMagnesiumAdministered', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-300">
                  {evaluation.pharmacotherapy.magnesiumGuidance.mechanism}
                </div>
              </div>

              {/* Parenteral Beta-Agonist */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="epiActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Parenteral Epinephrine / Terbutaline
                  </label>
                  <input
                    type="checkbox"
                    id="epiActive"
                    checked={patientInput.isTerbutalineOrEpiGiven}
                    onChange={(e) => updateInput('isTerbutalineOrEpiGiven', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-300">
                  {evaluation.pharmacotherapy.adjuvantParenteralGuidance.clinicalPearl}
                </div>
              </div>

              {/* Heliox (Helium-Oxygen Mixture) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="helioxActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Heliox 70:30 (He:O2) Mixture
                  </label>
                  <input
                    type="checkbox"
                    id="helioxActive"
                    checked={patientInput.isHelioxActive}
                    onChange={(e) => updateInput('isHelioxActive', e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-300">
                  Helium has approximately 1/3 the density of air. Breathing Heliox lowers the Reynolds number, converting turbulent flow in constricted large airways into laminar flow, significantly decreasing the patient's work of breathing.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PERMISSIVE HYPERCAPNIA */}
        {activeTab === 'PERMISSIVE_HYPERCAPNIA' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Permissive Hypercapnia Safe Targets
              </h3>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-700 text-xs text-cyan-200 space-y-2">
                <div className="font-bold uppercase tracking-wider">Protocol Philosophy:</div>
                <p className="leading-relaxed">
                  In acute severe status asthmaticus, attempting to normalize PaCO2 by increasing minute ventilation will inevitably cause catastrophic dynamic hyperinflation, tension pneumothorax, and cardiovascular collapse. We intentionally tolerate respiratory acidosis to protect the lung parenchyma.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase">Target Arterial pH</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">
                    {evaluation.permissiveHypercapniaGuidance.targetPhRange}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Buffer with NaHCO3 if pH &lt; 7.15</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase">Acceptable PaCO2</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    {evaluation.permissiveHypercapniaGuidance.targetPco2Range}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Well tolerated hemodynamically</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" />
                Contraindications to Permissive Hypercapnia
              </h3>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Conditions Where Hypercapnia is Dangerous:</div>
                <ul className="space-y-2 text-slate-300 mt-2">
                  {evaluation.permissiveHypercapniaGuidance.contraindications.map((contra, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">Cerebral Perfusion Caveat:</div>
                <p className="leading-relaxed">
                  Elevated PaCO2 produces potent cerebral arterial vasodilation, surging cerebral blood volume and dramatically escalating intracranial pressure (ICP). In patients with concomitant head trauma or intracranial pathology, permissive hypercapnia is strictly contraindicated.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
