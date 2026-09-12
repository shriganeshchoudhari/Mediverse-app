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
  ToxinClass,
  OverdosePatientInput,
  ShockSeverityEvaluation,
  HietDosingGuidance,
  AdjuvantTherapyEvaluation,
  ComprehensiveOverdoseEvaluation,
  evaluateShockSeverity,
  calculateHietDosing,
  evaluateAdjuvants,
  performOverdoseEvaluation,
  OVERDOSE_PRESETS,
  OverdosePreset,
} from '../../.gemini/skills/CcbBetaBlockerHietEngine';

type TabMode = 'SYNTHESIS' | 'TOXICOLOGY_PHENOTYPE' | 'HIET_TITRATION' | 'CALCIUM_ADJUVANTS' | 'REFRACTORY_RESCUE';

export default function CcbBetaBlockerHietSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('MASSIVE_VERAPAMIL_COLLAPSE');
  const [activeTab, setActiveTab] = useState<TabMode>('SYNTHESIS');

  // Interactive patient input state initialized to Preset 1
  const [patientInput, setPatientInput] = useState<OverdosePatientInput>(
    OVERDOSE_PRESETS[0].inputs
  );

  // Apply Preset
  const handleSelectPreset = (preset: OverdosePreset) => {
    setSelectedPresetId(preset.id);
    setPatientInput({ ...preset.inputs });
  };

  // Helper updater
  const updateInput = <K extends keyof OverdosePatientInput>(key: K, value: OverdosePatientInput[K]) => {
    setPatientInput((prev) => ({ ...prev, [key]: value }));
  };

  // Run comprehensive evaluation
  const evaluation: ComprehensiveOverdoseEvaluation = useMemo(() => {
    return performOverdoseEvaluation(patientInput);
  }, [patientInput]);

  const shockColor =
    evaluation.shockSeverity.severityCategory === 'REFRACTORY_CARDIOGENIC_COLLAPSE'
      ? 'text-rose-400 bg-rose-950/40 border-rose-800/80'
      : evaluation.shockSeverity.severityCategory === 'SEVERE_CARDIOGENIC_SHOCK'
      ? 'text-amber-400 bg-amber-950/40 border-amber-800/80'
      : evaluation.shockSeverity.severityCategory === 'MODERATE_TOXICITY'
      ? 'text-yellow-400 bg-yellow-950/40 border-yellow-800/80'
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80';

  const chartData = [
    {
      name: 'MAP (mmHg)',
      value: evaluation.shockSeverity.meanArterialPressureMmHg,
      target: 65,
      unit: 'mmHg',
    },
    {
      name: 'Shock Idx (x100)',
      value: Math.round(evaluation.shockSeverity.shockIndex * 100),
      target: 70,
      unit: 'x100',
    },
    {
      name: 'Glucose (mg/dL)',
      value: patientInput.bloodGlucoseMgDl,
      target: 200,
      unit: 'mg/dL',
    },
    {
      name: 'Lactate (x10)',
      value: Math.round(patientInput.serumLactateMmolL * 10),
      target: 20,
      unit: 'x10 mmol/L',
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
            <span className="text-rose-400 font-medium">CCB &amp; Beta-Blocker HIET Workstation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 flex items-center gap-1.5 shadow-sm">
              <Syringe className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ACMT &amp; EAPCCT High-Dose Insulin Guidelines
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              Track A63
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-400 shadow-inner">
                <HeartCrack className="w-7 h-7" />
              </span>
              Calcium Channel Blocker &amp; Beta-Blocker Toxicity Workstation
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
              Precision resuscitation engine for cardiovascular poisonings. Features High-Dose Insulin Euglycemia Therapy (HIET) titration (1 to 10 U/kg/h), dextrose clamp safety, potassium shifting defense, IV calcium salt stoichiometry (Chloride vs Gluconate), glucagon adenylyl cyclase bypass, and 20% Lipid Emulsion / VA-ECMO rescue interlocks.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 min-w-[280px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Clinical Challenge Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {OVERDOSE_PRESETS.map((p) => {
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
          {/* Card 1: Shock Severity & MAP */}
          <div className={`p-4 rounded-xl border ${shockColor} transition shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Hemodynamics</span>
              <Gauge className="w-4 h-4 opacity-70" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{evaluation.shockSeverity.meanArterialPressureMmHg}</span>
              <span className="text-xs opacity-75">mmHg MAP</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              {evaluation.shockSeverity.severityCategory.replace(/_/g, ' ')}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              BP: {patientInput.systolicBpMmHg}/{patientInput.diastolicBpMmHg} | HR: {patientInput.heartRateBpm} bpm
            </div>
          </div>

          {/* Card 2: HIET Insulin Inotrope Rate */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-800 text-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">HIET Rate</span>
              <Syringe className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-400">
                {patientInput.isHietInitiated ? patientInput.insulinInfusionRateUnitsKgH.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs text-slate-400">U/kg/h</span>
            </div>
            <div className="mt-1 text-xs font-medium text-slate-300 truncate">
              Total: {evaluation.hiet.currentInfusionDoseUnitsPerHour} U/h ({patientInput.patientWeightKg} kg)
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Bolus: {evaluation.hiet.recommendedBolusUnits} U IV Regular
            </div>
          </div>

          {/* Card 3: Dextrose Clamp State */}
          <div className={`p-4 rounded-xl border ${
            evaluation.hiet.dextroseSupportNeeds.hypoglycemiaWarning
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Blood Glucose</span>
              <Droplets className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{patientInput.bloodGlucoseMgDl}</span>
              <span className="text-xs opacity-75">mg/dL</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              Target: {evaluation.hiet.dextroseSupportNeeds.targetGlucoseRangeMgDl}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              Infusion: {evaluation.hiet.dextroseSupportNeeds.gramsDextrosePerHour} g/h Dextrose
            </div>
          </div>

          {/* Card 4: Potassium Homeostasis */}
          <div className={`p-4 rounded-xl border ${
            evaluation.hiet.potassiumGuardrail.hypokalemiaAlert
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Serum Potassium</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{patientInput.serumPotassiumMeqL.toFixed(1)}</span>
              <span className="text-xs opacity-75">mEq/L</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              Target: {evaluation.hiet.potassiumGuardrail.targetRangeMeqL}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              Intracellular shift defense
            </div>
          </div>

          {/* Card 5: Calcium & Adjuvants */}
          <div className={`p-4 rounded-xl border ${
            evaluation.adjuvants.calciumGuidance.safetyRouteWarning
              ? 'bg-rose-950/50 border-rose-700 text-rose-200 animate-pulse'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          } shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">IV Calcium</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">
                {evaluation.adjuvants.calciumGuidance.elementalCalciumMeqDelivered}
              </span>
              <span className="text-xs opacity-75">mEq Ca2+</span>
            </div>
            <div className="mt-1 text-xs font-medium truncate">
              {patientInput.calciumSaltType === 'CALCIUM_CHLORIDE' ? 'CaCl2 (13.6 mEq/g)' : 'Ca-Gluconate (4.65 mEq/g)'}
            </div>
            <div className="mt-1 text-[11px] opacity-75">
              {patientInput.hasCentralVenousAccess ? 'Central Line Confirmed' : 'Peripheral IV Only!'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mt-8 overflow-x-auto pb-px">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis', icon: Activity },
            { id: 'TOXICOLOGY_PHENOTYPE', label: 'Toxicology Phenotype', icon: Sliders },
            { id: 'HIET_TITRATION', label: 'HIET Titration Engine', icon: Syringe },
            { id: 'CALCIUM_ADJUVANTS', label: 'Calcium & Adjuvants', icon: Pill },
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
              {evaluation.criticalSafetyInterlocks.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-950/50 border border-rose-700/80 text-rose-200 shadow-lg">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-rose-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    Critical Toxicology Interlocks &amp; Safety Traps
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
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{directive}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biophysical & Cellular Defect Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Biophysical &amp; Cellular Metabolic Architecture
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      Glucose Dynamics
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      {evaluation.diagnosticHallmarks.expectedGlucoseTrend}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Cellular Metabolism Defect
                    </span>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      {evaluation.diagnosticHallmarks.cellularMetabolismDefect}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-rose-400" />
                    Mechanistic Inotropy of High-Dose Insulin (HIET):
                  </div>
                  <p className="leading-relaxed">
                    Under severe ischemic / toxic shock, stressed myocardium shifts from free fatty acid oxidation to carbohydrates as its primary energy substrate. CCBs and Beta-Blockers induce profound hypoinsulinemia and peripheral insulin resistance. HIET forces glucose into energy-starved cardiomyocytes, replenishing cytoplasmic ATP stores and restoring sarcoplasmic calcium handling without increasing myocardial oxygen consumption (MVO2) - in contrast to adrenergic inotropes.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar: Physiological Fingerprint Chart & Clinical Pearls */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Hemodynamic &amp; Metabolic Fingerprint
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
                                ? entry.value < 65 ? '#f43f5e' : '#10b981'
                                : index === 1
                                ? entry.value > 80 ? '#fb923c' : '#38bdf8'
                                : index === 2
                                ? entry.value > 250 ? '#f59e0b' : '#a855f7'
                                : '#ec4899'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center text-[11px] text-slate-500">
                  Real-time normalized biometric metrics
                </div>
              </div>

              {/* Clinical Pearls Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Toxicology Clinical Pearls
                </h3>
                <div className="mt-4 space-y-2.5">
                  {evaluation.clinicalPearls.map((pearl, idx) => (
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

        {/* TAB 2: TOXICOLOGY PHENOTYPE */}
        {activeTab === 'TOXICOLOGY_PHENOTYPE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Ingestion & Drug Classification */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-400" />
                Ingestion Details &amp; Agent Phenotype
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Patient Age (Years)</label>
                  <input
                    type="number"
                    value={patientInput.patientAgeYears}
                    onChange={(e) => updateInput('patientAgeYears', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Patient Weight (kg)</label>
                  <input
                    type="number"
                    value={patientInput.patientWeightKg}
                    onChange={(e) => updateInput('patientWeightKg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Toxin Classification</label>
                <select
                  value={patientInput.toxinClass}
                  onChange={(e) => updateInput('toxinClass', e.target.value as ToxinClass)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="CCB_NON_DIHYDROPYRIDINE">CCB: Non-Dihydropyridine (Verapamil, Diltiazem)</option>
                  <option value="CCB_DIHYDROPYRIDINE">CCB: Dihydropyridine (Amlodipine, Nifedipine)</option>
                  <option value="BETA_BLOCKER">Beta-Blocker (Propranolol, Metoprolol, Atenolol)</option>
                  <option value="MIXED_INGESTION">Mixed Ingestion (CCB + Beta-Blocker)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Specific Drug</label>
                  <input
                    type="text"
                    value={patientInput.specificDrug}
                    onChange={(e) => updateInput('specificDrug', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Ingested Dose (mg)</label>
                  <input
                    type="number"
                    value={patientInput.estimatedIngestionDoseMg}
                    onChange={(e) => updateInput('estimatedIngestionDoseMg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Hours Post-Ingestion</label>
                  <input
                    type="number"
                    value={patientInput.hoursPostIngestion}
                    onChange={(e) => updateInput('hoursPostIngestion', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="erForm"
                    checked={patientInput.isExtendedReleaseFormulation}
                    onChange={(e) => updateInput('isExtendedReleaseFormulation', e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="erForm" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Extended-Release (SR/CD/XL)
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Hemodynamics & Laboratory Parameters */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Cardiovascular Hemodynamics &amp; Biomarkers
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={patientInput.heartRateBpm}
                    onChange={(e) => updateInput('heartRateBpm', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={patientInput.systolicBpMmHg}
                    onChange={(e) => updateInput('systolicBpMmHg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={patientInput.diastolicBpMmHg}
                    onChange={(e) => updateInput('diastolicBpMmHg', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400">QRS Duration (ms)</label>
                  <input
                    type="number"
                    value={patientInput.qrsIntervalMs}
                    onChange={(e) => updateInput('qrsIntervalMs', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                  {patientInput.qrsIntervalMs > 120 && (
                    <span className="text-[10px] text-amber-400 mt-1 block">
                      ⚠ Sodium-channel blockade effect!
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-400">QTc Interval (ms)</label>
                  <input
                    type="number"
                    value={patientInput.qtcIntervalMs}
                    onChange={(e) => updateInput('qtcIntervalMs', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={patientInput.bloodGlucoseMgDl}
                    onChange={(e) => updateInput('bloodGlucoseMgDl', Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
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

              <div className="pt-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <input
                    type="checkbox"
                    id="centralAccess"
                    checked={patientInput.hasCentralVenousAccess}
                    onChange={(e) => updateInput('hasCentralVenousAccess', e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="centralAccess" className="text-xs text-slate-200 font-medium cursor-pointer">
                    Central Venous Access Established (CVC / PICC)
                  </label>
                </div>
                {!patientInput.hasCentralVenousAccess && (
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    Note: Calcium chloride and concentrated dextrose (D20W/D50W) require central line access.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HIET TITRATION ENGINE */}
        {activeTab === 'HIET_TITRATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* HIET Control Console */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-rose-400" />
                    High-Dose Insulin Euglycemia Therapy (HIET) Protocol Console
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateInput('isHietInitiated', !patientInput.isHietInitiated)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        patientInput.isHietInitiated
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {patientInput.isHietInitiated ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> HIET ACTIVE
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> HIET STOPPED
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dosing Sliders */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                      <span>Insulin Infusion Rate:</span>
                      <span className="text-rose-400 font-bold">{patientInput.insulinInfusionRateUnitsKgH.toFixed(1)} U/kg/h</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10.0"
                      step="0.5"
                      value={patientInput.insulinInfusionRateUnitsKgH}
                      onChange={(e) => updateInput('insulinInfusionRateUnitsKgH', Number(e.target.value))}
                      disabled={!patientInput.isHietInitiated}
                      className="w-full accent-rose-500 bg-slate-800 rounded-lg h-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>0.5 U/kg/h (Start)</span>
                      <span>1.0 U/kg/h (Standard)</span>
                      <span>5.0 U/kg/h (Refractory)</span>
                      <span>10.0 U/kg/h (Ceiling)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                      <span>Dextrose Infusion Rate (Clamp Support):</span>
                      <span className="text-amber-400 font-bold">{patientInput.dextroseInfusionRateGKgH.toFixed(2)} g/kg/h</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={patientInput.dextroseInfusionRateGKgH}
                      onChange={(e) => updateInput('dextroseInfusionRateGKgH', Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>0.1 g/kg/h (Minimal)</span>
                      <span>0.25 g/kg/h (Basal HIET)</span>
                      <span>0.50 g/kg/h (Standard)</span>
                      <span>1.0 g/kg/h (Maximal)</span>
                    </div>
                  </div>
                </div>

                {/* Action Directives / Advice */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-400" />
                    Titration &amp; Kinetics Guidance:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {evaluation.hiet.titrationAdvice}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Onset timeline: <strong className="text-rose-300">{evaluation.hiet.onsetOfInotropicEffectTimeframe}</strong>
                  </div>
                </div>
              </div>

              {/* Warnings & Guardrails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Glucose Alert */}
                <div className={`p-4 rounded-xl border ${
                  evaluation.hiet.dextroseSupportNeeds.hypoglycemiaWarning
                    ? 'bg-rose-950/50 border-rose-700 text-rose-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    <Droplets className="w-4 h-4 text-amber-400" />
                    Dextrose Clamp Protocol
                  </div>
                  <div className="mt-2 text-xs leading-relaxed">
                    {evaluation.hiet.dextroseSupportNeeds.hypoglycemiaWarning ? (
                      <span className="font-bold text-rose-400">
                        {evaluation.hiet.dextroseSupportNeeds.hypoglycemiaWarning}
                      </span>
                    ) : (
                      <span>
                        Euglycemia clamp intact. Target {evaluation.hiet.dextroseSupportNeeds.targetGlucoseRangeMgDl}. Check point-of-care glucose Q15-30m during titration.
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Concentration recommended: <strong>{evaluation.hiet.dextroseSupportNeeds.recommendedDextroseConcentration}</strong>
                  </div>
                </div>

                {/* Potassium Alert */}
                <div className={`p-4 rounded-xl border ${
                  evaluation.hiet.potassiumGuardrail.hypokalemiaAlert
                    ? 'bg-amber-950/50 border-amber-700 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Potassium Shifting Defense
                  </div>
                  <div className="mt-2 text-xs leading-relaxed">
                    {evaluation.hiet.potassiumGuardrail.hypokalemiaAlert ? (
                      <span className="font-bold text-amber-400">
                        {evaluation.hiet.potassiumGuardrail.hypokalemiaAlert}
                      </span>
                    ) : (
                      <span>{evaluation.hiet.potassiumGuardrail.supplementationAdvice}</span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Target: <strong>{evaluation.hiet.potassiumGuardrail.targetRangeMeqL}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: HIET Infusion Calculation Summary */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-rose-400" />
                  Calculated HIET Infusion Order
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">IV Bolus (Regular Insulin)</div>
                    <div className="text-xl font-bold text-rose-400 mt-0.5">
                      {evaluation.hiet.recommendedBolusUnits} Units IV Push
                    </div>
                    <div className="text-[10px] text-slate-500">Fixed 1.0 U/kg (administered over 5 min)</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Current Continuous Infusion</div>
                    <div className="text-xl font-bold text-rose-400 mt-0.5">
                      {evaluation.hiet.currentInfusionDoseUnitsPerHour} Units / hour
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Based on {patientInput.insulinInfusionRateUnitsKgH.toFixed(1)} U/kg/h × {patientInput.patientWeightKg} kg
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Maximum Titration Cap</div>
                    <div className="text-lg font-bold text-amber-400 mt-0.5">
                      {evaluation.hiet.maximalTitrationCapUnitsPerHour} Units / hour
                    </div>
                    <div className="text-[10px] text-slate-500">Absolute ceiling (10.0 U/kg/h)</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Dextrose Delivery Requirement</div>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">
                      {evaluation.hiet.dextroseSupportNeeds.gramsDextrosePerHour} grams / hour
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Requires central line for D20W or D50W to avoid severe fluid overload.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CALCIUM & ADJUVANTS */}
        {activeTab === 'CALCIUM_ADJUVANTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IV Calcium Administration & Stoichiometry */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  IV Calcium Salt Administration
                </h3>
                <input
                  type="checkbox"
                  id="ivCaCheck"
                  checked={patientInput.isIvCalciumAdministered}
                  onChange={(e) => updateInput('isIvCalciumAdministered', e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-700"
                />
              </div>

              {/* Salt Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateInput('calciumSaltType', 'CALCIUM_CHLORIDE')}
                  className={`p-3 rounded-xl border text-left transition ${
                    patientInput.calciumSaltType === 'CALCIUM_CHLORIDE'
                      ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-xs">Calcium Chloride 10%</div>
                  <div className="text-[10px] mt-1 text-slate-400">13.6 mEq Ca2+ per gram</div>
                  <div className="text-[10px] text-amber-400 mt-1 font-semibold">Central Line Mandatory!</div>
                </button>

                <button
                  onClick={() => updateInput('calciumSaltType', 'CALCIUM_GLUCONATE')}
                  className={`p-3 rounded-xl border text-left transition ${
                    patientInput.calciumSaltType === 'CALCIUM_GLUCONATE'
                      ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-xs">Calcium Gluconate 10%</div>
                  <div className="text-[10px] mt-1 text-slate-400">4.65 mEq Ca2+ per gram</div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Peripheral Route Safe</div>
                </button>
              </div>

              {/* Dose Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>Administered Calcium Dose:</span>
                  <span className="text-white font-bold">{patientInput.calciumDoseGrams.toFixed(1)} grams</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.5"
                  value={patientInput.calciumDoseGrams}
                  onChange={(e) => updateInput('calciumDoseGrams', Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1.0 g</span>
                  <span>2.0 g</span>
                  <span>3.0 g (Standard)</span>
                  <span>5.0 g (Max)</span>
                </div>
              </div>

              {/* Calcium Safety Warning */}
              {evaluation.adjuvants.calciumGuidance.safetyRouteWarning && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-200 text-xs flex items-start gap-2.5 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">LETHAL VESICANT INTERLOCK TRIPPED:</span>
                    {evaluation.adjuvants.calciumGuidance.safetyRouteWarning}
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-slate-200">Calcium Efficacy Rationale:</div>
                <p>{evaluation.adjuvants.calciumGuidance.efficacyNote}</p>
              </div>
            </div>

            {/* Glucagon & Vasopressor Titration */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Glucagon &amp; Vasopressor Therapeutics
              </h3>

              {/* Glucagon Section */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Glucagon IV Administration</span>
                  <input
                    type="checkbox"
                    id="glucagonCheck"
                    checked={patientInput.isGlucagonAdministered}
                    onChange={(e) => updateInput('isGlucagonAdministered', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="text-xs text-slate-300">
                  {evaluation.adjuvants.glucagonGuidance.dosingRationale}
                </div>

                {patientInput.isGlucagonAdministered && (
                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{evaluation.adjuvants.glucagonGuidance.emesisAspirationRisk}</span>
                  </div>
                )}
              </div>

              {/* Vasopressor Selection */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200">Active Inotrope / Vasopressor</div>
                <select
                  value={patientInput.vasopressorActive}
                  onChange={(e) => updateInput('vasopressorActive', e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="NONE">None / Crystalloid Only</option>
                  <option value="NOREPINEPHRINE">Norepinephrine (Potent Alpha-1 Vasoconstrictor)</option>
                  <option value="EPINEPHRINE">Epinephrine (Mixed Inotrope / Vasoconstrictor)</option>
                  <option value="VASOPRESSIN">Vasopressin (V1 Non-Adrenergic Vasoconstrictor)</option>
                </select>

                <div className="text-xs text-slate-300 pt-1">
                  <strong>Guideline Recommendation:</strong> {evaluation.adjuvants.vasopressorGuidance.recommendedAgent}
                </div>
                <div className="text-[11px] text-slate-400">
                  {evaluation.adjuvants.vasopressorGuidance.rationale}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REFRACTORY RESCUE */}
        {activeTab === 'REFRACTORY_RESCUE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 20% Intravenous Lipid Emulsion (ILE) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-rose-400" />
                  20% Intravenous Lipid Emulsion (ILE) Rescue
                </h3>
                <input
                  type="checkbox"
                  id="lipidCheck"
                  checked={patientInput.isLipidRescueConsidered}
                  onChange={(e) => updateInput('isLipidRescueConsidered', e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-700"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">ACMT &amp; EAPCCT ILE Indications:</div>
                <p className="text-slate-300 leading-relaxed">
                  {evaluation.adjuvants.refractoryRescue.ileRationale}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">ILE Dosing Protocol:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Bolus:</strong> 20% Lipid Emulsion 1.5 mL/kg IV over 2-3 minutes.</li>
                  <li><strong>Infusion:</strong> 0.25 mL/kg/min continuous infusion (can titrate to 0.5 mL/kg/min).</li>
                  <li><strong>Max Dose:</strong> Maximum 10-12 mL/kg over initial 24 hours to prevent pancreatitis and hypertriglyceridemia.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
                <strong>Lipophilicity Sink Mechanics:</strong> Verapamil (LogP ~3.8) and Propranolol (LogP ~3.5) exhibit highest partition coefficients into lipid micelles, pulling unbound drug out of myocardial tissue. In contrast, hydrophilic drugs (Atenolol LogP ~0.16) derive negligible benefit from ILE.
              </div>
            </div>

            {/* Venoarterial Extracorporeal Membrane Oxygenation (VA-ECMO) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HeartCrack className="w-4 h-4 text-cyan-400" />
                Extracorporeal Life Support (VA-ECMO / ECLS)
              </h3>

              <div className={`p-4 rounded-xl border ${
                evaluation.adjuvants.refractoryRescue.isVaEcmoIndicated
                  ? 'bg-cyan-950/50 border-cyan-700 text-cyan-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              } text-xs space-y-2`}>
                <div className="font-bold flex items-center gap-2 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  ECMO Candidate Status: {evaluation.adjuvants.refractoryRescue.isVaEcmoIndicated ? 'INDICATED' : 'NOT CURRENTLY INDICATED'}
                </div>
                <p className="leading-relaxed">
                  {evaluation.adjuvants.refractoryRescue.ecmoCriteria}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">Bridge-to-Clearance Principle:</div>
                <p className="leading-relaxed">
                  Unlike cardiogenic shock from acute myocardial infarction where dead myocardium cannot regenerate, toxicological cardiogenic shock represents poisoned but structurally intact myocardium. If vital organ perfusion is maintained via VA-ECMO or HIET for 24-72 hours, hepatic and renal clearance will eliminate the toxin, permitting complete myocardial recovery without residual ejection fraction impairment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
