'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
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
  Wind,
  HeartCrack,
  ArrowRight,
  Gauge,
  HelpCircle,
  Thermometer,
  ShieldCheck,
  Ban,
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
  BwpsDiagnosticCategory,
  AkamizuCategory,
  ThionamideDrug,
  BetaBlockerDrug,
  ThyroidStormPatientInput,
  BwpsScoreResult,
  AkamizuResult,
  IodineTimingSafetyEvaluation,
  PharmacotherapyPlan,
  ThyroidStormComprehensiveOutput,
  calculateBwps,
  calculateAkamizu,
  evaluateIodineTiming,
  generatePharmacotherapyPlan,
  performThyroidStormEvaluation,
  THYROID_STORM_PRESETS,
  ThyroidStormPreset,
} from '../../.gemini/skills/ThyroidStormEngine';

export default function ThyroidStormSimulator() {
  // Clinical States
  const [patientAgeYears, setPatientAgeYears] = useState<number>(34);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(58);
  const [temperatureFahrenheit, setTemperatureFahrenheit] = useState<number>(104.2);
  const [cnsDysfunction, setCnsDysfunction] = useState<
    'NONE' | 'MILD_AGITATION' | 'MODERATE_DELIRIUM_PSYCHOSIS' | 'SEVERE_COMA_SEIZURES'
  >('MODERATE_DELIRIUM_PSYCHOSIS');
  const [giHepaticDysfunction, setGiHepaticDysfunction] = useState<
    'NONE' | 'MODERATE_DIARRHEA_NAUSEA_PAIN' | 'SEVERE_JAUNDICE'
  >('SEVERE_JAUNDICE');

  // Cardiovascular
  const [heartRateBpm, setHeartRateBpm] = useState<number>(162);
  const [congestiveHeartFailure, setCongestiveHeartFailure] = useState<
    'NONE' | 'MILD_PEDAL_EDEMA' | 'MODERATE_BASILAR_RALES' | 'SEVERE_PULMONARY_EDEMA'
  >('MODERATE_BASILAR_RALES');
  const [hasAtrialFibrillation, setHasAtrialFibrillation] = useState<boolean>(true);
  const [hasPrecipitatingHistory, setHasPrecipitatingHistory] = useState<boolean>(true);

  // Labs
  const [freeT4NgDl, setFreeT4NgDl] = useState<number>(6.8);
  const [totalT3NgDl, setTotalT3NgDl] = useState<number>(480);
  const [tshUiuMl, setTshUiuMl] = useState<number>(0.005);
  const [totalBilirubinMgDl, setTotalBilirubinMgDl] = useState<number>(3.8);

  // Pharmacotherapy & Timing
  const [selectedThionamide, setSelectedThionamide] = useState<ThionamideDrug>('PTU');
  const [isThionamideAdministered, setIsThionamideAdministered] = useState<boolean>(true);
  const [minutesElapsedSinceThionamide, setMinutesElapsedSinceThionamide] = useState<number>(75);
  const [isIodineAdministered, setIsIodineAdministered] = useState<boolean>(true);
  const [isStressDoseSteroidGiven, setIsStressDoseSteroidGiven] = useState<boolean>(true);
  const [selectedBetaBlocker, setSelectedBetaBlocker] = useState<BetaBlockerDrug>('PROPRANOLOL');
  const [isBetaBlockerAdministered, setIsBetaBlockerAdministered] = useState<boolean>(true);
  const [isCholestyramineGiven, setIsCholestyramineGiven] = useState<boolean>(true);
  const [isAspirinAdministered, setIsAspirinAdministered] = useState<boolean>(false);
  const [hasSevereAsthmaOrCopd, setHasSevereAsthmaOrCopd] = useState<boolean>(false);
  const [leftVentricularEjectionFractionPercent, setLeftVentricularEjectionFractionPercent] =
    useState<number>(50);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'SYNTHESIS' | 'BWPS_SCORE' | 'AKAMIZU_CRITERIA' | 'MULTIMODAL_PHARMACOTHERAPY' | 'CRITICAL_PITFALLS'
  >('SYNTHESIS');

  // Load Preset
  const applyPreset = (preset: ThyroidStormPreset) => {
    const inp = preset.inputs;
    setPatientAgeYears(inp.patientAgeYears);
    setPatientWeightKg(inp.patientWeightKg);
    setTemperatureFahrenheit(inp.temperatureFahrenheit);
    setCnsDysfunction(inp.cnsDysfunction);
    setGiHepaticDysfunction(inp.giHepaticDysfunction);
    setHeartRateBpm(inp.heartRateBpm);
    setCongestiveHeartFailure(inp.congestiveHeartFailure);
    setHasAtrialFibrillation(inp.hasAtrialFibrillation);
    setHasPrecipitatingHistory(inp.hasPrecipitatingHistory);
    setFreeT4NgDl(inp.freeT4NgDl);
    setTotalT3NgDl(inp.totalT3NgDl);
    setTshUiuMl(inp.tshUiuMl);
    setTotalBilirubinMgDl(inp.totalBilirubinMgDl);
    setSelectedThionamide(inp.selectedThionamide);
    setIsThionamideAdministered(inp.isThionamideAdministered);
    setMinutesElapsedSinceThionamide(inp.minutesElapsedSinceThionamide);
    setIsIodineAdministered(inp.isIodineAdministered);
    setIsStressDoseSteroidGiven(inp.isStressDoseSteroidGiven);
    setSelectedBetaBlocker(inp.selectedBetaBlocker);
    setIsBetaBlockerAdministered(inp.isBetaBlockerAdministered);
    setIsCholestyramineGiven(inp.isCholestyramineGiven);
    setIsAspirinAdministered(inp.isAspirinAdministered);
    setHasSevereAsthmaOrCopd(inp.hasSevereAsthmaOrCopd);
    setLeftVentricularEjectionFractionPercent(inp.leftVentricularEjectionFractionPercent);
  };

  // Current Patient Input
  const currentInput: ThyroidStormPatientInput = useMemo(() => {
    return {
      patientAgeYears,
      patientWeightKg,
      temperatureFahrenheit,
      cnsDysfunction,
      giHepaticDysfunction,
      heartRateBpm,
      congestiveHeartFailure,
      hasAtrialFibrillation,
      hasPrecipitatingHistory,
      freeT4NgDl,
      totalT3NgDl,
      tshUiuMl,
      totalBilirubinMgDl,
      selectedThionamide,
      isThionamideAdministered,
      minutesElapsedSinceThionamide,
      isIodineAdministered,
      isStressDoseSteroidGiven,
      selectedBetaBlocker,
      isBetaBlockerAdministered,
      isCholestyramineGiven,
      isAspirinAdministered,
      hasSevereAsthmaOrCopd,
      leftVentricularEjectionFractionPercent,
    };
  }, [
    patientAgeYears,
    patientWeightKg,
    temperatureFahrenheit,
    cnsDysfunction,
    giHepaticDysfunction,
    heartRateBpm,
    congestiveHeartFailure,
    hasAtrialFibrillation,
    hasPrecipitatingHistory,
    freeT4NgDl,
    totalT3NgDl,
    tshUiuMl,
    totalBilirubinMgDl,
    selectedThionamide,
    isThionamideAdministered,
    minutesElapsedSinceThionamide,
    isIodineAdministered,
    isStressDoseSteroidGiven,
    selectedBetaBlocker,
    isBetaBlockerAdministered,
    isCholestyramineGiven,
    isAspirinAdministered,
    hasSevereAsthmaOrCopd,
    leftVentricularEjectionFractionPercent,
  ]);

  // Comprehensive Evaluation
  const evaluation: ThyroidStormComprehensiveOutput = useMemo(() => {
    return performThyroidStormEvaluation(currentInput);
  }, [currentInput]);

  const { bwps, akamizu, iodineTiming, pharmacotherapy, safetyInterlocks } = evaluation;

  // Chart data for BWPS Breakdown
  const bwpsBreakdownData = useMemo(() => {
    return [
      { name: 'Temp', value: bwps.temperatureScore, fill: '#ef4444' },
      { name: 'CNS', value: bwps.cnsScore, fill: '#8b5cf6' },
      { name: 'GI/Hep', value: bwps.giHepaticScore, fill: '#f59e0b' },
      { name: 'Tachy', value: bwps.tachycardiaScore, fill: '#ec4899' },
      { name: 'CHF', value: bwps.chfScore, fill: '#3b82f6' },
      { name: 'AFib', value: bwps.afibScore, fill: '#06b6d4' },
      { name: 'Precip', value: bwps.precipitantScore, fill: '#10b981' },
    ];
  }, [bwps]);

  // Theme helper for BWPS
  const getBwpsTheme = (cat: BwpsDiagnosticCategory) => {
    switch (cat) {
      case 'HIGHLY_SUGGESTIVE_THYROID_STORM':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'IMPENDING_THYROID_STORM':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'THYROTOXIC_STORM_UNLIKELY':
      default:
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
    }
  };

  const bwpsTheme = getBwpsTheme(bwps.category);

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
            Thyroid Storm &amp; Burch-Wartofsky Scoring Workstation
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-rose-950/40 border border-amber-800/40 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Flame className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    Thyroid Storm &amp; Burch-Wartofsky Crisis Workstation
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ATA 2016 • JTA Criteria
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Comprehensive endocrine neurocritical solver: Burch-Wartofsky Point Scale (BWPS), Japan Thyroid Association (Akamizu) diagnostic criteria, the 5-Stage Multimodal Pharmacotherapy Chain, mandatory Wolff-Chaikoff 60-minute iodine delay interlock, and the Aspirin TBG displacement hazard.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => applyPreset(THYROID_STORM_PRESETS[0])}
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
            {THYROID_STORM_PRESETS.map((preset) => (
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
          {/* Card 1: BWPS Score */}
          <div className={`p-4 rounded-xl border ${bwpsTheme.border} ${bwpsTheme.bg} space-y-2 shadow-lg`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">BWPS Score</span>
              <Activity className={`w-4 h-4 ${bwpsTheme.text}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black ${bwpsTheme.text}`}>
                {bwps.totalScore} <span className="text-xs font-semibold">pts</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {bwps.category.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Mortality:</span>
              <span className={`font-semibold ${bwpsTheme.text}`}>~{bwps.estimatedMortalityPercent}% in-hospital</span>
            </div>
          </div>

          {/* Card 2: Akamizu Criteria */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Akamizu (JTA)</span>
              <ShieldAlert className={`w-4 h-4 ${akamizu.category === 'TS1_DEFINITE_THYROID_STORM' ? 'text-rose-400' : 'text-amber-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${akamizu.category === 'TS1_DEFINITE_THYROID_STORM' ? 'text-rose-400' : 'text-amber-300'}`}>
                {akamizu.category === 'TS1_DEFINITE_THYROID_STORM' ? 'TS1 Definite Storm' : akamizu.category === 'TS2_SUSPECTED_THYROID_STORM' ? 'TS2 Suspected Storm' : 'Not Thyroid Storm'}
              </span>
              <span className="text-xs text-slate-400">
                Organ Manifestations: {akamizu.otherManifestationsCount}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Free T4 / T3:</span>
              <span className="font-semibold text-amber-400">
                {freeT4NgDl} ng/dL ({freeT4NgDl > 1.8 ? 'Elevated' : 'Normal'})
              </span>
            </div>
          </div>

          {/* Card 3: Wolff-Chaikoff Iodine Timing */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Iodine Timing</span>
              <Clock className={`w-4 h-4 ${iodineTiming.isSafeToAdministerIodine ? 'text-emerald-400' : 'text-rose-400 animate-bounce'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${iodineTiming.isSafeToAdministerIodine ? 'text-emerald-400' : 'text-rose-400'}`}>
                {iodineTiming.isSafeToAdministerIodine ? 'Safe (>= 60m post PTU)' : `HOLD! ${iodineTiming.minutesRemainingUntilSafe}m delay req`}
              </span>
              <span className="text-xs text-slate-400">
                Elapsed: {minutesElapsedSinceThionamide} min post-thionamide
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Substrate Risk:</span>
              <span className={`font-semibold ${iodineTiming.isSafeToAdministerIodine ? 'text-emerald-400' : 'text-rose-400'}`}>
                {iodineTiming.isSafeToAdministerIodine ? 'Blocked' : 'Jod-Basedow Trap'}
              </span>
            </div>
          </div>

          {/* Card 4: Multimodal 5-Stage Chain */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">5-Stage Blockade</span>
              <Pill className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-violet-300">
                {selectedThionamide} + {selectedBetaBlocker === 'PROPRANOLOL' ? 'Propranolol' : selectedBetaBlocker === 'ESMOLOL' ? 'Esmolol' : 'Diltiazem'}
              </span>
              <span className="text-xs text-slate-400">
                Steroid: {isStressDoseSteroidGiven ? 'Given' : 'Pending'} | Gut: {isCholestyramineGiven ? 'Active' : 'Off'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Coverage:</span>
              <span className="font-semibold text-emerald-400">
                {isThionamideAdministered && isStressDoseSteroidGiven && isBetaBlockerAdministered && isCholestyramineGiven ? 'Optimal 5/5' : 'Incomplete'}
              </span>
            </div>
          </div>

          {/* Card 5: Antipyretic & Safety */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Antipyretic Safeguard</span>
              <ShieldCheck className={`w-4 h-4 ${isAspirinAdministered ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isAspirinAdministered ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isAspirinAdministered ? 'LETHAL ASPIRIN ALERT!' : 'Acetaminophen / Cooling'}
              </span>
              <span className="text-xs text-slate-400">
                Core Temp: {temperatureFahrenheit.toFixed(1)} °F
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">TBG Status:</span>
              <span className={`font-semibold ${isAspirinAdministered ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isAspirinAdministered ? 'Displacement Spike' : 'Protected'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-thin">
          {[
            { id: 'SYNTHESIS', label: 'Clinical Synthesis & Protocol', icon: Layers },
            { id: 'BWPS_SCORE', label: 'Burch-Wartofsky Scoring Bench', icon: Activity },
            { id: 'AKAMIZU_CRITERIA', label: 'Japan Thyroid Association (Akamizu)', icon: ShieldAlert },
            { id: 'MULTIMODAL_PHARMACOTHERAPY', label: '5-Stage Multimodal Blockade', icon: Pill },
            { id: 'CRITICAL_PITFALLS', label: 'Aspirin Hazard & Cardiac Guardrails', icon: AlertTriangle },
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
                  <span>Critical Thyroid Storm Safety Interlocks Triggered</span>
                </div>
                {safetyInterlocks.map((interlock, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/40 text-xs md:text-sm text-rose-200 leading-relaxed font-medium">
                    {interlock}
                  </div>
                ))}
              </div>
            )}

            {/* Immediate Action Directives */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Immediate Action Checklist &amp; ICU Directives</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluation.immediateActionDirectives.map((action, idx) => (
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

            {/* 5-Stage Blockade Sequence Flowchart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>The 5-Stage Multimodal Pharmacotherapy Chain</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-2">
                  <span className="font-bold text-amber-400 text-xs uppercase">Step 1: Synthesis Block</span>
                  <p className="text-xs font-semibold text-white">PTU 500-1000 mg loading</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Blocks thyroid peroxidase (TPO) organification and inhibits peripheral 5-prime-deiodinase T4 to T3 conversion.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-2">
                  <span className="font-bold text-rose-400 text-xs uppercase">Step 2: Release Block</span>
                  <p className="text-xs font-semibold text-white">SSKI or Lugols (&ge; 60m later)</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Wolff-Chaikoff effect blocks preformed hormone release. MANDATORY &ge; 60-min delay to avoid Jod-Basedow substrate trap!
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                  <span className="font-bold text-emerald-400 text-xs uppercase">Step 3: Steroid Block</span>
                  <p className="text-xs font-semibold text-white">Hydrocortisone 100 mg q8h</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Blocks peripheral T4 to T3 conversion and protects against acute relative adrenal exhaustion.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-2">
                  <span className="font-bold text-cyan-400 text-xs uppercase">Step 4: Sympathetic Block</span>
                  <p className="text-xs font-semibold text-white">Propranolol or Esmolol</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Controls tachycardia (HR &lt; 100 bpm), tremors, and hyperpyrexia. High-dose propranolol additionally blocks T4 to T3.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-violet-500/40 bg-violet-950/20 space-y-2">
                  <span className="font-bold text-violet-400 text-xs uppercase">Step 5: Enterohepatic Block</span>
                  <p className="text-xs font-semibold text-white">Cholestyramine 4 g QID</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Traps free thyroid hormone in intestinal lumen, interrupting enterohepatic circulation and speeding clearance.
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical Pearls */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-base">
                <Sparkles className="w-5 h-5" />
                <span>Evidence-Based Clinical Pearls &amp; ATA Benchmarks</span>
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

        {/* Tab 2: Burch-Wartofsky Scoring Bench */}
        {activeTab === 'BWPS_SCORE' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  Burch-Wartofsky Point Scale (BWPS) Bench
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${bwpsTheme.badge}`}>
                  {bwps.totalScore} pts
                </span>
              </div>

              {/* Temperature */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Temperature (°F):</span>
                  <span className="font-bold text-amber-400">{temperatureFahrenheit.toFixed(1)} °F</span>
                </div>
                <input
                  type="range"
                  min={98.0}
                  max={106.0}
                  step={0.1}
                  value={temperatureFahrenheit}
                  onChange={(e) => setTemperatureFahrenheit(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>99-99.9 (5 pts)</span>
                  <span>100-101.9 (10-15 pts)</span>
                  <span>&ge; 104.0 (30 pts)</span>
                </div>
              </div>

              {/* CNS Dysfunction */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">CNS Effects</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'NONE', label: 'Absent (0 pts)' },
                    { id: 'MILD_AGITATION', label: 'Mild Agitation (10 pts)' },
                    { id: 'MODERATE_DELIRIUM_PSYCHOSIS', label: 'Delirium / Psychosis (20 pts)' },
                    { id: 'SEVERE_COMA_SEIZURES', label: 'Seizures / Coma (30 pts)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCnsDysfunction(opt.id as any)}
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

              {/* GI / Hepatic Dysfunction */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">GI-Hepatic Dysfunction</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'NONE', label: 'Absent (0 pts)' },
                    { id: 'MODERATE_DIARRHEA_NAUSEA_PAIN', label: 'Diarrhea / Pain (10 pts)' },
                    { id: 'SEVERE_JAUNDICE', label: 'Unexplained Jaundice (20 pts)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGiHepaticDysfunction(opt.id as any)}
                      className={`p-2 rounded-lg border text-left transition ${
                        giHepaticDysfunction === opt.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heart Rate & CHF */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Heart Rate (bpm):</span>
                  <span className="font-bold text-rose-400">{heartRateBpm} bpm</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={200}
                  step={1}
                  value={heartRateBpm}
                  onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>90-109 (5 pts)</span>
                  <span>120-139 (15-20 pts)</span>
                  <span>&ge; 140 (25 pts)</span>
                </div>
              </div>

              {/* Heart Failure Class */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Heart Failure Classification</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'NONE', label: 'Absent (0 pts)' },
                    { id: 'MILD_PEDAL_EDEMA', label: 'Mild Pedal Edema (5 pts)' },
                    { id: 'MODERATE_BASILAR_RALES', label: 'Bibasilar Rales (10 pts)' },
                    { id: 'SEVERE_PULMONARY_EDEMA', label: 'Frank Pulmonary Edema (15 pts)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCongestiveHeartFailure(opt.id as any)}
                      className={`p-2 rounded-lg border text-left transition ${
                        congestiveHeartFailure === opt.id
                          ? 'bg-blue-500/20 border-blue-500 text-blue-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AFib & Precipitant Toggles */}
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span>Atrial Fibrillation Present (+10 pts)</span>
                  <input
                    type="checkbox"
                    checked={hasAtrialFibrillation}
                    onChange={(e) => setHasAtrialFibrillation(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span>Precipitating Event History (Infection, DKA, Trauma, Iodine) (+10 pts)</span>
                  <input
                    type="checkbox"
                    checked={hasPrecipitatingHistory}
                    onChange={(e) => setHasPrecipitatingHistory(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                  />
                </label>
              </div>
            </div>

            {/* Score Visualization & Interpretation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-base">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <span>BWPS Score Breakdown by Organ System</span>
                  </div>
                  <span className="text-xs text-slate-400">Cutoffs: &ge; 45 Storm | 25-44 Impending</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bwpsBreakdownData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
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
                        {bwpsBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className={`p-4 rounded-xl border ${bwpsTheme.border} ${bwpsTheme.bg} space-y-2`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${bwpsTheme.text}`}>
                    Burch-Wartofsky Clinical Interpretation:
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                    {bwps.clinicalInterpretation}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Burch &amp; Wartofsky (Endocrinol Metab Clin North Am 1993): Empiric diagnostic score designed for maximal sensitivity to ensure early, aggressive therapeutic intervention.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Japan Thyroid Association (Akamizu Criteria) */}
        {activeTab === 'AKAMIZU_CRITERIA' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Japan Thyroid Association (Akamizu 2012) Diagnostic Bench</span>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Unlike the purely clinical Burch-Wartofsky score, the <strong>Japan Thyroid Association (JTA)</strong> criteria require biochemical confirmation of thyrotoxicosis (elevated free T4 or free T3) paired with specific combinations of organ dysfunctions.
              </p>

              {/* Lab Values Panel */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-400">Biochemical Confirmation:</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Free T4 (ng/dL):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={freeT4NgDl}
                      onChange={(e) => setFreeT4NgDl(Number(e.target.value))}
                      className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Total T3 (ng/dL):</label>
                    <input
                      type="number"
                      value={totalT3NgDl}
                      onChange={(e) => setTotalT3NgDl(Number(e.target.value))}
                      className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Akamizu Result Summary */}
              <div className={`p-4 rounded-xl border space-y-2 ${akamizu.category === 'TS1_DEFINITE_THYROID_STORM' ? 'bg-rose-950/30 border-rose-500/50' : akamizu.category === 'TS2_SUSPECTED_THYROID_STORM' ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950/80 border-slate-800'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${akamizu.category === 'TS1_DEFINITE_THYROID_STORM' ? 'text-rose-400' : 'text-amber-300'}`}>
                  Akamizu Diagnostic Result: {akamizu.category.replace(/_/g, ' ')}
                </span>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  {akamizu.criteriaSummary}
                </p>
              </div>
            </div>

            {/* Criteria Reference Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Info className="w-5 h-5 text-indigo-400" />
                  <span>JTA Diagnostic Algorithm Requirements</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-rose-400">TS1 (Definite Thyroid Storm):</span>
                    <p className="text-slate-300 mt-1">
                      Thyrotoxicosis PLUS:
                      <br />• CNS manifestation + at least 1 other feature (Fever &ge; 38°C, Tachycardia &ge; 130 bpm, CHF, or GI/Hepatic)
                      <br />• OR at least 3 non-CNS manifestations (Fever + Tachycardia + CHF or GI/Hepatic)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-amber-400">TS2 (Suspected Thyroid Storm):</span>
                    <p className="text-slate-300 mt-1">
                      Thyrotoxicosis PLUS:
                      <br />• CNS manifestation alone, or combination of 2 non-CNS organ dysfunctions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Akamizu et al. (Thyroid 2012): Japanese nationwide survey establishing objective diagnostic criteria with clinical validation against in-hospital outcomes.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 5-Stage Multimodal Pharmacotherapy */}
        {activeTab === 'MULTIMODAL_PHARMACOTHERAPY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thionamide & Iodine Timing Interlock */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Pill className="w-5 h-5 text-amber-400" />
                <span>Thionamide Selection &amp; Wolff-Chaikoff Iodine Timing</span>
              </div>

              {/* Thionamide Selection */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">First-Line Thionamide</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'PTU', label: 'Propylthiouracil (PTU - Preferred in Storm)' },
                    { id: 'METHIMAZOLE', label: 'Methimazole (MMI - Less Hepatotoxicity)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedThionamide(opt.id as ThionamideDrug)}
                      className={`p-3 rounded-lg border text-left transition ${
                        selectedThionamide === opt.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thionamide Details */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1.5">
                <span className="text-xs font-bold uppercase text-amber-300">Selected Dosing Regimen:</span>
                <p className="text-xs font-bold text-white">{pharmacotherapy.thionamideRegimen.doseString}</p>
                <p className="text-xs text-slate-300">{pharmacotherapy.thionamideRegimen.mechanism}</p>
              </div>

              {/* Iodine Delay Slider */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Minutes Elapsed Since Thionamide Administered:</span>
                  <span className={`font-bold ${minutesElapsedSinceThionamide >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {minutesElapsedSinceThionamide} min ({minutesElapsedSinceThionamide >= 60 ? 'Safe >= 60m' : 'HAZARD < 60m'})
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={120}
                  step={5}
                  value={minutesElapsedSinceThionamide}
                  onChange={(e) => setMinutesElapsedSinceThionamide(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0m (Concurrent = Lethal)</span>
                  <span>30m (Incomplete organification)</span>
                  <span>60m (Safe Wolff-Chaikoff)</span>
                </div>
              </div>

              {/* Iodine Status Banner */}
              <div className={`p-4 rounded-xl border space-y-2 ${iodineTiming.isSafeToAdministerIodine ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-rose-950/30 border-rose-500/50'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${iodineTiming.isSafeToAdministerIodine ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {iodineTiming.isSafeToAdministerIodine ? 'Safe Wolff-Chaikoff Release Blockade:' : 'JOD-BASEDOW SUBSTRATE HAZARD:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {iodineTiming.timingWarning || 'PTU has completely blocked follicular organification. Saturated solution of potassium iodide (SSKI 5 drops q6h) is now safe to administer.'}
                </p>
              </div>
            </div>

            {/* Steps 3, 4, 5: Steroids, Beta-Blockade, Gut Trapping */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <span>Peripheral Blockade &amp; Enterohepatic Trapping</span>
                </div>

                {/* Steroids */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-400">Step 3: Corticosteroids</span>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isStressDoseSteroidGiven}
                        onChange={(e) => setIsStressDoseSteroidGiven(e.target.checked)}
                        className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                      />
                      <span>Given</span>
                    </label>
                  </div>
                  <p className="text-xs font-bold text-emerald-300">{pharmacotherapy.steroidRegimen.doseString}</p>
                  <p className="text-xs text-slate-400">{pharmacotherapy.steroidRegimen.benefit}</p>
                </div>

                {/* Beta-Blockers */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Step 4: Beta-Adrenergic Antagonism</span>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    {[
                      { id: 'PROPRANOLOL', label: 'Propranolol' },
                      { id: 'ESMOLOL', label: 'Esmolol (ICU)' },
                      { id: 'DILTIAZEM_NON_BB', label: 'Diltiazem (Asthma)' },
                    ].map((bb) => (
                      <button
                        key={bb.id}
                        onClick={() => setSelectedBetaBlocker(bb.id as BetaBlockerDrug)}
                        className={`p-2 rounded-lg border text-left transition ${
                          selectedBetaBlocker === bb.id
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {bb.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 pt-1">{pharmacotherapy.betaBlockerRegimen.doseString}</p>
                  {pharmacotherapy.betaBlockerRegimen.cautionNote && (
                    <p className="text-xs text-amber-300 font-medium">{pharmacotherapy.betaBlockerRegimen.cautionNote}</p>
                  )}
                </div>

                {/* Bile Acid Sequestrant */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-400">Step 5: Enterohepatic Trapping</span>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCholestyramineGiven}
                        onChange={(e) => setIsCholestyramineGiven(e.target.checked)}
                        className="w-4 h-4 text-violet-500 rounded bg-slate-900 border-slate-700"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <p className="text-xs font-bold text-violet-300">{pharmacotherapy.bileAcidSequestrantRegimen.doseString}</p>
                  <p className="text-xs text-slate-400">{pharmacotherapy.bileAcidSequestrantRegimen.mechanism}</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Multimodal Chain Rule: Each of the 5 agents targets a distinct step in thyroid hormone synthesis, release, peripheral conversion, organ effect, and elimination.
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Critical Pitfalls & Antipyretic Hazards */}
        {activeTab === 'CRITICAL_PITFALLS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* The Aspirin Hazard Panel */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-slate-800 pb-3">
                <Ban className="w-5 h-5" />
                <span>The Aspirin TBG Displacement Trap</span>
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                Hyperthermia in thyroid storm frequently exceeds 104°F (40°C), tempting clinicians to order antipyretics. However, <strong>Aspirin and other salicylates are STRICTLY CONTRAINDICATED</strong>.
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-2">
                <span className="text-xs font-bold uppercase text-rose-400">Mechanism of Salicylate Toxicity:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Salicylates aggressively compete with thyroxine for binding sites on Thyroxine-Binding Globulin (TBG) and transthyretin, acutely displacing bound T4 and T3 and releasing a surge of free bioavailable active hormone that precipitates fatal ventricular arrhythmias.
                </p>
              </div>

              {/* Simulation Checkbox */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold text-slate-200">
                  Simulate: Aspirin / Salicylate Administered for Fever
                </span>
                <input
                  type="checkbox"
                  checked={isAspirinAdministered}
                  onChange={(e) => setIsAspirinAdministered(e.target.checked)}
                  className="w-5 h-5 text-rose-500 rounded bg-slate-900 border-slate-700 focus:ring-rose-500"
                />
              </label>

              {isAspirinAdministered ? (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lethal Free Hormone Spike Triggered</span>
                  </div>
                  <p className="text-xs text-rose-200 leading-relaxed font-medium">
                    {pharmacotherapy.antipyreticSafeguard.aspirinMechanismWarning}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                  <span className="text-xs font-bold uppercase text-emerald-300">Approved Antipyretic Protocol:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pharmacotherapy.antipyreticSafeguard.recommendedAntipyresis}
                  </p>
                </div>
              )}
            </div>

            {/* Reactive Airway & Heart Failure Pitfalls */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                  <Wind className="w-5 h-5 text-indigo-400" />
                  <span>Beta-Blocker Guardrails: Reactive Airway &amp; Low EF</span>
                </div>

                {/* Severe Asthma Toggle */}
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-200">
                    Patient Has Severe Active Asthma or COPD Bronchospasm
                  </span>
                  <input
                    type="checkbox"
                    checked={hasSevereAsthmaOrCopd}
                    onChange={(e) => setHasSevereAsthmaOrCopd(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700"
                  />
                </label>

                {hasSevereAsthmaOrCopd && selectedBetaBlocker === 'PROPRANOLOL' && (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-2">
                    <span className="text-xs font-bold uppercase text-rose-400">Bronchospasm Risk Alert:</span>
                    <p className="text-xs text-rose-200 leading-relaxed">
                      Propranolol is a non-selective beta-blocker that blocks pulmonary beta-2 receptors, risking fatal status asthmaticus. Switch immediately to cardioselective Esmolol or non-dihydropyridine CCB (Diltiazem).
                    </p>
                  </div>
                )}

                {/* Ejection Fraction Slider */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Left Ventricular Ejection Fraction (LVEF):</span>
                    <span className={`font-bold ${leftVentricularEjectionFractionPercent < 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {leftVentricularEjectionFractionPercent}% ({leftVentricularEjectionFractionPercent < 35 ? 'Depressed EF' : 'Preserved EF'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={65}
                    step={5}
                    value={leftVentricularEjectionFractionPercent}
                    onChange={(e) => setLeftVentricularEjectionFractionPercent(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&lt; 35% (Use ultra-short Esmolol)</span>
                    <span>50-65% (Standard Propranolol)</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                *Clinical Rule: When thyroid storm presents with pulmonary edema, distinguish high-output failure (tachycardia-driven) from low-output cardiogenic shock before giving massive beta-blocker doses.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
