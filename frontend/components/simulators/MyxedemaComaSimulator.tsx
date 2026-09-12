'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pill,
  ShieldAlert,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Stethoscope,
  Info,
  Clock,
  TrendingUp,
  RefreshCw,
  Layers,
  Wind,
  HeartCrack,
  ArrowRight,
  Gauge,
  HelpCircle,
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
  CnsDysfunctionTier,
  GiDysfunctionTier,
  ThyroidRegimenType,
  MyxedemaPatientInput,
  PopoveniucScoreResult,
  ThyroidDosingGuidance,
  AdrenalSafetyEvaluation,
  SupportiveCareEvaluation,
  MyxedemaComprehensiveOutput,
  calculatePopoveniucScore,
  evaluateAdrenalSafety,
  calculateThyroidDosing,
  evaluateSupportiveCare,
  performMyxedemaEvaluation,
  MYXEDEMA_PRESETS,
  MyxedemaPreset,
} from '../../.gemini/skills/MyxedemaComaEngine';

export default function MyxedemaComaSimulator() {
  // Clinical States
  const [patientAgeYears, setPatientAgeYears] = useState<number>(78);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(65);
  const [coreTemperatureCelsius, setCoreTemperatureCelsius] = useState<number>(31.2);
  const [cnsDysfunction, setCnsDysfunction] = useState<CnsDysfunctionTier>('SEIZURES_COMA');
  const [giDysfunction, setGiDysfunction] =
    useState<GiDysfunctionTier>('ANOREXIA_ABDOMINAL_PAIN_CONSTIPATION');

  // Cardiovascular
  const [heartRateBpm, setHeartRateBpm] = useState<number>(38);
  const [systolicBpMmHg, setSystolicBpMmHg] = useState<number>(82);
  const [diastolicBpMmHg, setDiastolicBpMmHg] = useState<number>(52);
  const [hasPericardialOrPleuralEffusion, setHasPericardialOrPleuralEffusion] =
    useState<boolean>(true);
  const [hasCongestiveHeartFailure, setHasCongestiveHeartFailure] = useState<boolean>(true);
  const [hasKnownCoronaryArteryDisease, setHasKnownCoronaryArteryDisease] = useState<boolean>(false);
  const [hasPrecipitatingInfectionOrCold, setHasPrecipitatingInfectionOrCold] = useState<boolean>(true);

  // Labs & Metabolic
  const [serumSodiumMeqL, setSerumSodiumMeqL] = useState<number>(120);
  const [serumGlucoseMgDl, setSerumGlucoseMgDl] = useState<number>(58);
  const [pao2MmHg, setPao2MmHg] = useState<number>(52);
  const [paco2MmHg, setPaco2MmHg] = useState<number>(58);
  const [baselineRandomCortisolMcgDl, setBaselineRandomCortisolMcgDl] = useState<number>(9.2);

  // Pharmacotherapy & Rewarming
  const [isHydrocortisoneAdministeredFirst, setIsHydrocortisoneAdministeredFirst] =
    useState<boolean>(true);
  const [thyroidRegimen, setThyroidRegimen] = useState<ThyroidRegimenType>('COMBINATION_T4_T3');
  const [selectedT4LoadingDoseMcg, setSelectedT4LoadingDoseMcg] = useState<number>(300);
  const [selectedT3LoadingDoseMcg, setSelectedT3LoadingDoseMcg] = useState<number>(10);
  const [isActiveExternalRewarmingApplied, setIsActiveExternalRewarmingApplied] =
    useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'SYNTHESIS' | 'POPOVENIUC' | 'ADRENAL_SAFETY' | 'THYROID_DOSING' | 'SUPPORTIVE_CARE'
  >('SYNTHESIS');

  // Load Preset
  const applyPreset = (preset: MyxedemaPreset) => {
    const inp = preset.inputs;
    setPatientAgeYears(inp.patientAgeYears);
    setPatientWeightKg(inp.patientWeightKg);
    setCoreTemperatureCelsius(inp.coreTemperatureCelsius);
    setCnsDysfunction(inp.cnsDysfunction);
    setGiDysfunction(inp.giDysfunction);
    setHeartRateBpm(inp.heartRateBpm);
    setSystolicBpMmHg(inp.systolicBpMmHg);
    setDiastolicBpMmHg(inp.diastolicBpMmHg);
    setHasPericardialOrPleuralEffusion(inp.hasPericardialOrPleuralEffusion);
    setHasCongestiveHeartFailure(inp.hasCongestiveHeartFailure);
    setHasKnownCoronaryArteryDisease(inp.hasKnownCoronaryArteryDisease);
    setHasPrecipitatingInfectionOrCold(inp.hasPrecipitatingInfectionOrCold);
    setSerumSodiumMeqL(inp.serumSodiumMeqL);
    setSerumGlucoseMgDl(inp.serumGlucoseMgDl);
    setPao2MmHg(inp.pao2MmHg);
    setPaco2MmHg(inp.paco2MmHg);
    setBaselineRandomCortisolMcgDl(inp.baselineRandomCortisolMcgDl);
    setIsHydrocortisoneAdministeredFirst(inp.isHydrocortisoneAdministeredFirst);
    setThyroidRegimen(inp.thyroidRegimen);
    setSelectedT4LoadingDoseMcg(inp.selectedT4LoadingDoseMcg);
    setSelectedT3LoadingDoseMcg(inp.selectedT3LoadingDoseMcg);
    setIsActiveExternalRewarmingApplied(inp.isActiveExternalRewarmingApplied);
  };

  // Compile Current Patient Input
  const currentInput: MyxedemaPatientInput = useMemo(() => {
    return {
      patientAgeYears,
      patientWeightKg,
      coreTemperatureCelsius,
      cnsDysfunction,
      giDysfunction,
      heartRateBpm,
      systolicBpMmHg,
      diastolicBpMmHg,
      hasPericardialOrPleuralEffusion,
      hasCongestiveHeartFailure,
      hasKnownCoronaryArteryDisease,
      hasPrecipitatingInfectionOrCold,
      serumSodiumMeqL,
      serumGlucoseMgDl,
      pao2MmHg,
      paco2MmHg,
      baselineRandomCortisolMcgDl,
      isHydrocortisoneAdministeredFirst,
      thyroidRegimen,
      selectedT4LoadingDoseMcg,
      selectedT3LoadingDoseMcg,
      isActiveExternalRewarmingApplied,
    };
  }, [
    patientAgeYears,
    patientWeightKg,
    coreTemperatureCelsius,
    cnsDysfunction,
    giDysfunction,
    heartRateBpm,
    systolicBpMmHg,
    diastolicBpMmHg,
    hasPericardialOrPleuralEffusion,
    hasCongestiveHeartFailure,
    hasKnownCoronaryArteryDisease,
    hasPrecipitatingInfectionOrCold,
    serumSodiumMeqL,
    serumGlucoseMgDl,
    pao2MmHg,
    paco2MmHg,
    baselineRandomCortisolMcgDl,
    isHydrocortisoneAdministeredFirst,
    thyroidRegimen,
    selectedT4LoadingDoseMcg,
    selectedT3LoadingDoseMcg,
    isActiveExternalRewarmingApplied,
  ]);

  // Comprehensive Evaluation
  const evaluation: MyxedemaComprehensiveOutput = useMemo(() => {
    return performMyxedemaEvaluation(currentInput);
  }, [currentInput]);

  const { popoveniuc, adrenalSafety, thyroidDosing, supportiveCare, safetyInterlocks } = evaluation;

  // Chart data for Popoveniuc Breakdown
  const scoreBreakdownData = useMemo(() => {
    return [
      { name: 'Thermo', value: popoveniuc.thermoregulationPoints, fill: '#06b6d4' },
      { name: 'CNS', value: popoveniuc.cnsPoints, fill: '#8b5cf6' },
      { name: 'GI', value: popoveniuc.giPoints, fill: '#f59e0b' },
      { name: 'Cardio', value: popoveniuc.cardiovascularPoints, fill: '#ef4444' },
      { name: 'Precip', value: popoveniuc.precipitatingEventPoints, fill: '#10b981' },
      { name: 'Metab', value: popoveniuc.metabolicPoints, fill: '#ec4899' },
    ];
  }, [popoveniuc]);

  // Status color helper
  const getScoreTheme = (cat: PopoveniucScoreResult['diagnosticCategory']) => {
    switch (cat) {
      case 'DIAGNOSTIC_MYXEDEMA_COMA':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'HIGH_RISK_IMPENDING':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'UNLIKELY':
      default:
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
    }
  };

  const scoreTheme = getScoreTheme(popoveniuc.diagnosticCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/simulators" className="hover:text-slate-200 transition">
            Simulators
          </Link>
          <span>/</span>
          <span className="text-cyan-400 font-medium">
            Myxedema Coma &amp; Thyroid Hormone Titration
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/40 border border-cyan-800/40 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                  <Thermometer className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    Myxedema Coma &amp; Thyroid Crisis Workstation
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      ATA 2014 • Endocrine Society
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Comprehensive endocrine &amp; neurocritical care solver: Popoveniuc diagnostic scoring system, mandatory "Steroids Before Thyroid Hormone" adrenal collapse interlock, IV Levothyroxine (T4) vs Liothyronine (T3) titration, and passive rewarming vs vasodilatory shock mechanics.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => applyPreset(MYXEDEMA_PRESETS[0])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Presets
              </button>
            </div>
          </div>

          {/* Quick Presets Ribbon */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Clinical Presets:
            </span>
            {MYXEDEMA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/50 transition flex items-center gap-2 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-medium">{preset.name.split('(')[0]}</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">({preset.badge})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Executive Summary Cards Grid (5 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Popoveniuc Score */}
          <div className={`p-4 rounded-xl border ${scoreTheme.border} ${scoreTheme.bg} space-y-2 shadow-lg`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Popoveniuc Score</span>
              <Activity className={`w-4 h-4 ${scoreTheme.text}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black ${scoreTheme.text}`}>
                {popoveniuc.totalScore} <span className="text-xs font-semibold">pts</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {popoveniuc.diagnosticCategory.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Mortality:</span>
              <span className={`font-semibold ${scoreTheme.text}`}>~{popoveniuc.estimatedMortalityPercent}% in-hospital</span>
            </div>
          </div>

          {/* Card 2: Adrenal Protection */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Adrenal Protection</span>
              <ShieldAlert className={`w-4 h-4 ${isHydrocortisoneAdministeredFirst ? 'text-emerald-400' : 'text-rose-400 animate-bounce'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isHydrocortisoneAdministeredFirst ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHydrocortisoneAdministeredFirst ? 'Hydrocortisone Given' : 'LETHAL ADRENAL HAZARD!'}
              </span>
              <span className="text-xs text-slate-400">
                Random Cortisol: {baselineRandomCortisolMcgDl} mcg/dL
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Interlock:</span>
              <span className={`font-semibold ${isHydrocortisoneAdministeredFirst ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHydrocortisoneAdministeredFirst ? 'Steroids First Met' : 'HOLD THYROID!'}
              </span>
            </div>
          </div>

          {/* Card 3: Thyroid Hormone Loading */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Thyroid Hormone</span>
              <Pill className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-violet-300">
                IV T4 {thyroidDosing.recommendedT4LoadingMcg} mcg
              </span>
              <span className="text-xs text-slate-400">
                {thyroidRegimen === 'COMBINATION_T4_T3' ? `+ IV T3 ${thyroidDosing.recommendedT3LoadingMcg} mcg` : 'Monotherapy'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">CAD Adjustment:</span>
              <span className={`font-semibold ${hasKnownCoronaryArteryDisease || patientAgeYears >= 65 ? 'text-amber-400' : 'text-slate-300'}`}>
                {hasKnownCoronaryArteryDisease || patientAgeYears >= 65 ? 'Reduced (200 mcg)' : 'Full Load (300 mcg)'}
              </span>
            </div>
          </div>

          {/* Card 4: Temperature & Rewarming */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Core Temp &amp; Heat</span>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-cyan-300">
                {coreTemperatureCelsius.toFixed(1)} <span className="text-xs text-slate-400 font-normal">°C</span>
              </span>
              <span className="text-xs text-slate-400">
                {coreTemperatureCelsius < 32 ? 'Severe Hypothermia' : coreTemperatureCelsius < 35 ? 'Moderate' : 'Preserved'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Warming Mode:</span>
              <span className={`font-semibold ${isActiveExternalRewarmingApplied ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isActiveExternalRewarmingApplied ? 'ACTIVE COLLAPSE!' : 'Passive Blankets'}
              </span>
            </div>
          </div>

          {/* Card 5: Ventilatory & Sodium */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ventilation &amp; Na⁺</span>
              <Wind className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-indigo-300">
                PaCO₂ {paco2MmHg} / PaO₂ {pao2MmHg}
              </span>
              <span className="text-xs text-slate-400">
                Na⁺: {serumSodiumMeqL} mEq/L (SIADH-like)
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Airway:</span>
              <span className={`font-semibold ${paco2MmHg > 50 || pao2MmHg < 60 ? 'text-rose-400' : 'text-slate-300'}`}>
                {paco2MmHg > 50 || pao2MmHg < 60 ? 'INTUBATION REQ' : 'Stable'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-thin">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis & Protocol', icon: Layers },
            { id: 'POPOVENIUC', label: 'Popoveniuc Diagnostic Score', icon: Activity },
            { id: 'ADRENAL_SAFETY', label: 'Steroids-Before-Thyroid Protocol', icon: ShieldAlert },
            { id: 'THYROID_DOSING', label: 'IV Thyroid Hormone Titration', icon: Pill },
            { id: 'SUPPORTIVE_CARE', label: 'Rewarming, Ventilation & Sodium', icon: Thermometer },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
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
                  <span>Critical Myxedema Safety Interlocks Triggered</span>
                </div>
                {safetyInterlocks.map((interlock, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/40 text-xs md:text-sm text-rose-200 leading-relaxed font-medium">
                    {interlock}
                  </div>
                ))}
              </div>
            )}

            {/* Immediate Action Checklist */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-cyan-400 font-semibold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Immediate Action Checklist &amp; ICU Directives</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.immediateActionChecklist.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flowchart Breakdown */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Myxedema Coma Resuscitation Sequence (ATA 2014)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-2">
                  <span className="font-bold text-cyan-400 text-sm">Step 1: Secure Airway</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Intubate for PaCO₂ &gt; 50 mmHg, severe somnolence, or macroglossia. Use cautious sedative induction to avoid irreversible cardiovascular collapse.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-2">
                  <span className="font-bold text-rose-400 text-sm">Step 2: STEROIDS FIRST</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Administer Hydrocortisone 100 mg IV immediately. Prevents fatal acute adrenal crisis upon thyroid induction. Never wait for cortisol labs!
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-violet-500/40 bg-violet-950/20 space-y-2">
                  <span className="font-bold text-violet-400 text-sm">Step 3: Thyroid Hormone</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    IV Levothyroxine 200-400 mcg loading bolus ± IV Liothyronine (T3) 5-20 mcg. In CAD or elderly patients, use conservative T4 (200 mcg) to protect coronary perfusion.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                  <span className="font-bold text-emerald-400 text-sm">Step 4: Passive Rewarming</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Standard warm blankets only. Active external warming is strictly contraindicated due to rapid cutaneous vasodilation and profound vasodilatory shock.
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical Pearls */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-base">
                <Sparkles className="w-5 h-5" />
                <span>Evidence-Based Clinical Pearls &amp; ATA Benchmarks</span>
              </div>
              <div className="space-y-3">
                {evaluation.clinicalPearls.map((pearl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{pearl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Popoveniuc Diagnostic Score Bench */}
        {activeTab === 'POPOVENIUC' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Popoveniuc Diagnostic Scoring System
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${scoreTheme.badge}`}>
                  {popoveniuc.totalScore} pts
                </span>
              </div>

              {/* Core Temperature */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Core Temperature (°C):</span>
                  <span className="font-bold text-cyan-400">{coreTemperatureCelsius.toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min={28.0}
                  max={38.0}
                  step={0.1}
                  value={coreTemperatureCelsius}
                  onChange={(e) => setCoreTemperatureCelsius(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Severe (&lt; 32 °C, 20 pts)</span>
                  <span>Moderate (32-35 °C, 10 pts)</span>
                  <span>Normal (≥ 35 °C, 0 pts)</span>
                </div>
              </div>

              {/* CNS Dysfunction */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">CNS Dysfunction</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'ABSENT', label: 'Absent (0 pts)' },
                    { id: 'SOMNOLENCE_LETHARGY', label: 'Lethargy / Somnolence (10 pts)' },
                    { id: 'STUPOR_DELIRIUM', label: 'Stupor / Delirium (20 pts)' },
                    { id: 'SEIZURES_COMA', label: 'Coma / Seizures (30 pts)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCnsDysfunction(opt.id as CnsDysfunctionTier)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        cnsDysfunction === opt.id
                          ? 'bg-violet-500/20 border-violet-500 text-violet-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GI Dysfunction */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Gastrointestinal</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'ABSENT', label: 'Absent (0 pts)' },
                    { id: 'ANOREXIA_ABDOMINAL_PAIN_CONSTIPATION', label: 'Obstipation (10 pts)' },
                    { id: 'PARALYTIC_ILEUS_MEGACOLON', label: 'Paralytic Ileus (20 pts)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGiDysfunction(opt.id as GiDysfunctionTier)}
                      className={`p-2 rounded-lg border text-left transition ${
                        giDysfunction === opt.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cardiovascular & Precipitating Toggles */}
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span>Bradycardia (&lt; 50 bpm) or Hypotension (MAP &lt; 65 mmHg)</span>
                  <span className="font-bold text-rose-400">
                    {heartRateBpm < 50 || systolicBpMmHg < 90 ? '+10-20 pts' : '0 pts'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span>Pericardial or Pleural Effusion Present</span>
                  <input
                    type="checkbox"
                    checked={hasPericardialOrPleuralEffusion}
                    onChange={(e) => setHasPericardialOrPleuralEffusion(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span>Precipitating Infection / Cold / Sepsis</span>
                  <input
                    type="checkbox"
                    checked={hasPrecipitatingInfectionOrCold}
                    onChange={(e) => setHasPrecipitatingInfectionOrCold(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700"
                  />
                </label>
              </div>
            </div>

            {/* Score Visualization & Interpretation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-base">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span>Score Breakdown by System</span>
                  </div>
                  <span className="text-xs text-slate-400">Cutoff: ≥ 60 = Diagnostic</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreBreakdownData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#f8fafc',
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {scoreBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className={`p-4 rounded-xl border ${scoreTheme.border} ${scoreTheme.bg} space-y-2`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${scoreTheme.text}`}>
                    Clinical Interpretation:
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                    {popoveniuc.clinicalSummary}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Popoveniuc et al. (Crit Care Clin 2014): Empirically validated diagnostic tool with high sensitivity for distinguishing impending decompensation from overt myxedema coma.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Steroids-Before-Thyroid Protocol */}
        {activeTab === 'ADRENAL_SAFETY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mechanistic Safety Panel */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5" />
                <span>The "Steroids-Before-Thyroid" Safety Interlock</span>
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                Thyroid hormone administration markedly accelerates hepatic clearance of cortisol and elevates whole-body metabolic demand. Patients with severe primary hypothyroidism may have concurrent autoimmune adrenalitis (<strong>Schmidt syndrome</strong> / Polyglandular Autoimmune Syndrome type II) or blunted hypothalamic-pituitary-adrenal reserve.
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-2">
                <span className="text-xs font-bold uppercase text-rose-400">Mechanism of Fatal Collapse:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Giving thyroid hormone without prior corticosteroids burns through whatever small circulating cortisol remains, triggering an acute crisis: refractory distributive vasodilation, hypoglycemia, hyperkalemia, and cardiac arrest.
                </p>
              </div>

              {/* Interactive Simulation Toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold text-slate-200">
                  Administer Stress-Dose Hydrocortisone Prior to Thyroid Hormone
                </span>
                <input
                  type="checkbox"
                  checked={isHydrocortisoneAdministeredFirst}
                  onChange={(e) => setIsHydrocortisoneAdministeredFirst(e.target.checked)}
                  className="w-5 h-5 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500"
                />
              </label>

              <div className={`p-4 rounded-xl border space-y-2 ${isHydrocortisoneAdministeredFirst ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-rose-950/30 border-rose-500/50'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${isHydrocortisoneAdministeredFirst ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isHydrocortisoneAdministeredFirst ? 'Protected Adrenal State:' : 'LETHAL ADRENAL CRISIS TRIGGER:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {adrenalSafety.clinicalRationale}
                </p>
              </div>
            </div>

            {/* Dosing Regimen & Diagnostic Evaluation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Pill className="w-5 h-5 text-emerald-400" />
                  <span>Stress-Dose Hydrocortisone Regimen</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Standard ICU Regimen:</span>
                  <p className="text-sm font-bold text-emerald-300">
                    Hydrocortisone 100 mg IV bolus every 8 hours
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Alternatively, continuous infusion of 200 to 300 mg/day. Taper rapidly once critical state improves and cosyntropin stimulation confirms intact adrenal axis.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Baseline Cortisol Testing:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Draw random serum cortisol immediately before steroid injection. In profound shock/stress, normal cortisol should exceed 18 mcg/dL. A cortisol &lt; 18 mcg/dL confirms adrenal insufficiency.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs text-slate-400">Current Cortisol:</span>
                    <span className={`font-bold text-sm ${baselineRandomCortisolMcgDl < 18 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {baselineRandomCortisolMcgDl} mcg/dL ({baselineRandomCortisolMcgDl < 18 ? 'Subnormal / Insufficient' : 'Adequate Stress Response'})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Clinical Rule: If in doubt, give steroids immediately. Hydrocortisone does NOT interfere with subsequent thyroid hormone function.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: IV Thyroid Hormone Titration */}
        {activeTab === 'THYROID_DOSING' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Titration Options & Inputs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Pill className="w-5 h-5 text-violet-400" />
                <span>ATA Guidelines Thyroid Hormone Dosing</span>
              </div>

              {/* Regimen Selector */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 font-semibold uppercase">Thyroid Hormone Strategy</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'T4_MONOTHERAPY', label: 'IV T4 Monotherapy' },
                    { id: 'COMBINATION_T4_T3', label: 'Combination T4 + T3' },
                    { id: 'T3_MONOTHERAPY', label: 'IV T3 Monotherapy' },
                  ].map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => setThyroidRegimen(reg.id as ThyroidRegimenType)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        thyroidRegimen === reg.id
                          ? 'bg-violet-500/20 border-violet-500 text-violet-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CAD & Elderly Toggle */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-200">
                    Known Coronary Artery Disease (CAD) or Prior MI
                  </span>
                  <input
                    type="checkbox"
                    checked={hasKnownCoronaryArteryDisease}
                    onChange={(e) => setHasKnownCoronaryArteryDisease(e.target.checked)}
                    className="w-4 h-4 text-violet-500 rounded bg-slate-900 border-slate-700"
                  />
                </label>

                {/* Loading Dose Slider */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Selected T4 Loading Dose:</span>
                    <span className="font-bold text-violet-400">{selectedT4LoadingDoseMcg} mcg IV</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={500}
                    step={50}
                    value={selectedT4LoadingDoseMcg}
                    onChange={(e) => setSelectedT4LoadingDoseMcg(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>CAD/Elderly (200 mcg)</span>
                    <span>Standard (300-400 mcg)</span>
                    <span>Profound (500 mcg)</span>
                  </div>
                </div>
              </div>

              {/* Recommended Regimen Output */}
              <div className="p-5 rounded-xl bg-violet-950/20 border border-violet-500/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-violet-300">Recommended IV Loading</span>
                  <span className="text-2xl font-black text-violet-200">
                    {thyroidDosing.recommendedT4LoadingMcg} mcg IV
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {thyroidDosing.rationale}
                </p>
              </div>
            </div>

            {/* Cardiac Safeguards & Deiodinase Kinetics */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <span>Myocardial Ischemia Risk &amp; Deiodinase Impairment</span>
                </div>

                {thyroidDosing.cardiacWarning && (
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Cardiac Toxicity Warning</span>
                    </div>
                    <p className="text-xs text-rose-200 leading-relaxed">
                      {thyroidDosing.cardiacWarning}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">The 5'-Deiodinase Problem:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In severe critical illness and hypothermia, peripheral 5'-deiodinase is markedly inhibited, impairing conversion of prohormone T4 to active T3. Adding small IV T3 boluses (5-10 mcg) provides rapid genomic activity before T4 can convert; however, peak T3 surges can trigger fatal arrhythmias in ischemic myocardium.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *ATA 2014 Guidelines: In elderly patients or known ischemic heart disease, initiate T4 monotherapy at 200-250 mcg IV loading, reserving T3 only if patient fails to improve after 24-48 hours.
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Rewarming, Ventilation & Sodium */}
        {activeTab === 'SUPPORTIVE_CARE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rewarming Safety Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Thermometer className="w-5 h-5 text-cyan-400" />
                <span>Passive External Rewarming vs. Vasodilatory Shock</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Core body temperature in myxedema coma often falls below 32 °C. However, <strong>aggressive active external rewarming</strong> (e.g. forced air heating blankets at high temperature) is strictly contraindicated.
              </p>

              {/* Active Warming Simulation Toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold text-slate-200">
                  Simulate: Active External Warming Blanket Applied
                </span>
                <input
                  type="checkbox"
                  checked={isActiveExternalRewarmingApplied}
                  onChange={(e) => setIsActiveExternalRewarmingApplied(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                />
              </label>

              {supportiveCare.rewarmingSafetyWarning ? (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lethal Vasodilatory Collapse Hazard</span>
                  </div>
                  <p className="text-xs text-rose-200 leading-relaxed font-medium">
                    {supportiveCare.rewarmingSafetyWarning}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                  <span className="text-xs font-bold uppercase text-emerald-300">Recommended Rewarming:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {supportiveCare.rewarmingGuidance}
                  </p>
                </div>
              )}
            </div>

            {/* Ventilation & Hyponatremia Management */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Wind className="w-5 h-5 text-indigo-400" />
                  <span>Hypoventilation &amp; Hyponatremia Protocols</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-indigo-300">Ventilatory Protocol:</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {supportiveCare.ventilatoryGuidance}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-cyan-300">Hyponatremia Guidance (Free Water Clearance):</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {supportiveCare.hyponatremiaGuidance}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Hypothyroid blunting of chemoreceptors causes insidious CO2 retention; ABG monitoring is essential even if SpO2 appears normal on supplemental oxygen.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
