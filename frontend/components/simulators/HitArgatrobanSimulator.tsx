'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pill,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Stethoscope,
  Info,
  Clock,
  TrendingDown,
  RefreshCw,
  Layers,
  ArrowRight,
  Gauge,
  HelpCircle,
  FileText,
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
  HitProbabilityCategory,
  PlateletDropCategory,
  TimingCategory,
  ThrombosisCategory,
  OtherCausesCategory,
  DtiAgent,
  HitPatientInput,
  FourTsScoreResult,
  HitSerologyEvaluation,
  DtiDosingPlan,
  HitComprehensiveOutput,
  calculate4TsScore,
  evaluateHitSerology,
  calculateDtiDosing,
  performHitEvaluation,
  HIT_PRESETS,
  HitPreset,
} from '../../.gemini/skills/HitArgatrobanEngine';

export default function HitArgatrobanSimulator() {
  // 4Ts Inputs
  const [plateletDropCategory, setPlateletDropCategory] =
    useState<PlateletDropCategory>('DROP_GT_50_NADIR_GE_20');
  const [timingCategory, setTimingCategory] =
    useState<TimingCategory>('DAY_5_TO_10_OR_RAPID_WITHIN_30D');
  const [thrombosisCategory, setThrombosisCategory] =
    useState<ThrombosisCategory>('CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION');
  const [otherCausesCategory, setOtherCausesCategory] =
    useState<OtherCausesCategory>('NONE_EVIDENT');

  // Platelet Counts & Demographics
  const [patientAgeYears, setPatientAgeYears] = useState<number>(64);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(74);
  const [baselinePlatelets10e9L, setBaselinePlatelets10e9L] = useState<number>(260);
  const [currentPlatelets10e9L, setCurrentPlatelets10e9L] = useState<number>(72);
  const [daysSinceHeparinExposure, setDaysSinceHeparinExposure] = useState<number>(7);
  const [hadHeparinInPast30Days, setHadHeparinInPast30Days] = useState<boolean>(false);
  const [hadHeparinInPast31To100Days, setHadHeparinInPast31To100Days] = useState<boolean>(false);

  // Serology & SRA
  const [antiPf4ElisaOpticalDensity, setAntiPf4ElisaOpticalDensity] = useState<number>(2.34);
  const [isSraPositiveLowHeparin, setIsSraPositiveLowHeparin] = useState<boolean>(true);
  const [isSraInhibitedHighHeparin, setIsSraInhibitedHighHeparin] = useState<boolean>(true);

  // Organ Function & DTI
  const [serumTotalBilirubinMgDl, setSerumTotalBilirubinMgDl] = useState<number>(0.8);
  const [hasSevereHepaticImpairmentOrShock, setHasSevereHepaticImpairmentOrShock] =
    useState<boolean>(false);
  const [creatinineClearanceMlMin, setCreatinineClearanceMlMin] = useState<number>(68);
  const [baselineApttSeconds, setBaselineApttSeconds] = useState<number>(30);
  const [currentApttSeconds, setCurrentApttSeconds] = useState<number>(32);

  // Active Pharmacotherapy & Safety States
  const [activeAnticoagulant, setActiveAnticoagulant] = useState<DtiAgent>('ARGATROBAN');
  const [currentDtiDose, setCurrentDtiDose] = useState<number>(2.0);
  const [isPlateletTransfusionGiven, setIsPlateletTransfusionGiven] = useState<boolean>(false);
  const [isWarfarinActiveInAcutePhase, setIsWarfarinActiveInAcutePhase] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'SYNTHESIS' | 'FOUR_TS' | 'SEROLOGY' | 'DTI_TITRATION' | 'WARFARIN_SAFETY'
  >('SYNTHESIS');

  // Load Preset
  const applyPreset = (preset: HitPreset) => {
    const inp = preset.inputs;
    setPatientAgeYears(inp.patientAgeYears);
    setPatientWeightKg(inp.patientWeightKg);
    setBaselinePlatelets10e9L(inp.baselinePlatelets10e9L);
    setCurrentPlatelets10e9L(inp.currentPlatelets10e9L);
    setDaysSinceHeparinExposure(inp.daysSinceHeparinExposure);
    setHadHeparinInPast30Days(inp.hadHeparinInPast30Days);
    setHadHeparinInPast31To100Days(inp.hadHeparinInPast31To100Days);
    setPlateletDropCategory(inp.plateletDropCategory);
    setTimingCategory(inp.timingCategory);
    setThrombosisCategory(inp.thrombosisCategory);
    setOtherCausesCategory(inp.otherCausesCategory);
    setAntiPf4ElisaOpticalDensity(inp.antiPf4ElisaOpticalDensity ?? 0.2);
    setIsSraPositiveLowHeparin(inp.isSraPositiveLowHeparin ?? false);
    setIsSraInhibitedHighHeparin(inp.isSraInhibitedHighHeparin ?? false);
    setSerumTotalBilirubinMgDl(inp.serumTotalBilirubinMgDl);
    setHasSevereHepaticImpairmentOrShock(inp.hasSevereHepaticImpairmentOrShock);
    setCreatinineClearanceMlMin(inp.creatinineClearanceMlMin);
    setBaselineApttSeconds(inp.baselineApttSeconds);
    setCurrentApttSeconds(inp.currentApttSeconds);
    setActiveAnticoagulant(inp.activeAnticoagulant);
    setCurrentDtiDose(inp.currentDtiDose);
    setIsPlateletTransfusionGiven(inp.isPlateletTransfusionGiven);
    setIsWarfarinActiveInAcutePhase(inp.isWarfarinActiveInAcutePhase);
  };

  // Compile Current Patient Input
  const currentInput: HitPatientInput = useMemo(() => {
    return {
      patientAgeYears,
      patientWeightKg,
      baselinePlatelets10e9L,
      currentPlatelets10e9L,
      daysSinceHeparinExposure,
      hadHeparinInPast30Days,
      hadHeparinInPast31To100Days,
      plateletDropCategory,
      timingCategory,
      thrombosisCategory,
      otherCausesCategory,
      antiPf4ElisaOpticalDensity,
      isSraPositiveLowHeparin,
      isSraInhibitedHighHeparin,
      serumTotalBilirubinMgDl,
      hasSevereHepaticImpairmentOrShock,
      creatinineClearanceMlMin,
      baselineApttSeconds,
      currentApttSeconds,
      activeAnticoagulant,
      currentDtiDose,
      isPlateletTransfusionGiven,
      isWarfarinActiveInAcutePhase,
    };
  }, [
    patientAgeYears,
    patientWeightKg,
    baselinePlatelets10e9L,
    currentPlatelets10e9L,
    daysSinceHeparinExposure,
    hadHeparinInPast30Days,
    hadHeparinInPast31To100Days,
    plateletDropCategory,
    timingCategory,
    thrombosisCategory,
    otherCausesCategory,
    antiPf4ElisaOpticalDensity,
    isSraPositiveLowHeparin,
    isSraInhibitedHighHeparin,
    serumTotalBilirubinMgDl,
    hasSevereHepaticImpairmentOrShock,
    creatinineClearanceMlMin,
    baselineApttSeconds,
    currentApttSeconds,
    activeAnticoagulant,
    currentDtiDose,
    isPlateletTransfusionGiven,
    isWarfarinActiveInAcutePhase,
  ]);

  // Comprehensive Evaluation
  const evaluation: HitComprehensiveOutput = useMemo(() => {
    return performHitEvaluation(currentInput);
  }, [currentInput]);

  const { fourTs, serology, dtiPlan, safetyInterlocks } = evaluation;

  // Percentage Drop in Platelets
  const plateletPercentDrop = useMemo(() => {
    const base = Math.max(1, baselinePlatelets10e9L);
    const drop = Math.round(((base - currentPlatelets10e9L) / base) * 100);
    return Math.max(0, drop);
  }, [baselinePlatelets10e9L, currentPlatelets10e9L]);

  // Probability category theme helper
  const getProbabilityTheme = (cat: HitProbabilityCategory) => {
    switch (cat) {
      case 'HIGH_PROBABILITY':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'INTERMEDIATE_PROBABILITY':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'LOW_PROBABILITY':
      default:
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
    }
  };

  const probTheme = getProbabilityTheme(fourTs.probabilityCategory);

  // ELISA Chart Data
  const elisaChartData = useMemo(() => {
    return [
      { name: 'Negative Cutoff', value: 0.4, fill: '#3b82f6' },
      { name: 'Patient OD', value: antiPf4ElisaOpticalDensity, fill: antiPf4ElisaOpticalDensity >= 2.0 ? '#ef4444' : antiPf4ElisaOpticalDensity >= 0.4 ? '#f59e0b' : '#22c55e' },
      { name: 'High Specificity (2.0)', value: 2.0, fill: '#6366f1' },
    ];
  }, [antiPf4ElisaOpticalDensity]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/simulators" className="hover:text-slate-200 transition">
            Simulators
          </Link>
          <span>/</span>
          <span className="text-amber-400 font-medium">
            Heparin-Induced Thrombocytopenia (HIT) &amp; Argatroban
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-rose-950/40 border border-amber-800/40 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    Heparin-Induced Thrombocytopenia (HIT) Precision Workstation
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ASH 2018 • CHEST 2021
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Comprehensive hematology &amp; critical care solver: Warkentin 4Ts score stratification, quantitative anti-PF4 ELISA optical density vs. functional Serotonin Release Assay (SRA), organ-adjusted Direct Thrombin Inhibitor dosing (Argatroban vs Bivalirudin), and critical Warfarin gangrene &amp; platelet transfusion safeguards.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => applyPreset(HIT_PRESETS[0])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Presets
              </button>
            </div>
          </div>

          {/* Quick Presets Ribbon */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Clinical Presets:
            </span>
            {HIT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-amber-500/50 transition flex items-center gap-2 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-medium">{preset.name.split('(')[0]}</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">({preset.badge})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Executive Summary Cards Grid (5 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: 4Ts Score */}
          <div className={`p-4 rounded-xl border ${probTheme.border} ${probTheme.bg} space-y-2 shadow-lg`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">4Ts Probability</span>
              <Activity className={`w-4 h-4 ${probTheme.text}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black ${probTheme.text}`}>
                {fourTs.totalScore} / 8 <span className="text-xs font-semibold">pts</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {fourTs.probabilityCategory.replace('_', ' ')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Prevalence:</span>
              <span className={`font-semibold ${probTheme.text}`}>~{fourTs.estimatedHitPrevalencePercent}% Risk</span>
            </div>
          </div>

          {/* Card 2: Platelet Dynamics */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platelet Drop</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-rose-300">
                {currentPlatelets10e9L} <span className="text-xs text-slate-400 font-normal">× 10⁹/L</span>
              </span>
              <span className="text-xs text-slate-400">
                {baselinePlatelets10e9L} → {currentPlatelets10e9L} ({plateletPercentDrop}% drop)
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Exposure Day:</span>
              <span className="font-semibold text-slate-200">Day {daysSinceHeparinExposure}</span>
            </div>
          </div>

          {/* Card 3: Serology & SRA */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ELISA &amp; SRA</span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-cyan-300">
                OD {antiPf4ElisaOpticalDensity.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">
                SRA: {serology.sraResult === 'CONFIRMED_HIT' ? 'Confirmed (+)' : serology.sraResult === 'NEGATIVE' ? 'Negative (-)' : 'Pending / Not Ordered'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Specificity:</span>
              <span className="font-semibold text-cyan-400">
                {antiPf4ElisaOpticalDensity >= 2.0 ? '>95% (Strong)' : antiPf4ElisaOpticalDensity >= 0.4 ? '~50-80%' : '>99% NPV'}
              </span>
            </div>
          </div>

          {/* Card 4: DTI Regimen */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">DTI Anticoagulation</span>
              <Pill className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-violet-300">
                {dtiPlan.selectedAgent}
              </span>
              <span className="text-xs text-slate-400">
                Initial: {dtiPlan.initialRecommendedDose} {dtiPlan.doseUnit}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Target aPTT:</span>
              <span className="font-medium text-slate-300">{dtiPlan.targetApttRangeSeconds.split('(')[0]}</span>
            </div>
          </div>

          {/* Card 5: Safety Guardrails */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Safety Safeguards</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-300 truncate">
                {safetyInterlocks.length > 0 ? `${safetyInterlocks.length} Interlock(s) Active!` : 'All Interlocks Clear'}
              </span>
              <span className="text-xs text-slate-400">
                {isPlateletTransfusionGiven ? 'Platelet Transfused!' : isWarfarinActiveInAcutePhase ? 'Warfarin Active!' : 'Heparin Discontinued'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Warfarin Trap:</span>
              <span className={`font-semibold ${isWarfarinActiveInAcutePhase ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isWarfarinActiveInAcutePhase ? 'GANGRENE RISK' : 'Protected'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-thin">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis & Protocol', icon: Layers },
            { id: 'FOUR_TS', label: '4Ts Scoring Calculator', icon: Activity },
            { id: 'SEROLOGY', label: 'Anti-PF4 ELISA & SRA Bench', icon: FileText },
            { id: 'DTI_TITRATION', label: 'Argatroban vs Bivalirudin Dosing', icon: Pill },
            { id: 'WARFARIN_SAFETY', label: 'The Warfarin Gangrene Trap', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Clinical Synthesis & Protocol */}
        {activeTab === 'SYNTHESIS' && (
          <div className="space-y-6">
            {/* Safety Interlocks Banners */}
            {safetyInterlocks.length > 0 && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-6 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Critical HIT Safety Interlocks Triggered</span>
                </div>
                {safetyInterlocks.map((interlock, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/40 text-xs md:text-sm text-rose-200 leading-relaxed font-medium">
                    {interlock}
                  </div>
                ))}
              </div>
            )}

            {/* Immediate Action Checklist */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Immediate Action Checklist &amp; Anticoagulation Directives</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.immediateActionChecklist.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Flowchart Cards */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Evidence-Based HIT Algorithmic Workflow (ASH 2018)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                  <span className="font-bold text-emerald-400 text-sm">Low Probability (4Ts 0 - 3)</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Negative predictive value &gt;99%. Stop testing. Do NOT order anti-PF4 ELISA. Continue heparin if indicated; evaluate alternative causes of thrombocytopenia.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-2">
                  <span className="font-bold text-amber-400 text-sm">Intermediate (4Ts 4 - 5)</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ~10-14% HIT probability. STOP all heparin (including flushes). Start therapeutic DTI (Argatroban or Bivalirudin). Order anti-PF4 ELISA. If OD &gt; 1.0, confirm with SRA.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-2">
                  <span className="font-bold text-rose-400 text-sm">High Probability (4Ts 6 - 8)</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ~50-64% HIT probability. STOP all heparin immediately. Start full-dose DTI without waiting for lab results. Order ELISA and SRA. Bilateral lower extremity venous duplex.
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical Pearls */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-base">
                <Sparkles className="w-5 h-5" />
                <span>Evidence-Based Clinical Pearls &amp; Trial Benchmarks</span>
              </div>
              <div className="space-y-3">
                {evaluation.clinicalPearls.map((pearl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pearl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 4Ts Scoring Calculator */}
        {activeTab === 'FOUR_TS' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  Warkentin 4Ts Clinical Scoring Bench
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standardized bedside pretest probability calculator for Heparin-Induced Thrombocytopenia
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Calculated Score:</span>
                <span className={`text-xl font-black ${probTheme.text}`}>{fourTs.totalScore} / 8</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${probTheme.badge}`}>
                  {fourTs.probabilityCategory.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category 1: Thrombocytopenia */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">1. Thrombocytopenia</span>
                  <span className="text-xs font-bold text-amber-400">{fourTs.thrombocytopeniaPoints} pt(s)</span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'DROP_GT_50_NADIR_GE_20',
                      points: 2,
                      label: 'Platelet fall > 50% AND nadir ≥ 20 × 10⁹/L (2 pts)',
                    },
                    {
                      id: 'DROP_30_50_OR_NADIR_10_19',
                      points: 1,
                      label: 'Platelet fall 30 - 50% OR nadir 10 - 19 × 10⁹/L (1 pt)',
                    },
                    {
                      id: 'DROP_LT_30_OR_NADIR_LT_10',
                      points: 0,
                      label: 'Platelet fall < 30% OR nadir < 10 × 10⁹/L (0 pts)',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        plateletDropCategory === opt.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-white font-medium'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plateletDrop"
                        checked={plateletDropCategory === opt.id}
                        onChange={() => setPlateletDropCategory(opt.id as PlateletDropCategory)}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category 2: Timing */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">2. Timing of Platelet Fall</span>
                  <span className="text-xs font-bold text-amber-400">{fourTs.timingPoints} pt(s)</span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'DAY_5_TO_10_OR_RAPID_WITHIN_30D',
                      points: 2,
                      label: 'Clear fall days 5 - 10; OR ≤1 day with heparin in past 30d (2 pts)',
                    },
                    {
                      id: 'DAY_GT_10_OR_UNCLEAR_OR_RAPID_31_100D',
                      points: 1,
                      label: 'Fall > day 10, unclear timing, or ≤1 day with heparin 31-100d (1 pt)',
                    },
                    {
                      id: 'FALL_LT_DAY_4_NO_RECENT_HEPARIN',
                      points: 0,
                      label: 'Fall < day 4 without recent heparin exposure in last 100d (0 pts)',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        timingCategory === opt.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-white font-medium'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="timing"
                        checked={timingCategory === opt.id}
                        onChange={() => setTimingCategory(opt.id as TimingCategory)}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category 3: Thrombosis */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">3. Thrombosis or Sequelae</span>
                  <span className="text-xs font-bold text-amber-400">{fourTs.thrombosisPoints} pt(s)</span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION',
                      points: 2,
                      label: 'Proven new thrombosis, skin necrosis, or systemic reaction (2 pts)',
                    },
                    {
                      id: 'PROGRESSIVE_RECURRENT_OR_SUSPECTED',
                      points: 1,
                      label: 'Progressive/recurrent thrombosis, erythema, suspected clot (1 pt)',
                    },
                    {
                      id: 'NONE',
                      points: 0,
                      label: 'None (0 pts)',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        thrombosisCategory === opt.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-white font-medium'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="thrombosis"
                        checked={thrombosisCategory === opt.id}
                        onChange={() => setThrombosisCategory(opt.id as ThrombosisCategory)}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category 4: Other Causes */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">4. oTher Causes for Fall</span>
                  <span className="text-xs font-bold text-amber-400">{fourTs.otherCausesPoints} pt(s)</span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'NONE_EVIDENT',
                      points: 2,
                      label: 'None evident / no other plausible cause (2 pts)',
                    },
                    {
                      id: 'POSSIBLE_ALTERNATIVE_PRESENT',
                      points: 1,
                      label: 'Possible alternative cause present (sepsis, meds, post-op) (1 pt)',
                    },
                    {
                      id: 'DEFINITE_ALTERNATIVE_PRESENT',
                      points: 0,
                      label: 'Definite alternative cause present (severe DIC, bypass, chemo) (0 pts)',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        otherCausesCategory === opt.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-white font-medium'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="otherCauses"
                        checked={otherCausesCategory === opt.id}
                        onChange={() => setOtherCausesCategory(opt.id as OtherCausesCategory)}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Banner */}
            <div className={`p-4 rounded-xl border ${probTheme.border} ${probTheme.bg} space-y-2`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${probTheme.text}`}>
                Recommendation based on 4Ts Score:
              </span>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                {fourTs.clinicalRecommendation}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Anti-PF4 ELISA & SRA Bench */}
        {activeTab === 'SEROLOGY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ELISA Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Anti-PF4/Heparin Immunoassay (ELISA)</span>
                </div>
                <span className="text-xs text-slate-400">Polyspecific / IgG Specific</span>
              </div>

              {/* Optical Density Slider */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Optical Density (OD):</span>
                  <span className="font-bold text-cyan-400">{antiPf4ElisaOpticalDensity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={3.5}
                  step={0.05}
                  value={antiPf4ElisaOpticalDensity}
                  onChange={(e) => setAntiPf4ElisaOpticalDensity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Negative (&lt;0.40)</span>
                  <span>Weak (0.4-0.99)</span>
                  <span>Moderate (1.0-1.99)</span>
                  <span>Strong (≥2.00)</span>
                </div>
              </div>

              {/* ELISA Interpretation */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                <span className="text-xs font-bold uppercase text-cyan-300">ELISA Clinical Interpretation:</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {serology.elisaInterpretation}
                </p>
              </div>

              {/* OD BarChart */}
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={elisaChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 3.5]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {elisaChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SRA Functional Assay Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-base">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span>Serotonin Release Assay (SRA - Gold Standard)</span>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${serology.sraResult === 'CONFIRMED_HIT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    {serology.sraResult}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <span className="text-slate-200">
                      Low-Heparin (0.1 - 0.3 U/mL) Release ≥ 50% (Platelet Activation)
                    </span>
                    <input
                      type="checkbox"
                      checked={isSraPositiveLowHeparin}
                      onChange={(e) => setIsSraPositiveLowHeparin(e.target.checked)}
                      className="w-4 h-4 text-indigo-500 rounded bg-slate-900 border-slate-700 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <span className="text-slate-200">
                      High-Heparin (100 U/mL) Release &lt; 20% (Antigen Excess Inhibition)
                    </span>
                    <input
                      type="checkbox"
                      checked={isSraInhibitedHighHeparin}
                      onChange={(e) => setIsSraInhibitedHighHeparin(e.target.checked)}
                      className="w-4 h-4 text-indigo-500 rounded bg-slate-900 border-slate-700 focus:ring-indigo-500"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">SRA Interpretation:</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {serology.sraInterpretation}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>The "Antigen Excess" Phenomenon:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    At 100 U/mL heparin, high concentrations of polyanions disrupt the multimolecular PF4-heparin complexes, stripping antibodies off donor platelets. If serotonin release is NOT inhibited at 100 U/mL, the reaction is non-specific or indicates autoimmune HIT (aHIT).
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *SRA turnaround time is typically 2-4 days; non-heparin anticoagulation must NEVER be delayed while awaiting results!
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Argatroban vs Bivalirudin DTI Dosing */}
        {activeTab === 'DTI_TITRATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DTI Selection & Inputs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Pill className="w-5 h-5 text-violet-400" />
                <span>Direct Thrombin Inhibitor (DTI) Selection</span>
              </div>

              {/* Agent Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ARGATROBAN', label: 'Argatroban' },
                  { id: 'BIVALIRUDIN', label: 'Bivalirudin' },
                  { id: 'FONDAPARINUX', label: 'Fondaparinux' },
                  { id: 'DOAC', label: 'DOAC (Oral)' },
                ].map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAnticoagulant(agent.id as DtiAgent)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      activeAnticoagulant === agent.id
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {agent.label}
                  </button>
                ))}
              </div>

              {/* Organ Clearance Sliders */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Serum Total Bilirubin (Hepatic Function):</span>
                    <span className={`font-bold ${serumTotalBilirubinMgDl > 1.5 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {serumTotalBilirubinMgDl.toFixed(1)} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={8.0}
                    step={0.1}
                    value={serumTotalBilirubinMgDl}
                    onChange={(e) => setSerumTotalBilirubinMgDl(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Normal (&lt; 1.2)</span>
                    <span>Dose Reduction (&gt; 1.5)</span>
                    <span>Severe Jaundice (&gt; 4.0)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Creatinine Clearance (Renal Function):</span>
                    <span className={`font-bold ${creatinineClearanceMlMin < 30 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {creatinineClearanceMlMin} mL/min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={creatinineClearanceMlMin}
                    onChange={(e) => setCreatinineClearanceMlMin(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Severe CKD (&lt; 30)</span>
                    <span>Moderate (30-60)</span>
                    <span>Normal (&gt; 90)</span>
                  </div>
                </div>
              </div>

              {/* Recommended Regimen Output */}
              <div className="p-5 rounded-xl bg-violet-950/20 border border-violet-500/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-violet-300">Recommended Starting Regimen</span>
                  <span className="text-2xl font-black text-violet-200">
                    {dtiPlan.initialRecommendedDose} {dtiPlan.doseUnit}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {dtiPlan.doseAdjustmentGuidance}
                </p>
              </div>
            </div>

            {/* Organ Metabolism & Titration Guidance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Gauge className="w-5 h-5 text-violet-400" />
                  <span>Pharmacokinetics &amp; aPTT Titration</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Clearance Pathway:</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {dtiPlan.metabolicClearancePathway}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Target aPTT Therapeutic Window:</span>
                  <p className="text-sm font-bold text-violet-300">
                    {dtiPlan.targetApttRangeSeconds}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Check aPTT 2 hours after initiation and after any dose change. Once 2 consecutive aPTTs are within target, monitor once daily.
                  </p>
                </div>

                {/* Argatroban PT/INR Artifact Banner */}
                {activeAnticoagulant === 'ARGATROBAN' && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Argatroban PT/INR Artifact Warning:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Argatroban artificially prolongs the Prothrombin Time (PT) and elevates the INR without conferring true Factor VII depletion. At 2 mcg/kg/min, Argatroban alone causes an INR of 1.5 to 2.5! Do not assume the patient is anticoagulated on warfarin based on INR alone.
                    </p>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 italic">
                *CHEST 2021: Bivalirudin is preferred over Argatroban for urgent cardiac surgery or percutaneous coronary intervention (PCI) due to rapid on/off kinetics.
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: The Warfarin Gangrene Trap */}
        {activeTab === 'WARFARIN_SAFETY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pathophysiology & Reversal */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-slate-800 pb-3">
                <AlertTriangle className="w-5 h-5" />
                <span>The "Warfarin Gangrene Trap" &amp; Protein C Dynamics</span>
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                Warfarin is <strong>strictly contraindicated</strong> in acute HIT. Platelet activation in HIT causes massive thrombin generation. Warfarin depletes Protein C (t½ ~ 6 hours) days before depleting Factors II and X (t½ ~ 60-72 hours). This creates an extreme imbalance: runaway thrombin generation with zero natural anticoagulant braking!
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-2">
                <span className="text-xs font-bold uppercase text-rose-400">Clinical Consequences:</span>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Venous Limb Gangrene</strong>: Phlegmasia cerulea dolens progressing to microvascular thrombosis and bilateral leg amputations despite palpable arterial pulses.</li>
                  <li><strong>Warfarin Skin Necrosis</strong>: Microthrombi in subcutaneous fat (breasts, thighs, buttocks).</li>
                  <li><strong>Urgent Antidote</strong>: If warfarin was inadvertently given, IMMEDIATELY administer IV Vitamin K (10 mg) to restore Protein C synthesis.</li>
                </ul>
              </div>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold text-slate-200">
                  Simulate: Warfarin Given During Acute HIT
                </span>
                <input
                  type="checkbox"
                  checked={isWarfarinActiveInAcutePhase}
                  onChange={(e) => setIsWarfarinActiveInAcutePhase(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold text-slate-200">
                  Simulate: Platelet Transfusion Administered ("Fuel on Fire")
                </span>
                <input
                  type="checkbox"
                  checked={isPlateletTransfusionGiven}
                  onChange={(e) => setIsPlateletTransfusionGiven(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                />
              </label>
            </div>

            {/* Transition Protocol Checklist */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Evidence-Based Transition Protocol (ASH 2018)</span>
                </div>

                <div className="space-y-3">
                  {dtiPlan.warfarinTransitionSafeguards.map((safeguard, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{safeguard}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                <strong>Modern Alternative</strong>: Direct Oral Anticoagulants (DOACs, e.g. Apixaban or Rivaroxaban) avoid the entire Protein C depletion paradox and require no overlap transition once platelet counts recover &gt; 150 × 10⁹/L.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
